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
        $('#password').val(generateP());
        $('#password').prop("readonly", true);
    } else {
        $('#password').val('');
        $('#password').prop("readonly", false);
    }
});


$("#form-create-user").submit(function (event) {
    event.preventDefault();
    let csr = $("input[name=csrfmiddlewaretoken]").val();
    let frm = new SetupFormSubmit($(this));
    $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
        .then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if ($('#offcanvasRight .noti-create').css('display') != 'none') {
                        $('.noti-create').hide(500);
                    }
                    $('.alert-success').show(1000);
                    setTimeout(location.reload.bind(location), 3000);
                }
            },
            (errs) => {
                $('.noti-create').show(500);
            }
        )
});