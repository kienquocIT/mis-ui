let DETAIL_APP_FL_PLAN = {}
let DROP_COMBOBOX_SELECTED = {}

/***
 * render HTMl and init action when user using permission function
 * @param plan_app: data list application in employee
 * @param {{option:string}} data
 */
function PermissionsInit(plan_app, perm_by_cfg) {
    if (typeof plan_app !== 'undefined' && plan_app.length > 0) {
        let listTypeBtn = ["primary", "success", "info", "danger", "warning"]
        let $trans = $('.table-translate');
        for (let [idx, plan] of plan_app.entries()) {
            let random_style = listTypeBtn[idx];
            let app_list = '';
            DETAIL_APP_FL_PLAN[plan.id] = plan.application
            if (plan.hasOwnProperty('application')) {
                //if employee first setup permission.
                if (Object.keys(perm_by_cfg).length === 0) {
                    // check if first time setup employee permission
                    for (let app of plan.application) {
                        let perm_str = app.app_label + '__' + app.code;
                        app_list += `<tr><td><i class="fas fa-star"></i> ${app.title}</td>`
                            + `<td><input type="checkbox" class="check_all" disabled/></td>`
                            + `<td><input type="checkbox" checked disabled name="${'create__' + perm_str}"/></td>`
                            + `<td><input type="checkbox" checked disabled name="${'view__' + perm_str}"/></td>`
                            + `<td><input type="checkbox" checked disabled name="${'edit__' + perm_str}"/></td>`
                            + `<td><input type="checkbox" checked disabled name="${'delete__' + perm_str}"/></td>`
                            + `<td width="25%">${$('.template-factory .belong-to').html()}</td>`
                            + `<td><button type="button" class="btn btn-delete"><i class="fas fa-trash-alt"></i></button></td>`
                            + `</tr>`
                    }
                }
                else if (Object.keys(perm_by_cfg).length > 0) {
                    let app_follow_by_plan = {}
                    for (let app of plan.application){
                        // loop app list filter by plan ID ==> app name add to app_follow_by_plan
                        if (!app_follow_by_plan.hasOwnProperty(app.code)) app_follow_by_plan[app.code] = []
                    }

                    for(let item in perm_by_cfg){
                        // add item in app_follow_by_plan follow by keys
                        let keys = item.split('__')[2]
                        if (app_follow_by_plan.hasOwnProperty(keys)){
                            let temp = {};
                            temp[item] = perm_by_cfg[item]
                            app_follow_by_plan[keys].push(temp)
                        }
                    }
                    // loop app_flw_by_plan get app and render to table HTML
                    for (let [key, val] of Object.entries(app_follow_by_plan)){
                        if (val.length){
                            let perm_html = '';
                            let c_perm = '', v_perm = '', e_perm = '', d_perm = '';
                            let c_perm_checked = false,
                                v_perm_checked = false,
                                e_perm_checked = false,
                                d_perm_checked = false;
                            let opt = 1;
                            let str_perm = ''
                            for (let item of val) {
                                for (let [child_k, child_v] of Object.entries(item)) {
                                    opt = child_v.option;
                                    if (val.length !== 4){
                                        str_perm = '__'
                                            +child_k.split('__')[1]
                                            +'__'
                                            +child_k.split('__')[2];
                                    }
                                    if (child_k.slice(0, 6) === 'create'){
                                        c_perm = child_k;
                                        c_perm_checked = true;
                                    }
                                    else if (child_k.slice(0, 6) === 'delete'){
                                        d_perm = child_k;
                                        d_perm_checked = true
                                    }
                                    else if (child_k.slice(0, 4) === 'view'){
                                        v_perm = child_k;
                                        v_perm_checked = true
                                    }
                                    else if (child_k.slice(0, 4) === 'edit'){
                                        e_perm = child_k;
                                        e_perm_checked = true;
                                    }
                                }
                            }
                            if (str_perm){
                                if (!c_perm) c_perm = 'create'+str_perm
                                if (!v_perm) v_perm = 'view'+str_perm
                                if (!e_perm) e_perm = 'edit'+str_perm
                                if (!d_perm) d_perm = 'delete'+str_perm
                            }
                            perm_html += `<td><input type="checkbox" ${c_perm_checked ? 'checked' : ''} disabled name="${c_perm}"/></td>`
                                +`<td><input type="checkbox" ${v_perm_checked ? 'checked' : ''} disabled name="${v_perm}"/></td>`
                                +`<td><input type="checkbox" ${e_perm_checked ? 'checked' : ''} disabled name="${e_perm}"/></td>`
                                +`<td><input type="checkbox" ${d_perm_checked ? 'checked' : ''} disabled name="${d_perm}"/></td>`


                            let opt_str = $('.template-factory .belong-to').html()
                                .replace('value="' + opt + '"', 'value="' + opt + '" selected')
                            app_list += `<tr><td width="20%"><i class="fas fa-star"></i> ${key}</td>`
                                + `<td><input type="checkbox" class="check_all" disabled/></td>`
                                + perm_html
                                + `<td width="25%">${opt_str}</td>`
                                + `<td><button type="button" class="btn btn-delete"><i class="fas fa-trash-alt"></i></button></td>`
                                + `</tr>`
                        } // end check list app empty
                    }
                }
            }


            // table per app
            let template_HTML = `<table class="mt-3 w-100 permission-table"><thead>`
                + `<tr><th width="20%">${$trans.data('application')}</th><th>${$trans.data('view_all')}</th>`
                + `<th>${$trans.data('create')}</th><th>${$trans.data('view')}</th>`
                + `<th>${$trans.data('edit')}</th><th>${$trans.data('delete')}</th>`
                + `<th width="25%">${$trans.data('permission_range')}</th><th>${$trans.data('actions')}</th></tr><tbody>${app_list}</tbody></table>`
            // append HTML for collapse
            let $htmlPermDetail = $('#employee-perm-detail');
            $htmlPermDetail.append(`<div class="row mb-5"><button type="button"`
                + ` class="btn btn-gradient-${random_style} col-lg-2" data-bs-toggle="collapse" `
                + `data-bs-target="#collapse-module-${idx}">${plan.title}</button><div class="clearfix"></div>`
                + `<div class="show mt-4" id="collapse-module-${idx}"><a href="javascript:void(0)" `
                + `class="btn link-primary hidden add-new-perm"><i class="fas fa-plus-square"></i>`
                +`&nbsp;&nbsp;${$trans.data('add')}</a><input type="hidden" class="plan_id" `
                + `value="${plan.id}">${template_HTML}</div></div>`
            );

            // init all action related of permission
            initCheckAll()
            initDelete()
        }
    }
    else {
        $('#btn-edit-emp-permission').attr('disabled', true).addClass('disabled')
    }

}

/***
 * render new row of table into application
 */
function addNewPermission() {
    let _row = `<tr><td width="20%"><select class="form-select select_app"></select></td>`
        + `<td><input class="check_all" type="checkbox"/></td>`
        + `<td></td>`
        + `<td></td>`
        + `<td></td>`
        + `<td></td>`
        + `<td width="25%">${$('.template-factory .belong-to').html()}</td>`
        + `<td><button type="button" class="btn btn-delete"><i class="fas fa-trash-alt"></i></button></td>`
        + `</tr>`


    $('.add-new-perm').on('click', function (e) {
        let slt_opt = '<option value="" disabled selected hidden>select options</option>';
        e.preventDefault();
        let $thisParent = $(this).closest('.row')
        const this_plan_id = $thisParent.find('.plan_id').val();
        for (let item of DETAIL_APP_FL_PLAN[this_plan_id]) {
            let disabled = ''
            // check if option has been selected before
            if (DROP_COMBOBOX_SELECTED.hasOwnProperty(this_plan_id)
                && DROP_COMBOBOX_SELECTED[this_plan_id].includes(item.id))
                disabled = 'disabled'
            slt_opt += `<option value="${item.id}" data-code="${item.code}" ${disabled}>${item.title}</option>`
        }
        let $table = $thisParent.find('.permission-table')
        $table.find('tbody').append(_row)
        let $row = $table.find('tbody tr').last()
        $row.find('.select_app').html(slt_opt)
        onChangeAppCombobox($row)
        initCheckAll()
        initDelete()
    })
}

/***
 * event on change select application
 * @param rowElm element row table
 * @param {{perm_per_app:string}} data
 */
function onChangeAppCombobox(rowElm) {
    rowElm.find('.select_app').on("change", function () {
        let _code = $(this).find(':selected').data('code');
        const _URL = $('.url-factory').data('link-1');
        // call Ajax to get permission list of application
        $.fn.callAjax(_URL, "GET", { app_id: this.value, app__code: _code}).then(
            (res) => {
                let _create = '', _view = '', _edit = '', _delete = '';
                if (res.data.perm_per_app)
                    for (let item of res.data.perm_per_app) {
                        let split_item = item.app.code === _code
                        if (item.permission.slice(0, 6) === 'create' && split_item) _create = item.permission
                        else if (item.permission.slice(0, 6) === 'delete' && split_item) _delete = item.permission
                        else if (item.permission.slice(0, 4) === 'edit' && split_item) _edit = item.permission
                        else if (item.permission.slice(0, 4) === 'view' && split_item) _view = item.permission
                    }
                rowElm.find('td').eq(2).html(`<input name="${_create}" type="checkbox" ${_create ? 'checked': ''}/>`);
                rowElm.find('td').eq(3).html(`<input name="${_view}" type="checkbox" ${_view ? 'checked': ''}/>`);
                rowElm.find('td').eq(4).html(`<input name="${_edit}" type="checkbox" ${_edit ? 'checked': ''}/>`);
                rowElm.find('td').eq(5).html(`<input name="${_delete}" type="checkbox" ${_delete ? 'checked': ''}/>`);
            }
        ) // end call Ajax

        let plan_id = $(this).closest('[id*="collapse-module-"]').find('.plan_id').val()
        if (DROP_COMBOBOX_SELECTED.hasOwnProperty(plan_id))
            DROP_COMBOBOX_SELECTED[plan_id].push(this.value)
        else DROP_COMBOBOX_SELECTED[plan_id] = [this.value]

        // convert select to text
        rowElm.find('td').eq(0).html(`<span data-app_id="${this.value}"><i class="fas fa-star"></i>`
            +` ${$(this).find(':selected').text()}</span>`);
        // end convert


    });
}

/***
 * call API update when user click update btn
 */
function PermUpdateBtn() {
    // permission_by_configured
    $('#button-save-employee-permission:not(:disabled)').on('click', function (e) {
        e.preventDefault();
        $(this).addClass('disabled');
        $(this).attr('disabled', true);
        $(this).find('span').removeClass('hidden');

        let permissions_data = {}
        $('#employee-perm-detail .row').each(function () {
            $(this).find('.permission-table tbody tr').each(function () {
                let $child = $(this);
                let _opt = parseInt($child.find('.select_range').val()),
                    $create = $child.find('input[name*="create__"]'),
                    $view = $child.find('input[name*="view__"]'),
                    $edit = $child.find('input[name*="edit__"]'),
                    $delete = $child.find('input[name*="delete__"]')

                if ($create.prop('checked'))
                    permissions_data[$create.attr('name')] = {option: _opt}
                if ($view.prop('checked'))
                    permissions_data[$view.attr('name')] = {option: _opt}
                if ($edit.prop('checked'))
                    permissions_data[$edit.attr('name')] = {option: _opt}
                if ($delete.prop('checked'))
                    permissions_data[$delete.attr('name')] = {option: _opt}
            })
        }) // end for loop application list

        $.fn.callAjax($('.url-factory').data('link-2'), "PUT",
            {permission_by_configured: permissions_data}, $("input[name=csrfmiddlewaretoken]").val()).then(
            (res) => {
                $.fn.notifyB({description: res.data.message}, 'success')
                $(this).removeClass('disabled');
                $(this).attr('disabled', false);
                $(this).find(`span`).addClass('hidden');
            },
            (errs) => {
                // on errs reload page
                setTimeout(function(){
                    console.log(errs)
                    window.location.reload();
                }, 3000);
            }
        )
    })
}

function initCheckAll() {
    $('.check_all').off().on('change', function () {
        const is_checked = $(this).prop('checked')
        $(this).closest('tr').find('input:not(.check_all)[type="checkbox"]').prop('checked', is_checked);
    })
} // end on change check all

function initDelete(){
    $('.btn-delete').off().on('click', function(){
        let $thisParent = $(this).closest('tr')
        let app_plan = $thisParent.closest('[id*="collapse-module-"]').find('.plan_id').val(),
        app_id = $thisParent.find('td:nth-child(1) span').data('app_id');
        if (DROP_COMBOBOX_SELECTED.hasOwnProperty(app_plan))
            DROP_COMBOBOX_SELECTED[app_plan].splice(DROP_COMBOBOX_SELECTED[app_plan].indexOf(app_id), 1)
       $(this).closest('tr').remove();
    });
}
