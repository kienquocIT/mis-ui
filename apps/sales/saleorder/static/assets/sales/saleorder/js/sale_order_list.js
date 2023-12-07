
$(function () {
    $(document).ready(function () {

        function loadDbl() {
            let $table = $('#table_sale_order_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('sale_order_list')) {
                            return resp.data['sale_order_list'] ? resp.data['sale_order_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columnDefs: [
                    {
                        "width": "5%",
                        "targets": 0
                    }, {
                        "width": "15%",
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
                        "width": "10%",
                        "targets": 7,
                    },
                    {
                        "width": "5%",
                        "targets": 8,
                    },
                ],
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover"><span class="badge badge-soft-primary">${row?.['code']}</span></a>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row?.['id'])
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
                            return $x.fn.displayRelativeTime(data);
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
                            let status_data = {
                                "Draft": "badge badge-soft-light",
                                "Created": "badge badge-soft-primary",
                                "Added": "badge badge-soft-info",
                                "Finish": "badge badge-soft-success",
                                "Cancel": "badge badge-soft-danger",
                            }
                            return `<span class="${status_data[row?.['system_status']]}">${row?.['system_status']}</span>`;
                        }
                    },
                    {
                        targets: 7,
                        render: (data, type, row) => {
                            let $eleTrans = $('#trans-factory');
                            let status_data = {}
                            status_data[$eleTrans.attr('data-status-confirm')] = "badge badge-soft-light";
                            status_data[$eleTrans.attr('data-status-delivery')] = "badge badge-soft-warning";
                            status_data[$eleTrans.attr('data-status-partially')] = "badge badge-soft-info text-sky";
                            status_data[$eleTrans.attr('data-status-delivered')] = "badge badge-soft-success";
                            return `<span class="${status_data[row?.['delivery_status']]}">${row?.['delivery_status']}</span>`;
                        }
                    },
                    {
                        targets: 8,
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row?.['id'])
                            const $elmTrans = $('#trans-factory')
                            let isDelivery = ''
                            if (!row.delivery_call && ['Added', 'Finish'].includes(row?.['system_status']))
                                isDelivery = '<div class="dropdown-divider"></div>' +
                                    `<a class="dropdown-item" href="#" id="create_delivery">${$elmTrans.attr('data-delivery')}</a>`
                            return `<div class="dropdown">
                                    <i class="far fa-window-maximize" aria-expanded="false" data-bs-toggle="dropdown"></i>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item" href="${link}">${$elmTrans.attr('data-change')}</a>
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="#">${$('#base-trans-factory').attr('data-cancel')}</a>
                                        ${isDelivery}
                                    </div>
                                </div>`;
                        },
                    }
                ],
                rowCallback: (row, data) => {
                    $('#create_delivery', row).off().on('click', function () {
                        WindowControl.showLoading();
                        const url = $('#sale-order-link').attr('data-create-delivery').replace('1', data.id);
                        $.fn.callAjax(
                            url,
                            'POST', {}, true
                        ).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data?.['status'] === 200) {
                                    const config = data?.config
                                    let url_redirect = $('#sale-order-link').attr('data-delivery')
                                    if (config?.is_picking && !data?.['is_not_picking'])
                                        url_redirect = $('#sale-order-link').attr('data-picking')
                                    setTimeout(() => {
                                        window.location.href = url_redirect
                                    }, 1000);
                                }
                            },
                            (err) => {
                                WindowControl.hideLoading();
                                $.fn.notifyB({"description": err?.data?.errors, "timeout": 3500}, 'failure')
                            }
                        )
                    })
                },
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                },
            });
        }

        loadDbl();

    });
});