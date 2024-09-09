const initEmployee = JSON.parse($('#employee_current').text());
const script_trans = $('#script-trans')
const script_url = $('#script-url')
const creatorEle = $('#creator-select-box')
const supplierEle = $('#supplier-select-box')
const employeeEle = $('#employee-select-box')
const tableLineDetail = $('#tab_line_detail_datatable')
const AP_db = $('#advance_payment_list_datatable')
const quotation_mapped_select = $('#quotation_mapped_select')
const sale_order_mapped_select = $('#sale_order_mapped_select')
const opp_mapped_select = $('#opportunity_id')
const tab_plan_datatable = $('#tab_plan_datatable')
const offcanvasRightLabel = $('#offcanvasRightLabel')
const checkbox_internal = $('#internal')
const supplier_label = $('#supplier-label')
const employee_label = $('#employee-label')
const employee_detail_span = $('#employee-detail-span')
const supplier_detail_span = $('#supplier-detail-span')
let current_value_converted_from_ap = '';
let AP_filter = null
let DETAIL_DATA = null
let payment_for = null

class PaymentLoadPage {
    static LoadCreatedDate() {
        $('#created_date_id').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: false,
            minYear: 1901,
            locale: {
                format: 'YYYY-MM-DD'
            },
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY'), 10)
        }).prop('disabled', true);
    }
    static LoadCreator(data) {
        creatorEle.val(data['full_name']);
        let btn_detail = $('#btn-detail-creator-tab');
        $('#creator-detail-span').prop('hidden', false);
        $('#creator-name').text(data?.['full_name']);
        $('#creator-code').text(data?.['code']);
        $('#creator-department').text(data?.['group']['title']);
        let url = btn_detail.attr('data-url').replace('0', data?.['id']);
        btn_detail.attr('href', url);
    }
    static LoadOpportunity(data) {
        opp_mapped_select.initSelect2({
            allowClear: true,
            data: data,
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            quotation_mapped_select.empty()
            sale_order_mapped_select.empty()
            if (opp_mapped_select.val()) {
                let selected = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())
                if (selected?.['is_close']) {
                    $.fn.notifyB({description: `Opportunity ${selected?.['code']} has been closed. Can not select.`}, 'failure');
                    opp_mapped_select.empty()
                    payment_for = null
                }
                else {
                    sale_order_mapped_select.prop('disabled', true)
                    quotation_mapped_select.prop('disabled', true)
                    let quo_mapped = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())['quotation'];
                    let so_mapped = SelectDDControl.get_data_from_idx(opp_mapped_select, opp_mapped_select.val())['sale_order'];
                    PaymentLoadPage.LoadQuotation(quo_mapped)
                    PaymentLoadTab.LoadPlanQuotation(opp_mapped_select.val(), quo_mapped?.['id'])
                    PaymentLoadPage.LoadSaleOrder(so_mapped);
                    payment_for = 'opportunity'
                }
            }
            else {
                quotation_mapped_select.prop('disabled', false)
                sale_order_mapped_select.prop('disabled', false)
                payment_for = null
                PaymentLoadTab.DrawTablePlan()
            }
        })
    }
    static LoadQuotation(data) {
        quotation_mapped_select.initSelect2({
            allowClear: true,
            ajax: {
                url: quotation_mapped_select.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'quotation_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            opp_mapped_select.empty();
            sale_order_mapped_select.empty();
            if (quotation_mapped_select.val()) {
                opp_mapped_select.prop('disabled', true)
                sale_order_mapped_select.prop('disabled', true)
                let selected = SelectDDControl.get_data_from_idx(quotation_mapped_select, quotation_mapped_select.val())
                PaymentLoadPage.LoadSaleOrder(selected?.['sale_order'])
                PaymentLoadTab.LoadPlanQuotationOnly($(this).val())
                payment_for = 'quotation'
            }
            else {
                opp_mapped_select.prop('disabled', false)
                sale_order_mapped_select.prop('disabled', false)
                payment_for = null
                PaymentLoadTab.DrawTablePlan()
            }
        })
    }
    static LoadSaleOrder(data) {
        sale_order_mapped_select.initSelect2({
            allowClear: true,
            ajax: {
                url: sale_order_mapped_select.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'sale_order_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            opp_mapped_select.empty()
            quotation_mapped_select.empty()
            if (sale_order_mapped_select.val()) {
                opp_mapped_select.prop('disabled', true)
                quotation_mapped_select.prop('disabled', true)
                let selected = SelectDDControl.get_data_from_idx(sale_order_mapped_select, sale_order_mapped_select.val())
                PaymentLoadPage.LoadQuotation(selected?.['quotation'])
                PaymentLoadTab.LoadPlanSaleOrderOnly($(this).val())
                payment_for = 'saleorder'
            }
            else {
                opp_mapped_select.prop('disabled', false)
                quotation_mapped_select.prop('disabled', false)
                payment_for = null
                PaymentLoadTab.DrawTablePlan()
            }
        })
    }
    static LoadEmployee(data) {
        employeeEle.initSelect2({
            ajax: {
                url: employeeEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            templateResult: function (data) {
                let ele = $('<div class="row col-12"></div>');
                ele.append(`<div class="col-2"><span class="badge badge-soft-primary">${data.data?.['code']}</span></div><div class="col-6">${data.data?.['full_name']}</div>`);
                if (data.data?.['group']['title'] !== undefined) {
                    ele.append(`<div class="col-4">(${data.data?.['group']['title']})</div>`);
                }
                return ele;
            },
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        }).on('change', function () {
            let employee_selected = SelectDDControl.get_data_from_idx(employeeEle, employeeEle.val())
            let btn_detail = $('#btn-detail-employee-tab');
            employee_detail_span.prop('hidden', false);
            $('#employee-name').text(employee_selected?.['full_name'])
            $('#employee-code').text(employee_selected?.['code']);
            $('#employee-department').text(employee_selected?.['group']['title']);
            let url = btn_detail.attr('data-url').replace('0', employee_selected?.['id']);
            btn_detail.attr('href', url);
        })
    }
    static LoadSupplier(data) {
        supplierEle.initSelect2({
            ajax: {
                url: supplierEle.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let result = [];
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    if (resp.data[keyResp][i].account_type.includes('Supplier')) {
                        result.push(resp.data[keyResp][i])
                    }
                }
                if (result.length > 0) {
                    $('.select2-results__message').prop('hidden', true);
                }
                return result;
            },
            data: (data ? data : null),
            keyResp: 'account_list',
            keyId: 'id',
            keyText: 'name',
        }).on('change', function () {
            let obj_selected = JSON.parse($('#' + supplierEle.attr('data-idx-data-loaded')).text())[supplierEle.val()];
            PaymentLoadPage.LoadInforSupplier(obj_selected);
            PaymentLoadTab.LoadBankInfor(obj_selected?.['bank_accounts_mapped']);
        })
    }
    static LoadInforSupplier(data) {
        let btn_detail = $('#btn-detail-supplier-tab');
        supplier_detail_span.prop('hidden', false);
        $('#supplier-name').text(data?.['name']);
        $('#supplier-code').text(data?.['code']);
        $('#supplier-owner').text(data?.['owner']['fullname']);
        $('#supplier-industry').text(data?.['industry']['title']);
        let url = btn_detail.attr('data-url').replace('0', data?.['id']);
        btn_detail.attr('href', url);
    }
}

class PaymentAction {
    static ChangeRowPrice(tr) {
        let unit_price = tr.find('.expense-unit-price-input')
        let quantity = tr.find('.expense_quantity');
        let subtotal = tr.find('.expense-subtotal-price');
        let subtotal_after_tax = tr.find('.expense-subtotal-price-after-tax');
        let tax_rate = 0;
        if (tr.find('.expense-tax-select-box').val()) {
            let tax_selected = SelectDDControl.get_data_from_idx(tr.find('.expense-tax-select-box'), tr.find('.expense-tax-select-box').val())
            tax_rate = tax_selected?.['rate'] ? tax_selected?.['rate'] : 0;
        }
        if (unit_price.attr('value') && quantity.val()) {
            let subtotal_value = parseFloat(unit_price.attr('value')) * parseInt(quantity.val())
            subtotal.attr('value', subtotal_value);
            subtotal_after_tax.attr('value', subtotal_value + subtotal_value * tax_rate / 100);
        } else {
            unit_price.attr('value', 0);
            subtotal.attr('value', 0);
            subtotal_after_tax.attr('value', 0);
        }
        PaymentAction.CheckAndOpenExpandRow(tr)
        $.fn.initMaskMoney2();
    }
    static SumAPItemsCast() {
        let result_total_value = 0;
        $('.product-tables').find('.total-converted-value').each(function () {
            result_total_value += parseFloat($(this).attr('data-init-money'));
        })
        return result_total_value;
    }
    static GetAPItems() {
        let ap_expense_items = [];
        $('.product-tables').find('.product-selected').each(function () {
            if ($(this).is(':checked')) {
                let value_converted = parseFloat($(this).closest('tr').find('.converted-value-inp').attr('value'));
                if ($(this).attr('data-id') && value_converted > 0) {
                    ap_expense_items.push({
                        'ap_title': $(this).attr('data-ap-title'),
                        'ap_cost_converted_id': $(this).attr('data-id'),
                        'value_converted': value_converted,
                    });
                }
            }
        })
        return ap_expense_items;
    }
    static ExpandRowFormat(data_row) {
        let detail_converted_html_full = ``
        if (Object.keys(data_row).length > 0) {
            let detail_converted_html = ``;
            for (let x = 0; x < data_row?.['ap_cost_converted_list'].length; x++) {
                detail_converted_html += `<a class="dropdown-item" href="#">${data_row?.['ap_cost_converted_list'][x]?.['ap_title']}: <span class="mask-money text-secondary" data-init-money="${data_row?.['ap_cost_converted_list'][x]?.['value_converted']}"></span></a>`
            }
            if (detail_converted_html) {
                detail_converted_html_full = `<div class="btn-group" role="group">
                    <button data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            class="btn border rounded btn-icon btn-flush-primary flush-soft-hover" type="button">
                        <span class="icon"><i class="bi bi-chevron-down text-primary"></i></span>
                    </button>
                    <div class="dropdown-menu">
                        ${detail_converted_html}
                    </div>
                </div>`;
            }
        }
        return `<div class="row">
                    <div class="col-4">
                        <div class="row">
                            <label class="col-3 col-form-label">${script_trans.attr('data-trans-payment-value')}</label>
                            <div class="col-7">
                                <input class="value-inp form-control form-control-line mask-money text-primary text-right" value="${data_row?.['real_value'] ? data_row?.['real_value'] : 0}">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <div class="row">
                            <label class="col-3 col-form-label">${script_trans.attr('data-trans-converted-from-ap')}</label>
                            <div class="col-7">
                                <input class="value-converted-from-ap-inp form-control form-control-line mask-money text-primary text-right" value="${data_row?.['converted_value'] ? data_row?.['converted_value'] : 0}" disabled readonly>
                            </div>
                            <div class="col-2">
                                <div class="input-group">
                                    <button data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasSelectDetailAP"
                                            aria-controls="offcanvasExample"
                                            class="mr-1 btn border rounded btn-icon btn-flush-primary flush-soft-hover btn-add-payment-value"
                                            type="button">
                                        <span class="icon"><i class="bi bi-pencil-square text-primary"></i></span>
                                    </button>
                                    ${detail_converted_html_full}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <div class="row">
                            <label class="col-3 col-form-label">${script_trans.attr('data-trans-sum')}</label>
                            <div class="col-7">
                                <input class="total-value-salecode-item form-control form-control-line mask-money text-primary text-right" value="${data_row?.['sum_value'] ? data_row?.['sum_value'] : 0}" disabled readonly>
                            </div>
                            <script type="application/json" class="detail-ap-items">${data_row?.['ap_cost_converted_list'] ? JSON.stringify(data_row?.['ap_cost_converted_list']) : ''}</script>
                        </div>
                    </div>
                </div>`
    }
    static FindValueConvertedById(id, converted_list) {
        for (let i = 0; i < converted_list.length; i++) {
            if (converted_list[i].ap_cost_converted_id === id) {
                return converted_list[i].value_converted;
            }
        }
        return 0;
    }
    static CheckAndOpenExpandRow(row, data={}) {
        let this_product_item = row.find('.expense-type-select-box').val()
        let this_quantity = row.find('.expense_quantity').val() ? parseFloat(row.find('.expense_quantity').val()) : 0
        let this_after_tax_subtotal = row.find('.expense-subtotal-price-after-tax').attr('value') ? parseFloat(row.find('.expense-subtotal-price-after-tax').attr('value')) : 0
        let this_uom = row.find('.expense-uom-input').val()
        let this_document_number = row.find('.expense-document-number').val()
        if (this_product_item && this_quantity > 0 && this_after_tax_subtotal > 0 && this_uom && this_document_number) {
            PaymentAction.AddExpandRow(row, data)
        }
        else {
            PaymentAction.RemoveExpandRow(row)
        }
    }
    static AddExpandRow(tr, data) {
        tr.find('.hide-expand-row-btn').prop('disabled', false)
        let row = tableLineDetail.DataTable().row(tr);
        if (!row.child.isShown()) {
            row.child(PaymentAction.ExpandRowFormat(data)).show();
            tr.next().attr('class', `row-detail-product-${tr.find('td:eq(0)').text()}`)
            tr.addClass('shown');
        }
        $.fn.initMaskMoney2()
    }
    static RemoveExpandRow(tr) {
        tr.find('.hide-expand-row-btn').prop('disabled', true)
        let row = tableLineDetail.DataTable().row(tr);
        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown');
        }
        $.fn.initMaskMoney2()
    }
    static AddRow(table, data) {
        table.DataTable().row.add(data).draw();
    }
    static DeleteRow(table, currentRow) {
        currentRow = parseInt(currentRow) - 1
        let rowIndex = table.DataTable().row(currentRow).index();
        let row = table.DataTable().row(rowIndex);
        row.remove().draw();
    }
    static DisabledDetailPage(option) {
        if (option === 'detail') {
            $('input').prop('disabled', true).prop('readonly', true)
            $('select').prop('disabled', true).prop('readonly', true)
            $('.select2').prop('disabled', true);
            $('#btn-add-row-line-detail').prop('disabled', true);
        }
    }
}

class PaymentLoadTab {
    // line detail
    static DrawLineDetailTable(data_list = [], option = 'create') {
        tableLineDetail.DataTable().clear().destroy()
        tableLineDetail.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '40vh',
            scrollX: '100vh',
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': ()=> {
                        return `<button ${option === 'create' ? 'disabled' : ''} class="hide-expand-row-btn btn btn-icon btn-rounded btn-flush-primary flush-soft-hover" type="button">
                                    <span class="icon"><i class="far fa-window-maximize"></i></span>
                                </button>`;
                    },
                },
                {
                    'render': () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 expense-type-select-box"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<textarea ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-name-input" value="${row?.['expense_description'] ? row?.['expense_description'] : ''}"></textarea>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-uom-input" value="${row?.['expense_uom_name'] ? row?.['expense_uom_name'] : ''}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} type="number" min="1" class="form-control expense_quantity" value="${row?.['expense_quantity'] ? row?.['expense_quantity'] : '1'}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-unit-price-input mask-money" value="${row?.['expense_unit_price'] ? row?.['expense_unit_price'] : '0'}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 expense-tax-select-box"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input class="form-control expense-subtotal-price mask-money" readonly disabled value="${row?.['expense_subtotal_price'] ? row?.['expense_subtotal_price'] : '0'}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input class="form-control expense-subtotal-price-after-tax mask-money" readonly disabled value="${row?.['expense_after_tax_price'] ? row?.['expense_after_tax_price'] : '0'}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<textarea ${option === 'detail' ? 'disabled readonly' : ''} class="form-control expense-document-number">${row?.['document_number'] ? row?.['document_number'] : ''}</textarea>`;
                    }
                },
                {
                    'render': () => {
                        return `
                            <button ${option === 'detail' ? 'disabled' : ''} class="btn-del-line-detail btn text-danger btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button>
                        `;
                    }
                },
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    tableLineDetail.find('tbody tr').each(function (index) {
                        $(this).attr('id', `row-${index+1}`)
                        PaymentLoadTab.LoadExpenseItem($(this).find('.expense-type-select-box'), data_list[index]?.['expense_type'])
                        PaymentLoadTab.LoadTax($(this).find('.expense-tax-select-box'), data_list[index]?.['expense_tax'])
                        PaymentAction.CheckAndOpenExpandRow($(this), data_list[index])
                        $('.btn-add-payment-value').prop('disabled', option==='detail');
                    })
                }
            }
        });
    }
    static LoadExpenseItem(ele, data) {
        ele.initSelect2({
            ajax: {
                url: tableLineDetail.attr('data-url-expense-type-list'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'expense_item_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            PaymentAction.CheckAndOpenExpandRow($(this).closest('tr'))
        })
    }
    static LoadTax(ele, data) {
        ele.initSelect2({
            ajax: {
                url: tableLineDetail.attr('data-url-tax-list'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'tax_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static LoadAPList() {
        AP_db.DataTable().clear().destroy();
        let current_sale_code = []
        if (DETAIL_DATA) {
            if (DETAIL_DATA?.['opportunity_mapped']) {
                current_sale_code.push(DETAIL_DATA?.['opportunity_mapped']?.['id'])
            } else if (DETAIL_DATA?.['quotation_mapped']) {
                current_sale_code.push(DETAIL_DATA?.['quotation_mapped']?.['id'])
            } else if (DETAIL_DATA?.['sale_order_mapped']) {
                current_sale_code.push(DETAIL_DATA?.['sale_order_mapped']?.['id'])
            }
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            let type = urlParams.get('type');
            if (type) {
                let opportunity_mapped = opp_mapped_select.val();
                let quotation_mapped = quotation_mapped_select.val();
                let sale_order_mapped = sale_order_mapped_select.val();
                if (opportunity_mapped && type === '0') {
                    current_sale_code.push(opportunity_mapped)
                } else if (quotation_mapped && type === '1') {
                    current_sale_code.push(quotation_mapped)
                } else if (sale_order_mapped && type === '2') {
                    current_sale_code.push(sale_order_mapped)
                }
            } else {
                let opportunity_mapped = opp_mapped_select.val();
                let quotation_mapped = quotation_mapped_select.val();
                let sale_order_mapped = sale_order_mapped_select.val();
                if (opportunity_mapped && opp_mapped_select.prop('disabled') === false) {
                    current_sale_code.push(opportunity_mapped)
                } else if (quotation_mapped && quotation_mapped_select.prop('disabled') === false) {
                    current_sale_code.push(quotation_mapped)
                } else if (sale_order_mapped && sale_order_mapped_select.prop('disabled') === false) {
                    current_sale_code.push(sale_order_mapped)
                }
            }
        }
    
        AP_db.DataTableDefault({
            reloadCurrency: true,
            dom: "",
            paging: false,
            ajax: {
                url: AP_db.attr('data-url'),
                type: AP_db.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.data['advance_payment_list']) {
                            let result = [];
                            if (!AP_filter) {
                                for (let i = 0; i < resp.data['advance_payment_list'].length; i++) {
                                    let item = resp.data['advance_payment_list'][i]
                                    let this_sale_code = []
                                    if (item?.['opportunity_mapped']?.['id']) this_sale_code = this_sale_code.concat(item?.['opportunity_mapped']?.['id'])
                                    if (item?.['quotation_mapped']?.['id']) this_sale_code = this_sale_code.concat(item?.['quotation_mapped']?.['id'])
                                    if (item?.['sale_order_mapped']?.['id']) this_sale_code = this_sale_code.concat(item?.['sale_order_mapped']?.['id'])
                                    if (item?.['remain_value'] > 0 && item?.['employee_inherit']?.['id'] === initEmployee.id) {
                                        if (current_sale_code.length > 0 && this_sale_code.length > 0) {
                                            if (current_sale_code[0] === this_sale_code[0] && item?.['system_status'] === 3) {
                                                result.push(item)
                                            }
                                        }
                                        if (current_sale_code.length === 0 && this_sale_code.length === 0) {
                                            if (item?.['system_status'] === 3) {
                                                result.push(item)
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (let i = 0; i < resp.data['advance_payment_list'].length; i++) {
                                    let item = resp.data['advance_payment_list'][i]
                                    let this_sale_code = []
                                    if (item?.['opportunity_mapped']?.['id']) this_sale_code = this_sale_code.concat(item?.['opportunity_mapped']?.['id'])
                                    if (item?.['quotation_mapped']?.['id']) this_sale_code = this_sale_code.concat(item?.['quotation_mapped']?.['id'])
                                    if (item?.['sale_order_mapped']?.['id']) this_sale_code = this_sale_code.concat(item?.['sale_order_mapped']?.['id'])
                                    if (item?.['remain_value'] > 0 && item?.['employee_inherit']?.['id'] === initEmployee.id && item?.['id'] === AP_filter) {
                                        if (current_sale_code.length > 0 && this_sale_code.length > 0) {
                                            if (current_sale_code[0] === this_sale_code[0] && item?.['system_status'] === 3) {
                                                result.push(item)
                                                break
                                            }
                                        }
                                        if (current_sale_code.length === 0 && this_sale_code.length === 0) {
                                            if (item?.['system_status'] === 3) {
                                                result.push(item)
                                            }
                                        }
                                    }
                                }
                            }
                            return result;
                        } else {
                            return [];
                        }
                    }
                    return [];
                },
            },
            columns: [
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-outline badge-soft-danger">` + row.code + `</span>`;
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span>` + row.title + `</span>`;
                    }
                },
                {
                    data: 'to_payment',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="text-primary mask-money" data-init-money="${row?.['to_payment']}"></span>`
                    }
                },
                {
                    data: 'return_value',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.return_value + `"></span>`
                    }
                },
                {
                    data: 'remain_value',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.remain_value + `"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        let checked = '';
                        let disabled = '';
                        if (AP_filter) {
                            checked = 'checked';
                            disabled = 'disabled';
                        }
                        return `<input ${checked} ${disabled} data-id="` + row.id + `" class="ap-selected" type="checkbox">`
                    }
                },
            ],
        });
    }
    // plan
    static DrawTablePlan(data_list=[]) {
        $('#notify-none-sale-code').prop('hidden', data_list.length > 0 && opp_mapped_select.val() || quotation_mapped_select.val() || sale_order_mapped_select.val())
        tab_plan_datatable.DataTable().clear().destroy()
        tab_plan_datatable.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '30vh',
            scrollX: '100vh',
            scrollCollapse: true,
            data: data_list,
            columns: [
                {

                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span class="text-primary">${row?.['expense_item']?.['title']}</span>`
                        }
                        return `<span class="text-danger">${row?.['expense_item']?.['title']}</span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span class="plan_after_tax mask-money text-primary" data-init-money="${row?.['plan_after_tax']}"></span>`
                        }
                        return `--`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span class="ap_approved mask-money text-primary" data-init-money="${row?.['ap_approved_value']}"></span>`
                        }
                        return `<span class="ap_approved mask-money text-danger" data-init-money="${row?.['ap_approved_value']}"></span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span class="returned mask-money text-primary" data-init-money="${row?.['sum_return_value']}"></span>`
                        }
                        return `<span class="returned mask-money text-danger" data-init-money="${row?.['sum_return_value']}"></span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span class="to_payment mask-money text-primary" data-init-money="${row?.['sum_converted_value']}"></span>`
                        }
                        return `<span class="to_payment mask-money text-danger" data-init-money="${row?.['sum_converted_value']}"></span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span class="other_payment mask-money text-primary" data-init-money="${row?.['sum_real_value']}"></span>`
                        }
                        return `<span class="other_payment mask-money text-danger" data-init-money="${row?.['sum_real_value']}"></span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        if (row?.['type'] === 'planned') {
                            return `<span class="available mask-money text-primary" data-init-money="${row?.['sum_available']}"></span>`
                        }
                        return `--`;
                    }
                },
            ],
        })
    }
    static LoadPlanQuotation(opportunity_id, quotation_id) {
        if (opportunity_id && quotation_id) {
            let dataParam1 = {'quotation_id': quotation_id}
            let expense_quotation = $.fn.callAjax2({
                url: script_url.attr('data-url-expense-quotation'),
                data: dataParam1,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('quotation_expense_list')) {
                        return data?.['quotation_expense_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam2 = {'opportunity_mapped_id': opportunity_id}
            let ap_mapped_item = $.fn.callAjax2({
                url: script_url.attr('data-url-ap-cost-list'),
                data: dataParam2,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('advance_payment_cost_list')) {
                        return data?.['advance_payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam3 = {'opportunity_mapped_id': opportunity_id}
            let payment_mapped_item = $.fn.callAjax2({
                url: script_url.attr('data-url-payment-cost-list'),
                data: dataParam3,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('payment_cost_list')) {
                        return data?.['payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([expense_quotation, ap_mapped_item, payment_mapped_item]).then(
                (results) => {
                    let data_expense = results[0]
                    let data_ap_mapped_item = results[1]
                    let data_payment_mapped_item = results[2]
                    $('#notify-none-sale-code').prop('hidden', true)

                    let data_expense_merge = {};
                    data_expense.forEach(function (item) {
                        let expenseItemId = item?.['expense_item']?.['id'];
                        if (data_expense_merge[expenseItemId] === undefined) {
                            data_expense_merge[expenseItemId] = {
                                id: item?.['id'],
                                expense_title: item?.['expense_title'],
                                expense_item: item?.['expense_item'],
                                tax: item?.['tax'],
                                plan_after_tax: item?.['plan_after_tax']
                            };
                        } else {
                            data_expense_merge[expenseItemId].plan_after_tax += item?.['plan_after_tax'];
                            data_expense_merge[expenseItemId].expense_title += ' (merge) ' + item?.['expense_title'];
                        }
                    });
                    data_expense = Object.values(data_expense_merge);

                    let data_table_planned = []

                    let planned_ap_id = [];
                    let planned_payment_id = [];
                    for (let i = 0; i < data_expense.length; i++) {
                        let ap_approved_value = 0;
                        let sum_return_value = 0;
                        let sum_converted_value = 0;
                        let sum_real_value = 0;
                        for (let j = 0; j < data_ap_mapped_item.length; j++) {
                            if (data_ap_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                ap_approved_value += data_ap_mapped_item[j]?.['expense_after_tax_price'];
                                sum_return_value += data_ap_mapped_item[j]?.['sum_return_value'];
                                planned_ap_id.push(data_ap_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        for (let j = 0; j < data_payment_mapped_item.length; j++) {
                            if (data_payment_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                sum_real_value += data_payment_mapped_item[j]?.['real_value'];
                                sum_converted_value += data_payment_mapped_item[j]?.['converted_value'];
                                planned_payment_id.push(data_payment_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        let sum_available = data_expense[i]?.['plan_after_tax'] - sum_real_value - ap_approved_value + sum_return_value;
                        if (sum_available < 0) {
                            sum_available = 0;
                        }

                        data_table_planned.push({
                            'type': 'planned',
                            'expense_item': data_expense[i]?.['expense_item'],
                            'plan_after_tax': data_expense[i]?.['plan_after_tax'],
                            'ap_approved_value': ap_approved_value,
                            'sum_return_value': sum_return_value,
                            'sum_converted_value': sum_converted_value,
                            'sum_real_value': sum_real_value,
                            'sum_available': sum_available
                        })
                    }

                    let unplanned_ap = [];
                    let unplanned_payment = [];
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        if (!planned_ap_id.includes(data_ap_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_ap.push(data_ap_mapped_item[j])
                        }
                    }
                    for (let j = 0; j < data_payment_mapped_item.length; j++) {
                        if (!planned_payment_id.includes(data_payment_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_payment.push(data_payment_mapped_item[j])
                        }
                    }

                    let unplanned_ap_merged = {};
                    $.each(unplanned_ap, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_ap_merged[typeId]) {
                            unplanned_ap_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_ap_merged[typeId].expense_after_tax_price += element.expense_after_tax_price;
                            unplanned_ap_merged[typeId].expense_name = null;
                            unplanned_ap_merged[typeId].expense_quantity += element.expense_quantity;
                            unplanned_ap_merged[typeId].expense_subtotal_price += element.expense_subtotal_price;
                            unplanned_ap_merged[typeId].expense_tax = null;
                            unplanned_ap_merged[typeId].expense_tax_price += element.expense_tax_price;
                            unplanned_ap_merged[typeId].expense_unit_price = null;
                            unplanned_ap_merged[typeId].expense_uom_name = null;
                            unplanned_ap_merged[typeId].sum_converted_value += element.sum_converted_value;
                            unplanned_ap_merged[typeId].sum_return_value += element.sum_return_value;
                        }
                    });
                    unplanned_ap_merged = $.map(unplanned_ap_merged, function(value) {
                        return value;
                    });

                    let unplanned_payment_merged = {};
                    $.each(unplanned_payment, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_payment_merged[typeId]) {
                            unplanned_payment_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_payment_merged[typeId].converted_value += element.converted_value;
                            unplanned_payment_merged[typeId].real_value += element.real_value;
                        }
                    });
                    unplanned_payment_merged = $.map(unplanned_payment_merged, function(value) {
                        return value;
                    });

                    if (unplanned_ap_merged.length !== 0 || unplanned_payment_merged.length !== 0) {
                        let unplanned_payment_merged_has_ap = [];
                        for (let i = 0; i < unplanned_ap_merged.length; i++) {
                            let unplanned_sum_converted_value = 0;
                            let unplanned_sum_real_value = 0;
                            for (let j = 0; j < unplanned_payment_merged.length; j++) {
                                if (unplanned_payment_merged[j]?.['expense_type']?.['id'] === unplanned_ap_merged[i]?.['expense_type']?.['id']) {
                                    unplanned_sum_converted_value += unplanned_payment_merged[j]?.['converted_value']
                                    unplanned_sum_real_value += unplanned_payment_merged[j]?.['real_value']
                                    unplanned_payment_merged_has_ap.push(unplanned_payment_merged[j]?.['expense_type']?.['id'])
                                }
                            }
                            data_table_planned.push({
                                'type': 'unplanned',
                                'expense_item': unplanned_ap_merged[i]?.['expense_type'],
                                'plan_after_tax': '--',
                                'ap_approved_value': unplanned_ap_merged[i]?.['expense_after_tax_price'],
                                'sum_return_value': unplanned_ap_merged[i]?.['sum_return_value'],
                                'sum_converted_value': unplanned_sum_converted_value,
                                'sum_real_value': unplanned_sum_real_value,
                                'sum_available': '--'
                            })
                        }
                        for (let i = 0; i < unplanned_payment_merged.length; i++) {
                            if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                                data_table_planned.push({
                                    'type': 'unplanned',
                                    'expense_item': unplanned_payment_merged[i]?.['expense_type'],
                                    'plan_after_tax': '--',
                                    'ap_approved_value': 0,
                                    'sum_return_value': 0,
                                    'sum_converted_value': unplanned_payment_merged[i]?.['converted_value'],
                                    'sum_real_value': unplanned_payment_merged[i]?.['real_value'],
                                    'sum_available': '--'
                                })
                            }
                        }
                    }

                    PaymentLoadTab.DrawTablePlan(data_table_planned)
                })
        }
    }
    static LoadPlanQuotationOnly(quotation_id) {
        if (quotation_id) {
            let dataParam1 = {'quotation_id': quotation_id}
            let expense_quotation = $.fn.callAjax2({
                url: script_url.attr('data-url-expense-quotation'),
                data: dataParam1,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('quotation_expense_list')) {
                        return data?.['quotation_expense_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam2 = {'quotation_mapped_id': quotation_id}
            let ap_mapped_item = $.fn.callAjax2({
                url: script_url.attr('data-url-ap-cost-list'),
                data: dataParam2,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('advance_payment_cost_list')) {
                        return data?.['advance_payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam3 = {'quotation_mapped_id': quotation_id}
            let payment_mapped_item = $.fn.callAjax2({
                url: script_url.attr('data-url-payment-cost-list'),
                data: dataParam3,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('payment_cost_list')) {
                        return data?.['payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([expense_quotation, ap_mapped_item, payment_mapped_item]).then(
                (results) => {
                    let data_expense = results[0];
                    let data_ap_mapped_item = results[1];
                    let data_payment_mapped_item = results[2];

                    let data_expense_merge = {};
                    data_expense.forEach(function (item) {
                        let expenseItemId = item?.['expense_item']?.['id'];

                        if (data_expense_merge[expenseItemId] === undefined) {
                            data_expense_merge[expenseItemId] = {
                                id: item?.['id'],
                                expense_title: item?.['expense_title'],
                                expense_item: item?.['expense_item'],
                                tax: item?.['tax'],
                                plan_after_tax: item?.['plan_after_tax']
                            };
                        } else {
                            data_expense_merge[expenseItemId].plan_after_tax += item?.['plan_after_tax'];
                            data_expense_merge[expenseItemId].expense_title += ' (merge) ' + item?.['expense_title'];
                        }
                    });
                    data_expense = Object.values(data_expense_merge);

                    let data_table_planned = []

                    let planned_ap_id = [];
                    let planned_payment_id = [];
                    for (let i = 0; i < data_expense.length; i++) {
                        let ap_approved_value = 0;
                        let sum_return_value = 0;
                        let sum_converted_value = 0;
                        let sum_real_value = 0;
                        for (let j = 0; j < data_ap_mapped_item.length; j++) {
                            if (data_ap_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                ap_approved_value += data_ap_mapped_item[j]?.['expense_after_tax_price'];
                                sum_return_value += data_ap_mapped_item[j]?.['sum_return_value'];
                                planned_ap_id.push(data_ap_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        for (let j = 0; j < data_payment_mapped_item.length; j++) {
                            if (data_payment_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                sum_real_value += data_payment_mapped_item[j]?.['real_value'];
                                sum_converted_value += data_payment_mapped_item[j]?.['converted_value'];
                                planned_payment_id.push(data_payment_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        let sum_available = data_expense[i]?.['plan_after_tax'] - sum_real_value - ap_approved_value + sum_return_value;
                        if (sum_available < 0) {
                            sum_available = 0;
                        }
                        data_table_planned.push({
                            'type': 'planned',
                            'expense_item': data_expense[i]?.['expense_item'],
                            'plan_after_tax': data_expense[i]?.['plan_after_tax'],
                            'ap_approved_value': ap_approved_value,
                            'sum_return_value': sum_return_value,
                            'sum_converted_value': sum_converted_value,
                            'sum_real_value': sum_real_value,
                            'sum_available': sum_available
                        })
                    }

                    let unplanned_ap = [];
                    let unplanned_payment = [];
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        if (!planned_ap_id.includes(data_ap_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_ap.push(data_ap_mapped_item[j])
                        }
                    }
                    for (let j = 0; j < data_payment_mapped_item.length; j++) {
                        if (!planned_payment_id.includes(data_payment_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_payment.push(data_payment_mapped_item[j])
                        }
                    }

                    let unplanned_ap_merged = {};
                    $.each(unplanned_ap, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_ap_merged[typeId]) {
                            unplanned_ap_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_ap_merged[typeId].expense_after_tax_price += element.expense_after_tax_price;
                            unplanned_ap_merged[typeId].expense_name = null;
                            unplanned_ap_merged[typeId].expense_quantity += element.expense_quantity;
                            unplanned_ap_merged[typeId].expense_subtotal_price += element.expense_subtotal_price;
                            unplanned_ap_merged[typeId].expense_tax = null;
                            unplanned_ap_merged[typeId].expense_tax_price += element.expense_tax_price;
                            unplanned_ap_merged[typeId].expense_unit_price = null;
                            unplanned_ap_merged[typeId].expense_uom_name = null;
                            unplanned_ap_merged[typeId].sum_converted_value += element.sum_converted_value;
                            unplanned_ap_merged[typeId].sum_return_value += element.sum_return_value;
                        }
                    });
                    unplanned_ap_merged = $.map(unplanned_ap_merged, function(value) {
                        return value;
                    });

                    let unplanned_payment_merged = {};
                    $.each(unplanned_payment, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_payment_merged[typeId]) {
                            unplanned_payment_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_payment_merged[typeId].converted_value += element.converted_value;
                            unplanned_payment_merged[typeId].real_value += element.real_value;
                        }
                    });
                    unplanned_payment_merged = $.map(unplanned_payment_merged, function(value) {
                        return value;
                    });

                    if (unplanned_ap_merged.length !== 0 || unplanned_payment_merged.length !== 0) {
                        let unplanned_payment_merged_has_ap = [];
                        for (let i = 0; i < unplanned_ap_merged.length; i++) {
                            let unplanned_sum_converted_value = 0;
                            let unplanned_sum_real_value = 0;
                            for (let j = 0; j < unplanned_payment_merged.length; j++) {
                                if (unplanned_payment_merged[j]?.['expense_type']?.['id'] === unplanned_ap_merged[i]?.['expense_type']?.['id']) {
                                    unplanned_sum_converted_value += unplanned_payment_merged[j]?.['converted_value']
                                    unplanned_sum_real_value += unplanned_payment_merged[j]?.['real_value']
                                    unplanned_payment_merged_has_ap.push(unplanned_payment_merged[j]?.['expense_type']?.['id'])
                                }
                            }
                            data_table_planned.push({
                                'type': 'unplanned',
                                'expense_item': unplanned_ap_merged[i]?.['expense_type'],
                                'plan_after_tax': '--',
                                'ap_approved_value': unplanned_ap_merged[i]?.['expense_after_tax_price'],
                                'sum_return_value': unplanned_ap_merged[i]?.['sum_return_value'],
                                'sum_converted_value': unplanned_sum_converted_value,
                                'sum_real_value': unplanned_sum_real_value,
                                'sum_available': '--'
                            })
                        }
                        for (let i = 0; i < unplanned_payment_merged.length; i++) {
                            if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                                data_table_planned.push({
                                    'type': 'unplanned',
                                    'expense_item': unplanned_payment_merged[i]?.['expense_type'],
                                    'plan_after_tax': '--',
                                    'ap_approved_value': 0,
                                    'sum_return_value': 0,
                                    'sum_converted_value': unplanned_payment_merged[i]?.['converted_value'],
                                    'sum_real_value': unplanned_payment_merged[i]?.['real_value'],
                                    'sum_available': '--'
                                })
                            }
                        }
                    }

                    PaymentLoadTab.DrawTablePlan(data_table_planned)
                })
        }
    }
    static LoadPlanSaleOrderOnly(sale_order_id) {
        if (sale_order_id) {
            let dataParam1 = {'sale_order_id': sale_order_id}
            let expense_sale_order = $.fn.callAjax2({
                url: script_url.attr('data-url-expense-sale-order'),
                data: dataParam1,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('sale_order_expense_list')) {
                        return data?.['sale_order_expense_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam2 = {'sale_order_mapped_id': sale_order_id}
            let ap_mapped_item = $.fn.callAjax2({
                url: script_url.attr('data-url-ap-cost-list'),
                data: dataParam2,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('advance_payment_cost_list')) {
                        return data?.['advance_payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParam3 = {'sale_order_mapped_id': sale_order_id}
            let payment_mapped_item = $.fn.callAjax2({
                url: script_url.attr('data-url-payment-cost-list'),
                data: dataParam3,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('payment_cost_list')) {
                        return data?.['payment_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([expense_sale_order, ap_mapped_item, payment_mapped_item]).then(
                (results) => {
                    let data_expense = results[0];
                    let data_ap_mapped_item = results[1];
                    let data_payment_mapped_item = results[2];

                    let data_expense_merge = {};
                    data_expense.forEach(function (item) {
                        let expenseItemId = item?.['expense_item']?.['id'];

                        if (data_expense_merge[expenseItemId] === undefined) {
                            data_expense_merge[expenseItemId] = {
                                id: item?.['id'],
                                expense_title: item?.['expense_title'],
                                expense_item: item?.['expense_item'],
                                tax: item?.['tax'],
                                plan_after_tax: item?.['plan_after_tax']
                            };
                        } else {
                            data_expense_merge[expenseItemId].plan_after_tax += item?.['plan_after_tax'];
                            data_expense_merge[expenseItemId].expense_title += ' (merge) ' + item?.['expense_title'];
                        }
                    });
                    data_expense = Object.values(data_expense_merge);

                    let data_table_planned = []

                    let planned_ap_id = [];
                    let planned_payment_id = [];
                    for (let i = 0; i < data_expense.length; i++) {
                        let ap_approved_value = 0;
                        let sum_return_value = 0;
                        let sum_converted_value = 0;
                        let sum_real_value = 0;
                        for (let j = 0; j < data_ap_mapped_item.length; j++) {
                            if (data_ap_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                ap_approved_value += data_ap_mapped_item[j]?.['expense_after_tax_price'];
                                sum_return_value += data_ap_mapped_item[j]?.['sum_return_value'];
                                planned_ap_id.push(data_ap_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        for (let j = 0; j < data_payment_mapped_item.length; j++) {
                            if (data_payment_mapped_item[j]?.['expense_type']?.['id'] === data_expense[i]?.['expense_item']?.['id']) {
                                sum_real_value += data_payment_mapped_item[j]?.['real_value'];
                                sum_converted_value += data_payment_mapped_item[j]?.['converted_value'];
                                planned_payment_id.push(data_payment_mapped_item[j]?.['expense_type']?.['id'])
                            }
                        }
                        let sum_available = data_expense[i]?.['plan_after_tax'] - sum_real_value - ap_approved_value + sum_return_value;
                        if (sum_available < 0) {
                            sum_available = 0;
                        }
                        data_table_planned.push({
                            'type': 'planned',
                            'expense_item': data_expense[i]?.['expense_item'],
                            'plan_after_tax': data_expense[i]?.['plan_after_tax'],
                            'ap_approved_value': ap_approved_value,
                            'sum_return_value': sum_return_value,
                            'sum_converted_value': sum_converted_value,
                            'sum_real_value': sum_real_value,
                            'sum_available': sum_available
                        })
                    }

                    let unplanned_ap = [];
                    let unplanned_payment = [];
                    for (let j = 0; j < data_ap_mapped_item.length; j++) {
                        if (!planned_ap_id.includes(data_ap_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_ap.push(data_ap_mapped_item[j])
                        }
                    }
                    for (let j = 0; j < data_payment_mapped_item.length; j++) {
                        if (!planned_payment_id.includes(data_payment_mapped_item[j]?.['expense_type']?.['id'])) {
                            unplanned_payment.push(data_payment_mapped_item[j])
                        }
                    }

                    let unplanned_ap_merged = {};
                    $.each(unplanned_ap, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_ap_merged[typeId]) {
                            unplanned_ap_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_ap_merged[typeId].expense_after_tax_price += element.expense_after_tax_price;
                            unplanned_ap_merged[typeId].expense_name = null;
                            unplanned_ap_merged[typeId].expense_quantity += element.expense_quantity;
                            unplanned_ap_merged[typeId].expense_subtotal_price += element.expense_subtotal_price;
                            unplanned_ap_merged[typeId].expense_tax = null;
                            unplanned_ap_merged[typeId].expense_tax_price += element.expense_tax_price;
                            unplanned_ap_merged[typeId].expense_unit_price = null;
                            unplanned_ap_merged[typeId].expense_uom_name = null;
                            unplanned_ap_merged[typeId].sum_converted_value += element.sum_converted_value;
                            unplanned_ap_merged[typeId].sum_return_value += element.sum_return_value;
                        }
                    });
                    unplanned_ap_merged = $.map(unplanned_ap_merged, function(value) {
                        return value;
                    });

                    let unplanned_payment_merged = {};
                    $.each(unplanned_payment, function(index, element) {
                        const typeId = element.expense_type.id;
                        if (!unplanned_payment_merged[typeId]) {
                            unplanned_payment_merged[typeId] = $.extend(true, {}, element);
                        } else {
                            unplanned_payment_merged[typeId].converted_value += element.converted_value;
                            unplanned_payment_merged[typeId].real_value += element.real_value;
                        }
                    });
                    unplanned_payment_merged = $.map(unplanned_payment_merged, function(value) {
                        return value;
                    });

                    if (unplanned_ap_merged.length !== 0 || unplanned_payment_merged.length !== 0) {
                        let unplanned_payment_merged_has_ap = [];
                        for (let i = 0; i < unplanned_ap_merged.length; i++) {
                            let unplanned_sum_converted_value = 0;
                            let unplanned_sum_real_value = 0;
                            for (let j = 0; j < unplanned_payment_merged.length; j++) {
                                if (unplanned_payment_merged[j]?.['expense_type']?.['id'] === unplanned_ap_merged[i]?.['expense_type']?.['id']) {
                                    unplanned_sum_converted_value += unplanned_payment_merged[j]?.['converted_value']
                                    unplanned_sum_real_value += unplanned_payment_merged[j]?.['real_value']
                                    unplanned_payment_merged_has_ap.push(unplanned_payment_merged[j]?.['expense_type']?.['id'])
                                }
                            }
                            data_table_planned.push({
                                'type': 'unplanned',
                                'expense_item': unplanned_ap_merged[i]?.['expense_type'],
                                'plan_after_tax': '--',
                                'ap_approved_value': unplanned_ap_merged[i]?.['expense_after_tax_price'],
                                'sum_return_value': unplanned_ap_merged[i]?.['sum_return_value'],
                                'sum_converted_value': unplanned_sum_converted_value,
                                'sum_real_value': unplanned_sum_real_value,
                                'sum_available': '--'
                            })
                        }
                        for (let i = 0; i < unplanned_payment_merged.length; i++) {
                            if (!unplanned_payment_merged_has_ap.includes(unplanned_payment_merged[i]?.['expense_type']?.['id'])) {
                                data_table_planned.push({
                                    'type': 'unplanned',
                                    'expense_item': unplanned_payment_merged[i]?.['expense_type'],
                                    'plan_after_tax': '--',
                                    'ap_approved_value': 0,
                                    'sum_return_value': 0,
                                    'sum_converted_value': unplanned_payment_merged[i]?.['converted_value'],
                                    'sum_real_value': unplanned_payment_merged[i]?.['real_value'],
                                    'sum_available': '--'
                                })
                            }
                        }
                    }

                    PaymentLoadTab.DrawTablePlan(data_table_planned)
                })
        }
    }
    // bank info
    static LoadBankInfor(data) {
        let ele = $('#list-bank-account-information');
        ele.html(``);
        if (data.length > 0) {
            $('#notify-none-bank-account').prop('hidden', true);
            for (let i = 0; i < data.length; i++) {
                let bank_account = data[i];
                let default_card_color = '';
                let checked = '';
                if (bank_account?.['is_default'] === true) {
                    default_card_color = 'bg-primary text-dark bg-opacity-10';
                    checked = 'checked';
                }
                ele.append(
                    `<div class="card ${default_card_color} close-over col-12 col-lg-5 col-md-5 mr-5">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-1">
                                    <div class="card-text">
                                        <input disabled class="radio_select_default_bank_account" name="bank_account_default" type="radio" ${checked}>                 
                                    </div>
                                </div>
                                <div class="col-11">
                                    <div class="card-text">
                                        Bank account name: <span class="bank_account_name"><b>${bank_account?.['bank_account_name']}</b></span>
                                    </div>
                                    <div class="card-text">
                                        Bank name: <span class="bank_name"><b>${bank_account?.['bank_name']}</b></span>
                                    </div>
                                    <div class="card-text">
                                        Bank account number: <span class="bank_account_number"><b>${bank_account?.['bank_account_number']}</b></span>
                                    </div>
                                    <div class="card-text" hidden>
                                        Country ID: <span class="bank_country_id"><b>${bank_account?.['bank_country_id']}</b></span>
                                    </div>
                                    <div class="card-text" hidden>
                                        Bank code: <span class="bank_code"><b>${bank_account?.['bank_code']}</b></span>
                                    </div>
                                    <div class="card-text" hidden>
                                        BIC/SWIFT Code: <span class="bic_swift_code"><b>${bank_account?.['bic_swift_code']}</b></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
                )
            }
        } else {
            $('#notify-none-bank-account').prop('hidden', false);
        }
    }
}

class PaymentHandle {
    static LoadPage(sale_code_mapped, type, quotation_object, sale_order_object, ap_mapped_id) {
        PaymentLoadPage.LoadCreatedDate()
        PaymentLoadPage.LoadCreator(initEmployee)
        PaymentLoadPage.LoadOpportunity()
        PaymentLoadPage.LoadQuotation()
        PaymentLoadPage.LoadSaleOrder()
        PaymentLoadPage.LoadSupplier()
        PaymentLoadPage.LoadEmployee()
        PaymentLoadTab.DrawLineDetailTable()
        PaymentLoadTab.DrawTablePlan()

        if (sale_code_mapped) {
            if (type === 0) {
                PaymentLoadPage.LoadOpportunity(sale_code_mapped)
                tableLineDetail.find('tbody').html('');
                quotation_mapped_select.find('option').remove();
                sale_order_mapped_select.find('option').remove();
                quotation_mapped_select.prop('disabled', true);
                sale_order_mapped_select.prop('disabled', true);

                PaymentLoadPage.LoadQuotation(quotation_object)
                PaymentLoadPage.LoadSaleOrder(sale_order_object)
                AP_filter = ap_mapped_id?.['id'];

                PaymentLoadTab.LoadPlanQuotation(opp_mapped_select.val(), quotation_object?.['id'])
            } else if (type === 1) {
                tableLineDetail.find('tbody').html('');
                opp_mapped_select.find('option').remove();
                quotation_mapped_select.find('option').remove();
                sale_order_mapped_select.find('option').remove();
                opp_mapped_select.prop('disabled', true);
                quotation_mapped_select.prop('disabled', true);
                sale_order_mapped_select.prop('disabled', true);

                PaymentLoadPage.LoadQuotation(sale_code_mapped)
                quotation_mapped_select.change()
                AP_filter = ap_mapped_id?.['id'];
            } else if (type === 2) {
                tableLineDetail.find('tbody').html('');
                opp_mapped_select.find('option').remove();
                quotation_mapped_select.find('option').remove();
                sale_order_mapped_select.find('option').remove();
                opp_mapped_select.prop('disabled', true);
                quotation_mapped_select.prop('disabled', true);
                sale_order_mapped_select.prop('disabled', true);

                PaymentLoadPage.LoadSaleOrder(sale_code_mapped)
                sale_order_mapped_select.change()
                AP_filter = ap_mapped_id?.['id'];
            }
        }
    }
    static CombinesData(frmEle, for_update = false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val()
        if (payment_for === 'opportunity') {
            frm.dataForm['opportunity_mapped_id'] = opp_mapped_select.val()
            frm.dataForm['sale_code_type'] = 0
        }
        else if (payment_for === 'quotation') {
            frm.dataForm['quotation_mapped_id'] = quotation_mapped_select.val()
            frm.dataForm['sale_code_type'] = 0
        }
        else if (payment_for === 'saleorder') {
            frm.dataForm['sale_order_mapped_id'] = sale_order_mapped_select.val()
            frm.dataForm['sale_code_type'] = 0
        }
        else {
            frm.dataForm['opportunity_mapped_id'] = null
            frm.dataForm['quotation_mapped_id'] = null
            frm.dataForm['sale_order_mapped_id'] = null
            frm.dataForm['sale_code_type'] = 2
        }
        frm.dataForm['employee_inherit_id'] = $('#employee_inherit_id').val()
        frm.dataForm['supplier_id'] = supplierEle.val()
        frm.dataForm['is_internal_payment'] = checkbox_internal.prop('checked')
        frm.dataForm['employee_payment_id'] = employeeEle.val()
        frm.dataForm['method'] = parseInt($('#payment-method').val())

        let payment_item_list = [];
        if (tableLineDetail.find('tr').length > 0) {
            let row_count = tableLineDetail.find('tr').length / 2;
            for (let i = 1; i <= row_count; i++) {
                let expense_detail_value = 0;
                let row_id = '#row-' + i.toString();
                let expense_type = tableLineDetail.find(row_id + ' .expense-type-select-box').val();
                let expense_name_input = tableLineDetail.find(row_id + ' .expense-name-input').val();
                let expense_uom_name = tableLineDetail.find(row_id + ' .expense-uom-input').val();
                let expense_quantity = tableLineDetail.find(row_id + ' .expense_quantity').val();
                let expense_tax = tableLineDetail.find(row_id + ' .expense-tax-select-box option:selected').attr('value');
                let expense_unit_price = parseFloat(tableLineDetail.find(row_id + ' .expense-unit-price-input').attr('value'));
                let expense_subtotal_price = parseFloat(tableLineDetail.find(row_id + ' .expense-subtotal-price').attr('value'));
                let expense_after_tax_price = parseFloat(tableLineDetail.find(row_id + ' .expense-subtotal-price-after-tax').attr('value'));

                let row_tax_ELe = tableLineDetail.find(row_id + ' .expense-tax-select-box')
                let tax_selected = SelectDDControl.get_data_from_idx(row_tax_ELe, row_tax_ELe.val())
                let tax_rate = 0;
                if (Object.keys(tax_selected).length !== 0) {
                    tax_rate = tax_selected?.['rate']
                }
                let document_number = tableLineDetail.find(row_id + ' .expense-document-number').val();

                let sale_code_item = tableLineDetail.find(row_id).nextAll().slice(0, 1);
                sale_code_item.each(function () {
                    let expense_items_detail_list = [];
                    if ($(this).find('.detail-ap-items').html()) {
                        expense_items_detail_list = JSON.parse($(this).find('.detail-ap-items').html());
                    }
                    let real_value = 0;
                    if ($(this).find('.value-inp').attr('value') && $(this).find('.value-inp').attr('value') !== 'NaN') {
                        real_value = parseFloat($(this).find('.value-inp').attr('value'));
                    }
                    let converted_value = $(this).find('.value-converted-from-ap-inp').attr('value');
                    if (expense_items_detail_list.length <= 0) {
                        converted_value = 0;
                    }
                    let sum_value = 0;
                    if ($(this).find('.total-value-salecode-item').attr('value')) {
                        sum_value = parseFloat($(this).find('.total-value-salecode-item').attr('value'));
                    }
                    expense_detail_value = expense_detail_value + sum_value;
                    payment_item_list.push({
                        'expense_type_id': expense_type,
                        'expense_description': expense_name_input,
                        'expense_uom_name': expense_uom_name,
                        'expense_quantity': expense_quantity,
                        'expense_unit_price': expense_unit_price,
                        'expense_tax_id': expense_tax,
                        'expense_tax_price': expense_subtotal_price * tax_rate / 100,
                        'expense_subtotal_price': expense_subtotal_price,
                        'expense_after_tax_price': expense_after_tax_price,
                        'document_number': document_number,
                        'real_value': real_value,
                        'converted_value': converted_value,
                        'sum_value': sum_value,
                        'ap_cost_converted_list': expense_items_detail_list
                    })
                })

                if (parseFloat(expense_after_tax_price) !== parseFloat(expense_detail_value)) {
                    $.fn.notifyB({description: 'Detail tab - line ' + i.toString() + ': product value must be equal to sum Sale Code value.'}, 'failure');
                    return false;
                }
            }
        }
        frm.dataForm['payment_item_list'] = payment_item_list;
        return frm
    }
    static LoadDetailPayment(option) {
        let url_loaded = $('#form-detail-payment').attr('data-url')
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    WFRTControl.setWFRuntimeID(data['payment_detail']?.['workflow_runtime_id']);
                    data = data['payment_detail'];
                    if (option === 'detail') {
                        new PrintTinymceControl().render('1010563f-7c94-42f9-ba99-63d5d26a1aca', data, false);
                    }
                    console.log(data)
                    DETAIL_DATA = data;
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);
                    console.log(data)

                    new $x.cls.bastionField({
                        has_opp: true,
                        has_inherit: true,
                        data_inherit: [{
                            "id": data?.['employee_inherit']?.['id'],
                            "full_name": data?.['employee_inherit']?.['full_name'] || '',
                            "first_name": data?.['employee_inherit']?.['first_name'] || '',
                            "last_name": data?.['employee_inherit']?.['last_name'] || '',
                            "email": data?.['employee_inherit']?.['email'] || '',
                            "is_active": data?.['employee_inherit']?.['is_active'] || false,
                            "selected": true,
                        }],
                        data_opp: [{
                            "id": data?.['opportunity_mapped']?.['id'] || '',
                            "title": data?.['opportunity_mapped']?.['title'] || '',
                            "code": data?.['opportunity_mapped']?.['code'] || '',
                            "selected": true,
                        }]
                    }).init();
                    if (Object.keys(data?.['opportunity_mapped']).length !== 0 && Object.keys(data?.['employee_inherit']).length !== 0) {
                        PaymentLoadPage.LoadQuotation(data?.['opportunity_mapped']?.['quotation_mapped'])
                        PaymentLoadTab.LoadPlanQuotation(opp_mapped_select.val(), data?.['opportunity_mapped']?.['quotation_mapped']?.['id'])
                    } else if (Object.keys(data?.['quotation_mapped']).length !== 0) {
                        PaymentLoadPage.LoadQuotation(data?.['quotation_mapped'])

                        let dataParam = {'quotation_id': quotation_mapped_select.val()}
                        let ap_mapped_item = $.fn.callAjax2({
                            url: sale_order_mapped_select.attr('data-url'),
                            data: dataParam,
                            method: 'GET'
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data && typeof data === 'object' && data.hasOwnProperty('sale_order_list')) {
                                    return data?.['sale_order_list'];
                                }
                                return {};
                            },
                            (errs) => {
                                console.log(errs);
                            }
                        )

                        Promise.all([ap_mapped_item]).then(
                            (results) => {
                                let so_mapped_opp = results[0];
                                if (so_mapped_opp.length > 0) {
                                    PaymentLoadPage.LoadSaleOrder(so_mapped_opp[0]);
                                }
                            })

                        PaymentLoadTab.LoadPlanQuotationOnly(data?.['quotation_mapped']?.['id'])
                    } else if (Object.keys(data?.['sale_order_mapped']).length !== 0) {
                        PaymentLoadPage.LoadSaleOrder(data?.['sale_order_mapped'])
                        PaymentLoadPage.LoadQuotation(data?.['sale_order_mapped']?.['quotation_mapped'])

                        PaymentLoadTab.LoadPlanSaleOrderOnly(data?.['sale_order_mapped']?.['id'])
                    }

                    $('#title').val(data?.['title']);
                    $('#created_date_id').val(data?.['date_created'].split(' ')[0]).prop('readonly', true);
                    PaymentLoadPage.LoadCreator(data?.['employee_created'])

                    if (data?.['is_internal_payment']) {
                        checkbox_internal.prop('checked', true)
                        supplier_label.prop('hidden', true)
                        employee_label.prop('hidden', false)
                        employee_detail_span.prop('hidden', false)
                        supplier_detail_span.prop('hidden', true)
                        if (Object.keys(data?.['employee_payment']).length !== 0) {
                            PaymentLoadPage.LoadEmployee(data?.['employee_payment'])
                            let btn_detail = $('#btn-detail-employee-tab');
                            employee_detail_span.prop('hidden', false);
                            $('#employee-name').text(data?.['employee_payment']?.['full_name'])
                            $('#employee-code').text(data?.['employee_payment']?.['code']);
                            $('#employee-department').text(data?.['employee_payment']?.['group']['title']);
                            let url = btn_detail.attr('data-url').replace('0', data?.['employee_payment']?.['id']);
                            btn_detail.attr('href', url);
                        }
                    }
                    else {
                        checkbox_internal.prop('checked', false)
                        supplier_label.prop('hidden', false)
                        employee_label.prop('hidden', true)
                        employee_detail_span.prop('hidden', true)
                        supplier_detail_span.prop('hidden', false)
                        if (Object.keys(data?.['supplier']).length !== 0) {
                            PaymentLoadPage.LoadSupplier(data?.['supplier'])
                            PaymentLoadPage.LoadInforSupplier(data?.['supplier']);
                            PaymentLoadTab.LoadBankInfor(data?.['supplier']?.['bank_accounts_mapped']);
                        }
                    }
                    $('#payment-method').val(data?.['method']).trigger('change')

                    PaymentLoadTab.DrawLineDetailTable(data?.['expense_items'], option)

                    $.fn.initMaskMoney2();

                    new $x.cls.file($('#attachment')).init({
                        enable_edit: option !== 'detail',
                        data: data.attachment,
                    })

                    PaymentAction.DisabledDetailPage(option);
                    quotation_mapped_select.attr('disabled', true).attr('readonly', true);
                    sale_order_mapped_select.attr('disabled', true).attr('readonly', true);
                }
            })
    }
}

checkbox_internal.on('change', function () {
    if ($(this).prop('checked')) {
        supplier_label.prop('hidden', true)
        employee_label.prop('hidden', false)
        employee_detail_span.prop('hidden', false)
        supplier_detail_span.prop('hidden', true)
        $('#payment-method').val(0);
    } else {
        supplier_label.prop('hidden', false)
        employee_label.prop('hidden', true)
        employee_detail_span.prop('hidden', true)
        supplier_detail_span.prop('hidden', false)
        $('#payment-method').val('');
    }
})

$(document).on("click", '#btn-add-row-line-detail', function () {
    PaymentAction.AddRow(tableLineDetail, {})
    let row_added = tableLineDetail.find('tbody tr:last-child')
    row_added.attr('id', `row-${row_added.find('td:eq(0)').text()}`)
    PaymentLoadTab.LoadExpenseItem(row_added.find('.expense-type-select-box'))
    PaymentLoadTab.LoadTax(row_added.find('.expense-tax-select-box'))
});

$(document).on("click", '.btn-del-line-detail', function () {
    PaymentAction.DeleteRow(tableLineDetail, parseInt($(this).closest('tr').find('td:first-child').text()))
});

$(document).on('click', '.hide-expand-row-btn', function () {
    let is_hiding = $(this).closest('tr').next().prop('hidden')
    $(this).closest('tr').next().prop('hidden', !is_hiding)
});

$(document).on("change", '.expense-unit-price-input', function () {
    PaymentAction.ChangeRowPrice($(this).closest('tr'));
})

$(document).on("change", '.expense-tax-select-box', function () {
    PaymentAction.ChangeRowPrice($(this).closest('tr'));
})

$(document).on("change", '.expense_quantity', function () {
    PaymentAction.ChangeRowPrice($(this).closest('tr'));
})

$(document).on("change", '.expense-uom-input', function () {
    PaymentAction.ChangeRowPrice($(this).closest('tr'));
})

$(document).on("change", '.expense-document-number', function () {
    PaymentAction.ChangeRowPrice($(this).closest('tr'));
})

$(document).on("change", '.value-inp', function () {
    let value_converted_from_ap = parseFloat($(this).closest('tr').find('.value-converted-from-ap-inp').attr('value'));
    let this_value = parseFloat($(this).attr('value'));
    if (isNaN(value_converted_from_ap)) {
        value_converted_from_ap = 0;
    }
    if (isNaN(this_value)) {
        this_value = 0;
    }
    $(this).closest('tr').find('.total-value-salecode-item').attr('value', this_value + value_converted_from_ap);
    $.fn.initMaskMoney2();
})

$(document).on("click", '.btn-add-payment-value', function () {
    $('.total-converted').attr('hidden', true);
    current_value_converted_from_ap = $(this);
    $('.total-product-selected').attr('data-init-money', 0);
    $.fn.initMaskMoney2();
    $('.product-tables').html(``);

    PaymentLoadTab.LoadAPList();

    offcanvasRightLabel.text(offcanvasRightLabel.attr('data-text-1'));
    $('#step1').prop('hidden', false);
    $('#step2').prop('hidden', true);
    $('#next-btn').prop('hidden', false);
    $('#previous-btn').prop('hidden', true);
    $('#finish-btn').prop('hidden', true);
    $('#total-converted').attr('hidden', true);
});

$("#next-btn").on('click', function () {
    offcanvasRightLabel.text(offcanvasRightLabel.attr('data-text-2'));
    $('#step1').prop('hidden', true);
    $('#step2').prop('hidden', false);
    $('#next-btn').prop('hidden', true);
    $('#previous-btn').prop('hidden', false);
    $('#finish-btn').prop('hidden', false);
    $('#total-converted').attr('hidden', false);

    let tab2 = $('.product-tables');
    tab2.html(``);

    let selected_ap_list = [];
    let selected_ap_code_list = [];
    $('.ap-selected').each(function () {
        if ($(this).is(':checked') === true) {
            selected_ap_list.push($(this).attr('data-id'));
            selected_ap_code_list.push($(this).closest('tr').find('td:first-child span').text());
        }
    })
    if (selected_ap_list.length === 0) {
        $.fn.notifyB({description: 'Warning: Select at least 1 Advance Payment Item for next step.'}, 'warning');
    } else {
        let selected_converted_value = []
        $('.detail-ap-items').each(function () {
            if ($(this).text() && $(this).closest('tr').attr('class') !== current_value_converted_from_ap.closest('tr').attr('class')) {
                selected_converted_value = selected_converted_value.concat(JSON.parse($(this).text()))
            }
        })

        for (let i = 0; i < selected_ap_list.length; i++) {
            $.fn.callAjax(AP_db.attr('data-url-ap-detail').format_url_with_uuid(selected_ap_list[i]), AP_db.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_detail')) {
                        let ap_item_detail = data?.['advance_payment_detail'];
                        if (ap_item_detail?.['expense_items'].length > 0) {
                            tab2.append(`<table id="expense-item-table-${ap_item_detail.id}" class="table nowrap w-100 mb-10">
                                <thead>
                                    <tr>
                                        <th class="w-10"><span class="ap-code-span badge badge-primary w-100">${selected_ap_code_list[i]}</span></th>
                                        <th class="w-15">Expense name</th>
                                        <th class="w-15">Expense type</th>
                                        <th class="w-5">Quantity</th>
                                        <th class="w-15">Unit Price</th>
                                        <th class="w-10">Tax</th>
                                        <th class="w-15">Available</th>
                                        <th class="w-15">Converted Value</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>`);
                            let product_table = $('#expense-item-table-' + ap_item_detail.id);
                            let total_remain_value = 0;
                            for (let i = 0; i < ap_item_detail?.['expense_items'].length; i++) {
                                let expense_item = ap_item_detail?.['expense_items'][i];
                                let row_id_previous = `#row-${current_value_converted_from_ap.closest('tr').attr('class').slice(-1)}`
                                if ($(row_id_previous).find('.expense-type-select-box').val() === expense_item?.['expense_type']?.['id']) {
                                    let tax_code = expense_item?.['expense_tax']?.['code'] ? expense_item?.['expense_tax']?.['code'] : '';
                                    let disabled = 'disabled';
                                    if (expense_item.remain_total > 0) {
                                        disabled = '';
                                    }
                                    total_remain_value += expense_item.remain_total - PaymentAction.FindValueConvertedById(expense_item.id, selected_converted_value);
                                    product_table.find('tbody').append(`<tr>
                                        <td class="text-center"><input data-ap-title="${ap_item_detail?.['title']}" data-id="${expense_item.id}" class="product-selected" type="checkbox" ${disabled}></td>
                                        <td>${expense_item.expense_name}</td>
                                        <td>${expense_item.expense_type.title}</td>
                                        <td>${expense_item.expense_quantity}</td>
                                        <td><span class="text-primary mask-money" data-init-money="${expense_item.expense_unit_price}"></span></td>
                                        <td><span class="badge badge-soft-danger">${tax_code}</span></td>
                                        <td>
                                        <span class="text-primary mask-money product-remain-value" data-init-money="${expense_item.remain_total - PaymentAction.FindValueConvertedById(expense_item.id, selected_converted_value)}"></span>
                                        </td>
                                        <td><input class="mask-money form-control converted-value-inp" disabled></td>
                                    </tr>`)
                                }
                            }
                            if (product_table.find('tbody').html() === '') {
                                product_table.remove()
                            } else {
                                product_table.find('tbody').append(`<tr style="background-color: #ebf5f5">
                                    <td colspan="5"></td>
                                    <td><span style="text-align: left"><b>Total:</b></span></td>
                                    <td><span class="mask-money total-available-value text-primary" data-init-money="${total_remain_value}"></span></td>
                                    <td><span class="mask-money total-converted-value text-primary" data-init-money="0"></span></td>
                                </tr>`)
                            }

                            $('.converted-value-inp').on('change', function () {
                                let product_remain_value = $(this).closest('tr').find('.product-remain-value').attr('data-init-money');
                                let converted_value = $(this).attr('value');
                                if (parseFloat(converted_value) > parseFloat(product_remain_value)) {
                                    $(this).attr('value', parseFloat(product_remain_value));
                                }

                                let new_total_converted_value = 0;
                                $(this).closest('tbody').find('.converted-value-inp').each(function () {
                                    if (parseFloat($(this).attr('value'))) {
                                        new_total_converted_value += parseFloat($(this).attr('value'));
                                    }
                                });
                                $(this).closest('tbody').find('.total-converted-value').attr('data-init-money', new_total_converted_value);

                                $('.total-product-selected').attr('data-init-money', PaymentAction.SumAPItemsCast());

                                $.fn.initMaskMoney2();
                            });

                            $('.product-selected').on('change', function () {
                                if ($(this).is(':checked')) {
                                    $(this).closest('tr').find('.converted-value-inp').prop('disabled', false);
                                    $(this).closest('tr').find('.converted-value-inp').addClass('is-valid');
                                } else {
                                    $(this).closest('tr').find('.converted-value-inp').prop('disabled', true);
                                    $(this).closest('tr').find('.converted-value-inp').attr('value', '');
                                    $(this).closest('tr').find('.converted-value-inp').removeClass('is-valid');
                                }

                                let new_total_converted_value = 0;
                                $(this).closest('tbody').find('.converted-value-inp').each(function () {
                                    if (parseFloat($(this).attr('value'))) {
                                        new_total_converted_value += parseFloat($(this).attr('value'));
                                    }
                                });
                                $(this).closest('tbody').find('.total-converted-value').attr('data-init-money', new_total_converted_value);

                                $('.total-product-selected').attr('data-init-money', PaymentAction.SumAPItemsCast());

                                $.fn.initMaskMoney2();
                            });

                            $.fn.initMaskMoney2();
                        }
                    }
                }
            });
        }
    }
})

$("#previous-btn").on('click', function () {
    offcanvasRightLabel.text(offcanvasRightLabel.attr('data-text-1'));
    $('#step1').prop('hidden', false);
    $('#step2').prop('hidden', true);
    $('#next-btn').prop('hidden', false);
    $('#previous-btn').prop('hidden', true);
    $('#finish-btn').prop('hidden', true);
    $('#total-converted').attr('hidden', true);
})

$("#finish-btn").on('click', function () {
    $('.total-converted').attr('hidden', true);
    let result_total_value = PaymentAction.SumAPItemsCast();
    current_value_converted_from_ap.closest('.row').find('.value-converted-from-ap-inp').attr('value', result_total_value);

    current_value_converted_from_ap.closest('tr').prev().find('.expense-type-select-box').prop('disabled', true).prop('readonly', true)
    let value_input_ap = parseFloat(current_value_converted_from_ap.closest('tr').find('.value-inp').attr('value'));
    if (isNaN(value_input_ap)) {
        value_input_ap = 0;
    }
    current_value_converted_from_ap.closest('tr').find('.total-value-salecode-item').attr('value', result_total_value + value_input_ap);
    let ap_product_items = PaymentAction.GetAPItems()
    current_value_converted_from_ap.closest('tr').find('.detail-ap-items').text(JSON.stringify(ap_product_items));
    if (result_total_value > 0) {
        let detail_converted_html = ``;
        for (let x = 0; x < ap_product_items.length; x++) {
            detail_converted_html += `<a class="dropdown-item" href="#">${ap_product_items[x]?.['ap_title']}: <span class="mask-money text-secondary" data-init-money="${ap_product_items[x]?.['value_converted']}"></span></a>`
        }
        let detail_converted_html_full = ``
        if (detail_converted_html) {
            detail_converted_html_full = `<div class="btn-group" role="group">
                <button data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                        class="btn btn-icon btn-flush-primary flush-soft-hover" type="button">
                    <span class="icon"><i class="bi bi-chevron-down text-primary"></i></span>
                </button>
                <div class="dropdown-menu">
                    ${detail_converted_html}
                </div>
            </div>`;
        }
        current_value_converted_from_ap.closest('tr').find('.input-group .btn-group').remove()
        current_value_converted_from_ap.closest('tr').find('.input-group').append(detail_converted_html_full)
    }

    $.fn.initMaskMoney2();
})
