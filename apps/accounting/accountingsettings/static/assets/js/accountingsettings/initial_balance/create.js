$(document).ready(function () {
    InitialBalanceEventHandler.InitPageEvent();
    TabMoneyEventHandler.InitPageEvent();
    TabMerchandiseEventHandler.InitPageEvent();

    TabMoneyFunction.initMoneyTable();
    TabMerchandiseFunction.initMerchandiseTable();

    InitialBalanceLoadDataHandle.loadFiscalYear();
});
