const year = new Date().getFullYear()
$('.year').text(year%100)
let invoice_signs_Ele = $('#invoice_signs')
const invoice_signs = invoice_signs_Ele.text() ? JSON.parse(invoice_signs_Ele.text()) : {};

if (invoice_signs?.['one_vat_sign']) {
    $('#sign-1-vat').val(invoice_signs?.['one_vat_sign'].slice(-2))
}
if (invoice_signs?.['many_vat_sign']) {
    $('#sign-n-vat').val(invoice_signs?.['many_vat_sign'].slice(-2))
}

function combinesDataCreate(frmEle) {
    let frm = new SetupFormSubmit($(frmEle));

    frm.dataForm['one_vat_sign'] = $('#sign-1-vat').val();
    frm.dataForm['many_vat_sign'] = $('#sign-n-vat').val();

    return {
        url: frm.dataUrl,
        method: frm.dataMethod,
        data: frm.dataForm,
        urlRedirect: frm.dataUrlRedirect,
    };
}

$('#form-invoice-sign').submit(function (event) {
    event.preventDefault();
    let combinesDataCre = combinesDataCreate($(this));
    if (combinesDataCre) {
        WindowControl.showLoading();
        $.fn.callAjax2(combinesDataCre).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    setTimeout(() => {
                        window.location.replace($(this).attr('data-url-redirect'));
                        location.reload.bind(location);
                    }, 1000);
                }
            },
            (errs) => {
                setTimeout(
                    () => {
                        WindowControl.hideLoading();
                    },
                    1000
                )
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            }
        )
    }
})