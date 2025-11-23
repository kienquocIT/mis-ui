/**
 * Khai báo các Element cho Initial Balance
 */
class InitialBalanceElements {
    constructor() {
        this.$accountingPeriodEle = $('#accountingPeriod');
        this.$titleEle = $('#title');
        this.$descriptionEle = $('#description');
        this.$table_account_balance = $('#table_account_balance');

        this.$btnSubmit = $('#btn_submit');
        this.$urlFactory = $('#url-factory');
    }
}
const pageElements = new InitialBalanceElements();

/**
 * Khai báo các hàm chính
 */
class InitialBalancePageFunction {
    static CalculateAccountBalance(tab_account_balance_data=[]) {
        // Money
        let tab_money_item = tab_account_balance_data.find(item => item?.['tab_type'] === 0)
        let tab_money_value = tab_money_item ? tab_money_item?.['tab_value'] || 0 : 0
        $('#balanceMoney span:eq(0)').attr('data-init-money', tab_money_value)
        // Goods
        let tab_goods_item = tab_account_balance_data.find(item => item?.['tab_type'] === 1)
        let tab_goods_value = tab_goods_item ? tab_goods_item?.['tab_value'] || 0 : 0
        $('#balanceGoods span:eq(0)').attr('data-init-money', tab_goods_value)

        // total
        $('#totalBalance span:eq(0)').attr('data-init-money', tab_money_value + tab_goods_value)

        $.fn.initMaskMoney2();
    }
    static UpdateTabAccountBalance($row) {
        let total_debit = 0
        let total_credit = 0
        if ($row.attr('data-type-row') === 'added') {
            let table = $row.closest('table')
            if (table.attr('id') === 'tbl_money') {
                let tab_row = pageElements.$table_account_balance.find('tbody tr:eq(0)')
                let money_debit_added = tab_row.find('span:eq(1)')
                let money_credit_added = tab_row.find('span:eq(2)')
                let new_debit_added = 0
                let new_credit_added = 0
                table.find('tbody tr').each(function (index, ele) {
                    new_debit_added += parseFloat($(ele).find('.row-debit').attr('value') || 0)
                    new_credit_added += parseFloat($(ele).find('.row-credit').attr('value') || 0)
                })
                money_debit_added.prop('hidden', new_debit_added <= 0)
                money_debit_added.attr('data-init-money', new_debit_added)
                money_credit_added.prop('hidden', new_credit_added <= 0)
                money_credit_added.attr('data-init-money', new_credit_added)
                total_debit += new_debit_added
                total_credit += new_credit_added
            }
        }
        else if ($row.attr('.data-type-row') === 'updated') {

        }

        let sum_row = pageElements.$table_account_balance.find('tfoot tr:eq(0)')
        let sum_debit_added = sum_row.find('span:eq(1)')
        let sum_credit_added = sum_row.find('span:eq(2)')
        sum_debit_added.prop('hidden', total_debit <= 0)
        sum_debit_added.attr('data-init-money', total_debit)
        sum_credit_added.prop('hidden', total_credit <= 0)
        sum_credit_added.attr('data-init-money', total_credit)
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
        let url_loaded = $('#frm_detail_initial_balance').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['initial_balance_detail'];

                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    // load common information
                    pageElements.$titleEle.val(data?.['title'] || '');
                    pageElements.$descriptionEle.val(data?.['description'] || '');
                    UsualLoadPageFunction.LoadPeriod({
                        element: pageElements.$accountingPeriodEle,
                        data: data?.['period_mapped_data'] || {},
                        data_url: pageElements.$accountingPeriodEle.attr('data-url'),
                        apply_default_on_change: true
                    });
                    pageElements.$accountingPeriodEle.trigger('change');

                    // load Tabs information
                    TabMoneyFunction.initMoneyTable(data?.['tab_money_data'] || []);
                    TabAccountReceivableFunction.initAccountReceivableTable(data?.['tab_customer_receivable_data'] || []);
                    TabSupplierPayableFunction.initSupplierPayableTable(data?.['tab_supplier_payable_data'] || []);

                    InitialBalancePageFunction.CalculateAccountBalance(data?.['tab_account_balance_data'] || [])

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
