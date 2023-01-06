$(document).ready(function () {
    $("#frm-add-company").submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.status === 201) {
                    $.fn.notifyPopup({description: 'Create successfully'}, 'success');
                }
                $('#AddCompanyForms').modal('hide');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        })
    });
});