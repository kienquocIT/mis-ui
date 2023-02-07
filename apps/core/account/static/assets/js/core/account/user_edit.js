
function loadUserDetail() {
    let url = window.location.pathname.replace('edit', 'detail');
    $.fn.callAjax(url + '/api', 'GET')
        .then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#inp-company_current_id').val(data.user.company_current_id);
                    $('#inp-first_name').val(data.user.first_name);
                    $('#inp-last_name').val(data.user.last_name);
                    $('#inp-full_name').val(data.user.full_name);
                    $('#inp-email').val(data.user.email);
                    $('#inp-phone').val(data.user.phone);
                }
            },
        )
}

loadUserDetail();

function getFullName() {
    let first_name = $('#inp-first_name').val();
    let last_name =$('#inp-last_name').val();
    $('#inp-first_name').change(function () {
        first_name = $(this).val();
        $('#inp-full_name').val(last_name + ' ' + first_name);
    });

    $('#inp-last_name').change(function () {
        last_name = $(this).val();
        $('#inp-full_name').val(last_name + ' ' + first_name);
    });
}
getFullName();
$(document).ready(function (){
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
                            if (item.id == $('#inp-company_current_id').val()) {
                                ele.append(`<option selected value="` + item.id + `">` + item.title + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    loadCompanyList($('#select-box-company'));

    $("#form-edit-user").submit(function (event) {
        let url = window.location.pathname.replace('edit', 'detail');
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(url + '/api', frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Đang cập nhật"}, 'success')
                        setTimeout(location.reload.bind(location), 1000);
                    }
                },
                (errs) => {
                    // $.fn.notifyPopup({description: errs.data.errors}, 'failure')
                }
            )
    });
});
