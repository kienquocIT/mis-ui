$(document).ready(function() {
    const $je_posting_group_table = $('#je-posting-group-table')
    const $modal_add_posting_group = $('#modal-add-posting-group')
    const $pg_group_type = $('#pg-group-type')
    const $pg_code = $('#pg-code')
    const $pg_title = $('#pg-title')
    const $pg_assign_to = $('#pg-assign-to')
    const $is_active = $('#is-active')

    function LoadJEPostingGroupTable() {
        $je_posting_group_table.DataTable().clear().destroy()
        $je_posting_group_table.DataTableDefault({
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
                        let data_list = resp.data['je_posting_group'] ? resp.data['je_posting_group'] : []
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
                        return `<span>${row?.['posting_group_type_parsed'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<span class="bflow-mirrow-badge border-0 fw-bold bg-blue-light-4">${row?.['code'] || ''}</span> - <span>${row?.['title'] || ''}</span>`;
                    }
                },
                {
                    className: 'w-40',
                    render: (data, type, row) => {
                        return `<div class="assignment-data"></div>`;
                    }
                },
                {
                    className: 'w-10 text-right',
                    render: (data, type, row) => {
                        return `
                            <div class="d-flex align-items-center justify-content-end">
                                <script type="application/json" class="data-row">${JSON.stringify(row || {})}</script>
                                <button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-primary edit-row" data-bs-toggle="modal" data-bs-target="#modal-add-posting-group">
                                    <span class="icon"><i class="fa-solid fa-pen-to-square"></i></span>
                                </button>
                                <button type="button" class="btn-icon btn-rounded flush-soft-hover btn btn-flush-danger delete-row" data-id="${row?.['id']}">
                                    <span class="icon"><i class="fa-regular fa-trash-can"></i></span>
                                </button>
                            </div>`;
                    }
                },
            ],
            rowGroup: {
                dataSrc: 'posting_group_type_parsed',
                startRender: function (rows, posting_group_type_parsed) {
                    return $('<tr class="group-header">').append(`<td colspan="100%"><h5><span class="text-muted">${posting_group_type_parsed}</span></h5></td>`);
                }
            },
            columnDefs: [
                {
                    "visible": false,
                    "targets": [1]
                }
            ],
            initComplete: function () {
                $je_posting_group_table.find('tbody tr').each(function (index, ele) {
                    let rowData = $je_posting_group_table.DataTable().row(ele).data();
                    if (rowData && !rowData['is_active']) {
                        $(ele).addClass('bg-secondary-light-5');
                    }
                    for (let i = 0; i < rowData?.['assignment_data_list'].length; i++) {
                        let item = rowData?.['assignment_data_list'][i]
                        $(ele).find('.assignment-data').append(`<span class="bflow-mirrow-badge mb-1 mr-1"><span class="fw-bold">${item?.['code']}</span> - ${item?.['title']}</span><br>`)
                    }
                })
            }
        });
    }

    LoadJEPostingGroupTable()

    function LoadJEGroupType() {
        let data_option = JSON.parse($('#je_group_type').text() || '{}')?.['je_group_type'] || []
        let data_option_html = '<option></option>'
        for (let i=0; i < data_option.length; i++) {
            data_option_html += `<option value="${data_option[i][0]}">${data_option[i][0]} - ${data_option[i][1]}</option>`
        }
        $pg_group_type.html(data_option_html)
    }

    LoadJEGroupType()

    $pg_group_type.on('change', function () {
        if ($(this).val() === 'ITEM_GROUP') {
            UsualLoadPageFunction.LoadProductType({
                element: $pg_assign_to,
                data_url: $('#script-url').attr('data-url-product-type'),
            })
        } else if ($(this).val() === 'PARTNER_GROUP') {
            UsualLoadPageFunction.LoadAccountType({
                element: $pg_assign_to,
                data_url: $('#script-url').attr('data-url-account-type'),
            })
        }
    })

    new SetupFormSubmit($('#form-add-posting-group')).validate({
        rules: {
            code: {
                required: true,
            },
            title: {
                required: true,
            },
            posting_group_type: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let is_update = $modal_add_posting_group.attr('data-is-update') === 'true'
            let row_id = $modal_add_posting_group.attr('data-row-id')
            let frm = new SetupFormSubmit($(form));
            let data = is_update ? {
                'title': $pg_title.val(),
                'assignment_data_list': $pg_assign_to.val(),
                'is_active': $is_active.prop('checked')
            } : {
                'code': $pg_code.val(),
                'title': $pg_title.val(),
                'posting_group_type': $pg_group_type.val(),
                'assignment_data_list': $pg_assign_to.val(),
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
        $pg_code.val(data?.['code']).prop('readonly', true)
        $pg_title.val(data?.['title'])
        $pg_group_type.val(data?.['posting_group_type'])
        $pg_group_type.trigger('change').prop('disabled', true)
        $modal_add_posting_group.attr('data-is-update', 'true')
        $modal_add_posting_group.attr('data-row-id', data?.['id'])
        if (data?.['posting_group_type'] === 'ITEM_GROUP') {
            UsualLoadPageFunction.LoadProductType({
                element: $pg_assign_to,
                data_url: $('#script-url').attr('data-url-product-type'),
                data: data?.['assignment_data_list'] || []
            })
        }
        else if (data?.['posting_group_type'] === 'PARTNER_GROUP') {
            UsualLoadPageFunction.LoadAccountType({
                element: $pg_assign_to,
                data_url: $('#script-url').attr('data-url-account-type'),
                data: data?.['assignment_data_list'] || []
            })
        }
        $is_active.prop('checked', data?.['is_active'])
    })

    $('#btn-create').on('click', function () {
        $pg_code.prop('readonly', false)
        $pg_group_type.prop('disabled', false)
        $modal_add_posting_group.attr('data-is-update', 'false')
        $modal_add_posting_group.attr('data-row-id', '')
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