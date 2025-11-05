/**
 * Khai báo các Element cho Initial Balance
 */
class InitialBalanceElements {
    constructor() {
        // =====================================
        // COMMON DATA SECTION
        // =====================================
        this.$openingDateEle = $('#openingDate');
        this.$fiscalYearEle = $('#fiscalYear');
        this.$accountingPeriodEle = $('#accountingPeriod');
        this.$descriptionEle = $('#description');

        // =====================================
        // FORM & BUTTONS
        // =====================================
        this.$formInitialBalance = $('#frm_initial_balance');
        this.$btnCreateInitialBalance = $('#btn_create_initial_balance');
        this.$btnSaveDraft = $('#btn_save_draft');  // To be added
        this.$btnSubmit = $('#btn_submit');  // To be added

        // =====================================
        // TAB NAVIGATION
        // =====================================
        this.$tabsContainer = $('#initialBalanceTabs');
        this.$tabContent = $('#initialBalanceTabContent');

        // Individual tab panes
        this.$tabMoney = $('#tab_money');
        this.$tabMerchandise = $('#tab_merchandise');
        this.$tabReceivable = $('#tab_receivable');
        this.$tabSupplierPayables = $('#tab_supplier_payables');
        this.$tabEmployeePayables = $('#tab_employee_payables');
        this.$tabFixedAssets = $('#tab_fixed_assets');
        this.$tabExpenses = $('#tab_expenses');
        this.$tabOwnerEquity = $('#tab_owner_equity');

        // =====================================
        // TAB 1: CASH/MONEY - Input Row Elements
        // =====================================
        this.$inputMoneyType = $('#inputMoneyType');
        this.$inputCurrency = $('#inputCurrency');
        this.$inputAccountCode = $('#inputAccountCode');
        this.$inputAccountName = $('#inputAccountName');
        this.$inputAmount = $('#inputAmount');
        this.$inputExchangeRate = $('#inputExchangeRate');
        this.$inputExchangedAmount = $('#inputExchangedAmount');
        this.$inputDebitDisplay = $('#inputDebitDisplay');
        this.$inputCreditDisplay = $('#inputCreditDisplay');
        this.$inputDetailBtn = $('#inputDetailBtn');
        this.$btnAddCash = $('#btnAddCash');
        this.$btnAddMoney = $('#add_tab_money');

        // TAB 1: Table
        this.$tableMoney = $('#tbl_money');
        this.$tableMoneyBody = $('#tab_money tbody');

        // =====================================
        // TAB 2: MERCHANDISE - Input Row Elements
        // =====================================
        this.$inputInventoryType = $('#inputInventoryType');
        this.$inputInventoryDetailSummary = $('#inputInventoryDetailSummary');
        this.$inputInventoryDetailBtn = $('#inputInventoryDetailBtn');
        this.$inputInventoryCode = $('#inputInventoryCode');
        this.$inputInventoryName = $('#inputInventoryName');
        this.$inputInventoryAmount = $('#inputInventoryAmount');
        this.$inputInventoryDebitDisplay = $('#inventoryDebitDisplay');
        this.$inputInventoryCreditDisplay = $('#inventoryCreditDisplay');
        this.$btnAddInventory = $('#btnAddInventory');

        // TAB 2: Table
        this.$tableInventoryBody = $('#inventoryTableBody');

        // =====================================
        // TAB 3: ACCOUNTS RECEIVABLE - Input Row Elements
        // =====================================
        this.$inputReceivableCustomer = $('#inputReceivableCustomer');
        this.$inputReceivableCustomerCode = $('#inputReceivableCustomerCode');
        this.$inputReceivableDetailSummary = $('#inputReceivableDetailSummary');
        this.$inputReceivableDetailBtn = $('#inputReceivableDetailBtn');
        this.$inputReceivableCode = $('#inputReceivableCode');
        this.$inputReceivableName = $('#inputReceivableName');
        this.$inputReceivableAmount = $('#inputReceivableAmount');
        this.$receivableDebitDisplay = $('#receivableDebitDisplay');
        this.$receivableCreditDisplay = $('#receivableCreditDisplay');
        this.$btnAddReceivable = $('#btnAddReceivable');

        // TAB 3: Table
        this.$tableReceivableBody = $('#receivableTableBody');

        // =====================================
        // TAB 4: SUPPLIER PAYABLES - Input Row Elements
        // =====================================
        this.$inputPayableSupplier = $('#inputPayableSupplier');
        this.$inputPayableSupplierCode = $('#inputPayableSupplierCode');
        this.$inputPayableDetailSummary = $('#inputPayableDetailSummary');
        this.$inputPayableDetailBtn = $('#inputPayableDetailBtn');
        this.$inputPayableAccount = $('#inputPayableAccount');
        this.$inputPayableAccountName = $('#inputPayableAccountName');
        this.$inputPayableAmount = $('#inputPayableAmount');
        this.$inputPayableDebitDisplay = $('#inputPayableDebitDisplay');
        this.$inputPayableCreditDisplay = $('#inputPayableCreditDisplay');
        this.$btnAddPayable = $('#addPayableBtn');

        // TAB 4: Table
        this.$tablePayableBody = $('#payableTableBody');

        // =====================================
        // TAB 5: EMPLOYEE PAYABLES - Input Row Elements
        // =====================================
        this.$inputEmployeeDebtEmployee = $('#inputEmployeeDebtEmployee');
        this.$inputEmployeeDebtEmployeeCode = $('#inputEmployeeDebtEmployeeCode');
        this.$inputEmployeeDebtType = $('#inputEmployeeDebtType');
        this.$inputEmployeeDebtAccountCode = $('#inputEmployeeDebtAccountCode');
        this.$inputEmployeeDebtAccountName = $('#inputEmployeeDebtAccountName');
        this.$inputEmployeeDebtAmount = $('#inputEmployeeDebtAmount');
        this.$inputEmployeeDebtDebitDisplay = $('#inputEmployeeDebtDebitDisplay');
        this.$inputEmployeeDebtCreditDisplay = $('#inputEmployeeDebtCreditDisplay');
        this.$btnAddEmployeeDebt = $('#addEmployeeDebtBtn');

        // TAB 5: Table
        this.$tableEmployeeDebtBody = $('#employeeDebtTableBody');

        // =====================================
        // TAB 6: FIXED ASSETS - Input Row Elements
        // =====================================
        this.$inputFixedAssetAccount = $('#account6');
        this.$inputFixedAssetAmount = $('#amount6');
        this.$btnAddFixedAsset = $('#btnAddFixedAsset6');

        // TAB 6: Table
        this.$tableFixedAssetBody = $('#tableBody6');

        // =====================================
        // TAB 7: EXPENSES - Input Row Elements (To be defined)
        // =====================================
        this.$inputExpenseAccount = $('#expenseAccount');
        this.$inputExpenseAmount = $('#expenseAmount');
        this.$btnAddExpense = $('#btnAddExpense');

        // TAB 7: Table
        this.$tableExpenseBody = $('#expenseTableBody');

        // =====================================
        // TAB 8: OWNER EQUITY - Input Row Elements
        // =====================================
        this.$inputEquityAccountCode = $('#inputEquityAccountCode');
        this.$inputEquityAccountName = $('#inputEquityAccountName');
        this.$inputEquityAmount = $('#inputEquityAmount');
        this.$inputEquityBalanceType = $('#inputEquityBalanceType');
        this.$btnAddEquity = $('#btnAddEquity');

        // TAB 8: Table
        this.$tableEquityBody = $('#tableBody8');

        // =====================================
        // MODALS
        // =====================================

        // Bank Account Selection Modal
        this.$modalBankAccount = $('#detailModal');
        this.$modalCurrencyDisplay = $('#modalCurrencyDisplay');
        this.$bankAccountsList = $('#bankAccountsList');
        this.$btnSaveBankAccount = $('#btnSaveBankAccount');

        // Inventory Detail Modal
        this.$modalInventoryDetail = $('#inventoryDetailModal');
        this.$inventoryProduct = $('#inventoryProduct');
        this.$inventoryProductCode = $('#inventoryProductCode');
        this.$inventoryWarehouse = $('#inventoryWarehouse');
        this.$inventoryQuantity = $('#inventoryQuantity');
        this.$inventoryDetailAmount = $('#inventoryDetailAmount');
        this.$inventoryLot = $('#inventoryLot');
        this.$inventorySerial = $('#inventorySerial');
        this.$btnSaveInventoryDetail = $('#btnSaveInventoryDetail');

        // Receivable Detail Modal
        this.$modalReceivableDetail = $('#receivableDetailModal');
        this.$receivablePrepayment = $('#receivablePrepayment');
        this.$invoiceInfoSection = $('#invoiceInfoSection');
        this.$receivableInvoiceNumber = $('#receivableInvoiceNumber');
        this.$receivableInvoiceDate = $('#receivableInvoiceDate');
        this.$receivableDueDate = $('#receivableDueDate');
        this.$receivableDetailAmount = $('#receivableDetailAmount');
        this.$prepaymentNotesSection = $('#prepaymentNotesSection');
        this.$receivablePrepaymentAmount = $('#receivablePrepaymentAmount');
        this.$receivableNotes = $('#receivableNotes');
        this.$btnSaveReceivableDetail = $('#btnSaveReceivableDetail');

        // Payable Detail Modal
        this.$modalPayableDetail = $('#payableDetailModal');
        this.$payablePrepayment = $('#payablePrepayment');
        this.$payableInvoiceInfoSection = $('#payableInvoiceInfoSection');
        this.$payableInvoiceNumber = $('#payableInvoiceNumber');
        this.$payableInvoiceDate = $('#payableInvoiceDate');
        this.$payableDueDate = $('#payableDueDate');
        this.$payableDetailAmount = $('#payableDetailAmount');
        this.$payablePrepaymentNotesSection = $('#payablePrepaymentNotesSection');
        this.$payablePrepaymentAmount = $('#payablePrepaymentAmount');
        this.$payablePrepaymentNotes = $('#payablePrepaymentNotes');
        this.$btnSavePayableDetail = $('#btnSavePayableDetail');

        // Customer Selection Modal
        this.$modalCustomerSelection = $('#customerSelectionModal');
        this.$tableCustomerSelection = $('#tableCustomerSelection');
        this.$btnSelectCustomer = $('#btnSelectCustomer');

        // Supplier Selection Modal
        this.$modalSupplierSelection = $('#supplierSelectionModal');
        this.$tableSupplierSelection = $('#tableSupplierSelection');
        this.$btnSelectSupplier = $('#btnSelectSupplier');

        // Employee Selection Modal
        this.$modalEmployeeSelection = $('#employeeSelectionModal');
        this.$tableEmployeeSelection = $('#tableEmployeeSelection');
        this.$btnSelectEmployee = $('#btnSelectEmployee');

        // Product Selection Modal
        this.$modalProductSelection = $('#productSelectionModal');
        this.$tableProductSelection = $('#tableProductSelection');
        this.$btnSelectProduct = $('#btnSelectProduct');

        // Validation Modal
        this.$modalValidation = $('#validationModal');
        this.$validationTableBody = $('#validationTableBody');
        this.$validationTotalDebit = $('#validationTotalDebit');
        this.$validationTotalCredit = $('#validationTotalCredit');
        this.$validationTotalNet = $('#validationTotalNet');
        this.$validationHintText = $('#validationHintText');
        this.$btnSubmitAnyway = $('#btnSubmitAnyway');
        this.$btnBackToEdit = $('#btnBackToEdit');

        // =====================================
        // BALANCE SUMMARY WIDGET (Right Sidebar)
        // =====================================
        this.$balanceSummaryWidget = $('#balanceSummaryWidget');
        this.$balanceTab1 = $('#balanceTab1');
        this.$balanceTab2 = $('#balanceTab2');
        this.$balanceTab3 = $('#balanceTab3');
        this.$balanceTab4 = $('#balanceTab4');
        this.$balanceTab5 = $('#balanceTab5');
        this.$balanceTab6 = $('#balanceTab6');
        this.$balanceTab7 = $('#balanceTab7');
        this.$balanceTab8 = $('#balanceTab8');
        this.$grandTotal = $('#grandTotal');
        this.$balanceStatus = $('#balanceStatus');
        this.$balanceHint = $('#balanceHint');
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