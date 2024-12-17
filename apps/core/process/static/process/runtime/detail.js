$(document).ready(function () {
    const target$ = $("#process-runtime-detail");
    const stagesAllHead$ = target$.find('.stages-all-head-items');
    const frm$ = $('#form-process');

    let employee_created_id = null;
    let memberIDs = [];
    let memberData = [];
    const membersGroup$ = $('#members-group');
    const defaultUrlAvatar = membersGroup$.data('url-avatar-default');
    const addMember$ = $('#inp-employee-members');
    const frmAddMember$ = $('#frm-add-member');
    const modal$ = $('#modalAddMember');

    $.fn.callAjax2({
        url: target$.data('url'),
        method: 'GET',
        isLoading: true,
    }).then(resp => {
        stagesAllHead$.empty();
        const detailData = $.fn.switcherResp(resp);
        if (detailData) {
            const processDetail = detailData?.['process_runtime_detail'] || {};
            frm$.find(':input[name=title]').val(processDetail?.['title'] || '');
            frm$.find(':input[name=remark]').val(processDetail?.['remark'] || '');

            employee_created_id = processDetail?.['employee_created_id'];

            const linkProcessConfig$ = $('#link-process-config');
            linkProcessConfig$.attr('href', linkProcessConfig$.attr('href').replaceAll('__pk__', processDetail?.['config']?.['id'] || '')).show(0);

            const oppData = processDetail?.['opp'];
            const opp$ = frm$.find(':input[name=opp]');
            const oppLink$ = opp$.siblings('.form-text');
            const btnSync$ = $('#btn-sync-member');
            if (oppData) {
                opp$.val(oppData?.['title'] || '');
                oppLink$.attr('href', oppLink$.attr('href').replaceAll('__pk__', oppData?.['id']));

                btnSync$.on('click', function (){
                    $.fn.callAjax2({
                        url: $(this).data('url'),
                        method: 'PUT',
                        data: {},
                        isLoading: true,
                    }).then(
                        resp => {
                            const data = $.fn.switcherResp(resp);
                            if (data) $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success');
                        }
                    )
                }).show(0)
            } else {
                oppLink$.hide(0);
                btnSync$.remove();
            }

            const clsProcess = new ProcessStages(target$, processDetail, {
                'debug': true,
                'enableAppInfoShow': true,
                'enableAppControl': true,
                'enableStagesInfoShow': true,
            },);
            clsProcess.init();

            $.fn.callAjax2({
                url: membersGroup$.data('url'),
                method: 'GET',
                isLoading: true,
                loadingOpts: {
                    'html': $.fn.gettext('Loading process members'),
                },
            }).then(resp => {
                const data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('process_runtime_members')) {
                    const memberDataAPI = data?.['process_runtime_members'] || [];
                    if (memberDataAPI && Array.isArray(memberDataAPI)) {
                        memberDataAPI.map(item => {
                            if (item?.['employee']?.['id']) memberIDs.push(item['employee']['id']);
                            memberData.push(item);
                        })
                        render_members();
                    }
                }
            })
        }
    }, errs => $.fn.switcherResp(errs),);

    function remove_member(ele$) {
        const memberItemData = ele$.data('memberData');
        if (memberItemData && memberItemData.hasOwnProperty('id')) {
            $.fn.callAjax2({
                url: membersGroup$.data('url-member-delete').replaceAll('__pk__', memberItemData['id']),
                method: 'DELETE',
                isLoading: true,
            }).then(resp => {
                const data = $.fn.switcherResp(resp);
                if (data) {
                    if (memberIDs.indexOf(memberItemData?.['id']) !== -1) delete memberIDs[memberItemData['id']];
                    memberData = memberData.filter(item => item?.['id'] !== memberItemData['id']);
                    $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success');
                    render_members();
                }
            })
        }
    }

    function render_members() {
        membersGroup$.empty();
        const txtCreatedBy = $.fn.gettext('Created by')
        const txtAt = $.fn.gettext('at')
        memberData.map(item => {
            const ele$ = $(`
                    <div class="members-item" id="idx-${$x.fn.randomStr(10)}">
                        <div class="member-head">
                            <img src="${defaultUrlAvatar}" alt="">
                        </div>
                        <div class="member-body">
                            <div class="body-text">
                                <div style="text-align: center">
                                    <p class="text-person">-</p>
                                    <p class="text-person-sub">-</p>
                                    <span class="text-person-log">
                                        ${txtCreatedBy}
                                        <span class="text-employee-created text-primary">-</span>
                                        ${txtAt}
                                        <span class="text-date-created text-primary">-</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="member-foot">
                            <div class="body-control">
                                <button type="button" class="btn-remove-member btn btn-outline-danger btn-xs"><i class="fa-regular fa-trash-can"></i></button>
                            </div>
                        </div>
                    </div>
                `);
            ele$.data('memberData', item);
            const employeeDetailUrl = membersGroup$.data('url-employee-detail').replaceAll('__pk__', item?.['employee']?.['id']);
            ele$.find('.text-person').html(`<a href="${employeeDetailUrl}" target="_blank">${item?.['employee']?.['full_name'] || ''}</a>`);
            ele$.find('.text-person-sub').text(item?.['employee']?.['code'] || '');
            ele$.find('.text-employee-created').text(item?.['employee_created']?.['full_name'] || '');
            ele$.find('.text-date-created').text(item?.['date_created'] || '');
            membersGroup$.append(ele$);

            const employee_id = item?.['employee']?.['id'] || null;
            if (employee_id === employee_created_id || item?.['is_system'] === true) {
                ele$.find('.text-person').prepend(`
                    <i 
                        class="fa-solid fa-lock mr-2 text-danger"
                        data-bs-toggle="tooltip"
                        title="${$.fn.gettext('Members are controlled only by the system')}"
                    ></i>
                `);
                ele$.find('button.btn-remove-member').remove();
            } else ele$.find('button.btn-remove-member').on('click', function () {
                Swal.fire({
                    title: $.fn.gettext('Are you sure about this delete?'),
                    showCancelButton: true,
                    confirmButtonText: $.fn.gettext('Yes, delete it'),
                    cancelButtonText: $.fn.gettext('Cancel'),
                    icon: 'question',
                }).then((result) => {
                    if (result.isConfirmed) {
                        remove_member(ele$);
                    }
                });
            })
            ele$.find('[data-bs-toggle="tooltip"]').tooltip();
        })

    }

    $('#btn-collapse-members').on('click', function () {
        $(this).toggleClass('icon-caret-active');
        membersGroup$.slideToggle();
    })

    addMember$.initSelect2({
        multiple: true,
        url: addMember$.data('url'),
        method: 'GET',
        keyResp: 'employee_list',
        keyText: 'full_name',
        templateResult: function (state) {
            const groupTitle = state.data?.group?.['title'];
            return state.id && groupTitle ? `${state.text} ${groupTitle ? ' - ' + groupTitle : ''}` : state.text;
        },
        callbackDataResp: function (resp, keyResp) {
            let result = SelectDDControl.get_data_from_resp(resp, keyResp);
            return result.filter(item => memberIDs.indexOf(item.id) === -1)
        },
        dataParams: {
            'is_minimal': true,
            'ordering': 'last_name'
        },
        isLoading: true,
    });
    SetupFormSubmit.validate(frmAddMember$, {
        submitHandler: function (form, event) {
            event.preventDefault();
            const bodyData = $(form).serializeObject();
            if (bodyData.hasOwnProperty('employees')) {
                if (bodyData['employees'] && Array.isArray(bodyData['employees']) && bodyData['employees'].length > 0) {
                    $.fn.callAjax2({
                        url: $(form).data('url'),
                        method: 'POST',
                        data: bodyData,
                        isLoading: true,
                    }).then(resp => {
                        const data = $.fn.switcherResp(resp);
                        if (data && data.hasOwnProperty('process_runtime_members')) {
                            const results = data?.['process_runtime_members'] || [];
                            results.map(result => {
                                if (result && result.hasOwnProperty('id')) {
                                    memberIDs.push(result?.['employee']?.['id']);
                                    memberData.push(result);
                                }
                            })
                            $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success');
                            modal$.modal('hide');
                            render_members();
                        }
                    })
                }
            }
        },
    })
})