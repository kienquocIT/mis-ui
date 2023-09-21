$(document).ready(function () {
    let first_name = '';
    let last_name = '';
    $('#inp-firstname').change(function () {
        first_name = $(this).val();
        $('#inp-fullname').val(`{0} {1}`.format_by_idx(last_name, first_name));
    });

    $('#inp-lastname').change(function () {
        last_name = $(this).val();
        $('#inp-fullname').val(`{0} {1}`.format_by_idx(last_name, first_name));
    });

    $('.btn-icon').on('click', function () {
        $('#user-list_wrapper').css('width', '100%');
        $('.dataTable').css('width', '100%');
    });

    function generatePW() {
        let pass = '';
        let str = 'abcdefghijklmnopqrstuvwxyz';

        for (let i = 1; i <= 6; i++) {
            let char = Math.floor(Math.random()
                * str.length + 1);
            pass += str.charAt(char)
        }

        let str_num = '0123456789'
        for (let i = 1; i <= 2; i++) {
            let char = Math.floor(Math.random()
                * str_num.length + 1);
            pass += str_num.charAt(char)
        }
        pass = pass.split('').sort(function () {
            return 0.5 - Math.random()
        }).join('');
        return pass;
    }

    $('#auto-create-pw').on('change', function () {
        let passwordEle = $('#mypassword');
        let confirmPasswordEle = $('#confirm-password');
        if ($(this).is(':checked') === true) {
            const pw = generatePW();
            passwordEle.val(pw);
            passwordEle.prop("readonly", true);
            confirmPasswordEle.val(pw);
            confirmPasswordEle.prop("readonly", true);
            $('#require-change-pw').prop('checked', true);
        } else {
            passwordEle.val('');
            passwordEle.prop("readonly", false);
            confirmPasswordEle.val('');
            confirmPasswordEle.prop("readonly", false);
            $('#require-change-pw').prop('checked', false);
        }
    });

    function loadCompanySelectEle(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    loadCompanySelectEle($('#select-box-company'));

    let msgEle = $('#trans-factory');
    let frm = $('#form-create-user');
    new SetupFormSubmit(frm).validate(
        {
            rules: {
                'mypassword': {
                    required: true,
                    minlength: 6,
                },
                'confirm_password': {
                    required: true,
                    equalTo: '#mypassword',
                }
            },
            messages: {
                'confirm_password': {
                    equalTo: msgEle.data('msg-password-not-match'),
                }
            },
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                let bodyData = frm.dataForm;
                bodyData['password'] = frm.dataForm['mypassword'];
                return $.fn.callAjax2({
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: bodyData,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            }
        }
    );
    // frm.validate({
    //     rules: {
    //         'mypassword': {
    //             required: true,
    //             minlength: 6,
    //         },
    //         'confirm_password': {
    //             equalTo: '#mypassword',
    //         }
    //     },
    // })
});
