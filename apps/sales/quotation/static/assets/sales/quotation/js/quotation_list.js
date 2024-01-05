
$(function () {
    $(document).ready(function () {

        let transEle = $('#app-trans-factory');

        function loadDbl() {
            let $table = $('#table_quotation_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('quotation_list')) {
                            return resp.data['quotation_list'] ? resp.data['quotation_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columnDefs: [
                    {
                        "width": "10%",
                        "targets": 0
                    }, {
                        "width": "20%",
                        "targets": 1
                    }, {
                        "width": "20%",
                        "targets": 2
                    }, {
                        "width": "15%",
                        "targets": 3
                    }, {
                        "width": "10%",
                        "targets": 4
                    }, {
                        "width": "10%",
                        "targets": 5,
                    },
                    {
                        "width": "10%",
                        "targets": 6,
                    },
                    {
                        "width": "5%",
                        "targets": 7,
                    }
                ],
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            const link = $('#quotation-link').data('link-update').format_url_with_uuid(row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover"><span class="badge badge-soft-primary">${row?.['code']}</span></a>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            const link = $('#quotation-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row?.['customer']).length !== 0) {
                                ele = `<p>${row?.['customer']?.['title']}</p>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row?.['sale_person']).length !== 0) {
                                ele = `<p>${row?.['sale_person']?.['full_name']}</p>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 4,
                        data: "date_created",
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                            });
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['total_product'])}"></span>`
                        }
                    },
                    {
                        targets: 6,
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#stt_sys').text())
                            let sttData = [
                                "soft-light",
                                "soft-primary",
                                "soft-info",
                                "soft-success",
                                "soft-danger",
                            ]
                            return `<span class="badge badge-${sttData[row?.['system_status']]}">${sttTxt[row?.['system_status']][1]}</span>`;
                        }
                    },
                    {
                        targets: 7,
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#quotation-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<div class="dropdown">
                                    <i class="far fa-window-maximize" aria-expanded="false" data-bs-toggle="dropdown"></i>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item" href="${link}">${transEle.attr('data-change')}</a>
                                        <div class="dropdown-divider" hidden></div>
                                        <a class="dropdown-item" href="#" hidden>${transEle.attr('data-cancel')}</a>
                                    </div>
                                </div>`;
                        },
                    }
                ],
                drawCallback: function () {
                    loadDataRowTable();
                },
            });
        }

        function loadDataRowTable() {
            let $table = $('#table_quotation_list');
            // callBack Row to load data
            for (let i = 0; i < $table[0].tBodies[0].rows.length; i++) {
                // mask money
                $.fn.initMaskMoney2();
            }
        }

        loadDbl();

    });
});