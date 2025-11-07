$(document).ready(function () {
    InitialBalancePageFunction.initOpeningDatePicker();

    InitialBalanceEventHandler.InitPageEvent();
    TabMoneyEventHandler.InitPageEvent();
    TabMerchandiseEventHandler.InitPageEvent();

    TabMoneyFunction.initMoneyTable();
    TabMerchandiseFunction.initMerchandiseTable();
});
