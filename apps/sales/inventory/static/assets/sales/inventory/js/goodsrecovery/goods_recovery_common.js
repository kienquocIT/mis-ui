// LoadData
class RecoveryLoadDataHandle {
    static $form = $('#frm_goods_recovery');
    static $boxStatus = $('#status');
    static $boxCustomer = $('#customer_id');
    static $boxLeaseOrder = $('#lease_order_id');

    static transEle = $('#app-trans-factory');
    static dataStatus = [
        {'id': 0, 'title': RecoveryLoadDataHandle.transEle.attr('data-status-1')},
        {'id': 1, 'title': RecoveryLoadDataHandle.transEle.attr('data-status-2')},
        {'id': 2, 'title': RecoveryLoadDataHandle.transEle.attr('data-status-3')},
    ];
    static dataAssetType = {
        1: RecoveryLoadDataHandle.transEle.attr('data-asset-type-1'),
        2: RecoveryLoadDataHandle.transEle.attr('data-asset-type-2'),
        3: RecoveryLoadDataHandle.transEle.attr('data-asset-type-3'),
    }


    static typeSelectEle = $('#box-good-receipt-type');
    static POSelectEle = $('#box-good-receipt-purchase-order');
    static supplierSelectEle = $('#box-good-receipt-supplier');
    static IASelectEle = $('#box-good-receipt-inventory-adjustment');
    static $boxTypeReport = $('#box-report-type');
    static $boxProductionOrder = $('#box-production-order');
    static $boxWorkOrder = $('#box-work-order');
    static $boxProductionReport = $('#box-production-report');
    static initPOProductEle = $('#data-init-purchase-order-products');
    static PRDataEle = $('#purchase_requests_data');
    static btnAddLot = $('#btn-add-manage-lot');
    static btnAddSerial = $('#btn-add-manage-serial');

    static urlEle = $('#url-factory');
    static dataTypeGr = [
        {
            'id': 3,
            'title': RecoveryLoadDataHandle.transEle.attr('data-for-production')
        },
        {
            'id': 2,
            'title': RecoveryLoadDataHandle.transEle.attr('data-for-ia')
        },
        {
            'id': 1,
            'title': RecoveryLoadDataHandle.transEle.attr('data-for-po')
        },
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

    static loadInit() {
        RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxStatus, RecoveryLoadDataHandle.dataStatus);
        RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxCustomer);
        RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxLeaseOrder);
        // dtb
        RecoveryDataTableHandle.dataTableProduct();
        RecoveryDataTableHandle.dataTableDelivery();
        RecoveryDataTableHandle.dataTableDeliveryProduct();
        RecoveryDataTableHandle.dataTableWareHouse();
        return true;
    };

    static loadChangePO($ele) {
        // GRLoadDataHandle.loadMoreInformation($ele);
        RecoveryDataTableHandle.$tableProduct.DataTable().clear().draw();
        RecoveryCalculateHandle.calculateTotal(RecoveryDataTableHandle.$tableProduct[0]);
        RecoveryDataTableHandle.tablePOProduct.DataTable().clear().draw();

        if ($ele.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.POSelectEle, $ele.val());
            // load supplier
            RecoveryLoadDataHandle.supplierSelectEle.empty();
            RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.supplierSelectEle, [dataSelected?.['supplier']]);
            // load PR
            RecoveryLoadDataHandle.loadDataShowPR(dataSelected?.['purchase_requests_data']);
        }
    };

    static loadCallAjaxProduct() {
        let frm = new SetupFormSubmit(RecoveryDataTableHandle.tablePOProduct);
        if (RecoveryLoadDataHandle.POSelectEle.val()) {
            if (RecoveryDataTableHandle.tablePOProduct[0].querySelector('.dataTables_empty')) {
                $.fn.callAjax2({
                        'url': frm.dataUrl,
                        'method': frm.dataMethod,
                        'data': {'purchase_order_id': RecoveryLoadDataHandle.POSelectEle.val()},
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('purchase_order_product_gr') && Array.isArray(data.purchase_order_product_gr)) {
                                let dataValid = [];
                                for (let dataPOPro of data.purchase_order_product_gr) {
                                    if (dataPOPro?.['product_data'].hasOwnProperty('product_choice') && Array.isArray(dataPOPro?.['product_data']?.['product_choice'])) {
                                        if (dataPOPro?.['product_data']?.['product_choice'].includes(1)) {  // has choice allow inventory
                                            dataValid.push(dataPOPro);
                                        }
                                    }
                                }
                                RecoveryLoadDataHandle.initPOProductEle.val(JSON.stringify(dataValid));
                                RecoveryDataTableHandle.tablePOProduct.DataTable().clear().draw();
                                RecoveryDataTableHandle.tablePOProduct.DataTable().rows.add(dataValid).draw();
                            }
                        }
                    }
                )
            }
        }
        return true;
    };

    static loadSetupProduction() {
        let dataProduct = {};
        let dataPRProducts = [];
        let quantityCompleted = 0;
        let quantityRemain = 0;
        for (let idx of RecoveryLoadDataHandle.$boxProductionReport.val()) {
            let data = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.$boxProductionReport, idx);
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
        let tablePO = RecoveryDataTableHandle.tablePOProduct;
        let rowChecked = ele.closest('tr');
        // store new row data & redraw row
        let rowIndex = tablePO.DataTable().row(rowChecked).index();
        let $row = tablePO.DataTable().row(rowIndex);
        let dataRow = $row.data();
        RecoveryDataTableHandle.tableLot.DataTable().clear().draw();
        RecoveryDataTableHandle.tableSerial.DataTable().clear().draw();
        $('#scroll-table-lot-serial')[0].setAttribute('hidden', 'true');
        RecoveryDataTableHandle.tableWH.DataTable().clear().draw();
        RecoveryDataTableHandle.tablePR.DataTable().clear().draw();
        if (dataRow?.['pr_products_data'].length > 0) { // If PO have PR
            RecoveryDataTableHandle.tablePR.DataTable().rows.add(dataRow?.['pr_products_data']).draw();
            $('#scroll-table-pr')[0].removeAttribute('hidden');
        } else { // If PO doesn't have PR
            // Check if product have inventory choice
            if (dataRow?.['product_data']?.['product_choice'].includes(1)) {
                RecoveryLoadDataHandle.loadCallAjaxWareHouse();
            }
        }
        return true;
    };

    static loadCallAjaxWareHouse() {
        let typeGR = RecoveryLoadDataHandle.typeSelectEle.val();
        let tablePO = RecoveryDataTableHandle.tablePOProduct;
        let elePOChecked = tablePO[0]?.querySelector('.table-row-checkbox:checked');
        if (elePOChecked) {
            let row = elePOChecked.closest('tr');
            let rowIndex = tablePO.DataTable().row(row).index();
            let $row = tablePO.DataTable().row(rowIndex);
            let dataStore = $row.data();

            let tablePR = RecoveryDataTableHandle.tablePR;
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
                let tableWH = RecoveryDataTableHandle.tableWH;
                let frm = new SetupFormSubmit(tableWH);
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
                                RecoveryLoadDataHandle.loadAreaLotOrAreaSerial();
                            }
                        }
                    }
                )
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
        RecoveryLoadDataHandle.PRDataEle.val(JSON.stringify(purchase_requests_data));
        return true;
    };

    static loadLineDetail() {
        let data = GRSubmitHandle.setupDataShowLineDetail();
        RecoveryDataTableHandle.$tableProduct.DataTable().clear().draw();
        RecoveryDataTableHandle.$tableProduct.DataTable().rows.add(data).draw();
        RecoveryLoadDataHandle.loadDataRowTable(RecoveryDataTableHandle.$tableProduct);
        return true;
    };


    static loadDataRowTable($table) {
        $table.DataTable().rows().every(function () {
            let row = this.node();
            RecoveryLoadDataHandle.loadDataRow(row, $table);
        });
        RecoveryCalculateHandle.calculateTable($table);
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
                RecoveryLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [dataStore?.['product_data']]);
                if (RecoveryLoadDataHandle.typeSelectEle.val() === '3') {
                    if (row.querySelector('.table-row-price')) {
                        // call ajax check BOM
                        $.fn.callAjax2({
                                'url': RecoveryLoadDataHandle.urlEle.attr('data-md-bom'),
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
                                                RecoveryCalculateHandle.calculateMain(RecoveryDataTableHandle.$tableProduct, row);
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
            RecoveryLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')), [dataStore?.['uom_data']], {'group': dataStore?.['uom_data']?.['uom_group']?.['id']});
        }
        if (row.querySelector('.table-row-tax')) {
            RecoveryLoadDataHandle.loadInitS2($(row.querySelector('.table-row-tax')), [dataStore?.['tax_data']]);
        }
        if (row.querySelector('.table-row-warehouse')) {
            RecoveryLoadDataHandle.loadInitS2($(row.querySelector('.table-row-warehouse')), [dataStore?.['warehouse_data']]);
        }
        return true;
    };

    static loadClearModal() {
        RecoveryDataTableHandle.tablePOProduct.DataTable().clear().draw();
        RecoveryDataTableHandle.tablePR.DataTable().clear().draw();
        $('#scroll-table-pr')[0].setAttribute('hidden', 'true');
        RecoveryDataTableHandle.tableWH.DataTable().clear().draw();
        $('#scroll-table-lot-serial')[0].setAttribute('hidden', 'true');
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
            let inputEle = trEle[0].querySelector('.table-row-quantity-recovery');
            if (inputEle) {
                if ($(inputEle).val()) {
                    for (let i = 1; i <= parseInt($(inputEle).val()); i++) {
                        let code = 'LEASE-' + String(i);
                        dataDtb.push({'lease_code': code})
                    }
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
                        $(tblChild).DataTable().clear().draw();
                        $(tblChild).DataTable().rows.add(dataDtb).draw();
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
            '1': RecoveryLoadDataHandle.transEle.attr('data-for-po'),
            '2': RecoveryLoadDataHandle.transEle.attr('data-for-ia'),
            '3': RecoveryLoadDataHandle.transEle.attr('data-for-production'),
        }
        let idAreaShow = String(data?.['goods_receipt_type'] + 1);
        RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.typeSelectEle, RecoveryLoadDataHandle.dataTypeGr);
        RecoveryLoadDataHandle.typeSelectEle.val(idAreaShow);
        let boxRender = $('#good-receipt-type-area')[0]?.querySelector('.select2-selection__rendered');
        if (boxRender) {
            boxRender.innerHTML = type_data[idAreaShow];
            boxRender.setAttribute('title', type_data[idAreaShow]);
        }
        RecoveryLoadDataHandle.loadCustomAreaByType();
        if (idAreaShow === '1') {  // GR for PO
            RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.POSelectEle, [data?.['purchase_order_data']], {'receipt_status__in': [0, 1, 2].join(','), 'system_status': 3});
            RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.supplierSelectEle, [data?.['supplier_data']]);
            RecoveryLoadDataHandle.loadDataShowPR(data?.['purchase_requests']);
        }
        if (idAreaShow === '2') {  // GR for IA
            RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.IASelectEle, [data?.['inventory_adjustment_data']], {'state': 2});
        }
        if (idAreaShow === '3') {  // GR for Production
            if (data?.['production_report_type'] === 0) {
                RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxProductionOrder, [data?.['production_order_data']], {'system_status': 3});
            }
            if (data?.['production_report_type'] === 1) {
                RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxWorkOrder, [data?.['work_order_data']], {'system_status': 3});
            }
            RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxProductionReport, data?.['production_reports_data']);
        }
        RecoveryDataTableHandle.$tableProduct.DataTable().rows.add(data?.['gr_products_data']).draw();
        RecoveryLoadDataHandle.loadDataRowTable(RecoveryDataTableHandle.$tableProduct);
        if (RecoveryLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            RecoveryLoadDataHandle.loadTableDisabled(RecoveryDataTableHandle.$tableProduct);
        }
        RecoveryLoadDataHandle.loadDetailProducts(data);
        return true;
    };

    static loadDetailProducts(dataDetail) {
        let dataProducts = dataDetail?.['gr_products_data'];
        let typeGR = RecoveryLoadDataHandle.typeSelectEle.val();
        let frm = new SetupFormSubmit(RecoveryDataTableHandle.tablePOProduct);
        if (typeGR === '1' && RecoveryLoadDataHandle.POSelectEle.val()) {
            $.fn.callAjax2({
                    'url': frm.dataUrl,
                    'method': frm.dataMethod,
                    'data': {'purchase_order_id': RecoveryLoadDataHandle.POSelectEle.val()},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('purchase_order_product_gr') && Array.isArray(data.purchase_order_product_gr)) {
                            RecoveryLoadDataHandle.loadTotal(dataDetail);
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
                            RecoveryDataTableHandle.tablePOProduct.DataTable().clear().draw();
                            RecoveryDataTableHandle.tablePOProduct.DataTable().rows.add(dataProducts).draw();
                        }
                    }
                }
            )
        }
        if (typeGR === '2' && RecoveryLoadDataHandle.IASelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.IASelectEle, $(this).val());
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
            RecoveryDataTableHandle.tablePOProduct.DataTable().clear().draw();
            RecoveryDataTableHandle.tablePOProduct.DataTable().rows.add(dataProducts).draw();
        }
        if (typeGR === '3' && (RecoveryLoadDataHandle.$boxProductionOrder.val() || RecoveryLoadDataHandle.$boxWorkOrder.val())) {
            let idList = [];
            if (dataProducts.length > 0) {
                for (let report of dataProducts[0]?.['pr_products_data']) {
                    idList.push(report?.['production_report_id']);
                }
            }

            $.fn.callAjax2({
                    'url': RecoveryLoadDataHandle.$boxProductionReport.attr('data-url'),
                    'method': 'GET',
                    'data': {'id__in': idList.join(',')},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('production_report_gr') && Array.isArray(data.production_report_gr)) {
                            RecoveryLoadDataHandle.loadTotal(dataDetail);
                            RecoveryLoadDataHandle.loadInitS2(RecoveryLoadDataHandle.$boxProductionReport, data.production_report_gr, {'production_order_id': RecoveryLoadDataHandle.$boxProductionOrder.val()});
                            if (RecoveryLoadDataHandle.$boxProductionReport.val().length > 0) {
                                let dataProductionPro = RecoveryLoadDataHandle.loadSetupProduction();
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
                                RecoveryDataTableHandle.tablePOProduct.DataTable().clear().draw();
                                RecoveryDataTableHandle.tablePOProduct.DataTable().rows.add(dataProducts).draw();
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
    static productInitEle = $('#data-init-product');
    static uomInitEle = $('#data-init-uom');
    static taxInitEle = $('#data-init-tax');

    static tablePOProduct = $('#datable-good-receipt-po-product');
    static tablePR = $('#datable-good-receipt-purchase-request');
    static tableWH = $('#datable-good-receipt-warehouse');
    static tableLot = $('#datable-good-receipt-manage-lot');
    static tableSerial = $('#datable-good-receipt-manage-serial');

    static $tableProduct = $('#datable-product');
    static $tableDelivery = $('#datable-delivery');
    static $tableDeliveryProduct = $('#datable-deli-product');
    static $tableWarehouse = $('#datable-warehouse');

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
                                            data-url="${RecoveryDataTableHandle.productInitEle.attr('data-url')}"
                                            data-link-detail="${RecoveryDataTableHandle.productInitEle.attr('data-link-detail')}"
                                            data-method="${RecoveryDataTableHandle.productInitEle.attr('data-method')}"
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
                                    data-url="${RecoveryDataTableHandle.uomInitEle.attr('data-url')}"
                                    data-method="${RecoveryDataTableHandle.uomInitEle.attr('data-method')}"
                                    data-keyResp="unit_of_measure"
                                    required
                                    disabled
                                >
                                </select>`;
                    }
                },
                {
                    targets: 4,
                    width: '9.11458333333%',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-import validated-number" value="${row.quantity_import}" required disabled>`;
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
                                    data-url="${RecoveryDataTableHandle.taxInitEle.attr('data-url')}"
                                    data-method="${RecoveryDataTableHandle.taxInitEle.attr('data-method')}"
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
            drawCallback: function () {
                RecoveryDataTableHandle.dtbProductHDCustom();
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
                                        id="delivery-${row?.['id'].replace(/-/g, "")}"
                                        data-id="${row?.['id']}"
                                    >
                                    <label class="form-check-label table-row-item" for="delivery-${row?.['id'].replace(/-/g, "")}">${row?.['code']}</label>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let date = '';
                        if (row?.['date_created']) {
                            date = moment(row?.['date_created']).format('DD/MM/YYYY');
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

    static dataTableWareHouse() {
        RecoveryDataTableHandle.$tableWarehouse.DataTableDefault({
            ajax: {
                url: RecoveryLoadDataHandle.urlEle.attr('data-warehouse'),
                type: "GET",
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('warehouse_list')) return data['warehouse_list'];
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
                        return `<button class="btn-collapse-app-wf btn btn-icon btn-rounded mr-1"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${row?.['title']}</b>`;
                    }
                },
                {
                    targets: 0,
                    width: "20%",
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    targets: 0,
                    width: "20%",
                    render: (data, type, row) => {
                        return ``;
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
                    title: 'Lease number',
                    width: '25%',
                    render: (data, type, row) => {
                        return `${row?.['lease_code']}`;
                    }
                },
                {
                    title: 'Serial',
                    width: '25%',
                    render: (data, type, row) => {
                        return `<select class="form-select table-row-serial" data-keyText="serial_number" hidden></select>`;
                    }
                },
                {
                    title: 'Note',
                    width: '40%',
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
            drawCallback: function () {
                // add css to Dtb
                RecoveryLoadDataHandle.loadCssToDtb(idTbl);
                // load init data for row
                $('#' + idTbl).DataTable().rows().every(function () {
                    let row = this.node();
                    if (row) {
                        let serialEle = row.querySelector('.table-row-serial');
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
                                        RecoveryLoadDataHandle.loadInitS2($(serialEle), serialData, {}, null, false, {'res2': 'serial_number'});
                                        if (serialData.length === 0) {
                                            serialEle.removeAttribute('hidden');
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
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
                let $group = $(`<button type="button" class="btn btn-outline-secondary" id="btn-edit-product-good-receipt" data-bs-toggle="modal" data-bs-target="#productModalCenter">
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
    static storeDataProduct() {
        let serial_data = [];
        let lot_data = [];
        let gr_warehouse_data = [];
        let pr_products_data = [];
        let tableWH = RecoveryDataTableHandle.tableWH;
        let tablePR = RecoveryDataTableHandle.tablePR;
        let tablePO = RecoveryDataTableHandle.tablePOProduct;

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
            if (row.querySelector('.table-row-import') && row.querySelector('.table-row-checkbox-additional')) {
                rowData['quantity_import'] = parseFloat(row.querySelector('.table-row-import').value);
                rowData['is_additional'] = row.querySelector('.table-row-checkbox-additional').checked;
            }
            rowData['warehouse_id'] = rowData?.['id'];
            rowData['warehouse_data'] = {'id': rowData?.['id'], 'title': rowData?.['title'], 'code': rowData?.['code']};
            tableWH.DataTable().row(rowIndex).data(rowData).draw();
            if (checked) {
                row.querySelector('.table-row-checkbox').checked = true;
            }
            if (rowData?.['quantity_import'] > 0) {
                gr_warehouse_data.push(rowData);
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
            if (row.querySelector('.table-row-import')) {
                rowData['quantity_import'] = parseFloat(row.querySelector('.table-row-import').innerHTML);
            }
            tablePR.DataTable().row(rowIndex).data(rowData).draw();
            if (checked) {
                row.querySelector('.table-row-checkbox').checked = true;
            }
            pr_products_data.push(rowData);
        });


        let elePOChecked = tablePO[0]?.querySelector('.table-row-checkbox:checked');
        if (elePOChecked) {
            let rowChecked = elePOChecked.closest('tr');
            // store new row data & redraw row
            let rowIndex = tablePO.DataTable().row(rowChecked).index();
            let $row = tablePO.DataTable().row(rowIndex);
            let rowData = $row.data();
            if (rowChecked.querySelector('.table-row-import')) {
                rowData['pr_products_data'] = pr_products_data;
                rowData['gr_warehouse_data'] = gr_warehouse_data;
                if (pr_products_data.length > 0) {
                    rowData['gr_warehouse_data'] = [];
                }
                rowData['quantity_import'] = parseFloat(rowChecked.querySelector('.table-row-import').innerHTML);
                tablePO.DataTable().row(rowIndex).data(rowData).draw();
                rowChecked.querySelector('.table-row-checkbox').checked = true;
            }
        }
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

    static setupDataShowLineDetail(is_submit = false) {
        let result = [];
        if (RecoveryLoadDataHandle.POSelectEle.val() || RecoveryLoadDataHandle.IASelectEle.val() || RecoveryLoadDataHandle.$boxProductionOrder.val() || RecoveryLoadDataHandle.$boxWorkOrder.val()) {
            let table = RecoveryDataTableHandle.tablePOProduct;
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
                    quantityImport = parseFloat(row.querySelector('.table-row-import').innerHTML);
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
                        RecoveryDataTableHandle.$tableProduct.DataTable().rows().every(function () {
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
        let type = RecoveryLoadDataHandle.typeSelectEle.val();
        if (type === '1') {
            if (RecoveryLoadDataHandle.POSelectEle.val()) {
                _form.dataForm['purchase_order_id'] = RecoveryLoadDataHandle.POSelectEle.val();
                let data = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.POSelectEle, RecoveryLoadDataHandle.POSelectEle.val());
                if (data) {
                    _form.dataForm['purchase_order_data'] = data;
                }
            }
            if (RecoveryLoadDataHandle.supplierSelectEle.val()) {
                _form.dataForm['supplier_id'] = RecoveryLoadDataHandle.supplierSelectEle.val();
                let data = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.supplierSelectEle, RecoveryLoadDataHandle.supplierSelectEle.val());
                if (data) {
                    _form.dataForm['supplier_data'] = data;
                }
            }
        }
        if (type === '2') {
            if (RecoveryLoadDataHandle.IASelectEle.val()) {
                _form.dataForm['inventory_adjustment_id'] = RecoveryLoadDataHandle.IASelectEle.val();
                let data = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.IASelectEle, RecoveryLoadDataHandle.IASelectEle.val());
                if (data) {
                    _form.dataForm['inventory_adjustment_data'] = data;
                }
            }
        }
        if (type === '3') {
            if (RecoveryLoadDataHandle.$boxTypeReport.val()) {
                _form.dataForm['production_report_type'] = parseInt(RecoveryLoadDataHandle.$boxTypeReport.val());
                if (RecoveryLoadDataHandle.$boxTypeReport.val() === '0') {
                    if (RecoveryLoadDataHandle.$boxProductionOrder.val()) {
                        _form.dataForm['production_order_id'] = RecoveryLoadDataHandle.$boxProductionOrder.val();
                        let data = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.$boxProductionOrder, RecoveryLoadDataHandle.$boxProductionOrder.val());
                        if (data) {
                            _form.dataForm['production_order_data'] = data;
                        }
                    }
                }
                if (RecoveryLoadDataHandle.$boxTypeReport.val() === '1') {
                    if (RecoveryLoadDataHandle.$boxWorkOrder.val()) {
                        _form.dataForm['work_order_id'] = RecoveryLoadDataHandle.$boxWorkOrder.val();
                        let data = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.$boxWorkOrder, RecoveryLoadDataHandle.$boxWorkOrder.val());
                        if (data) {
                            _form.dataForm['work_order_data'] = data;
                        }
                    }
                }
                if (RecoveryLoadDataHandle.$boxProductionReport.val() && RecoveryLoadDataHandle.$boxProductionReport.val().length > 0) {
                    let dataList = [];
                    for (let idx of RecoveryLoadDataHandle.$boxProductionReport.val()) {
                        let data = SelectDDControl.get_data_from_idx(RecoveryLoadDataHandle.$boxProductionReport, idx);
                        if (data) {
                            dataList.push(data);
                        }
                    }
                    _form.dataForm['production_reports_data'] = dataList;
                }
            }
        }
        _form.dataForm['goods_receipt_type'] = (parseInt(type) - 1);
        if (RecoveryLoadDataHandle.PRDataEle.val()) {
            _form.dataForm['purchase_requests'] = JSON.parse(RecoveryLoadDataHandle.PRDataEle.val());
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


