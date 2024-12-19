const $script_trans = $('#script_trans');
const $title = $('#title');
const $customer = $('#customer');
const $posting_date = $('#posting_date');
const $document_date = $('#document_date');
const $so_table = $('#table-select-so');
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
            return `<div class="form-check form-check-sm">
            <input type="checkbox" class="form-check-input selected-detail-payment">
            <label class="form-check-label"></label>
        </div>`
        }
    },
    {
        className: 'wrap-text w-5',
        render: (data, type, row) => {
            return `<span class="text-muted">${row?.['installment'] ? row?.['installment'] : ''}</span>`
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
            return `<span class="text-muted">${row?.['issue_invoice'] ? row?.['issue_invoice'] : '1'}</span>`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return `<span class="mask-money" data-init-money="${row?.['value_after_tax'] ? row?.['value_after_tax'] : 0}"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return `<span class="mask-money" data-init-money="${row?.['total_payment'] ? row?.['total_payment'] : 0}"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-20',
        render: (data, type, row) => {
            return `<span class="mask-money" data-init-money="0"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-10',
        render: (data, type, row) => {
            return `<input readonly disabled class="form-control text-right mask-money detail-payment-value-input" value="0">`;
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
const so_column_opts = [
    {
        className: 'wrap-text w-5',
        render: () => {
            return ``
        }
    },
    {
        className: 'wrap-text w-5',
        render: (data, type, row) => {
            return `<div class="form-check form-check-sm">
            <input type="checkbox" class="form-check-input selected-so">
            <label class="form-check-label"></label>
        </div>`
        }
    },
    {
        className: 'wrap-text w-5',
        render: (data, type, row) => {
            return `<span class="badge badge-primary">${row?.['code']}</span>`
        }
    },
    {
        className: 'wrap-text w-15',
        render: (data, type, row) => {
            return `<span class="text-muted">--</span>`;
        }
    },
    {
        className: 'wrap-text w-20',
        render: (data, type, row) => {
            return `<span class="text-muted">--</span>`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return `<span class="mask-money total-advance-value" data-init-money="0"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return `<span class="mask-money balance-advance-value" data-init-money="0"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-20',
        render: (data, type, row) => {
            return `<input class="form-control text-right mask-money payment-advance-value" data-max="0" value="0" placeholder="max = 0">`;
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
            return `<div class="form-check form-check-sm">
            <input type="checkbox" class="form-check-input selected-ar">
            <label class="form-check-label"></label>
        </div>`
        }
    },
    {
        className: 'wrap-text w-5',
        render: (data, type, row) => {
            return `<span class="badge badge-primary">${row?.['code']}</span>`
        }
    },
    {
        className: 'wrap-text w-15',
        render: (data, type, row) => {
            return `<span class="text-muted">${row?.['document_type']}</span>`;
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            return `${moment(row?.['document_date'], 'YYYY-MM-DD').format('DD/MM/YYYY')}`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            return `<span class="mask-money total-value" data-init-money="${row?.['total']}"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            let balance_value = row?.['total'] - row?.['payment_value']
            return `<span class="mask-money balance-value" data-init-money="${balance_value}"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-20',
        render: (data, type, row) => {
            let sale_order_data = JSON.stringify(row?.['sale_order_data'] ? row?.['sale_order_data'] : [])
            return `<div class="input-group">
                <span class="input-affix-wrapper">
                    <input readonly disabled class="form-control text-right mask-money payment-value" value="0">
                </span>
                <button data-so='${sale_order_data}' data-bs-toggle="modal" data-bs-target="#detail-payment-value-modal" type="button" class="btn btn-outline-light btn-detail-payment-value" hidden><i class="bi bi-three-dots-vertical"></i></button>
            </div>`;
        }
    },
    {
        className: 'wrap-text text-right w-10',
        render: (data, type, row) => {
            return `<div class="input-group">
                    <input type="number" class="form-control text-right discount-value" value="0">
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
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'account_list',
            keyId: 'id',
            keyText: 'name',
        }).on('change', function () {
            if (element.val()) {
                CashInflowAction.LoadSaleOrderTable({'customer_id': element.val()})
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
            keyText: 'bank_account_number'
        })
    }
}

class CashInflowAction {
    static LoadSaleOrderTable(data_params={}) {
        $so_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($so_table);
        if ($customer.val()) {
            $so_table.DataTableDefault({
                styleDom: 'hide-foot',
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
                            return resp.data['sale_order_list'] ? resp.data['sale_order_list'] : [];
                        }
                        return [];
                    },
                },
                columns: so_column_opts,
            });
        }
        else {
            $so_table.DataTableDefault({
                styleDom: 'hide-foot',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: so_column_opts,
            });
        }
    }
    static LoadARInvoiceTable(data_params={}) {
        $ar_invoice_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($ar_invoice_table);
        if ($customer.val()) {
            $ar_invoice_table.DataTableDefault({
                styleDom: 'hide-foot',
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
                columns: ar_invoice_column_opts,
            });
        }
        else {
            $ar_invoice_table.DataTableDefault({
                styleDom: 'hide-foot',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: [],
                columns: ar_invoice_column_opts,
            });
        }
    }
    static LoadDetailPaymentValueTable(data_list=[]) {
        $table_detail_payment_value_modal.DataTable().clear().destroy()
        if ($customer.val()) {
            $table_detail_payment_value_modal.DataTableDefault({
                styleDom: 'hide-foot',
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                paging: false,
                data: data_list,
                columns: detail_payment_value_column_opts,
            });
        }
        else {
            $table_detail_payment_value_modal.DataTableDefault({
                styleDom: 'hide-foot',
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
        $ar_invoice_table.find('tbody tr').each(function () {
            total_payment += parseFloat($(this).find('.payment-value').attr('value'))
        })
        $total_payment.attr('value', total_payment)
        $total_payment_modal.attr('value', $total_payment.attr('value'))
        $btn_modal_payment_method.prop('disabled', total_payment === 0)
        $btn_modal_payment_method.removeClass('btn-outline-success').addClass('btn-outline-light')
        $icon_done_payment_method.prop('hidden', true)
        $.fn.initMaskMoney2()
    }
    static CalculateARInvoiceRow() {
        let total_detail_payment = 0
        $table_detail_payment_value_modal.find('tbody tr').each(function () {
            if ($(this).find('.selected-detail-payment').prop('checked')) {
                total_detail_payment += parseFloat($(this).find('.detail-payment-value-input').attr('value'))
            }
        })
        current_detail_payment_row.find('.payment-value').attr('value', total_detail_payment)
        CashInflowAction.RecalculateTotalPayment()
    }
}

class CashInflowHandle {
    static LoadPage() {
        CashInflowLoadPage.LoadCustomer($customer)
        CashInflowLoadPage.LoadDate($posting_date)
        CashInflowLoadPage.LoadDate($document_date)
        CashInflowLoadPage.LoadCompanyBankAccount($company_bank_account)
        CashInflowAction.LoadSaleOrderTable()
        CashInflowAction.LoadARInvoiceTable()
    }
}

$(document).on('change', '.selected-ar', function () {
    $('.selected-ar').each(function () {
        $(this).closest('tr').find('.btn-detail-payment-value').prop('hidden', !$(this).prop('checked'))
        if (!$(this).prop('checked')) {
            $(this).closest('tr').find('.payment-value').attr('value', 0)
        }
    })
    $.fn.initMaskMoney2()
    CashInflowAction.RecalculateTotalPayment()
})

$save_changes_payment_method.on('click', function () {
    if (
        parseFloat($cash_value.attr('value')) + parseFloat($bank_value.attr('value')) ===
        parseFloat($total_payment_modal.attr('value')) && parseFloat($total_payment_modal.attr('value')) !== 0
    ) {
        $btn_modal_payment_method.removeClass('btn-outline-light').addClass('btn-outline-success')
        $icon_done_payment_method.prop('hidden', false)
        $payment_method_modal.modal('hide')
    }
    else {
        $btn_modal_payment_method.removeClass('btn-outline-success').addClass('btn-outline-light')
        $icon_done_payment_method.prop('hidden', true)
        $.fn.notifyB({description: `Error value or missing information`}, 'failure');
    }
})

$(document).on('change', '.selected-detail-payment', function () {
    $(this).closest('tr').find('.detail-payment-value-input').attr('value', 0).prop('disabled', !$(this).prop('checked')).prop('readonly', !$(this).prop('checked'))
})

$('#save-detail-payment-value').on('click', function () {
    CashInflowAction.CalculateARInvoiceRow()
    $detail_payment_value_modal.modal('hide')
})

$(document).on('click', '.btn-detail-payment-value', function () {
    current_detail_payment_row = $(this).closest('tr')
    let sale_order_data = $(this).attr('data-so') ? JSON.parse($(this).attr('data-so')) : []
    CashInflowAction.LoadDetailPaymentValueTable(sale_order_data?.['payment_term'] ? sale_order_data?.['payment_term'] : [])
})
