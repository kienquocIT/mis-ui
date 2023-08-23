$(document).ready(function () {
    new AccountHandle().load();

    // Form Create Account
    let frm = $('#form-create-account')
    frm.submit(function (event) {
        event.preventDefault();
        WindowControl.showLoading();
        let combinesData = new AccountHandle().combinesData($(this));
        console.log(combinesData)
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
                    //$.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    });

    let frm_create_contact = $('#frm-create-new-contact');
    frm_create_contact.submit(function (event) {
        event.preventDefault();
        let contact_name = $('#inp-fullname').val();
        let contact_owner = $('#select-box-contact-owner').val();
        let job_title = $('#inp-jobtitle').val();
        let contact_email = $('#inp-email-contact').val();
        let contact_mobile = $('#inp-mobile').val();
        let contact_phone = $('#inp-phone').val();
        let data = {
            'owner': contact_owner,
            'fullname': contact_name,
            'job_title': job_title,
            'email': contact_email,
            'phone': contact_phone,
            'mobile': contact_mobile
        }
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        $.fn.callAjax($(this).attr('data-url'), $(this).attr('data-method'), data, csr).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    //reload select box account owner
                    let id_contact_primary = null;
                    if ($('#datatable_contact_list .contact_primary').length !== 0) {
                        id_contact_primary = $('#datatable_contact_list .contact_primary').attr('data-value');
                    }

                    loadAccountOwner(id_contact_primary);
                    $('#table-offcanvas').empty();
                    $('#table-offcanvas').append(ele_table_offcanvas);

                    // reload datatable contact in offCanvas
                    let table = $('#datatable-add-contact')
                    $.fn.callAjax(table.attr('data-url'), table.attr('data-method')).then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('contact_list_not_map_account')) {
                                config['data'] = resp.data.contact_list_not_map_account;
                            }
                            initDataTableOffCanvas(config, '#datatable-add-contact');
                        }
                    }, (errs) => {
                        initDataTableOffCanvas(config, '#datatable-add-contact');
                    },)

                    $('#modal-add-new-contact').hide();
                    $('#offcanvasRight').offcanvas('show');
                }
            },
            (errs) => {
                //$.fn.notifyB({description: errs.data.errors}, 'failure');
            })
    })
});
