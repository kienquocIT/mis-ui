$(document).ready(function () {
    let isChangeCondition = false;
    const pk = window.location.pathname.split('/').pop();
    const city_list = JSON.parse($('#id-city-list').text());
    const unit_list = JSON.parse($('#id-unit-list').text());

    $('.select2').select2();

    $(document).on('change', '.cbFixedPrice', function () {
        let divNotFixed = $(this).closest('div .row').find('.divNotFixed')
        if ($(this).is(':checked')) {
            divNotFixed.addClass('hidden');
        } else {
            divNotFixed.removeClass('hidden');
            let text = $(this).closest('.formulaCondition').find('.chooseUoMGroup').find('option:selected').text();
            $(this).closest('.formulaCondition').find('.displayUoMGroup').text(text);
        }
    })

    function loadCities(city_list) {
        let ele = $('#chooseCityDefault');
        city_list.map(function (item) {
            ele.append(`<option value="` + item.id + `"><span>` + item.title + `</span></option>`);
        })
    }

    //onchange select box choose Unit Of Measure Group
    $(document).on('change', '.chooseUnit', function () {
        let ele = $(this).closest('div .row').find('.spanUnit');
        // switch ():
        switch ($(this).find('option:selected').text()) {
            case 'price':
                ele.text($('#chooseCurrency').find('option:selected').text());
                break;
            case 'quantity':
                ele.text('unit');
                break;
            case 'volume':
                ele.text('cm³');
                break;
            case 'weight':
                ele.text('g')
                break;
        }
    })

    function loadCurrency(id) {
        let ele = $('#chooseCurrency');
        let frm = new SetupFormSubmit(ele);
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('currency_list')) {
                    ele.append(`<option></option>`);
                    resp.data.currency_list.map(function (item) {
                        if (item.id === id) {
                            ele.append(`<option value="` + item.id + `" selected><span>` + item.title + `</span></option>`);
                        } else {
                            ele.append(`<option value="` + item.id + `"><span>` + item.title + `</span></option>`);
                        }
                    })
                }
            }
        }, (errs) => {
        },)
    }

    // Add new Formula for condition
    $(document).on('click', '.btnAddFormula', function () {
        let html = $('#ifInCondition').html();
        $(this).closest('.line-condition').append(html);
        $(this).remove();
    })

    //Add new condition
    $(document).on('click', '#btnAddCondition', function () {
        let html = $('#newCondition').html();
        let conditionContent = $('.condition-content')
        conditionContent.append(html);
        conditionContent.children().last().find('.chooseCity').addClass('select2');
        conditionContent.children().last().find('.chooseCity').select2();
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

    function loadEachFormula(ele, firstFormula) {
        ele.find('.chooseUnit').val(firstFormula.unit.id);
        switch (firstFormula.unit.title) {
            case 'price':
                ele.find('.spanUnit').text($('#chooseCurrency').find('option:selected').text());
                break;
            case 'quantity':
                ele.find('.spanUnit').text('unit');
                break;
            case 'volume':
                ele.find('.spanUnit').text('cm³');
                break;
            case 'weight':
                ele.find('.spanUnit').text('g')
                break;

        }
        ele.find('.chooseOperator').val(firstFormula.comparison_operators);
        ele.find('.inpThreshold').val(firstFormula.threshold);
        ele.find('.inpAmount').val(firstFormula.amount_condition);
        if (firstFormula.extra_amount > 0) {
            ele.find('.inpAmountExtra').val(firstFormula.extra_amount)
            ele.find('.cbFixedPrice').prop('checked', false);
            ele.find('.divNotFixed').removeClass('hidden');
        } else {
            ele.find('.inpAmountExtra').val('');
        }
    }

    function loadFormula(condition, condition_ele) {
        let firstFormulaEle = condition_ele.find('.formulaCondition')
        condition_ele.find('.chooseCity').val(condition.location).trigger('change');
        loadEachFormula(firstFormulaEle, condition.formula[0]);
        for (let i = 1; i < condition.formula.length; i++) {
            condition_ele.find('.btnAddFormula').remove();
            condition_ele.append($('#ifInCondition').html());
            let formulaEle = condition_ele.find('.formulaCondition ').last();
            loadEachFormula(formulaEle, condition.formula[i]);
        }
    }

    function loadCondition(list_condition) {
        let firstEle = $('.line-condition').first();
        loadFormula(list_condition[0], firstEle);

        for (let i = 1; i < list_condition.length; i++) {
            let html = $('#newCondition').html();
            let conditionContent = $('.condition-content')
            conditionContent.append(html);
            conditionContent.children().last().find('.chooseCity').addClass('select2');
            conditionContent.children().last().find('.chooseCity').select2();

            let ele = conditionContent.find('.line-condition').last();
            loadFormula(list_condition[i], ele);
        }

    }

    const frmDetail = $('#frmDetailShipping')

    function loadDetail(frmDetail, pk) {
        let frm = new SetupFormSubmit(frmDetail);
        $.fn.callAjax(frm.getUrlDetail(pk), 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('shipping')) {
                    $('#inpTitle').val(data.shipping.title);
                    $('#inpMargin').val(data.shipping.margin);
                    loadCurrency(data.shipping.currency);
                    switch (data.shipping.cost_method) {
                        case 0:
                            $('#inputAmount').val(data.shipping.fixed_price)
                            break;
                        case 1:
                            $(`input[name="cost_method"][value="` + data.shipping.cost_method + `"]`).prop('checked', true);
                            $('#inputAmount').prop('disabled', true);
                            $('.condition-content').removeClass('hidden');
                            loadCities(city_list)
                            loadCondition(data.shipping.formula_condition);
                            break;
                    }
                    $('.condition-content').on('change', 'select, input', function () {
                        isChangeCondition = true;
                    });
                }
            }
        }, (errs) => {
        },)
    }

    loadDetail(frmDetail, pk);

    frmDetail.submit(function (event) {
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
                            'unit': $(this).find(".chooseUnit").val(),
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
        frm.dataForm['is_change_condition'] = isChangeCondition;
        $.fn.callAjax(frm.getUrlDetail(pk), frm.dataMethod, frm.dataForm, csr)
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