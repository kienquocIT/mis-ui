function callData(url, method) {
    return $.fn.callAjax2({
        url: url,
        method: method,
    }).then((resp) => {
        return $.fn.switcherResp(resp);
    });
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

    static loadItemUnit(ele, data){
        ele.initSelect2(
            {
                data: data,
                'allowClear': true,
                disabled: !(ele.attr('data-url')),
            }
        )
    }

}