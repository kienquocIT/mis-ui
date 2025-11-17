/**
 * Khai báo các Element cho Initial Balance
 */
class InitialBalanceElements {
    constructor() {
        this.$openingDateEle = $('#openingDate');
        this.$fiscalYearEle = $('#fiscalYear');
        this.$accountingPeriodEle = $('#accountingPeriod');
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


class InitialBalanceEventHandler {
    static InitPageEvent() {
        // event for automating field fiscal year
        pageElements.$accountingPeriodEle.on('change', function() {
            let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            pageElements.$fiscalYearEle.val(selected?.['fiscal_year'] || '');
            let fiscalStartDate = selected?.['start_date'] ? moment(selected?.['start_date']).format('DD/MM/YYYY') : '';
            pageElements.$openingDateEle.val(fiscalStartDate);
        })
    }
}
