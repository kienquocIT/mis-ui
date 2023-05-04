"use strict";

function loadDetailQuotation(data) {
    if (data.title) {
        document.getElementById('quotation-create-title').value = data.title
    }
    if (data.opportunity) {
        $('#select-box-quotation-create-opportunity').append(
            `<option class="data-detail" value="${data.opportunity.id}" selected>${data.opportunity.title}</option>`
        )
    }
    if (data.customer) {
        $('#select-box-quotation-create-customer').append(
            `<option class="data-detail" value="${data.customer.id}" selected>${data.customer.title}</option>`
        )
    }
    if (data.contact) {
        $('#select-box-quotation-create-contact').append(
            `<option class="data-detail" value="${data.contact.id}" selected>${data.contact.title}</option>`
        )
    }
    if (data.sale_person) {
        $('#select-box-quotation-create-sale-person').append(
            `<option class="data-detail" value="${data.sale_person.id}" selected>${data.sale_person.full_name}</option>`
        )
    }
    if (data.payment_term) {
        $('#select-box-quotation-create-payment-term').append(
            `<option class="data-detail" value="${data.payment_term.id}" selected>${data.payment_term.title}</option>`
        )
    }
}

$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_detail')

        // call ajax get info wf detail
        $.fn.callAjax($form.data('url'), 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        loadDetailQuotation(data);
                    }
                }
            )


    });
});
