$(document).ready(function () {
    UsualLoadPageFunction.LoadDate({element: pageElements.$dateEle, empty: true})

    AbsenceExplanationPageFunction.loadDetailAbsenceExplanation('update');
    const $form = $('#frm_absence_explanation_detail');
    $form.validate({
        submitHandler: function (form) {
            const form_data = AbsenceExplanationLoadDataHandle.combineData(form);
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    });
});