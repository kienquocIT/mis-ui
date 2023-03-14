/***
 * render HTMl and init action when user using permission function
 * @param plan_app: data list application in employee
 * @constructor
 */
function PermissionsInit(plan_app) {
    if (typeof plan_app !== 'undefined' && plan_app.length > 0) {
        let listTypeBtn = ["primary", "success", "info", "danger", "warning"]
        let $trans = $('.table-translate')
        for (let [idx, plan] of plan_app.entries()) {
            let random_style = listTypeBtn[idx];
            let app_list = `<tr><td class="text-center" colspan="7">${$trans.data('empty')}</td></tr>`

            if (plan.hasOwnProperty('application')) {
                for (let [idx_c, app] of plan.application.entries()) {
                    if (idx_c = 1) app_list = '';
                    app_list += `<tr><td><i class="fas fa-star"></i> ${app.title}</td>`
                        +`<td><input type="checkbox" checked disabled/></td>`
                        +`<td><input type="checkbox" checked disabled/></td>`
                        +`<td><input type="checkbox" checked disabled/></td>`
                        +`<td><input type="checkbox" checked disabled/></td>`
                        +`<td><input type="checkbox" checked disabled/></td>`
                        +`<td>${$('.template-factory .app-list').html()}</td>`
                        +`</tr>`
                }
            }
            // table per app
            let template_HTML = `<table class="mt-3 w-100 permission-table"><thead>`
                + `<tr><th>${$trans.data('application')}</th><th>${$trans.data('view_all')}</th>`
                + `<th>${$trans.data('create')}</th><th>${$trans.data('view')}</th>`
                + `<th>${$trans.data('edit')}</th><th>${$trans.data('delete')}</th>`
                + `<th>${$trans.data('permission_range')}</th></tr><tbody>${app_list}</tbody></table>`
            // append HTML for collapse
            $('#employee-perm-detail').append(`<div class="row mb-5"><button type="button"`
                + ` class="btn btn-gradient-${random_style} col-lg-2" data-bs-toggle="collapse" `
                + `data-bs-target="#collapse-module-${idx}">${plan.title}</button>`
                + `<br><div class="col-lg-2"><a href="javascript:void(0)" class="btn link-primary hidden"><i class="fas fa-plus-square"></i>`
                +`${$('.table-translate').data('add')}</a></div>`
                + `<div class="show" id="collapse-module-${idx}">${template_HTML}</div></div>`
            );
        }

        // for (let t = 0; t < data.employee.plan_app.length; t++) {
        //     let app_list = ``;
        //     let app_list_edit = ``;
        //     if (data.employee.plan_app[t].application
        //         && Array.isArray(data.employee.plan_app[t].application)) {
        //         let appLength = data.employee.plan_app[t].application.length;
        //         for (let i = 0; i < appLength; i++) {
        //             app_list += `<tr>
        //                             <td><i class="fas fa-star"></i>${data.employee.plan_app[t].application[i].title}</td>
        //                             <td ><input type="checkbox" checked disabled/></td>
        //                             <td ><input type="checkbox" checked disabled/></td>
        //                             <td ><input type="checkbox" checked disabled/></td>
        //                             <td ><input type="checkbox" checked disabled/></td>
        //                             <td ><input type="checkbox" checked disabled/></td>
        //                             <td >User</td>
        //                         </tr>`
        //             app_list_edit += `<tr >
        //                             <td><i class="fas fa-star"></i>${data.employee.plan_app[t].application[i].title}</td>
        //                             <td ><input type="checkbox" checked/></td>
        //                             <td ><input type="checkbox" checked/></td>
        //                             <td ><input type="checkbox" checked/></td>
        //                             <td ><input type="checkbox" checked/></td>
        //                             <td ><input type="checkbox" checked/></td>
        //                             <td >User</td>
        //                         </tr>`
        //         }
        //     }
        //     let tableApplication = `<table class="mt-3" style="width: 100%">
        //                             <thead>
        //                             <tr >
        //                                 <th >Application</th>
        //                                 <th >View All</th>
        //                                 <th >Create</th>
        //                                 <th >View</th>
        //                                 <th >Edit</th>
        //                                 <th >Delete</th>
        //                                 <th >Permission Range</th>
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