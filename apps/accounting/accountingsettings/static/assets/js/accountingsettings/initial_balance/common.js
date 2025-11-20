/**
 * Khai báo các Element cho Initial Balance
 */
class InitialBalanceElements {
    constructor() {
        this.$accountingPeriodEle = $('#accountingPeriod');
        this.$titleEle = $('#title');
        this.$descriptionEle = $('#description');

        this.$btnSubmit = $('#btn_submit');
        this.$urlFactory = $('#url-factory');
    }
}
const pageElements = new InitialBalanceElements();


/**
 * Khai báo các hàm chính
 */
class InitialBalancePageFunction {
    static CalculateAccountBalanceSummarize(tab_account_balance_data=[]) {
        // Money
        let tab_money_item = tab_account_balance_data.find(item => item?.['tab_type'] === 0)
        let tab_money_value = tab_money_item ? tab_money_item?.['tab_value'] || 0 : 0
        $('#balanceTabCash').attr('data-init-money', tab_money_value)
        // Goods
        let tab_goods_item = tab_account_balance_data.find(item => item?.['tab_type'] === 1)
        let tab_goods_value = tab_goods_item ? tab_goods_item?.['tab_value'] || 0 : 0
        $('#balanceTabGoods').attr('data-init-money', tab_goods_value)

        // total
        $('#totalBalance').attr('data-init-money', tab_money_value + tab_goods_value)

        $.fn.initMaskMoney2();
    }

    static loadDates(elements) {
        elements.forEach(ele => {
            UsualLoadPageFunction.LoadDate({
                element: ele,
                empty: true
            });
        });
    }
}


/**
 * Khai báo các hàm chính
 */
class InitialBalanceHandler {
    static LoadDetailInitialBalance(option) {
        let url_loaded = $('#frm_detail_initial_balance').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['initial_balance_detail'];

                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    pageElements.$titleEle.val(data?.['title'] || '');
                    pageElements.$descriptionEle.val(data?.['description'] || '');
                    UsualLoadPageFunction.LoadPeriod({
                        element: pageElements.$accountingPeriodEle,
                        data: data?.['period_mapped_data'] || {},
                        data_url: pageElements.$accountingPeriodEle.attr('data-url'),
                        apply_default_on_change: true
                    });
                    pageElements.$accountingPeriodEle.trigger('change');

                    InitialBalancePageFunction.CalculateAccountBalanceSummarize(data?.['tab_account_balance_data'] || [])

                    $.fn.initMaskMoney2();

                    UsualLoadPageFunction.DisablePage(option==='detail');
                }
            })
    }
}


class InitialBalanceEventHandler {
    static InitPageEvent() {
    }
}
