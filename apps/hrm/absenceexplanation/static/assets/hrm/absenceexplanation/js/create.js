$(document).ready(function () {
    WFRTControl.setWFInitialData('absenceexplanation');

    UsualLoadPageFunction.LoadDate({element: pageElements.$createDateEle, auto_load: true, empty: false})
    UsualLoadPageFunction.LoadDate({element: pageElements.$dateEle, empty: true})
    AbsenceExplanationPageFunction.loadEmployee();

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