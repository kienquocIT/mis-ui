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
                    if (data.hasOwnProperty('user_list') && Array.isArray(data.user_list)) {
                        ele.append(`<option>` + `</option>`)
                        data.user_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
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
                                    app_list += `<li class="list-break mt-3 mb-3" style="display: inline">
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

                            $('#datable-employee-plan-app tbody').append(`<tr>
                        <td>
                            <div class="row mb-3">
                                <div class="mb-1">
                                    <button
                                            class="btn btn-primary" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseExample${t}" aria-expanded="false"
                                            aria-controls="collapseExample${t}"
                                    >
                                        ${data.plan_list[t].title}
                                    </button>
                                    <span style="margin-left: 10px">License: 19 of 20</span>
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
        )
    }

    function setupDataPlanApp() {
        let dataPlanAppSubmit = [];
        let plan_id = null;
        let tablePlanApp = document.getElementById("datable-employee-plan-app");
        let tablePlanAppLength = tablePlanApp.tBodies[0].rows.length;
        for (let s = 0; s < tablePlanAppLength; s++) {
            let dataPlanList = {};
            let dataAppList = [];
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
            dataPlanList['plan'] = plan_id;
            dataPlanList['application'] = dataAppList;
            dataPlanAppSubmit.push(dataPlanList)
            }
        }
    return dataPlanAppSubmit
    }

    function loadDefaultData() {
        $("input[name='date_joined']").val(moment().format('DD-MM-YYYY'));

        loadUserList();
        loadRoleList();
        loadGroupList();
        loadPlanAppList();

        $('#input-avatar').on('change', function (ev) {
            let upload_img = $('#upload-area');
            upload_img.text("");
            upload_img.css('background-image', "url(" + URL.createObjectURL(this.files[0]) + ")");
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