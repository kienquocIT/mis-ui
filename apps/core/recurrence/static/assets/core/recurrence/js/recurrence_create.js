$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_recurrence_create');
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

        RecurrenceLoadDataHandle.$boxDateMonthly.on('change', function () {
            RecurrenceLoadDataHandle.loadExecutionDate();
        });

        RecurrenceLoadDataHandle.$dateRecurrenceYearly.on('blur', function () {
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
            let result = RecurrenceSubmitHandle.setupDataSubmit(_form);
            if (result === false) {
                return false;
            }
            let submitFields = [
                'title',
                'application_id',
                'application_data',
                'app_code',
                'doc_template_id',
                'doc_template_data',
                'period',
                'repeat',
                'date_daily',
                'weekday',
                'monthday',
                'date_yearly',
                'date_start',
                'date_end',
                'date_next',
                'next_recurrences',
                'recurrence_status',
                'employee_inherit_id',
            ]
            if (_form.dataForm) {
                RecurrenceCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': _form.dataUrl,
                    'method': _form.dataMethod,
                    'data': _form.dataForm,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        setTimeout(() => {
                            window.location.replace(_form.dataUrlRedirect);
                        }, 2000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        }


    });
});
