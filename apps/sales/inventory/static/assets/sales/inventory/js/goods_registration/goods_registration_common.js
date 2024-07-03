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
                    <span class="badge badge-pill badge-light w-20">${product?.['code']}</span> ${product?.['title']}
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
                "registered_data": registered_data,
            })
        }
    }
    let dtb = $('#tab_stock_quantity_datatable');
    dtb.DataTable().clear().destroy()
    let current_stock = 0
    let current_stock_value = 0
    dtb.DataTableDefault({
        dom: '',
        reloadCurrency: true,
        data: data_src_processed,
        columns: [
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    let color = row?.['registered_data']?.['stock_type'] === 1 ? 'primary' : 'danger'
                    return `<span class="small">${row?.['registered_data']?.['trans_title'] ? row?.['registered_data']?.['trans_title'] : ''} <span class="text-${color}">${row?.['registered_data']?.['trans_code']}</span></span>`;
                }
            },
            {
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    let color = row?.['registered_data']?.['stock_type'] === 1 ? 'primary' : 'danger'
                    return `<span class="badge badge-soft-${color}">${row?.['registered_data']?.['warehouse_code']}</span>`;
                }
            },
            {
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['lot_data']?.['lot_number']) {
                        return `<span class="text-blue fw-bold">${row?.['registered_data']?.['lot_data']?.['lot_number']}</span>`;
                    }
                    return ''
                }
            },
            {
                className: 'wrap-text text-right',
                render: (data, type, row) => {
                    return `${current_stock}`;
                }
            },
            {
                className: 'wrap-text text-right',
                render: (data, type, row) => {
                    return `<span class="mask-money" data-init-money="${current_stock_value}"></span>`;
                }
            },
            {
                className: 'wrap-text text-right',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['stock_type'] === 1) {
                        current_stock += row?.['registered_data']?.['quantity']
                        return `${row?.['registered_data']?.['quantity']}`;
                    }
                    return '-'
                }
            },
            {
                className: 'wrap-text text-right',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['stock_type'] === 1) {
                        current_stock_value += row?.['registered_data']?.['value']
                        return `<span class="mask-money" data-init-money="${row?.['registered_data']?.['value']}"></span>`;
                    }
                    return '-'
                }
            },
            {
                className: 'wrap-text text-right',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['stock_type'] === -1) {
                        current_stock -= row?.['registered_data']?.['quantity']
                        return `${row?.['registered_data']?.['quantity']}`;
                    }
                    return '-'
                }
            },
            {
                className: 'wrap-text text-right',
                render: (data, type, row) => {
                    if (row?.['registered_data']?.['stock_type'] === -1) {
                        current_stock_value -= row?.['registered_data']?.['value']
                        return `<span class="mask-money" data-init-money="${row?.['registered_data']?.['value']}"></span>`;
                    }
                    return '-'
                }
            },
            {
                className: 'wrap-text text-right',
                render: (data, type, row) => {
                    return `${current_stock}`;
                }
            },
            {
                className: 'wrap-text text-right',
                render: (data, type, row) => {
                    return `<span class="mask-money" data-init-money="${current_stock_value}"></span>`;
                }
            },
        ],
    });
}

$(document).on("click", '.this_registered_detail', function () {
    loadStockQuantityDataTable(JSON.parse($(this).find('script').text()))
})
