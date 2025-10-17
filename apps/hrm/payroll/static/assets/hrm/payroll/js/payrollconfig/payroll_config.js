$(document).ready(function () {
    UsualLoadPageFunction.LoadDate({element: payrollConfigElements.$effectiveDate, empty: true});
    PayrollConfigDataHandler.initTaxBracketTable();
    PayrollConfigDataHandler.loadDetailPayrollConfig();

    payrollConfigElements.$frmPayrollConfig.on('submit', function (e) {
        e.preventDefault();
        let _form = new SetupFormSubmit($(this));
        try {
            PayrollConfigDataHandler.combinePayrollConfigData(_form);  // combine data
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid input',
                text: error.message
            });
            return;
        }

        let csr = $("[name=csrfmiddlewaretoken]").val();

        $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success');
                        $.fn.redirectUrl($(this).attr('data-url-redirect'), 1000);
                        PayrollConfigDataHandler.loadDetailPayrollConfig();
                    }
                },
                (errs) => {
                    console.log(errs);
                }
            );
    });

    $('#btn_update_payroll_config').on('click', function () {
        payrollConfigElements.$frmPayrollConfig.submit();
    });
});
