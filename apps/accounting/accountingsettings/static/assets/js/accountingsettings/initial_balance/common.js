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
