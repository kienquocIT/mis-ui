$(document).ready(function () {
    UsualLoadPageFunction.LoadDate({element: pageElements.$effectiveDate, empty: true});
    PayrollConfigDataHandler.initTaxBracketTable();
    $('#frm_payroll_config').submit(function (e) {
        e.preventDefault()
        let _form = new SetupFormSubmit($(this));
        let csr = $("[name=csrfmiddlewaretoken]").val();
        $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success');
                        $.fn.redirectUrl($(this).attr('data-url-redirect'), 1000);
                    }
                },
                (errs) => {
                    console.log(errs);
                }
            )
    });
});
