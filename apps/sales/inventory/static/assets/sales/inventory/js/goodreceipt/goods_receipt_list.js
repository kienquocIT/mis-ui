
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
                        width: '1%',
                        render: (data, type, row, meta) => {
                            return `<span class="table-row-order">${(meta.row + 1)}</span>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            let link = $('#goods-receipt-link').data('link-detail').format_url_with_uuid(row?.['id']);
                            return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '30%',
                        render: (data, type, row) => {
                            const link = $('#goods-receipt-link').data('link-detail').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 3,
                        width: '15%',
                        render: (data, type, row) => {
                            let typeTxt = JSON.parse($('#gr_type').text())
                            return `${typeTxt[row?.['goods_receipt_type']][1]}`;
                        }
                    },
                    {
                        targets: 4,
                        width: '10%',
                        render: (data, type, row) => {
                            let type_code = {
                                0: 'purchase_order_data',
                                1: 'inventory_adjustment_data',
                                2: 'production_order_data',
                            }
                            let type_link = {
                                0: 'link-detail-po',
                                1: 'link-detail-ia',
                                2: 'link-detail-pro',
                            }
                            const link = $('#goods-receipt-link').data(type_link[row?.['goods_receipt_type']]).format_url_with_uuid(row?.[type_code[row?.['goods_receipt_type']]]?.['id']);
                            return `<a href="${link}" class="underline_hover">${row?.[type_code[row?.['goods_receipt_type']]]?.['code']}</a>`
                        }
                    },
                    {
                        targets: 5,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['date_received']) {
                                return `<p>${moment(row?.['date_received']).format('DD/MM/YYYY')}</p>`;
                            }
                            return `<p>--</p>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '10%',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                    {
                        targets: 7,
                        width: '5%',
                        className: 'action-center',
                        render: (data, type, row) => {
                            let link = $('#goods-receipt-link').data('link-update').format_url_with_uuid(row?.['id']);
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
                drawCallback: function () {},
            });
        }

        loadDbl();

    });
});