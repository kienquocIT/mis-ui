$(document).ready(function () {
    $("#frm-add-company").submit(function (event) {
    event.preventDefault();
    let csr = $("input[name=csrfmiddlewaretoken]").val();
    let frm = new SetupFormSubmit($(this));
    $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
        .then(
            (resp) => {
                $.fn.notifyPopup({description: resp.detail}, 'success');
                $('#AddCompanyForms').modal('hide');
                location.reload();
            },
            (errs) => {
                $.fn.notifyPopup({description: errs.detail}, 'failure');
            }
        )
});
});