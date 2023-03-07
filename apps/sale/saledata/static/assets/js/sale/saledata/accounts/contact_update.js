$(document).ready(function () {
    let option_emp = [{'val': '', 'text': ''}];

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
                        ele.append(`<option>` + `</option>`)
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
                            option_emp.push({'val': item.id, 'text': item.full_name})
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
                    resp.data.account_detail.owner.map(function (item) {
                    })
                    ele.text("");
                    ele.append(`<option selected>` + `</option>`)
                    data.account_detail.owner.map(function (item) {
                        if (item.id === id_report_to) {
                            ele.append(`<option value="` + item.id + `" selected>` + item.fullname + `</option>`)
                        } else {
                            ele.append(`<option value="` + item.id + `">` + item.fullname + `</option>`)
                        }

                    })
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
        let url_loaded = $('#form-create-contact').attr('data-url-loaded').replace(0, pk);

        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    loadEmployee(data.contact_detail.owner.id);
                    loadSalutationList(data.contact_detail.salutation.id);
                    loadAccountName(data.contact_detail.account_name.id, data.contact_detail.report_to.id);
                    $('#first_name_id').val(data.contact_detail.fullname.first_name);
                    $('#last_name_id').val(data.contact_detail.fullname.last_name);
                    $('#full_name_id').val(data.contact_detail.fullname.fullname);
                    $('#text-bio').val(data.contact_detail.bio);
                    $('#inp-phone').val(data.contact_detail.phone);
                    $('#inp-mobile').val(data.contact_detail.mobile);
                    $('#inp-email').val(data.contact_detail.email);
                    $('#inp-jobtitle').val(data.contact_detail.job_title);
                    $('#work_address_id').val(data.contact_detail.address_infor.work_address);
                    $('#home_address_id').val(data.contact_detail.address_infor.home_address);
                    loadInterestList(data.contact_detail.additional_infor.map(obj => obj.id));
                    $('#tag_id').val(data.contact_detail.additional_infor.tags);
                    $('#facebook_id').val(data.contact_detail.additional_infor.facebook);
                    $('#gmail_id').val(data.contact_detail.additional_infor.gmail);
                    $('#linkedln_id').val(data.contact_detail.additional_infor.linkedln);
                    $('#twitter_id').val(data.contact_detail.additional_infor.twitter);

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

    // remove employee in onwer (selected in report to)
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

    $('#save-contact').on('click', function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($('#form-create-contact'));
        frm.dataForm['additional_infor'] = {
            'facebook': $('#facebook_id').val(),
            'twitter': $('#twitter_id').val(),
            'linkedln': $('#linkedln_id').val(),
            'gmail': $('#gmail_id').val(),
            'interests': $('#select-box-interests').val(),
            'tags': $('#tag_id').val(),
        };

        frm.dataForm['address_infor'] = {
            'work_address': $('#work_address_id').val(),
            'home_address': $('#home_address_id').val(),
        };

        if (frm.dataForm['account_name'] === '') {
            frm.dataForm['account_name'] = null;
        }

        if (frm.dataForm['report_to'] === '') {
            frm.dataForm['report_to'] = null;
        }

        if (frm.dataForm['owner'] === '') {
            frm.dataForm['owner'] = null;
        }

        if (frm.dataForm['email'] === '') {
            frm.dataForm['email'] = null;
        }

        if (frm.dataForm['mobile'] === '') {
            frm.dataForm['mobile'] = null;
        }

        let pk = window.location.pathname.split('/').pop();

        $.fn.callAjax(frm.dataUrl.replace('0', pk), frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    $.fn.notifyPopup({description: resp.detail}, 'success');
                    setTimeout(location.reload.bind(location), 1000);
                    window.location.replace("/saledata/contacts");
                }, (err) => {
                    // $.fn.notifyPopup({description: err.detail}, 'failure');
                }
            )
    })
})


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
