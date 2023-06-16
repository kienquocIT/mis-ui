$(document).ready(function () {
    let option_emp = [
        {
            'val': '',
            'text': ''
        }
    ];

    let frmEle = $("#form-create-contact");

    function loadSalutationList(id) {
        let ele = $('#select-box-salutation');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('salutation_list') && Array.isArray(data.salutation_list)) {
                        ele.append(`<option>` + `</option>`)
                        data.salutation_list.map(function (item) {
                            if (item.id === id) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    function loadInterestList(list_id) {
        let ele = $('#select-box-interests');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('interests_list') && Array.isArray(data.interests_list)) {
                        data.interests_list.map(function (item) {
                            if (list_id.includes(item.id)) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    function loadEmployee(id) {
        let ele = $('#select-box-emp');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        ele.append(`<option>` + `</option>`)
                        data.employee_list.map(function (item) {
                            if (item.id === id) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.full_name + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
                            }
                            option_emp.push({
                                'val': item.id,
                                'text': item.full_name
                            })
                        })
                    }
                }
            }
        )
    }

    function loadAccountName(id, id_report_to) {
        let ele = $('#select-box-account_name');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                        ele.append(`<option>` + `</option>`)
                        data.account_list.map(function (item) {
                            if (item.id === id) {
                                loadReportTo(id, id_report_to);
                                ele.append(`<option selected value="` + item.id + `">` + item.name + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.name + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    function loadReportTo(id, id_report_to) {
        let ele = $('#select-box-report-to');
        ele.attr('disabled', false);
        let url = ele.attr('data-url').replace('0', id);
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option selected>` + `</option>`)
                    for (let i = 0; i < data.account_detail.contact_mapped.length; i++) {
                        let contact_mapped = data.account_detail.contact_mapped[i];
                        if (contact_mapped.id === id_report_to) {
                            ele.append(`<option value="` + contact_mapped.id + `" selected>` + contact_mapped.fullname + `</option>`)
                        } else {
                            ele.append(`<option value="` + contact_mapped.id + `">` + contact_mapped.fullname + `</option>`)
                        }
                    }
                }
            }
        )
    }

    function loadDefaultData() {
        $('#input-avatar').on('change', function () {
            let upload_img = $('#upload-area');
            upload_img.text("");
            tmp = URL.createObjectURL(this.files[0])
            upload_img.css('background-image', "url(" + URL.createObjectURL(this.files[0]) + ")");
            $(this).val()
        });
        $('#upload-area').click(function () {
            $('#input-avatar').click();
        });

        $('#select-box-interests').select2();

        let pk = window.location.pathname.split('/').pop();
        let url_loaded = frmEle.attr('data-url-loaded').replace(0, pk);

        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let contact_detail = data?.['contact_detail'];
                    $.fn.compareStatusShowPageAction(contact_detail);

                    loadEmployee(contact_detail.owner.id);
                    loadSalutationList(contact_detail.salutation.id);
                    loadAccountName(contact_detail.account_name.id, contact_detail.report_to.id);
                    $('#first_name_id').val(contact_detail.fullname.first_name);
                    $('#last_name_id').val(contact_detail.fullname.last_name);
                    $('#full_name_id').val(contact_detail.fullname.fullname);
                    $('#text-bio').val(contact_detail.biography);
                    $('#inp-phone').val(contact_detail.phone);
                    $('#inp-mobile').val(contact_detail.mobile);
                    $('#inp-email').val(contact_detail.email);
                    $('#inp-jobtitle').val(contact_detail.job_title);
                    $('#work_address_id').val(contact_detail.address_information.work_address);
                    $('#home_address_id').val(contact_detail.address_information.home_address);
                    if (Object.keys(contact_detail.additional_information).length > 0) {
                        loadInterestList(contact_detail.additional_information.interests.map(obj => obj.id));
                        $('#tag_id').val(contact_detail.additional_information.tags);
                        $('#facebook_id').val(contact_detail.additional_information.facebook);
                        $('#gmail_id').val(contact_detail.additional_information.gmail);
                        $('#linkedln_id').val(contact_detail.additional_information.linkedln);
                        $('#twitter_id').val(contact_detail.additional_information.twitter);
                    } else {
                        loadInterestList([]);
                    }
                    $.fn.setWFRuntimeID(data?.['contact_detail']?.['workflow_runtime_id']);
                }
            }
        )

    }

    loadDefaultData();

    //load report to while change select box account name
    $('#select-box-account_name').on('change', function () {
        let account_id = $(this).find('option:selected').val();
        let ele = $('#select-box-report-to');
        ele.empty();
        if (account_id !== '') {
            ele.attr('disabled', false);
            loadReportTo(account_id);
        } else {
            ele.attr('disabled', true);
        }
    })

    // remove employee in report to (selected in owner)
    $('#select-box-emp').on('change', function () {
        let id_emp = $(this).val();
        let ele = $('#select-box-report-to');
        let selected = ele.val()
        ele.empty();
        option_emp.map(function (item) {
            ele.append(`<option value="` + item.val + `">` + item.text + `</option>`)
        })
        ele.val(selected)
        $(`#select-box-report-to option[value="` + id_emp + `"]`).remove();
    });

    // remove employee in owner (selected in report to)
    $('#select-box-report-to').on('change', function () {
        let id_emp = $(this).val()
        let ele = $('#select-box-emp');
        let selected = ele.val()
        ele.empty();
        option_emp.map(function (item) {
            ele.append(`<option value="` + item.val + `">` + item.text + `</option>`)
        })
        ele.val(selected)
        $(`#select-box-emp option[value="` + id_emp + `"]`).remove();
    });

    frmEle.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit(frmEle);
        frm.dataForm['additional_information'] = {
            'facebook': $('#facebook_id').val(),
            'twitter': $('#twitter_id').val(),
            'linkedln': $('#linkedln_id').val(),
            'gmail': $('#gmail_id').val(),
            'interests': $('#select-box-interests').val(),
            'tags': $('#tag_id').val(),
        };

        frm.dataForm['address_information'] = {
            'work_address': $('#work_address_id').val(),
            'home_address': $('#home_address_id').val(),
        };

        if (frm.dataForm['account_name'] === '') {
            delete frm.dataForm['account_name'];
        }

        if (frm.dataForm['report_to'] === '') {
            delete frm.dataForm['report_to'];
        }

        if (frm.dataForm['owner'] === '') {
            frm.dataForm['owner'] = null;
        }

        if (frm.dataForm['email'] === '') {
            delete frm.dataForm['email'];
        }

        if (frm.dataForm['mobile'] === '') {
            delete frm.dataForm['mobile'];
        }

        let pk = window.location.pathname.split('/').pop();

        $.fn.showLoading();
        $.fn.callAjax(frm.dataUrl.replace('0', pk), frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && data['status'] === 200) {
                        $.fn.notifyB({description: $('#base-trans-factory').attr('data-success')}, 'success');
                        setTimeout(
                            () => {
                                // window.location.replace("/saledata/contacts");
                                // location.reload.bind(location)
                                window.location.reload();
                            }, 1000
                        );
                    }
                    setTimeout(
                        () => {
                            $.fn.hideLoading();
                        },
                        1000
                    )
                }, (err) => {
                    $.fn.notifyPopup({description: err.detail}, 'failure');
                }
            )
    });
});


$("#first_name_id").on('change', function () {
    if ($(this).val() !== '' && $("#last_name_id").val() !== '') {
        $("#full_name_id").val($(this).val() + ' ' + $("#last_name_id").val())
    }
})
$("#last_name_id").on('change', function () {
    if ($("#first_name_id").val() !== '' && $(this).val() !== '') {
        $("#full_name_id").val($("#first_name_id").val() + ' ' + $(this).val())
    }
})
