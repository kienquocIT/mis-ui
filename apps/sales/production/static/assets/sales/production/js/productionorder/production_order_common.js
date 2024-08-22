// Load data
class ProdOrderLoadDataHandle {
    static $form = $('#frm_production_order');
    static $boxType = $('#box-type');
    static $boxStatus = $('#box-status');
    static $boxProd = $('#box-product');
    static $boxUOM = $('#box-uom');
    static $boxWH = $('#box-warehouse');
    static $boxSO = $('#box-so');
    static $boxGroup = $('#box-group');
    static dataType = [
        {'id': 0, 'title': 'Production'}, {'id': 1, 'title': 'Assembly'}, {'id': 2, 'title': 'Disassembly'}
    ]
    static dataStatus = [
        {'id': 0, 'title': 'Planned'}
    ]

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
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxType, ProdOrderLoadDataHandle.dataType);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxStatus, ProdOrderLoadDataHandle.dataStatus);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxProd);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxUOM);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxWH);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxSO);
        ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxGroup);
        // init date picker
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
    }

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
                    width: '',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return ``;
                    }
                },
                {
                    targets: 1,
                    width: '',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    targets: 2,
                    width: '',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    targets: 3,
                    width: '',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    targets: 4,
                    width: '',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    targets: 5,
                    width: '',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    targets: 6,
                    width: '',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    targets: 7,
                    width: '',
                    render: (data, type, row) => {
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
