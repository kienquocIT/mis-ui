$(document).ready(function () {
    const $splitTemplateDataTable = $('#datatable-split-template')
    const $addForm = $('#addForm')
    const $splitLineContainer = $('#split-line-container');
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


    // Function to create a split line row
    function createSplitLineRow() {
        return `
            <div class="split-line-row row">
                <div class="col-3">
                    <select class="form-select select2 dimension-val-select" data-url="${$splitTemplateDataTable.data('dimension-value-url').format_url_with_uuid(currDimensionId)}" data-keyResp="dimension_definition_with_values.values">
                    </select>
                </div>
                <div class="col-3">
                    <div class="input-group">
                        <input type="number" class="form-control percentage-input"
                               placeholder="Percentage %" 
                            min="0" max="100" step="1" required>
                        <span class="input-group-text">%</span>
                    </div>
                </div>
                <div class="col-4">
                    <select class="form-select select2 account-select" data-url="${$splitTemplateDataTable.data('account-url')}" data-keyResp="chart_of_accounts_list">
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

    function initializeRowSelect2($row) {
        $row.find('.dimension-val-select').initSelect2({
            dataParams: {
                'only_leaf': 'true'
            }
        });
        $row.find('.account-select').initSelect2({
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

    function updateDeleteButtonStates() {
        const $rows = $splitLineContainer.find('.split-line-row');
        const rowCount = $rows.length;

        // Enable all delete buttons first
        $rows.find('.btn-delete-line').prop('disabled', false).removeClass('disabled');

        // If there are only 2 rows, disable both delete buttons
        if (rowCount <= 2) {
            $rows.find('.btn-delete-line').prop('disabled', true).addClass('disabled');
        }
    }

    // Initialize with 2 default rows
    function initializeSplitLines() {
        $splitLineContainer.empty();
        for (let i = 0; i < 2; i++) {
            const rowHtml = createSplitLineRow(i);
            const $newRow = $(rowHtml);
            $splitLineContainer.append($newRow);
            initializeRowSelect2($newRow);
        }
        updateDeleteButtonStates();
    }

    $addLineBtn.on('click', function() {
        const rowHtml = createSplitLineRow();
        const $newRow = $(rowHtml);
        $splitLineContainer.append($newRow);
        initializeRowSelect2($newRow);
        updateDeleteButtonStates();
    });

    $splitLineContainer.on('click', '.btn-delete-line', function() {
        const $row = $(this).closest('.split-line-row');
        const rowCount = $splitLineContainer.find('.split-line-row').length;

        // Only allow deletion if there are more than 2 rows
        if (rowCount > 2) {
            $row.find('.select2').each(function() {
                if ($(this).hasClass('select2-hidden-accessible')) {
                    $(this).select2('destroy');
                }
            });
            $row.remove();
            updateDeleteButtonStates();
        }
    });

    $dimensionSelect.on('change.select2', function(e) {
        currDimensionId = $(e.currentTarget).val();
        console.log(currDimensionId);
        initializeSplitLines()
        $('.dimension-val-select').initSelect2({
            dataParams: {
                'only_leaf': 'true'
            }
        })
        $('.account-select').initSelect2({
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

    $dimensionSelect.on('change.select2', function(e) {
        currDimensionId = $(e.currentTarget).val();
        $splitLineContainer.find('.select2').each(function() {
            if ($(this).hasClass('select2-hidden-accessible')) {
                $(this).select2('destroy');
            }
        });
        initializeSplitLines();
    });
});