$(document).ready(function () {
    InitialBalanceHandler.LoadDetailInitialBalance('update');
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


    function CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));
        let dataForm = {};
        dataForm["title"] = pageElements.$titleEle.val();
        dataForm["description"] = pageElements.$descriptionEle.val();
        dataForm["tab_money_data"] = TabMoneyFunction.combineTabCashData();
        return {
            url: frm.dataUrl,
            method: 'PUT',
            data: dataForm,
        };
    }

    $('#frm_detail_initial_balance').submit(function (event) {
        event.preventDefault();
        let combinesData = CombinesData($(this));
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'))
                                location.reload.bind(location)
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(() => {
                                WindowControl.hideLoading();
                            },1000);
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                );
        }
    });
});
