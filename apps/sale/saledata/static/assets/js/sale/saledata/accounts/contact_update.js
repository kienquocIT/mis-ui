$(document).ready(function () {
    let option_emp = [{'val': '', 'text': ''}];

    function loadSalutationList() {
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
                            if (item.id === $('#salutation_current').val()) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                            }
                            else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    function loadInterestList() {
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
                        let array = $('#interests_current').val();
                        data.interests_list.map(function (item) {
                            if (array.includes(item.id)) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                            }
                            else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    function loadEmployee() {
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
                            if (item.id === $('#owner_current').val()) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.full_name + `</option>`)
                            }
                            else {
                                ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
                            }
                            option_emp.push({'val':item.id, 'text': item.full_name })
                        })
                    }
                }
            }
        )
    }

    function loadEmployeeForReportTo() {
        let ele = $('#select-box-report-to');
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
                            if (item.id === $('#report_to_current').val()) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.full_name + `</option>`)
                            }
                            else {
                                ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    function loadAccountName() {
        let ele = $('#select-box-account_name');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                        ele.append(`<option selected>` + `</option>`)
                        data.account_list.map(function (item) {
                            if (item.id === $('#account_name_id').val()) {
                                ele.append(`<option selected value="` + item.id + `">` + item.name + `</option>`)
                            }
                            else {
                                ele.append(`<option value="` + item.id + `">` + item.name + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    function loadDefaultData() {
        $('#input-avatar').on('change', function (ev) {
            let upload_img = $('#upload-area');
            upload_img.text("");
            tmp = URL.createObjectURL(this.files[0])
            upload_img.css('background-image', "url(" + URL.createObjectURL(this.files[0]) + ")");
            $(this).val()
        });
        $('#upload-area').click(function (e) {
            $('#input-avatar').click();
        });

        $('#select-box-interests').select2();

        loadSalutationList();
        loadInterestList();
        loadEmployee();
        loadEmployeeForReportTo();
        loadAccountName();
    }

    loadDefaultData();

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
            delete frm.dataForm['account_name'];
        }

        if (frm.dataForm['report_to'] === '') {
            delete frm.dataForm['report_to'];
        }

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    $.fn.notifyPopup({description: resp.detail}, 'success');
                    setTimeout(location.reload.bind(location), 1000);
                    window.location.replace("/saledata/contacts");
                }, (err) => {
                    $.fn.notifyPopup({description: err.detail}, 'failure');
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
