const modalStartTimeEle = $('#modal-start-time')
const modalStartDateEle = $('#modal-start-date')
const endDateBySelectEle = $('#end-date-by-select')
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
let zoomConfigEle = $('#zoom_config')
const zoom_config = zoomConfigEle.text() ? JSON.parse(zoomConfigEle.text()) : {};

modalStartTimeEle.daterangepicker({
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

modalStartDateEle.daterangepicker({
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
})

modalRecurrenceEle.on('change', function () {
    if ($(this).val() === '0') {
        $('#modal-repeat-every-day-div').prop('hidden', false)
        $('#modal-repeat-every-week-div').prop('hidden', true)
        $('#modal-repeat-every-month-div').prop('hidden', true)
    }
    else if ($(this).val() === '1') {
        $('#modal-repeat-every-day-div').prop('hidden', true)
        $('#modal-repeat-every-week-div').prop('hidden', false)
        $('#modal-repeat-every-month-div').prop('hidden', true)
        $('#modal-repeat-every-week-option-div').prop('hidden', false)
        $('#modal-repeat-every-month-option-div').prop('hidden', true)
    }
    else if ($(this).val() === '2') {
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
    $('#enable-continuous-meeting-chat-row').prop('hidden', $('#meeting-id-personal').prop('checked'))
})

function loadInternalParticipants(data) {
    internalParticipantsEle.initSelect2({
        ajax: {
            url: internalParticipantsEle.attr('data-url'),
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

function loadExternalParticipants(data) {
    externalParticipantsEle.initSelect2({
        ajax: {
            url: externalParticipantsEle.attr('data-url'),
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

btn_add_app_meeting_schedule.on('click', function () {
    let meeting_password_autogen = generateRandomString()
    $('#meeting-passcode-input').val(meeting_password_autogen)
    $('#pmi').text(zoom_config?.['personal_meeting_id'])
})

save_meeting_payload.on('click', function () {
    let data_meeting_payload = {}
    data_meeting_payload['topic'] = $('#modal-meeting-title').val()
    data_meeting_payload['start_time'] = modalStartDateEle.val() + 'T' + modalStartTimeEle.val()
    data_meeting_payload['duration'] = parseInt($('#modal-duration-hour').val()) * 60 + parseInt($('#modal-duration-min').val());
    data_meeting_payload['password'] = $('#meeting-passcode-input').val()
    data_meeting_payload['timezone'] = $('#modal-time-zone').val()
    data_meeting_payload['use_pmi'] = $('#meeting-id-personal').prop('checked')
    data_meeting_payload['continuous_meeting_chat'] = {}
    if (data_meeting_payload['use_pmi']) {
        data_meeting_payload['continuous_meeting_chat']['enable'] = $('#modal-enable-continuous-meeting-chat').prop('checked')
    }
    data_meeting_payload['waiting_room'] = $('#meeting-waiting-room').prop('checked')
    $('#data_meeting_payload').text(JSON.stringify(data_meeting_payload))
})

class MeetingScheduleHandle {
    load() {
        loadMeetingRoom()
        loadInternalParticipants()
        loadExternalParticipants()
        loadModalAttendees()
    }
    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));
        if ($('#online-meeting').prop('checked')) {
            let data_meeting_payload = $('#data_meeting_payload').text()
            if (data_meeting_payload) {
                frm.dataForm['payload'] = data_meeting_payload ? JSON.parse(data_meeting_payload) : {}
                if (frm.dataForm['payload']?.['duration'] <= 0) {
                    $.fn.notifyB({description: 'Meeting duration must be greater than 0 minute.'}, 'warning');
                    return false
                }
                return {
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect,
                };
            }
            else {
                $.fn.notifyB({description: 'You have not set up a online meeting schedule yet.'}, 'failure');
            }
        }
        else {
            $.fn.notifyB({description: 'You have just select offline meeting.'}, 'warning');
        }
    }
}