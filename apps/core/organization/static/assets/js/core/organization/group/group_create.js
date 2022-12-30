$(document).ready(function () {
    // load group level list
    function loadGroupLevelList() {
        let ele = $('#select-box-group-level');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('group_level_list') && Array.isArray(data.group_level_list)) {
                        data.group_level_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.level + `</option>`)
                        })
                    }
                }
            }
        )
    }

    // load group list
    function loadGroupList() {
        let ele = $('#select-box-group');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('group_list') && Array.isArray(data.group_list)) {
                        data.group_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    function loadDefaultData() {
        $("input[name='date_joined']").val(moment().format('DD-MM-YYYY'));

        loadGroupLevelList();
        loadGroupList();

        $('#input-avatar').on('change', function (ev) {
            let upload_img = $('#upload-area');
            upload_img.text("");
            upload_img.css('background-image', "url(" + URL.createObjectURL(this.files[0]) + ")");
        });
        $('#upload-area').click(function (e) {
            $('#input-avatar').click();
        });

        $('#languages').select2();
    }

    loadDefaultData();

    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
    let frm = $('#frm_employee_create');
    frm.validate({
        errorElement: 'p',
        errorClass: 'is-invalid cl-red',
    })
    frm.submit(function (event) {
        let frm = new SetupFormSubmit($(this));
        console.log(frm.dataUrl, frm.dataMethod, frm.dataForm,);
        event.preventDefault();
    });
});