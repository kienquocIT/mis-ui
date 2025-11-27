/**
 * Khai báo các element trong page
 */
class JEPageElements {
    constructor() {
        this.$trans_script = $('#trans-script')
        this.$url_script = $('#url-script')
        this.$je_state = $('#je-state')
        this.$ori_trans = $('#ori-trans')
        this.$transaction_code = $('#transaction-code')
        this.$je_posting_date = $('#je-posting-date')
        this.$je_doc_date = $('#je-doc-date')
        this.$je_des = $('#je-des')
        this.$journal_entry_table = $('#journal-entry-table')
    }
}
const pageElements = new JEPageElements()

class JELoadPage {
    static LoadJETable(datalist=[]) {
        pageElements.$journal_entry_table.DataTableDefault({
            styleDom: 'hide-foot',
            useDataServer: false,
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '50vh',
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            data: datalist,
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `
                            <span class="text-muted fw-bold h5">${row?.['account_data']?.['acc_code']}</span><br>
                            <span class="text-muted">${row?.['account_data']?.['foreign_acc_name']}</span>
                        `
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="text-muted">${row?.['account_data']?.['acc_name']}</span>`
                    }
                },
                {
                    className: 'text-right w-15',
                    render: (data, type, row) => {
                        if (!row?.['is_fc'] && row?.['debit'] !== 0) {
                            return `<span class="text-primary mask-money" data-init-money="${row?.['debit']}"></span>`;
                        }
                        return `--`;
                    }
                },
                {
                    className: 'text-right w-15',
                    render: (data, type, row) => {
                        if (!row?.['is_fc'] && row?.['credit'] !== 0) {
                            return `<span class="text-primary mask-money" data-init-money="${row?.['credit']}"></span>`;
                        }
                        return `--`;
                    }
                },
                {
                    className: 'text-right w-15',
                    render: (data, type, row) => {
                        if (row?.['taxable_value'] !== 0) {
                            return `<span class="text-muted mask-money" data-init-money="${row?.['taxable_value']}"></span>`;
                        }
                        return ``
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['business_partner_data']?.['name'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        let dimension_html = ``
                        for (let i=0; i < row?.['dimensions']?.length; i++) {
                            let item = row?.['dimensions'][i]
                            if (Object.keys(item).length > 0) {
                                dimension_html += `<h5><span class="badge badge-sm badge-pill badge-outline badge-soft-blue mr-1" title="${item?.['name'] || item?.['title'] || ''}">${item?.['code']}</span></h5>
                                                    <h5><span class="badge badge-sm badge-pill badge-outline badge-soft-warning">100%</span></h5><br>`;
                            }
                        }
                        return `<div class="d-flex">${dimension_html}</div>`;
                    }
                },
            ],
            initComplete: function(settings, json) {
                let wrapper$ = pageElements.$journal_entry_table.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="h5 text-primary fw-bold">📊 ${$.fn.gettext('Journal lines')}</span>`)
                    )
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

                    console.log(data)

                    pageElements.$je_state.attr(
                        'class',
                        [
                            'badge badge-pill badge-outline badge-soft-secondary',
                            'badge badge-pill badge-outline badge-soft-success',
                            'badge badge-pill badge-outline badge-soft-orange'
                        ][data?.['je_state']]
                    ).text(
                        [
                            $.fn.gettext('Draft'),
                            $.fn.gettext('Posted'),
                            $.fn.gettext('Reversed')
                        ][data?.['je_state']]
                    )
                    pageElements.$ori_trans.val(data?.['original_transaction_parsed'])
                    pageElements.$transaction_code.val(data?.['je_transaction_data']?.['code'])
                    pageElements.$je_posting_date.val(moment(data?.['je_posting_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    pageElements.$je_doc_date.val(moment(data?.['je_document_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    pageElements.$je_des.val(data?.['je_transaction_data']?.['title'])

                    // gom tk
                    // const je_lines_sum = {};
                    // (data?.['je_lines'] || []).forEach(item => {
                    //     const accId = item?.['account_data']?.['id'];
                    //     if (!accId) return;
                    //
                    //     if (!je_lines_sum[accId]) {
                    //         je_lines_sum[accId] = { ...item };
                    //         je_lines_sum[accId]['debit'] = 0;
                    //         je_lines_sum[accId]['credit'] = 0;
                    //     }
                    //
                    //     je_lines_sum[accId]['debit'] += item?.['debit'] || 0;
                    //     je_lines_sum[accId]['credit'] += item?.['credit'] || 0;
                    // });

                    const je_lines_sum = data?.['je_lines'] || []
                    JELoadPage.LoadJETable(Object.values(je_lines_sum) || [])

                    $('#total-debit').attr('data-init-money', data?.['total_debit'] || 0)
                    $('#total-credit').attr('data-init-money', data?.['total_credit'] || 0)

                    UsualLoadPageFunction.DisablePage(option==='detail')
                }
            })
    }
}
