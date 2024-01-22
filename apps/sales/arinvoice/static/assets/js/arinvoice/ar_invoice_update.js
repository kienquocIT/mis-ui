$(document).ready(function () {
    new ARInvoiceHandle().load();

    LoadDetailARInvoice('update');

    let pk = $.fn.getPkDetail();
    $('#form-detail-ar-invoice').submit(function (event) {
        event.preventDefault();
        let combinesData = new ARInvoiceHandle().combinesData($(this), true);
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect').format_url_with_uuid(pk));
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
})