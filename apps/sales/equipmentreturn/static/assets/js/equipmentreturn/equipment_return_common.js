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
            scrollY: '63vh',
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
                    className: 'w-45',
                    render: (data, type, row) => {
                        return `<a class="icon-collapse" data-bs-toggle="collapse" href=".${row?.['loan_product_data']?.['id']}" role="button" aria-expanded="false" aria-controls=".${row?.['loan_product_data']?.['id']}">
                                    <i class="bi bi-info-circle"></i>
                                </a>
                                <span class="badge badge-sm badge-light ml-1 loan-product-code">${row?.['loan_product_data']?.['code'] || ''}</span>
                                <span class="loan-product-title" data-loan-item-id="${row?.['id']}">${row?.['loan_product_data']?.['title'] || ''}</span>
                                <div class="collapse ${row?.['loan_product_data']?.['id']}"><span class="small">${row?.['loan_product_data']?.['description'] || ''}</span></div>`
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="loan-quantity">${row?.['loan_quantity']}</span>`
                    }
                },
                {
                    className: 'w-40',
                    render: (data, type, row) => {
                        if (Number((row?.['loan_product_data'] || {})?.['general_traceability_method']) === 0) {
                            return `<input type="number" class="form-control none-return-quantity" placeholder="${$.fn.gettext('Enter return quantity')}" min="0" max="${row?.['loan_quantity'] || 0}" data-loan-item-id="${row?.['id']}">`
                        }
                        else if (Number((row?.['loan_product_data'] || {})?.['general_traceability_method']) === 1) {
                            let lot_html = ``
                            for (let i = 0; i < row?.['loan_product_lot_detail'].length; i++) {
                                let item = row?.['loan_product_lot_detail'][i]
                                lot_html += `<div class="col-12 mb-1">
                                                <div class="input-group">
                                                    <span class="input-group-text">${(item?.['lot_data'] || {})?.['lot_number'] || ''} (${item?.['picked_quantity'] || 0})</span>
                                                    <input type="number" class="form-control lot-return-quantity" placeholder="${$.fn.gettext('Enter return quantity for Lot')}" min="0" max="${item?.['picked_quantity'] || 0}" data-loan-item-id="${row?.['id']}">
                                                </div>
                                            </div>`
                            }
                            return `<div class="row">
                                        ${lot_html}
                                    </div>`
                        }
                        else if (Number((row?.['loan_product_data'] || {})?.['general_traceability_method']) === 2) {
                            let serial_html = ``
                            for (let i = 0; i < row?.['loan_product_sn_detail'].length; i++) {
                                let item = row?.['loan_product_sn_detail'][i]
                                serial_html += `<div class="col-12 mb-1">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input" data-loan-item-id="${row?.['id']}" id="${item?.['serial_id']}">
                                                        <label class="form-check-label serial-return-check" for="${item?.['serial_id']}">${(item?.['serial_data'] || {})?.['serial_number'] || ''}</label>
                                                    </div>
                                                </div>`
                            }
                            return `<div class="row">
                                        ${serial_html}
                                    </div>`
                        }
                    }
                },
            ],
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
                        return `<div class="input-group">
                                    <span class="input-group-text" style="width: 100px">
                                        <a class="icon-collapse" data-bs-toggle="collapse" href=".${row?.['loan_product_id']}" role="button" aria-expanded="false" aria-controls=".${row?.['loan_product_id']}">
                                            <i class="bi bi-info-circle"></i>
                                        </a>
                                        <span class="badge badge-sm badge-light ml-1">${row?.['loan_product_code'] || ''}</span>
                                    </span>
                                    <span data-loan-product-id="${row?.['loan_product_id']}" class="loan-product">${row?.['loan_product_title'] || ''}</span>
                                </div>
                                <div class="collapse ${row?.['loan_product_id']}"><span class="small">${row?.['loan_product_description'] || ''}</span></div>`
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span></span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span></span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span></span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled readonly' : ''} class="form-select select2 return-to-warehouse"></select>`
                    }
                },
            ],
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

                    new $x.cls.file($('#attachment')).init({
                        enable_edit: option !== 'detail',
                        data: data.attachment,
                        name: 'attachment'
                    })

                    $.fn.initMaskMoney2();

                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                    UsualLoadPageFunction.DisablePage(
                        option==='detail'
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
        })
        $(document).on("change", '.el-selected-radio', function () {
            EquipmentReturnPageFunction.LoadEquipmentLoanItemsTable($(this).attr('data-equipment-loan') ? JSON.parse($(this).attr('data-equipment-loan'))?.['equipment_loan_item_list'] || [] : [])
        })
    }
}
