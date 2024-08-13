$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    const urlParams = new URLSearchParams(window.location.search);

    let sale_code_mapped= urlParams.get('sale_code_mapped');
    let type= urlParams.get('type');
    let quotation_object= urlParams.get('quotation_object');
    let sale_order_object= urlParams.get('sale_order_object');

    sale_code_mapped = sale_code_mapped !== 'undefined' ? JSON.parse(decodeURIComponent(sale_code_mapped)) : null;
    type = type !== 'undefined' ? JSON.parse(decodeURIComponent(type)) : null;
    quotation_object = quotation_object !== 'undefined' ? JSON.parse(decodeURIComponent(quotation_object)) : null;
    sale_order_object = sale_order_object !== 'undefined' ? JSON.parse(decodeURIComponent(sale_order_object)) : null;

    new AdvancePaymentHandle().load(sale_code_mapped, type, quotation_object, sale_order_object);
    WFRTControl.setWFInitialData('advancepayment', 'POST')

    // SUBMIT FORM CREATE ADVANCE PAYMENT
    $('#form-create-advance').submit(function (event) {
        event.preventDefault();
        let form = new AdvancePaymentHandle().combinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
});
