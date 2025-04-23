const $trans_script = $('#trans-script');
const $title = $('#title');
const $customer = $('#customer');
const $posting_date = $('#posting_date');
const $document_date = $('#document_date');
const $type = $('#type');
const $table_recon = $('#table-recon');
const $recon_total = $('#recon-total');

const table_recon_cfg = [
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
                       ${row?.['id'] ? 'disabled checked' : ''}
                       data-credit-id="${Object.keys(row?.['credit_doc_data']).length > 0 ? row?.['credit_doc_data']?.['id'] : ''}"
                       data-debit-id="${Object.keys(row?.['debit_doc_data']).length > 0 ? row?.['debit_doc_data']?.['id'] : ''}"
                       class="form-check-input selected_document"
                >
                <label class="form-check-label"></label>
            </div>`
        }
    },
    {
        className: 'wrap-text w-15',
        render: (data, type, row) => {
            let credit_doc_data = row?.['credit_doc_data'] || {}
            let document_code = ''
            let document_type = ''
            if (Object.keys(credit_doc_data).length > 0) {
                document_code = credit_doc_data?.['code'] ? credit_doc_data?.['code'] : ''
                document_type = ReconAction.ConvertToDocTitle(credit_doc_data?.['app_code'])
                return `<span class="badge badge-soft-primary document_code mr-1">${document_code}</span><span class="document_type small">(${document_type})</span>`;
            }
            else {
                let debit_doc_data = row?.['debit_doc_data'] || {}
                document_code = debit_doc_data?.['code'] ? debit_doc_data?.['code'] : ''
                document_type = ReconAction.ConvertToDocTitle(debit_doc_data?.['app_code'])
                return `<span class="badge badge-soft-danger document_code mr-1">${document_code}</span><span class="document_type small">(${document_type})</span>`;
            }
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            let credit_doc_data = row?.['credit_doc_data'] || {}
            let posting_date = ''
            if (Object.keys(credit_doc_data).length > 0) {
                posting_date = credit_doc_data?.['posting_date'] ? moment(credit_doc_data?.['posting_date'].split(' '), 'YYYY-MM-DD').format('DD/MM/YYYY') : ''
            }
            else {
                let debit_doc_data = row?.['debit_doc_data'] || {}
                posting_date = debit_doc_data?.['posting_date'] ? moment(debit_doc_data?.['posting_date'].split(' '), 'YYYY-MM-DD').format('DD/MM/YYYY') : ''
            }
            return `<span class="posting_date"><i class="fa-regular fa-calendar"></i> ${posting_date}</span>`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            let recon_total = row?.['recon_total'] ? row?.['recon_total'] : 0
            let credit_doc_data = row?.['credit_doc_data'] || {}
            if (Object.keys(credit_doc_data).length > 0) {
                return `<span class="mask-money recon_total" data-init-money="${recon_total}"></span>`;
            }
            return `(<span class="mask-money recon_total" data-init-money="${recon_total}"></span>)`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            let recon_balance = row?.['recon_balance'] ? row?.['recon_balance'] : 0
            let credit_doc_data = row?.['credit_doc_data'] || {}
            if (Object.keys(credit_doc_data).length > 0) {
                return `<span class="mask-money recon_balance" data-init-money="${recon_balance}"></span>`;
            }
            return `(<span class="mask-money recon_balance" data-init-money="${recon_balance}"></span>)`;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            let recon_amount = row?.['recon_amount'] ? row?.['recon_amount'] : 0
            let credit_doc_data = row?.['credit_doc_data'] || {}
            if (Object.keys(credit_doc_data).length > 0) {
                return `<input disabled ${row?.['id'] ? 'disabled readonly' : ''} class="form-control text-right mask-money recon_amount credit_amount" value="${recon_amount}">`;
            }
            return `<input disabled ${row?.['id'] ? 'disabled readonly' : ''} class="form-control text-right mask-money recon_amount debit_amount" value="${recon_amount}">`;
        }
    },
    {
        className: 'wrap-text w-15',
        render: (data, type, row) => {
            return `<textarea disabled ${row?.['id'] ? 'disabled readonly' : ''} rows="1" class="form-control note"></textarea>`;
        }
    },
    {
        className: 'wrap-text text-center w-5',
        render: (data, type, row) => {
            let credit_doc_data = row?.['credit_doc_data'] || {}
            if (Object.keys(credit_doc_data).length > 0) {
                return `<span class="accounting_account">${row?.['credit_account_data']?.['acc_code']}</span>`;
            }
            return `<span class="accounting_account">${row?.['debit_account_data']?.['acc_code']}</span>`;
        }
    },
]

class ReconLoadPage {
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

            }
        })
    }
    static LoadTableRecon(element, data_list=[]) {
        element.DataTable().clear().destroy()
        element.DataTableDefault({
            styleDom: 'hide-foot',
            reloadCurrency: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: table_recon_cfg,
            initComplete: function () {
                ReconAction.RecalculateReconTotal()
            }
        })
    }
}

class ReconAction {
    static ConvertToDocTitle(app_code='') {
        if (app_code === 'arinvoice.arinvoice') {
            return $trans_script.attr('data-trans-ar')
        }
        else if (app_code === 'delivery.orderdeliverysub') {
            return $trans_script.attr('data-trans-delivery')
        }
        else if (app_code === 'financialcashflow.cashinflow') {
            return $trans_script.attr('data-trans-cif')
        }
        return ''
    }
    static RecalculateReconTotal() {
        let sum_credit_amount = 0
        $table_recon.find('tbody tr .credit_amount').each(function () {
            if ($(this).closest('tr').find('.selected_document').prop('checked')) {
                sum_credit_amount += parseFloat($(this).attr('value'))
            }
        })
        let sum_debit_amount = 0
        $table_recon.find('tbody tr .debit_amount').each(function () {
            if ($(this).closest('tr').find('.selected_document').prop('checked')) {
                sum_debit_amount += parseFloat($(this).attr('value'))
            }
        })
        $recon_total.attr('value', sum_credit_amount - sum_debit_amount)
        $.fn.initMaskMoney2()
    }
    // detail
    static DisabledDetailPage(option) {
        if (option === 'detail') {
            $('form input').prop('readonly', true).prop('disabled', true);
            $('form select').prop('disabled', true);
        }
    }
}

class ReconHandle {
    static LoadPage() {
        ReconLoadPage.LoadCustomer($customer)
        ReconLoadPage.LoadDate($posting_date)
        ReconLoadPage.LoadDate($document_date)
        ReconLoadPage.LoadTableRecon($table_recon)
    }
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        if (parseFloat($recon_total.attr('value')) !== 0) {
            $.fn.notifyB({description: `Recon total must be 0`}, 'failure');
            return false
        }

        frm.dataForm['title'] = $title.val()
        frm.dataForm['customer_id'] = $customer.val()
        frm.dataForm['posting_date'] = moment($posting_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['document_date'] = moment($document_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['type'] = $type.val()

        let recon_item_data = []
        $table_recon.find('tbody tr').each(function () {
            if ($(this).find('.selected_document').prop('checked')) {
                recon_item_data.push({
                    'ar_invoice_id': $(this).find('.selected_document').attr('data-credit-id') ? $(this).find('.selected_document').attr('data-credit-id') : null,
                    'cash_inflow_id': null,
                    'recon_balance': $(this).find('.recon_balance').attr('data-init-money'),
                    'recon_amount': $(this).find('.recon_amount').attr('value'),
                    'note': $(this).find('.note').val(),
                    'accounting_account': '1311'
                })
            }
        })

        frm.dataForm['recon_item_data'] = recon_item_data

        if (recon_item_data.length === 0) {
            $.fn.notifyB({description: `Reconciliation item is missing`}, 'failure');
            return false
        }

        // console.log(frm)
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
    static LoadDetailRecon(option) {
        let url_loaded = $('#form-detail-recon').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['recon_detail'];
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);
                    console.log(data)

                    $title.val(data?.['title'])
                    $posting_date.val(moment(data?.['posting_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    $document_date.val(moment(data?.['document_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    ReconLoadPage.LoadCustomer($customer, data?.['business_partner_data'])

                    ReconLoadPage.LoadTableRecon($table_recon, data?.['recon_items_data'])

                    $.fn.initMaskMoney2()
                    ReconAction.DisabledDetailPage(option);
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

$(document).on('change', '.negative-no', function () {
    let old_val = $(this).val()
    $(this).val('('+ old_val +')')
})

$(document).on('change', '.selected_document', function () {
    $(this).closest('tr').find('.recon_amount').attr(
        'value',
        $(this).prop('checked') ? parseFloat($(this).closest('tr').find('.recon_balance').attr('data-init-money')) : 0
    ).prop('disabled', !$(this).prop('checked'))

    $(this).closest('tr').find('.note').prop('disabled', !$(this).prop('checked'))
    ReconAction.RecalculateReconTotal()
})

$(document).on('change', '.recon_amount', function () {
    let this_value = parseFloat($(this).attr('value'))
    let recon_balance = parseFloat($(this).closest('tr').find('.recon_balance').attr('data-init-money'))
    if (this_value > recon_balance) {
        $.fn.notifyB({description: `Recon value can not > Balance value`}, 'failure');
        $(this).attr('value', recon_balance)
    }
    ReconAction.RecalculateReconTotal()
})
