$(document).ready(function () {
    const $splitTemplateDataTable = $('#datatable-split-template')
    const $addForm = $('#form-add-template')
    const $updateForm = $('#form-update-template')
    const $addLineBtn = $('.btn-add-line');
    const $dimensionSelect = $('.dimension-select');
    let currDimensionId = null

    // Initialize DataTable
    let templateTableInstance = $splitTemplateDataTable.DataTableDefault({
        reloadCurrency: true,
        scrollCollapse: true,
        useDataServer: true,
        ajax: {
            url: $splitTemplateDataTable.attr('data-url'),
            type: "GET",
            dataSrc: 'data.dimension_split_template_list',
        },
        columns: [
            {
                targets: 0,
                render: (data, type, row) => {
                    const code = row?.code
                    return `<span>${code || ''}</span>`;
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    const name = row?.title
                    return `<span>${name || ''}</span>`;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    const dimensionTitle = row?.dimension?.title
                    return `<span>${dimensionTitle || ''}</span>`;
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    const lineCount = row?.line_count || 0
                    return `<span>${lineCount}</span>`;
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    return `
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-primary btn-edit" 
                                    
                                    data-id="${row.id}" 
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-update-template" 
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

    // Function to create a split line row
    function createSplitLineRow() {
        return `
            <div class="split-line-row row">
                <div class="col-3">
                    <select required class="form-select select2 dimension-val-select" data-url="${$splitTemplateDataTable.data('dimension-value-url').format_url_with_uuid(currDimensionId)}" data-keyResp="dimension_definition_with_values.values">
                    </select>
                </div>
                <div class="col-3">
                    <div class="input-group">
                        <input required type="number" class="form-control percentage-input"
                               placeholder="Percentage %" 
                            min="0" max="100" step="1" required>
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                <div class="col-4">
                    <select required class="form-select select2 account-select" data-url="${$splitTemplateDataTable.data('account-url')}" data-keyResp="chart_of_accounts_list">
                    </select>
                </div>
                <div class="col-2 text-center">
                    <button type="button" class="btn btn-danger btn-sm btn-delete-line">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    function initializeRowSelect2($row, rowData={}) {
        $row.find('.dimension-val-select').initSelect2({
            dataParams: {
                'only_leaf': 'true',
                'allow_posting': 'true',
            },
            data: rowData?.dimension_value_data,
        });
        $row.find('.account-select').initSelect2({
            data: rowData?.overwrite_account_data,
            templateSelection: function (state) {
                if (state.data){
                    return $(`
                        <span>${state.data.acc_name}</span> - <span>${state.data.acc_code}</span>
                    `);
                }
                return state.text
            },
            templateResult: function (state) {
                if (state.data) {
                    return $(`
                        <span>${state.data.acc_name}</span> - <span>${state.data.acc_code}</span>
                    `);
                }
                return state.text;
            }
        })
    }

    function updateDeleteButtonStates($container) {
        const $rows = $container.find('.split-line-row');
        const rowCount = $rows.length;

        $rows.find('.btn-delete-line')
            .prop('disabled', false)
            .removeClass('disabled');

        if (rowCount <= 2) {
            $rows.find('.btn-delete-line')
                .prop('disabled', true)
                .addClass('disabled');
        }
    }

    function calculateTotalPercentage($totalSpan) {
        let total = 0;
        const $container = $totalSpan.closest('form').find('.split-line-container')
        $container.find('.percentage-input').each(function () {
            const val = parseFloat($(this).val())
            if (!isNaN(val)) total += val
        })

        $totalSpan.text(total.toFixed(2))
    }

    function initializeSplitLines($container) {
        $container.empty();
        for (let i = 0; i < 2; i++) {
            const rowHtml = createSplitLineRow(i);
            const $newRow = $(rowHtml);
            $container.append($newRow);
            initializeRowSelect2($newRow);
        }
        updateDeleteButtonStates($container);
    }

    $(document).on('input', '.percentage-input', function () {
        const $container = $(this).closest('.split-line-container');
        const $totalSpan = $container.closest('form').find('.total-value');
        calculateTotalPercentage($totalSpan);
    })

    $addLineBtn.on('click', function() {
        const $btn = $(this)
        const rowHtml = createSplitLineRow()
        const $newRow = $(rowHtml)
        const $container = $btn.closest('form').find('.split-line-container');
        console.log($container)
        $container.append($newRow)
        initializeRowSelect2($newRow)
        updateDeleteButtonStates($container)
    });

    $(document).on('click', '.btn-delete-line', function() {
        const $row = $(this).closest('.split-line-row')
        const $container = $row.closest('form').find('.split-line-container')
        const rowCount = $container.find('.split-line-row').length
        const $totalSpan = $container.closest('form').find('.total-value')
        // Only allow deletion if there are more than 2 rows
        if (rowCount > 2) {
            $row.find('.select2').each(function() {
                if ($(this).hasClass('select2-hidden-accessible')) {
                    $(this).select2('destroy')
                }
            });
            $row.remove()
            updateDeleteButtonStates($container)
            calculateTotalPercentage($totalSpan)
        }
    });

    $dimensionSelect.on('change.select2', function(e) {
        currDimensionId = $(e.currentTarget).val();
        const $splitLineContainer = $(this).closest('form').find('.split-line-container')
        initializeSplitLines($splitLineContainer)
        $splitLineContainer.find('.dimension-val-select').initSelect2({
            dataParams: {
                'only_leaf': 'true',
                'allow_posting': 'true',
            }
        })
        $splitLineContainer.find('.account-select').initSelect2({
            templateSelection: function (state) {
                if (state.data){
                    return $(`
                        <span>${state.data.acc_name}</span> - <span>${state.data.acc_code}</span>
                    `);
                }
                return state.text
            },
            templateResult: function (state) {
                if (state.data) {
                    return $(`
                        <span>${state.data.acc_name}</span> - <span>${state.data.acc_code}</span>
                    `);
                }
                return state.text;
            }
        })
    })

    $splitTemplateDataTable.on('click', '.btn-edit', function() {
        const templateId = $(this).data('id');

        // Find the row data from the DataTable
        const rowData = templateTableInstance.data().toArray().find(row => row.id === templateId);

        if (rowData) {
            // Populate basic fields
            $('#code-update').val(rowData.code);
            $('#name-update').val(rowData.title);

            // Set the current dimension ID
            currDimensionId = rowData.dimension.id;

            $updateForm.find('.dimension-select').initSelect2({
                dataParams: {
                    'only_leaf': 'true',
                    'allow_posting': 'true',
                },
                data: rowData.dimension,
            })
        }
        const $updateSplitContainer = $updateForm.find('.split-line-container')
        $updateSplitContainer.empty();

        if (rowData.line_data && rowData.line_data.length > 0) {
            rowData.line_data.forEach((line, index) => {
                const rowHtml = createSplitLineRow()
                const $newRow = $(rowHtml)
                $updateSplitContainer.append($newRow)

                initializeRowSelect2($newRow, line)

                // Set percentage
                $newRow.find('.percentage-input').val(line.percent)
            })
            calculateTotalPercentage($('#total-value-update'))
        }
        else {
            initializeSplitLines($updateSplitContainer)
        }
        updateDeleteButtonStates($updateSplitContainer)
        $updateForm.attr('data-template-id', templateId)
    })

    function setUpFormData(frm){
        frm.dataForm['dimension_id'] = currDimensionId
        const lineData = [];
        const $container = frm.formSelected.find('.split-line-container');

        $container.find('.split-line-row').each(function(index) {
            const $row = $(this);
            const dimensionValueId = $row.find('.dimension-val-select').val();
            const accountId = $row.find('.account-select').val();
            const percentage = parseFloat($row.find('.percentage-input').val()) || 0;

            // Only add if we have valid data
            if (dimensionValueId && accountId) {
                lineData.push({
                    order: index,
                    dimension_value_id: dimensionValueId,
                    overwrite_account_id: accountId,
                    percent: percentage
                })
            }
        })

        frm.dataForm['line_data'] = lineData
    }

    new SetupFormSubmit($addForm).validate({
        rules: {
            code: { required: true },
            title: { required: true }
        },
        submitHandler: function (form) {
            const frm = new SetupFormSubmit($(form))
            setUpFormData(frm)
            $.fn.callAjax2({
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                (resp) => {
                    $.fn.notifyB({ description: "Created successfully" }, 'success');
                    const $modal = $(form).closest('.modal');
                    if ($modal.length) {
                        $modal.modal('hide');
                    }

                    if (templateTableInstance) {
                        templateTableInstance.ajax.reload(null, false);
                    }
                },
                (errs) => {
                    $.fn.notifyB({ description: errs.data.errors }, 'failure');
                }
            );
        }
    });

    new SetupFormSubmit($updateForm).validate({
        rules: {
            code: { required: true },
            title: { required: true }
        },
        submitHandler: function (form) {
            const frm = new SetupFormSubmit($(form))
            setUpFormData(frm)
            const templateId = $updateForm.attr('data-template-id')
            $.fn.callAjax2({
                url: frm.dataUrl.format_url_with_uuid(templateId),
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                (resp) => {
                    $.fn.notifyB({ description: "Updated successfully" }, 'success');
                    const $modal = $(form).closest('.modal');
                    if ($modal.length) {
                        $modal.modal('hide');
                    }

                    if (templateTableInstance) {
                        templateTableInstance.ajax.reload(null, false);
                    }
                },
                (errs) => {
                    $.fn.notifyB({ description: errs.data.errors }, 'failure');
                }
            );
        }
    })
})