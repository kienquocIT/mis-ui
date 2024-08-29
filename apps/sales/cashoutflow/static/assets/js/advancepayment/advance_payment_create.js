$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    const urlParams = new URLSearchParams(window.location.search);
    let opportunity_obj= urlParams.get('sale_code_mapped');
    let quotation_object= urlParams.get('quotation_object');
    let sale_order_object= urlParams.get('sale_order_object');
    let type= urlParams.get('type');

    opportunity_obj = opportunity_obj !== 'undefined' ? JSON.parse(decodeURIComponent(opportunity_obj)) : null;
    quotation_object = quotation_object !== 'undefined' ? JSON.parse(decodeURIComponent(quotation_object)) : null;
    sale_order_object = sale_order_object !== 'undefined' ? JSON.parse(decodeURIComponent(sale_order_object)) : null;
    type = type !== 'undefined' ? JSON.parse(decodeURIComponent(type)) : null;

    APHandle.LoadPage(opportunity_obj, quotation_object, sale_order_object, type);
    WFRTControl.setWFInitialData('advancepayment', 'POST')

    // SUBMIT FORM CREATE ADVANCE PAYMENT
    $('#form-create-advance').submit(function (event) {
        event.preventDefault();
        let form = APHandle.CombinesData($(this));
        if (form) {
            WFRTControl.callWFSubmitForm(form);
        }
    })
});
