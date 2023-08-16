$(function () {
    $(document).ready(function () {
        let frm = $('#frm_group_create');
        GroupLoadDataHandle.loadDataCommon(frm);

        $(document).on('change', '#select-box-group-level', function () {
            let sel = $(this)[0].options[$(this)[0].selectedIndex]
            let ref_group_title = sel.getAttribute('data-description')
            let first_manager_system_title = sel.getAttribute('data-first-manager-description');
            let second_manager_system_title = sel.getAttribute('data-second-manager-description');
            $('#reference-group-title').val(ref_group_title);
            $('#first-manager-system-title').val(first_manager_system_title);
            $('#second-manager-system-title').val(second_manager_system_title);
            let level = sel.getAttribute('data-level');
            GroupLoadDataHandle.loadGroupListFilter(level)
        });

        $('#btn-add-employee-to-group').on('click', function() {
            GroupLoadDataHandle.loadCheckboxTableEmployee();
        });

        $('#btn-confirm-add-purchase-request').on('click', function() {
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
