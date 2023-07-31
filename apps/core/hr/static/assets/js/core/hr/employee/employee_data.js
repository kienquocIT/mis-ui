/*Blog Init*/
$(function () {
    let tb = $('#datable_employee_list');
    tb.DataTableDefault({
        rowIdx: true,
        ajax: {
            url: tb.attr('data-url'),
            type: tb.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee_list')) return data.employee_list;
                }
                return [];
            }
        },
        columns: [
            {
                'render': (data, type, row, meta) => {
                    // let currentId = "chk_sel_" + String(meta.row + 1)
                    // return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}"><label class="form-check-label" for="${currentId}"></label></span>`;
                    return '';
                }
            }, {
                'data': 'code',
                render: (data, type, row, meta) => {
                    // return String.format(`<b>{0}</b>`, data);
                    let urlEmployeeDetail = "/hr/employee/detail/" + row.id
                    return `<a href="${urlEmployeeDetail}">
                    <span><b>${data}</b></span>
                </a>`
                }
            }, {
                'data': 'full_name',
                'render': (data, type, row, meta) => {
                    if (row.hasOwnProperty('full_name') && row.hasOwnProperty('first_name') && typeof row.full_name === 'string') {
                        return `<div class="media align-items-center">
                                    <div class="media-head me-2">
                                        <div class="avatar avatar-xs avatar-success avatar-rounded">
                                            <span class="initial-wrap">` + row.first_name.charAt(0).toUpperCase() + `</span>
                                        </div>
                                    </div>
                                    <div class="media-body">
                                        <span class="d-block">` + row.full_name + `</span>
                                    </div>
                                </div>`;
                    }
                    return '';
                }
            }, {
                'render': (data, type, row, meta) => {
                    if (row.hasOwnProperty('group') && typeof row.group === "object") {
                        if (Object.keys(row.group).length !== 0) {
                            return `<span class="badge badge-primary">` + row.group.title + `</span>`;
                        }
                    }
                    return '';
                }
            }, {
                'render': (data, type, row, meta) => {
                    if (row.hasOwnProperty('role') && Array.isArray(row.role)) {
                        let result = [];
                        row.role.map(item => item.title ? result.push(`<span class="badge badge-soft-primary">` + item.title + `</span>`) : null);
                        return result.join(" ");
                    }
                    return '';
                }
            }, {
                'render': (data, type, row, meta) => {
                    if (row.hasOwnProperty('date_joined') && typeof row.date_joined === 'string') {
                        return new Date(row.date_joined).toDateString();
                    }
                    return '';
                }
            }, {
                'className': 'action-center',
                'render': (data, type, row, meta) => {
                    if (row.hasOwnProperty('is_active') && typeof row.is_active === 'boolean') {
                        if (row.is_active) {
                            return `<span class="badge badge-info badge-indicator badge-indicator-xl"></span>`;
                        } else {
                            return `<span class="badge badge-light badge-indicator badge-indicator-xl"></span>`;
                        }
                    }
                    return '';
                }
            }, {
            data: 'is_admin_company',
            render: (data, type, row, meta) =>{
                return `
                    <div class="form-check form-switch mb-1">
                        <input type="checkbox" class="form-check-input" ${data ? "checked": ""} readonly disabled>
                    </div>
                `;
            }
            },{
                'className': 'action-center',
                'render': (data, type, row, meta) => {
                    let urlDetail = "/hr/employee/" + row.id
                    let urlList = "/hr/employee"
                    let urlUpdate = "/hr/employee/update/" + row.id
                    let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="${urlUpdate}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#" data-url="${urlDetail}" data-method="DELETE" data-url-redirect="${urlList}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    return bt2 + bt3;
                }
            },
        ]
    });

    $(document).on('click', '.check-select', function () {
        if ($(this).is(":checked")) {
            $(this).closest('tr').addClass('selected');
        } else {
            $(this).closest('tr').removeClass('selected');
            $('.check-select-all').prop('checked', false);
        }
    });
});
