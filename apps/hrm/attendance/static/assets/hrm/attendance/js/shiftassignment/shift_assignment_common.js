class ShiftAssignHandle {
    static $wrapperEle = $('#calendarapp-wrapper');
    static $calendarEle = $('#calendar');
    static $table = $('#table_group');
    static $fromEle = $('#apply_from');
    static $toEle = $('#apply_to');
    static $shiftApplyEle = $('#box_shift_apply');
    static $btnShiftAssign = $('#btn-shift-assign');
    static $groupsCheckedEle = $('#groups-checked');
    static $employeesCheckedEle = $('#employees-checked');

    static $transEle = $('#app-trans-factory');
    static $urlEle = $('#app-url-factory');

    static dataCompanyConfig = null;
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

    static init(calendar) {
        // init config
        ShiftAssignHandle.getStoreCompanyConfig();
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

    static generateEvents(startDate, endDate, employeeID, calendar) {
        let events = [];
        let mStart = moment(startDate);
        let mEnd = moment(endDate);

        WindowControl.showLoading();
        $.fn.callAjax2({
                'url': ShiftAssignHandle.$urlEle.attr('data-api-shift-assignment'),
                'method': "GET",
                'data': {'employee_id': employeeID},
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('shift_assignment_list') && Array.isArray(data.shift_assignment_list)) {
                        let listBg = ['#298DFF', '#e92990', '#c02ff3', '#00d67f'];
                        let shiftBg = {};
                        for (let m = mStart.clone(); m.isBefore(mEnd); m.add(1, 'days')) {
                            for (let shiftAssignmentData of data.shift_assignment_list) {
                                if (shiftAssignmentData?.['date'] === m.format('YYYY-MM-DD')) {
                                    let bg = listBg[Math.floor(Math.random() * listBg.length)];
                                    if (!shiftBg?.[shiftAssignmentData?.['shift']?.['id']]) {
                                        shiftBg[shiftAssignmentData?.['shift']?.['id']] = bg;
                                    }
                                    if (shiftBg?.[shiftAssignmentData?.['shift']?.['id']]) {
                                        bg = shiftBg?.[shiftAssignmentData?.['shift']?.['id']];
                                    }
                                    events.push({
                                        backgroundColor: `${bg}`,
                                        title: `${shiftAssignmentData?.['shift']?.['title']}`,
                                        start: m.format('YYYY-MM-DD'),
                                        extendedProps: {
                                            toHtml: 'convert'
                                        }
                                    });
                                }
                            }
                        }
                        calendar.addEventSource(events);
                        WindowControl.hideLoading();
                    }
                }
            }
        )
        return events;
    };

    static loadShiftEmployee(calendar, info) {
        calendar.removeAllEvents();
        if (ShiftAssignHandle.$employeesCheckedEle.val()) {
            let storeID = JSON.parse(ShiftAssignHandle.$employeesCheckedEle.val());
            if (Object.keys(storeID).length === 1) {
                let employeeID = Object.keys(storeID)[0];
                ShiftAssignHandle.generateEvents(info.start, info.end, employeeID, calendar);
            }
        }
        return true;
    };

    static parseDateList(dateFrom, dateTo) {
        let result = [];
        let parse = (str) => {
            const [day, month, year] = str.split('/').map(Number);
            return new Date(year, month - 1, day);
        };
        let format = (date) => {
            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            return `${dd}/${mm}/${yyyy}`;
        };

        let current = parse(dateFrom);
        let end = parse(dateTo);

        while (current <= end) {
            result.push(format(current));
            current.setDate(current.getDate() + 1);
        }
        return result;
    };

    static setupDataSubmit() {
        let groupList = [];
        let groupEmployeeExcludeList = [];
        let employeeList = [];
        let dateList = [];
        if (ShiftAssignHandle.$groupsCheckedEle.val()) {
            let storeID = JSON.parse(ShiftAssignHandle.$groupsCheckedEle.val());
            for (let key in storeID) {
                groupList.push(key);
                if (storeID[key]?.['employee_exclude_list']) {
                    for (let excludeID of storeID[key]?.['employee_exclude_list']) {
                        groupEmployeeExcludeList.push(excludeID);
                    }
                }
            }
        }
        if (ShiftAssignHandle.$employeesCheckedEle.val()) {
            let storeID = JSON.parse(ShiftAssignHandle.$employeesCheckedEle.val());
            for (let key in storeID) {
                employeeList.push(key);
            }
        }
        let parseDateList = ShiftAssignHandle.parseDateList(ShiftAssignHandle.$fromEle.val(), ShiftAssignHandle.$toEle.val());
        for (let parseDate of parseDateList) {
            dateList.push(DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', parseDate));
        }
        return {
            'group_list': groupList,
            'group_employee_exclude_list': groupEmployeeExcludeList,
            'employee_list': employeeList,
            'shift': ShiftAssignHandle.$shiftApplyEle.val(),
            'date_list': dateList,
        };
    };

    // DataTable
    static loadStoreCheckGroup(ele) {
        let row = ele.closest('tr');
        let rowIndex = ShiftAssignHandle.$table.DataTable().row(row).index();
        let $row = ShiftAssignHandle.$table.DataTable().row(rowIndex);
        let dataRow = $row.data();
        if (dataRow) {
            let groupID = dataRow?.['id'];
            if (ShiftAssignHandle.$groupsCheckedEle.val()) {
                let storeID = JSON.parse(ShiftAssignHandle.$groupsCheckedEle.val());
                if (typeof storeID === 'object') {
                    if (ele.checked === true) {
                        if (!storeID?.[groupID]) {
                            storeID[groupID] = {
                                "type": "current",
                                "data": dataRow,
                            };
                        }
                        if (storeID?.[groupID]) {
                            if (storeID?.[groupID]?.['employee_exclude_list']) {
                                storeID[groupID]['employee_exclude_list'] = [];
                            }
                        }
                    }
                    if (ele.checked === false) {
                        if (storeID?.[groupID]) {
                            delete storeID?.[groupID];
                        }
                        // remove employee of group
                        ShiftAssignHandle.loadRemoveEmployeeOfGroup(groupID);
                    }
                    ShiftAssignHandle.$groupsCheckedEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (ele.checked === true) {
                    dataStore[groupID] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                ShiftAssignHandle.$groupsCheckedEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    };

    static loadRemoveEmployeeOfGroup(groupID) {
        if (ShiftAssignHandle.$employeesCheckedEle.val()) {
            let storeID = JSON.parse(ShiftAssignHandle.$employeesCheckedEle.val());
            for (let key in storeID) {
                if (storeID[key]?.['group_id']) {
                    if (storeID[key]?.['group_id'] === groupID) {
                        delete storeID[key];
                    }
                }
            }
            ShiftAssignHandle.$employeesCheckedEle.val(JSON.stringify(storeID));
        }
        return true;
    };

    static loadStoreCheckEmployee(ele) {
        let row = ele.closest('tr');
        let table = row.closest('table');
        let rowIndex = $(table).DataTable().row(row).index();
        let $row = $(table).DataTable().row(rowIndex);
        let dataRow = $row.data();
        if (dataRow) {
            let groupID = $(ele).attr('data-group-id');
            let employeeID = dataRow?.['id'];
            if (ShiftAssignHandle.$employeesCheckedEle.val()) {
                let storeID = JSON.parse(ShiftAssignHandle.$employeesCheckedEle.val());
                if (typeof storeID === 'object') {
                    if (ele.checked === true) {
                        if (!storeID?.[dataRow?.['id']]) {
                            storeID[dataRow?.['id']] = {
                                "type": "current",
                                "data": dataRow,
                                "group_id": groupID,
                            };
                        }
                    }
                    if (ele.checked === false) {
                        if (storeID?.[dataRow?.['id']]) {
                            delete storeID?.[dataRow?.['id']];
                        }
                        // push employee exclude to group
                        ShiftAssignHandle.loadPushGroupExclude(groupID, employeeID);
                    }
                    ShiftAssignHandle.$employeesCheckedEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (ele.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                if (ele.checked === false) {
                    // push employee exclude to group
                    ShiftAssignHandle.loadPushGroupExclude(groupID, employeeID);
                }
                ShiftAssignHandle.$employeesCheckedEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    };

    static loadPushGroupExclude(groupID, employeeID) {
        let checkGroupEle = ShiftAssignHandle.$table[0].querySelector(`.checkbox-group[data-group-id="${groupID}"]`);
        if (checkGroupEle) {
            if (checkGroupEle.checked === true) {
                checkGroupEle.checked = false;
            }
            if (ShiftAssignHandle.$groupsCheckedEle.val()) {
                let storeID = JSON.parse(ShiftAssignHandle.$groupsCheckedEle.val());
                if (storeID?.[groupID]) {
                    if (storeID[groupID]?.['employee_exclude_list']) {
                        storeID[groupID]['employee_exclude_list'].push(employeeID);
                    } else {
                        storeID[groupID]['employee_exclude_list'] = [employeeID];
                    }
                    ShiftAssignHandle.$groupsCheckedEle.val(JSON.stringify(storeID));
                }
            }
        }
        return true;
    };

    static loadPushDtbEmployee(trEle, groupID) {
        let idTbl = UtilControl.generateRandomString(12);
        if (!trEle.next().hasClass('child-list')) {
            let dtlSub = `<table id="${idTbl}" class="table table-child nowrap w-100"><thead></thead><tbody></tbody></table>`
            trEle.after(
                `<tr class="child-list"><td colspan="4"><div class="child-workflow-group hidden-simple">${dtlSub}</div></td></tr>`
            );
        }
        if (trEle.next().hasClass('child-list')) {
            let $tableChildEle = trEle.next().find('.table-child');
            if ($tableChildEle.length > 0) {
                idTbl = $tableChildEle[0].id;
            }
        }
        ShiftAssignHandle.loadDtbEmployee(idTbl, groupID);
        return true;
    };

    static loadDtbEmployee(idTbl, groupID) {
        let $tableChild = $('#' + idTbl);
        if ($.fn.dataTable.isDataTable($tableChild)) {
            $tableChild.DataTable().destroy();
        }
        $tableChild.not('.dataTable').DataTableDefault({
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
                        let checked = '';
                        if (ShiftAssignHandle.$employeesCheckedEle.val()) {
                            let storeID = JSON.parse(ShiftAssignHandle.$employeesCheckedEle.val());
                            if (typeof storeID === 'object') {
                                if (storeID?.[row?.['id']]) {
                                    checked = 'checked';
                                }
                            }
                        }
                        let checkGroupEle = ShiftAssignHandle.$table[0].querySelector(`.checkbox-group[data-group-id="${groupID}"]`);
                        if (checkGroupEle) {
                            if (checkGroupEle.checked === true) {
                                checked = 'checked';
                            }
                        }
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="checkbox" name="checkbox_employee" id="checkbox_employee_${row?.['id']}" class="form-check-input checkbox-employee" data-group-id="${groupID}" ${checked}>
                                    <label class="form-check-label" for="checkbox_employee_${row?.['id']}">${row?.['full_name']}</label>
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
            rowCallback: function (row, data, index) {
            },
            drawCallback: function () {
                // add css to Dtb
                ShiftAssignHandle.loadDtbHideHeader(idTbl);
            },
        });
    };

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

    // Config
    static getStoreCompanyConfig() {
        DocumentControl.getCompanyConfig().then((configData) => {
            ShiftAssignHandle.dataCompanyConfig = configData?.['config'] ? configData?.['config'] : {};
        });
        return true;
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
            ShiftAssignHandle.calendarInfo = info;
            ShiftAssignHandle.loadShiftEmployee(calendar, ShiftAssignHandle.calendarInfo);
        },
        eventDidMount: function (info) {
            let eventEle = info.el;
            let eventFcMainEle = info.el.querySelector('.fc-event-main');
            if (info.event.extendedProps.toHtml === 'convert') {
                // $(eventEle).css({
                //     'background-color': 'transparent',
                //     'border': 'none',
                // })
                // $(eventFcMainEle).css({
                //     'color': 'inherit',
                //     'float': 'right',
                //     'font-size': '10px',
                // })
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
                                    <button class="btn-collapse-parent btn btn-icon btn-rounded mr-1" data-group-id="${row?.['id']}"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${row?.['title']}</b>
                                </div>
                                <div class="form-check form-check-lg">
                                    <input type="checkbox" name="checkbox_group" class="form-check-input checkbox-group" data-group-id="${row?.['id']}">
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
    $(document).on('click', '.btn-collapse-parent', function (event) {
        event.preventDefault();

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

            ShiftAssignHandle.loadPushDtbEmployee(trEle, $(this).attr('data-group-id'));
            trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
        }
    });

    ShiftAssignHandle.$table.on('click', '.checkbox-group', function () {
        ShiftAssignHandle.loadStoreCheckGroup(this);
        let row = this.closest('tr');
        if (row) {
            ShiftAssignHandle.loadPushDtbEmployee($(row), $(this).attr('data-group-id'));
        }
    });

    ShiftAssignHandle.$table.on('click', '.checkbox-employee', function () {
        ShiftAssignHandle.loadStoreCheckEmployee(this);
        ShiftAssignHandle.loadShiftEmployee(calendar, ShiftAssignHandle.calendarInfo);
        // if (this.checked === false) {
        //     let checkGroupEle = ShiftAssignHandle.$table[0].querySelector(`.checkbox-group[data-group-id="${$(this).attr('data-group-id')}"]`);
        //     if (checkGroupEle) {
        //         checkGroupEle.checked = false;
        //         ShiftAssignHandle.loadStoreCheckGroup(checkGroupEle);
        //     }
        // }
    });

    ShiftAssignHandle.$btnShiftAssign.on('click', function () {
        WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
        $.fn.callAjax2(
            {
                'url': ShiftAssignHandle.$urlEle.attr('data-api-shift-assignment'),
                'method': "POST",
                'data': ShiftAssignHandle.setupDataSubmit(),
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(() => {
                        window.location.reload();
                        WindowControl.hideLoading();
                    }, 2000);
                }
            }, (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            }
        )
    });

});