$(document).ready(function () {

    // load Cities SelectBox
    function loadCities() {
        $("#shipping-district option:selected").prop("selected", false);
        $("#shipping-ward option:selected").prop("selected", false);
        let ele = $('#shipping-city');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected>---</option>`)
                    if (data.hasOwnProperty('cities') && Array.isArray(data.cities)) {
                        data.cities.map(function (item) {
                            ele.append(`<option data-country-id="` + item.country_id + `" value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }
    loadCities();

    // load Districts SelectBox
    function loadDistricts() {
        let ele = $('#shipping-district');
        let url = ele.attr('data-url').replace('pk', $('#shipping-city').val())
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected>---</option>`)
                    if (data.hasOwnProperty('districts') && Array.isArray(data.districts)) {
                        data.districts.map(function (item) {
                            ele.append(`<option data-city-id="` + item.city_id + `" value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    // load Wards SelectBox
    function loadWards() {
        let ele = $('#shipping-ward');
        let url = ele.attr('data-url').replace('pk', $('#shipping-district').val())
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected>---</option>`)
                    if (data.hasOwnProperty('wards') && Array.isArray(data.wards)) {
                        data.wards.map(function (item) {
                            ele.append(`<option data-district-id="` + item.district_id + `" value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    $('#shipping-city').on('change', function () {
        loadDistricts();
        $('#shipping-ward').html('<option value="" selected>---</option>');
    })

    $('#shipping-district').on('change', function () {
        loadWards();
    })

    $('#save-changes-modal-shipping-address').on('click', function () {
        try {
            let detail_shipping_address = $('#detail-modal-shipping-address').val();
            let city = $('#shipping-city').find(`option:selected`).text();
            let district = $('#shipping-district').find(`option:selected`).text();
            let ward = $('#shipping-ward').find(`option:selected`).text();

            let shipping_address = '';
            if (city !== '' && district !== '' && detail_shipping_address !== '') {
                if (ward === '') {
                    shipping_address = detail_shipping_address + ', ' + district + ', ' + city;
                } else {
                    shipping_address = detail_shipping_address + ', ' + ward + ', ' + district + ', ' + city;
                }

                $('#modal-shipping-address').modal('hide');
                $('#detail-modal-shipping-address').val('');
            } else {
                $.fn.notifyPopup({description: "Missing address information!"}, 'failure');
            }

            if (shipping_address !== '') {
                let is_default = '';
                if ($('#make-default-shipping-address').prop('checked') === true) {
                    is_default = 'checked';
                }

                $('#list-shipping-address').append(
                    `<div class="form-check ml-5 mb-2">
                        <input class="form-check-input" type="radio" name="shippingaddressRadio" ` + is_default +`>
                        <label>` + shipping_address + `</label>
                        <a href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                    </div>`
                )
            }
        } catch (error) {
        }
    })

    $('#save-changes-modal-billing-address').on('click', function () {
    try {
        let acc_name = $('#select-box-account-name').find(`option:selected`).text();
        let email_address = $('#inp-email-address').val();
        let tax_code = $('#inp-tax-code-address').val();

        let account_address = $('#select-box-address').find('option:selected').val();
        if ($('#select-box-address').is(':hidden')) {
            account_address = $('#edited-billing-address').val()
        }

        let billing_address = '';
        if (email_address !== '' && tax_code !== '' && account_address !== '0') {
            billing_address = acc_name + ', ' + account_address + ' (email: ' + email_address + ', tax code: ' + tax_code + ')';
            $('#modal-billing-address').modal('hide');
        } else {
            $.fn.notifyPopup({description: "Missing address information!"}, 'failure');
        }

        if (billing_address !== '') {
            let is_default = '';
            if ($('#make-default-billing-address').prop('checked') === true) {
                is_default = 'checked';
            }
            $('#list-billing-address').append(
                `<div class="form-check ml-5">
                    <input class="form-check-input" type="radio" name="billingaddressRadio" ` + is_default + `>
                    <label>` + billing_address + `</label>
                    <a href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                </div>`
            )

        }
    } catch (error) {
        $.fn.notifyPopup({description: "No address information!"}, 'failure');
    }
})
})
