$(document).ready(function () {
    UsualLoadPageFunction.LoadPeriod({
        element: pageElements.$accountingPeriodEle,
        data_url: pageElements.$accountingPeriodEle.attr('data-url')
    });
    InitialBalancePageFunction.loadDates([
        tabAccountReceivableElements.$invoiceDate,
        tabAccountReceivableElements.$expectedPaymentDate,
        tabSupplierPayableElements.$supplierInvoiceDate,
        tabSupplierPayableElements.$expectedSupplierPaymentDate,
        tabToolElements.$startDateEle
    ]);
    InitialBalanceEventHandler.InitPageEvent();

    // Tab Money
    TabMoneyEventHandler.InitPageEvent();
    TabMoneyFunction.initMoneyTable();

    // Tab Account Receivable
    TabAccountReceivableFunction.initAccountReceivableTable();
    TabAccountReceivableEventHandler.InitPageEvent();

    // Tab Supplier Payable
    TabSupplierPayableFunction.initSupplierPayableTable();
    TabSupplierPayableEventHandler.InitPageEvent();

    // Tab Employee Payable
    TabEmployeePayableFunction.initEmployeePayableTable();
    TabEmployeePayableEventHandler.InitPageEvent();

    // Tab Tools
    TabToolFunction.initToolTable();
    TabToolEventHandler.InitPageEvent();

    // Tab Account
    TabAccountFunction.initAccountTable();
    TabAccountEventHandler.InitPageEvent();
});
