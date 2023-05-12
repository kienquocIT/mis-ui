$(document).ready(function () {
    const city_list = JSON.parse($('#id-city-list').text());
    const city_dict = city_list.reduce((obj, item) => {
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
        }
    })

    function loadUoMGroup() {
        let ele = $('.chooseUoMGroup');
        let frm = new SetupFormSubmit(ele);
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure_group')) {
                    ele.append(`<option></option>`);
                    resp.data.unit_of_measure_group.map(function (item) {
                        ele.append(`<option value="` + item.id + `"><span>` + item.title + `</span></option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadCities(city_list) {
        let ele = $('#chooseCityDefault');
        city_list.map(function (item) {
            ele.append(`<option value="` + item.id + `"><span>` + item.title + `</span></option>`);
        })
    }

    //onchange select box choose Unit Of Measure Group
    $(document).on('change', '.chooseUoMGroup', function () {
        let ele = $(this).closest('div .row').find('.chooseUoM');
        $(this).closest('.formulaCondition').find('.displayUoMGroup').text($(this).find('option:selected').text());
        ele.html('');
        let id = $(this).val();
        let frm = new SetupFormSubmit(ele);
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                    ele.append(`<option></option>`);
                    resp.data.unit_of_measure.map(function (item) {
                        if (item.group.id === id) {
                            ele.append(`<option value="` + item.id + `"><span>` + item.title + `</span></option>`);

                        }
                    })
                }
            }
        }, (errs) => {
        },)
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
        let html = $('#ifInCondition').html();
        $(this).closest('.line-condition').append(html);
        $(this).remove();

    })

    //Add new condition
    $(document).on('click', '#btnAddCondition', function () {
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
                loadUoMGroup();
                loadCities(city_list);
                break;
        }
    })

    const frmCreateShipping = $('#frmCreateShipping')
    frmCreateShipping.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        switch (frm.dataForm['cost_method']) {
            case "0":
                frm.dataForm['formula_condition'] = [];
                break;
            case "1":
                delete frm.dataForm['fixed_price'];
                let condition = [];
                let ele_condition = $('.condition-content .line-condition');
                ele_condition.each(function () {
                    let ele_formula = $(this).find('.formulaCondition');
                    let formula = []
                    ele_formula.each(function () {
                        let amount_extra = 0;
                        if (!$(this).find('.cbFixedPrice').is(':checked')) {
                            amount_extra = $(this).find('.inpAmountExtra').val();
                        }
                        let data_formula = {
                            'uom_group': $(this).find(".chooseUoMGroup").val(),
                            'uom': $(this).find(".chooseUoM").val(),
                            'comparison_operators': $(this).find(".chooseOperator").val(),
                            'threshold': $(this).find(".inpThreshold").val(),
                            'amount_condition': $(this).find('.inpAmount').val(),
                            'extra_amount': amount_extra,
                        }
                        formula.push(data_formula)
                    })
                    let data_condition = {
                        'location': $(this).find('.chooseCity').val(),
                        'formula': formula
                    }
                    condition.push(data_condition);
                })
                frm.dataForm['formula_condition'] = condition;
                break;
        }
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
    })
})