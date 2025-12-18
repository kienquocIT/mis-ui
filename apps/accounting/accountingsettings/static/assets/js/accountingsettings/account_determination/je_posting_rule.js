$(document).ready(function() {
    const $je_posting_rule_table = $('#je-posting-rule-table')
    const $document_type = $('#document-type')
    const $amount_source = $('#amount-source')
    const $modal_add_posting_rule = $('#modal-add-posting-rule')
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
                        return `
                            <div class="d-flex align-items-center justify-content-end">
                                <script type="application/json" class="data-row">${JSON.stringify(row || {})}</script>
                                <button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-primary edit-row" data-bs-toggle="modal" data-bs-target="#modal-add-posting-rule">
                                    <span class="icon"><i class="fa-solid fa-pen-to-square"></i></span>
                                </button>
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

    function LoadJEAmountSource() {
        let data_option = JSON.parse($('#je_amount_source').text() || '{}')?.['je_amount_source'] || []
        let data_option_html = '<option></option>'
        for (let i=0; i < data_option.length; i++) {
            data_option_html += `<option value="${data_option[i][0]}">${data_option[i][0]} - ${data_option[i][1]}</option>`
        }
        $amount_source.html(data_option_html)
    }

    LoadJEAmountSource()

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
            role_key: {
                required: true,
            },
            amount_source: {
                required: true,
            },
            account_source_type: {
                required: true,
            },
        },
        submitHandler: function (form) {
            let is_update = $modal_add_posting_rule.attr('data-is-update') === 'true'
            let row_id = $modal_add_posting_rule.attr('data-row-id')
            let frm = new SetupFormSubmit($(form));
            let data = is_update ? {
                'description': $gl_account.val(),
                'side': $gl_role_key.val(),
                'rule_level': $gl_role_key.val(),
                'priority': $gl_role_key.val(),
                'role_key': $gl_account.val(),
                'amount_source': $gl_account.val(),
                'account_source_type': $gl_account.val(),
                'is_active': $is_active.prop('checked')
            } : {
                'je_document_type': $gl_posting_group.val(),
                'description': $gl_posting_group.val(),
                'side': $gl_role_key.val(),
                'rule_level': $gl_role_key.val(),
                'priority': $gl_account.val(),
                'role_key': $gl_account.val(),
                'amount_source': $gl_account.val(),
                'account_source_type': $gl_account.val(),
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