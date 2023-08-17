$(document).ready(function () {
    const pk = window.location.pathname.split('/').pop();
    let item_unit_dict = {};

    $(document).on('change', '.cbFixedPrice', function () {
        let divNotFixed = $(this).closest('div .row').find('.divNotFixed')
        if ($(this).is(':checked')) {
            divNotFixed.addClass('hidden');
        } else {
            divNotFixed.removeClass('hidden');
            let text = $(this).closest('.line-condition').find('.chooseUnit').find('option:selected').text();
            $(this).closest('.formulaCondition').find('.displayUoMGroup').text(text);
        }
    })

    function removeClass(eleThreshold) {
        eleThreshold.removeClass('mask-money');
        eleThreshold.removeAttr('data-return-type');
        eleThreshold.attr('type', 'number');
    }

    //onchange select box choose Unit Of Measure Group
    $(document).on('change', '.chooseUnit', function () {
        let eleParent = $(this).closest('.line-condition')
        let ele = eleParent.find('.spanUnit');
        let inpUnit = eleParent.find('.inpUnit');
        inpUnit.val($(this).find('option:selected').text());
        eleParent.find('.displayUoMGroup').text($(this).find('option:selected').text());

        let eleThreshold = eleParent.find('.inpThreshold')
        eleThreshold.attr('value', '')
        if (Object.keys(item_unit_dict).length < 4) {
            item_unit_dict = JSON.parse($(`#${$(this).data('idx-data-loaded')}`).text());
        }
        ele.text(item_unit_dict[$(this).val()].measure)
        switch ($(this).find('option:selected').text()) {
            case 'price':
                eleThreshold.addClass('mask-money');
                eleThreshold.attr('data-return-type', 'number');
                eleThreshold.attr('type', 'text');
                break;
            default:
                removeClass(eleThreshold)
                break;
        }
        $.fn.initMaskMoney2();
    })

    // Add new Formula for condition
    $(document).on('click', '.btnAddFormula', function () {
        let html = $('#ifInCondition').html();
        $(this).closest('.line-condition').append(html);
        let eleParent = $(this).closest('.line-condition')
        let text_unit = eleParent.find('.chooseUnit').find('option:selected').text();
        if (text_unit !== '') {
            eleParent.find('.inpUnit').attr('value', text_unit);
            eleParent.find('.spanUnit').text(item_unit_dict[eleParent.find('.chooseUnit').val()].measure);
            let eleThreshold = $(this).closest('.line-condition').find('.inpThreshold');
            if (text_unit === 'price') {
                eleThreshold.addClass('mask-money');
                eleThreshold.attr('data-return-type', 'number');
                eleThreshold.attr('type', 'text');
            } else {
                removeClass(eleThreshold)
            }
        }
        $(this).remove();
    })

    //Add new condition
    $(document).on('click', '#btnAddCondition', async function () {
        let html = $('#newCondition').html();
        let ele_condition = $('.condition-content');
        ele_condition.append(html);
        ShippingLoadPage.loadCity(ele_condition.children().last().find('.chooseCity'));
        ShippingLoadPage.loadItemUnit(ele_condition.children().last().find('.chooseUnit'));
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
                break;
        }
    })

    function loadEachFormula(ele, firstFormula) {
        let eleSelectUnit = ele.find('.chooseUnit').last();
        console.log(eleSelectUnit);
        ShippingLoadPage.loadCity(eleSelectUnit, firstFormula.unit)
        ele.find('.inpUnit').val(firstFormula.unit.title);
        item_unit_dict = JSON.parse($(`#${eleSelectUnit.data('idx-data-loaded')}`).text());
        ele.find('.spanUnit').text(item_unit_dict[firstFormula.unit.id].measure);
        switch (firstFormula.unit.title) {
            case 'price':
                let eleThreshold = $('.inpThreshold')
                eleThreshold.addClass('mask-money');
                eleThreshold.attr('data-return-type', 'number');
                eleThreshold.attr('type', 'text');
                break;
        }
        ele.find('.chooseOperator').val(firstFormula.comparison_operators);
        ele.find('.inpThreshold').attr('value', firstFormula.threshold);
        ele.find('.inpAmount').attr('value', firstFormula.amount_condition);
        if (firstFormula.extra_amount > 0) {
            ele.find('.inpAmountExtra').attr('value', firstFormula.extra_amount)
            ele.find('.cbFixedPrice').prop('checked', false);
            ele.find('.divNotFixed').removeClass('hidden');
            ele.find('.displayUoMGroup').text(firstFormula.unit.title)
        } else {
            ele.find('.inpAmountExtra').val('');
        }
    }

    function loadFormula(condition, condition_ele) {
        let firstFormulaEle = condition_ele.find('.formulaCondition')
        loadEachFormula(firstFormulaEle, condition.formula[0]);
        for (let i = 1; i < condition.formula.length; i++) {
            condition_ele.find('.btnAddFormula').remove();
            condition_ele.append($('#ifInCondition').html());
            let formulaEle = condition_ele.find('.formulaCondition ').last();
            loadEachFormula(formulaEle, condition.formula[i]);
        }
    }

    function loadCondition(list_condition) {
        list_condition.sort(function (a, b) {
            return a.location.length - b.location.length;
        });
        for (let i = 0; i < list_condition.length; i++) {
            let html = $('#newCondition').html();
            let conditionContent = $('.condition-content')
            conditionContent.append(html);
            let ele = conditionContent.find('.line-condition').last();
            ShippingLoadPage.loadCity(ele.find('.chooseCity'), list_condition[i].location);
            loadFormula(list_condition[i], ele);
        }
    }

    const frmDetail = $('#frmDetailShipping')

    function loadDetail(frmDetail, pk) {
        let ele_condition = $('.condition-content')
        let frm = new SetupFormSubmit(frmDetail);
        $.fn.callAjax2({
            'url': frm.getUrlDetail(pk),
            'method': 'GET'
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let shipping_detail = data?.['shipping'];
                $.fn.compareStatusShowPageAction(shipping_detail);
                $('#inpTitle').val(shipping_detail.title);
                $('#inpMargin').val(shipping_detail.margin);
                if (shipping_detail.is_active === true) {
                    $('#inputActive').prop('checked', true)
                }
                ShippingLoadPage.loadCurrency(shipping_detail.currency)
                switch (shipping_detail.cost_method) {
                    case 0:
                        $('#inputAmount').attr('value', shipping_detail.fixed_price);
                        break;
                    case 1:
                        $(`input[name="cost_method"][value="` + shipping_detail.cost_method + `"]`).prop('checked', true);
                        $('#inputAmount').prop('disabled', true);
                        ele_condition.removeClass('hidden');
                        loadCondition(shipping_detail.formula_condition);
                        break;
                }
                $.fn.initMaskMoney2();
                ele_condition.on('change', 'select, input', function () {
                    ele_condition.addClass('condition-changed')
                });
            }
        }, (errs) => {
        },)
    }

    loadDetail(frmDetail, pk);

    frmDetail.submit(function (event) {
        event.preventDefault();
        let frm = new SetupFormSubmit($(this));
        let is_submit = true;
        let arr_location = []
        let data_location = []
        frm.dataForm['fixed_price'] = $('[name="fixed_price"]').valCurrency();
        frm.dataForm['is_active'] = !!$('#inputActive').is(':checked');
        switch (frm.dataForm['cost_method']) {
            case "0":
                frm.dataForm['formula_condition'] = [];
                break;
            case "1":
                delete frm.dataForm['fixed_price'];
                let condition = [];
                if ($('.condition-content').hasClass('condition-changed')) {
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
                }
                else{
                    delete frm.dataForm['formula_condition']
                }

                break;
        }

        frm.dataForm['is_active'] = !!$('#inputActive').is(':checked');

        if (is_submit) {
            $.fn.callAjax2({
                'url': frm.getUrlDetail(pk),
                'method': frm.dataMethod,
                'data': frm.dataForm
            })
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })
})