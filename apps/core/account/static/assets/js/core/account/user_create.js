$(document).ready(function () {
    let first_name = '';
    let last_name = '';
    $('#inp-firstname').change(function () {
        first_name = $(this).val();
        $('#inp-fullname').val(last_name + ' ' + first_name);
    });

    $('#inp-lastname').change(function () {
        last_name = $(this).val();
        $('#inp-fullname').val(last_name + ' ' + first_name);
    });

    $('.btn-icon').on('click', function () {
        $('#user-list_wrapper').css('width', '100%');
        $('.dataTable').css('width', '100%');
    });

    function generateP() {
        var pass = '';
        var str = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 1; i <= 8; i++) {
            var char = Math.floor(Math.random()
                * str.length + 1);
            pass += str.charAt(char)
        }
        return pass;
    }

    $('#auto-create-pw').on('change', function () {
        if ($(this).is(':checked') == true) {
            const pw = generateP()
            $('#password').val(pw);
            $('#password').prop("readonly", true);
            $('#confirm-password').val(pw);
            $('#confirm-password').prop("readonly", true);
            $('#require-change-pw').prop('checked', true);
        } else {
            $('#password').val('');
            $('#password').prop("readonly", false);
            $('#confirm-password').val('');
            $('#confirm-password').prop("readonly", false);
            $('#require-change-pw').prop('checked', false);
        }
    });

    function loadCompanyList() {
        let ele = $('#select-box-company');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('company_list') && Array.isArray(data.company_list)) {
                        // ele.append(`<option>` + `</option>`)
                        data.company_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    loadCompanyList();

    $("#form-create-user").submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        if ($("#password").val() != $("#confirm-password").val()) {
            $.fn.notifyPopup({description: 'mật khẩu không trùng khớp'}, 'warning')
        } else {
            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Đang tạo user"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 3000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyPopup({description: "Thất bại"}, 'failure')
                    }
                )
        }
    });
});
