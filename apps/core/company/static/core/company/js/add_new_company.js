$(document).ready(function () {
    $("#frm-add-company").submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr).then((resp) => {
            return $.fn.switcherResp(resp);
        }, (err) => {
            $.fn.notifyPopup({description: err.detail}, 'failure');
        })
    });
});