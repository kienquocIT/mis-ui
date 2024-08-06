$(document).ready(function () {
    new AdvancePaymentHandle().load()
    WFRTControl.setWFInitialData('advancepayment', 'PUT')
    LoadDetailAP('update');

    // SUBMIT FORM UPDATE ADVANCE PAYMENT
    let pk = $.fn.getPkDetail();
    $('#form-detail-advance').submit(function (event) {
        event.preventDefault();
        let form = new AdvancePaymentHandle().combinesData($(this), true);
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
})