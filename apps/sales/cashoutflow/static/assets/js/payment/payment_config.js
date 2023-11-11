$(document).ready(function () {
    let tableSelectedEmployees = $('#table-selected-employees')
    let tableSelectEmployees = $('#table-select-employees')

    function LoadTableSelectedEmployees() {
        tableSelectedEmployees.DataTableDefault({
            dom: '',
            scrollY: true,
            paging: false,
            useDataServer: true,
            ajax: {
                url: tableSelectedEmployees.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.data['payment_config_list']) {
                                return resp.data['payment_config_list'];
                            } else {
                                return [];
                            }
                        }
                        return [];
                    }
                },
            columns: [
                    {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span data-id="${row.employee_allowed.id}" class="badge badge-primary code">${row.employee_allowed.code}</span>`
                        }
                    },
                    {
                        data: 'full_name',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="full_name">${row.employee_allowed.full_name}</span>`
                        }
                    },
                ],
        });
    }
    LoadTableSelectedEmployees()

    function LoadTableSelectEmployees() {
        tableSelectEmployees.DataTableDefault({
            dom: '',
            rowIdx: true,
            scrollY: true,
            paging: false,
            useDataServer: true,
            ajax: {
                url: tableSelectEmployees.attr('data-url'),
                type: tableSelectEmployees.attr('data-method'),
                dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.data['employee_list']) {
                                return resp.data['employee_list'];
                            } else {
                                return [];
                            }
                        }
                        return [];
                    }
                },
            columns: [
                    {
                        render: (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="badge badge-soft-primary badge-outline code">${row.code}</span>`
                        }
                    },
                    {
                        data: 'full_name',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="full_name">${row.full_name}</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let flag = ''
                            tableSelectedEmployees.find('tbody tr').each(function () {
                                let item = $(this).find('.code');
                                let employee_id = item.attr('data-id');
                                console.log(employee_id === row.id)
                                if (employee_id === row.id) {
                                    flag = 'checked'
                                }
                            })
                            return `<span class="form-check">
                                        <input data-id="${row.id}" ${flag} type="checkbox" class="form-check-input employees-checkbox">
                                        <label class="form-check-label"></label>
                                    </span>`
                        }
                    }
                ],
        });
    }
    LoadTableSelectEmployees()

    let selectEmployeesBtn = $('#btn-select-employees')
    selectEmployeesBtn.on('click', function () {
        let selected_employees = []
        tableSelectedEmployees.find('tbody').html('');
        tableSelectEmployees.find('tbody tr').each(function () {
            let select_box = $(this).find('.employees-checkbox');
            if (select_box.is(':checked')) {
                let employee_id = select_box.attr('data-id');
                let employee_code = select_box.closest('tr').find('.code').text();
                let employee_full_name = select_box.closest('tr').find('.full_name').text();
                selected_employees.push({
                    'id': employee_id,
                    'code': employee_code,
                    'full_name': employee_full_name
                })
            }
        })
        for (let i = 0; i < selected_employees.length; i++) {
            tableSelectedEmployees.find('tbody').append(`
                <tr class="bg-primary-light-5">
                    <td><span data-id="${selected_employees[i].id}" class="badge badge-primary code">${selected_employees[i].code}</span></td>
                    <td>${selected_employees[i].full_name}</td>
                </tr>
            `)
        }
    })

    let selectAllEmployeeBtn = $('#selected-all-employees')
    selectAllEmployeeBtn.on('click', function () {
        if ($(this).is(':checked')) {
            document.querySelectorAll('.employees-checkbox').forEach(function (element) {
                element.checked = true;
            })
        }
        else {
            document.querySelectorAll('.employees-checkbox').forEach(function (element) {
                element.checked = false;
            })
        }
    })

    $('#save-payment-config').on('click', function () {
        let employees_allowed_list = [];
        tableSelectedEmployees.find('tbody tr').each(function () {
            let item = $(this).find('.code');
            let employee_id = item.attr('data-id');
            if (employee_id !== null) {
                employees_allowed_list.push(employee_id)
            }
        })
        WindowControl.showLoading();
        $.fn.callAjax2({
            url: tableSelectedEmployees.attr('data-url'),
            method: tableSelectedEmployees.attr('data-method'),
            data: {
                'employees_allowed_list': employees_allowed_list
            },
            urlRedirect: tableSelectedEmployees.attr('data-url-redirect'),
        })
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        setTimeout(() => {
                            window.location.replace(tableSelectedEmployees.attr('data-url-redirect'));
                            location.reload.bind(location);
                        }, 1000);
                    }
                },
                (errs) => {
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                        },
                        1000
                    )
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    })
})