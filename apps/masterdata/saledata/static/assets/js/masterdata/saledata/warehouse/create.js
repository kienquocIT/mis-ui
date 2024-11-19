$(document).ready(function () {
    WarehouseLoadPage.loadCities();
    WarehouseLoadPage.loadDistrict();
    WarehouseLoadPage.loadWard();
    WarehouseLoadPage.loadAgency();

    eventPage();

    const frmCreate = $('#frmCreate');
    new SetupFormSubmit(frmCreate).validate({
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
                required: function () {
                    return !$('#checkDropShip').is(':checked');
                },
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
    }
    );
})