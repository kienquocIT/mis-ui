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


// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            WorkOrderSubmitHandle.setupDataSubmit(_form);
            let submitFields = [
                'title',
                'bom_id',
                'bom_data',
                'type_production',
                'product_id',
                'product_data',
                'quantity',
                'uom_id',
                'uom_data',
                'warehouse_id',
                'warehouse_data',
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
                ProdOrderCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        });



    });
});
