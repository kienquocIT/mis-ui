// Load data
class ProdReportLoadDataHandle {
    static $form = $('#frm_production_report');
    static $title = $('#title');
    static $dateCreated = $('#date-created');
    static $boxType = $('#box-report-type');
    static $quantity = $('#quantity');
    static $quantityFinished = $('#quantity-finished');
    static $quantityNG = $('#quantity-ng');
    static $boxProductionOrder = $('#box-production-order');
    static $boxWorkOrder = $('#box-work-order');
    static $product = $('#product');
    static $uom= $('#uom');
    static $warehouse = $('#warehouse');
    static $trans = $('#app-trans-factory');
    static $urls = $('#app-urls-factory');
    static dataType = [
        {'id': 0, 'title': ProdReportLoadDataHandle.$trans.attr('data-for-po')},
        {'id': 1, 'title': ProdReportLoadDataHandle.$trans.attr('data-for-wo')},
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
        ProdReportLoadDataHandle.$dateCreated.val(ProdReportCommonHandle.getCurrentDate());
        // Num
        ProdReportLoadDataHandle.loadEventValidNum(ProdReportLoadDataHandle.$quantityFinished[0]);
        ProdReportLoadDataHandle.loadEventValidNum(ProdReportLoadDataHandle.$quantityNG[0]);
        // select2
        ProdReportLoadDataHandle.loadInitS2(ProdReportLoadDataHandle.$boxType, ProdReportLoadDataHandle.dataType);
        ProdReportLoadDataHandle.loadInitS2(ProdReportLoadDataHandle.$boxProductionOrder, [], {'system_status': 3}, null, false, {'res1': 'code', 'res2': 'title'});
        ProdReportLoadDataHandle.loadInitS2(ProdReportLoadDataHandle.$boxWorkOrder, [], {'system_status': 3}, null, false, {'res1': 'code', 'res2': 'title'});
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
    };

    static loadCustomAreaByType() {
        for (let eleArea of ProdReportLoadDataHandle.$form[0].querySelectorAll('.custom-area')) {
            eleArea.setAttribute('hidden', 'true');
        }
        let idAreaShow = 'custom-area-' + String(ProdReportLoadDataHandle.$boxType.val());
        document.getElementById(idAreaShow).removeAttribute('hidden');
        return true;
    };

    static loadChangeProductionWorkOrder() {
        let data = SelectDDControl.get_data_from_idx(ProdReportLoadDataHandle.$boxProductionOrder, ProdReportLoadDataHandle.$boxProductionOrder.val());
        if (ProdReportLoadDataHandle.$boxType.val() === "1") {
            data = SelectDDControl.get_data_from_idx(ProdReportLoadDataHandle.$boxWorkOrder, ProdReportLoadDataHandle.$boxWorkOrder.val());
        }
        if (data) {
            if (data?.['product_data']) {
                ProdReportLoadDataHandle.$product.val(data?.['product_data']?.['title']);
                ProdReportLoadDataHandle.$product.attr('data-detail', JSON.stringify(data?.['product_data']))
            }
            if (data?.['quantity']) {
                ProdReportLoadDataHandle.$quantity.val(data?.['quantity']);
            }
            if (data?.['uom_data']) {
                ProdReportLoadDataHandle.$uom.val(data?.['uom_data']?.['title']);
                ProdReportLoadDataHandle.$uom.attr('data-detail', JSON.stringify(data?.['uom_data']))
            }
            if (data?.['warehouse_data']) {
                ProdReportLoadDataHandle.$warehouse.val(data?.['warehouse_data']?.['title']);
                ProdReportLoadDataHandle.$warehouse.attr('data-detail', JSON.stringify(data?.['warehouse_data']))
            }
            for (let task of data?.['task_data']) {
                task['quantity_actual'] = task?.['quantity'];
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

    // Detail
    static loadDetail(data) {
        ProdReportLoadDataHandle.$title.val(data?.['title']);
        ProdReportLoadDataHandle.loadInitS2(ProdReportLoadDataHandle.$boxType, ProdReportLoadDataHandle.dataType);
        ProdReportLoadDataHandle.$boxType.val(data?.['production_report_type']).change();
        ProdReportLoadDataHandle.loadInitS2(ProdReportLoadDataHandle.$boxProductionOrder, [data?.['production_order_data']], {'system_status': 3});
        ProdReportLoadDataHandle.loadInitS2(ProdReportLoadDataHandle.$boxWorkOrder, [data?.['work_order_data']], {'system_status': 3});
        if (data?.['product_data']) {
            ProdReportLoadDataHandle.$product.val(data?.['product_data']?.['title']);
            ProdReportLoadDataHandle.$product.attr('data-detail', JSON.stringify(data?.['product_data']))
        }
        ProdReportLoadDataHandle.$quantity.val(data?.['quantity']);
        if (data?.['uom_data']) {
            ProdReportLoadDataHandle.$uom.val(data?.['uom_data']?.['title']);
            ProdReportLoadDataHandle.$uom.attr('data-detail', JSON.stringify(data?.['uom_data']))
        }
        if (data?.['warehouse_data']) {
            ProdReportLoadDataHandle.$warehouse.val(data?.['warehouse_data']?.['title']);
            ProdReportLoadDataHandle.$warehouse.attr('data-detail', JSON.stringify(data?.['warehouse_data']))
        }
        ProdReportLoadDataHandle.$quantityFinished.val(data?.['quantity_finished']);
        ProdReportLoadDataHandle.$quantityNG.val(data?.['quantity_ng']);
        let date_created = '';
        if (data?.['date_created']) {
            date_created = data?.['date_created'];
            ProdReportLoadDataHandle.$dateCreated.val(moment(date_created).format('DD/MM/YYYY'));
        }
        ProdReportLoadDataHandle.loadAddDtbRows(data?.['task_data']);
        ProdReportLoadDataHandle.loadReadonlyDisabled();
        return true;
    };

    static loadReadonlyDisabled() {
        if (ProdReportLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            ProdReportDataTableHandle.$tableMain.DataTable().rows().every(function () {
                let row = this.node();
                for (let ele of row.querySelectorAll('.table-row-item')) {
                    ele.setAttribute('readonly', 'true');
                }
                for (let ele of row.querySelectorAll('.table-row-uom')) {
                    ele.setAttribute('readonly', 'true');
                }
                for (let ele of row.querySelectorAll('.table-row-labor-actual')) {
                    ele.setAttribute('readonly', 'true');
                }
                for (let ele of row.querySelectorAll('.table-row-quantity-actual')) {
                    ele.setAttribute('readonly', 'true');
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
        ProdReportDataTableHandle.$tableMain.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
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
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return `<b class="table-row-task-title">${row?.['task_title']}</b>`;
                        }
                        return `<select class="form-select table-row-item" data-url="${ProdReportLoadDataHandle.$urls.attr('data-md-product')}" data-method="GET" data-keyResp="product_sale_list" readonly></select>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return ``;
                        }
                        return `<select class="form-select table-row-uom" data-url="${ProdReportLoadDataHandle.$urls.attr('data-md-uom')}" data-method="GET" data-keyResp="unit_of_measure" readonly></select>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return `<span class="table-row-labor">${row?.['quantity'] ? row?.['quantity'] : 0}</span><span class="table-row-uom-labor"> ${row?.['uom_data']?.['title']}</span>`;
                        }
                        return `<span class="table-row-quantity">${row?.['quantity'] ? row?.['quantity'] : 0}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        if (row?.['is_task'] === true) {
                            return `<input type="text" class="form-control valid-number table-row-labor-actual" value="${row?.['quantity_actual']}">`;
                        }
                        return `<input type="text" class="form-control valid-number table-row-quantity-actual" value="${row?.['quantity_actual']}">`;
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
                    ProdReportCommonHandle.filterFieldList(submitFields, dataRow);
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
class ProdReportSubmitHandle {

    static setupTask() {
        let result = [];
        ProdReportDataTableHandle.$tableMain.DataTable().rows().every(function () {
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
        if (ProdReportLoadDataHandle.$boxType.val()) {
            if (ProdReportLoadDataHandle.$boxProductionOrder.val() || ProdReportLoadDataHandle.$boxWorkOrder.val()) {
                _form.dataForm['production_report_type'] = parseInt(ProdReportLoadDataHandle.$boxType.val());
                if (ProdReportLoadDataHandle.$boxType.val() === "0") {
                    _form.dataForm['production_order_id'] = ProdReportLoadDataHandle.$boxProductionOrder.val();
                    let data = SelectDDControl.get_data_from_idx(ProdReportLoadDataHandle.$boxProductionOrder, ProdReportLoadDataHandle.$boxProductionOrder.val());
                    if (data) {
                        _form.dataForm['production_order_data'] = data;
                    }
                }
                if (ProdReportLoadDataHandle.$boxType.val() === "1") {
                    _form.dataForm['work_order_id'] = ProdReportLoadDataHandle.$boxWorkOrder.val();
                    let data = SelectDDControl.get_data_from_idx(ProdReportLoadDataHandle.$boxWorkOrder, ProdReportLoadDataHandle.$boxWorkOrder.val());
                    if (data) {
                        _form.dataForm['work_order_data'] = data;
                    }
                }
                if (ProdReportLoadDataHandle.$product.attr('data-detail')) {
                    let data = JSON.parse(ProdReportLoadDataHandle.$product.attr('data-detail'));
                    if (data) {
                        _form.dataForm['product_id'] = data?.['id'];
                        _form.dataForm['product_data'] = data;
                    }
                }
                if (ProdReportLoadDataHandle.$quantity.val()) {
                    _form.dataForm['quantity'] = parseFloat(ProdReportLoadDataHandle.$quantity.val());
                }
                if (ProdReportLoadDataHandle.$uom.attr('data-detail')) {
                    let data = JSON.parse(ProdReportLoadDataHandle.$uom.attr('data-detail'));
                    if (data) {
                        _form.dataForm['uom_id'] = data?.['id'];
                        _form.dataForm['uom_data'] = data;
                    }
                }
                if (ProdReportLoadDataHandle.$warehouse.attr('data-detail')) {
                    let data = JSON.parse(ProdReportLoadDataHandle.$warehouse.attr('data-detail'));
                    if (data) {
                        _form.dataForm['warehouse_id'] = data?.['id'];
                        _form.dataForm['warehouse_data'] = data;
                    }
                }
                if (ProdReportLoadDataHandle.$quantityFinished.val()) {
                    _form.dataForm['quantity_finished'] = parseFloat(ProdReportLoadDataHandle.$quantityFinished.val());
                    _form.dataForm['gr_remain_quantity'] = parseFloat(ProdReportLoadDataHandle.$quantityFinished.val());
                    if (_form.dataForm['quantity_finished'] <= 0) {
                        $.fn.notifyB({description: ProdReportLoadDataHandle.$trans.attr('data-required-quantity-finished')}, 'failure');
                        return false;
                    }
                }
                if (ProdReportLoadDataHandle.$quantityNG.val()) {
                    _form.dataForm['quantity_ng'] = parseFloat(ProdReportLoadDataHandle.$quantityNG.val());
                }
                ProdReportStoreHandle.storeAll();
                _form.dataForm['task_data'] = ProdReportSubmitHandle.setupTask();

            }
        }
        return _form.dataForm;
    };
}

// Common
class ProdReportCommonHandle {

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
    };
}
