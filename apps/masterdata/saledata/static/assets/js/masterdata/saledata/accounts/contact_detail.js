$(document).ready(function () {
    function loadDefaultData() {

        let pk = window.location.pathname.split('/').pop();
        let url_loaded = $('#form-detail-contact').attr('data-url').replace(0, pk);
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                let contactDetail = data?.['contact_detail']
                $.fn.compareStatusShowPageAction(contactDetail);
                if (data) {
                    // console.log(data)
                    $("#owner_id").val(contactDetail.owner.fullname);
                    $('#full_name_id').val(contactDetail.fullname.fullname);
                    $('#bio_id').val(contactDetail.biography);
                    $('#salutation_id').val(contactDetail.salutation.title);
                    $('#account_name_id').val(contactDetail.account_name.name);
                    $('#job_title_id').val(contactDetail.job_title);
                    $('#report_to_id').val(contactDetail.report_to.fullname)
                    $('#phone_id').val(contactDetail.phone);
                    $('#mobile_id').val(contactDetail.mobile);
                    $('#email_id').val(contactDetail.email);
                    $('#jobtitle_id').val(contactDetail.job_title);
                    $('#work_address_id').val(contactDetail.address_information.work_address);
                    $('#home_address_id').val(contactDetail.address_information.home_address);
                    if (Object.keys(contactDetail.additional_information).length > 0) {
                        $('#tag_id').val(contactDetail.additional_information.tags);
                        $('#facebook_id').text(contactDetail.additional_information.facebook);
                        $('#gmail_id').text(contactDetail.additional_information.gmail);
                        $('#linkedln_id').text(contactDetail.additional_information.linkedln);
                        $('#facebook_id').attr('href', contactDetail.additional_information.facebook);
                        $('#gmail_id').attr('href', contactDetail.additional_information.gmail);
                        $('#linkedln_id').attr('href', contactDetail.additional_information.linkedln);
                        $('#twitter_id').val(contactDetail.additional_information.twitter);
                        let list_interest = contactDetail.additional_information.interests.map(obj => obj.title)
                        list_interest.forEach(function (item) {
                            $('#input_tags').append(`<option selected>` + item + `</option>`);
                        })
                        $('#input_tags').select2()
                    }
                    $.fn.setWFRuntimeID(contactDetail?.['workflow_runtime_id']);
                }
            }
        )

    }

    loadDefaultData();
})




