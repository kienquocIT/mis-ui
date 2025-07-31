$(document).ready(function () {
    ShiftLoadDataHandle.initPage();
    ShiftLoadEventHandler.InitPageEvent();

    let frm_shift = $('#form-shift')
    new SetupFormSubmit(frm_shift).validate({
        rules: {
            title: {
                required: true,
                maxlength: 100
            },
            checkin_time: {
                required: true
            },
            checkout_time: {
                required: true
            }
        },
        submitHandler: function (form) {
            if ($('#shift-modal-title').attr('data-id') === '') {
                WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
                let frm = new SetupFormSubmit($(form));
                $.fn.callAjax2({
                    'url': frm.dataUrl,
                    'method': "POST",
                    'data': ShiftLoadDataHandle.combineDataForm(),
                    'url_redirect': frm.dataUrlRedirect,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Create new shift successfully"}, 'success');
                            setTimeout(function () {
                                window.location.href = frm.dataUrlRedirect;
                            }, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                        WindowControl.hideLoading();
                    }
                )
            } else {
                WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
                let frm = new SetupFormSubmit($(form));
                $.fn.callAjax2({
                    'url': frm_shift.attr('data-url-detail').replace("0", $('#shift-modal-title').attr('data-id')),
                    'method': "PUT",
                    'data': ShiftLoadDataHandle.combineDataForm(),
                    'url_redirect': frm.dataUrlRedirect,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Update new shift successfully"}, 'success');
                            setTimeout(function () {
                                window.location.href = frm.dataUrlRedirect;
                            }, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                        WindowControl.hideLoading();
                    }
                )
            }
        }
    })
})
