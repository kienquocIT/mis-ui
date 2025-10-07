const $tab_line_detail_datatable = $('#tab_line_detail_datatable')
const $btn_add_row_line_detail = $('#btn-add-row-line-detail')
const $trans_script = $('#trans-script')
const $url_script = $('#url-script')
const $table_serial = $('#table-serial')
const $table_lot = $('#table-lot')
const $modal_serial = $('#modal-serial')
const $modal_lot = $('#modal-lot')
let NOW_ROW = null
let IS_DETAIL_PAGE = false
let IS_UPDATE_PAGE = false
let DOC_DONE = false
let is_project = false
const company_current_data = $('#company_current_data').text() ? JSON.parse($('#company_current_data').text()) : [];
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
        })
}

function LoadTableLineDetail(data_list=[], option='create') {
    $tab_line_detail_datatable.DataTable().clear().destroy()
    $tab_line_detail_datatable.DataTableDefault({
        styleDom: 'hide-foot',
        rowIdx: true,
        scrollX: true,
        scrollY: '60vh',
        scrollCollapse: true,
        paging: false,
        data: data_list,
        columns: [
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return ``;
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="from-wh form-select select2"></select>`;
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="prd form-select select2"></select>`;
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<select ${is_project ? '' : 'disabled'}
                                    ${option === 'detail' ? 'disabled' : ''}
                                    class="form-select select2 row_sale_order"
                                    data-method="GET"
                                    data-url="${$url_script.attr('data-url-so-list')}">
                            </select>`;
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<div class="input-group">
                                <input ${option === 'detail' ? 'disabled readonly' : ''} class="quantity form-control" type="number" min="0">
                                <span class="input-group-text btn-select-detail">
                                    <i class="fas fa-ellipsis-v"></i>
                                    <script class="detail-lot"></script>
                                    <script class="detail-serial"></script>
                                    <script class="selected-lot"></script>
                                    <script class="selected-serial"></script>
                                </span>
                            </div>`;
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<input disabled readonly class="form-control uom">`;
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="to-wh form-select select2"></select>`;
                }
            },
            {
                className: 'w-5 text-right',
                render: (data, type, row) => {
                    return `<button ${option === 'detail' ? 'disabled' : ''} type="button" class="btn-delete btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover">
                                <span class="icon"><i class="bi bi-trash"></i></span>
                            </button>`;
                }
            },
        ],
        initComplete: function () {
            if (data_list.length > 0) {
                $tab_line_detail_datatable.find('tbody tr').each(function (index, ele) {
                    LoadSaleOrder($(ele).find('.row_sale_order'), data_list[index]?.['sale_order'])
                    LoadSourceWarehouse($(ele).find('.from-wh'), data_list[index]?.['product_warehouse']?.['from_warehouse_mapped'])
                    LoadProductWarehouse($(ele).find('.prd'), data_list[index]?.['product_warehouse'])
                    $(ele).find('.uom').val(data_list[index]?.['product_warehouse']?.['uom']?.['title'])
                    $(ele).find('.quantity').val(data_list[index]?.['quantity'])
                    $(ele).find('.selected-lot').text(JSON.stringify(data_list[index]?.['lot_data']))
                    $(ele).find('.selected-serial').text(JSON.stringify(data_list[index]?.['sn_data']))
                    LoadDestinationWarehouse($(ele).find('.to-wh'), data_list[index]?.['product_warehouse']?.['end_warehouse_mapped'])

                    // load product_warehouse data (lot/sn)
                    let selected = SelectDDControl.get_data_from_idx($(ele).find('.prd'), $(ele).find('.prd').val())?.['product']
                    $(ele).find('.uom').val(selected?.['uom']?.['title'])
                    $(ele).find('.quantity').attr('data-quantity-limit', selected?.['stock_amount'])
                    $(ele).find('.btn-select-detail').attr('data-product-type', selected?.['general_traceability_method'])
                    if (selected?.['general_traceability_method'] === 0) {
                        $(ele).find('.btn-select-detail').prop('hidden', true).attr('data-bs-toggle', '').attr('data-bs-target', '')
                        $(ele).find('.quantity').prop('disabled', option === 'detail').prop('readonly', option === 'detail')
                        $(ele).find('.btn-select-detail .detail-lot').text(JSON.stringify([]))
                        $(ele).find('.btn-select-detail .detail-serial').text(JSON.stringify([]))
                    } else if (selected?.['general_traceability_method'] === 1) {
                        $(ele).find('.btn-select-detail').prop('hidden', false).attr('data-bs-toggle', 'modal').attr('data-bs-target', '#modal-lot')
                        $(ele).find('.quantity').prop('disabled', true).prop('readonly', true)
                        $(ele).find('.btn-select-detail .detail-lot').text(JSON.stringify(selected?.['lot_detail']))
                        $(ele).find('.btn-select-detail .detail-serial').text(JSON.stringify([]))
                    } else if (selected?.['general_traceability_method'] === 2) {
                        $(ele).find('.btn-select-detail').prop('hidden', false).attr('data-bs-toggle', 'modal').attr('data-bs-target', '#modal-serial')
                        $(ele).find('.quantity').prop('disabled', true).prop('readonly', true)
                        $(ele).find('.btn-select-detail .detail-lot').text(JSON.stringify([]))
                        $(ele).find('.btn-select-detail .detail-serial').text(JSON.stringify(selected?.['serial_detail']))
                    }

                    if (!DOC_DONE) {
                        let lot_alert_hidden = data_list[index]?.['lot_is_lost'] && data_list[index]?.['lot_data'].length > 0
                        let serial_alert_hidden = data_list[index]?.['serial_is_lost'] && data_list[index]?.['sn_data'].length > 0
                        if (lot_alert_hidden) {
                            $('#lot-alert').prop('hidden', !lot_alert_hidden)
                            $('#common-alert').prop('hidden', !lot_alert_hidden)
                        }
                        if (serial_alert_hidden) {
                            $('#serial-alert').prop('hidden', !serial_alert_hidden)
                            $('#common-alert').prop('hidden', !serial_alert_hidden)
                        }

                        let old_value = $(ele).find('.quantity').val()
                        lot_alert_hidden === true || serial_alert_hidden === true ? $(ele).find('.quantity').addClass('is-invalid').attr('placeholder', old_value).val('') : $(ele).find('.quantity').removeClass('is-invalid')
                    }
                })
            }

            if (!is_project) {
                $tab_line_detail_datatable.DataTable().column(3).visible(false);
            }
        }
    });
}

function LoadProductWarehouse(ele, data) {
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
                CallProjectProductList(NOW_ROW.find('.row_sale_order').val())
            }
            let selected = SelectDDControl.get_data_from_idx(ele, ele.val())
            ele.closest('tr').find('.uom').val(selected?.['uom']?.['title'])
            ele.closest('tr').find('.quantity').attr('data-quantity-limit', selected?.['stock_amount'])
            ele.closest('tr').find('.btn-select-detail').attr('data-product-type', selected?.['product']?.['general_traceability_method'])
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
            ele.closest('tr').find('.uom').val('')
            ele.closest('tr').find('.quantity').val('').prop('disabled', false).prop('readonly', false)
            ele.closest('tr').find('.btn-select-detail').prop('hidden', true)
            ele.closest('tr').find('.btn-select-detail').attr('data-bs-toggle', '')
            ele.closest('tr').find('.btn-select-detail').attr('data-bs-target', '')
        }
        $.fn.initMaskMoney2()
    })
}

function LoadSourceWarehouse(ele, data) {
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
        LoadProductWarehouse(ele.closest('tr').find('.prd'))
        LoadDestinationWarehouse(ele.closest('tr').find('.to-wh'), null, $(this))
        ele.closest('tr').find('.prd').empty()
        ele.closest('tr').find('.to-wh').empty()
        ele.closest('tr').find('.quantity').val('')
        ele.closest('tr').find('.detail-serial').text('[]')
        ele.closest('tr').find('.detail-lot').text('[]')
        ele.closest('tr').find('.selected-serial').text('[]')
        ele.closest('tr').find('.selected-lot').text('[]')
        LoadSerialTable([])
        LoadLotTable([])
    })
}

function LoadDestinationWarehouse(ele, data, from_wh) {
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
    UsualLoadPageFunction.AddTableRow($tab_line_detail_datatable, {})
    let row_added = $tab_line_detail_datatable.find('tbody tr:last-child')
    LoadSourceWarehouse(row_added.find('.from-wh'))
    LoadSaleOrder(row_added.find('.row_sale_order'))
})

$(document).on("click", '.btn-delete', function () {
    UsualLoadPageFunction.DeleteTableRow(
        $tab_line_detail_datatable,
        parseInt($(this).closest('tr').find('td:first-child').text())
    )
});

$(document).on("change", '.quantity', function () {
    if ($(this).val() && $(this).attr('data-quantity-limit')) {
        if (parseFloat($(this).val()) > parseFloat($(this).attr('data-quantity-limit'))) {
            $(this).val(0)
            $.fn.notifyB({description: `Input quantity > stock quantity (${$(this).attr('data-quantity-limit')})`}, 'warning')
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

function LoadSerialTable(data, serial_selected=[]) {
    $table_serial.DataTable().clear().destroy()
    $table_serial.DataTableDefault({
        rowIdx: true,
        paging: false,
        scrollY: '40vh',
        scrollX: true,
        scrollCollapse: true,
        data: data,
        columns: IS_DETAIL_PAGE ? [
            {
                data: '',
                render: (data, type, row) => {
                    return ``;
                }
            },
            {
                data: 'vendor_serial_number',
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
                className: 'text-center',
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
                render: (data, type, row) => {
                    return ``;
                }
            },
            {
                data: 'vendor_serial_number',
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
                className: 'text-center',
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
            else {
                $('#get-all').prop('hidden', false)
            }
        }
    });
}

$('#get-all').on('click', function () {
    if ($(this).attr('data-get') === '') {
        $('.select-this-serial').prop('checked', true)
        $(this).attr('data-get', '1')
    }
    else {
        $('.select-this-serial').prop('checked', false)
        $(this).attr('data-get', '')
    }
})

function LoadLotTable(data, lot_selected=[]) {
    $table_lot.DataTable().clear().destroy()
    $table_lot.DataTableDefault({
        dom: '',
        rowIdx: true,
        paging: false,
        data: data,
        columns: IS_DETAIL_PAGE ? [
            {
                data: '',
                render: (data, type, row) => {
                    return ``;
                }
            },
            {
                data: 'lot_number',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? data : ''}" data-lot-id="${row?.['id']}" class="form-control lot_number" value="${data ? data : ''}">`;
                }
            },
            {
                data: 'quantity_import',
                className: ``,
                render: (data, type, row) => {
                    return `<span class="quantity_import">${data ? data : 0}</span>`;
                }
            },
            {
                data: 'expire_date',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control expire_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: 'manufacture_date',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control manufacture_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: '',
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
                render: (data, type, row) => {
                    return ``;
                }
            },
            {
                data: 'lot_number',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? data : ''}" data-lot-id="${row?.['id']}" class="form-control lot_number" value="${data ? data : ''}">`;
                }
            },
            {
                data: 'quantity_import',
                className: ``,
                render: (data, type, row) => {
                    return `<span class="quantity_import">${data ? data : 0}</span>`;
                }
            },
            {
                data: 'expire_date',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control expire_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: 'manufacture_date',
                render: (data, type, row) => {
                    return `<input disabled readonly data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control manufacture_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                }
            },
            {
                data: '',
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

function LoadSaleOrder(ele, data) {
    if (ele.length !== 0) {
        ele.initSelect2({
            ajax: {
                url: ele.attr('data-url') + `?has_regis=1`,
                method: 'GET',
            },
            templateResult: function (data) {
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
                CallProjectProductList($(this).val())
            }
        })
    }
}

function CallProjectProductList(sale_order_id) {
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
                    LoadLotTable(lot_detail, JSON.parse(NOW_ROW.find('.selected-lot').text()))
                }
                if (general_traceability_method === 2) {
                    let max_transfer_quantity = results[0][0]?.['quantity']
                    NOW_ROW.find('.quantity').attr(
                        'max', max_transfer_quantity
                    ).attr(
                        'placeholder', `max = ${max_transfer_quantity}`
                    )
                    LoadSerialTable(
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
            LoadLotTable(
                JSON.parse($(this).find('.detail-lot').text()),
                JSON.parse(NOW_ROW.find('.selected-lot').text())
            )
        }
        else if ($(this).attr('data-product-type') === '2') {
            let data = JSON.parse($(this).find('.detail-serial').text())
            let data_selected = JSON.parse(NOW_ROW.find('.selected-serial').text())
            LoadSerialTable(data, data_selected)
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
    }
});

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
                $('#note').val(data?.['note'])

                LoadTableLineDetail(data?.['goods_transfer_data'], option)

                $.fn.initMaskMoney2()
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                UsualLoadPageFunction.DisablePage(option==='detail')
            }
        })
}

class GoodsTransferHandle {
    load() {
        LoadTableLineDetail()
    }
    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['note'] = $('#note').val();
        frm.dataForm['date_transfer'] = moment().format('YYYY-MM-DD')
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

                if (prd_wh?.['id'] && wh?.['id'] && target_wh?.['id'] && prd_wh?.['uom']?.['id'] && parseFloat(quantity)) {
                    data_line_detail.push({
                        'product_warehouse': prd_wh?.['id'],
                        'warehouse': wh?.['id'],
                        'product': prd_wh?.['product']?.['id'],
                        'sale_order': row.find('.row_sale_order').val() ? row.find('.row_sale_order').val() : null,
                        'end_warehouse': target_wh?.['id'],
                        'uom': prd_wh?.['uom']?.['id'],
                        'lot_data': lot_changes,
                        'sn_data': sn_changes,
                        'quantity': parseFloat(quantity)
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
