function callData(url, method) {
    return $.fn.callAjax2({
        url: url,
        method: method,
    }).then((resp) => {
        return $.fn.switcherResp(resp);
    });
}

function changeUnit(_this,) {
    let eleParent = _this.closest('.line-condition')
    let ele = eleParent.find('.spanUnit');
    let inpUnit = eleParent.find('.inpUnit');
    inpUnit.val(_this.find('option:selected').text());
    eleParent.find('.displayUoMGroup').text(_this.find('option:selected').text());

    let eleThreshold = eleParent.find('.inpThreshold')
    eleThreshold.attr('value', '')
    let unit = SelectDDControl.get_data_from_idx(_this, _this.val());
    ele.text(unit.measure)
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
}

function removeClass(eleThreshold) {
    eleThreshold.removeClass('mask-money');
    eleThreshold.removeAttr('data-return-type');
    eleThreshold.attr('type', 'number');
}

function addFormula(ele) {
    let html = $('#ifInCondition').html();
    ele.closest('.line-condition').append(html);
    let eleParent = ele.closest('.line-condition')
    let text_unit = eleParent.find('.chooseUnit').find('option:selected').text();
    let text_measure = eleParent.find('.spanUnit').first().text();
    if (text_unit !== '') {
        eleParent.find('.inpUnit').attr('value', text_unit);
        eleParent.find('.spanUnit').text(text_measure);
        let eleThreshold = ele.closest('.line-condition').find('.inpThreshold');
        if (text_unit === 'price') {
            eleThreshold.addClass('mask-money');
            eleThreshold.attr('data-return-type', 'number');
            eleThreshold.attr('type', 'text');
        } else {
            removeClass(eleThreshold)
        }
    }
    $(this).remove();
}

function addCondition() {
    let html = $('#newCondition').html();
    let ele_condition = $('.condition-content');
    ele_condition.append(html);
    ShippingLoadPage.loadCity(ele_condition.children().last().find('.chooseCity'));
    ShippingLoadPage.loadItemUnit(ele_condition.children().last().find('.chooseUnit'));
}

function loadEachFormula(ele, currentFormula) {
    let eleSelectUnit = ele.closest('.line-condition').find('.chooseUnit').first();
    ShippingLoadPage.loadCity(eleSelectUnit, currentFormula.unit)
    ele.find('.inpUnit').val(currentFormula.unit.title);
    item_unit_dict = JSON.parse($(`#${eleSelectUnit.data('idx-data-loaded')}`).text());
    ele.find('.spanUnit').text(currentFormula.unit.measure);
    switch (currentFormula.unit.title) {
        case 'price':
            let eleThreshold = $('.inpThreshold')
            eleThreshold.addClass('mask-money');
            eleThreshold.attr('data-return-type', 'number');
            eleThreshold.attr('type', 'text');
            break;
    }
    ele.find('.chooseOperator').val(currentFormula.comparison_operators);
    ele.find('.inpThreshold').attr('value', currentFormula.threshold);
    ele.find('.inpAmount').attr('value', currentFormula.amount_condition);
    if (currentFormula.extra_amount > 0) {
        ele.find('.inpAmountExtra').attr('value', currentFormula.extra_amount)
        ele.find('.cbFixedPrice').prop('checked', false);
        ele.find('.divNotFixed').removeClass('hidden');
        ele.find('.displayUoMGroup').text(currentFormula.unit.title)
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

function renderDetail(data, ele_condition) {
    let shipping_detail = data?.['shipping'];
    $.fn.compareStatusShowPageAction(shipping_detail);
    $('#inpTitle').val(shipping_detail.title);
    $('#inpMargin').val(shipping_detail.margin);
    if (shipping_detail.is_active === true) {
        $('#inputActive').prop('checked', true)
    }
    ShippingLoadPage.loadCurrency(shipping_detail.currency)
    let ele_inputAmount = $('#inputAmount')
    switch (shipping_detail?.['cost_method']) {
        case 0:
            ele_inputAmount.attr('value', shipping_detail.fixed_price);
            break;
        case 1:
            $(`input[name="cost_method"][value="` + shipping_detail?.['cost_method'] + `"]`).prop('checked', true);
            ele_inputAmount.prop('disabled', true);
            ele_condition.removeClass('hidden');
            loadCondition(shipping_detail.formula_condition);
            break;
    }
    $.fn.initMaskMoney2();
    ele_condition.on('change', 'select, input', function () {
        ele_condition.addClass('condition-changed')
    });
}

function loadDetail(frmDetail, pk) {
    let ele_condition = $('.condition-content')
    let frm = new SetupFormSubmit(frmDetail);
    $.fn.callAjax2({
        'url': frm.getUrlDetail(pk),
        'method': 'GET'
    }).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            renderDetail(data, ele_condition);
        }
    }, (errs) => {
    },)
}

class ShippingLoadPage {
    static currencySelectEle = $('#chooseCurrency');

    static loadCurrency(data) {
        let ele = ShippingLoadPage.currencySelectEle;
        ele.initSelect2({
            data: data,
            'allowClear': true,
            disabled: !(ele.attr('data-url')),
            keyResp: 'currency_list',
            keyText: 'title',
        })
    }

    static loadCity(ele, data) {
        ele.initSelect2(
            {
                data: data,
                'allowClear': true,
                disabled: !(ele.attr('data-url')),
            }
        )
    }

    static loadItemUnit(ele, data) {
        ele.initSelect2(
            {
                data: data,
                'allowClear': true,
                disabled: !(ele.attr('data-url')),
            }
        )
    }

}