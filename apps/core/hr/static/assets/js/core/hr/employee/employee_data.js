$(function () {
    let tb = $('#datable_employee_list');
    let urlDetail = tb.attr('data-url-detail');
    let export_employee_list = []

    tb.DataTableDefault({
        useDataServer: true,
        rowIdx: true,
        scrollX: true,
        scrollY: '64vh',
        scrollCollapse: true,
        reloadCurrency: true,
        ajax: {
            url: tb.attr('data-url'),
            type: tb.attr('data-method'),
            data: {
                "ordering": 'code'
            },
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    // console.log(data)
                    export_employee_list = data["employee_list"]
                    if (data.hasOwnProperty('employee_list')) return data.employee_list;
                }
                return [];
            }
        },
        callbackGetLinkBlank: function (rowData) {
            return rowData?.['id'] ? urlDetail.replace('__pk__', rowData?.['id']) : null;
        },
        columns: [
            {
                className: 'w-5',
                render: (data, type, row, meta) => {
                    return '';
                }
            },
            {
                className: 'w-10',
                data: 'code',
                render: (data, type, row) => {
                    const link = urlDetail.replace('0', row?.['id']);
                    return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                }
            },
            {
                className: 'w-20',
                data: 'full_name',
                render: (data, type, row) => {
                    if (row.hasOwnProperty('full_name') && row.hasOwnProperty('first_name') && typeof row?.['full_name'] === 'string') {
                        let avatarHTML = `
                            <div class="avatar avatar-xs avatar-soft-primary avatar-rounded">
                                <span class="initial-wrap">${row?.['first_name'].charAt(0).toUpperCase()}</span>
                            </div>
                        `;
                        if (row?.['avatar_img']){
                            avatarHTML = `
                                <div class="avatar avatar-xs avatar-success avatar-rounded">
                                    <img src="${row?.['avatar_img']}" alt="Avatar" class="avatar-img">
                                </div>
                            `;
                        }
                        const link = urlDetail.replace('0', row?.['id']);
                        return `
                            <a href="${link}"><div class="media align-items-center link-primary underline_hover">
                                <div class="media-head me-2">${avatarHTML}</div>
                                <div class="media-body">
                                    <span class="d-block text-primary fw-bold">${row?.['full_name']}</span>
                                </div>
                            </div></a>
                        `;
                    }
                    return '';
                }
            },
            {
                className: 'w-10',
                data: 'group',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['group']?.['title'] || ''}</span>`;
                }
            },
            {
                className: 'w-30',
                data: 'role',
                render: (data, type, row) => {
                    if (row.hasOwnProperty('role') && Array.isArray(row?.['role'])) {
                        let result = [];
                        row?.['role'].map(item => item?.['title'] ? result.push(`<span class="bflow-mirrow-badge bg-blue-light-5 mb-1 mr-1">${item?.['title']}</span>`) : null);
                        return result.join(" ");
                    }
                    return '';
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['date_joined'], {'outputFormat': 'DD/MM/YYYY'});
                }
            },
            {
                className: 'text-center w-5',
                data: 'is_active',
                render: (data, type, row) => {
                    if (row.hasOwnProperty('is_active') && typeof row?.['is_active'] === 'boolean') {
                        if (row?.['is_active']) {
                            return `<span class="badge badge-success badge-indicator badge-indicator-xl"></span>`;
                        } else {
                            return `<span class="badge badge-danger badge-indicator badge-indicator-xl"></span>`;
                        }
                    }
                    return '';
                }
            },
            {
                className: 'text-center w-5',
                data: 'is_admin_company',
                render: (data, type, row) => {
                    return `${data ? '<i class="fa-solid fa-check text-success h5"></i>' : ""}`;
                }
            },
        ]
    });

    $('#btn-export-to-excel').on('click', function () {
        ExportEmployeeList()
    })

    function ExportEmployeeList() {
        let parseData = []
        export_employee_list.forEach(function (data, index) {
            let role_list = []
            data?.['role'].forEach(function (role, index) {
                role_list.push(role?.['title'])
            })

            parseData.push({
                "Mã": data?.['code'] || '',
                "Tên đầy đủ": data?.['full_name'] || '',
                "Ngày sinh": data?.['dob'] ? moment(data?.['dob'], 'YYYY-MM-DD').format('DD/MM/YYYY') : '',
                "Email": data?.['email'] || '',
                "Số điện thoại": data?.['phone'] || '',
                "Phòng ban": data?.['group']?.['title'] || '',
                "Vai trò": role_list.join(', '),
                "Ngày tham gia": data?.['date_joined'] ? moment(data?.['date_joined'], 'YYYY-MM-DD').format('DD/MM/YYYY') : '',
                "Trạng thái": data?.['is_active'] ? 'Hoạt động' : 'Không hoạt động',
                "QTV": data?.['is_admin_company'] ? 'QTV' : ''
            })
        })

        const worksheet = XLSX.utils.json_to_sheet(parseData);

        const colWidths = Object.keys(parseData[0]).map(key => {
            const maxLength = Math.max(
                key.length,
                ...parseData.map(row => String(row[key] || "").length)
            );
            return {wch: maxLength + 2};
        });
        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, "_");
        XLSX.writeFile(workbook, `employee_list_${timestamp}.xlsx`);
    }
});
