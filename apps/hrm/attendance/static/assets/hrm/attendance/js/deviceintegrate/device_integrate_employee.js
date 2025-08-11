class DIEmployeeHandle {
    static $table = $('#table_main');

    static $transEle = $('#app-trans-factory');
    static $urlEle = $('#app-url-factory');

    static callRefresh() {
        WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
        $.fn.callAjax2(
            {
                'url': DIEmployeeHandle.$urlEle.attr('data-api-device-integrate-employee-list'),
                'method': "POST",
                'data': {},
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(() => {
                        DIEmployeeHandle.loadDtbTable();
                        WindowControl.hideLoading();
                    }, 2000);
                }
            }, (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            }
        )
    };

    static callSave(id, employee) {
        WindowControl.showLoading();
        $.fn.callAjax2(
            {
                'url': DIEmployeeHandle.$urlEle.attr('data-api-detail-integrate-employee').format_url_with_uuid(id),
                'method': 'PUT',
                'data': {'employee': employee},
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(() => {
                        DIEmployeeHandle.loadDtbTable();
                        WindowControl.hideLoading();
                    }, 2000);
                }
            }, (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            }
        )
        return true;
    };

    static loadDtbTable() {
        if ($.fn.dataTable.isDataTable(DIEmployeeHandle.$table)) {
            DIEmployeeHandle.$table.DataTable().destroy();
        }
        DIEmployeeHandle.$table.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: DIEmployeeHandle.$urlEle.attr('data-api-device-integrate-employee-list'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) return resp.data['device_integrate_employee_list'] ? resp.data['device_integrate_employee_list'] : [];
                    return [];
                },
            },
            pageLength: 5,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '10%',
                    render: (data, type, row, meta) => {
                        return `<span>${(meta.row + 1)}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '30%',
                    render: () => {
                        return `<select
                                        class="form-select table-row-employee"
                                        data-url="${DIEmployeeHandle.$urlEle.attr('data-api-dd-employee-list')}"
                                        data-method="GET"
                                        data-keyResp="employee_list"
                                        data-keyText="full_name"
                                ></select>`;
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span>${row?.['device_employee_id']}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '30%',
                    render: (data, type, row) => {
                        return `<span>${row?.['device_employee_name']}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-primary table-row-save">
                                    <span>
                                        <span class="icon">
                                            <i class="fa-solid fa-floppy-disk"></i>
                                        </span>
                                        <span>${$.fn.transEle.attr('data-save')}</span>
                                    </span>
                                </button>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let employeeEle = row.querySelector('.table-row-employee');
                if (employeeEle) {
                    FormElementControl.loadInitS2($(employeeEle));
                    if (data?.['employee']?.['id']) {
                        FormElementControl.loadInitS2($(employeeEle), [data?.['employee']]);
                    }
                }
            },
            drawCallback: function () {
                DIEmployeeHandle.dtbHDCustom();
            },
        });
    };

    static dtbHDCustom() {
        let $table = DIEmployeeHandle.$table;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn_refresh').length) {
                let $group = $(`<button type="button" class="btn btn-primary" id="btn_refresh">
                                    <span><span class="icon"><i class="fas fa-redo-alt"></i></span><span>${DIEmployeeHandle.$transEle.attr('data-refresh')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn_refresh').on('click', function () {
                    DIEmployeeHandle.callRefresh();
                });
            }
        }
    };
}

$(document).ready(function () {

    DIEmployeeHandle.loadDtbTable();

    DIEmployeeHandle.$table.on('click', '.table-row-save', function () {
        let row = this.closest('tr');
        if (row) {
            let rowIndex = DIEmployeeHandle.$table.DataTable().row(row).index();
            let $row = DIEmployeeHandle.$table.DataTable().row(rowIndex);
            let dataRow = $row.data();
            let employeeEle = row.querySelector('.table-row-employee');
            if (employeeEle) {
                if ($(employeeEle).val()) {
                    DIEmployeeHandle.callSave(dataRow?.['id'], $(employeeEle).val());
                }
            }
        }
    })

});