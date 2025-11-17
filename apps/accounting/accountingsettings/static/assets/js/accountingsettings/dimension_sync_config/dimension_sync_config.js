$(document).ready(function () {
    const $dimensionSyncConfigDataTable = $('#datatable-config')
    const $dimensionSelect = $('.dimension-select')
    const $addConfigForm = $('#form-add-config')
    const $updateConfigForm = $('#form-update-config')

    // Initialize DataTable
    let dimensionConfigTableInstance = $dimensionSyncConfigDataTable.DataTableDefault({
        reloadCurrency: true,
        scrollCollapse: true,
        // data: [{}],
        useDataServer: true,
        ajax: {
            url: $dimensionSyncConfigDataTable.attr('data-url'),
            type: "GET",
            dataSrc: 'data.dimension_sync_config_list',
        },
        columns: [
            {
                targets: 0,
                render: (data, type, row) => {
                    const dimensionCode = row?.dimension?.code
                    return `<span>${dimensionCode || ''}</span>`;
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    const dimensionTitle = row?.dimension?.title
                    return `<span>${dimensionTitle || ''}</span>`;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    const applicationTitle = row?.related_app?.title
                    return `<span>${applicationTitle || ''}</span>`;
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    const badges = [];

                if (row.sync_on_save) {
                    badges.push('<span class="badge bg-success me-1">Save</span>');
                }
                if (row.sync_on_delete) {
                    badges.push('<span class="badge bg-danger me-1">Delete</span>');
                }

                // Join all badges together or show a fallback if none are true
                return badges.length ? badges.join(' ') : '<span class="text-muted">None</span>';
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    const records = row?.record_number || 0
                    return records
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    return `
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-primary btn-edit" 
                                    
                                    data-id="${row.id}" 
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-update-config" 
                                    title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-delete" 
                                    data-id="${row.id}" 
                                    data-bs-toggle="tooltip" 
                                    title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
    });

    $(document).on('change.select2', '.dimension-select', function (e) {
        const dimensionData = SelectDDControl.get_data_from_idx($(e.currentTarget), $(e.currentTarget).val())

        const $form = $(e.currentTarget).closest('form')

        $form.find('.dimension-code').val(dimensionData.code)
        $form.find('.dimension-name').val(dimensionData.title)

    })

    $dimensionSyncConfigDataTable.on('click', '.btn-edit', function (e) {
        const $ele = $(e.currentTarget)
        const $row = $ele.closest('tr')
        const rowData = dimensionConfigTableInstance.row($row).data()
        const hasRecords = rowData.record_number > 0

        const $dimensionSelect = $('#dimension-select-update')
        const $relatedAppSelect = $('#related-app-update')

        $updateConfigForm.data('config-id', rowData.id)

        if ($dimensionSelect.data('select2')) {
            $dimensionSelect.empty()
        }

        if ($relatedAppSelect.data('select2')) {
            $relatedAppSelect.empty()
        }

        if (rowData.dimension) {
            $dimensionSelect.initSelect2({
                data: rowData.dimension,
            })

            $('#dimension-code-update').val(rowData.dimension.code || '')
            $('#dimension-name-update').val(rowData.dimension.title || '')

            $dimensionSelect.prop('disabled', hasRecords)
        }

        if(rowData.related_app){
            $relatedAppSelect.initSelect2({
                data: rowData.related_app,
            })

            $relatedAppSelect.prop('disabled', hasRecords)
        }

        // Set sync option checkboxes
        $updateConfigForm.find('#sync_on_save').prop('checked', rowData.sync_on_save || false)
        $updateConfigForm.find('#sync_on_delete').prop('checked', rowData.sync_on_delete || false)
    })

    new SetupFormSubmit($addConfigForm).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        if (dimensionConfigTableInstance) {
                            dimensionConfigTableInstance.ajax.reload(null, false);
                        }

                        $(form)[0].reset()
                        $(form).find('.select2').val('').trigger('change');
                        const $modal = $(form).closest('.modal');
                        if ($modal.length) {
                            $modal.modal('hide');
                        }
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    new SetupFormSubmit($updateConfigForm).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            const configId = $updateConfigForm.data('config-id')
            $.fn.callAjax2({
                'url': frm.dataUrl.format_url_with_uuid(configId),
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Updated Successfully"}, 'success')
                        if (dimensionConfigTableInstance) {
                            dimensionConfigTableInstance.ajax.reload(null, false);
                        }
                        const $modal = $(form).closest('.modal');
                        if ($modal.length) {
                            $modal.modal('hide');
                        }
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })
});