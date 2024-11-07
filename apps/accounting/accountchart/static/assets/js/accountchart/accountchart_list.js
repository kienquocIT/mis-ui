// $(document).ready(function() {
    const trans_script = $('#trans-script')
    const url_script = $('#url-script')
    const control_acc = $('#control-acc')
    const account_select = $('#account-select')
    const title_select = $('#title-select')
    const account_chart_assets_table = $('#account-chart-assets-table')
    const account_chart_liabilities_table = $('#account-chart-liabilities-table')
    const account_chart_owner_equity_table = $('#account-chart-owner-equity-table')
    const account_chart_revenue_table = $('#account-chart-revenue-table')
    const account_chart_costs_table = $('#account-chart-costs-table')
    const account_chart_other_income_table = $('#account-chart-other-income-table')
    const account_chart_other_expense_table = $('#account-chart-other-expense-table')
    const account_chart_income_summary_table = $('#account-chart-income-summary-table')
    const list_table = [
        account_chart_assets_table,
        account_chart_liabilities_table,
        account_chart_owner_equity_table,
        account_chart_revenue_table,
        account_chart_costs_table,
        account_chart_other_income_table,
        account_chart_other_expense_table,
        account_chart_income_summary_table
    ]
    let LIST_PARENT_ACC = []
    let ACCOUNT_CHART_LIST = []

    const drag_row = dragula(
        Array.prototype.map.call(list_table, function(item) {
            return item.find('tbody')[0]
        }),
        {
            moves: function (el, container, handle) {
                return handle.classList.contains('drag-handle');
            }
        }
    );

    drag_row.on('dragend', function() {
        setTimeout(
            function () {
                if (confirm('Bạn có chắc chắn muốn thay đổi vị trí không?')) {
                    console.log('Vị trí đã được thay đổi.')
                }
                else {
                    InitTable(list_table[0], {}, null, '', true)
                }
            }, 500
        );
    });

    function InitTable(dtb=null, data_param={}, url=null, method = 'GET', reload=false) {
        dtb.DataTable().clear().destroy()
        if (dtb && url && method && !reload) {
            dtb.DataTableDefault({
                useDataServer: false,
                rowIdx: true,
                reloadCurrency: true,
                scrollY: '70vh',
                scrollX: true,
                scrollCollapse: true,
                paging: false,
                ajax: {
                    data: data_param,
                    url: url,
                    type: method,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            LIST_PARENT_ACC = []
                            for (let i = 0; i < resp.data['account_chart_list'].length; i++) {
                                let row = resp.data['account_chart_list'][i]
                                if (row?.['is_account'] === false) {
                                    LIST_PARENT_ACC.push({
                                        'id': row?.['id'],
                                        'code': row?.['acc_code'],
                                        'name': row?.['acc_name']
                                    })
                                }
                            }
                            ACCOUNT_CHART_LIST = resp.data['account_chart_list']
                            return resp.data['account_chart_list'] ? resp.data['account_chart_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'wrap-text w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            let expand_btn = `<button data-acc-id="${row?.['id']}" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-sm btn-collapse-acc-sub-list">
                                <span class="icon"><i class="bi bi-caret-down-fill"></i></span>
                            </button>`
                            return `
                                <span data-root-id="${row?.['parent_account'] ? row?.['parent_account'] : ''}" class="text-primary fw-bold ${row?.['parent_account'] ? `ml-${(row?.['level'] - 1) * 3}` : ''}">${row?.['acc_code'] ? row?.['acc_code'] : ''}</span>
                                ${row?.['has_child'] ? expand_btn : ''}
                            `;
                        }
                    },
                    {
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            return `<span class="text-primary">${row?.['acc_name'] ? row?.['acc_name'] : ''}</span>`
                        }
                    },
                    {
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            return `<span class="text-primary">${row?.['foreign_acc_name'] ? row?.['foreign_acc_name'] : ''}</span>`
                        }
                    },
                    {
                        className: 'wrap-text text-right w-15',
                        render: (data, type, row) => {
                            return `<div class="form-check form-switch">
                <input disabled ${row?.['acc_status'] ? 'checked' : ''} type="checkbox" class="form-check-input active-account">
                <label class="form-check-label" for="customSwitch1"></label>
            </div>`
                        }
                    },
                    {
                        className: 'wrap-text text-right w-10',
                        render: (data, type, row) => {
                            // let drag_btn = `<a class="btn btn-icon btn-flush-secondary btn-rounded flush-soft-hover drag-handle">
                            //    <span class="btn-icon-wrap drag-handle"><span class="feather-icon text-secondary drag-handle">
                            //        <i class="fas fa-grip-horizontal drag-handle"></i>
                            //    </span></span>
                            // </a>`
                            let drag_btn = ''
                            return `${row?.['parent_account'] ? drag_btn : ''}
                                    <a class="btn btn-icon btn-flush-primary btn-rounded flush-soft-hover btn-detail-account"
                                       data-bs-toggle="modal"
                                       data-bs-target="#modal-account-detail"
                                       data-id="${row?.['id']}"
                                       data-acc-code="${row?.['acc_code']}"
                                       data-acc-name="${row?.['acc_name']}"
                                       data-foreign-acc-name="${row?.['foreign_acc_name']}"
                                       data-acc-status="${row?.['acc_status']}"
                                       data-acc-type="${row?.['acc_type']}"
                                       data-parent-account="${row?.['parent_account']}"
                                       data-level="${row?.['level']}"
                                       data-is-account="${row?.['is_account']}"
                                       data-control-account="${row?.['control_account']}"
                                       data-is-all-currency="${row?.['is_all_currency']}"
                                       data-currency-mapped-id="${row?.['currency_mapped']?.['id']}"
                                       data-currency-mapped-abbreviation="${row?.['currency_mapped']?.['abbreviation']}"
                                       data-currency-mapped-title="${row?.['currency_mapped']?.['title']}"
                                >
                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                                </a>
                            `
                        }
                    },
                ],
            });
        }
        if (dtb && reload) {
            dtb.DataTableDefault({
                useDataServer: false,
                rowIdx: true,
                reloadCurrency: true,
                scrollY: '70vh',
                scrollX: true,
                scrollCollapse: true,
                paging: false,
                data: ACCOUNT_CHART_LIST,
                columns: [
                    {
                        className: 'wrap-text w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            let expand_btn = `<button data-acc-id="${row?.['id']}" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-sm btn-collapse-acc-sub-list">
                    <span class="icon"><i class="bi bi-caret-down-fill"></i></span>
                </button>`
                            return `
                    <span data-root-id="${row?.['parent_account'] ? row?.['parent_account'] : ''}" class="text-primary ${row?.['parent_account'] ? `ml-${(row?.['level'] - 1) * 2}` : 'fw-bold'}">${row?.['acc_code'] ? row?.['acc_code'] : ''}</span>
                    ${row?.['parent_account'] ? '' : expand_btn}
                `;
                        }
                    },
                    {
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            return `<span class="text-primary">${row?.['acc_name'] ? row?.['acc_name'] : ''}</span>`
                        }
                    },
                    {
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            return `<span class="text-primary">${row?.['foreign_acc_name'] ? row?.['foreign_acc_name'] : ''}</span>`
                        }
                    },
                    {
                        className: 'wrap-text text-right w-15',
                        render: (data, type, row) => {
                            return `<div class="form-check form-switch">
                <input disabled ${row?.['acc_status'] ? 'checked' : ''} type="checkbox" class="form-check-input active-account">
                <label class="form-check-label" for="customSwitch1"></label>
            </div>`
                        }
                    },
                    {
                        className: 'wrap-text text-right w-10',
                        render: (data, type, row) => {
                            let drag_btn = `<a class="btn btn-icon btn-flush-secondary btn-rounded flush-soft-hover drag-handle">
                               <span class="btn-icon-wrap drag-handle"><span class="feather-icon text-secondary drag-handle">
                                   <i class="fas fa-grip-horizontal drag-handle"></i>
                               </span></span>
                            </a>`
                            return `${row?.['parent_account'] ? drag_btn : ''}
                                        <a class="btn btn-icon btn-flush-primary btn-rounded flush-soft-hover btn-detail-account"
                                       data-bs-toggle="modal"
                                       data-bs-target="#modal-account-detail"
                                       data-id="${row?.['id']}"
                                       data-acc-code="${row?.['acc_code']}"
                                       data-acc-name="${row?.['acc_name']}"
                                       data-foreign-acc-name="${row?.['foreign_acc_name']}"
                                       data-acc-status="${row?.['acc_status']}"
                                       data-acc-type="${row?.['acc_type']}"
                                       data-parent-account="${row?.['parent_account']}"
                                       data-level="${row?.['level']}"
                                       data-is-account="${row?.['is_account']}"
                                       data-control-account="${row?.['control_account']}"
                                       data-is-all-currency="${row?.['is_all_currency']}"
                                       data-currency-mapped-id="${row?.['currency_mapped']?.['id']}"
                                       data-currency-mapped-abbreviation="${row?.['currency_mapped']?.['abbreviation']}"
                                       data-currency-mapped-title="${row?.['currency_mapped']?.['title']}"
                                >
                                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                                </a>
                            `
                        }
                    },
                ],
            });
        }
    }

    function LoadParentAccount(ele, data) {
        ele.empty()
        ele.initSelect2({
            allowClear: true,
            data: LIST_PARENT_ACC,
            keyId: 'id',
            keyText: 'code',
        })
        ele.val(data?.['id']).trigger('change')
    }

    function LoadCurrency(ele, data) {
        ele.initSelect2({
            allowClear: true,
            placeholder: trans_script.attr('data-trans-all'),
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'currency_list',
            keyId: 'id',
            keyText: 'title',
        })
    }

    InitTable(list_table[0], {'acc_type': 1}, url_script.attr('data-url-get-account-list'), 'GET')

    $('.list-group-item').on('click', function () {
        let index = parseInt($(this).attr('id').split('-')[1])
        InitTable(list_table[index-1], {'acc_type': index}, url_script.attr('data-url-get-account-list'), 'GET')
    })

    $(document).on('click', '.btn-collapse-acc-sub-list', function () {
        $(`span[data-root-id="${$(this).attr('data-acc-id')}"]`).closest('tr').toggleClass('hidden')
        if ($(this).find('i').attr('class') === 'bi bi-caret-up-fill') {
            $(this).find('i').attr('class', 'bi bi-caret-down-fill')
        } else {
            $(this).find('i').attr('class', 'bi bi-caret-up-fill')
        }
    })

    $(document).on('click', '.btn-detail-account', function () {
        let id = $(this).attr('data-id')
        let acc_code = $(this).attr('data-acc-code')
        let acc_name = $(this).attr('data-acc-name')
        let foreign_acc_name = $(this).attr('data-foreign-acc-name')
        let acc_status = $(this).attr('data-acc-status')
        let acc_type = $(this).attr('data-acc-type')
        let parent_account = $(this).attr('data-parent-account')
        let level = $(this).attr('data-level')
        let is_account = $(this).attr('data-is-account')
        let control_account = $(this).attr('data-control-account')
        let is_all_currency = $(this).attr('data-is-all-currency')
        let currency_mapped = is_all_currency === 'false' ? {
            'id': $(this).attr('data-currency-mapped-id'),
            'abbreviation': $(this).attr('data-currency-mapped-abbreviation'),
            'title': $(this).attr('data-currency-mapped-title'),
        } : null

        if (is_account === 'true') {
            account_select.prop('checked', true)
            control_acc.prop('disabled', false).prop('checked', control_account === 'true')
        } else {
            title_select.prop('checked', true)
            control_acc.prop('disabled', true).prop('checked', false)
        }

        $('#gl-account').val(acc_code)
        $('#acc-name').val(acc_name)
        $('#foreign-acc-name').val(foreign_acc_name)
        LoadParentAccount(
            $('#acc-parent'),
            LIST_PARENT_ACC.filter(item => item?.['id'] === (parent_account !== 'null' ? parent_account : null))[0]
        )
        LoadCurrency($('#acc-currency'), currency_mapped)
    })

    control_acc.on('change', function () {
        account_select.prop('checked', $(this).prop('checked'))
        title_select.prop('checked', !$(this).prop('checked'))
    })

    title_select.on('change', function () {
        control_acc.prop('checked', !$(this).prop('checked')).prop('disabled', $(this).prop('checked'))
    })

    account_select.on('change', function () {
        control_acc.prop('disabled', !$(this).prop('checked'))
    })
// })