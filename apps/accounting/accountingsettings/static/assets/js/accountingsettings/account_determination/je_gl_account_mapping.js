$(document).ready(function() {
    const $modal_add_gl_account_mapping = $('#modal-add-gl-account-mapping')
    const $je_gl_account_mapping_table = $('#je-gl-account-mapping-table')
    const $gl_posting_group_type = $('#gl-posting-group-type')
    const $gl_posting_group = $('#gl-posting-group')
    const $gl_role_key = $('#gl-role-key')
    const $gl_account = $('#gl-account')
    const $is_active = $('#is-active')

    function LoadJEAccountMappingTable() {
        $je_gl_account_mapping_table.DataTable().clear().destroy()
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
                        return `<span class="bflow-mirrow-badge border-0 fw-bold bg-blue-light-4">${row?.['posting_group_data']?.['code'] || ''}</span> - <span>${row?.['posting_group_data']?.['title'] || ''}</span>`;
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
                        return `
                            <div class="d-flex align-items-center justify-content-end">
                                <script type="application/json" class="data-row">${JSON.stringify(row || {})}</script>
                                <button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-primary edit-row" data-bs-toggle="modal" data-bs-target="#modal-add-gl-account-mapping">
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
            initComplete: function () {
                $je_gl_account_mapping_table.find('tbody tr').each(function (index, ele) {
                    let rowData = $je_gl_account_mapping_table.DataTable().row(ele).data();
                    if (rowData && !rowData['is_active']) {
                        $(ele).addClass('bg-secondary-light-5');
                    }
                    else if (rowData && Object.keys(rowData['account_data']).length === 0) {
                        $(ele).addClass('bg-warning-light-5');
                    }
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

    function LoadJEGroupType() {
        let data_option = JSON.parse($('#je_group_type').text() || '{}')?.['je_group_type'] || []
        let data_option_html = '<option></option>'
        for (let i=0; i < data_option.length; i++) {
            data_option_html += `<option value="${data_option[i][0]}">${data_option[i][0]} - ${data_option[i][1]}</option>`
        }
        $gl_posting_group_type.html(data_option_html)
    }

    LoadJEGroupType()

    $gl_posting_group_type.on('change', function () {
        $gl_posting_group.empty()
        $gl_role_key.empty()
        LoadPostingGroup(null, $(this).val())
    })

    function LoadPostingGroup(data, gl_posting_group_type) {
        $gl_posting_group.initSelect2({
            ajax: {
                url: `${$gl_posting_group.attr('data-url')}?posting_group_type=${gl_posting_group_type}&is_active=1`,
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
            $gl_role_key.empty()
            LoadRoleKey(null, $gl_posting_group.val())
        })
    }

    LoadPostingGroup()

    function LoadRoleKey(data, gl_posting_group_id) {
        $gl_role_key.initSelect2({
            ajax: {
                url: `${$gl_role_key.attr('data-url')}?posting_group_id=${gl_posting_group_id}`,
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

    UsualLoadPageAccountingFunction.LoadAccountingAccount({
        element: $gl_account,
        data_params: {'is_account': true},
        apply_default_on_change: false
    });

    new SetupFormSubmit($('#form-add-gl-account-mapping')).validate({
        rules: {
            posting_group: {
                required: true,
            },
            role_key: {
                required: true,
            },
            account: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let is_update = $modal_add_gl_account_mapping.attr('data-is-update') === 'true'
            let row_id = $modal_add_gl_account_mapping.attr('data-row-id')
            let frm = new SetupFormSubmit($(form));
            let data = is_update ? {
                'account': $gl_account.val(),
                'is_active': $is_active.prop('checked')
            } : {
                'posting_group_data': $gl_posting_group.val(),
                'role_key': $gl_role_key.val(),
                'account': $gl_account.val(),
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
        $gl_posting_group_type.val(data?.['posting_group_data']?.['posting_group_type'])
        $gl_posting_group_type.trigger('change').prop('disabled', true)
        LoadPostingGroup(data?.['posting_group_data'], $gl_posting_group_type.val())
        $gl_posting_group.trigger('change').prop('disabled', true)
        LoadRoleKey({'role_key': data?.['role_key'], 'description': data?.['role_key_parsed']}, $gl_posting_group.val())
        $gl_role_key.trigger('change').prop('disabled', true)
        $gl_account.empty()
        UsualLoadPageAccountingFunction.LoadAccountingAccount({
            element: $gl_account,
            data: data?.['account_data'],
            data_params: {'is_account': true},
            apply_default_on_change: false
        });
        $modal_add_gl_account_mapping.attr('data-is-update', 'true')
        $modal_add_gl_account_mapping.attr('data-row-id', data?.['id'])
        $is_active.prop('checked', data?.['is_active'])
    })

    $('#btn-create').on('click', function () {
        $gl_posting_group_type.prop('disabled', false)
        $gl_posting_group.empty().prop('disabled', false)
        $gl_role_key.empty().prop('disabled', false)
        $modal_add_gl_account_mapping.attr('data-is-update', 'false')
        $modal_add_gl_account_mapping.attr('data-row-id', '')
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