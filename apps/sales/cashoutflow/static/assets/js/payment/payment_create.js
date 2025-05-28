$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    // call load page
    PaymentEventHandler.InitPageEven()
    UsualLoadPageFunction.AutoLoadCurrentEmployee({element: pageElements.$employee_created})
    UsualLoadPageFunction.LoadDate({element: pageElements.$date_created, empty: false})
    const {
        create_open, opp_id, opp_title, opp_code,
        process_id, process_title, process_stage_app_id, process_stage_app_title,
        inherit_id, inherit_title
    } = $x.fn.getManyUrlParameters([
        'create_open', 'opp_id', 'opp_title', 'opp_code',
        'process_id', 'process_title', 'process_stage_app_id', 'process_stage_app_title',
        'inherit_id', 'inherit_title'
    ])
    const group$ = $('#bastion-space')
    if (create_open) {
        const data_inherit = [{
            "id": inherit_id || '',
            "full_name": inherit_title || '',
            "selected": true,
        }];
        const data_opp = [{
            "id": opp_id || '',
            "title": opp_title || '',
            "code": opp_code || '',
            "selected": true,
        }];
        const data_process = [{
            "id": process_id || '',
            "title": process_title || '',
            "selected": true,
        }];
        const data_process_stage_app = [{
            "id": process_stage_app_id || '',
            "title": process_stage_app_title || '',
            'selected': true,
        }];
        new $x.cls.bastionField({
            list_from_app: "cashoutflow.payment.create",
            app_id: "1010563f-7c94-42f9-ba99-63d5d26a1aca",
            mainDiv: group$,
            oppEle: group$.find('select[name=opportunity_id]'),
            prjEle: group$.find('select[name=project_id]'),
            empInheritEle: group$.find('select[name=employee_inherit_id]'),
            processEle: group$.find('select[name=process]'),
            processStageAppEle$: group$.find('select[name=process_stage_app]'),
            data_opp: data_opp,
            data_inherit: data_inherit,
            data_process: data_process,
            data_process_stage_app: data_process_stage_app,
        }).init();

        PaymentHandler.LoadPageActionWithParams(opp_id)
    }
    else {
        new $x.cls.bastionField({
            list_from_app: "cashoutflow.payment.create",
            app_id: "1010563f-7c94-42f9-ba99-63d5d26a1aca",
            mainDiv: group$,
            oppEle: group$.find('select[name=opportunity_id]'),
            prjEle: group$.find('select[name=project_id]'),
            empInheritEle: group$.find('select[name=employee_inherit_id]'),
            processEle: group$.find('select[name=process]'),
            processStageAppEle$: group$.find('select[name=process_stage_app]'),
        }).init();
    }
    PaymentPageFunction.LoadQuotation()
    PaymentPageFunction.LoadSaleOrder()
    PaymentPageFunction.LoadSupplier()
    PaymentPageFunction.LoadEmployee()
    PaymentPageFunction.LoadTableBankAccount()
    PaymentPageFunction.DrawLineDetailTable()
    PaymentPageFunction.DrawTablePlan()
    WFRTControl.setWFInitialData('payment')

    let form_validator = $('#form-create-payment').validate({
        submitHandler: function (form) {
            let form_data = PaymentHandler.CombinesData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [])
});