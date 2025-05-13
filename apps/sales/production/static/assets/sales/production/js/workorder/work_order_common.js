// Load data
class WorkOrderLoadDataHandle {
    static $form = $('#frm_work_order');
    static $title = $('#title');
    static $dateStart = $('#date-start');
    static $dateEnd = $('#date-end');
    static $dateCreated = $('#date-created');
    static $boxStatus = $('#box-status');
    static $boxOpp = $('#opportunity_id');
    static $boxEmp = $('#employee_inherit_id');
    static $boxSO = $('#box-so');
    static $boxWH = $('#box-warehouse');
    static $boxGroup = $('#box-group');
    static $manualDone = $('#manual-done');
    static $btnEditProd = $('#btn-edit-product');
    static $btnSaveProd = $('#btn-save-product');

    static $product = $('#product');
    static $quantity = $('#quantity');
    static $uom = $('#uom');
    static $time = $('#time');

    static $trans = $('#app-trans-factory');
    static $urls = $('#app-urls-factory');
    static $dataBOM = $('#data-bom');
    static dataStatus = [
        {'id': 0, 'title': WorkOrderLoadDataHandle.$trans.attr('data-planned')},
        {'id': 1, 'title': WorkOrderLoadDataHandle.$trans.attr('data-in-production')},
        {'id': 2, 'title': WorkOrderLoadDataHandle.$trans.attr('data-done')},
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
                    let row = eleCheck.closest('tr');
                    if (row) {
                        if (row.querySelector('.table-row-quantity')) {
                            row.querySelector('.table-row-quantity').setAttribute('disabled', 'true');
                        }
                    }
                }
                // Set the current radio button as checked and apply style
                radio.checked = true;
                let row = radio.closest('tr');
                if (row) {
                    if (row.querySelector('.table-row-quantity')) {
                        row.querySelector('.table-row-quantity').removeAttribute('disabled');
                    }
                }
            }
        });
        return true;
    };

    static loadEventValidQuantity($table) {
        let inputs = $table[0].querySelectorAll('.table-row-quantity');
        inputs.forEach((input) => {
            input.addEventListener('change', function () {
                let row = input.closest('tr');
                if (row) {
                    if (row.querySelector('.table-row-quantity-wo-remain')) {
                        let remain = parseFloat(row.querySelector('.table-row-quantity-wo-remain').innerHTML);
                        let quantity = parseFloat(input.value);
                        if (quantity > remain) {
                            input.value = 0;
                            $.fn.notifyB({description: WorkOrderLoadDataHandle.$trans.attr('data-exceed-quantity')}, 'failure');
                            return false;
                        }
                    }
                }
            });
        });
        return true;
    };

    static loadEventValidNum(ele) {
        ele.addEventListener('change', function () {
            let value = ele.value;
            // Replace non-digit characters with an empty string
            value = value.replace(/[^0-9.]/g, '');
            // Remove unnecessary zeros from the integer part
            value = value.replace("-", "").replace(/^0+(?=\d)/, '');
            // Update value of input
            ele.value = value;
        });
    };

    static loadInitPage() {
        // date
        WorkOrderLoadDataHandle.$dateCreated.val(DateTimeControl.getCurrentDate("DMY", "/"));
        // select2
        FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxStatus, WorkOrderLoadDataHandle.dataStatus);
        FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxSO, [], {'system_status': 3}, null, false, {'res1': 'code', 'res2': 'title'});
        FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxWH);
        FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxGroup);
        // date picker
        $('.date-picker').each(function () {
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
            });
            $(this).val('').trigger('change');
        })
        // Dtb
        WorkOrderDataTableHandle.dataTableMain();
        WorkOrderDataTableHandle.dataTableSOProduct();
        // collapse
        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });
        // init WF
        WFRTControl.setWFInitialData('workorder');
    };

    static loadDataByOpportunity() {
        WorkOrderLoadDataHandle.loadCallAjaxSOProduct();
        return true;
    };

    static loadCallAjaxSOProduct() {
        if (WorkOrderLoadDataHandle.$boxOpp.val()) {
            let dataOpp = SelectDDControl.get_data_from_idx(WorkOrderLoadDataHandle.$boxOpp, WorkOrderLoadDataHandle.$boxOpp.val());
            if (dataOpp) {
                if (dataOpp?.['sale_person']?.['id']) {
                    FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxEmp, [dataOpp?.['sale_person']]);
                }
                WorkOrderDataTableHandle.$tableSOProd.DataTable().clear().draw();
                if (dataOpp?.['sale_order']?.['id']) {
                    FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxSO, [dataOpp?.['sale_order']], {'system_status': 3}, null, false, {'res1': 'code', 'res2': 'title'});
                    $.fn.callAjax2({
                            'url': WorkOrderLoadDataHandle.$urls.attr('data-so-product-wo'),
                            'method': 'GET',
                            'data': {'sale_order_id': dataOpp?.['sale_order']?.['id'], 'product__bom_product__isnull': false, 'product_id__isnull': false},
                            'isDropdown': true,
                        }
                    ).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                if (data.hasOwnProperty('sale_order_product_wo') && Array.isArray(data.sale_order_product_wo)) {
                                    let checkList = [];
                                    let fnData = [];
                                    for (let soProduct of data.sale_order_product_wo) {
                                        if (!checkList.includes(soProduct?.['product_data']?.['id'])) {
                                            fnData.push(soProduct);
                                        }
                                        checkList.push(soProduct?.['product_data']?.['id']);
                                    }
                                    WorkOrderDataTableHandle.$tableSOProd.DataTable().rows.add(fnData).draw();
                                    WorkOrderLoadDataHandle.loadEventValidQuantity(WorkOrderDataTableHandle.$tableSOProd);
                                    for (let ele of WorkOrderDataTableHandle.$tableSOProd[0].querySelectorAll('.table-row-quantity')) {
                                        WorkOrderLoadDataHandle.loadEventValidNum(ele);
                                    }
                                    WorkOrderLoadDataHandle.$btnEditProd.click();
                                }
                            }
                        }
                    )
                }
            }
        }
        return true;
    };

    static loadSaveProduct() {
        if (WorkOrderDataTableHandle.$tableSOProd[0].querySelector('.table-row-checkbox:checked')) {
            let eleChecked = WorkOrderDataTableHandle.$tableSOProd[0].querySelector('.table-row-checkbox:checked');
            let row = eleChecked.closest('tr');
            if (row.querySelector('.table-row-order') && row.querySelector('.table-row-quantity')) {
                if (row.querySelector('.table-row-order').getAttribute('data-row') && row.querySelector('.table-row-quantity').value) {
                    let dataRow = JSON.parse(row.querySelector('.table-row-order').getAttribute('data-row'));
                    let quantity = parseFloat(row.querySelector('.table-row-quantity').value);
                    if (dataRow?.['product_data']?.['id']) {
                        WorkOrderLoadDataHandle.$quantity.val(quantity);
                        WorkOrderLoadDataHandle.loadChangeQuantity();
                        let multi = 1;
                        if (WorkOrderLoadDataHandle.$quantity.val()) {
                            multi = parseInt(WorkOrderLoadDataHandle.$quantity.val());
                        }
                        let dataBOM = WorkOrderLoadDataHandle.loadGetDataBOM();
                        if (dataBOM?.['sum_time']) {
                            WorkOrderLoadDataHandle.$time.val(`${parseInt(dataBOM?.['sum_time']) * multi}`);
                        }
                        if (dataRow?.['uom_data']?.['id']) {
                            WorkOrderLoadDataHandle.$uom.val(dataRow?.['uom_data']?.['title']);
                            WorkOrderLoadDataHandle.$uom.attr('data-detail', JSON.stringify(dataRow?.['uom_data']));
                        }
                        if (dataRow?.['product_data']?.['general_information']?.['product_type']) {
                            for (let productType of dataRow?.['product_data']?.['general_information']?.['product_type']) {
                                if (productType?.['is_service'] === true) {
                                    WorkOrderLoadDataHandle.$boxWH.attr('readonly', 'true');
                                    break;
                                }
                            }
                        }

                        let curProdID = null;
                        if (WorkOrderLoadDataHandle.$product.attr('data-detail')) {
                            let dataProduct = JSON.parse(WorkOrderLoadDataHandle.$product.attr('data-detail'));
                            curProdID = dataProduct?.['id'];
                        }
                        if (dataRow?.['product_data']?.['id'] !== curProdID) {
                            WorkOrderLoadDataHandle.$product.val(dataRow?.['product_data']?.['title']);
                            WorkOrderLoadDataHandle.$product.attr('data-detail', JSON.stringify(dataRow?.['product_data']));
                            WorkOrderLoadDataHandle.loadBOM();
                        }
                    }
                }
            }
        }
        return true;
    };

    static loadBOM() {
        if (WorkOrderLoadDataHandle.$product.attr('data-detail')) {
            let dataProduct = JSON.parse(WorkOrderLoadDataHandle.$product.attr('data-detail'));
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': WorkOrderLoadDataHandle.$urls.attr('data-md-bom'),
                    'method': 'GET',
                    'data': {
                        'product_id': dataProduct?.['id'],
                        // 'opportunity_id__isnull': false,
                        // 'bom_type__in': [0, 2, 3, 4].join(','),
                        'system_status': 3,
                    },
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('bom_order_list') && Array.isArray(data.bom_order_list)) {
                            if (data.bom_order_list.length > 0) {
                                WorkOrderLoadDataHandle.loadAddDtbRows(WorkOrderLoadDataHandle.loadSetupBOM(data.bom_order_list[0]));
                                let multi = 1;
                                if (WorkOrderLoadDataHandle.$quantity.val()) {
                                    multi = parseInt(WorkOrderLoadDataHandle.$quantity.val());
                                }
                                WorkOrderLoadDataHandle.$time.val(`${data.bom_order_list[0]?.['sum_time'] * multi}`);
                                WorkOrderLoadDataHandle.$dataBOM.val(JSON.stringify(data.bom_order_list[0]));
                                WorkOrderLoadDataHandle.loadChangeQuantity();
                                WindowControl.hideLoading();
                            } else {
                                $.fn.notifyB({description: WorkOrderLoadDataHandle.$trans.attr('data-no-bom')}, 'failure');
                                WindowControl.hideLoading();
                                return false;
                            }
                        }
                    }
                }
            )
        }
    };

    static loadGetDataBOM() {
        if (WorkOrderLoadDataHandle.$dataBOM.val()) {
            return JSON.parse(WorkOrderLoadDataHandle.$dataBOM.val());
        }
        return {};
    };

    static loadSetupBOM(data) {
        let result = [];
        for (let task of data?.['bom_task']) {  // task
            let tool_list = [];
            for (let tool of data?.['bom_tool']) {
                if (tool?.['bom_task']?.['id'] === task?.['id']) {
                    tool_list.push(tool?.['product_data']);
                }
            }
            task['is_task'] = true;
            task['task_order'] = task?.['order'];
            task['tool_data'] = tool_list;
            result.push(task);
            for (let material of data?.['bom_material']) {
                if (material?.['bom_task']?.['id'] === task?.['id']) {
                    material['task_order'] = task?.['order'];
                    result.push(material);
                }
            }
        }
        return result;
    };

    static loadAddDtbRows(data) {
        let tmp = [
            {'is_task': true, 'task_order': 1, 'task_title': 'Gia công chân bàn', 'quantity_bom': 1, 'quantity': 0, 'uom_data': {'id': 0, 'title': 'Giờ'}, 'tool_data': []},
            {'task_order': 1, 'product_data': {'id': 0, 'title': 'Gỗ khối 10x10x100', 'available_amount': 125}, 'warehouse_data': {'id': 0, 'title': 'Kho 1', 'available_stock': 105}, 'quantity_bom': 6, 'quantity': 0, 'order': 1},
            {'task_order': 1, 'product_data': {'id': 1, 'title': 'Pat kim loại chân bàn lớn', 'available_amount': 80}, 'warehouse_data': {'id': 0, 'title': 'Kho 1', 'available_stock': 80}, 'quantity_bom':  6, 'quantity': 0, 'order': 2},

            {'is_task': true, 'task_order': 2, 'task_title': 'Lắp ráp', 'quantity_bom': 2, 'quantity': 0, 'uom_data': {'id': 0, 'title': 'Giờ'}, 'tool_data': []},
            {'task_order': 2, 'product_data': {'id': 0, 'title': 'Mặt bàn lớn', 'available_amount': 15}, 'warehouse_data': {'id': 0, 'title': 'Kho 1', 'available_stock': 15}, 'quantity_bom': 1, 'quantity': 0, 'order': 1},
            {'task_order': 2, 'product_data': {'id': 1, 'title': 'Vít lớn 4mm', 'available_amount': 45}, 'warehouse_data': {'id': 0, 'title': 'Kho 1', 'available_stock': 30}, 'quantity_bom': 3, 'quantity': 0, 'order': 2},
        ]
        WorkOrderDataTableHandle.$tableMain.DataTable().clear().draw();
        WorkOrderDataTableHandle.$tableMain.DataTable().rows.add(data).draw();
        WorkOrderLoadDataHandle.loadDD(WorkOrderDataTableHandle.$tableMain);
        WorkOrderLoadDataHandle.loadSetCollapse();
        return true;
    };

    static loadSetCollapse() {
        for (let child of WorkOrderDataTableHandle.$tableMain[0].querySelectorAll('.cl-child')) {
            if (child.getAttribute('data-row')) {
                let dataRow = JSON.parse(child.getAttribute('data-row'));
                let row = child.closest('tr');
                let cls = '';
                if (dataRow?.['task_order']) {
                    cls = 'cl-' + String(dataRow?.['task_order']);
                }
                row.classList.add(cls);
                row.classList.add('collapse');
                row.classList.add('show');
            }
        }
        return true;
    };

    static loadDD($table) {
        $table.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-order').getAttribute('data-row')) {
                let dataRow = JSON.parse(row.querySelector('.table-row-order').getAttribute('data-row'));
                if (row.querySelector('.table-row-item')) {
                    FormElementControl.loadInitS2($(row.querySelector('.table-row-item')), [], {'general_product_types_mapped__is_material': true});
                    if (dataRow?.['product_data']) {
                        $.fn.callAjax2({
                                'url': WorkOrderLoadDataHandle.$urls.attr('data-md-product'),
                                'method': 'GET',
                                'data': {'id': dataRow?.['product_data']?.['id']},
                                'isDropdown': true,
                            }
                        ).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    if (data.hasOwnProperty('product_sale_list') && Array.isArray(data.product_sale_list)) {
                                        if (data.product_sale_list.length > 0) {
                                            FormElementControl.loadInitS2($(row.querySelector('.table-row-item')), [data.product_sale_list[0]], {'general_product_types_mapped__is_material': true});
                                        }
                                    }
                                }
                            }
                        )
                    }
                }
                if (row.querySelector('.table-row-uom')) {
                    FormElementControl.loadInitS2($(row.querySelector('.table-row-uom')));
                    if (dataRow?.['uom_data']) {
                        FormElementControl.loadInitS2($(row.querySelector('.table-row-uom')), [dataRow?.['uom_data']]);
                    }
                }
                if (row.querySelector('.check-all-wh')) {
                    row.querySelector('.check-all-wh').checked = dataRow?.['is_all_warehouse'];
                }
                if (row.querySelector('.table-row-warehouse')) {
                    if (dataRow?.['is_all_warehouse'] === true) {
                        row.querySelector('.table-row-warehouse').setAttribute('disabled', 'true');
                    }
                    FormElementControl.loadInitS2($(row.querySelector('.table-row-warehouse')));
                    if (dataRow?.['warehouse_data']) {
                        FormElementControl.loadInitS2($(row.querySelector('.table-row-warehouse')), [dataRow?.['warehouse_data']]);
                    }
                }
                if (row.querySelector('.table-row-tool')) {
                    FormElementControl.loadInitS2($(row.querySelector('.table-row-tool')));
                    if (dataRow?.['tool_data']) {
                        FormElementControl.loadInitS2($(row.querySelector('.table-row-tool')), dataRow?.['tool_data'], {'general_product_types_mapped__is_asset_tool': true});
                    }
                }
                if (row.querySelector('.cl-parent')) {
                    row.querySelector('.cl-parent').addEventListener('click', function () {
                        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
                    });
                }
            }
        });
        return true;
    };

    static loadChangeWH(row, type= 0) {
        if (row) {
            if (row.querySelector('.table-row-item') && row.querySelector('.table-row-warehouse') && row.querySelector('.table-row-stock') && row.querySelector('.table-row-available')) {
                let productID = $(row.querySelector('.table-row-item')).val();
                let warehouseID = $(row.querySelector('.table-row-warehouse')).val();
                let dataParams = {'product_id': productID, 'warehouse_id': warehouseID};
                if (type === 1) {
                    dataParams = {'product_id': productID};
                }
                $.fn.callAjax2({
                        'url': WorkOrderLoadDataHandle.$urls.attr('data-md-pwh'),
                        'method': 'GET',
                        'data': dataParams,
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('warehouse_products_list') && Array.isArray(data.warehouse_products_list)) {
                                if (data.warehouse_products_list.length > 0) {
                                    if (type === 0) {
                                        let dataPWH = data.warehouse_products_list[0];
                                        row.querySelector('.table-row-stock').innerHTML = dataPWH?.['stock_amount'];
                                        row.querySelector('.table-row-available').innerHTML = dataPWH?.['available_stock'];
                                    }
                                    if (type === 1) {
                                        let stock = 0;
                                        let available = 0;
                                        for (let dataPWH of data.warehouse_products_list) {
                                            stock += dataPWH?.['stock_amount'];
                                            available += dataPWH?.['available_stock'];
                                        }
                                        row.querySelector('.table-row-stock').innerHTML = stock;
                                        row.querySelector('.table-row-available').innerHTML = available;
                                    }
                                }
                            }
                        }
                    }
                )
            }
        }
    };

    static loadChangeProduct(row) {
        if (row.querySelector('.table-row-item') && row.querySelector('.table-row-uom') && row.querySelector('.table-row-warehouse') && row.querySelector('.table-row-stock') && row.querySelector('.table-row-available')) {
            let data = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-item')), $(row.querySelector('.table-row-item')).val());
            if (data) {
                let dataUOM = data?.['purchase_information']?.['uom'];
                let dataUOMGr = data?.['general_information']?.['uom_group'];
                // load UOM
                if (dataUOM && dataUOMGr?.['id']) {
                    FormElementControl.loadInitS2($(row.querySelector('.table-row-uom')), [dataUOM], {'group': dataUOMGr?.['id']});
                } else {
                    FormElementControl.loadInitS2($(row.querySelector('.table-row-uom')));
                }
                // reset
                row.querySelector('.table-row-stock').innerHTML = 0;
                row.querySelector('.table-row-available').innerHTML = 0;
            }
        }
    };

    static loadChangeQuantity() {
        let multi = 1;
        if (WorkOrderLoadDataHandle.$quantity.val()) {
            multi = parseInt(WorkOrderLoadDataHandle.$quantity.val());
        }
        WorkOrderDataTableHandle.$tableMain.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-order').getAttribute('data-row')) {
                let dataRow = JSON.parse(row.querySelector('.table-row-order').getAttribute('data-row'));
                if (row.querySelector('.table-row-labor')) {
                    row.querySelector('.table-row-labor').innerHTML = dataRow?.['quantity_bom'] * multi;
                }
                if (row.querySelector('.table-row-quantity')) {
                    row.querySelector('.table-row-quantity').innerHTML = dataRow?.['quantity_bom'] * multi;
                }
            }
        });
        return true;
    };

    static loadClickManualDone() {
        if (WorkOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let status_production = 1;
            if (WorkOrderLoadDataHandle.$manualDone[0].checked === true) {
                status_production = 2;
            }
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': WorkOrderLoadDataHandle.$urls.attr('data-manual-done'),
                    'method': "POST",
                    'data': {'work_order_id': $.fn.getPkDetail(), 'status_production': status_production},
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        }
        return true;
    };

    // Detail
    static loadDetail(data) {
        WorkOrderLoadDataHandle.$dataBOM.val(JSON.stringify(data?.['bom_data']));
        WorkOrderLoadDataHandle.$title.val(data?.['title']);
        if (data?.['opportunity_data']?.['id']) {
            FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxOpp, [data?.['opportunity_data']], {}, null, false, {'res1': 'code', 'res2': 'title'});
        }
        if (data?.['employee_inherit_data']?.['id']) {
            FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxEmp, [data?.['employee_inherit_data']], {}, null, false, {'res1': 'code', 'res2': 'title'});
        }
        if (data?.['sale_order_data']?.['id']) {
            FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxSO, [data?.['sale_order_data']], {'system_status': 3}, null, false, {'res1': 'code', 'res2': 'title'});
        }
        if (data?.['product_data']?.['id']) {
            WorkOrderLoadDataHandle.$product.val(data?.['product_data']?.['title']);
            WorkOrderLoadDataHandle.$product.attr('data-detail', JSON.stringify(data?.['product_data']));
        }
        WorkOrderLoadDataHandle.$quantity.val(data?.['quantity']);
        if (data?.['uom_data']?.['id']) {
            WorkOrderLoadDataHandle.$uom.val(data?.['uom_data']?.['title']);
            WorkOrderLoadDataHandle.$uom.attr('data-detail', JSON.stringify(data?.['uom_data']));
        }
        if (data?.['warehouse_data']?.['id']) {
            FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxWH, [data?.['warehouse_data']]);
        }
        if (data?.['group_data']?.['id']) {
            FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxGroup, [data?.['group_data']]);
        }
        if (data?.['status_production'] !== 0) {
            FormElementControl.loadInitS2(WorkOrderLoadDataHandle.$boxStatus, WorkOrderLoadDataHandle.dataStatus);
            WorkOrderLoadDataHandle.$boxStatus.val(data?.['status_production']).trigger('change');
            if (data?.['system_status'] === 3) {
                WorkOrderLoadDataHandle.$manualDone.removeAttr('disabled');
            }
            if (data?.['status_production'] === 2) {
                WorkOrderLoadDataHandle.$manualDone[0].checked = true;
            }
        }
        let date_start = '';
        if (data?.['date_start']) {
            date_start = data?.['date_start'];
            WorkOrderLoadDataHandle.$dateStart.val(moment(date_start).format('DD/MM/YYYY'));
        }
        let date_end = '';
        if (data?.['date_end']) {
            date_end = data?.['date_end'];
            WorkOrderLoadDataHandle.$dateEnd.val(moment(date_end).format('DD/MM/YYYY'));
        }
        WorkOrderLoadDataHandle.$time.val(data?.['time']);
        let date_created = '';
        if (data?.['date_created']) {
            date_created = data?.['date_created'];
            WorkOrderLoadDataHandle.$dateCreated.val(moment(date_created).format('DD/MM/YYYY'));
        }
        WorkOrderLoadDataHandle.loadAddDtbRows(data?.['task_data']);
        WorkOrderLoadDataHandle.loadReadonlyDisabled();
        return true;
    };

    static loadReadonlyDisabled() {
        if (WorkOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            WorkOrderDataTableHandle.$tableMain.DataTable().rows().every(function () {
                let row = this.node();
                for (let ele of row.querySelectorAll('.table-row-item')) {
                    ele.setAttribute('readonly', 'true');
                }
                for (let ele of row.querySelectorAll('.table-row-uom')) {
                    ele.setAttribute('readonly', 'true');
                }
                for (let ele of row.querySelectorAll('.check-all-wh')) {
                    ele.setAttribute('disabled', 'true');
                }
                for (let ele of row.querySelectorAll('.table-row-warehouse')) {
                    ele.setAttribute('readonly', 'true');
                }
                for (let ele of row.querySelectorAll('.table-row-tool')) {
                    ele.setAttribute('disabled', 'true');
                }
                return true;
            });
        }
        return true;
    };

}

// DataTable
class WorkOrderDataTableHandle {
    static $tableMain = $('#table_work_order');
    static $tableSOProd = $('#table-so-product');

    static dataTableMain(data) {
        WorkOrderDataTableHandle.$tableMain.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        if (row?.['is_task'] === true) {
                            let target = ".cl-" + String(row?.['task_order']);
                            return `<button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-xs table-row-task cl-parent" 
                                        data-bs-toggle="collapse"
                                        data-bs-target="${target}"
                                        data-bs-placement="top"
                                        aria-expanded="true"
                                        aria-controls="newGroup"
                                        data-group-order="${row?.['task_order']}"
                                        data-row="${dataRow}"
                                    >
                                        <span class="icon"><i class="fas fa-chevron-down"></i></span>
                                    </button>
                                    <span class="table-row-order" data-row="${dataRow}" hidden></span>`;
                        }
                        return `<span class="table-row-order ml-3 cl-child" data-row="${dataRow}">${row?.['order']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '20%',
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return `<b class="table-row-task-title">${row?.['task_title']}</b>`;
                        }
                        return `<select class="form-select table-row-item" data-url="${WorkOrderLoadDataHandle.$urls.attr('data-md-product')}" data-method="GET" data-keyResp="product_sale_list"></select>`;
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return ``;
                        }
                        return `<select class="form-select table-row-uom" data-url="${WorkOrderLoadDataHandle.$urls.attr('data-md-uom')}" data-method="GET" data-keyResp="unit_of_measure"></select>`;
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    render: (data, type, row) => {
                        let multi = 1;
                        if (WorkOrderLoadDataHandle.$quantity.val()) {
                            multi = parseInt(WorkOrderLoadDataHandle.$quantity.val());
                        }
                        if (row?.['is_task'] === true) {
                            return ``;
                        }
                        return `<span class="table-row-quantity">${row?.['quantity_bom'] * multi}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '15%',
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return ``;
                        }
                        let checked = '';
                        if (row?.['is_all_warehouse'] === true) {
                            checked = 'checked';
                        }
                        return `<div class="form-check">
                                    <input type="checkbox" id="customRadio1" name="customRadio" class="form-check-input check-all-wh" ${checked}>
                                    <label class="form-check-label" for="customRadio1">${WorkOrderLoadDataHandle.$trans.attr('data-all-wh')}</label>
                                </div><select class="form-select table-row-warehouse" data-url="${WorkOrderLoadDataHandle.$urls.attr('data-md-warehouse')}" data-method="GET" data-keyResp="warehouse_list"></select>`;
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return ``;
                        }
                        return `<span class="table-row-stock">${row?.['stock'] ? row?.['stock'] : 0}</span>`;
                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return ``;
                        }
                        return `<span class="table-row-available">${row?.['available'] ? row?.['available'] : 0}</span>`;
                    }
                },
                {
                    targets: 7,
                    width: '10%',
                    render: (data, type, row) => {
                        let multi = 1;
                        if (WorkOrderLoadDataHandle.$quantity.val()) {
                            multi = parseInt(WorkOrderLoadDataHandle.$quantity.val());
                        }
                        if (row?.['is_task'] === true) {
                            return `<span class="table-row-labor">${row?.['quantity_bom'] * multi}</span><span class="table-row-uom-labor"> ${row?.['uom_data']?.['title']}</span>`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 8,
                    width: '18%',
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return `<select class="form-select table-row-tool" data-url="${WorkOrderLoadDataHandle.$urls.attr('data-md-product')}" data-method="GET" data-keyResp="product_sale_list" multiple></select>`;
                        }
                        return ``;
                    }
                },
            ],
            drawCallback: function () {
                WorkOrderDataTableHandle.dtbMainHDCustom();
            },
        });
    };

    static dataTableSOProduct(data) {
        WorkOrderDataTableHandle.$tableSOProd.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${(meta.row + 1)}</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-lg">
                                    <input 
                                        type="radio" 
                                        class="form-check-input table-row-checkbox" 
                                        id="so-pro-${row?.['product_data']?.['id'].replace(/-/g, "")}"
                                    >
                                    <label class="table-row-item" for="so-pro-${row?.['product_data']?.['id'].replace(/-/g, "")}">${row?.['product_data']?.['title']}</label>
                                </div>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['uom_data']?.['title']}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-so">${row?.['quantity_so'] ? row?.['quantity_so'] : 0}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-wo-completed">${row?.['quantity_wo_completed'] ? row?.['quantity_wo_completed'] : 0}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-wo-remain">${row?.['quantity_wo_remain'] ? row?.['quantity_wo_remain'] : 0}</span>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-quantity valid-num" value="${row?.['quantity'] ? row?.['quantity'] : 0}" disabled>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                WorkOrderLoadDataHandle.loadEventRadio(WorkOrderDataTableHandle.$tableSOProd);
                WorkOrderDataTableHandle.dtbSOProductHDCustom();
            },
        });
    };

    // Custom dtb
    static dtbMainHDCustom() {
        let $table = WorkOrderDataTableHandle.$tableMain;
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

    static dtbSOProductHDCustom() {
        let $table = WorkOrderDataTableHandle.$tableSOProd;
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
class WorkOrderStoreHandle {

    static storeRow(row) {
        if (row.querySelector('.table-row-order')) {
            if (row.querySelector('.table-row-order').getAttribute('data-row')) {
                let dataRow = JSON.parse(row.querySelector('.table-row-order').getAttribute('data-row'));
                if (row.querySelector('.table-row-task')) {  // task
                    if (row.querySelector('.table-row-labor')) {
                        dataRow['quantity'] = parseFloat(row.querySelector('.table-row-labor').innerHTML);
                    }
                    if (row.querySelector('.table-row-tool')) {
                        if ($(row.querySelector('.table-row-tool')).val()) {
                            let dataTool = [];
                            for (let val of $(row.querySelector('.table-row-tool')).val()) {
                                let data = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-tool')), val);
                                if (data) {
                                    dataTool.push(data);
                                }
                            }
                            dataRow['tool_data'] = dataTool;
                        }
                    }
                }
                if (row.querySelector('.table-row-item')) {  // product
                    dataRow['product_id'] = null;
                    dataRow['product_data'] = {};
                    if ($(row.querySelector('.table-row-item')).val()) {
                        let data = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-item')), $(row.querySelector('.table-row-item')).val());
                        if (data) {
                            dataRow['product_id'] = data?.['id'];
                            dataRow['product_data'] = data;
                        }
                    }
                    if (row.querySelector('.table-row-uom')) {
                        dataRow['uom_id'] = null;
                        dataRow['uom_data'] = {};
                        if ($(row.querySelector('.table-row-uom')).val()) {
                            let data = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-uom')), $(row.querySelector('.table-row-uom')).val());
                            if (data) {
                                dataRow['uom_id'] = data?.['id'];
                                dataRow['uom_data'] = data;
                            }
                        }
                    }
                    if (row.querySelector('.table-row-quantity')) {
                        dataRow['quantity'] = parseFloat(row.querySelector('.table-row-quantity').innerHTML);
                    }
                    dataRow['is_all_warehouse'] = !!row.querySelector('.check-all-wh:checked');
                    if (row.querySelector('.table-row-warehouse')) {
                        dataRow['warehouse_id'] = null;
                        dataRow['warehouse_data'] = {};
                        if ($(row.querySelector('.table-row-warehouse')).val()) {
                            let data = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-warehouse')), $(row.querySelector('.table-row-warehouse')).val());
                            if (data) {
                                dataRow['warehouse_id'] = data?.['id'];
                                dataRow['warehouse_data'] = data;
                            }
                        }
                    }
                    if (row.querySelector('.table-row-stock')) {
                        dataRow['stock'] = parseFloat(row.querySelector('.table-row-stock').innerHTML);
                    }
                    if (row.querySelector('.table-row-available')) {
                        dataRow['available'] = parseFloat(row.querySelector('.table-row-available').innerHTML);
                    }
                }
                let submitFields = [
                    'is_task',
                    'task_title',
                    'task_order',
                    'product_id',
                    'product_data',
                    'uom_id',
                    'uom_data',
                    'quantity_bom',
                    'quantity',
                    'is_all_warehouse',
                    'warehouse_id',
                    'warehouse_data',
                    'stock',
                    'available',
                    'tool_data',
                    'order',
                ]
                if (dataRow) {
                    WorkOrderCommonHandle.filterFieldList(submitFields, dataRow);
                }
                row.querySelector('.table-row-order').setAttribute('data-row', JSON.stringify(dataRow));
            }
        }
        return true;
    };

    static storeAll() {
        WorkOrderDataTableHandle.$tableMain.DataTable().rows().every(function () {
            let row = this.node();
            WorkOrderStoreHandle.storeRow(row);
        });
        return true;
    }

}

// Submit Form
class WorkOrderSubmitHandle {

    static setupTask() {
        let result = [];
        WorkOrderDataTableHandle.$tableMain.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-order')) {
                if (row.querySelector('.table-row-order').getAttribute('data-row')) {
                    result.push(JSON.parse(row.querySelector('.table-row-order').getAttribute('data-row')));
                }
            }
        });
        return result;
    };

    static setupDataSubmit(_form) {
        if (WorkOrderLoadDataHandle.$dataBOM.val()) {
            let dataBom = JSON.parse(WorkOrderLoadDataHandle.$dataBOM.val());
            _form.dataForm['bom_id'] = dataBom?.['id'];
            _form.dataForm['bom_data'] = dataBom;

            if (WorkOrderLoadDataHandle.$boxOpp.val()) {
                _form.dataForm['opportunity_id'] = WorkOrderLoadDataHandle.$boxOpp.val();
                let data = SelectDDControl.get_data_from_idx(WorkOrderLoadDataHandle.$boxOpp, WorkOrderLoadDataHandle.$boxOpp.val());
                if (data) {
                    _form.dataForm['opportunity_data'] = data;
                }
            }
            if (WorkOrderLoadDataHandle.$boxEmp.val()) {
                _form.dataForm['employee_inherit_id'] = WorkOrderLoadDataHandle.$boxEmp.val();
                let data = SelectDDControl.get_data_from_idx(WorkOrderLoadDataHandle.$boxEmp, WorkOrderLoadDataHandle.$boxEmp.val());
                if (data) {
                    _form.dataForm['employee_inherit_data'] = data;
                }
            }
            if (WorkOrderLoadDataHandle.$boxSO.val()) {
                _form.dataForm['sale_order_id'] = WorkOrderLoadDataHandle.$boxSO.val();
                let data = SelectDDControl.get_data_from_idx(WorkOrderLoadDataHandle.$boxSO,WorkOrderLoadDataHandle.$boxSO.val());
                if (data) {
                    _form.dataForm['sale_order_data'] = data;
                }
            }
            if (WorkOrderLoadDataHandle.$product.attr('data-detail')) {
                let dataProduct = JSON.parse(WorkOrderLoadDataHandle.$product.attr('data-detail'));
                _form.dataForm['product_id'] = dataProduct?.['id'];
                _form.dataForm['product_data'] = dataProduct;
            }
            if (WorkOrderLoadDataHandle.$quantity.val()) {
                _form.dataForm['quantity'] = parseFloat(WorkOrderLoadDataHandle.$quantity.val());
                _form.dataForm['gr_remain_quantity'] = parseFloat(WorkOrderLoadDataHandle.$quantity.val());
                if (_form.dataForm['quantity'] <= 0) {
                    $.fn.notifyB({description: WorkOrderLoadDataHandle.$trans.attr('data-validate-quantity')}, 'failure');
                    return false;
                }
            }
            if (WorkOrderLoadDataHandle.$uom.attr('data-detail')) {
                let dataUOM = JSON.parse(WorkOrderLoadDataHandle.$uom.attr('data-detail'));
                _form.dataForm['uom_id'] = dataUOM?.['id'];
                _form.dataForm['uom_data'] = dataUOM;
            }
            if (WorkOrderLoadDataHandle.$boxWH.val()) {
                _form.dataForm['warehouse_id'] = WorkOrderLoadDataHandle.$boxWH.val();
                let data = SelectDDControl.get_data_from_idx(WorkOrderLoadDataHandle.$boxWH,WorkOrderLoadDataHandle.$boxWH.val());
                if (data) {
                    _form.dataForm['warehouse_data'] = data;
                }
            }
            if (WorkOrderLoadDataHandle.$dateStart.val()) {
                _form.dataForm['date_start'] = String(moment(WorkOrderLoadDataHandle.$dateStart.val(), 'DD/MM/YYYY').format('YYYY-MM-DD'));
            }
            if (WorkOrderLoadDataHandle.$dateEnd.val()) {
                _form.dataForm['date_end'] = String(moment(WorkOrderLoadDataHandle.$dateEnd.val(), 'DD/MM/YYYY').format('YYYY-MM-DD'));
            }
            if (WorkOrderLoadDataHandle.$boxGroup.val()) {
                _form.dataForm['group_id'] = WorkOrderLoadDataHandle.$boxGroup.val();
                let data = SelectDDControl.get_data_from_idx(WorkOrderLoadDataHandle.$boxGroup, WorkOrderLoadDataHandle.$boxGroup.val());
                if (data) {
                    _form.dataForm['group_data'] = data;
                }
            }
            if (WorkOrderLoadDataHandle.$time.val()) {
                _form.dataForm['time'] = parseInt(WorkOrderLoadDataHandle.$time.val());
            }

            WorkOrderStoreHandle.storeAll();
            _form.dataForm['task_data'] = WorkOrderSubmitHandle.setupTask();

        }
        return _form.dataForm;
    };
}

// Common
class WorkOrderCommonHandle {
    static commonDeleteRow(currentRow, $table) {
        WorkOrderCommonHandle.deleteRow(currentRow, $table);
        WorkOrderCommonHandle.reOrderTbl($table);
        return true;
    };

    static reOrderTbl($table) {
        let itemCount = $table[0].querySelectorAll('.table-row-order').length;
        if (itemCount === 0) {
            $table.DataTable().clear().draw();
        } else {
            let order = 1;
            for (let eleOrder of $table[0].querySelectorAll('.table-row-order')) {
                if (eleOrder.getAttribute('data-row')) {
                    let dataRow = JSON.parse(eleOrder.getAttribute('data-row'));
                    dataRow['order'] = order;
                }
                eleOrder.innerHTML = order;
                order++
                if (order > itemCount) {
                    break;
                }
            }
        }
        return true;
    };

    static deleteRow(currentRow, $table) {
        let rowIdx = $table.DataTable().row(currentRow).index();
        let row = $table.DataTable().row(rowIdx);
        row.remove().draw();
        return true;
    };

    static filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }

}
