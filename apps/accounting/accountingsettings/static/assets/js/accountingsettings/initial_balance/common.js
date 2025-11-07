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


class InitialBalanceLoadDataHandle {
    static loadCurrencyData({element, data=null}) {
        element.initSelect2({
            allow_clear: true,
            ajax: {
                url: pageElements.$urlFactory.attr('data-currency'),
                method: 'GET'
            },
            data: (data ? data : null),
            keyResp: 'currency_list',
            keyId: 'id',
            keyText: 'title',
        });
    }

    static loadFiscalYear(fiscalYearData) {
        pageElements.$accountingPeriodEle.initSelect2({
            ajax: {
                url: pageElements.$urlFactory.attr('data-fiscal-year'),
                method: 'GET'
            },
            data: (fiscalYearData ? fiscalYearData : null),
            keyResp: 'periods_list',
            keyId: 'id',
            keyText: 'title',
        });
    }
}

/**
 * Khai báo các hàm chính
 */
class InitialBalancePageFunction {

}


class InitialBalanceEventHandler {
    static InitPageEvent() {
        // event for automating field fiscal year
        pageElements.$accountingPeriodEle.on('select2:select', function(e) {
            const period = e.params?.data?.data;
            if (period) {
                pageElements.$fiscalYearEle.val(period?.fiscal_year || '');
                let fiscalStartDate = period.start_date ? moment(period.start_date).format('DD/MM/YYYY') : '';
                pageElements.$openingDateEle.val(fiscalStartDate);
            }
        })
    }
}
