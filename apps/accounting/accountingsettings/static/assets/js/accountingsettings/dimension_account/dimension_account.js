$(document).ready(function () {
    const $accountSelect = $('#account-select')
    const $datatableDimension = $('#datatable-dimension-map')
    const $formAdd = $('#form-add')
    const $formUpdate = $('#form-update')
    let accID = null
    let dimensionInstance = null
    let accData = null

    $accountSelect.initSelect2({
        templateSelection: function (state) {
            if (state.data){
                return $(`
                    <span>${state.data.acc_name}</span> - <span class="badge badge-primary">${state.data.acc_code}</span>
                `);
            }
            return state.text
        },
        templateResult: function (state) {
            if (state.data) {
                return $(`
                    <span>${state.data.acc_name}</span> - <span class="badge badge-primary">${state.data.acc_code}</span>
                `);
            }
            return state.text;
        }
    })

    $accountSelect.on('change.select2', function (e) {
        accID = $(e.currentTarget).val()

        accData = SelectDDControl.get_data_from_idx($(e.currentTarget), $(e.currentTarget).val())

        if (!accID) return; // Exit if accID is null/empty

        if (!dimensionInstance) {
            // Initialize DataTable only when accID is available
            dimensionInstance = $datatableDimension.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: $datatableDimension.attr('data-url').format_url_with_uuid(accID),
                    type: "GET",
                    dataSrc: 'data.dimension_list_for_accounting_account.dimension_map_data',
                },
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            const title = row?.title
                            return `<span>${title || ''}</span>`;
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            if (row?.account_dimension_map) {
                                const status = row.account_dimension_map.status
                                const statusText = row.account_dimension_map.status_text
                                const badgeClass = status === 1 ? 'badge-soft-warning' : 'badge-soft-success'
                                return `<span class="badge ${badgeClass}">${statusText}</span>`
                            } else {
                                // If no mapping exists, show Not Allowed
                                return `<span class="badge badge-secondary">Not Allowed</span>`
                            }
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            if(row?.account_dimension_map){
                                return `<button type="button" class="btn btn-outline-primary btn-edit"
                                            data-id="${row.id}" 
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-update-dimension-acc-map" 
                                            title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>`
                            } else {
                                return `<button type="button" class="btn btn-outline-primary btn-add"
                                            data-id="${row.id}" 
                                            data-bs-toggle="modal"
                                            data-bs-target="#modal-add-dimension-acc-map" 
                                            title="Edit">
                                        <i class="fas fa-add"></i>
                                    </button>`
                            }
                        }
                    },
                ]
            })
        } else {
            // Update URL and reload if DataTable already exists
            dimensionInstance.ajax.url($datatableDimension.attr('data-url').format_url_with_uuid(accID))
            dimensionInstance.ajax.reload();
        }
    })

    $datatableDimension.on('click', '.btn-add', function (e) {
        const $row = $(e.currentTarget).closest('tr')
        const rowData = dimensionInstance.row($row).data()
        const accountTitle = accData.acc_name || ''
        const accountCode = accData.acc_code || ''
        const dimensionId = rowData.id || ''
        const dimensionTitle = rowData.title || ''
        const dimensionCode = rowData.code || ''
        $('.account-code').val(accountCode)
        $('.account-name').val(accountTitle)
        $('.dimension-code').val(dimensionCode)
        $('.dimension-name').val(dimensionTitle)

        $formAdd.data('dimension-id', dimensionId)
    })

    $(document).on('click', '.btn-edit', function() {
        const $row = $(this).closest('tr');
        const rowData = dimensionInstance.row($row).data();

        $('#account-code-update').val(accData.acc_code);
        $('#account-name-update').val(accData.acc_name);

        $('#dimension-code-update').val(rowData.code);
        $('#dimension-name-update').val(rowData.title);

        // Set status radio button
        if (rowData.account_dimension_map.status === 0) {
            $('#status-required-update').prop('checked', true);
            $('#status-optional-update').prop('checked', false);
        } else {
            $('#status-required-update').prop('checked', false);
            $('#status-optional-update').prop('checked', true);
        }

        $formUpdate.data('account-map-id', rowData.account_dimension_map.id)
        $formUpdate.data('dimension-id', rowData.id)
    });

    new SetupFormSubmit($formAdd).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            const dimensionId = $formAdd.data('dimension-id')
            frm.dataForm['account_id'] = accID
            frm.dataForm['dimension_id'] = dimensionId
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        if (dimensionInstance) {
                            dimensionInstance.ajax.reload(null, false);
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

    new SetupFormSubmit($formUpdate).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            const dimensionId = $formUpdate.data('dimension-id')
            frm.dataForm['account_id'] = accID
            frm.dataForm['dimension_id'] = dimensionId
            const baseUrl = $formUpdate.attr('data-url')
            const accountMapId = $formUpdate.data('account-map-id')
            const formUrl = baseUrl.format_url_with_uuid(accountMapId)
            $.fn.callAjax2({
                'url': formUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        if (dimensionInstance) {
                            dimensionInstance.ajax.reload(null, false);
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

})