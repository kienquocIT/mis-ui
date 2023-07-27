
$(function () {
    $(document).ready(function () {

        function loadDbl() {
            let $table = $('#table_sale_order_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
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
                        "width": "15%",
                        "targets": 5,
                    },
                    {
                        "width": "5%",
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
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row.id);
                            return `<a href="${link}" target="_blank" class="link-primary underline_hover"><span class="badge badge-soft-primary">${row.code}</span></a>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row.id)
                            return `<a href="${link}" target="_blank" class="link-primary underline_hover">${row.title}</a>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row.customer).length !== 0) {
                                ele = `<p>${row.customer.title}</p>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row.sale_person).length !== 0) {
                                ele = `<p>${row.sale_person.full_name}</p>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            let date_created = moment(row.date_created).format('YYYY-MM-DD');
                            return `<p>${date_created}</p>`
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row.total_product)}"></span>`
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
                            return `<span class="${status_data[row.system_status]}">${row.system_status}</span>`;
                        }
                    },
                    {
                        targets: 7,
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row.id)
                            const $elmTrans = $('#trans-factory')
                            let isDelivery = ''
                            if (!row.delivery_call)
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
                                    let url_redirect = config?.is_picking ? $('#sale-order-link').attr('data-picking') :
                                        $('#sale-order-link').attr('data-delivery')
                                    setTimeout(() => {
                                        window.location.href = url_redirect
                                    }, 1000);
                                }
                            },
                            (errs) => {
                                WindowControl.hideLoading();
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