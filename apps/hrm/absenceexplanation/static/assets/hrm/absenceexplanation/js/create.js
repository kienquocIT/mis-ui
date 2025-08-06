$(document).ready(function () {
    WFRTControl.setWFInitialData('hrmabsenceexplanation');

    AbsenceExplanationPageFunction.loadEmployee();
    AbsenceExplanationPageFunction.initDatePickers();

    const $form = $('#frm_create_absence_explanation');
    $form.validate({
        submitHandler: function (form) {
            const form_data = AbsenceExplanationLoadDataHandle.combineData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
})