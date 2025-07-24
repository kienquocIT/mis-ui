class AttendanceElements {
    constructor() {
        this.$fiscalYearEle = $('#period-select');
        this.$monthFilterEle = $('#period-month');
        this.$startDate = $('#period-day-from');
        this.$endDate = $('#period-day-to');
        this.$urlEle = $('#url-factory');
        this.$urlAttendanceEle = $('#url-attendance-data');

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

        // sub-element
        this.$statusColors = {
            'P': 'bg-success-light-5',
            'A': 'bg-danger-light-5',
            'L': 'bg-warning-light-5',
            'B': 'bg-info-light-5',
            'H': 'bg-purple-light-5',
            'W': 'bg-secondary-light-5',
            'O': 'bg-primary-light-5',
            'OB': 'bg-dark-light-5'
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
    static loadAttendanceMainTable(data_list=[], date_range={}) {
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
                            $(ele).find(`td:eq(${i+1})`).html(`${item?.status}`);
                            $(ele).find(`td:eq(${i+1})`).attr('data-attendance-detail', JSON.stringify(item));
                            $(ele).find(`td:eq(${i+1})`).attr('data-fullname', data_list[index]?.['full_name']);

                            // change color for each status
                            // if (pageElements.$statusColors[item?.status]) {
                            //     $(ele).find(`td:eq(${i+1})`).addClass(pageElements.$statusColors[item?.status]);
                            // }
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
    static initMainTable(date_range) {
        let startDate = date_range?.start?.day;
        let endDate = date_range?.end?.day;
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
                                        <th class="fw-bold" style="min-width: 300px">Employee</th>
                                        ${th_html} 
                                    </tr>
                                </thead>
                                <tbody></tbody>
                           </table>`;
        $('#space_main_table_employee').html(table_html);
        return columns_cfg;
    }

    static formatToStandardData(raw_data) {
        const grouped = [];

        for (let item of raw_data) {
            const empId = item.employee_id;
            if (!grouped[empId]) {
                grouped[empId] = {
                    employee_id: empId,
                    code: item.code,
                    full_name: item.full_name,
                    attendance: []
                };
            }

            // Clone the item but exclude employee_id, code, full_name
            const {employee_id, code, full_name, ...attendanceItem} = item;
            grouped[empId].attendance.push(attendanceItem);
        }
        return Object.values(grouped);
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
        if (checkedEmployee) {
            // get criteria to show data, include: employee, date, month, fiscal year
            let checkedEmployeeData = JSON.parse(checkedEmployee);
            let fiscal_year = pageElements.$fiscalYearEle.val();
            let month_filter = pageElements.$monthFilterEle.val();
            let start_date = pageElements.$startDate.val();
            let end_date = pageElements.$endDate.val();
            let date_range = {
                start: {
                    day: parseInt(start_date),
                    month: parseInt(month_filter)
                },
                end: {
                    day: parseInt(end_date),
                    month: parseInt(month_filter)
                }
            };

            // build input parameters for filter processing
            let dataParams = {
                'emp_list': checkedEmployeeData.join(","),
                'date_range': JSON.stringify(date_range)
            }

            // build ajax to get necessary data (filter processing occurred in view)
            let ajax_v1 = $.fn.callAjax2({
                url: pageElements.$urlAttendanceEle.attr('data-attendance'),
                data: dataParams,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    return data || [];
                },
                (errs) => {
                    console.log(errs);
                }
            )

            // wait to ajax run complete
            Promise.all([ajax_v1]).then(
                (results) => {
                    let firstRes = results[0]
                    let standardData = AttendancePageFunction.formatToStandardData(firstRes); // format data
                    AttendanceLoadDataHandle.loadAttendanceMainTable(standardData, date_range);
                });
            $('#filterModal').hide();
        }
    }
}

/**
 Khai báo các hàm sự kiện
 **/
class AttendanceEventHandler {
    static InitPageEvent() {
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
            AttendancePageFunction.fetchAttendanceData();
        })

        // event when change month and data fields
        pageElements.$monthFilterEle.on('change', function () {
            AttendancePageFunction.fetchAttendanceData();
        })

        pageElements.$startDate.on('change', function () {
            AttendancePageFunction.fetchAttendanceData();
        })

        pageElements.$endDate.on('change', function () {
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
            let status = attendanceData?.status || '';

            const parseStatusInfo = {
                'P': 'Present',
                'A': 'Absent',
                'L': 'Leave',
                'B': 'Business Trip',
                'H': 'Holiday',
                'W': 'Weekend',
                'O': 'Overtime',
                'OB': 'Overtime on business trip'
            }

            pageElements.$employeeDetailEle.html(`
                <div class="col-4 fw-semibold">Employee Name:</div>
                <div class="col-8">${fullname}</div>
            `);
            pageElements.$dateDetailEle.html(`
                <div class="col-4 fw-semibold">Date:</div>
                <div class="col-8"></div>
            `);
            pageElements.$shiftDetailEle.html(`
                <div class="col-4 fw-semibold">Shift:</div>
                <div class="col-8">${attendanceData?.shift || ''}</div>
            `);
            pageElements.$checkinDetailEle.html(`
                <div class="col-4 fw-semibold">Check In:</div>
                <div class="col-8">${(attendanceData?.checkin || '').replace('T', ' ')}</div>
            `);
            pageElements.$checkoutDetailEle.html(`
                <div class="col-4 fw-semibold">Check In:</div>
                <div class="col-8">${(attendanceData?.checkout || '').replace('T', ' ')}</div>
            `);
            pageElements.$statusDetailEle.html(`
                <div class="col-4 fw-semibold">Status:</div>
                <div class="col-8">${parseStatusInfo[status] || status}</div>
            `);
            pageElements.$isLateDetailEle.html(`
                <div class="col-4 fw-semibold">Is Late:</div>
                <div class="col-8">${attendanceData?.is_late || false}</div>
            `);
            pageElements.$isEarlyDetailEle.html(`
                <div class="col-4 fw-semibold">Is Early Leave:</div>
                <div class="col-8">${attendanceData?.is_early_leave || false}</div>
            `);
            pageElements.$isRegularDetailEle.html(`
                <div class="col-5 fw-semibold">Regular Overtime Hours:</div>
                <div class="col-7">${attendanceData?.regular_overtime_hours || ''}</div>
            `);
            pageElements.$isWeekendDetailEle.html(`
                <div class="col-6 fw-semibold">Weekend Overtime Hours:</div>
                <div class="col-6">${attendanceData?.weekend_overtime_hourse || ''}</div>
            `);
            pageElements.$isHolidayDetailEle.html(`
                <div class="col-5 fw-semibold">Holiday Overtime Hours:</div>
                <div class="col-7">${attendanceData?.holiday_overtime_hours || ''}</div>
            `);

            $('#offcanvas_attendance_detail').offcanvas("show");
        });
    }
}

$(document).ready(function () {
    AttendanceEventHandler.InitPageEvent();
    AttendanceLoadDataHandle.loadEmployeeList();
});
