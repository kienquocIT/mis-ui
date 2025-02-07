// LoadData
class RecoveryLoadDataHandle {
    static $form = $('#frm_goods_recovery');
    static $date = $('#date_recovery');
    static $boxStatus = $('#recovery_status');
    static $boxCustomer = $('#customer_id');
    static $boxLeaseOrder = $('#lease_order_id');
    static $modalMain = $('#productModalCenter');
    static $btnSaveModal = $('#btn-save-modal');
    static $depreciationModal = $('#viewDepreciationDetail');
    static $btnSaveDepreciation = $('#btn-save-depreciation-detail');

    static transEle = $('#app-trans-factory');
    static urlEle = $('#url-factory');
    static dataStatus = [
        {'id': 0, 'title': RecoveryLoadDataHandle.transEle.attr('data-status-1')},
        {'id': 1, 'title': RecoveryLoadDataHandle.transEle.attr('data-status-2')},
        {'id': 2, 'title': RecoveryLoadDataHandle.transEle.attr('data-status-3')},
    ];
    static dataAssetType = {
        1: RecoveryLoadDataHandle.transEle.attr('data-asset-type-1'),
        2: RecoveryLoadDataHandle.transEle.attr('data-asset-type-2'),
        3: RecoveryLoadDataHandle.transEle.attr('data-asset-type-3'),
    };
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
        RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxStatus, RecoveryLoadDataHandle.dataStatus);
        RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxCustomer);
        RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxLeaseOrder);
        RecoveryLoadDataHandle.loadEventRadio(RecoveryLoadDataHandle.$depreciationModal);
        // dtb
        RecoveryDataTableHandle.dataTableProduct();
        RecoveryDataTableHandle.dataTableDelivery();
        RecoveryDataTableHandle.dataTableDeliveryProduct();
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
                if (rowData?.['lease_generate_data'].length > 0) {
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

    static loadQuantityRecovery() {
        let productChecked = RecoveryDataTableHandle.$tableDeliveryProduct[0].querySelector('.table-row-checkbox:checked');
        if (productChecked) {
            let rowTarget = productChecked.closest('tr');
            if (rowTarget) {
                let recoveryEle = rowTarget.querySelector('.table-row-quantity-recovery');
                let deliveryEle = rowTarget.querySelector('.table-row-quantity-delivered');
                if (recoveryEle && deliveryEle) {
                    let fnRecovery = 0;
                    for (let eleRec of RecoveryDataTableHandle.$tableWarehouse[0].querySelectorAll('.table-row-quantity-recovery')) {
                        fnRecovery += parseFloat($(eleRec).val());
                    }
                    if (deliveryEle.innerHTML) {
                        if (fnRecovery > parseFloat(deliveryEle.innerHTML)) {
                            $.fn.notifyB({description: RecoveryLoadDataHandle.transEle.attr('data-exceed-quantity')}, 'failure');
                            return false;
                        }
                    }
                    recoveryEle.innerHTML = String(fnRecovery);
                }
            }
        }
        return true;
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
                let warehouseArea = RecoveryLoadDataHandle.$modalMain[0].querySelector('.dtb-warehouse-area');
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

                RecoveryDataTableHandle.$tableWarehouse.DataTable().destroy();
                if (rowData?.['product_warehouse_data']) {
                    RecoveryDataTableHandle.dataTableWareHouse(rowData?.['product_warehouse_data'] ? rowData?.['product_warehouse_data'] : []);
                } else {
                    RecoveryDataTableHandle.dataTableWareHouse();
                }
            }
        }
        return true;
    };

    static loadLineDetail() {
        let dataJSON = {};
        let result = [];
        // let deliveryData = RecoverySubmitHandle.setupDataDelivery();

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

    // TABLE COST-DEPRECIATION
    static loadShowModalDepreciation(ele) {
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
            let depreciationTimeEle = row.querySelector('.table-row-depreciation-time');
            let $timeEle = $('#depreciation_time');
            if (depreciationTimeEle && $timeEle.length > 0) {
                if ($(depreciationTimeEle).val()) {
                    $timeEle.val(parseFloat($(depreciationTimeEle).val()));
                }
            }
            let priceEle = row.querySelector('.table-row-price');
            let quantityEle = row.querySelector('.table-row-quantity');
            let $priceEle = $('#cost_price');
            if ($priceEle.length > 0) {
                $($priceEle).attr('value', String(0));
                if (priceEle && quantityEle) {
                    if ($(priceEle).valCurrency() && $(quantityEle).val()) {
                        let total = parseFloat($(priceEle).valCurrency()) * parseFloat($(quantityEle).val());
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
            let depreciationStartDEle = row.querySelector('.table-row-depreciation-start-date');
            let $startDateEle = $('#depreciation_start_date');
            if (depreciationStartDEle && $startDateEle.length > 0) {
                $startDateEle.val("");
                if ($(depreciationStartDEle).val()) {
                    $startDateEle.val(moment($(depreciationStartDEle).val()).format('DD/MM/YYYY'));
                }
                if (!$startDateEle.val()) {
                    $startDateEle.val(DateTimeControl.getCurrentDate("DMY", "/"));
                }
            }
            let $endDateEle = $('#depreciation_end_date');
            if ($endDateEle.length > 0) {
                $endDateEle.val("");
                if (RecoveryLoadDataHandle.$date.val()) {
                    $endDateEle.val(RecoveryLoadDataHandle.$date.val());
                }
            }
            let depreciationAdjustEle = row.querySelector('.table-row-depreciation-adjustment');
            let $adjustEle = $('#depreciation_adjustment');
            if (depreciationAdjustEle && $adjustEle.length > 0) {
                if ($(depreciationAdjustEle).val()) {
                    $adjustEle.val(parseFloat($(depreciationAdjustEle).val()));
                }
            }
        }
        RecoveryLoadDataHandle.loadDataTableDepreciation();
        return true;
    };

    static loadDataTableDepreciation() {
        let $methodEle = $('#depreciation_method');
        let $timeEle = $('#depreciation_time');
        let $startEle = $('#depreciation_start_date');
        let $endEle = $('#depreciation_end_date');
        let $costEle = $('#cost_price');
        let $adjustEle = $('#depreciation_adjustment');
        let $radioSaleEle = $('#depreciation_for_sale');
        let $radioFinanceEle = $('#depreciation_for_finance');
        RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().clear().draw();
        if ($methodEle.length > 0 && $timeEle.length > 0 && $startEle.length > 0 && $endEle.length > 0 && $costEle.length > 0 && $adjustEle.length > 0 && $radioSaleEle.length > 0 && $radioFinanceEle.length > 0) {
            if ($methodEle.val() && $timeEle.val() && $startEle.val() && $endEle.val() && $costEle.valCurrency()) {
                // let data = RecoveryLoadDataHandle.generateDateRangeWithDepreciation(parseInt($methodEle.val()), parseInt($timeEle.val()), $startEle.val(), $endEle.val(), parseFloat($costEle.valCurrency()), parseInt($adjustEle.val()));
                let data = [];
                if ($radioSaleEle[0].checked === true) {
                    data = RecoveryLoadDataHandle.generateDateRangeWithDepreciation(parseInt($methodEle.val()), parseInt($timeEle.val()), $startEle.val(), $endEle.val(), parseFloat($costEle.valCurrency()), parseInt($adjustEle.val()));
                }
                if ($radioFinanceEle[0].checked === true) {
                    // data = RecoveryLoadDataHandle.generateDateRangeWithDepreciationFinance(parseInt($methodEle.val()), parseInt($timeEle.val()), $startEle.val(), $endEle.val(), parseFloat($costEle.valCurrency()), parseInt($adjustEle.val()));
                }

                $('#depreciation_spinner').removeAttr('hidden');
                RecoveryDataTableHandle.$tableDepreciationDetail.attr('hidden', 'true');
                setTimeout(function () {
                    $('#depreciation_spinner').attr('hidden', true);
                    RecoveryDataTableHandle.$tableDepreciationDetail.removeAttr('hidden');
                }, 300);

                RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().rows.add(data).draw();
            }
        }
        return true;
    };

    static addOneMonth(date_current) {
        const [day, month, year] = date_current.split('/').map(num => parseInt(num));
        const date = new Date(year, month - 1, day);
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);

        const newDay = String(date.getDate()).padStart(2, '0');
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newYear = date.getFullYear();

        return `${newDay}/${newMonth}/${newYear}`;
    };

    static addOneDay(date_current) {
        const [day, month, year] = date_current.split('/').map(num => parseInt(num));
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + 1);

        const newDay = String(date.getDate()).padStart(2, '0');
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newYear = date.getFullYear();

        return `${newDay}/${newMonth}/${newYear}`;
    };

    static parseToDateObj(dateStr) {
        const [day, month, year] = dateStr.split('/').map(num => parseInt(num));
        return new Date(year, month - 1, day); // Convert to Date object
    };

    static calculateDaysBetween(startDateObj, endDateObj) {
        let timeDifference = endDateObj - startDateObj;
        return timeDifference / (1000 * 60 * 60 * 24);
    };

    static generateDateRangeWithDepreciation(method, months, start_date, end_date, price, adjust = null) {
        // method: 0: line method || 1: adjust method

        let result = [];
        let totalMonths = months;
        let depreciationValue = Math.floor(price / totalMonths); // Depreciation per month
        let accumulativeValue = 0;

        let currentStartDate = start_date;
        // let currentMonth = parseInt(start_date.split('/')[1]);
        let currentMonth = 1;
        let currentValue = price;

        let endDateObj = RecoveryLoadDataHandle.parseToDateObj(end_date);

        while (true) {
            let currentStartDateObj = RecoveryLoadDataHandle.parseToDateObj(currentStartDate);

            let currentEndDate = RecoveryLoadDataHandle.addOneMonth(currentStartDate);
            let currentEndDateObj = RecoveryLoadDataHandle.parseToDateObj(currentEndDate);

            let daysEven = RecoveryLoadDataHandle.calculateDaysBetween(currentStartDateObj, currentEndDateObj);

            if (method === 1 && adjust) {
                let depreciationAdjustValue = Math.floor(price / totalMonths * adjust); // Depreciation (adjust) per month
                depreciationValue = depreciationAdjustValue;

                if (result.length > 0) {
                    let last = result[result.length - 1];
                    depreciationAdjustValue = Math.floor(last?.['end_value'] / totalMonths * adjust);
                    // Kiểm tra nếu khâu hao theo hệ số mà lớn hơn khấu hao chia đều số tháng còn lại thì lấy theo khấu hao hệ số còn ngược lại thì lấy theo khấu hao chia đều.
                    let monthsRemain = totalMonths - last?.['month'];
                    let depreciationValueCompare = last?.['end_value'] / monthsRemain;
                    if (depreciationAdjustValue > depreciationValueCompare) {
                        depreciationValue = depreciationAdjustValue;
                    } else {
                        depreciationValue = depreciationValueCompare;
                    }
                }
            }
            accumulativeValue += depreciationValue;


            if (currentEndDateObj > endDateObj) {
                if (currentStartDateObj < endDateObj) {
                    let daysOdd = RecoveryLoadDataHandle.calculateDaysBetween(currentStartDateObj, endDateObj);
                    depreciationValue = depreciationValue * (daysOdd + 1) / (daysEven + 1)

                    result.push({
                        month: currentMonth.toString(),
                        start_date: currentStartDate,
                        end_date: end_date,
                        start_value: currentValue,
                        depreciation_value: depreciationValue,
                        accumulative_value: accumulativeValue,
                        end_value: Math.max(currentValue - depreciationValue, 0),
                    });
                }
                break;
            } else {
                result.push({
                    month: currentMonth.toString(),
                    start_date: currentStartDate,
                    end_date: currentEndDate,
                    start_value: currentValue,
                    depreciation_value: depreciationValue,
                    accumulative_value: accumulativeValue,
                    end_value: Math.max(currentValue - depreciationValue, 0),
                });
            }

            currentStartDate = currentEndDate;
            currentStartDate = RecoveryLoadDataHandle.addOneDay(currentStartDate);
            currentMonth++;
            currentValue = Math.max(currentValue - depreciationValue, 0);
        }

        return result;
    };

    static loadSaveDepreciation() {
        let target = RecoveryDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${RecoveryLoadDataHandle.$btnSaveDepreciation.attr('data-product-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');

            if (targetRow) {
                let $methodEle = $('#depreciation_method');
                let $startEle = $('#depreciation_start_date');
                let $endEle = $('#depreciation_end_date');
                let $adjust = $('#depreciation_adjustment')
                if ($methodEle.length > 0 && $startEle.length > 0 && $endEle.length > 0 && $adjust.length > 0) {
                    let depreciationMethodEle = targetRow.querySelector('.table-row-depreciation-method');
                    let depreciationStartDEle = targetRow.querySelector('.table-row-depreciation-start-date');
                    let depreciationEndDEle = targetRow.querySelector('.table-row-depreciation-end-date');
                    let depreciationAdjustEle = targetRow.querySelector('.table-row-depreciation-adjustment');
                    if (depreciationMethodEle && depreciationStartDEle && depreciationEndDEle && depreciationAdjustEle) {
                        if ($methodEle.val()) {
                            $(depreciationMethodEle).val(parseInt($methodEle.val()));
                        }
                        if ($startEle.val()) {
                            $(depreciationStartDEle).val(moment($startEle.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD'));
                        }
                        if ($endEle.val()) {
                            $(depreciationEndDEle).val(moment($endEle.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD'));
                        }
                        if ($adjust.val()) {
                            $(depreciationAdjustEle).val(parseFloat($adjust.val()))
                        }
                    }
                }
                let lastRowData = RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().row(':last').data();
                if (lastRowData) {
                    let depreciationSubtotalEle = targetRow.querySelector('.table-row-depreciation-subtotal');
                    let fnCostEle = targetRow.querySelector('.table-row-subtotal');
                    let fnCostRawEle = targetRow.querySelector('.table-row-subtotal-raw');
                    if (depreciationSubtotalEle && fnCostEle && fnCostRawEle) {
                        let fnCost = lastRowData?.['accumulative_value'];
                        $(depreciationSubtotalEle).val(fnCost);
                        $(fnCostEle).attr('data-init-money', String(fnCost));
                        $(fnCostRawEle).val(String(fnCost));
                        $.fn.initMaskMoney2();
                    }
                }
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
                        return `<input type="text" class="form-control table-row-quantity validated-number" value="${row?.['quantity_recovery']}" required readonly>`;
                    }
                },
                {
                    targets: 5,
                    width: '16.9270833333%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-price" 
                                    value="${row?.['product_depreciation_price'] ? row?.['product_depreciation_price'] : 0}"
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
                                            data-bs-toggle="modal"
                                            data-bs-target="#viewDepreciationDetail"
                                        ><i class="fas fa-ellipsis-h"></i>
                                        </button><p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['product_subtotal_price'] ? row?.['product_subtotal_price'] : '0')}"></span></p>
                                    </div>
                                    <input
                                        type="text"
                                        class="form-control table-row-subtotal-raw"
                                        value="${row?.['product_subtotal_price']}"
                                        hidden
                                    >
                                    
                                    <input type="text" class="form-control table-row-depreciation-subtotal" value="${row?.['product_depreciation_subtotal'] ? row?.['product_depreciation_subtotal'] : 0}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-method" value="${row?.['product_depreciation_method'] ? row?.['product_depreciation_method'] : 0}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-start-date" value="${row?.['product_depreciation_start_date'] ? row?.['product_depreciation_start_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-end-date" value="${row?.['product_depreciation_end_date'] ? row?.['product_depreciation_end_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-adjustment" value="${row?.['product_depreciation_adjustment'] ? row?.['product_depreciation_adjustment'] : 1}" hidden>
                                    
                                    <input type="text" class="form-control table-row-depreciation-time" value="${row?.['product_depreciation_time'] ? row?.['product_depreciation_time'] : 0}" hidden>
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
                    width: '80%',
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
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-asset-type">${RecoveryLoadDataHandle.dataAssetType?.[row?.['asset_type']] ? RecoveryLoadDataHandle.dataAssetType?.[row?.['asset_type']] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['offset_data']?.['sale_information']?.['default_uom']?.['title'] ? row?.['offset_data']?.['sale_information']?.['default_uom']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-ordered">${row?.['quantity_ordered'] ? row?.['quantity_ordered'] : '0'}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-delivered">${row?.['quantity_delivered'] ? row?.['quantity_delivered'] : '0'}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-recovered">${row?.['quantity_recovered'] ? row?.['quantity_recovered'] : '0'}</span>`;
                    }
                },
                {
                    targets: 6,
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
                    width: "20%",
                    render: (data, type, row) => {
                        return `<button class="btn-collapse-app-wf btn btn-icon btn-rounded mr-1"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${row?.['warehouse_data']?.['title'] ? row?.['warehouse_data']?.['title'] : ""}</b>`;
                    }
                },
                {
                    targets: 0,
                    width: "20%",
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-delivered">${row?.['quantity_delivered'] ? row?.['quantity_delivered'] : '0'}</span>`;
                    }
                },
                {
                    targets: 0,
                    width: "20%",
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-recovered">${row?.['quantity_recovered'] ? row?.['quantity_recovered'] : '0'}</span>`;
                    }
                },
                {
                    targets: 0,
                    width: "20%",
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-quantity-recovery validated-number" value="${row?.['quantity_recovery'] ? row?.['quantity_recovery'] : 0}">`;
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
                    let productChecked = RecoveryDataTableHandle.$tableDeliveryProduct[0].querySelector('.table-row-checkbox:checked');
                    if (productChecked) {
                        let rowTarget = productChecked.closest('tr');
                        if (rowTarget) {
                            let rowIndex = RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().row(rowTarget).index();
                            let $row = RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().row(rowIndex);
                            let rowData = $row.data();
                            if (rowData?.['delivery_data']) {
                                let serialData = [{'id': '', 'title': 'Select...',},];
                                for (let deli_data of rowData?.['delivery_data']) {
                                    if (deli_data?.['serial_data']) {
                                        for (let serial_data of deli_data?.['serial_data']) {
                                            if (serial_data?.['product_warehouse_serial_data']) {
                                                serialData.push(serial_data?.['product_warehouse_serial_data']);
                                            }
                                        }
                                    }
                                }
                                RecoveryLoadDataHandle.loadInitS2($(serialEle), serialData, {}, RecoveryLoadDataHandle.$modalMain, false, {'res2': 'serial_number'});
                                if (data?.['serial_id']) {
                                    $(serialEle).val(data?.['serial_id']).trigger('change');
                                }
                                if (serialData.length === 0) {
                                    serialEle.removeAttribute('hidden');
                                }


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
                        }
                    }
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
                    render: (data, type, row) => {
                        return `<span class="table-row-month">${row?.['month']}</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-start-date">${row?.['start_date'] ? row?.['start_date'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-end-date">${row?.['end_date'] ? row?.['end_date'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-start-net-value" data-init-money="${parseFloat(row?.['start_value'] ? row?.['start_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-depreciation-value" data-init-money="${parseFloat(row?.['depreciation_value'] ? row?.['depreciation_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-end-net-value" data-init-money="${parseFloat(row?.['end_value'] ? row?.['end_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-accumulative" data-init-money="${parseFloat(row?.['accumulative_value'] ? row?.['accumulative_value'] : '0')}"></span>`;
                    }
                },
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
                RecoveryLoadDataHandle.loadCssToDtb("table-depreciation-detail");

                let lastRow = RecoveryDataTableHandle.$tableDepreciationDetail.DataTable().row(':last');
                if (lastRow) {
                    let lastRowNode = lastRow.node();
                    if (lastRowNode) {
                        let lastTd = lastRowNode.querySelector('td:last-child');
                        if (lastTd) {
                            $(lastTd).css({
                                'background': '#ebfcf5'
                            })
                        }
                    }
                }
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
                let $group = $(`<button type="button" class="btn btn-outline-secondary btn-floating" id="btn-edit-product-good-receipt" data-bs-toggle="modal" data-bs-target="#productModalCenter">
                                    <span><span class="icon"><span class="feather-icon"><i class="far fa-edit"></i></span></span><span>${RecoveryLoadDataHandle.transEle.attr('data-edit')}</span></span>
                                </button>`);
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
        let product_warehouse_data = [];
        let delivery_product_data = [];

        RecoveryDataTableHandle.$tableWarehouse.DataTable().rows().every(function () {
            let row = this.node();
            if (!$(row).hasClass('child-workflow-list')) {
                let rowIndex = RecoveryDataTableHandle.$tableWarehouse.DataTable().row(row).index();
                let $row = RecoveryDataTableHandle.$tableWarehouse.DataTable().row(rowIndex);
                let rowData = $row.data();

                let recoveryEle = row.querySelector('.table-row-quantity-recovery');
                if (recoveryEle) {
                    rowData['quantity_recovery'] = parseFloat($(recoveryEle).val());
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
                product_warehouse_data.push(rowData);

                iconEle = $(row).find('.icon-collapse-app-wf');
                if (right_or_down === 'right') {
                    iconEle.removeClass('fa-caret-down').addClass('fa-caret-right');
                }
                if (right_or_down === 'down') {
                    iconEle.removeClass('fa-caret-right').addClass('fa-caret-down');
                }

            }
        });

        RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().row(row).index();
            let $row = RecoveryDataTableHandle.$tableDeliveryProduct.DataTable().row(rowIndex);
            let rowData = $row.data();

            let checked = row.querySelector('.table-row-checkbox:checked');
            if (checked) {
                rowData['product_warehouse_data'] = product_warehouse_data;
            }
            let recoveryEle = row.querySelector('.table-row-quantity-recovery');
            if (recoveryEle) {
                rowData['quantity_recovery'] = parseFloat(recoveryEle.innerHTML);
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
            if (checked) {
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

// Validate
class RecoveryValidateHandle {

    static validateImportProductNotInventory(ele, remain) {
        if (parseFloat(ele.value) > remain) {
            ele.value = '0';
            $.fn.notifyB({description: RecoveryLoadDataHandle.transEle.attr('data-validate-import')}, 'failure');
            return false;
        }
        return true;
    };

    static validateNumber(ele) {
        let value = ele.value;
        // Replace non-digit characters with an empty string
        value = value.replace(/[^0-9.]/g, '');
        // Remove unnecessary zeros from the integer part
        value = value.replace("-", "").replace(/^0+(?=\d)/, '');
        // Update value of input
        ele.value = value;
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


