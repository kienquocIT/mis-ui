const call_log_trans_script = $('#trans-script')
const table_opportunity_call_log_list = $('#table_opportunity_call_log_list')
const call_log_Opp_slb = $('#sale-code-select-box')
const date_input = $('#date-input')
const customer_slb = $('#account-select-box')
const contact_slb = $('#contact-select-box')
const call_cancel_activity_btn = $('#call-cancel-activity')
let CALL_LOG_LIST = []

function loadOpportunityCallLogList() {
    if (!$.fn.DataTable.isDataTable('#table_opportunity_call_log_list')) {
        let dtb = table_opportunity_call_log_list;
        let frm = new SetupFormSubmit(dtb);
        dtb.DataTableDefault({
            rowIdx: true,
            scrollX: '100vw',
            scrollY: '75vh',
            scrollCollapse: true,
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('call_log_list')) {
                        CALL_LOG_LIST = resp.data['call_log_list'];
                        // console.log(CALL_LOG_LIST)
                        return resp.data['call_log_list'] ? resp.data['call_log_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return ``;
                    }
                },
                {
                    data: 'subject',
                    className: 'wrap-text w-30',
                    render: (data, type, row) => {
                        let status = ''
                        if (row?.['is_cancelled']) {
                            status = `<span class="badge badge-sm badge-soft-danger">${call_log_trans_script.attr('data-trans-activity-cancelled')}</i>`
                        }
                        return `<a class="text-primary fw-bold offcanvas-call-log-button" href="" data-bs-toggle="offcanvas" data-id="${row?.['id']}" data-bs-target="#offcanvas-call-log-detail">
                                    <span class="mr-1">${row?.['subject']}</span>${status}
                                </a>`
                    }
                },
                {
                    data: 'opportunity',
                    className: 'wrap-text text-center w-20',
                    render: (data, type, row) => {
                        return `${row?.['opportunity']?.['code']}`
                    }
                },
                {
                    data: 'employee_inherit',
                    className: 'wrap-text w-30',
                    render: (data, type, row) => {
                        return `<span class="text-blue">${row?.['employee_inherit']?.['full_name']}</span><span class="text-primary"> --- <i class="fas fa-phone-volume"></i> --- </span><a target="_blank" href="${table_opportunity_call_log_list.attr('data-url-contact-detail').replace('0', row?.['contact']?.['id'])}"><span class="text-primary underline_hover">${row?.['contact']?.['fullname']}</span></a>`
                    }
                },
                {
                    data: 'call_date',
                    className: 'wrap-text text-center w-15',
                    render: (data) => {
                        return $x.fn.displayRelativeTime(data, {
                            'outputFormat': 'DD/MM/YYYY',
                        });
                    }
                },
            ],
        });
    }
}

function loadCustomerList(data) {
    $('#account-select-box option').remove();
    customer_slb.append(`<option selected value="${data?.['id']}">${data?.['title']}</option>`);
}

function loadContactList(contact_list) {
    if (contact_list) {
        $('#contact-select-box option').remove();
        contact_slb.attr('disabled', false);
        contact_slb.initSelect2();
        contact_slb.append(`<option></option>`)
        for (let i = 0; i < contact_list.length; i++) {
            contact_slb.append(`<option value="${contact_list[i].id}">${contact_list[i].fullname}</option>`)
        }
    }
}

date_input.daterangepicker({
    singleDatePicker: true,
    timePicker: false,
    showDropdowns: true,
    autoApply: true,
    locale: {
        format: 'DD/MM/YYYY'
    },
    "cancelClass": "btn-secondary",
    maxYear: parseInt(moment().format('YYYY')) + 100,
}).val('')

$(document).on('click', '#table_opportunity_call_log_list .offcanvas-call-log-button', function () {
    let call_log_id = $(this).attr('data-id')
    let call_log_obj = CALL_LOG_LIST.filter(function (item) {
        return item?.['id'] === call_log_id;
    })[0]
    call_cancel_activity_btn.attr('data-id', call_log_id)

    $('#is-cancelled').prop('hidden', !call_log_obj?.['is_cancelled'])
    $('#detail-opp').text(call_log_obj?.['opportunity']?.['code'] + ' - ' + call_log_obj?.['opportunity']?.['title']);
    $('#detail-process').text(call_log_obj?.['process']?.['title'] ? call_log_obj?.['process']?.['title'] : '');
    $('#detail-stage').text(call_log_obj?.['process_stage_app']?.['title'] ? call_log_obj?.['process_stage_app']?.['title'] : '');
    let creator_fullname = call_log_obj?.['employee_created']?.['full_name']
    let creator_group = call_log_obj?.['employee_created']?.['group']?.['title']
    let inherit_fullname = call_log_obj?.['employee_inherit']?.['full_name']
    let inherit_group = call_log_obj?.['employee_inherit']?.['group']?.['title']
    $('#detail-creator').text(`${creator_fullname} ${creator_group ? ' - ' + creator_group : ''}`);
    $('#detail-inheritor').text(`${inherit_fullname} ${inherit_group ? ' - ' + inherit_group : ''}`);

    $('#detail-subject-input').text(call_log_obj?.['subject']);
    $('#detail-date-input').text(moment(call_log_obj?.['call_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'));
    $('#detail-account-select-box').text(call_log_obj?.['opportunity']?.['customer']?.['title']);
    $('#detail-contact-select-box').text(call_log_obj?.['contact']?.['fullname']);
    $('#detail-result-text-area').text(call_log_obj?.['input_result']);
    $('#detail-repeat-activity').prop('checked', call_log_obj?.['repeat']);
    call_cancel_activity_btn.prop('hidden', call_log_obj?.['is_cancelled'])
})

$(document).on('click', '#call-cancel-activity', function () {
    Swal.fire({
        html:
            `<div class="mb-3"><i class="bi bi-x-square text-danger" style="font-size: 50px"></i></div>
             <h5 class="text-danger">${call_log_trans_script.attr('data-trans-alert-cancel')}</h5>
             <p>${call_log_trans_script.attr('data-trans-alert-warn')}</p>`,
        customClass: {
            confirmButton: 'btn btn-outline-secondary text-danger',
            cancelButton: 'btn btn-outline-secondary text-gray',
            container: 'swal2-has-bg',
            actions: 'w-100'
        },
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: call_log_trans_script.attr('data-trans-yes'),
        cancelButtonText: call_log_trans_script.attr('data-trans-no'),
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            let call_log_id = call_cancel_activity_btn.attr('data-id')
            let dtb = table_opportunity_call_log_list;
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(dtb.attr('data-url-delete').replace(0, call_log_id), 'PUT', {'is_cancelled': !call_cancel_activity_btn.prop('disabled')}, csr)
                .then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(dtb.attr('data-url-redirect'), 1000);
                    }
                }, (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                })
        }
    })
})

$('#opportunity_id').on('change', function () {
    let obj_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
    if (obj_selected) {
        let customer_list = obj_selected?.['customer']
        loadCustomerList(customer_list ? customer_list : [])
        loadContactList(customer_list?.['contact_mapped'] ? customer_list?.['contact_mapped'] : [])
    }
})

class CallLogHandle {
    static LoadPageActionWithParams(opp_id) {
        let dataParam = {'id': opp_id}
        let opportunity_ajax = $.fn.callAjax2({
            url: table_opportunity_call_log_list.attr('data-url-opp-list'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_list')) {
                    return data?.['opportunity_list'].length > 0 ? data?.['opportunity_list'][0] : null;
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([opportunity_ajax]).then(
            (results) => {
                if (results[0]) {
                    $('#opportunity_id').trigger('change')
                    loadCustomerList(results[0]?.['customer'])
                    loadContactList(results[0]?.['customer']?.['contact_mapped'])
                    $('#offcanvas-call-log').offcanvas('show')
                }
            })
    }
    static load() {
        loadOpportunityCallLogList();
        const {
            create_open, from_opp,
            opp_id,
            opp_title,
            opp_code,
            process_id,
            process_title,
            process_stage_app_id,
            process_stage_app_title,
            inherit_id,
            inherit_title,
        } = $x.fn.getManyUrlParameters([
            'create_open', 'from_opp',
            'opp_id', 'opp_title', 'opp_code',
            'process_id', 'process_title',
            'process_stage_app_id', 'process_stage_app_title',
            'inherit_id', 'inherit_title',
        ])
        const group$ = $('#offcanvas-call-log')
        if (create_open) {
            const data_inherit = [{
                "id": inherit_id || '',
                "full_name": inherit_title || '',
                "selected": true,
            }];
            const data_opp = [{
                "id": opp_id || '',
                "title": opp_title || '',
                "code": opp_code || '',
                "selected": true,
            }];
            const data_process = [{
                "id": process_id || '',
                "title": process_title || '',
                "selected": true,
            }];
            const data_process_stage_app = [{
                "id": process_stage_app_id || '',
                "title": process_stage_app_title || '',
                'selected': true,
            }];
            new $x.cls.bastionField({
                list_from_app: "opportunity.opportunitycall.create",
                app_id: "14dbc606-1453-4023-a2cf-35b1cd9e3efd",
                mainDiv: group$,
                oppEle: group$.find('select[name=opportunity_id]'),
                prjEle: group$.find('select[name=project_id]'),
                empInheritEle: group$.find('select[name=employee_inherit_id]'),
                processEle: group$.find('select[name=process]'),
                processStageAppEle$: group$.find('select[name=process_stage_app]'),
                data_opp: data_opp,
                data_inherit: data_inherit,
                data_process: data_process,
                data_process_stage_app: data_process_stage_app,
            }).init();

            CallLogHandle.LoadPageActionWithParams(opp_id)
        }
        else if (from_opp) {
            const data_opp = [{
                "id": opp_id || '',
                "title": opp_title || '',
                "code": opp_code || '',
                "selected": true,
            }];
            new $x.cls.bastionField({
                list_from_app: "opportunity.opportunitycall.create",
                app_id: "14dbc606-1453-4023-a2cf-35b1cd9e3efd",
                mainDiv: group$,
                oppEle: group$.find('select[name=opportunity_id]'),
                prjEle: group$.find('select[name=project_id]'),
                empInheritEle: group$.find('select[name=employee_inherit_id]'),
                processEle: group$.find('select[name=process]'),
                processStageAppEle$: group$.find('select[name=process_stage_app]'),
                data_opp: data_opp,
            }).init();

            CallLogHandle.LoadPageActionWithParams(opp_id)
        }
        else {
            new $x.cls.bastionField({
                list_from_app: "opportunity.opportunitycall.create",
                app_id: "14dbc606-1453-4023-a2cf-35b1cd9e3efd",
                mainDiv: group$,
                oppEle: group$.find('select[name=opportunity_id]'),
                prjEle: group$.find('select[name=project_id]'),
                empInheritEle: group$.find('select[name=employee_inherit_id]'),
                processEle: group$.find('select[name=process]'),
                processStageAppEle$: group$.find('select[name=process_stage_app]'),
            }).init();
        }
    }
    static combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['subject'] = $('#subject-input').val();
        frm.dataForm['opportunity'] = call_log_Opp_slb.val();
        frm.dataForm['customer'] = customer_slb.val();
        frm.dataForm['contact'] = contact_slb.val();
        frm.dataForm['call_date'] = moment(date_input.val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        frm.dataForm['input_result'] = $('#result-text-area').val();
        if ($('#repeat-activity').is(':checked')) {
            frm.dataForm['repeat'] = 1;
        } else {
            frm.dataForm['repeat'] = 0;
        }

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}