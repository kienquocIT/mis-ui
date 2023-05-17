$(document).ready(function () {
    const city_list = JSON.parse($('#id-city-list').text());

    const item_unit_list = JSON.parse($('#id-unit-list').text());
    const item_unit_dict = item_unit_list.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});

    $('.select2').select2();
    $(document).on('change', '.cbFixedPrice', function () {
        let divNotFixed = $(this).closest('div .row').find('.divNotFixed')
        if ($(this).is(':checked')) {
            divNotFixed.addClass('hidden');
        } else {
            divNotFixed.removeClass('hidden');
            let text = $('#chooseUnit').find('option:selected').text();
            $(this).closest('.formulaCondition').find('.displayUoMGroup').text(text);
        }
    })

    function loadCities(city_list) {
        let ele = $('#chooseCityDefault');
        ele.append(`<option value="1">Other cities</option>`)
        city_list.map(function (item) {
            ele.append(`<option value="` + item.id + `"><span>` + item.title + `</span></option>`);
        })
    }

    function removeClass(eleThreshold) {
        eleThreshold.removeClass('mask-money');
        eleThreshold.removeAttr('data-return-type');
        eleThreshold.attr('type', 'number');
    }

    //onchange select box choose Unit Of Measure Group
    $(document).on('change', '#chooseUnit', function () {
        let ele = $('.spanUnit');
        let inpUnit = $('.inpUnit');
        inpUnit.val($(this).find('option:selected').text());
        $('.displayUoMGroup').text($(this).find('option:selected').text());

        let eleThreshold = $('.inpThreshold')
        eleThreshold.attr('value', '')
        ele.text(item_unit_dict[$(this).val()].measure)
        removeClass(eleThreshold)
        switch ($(this).find('option:selected').text()) {
            case 'price':
                eleThreshold.addClass('mask-money');
                eleThreshold.attr('data-return-type', 'number');
                eleThreshold.attr('type', 'text');
                break;
        }
        $.fn.initMaskMoney2();
    })

    function loadCurrency() {
        let ele = $('#chooseCurrency');
        let frm = new SetupFormSubmit(ele);
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('currency_list')) {
                    ele.append(`<option></option>`);
                    resp.data.currency_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `"><span>` + item.title + `</span></option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    loadCurrency();

    // Add new Formula for condition
    $(document).on('click', '.btnAddFormula', function () {
        $('.inpUnit').attr('value', $('#chooseUnit').find('option:selected').text());
        let html = $('#ifInCondition').html();
        $(this).closest('.line-condition').append(html);
        $(this).remove();

    })

    //Add new condition
    $(document).on('click', '#btnAddCondition', function () {
        $('.inpUnit').attr('value', $('#chooseUnit').find('option:selected').text());
        let html = $('#newCondition').html();
        $('.condition-content').append(html);
        $('.condition-content').children().last().find('.chooseCity').select2();
        $('.condition-content').children().last().find('.chooseCity').addClass('select2');
    })

    // Delete condition
    $(document).on('click', '.btnDelCondition', function () {
        $(this).closest('.line-condition').remove();
    })

    //Delete Formula for Condition
    $(document).on('click', '.btnDelFormula', function () {
        $(this).closest('.formulaCondition').remove();
    })

    // onchange cost method
    $(document).on('change', '.ratioMethod', function () {
        switch ($(this).val()) {
            case '0':
                $('.condition-content').addClass('hidden');
                $('#inputAmount').prop('disabled', false);
                break;
            case '1':
                $('.condition-content').removeClass('hidden');
                $('#inputAmount').prop('disabled', true);
                loadCities(city_list);
                break;
        }
    })

    const frmCreateShipping = $('#frmCreateShipping')
    frmCreateShipping.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        frm.dataForm['fixed_price'] = $('[name="fixed_price"]').valCurrency();
        frm.dataForm['is_active'] = !!$('#inputActive').is(':checked');
        let is_submit = true;
        let arr_location = []
        let data_location = []
        switch (frm.dataForm['cost_method']) {
            case "0":
                frm.dataForm['formula_condition'] = [];
                break;
            case "1":
                delete frm.dataForm['fixed_price'];
                let condition = [];
                let ele_condition = $('.condition-content .line-condition');
                ele_condition.each(function () {
                    data_location = $(this).find('.chooseCity').val();
                    let locations = $(this).find('.chooseCity').val();
                    if (locations.includes('1') && locations.length > 1) {
                        is_submit = false;
                        $.fn.notifyPopup({description: "location: can't select another city while select Other cities"}, 'failure');
                    } else {
                        let ele_formula = $(this).find('.formulaCondition');
                        let formula = []
                        ele_formula.each(function () {
                            let amount_extra = 0;
                            let threshold = $(this).find(".inpThreshold").val();
                            if (!$(this).find('.cbFixedPrice').is(':checked')) {
                                amount_extra = $(this).find('.inpAmountExtra').valCurrency();
                            }
                            if ($("#chooseUnit").find('option:selected').text() === 'price'){
                                threshold = $(this).find(".inpThreshold").valCurrency();
                            }
                            let data_formula = {
                                'unit': $("#chooseUnit").val(),
                                'comparison_operators': $(this).find(".chooseOperator").val(),
                                'threshold': threshold,
                                'amount_condition': $(this).find('.inpAmount').valCurrency(),
                                'extra_amount': amount_extra,
                            }
                            formula.push(data_formula)
                        })
                        let is_condition_other_cites = false;
                        if (locations.includes('1')) {
                            data_location = city_list.map(obj => obj.id).filter((item) => !arr_location.includes(item));
                            is_condition_other_cites = true
                        } else {
                            let condition_other = condition.find(obj => obj.is_other === true);
                            locations.map(function (item) {
                                arr_location.push(item)
                                if (condition_other !== undefined) {
                                    condition_other['location'] = condition_other['location'].filter(function (value) {
                                        return value !== item;
                                    });
                                }
                            })
                        }
                        if (new Set(arr_location).size !== arr_location.length) {
                            is_submit = false;
                            $.fn.notifyPopup({description: "location: duplicate location"}, 'failure');
                        }
                        let data_condition = {
                            'location': data_location,
                            'formula': formula,
                            'is_other': is_condition_other_cites
                        }
                        condition.push(data_condition);
                    }
                })
                frm.dataForm['formula_condition'] = condition;
                break;
        }
        if (is_submit) {
            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })
})