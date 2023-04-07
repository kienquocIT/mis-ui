$(document).ready(function () {
    function loadUserList() {
        // load user list
        let ele = $('#select-box-user');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('company_user_list') && Array.isArray(data.company_user_list)) {
                        ele.append(`<option>` + `</option>`)
                        data.company_user_list.map(function (item) {
                            if (Object.keys(item.user).length !== 0) {
                                ele.append(`<option value="` + item.user.id + `" data-first-name="${item.user.first_name}" data-last-name="${item.user.last_name}" data-email="${item.user.email}" data-phone="${item.user.phone}">` + item.user.full_name + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    // load role list
    function loadRoleList() {
        let ele = $('#select-box-role');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('role_list') && Array.isArray(data.role_list)) {
                        ele.append(`<option>` + `</option>`)
                        data.role_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    // load group list
    function loadGroupList() {
        let ele = $('#select-box-group-employee');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('group_list') && Array.isArray(data.group_list)) {
                        ele.append(`<option>` + `</option>`)
                        data.group_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    // load Plan App
    function loadPlanAppList() {
        let tableApply = $('#datable-employee-plan-app');
        let url = tableApply.attr('data-url');
        let method = tableApply.attr('data-method');
        let listTypeBtn = ["primary", "success", "info", "danger", "warning", ]
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('tenant_plan_list') && Array.isArray(data.tenant_plan_list)) {
                        for (let t = 0; t < data.tenant_plan_list.length; t++) {
                            let licenseQuantity = null
                            if (data.tenant_plan_list[t].license_quantity !== null) {
                                licenseQuantity = data.tenant_plan_list[t].license_quantity;
                            } else {
                                licenseQuantity = "Unlimited"
                            }

                            let app_list = ``
                            if (data.tenant_plan_list[t].plan.application && Array.isArray(data.tenant_plan_list[t].plan.application)) {
                                let appLength = data.tenant_plan_list[t].plan.application.length;
                                for (let i = 0; i < appLength; i++) {
                                    app_list += `<li class="list-break mt-2 mb-2" style="display: inline">
                                            <input
                                                    type="checkbox" id="list-app-add-employee-${t}"
                                                    name="list-app-add-employee-${t}" class="form-check-input check-plan-application"
                                                    data-plan-id="${data.tenant_plan_list[t].plan.id}"
                                                    data-app-id="${data.tenant_plan_list[t].plan.application[i].id}"
                                            />
                                            <label
                                                    for="list-app-add-employee" class="form-check-label"
                                            >${data.tenant_plan_list[t].plan.application[i].title}</label>
                                        </li>`
                                }
                            }

                            $('#datable-employee-plan-app tbody').append(`<tr>
                        <td>
                            <div class="row mb-6" style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">
                            
                                <div>
                                    <button
                                            class="btn btn-gradient-${listTypeBtn[t]}" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseExample${t}" aria-expanded="false"
                                            aria-controls="collapseExample${t}" style="width: 295px; border-radius: 0; margin-left: -12px"
                                          
                                    >
                                        ${data.tenant_plan_list[t].plan.title}
                                    </button>
                                    <span style="margin-left: 10px">License: 
                                        <span class="license-used-employee">${data.tenant_plan_list[t].license_used}</span> of <span>${licenseQuantity}</span>
                                        <input type="text" class="license-used-employee-default" value="${data.tenant_plan_list[t].license_used}" hidden>
                                        <input type="text" class="license-quantity" value="${data.tenant_plan_list[t].license_quantity}" hidden>
                                    </span>
                                </div>
                                
                                <div class="show" id="collapseExample${t}" style="margin-left: 12px; margin-bottom: 10px">
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
        )
    }

    function setupDataPlanApp() {
        let dataPlanAppSubmit = [];
        let tablePlanApp = document.getElementById("datable-employee-plan-app");
        let tablePlanAppLength = tablePlanApp.tBodies[0].rows.length;
        for (let s = 0; s < tablePlanAppLength; s++) {
            let dataPlanList = {};
            let dataAppList = [];
            let plan_id = null;
            let showRow = tablePlanApp.rows[s];

            let divRow = showRow.firstElementChild.firstElementChild;
            let licenseUsed = Number(divRow.children[0].children[1].children[0].innerHTML);
            let licenseQuantity = Number(divRow.children[0].children[1].children[1].innerHTML);

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
                    dataPlanList['license_used'] = licenseUsed;
                    dataPlanList['license_quantity'] = licenseQuantity;
                    dataPlanAppSubmit.push(dataPlanList)
                }
            }
        }
    return dataPlanAppSubmit
    }

    function loadDefaultData() {

        loadUserList();
        loadRoleList();
        loadGroupList();
        loadPlanAppList();

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

        $('#select-box-role').select2();
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
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        // check data submit user-app
        let flag_check_app = Number($('#is-check-app-employee-create').val());
        if (frm.dataForm.hasOwnProperty('user')) {
            if (frm.dataForm['user']) {
                if (flag_check_app === 0) {
                    $.fn.notifyPopup({description: 'Employee map user must choose applications'}, 'failure');
                    return false
                }
            }
        }
        // end check
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

        let dataRoleList = $('#select-box-role').val()
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
                        $.fn.notifyPopup({description: data.message}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 3000);
                    }
                },
                (errs) => {
                    // if (errs.data.errors.hasOwnProperty('detail')) {
                    //     $.fn.notifyPopup({description: String(errs.data.errors['detail'])}, 'failure')
                    // }
                }
            )
    });
});


// Load user datas
$(document).on('change', '#select-box-user', function (e) {
    let sel = $(this)[0].options[$(this)[0].selectedIndex]
    let first_name = sel.getAttribute('data-first-name');
    let last_name = sel.getAttribute('data-last-name');
    let email = sel.getAttribute('data-email');
    let phone = sel.getAttribute('data-phone');
    let checkLicense = updateLicenseWhenChangeUser();
    if (checkLicense === true) {
        $('#employee-first-name').val(first_name);
        $('#employee-last-name').val(last_name);
        $('#employee-email').val(email);
        $('#employee-phone').val(phone);
    } else {
        sel.selected = false;
    }
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


$(document).on('click', '.check-plan-application', function (e) {
    let divRow = $(this)[0].closest('.row');
    let eleLicenseUsed = divRow.querySelector('.license-used-employee');
    let licenseQuantity = divRow.querySelector('.license-quantity').value;
    let checkAll = 0;
    let divUl = $(this)[0].closest('ul');
    let eleDivAppList = divUl.children;
    // update flag is check app
    let flag_check = $('#is-check-app-employee-create');
    if ($(this)[0].checked === true) {
        let flag_update = String(Number(flag_check.val()) + 1);
        flag_check.val(flag_update);
    } else {
        let flag_update = String(Number(flag_check.val()) - 1);
        flag_check.val(flag_update);
    }
    // end check
    if (licenseQuantity && $('#select-box-user').val()) {
        // checked ==> if user.val() ==> license + 1
        if ($(this)[0].checked === true) {
            for (let t = 0; t < eleDivAppList.length; t++) {
                let app = eleDivAppList[t].firstElementChild;
                if (app.checked === true) {
                    checkAll += 1
                }
            }
            if (checkAll === 1) {
                if (eleLicenseUsed.innerHTML) {
                    let licenseUsed = Number(eleLicenseUsed.innerHTML) + 1;
                    if (licenseQuantity !== 'null') {
                        if (licenseUsed <= Number(licenseQuantity)) {
                            eleLicenseUsed.innerHTML = String(licenseUsed);
                        } else {
                            $.fn.notifyPopup({description: 'Not enough license for this employee'}, 'failure');
                            $(this)[0].checked = false;
                            return false
                        }
                    } else {
                        eleLicenseUsed.innerHTML = String(licenseUsed);
                    }
                }
            }
        }
        // unchecked ==> if all apps unchecked ==> license - 1
        else {
            for (let t = 0; t < eleDivAppList.length; t++) {
                let app = eleDivAppList[t].firstElementChild;
                if (app.checked === false) {
                    checkAll += 1
                }
            }
            if (checkAll === eleDivAppList.length) {
                let licenseDefault = divRow.querySelector('.license-used-employee-default').value;
                if (Number(eleLicenseUsed.innerHTML) !== 0) {
                    if (licenseDefault) {
                        let licenseUsed = Number(eleLicenseUsed.innerHTML) - 1;
                        if (licenseUsed === Number(licenseDefault)) {
                            eleLicenseUsed.innerHTML = String(licenseUsed);
                        }
                    }
                }
            }
        }
    }
});


function updateLicenseWhenChangeUser() {
    let tablePlanApp = document.getElementById("datable-employee-plan-app");
    for (let r = 0; r < tablePlanApp.tBodies[0].rows.length; r++) {
        let divRow = tablePlanApp.tBodies[0].rows[r].firstElementChild.firstElementChild;
        let eleDivAppList = divRow.children[1].firstElementChild.children;
        let licenseQuantity = divRow.querySelector('.license-quantity').value;
        let eleLicenseUsed = divRow.querySelector('.license-used-employee');
        for (let t = 0; t < eleDivAppList.length; t++) {
            let app = eleDivAppList[t].querySelector('.check-plan-application');
            if (app.checked === true) {
                if ($('#select-box-user').val()) {
                    let licenseUsed = Number(eleLicenseUsed.innerHTML) + 1;
                    if (licenseQuantity && licenseQuantity !== "null") {
                        if (licenseUsed <= Number(licenseQuantity)) {
                            eleLicenseUsed.innerHTML = licenseUsed.toString();
                        } else {
                            $.fn.notifyPopup({description: 'Not enough license for this employee'}, 'failure');
                            return false
                        }
                    } else {
                        eleLicenseUsed.innerHTML = licenseUsed.toString();
                    }
                    break
                } else {
                    if (Number(eleLicenseUsed.innerHTML) !== 0) {
                        let licenseUsed = Number(eleLicenseUsed.innerHTML) - 1;
                        eleLicenseUsed.innerHTML = licenseUsed.toString();
                    }
                    break
                }
            }
        }
    }
    return true
}

