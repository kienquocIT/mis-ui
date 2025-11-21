$(document).ready(function () {
    UsualLoadPageFunction.LoadPeriod({
        element: pageElements.$accountingPeriodEle,
        data_url: pageElements.$accountingPeriodEle.attr('data-url')
    });
    InitialBalanceEventHandler.InitPageEvent();
    UsualLoadPageFunction.LoadDate({
        element: tabAccountReceivableElements.$invoiceDate,
        empty: true
    });
    UsualLoadPageFunction.LoadDate({
        element: tabAccountReceivableElements.$expectedPaymentDate,
        empty: true
    });

    // Tab Money
    TabMoneyEventHandler.InitPageEvent();
    TabMoneyFunction.initMoneyTable();

    // Tab Account Receivable
    TabAccountReceivableFunction.initAccountReceivableTable();
    TabAccountReceivableEventHandler.InitPageEvent();
});
