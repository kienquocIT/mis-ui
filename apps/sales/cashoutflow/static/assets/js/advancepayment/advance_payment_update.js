$(document).ready(function () {
    APHandle.LoadPage()
    WFRTControl.setWFInitialData('advancepayment', 'PUT')
    APHandle.LoadDetailAP('update');

    // SUBMIT FORM UPDATE ADVANCE PAYMENT
    $('#form-detail-advance').submit(function (event) {
        event.preventDefault();
        let form = APHandle.CombinesData($(this), 'update');
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})