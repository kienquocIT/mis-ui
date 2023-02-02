$(document).ready(function () {
    // load instance data
    function loadDetailData() {
        let ele = $('#employee-detail-page');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');

        let eleUser = $('#select-box-user-detail');
        let eleFirstName = $('#employee-first-name-detail');
        let eleLastName = $('#employee-last-name-detail');
        let eleEmail = $('#employee-email-detail');
        let elePhone = $('#employee-phone-detail');
        let eleDepartment = $('#select-box-group-employee-detail');
        let eleDob = $('#employee-dob-detail');
        let eleDateJoined = $('#employee-date-joined-detail');
        let eleRole = $('#select-box-role-employee-detail');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee')) {

                        if (data.employee.user.hasOwnProperty('full_name')) {
                            eleUser.val(data.employee.user.full_name)
                        }

                        eleFirstName.val(data.employee.first_name);
                        eleLastName.val(data.employee.last_name);
                        eleEmail.val(data.employee.email);
                        elePhone.val(data.employee.phone);

                        if (data.employee.group.hasOwnProperty('title')) {
                            eleDepartment.val(data.employee.group.title)
                        }

                        eleDob.val(moment(data.employee.dob).format('DD-MM-YYYY'));
                        eleDateJoined.val(moment(data.employee.date_joined).format('DD-MM-YYYY'));

                        if (typeof data.employee.role !== 'undefined' && data.employee.role.length > 0) {
                            let dataRoleEmp = ""
                            for (let r = 0; r < data.employee.role.length; r++) {
                                dataRoleEmp += data.employee.role[r].title + ", "
                            }
                            eleRole.val(dataRoleEmp)
                        }

                        if (typeof data.employee.plan_app !== 'undefined' && data.employee.plan_app.length > 0) {
                            let listTypeBtn = ["primary", "success", "info", "danger", "warning",]
                            for (let t = 0; t < data.employee.plan_app.length; t++) {
                                let app_list = ``
                                if (data.employee.plan_app[t].application && Array.isArray(data.employee.plan_app[t].application)) {
                                    let appLength = data.employee.plan_app[t].application.length;
                                    for (let i = 0; i < appLength; i++) {
                                        app_list += `<li class="list-break mt-3 mb-2" style="display: inline">
                                            <i class="fas fa-star"></i>
                                            <label
                                                    for="list-app-add-employee" class="form-check-label"
                                            >${data.employee.plan_app[t].application[i].title}</label>
                                        </li>`
                                    }
                                }

                                $('#datable-employee-plan-app-detail tbody').append(`<tr>
                        <td>
                            <div class="row mb-5">
                                <div>
                                    <button
                                            class="btn btn-gradient-${listTypeBtn[t]}" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseExample${t}" aria-expanded="false"
                                            aria-controls="collapseExample${t}" style="width: 200px"
                                          
                                    >
                                        ${data.employee.plan_app[t].title}
                                    </button>
                                </div>
                                <div class="show" id="collapseExample${t}">
                                    <ul>
                                        ${app_list}
                                    </ul>
                                </div>
                            </div>
                        </td>
                    </tr>`)
                            }
                        }
                    }
                }
            }
        )
    }

    function loadDefaultData() {

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