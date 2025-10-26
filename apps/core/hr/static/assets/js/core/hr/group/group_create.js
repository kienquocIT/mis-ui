$(function () {
    $(document).ready(function () {
        GroupLoadDataHandle.loadInit();

        GroupLoadDataHandle.$form.on('input', '.alphanumeric', function () {
            GroupLoadDataHandle.loadUpperAlphanumeric(this);
        });

        GroupLoadDataHandle.boxGroupLevel.on('change', function () {
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx($(this), $(this).val());
                if (dataSelected) {
                    $('#reference-group-title').val(dataSelected?.['description'] ? dataSelected?.['description'] : "");
                    $('#first-manager-system-title').val(dataSelected?.['first_manager_description'] ? dataSelected?.['first_manager_description'] : "");
                    $('#second-manager-system-title').val(dataSelected?.['second_manager_description'] ? dataSelected?.['second_manager_description'] : "");
                    if (dataSelected?.['level']) {
                        GroupLoadDataHandle.loadInitS2(GroupLoadDataHandle.boxGroupParent, [], {'group_level__level__lt': parseInt(dataSelected?.['level'])});
                    }
                }
            }
        });

        GroupLoadDataHandle.$tblEmp.on('click', '.table-row-checkbox', function() {
            GroupLoadDataHandle.loadStoreCheckEmployee(this);
        });

        $('#button-add-group-employee').on('click', function() {
            GroupLoadDataHandle.loadDataEmployeeShow();
        });

        GroupLoadDataHandle.$tblEmpShow.on('click', '.del-row', function() {
            deleteEmployeeShow(this.closest('tr'), GroupLoadDataHandle.$tblEmpShow);
            reOrderSTTEmployeeShow(GroupLoadDataHandle.$tblEmpShow);
            GroupLoadDataHandle.loadStoreSEmployee();
        });

        SetupFormSubmit.validate(GroupLoadDataHandle.$form, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
                code: {
                    required: true,
                    maxlength: 100,
                },
                group_level: {
                    required: true,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

        function submitHandlerFunc() {
            let _form = new SetupFormSubmit(GroupLoadDataHandle.$form);
            if (GroupLoadDataHandle.$eleGrEmp.val()) {
                _form.dataForm['group_employee'] = JSON.parse(GroupLoadDataHandle.$eleGrEmp.val());
            }
            if (GroupLoadDataHandle.box1stManager.val()) {
                _form.dataForm['first_manager'] = GroupLoadDataHandle.box1stManager.val();
            } else {
                _form.dataForm['first_manager'] = null;
            }
            if (GroupLoadDataHandle.box2ndManager.val()) {
                _form.dataForm['second_manager'] = GroupLoadDataHandle.box2ndManager.val();
            } else {
                _form.dataForm['second_manager'] = null;
            }
            let submitFields = [
                'group_level',
                'parent_n',
                'title',
                'code',
                'description',
                'group_employee',
                'first_manager',
                'first_manager_title',
                'second_manager',
                'second_manager_title'
            ]
            if (_form.dataForm) {
                GroupCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': _form.dataUrl,
                    'method': _form.dataMethod,
                    'data': _form.dataForm,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        setTimeout(() => {
                            window.location.replace(_form.dataUrlRedirect);
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
});