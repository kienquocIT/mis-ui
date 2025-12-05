/*Blog Init*/
$(function () {
    let tb = $('#datable_employee_list');
    let urlDetail = tb.attr('data-url-detail');
    tb.DataTableDefault({
        rowIdx: true,
        useDataServer: true,
        ajax: {
            url: tb.attr('data-url'),
            type: tb.attr('data-method'),
            data: {
                "ordering": 'code'
            },
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee_list')) return data.employee_list;
                }
                return [];
            }
        },
        callbackGetLinkBlank: function (rowData) {
            return rowData.id ? urlDetail.replace('__pk__', rowData.id) : null;
        },
        autoWidth: false,
        columns: [
            {
                width: '1%',
                'render': (data, type, row, meta) => {
                    return '';
                }
            },
            {
                width: '10%',
                'data': 'code',
                orderable: true,
                render: (data, type, row, meta) => {
                    const link = urlDetail.replace('0', row.id);
                    return `<a href="${link}"><span class="badge badge-primary">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                }
            },
            {
                width: '20%',
                'data': 'full_name',
                'render': (data, type, row, meta) => {
                    if (row.hasOwnProperty('full_name') && row.hasOwnProperty('first_name') && typeof row.full_name === 'string') {
                        let avatarHTML = `
                            <div class="avatar avatar-xs avatar-soft-primary avatar-rounded">
                                <span class="initial-wrap">${row.first_name.charAt(0).toUpperCase()}</span>
                            </div>
                        `;
                        if (row.avatar_img){
                            avatarHTML = `
                                <div class="avatar avatar-xs avatar-success avatar-rounded">
                                    <img src="${row.avatar_img}" alt="Avatar" class="avatar-img">
                                </div>
                            `;
                        }
                        const link = urlDetail.replace('0', row.id);
                        return `
                            <a href="${link}"><div class="media align-items-center">
                                <div class="media-head me-2">${avatarHTML}</div>
                                <div class="media-body">
                                    <span class="d-block text-primary fw-bold">` + row.full_name + `</span>
                                </div>
                            </div></a>
                        `;
                    }
                    return '';
                }
            },
            {
                width: '15%',
                data: 'group',
                'render': (data, type, row, meta) => {
                    if (row.hasOwnProperty('group') && typeof row.group === "object") {
                        if (Object.keys(row.group).length !== 0) {
                            return `<span class="badge text-dark-10 fs-8 bg-yellow-light-4">` + row.group.title + `</span>`;
                        }
                    }
                    return '';
                }
            },
            {
                width: '25%',
                data: 'role',
                'render': (data, type, row, meta) => {
                    if (row.hasOwnProperty('role') && Array.isArray(row.role)) {
                        let result = [];
                        row.role.map(item => item.title ? result.push(`<span class="badge text-dark-10 fs-8 bg-red-light-4 mb-1 mr-1">` + item.title + `</span>`) : null);
                        return result.join(" ");
                    }
                    return '';
                }
            },
            {
                width: '10%',
                data: 'date_joined',
                'render': (data, type, row, meta) => {
                    return $x.fn.displayRelativeTime(data, {
                        'outputFormat': 'DD-MM-YYYY',
                    });
                }
            },
            {
                width: '10%',
                'className': 'action-center',
                data: 'is_active',
                'render': (data, type, row, meta) => {
                    if (row.hasOwnProperty('is_active') && typeof row.is_active === 'boolean') {
                        if (row.is_active) {
                            return `<span class="badge badge-success badge-indicator badge-indicator-xl"></span>`;
                        } else {
                            return `<span class="badge badge-danger badge-indicator badge-indicator-xl"></span>`;
                        }
                    }
                    return '';
                }
            },
            {
                width: '8%',
                data: 'is_admin_company',
                render: (data, type, row, meta) => {
                    return `
                    <div class="form-check form-switch mb-1">
                        <input type="checkbox" class="form-check-input" ${data ? "checked" : ""} readonly disabled>
                    </div>
                `;
                }
            },
            // {
            //     width: '15%',
            //     'className': 'action-center',
            //     'render': (data, type, row, meta) => {
            //         let urlDetail = "/hr/employee/" + row.id
            //         let urlList = "/hr/employee"
            //         let urlUpdate = "/hr/employee/update/" + row.id
            //         let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="${urlUpdate}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
            //         // let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#" data-url="${urlDetail}" data-method="DELETE" data-url-redirect="${urlList}"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
            //         return bt2;
            //     }
            // },
        ]
    });
});
