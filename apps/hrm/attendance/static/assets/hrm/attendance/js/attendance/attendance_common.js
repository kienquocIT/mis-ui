class AttendanceElements {
    constructor() {
        this.$select_employee = $('#select_employee');
        this.$startDate = $('#date_from');
        this.$endDate = $('#date_to');
        this.$urlEle = $('#url-factory');
        this.$urlAttendanceEle = $('#url-attendance-data');
        this.$btnAplly = $('#apply_filter');

        // filter modal element
        this.$tableEmployeeEle = $('#table_employee');
        this.$storeEmployeeEle = $('#employee-checked');
        this.$selectBoxAll = $('#select_box_all');
        this.$btnSelect = $('#btn_select');

        // offcanvas detail element
        this.$employeeDetailEle = $('#emp_name_detail');
        this.$dateDetailEle = $('#date_detail');
        this.$shiftDetailEle = $('#shift_detail');
        this.$checkinDetailEle = $('#checkin_detail');
        this.$checkoutDetailEle = $('#checkout_detail');
        this.$statusDetailEle = $('#status_detail');
        this.$isLateDetailEle = $('#is_late_detail');
        this.$isEarlyDetailEle = $('#is_early_detail');
        this.$isRegularDetailEle = $('#regular_ovt_detail');
        this.$isWeekendDetailEle = $('#weekend_ovt_detail');
        this.$isHolidayDetailEle = $('#holiday_ovt_detail');

        // date - month field
        this.$boxMonth = $('#box-month');
        this.$fiscalYear = $('#data-fiscal-year');
        this.dataMonth = JSON.parse($('#filter_month').text());

        this.$btnRefresh = $('#sync_attendance');

        // sub-element
        this.$statusColors = {
            0: 'bg-success-light-5',
            1: 'bg-danger-light-5',
            2: 'bg-warning-light-5',
            3: 'bg-info-light-5',
            4: 'bg-purple-light-5',
            5: 'bg-secondary-light-5',
            6: 'bg-primary-light-5',
            7: 'bg-dark-light-5'
        }

        this.$statusAttendance = {
            0: 'A',
            1: 'P',
            2: 'L',
            3: 'B',
            4: 'W',
            5: 'H',
            6: 'O',
            7: 'OB'
        }

        this.$parseStatusInfo = {
            0: 'Absent',
            1: 'Present',
            2: 'Leave',
            3: 'Business Trip',
            4: 'Weekend',
            5: 'Holiday',
            6: 'Overtime',
            7: 'Overtime on business trip'
        }
    }
}

const pageElements = new AttendanceElements();

/**
 * Khai báo các hàm chính
 */
class AttendanceLoadDataHandle {
    /**
     * Initializes and loads the employee list table inside a modal using DataTabes.
     *
     * This method:
     * - Destroys and reinitializes the employee table with sever-side data.
     * - Fetches employee data from the specified URL in `data-md-employee` attribute.
     * - Groups employees by their `group.title`
     * - Renders checkboxes for selecting individual or grouped employees.
     * - Handles missing group data by assigning a default "None group".
     * - Attaches row-level checkbox click handlers to update selected employees.
     *
     * DataTable features:
     * - Custom column rendering (checkbox + badge).
     * - Scrollable height and row collapsing.
     * - Row grouping with toggling UI.
     * - Server-side data loading and dynamic sorting.
     *
     * @function
     * @static
     * @returns {void}
     */
    static loadEmployeeList() {
        pageElements.$tableEmployeeEle.DataTable().clear().destroy();
        pageElements.$tableEmployeeEle.DataTableDefault({
            useDataServer: true,
            scrollY: '60vh',
            scrollCollapse: true,
            rowIndex: true,
            ajax: {
                url: pageElements.$urlEle.attr('data-md-employee'),
                method: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('employee_list')) {
                        const employee_list = (resp.data['employee_list'] || []).map(item => {
                            if (!item.group || Object.keys(item.group).length === 0) {
                                return {
                                    ...item,
                                    group: {
                                        title: $.fn.gettext('None group'),
                                        code: "NONE"
                                    }
                                };
                            }
                            return item;
                        }).sort((a, b) => {
                            const codeA = a.group?.code?.toUpperCase() || '';
                            const codeB = b.group?.code?.toUpperCase() || '';
                            return codeA.localeCompare(codeB);
                        });
                        return employee_list ? employee_list : [];
                    };
                    throw Error('Call employee data raise errors.');
                },
            },
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => ''
                },
                {
                    className: 'w-90',
                    data: 'id',
                    render: (data, type, row) => {
                        let checked = '';
                        if (pageElements.$storeEmployeeEle.val()) {
                            let storeID = JSON.parse(pageElements.$storeEmployeeEle.val());
                            if (Array.isArray(storeID) && storeID.includes(row.id)) {checked = 'checked';}
                        }
                        return `<div class="form-check form-check-lg">
                                    <input type="checkbox" id="checkbox_${row.code}" class="form-check-input row-checkbox" value="${row.id}" ${checked}>
                                    <label for="checkbox_${row.code}" class="form-check-label">
                                            <span class="badge badge-soft-primary mr-2">${row.code}</span> ${row.full_name}
                                    </label>
                                </div>`;
                    }
                },
                {
                    className: 'w-5',
                    data: 'group',
                    render: (data, type, row) => {
                        return `<span>${data?.['title']}</span>`
                    }
                }
            ],
            columnDefs: [
                {
                    "searchable": false,
                    "orderable": false,
                },
                {
                    targets: [2],    // hidden group column
                    visible: false
                }
            ],
            rowGroup: {
                dataSrc: 'group.title', // grouped by field group.title
                startRender: function (rows, groupTitle) {
                    const groupCode = rows.data()[0].group?.code || '';
                    const isChecked = false;
                    const id = `group_toggle_${groupCode}`;

                    return $(`
                        <tr class="group-header" style="background-color: #dcf2ed" data-group-code="${groupCode}">
                            <td colspan="2" class="font-weight-bold px-3">
                                <div class="d-flex justify-content-between align-items-center w-100" style="min-height: 40px;">
                                    <div class="d-flex align-items-center">
                                        <i class="toggle-icon fas fa-chevron-down mr-2" style="cursor:pointer"></i>
                                        <span>${groupTitle}</span>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <input type="checkbox"
                                               class="group-checkbox form-check-input"
                                               style="width: 15px; height: 15px; cursor: pointer;"
                                               data-group="${groupCode}"
                                               ${isChecked ? 'checked' : ''}>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `);
                }
            },
            rowCallback: function (row, data, index) {
                $(row).attr('data-dt-row', index);
                $(row).find('.row-checkbox').on('click', function () {
                    AttendancePageFunction.loadStoreCheckedEmployee(this);
                })
            }
        });
    }

    /**
     * Initializes and renders the main attendance table for employees using DataTables
     *
     * This method:
     * - Builds the table columns dynamically based on the given date range.
     * - Destroys any existing DataTable instance to avoid duplication.
     * - Loads employee attendance data into the table.
     * - Populates each row with employee information and daily attendance statuses.
     * - Adds HTML badges for employee codes and names.
     * - Injects raw attendance dataa as `data-*` attributes on each cell for later use.
     * - Appends a custom note bar at the top of the table.
     *
     * Features:
     * - Horizontal and vertical scrolling with collapse support.
     * - Responsive fixed columns depending on screen width
     * - Custom `initComplete` logic to enhance display with badges and row formatting.
     *
     * @function
     * @static
     *
     * @param {Array<Object>} data_list - List of employee attendance data. Each object contains:
     *   - `code` {string} - Employee code.
     *   - `full_name` {string} - Employee full name.
     *   - `attendance` {Array<Object>} - List of attendance records for each day. Each item has:
     *   - `status` {string} - Attendance status for that day.
     *   - Other metadata saved as `data-attendance-detail`.
     *
     * @param {Object} date_range - The date range used to generate table columns, passed to `initMainTable()`.
     *
     * @returns {void}
     */
    static loadAttendanceMainTable(data_list=[], date_range=[]) {
        // init table
        let columns_cfg = AttendancePageFunction.initMainTable(date_range);
        let $main_table = $('#main_table_employee')

        // fill data into the table
        $main_table.DataTable().clear().destroy();
        $main_table.DataTableDefault({
            scrollY: '80vh',
            scrollX: true,
            scrollCollapse: true,
            rowIndex: true,
            paging: false,
            data: data_list,    // data parsed into the table
            fixedColumns: {
                leftColumns: 1,
                rightColumns: window.innerWidth <= 768 ? 0 : 0
            },
            columns: columns_cfg,
            initComplete: function () {
                if (data_list.length > 0) {
                    $main_table.find('tbody tr').each(function (index, ele) {
                        // fill employee name
                        $(ele).find('td:eq(0)').html(`
                               <span class="badge badge-soft-primary mr-2">
                                    ${data_list[index]?.['code']}
                               </span>${data_list[index]?.['full_name']}
                        `);

                        // fill status
                        for (let i=0; i < (data_list[index]?.attendance || []).length; i++) {
                            let item = (data_list[index]?.attendance || [])[i];
                            let attendanceStatus = item?.attendance_status !== undefined ? item?.attendance_status : '';
                            let attendanceStatusStr = pageElements.$statusAttendance?.[attendanceStatus] || '';
                            $(ele).find(`td:eq(${i+1})`).html(`${attendanceStatusStr}`);
                            $(ele).find(`td:eq(${i+1})`).attr('data-attendance-detail', JSON.stringify(item));
                            $(ele).find(`td:eq(${i+1})`).attr('data-fullname', data_list[index]?.['full_name']);

                            // change color for each status
                            if (pageElements.$statusColors[item?.status]) {
                                $(ele).find(`td:eq(${i+1})`).addClass(pageElements.$statusColors[item?.status]);
                            }
                        }
                    });
                }

                // Add note in the top of the table
                let wrapper$ = $main_table.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append($('#table-note').html())
                }
            }
        });
    }
}

/**
 * Các hàm load page và hàm hỗ trợ
 */
class AttendancePageFunction {
    static validateDate(dateStart, dateEnd) {
        let [startDay, startMonth, startYear] = dateStart.split('/').map(Number);
        let [endDay, endMonth, endYear] = dateEnd.split('/').map(Number);

        if (endMonth !== startMonth) {
            $.fn.notifyB({description: 'Please select dates within the same month.'}, 'failure');
            return false
        }

        const start = new Date(startYear, startMonth - 1, startDay);
        const end = new Date(endYear, endMonth - 1, endDay);
        if (start >= end) {
            $.fn.notifyB({description: 'Invalid Date: End Date must be larger than Start Date'}, 'failure');
            return false
        }
        return true
    }

    static loadStoreCheckedEmployee(ele) {
        let row = ele.closest('tr');
        let rowIndex = pageElements.$tableEmployeeEle.DataTable().row(row).index();
        let $row = pageElements.$tableEmployeeEle.DataTable().row(rowIndex);
        let dataRow = $row.data();
        if (!dataRow) {
            return true
        }
        ;

        let id = dataRow['id'];
        let storeVal = pageElements.$storeEmployeeEle.val();
        let storeID = [];

        if (storeVal) {
            try {
                storeID = JSON.parse(storeVal);
            } catch (e) {
                console.warn('Failed to parse storeEmployeeEle value:', e);
                storeID = [];
            }
        }

        if (ele.checked) {
            if (!storeID.includes(id)) {
                storeID.push(id);
            }
        } else {
            storeID = storeID.filter(storedId => storedId !== id);
        }
        pageElements.$storeEmployeeEle.val(JSON.stringify(storeID));
        return true;
    }

    /**
     * Initializes number of columns for main-table
     * - The fixed columns: Employee
     * - The remaining columns is created dynamically based on date range input.
     *
     * @param date_range
     * @returns {[{className: string, render: (function(): string)}]}
     */
    static initMainTable(dateRange) {
        let startDate = dateRange[0];
        let endDate = dateRange[1];
        let th_html = ``;
        let columns_cfg = [
            {
                className: 'ellipsis-cell-lg',
                render: () => `<span></span>`
            }
        ]
        for (let day = startDate; day <= endDate; day++) {
            let dateStr = `${day.toString().padStart(2, '0')}`;
            th_html += `<th style="color: black; min-width: 20px">${dateStr}</th>`;
            columns_cfg.push(
                {
                    className: 'text-center',
                    render: () => `<span></span>`
                }
            )
        }
        let table_html = `<table id="main_table_employee" class="table table-bordered nowrap w-100">
                                <thead class="bg-warning-light-4">
                                    <tr>
                                        <th class="fw-bold" style="min-width: 300px">${$.fn.gettext('Employee')}</th>
                                        ${th_html}
                                    </tr>
                                </thead>
                                <tbody></tbody>
                           </table>`;
        $('#space_main_table_employee').html(table_html);
        return columns_cfg;
    }

    static formatToStandardData(raw_data) {
        const grouped = {};

        for (let item of raw_data) {
            const emp = item?.employee || {};
            const employeeId = emp.id;

            if (!employeeId) continue;

            if (!grouped[employeeId]) {
                grouped[employeeId] = {
                    employee_id: employeeId,
                    code: emp.code || '',
                    full_name: emp.full_name || '',
                    attendance: []
                };
            }

            const {employee, ...attendanceItem} = item;
            grouped[employeeId].attendance.push(attendanceItem);
        }

        return Object.values(grouped);
    }


    static fillAttendancePerDay(standardData, dayCount, dayStart) {
        const result = [];
        for (let i = 0; i < (standardData || []).length; i++) {
            let attendancePerDay = Array.from({length: dayCount}, () => ({}));
            let attendance_data = (standardData || [])[i]?.attendance || [];
            for (let j = 0; j < attendance_data.length; j++) {
                attendancePerDay[attendance_data[j]?.date.split('-')[2] - dayStart] = attendance_data[j];
            }
            standardData[i]['attendance'] = attendancePerDay;
            result.push(standardData[i]);
        }
        return result;
    }

    static getAllMonthsFiscalYear() {
        let months = [];
        if (pageElements.$fiscalYear.val()) {
            let year = new Date().getFullYear();
            let dataFiscalYear = JSON.parse(pageElements.$fiscalYear.val());
            if (dataFiscalYear.length > 0) {
                for (let dataFY of dataFiscalYear) {
                    if (dataFY?.['fiscal_year'] === year) {
                        let startDateFY = new Date(dataFY?.['start_date']);
                        let currentDate = new Date(startDateFY);
                        // Loop for 12 months
                        for (let i = 0; i < 12; i++) {
                            let formattedMonth = currentDate.toISOString().slice(0, 7);
                            months.push(formattedMonth);
                            // Move to the next month
                            currentDate.setMonth(currentDate.getMonth() + 1);
                        }
                        break;
                    }
                }

            }
        }
        return months;
    };

    static parseMonthJSON() {
        let result = [];
        let dataMonths = AttendancePageFunction.getAllMonthsFiscalYear();
        for (let monthYear of dataMonths) {
            const [year, month] = monthYear.split('-').map(Number);
            result.push({
                year,
                month,
            });
        }
        return result;
    };

    static storeFiscalYear() {
        $.fn.callAjax2({
                'url': pageElements.$urlEle.attr('data-fiscal-year'),
                'method': "GET",
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('periods_list') && Array.isArray(data.periods_list)) {
                        pageElements.$fiscalYear.val(JSON.stringify(data.periods_list));
                        AttendancePageFunction.loadBoxMonth();
                        let currentDate = new Date();
                        let currentMonth = currentDate.getMonth() + 1;
                        pageElements.$boxMonth.val(currentMonth).trigger('change');
                    }
                }
            }
        )
    };

    static loadBoxMonth() {
        let data = [];
        let dataMonths = AttendancePageFunction.parseMonthJSON();
        for (let monthYear of dataMonths) {
            data.push({
                'id': monthYear?.['month'],
                'title': pageElements.dataMonth[monthYear?.['month'] - 1][1],
                'month': monthYear?.['month'],
                'year': monthYear?.['year'],
            })
        }
        data.push({
            'id': '',
            'title': 'Select...',
            'month': 0,
            'year': 0,
        })
        pageElements.$boxMonth.empty();
        pageElements.$boxMonth.initSelect2({
            data: data,
            'allowClear': true,
            templateResult: function (state) {
                let groupHTML = `<span class="badge badge-soft-success ml-2">${state?.['data']?.['year'] ? state?.['data']?.['year'] : "_"}</span>`
                return $(`<span>${state.text} ${groupHTML}</span>`);
            },
        });
    };

    static callRefresh() {
        WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
        let dataMonth = SelectDDControl.get_data_from_idx(pageElements.$boxMonth, pageElements.$boxMonth.val());
        $.fn.callAjax2(
            {
                'url': pageElements.$urlAttendanceEle.attr('data-attendance'),
                'method': "POST",
                'data': {'year': dataMonth?.['year'], 'month': dataMonth?.['month']},
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(() => {
                        AttendancePageFunction.fetchAttendanceData();
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

    /**
     * Fetches and processes employee attendance data based on selected filters.
     *
     * This method:
     * - Retrieves selected employees and filter criteria (fiscal year, month, start and end date).
     * - Builds the date range and request parameters for the AJAX call.
     * - Sends an AJAX GET request to fetch attendance data from the server. (fetching the necessary data for processing occurs in the view)
     * - On success:
     *   - Parses the response using `switcherResp`.
     *   - Formats the data into a standard structure using `formatToStandardData()`.
     *   - Passes the processed data to `loadAttendanceMainTable()` for rendering.
     * - Closes the filter modal after loading is triggered.
     *
     * Prerequisites:
     * - At least one employee must be selected and stored in `$storeEmployeeEle`.
     *
     * AJAX endpoint:
     * - The URL is taken from `data-attendance` attribute of `$urlAttendanceEle`.
     * - Filter criteria is passed as GET parameters.
     *
     * @function
     * @static
     * @returns {void}
     */
    static fetchAttendanceData() {
        let checkedEmployee = pageElements.$storeEmployeeEle.val();
        let dateStart = pageElements.$startDate.val();
        let dateEnd = pageElements.$endDate.val();

        if (checkedEmployee && dateStart && dateEnd) {
            if (AttendancePageFunction.validateDate(dateStart, dateEnd)) {
                // get criteria to show data, include: employee, date, month, fiscal year
                let checkedEmployeeData = JSON.parse(checkedEmployee);

                // build input parameters for filter processing
                let dataParams = {
                    'employee_id__in': checkedEmployeeData.join(","),
                    'date__gte': DateTimeControl.formatDateType("DD/MM/YYYY", "YYYY-MM-DD", dateStart),
                    'date__lte': DateTimeControl.formatDateType("DD/MM/YYYY", "YYYY-MM-DD", dateEnd),
                }

                // build ajax to get necessary data (filter processing occurred in view)
                let ajax_v1 = $.fn.callAjax2({
                    url: pageElements.$urlAttendanceEle.attr('data-attendance'),
                    data: dataParams,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        // return data?.['attendance_list'] || [];

                        // mockup data for demo, will remove lately
                        return [
                            {
                                "id": "3ae0e19f-30e4-4979-831e-214484c12f46",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:16:21",
                                "checkout_time": "18:26:21",
                                "date": "2025-09-11",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "8882e94e-8f34-4fa3-8bd6-9c34ac4e4a0d",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:18:21",
                                "checkout_time": "17:42:21",
                                "date": "2025-09-11",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "bfc979dd-dc76-4e43-9787-0720de6309b0",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:08:21",
                                "checkout_time": "17:53:21",
                                "date": "2025-09-10",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "ee2dfca3-6ea8-4469-9794-f14801e3fe8b",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:40:21",
                                "checkout_time": "18:26:21",
                                "date": "2025-09-10",
                                "attendance_status": 0,
                                "is_late": true,
                                "is_early_leave": false
                            },
                            {
                                "id": "3ae0e19f-30e4-4979-831e-214484c12f46",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:16:21",
                                "checkout_time": "18:26:21",
                                "date": "2025-09-09",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "8882e94e-8f34-4fa3-8bd6-9c34ac4e4a0d",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:18:21",
                                "checkout_time": "17:42:21",
                                "date": "2025-09-09",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "3ae0e19f-30e4-4979-831e-214484c12f46",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:16:21",
                                "checkout_time": "18:26:21",
                                "date": "2025-09-08",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "8882e94e-8f34-4fa3-8bd6-9c34ac4e4a0d",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:18:21",
                                "checkout_time": "17:42:21",
                                "date": "2025-09-08",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "3ae0e19f-30e4-4979-831e-214484c12f46",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": null,
                                "checkout_time": null,
                                "date": "2025-09-07",
                                "attendance_status": 4,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "8882e94e-8f34-4fa3-8bd6-9c34ac4e4a0d",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": null,
                                "checkout_time": null,
                                "date": "2025-09-07",
                                "attendance_status": 4,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "3ae0e19f-30e4-4979-831e-214484c12f46",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": null,
                                "checkout_time": null,
                                "date": "2025-09-06",
                                "attendance_status": 4,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "8882e94e-8f34-4fa3-8bd6-9c34ac4e4a0d",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": null,
                                "checkout_time": null,
                                "date": "2025-09-06",
                                "attendance_status": 4,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "3ae0e19f-30e4-4979-831e-214484c12f46",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:16:21",
                                "checkout_time": "18:26:21",
                                "date": "2025-09-05",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "8882e94e-8f34-4fa3-8bd6-9c34ac4e4a0d",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:18:21",
                                "checkout_time": "14:42:21",
                                "date": "2025-09-05",
                                "attendance_status": 0,
                                "is_late": false,
                                "is_early_leave": true
                            },
                            {
                                "id": "3ae0e19f-30e4-4979-831e-214484c12f46",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:16:21",
                                "checkout_time": "18:26:21",
                                "date": "2025-09-04",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "8882e94e-8f34-4fa3-8bd6-9c34ac4e4a0d",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:18:21",
                                "checkout_time": "17:42:21",
                                "date": "2025-09-04",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "3ae0e19f-30e4-4979-831e-214484c12f46",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:16:21",
                                "checkout_time": "18:26:21",
                                "date": "2025-09-03",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "8882e94e-8f34-4fa3-8bd6-9c34ac4e4a0d",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": "08:18:21",
                                "checkout_time": "17:42:21",
                                "date": "2025-09-03",
                                "attendance_status": 1,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "3ae0e19f-30e4-4979-831e-214484c12f46",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": null,
                                "checkout_time": null,
                                "date": "2025-09-02",
                                "attendance_status": 5,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "8882e94e-8f34-4fa3-8bd6-9c34ac4e4a0d",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": null,
                                "checkout_time": null,
                                "date": "2025-09-02",
                                "attendance_status": 5,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "3ae0e19f-30e4-4979-831e-214484c12f46",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "13313570-128b-4728-b51d-7c85ae80c465",
                                    "first_name": "Tâm",
                                    "last_name": "Hồ Minh",
                                    "full_name": "Hồ Minh Tâm",
                                    "email": "vtkthu1970@gmail.com",
                                    "phone": "0939111001",
                                    "avatar_img": "/media/public/80785ce8f13848b8b7fa5fb1971fe204/global/avatar/13313570128b4728b51d7c85ae80c465.png",
                                    "code": "EMO0052"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": null,
                                "checkout_time": null,
                                "date": "2025-09-01",
                                "attendance_status": 5,
                                "is_late": false,
                                "is_early_leave": false
                            },
                            {
                                "id": "8882e94e-8f34-4fa3-8bd6-9c34ac4e4a0d",
                                "code": "",
                                "title": "",
                                "employee": {
                                    "id": "f5b8c004-8910-4117-8c66-521f10752b27",
                                    "first_name": "Việt",
                                    "last_name": "Nguyễn",
                                    "full_name": "Nguyễn Việt",
                                    "email": "vietnn@mtsolution.com.vn",
                                    "phone": "0903331211",
                                    "avatar_img": null,
                                    "code": "EMP0001"
                                },
                                "shift": {
                                    "id": "13639719-cabf-4c20-bfff-f9027041f4aa",
                                    "title": "Ca Hành Chính",
                                    "code": "SH001"
                                },
                                "checkin_time": null,
                                "checkout_time": null,
                                "date": "2025-09-01",
                                "attendance_status": 5,
                                "is_late": false,
                                "is_early_leave": false
                            },
                        ];
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                // wait to ajax run complete
                Promise.all([ajax_v1]).then(
                    (results) => {
                        let firstRes = results[0];
                        let standardData = AttendancePageFunction.formatToStandardData(firstRes); // format data

                        let dayStart = parseInt(dateStart.split('/')[0]);
                        let dayEnd = parseInt(dateEnd.split('/')[0]);
                        let dateRange = [dayStart, dayEnd];
                        let dayCount = dayEnd - dayStart + 1;
                        let solvedData = AttendancePageFunction.fillAttendancePerDay(standardData, dayCount, dayStart);
                        AttendanceLoadDataHandle.loadAttendanceMainTable(solvedData, dateRange);
                    });
                $('#filterModal').hide();
            }
        } else {
            $.fn.notifyB({description: 'Employee, Start Date, and End Date are required'}, 'failure');
        }
    }
}

/**
 Khai báo các hàm sự kiện
 **/
class AttendanceEventHandler {
    static InitPageEvent() {
        // show employee filter modal
        pageElements.$select_employee.on('click', function() {
            $('#filterModal').modal('show');
        });

        // toggle show/hide rows in a group
        pageElements.$tableEmployeeEle.on('click', '.toggle-icon', function() {
            const $groupRow = $(this).closest('tr');
            const $icon = $(this);

            $icon.toggleClass('fa-chevron-down fa-chevron-up');
            // fill all employee in group
            const $employeeRows = $groupRow.nextUntil('.group-header');

            if ($icon.hasClass('fa-chevron-up')) {
                $employeeRows.hide();
            }
            else {
                $employeeRows.show();
            }
        });

        // select all employees when their groups are checked.
        pageElements.$tableEmployeeEle.on('change', '.group-checkbox', function () {
            let groupCode = $(this).data('group');
            let isChecked = $(this).is(':checked');

            pageElements.$tableEmployeeEle.DataTable().rows().every(function () {
                let data = this.data();
                if (data?.group && data?.group?.code === groupCode) {
                    let $checkbox = $(this.node()).find('.row-checkbox');
                    $checkbox.prop('checked', isChecked);
                    if ($checkbox.length > 0) {
                        AttendancePageFunction.loadStoreCheckedEmployee($checkbox[0]);
                    }
                }
            });
        });

        // select all employees and all groups
        pageElements.$selectBoxAll.on('change', function () {
            let isChecked = $(this).is(':checked');
            pageElements.$tableEmployeeEle.DataTable().rows().every(function () {
                let $checkbox = $(this.node()).find('.row-checkbox');
                $checkbox.prop('checked', isChecked);
                if ($checkbox.length > 0) {
                    AttendancePageFunction.loadStoreCheckedEmployee($checkbox[0]);
                }
            })
            pageElements.$tableEmployeeEle.find('.group-checkbox').each(function () {
                $(this).prop('checked', isChecked);
            });
        })

        // event for button select in filter modal
        pageElements.$btnSelect.on('click', function () {
            // show text in input element
            let checkedEmployee = pageElements.$storeEmployeeEle.val();
            let checkedEmployeeData = JSON.parse(checkedEmployee || '[]');
            let count = checkedEmployeeData.length;
            let displayText = count === 0
                ? gettext('All Department & Employee')
                : ngettext(
                    '%(count)s employee selected',
                    '%(count)s employees selected',
                    count
                ).replace('%(count)s', count);


            pageElements.$select_employee.find('.employee-text').text(displayText);
            $('#filterModal').modal('hide');
        })

        // show information on main table
        pageElements.$btnAplly.on('click', function() {
            AttendancePageFunction.fetchAttendanceData();
        })

        // add event hover in each record in Main table
        $(document).on("mouseenter", '#main_table_employee tbody tr', function () {
            $(this).addClass('fw-bold')
        });

        $(document).on("mouseleave", '#main_table_employee tbody tr', function () {
            $(this).removeClass('fw-bold')
        });

        // event for showing offcanvas detail
        $(document).on("click", '#main_table_employee tbody td', function () {
            let attendanceData = $(this).attr('data-attendance-detail') ? JSON.parse($(this).attr('data-attendance-detail')) : {};
            let fullname = $(this).attr('data-fullname') || '';
            let status = attendanceData?.attendance_status !== undefined ? attendanceData?.attendance_status : '';
            let statusStr = pageElements.$parseStatusInfo?.[status] || '';
            let attendanceDate = DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", attendanceData?.date || '');

            // Format boolean values with badges
            const formatBoolean = (value) => {
                if (value === true || value === 'true') {
                    return `<span class="badge bg-danger"><i class="bi bi-x-circle me-1"></i>${$.fn.gettext('Yes')}</span>`;
                }
                return `<span class="badge bg-success"><i class="bi bi-check-circle me-1"></i>${$.fn.gettext('No')}</span>`;
            };

            // Format status with appropriate badge and icon
            const formatStatus = (statusStr) => {
                if (!statusStr) return '<span class="text-muted">N/A</span>';
                let badgeClass = 'bg-secondary';
                let iconClass = 'bi-question-circle';
                
                if (statusStr.toLowerCase().includes('present')) {
                    badgeClass = 'bg-success';
                    iconClass = 'bi-check-circle-fill';
                } else if (statusStr.toLowerCase().includes('absent')) {
                    badgeClass = 'bg-danger';
                    iconClass = 'bi-x-circle-fill';
                } else if (statusStr.toLowerCase().includes('leave')) {
                    badgeClass = 'bg-warning';
                    iconClass = 'bi-calendar-x';
                } else if (statusStr.toLowerCase().includes('business')) {
                    badgeClass = 'bg-info';
                    iconClass = 'bi-briefcase';
                } else if (statusStr.toLowerCase().includes('holiday') || statusStr.toLowerCase().includes('weekend')) {
                    badgeClass = 'bg-primary';
                    iconClass = 'bi-calendar-check';
                }
                
                return `<span class="badge ${badgeClass}"><i class="bi ${iconClass} me-1"></i>${statusStr}</span>`;
            };

            // Employee Information Section
            pageElements.$employeeDetailEle.html(`
                <div class="col-5 text-muted">${$.fn.gettext('Employee')}:</div>
                <div class="col-7"><strong class="text-dark">${fullname}</strong></div>
            `);
            
            pageElements.$dateDetailEle.html(`
                <div class="col-5 text-muted">${$.fn.gettext('Date')}:</div>
                <div class="col-7"><span>${attendanceDate}</span></div>
            `);

            pageElements.$shiftDetailEle.html(`
                <div class="col-5 text-muted">${$.fn.gettext('Shift')}:</div>
                <div class="col-7">
                    <span>${(attendanceData?.shift || {})?.title || '<span class="text-muted">N/A</span>'}</span>
                </div>
            `);
            
            // Attendance Time Section
            pageElements.$checkinDetailEle.html(`
                <div class="col-5 text-muted">${$.fn.gettext('Check In')}:</div>
                <div class="col-7">${attendanceData?.checkin_time ? attendanceData.checkin_time.replace('T', ' ') : '--:--'}</div>
            `);
            
            pageElements.$checkoutDetailEle.html(`
                <div class="col-5 text-muted">${$.fn.gettext('Check Out')}:</div>
                <div class="col-7">${attendanceData?.checkout_time ? attendanceData.checkout_time.replace('T', ' ') : '--:--'}</div>
            `);
            
            // Status Information Section
            pageElements.$statusDetailEle.html(`
                <div class="col-5 text-muted">${$.fn.gettext('Status')}:</div>
                <div class="col-7">${formatStatus(statusStr)}</div>
            `);
            
            pageElements.$isLateDetailEle.html(`
                <div class="col-5 text-muted">${$.fn.gettext('Late Arrival')}:</div>
                <div class="col-7">${formatBoolean(attendanceData?.is_late)} </div>
            `);
            
            pageElements.$isEarlyDetailEle.html(`
                <div class="col-5 text-muted">${$.fn.gettext('Early Leave')}:</div>
                <div class="col-7">${formatBoolean(attendanceData?.is_early_leave)}</div>
            `);
            
            // Overtime Hours Section
            pageElements.$isRegularDetailEle.html(`
                <div class="col-5 text-muted">${$.fn.gettext('Regular OT')}:</div>
                <div class="col-7">${attendanceData?.regular_overtime_hours || 0} hours</div>
            `);
            pageElements.$isWeekendDetailEle.html(`
                <div class="col-5 text-muted"> ${$.fn.gettext('Weekend OT')}:</div>
                <div class="col-7">${attendanceData?.weekend_overtime_hourse || 0} hours</div>
            `);
            pageElements.$isHolidayDetailEle.html(`
                <div class="col-5 text-muted">${$.fn.gettext('Holiday OT')}:</div>
                <div class="col-7">${attendanceData?.holiday_overtime_hours || 0} hours</div>
            `);
            $('#offcanvas_attendance_detail').offcanvas("show");
        });

        pageElements.$boxMonth.on('change', function () {
            let data = SelectDDControl.get_data_from_idx(pageElements.$boxMonth, pageElements.$boxMonth.val());
            if (data?.['month'] && data?.['year']) {
                $('.flat-picker').each(function () {
                    DateTimeControl.initFlatPickrDateInMonth(this, data?.['month'], data?.['year']);
                });
                let dataMonth = DateTimeControl.getMonthInfo(data?.['month'], data?.['year']);
                pageElements.$startDate.val(dataMonth?.['from']);
                pageElements.$endDate.val(dataMonth?.['to']);
            }
        });

        pageElements.$btnRefresh.on('click', function () {
            AttendancePageFunction.callRefresh();
        });

    }
}

$(document).ready(function () {
    // init date picker
    $('.flat-picker').each(function () {
        DateTimeControl.initFlatPickrDate(this);
    });
    AttendancePageFunction.storeFiscalYear();

    AttendanceEventHandler.InitPageEvent();
    AttendanceLoadDataHandle.loadEmployeeList();
});
