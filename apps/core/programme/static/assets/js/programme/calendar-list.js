// calendar type No.
// 1: Meeting
// 2: Business
// 3: Leave
class programmeHandle {
    static UpData = {};

    static renderUpEvt() {
        $(document).on('Upcoming-Event:Trigger', function () {
            let data = programmeHandle.UpData
            let list = {
                1: {'txt': 'warning', 'field': 'meeting_date', 'format': 'DD/MM/YYYY'},
                2: {'txt': 'violet', 'field': 'date_f', 'format': 'DD/MM/YYYY'},
                3: {'txt': 'primary', 'field': 'date_from', 'format': 'DD/MM/YYYY'}
            }
            let itemList = ''
            for (let item in data) {
                item = data[item]
                let html = $($('.html-evt').html())
                html.find('.badge').addClass('badge-' + list[item?.source.calendar_type]['txt'])
                let time = item?.source['date_from']
                if (item?.source.calendar_type === 1)
                    time = moment(item?.source['meeting_date']).set({
                        'hour': item?.source['meeting_from_time'].split(':')[0],
                        'minute': item?.source['meeting_from_time'].split(':')[1],
                        'second': item?.source['meeting_from_time'].split(':')[2][2],
                    })
                else if (item?.source.calendar_type === 2)
                    time = item['start']
                html.find('.event-time').html($x.fn.displayRelativeTime(time, {'outputFormat': 'DD/MM/YYYY hh:mm:ss'}))
                html.find('.event-name').html(item.title)
                itemList += html.prop('outerHTML')
            }
            if (itemList) $('.upcoming-event-wrap ul').html(itemList)
        })
        $('.tit-upcoming-evt').trigger('Upcoming-Event:Trigger')
    }

    static prepareData(data) {
        let afterPrepare = {
            title: data?.['title'] ? data.title : '',
            date: '',
            time: '',
            location: '--',
            type: '',
            member: '',
            des: data?.['remark'] ? data.remark : ''
        }
        let $trans = $('#trans-factory')
        moment.locale('en')
        if (data.calendar_type === 1) { // this case meeting
            afterPrepare.title = data.subject
            afterPrepare.date = String.format(
                "{0} - {1}",
                moment(data.meeting_date, 'YYYY-MM-DD hh:mm:ss').format('MMM DD,YYYY'),
                moment(data.meeting_date, 'YYYY-MM-DD hh:mm:ss').format('MMM DD,YYYY')
            )
            afterPrepare.time = String.format(
                "{0} - {1}",
                moment(data.meeting_from_time, 'hh:mm:ss.ssssss').format('hh:mm A'),
                moment(data.meeting_to_time, 'hh:mm:ss.ssssss').format('hh:mm A')
            )
            afterPrepare.location = String.format("{0}, {1}", data.room_location, data.meeting_address)
            afterPrepare.type = $trans.attr('data-meet')
            for (let item of data.employee_attended_list) {
                let tempHTML = $($('.temp-chip').html())
                tempHTML.find('.chip-text').text(item.fullname)
                afterPrepare.member += tempHTML.prop('outerHTML')
            }
            afterPrepare.des = data.input_result
        }
        else if (data.calendar_type === 2) { // this case business
            afterPrepare.date = String.format("{0} - {1}", moment(data.date_f, 'YYYY-MM-DD hh:mm:ss').format('MMM DD,YYYY'),
                moment(data.date_t, 'YYYY-MM-DD hh:mm:ss').format('MMM DD,YYYY'))
            afterPrepare.time = String.format("{0} - {1}", moment(data.date_f, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A'),
                moment(data.date_t, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A'))
            afterPrepare.location = data?.destination?.title | '--'
            afterPrepare.type = $trans.attr('data-business')
            for (let item of data.employee_on_trip) {
                let tempHTML = $($('.temp-chip').html())
                tempHTML.find('.chip-text').text(item.fullname)
                afterPrepare.member += tempHTML.prop('outerHTML')
            }
        } else { // this case leave
            afterPrepare.date = String.format("{0} - {1}",
                moment(data.date_from, 'YYYY-MM-DD hh:mm:ss').format('MMM DD,YYYY'),
                moment(data.date_to, 'YYYY-MM-DD hh:mm:ss').format('MMM DD,YYYY')
            )
            afterPrepare.time = String.format("{0} - {1}",
                moment(data.date_from, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A'),
                moment(data.date_to, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A')
            )
            afterPrepare.type = $trans.attr('data-leave')
            let tempHTML = $($('.temp-chip').html())
            tempHTML.find('.chip-text').text(data.employee_inherit.full_name)
            afterPrepare.member += tempHTML.prop('outerHTML')
        }
        return afterPrepare
    }

    static callMeeting(calendar, params = null) {
        $.fn.callAjax2({
            'url': $('#url-factory').attr('data-meet'),
            'method': 'get',
            'data': params ? params : {'meeting_date': moment().format('YYYY-MM-DD'), 'self_employee': true}
        })
            .then(function (req) {
                    let data = $.fn.switcherResp(req)['meeting_list']
                    let nextDay = {}
                    let dataReceived = []
                    for (let item of data) {
                        item.calendar_type = 1
                        let temp = {
                            backgroundColor: '#FFC400',
                            borderColor: '#FFC400',
                            title: item.subject,
                            start: moment(item.meeting_date, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD ') + item.meeting_from_time,
                            end: moment(item.meeting_date, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD ') + item.meeting_to_time,
                            source: item
                        }
                        if (moment(temp.start).isAfter(moment(nextDay?.start))) nextDay = temp
                        let milis = moment(temp.end).diff(moment(temp.start))
                        if (moment.duration(milis).asHours() >= 8) temp.allDay = true
                        if (dataReceived.indexOf(item.id) === -1){
                            calendar.addEvent(temp)
                            dataReceived.push(item.id)
                        }
                    }
                    if (!programmeHandle.UpData?.[1] && Object.keys(nextDay).length > 0) programmeHandle.UpData[1] = nextDay
                    calendar.render()
                    $('.tit-upcoming-evt').trigger('Upcoming-Event:Trigger')
                },
                (errs) => {console.log('calendar-list_123 ', errs)}
            )
    }

    static callBusiness(calendar, params = null) {
        $.fn.callAjax2({
            'url': $('#url-factory').attr('data-business'),
            'method': 'get',
            'data': params ? params : {'business_date': moment().format('YYYY-MM-DD'), 'self_employee': true}
        })
            .then(function (req) {
                    let data = $.fn.switcherResp(req)['business_trip_request']
                    let nextDay = {}
                    let dataReceived = []
                    for (let item of data) {
                        item.calendar_type = 2
                        let temp = {
                            backgroundColor: '#da82f8',
                            borderColor: '#da82f8',
                            title: item.title,
                            start: item.date_f,
                            end: moment(item.date_t).add(1, 'days').format('YYYY-MM-DD'),
                            allDay: true,
                            source: item
                        }
                        if (moment(temp.start).isAfter(moment(nextDay?.start))) nextDay = temp
                        let milis = moment(temp.end).diff(moment(temp.start))
                        if (moment.duration(milis).asHours() >= 8) temp.allDay = true
                        if (dataReceived.indexOf(item.id) === -1){
                            calendar.addEvent(temp)
                            dataReceived.push(item.id)
                        }
                    }
                    if (!programmeHandle.UpData?.[2] && Object.keys(nextDay).length > 0) programmeHandle.UpData[2] = nextDay
                    calendar.render()
                    $('.tit-upcoming-evt').trigger('Upcoming-Event:Trigger')
                },
                (errs) => {console.log('calendar-list_160 ', errs)
                }
            )
    }

    static callLeave(calendar, params = null) {
        $.fn.callAjax2({
            'url': $('#url-factory').attr('data-leave'),
            'method': 'get',
            'data': params ? params : {'leave_date': moment().format('YYYY-MM-DD'), 'self_employee': true}
        })
            .then(function (req) {
                    let data = $.fn.switcherResp(req)['leave_request_calendar']
                    let nextDay = {}
                    for (let item of data) {
                        item.calendar_type = 3
                        let endD = item.date_to
                        if (!item.morning_shift_t) endD = moment(endD).add(1, 'days').format('YYYY-MM-DD')
                        let temp = {
                            title: item.title,
                            start: item.date_from,
                            end: endD,
                            allDay: item.morning_shift_f && !item.morning_shift_t,
                            source: item
                        }
                        if (!nextDay?.start && moment(temp.start).isAfter(moment())) nextDay = temp
                        else if (moment(temp.start).isAfter(moment(nextDay.start))) nextDay = temp
                        calendar.addEvent(temp)
                    }
                    if (!programmeHandle.UpData?.[3] && Object.keys(nextDay).length > 0)
                        programmeHandle.UpData[3] = nextDay
                    calendar.render()
                    $('.tit-upcoming-evt').trigger('Upcoming-Event:Trigger')
                },
                (errs) => {console.log('calendar-list_123 ', errs)
                }
            )
    }

    static init(calendar) {
        calendar.render()
        programmeHandle.callMeeting(calendar)
        programmeHandle.renderUpEvt()

        // click show detail of calendar
        $(document).on("click", ".calendarapp-wrap .fc-daygrid-event", function () {
            $('.hk-drawer.calendar-drawer').css({
                "border": "none",
                "box-shadow": "0 8px 10px rgba(0, 0, 0, 0.1)"
            }).addClass('drawer-toggle');
            let sltData = programmeHandle.prepareData(window.targetEvent.extendedProps.source)
            let $elmPopup = $('.calendar-drawer')
            $elmPopup.find('.event-name').text(sltData.title);
            $elmPopup.find('.date_txt').text(sltData?.date);
            $elmPopup.find('.time_txt').text(sltData?.time);
            $elmPopup.find('.loca_txt').text(sltData?.location);
            $elmPopup.find('.type_txt').text(sltData?.type);
            $elmPopup.find('.member_txt').html(sltData?.member);
            $elmPopup.find('.des_txt').text(sltData?.des);
            return false;
        });

        $('.categories-wrap input').on('change', function () {
            programmeHandle.triggerCallAPI(calendar)
        })
    }

    static triggerCallAPI(calendar) {
        var allEvents = calendar.getEvents();
        // Remove each event
        allEvents.forEach(function (event) {
            event.remove();
        });
        // check show/hide on category list
        $('.categories-wrap input:checked').each(function () {
            let params = {}
            let emp = $('#filter_employee_id').val()
            let group = $('#filter_group_id').val()
            switch (this.value) {
                case 'meeting':
                    if (emp.length > 0) params.employee_in_list = emp.join(',')
                    else params.self_employee = true
                    if (group) params.employee_inherit__group = group
                    params.meeting_date = moment().format('YYYY-MM-DD')
                    programmeHandle.callMeeting(calendar, params);
                    break;
                case 'business':
                    if (emp.length > 0) params.employee_inherit_list = emp.join(',')
                    else params.self_employee = true
                    if (group) params.employee_inherit__group = group
                    params.business_date = moment().format('YYYY-MM-DD')
                    programmeHandle.callBusiness(calendar, params);
                    break;
                default:
                    if (emp.length > 0) params.leave_employee_list = emp.join(',')
                    else params.self_employee = true
                    if (group) params.leave__employee_inherit__group = group
                    params.leave_date = moment().format('YYYY-MM-DD')
                    programmeHandle.callLeave(calendar, params);
            }
        });

    }
}

window.targetEvent = ''
$(document).ready(function () {
    let $FiEmpElm = $('.filter-emp')

    // run init khi mới vào page
    let calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: moment().format('YYYY-MM-DD'),
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        titleFormat:{
            weekday: 'long'
        },
        themeSystem: 'bootstrap5',
        dayMaxEventRows: 5,
        eventContent: function (arg) {
            if (arg.event.extendedProps.toHtml) {
                return {html: arg.event.title}
            }
        },
        eventClick: function (info) {
            window.targetEvent = info.event;
        },
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short'
        },
    });
    programmeHandle.init(calendar);

    // click show/hide content của filter
    $('.wrap-btn').on('click', function () {
        $(this).toggleClass('is_active')
        $(this).parent().next().next('.content-wrap').slideToggle()
    })
    // init filter có select
    let elm = $('#filter_employee_id')
    $('#filter_employee_id, #filter_group_id').each(function () {
        $(this).initSelect2()
        $(this).on('select2:select', function (e) {
            const selected = e.params.data
            if ($(this).attr('multiple') === 'multiple' && Object.keys(selected).length > 0)
                $FiEmpElm.removeClass('hidden')
            else $FiEmpElm.addClass('hidden')
            if (!$(this).hasClass('emp-list'))
                elm.val(null).trigger('change').attr('data-params', JSON.stringify({'group_id': selected.id}))

        });
        $(this).on('select2:unselect', function () {
            if (!$(this).hasClass('emp-list'))
                elm.val(null).trigger('change').removeAttr('data-params')
            else $FiEmpElm.removeClass('hidden')
        });
    })

    $FiEmpElm.on('click', function () {
        programmeHandle.triggerCallAPI(calendar)
        $FiEmpElm.addClass('hidden')
    });
});