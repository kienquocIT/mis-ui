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

        $.fn.callAjax2({
            url: url,
            method: method,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('group')) {
                    let groupData = data.group;
                    if (groupData) {
                        $x.fn.renderCodeBreadcrumb(groupData);
                        eleGroupLevel.val("level " + groupData?.['group_level']?.['level']);
                        eleParent.val(groupData?.['parent_n']?.['title']);
                        eleRefTitle.val(groupData?.['group_level']?.['description']);
                        eleTitle.val(groupData?.['title']);
                        eleCode.val(groupData?.['code']);
                        eleDescription.val(groupData?.['description']);
                        eleFirstManRefTitle.val(groupData?.['group_level']?.['first_manager_description']);
                        eleSecondManRefTitle.val(groupData?.['group_level']?.['second_manager_description']);
                        eleFirstManTitle.val(groupData?.['first_manager_title']);
                        eleSecondManTitle.val(groupData?.['second_manager_title']);
                        eleFirstManAssign.val(groupData?.['first_manager']?.['full_name']);
                        eleSecondManAssign.val(groupData?.['second_manager']?.['full_name']);

                        if (groupData?.['group_employee'] && Array.isArray(groupData?.['group_employee'])) {
                            for (let i = 0; i < groupData?.['group_employee']?.length; i++) {
                                let dataRole = [];
                                if (groupData?.['group_employee'][i].hasOwnProperty('role') && Array.isArray(groupData?.['group_employee'][i].role)) {
                                    for (let r = 0; r < groupData?.['group_employee'][i].role.length; r++) {
                                        // dataRole += data.group.group_employee[i].role[r].title + ", "
                                        dataRole.push(`<span class="badge badge-soft-primary">` + groupData?.['group_employee'][i].role[r].title + `</span>`);
                                        dataRole.join(" ");
                                    }
                                }
                                $('#datable-group-employee-detail tbody').append(`<tr>` + `<td><span>${i+1}</span></td>` + `<td><span>${groupData?.['group_employee'][i].full_name}</span></td>` + `<td><span>${dataRole}</span></td>` + `</tr>`);
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

