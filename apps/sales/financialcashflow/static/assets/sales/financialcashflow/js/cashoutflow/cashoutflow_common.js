/**
 * Khai báo các element trong page
 */
class COFPageElements {
    constructor() {
        this.$title = $('#title')
        this.$cof_type = $('#cof_type')
        this.$description = $('#description')
        this.$posting_date = $('#posting_date')
        this.$document_date = $('#document_date')
        // supplier
        this.$supplier_space = $('.supplier-space')
        this.$supplier_name = $('#supplier-name')
        this.$supplier_select_modal = $('#supplier-select-modal')
        this.$table_select_supplier = $('#table-select-supplier')
        this.$accept_select_supplier_btn = $('#accept-select-supplier-btn')
        this.$advance_for_supplier_value = $('#advance_for_supplier_value')
        this.$advance_for_supplier_table = $('#advance-to-supplier-table')
        this.$ap_invoice_table = $('#ap-invoice-table')
        // customer
        this.$customer_space = $('.customer-space')
        this.$customer_name = $('#customer-name')
        this.$customer_select_modal = $('#customer-select-modal')
        this.$table_select_customer = $('#table-select-customer')
        this.$accept_select_customer_btn = $('#accept-select-customer-btn')
        this.$payment_to_customer = $('#payment_to_customer')
        // employee
        this.$employee_space = $('.employee-space')
        this.$opportunity_id = $('#opportunity_id')
        this.$so_mapped = $('#so_mapped')
        this.$lo_mapped = $('#lo_mapped')
        this.$svo_mapped = $('#svo_mapped')
        this.$order_cost_table = $('#order-cost-table')
        // payment on account
        this.$account_space = $('.account-space')
        this.$payment_on_account_table = $('#payment-on-account-table')
        this.$btn_add_row_account = $('#btn-add-row-account')
        // detail payment
        this.$detail_payment_value_modal = $('#detail-payment-value-modal')
        this.$detail_payment_table = $('#detail-payment-table')
        this.$total_payment = $('#total_payment')
        this.$total_payment_modal = $('#total_payment_modal')
        this.$btn_modal_payment_method = $('#btn-modal-payment-method')
        this.$save_changes_payment_method = $('#save-changes-payment-method')
        this.$payment_method_modal = $('#payment-method-modal')
        this.$cash_value = $('#cash_value')
        this.$bank_value = $('#bank_value')
        this.$account_bank_account = $('#account_bank_account')
        this.$banking_information = $('#banking_information')
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
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-5',
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
                className: 'w-25',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['remark']}</span>`;
                }
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return row?.['is_ap_invoice'] ? `<span class="text-muted no-invoice">${row?.['invoice'] ? row?.['invoice'] : ''}</span>` : '--';
                }
            },
            {
                className: 'text-right w-15',
                render: (data, type, row) => {
                    return row?.['is_ap_invoice'] ? `<span class="mask-money detail-invoice-value" data-init-money="${row?.['value_total'] ? row?.['value_total'] : 0}"></span>` : '--';
                }
            },
            {
                className: 'text-right w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money" data-init-money="${row?.['recon_total'] ? row?.['recon_total'] : 0}"></span>`;
                }
            },
            {
                className: 'text-right w-15',
                render: (data, type, row) => {
                    return row?.['is_ap_invoice'] ? `<span class="mask-money detail_balance_value" data-init-money="${row?.['recon_balance']}"></span>` : '--';
                }
            },
            {
                className: 'text-right w-15',
                render: (data, type, row) => {
                    return row?.['is_ap_invoice'] ? `<input disabled readonly class="form-control text-right mask-money detail_payment_value" value="0">` : '--';
                }
            },
            {
                className: 'text-right w-10',
                render: (data, type, row) => {
                    return `<span class="text-muted">📅 ${moment(row?.['due_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`;
                }
            },
        ]
        this.advance_to_supplier_table_cfg = [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-5',
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
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span class="text-primary fw-bold">${row?.['purchase_order']?.['code']}</span>`
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['remark']}</span>`;
                }
            },
            {
                className: 'text-right w-10',
                render: (data, type, row) => {
                    return `<span class="text-muted">📅 ${moment(row?.['due_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`;
                }
            },
            {
                className: 'text-right w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money value_total_advance" data-init-money="${row?.['value_total']}"></span>`;
                }
            },
            {
                className: 'text-right w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money recon_balance_value_advance" data-init-money="${row?.['value_balance']}"></span>`;
                }
            },
            {
                className: 'text-right w-15',
                render: () => {
                    return `<input ${pageVariables.is_detail_page ? 'disabled readonly': ''} class="form-control text-right mask-money cash_out_value_advance" value="0"">`;
                }
            },
        ]
        this.ap_invoice_table_cfg = [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-5',
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
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span class="text-primary fw-bold">${row?.['code'] ? row?.['code'] : ''}</span>`
                }
            },
            {
                className: 'text-right w-10',
                render: (data, type, row) => {
                    return `<span class="text-muted">📅 ${row?.['document_date'] ? moment(row?.['document_date'].split(' '), 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}</span>`;
                }
            },
            {
                className: 'text-right w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money" data-init-money="${row?.['recon_total'] || 0}"></span>`;
                }
            },
            {
                className: 'text-right w-15',
                render: (data, type, row) => {
                    return `<span class="mask-money recon_balance_value" data-init-money="${row?.['recon_balance']}"></span>`;
                }
            },
            {
                className: 'text-right w-20',
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
                className: 'text-right w-15',
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
        this.payment_on_account_table_cfg = [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<select class="form-select account-select"></select>`
                }
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return `<span class="account-code" style="font-size: 20px">---</span>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="mask-money net-amount-value" data-init-money="0"></span>`
                }
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return `<select class="form-select tax-select"></select>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="mask-money total-value" data-init-money="0"></span>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="mask-money balance-value" data-init-money="0"></span>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<input class="form-control mask-money payment-value" value="0">`
                }
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return `<input class="form-control invoice-date">`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<input class="form-control invoice-number">`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<select class="form-select business-partner"></select>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="business-partner-tax-code">---</span>`
                }
            },
        ]
        this.order_cost_table_cfg = [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return `<div class="form-check">
                                <input type="checkbox"
                                       ${pageVariables.is_detail_page ? 'disabled': ''}
                                       class="form-check-input select_row_order_cost"
                                       data-sale-order-id="${row?.['expense_item_data']?.['id']}"
                                >
                                <label class="form-check-label"></label>
                            </div>`
                }
            },
            {
                className: 'w-30',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['expense_item_data']?.['title'] || ''}</span>`
                }
            },
            {
                className: 'text-right w-20',
                render: (data, type, row) => {
                    return `<span class="mask-money" data-init-money="${row?.['total_value'] || 0}"></span>`;
                }
            },
            {
                className: 'text-right w-20',
                render: (data, type, row) => {
                    return `<span class="mask-money total_balance" data-init-money="${row?.['total_balance'] || 0}"></span>`;
                }
            },
            {
                className: 'text-right w-20',
                render: (data, type, row) => {
                    return `<input class="form-control mask-money this_time text-right" value="${row?.['this_time'] || 0}">`;
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
    // cof for supplier
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
                scrollX: true,
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
                            return resp.data['po_payment_stage_list'] ? resp.data['po_payment_stage_list'] : [];
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
                scrollX: true,
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
                scrollX: true,
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
                            return resp.data['ap_invoice_po_payment_stage_list'] ? resp.data['ap_invoice_po_payment_stage_list'].filter(item => item?.['recon_balance'] > 0) : [];
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
                scrollX: true,
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: pageVariables.ap_invoice_table_cfg,
                initComplete: function () {}
            });
        }
    }
    // cof payment on account
    static LoadPaymentOnAccountTable(data_list=[]) {
        pageElements.$payment_on_account_table.DataTable().clear().destroy()
        pageElements.$payment_on_account_table.DataTableDefault({
            dom: 't',
            reloadCurrency: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '40vh',
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: pageVariables.payment_on_account_table_cfg
        });
    }
    // cof for employee
    static LoadSaleOrder(data) {
        pageElements.$so_mapped.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$so_mapped.attr('data-url'),
                data: {'system_status': 3},
                method: 'GET',
            },
            templateResult: function (state) {
                return $(`<span class="badge badge-light mr-1">${state.data?.['code']}</span><span>${state.data?.['title']}</span>`);
            },
            data: (data ? data : null),
            keyResp: 'sale_order_list',
            keyId: 'id',
            keyText: 'code',
        }).on('change', function () {})
    }
    static LoadLeaseOrder(data) {
        pageElements.$lo_mapped.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$lo_mapped.attr('data-url'),
                data: {'system_status': 3},
                method: 'GET',
            },
            templateResult: function (state) {
                return $(`<span class="badge badge-light mr-1">${state.data?.['code']}</span><span>${state.data?.['title']}</span>`);
            },
            data: (data ? data : null),
            keyResp: 'lease_order_list',
            keyId: 'id',
            keyText: 'code',
        }).on('change', function () {})
    }
    static LoadServiceOrder(data) {
        pageElements.$svo_mapped.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$svo_mapped.attr('data-url'),
                data: {'system_status': 3},
                method: 'GET',
            },
            templateResult: function (state) {
                return $(`<span class="badge badge-light mr-1">${state.data?.['code']}</span><span>${state.data?.['title']}</span>`);
            },
            data: (data ? data : null),
            keyResp: 'service_order_list',
            keyId: 'id',
            keyText: 'code',
        }).on('change', function () {})
    }
    static LoadOrderCostTable(data_params={}, data_list=[]) {
        let so_expense_list_ajax = $.fn.callAjax2({
                url: pageElements.$order_cost_table.attr('data-so-expense-list-url'),
                data: {'sale_order_id': data_params?.['sale_order_id']},
                method: 'GET'
            }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('so_expense_list')) {
                    return data?.['so_expense_list'] || [];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        let lo_expense_list_ajax = $.fn.callAjax2({
                url: pageElements.$order_cost_table.attr('data-lo-expense-list-url'),
                data: {'lease_order_id': data_params?.['lease_order_id']},
                method: 'GET'
            }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('lo_expense_list')) {
                    return data?.['lo_expense_list'] || [];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([so_expense_list_ajax, lo_expense_list_ajax]).then(
            (results) => {
                let so_expense_list = results[0];
                let lo_expense_list = results[1];

                pageElements.$order_cost_table.DataTable().clear().destroy()
                if (Object.keys(data_params).length > 0) {
                    pageElements.$order_cost_table.DataTableDefault({
                        dom: 't',
                        reloadCurrency: true,
                        rowIdx: true,
                        scrollX: true,
                        scrollY: '30vh',
                        scrollCollapse: true,
                        paging: false,
                        data: so_expense_list.concat(lo_expense_list),
                        columns: pageVariables.order_cost_table_cfg,
                        initComplete: function () {}
                    });
                }
                else {
                    pageElements.$order_cost_table.DataTableDefault({
                        dom: 't',
                        reloadCurrency: true,
                        rowIdx: true,
                        scrollX: true,
                        scrollY: '30vh',
                        scrollCollapse: true,
                        paging: false,
                        data: [],
                        columns: pageVariables.order_cost_table_cfg,
                    });
                }
            })
    }
    // modal
    static LoadPaymentStageTable(data_list=[], valid_detail_payment=[]) {
        pageElements.$detail_payment_table.DataTable().clear().destroy()
        if (pageElements.$supplier_name.attr('data-id')) {
            pageElements.$detail_payment_table.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: true,
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
                scrollX: true,
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: pageVariables.selected_payment_stage_table_cfg,
            });
        }
    }
    static LoadAccountBankAccount(bank_accounts_mapped=[], selected_id=null) {
        let options = ''
        for (let i=0; i < bank_accounts_mapped.length; i++) {
            let item = bank_accounts_mapped[i]
            options += `<option value="${item?.['id']}" ${item?.['id'] === selected_id ? 'selected' : ''} ${(item?.['is_default'] && selected_id === null) ? 'selected' : ''}>
                            ${item?.['bank_account_number']} (${item?.['bank_account_name']}) - ${item?.['bank_name']} (${item?.['bank_code']})
                        </option>`
        }
        pageElements.$account_bank_account.html(options)
    }
    // sub
    static RecalculateTotalPayment() {
        let total_payment = 0
        if (pageElements.$cof_type.val() === '0') {
            total_payment += pageElements.$advance_for_supplier_value.attr('value') ? parseFloat(pageElements.$advance_for_supplier_value.attr('value')) : 0

            pageElements.$advance_for_supplier_table.find('tbody tr').each(function () {
                total_payment += $(this).find('.cash_out_value_advance').attr('value') ? parseFloat($(this).find('.cash_out_value_advance').attr('value')) : 0
            })

            pageElements.$ap_invoice_table.find('tbody tr').each(function () {
                total_payment += $(this).find('.cash_out_value').attr('value') ? parseFloat($(this).find('.cash_out_value').attr('value')) : 0
            })
        }
        else if (pageElements.$cof_type.val() === '1') {
            total_payment += pageElements.$payment_to_customer.attr('value') ? parseFloat(pageElements.$payment_to_customer.attr('value')) : 0
        }
        else if (pageElements.$cof_type.val() === '2') {
            total_payment += 999
        }
        else if (pageElements.$cof_type.val() === '3') {

        }
        pageElements.$total_payment.attr('value', total_payment)
        pageElements.$total_payment_modal.attr('value', pageElements.$total_payment.attr('value'))
        pageElements.$btn_modal_payment_method.prop('disabled', total_payment === 0)
        pageElements.$btn_modal_payment_method.removeClass('btn-success').addClass('btn-danger')
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
            frm.dataForm['supplier_id'] = pageElements.$supplier_name.attr('data-id') || null
            let cash_out_advance_for_supplier_data = []
            let cash_out_ap_invoice_data = []

            frm.dataForm['advance_for_supplier_value'] = pageElements.$advance_for_supplier_value.attr('value') ? pageElements.$advance_for_supplier_value.attr('value') : 0

            pageElements.$advance_for_supplier_table.find('tbody tr').each(function () {
                if ($(this).find('.select_row_advance_for_supplier').prop('checked')) {
                    cash_out_advance_for_supplier_data.push({
                        'purchase_order_stage_id': $(this).find('.select_row_advance_for_supplier').attr('data-advance-for-supplier-id') || null,
                        'sum_balance_value': $(this).find('.recon_balance_value_advance').attr('data-init-money'),
                        'sum_payment_value': $(this).find('.cash_out_value_advance').attr('value'),
                    })
                }
            })

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

            frm.dataForm['cash_out_advance_for_supplier_data'] = cash_out_advance_for_supplier_data
            frm.dataForm['cash_out_ap_invoice_data'] = cash_out_ap_invoice_data
        }
        else if (pageElements.$cof_type.val() === '1') {
            frm.dataForm['customer_id'] = pageElements.$customer_name.attr('data-id') || null
            frm.dataForm['payment_to_customer_value'] = pageElements.$payment_to_customer.attr('value')
        }
        else if (pageElements.$cof_type.val() === '2') {

        }
        else if (pageElements.$cof_type.val() === '3') {
        }

        // frm.dataForm['payment_method_data'] = pageElements.$btn_modal_payment_method.attr('data-payment-method') ? JSON.parse(pageElements.$btn_modal_payment_method.attr('data-payment-method')) : {}
        frm.dataForm['payment_method_data'] = {
            'cash_value': pageElements.$cash_value.attr('value'),
            'bank_value': pageElements.$bank_value.attr('value'),
            'account_bank_account_id': pageElements.$account_bank_account.val(),
            'banking_information': pageElements.$banking_information.val(),
        }

        // budget line data
        frm.dataForm['total_value'] = BudgetControl.dtbTotalConsume();
        frm.dataForm['budget_line_data'] = BudgetControl.setupSubmitTblBudget();

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
                    pageElements.$cof_type.trigger('change')
                    pageElements.$posting_date.val(moment(data?.['posting_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    pageElements.$document_date.val(moment(data?.['document_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    pageElements.$description.val(data?.['description'])

                    const data_inherit = Object.keys(data?.['employee_inherit'] || {}).length > 0 ? [{
                        "id": data?.['employee_inherit']?.['id'],
                        "full_name": data?.['employee_inherit']?.['full_name'] || '',
                        "first_name": data?.['employee_inherit']?.['first_name'] || '',
                        "last_name": data?.['employee_inherit']?.['last_name'] || '',
                        "email": data?.['employee_inherit']?.['email'] || '',
                        "is_active": data?.['employee_inherit']?.['is_active'] || false,
                        "selected": true,
                    }] : [];
                    const data_opp = Object.keys(data?.['opportunity'] || {}).length > 0 ? [{
                        "id": data?.['opportunity']?.['id'] || '',
                        "title": data?.['opportunity']?.['title'] || '',
                        "code": data?.['opportunity']?.['code'] || '',
                        "selected": true,
                    }] : [];
                    const data_process = Object.keys(data?.['process'] || {}).length > 0 ? [{
                        ...data?.['process'],
                        "selected": true,
                    }] : [];
                    const data_process_stage_app = Object.keys(data?.['process_stage_app'] || []).length > 0 ? [{
                        ...data['process_stage_app'],
                        'selected': true,
                    }] : [];

                    new $x.cls.bastionField({
                        has_opp: true,
                        has_inherit: true,
                        has_process: true,
                        data_opp: data_opp,
                        data_inherit: data_inherit,
                        data_process: data_process,
                        data_process_stage_app: data_process_stage_app,
                    }).init();

                    if (pageElements.$cof_type.val() === '0') {
                        let supplier_data = data?.['supplier_data'] || {}
                        pageElements.$supplier_name.val(supplier_data?.['name'] || '')
                        pageElements.$supplier_name.attr('data-id', supplier_data?.['id'] || '')
                        COFPageFunction.LoadAccountBankAccount(supplier_data?.['bank_accounts_mapped'], data?.['account_bank_account_data']?.['id'])
                        pageElements.$advance_for_supplier_value.attr('value', data?.['advance_for_supplier_value'] ? data?.['advance_for_supplier_value'] : 0)
                        let param1 = {}
                        let param2 = {}
                        if (data?.['system_status'] === 3) {
                            param1 = {
                                'purchase_order__supplier_id': pageElements.$supplier_name.attr('data-id'),
                            }
                            param2 = {
                                'supplier_mapped_id': pageElements.$supplier_name.attr('data-id'),
                            }
                        }
                        else {
                            param1 = {
                                'purchase_order__supplier_id': pageElements.$supplier_name.attr('data-id'),
                                'cash_outflow_done': false
                            }
                            param2 = {
                                'supplier_mapped_id': pageElements.$supplier_name.attr('data-id'),
                                'cash_outflow_done': false
                            }
                        }
                        COFPageFunction.LoadAdvanceToSupplierTable(
                            param1,
                            data?.['cash_out_advance_for_supplier_data'],
                            data?.['system_status'] === 3
                        )
                        COFPageFunction.LoadAPInvoiceTable(
                            param2,
                            data?.['cash_out_ap_invoice_data'],
                            data?.['system_status'] === 3
                        )
                    }
                    else if (pageElements.$cof_type.val() === '1') {
                        let customer_data = data?.['customer_data'] || {}
                        pageElements.$customer_name.val(customer_data?.['name'] || '')
                        pageElements.$customer_name.attr('data-id', customer_data?.['id'] || '')
                        COFPageFunction.LoadAccountBankAccount(customer_data?.['bank_accounts_mapped'], data?.['account_bank_account_data']?.['id'])
                        pageElements.$payment_to_customer.attr('value', data?.['payment_to_customer_value'] ? data?.['payment_to_customer_value'] : 0)
                    }
                    else if (pageElements.$cof_type.val() === '2') {
                        COFPageFunction.LoadAccountBankAccount()
                    }
                    else if (pageElements.$cof_type.val() === '3') {
                    }

                    pageElements.$total_payment.attr('value', data?.['total_value'])

                    let payment_method_data = {
                        'cash_value': data?.['cash_value'],
                        'bank_value': data?.['bank_value'],
                        'account_bank_account_id': data?.['account_bank_account_data']?.['id'],
                    }
                    pageElements.$btn_modal_payment_method.prop('disabled', false)
                    pageElements.$btn_modal_payment_method.attr('data-payment-method', JSON.stringify(payment_method_data))
                    pageElements.$btn_modal_payment_method.removeClass('btn-danger').addClass('btn-success')
                    pageElements.$total_payment_modal.attr('value', data?.['total_value'])
                    pageElements.$cash_value.attr('value', data?.['cash_value'])
                    pageElements.$bank_value.attr('value', data?.['bank_value'])
                    pageElements.$banking_information.val(data?.['banking_information'])

                    $.fn.initMaskMoney2()
                    UsualLoadPageFunction.DisablePage(
                        option === 'detail',
                        ['#btn-modal-payment-method']
                    );
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                    // budget line data
                    BudgetControl.dtbRenderDetail(data?.['budget_line_data'] ? data?.['budget_line_data'] : []);
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
            if (Number($(this).val()) === 0) {
                pageElements.$supplier_space.prop('hidden', false)
                pageElements.$customer_space.prop('hidden', true)
                pageElements.$employee_space.prop('hidden', true)
                // pageElements.$account_space.prop('hidden', true)
            }
            else if (Number($(this).val()) === 1) {
                pageElements.$supplier_space.prop('hidden', true)
                pageElements.$customer_space.prop('hidden', false)
                pageElements.$employee_space.prop('hidden', true)
                // pageElements.$account_space.prop('hidden', true)
            }
            else if (Number($(this).val()) === 2) {
                pageElements.$supplier_space.prop('hidden', true)
                pageElements.$customer_space.prop('hidden', true)
                pageElements.$employee_space.prop('hidden', false)
                // pageElements.$account_space.prop('hidden', true)

                BudgetControl.loadReInitDtbBudget();
            }
            else if (Number($(this).val()) === 3) {
                pageElements.$supplier_space.prop('hidden', true)
                pageElements.$customer_space.prop('hidden', true)
                pageElements.$employee_space.prop('hidden', true)
                // pageElements.$account_space.prop('hidden', false)
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

            COFPageFunction.LoadAccountBankAccount(selected?.['bank_accounts_mapped'] || [])
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

            COFPageFunction.LoadAccountBankAccount(selected?.['bank_accounts_mapped'] || [])
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
                parseFloat(pageElements.$cash_value.attr('value')) + parseFloat(pageElements.$bank_value.attr('value')) === BudgetControl.dtbTotalConsume()
                // && parseFloat(pageElements.$total_payment_modal.attr('value')) !== 0
            ) {
                if (parseFloat(pageElements.$bank_value.attr('value')) > 0 && !pageElements.$account_bank_account.val()) {
                    if (!pageElements.$banking_information.val()) {
                        $.fn.notifyB({description: `Bank account or Banking information is required if Bank value > 0`}, 'failure');
                    }
                }
                else {
                    let payment_method_data = {
                        'cash_value': pageElements.$cash_value.attr('value'),
                        'bank_value': pageElements.$bank_value.attr('value'),
                        'account_bank_account_id': pageElements.$account_bank_account.val(),
                        'banking_information': pageElements.$banking_information.val(),
                    }
                    pageElements.$btn_modal_payment_method.attr('data-payment-method', JSON.stringify(payment_method_data))
                    pageElements.$btn_modal_payment_method.removeClass('btn-danger').addClass('btn-success')
                    pageElements.$payment_method_modal.modal('hide')
                }
            }
            else {
                pageElements.$btn_modal_payment_method.removeClass('btn-success').addClass('btn-danger')
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
        // thay đổi giá trị tạm ứng cho KH
        pageElements.$payment_to_customer.on('change', function () {
            COFPageFunction.RecalculateTotalPayment()
        })
        // thay đổi giá trị tạm ứng cho nhân viên
        // thêm dòng vô bảng tài khoản
        pageElements.$btn_add_row_account.on('click', function () {
            UsualLoadPageFunction.AddTableRow(pageElements.$payment_on_account_table)
            let row_added = pageElements.$payment_on_account_table.find('tbody tr:last-child')
        })

        pageElements.$opportunity_id.on('change', function () {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            if (selected) {
                console.log(selected)
                COFPageFunction.LoadSaleOrder(selected?.['sale_order'] || {})
                COFPageFunction.LoadLeaseOrder(selected?.['lease_order'] || {})
                pageElements.$so_mapped.prop('disabled', true)
                pageElements.$lo_mapped.prop('disabled', true)
                COFPageFunction.LoadOrderCostTable({
                    'sale_order_id': selected?.['sale_order']?.['id'],
                    'lease_order_id': selected?.['lease_order']?.['id']
                })
            }
        })
    }
}
