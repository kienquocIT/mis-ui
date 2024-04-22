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
                    $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
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
        submitHandler: submitHandleFunc
    })

    // handle modal employee show
    $('#modal_employee_list').on('show.bs.modal', function () {
        let $tblUser = $('#dtbMember');
        let tblData =$tblUser.DataTable().data().toArray();
        for (let data of tblData){
            if (ProjectTeamsHandle.crt_user.includes(data.id)) data['is_checked_new'] = true
        }
        $tblUser.DataTable().clear().rows.add(tblData).draw();
    });

});

function saveGroup() {
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
            'gr_rate': $('#groupRate').val() || 0,
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
                    $gModal.modal('hide')
                    const crtIdx = $('.gantt-wrap').data('detail-index')
                    if (!$gIDElm.length) $('.gantt-wrap').data('detail-index', crtIdx + 1)
                    else $gIDElm.remove();
                }
            },
            (err) => {
                $.fn.notifyB({description: err.data.errors}, 'failure')
            }
        )
    });
}

function saveWork() {
    const $gModal = $('#work_modal');
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
            'group': '',
            'title': $tit.val(),
            'employee_inherit': $('#selectEmployeeInherit').val(),
            'w_weight':  $('#workWeight').val() || 0,
            'w_rate': $('#workRate').val() || 0,
            'w_start_date': moment($startD.val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
            'w_end_date': moment($startE.val(), 'DD/MM/YYYY').format('YYYY-MM-DD'),
            'order': childIdx,
        }
        if (workParent.val()){
            data.work_dependencies_parent = workParent.val()
            data.order = $(`.gantt-left-container .grid-row[data-id="${workParent.val()}"]`).index() + 1
        }

        if (workType) data.work_dependencies_type = parseInt(workType)
        if (groupElm.val()) data.group = groupElm.val()

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
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    let crtIdx = parseInt($('.gantt-wrap').data('detail-index'))
                    $('.gantt-wrap').data('detail-index', crtIdx + 1)
                    $gModal.modal('hide')
                }
            },
            (err) => {
                $.fn.notifyB({description: err.data.errors}, 'failure')
            }
        )
    });
}

class ProjectTeamsHandle {
    static crt_user = []

    static render(datas=[]){
        if (!datas) return true
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
            $('#tab_members .row').prepend(temp)
        }
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
                        $x.fn.updateDataRow(this, function (clsThat, rowIdx, rowData) {
                            rowData['is_checked_new'] = is_checked
                            return {
                                ...rowData,
                                is_checked_new: is_checked,
                                idx: rowIdx + 1,
                            }
                        }, false);
                    })
                },
            });
    }

    static addMember(){
        $('#add-member').on('click', function(){
            const list_add = $('#dtbMember').dataTable().data().toArray().filter((item
            ) => item.is_checked_new && $('.member-item .card[data-id="' + item + '"]').length === 0)
            console.log('list_add', list_add)
        });
    }
    static init(){
        ProjectTeamsHandle.load_employee()
        ProjectTeamsHandle.addMember()
    }
}