class AttendanceElements {
    constructor() {
        this.$tableGroupEle = $('#table_group');
        this.$tableEmployeeEle = $('#table_employee');
        this.$storeEmployeeEle = $('#employee-checked');
        this.$urlEle = $('#url-factory');
    }
}
const pageElements = new AttendanceElements();

/**
 * Khai báo các hàm chính
 */
class AttendanceLoadDataHandle {
    static loadGroupList() {
        pageElements.$tableGroupEle.DataTable().clear().destroy();
        pageElements.$tableGroupEle.DataTableDefault({
            useDataServer: true,
            scrollY: '500px',
            rowIndex: false,
            info: false,
            paging: false,
            ajax: {
                url: pageElements.$urlEle.attr('data-md-group'),
                method: 'GET',
                data: function (d) {
                    d.pageSize = -1
                },
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('group_dd_list')) {
                        return resp.data['group_dd_list'] ? resp.data['group_dd_list'] : []
                    };
                    throw Error('Call data raise errors.');
                }
            },
            columns: [
                {
                    data: 'id',
                    render: (row, index, data) => {
                        return `<div class="form-check form-check-lg" style="background: #ffe066">
                                     <label title="${data.title}" class="form-check-label"> ${data.title}</label>
                                </div>`
                    }
                }
            ]
        })
    }
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
                        return resp.data['employee_list'] ? resp.data['employee_list'] : []
                    };
                    throw Error('Call employee data raise errors.');
                }
            },
            columns:[
                {
                    className: 'w-5',
                    render: () => {
                        return '';
                    }
                },
                {
                    className: 'w-55',
                    data: 'id',
                    render: (row, index, data) => {
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
                                    <input type="checkbox" id="checkbox_${data.code}" class="form-check-input row-checkbox" value="${data.id}" ${checked}>
                                    <label for="checkbox_${data.code}" class="form-check-label">${data.code} ${data.full_name}</label>
                                </div>`;
                    }
                },
                {
                    className: 'w-40',
                    data: 'group',
                    render: (row) => {
                        return row?.title || '--'
                    }
                }
            ]
        })
    }
}

/**
 * Các hàm load page và hàm hỗ trợ
 */
class AttendancePageFunction {
    static initDatePickers() {
        $('.date-picker').each(function () {
            DateTimeControl.initDatePicker(this);
        });
    }
}

$(document).ready(function () {
    AttendancePageFunction.initDatePickers();
    AttendanceLoadDataHandle.loadEmployeeList();
});