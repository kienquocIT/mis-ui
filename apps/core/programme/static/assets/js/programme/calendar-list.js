// calendar type No.
// 1: Meeting
// 2: Business
// 3: Leave
class programmeHandle {

    static prepareData(data){
        let afterPrepare = {
            title: '',
            date: '',
            time: '',
            location: '',
            type: '',
            member: '',
            des: ''
        }
        let $trans = $('#trans-factory')
        if (data.calendar_type === 1) {
            moment.locale('en')
            afterPrepare.title = data.subject
            afterPrepare.date = String.format("{0} - {1}", moment(data.meeting_date, 'YYYY-MM-DD hh:mm:ss').format('MMM DD,YYYY'),
                moment(data.meeting_date, 'YYYY-MM-DD hh:mm:ss').format('MMM DD,YYYY'))
            afterPrepare.time = String.format("{0} - {1}", moment(data.meeting_from_time, 'hh:mm:ss.ssssss').format('hh:mm A'),
                moment(data.meeting_date, 'hh:mm:ss.ssssss').format('hh:mm A'))
            afterPrepare.location = String.format("{0}, {1}", data.room_location, data.meeting_address)
            afterPrepare.type = $trans.attr('data-meet')
            for (let item of data.employee_attended_list){
                let tempHTML = $($('.temp-chip').html())
                tempHTML.find('.chip-text').text(item.fullname)
                afterPrepare.member += tempHTML.prop('outerHTML')
            }
            afterPrepare.des = data.input_result
        }
        else if (data.calendar_type === 2) {
            j
        }
        else{
            j
        }
        return afterPrepare
    }

    static callMeeting(calendar){
        $.fn.callAjax2({
            'url': $('#url-factory').attr('data-meet'),
            'method': 'get',
            'data': {}
        })
            .then(function (req) {
                let data = $.fn.switcherResp(req)['meeting_list']
                for (let item of data){
                    item.calendar_type = 1
                    let temp = {
                        title: item.subject,
                        start: moment(item.meeting_date, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD ') + item.meeting_from_time,
                        end: moment(item.meeting_date, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD ') + item.meeting_to_time,
                        source: item
                    }
                    let milis = moment(temp.end).diff(moment(temp.start))
                    if (moment.duration(milis).asHours() >= 8) temp.allDay = true
                    calendar.addEvent(temp);
                }
                calendar.render()
                },
                (errs) => {}
            )
    }

    static callBusiness(calendar){
        $.fn.callAjax2({
            'url': $('#url-factory').attr('data-business'),
            'method': 'get',
        })
            .then(function (req) {
                let data = $.fn.switcherResp(req)['business_trip_request']
                for (let item of data){
                    item.calendar_type = 2
                    let temp = {
                        title: item.title,
                        start: item.date_f,
                        end: item.date_t,
                        allDay: true,
                        source: item
                    }
                    let milis = moment(temp.end).diff(moment(temp.start))
                    if (moment.duration(milis).asHours() >= 8) temp.allDay = true
                    calendar.addEvent(temp);
                }
                calendar.render()
                },
                (errs) => {}
            )
    }

    static init() {
            let calendarEl = document.getElementById('calendar'),
            targetDrawer = '.hk-drawer.calendar-drawer',
            targetEvent;
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            initialDate: moment().format('YYYY-MM-DD'),
            locale: 'en',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            themeSystem: 'bootstrap5',
            dayMaxEventRows: 5,
            eventContent: function (arg) {
                if (arg.event.extendedProps.toHtml) {
                    return {html: arg.event.title}
                }
            },
            eventClick: function (info) {
                targetEvent = info.event;
            },
        });
        calendar.render()

        programmeHandle.callMeeting(calendar)

        $(document).on("click", ".calendarapp-wrap .fc-daygrid-event", function () {
            $(targetDrawer).css({
                "border": "none",
                "box-shadow": "0 8px 10px rgba(0, 0, 0, 0.1)"
            }).addClass('drawer-toggle');
            let sltData = programmeHandle.prepareData(targetEvent.extendedProps.source)
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
    }
}

$(document).ready(function () {
    let $DayChoice = $('input[name="calendar"]')
    let $URLElm = $('#url-factory')
    $DayChoice.daterangepicker({
        singleDatePicker: true,
        showDropdowns: false,
        minYear: 1901,
        "cancelClass": "btn-secondary",
        autoApply: true,
        parentEl: "#inline_calendar",
    }).trigger("click")

    programmeHandle.init();
});