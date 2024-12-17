$(document).ready(function () {
        function loadDbl() {
            let $table = $('#table_consulting_list')
            let urlDetail = $table.attr('data-url-detail');
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                reloadCurrency: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('consulting_list')) {
                            return resp.data['consulting_list'] ? resp.data['consulting_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                rowIdx: true,
                columns: [
                    {
                        targets: 0,
                        width: '1%',
                        render: (data, type, row, meta) => {
                            return ``
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            const link = urlDetail.replace('0', row.id);
                            const code = row?.['code'] ? row['code'] : '_'
                            return `<a href=${link} class="badge badge-primary w-7">${code}</a> ${$x.fn.buttonLinkBlank(link)}`
                        }
                    },
                    {
                        targets: 2,
                        width: '20%',
                        render: (data, type, row) => {
                            const link = urlDetail.replace('0', row.id);
                            return `<a href=${link} class="text-primary fw-bold">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 3,
                        width: '20%',
                        render: (data, type, row) => {
                            return `${row?.['customer']?.['title']}`
                        }
                    },
                    {
                        targets: 4,
                        width: '20%',
                        render: (data, type, row) => {
                            return `${row?.['employee_inherit']?.['full_name']}`
                        }
                    },
                    {
                        targets: 5,
                        width: '10%',
                        render: (data, type, row) => {
                            const date =  row?.['due_date'] ? moment(row?.['due_date'].split(' ')[0], 'YYYY-MM-DD').format('DD-MM-YYYY'): '';
                            return `${date}`
                        }
                    },
                    {
                        targets: 6,
                        width: '10%',
                        render: (data, type, row) => {
                            const value =  row?.['value'] ? row?.['value'] : '';
                            return `<span class="mask-money" data-init-money="${value}"></span>`
                        }
                    },
                    {
                        targets: 7,
                        width: '10%',
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#stt_sys').text())
                            let sttData = [
                                "light",
                                "primary",
                                "info",
                                "success",
                                "danger",
                            ]
                            return `<span class="badge badge-soft-${sttData[row?.['system_status']]}">${sttTxt[row?.['system_status']][1]}</span>`;
                        }
                    },
                ],
            });
        }

        loadDbl();

    });
