$(document).ready(function () {
    new $x.cls.file($('#attachment')).init({'name': 'attachment'});

    const urlParams = new URLSearchParams(window.location.search);

    let sale_code_mapped= urlParams.get('sale_code_mapped');
    let type= urlParams.get('type');
    let quotation_object= urlParams.get('quotation_object');
    let sale_order_object= urlParams.get('sale_order_object');
    let ap_mapped_id= urlParams.get('ap_mapped_id');

    sale_code_mapped = sale_code_mapped !== 'undefined' ? JSON.parse(decodeURIComponent(sale_code_mapped)) : null;
    type = type !== 'undefined' ? JSON.parse(decodeURIComponent(type)) : null;
    quotation_object = quotation_object !== 'undefined' ? JSON.parse(decodeURIComponent(quotation_object)) : null;
    sale_order_object = sale_order_object !== 'undefined' ? JSON.parse(decodeURIComponent(sale_order_object)) : null;
    ap_mapped_id = ap_mapped_id !== 'undefined' ? JSON.parse(decodeURIComponent(ap_mapped_id)) : null;

    new PaymentHandle().load(sale_code_mapped, type, quotation_object, sale_order_object, ap_mapped_id);

    $('#form-create-payment').submit(function (event) {
        event.preventDefault();
        let combinesData = new PaymentHandle().combinesData($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
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
});