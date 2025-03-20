$(document).ready(function () {
    let company_config = JSON.parse($('#company_config').text())
    let type = company_config?.['accounting_policies']
    let circular = company_config?.['applicable_circular']
    if (type === 1) {
        $('#ias').prop('checked', true)
    }
    else {
        $('#vas').prop('checked', true)
    }
    if (circular === 1) {
        $('#circular133').prop('checked', true)
    }
    else {
        $('#circular200').prop('checked', true)
    }

    function combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['accounting_policies'] = $('#vas').prop('checked') ? 0 : 1
        frm.dataForm['applicable_circular'] = $('#circular200').prop('checked') ? 0 : 1

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $("#form-accounting-policies").submit(function (event) {
        event.preventDefault();
        let combinedData = combinesData($(this));
        if (combinedData) {
            WindowControl.showLoading({'loadingTitleAction': 'UPDATE'})
            $.fn.callAjax2(combinedData)
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
                        console.log(errs)
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })
});