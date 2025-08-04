class AttendanceDeviceHandle {
    static $form = $('#frm_attendance_device');
    static $table = $('#table_main');

    static $transEle = $('#app-trans-factory');
    static $urlEle = $('#app-url-factory');

    static loadDtbTable() {
        if ($.fn.dataTable.isDataTable(AttendanceDeviceHandle.$table)) {
            AttendanceDeviceHandle.$table.DataTable().destroy();
        }
        AttendanceDeviceHandle.$table.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: AttendanceDeviceHandle.$urlEle.attr('data-api-attendance-device-list'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) return resp.data['attendance_device_list'] ? resp.data['attendance_device_list'] : [];
                    return [];
                },
            },
            pageLength: 5,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '5%',
                    render: (data, type, row, meta) => {
                        return `<span>${(meta.row + 1)}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '25%',
                    render: (data, type, row) => {
                        return `<span>${row?.['title']}</span>`;
                    }
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span>${row?.['device_ip']}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span>${row?.['username']}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span>${row?.['password']}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span></span>`;
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-rounded btn-flush-light flush-soft-hover btn-lg"><span class="icon"><i class="fa-solid fa-pen-to-square"></i></span></button>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
            },
            drawCallback: function () {
                AttendanceDeviceHandle.dtbHDCustom();
            },
        });
    };

    static dtbHDCustom() {
        let $table = AttendanceDeviceHandle.$table;
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
            if (!$('#btn_add').length) {
                let $group = $(`<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal" id="btn_add">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${AttendanceDeviceHandle.$transEle.attr('data-add-new')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
            }
        }
    };

    static setupDataSubmit() {
        let _form = new SetupFormSubmit(AttendanceDeviceHandle.$form);
        return {
            'title': _form.dataForm?.['title'],
            'device_ip': _form.dataForm?.['device_ip'],
            'username': _form.dataForm?.['username'],
            'password': _form.dataForm?.['password'],
        }
    };

}

$(document).ready(function () {

    AttendanceDeviceHandle.loadDtbTable();

    SetupFormSubmit.validate(AttendanceDeviceHandle.$form, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
                device_ip: {
                    required: true,
                    maxlength: 100,
                },
                username: {
                    required: true,
                    maxlength: 100,
                },
                password: {
                    required: true,
                    maxlength: 100,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

    function submitHandlerFunc() {
        WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
        $.fn.callAjax2(
            {
                'url': AttendanceDeviceHandle.$urlEle.attr('data-api-attendance-device-list'),
                'method': "POST",
                'data': AttendanceDeviceHandle.setupDataSubmit(),
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(() => {
                        AttendanceDeviceHandle.loadDtbTable();
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
    }


});