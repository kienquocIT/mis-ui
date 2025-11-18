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
    static CalculateAccountBalanceSummarize() {
        let sum_account_balance_debit = 0
        let sum_account_balance_credit = 0
        // 1. Add tab Cash
        // 2. Add tab Goods
        let sum_tab_goods = 0
        $('#table-balance-product').find('tbody tr').each(function (index, ele) {
            let row_goods_value = parseFloat($(ele).find('td:eq(2) span').attr('data-init-money') || 0)
            sum_tab_goods += row_goods_value
            sum_account_balance_debit += row_goods_value
        })
        $('#balanceTabGoods').attr('data-init-money', sum_tab_goods)
        $('#totalBalance').attr('data-init-money', sum_account_balance_debit - sum_account_balance_credit)
        $.fn.initMaskMoney2()
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
        let url_loaded = $('#frm_detail_initial_balance').attr('data-url-detail');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['initial_balance_detail'];

                    // console.log(data)

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
                    pageElements.$accountingPeriodEle.trigger('change')

                    $.fn.initMaskMoney2();


                    UsualLoadPageFunction.DisablePage(
                        option==='detail',
                    )
                }
            })
    }
}


class InitialBalanceEventHandler {
    static InitPageEvent() {
    }
}
