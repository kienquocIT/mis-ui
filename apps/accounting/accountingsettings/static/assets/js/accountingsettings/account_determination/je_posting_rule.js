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
            scrollY: '70vh',
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
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span>${row?.['document_type_app_code_parsed'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn bflow-mirrow-btn btn-rounded bg-primary-light-5">${row?.['document_type_code'] || ''}</button>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn bflow-mirrow-btn btn-rounded bg-secondary-light-5">${row?.['rule_level'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn bflow-mirrow-btn btn-rounded bg-secondary-light-5">${row?.['role_key'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn bflow-mirrow-btn btn-rounded bg-secondary-light-5">${row?.['amount_source'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span>${row?.['side'] || ''}</span>`;
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
                        return `<span class="bg-warning-light-4 text-dark border-0 bflow-mirrow-badge">${row?.['priority']}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        let $ele = $(UsualLoadPageAccountingFunction.default_account_select2)
                        $ele.find('.row-account').prop('disabled', true);
                        $ele.find('.row-account').attr('data-account-mapped', JSON.stringify(row?.['fixed_account'] ||{}));
                        return $ele.prop('outerHTML')
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
            columnDefs: [
                {
                    "visible": false,
                    "targets": [1]
                }
            ],
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

                let wrapper$ = $je_posting_rule_table.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`
                            <button type="button" class="btn btn-outline-blue" data-bs-target="#modal-configure-guide" data-bs-toggle="modal">${$.fn.gettext('Configure guide')}</button>
                        `)
                    )
                }
            }
        });
    }

    LoadJEPostingRuleTable()

    $(document).on('change', '.is-active', function () {
        $.fn.notifyB({description: 'Not available now'}, 'failure')
    })
})