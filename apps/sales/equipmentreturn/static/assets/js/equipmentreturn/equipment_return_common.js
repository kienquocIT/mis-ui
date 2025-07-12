/**
 * Khai báo các element trong page
 */
class EquipmentReturnPageElements {
    constructor() {
        // info
        this.$script_url = $('#script-url')
        this.$trans_url = $('#trans-url')
        this.$title = $('#title')
        this.$account = $('#account')
        this.$document_date = $('#document-date')
        // modal
        this.$account_select_btn = $('#account-select-btn')
        this.$account_select_modal = $('#account-select-modal')
        this.$accept_select_account_btn = $('#accept-select-account-btn')
        this.$table_select_account = $('#table-select-account')
        this.$table_select_el = $('#table-select-el')
        this.$table_el_detail = $('#table_el_detail')
        this.$table_none_detail = $('#table_none_detail')
        this.$table_lot_detail = $('#table_lot_detail')
        this.$table_serial_detail = $('#table_serial_detail')
        // line detail
        this.$table_line_detail = $('#table_line_detail')
    }
}
const pageElements = new EquipmentReturnPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class EquipmentReturnPageVariables {
    constructor() {
        this.none_loan_items_detail = []
        this.lot_loan_items_detail = []
        this.serial_loan_items_detail = []
    }
}
const pageVariables = new EquipmentReturnPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class EquipmentReturnPageFunction {
    static LoadAccountTable() {
        pageElements.$table_select_account.DataTable().clear().destroy()
        pageElements.$table_select_account.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '50vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: pageElements.$table_select_account.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('account_dd_list')) {
                        return data?.['account_dd_list'];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                    <input type="radio" name="account-selected-radio" class="form-check-input" data-account='${JSON.stringify(row)}'/>
                                </div>`
                    }
                },
                {
                    data: 'name',
                    className: 'w-70',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary mr-2">${row?.['code']}</span><span>${row?.['name']}</span>`
                    }
                },
                {
                    data: 'tax_code',
                    className: 'w-20',
                    render: (data, type, row) => {
                        return row?.['tax_code']
                    }
                },
            ],
        })
    }
    static LoadEquipmentLoanTableByAccount(account_id=null) {
        pageElements.$table_select_el.DataTable().clear().destroy()
        pageElements.$table_select_el.DataTableDefault({
            styleDom: 'hide-foot',
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '28vh',
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            ajax: {
                url: account_id ? pageElements.$table_select_el.attr('data-url') + `?account_mapped_id=${account_id}` : pageElements.$table_select_el.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('equipment_loan_list_by_account')) {
                        return data?.['equipment_loan_list_by_account'];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                <input type="radio" name="el-selected-radio" class="form-check-input el-selected-radio" data-equipment-loan='${JSON.stringify(row)}'/>
                            </div>`
                    }
                },
                {
                    className: 'w-70',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary mr-2">${row?.['code']}</span><span>${row?.['title']}</span>`
                    }
                },
                {
                    className: 'text-right w-20',
                    render: (data, type, row) => {
                        return moment(row?.['loan_date'], "YYYY-MM-DD").format('DD/MM/YYYY')
                    }
                },
            ],
        })
    }
    static LoadEquipmentLoanItemsTable(data_list=[]) {
        pageElements.$table_el_detail.DataTable().clear().destroy()
        pageElements.$table_el_detail.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '28vh',
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                <input type="radio" name="el-item-selected-radio"
                                        class="form-check-input el-item-selected-radio"
                                        data-loan-item-id="${row?.['id']}"
                                        data-loan-item-product-data='${JSON.stringify(row?.['loan_product_data'])}'
                                        data-loan-product-none-detail='${JSON.stringify(row?.['loan_product_none_detail'] || [])}'
                                        data-loan-product-lot-detail='${JSON.stringify(row?.['loan_product_lot_detail'] || [])}'
                                        data-loan-product-serial-detail='${JSON.stringify(row?.['loan_product_sn_detail'] || [])}'
                                        />
                            </div>`
                    }
                },
                {
                    className: 'w-60',
                    render: (data, type, row) => {
                        return `<a class="icon-collapse" data-bs-toggle="collapse" href=".${row?.['loan_product_data']?.['id']}" role="button" aria-expanded="false" aria-controls=".${row?.['loan_product_data']?.['id']}">
                                    <i class="bi bi-info-circle"></i>
                                </a>
                                <span class="badge badge-sm badge-light ml-1 loan-product-code">${row?.['loan_product_data']?.['code'] || ''}</span>
                                <span class="loan-product-title">${row?.['loan_product_data']?.['title'] || ''}</span>
                                <div class="collapse ${row?.['loan_product_data']?.['id']}"><span class="small">${row?.['loan_product_data']?.['description'] || ''}</span></div>`
                    }
                },
                {
                    className: 'w-30 text-right',
                    render: (data, type, row) => {
                        return `<span>${row?.['sum_returned_quantity'] || 0}</span> / <span>${row?.['loan_quantity'] || 0}</span>`
                    }
                },
            ],
        })
    }
    static LoadEquipmentLoanItemsNoneTable(data_list=[], data_loan_item_product_data={}) {
        pageElements.$table_none_detail.closest('.div_detail').prop('hidden', data_list.length === 0)
        pageElements.$table_none_detail.DataTable().clear().destroy()
        pageElements.$table_none_detail.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '63vh',
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-soft-blue warehouse_code" data-warehouse-id="${(row?.['warehouse_data'] || {})?.['id'] || ''}">${(row?.['warehouse_data'] || {})?.['code'] || ''}</span><br><span class="warehouse_title">${(row?.['warehouse_data'] || {})?.['title'] || ''}</span>`
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span>${row?.['returned_quantity'] || 0}</span> / <span>${row?.['picked_quantity'] || 0}</span>`
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                            return `<input type="number" class="form-control none-return-quantity"
                                         min="0" max="${row?.['picked_quantity'] || 0}"
                                         data-loan-item-product-data='${JSON.stringify(data_loan_item_product_data)}'
                                         data-loan-item-detail-id="${row?.['id'] || ''}">`
                    }
                },
            ],
            initComplete: function () {
                for (let i=0; i < pageVariables.none_loan_items_detail.length; i++) {
                    pageElements.$table_none_detail.find(
                        `tbody tr .none-return-quantity[data-loan-item-detail-id="${pageVariables.none_loan_items_detail[i]?.['loan_item_detail_mapped_id']}"]`
                    ).val(pageVariables.none_loan_items_detail[i]?.['return_product_pw_quantity'])
                }
            }
        })
    }
    static LoadEquipmentLoanItemsLotTable(data_list=[], data_loan_item_product_data={}) {
        pageElements.$table_lot_detail.closest('.div_detail').prop('hidden', data_list.length === 0)
        pageElements.$table_lot_detail.DataTable().clear().destroy()
        pageElements.$table_lot_detail.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '63vh',
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-soft-blue warehouse_code" data-warehouse-id="${(row?.['warehouse_data'] || {})?.['id'] || ''}">${(row?.['warehouse_data'] || {})?.['code'] || ''}</span><br><span class="warehouse_title">${(row?.['warehouse_data'] || {})?.['title'] || ''}</span>`
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<span>${(row?.['lot_data'] || {})?.['lot_number'] || ''}</span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span>${row?.['lot_returned_quantity'] || 0} / ${row?.['picked_quantity'] || 0}</span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<input type="number" class="form-control lot-return-quantity"
                                       min="0" max="${row?.['picked_quantity'] || 0}"
                                       data-loan-item-product-data='${JSON.stringify(data_loan_item_product_data)}'
                                       data-lot-number="${(row?.['lot_data'] || {})?.['lot_number'] || ''}"
                                       data-loan-item-detail-id="${row?.['id'] || ''}">`
                    }
                },
            ],
            initComplete: function () {
                for (let i=0; i < pageVariables.lot_loan_items_detail.length; i++) {
                    pageElements.$table_lot_detail.find(
                        `tbody tr .lot-return-quantity[data-loan-item-detail-id="${pageVariables.lot_loan_items_detail[i]?.['loan_item_detail_mapped_id']}"]`
                    ).val(pageVariables.lot_loan_items_detail[i]?.['return_product_pw_lot_quantity'])
                }
            }
        })
    }
    static LoadEquipmentLoanItemsSerialTable(data_list=[], data_loan_item_product_data={}) {
        pageElements.$table_serial_detail.closest('.div_detail').prop('hidden', data_list.length === 0)
        pageElements.$table_serial_detail.DataTable().clear().destroy()
        pageElements.$table_serial_detail.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '63vh',
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-soft-blue warehouse_code" data-warehouse-id="${(row?.['warehouse_data'] || {})?.['id'] || ''}">${(row?.['warehouse_data'] || {})?.['code'] || ''}</span><br><span class="warehouse_title">${(row?.['warehouse_data'] || {})?.['title'] || ''}</span>`
                    }
                },
                {
                    className: 'w-60',
                    render: (data, type, row) => {
                        return `<span>${(row?.['serial_data'] || {})?.['serial_number'] || ''}</span>`
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `${row?.['is_returned_serial'] ? '<i class="fa-solid fa-check"></i>' : `
                                        <div class="form-check form-check-sm">
                                            <input type="checkbox"
                                                class="form-check-input serial-return-check"
                                                data-loan-item-product-data='${JSON.stringify(data_loan_item_product_data)}'
                                                data-serial-number="${(row?.['serial_data'] || {})?.['serial_number'] || ''}"
                                                data-loan-item-detail-id="${row?.['id'] || ''}">
                                        </div>`}`
                    }
                },
            ],
            initComplete: function () {
                for (let i=0; i < pageVariables.serial_loan_items_detail.length; i++) {
                    pageElements.$table_serial_detail.find(
                        `tbody tr .serial-return-check[data-loan-item-detail-id="${pageVariables.serial_loan_items_detail[i]?.['loan_item_detail_mapped_id']}"]`
                    ).prop('checked', true)
                }
            }
        })
    }
    static LoadLineDetailTable(data_list=[], option='create') {
        pageElements.$table_line_detail.DataTable().clear().destroy()
        pageElements.$table_line_detail.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '60vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<a class="icon-collapse" data-bs-toggle="collapse" href=".${(row?.['data_product'] || {})?.['id'] || ''}" role="button" aria-expanded="false" aria-controls=".${(row?.['data_product'] || {})?.['id'] || ''}">
                                    <i class="bi bi-info-circle"></i>
                                </a>
                                <span class="badge badge-sm badge-light ml-1">${(row?.['data_product'] || {})?.['code'] || ''}</span>
                                <span data-loan-product-id="${(row?.['data_product'] || {})?.['id'] || ''}" class="loan-product">${(row?.['data_product'] || {})?.['title'] || ''}</span>
                                <div class="collapse ${(row?.['data_product'] || {})?.['id'] || ''}"><span class="small">${(row?.['data_product'] || {})?.['description'] || ''}</span></div>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        if (Number((row?.['data_product'] || {})?.['general_traceability_method'] || 0) === 0) {
                            return ''
                        }
                        else if (Number((row?.['data_product'] || {})?.['general_traceability_method'] || 0) === 1) {
                            return `<span>${row?.['lot_number'] || ''}</span>`
                        }
                        else if (Number((row?.['data_product'] || {})?.['general_traceability_method'] || 0) === 2) {
                            return `<span>${row?.['serial_number'] || ''}</span>`
                        }
                        return ''
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        if (Number((row?.['data_product'] || {})?.['general_traceability_method'] || 0) === 0) {
                            return `<span>${row?.['return_product_pw_quantity'] || ''}</span>`
                        }
                        else if (Number((row?.['data_product'] || {})?.['general_traceability_method'] || 0) === 1) {
                            return `<span>${row?.['return_product_pw_lot_quantity'] || ''}</span>`
                        }
                        else if (Number((row?.['data_product'] || {})?.['general_traceability_method'] || 0) === 2) {
                            return `<span>1</span>`
                        }
                        return ''
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-soft-blue">${row?.['warehouse_before_code'] || ''}</span><br><span>${row?.['warehouse_before_title'] || ''}</span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 return-to-warehouse"></select>`
                    }
                },
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    pageElements.$table_line_detail.find('tbody tr').each(function (index, ele) {
                        UsualLoadPageFunction.LoadWarehouse({
                            element: $(ele).find('.return-to-warehouse'),
                            data_url: pageElements.$script_url.attr('data-url-warehouse-list'),
                            data: data_list[index]?.['return_to_warehouse_data'] || null
                        })
                    })
                }
            }
        })
    }
}

/**
 * Khai báo các hàm chính
 */
class EquipmentReturnHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['title'] = pageElements.$title.val()
        frm.dataForm['account_mapped'] = pageElements.$account.attr('data-id')
        frm.dataForm['document_date'] = moment(pageElements.$document_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')

        let equipment_return_item_list = pageVariables.none_loan_items_detail.concat(pageVariables.lot_loan_items_detail).concat(pageVariables.serial_loan_items_detail)
        pageElements.$table_line_detail.find('tbody tr').each(function (index, ele) {
            equipment_return_item_list[index]['return_to_warehouse'] = $(ele).find('.return-to-warehouse').val()
        })

        frm.dataForm['none_loan_items_detail'] = equipment_return_item_list.filter(item => {return item?.['type'] === 0})
        frm.dataForm['lot_loan_items_detail'] = equipment_return_item_list.filter(item => {return item?.['type'] === 1})
        frm.dataForm['serial_loan_items_detail'] = equipment_return_item_list.filter(item => {return item?.['type'] === 2})

        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        return frm
    }
    static LoadDetailEquipmentReturn(option) {
        let url_loaded = $('#form-detail-equipment-return').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['equipment_return_detail'];

                    // console.log(data)

                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    pageElements.$title.val(data?.['title'])
                    pageElements.$account.val(data?.['account_mapped_data']?.['name'])
                    pageElements.$account.attr('data-id', data?.['account_mapped_data']?.['id'])
                    pageElements.$document_date.val(moment(data?.['document_date'], 'YYYY/MM/DD').format('DD/MM/YYYY'))

                    pageVariables.none_loan_items_detail = data?.['none_loan_items_detail']
                    pageVariables.lot_loan_items_detail = data?.['lot_loan_items_detail']
                    pageVariables.serial_loan_items_detail = data?.['serial_loan_items_detail']
                    let data_line_detail = pageVariables.none_loan_items_detail.concat(pageVariables.lot_loan_items_detail).concat(pageVariables.serial_loan_items_detail)
                    EquipmentReturnPageFunction.LoadLineDetailTable(data_line_detail, option)

                    new $x.cls.file($('#attachment')).init({
                        enable_edit: option !== 'detail',
                        data: data.attachment,
                        name: 'attachment'
                    })

                    $.fn.initMaskMoney2();

                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                    UsualLoadPageFunction.DisablePage(
                        option==='detail',
                        ['.modal-header button', '.modal-footer button']
                    )
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class EquipmentReturnEventHandler {
    static InitPageEven() {
        pageElements.$account_select_btn.on('click', function () {
            EquipmentReturnPageFunction.LoadAccountTable()
        })
        pageElements.$accept_select_account_btn.on('click', function () {
            let selected_obj = null
            $('input[name="account-selected-radio"]').each(async function () {
                if ($(this).prop('checked')) {
                    selected_obj = $(this).attr('data-account') ? JSON.parse($(this).attr('data-account')) : {}
                    pageElements.$account.val(selected_obj?.['name']).attr('data-id', selected_obj?.['id']).prop('readonly', true).prop('disabled', true)
                    pageElements.$account_select_modal.modal('hide')
                }
            })
            if (!selected_obj) {
                $.fn.notifyB({description: 'Nothing selected'}, 'warning');
            }
        })
        $(document).on("click", '#btn-select-detail', function () {
            EquipmentReturnPageFunction.LoadEquipmentLoanTableByAccount(pageElements.$account.attr('data-id') || null)
            EquipmentReturnPageFunction.LoadEquipmentLoanItemsTable()
            EquipmentReturnPageFunction.LoadEquipmentLoanItemsNoneTable()
            EquipmentReturnPageFunction.LoadEquipmentLoanItemsLotTable()
            EquipmentReturnPageFunction.LoadEquipmentLoanItemsSerialTable()
        })
        $(document).on("change", '.el-selected-radio', function () {
            EquipmentReturnPageFunction.LoadEquipmentLoanItemsTable($(this).attr('data-equipment-loan') ? JSON.parse($(this).attr('data-equipment-loan'))?.['equipment_loan_item_list'] || [] : [])
        })
        $(document).on("change", '.el-item-selected-radio', function () {
            EquipmentReturnPageFunction.LoadEquipmentLoanItemsNoneTable(
                $(this).attr('data-loan-product-none-detail') ? JSON.parse($(this).attr('data-loan-product-none-detail')) || [] : [],
                $(this).attr('data-loan-item-product-data') ? JSON.parse($(this).attr('data-loan-item-product-data')) || {} : {},
            )
            EquipmentReturnPageFunction.LoadEquipmentLoanItemsLotTable(
                $(this).attr('data-loan-product-lot-detail') ? JSON.parse($(this).attr('data-loan-product-lot-detail')) || [] : [],
                $(this).attr('data-loan-item-product-data') ? JSON.parse($(this).attr('data-loan-item-product-data')) || {} : {},
            )
            EquipmentReturnPageFunction.LoadEquipmentLoanItemsSerialTable(
                $(this).attr('data-loan-product-serial-detail') ? JSON.parse($(this).attr('data-loan-product-serial-detail')) || [] : [],
                $(this).attr('data-loan-item-product-data') ? JSON.parse($(this).attr('data-loan-item-product-data')) || {} : {},
            )
        })
        $(document).on("change", '.none-return-quantity', function () {
            if (Number($(this).val() || 0) > Number($(this).attr('max') || 0)) {
                $(this).val('')
                $.fn.notifyB({description: 'Invalid value'}, 'warning');
            }
            pageVariables.none_loan_items_detail = []
            pageElements.$table_none_detail.find('tbody tr').each(function (index, ele) {
                if (Number($(ele).find('.none-return-quantity').val() || 0) > 0) {
                    let data_product = $(ele).find('.none-return-quantity').attr('data-loan-item-product-data') ? JSON.parse($(ele).find('.none-return-quantity').attr('data-loan-item-product-data')) : {}
                    pageVariables.none_loan_items_detail.push({
                        'type': 0,
                        'loan_item_detail_mapped_id': $(ele).find('.none-return-quantity').attr('data-loan-item-detail-id'),
                        'return_product_pw_quantity': $(ele).find('.none-return-quantity').val(),
                        // table_data
                        'data_product': data_product,
                        'warehouse_before_id': $(ele).find('.warehouse_code').attr('data-warehouse-id') || '',
                        'warehouse_before_code': $(ele).find('.warehouse_code').text() || '',
                        'warehouse_before_title': $(ele).find('.warehouse_title').text() || '',
                    })
                }
            })
        })
        $(document).on("change", '.lot-return-quantity', function () {
            if (Number($(this).val() || 0) > Number($(this).attr('max') || 0)) {
                $(this).val('')
                $.fn.notifyB({description: 'Invalid value'}, 'warning');
            }
            pageVariables.lot_loan_items_detail = []
            pageElements.$table_lot_detail.find('tbody tr').each(function (index, ele) {
                if (Number($(ele).find('.lot-return-quantity').val() || 0) > 0) {
                    let data_product = $(ele).find('.lot-return-quantity').attr('data-loan-item-product-data') ? JSON.parse($(ele).find('.lot-return-quantity').attr('data-loan-item-product-data')) : {}
                    pageVariables.lot_loan_items_detail.push({
                        'type': 1,
                        'loan_item_detail_mapped_id': $(ele).find('.lot-return-quantity').attr('data-loan-item-detail-id'),
                        'return_product_pw_lot_quantity': $(ele).find('.lot-return-quantity').val(),
                        // table_data
                        'data_product': data_product,
                        'warehouse_before_id': $(ele).find('.warehouse_code').attr('data-warehouse-id') || '',
                        'warehouse_before_code': $(ele).find('.warehouse_code').text() || '',
                        'warehouse_before_title': $(ele).find('.warehouse_title').text() || '',
                        'lot_number': $(ele).find('.lot-return-quantity').attr('data-lot-number') || '',
                    })
                }
            })
        })
        $(document).on("change", '.serial-return-check', function () {
            pageVariables.serial_loan_items_detail = []
            pageElements.$table_serial_detail.find('tbody tr').each(function (index, ele) {
                if ($(ele).find('.serial-return-check').prop('checked')) {
                    let data_product = $(ele).find('.serial-return-check').attr('data-loan-item-product-data') ? JSON.parse($(ele).find('.serial-return-check').attr('data-loan-item-product-data')) : {}
                    pageVariables.serial_loan_items_detail.push({
                        'type': 2,
                        'loan_item_detail_mapped_id': $(ele).find('.serial-return-check').attr('data-loan-item-detail-id'),
                        // table_data
                        'data_product': data_product,
                        'warehouse_before_id': $(ele).find('.warehouse_code').attr('data-warehouse-id') || '',
                        'warehouse_before_code': $(ele).find('.warehouse_code').text() || '',
                        'warehouse_before_title': $(ele).find('.warehouse_title').text() || '',
                        'serial_number': $(ele).find('.serial-return-check').attr('data-serial-number') || '',
                    })
                }
            })
        })
        $(document).on("click", '#btn-accept-er-item', function () {
            let data_line_detail = pageVariables.none_loan_items_detail.concat(pageVariables.lot_loan_items_detail).concat(pageVariables.serial_loan_items_detail)
            EquipmentReturnPageFunction.LoadLineDetailTable(data_line_detail)
        })
    }
}
