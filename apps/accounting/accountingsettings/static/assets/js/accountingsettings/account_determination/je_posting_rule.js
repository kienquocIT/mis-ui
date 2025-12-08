$(document).ready(function() {
    const $je_posting_rule_table = $('#je-posting-rule-table')
    function LoadJEPostingRuleTable() {
        $je_posting_rule_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($je_posting_rule_table);
        $je_posting_rule_table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '68vh',
            scrollCollapse: true,
            ajax: {
                url: $('#script-url').attr('data-url-list'),
                data: {},
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_list = resp.data['je_posting_rule'] ? resp.data['je_posting_rule'] : []
                        return data_list ? data_list : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => ''
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span class="bflow-mirrow-badge border-0 fw-bold bg-primary-light-5" title="${row?.['document_type_app_code_parsed'] || ''}">${row?.['document_type_code'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="bflow-mirrow-badge border-0 fw-bold bg-secondary-light-5" title="${row?.['rule_level_parsed'] || ''}">${row?.['rule_level'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="bflow-mirrow-badge border-0 fw-bold bg-secondary-light-5" title="${row?.['role_key_parsed'] || ''}">${row?.['role_key'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="bflow-mirrow-badge border-0 fw-bold bg-secondary-light-5" title="${row?.['amount_source_parsed'] || ''}">${row?.['amount_source'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="bflow-mirrow-badge border-0 fw-bold bg-secondary-light-5" title="${row?.['side_parsed'] || ''}">${row?.['side'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span>${row?.['description'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-5 text-center',
                    render: (data, type, row) => {
                        return `<span class="bflow-mirrow-badge border-0 bg-warning-light-4">${row?.['priority']}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        if (row?.['account_source_type'] === "FIXED") {
                            let $ele = $(UsualLoadPageAccountingFunction.default_account_select2)
                            $ele.find('.row-account').prop('disabled', true);
                            $ele.find('.row-account').attr('data-account-mapped', JSON.stringify(row?.['fixed_account_data'] || {}));
                            return $ele.prop('outerHTML')
                        }
                        else {
                            return `<button type="button" class="bflow-mirrow-btn">LOOK UP</button></i>`
                        }
                    }
                },
                {
                    className: 'w-10 text-right',
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input type="checkbox" data-app-id="${row?.['id']}" class="form-check-input is-active" ${row?.['is_active'] ? 'checked' : ''}>
                        </div>`;
                    }
                },
            ],
            rowGroup: {
                dataSrc: 'document_type_app_code_parsed'
            },
            initComplete: function () {
                $je_posting_rule_table.find('tbody tr').each(function (index, ele) {
                    if ($(ele).find('.row-account').length) {
                        UsualLoadPageAccountingFunction.LoadAccountingAccount({
                            element: $(ele).find('.row-account'),
                            data: JSON.parse($(ele).find('.row-account').attr('data-account-mapped') || '{}'),
                            data_url: $je_posting_rule_table.attr('data-chart-of-account-url'),
                            data_params: {'is_account': true}
                        })
                    }
                })
            }
        });
    }

    LoadJEPostingRuleTable()

    $(document).on('change', '.is-active', function () {
        $.fn.notifyB({description: 'Not available now'}, 'failure')
    })
})