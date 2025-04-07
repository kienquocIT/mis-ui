/**
 * Khai báo các element trong page
 */
class COFPageElements {
    constructor() {
        this.$title = $('#title')
        this.$payment_type = $('#payment_type')
        this.$supplier_space = $('.supplier-space')
        this.$customer_space = $('.customer-space')
        this.$employee_space = $('.employee-space')
        this.$supplier_name = $('#supplier-name')
        this.$customer_name = $('#customer-name')
        this.$employee_name = $('#employee-name')
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
        this.$advance_to_supplier_table = $('#advance-to-supplier-table')
        this.$ap_invoice_table = $('#ap-invoice-table')
    }
}
const pageElements = new COFPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class COFPageVariables {
    constructor() {
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
                           class="form-check-input select_row_advance_for_supplier"
                           data-advance-for-supplier-id="${row?.['id']}"
                    >
                    <label class="form-check-label"></label>
                </div>`
                }
            },
            {
                className: 'wrap-text w-5',
                render: (data, type, row) => {
                    return `<span class="badge badge-primary">${row?.['purchase_order']?.['code']}</span>`
                }
            },
            {
                className: 'wrap-text w-30',
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
                    return `<input class="form-control text-right mask-money cash_out_value_advance" value="0"">`;
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
    }
}
const pageVariables = new COFPageVariables();

/**
 * Các hàm load page và hàm hỗ trợ
 */
class COFPageFunction {
    static LoadAdvanceToSupplierTable(data_params={}, data_list=[], approved=false) {
        if (approved) {
            let stage_id = []
            for (let i = 0; i < data_list.length; i++) {
                stage_id.push(data_list[i]?.['sale_order_stage_data']?.['id'])
            }
            data_params['id__in'] = stage_id.join(',')
        }
        pageElements.$advance_to_supplier_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(pageElements.$advance_to_supplier_table);
        if (Object.keys(data_params).length > 0) {
            pageElements.$advance_to_supplier_table.DataTableDefault({
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
                        let row_checkbox = pageElements.$advance_to_supplier_table.find(`tbody .select_row_advance_for_supplier[data-advance-for-supplier-id="${data_list[i]?.['sale_order_stage_data']?.['id']}"]`)
                        row_checkbox.prop('checked', true)
                        if (approved) {
                            row_checkbox.closest('tr').find('.recon_balance_value_advance').attr('data-init-money', data_list[i]?.['sum_balance_value'])
                        }
                        row_checkbox.closest('tr').find('.cash_out_value_advance').attr('value', data_list[i]?.['sum_payment_value'])
                    }
                    // CIFHandler.Disable()
                }
            });
        }
        else {
            pageElements.$advance_to_supplier_table.DataTableDefault({
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
            let ar_invoice = []
            for (let i = 0; i < data_list.length; i++) {
                ar_invoice.push(data_list[i]?.['ar_invoice_data']?.['id'])
            }
            data_params['id__in'] = ar_invoice.join(',')
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
                        let row_checkbox = pageElements.$ap_invoice_table.find(`tbody .select_row_ap_invoice[data-ap-invoice-id="${data_list[i]?.['ar_invoice_data']?.['id']}"]`)
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
                    // CIFHandler.Disable()
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
}

/**
 * Khai báo các hàm chính
 */
class COFHandler {
}

/**
 * Khai báo các Event
 */
class COFEventHandler {
    static InitPageEven() {
        pageElements.$payment_type.on('change', function () {
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
            else {
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
                        'customer_mapped_id': pageElements.$supplier_name.attr('data-id'),
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
        // thay đổi loại thu tiền
        $('#cof_type .dropdown-item').on('click', function () {
            $('#cof_type_label').text($(this).text()).attr('data-value', $(this).attr('data-value'))
            $('#area_table_advance_to_supplier').prop('hidden', $(this).attr('data-value') !== '0')
            $('#area_table_ap_invoice').prop('hidden', $(this).attr('data-value') !== '1')
        })
    }
}
