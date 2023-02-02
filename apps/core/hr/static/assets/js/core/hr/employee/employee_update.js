$(document).ready(function () {
    function loadInstanceData() {
        let ele = $('#frm_employee_update');
        let url = ele.attr('data-url');
        let method = "GET";

        let eleUser = $('#select-box-user-update');
        let eleFirstName = $('#employee-first-name-update');
        let eleLastName = $('#employee-last-name-update');
        let eleEmail = $('#employee-email-update');
        let elePhone = $('#employee-phone-update');
        let eleDepartment = $('#select-box-group-employee-update');
        let eleDob = $('#employee-dob-update');
        let eleDateJoined = $('#employee-date-joined-update');
        let eleRole = $('#select-box-role-employee-update');

        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee')) {

                        if (data.employee.user.hasOwnProperty('full_name')) {
                            eleUser.text("");
                            eleUser.append(`<option value="` + data.employee.user.id + `" data-first-name="${data.employee.user.first_name}" data-last-name="${data.employee.user.last_name}" data-email="${data.employee.user.email}" data-phone="${data.employee.user.phone}">` + data.employee.user.full_name + `</option>`)
                        } else {
                            eleUser.text("");
                            eleUser.append(`<option>` + `</option>`)
                        }
                        loadUserList();

                        eleFirstName.val(data.employee.first_name);
                        eleLastName.val(data.employee.last_name);
                        eleEmail.val(data.employee.email);
                        elePhone.val(data.employee.phone);

                        if (data.employee.group.hasOwnProperty('title')) {
                            eleDepartment.text("");
                            eleDepartment.append(`<option value="` + data.employee.group.id + `">` + data.employee.group.title + `</option>`)
                        } else {
                            eleDepartment.text("");
                            eleDepartment.append(`<option>` + `</option>`)
                        }
                        loadGroupList();

                        eleDob.val(moment(data.employee.dob).format('YYYY-MM-DD'));
                        eleDateJoined.val(moment(data.employee.date_joined).format('YYYY-MM-DD'));

                        let dataRoleInstance = [];
                        if (typeof data.employee.role !== 'undefined' && data.employee.role.length > 0) {
                            for (let r = 0; r < data.employee.role.length; r++) {
                                dataRoleInstance.push(data.employee.role[r].id);
                            }
                            eleRole.val(dataRoleInstance);
                        }

                        if (typeof data.employee.plan_app !== 'undefined' && data.employee.plan_app.length > 0) {
                            for (let t = 0; t < data.employee.plan_app.length; t++) {
                                let planCode = "#" + data.employee.plan_app[t].code
                                let instancePlan = $(planCode)

                                if (data.employee.plan_app[t].application && Array.isArray(data.employee.plan_app[t].application)) {
                                    let appLength = data.employee.plan_app[t].application.length;
                                    for (let i = 0; i < appLength; i++) {
                                        let planAppInstance = instancePlan.closest('td').find('.employee-application');
                                        let planAppInstanceList = planAppInstance[0].children;
                                        for (let app = 0; app < planAppInstanceList.length; app++) {
                                            if (planAppInstanceList[app].id === data.employee.plan_app[t].application[i].id) {
                                                let appInput = planAppInstanceList[app].children[0];
                                                appInput.checked  = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        )
    }

    function loadUserList() {
        // load user list
        let ele = $('#select-box-user-update');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('company_user_list') && Array.isArray(data.company_user_list)) {
                        data.company_user_list.map(function (item) {
                            if (Object.keys(item.user).length !== 0) {
                                if (item.id !== ele[0][0].value) {
                                    ele.append(`<option value="` + item.user.id + `" data-first-name="${item.user.first_name}" data-last-name="${item.user.last_name}" data-email="${item.user.email}" data-phone="${item.user.phone}">` + item.user.full_name + `</option>`);
                                }
                            }
                        })
                    }
                }
            }
        )
    }

    // load role list
    function loadRoleList() {
        let ele = $('#select-box-role-employee-update');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('role_list') && Array.isArray(data.role_list)) {
                        data.role_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                    loadInstanceData();
                }
            }
        )
    }

    // load group list
    function loadGroupList() {
        let ele = $('#select-box-group-employee-update');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('group_list') && Array.isArray(data.group_list)) {
                        data.group_list.map(function (item) {
                            if (item.id !== ele[0][0].value) {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    // load Plan App
    function loadPlanAppList() {
        let tableApply = $('#datable-employee-plan-app-update');
        let url = tableApply.attr('data-url');
        let method = tableApply.attr('data-method');
        let listTypeBtn = ["primary", "success", "info", "danger", "warning", ]
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('plan_list') && Array.isArray(data.plan_list)) {
                        for (let t = 0; t < data.plan_list.length; t++) {
                            let app_list = ``
                            if (data.plan_list[t].application && Array.isArray(data.plan_list[t].application)) {
                                let appLength = data.plan_list[t].application.length;
                                for (let i = 0; i < appLength; i++) {
                                    app_list += `<li class="list-break mt-2 mb-2" style="display: inline" id="${data.plan_list[t].application[i].id}">
                                            <input
                                                    type="checkbox" id="list-app-add-employee-${t}"
                                                    name="list-app-add-employee-${t}" class="form-check-input"
                                                    data-plan-id="${data.plan_list[t].id}"
                                                    data-app-id="${data.plan_list[t].application[i].id}"
                                            />
                                            <label
                                                    for="list-app-add-employee" class="form-check-label"
                                            >${data.plan_list[t].application[i].title}</label>
                                        </li>`
                                }
                            }

                            $('#datable-employee-plan-app-update tbody').append(`<tr>
                        <td>
                            <div class="row mb-6" style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">
                                <div>
                                    <button
                                            class="btn btn-gradient-${listTypeBtn[t]}" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseExample${t}" aria-expanded="false"
                                            aria-controls="collapseExample${t}" style="width: 295px; border-radius: 0; margin-left: -12px"
                                            id="${data.plan_list[t].code}"
                                    >
                                        ${data.plan_list[t].title}
                                    </button>
<!--                                    <span style="margin-left: 10px">License: 19 of 20</span>-->
                                </div>
                                <div class="show" id="collapseExample${t}" style="margin-left: 12px; margin-bottom: 10px">
                                    <ul class="employee-application">
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
        )
    }

    function setupDataPlanApp() {
        let dataPlanAppSubmit = [];
        let tablePlanApp = document.getElementById("datable-employee-plan-app-update");
        let tablePlanAppLength = tablePlanApp.tBodies[0].rows.length;
        for (let s = 0; s < tablePlanAppLength; s++) {
            let dataPlanList = {};
            let dataAppList = [];
            let plan_id = null;
            let showRow = tablePlanApp.rows[s]
            let app_list = showRow.children[0].children[0].children[1].children[0].children
            if (app_list) {
                for (let i = 0; i < app_list.length; i++) {
                    let app = app_list[i].children[0];
                    plan_id = app.getAttribute('data-plan-id');
                    let app_id = app.getAttribute('data-app-id');
                    if (app.checked === true) {
                        dataAppList.push(app_id)
                    }
                }
                if (plan_id) {
                    dataPlanList['plan'] = plan_id;
                    dataPlanList['application'] = dataAppList;
                    dataPlanAppSubmit.push(dataPlanList)
                }
            }
        }
    return dataPlanAppSubmit
    }

    function loadDefaultData() {
        // $("input[name='date_joined']").val(moment().format('DD-MM-YYYY'));
        // $("input[name='dob']").val(moment().format('DD-MM-YYYY'));

        $('#select-box-role-employee-update').select2();

        // loadPlanAppList();
        loadRoleList();
        // loadInstanceData();
        // loadUserList();
        // loadRoleList();
        // loadGroupList();
        // loadPlanAppList();

        $('#input-avatar').on('change', function (ev) {
            let upload_img = $('#upload-area');
            upload_img.text("");
            tmp = URL.createObjectURL(this.files[0])
            upload_img.css('background-image', "url(" + URL.createObjectURL(this.files[0]) + ")");
            $(this).val()
        });
        $('#upload-area').click(function (e) {
            $('#input-avatar').click();
        });

        // $('#select-box-role-employee-update').select2();
    }

    loadDefaultData();

    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
    let frm = $('#frm_employee_update');
    frm.validate({
        errorElement: 'p',
        errorClass: 'is-invalid cl-red',
    })
    frm.submit(function (event) {
        let frm = new SetupFormSubmit($(this));
        console.log(frm.dataUrl, frm.dataMethod, frm.dataForm,);
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let dataPlanApp = setupDataPlanApp()
        if (dataPlanApp && frm.dataForm) {
            frm.dataForm['plan_app'] = dataPlanApp
        }

        if (frm.dataForm.hasOwnProperty('date_joined')) {
            frm.dataForm['date_joined'] = moment(frm.dataForm['date_joined']).format('YYYY-MM-DD HH:mm:ss')
        }

        if (frm.dataForm.hasOwnProperty('dob')) {
            frm.dataForm['dob'] = moment(frm.dataForm['dob']).format('YYYY-MM-DD')
        }

        let dataRoleList = $('#select-box-role-employee-update').val()
        if (dataRoleList) {
            frm.dataForm['role'] = dataRoleList
        }

        if (frm.dataForm) {
            for (let key in frm.dataForm) {
                if (frm.dataForm[key] === '') {
                    delete frm.dataForm[key]
                }
            }
        }

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            // $.fn.notifyPopup({description: "Group is being created"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 3000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyPopup({description: "Group create fail"}, 'failure')
                    }
                )
    });
});


// Load user datas
$(document).on('change', '#select-box-user-update', function (e) {
    let sel = $(this)[0].options[$(this)[0].selectedIndex]
    let first_name = sel.getAttribute('data-first-name');
    let last_name = sel.getAttribute('data-last-name');
    let email = sel.getAttribute('data-email');
    let phone = sel.getAttribute('data-phone');

    $('#employee-first-name-update').val(first_name);
    $('#employee-last-name-update').val(last_name);
    $('#employee-email-update').val(email);
    $('#employee-phone-update').val(phone);
});


$(function () {
    "use strict";

    /* Single table*/
    $('input[name="dob"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        minYear: 1901,
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10)
    }, function (start, end, label) {
        var years = moment().diff(start, 'years');
    });

    /* Single table*/
    $('input[name="date_joined"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        minYear: 1901,
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10)
    }, function (start, end, label) {
        var years = moment().diff(start, 'years');
    });

});