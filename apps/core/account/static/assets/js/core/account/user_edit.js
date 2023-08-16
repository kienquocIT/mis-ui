let [fNameELe, lNameEle, fullNameEle] = [$('#inp-first_name'), $('#inp-last_name'), $('#inp-full_name')];
fNameELe.on('input', function () {
    fullNameEle.val(`${$(this).val()} ${lNameEle.val()}`)
});
lNameEle.on('input', function () {
    fullNameEle.val(`${$(fNameELe).val()} ${$(this).val()}`)
});

$(document).ready(function () {
    initUserPage();

    $("#form-edit-user").submit(function (event) {
        let url = window.location.pathname.replace('edit', 'detail');
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(url + '/api', frm.dataMethod, frm.dataForm, csr)
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Đang cập nhật"}, 'success')
                    setTimeout(location.reload.bind(location), 1000);
                }
            }, (errs) => {
                // $.fn.notifyB({description: errs.data.errors}, 'failure')
            })
    });
});
