/**
 * Khai báo các Element cho Initial Balance
 */
class InitialBalanceElements {
    constructor() {
        this.$openingDateEle = $('#openingDate');
        this.$fiscalYearEle = $('#fiscalYear');
        this.$accountingPeriodEle = $('#accountingPeriod');
        this.$descriptionEle = $('#description');

        this.$btnSubmit = $('#btn_submit');  // To be added
        this.$urlFactory = $('#url-factory');
    }
}

const pageElements = new InitialBalanceElements();


class InitialBalanceLoadDataHandle {
    /**
     * Update fiscal year and accounting period based on opening date
     */
    static updateFiscalYearAndPeriod() {
        const dateValue = pageElements.$openingDateEle.val();
        if (!dateValue) return;

        // Parse date (assuming DD/MM/YYYY format)
        const parts = dateValue.split('/');
        if (parts.length !== 3) return;

        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        // Set fiscal year
        pageElements.$fiscalYearEle.val(year);

        // Set accounting period
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const periodText = `${monthNames[month - 1]} ${year}`;
        pageElements.$accountingPeriodEle.val(periodText);
    }

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
}

/**
 * Khai báo các hàm chính
 */
class InitialBalancePageFunction {
    /**
     * Initialize opening date picker with auto-calculation
     */
    static initOpeningDatePicker() {
        UsualLoadPageFunction.LoadDate({
            element: pageElements.$openingDateEle,
            output_format: 'DD/MM/YYYY',
            empty: true
        });
    }
}


class InitialBalanceEventHandler {
    static InitPageEvent() {
        // Listen to date range picker apply event
        pageElements.$openingDateEle.on('apply.daterangepicker', function (ev, picker) {
            InitialBalanceLoadDataHandle.updateFiscalYearAndPeriod();
        });
        // Backup: Listen to change event
        pageElements.$openingDateEle.on('change', function () {
            InitialBalanceLoadDataHandle.updateFiscalYearAndPeriod();
        });
    }
}