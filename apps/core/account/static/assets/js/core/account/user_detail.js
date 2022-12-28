$(document).ready(function () {
    let first_name = $('#form-firstname').val();
    let last_name = $('#form-lastname').val();
    $('#form-firstname').change(function () {
        first_name = $(this).val();
        $('#form-fullname').val(last_name + ' ' + first_name);
    });

    $('#form-lastname').change(function () {
        last_name = $(this).val();
        $('#form-fullname').val(last_name + ' ' + first_name);
    });


    $('#inp-fullname').val($('#inp-lastname').val() + ' ' + $('#inp-firstname').val());
    $('#form-fullname').val($('#form-lastname').val() + ' ' + $('#form-firstname').val());
    $("#form-edit-user").submit(function (event) {
        url = location.pathname;
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(url, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Đang cập nhật"}, 'success')
                        setTimeout(location.reload.bind(location), 2000);
                    }
                },
                (errs) => {
                    $.fn.notifyPopup({description: "Thất bại"}, 'failure')
                }
            )
    });
});