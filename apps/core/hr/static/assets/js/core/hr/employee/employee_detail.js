$(document).ready(function () {
    // load instance data
    function loadDetailData() {
        let ele = $('#employee-detail-page');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');

        let eleUser = $('#select-box-user-detail');
        let eleFirstName = $('#employee-first-name-detail');
        let eleLastName = $('#employee-last-name-detail');
        let eleEmail = $('#employee-email-detail');
        let elePhone = $('#employee-phone-detail');
        let eleDepartment = $('#select-box-group-employee-detail');
        let eleDob = $('#employee-dob-detail');
        let eleDateJoined = $('#employee-date-joined-detail');
        let eleRole = $('#select-box-role-employee-detail');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee')) {

                        if (data.employee.user.hasOwnProperty('full_name')) {
                            eleUser.val(data.employee.user.full_name)
                        }

                        eleFirstName.val(data.employee.first_name);
                        eleLastName.val(data.employee.last_name);
                        eleEmail.val(data.employee.email);
                        elePhone.val(data.employee.phone);

                        if (data.employee.group.hasOwnProperty('title')) {
                            eleDepartment.val(data.employee.group.title)
                        }

                        eleDob.val(moment(data.employee.dob).format('DD-MM-YYYY'));
                        eleDateJoined.val(moment(data.employee.date_joined).format('DD-MM-YYYY'));

                        // load data for field Role
                        if (typeof data.employee.role !== 'undefined' && data.employee.role.length > 0) {
                            let dataRoleEmp = ""
                            for (let r = 0; r < data.employee.role.length; r++) {
                                if (r !== (data.employee.role.length - 1)) {
                                    dataRoleEmp += data.employee.role[r].title + ", "
                                } else {
                                    dataRoleEmp += data.employee.role[r].title
                                }
                            }
                            eleRole.val(dataRoleEmp)
                        }

                        // load permission table
                        // call function handle permissions function
                        PermissionsInit(data.employee.plan_app)
                    }
                } // end if data available
            } // end response
        )
    }

    loadDetailData();

    $('#input-avatar').on('change', function (ev) {
        let upload_img = $('#upload-area');
        upload_img.text("");
        upload_img.css('background-image', "url(" + URL.createObjectURL(this.files[0]) + ")");
    });
    $('#upload-area').click(function (e) {
        $('#input-avatar').click();
    });

    $('#languages').select2();


    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });

    /***
     * on click set permission button
     */
    $('#btn-edit-emp-permission').on('click', function(){
        $(this).addClass("hidden")
        $('#button-save-employee-permission').removeClass('hidden');
        $('#employee-perm-detail input').attr('disabled', false);
        $('#employee-perm-detail select').attr('disabled', false);
        // $('#employee-permission-detail').attr("hidden", true);
        // $('#employee-permission-edit').attr("hidden", false);
    })
});