// Load data
class ProdOrderLoadDataHandle {
    static $form = $('#frm_production_order');
    static $quantity = $('#quantity');
    static $time = $('#time');
    static $boxType = $('#box-type');
    static $boxStatus = $('#box-status');
    static $boxProd = $('#box-product');
    static $boxUOM = $('#box-uom');
    static $boxWH = $('#box-warehouse');
    static $boxSO = $('#box-so');
    static $boxGroup = $('#box-group');
    static $trans = $('#app-trans-factory');
    static $urls = $('#app-urls-factory');
    static dataType = [
        {'id': 0, 'title': ProdOrderLoadDataHandle.$trans.attr('data-production')},
        {'id': 1, 'title': ProdOrderLoadDataHandle.$trans.attr('data-assembly')},
        {'id': 2, 'title': ProdOrderLoadDataHandle.$trans.attr('data-disassembly')}
    ];
    static dataStatus = [{'id': 0, 'title': ProdOrderLoadDataHandle.$trans.attr('data-planned')}];

    static loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false) {
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
        $ele.initSelect2(opts);
        return true;
    };

    static loadInitPage() {
        // select2
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxType, ProdOrderLoadDataHandle.dataType);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxStatus, ProdOrderLoadDataHandle.dataStatus);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxProd);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxUOM);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxWH);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxSO);
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
    };

    static loadAddDtbRows(data) {
        let tmp = [
            {'is_group': true, 'group_order': 1, 'group_title': 'Gia công chân bàn', 'labor_bom': 1, 'labor': 0, 'uom_labor_data': {'id': 0, 'title': 'Giờ'}, 'tool_data': []},
            {'group_order': 1, 'product_data': {'id': 0, 'title': 'Gỗ khối 10x10x100', 'available_amount': 125}, 'warehouse_data': {'id': 0, 'title': 'Kho 1', 'available_stock': 105}, 'quantity_bom': 6, 'quantity': 0, 'order': 1},
            {'group_order': 1, 'product_data': {'id': 1, 'title': 'Pat kim loại chân bàn lớn', 'available_amount': 80}, 'warehouse_data': {'id': 0, 'title': 'Kho 1', 'available_stock': 80}, 'quantity_bom':  6, 'quantity': 0, 'order': 2},

            {'is_group': true, 'group_order': 2, 'group_title': 'Lắp ráp', 'labor_bom': 2, 'labor': 0, 'uom_labor_data': {'id': 0, 'title': 'Giờ'}, 'tool_data': []},
            {'group_order': 2, 'product_data': {'id': 0, 'title': 'Mặt bàn lớn', 'available_amount': 15}, 'warehouse_data': {'id': 0, 'title': 'Kho 1', 'available_stock': 15}, 'quantity_bom': 1, 'quantity': 0, 'order': 1},
            {'group_order': 2, 'product_data': {'id': 1, 'title': 'Vít lớn 4mm', 'available_amount': 45}, 'warehouse_data': {'id': 0, 'title': 'Kho 1', 'available_stock': 30}, 'quantity_bom': 3, 'quantity': 0, 'order': 2},
        ]
        ProdOrderDataTableHandle.$tableMain.DataTable().clear().draw();
        ProdOrderDataTableHandle.$tableMain.DataTable().rows.add(tmp).draw();
        ProdOrderLoadDataHandle.loadDD(ProdOrderDataTableHandle.$tableMain);
        ProdOrderLoadDataHandle.loadSetCollapse();
        ProdOrderLoadDataHandle.loadTime();
        return true;
    };

    static loadAddDtbRow() {
        let dataAdd = {};
        let newRow = ProdOrderDataTableHandle.$tableMain.DataTable().row.add(dataAdd).draw().node();
        ProdOrderLoadDataHandle.loadDDInit(newRow);
        return true;
    };

    static loadAddDtbRowGr() {
        let order = ProdOrderDataTableHandle.$tableMain[0].querySelectorAll('.table-row-group').length + 1;
        let dataAdd = {
            "group_title": '',
            "is_group": true,
            'group_order': order,
        }
        let newRow = ProdOrderDataTableHandle.$tableMain.DataTable().row.add(dataAdd).draw().node();
        $(newRow).find('td:eq(1)').attr('colspan', 2);
        return true;
    };

    static loadSetCollapse() {
        for (let child of ProdOrderDataTableHandle.$tableMain[0].querySelectorAll('.cl-child')) {
            if (child.getAttribute('data-row')) {
                let dataRow = JSON.parse(child.getAttribute('data-row'));
                let row = child.closest('tr');
                let cls = '';
                if (dataRow?.['group_order']) {
                    cls = 'cl-' + String(dataRow?.['group_order']);
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
                    ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [dataRow?.['product_data']]);
                }
                if (row.querySelector('.table-row-uom')) {
                    ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')), [dataRow?.['uom_data']]);
                }
                if (row.querySelector('.table-row-warehouse')) {
                    ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-warehouse')), [dataRow?.['warehouse_data']]);
                }
                if (row.querySelector('.table-row-tool')) {
                    ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-tool')), dataRow?.['tool_data']);
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

    static loadDDInit(row) {
        if (row.querySelector('.table-row-item')) {
            ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')));
        }
        if (row.querySelector('.table-row-uom')) {
            ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')));
        }
        if (row.querySelector('.table-row-warehouse')) {
            ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-warehouse')));
        }
        if (row.querySelector('.table-row-tool')) {
            ProdOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-tool')));
        }
        return true;
    };

    static loadTime() {
        let time = 0;
        for (let eleLabor of ProdOrderDataTableHandle.$tableMain[0].querySelectorAll('.table-row-labor')) {
            time += parseInt(eleLabor.innerHTML);
        }
        ProdOrderLoadDataHandle.$time.empty().html(`${time} Giờ`);
        return true;
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
                    row.querySelector('.table-row-labor').innerHTML = dataRow?.['labor_bom'] * multi;
                }
                if (row.querySelector('.table-row-quantity')) {
                    row.querySelector('.table-row-quantity').innerHTML = dataRow?.['quantity_bom'] * multi;
                }
            }
        });
        return true;
    };

}

// DataTable
class ProdOrderDataTableHandle {
    static $tableMain = $('#table_production_order');

    static dataTableMain(data) {
        let multi = 1;
        if (ProdOrderLoadDataHandle.$quantity) {
            multi = parseInt(ProdOrderLoadDataHandle.$quantity.val());
        }
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
                        if (row?.['is_group'] === true) {
                            let target = ".cl-" + String(row?.['group_order']);
                            return `<button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-xs table-row-group cl-parent" 
                                        data-bs-toggle="collapse"
                                        data-bs-target="${target}"
                                        data-bs-placement="top"
                                        aria-expanded="true"
                                        aria-controls="newGroup"
                                        data-group-order="${row?.['group_order']}"
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
                        if (row?.['is_group'] === true) {
                            return `<b class="table-row-group-title">${row?.['group_title']}</b>`;
                        }
                        return `<select class="form-select table-row-item"></select>`;
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        return `<select class="form-select table-row-uom" data-url="${ProdOrderLoadDataHandle.$urls.attr('data-md-uom')}" data-method="GET" data-keyResp="unit_of_measure"></select>`;
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        return `<span class="table-row-quantity">${row?.['quantity_bom'] * multi}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '15%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        return `<select class="form-select table-row-warehouse" data-url="${ProdOrderLoadDataHandle.$urls.attr('data-md-warehouse')}" data-method="GET" data-keyResp="warehouse_list"></select>`;
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        return `<span class="table-row-stock">${row?.['warehouse_data']?.['available_stock'] ? row?.['warehouse_data']?.['available_stock'] : 0}</span>`;
                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        return `<span class="table-row-available">${row?.['product_data']?.['available_amount'] ? row?.['product_data']?.['available_amount'] : 0}</span>`;
                    }
                },
                {
                    targets: 7,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return `<span class="table-row-labor">${row?.['labor_bom'] * multi}</span><span class="table-row-uom-labor"> ${row?.['uom_labor_data']?.['title']}</span>`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 8,
                    width: '18%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
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
}

// Submit Form
class ProdOrderSubmitHandle {

    static setupDataSubmit(_form) {};
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
    }

    static filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }

}
