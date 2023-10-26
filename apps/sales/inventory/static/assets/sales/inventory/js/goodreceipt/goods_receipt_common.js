// LoadData
class GRLoadDataHandle {
    static typeSelectEle = $('#box-good-receipt-type');
    static POSelectEle = $('#box-good-receipt-purchase-order');
    static supplierSelectEle = $('#box-good-receipt-supplier');
    static IASelectEle = $('#box-good-receipt-inventory-adjustment');
    static initPOProductEle = $('#data-init-purchase-order-products');
    static PRDataEle = $('#purchase_requests_data');
    // static submitDataPRWHEle = $('#data-submit-pr-warehouse');
    static finalRevenueBeforeTax = document.getElementById('good-receipt-final-revenue-before-tax');
    static transEle = $('#app-trans-factory');

    static loadMoreInformation(ele, is_span = false) {
        let optionSelected;
        if (is_span === false) {
            optionSelected = ele;
        } else {
            optionSelected = ele[0]
        }
        let eleInfo = ele[0].closest('.more-information-group').querySelector('.more-information');
        let dropdownContent = ele[0].closest('.more-information-group').querySelector('.dropdown-menu');
        dropdownContent.innerHTML = ``;
        eleInfo.setAttribute('disabled', true);
        let link = "";
        if (optionSelected) {
            let data = {};
            if (is_span === false) {
                data = SelectDDControl.get_data_from_idx(ele, ele.val());
            } else {
                let eleData = optionSelected.querySelector('.data-info');
                if (eleData) {
                    data = JSON.parse(eleData.value)
                }
            }
            if (Object.keys(data).length !== 0) {
                // remove attr disabled
                if (eleInfo) {
                    eleInfo.removeAttribute('disabled');
                }
                // end
                let info = ``;
                info += `<h6 class="dropdown-header header-wth-bg">${GRLoadDataHandle.transEle.attr('data-more-information')}</h6>`;
                for (let key in data) {
                    if (['id', 'title', 'name', 'fullname', 'full_name', 'code'].includes(key)) {
                        if (key === 'id') {
                            let linkDetail = ele.data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(data[key]);
                            }
                        } else {
                            info += `<div class="row mb-1"><h6><i>${key}</i></h6><p>${data[key]}</p></div>`;
                        }
                    }
                }
                info += `<div class="dropdown-divider"></div>
                    <div class="row float-right">
                        <a href="${link}" target="_blank" class="link-primary underline_hover">
                            <span><span>${GRLoadDataHandle.transEle.attr('data-view-detail-info')}</span><span class="icon ml-1"><span class="feather-icon"><i class="fas fa-arrow-circle-right"></i></span></span></span>
                        </a>
                    </div>`;
                dropdownContent.innerHTML = info;
            }
        }
    };

    static loadBoxType(dataType = null) {
        let ele = GRLoadDataHandle.typeSelectEle;
        if (!dataType) {
            dataType = [
                {
                    'id': 3,
                    'title': 'For product'
                },
                {
                    'id': 2,
                    'title': 'For inventory adjustment'
                },
                {
                    'id': 1,
                    'title': 'For purchase order'
                },
            ];
        }
        ele.initSelect2({
            data: dataType,
        });
    };

    static loadCustomAreaByType() {
        let formSubmit = $('#frm_good_receipt_create');
        // Custom Area
        for (let eleArea of formSubmit[0].querySelectorAll('.custom-area')) {
            eleArea.setAttribute('hidden', 'true');
        }
        let idAreaShow = 'custom-area-' + String(GRLoadDataHandle.typeSelectEle.val());
        document.getElementById(idAreaShow).removeAttribute('hidden');
        // Line detail
        for (let eleLineDetail of formSubmit[0].querySelectorAll('.custom-line-detail')) {
            eleLineDetail.setAttribute('hidden', 'true');
        }
        let idLineDetailShow = 'custom-line-detail-' + String(GRLoadDataHandle.typeSelectEle.val());
        document.getElementById(idLineDetailShow).removeAttribute('hidden');
    };

    static loadBoxPO(dataPO = {}) {
        let ele = GRLoadDataHandle.POSelectEle;
        ele.initSelect2({
            data: dataPO,
            'dataParams': {'is_all_receipted': false, 'system_status': 3},
            disabled: !(ele.attr('data-url')),
        });
        GRLoadDataHandle.loadMoreInformation(ele);
    };

    static loadBoxSupplier(dataCustomer = {}) {
        let ele = GRLoadDataHandle.supplierSelectEle;
        ele.initSelect2({
            data: dataCustomer,
            disabled: !(ele.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['name'] || '';
            },
        });
        GRLoadDataHandle.loadMoreInformation(ele);
    };

    static loadBoxIA(dataIA = {}) {
        let ele = GRLoadDataHandle.IASelectEle;
        ele.initSelect2({
            data: dataIA,
            'dataParams': {'goods_receipt_ia__isnull': true},
            disabled: !(ele.attr('data-url')),
        });
    };

    static loadBoxProduct(ele, dataProduct = {}) {
        ele.initSelect2({
            data: dataProduct,
            disabled: !(ele.attr('data-url')),
        });
    };

    static loadBoxUOM(ele, dataUOM = {}, uom_group_id = null) {
        ele.initSelect2({
            data: dataUOM,
            'dataParams': {'group': uom_group_id},
            disabled: !(ele.attr('data-url')),
        });
    };

    static loadBoxTax(ele, dataTax = {}) {
        ele.initSelect2({
            data: dataTax,
            disabled: !(ele.attr('data-url')),
        });
    };

    static loadBoxWH(ele, dataWH = {}) {
        ele.initSelect2({
            data: dataWH,
            disabled: !(ele.attr('data-url')),
        });
    };

    static loadChangePO($ele) {
        GRLoadDataHandle.loadMoreInformation($ele);
        GRDataTableHandle.tableLineDetailPO.DataTable().clear().draw();
        GRCalculateHandle.calculateTotal(GRDataTableHandle.tableLineDetailPO[0]);
        GRDataTableHandle.tablePOProduct.DataTable().clear().draw();

        if ($ele.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(GRLoadDataHandle.POSelectEle, $ele.val());
            // load supplier
            GRLoadDataHandle.supplierSelectEle.empty();
            GRLoadDataHandle.loadBoxSupplier(dataSelected?.['supplier']);
            // load PR
            GRLoadDataHandle.loadDataShowPR(dataSelected?.['purchase_requests_data']);
        }
    };

    static loadModalProduct(is_detail = false) {
        let frm = new SetupFormSubmit(GRDataTableHandle.tablePOProduct);
        if (GRDataTableHandle.tablePOProduct[0].querySelector('.dataTables_empty')) {
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
                        if (data.hasOwnProperty('purchase_order_product_list') && Array.isArray(data.purchase_order_product_list)) {
                            if (is_detail === true) {
                                let data_detail = JSON.parse($('#data-detail-page').val());
                                if (GRLoadDataHandle.POSelectEle.val()) {
                                    for (let data_product of data_detail?.['goods_receipt_product']) {
                                        for (let dataPOProduct of data.purchase_order_product_list) {
                                            if (dataPOProduct?.['id'] === data_product?.['purchase_order_product_id']) {
                                                dataPOProduct['quantity_import'] = data_product?.['quantity_import'];
                                                // If PO have PR
                                                for (let dataPRProduct of dataPOProduct?.['purchase_request_products_data']) {
                                                    dataPRProduct['id'] = dataPRProduct?.['purchase_request_product']?.['id'];
                                                    for (let dataPR of data_product?.['purchase_request_products_data']) {
                                                        if (dataPRProduct['id'] === dataPR?.['purchase_request_product']?.['id']) {
                                                            dataPRProduct['quantity_import'] = dataPR?.['quantity_import'];
                                                            for (let dataWarehouse of dataPR?.['warehouse_data']) {
                                                                dataWarehouse['purchase_request_product_id'] = dataPR?.['purchase_request_product']?.['id'];
                                                                GRLoadDataHandle.loadDetailWHLotSerial(dataWarehouse);
                                                            }
                                                            dataPRProduct['warehouse_data'] = dataPR?.['warehouse_data'];
                                                        }
                                                    }
                                                }
                                                // If PO doesn't have PR
                                                for (let dataWarehouse of data_product?.['warehouse_data']) {
                                                    dataWarehouse['purchase_order_product_id'] = data_product?.['purchase_order_product_id'];
                                                    GRLoadDataHandle.loadDetailWHLotSerial(dataWarehouse);
                                                }
                                                dataPOProduct['warehouse_data'] = data_product?.['warehouse_data'];
                                            }
                                        }
                                    }
                                }
                            }
                            GRLoadDataHandle.initPOProductEle.val(JSON.stringify(data.purchase_order_product_list));
                            GRDataTableHandle.tablePOProduct.DataTable().clear().draw();
                            GRDataTableHandle.tablePOProduct.DataTable().rows.add(data.purchase_order_product_list).draw();

                        }
                    }
                }
            )
        }
        return true;
    };

    static loadCheckPOProduct(ele) {
        let row = ele.closest('tr');
        let dataRow = JSON.parse($(ele).attr('data-row'));
        let is_checked = false;
        if (ele.checked === true) {
            is_checked = true;
        }
        for (let eleCheck of GRDataTableHandle.tablePOProduct[0].querySelectorAll('.table-row-checkbox')) {
            eleCheck.checked = false;
            let row = eleCheck.closest('tr');
            $(row).css('background-color', '#fff');
        }
        //
        GRStoreDataHandle.storeDataAll();
        GRDataTableHandle.tableLot.DataTable().clear().draw();
        GRDataTableHandle.tableSerial.DataTable().clear().draw();
        $('#scroll-table-lot-serial')[0].setAttribute('hidden', 'true');
        GRDataTableHandle.tableWH.DataTable().clear().draw();
        GRDataTableHandle.tablePR.DataTable().clear().draw();
        if (is_checked === true) {
            ele.checked = true;
            if (dataRow?.['purchase_request_products_data'].length > 0) { // If PO have PR
                GRDataTableHandle.tablePR.DataTable().rows.add(dataRow?.['purchase_request_products_data']).draw();
                $('#scroll-table-pr')[0].removeAttribute('hidden');
            } else { // If PO doesn't have PR
                GRLoadDataHandle.loadModalWareHouse(JSON.parse(ele.getAttribute('data-row')));
            }
            $(row).css('background-color', '#ebfcf5');
        } else {
            $(row).css('background-color', '#fff');
        }
    };

    static loadCheckPR(ele) {
        let row = ele.closest('tr');
        let is_checked = false;
        if (ele.checked === true) {
            is_checked = true;
        }
        for (let eleCheck of GRDataTableHandle.tablePR[0].querySelectorAll('.table-row-checkbox')) {
            eleCheck.checked = false;
            let row = eleCheck.closest('tr');
            $(row).css('background-color', '');
        }
        //
        GRStoreDataHandle.storeDataAll();
        GRDataTableHandle.tableLot.DataTable().clear().draw();
        GRDataTableHandle.tableSerial.DataTable().clear().draw();
        $('#scroll-table-lot-serial')[0].setAttribute('hidden', 'true');
        GRDataTableHandle.tableWH.DataTable().clear().draw();
        if (is_checked === true) {
            ele.checked = true;
            GRLoadDataHandle.loadModalWareHouse(JSON.parse(ele.getAttribute('data-row')), true);
            $(row).css('background-color', '#ebfcf5');
        } else {
            $(row).css('background-color', '');
        }
    };

    static loadCheckWH(ele) {
        let row = ele.closest('tr');
        let is_checked = false;
        if (ele.checked === true) {
            is_checked = true;
        }
        for (let eleCheck of GRDataTableHandle.tableWH[0].querySelectorAll('.table-row-checkbox')) {
            eleCheck.checked = false;
            let row = eleCheck.closest('tr');
            $(row).css('background-color', '');
        }
        GRStoreDataHandle.storeDataAll();
        GRDataTableHandle.tableLot.DataTable().clear().draw();
        GRDataTableHandle.tableSerial.DataTable().clear().draw();
        if (is_checked === true) {
            ele.checked = true;
            GRLoadDataHandle.loadNewRowsLotOrNewRowsSerial();
            $(row).css('background-color', '#ebfcf5');
        } else {
            $(row).css('background-color', '');
        }
    };

    static loadModalWareHouse(dataStore, is_has_pr = false) {
        let tableWareHouse = GRDataTableHandle.tableWH;
        let frm = new SetupFormSubmit(tableWareHouse);
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
                            if (is_has_pr === true) {
                                item['purchase_request_product_id'] = dataStore?.['id'];
                                if (dataStore?.['is_stock'] === false) {
                                    item['uom'] = dataStore?.['purchase_request_product']?.['uom'];
                                } else {
                                    item['uom'] = dataStore?.['uom_stock'];
                                }
                            } else {
                                item['purchase_order_product_id'] = dataStore?.['id'];
                                item['uom'] = dataStore?.['uom_order_actual'];
                            }
                            if (dataStore?.['warehouse_data']) {
                                for (let dataPRWH of dataStore?.['warehouse_data']) {
                                    if (dataPRWH?.['id'] === item?.['id']) {
                                        item['quantity_import'] = dataPRWH?.['quantity_import'] ? dataPRWH?.['quantity_import'] : 0;
                                        if (dataPRWH?.['lot_data']) {
                                            item['lot_data'] = dataPRWH?.['lot_data'];
                                        }
                                        if (dataPRWH?.['serial_data']) {
                                            item['serial_data'] = dataPRWH?.['serial_data'];
                                        }
                                    }
                                }
                            }
                        }
                        tableWareHouse.DataTable().clear().draw();
                        tableWareHouse.DataTable().rows.add(data.warehouse_list).draw();
                        GRLoadDataHandle.loadAreaLotOrAreaSerial();
                    }
                }
            }
        )
        return true;
    };

    static loadAreaLotOrAreaSerial() {
        let dataPOProductCheckedRaw = GRDataTableHandle.tablePOProduct[0].querySelector('.table-row-checkbox:checked')?.getAttribute('data-row');
        if (dataPOProductCheckedRaw) {
            let dataPOProductChecked = JSON.parse(dataPOProductCheckedRaw);
            if (dataPOProductChecked?.['product']?.['general_traceability_method'] === 1) {
                GRLoadDataHandle.loadAreaLotSerial(true, false);
            }
            if (dataPOProductChecked?.['product']?.['general_traceability_method'] === 2) {
                GRLoadDataHandle.loadAreaLotSerial(false, true);
            }
        }
    };

    static loadNewRowsLotOrNewRowsSerial() {
        let dataPOProductCheckedRaw = GRDataTableHandle.tablePOProduct[0].querySelector('.table-row-checkbox:checked')?.getAttribute('data-row');
        if (dataPOProductCheckedRaw) {
            let dataPOProductChecked = JSON.parse(dataPOProductCheckedRaw);
            if (dataPOProductChecked?.['product']?.['general_traceability_method'] === 1) {
                GRLoadDataHandle.loadNewRowsLot();
            }
            if (dataPOProductChecked?.['product']?.['general_traceability_method'] === 2) {
                GRLoadDataHandle.loadNewRowsSerial();
            }
        }
    };

    static loadAreaLotSerial(is_lot = false, is_serial = false) {
        for (let eleImport of GRDataTableHandle.tableWH[0].querySelectorAll('.table-row-import')) {
            eleImport.setAttribute('disabled', 'true');
        }
        // GRDataTableHandle.tablePR[0].querySelector('.table-row-checkbox:checked').closest('tr').querySelector('.table-row-import').innerHTML = '0';
        // GRDataTableHandle.tablePOProduct[0].querySelector('.table-row-checkbox:checked').closest('tr').querySelector('.table-row-import').innerHTML = '0';
        // $('#btn-lot-serial-area')[0].setAttribute('hidden', 'true');
        $('#scroll-table-lot-serial')[0].removeAttribute('hidden');
        GRDataTableHandle.tableLot.DataTable().clear().draw();
        GRDataTableHandle.tableSerial.DataTable().clear().draw();
        if (is_lot === true) {
            $('#table-good-receipt-manage-lot-area')[0].removeAttribute('hidden');
            $('#table-good-receipt-manage-serial-area')[0].setAttribute('hidden', 'true');
        } else if (is_serial === true) {
            $('#table-good-receipt-manage-serial-area')[0].removeAttribute('hidden');
            $('#table-good-receipt-manage-lot-area')[0].setAttribute('hidden', 'true');
        }
    };

    static loadNewRowsLot() {
        let eleWHDataRaw = GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')?.getAttribute('data-row');
        if (eleWHDataRaw) {
            let eleWHData = JSON.parse(eleWHDataRaw);
            if (eleWHData?.['lot_data']) {
                GRDataTableHandle.tableLot.DataTable().rows.add(eleWHData?.['lot_data']).draw();
            }
        }
    };

    static loadAddRowLot() {
        let eleWHDataRaw = GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')?.getAttribute('data-row');
        if (eleWHDataRaw) {
            let eleWHData = JSON.parse(eleWHDataRaw);
            let $table = GRDataTableHandle.tableLot;
            let data = {
                'warehouse_id': eleWHData?.['id'],
                'lot_number': '',
                'quantity_import': '',
                'expire_date': '',
                'manufacture_date': '',
                'uom': eleWHData?.['uom'],
            }
            let newRow = $table.DataTable().row.add(data).draw().node();
            GRLoadDataHandle.loadLotSerialDatePicker(newRow);
        }
    };

    static loadNewRowsSerial() {
        let eleWHDataRaw = GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')?.getAttribute('data-row');
        if (eleWHDataRaw) {
            let eleWHData = JSON.parse(eleWHDataRaw);
            if (eleWHData?.['serial_data']) {
                if (eleWHData?.['serial_data'].length > 0) {
                    GRDataTableHandle.tableSerial.DataTable().rows.add(eleWHData?.['serial_data']).draw();
                }
            }
        }
    };

    static loadAddRowSerial() {
        let eleWHDataRaw = GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')?.getAttribute('data-row');
        if (eleWHDataRaw) {
            let eleWHData = JSON.parse(eleWHDataRaw);
            let $table = GRDataTableHandle.tableSerial;
            let data = {
                'warehouse_id': eleWHData?.['id'],
                'vendor_serial_number': '',
                'serial_number': '',
                'expire_date': '',
                'manufacture_date': '',
                'warranty_start': '',
                'warranty_end': '',
                'uom': eleWHData?.['uom'],
            }
            let newRow = $table.DataTable().row.add(data).draw().node();
            GRLoadDataHandle.loadLotSerialDatePicker(newRow);
        }
    };

    static loadQuantityImport() {
        let valuePROrderRemain = parseFloat(GRDataTableHandle.tablePR[0]?.querySelector('.table-row-checkbox:checked')?.closest('tr')?.querySelector('.table-row-gr-remain').innerHTML);
        let valuePOOrderRemain = parseFloat(GRDataTableHandle.tablePOProduct[0]?.querySelector('.table-row-checkbox:checked')?.closest('tr')?.querySelector('.table-row-gr-remain').innerHTML);
        let dataRowPORaw = GRDataTableHandle.tablePOProduct[0]?.querySelector('.table-row-checkbox:checked')?.closest('tr')?.querySelector('.table-row-checkbox')?.getAttribute('data-row');
        if (!GRDataTableHandle.tableLot[0].querySelector('.dataTables_empty')) {
            let valueWHNew = 0;
            for (let eleImport of GRDataTableHandle.tableLot[0].querySelectorAll('.table-row-import')) {
                if (eleImport.value) {
                    valueWHNew += parseFloat(eleImport.value);
                }
            }
            GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked').closest('tr').querySelector('.table-row-import').value = String(valueWHNew);
        }
        if (!GRDataTableHandle.tableSerial[0].querySelector('.dataTables_empty')) {
            let valueWHNew = 0;
            for (let eleSerialNumber of GRDataTableHandle.tableSerial[0].querySelectorAll('.table-row-serial-number')) {
                if (eleSerialNumber.value !== '') {
                    valueWHNew++;
                }
            }
            GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked').closest('tr').querySelector('.table-row-import').value = String(valueWHNew);
        }
        let valuePRNew = 0;
        for (let eleImport of GRDataTableHandle.tableWH[0].querySelectorAll('.table-row-import')) {
            valuePRNew += parseFloat(eleImport.value);
        }
        if (valuePROrderRemain >= 0) {
            if (valuePRNew <= valuePROrderRemain) {
                GRDataTableHandle.tablePR[0].querySelector('.table-row-checkbox:checked').closest('tr').querySelector('.table-row-import').innerHTML = String(valuePRNew);
            } else {
                $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-validate-import')}, 'failure');
                return false
            }
        }
        let valuePONew = 0;
        if (valuePROrderRemain) {
            for (let eleImport of GRDataTableHandle.tablePR[0].querySelectorAll('.table-row-import')) {
                let prProductCurrentID = null;
                let prUOMCurrent = null;
                let ratioUOMFinal = 1;
                let dataRowPRRaw = eleImport?.closest('tr')?.querySelector('.table-row-checkbox')?.getAttribute('data-row');
                if (dataRowPRRaw) {
                    let dataRowPR = JSON.parse(dataRowPRRaw);
                    prProductCurrentID = dataRowPR?.['purchase_request_product']?.['id'];
                    prUOMCurrent = dataRowPR?.['purchase_request_product']?.['uom'];
                    if (dataRowPR?.['is_stock'] === true) {
                        prUOMCurrent = dataRowPR?.['uom_stock'];
                    }
                }
                if (dataRowPORaw) {
                    let dataRowPO = JSON.parse(dataRowPORaw);
                    let ratioUOMOrder = dataRowPO?.['uom_order_actual']?.['ratio'];
                    let ratioUOMRequest = dataRowPO?.['uom_order_request']?.['ratio'];
                    if (prUOMCurrent) {
                        ratioUOMRequest = prUOMCurrent?.['ratio'];
                    }
                    if (ratioUOMOrder && ratioUOMRequest) {
                        ratioUOMFinal = ratioUOMOrder / ratioUOMRequest
                    }
                }
                valuePONew += parseFloat(eleImport.innerHTML) / ratioUOMFinal;
            }
        } else {
            for (let eleImport of GRDataTableHandle.tableWH[0].querySelectorAll('.table-row-import')) {
                valuePONew += parseFloat(eleImport.value);
            }
        }
        if (valuePOOrderRemain >= 0) {
            if (valuePONew <= valuePOOrderRemain) {
                GRDataTableHandle.tablePOProduct[0].querySelector('.table-row-checkbox:checked').closest('tr').querySelector('.table-row-import').innerHTML = String(valuePONew);
            } else {
                $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-validate-import')}, 'failure');
                return false
            }
        }
        return true;
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
            eleAppend += `<div class="chip chip-outline-primary bg-green-light-5 mr-1 mb-1">
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

    static loadLotSerialDatePicker(newRow) {
        if (newRow.querySelector('.table-row-expire-date')) {
            $(newRow.querySelector('.table-row-expire-date')).daterangepicker({
                minYear: 1901,
                singleDatePicker: true,
                timePicker: true,
                showDropdowns: true,
                locale: {
                    format: 'DD/MM/YYYY'
                }
            });
            $(newRow.querySelector('.table-row-expire-date')).val(null).trigger('change');
        }
        if (newRow.querySelector('.table-row-manufacture-date')) {
            $(newRow.querySelector('.table-row-manufacture-date')).daterangepicker({
                minYear: 1901,
                singleDatePicker: true,
                timePicker: true,
                showDropdowns: true,
                locale: {
                    format: 'DD/MM/YYYY'
                }
            });
            $(newRow.querySelector('.table-row-manufacture-date')).val(null).trigger('change');
        }

        if (newRow.querySelector('.table-row-warranty-start')) {
            $(newRow.querySelector('.table-row-warranty-start')).daterangepicker({
                minYear: 1901,
                singleDatePicker: true,
                timePicker: true,
                showDropdowns: true,
                locale: {
                    format: 'DD/MM/YYYY'
                }
            });
            $(newRow.querySelector('.table-row-warranty-start')).val(null).trigger('change');
        }
        if (newRow.querySelector('.table-row-warranty-end')) {
            $(newRow.querySelector('.table-row-warranty-end')).daterangepicker({
                minYear: 1901,
                singleDatePicker: true,
                timePicker: true,
                showDropdowns: true,
                locale: {
                    format: 'DD/MM/YYYY'
                }
            });
            $(newRow.querySelector('.table-row-warranty-end')).val(null).trigger('change');
        }
    };

    static loadLineDetail() {
        let table = GRDataTableHandle.tableLineDetailPO;
        let data = GRSubmitHandle.setupDataShowLineDetail();
        table.DataTable().clear().draw();
        table.DataTable().rows.add(data).draw();
        GRLoadDataHandle.loadDataRowTable(table);
        // GRCalculateHandle.calculateTable(table);
    };

    static loadAddRowLineDetail() {
        let order = 1;
        let tableEmpty = GRDataTableHandle.tableLineDetailPO[0].querySelector('.dataTables_empty');
        let tableLen = GRDataTableHandle.tableLineDetailPO[0].tBodies[0].rows.length;
        if (tableLen !== 0 && !tableEmpty) {
            order = (tableLen + 1);
        }
        let data = {
            'product': {},
            'product_description': '',
            'uom': {},
            'quantity_import': '0',
            'product_unit_price': 0,
            'tax': {},
            'product_tax_amount': 0,
            'product_subtotal_price': 0,
            'order': order,
        }
        let newRow = GRDataTableHandle.tableLineDetailPO.DataTable().row.add(data).draw().node();
        GRLoadDataHandle.loadDataRow(newRow, GRDataTableHandle.tableLineDetailPO[0].id);
    };

    static loadDataRowTable($table) {
        if (!$table[0].querySelector('.dataTables_empty')) {
            for (let i = 0; i < $table[0].tBodies[0].rows.length; i++) {
                let row = $table[0].tBodies[0].rows[i];
                let table_id = $table[0].id;
                GRLoadDataHandle.loadDataRow(row, table_id);
            }
            GRCalculateHandle.calculateTable($table);
        }
    };

    static loadDataRow(row) {
        // mask money
        $.fn.initMaskMoney2();
        let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
        if (dataRowRaw) {
            let dataRow = JSON.parse(dataRowRaw);
            if (row.querySelector('.table-row-item')) {
                GRLoadDataHandle.loadBoxProduct($(row.querySelector('.table-row-item')), dataRow?.['product']);
            }
            if (row.querySelector('.table-row-uom')) {
                GRLoadDataHandle.loadBoxUOM($(row.querySelector('.table-row-uom')), dataRow?.['uom'], dataRow?.['uom']?.['uom_group']?.['id']);
            }
            if (row.querySelector('.table-row-tax')) {
                GRLoadDataHandle.loadBoxTax($(row.querySelector('.table-row-tax')), dataRow?.['tax']);
            }
            if (row.querySelector('.table-row-warehouse')) {
                GRLoadDataHandle.loadBoxWH($(row.querySelector('.table-row-warehouse')), dataRow?.['warehouse']);
            }
        }
    };


    // LOAD DETAIL
    static loadDetailPage(data) {
        let formSubmit = $('#frm_good_receipt_create');
        $('#good-receipt-title').val(data?.['title']);
        $('#good-receipt-note').val(data?.['remarks']);
        if (formSubmit.attr('data-method') === 'GET') {
            $('#good-receipt-date-received').val(moment(data?.['date_received']).format('MM/DD/YYYY'));
        }
        if (formSubmit.attr('data-method') === 'PUT') {
            $('#good-receipt-date-received').val(moment(data?.['date_received']).format('DD/MM/YYYY hh:mm A'));
        }
        if (['Added', 'Finish'].includes(data?.['system_status'])) {
            let $btn = $('#btn-enable-edit');
            if ($btn.length) {
                $btn[0].setAttribute('hidden', 'true');
            }
        }
        let type_data = {
            '1': 'For purchase order',
            '2': 'For inventory adjustment',
            '3': 'For production',
        }
        let idAreaShow = String(data?.['goods_receipt_type'] + 1);
        GRLoadDataHandle.loadBoxType({
            'id': idAreaShow,
            'title': type_data[idAreaShow],
        });
        GRLoadDataHandle.loadCustomAreaByType();
        if (idAreaShow === '1') {
            GRLoadDataHandle.loadBoxPO(data?.['purchase_order']);
            GRLoadDataHandle.loadBoxSupplier(data?.['supplier']);
            GRLoadDataHandle.loadDataShowPR(data?.['purchase_requests']);
            GRDataTableHandle.tableLineDetailPO.DataTable().rows.add(data?.['goods_receipt_product']).draw();
            GRLoadDataHandle.loadDataRowTable(GRDataTableHandle.tableLineDetailPO);
            if (formSubmit.attr('data-method') === 'GET') {
                GRLoadDataHandle.loadTableDisabled(GRDataTableHandle.tableLineDetailPO);
            }
            GRLoadDataHandle.loadModalProduct(true);
        }
        if (idAreaShow === '2') {
            GRLoadDataHandle.loadBoxIA(data?.['inventory_adjustment']);
            GRDataTableHandle.tableLineDetailIA.DataTable().rows.add(data?.['goods_receipt_product']).draw();
            GRLoadDataHandle.loadDataRowTable(GRDataTableHandle.tableLineDetailIA);
            if (formSubmit.attr('data-method') === 'GET') {
                GRLoadDataHandle.loadTableDisabled(GRDataTableHandle.tableLineDetailIA);
            }
        }
    };

    static loadDetailWHLotSerial(dataWarehouse) {
        dataWarehouse['id'] = dataWarehouse?.['warehouse']?.['id'];
        dataWarehouse['title'] = dataWarehouse?.['warehouse']?.['title'];
        dataWarehouse['code'] = dataWarehouse?.['warehouse']?.['code'];
        dataWarehouse['warehouse'] = dataWarehouse?.['warehouse']?.['id'];
        for (let dataLot of dataWarehouse?.['lot_data']) {
            dataLot['warehouse_id'] = dataWarehouse?.['warehouse']?.['id'];
            dataLot['expire_date'] = moment(dataLot?.['expire_date']).format('DD/MM/YYYY hh:mm A');
            dataLot['manufacture_date'] = moment(dataLot?.['manufacture_date']).format('DD/MM/YYYY hh:mm A');
        }
        for (let dataSerial of dataWarehouse?.['serial_data']) {
            dataSerial['warehouse_id'] = dataWarehouse?.['warehouse']?.['id'];
            dataSerial['expire_date'] = moment(dataSerial?.['expire_date']).format('DD/MM/YYYY hh:mm A');
            dataSerial['manufacture_date'] = moment(dataSerial?.['manufacture_date']).format('DD/MM/YYYY hh:mm A');
            dataSerial['warranty_start'] = moment(dataSerial?.['warranty_start']).format('DD/MM/YYYY hh:mm A');
            dataSerial['warranty_end'] = moment(dataSerial?.['warranty_end']).format('DD/MM/YYYY hh:mm A');
        }
    };

    static loadTableDisabled(table) {
        for (let ele of table[0].querySelectorAll('.table-row-item')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-description')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-uom')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-price')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-tax')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-import')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.del-row')) {
            ele.setAttribute('disabled', 'true');
        }
    };


}

// DataTable
class GRDataTableHandle {
    static productInitEle = $('#data-init-product');
    static uomInitEle = $('#data-init-uom');
    static taxInitEle = $('#data-init-tax');
    static warehouseInitEle = $('#data-init-warehouse');
    static tablePOProduct = $('#datable-good-receipt-po-product');
    static tablePR = $('#datable-good-receipt-purchase-request');
    static tableWH = $('#datable-good-receipt-warehouse');
    static tableLot = $('#datable-good-receipt-manage-lot');
    static tableSerial = $('#datable-good-receipt-manage-serial');
    static tableLineDetailPO = $('#datable-good-receipt-line-detail-po');
    static tableLineDetailIA = $('#datable-good-receipt-line-detail-ia');

    static dataTableGoodReceiptPOProduct(data) {
        GRDataTableHandle.tablePOProduct.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input table-row-checkbox" 
                                        data-id="${row.id}"
                                        data-row="${dataRow}"
                                    >
                                </div>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-item">${row?.['product']?.['title']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['uom_order_actual']?.['title']}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row?.['product_quantity_order_actual'] ? row?.['product_quantity_order_actual'] : 0}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-gr-completed">${row?.['gr_completed_quantity'] ? row?.['gr_completed_quantity'] : 0}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-gr-remain">${row?.['gr_remain_quantity'] ? row?.['gr_remain_quantity'] : 0}</span>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span class="table-row-import">${row?.['quantity_import'] ? row?.['quantity_import'] : 0}</span>`;
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    static dataTableGoodReceiptPR(data) {
        GRDataTableHandle.tablePR.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input table-row-checkbox" 
                                        data-id="${row.id}" 
                                        data-row="${dataRow}"
                                    >
                                </div>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-item">${row?.['purchase_request_product']?.['purchase_request']?.['code'] ? row?.['purchase_request_product']?.['purchase_request']?.['code'] : 'Stock'}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['purchase_request_product']?.['uom']?.['title'] ? row?.['purchase_request_product']?.['uom']?.['title'] : row?.['uom_stock']?.['title']}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row?.['quantity_order']}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-gr-completed">${row?.['gr_completed_quantity'] ? row?.['gr_completed_quantity'] : 0}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-gr-remain">${row?.['gr_remain_quantity'] ? row?.['gr_remain_quantity'] : 0}</span>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span class="table-row-import">${row?.['quantity_import'] ? row?.['quantity_import'] : 0}</span>`;
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    static dataTableGoodReceiptWH(data) {
        GRDataTableHandle.tableWH.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<div class="form-check">
                                    <input 
                                        type="checkbox" 
                                        class="form-check-input table-row-checkbox" 
                                        data-id="${row.id}" 
                                        data-row="${dataRow}"
                                    >
                                </div>`
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
                        return `<span class="table-row-item">${row?.['title'] ? row?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-note">${row?.['remark'] ? row?.['remark'] : ''}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-import validated-number" value="${row?.['quantity_import'] ? row?.['quantity_import'] : 0}">
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['uom']?.['title'] ? row?.['uom']?.['title'] : ''}</span>`;
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    static dataTableGoodReceiptWHLot(data) {
        GRDataTableHandle.tableLot.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-lot-number" data-row="${dataRow}" value="${row?.['lot_number'] ? row?.['lot_number'] : ''}">
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-import validated-number" value="${row?.['quantity_import'] ? row?.['quantity_import'] : ''}" required>
                                </div>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['uom']?.['title'] ? row?.['uom']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-expire-date" value="${row?.['expire_date']}">
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-manufacture-date" value="${row?.['manufacture_date']}">
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    static dataTableGoodReceiptWHSerial(data) {
        GRDataTableHandle.tableSerial.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-vendor-serial-number" data-row="${dataRow}" value="${row?.['vendor_serial_number'] ? row?.['vendor_serial_number'] : ''}">
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
                        return `<span class="table-row-uom">${row?.['uom']?.['title'] ? row?.['uom']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-expire-date" value="${row?.['expire_date']}">
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-manufacture-date" value="${row?.['manufacture_date']}">
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-warranty-start" value="${row?.['warranty_start']}">
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-warranty-end" value="${row?.['warranty_end']}">
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    static dataTableGoodReceiptLineDetailPO(data) {
        GRDataTableHandle.tableLineDetailPO.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" id="${row.id}" data-row="${dataRow}">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if (!GRLoadDataHandle.POSelectEle.val()) {
                            return `<div class="row more-information-group">
                                        <div class="input-group">
                                            <span class="input-affix-wrapper">
                                                <span class="input-prefix">
                                                    <div class="btn-group dropstart">
                                                        <i
                                                            class="fas fa-info-circle more-information"
                                                            data-bs-toggle="dropdown"
                                                            data-dropdown-animation
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                            disabled
                                                        >
                                                        </i>
                                                        <div class="dropdown-menu w-210p mt-4"></div>
                                                    </div>
                                                </span>
                                                <select
                                                    class="form-select table-row-item"
                                                    data-product-id="${row?.['product']?.['id']}"
                                                    data-url="${GRDataTableHandle.productInitEle.attr('data-url')}"
                                                    data-link-detail="${GRDataTableHandle.productInitEle.attr('data-link-detail')}"
                                                    data-method="${GRDataTableHandle.productInitEle.attr('data-method')}"
                                                    data-keyResp="product_sale_list"
                                                    required
                                                >
                                                </select>
                                            </span>
                                        </div>
                                    </div>`;
                        } else {
                            return `<div class="row more-information-group">
                                        <div class="input-group">
                                            <span class="input-affix-wrapper">
                                                <span class="input-prefix">
                                                    <div class="btn-group dropstart">
                                                        <i
                                                            class="fas fa-info-circle more-information"
                                                            data-bs-toggle="dropdown"
                                                            data-dropdown-animation
                                                            aria-haspopup="true"
                                                            aria-expanded="false"
                                                            disabled
                                                        >
                                                        </i>
                                                        <div class="dropdown-menu w-210p mt-4"></div>
                                                    </div>
                                                </span>
                                                <select
                                                    class="form-select table-row-item"
                                                    data-product-id="${row?.['product']?.['id']}"
                                                    data-url="${GRDataTableHandle.productInitEle.attr('data-url')}"
                                                    data-link-detail="${GRDataTableHandle.productInitEle.attr('data-link-detail')}"
                                                    data-method="${GRDataTableHandle.productInitEle.attr('data-method')}"
                                                    data-keyResp="product_sale_list"
                                                    required
                                                    disabled
                                                >
                                                </select>
                                            </span>
                                        </div>
                                    </div>`;
                        }

                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <p><span class="table-row-description">${row?.['product']?.['description'] ? row?.['product']?.['description'] : ''}</span></p>
                                </div>`;
                    }
                },
                {
                    targets: 3,
                    render: () => {
                        if (!GRLoadDataHandle.POSelectEle.val()) {
                            return `<div class="row">
                                        <select 
                                            class="form-control table-row-uom"
                                            data-url="${GRDataTableHandle.uomInitEle.attr('data-url')}"
                                            data-method="${GRDataTableHandle.uomInitEle.attr('data-method')}"
                                            data-keyResp="unit_of_measure"
                                            required
                                        >
                                        </select>
                                    </div>`;
                        } else {
                            return `<div class="row">
                                        <select 
                                            class="form-control table-row-uom"
                                            data-url="${GRDataTableHandle.uomInitEle.attr('data-url')}"
                                            data-method="${GRDataTableHandle.uomInitEle.attr('data-method')}"
                                            data-keyResp="unit_of_measure"
                                            required
                                            disabled
                                        >
                                        </select>
                                    </div>`;
                        }

                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        if (!GRLoadDataHandle.POSelectEle.val()) {
                            return `<div class="row">
                                        <input type="text" class="form-control table-row-import validated-number" value="${row.quantity_import}" required>
                                    </div>`;
                        } else {
                            return `<div class="row">
                                        <input type="text" class="form-control table-row-import validated-number" value="${row.quantity_import}" required disabled>
                                    </div>`;
                        }

                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <div class="dropdown">
                                        <div class="input-group dropdown-action input-group-price" aria-expanded="false" data-bs-toggle="dropdown">
                                        <span class="input-affix-wrapper">
                                            <input 
                                                type="text" 
                                                class="form-control mask-money table-row-price" 
                                                value="${row.product_unit_price}"
                                                data-return-type="number"
                                            >
                                            <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-angle-down"></i></span>
                                        </span>
                                        </div>
                                        <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                        <a class="dropdown-item" data-value=""></a>
                                        </div>
                                    </div>`;
                    }
                },
                {
                    targets: 6,
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
                                    value="${row.product_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.product_tax_amount}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 7,
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
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    static dataTableGoodReceiptLineDetailIA(data) {
        GRDataTableHandle.tableLineDetailIA.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" id="${row.id}" data-row="${dataRow}">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div class="row more-information-group">
                                    <div class="input-group">
                                        <span class="input-affix-wrapper">
                                            <span class="input-prefix">
                                                <div class="btn-group dropstart">
                                                    <i
                                                        class="fas fa-info-circle more-information"
                                                        data-bs-toggle="dropdown"
                                                        data-dropdown-animation
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                        disabled
                                                    >
                                                    </i>
                                                    <div class="dropdown-menu w-210p mt-4"></div>
                                                </div>
                                            </span>
                                            <select
                                                class="form-select table-row-item"
                                                data-product-id="${row?.['product']?.['id']}"
                                                data-url="${GRDataTableHandle.productInitEle.attr('data-url')}"
                                                data-link-detail="${GRDataTableHandle.productInitEle.attr('data-link-detail')}"
                                                data-method="${GRDataTableHandle.productInitEle.attr('data-method')}"
                                                data-keyResp="product_sale_list"
                                                required
                                                disabled
                                            >
                                            </select>
                                        </span>
                                    </div>
                                </div>`;
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <p><span class="table-row-description">${row?.['product']?.['description'] ? row?.['product']?.['description'] : ''}</span></p>
                                </div>`;
                    }
                },
                {
                    targets: 3,
                    render: () => {
                        return `<div class="row">
                                    <select 
                                        class="form-control table-row-uom"
                                        data-url="${GRDataTableHandle.uomInitEle.attr('data-url')}"
                                        data-method="${GRDataTableHandle.uomInitEle.attr('data-method')}"
                                        data-keyResp="unit_of_measure"
                                        disabled
                                    >
                                    </select>
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input type="text" class="form-control table-row-import validated-number" value="${row.quantity_import}" disabled>
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    render: () => {
                        return `<div class="row">
                                    <select 
                                        class="form-control table-row-warehouse"
                                        data-url="${GRDataTableHandle.warehouseInitEle.attr('data-url')}"
                                        data-method="${GRDataTableHandle.warehouseInitEle.attr('data-method')}"
                                        data-keyResp="warehouse_list"
                                        disabled
                                    >
                                    </select>
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <input 
                                        type="text" 
                                        class="form-control mask-money table-row-price" 
                                        value="${row?.['product_unit_price']}"
                                        data-return-type="number"
                                    >
                                    </div>`;
                    }
                },
                {
                    targets: 7,
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
            ],
        });
    };

}

// Calculate
class GRCalculateHandle {
    static calculateTotal(table) {
        let pretaxAmount = 0;
        let taxAmount = 0;
        let elePretaxAmount = document.getElementById('good-receipt-product-pretax-amount');
        let eleTaxes = document.getElementById('good-receipt-product-taxes');
        let eleTotal = document.getElementById('good-receipt-product-total');
        let elePretaxAmountRaw = document.getElementById('good-receipt-product-pretax-amount-raw');
        let eleTaxesRaw = document.getElementById('good-receipt-product-taxes-raw');
        let eleTotalRaw = document.getElementById('good-receipt-product-total-raw');
        let finalRevenueBeforeTax = document.getElementById('good-receipt-final-revenue-before-tax');
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
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            GRCalculateHandle.calculateMain(table, row)
        }
    };
}

// Store data
class GRStoreDataHandle {
    static storeDataPR() {
        let new_data = [];
        let table = GRDataTableHandle.tablePR;
        let tablePO = GRDataTableHandle.tablePOProduct;
        if (!table[0].querySelector('.dataTables_empty')) {
            let POProductID = null;
            for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
                let row = table[0].tBodies[0].rows[i];
                let quantityImport = parseFloat(row.querySelector('.table-row-import').innerHTML);
                let dataRowRaw = row.querySelector('.table-row-checkbox')?.getAttribute('data-row');
                if (dataRowRaw) {
                    // if (quantityImport > 0) {
                        let dataRow = JSON.parse(dataRowRaw);
                        dataRow['quantity_import'] = quantityImport;
                        POProductID = dataRow?.['purchase_order_product_id'];
                        dataRow['purchase_order_request_product'] = dataRow?.['id'];
                        new_data.push(dataRow);
                    // }
                }
            }
            if (POProductID) {
                let dataPOCheckedRaw = tablePO[0].querySelector(`.table-row-checkbox[data-id="${POProductID}"]`)?.getAttribute('data-row');
                if (dataPOCheckedRaw) {
                    let dataPOChecked = JSON.parse(dataPOCheckedRaw);
                    dataPOChecked['purchase_request_products_data'] = new_data;
                    tablePO[0].querySelector(`.table-row-checkbox[data-id="${POProductID}"]`).setAttribute('data-row', JSON.stringify(dataPOChecked));
                }
            }
        }
        return true
    };

    static storeDataWH() {
        let new_data = [];
        let table = GRDataTableHandle.tableWH;
        let tablePR = GRDataTableHandle.tablePR;
        let tablePO = GRDataTableHandle.tablePOProduct;
        if (!table[0].querySelector('.dataTables_empty')) {
            let PRProductID = null;
            let POProductID = null;
            for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
                let row = table[0].tBodies[0].rows[i];
                let quantityImport = parseFloat(row.querySelector('.table-row-import').value);
                let dataRowRaw = row.querySelector('.table-row-checkbox')?.getAttribute('data-row');
                if (dataRowRaw) {
                    if (quantityImport > 0) {
                        let dataRow = JSON.parse(dataRowRaw);
                        dataRow['warehouse'] = dataRow?.['id'];
                        dataRow['quantity_import'] = quantityImport;
                        PRProductID = dataRow?.['purchase_request_product_id'];
                        POProductID = dataRow?.['purchase_order_product_id'];
                        new_data.push(dataRow);
                    }
                }
            }
            if (PRProductID) {
                let dataPRCheckedRaw = tablePR[0].querySelector(`.table-row-checkbox[data-id="${PRProductID}"]`)?.getAttribute('data-row');
                if (dataPRCheckedRaw) {
                    let dataPRChecked = JSON.parse(dataPRCheckedRaw);
                    dataPRChecked['warehouse_data'] = new_data;
                    tablePR[0].querySelector(`.table-row-checkbox[data-id="${PRProductID}"]`).setAttribute('data-row', JSON.stringify(dataPRChecked));
                }
            }
            if (POProductID) {
                let dataPOCheckedRaw = tablePO[0].querySelector(`.table-row-checkbox[data-id="${POProductID}"]`)?.getAttribute('data-row');
                if (dataPOCheckedRaw) {
                    let dataPOChecked = JSON.parse(dataPOCheckedRaw);
                    dataPOChecked['warehouse_data'] = new_data;
                    tablePO[0].querySelector(`.table-row-checkbox[data-id="${POProductID}"]`).setAttribute('data-row', JSON.stringify(dataPOChecked));
                }
            }
        }
        return true
    };

    static storeDataLot() {
        let new_data = [];
        let table = GRDataTableHandle.tableLot;
        let tableWH = GRDataTableHandle.tableWH;
        if (!table[0].querySelector('.dataTables_empty')) {
            let WHID = null;
            for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
                let row = table[0].tBodies[0].rows[i];
                let lotNumber = row.querySelector('.table-row-lot-number').value;
                let quantityImport = parseFloat(row.querySelector('.table-row-import').value);
                let expireDate = row.querySelector('.table-row-expire-date').value;
                let manufactureDate = row.querySelector('.table-row-manufacture-date').value;
                let dataRowRaw = row.querySelector('.table-row-lot-number')?.getAttribute('data-row');
                if (dataRowRaw) {
                    if (lotNumber && quantityImport > 0) {
                        let dataRow = JSON.parse(dataRowRaw);
                        dataRow['lot_number'] = lotNumber;
                        dataRow['quantity_import'] = quantityImport;
                        dataRow['expire_date'] = expireDate;
                        dataRow['manufacture_date'] = manufactureDate;
                        WHID = dataRow?.['warehouse_id'];
                        new_data.push(dataRow);
                    }
                }
            }
            if (WHID) {
                let dataWHCheckedRaw = tableWH[0].querySelector(`.table-row-checkbox[data-id="${WHID}"]`)?.getAttribute('data-row');
                if (dataWHCheckedRaw) {
                    let dataWHChecked = JSON.parse(dataWHCheckedRaw);
                    dataWHChecked['lot_data'] = new_data;
                    tableWH[0].querySelector(`.table-row-checkbox[data-id="${WHID}"]`).setAttribute('data-row', JSON.stringify(dataWHChecked));
                }
            }
        }
        return true
    };

    static storeDataSerial() {
        let new_data = [];
        let table = GRDataTableHandle.tableSerial;
        let tableWH = GRDataTableHandle.tableWH;
        if (!table[0].querySelector('.dataTables_empty')) {
            let WHID = null;
            for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
                let row = table[0].tBodies[0].rows[i];
                let vendorSerialNumber = row.querySelector('.table-row-vendor-serial-number').value;
                let serialNumber = row.querySelector('.table-row-serial-number').value;
                let expireDate = row.querySelector('.table-row-expire-date').value;
                let manufactureDate = row.querySelector('.table-row-manufacture-date').value;
                let warrantyStart = row.querySelector('.table-row-warranty-start').value;
                let warrantyEnd = row.querySelector('.table-row-warranty-end').value;
                let dataRowRaw = row.querySelector('.table-row-vendor-serial-number')?.getAttribute('data-row');
                if (dataRowRaw) {
                    if (vendorSerialNumber && serialNumber) {
                        let dataRow = JSON.parse(dataRowRaw);
                        dataRow['vendor_serial_number'] = vendorSerialNumber;
                        dataRow['serial_number'] = serialNumber;
                        dataRow['expire_date'] = expireDate;
                        dataRow['manufacture_date'] = manufactureDate;
                        dataRow['warranty_start'] = warrantyStart;
                        dataRow['warranty_end'] = warrantyEnd;
                        WHID = dataRow?.['warehouse_id'];
                        new_data.push(dataRow);
                    }
                }
            }
            if (WHID) {
                let dataWHCheckedRaw = tableWH[0].querySelector(`.table-row-checkbox[data-id="${WHID}"]`)?.getAttribute('data-row');
                if (dataWHCheckedRaw) {
                    let dataWHChecked = JSON.parse(dataWHCheckedRaw);
                    dataWHChecked['serial_data'] = new_data;
                    tableWH[0].querySelector(`.table-row-checkbox[data-id="${WHID}"]`).setAttribute('data-row', JSON.stringify(dataWHChecked));
                }
            }
        }
        return true
    };

    static storeDataAll() {
        GRStoreDataHandle.storeDataSerial();
        GRStoreDataHandle.storeDataLot();
        GRStoreDataHandle.storeDataWH();
        GRStoreDataHandle.storeDataPR();
        return true;
    }
}

// Validate
class GRValidateHandle {

    static validateLotNumber(ele) {
        let lot_number = ele.value;
        let dataPOProductCheckedRaw = GRDataTableHandle.tablePOProduct[0].querySelector('.table-row-checkbox:checked')?.getAttribute('data-row');
        if (dataPOProductCheckedRaw) {
            let dataPOProductChecked = JSON.parse(dataPOProductCheckedRaw);
            $.fn.callAjax2({
                    'url': $('#url-factory').attr('data-product-warehouse-lot'),
                    'method': 'GET',
                    'data': {
                        'product_warehouse__product_id': dataPOProductChecked?.['product']?.['id'],
                        'lot_number': lot_number
                    },
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('warehouse_lot_list') && Array.isArray(data.warehouse_lot_list)) {
                            if (data.warehouse_lot_list.length > 0) {
                                ele.value = '';
                                let eleImport = ele?.closest('tr')?.querySelector('.table-row-import');
                                if (eleImport) {
                                    eleImport.value = '0';
                                }
                                GRLoadDataHandle.loadQuantityImport();
                                $.fn.notifyB({description: 'Lot number is exist'}, 'failure');
                                return false
                            }
                        }
                    }
                }
            )
        }
        return true
    };

    static validateSerialNumber(ele) {
        let serial_number = ele.value;
        let dataPOProductCheckedRaw = GRDataTableHandle.tablePOProduct[0].querySelector('.table-row-checkbox:checked')?.getAttribute('data-row');
        if (dataPOProductCheckedRaw) {
            let dataPOProductChecked = JSON.parse(dataPOProductCheckedRaw);
            $.fn.callAjax2({
                    'url': $('#url-factory').attr('data-product-warehouse-serial'),
                    'method': 'GET',
                    'data': {
                        'product_warehouse__product_id': dataPOProductChecked?.['product']?.['id'],
                        'serial_number': serial_number
                    },
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('warehouse_serial_list') && Array.isArray(data.warehouse_serial_list)) {
                            if (data.warehouse_serial_list.length > 0) {
                                ele.value = '';
                                // update quantity import by serial
                                GRLoadDataHandle.loadQuantityImport();
                                $.fn.notifyB({description: 'Serial number is exist'}, 'failure');
                                return false
                            } else {
                                // update quantity import by serial
                                let importResult = GRLoadDataHandle.loadQuantityImport();
                                if (importResult === false) {
                                    // Get the index of the current row within the DataTable
                                    let rowIndex = GRDataTableHandle.tableSerial.DataTable().row(ele.closest('tr')).index();
                                    let row = GRDataTableHandle.tableSerial.DataTable().row(rowIndex);
                                    // Delete current row
                                    row.remove().draw();
                                    GRLoadDataHandle.loadQuantityImport();
                                }
                            }
                        }
                    }
                }
            )
        }
        return true
    };

}

// Submit Form
class GRSubmitHandle {

    static setupDataShowLineDetail(is_submit = false) {
        let result = [];
        if (GRLoadDataHandle.POSelectEle.val()) {
            let table = GRDataTableHandle.tablePOProduct;
            if (!table[0].querySelector('.dataTables_empty')) {
                let order = 0;
                // Setup Merge Data by Product
                for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
                    let row = table[0].tBodies[0].rows[i];
                    let quantityImport = parseFloat(row.querySelector('.table-row-import').innerHTML);
                    if (quantityImport > 0) {
                        let dataRowRaw = row.querySelector('.table-row-checkbox')?.getAttribute('data-row');
                        if (dataRowRaw) {
                            order++;
                            let dataRow = JSON.parse(dataRowRaw);
                            dataRow['purchase_order_product'] = dataRow?.['id'];
                            dataRow['product_description'] = dataRow?.['product']?.['description'] ? dataRow?.['product']?.['description'] : '';
                            dataRow['uom'] = dataRow?.['uom_order_actual'];
                            dataRow['quantity_import'] = quantityImport;
                            dataRow['order'] = order;
                            let data_id = dataRow?.['id'];
                            if (is_submit === true) {
                                let field_list = [
                                    'purchase_order_product',
                                    'product',
                                    'uom',
                                    'tax',
                                    'warehouse',
                                    'quantity_import',
                                    'product_title',
                                    'product_code',
                                    'product_description',
                                    'product_unit_price',
                                    'product_subtotal_price',
                                    'product_subtotal_price_after_tax',
                                    'order',
                                    'purchase_request_products_data',
                                    'warehouse_data'
                                ]
                                filterFieldList(field_list, dataRow);
                                dataRow['product'] = dataRow?.['product']?.['id']
                                dataRow['uom'] = dataRow?.['uom']?.['id']
                                dataRow['tax'] = dataRow?.['tax']?.['id']
                                let tableLineDetailPO = GRDataTableHandle.tableLineDetailPO;
                                for (let i = 0; i < tableLineDetailPO[0].tBodies[0].rows.length; i++) {
                                    let row = tableLineDetailPO[0].tBodies[0].rows[i];
                                    if (row.querySelector('.table-row-order').id === data_id) {
                                        let elePrice = row.querySelector('.table-row-price');
                                        if (elePrice) {
                                            dataRow['product_unit_price'] = $(elePrice).valCurrency();
                                        }
                                        let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                                        if (eleSubtotal) {
                                            dataRow['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                                        }
                                        let eleTax = row.querySelector('.table-row-tax');
                                        if ($(eleTax).val()) {
                                            let dataInfo = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                                            if (dataInfo) {
                                                dataRow['tax'] = dataInfo.id;
                                                dataRow['product_tax_title'] = dataInfo.title;
                                                dataRow['product_tax_value'] = dataInfo.rate;
                                            } else {
                                                dataRow['product_tax_value'] = 0;
                                            }
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
                                if (dataRow['product_unit_price'] <= 0) {
                                    delete dataRow['product_unit_price'];
                                }
                                // If PO have PR
                                let pr_product_submit_list = [];
                                for (let pr_product of dataRow?.['purchase_request_products_data'] ? dataRow?.['purchase_request_products_data'] : []) {
                                    let field_list = [
                                        'purchase_order_request_product',
                                        'purchase_request_product',
                                        'quantity_import',
                                        'warehouse_data',
                                        'is_stock',
                                    ]
                                    filterFieldList(field_list, pr_product);
                                    if (pr_product?.['quantity_import'] > 0) {
                                        pr_product_submit_list.push(pr_product);
                                    }
                                }
                                dataRow['purchase_request_products_data'] = pr_product_submit_list;
                                for (let pr_product of dataRow?.['purchase_request_products_data'] ? dataRow?.['purchase_request_products_data'] : []) {
                                    pr_product['purchase_request_product'] = pr_product?.['purchase_request_product']?.['id'] ? pr_product?.['purchase_request_product']?.['id'] : null;
                                    GRSubmitHandle.setupDataWHLotSerial(pr_product);
                                }
                                // If PO doesn't have PR
                                GRSubmitHandle.setupDataWHLotSerial(dataRow);
                            }
                            result.push(dataRow);
                        }
                    }
                }
            }
        }
        return result
    };

    static setupDataWHLotSerial(dataStore) {
        for (let warehouse of dataStore?.['warehouse_data'] ? dataStore?.['warehouse_data'] : []) {
            let field_list = [
                'warehouse',
                'quantity_import',
                'lot_data',
                'serial_data',
            ]
            filterFieldList(field_list, warehouse);
            for (let lot of warehouse?.['lot_data'] ? warehouse?.['lot_data'] : []) {
                let field_list = [
                    'lot_number',
                    'quantity_import',
                    'expire_date',
                    'manufacture_date',
                ]
                filterFieldList(field_list, lot);
                if (lot?.['expire_date']) {
                  lot['expire_date'] = moment(lot?.['expire_date'],
                    'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                } else {
                    lot['expire_date'] = null;
                }
                if (lot?.['manufacture_date']) {
                    lot['manufacture_date'] = moment(lot?.['manufacture_date'],
                    'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
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
                    serial['expire_date'] = moment(serial?.['expire_date'],
                    'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                } else {
                    serial['expire_date'] = null;
                }
                if (serial?.['manufacture_date']) {
                    serial['manufacture_date'] = moment(serial?.['manufacture_date'],
                    'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                } else {
                    serial['manufacture_date'] = null;
                }
                if (serial?.['warranty_start']) {
                    serial['warranty_start'] = moment(serial?.['warranty_start'],
                    'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                } else {
                    serial['warranty_start'] = null;
                }
                if (serial?.['warranty_end']) {
                    serial['warranty_end'] = moment(serial?.['warranty_end'],
                    'DD/MM/YYYY hh:mm A').format('YYYY-MM-DD hh:mm:ss');
                } else {
                    serial['warranty_end'] = null;
                }
            }
        }
    };

    static setupDataProduct() {
        let result = [];
        let type = GRLoadDataHandle.typeSelectEle.val();
        if (type === '1') { // for PO
            if (GRLoadDataHandle.POSelectEle.val()) {
                return GRSubmitHandle.setupDataShowLineDetail(true);
            }
        }
        if (type === '2') { // for IA
            let table = GRDataTableHandle.tableLineDetailIA[0];
            if (table.querySelector('.dataTables_empty')) {
                return []
            }
            let tableBody = table.tBodies[0];
            for (let i = 0; i < tableBody.rows.length; i++) {
                let rowData = {};
                let row = tableBody.rows[i];
                let eleProduct = row.querySelector('.table-row-item');
                if (eleProduct) { // PRODUCT
                    let dataInfo = {}
                    if ($(eleProduct).val()) {
                        dataInfo = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                    }
                    if (dataInfo) {
                        rowData['product'] = dataInfo.id;
                        rowData['product_title'] = dataInfo.title;
                        rowData['product_code'] = dataInfo.code;
                    }
                    let eleDescription = row.querySelector('.table-row-description');
                    if (eleDescription) {
                        rowData['product_description'] = eleDescription.innerHTML;
                    }
                    let eleUOM = row.querySelector('.table-row-uom');
                    if ($(eleUOM).val()) {
                        let dataInfo = SelectDDControl.get_data_from_idx($(eleUOM), $(eleUOM).val());
                        if (dataInfo) {
                            rowData['uom'] = dataInfo.id;
                        }
                    }
                    let eleQuantityImport = row.querySelector('.table-row-import');
                    if (eleQuantityImport) {
                        rowData['quantity_import'] = parseFloat(eleQuantityImport.value);
                    }
                    let elePrice = row.querySelector('.table-row-price');
                    if (elePrice) {
                        if ($(elePrice).valCurrency() > 0) {
                            rowData['product_unit_price'] = $(elePrice).valCurrency();
                        }
                    }
                    let eleTax = row.querySelector('.table-row-tax');
                    if ($(eleTax).val()) {
                        let dataInfo = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                        if (dataInfo) {
                            rowData['tax'] = dataInfo.id;
                            rowData['product_tax_title'] = dataInfo.title;
                            rowData['product_tax_value'] = dataInfo.rate;
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                    let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                    if (eleTaxAmount) {
                        rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                    }
                    let eleWH = row.querySelector('.table-row-warehouse');
                    if ($(eleWH).val()) {
                        let dataInfo = SelectDDControl.get_data_from_idx($(eleWH), $(eleWH).val());
                        if (dataInfo) {
                            rowData['warehouse'] = dataInfo.id;
                        }
                    }
                    let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                    if (eleSubtotal) {
                        rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                    }
                    if (rowData.hasOwnProperty('product_subtotal_price') && rowData.hasOwnProperty('product_tax_amount')) {
                        rowData['product_subtotal_price_after_tax'] = rowData['product_subtotal_price'] + rowData['product_tax_amount']
                    }
                    let eleOrder = row.querySelector('.table-row-order');
                    if (eleOrder) {
                        rowData['order'] = parseInt(eleOrder.innerHTML);
                    }
                }
                result.push(rowData);
            }
        }
        return result
    };

    static setupDataSubmit(_form) {
        let type = GRLoadDataHandle.typeSelectEle.val();
        if (type === '1') {
            _form.dataForm['inventory_adjustment'] = null;
        }
        if (type === '2') {
            _form.dataForm['purchase_order'] = null;
            _form.dataForm['supplier'] = null;
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
            _form.dataForm['goods_receipt_product'] = products_data_setup;
        }
        _form.dataForm['total_product_pretax_amount'] = parseFloat($('#good-receipt-product-pretax-amount-raw').val());
        _form.dataForm['total_product_tax'] = parseFloat($('#good-receipt-product-taxes-raw').val());
        _form.dataForm['total_product'] = parseFloat($('#good-receipt-product-total-raw').val());
        _form.dataForm['total_product_revenue_before_tax'] = parseFloat(GRLoadDataHandle.finalRevenueBeforeTax.value);
        // system fields
        if (_form.dataMethod === "POST") {
            _form.dataForm['system_status'] = 1;
        }
    };
}

// COMMON FUNCTION
function filterFieldList(field_list, data_json) {
    for (let key in data_json) {
        if (!field_list.includes(key)) delete data_json[key]
    }
    return data_json;
}

function deleteRowTable(currentRow, $table) {
    // Get the index of the current row within the DataTable
    let rowIndex = $table.DataTable().row(currentRow).index();
    let row = $table.DataTable().row(rowIndex);
    // Delete current row
    row.remove().draw();
    // Re order
    reOrderRowTable($table);
    // Re calculate
    GRCalculateHandle.calculateTable($table);
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
