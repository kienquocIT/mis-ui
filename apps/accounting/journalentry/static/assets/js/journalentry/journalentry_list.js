$(document).ready(function() {
    function loadJEList() {
        if (!$.fn.DataTable.isDataTable('#je-table-list')) {
            let dtb = $('#je-table-list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: true,
                scrollY: '54vh',
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
})