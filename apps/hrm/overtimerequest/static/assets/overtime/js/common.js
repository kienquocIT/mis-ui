class handleCommon {
    constructor() {
        this.$employeeTblElm = $('#table_employee');
        this.$groupTblElm = $('#table_group');
        this.$EmployeeChecked = $('#employee-checked');
        this.$GroupChecked = $('#group-checked');
        this.$CalendarElm = $('#calendar');
        this.$DateSelectedElm = $('#date_selected');
        this.calendarObj = null;
        this.init();
    }

    set setCalendar(cal) {
        this.calendarObj = cal
    }

    get getCalendar() {
        return this.calendarObj
    }

    static filterShiftRecords(data) {
        const allUsers = [...new Set(data.map(r => r.employee.id))];
        if (allUsers.length === 1) return data;

        const groups = {};

        // Group và filter trong 1 vòng lặp
        return data.filter(record => {
            const key = record.shift.id + '_' + record.date;
            groups[key] = groups[key] || [];
            groups[key].push(record.employee.id);
            return [...new Set(groups[key])].length >= 2;
        });
    }

    static callEmployeeOnGroup(groupID, isDelete= false){

        $.fn.callAjax2({
            'url': $('#table_employee').attr('data-url'),
            'method': 'GET',
            data: {'group_id': groupID, 'pageSize': -1}
        }).then((req) => {
            let res = $.fn.switcherResp(req);
            if (res && res.hasOwnProperty('employee_list')) {
                let data = res.employee_list;
                const $StoredDataCheck = $('#employee-checked');
                const _selected = $StoredDataCheck.data('checked');
                for (let item of data){
                    if (_selected.hasOwnProperty(item.id) && isDelete)
                        delete _selected[item.id]
                    else{
                        item.group.full_checked = true
                        _selected[item.id] = item
                    }
                }
                $StoredDataCheck.data('checked', _selected)
            }
        })
    }

    runEmployeeTable(tbl = null, groupID = null) {
        const $tblElm = tbl || this.$employeeTblElm
        let _tbl = $tblElm.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: this.$employeeTblElm.attr('data-url'), type: 'GET',
                data: function (d) {
                    if (groupID) d.group_id = groupID
                },
                dataSrc: function(resp){
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('employee_list')) {
                        const employee = data.employee_list;
                        const $selected = _this.$EmployeeChecked.data('checked')
                        if ($selected && Object.keys($selected).length){
                            const selectedList = Object.values($selected).map((item)=> {
                                return item.id
                            })
                            for (let emp of employee){
                                if (selectedList.indexOf(emp.id) !== -1) emp.selected = true
                            }
                        }
                        return employee
                    }
                    throw Error('Call data raise errors.')
                },
            },
            info: false,
            ordering: !tbl,
            columns: [
                {
                    title: $.fn.gettext('Employee'),
                    data: 'id',
                    width: '70%',
                    render: (row, type, data) => {
                        const checked = !!(this.$GroupChecked.data('checked')?.[data?.['group']['id']] || data.selected)
                        return `<div class="form-check form-check-lg d-flex align-items-center">`
                            + `<input type="checkbox" id="check_employee_${row}" class="form-check-input" data-group-id="${data?.['group']?.['id']}" ${checked ? 'checked' : ''}>`
                            + `<label class="form-check-label" for="check_employee_${row}">${data?.['full_name']}</label></div>`;
                    }
                },
                {
                    title: $.fn.gettext('Code'),
                    data: 'code',
                    width: '30%',
                    render: (row) => {
                        return `<span class="form-check-label">${row}</span>`;
                    }
                }
            ]
        });
        const _this = this;

        _tbl.on('change', 'tbody input[id*="check_employee_"]', function () {
            //uncheck all checked calendar
            $('.fc-daygrid-day input').prop('checked', false)
            _this.$DateSelectedElm.data('date', {})

            const td = _tbl.cell($(this).closest('td'));
            let data = _tbl.row(td[0][0].row).data();
            let beforeData = _this.$EmployeeChecked.data('checked') || {};
            if ($(this).prop('checked')) {
                data.selected = true;
                beforeData[data.id] = data
            } else {
                if (beforeData?.[data.id])
                    delete beforeData[data.id]
            }
            _this.$EmployeeChecked.data('checked', beforeData)
            _this.CallShiftEmployee()
        })
    }

    runGroupTable() {
        let _tbl = this.$groupTblElm.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: this.$groupTblElm.attr('data-url'), type: 'GET',
                dataSrc: 'data.group_list',
            },
            info: false,
            columns: [
                {
                    data: 'id',
                    width: '70%',
                    render: (row, type, data) => {
                        return `<div class="d-flex justify-content-between align-items-center"><div>`
                            + `<button class="btn-collapse-parent btn btn-icon btn-rounded mr-1" data-group-id="${
                                row}"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${data?.['title']}</b>`
                            + `</div><div class="form-check form-check-lg"><input type="checkbox" id="checkbox_group_${
                                row}" class="form-check-input checkbox-group" data-group-id="${row}"></div></div>`;
                    }
                }
            ]
        });
        const _this = this;
        // on CHECKED input checkbox
        _tbl.on('change', 'tbody input[id*="checkbox_group_"]', function () {
            const td = _tbl.cell($(this).closest('td'));
            let data = _tbl.row(td[0][0].row).data();
            let beforeData = _this.$GroupChecked.data('checked') || {};
            if ($(this).prop('checked')) {
                data.selected = true;
                beforeData[data.id] = data
                handleCommon.callEmployeeOnGroup(data.id)
            } else if (beforeData?.[data.id]) {
                delete beforeData[data.id]
                $(`#check_employee_${data.id}`).prop('checked', false)
                handleCommon.callEmployeeOnGroup(data.id, true)
            }
            _this.$GroupChecked.data('checked', beforeData)
        });
        // on CLICK action toggle show/hide
        _tbl.on('click', 'tbody button.btn-collapse-parent', function (e) {
            e.preventDefault();

            let trEle = $(this).closest('tr');
            let iconEle = $(this).find('.icon-collapse-app-wf');

            trEle.toggleClass('row_actived');
            iconEle.toggleClass('fa-caret-right').toggleClass('fa-caret-down');

            if (!trEle.hasClass('row_actived')) {
                trEle.removeClass('bg-grey-light-5');
                iconEle.removeClass('text-dark').addClass('text-secondary');
                trEle.next().find('.tbl_child_wrap').slideToggle({
                    complete: function () {
                        trEle.next().addClass('hidden');
                    }
                });
            } else {
                trEle.addClass('bg-grey-light-5');
                iconEle.removeClass('text-secondary').addClass('text-dark');

                _this.callDataChildTable(trEle, $(this).attr('data-group-id'));
                trEle.next().removeClass('hidden').find('.tbl_child_wrap').slideToggle();
            }
        })
    }

    callDataChildTable(trEle, groupID) {
        let idTbl = `tbl_child_of${groupID}`
        if (!trEle.next().hasClass('child-list')) {
            let dtlSub = `<table id="${idTbl}" class="table table-child nowrap w-100"></table>`
            trEle.after(
                `<tr class="child-list"><td><div class="tbl_child_wrap hidden-simple">${dtlSub}</div></td></tr>`
            );
        }
        if (trEle.next().hasClass('child-list')) {
            let $tableChildEle = trEle.next().find('.table-child');
            if ($tableChildEle.length > 0) {
                idTbl = `${$tableChildEle[0].id}`
            }
        }
        this.runEmployeeTable($(`#${idTbl}`), groupID);
        return true;
    };

    runCalendar() {
        let curYear = moment().format('YYYY');
        let curMonth = moment().format('MM');
        const _this = this
        this.setCalendar = new FullCalendar.Calendar(this.$CalendarElm[0], {
            initialView: 'dayGridMonth',
            initialDate: curYear + '-' + curMonth + '-07',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            themeSystem: 'bootstrap',
            height: 'parent',
            dayCellDidMount: function (arg) {
                if (arg.el.classList.contains('fc-day-past')) return true
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'day-checkbox';
                checkbox.style.position = 'absolute';
                checkbox.style.top = '5px';
                checkbox.style.right = '5px';
                checkbox.style.zIndex = '10';
                checkbox.setAttribute('arial-label', 'day in month')
                checkbox.id = `day_${arg.date.getTime()}`

                // let dateStr = arg.date.toISOString().split('T')[0];
                let dateStr = moment(arg.date).format('YYYY-MM-DD');
                checkbox.setAttribute('data-date', dateStr);

                const dateSelected = _this.$DateSelectedElm.data('date')
                if (dateSelected && dateSelected.hasOwnProperty(dateStr)) checkbox.checked = true

                checkbox.addEventListener('click', function (e) {
                    e.stopPropagation(); // Ngăn trigger dateClick

                    // Lấy calendar instance từ arg.view
                    const calendar = arg.view.calendar;
                    const dateStr = this.getAttribute('data-date');
                    const clickedDate = new Date(dateStr);
                    const dayOfWeek = clickedDate.getDay(); // 0 = CN, 6 = T7
                    // Tìm event của ngày này
                    const event = calendar.getEvents().find(evt =>
                        evt.startStr.split('T')[0] === dateStr
                    );
                    // Lấy shiftData nếu có
                    const shiftData = event?.extendedProps?.shiftData;

                    if (this.checked) {
                        let dataDate = {
                            'shift': shiftData ? {
                                'id': shiftData?.id,
                                'title': shiftData?.title,
                                'code': shiftData?.code,
                                'checkin_time': shiftData?.checkin_time,
                                'checkout_time': shiftData?.checkout_time
                            } : {},
                            'ot_type': 0,
                            'date': dateStr,
                        };
                        if (dayOfWeek === 0 || dayOfWeek === 6) dataDate.ot_type = 1

                        let oldDate = _this.$DateSelectedElm.data('date') || {}
                        oldDate[dateStr] = dataDate
                        _this.$DateSelectedElm.data('date', oldDate)
                    }
                    else {
                        let crtDate = _this.$DateSelectedElm.data('date') || {}
                        if (crtDate?.[dateStr]) delete crtDate[dateStr]
                        _this.$DateSelectedElm.data('date', crtDate)
                    }
                });

                arg.el.style.position = 'relative';
                arg.el.appendChild(checkbox);
            },
        });

        setTimeout(function () {
            $('.fc-prev-button,.fc-next-button').addClass('btn-icon btn-flush-dark btn-rounded flush-soft-hover').find('.fa').addClass('icon');
        }, 100);

        this.getCalendar.render();

        // render event sau khi page edit/detail call data lần đầu
        const $shiftElm = $('#data_shift')
        const shifts = $shiftElm.data('shift');
        if (shifts){
            const event = [];
            for (let shift of shifts) {
                event.push({
                    title: shift.title,
                    start: shift.date,
                    extendedProps: {
                        shiftData: shift,
                        toHtml: 'convert'
                    }
                });
            }
            this.getCalendar.addEventSource(event);
        }
    }

    CallShiftEmployee() {
        const employee = this.$EmployeeChecked.data('checked');
        if (Object.keys(employee).length > 0) {
            WindowControl.showLoading();
            const empLstID = [];
            for (let key in employee) {
                empLstID.push(key)
            }
            $.fn.callAjax2({
                'url': $('#url-factory').attr('data-shift-assignment'),
                'method': "GET",
                'data': {'employee_id__in': empLstID.join(',')}
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('shift_assignment_list')
                    && Array.isArray(data.shift_assignment_list)) {
                    data = data.shift_assignment_list
                    const dataAfterFilter = handleCommon.filterShiftRecords(data)
                    this.getCalendar.removeAllEvents();

                    const event = []
                    for (let item of dataAfterFilter) {
                        event.push({
                            title: item?.['shift']?.['title'],
                            start: item.date,
                            extendedProps: {
                                shiftData: item?.['shift'],
                                toHtml: 'convert'
                            }
                        });
                    }
                    this.calendarObj.addEventSource(event);
                    WindowControl.hideLoading();
                }
            })
        } else
            this.calendarObj.removeAllEvents();
    }

    init() {
        this.runCalendar()
        this.runEmployeeTable()
        this.runGroupTable()
    }
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function isTimeInRange(checkTime, startTime, endTime) {

    const checkStart = timeToMinutes(checkTime.start_time);
    const checkEnd = timeToMinutes(checkTime.end_time);
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    // Kiểm tra nếu không đủ 30 phút
    if (!(checkEnd - checkStart) >= 30) {
        return 1;
    }

    // Kiểm tra nếu start_time không hợp lệ (= 0)
    if (!(checkStart > 0) || checkEnd <= 0) {
        return 2;
    }

    // check dk trước ca hoặc sau ca và không dc lớn hơn 23:59 (1439)
    if ((checkStart < start && checkEnd <= start) ||
        (checkStart >= end && checkEnd > end && checkEnd <= 1439)) {
        return 0;
    }
    return 2;
}

$(document).ready(function(){
    const $form = $('#overtime_request_form')

    WFRTControl.setWFInitialData('overtimerequest');

    SetupFormSubmit.validate($form, {
        rules: {
            title: {
                required: true,
            },
            start_time: {
                required: true,
            },
            end_time: {
                required: true,
            },
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandlerFunc,
    });

    function submitHandlerFunc() {
        const frm = new SetupFormSubmit($form);
        const data_submit = frm.dataForm
        data_submit.employee_list = []
        data_submit.employee_inherit = $x.fn.getEmployeeCurrent('id')

        const _data = $('#date_selected').data('date')
        data_submit.date_list = Object.values(_data);
        if (!data_submit.date_list.length){
            $.fn.notifyB({'description': $.fn.gettext("Date is missing")}, 'failure')
            return false
        }

        const employee_list = $('#employee-checked').data('checked')
        for (let emp in employee_list) {
            data_submit.employee_list.push(emp)
            if (Object.keys(employee_list).length === 1)
                data_submit.employee_inherit = emp
        }
        if (!employee_list && employee_list.length === 0){
            $.fn.notifyB({'description': $.fn.gettext("Employee is missing")}, 'failure')
            return false
        }

        // valid time register in time of shift
        for (let dataDate of data_submit.date_list){
            const isShift = dataDate?.shift
            if (isShift && Object.keys(isShift).length){
                const checkIn = isShift['checkin_time']
                const checkOut = isShift['checkout_time']
                const list_error = {
                    0: '',
                    1: `Day` + moment(dataDate.date).format('DD') + ': ' + $.fn.gettext('The registered time is less than 30 minutes'),
                    2: `Day` + moment(dataDate.date).format('DD') + ': ' + $.fn.gettext('The registered time is not valid'),
                }

                const outOfRegister = isTimeInRange(data_submit, checkIn, checkOut)
                if (outOfRegister !== 0) {
                    $.fn.notifyB({description: list_error[outOfRegister]}, 'failure');
                    return false
                }
            }
        }
        WFRTControl.callWFSubmitForm(frm);
    }
})