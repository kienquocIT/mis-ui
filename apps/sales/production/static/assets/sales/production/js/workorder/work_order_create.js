$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_work_order');
        WorkOrderLoadDataHandle.loadInitPage();

        WorkOrderLoadDataHandle.$boxOpp.on('change', function () {
            WorkOrderLoadDataHandle.loadDataByOpportunity();
        });

        WorkOrderLoadDataHandle.$btnSaveProd.on('click', function () {
            WorkOrderLoadDataHandle.loadSaveProduct();
        });

        WorkOrderDataTableHandle.$tableMain.on('change', '.table-row-item', function () {
            let row = this.closest('tr');
            WorkOrderLoadDataHandle.loadChangeProduct(row);
            // store data
            WorkOrderStoreHandle.storeRow(row);
        });

        WorkOrderDataTableHandle.$tableMain.on('change', '.table-row-uom', function () {
            let row = this.closest('tr');
            // store data
            WorkOrderStoreHandle.storeRow(row);
        });

        WorkOrderDataTableHandle.$tableMain.on('change', '.table-row-warehouse', function () {
            let row = this.closest('tr');
            WorkOrderLoadDataHandle.loadChangeWH(row);
            // store data
            WorkOrderStoreHandle.storeRow(row);
        });

        WorkOrderDataTableHandle.$tableMain.on('change', '.check-all-wh', function () {
            let row = this.closest('tr');
            if (row.querySelector('.table-row-warehouse') && row.querySelector('.table-row-stock') && row.querySelector('.table-row-available')) {
                row.querySelector('.table-row-stock').innerHTML = 0;
                row.querySelector('.table-row-available').innerHTML = 0;
                if (this.checked === true) {
                    row.querySelector('.table-row-warehouse').setAttribute('disabled', 'true');
                    WorkOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-warehouse')), []);
                    WorkOrderLoadDataHandle.loadChangeWH(row, 1);
                }
                if (this.checked === false) {
                    row.querySelector('.table-row-warehouse').removeAttribute('disabled');
                }
            }
            // store data
            WorkOrderStoreHandle.storeRow(row);
        });

// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            let result = WorkOrderSubmitHandle.setupDataSubmit(_form);
            if (result === false) {
                return false;
            }
            let submitFields = [
                'title',
                'bom_id',
                'bom_data',
                'opportunity_id',
                'opportunity_data',
                'employee_inherit_id',
                'employee_inherit_data',
                'product_id',
                'product_data',
                'quantity',
                'uom_id',
                'uom_data',
                'warehouse_id',
                'warehouse_data',
                'sale_order_id',
                'sale_order_data',
                'status_production',
                'date_start',
                'date_end',
                'group_id',
                'group_data',
                'time',
                'task_data',
                'gr_remain_quantity',
            ]
            if (_form.dataForm) {
                WorkOrderCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        });



    });
});
