$(document).ready(function () {
    const $FormElm = $('#project_form');

    function submitHandleFunc() {
        const frm = new SetupFormSubmit($FormElm);
        let formData = frm.dataForm;
        formData['employee_inherit_id'] = $('#selectEmployeeInherit').val()
        formData['start_date'] = moment(formData['start_date'], 'DD/MM/YYYY').format('YYYY-MM-DD')
        formData['finish_date'] = moment(formData['finish_date'], 'DD/MM/YYYY').format('YYYY-MM-DD')
        $.fn.callAjax2({
            'url': frm.dataUrl,
            'method': frm.dataMethod,
            'data': formData,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    if (frm.dataMethod === 'post') $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                }
            },
            (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            }
        )
    }

    // form submit
    SetupFormSubmit.validate($FormElm, {
        errorClass: 'is-invalid cl-red',
        submitHandler: function(){
            submitHandleFunc()
        }
    })
});

function saveGroup(gantt_obj) {
    const $gModal = $('#group_modal');
    $('#btn-group-add').off().on('click', function () {
        const $gIDElm = $('#group_id'), $tit = $('#groupTitle'), $startD = $('#groupStartDate'),
            $startE = $('#groupEndDate');
        if (!$tit.val()) {
            $.fn.notifyB({description: $.fn.gettext('Title is required')}, 'failure');
            return false
        }
        const data = {
            'project': $('#id').val(),
            'title': $tit.val(),
            'employee_inherit': $('#selectEmployeeInherit').val(),
            'gr_weight': $('#groupWeight').val() || 0,
            'gr_start_date': moment($startD.val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
            'gr_end_date': moment($startE.val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
            'order': parseInt($('.gantt-wrap').data('detail-index')) + 1
        };
        let url = $('#url-factory').attr('data-group'),
            method = 'post';
        if ($gIDElm.val()) {
            url = $('#url-factory').attr('data-group-detail').format_url_with_uuid($gIDElm.val())
            method = 'put'
            delete data['order']
        }
        $.fn.callAjax2({
            'url': url,
            'method': method,
            'data': data
        }).then(
            (resp) => {
                let res = $.fn.switcherResp(resp);
                if (res && (res['status'] === 201 || res['status'] === 200)) {
                    $.fn.notifyB({description: res.message}, 'success');

                    const crtIdx = $('.gantt-wrap').data('detail-index')
                    if (!$gIDElm.length) $('.gantt-wrap').data('detail-index', crtIdx + 1)
                    else $gIDElm.remove();
                    if (gantt_obj){
                        let temps = []
                        if (method === 'put') res = data
                        res.weight = res.gr_weight
                        res.progress = $('#groupRate').val()
                        res.date_from = res.gr_start_date
                        res.date_end = res.gr_end_date
                        if (method === 'post'){
                            temps.push(res)
                            const afterData = fGanttCustom.convert_data(temps, [])
                            gantt_obj.load_more(afterData)
                        }
                        else{
                            $gModal.modal('hide')
                            res.id = $gIDElm.val()
                            temps.push(res)
                            const afterData = fGanttCustom.convert_data(temps, [])
                            gantt_obj.update_data(afterData)
                        }
                    }
                }
            },
            (err) => {
                $.fn.notifyB({description: err.data.errors}, 'failure')
            }
        )
    });
}

function saveWork(gantt_obj) {
    const $wModal = $('#work_modal');
    $('#btn-work-add').off().on('click', function () {
        const $tit = $('#workTitle'), $startD = $('#workStartDate'), $startE = $('#workEndDate'),
            groupElm = $('#select_project_group'), workParent = $('#select_project_work'), $workID = $('#work_id');
        if (!$tit.val()) {
            $.fn.notifyB({description: $.fn.gettext('Title is required')}, 'failure');
            return false
        }
        let workType = $('#select_relationships_type').val()
        let childIdx = parseInt($('.gantt-wrap').data('detail-index')) + 1
        const data = {
            'project': $('#id').val(),
            'title': $tit.val(),
            'employee_inherit': $('#selectEmployeeInherit').val(),
            'w_weight':  $('#workWeight').val() || 0,
            'w_start_date': moment($startD.val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
            'w_end_date': moment($startE.val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
            'order': childIdx,
        }
        if (workParent.val()){
            data.work_dependencies_parent = workParent.val()
            data.order = $(`.gantt-left-container .grid-row[data-id="${workParent.val()}"]`).index() + 1
        }

        if (workType) data.work_dependencies_type = parseInt(workType)
        if (groupElm.val()) data['group'] = groupElm.val()

        let url = $('#url-factory').attr('data-work'),
            method = 'post';
        if ($workID.val()) {
            url = $('#url-factory').attr('data-work-detail').format_url_with_uuid($workID.val())
            method = 'put'
            delete data['order']
        }
        $.fn.callAjax2({
            'url': url,
            'method': method,
            'data': data
        }).then(
            (resp) => {
                let res = $.fn.switcherResp(resp);
                if (res && (res['status'] === 201 || res['status'] === 200)) {
                    $.fn.notifyB({description: res.message}, 'success');
                    let crtIdx = parseInt($('.gantt-wrap').data('detail-index'))
                    $('.gantt-wrap').data('detail-index', crtIdx + 1)
                    if (gantt_obj){
                        let temps = []
                        if (method === 'put')
                            res = data
                        res.weight = res.w_weight
                        res.progress = $('#workRate').val(),
                        res.date_from = res.w_start_date
                        res.date_end = res.w_end_date
                        if (method === 'post'){
                            temps.push(res)
                            const afterData = fGanttCustom.convert_data([], temps)
                            gantt_obj.load_more(afterData)
                        }
                        else{
                            $wModal.modal('hide')
                            res.id = $workID.val()
                            temps.push(res)
                            const afterData = fGanttCustom.convert_data([], temps)
                            gantt_obj.update_data(afterData)
                        }
                    }
                }
            },
            (err) => {
                $.fn.notifyB({description: err.data.errors}, 'failure')
            }
        )
    });
}

function show_task_list(){
    const $taskTbl = $('#task_list'), $asModal = $('#assign_modal'),
    $abdTable = $('#task_abandoned_list');
    // flag trigger when user click action link task abandoned to current work
    window.task_done = false

    $asModal.on('shown.bs.modal', function(){
        const $pjElm = $('#id'), workID = $asModal.find('#modal_work_id').val();
        const $urlPool = $('#assign_task-url');
        if ($taskTbl.hasClass('dataTable')) $taskTbl.DataTable().destroy();
        if ($abdTable.hasClass('dataTable')) $abdTable.DataTable().destroy();
        if (!$pjElm.val() || !workID) return false

        // get current task assign for current work
        $.fn.callAjax2({
            'url': $taskTbl.attr('data-url'),
            'method': 'get',
            'data': {"project_id": $pjElm.val()},
            'sweetAlertOpts': {'allowOutsideClick': true},
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)){
                    let task_w_list = [], task_ab_list = [];
                    for (let item of data['prj_task_list']){
                        if (item.work) task_w_list.push(item)
                        else task_ab_list.push(item)
                    }
                    // render task work list
                    let table_work = $taskTbl.DataTableDefault({
                            data: task_w_list,
                            info: false,
                            searching: false,
                            ordering: false,
                            paginate: false,
                            columns: [
                                {
                                    data: 'task',
                                    width: '10%',
                                    class: 'text-center',
                                    render: (row, type, data) => {
                                        const url = $urlPool.attr('data-task_detail').format_url_with_uuid(row.id)
                                        return row ? `<a href="${url}" class="task_detail_view">${row.code}</a>` : '--'
                                    }
                                },
                                {
                                    data: 'task',
                                    width: '25%',
                                    class: 'text-center',
                                    render: (row) => {
                                        return `${row ? row.title : '--'}`
                                    }
                                },
                                {
                                    data: 'percent',
                                    width: '15%',
                                    class: 'text-center',
                                    render: (row) => {
                                        let txt = `${row}%`
                                        if (row)
                                            txt = `<div class="progress-wrap progress-lb-wrap progress"> <div class="progress-bar progress-bar-striped bg-primary progress-bar-animated w-${row}" role="progressbar" aria-valuenow="${row}" aria-valuemin="0" aria-valuemax="100">${row}%</div></div>`
                                        return txt
                                    }
                                },
                                {
                                    data: 'assignee',
                                    width: '15%',
                                    class: 'text-center',
                                    render: (row) => {
                                        let txt = '--'
                                        if (row) txt = row.full_name
                                        return txt
                                    }
                                },
                                {
                                    data: 'id',
                                    width: '10%',
                                    class: 'text-center',
                                    render: (row, index, data) => {
                                        let txt = $('.btn-task-assign').html();
                                        return txt
                                    }
                                },
                            ],
                            rowCallback: function(row, data){
                                $('.task_detail_view', row).on('click', function(e){
                                    e.preventDefault();
                                    $('#assign_modal').modal('hide')
                                    $('.task_detail_view').trigger('Task.click.view', [{
                                        'id': data.id, 'task': data.task.id, 'work_id': workID
                                    }])
                                })
                                $('.unlink-row', row).on('click', function (e) {
                                    $('.task_detail_view').trigger('Task.link.work', [{
                                        'id': data.id, 'unlink': true
                                    }])
                                    table_work.row(row).remove().draw(false)
                                })
                            },
                        });

                    // render task without work
                    let table_n_work = $abdTable.DataTableDefault({
                        data: task_ab_list,
                        info: false,
                        searching: false,
                        ordering: false,
                        paginate: false,
                        autoWidth: true,
                        scrollX: true,
                        columns: [
                            {
                                data: 'task',
                                width: '10%',
                                class: 'text-center',
                                render: (row, type, data) => {
                                    const url = $urlPool.attr('data-task_detail').format_url_with_uuid(row.id)
                                        return row ? `<a href="${url}" class="task_detail_view">${row.code}</a>` : '--'
                                }
                            },
                            {
                                data: 'task',
                                width: '25%',
                                class: 'text-center',
                                render: (row) => {
                                    return `${row ? row.title : '--'}`
                                }
                            },
                            {
                                data: 'percent',
                                width: '15%',
                                class: 'text-center',
                                render: (row) => {
                                    let txt = `${row}%`;
                                    if (row)
                                        txt = `<div class="progress-wrap progress-lb-wrap progress"> <div class="progress-bar progress-bar-striped bg-primary progress-bar-animated w-${row}" role="progressbar" aria-valuenow="${row}" aria-valuemin="0" aria-valuemax="100">${row}%</div></div>`
                                    return txt
                                }
                            },
                            {
                                data: 'assignee',
                                width: '15%',
                                class: 'text-center',
                                render: (row, index, data) => {
                                    let txt = '--'
                                        if (row) txt = row.full_name
                                        return txt
                                }
                            },
                            {
                                data: 'work_before',
                                width: '25%',
                                class: 'text-center',
                                render: (row, index, data) => {
                                    let txt = '--'
                                    if (row.hasOwnProperty('title')) txt = row?.['title']
                                    return txt
                                }
                            },
                            {
                                data: 'id',
                                width: '10%',
                                render: (row, index, data) => {
                                    let txt = $('.abd-btn-group').html();
                                    return txt
                                }
                            },
                        ],
                        rowCallback: function (row, data, index) {
                            // handle onclick btn link to work
                            $('.btn-link-to-work', row).on('click', function (e) {
                                e.preventDefault();
                                $('.task_detail_view').trigger('Task.link.work', [{
                                    'id': data.id, 'work_id': workID
                                }])
                                table_n_work.row(row).remove().draw(false)
                            })
                            // open task detail
                            $('.task_detail_view', row).on('click', function (e) {
                                e.preventDefault();
                                $('#assign_modal').modal('hide')
                                $('.task_detail_view').trigger('Task.click.view', [{
                                    'id': data.id, 'task': data.task.id
                                }])
                            })
                            // del task
                            $('.btn-delete-task', row).on('click', function (e) {
                                e.preventDefault();
                                Task_in_project.deleteTask(data.task.id)
                                table_n_work.row(row).remove().draw(false)
                            })
                        },
                    });

                    // init tab when click
                    $('a[data-bs-toggle="tab"][href="#tab_task_list"]').on('shown.bs.tab', () => table_work.columns.adjust())
                    $('a[data-bs-toggle="tab"][href="#tab_abandoned_task"]').on('shown.bs.tab', () => table_n_work.columns.adjust())
                }
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )
    })

}

class ProjectTeamsHandle {
    static crt_user = []

    static saveMemberPermission(){
        const btnElm = $('#btnSavePermitMember'), ElmEditBlock = $('#box-edit-permit');
        btnElm.on('click', function(e){
            e.preventDefault();
            let bodyData = {
                'permit_view_this_project': $('#view_this_project').prop('checked'),
                'permit_add_member': $('#can_add_member').prop('checked'),
                'permit_add_gaw': $('#can_add_gaw').prop('checked'),
                'permission_by_configured': new HandlePlanAppNew().combinesPermissions(),
            };
            const urlData = ElmEditBlock.attr('data-url-update').format_url_with_uuid(ElmEditBlock.attr('data-id'));
            $.fn.callAjax2({
                url: urlData,
                method: 'PUT',
                data: bodyData,
                'sweetAlertOpts': {'allowOutsideClick': true},
            }).then(
                (resp) => {
                    let res = $.fn.switcherResp(resp);
                    if (res.status === 200) $.fn.notifyB({description: res.message}, 'success');
                },
                (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
            )

        })
    }

    static clickEditMember(memberIdx) {
        const wrapPermEle = $('#box-edit-permit');
        wrapPermEle.attr('data-id', memberIdx);

        let urlTmp = wrapPermEle.attr('data-url').format_url_with_uuid(memberIdx);
        $.fn.callAjax2({
            url: urlTmp,
            type: 'GET',
            'sweetAlertOpts': {'allowOutsideClick': true},
        }).then(
            (resp) => {
                let res = $.fn.switcherResp(resp);
                if (res.status === 200) {
                    $('#view_this_project').prop('checked', res['permit_view_this_project']);
                    $('#can_add_member').prop('checked', res.permit_add_member);
                    $('#can_add_gaw').prop('checked', res['permit_add_gaw']);

                    HandlePlanAppNew.rangeAllowOfApp = ["1", "4"];
                    HandlePlanAppNew.hasSpaceChoice = true;
                    HandlePlanAppNew.manual_app_list_and_not_plan_app = true;
                    HandlePlanAppNew.setPermissionByConfigured(res.permission_by_configured || [])

                    let clsNew = new HandlePlanAppNew();
                    clsNew.renderPermissionSelected(
                        memberIdx, {
                            'get_from': 'project',
                            'project': $('#id').val(),
                    })
                }
                return {};
            },
            (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
        )
    }

    static render(datas=[], is_detail = false){
        if (!datas) return true
        const project_PM = $('#selectEmployeeInherit').val()

        // render member
        for (let data of datas){
            ProjectTeamsHandle.crt_user.push(data.id)
            let temp = $($('.member-tags').html())
            temp.find('.card').attr('data-id', data.id)
            if (data?.['avatar']) temp.find('.avatar img').attr('src', data?.['avatar'])
            else {
                const nameHTML = $x.fn.renderAvatar(data, '',"","full_name")
                temp.find('.avatar').replaceWith(nameHTML);
            }
            temp.find('.card-main-title p').eq(0).text(data.full_name)
            temp.find('.card-main-title p a').text(data.email).attr('href', 'mailto:'+ data.email)

            if(project_PM && project_PM !== data.id)
                temp.find('.card-action-wrap .card-action-close').removeClass('hidden')
            $('#tab_members .wrap_members').prepend(temp)
            if (is_detail === true){
                temp.find('.card-action-wrap .card-action-edit i').addClass('bi-eye-slash-fill').removeClass('fa-pen')
                $('#btnSavePermitMember').addClass('disabled')
                $('#member-current-edit').prop('disabled', true)
            }

            // event click edit permission of card member
            temp.find('.card-action-wrap .card-action-edit').on('click', function(){
                $('.card-action-wrap .card-action-edit').find('i').addClass('bi-eye-slash-fill').removeClass('bi-eye-fill')
                $(this).find('i').addClass('bi-eye-fill').removeClass('bi-eye-slash-fill')
                $('#box-edit-permit').removeClass('hidden')
                $('#member-current-edit').val(data.id).trigger('change');
            });
        }

        // init select member
        $('#member-current-edit').initSelect2({
            data: datas,
            keyText: 'full_name',
        }).on('change', function(){
            ProjectTeamsHandle.clickEditMember(this.value)
        })
    }

    static load_employee(){
        const $tblElm = $('#dtbMember');
        $tblElm.DataTableDefault({
                rowIdx: true,
                paging: false,
                ajax: {
                    url: $tblElm.attr('data-url'),
                    type: 'get',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('employee_list')) {
                            return resp.data['employee_list'] ? resp.data['employee_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        render: (data, type, row) => {
                            return '';
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-20',
                        render: (data) => {
                            return `<span class="span-emp-code">{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'full_name',
                        className: 'wrap-text w-30',
                        render: (data) => {
                            return `<span class="span-emp-name">{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'group',
                        className: 'wrap-text w-30',
                        render: (data) => {
                            return `<span class="span-emp-email">{0}</span>`.format_by_idx(
                                data.title || '--'
                            )
                        }
                    },
                    {
                        data: 'is_checked_new',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            if (row.id in ProjectTeamsHandle.crt_user)
                            if ($('.member-item .card[data-id="' +  + '"]').length > 0) {
                                return `<span class="form-check"><input data-id="${row.id}" type="checkbox" class="form-check-input input-select-member" checked readonly disabled /></span>`
                            }
                            return `<span class="form-check"><input data-id="${row.id}" type="checkbox" class="form-check-input input-select-member" ${data === true ? "checked" : ""}/></span>`
                        }
                    },
                ],
                rowCallback: function (row, data) {
                    $('.input-select-member', row).on('change', function () {
                        let is_checked = $(this).prop('checked');
                        data['is_checked_new'] = is_checked;
                    })
                },
            });
    }

    static addMember(){
        $('#add-member').on('click', function(){
            const list_add = $('#dtbMember').DataTable().data().toArray().filter((item
            ) => item.is_checked_new && $(`.member-item .card[data-id="${item.id}"]`).length === 0)
            $.fn.callAjax2({
                'url': $('#url-factory').attr('data-member').replace("1", $('#id').val()),
                'method': 'POST',
                'data': {members: list_add.map((item) => item.id)},
                'sweetAlertOpts': {'allowOutsideClick': true},
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        ProjectTeamsHandle.render(list_add)
                    }
                },
                (err) => {
                    $.fn.notifyB({description: err.data.errors}, 'failure')
                }
            )

        });
    }

    static init(){
        ProjectTeamsHandle.load_employee()
        ProjectTeamsHandle.addMember()
        ProjectTeamsHandle.saveMemberPermission()
    }
}