// LoadData
class RecoveryLoadDataHandle {
    static $form = $('#frm_goods_recovery');
    static $date = $('#date_recovery');
    static $boxStatus = $('#recovery_status');
    static $boxCustomer = $('#customer_id');
    static $boxLeaseOrder = $('#lease_order_id');
    static $canvasMain = $('#productCanvas');
    static $scrollProduct = $('#scroll-new-leased-product');
    static $btnSaveProduct = $('#btn-save-product');
    static $depreciationModal = $('#viewDepreciationDetail');
    static $btnSaveDepreciation = $('#btn-save-depreciation-detail');

    static transEle = $('#app-trans-factory');
    static urlEle = $('#url-factory');
    static dataStatus = [
        {'id': 0, 'title': RecoveryLoadDataHandle.transEle.attr('data-status-1')},
        {'id': 1, 'title': RecoveryLoadDataHandle.transEle.attr('data-status-2')},
        {'id': 2, 'title': RecoveryLoadDataHandle.transEle.attr('data-status-3')},
    ];
    static dataDepreciationMethod = [
        {'id': 0, 'title': RecoveryLoadDataHandle.transEle.attr('data-depreciation-method-1')},
        {'id': 1, 'title': RecoveryLoadDataHandle.transEle.attr('data-depreciation-method-2')},
    ];

    static loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
        let opts = {'allowClear': isClear};
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }
        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = ``;
                let res2 = ``;
                if (customRes?.['res1']) {
                    res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`;
                }
                if (customRes?.['res2']) {
                    res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`;
                }
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

    static loadEventCheckbox($area, trigger = false) {
        // Use event delegation for dynamically added elements
        $area.on('click', '.form-check', function (event) {
            // Prevent handling if the direct checkbox is clicked
            if (event.target.classList.contains('form-check-input')) {
                return; // Let the checkbox handler handle this
            }

            // Find the checkbox inside the clicked element
            let checkbox = this.querySelector('.form-check-input[type="checkbox"]');
            if (checkbox) {
                // Check if the checkbox is disabled
                if (checkbox.disabled) {
                    return; // Exit early if the checkbox is disabled
                }
                // Prevent the default behavior
                event.preventDefault();
                event.stopImmediatePropagation();

                // Toggle the checkbox state manually
                checkbox.checked = !checkbox.checked;
                // Optional: Trigger a change event if needed
                if (trigger === true) {
                    $(checkbox).trigger('change');
                }
            }
        });

        // Handle direct clicks on the checkbox itself
        $area.on('click', '.form-check-input', function (event) {
            // Prevent the default behavior to avoid double-triggering
            event.stopPropagation();
            event.stopImmediatePropagation();

            // Checkbox state is toggled naturally, so no need to modify it
            if (trigger === true) {
                $(this).trigger('change'); // Optional: Trigger change event explicitly
            }
        });

        return true;
    };

    static loadEventRadio($area) {
        // Use event delegation for dynamically added elements
        $area.on('click', '.form-check', function () {
            // Find and mark the radio button inside this group as checked
            let radio = this.querySelector('.form-check-input');
            if (radio) {
                let checkboxes = $area[0].querySelectorAll('.form-check-input[type="radio"]');
                // Uncheck all radio buttons and reset row styles
                for (let eleCheck of checkboxes) {
                    eleCheck.checked = false;
                }
                // Set the current radio button as checked and apply style
                radio.checked = true;
            }
        });
        return true;
    };

    static loadInit() {
        RecoveryLoadDataHandle.$date.val(DateTimeControl.getCurrentDate("DMY", "/")).trigger('change');
        FormElementControl.loadInitS2(RecoveryLoadDataHandle.$boxStatus, RecoveryLoadDataHandle.dataStatus);
        FormElementControl.loadInitS2(RecoveryLoadDataHandle.$boxCustomer);
        FormElementControl.loadInitS2(RecoveryLoadDataHandle.$boxLeaseOrder, [], {'system_status': 3}, null, false, {'res1': 'code', 'res2': 'title'});
        RecoveryLoadDataHandle.loadEventRadio(RecoveryLoadDataHandle.$depreciationModal);
        // dtb
        RecoveryDataTableHandle.dataTableProduct();
        RecoveryDataTableHandle.dataTableDelivery();
        RecoveryDataTableHandle.dataTableDeliveryProduct();
        RecoveryDataTableHandle.dataTableProductNew();
        RecoveryDataTableHandle.dataTableDepreciationDetail();
        return true;
    };

    static loadCssToDtb(tableID) {
        let tableIDWrapper = tableID + '_wrapper';
        let tableWrapper = document.getElementById(tableIDWrapper);
        if (tableWrapper) {
            let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
            if (headerToolbar) {
                headerToolbar.classList.add('hidden');
            }
        }
    };

    static loadCheckExceedQuantity() {
        let check = true;
        RecoveryDataTableHandle.$tableProductNew.DataTable().rows().every(function () {
            let row = this.node();
            let remainELe = row.querySelector('.table-row-quantity-remain-recovery');
            let recoveryELe = row.querySelector('.table-row-quantity-recovery');
            if (remainELe && recoveryELe) {
                if (remainELe.innerHTML && recoveryELe.value) {
                    let remain = parseFloat(remainELe.innerHTML);
                    let recovered = parseFloat(recoveryELe.value);
                    if (recovered > remain) {
                        check = false;
                    }
                }
            }
        });
        if (check === false) {
            $.fn.notifyB({description: RecoveryLoadDataHandle.transEle.attr('data-exceed-quantity')}, 'failure');
            return check;
        }
        RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().rows().every(function () {
            let row = this.node();
            let remainELe = row.querySelector('.table-row-quantity-remain-recovery');
            let recoveryELe = row.querySelector('.table-row-quantity-recovery');
            if (remainELe && recoveryELe) {
                if (remainELe.innerHTML && recoveryELe.innerHTML) {
                    let remain = parseFloat(remainELe.innerHTML);
                    let recovered = parseFloat(recoveryELe.innerHTML);
                    if (recovered > remain) {
                        check = false;
                    }
                }
            }
        });
        if (check === false) {
            $.fn.notifyB({description: RecoveryLoadDataHandle.transEle.attr('data-exceed-quantity')}, 'failure');
            return check;
        }

        return check;
    };

    static loadCheckDelivery() {
        let checkedEle = RecoveryDataTableHandle.$tableDelivery[0].querySelector('.table-row-checkbox:checked');
        if (checkedEle) {
            let row = checkedEle.closest('tr');
            if (row) {
                let rowIndex = RecoveryDataTableHandle.$tableDelivery.DataTable().row(row).index();
                let $row = RecoveryDataTableHandle.$tableDelivery.DataTable().row(rowIndex);
                let rowData = $row.data();

                RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().clear().draw();
                RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().rows.add(rowData?.['delivery_product_data'] ? rowData?.['delivery_product_data'] : []).draw();
                let warehouseArea = RecoveryLoadDataHandle.$canvasMain[0].querySelector('.dtb-warehouse-area');
                if (warehouseArea) {
                    warehouseArea.setAttribute('hidden', 'true');
                }
            }
        }
        return true;
    };

    static loadCheckDeliveryProduct() {
        let checkedEle = RecoveryDataTableHandle.$tableDeliveryProduct[0].querySelector('.table-row-checkbox:checked');
        if (checkedEle) {
            let row = checkedEle.closest('tr');
            if (row) {
                let rowIndex = RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().row(row).index();
                let $row = RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().row(rowIndex);
                let rowData = $row.data();

                RecoveryDataTableHandle.$tableProductNew.DataTable().clear().draw();
                if (rowData?.['tool_data'].length > 0) {
                    RecoveryDataTableHandle.$tableProductNew.DataTable().rows.add(rowData?.['tool_data']).draw();
                }
                if (rowData?.['asset_data'].length > 0) {
                    RecoveryDataTableHandle.$tableProductNew.DataTable().rows.add(rowData?.['asset_data']).draw();
                }
            }
        }
    };

    static loadLineDetail() {
        let dataTool = [];
        let dataAsset = [];
        RecoveryDataTableHandle.$tableDelivery.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = RecoveryDataTableHandle.$tableDelivery.DataTable().row(row).index();
            let $row = RecoveryDataTableHandle.$tableDelivery.DataTable().row(rowIndex);
            let rowData = $row.data();

            for (let productData of rowData?.['delivery_product_data'] ? rowData?.['delivery_product_data'] : []) {
                for (let toolData of productData?.['tool_data']) {
                    if (toolData?.['quantity_recovery']) {
                        if (toolData?.['quantity_recovery'] > 0) {
                            dataTool.push(toolData);
                        }
                    }
                }
                for (let assetData of productData?.['asset_data']) {
                    if (assetData?.['quantity_recovery']) {
                        if (assetData?.['quantity_recovery'] > 0) {
                            dataAsset.push(assetData);
                        }
                    }
                }
            }
        });

        let dataToolFn = [];
        let dataJSON = {};
        let clonedData = JSON.parse(JSON.stringify(dataTool));
        for (let cloned of clonedData) {
            if (dataJSON.hasOwnProperty(cloned?.['tool_id'])) {
                dataJSON[cloned?.['tool_id']]['quantity_recovery'] += cloned?.['quantity_recovery'];
            } else {
                dataJSON[cloned?.['tool_id']] = cloned;
            }
        }
        for (let key in dataJSON) {
            dataToolFn.push(dataJSON[key]);
        }

        RecoveryDataTableHandle.$tableProduct.DataTable().clear().draw();
        RecoveryDataTableHandle.$tableProduct.DataTable().rows.add(dataAsset.concat(dataToolFn)).draw();

        RecoveryDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let btnDepreciationEle = row.querySelector('.btn-depreciation-detail');
            if (btnDepreciationEle) {
                RecoveryLoadDataHandle.loadShowDepreciation(btnDepreciationEle);
                RecoveryLoadDataHandle.loadDataTableDepreciation();
                RecoveryLoadDataHandle.loadSaveDepreciation();
            }
        });

        return true;
    };

    // DEPRECIATION
    static loadShowDepreciation(ele) {
        let row = ele.closest('tr');
        if (row) {
            let toolEle = row.querySelector('.table-row-tool');
            if (toolEle) {
                if ($(toolEle).val()) {
                    let dataTool = SelectDDControl.get_data_from_idx($(toolEle), $(toolEle).val());
                    if (dataTool) {
                        RecoveryLoadDataHandle.$btnSaveDepreciation.attr('data-product-id', dataTool?.['id']);
                    }
                }
            }
            let assetEle = row.querySelector('.table-row-asset');
            if (assetEle) {
                if ($(assetEle).val()) {
                    let dataAsset = SelectDDControl.get_data_from_idx($(assetEle), $(assetEle).val());
                    if (dataAsset) {
                        RecoveryLoadDataHandle.$btnSaveDepreciation.attr('data-product-id', dataAsset?.['id']);
                    }
                }
            }

            let depreciationMethodEle = row.querySelector('.table-row-depreciation-method');
            let $methodEle = $('#depreciation_method');
            if (depreciationMethodEle && $methodEle.length > 0) {
                FormElementControl.loadInitS2($methodEle, RecoveryLoadDataHandle.dataDepreciationMethod, {}, RecoveryLoadDataHandle.$depreciationModal);
                if ($(depreciationMethodEle).val()) {
                    $methodEle.val(parseInt($(depreciationMethodEle).val())).trigger('change');
                }
            }
            let depreciationAdjustEle = row.querySelector('.table-row-depreciation-adjustment');
            let $adjustEle = $('#depreciation_adjustment');
            if (depreciationAdjustEle && $adjustEle.length > 0) {
                if ($(depreciationAdjustEle).val()) {
                    $adjustEle.val(parseFloat($(depreciationAdjustEle).val()));
                }
            }
            let depreciationTimeEle = row.querySelector('.table-row-depreciation-time');
            let $timeEle = $('#depreciation_time');
            if (depreciationTimeEle && $timeEle.length > 0) {
                if ($(depreciationTimeEle).val()) {
                    $timeEle.val(parseFloat($(depreciationTimeEle).val()));
                }
            }
            let priceEle = row.querySelector('.table-row-price');
            let quantityEle = row.querySelector('.table-row-quantity');
            let netValueEle = row.querySelector('.table-row-net-value');
            let $priceEle = $('#cost_price');
            if ($priceEle.length > 0) {
                $($priceEle).attr('value', String(0));
                if (priceEle && quantityEle) {
                    if ($(priceEle).valCurrency() && $(quantityEle).val()) {
                        let total = parseFloat($(priceEle).valCurrency()) * parseFloat($(quantityEle).val());
                        $($priceEle).attr('value', String(total));
                    }
                }
                if (netValueEle) {
                    if ($(netValueEle).attr('data-init-money')) {
                        let total = parseFloat($(netValueEle).attr('data-init-money'));
                        $($priceEle).attr('value', String(total));
                    }
                }
                // mask money
                $.fn.initMaskMoney2();
            }
            let uomTimeEle = row.querySelector('.table-row-uom-time');
            let $uomEle = $('#depreciation_uom');
            if (uomTimeEle && $uomEle.length > 0) {
                let dataUOMTime = SelectDDControl.get_data_from_idx($(uomTimeEle), $(uomTimeEle).val());
                if (dataUOMTime) {
                    $uomEle[0].innerHTML = dataUOMTime?.['title'];
                }
            }
            let depreciationStartDateEle = row.querySelector('.table-row-depreciation-start-date');
            let $startDateEle = $('#depreciation_start_date');
            if (depreciationStartDateEle && $startDateEle.length > 0) {
                $startDateEle.val("").trigger('change');
                if ($(depreciationStartDateEle).val()) {
                    $startDateEle.val(moment($(depreciationStartDateEle).val()).format('DD/MM/YYYY'));
                }
                if (!$startDateEle.val()) {
                    $startDateEle.val(DateTimeControl.getCurrentDate("DMY", "/"));
                }
            }
            let depreciationEndDateEle = row.querySelector('.table-row-depreciation-end-date');
            let $endDateEle = $('#depreciation_end_date');
            if (depreciationEndDateEle && $endDateEle.length > 0) {
                $endDateEle.val("").trigger('change');
                if ($(depreciationEndDateEle).val()) {
                    $endDateEle.val(moment($(depreciationEndDateEle).val()).format('DD/MM/YYYY'));
                }
                // if not data store depreciation_end_date then auto use DepreciationControl.getEndDateDepreciation
                if ($startDateEle.val() && $timeEle.val()) {
                    let endDate = DepreciationControl.getEndDateDepreciation($startDateEle.val(), parseInt($timeEle.val()));
                    $endDateEle.val(endDate).trigger('change');
                }
            }
            let leaseStartDateEle = row.querySelector('.table-row-lease-start-date');
            let $leaseStartDateEle = $('#lease_start_date');
            if (leaseStartDateEle && $leaseStartDateEle.length > 0) {
                $leaseStartDateEle.val("").trigger('change');
                if ($(leaseStartDateEle).val()) {
                    $leaseStartDateEle.val(moment($(leaseStartDateEle).val()).format('DD/MM/YYYY'));
                }
            }
            let leaseEndDateEle = row.querySelector('.table-row-lease-end-date');
            let $leaseEndDateEle = $('#lease_end_date');
            if (leaseEndDateEle && $leaseEndDateEle.length > 0) {
                $leaseEndDateEle.val("").trigger('change');
                if (RecoveryLoadDataHandle.$date.val()) {
                    $leaseEndDateEle.val(RecoveryLoadDataHandle.$date.val());
                }
            }

            let dataFn = [];
            let depreciationDataEle = row.querySelector('.table-row-depreciation-data');
            let depreciationLeaseDataEle = row.querySelector('.table-row-depreciation-lease-data');
            if (depreciationDataEle && depreciationLeaseDataEle) {
                if ($(depreciationDataEle).val()) {
                    let dataDepreciation = JSON.parse($(depreciationDataEle).val());
                    if (dataDepreciation.length > 0) {
                        dataFn = dataDepreciation;
                        if ($(depreciationLeaseDataEle).val()) {
                            let dataLeaseDepreciation = JSON.parse($(depreciationLeaseDataEle).val());
                            dataFn = DepreciationControl.mapDataOfRange({
                                'data_depreciation': dataDepreciation,
                                'data_of_range': dataLeaseDepreciation,
                            });
                        }
                        RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().clear().draw();
                        RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().rows.add(dataFn).draw();
                        return true;
                    }
                }
            }
        }

        return true;
    };

    static loadDataTableDepreciation() {
        let $costEle = $('#cost_price');
        let $timeEle = $('#depreciation_time');
        let $methodEle = $('#depreciation_method');
        let $adjustEle = $('#depreciation_adjustment');

        let $startEle = $('#depreciation_start_date');
        let $endEle = $('#depreciation_end_date');
        let $startLeaseEle = $('#lease_start_date');
        let $endLeaseEle = $('#lease_end_date');

        let $radioSaleEle = $('#depreciation_for_sale');
        let $radioFinanceEle = $('#depreciation_for_finance');
        RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().clear().draw();
        if ($methodEle.length > 0 && $timeEle.length > 0 && $startEle.length > 0 && $endEle.length > 0 && $costEle.length > 0 && $adjustEle.length > 0 && $radioSaleEle.length > 0 && $radioFinanceEle.length > 0) {
            if ($methodEle.val() && $timeEle.val() && $startEle.val() && $endEle.val() && $costEle.valCurrency()) {
                let dataFn = [];
                let dataDepreciation = [];
                if ($radioFinanceEle[0].checked === true) {
                    dataDepreciation = DepreciationControl.callDepreciation({
                        "method": parseInt($methodEle.val()),
                        "months": parseInt($timeEle.val()),
                        "start_date": $startEle.val(),
                        "end_date": $endEle.val(),
                        "price": parseFloat($costEle.valCurrency()),
                        "adjust": parseFloat($adjustEle.val())
                    });
                    let dataOfRange = DepreciationControl.extractDataOfRange({
                        'data_depreciation': dataDepreciation,
                        'start_date': $startLeaseEle.val(),
                        'end_date': $endLeaseEle.val(),
                    });
                    dataFn = DepreciationControl.mapDataOfRange({
                        'data_depreciation': dataDepreciation,
                        'data_of_range': dataOfRange,
                    });
                }

                $('#depreciation_spinner').removeAttr('hidden');
                RecoveryDataTableHandle.$tableDepreciationDetail.attr('hidden', 'true');
                setTimeout(function () {
                    $('#depreciation_spinner').attr('hidden', true);
                    RecoveryDataTableHandle.$tableDepreciationDetail.removeAttr('hidden');
                }, 300);

                RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().rows.add(dataFn).draw();
            }
        }
        return true;
    };

    static loadSaveDepreciation() {
        let $table = RecoveryDataTableHandle.$tableProduct;
        let target = $table[0].querySelector(`[data-product-id="${RecoveryLoadDataHandle.$btnSaveDepreciation.attr('data-product-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');
            if (targetRow) {
                let $priceEle = $('#cost_price');
                let $timeEle = $('#depreciation_time');
                let $methodEle = $('#depreciation_method');
                let $adjust = $('#depreciation_adjustment');
                let $startEle = $('#depreciation_start_date');
                let $endEle = $('#depreciation_end_date');
                let $leaseStartEle = $('#lease_start_date');
                let $leaseEndEle = $('#lease_end_date');
                let fnCost = 0;
                let dataDepreciation = [];
                let dataDepreciationLease = [];
                if ($methodEle.length > 0 && $adjust.length > 0 && $startEle.length > 0 && $endEle.length > 0  && $leaseStartEle.length > 0 && $leaseEndEle.length > 0) {
                    let depreciationMethodEle = targetRow.querySelector('.table-row-depreciation-method');
                    let depreciationAdjustEle = targetRow.querySelector('.table-row-depreciation-adjustment');
                    let depreciationStartDateEle = targetRow.querySelector('.table-row-depreciation-start-date');
                    let depreciationEndDateEle = targetRow.querySelector('.table-row-depreciation-end-date');
                    let leaseStartDateEle = targetRow.querySelector('.table-row-lease-start-date');
                    let leaseEndDateEle = targetRow.querySelector('.table-row-lease-end-date');

                    if (depreciationMethodEle && depreciationAdjustEle && depreciationStartDateEle && depreciationEndDateEle && leaseStartDateEle && leaseEndDateEle) {
                        if ($methodEle.val()) {
                            $(depreciationMethodEle).val(parseInt($methodEle.val()));
                        }
                        if ($adjust.val()) {
                            $(depreciationAdjustEle).val(parseFloat($adjust.val()))
                        }
                        if ($startEle.val()) {
                            $(depreciationStartDateEle).val(moment($startEle.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD'));
                        }
                        if ($endEle.val()) {
                            $(depreciationEndDateEle).val(moment($endEle.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD'));
                        }
                        if ($leaseStartEle.val()) {
                            $(leaseStartDateEle).val(moment($leaseStartEle.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD'));
                        }
                        if ($leaseEndEle.val()) {
                            $(leaseEndDateEle).val(moment($leaseEndEle.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD'));
                        }

                        dataDepreciation = DepreciationControl.callDepreciation({
                            "method": parseInt($methodEle.val()),
                            "months": parseInt($timeEle.val()),
                            "start_date": $startEle.val(),
                            "end_date": $endEle.val(),
                            "price": parseFloat($priceEle.valCurrency()),
                            "adjust": parseFloat($adjust.val()),
                        });
                        dataDepreciationLease = DepreciationControl.extractDataOfRange({
                            'data_depreciation': dataDepreciation,
                            'start_date': $leaseStartEle.val(),
                            'end_date': $leaseEndEle.val(),
                        });
                    }
                    RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().rows().every(function () {
                        let row = this.node();
                        let rowIndex = RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().row(row).index();
                        let $row = RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().row(rowIndex);
                        let dataRow = $row.data();
                        if (dataRow?.['lease_accumulative_allocated']) {
                            fnCost = dataRow?.['lease_accumulative_allocated'];
                        }
                    });
                }

                let depreciationSubtotalEle = targetRow.querySelector('.table-row-depreciation-subtotal');
                let fnCostEle = targetRow.querySelector('.table-row-subtotal');
                let fnCostRawEle = targetRow.querySelector('.table-row-subtotal-raw');
                let depreciationDataEle = targetRow.querySelector('.table-row-depreciation-data');
                let depreciationLeaseDataEle = targetRow.querySelector('.table-row-depreciation-lease-data');

                if (depreciationSubtotalEle && fnCostEle && fnCostRawEle) {
                    $(depreciationSubtotalEle).val(fnCost);
                    $(fnCostEle).attr('data-init-money', String(fnCost));
                    $(fnCostRawEle).val(String(fnCost));
                }
                if (depreciationDataEle) {
                    $(depreciationDataEle).val(JSON.stringify(dataDepreciation));
                }
                if (depreciationLeaseDataEle) {
                    $(depreciationLeaseDataEle).val(JSON.stringify(dataDepreciationLease));
                }
                $.fn.initMaskMoney2();
            }
        }
        return true;
    };

    // LOAD DETAIL
    static loadDetailPage(data) {
        $('#title').val(data?.['title']);
        $('#remark').val(data?.['remark']);
        if (data?.['date_recovery']) {
            RecoveryLoadDataHandle.$date.val(moment(data?.['date_recovery']).format('DD/MM/YYYY'));
        } else {
            RecoveryLoadDataHandle.$date.val('');
        }
        if (data?.['customer_data']) {
            FormElementControl.loadInitS2(RecoveryLoadDataHandle.$boxCustomer, [data?.['customer_data']]);
        }
        if (data?.['lease_order_data']) {
            FormElementControl.loadInitS2(RecoveryLoadDataHandle.$boxLeaseOrder, [data?.['lease_order_data']]);
        }
        RecoveryDataTableHandle.$tableDelivery.DataTable().rows.add(data?.['recovery_delivery_data']).draw();
        RecoveryLoadDataHandle.loadLineDetail();
        RecoveryLoadDataHandle.loadTotal(data);

        return true;
    };

    static loadTableDisabled(table) {
        for (let ele of table[0].querySelectorAll('.table-row-item')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-description')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-uom')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-price')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-tax')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-import')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.del-row')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-lot-number')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-import')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-vendor-serial-number')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-serial-number')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-expire-date')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('text-black');
        }
        for (let ele of table[0].querySelectorAll('.table-row-manufacture-date')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('text-black');
        }
        for (let ele of table[0].querySelectorAll('.table-row-warranty-start')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('text-black');
        }
        for (let ele of table[0].querySelectorAll('.table-row-warranty-end')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('text-black');
        }
    };

    static loadTotal(data) {
        let tableWrapper = document.getElementById('datable-product_wrapper');
        if (tableWrapper) {
            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');
            if (tableFt) {
                let elePretaxAmount = tableFt.querySelector('.good-receipt-product-pretax-amount');
                let elePretaxAmountRaw = tableFt.querySelector('.good-receipt-product-pretax-amount-raw');
                if (elePretaxAmount && elePretaxAmountRaw) {
                    $(elePretaxAmount).attr('data-init-money', String(data?.['total_pretax']));
                    elePretaxAmountRaw.value = data?.['total_pretax'];
                }
                let eleTaxes = tableFt.querySelector('.good-receipt-product-taxes');
                let eleTaxesRaw = tableFt.querySelector('.good-receipt-product-taxes-raw');
                if (eleTaxes && eleTaxesRaw) {
                    $(eleTaxes).attr('data-init-money', String(data?.['total_tax']));
                    eleTaxesRaw.value = data?.['total_tax'];
                }
                let eleTotal = tableFt.querySelector('.good-receipt-product-total');
                let eleTotalRaw = tableFt.querySelector('.good-receipt-product-total-raw');
                if (eleTotal && eleTotalRaw) {
                    $(eleTotal).attr('data-init-money', String(data?.['total']));
                    eleTotalRaw.value = data?.['total'];
                }
                let finalRevenueBeforeTax = tableFt.querySelector('.good-receipt-final-revenue-before-tax');
                let finalRevenueBeforeTaxRaw = tableFt.querySelector('.good-receipt-final-revenue-before-tax-raw');
                if (finalRevenueBeforeTax && finalRevenueBeforeTaxRaw) {
                    $(finalRevenueBeforeTax).attr('data-init-money', String(data?.['total_revenue_before_tax']));
                    finalRevenueBeforeTaxRaw.value = data?.['total_revenue_before_tax'];
                }
            }
        }
        $.fn.initMaskMoney2();
        return true;
    };


}

// DataTable
class RecoveryDataTableHandle {
    static $tableProduct = $('#datable-product');
    static $tableDelivery = $('#datable-delivery');
    static $tableDeliveryProduct = $('#datable-deli-product');
    static $tableProductNew = $('#datable-deli-product-new');
    static $tableDepreciationDetail = $('#table-depreciation-detail');

    static dataTableProduct(data) {
        RecoveryDataTableHandle.$tableProduct.not('.dataTable').DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '15%',
                    render: (data, type, row) => {
                        let value = "";
                        if (row?.['tool_data']?.['id']) {
                            value = row?.['tool_data']?.['title'] ? row?.['tool_data']?.['title'] : '';
                        }
                        if (row?.['asset_data']?.['id']) {
                            value = row?.['asset_data']?.['title'] ? row?.['asset_data']?.['title'] : '';
                        }
                        return `<textarea class="form-control table-row-item-show zone-readonly" rows="2" readonly>${value}</textarea>
                                <div hidden>
                                    <select
                                        class="form-select table-row-tool"
                                        data-product-id="${row?.['tool_data']?.['id']}"
                                    >
                                    </select>
                                    <select
                                        class="form-select table-row-asset"
                                        data-product-id="${row?.['asset_data']?.['id']}"
                                    >
                                    </select>
                                </div>`;
                    }
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        let value = "";
                        if (row?.['tool_data']?.['id']) {
                            value = row?.['tool_data']?.['code'] ? row?.['tool_data']?.['code'] : '';
                        }
                        if (row?.['asset_data']?.['id']) {
                            value = row?.['asset_data']?.['code'] ? row?.['asset_data']?.['code'] : '';
                        }
                        return `<textarea class="form-control table-row-code" rows="2" readonly>${value}</textarea>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: () => {
                        return `<select 
                                    class="form-select table-row-uom disabled-custom-show zone-readonly"
                                    readonly
                                ></select>`;
                    },
                },
                {
                    targets: 4,
                    width: '6%',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-quantity text-black zone-readonly" value="${row?.['quantity_recovery']}" readonly>`;
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <input type="text" class="form-control table-row-quantity-time text-black valid-num" value="${row?.['product_quantity_time'] ? row?.['product_quantity_time'] : "0"}" readonly>
                                    <span class="input-group-text">${RecoveryLoadDataHandle.transEle.attr('data-month')}</span>
                                </div>
                                <div hidden>
                                        <select 
                                            class="form-select table-row-uom-time"
                                            data-url="${RecoveryLoadDataHandle.urlEle.attr('data-md-uom')}"
                                         >
                                        </select>
                                    </div>`;
                    }
                },
                {
                    targets: 6,
                    width: '15%',
                    render: (data, type, row) => {
                        let value = 0;
                        if (row?.['tool_data']?.['id']) {
                            if (row?.['tool_data']?.['unit_price']) {
                                value = row?.['tool_data']?.['unit_price'] ? row?.['tool_data']?.['unit_price'] : 0;
                            }
                            if (row?.['tool_data']?.['origin_cost']) {
                                value = row?.['tool_data']?.['origin_cost'] ? row?.['tool_data']?.['origin_cost'] : 0;
                            }
                        }
                        if (row?.['asset_data']?.['id']) {
                            value = row?.['asset_data']?.['origin_cost'] ? row?.['asset_data']?.['origin_cost'] : 0;
                        }
                        return `<div class="row">
                                    <input 
                                        type="text" 
                                        class="form-control mask-money table-row-price disabled-custom-show" 
                                        value="${value}"
                                        data-return-type="number"
                                        readonly
                                    >
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '12%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        let readonly = "readonly";
                        if (row?.['asset_type'] === 1) {
                            readonly = "";
                        }
                        return `<div class="row">
                                    <div class="d-flex align-items-center">
                                        <div class="input-group">
                                            <input 
                                                type="text" 
                                                class="form-control table-row-depreciation-time" 
                                                value="${row?.['product_depreciation_time'] ? row?.['product_depreciation_time'] : 0}"
                                                data-zone="${dataZone}"
                                                ${readonly}
                                            >
                                            <span class="input-group-text">${RecoveryLoadDataHandle.transEle.attr('data-month')}</span>
                                        </div>
                                        <button
                                            type="button"
                                            class="btn btn-icon btn-depreciation-detail"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#viewDepreciationDetail"
                                            data-zone="${dataZone}"
                                        ><i class="fas fa-ellipsis-h"></i>
                                        </button>
                                    </div>
                                    
                                    <input type="text" class="form-control table-row-depreciation-subtotal" value="${row?.['product_depreciation_subtotal'] ? row?.['product_depreciation_subtotal'] : 0}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-method" value="${row?.['product_depreciation_method'] ? row?.['product_depreciation_method'] : 0}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-start-date" value="${row?.['product_depreciation_start_date'] ? row?.['product_depreciation_start_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-end-date" value="${row?.['product_depreciation_end_date'] ? row?.['product_depreciation_end_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-adjustment" value="${row?.['product_depreciation_adjustment'] ? row?.['product_depreciation_adjustment'] : 1}" hidden>
                                
                                    <input type="text" class="form-control table-row-lease-start-date" value="${row?.['product_lease_start_date'] ? row?.['product_lease_start_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-lease-end-date" value="${row?.['product_lease_end_date'] ? row?.['product_lease_end_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-data hidden">
                                    <input type="text" class="form-control table-row-depreciation-lease-data hidden">
                                </div>`;
                    }
                },
                {
                    targets: 8,
                    width: '15%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<div class="row subtotal-area">
                                <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['product_subtotal_price'] ? row?.['product_subtotal_price'] : '0')}" data-zone="${dataZone}"></span></p>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row?.['product_subtotal_price']}"
                                    hidden
                                >
                            </div>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let toolEle = row.querySelector('.table-row-tool');
                let assetEle = row.querySelector('.table-row-asset');
                let uomTimeEle = row.querySelector('.table-row-uom-time');
                let depreciationDataEle = row.querySelector('.table-row-depreciation-data');
                let depreciationLeaseDataEle = row.querySelector('.table-row-depreciation-lease-data');
                if (toolEle) {
                    let dataS2 = [];
                    if (data?.['tool_data']) {
                        dataS2 = [data?.['tool_data']];
                    }
                    FormElementControl.loadInitS2($(toolEle), dataS2);
                }
                if (assetEle) {
                    let dataS2 = [];
                    if (data?.['asset_data']) {
                        dataS2 = [data?.['asset_data']];
                    }
                    FormElementControl.loadInitS2($(assetEle), dataS2);
                }
                if (uomTimeEle) {
                    let dataS2 = [];
                    if (data?.['uom_time_data']) {
                        dataS2 = [data?.['uom_time_data']];
                    }
                    FormElementControl.loadInitS2($(uomTimeEle), dataS2);
                }
                if (depreciationDataEle) {
                    $(depreciationDataEle).val(JSON.stringify(data?.['depreciation_data'] ? data?.['depreciation_data'] : []));
                }
                if (depreciationLeaseDataEle) {
                    $(depreciationLeaseDataEle).val(JSON.stringify(data?.['depreciation_lease_data'] ? data?.['depreciation_lease_data'] : []));
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                RecoveryDataTableHandle.dtbProductHDCustom();
            },
        });
    };

    static dataTableDelivery(data) {
        RecoveryDataTableHandle.$tableDelivery.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "200px",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-lg">
                                    <input 
                                        type="radio" 
                                        class="form-check-input table-row-checkbox" 
                                        id="delivery-${row?.['delivery_data']?.['id'].replace(/-/g, "")}"
                                        data-id="${row?.['delivery_data']?.['id']}"
                                    >
                                    <label class="form-check-label table-row-item" for="delivery-${row?.['delivery_data']?.['id'].replace(/-/g, "")}">${row?.['delivery_data']?.['code']}</label>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let date = '';
                        if (row?.['delivery_data']?.['actual_delivery_date']) {
                            date = moment(row?.['delivery_data']?.['actual_delivery_date']).format('DD/MM/YYYY');
                        }
                        return `<span type="text" class="table-row-date">${date}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                RecoveryLoadDataHandle.loadCssToDtb('datable-delivery');
                RecoveryLoadDataHandle.loadEventRadio(RecoveryDataTableHandle.$tableDelivery);
                RecoveryDataTableHandle.dtbDeliveryHDCustom();
            },
        });
    };

    static dataTableDeliveryProduct(data) {
        RecoveryDataTableHandle.$tableDeliveryProduct.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "200px",
            columns: [
                {
                    targets: 0,
                    width: '40%',
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-lg">
                                    <input 
                                        type="radio" 
                                        class="form-check-input table-row-checkbox" 
                                        id="deli-product-${row?.['product_data']?.['id'].replace(/-/g, "")}"
                                        data-id="${row?.['product_data']?.['id']}"
                                    >
                                    <label class="form-check-label table-row-item" for="deli-product-${row?.['product_data']?.['id'].replace(/-/g, "")}">${row?.['product_data']?.['title']}</label>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-delivered">${row?.['quantity_delivered'] ? row?.['quantity_delivered'] : '0'}</span>`;
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-recovered">${row?.['quantity_remain_recovery'] ? row?.['quantity_remain_recovery'] : '0'}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-recovery">${row?.['quantity_recovery'] ? row?.['quantity_recovery'] : '0'}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                RecoveryLoadDataHandle.loadCssToDtb('datable-deli-product');
                RecoveryLoadDataHandle.loadEventRadio(RecoveryDataTableHandle.$tableDeliveryProduct);
                RecoveryDataTableHandle.dtbDeliveryProductHDCustom();
            },
        });
    };

    static dataTableProductNew(data) {
        RecoveryDataTableHandle.$tableProductNew.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "80vh",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let value = "";
                        if (row?.['tool_data']?.['id']) {
                            value = row?.['tool_data']?.['title'] ? row?.['tool_data']?.['title'] : '';
                        }
                        if (row?.['asset_data']?.['id']) {
                            value = row?.['asset_data']?.['title'] ? row?.['asset_data']?.['title'] : '';
                        }
                        return `<span class="table-row-code">${value}</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let value = "";
                        if (row?.['tool_data']?.['id']) {
                            value = row?.['tool_data']?.['code'] ? row?.['tool_data']?.['code'] : '';
                        }
                        if (row?.['asset_data']?.['id']) {
                            value = row?.['asset_data']?.['code'] ? row?.['asset_data']?.['code'] : '';
                        }
                        return `<span class="table-row-code">${value}</span>`;
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-remain-recovery">${row?.['quantity_remain_recovery'] ? row?.['quantity_remain_recovery'] : 0}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let checked = "";
                        if (row?.['quantity_recovery'] > 0) {
                            checked = "checked";
                        }
                        let hiddenCheck = "hidden"
                        let hiddenInput = "hidden"
                        if (row?.['tool_data']?.['id']) {
                            hiddenInput = "";
                        }
                        if (row?.['asset_data']?.['id']) {
                            hiddenCheck = "";
                        }
                        return `<div class="form-check form-check-lg d-flex align-items-center ${hiddenCheck}">
                                    <input type="checkbox" name="check-asset" class="form-check-input table-row-checkbox" id="check-asset-${row?.['asset_data']?.['id'].replace(/-/g, "")}" ${checked}>
                                </div>
                                <input class="form-control table-row-quantity-recovery text-black valid-num" value="${row?.['quantity_recovery'] ? row?.['quantity_recovery'] : 0}" ${hiddenInput}>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                RecoveryLoadDataHandle.loadCssToDtb('datable-deli-product-new');
                RecoveryDataTableHandle.dtbProductNewHDCustom();
            },
        });
    };

    static dataTableDepreciationDetail(data) {
        RecoveryDataTableHandle.$tableDepreciationDetail.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-month">${row?.['month']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-start-date">${row?.['begin'] ? row?.['begin'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-end-date">${row?.['end'] ? row?.['end'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-start-net-value" data-init-money="${parseFloat(row?.['start_value'] ? row?.['start_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-depreciation-value" data-init-money="${parseFloat(row?.['depreciation_value'] ? row?.['depreciation_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-end-net-value" data-init-money="${parseFloat(row?.['end_value'] ? row?.['end_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="table-row-lease-time">${row?.['lease_time'] ? row?.['lease_time'] : ''}</span>`;
                    }
                },
                {
                    targets: 7,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['lease_allocated']) {
                            return `<span class="mask-money table-row-lease-allocated" data-init-money="${parseFloat(row?.['lease_allocated'] ? row?.['lease_allocated'] : '0')}"></span>`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 8,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['lease_accumulative_allocated']) {
                            return `<span class="mask-money table-row-lease-accumulative-allocated" data-init-money="${parseFloat(row?.['lease_accumulative_allocated'] ? row?.['lease_accumulative_allocated'] : '0')}"></span>`;
                        }
                        return ``;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let leaseTimeEle = row.querySelector('.table-row-lease-time');
                let leaseAllocatedEle = row.querySelector('.table-row-lease-allocated');
                let leaseAccumulative = row.querySelector('.table-row-lease-accumulative-allocated');
                if (leaseTimeEle) {
                    if (data?.['lease_time']) {
                        let td = leaseTimeEle.closest('td');
                        if (td) {
                            $(td).addClass("bg-green-light-4");
                        }
                    }
                }
                if (leaseAllocatedEle) {
                    if (data?.['lease_allocated']) {
                        let td = leaseAllocatedEle.closest('td');
                        if (td) {
                            $(td).addClass("bg-blue-light-5");
                        }
                    }
                }
                if (leaseAccumulative) {
                    if (data?.['lease_accumulative_allocated']) {
                        let td = leaseAccumulative.closest('td');
                        if (td) {
                            $(td).addClass("bg-blue-light-5");
                        }
                    }
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                RecoveryLoadDataHandle.loadCssToDtb("table-depreciation-detail");
                RecoveryDataTableHandle.dtbDepreciationHDCustom();
            },
        });
    };

    // Custom dtb
    static dtbProductHDCustom() {
        let $table = RecoveryDataTableHandle.$tableProduct;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-edit-product-good-receipt').length) {
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-edit-product-good-receipt" data-bs-toggle="offcanvas" data-bs-target="#productCanvas">
                                    <span><span class="icon"><span class="feather-icon"><i class="far fa-edit"></i></span></span><span>${RecoveryLoadDataHandle.transEle.attr('data-edit')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
            }
        }
    };

    static dtbDeliveryHDCustom() {
        let $table = RecoveryDataTableHandle.$tableDelivery;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbDeliveryProductHDCustom() {
        let $table = RecoveryDataTableHandle.$tableDeliveryProduct;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbProductNewHDCustom() {
        let $table = RecoveryDataTableHandle.$tableProductNew;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbDepreciationHDCustom() {
        let $table = RecoveryDataTableHandle.$tableDepreciationDetail;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

}

// Store data
class RecoveryStoreDataHandle {
    static storeData() {
        // Lưu lại data row của tất cả dtb & draw() lại row, dòng checked sẽ được lưu thêm data sub từ các dtb phụ
        // dtb data cố định => store hết, dtb data động callAjax => store data có thay đổi

        let tool_data = [];
        let asset_data = [];
        let delivery_product_data = [];

        RecoveryDataTableHandle.$tableProductNew.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = RecoveryDataTableHandle.$tableProductNew.DataTable().row(row).index();
            let $row = RecoveryDataTableHandle.$tableProductNew.DataTable().row(rowIndex);
            let rowData = $row.data();

            let recoveryEle = row.querySelector('.table-row-quantity-recovery');
            if (recoveryEle) {
                if ($(recoveryEle).val()) {
                    rowData['quantity_recovery'] = parseFloat($(recoveryEle).val());
                }
            }

            RecoveryDataTableHandle.$tableProductNew.DataTable().row(rowIndex).data(rowData);
            if (rowData?.['tool_data']?.['id']) {
                tool_data.push(rowData);
            }
            if (rowData?.['asset_data']?.['id']) {
                asset_data.push(rowData);
            }
        });

        RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().row(row).index();
            let $row = RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().row(rowIndex);
            let rowData = $row.data();

            // update data row cho dòng đang được chọn
            let checked = row.querySelector('.table-row-checkbox:checked');
            if (checked) {
                rowData['tool_data'] = tool_data;
                rowData['asset_data'] = asset_data;
            }
            let recovery = 0;
            for (let toolData of rowData?.['tool_data'] ? rowData?.['tool_data'] : []) {
                recovery += toolData?.['quantity_recovery'] ? toolData?.['quantity_recovery'] : 0;
            }
            for (let assetData of rowData?.['asset_data'] ? rowData?.['asset_data'] : []) {
                recovery += assetData?.['quantity_recovery'] ? assetData?.['quantity_recovery'] : 0;
            }
            rowData['quantity_recovery'] = recovery;
            RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().row(rowIndex).data(rowData);
            delivery_product_data.push(rowData);

            if (checked) {
                let checkEle = row.querySelector('.table-row-checkbox');
                if (checkEle) {
                    checkEle.checked = true;
                }
            }
        });

        RecoveryDataTableHandle.$tableDelivery.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = RecoveryDataTableHandle.$tableDelivery.DataTable().row(row).index();
            let $row = RecoveryDataTableHandle.$tableDelivery.DataTable().row(rowIndex);
            let rowData = $row.data();

            let checked = row.querySelector('.table-row-checkbox:checked');
            if (checked) {  // update data hiện tại cho dòng được chọn
                rowData['delivery_product_data'] = delivery_product_data;
            }

            RecoveryDataTableHandle.$tableDelivery.DataTable().row(rowIndex).data(rowData);

            if (checked) {
                let checkEle = row.querySelector('.table-row-checkbox');
                if (checkEle) {
                    checkEle.checked = true;
                }
            }
        });

        return true;
    };

}

// Submit Form
class RecoverySubmitHandle {

    static setupDataDelivery() {
        let result = [];
        RecoveryDataTableHandle.$tableDelivery.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = RecoveryDataTableHandle.$tableDelivery.DataTable().row(row).index();
            let $row = RecoveryDataTableHandle.$tableDelivery.DataTable().row(rowIndex);
            let rowData = $row.data();
            // update depreciation data for recovery product
            for (let productData of rowData?.['delivery_product_data']) {
                for (let toolData of productData?.['tool_data']) {
                    delete toolData['picked_quantity'];
                    let target = RecoveryDataTableHandle.$tableProduct[0].querySelector(`[data-product-id="${RecoveryLoadDataHandle.$btnSaveDepreciation.attr('data-product-id')}"]`);
                    if (target) {
                        let targetRow = target.closest('tr');
                        if (targetRow) {
                            let depreciationLeaseDataEle = targetRow.querySelector('.table-row-depreciation-lease-data');
                            if (depreciationLeaseDataEle) {
                                if ($(depreciationLeaseDataEle).val() && RecoveryLoadDataHandle.$date.val()) {
                                    toolData['product_lease_end_date'] = moment(RecoveryLoadDataHandle.$date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
                                    toolData['depreciation_lease_data'] = JSON.parse($(depreciationLeaseDataEle).val());
                                }
                            }
                        }
                    }
                }
                for (let assetData of productData?.['asset_data']) {
                    delete assetData['picked_quantity'];
                    let target = RecoveryDataTableHandle.$tableProduct[0].querySelector(`[data-product-id="${RecoveryLoadDataHandle.$btnSaveDepreciation.attr('data-product-id')}"]`);
                    if (target) {
                        let targetRow = target.closest('tr');
                        if (targetRow) {
                            let depreciationLeaseDataEle = targetRow.querySelector('.table-row-depreciation-lease-data');
                            if (depreciationLeaseDataEle) {
                                if ($(depreciationLeaseDataEle).val() && RecoveryLoadDataHandle.$date.val()) {
                                    assetData['product_lease_end_date'] = moment(RecoveryLoadDataHandle.$date.val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
                                    assetData['depreciation_lease_data'] = JSON.parse($(depreciationLeaseDataEle).val());
                                }
                            }
                        }
                    }
                }
            }
            result.push(rowData);
        });
        return result;
    };

    static setupDataSubmit(_form) {
        if (RecoveryLoadDataHandle.$boxCustomer.val()) {
            _form.dataForm['customer_id'] = RecoveryLoadDataHandle.$boxCustomer.val();
            let data = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.$boxCustomer, RecoveryLoadDataHandle.$boxCustomer.val());
            if (data) {
                _form.dataForm['customer_data'] = data;
            }
        }
        if (RecoveryLoadDataHandle.$boxLeaseOrder.val()) {
            _form.dataForm['lease_order_id'] = RecoveryLoadDataHandle.$boxLeaseOrder.val();
            let data = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.$boxLeaseOrder, RecoveryLoadDataHandle.$boxLeaseOrder.val());
            if (data) {
                _form.dataForm['lease_order_data'] = data;
            }
        }
        let dateVal = RecoveryLoadDataHandle.$date.val();
        if (dateVal) {
            _form.dataForm['date_recovery'] = moment(dateVal,
                'DD/MM/YYYY').format('YYYY-MM-DD')
        }
        if (RecoveryLoadDataHandle.$boxStatus.val()) {
            _form.dataForm['status_recovery'] = parseInt(RecoveryLoadDataHandle.$boxStatus.val());
        }


        let recovery_delivery_data = RecoverySubmitHandle.setupDataDelivery();
        if (recovery_delivery_data.length > 0) {
            _form.dataForm['recovery_delivery_data'] = recovery_delivery_data;
        }
        if (recovery_delivery_data.length <= 0) {
            $.fn.notifyB({description: RecoveryLoadDataHandle.transEle.attr('data-required-product')}, 'failure');
            return false;
        }
        let tableWrapper = document.getElementById('datable-product_wrapper');
        if (tableWrapper) {
            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');
            if (tableFt) {
                let elePretaxAmountRaw = tableFt.querySelector('.good-receipt-product-pretax-amount-raw');
                if ($(elePretaxAmountRaw).val()) {
                    _form.dataForm['total_pretax'] = parseFloat($(elePretaxAmountRaw).val());
                }
                let eleTaxesRaw = tableFt.querySelector('.good-receipt-product-taxes-raw');
                if ($(eleTaxesRaw).val()) {
                    _form.dataForm['total_tax'] = parseFloat($(eleTaxesRaw).val());
                }
                let eleTotalRaw = tableFt.querySelector('.good-receipt-product-total-raw');
                if ($(eleTotalRaw).val()) {
                    _form.dataForm['total'] = parseFloat($(eleTotalRaw).val());
                }
                let finalRevenueBeforeTax = tableFt.querySelector('.good-receipt-final-revenue-before-tax');
                if (finalRevenueBeforeTax.value) {
                    _form.dataForm['total_revenue_before_tax'] = parseFloat(finalRevenueBeforeTax.value);
                }
            }
        }
        // attachment
        if (_form.dataForm.hasOwnProperty('attachment')) {
          _form.dataForm['attachment'] = $x.cls.file.get_val(_form.dataForm?.['attachment'], []);
        }
        return _form.dataForm;
    };
}

// COMMON FUNCTION
class RecoveryCommonHandle {
    static filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }

    static reOrderRowTable($table) {
        for (let i = 0; i < $table[0].tBodies[0].rows.length; i++) {
            let row = $table[0].tBodies[0].rows[i];
            let dataRowRaw = row?.querySelector('.table-row-order')?.getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                dataRow['order'] = (i + 1);
                row?.querySelector('.table-row-order').setAttribute('data-row', JSON.stringify(dataRow));
            }
        }
    }

    static deleteRowGR(currentRow, $table) {
        let rowIndex = $table.DataTable().row(currentRow).index();
        let row = $table.DataTable().row(rowIndex);
        row.remove().draw();
    }
}


