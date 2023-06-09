$(document).ready(function () {

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
                        ele.append(`<option selected></option>`)
                        data.salutation_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
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
                        ele.append(`<option></option>`)
                        data.interests_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
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
                        ele.append(`<option selected></option>`)
                        data.employee_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
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
                            ele.append(`<option value="` + item.id + `">` + item.name + `</option>`)
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
        loadAccountName();
    }

    loadDefaultData();

    //load report to while change select box account name
    $('#select-box-account_name').on('change', function () {
        let account_id = $(this).find('option:selected').val();
        let ele = $('#select-box-report-to');
        ele.empty();
        if (account_id !== '') {
            ele.attr('disabled', false);
            let url = ele.attr('data-url').replace('0', account_id);
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
                            ele.append(`<option value="` + item.id + `">` + item.fullname + `</option>`)
                        })
                    }
                }
            )
        } else {
            ele.attr('disabled', true);
        }
    })

    $('#save-contact').on('click', function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($('#form-create-contact'));
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

        frm.dataForm['system_status'] = 1; // save, not draft

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    $.fn.notifyPopup({description: resp.detail}, 'success');
                    setTimeout(location.reload.bind(location), 1000);
                    window.location.replace(frm.dataUrlRedirect);
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
