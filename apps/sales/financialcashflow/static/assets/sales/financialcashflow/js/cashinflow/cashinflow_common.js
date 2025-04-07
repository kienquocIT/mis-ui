/**
 * Khai báo các element trong page
 */
class CIFPageElements {
    constructor() {
        this.$title = $('#title')
        this.$customer = $('#customer')
        this.$purchase_advance_value = $('#purchase_advance_value')
        this.$posting_date = $('#posting_date')
        this.$document_date = $('#document_date')
        this.$description = $('#description')
        this.$customer_advance_table = $('#customer-advance-table')
        this.$ar_invoice_table = $('#ar-invoice-table')
        this.$total_payment = $('#total_payment')
        this.$detail_payment_value_modal = $('#detail-payment-value-modal')
        this.$detail_payment_table = $('#detail-payment-table')
        this.$btn_modal_payment_method = $('#btn-modal-payment-method')
        this.$icon_done_payment_method = $('#icon-done-payment-method')
        this.$payment_method_modal = $('#payment-method-modal')
        this.$total_payment_modal = $('#total_payment_modal')
        this.$save_changes_payment_method = $('#save-changes-payment-method')
        this.$cash_value = $('#cash_value')
        this.$bank_value = $('#bank_value')
        this.$company_bank_account = $('#company_bank_account')
    }
}
const pageElements = new CIFPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class CIFPageVariables {
    constructor() {
        this.selected_payment_stage_table_cfg = [
            {
                className: 'wrap-text w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    return row?.['is_ar_invoice'] ? `<div class="form-check">
                        <input type="checkbox"
                               class="form-check-input selected_payment_stage"
                               data-so-pm-stage-id="${row?.['id']}"
                        >
                        <label class="form-check-label"></label>
                    </div>` : ''
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['term_data']?.['title'] ? row?.['term_data']?.['title'] : ''}</span>`
                }
            },
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['remark']}</span>`;
                }
            },
            {
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return row?.['is_ar_invoice'] ? `<span class="text-muted no-invoice">${row?.['invoice'] ? row?.['invoice'] : ''}</span>` : '--';
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: (data, type, row) => {
                    return row?.['is_ar_invoice'] ? `<span class="mask-money detail-invoice-value" data-init-money="${row?.['value_total'] ? row?.['value_total'] : 0}"></span>` : '--';
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money" data-init-money="${row?.['recon_total'] ? row?.['recon_total'] : 0}"></span>`;
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: (data, type, row) => {
                    return row?.['is_ar_invoice'] ? `<span class="mask-money detail_balance_value" data-init-money="${row?.['recon_balance']}"></span>` : '--';
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: (data, type, row) => {
                    return row?.['is_ar_invoice'] ? `<input disabled readonly class="form-control text-right mask-money detail_payment_value" value="0">` : '--';
                }
            },
            {
                className: 'wrap-text text-right w-10',
                render: (data, type, row) => {
                    return `<span class="text-muted">${moment(row?.['due_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`;
                }
            },
        ]
        this.customer_advance_table_cfg = [
            {
                className: 'wrap-text w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    return `<div class="form-check">
                    <input type="checkbox"
                           class="form-check-input select_row_customer_advance"
                           data-customer-advance-id="${row?.['id']}"
                    >
                    <label class="form-check-label"></label>
                </div>`
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    return `<span class="badge badge-primary">${row?.['sale_order']?.['code']}</span>`
                }
            },
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['term_data']?.['title'] || ''}</span>`;
                }
            },
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['remark']}</span>`;
                }
            },
            {
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<span class="text-muted">${moment(row?.['due_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`;
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money value_total_advance" data-init-money="${row?.['value_total']}"></span>`;
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money recon_balance_value_advance" data-init-money="${row?.['value_balance']}"></span>`;
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: () => {
                    return `<input class="form-control text-right mask-money cash_in_value_advance" value="0"">`;
                }
            },
        ]
        this.ar_invoice_table_cfg = [
            {
                className: 'wrap-text w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    return `<div class="form-check">
                                <input type="checkbox"
                                       class="form-check-input select_row_ar_invoice"
                                       data-ar-invoice-id="${row?.['id']}"
                                >
                                <label class="form-check-label"></label>
                            </div>`
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    return `<span class="badge badge-primary">${row?.['code'] ? row?.['code'] : ''}</span>`
                }
            },
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['document_type'] ? row?.['document_type'] : ''}</span>`;
                }
            },
            {
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `${row?.['document_date'] ? moment(row?.['document_date'].split(' '), 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}`;
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money" data-init-money="${row?.['recon_total'] || 0}"></span>`;
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money recon_balance_value" data-init-money="${row?.['recon_balance']}"></span>`;
                }
            },
            {
                className: 'wrap-text text-right w-20',
                render: (data, type, row) => {
                    let payment_term_data = JSON.stringify(row?.['payment_term_data'] ? row?.['payment_term_data'] : [])
                    return `<div class="input-group">
                                <span class="input-affix-wrapper">
                                    <input readonly disabled class="form-control text-right mask-money cash_in_value" value="0">
                                </span>
                                <button data-payment-term='${payment_term_data}' data-detail-payment='' data-bs-toggle="modal" data-bs-target="#detail-payment-value-modal" type="button" class="btn btn-outline-secondary btn_selected_payment_stage" hidden><i class="bi bi-three-dots-vertical"></i></button>
                            </div>`;
                }
            },
            {
                className: 'wrap-text text-right w-10',
                render: () => {
                    return `<div class="input-group">
                                <span class="input-affix-wrapper">
                                    <input readonly type="number" class="form-control text-right discount_payment_value" value="0">
                                    <span class="input-suffix"><i class="fa-solid fa-percent"></i></span>
                                </span>
                            </div>`;
                }
            },
        ]
        this.current_row_ar_invoice = null
        this.is_detail_page = false
    }
}
const pageVariables = new CIFPageVariables();

/**
 * Các hàm load page và hàm hỗ trợ
 */
class CIFPageFunction {
    static LoadDate(element) {
        element.daterangepicker({
            singleDatePicker: true,
            timePicker: false,
            showDropdowns: true,
            autoApply: true,
            minYear: parseInt(moment().format('YYYY')),
            locale: {format: 'DD/MM/YYYY'},
            maxYear: parseInt(moment().format('YYYY')) + 100,
        }).val('')
    }
    static LoadCustomer(data) {
        pageElements.$customer.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$customer.attr('data-url'),
                data: {'is_customer_account': true},
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'customer_list',
            keyId: 'id',
            keyText: 'name',
        }).on('change', function () {
            if (pageElements.$customer.val()) {
                CIFPageFunction.LoadCustomerAdvanceTable({'sale_order__customer_id': pageElements.$customer.val(), 'cash_inflow_done': false})
                CIFPageFunction.LoadARInvoiceTable({'customer_mapped_id': pageElements.$customer.val(),'cash_inflow_done': false})
            }
        })
    }
    static LoadCompanyBankAccount(data) {
        pageElements.$company_bank_account.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$company_bank_account.attr('data-url'),
                method: 'GET',
            },
            templateResult: function formatbankview(data) {
                if (data?.['data']?.['id']) return $(`<span>${data?.['data']?.['bank_mapped_data']?.['bank_name']} (${data?.['data']?.['bank_mapped_data']?.['bank_abbreviation']})</span><br><span>${data?.['data']?.['bank_account_owner']} (${data?.['data']?.['bank_account_number']})</span>`);
                return data?.['data']?.['bank_account_number'];
            },
            data: (data ? data : null),
            keyResp: 'bank_account_list',
            keyId: 'id',
            keyText: 'bank_account_number'
        })
    }
    // Function
    static LoadCustomerAdvanceTable(data_params={}, data_list=[], approved=false) {
        if (approved) {
            let stage_id = []
            for (let i = 0; i < data_list.length; i++) {
                stage_id.push(data_list[i]?.['sale_order_stage_data']?.['id'])
            }
            data_params['id__in'] = stage_id.join(',')
        }
        pageElements.$customer_advance_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(pageElements.$customer_advance_table);
        if (Object.keys(data_params).length > 0) {
            pageElements.$customer_advance_table.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                useDataServer: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '30vh',
                scrollCollapse: true,
                paging: false,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    data: data_params,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['customer_advance_list'] ? resp.data['customer_advance_list'] : [];
                        }
                        return [];
                    },
                },
                columns: pageVariables.customer_advance_table_cfg,
                initComplete: function () {
                    for (let i=0; i < data_list.length; i++) {
                        let row_checkbox = pageElements.$customer_advance_table.find(`tbody .select_row_customer_advance[data-customer-advance-id="${data_list[i]?.['sale_order_stage_data']?.['id']}"]`)
                        row_checkbox.prop('checked', true)
                        if (approved) {
                            row_checkbox.closest('tr').find('.recon_balance_value_advance').attr('data-init-money', data_list[i]?.['sum_balance_value'])
                        }
                        row_checkbox.closest('tr').find('.cash_in_value_advance').attr('value', data_list[i]?.['sum_payment_value'])
                    }
                    CIFHandler.Disable()
                }
            });
        }
        else {
            pageElements.$customer_advance_table.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '30vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: pageVariables.customer_advance_table_cfg,
            });
        }
    }
    static LoadARInvoiceTable(data_params={}, data_list=[], approved=false) {
        if (approved) {
            let ar_invoice = []
            for (let i = 0; i < data_list.length; i++) {
                ar_invoice.push(data_list[i]?.['ar_invoice_data']?.['id'])
            }
            data_params['id__in'] = ar_invoice.join(',')
        }
        pageElements.$ar_invoice_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(pageElements.$ar_invoice_table);
        if (Object.keys(data_params).length > 0) {
            pageElements.$ar_invoice_table.DataTableDefault({
                dom: 't',
                useDataServer: true,
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    data: data_params,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['ar_invoice_list'] ? resp.data['ar_invoice_list'] : [];
                        }
                        return [];
                    },
                },
                columns: pageVariables.ar_invoice_table_cfg,
                initComplete: function () {
                    for (let i=0; i < data_list.length; i++) {
                        let row_checkbox = pageElements.$ar_invoice_table.find(`tbody .select_row_ar_invoice[data-ar-invoice-id="${data_list[i]?.['ar_invoice_data']?.['id']}"]`)
                        row_checkbox.prop('checked', true)
                        row_checkbox.closest('tr').find('.btn_selected_payment_stage').prop('hidden', false)
                        let detail_payment = data_list[i]?.['detail_payment'] || []
                        let valid_detail_payment = []
                        for (let j=0; j < detail_payment.length; j++) {
                            valid_detail_payment.push({
                                'so_pm_stage_id': detail_payment[i]?.['so_pm_stage_data']?.['id'],
                                'balance_value': detail_payment[i]?.['balance_value'],
                                'payment_value': detail_payment[i]?.['payment_value'],
                            })
                        }
                        row_checkbox.closest('tr').find('.btn_selected_payment_stage').attr('data-approved', approved)
                        row_checkbox.closest('tr').find('.btn_selected_payment_stage').attr('data-detail-payment', JSON.stringify(valid_detail_payment))
                        if (approved) {
                            row_checkbox.closest('tr').find('.recon_balance_value').attr('data-init-money', data_list[i]?.['sum_balance_value'])
                        }
                        row_checkbox.closest('tr').find('.cash_in_value').attr('value', data_list[i]?.['sum_payment_value'])
                    }
                    CIFHandler.Disable()
                }
            });
        }
        else {
            pageElements.$ar_invoice_table.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: pageVariables.ar_invoice_table_cfg,
                initComplete: function () {}
            });
        }
    }
    static LoadPaymentStageTable(data_list=[], valid_detail_payment=[]) {
        pageElements.$detail_payment_table.DataTable().clear().destroy()
        if (pageElements.$customer.val()) {
            pageElements.$detail_payment_table.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: data_list,
                columns: pageVariables.selected_payment_stage_table_cfg,
                initComplete: function () {
                    for (let i=0; i < valid_detail_payment.length; i++) {
                        let selected = pageElements.$detail_payment_table.find(`tbody tr .selected_payment_stage[data-so-pm-stage-id=${valid_detail_payment[i]?.['so_pm_stage_id']}]`)
                        selected.prop('checked', true)
                        selected.closest('tr').find('.detail_payment_value').attr('value', valid_detail_payment[i]?.['payment_value'])
                        selected.closest('tr').find('.detail_payment_value').prop('disabled', false).prop('readonly', false)
                        if (pageVariables.current_row_ar_invoice.find('.btn_selected_payment_stage').attr('data-approved') === 'true') {
                            selected.closest('tr').find('.detail_balance_value').attr('data-init-money', valid_detail_payment[i]?.['balance_value'])
                        }
                    }
                    CIFPageFunction.CalculateModalDetailPaymentSum()
                    CIFHandler.Disable()
                }
            });
        }
        else {
            pageElements.$detail_payment_table.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: pageVariables.selected_payment_stage_table_cfg,
            });
        }
    }
    static RecalculateTotalPayment() {
        let total_payment = 0
        total_payment += pageElements.$purchase_advance_value.attr('value') ? parseFloat(pageElements.$purchase_advance_value.attr('value')) : 0
        const cif_value = $('#cif_type_label').attr('data-value')
        if (cif_value === '0') {
            pageElements.$customer_advance_table.find('tbody tr').each(function () {
                total_payment += $(this).find('.cash_in_value_advance').attr('value') ? parseFloat($(this).find('.cash_in_value_advance').attr('value')) : 0
            })
        }
        else if (cif_value === '1') {
            pageElements.$ar_invoice_table.find('tbody tr').each(function () {
                total_payment += $(this).find('.cash_in_value').attr('value') ? parseFloat($(this).find('.cash_in_value').attr('value')) : 0
            })
        }
        pageElements.$total_payment.attr('value', total_payment)
        pageElements.$total_payment_modal.attr('value', pageElements.$total_payment.attr('value'))
        pageElements.$btn_modal_payment_method.prop('disabled', total_payment === 0)
        pageElements.$btn_modal_payment_method.removeClass('btn-success').addClass('btn-danger')
        pageElements.$icon_done_payment_method.prop('hidden', true)
        $.fn.initMaskMoney2()
    }
    static CalculateARInvoiceRow() {
        let total_detail_payment = 0
        let detail_payment = []
        pageElements.$detail_payment_table.find('tbody tr').each(function () {
            if ($(this).find('.selected_payment_stage').prop('checked')) {
                total_detail_payment += $(this).find('.detail_payment_value').attr('value') ? parseFloat($(this).find('.detail_payment_value').attr('value')) : 0
                detail_payment.push({
                    'so_pm_stage_id': $(this).find('.selected_payment_stage').attr('data-so-pm-stage-id'),
                    'balance_value': $(this).find('.detail_balance_value').attr('data-init-money'),
                    'payment_value': $(this).find('.detail_payment_value').attr('value'),
                })
            }
        })
        pageVariables.current_row_ar_invoice.find('.cash_in_value').attr('value', total_detail_payment)
        pageVariables.current_row_ar_invoice.find('.btn_selected_payment_stage').attr('data-detail-payment', JSON.stringify(detail_payment))
        $('#total-detail-payment-modal').attr('data-init-money', total_detail_payment)
        CIFPageFunction.RecalculateTotalPayment()
    }
    static CalculateModalDetailPaymentSum() {
        let modal_detail_payment_sum = 0
        pageElements.$detail_payment_table.find('tbody tr').each(function () {
            if ($(this).find('.selected_payment_stage').prop('checked')) {
                modal_detail_payment_sum += parseFloat($(this).find('.detail_payment_value').attr('value'))
            }
        })
        $('#total-detail-payment-modal').attr('data-init-money', modal_detail_payment_sum)
        $.fn.initMaskMoney2()
    }
}

/**
 * Khai báo các hàm chính
 */
class CIFHandler {
    static Disable() {
        if (pageVariables.is_detail_page) {
            $('form .form-check-input').prop('readonly', true).prop('disabled', true);
            $('form .form-control').prop('readonly', true).prop('disabled', true);
            $('form .form-select').prop('readonly', true).prop('disabled', true);
            $('.modal .form-check-input').prop('readonly', true).prop('disabled', true);
            $('.modal .form-control').prop('readonly', true).prop('disabled', true);
            $('.modal .form-select').prop('readonly', true).prop('disabled', true);
            // $('#cif_type_label').closest('span').removeAttr('data-bs-toggle').removeClass('dropdown-toggle')
            $('#payment-method-modal .modal-footer').remove();
            $('#detail-payment-value-modal .modal-footer').remove();
        }
    }
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = pageElements.$title.val()
        frm.dataForm['customer_id'] = pageElements.$customer.val()
        frm.dataForm['posting_date'] = moment(pageElements.$posting_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['document_date'] = moment(pageElements.$document_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['description'] = pageElements.$description.val()
        let cash_in_customer_advance_data = []
        let cash_in_ar_invoice_data = []
        let payment_method_data = pageElements.$btn_modal_payment_method.attr('data-payment-method') ? JSON.parse(pageElements.$btn_modal_payment_method.attr('data-payment-method')) : {}

        frm.dataForm['purchase_advance_value'] = pageElements.$purchase_advance_value.attr('value') ? pageElements.$purchase_advance_value.attr('value') : 0
        const cif_value = $('#cif_type_label').attr('data-value')
        if (cif_value === '0') {
            cash_in_ar_invoice_data = []
            pageElements.$customer_advance_table.find('tbody tr').each(function () {
                if ($(this).find('.select_row_customer_advance').prop('checked')) {
                    cash_in_customer_advance_data.push({
                        'sale_order_stage_id': $(this).find('.select_row_customer_advance').attr('data-customer-advance-id'),
                        'sum_balance_value': $(this).find('.recon_balance_value_advance').attr('data-init-money'),
                        'sum_payment_value': $(this).find('.cash_in_value_advance').attr('value'),
                    })
                }
            })
        }
        else if (cif_value === '1') {
            cash_in_customer_advance_data = []
            pageElements.$ar_invoice_table.find('tbody tr').each(function () {
                if ($(this).find('.select_row_ar_invoice').prop('checked')) {
                    let detail_payment = $(this).find('.btn_selected_payment_stage').attr('data-detail-payment')
                    cash_in_ar_invoice_data.push({
                        'ar_invoice_id': $(this).find('.select_row_ar_invoice').attr('data-ar-invoice-id'),
                        'sum_balance_value': $(this).find('.recon_balance_value').attr('data-init-money'),
                        'sum_payment_value': $(this).find('.cash_in_value').attr('value'),
                        'discount_payment': 0,
                        'discount_value': 0,
                        'detail_payment': detail_payment ? JSON.parse(detail_payment) : []
                    })
                }
            })
        }

        frm.dataForm['cash_in_customer_advance_data'] = cash_in_customer_advance_data
        frm.dataForm['cash_in_ar_invoice_data'] = cash_in_ar_invoice_data
        frm.dataForm['payment_method_data'] = payment_method_data

        // console.log(frm)
        return frm
    }
    static LoadDetailCIF(option) {
        pageVariables.is_detail_page = option === 'detail'
        let url_loaded = $('#form-detail-cashinflow').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['cash_inflow_detail'];
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);
                    // console.log(data)

                    pageElements.$title.val(data?.['title'])
                    pageElements.$posting_date.val(moment(data?.['posting_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    pageElements.$document_date.val(moment(data?.['document_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    CIFPageFunction.LoadCustomer(pageElements.$customer, data?.['customer_data'])
                    pageElements.$description.val(data?.['description'])

                    pageElements.$purchase_advance_value.attr('value', data?.['purchase_advance_value'] ? data?.['purchase_advance_value'] : 0)

                    if (data?.['system_status'] === 3) {
                        if (data?.['cash_in_customer_advance_data'].length === 0 && data?.['cash_in_ar_invoice_data'].length === 0) {
                            // phiếu đã duyệt nhưng chỉ thu tạm ứng không theo hđ
                            CIFPageFunction.LoadCustomerAdvanceTable()
                            CIFPageFunction.LoadARInvoiceTable()
                        }
                        else if (data?.['cash_in_customer_advance_data'].length > 0) {
                            $('#cif_type_label').text($('#cif_type .dropdown-item:eq(0)').text()).attr('data-value', '0')
                            $('#area_table_customer_advance').prop('hidden', false)
                            $('#area_table_ar_invoice').prop('hidden', true)
                            // nếu thu tạm ứng theo hđ
                            CIFPageFunction.LoadCustomerAdvanceTable(
                                {'sale_order__customer_id': pageElements.$customer.val()},
                                data?.['cash_in_customer_advance_data'],
                                data?.['system_status'] === 3
                            )
                            CIFPageFunction.LoadARInvoiceTable()
                        }
                        else if (data?.['cash_in_ar_invoice_data'].length > 0) {
                            $('#cif_type_label').text($('#cif_type .dropdown-item:eq(1)').text()).attr('data-value', '1')
                            $('#area_table_customer_advance').prop('hidden', true)
                            $('#area_table_ar_invoice').prop('hidden', false)
                            // nếu thu theo hóa đơn
                            CIFPageFunction.LoadCustomerAdvanceTable()
                            CIFPageFunction.LoadARInvoiceTable(
                                {'customer_mapped_id': pageElements.$customer.val()},
                                data?.['cash_in_ar_invoice_data'],
                                data?.['system_status'] === 3
                            )
                        }
                    }
                    else {
                        if (data?.['cash_in_customer_advance_data'].length > 0) {
                            $('#cif_type_label').text($('#cif_type .dropdown-item:eq(0)').text()).attr('data-value', '0')
                            $('#area_table_customer_advance').prop('hidden', false)
                            $('#area_table_ar_invoice').prop('hidden', true)
                        }
                        else if (data?.['cash_in_ar_invoice_data'].length > 0) {
                            $('#cif_type_label').text($('#cif_type .dropdown-item:eq(1)').text()).attr('data-value', '1')
                            $('#area_table_customer_advance').prop('hidden', true)
                            $('#area_table_ar_invoice').prop('hidden', false)
                        }
                        CIFPageFunction.LoadCustomerAdvanceTable(
                            {'sale_order__customer_id': pageElements.$customer.val()},
                            data?.['cash_in_customer_advance_data'],
                            data?.['system_status'] === 3
                        )
                        CIFPageFunction.LoadARInvoiceTable(
                            {'customer_mapped_id': pageElements.$customer.val()},
                            data?.['cash_in_ar_invoice_data'],
                            data?.['system_status'] === 3
                        )
                    }

                    pageElements.$total_payment.attr('value', data?.['total_value'])

                    let payment_method_data = {
                        'cash_value': data?.['cash_value'],
                        'bank_value': data?.['bank_value'],
                        'company_bank_account_id': data?.['company_bank_account_data']?.['id'],
                    }
                    pageElements.$btn_modal_payment_method.prop('disabled', false)
                    pageElements.$btn_modal_payment_method.attr('data-payment-method', JSON.stringify(payment_method_data))
                    pageElements.$btn_modal_payment_method.removeClass('btn-danger').addClass('btn-success')
                    pageElements.$icon_done_payment_method.prop('hidden', false)
                    pageElements.$total_payment_modal.attr('value', data?.['total_value'])
                    pageElements.$cash_value.attr('value', data?.['cash_value'])
                    pageElements.$bank_value.attr('value', data?.['bank_value'])
                    CIFPageFunction.LoadCompanyBankAccount(pageElements.$company_bank_account, data?.['company_bank_account_data'])

                    $.fn.initMaskMoney2()
                    CIFHandler.Disable();
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class CIFEventHandler {
    static InitPageEven() {
        // thay đổi giá trị tạm ứng không theo hđ
        pageElements.$purchase_advance_value.on('change', function () {
            CIFPageFunction.RecalculateTotalPayment()
        })
        // check chọn các dòng trong 2 bảng chính
        $(document).on('change', '.select_row_customer_advance', function () {
            $(this).closest('tr').find('.cash_in_value_advance').attr('value', $(this).prop('checked') ? $(this).closest('tr').find('.recon_balance_value_advance').attr('data-init-money') : 0)
            $.fn.initMaskMoney2()
            CIFPageFunction.RecalculateTotalPayment()
        })
        $(document).on('change', '.select_row_ar_invoice', function () {
            $(this).closest('tr').find('.btn_selected_payment_stage').prop('hidden', !$(this).prop('checked'))
            if (!$(this).prop('checked')) {
                $(this).closest('tr').find('.cash_in_value').attr('value', 0)
            }
            $.fn.initMaskMoney2()
            CIFPageFunction.RecalculateTotalPayment()
        })
        // thay đổi giá trị thu trên các dòng
        $(document).on('change', '.cash_in_value_advance', function () {
            let this_value = parseFloat($(this).attr('value'))
            let balance_value = parseFloat($(this).closest('tr').find('.recon_balance_value_advance').attr('data-init-money'))
            if (this_value > balance_value) {
                $.fn.notifyB({description: `Payment value can not > Balance value`}, 'failure');
                $(this).attr('value', balance_value)
            }
            $.fn.initMaskMoney2()
            CIFPageFunction.RecalculateTotalPayment()
        })
        pageElements.$save_changes_payment_method.on('click', function () {
            if (
                parseFloat(pageElements.$cash_value.attr('value')) + parseFloat(pageElements.$bank_value.attr('value')) === parseFloat(pageElements.$total_payment_modal.attr('value'))
                && parseFloat(pageElements.$total_payment_modal.attr('value')) !== 0
            ) {
                if (parseFloat(pageElements.$bank_value.attr('value')) > 0 && !pageElements.$company_bank_account.val()) {
                    $.fn.notifyB({description: `Company bank account is required if Bank value > 0`}, 'failure');
                }
                else {
                    let payment_method_data = {
                        'cash_value': pageElements.$cash_value.attr('value'),
                        'bank_value': pageElements.$bank_value.attr('value'),
                        'company_bank_account_id': pageElements.$company_bank_account.val(),
                    }
                    pageElements.$btn_modal_payment_method.attr('data-payment-method', JSON.stringify(payment_method_data))
                    pageElements.$btn_modal_payment_method.removeClass('btn-danger').addClass('btn-success')
                    pageElements.$icon_done_payment_method.prop('hidden', false)
                    pageElements.$payment_method_modal.modal('hide')
                }
            }
            else {
                pageElements.$btn_modal_payment_method.removeClass('btn-success').addClass('btn-danger')
                pageElements.$icon_done_payment_method.prop('hidden', true)
                $.fn.notifyB({description: `Error value or missing information`}, 'failure');
            }
        })
        // chọn map giai đoạn thanh toán nếu thanh toán cho hóa đơn
        $(document).on('click', '.btn_selected_payment_stage', function () {
            pageVariables.current_row_ar_invoice = $(this).closest('tr')
            let payment_term_data = $(this).attr('data-payment-term') ? JSON.parse($(this).attr('data-payment-term')) : []
            let payment_stage_mapped_data = $(this).attr('data-detail-payment') ? JSON.parse($(this).attr('data-detail-payment')) : []
            CIFPageFunction.LoadPaymentStageTable(payment_term_data, payment_stage_mapped_data)
        })
        $(document).on('change', '.selected_payment_stage', function () {
            let this_invoice = $(this).closest('tr').find('.no-invoice').text()
            if ($(this).prop('checked')) {
                $('.no-invoice').each(function () {
                    if ($(this).text() === this_invoice) {
                        $(this).closest('tr').find('.selected_payment_stage').prop('disabled', false)
                    }
                    else {
                        $(this).closest('tr').find('.selected_payment_stage').prop('checked', false).prop('disabled', true)
                    }
                })
            }
            else {
                if ($('.selected_payment_stage:checked').length === 0) {
                    $('.selected_payment_stage').each(function () {
                        $(this).closest('tr').find('.selected_payment_stage').prop('disabled', false)
                    })
                }
            }

            $(this).closest('tr').find('.detail_payment_value').attr(
                'value',
                $(this).prop('checked') ? $(this).closest('tr').find('.detail_balance_value').attr('data-init-money') : 0
            ).prop(
                'disabled', !$(this).prop('checked')
            ).prop(
                'readonly', !$(this).prop('checked')
            )
            $.fn.initMaskMoney2()
            // calculate total payment value modal
            CIFPageFunction.CalculateModalDetailPaymentSum()
        })
        $('#save-detail-payment-value').on('click', function () {
            CIFPageFunction.CalculateARInvoiceRow()
            pageElements.$detail_payment_value_modal.modal('hide')
        })
        $(document).on('change', '.detail_payment_value', function () {
            let this_value = parseFloat($(this).attr('value'))
            let balance_value = parseFloat($(this).closest('tr').find('.detail_balance_value').attr('data-init-money'))
            if (this_value > balance_value) {
                $.fn.notifyB({description: `Payment value can not > Balance value`}, 'failure');
                $(this).attr('value', balance_value)
            }
            $.fn.initMaskMoney2()
            // calculate total payment value modal
            CIFPageFunction.CalculateModalDetailPaymentSum()
        })
        // thay đổi loại thu tiền
        $('#cif_type .dropdown-item').on('click', function () {
            $('#cif_type_label').text($(this).text()).attr('data-value', $(this).attr('data-value'))
            $('#area_table_customer_advance').prop('hidden', $(this).attr('data-value') !== '0')
            $('#area_table_ar_invoice').prop('hidden', $(this).attr('data-value') !== '1')
        })
    }
}
