$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_production_order');
        ProdOrderLoadDataHandle.loadInitPage();

        // WFRTControl.setWFInitialData('productionorder', formSubmit.attr('data-method'));


// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            ContractSubmitHandle.setupDataSubmit(_form);
            let submitFields = []
            if (_form.dataForm) {
                ContractCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        });



    });
});
