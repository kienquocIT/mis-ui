const $tab_line_detail_datatable = $('#tab_line_detail_datatable')
const $btn_add_row_line_detail = $('#btn-add-row-line-detail')
const $trans_script = $('#trans-script')
const $url_script = $('#url-script')
const $date = $('#date')
const $table_serial = $('#table-serial')
const $table_lot = $('#table-lot')
const $modal_serial = $('#modal-serial')
const $modal_lot = $('#modal-lot')
let NOW_ROW = null
let IS_DETAIL_PAGE = false
let IS_UPDATE_PAGE = false
let DOC_DONE = false
let is_project = false
const company_current_data = JSON.parse($('#company_current_data').text());
if (company_current_data) {
    let company_current_data_ajax = $.fn.callAjax2({
        url: $url_script.attr('data-url-company-config-detail') + `?company_id=${company_current_data?.['id']}`,
        data: {},
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                return data?.['config'] ? data?.['config'] : [];
            }
            return [];
        },
        (errs) => {
            console.log(errs);
        }
    )

    Promise.all([company_current_data_ajax]).then(
        (results) => {
            is_project = results[0]?.['cost_per_project']
            $('#tr_so').prop('hidden', !is_project)
        })
}

function LoadDate() {
    $date.daterangepicker({
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        locale: {
            format: 'DD/MM/YYYY'
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
        // drops: 'up',
        autoApply: true,
    })
}

function loadDefaultTableLineDetail() {
    $tab_line_detail_datatable.DataTable().clear().destroy()
    $tab_line_detail_datatable.DataTableDefault({
        dom: '',
        data: [],
        columns: [
            {
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            }, {
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            }, {
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            }, {
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            }, {
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            }, {
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            }, {
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            }, {
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            }, {
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            },
        ],
    });
}

function loadProductWarehouse(ele, data) {
    ele.initSelect2({
        placeholder: $trans_script.attr('data-trans-product-list'),
        allowClear: true,
        ajax: {
            url: $url_script.attr('data-url-product-list') + `?warehouse_id=${ele.closest('tr').find('.from-wh').val()}`,
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'warehouse_products_list',
        keyId: 'id',
        keyText: 'product.title',
    }).on('change', function () {
        NOW_ROW = $(this).closest('tr')
        if ($(this).val()) {
            if (is_project) {
                callProjectProductList(NOW_ROW.find('.row_sale_order').val())
            }
            let selected = SelectDDControl.get_data_from_idx(ele, ele.val())
            ele.closest('tr').find('.uom').text(selected?.['uom']?.['title'])
            ele.closest('tr').find('.quantity').attr('data-quantity-limit', selected?.['stock_amount'])
            ele.closest('tr').find('.btn-select-detail').attr('data-product-type', selected?.['product']?.['general_traceability_method'])
            ele.closest('tr').find('.unit-price').attr('value', selected?.['unit_cost'])
            if (selected?.['product']?.['general_traceability_method'] === 0) {
                ele.closest('tr').find('.btn-select-detail').prop('hidden', true)
                ele.closest('tr').find('.btn-select-detail').attr('data-bs-toggle', '')
                ele.closest('tr').find('.btn-select-detail').attr('data-bs-target', '')
                ele.closest('tr').find('.quantity').val('').prop('disabled', false).prop('readonly', false)
                ele.closest('tr').find('.btn-select-detail .detail-lot').text(JSON.stringify([]))
                ele.closest('tr').find('.btn-select-detail .detail-serial').text(JSON.stringify([]))
            }
            else if (selected?.['product']?.['general_traceability_method'] === 1) {
                ele.closest('tr').find('.btn-select-detail').prop('hidden', false)
                ele.closest('tr').find('.btn-select-detail').attr('data-bs-toggle', 'modal')
                ele.closest('tr').find('.btn-select-detail').attr('data-bs-target', '#modal-lot')
                ele.closest('tr').find('.quantity').val('').prop('disabled', true).prop('readonly', true)
                ele.closest('tr').find('.btn-select-detail .detail-lot').text(JSON.stringify(selected?.['lot_detail']))
                ele.closest('tr').find('.btn-select-detail .detail-serial').text(JSON.stringify([]))
            }
            else if (selected?.['product']?.['general_traceability_method'] === 2) {
                ele.closest('tr').find('.btn-select-detail').prop('hidden', false)
                ele.closest('tr').find('.btn-select-detail').attr('data-bs-toggle', 'modal')
                ele.closest('tr').find('.btn-select-detail').attr('data-bs-target', '#modal-serial')
                ele.closest('tr').find('.quantity').val('').prop('disabled', true).prop('readonly', true)
                ele.closest('tr').find('.btn-select-detail .detail-lot').text(JSON.stringify([]))
                ele.closest('tr').find('.btn-select-detail .detail-serial').text(JSON.stringify(selected?.['serial_detail']))
            }
        }
        else {
            ele.closest('tr').find('.uom').text('')
            ele.closest('tr').find('.quantity').val('').prop('disabled', false).prop('readonly', false)
            ele.closest('tr').find('.btn-select-detail').prop('hidden', true)
            ele.closest('tr').find('.btn-select-detail').attr('data-bs-toggle', '')
            ele.closest('tr').find('.btn-select-detail').attr('data-bs-target', '')
            ele.closest('tr').find('.unit-price').attr('value', 0)
            ele.closest('tr').find('.subtotal-price').attr('value', 0)
        }
        $.fn.initMaskMoney2()
    })
}

function loadFromWH(ele, data) {
    ele.initSelect2({
        placeholder: $trans_script.attr('data-trans-out-warehouse-list'),
        allowClear: true,
        ajax: {
            url: $url_script.attr('data-url-warehouse-list') + '?is_dropship=False',
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'warehouse_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        loadProductWarehouse(ele.closest('tr').find('.prd'))
        loadTargetWH(ele.closest('tr').find('.to-wh'), null, $(this))
        ele.closest('tr').find('.prd').empty()
        ele.closest('tr').find('.to-wh').empty()
        ele.closest('tr').find('.quantity').val('')
        ele.closest('tr').find('.detail-serial').text('[]')
        ele.closest('tr').find('.detail-lot').text('[]')
        ele.closest('tr').find('.selected-serial').text('[]')
        ele.closest('tr').find('.selected-lot').text('[]')
        loadSerialTable([])
        loadLotTable([])
    })
}

function loadTargetWH(ele, data, from_wh) {
    ele.initSelect2({
        placeholder: $trans_script.attr('data-trans-target-warehouse-list'),
        allowClear: true,
        ajax: {
            url: $url_script.attr('data-url-warehouse-list') + '?is_dropship=False',
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i]?.['id'] !== from_wh.val()) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'warehouse_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {})
}

$btn_add_row_line_detail.on('click', function () {
    $tab_line_detail_datatable.find('tbody .dataTables_empty').closest('tr').remove()
    let index = $tab_line_detail_datatable.find('tbody tr').length + 1
    let row_html = $(`<tr>
        <td class="index">${index}</td>
        <td><select class="from-wh form-select select2"></select></td>
        <td><select class="prd form-select select2"></select></td>
        <td><span class="uom"></span></td>
        <td ${is_project ? '' : 'hidden'}>
            <select class="form-select select2 row_sale_order"
                    data-method="GET"
                    data-url="${$url_script.attr('data-url-so-list')}">
            </select>
        </td>
        <td>
            <div class="input-group">
                <span class="input-group-text btn-select-detail">
                    <i class="fas fa-ellipsis-v"></i>
                    <script class="detail-lot">[]</script>
                    <script class="detail-serial">[]</script>
                    <script class="selected-lot">[]</script>
                    <script class="selected-serial">[]</script>
                </span>
                <input class="quantity form-control" type="number" min="0">
            </div>
        </td>
        <td><select class="to-wh form-select select2"></select></td>
        <td><input class="unit-price form-control mask-money"></td>
        <td><input disabled readonly class="subtotal-price form-control mask-money"></td>
        <td class="text-center">
            <button type="button" class="btn-delete btn btn-icon btn-rounded btn-flush-danger flush-soft-hover btn-xs">
                <span class="icon"><i class="bi bi-trash"></i></span>
            </button>
        </td>
    </tr>`)
    NOW_ROW = row_html
    $tab_line_detail_datatable.find('tbody').append(row_html)
    loadFromWH(row_html.find('.from-wh'))
    loadSaleOrder(row_html.find('.row_sale_order'))
})

$(document).on("click", '.btn-delete', function () {
    $(this).closest('tr').remove();
    $tab_line_detail_datatable.find('tbody tr').each(function (index) {
        $(this).find('.index').text(index+1)
    })
});

$(document).on("change", '.quantity', function () {
    if ($(this).val() && $(this).attr('data-quantity-limit')) {
        if (parseFloat($(this).val()) > parseFloat($(this).attr('data-quantity-limit'))) {
            $(this).val(0)
            $.fn.notifyB({description: `Input quantity > stock quantity (${$(this).attr('data-quantity-limit')})`}, 'warning')
        } else {
            let unit_price = parseFloat($(this).closest('tr').find('.unit-price').attr('value'))
            let new_subtotal_price = parseFloat($(this).val()) * unit_price
            $(this).closest('tr').find('.subtotal-price').attr('value', new_subtotal_price)
            $.fn.initMaskMoney2()
        }
    }

    if ($(this).val() && $(this).attr('max')) {
        if (parseFloat($(this).val()) > parseFloat($(this).attr('max'))) {
            $(this).val(0)
            $.fn.notifyB({description: `Max quantity can be transferred is ${$(this).attr('max')}`}, 'failure')
        }
    }
});

$(document).on("change", '.quantity_get', function () {
    if (parseFloat($(this).val()) > parseFloat($(this).closest('tr').find('.quantity_import').text())) {
        $(this).val(0)
        $(this).addClass('is-invalid')
        $.fn.notifyB({description: `Get quantity > inventory quantity (${$(this).attr($(this).closest('tr').find('.quantity_import').text())})`}, 'warning')
    }
    else {
        $(this).removeClass('is-invalid')
    }
});

$(document).on("change", '.unit-price', function () {
    if ($(this).val()) {
        let unit_price = $(this).attr('value')
        let quantity = $(this).closest('tr').find('.quantity').val()
        $(this).closest('tr').find('.subtotal-price').attr(
            'value',
            parseFloat(unit_price) * parseFloat(quantity)
        )
    }
    else {
        $(this).val(0)
    }
    $.fn.initMaskMoney2()
});

function loadSerialTable(data, serial_selected=[]) {
    $table_serial.DataTable().clear().destroy()
    $table_serial.DataTableDefault({
        dom: '',
        rowIdx: true,
        paging: false,
        data: data,
        columns: IS_DETAIL_PAGE ? [
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            },
            {
                data: 'vendor_serial_number',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly}
                                    data-raw="${data ? data : ''}"
                                    data-serial-id="${row?.['id']}"
                                    class="form-control vendor_serial_number" value="${data ? data : ''}">`;
                }
            },
            {
                data: 'serial_number',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly} data-raw="${data ? data : ''}" class="form-control serial_number" value="${data ? data : ''}">`;
                }
            },
            {
                data: 'expire_date',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control expire_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: 'manufacture_date',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control manufacture_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: 'warranty_start',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control warranty_start" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: 'warranty_end',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control warranty_end" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    let checked = ''
                    if (serial_selected.includes(row?.['id'])) {
                        checked = 'checked'
                    }
                    return `<div class="form-check">
                        <input ${checked} disabled readonly type="checkbox" data-id="${row?.['id']}" class="form-check-input select-this-serial">
                        <label class="form-check-label" for="select-this-serial"></label>
                    </div>`
                }
            },
        ] : [
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            },
            {
                data: 'vendor_serial_number',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly}
                                    data-raw="${data ? data : ''}"
                                    data-serial-id="${row?.['id']}"
                                    class="form-control vendor_serial_number" value="${data ? data : ''}">`;
                }
            },
            {
                data: 'serial_number',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly} data-raw="${data ? data : ''}" class="form-control serial_number" value="${data ? data : ''}">`;
                }
            },
            {
                data: 'expire_date',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control expire_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: 'manufacture_date',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control manufacture_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: 'warranty_start',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control warranty_start" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: 'warranty_end',
                className: 'wrap-text',
                render: (data, type, row) => {
                    let disabled_readonly = ''
                    if (row?.['id']) {
                        disabled_readonly = 'disabled readonly'
                    }
                    return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control warranty_end" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: '',
                className: 'wrap-text text-center',
                render: (data, type, row) => {
                    let checked = ''
                    if (serial_selected.includes(row?.['id'])) {
                        checked = 'checked'
                    }
                    return `<div class="form-check">
                        <input ${checked} type="checkbox" data-id="${row?.['id']}" class="form-check-input select-this-serial">
                        <label class="form-check-label" for="select-this-serial"></label>
                    </div>`
                }
            },
        ],
        initComplete: function () {
            if (DOC_DONE) {
                $table_serial.find('input').prop('disabled', true).prop('readonly', true)
            }
        }
    });
}

function loadLotTable(data, lot_selected=[]) {
    $table_lot.DataTable().clear().destroy()
    $table_lot.DataTableDefault({
        dom: '',
        rowIdx: true,
        paging: false,
        data: data,
        columns: IS_DETAIL_PAGE ? [
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            },
            {
                data: 'lot_number',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? data : ''}" data-lot-id="${row?.['id']}" class="form-control lot_number" value="${data ? data : ''}">`;
                }
            },
            {
                data: 'quantity_import',
                className: `wrap-text`,
                render: (data, type, row) => {
                    return `<span class="quantity_import">${data ? data : 0}</span>`;
                }
            },
            {
                data: 'expire_date',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control expire_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: 'manufacture_date',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control manufacture_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    // [{lot_id: ..., quantity: ...}]
                    let quantity_got = 0
                    for (const lot of lot_selected) {
                        if (lot?.['lot_id'] === row?.['id']) {
                            quantity_got = lot?.['quantity']
                            break
                        }
                    }
                    return `<input type="number" min="0" disabled readonly data-id="${row?.['id']}" value="${quantity_got}" class="form-control quantity_get ${parseFloat(quantity_got) > parseFloat(row?.['quantity_import']) && !DOC_DONE ? 'is-invalid' : ''}">`;
                }
            },
        ] : [
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return ``;
                }
            },
            {
                data: 'lot_number',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? data : ''}" data-lot-id="${row?.['id']}" class="form-control lot_number" value="${data ? data : ''}">`;
                }
            },
            {
                data: 'quantity_import',
                className: `wrap-text`,
                render: (data, type, row) => {
                    return `<span class="quantity_import">${data ? data : 0}</span>`;
                }
            },
            {
                data: 'expire_date',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control expire_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: 'manufacture_date',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control manufacture_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: '',
                className: 'wrap-text',
                render: (data, type, row) => {
                    // [{lot_id: ..., quantity: ...}]
                    let quantity_got = 0
                    for (const lot of lot_selected) {
                        if (lot?.['lot_id'] === row?.['id']) {
                            quantity_got = lot?.['quantity']
                            break
                        }
                    }
                    return `<input type="number" min="0" data-id="${row?.['id']}" value="${quantity_got}" class="form-control quantity_get ${parseFloat(quantity_got) > parseFloat(row?.['quantity_import']) && !DOC_DONE ? 'is-invalid' : ''}">`;
                }
            },
        ],
        columnDefs: [
            {
                targets: [2], visible: !DOC_DONE
            }
        ],
        initComplete: function () {
            if (DOC_DONE) {
                $table_lot.find('input').prop('disabled', true).prop('readonly', true)
            }
        }
    });
}

function loadSaleOrder(ele, data) {
    ele.initSelect2({
        ajax: {
            url: ele.attr('data-url') + `?has_regis=1`,
            method: 'GET',
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
        NOW_ROW = $(this).closest('tr')
        if ($(this).val()) {
            callProjectProductList($(this).val())
        }
    })
}

function callProjectProductList(sale_order_id) {
    let gre_item__product_id = SelectDDControl.get_data_from_idx(
        NOW_ROW.find('.prd'),
        NOW_ROW.find('.prd').val()
    )?.['product']?.['id']
    let project_product_list_ajax = $.fn.callAjax2({
        url: $url_script.attr('data-url-project-product-list'),
        data: {
            'goods_registration__sale_order_id': sale_order_id,
            'gre_item__product_id': gre_item__product_id
        },
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                return data?.['project_product_list'] ? data?.['project_product_list'] : [];
            }
            return [];
        },
        (errs) => {
            console.log(errs);
        }
    )

    Promise.all([project_product_list_ajax]).then(
        (results) => {
            if (results[0].length > 0) {
                console.log(results[0])
                let general_traceability_method = results[0][0]?.['product']?.['general_traceability_method']
                if (general_traceability_method === 0) {
                    let max_transfer_quantity = results[0][0]?.['quantity']
                    NOW_ROW.find('.quantity').attr(
                        'max', max_transfer_quantity
                    ).attr(
                        'placeholder', `max = ${max_transfer_quantity}`
                    )
                }
                if (general_traceability_method === 1) {
                    let lot_detail = []
                    for (const item of results[0]) {
                        if (item?.['lot_detail'].length > 0) {
                            for (const lot_data of item?.['lot_detail']) {
                                if (lot_data?.['warehouse_id'] === NOW_ROW.find('.from-wh').val()) {
                                    lot_detail.push(lot_data)
                                }
                            }
                        }
                    }
                    NOW_ROW.find('.quantity').attr('placeholder', '')
                    loadLotTable(lot_detail, JSON.parse(NOW_ROW.find('.selected-lot').text()))
                }
                if (general_traceability_method === 2) {
                    let max_transfer_quantity = results[0][0]?.['quantity']
                    NOW_ROW.find('.quantity').attr(
                        'max', max_transfer_quantity
                    ).attr(
                        'placeholder', `max = ${max_transfer_quantity}`
                    )
                    loadSerialTable(
                        results[0][0]?.['serial_detail'],
                        JSON.parse(NOW_ROW.find('.selected-serial').text())
                    )
                }
            } else {
                $.fn.notifyB({description: `This product in this warehouse is empty for this Sale order`}, 'warning')
            }
        })
}

$(document).on("click", '.btn-select-detail', function () {
    NOW_ROW = $(this).closest('tr')
    if (!is_project) {
        if ($(this).attr('data-product-type') === '0') {}
        else if ($(this).attr('data-product-type') === '1') {
            loadLotTable(
                JSON.parse($(this).find('.detail-lot').text()),
                JSON.parse(NOW_ROW.find('.selected-lot').text())
            )
        }
        else if ($(this).attr('data-product-type') === '2') {
            let data = JSON.parse($(this).find('.detail-serial').text())
            let data_selected = JSON.parse(NOW_ROW.find('.selected-serial').text())
            loadSerialTable(data, data_selected)
        }
    }
});

$('#ok-btn-modal-serial').on('click', function () {
    let selected_serial = []
    $table_serial.find('tbody tr').each(function () {
        if ($(this).find('.select-this-serial').prop('checked')) {
            selected_serial.push($(this).find('.select-this-serial').attr('data-id'))
        }
    })
    NOW_ROW.find('.quantity').val(selected_serial.length).removeClass('is-invalid')
    NOW_ROW.find('.btn-select-detail .selected-serial').text(JSON.stringify(selected_serial))
    $modal_serial.modal('hide')
    let unit_price = parseFloat(NOW_ROW.find('.unit-price').attr('value'))
    let new_subtotal_price = parseFloat(NOW_ROW.find('.quantity').val()) * unit_price
    NOW_ROW.find('.subtotal-price').attr('value', new_subtotal_price)
    $.fn.initMaskMoney2()
});

$('#ok-btn-modal-lot').on('click', function () {
    let selected_lot = []
    let sum = 0
    let flag = true
    $table_lot.find('tbody tr').each(function () {
        if (parseFloat($(this).find('.quantity_get').val()) > parseFloat($(this).find('.quantity_import').text())) {
            $(this).val(0)
            flag = false
            $.fn.notifyB({description: `Get quantity > inventory quantity (${$(this).find('.quantity_import').text()})`}, 'warning')
            return
        }

        sum += parseFloat($(this).find('.quantity_get').val())
        selected_lot.push({
            'lot_id': $(this).find('.quantity_get').attr('data-id'),
            'quantity': parseFloat($(this).find('.quantity_get').val())
        })
    })
    if (flag) {
        NOW_ROW.find('.quantity').val(sum).removeClass('is-invalid')
        NOW_ROW.find('.btn-select-detail .selected-lot').text(JSON.stringify(selected_lot))
        $modal_lot.modal('hide')
        let unit_price = parseFloat(NOW_ROW.find('.unit-price').attr('value'))
        let new_subtotal_price = parseFloat(NOW_ROW.find('.quantity').val()) * unit_price
        NOW_ROW.find('.subtotal-price').attr('value', new_subtotal_price)
        $.fn.initMaskMoney2()
    }
});

function Disable() {
    $('.form-control').prop('disabled', true).css({color: 'black'});
    $('.form-select').prop('disabled', true).css({color: 'black'});
    $('.select2').prop('disabled', true);
    $('#collapse-area input').prop('disabled', true);
    $btn_add_row_line_detail.remove();
    $modal_lot.find('#ok-btn-modal-lot').prop('disabled', true)
    $modal_serial.find('#ok-btn-modal-serial').prop('disabled', true)
    $tab_line_detail_datatable.find('.btn-delete').prop('disabled', true)
}

function LoadDetailGoodsTransfer(option='detail') {
    let pk = $.fn.getPkDetail()
    let url_loaded = $url_script.attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                IS_DETAIL_PAGE = option === 'detail'
                IS_UPDATE_PAGE = option === 'update'
                DOC_DONE = [2, 3].includes(data?.['goods_transfer_detail']?.['system_status'])

                data = data?.['goods_transfer_detail'];
                if (option === 'detail') {
                    new PrintTinymceControl().render('866f163d-b724-404d-942f-4bc44dc2e2ed', data, false);
                }
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);

                $('#title').val(data?.['title'])
                $date.val(moment(data?.['date_transfer'].split(' ')[0]).format('DD/MM/YYYY'))
                $('#note').val(data?.['note'])

                for (const row_data of data?.['goods_transfer_data']) {
                    $tab_line_detail_datatable.find('tbody .dataTables_empty').closest('tr').remove()
                    let index = $tab_line_detail_datatable.find('tbody tr').length + 1
                    let row_html = $(`<tr>
                        <td class="index">${index}</td>
                        <td><select class="from-wh form-select select2"></select></td>
                        <td><select class="prd form-select select2"></select></td>
                        <td><span class="uom"></span></td>
                        <td ${is_project ? '' : 'hidden'}>
                            <select class="form-select select2 row_sale_order"
                                    data-method="GET"
                                    data-url="${$url_script.attr('data-url-so-list')}">
                            </select>
                        </td>
                        <td>
                            <div class="input-group">
                                <span class="input-group-text btn-select-detail">
                                    <i class="fas fa-ellipsis-v"></i>
                                    <script class="detail-lot">[]</script>
                                    <script class="detail-serial">[]</script>
                                    <script class="selected-lot">[]</script>
                                    <script class="selected-serial">[]</script>
                                </span>
                                <input class="quantity form-control" type="number" min="0">
                            </div>
                        </td>
                        <td><select class="to-wh form-select select2"></select></td>
                        <td><input class="unit-price form-control mask-money"></td>
                        <td><input disabled readonly class="subtotal-price form-control mask-money"></td>
                        <td class="text-center">
                            <button type="button" class="btn-delete btn btn-icon btn-rounded btn-flush-danger flush-soft-hover btn-xs">
                                <span class="icon"><i class="bi bi-trash"></i></span>
                            </button>
                        </td>
                    </tr>`)
                    $tab_line_detail_datatable.find('tbody').append(row_html)
                    loadSaleOrder(row_html.find('.row_sale_order'), row_data?.['sale_order'])
                    loadFromWH(row_html.find('.from-wh'), row_data?.['product_warehouse']?.['from_warehouse_mapped'])
                    loadProductWarehouse(row_html.find('.prd'), row_data?.['product_warehouse'])
                    row_html.find('.uom').text(row_data?.['product_warehouse']?.['uom']?.['title'])
                    row_html.find('.quantity').val(row_data?.['quantity'])
                    row_html.find('.selected-lot').text(JSON.stringify(row_data?.['lot_data']))
                    row_html.find('.selected-serial').text(JSON.stringify(row_data?.['sn_data']))
                    loadTargetWH(row_html.find('.to-wh'), row_data?.['product_warehouse']?.['end_warehouse_mapped'])
                    row_html.find('.unit-price').attr('value', row_data?.['unit_cost'])
                    row_html.find('.subtotal-price').attr('value', row_data?.['subtotal'])

                    // load product_warehouse data (lot/sn)
                    let ele = row_html.find('.prd')
                    let selected = SelectDDControl.get_data_from_idx(ele, ele.val())?.['product']
                    ele.closest('tr').find('.uom').text(selected?.['uom']?.['title'])
                    ele.closest('tr').find('.quantity').attr('data-quantity-limit', selected?.['stock_amount'])
                    ele.closest('tr').find('.btn-select-detail').attr('data-product-type', selected?.['general_traceability_method'])
                    if (selected?.['general_traceability_method'] === 0) {
                        ele.closest('tr').find('.btn-select-detail').prop('hidden', true)
                        ele.closest('tr').find('.btn-select-detail').attr('data-bs-toggle', '')
                        ele.closest('tr').find('.btn-select-detail').attr('data-bs-target', '')
                        ele.closest('tr').find('.quantity').prop('disabled', false).prop('readonly', false)
                        ele.closest('tr').find('.btn-select-detail .detail-lot').text(JSON.stringify([]))
                        ele.closest('tr').find('.btn-select-detail .detail-serial').text(JSON.stringify([]))
                    }
                    else if (selected?.['general_traceability_method'] === 1) {
                        ele.closest('tr').find('.btn-select-detail').prop('hidden', false)
                        ele.closest('tr').find('.btn-select-detail').attr('data-bs-toggle', 'modal')
                        ele.closest('tr').find('.btn-select-detail').attr('data-bs-target', '#modal-lot')
                        ele.closest('tr').find('.quantity').prop('disabled', true).prop('readonly', true)
                        ele.closest('tr').find('.btn-select-detail .detail-lot').text(JSON.stringify(selected?.['lot_detail']))
                        ele.closest('tr').find('.btn-select-detail .detail-serial').text(JSON.stringify([]))
                    }
                    else if (selected?.['general_traceability_method'] === 2) {
                        ele.closest('tr').find('.btn-select-detail').prop('hidden', false)
                        ele.closest('tr').find('.btn-select-detail').attr('data-bs-toggle', 'modal')
                        ele.closest('tr').find('.btn-select-detail').attr('data-bs-target', '#modal-serial')
                        ele.closest('tr').find('.quantity').prop('disabled', true).prop('readonly', true)
                        ele.closest('tr').find('.btn-select-detail .detail-lot').text(JSON.stringify([]))
                        ele.closest('tr').find('.btn-select-detail .detail-serial').text(JSON.stringify(selected?.['serial_detail']))
                    }

                    if (!DOC_DONE) {
                        let lot_alert_hidden = row_data?.['lot_is_lost'] && row_data?.['lot_data'].length > 0
                        let serial_alert_hidden = row_data?.['serial_is_lost'] && row_data?.['sn_data'].length > 0
                        if (lot_alert_hidden) {
                            $('#lot-alert').prop('hidden', !lot_alert_hidden)
                            $('#common-alert').prop('hidden', !lot_alert_hidden)
                        }
                        if (serial_alert_hidden) {
                            $('#serial-alert').prop('hidden', !serial_alert_hidden)
                            $('#common-alert').prop('hidden', !serial_alert_hidden)
                        }

                        let old_value = row_html.find('.quantity').val()
                        lot_alert_hidden === true || serial_alert_hidden === true ? row_html.find('.quantity').addClass('is-invalid').attr('placeholder', old_value).val('') : row_html.find('.quantity').removeClass('is-invalid')
                    }
                }

                if (IS_DETAIL_PAGE || DOC_DONE) {
                    Disable()
                }
                $.fn.initMaskMoney2()
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
            }
        })
}

class GoodsTransferHandle {
    load() {
        LoadDate()
        loadDefaultTableLineDetail()
    }
    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['note'] = $('#note').val();
        frm.dataForm['date_transfer'] = moment($date.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        let data_line_detail = []
        let flag = null
        $tab_line_detail_datatable.find('tbody tr').each(function () {
            if ($(this).find('.dataTables_empty').length === 0) {
                let row = $(this)
                let wh = SelectDDControl.get_data_from_idx(row.find('.from-wh'), row.find('.from-wh').val())
                let prd_wh = SelectDDControl.get_data_from_idx(row.find('.prd'), row.find('.prd').val())
                let target_wh = SelectDDControl.get_data_from_idx(row.find('.to-wh'), row.find('.to-wh').val())
                let quantity = row.find('.quantity').val()
                let sn_changes = JSON.parse(row.find('.selected-serial').text())
                let lot_changes = JSON.parse(row.find('.selected-lot').text())
                if (prd_wh?.['product']?.['general_traceability_method'] === 0) {
                    if (parseFloat(quantity) > parseFloat(row.find('.quantity').attr('data-quantity-limit'))) {
                        flag = 0
                    }
                }
                else if (prd_wh?.['product']?.['general_traceability_method'] === 1) { // lot
                    if (parseFloat(quantity) !== lot_changes.reduce((acc, curr) => acc + curr?.['quantity'], 0)) {
                        flag = 1
                    }
                }
                else if (prd_wh?.['product']?.['general_traceability_method'] === 2) { // sn
                    if (parseFloat(quantity) !== sn_changes.length) {
                        flag = 2
                    }
                }

                if (
                    prd_wh?.['id'] && wh?.['id'] && target_wh?.['id']
                    && prd_wh?.['uom']?.['id'] && parseFloat(quantity)
                    && parseFloat(row.find('.unit-price').attr('value'))
                    && parseFloat(row.find('.subtotal-price').attr('value'))
                ) {
                    data_line_detail.push({
                        'product_warehouse': prd_wh?.['id'],
                        'warehouse': wh?.['id'],
                        'product': prd_wh?.['product']?.['id'],
                        'sale_order': row.find('.row_sale_order').val() ? row.find('.row_sale_order').val() : null,
                        'end_warehouse': target_wh?.['id'],
                        'uom': prd_wh?.['uom']?.['id'],
                        'lot_data': lot_changes,
                        'sn_data': sn_changes,
                        'quantity': parseFloat(quantity),
                        'unit_cost': parseFloat(row.find('.unit-price').attr('value')),
                        'subtotal': parseFloat(row.find('.subtotal-price').attr('value')),
                    })
                }
                else {
                    flag = 3
                }
            }
        })
        frm.dataForm['goods_transfer_data'] = data_line_detail
        if (flag === null) {
            return frm;
        }
        else {
            let flag_notify = [
                "Quantity > Stock amount",
                "Quantity > Lot_data's length",
                "Quantity > Serial_data's length",
                "Row is missing data or incorrect"
            ]
            $.fn.notifyB({description: flag_notify[flag]}, 'failure')
        }
    }
}
