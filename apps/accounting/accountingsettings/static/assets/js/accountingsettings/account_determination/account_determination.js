$(document).ready(function() {
    const $account_determination_table = $('#account-determination-table')
    const columns_cfg = [
        {
            className: 'w-5',
            'render': () => {
                return ``;
            }
        },
        {
            className: 'wrap-text',
            'render': (data, type, row) => {
                return `<span class="text-muted">${row?.['account_determination_type_convert']}</span>`;
            }
        },
        {
            className: 'w-20',
            'render': (data, type, row) => {
                return `<span class="text-muted fw-bold">${row?.['title']}</span><br><span class="text-primary">${row?.['foreign_title']}</span>`;
            }
        },
        {
            className: 'w-15',
            'render': (data, type, row) => {
                let $ele = $(UsualLoadPageAccountingFunction.default_account_select2_multiple)
                $ele.find('.row-account').prop('disabled', true);
                $ele.find('.row-account').attr('data-account-determination-sub-list', JSON.stringify(row?.['account_determination_sub_list'] || []))
                return $ele.prop('outerHTML');
            }
        },
        {
            className: 'w-25',
            'render': (data, type, row) => {
                return `<p>${row?.['description'] || ''}</p>`;
            }
        },
        {
            className: 'w-30',
            'render': (data, type, row) => {
                return `<p class="text-primary">${(row?.['example'] || '').replaceAll('. ', '.<br>')}</p>`;
            }
        },
        {
            className: 'text-right w-5',
            'render': (data, type, row) => {
                let change_btn = `<a class="btn btn-icon btn-flush-primary btn-rounded flush-soft-hover btn-xs btn-change-account">
                   <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i class="fa-solid fa-pen-to-square"></i></span></span>
                </a>`;
                let save_btn = `<button type="button" data-id="${row?.['id']}" hidden class="btn btn-custom btn-primary btn-xs btn-save-change-account">
                    <span>
                        <span class="icon"><span class="feather-icon"><i class="fa-solid fa-file-pen"></i></span></span>
                        <span>${$.fn.gettext('Save changes')}</span>
                    </span>
                </button>`;
                return row?.['can_change_account'] ? change_btn + save_btn : ''
            }
        },
    ]

    function loadAccountDeterminationTable() {
        $account_determination_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit($account_determination_table);
        $account_determination_table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            ajax: {
                url: frm.dataUrl,
                data: {},
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_list = resp.data['account_determination_list'] ? resp.data['account_determination_list'] : []
                        return data_list ? data_list : [];
                    }
                    return [];
                },
            },
            columns: columns_cfg,
            rowGroup: {
                dataSrc: 'account_determination_type_convert'
            },
            columnDefs: [
                {
                    "visible": false,
                    "targets": [1]
                }
            ],
            initComplete: function () {
                $account_determination_table.find('tbody tr .row-account').each(function () {
                    let account_determination_sub_list = $(this).attr('data-account-determination-sub-list') ? JSON.parse($(this).attr('data-account-determination-sub-list')) : []
                    UsualLoadPageAccountingFunction.LoadAccountingAccount({
                        element: $(this),
                        data: account_determination_sub_list,
                        data_url: $account_determination_table.attr('data-chart-of-account-url'),
                        data_params: {'acc_type': 1, 'is_account': true},
                        is_multiple: true
                    });
                })
            }
        });
    }

    // loadAccountDeterminationTable()

    $(document).on('change', '.row-account', function () {
        $(this).closest('tr').find('.btn-change-account').prop('hidden', true)
        $(this).closest('tr').find('.btn-save-change-account').prop('hidden', false)
        $(this).closest('tr').addClass('bg-primary-light-5')
    })

    $(document).on('click', '.btn-save-change-account', function () {
        let row_id = $(this).attr('data-id')
        let row_replace_account = $(this).closest('tr').find('.row-account').val()
        Swal.fire({
            html:
            `<div class="d-flex align-items-center">
                <div class="avatar avatar-icon avatar-soft-blue me-3"><span class="initial-wrap"><i class="fa-solid fa-repeat"></i></span></div>
                <div>
                    <h4 class="text-blue">${$account_determination_table.attr('data-trans-change-confirm')}</h4>
                    <p>${$account_determination_table.attr('data-trans-change-noti')}</p>
                </div>
            </div>`,
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-blue',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container: 'swal2-has-bg',
                htmlContainer: 'bg-transparent text-start',
                actions:'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: $.fn.gettext('Confirm'),
            cancelButtonText: $.fn.gettext('Cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let ajax_update_account_prd = $.fn.callAjax2({
                    url: $account_determination_table.attr('data-url-detail').replace('/0', `/${row_id}`),
                    data: {'replace_account_list': row_replace_account},
                    method: 'PUT'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('account_determination_list')) {
                            $.fn.notifyB({description: 'Update account determination successfully!'}, 'success');
                            return data?.['account_determination_list'];
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )

                Promise.all([ajax_update_account_prd]).then(
                    (results) => {
                        // loadAccountDeterminationTable()
                    }
                )
            }
        })
    })

    $(document).on('click', '.btn-change-account', function () {
        $(this).closest('tr').find('.row-account').prop('disabled', false)
    })
});