// Load data
class ProdReportLoadDataHandle {
    static $form = $('#frm_production_order');
    static $title = $('#title');
    static $quantity = $('#quantity');
    static $quantityNG = $('#quantity-ng');
    static $uom = $('#uom');
    static $boxProductionOrder = $('#box-production-order');
    static $trans = $('#app-trans-factory');
    static $urls = $('#app-urls-factory');

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
        ProdReportLoadDataHandle.loadEventValidNum(ProdReportLoadDataHandle.$quantity[0]);
        ProdReportLoadDataHandle.loadEventValidNum(ProdReportLoadDataHandle.$quantityNG[0]);
        // select2
        ProdReportLoadDataHandle.loadInitS2(ProdReportLoadDataHandle.$boxProductionOrder, [], {'system_status': 3});
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
        ProdReportDataTableHandle.dataTableMain();
        // collapse
        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });
        // init WF
        // WFRTControl.setWFInitialData('productionorder', ProdOrderLoadDataHandle.$form.attr('data-method'));
    };

    static loadChangeProductionOrder() {
        let data = SelectDDControl.get_data_from_idx(ProdReportLoadDataHandle.$boxProductionOrder, ProdReportLoadDataHandle.$boxProductionOrder.val());
        if (data) {
            if (data?.['uom_data']?.['title']) {
                ProdReportLoadDataHandle.$uom.empty().html(data?.['uom_data']?.['title']);
            }
            ProdReportLoadDataHandle.loadAddDtbRows(data?.['task_data']);
        }
        return true;
    };

    static loadAddDtbRows(data) {
        ProdReportDataTableHandle.$tableMain.DataTable().clear().draw();
        ProdReportDataTableHandle.$tableMain.DataTable().rows.add(data).draw();
        ProdReportLoadDataHandle.loadDD(ProdReportDataTableHandle.$tableMain);
        ProdReportLoadDataHandle.loadSetCollapse();
        return true;
    };

    static loadSetCollapse() {
        for (let child of ProdReportDataTableHandle.$tableMain[0].querySelectorAll('.cl-child')) {
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
                    ProdReportLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [], {'general_product_types_mapped__is_material': true});
                    if (dataRow?.['product_data']) {
                        $.fn.callAjax2({
                                'url': ProdReportLoadDataHandle.$urls.attr('data-md-product'),
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
                                            ProdReportLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [data.product_sale_list[0]], {'general_product_types_mapped__is_material': true});
                                        }
                                    }
                                }
                            }
                        )
                    }
                }
                if (row.querySelector('.table-row-uom')) {
                    ProdReportLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')));
                    if (dataRow?.['uom_data']) {
                        ProdReportLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')), [dataRow?.['uom_data']]);
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

    static loadReadonlyDisabled() {
        if (ProdOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            ProdOrderDataTableHandle.$tableMain.DataTable().rows().every(function () {
                let row = this.node();
                for (let ele of row.querySelectorAll('.table-row-item')) {
                    ele.setAttribute('disabled', 'true');
                }
                for (let ele of row.querySelectorAll('.table-row-uom')) {
                    ele.setAttribute('disabled', 'true');
                }
                for (let ele of row.querySelectorAll('.check-all-wh')) {
                    ele.setAttribute('disabled', 'true');
                }
                for (let ele of row.querySelectorAll('.table-row-warehouse')) {
                    ele.setAttribute('disabled', 'true');
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
class ProdReportDataTableHandle {
    static $tableMain = $('#table_production_report');

    static dataTableMain(data) {
        let multi = 1;
        ProdReportDataTableHandle.$tableMain.DataTableDefault({
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
                        return `<select class="form-select table-row-item" data-url="${ProdReportLoadDataHandle.$urls.attr('data-md-product')}" data-method="GET" data-keyResp="product_sale_list" disabled></select>`;
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return ``;
                        }
                        return `<select class="form-select table-row-uom" data-url="${ProdReportLoadDataHandle.$urls.attr('data-md-uom')}" data-method="GET" data-keyResp="unit_of_measure" disabled></select>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return `<span class="table-row-labor">${row?.['quantity'] ? row?.['quantity'] : 0}</span><span class="table-row-uom-labor"> ${row?.['uom_data']?.['title']}</span>`;
                        }
                        return `<span class="table-row-quantity">${row?.['quantity'] ? row?.['quantity'] : 0}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return `<input type="text" class="form-control valid-number table-row-labor-actual" value="0">`;
                        }
                        return `<input type="text" class="form-control valid-number table-row-quantity-actual" value="0">`;
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

}

// Store data
class ProdReportStoreHandle {

    static storeRow(row) {
        if (row.querySelector('.table-row-order')) {
            if (row.querySelector('.table-row-order').getAttribute('data-row')) {
                let dataRow = JSON.parse(row.querySelector('.table-row-order').getAttribute('data-row'));
                if (row.querySelector('.table-row-task')) {  // task
                    if (row.querySelector('.table-row-labor')) {
                        dataRow['quantity'] = parseFloat(row.querySelector('.table-row-labor').innerHTML);
                    }
                    if (row.querySelector('.table-row-labor-actual')) {
                        dataRow['quantity_actual'] = parseFloat(row.querySelector('.table-row-labor-actual').value);
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
                    if (row.querySelector('.table-row-quantity-actual')) {
                        dataRow['quantity_actual'] = parseFloat(row.querySelector('.table-row-quantity-actual').value);
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
                    'quantity',
                    'quantity_actual',
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
        ProdReportDataTableHandle.$tableMain.DataTable().rows().every(function () {
            let row = this.node();
            ProdReportStoreHandle.storeRow(row);
        });
        return true;
    };

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
            if (ProdOrderLoadDataHandle.$time.html()) {
                _form.dataForm['time'] = parseInt(ProdOrderLoadDataHandle.$time.html());
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
    }

    static filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }

}
