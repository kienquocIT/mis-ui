$(document).ready(() => {
    const DEPRECIATION_STATUS = {
        NOT_STARTED: 0,
        ON_GOING: 1,
        COMPLETED: 2,
    }

    const $modal = $('#modal-run-depreciation')
    const $form = $('#form-run-depreciation');
    const $tableAsset = $('#table-asset-depreciation-list');
    const url = $tableAsset.attr('data-url')
    const method = $tableAsset.attr('data-method')

    let assetList = []
    let selectedDepreciationDate = null  // Track the depreciation date of selected assets


    $.fn.datepicker.dates['custom'] = {
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        monthsShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        today: "Today",
        clear: "Clear"
    };

    $('#depreciation-month').datepicker({
        format: 'mm/yyyy',
        startView: 'months',
        minViewMode: 'months',
        autoclose: true,
        language: 'custom'
    });

    function initDataTable() {
        $tableAsset.DataTableDefault({
            useDataServer: true,
            loading: true,
            pageLength: 10,
            ajax: {
                url: url,
                type: method,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('fa_depreciation_list')) {
                        return resp.data['fa_depreciation_list'] ? resp.data['fa_depreciation_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            reloadCurrency: true,
            columns: [
                {
                    render: (data, type, row) => {
                        return `<div class="form-check">
                                    <input
                                        type="checkbox"
                                        class="form-check-input"
                                        id="select-asset-${row?.['id']}"
                                        name="select-asset"
                                        data-asset-id="${row?.['id'] || ''}"
                                        data-depreciation-date="${row?.['next_depreciation_period'] || ''}"
                                    />
                                </div>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<label class="form-check-label mr-2" for="select-asset-${row?.['id']}">
                                    <span class="badge badge-sm badge-soft-secondary mr-1">${row?.['code'] || ''}</span>
                                    <span>${row?.['title'] || ''}</span>
                                </label>`
                    }
                },
                {
                    render: (data, type, row) => {
                        const assetCategoryTitle = row?.['asset_category']?.['title'] || '-'
                        return `<div>${assetCategoryTitle}</div>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['original_cost']}"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['accumulative_depreciation']}"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['net_book_value']}"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        let date = row?.['last_posted_date']
                        if (date !== null && date !== undefined) {
                            date = DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "MM/YYYY", date)
                            return `<div>${date}</div>`
                        }
                        return '<div>-</div>'
                    }
                },
                {
                    render: (data, type, row) => {
                        let date = row?.['next_depreciation_period']
                        if (date !== null && date !== undefined) {
                            date = DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "MM/YYYY", date)
                            return `<div>${date}</div>`
                        }
                        return '<div>-</div>'
                    }
                },
                {
                    render: (data, type, row) => {
                        let date = row?.['depreciation_end_date']
                        if (date !== null && date !== undefined) {
                            date = DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "DD/MM/YYYY", date)
                            return `<div>${date}</div>`
                        }
                        return '<div>-</div>'
                    }
                },
                {
                    render: (data, type, row) => {
                        const depreciationStatusDisplay = row?.['depreciation_status']?.['display'] || '-'
                        const depreciationStatus = row?.['depreciation_status']?.['status'] || 0
                        const depreciationBadgeClass = {
                            [DEPRECIATION_STATUS.NOT_STARTED]: 'badge-soft-secondary',
                            [DEPRECIATION_STATUS.ON_GOING]: 'badge-soft-yellow',
                            [DEPRECIATION_STATUS.COMPLETED]: 'badge-soft-success',
                        }

                        return `<span class="badge ${depreciationBadgeClass[depreciationStatus]}">
                                    ${depreciationStatusDisplay}
                                </span>`
                    }
                },
            ]
        })
    }

    // Helper function to extract MM/YYYY from depreciation date
    function getDepreciationPeriod(dateStr) {
        if (!dateStr) return null
        return DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "MM/YYYY", dateStr)
    }

    // Handle "Check All" checkbox
    $tableAsset.on('change', '.select-all-checkbox', function () {
        const isChecked = $(this).is(':checked')

        if (isChecked) {
            // Check if all visible rows have matching depreciation dates
            let firstDate = null
            let hasDateMismatch = false

            $tableAsset.find('input[name="select-asset"]').each(function () {
                const rowDate = $(this).attr('data-depreciation-date')
                const rowPeriod = getDepreciationPeriod(rowDate)

                if (firstDate === null) {
                    firstDate = rowPeriod
                } else if (rowPeriod !== firstDate) {
                    hasDateMismatch = true
                    return false // break loop
                }
            })

            // Also check against already selected assets
            if (!hasDateMismatch && selectedDepreciationDate && firstDate !== selectedDepreciationDate) {
                hasDateMismatch = true
            }

            if (hasDateMismatch) {
                $.fn.notifyB({description: "Cannot select all: Assets have different depreciation periods"}, 'failure')
                $(this).prop('checked', false)
                return
            }

            // All dates match, proceed with selection
            if (!selectedDepreciationDate) {
                selectedDepreciationDate = firstDate
            }
        }

        $tableAsset.find('input[name="select-asset"]').each(function () {
            const $checkbox = $(this)
            const assetId = $checkbox.attr('data-asset-id')

            $checkbox.prop('checked', isChecked)

            if (isChecked) {
                if (!assetList.includes(assetId)) {
                    assetList.push(assetId)
                }
            } else {
                assetList = assetList.filter(item => item !== assetId)
            }
        })

        // Reset selectedDepreciationDate if all unchecked
        if (!isChecked) {
            selectedDepreciationDate = null
        }
    })

    // Handle individual checkbox change with depreciation date validation
    $tableAsset.on('change', 'input[name="select-asset"]', function (e) {
        const $ele = $(e.currentTarget)
        const assetId = $ele.attr('data-asset-id')
        const rowDepreciationDate = $ele.attr('data-depreciation-date')
        const rowPeriod = getDepreciationPeriod(rowDepreciationDate)

        if ($ele.is(':checked')) {
            // Check if this row's depreciation date matches existing selections
            if (selectedDepreciationDate !== null && rowPeriod !== selectedDepreciationDate) {
                $.fn.notifyB({
                    description: `Depreciation period mismatch! Current: ${selectedDepreciationDate}, This row: ${rowPeriod}`
                }, 'failure')
                $ele.prop('checked', false)
                return
            }

            // First selection or matching date
            if (selectedDepreciationDate === null) {
                selectedDepreciationDate = rowPeriod
            }

            if (!assetList.some(item => item === assetId)) {
                assetList.push(assetId)
            }
        } else {
            assetList = assetList.filter(item => item !== assetId)

            // Reset selectedDepreciationDate if no assets selected
            if (assetList.length === 0) {
                selectedDepreciationDate = null
            }
        }

        // Update "Check All" checkbox state
        const totalCheckboxes = $tableAsset.find('input[name="select-asset"]').length
        const checkedCheckboxes = $tableAsset.find('input[name="select-asset"]:checked').length
        $('.select-all-checkbox').prop('checked', totalCheckboxes === checkedCheckboxes && totalCheckboxes > 0)
    })

    $tableAsset.on('draw.dt', function () {
        // Restore checked state for checkboxes in assetList
        $tableAsset.find('input[name="select-asset"]').each(function () {
            const $checkbox = $(this);
            const assetId = $checkbox.data('asset-id')

            if (assetList.some(item => item === assetId)) {
                $checkbox.prop('checked', true)
            }
        })

        // Update "Check All" checkbox based on current page
        const totalCheckboxes = $tableAsset.find('input[name="select-asset"]').length
        const checkedCheckboxes = $tableAsset.find('input[name="select-asset"]:checked').length
        $('.select-all-checkbox').prop('checked', totalCheckboxes === checkedCheckboxes && totalCheckboxes > 0)
    })

    function setUpFormData(frm){
        frm.dataForm['asset_list'] = assetList
        frm.dataForm['depreciation_month'] = DateTimeControl.formatDateType("MM/YYYY", "YYYY-MM", frm.dataForm['depreciation_month'])
    }

    new SetupFormSubmit($form).validate({
        submitHandler: function (form) {
            if (assetList.length === 0) {
                $.fn.notifyB({description: "Please select at least one asset"}, 'failure')
                return
            }
            let frm = new SetupFormSubmit($(form));
            setUpFormData(frm)
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        assetList = []
                        selectedDepreciationDate = null  // Reset on success

                        $tableAsset.DataTable().ajax.reload()

                        $modal.modal('hide')
                        $('.select-all-checkbox').prop('checked', false)
                        $form[0].reset()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
        }
    })

    initDataTable()
})