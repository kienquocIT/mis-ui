$(function () {
    $(document).ready(function () {

        let transEle = $('#app-trans-factory');

        function loadDbl() {
            let $table = $('#table_quotation_list')
            let frm = new SetupFormSubmit($table);
            let changeList = [];
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
                autoWidth: true,
                scrollX: true,
                pageLength: 10,
                columns: [  // (1280p)
                    {
                        targets: 0,
                        width: '1%',
                        render: (data, type, row, meta) => {
                            return `<span class="table-row-order">${(meta.row + 1)}</span>`
                        }
                    },
                    {
                        targets: 1,
                        width: '5%',
                        render: (data, type, row) => {
                            let link = $('#quotation-link').data('link-detail').format_url_with_uuid(row?.['id']);
                            if (row?.['code']) {
                                if (row?.['is_change'] === true && row?.['document_root_id']) {
                                    return `<div class="row"><a href="${link}" class="link-primary underline_hover"><span class="badge-parent badge-parent-primary">${row?.['code']} <span class="badge-child badge-child-blue">CR</span></span></a></div`;
                                }
                                return `<div class="row"><a href="${link}" class="link-primary underline_hover"><span class="badge-parent badge-parent-primary">${row?.['code']}</span></a></div>`;
                            }
                            return `<a href="${link}" class="link-primary underline_hover">--</a>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '17%',
                        render: (data, type, row) => {
                            const link = $('#quotation-link').data('link-detail').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 3,
                        width: '17%',
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row?.['customer']).length !== 0) {
                                ele = `<p>${row?.['customer']?.['title']}</p>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 4,
                        width: '15%',
                        render: (data, type, row) => {
                            if (Object.keys(row?.['sale_person']).length !== 0) {
                                return `<p>${row?.['sale_person']?.['full_name']}</p>`;
                            }
                            return `<p></p>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '12%',
                        data: "date_created",
                        render: (data) => {
                            return $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                            });
                        }
                    },
                    {
                        targets: 6,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['indicator_revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '10%',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                    {
                        targets: 8,
                        width: '5%',
                        className: 'action-center',
                        render: (data, type, row) => {
                            let link = $('#quotation-link').data('link-update').format_url_with_uuid(row?.['id']);
                            let disabled = '';
                            if ([2, 3, 4].includes(row?.['system_status'])) {
                                disabled = 'disabled';
                            }
                            return `<div class="dropdown">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-lg" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item ${disabled}" href="${link}"><i class="dropdown-icon far fa-edit"></i><span>${transEle.attr('data-edit')}</span></a>
                                    </div>
                                </div>`;
                        },
                    }
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                },
            });
        }

        loadDbl();

    });
});
