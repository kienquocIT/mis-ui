$(document).ready(function() {
    let current_account_deter_id = null

    const $account_determination_table = $('#account-determination-table')
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
            columns: [
                {
                    className: 'w-5',
                    render: () => ''
                },
                {
                    render: (data, type, row) => {
                        return `<span class="text-muted">${row?.['account_determination_type_convert'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['transaction_key'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<div class="d-flex flex-column">
                                    <span class="fw-bold">${row?.['foreign_title'] || ''}</span>
                                    <span>${row?.['title'] || ''}</span>
                                </div>`;
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        return `<span>${row?.['description'] || ''}</span>`;
                    }
                },
                {
                    className: 'text-right w-10',
                    'render': (data, type, row) => {
                        let detail_btn = `
                            <a class="btn btn-icon btn-flush-primary btn-rounded flush-soft-hover btn-detail"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-detail-rule"
                                title="${$.fn.gettext('Detail')}"
                                data-id="${row?.['id']}" 
                                data-key="${row?.['transaction_key']}" 
                                data-title="${row?.['title']}"
                                data-foreign-title="${row?.['foreign_title']}">
                               <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i class="fa-solid fa-list-ul"></i></span></span>
                            </a>
                        `;
                        let sub_data = `<script class="acc_deter_sub">${JSON.stringify(row?.['account_determination_sub_list'] || [])}</script>`
                        return detail_btn + sub_data
                    }
                },
            ],
            rowGroup: {
                dataSrc: 'account_determination_type_convert'
            },
            columnDefs: [
                {
                    "visible": false,
                    "targets": [1]
                }
            ],
        });
    }

    loadAccountDeterminationTable()

    const $account_determination_sub_table = $('#account-determination-sub-table')
    function loadDetailTable(data_list=[]) {
        $account_determination_sub_table.DataTable().clear().destroy()
        $account_determination_sub_table.DataTableDefault({
            styleDom: 'hide-foot',
            useDataServer: false,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: () => ''
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['amount_source'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['role_key'] || ''}</span>`;
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
                        return `<span>${row?.['rule_level'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return row?.['is_custom'] ? `${row?.['description'] ? `<span>${row?.['description'] || ''}</span><br>` : ''}<span class="text-primary">${$.fn.gettext('Special rule')}<br>${row?.['context_description']}</span>` : `<span>${row?.['description'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-250',
                    render: (data, type, row) => {
                        let $ele = $(UsualLoadPageAccountingFunction.default_account_select2)
                        $ele.find('.row-account').prop('disabled', true);
                        return $ele.prop('outerHTML')
                    }
                },
                // {
                //     className: 'text-right w-5',
                //     'render': (data, type, row) => {
                //         let change_btn = row?.['can_change_account'] ? `<a class="btn btn-icon btn-flush-primary btn-rounded flush-soft-hover btn-change-account">
                //            <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i class="fa-solid fa-pen-to-square"></i></span></span>
                //         </a>` : ''
                //         let save_btn = row?.['can_change_account'] ? `<button type="button" data-id="${row?.['id']}" hidden class="btn btn-custom btn-primary btn-save-change-account">
                //             <span>
                //                 <span class="icon"><span class="feather-icon"><i class="fa-solid fa-file-pen"></i></span></span>
                //                 <span>${$.fn.gettext('Save changes')}</span>
                //             </span>
                //         </button>` : ''
                //         let add_special_rule_btn = !row?.['is_custom'] ? `<button type="button"
                //                 class="btn btn-icon btn-flush-primary btn-rounded flush-soft-hover btn-add-special-rule"
                //                 data-bs-toggle="modal"
                //                 data-bs-target="#modal-special-rule"
                //                 data-id-sub="${row?.['id'] || ''}"
                //                 data-key-sub="${row?.['transaction_key_sub'] || ''}"
                //                 data-des-sub="${row?.['description'] || ''}"
                //                 title="${$.fn.gettext('Add special rule')}"
                //             >
                //             <span><i class="fa-regular fa-square-plus"></i></span>
                //         </button>` : ''
                //         return change_btn + save_btn + add_special_rule_btn
                //     }
                // },
            ],
            initComplete: function () {
                $account_determination_sub_table.find('tbody tr').each(function (index, ele) {
                    UsualLoadPageAccountingFunction.LoadAccountingAccount({
                        element: $(ele).find('.row-account'),
                        data: data_list[index]?.['fixed_account_data'],
                        data_url: $account_determination_sub_table.attr('data-chart-of-account-url'),
                        data_params: {'is_account': true}
                    })
                })
            }
        });
    }

    $(document).on('change', '.row-account', function () {
        $(this).closest('tr').find('.btn-change-account').prop('hidden', true)
        $(this).closest('tr').find('.btn-save-change-account').prop('hidden', false)
        $(this).closest('tr').addClass('bg-primary-light-5')
    })

    $(document).on('click', '.btn-save-change-account', function () {
        let rule_data = $(this).closest('tr').find('.row-account').val()
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
                    url: $account_determination_table.attr('data-url-detail').replace('/0', `/${current_account_deter_id}`),
                    data: {'rule_data': rule_data},
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
                        loadAccountDeterminationTable()
                    }
                )
            }
        })
    })

    $(document).on('click', '.btn-change-account', function () {
        $(this).closest('tr').find('.row-account').prop('disabled', false)
    })

    const $modal_detail_rule = $('#modal-detail-rule');
    const $modal_special_rule = $('#modal-special-rule');
    const $rule_warehouse = $('#rule-warehouse');
    const $rule_product_type = $('#rule-product-type');
    const $rule_product = $('#rule-product');
    const $rule_account = $('#rule-account');
    const $rule_description = $('#rule-description');
    const $rule_example = $('#rule-example');
    const $btn_save_special_rule = $('#btn-save-special-rule');

    $(document).on('click', '.btn-detail', function() {
        current_account_deter_id = $(this).attr('data-id')
        $modal_detail_rule.find('.modal-title').text(`${$(this).attr('data-foreign-title')} - ${$(this).attr('data-title')} - ${$(this).attr('data-key')}`)
        let acc_deter_sub_list = JSON.parse($(this).closest('td').find('.acc_deter_sub').text() || '[]')
        loadDetailTable(acc_deter_sub_list)
    })

    $(document).on('click', '.btn-add-special-rule', function() {
        let id = $(this).attr('data-id-sub')
        let key = $(this).attr('data-key-sub')
        let description = $(this).attr('data-des-sub')

        $btn_save_special_rule.attr('data-id-sub', id)

        $('#form-special-rule')[0].reset();
        $modal_special_rule.find('select').val(null).trigger('change');

        $('#rule-transaction-key').text(key);
        $('#rule-transaction-des').text(description);

        if (!$modal_special_rule.attr('data-init')) {
            UsualLoadPageFunction.LoadWarehouse({
                allowClear: true,
                element: $rule_warehouse
            })
            UsualLoadPageFunction.LoadProductType({
                allowClear: true,
                element: $rule_product_type
            })
            UsualLoadPageFunction.LoadProduct({
                allowClear: true,
                element: $rule_product
            })
            UsualLoadPageAccountingFunction.LoadAccountingAccount({
                element: $rule_account,
                data_params: {'is_account': true}
            })
            $modal_special_rule.data('init', true);
        }
    });

    $btn_save_special_rule.on('click', function () {
        let special_rule_data = {
            'warehouse_id': $rule_warehouse.val(),
            'product_type_id': $rule_product_type.val(),
            'product_id': $rule_product.val(),
            'account_mapped': $rule_account.val(),
            'description_sub': $rule_description.val(),
            'example_sub': $rule_example.val(),
            'id_sub': $(this).attr('data-id-sub'),
        }
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
                    url: $account_determination_table.attr('data-url-detail').replace('/0', `/${current_account_deter_id}`),
                    data: {'special_rule_data': special_rule_data},
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
                        loadAccountDeterminationTable()
                        $modal_special_rule.modal('hide')
                    }
                )
            }
        })
    })
});