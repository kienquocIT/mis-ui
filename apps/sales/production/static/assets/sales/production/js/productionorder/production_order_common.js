// Load data
class ProdOrderLoadDataHandle {
    static $form = $('#frm_production_order');
    static $title = $('#title');
    static $quantity = $('#quantity');
    static $time = $('#time');
    static $dateStart = $('#date-start');
    static $dateEnd = $('#date-end');
    static $dateCreated = $('#date-created');
    static $boxType = $('#box-type');
    static $boxStatus = $('#box-status');
    static $boxProd = $('#box-product');
    static $boxUOM = $('#box-uom');
    static $boxWH = $('#box-warehouse');
    static $boxSO = $('#box-so');
    static $boxGroup = $('#box-group');
    static $manualDone = $('#manual-done');
    static $trans = $('#app-trans-factory');
    static $urls = $('#app-urls-factory');
    static $dataBOM = $('#data-bom');
    static dataType = [
        {'id': 0, 'title': ProdOrderLoadDataHandle.$trans.attr('data-production')},
        {'id': 1, 'title': ProdOrderLoadDataHandle.$trans.attr('data-assembly')},
        {'id': 2, 'title': ProdOrderLoadDataHandle.$trans.attr('data-disassembly')}
    ];
    static dataStatus = [
        {'id': 0, 'title': ProdOrderLoadDataHandle.$trans.attr('data-planned')},
        {'id': 1, 'title': ProdOrderLoadDataHandle.$trans.attr('data-in-production')},
        {'id': 2, 'title': ProdOrderLoadDataHandle.$trans.attr('data-done')},
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
                let res1 = `<span class="badge badge-soft-primary mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

    static loadInitPage() {
        // date
        ProdOrderLoadDataHandle.$dateCreated.val(ProdOrderCommonHandle.getCurrentDate());
        // select2
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxType, ProdOrderLoadDataHandle.dataType);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxStatus, ProdOrderLoadDataHandle.dataStatus);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxProd, [], {'general_product_types_mapped__is_finished_goods': true, 'bom_product__opportunity_id__isnull': true});
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxUOM);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxWH);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxSO, [], {'system_status': 3}, null, false, {'res1': 'code', 'res2': 'title'});
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxGroup);
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
        ProdOrderDataTableHandle.dataTableMain();
        // collapse
        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });
        // init WF
        WFRTControl.setWFInitialData('productionorder');
    };

    static loadBOM() {
        if (ProdOrderLoadDataHandle.$boxProd.val()) {
            $.fn.callAjax2({
                    'url': ProdOrderLoadDataHandle.$urls.attr('data-md-bom'),
                    'method': 'GET',
                    'data': {
                        'product_id': ProdOrderLoadDataHandle.$boxProd.val(),
                        'opportunity_id__isnull': true,
                        'bom_type__in': [0, 2, 3, 4].join(','),
                    },
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('bom_order_list') && Array.isArray(data.bom_order_list)) {
                            if (data.bom_order_list.length > 0) {
                                ProdOrderLoadDataHandle.loadAddDtbRows(ProdOrderLoadDataHandle.loadSetupBOM(data.bom_order_list[0]));

                                let multi = 1;
                                if (ProdOrderLoadDataHandle.$quantity) {
                                    multi = parseInt(ProdOrderLoadDataHandle.$quantity.val());
                                }
                                ProdOrderLoadDataHandle.$time.val(`${data.bom_order_list[0]?.['sum_time'] * multi}`);
                                ProdOrderLoadDataHandle.$dataBOM.val(JSON.stringify(data.bom_order_list[0]));
                            }
                        }
                    }
                }
            )
        }
    };

    static loadGetDataBOM() {
        if (ProdOrderLoadDataHandle.$dataBOM.val()) {
            return JSON.parse(ProdOrderLoadDataHandle.$dataBOM.val());
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
        ProdOrderDataTableHandle.$tableMain.DataTable().clear().draw();
        ProdOrderDataTableHandle.$tableMain.DataTable().rows.add(data).draw();
        ProdOrderLoadDataHandle.loadDD(ProdOrderDataTableHandle.$tableMain);
        ProdOrderLoadDataHandle.loadSetCollapse();
        return true;
    };

    static loadSetCollapse() {
        for (let child of ProdOrderDataTableHandle.$tableMain[0].querySelectorAll('.cl-child')) {
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
                    ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [], {'general_product_types_mapped__is_material': true});
                    if (dataRow?.['product_data']) {
                        $.fn.callAjax2({
                                'url': ProdOrderLoadDataHandle.$urls.attr('data-md-product'),
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
                                            ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [data.product_sale_list[0]], {'general_product_types_mapped__is_material': true});
                                        }
                                    }
                                }
                            }
                        )
                    }
                }
                if (row.querySelector('.table-row-uom')) {
                    ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')));
                    if (dataRow?.['uom_data']) {
                        ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')), [dataRow?.['uom_data']]);
                    }
                }
                if (row.querySelector('.check-all-wh')) {
                    row.querySelector('.check-all-wh').checked = dataRow?.['is_all_warehouse'];
                }
                if (row.querySelector('.table-row-warehouse')) {
                    if (dataRow?.['is_all_warehouse'] === true) {
                        row.querySelector('.table-row-warehouse').setAttribute('disabled', 'true');
                    }
                    ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-warehouse')));
                    if (dataRow?.['warehouse_data']) {
                        ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-warehouse')), [dataRow?.['warehouse_data']]);
                    }
                }
                if (row.querySelector('.table-row-tool')) {
                    ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-tool')));
                    if (dataRow?.['tool_data']) {
                        ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-tool')), dataRow?.['tool_data'], {'general_product_types_mapped__is_asset_tool': true});
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

    static loadCheckAllWH(ele) {
        let row = ele.closest('tr');
        if (row.querySelector('.table-row-warehouse') && row.querySelector('.table-row-stock') && row.querySelector('.table-row-available')) {
            row.querySelector('.table-row-stock').innerHTML = 0;
            row.querySelector('.table-row-available').innerHTML = 0;
            if (ele.checked === true) {
                row.querySelector('.table-row-warehouse').setAttribute('disabled', 'true');
                ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-warehouse')), []);
                ProdOrderLoadDataHandle.loadChangeWH(row, 1);
            }
            if (ele.checked === false) {
                row.querySelector('.table-row-warehouse').removeAttribute('disabled');
            }
        }
        // store data
        ProdOrderStoreHandle.storeRow(row);
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
                        'url': ProdOrderLoadDataHandle.$urls.attr('data-md-pwh'),
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
                    ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')), [dataUOM], {'group': dataUOMGr?.['id']});
                } else {
                    ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')));
                }
                // reset
                row.querySelector('.table-row-stock').innerHTML = 0;
                row.querySelector('.table-row-available').innerHTML = 0;
            }
        }
    };

    static loadChangeQuantity() {
        let multi = 1;
        if (ProdOrderLoadDataHandle.$quantity) {
            multi = parseInt(ProdOrderLoadDataHandle.$quantity.val());
        }
        ProdOrderDataTableHandle.$tableMain.DataTable().rows().every(function () {
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
        if (ProdOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let status_production = 1;
            if (ProdOrderLoadDataHandle.$manualDone[0].checked === true) {
                status_production = 2;
            }
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': ProdOrderLoadDataHandle.$urls.attr('data-manual-done'),
                    'method': "POST",
                    'data': {'production_order_id': $.fn.getPkDetail(), 'status_production': status_production},
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
        ProdOrderLoadDataHandle.$dataBOM.val(JSON.stringify(data?.['bom_data']));
        let empCurrent = JSON.parse($('#employee_current').text());
        ProdOrderLoadDataHandle.$title.val(data?.['title']);
        ProdOrderLoadDataHandle.$quantity.val(data?.['quantity']);
        if (data?.['product_data']?.['id']) {
            ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxProd, [data?.['product_data']], {'general_product_types_mapped__is_finished_goods': true});
        }
        if (data?.['uom_data']?.['id']) {
           ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxUOM, [data?.['uom_data']]);
        }
        if (data?.['warehouse_data']?.['id']) {
            ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxWH, [data?.['warehouse_data']]);
        }
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxSO, data?.['sale_order_data']);
        if (data?.['group_data']?.['id']) {
            ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxGroup, [data?.['group_data']]);
        }
        if (data?.['status_production'] !== 0) {
            ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxStatus, ProdOrderLoadDataHandle.dataStatus);
            ProdOrderLoadDataHandle.$boxStatus.val(data?.['status_production']).trigger('change');
            if (data?.['system_status'] === 3) {
                ProdOrderLoadDataHandle.$manualDone.removeAttr('disabled');
            }
            if (data?.['status_production'] === 2) {
                ProdOrderLoadDataHandle.$manualDone[0].checked = true;
            }
        }
        let date_start = '';
        if (data?.['date_start']) {
            date_start = data?.['date_start'];
            ProdOrderLoadDataHandle.$dateStart.val(moment(date_start).format('DD/MM/YYYY'));
        }
        let date_end = '';
        if (data?.['date_end']) {
            date_end = data?.['date_end'];
            ProdOrderLoadDataHandle.$dateEnd.val(moment(date_end).format('DD/MM/YYYY'));
        }
        ProdOrderLoadDataHandle.$time.val(data?.['time']);
        let date_created = '';
        if (data?.['date_created']) {
            date_created = data?.['date_created'];
            ProdOrderLoadDataHandle.$dateCreated.val(moment(date_created).format('DD/MM/YYYY'));
        }
        ProdOrderLoadDataHandle.loadAddDtbRows(data?.['task_data']);
        ProdOrderLoadDataHandle.loadReadonlyDisabled();
        return true;
    };

    static loadReadonlyDisabled() {
        if (ProdOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            ProdOrderDataTableHandle.$tableMain.DataTable().rows().every(function () {
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
class ProdOrderDataTableHandle {
    static $tableMain = $('#table_production_order');

    static dataTableMain(data) {
        ProdOrderDataTableHandle.$tableMain.DataTableDefault({
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
                        return `<select class="form-select table-row-item" data-url="${ProdOrderLoadDataHandle.$urls.attr('data-md-product')}" data-method="GET" data-keyResp="product_sale_list"></select>`;
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return ``;
                        }
                        return `<select class="form-select table-row-uom" data-url="${ProdOrderLoadDataHandle.$urls.attr('data-md-uom')}" data-method="GET" data-keyResp="unit_of_measure"></select>`;
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    render: (data, type, row) => {
                        let multi = 1;
                        if (ProdOrderLoadDataHandle.$quantity.val()) {
                            multi = parseInt(ProdOrderLoadDataHandle.$quantity.val());
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
                                    <label class="form-check-label" for="customRadio1">${ProdOrderLoadDataHandle.$trans.attr('data-all-wh')}</label>
                                </div><select class="form-select table-row-warehouse" data-url="${ProdOrderLoadDataHandle.$urls.attr('data-md-warehouse')}" data-method="GET" data-keyResp="warehouse_list"></select>`;
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
                        if (ProdOrderLoadDataHandle.$quantity.val()) {
                            multi = parseInt(ProdOrderLoadDataHandle.$quantity.val());
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
                            return `<select class="form-select table-row-tool" data-url="${ProdOrderLoadDataHandle.$urls.attr('data-md-product')}" data-method="GET" data-keyResp="product_sale_list" multiple></select>`;
                        }
                        return ``;
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

}

// Store data
class ProdOrderStoreHandle {

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
                    ProdOrderCommonHandle.filterFieldList(submitFields, dataRow);
                }
                row.querySelector('.table-row-order').setAttribute('data-row', JSON.stringify(dataRow));
            }
        }
        return true;
    };

    static storeAll() {
        ProdOrderDataTableHandle.$tableMain.DataTable().rows().every(function () {
            let row = this.node();
            ProdOrderStoreHandle.storeRow(row);
        });
        return true;
    }

}

// Submit Form
class ProdOrderSubmitHandle {

    static setupTask() {
        let result = [];
        ProdOrderDataTableHandle.$tableMain.DataTable().rows().every(function () {
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
        if (ProdOrderLoadDataHandle.$dataBOM.val()) {
            let dataBom = JSON.parse(ProdOrderLoadDataHandle.$dataBOM.val());
            _form.dataForm['bom_id'] = dataBom?.['id'];
            _form.dataForm['bom_data'] = dataBom;

            if (ProdOrderLoadDataHandle.$boxType.val()) {
                _form.dataForm['type_production'] = parseInt(ProdOrderLoadDataHandle.$boxType.val());
            }
            if (ProdOrderLoadDataHandle.$boxProd.val()) {
                _form.dataForm['product_id'] = ProdOrderLoadDataHandle.$boxProd.val();
                let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxProd, ProdOrderLoadDataHandle.$boxProd.val());
                if (data) {
                    _form.dataForm['product_data'] = data;
                }
            }
            if (ProdOrderLoadDataHandle.$quantity.val()) {
                _form.dataForm['quantity'] = parseFloat(ProdOrderLoadDataHandle.$quantity.val());
                _form.dataForm['gr_remain_quantity'] = parseFloat(ProdOrderLoadDataHandle.$quantity.val());
                if (_form.dataForm['quantity'] <= 0) {
                    $.fn.notifyB({description: ProdOrderLoadDataHandle.$trans.attr('data-validate-quantity')}, 'failure');
                    return false;
                }
            }
            if (ProdOrderLoadDataHandle.$boxUOM.val()) {
                _form.dataForm['uom_id'] = ProdOrderLoadDataHandle.$boxUOM.val();
                let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxUOM, ProdOrderLoadDataHandle.$boxUOM.val());
                if (data) {
                    _form.dataForm['uom_data'] = data;
                }
            }
            if (ProdOrderLoadDataHandle.$boxWH.val()) {
                _form.dataForm['warehouse_id'] = ProdOrderLoadDataHandle.$boxWH.val();
                let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxWH, ProdOrderLoadDataHandle.$boxWH.val());
                if (data) {
                    _form.dataForm['warehouse_data'] = data;
                }
            }
            if (ProdOrderLoadDataHandle.$boxSO.val()) {
                let dataSO = [];
                for (let val of ProdOrderLoadDataHandle.$boxSO.val()) {
                    let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxSO, val);
                    if (data) {
                        dataSO.push(data);
                    }
                }
                _form.dataForm['sale_order_data'] = dataSO;
            }
            if (ProdOrderLoadDataHandle.$dateStart.val()) {
                _form.dataForm['date_start'] = String(moment(ProdOrderLoadDataHandle.$dateStart.val(), 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD'));
            }
            if (ProdOrderLoadDataHandle.$dateEnd.val()) {
                _form.dataForm['date_end'] = String(moment(ProdOrderLoadDataHandle.$dateEnd.val(), 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD'));
            }
            if (ProdOrderLoadDataHandle.$boxGroup.val()) {
                _form.dataForm['group_id'] = ProdOrderLoadDataHandle.$boxGroup.val();
                let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxGroup, ProdOrderLoadDataHandle.$boxGroup.val());
                if (data) {
                    _form.dataForm['group_data'] = data;
                }
            }
            if (ProdOrderLoadDataHandle.$time.val()) {
                _form.dataForm['time'] = parseInt(ProdOrderLoadDataHandle.$time.val());
            }

            ProdOrderStoreHandle.storeAll();
            _form.dataForm['task_data'] = ProdOrderSubmitHandle.setupTask();

        }
    };
}

// Common
class ProdOrderCommonHandle {
    static commonDeleteRow(currentRow, $table) {
        ProdOrderCommonHandle.deleteRow(currentRow, $table);
        ProdOrderCommonHandle.reOrderTbl($table);
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

    static getCurrentDate() {
        let currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();
        return `${day}/${month}/${year}`;
    };

    static filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }

}
