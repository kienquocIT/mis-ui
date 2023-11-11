$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pqr_id = urlParams.get('pqr_id');
    const pqr_title = urlParams.get('pqr_title');
    let param_PQR = null;
    if (pqr_id !== null && pqr_title !== null) {
        param_PQR = {
            'id': pqr_id,
            'title': pqr_title,
            'is_param': true
        }
    }

    new PQHandle().load(param_PQR);

    $('#form-create-purchase-quotation').submit(function (event) {
        event.preventDefault();
        let combinesData = new PQHandle().combinesData($(this));
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
})