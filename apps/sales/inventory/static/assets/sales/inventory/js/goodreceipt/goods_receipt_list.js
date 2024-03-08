
$(function () {
    $(document).ready(function () {

        let transEle = $('#app-trans-factory');

        function loadDbl() {
            let $table = $('#datable_goods_receipt_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('goods_receipt_list')) {
                            return resp.data['goods_receipt_list'] ? resp.data['goods_receipt_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columnDefs: [],
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            let link = $('#goods-receipt-link').data('link-update').format_url_with_uuid(row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover"><span class="badge badge-primary">${row?.['code']}</span></a>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            const link = $('#goods-receipt-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            let type_data = [
                                "badge badge-soft-warning",
                                "badge badge-soft-success",
                                "badge badge-soft-info",
                            ]
                            let typeTxt = JSON.parse($('#gr_type').text())
                            return `<span class="badge badge-${type_data[row?.['goods_receipt_type']]}">${typeTxt[row?.['goods_receipt_type']][1]}</span>`;
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            let type_data = [
                                "badge badge-soft-warning",
                                "badge badge-soft-success",
                                "badge badge-soft-info",
                            ]
                            let ele = `<span></span>`;
                            if (row?.['goods_receipt_type'] === 0) {
                                ele = `<span class="badge badge-${type_data[row?.['goods_receipt_type']]}">${row?.['purchase_order']?.['code']}</span>`;
                            } else if (row?.['goods_receipt_type'] === 1) {
                                ele = `<span class="badge badge-${type_data[row?.['goods_receipt_type']]}">${row?.['inventory_adjustment']?.['code']}</span>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            if (row?.['date_received']) {
                                return `<p>${moment(row?.['date_received']).format('DD/MM/YYYY')}</p>`;
                            }
                            return `<p></p>`;
                        }
                    },
                    {
                        targets: 5,
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
                        targets: 6,
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#goods-receipt-link').data('link-update').format_url_with_uuid(row?.['id']);
                            let isChange = ``;
                            if (![2, 3].includes(row?.['system_status'])) {
                                isChange = `<a class="dropdown-item" href="${link}">${transEle.attr('data-change')}</a><div class="dropdown-divider"></div>`;
                            }
                            return `<div class="dropdown">
                                    <i class="far fa-window-maximize" aria-expanded="false" data-bs-toggle="dropdown"></i>
                                    <div role="menu" class="dropdown-menu">
                                        ${isChange}
                                    </div>
                                </div>`;
                        },
                    }
                ],
                drawCallback: function () {},
            });
        }

        loadDbl();

    });
});