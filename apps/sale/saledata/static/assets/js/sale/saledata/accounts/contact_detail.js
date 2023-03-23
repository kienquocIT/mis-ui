$(document).ready(function () {
    function loadDefaultData() {

        let pk = window.location.pathname.split('/').pop();
        let url_loaded = $('#form-detail-contact').attr('data-url').replace(0, pk);
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $("#owner_id").val(data.contact_detail.owner.fullname);
                    $('#full_name_id').val(data.contact_detail.fullname.fullname);
                    $('#bio_id').val(data.contact_detail.biography);
                    $('#salutation_id').val(data.contact_detail.salutation.title);
                    $('#account_name_id').val(data.contact_detail.account_name.name);
                    $('#job_title_id').val(data.contact_detail.job_title);
                    $('#report_to_id').val(data.contact_detail.report_to.fullname)
                    $('#phone_id').val(data.contact_detail.phone);
                    $('#mobile_id').val(data.contact_detail.mobile);
                    $('#email_id').val(data.contact_detail.email);
                    $('#jobtitle_id').val(data.contact_detail.job_title);
                    $('#work_address_id').val(data.contact_detail.address_information.work_address);
                    $('#home_address_id').val(data.contact_detail.address_information.home_address);
                    if (Object.keys(data.contact_detail.additional_information).length > 0) {
                        $('#tag_id').val(data.contact_detail.additional_information.tags);
                        $('#facebook_id').val(data.contact_detail.additional_information.facebook);
                        $('#gmail_id').val(data.contact_detail.additional_information.gmail);
                        $('#linkedln_id').val(data.contact_detail.additional_information.linkedln);
                        $('#twitter_id').val(data.contact_detail.additional_information.twitter);
                        let list_interest = data.contact_detail.additional_information.interests.map(obj => obj.title)
                        list_interest.forEach(function (item) {
                            $('#input_tags').append(`<option>` + item + `</option>`);
                        })
                    }
                }
            }
        )

    }

    loadDefaultData();
})




