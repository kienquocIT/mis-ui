$(document).ready(function () {
    $("#frm-add-company").submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.notifyPopup({description: resp.detail}, 'success');
                $('#AddCompanyForms').modal('hide');
                setTimeout(location.reload.bind(location), 1000);
            }
        }, (err) => {
            $.fn.notifyPopup({description: err.detail}, 'failure');
        })
    });
});