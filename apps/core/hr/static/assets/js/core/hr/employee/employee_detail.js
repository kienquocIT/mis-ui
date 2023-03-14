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

                        // load data for field Role
                        if (typeof data.employee.role !== 'undefined' && data.employee.role.length > 0) {
                            let dataRoleEmp = ""
                            for (let r = 0; r < data.employee.role.length; r++) {
                                if (r !== (data.employee.role.length - 1)) {
                                    dataRoleEmp += data.employee.role[r].title + ", "
                                } else {
                                    dataRoleEmp += data.employee.role[r].title
                                }
                            }
                            eleRole.val(dataRoleEmp)
                        }

                        // load permission table
                        if (typeof data.employee.plan_app !== 'undefined' && data.employee.plan_app.length > 0) {
                            let listTypeBtn = ["primary", "success", "info", "danger", "warning"]
                            let $trans = $('.table-translate')
                            for (let [idx, plan] of data.employee.plan_app.entries()){
                                let random_style =  listTypeBtn[idx];
                                let app_list = `<tr><td class="text-center" colspan="7">${$trans.data('empty')}</td></tr>`

                                if (plan.hasOwnProperty('application')){
                                    for (let [idx_c, app] of plan.application.entries()){
                                        if (idx_c = 0) app_list = ''
                                        app_list = `<tr><td></td></tr>`
                                    }
                                }
                                // table per app
                                let template_HTML = `<table class="mt-3 w-100 permission-table"><thead>`
                                    +`<tr><th>${$trans.data('application')}</th><th>${$trans.data('view_all')}</th>`
                                    +`<th>${$trans.data('create')}</th><th>${$trans.data('view')}</th>`
                                    +`<th>${$trans.data('edit')}</th><th>${$trans.data('delete')}</th>`
                                    +`<th>${$trans.data('permission_range')}</th></tr><tbody>${app_list}</tbody></table>`
                                // append HTML for collapse
                                $('#data-employee-plan-app-detail').append(`<div class="row mb-5"><button type="button"`
                                    + ` class="btn btn-gradient-${random_style} col-lg-2" data-bs-toggle="collapse" `
                                    + `data-bs-target="#collapse-module-${idx}">${plan.title}</button>`
                                    +`<div class="show" id="collapse-module-${idx}">${template_HTML}</div></div>`
                                );
                            }

                            // for (let t = 0; t < data.employee.plan_app.length; t++) {
                            //     let app_list = ``;
                            //     let app_list_edit = ``;
                            //     if (data.employee.plan_app[t].application
                            //         && Array.isArray(data.employee.plan_app[t].application)) {
                            //         let appLength = data.employee.plan_app[t].application.length;
                            //         for (let i = 0; i < appLength; i++) {
                            //             app_list += `<tr style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0; padding-bottom: 25px;">
                            //                             <td style="width: 28%; border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><i class="fas fa-star"></i>${data.employee.plan_app[t].application[i].title}</td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><input type="checkbox" checked disabled/></td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><input type="checkbox" checked disabled/></td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><input type="checkbox" checked disabled/></td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><input type="checkbox" checked disabled/></td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><input type="checkbox" checked disabled/></td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">User</td>
                            //                         </tr>`
                            //             app_list_edit += `<tr style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">
                            //                             <td style="width: 28%; border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><i class="fas fa-star"></i>${data.employee.plan_app[t].application[i].title}</td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><input type="checkbox" checked/></td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><input type="checkbox" checked/></td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><input type="checkbox" checked/></td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><input type="checkbox" checked/></td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0"><input type="checkbox" checked/></td>
                            //                             <td style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">User</td>
                            //                         </tr>`
                            //         }
                            //     }
                            //     let tableApplication = `<table class="mt-3" style="width: 100%">
                            //                             <thead>
                            //                             <tr style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">
                            //                                 <th style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">Application</th>
                            //                                 <th style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">View All</th>
                            //                                 <th style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">Create</th>
                            //                                 <th style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">View</th>
                            //                                 <th style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">Edit</th>
                            //                                 <th style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">Delete</th>
                            //                                 <th style="border-color: #007D88; border-style: solid; border-width: 1px; border-top: 0; border-right: 0; border-left: 0">Permission Range</th>
                            //                             </tr>
                            //                             <tbody>${app_list}</tbody>
                            //                         </table>`
                            //
                            //     let tableApplicationEdit = `<table class="mt-3" style="width: 100%">
                            //                             <thead>
                            //                             <tr style="border: 0;border-bottom:solid 1px #007D88;">
                            //                                 <th style="border: 0;border-bottom:solid 1px #007D88;">Application</th>
                            //                                 <th style="border: 0;border-bottom:solid 1px #007D88;">View All</th>
                            //                                 <th style="border: 0;border-bottom:solid 1px #007D88;">Create</th>
                            //                                 <th style="border: 0;border-bottom:solid 1px #007D88;">View</th>
                            //                                 <th style="border: 0;border-bottom:solid 1px #007D88;">Edit</th>
                            //                                 <th style="border: 0;border-bottom:solid 1px #007D88;">Delete</th>
                            //                                 <th style="border: 0;border-bottom:solid 1px #007D88;">Permission Range</th>
                            //                             </tr>
                            //                             <tbody>${app_list_edit}</tbody>
                            //                         </table>`
                            //
                            //     $('#data-employee-plan-app-detail').append(`<div class="row mb-5">
                            //     <div>
                            //         <button
                            //                 class="btn btn-gradient-${listTypeBtn[t]}" type="button"
                            //                 data-bs-toggle="collapse"
                            //                 data-bs-target="#collapseExample${t}" aria-expanded="false"
                            //                 aria-controls="collapseExample${t}" style="width: 310px"
                            //
                            //         >
                            //             ${data.employee.plan_app[t].title}
                            //         </button>
                            //     </div>
                            //     <div class="show" id="collapseExample${t}">
                            //         ${tableApplication}
                            //     </div>
                            // </div>`)
                            //
                            //
                            // $('#data-employee-plan-app-edit').append(`<div class="row mb-5">
                            //     <div>
                            //         <button
                            //                 class="btn btn-gradient-${listTypeBtn[t]}" type="button" data-bs-toggle="collapse"
                            //                 data-bs-target="#collapseExample${t}" aria-expanded="false"
                            //                 aria-controls="collapseExample${t}" style="width: 295px"
                            //
                            //         >
                            //             ${data.employee.plan_app[t].title}
                            //         </button>
                            //     </div>
                            //     <div class="show" id="collapseExample${t}">
                            //         ${tableApplicationEdit}
                            //     </div>
                            // </div>`)
                            // }
                        }
                    }
                } // end if data available
            } // end response
        )
    }

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


    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
    $('#btn-edit-emp-permission').on('click', ()=>{
        $('#employee-permission-detail').attr("hidden", true);
        $('#employee-permission-edit').attr("hidden", false);
    })
});