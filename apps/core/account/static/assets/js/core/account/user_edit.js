let [fNameELe, lNameEle, fullNameEle] = [$('#inp-first_name'), $('#inp-last_name'), $('#inp-full_name')];
fNameELe.on('input', function () {
    fullNameEle.val(`${$(this).val()} ${lNameEle.val()}`)
});
lNameEle.on('input', function () {
    fullNameEle.val(`${$(fNameELe).val()} ${$(this).val()}`)
});

$(document).ready(function () {
    initUserPage();
    const pk = $.fn.getPkDetail()
    let frm = $("#form-edit-user");
    SetupFormSubmit.validate(
        frm,
        {
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                $.fn.callAjax2({
                    url: frm.dataUrl.format_url_with_uuid(pk),
                    method: frm.dataMethod,
                    data: frm.dataForm
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $.fn.transEle.attr('data-success')}, 'success')
                        setTimeout(location.reload.bind(location), 1000);
                    }
                }, (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                })
            }
        });
});
