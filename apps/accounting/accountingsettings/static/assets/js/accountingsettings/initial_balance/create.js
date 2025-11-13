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
    UsualLoadPageFunction.LoadDate({
        element: tabSupplierPayableElements.$supplierInvoiceDate,
        empty: true
    });
    UsualLoadPageFunction.LoadDate({
        element: tabSupplierPayableElements.$expectedSupplierPaymentDate,
        empty: true
    });

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

    // Tab Account
    TabAccountFunction.initAccountTable();
    TabAccountEventHandler.InitPageEvent();
});
