$(document).ready(function () {
    function loadJEList() {
        if (!$.fn.DataTable.isDataTable('#je-table-list')) {
            let dtb = $('#je-table-list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '50vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        export_inventory_data_list = resp?.['data']?.['journal_entry_list']
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['journal_entry_list'] ? resp.data['journal_entry_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                            let je_state_class = ['badge badge-pill badge-outline badge-soft-secondary', 'badge badge-pill badge-outline badge-soft-success', 'badge badge-pill badge-outline badge-soft-orange'][data?.['je_state']]
                            return `<div class="d-flex"><a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a><h5><span class="ml-1 badge-sm ${je_state_class}">${data?.['je_state_parsed']}</span></h5></div>`;
                        }
                    },
                    {
                        className: 'w-20',
                        render: (data, type, row) => {
                            return `<span class="mr-1">${row?.['original_transaction_parsed']}</span><span class="fw-bold bflow-mirrow-badge-sm">${(row?.['je_transaction_data'] || {})?.['code'] || ''}</span>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-15',
                        render: (data, type, row) => {
                            return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'w-20',
                        render: (data, type, row) => {
                            let total_debit = parseFloat(row?.['total_debit'] || 0)
                            let total_credit = parseFloat(row?.['total_credit'] || 0)
                            return `<span class="mask-money" data-init-money="${total_debit}"></span> - <span class="mask-money" data-init-money="${total_credit}"></span>`;
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            let total_debit = parseFloat(row?.['total_debit'] || 0)
                            let total_credit = parseFloat(row?.['total_credit'] || 0)
                            return total_debit === total_credit ? `<span class="text-success h6">${$.fn.gettext('Balanced')}</span>` : `<span class="text-danger h6">${$.fn.gettext('Imbalance')}</span>`;
                        }
                    },
                    {
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status'], row?.['system_auto_create']);
                        }
                    },
                ],
                initComplete: function () {
                    let dataParam = {}
                    let ajax = $.fn.callAjax2({
                        url: dtb.attr('data-url-summarize'),
                        data: dataParam,
                        method: 'GET'
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && typeof data === 'object' && data.hasOwnProperty('journal_entry_summarize')) {
                                return data?.['journal_entry_summarize'];
                            }
                            return {};
                        },
                        (errs) => {
                            console.log(errs);
                        }
                    )

                    Promise.all([ajax]).then(
                        (results) => {
                            // console.log(results[0])
                            $('#summarize-total-je').text(results[0]?.['summarize_total_je'] || 0)
                            $('#summarize-total-debit').attr('data-init-money', results[0]?.['summarize_total_debit'] || 0)
                            $('#summarize-total-credit').attr('data-init-money', results[0]?.['summarize_total_credit'] || 0)
                            $('#summarize-total-source-type').text(results[0]?.['summarize_total_source_type'] || 0)
                            $.fn.initMaskMoney2()
                        });
                }
            })
        }
    }

    loadJEList();

    let export_inventory_data_list = []

    function ExportExcel() {
        let parseData = []
        export_inventory_data_list.forEach(function (data, index) {
            let dateCreated = '';
            if (data?.['date_created']) {
                let d = new Date(data['date_created']);
                let day = String(d.getDate()).padStart(2, '0');
                let month = String(d.getMonth() + 1).padStart(2, '0');
                let year = d.getFullYear();
                dateCreated = `${day}/${month}/${year}`;
            }

            parseData.push({
                "Mã": `${data?.['code'] || ''} - ${data?.['je_state_parsed'] || ''}`,
                "Giao dịch gốc": `${data?.['original_transaction_parsed']} ${data?.['je_transaction_data']?.['code']}`,
                "Người tạo": data?.['employee_created']?.['full_name'] || '',
                "Ngày tạo": dateCreated,
                "Tổng bên nợ": data?.['total_debit'],
                "Tổng bên có": data?.['total_credit'],
                "Trạng thái": data?.['total_debit'] === data?.['total_credit'] ? 'Đã cân bằng' : 'Chưa cân bằng',
                "TT Hệ thống": data?.['system_auto_create'] ? 'Tạo tự động' : ''
            })
        })

        const worksheet = XLSX.utils.json_to_sheet(parseData);

        const colWidths = Object.keys(parseData[0]).map(key => {
            const maxLength = Math.max(
                key.length,
                ...parseData.map(row => String(row[key] || "").length)
            );
            return {wch: maxLength + 2};
        });
        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, "_");
        XLSX.writeFile(workbook, `journal_entry_list_${timestamp}.xlsx`);
    }

    $('#btn-export-to-excel').on('click', function () {
        ExportExcel()
    })
})