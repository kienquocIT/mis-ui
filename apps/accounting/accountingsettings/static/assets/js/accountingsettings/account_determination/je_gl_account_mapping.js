$(document).ready(function() {
    const $je_gl_account_mapping_table = $('#je-gl-account-mapping-table')
    function LoadJEAccountMappingTable() {
        $je_gl_account_mapping_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($je_gl_account_mapping_table);
        $je_gl_account_mapping_table.DataTableDefault({
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
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_list = resp.data['je_gl_account_mapping'] ? resp.data['je_gl_account_mapping'] : []
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
                    className: 'w-35',
                    render: (data, type, row) => {
                        return `<span class="bflow-mirrow-badge border-0 fw-bold bg-blue-light-5">${row?.['posting_group']?.['code'] || ''}</span> - <span>${row?.['posting_group']?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span class="bflow-mirrow-badge border-0 fw-bold bg-secondary-light-5">${row?.['role_key'] || ''}</span> - <span>${row?.['role_key_parsed'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        let $ele = $(UsualLoadPageAccountingFunction.default_account_select2)
                        $ele.find('.row-account').prop('disabled', true);
                        $ele.find('.row-account').attr('data-account-mapped', JSON.stringify(row?.['account_data'] ||{}));
                        return $ele.prop('outerHTML')
                    }
                },
                {
                    className: 'w-10 text-right',
                    render: (data, type, row) => {
                        return `<div class="form-check form-switch">
                            <input type="checkbox" data-id="${row?.['id']}" class="form-check-input is-active" ${row?.['is_active'] ? 'checked' : ''}>
                        </div>`;
                    }
                },
            ],
            initComplete: function () {
                $je_gl_account_mapping_table.find('tbody tr').each(function (index, ele) {
                    if ($(ele).find('.row-account').length) {
                        UsualLoadPageAccountingFunction.LoadAccountingAccount({
                            element: $(ele).find('.row-account'),
                            data: JSON.parse($(ele).find('.row-account').attr('data-account-mapped') || '{}'),
                            data_url: $je_gl_account_mapping_table.attr('data-chart-of-account-url'),
                            data_params: {'is_account': true}
                        })
                    }
                })
            }
        });
    }

    LoadJEAccountMappingTable()

})