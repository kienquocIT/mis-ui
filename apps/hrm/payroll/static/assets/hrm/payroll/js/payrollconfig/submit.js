$(document).ready(function() {
    UsualLoadPageFunction.LoadDate({element: pageElements.$effectiveDate, empty: true});
    PayrollConfigPersonalTaxHandler.initTaxBracketTable();

    $('#frm_payroll_config').validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm['insurance_data'] = PayrollConfigInsuranceHandler.combineInsuranceData();
            frm.dataForm['personal_income_tax'] = PayrollConfigPersonalTaxHandler.combinePersonalIncomeTaxData();
            frm.dataForm['tax_bracket_data'] = PayrollConfigPersonalTaxHandler.combineTaxBracketData();
            if (frm) {
                 WFRTControl.callWFSubmitForm(frm);
            }
        }
    });
});
