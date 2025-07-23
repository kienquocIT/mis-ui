class AttendanceElements {
    constructor() {
        this.$mainTableEle = $('#main_table_employee');
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
    }
}

const pageElements = new AttendanceElements();

/**
 * Khai báo các hàm chính
 */
class AttendanceLoadDataHandle {
    // load all employee in modal
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
                            if (typeof storeID === 'object') {
                                if (storeID?.[data?.['id']]) {
                                    checked = 'checked';
                                }
                            }
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
                    targets: [2],    // ẩn đi cột ở group
                    visible: false
                }
            ],
            rowGroup: {
                dataSrc: 'group.title', // gom nhóm theo field group.title
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

    // load dynamic main table
    static loadAttendanceMainTable(data_list=[], date_range={}) {
        // init table
        let columns_cfg = AttendancePageFunction.initMainTable(date_range);

        // fill data into the table
        $('#main_table_employee').DataTable().clear().destroy();
        $('#main_table_employee').DataTableDefault({
            scrollY: '80vh',
            scrollX: true,
            scrollCollapse: true,
            rowIndex: true,
            data: data_list,    // data parsed into the table
            fixedColumns: {
                leftColumns: 1,
                rightColumns: window.innerWidth <= 768 ? 0 : 0
            },
            columns: columns_cfg,
            initComplete: function () {
                if (data_list.length > 0) {
                    $('#main_table_employee').find('tbody tr').each(function (index, ele) {
                        $(ele).find('td:eq(0)').html(`
                               <span class="badge badge-soft-primary mr-2">
                                    ${data_list[index]?.['code']}
                               </span>${data_list[index]?.['full_name']}
                        `);
                        for (let i=0; i < (data_list[index]?.attendance || []).length; i++) {
                            let item = (data_list[index]?.attendance || [])[i];
                            $(ele).find(`td:eq(${i+1})`).html(`${item?.status}`);
                        }
                    });
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
        if (!dataRow) {return true};

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
        let table_html = ` <table id="main_table_employee" class="table table-bordered nowrap w-100">
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
            const { employee_id, code, full_name, ...attendanceItem } = item;
            grouped[empId].attendance.push(attendanceItem);
        }
        return Object.values(grouped);
    }

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
                    $checkbox.trigger('change');
                }
            });
        });

        // select all employees and all groups
        pageElements.$selectBoxAll.on('change', function () {
            let isChecked = $(this).is(':checked');
            pageElements.$tableEmployeeEle.DataTable().rows().every(function () {
                let $checkbox = $(this.node()).find('.row-checkbox');
                $checkbox.prop('checked', isChecked);
                $checkbox.trigger('change');
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
    }
}

$(document).ready(function () {
    AttendanceEventHandler.InitPageEvent();
    AttendanceLoadDataHandle.loadEmployeeList();
});
