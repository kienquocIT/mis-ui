$(function () {
    const msgLinkedEmployee = $('#notify-employee-mapped-text').text();
    const msgNoLinked = $('#notify-employee-not-mapped-text').text();

    // INIT DATA
    const company_list = JSON.parse($('#id-company-list').text());
    const company_dict = company_list.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});

    //
    let tblUserOfTenant = $('#tbl-user-of-tenant');

    // FUNCTION SUPPORT LOAD
    function setUserCompaniesData(rowData) {
        let idSelected = [];
        let userCompanyHTML = "";
        $('#userPersonFullname').text(rowData['full_name']).attr('data-id', rowData['id']);

        rowData['company_list'].map((item) => {
            let mapped_employee = (
                rowData['employee_mapped'][item] !== undefined &&
                rowData['employee_mapped'][item] !== null &&
                rowData['employee_mapped'][item] !== 'None'
            ) ? [`<i class="fas fa-user-check i-blue"></i>`, msgLinkedEmployee] : [`<i class="fas fa-user-times i-red"></i>`, msgNoLinked];
            idSelected.push(company_dict[item].id);
            userCompanyHTML += `<li class="{0}" data-id="{1}" data-bs-toggle="tooltip" data-bs-placement="bottom" title="{2}">{3}{4}</li>`.format_by_idx(
                'list-group-item d-flex justify-content-between align-items-center',
                company_dict[item].id,
                mapped_employee[1],
                company_dict[item].title,
                mapped_employee[0],
            );
        });
        $('#company_list_choose').val(null).val(idSelected).trigger('change');
        $('#userCompaniesExist').html(userCompanyHTML);
    }

    // FUNCTION LOAD DATA
    function load_company_list_overview() {
        if (!$.fn.DataTable.isDataTable('#datable_company_overview_list')) {
            let dtb = $('#datable_company_overview_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['company_list'] ? resp.data['company_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        render: (data, type, row, meta) => {
                            return ''
                        }
                    },
                    {
                        data: 'code',
                        width: '10%',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<a href="{0}"><span class="badge badge-soft-primary">{1}</span></a>`.format_by_idx(
                                frm.getUrlDetail(row.id), data
                            )
                        }
                    },
                    {
                        data: 'title',
                        width: '25%',
                        className: 'wrap-text',
                    },
                    {
                        data: 'license_used',
                        class: 'wrap-text',
                        width: '35%',
                        render: (data, type, row, meta) => {
                            let arr_html = [];
                            for (let i = 0; i < data.length; i++) if (typeof data[i] === 'object') arr_html += `<span class="badge badge-primary my-1">` + data[i].key + ` (` + data[i].quantity + `)` + `</span> `;
                            return arr_html;
                        }
                    },
                    {
                        data: 'total_user',
                        width: '10%',
                        render: (data, type, row, meta) => {
                            return String.format(`<span class="badge badge-soft-success w-50">{0}</span>`, data)
                        }
                    },
                    {
                        data: 'power_user',
                        width: '10%',
                        render: (data, type, row, meta) => {
                            return String.format(`<span class="badge badge-soft-warning w-50">{0}</span>`, data)
                        }
                    },
                    {
                        data: 'employee_linked_user',
                        width: '10%',
                        render: (data, type, row, meta) => {
                            return String.format(`<span class="badge badge-soft-indigo w-100">{0} / {1}</span>`, row['employee_linked_user'], row['employee'],)
                        }
                    },
                ],
                footerCallback: function (row, data, start, end, display) {
                    // id: 4 = sum user
                    $(this.api().column(4).footer()).html(
                        '<span class="badge badge-success w-50">{0}</span>'.format_by_idx(
                            UtilControl.sumArray(
                                this.api().column(4, {page: 'current'}).data()
                            )
                        )
                    );
                    // id: 5 = power user
                    $(this.api().column(5).footer()).html(
                        '<span class="badge badge-warning w-50">{0}</span>'.format_by_idx(
                            UtilControl.sumArray(
                                this.api().column(5, {page: 'current'}).data()
                            )
                        )
                    );
                    // id: 6 = employee_linked/total_employee
                    let employee_linked = 0;
                    let employee_total = 0;
                    this.api().rows().every(function () {
                        employee_linked += parseFloat(this.data()['employee_linked_user']);
                        employee_total += parseFloat(this.data()['employee']);
                    });
                    $(this.api().column(6).footer()).html(
                        '<span class="badge badge-indigo w-100">{0} / {1}</span>'.format_by_idx(
                            employee_linked, employee_total
                        )
                    );
                },
            });
        }
    }

    function load_user_of_tenant() {
        if (!$.fn.DataTable.isDataTable('#tbl-user-of-tenant')) {
            let frm_user_tenant = new SetupFormSubmit(tblUserOfTenant);
            tblUserOfTenant.DataTableDefault({
                ajax: {
                    url: frm_user_tenant.dataUrl,
                    type: frm_user_tenant.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('user_list')) {
                            return resp.data['user_list'] ? resp.data['user_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        render: (data, type, row, meta) => {
                            return ''
                        }
                    }, {
                        render: (data, type, row, meta) => {
                            return `<a href="{0}">{1}</a>`.format_by_idx(frm_user_tenant.dataUrlDetail + row.id, row.username,);
                        }
                    }, {
                        render: (data, type, row, meta) => {
                            let html_row = `<div class="{0}">{1}</div>`
                            if (row.avatar) return html_row.format_by_idx("avatar", `<img src="{0}" alt="user" class="avatar-img">`.format_by_idx(row.avatar));
                            return html_row.format_by_idx('avatar avatar-xs avatar-primary avatar-rounded', `<span class="initial-wrap">{0}</span>`.format_by_idx(row.full_name.split(' ').map(item => item.charAt(0)).join(""),),) + ` <span>{0}</span>`.format_by_idx(row.full_name);
                        }
                    }, {
                        data: 'company_list',
                        render: (data, type, row, meta) => {
                            if (Array.isArray(data)) {
                                let resultData = data.reduce((array_company, item) => {
                                    let mapped_employee = (
                                        row['employee_mapped'][item] !== undefined &&
                                        row['employee_mapped'][item] !== null &&
                                        row['employee_mapped'][item] !== 'None'
                                    ) ? [`<i class="fas fa-user-check i-blue"></i>`, msgLinkedEmployee] : [`<i class="fas fa-user-times i-red"></i>`, msgNoLinked];
                                    array_company.push(
                                        `<li class="list-group-item d-flex justify-content-between align-items-center" data-bs-toggle="tooltip" data-bs-placement="bottom" title="` +
                                        mapped_employee[1] + `">` +
                                        company_dict[item]['title'] +
                                        mapped_employee[0] +
                                        `</li>`
                                    )

                                    return array_company;
                                }, []);
                                return `<ul class="list-group">` + resultData.join("") + `</ul>`;
                            }
                            return '';
                        }
                    }, {
                        render: (data, type, row, meta) => {
                            return `<button class="btn btn-icon btn-rounded btn-rounded btn-flush-primary flush-soft-hover btn-edit-popup" data-bs-toggle="modal" data-bs-target="#changeUserCompanies"><span class="icon"><i class="far fa-edit" ></i></span></button>`;
                        }
                    },
                ]
            });
        }
    }

    function load_employee_company() {
        if (!$.fn.DataTable.isDataTable('#dttEmployeeOfCompany')) {
            let tbl = $('#dttEmployeeOfCompany');
            let frm = new SetupFormSubmit(tbl);
            tbl.DataTableDefault(
                {
                    useDataServer: true,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        data: function (d) {
                            let companyIdSelected = $('#chooseCompanyPage').val();
                            if (companyIdSelected) {
                                d.company_id = companyIdSelected;
                                let stateUser = $('#chooseStateUser').val();
                                console.log(companyIdSelected, stateUser);
                                switch (stateUser) {
                                    case 'all':
                                        break
                                    case 'linked':
                                        d.user_is_null = false
                                        break
                                    case 'not-linked':
                                        d.user_is_null = true
                                        break
                                }
                            } else {
                                // console.log('Company ID must be required.');
                                // $.fn.notifyB({
                                //     description: 'Company ID must be required.'
                                // }, 'warning');
                            }
                            return d;
                        },
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('employee_list')) {
                                return resp.data['employee_list'] ? resp.data['employee_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: [
                        {
                            render: (data, type, row, meta) => {
                                return '';
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<h6><a href="{0}">{1}</a> <span class="{2}"></span></h6>`.format_by_idx(
                                    frm.getUrlDetail(row.id),
                                    data,
                                    row['is_active'] ? "badge badge-info badge-indicator" : "badge badge-light badge-indicator"
                                )
                            }
                        },
                        {
                            data: 'full_name',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<div class="avatar avatar-xs  avatar-primary avatar-rounded mr-1"><span class="initial-wrap">{0}</span></div>{1}`.format_by_idx(
                                    $.fn.shortName(data),
                                    data
                                )
                            }
                        },
                        {
                            data: 'user',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                if (data['full_name']) {
                                    return `<div class="avatar avatar-xs  avatar-primary avatar-rounded mr-1"><span class="initial-wrap">{0}</span></div>{1}`.format_by_idx(
                                        $.fn.shortName(data['full_name']),
                                        data['full_name']
                                    )
                                }
                                return `<i class="fas fa-user-times i-red"></i>`;
                            }
                        },
                        {
                            data: 'license',
                            render: (data, type, row, meta) => {
                                return data.reduce((html, currentData) => {
                                    return html += `<span class="badge badge-soft-{0} mr-1 mb-1" data-id="{1}" data-code="{2}">{3}</span>`.format_by_idx(
                                        DocumentControl.classOfPlan(currentData.code),
                                        currentData.id,
                                        currentData.code,
                                        currentData.title,
                                    )
                                }, "")
                            }
                        },
                    ],
                },
            );
        }
    }

    $('.nav-tabs a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        switch ($(e.target).attr('href')) {
            case '#tab_block_overview':
                load_company_list_overview();
                break
            case '#tab_block_tenant':
                load_user_of_tenant();
                break
            case '#tab_block_company':
                load_employee_company();
                break
            default:
                load_company_list_overview();
        }
    });

    tblUserOfTenant.on('click', '.btn-edit-popup', function () {
        let data = $('#tbl-user-of-tenant').DataTable();
        if (data !== undefined) {
            setUserCompaniesData(
                data.row($(this).closest('tr')).data()
            );
        }
    });

    $('#modalUserUpdate').submit(function (event) {
        // loading spinner is active
        $(this).find('.group-action-footer').addClass('hidden');
        $(this).find('.loading-spinner').removeClass('hidden');
        event.preventDefault();

        let frm = new SetupFormSubmit($(this));
        let companiesOld = [];
        $('#userCompaniesExist li').each((idx, item) => {
            companiesOld.push($(item).data('id'));
        });
        let companiesNew = $('#company_list_choose').val();
        if (UtilControl.arraysEqual(companiesOld, companiesNew) === false) {
            $.fn.callAjax(
                frm.dataUrlDetail + $('#userPersonFullname').attr('data-id'),
                frm.dataMethod,
                {'companies': companiesNew},
                $(this).find("input[name=csrfmiddlewaretoken]").first().val(),
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    $.fn.notifyB(
                        {description: data.detail},
                        'success',
                    );
                    setTimeout(
                        () => {
                            location.reload();
                        },
                        1000,
                    )
                },
            )
        }
    })

    $(document).ready(function () {
        // FINAL CALL LOAD
        let arr_href = window.location.href.split("#");
        let tab_id = arr_href[arr_href.length - 1];
        let item_active = $('.nav-tabs').find(`a[href='#` + tab_id + `']`);
        if (item_active.length <= 0) item_active = $('.nav-tabs a').first();
        $(item_active[0]).click();
    })
});
