$(document).ready(function () {

    $(document).on('change', '.cbFixedPrice', function () {
        let divNotFixed = $(this).closest('div .row').find('.divNotFixed')
        if ($(this).is(':checked')) {
            divNotFixed.addClass('hidden');
        } else {
            divNotFixed.removeClass('hidden');
            let text = $(this).closest('.line-condition').find('.chooseUnit').find('option:selected').text();
            $(this).closest('.line-condition').find('.displayUoMGroup').text(text);
        }
    })

    ShippingLoadPage.loadCurrency();

    //onchange select box choose Unit Of Measure Group
    $(document).on('change', '.chooseUnit', function () {
        changeUnit($(this))
    })

    // Add new Formula for condition
    $(document).on('click', '.btnAddFormula', function () {
        addFormula($(this))
    })

    //Add new condition
    $(document).on('click', '#btnAddCondition', function () {
        addCondition();
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
        let ele_condition = $('.condition-content');
        let ele_inputAmount = $('#inputAmount')
        switch ($(this).val()) {
            case '0':
                ele_condition.addClass('hidden');
                ele_inputAmount.prop('disabled', false);
                break;
            case '1':
                ele_condition.removeClass('hidden');
                ele_inputAmount.prop('disabled', true);
                break;
        }
    })

    const frmCreateShipping = $('#frmCreateShipping')
    new SetupFormSubmit(frmCreateShipping).validate({
        rules: {
            title: {
                required: true,
            },
            margin: {
                required: true,
            },
            currency: {
                required: true,
            },
            fixed_price: {
                required: function (){
                    return $('#inputAmount').is(':checked');
                }
            }
        },
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
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
                                $.fn.notifyB({description: "location: can't select another city while select Other cities"}, 'failure');
                            } else {
                                let ele_formula = $(this).find('.formulaCondition');
                                let formula = []
                                let chooseUnit = $(this).find(".chooseUnit");
                                ele_formula.each(function () {
                                    let amount_extra = 0;
                                    let threshold = $(this).find(".inpThreshold").val();
                                    if (!$(this).find('.cbFixedPrice').is(':checked')) {
                                        amount_extra = $(this).find('.inpAmountExtra').valCurrency();
                                    }
                                    if (chooseUnit.find('option:selected').text() === 'price') {
                                        threshold = $(this).find(".inpThreshold").valCurrency();
                                    }
                                    let data_formula = {
                                        'unit': chooseUnit.val(),
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
                                    $.fn.notifyB({description: "location: duplicate location"}, 'failure');
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
                    $.fn.callAjax2({
                        url: frm.dataUrl,
                        method: frm.dataMethod,
                        data: frm.dataForm,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                                $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )
                }
            }
        })

})