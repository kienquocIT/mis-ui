
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
                autoWidth: true,
                scrollX: true,
                columns: [  // 150, 250, 250, 200, 150, 200, 100, 100, 100 (1500p)
                    {
                        targets: 0,
                        width: '10%',
                        render: (data, type, row) => {
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover"><span class="badge badge-primary">${row?.['code']}</span></a>`
                        }
                    },
                    {
                        targets: 1,
                        width: '16.66%',
                        render: (data, type, row) => {
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 2,
                        width: '16.66%',
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
                        width: '13.33%',
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
                        width: '10%',
                        data: "date_created",
                        render: (data) => {
                            return $x.fn.displayRelativeTime(data);
                        }
                    },
                    {
                        targets: 5,
                        width: '13.33%',
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['indicator_revenue'])}"></span>`
                        }
                    },
                    {
                        targets: 6,
                        width: '6.66%',
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#stt_sys').text())
                            let sttData = [
                                "soft-light",
                                "soft-primary",
                                "soft-info",
                                "soft-success",
                                "soft-danger",
                            ]
                            return `<div class="row"><span class="badge badge-${sttData[row?.['system_status']]}">${sttTxt[row?.['system_status']][1]}</span></div>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '6.66%',
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#delivery_status').text())
                            let sttData = [
                                "soft-light",
                                "soft-warning",
                                "soft-info text-sky",
                                "soft-success",
                            ]
                            return `<div class="row"><span class="badge badge-${sttData[row?.['delivery_status']]}">${sttTxt[row?.['delivery_status']][1]}</span></div>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '6.66%',
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row?.['id']);
                            const $elmTrans = $('#trans-factory')
                            let isChange = ``;
                            let isDelivery = ``;
                            if (![2, 3].includes(row?.['system_status'])) {
                                isChange = `<a class="dropdown-item" href="${link}">${$elmTrans.attr('data-change')}</a><div class="dropdown-divider"></div>`;
                            }
                            if (!row.delivery_call && [2, 3].includes(row?.['system_status'])) {
                                isDelivery = `<a class="dropdown-item" href="#" id="create_delivery">${$elmTrans.attr('data-delivery')}</a>`;
                            }
                            return `<div class="dropdown">
                                    <i class="far fa-window-maximize" aria-expanded="false" data-bs-toggle="dropdown"></i>
                                    <div role="menu" class="dropdown-menu">
                                        ${isChange}
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