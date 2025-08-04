/**
 * Khai báo các element trong page
 */
class ReconPageElements {
    constructor() {
        this.$trans_script = $('#trans-script');
        this.$url_script = $('#url-script');
        this.$title = $('#title');
        this.$customer = $('#customer');
        this.$supplier = $('#supplier');
        this.$customer_space = $('#customer-space');
        this.$supplier_space = $('#supplier-space');
        this.$posting_date = $('#posting_date');
        this.$document_date = $('#document_date');
        this.$type = $('#type');
        this.$table_recon = $('#table-recon');
        this.$recon_total = $('#recon-total');
    }
}
const pageElements = new ReconPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class ReconPageVariables {
    constructor() {

    }
}
const pageVariables = new ReconPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class ReconPageFunction {
    static LoadTableRecon(data_list=[], option='create') {
        pageElements.$table_recon.DataTable().clear().destroy()
        pageElements.$table_recon.DataTableDefault({
            styleDom: 'hide-foot',
            reloadCurrency: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '40vh',
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: [
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
                                   ${option === 'detail' ? 'disabled' : ''}
                                   ${row?.['id'] ? 'checked' : ''}
                                   data-credit-id="${row?.['credit_doc_id'] || ''}"
                                   data-debit-id="${row?.['debit_doc_id'] || ''}"
                                   class="form-check-input selected_document"
                            >
                        </div>`
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        let document_type = ReconPageFunction.ConvertToDocTitle(row?.['credit_app_code'] || row?.['debit_app_code'] || '')
                        let credit_doc_data = row?.['credit_doc_data'] || {}
                        let debit_doc_data = row?.['debit_doc_data'] || {}
                        let document_code = credit_doc_data?.['code'] || debit_doc_data?.['code'] || ''
                        let document_title = credit_doc_data?.['title'] || debit_doc_data?.['title'] || ''
                        return `<span class="document_type ${row?.['credit_doc_id'] ? 'text-primary' : 'text-danger'}">${document_type}</span> (<span class="document_code" title="${document_title}">${document_code}</span>)`;
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        let posting_date = (row?.['credit_doc_data'] || {})?.['posting_date'] || (row?.['debit_doc_data'] || {})?.['posting_date'] || ''
                        if (posting_date) {
                            posting_date = moment(posting_date, 'YYYY-MM-DD').format('DD/MM/YYYY')
                            return `<span class="posting_date">📅 ${posting_date}</span>`;
                        }
                        return ''
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        let recon_total = row?.['recon_total'] || 0
                        if (row?.['credit_doc_id']) {
                            return `<span class="mask-money recon_total" data-init-money="${recon_total}"></span>`;
                        }
                        return `<span class="mask-money recon_total" data-init-money="${recon_total * (-1)}"></span>`;
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        let recon_balance = row?.['recon_balance'] || 0
                        if (row?.['credit_doc_id']) {
                            return `<span class="mask-money recon_balance" data-init-money="${recon_balance}"></span>`;
                        }
                        return `<span class="mask-money recon_balance" data-init-money="${recon_balance * (-1)}"></span>`;
                    }
                },
                {
                    className: 'text-right w-15',
                    render: (data, type, row) => {
                        let recon_amount = row?.['recon_amount'] || 0
                        if (row?.['credit_doc_id']) {
                            return `<input disabled ${option === 'detail' ? 'disabled readonly' : ''} class="form-control text-right mask-money recon_amount credit_amount" value="${recon_amount}">`;
                        }
                        return `<input disabled ${option === 'detail' ? 'disabled readonly' : ''} class="form-control text-right mask-money recon_amount debit_amount" value="${recon_amount * (-1)}">`;
                    }
                },
                {
                    className: 'text-right w-10',
                    render: (data, type, row) => {
                        return `<span class="account_code" style="font-size: 20px">${row?.['debit_account_data']?.['acc_code'] || row?.['credit_account_data']?.['acc_code']}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<textarea disabled ${option === 'detail' ? 'disabled readonly' : ''} ${row?.['id'] ? 'disabled readonly' : ''} class="form-control note"></textarea>`;
                    }
                },
            ],
            initComplete: function () {
                ReconPageFunction.RecalculateReconTotal()
                pageElements.$table_recon.DataTable().column(7).visible(option!=='create');
            }
        })
    }
    // sub
    static ConvertToDocTitle(app_code='') {
        if (app_code === 'delivery.orderdeliverysub') {
            return pageElements.$trans_script.attr('data-trans-delivery')
        }
        else if (app_code === 'arinvoice.arinvoice') {
            return pageElements.$trans_script.attr('data-trans-ar')
        }
        else if (app_code === 'apinvoice.apinvoice') {
            return pageElements.$trans_script.attr('data-trans-ap')
        }
        else if (app_code === 'financialcashflow.cashinflow') {
            return pageElements.$trans_script.attr('data-trans-cif')
        }
        else if (app_code === 'financialcashflow.cashoutflow') {
            return pageElements.$trans_script.attr('data-trans-cof')
        }
        else if (app_code === 'inventory.goodsreceipt') {
            return pageElements.$trans_script.attr('data-trans-gr')
        }
        return ''
    }
    static RecalculateReconTotal() {
        let sum_credit_amount = 0
        pageElements.$table_recon.find('tbody tr .credit_amount').each(function () {
            if ($(this).closest('tr').find('.selected_document').prop('checked')) {
                sum_credit_amount += parseFloat($(this).attr('value'))
            }
        })
        let sum_debit_amount = 0
        pageElements.$table_recon.find('tbody tr .debit_amount').each(function () {
            if ($(this).closest('tr').find('.selected_document').prop('checked')) {
                sum_debit_amount += parseFloat($(this).attr('value'))
            }
        })
        pageElements.$recon_total.attr('value', sum_credit_amount + sum_debit_amount)
        $.fn.initMaskMoney2()
    }
}

/**
 * Khai báo các hàm chính
 */
class ReconHandler {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        if (parseFloat(pageElements.$recon_total.attr('value')) !== 0) {
            $.fn.notifyB({description: `Recon total must be 0`}, 'failure');
            return false
        }

        frm.dataForm['title'] = pageElements.$title.val()
        frm.dataForm['posting_date'] = moment(pageElements.$posting_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['document_date'] = moment(pageElements.$document_date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD')
        frm.dataForm['recon_type'] = pageElements.$type.val()

        if (pageElements.$type.val() === '0') {
            frm.dataForm['business_partner'] = pageElements.$customer.val() || null
        }
        else if (pageElements.$type.val() === '1') {
            frm.dataForm['business_partner'] = pageElements.$supplier.val() || null
        }

        let recon_item_data = []
        pageElements.$table_recon.find('tbody tr').each(function () {
            if ($(this).find('.selected_document').prop('checked')) {
                recon_item_data.push({
                    'debit_doc_id': $(this).find('.selected_document').attr('data-debit-id') || null,
                    'credit_doc_id': $(this).find('.selected_document').attr('data-credit-id') || null,
                    'recon_total': Math.abs(parseFloat($(this).find('.recon_total').attr('data-init-money') || 0)),
                    'recon_balance': Math.abs(parseFloat($(this).find('.recon_balance').attr('data-init-money') || 0)),
                    'recon_amount': Math.abs(parseFloat($(this).find('.recon_amount').attr('value') || 0)),
                    'note': $(this).find('.note').val()
                })
            }
        })

        frm.dataForm['recon_item_data'] = recon_item_data

        if (recon_item_data.length === 0) {
            $.fn.notifyB({description: `Reconciliation item is missing`}, 'failure');
            return false
        }

        // console.log(frm)

        return frm
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

                    pageElements.$title.val(data?.['title'])
                    pageElements.$posting_date.val(moment(data?.['posting_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))
                    pageElements.$document_date.val(moment(data?.['document_date'].split(' ')[0], 'YYYY/MM/DD').format('DD/MM/YYYY'))

                    pageElements.$type.val(data?.['recon_type'])
                    if (data?.['recon_type'] === 0) {
                        pageElements.$supplier_space.prop('hidden', true)
                        pageElements.$customer_space.prop('hidden', false)
                        UsualLoadPageFunction.LoadCustomer({
                            element: pageElements.$customer,
                            data: data?.['business_partner_data']
                        })
                        UsualLoadPageFunction.LoadSupplier({element: pageElements.$supplier})
                    }
                    else if (data?.['recon_type'] === 1) {
                        pageElements.$supplier_space.prop('hidden', false)
                        pageElements.$customer_space.prop('hidden', true)
                        UsualLoadPageFunction.LoadCustomer({element: pageElements.$customer})
                        UsualLoadPageFunction.LoadSupplier({
                            element: pageElements.$supplier,
                            data: data?.['business_partner_data']
                        })
                    }

                    ReconPageFunction.LoadTableRecon(data?.['recon_items_data'], option)

                    $.fn.initMaskMoney2()

                    UsualLoadPageFunction.DisablePage(option==='detail');

                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class ReconEventHandler {
    static InitPageEven() {
        pageElements.$type.on('change', function () {
            pageElements.$customer_space.prop('hidden', $(this).val() !== '0')
            pageElements.$supplier_space.prop('hidden', $(this).val() !== '1')
        })
        pageElements.$customer.on('change', function () {
            let dataParams1 = {'customer_mapped_id': pageElements.$customer.val() || null}
            let ar_ajax = $.fn.callAjax2({
                url: pageElements.$url_script.attr('data-url-ar-list-for-recon'),
                data: dataParams1,
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

            let dataParams2 = {'customer_mapped_id': pageElements.$customer.val() || null}
            let cif_ajax = $.fn.callAjax2({
                url: pageElements.$url_script.attr('data-url-cif-list-for-recon'),
                data: dataParams2,
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

            Promise.all([ar_ajax, cif_ajax]).then(
                (results) => {
                    let data_ar = results[0]
                    data_ar.forEach(item => {
                        let data_ar = results[0]
                        data_ar.forEach(item => {
                            const recon_total = parseFloat(item?.['recon_total']) || 0;
                            const sum_recon_amount = parseFloat(item?.['sum_recon_amount']) || 0;
                            item['recon_balance'] = recon_total - sum_recon_amount;
                        });

                        let data_cif = results[1]
                        data_cif.forEach(item => {
                            const recon_total = parseFloat(item?.['recon_total']) || 0;
                            const sum_recon_amount = parseFloat(item?.['sum_recon_amount']) || 0;
                            item['recon_balance'] = recon_total - sum_recon_amount;
                        });

                        ReconPageFunction.LoadTableRecon(data_ar.concat(data_cif))
                    });
                })
        })
        pageElements.$supplier.on('change', function () {
            let dataParams1 = {'supplier_mapped_id': pageElements.$supplier.val() || null}
            let ap_ajax = $.fn.callAjax2({
                url: pageElements.$url_script.attr('data-url-ap-list-for-recon'),
                data: dataParams1,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('ap_invoice_list')) {
                        return data?.['ap_invoice_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            let dataParams2 = {'supplier_mapped_id': pageElements.$supplier.val() || null}
            let cof_ajax = $.fn.callAjax2({
                url: pageElements.$url_script.attr('data-url-cof-list-for-recon'),
                data: dataParams2,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('cash_outflow_list')) {
                        return data?.['cash_outflow_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([ap_ajax, cof_ajax]).then(
                (results) => {
                    let data_ap = results[0]
                    data_ap.forEach(item => {
                        const recon_total = parseFloat(item?.['recon_total']) || 0;
                        const sum_recon_amount = parseFloat(item?.['sum_recon_amount']) || 0;
                        item['recon_balance'] = recon_total - sum_recon_amount;
                    });

                    let data_cof = results[1]
                    data_cof.forEach(item => {
                        const recon_total = parseFloat(item?.['recon_total']) || 0;
                        const sum_recon_amount = parseFloat(item?.['sum_recon_amount']) || 0;
                        item['recon_balance'] = recon_total - sum_recon_amount;
                    });

                    ReconPageFunction.LoadTableRecon(data_ap.concat(data_cof))
                })
        })
        $(document).on('change', '.selected_document', function () {
            $(this).closest('tr').find('.recon_amount').attr(
                'value',
                $(this).prop('checked') ? parseFloat($(this).closest('tr').find('.recon_balance').attr('data-init-money')) : 0
            ).prop('disabled', !$(this).prop('checked'))

            $(this).closest('tr').find('.note').prop('disabled', !$(this).prop('checked'))
            ReconPageFunction.RecalculateReconTotal()
        })
        $(document).on('change', '.recon_amount', function () {
            let this_value = parseFloat($(this).attr('value'))
            let recon_balance = parseFloat($(this).closest('tr').find('.recon_balance').attr('data-init-money'))
            if (this_value > 0) {
                this_value = this_value * (-1)
            }
            if ($(this).hasClass('debit_amount')) {
                $(this).attr('value', this_value)
            }
            if (this_value > recon_balance * (-1)) {
                $.fn.notifyB({description: `Recon value can not > Balance value`}, 'failure');
                $(this).attr('value', recon_balance)
            }
            ReconPageFunction.RecalculateReconTotal()
        })
    }
}
