// const $script_trans = $('#script_trans');
const $title = $('#title');
const $customer = $('#customer');
const $purchase_advance_value = $('#purchase_advance_value')
const $posting_date = $('#posting_date');
const $document_date = $('#document_date');
const $description = $('#description');
const $so_pm_stage_table = $('#table-select-so');
const $ar_invoice_table = $('#table-select-ar-invoice');
const $total_payment = $('#total_payment')

const $detail_payment_value_modal = $('#detail-payment-value-modal')
const $table_detail_payment_value_modal = $('#table-detail-payment-value-modal')
const detail_payment_value_column_opts = [
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
                       class="form-check-input selected-detail-payment"
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
            return row?.['is_ar_invoice'] ? `<span class="text-muted">${row?.['issue_invoice'] ? row?.['issue_invoice'] : ''}</span>` : '--';
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return row?.['is_ar_invoice'] ? `<span class="mask-money detail-invoice-value" data-init-money="${row?.['value_after_tax'] ? row?.['value_after_tax'] : 0}"></span>` : '--';
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return `<span class="mask-money" data-init-money="${row?.['value_total'] ? row?.['value_total'] : 0}"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return row?.['is_ar_invoice'] ? `<span class="mask-money detail_balance_value" data-init-money="${row?.['value_total'] - row?.['value_payment']}"></span>` : '--';
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return row?.['is_ar_invoice'] ? `<input class="form-control text-right mask-money detail_payment_value" value="0">` : '--';
        }
    },
    {
        className: 'wrap-text text-right w-10',
        render: (data, type, row) => {
            return `<span class="text-muted">${moment(row?.['due_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`;
        }
    },
]

const $btn_modal_payment_method = $('#btn-modal-payment-method')
const $icon_done_payment_method = $('#icon-done-payment-method')
const $payment_method_modal = $('#payment-method-modal')
const $total_payment_modal = $('#total_payment_modal')
const $save_changes_payment_method = $('#save-changes-payment-method')
const $cash_value = $('#cash_value')
const $bank_value = $('#bank_value')
const $company_bank_account = $('#company_bank_account')
const so_pm_stage_column_opts = [
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
                   class="form-check-input selected-so-pm-stage"
                   data-so-pm-stage-id="${row?.['id']}"
                   data-sale-order-id="${row?.['so_id']}"
            >
            <label class="form-check-label"></label>
        </div>`
        }
    },
    {
        className: 'wrap-text w-5',
        render: (data, type, row) => {
            return `<span class="badge badge-primary">${row?.['so_code']}</span>`
        }
    },
    {
        className: 'wrap-text w-15',
        render: (data, type, row) => {
            return `<span class="text-muted">${row?.['term_data']?.['title']}</span>`;
        }
    },
    {
        className: 'wrap-text w-20',
        render: (data, type, row) => {
            return `<span class="text-muted">${row?.['remark']}</span>`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return `<span class="mask-money total-advance-value" data-init-money="${row?.['value_total']}"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return `<span class="mask-money balance-advance-value" data-init-money="${row?.['value_total'] - row?.['value_payment']}"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-20',
        render: () => {
            return `<input class="form-control text-right mask-money payment-advance-value" value="0"">`;
        }
    },
]
const ar_invoice_column_opts = [
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
                               class="form-check-input selected-ar"
                               data-ar-invoice-id="${row?.['id']}"
                               data-sale-order-id="${row?.['sale_order_data']?.['id']}"
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
            return `<span class="mask-money" data-init-money="${row?.['total']}"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            let balance_value = row?.['total'] - row?.['payment_value']
            return `<span class="mask-money sum_balance_value" data-init-money="${balance_value ? balance_value : '0'}"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-20',
        render: (data, type, row) => {
            let sale_order_data = JSON.stringify(row?.['sale_order_data'] ? row?.['sale_order_data'] : [])
            return `<div class="input-group">
                        <span class="input-affix-wrapper">
                            <input readonly disabled class="form-control text-right mask-money sum_payment_value" value="0">
                        </span>
                        <button data-so='${sale_order_data}' data-detail-payment='' data-bs-toggle="modal" data-bs-target="#detail-payment-value-modal" type="button" class="btn btn-outline-light btn-detail-payment-value" hidden><i class="bi bi-three-dots-vertical"></i></button>
                    </div>`;
        }
    },
    {
        className: 'wrap-text text-right w-10',
        render: () => {
            return `<div class="input-group">
                        <input readonly type="number" class="form-control text-right discount_payment" value="0">
                        <span class="input-group-text">%</span>
                    </div>`;
        }
    },
]
let current_detail_payment_row = null

class CashInflowLoadPage {
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
    static LoadCustomer(element, data) {
        element.initSelect2({
            allowClear: true,
            ajax: {
                url: element.attr('data-url'),
                data: {'is_customer_account': true},
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'customer_list',
            keyId: 'id',
            keyText: 'name',
        }).on('change', function () {
            if (element.val()) {
                CashInflowAction.LoadARInvoiceTable({'customer_mapped_id': element.val()})
            }
        })
    }
    static LoadCompanyBankAccount(element, data) {
        element.initSelect2({
            allowClear: true,
            ajax: {
                url: element.attr('data-url'),
                method: 'GET',
            },
            templateResult: function formatbankview(data) {
                if (data?.['data']?.['id']) return $(`<span>${data?.['data']?.['bank_code']} - ${data?.['data']?.['bank_account_name']} (${data?.['data']?.['bank_account_number']})</span>`);
                return data?.['data']?.['bank_account_number'];
            },
            data: (data ? data : null),
            keyResp: 'company_bank_account_list',
            keyId: 'id',
            keyText: 'bank_name'
        })
    }
}

class CashInflowAction {
    static LoadSOPaymentStageTable(datalist=[], no_ar_invoice_data=[]) {
        $so_pm_stage_table.DataTable().clear().destroy()
        $so_pm_stage_table.DataTableDefault({
            dom: 't',
            reloadCurrency: true,
            rowIdx: true,
            scrollX: '100vw',
            scrollY: '40vh',
            scrollCollapse: true,
            paging: false,
            data: datalist,
            columns: so_pm_stage_column_opts,
            initComplete: function () {
                CashInflowAction.LoadSOPaymentStageTableDetailPage(no_ar_invoice_data)
            }
        });
    }
    static LoadARInvoiceTable(data_params={}, no_ar_invoice_data=[], has_ar_invoice_data=[]) {
        $ar_invoice_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($ar_invoice_table);
        if ($customer.val()) {
            $ar_invoice_table.DataTableDefault({
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
                            if (no_ar_invoice_data.length > 0 && has_ar_invoice_data.length === 0) {
                                // get from detail
                                let so_pm_stage_id_list = []
                                for (let i=0; i < no_ar_invoice_data.length; i++) {
                                    so_pm_stage_id_list.push(no_ar_invoice_data[i]?.['detail_payment'][0]?.['so_pm_stage_data']?.['id'])
                                }

                                // get data of those
                                let so_pm_stage_data_list = []
                                for (let i = 0; i < resp.data['ar_invoice_list'].length; i++) {
                                    if (resp.data?.['ar_invoice_list'][i]?.['sale_order_data']?.['payment_term']) {
                                        so_pm_stage_data_list = so_pm_stage_data_list.concat(
                                            resp.data?.['ar_invoice_list'][i]?.['sale_order_data']?.['payment_term'].filter((item) => {
                                                return so_pm_stage_id_list.includes(item?.['id'])
                                            })
                                        )
                                    }
                                }

                                // load datatable
                                CashInflowAction.LoadSOPaymentStageTable(so_pm_stage_data_list, no_ar_invoice_data)

                                return []
                            }
                            else if (no_ar_invoice_data.length === 0 && has_ar_invoice_data.length > 0) {
                                CashInflowAction.LoadSOPaymentStageTable()

                                // get from detail
                                let ar_invoice_id_list = []
                                for (let i=0; i < has_ar_invoice_data.length; i++) {
                                    ar_invoice_id_list.push(has_ar_invoice_data[i]?.['ar_invoice_data']?.['id'])
                                }

                                return resp.data?.['ar_invoice_list'] ? resp.data?.['ar_invoice_list'].filter((item) => {
                                    return ar_invoice_id_list.includes(item?.['id'])
                                }) : [];
                            }
                            else {
                                let so_pm_stage_data_list = []
                                for (let i = 0; i < resp.data['ar_invoice_list'].length; i++) {
                                    so_pm_stage_data_list = so_pm_stage_data_list.concat(resp.data?.['ar_invoice_list'][i]?.['sale_order_data']?.['payment_term'])
                                }
                                CashInflowAction.LoadSOPaymentStageTable(
                                    so_pm_stage_data_list.filter((item) => {
                                        return item?.['is_ar_invoice'] === false
                                    }),
                                    no_ar_invoice_data
                                )

                                return resp.data?.['ar_invoice_list'] ? resp.data?.['ar_invoice_list'] : [];
                            }
                        }
                        return [];
                    },
                },
                columns: ar_invoice_column_opts,
                initComplete: function () {
                    CashInflowAction.LoadARInvoiceTableDetailPage(has_ar_invoice_data)
                }
            });
        }
        else {
            $ar_invoice_table.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: ar_invoice_column_opts,
                initComplete: function () {}
            });
        }
    }
    static LoadDetailPaymentValueTable(data_list=[]) {
        $table_detail_payment_value_modal.DataTable().clear().destroy()
        if ($customer.val()) {
            $table_detail_payment_value_modal.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: data_list,
                columns: detail_payment_value_column_opts,
                initComplete: function () {
                    let detail_payment_value_data = current_detail_payment_row.find('.btn-detail-payment-value').attr('data-detail-payment')
                    detail_payment_value_data = detail_payment_value_data ? JSON.parse(detail_payment_value_data) : []
                    if (detail_payment_value_data.length > 0) {
                        CashInflowAction.LoadDetailPaymentValueTableDetailPage(detail_payment_value_data)
                    }
                }
            });
        }
        else {
            $table_detail_payment_value_modal.DataTableDefault({
                dom: 't',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: detail_payment_value_column_opts,
            });
        }
    }
    static RecalculateTotalPayment() {
        let total_payment = 0
        total_payment += $purchase_advance_value.attr('value') ? parseFloat($purchase_advance_value.attr('value')) : 0
        const cif_value = $('#cif_type_label').attr('data-value')
        if (cif_value === '0') {
            $so_pm_stage_table.find('tbody tr').each(function () {
                total_payment += $(this).find('.payment-advance-value').attr('value') ? parseFloat($(this).find('.payment-advance-value').attr('value')) : 0
            })
        }
        else if (cif_value === '1') {
            $ar_invoice_table.find('tbody tr').each(function () {
                total_payment += $(this).find('.sum_payment_value').attr('value') ? parseFloat($(this).find('.sum_payment_value').attr('value')) : 0
            })
        }
        $total_payment.attr('value', total_payment)
        $total_payment_modal.attr('value', $total_payment.attr('value'))
        $btn_modal_payment_method.prop('disabled', total_payment === 0)
        $btn_modal_payment_method.removeClass('btn-outline-success').addClass('btn-outline-danger')
        $icon_done_payment_method.prop('hidden', true)
        $.fn.initMaskMoney2()
    }
    static CalculateARInvoiceRow() {
        let total_detail_payment = 0
        let detail_payment = []
        $table_detail_payment_value_modal.find('tbody tr').each(function () {
            if ($(this).find('.selected-detail-payment').prop('checked')) {
                total_detail_payment += $(this).find('.detail_payment_value').attr('value') ? parseFloat($(this).find('.detail_payment_value').attr('value')) : 0
                detail_payment.push({
                    'so_pm_stage_id': $(this).find('.selected-detail-payment').attr('data-so-pm-stage-id'),
                    'balance_value': $(this).find('.detail_balance_value').attr('data-init-money'),
                    'payment_value': $(this).find('.detail_payment_value').attr('value'),
                })
            }
        })
        current_detail_payment_row.find('.sum_payment_value').attr('value', total_detail_payment)
        current_detail_payment_row.find('.btn-detail-payment-value').attr('data-detail-payment', JSON.stringify(detail_payment))
        $('#total-detail-payment-modal').attr('data-init-money', total_detail_payment)
        CashInflowAction.RecalculateTotalPayment()
    }
    static CalculateModalDetailPaymentSum() {
        let modal_detail_payment_sum = 0
        $table_detail_payment_value_modal.find('tbody tr').each(function () {
            if ($(this).find('.selected-detail-payment').prop('checked')) {
                modal_detail_payment_sum += parseFloat($(this).find('.detail_payment_value').attr('value'))
            }
        })
        $('#total-detail-payment-modal').attr('data-init-money', modal_detail_payment_sum)
        $.fn.initMaskMoney2()
    }
    // detail
    static DisabledDetailPage(option) {
        if (option === 'detail') {
            $('.form-control').prop('readonly', true).prop('disabled', true);
            $('.form-select').prop('readonly', true).prop('disabled', true);
            $('#cif_type_label').removeAttr('data-bs-toggle').removeClass('dropdown-toggle')
            $('.modal-footer').remove();
        }
    }
    static LoadSOPaymentStageTableDetailPage(data_list=[]) {
        $so_pm_stage_table.find('tbody tr').each(function () {
            let row = $(this);
            for (let i=0; i < data_list.length; i++) {
                row.find('.selected-so-pm-stage').prop('checked', true).prop('disabled', true)
                row.find('.balance-advance-value').attr('data-init-money', data_list[i]?.['sum_balance_value'])
                row.find('.payment-advance-value').attr('value', data_list[i]?.['sum_payment_value']).prop('disabled', true).prop('readonly', true)
            }
        })
        $.fn.initMaskMoney2()
    }
    static LoadARInvoiceTableDetailPage(data_list=[]) {
        $ar_invoice_table.find('tbody tr').each(function () {
            let row = $(this);
            for (let i=0; i < data_list.length; i++) {
                row.find('.selected-ar').prop('checked', true).prop('disabled', true)
                row.find('.sum_balance_value').attr('data-init-money', data_list[i]?.['sum_balance_value'])
                row.find('.sum_payment_value').attr('value', data_list[i]?.['sum_payment_value'])
                row.find('.btn-detail-payment-value').prop('hidden', false)
                row.find('.discount_payment').val(data_list[i]?.['discount_payment']).prop('disabled', true).prop('readonly', true)

                let detail_payment = []
                for (let j=0; j < data_list[i]?.['detail_payment'].length; j++) {
                    detail_payment.push({
                        'so_pm_stage_id': data_list[i]?.['detail_payment'][j]?.['so_pm_stage_data']?.['id'],
                        'balance_value': data_list[i]?.['detail_payment'][j]?.['balance_value'],
                        'payment_value': data_list[i]?.['detail_payment'][j]?.['payment_value'],
                    })
                }
                row.find('.btn-detail-payment-value').attr('data-detail-payment', JSON.stringify(detail_payment))
            }
        })
        $.fn.initMaskMoney2()
    }
    static LoadDetailPaymentValueTableDetailPage(data_list=[]) {
        let total_detail_payment = 0
        $table_detail_payment_value_modal.find('tbody tr').each(function () {
            let row = $(this);
            for (let i=0; i < data_list.length; i++) {
                if (row.find('.selected-detail-payment').attr('data-so-pm-stage-id') === data_list[i]?.['so_pm_stage_id']) {
                    row.find('.selected-detail-payment').prop('checked', true)
                    row.find('.detail_balance_value').attr('data-init-money', data_list[i]?.['balance_value'])
                    row.find('.detail_payment_value').attr('value', data_list[i]?.['payment_value'])
                    total_detail_payment += parseFloat(data_list[i]?.['payment_value'])
                }
                row.find('.selected-detail-payment').prop('disabled', true)
                row.find('.detail_payment_value').prop('disabled', true).prop('readonly', true)
            }
        })
        $('#total-detail-payment-modal').attr('data-init-money', total_detail_payment)
        $.fn.initMaskMoney2()
    }
}

class CashInflowHandle {
    static LoadPage() {
        CashInflowLoadPage.LoadCustomer($customer)
        CashInflowLoadPage.LoadDate($posting_date)
        CashInflowLoadPage.LoadDate($document_date)
        CashInflowLoadPage.LoadCompanyBankAccount($company_bank_account)
        CashInflowAction.LoadSOPaymentStageTable()
        CashInflowAction.LoadARInvoiceTable()
    }
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $title.val()
        frm.dataForm['customer_id'] = $customer.val()
        frm.dataForm['posting_date'] = moment($posting_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['document_date'] = moment($document_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['description'] = $description.val()
        let no_ar_invoice_data = []
        let has_ar_invoice_data = []
        let payment_method_data = $btn_modal_payment_method.attr('data-payment-method') ? JSON.parse($btn_modal_payment_method.attr('data-payment-method')) : {}

        frm.dataForm['purchase_advance_value'] = $purchase_advance_value.attr('value') ? $purchase_advance_value.attr('value') : 0
        const cif_value = $('#cif_type_label').attr('data-value')
        if (cif_value === '0') {
            no_ar_invoice_data = []
            $so_pm_stage_table.find('tbody tr').each(function () {
                if ($(this).find('.selected-so-pm-stage').prop('checked')) {
                    no_ar_invoice_data.push({
                        'sale_order_id': $(this).find('.selected-so-pm-stage').attr('data-sale-order-id'),
                        'sum_balance_value': $(this).find('.balance-advance-value').attr('data-init-money'),
                        'sum_payment_value': $(this).find('.payment-advance-value').attr('value'),
                        'detail_payment': [{
                            'so_pm_stage_id': $(this).find('.selected-so-pm-stage').attr('data-so-pm-stage-id'),
                            'balance_value': $(this).find('.balance-advance-value').attr('data-init-money'),
                            'payment_value': $(this).find('.payment-advance-value').attr('value'),
                        }]
                    })
                }
            })
        }
        else if (cif_value === '1') {
            no_ar_invoice_data = []
            $ar_invoice_table.find('tbody tr').each(function () {
                if ($(this).find('.selected-ar').prop('checked')) {
                    let detail_payment = $(this).find('.btn-detail-payment-value').attr('data-detail-payment')
                    has_ar_invoice_data.push({
                        'ar_invoice_id': $(this).find('.selected-ar').attr('data-ar-invoice-id'),
                        'sale_order_id': $(this).find('.selected-ar').attr('data-sale-order-id'),
                        'sum_balance_value': $(this).find('.sum_balance_value').attr('data-init-money'),
                        'sum_payment_value': $(this).find('.sum_payment_value').attr('value'),
                        'discount_payment': 0,
                        'discount_value': 0,
                        'detail_payment': detail_payment ? JSON.parse(detail_payment) : []
                    })
                }
            })
        }

        frm.dataForm['no_ar_invoice_data'] = no_ar_invoice_data
        frm.dataForm['has_ar_invoice_data'] = has_ar_invoice_data
        frm.dataForm['payment_method_data'] = payment_method_data

        // console.log(frm)
        return frm
    }
    static LoadDetailCIF(option) {
        let url_loaded = $('#form-detail-cashinflow').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['cash_inflow_detail'];
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);
                    // console.log(data)

                    $title.val(data?.['title'])
                    $posting_date.val(moment(data?.['posting_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    $document_date.val(moment(data?.['document_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    CashInflowLoadPage.LoadCustomer($customer, data?.['customer_data'])
                    $description.val(data?.['description'])

                    $purchase_advance_value.attr('value', data?.['purchase_advance_value'] ? data?.['purchase_advance_value'] : 0)
                    if (data?.['no_ar_invoice_data'].length > 0) {
                        $('#cif_type_label').text($('#cif_type .dropdown-item:eq(0)').text()).attr('data-value', '0')
                        CashInflowAction.LoadARInvoiceTable({'customer_mapped_id': $customer.val()}, data?.['no_ar_invoice_data'], [])
                    }
                    else if (data?.['has_ar_invoice_data'].length > 0) {
                        $('#cif_type_label').text($('#cif_type .dropdown-item:eq(1)').text()).attr('data-value', '1')
                        CashInflowAction.LoadARInvoiceTable({'customer_mapped_id': $customer.val()}, [], data?.['has_ar_invoice_data'])
                    }
                    $('#area-table-select-so').prop('hidden', !data?.['no_ar_invoice_data'].length > 0)
                    $('#area-table-select-ar').prop('hidden', !data?.['has_ar_invoice_data'].length > 0)
                    $total_payment.attr('value', data?.['total_value'])

                    let payment_method_data = {
                        'cash_value': data?.['cash_value'],
                        'bank_value': data?.['bank_value'],
                        'company_bank_account_id': data?.['company_bank_account_data']?.['id'],
                    }
                    $btn_modal_payment_method.prop('disabled', false)
                    $btn_modal_payment_method.attr('data-payment-method', JSON.stringify(payment_method_data))
                    $btn_modal_payment_method.removeClass('btn-outline-danger').addClass('btn-outline-success')
                    $icon_done_payment_method.prop('hidden', false)
                    $total_payment_modal.attr('value', data?.['total_value'])
                    $cash_value.attr('value', data?.['cash_value'])
                    $bank_value.attr('value', data?.['bank_value'])
                    CashInflowLoadPage.LoadCompanyBankAccount($company_bank_account, data?.['company_bank_account_data'])

                    $.fn.initMaskMoney2()
                    CashInflowAction.DisabledDetailPage(option);
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

$purchase_advance_value.on('change', function () {
    CashInflowAction.RecalculateTotalPayment()
})

$(document).on('change', '.selected-so-pm-stage', function () {
    $(this).closest('tr').find('.payment-advance-value').attr('value', $(this).prop('checked') ? $(this).closest('tr').find('.balance-advance-value').attr('data-init-money') : 0)
    $.fn.initMaskMoney2()
    CashInflowAction.RecalculateTotalPayment()
})

$(document).on('change', '.payment-advance-value', function () {
    let this_value = parseFloat($(this).attr('value'))
    let balance_value = parseFloat($(this).closest('tr').find('.balance-advance-value').attr('data-init-money'))
    if (this_value > balance_value) {
        $.fn.notifyB({description: `Payment value can not > Balance value`}, 'failure');
        $(this).attr('value', balance_value)
    }
    $.fn.initMaskMoney2()
    CashInflowAction.RecalculateTotalPayment()
})

$(document).on('change', '.selected-ar', function () {
    $('.selected-ar').each(function () {
        $(this).closest('tr').find('.btn-detail-payment-value').prop('hidden', !$(this).prop('checked'))
        if (!$(this).prop('checked')) {
            $(this).closest('tr').find('.sum_payment_value').attr('value', 0)
        }
    })
    $.fn.initMaskMoney2()
    CashInflowAction.RecalculateTotalPayment()
})

$save_changes_payment_method.on('click', function () {
    if (
        parseFloat($cash_value.attr('value')) + parseFloat($bank_value.attr('value')) === parseFloat($total_payment_modal.attr('value'))
        && parseFloat($total_payment_modal.attr('value')) !== 0
    ) {
        if (parseFloat($bank_value.attr('value')) > 0 && !$company_bank_account.val()) {
            $.fn.notifyB({description: `Company bank account is required if Bank value > 0`}, 'failure');
        }
        else {
            let payment_method_data = {
                'cash_value': $cash_value.attr('value'),
                'bank_value': $bank_value.attr('value'),
                'company_bank_account_id': $company_bank_account.val(),
            }
            $btn_modal_payment_method.attr('data-payment-method', JSON.stringify(payment_method_data))
            $btn_modal_payment_method.removeClass('btn-outline-danger').addClass('btn-outline-success')
            $icon_done_payment_method.prop('hidden', false)
            $payment_method_modal.modal('hide')
        }
    }
    else {
        $btn_modal_payment_method.removeClass('btn-outline-success').addClass('btn-outline-danger')
        $icon_done_payment_method.prop('hidden', true)
        $.fn.notifyB({description: `Error value or missing information`}, 'failure');
    }
})

$(document).on('change', '.selected-detail-payment', function () {
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
    CashInflowAction.CalculateModalDetailPaymentSum()
})

$('#save-detail-payment-value').on('click', function () {
    CashInflowAction.CalculateARInvoiceRow()
    $detail_payment_value_modal.modal('hide')
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
    CashInflowAction.CalculateModalDetailPaymentSum()
})

$(document).on('click', '.btn-detail-payment-value', function () {
    current_detail_payment_row = $(this).closest('tr')
    let sale_order_data = $(this).attr('data-so') ? JSON.parse($(this).attr('data-so')) : []
    CashInflowAction.LoadDetailPaymentValueTable(sale_order_data?.['payment_term'] ? sale_order_data?.['payment_term'] : [])
})

$('#cif_type .dropdown-item').on('click', function () {
    $('#cif_type_label').text($(this).text()).attr('data-value', $(this).attr('data-value'))
    $('#area-table-select-so').prop('hidden', $(this).attr('data-value') !== '0')
    $('#area-table-select-ar').prop('hidden', $(this).attr('data-value') !== '1')
})
