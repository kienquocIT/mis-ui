$(function () {
    $(document).ready(function () {
        let frm = $('#frm_group_create');
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

        $('#btn-add-employee-to-group').on('click', function() {
            GroupLoadDataHandle.loadCheckboxTableEmployee();
        });

        $('#button-add-group-employee').on('click', function() {
            GroupLoadDataHandle.loadDataEmployeeShow();
        });

        $('#datable_employee_show_list').on('click', '.del-row', function() {
            deleteEmployeeShow(this.id);
        });

// SUBMIT FORM
        frm.submit(function (e) {
            e.preventDefault();
            let frm = new SetupFormSubmit($(this));
            frm.dataForm['group_employee'] = JSON.parse($('#data-group_employee').val());
            if (frm.dataForm) {
                for (let key in frm.dataForm) {
                    if (frm.dataForm[key] === '') {
                        delete frm.dataForm[key]
                    }
                }
            }
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.message}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });
    });
});