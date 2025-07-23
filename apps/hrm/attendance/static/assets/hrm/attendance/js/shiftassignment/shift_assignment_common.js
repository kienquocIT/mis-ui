// calendar type No.
// 1: Meeting
// 2: Business
// 3: Leave
class ShiftAssignHandle {
    static $wrapperEle = $('#calendarapp-wrapper');
    static $calendarEle = $('#calendar');
    static $table = $('#table_group');
    static $shiftApplyEle = $('#box_shift_apply');
    static $transEle = $('#app-trans-factory');
    static $urlEle = $('#app-url-factory');

    static calendarInfo = null;

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
            console.log(data)
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
        }
        else if (data.calendar_type === 3) { // this case leave
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
        else { // this schedule meeting
            afterPrepare.title = data.title
            let start_time = data.meeting_start_date + ' ' + data.meeting_start_time
            let end_time = ShiftAssignHandle.addMinutesToDatetime(start_time, data.meeting_duration)
            afterPrepare.date = String.format(
                "{0} - {1}",
                moment(start_time, 'YYYY-MM-DD hh:mm:ss').format('MMM DD,YYYY'),
                moment(end_time, 'YYYY-MM-DD hh:mm:ss').format('MMM DD,YYYY')
            )
            afterPrepare.time = String.format(
                "{0} - {1}",
                moment(start_time.split(' ')[1], 'hh:mm:ss.ssssss').format('hh:mm A'),
                moment(end_time.split(' ')[1], 'hh:mm:ss.ssssss').format('hh:mm A')
            )
            if (data?.['room_info']) {
                afterPrepare.location = String.format("{0}, {1}", data?.['room_info']?.['location'], data?.['room_info']?.['title'])
            }
            else {
                afterPrepare.location = String.format("{0}, {1}", 'Online', 'Zoom meeting')
            }
            afterPrepare.type = $trans.attr('data-schedule-meet')
            for (let item of data.employee_attended_list) {
                let tempHTML = $($('.temp-chip').html())
                tempHTML.find('.chip-text').text(item.full_name)
                afterPrepare.member += tempHTML.prop('outerHTML')
            }
            for (let item of data.customer_member_list) {
                let tempHTML = $($('.temp-chip').html())
                tempHTML.find('.chip-text').text(item.full_name)
                afterPrepare.member += tempHTML.prop('outerHTML')
            }
            afterPrepare.des = data.meeting_content
        }
        return afterPrepare
    };

    static addMinutesToDatetime(dateTimeString, minutesToAdd) {
        const dateObj = new Date(dateTimeString);
        let mili = dateObj.getTime() + minutesToAdd * 60 * 1000
        return moment(mili).format('YYYY-MM-DD HH:mm:ss')
    };

    static loadDtbEmployee(idTbl, groupID) {
        $('#' + idTbl).not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: ShiftAssignHandle.$urlEle.attr('data-dd-employee'),
                type: 'GET',
                data: {'group_id': groupID},
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) return resp.data['employee_list'] ? resp.data['employee_list'] : [];
                    return [];
                },
            },
            pageLength: 5,
            info: false,
            columns: [
                {
                    title: ShiftAssignHandle.$transEle.attr('data-employee'),
                    width: '70%',
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="checkbox" name="checkbox_employee" class="form-check-input checkbox-employee">
                                    <label class="form-check-label">${row?.['full_name']}</label>
                                </div>`;
                    }
                },
                {
                    title: ShiftAssignHandle.$transEle.attr('data-code'),
                    width: '30%',
                    render: (data, type, row) => {
                        return `<span class="form-check-label">${row?.['code']}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                ShiftAssignHandle.loadDtbHideHeader(idTbl);
            },
        });
    }

    static init(calendar) {
        // init date picker
        $('.flat-picker').each(function () {
            DateTimeControl.initFlatPickrDate(this);
        });

        calendar.render();

        // click show detail of calendar
        $(document).on("click", ".calendarapp-wrap .fc-daygrid-event", function () {
            $('.hk-drawer.calendar-drawer').css({
                "border": "none",
                "box-shadow": "0 8px 10px rgba(0, 0, 0, 0.1)"
            }).addClass('drawer-toggle');
            let source = window.targetEvent.extendedProps.source;
            if (source.calendar_type === 3){
                source.date_from = window.targetEvent.start
                source.date_to = window.targetEvent.end
            }
            let sltData = ShiftAssignHandle.prepareData(source)
            let $elmPopup = $('.calendar-drawer')
            $elmPopup.find('.event-name').text(sltData.title);
            $elmPopup.find('.date_txt').text(sltData?.date);
            $elmPopup.find('.time_txt').text(sltData?.time || '--');
            $elmPopup.find('.loca_txt').text(sltData?.location);
            $elmPopup.find('.type_txt').text(sltData?.type);
            $elmPopup.find('.member_txt').html(sltData?.member);
            $elmPopup.find('.des_txt').text(sltData?.des);
            return false;
        });

        // click next btn
        $(document).on("click", ".calendarapp-wrap .fc-next-button", function () {
            // check opt filter, check display date current
            const crtStart = calendar.view.currentStart,
                crtEnd = calendar.view.currentEnd;
            let DStart = moment(calendar.view.currentStart);
            if (moment(crtStart).format('YYYY-MM') !== moment(crtEnd).format('YYYY-MM') &&
                $.inArray(calendar.view.type, ["dayGridMonth", "timeGridWeek"]) === -1)
                DStart = moment(crtEnd)


            // logic: nếu tháng next có trong danh sách thì ko call API,
            if (window.DateListCallable.includes(DStart.format('YYYY-MM'))) return true
            else window.DateListCallable.push( DStart.format('YYYY-MM') )

        })

        // click prev btn
        $(document).on("click", ".calendarapp-wrap .fc-prev-button", function () {
            // check opt filter, check display date current
            let DStart = moment(calendar.view.currentStart);

            // logic: nếu tháng hiện tại trùng với tháng next (currentStart) thì ko call API
            if (window.DateListCallable.includes(DStart.format('YYYY-MM'))) return true
            else window.DateListCallable.push(DStart.format('YYYY-MM'))
        });

    };

    static generateEvents(startDate, endDate) {
        let events = [];
        let mStart = moment(startDate);
        let mEnd = moment(endDate);

        for (let m = mStart.clone(); m.isBefore(mEnd); m.add(1, 'days')) {
            events.push({
                title: "Ca HC",
                start: m.format('YYYY-MM-DD'),
                extendedProps: {
                    toHtml: 'convert'
                }
            });
        }

        return events;
    };

    static loadShiftEmployee(calendar, info) {
        let events = ShiftAssignHandle.generateEvents(info.start, info.end);
        calendar.removeAllEvents();
        calendar.addEventSource(events);
    }

    // DataTable
    static loadDtbHideHeader(tableID) {
        let tableIDWrapper = tableID + '_wrapper';
        let tableWrapper = document.getElementById(tableIDWrapper);
        if (tableWrapper) {
            let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
            if (headerToolbar) {
                headerToolbar.classList.add('hidden');
            }
        }
        let tableIDLength = tableID + '_length';
        let tableLength = document.getElementById(tableIDLength);
        if (tableLength) {
            tableLength.classList.add('hidden');
        }
    };
}

$(document).ready(function () {
    // run init khi mới vào page
    ShiftAssignHandle.$wrapperEle.css({
        'height': 'calc(100vh - 78px)'
    });
    FormElementControl.loadInitS2(ShiftAssignHandle.$shiftApplyEle)

    let calendarEl = ShiftAssignHandle.$calendarEle[0];
    let curYear = moment().format('YYYY');
    let curMonth = moment().format('MM');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        initialDate: curYear + '-' + curMonth + '-07',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        themeSystem: 'bootstrap',
        height: 'parent',
        droppable: true,
        editable: true,
        events: [],
        eventContent: function (arg) {
            if (arg.event.extendedProps.toHtml) {
                return {html: arg.event.title}
            }
        },
        eventClick: function (info) {
            targetEvent = info.event;
        },
        datesSet: function (info) {
            // let events = ShiftAssignHandle.generateEvents(info.start, info.end);
            // calendar.removeAllEvents();
            // calendar.addEventSource(events);
            ShiftAssignHandle.calendarInfo = info;
        },
        eventDidMount: function (info) {
            let eventEle = info.el;
            let eventFcMainEle = info.el.querySelector('.fc-event-main');
            if (info.event.extendedProps.toHtml === 'convert') {
                $(eventEle).css({
                    'background-color': 'transparent',
                    'border': 'none',
                })
                $(eventFcMainEle).css({
                    'color': 'inherit',
                    'float': 'right',
                    'font-size': '10px',
                })
            }
        }

    });

    setTimeout(function () {
        $('.fc-prev-button,.fc-next-button').addClass('btn-icon btn-flush-dark btn-rounded flush-soft-hover').find('.fa').addClass('icon');
    }, 100);


    ShiftAssignHandle.init(calendar);
    // tạo DateListCallable tháng hiện tại
    const newDate = moment().format('YYYY-MM')
    window.DateListCallable = []
    window.DateListCallable.push(newDate)

    // click show/hide content của filter
    $('.wrap-btn').on('click', function () {
        $(this).toggleClass('is_active')
        $(this).parent().next().next('.content-wrap').slideToggle()
    })






    // INIT DATATABLE GROUP
    ShiftAssignHandle.$table.DataTableDefault({
        ajax: {
            url: ShiftAssignHandle.$urlEle.attr('data-dd-group'),
            type: "GET",
            dataSrc: function (resp){
              let data = $.fn.switcherResp(resp);
              if (data && data.hasOwnProperty('group_dd_list')) return data['group_dd_list'];
              return [];
            },
        },
        pageLength:50,
        scrollY: '76vh',
        searching: false,
        info: false,
        columns: [
            {
                targets: 0,
                width: "20%",
                render: (data, type, row) => {
                    return `<div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <button class="btn-collapse-app-wf btn btn-icon btn-rounded mr-1" data-group-id="${row?.['id']}"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${row?.['title']}</b>
                                </div>
                                <div class="form-check form-check-lg">
                                    <input type="checkbox" name="checkbox_group" class="form-check-input checkbox-group">
                                </div>
                            </div>`;
                }
            },
        ],
        drawCallback: function () {
            // add css to Dtb
            ShiftAssignHandle.loadDtbHideHeader('table_group');
        },
    }, false);

    // EVENT CLICK TO COLLAPSE IN LINE
    //      ACTION: INSERT TABLE CHILD TO ROW
    $(document).on('click', '.btn-collapse-app-wf', function (event) {
        event.preventDefault();

        let idTbl = UtilControl.generateRandomString(12);
        let trEle = $(this).closest('tr');
        let iconEle = $(this).find('.icon-collapse-app-wf');

        iconEle.toggleClass('fa-caret-right').toggleClass('fa-caret-down');

        if (iconEle.hasClass('fa-caret-right')) {
            trEle.removeClass('bg-grey-light-5');
            iconEle.removeClass('text-dark').addClass('text-secondary');
            trEle.next().find('.child-workflow-group').slideToggle({
                complete: function () {
                    trEle.next().addClass('hidden');
                }
            });
        }

        if (iconEle.hasClass('fa-caret-down')) {
            trEle.addClass('bg-grey-light-5');
            iconEle.removeClass('text-secondary').addClass('text-dark');

            if (!trEle.next().hasClass('child-workflow-list')) {
                let dtlSub = `<table id="${idTbl}" class="table table-child nowrap w-100"><thead></thead><tbody></tbody></table>`
                $(this).closest('tr').after(
                    `<tr class="child-workflow-list"><td colspan="4"><div class="child-workflow-group hidden-simple">${dtlSub}</div></td></tr>`
                );
            }
            if (trEle.next().hasClass('child-workflow-list')) {
                let $tableChildEle = trEle.next().find('.table-child');
                if ($tableChildEle.length > 0) {
                    idTbl = $tableChildEle[0].id;
                    if ($.fn.dataTable.isDataTable($tableChildEle)) {
                        $tableChildEle.DataTable().destroy();
                    }
                }
            }
            ShiftAssignHandle.loadDtbEmployee(idTbl, $(this).attr('data-group-id'));
            trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
        }
    });

    ShiftAssignHandle.$table.on('click', '.checkbox-employee', function () {
        ShiftAssignHandle.loadShiftEmployee(calendar, ShiftAssignHandle.calendarInfo);
    });

});