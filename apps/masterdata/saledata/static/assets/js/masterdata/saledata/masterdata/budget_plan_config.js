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
                            console.log(resp.data['budget_plan_config'])
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
                                html += `<span class="w-20 mb-2 badge badge-pill badge-soft-primary">${gr?.['group']?.['code']}</span>
                                    <label class="w-40 ml-2">${gr?.['group']?.['title']}</label>
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
                        render: () => {
                            return `
                                <button type="button" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-sm"><span class="icon"><i class="bi bi-pencil-square"></i></span></button>
                                <button type="button" class="btn btn-icon btn-rounded btn-flush-danger flush-soft-hover btn-sm"><span class="icon"><i class="bi bi-trash"></i></span></button>
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
});