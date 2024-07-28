$(document).ready(function () {
    const main_table = $('#main-table')
    const modal_table = $('#group-allowed-table')
    const url_script = $('#url-script')
    const trans_script = $('#trans-script')

    function loadBudgetPlanConfigList() {
        if (!$.fn.DataTable.isDataTable('#main-table')) {
            main_table.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                ajax: {
                    url: url_script.attr('data-url-config-list'),
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['budget_plan_config'] ? resp.data['budget_plan_config'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `<span class="text-primary">${row?.['employee_allowed']?.['full_name']}</span>`;
                        }
                    },
                    {
                        render: (data, type, row) => {
                            let html = ''
                            for (const gr of row?.['group_allowed']) {
                                html += `<span class="w-10 mb-2 badge-sm badge badge-pill badge-soft-secondary">${gr?.['group']?.['code']}</span>
                                    <label class="w-40 ml-2 text-mute">${gr?.['group']?.['title']}</label>
                                    <div class="form-check form-switch form-check-inline ml-3 mr-3">
                                        <input type="checkbox" class="form-check-input" disabled ${gr?.['can_view'] ? 'checked' : ''}>
                                        <label class="form-check-label">${trans_script.attr('data-trans-view')}</label>
                                    </div>
                                    <div class="form-check form-switch form-check-inline ml-3">
                                        <input type="checkbox" class="form-check-input" disabled ${gr?.['can_edit'] ? 'checked' : ''}>
                                        <label class="form-check-label">${trans_script.attr('data-trans-edit')}</label>
                                    </div>
                                    <br>
                                `
                            }
                            return html;
                        }
                    },
                    {
                        className: 'text-center',
                        render: (data, type, row) => {
                            return `
                                <button type="button" data-id="${row?.['employee_allowed']?.['id']}" class="btn btn-icon btn-rounded btn-flush-danger flush-soft-hover btn-sm btn-delete-permission"><span class="icon"><i class="bi bi-trash"></i></span></button>
                            `;
                        }
                    },
                ],
            });
        }
    }
    loadBudgetPlanConfigList();

    function loadModalTable() {
        if (!$.fn.DataTable.isDataTable('#group-allowed-table')) {
            modal_table.DataTableDefault({
                dom: '',
                useDataServer: true,
                rowIdx: true,
                paging: false,
                ajax: {
                    url: url_script.attr('data-url-group-list'),
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['group_list'] ? resp.data['group_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-55',
                        render: (data, type, row) => {
                            return `
                                <span data-id="${row?.['id']}" class="group_select badge badge-pill badge-soft-primary w-20 mr-1">${row?.['code']}</span><label class="text-primary">${row?.['title']}</label>
                            `;
                        }
                    },
                    {
                        className: 'text-center w-20',
                        render: (data, type, row) => {
                            return `
                                <div class="form-check form-switch mb-1">
                                    <input type="checkbox" class="form-check-input can-view">
                                    <label class="form-check-label"></label>
                                </div>
                            `;
                        }
                    },
                    {
                        className: 'text-center w-20',
                        render: () => {
                            return `
                                <div class="form-check form-switch mb-1">
                                    <input type="checkbox" class="form-check-input can-edit">
                                    <label class="form-check-label"></label>
                                </div>
                            `;
                        }
                    },
                ],
            });
        }
    }
    loadModalTable();

    // Can view company budget plan

    function loadModalTableCanViewCompanyBudgetPlan(data_selected=[]) {
        if (!$.fn.DataTable.isDataTable('#can-view-company-table')) {
            $('#can-view-company-table').DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                paging: false,
                ajax: {
                    url: url_script.attr('data-url-emp-list'),
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['employee_list'] ? resp.data['employee_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-20 text-center',
                        render: (data, type, row) => {
                            return `<span class="badge badge-pill badge-soft-primary w-80">${row?.['code']}</span>`;
                        }
                    },
                    {
                        className: 'w-45',
                        render: (data, type, row) => {
                            return `<span class="text-primary">${row?.['full_name']}</span>`;
                        }
                    },
                    {
                        className: 'text-center w-30',
                        render: (data, type, row) => {
                            let checked = data_selected.includes(row?.['id']) ? 'checked' : ''
                            return `
                                <div class="form-check form-switch mb-1">
                                    <input data-id="${row?.['id']}" ${checked} type="checkbox" class="form-check-input can-view-company">
                                    <label class="form-check-label"></label>
                                </div>
                            `;
                        }
                    },
                ],
            });
        }
    }

    function loadEmpCanViewCompanyBP() {
        let dataParam = {}
        let url_loaded = $.fn.callAjax2({
            url: url_script.attr('data-url-emp-list-can-view-company-bp'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('list_can_view_company_budget_plan')) {
                    return data?.['list_can_view_company_budget_plan'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([url_loaded]).then(
            (resp) => {
                let emp_id_list_can_view = []
                for (const emp of resp[0]) {
                    emp_id_list_can_view.push(emp?.['employee_allowed']?.['id'])
                }
                loadModalTableCanViewCompanyBudgetPlan(emp_id_list_can_view);
            }
        )
    }

    $('#can-view-company-btn').on('click', function () {
        loadEmpCanViewCompanyBP()
    })

    $('#save-can-view-company').on('click', function () {
        let emp_id_can_view_company_bp = []
        $('#can-view-company-table tbody tr').each(function () {
            if ($(this).find('.can-view-company').prop('checked')) {
                emp_id_can_view_company_bp.push($(this).find('.can-view-company').attr('data-id'))
            }
        })

        WindowControl.showLoading();
        let ajaxSetup = {
            url: url_script.attr('data-url-config-list'),
            method: 'GET',
            data: {
                'emp_id_can_view_company_bp': JSON.stringify(emp_id_can_view_company_bp)
            },
        }
        $.fn.callAjax2(ajaxSetup).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: 'Update successfully!'}, 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000)
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
            })
    })

    // Can lock budget plan

    function loadModalTableCanLockBudgetPlan(data_selected=[]) {
        if (!$.fn.DataTable.isDataTable('#can-lock-bp-table')) {
            $('#can-lock-bp-table').DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                paging: false,
                ajax: {
                    url: url_script.attr('data-url-emp-list'),
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['employee_list'] ? resp.data['employee_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-20 text-center',
                        render: (data, type, row) => {
                            return `<span class="badge badge-pill badge-soft-primary w-80">${row?.['code']}</span>`;
                        }
                    },
                    {
                        className: 'w-45',
                        render: (data, type, row) => {
                            return `<span class="text-primary">${row?.['full_name']}</span>`;
                        }
                    },
                    {
                        className: 'text-center w-30',
                        render: (data, type, row) => {
                            let checked = data_selected.includes(row?.['id']) ? 'checked' : ''
                            return `
                                <div class="form-check form-switch mb-1">
                                    <input data-id="${row?.['id']}" ${checked} type="checkbox" class="form-check-input can-lock-bp">
                                    <label class="form-check-label"></label>
                                </div>
                            `;
                        }
                    },
                ],
            });
        }
    }

    function loadEmpCanLockBP() {
        let dataParam = {}
        let url_loaded = $.fn.callAjax2({
            url: url_script.attr('data-url-emp-list-can-lock-bp'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('list_can_lock_budget_plan')) {
                    return data?.['list_can_lock_budget_plan'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([url_loaded]).then(
            (resp) => {
                let emp_id_list_can_lock = []
                for (const emp of resp[0]) {
                    emp_id_list_can_lock.push(emp?.['employee_allowed']?.['id'])
                }
                loadModalTableCanLockBudgetPlan(emp_id_list_can_lock);
            }
        )
    }

    $('#can-lock-bp-btn').on('click', function () {
        loadEmpCanLockBP()
    })

    $('#save-can-lock-bp').on('click', function () {
        let emp_id_can_lock_bp = []
        $('#can-lock-bp-table tbody tr').each(function () {
            if ($(this).find('.can-lock-bp').prop('checked')) {
                emp_id_can_lock_bp.push($(this).find('.can-lock-bp').attr('data-id'))
            }
        })

        WindowControl.showLoading();
        let ajaxSetup = {
            url: url_script.attr('data-url-config-list'),
            method: 'GET',
            data: {
                'emp_id_can_lock_bp': JSON.stringify(emp_id_can_lock_bp)
            },
        }
        $.fn.callAjax2(ajaxSetup).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: 'Update successfully!'}, 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000)
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
            })
    })

    function LoadEmp(ele, data) {
        ele.initSelect2({
            allowClear: true,
            ajax: {
                url: url_script.attr('data-url-employee-list'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        })
    }
    LoadEmp($('#select-allowed-person'))

    function LoadGroup(ele, data) {
        ele.initSelect2({
            allowClear: true,
            ajax: {
                url: url_script.attr('data-url-group-list'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'group_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    LoadGroup($('#select-group'))

    function combinesDataConfig(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        let employee_allowed_id = $('#select-allowed-person').val()
        let group_allowed_list = []
        modal_table.find('tbody tr').each(function () {
            group_allowed_list.push({
                'group_allowed_id': $(this).find('.group_select').attr('data-id'),
                'can_view': $(this).find('.can-view').prop('checked'),
                'can_edit': $(this).find('.can-edit').prop('checked')
            })
        })
        frm.dataForm['employee_allowed'] = employee_allowed_id
        frm.dataForm['group_allowed_list'] = group_allowed_list

        console.log(frm)
        return {
            url: frmEle.attr('data-url'),
            method: frmEle.attr('data-method'),
            data: frm.dataForm,
            urlRedirect: frmEle.attr('data-url-redirect')
        };
    }

    $(`#form-config-budget-plan`).submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataConfig($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace(url_script.attr('data-url-redirect'));
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
        }
    })

    $(document).on("click", '.btn-delete-permission', function () {
        let delete_employee_allowed_id = $(this).attr('data-id')
        Swal.fire({
            html:
                `<p class="text-secondary mt-3">Confirm delete this employee's permission?</p>`,
            customClass: {
                confirmButton: 'btn btn-outline-danger text-danger',
                cancelButton: 'btn btn-outline-secondary text-secondary',
                container: 'swal2-has-bg',
                actions: 'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            reverseButtons: false
        }).then((result) => {
            if (result.value) {
                WindowControl.showLoading();
                let ajaxSetup = {
                    url: url_script.attr('data-url-config-list'),
                    method: 'GET',
                    data: {
                        'delete_employee_allowed_id': delete_employee_allowed_id
                    },
                }
                $.fn.callAjax2(ajaxSetup).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: 'Convert to a new Contact successfully!'}, 'success');
                            setTimeout(() => {
                                location.reload();
                            }, 1000)
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
                    })
            }
        })
    })
});