$(document).ready(function () {
    WarehouseLoadPage.loadCities();
    WarehouseLoadPage.loadDistrict();
    WarehouseLoadPage.loadWard();
    WarehouseLoadPage.loadAgency();

    eventPage();

    const frmCreate = $('#frmCreate');
    SetupFormSubmit.validate(
        frmCreate,
        {
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                let data = WarehouseLoadPage.getFormDataCreate();
                $.fn.callAjax2({
                    url: frm.dataUrl,
                    method: frm.dataMethod,
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