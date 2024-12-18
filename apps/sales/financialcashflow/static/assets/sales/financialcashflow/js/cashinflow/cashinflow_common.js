const $script_trans = $('#script_trans');
const $title = $('#title');
const $customer = $('#customer');
const $posting_date = $('#posting_date');
const $document_date = $('#document_date');
const $ar_invoice_table = $('#table-select-invoice');
const $total_payment = $('#total_payment')
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
            return `<span class="mask-money balance-value" data-init-money="${row?.['total'] - row?.['payment_value']}"></span>`;
        }
    },
    {
        className: 'wrap-text text-right w-20',
        render: (data, type, row) => {
            return `<input class="form-control text-right mask-money payment-value" max="${row?.['total'] - row?.['payment_value']}" value="0" placeholder="max = ${row?.['total'] - row?.['payment_value']}">`;
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
                CashInflowAction.LoadARInvoiceList({'customer_mapped_id': element.val()})
            }
        })
    }
}

class CashInflowAction {
    static LoadARInvoiceList(data_params={}) {
        $ar_invoice_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($ar_invoice_table);
        if ($customer.val()) {
            $ar_invoice_table.DataTableDefault({
                useDataServer: true,
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
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
            dtb.DataTableDefault({
                reloadCurrency: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                data: [],
                columns: ar_invoice_column_opts,
            });
        }
    }
    static RecalculateTotalPayment() {
        let total_payment = 0
        $ar_invoice_table.find('tbody tr').each(function () {
            total_payment += parseFloat($(this).find('.payment-value').attr('value'))
        })
        $total_payment.attr('value', total_payment)
        $.fn.initMaskMoney2()
    }
}

class CashInflowHandle {
    static LoadPage() {
        CashInflowLoadPage.LoadCustomer($customer)
        CashInflowLoadPage.LoadDate($posting_date)
        CashInflowLoadPage.LoadDate($document_date)
        CashInflowAction.LoadARInvoiceList()
    }
}

$(document).on('change', '.selected-ar', function () {
    if ($(this).prop('checked')) {
        $(this).closest('tr').find('.payment-value').attr('value', $(this).closest('tr').find('.balance-value').attr('data-init-money'))
    }
    else {
        $(this).closest('tr').find('.payment-value').attr('value', 0)
    }
    $.fn.initMaskMoney2()
    CashInflowAction.RecalculateTotalPayment()
})

$(document).on('change', '.payment-value', function () {
    CashInflowAction.RecalculateTotalPayment()
})