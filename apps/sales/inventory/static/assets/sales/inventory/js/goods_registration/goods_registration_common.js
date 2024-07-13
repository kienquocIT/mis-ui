const script_url = $('#script-url')
const script_trans = $('#script-trans')

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
        let product = row?.['so_item']?.['product']
        let uom = row?.['so_item']?.['uom']
        let string_uom = JSON.stringify([uom])
        let base_uom = row?.['so_item']?.['base_uom']
        let string_base_uom = JSON.stringify([base_uom])
        let total_order = row?.['so_item']?.['total_order']
        let this_registered = row?.['this_registered']
        let this_registered_borrowed = row?.['this_registered_borrowed']
        let this_available = row?.['this_available']
        let out_registered = row?.['out_registered']
        let out_available = row?.['out_available']
        let row_html = $(`
            <tr>
                <td class="border-1 text-primary" data-bs-toggle="tooltip" data-bs-placement="top" title="${product?.['description']}">
                    <span class="badge badge-pill badge-light w-20">${product?.['code']}</span> ${product?.['title']}
                </td>
                <td class="border-1 text-primary"><span>${uom?.['title']}</span></td>
                <td class="border-1 text-primary">${total_order}</td>
                <td class="border-1 text-primary fw-bold">
                    ${this_registered}
                    <button data-gre-item-id="${row?.['id']}" data-bs-toggle="modal" data-bs-target="#this_registered_detail_modal" type="button" class="this_registered_detail btn btn-icon btn-flush-secondary flush-soft-hover btn-sm">
                        <span class="icon"><i class="bi bi-three-dots"></i></span>
                    </button>
                </td>
                <td class="border-1 text-primary fw-bold">
                   ${this_registered_borrowed}
                </td>
                <td class="border-1 text-primary fw-bold">${this_available}</td>
                <td class="border-1 text-primary fw-bold">
                    ${out_registered}
                    <button data-product-id="${product?.['id']}"
                            data-gre-item-id="${row?.['id']}"
                            data-bs-toggle="modal"
                            data-bs-target="#out_registered_detail_modal"
                            type="button"
                            class="out_registered_detail btn btn-icon btn-flush-secondary flush-soft-hover btn-sm"
                    >
                    <script class="string_uom">${string_uom}</script>
                    <script class="string_base_uom">${string_base_uom}</script>
                        <span class="icon"><i class="bi bi-three-dots"></i></span>
                    </button>
                </td>
                <td class="border-1 text-primary fw-bold">0</td>
                <td class="border-1 text-primary fw-bold">${out_available}</td>
            </tr>
        `)
        tab_line_detail_datatable.find('tbody').append(row_html)
    }
}

function Disable(option) {
    if (option === 'detail') {
        $('#frm_goods_registration_detail .form-control').prop('disabled', true).css({color: 'black'});
        $('#frm_goods_registration_detail .form-select').prop('disabled', true).css({color: 'black'});
        $('#frm_goods_registration_detail .select2').prop('disabled', true);
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

function loadStockQuantityDataTable(gre_item_id) {
    let dataParam = {'gre_item_id': gre_item_id}
    let ajax = $.fn.callAjax2({
        url: script_url.attr('data-url-gre-item-sub-list'),
        data: dataParam,
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('goods_registration_item_sub_list')) {
                return data?.['goods_registration_item_sub_list'];
            }
            return {};
        },
        (errs) => {
            console.log(errs);
        }
    )

    Promise.all([ajax]).then(
        (results) => {
            let dtb = $('#tab_stock_quantity_datatable');
            dtb.DataTable().clear().destroy()
            let current_stock = 0
            let current_stock_value = 0
            dtb.DataTableDefault({
                dom: '',
                reloadCurrency: true,
                data: results[0],
                paging: false,
                columns: [
                    {
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            let color = row?.['stock_type'] === 1 ? 'primary' : 'danger'
                            return `<span class="small">${row?.['trans_title'] ? row?.['trans_title'] : ''} <span class="text-${color}">${row?.['trans_code']}</span></span>`;
                        }
                    },
                    {
                        className: 'wrap-text text-center',
                        render: (data, type, row) => {
                            let color = row?.['stock_type'] === 1 ? 'primary' : 'danger'
                            return `<span class="badge badge-soft-${color}">${row?.['warehouse']?.['code']}</span>`;
                        }
                    },
                    {
                        className: 'wrap-text text-center',
                        render: (data, type, row) => {
                            if (row?.['lot_mapped']?.['lot_number']) {
                                return `<span class="text-blue fw-bold small"><i class="bi bi-bookmark-fill"></i>&nbsp;${row?.['lot_mapped']?.['lot_number']}</span>`;
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
                            if (row?.['stock_type'] === 1) {
                                current_stock += row?.['quantity']
                                return `${row?.['quantity']}`;
                            }
                            return '-'
                        }
                    },
                    {
                        className: 'wrap-text text-right',
                        render: (data, type, row) => {
                            if (row?.['stock_type'] === 1) {
                                current_stock_value += row?.['value']
                                return `<span class="mask-money" data-init-money="${row?.['value']}"></span>`;
                            }
                            return '-'
                        }
                    },
                    {
                        className: 'wrap-text text-right',
                        render: (data, type, row) => {
                            if (row?.['stock_type'] === -1) {
                                current_stock -= row?.['quantity']
                                return `${row?.['quantity']}`;
                            }
                            return '-'
                        }
                    },
                    {
                        className: 'wrap-text text-right',
                        render: (data, type, row) => {
                            if (row?.['stock_type'] === -1) {
                                current_stock_value -= row?.['value']
                                return `<span class="mask-money" data-init-money="${row?.['value']}"></span>`;
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
        })
}

$(document).on("click", '.this_registered_detail', function () {
    loadStockQuantityDataTable($(this).attr('data-gre-item-id'))
})





// js cho mượn hàng (những hàm cho mượn hàng sẽ có hậu tố Borrow)

// general stock
const available_amount = $('#available-amount')
const uom_stock = $('#uom-stock')
const reserve_amount = $('reserve-amount')
// other project
const other_so = $('#other-so')
const so_available_amount = $('#so-available-amount')
const uom_so = $('#uom-so')
const so_reserve_amount = $('#so-reserve-amount')
const frm_borrow_from_other = $('#frm_borrow_from_other')
const frm_borrow_from_other_row = $('#frm_borrow_from_other_row')

let current_gre_item_id = null
let borrow_row = null

class GoodsRegistrationBorrowHandle {
    combinesData(frmEle, row=null, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle))

        if (row) {
            let row_save_btn = row.find('.so-available-save')
            frm.dataForm['sale_order_destination_id'] = row_save_btn.attr('data-sale-order-destination-id')
            frm.dataForm['goods_registration_source'] = $.fn.getPkDetail();
            frm.dataForm['gre_item_source'] = current_gre_item_id
            frm.dataForm['quantity'] = parseFloat(row.find('.so-available-input').val()) - parseFloat(row.find('.so-available-input').attr('data-raw-value'))
            frm.dataForm['uom'] = row_save_btn.attr('data-uom')
        }
        else {
            frm.dataForm['sale_order_destination_id'] = other_so.val()
            frm.dataForm['goods_registration_source'] = $.fn.getPkDetail();
            frm.dataForm['gre_item_source'] = current_gre_item_id
            frm.dataForm['quantity'] = so_reserve_amount.val()
            frm.dataForm['uom'] = uom_so.val()
        }

        return {
            url: frmEle.attr('data-url'),
            method: 'POST',
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}

function loadStockQuantityOtherDataTableBorrow() {
    let dtb = $('#tab_stock_quantity_other_datatable');
    dtb.DataTable().clear().destroy()
    dtb.DataTableDefault({
        dom: '',
        reloadCurrency: true,
        paging: false,
        ajax: {
            url: script_url.attr('data-url-gre-item-borrow-list') +
                `?goods_registration_source_id=${$.fn.getPkDetail()}` +
                `&gre_item_source_id=${current_gre_item_id}`
            ,
            type: "GET",
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    return resp.data['goods_registration_borrow_list'] ? resp.data['goods_registration_borrow_list'] : [];
                }
                return [];
            },
        },
        columns: [
            {
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    return `<span class="text-primary fw-bold"><i class="bi bi-clipboard-check"></i>&nbsp;${row?.['sale_order']?.['code']}</span>`
                }
            },
            {
                className: 'wrap-text w-10 text-center',
                render: (data, type, row) => {
                    return `<span>${row?.['uom']?.['title']}</span>`;
                }
            },
            {
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    return `<span>${row?.['quantity']}</span>`;
                }
            },
            {
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    return `<span>${row?.['quantity'] - row?.['available']}</span>`;
                }
            },
            {
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    return `<input type="number" min="0" readonly
                                   class="form-control text-center so-available-input"
                                   data-raw-value="${row?.['available']}"
                                   value="${row?.['available']}">`;
                }
            },
            {
                className: 'wrap-text w-10 text-center',
                render: (data, type, row) => {
                    return `
                        <button type="button" class="btn btn-soft-danger btn-xs so-available-change">${script_trans.attr('data-trans-change')}</button>
                        <button hidden
                                type="submit"
                                form="frm_borrow_from_other_row"
                                class="btn btn-soft-primary btn-xs so-available-save"
                                data-sale-order-destination-id="${row?.['sale_order']?.['id']}"
                                data-uom="${row?.['uom']?.['id']}"
                        >
                            ${script_trans.attr('data-trans-save')}
                        </button>
                    `;
                }
            }
        ]
    });
}

$(document).on("click", '.out_registered_detail', function () {
    current_gre_item_id = $(this).attr('data-gre-item-id')
    available_amount.val('')
    uom_stock.empty()
    reserve_amount.val('')
    other_so.empty()
    so_available_amount.val('')
    uom_so.empty()
    so_reserve_amount.val('')
    loadStockQuantityOtherDataTableBorrow()
    LoadProjectBorrow(
        null,
        $(this).attr('data-product-id'),
        JSON.parse($(this).find('.string_uom').text()),
        JSON.parse($(this).find('.string_base_uom').text())
    )
})

$(document).on("click", '.so-available-change', function () {
    $(this).closest('tr').find('.so-available-input').prop('readonly', false)
    $(this).closest('tr').find('.so-available-save').prop('hidden', false)
    $(this).prop('hidden', true)
})

$(document).on("click", '.so-available-save', function () {
    $(this).closest('tr').find('.so-available-input').prop('readonly', true)
    $(this).closest('tr').find('.so-available-change').prop('hidden', false)
    $(this).prop('hidden', true)
})

$('input[name="regis_from"]').on('change', function () {
    let is_general_stock = $('#general_stock').prop('checked')
    $('#for-general-stock').prop('hidden', !is_general_stock)
    $('#for-other-sale-order').prop('hidden', is_general_stock)
})

function CallProjectProductGeneralBorrow(sale_order_id, product_id, so_uom, base_uom) {
    let dataParam = {}
    dataParam['product_id'] = product_id
    dataParam['so_item__sale_order_id'] = sale_order_id
    let ajax = $.fn.callAjax2({
        url: script_url.attr('data-url-project-product-available-quantity'),
        data: dataParam,
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('goods_registration_item_available_quantity')) {
                return data?.['goods_registration_item_available_quantity'];
            }
            return {};
        },
        (errs) => {
            console.log(errs);
        }
    )

    Promise.all([ajax]).then(
        (results) => {
            let quantity_can_be_reserve = 0;
            for (const item of results[0]) {
                quantity_can_be_reserve += item?.['this_available']
            }
            so_available_amount.val(quantity_can_be_reserve / so_uom[0]?.['ratio'])
            so_available_amount.attr('data-base-quantity', quantity_can_be_reserve)
            LoadUOMStockBorrow(so_uom[0], base_uom[0])
        })
}

function LoadUOMStockBorrow(so_uom, base_uom) {
    uom_so.html('')
    uom_so.append(`
        <option selected data-ratio="${so_uom?.['ratio']}" value="${so_uom?.['id']}">${so_uom?.['title']}</option>
        <option data-ratio="${base_uom?.['ratio']}" value="${base_uom?.['id']}">${base_uom?.['title']}</option>
    `)
}

uom_so.on('change', function () {
    if (uom_so.val()) {
        let base_quantity = parseFloat(so_available_amount.attr('data-base-quantity'))
        let ratio = parseFloat(uom_so.find('option:selected').attr('data-ratio'))
        so_available_amount.val(base_quantity / ratio)
    }
})

function LoadProjectBorrow(data, product_id, so_uom, base_uom) {
    other_so.initSelect2({
        ajax: {
            url: other_so.attr('data-url') + `?has_regis=1`,
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i]?.['id'] !== saleOrderEle.val()) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        templateResult: function(data) {
            let ele = $('<div class="row"></div>');
            ele.append(`<div class="col-6"><span class="badge badge-soft-primary">${data.data?.['code']}</span>&nbsp;&nbsp;&nbsp;${data.data?.['title']}</div>
                        <div class="col-6 fst-italic"><span class="badge badge-soft-blue badge-sm">${data.data?.['opportunity']?.['code']}</span>&nbsp;&nbsp;&nbsp;${data.data?.['opportunity']?.['title']}</div>`);
            return ele;
        },
        data: (data ? data : null),
        keyResp: 'sale_order_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        let sale_order_id = SelectDDControl.get_data_from_idx(other_so, other_so.val())
        CallProjectProductGeneralBorrow(sale_order_id?.['id'], product_id, so_uom, base_uom)
    })
}

$(document).on("click", '.so-available-change', function () {
    borrow_row = $(this).closest('tr')
})

frm_borrow_from_other.submit(function (event) {
    event.preventDefault();
    let combinesData = new GoodsRegistrationBorrowHandle().combinesData($(this));
    if (combinesData) {
        WindowControl.showLoading();
        $.fn.callAjax2(combinesData)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        setTimeout(() => {
                            window.location.replace($(this).attr('data-url-redirect'));
                            location.reload.bind(location);
                        }, 1000);
                    }
                },
                (errs) => {
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                        },
                        1000
                    )
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    }
})

frm_borrow_from_other_row.submit(function (event) {
    event.preventDefault();
    let combinesData = new GoodsRegistrationBorrowHandle().combinesData($(this), borrow_row);
    if (combinesData) {
        WindowControl.showLoading();
        $.fn.callAjax2(combinesData)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        setTimeout(() => {
                            window.location.replace($(this).attr('data-url-redirect'));
                            location.reload.bind(location);
                        }, 1000);
                    }
                },
                (errs) => {
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                        },
                        1000
                    )
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    }
})
