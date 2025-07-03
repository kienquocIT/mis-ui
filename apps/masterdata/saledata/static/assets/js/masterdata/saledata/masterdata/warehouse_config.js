$(document).ready(function () {
    const main_table = $('#warehouse-interact-config-table');
    const select_emp = $('#emp-name-select')
    const equipment_loan_virtual_warehouse = $('#equipment-loan-virtual-warehouse')
    const wh_list_table = $('#wh_list_table')

    const virtual_warehouse_list_script = $('#virtual_warehouse_list')
    const virtual_warehouse_list = virtual_warehouse_list_script.text() ? JSON.parse(virtual_warehouse_list_script.text()) : {};

    function LoadMainTable() {
        main_table.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(main_table);
        main_table.DataTableDefault(
            {
                styleDom: 'hide-foot',
                rowIdx: true,
                useDataServer: true,
                reloadCurrency: true,
                paging: false,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('warehouse_interact_config_list')) {
                            return resp.data['warehouse_interact_config_list'] ? resp.data['warehouse_interact_config_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        render: (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `<span class="badge badge-sm badge-soft-primary">${row?.['employee']?.['code']}</span> <span>${row?.['employee']?.['fullname']}</span>`;
                        }
                    },
                    {
                        render: (data, type, row) => {
                            let html = ``
                            for (const item of row?.['warehouse_list']) {
                                html += `<span class="badge badge-sm badge-secondary">${item?.['code']}</span> <span>${item?.['title']}</span><br>`
                            }
                            return html;
                        }
                    },
                    {
                        className: 'text-center',
                        render: (data, type, row) => {
                            return `<a class="btn btn-icon btn-flush-secondary btn-rounded flush-soft-hover delete-btn" title="Delete" href="#" data-id="${row?.['id']}" data-action="delete">
                                        <span class="icon-wrap">
                                            <i class="fa-regular fa-trash-can"></i>
                                        </span>
                                    </a>`;
                        }
                    },
                ],
            },
        );
    }
    LoadMainTable()

    function LoadEmp(data) {
        select_emp.initSelect2({
            allowClear: true,
            ajax: {
                url: select_emp.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            templateResult: function(data) {
                let ele = $('<div class="row col-12"></div>');
                ele.append('<div class="col-8">' + data.data?.['full_name'] + '</div>');
                if (data.data?.['group']?.['title'] !== undefined) {
                    ele.append('<div class="col-4">(' + data.data?.['group']['title'] + ')</div>');
                }
                return ele;
            },
            data: (data ? data : null),
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        })
    }
    LoadEmp()

    function LoadVirtualWarehouse(data) {
        equipment_loan_virtual_warehouse.initSelect2({
            allowClear: true,
            ajax: {
                url: equipment_loan_virtual_warehouse.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'warehouse_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    LoadVirtualWarehouse(virtual_warehouse_list.filter((item) => {return item?.['use_for'] === 1}))
    console.log(virtual_warehouse_list)

    function LoadWarehouseTable() {
        wh_list_table.DataTable().clear().destroy()
        wh_list_table.DataTableDefault(
            {
                styleDom: 'hide-foot',
                rowIdx: true,
                useDataServer: true,
                reloadCurrency: true,
                paging: false,
                ajax: {
                    url: wh_list_table.attr('data-url'),
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('warehouse_list')) {
                            return resp.data['warehouse_list'] ? resp.data['warehouse_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        render: (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `<div class="form-check">
                                        <input checked type="checkbox" class="form-check-input select-wh" id="${row?.['id']}">
                                    </div>`;
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `<span class="badge badge-sm badge-secondary">${row?.['code']}</span> <span>${row?.['title']}</span>`;
                        }
                    },
                    {
                        render: (data, type, row) => {
                            return `<span>${row?.['full_address']}</span>`;
                        }
                    },
                ],
            },
        );
    }
    LoadWarehouseTable()

    $(document).on("click", '.delete-btn', function (event) {
        Swal.fire({
            html:
            '<div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div><h5 class="text-danger">Delete Config ?</h5>',
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-danger',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container:'swal2-has-bg',
                actions:'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                $.fn.callAjax2({
                    'url': SetupFormSubmit.getUrlDetailWithID(main_table.attr('data-url-detail'), $(this).attr('data-id')),
                    'method': 'DELETE',
                })
                    .then(
                    (resp)=>{
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        }
                    },
                    (errs)=> {
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
    })

    function combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        let warehouse_list = []
        wh_list_table.find('tbody tr .select-wh').each(function() {
            if ($(this).prop('checked')) {
                warehouse_list.push($(this).attr('id'))
            }
        })
        frm.dataForm['warehouse_list'] = warehouse_list;
        frm.dataForm['employee'] = select_emp.val();

        if (for_update) {
            let pk = $.fn.getPkDetail();
            return {
                url: frmEle.attr('data-url-detail').format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-warehouse-interact-config').submit(function (event) {
        event.preventDefault();
        let data = combinesData($(this));
        if (data) {
            WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
            $.fn.callAjax2(data)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
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

    equipment_loan_virtual_warehouse.on('change', function () {
        $.fn.callAjax2({
            'url': equipment_loan_virtual_warehouse.val() ? equipment_loan_virtual_warehouse.attr('data-url-update') + `?use_for=1&warehouse_id=${equipment_loan_virtual_warehouse.val()}` : equipment_loan_virtual_warehouse.attr('data-url-update') + `?use_for=1`,
            'method': 'GET'
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.notifyB({description: "Successfully"}, 'success')
            }
        })
    })
});