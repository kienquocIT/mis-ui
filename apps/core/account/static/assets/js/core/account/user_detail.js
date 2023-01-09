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

    function loadCompanyList(ele) {
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('company_list') && Array.isArray(data.company_list)) {
                        data.company_list.map(function (item) {
                            if(item.id == $('#id_user').val()){
                                ele.append(`<option selected value="` + item.id + `">` + item.title + `</option>`)
                            }
                            else{
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    loadCompanyList($('#select-box-company'));
    loadCompanyList($('#select-box-edit'));


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
                        setTimeout(location.reload.bind(location), 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyPopup({description: "Thất bại"}, 'failure')
                }
            )
    });
});