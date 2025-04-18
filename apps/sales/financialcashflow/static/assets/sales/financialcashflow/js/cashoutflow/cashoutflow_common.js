/**
 * Khai báo các element trong page
 */
class COFPageElements {
    constructor() {
        this.$title = $('#title')
        this.$cof_type = $('#cof_type')
        this.$supplier_space = $('.supplier-space')
        this.$customer_space = $('.customer-space')
        this.$employee_space = $('.employee-space')
        this.$supplier_name = $('#supplier-name')
        this.$customer_name = $('#customer-name')
        this.$employee_name = $('#employee-name')
        this.$description = $('#description')
        this.$table_select_supplier = $('#table-select-supplier')
        this.$table_select_customer = $('#table-select-customer')
        this.$table_select_employee = $('#table-select-employee')
        this.$supplier_select_modal = $('#supplier-select-modal')
        this.$customer_select_modal = $('#customer-select-modal')
        this.$employee_select_modal = $('#employee-select-modal')
        this.$accept_select_supplier_btn = $('#accept-select-supplier-btn')
        this.$accept_select_customer_btn = $('#accept-select-customer-btn')
        this.$accept_select_employee_btn = $('#accept-select-employee-btn')
        this.$posting_date = $('#posting_date')
        this.$document_date = $('#document_date')
        this.$advance_for_supplier_value = $('#advance_for_supplier_value')
        this.$advance_for_supplier_table = $('#advance-to-supplier-table')
        this.$ap_invoice_table = $('#ap-invoice-table')
        this.$advance_for_employee_value = $('#advance_for_employee_value')
        this.$detail_payment_value_modal = $('#detail-payment-value-modal')
        this.$detail_payment_table = $('#detail-payment-table')
        this.$total_payment = $('#total_payment')
        this.$total_payment_modal = $('#total_payment_modal')
        this.$btn_modal_payment_method = $('#btn-modal-payment-method')
        this.$icon_done_payment_method = $('#icon-done-payment-method')
        this.$save_changes_payment_method = $('#save-changes-payment-method')
        this.$payment_method_modal = $('#payment-method-modal')
        this.$cash_value = $('#cash_value')
        this.$bank_value = $('#bank_value')
        this.$company_bank_account = $('#company_bank_account')
    }
}
const pageElements = new COFPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class COFPageVariables {
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
                    return row?.['is_ap_invoice'] ? `<div class="form-check">
                        <input type="checkbox"
                               ${pageVariables.is_detail_page ? 'disabled': ''}
                               class="form-check-input selected_payment_stage"
                               data-po-pm-stage-id="${row?.['id']}"
                        >
                        <label class="form-check-label"></label>
                    </div>` : ''
                }
            },
            {
                className: 'wrap-text w-20',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['remark']}</span>`;
                }
            },
            {
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return row?.['is_ap_invoice'] ? `<span class="text-muted no-invoice">${row?.['invoice'] ? row?.['invoice'] : ''}</span>` : '--';
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: (data, type, row) => {
                    return row?.['is_ap_invoice'] ? `<span class="mask-money detail-invoice-value" data-init-money="${row?.['value_total'] ? row?.['value_total'] : 0}"></span>` : '--';
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
                    return row?.['is_ap_invoice'] ? `<span class="mask-money detail_balance_value" data-init-money="${row?.['recon_balance']}"></span>` : '--';
                }
            },
            {
                className: 'wrap-text text-right w-15',
                render: (data, type, row) => {
                    return row?.['is_ap_invoice'] ? `<input disabled readonly class="form-control text-right mask-money detail_payment_value" value="0">` : '--';
                }
            },
            {
                className: 'wrap-text text-right w-10',
                render: (data, type, row) => {
                    return `<span class="text-muted">${moment(row?.['due_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`;
                }
            },
        ]
        this.advance_to_supplier_table_cfg = [
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
                           ${pageVariables.is_detail_page ? 'disabled': ''}
                           class="form-check-input select_row_advance_for_supplier"
                           data-advance-for-supplier-id="${row?.['id']}"
                    >
                    <label class="form-check-label"></label>
                </div>`
                }
            },
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="badge badge-primary">${row?.['purchase_order']?.['code']}</span>`
                }
            },
            {
                className: 'wrap-text w-20',
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
                    return `<input ${pageVariables.is_detail_page ? 'disabled readonly': ''} class="form-control text-right mask-money cash_out_value_advance" value="0"">`;
                }
            },
        ]
        this.ap_invoice_table_cfg = [
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
                                       ${pageVariables.is_detail_page ? 'disabled': ''}
                                       class="form-check-input select_row_ap_invoice"
                                       data-ap-invoice-id="${row?.['id']}"
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
                                    <input readonly disabled class="form-control text-right mask-money cash_out_value" value="0">
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
        this.current_row_ap_invoice = null
        this.is_detail_page = false
    }
}
const pageVariables = new COFPageVariables();

/**
 * Các hàm load page và hàm hỗ trợ
 */
class COFPageFunction {
    // load page
    static LoadAdvanceToSupplierTable(data_params={}, data_list=[], approved=false) {
        if (approved) {
            let stage_id = []
            for (let i = 0; i < data_list.length; i++) {
                stage_id.push(data_list[i]?.['purchase_order_stage_data']?.['id'])
            }
            data_params['id__in'] = stage_id.join(',')
        }
        pageElements.$advance_for_supplier_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(pageElements.$advance_for_supplier_table);
        if (Object.keys(data_params).length > 0) {
            pageElements.$advance_for_supplier_table.DataTableDefault({
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
                            return resp.data['advance_for_supplier_list'] ? resp.data['advance_for_supplier_list'] : [];
                        }
                        return [];
                    },
                },
                columns: pageVariables.advance_to_supplier_table_cfg,
                initComplete: function () {
                    for (let i=0; i < data_list.length; i++) {
                        let row_checkbox = pageElements.$advance_for_supplier_table.find(`tbody .select_row_advance_for_supplier[data-advance-for-supplier-id="${data_list[i]?.['purchase_order_stage_data']?.['id']}"]`)
                        row_checkbox.prop('checked', true)
                        if (approved) {
                            row_checkbox.closest('tr').find('.recon_balance_value_advance').attr('data-init-money', data_list[i]?.['sum_balance_value'])
                        }
                        row_checkbox.closest('tr').find('.cash_out_value_advance').attr('value', data_list[i]?.['sum_payment_value'])
                    }
                }
            });
        }
        else {
            pageElements.$advance_for_supplier_table.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '30vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: pageVariables.advance_to_supplier_table_cfg,
            });
        }
    }
    static LoadAPInvoiceTable(data_params={}, data_list=[], approved=false) {
        if (approved) {
            let ap_invoice = []
            for (let i = 0; i < data_list.length; i++) {
                ap_invoice.push(data_list[i]?.['ap_invoice_data']?.['id'])
            }
            data_params['id__in'] = ap_invoice.join(',')
        }
        pageElements.$ap_invoice_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(pageElements.$ap_invoice_table);
        if (Object.keys(data_params).length > 0) {
            pageElements.$ap_invoice_table.DataTableDefault({
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
                            return resp.data['ap_invoice_list'] ? resp.data['ap_invoice_list'] : [];
                        }
                        return [];
                    },
                },
                columns: pageVariables.ap_invoice_table_cfg,
                initComplete: function () {
                    for (let i=0; i < data_list.length; i++) {
                        let row_checkbox = pageElements.$ap_invoice_table.find(`tbody .select_row_ap_invoice[data-ap-invoice-id="${data_list[i]?.['ap_invoice_data']?.['id']}"]`)
                        row_checkbox.prop('checked', true)
                        row_checkbox.closest('tr').find('.btn_selected_payment_stage').prop('hidden', false)
                        let detail_payment = data_list[i]?.['detail_payment'] || []
                        let valid_detail_payment = []
                        for (let j=0; j < detail_payment.length; j++) {
                            valid_detail_payment.push({
                                'po_pm_stage_id': detail_payment[i]?.['po_pm_stage_data']?.['id'],
                                'balance_value': detail_payment[i]?.['balance_value'],
                                'payment_value': detail_payment[i]?.['payment_value'],
                            })
                        }
                        row_checkbox.closest('tr').find('.btn_selected_payment_stage').attr('data-approved', approved)
                        row_checkbox.closest('tr').find('.btn_selected_payment_stage').attr('data-detail-payment', JSON.stringify(valid_detail_payment))
                        if (approved) {
                            row_checkbox.closest('tr').find('.recon_balance_value').attr('data-init-money', data_list[i]?.['sum_balance_value'])
                        }
                        row_checkbox.closest('tr').find('.cash_out_value').attr('value', data_list[i]?.['sum_payment_value'])
                    }
                }
            });
        }
        else {
            pageElements.$ap_invoice_table.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: pageVariables.ap_invoice_table_cfg,
                initComplete: function () {}
            });
        }
    }
    static LoadPaymentStageTable(data_list=[], valid_detail_payment=[]) {
        pageElements.$detail_payment_table.DataTable().clear().destroy()
        if (pageElements.$supplier_name.attr('data-id')) {
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
                        let selected = pageElements.$detail_payment_table.find(`tbody tr .selected_payment_stage[data-po-pm-stage-id=${valid_detail_payment[i]?.['po_pm_stage_id']}]`)
                        selected.prop('checked', true)
                        selected.closest('tr').find('.detail_payment_value').attr('value', valid_detail_payment[i]?.['payment_value'])
                        selected.closest('tr').find('.detail_payment_value').prop('disabled', false).prop('readonly', false)
                        if (pageVariables.current_row_ap_invoice.find('.btn_selected_payment_stage').attr('data-approved') === 'true') {
                            selected.closest('tr').find('.detail_balance_value').attr('data-init-money', valid_detail_payment[i]?.['balance_value'])
                        }
                    }
                    COFPageFunction.CalculateModalDetailPaymentSum()
                    UsualLoadPageFunction.DisablePage(pageVariables.is_detail_page, ['#btn-modal-payment-method'])
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
    // function
    static RecalculateTotalPayment() {
        let total_payment = 0
        if (pageElements.$cof_type.val() === '0') {
            total_payment += pageElements.$advance_for_supplier_value.attr('value') ? parseFloat(pageElements.$advance_for_supplier_value.attr('value')) : 0
            const cof_value = $('#cof_type_label').attr('data-value')
            if (cof_value === '0') {
                pageElements.$advance_for_supplier_table.find('tbody tr').each(function () {
                    total_payment += $(this).find('.cash_out_value_advance').attr('value') ? parseFloat($(this).find('.cash_out_value_advance').attr('value')) : 0
                })
            }
            else if (cof_value === '1') {
                pageElements.$ap_invoice_table.find('tbody tr').each(function () {
                    total_payment += $(this).find('.cash_out_value').attr('value') ? parseFloat($(this).find('.cash_out_value').attr('value')) : 0
                })
            }
        }
        else if (pageElements.$cof_type.val() === '1') {

        }
        else if (pageElements.$cof_type.val() === '2') {
            total_payment += pageElements.$advance_for_employee_value.attr('value') ? parseFloat(pageElements.$advance_for_employee_value.attr('value')) : 0
        }
        else if (pageElements.$cof_type.val() === '3') {

        }
        pageElements.$total_payment.attr('value', total_payment)
        pageElements.$total_payment_modal.attr('value', pageElements.$total_payment.attr('value'))
        pageElements.$btn_modal_payment_method.prop('disabled', total_payment === 0)
        pageElements.$btn_modal_payment_method.removeClass('btn-success').addClass('btn-danger')
        pageElements.$icon_done_payment_method.prop('hidden', true)
        $.fn.initMaskMoney2()
    }
    static CalculateAPInvoiceRow() {
        let total_detail_payment = 0
        let detail_payment = []
        pageElements.$detail_payment_table.find('tbody tr').each(function () {
            if ($(this).find('.selected_payment_stage').prop('checked')) {
                total_detail_payment += $(this).find('.detail_payment_value').attr('value') ? parseFloat($(this).find('.detail_payment_value').attr('value')) : 0
                detail_payment.push({
                    'po_pm_stage_id': $(this).find('.selected_payment_stage').attr('data-po-pm-stage-id'),
                    'balance_value': $(this).find('.detail_balance_value').attr('data-init-money'),
                    'payment_value': $(this).find('.detail_payment_value').attr('value'),
                })
            }
        })
        pageVariables.current_row_ap_invoice.find('.cash_out_value').attr('value', total_detail_payment)
        pageVariables.current_row_ap_invoice.find('.btn_selected_payment_stage').attr('data-detail-payment', JSON.stringify(detail_payment))
        $('#total-detail-payment-modal').attr('data-init-money', total_detail_payment)
        COFPageFunction.RecalculateTotalPayment()
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
class COFHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = pageElements.$title.val()
        frm.dataForm['cof_type'] = pageElements.$cof_type.val()
        frm.dataForm['posting_date'] = moment(pageElements.$posting_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['document_date'] = moment(pageElements.$document_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['description'] = pageElements.$description.val()

        if (pageElements.$cof_type.val() === '0') {
            frm.dataForm['supplier'] = pageElements.$supplier_name.attr('data-id') || null
            let cash_out_advance_for_supplier_data = []
            let cash_out_ap_invoice_data = []

            frm.dataForm['advance_for_supplier_value'] = pageElements.$advance_for_supplier_value.attr('value') ? pageElements.$advance_for_supplier_value.attr('value') : 0
            const cof_value = $('#cof_type_label').attr('data-value')
            if (cof_value === '0') {
                cash_out_ap_invoice_data = []
                pageElements.$advance_for_supplier_table.find('tbody tr').each(function () {
                    if ($(this).find('.select_row_advance_for_supplier').prop('checked')) {
                        cash_out_advance_for_supplier_data.push({
                            'purchase_order_stage_id': $(this).find('.select_row_advance_for_supplier').attr('data-advance-for-supplier-id') || null,
                            'sum_balance_value': $(this).find('.recon_balance_value_advance').attr('data-init-money'),
                            'sum_payment_value': $(this).find('.cash_out_value_advance').attr('value'),
                        })
                    }
                })
            } else if (cof_value === '1') {
                cash_out_advance_for_supplier_data = []
                pageElements.$ap_invoice_table.find('tbody tr').each(function () {
                    if ($(this).find('.select_row_ap_invoice').prop('checked')) {
                        let detail_payment = $(this).find('.btn_selected_payment_stage').attr('data-detail-payment')
                        cash_out_ap_invoice_data.push({
                            'ap_invoice_id': $(this).find('.select_row_ap_invoice').attr('data-ap-invoice-id') || null,
                            'sum_balance_value': $(this).find('.recon_balance_value').attr('data-init-money'),
                            'sum_payment_value': $(this).find('.cash_out_value').attr('value'),
                            'discount_payment': 0,
                            'discount_value': 0,
                            'detail_payment': detail_payment ? JSON.parse(detail_payment) : []
                        })
                    }
                })
            }

            frm.dataForm['cash_out_advance_for_supplier_data'] = cash_out_advance_for_supplier_data
            frm.dataForm['cash_out_ap_invoice_data'] = cash_out_ap_invoice_data
        }
        else if (pageElements.$cof_type.val() === '1') {
            frm.dataForm['advance_for_employee_value'] = pageElements.$advance_for_employee_value.val()
        }
        else if (pageElements.$cof_type.val() === '2') {

        }
        else if (pageElements.$cof_type.val() === '3') {

        }

        frm.dataForm['payment_method_data'] = pageElements.$btn_modal_payment_method.attr('data-payment-method') ? JSON.parse(pageElements.$btn_modal_payment_method.attr('data-payment-method')) : {}

        // console.log(frm)
        return frm
    }
    static LoadDetailCOF(option) {
        pageVariables.is_detail_page = option === 'detail'
        let url_loaded = $('#form-detail-cashoutflow').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['cash_outflow_detail'];
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    // console.log(data)

                    pageElements.$title.val(data?.['title'])
                    pageElements.$cof_type.val(data?.['cof_type'])
                    pageElements.$posting_date.val(moment(data?.['posting_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    pageElements.$document_date.val(moment(data?.['document_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    pageElements.$description.val(data?.['description'])

                    if (pageElements.$cof_type.val() === '0') {
                        let supplier_data = data?.['supplier_data'] || {}
                        pageElements.$supplier_name.val(supplier_data?.['name'] || '')
                        pageElements.$supplier_name.attr('data-id', supplier_data?.['id'] || '')
                        pageElements.$advance_for_supplier_value.attr('value', data?.['advance_for_supplier_value'] ? data?.['advance_for_supplier_value'] : 0)
                        if (data?.['system_status'] === 3) {
                            if (data?.['cash_out_advance_for_supplier_data'].length === 0 && data?.['cash_out_ap_invoice_data'].length === 0) {
                                // phiếu đã duyệt nhưng chỉ chi tạm ứng không theo hđ
                                COFPageFunction.LoadAdvanceToSupplierTable()
                                COFPageFunction.LoadAPInvoiceTable()
                            }
                            else if (data?.['cash_out_advance_for_supplier_data'].length > 0) {
                                $('#cof_type_label').text($('#cof_type .dropdown-item:eq(0)').text()).attr('data-value', '0')
                                $('#area_table_advance_to_supplier').prop('hidden', false)
                                $('#area_table_ap_invoice').prop('hidden', true)
                                // nếu chi tạm ứng theo hđ
                                COFPageFunction.LoadAdvanceToSupplierTable(
                                    {
                                        'purchase_order__supplier_id': pageElements.$supplier_name.attr('data-id'),
                                    },
                                    data?.['cash_out_advance_for_supplier_data'],
                                    data?.['system_status'] === 3
                                )
                                COFPageFunction.LoadAPInvoiceTable()
                            }
                            else if (data?.['cash_out_ap_invoice_data'].length > 0) {
                                $('#cof_type_label').text($('#cof_type .dropdown-item:eq(1)').text()).attr('data-value', '1')
                                $('#area_table_advance_to_supplier').prop('hidden', true)
                                $('#area_table_ap_invoice').prop('hidden', false)
                                // nếu chi theo hóa đơn
                                COFPageFunction.LoadAdvanceToSupplierTable()
                                COFPageFunction.LoadAPInvoiceTable(
                                    {
                                        'supplier_mapped_id': pageElements.$supplier_name.attr('data-id'),
                                    },
                                    data?.['cash_out_ap_invoice_data'],
                                    data?.['system_status'] === 3
                                )
                            }
                        }
                        else {
                            if (data?.['cash_out_advance_for_supplier_data'].length > 0) {
                                $('#cof_type_label').text($('#cof_type .dropdown-item:eq(0)').text()).attr('data-value', '0')
                                $('#area_table_advance_to_supplier').prop('hidden', false)
                                $('#area_table_ap_invoice').prop('hidden', true)
                            }
                            else if (data?.['cash_out_ap_invoice_data'].length > 0) {
                                $('#cof_type_label').text($('#cof_type .dropdown-item:eq(1)').text()).attr('data-value', '1')
                                $('#area_table_advance_to_supplier').prop('hidden', true)
                                $('#area_table_ap_invoice').prop('hidden', false)
                            }
                            COFPageFunction.LoadAdvanceToSupplierTable(
                                {
                                    'purchase_order__supplier_id': pageElements.$supplier_name.attr('data-id'),
                                    'cash_outflow_done': false
                                },
                                data?.['cash_out_advance_for_supplier_data'],
                                data?.['system_status'] === 3
                            )
                            COFPageFunction.LoadAPInvoiceTable(
                                {
                                    'supplier_mapped_id': pageElements.$supplier_name.attr('data-id'),
                                    'cash_outflow_done': false
                                },
                                data?.['cash_out_ap_invoice_data'],
                                data?.['system_status'] === 3
                            )
                        }
                    }
                    if (pageElements.$cof_type.val() === '1') {}
                    if (pageElements.$cof_type.val() === '2') {
                        let employee_data = data?.['employee_data'] || {}
                        pageElements.$employee_name.val(employee_data?.['full_name'] || '' + '(' + employee_data?.['group']?.['title'] || '' + ')')
                        pageElements.$employee_name.attr('data-id', employee_data?.['id'] || '')
                        pageElements.$advance_for_employee_value.attr('value', data?.['advance_for_employee_value'] ? data?.['advance_for_employee_value'] : 0)
                    }
                    if (pageElements.$cof_type.val() === '3') {}

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
                    COFPageFunction.LoadCompanyBankAccount(pageElements.$company_bank_account, data?.['company_bank_account_data'])

                    $.fn.initMaskMoney2()
                    UsualLoadPageFunction.DisablePage(
                        option === 'detail',
                        ['#btn-modal-payment-method']
                    );
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class COFEventHandler {
    static InitPageEven() {
        pageElements.$cof_type.on('change', function () {
            if ($(this).val() === '0') {
                pageElements.$supplier_space.prop('hidden', false)
                pageElements.$customer_space.prop('hidden', true)
                pageElements.$employee_space.prop('hidden', true)
            }
            else if ($(this).val() === '1') {
                pageElements.$supplier_space.prop('hidden', true)
                pageElements.$customer_space.prop('hidden', false)
                pageElements.$employee_space.prop('hidden', true)
            }
            else if ($(this).val() === '2') {
                pageElements.$supplier_space.prop('hidden', true)
                pageElements.$customer_space.prop('hidden', true)
                pageElements.$employee_space.prop('hidden', false)
            }
            else if ($(this).val() === '3') {
                pageElements.$supplier_space.prop('hidden', true)
                pageElements.$customer_space.prop('hidden', true)
                pageElements.$employee_space.prop('hidden', true)
            }
        })
        pageElements.$accept_select_supplier_btn.on('click', function () {
            let selected = null
            $('input[name="supplier-selected-radio"]').each(function () {
                if ($(this).prop('checked')) {
                    selected = $(this).attr('data-supplier') ? JSON.parse($(this).attr('data-supplier')) : null
                    pageElements.$supplier_name.attr('data-id', selected?.['id'] || '')
                    pageElements.$supplier_name.val(selected?.['name'] || '')
                    pageElements.$supplier_select_modal.modal('hide')
                    COFPageFunction.LoadAdvanceToSupplierTable({
                        'purchase_order__supplier_id': pageElements.$supplier_name.attr('data-id'),
                        'cash_outflow_done': false
                    })
                    COFPageFunction.LoadAPInvoiceTable({
                        'supplier_mapped_id': pageElements.$supplier_name.attr('data-id'),
                        'cash_outflow_done': false
                    })
                }
            })
            if (!selected) {
                $.fn.notifyB({description: 'Nothing selected'}, 'warning');
            }
        })
        pageElements.$accept_select_customer_btn.on('click', function () {
            let selected = null
            $('input[name="customer-selected-radio"]').each(function () {
                if ($(this).prop('checked')) {
                    selected = $(this).attr('data-customer') ? JSON.parse($(this).attr('data-customer')) : null
                    pageElements.$customer_name.attr('data-id', selected?.['id'] || '')
                    pageElements.$customer_name.val(selected?.['name'] || '')
                    pageElements.$customer_select_modal.modal('hide')
                }
            })
            if (!selected) {
                $.fn.notifyB({description: 'Nothing selected'}, 'warning');
            }
        })
        pageElements.$accept_select_employee_btn.on('click', function () {
            let selected = null
            $('input[name="employee-selected-radio"]').each(function () {
                if ($(this).prop('checked')) {
                    selected = $(this).attr('data-employee') ? JSON.parse($(this).attr('data-employee')) : null
                    pageElements.$employee_name.attr('data-id', selected?.['id'] || '')
                    pageElements.$employee_name.val(`${(selected?.['full_name'] || '')} (${((selected?.['group'] || {})?.['title'] || '')})`)
                    pageElements.$employee_select_modal.modal('hide')
                }
            })
            if (!selected) {
                $.fn.notifyB({description: 'Nothing selected'}, 'warning');
            }
        })
        // thay đổi giá trị tạm ứng không theo hđ
        pageElements.$advance_for_supplier_value.on('change', function () {
            COFPageFunction.RecalculateTotalPayment()
        })
        // check chọn các dòng trong 2 bảng chính
        $(document).on('change', '.select_row_advance_for_supplier', function () {
            $(this).closest('tr').find('.cash_out_value_advance').attr('value', $(this).prop('checked') ? $(this).closest('tr').find('.recon_balance_value_advance').attr('data-init-money') : 0)
            $.fn.initMaskMoney2()
            COFPageFunction.RecalculateTotalPayment()
        })
        $(document).on('change', '.select_row_ap_invoice', function () {
            $(this).closest('tr').find('.btn_selected_payment_stage').prop('hidden', !$(this).prop('checked'))
            if (!$(this).prop('checked')) {
                $(this).closest('tr').find('.cash_out_value').attr('value', 0)
            }
            $.fn.initMaskMoney2()
            COFPageFunction.RecalculateTotalPayment()
        })
        // thay đổi giá trị chi trên các dòng
        $(document).on('change', '.cash_out_value_advance', function () {
            let this_value = parseFloat($(this).attr('value'))
            let balance_value = parseFloat($(this).closest('tr').find('.recon_balance_value_advance').attr('data-init-money'))
            if (this_value > balance_value) {
                $.fn.notifyB({description: `Payment value can not > Balance value`}, 'failure');
                $(this).attr('value', balance_value)
            }
            $.fn.initMaskMoney2()
            COFPageFunction.RecalculateTotalPayment()
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
            pageVariables.current_row_ap_invoice = $(this).closest('tr')
            let payment_term_data = $(this).attr('data-payment-term') ? JSON.parse($(this).attr('data-payment-term')) : []
            let payment_stage_mapped_data = $(this).attr('data-detail-payment') ? JSON.parse($(this).attr('data-detail-payment')) : []
            COFPageFunction.LoadPaymentStageTable(payment_term_data, payment_stage_mapped_data)
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
            COFPageFunction.CalculateModalDetailPaymentSum()
        })
        $('#save-detail-payment-value').on('click', function () {
            COFPageFunction.CalculateAPInvoiceRow()
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
            COFPageFunction.CalculateModalDetailPaymentSum()
        })
        // thay đổi loại thu tiền
        $('#cof_type .dropdown-item').on('click', function () {
            $('#cof_type_label').text($(this).text()).attr('data-value', $(this).attr('data-value'))
            $('#area_table_advance_to_supplier').prop('hidden', $(this).attr('data-value') !== '0')
            $('#area_table_ap_invoice').prop('hidden', $(this).attr('data-value') !== '1')
        })

        // thay đổi giá trị tạm ứng cho nhân viên
        pageElements.$advance_for_employee_value.on('change', function () {
            COFPageFunction.RecalculateTotalPayment()
        })
    }
}
