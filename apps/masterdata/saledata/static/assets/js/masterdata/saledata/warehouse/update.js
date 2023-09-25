$(document).ready(function (){
    let frm = $('#frmUpdate');
    let pk = $.fn.getPkDetail();
    WarehouseLoadPage.loadAgency();

    WarehouseLoadPage.loadDetail(frm, pk);

    eventPage();

    SetupFormSubmit.validate(
        frm,
        {
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                let data = WarehouseLoadPage.getFormDataUpdate();
                $.fn.callAjax2({
                    url: frm.getUrlDetail(pk),
                    method: 'PUT',
                    data: data,
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                        setTimeout(() => {
                            window.location.href = frm.dataUrlRedirect;
                        }, 1000)
                    }
                }, (errs) => {
                    $.fn.switcherResp(errs);
                })
            }
        }
    );
})