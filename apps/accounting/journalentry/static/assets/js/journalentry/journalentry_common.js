const $trans_script = $('#trans-script')
const $url_script = $('#url-script')
const $ori_trans = $('#ori-trans')
const $transaction_code = $('#transaction-code')
const $transaction_name = $('#transaction-name')
const $type = $('#type')
const $je_posting_date = $('#je-posting-date')
const $je_doc_date = $('#je-doc-date')
const $journal_entry_table = $('#journal-entry-table')

class JELoadPage {
    static LoadJETable(datalist=[]) {
        let has_fc_value = false
        let has_lc_value = false
        $journal_entry_table.DataTableDefault({
            styleDom: 'hide-foot',
            useDataServer: false,
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '50vh',
            scrollX: '100vh',
            scrollCollapse: true,
            paging: false,
            data: datalist,
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return ``;
                    }
                }, {
                    className: 'wrap-text w-10',
                    render: (data, type, row) => {
                        let html = ''
                        for (let i = 0; i < row?.['account_data'].length; i++) {
                            html += `<span class="text-primary fw-bold">${row?.['account_data'][i]?.['acc_code']}</span>`
                        }
                        return html;
                    }
                }, {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        let html = ''
                        for (let i = 0; i < row?.['account_data'].length; i++) {
                            html += `<span class="text-primary">${row?.['account_data'][i]?.['acc_name']}</span><br><span class="text-primary small">(${row?.['account_data'][i]?.['foreign_acc_name']})</span>`
                        }
                        return html;
                    }
                }, {
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${row?.['business_partner_data']?.['name'] || ''}</span>`;
                    }
                }, {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        if (!row?.['is_fc'] && row?.['debit'] !== 0) {
                            has_lc_value = true
                            return `<span class="text-primary fw-bold mask-money" data-init-money="${row?.['debit']}"></span>`;
                        }
                        return ``;
                    }
                }, {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        if (!row?.['is_fc'] && row?.['credit'] !== 0) {
                            has_lc_value = true
                            return `<span class="text-primary fw-bold mask-money" data-init-money="${row?.['credit']}"></span>`;
                        }
                        return ``;
                    }
                }, {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        if (row?.['is_fc'] && row?.['debit'] !== 0) {
                            has_fc_value = true
                            return `<span class="text-primary fw-bold mask-money" data-init-money="${row?.['debit']}"></span>`;
                        }
                        return ``;
                    }
                }, {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        if (row?.['is_fc'] && row?.['credit'] !== 0) {
                            has_fc_value = true
                            return `<span class="text-primary fw-bold mask-money" data-init-money="${row?.['credit']}"></span>`;
                        }
                        return ``;
                    }
                }, {
                    className: 'wrap-text text-right w-10',
                    render: (data, type, row) => {
                        if (row?.['taxable_value'] !== 0) {
                            return `<span class="text-muted mask-money" data-init-money="${row?.['taxable_value']}"></span>`;
                        }
                        return ''
                    }
                },
            ],
            initComplete: function(settings, json) {
                if (!has_fc_value) {
                    this.api().column(6).visible(false);
                    this.api().column(7).visible(false);
                }
                if (!has_lc_value) {
                    this.api().column(4).visible(false);
                    this.api().column(5).visible(false);
                }
            }
        });
    }
}

class JEHandle {
    static LoadPage() {
        JELoadPage.LoadJETable();
    }
    static LoadDetailJE(option) {
        let url_loaded = $('#form-detail-je').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['journal_entry_detail'];
                    $x.fn.renderCodeBreadcrumb(data);

                    // console.log(data)

                    if (data?.['system_auto_create'])

                    $ori_trans.val(data?.['original_transaction'])
                    $transaction_code.val(data?.['je_transaction_data']?.['code'])
                    $transaction_name.val(data?.['je_transaction_data']?.['title'])
                    $type.val([$.fn.gettext('Create manually'), $.fn.gettext('Create automatically')][Number(data?.['system_auto_create'])])
                    $je_posting_date.val(moment(data?.['je_posting_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $je_doc_date.val(moment(data?.['je_document_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'))

                    JELoadPage.LoadJETable(data?.['je_items'] || [])
                }
            })
    }
}
