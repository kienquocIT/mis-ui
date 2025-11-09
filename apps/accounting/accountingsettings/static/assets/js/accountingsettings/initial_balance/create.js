$(document).ready(function () {
    UsualLoadPageFunction.LoadPeriod({
        element: pageElements.$accountingPeriodEle,
        data_url: pageElements.$accountingPeriodEle.attr('data-url')
    });
    InitialBalanceEventHandler.InitPageEvent();

    // Tab Money
    TabMoneyEventHandler.InitPageEvent();
    TabMoneyFunction.initMoneyTable();
});
