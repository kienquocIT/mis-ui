$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_recurrence_order');
        RecurrenceLoadDataHandle.loadInitPage();

        RecurrenceLoadDataHandle.$boxPeriod.on('change', function () {
            RecurrenceLoadDataHandle.loadChangeByPeriod();
        });

        RecurrenceLoadDataHandle.$boxApp.on('change', function () {
            RecurrenceLoadDataHandle.loadChangeApp();
        });

        RecurrenceLoadDataHandle.$boxPeriod.on('change', function () {
            RecurrenceLoadDataHandle.loadExecutionDate();
        });

        RecurrenceLoadDataHandle.$boxRepeat.on('change', function () {
            RecurrenceLoadDataHandle.loadChangeRepeat();
            RecurrenceLoadDataHandle.loadExecutionDate();
        });

        RecurrenceLoadDataHandle.$dateRecurrenceDaily.on('blur', function () {
            RecurrenceLoadDataHandle.loadExecutionDate();
        });

        RecurrenceLoadDataHandle.$boxDateWeekly.on('change', function () {
            RecurrenceLoadDataHandle.loadExecutionDate();
        });

        RecurrenceLoadDataHandle.$dateStart.on('blur', function () {
            RecurrenceLoadDataHandle.loadExecutionDate();
        });

        RecurrenceLoadDataHandle.$dateEnd.on('blur', function () {
            RecurrenceLoadDataHandle.loadExecutionDate();
        });


// SUBMIT FORM
        SetupFormSubmit.validate(formSubmit, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

        function submitHandlerFunc() {
            let _form = new SetupFormSubmit(formSubmit);
            let result = ProdOrderSubmitHandle.setupDataSubmit(_form);
            if (result === false) {
                return false;
            }
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
        }


    });
});
