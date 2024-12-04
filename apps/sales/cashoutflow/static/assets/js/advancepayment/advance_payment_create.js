$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    // get params
    const {opp_id, opp_title, opp_code} = $x.fn.getManyUrlParameters(['opp_id', 'opp_title', 'opp_code'])
    let opportunity = opp_id ? {
        'id': opp_id,
        'title': opp_title,
        'code': opp_code
    } : null

    const urlParams = new URLSearchParams(window.location.search)
    let quotation_json= urlParams.get('quotation_object')
    let quotation = quotation_json ? JSON.parse(decodeURIComponent(quotation_json)) : null
    let sale_order_json= urlParams.get('sale_order_object')
    let sale_order = sale_order_json ? JSON.parse(decodeURIComponent(sale_order_json)) : null
    if (opportunity) {
        opportunity['quotation'] = quotation
        opportunity['sale_order'] = sale_order
    }

    // call load page
    APHandle.LoadPage(opportunity, 'create');
    WFRTControl.setWFInitialData('advancepayment', 'POST')

    // SUBMIT FORM CREATE ADVANCE PAYMENT
    let form_validator = $('#form-create-advance').validate({
        submitHandler: function (form) {
            let form_data = APHandle.CombinesData(form, 'create');
            if (form_data) {
                WFRTControl.callWFSubmitForm(form_data);
            }
        }
    })
    AutoValidator.CustomValidator(form_validator, [
        {
            key: 'supplier_id',
            condition: (value, element) => {
                let conditions = [APTypeEle.val() === '1', value]
                return conditions.every(c => c)
            },
        },
    ])
});
