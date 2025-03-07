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
        RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxStatus, RecoveryLoadDataHandle.dataStatus);
        RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxCustomer);
        RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxLeaseOrder);
        RecoveryLoadDataHandle.loadEventRadio(RecoveryLoadDataHandle.$depreciationModal);
        // dtb
        RecoveryDataTableHandle.dataTableProduct();
        RecoveryDataTableHandle.dataTableDelivery();
        RecoveryDataTableHandle.dataTableDeliveryProduct();
        RecoveryDataTableHandle.dataTableProductNew();
        RecoveryDataTableHandle.dataTableProductLeased();
        RecoveryDataTableHandle.dataTableWareHouse();
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

    static loadGenerateLease(ele) {
        let idTbl = UtilControl.generateRandomString(12);
        let trEle = $(ele).closest('tr');
        let iconEle = $(ele).find('.icon-collapse-app-wf');

        iconEle.toggleClass('fa-caret-right').toggleClass('fa-caret-down');

        if (iconEle.hasClass('fa-caret-right')) {
            trEle.removeClass('bg-grey-light-5');
            iconEle.removeClass('text-dark').addClass('text-secondary');
            trEle.next().find('.child-workflow-group').slideToggle({
                complete: function () {
                    trEle.next().addClass('hidden');
                }
            });
        }

        if (iconEle.hasClass('fa-caret-down')) {
            trEle.addClass('bg-grey-light-5');
            iconEle.removeClass('text-secondary').addClass('text-dark');

            let dataDtb = [];
            let inputRecovery = 0;
            let fromRecovery = 0;
            let totalRecovery = 0;
            RecoveryDataTableHandle.$tableWarehouse.DataTable().rows().every(function () {
                let row = this.node();
                if (!$(row).hasClass('child-workflow-list')) {
                    let recoveryEle = row.querySelector('.table-row-quantity-recovery');
                    if (recoveryEle) {
                        if ($(recoveryEle).val()) {
                            totalRecovery += parseFloat($(recoveryEle).val());
                        }
                    }
                }
            });
            let inputEle = trEle[0].querySelector('.table-row-quantity-recovery');
            if (inputEle) {
                if ($(inputEle).val()) {
                    inputRecovery = parseFloat($(inputEle).val());
                    fromRecovery = totalRecovery - inputRecovery + 1;
                }
            }
            for (let i = fromRecovery; i <= totalRecovery; i++) {
                dataDtb.push({'code': ''})
            }

            let rowIndex = RecoveryDataTableHandle.$tableWarehouse.DataTable().row(trEle[0]).index();
            let $row = RecoveryDataTableHandle.$tableWarehouse.DataTable().row(rowIndex);
            let rowData = $row.data();
            if (rowData?.['lease_generate_data']) {
                if (rowData?.['lease_generate_data'].length > 0 && rowData?.['lease_generate_data'].length === dataDtb.length) {
                    dataDtb = rowData?.['lease_generate_data'];
                }
            }

            if (!trEle.next().hasClass('child-workflow-list')) {
                let dtlSub = `<table id="${idTbl}" class="table table-child nowrap w-100 mb-5"><thead></thead><tbody></tbody></table>`
                $(ele).closest('tr').after(
                    `<tr class="child-workflow-list"><td colspan="4"><div class="child-workflow-group pt-3 pb-3 ml-3 pl-5 pr-5 hidden-simple">${dtlSub}</div></td></tr>`
                );
                RecoveryDataTableHandle.dataTableLeaseGenerate(idTbl, dataDtb);
            } else {
                let $child = trEle.next();
                if ($child.length > 0) {
                    let tblChild = $child[0].querySelector('.table-child');
                    if (tblChild) {
                        let count = $(tblChild).DataTable().data().count();
                        if (count !== inputRecovery) {
                            $(tblChild).DataTable().clear().draw();
                            $(tblChild).DataTable().rows.add(dataDtb).draw();
                        }
                    }
                }
            }
            trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
        }
        return true;
    };

    static loadCheckExceedQuantity() {
        let check = true;
        RecoveryDataTableHandle.$tableProductLeased.DataTable().rows().every(function () {
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
        RecoveryDataTableHandle.$tableProductNew.DataTable().rows().every(function () {
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
                RecoveryDataTableHandle.$tableProductNew.DataTable().rows.add([rowData]).draw();

                RecoveryDataTableHandle.$tableProductLeased.DataTable().clear().draw();
                RecoveryDataTableHandle.$tableProductLeased.DataTable().rows.add(rowData?.['product_quantity_leased_data'] ? rowData?.['product_quantity_leased_data'] : []).draw();
            }
        }
    };

    static loadCheckNewLeasedProduct() {
        RecoveryLoadDataHandle.loadDtbPW();
        return true;
    };

    static loadDtbPW() {
        WindowControl.showLoading();
        $.fn.callAjax2({
                'url': RecoveryLoadDataHandle.urlEle.attr('data-warehouse'),
                'method': 'GET',
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('warehouse_inventory_list') && Array.isArray(data.warehouse_inventory_list)) {

                        let checkedNewEle = RecoveryDataTableHandle.$tableProductNew[0].querySelector('.table-row-checkbox:checked');
                        if (checkedNewEle) {
                            let row = checkedNewEle.closest('tr');
                            if (row) {
                                let rowIndex = RecoveryDataTableHandle.$tableProductNew.DataTable().row(row).index();
                                let $row = RecoveryDataTableHandle.$tableProductNew.DataTable().row(rowIndex);
                                let dataRow = $row.data();
                                RecoveryLoadDataHandle.loadSetupDataPW(data?.['warehouse_inventory_list'], dataRow);
                            }
                        }

                        let checkedLeasedEle = RecoveryDataTableHandle.$tableProductLeased[0].querySelector('.table-row-checkbox:checked');
                        if (checkedLeasedEle) {
                            let row = checkedLeasedEle.closest('tr');
                            if (row) {
                                let rowIndex = RecoveryDataTableHandle.$tableProductLeased.DataTable().row(row).index();
                                let $row = RecoveryDataTableHandle.$tableProductLeased.DataTable().row(rowIndex);
                                let dataRow = $row.data();
                                RecoveryLoadDataHandle.loadSetupDataPW(data?.['warehouse_inventory_list'], dataRow);
                            }
                        }

                        RecoveryDataTableHandle.$tableWarehouse.DataTable().clear().draw();
                        RecoveryDataTableHandle.$tableWarehouse.DataTable().rows.add(data?.['warehouse_inventory_list']).draw();
                        let warehouseArea = RecoveryLoadDataHandle.$canvasMain[0].querySelector('.dtb-warehouse-area');
                        if (warehouseArea) {
                            warehouseArea.removeAttribute('hidden');
                        }

                        WindowControl.hideLoading();
                    }
                }
            }
        )
    };

    static loadSetupDataPW(data, dataRow) {
        let dataCheck = {};
        for (let dataPW of dataRow?.['product_warehouse_data'] ? dataRow?.['product_warehouse_data'] : []) {
            dataCheck[dataPW?.['warehouse_id']] = dataPW;
        }
        for (let dataObj of data) {
            if (dataCheck.hasOwnProperty(dataObj?.['warehouse_id'])) {
                dataObj['quantity_recovery'] = dataCheck[dataObj?.['warehouse_id']]?.['quantity_recovery'];
                dataObj['lease_generate_data'] = dataCheck[dataObj?.['warehouse_id']]?.['lease_generate_data'];
            }
        }
    };

    static loadSerial() {
        let data = [{'id': '', 'title': 'Select...',},];
        let checkedNewEle = RecoveryDataTableHandle.$tableProductNew[0].querySelector('.table-row-checkbox:checked');
        if (checkedNewEle) {
            let rowTarget = checkedNewEle.closest('tr');
            if (rowTarget) {
                let rowIndex = RecoveryDataTableHandle.$tableProductNew.DataTable().row(rowTarget).index();
                let $row = RecoveryDataTableHandle.$tableProductNew.DataTable().row(rowIndex);
                let rowData = $row.data();
                if (rowData?.['delivery_data']) {
                    for (let deli_data of rowData?.['delivery_data']) {
                        if (deli_data?.['serial_data']) {
                            for (let serial_data of deli_data?.['serial_data']) {
                                if (serial_data?.['product_warehouse_serial_data']) {
                                    data.push(serial_data?.['product_warehouse_serial_data']);
                                }
                            }
                        }
                    }
                }
            }
        }
        let checkedLeasedEle = RecoveryDataTableHandle.$tableProductLeased[0].querySelector('.table-row-checkbox:checked');
        if (checkedLeasedEle) {
            let rowTarget = checkedLeasedEle.closest('tr');
            if (rowTarget) {
                let rowIndex = RecoveryDataTableHandle.$tableProductLeased.DataTable().row(rowTarget).index();
                let $row = RecoveryDataTableHandle.$tableProductLeased.DataTable().row(rowIndex);
                let rowData = $row.data();
                if (rowData?.['delivery_data']) {
                    for (let deli_data of rowData?.['delivery_data']) {
                        if (deli_data?.['serial_data']) {
                            for (let serial_data of deli_data?.['serial_data']) {
                                if (serial_data?.['product_warehouse_serial_data']) {
                                    data.push(serial_data?.['product_warehouse_serial_data']);
                                }
                            }
                        }
                    }
                }
            }
        }
        return data;
    };

    static loadLineDetail() {
        let dataJSON = {};
        let result = [];
        // Make a deep copy of the delivery data
        let deliveryData = JSON.parse(JSON.stringify(RecoverySubmitHandle.setupDataDelivery()));
        for (let deliData of deliveryData) {
            if (deliData?.['delivery_product_data']) {
                for (let productData of deliData?.['delivery_product_data']) {
                    if (dataJSON.hasOwnProperty(productData?.['product_id'])) {
                        dataJSON[productData?.['product_id']]['quantity_recovery'] += productData?.['quantity_recovery'];
                    } else {
                        dataJSON[productData?.['product_id']] = productData;
                    }
                }
            }
        }
        for (let key in dataJSON) {
            result.push(dataJSON[key]);
        }
        RecoveryDataTableHandle.$tableProduct.DataTable().clear().draw();
        RecoveryDataTableHandle.$tableProduct.DataTable().rows.add(result).draw();
        return true;
    };

    // DEPRECIATION
    static loadShowDepreciation(ele) {
        let row = ele.closest('tr');
        if (row) {
            let productEle = row.querySelector('.table-row-item');
            if (productEle) {
                if ($(productEle).val()) {
                    let dataProduct = SelectDDControl.get_data_from_idx($(productEle), $(productEle).val());
                    if (dataProduct) {
                        RecoveryLoadDataHandle.$btnSaveDepreciation.attr('data-product-id', dataProduct?.['id']);
                    }
                }
            }

            let depreciationMethodEle = row.querySelector('.table-row-depreciation-method');
            let $methodEle = $('#depreciation_method');
            if (depreciationMethodEle && $methodEle.length > 0) {
                RecoveryLoadDataHandle.loadInitS2($methodEle, RecoveryLoadDataHandle.dataDepreciationMethod, {}, RecoveryLoadDataHandle.$depreciationModal);
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
                if ($(leaseEndDateEle).val()) {
                    $leaseEndDateEle.val(moment($(leaseEndDateEle).val()).format('DD/MM/YYYY'));
                }
                $leaseEndDateEle.val(RecoveryLoadDataHandle.$date.val()).trigger('change');
            }
        }
        RecoveryLoadDataHandle.loadDataTableDepreciation();
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
                        "adjust": parseInt($adjustEle.val())
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
        let target = $table[0].querySelector(`.table-row-item[data-product-id="${RecoveryLoadDataHandle.$btnSaveDepreciation.attr('data-product-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');

            if (targetRow) {
                let $methodEle = $('#depreciation_method');
                let $adjust = $('#depreciation_adjustment');
                let $startEle = $('#depreciation_start_date');
                let $endEle = $('#depreciation_end_date');
                let $leaseStartEle = $('#lease_start_date');
                let $leaseEndEle = $('#lease_end_date');
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
                    }
                }
                let fnCost = 0;
                RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().rows().every(function () {
                    let row = this.node();
                    let rowIndex = RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().row(row).index();
                    let $row = RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().row(rowIndex);
                    let dataRow = $row.data();
                    if (dataRow?.['lease_accumulative_allocated']) {
                        fnCost = dataRow?.['lease_accumulative_allocated'];
                    }
                });
                let depreciationSubtotalEle = targetRow.querySelector('.table-row-depreciation-subtotal');
                let fnCostEle = targetRow.querySelector('.table-row-subtotal');
                let fnCostRawEle = targetRow.querySelector('.table-row-subtotal-raw');

                if (depreciationSubtotalEle && fnCostEle && fnCostRawEle) {
                    $(depreciationSubtotalEle).val(fnCost);
                    $(fnCostEle).attr('data-init-money', String(fnCost));
                    $(fnCostRawEle).val(String(fnCost));
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
            RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxCustomer, [data?.['customer_data']]);
        }
        if (data?.['lease_order_data']) {
            RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxLeaseOrder, [data?.['lease_order_data']]);
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
    static $tableProductLeased = $('#datable-deli-product-leased');
    static $tableWarehouse = $('#datable-warehouse');
    static $tableDepreciationDetail = $('#table-depreciation-detail');

    static dataTableProduct(data) {
        RecoveryDataTableHandle.$tableProduct.not('.dataTable').DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            columns: [  // 25,325,325,150,175,325,150,270,25 (1920p)
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '18%',
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-item-show zone-readonly" rows="2" readonly>${row?.['product_data']?.['title']}</textarea>
                                <div class="row table-row-item-area hidden">
                                    <div class="col-12 col-md-12 col-lg-12">
                                        <select
                                            class="form-select table-row-item"
                                            data-product-id="${row?.['product_data']?.['id']}"
                                            data-url="${RecoveryLoadDataHandle.urlEle.attr('data-md-product')}"
                                            data-method="GET"
                                            data-keyResp="product_sale_list"
                                            readonly
                                        >
                                        </select>
                                    </div>
                                </div>`;
                    },
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<div class="row"><textarea class="table-row-description form-control" rows="2" readonly>${row?.['product_data']?.['description'] ? row?.['product_data']?.['description'] : ''}</textarea></div>`;
                    }
                },
                {
                    targets: 3,
                    width: '7.8125%',
                    render: () => {
                        return `<select 
                                    class="form-control table-row-uom"
                                    data-url="${RecoveryLoadDataHandle.urlEle.attr('data-md-uom')}"
                                    data-method="GET"
                                    data-keyResp="unit_of_measure"
                                    required
                                    readonly
                                >
                                </select>`;
                    }
                },
                {
                    targets: 4,
                    width: '9.11458333333%',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-quantity valid-num" value="${row?.['quantity_recovery']}" required readonly>`;
                    }
                },
                {
                    targets: 5,
                    width: '16.9270833333%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-price" 
                                    value="${row?.['product_unit_price'] ? row?.['product_unit_price'] : 0}"
                                    data-return-type="number"
                                    readonly
                                >`;
                    }
                },
                {
                    targets: 6,
                    width: '7.8125%',
                    render: (data, type, row) => {
                        return `<div class="row">
                                <select 
                                    class="form-control table-row-tax"
                                    data-url="${RecoveryLoadDataHandle.urlEle.attr('data-md-tax')}"
                                    data-method="GET"
                                    data-keyResp="tax_list"
                                >
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row?.['product_tax_amount']}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row?.['product_tax_amount']}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '14.0625%',
                    render: (data, type, row) => {
                        return `<div class="row subtotal-area">
                                    <div class="d-flex align-items-center">
                                        <button
                                            type="button"
                                            class="btn btn-icon btn-depreciation-detail"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#viewDepreciationDetail"
                                        ><i class="fas fa-ellipsis-h"></i>
                                        </button><p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['product_depreciation_subtotal'] ? row?.['product_depreciation_subtotal'] : '0')}"></span></p>
                                    </div>
                                    <input
                                        type="text"
                                        class="form-control table-row-subtotal-raw"
                                        value="${row?.['product_depreciation_subtotal']}"
                                        hidden
                                    >
                                    
                                    <input type="text" class="form-control table-row-depreciation-subtotal" value="${row?.['product_depreciation_subtotal'] ? row?.['product_depreciation_subtotal'] : 0}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-method" value="${row?.['product_depreciation_method'] ? row?.['product_depreciation_method'] : 0}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-start-date" value="${row?.['product_depreciation_start_date'] ? row?.['product_depreciation_start_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-end-date" value="${row?.['product_depreciation_end_date'] ? row?.['product_depreciation_end_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-adjustment" value="${row?.['product_depreciation_adjustment'] ? row?.['product_depreciation_adjustment'] : 1}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-time" value="${row?.['product_depreciation_time'] ? row?.['product_depreciation_time'] : 0}" hidden>
                                
                                    <input type="text" class="form-control table-row-lease-start-date" value="${row?.['product_lease_start_date'] ? row?.['product_lease_start_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-lease-end-date" value="${row?.['product_lease_end_date'] ? row?.['product_lease_end_date'] : ''}" hidden>
                                </div>`;
                    }
                },
                {
                    targets: 8,
                    width: '1.30208333333%',
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let itemEle = row.querySelector('.table-row-item');
                let uomEle = row.querySelector('.table-row-uom');
                let taxEle = row.querySelector('.table-row-tax');
                if (itemEle) {
                    let dataS2 = [];
                    if (data?.['product_data']) {
                        dataS2 = [data?.['product_data']];
                    }
                    RecoveryLoadDataHandle.loadInitS2($(itemEle), dataS2);
                }
                if (uomEle) {
                    let dataS2 = [];
                    if (data?.['uom_data']) {
                        dataS2 = [data?.['uom_data']];
                    }
                    RecoveryLoadDataHandle.loadInitS2($(uomEle), dataS2);
                }
                if (taxEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    RecoveryLoadDataHandle.loadInitS2($(taxEle), dataS2);
                }
            },
            drawCallback: function () {
                RecoveryDataTableHandle.dtbProductHDCustom();
                $.fn.initMaskMoney2();
            },
        });
    };

    static dataTableDelivery(data) {
        RecoveryDataTableHandle.$tableDelivery.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
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
            },
        });
    };

    static dataTableDeliveryProduct(data) {
        RecoveryDataTableHandle.$tableDeliveryProduct.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    width: '40%',
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-lg">
                                    <input 
                                        type="radio" 
                                        class="form-check-input table-row-checkbox" 
                                        id="deli-product-${row?.['offset_data']?.['id'].replace(/-/g, "")}"
                                        data-id="${row?.['offset_data']?.['id']}"
                                    >
                                    <label class="form-check-label table-row-item" for="deli-product-${row?.['offset_data']?.['id'].replace(/-/g, "")}">${row?.['offset_data']?.['title']}</label>
                                </div>`;
                    }
                },
                // {
                //     targets: 1,
                //     width: '20%',
                //     render: (data, type, row) => {
                //         return `<span class="table-row-quantity-ordered">${row?.['product_quantity'] ? row?.['product_quantity'] : '0'}</span>`;
                //     }
                // },
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
            },
        });
    };

    static dataTableProductNew(data) {
        RecoveryDataTableHandle.$tableProductNew.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            searching: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<div class="d-flex align-items-center">
                                    <div class="form-check form-check-lg">
                                        <input 
                                            type="radio" 
                                            class="form-check-input table-row-checkbox" 
                                            id="new-product-${row?.['offset_data']?.['id'].replace(/-/g, "")}"
                                            data-id="${row?.['offset_data']?.['id']}"
                                        >
                                        <label class="form-check-label" for="new-product-${row?.['offset_data']?.['id'].replace(/-/g, "")}">${row?.['offset_data']?.['title'] ? row?.['offset_data']?.['title'] : ''}</label>
                                    </div>
                                </div>
                                <div class="row table-row-item-area hidden">
                                    <div class="col-12 col-md-12 col-lg-12">
                                        <select
                                            class="form-select table-row-item"
                                            data-url="${RecoveryLoadDataHandle.urlEle.attr('data-md-product')}"
                                            data-method="GET"
                                            data-keyResp="product_sale_list"
                                            data-product-id="${row?.['offset_data']?.['id']}"
                                            readonly
                                        >
                                        </select>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row?.['offset_data']?.['code'] ? row?.['offset_data']?.['code'] : ''}</span>`;
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let delivered = row?.['quantity_delivered'] ? row?.['quantity_delivered'] : 0;
                        let leased = row?.['product_quantity_leased'] ? row?.['product_quantity_leased'] : 0;
                        let value = delivered - leased;
                        return `<span class="table-row-quantity-delivered">${value}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-remain-recovery">${row?.['quantity_new_remain_recovery'] ? row?.['quantity_new_remain_recovery'] : '0'}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let value = 0;
                            if (row?.['quantity_recovery'] && row?.['product_quantity_leased_data']) {
                                value = row?.['quantity_recovery'] - row?.['product_quantity_leased_data'].length;
                            }
                        return `<span class="table-row-quantity-recovery">${value}</span>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let itemEle = row.querySelector('.table-row-item');
                if (itemEle) {
                    let dataS2 = [];
                    if (data?.['offset_data']) {
                        dataS2 = [data?.['offset_data']];
                    }
                    RecoveryLoadDataHandle.loadInitS2($(itemEle), dataS2);
                    $(itemEle).attr('data-product-id', data?.['offset_data']?.['id']);
                }
            },
            drawCallback: function () {
                RecoveryDataTableHandle.dtbProductNewHDCustom();
            },
        });
    };

    static dataTableProductLeased(data) {
        RecoveryDataTableHandle.$tableProductLeased.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            searching: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    width: '25%',
                    render: (data, type, row) => {
                        return `<div class="d-flex align-items-center">
                                    <div class="form-check form-check-lg">
                                        <input 
                                            type="radio" 
                                            class="form-check-input table-row-checkbox" 
                                            id="leased-product-${row?.['offset_data']?.['id'].replace(/-/g, "")}"
                                            data-id="${row?.['offset_data']?.['id']}"
                                        >
                                        <label class="form-check-label" for="leased-product-${row?.['offset_data']?.['id'].replace(/-/g, "")}">${row?.['offset_data']?.['title'] ? row?.['offset_data']?.['title'] : ''}</label>
                                    </div>
                                </div>
                                <div class="row table-row-item-area hidden">
                                    <div class="col-12 col-md-12 col-lg-12">
                                        <select
                                            class="form-select table-row-item"
                                            data-url="${RecoveryLoadDataHandle.urlEle.attr('data-md-product')}"
                                            data-method="GET"
                                            data-keyResp="product_sale_list"
                                            data-product-id="${row?.['offset_data']?.['id']}"
                                            readonly
                                        >
                                        </select>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row?.['offset_data']?.['lease_code'] ? row?.['offset_data']?.['lease_code'] : ''}</span>`;
                    },
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-delivered">${row?.['picked_quantity'] ? row?.['picked_quantity'] : '0'}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-remain-recovery">${row?.['quantity_leased_remain_recovery'] ? row?.['quantity_leased_remain_recovery'] : '0'}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-recovery">${row?.['quantity_recovery'] ? row?.['quantity_recovery'] : '0'}</span>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let itemEle = row.querySelector('.table-row-item');
                if (itemEle) {
                    let dataS2 = [];
                    if (data?.['product_data']) {
                        dataS2 = [data?.['product_data']];
                    }
                    RecoveryLoadDataHandle.loadInitS2($(itemEle), dataS2);
                    $(itemEle).attr('data-product-id', data?.['product_data']?.['id']);
                }
            },
            drawCallback: function () {
                RecoveryDataTableHandle.dtbProductLeasedHDCustom();
            },
        });
    };

    static dataTableWareHouse(data) {
        RecoveryDataTableHandle.$tableWarehouse.DataTableDefault({
            ajax: {
                url: RecoveryLoadDataHandle.urlEle.attr('data-warehouse'),
                type: "GET",
                dataSrc: function (resp) {
                    let dataAjax = $.fn.switcherResp(resp);
                    if (data) {
                        return data;
                    }
                    if (dataAjax && dataAjax.hasOwnProperty('warehouse_inventory_list')) return dataAjax['warehouse_inventory_list'];
                    return [];
                },
            },
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: "80%",
                    render: (data, type, row) => {
                        return `<button class="btn-collapse-app-wf btn btn-icon btn-rounded mr-1"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${row?.['warehouse_data']?.['title'] ? row?.['warehouse_data']?.['title'] : ""}</b>`;
                    }
                },
                {
                    targets: 1,
                    width: "20%",
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-quantity-recovery valid-num" value="${row?.['quantity_recovery'] ? row?.['quantity_recovery'] : 0}">`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                RecoveryLoadDataHandle.loadCssToDtb('datable-warehouse');
            },
        }, false);
    };

    static dataTableLeaseGenerate(idTbl, data) {
        $('#' + idTbl).DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columns: [
                {
                    title: 'Serial',
                    width: '25%',
                    render: (data, type, row) => {
                        return `<select class="form-select table-row-serial" data-keyText="serial_number" hidden></select>`;
                    }
                },
                {
                    title: 'Note',
                    width: '60%',
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-remark" rows="2">${row?.['remark'] ? row?.['remark'] : ''}</textarea>`;
                    }
                },
                {
                    title: 'Get',
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-lg">
                                    <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox" checked disabled>
                                </div>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let serialEle = row.querySelector('.table-row-serial');
                let remarkEle = row.querySelector('.table-row-remark');
                if (serialEle) {
                    let serialData = RecoveryLoadDataHandle.loadSerial();
                    // call ajax để lọc ra các serial của các phiếu thu hồi trước đó (đã duyệt) cho cùng phiếu cho thuê hiện tại
                    WindowControl.showLoading();
                    $.fn.callAjax2({
                            'url': RecoveryLoadDataHandle.urlEle.attr('data-recovery-lease-generate'),
                            'method': 'GET',
                            'data': {
                                'goods_recovery__lease_order_id': RecoveryLoadDataHandle.$boxLeaseOrder.val(),
                                'goods_recovery__system_status': 3,
                            },
                            'isDropdown': true,
                        }
                    ).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                if (data.hasOwnProperty('recovery_lease_generate_list') && Array.isArray(data.recovery_lease_generate_list)) {
                                    let checkList = [];
                                    for (let dataGen of data?.['recovery_lease_generate_list']) {
                                        checkList.push(dataGen?.['serial_id']);
                                    }
                                    let fnData = [];
                                    for (let serial of serialData) {
                                        if (!checkList.includes(serial?.['id'])) {
                                            fnData.push(serial);
                                        }
                                    }
                                    RecoveryLoadDataHandle.loadInitS2($(serialEle), fnData, {}, RecoveryLoadDataHandle.$canvasMain, false, {'res2': 'serial_number'});
                                    if (fnData.length === 0) {
                                        serialEle.removeAttribute('hidden');
                                    }
                                    if (data?.['serial_id']) {
                                        $(serialEle).val(data?.['serial_id']).trigger('change');
                                    }

                                    WindowControl.hideLoading();
                                }
                            }
                        }
                    )

                    $(serialEle).on('change', function () {
                        let $ele = $(this);
                        let val = $ele.val();
                        if (val) {
                            RecoveryDataTableHandle.$tableWarehouse.DataTable().rows().every(function () {
                                let rowCheck1 = this.node();
                                if (!$(rowCheck1).hasClass('child-workflow-list')) {
                                    let $child = $(rowCheck1).next();
                                    if ($child.length > 0) {
                                        let tblChild = $child[0].querySelector('.table-child');
                                        if (tblChild) {
                                            $(tblChild).DataTable().rows().every(function () {
                                                let rowCheck2 = this.node();
                                                if (row !== rowCheck2) {
                                                    let serialEle = rowCheck2.querySelector('.table-row-serial');
                                                    if ($(serialEle).val() === val) {
                                                        $ele.val('').trigger('change');
                                                        $.fn.notifyB({description: RecoveryLoadDataHandle.transEle.attr('data-unique-serial')}, 'failure');
                                                        return false;
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                        RecoveryStoreDataHandle.storeData();
                    });
                }
                if (remarkEle) {
                    $(remarkEle).on('change', function () {
                        RecoveryStoreDataHandle.storeData();
                    });
                }
            },
            drawCallback: function () {
                // add css to Dtb
                RecoveryLoadDataHandle.loadCssToDtb(idTbl);
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


                        // return `<span class="mask-money table-row-accumulative" data-init-money="${parseFloat(row?.['accumulative_value'] ? row?.['accumulative_value'] : '0')}"></span>`;
                    }
                },
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
                RecoveryLoadDataHandle.loadCssToDtb("table-depreciation-detail");
            },
        });
    };

    // Custom dtb
    static dtbProductHDCustom() {
        let $table = RecoveryDataTableHandle.$tableProduct;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-edit-product-good-receipt').length) {
                let $group = $(`<button type="button" class="btn btn-outline-secondary btn-floating" id="btn-edit-product-good-receipt" data-bs-toggle="offcanvas" data-bs-target="#productCanvas">
                                    <span><span class="icon"><span class="feather-icon"><i class="far fa-edit"></i></span></span><span>${RecoveryLoadDataHandle.transEle.attr('data-edit')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
            }
        }
    };

    static dtbProductNewHDCustom() {
        let wrapper$ = RecoveryDataTableHandle.$tableProductNew.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#label-new-product').length) {
                let $group = $(`<b id="label-new-product">${RecoveryLoadDataHandle.transEle.attr('data-new-products')}</b>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
            }
        }
    };

    static dtbProductLeasedHDCustom() {
            let wrapper$ = RecoveryDataTableHandle.$tableProductLeased.closest('.dataTables_wrapper');
            let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
            let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
            headerToolbar$.prepend(textFilter$);

            if (textFilter$.length > 0) {
                textFilter$.css('display', 'flex');
                // Check if the button already exists before appending
                if (!$('#label-leased-product').length) {
                    let $group = $(`<b id="label-leased-product">${RecoveryLoadDataHandle.transEle.attr('data-leased-products')}</b>`);
                    textFilter$.append(
                        $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                    );
                }
            }
        };

}

// Calculate
class RecoveryCalculateHandle {
    static calculateTotal(table) {
        let tableWrapper = document.getElementById('datable-product_wrapper');
        if (tableWrapper) {
            let tableFt = tableWrapper.querySelector('.dataTables_scrollFoot');
            let pretaxAmount = 0;
            let taxAmount = 0;
            let elePretaxAmount = tableFt.querySelector('.good-receipt-product-pretax-amount');
            let eleTaxes = tableFt.querySelector('.good-receipt-product-taxes');
            let eleTotal = tableFt.querySelector('.good-receipt-product-total');
            let elePretaxAmountRaw = tableFt.querySelector('.good-receipt-product-pretax-amount-raw');
            let eleTaxesRaw = tableFt.querySelector('.good-receipt-product-taxes-raw');
            let eleTotalRaw = tableFt.querySelector('.good-receipt-product-total-raw');
            let finalRevenueBeforeTax = tableFt.querySelector('.good-receipt-final-revenue-before-tax');
            if (!table.querySelector('.dataTables_empty')) {
                if (elePretaxAmount && eleTaxes && eleTotal) {
                    let tableLen = table.tBodies[0].rows.length;
                    for (let i = 0; i < tableLen; i++) {
                        let row = table.tBodies[0].rows[i];
                        // calculate Pretax Amount
                        let subtotalRaw = row.querySelector('.table-row-subtotal-raw');
                        if (subtotalRaw) {
                            if (subtotalRaw.value) {
                                pretaxAmount += parseFloat(subtotalRaw.value)
                            }
                        }
                        // calculate Tax Amount
                        let subTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
                        if (subTaxAmountRaw) {
                            if (subTaxAmountRaw.value) {
                                taxAmount += parseFloat(subTaxAmountRaw.value)
                            }
                        }
                    }
                    let totalFinal = (pretaxAmount + taxAmount);
                    $(elePretaxAmount).attr('data-init-money', String(pretaxAmount));
                    elePretaxAmountRaw.value = pretaxAmount;
                    finalRevenueBeforeTax.value = pretaxAmount;
                    $(eleTaxes).attr('data-init-money', String(taxAmount));
                    eleTaxesRaw.value = taxAmount;
                    $(eleTotal).attr('data-init-money', String(totalFinal));
                    eleTotalRaw.value = totalFinal;
                }
            } else {
                $(elePretaxAmount).attr('data-init-money', String(0));
                elePretaxAmountRaw.value = '0';
                finalRevenueBeforeTax.value = '0';
                $(eleTaxes).attr('data-init-money', String(0));
                eleTaxesRaw.value = '0';
                $(eleTotal).attr('data-init-money', String(0));
                eleTotalRaw.value = '0';
            }
            $.fn.initMaskMoney2();
        }
        $.fn.initMaskMoney2();
        return true;
    };

    static calculateRow(row) {
        let price = 0;
        let quantity = 0;
        let elePrice = row.querySelector('.table-row-price');
        if (elePrice) {
            price = $(elePrice).valCurrency();
        }
        let eleQuantity = row.querySelector('.table-row-import');
        if (eleQuantity) {
            if (eleQuantity.value) {
                quantity = parseFloat(eleQuantity.value)
            } else if (!eleQuantity.value || eleQuantity.value === "0") {
                quantity = 0
            }
        }
        let tax = 0;
        let subtotal = (price * quantity);
        let eleTax = row.querySelector('.table-row-tax');
        if (eleTax) {
            if ($(eleTax).val()) {
                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                if (dataTax.hasOwnProperty('rate')) {
                    tax = parseInt(dataTax.rate);
                }
            }
        }
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        let eleTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
        // calculate tax
        if (eleTaxAmount) {
            let taxAmount = ((subtotal * tax) / 100);
            $(eleTaxAmount).attr('value', String(taxAmount));
            eleTaxAmountRaw.value = taxAmount;
        }
        let depreciationSubtotalEle = row.querySelector('.table-row-depreciation-subtotal');
        if (depreciationSubtotalEle) {
            if ($(depreciationSubtotalEle).val()) {
                subtotal = parseFloat($(depreciationSubtotalEle).val());
            }
        }
        // set subtotal value
        let eleSubtotal = row.querySelector('.table-row-subtotal');
        let eleSubtotalRaw = row.querySelector('.table-row-subtotal-raw');
        if (eleSubtotal) {
            $(eleSubtotal).attr('data-init-money', String(subtotal));
            eleSubtotalRaw.value = subtotal;
        }
        $.fn.initMaskMoney2();
        return true;
    };

    static calculateMain(table, row) {
        RecoveryCalculateHandle.calculateRow(row);
        // calculate total
        RecoveryCalculateHandle.calculateTotal(table[0]);
        return true;
    };

    static calculateTable(table) {
        table.DataTable().rows().every(function () {
            let row = this.node();
            RecoveryCalculateHandle.calculateMain(table, row);
        });
    };
}

// Store data
class RecoveryStoreDataHandle {
    static storeData() {
        // Lưu lại data row của tất cả dtb & draw() lại row, dòng checked sẽ được lưu thêm data sub từ các dtb phụ
        // dtb data cố định => store hết, dtb data động callAjax => store data có thay đổi

        let product_warehouse_data = [];
        let product_new_data = {};
        let product_leased_data = [];
        let delivery_product_data = [];

        RecoveryDataTableHandle.$tableWarehouse.DataTable().rows().every(function () {
            let row = this.node();
            if (!$(row).hasClass('child-workflow-list')) {
                let rowIndex = RecoveryDataTableHandle.$tableWarehouse.DataTable().row(row).index();
                let $row = RecoveryDataTableHandle.$tableWarehouse.DataTable().row(rowIndex);
                let rowData = $row.data();

                let recoveryEle = row.querySelector('.table-row-quantity-recovery');
                if (recoveryEle) {
                    if ($(recoveryEle).val()) {
                        rowData['quantity_recovery'] = parseFloat($(recoveryEle).val());
                    }
                }
                let lease_generate_data = [];
                let $child = $(row).next();
                if ($child.length > 0) {
                    let tblChild = $child[0].querySelector('.table-child');
                    if (tblChild) {
                        $(tblChild).DataTable().rows().every(function () {
                            let row = this.node();
                            let leaseGenData = {};
                            let serialEle = row.querySelector('.table-row-serial');
                            let remarkEle = row.querySelector('.table-row-remark');
                            if (serialEle) {
                                if ($(serialEle).val()) {
                                    let data = SelectDDControl.get_data_from_idx($(serialEle), $(serialEle).val());
                                    if (data) {
                                        leaseGenData['serial_id'] = $(serialEle).val();
                                        leaseGenData['serial_data'] = data;
                                    }
                                }
                            }
                            if (remarkEle) {
                                leaseGenData['remark'] = $(remarkEle).val();
                            }
                            lease_generate_data.push(leaseGenData);
                        });
                    }
                }
                rowData['lease_generate_data'] = lease_generate_data;


                let iconEle = $(row).find('.icon-collapse-app-wf');
                let right_or_down = '';
                if (iconEle.hasClass('fa-caret-right')) {
                    right_or_down = 'right';
                }
                if (iconEle.hasClass('fa-caret-down')) {
                    right_or_down = 'down';
                }

                RecoveryDataTableHandle.$tableWarehouse.DataTable().row(rowIndex).data(rowData);
                if (rowData?.['quantity_recovery'] > 0) {
                    product_warehouse_data.push(rowData);
                }

                iconEle = $(row).find('.icon-collapse-app-wf');
                if (right_or_down === 'right') {
                    iconEle.removeClass('fa-caret-down').addClass('fa-caret-right');
                }
                if (right_or_down === 'down') {
                    iconEle.removeClass('fa-caret-right').addClass('fa-caret-down');
                }

            }
        });

        RecoveryDataTableHandle.$tableProductLeased.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = RecoveryDataTableHandle.$tableProductLeased.DataTable().row(row).index();
            let $row = RecoveryDataTableHandle.$tableProductLeased.DataTable().row(rowIndex);
            let rowData = $row.data();

            // update data product_warehouse_data cho dòng đang được chọn
            let checked = row.querySelector('.table-row-checkbox:checked');
            if (checked) {
                rowData['product_warehouse_data'] = product_warehouse_data;
            }
            let recovery = 0;
            if (rowData?.['product_warehouse_data']) {
                for (let dataPW of rowData?.['product_warehouse_data'] ? rowData?.['product_warehouse_data'] : []) {
                    recovery += dataPW?.['quantity_recovery'];
                }
            }
            rowData['quantity_recovery'] = recovery;

            RecoveryDataTableHandle.$tableProductLeased.DataTable().row(rowIndex).data(rowData);
            product_leased_data.push(rowData);

            if (checked) {
                let checkEle = row.querySelector('.table-row-checkbox');
                if (checkEle) {
                    checkEle.checked = true;
                }
            }
        });

        RecoveryDataTableHandle.$tableProductNew.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = RecoveryDataTableHandle.$tableProductNew.DataTable().row(row).index();
            let $row = RecoveryDataTableHandle.$tableProductNew.DataTable().row(rowIndex);
            let rowData = $row.data();

            // update data product_warehouse_data cho dòng đang được chọn
            let checked = row.querySelector('.table-row-checkbox:checked');
            if (checked) {
                rowData['product_warehouse_data'] = product_warehouse_data;
                rowData['product_quantity_leased_data'] = product_leased_data
            }
            let recovery = 0;
            if (rowData?.['product_warehouse_data']) {
                for (let dataPW of rowData?.['product_warehouse_data'] ? rowData?.['product_warehouse_data'] : []) {
                    recovery += dataPW?.['quantity_recovery'];
                }
            }
            if (rowData?.['product_quantity_leased_data']) {
                for (let dataLeased of rowData?.['product_quantity_leased_data']) {
                    recovery += dataLeased?.['quantity_recovery'];
                }
            }
            rowData['quantity_recovery'] = recovery;

            RecoveryDataTableHandle.$tableProductNew.DataTable().row(rowIndex).data(rowData);
            product_new_data = rowData;

            if (checked) {
                let checkEle = row.querySelector('.table-row-checkbox');
                if (checkEle) {
                    checkEle.checked = true;
                }
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
                rowData = product_new_data;
            }

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
            for (let product_data of rowData?.['delivery_product_data']) {
                let target = RecoveryDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${product_data?.['product_data']?.['id']}"]`);
                if (target) {
                    let targetRow = target.closest('tr');
                    if (targetRow) {
                        let depreciationSubtotalEle = targetRow.querySelector('.table-row-depreciation-subtotal');
                        if (depreciationSubtotalEle) {
                            if ($(depreciationSubtotalEle).val()) {
                                product_data['product_depreciation_subtotal'] = parseFloat($(depreciationSubtotalEle).val());
                                if (product_data?.['product_depreciation_subtotal'] && product_data?.['quantity_recovery']) {
                                    product_data['product_depreciation_price'] = product_data?.['product_depreciation_subtotal'] / product_data?.['quantity_recovery'];
                                }
                            }
                        }
                        let leaseStartDateEle = targetRow.querySelector('.table-row-lease-start-date');
                        if (leaseStartDateEle) {
                            if ($(leaseStartDateEle).val()) {
                                product_data['product_lease_start_date'] = $(leaseStartDateEle).val();
                            }
                        }
                        let leaseEndDateEle = targetRow.querySelector('.table-row-lease-end-date');
                        if (leaseEndDateEle) {
                            if ($(leaseEndDateEle).val()) {
                                product_data['product_lease_end_date'] = $(leaseEndDateEle).val();
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


