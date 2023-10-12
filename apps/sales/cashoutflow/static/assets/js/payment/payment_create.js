$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    let sale_code_mapped = JSON.parse(decodeURIComponent(urlParams.get('sale_code_mapped')));
    let type = JSON.parse(decodeURIComponent(urlParams.get('type')));
    const opportunity_mapped = JSON.parse(decodeURIComponent(urlParams.get('opportunity')));
    if (opportunity_mapped !== null) {
        sale_code_mapped = opportunity_mapped.id;
        type = 2;
    }

    new PaymentHandle().load(sale_code_mapped, type);

    $('#form-create-payment').submit(function (event) {
        event.preventDefault();
        let combinesData = new PaymentHandle().combinesData($(this));
        console.log(combinesData)
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