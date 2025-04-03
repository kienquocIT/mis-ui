// LoadData
class GRLoadDataHandle {
    static $form = $('#frm_good_receipt_create');
    static typeSelectEle = $('#box-good-receipt-type');
    static POSelectEle = $('#box-good-receipt-purchase-order');
    static supplierSelectEle = $('#box-good-receipt-supplier');
    static IASelectEle = $('#box-good-receipt-inventory-adjustment');
    static $boxTypeReport = $('#box-report-type');
    static $btnSR = $('#btn-save-production-report');
    static $boxProductionOrder = $('#box-production-order');
    static $boxWorkOrder = $('#box-work-order');
    static $boxProductionReport = $('#box-production-report');
    static initPOProductEle = $('#data-init-purchase-order-products');
    static PRDataEle = $('#purchase_requests_data');
    static $scrollPR = $('#scroll-pr');
    static $scrollWarehouse = $('#scroll-warehouse');
    static $scrollLot = $('#scroll-lot');
    static $scrollSerial = $('#scroll-serial');
    static $isNoWHEle = $('#is_no_warehouse');
    static transEle = $('#app-trans-factory');
    static urlEle = $('#url-factory');
    static dataTypeGr = [
        {
            'id': 3,
            'title': GRLoadDataHandle.transEle.attr('data-for-production')
        },
        {
            'id': 2,
            'title': GRLoadDataHandle.transEle.attr('data-for-ia')
        },
        {
            'id': 1,
            'title': GRLoadDataHandle.transEle.attr('data-for-po')
        },
    ];
    static dataTypeReport = [
        {'id': 0, 'title': GRLoadDataHandle.transEle.attr('data-for-pro')},
        {'id': 1, 'title': GRLoadDataHandle.transEle.attr('data-for-wo')},
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

    static loadDatePicker($ele) {
        $ele.daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            drops: 'up',
            autoApply: true,
        });
        return true;
    };

    static loadCustomAreaByType() {
        // Custom Area
        for (let eleArea of GRLoadDataHandle.$form[0].querySelectorAll('.custom-area')) {
            eleArea.setAttribute('hidden', 'true');
        }
        let idAreaShow = 'custom-area-' + String(GRLoadDataHandle.typeSelectEle.val());
        document.getElementById(idAreaShow).removeAttribute('hidden');
        GRLoadDataHandle.loadChangeByType(GRLoadDataHandle.typeSelectEle.val());
    };

    static loadChangeByType(type) {
        if (type === "1") {
            if (!GRLoadDataHandle.POSelectEle.val()) {
                GRLoadDataHandle.loadInitS2(GRLoadDataHandle.POSelectEle, [], {
                    'receipt_status__in': [0, 1, 2].join(','),
                    'system_status': 3
                }, null, false, {'res1': 'code', 'res2': 'title'});
            }
            if (!GRLoadDataHandle.supplierSelectEle.val()) {
                GRLoadDataHandle.loadInitS2(GRLoadDataHandle.supplierSelectEle);
            }
            if (GRDataTableHandle.tablePR[0].querySelector('.th-custom')) {
                GRDataTableHandle.tablePR[0].querySelector('.th-custom').innerHTML = GRLoadDataHandle.transEle.attr('data-purchase-request');
            }
        }
        if (type === "2") {
            if (!GRLoadDataHandle.IASelectEle.val()) {
                GRLoadDataHandle.loadInitS2(GRLoadDataHandle.IASelectEle, [], {'state': 2}, null, false, {'res1': 'code', 'res2': 'title'});
            }
        }
        if (type === "3") {
            if (!GRLoadDataHandle.$boxTypeReport.val()) {
                GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxTypeReport, GRLoadDataHandle.dataTypeReport);
            }
            if (!GRLoadDataHandle.$boxProductionOrder.val()) {
                GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxProductionOrder, [], {'system_status': 3, 'status_production': 1}, null, false, {'res1': 'code', 'res2': 'title'});
            }
            if (!GRLoadDataHandle.$boxWorkOrder.val()) {
                GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxWorkOrder, [], {'system_status': 3, 'status_production': 1}, null, false, {'res1': 'code', 'res2': 'title'});
            }
            GRDataTableHandle.dataTableProductionReport();
            if (GRLoadDataHandle.$boxProductionReport.val().length === 0) {
                GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxProductionReport);
            }
            if (GRDataTableHandle.tablePR[0].querySelector('.th-custom')) {
                GRDataTableHandle.tablePR[0].querySelector('.th-custom').innerHTML = GRLoadDataHandle.transEle.attr('data-production-report');
            }
        }
        GRDataTableHandle.dataTableGoodReceiptPOProduct();
        GRDataTableHandle.dataTableGoodReceiptPR();
        GRDataTableHandle.dataTableGoodReceiptWH();
        GRDataTableHandle.dataTableGoodReceiptWHLot();
        GRDataTableHandle.dataTableGoodReceiptWHSerial();
        GRDataTableHandle.dataTableGoodReceiptLineDetailPO();
        return true;
    };

    static loadCustomAreaReportByType() {
        GRLoadDataHandle.loadClearModal();
        GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxProductionOrder, [], {'system_status': 3}, null, false, {'res1': 'code', 'res2': 'title'});
        GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxWorkOrder, [], {'system_status': 3}, null, false, {'res1': 'code', 'res2': 'title'});
        GRDataTableHandle.tableProductionReport.DataTable().clear().draw();
        for (let eleArea of GRLoadDataHandle.$form[0].querySelectorAll('.custom-area-report')) {
            eleArea.setAttribute('hidden', 'true');
        }
        let idAreaShow = 'custom-area-report-' + String(GRLoadDataHandle.$boxTypeReport.val());
        document.getElementById(idAreaShow).removeAttribute('hidden');
        return true;
    };

    static loadDDLot(ele, checkedID = null) {
        let productID = null;
        let warehouseID = null;
        let tablePO = GRDataTableHandle.tablePOProduct;
        let tableWH = GRDataTableHandle.tableWH;
        let elePOChecked = tablePO[0]?.querySelector('.table-row-checkbox:checked');
        if (elePOChecked) {
            let rowChecked = elePOChecked.closest('tr');
            // store new row data & redraw row
            let rowIndex = tablePO.DataTable().row(rowChecked).index();
            let $row = tablePO.DataTable().row(rowIndex);
            let rowData = $row.data();
            productID = rowData?.['product_data']?.['id'];
        }
        let eleWHChecked = tableWH[0]?.querySelector('.table-row-checkbox:checked');
        if (eleWHChecked) {
            let rowChecked = eleWHChecked.closest('tr');
            // store new row data & redraw row
            let rowIndex = tableWH.DataTable().row(rowChecked).index();
            let $row = tableWH.DataTable().row(rowIndex);
            let rowData = $row.data();
            warehouseID = rowData?.['id'];
        }
        $.fn.callAjax2({
                'url': GRLoadDataHandle.urlEle.attr('data-product-warehouse-lot'),
                'method': 'GET',
                'data': {
                    'product_warehouse__product_id': productID,
                    'product_warehouse__warehouse_id': warehouseID
                },
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('warehouse_lot_list') && Array.isArray(data.warehouse_lot_list)) {
                        for (let lot of data.warehouse_lot_list) {
                            let dataLot = JSON.stringify(lot).replace(/"/g, "&quot;");
                            let uom = lot?.['product_warehouse']?.['product']?.['uom_inventory']?.['title'] ? lot?.['product_warehouse']?.['product']?.['uom_inventory']?.['title'] : '';
                            let isChecked = 'false';
                            if (lot?.['id'] === checkedID) {
                                isChecked = 'true';
                            }
                            $(ele).append(`<a class="dropdown-item dropdown-item-lot border border-grey mb-1" data-id="${lot?.['id']}" data-lot="${dataLot}" data-checked="${isChecked}" href="#">
                                                <div class="d-flex justify-content-between">
                                                    <span class="badge badge-soft-blue">${lot?.['lot_number']}</span>
                                                    <div class="d-flex">
                                                        <span class="mr-2"><small>${lot?.['quantity_import']}</small></span>
                                                        <span><small>${uom}</small></span>
                                                    </div>
                                                </div>
                                            </a>`);
                        }
                        if (ele.querySelector(".dropdown-item-lot[data-checked='true']")) {
                            $(ele.querySelector(".dropdown-item-lot[data-checked='true']")).css('background-color', '#eef6ff');
                        }
                    }
                }
            }
        )
    };

    static loadChangePO($ele) {
        // GRLoadDataHandle.loadMoreInformation($ele);
        GRDataTableHandle.tableLineDetailPO.DataTable().clear().draw();
        GRCalculateHandle.calculateTotal(GRDataTableHandle.tableLineDetailPO[0]);
        GRDataTableHandle.tablePOProduct.DataTable().clear().draw();

        if ($ele.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(GRLoadDataHandle.POSelectEle, $ele.val());
            // load supplier
            GRLoadDataHandle.supplierSelectEle.empty();
            GRLoadDataHandle.loadInitS2(GRLoadDataHandle.supplierSelectEle, [dataSelected?.['supplier']]);
            // load PR
            GRLoadDataHandle.loadDataShowPR(dataSelected?.['purchase_requests_data']);
        }
    };

    static loadCallAjaxPOProduct() {
        let frm = new SetupFormSubmit(GRDataTableHandle.tablePOProduct);
        if (GRLoadDataHandle.POSelectEle.val()) {
            if (GRDataTableHandle.tablePOProduct[0].querySelector('.dataTables_empty')) {
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': frm.dataUrl,
                        'method': frm.dataMethod,
                        'data': {'purchase_order_id': GRLoadDataHandle.POSelectEle.val()},
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('purchase_order_product_gr') && Array.isArray(data.purchase_order_product_gr)) {
                                let dataValid = data.purchase_order_product_gr;
                                // for (let dataPOPro of data.purchase_order_product_gr) {
                                //     if (dataPOPro?.['product_data'].hasOwnProperty('product_choice') && Array.isArray(dataPOPro?.['product_data']?.['product_choice'])) {
                                //         if (dataPOPro?.['product_data']?.['product_choice'].includes(1)) {  // has choice allow inventory
                                //             dataValid.push(dataPOPro);
                                //         }
                                //     }
                                // }
                                GRLoadDataHandle.initPOProductEle.val(JSON.stringify(dataValid));
                                GRDataTableHandle.tablePOProduct.DataTable().clear().draw();
                                GRDataTableHandle.tablePOProduct.DataTable().rows.add(dataValid).draw();
                            }
                            WindowControl.hideLoading();
                        }
                    }
                )
            }
        }
        return true;
    };

    static loadChangeProductionWorkOrder() {
        GRLoadDataHandle.loadClearModal();
        if (GRLoadDataHandle.$boxProductionOrder.val() || GRLoadDataHandle.$boxWorkOrder.val()) {
            let data = SelectDDControl.get_data_from_idx(GRLoadDataHandle.$boxProductionOrder, GRLoadDataHandle.$boxProductionOrder.val());
            let dataParams = {'production_order_id': data?.['id']};
            if (GRLoadDataHandle.$boxTypeReport.val() === '1') {
                data = SelectDDControl.get_data_from_idx(GRLoadDataHandle.$boxWorkOrder, GRLoadDataHandle.$boxWorkOrder.val());
                dataParams = {'work_order_id': data?.['id']};
            }
            GRDataTableHandle.tableProductionReport.DataTable().clear().draw();
            $.fn.callAjax2({
                    'url': GRDataTableHandle.tableProductionReport.attr('data-url'),
                    'method': "GET",
                    'data': dataParams,
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('production_report_gr') && Array.isArray(data.production_report_gr)) {
                            GRDataTableHandle.tableProductionReport.DataTable().rows.add(data.production_report_gr).draw();
                        }
                    }
                }
            )
            GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxProductionReport, [], {'production_order_id': data?.['id']});
        }
        return true;
    };

    static loadSetupProduction() {
        let dataProduct = {};
        let dataPRProducts = [];
        let quantityCompleted = 0;
        let quantityRemain = 0;
        for (let idx of GRLoadDataHandle.$boxProductionReport.val()) {
            let data = SelectDDControl.get_data_from_idx(GRLoadDataHandle.$boxProductionReport, idx);
            if (data?.['product_data']?.['product_choice'].includes(1)) {
                if (Object.keys(dataProduct).length === 0) {
                    for (let key in data) {
                        dataProduct[key] = data?.[key];
                    }
                } else {
                    dataProduct['product_quantity_order_actual'] += data?.['product_quantity_order_actual'];
                    dataProduct['gr_remain_quantity'] += data?.['gr_remain_quantity'];
                }
                dataPRProducts.push(data);
                quantityCompleted += data?.['gr_completed_quantity'];
                quantityRemain += data?.['gr_remain_quantity'];
            }
        }
        dataProduct['pr_products_data'] = dataPRProducts;
        dataProduct['gr_completed_quantity'] = quantityCompleted;
        dataProduct['gr_remain_quantity'] = quantityRemain;
        return dataProduct;
    };

    static loadCheckPOProduct(ele) {
        let tablePO = GRDataTableHandle.tablePOProduct;
        let rowChecked = ele.closest('tr');
        // store new row data & redraw row
        let rowIndex = tablePO.DataTable().row(rowChecked).index();
        let $row = tablePO.DataTable().row(rowIndex);
        let dataRow = $row.data();
        GRDataTableHandle.tableLot.DataTable().clear().draw();
        GRDataTableHandle.tableSerial.DataTable().clear().draw();
        GRLoadDataHandle.$scrollLot[0].setAttribute('hidden', 'true');
        GRLoadDataHandle.$scrollSerial[0].setAttribute('hidden', 'true');
        GRDataTableHandle.tableWH.DataTable().clear().draw();
        GRDataTableHandle.tablePR.DataTable().clear().draw();
        if (dataRow?.['pr_products_data'].length > 0) { // If PO have PR
            GRDataTableHandle.tablePR.DataTable().rows.add(dataRow?.['pr_products_data']).draw();
            GRLoadDataHandle.$scrollPR[0].removeAttribute('hidden');
        } else { // If PO doesn't have PR
            // Check if product have inventory choice
            if (dataRow?.['product_data']?.['product_choice'].includes(1)) {
                if (GRLoadDataHandle.$isNoWHEle[0].checked === false) {
                    GRLoadDataHandle.loadCallAjaxWareHouse();
                }
            }
        }
        return true;
    };

    static loadCheckPR() {
        GRDataTableHandle.tableLot.DataTable().clear().draw();
        GRDataTableHandle.tableSerial.DataTable().clear().draw();
        GRLoadDataHandle.$scrollLot[0].setAttribute('hidden', 'true');
        GRLoadDataHandle.$scrollSerial[0].setAttribute('hidden', 'true');
        GRDataTableHandle.tableWH.DataTable().clear().draw();
        if (GRLoadDataHandle.$isNoWHEle[0].checked === false) {
            GRLoadDataHandle.loadCallAjaxWareHouse();
        }
        return true;
    };

    static loadCheckIsNoWH() {
        let checked = GRLoadDataHandle.$isNoWHEle[0].checked;
        if (checked === true) {
            GRLoadDataHandle.$scrollWarehouse[0].setAttribute('hidden', 'true');
            GRLoadDataHandle.$scrollLot[0].setAttribute('hidden', 'true');
            GRLoadDataHandle.$scrollSerial[0].setAttribute('hidden', 'true');
        }
        if (checked === false) {
            GRLoadDataHandle.$scrollWarehouse[0].removeAttribute('hidden');
            let checkedPREle = GRDataTableHandle.tablePR[0].querySelector('.table-row-checkbox:checked');
            if (checkedPREle) {
                $(checkedPREle).trigger('click');
            } else {
                let checkedPOEle = GRDataTableHandle.tablePOProduct[0].querySelector('.table-row-checkbox:checked');
                if (checkedPOEle) {
                    $(checkedPOEle).trigger('click');
                }
            }
        }
        return true;
    };

    static loadCallAjaxWareHouse() {
        let typeGR = GRLoadDataHandle.typeSelectEle.val();
        let tablePO = GRDataTableHandle.tablePOProduct;
        let elePOChecked = tablePO[0]?.querySelector('.table-row-checkbox:checked');
        if (elePOChecked) {
            let row = elePOChecked.closest('tr');
            let rowIndex = tablePO.DataTable().row(row).index();
            let $row = tablePO.DataTable().row(rowIndex);
            let dataStore = $row.data();

            let tablePR = GRDataTableHandle.tablePR;
            let elePRChecked = tablePR[0]?.querySelector('.table-row-checkbox:checked');
            if (elePRChecked) {
                if (elePRChecked.getAttribute('data-id')) {
                    let idPR = elePRChecked.getAttribute('data-id');
                    let keyCheck = 'purchase_order_request_product_id';
                    if (typeGR === '3') {
                        keyCheck = 'production_report_id';
                    }
                    if (dataStore?.['pr_products_data']) {
                        for (let prProductData of dataStore?.['pr_products_data']) {
                            if (prProductData?.[keyCheck] === idPR) {
                                dataStore = prProductData;
                                break;
                            }
                        }
                    }
                }
            }
            if (Object.keys(dataStore).length !== 0) {
                let tableWH = GRDataTableHandle.tableWH;
                let frm = new SetupFormSubmit(tableWH);
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': frm.dataUrl,
                        'method': frm.dataMethod,
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('warehouse_list') && Array.isArray(data.warehouse_list)) {
                                for (let item of data.warehouse_list) {
                                    item['warehouse_id'] = item?.['id'];
                                    item['uom_data'] = dataStore?.['uom_data'];
                                    if (dataStore?.['gr_warehouse_data']) {
                                        for (let dataGRWH of dataStore?.['gr_warehouse_data']) {
                                            if (dataGRWH?.['warehouse_id'] === item?.['id']) {
                                                item['quantity_import'] = dataGRWH?.['quantity_import'] ? dataGRWH?.['quantity_import'] : 0;
                                                if (dataGRWH?.['lot_data']) {
                                                    item['lot_data'] = dataGRWH?.['lot_data'];
                                                }
                                                if (dataGRWH?.['serial_data']) {
                                                    item['serial_data'] = dataGRWH?.['serial_data'];
                                                }
                                                item['is_additional'] = dataGRWH?.['is_additional'];
                                            }
                                        }
                                    }
                                    if (typeGR === '2') {  // GR for IA
                                        if (dataStore?.['gr_warehouse_data'].length > 0) {
                                            let whIA = dataStore?.['gr_warehouse_data'][0];
                                            if (item?.['warehouse_id'] === whIA?.['warehouse_id']) {
                                                data.warehouse_list = [item];
                                                break;
                                            }
                                        }
                                    }
                                }
                                tableWH.DataTable().clear().draw();
                                tableWH.DataTable().rows.add(data.warehouse_list).draw();
                                GRLoadDataHandle.loadAreaLotOrAreaSerial();
                            }
                            WindowControl.hideLoading();
                        }
                    }
                )
            }
        }
        return true;
    };

    static loadCheckWH(ele) {
        let row = ele.closest('tr');
        GRDataTableHandle.tableLot.DataTable().clear().draw();
        GRDataTableHandle.tableSerial.DataTable().clear().draw();
        GRLoadDataHandle.loadNewRowsLotOrNewRowsSerial();
        let tablePO = GRDataTableHandle.tablePOProduct;
        let elePOChecked = tablePO[0].querySelector('.table-row-checkbox:checked');
        if (elePOChecked) {
            let rowPO = elePOChecked.closest('tr');
            let rowIndex = tablePO.DataTable().row(rowPO).index();
            let $row = tablePO.DataTable().row(rowIndex);
            let dataStore = $row.data();
            if (dataStore?.['product_data']?.['general_traceability_method'] === 2) {
                if (row.querySelector('.table-row-checkbox-additional')) {
                    row.querySelector('.table-row-checkbox-additional').removeAttribute('disabled');
                }
            }
        }
        if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            let eleAdditional = row.querySelector('.table-row-checkbox-additional');
            let eleImport = row.querySelector('.table-row-import');
            if (eleAdditional && eleImport && !eleAdditional.hasAttribute('hidden')) {
                if (eleAdditional.checked === true) {
                    eleImport.removeAttribute('disabled');
                } else {
                    eleImport.setAttribute('disabled', 'true');
                }
            }
        }
        return true;
    };

    static loadAreaLotOrAreaSerial() {
        let tablePO = GRDataTableHandle.tablePOProduct;
        let elePOChecked = tablePO[0].querySelector('.table-row-checkbox:checked');
        if (elePOChecked) {
            let row = elePOChecked.closest('tr');
            let rowIndex = tablePO.DataTable().row(row).index();
            let $row = tablePO.DataTable().row(rowIndex);
            let dataStore = $row.data();
            if ([1, 2].includes(dataStore?.['product_data']?.['general_traceability_method'])) {
                GRLoadDataHandle.loadAreaLotSerial(dataStore?.['product_data']?.['general_traceability_method']);
            }
        }
        return true;
    };

    static loadNewRowsLotOrNewRowsSerial() {
        let tablePO = GRDataTableHandle.tablePOProduct;
        let elePOChecked = tablePO[0].querySelector('.table-row-checkbox:checked');
        if (elePOChecked) {
            let row = elePOChecked.closest('tr');
            let rowIndex = tablePO.DataTable().row(row).index();
            let $row = tablePO.DataTable().row(rowIndex);
            let dataStore = $row.data();
            if ([1, 2].includes(dataStore?.['product_data']?.['general_traceability_method'])) {
                if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                    let eleWHChecked = GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked');
                    if (eleWHChecked) {
                        let isAdditional = eleWHChecked.closest('tr').querySelector('.table-row-checkbox-additional').checked;
                        if (isAdditional === true) {
                            $('#btn-add-manage-lot')[0].setAttribute('disabled', 'true');
                            $('#btn-add-manage-serial')[0].setAttribute('disabled', 'true');
                        } else {
                            $('#btn-add-manage-lot')[0].removeAttribute('disabled');
                            $('#btn-add-manage-serial')[0].removeAttribute('disabled');
                        }
                    }
                }
                for (let eleImport of GRDataTableHandle.tableWH[0].querySelectorAll('.table-row-import')) {
                    eleImport.setAttribute('disabled', 'true');
                }
                if (dataStore?.['product_data']?.['general_traceability_method'] === 1) {
                    GRLoadDataHandle.loadNewRowsLot();
                }
                if (dataStore?.['product_data']?.['general_traceability_method'] === 2) {
                    GRLoadDataHandle.loadNewRowsSerial();
                }
            }
        }
        return true;
    };

    static loadAreaLotSerial(type) {
        GRDataTableHandle.tableLot.DataTable().clear().draw();
        GRDataTableHandle.tableSerial.DataTable().clear().draw();
        if (type === 1) {  // lot
            GRLoadDataHandle.$scrollLot[0].removeAttribute('hidden');
            if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                $('#btn-add-manage-lot')[0].removeAttribute('disabled');
            }
            GRLoadDataHandle.$scrollSerial[0].setAttribute('hidden', 'true');
        }
        if (type === 2) {  // serial
            GRLoadDataHandle.$scrollSerial[0].removeAttribute('hidden');
            if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                $('#btn-add-manage-serial')[0].removeAttribute('disabled');
            }
            GRLoadDataHandle.$scrollLot[0].setAttribute('hidden', 'true');
        }
        return true;
    };

    static loadNewRowsLot() {
        let tablePO = GRDataTableHandle.tablePOProduct;
        let elePOChecked = tablePO[0]?.querySelector('.table-row-checkbox:checked');
        if (elePOChecked) {
            let row = elePOChecked.closest('tr');
            let rowIndex = tablePO.DataTable().row(row).index();
            let $row = tablePO.DataTable().row(rowIndex);
            let dataStore = $row.data();
            let eleWHChecked = GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked');
            if (eleWHChecked) {
                let idWH = eleWHChecked.getAttribute('data-id');
                let elePRChecked = GRDataTableHandle.tablePR[0].querySelector('.table-row-checkbox:checked');
                if (elePRChecked) {
                    let idPR = elePRChecked.getAttribute('data-id');
                    if (dataStore?.['pr_products_data']) {
                        for (let prProductData of dataStore?.['pr_products_data']) {
                            if (prProductData?.['purchase_order_request_product_id'] === idPR) {
                                if (prProductData?.['gr_warehouse_data']) {
                                    for (let grWHData of prProductData?.['gr_warehouse_data']) {
                                        if (grWHData?.['warehouse_id'] === idWH) {
                                            dataStore = grWHData;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (dataStore?.['gr_warehouse_data']) {
                        for (let grWHData of dataStore?.['gr_warehouse_data']) {
                            if (grWHData?.['warehouse_id'] === idWH) {
                                dataStore = grWHData;
                                break;
                            }
                        }
                    }
                }
                if (dataStore?.['lot_data']) {
                    for (let lot_data of dataStore?.['lot_data']) {
                        let newRow = GRDataTableHandle.tableLot.DataTable().row.add(lot_data).draw().node();
                        GRLoadDataHandle.loadDDLot(newRow.querySelector('.dropdown-menu-lot'), lot_data?.['lot']);
                        for (let ele of newRow.querySelectorAll('.date-picker')) {
                            GRLoadDataHandle.loadDatePicker($(ele));
                        }
                    }
                }
                if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    GRLoadDataHandle.loadTableDisabled(GRDataTableHandle.tableLot);
                }
            }
        }
        return true;
    };

    static loadAddRowLot() {
        if (!GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')) {
            $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-validate-no-warehouse')}, 'failure');
            return false;
        }
        let data = {
            'lot_number': '',
            'quantity_import': '',
            'expire_date': '',
            'manufacture_date': '',
        }
        let newRow = GRDataTableHandle.tableLot.DataTable().row.add(data).draw().node();
        for (let ele of newRow.querySelectorAll('.date-picker')) {
            GRLoadDataHandle.loadDatePicker($(ele));
        }
        GRLoadDataHandle.loadDDLot(newRow.querySelector('.dropdown-menu-lot'));
        return true;
    };

    static loadCheckLotDDItem(ele, row) {
        let dataLotRaw = ele.getAttribute('data-lot');
        if (dataLotRaw) {
            let dataLot = JSON.parse(dataLotRaw);
            let eleLotNumber = row.querySelector('.table-row-lot-number');
            let eleImport = row.querySelector('.table-row-import');
            let eleExpire = row.querySelector('.table-row-expire-date');
            let eleManufacture = row.querySelector('.table-row-manufacture-date');
            if (eleLotNumber) {
                eleLotNumber.value = dataLot?.['lot_number'];
            }
            ele.setAttribute('data-checked', 'true');
            $(ele).css('background-color', '#eef6ff');
            if (eleImport) {
                eleImport.value = '0';
            }
            if (eleExpire) {
                let date = '';
                if (dataLot?.['expire_date']) {
                    date = moment(dataLot?.['expire_date']).format('DD/MM/YYYY');
                }
                $(eleExpire).val(date);
            }
            if (eleManufacture) {
                let date = '';
                if (dataLot?.['manufacture_date']) {
                    date = moment(dataLot?.['manufacture_date']).format('DD/MM/YYYY');
                }
                $(eleManufacture).val(date);
            }
        }
        return true;
    };

    static loadUnCheckLotDDItem(row) {
        let is_checked = false;
        for (let ddItem of row.querySelectorAll('.dropdown-item-lot')) {
            if (ddItem.getAttribute('data-checked') === 'true') {
                is_checked = true;
            }
            ddItem.setAttribute('data-checked', 'false');
            $(ddItem).css('background-color', '');
        }
        return is_checked;
    };

    static loadDataIfChangeDateLotRow(row) {
        let is_checked = GRLoadDataHandle.loadUnCheckLotDDItem(row);
            if (is_checked === true) {
                row.querySelector('.table-row-lot-number').value = '';
                if ($(this).hasClass('table-row-expire-date')) {
                    row.querySelector('.table-row-manufacture-date').value = '';
                } else {
                    row.querySelector('.table-row-expire-date').value = '';
                }
            }
    }

    static loadNewRowsSerial() {
        let tablePO = GRDataTableHandle.tablePOProduct;
        let elePOChecked = tablePO[0]?.querySelector('.table-row-checkbox:checked');
        if (elePOChecked) {
            let row = elePOChecked.closest('tr');
            let rowIndex = tablePO.DataTable().row(row).index();
            let $row = tablePO.DataTable().row(rowIndex);
            let dataStore = $row.data();
            let eleWHChecked = GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked');
            if (eleWHChecked) {
                let idWH = eleWHChecked.getAttribute('data-id');
                let elePRChecked = GRDataTableHandle.tablePR[0].querySelector('.table-row-checkbox:checked');
                if (elePRChecked) {
                    let idPR = elePRChecked.getAttribute('data-id');
                    if (dataStore?.['pr_products_data']) {
                        for (let prProductData of dataStore?.['pr_products_data']) {
                            if (prProductData?.['purchase_order_request_product_id'] === idPR) {
                                if (prProductData?.['gr_warehouse_data']) {
                                    for (let grWHData of prProductData?.['gr_warehouse_data']) {
                                        if (grWHData?.['warehouse_id'] === idWH) {
                                            dataStore = grWHData;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (dataStore?.['gr_warehouse_data']) {
                        for (let grWHData of dataStore?.['gr_warehouse_data']) {
                            if (grWHData?.['warehouse_id'] === idWH) {
                                dataStore = grWHData;
                                break;
                            }
                        }
                    }
                }
                if (dataStore?.['serial_data']) {
                    for (let serial_data of dataStore?.['serial_data']) {
                        let newRow = GRDataTableHandle.tableSerial.DataTable().row.add(serial_data).draw().node();
                        for (let ele of newRow.querySelectorAll('.date-picker')) {
                            GRLoadDataHandle.loadDatePicker($(ele));
                        }
                    }
                }
                if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    GRLoadDataHandle.loadTableDisabled(GRDataTableHandle.tableSerial);
                }
            }
        }
        return true;
    };

    static loadAddRowSerial() {
        if (!GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')) {
            $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-validate-no-warehouse')}, 'failure');
            return false;
        }
        let data = {
            'vendor_serial_number': '',
            'serial_number': '',
            'expire_date': '',
            'manufacture_date': '',
            'warranty_start': '',
            'warranty_end': '',
        }
        let newRow = GRDataTableHandle.tableSerial.DataTable().row.add(data).draw().node();
        for (let ele of newRow.querySelectorAll('.date-picker')) {
            GRLoadDataHandle.loadDatePicker($(ele));
        }
        return true;
    };

    static loadCheckApplyLot(ele) {
        if (ele.value !== '') {
            let lot_number = ele.value;
            let tablePO = GRDataTableHandle.tablePOProduct;
            let tableWH = GRDataTableHandle.tableWH;
            let elePOChecked = tablePO[0]?.querySelector('.table-row-checkbox:checked');
            let eleWHChecked = tableWH[0]?.querySelector('.table-row-checkbox:checked');
            if (elePOChecked && eleWHChecked) {
                let row = elePOChecked.closest('tr');
                let rowIndex = tablePO.DataTable().row(row).index();
                let $row = tablePO.DataTable().row(rowIndex);
                let dataStore = $row.data();
                let idWH = eleWHChecked.getAttribute('data-id');

                $.fn.callAjax2({
                        'url': GRLoadDataHandle.urlEle.attr('data-product-warehouse-lot'),
                        'method': 'GET',
                        'data': {'lot_number': lot_number},
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('warehouse_lot_list') && Array.isArray(data.warehouse_lot_list)) {
                                // check unique in DB
                                for (let wh_lot of data?.['warehouse_lot_list']) {
                                    if (wh_lot?.['product_warehouse']) {
                                        if (wh_lot?.['product_warehouse']?.['product'] && wh_lot?.['product_warehouse']?.['warehouse']) {
                                            if (wh_lot?.['product_warehouse']?.['product']?.['id'] === dataStore?.['product_data']?.['id']) {
                                                if (wh_lot?.['product_warehouse']?.['warehouse']?.['id'] === idWH) {
                                                    ele.value = '';
                                                    let eleImport = ele?.closest('tr')?.querySelector('.table-row-import');
                                                    if (eleImport) {
                                                        eleImport.value = 0;
                                                    }
                                                    $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-lot-exist')}, 'failure');
                                                    return false;
                                                }
                                            } else {
                                                ele.value = '';
                                                let eleImport = ele?.closest('tr')?.querySelector('.table-row-import');
                                                if (eleImport) {
                                                    eleImport.value = 0;
                                                }
                                                $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-lot-exist')}, 'failure');
                                                return false;
                                            }
                                        }
                                    }
                                }
                                // check unique in tableLot
                                let checkNum = 0;
                                for (let eleLotNumber of GRDataTableHandle.tableLot[0].querySelectorAll(".table-row-lot-number")) {
                                    if (ele.value === eleLotNumber.value) {
                                        checkNum++;
                                        if (checkNum > 1) {
                                            ele.value = '';
                                            let eleImport = ele?.closest('tr')?.querySelector('.table-row-import');
                                            if (eleImport) {
                                                eleImport.value = 0;
                                            }
                                            $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-lot-different')}, 'failure');
                                            return false;
                                        }
                                    }
                                }
                                GRStoreDataHandle.storeDataProduct();
                                return true;
                            }
                        }
                    }
                )
            }
        }
        return true
    };

    static loadCheckApplySerial(ele) {
        if (ele.value !== '') {
            let serial_number = ele.value;
            let tablePO = GRDataTableHandle.tablePOProduct;
            let elePOChecked = tablePO[0]?.querySelector('.table-row-checkbox:checked');
            if (elePOChecked) {
                let row = elePOChecked.closest('tr');
                let rowIndex = tablePO.DataTable().row(row).index();
                let $row = tablePO.DataTable().row(rowIndex);
                let dataStore = $row.data();
                $.fn.callAjax2({
                        'url': GRLoadDataHandle.urlEle.attr('data-product-warehouse-serial'),
                        'method': 'GET',
                        'data': {
                            'product_warehouse__product_id': dataStore?.['product_data']?.['id'],
                            'serial_number': serial_number
                        },
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('warehouse_serial_list') && Array.isArray(data.warehouse_serial_list)) {
                                // check unique in DB
                                if (data.warehouse_serial_list.length > 0) {
                                    ele.value = '';
                                    $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-serial-exist')}, 'failure');
                                    return false;
                                }
                                // check unique in tableSerial
                                let checkNum = 0;
                                for (let eleSerialNumber of GRDataTableHandle.tableSerial[0].querySelectorAll(".table-row-serial-number")) {
                                    if (ele.value === eleSerialNumber.value) {
                                        checkNum++;
                                        if (checkNum > 1) {
                                            ele.value = '';
                                            $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-serial-different')}, 'failure');
                                            return false;
                                        }
                                    }
                                }
                                // if check pass => apply
                                GRStoreDataHandle.storeDataProduct();
                                let check = GRLoadDataHandle.loadCheckExceedQuantity();
                                if (check === false) {
                                    let rowIndex = GRDataTableHandle.tableSerial.DataTable().row(ele.closest('tr')).index();
                                    let row = GRDataTableHandle.tableSerial.DataTable().row(rowIndex);
                                    row.remove().draw();
                                    GRStoreDataHandle.storeDataProduct();
                                }
                                return true;
                            }
                        }
                    }
                )
            }
        }
        return true;
    };

    static loadCheckExceedQuantity() {
        let check = true;
        GRDataTableHandle.tablePR.DataTable().rows().every(function () {
            let row = this.node();
            let remainELe = row.querySelector('.table-row-gr-remain');
            let importELe = row.querySelector('.table-row-import');
            if (remainELe && importELe) {
                if (remainELe.innerHTML && importELe.value) {
                    let remain = parseFloat(remainELe.innerHTML);
                    let imported = parseFloat(importELe.value);
                    if (imported > remain) {
                        check = false;
                    }
                }
            }
        });
        if (check === false) {
            $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-validate-import')}, 'failure');
            return check;
        }
        GRDataTableHandle.tablePOProduct.DataTable().rows().every(function () {
            let row = this.node();
            let remainELe = row.querySelector('.table-row-gr-remain');
            let importELe = row.querySelector('.table-row-import');
            if (remainELe && importELe) {
                if (remainELe.innerHTML && importELe.value) {
                    let remain = parseFloat(remainELe.innerHTML);
                    let imported = parseFloat(importELe.value);
                    if (imported > remain) {
                        check = false;
                    }
                }
            }
        });
        if (check === false) {
            $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-validate-import')}, 'failure');
            return check;
        }

        return check;
    };

    static loadDataShowPR(data) {
        let elePR = $('#good-receipt-purchase-request');
        let purchase_requests_data = [];
        let eleAppend = ``;
        let is_checked = false;
        for (let PR of data) {
            is_checked = true;
            let prID = PR?.['id'];
            let prCode = PR?.['code'];
            let link = "";
            let linkDetail = elePR.attr('data-link-detail');
            link = linkDetail.format_url_with_uuid(prID);
            eleAppend += `<div class="chip chip-secondary bg-green-light-5 mr-1 mb-1">
                                <span>
                                    <a href="${link}" target="_blank" class="link-primary underline_hover"><span class="chip-text">${prCode}</span></a>
                                </span>
                            </div>`;
            purchase_requests_data.push(prID);
        }
        if (is_checked === true) {
            elePR.empty();
            elePR.append(eleAppend);
        } else {
            elePR.empty();
        }
        GRLoadDataHandle.PRDataEle.val(JSON.stringify(purchase_requests_data));
        return true;
    };

    static loadLineDetail() {
        let data = GRSubmitHandle.setupDataShowLineDetail();
        GRDataTableHandle.tableLineDetailPO.DataTable().clear().draw();
        GRDataTableHandle.tableLineDetailPO.DataTable().rows.add(data).draw();
        GRLoadDataHandle.loadDataRowTable(GRDataTableHandle.tableLineDetailPO);
        return true;
    };

    static loadDataRowTable($table) {
        GRCalculateHandle.calculateTable($table);
        return true;
    };

    static loadDataRow(row, $table) {
        // mask money
        $.fn.initMaskMoney2();
        let rowIndex = $table.DataTable().row(row).index();
        let $row = $table.DataTable().row(rowIndex);
        let dataStore = $row.data();
        if (row.querySelector('.table-row-item')) {
            if (dataStore?.['product_data']?.['id']) {
                GRLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [dataStore?.['product_data']]);
                if (GRLoadDataHandle.typeSelectEle.val() === '3') {
                    if (row.querySelector('.table-row-price')) {
                        // call ajax check BOM
                        $.fn.callAjax2({
                                'url': GRLoadDataHandle.urlEle.attr('data-md-bom'),
                                'method': 'GET',
                                'data': {
                                    'product_id': dataStore?.['product_data']?.['id'],
                                },
                                'isDropdown': true,
                            }
                        ).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    if (data.hasOwnProperty('bom_order_list') && Array.isArray(data.bom_order_list)) {
                                        let elePrice = row.querySelector('.table-row-price');
                                        if (data.bom_order_list.length > 0) {
                                            if (elePrice) {
                                                elePrice.setAttribute('disabled', 'true');
                                                $(elePrice).attr('value', String(data.bom_order_list[0]?.['sum_price']));
                                                $.fn.initMaskMoney2();
                                                GRCalculateHandle.calculateMain(GRDataTableHandle.tableLineDetailPO, row);
                                            }
                                        }
                                    }
                                }
                            }
                        )
                    }
                }
            }
        }
        if (row.querySelector('.table-row-uom')) {
            GRLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')), [dataStore?.['uom_data']], {'group': dataStore?.['uom_data']?.['uom_group']?.['id']});
        }
        if (row.querySelector('.table-row-tax')) {
            GRLoadDataHandle.loadInitS2($(row.querySelector('.table-row-tax')), [dataStore?.['tax_data']]);
        }
        if (row.querySelector('.table-row-warehouse')) {
            GRLoadDataHandle.loadInitS2($(row.querySelector('.table-row-warehouse')), [dataStore?.['warehouse_data']]);
        }
        return true;
    };

    static loadClearModal() {
        GRDataTableHandle.tablePOProduct.DataTable().clear().draw();
        GRDataTableHandle.tablePR.DataTable().clear().draw();
        GRLoadDataHandle.$scrollPR[0].setAttribute('hidden', 'true');
        GRDataTableHandle.tableWH.DataTable().clear().draw();
        GRLoadDataHandle.$scrollLot[0].setAttribute('hidden', 'true');
        GRLoadDataHandle.$scrollSerial[0].setAttribute('hidden', 'true');
        return true;
    };

    static loadCheckIsAdditional(ele) {
        if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            let row = ele.closest('tr');
            row.querySelector('.table-row-import').value = '0';
            if (ele.checked === true) {
                GRDataTableHandle.tableLot.DataTable().clear().draw();
                GRDataTableHandle.tableSerial.DataTable().clear().draw();
                $('#btn-add-manage-lot')[0].setAttribute('disabled', 'true');
                $('#btn-add-manage-serial')[0].setAttribute('disabled', 'true');
                if (row.querySelector('.table-row-import')) {
                    row.querySelector('.table-row-import').removeAttribute('disabled');
                }
                if (row.querySelector('.table-row-checkbox')) {
                    row.querySelector('.table-row-checkbox').checked = true;
                }
            }
            if (ele.checked === false) {
                $('#btn-add-manage-lot')[0].removeAttribute('disabled');
                $('#btn-add-manage-serial')[0].removeAttribute('disabled');
                row.querySelector('.table-row-import').setAttribute('disabled', 'true');
            }
            GRStoreDataHandle.storeDataProduct();
        }
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

    // LOAD DETAIL
    static loadDetailPage(data) {
        $('#good-receipt-title').val(data?.['title']);
        $('#good-receipt-note').val(data?.['remarks']);
        if (data?.['date_received']) {
            $('#good-receipt-date-received').val(moment(data?.['date_received']).format('DD/MM/YYYY'));
        } else {
            $('#good-receipt-date-received').val('');
        }
        let type_data = {
            '1': GRLoadDataHandle.transEle.attr('data-for-po'),
            '2': GRLoadDataHandle.transEle.attr('data-for-ia'),
            '3': GRLoadDataHandle.transEle.attr('data-for-production'),
        }
        let idAreaShow = String(data?.['goods_receipt_type'] + 1);
        GRLoadDataHandle.loadInitS2(GRLoadDataHandle.typeSelectEle, GRLoadDataHandle.dataTypeGr);
        GRLoadDataHandle.typeSelectEle.val(idAreaShow);
        let boxRender = $('#good-receipt-type-area')[0]?.querySelector('.select2-selection__rendered');
        if (boxRender) {
            boxRender.innerHTML = type_data[idAreaShow];
            boxRender.setAttribute('title', type_data[idAreaShow]);
        }
        GRLoadDataHandle.loadCustomAreaByType();
        if (data?.['is_no_warehouse'] === true) {
            GRLoadDataHandle.$isNoWHEle.trigger('click');
        }
        if (idAreaShow === '1') {  // GR for PO
            GRLoadDataHandle.loadInitS2(GRLoadDataHandle.POSelectEle, [data?.['purchase_order_data']], {'receipt_status__in': [0, 1, 2].join(','), 'system_status': 3});
            GRLoadDataHandle.loadInitS2(GRLoadDataHandle.supplierSelectEle, [data?.['supplier_data']]);
            GRLoadDataHandle.loadDataShowPR(data?.['purchase_requests']);
        }
        if (idAreaShow === '2') {  // GR for IA
            GRLoadDataHandle.loadInitS2(GRLoadDataHandle.IASelectEle, [data?.['inventory_adjustment_data']], {'state': 2});
        }
        if (idAreaShow === '3') {  // GR for Production
            if (data?.['production_report_type'] === 0) {
                GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxProductionOrder, [data?.['production_order_data']], {'system_status': 3});
            }
            if (data?.['production_report_type'] === 1) {
                GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxWorkOrder, [data?.['work_order_data']], {'system_status': 3});
            }
            GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxProductionReport, data?.['production_reports_data']);
        }
        GRDataTableHandle.tableLineDetailPO.DataTable().rows.add(data?.['gr_products_data']).draw();
        GRLoadDataHandle.loadDataRowTable(GRDataTableHandle.tableLineDetailPO);
        if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            GRLoadDataHandle.loadTableDisabled(GRDataTableHandle.tableLineDetailPO);
        }
        GRLoadDataHandle.loadDetailProducts(data);
        return true;
    };

    static loadDetailProducts(dataDetail) {
        let dataProducts = dataDetail?.['gr_products_data'];
        let typeGR = GRLoadDataHandle.typeSelectEle.val();
        let frm = new SetupFormSubmit(GRDataTableHandle.tablePOProduct);
        if (typeGR === '1' && GRLoadDataHandle.POSelectEle.val()) {
            $.fn.callAjax2({
                    'url': frm.dataUrl,
                    'method': frm.dataMethod,
                    'data': {'purchase_order_id': GRLoadDataHandle.POSelectEle.val()},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('purchase_order_product_gr') && Array.isArray(data.purchase_order_product_gr)) {
                            GRLoadDataHandle.loadTotal(dataDetail);
                            for (let dataPOPro of data.purchase_order_product_gr) {
                                let isDetail = false;
                                for (let dataProduct of dataProducts) {
                                    if (dataProduct?.['purchase_order_product_id'] === dataPOPro?.['purchase_order_product_id']) {
                                        dataProduct['gr_completed_quantity'] = dataPOPro?.['gr_completed_quantity'];
                                        dataProduct['gr_remain_quantity'] = dataPOPro?.['gr_remain_quantity'];
                                        for (let dataPOPRPro of dataPOPro?.['pr_products_data']) {
                                            for (let dataPRProduct of dataProduct?.['pr_products_data']) {
                                                if (dataPRProduct?.['purchase_order_request_product_id'] === dataPOPRPro?.['purchase_order_request_product_id']) {
                                                    dataPRProduct['gr_completed_quantity'] = dataPOPRPro?.['gr_completed_quantity'];
                                                    dataPRProduct['gr_remain_quantity'] = dataPOPRPro?.['gr_remain_quantity'];
                                                    break;
                                                }
                                            }
                                        }
                                        isDetail = true;
                                        break;
                                    }
                                }
                                if (isDetail === false) {
                                    dataProducts.push(dataPOPro);
                                }
                            }
                            GRDataTableHandle.tablePOProduct.DataTable().clear().draw();
                            GRDataTableHandle.tablePOProduct.DataTable().rows.add(dataProducts).draw();
                        }
                    }
                }
            )
        }
        if (typeGR === '2' && GRLoadDataHandle.IASelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(GRLoadDataHandle.IASelectEle, $(this).val());
            for (let dataIAPro of dataSelected?.['gr_products_data']) {
                let isDetail = false;
                for (let dataProduct of dataProducts) {
                    if (dataProduct?.['ia_item_id'] === dataIAPro?.['ia_item_id']) {
                        dataProduct['gr_completed_quantity'] = dataIAPro?.['gr_completed_quantity'];
                        dataProduct['gr_remain_quantity'] = dataIAPro?.['gr_remain_quantity'];
                        isDetail = true;
                        break;
                    }
                }
                if (isDetail === false) {
                    dataProducts.push(dataIAPro);
                }
            }
            GRDataTableHandle.tablePOProduct.DataTable().clear().draw();
            GRDataTableHandle.tablePOProduct.DataTable().rows.add(dataProducts).draw();
        }
        if (typeGR === '3' && (GRLoadDataHandle.$boxProductionOrder.val() || GRLoadDataHandle.$boxWorkOrder.val())) {
            let idList = [];
            if (dataProducts.length > 0) {
                for (let report of dataProducts[0]?.['pr_products_data']) {
                    idList.push(report?.['production_report_id']);
                }
            }

            $.fn.callAjax2({
                    'url': GRLoadDataHandle.$boxProductionReport.attr('data-url'),
                    'method': 'GET',
                    'data': {'id__in': idList.join(',')},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('production_report_gr') && Array.isArray(data.production_report_gr)) {
                            GRLoadDataHandle.loadTotal(dataDetail);
                            GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxProductionReport, data.production_report_gr, {'production_order_id': GRLoadDataHandle.$boxProductionOrder.val()});
                            if (GRLoadDataHandle.$boxProductionReport.val().length > 0) {
                                let dataProductionPro = GRLoadDataHandle.loadSetupProduction();
                                let isDetail = false;
                                for (let dataProduct of dataProducts) {
                                    if (dataProduct?.['production_order_id'] === dataProductionPro?.['production_order_id']) {
                                        dataProduct['gr_completed_quantity'] = dataProductionPro?.['gr_completed_quantity'];
                                        dataProduct['gr_remain_quantity'] = dataProductionPro?.['gr_remain_quantity'];
                                        for (let dataPOPRPro of dataProductionPro?.['pr_products_data']) {
                                            for (let dataPRProduct of dataProduct?.['pr_products_data']) {
                                                if (dataPRProduct?.['production_report_id'] === dataPOPRPro?.['production_report_id']) {
                                                    dataPRProduct['gr_completed_quantity'] = dataPOPRPro?.['gr_completed_quantity'];
                                                    dataPRProduct['gr_remain_quantity'] = dataPOPRPro?.['gr_remain_quantity'];
                                                    break;
                                                }
                                            }
                                        }
                                        isDetail = true;
                                        break;
                                    }
                                }
                                if (isDetail === false) {
                                    dataProducts.push(dataProductionPro);
                                }
                                GRDataTableHandle.tablePOProduct.DataTable().clear().draw();
                                GRDataTableHandle.tablePOProduct.DataTable().rows.add(dataProducts).draw();
                            }
                        }
                    }
                }
            )
        }
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
        let tableWrapper = document.getElementById('datable-good-receipt-line-detail-po_wrapper');
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
class GRDataTableHandle {
    static productInitEle = $('#data-init-product');
    static uomInitEle = $('#data-init-uom');
    static taxInitEle = $('#data-init-tax');

    static tablePOProduct = $('#datable-good-receipt-po-product');
    static tablePR = $('#datable-good-receipt-purchase-request');
    static tableWH = $('#datable-good-receipt-warehouse');
    static tableLot = $('#datable-good-receipt-manage-lot');
    static tableSerial = $('#datable-good-receipt-manage-serial');
    static tableLineDetailPO = $('#datable-good-receipt-line-detail-po');

    static tableProductionReport = $('#table-production-report');

    // PO
    static dataTableGoodReceiptPOProduct(data) {
        GRDataTableHandle.tablePOProduct.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "200px",
            columns: [
                {
                    targets: 0,
                    width: '20%',
                    render: (data, type, row) => {
                        let targetID = row?.['purchase_order_product_id'];  // PO
                        if (row?.['ia_item_id']) {  // IA
                            targetID = row?.['ia_item_id'];
                        }
                        if (row?.['production_order_id']) {  // PRODUCTION
                            targetID = row?.['production_order_id'];
                        }
                        if (targetID) {
                            return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input 
                                        type="radio" 
                                        class="form-check-input table-row-checkbox" 
                                        id="po-pro-${targetID.replace(/-/g, "")}"
                                        data-id="${row?.['id']}"
                                    >
                                    <label class="form-check-label table-row-item" for="po-pro-${targetID.replace(/-/g, "")}">${row?.['product_data']?.['title']}</label>
                                </div>`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 1,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['uom_data']?.['title']}</span>`;
                    }
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row?.['product_quantity_order_actual'] ? row?.['product_quantity_order_actual'] : 0}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span class="table-row-gr-remain">${row?.['gr_remain_quantity'] ? row?.['gr_remain_quantity'] : 0}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '15%',
                    render: (data, type, row) => {
                        let readonly = "readonly";
                        // Kiểm tra nếu nhập không qua kho & không có pr_products_data thì bỏ readonly
                        if (GRLoadDataHandle.$isNoWHEle[0].checked === true) {
                            if (row?.['pr_products_data']) {
                                if (row?.['pr_products_data'].length === 0) {
                                    readonly = "";
                                }
                            } else {
                                readonly = "";
                            }
                        }
                        return `<input type="text" class="form-control table-row-import valid-num" value="${row?.['quantity_import'] ? row?.['quantity_import'] : 0}" ${readonly}>`;
                    }
                },
            ],
            drawCallback: function () {
                GRLoadDataHandle.loadEventRadio(GRDataTableHandle.tablePOProduct);
            },
        });
    };

    static dataTableGoodReceiptPR(data) {
        GRDataTableHandle.tablePR.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "200px",
            columns: [
                {
                    targets: 0,
                    width: '20%',
                    render: (data, type, row) => {
                        let typeGR = GRLoadDataHandle.typeSelectEle.val();
                        let prTxt = GRLoadDataHandle.transEle.attr('data-stock');
                        let prID = '';
                        if (typeGR === '1') {
                            if (row?.['purchase_request_data']?.['code']) {
                                prID = row?.['purchase_order_request_product_id'];
                                prTxt = row?.['purchase_request_data']?.['code'];
                            }
                        }
                        if (typeGR === '3') {
                            if (row?.['production_report_data']?.['code']) {
                                prID = row?.['production_report_id'];
                                prTxt = row?.['production_report_data']?.['code'];
                            }
                        }
                        return `<div class="form-check form-check-lg">
                                    <input 
                                        type="radio" 
                                        class="form-check-input table-row-checkbox" 
                                        id="pr-${prID.replace(/-/g, "")}"
                                        data-id="${prID}" 
                                    >
                                    <label class="form-check-label table-row-item" for="pr-${prID.replace(/-/g, "")}">${prTxt}</label>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['uom_data']?.['title'] ? row?.['uom_data']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row?.['quantity_order']}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span class="table-row-gr-remain">${row?.['gr_remain_quantity'] ? row?.['gr_remain_quantity'] : 0}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '15%',
                    render: (data, type, row) => {
                        let readonly = "readonly";
                        // Kiểm tra nếu nhập không qua kho thì bỏ readonly
                        if (GRLoadDataHandle.$isNoWHEle[0].checked === true) {
                            readonly = "";
                        }
                        return `<input type="text" class="form-control table-row-import valid-num" value="${row?.['quantity_import'] ? row?.['quantity_import'] : 0}" ${readonly}>`;
                    }
                },
            ],
            drawCallback: function () {
                GRLoadDataHandle.loadEventRadio(GRDataTableHandle.tablePR);
            },
        });
    };

    static dataTableGoodReceiptWH(data) {
        GRDataTableHandle.tableWH.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "200px",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input 
                                        type="radio" 
                                        class="form-check-input table-row-checkbox"
                                        id="wh-${row?.['warehouse_id'].replace(/-/g, "")}"
                                        data-id="${row?.['warehouse_id']}" 
                                    >
                                    <label class="form-check-label table-row-title" for="wh-${row?.['warehouse_id'].replace(/-/g, "")}">${row?.['title'] ? row?.['title'] : ''}</label>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row?.['code'] ? row?.['code'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let checked = ``;
                        if (row?.['is_additional'] === true) {
                            checked = `checked`;
                        }
                        let hidden = '';
                        let tablePO = GRDataTableHandle.tablePOProduct;
                        let elePOChecked = tablePO[0].querySelector('.table-row-checkbox:checked');
                        if (elePOChecked) {
                            let row = elePOChecked.closest('tr');
                            let rowIndex = tablePO.DataTable().row(row).index();
                            let $row = tablePO.DataTable().row(rowIndex);
                            let dataStore = $row.data();
                            if ([0, 1].includes(dataStore?.['product_data']?.['general_traceability_method'])) {
                                hidden = 'hidden';
                            }
                        }
                        return `<div class="form-check form-switch">
                                    <input type="checkbox" class="form-check-input table-row-checkbox-additional" ${checked} ${hidden}>
                                </div>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let disabled = '';
                        if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                            disabled = 'disabled';
                        }
                        let tablePO = GRDataTableHandle.tablePOProduct;
                        let elePOChecked = tablePO[0].querySelector('.table-row-checkbox:checked');
                        if (elePOChecked) {
                            let row = elePOChecked.closest('tr');
                            let rowIndex = tablePO.DataTable().row(row).index();
                            let $row = tablePO.DataTable().row(rowIndex);
                            let dataStore = $row.data();
                            if ([1, 2].includes(dataStore?.['product_data']?.['general_traceability_method'])) {
                                disabled = 'disabled';
                            }
                        }
                        if (row?.['is_additional'] === true) {
                            disabled = '';
                        }
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-import valid-num text-black" value="${row?.['quantity_import'] ? row?.['quantity_import'] : 0}" ${disabled}>
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['uom_data']?.['title'] ? row?.['uom_data']?.['title'] : ''}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                GRLoadDataHandle.loadEventRadio(GRDataTableHandle.tableWH);
            },
        });
    };

    static dataTableGoodReceiptWHLot(data) {
        GRDataTableHandle.tableLot.not('.dataTable').DataTableDefault({
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
                        return `<div class="row">
                                    <div class="input-group">
                                        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">${GRLoadDataHandle.transEle.attr('data-select')}</button>
                                        <ul class="dropdown-menu dropdown-bordered dropdown-menu-lot w-250p"></ul>
                                        <input type="text" class="form-control table-row-lot-number" value="${row?.['lot_number'] ? row?.['lot_number'] : ''}">
                                    </div>
                                </div>`;

                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-import valid-num" value="${row?.['quantity_import'] ? row?.['quantity_import'] : ''}" required>
                                </div>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let date = '';
                        if (row?.['expire_date']) {
                            date = moment(row?.['expire_date']).format('DD/MM/YYYY')
                        }
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-expire-date date-picker" value="${date}">
                                </div>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let date = '';
                        if (row?.['manufacture_date']) {
                            date = moment(row?.['manufacture_date']).format('DD/MM/YYYY')
                        }
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-manufacture-date date-picker" value="${date}">
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            drawCallback: function () {
                if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                    GRDataTableHandle.dtbLotHDCustom();
                }
            },
        });
    };

    static dataTableGoodReceiptWHSerial(data) {
        GRDataTableHandle.tableSerial.not('.dataTable').DataTableDefault({
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
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-vendor-serial-number" value="${row?.['vendor_serial_number'] ? row?.['vendor_serial_number'] : ''}">
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-serial-number" value="${row?.['serial_number'] ? row?.['serial_number'] : ''}" required>
                                </div>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let date = '';
                        if (row?.['expire_date']) {
                            date = moment(row?.['expire_date']).format('DD/MM/YYYY');
                        }
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-expire-date date-picker" value="${date}">
                                </div>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let date = '';
                        if (row?.['manufacture_date']) {
                            date = moment(row?.['manufacture_date']).format('DD/MM/YYYY');
                        }
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-manufacture-date date-picker" value="${date}">
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let date = '';
                        if (row?.['warranty_start']) {
                            date = moment(row?.['warranty_start']).format('DD/MM/YYYY');
                        }
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-warranty-start date-picker" value="${date}">
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        let date = '';
                        if (row?.['warranty_end']) {
                            date = moment(row?.['warranty_end']).format('DD/MM/YYYY');
                        }
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-warranty-end date-picker" value="${date}">
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            drawCallback: function () {
                if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                    GRDataTableHandle.dtbSerialHDCustom();
                }
            },
        });
    };

    static dataTableGoodReceiptLineDetailPO(data) {
        GRDataTableHandle.tableLineDetailPO.not('.dataTable').DataTableDefault({
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
                    render: (data, type, row) => {
                        return `<span class="table-row-order" data-product-id="${row?.['product_data']?.['id']}">${row?.['order']}</span>`
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
                                            data-url="${GRDataTableHandle.productInitEle.attr('data-url')}"
                                            data-link-detail="${GRDataTableHandle.productInitEle.attr('data-link-detail')}"
                                            data-method="${GRDataTableHandle.productInitEle.attr('data-method')}"
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
                                    data-url="${GRDataTableHandle.uomInitEle.attr('data-url')}"
                                    data-method="${GRDataTableHandle.uomInitEle.attr('data-method')}"
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
                        return `<input type="text" class="form-control table-row-import valid-num" value="${row.quantity_import}" required readonly>`;
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
                                    data-url="${GRDataTableHandle.taxInitEle.attr('data-url')}"
                                    data-method="${GRDataTableHandle.taxInitEle.attr('data-method')}"
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
                                    <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['product_subtotal_price'] ? row?.['product_subtotal_price'] : '0')}"></span></p>
                                    <input
                                        type="text"
                                        class="form-control table-row-subtotal-raw"
                                        value="${row?.['product_subtotal_price']}"
                                        hidden
                                    >
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
                GRLoadDataHandle.loadDataRow(row, GRDataTableHandle.tableLineDetailPO);
            },
            drawCallback: function () {
                GRDataTableHandle.dtbProductHDCustom();
            },
        });
    };

    static dataTableProductionReport(data) {
        // init dataTable
        GRDataTableHandle.tableProductionReport.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        if (row?.['title'] && row?.['code']) {
                            let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                            return `<div class="form-check form-check-lg">
                                        <input type="checkbox" class="form-check-input table-row-checkbox" id="report-${row?.['id'].replace(/-/g, "")}" data-row="${dataRow}">
                                        <label class="form-check-label table-row-title" for="report-${row?.['id'].replace(/-/g, "")}">${row?.['title']}</label>
                                        <span class="badge badge-soft-success">${row?.['code'] ? row?.['code'] : ''}</span>
                                    </div>`;
                        }
                        return `<span>--</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row?.['quantity_order']}</span>`;
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-remain">${row?.['gr_remain_quantity']}</span>`;
                    },
                },
            ],
            drawCallback: function () {
                GRLoadDataHandle.loadEventCheckbox(GRDataTableHandle.tableProductionReport);
            },
        });
    };

    // Custom dtb
    static dtbProductHDCustom() {
        let $table = GRDataTableHandle.tableLineDetailPO;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-edit-product-good-receipt').length) {
                let $group = $(`<button type="button" class="btn btn-primary btn-square" id="btn-edit-product-good-receipt" data-bs-toggle="offcanvas" data-bs-target="#productCanvas">
                                    <span><span class="icon"><span class="feather-icon"><i class="far fa-edit"></i></span></span><span>${GRLoadDataHandle.transEle.attr('data-edit')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
            }
        }
    };

    static dtbLotHDCustom() {
        let $table = GRDataTableHandle.tableLot;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-manage-lot').length) {
                let $group = $(`<button type="button" class="btn btn-primary btn-square" id="btn-add-manage-lot">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${GRLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-manage-lot').on('click', function () {
                    GRLoadDataHandle.loadAddRowLot();
                });
            }
        }
    };

    static dtbSerialHDCustom() {
        let $table = GRDataTableHandle.tableSerial;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-manage-serial').length) {
                let $group = $(`<button type="button" class="btn btn-primary btn-square" id="btn-add-manage-serial">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${GRLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-manage-serial').on('click', function () {
                    GRLoadDataHandle.loadAddRowSerial();
                });
            }
        }
    };

}

// Calculate
class GRCalculateHandle {
    static calculateTotal(table) {
        let tableWrapper = document.getElementById('datable-good-receipt-line-detail-po_wrapper');
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
        GRCalculateHandle.calculateRow(row);
        // calculate total
        GRCalculateHandle.calculateTotal(table[0]);
        return true;
    };

    static calculateTable(table) {
        table.DataTable().rows().every(function () {
            let row = this.node();
            GRCalculateHandle.calculateMain(table, row);
        });
    };
}

// Store data
class GRStoreDataHandle {
    static storeDataProduct() {
        let serial_data = [];
        let lot_data = [];
        let gr_warehouse_data = [];
        let pr_products_data = [];
        let tableSerial = GRDataTableHandle.tableSerial;
        let tableLot = GRDataTableHandle.tableLot;
        let tableWH = GRDataTableHandle.tableWH;
        let tablePR = GRDataTableHandle.tablePR;
        let tablePO = GRDataTableHandle.tablePOProduct;

        let isNoWH = GRLoadDataHandle.$isNoWHEle[0].checked;

        tableSerial.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = tableSerial.DataTable().row(row).index();
            let $row = tableSerial.DataTable().row(rowIndex);
            let rowData = $row.data();
            let eleSerial = row.querySelector('.table-row-serial-number');
            if (eleSerial) {
                if (eleSerial.value) {
                    rowData['serial_number'] = eleSerial.value;
                    let eleVendorSerial = row.querySelector('.table-row-vendor-serial-number');
                    let eleExpireDate = row.querySelector('.table-row-expire-date');
                    let eleManufactureDate = row.querySelector('.table-row-manufacture-date');
                    let eleWarrantyStart = row.querySelector('.table-row-warranty-start');
                    let eleWarrantyEnd = row.querySelector('.table-row-warranty-end');
                    if (eleVendorSerial) {
                        rowData['vendor_serial_number'] = eleVendorSerial.value;
                    }
                    if (eleExpireDate) {
                        if (eleExpireDate.value) {
                            rowData['expire_date'] = moment(eleExpireDate.value,
                                'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                        }
                    }
                    if (eleManufactureDate) {
                        if (eleManufactureDate.value) {
                            rowData['manufacture_date'] = moment(eleManufactureDate.value,
                                'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                        }
                    }
                    if (eleWarrantyStart) {
                        if (eleWarrantyStart.value) {
                            rowData['warranty_start'] = moment(eleWarrantyStart.value,
                                'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                        }
                    }
                    if (eleWarrantyEnd) {
                        if (eleWarrantyEnd.value) {
                            rowData['warranty_end'] = moment(eleWarrantyEnd.value,
                                'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                        }
                    }
                    tableSerial.DataTable().row(rowIndex).data(rowData);
                    for (let ele of row.querySelectorAll('.date-picker')) {
                        GRLoadDataHandle.loadDatePicker($(ele));
                    }
                    serial_data.push(rowData);
                }
            }
        });

        tableLot.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = tableLot.DataTable().row(row).index();
            let $row = tableLot.DataTable().row(rowIndex);
            let rowData = $row.data();
            let lotChecked = row.querySelector(".dropdown-item-lot[data-checked='true']");
            let eleLotNumber = row.querySelector('.table-row-lot-number');
            let eleQuantityImport = row.querySelector('.table-row-import');
            let eleExpireDate = row.querySelector('.table-row-expire-date');
            let eleManufactureDate = row.querySelector('.table-row-manufacture-date');
            if (eleLotNumber && eleQuantityImport) {
                if (eleLotNumber.value && eleQuantityImport.value > 0) {
                    if (lotChecked) {
                        rowData['lot_id'] = lotChecked.getAttribute('data-id');
                    }
                    rowData['lot_number'] = eleLotNumber.value;
                    rowData['quantity_import'] = parseFloat(eleQuantityImport.value);
                    if (eleExpireDate) {
                        if (eleExpireDate.value) {
                            rowData['expire_date'] = moment(eleExpireDate.value,
                                'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                        }
                    }
                    if (eleManufactureDate) {
                        if (eleManufactureDate.value) {
                            rowData['manufacture_date'] = moment(eleManufactureDate.value,
                                'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                        }
                    }
                    tableLot.DataTable().row(rowIndex).data(rowData);
                    for (let ele of row.querySelectorAll('.date-picker')) {
                        GRLoadDataHandle.loadDatePicker($(ele));
                    }
                    lot_data.push(rowData);
                }
            }
        });

        tableWH.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = tableWH.DataTable().row(row).index();
            let $row = tableWH.DataTable().row(rowIndex);
            let rowData = $row.data();
            let checked = row.querySelector('.table-row-checkbox:checked');
            if (checked) {
                rowData['serial_data'] = serial_data;
                rowData['lot_data'] = lot_data;
            }
            // SP không quản lý lô hay serial thì số lượng nhập lấy số nhập trực tiếp
            let importEle = row.querySelector('.table-row-import');
            let additionalEle = row.querySelector('.table-row-checkbox-additional');
            if (importEle && additionalEle) {
                if (importEle.value) {
                    rowData['quantity_import'] = parseFloat(importEle.value);
                }
                rowData['is_additional'] = additionalEle.checked;
            }
            // Kiểm tra SP có quản lý lô hay serial thì số lượng nhập lấy tổng nhập của lô hay serial
            if (rowData['is_additional'] === false) {
                let checkedPOEle = GRDataTableHandle.tablePOProduct[0].querySelector('.table-row-checkbox:checked');
                if (checkedPOEle) {
                    let checkedPORow = checkedPOEle.closest('tr');
                    if (checkedPORow) {
                        let rowIndexPO = GRDataTableHandle.tablePOProduct.DataTable().row(checkedPORow).index();
                        let $rowPO = GRDataTableHandle.tablePOProduct.DataTable().row(rowIndexPO);
                        let rowDataPO = $rowPO.data();
                        if (rowDataPO?.['product_data']?.['general_traceability_method'] === 1) {
                            if (rowData?.['lot_data']) {
                                let imported = 0;
                                for (let lotData of rowData?.['lot_data'] ? rowData?.['lot_data'] : []) {
                                    imported += lotData?.['quantity_import'];
                                }
                                rowData['quantity_import'] = imported;
                            }
                        }
                        if (rowDataPO?.['product_data']?.['general_traceability_method'] === 2) {
                            if (rowData?.['serial_data']) {
                                rowData['quantity_import'] = rowData?.['serial_data'].length;
                            }
                        }
                    }
                }
            }
            rowData['warehouse_id'] = rowData?.['id'];
            rowData['warehouse_data'] = {'id': rowData?.['id'], 'title': rowData?.['title'], 'code': rowData?.['code']};
            tableWH.DataTable().row(rowIndex).data(rowData);
            if (rowData?.['quantity_import'] > 0) {
                gr_warehouse_data.push(rowData);
            }

            if (checked) {
                let checkEle = row.querySelector('.table-row-checkbox');
                if (checkEle) {
                    checkEle.checked = true;
                }
            }
        });

        tablePR.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = tablePR.DataTable().row(row).index();
            let $row = tablePR.DataTable().row(rowIndex);
            let rowData = $row.data();
            let checked = row.querySelector('.table-row-checkbox:checked');
            if (checked) {
                rowData['gr_warehouse_data'] = gr_warehouse_data;
            }
            // Trường hợp nhập có kho thì số lượng nhập phải lấy tổng nhập của các kho
            if (rowData?.['gr_warehouse_data']) {
                let imported = 0;
                for (let grWHData of rowData?.['gr_warehouse_data']) {
                    if (grWHData?.['quantity_import']) {
                        imported += grWHData?.['quantity_import'];
                    }
                }
                rowData['quantity_import'] = imported;
            }
            // Trường hợp nhập không qua kho thì số lượng nhập lấy số nhập trực tiếp
            if (isNoWH === true) {
                rowData['gr_warehouse_data'] = [];
                let importEle = row.querySelector('.table-row-import');
                if (importEle) {
                    if ($(importEle).val()) {
                        rowData['quantity_import'] = parseFloat($(importEle).val());
                    }
                }
            }
            tablePR.DataTable().row(rowIndex).data(rowData);
            pr_products_data.push(rowData);

            if (checked) {
                let checkEle = row.querySelector('.table-row-checkbox');
                if (checkEle) {
                    checkEle.checked = true;
                }
            }
        });


        tablePO.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = tablePO.DataTable().row(row).index();
            let $row = tablePO.DataTable().row(rowIndex);
            let rowData = $row.data();
            let isPR = false;
            if (rowData?.['pr_products_data'].length > 0) {
                isPR = true;
            }
            let checked = row.querySelector('.table-row-checkbox:checked');
            if (checked) {
                rowData['pr_products_data'] = pr_products_data;
                rowData['gr_warehouse_data'] = gr_warehouse_data;
            }
            // Trường hợp nhập có kho thì số lượng nhập phải lấy tổng nhập của các PR
            if (isPR === true) {
                rowData['gr_warehouse_data'] = [];
                if (rowData?.['pr_products_data']) {
                    let imported = 0;
                    for (let grPRData of rowData?.['pr_products_data']) {
                        if (grPRData?.['quantity_import']) {
                            imported += grPRData?.['quantity_import'];
                        }
                    }
                    rowData['quantity_import'] = imported;
                }
            }
            if (isPR === false) {
                rowData['pr_products_data'] = [];
                if (rowData?.['gr_warehouse_data']) {
                    let imported = 0;
                    for (let grWHData of rowData?.['gr_warehouse_data']) {
                        if (grWHData?.['quantity_import']) {
                            imported += grWHData?.['quantity_import'];
                        }
                    }
                    rowData['quantity_import'] = imported;
                }
                // Trường hợp nhập không qua kho thì số lượng nhập lấy số nhập trực tiếp
                if (isNoWH === true) {
                    rowData['gr_warehouse_data'] = [];
                    let importEle = row.querySelector('.table-row-import');
                    if (importEle) {
                        if ($(importEle).val()) {
                            rowData['quantity_import'] = parseFloat($(importEle).val());
                        }
                    }
                }
            }
            tablePO.DataTable().row(rowIndex).data(rowData);

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
class GRSubmitHandle {

    static setupDataShowLineDetail(is_submit = false) {
        let result = [];
        if (GRLoadDataHandle.POSelectEle.val() || GRLoadDataHandle.IASelectEle.val() || GRLoadDataHandle.$boxProductionOrder.val() || GRLoadDataHandle.$boxWorkOrder.val()) {
            let table = GRDataTableHandle.tablePOProduct;
            let order = 0;
            table.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = table.DataTable().row(row).index();
                let $row = table.DataTable().row(rowIndex);
                let dataRowRaw = $row.data();
                let dataRow = {};
                for (let key in dataRowRaw) {
                    if (dataRowRaw.hasOwnProperty(key)) {
                        dataRow[key] = dataRowRaw[key];
                    }
                }
                order++;
                let quantityImport = 0;
                if (dataRow?.['product_data']?.['product_choice'].includes(1) || dataRow?.['pr_products_data'].length > 0) { // If PO Product have inventory choice or PO have PR
                    quantityImport = parseFloat(row.querySelector('.table-row-import').value);
                } else { // If PO Product doesn't have inventory choice and PO doesn't have PR
                    quantityImport = parseFloat(row.querySelector('.table-row-import').value);
                }
                if (quantityImport > 0) {
                    dataRow['quantity_import'] = quantityImport;
                    dataRow['order'] = order;
                    let dataProductID = dataRow?.['product_data']?.['id'];
                    if (is_submit === true) {
                        if (dataRow?.['product_data']?.['id']) {
                            dataRow['product_id'] = dataRow?.['product_data']?.['id'];
                            dataRow['product_data'] = dataRow?.['product_data'];
                        }
                        if (dataRow?.['uom_data']?.['id']) {
                            dataRow['uom_id'] = dataRow?.['uom_data']?.['id'];
                            dataRow['uom_data'] = dataRow?.['uom_data'];
                        }
                        if (dataRow?.['tax_data']?.['id']) {
                            dataRow['tax_id'] = dataRow?.['tax_data']?.['id'];
                            dataRow['tax_data'] = dataRow?.['tax_data'];
                        }
                        let field_list = [
                            'purchase_order_product_id',
                            'ia_item_id',
                            'production_order_id',
                            'work_order_id',
                            'product_id',
                            'product_data',
                            'uom_id',
                            'uom_data',
                            'tax_id',
                            'tax_data',
                            'product_quantity_order_actual',
                            'quantity_import',
                            'product_title',
                            'product_code',
                            'product_description',
                            'product_unit_price',
                            'product_subtotal_price',
                            'product_subtotal_price_after_tax',
                            'order',
                            'pr_products_data',
                            'gr_warehouse_data',
                        ]
                        filterFieldList(field_list, dataRow);
                        GRDataTableHandle.tableLineDetailPO.DataTable().rows().every(function () {
                            let row = this.node();
                            if (row.querySelector('.table-row-order')) {
                                if (row.querySelector('.table-row-order').getAttribute('data-product-id') === dataProductID) {
                                    let elePrice = row.querySelector('.table-row-price');
                                    if (elePrice) {
                                        dataRow['product_unit_price'] = $(elePrice).valCurrency();
                                    }
                                    let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                                    if (eleSubtotal) {
                                        dataRow['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                                    }
                                    let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                                    if (eleTaxAmount) {
                                        dataRow['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                                    }
                                    if (dataRow.hasOwnProperty('product_subtotal_price') && dataRow.hasOwnProperty('product_tax_amount')) {
                                        dataRow['product_subtotal_price_after_tax'] = dataRow['product_subtotal_price'] + dataRow['product_tax_amount'];
                                    }
                                }
                            }
                        });
                        if (dataRow['product_unit_price'] <= 0) {
                            delete dataRow['product_unit_price'];
                        }
                        // If PO have PR
                        let pr_product_submit_list = [];
                        for (let pr_product of dataRow?.['pr_products_data'] ? dataRow?.['pr_products_data'] : []) {
                            if (pr_product?.['quantity_import'] > 0) {
                                GRSubmitHandle.setupDataWHLotSerial(pr_product);
                                pr_product_submit_list.push(pr_product);
                                let field_list = [
                                    'purchase_order_request_product_id',
                                    'purchase_request_product_id',
                                    'purchase_request_data',
                                    'production_report_id',
                                    'production_report_data',
                                    'uom_id',
                                    'uom_data',
                                    'quantity_order',
                                    'quantity_import',
                                    'is_stock',
                                    'gr_warehouse_data',
                                ]
                                filterFieldList(field_list, pr_product);
                            }
                        }
                        dataRow['pr_products_data'] = pr_product_submit_list;
                        // If PO doesn't have PR
                        GRSubmitHandle.setupDataWHLotSerial(dataRow);
                    }
                    result.push(dataRow);
                }
            });
        }
        return result
    };

    static setupDataWHLotSerial(dataStore) {
        for (let warehouse of dataStore?.['gr_warehouse_data'] ? dataStore?.['gr_warehouse_data'] : []) {
            let field_list = [
                'warehouse_id',
                'warehouse_data',
                'quantity_import',
                'lot_data',
                'serial_data',
                'is_additional',
            ]
            filterFieldList(field_list, warehouse);
            for (let lot of warehouse?.['lot_data'] ? warehouse?.['lot_data'] : []) {
                let field_list = [
                    'lot_id',
                    'lot_number',
                    'quantity_import',
                    'expire_date',
                    'manufacture_date',
                ]
                filterFieldList(field_list, lot);
                if (lot?.['expire_date']) {
                    let date = moment(lot?.['expire_date'],
                        'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                    if (date !== "Invalid date") {
                        lot['expire_date'] = String(date);
                    }
                } else {
                    lot['expire_date'] = null;
                }
                if (lot?.['manufacture_date']) {
                    let date = moment(lot?.['manufacture_date'],
                        'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                    if (date !== "Invalid date") {
                        lot['manufacture_date'] = String(date);
                    }
                } else {
                    lot['manufacture_date'] = null;
                }
            }
            for (let serial of warehouse?.['serial_data'] ? warehouse?.['serial_data'] : []) {
                let field_list = [
                    'vendor_serial_number',
                    'serial_number',
                    'expire_date',
                    'manufacture_date',
                    'warranty_start',
                    'warranty_end',
                ]
                filterFieldList(field_list, serial);
                if (serial?.['expire_date']) {
                    let date = moment(serial?.['expire_date'],
                        'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                    if (date !== "Invalid date") {
                        serial['expire_date'] = String(date);
                    }
                } else {
                    serial['expire_date'] = null;
                }
                if (serial?.['manufacture_date']) {
                    let date = moment(serial?.['manufacture_date'],
                        'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                    if (date !== "Invalid date") {
                        serial['manufacture_date'] = String(date);
                    }
                } else {
                    serial['manufacture_date'] = null;
                }
                if (serial?.['warranty_start']) {
                    let date = moment(serial?.['warranty_start'],
                        'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                    if (date !== "Invalid date") {
                        serial['warranty_start'] = String(date);
                    }
                } else {
                    serial['warranty_start'] = null;
                }
                if (serial?.['warranty_end']) {
                    let date = moment(serial?.['warranty_end'],
                        'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                    if (date !== "Invalid date") {
                        serial['warranty_end'] = String(date);
                    }
                } else {
                    serial['warranty_end'] = null;
                }
            }
        }
    };

    static setupDataProduct() {
        return GRSubmitHandle.setupDataShowLineDetail(true);
    };

    static setupDataSubmit(_form) {
        let type = GRLoadDataHandle.typeSelectEle.val();
        if (type === '1') {
            if (GRLoadDataHandle.POSelectEle.val()) {
                _form.dataForm['purchase_order_id'] = GRLoadDataHandle.POSelectEle.val();
                let data = SelectDDControl.get_data_from_idx(GRLoadDataHandle.POSelectEle, GRLoadDataHandle.POSelectEle.val());
                if (data) {
                    _form.dataForm['purchase_order_data'] = data;
                }
            }
            if (GRLoadDataHandle.supplierSelectEle.val()) {
                _form.dataForm['supplier_id'] = GRLoadDataHandle.supplierSelectEle.val();
                let data = SelectDDControl.get_data_from_idx(GRLoadDataHandle.supplierSelectEle, GRLoadDataHandle.supplierSelectEle.val());
                if (data) {
                    _form.dataForm['supplier_data'] = data;
                }
            }
        }
        if (type === '2') {
            if (GRLoadDataHandle.IASelectEle.val()) {
                _form.dataForm['inventory_adjustment_id'] = GRLoadDataHandle.IASelectEle.val();
                let data = SelectDDControl.get_data_from_idx(GRLoadDataHandle.IASelectEle, GRLoadDataHandle.IASelectEle.val());
                if (data) {
                    _form.dataForm['inventory_adjustment_data'] = data;
                }
            }
        }
        if (type === '3') {
            if (GRLoadDataHandle.$boxTypeReport.val()) {
                _form.dataForm['production_report_type'] = parseInt(GRLoadDataHandle.$boxTypeReport.val());
                if (GRLoadDataHandle.$boxTypeReport.val() === '0') {
                    if (GRLoadDataHandle.$boxProductionOrder.val()) {
                        _form.dataForm['production_order_id'] = GRLoadDataHandle.$boxProductionOrder.val();
                        let data = SelectDDControl.get_data_from_idx(GRLoadDataHandle.$boxProductionOrder, GRLoadDataHandle.$boxProductionOrder.val());
                        if (data) {
                            _form.dataForm['production_order_data'] = data;
                        }
                    }
                }
                if (GRLoadDataHandle.$boxTypeReport.val() === '1') {
                    if (GRLoadDataHandle.$boxWorkOrder.val()) {
                        _form.dataForm['work_order_id'] = GRLoadDataHandle.$boxWorkOrder.val();
                        let data = SelectDDControl.get_data_from_idx(GRLoadDataHandle.$boxWorkOrder, GRLoadDataHandle.$boxWorkOrder.val());
                        if (data) {
                            _form.dataForm['work_order_data'] = data;
                        }
                    }
                }
                if (GRLoadDataHandle.$boxProductionReport.val() && GRLoadDataHandle.$boxProductionReport.val().length > 0) {
                    let dataList = [];
                    for (let idx of GRLoadDataHandle.$boxProductionReport.val()) {
                        let data = SelectDDControl.get_data_from_idx(GRLoadDataHandle.$boxProductionReport, idx);
                        if (data) {
                            dataList.push(data);
                        }
                    }
                    _form.dataForm['production_reports_data'] = dataList;
                }
            }
        }
        _form.dataForm['goods_receipt_type'] = (parseInt(type) - 1);
        if (GRLoadDataHandle.PRDataEle.val()) {
            _form.dataForm['purchase_requests'] = JSON.parse(GRLoadDataHandle.PRDataEle.val());
        }
        let dateVal = $('#good-receipt-date-received').val();
        if (dateVal) {
            _form.dataForm['date_received'] = moment(dateVal,
                'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss')
        }
        let products_data_setup = GRSubmitHandle.setupDataProduct();
        if (products_data_setup.length > 0) {
            _form.dataForm['gr_products_data'] = products_data_setup;
        }
        if (products_data_setup.length <= 0) {
            $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-required-product')}, 'failure');
            return false;
        }
        let tableWrapper = document.getElementById('datable-good-receipt-line-detail-po_wrapper');
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
        // is_no_warehouse
        _form.dataForm['is_no_warehouse'] = GRLoadDataHandle.$isNoWHEle[0].checked;
        // attachment
        if (_form.dataForm.hasOwnProperty('attachment')) {
          _form.dataForm['attachment'] = $x.cls.file.get_val(_form.dataForm?.['attachment'], []);
        }
        return _form.dataForm;
    };
}

// COMMON FUNCTION
function filterFieldList(field_list, data_json) {
    for (let key in data_json) {
        if (!field_list.includes(key)) delete data_json[key]
    }
    return data_json;
}

function reOrderRowTable($table) {
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

function deleteRowGR(currentRow, $table) {
    let rowIndex = $table.DataTable().row(currentRow).index();
    let row = $table.DataTable().row(rowIndex);
    row.remove().draw();
}
