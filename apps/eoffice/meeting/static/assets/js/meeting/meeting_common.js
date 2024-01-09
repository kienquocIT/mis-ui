const startTimeEle = $('#start-time')
const startDateEle = $('#start-date')
const externalParticipantsAccountEle = $('#external-participants-account')
const endDateBySelectEle = $('#end-date-by-select')
const endDateAfterSelectEle = $('#end-date-after-select')
const modalMeetingSelectAppEle = $('#modal-select-app')
const modalMeetingTitleEle = $('#modal-meeting-title')
const modalRecurringMeetingEle = $('#modal-recurring-meeting')
const modalRecurrenceEle = $('#modal-recurrence')
const modalAttendeesEle = $('#modal-attendees')
const meetingTypeEle = $('input[name="meeting-type"]')
const meetingIDEle = $('input[name="meeting-id"]')
const internalParticipantsEle = $('#internal-participants')
const externalParticipantsEle = $('#external-participants')
const btn_add_app_meeting_schedule = $('#btn-add-app-meeting-schedule')
const roomEle = $('#room')
const save_meeting_payload = $('#btn-save-meeting-info-payload')
const translateScriptEle = $('#translate-script')
const zoomConfigEle = $('#zoom_config')
const zoom_config = zoomConfigEle.text() ? JSON.parse(zoomConfigEle.text()) : {};
const currentEmployeeEle = $('#employee_current')
const current_employee = currentEmployeeEle.text() ? JSON.parse(currentEmployeeEle.text()) : {};
const currentCompanyEle = $('#company_current')
const current_company = currentCompanyEle.text() ? JSON.parse(currentCompanyEle.text()) : {};

startTimeEle.daterangepicker({
    timePicker: true,
    singleDatePicker: true,
    timePicker24Hour: false,
    timePickerIncrement: 1,
    timePickerSeconds: true,
    locale: {
        format: 'HH:mm:ss'
    }
}).val('').on('show.daterangepicker', function (ev, picker) {
    picker.container.find(".calendar-table").hide();
})

startDateEle.daterangepicker({
    singleDatePicker: true,
    timePicker: false,
    showDropdowns: true,
    minYear: parseInt(moment().format('YYYY')),
    minDate: new Date(parseInt(moment().format('YYYY')), parseInt(moment().format('MM'))-1, parseInt(moment().format('DD'))),
    locale: {
        format: 'YYYY-MM-DD'
    },
    cancelClass: "btn-secondary",
    maxYear: parseInt(moment().format('YYYY')) + 100,
}).val('')

endDateBySelectEle.daterangepicker({
    singleDatePicker: true,
    timePicker: false,
    showDropdowns: true,
    minYear: parseInt(moment().format('YYYY')),
    minDate: new Date(parseInt(moment().format('YYYY')), parseInt(moment().format('MM'))-1, parseInt(moment().format('DD'))),
    locale: {
        format: 'YYYY-MM-DD'
    },
    cancelClass: "btn-secondary",
    maxYear: parseInt(moment().format('YYYY')) + 100,
}).val('')

modalRecurringMeetingEle.on('change', function () {
    $('.row-for-recurring').prop('hidden', !$(this).prop('checked'))
    $('#meeting-id-personal').closest('.form-group').closest('.row').prop('hidden', $(this).prop('checked'))
})

modalRecurrenceEle.on('change', function () {
    if ($(this).val() === '1') {
        $('#modal-repeat-every-day-div').prop('hidden', false)
        $('#modal-repeat-every-week-div').prop('hidden', true)
        $('#modal-repeat-every-month-div').prop('hidden', true)
        $('#modal-repeat-every-week-option-div').prop('hidden', true)
        $('#modal-repeat-every-month-option-div').prop('hidden', true)
    }
    else if ($(this).val() === '2') {
        $('#modal-repeat-every-day-div').prop('hidden', true)
        $('#modal-repeat-every-week-div').prop('hidden', false)
        $('#modal-repeat-every-month-div').prop('hidden', true)
        $('#modal-repeat-every-week-option-div').prop('hidden', false)
        $('#modal-repeat-every-month-option-div').prop('hidden', true)
    }
    else if ($(this).val() === '3') {
        $('#modal-repeat-every-day-div').prop('hidden', true)
        $('#modal-repeat-every-week-div').prop('hidden', true)
        $('#modal-repeat-every-month-div').prop('hidden', false)
        $('#modal-repeat-every-week-option-div').prop('hidden', true)
        $('#modal-repeat-every-month-option-div').prop('hidden', false)
    }
})

meetingTypeEle.on('change', function () {
    $('.row-for-offline-meeting').prop('hidden', !parseInt($(this).val()))
    $('#tab_app_meeting .row-1').prop('hidden', parseInt($(this).val()))
    $('#tab_app_meeting .row-2').prop('hidden', !parseInt($(this).val()))
})

meetingIDEle.on('change', function () {
    let bool = $('#meeting-id-personal').prop('checked')
    $('#enable-continuous-meeting-chat-row .form-switch').prop('hidden', bool)
    $('#modal-enable-continuous-meeting-chat').prop('checked', !bool).prop('disabled', bool)
    modalRecurringMeetingEle.prop('checked', !bool)
    modalRecurringMeetingEle.closest('.row').prop('hidden', bool)
})

function loadInternalParticipants(data) {
    internalParticipantsEle.initSelect2({
        data: (data ? data : null),
        keyId: 'id',
        keyText: 'full_name',
    })
}

function loadInternalParticipantsTable(selected_data=[]) {
    let dtb = $('#internal-employees-table');
    dtb.DataTable().clear().destroy()
    let frm = new SetupFormSubmit(dtb);
    dtb.DataTableDefault({
        useDataServer: true,
        rowIdx: true,
        paging: false,
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    return resp.data['employee_list'] ? resp.data['employee_list'] : [];
                }
                return [];
            },
        },
        columns: [
            {
                className: 'wrap-text',
                render: () => {
                    return ``;
                }
            },
            {
                data: 'full_name',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span data-id="${row.id}" data-fullname="${row?.['full_name']}" class="text-primary emp-info">${row?.['full_name']}</span>`;
                }
            },
            {
                data: 'group',
                className: 'wrap-text',
                render: (data, type, row) => {
                    if (row?.['group']?.['title']) {
                        return `<span class="text-secondary">${row?.['group']?.['title']}</span>`;
                    }
                    return ``;
                }
            },
            {
                className: 'wrap-text',
                render: (data, type, row) => {
                    let checked = ''
                    if (selected_data.includes(row.id)) {
                        checked = 'checked'
                    }
                    return `<div class="form-check form-check-lg">
                                <input ${checked} type="checkbox" class="form-check-input checkbox_internal_employees">
                            </div>`
                }
            },
        ],
    });
}

$('#btn_load_internal_participants_table').on('click', function () {
    loadInternalParticipantsTable(internalParticipantsEle.val())
})

$('#select-internal-employees-btn').on('click', function () {
    let internal_employee_list = []
    $('#internal-employees-table tr').each(function () {
        if ($(this).find('.checkbox_internal_employees').prop('checked')) {
            let emp_info = $(this).find('.emp-info')
            internal_employee_list.push({
                'id': emp_info.attr('data-id'),
                'full_name': emp_info.attr('data-fullname'),
            })
        }
    })
    loadInternalParticipants(internal_employee_list)
})

function loadExternalAccountParticipants(data) {
    externalParticipantsAccountEle.initSelect2({
        ajax: {
            url: externalParticipantsAccountEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'account_list',
        keyId: 'id',
        keyText: 'name',
    }).on('change', function () {
        let account_selected = SelectDDControl.get_data_from_idx(externalParticipantsAccountEle, externalParticipantsAccountEle.val())
        if (account_selected) {
            loadExternalParticipantsTable(null, account_selected)
        }
    })
}

function loadExternalParticipants(data) {
    externalParticipantsEle.initSelect2({
        data: (data ? data : null),
        keyId: 'id',
        keyText: 'full_name',
    })
}

function loadExternalParticipantsTable(data, account=null, selected_data=[]) {
    let account_manager_id = []
    if (account) {
        for (let i = 0; i < account?.['manager'].length; i++) {
            account_manager_id.push(account?.['manager'][i]?.['id'])
        }
    }
    let dtb = $('#external-employees-table');
    dtb.DataTable().clear().destroy()
    let frm = new SetupFormSubmit(dtb);
    dtb.DataTableDefault({
        useDataServer: true,
        rowIdx: true,
        paging: false,
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let res = []
                    for (let i = 0; i < resp.data['employee_list'].length; i++) {
                        let item = resp.data['employee_list'][i]
                        if (account_manager_id.includes(item.id)) {
                            res.push(item)
                        }
                    }
                    return res
                }
                return [];
            },
        },
        columns: [
            {
                className: 'wrap-text',
                render: () => {
                    return ``;
                }
            },
            {
                data: 'full_name',
                className: 'wrap-text',
                render: (data, type, row) => {
                    return `<span data-id="${row.id}" data-fullname="${row?.['full_name']}" class="text-primary emp-info">${row?.['full_name']}</span>`;
                }
            },
            {
                data: 'group',
                className: 'wrap-text',
                render: (data, type, row) => {
                    if (row?.['group']?.['title']) {
                        return `<span class="text-secondary">${row?.['group']?.['title']}</span>`;
                    }
                    return ``;
                }
            },
            {
                className: 'wrap-text',
                render: (data, type, row) => {
                    let checked = ''
                    if (selected_data.includes(row.id)) {
                        checked = 'checked'
                    }
                    return `<div class="form-check form-check-lg">
                                <input ${checked} type="checkbox" class="form-check-input checkbox_external_employees">
                            </div>`
                }
            },
        ],
    });
}

$('#btn_load_external_participants_table').on('click', function () {
    if ($('#selected-account-script').text()) {
        loadExternalAccountParticipants(JSON.parse($('#selected-account-script').text()))
        loadExternalParticipantsTable(null, JSON.parse($('#selected-account-script').text()), externalParticipantsEle.val())
    }
    else {
        loadExternalAccountParticipants()
        loadExternalParticipantsTable(null, null, externalParticipantsEle.val())
    }
})

$('#select-external-employees-btn').on('click', function () {
    let external_employee_list = []
    $('#external-employees-table tr').each(function () {
        if ($(this).find('.checkbox_external_employees').prop('checked')) {
            let emp_info = $(this).find('.emp-info')
            external_employee_list.push({
                'id': emp_info.attr('data-id'),
                'full_name': emp_info.attr('data-fullname'),
            })
        }
    })
    let account_selected = SelectDDControl.get_data_from_idx(externalParticipantsAccountEle, externalParticipantsAccountEle.val())
    if (account_selected) {
        $('#selected-account-script').text(JSON.stringify(account_selected))
    }
    loadExternalParticipants(external_employee_list)
})

function loadModalAttendees(data) {
    modalAttendeesEle.initSelect2({
        ajax: {
            url: modalAttendeesEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        templateResult: function(data) {
            let ele = $('<div class="row col-12"></div>');
            ele.append('<div class="col-8">' + data.data?.['full_name'] + '</div>');
            if (data.data?.['group']?.['title'] !== undefined) {
                ele.append('<div class="col-4">(' + data.data?.['group']['title'] + ')</div>');
            }
            return ele;
        },
        data: (data ? data : null),
        keyResp: 'employee_list',
        keyId: 'id',
        keyText: 'full_name',
    }).on('change', function () {})
}

function loadMeetingRoom(data) {
    roomEle.initSelect2({
        allowClear: true,
        ajax: {
            url: roomEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'meeting_room_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        let obj_selected = SelectDDControl.get_data_from_idx(roomEle, roomEle.val())
        $('#room-des').val(obj_selected?.['description'])
    })
}

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}

modalMeetingSelectAppEle.on('change', function () {
    let meeting_type = modalMeetingSelectAppEle.find(`option[value="${modalMeetingSelectAppEle.val()}"]`).text()
    modalMeetingTitleEle.val(`${current_employee?.['full_name']}'s ${meeting_type} meeting from ${current_company?.['title']}`)
})

btn_add_app_meeting_schedule.on('click', function () {
    let meeting_type = modalMeetingSelectAppEle.find(`option[value="${modalMeetingSelectAppEle.val()}"]`).text()
    modalMeetingTitleEle.val(`${current_employee?.['full_name']}'s ${meeting_type} meeting from ${current_company?.['title']}`)
    let meeting_password_autogen = generateRandomString()
    $('#meeting-passcode-input').val(meeting_password_autogen)
    $('#pmi').text(zoom_config?.['personal_meeting_id'])

    let attendees = []
    for (let i = 0; i < internalParticipantsEle.val().length; i++) {
        attendees.push(
            JSON.parse($('#' + internalParticipantsEle.attr('data-idx-data-loaded')).text())[internalParticipantsEle.val()[i]]
        )
    }
    for (let i = 0; i < externalParticipantsEle.val().length; i++) {
        attendees.push(
            JSON.parse($('#' + externalParticipantsEle.attr('data-idx-data-loaded')).text())[externalParticipantsEle.val()[i]]
        )
    }
    loadModalAttendees(attendees)
})

save_meeting_payload.on('click', function () {
    let flag = true;
    let data_meeting_payload = {}
    if (modalRecurringMeetingEle.prop('checked')) {
        data_meeting_payload['type'] = 8
        data_meeting_payload['recurrence'] = {}
        if ($('#end-date-by-input').prop('checked')) {
            data_meeting_payload['recurrence']['end_date_time'] = endDateBySelectEle.val() + 'T' + '00:00:00'
        }
        else {
            if (parseInt(endDateAfterSelectEle.val()) > 20 || parseInt(endDateAfterSelectEle.val()) < 1) {
                $.fn.notifyB({description: 'End times must be smaller than 20 and greater than 1.'}, 'warning');
                flag = false;
            }
            else {
                data_meeting_payload['recurrence']['end_times'] = parseInt(endDateAfterSelectEle.val())
            }
        }
        data_meeting_payload['recurrence']['type'] = parseInt(modalRecurrenceEle.val())
        if (data_meeting_payload['recurrence']['type'] === 1) {
            data_meeting_payload['recurrence']['repeat_interval'] = parseInt($('#modal-repeat-every-day').val())
        }
        else if (data_meeting_payload['recurrence']['type'] === 2) {
            data_meeting_payload['recurrence']['repeat_interval'] = parseInt($('#modal-repeat-every-week').val())
            let weekly_days_param = []
            if ($('#sun').prop('checked')) {
                weekly_days_param.push(1)
            }
            if ($('#mon').prop('checked')) {
                weekly_days_param.push(2)
            }
            if ($('#tue').prop('checked')) {
                weekly_days_param.push(3)
            }
            if ($('#wed').prop('checked')) {
                weekly_days_param.push(4)
            }
            if ($('#thu').prop('checked')) {
                weekly_days_param.push(5)
            }
            if ($('#fri').prop('checked')) {
                weekly_days_param.push(6)
            }
            if ($('#sat').prop('checked')) {
                weekly_days_param.push(7)
            }
            if (weekly_days_param.length > 0) {
                data_meeting_payload['recurrence']['weekly_days'] = weekly_days_param.join(',')
            }
            else {
                $.fn.notifyB({description: 'Weekly days list must not empty'}, 'warning');
                flag = false;
            }
        }
        else if (data_meeting_payload['recurrence']['type'] === 3) {
            data_meeting_payload['recurrence']['repeat_interval'] = parseInt($('#modal-repeat-every-month').val())
            if ($('#modal-day-x-of-month-input').prop('checked')) {
                data_meeting_payload['recurrence']['monthly_day'] = parseInt($('#modal-day-x-of-month-select').val())
            }
            else {
                data_meeting_payload['recurrence']['monthly_week'] = parseInt($('#modal-date-x-of-the-month-select-1').val())
                data_meeting_payload['recurrence']['monthly_week_day'] = parseInt($('#modal-date-x-of-the-month-select-2').val())
            }
        }
    }
    else {
        data_meeting_payload['type'] = 2
    }

    data_meeting_payload['topic'] = modalMeetingTitleEle.val()
    data_meeting_payload['start_time'] = startDateEle.val() + 'T' + startTimeEle.val()
    data_meeting_payload['duration'] = parseInt($('#duration-hour').val()) * 60 + parseInt($('#duration-min').val());
    data_meeting_payload['password'] = $('#meeting-passcode-input').val()
    data_meeting_payload['timezone'] = $('#modal-time-zone').val()
    data_meeting_payload['settings'] = {
        'host_video': true,
        'participant_video': true,
        'join_before_host': true,
        'mute_upon_entry': true,
        'recording': {
            'recording_enable': true,
            'recording_type': "local",
            'recording_settings': {
                'allow_local_recording': true,
                'allow_cloud_recording': true
            }
        },
        'use_pmi': $('#meeting-id-personal').prop('checked'),
        'continuous_meeting_chat': {
            'enable': true
        },
        'waiting_room': $('#meeting-waiting-room').prop('checked')
    }
    if (data_meeting_payload['settings']['use_pmi']) {
        if (data_meeting_payload['settings'].hasOwnProperty('continuous_meeting_chat')) {
            delete data_meeting_payload['settings']['continuous_meeting_chat'];
        }
    }

    if (data_meeting_payload['topic'] === '') {
        $.fn.notifyB({description: 'Meeting topic is required.'}, 'warning');
        flag = false;
    }
    if (data_meeting_payload['duration'] <= 0) {
        $.fn.notifyB({description: 'Meeting duration must be greater than 0 minute.'}, 'warning');
        flag = false;
    }
    if (startDateEle.val() === '') {
        $.fn.notifyB({description: 'Meeting start date is required.'}, 'warning');
        flag = false;
    }
    if (startTimeEle.val() === '') {
        $.fn.notifyB({description: 'Meeting start time is required.'}, 'warning');
        flag = false;
    }

    let attendee_list = {'attendee_list': modalAttendeesEle.val()}

    if (flag) {
        $('#modal_add_meeting_app_schedule').modal('hide')

        $('#meeting-card-div').html(`<div class="col-12 col-lg-4 col-md-4">
            <div class="card meeting-card">
                <script id="meeting-attendee-list-script">${JSON.stringify(attendee_list)}</script>
                <script id="meeting-payload-script">${JSON.stringify(data_meeting_payload)}</script>
                <div class="card-header">
                    <span class="meeting-schedule-title badge badge-blue"><b><i class="fas fa-video"></i>&nbsp;Zoom Meeting</b></span>
                    <button type="button" class="card-close btn-close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="card-body">
                    <h4 class="mb-3"><b>${data_meeting_payload['topic']}</b></h4>
                    <p class="card-text"><i class="fas fa-calendar"></i>&nbsp;${translateScriptEle.attr('data-start-time')}: ${startTimeEle.val()} ${startDateEle.val()}</p>
                    <p class="card-text"><i class="fas fa-clock"></i>&nbsp;${translateScriptEle.attr('data-duration')}: ${data_meeting_payload['duration']} ${translateScriptEle.attr('data-minute')}</p>
                </div>
            </div>
        </div>`)
    }
})

function formatDateTime(inputDateTimeString) {
    const inputDate = new Date(inputDateTimeString);

    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
        timeZone: 'Asia/Saigon',
    };

    return inputDate.toLocaleString('en-US', options);
}

function isToday(targetDateTimeString) {
    const targetDateTime = new Date(targetDateTimeString);
    const today = new Date();
    let tg_year = targetDateTime.getFullYear()
    let tg_month = ("0" + (targetDateTime.getMonth() + 1)).slice(-2)
    let tg_day = ("0" + targetDateTime.getDate()).slice(-2)
    let td_year = today.getFullYear()
    let td_month = ("0" + (today.getMonth() + 1)).slice(-2)
    let td_day = ("0" + today.getDate()).slice(-2)
    const targetDateTime_int = tg_year + tg_month + tg_day
    const todayDateTime_int = td_year + td_month + td_day

    if (targetDateTime_int === todayDateTime_int) {
        return `<span class="meeting-status text-secondary" data-value="0"><span class="badge badge-success badge-indicator"></span>&nbsp;${translateScriptEle.attr('data-today')}</span>`
    }
    else if (targetDateTime_int <= todayDateTime_int) {
        return `<span class="meeting-status text-secondary" data-value="1"><span class="badge badge-secondary badge-indicator"></span>&nbsp;${translateScriptEle.attr('data-occurred')}</span>`
    }
    else {
        return `<span class="meeting-status text-secondary" data-value="2"><span class="badge badge-warning badge-indicator"></span>&nbsp;${translateScriptEle.attr('data-upcoming')}</span>`
    }
}

class MeetingScheduleHandle {
    load() {
        loadMeetingRoom()
    }
    combinesData(frmEle) {
        let meeting_name = $('#name').val()
        let meeting_content = $('#content').val()
        let meeting_type = $('#offline-meeting').prop('checked')
        let meeting_room = roomEle.val()
        let meeting_start_date = startDateEle.val()
        let meeting_start_time = startTimeEle.val()
        let meeting_duration = parseInt($('#duration-hour').val()) * 60 + parseInt($('#duration-min').val());

        let frm = new SetupFormSubmit($(frmEle));
        frm.dataForm['title'] = meeting_name
        frm.dataForm['meeting_content'] = meeting_content
        frm.dataForm['meeting_type'] = meeting_type
        frm.dataForm['meeting_room_mapped'] = meeting_room
        frm.dataForm['meeting_start_date'] = meeting_start_date
        frm.dataForm['meeting_start_time'] = meeting_start_time
        frm.dataForm['meeting_duration'] = meeting_duration
        frm.dataForm['account_external'] = externalParticipantsAccountEle.val()
        frm.dataForm['participants'] = []
        for (let i = 0; i < internalParticipantsEle.val().length; i++) {
            frm.dataForm['participants'].push({
                'participant_id': internalParticipantsEle.val()[i],
                'is_external': false
            })
        }
        for (let i = 0; i < externalParticipantsEle.val().length; i++) {
            frm.dataForm['participants'].push({
                'participant_id': externalParticipantsEle.val()[i],
                'is_external': true
            })
        }
        if (frm.dataForm['participants'].length <= 0) {
            $.fn.notifyB({description: 'Participants have not selected yet.'}, 'failure');
            return false
        }

        if ($('#online-meeting').prop('checked')) {
            let data_online_meeting_payload = $('#meeting-payload-script').text()
            let data_attendee_list = $('#meeting-attendee-list-script').text()
            if (data_attendee_list) {
                frm.dataForm['attendee_list'] = data_attendee_list ? JSON.parse(data_attendee_list) : {}
            }
            if (data_online_meeting_payload) {
                frm.dataForm['payload'] = data_online_meeting_payload ? JSON.parse(data_online_meeting_payload) : {}
                if (frm.dataForm['payload']?.['duration'] <= 0) {
                    $.fn.notifyB({description: 'Meeting duration must be greater than 0 minute.'}, 'failure');
                    return false
                }
                let data_online_meeting_payload_JSON = JSON.parse(data_online_meeting_payload)
                frm.dataForm['online_meeting_data'] = {
                    'meeting_app': 0,
                    'meeting_topic': data_online_meeting_payload_JSON?.['topic'],
                    'meeting_recurring': false,
                    'meeting_recurring_data': [],
                    'meeting_timezone_text': data_online_meeting_payload_JSON?.['timezone'],
                    'meeting_enable_continuous_meeting_chat': data_online_meeting_payload_JSON?.['continuous_meeting_chat']?.['enable'],
                    'meeting_ID_type': data_online_meeting_payload_JSON?.['use_pmi'],
                    'meeting_waiting_room': data_online_meeting_payload_JSON?.['waiting_room'],
                    'meeting_create_payload': data_online_meeting_payload_JSON
                }
            }
            else {
                $.fn.notifyB({description: 'You have not set up a online meeting schedule yet.'}, 'warning');
                return false
            }
        }
        console.log(frm.dataForm)
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}

function LoadDetailMeetingSchedule() {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-meeting').attr('data-url-detail').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['meeting_schedule_detail'];
                console.log(data)
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);

                $('#name').val(data?.['title'])
                $('#content').val(data?.['meeting_content'])
                startDateEle.val(data?.['meeting_start_date'])
                startTimeEle.val(data?.['meeting_start_time'])
                $('#duration-hour').val(parseInt(data?.['meeting_duration']/60))
                $('#duration-min').val(parseInt(data?.['meeting_duration']%60))
                loadInternalParticipants(data?.['participants'].filter(item => item?.['is_external'] === false))
                loadExternalAccountParticipants(data?.['account_external'])

                loadExternalParticipants(data?.['participants'].filter(item => item?.['is_external'] === true))
                $('#offline-meeting').prop('checked', data?.['meeting_type'])
                $('.row-for-offline-meeting').prop('hidden', !data?.['meeting_type'])
                $('#tab_app_meeting .row-1').prop('hidden', data?.['meeting_type'])
                $('#tab_app_meeting .row-2').prop('hidden', !data?.['meeting_type'])
                loadMeetingRoom(data?.['meeting_room_mapped'])
                $('#room-des').val(data?.['meeting_room_mapped']?.['description'])
                if (data?.['online_meeting_data'].length > 0) {
                    let online_meeting_data = data?.['online_meeting_data'][0]
                    let formatted_start_time = formatDateTime(online_meeting_data?.['meeting_create_payload']?.['start_time'])
                    $('#meeting-card-div').html(`
                        <div class="col-12 col-lg-6 col-md-6">
                            <div class="card meeting-card card-selected">
                                <script id="meeting-payload-script"></script>
                                <div class="card-header">
                                    <span class="meeting-schedule-title badge badge-blue"><b><i class="fas fa-video"></i>&nbsp;Zoom Meeting</b></span>
                                    ${isToday(online_meeting_data?.['meeting_create_payload']?.['start_time'])}
                                </div>
                                <div class="card-body">
                                    <h4 class="mb-3"><b>${online_meeting_data['meeting_topic']}</b></h4>
                                    <p class="card-text"><i class="fas fa-calendar"></i>&nbsp;${translateScriptEle.attr('data-start-time')}: ${formatted_start_time}</p>
                                    <p class="card-text"><i class="fas fa-clock"></i>&nbsp;${translateScriptEle.attr('data-duration')}: ${data?.['meeting_duration']} ${translateScriptEle.attr('data-minute')}</p>
                                    <hr class="bg-teal">
                                    <p class="card-text"><i class="bi bi-camera-video"></i>&nbsp;<u>${translateScriptEle.attr('data-meeting-id')}:</u> <span class="text-primary"><b>${online_meeting_data?.['meeting_ID']}</b></span></p>
                                    <p class="card-text"><i class="bi bi-link-45deg"></i>&nbsp;<u>${translateScriptEle.attr('data-meeting-url')}:</u> <span><a class="bg-dark-hover" target="_blank" href="${online_meeting_data?.['meeting_link']}">${online_meeting_data?.['meeting_link']}</a></span></p>
                                    <p class="card-text"><i class="bi bi-qr-code-scan"></i>&nbsp;<u>${translateScriptEle.attr('data-meeting-passcode')}:</u> <span class="text-muted">${online_meeting_data?.['meeting_passcode']}</span></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6 col-md-6">
                            <div class="row">
                                <div class="col-12">
                                    <button data-bs-toggle="tooltip" data-bs-placement="top" title="${translateScriptEle.attr('data-see-invitation')}" class="btn btn-icon btn-flush-secondary flush-soft-hover">
                                        <span class="icon" data-bs-toggle="collapse" href="#see-meeting-invitation" role="button" aria-expanded="false" aria-controls="see-meeting-invitation"><i class="far fa-eye"></i></span>
                                    </button>
                                    <div class="collapse multi-collapse" id="see-meeting-invitation">
                                        <div class="card card-body">
                                            <p class="card-text">${current_employee.full_name} from ${current_company?.['title']} has invited you to a scheduled Zoom meeting.</p>
                                            <p class="card-text">
                                                Topic: ${online_meeting_data['meeting_topic']}
                                                <br>
                                                Time: ${formatted_start_time}
                                            </p>
                                            <p class="card-text">
                                                Join Zoom Meeting
                                                <br>
                                                ${online_meeting_data?.['meeting_link']}
                                            </p>
                                            <p class="card-text">
                                                Meeting ID: ${online_meeting_data?.['meeting_ID']}
                                                <br>
                                                Passcode: ${online_meeting_data?.['meeting_passcode']}
                                            </p>
                                            <div>
                                                <button data-clipboard-text="${current_employee.full_name} from ${current_company?.['title']} has invited you to a scheduled Zoom meeting.
    
    Topic: ${online_meeting_data['meeting_topic']}
    Time: ${formatted_start_time}
    
    Join Zoom Meeting
    ${online_meeting_data?.['meeting_link']}
    
    Meeting ID: ${online_meeting_data?.['meeting_ID']}
    Passcode: ${online_meeting_data?.['meeting_passcode']}" id="btn-copy-invitation" class="btn btn-xs btn-outline-secondary mb-2"><span><span class="icon"><span class="feather-icon"><i class="far fa-copy"></i></span></span><span>${translateScriptEle.attr('data-copy-invitation')}</span></span>
                                                </button>
                                            </div>
                                        </div>      
                                    </div>
                                </div>
                            </div>
                        </div>
                    `)
                    $('#meeting-payload-script').text(JSON.stringify(online_meeting_data))
                }
                if ($('.meeting-status').attr('data-value') !== '2') {
                    $('#btn-edit-meeting').remove()
                    $('#btn-delete-meeting').remove()
                }

                new $x.cls.file($('#attachment')).init({
                    enable_edit: false,
                    data: data.attachment,
                })

                $('input').attr('disabled', true).attr('readonly', true)
                $('select').attr('disabled', true).attr('readonly', true)
                $('textarea').attr('disabled', true).attr('readonly', true)
                $('#btn-edit-meeting').attr('disabled', true).attr('readonly', true)
                $('#btn-delete-meeting').attr('disabled', true).attr('readonly', true)
                $('#btn_load_internal_participants_table').attr('disabled', true).attr('readonly', true)
                $('#btn_load_external_participants_table').attr('disabled', true).attr('readonly', true)
            }
        })
}

let clipboard = new ClipboardJS('#btn-copy-invitation');

clipboard.on('success', function(e) {
    $.fn.notifyB({description: 'Copied invitation.'}, 'info');
    e.clearSelection();
}).on('error', function(e) {
    $.fn.notifyB({description: 'Can not copy invitation.'}, 'failure');
});
