$(document).ready(function () {
    // load instance data
    function loadDetailData() {
        let ele = $('#group-detail-page');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');

        let eleGroupLevel = $('#select-box-group-level-detail');
        let eleParent = $('#select-box-group-detail');
        let eleRefTitle = $('#reference-group-title');
        let eleTitle = $('#group-title-detail');
        let eleCode = $('#group-code-detail');
        let eleDescription = $('#group-description-detail');
        let eleFirstManRefTitle = $('#first-manager-system-title');
        let eleSecondManRefTitle = $('#second-manager-system-title');
        let eleFirstManTitle = $('#group-first-manager-title-detail');
        let eleSecondManTitle = $('#group-second-manager-title-detail');
        let eleFirstManAssign = $('#select-box-first-manager-detail');
        let eleSecondManAssign = $('#select-box-second-manager-detail');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('group')) {
                        eleGroupLevel.val("level " + data.group.group_level.level);
                        eleParent.val(data.group.parent_n.title);
                        eleRefTitle.val(data.group.group_level.description);
                        eleTitle.val(data.group.title);
                        eleCode.val(data.group.code);
                        eleDescription.val(data.group.description);
                        eleFirstManRefTitle.val(data.group.group_level.first_manager_description);
                        eleSecondManRefTitle.val(data.group.group_level.second_manager_description);
                        eleFirstManTitle.val(data.group.first_manager_title);
                        eleSecondManTitle.val(data.group.second_manager_title);
                        eleFirstManAssign.val(data.group.first_manager.full_name);
                        eleSecondManAssign.val(data.group.second_manager.full_name);

                        if (data.group.group_employee && Array.isArray(data.group.group_employee)) {
                            for (let i = 0; i < data.group.group_employee.length; i++) {
                                let dataRole = ""
                                if (data.group.group_employee[i].hasOwnProperty('role') && Array.isArray(data.group.group_employee[i].role)) {
                                    for (let r = 0; r < data.group.group_employee[i].role.length; r++) {
                                        dataRole += data.group.group_employee[i].role[r].title + ", "
                                    }
                                }
                                $('#datable-group-employee-detail tbody').append(`<tr>` + `<td><span>${i+1}</span></td>` + `<td><span>${data.group.group_employee[i].full_name}</span></td>` + `<td><span>${dataRole}</span></td>` + `</tr>`);
                            }

                        }
                    }
                }
            }
        )
    }

    function loadDefaultData() {
        $("input[name='date_joined']").val(moment().format('DD-MM-YYYY'));

        loadDetailData();

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
});

