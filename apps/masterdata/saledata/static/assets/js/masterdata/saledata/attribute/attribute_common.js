class AttributeHandle {
    static $form = $('#frm_attribute');
    static $table = $('#table_category');

    static $canvas = $('#shiftCanvas');
    static $canvasBodyShift = $('#canvas_body_shift');


    static $boxParent = $('#box_parent');

    static $transEle = $('#app-trans-factory');
    static $urlEle = $('#app-url-factory');

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

    static init() {
        // AttributeHandle.loadDtbEmployee();
        AttributeHandle.loadDtb();
        FormElementControl.loadInitS2(AttributeHandle.$boxParent);
        // init date picker
        $('.flat-picker').each(function () {
            DateTimeControl.initFlatPickrDate(this);
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
                        let listBg = ['#e92990', '#c02ff3'];
                        let shiftBg = {};
                        for (let m = mStart.clone(); m.isBefore(mEnd); m.add(1, 'days')) {
                            for (let shiftAssignmentData of data.shift_assignment_list) {
                                if (shiftAssignmentData?.['date'] === m.format('YYYY-MM-DD')) {
                                    let bg = '#298DFF';
                                    if (Object.keys(shiftBg).length === 0) {
                                        shiftBg[shiftAssignmentData?.['shift']?.['id']] = '#298DFF';
                                    }
                                    if (Object.keys(shiftBg).length > 0) {
                                        if (shiftBg?.[shiftAssignmentData?.['shift']?.['id']]) {
                                            bg = shiftBg?.[shiftAssignmentData?.['shift']?.['id']];
                                        }
                                        if (!shiftBg?.[shiftAssignmentData?.['shift']?.['id']]) {
                                            bg = listBg[Math.floor(Math.random() * listBg.length)];
                                            shiftBg[shiftAssignmentData?.['shift']?.['id']] = bg;
                                        }
                                    }
                                    events.push({
                                        backgroundColor: bg,
                                        title: shiftAssignmentData?.['shift']?.['title'],
                                        start: m.format('YYYY-MM-DD'),
                                        dataShift: shiftAssignmentData?.['shift'],
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
        let employeeStore = {};
        let groupStore = {};
        if (ShiftAssignHandle.$employeesCheckedEle.val()) {
            employeeStore = JSON.parse(ShiftAssignHandle.$employeesCheckedEle.val());
        }
        if (ShiftAssignHandle.$groupsCheckedEle.val()) {
            groupStore = JSON.parse(ShiftAssignHandle.$groupsCheckedEle.val());
        }
        if (Object.keys(employeeStore).length === 1) {
            if (Object.keys(groupStore).length === 0) {
                let employeeID = Object.keys(employeeStore)[0];
                ShiftAssignHandle.generateEvents(info.start, info.end, employeeID, calendar);
            }
        }
        return true;
    };

    static parseDateList(dateFrom, dateTo) {
        let result = [];
        let dataShift = SelectDDControl.get_data_from_idx(ShiftAssignHandle.$shiftApplyEle, ShiftAssignHandle.$shiftApplyEle.val());
        let dayOfWeek = [];
        let dayOfWeekCheck = dataShift?.['working_day_list'] ? dataShift?.['working_day_list'] : {};
        for (let key in dayOfWeekCheck) {
            if (dayOfWeekCheck[key] === true) {
                switch (key) {
                    case "Sun": dayOfWeek.push(0); break;
                    case "Mon": dayOfWeek.push(1); break;
                    case "Tue": dayOfWeek.push(2); break;
                    case "Wed": dayOfWeek.push(3); break;
                    case "Thu": dayOfWeek.push(4); break;
                    case "Fri": dayOfWeek.push(5); break;
                    case "Sat": dayOfWeek.push(6); break;
                }
            }
        }
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
            if (dayOfWeek.includes(current.getDay())) {
                result.push(format(new Date(current)));
            }
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
            'all_company': ShiftAssignHandle.$allCompanyEle[0].checked,
            'group_list': groupList,
            'group_employee_exclude_list': groupEmployeeExcludeList,
            'employee_list': employeeList,
            'shift': ShiftAssignHandle.$shiftApplyEle.val(),
            'date_list': dateList,
        };
    };

    // DataTable
    static loadPushDtbChild(trEle, parentID) {
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
        AttributeHandle.loadDtbChild(idTbl, parentID);
        return true;
    };

    static loadDtbEmployee() {
        if ($.fn.dataTable.isDataTable(ShiftAssignHandle.$tableEmployee)) {
            ShiftAssignHandle.$tableEmployee.DataTable().destroy();
        }
        ShiftAssignHandle.$tableEmployee.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: ShiftAssignHandle.$urlEle.attr('data-dd-employee'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) return resp.data['employee_list'] ? resp.data['employee_list'] : [];
                    return [];
                },
            },
            pageLength: 10,
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
                        let checkGroupEle = ShiftAssignHandle.$tableGroup[0].querySelector(`.checkbox-group[data-group-id="${row?.['group']?.['id']}"]`);
                        if (checkGroupEle) {
                            if (checkGroupEle.checked === true) {
                                checked = 'checked';
                            }
                        }
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="checkbox" name="checkbox_employee" id="check_employee_${row?.['id']}" class="form-check-input checkbox-employee" data-group-id="${row?.['group']?.['id']}" ${checked}>
                                    <label class="form-check-label" for="check_employee_${row?.['id']}">${row?.['full_name']}</label>
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
            },
        });
    };

    static loadDtb() {
        if ($.fn.dataTable.isDataTable(AttributeHandle.$table)) {
            AttributeHandle.$table.DataTable().destroy();
        }
        AttributeHandle.$table.DataTableDefault({
            data: [
                {'id': 1, 'title': 'CPU (Category)',},
                {'id': 3, 'title': 'Storage (Category)',},
            ],
        // ajax: {
        //     url: AttributeHandle.$form.attr('data-url'),
        //     type: "GET",
        //     dataSrc: function (resp){
        //       let data = $.fn.switcherResp(resp);
        //       if (data && data.hasOwnProperty('attribute_list')) return data['attribute_list'];
        //       return [];
        //     },
        // },
        pageLength:10,
        scrollY: '70vh',
        info: false,
        columns: [
            {
                targets: 0,
                width: "20%",
                render: (data, type, row) => {
                    return `<div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <button class="btn-collapse-parent btn btn-icon btn-rounded mr-1" data-parent-id="${row?.['id']}"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${row?.['title']}</b>
                                </div>
                            </div>`;
                }
            },
        ],
        drawCallback: function () {
            // add css to Dtb
            AttributeHandle.dtbHDCustom();
        },
    }, false);
    };

    static dtbHDCustom() {
        let $table = AttributeHandle.$table;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-new').length) {
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-add-new" data-bs-toggle="offcanvas" data-bs-target="#addCanvas">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${AttributeHandle.$transEle.attr('data-add-new')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
            }
        }
    };

    static loadDtbChild(idTbl, parentID) {
        let $tableChild = $('#' + idTbl);
        if ($.fn.dataTable.isDataTable($tableChild)) {
            $tableChild.DataTable().destroy();
        }
        $tableChild.not('.dataTable').DataTableDefault({
            // useDataServer: true,
            data: [
                {'id': 2, 'title': 'Intel (List)', 'parent_n': 1},
                {'id': 4, 'title': 'SSD (Numeric)', 'parent_n': 3},
            ],
            // ajax: {
            //     url: AttributeHandle.$form.attr('data-url'),
            //     type: 'GET',
            //     data: {'parent_n_id': parentID},
            //     dataSrc: function (resp) {
            //         let data = $.fn.switcherResp(resp);
            //         if (data) return resp.data['attribute_list'] ? resp.data['attribute_list'] : [];
            //         return [];
            //     },
            // },
            pageLength: 5,
            info: false,
            columns: [
                {
                    title: AttributeHandle.$transEle.attr('data-attribute'),
                    width: '70%',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <button class="btn-collapse-parent btn btn-icon btn-rounded mr-1" data-parent-id="${row?.['id']}"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${row?.['title']}</b>
                                </div>
                            </div>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
            },
            drawCallback: function () {
                // add css to Dtb
                // ShiftAssignHandle.loadDtbHideHeader(idTbl);
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

}

$(document).ready(function () {
    AttributeHandle.init();
    // tạo DateListCallable tháng hiện tại
    const newDate = moment().format('YYYY-MM')
    window.DateListCallable = []
    window.DateListCallable.push(newDate)

    // click show/hide content của filter
    $('.wrap-btn').on('click', function () {
        $(this).toggleClass('is_active')
        $(this).parent().next().next('.content-wrap').slideToggle()
    })

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

            AttributeHandle.loadPushDtbChild(trEle, $(this).attr('data-parent-id'));
            trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
        }
    });

    SetupFormSubmit.validate(AttributeHandle.$form, {
            rules: {
                apply_from: {
                    required: true,
                },
                apply_to: {
                    required: true,
                },
                shift: {
                    required: true,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

    function submitHandlerFunc() {
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
                        ShiftAssignHandle.loadShiftEmployee(calendar, ShiftAssignHandle.calendarInfo);
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
    }

});