"use strict";

function loadConfig(data) {
    if (data.short_sale_config) {
        $('#is-choose-price-list')[0].checked = data.short_sale_config.is_choose_price_list;
        $('#is-input-price')[0].checked = data.short_sale_config.is_input_price;
        $('#is-discount-on-product')[0].checked = data.short_sale_config.is_discount_on_product;
        $('#is-discount-on-total')[0].checked = data.short_sale_config.is_discount_on_total;
    }
    if (data.long_sale_config) {
        $('#is-not-input-price')[0].checked = data.long_sale_config.is_not_input_price;
        $('#is-not-discount-on-product')[0].checked = data.long_sale_config.is_not_discount_on_product;
        $('#is-not-discount-on-total')[0].checked = data.long_sale_config.is_not_discount_on_total;
    }
}

function setupSubmit() {
    let result = {}
    result['short_sale_config'] = {
        'is_choose_price_list': $('#is-choose-price-list')[0].checked,
        'is_input_price': $('#is-input-price')[0].checked,
        'is_discount_on_product': $('#is-discount-on-product')[0].checked,
        'is_discount_on_total': $('#is-discount-on-total')[0].checked,
    }
    result['long_sale_config'] = {
        'is_not_input_price': $('#is-not-input-price')[0].checked,
        'is_not_discount_on_product': $('#is-not-discount-on-product')[0].checked,
        'is_not_discount_on_total': $('#is-not-discount-on-total')[0].checked,
    }
    return result
}

$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_config_create');

        // call ajax get info quotation config detail
        $.fn.callAjax($form.data('url'), 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    loadConfig(data)
                }
            }
        )

        // enable edit
        $('#btn-edit_quotation_config').on('click', function () {
            $(this)[0].setAttribute('hidden', true)
            $('#btn-create_quotation_config')[0].removeAttribute('hidden');
            $form.find('.disabled-but-edit').removeAttr('disabled');
        });

        // Submit form quotation + sale order
        $('#btn-create_quotation_config').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('frm_quotation_config_create');
            let _form = new SetupFormSubmit($('#frm_quotation_config_create'));
            let dataSubmit = setupSubmit();
            if (dataSubmit) {
                _form.dataForm['short_sale_config'] = dataSubmit.short_sale_config;
                _form.dataForm['long_sale_config'] = dataSubmit.long_sale_config;
            }
            let submitFields = [
                'short_sale_config',
                'long_sale_config',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }

            let csr = $("[name=csrfmiddlewaretoken]").val()
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });


    });
});
