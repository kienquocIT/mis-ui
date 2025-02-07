const $trans_script = $('#trans-script');
const $title = $('#title');
const $customer = $('#customer');
const $posting_date = $('#posting_date');
const $document_date = $('#document_date');
const $type = $('#type');
const $table_recon_ar = $('#table-recon-ar');
const $table_recon_cif = $('#table-recon-cif');
const $recon_total = $('#recon-total');

const table_recon_column_opts_ar = [
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
                       data-ar-id="${Object.keys(row?.['ar_invoice_data']).length > 0 ? row?.['ar_invoice_data']?.['id'] : ''}"
                       class="form-check-input selected_document"
                >
                <label class="form-check-label"></label>
            </div>`
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            let document_code = ''
            if (row?.['ar_invoice_data'] ? Object.keys(row?.['ar_invoice_data']).length > 0 : false) {
                document_code = row?.['ar_invoice_data']?.['code'] ? row?.['ar_invoice_data']?.['code'] : ''
            }
            return `<span class="badge badge-soft-primary document_code">${document_code}</span>`;
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            let document_type = ''
            if (row?.['ar_invoice_data'] ? Object.keys(row?.['ar_invoice_data']).length > 0 : false) {
                document_type = $trans_script.attr('data-trans-ar')
            }
            return `<span class="document_type">${document_type}</span>`;
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            let posting_date = ''
            if (row?.['ar_invoice_data'] ? Object.keys(row?.['ar_invoice_data']).length > 0 : false) {
                posting_date = row?.['ar_invoice_data']?.['posting_date'] ? moment(row?.['ar_invoice_data']?.['posting_date'].split(' '), 'YYYY-MM-DD').format('DD/MM/YYYY') : ''
            }
            return `<span class="posting_date">${posting_date}</span>`;
        }
    },
    {
        className: 'wrap-text text-right w-10',
        render: (data, type, row) => {
            if (row?.['ar_invoice_data'] ? Object.keys(row?.['ar_invoice_data']).length > 0 : false) {
                let sum_total_value = row?.['ar_invoice_data']?.['sum_total_value'] ? row?.['ar_invoice_data']?.['sum_total_value'] : 0
                return `<span class="mask-money total_value" data-init-money="${sum_total_value}"></span>`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text text-right w-10',
        render: (data, type, row) => {
            let recon_balance = row?.['recon_balance'] ? row?.['recon_balance'] : 0
            if (row?.['ar_invoice_data'] ? Object.keys(row?.['ar_invoice_data']).length > 0 : false) {
                return `<span class="mask-money balance_value" data-init-money="${recon_balance}"></span>`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            let recon_amount = row?.['recon_amount'] ? row?.['recon_amount'] : 0
            if (row?.['ar_invoice_data'] ? Object.keys(row?.['ar_invoice_data']).length > 0 : false) {
                return `<input disabled ${row?.['id'] ? 'disabled readonly' : ''} class="form-control text-right mask-money recon_amount positive-no" value="${recon_amount}">`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text w-20',
        render: (data, type, row) => {
            return `<textarea disabled ${row?.['id'] ? 'disabled readonly' : ''} rows="1" class="form-control note"></textarea>`;
        }
    },
    {
        className: 'wrap-text text-center w-5',
        render: (data, type, row) => {
            return `<span class="accounting_account">${row?.['accounting_account']}</span>`;
        }
    },
]

const table_recon_column_opts_cif = [
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
                       data-cif-id="${Object.keys(row?.['cash_inflow_data']).length > 0 ? row?.['cash_inflow_data']?.['id'] : ''}"
                       class="form-check-input selected_document"
                >
                <label class="form-check-label"></label>
            </div>`
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            let document_code = ''
            if (row?.['cash_inflow_data'] ? Object.keys(row?.['cash_inflow_data']).length > 0 : false) {
                document_code = row?.['cash_inflow_data']?.['code'] ? row?.['cash_inflow_data']?.['code'] : ''
            }
            return `<span class="badge badge-soft-danger document_code">${document_code}</span>`;
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            let document_type = ''
            if (row?.['cash_inflow_data'] ? Object.keys(row?.['cash_inflow_data']).length > 0 : false) {
                document_type = $trans_script.attr('data-trans-cif')
            }
            return `<span class="document_type">${document_type}</span>`;
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            let posting_date = ''
            if (row?.['cash_inflow_data'] ? Object.keys(row?.['cash_inflow_data']).length > 0 : false) {
                posting_date = row?.['cash_inflow_data']?.['posting_date'] ? moment(row?.['cash_inflow_data']?.['posting_date'].split(' '), 'YYYY-MM-DD').format('DD/MM/YYYY') : ''
            }
            return `<span class="posting_date">${posting_date}</span>`;
        }
    },
    {
        className: 'wrap-text text-right w-10',
        render: (data, type, row) => {
            if (row?.['cash_inflow_data'] ? Object.keys(row?.['cash_inflow_data']).length > 0 : false) {
                let sum_total_value = row?.['cash_inflow_data']?.['sum_total_value'] ? row?.['cash_inflow_data']?.['sum_total_value'] : 0
                return `(<span class="mask-money total_value" data-init-money="${sum_total_value}"></span>)`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text text-right w-10',
        render: (data, type, row) => {
            let recon_balance = row?.['recon_balance'] ? row?.['recon_balance'] : 0
            if (row?.['cash_inflow_data'] ? Object.keys(row?.['cash_inflow_data']).length > 0 : false) {
                return `(<span class="mask-money balance_value" data-init-money="${recon_balance}"></span>)`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            let recon_amount = row?.['recon_amount'] ? row?.['recon_amount'] : 0
            if (row?.['cash_inflow_data'] ? Object.keys(row?.['cash_inflow_data']).length > 0 : false) {
                return `<input disabled ${row?.['id'] ? 'disabled readonly' : ''} class="form-control text-right mask-money recon_amount negative-no" value="${recon_amount}">`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text w-20',
        render: (data, type, row) => {
            return `<textarea disabled ${row?.['id'] ? 'disabled readonly' : ''} rows="1" class="form-control note"></textarea>`;
        }
    },
    {
        className: 'wrap-text text-center w-5',
        render: (data, type, row) => {
            return `<span class="accounting_account">${row?.['accounting_account']}</span>`;
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
                ReconAction.LoadItems()
            }
        })
    }
    static LoadTableReconAR(element, data_list=[]) {
        element.DataTable().clear().destroy()
        element.DataTableDefault({
            styleDom: 'hide-foot',
            reloadCurrency: true,
            rowIdx: true,
            scrollX: '100vw',
            scrollY: '20vh',
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: table_recon_column_opts_ar,
            initComplete: function () {
                ReconAction.RecalculateReconTotal()
            }
        })
    }
    static LoadTableReconCIF(element, data_list=[]) {
        element.DataTable().clear().destroy()
        element.DataTableDefault({
            styleDom: 'hide-foot',
            reloadCurrency: true,
            rowIdx: true,
            scrollX: '100vw',
            scrollY: '20vh',
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: table_recon_column_opts_cif,
            initComplete: function () {
                ReconAction.RecalculateReconTotal()
            }
        })
    }
}

class ReconAction {
    static LoadItems() {
        let ar_items_ajax = $.fn.callAjax2({
            url: $table_recon_ar.attr('data-url-ar-item'),
            data: {'customer_mapped_id': $customer.val()},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('ar_invoice_list')) {
                    return data?.['ar_invoice_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )
        let cif_items_ajax = $.fn.callAjax2({
            url: $table_recon_cif.attr('data-url-cif-item'),
            data: {'customer_id': $customer.val()},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('cash_inflow_list')) {
                    return data?.['cash_inflow_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([ar_items_ajax, cif_items_ajax]).then(
            (results) => {
                console.log(results)

                let ar_items_data_list = []
                let ar_items_data = results[0]
                for (let i=0; i < ar_items_data.length; i++) {
                    let recon_balance = parseFloat(ar_items_data[i]?.['sum_total_value']) - parseFloat(ar_items_data[i]?.['recon_total'])
                    if (recon_balance > 0) {
                        ar_items_data_list.push({
                            'id': null,
                            'order': ar_items_data.length,
                            'ar_invoice_data': {
                                'id': ar_items_data[i]?.['id'],
                                'code': ar_items_data[i]?.['code'],
                                'title': ar_items_data[i]?.['title'],
                                'type_doc': 'AR invoice',
                                'document_date': ar_items_data[i]?.['document_date'],
                                'posting_date': ar_items_data[i]?.['posting_date'],
                                'sum_total_value': ar_items_data[i]?.['sum_total_value']
                            },
                            'cash_inflow_data': {},
                            'recon_balance': recon_balance,
                            'note': '',
                            'accounting_account': '1311'
                        })
                    }
                }
                ReconLoadPage.LoadTableReconAR(
                    $table_recon_ar,
                    ar_items_data_list.reduce((acc, item) => { // lọc trùng khi lấy payment term của SO có nhiều AR Invoice
                        if (!acc.some(existingItem => existingItem.ar_invoice_data.id === item.ar_invoice_data.id)) {
                            acc.push(item);
                        }
                        return acc;
                    }, [])
                )

                let cif_items_data_list = []
                let cif_items_data = results[1]
                for (let i=0; i < cif_items_data.length; i++) {
                    let cif_data = cif_items_data[i]
                    let recon_balance = parseFloat(cif_data?.['recon_balance'])
                    if (recon_balance > 0) {
                        cif_items_data_list.push({
                            'id': null,
                            'order': cif_items_data.length,
                            'ar_invoice_data': {},
                            'cash_inflow_data': {
                                'id': cif_data?.['id'],
                                'code': cif_data?.['code'],
                                'title': cif_data?.['title'],
                                'type_doc': 'Cash inflow',
                                'document_date': cif_data?.['document_date'],
                                'posting_date': cif_data?.['posting_date'],
                                'sum_total_value': cif_data?.['sum_total_value'],
                            },
                            'recon_balance': cif_data?.['recon_balance'],
                            'note': '',
                            'accounting_account': '1311'
                        })
                    }
                }
                ReconLoadPage.LoadTableReconCIF($table_recon_cif, cif_items_data_list)
            })
    }
    static RecalculateReconTotal() {
        let positive_value = 0
        $table_recon_ar.find('tbody tr .positive-no').each(function () {
            if ($(this).closest('tr').find('.selected_document').prop('checked')) {
                positive_value += parseFloat($(this).attr('value'))
            }
        })
        let negative_value = 0
        $table_recon_cif.find('tbody tr .negative-no').each(function () {
            if ($(this).closest('tr').find('.selected_document').prop('checked')) {
                negative_value += parseFloat($(this).attr('value'))
            }
        })
        $recon_total.attr('value', positive_value - negative_value)
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
        ReconLoadPage.LoadTableReconAR($table_recon_ar)
        ReconLoadPage.LoadTableReconCIF($table_recon_cif)
    }
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        if (parseFloat($recon_total.attr('value')) !== 0) {
            $.fn.notifyB({description: `Reconciliation total must be 0`}, 'failure');
            return false
        }

        frm.dataForm['title'] = $title.val()
        frm.dataForm['customer_id'] = $customer.val()
        frm.dataForm['posting_date'] = moment($posting_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['document_date'] = moment($document_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['type'] = $type.val()

        let recon_item_data = []
        $table_recon_ar.find('tbody tr').each(function () {
            if ($(this).find('.selected_document').prop('checked')) {
                recon_item_data.push({
                    'ar_invoice_id': $(this).find('.selected_document').attr('data-ar-id') ? $(this).find('.selected_document').attr('data-ar-id') : null,
                    'cash_inflow_id': null,
                    'recon_balance': $(this).find('.balance_value').attr('data-init-money'),
                    'recon_amount': $(this).find('.recon_amount').attr('value'),
                    'note': $(this).find('.note').val(),
                    'accounting_account': '1311'
                })
            }
        })
        $table_recon_cif.find('tbody tr').each(function () {
            if ($(this).find('.selected_document').prop('checked')) {
                recon_item_data.push({
                    'ar_invoice_id': null,
                    'cash_inflow_id': $(this).find('.selected_document').attr('data-cif-id') ? $(this).find('.selected_document').attr('data-cif-id') : null,
                    'recon_balance': $(this).find('.balance_value').attr('data-init-money'),
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
                    // console.log(data)

                    $title.val(data?.['title'])
                    $posting_date.val(moment(data?.['posting_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    $document_date.val(moment(data?.['document_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    ReconLoadPage.LoadCustomer($customer, data?.['customer_data'])

                    ReconLoadPage.LoadTableReconAR($table_recon_ar, data?.['recon_items_data'].filter((item) => {
                        return Object.keys(item?.['cash_inflow_data']).length === 0
                    }))
                    ReconLoadPage.LoadTableReconCIF($table_recon_cif, data?.['recon_items_data'].filter((item) => {
                        return Object.keys(item?.['ar_invoice_data']).length === 0
                    }))

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
        $(this).prop('checked') ? parseFloat($(this).closest('tr').find('.balance_value').attr('data-init-money')) : 0
    ).prop('disabled', !$(this).prop('checked'))

    $(this).closest('tr').find('.note').prop('disabled', !$(this).prop('checked'))
    ReconAction.RecalculateReconTotal()
})

$(document).on('change', '.recon_amount', function () {
    let this_value = parseFloat($(this).attr('value'))
    let balance_value = parseFloat($(this).closest('tr').find('.balance_value').attr('data-init-money'))
    if (this_value > balance_value) {
        $.fn.notifyB({description: `Recon value can not > Balance value`}, 'failure');
        $(this).attr('value', balance_value)
    }
    ReconAction.RecalculateReconTotal()
})

$(document).on('mouseenter', '#table-recon-ar tbody tr', function () {
    let row_index = parseFloat($(this).closest('tr').find('td:eq(0)').text())
    if ($.fn.getPkDetail()) {
        $table_recon_ar.find('tbody tr').removeClass('bg-primary-light-5')
        $(this).closest('tr').addClass('bg-primary-light-5')
        $table_recon_cif.find('tbody tr').removeClass('bg-danger-light-5')
        $table_recon_cif.find(`tbody tr:eq(${row_index - 1})`).addClass('bg-danger-light-5')
    }
})

$(document).on('mouseenter', '#table-recon-cif tbody tr', function () {
    let row_index = parseFloat($(this).closest('tr').find('td:eq(0)').text())
    if ($.fn.getPkDetail()) {
        $table_recon_cif.find('tbody tr').removeClass('bg-danger-light-5')
        $(this).closest('tr').addClass('bg-danger-light-5')
        $table_recon_ar.find('tbody tr').removeClass('bg-primary-light-5')
        $table_recon_ar.find(`tbody tr:eq(${row_index - 1})`).addClass('bg-primary-light-5')
    }
})

$(document).on('mouseleave', 'table tbody tr', function () {
    $table_recon_ar.find('tbody tr').removeClass('bg-primary-light-5')
    $table_recon_cif.find('tbody tr').removeClass('bg-danger-light-5')
})
