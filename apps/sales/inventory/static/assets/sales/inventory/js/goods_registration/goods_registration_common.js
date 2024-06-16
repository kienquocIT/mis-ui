const dateEle = $('#date')
const saleOrderEle = $('#sale-order')
const salePersonEle = $('#sale-person')
const tab_line_detail_datatable = $('#tab_line_detail_datatable')

function LoadSaleOrder(data) {
    saleOrderEle.initSelect2({
        data: data,
        keyId: 'id',
        keyText: 'title',
    })
}

function LoadSalePerson(data) {
    salePersonEle.initSelect2({
        data: data,
        keyId: 'id',
        keyText: 'fullname',
    })
}

function LoadLineDetailTable(data) {
    for (const row of data) {
        let row_data = JSON.stringify([row])
        let product = row?.['so_item']?.['product']
        let uom = row?.['so_item']?.['uom']
        let total_order = row?.['so_item']?.['total_order']
        let this_registered = row?.['this_registered']
        let this_others = row?.['this_others']
        let this_available = row?.['this_available']
        let out_registered = row?.['out_registered']
        let out_delivered = row?.['out_delivered']
        let out_remain = row?.['out_remain']
        tab_line_detail_datatable.find('tbody').append(`
            <tr>
                <td class="border-1 text-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="${product?.['description']}">
                    <span class="badge badge-sm badge-secondary">${product?.['code']}</span> ${product?.['title']}
                </td>
                <td class="border-1 text-primary"><span>${uom?.['title']}</span></td>
                <td class="border-1 text-primary">${total_order}</td>
                <td class="border-1 text-primary">
                    ${this_registered}
                    <button data-bs-toggle="modal" data-bs-target="#this_registered_detail_modal" type="button" class="this_registered_detail btn btn-icon btn-flush-primary flush-soft-hover btn-sm">
                        <script>${row_data}</script>
                        <span class="icon"><i class="bi bi-three-dots"></i></span>
                    </button>
                </td>
                <td class="border-1 text-primary">
                    ${this_others}
                    <button type="button" class="this_others_detail btn btn-icon btn-flush-primary flush-soft-hover btn-sm">
                        <span class="icon"><i class="bi bi-three-dots"></i></span>
                    </button>
                </td>
                <td class="border-1 text-primary">${this_available}</td>
                <td class="border-1 text-primary">${out_registered}</td>
                <td class="border-1 text-primary">${out_delivered}</td>
                <td class="border-1 text-primary">${out_remain}</td>
            </tr>
        `)
    }
}

class GoodsRegistrationHandle {
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = $('#title').val()

        return frm
    }
}

function Disable(option) {
    if (option === 'detail') {
        $('.form-control').prop('disabled', true).css({color: 'black'});
        $('.form-select').prop('disabled', true).css({color: 'black'});
        $('.select2').prop('disabled', true);
    }
}

function LoadDetailGoodsRegistration(option) {
    let url_loaded = $('#frm_goods_registration_detail').attr('data-url')
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['good_registration_detail'];
                $x.fn.renderCodeBreadcrumb(data);

                $('#title').val(data?.['title'])
                dateEle.val(moment(data?.['date_created'].split(' ')[0]).format('DD/MM/YYYY'))
                LoadSaleOrder(data?.['sale_order'])
                LoadSalePerson(data?.['sale_order']?.['sale_person'])
                LoadLineDetailTable(data?.['data_line_detail'])

                Disable(option);
            }
        })
}

function loadStockQuantityDataTable(data_src=[]) {
    let data_src_processed = []
    for (const item of data_src) {
        for (const registered_data of item?.['registered_data']) {
            data_src_processed.push({
                "so_code": item?.['so_code'],
                "so_item": item?.['so_item'],
                "this_registered": item?.['this_registered'],
                "this_others": item?.['this_others'],
                "this_available": item?.['this_available'],
                "this_registered_value": item?.['this_registered_value'],
                "this_others_value": item?.['this_others_value'],
                "this_available_value": item?.['this_available_value'],
                "registered_data": registered_data,
                "out_registered": item?.['out_registered'],
                "out_delivered": item?.['out_delivered'],
                "out_remain": item?.['out_remain'],
                "out_registered_value": item?.['out_registered_value'],
                "out_delivered_value": item?.['out_delivered_value'],
                "out_remain_value": item?.['out_remain_value'],
                "current_stock": item?.['current_stock'],
                "current_stock_value": item?.['current_stock_value'],
            })
        }
    }
    console.log(data_src_processed)
    let dtb = $('#tab_stock_quantity_datatable');
    dtb.DataTable().clear().destroy()
    let current_stock = 0
    let current_stock_value = 0
    dtb.DataTableDefault({
        reloadCurrency: true,
        data: data_src_processed,
        columns: [
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    return `<span class="badge badge-primary">${row?.['so_code']}</span>`;
                }
            },
            {
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<span class="small">${row?.['registered_data']?.['goods_receipt'] ? 'Goods Receipt' : ''} <span class="text-primary">${row?.['registered_data']?.['goods_receipt']?.['code']}</span></span>`;
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['lot_data']?.['lot_id']) {
                        return `<span class="text-blue fw-bold">${row?.['registered_data']?.['lot_data']?.['lot_number']}</span>`;
                    }
                    return ''
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    return `${current_stock}`;
                }
            },
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money" data-init-money="${current_stock_value}"></span>`;
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['goods_receipt'] || row?.['registered_data']?.['goods_return'] || row?.['registered_data']?.['transfer_in']) {
                        if (row?.['registered_data']?.['lot_data']?.['lot_id']) {
                            current_stock += row?.['registered_data']?.['lot_data']?.['lot_quantity']
                            return `${row?.['registered_data']?.['lot_data']?.['lot_quantity']}`;
                        }
                        current_stock += row?.['this_registered']
                        return `${row?.['this_registered']}`;
                    }
                    return '-'
                }
            },
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['goods_receipt'] || row?.['registered_data']?.['goods_return'] || row?.['registered_data']?.['transfer_in']) {
                        if (row?.['registered_data']?.['lot_data']?.['lot_id']) {
                            let this_registered_value = parseFloat(row?.['current_stock_value']) * row?.['registered_data']?.['lot_data']?.['lot_quantity'] / parseFloat(row?.['current_stock'])
                            current_stock_value += this_registered_value
                            return `<span class="mask-money" data-init-money="${this_registered_value}"></span>`;
                        }
                        current_stock_value += row?.['this_registered_value']
                        return `<span class="mask-money" data-init-money="${row?.['this_registered_value']}"></span>`;
                    }
                    return '-'
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['delivery'] || row?.['registered_data']?.['transfer_out']) {
                        if (row?.['registered_data']?.['lot_data']?.['lot_id']) {
                            current_stock -= row?.['registered_data']?.['lot_data']?.['lot_quantity']
                            return `${row?.['registered_data']?.['lot_data']?.['lot_quantity']}`;
                        }
                        current_stock -= row?.['this_registered']
                        return `${row?.['this_registered']}`;
                    }
                    return '-'
                }
            },
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['delivery'] || row?.['registered_data']?.['transfer_out']) {
                        return `<span class="mask-money" data-init-money="${row?.['this_registered_value']}"></span>`;
                    }
                    return '-'
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['lot_data']?.['lot_id']) {
                        return `${current_stock}`;
                    }
                    return `${row?.['current_stock']}`;
                }
            },
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['lot_data']?.['lot_id']) {
                        return `<span class="mask-money" data-init-money="${current_stock_value}"></span>`;
                    }
                    return `<span class="mask-money" data-init-money="${row?.['current_stock_value']}"></span>`;
                }
            },
        ],
    });
}

$(document).on("click", '.this_registered_detail', function () {
    loadStockQuantityDataTable(JSON.parse($(this).find('script').text()))
})
