$(document).ready(function () {
    let frm = $('#frmUpdate');
    let pk = $.fn.getPkDetail();
    WarehouseLoadPage.loadAgency();

    WarehouseLoadPage.loadDetail(frm, pk);

    eventPage();

    new SetupFormSubmit(frm).validate({
            rules: {
                title: {
                    required: true,
                },
                agency: {
                    required: function () {
                        return $('#checkAgencyLocation').is(':checked');
                    },
                },
                full_address: {
                    required: true,
                }
            },
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