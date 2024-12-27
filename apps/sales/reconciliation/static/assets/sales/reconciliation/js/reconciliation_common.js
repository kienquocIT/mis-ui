const $trans_script = $('#trans-script');
const $title = $('#title');
const $customer = $('#customer');
const $posting_date = $('#posting_date');
const $document_date = $('#document_date');
const $table_recon = $('#table-recon');
const $check_all = $('#check-all');
const $recon_total = $('#recon-total');

const table_recon_column_opts = [
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
                       class="form-check-input selected_document"
                >
                <label class="form-check-label"></label>
            </div>`
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            if (Object.keys(row?.['ar_invoice_data']).length > 0) {
                return `<span class="badge badge-light document_code">${row?.['ar_invoice_data']?.['code']}</span>`;
            }
            else if (Object.keys(row?.['cash_inflow_data']).length > 0) {
                return `<span class="badge badge-light document_code">${row?.['cash_inflow_data']?.['code']}</span>`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            if (Object.keys(row?.['ar_invoice_data']).length > 0) {
                return `<span class="document_type">${$trans_script.attr('data-trans-ar')}</span>`;
            }
            else if (Object.keys(row?.['cash_inflow_data']).length > 0) {
                return `<span class="document_type">${$trans_script.attr('data-trans-cif')}</span>`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text w-10',
        render: (data, type, row) => {
            if (Object.keys(row?.['ar_invoice_data']).length > 0) {
                return `<span class="posting_date">${moment(row?.['ar_invoice_data']?.['posting_date'].split(' '), 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`;
            }
            else if (Object.keys(row?.['cash_inflow_data']).length > 0) {
                return `<span class="posting_date">${moment(row?.['cash_inflow_data']?.['posting_date'].split(' '), 'YYYY-MM-DD').format('DD/MM/YYYY')}</span>`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text text-right w-10',
        render: (data, type, row) => {
            if (Object.keys(row?.['ar_invoice_data']).length > 0) {
                return `<span class="mask-money total_value" data-init-money="${row?.['ar_invoice_data']?.['sum_total_value']}"></span>`;
            }
            else if (Object.keys(row?.['cash_inflow_data']).length > 0) {
                return `(<span class="mask-money total_value" data-init-money="${row?.['cash_inflow_data']?.['sum_total_value']}"></span>)`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text text-right w-10',
        render: (data, type, row) => {
            if (Object.keys(row?.['ar_invoice_data']).length > 0) {
                return `<span class="mask-money balance_value" data-init-money="${row?.['recon_balance']}"></span>`;
            }
            else if (Object.keys(row?.['cash_inflow_data']).length > 0) {
                return `(<span class="mask-money balance_value" data-init-money="${row?.['recon_balance']}"></span>)`;
            }
            return ``;
        }
    },
    {
        className: 'wrap-text text-right w-15',
        render: (data, type, row) => {
            if (Object.keys(row?.['ar_invoice_data']).length > 0) {
                return `<span class="mask-money recon_amount positive-no" data-init-money="${row?.['recon_amount']}"></span>`;
            }
            else if (Object.keys(row?.['cash_inflow_data']).length > 0) {
                return `(<span class="mask-money recon_amount negative-no" data-init-money="${row?.['recon_amount']}"></span>)`;
            }
            return `<input class="form-control mask-money text-right recon_amount" value="0">`;
        }
    },
    {
        className: 'wrap-text w-20',
        render: (data, type, row) => {
            return `<textarea ${row?.['id'] ? 'disabled readonly' : ''} rows="1" class="form-control note"></textarea>`;
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
                CashInflowAction.LoadARInvoiceTable({'customer_mapped_id': element.val()})
            }
        })
    }
    static LoadTableRecon(element, data_list=[]) {
        element.DataTable().clear().destroy()
        element.DataTableDefault({
            styleDom: 'hide-foot',
            reloadCurrency: true,
            rowIdx: true,
            scrollX: '100vw',
            scrollY: '40vh',
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: table_recon_column_opts,
            initComplete: function () {
                let positive_value = 0
                element.find('tbody tr .positive-no').each(function () {
                    positive_value += parseFloat($(this).attr('data-init-money'))
                })
                let negative_value = 0
                element.find('tbody tr .negative-no').each(function () {
                    negative_value += parseFloat($(this).attr('data-init-money'))
                })
                $recon_total.attr('value', positive_value - negative_value)
                $.fn.initMaskMoney2()

                $check_all.prop(
                    'checked',
                    $table_recon.find('tbody .selected_document').length === $table_recon.find('.selected_document:checked').length
                )
                $check_all.prop('disabled', data_list.length > 0)
            }
        }).on('draw.dt', function () {
            element.find('tbody').find('tr').each(function () {
                $(this).after('<tr class="table-row-gap"><td></td></tr>');
            });
        });
    }
}

class ReconLoadTab {
}

class ReconAction {
    // detail
    static DisabledDetailPage(option) {
        if (option === 'detail') {
            $('.form-control').prop('readonly', true).prop('disabled', true);
            $('.form-select').prop('readonly', true).prop('disabled', true);
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

                    ReconLoadPage.LoadTableRecon($table_recon, data?.['recon_items_data'])

                    $.fn.initMaskMoney2()
                    ReconAction.DisabledDetailPage(option);
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

$check_all.on('change', function () {
    $table_recon.find('.selected_document').prop('checked', $(this).prop('checked'));
})

$(document).on('change', '.selected_document', function () {
    $check_all.prop(
        'checked',
        $table_recon.find('tbody .selected_document').length === $table_recon.find('.selected_document:checked').length
    )
})
