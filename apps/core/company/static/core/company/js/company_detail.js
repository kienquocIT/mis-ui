$(document).ready(function () {
    $("#form-edit-company").submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: resp.detail}, 'success')
                        setTimeout(location.reload.bind(location), 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyPopup({description: errs.detail}, 'failure')
                }
            )
    });
});
