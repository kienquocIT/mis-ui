$(document).ready(function() {
    const $je_posting_rule_table = $('#je-posting-rule-table')

    const $modal_add_posting_rule = $('#modal-add-posting-rule')
    const $document_type = $('#document-type')
    const $description = $('#description')
    const $side = $('#side')
    const $rule_level = $('#rule-level')
    const $priority = $('#priority')
    const $amount_source = $('#amount-source')
    const $account_source_type = $('#account-source-type')
    const $fixed_account = $('#fixed-account')
    const $global_role_key = $('#global-role-key')
    const $lookup_posting_group_type = $('#lookup-posting-group-type')
    const $lookup_posting_group = $('#lookup-posting-group')
    const $lookup_role_key = $('#lookup-role-key')
    const $is_active = $('#is-active')

    function LoadJEPostingRuleTable() {
        $je_posting_rule_table.DataTable().clear().destroy()
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
                type: 'GET',
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
                        return `<span title="${row?.['rule_level_parsed'] || ''}">${row?.['rule_level'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span title="${row?.['amount_source_parsed'] || ''}">${row?.['amount_source'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="${row?.['side'] === 'DEBIT' ? 'text-danger' : 'text-success'}" title="${row?.['side_parsed'] || ''}">${row?.['side_parsed'] || ''}</span>`;
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
                        return `
                            <div class="d-flex align-items-center justify-content-end">
                                <script type="application/json" class="data-row">${JSON.stringify(row || {})}</script>
<!--                                <button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-primary edit-row" data-bs-toggle="modal" data-bs-target="#modal-add-posting-rule">-->
<!--                                    <span class="icon"><i class="fa-solid fa-pen-to-square"></i></span>-->
<!--                                </button>-->
                                <button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-danger delete-row" data-id="${row?.['id']}">
                                    <span class="icon"><i class="fa-regular fa-trash-can"></i></span>
                                </button>
                            </div>
                        `;
                    }
                },
            ],
            rowGroup: {
                dataSrc: 'document_type_app_code_parsed'
            },
            initComplete: function () {
                $je_posting_rule_table.find('tbody tr').each(function (index, ele) {
                    let rowData = $je_posting_rule_table.DataTable().row(ele).data();
                    if (rowData && !rowData['is_active']) {
                        $(ele).addClass('bg-secondary-light-5');
                    }
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

    function LoadJEDocumentType() {
        let data_option = JSON.parse($('#je_document_type').text() || '{}')?.['je_document_type'] || []
        let data_option_html = '<option></option>'
        for (let i=0; i < data_option.length; i++) {
            data_option_html += `<option value="${data_option[i][0]}">${data_option[i][1]} - ${data_option[i][2]}</option>`
        }
        $document_type.html(data_option_html)
    }

    LoadJEDocumentType()

    $document_type.on('change', function() {
        $amount_source.empty()
        LoadJEAmountSource(null, $document_type.val())
    })

    function LoadJEAmountSource(data, document_type_app_code) {
        $amount_source.initSelect2({
            ajax: {
                url: `${$amount_source.attr('data-url')}?document_type_app_code=${document_type_app_code}`,
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'je_amount_source',
            keyId: 'code',
            keyText: 'description',
        })
    }

    function LoadJEGroupType() {
        let data_option = JSON.parse($('#je_group_type').text() || '{}')?.['je_group_type'] || []
        let data_option_html = '<option></option>'
        for (let i=0; i < data_option.length; i++) {
            data_option_html += `<option value="${data_option[i][0]}">${data_option[i][0]} - ${data_option[i][1]}</option>`
        }
        $lookup_posting_group_type.html(data_option_html)
    }

    LoadJEGroupType()

    $account_source_type.on('change', function () {
        if ($(this).val() === 'FIXED') {
            $('.fixed-item').prop('hidden', false)
            $('.lookup-item').prop('hidden', true)
        }
        else if ($(this).val() === 'LOOKUP') {
            $('.fixed-item').prop('hidden', true)
            $('.lookup-item').prop('hidden', false)
        }
        else if ($(this).val() === 'CONDITIONAL') {

        }
    })

    $lookup_posting_group_type.on('change', function () {
        $lookup_posting_group.empty()
        $lookup_role_key.empty()
        LoadPostingGroup(null, $(this).val())
    })

    function LoadPostingGroup(data, gl_posting_group_type) {
        $lookup_posting_group.initSelect2({
            ajax: {
                url: `${$lookup_posting_group.attr('data-url')}?posting_group_type=${gl_posting_group_type}&is_active=1`,
                method: 'GET',
            },
            templateResult: function (data) {
                return $(`<div class="d-flex">${data.data?.['code']} - ${data.data?.['title']}</div>`);
            },
            data: (data ? data : null),
            keyResp: 'je_posting_group',
            keyId: 'id',
            keyText: 'code',
        }).on('change', function () {
            $lookup_role_key.empty()
            LoadRoleKey(null, $lookup_posting_group.val())
        })
    }

    LoadPostingGroup()

    function LoadRoleKey(data, gl_posting_group_id) {
        $lookup_role_key.initSelect2({
            ajax: {
                url: `${$lookup_role_key.attr('data-url')}?posting_group_id=${gl_posting_group_id}`,
                method: 'GET',
            },
            templateResult: function (data) {
                return $(`<div class="d-flex">${data.data?.['role_key']} - ${data.data?.['description']}</div>`);
            },
            data: (data ? data : null),
            keyResp: 'je_posting_group_role_key',
            keyId: 'role_key',
            keyText: 'role_key',
        })
    }

    function LoadRoleKeyGlobal(data) {
        $global_role_key.initSelect2({
            ajax: {
                url: $global_role_key.attr('data-url'),
                method: 'GET',
            },
            templateResult: function (data) {
                return $(`<div class="d-flex">${data.data?.['role_key']} - ${data.data?.['description']}</div>`);
            },
            data: (data ? data : null),
            keyResp: 'je_posting_group_role_key',
            keyId: 'role_key',
            keyText: 'role_key',
        })
    }

    LoadRoleKey()

    LoadRoleKeyGlobal()

    UsualLoadPageAccountingFunction.LoadAccountingAccount({
        element: $fixed_account,
        data_params: {'is_account': true},
        apply_default_on_change: false
    });

    new SetupFormSubmit($('#form-add-posting-rule')).validate({
        rules: {
            je_document_type: {
                required: true,
            },
            rule_level: {
                required: true,
            },
            priority: {
                required: true,
            },
        },
        submitHandler: function (form) {
            let is_update = $modal_add_posting_rule.attr('data-is-update') === 'true'
            let row_id = $modal_add_posting_rule.attr('data-row-id')
            let frm = new SetupFormSubmit($(form));
            let data = is_update ? {
                'description': $fixed_account.val(),
                'is_active': $is_active.prop('checked')
            } : {
                'je_document_type': $document_type.val(),
                'description': $description.val(),
                'side': $side.val(),
                'rule_level': $rule_level.val(),
                'priority': $priority.val(),
                'amount_source': $amount_source.val(),
                'fixed_account': $fixed_account.val(),
                'role_key': $global_role_key.val(),
                'account_source_type': $account_source_type.val(),
                'lookup_data': {
                    'posting_group': $lookup_posting_group.val(),
                    'role_key': $lookup_role_key.val(),
                },
                'is_active': $is_active.prop('checked')
            }
            $.fn.callAjax2({
                url: is_update ? $('#script-url').attr('data-url-detail').replace('/0', `/${row_id}`) : frm.dataUrl,
                method: is_update ? 'PUT' : 'POST',
                data: data,
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: $.fn.transEle.attr('data-success')}, 'success');
                    location.reload()
                }
            }, (errs) => {
                $.fn.switcherResp(errs);
            })
        }
    });

    $(document).on('click', '.edit-row', function () {
        let data = JSON.parse($(this).closest('div').find('.data-row').text() || '{}')
        $is_active.prop('checked', data?.['is_active'])
    })

    $('#btn-create').on('click', function () {
        $modal_add_posting_rule.attr('data-is-update', 'false')
        $modal_add_posting_rule.attr('data-row-id', '')
    })

    $(document).on('click', '.delete-row', function () {
        let row_id = $(this).attr('data-id')
        Swal.fire({
            html:
            `<div class="align-items-center">
                <h5 class="text-danger">${$.fn.gettext('Are you sure to delete?')}</h5>
            </div>`,
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-danger',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container: 'swal2-has-bg',
                htmlContainer: 'bg-transparent',
                actions: 'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: $.fn.gettext('Delete'),
            cancelButtonText: $.fn.gettext('Cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let data = {}
                $.fn.callAjax2({
                    url: $('#script-url').attr('data-url-detail').replace('/0', `/${row_id}`),
                    method: 'DELETE',
                    data: data,
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $.fn.transEle.attr('data-success')}, 'success');
                        location.reload()
                    }
                }, (errs) => {
                    $.fn.switcherResp(errs);
                })
            }
        })
    })
})