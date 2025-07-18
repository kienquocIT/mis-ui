const firstNameEle = $("#first_name_id")
const lastNameEle = $("#last_name_id")
const fullNameEle = $("#full_name_id")
const bioEle = $('#bio')
const inpPhoneEle = $('#inp-phone')
const inpMobileEle = $('#inp-mobile')
const inpMailEle = $('#inp-mail')
const inpJobTitleEle = $('#inp-job-title')
const empEle = $('#select-box-emp')
const salEle = $('#select-box-salutation')
const accEle = $('#select-box-account_name')
const repEle = $('#select-box-report-to')
const intEle = $('#select-box-interests')
const work_address = $('#work_address')
const home_address = $('#home_address')

firstNameEle.on('input', function () {
    fullNameEle.val($(this).val() + ' ' + lastNameEle.val())
})

lastNameEle.on('input', function () {
    fullNameEle.val(firstNameEle.val() + ' ' + $(this).val())
})

$('#save-changes-modal-work-address').on('click', function () {
    let country_id = $('#modal-work-address .location_country').val()
    let province_id = $('#modal-work-address .location_province').val()
    let ward_id = $('#modal-work-address .location_ward').val()
    let detail_address = $('#modal-work-address .location_detail_address').val()
    if (detail_address && ward_id && province_id && country_id) {
        work_address.val(`${detail_address}, ${$('#modal-work-address .location_ward').find(`option:selected`).text()}, ${$('#modal-work-address .location_province').find(`option:selected`).text()}, ${$('#modal-work-address .location_country').find(`option:selected`).text()}`)
        work_address.attr(
            'data-work-address',
            JSON.stringify({
                country_id: country_id,
                province_id: province_id,
                ward_id: ward_id,
                detail_address: detail_address,
            })
        )
        $('#modal-work-address').modal('hide');
    } else {
        $.fn.notifyB({description: "Missing address information!"}, 'failure');
    }
})

$('#save-changes-modal-home-address').on('click', function () {
    let country_id = $('#modal-home-address .location_country').val()
    let province_id = $('#modal-home-address .location_province').val()
    let ward_id = $('#modal-home-address .location_ward').val()
    let detail_address = $('#modal-home-address .location_detail_address').val()
    if (detail_address && ward_id && province_id && country_id) {
        home_address.val(`${detail_address}, ${$('#modal-home-address .location_ward').find(`option:selected`).text()}, ${$('#modal-home-address .location_province').find(`option:selected`).text()}, ${$('#modal-home-address .location_country').find(`option:selected`).text()}`)
        home_address.attr(
            'data-home-address',
            JSON.stringify({
                country_id: country_id,
                province_id: province_id,
                ward_id: ward_id,
                detail_address: detail_address,
            })
        )
        $('#modal-home-address').modal('hide');
    } else {
        $.fn.notifyB({description: "Missing address information!"}, 'failure');
    }
})

function LoadEmployee(empData) {
    empEle.initSelect2({
        data: (empData ? empData : null),
        templateResult: function(data) {
            let ele = $('<div class="row col-12"></div>');
            ele.append('<div class="col-8">' + data.data?.['full_name'] + '</div>');
            if (data.data?.['group']?.['title'] !== undefined) {
                ele.append('<div class="col-4">(' + data.data?.['group']['title'] + ')</div>');
            }
            return ele;
        },
        keyResp: 'employee_list',
        keyText: 'full_name',
    });
}

function LoadSalutation(salData) {
    salEle.initSelect2({
        data: (salData ? salData : null),
        keyResp: 'salutation_list',
    });
}

function LoadAccount(accData) {
    accEle.initSelect2({
        allowClear: true,
        data: (accData ? accData : null),
        keyResp: 'account_list',
        keyText: 'name',
    }).on('change', function () {
        let selectedVal = $(this).val();
        if (selectedVal) {
            LoadReportTo()
        }
        else {
            repEle.empty().prop('disabled', true);
        }
    });
}

function LoadReportTo(data) {
    let reportEleUrl = repEle.attr('data-url');
    reportEleUrl = reportEleUrl.replace("__pk__", accEle.val());
    repEle.attr('data-url', reportEleUrl);
    repEle.initSelect2({
        data: (data ? data : null),
        keyResp: 'account_detail--contact_mapped',
        keyText: 'fullname',
    }).prop('disabled', false);
}

function LoadInterest(interestData) {
    intEle.initSelect2({
        data: (interestData ? interestData : null),
        keyResp: 'interests_list',
    });
}

class ContactHandle {
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['fullname'] = fullNameEle.val()

        frm.dataForm['work_detail_address'] = work_address.val()
        frm.dataForm['work_address_data'] = work_address.attr('data-work-address') ? JSON.parse(work_address.attr('data-work-address')) : {}
        frm.dataForm['home_detail_address'] = home_address.val()
        frm.dataForm['home_address_data'] = home_address.attr('data-home-address') ? JSON.parse(home_address.attr('data-home-address')) : {}

        frm.dataForm['address_information'] = {
            'work_address': work_address.val(),
            'home_address': home_address.val(),
        }

        frm.dataForm['additional_information'] = {
            'facebook': $('#facebook_id').val(),
            'twitter': $('#twitter_id').val(),
            'linkedln': $('#linkedln_id').val(),
            'gmail': $('#gmail_id').val(),
            'interests': intEle.val(),
            'tags': $('#tag_id').val(),
        }

        if (!frm.dataForm['account_name']) {
            frm.dataForm['account_name'] = null;
        }

        if (!frm.dataForm['report_to']) {
            frm.dataForm['report_to'] = null;
        }

        if (!frm.dataForm['owner']) {
            frm.dataForm['owner'] = null;
        }

        if (!frm.dataForm['email']) {
            frm.dataForm['email'] = null;
        }

        if (!frm.dataForm['mobile']) {
            frm.dataForm['mobile'] = null;
        }

        return {
            url: $.fn.getPkDetail() === 'None' ? frm.dataUrl : frm.dataUrl.replace('/0', `/${$.fn.getPkDetail()}`),
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
    static LoadDetailContact(option='detail') {
        let pk = $.fn.getPkDetail()
        $.fn.callAjax2({
            'url': $("#form-detail-contact").attr('data-detail-url').replace(0, pk),
            'method': 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let contact_detail = data?.['contact_detail']
                    // console.log(contact_detail)
                    $.fn.compareStatusShowPageAction(contact_detail)
                    $x.fn.renderCodeBreadcrumb(contact_detail)

                    LoadEmployee(contact_detail?.['owner'])
                    LoadSalutation(contact_detail?.['salutation'])
                    LoadAccount(contact_detail?.['account_name'])
                    LoadReportTo(contact_detail?.['report_to'])
                    LoadInterest(Object.keys(contact_detail?.['additional_information']).length > 0 ? contact_detail?.['additional_information']?.['interests'].map(obj => obj?.['id']) : null);

                    firstNameEle.val(contact_detail?.['fullname']?.['first_name'])
                    lastNameEle.val(contact_detail?.['fullname']?.['last_name'])
                    fullNameEle.val(contact_detail?.['fullname']?.['fullname'])
                    bioEle.val(contact_detail?.['biography'])
                    inpPhoneEle.val(contact_detail?.['phone'])
                    inpMobileEle.val(contact_detail?.['mobile'])
                    inpMailEle.val(contact_detail?.['email'])
                    inpJobTitleEle.val(contact_detail?.['job_title'])
                    work_address.val(contact_detail?.['address_information']?.['work_address'])
                    home_address.val(contact_detail?.['address_information']?.['home_address'])

                    if (Object.keys(contact_detail?.['additional_information']).length > 0) {
                        $('#tag_id').val(contact_detail?.['additional_information']?.['tags'])
                        $('#facebook_id').val(contact_detail?.['additional_information']?.['facebook'])
                        $('#gmail_id').val(contact_detail?.['additional_information']?.['gmail'])
                        $('#linkedln_id').val(contact_detail?.['additional_information']?.['linkedln'])
                        $('#twitter_id').val(contact_detail?.['additional_information']?.['twitter'])
                    }

                    UsualLoadPageFunction.DisablePage(option==='detail')
                }
            }
        )
    }
}