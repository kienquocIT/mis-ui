class programmeHanlde {
    static init() {
        let curYear = moment().format('YYYY'),
            curMonth = moment().format('MM'),
            calendarEl = document.getElementById('calendar'),
            targetDrawer = '.hk-drawer.calendar-drawer',
            targetEvent;
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            initialDate: curYear+'-'+curMonth+'-07',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            themeSystem: 'bootstrap',
            events: [
                {
                    backgroundColor: '#FFC400',
                    borderColor: '#FFC400',
                    title: '9:30 AM - 8:00 PM Awwards Conference',
                    start: '2023-11-30',
                    end: '2024-01-02',
                },
            ],
            eventContent: function (arg) {
                if (arg.event.extendedProps.toHtml) {
                    return {html: arg.event.title}
                }
            },
            eventClick: function (info) {
                targetEvent = info.event;
            },
        });
        calendar.render();
        $(document).on("click", ".calendarapp-wrap .fc-daygrid-event", function (e) {
            $(targetDrawer).css({
                "border": "none",
                "box-shadow": "0 8px 10px rgba(0, 0, 0, 0.1)"
            }).addClass('drawer-toggle');
            $('.calendar-drawer').find('.event-name').text($(this).text());
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

    programmeHanlde.init();


    $.fn.callAjax2({
        'url': $URLElm.attr('data-meet'),
        'method': 'get',
        'data': {}
    })
        .then(function(req){
            let data = $.fn.switcherResp(req)['meeting_list']

        })
});