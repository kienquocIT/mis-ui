$(document).ready(function () {
    // WarehouseLoadPage.loadCities();
    // WarehouseLoadPage.loadDistrict();
    // WarehouseLoadPage.loadWard();
    // for location
    UsualLoadPageFunction.LoadLocationCountry($('#modalWarehouseAddress .location_country'))
    UsualLoadPageFunction.LoadLocationProvince($('#modalWarehouseAddress .location_province'))
    UsualLoadPageFunction.LoadLocationWard($('#modalWarehouseAddress .location_ward'))


    eventPage();

    const frmCreate = $('#frmCreate');
    new SetupFormSubmit(frmCreate).validate({
        rules: {
            title: {
                required: true,
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let data = WarehouseLoadPage.getFormData();
            $.fn.callAjax2({
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: data,
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: $.fn.transEle.attr('data-success')}, 'success');
                    setTimeout(() => {
                        window.location.href = frm.dataUrlRedirect;
                    }, 1000)
                }
            }, (errs) => {
                $.fn.switcherResp(errs);
            })
        }
    });
})