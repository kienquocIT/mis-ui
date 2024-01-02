$(function () {
    $(document).ready(function () {
        let frm = $('#frm_group_create');
        let dataGroupEmployee = $('#data-group_employee');
        GroupLoadDataHandle.loadDataCommon(frm);

        $(document).on('change', '#select-box-group-level', function () {
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx($(this), $(this).val());
                if (dataSelected) {
                    $('#reference-group-title').val(dataSelected.description);
                    $('#first-manager-system-title').val(dataSelected.first_manager_description);
                    $('#second-manager-system-title').val(dataSelected.second_manager_description);
                    GroupLoadDataHandle.loadGroupParentList({}, dataSelected.level);
                }
            }
        });

        $('#button-add-group-employee').on('click', function() {
            GroupLoadDataHandle.loadDataEmployeeShow();
        });

        $('#datable_employee_show_list').on('click', '.del-row', function() {
            deleteEmployeeShow(this.id);
        });

        frm.submit(function (e) {
            e.preventDefault();
            let frm = new SetupFormSubmit($(this));
            if (dataGroupEmployee.val()) {
                frm.dataForm['group_employee'] = JSON.parse(dataGroupEmployee.val());
            }
            if (GroupLoadDataHandle.box1stManager.val()) {
                frm.dataForm['first_manager'] = GroupLoadDataHandle.box1stManager.val();
            } else {
                frm.dataForm['first_manager'] = null;
            }
            if (GroupLoadDataHandle.box2ndManager.val()) {
                frm.dataForm['second_manager'] = GroupLoadDataHandle.box2ndManager.val();
            } else {
                frm.dataForm['second_manager'] = null;
            }
            if (frm.dataForm) {
                for (let key in frm.dataForm) {
                    if (frm.dataForm[key] === '') {
                        delete frm.dataForm[key]
                    }
                }
            }
            $.fn.callAjax2(
                {
                    'url': frm.dataUrl,
                    'method': frm.dataMethod,
                    'data': frm.dataForm,
                }
            ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && (data['status'] === 201 || data['status'] === 200)) {
                            $.fn.notifyB({description: data.message}, 'success');
                            setTimeout(() => {
                                window.location.replace(frm.dataUrlRedirect);
                            }, 1000);
                        }
                    }, (err) => {
                        setTimeout(() => {
                            WindowControl.hideLoading();
                        }, 1000)
                        $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                    }
                )
        });
    });
});