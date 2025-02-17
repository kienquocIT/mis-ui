$(document).ready(function () {
    let zoomConfigEle = $('#zoom_config')
    const zoom_config = zoomConfigEle.text() ? JSON.parse(zoomConfigEle.text()) : {};
    if (Object.keys(zoom_config).length !== 0) {
        $('#1-existing-config').prop('hidden', false)
    }

    function combinesDataCreateMeetingZoomConfig(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['account_email'] = $('#zoom-account-email').val();
        frm.dataForm['account_id'] = $('#zoom-account-id').val();
        frm.dataForm['client_id'] = $('#zoom-client-id').val();
        frm.dataForm['client_secret'] = $('#zoom-client-secret').val();
        frm.dataForm['personal_meeting_id'] = $('#zoom-personal-meeting-id').val();

        console.log(frm.dataForm)
        if (for_update) {
            let pk = $.fn.getPkDetail();
            return {
                url: frmEle.attr('data-url-detail').format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-create-zoom-config').submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataCreateMeetingZoomConfig($(this));
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