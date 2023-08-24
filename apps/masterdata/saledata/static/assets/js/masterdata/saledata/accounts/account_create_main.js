$(document).ready(function () {
    new AccountHandle().load();

    // Form Create Account
    let frm = $('#form-create-account')
    frm.submit(function (event) {
        event.preventDefault();
        let combinesData = new AccountHandle().combinesData($(this));
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
                        // $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    });

    let frm_create_contact = $('#frm-create-new-contact');
    frm_create_contact.submit(function (event) {
        event.preventDefault();
        let data = {
            'owner': $('#select-box-contact-owner').val(),
            'fullname': $('#inp-fullname').val(),
            'job_title': $('#inp-jobtitle').val(),
            'email': $('#inp-email-contact').val(),
            'phone': $('#inp-phone').val(),
            'mobile': $('#inp-mobile').val()
        }
        let combinesData = {
            url: $(this).attr('data-url'),
            method: $(this).attr('data-method'),
            data: data,
        }
        WindowControl.showLoading();
        $.fn.callAjax2(combinesData).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#modal-add-new-contact').hide();
                    $('#offcanvasRight').offcanvas('show');
                    loadTableSelectContact();
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
                // $.fn.notifyB({description: errs.data.errors}, 'failure');
            })
    })
});
