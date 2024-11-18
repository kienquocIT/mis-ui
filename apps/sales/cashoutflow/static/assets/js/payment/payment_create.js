$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    const urlParams = new URLSearchParams(window.location.search)
    let opportunity_json= urlParams.get('opp_mapped')
    let opportunity = opportunity_json ? JSON.parse(decodeURIComponent(opportunity_json)) : null
    let quotation_json= urlParams.get('quotation_object')
    let quotation = quotation_json ? JSON.parse(decodeURIComponent(quotation_json)) : null
    let sale_order_json= urlParams.get('sale_order_object')
    let sale_order = sale_order_json ? JSON.parse(decodeURIComponent(sale_order_json)) : null
    opportunity['quotation'] = quotation
    opportunity['sale_order'] = sale_order

    PaymentHandle.LoadPage(opportunity)
    WFRTControl.setWFInitialData('payment', 'POST')

    let form_validator = $('#form-create-payment').validate({
        submitHandler: function (form) {
            let form_data = PaymentHandle.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
});