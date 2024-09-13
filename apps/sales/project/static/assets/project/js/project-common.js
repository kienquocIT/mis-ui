$(document).ready(function () {
    const $FormElm = $('#project_form');

    function submitHandleFunc() {
        const frm = new SetupFormSubmit($FormElm);
        let formData = frm.dataForm, $elmExpenseLst = $('#work_expense_tbl');
        formData.employee_inherit = $('#employeeInheritInput').attr('data-value')
        formData.start_date = moment(formData['start_date'], 'DD/MM/YYYY').format('YYYY-MM-DD')
        formData.finish_date = moment(formData['finish_date'], 'DD/MM/YYYY').format('YYYY-MM-DD')

        if ($elmExpenseLst.length) { // data edit
            formData.work_expense_data = {}
            formData.delete_expense_lst = [...new Set($('#work_expense_data').data('delete_lst'))]
            formData.expense_data = ProjectWorkExpenseHandle.saveExpenseData()
            for (let item of $elmExpenseLst.DataTable().data().toArray()) {
                if (item?.expense_data) formData.work_expense_data[item.id] = item.expense_data
            }
        }

        frm.dataForm = formData

        $.fn.callAjax2({
            'url': frm.dataUrl,
            'method': frm.dataMethod,
            'data': formData,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    if (frm.dataMethod === 'post'){
                        window.location.replace($FormElm.attr('data-url-redirect').format_url_with_uuid(data.id))
                    }
                    setTimeout(() => {
                        window.location.reload()
                    }, 500)
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
        submitHandler: function () {
            submitHandleFunc()
        }
    })

    $('.toggle-ud .btn').on('click', () => $('.toggle-ud').toggleClass('is_show'))

    $('.toggle-notes').on('click', function () {
        $('.content-notes').slideToggle()
    })

    // complete project
    $('#complete_project, #open_project').on('click', function () {
        $(this).addClass('disabled');
        let data = {'system_status': 3}
        if (parseFloat($('.completion_rate_block .heading span').text()) !== 100)
            data.system_status = 4
        if ($(this)[0].getAttribute("id") === 'open_project')
            data = {'system_status': 2}
        $.fn.callAjax2({
            'url': $FormElm.attr('data-url'),
            'method': 'put',
            'data': data,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200))
                    $.fn.notifyB({description: data.message}, 'success');
                window.location.href = $('#url-factory').attr('data-list');
            })
    });

    $('#groupWeight, #workWeight').keyup(delay(function (e) {
        validWeight(this)
    }, 500));

    // run action click icon load popup BOM
    action_select_bom()
});

function reGetDetail(gantt_obj) {
    const $FormElm = $('#project_form');
    $('.lazy_loading').addClass('active')
    $.fn.callAjax2({
        'url': $FormElm.attr('data-url-detail'),
        'method': 'get'
    })
        .then(
            (resp) => {
                let res = $.fn.switcherResp(resp);
                if (res && (res['status'] === 201 || res['status'] === 200)) {
                    let group = res['groups'];
                    let work = res['works'];
                    const afterData = fGanttCustom.convert_data(group, work);
                    gantt_obj.refresh(afterData);
                    $('.lazy_loading').delay(1000).removeClass('active');
                }
            }
        )
}

function saveGroup(gantt_obj) {
    const $gModal = $('#group_modal'), $urlFact = $('#url-factory');
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
        let url = $urlFact.attr('data-group'),
            method = 'post';
        if ($gIDElm.val()) {
            url = $urlFact.attr('data-group-detail').format_url_with_uuid($gIDElm.val())
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
                    const $ganttElm = $('.gantt-wrap'), crtIdx = $ganttElm.data('detail-index');
                    if (!$gIDElm.length) $ganttElm.data('detail-index', crtIdx + 1)
                    else $gIDElm.remove();
                    // get detail and reload group work
                    $gModal.modal('hide')
                    reGetDetail(gantt_obj)
                }
            },
            (err) => {
                $.fn.notifyB({description: err.data.errors}, 'failure')
            }
        )
    });
}

function saveWork(gantt_obj) {
    const $wModal = $('#work_modal'), $urlFact = $('#url-factory'), $ganttElm = $('.gantt-wrap');
    $('#btn-work-add').off().on('click', function () {
        $(this).prop('disabled', true)

        const $tit = $('#workTitle'), $startD = $('#workStartDate'), $startE = $('#workEndDate'),
            groupElm = $('#select_project_group'), workParent = $('#select_project_work'), $workID = $('#work_id');
        if (!$tit.val()) {
            $.fn.notifyB({description: $.fn.gettext('Title is required')}, 'failure');
            return false
        }
        let workType = $('#select_relationships_type').val(),
            childIdx = parseInt($('.gantt-wrap').data('detail-index')) + 1,
            data = {
                'project': $('#id').val(),
                'title': $tit.val(),
                'employee_inherit': $('#selectEmployeeInherit').val(),
                'w_weight': $('#workWeight').val() || 0,
                'w_start_date': moment($startD.val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
                'w_end_date': moment($startE.val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
                'order': childIdx
            };
        const bom_data = $('#bor_select_data').data('bor_data')
        if (bom_data) data.bom_service = bom_data

        if (workParent.val())
            data.work_dependencies_parent = workParent.val()
        else data.work_dependencies_parent = null

        if (workType) data.work_dependencies_type = parseInt(workType)
        else data.work_dependencies_type = null
        if (groupElm.val()) {
            data.group = groupElm.val();
            if (workParent.val() && !$workID.val())
                // create new work have group related
                data.order = $(`.gantt-left-container .grid-row[data-id="${workParent.val()}"]`).index() + 1
            else if ($workID.val()) data.order = parseInt($('#work_order').val())
        }

        let url = $urlFact.attr('data-work'), method = 'post';
        if ($workID.val()) {
            url = $urlFact.attr('data-work-detail').format_url_with_uuid($workID.val())
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
                    if (method === 'post') {
                        let crtIdx = parseInt($ganttElm.data('detail-index'))
                        $ganttElm.data('detail-index', crtIdx + 1)
                    }
                    // get detail and reload group work
                    $wModal.modal('hide')
                    reGetDetail(gantt_obj)
                }
                $(this).prop('disabled', false)
            },
            (err) => {
                $.fn.notifyB({description: err.data.errors}, 'failure')
                $(this).prop('disabled', false)
            }
        )
    });
}

function show_task_list() {
    const $taskTbl = $('#task_list'), $asModal = $('#assign_modal'),
        $abdTable = $('#task_abandoned_list');

    // flag trigger when user click action link task abandoned to current work
    window.task_done = false

    function runTaskList(data_list, data_n_lst) {
        const $urlPool = $('#assign_task-url'),
            check_page_version = $('#project_form').hasClass('baseline_version');
        const isDisabled = check_page_version ? 'disabled' : '';
        let workID = $asModal.find('#modal_work_id').val();

        // render task work list
        let table_work = $taskTbl.DataTableDefault({
            data: data_list,
            info: false,
            searching: false,
            ordering: false,
            paginate: false,
            columns: [
                {
                    data: 'task',
                    width: '10%',
                    class: 'text-center',
                    render: (row) => {
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
                            txt = `<div class="progress-wrap progress-lb-wrap progress"><div class="progress-bar progress-bar-striped bg-primary progress-bar-animated w-${row}" role="progressbar" aria-valuenow="${row}" aria-valuemin="0" aria-valuemax="100">${row}%</div></div>`
                        return txt
                    }
                },
                {
                    data: 'assignee',
                    width: '15%',
                    class: 'text-center',
                    render: (row) => {
                        let txt = '--'
                        if (row?.full_name) txt = row.full_name
                        return txt
                    }
                },
                {
                    data: 'id',
                    width: '10%',
                    class: 'text-center',
                    render: () => {
                        let html = $($('.btn-task-assign').html())
                        if (check_page_version) html.find('button').attr('disabled', isDisabled)
                        return html.prop('outerHTML')
                    }
                },
            ],
            rowCallback: function (row, data) {
                $('.task_detail_view', row).on('click', function (e) {
                    e.preventDefault();
                    $('#assign_modal').modal('hide')
                    $('.task_detail_view').trigger('Task.click.view', [{
                        'id': data.id, 'task': data.task.id, 'work_id': workID
                    }])
                })
                $('.unlink-row', row).on('click', function () {
                    $('.task_detail_view').trigger('Task.link.work', [{
                        'id': data.id, 'unlink': true
                    }])
                    table_work.row(row).remove().draw(false)
                })
            },
        });

        // render task without work
        let table_n_work = $abdTable.DataTableDefault({
            data: data_n_lst,
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
                    render: (row) => {
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
                    render: (row) => {
                        let txt = '--'
                        if (row?.full_name) txt = row.full_name
                        return txt
                    }
                },
                {
                    data: 'work_before',
                    width: '25%',
                    class: 'text-center',
                    render: (row) => {
                        let txt = '--'
                        if (row.hasOwnProperty('title')) txt = row?.['title']
                        return txt
                    }
                },
                {
                    data: 'id',
                    width: '10%',
                    render: () => {
                        let html = $($('.abd-btn-group').html())
                        if (check_page_version) html.find('button').attr('disabled', isDisabled)
                        return html.prop('outerHTML')
                    }
                },
            ],
            rowCallback: function (row, data) {
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

    $asModal.on('shown.bs.modal', function () {
        const $pjElm = $('#id'), $prjForm = $('#project_form'),
            check_page_version = $prjForm.hasClass('baseline_version');
        let baseline_data = $prjForm.data('baseline_data');
        if ($taskTbl.hasClass('dataTable')) $taskTbl.DataTable().destroy();
        if ($abdTable.hasClass('dataTable')) $abdTable.DataTable().destroy();
        let workID = $asModal.find('#modal_work_id').val();

        // check if project id or work not id
        if ((!$pjElm.val() || !workID) && !check_page_version) return false

        // check if detail page not baseline page
        if (!check_page_version) {
            // get current task assign for current work
            $.fn.callAjax2({
                'url': $taskTbl.attr('data-url'),
                'method': 'get',
                'data': {"project_id": $pjElm.val(), "work_id": workID},
                'sweetAlertOpts': {'allowOutsideClick': true},
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        let task_w_list = [], task_ab_list = [];
                        for (let item of data['prj_task_list']) {
                            if (item.work) task_w_list.push(item)
                            else task_ab_list.push(item)
                        }
                        runTaskList(task_w_list, task_ab_list)
                    }
                },
                (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
            )
        } else {
            let task_w_list = [], task_ab_list = [];
            for (let item of baseline_data['work_task_data']) {
                if (item.work && item.work === workID) task_w_list.push(item)
                else if (!item.work) task_ab_list.push(item)
            }
            runTaskList(task_w_list, task_ab_list)
        }

    })

}

function validateNumber(value) {
    // Replace non-digit characters with an empty string
    value = value.toString()
    let temp = value.replace(/[^0-9.]/g, '');
    // Remove unnecessary zeros from the integer part
    temp = temp.replace("-", "").replace(/^0+(?=\d)/, '');
    if (temp.indexOf(".") !== -1) temp = parseFloat(temp)
    else temp = parseInt(temp)
    let reg = new RegExp(/^-?\d*\.?\d+(e[+-]?\d+)?$/i);
    if (!reg.test(temp)) temp = 0
    return temp;
}

function validWeight(elmObj) {
    let $elm = jQuery(elmObj),
        value = elmObj.value,
        regex = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
    if (value && regex.test(value)) {
        $elm.removeClass('is-invalid cl-red')
        if (elmObj.value > 100) elmObj.value = 100
    } else {
        $elm.addClass('is-invalid cl-red')
        elmObj.value = 0
    }
}

function delay(fn, ms) {
    let timer = 0;
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(fn.bind(this, ...args), ms || 0)
    }
}

function animating_number(number, elm) {
    let start = 0;
    let startTime = null;
    let currentNumber = 0;
    let duration = 500;

    function animationStep(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        currentNumber = Math.min(start + (number * (progress / duration)), number);
        if (progress < duration)
            requestAnimationFrame(animationStep);
        else
            // Ensure the final value is set
            currentNumber = number;
        if (currentNumber % 1 !== 0)
            currentNumber = currentNumber.toFixed(1)
        elm.text(currentNumber)
    }

    requestAnimationFrame(animationStep);
}

function action_select_bom(){
    const $bor = $('#bor_select'), $WElmTitle = $('#workTitle'), $borData = $('#bor_select_data');
    $bor.initSelect2({
        callbackDataResp(resp, keyResp) {
            let list_result = resp.data[keyResp],
                _bor_lst = $borData.data('bor_data');
            if (_bor_lst) list_result.filter(item => !(item.id in _bor_lst))
            return list_result
        },
    })
    // click show modal BOM service
    $('.choice-bor').on('click', function(){
        $(this).next('.dropdown_custom').toggleClass('is_active')
    });
    // BOR list on change
    $bor.on('select2:select', function(e){
        let data = e.params.data.data;
        if (data){
            $WElmTitle.val(data.product.title).attr('readonly', true)
            $(this).closest('.dropdown_custom').toggleClass('is_active')

            $borData.data('bor_data', data.id)
            $(this).closest('.input-group').find('.choice-bor').addClass('is_selected')
        }
        else $WElmTitle.val('')
    });

    $bor.on('select2:unselect', function(e){
        $WElmTitle.val('').attr('readonly', false)
        $borData.data('bor_data', '')
        $(this).closest('.input-group').find('.choice-bor').removeClass('is_selected')
    });
}

class ProjectTeamsHandle {
    static crt_user = []

    static saveMemberPermission() {
        const btnElm = $('#btnSavePermitMember'), ElmEditBlock = $('#box-edit-permit');
        btnElm.on('click', function (e) {
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
        const wrapPermEle = $('#box-edit-permit'), $formElm = $('#project_form');
        const check_page_version = $formElm.hasClass('baseline_version');
        wrapPermEle.attr('data-id', memberIdx);
        let urlTmp = wrapPermEle.attr('data-url').format_url_with_uuid(memberIdx);

        function loadPermissionDetail(res) {
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

        if (!check_page_version) {
            $.fn.callAjax2({
                url: urlTmp,
                type: 'GET',
                'sweetAlertOpts': {'allowOutsideClick': true},
            }).then(
                (resp) => {
                    let res = $.fn.switcherResp(resp);
                    if (res.status === 200) {
                        loadPermissionDetail(res)
                    }
                    return {};
                },
                (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
            )
        } else {
            let baseline_data = $formElm.data('baseline_data');
            for (let idx in baseline_data['member_perm_data']) {
                let item = baseline_data['member_perm_data'][idx]
                if (idx === memberIdx) {
                    loadPermissionDetail(item)
                    break;
                }
            }
        }

    }

    static render(datas = [], is_detail = false) {
        if (!datas) return true
        const project_PM = $('#selectEmployeeInherit').val(), $ElmCrtEdit = $('#member-current-edit');

        // render member
        for (let data of datas) {
            ProjectTeamsHandle.crt_user.push(data.id)
            let temp = $($('.member-tags').html())
            temp.find('.card').attr('data-id', data.id)
            if (data?.['avatar']) temp.find('.avatar img').attr('src', data?.['avatar'])
            else {
                const nameHTML = $x.fn.renderAvatar(data, '', "", "full_name")
                temp.find('.avatar').replaceWith(nameHTML);
            }
            temp.find('.card-main-title p').eq(0).text(data.full_name)
            temp.find('.card-main-title p a').text(data.email).attr('href', 'mailto:' + data.email)

            if (project_PM && project_PM !== data.id)
                temp.find('.card-action-wrap .card-action-close').removeClass('hidden')
            $('#tab_members .wrap_members').prepend(temp)
            if (is_detail === true) {
                temp.find('.card-action-wrap .card-action-edit i').addClass('bi-eye-slash-fill').removeClass('fa-pen')
                $('#btnSavePermitMember').addClass('disabled')
                $ElmCrtEdit.prop('disabled', true)
            }

            // event click edit permission of card member
            temp.find('.card-action-wrap .card-action-edit').on('click', function () {
                $('.card-action-wrap .card-action-edit').find('i').addClass('bi-eye-slash-fill').removeClass('bi-eye-fill')
                $(this).find('i').addClass('bi-eye-fill').removeClass('bi-eye-slash-fill')
                $('#box-edit-permit').removeClass('hidden')
                $ElmCrtEdit.val(data.id).trigger('change');
            });
        }

        // init select member
        $ElmCrtEdit.initSelect2({
            data: datas,
            keyText: 'full_name',
        }).on('change', function () {
            ProjectTeamsHandle.clickEditMember(this.value)
        })
    }

    static load_employee() {
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
                    render: () => {
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
                            if ($('.member-item .card[data-id="' + +'"]').length > 0) {
                                return `<span class="form-check"><input data-id="${row.id}" type="checkbox" class="form-check-input input-select-member" checked readonly disabled /></span>`
                            }
                        return `<span class="form-check"><input data-id="${row.id}" type="checkbox" class="form-check-input input-select-member" ${data === true ? "checked" : ""}/></span>`
                    }
                },
            ],
            rowCallback: function (row, data) {
                $('.input-select-member', row).on('change', function () {
                    data['is_checked_new'] = $(this).prop('checked');
                })
            },
        });
    }

    static addMember() {
        $('#add-member').on('click', function () {
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

    static init() {
        ProjectTeamsHandle.load_employee()
        ProjectTeamsHandle.addMember()
        ProjectTeamsHandle.saveMemberPermission()
    }
}

class ProjectWorkExpenseHandle {
    static ValidDataRow(data) {
        if (data.expense_item.hasOwnProperty('id') &&
            data.uom.hasOwnProperty('id') &&
            data.quantity &&
            data.expense_price &&
            typeof data.is_labor == "boolean" &&
            ((!data.is_labor && data.title !== "") || (data.is_labor && data.expense_name.hasOwnProperty('id')))
        ) return true
        return false
    }

    static saveExpenseData() {
        let dataList = {}, $tblExpense = $('#work_expense_tbl tr.work-expense-wrap');
        let allList = []
        Array.from($tblExpense).forEach(function (e) {
            allList = allList.concat($(e).find('table[id*="expense_child_"]').DataTable().data().toArray())
        })
        for (let idx in allList) {
            let item = allList[idx]
            if (ProjectWorkExpenseHandle.ValidDataRow(item)) {
                const work_id = item.work_id
                if (!dataList.hasOwnProperty(work_id)) dataList[work_id] = []
                if (item.id && item.id.length === 16) delete item.id
                dataList[work_id].push(item)
            }
        }
        return dataList
    }

    static calcSubTotal(data, parentTr) {
        const tblParent = parentTr.closest('table')
        let total_unit = 0, total_tax = 0, total_price = 0;
        for (let item of data) {
            total_unit += item.expense_price * item.quantity
            total_tax += item.tax.rate > 0 ? item.tax.rate / 100 * (item.expense_price * item.quantity) : 0
            total_price += item.expense_price * item.quantity
        }
        total_price += total_tax
        // init table row
        const parentIdx = parentTr.attr('data-idx')
        tblParent.DataTable().cell(parentIdx, 1).data(total_unit)
        tblParent.DataTable().cell(parentIdx, 2).data(total_tax)
        tblParent.DataTable().cell(parentIdx, 3).data(total_price)
        ProjectWorkExpenseHandle.calcAllTotal()
        $.fn.initMaskMoney2()
    }

    static calcAllTotal() {
        let tbl = $('#work_expense_tbl').DataTable();

        let total_unit = 0, total_tax = 0, total_price = 0;
        for (let item of tbl.data().toArray()) {
            if (item.expense_data && item.expense_data.price && item.expense_data['total_after_tax']) {
                total_unit += item.expense_data.price

                total_price += item.expense_data['total_after_tax']
                if (item.expense_data.tax) total_tax += item.expense_data.tax
            }
        }
        // init calc header
        $('tr:nth-child(1) th:nth-child(3)', tbl.table().header()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${total_unit}"></span></p>`)
        $('tr:nth-child(2) th:nth-child(3)', tbl.table().header()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${total_tax}"></span></p>`)
        $('tr:nth-child(3) th:nth-child(3)', tbl.table().header()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${total_price}"></span></p>`)
    }

    static appendChildTable(trElm, workID) {
        const $formElm = $('#project_form'), check_page_version = $formElm.hasClass('baseline_version');
        let baseline_data = $formElm.data('baseline_data');
        let dtlSub = `<table id="expense_child_${workID}" class="table nowrap w-100 min-w-1768p mb-5"><thead></thead><tbody></tbody></table>`,
            $addBtn = `<button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="dropdown"><span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${$.fn.gettext("New")}</span><span class="icon"><i class="fas fa-angle-down fs-8 text-light"></i></span></span></button>`
                + `<div role="menu" class="dropdown-menu">`
                + `<a class="dropdown-item add-expense" href="#"><i class="dropdown-icon fas fa-hand-holding-usd text-primary"></i> ${$.fn.gettext("Add Expense")}</a>`
                + `<a class="dropdown-item add-labor" href="#"><i class="dropdown-icon fas fa-people-carry text-primary"></i> ${$.fn.gettext("Add Labor")}</a>`
                + `</div>`;
        if (check_page_version) $addBtn = ''
        trElm.after(
            `<tr class="work-expense-wrap"><td colspan="4"><div class="WE-content hidden-simple">${$addBtn + dtlSub}</div></td></tr>`
        );
        const $URLFactory = $('#url-factory');
        let crtTable = $('#expense_child_' + workID).DataTableDefault({
            info: false,
            searching: false,
            ordering: false,
            data: [],
            columns: [
                {
                    data: 'expense_name',
                    title: $.fn.gettext('Expense name'),
                    width: '19%',
                    render: (row, index, data) => {
                        let htmlOpt = ''
                        if (row && row.hasOwnProperty('id'))
                            htmlOpt = `<option value="${row?.id}" selected>${row.title}</option>`
                        let HTML = `<select 
                                    class="form-select expense_labor_name" 
                                    data-url="${$URLFactory.attr('data-expense')}"
                                    data-link-detail="${$URLFactory.attr('data-expense-detail')}"
                                    data-method="get" data-keyResp="expense_list" required>${htmlOpt}</select>`;
                        if (data?.['is_labor'] === false)
                            HTML = `<input type="text" class="form-control expense_name" value="${data?.title}" required>`;
                        return HTML
                    }
                },
                {
                    data: 'expense_item',
                    title: $.fn.gettext('Expense items'),
                    width: '19%',
                    render: (row, index, data) => {
                        let htmlOpt = ''
                        if (row.hasOwnProperty('id')) htmlOpt = `<option value="${row?.id}" selected>${row.title}</option>`
                        let HTML = `<select 
                                    class="form-select expense_item" 
                                    data-url="${$URLFactory.attr('data-expense_item')}"
                                    data-link-detail="${$URLFactory.attr('data-expense_item-detail')}"
                                    data-method="get" data-keyResp="expense_item_list" ${
                            data?.['is_labor'] === false ? 'required' : 'disabled'}>${htmlOpt}</select>`;
                        if (data?.['is_labor'])
                            HTML = `<select class="form-select expense_item_labor" disabled>${htmlOpt}</select>`
                        return HTML;
                    }
                },
                {
                    data: 'uom',
                    title: $.fn.gettext('UoM'),
                    width: '9.4%',
                    render: (row, index, data) => {
                        let htmlOpt = ''
                        if (row.hasOwnProperty('id')) htmlOpt = `<option value="${row?.id}" selected>${row.title}</option>`
                        let HTML = `<select class="form-select select_uom" data-url="${$URLFactory.attr('data-uom')}"
                                    data-method="get" data-keyResp="unit_of_measure" required>${htmlOpt}</select>`
                        if (data?.['is_labor'])
                            HTML = `<select class="form-select select_uom_labor" disabled>${htmlOpt}</select>`
                        return HTML
                    }
                },
                {
                    data: 'quantity',
                    width: '5.2%',
                    title: $.fn.gettext('Quantity'),
                    class: 'text-center',
                    render: (row) => {
                        return `<input type="text" class="form-control valid-number" value="${row}" required>`;
                    }
                },
                {
                    data: 'expense_price',
                    width: '11%',
                    title: $.fn.gettext('Expense Price'),
                    render: (row) => {
                        return `<input type="text" class="form-control mask-money expense_price" value="${row}" data-return-type="number">`;
                    }
                },
                {
                    data: 'sub_total',
                    width: '11%',
                    title: $.fn.gettext('Subtotal Price'),
                    render: (row) => {
                        return `<p><span class="mask-money row-sub_total" data-init-money="${parseFloat(row ? row : '0')}">${parseFloat(row ? row : '0')}</span></p>`;
                    }
                },
                {
                    data: 'tax',
                    width: '9.4%',
                    title: $.fn.gettext('Tax'),
                    render: (row) => {
                        let htmlOpt = ''
                        if (row.hasOwnProperty('id')) htmlOpt = `<option value="${row?.id}" selected>${row.title}</option>`
                        return `<select
                                    class="form-select tax_item"
                                    data-url="${$URLFactory.attr('data-tax')}"
                                    data-method="get"
                                    data-keyResp="tax_list"
                                >${htmlOpt}</select>`
                    }
                },
                {
                    data: 'sub_total_after_tax',
                    width: '11%',
                    title: $.fn.gettext('Subtotal after tax'),
                    render: (row) => {
                        return `<p><span class="mask-money row-sub_total" data-init-money="${parseFloat(row ? row : '0')}">${parseFloat(row ? row : '0')}</span></p>`;
                    }
                },
                {
                    data: 'id',
                    width: '5%',
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-dark flush-soft-hover del-row" ${check_page_version ? 'disabled' : ''}><span class="icon"><i class="far fa-trash-alt"></i></span></button>`
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                // on change EXPENSE LABOR NAME
                $('.expense_labor_name', row).on('select2:select', function (e) {
                    data.expense_name = e.params.data.data
                    data.expense_item = data.expense_name.expense_item
                    data.expense_price = data.expense_name['price_list'][0]?.price_value || 0
                    data.uom = data.expense_name.uom
                    crtTable.row(index).data(data).draw(false)
                })

                // on change EXPENSE ITEM, UoM
                $('.expense_item, .select_uom', row).on('select2:select', function (e) {
                    let data_item = e.params.data.data
                    if ($(this).hasClass('expense_item')) data.expense_item = data_item
                    else data.uom = data_item
                })

                // on change EXPENSE NAME
                $('.expense_name', row).on('change', function () {
                    data.title = this.value
                });

                // trigger on change TAX
                $('.tax_item', row).on('select2:select', function (e) {
                    let idx = $(row).index()
                    const selected = e.params.data
                    data.tax = selected.data
                    // render parent data when child data is complete row
                    if (data.expense_price && data.quantity && data?.tax && Object.keys(data.tax).length > 0) {
                        let total_after = data.expense_price * data.quantity
                        if (data.tax.rate !== 0) total_after += data.tax.rate / 100 * total_after
                        crtTable.cell(idx, 7).data(total_after).draw(false)
                        ProjectWorkExpenseHandle.calcSubTotal(crtTable.data().toArray(), trElm)
                    }
                })

                // on delete EXPENSE ROW
                $('.del-row', row).on("click", function (e) {
                    e.preventDefault()
                    crtTable.row(row).remove().draw(false)
                    const $elmExData = $('#work_expense_data')
                    let deleteList = $elmExData.data('delete_lst') || []
                    if (data.id.length > 16) deleteList.push(data.id)
                    $elmExData.data('delete_lst', deleteList)
                    ProjectWorkExpenseHandle.calcSubTotal(crtTable.data().toArray(), trElm)
                })
            },
            drawCallback: function () {
                // run select2 row
                $('.tax_item, .select_uom, .expense_item, .expense_labor_name', $('#expense_child_' + workID)).each(function () {
                    if (!$(this).hasClass("select2-hidden-accessible")) $(this).initSelect2()
                });
                // // run label money
                $.fn.initMaskMoney2()
            },
        });
        $('.add-expense, .add-labor', trElm.next()).on('click', function (e) {
            e.preventDefault()
            let temp = [{
                work_id: workID,
                id: $x.fn.randomStr(16),
                is_labor: $(this).hasClass('add-labor'),
                expense_name: '',
                title: '',
                expense_item: '',
                uom: {},
                quantity: 0,
                expense_price: 0,
                tax: {},
                sub_total: 0,
                sub_total_after_tax: 0,
            }]
            crtTable.rows.add(temp).draw()
        })

        // on change field QUANTITY and UNIT PRICE
        crtTable.on('change', 'tbody tr .valid-number, tbody tr .expense_price', function () {
            const $idx = $(this).closest('tr'),
                _idx = crtTable.row($idx).index();

            let data = crtTable.row($idx).data();

            const _this_value = validateNumber(Number(this.value))
            if ($(this).hasClass('valid-number')){
                data.quantity = _this_value
                this.value = _this_value
            }
            else data.expense_price = _this_value
            if (data.expense_price && data.quantity) {
                data.sub_total = data.expense_price * data.quantity
                crtTable.cell({row: _idx, column: 5}).data(data.sub_total).draw(false)
                let total_after = data.sub_total
                if ((data?.tax && Object.keys(data.tax).length > 0) && data.tax.rate !== 0)
                    total_after += data.tax.rate / 100 * total_after
                crtTable.cell(_idx, 7).data(total_after).draw(false)
                ProjectWorkExpenseHandle.calcSubTotal(crtTable.data().toArray(), trElm)
            }
        });

        if (!check_page_version) {
            $.fn.callAjax2({
                'url': $URLFactory.attr('data-work-expense'),
                'method': 'get',
                'data': {'work_id': workID},
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('work_expense_list'))
                        crtTable.rows.add(data.work_expense_list).draw()
                },
                (err) => {
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        } else {
            let data_lst = baseline_data.work_expense_data?.[workID]
            if (data_lst) crtTable.rows.add(data_lst).draw()
        }

    }

    static init(data = []) {
        const $workExpenseTbl = $('#work_expense_tbl');
        let WExTbl = $workExpenseTbl.DataTableDefault({
            data: data,
            info: false,
            searching: false,
            ordering: false,
            paginate: false,
            autoWidth: true,
            scrollX: true,
            stateDefaultPageControl: false,
            stateFullTableTools: false,
            columns: [
                {
                    data: 'title',
                    width: '60%',
                    render: (row) => {
                        return `<button class="btn-sh-ex btn-flush-primary btn btn-icon btn-rounded flush-soft-hover mr-1"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> ${row}`;
                    }
                },
                {
                    data: 'expense_data.price',
                    width: '15%',
                    render: (row) => {
                        return `<p><span class="mask-money" data-init-money="${parseFloat(row ? row : '0')}">${parseFloat(row ? row : '0')}</span></p>`
                    }
                },
                {
                    data: 'expense_data.tax',
                    width: '10%',
                    render: (row) => {
                        return `<p><span class="mask-money" data-init-money="${parseFloat(row ? row : '0')}">${parseFloat(row ? row : '0')}</span></p>`
                    }
                },
                {
                    data: 'expense_data.total_after_tax',
                    width: '15%',
                    render: (row) => {
                        return `<p><span class="mask-money" data-init-money="${parseFloat(row ? row : '0')}">${parseFloat(row ? row : '0')}</span></p>`
                    }
                }
            ],
            rowCallback: function (row, data, index) {
                $('.btn-sh-ex', row).on('click', function (e) {
                    e.preventDefault();
                    let tr = $(this).parents('tr');
                    tr.toggleClass('active')

                    if (!tr.hasClass('active')) {
                        // when toggle close
                        tr.next().find('.WE-content').slideToggle({complete: () => tr.next().addClass('hidden')})
                    } else {
                        // toggle open
                        if (!tr.next().hasClass('work-expense-wrap')) {
                            ProjectWorkExpenseHandle.appendChildTable(tr, data.id)
                        }
                        tr.next().removeClass('hidden').find('.WE-content').slideToggle()
                    }
                })
                $('.unlink-row', row).on('click', function (e) {
                    e.preventDefault();
                })

                // add index for update datatable when child is visible
                $(row).attr('data-idx', index)
            },
            drawCallback: function () {
                $.fn.initMaskMoney2()
            },
            footerCallback: function () {
                let api = this.api();
                // Total footer row
                let totalPrice = 0
                let totalTax = 0
                let totalAfterTax = 0
                api.rows().every(function () {
                    let data = this.data()
                    if (data?.['expense_data']?.['price'] && data?.['expense_data']?.['total_after_tax']) {
                        totalPrice += data.expense_data.price
                        totalAfterTax += data.expense_data['total_after_tax']
                        if (data?.['expense_data']?.['tax'])
                            totalTax += data.expense_data.tax
                    }
                });
                // Update header
                $('tr:nth-child(1) th:nth-child(3)', api.table().header()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${totalPrice}"></span></p>`);
                $('tr:nth-child(2) th:nth-child(3)', api.table().header()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${totalTax}"></span></p>`);
                $('tr:nth-child(3) th:nth-child(3)', api.table().header()).html(`<p class="pl-3 font-3"><span class="mask-money" data-init-money="${totalAfterTax}"></span></p>`);
            },
        });

        // init tab when click
        $('a[data-bs-toggle="tab"][href="#tab_work_expense"]').on('shown.bs.tab', () => WExTbl.columns.adjust())
    }
}

class createBaseline {
    static baselineSubmit() {
        let $urlElm = $('#url-factory');
        $('#create_baseline').on('click', function () {
            Swal.fire({
                title: $.fn.gettext("Are you sure?"),
                text: $.fn.gettext("Create baseline at this moment?"),
                icon: "question",
                showCancelButton: true,
                // buttonsStyling: false,
                confirmButtonText: $.fn.gettext('Yes, I am'),
                cancelButtonText: $.fn.gettext("No, I'm not"),
                reverseButtons: true
            }).then((result) => {
                if (result.value && result.isConfirmed) {
                    let form_data = $('#data_form').data('form_data'),
                        frm = {
                            dataUrl: $urlElm.attr('data-baseline'),
                            dataMethod: 'post',
                            dataForm: {
                                title: form_data.title,
                                code: form_data.code,
                                project_related: form_data.id,
                                project_data: form_data,
                                employee_inherit_id: $('#employeeInheritInput').attr('data-value'),
                            },
                            dataUrlRedirect: $urlElm.attr('data-list')
                        };
                    WFRTControl.callWFSubmitForm(frm);
                }
            })
        })
    }

    static init() {
        createBaseline.baselineSubmit()
    }
}