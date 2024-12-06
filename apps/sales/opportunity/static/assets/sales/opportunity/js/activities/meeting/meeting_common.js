const meeting_trans_script = $('#trans-script')
const cancel_activity_btn = $('#cancel-activity')
const table_opportunity_meeting_list = $('#table_opportunity_meeting_list')
const meeting_customer_member_slb = $('#meeting-customer-member-select-box');
const meeting_address_slb = $('#meeting-address-select-box');
const meeting_employee_attended_slb = $('#meeting-employee-attended-select-box');
const meeting_date_input = $('#meeting-date-input');
let MEETING_LIST = []

function loadOpportunityMeetingList() {
    if (!$.fn.DataTable.isDataTable('#table_opportunity_meeting_list')) {
        let dtb = table_opportunity_meeting_list;
        let frm = new SetupFormSubmit(dtb);
        dtb.DataTableDefault({
            rowIdx: true,
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('meeting_list')) {
                        MEETING_LIST = resp.data['meeting_list']
                        return resp.data['meeting_list'] ? resp.data['meeting_list'] : [];
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
                    className: 'wrap-text w-50',
                    render: (data, type, row) => {
                        let status = ''
                        if (row?.['is_cancelled']) {
                            status = `<span class="badge badge-sm badge-soft-danger">${meeting_trans_script.attr('data-trans-activity-cancelled')}</i>`
                        }
                        return `<a class="text-primary fw-bold offcanvas-meeting-button" href="" data-bs-toggle="offcanvas" data-id="${row?.['id']}" data-bs-target="#offcanvas-meeting-detail">
                                    <span class="mr-1">${row?.['subject']}</span>${status}
                                </a>`
                    }
                },
                {
                    data: 'opportunity',
                    className: 'wrap-text text-center w-15',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-blue badge-outline">${row?.['opportunity']?.['code']}</span>`
                    }
                },
                {
                    data: 'employee_inherit',
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${row?.['employee_inherit']?.['full_name']}</span>`
                    }
                },
                {
                    data: 'meeting_date',
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

function loadCustomerMember(contact_list) {
    meeting_customer_member_slb.attr('disabled', false);
    $('#meeting-customer-member-select-box option').remove();
    meeting_customer_member_slb.initSelect2();
    for (let i = 0; i < contact_list.length; i++) {
        meeting_customer_member_slb.append(`<option value="${contact_list[i].id}">${contact_list[i].fullname}</option>`)
    }
}

function loadEmployeeAttended(data) {
    meeting_employee_attended_slb.initSelect2({
        ajax: {
            url: meeting_employee_attended_slb.attr('data-url'),
            method: 'GET',
        },
        data: (data ? data : null),
        templateResult: function (data) {
            if (data.data?.['group']?.['id']) {
                let ele = $(`<div class="row"></div>`);
                ele.append(`<div class="col-8">${data.data?.['full_name']}</div>`);
                ele.append(`<div class="col-4"><span class="badge badge-soft-primary badge-outline">${data.data?.['group']?.['title']}</span></div>`);
                return ele;
            }
            return ''
        },
        keyResp: 'employee_list',
        keyId: 'id',
        keyText: 'full_name',
    })
}

function loadMeetingAddress(shipping_address_list) {
    meeting_address_slb.attr('disabled', false);
    $('#meeting-address-select-box option').remove();
    meeting_address_slb.initSelect2();
    for (let i = 0; i < shipping_address_list.length; i++) {
        if (shipping_address_list[i].is_default) {
            meeting_address_slb.append(`<option selected>${shipping_address_list[i].full_address}</option>`);
        } else {
            meeting_address_slb.append(`<option>${shipping_address_list[i].full_address}</option>`);
        }
    }
}

function convert12hto24h(date){
    function padZero(num) {
      return (num < 10 ? '0' : '') + num;
    }
    // Split the time into hours, minutes, and AM/PM
    let timeArray = date.split(" ");
    let hoursMinutes = timeArray[0].split(":");
    let hours = parseInt(hoursMinutes[0]);
    let minutes = parseInt(hoursMinutes[1]);

    // Convert to 24-hour format
    if (timeArray[1].toLowerCase() === "pm" && hours < 12) hours += 12;
    else if (timeArray[1].toLowerCase() === "am" && hours === 12) hours = 0;
    return padZero(hours) + ":" + padZero(minutes) + ":00";
}

meeting_date_input.daterangepicker({
    singleDatePicker: true,
    timePicker: false,
    showDropdowns: true,
    autoApply: true,
    minYear: parseInt(moment().format('YYYY')),
    locale: {
        format: 'DD/MM/YYYY'
    },
    "cancelClass": "btn-secondary",
    maxYear: parseInt(moment().format('YYYY')) + 100,
}).val('')

$('#opportunity_id').on('change', function () {
    let obj_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
    loadMeetingAddress(obj_selected?.['customer']?.['shipping_address'] ? obj_selected?.['customer']?.['shipping_address'] : [])
    loadCustomerMember(obj_selected?.['customer']?.['contact_mapped'] ? obj_selected?.['customer']?.['contact_mapped'] : [])
})

$(document).on('click', '#table_opportunity_meeting_list .offcanvas-meeting-button', function () {
    let meeting_id = $(this).attr('data-id');
    let meeting_obj = MEETING_LIST.filter(function (item) {
        return item?.['id'] === meeting_id;
    })[0]
    cancel_activity_btn.attr('data-id', meeting_obj.id)

    $('#detail-opp').val(meeting_obj?.['opportunity']?.['code'] + ' - ' + meeting_obj?.['opportunity']?.['title']);
    $('#detail-process').val(meeting_obj?.['process']?.['title'] ? meeting_obj?.['process']?.['title'] : '--');
    $('#detail-stage').val(meeting_obj?.['process_stage_app']?.['title'] ? meeting_obj?.['process_stage_app']?.['title'] : '--');
    $('#detail-inheritor').val(meeting_obj?.['employee_inherit']?.['full_name']);

    $('#detail-subject-input').text(meeting_obj?.['subject']);
    $('#is-cancelled').prop('hidden', !meeting_obj?.['is_cancelled'])
    moment.locale('en')
    $('#detail-date-input').text(moment(meeting_obj.meeting_date.split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'));
    $('#detail-from').text(moment.utc(meeting_obj['meeting_from_time'], 'hh:mm:ss.SSS SSS').format('hh:mm A'));
    $('#detail-to').text(moment.utc(meeting_obj['meeting_to_time'], 'hh:mm:ss.SSS SSS').format('hh:mm A'));
    $('#detail-meeting-address').text(meeting_obj.meeting_address);
    $('#detail-meeting-room').text(meeting_obj.room_location);

    const detail_emp_attended = $('#detail-emp-attended')
    detail_emp_attended.html('')
    for (let i = 0; i < meeting_obj.employee_attended_list.length; i++) {
        let employee_attended_item = meeting_obj.employee_attended_list[i];
        detail_emp_attended.append(`<span class="badge badge-outline badge-soft-success mr-1">${employee_attended_item.fullname}</span>`);
    }
    const detail_customer_mem = $('#detail-customer-member')
    detail_customer_mem.html('')
    for (let i = 0; i < meeting_obj.customer_member_list.length; i++) {
        let customer_member_item = meeting_obj.customer_member_list[i];
        detail_customer_mem.append(`<span class="badge badge-outline badge-soft-orange mr-1">${customer_member_item.fullname}</span>`);
    }
    $('#detail-result').text(meeting_obj.input_result);
    $('#detail-repeat-activity').prop('checked', meeting_obj.repeat);
    cancel_activity_btn.prop('hidden', meeting_obj.is_cancelled)
})

$('#meeting-address-input-btn').on('click', function () {
    $('#meeting-address-select-div').prop('hidden', true);
    $('#meeting-address-input-div').prop('hidden', false);
})

$('#meeting-address-select-btn').on('click', function () {
    $('#meeting-address-select-div').prop('hidden', false);
    $('#meeting-address-input-div').prop('hidden', true);
})

$(document).on('click', '#cancel-activity', function () {
    Swal.fire({
		html:
		`<div class="mb-3"><i class="bi bi-x-square text-danger" style="font-size: 50px"></i></div>
             <h5 class="text-danger">${meeting_trans_script.attr('data-trans-alert-cancel')}</h5>
             <p>${meeting_trans_script.attr('data-trans-alert-warn')}</p>`,
		customClass: {
			confirmButton: 'btn btn-outline-secondary text-danger',
			cancelButton: 'btn btn-outline-secondary text-gray',
			container:'swal2-has-bg',
			actions:'w-100'
		},
		showCancelButton: true,
		buttonsStyling: false,
        confirmButtonText: meeting_trans_script.attr('data-trans-yes'),
        cancelButtonText: meeting_trans_script.attr('data-trans-no'),
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
		    let meeting_id = cancel_activity_btn.attr('data-id')
            let dtb = table_opportunity_meeting_list;
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(dtb.attr('data-url-delete').replace(0, meeting_id), 'PUT', {'is_cancelled': !cancel_activity_btn.prop('disabled')}, csr)
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

class MeetingHandle {
    static load() {
        loadOpportunityMeetingList();
        loadEmployeeAttended();
        const {
            create_open,
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
            'create_open',
            'opp_id', 'opp_title', 'opp_code',
            'process_id', 'process_title',
            'process_stage_app_id', 'process_stage_app_title',
            'inherit_id', 'inherit_title',
        ])
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
                has_opp: true,
                has_inherit: true,
                has_process: true,
                data_opp: data_opp,
                data_inherit: data_inherit,
                data_process: data_process,
                data_process_stage_app: data_process_stage_app,
                oppFlagData: {"disabled": true, "readonly": true},
                processFlagData: {"disabled": true, "readonly": true},
                processStageAppFlagData: {"disabled": true, "readonly": true},
                inheritFlagData: {"disabled": true, "readonly": true},
            }).init();

            let dataParam = {'id': opp_id}
            let opportunity_ajax = $.fn.callAjax2({
                url: table_opportunity_meeting_list.attr('data-url-opp-list'),
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
                    let opportunity_data = results[0];
                    if (opportunity_data) {
                        loadMeetingAddress(opportunity_data?.['customer']?.['shipping_address'] ? opportunity_data?.['customer']?.['shipping_address'] : [])
                        loadCustomerMember(opportunity_data?.['customer']?.['contact_mapped'] ? opportunity_data?.['customer']?.['contact_mapped'] : [])
                        $('#offcanvas-meeting').offcanvas('show')
                    }
                })
        }
        else {
            new $x.cls.bastionField({
                has_opp: true,
                has_inherit: true,
                has_process: true,
                inheritFlagData: {"disabled": false, "readonly": false},
            }).init();
        }
    }

    static combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['subject'] = $('#meeting-subject-input').val();
        frm.dataForm['meeting_date'] = moment(meeting_date_input.val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        if ($('#meeting-address-select-div').is(':hidden')) {
            frm.dataForm['meeting_address'] = $('#meeting-address-input').val();
        } else {
            frm.dataForm['meeting_address'] = $('#meeting-address-select-box option:selected').val();
        }
        frm.dataForm['room_location'] = $('#meeting-room-location-input').val();
        frm.dataForm['input_result'] = $('#meeting-result-text-area').val();

        frm.dataForm['repeat'] = $('#repeat-activity').is(':checked') ? 1 : 0;

        let employee_attended_list = [];
        $('#meeting-employee-attended-select-box option:selected').each(function () {
            employee_attended_list.push(
                {
                    'id': $(this).attr('value'),
                    'code': $(this).attr('data-code'),
                    'fullname': $(this).text()
                }
            )
        })

        let customer_member_list = [];
        $('#meeting-customer-member-select-box option:selected').each(function () {
            customer_member_list.push(
                {
                    'id': $(this).attr('value'),
                    'fullname': $(this).text()
                }
            )
        })

        frm.dataForm['employee_attended_list'] = employee_attended_list;
        frm.dataForm['customer_member_list'] = customer_member_list;
        frm.dataForm['meeting_from_time'] = convert12hto24h(frm.dataForm['meeting_from_time']);
        frm.dataForm['meeting_to_time'] = convert12hto24h(frm.dataForm['meeting_to_time']);
        if (frm.dataForm['meeting_to_time'].split(':')[0] < frm.dataForm['meeting_from_time'].split(':')[0]){
            $.fn.notifyB({'description': $('#trans-factory').attr('data-time-valid')}, 'failure')
            return false
        }

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}