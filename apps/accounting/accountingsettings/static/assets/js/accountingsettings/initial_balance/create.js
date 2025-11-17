$(document).ready(function () {
    UsualLoadPageFunction.LoadPeriod({
        element: pageElements.$accountingPeriodEle,
        data: {'id': '123123123', 'title': 'Kì kế toán 2025', 'fiscal_year': 2025, 'start_date': '2025-01-01', 'end_date': '2025-12-31'},
        data_url: pageElements.$accountingPeriodEle.attr('data-url'),
        apply_default_on_change: true
    });
    pageElements.$accountingPeriodEle.trigger('change')
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
