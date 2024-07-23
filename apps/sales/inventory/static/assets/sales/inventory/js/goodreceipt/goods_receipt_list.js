
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
                pageLength:50,
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            let link = $('#goods-receipt-link').data('link-update').format_url_with_uuid(row?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover"><span class="badge badge-primary">${row?.['code']}</span></a>`;
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            const link = $('#goods-receipt-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            let type_data = [
                                "primary badge-outline",
                                "blue badge-outline",
                            ]
                            let typeTxt = JSON.parse($('#gr_type').text())
                            return `<span class="badge badge-${type_data[row?.['goods_receipt_type']]}">${typeTxt[row?.['goods_receipt_type']][1]}</span>`;
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            let type_data = [
                                "primary",
                                "blue",
                            ]
                            let type_code = {
                                0: 'purchase_order',
                                1: 'inventory_adjustment',
                            }
                            return `<span class="badge badge-soft-${type_data[row?.['goods_receipt_type']]}">${row?.[type_code[row?.['goods_receipt_type']]]?.['code']}</span>`;
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            if (row?.['date_received']) {
                                return `<p>${moment(row?.['date_received']).format('DD/MM/YYYY')}</p>`;
                            }
                            return `<p>--</p>`;
                        }
                    },
                    {
                        targets: 5,
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
                    {
                        targets: 6,
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#goods-receipt-link').data('link-update').format_url_with_uuid(row?.['id']);
                            let isEdit = ``;
                            if (![2, 3, 4].includes(row?.['system_status'])) {
                                isEdit = `<a class="dropdown-item" href="${link}"><i class="dropdown-icon far fa-edit text-primary"></i><span>${transEle.attr('data-change')}</span></a>`;
                            }
                            return `<div class="dropdown">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-lg" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                    <div role="menu" class="dropdown-menu">
                                        ${isEdit}
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