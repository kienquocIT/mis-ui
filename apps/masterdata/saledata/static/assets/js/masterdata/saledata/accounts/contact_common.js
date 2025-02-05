function loadAddressDisplay(idx, addr, ward, district, city) {
    let txt = `${addr ? addr : ''}, ${ward ? ward : ''}, ${district ? district : ''}, ${city ? city : ''}`;
    $(idx).val(txt);
}

let [firstNameEle, lastNameEle, fullNameEle] = [$("#first_name_id"), $("#last_name_id"), $("#full_name_id")];

firstNameEle.on('input', function () {
    fullNameEle.val($(this).val() + ' ' + lastNameEle.val())
})

lastNameEle.on('input', function () {
    fullNameEle.val(firstNameEle.val() + ' ' + $(this).val())
})

let [empEle, salEle, accEle, repEle, intEle] = [$('#select-box-emp'), $('#select-box-salutation'), $('#select-box-account_name'), $('#select-box-report-to'), $('#select-box-interests')];

function loadEmployee(empData) {
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

function loadSalutation(salData) {
    salEle.initSelect2({
        data: (salData ? salData : null),
        keyResp: 'salutation_list',
    });
}

function loadAccount(accData) {
    accEle.initSelect2({
        allowClear: true,
        data: (accData ? accData : null),
        keyResp: 'account_list',
        keyText: 'name',
    }).on('change', function () {
        let selectedVal = $(this).val();
        if (selectedVal) {
            loadReportTo()
        }
        else {
            repEle.empty().prop('disabled', true);
        }
    });
}

function loadReportTo(data) {
    let reportEleUrl = repEle.attr('data-url');
    reportEleUrl = reportEleUrl.replace("__pk__", accEle.val());
    repEle.attr('data-url', reportEleUrl);
    repEle.initSelect2({
        data: (data ? data : null),
        keyResp: 'account_detail--contact_mapped',
        keyText: 'fullname',
    }).prop('disabled', false);
}

function loadInterest(interestData) {
    intEle.initSelect2({
        data: (interestData ? interestData : null),
        keyResp: 'interests_list',
    });
}

let [wAddr, wCityEle, wDistrictEle, wWardEle, wWorkAddrDetail] = [$('#work_address_id'), $('#workcity'), $("#workdistrict"), $('#workward'), $('#detail-modal-work-address')];

function loadWCities(cityData) {
    wCityEle.initSelect2({
        data: (cityData ? cityData : null),
        keyResp: 'cities',
    }).on('change', function () {
        let dataParams = JSON.stringify({'city_id': $(this).val()});
        wDistrictEle.attr('data-params', dataParams).val("");
        wWardEle.attr('data-params', '{}').val("");
    });
}

function loadWDistrict(disData) {
    wDistrictEle.initSelect2({
        data: (disData ? disData : null),
        keyResp: 'districts',
    }).on('change', function () {
        let dataParams = JSON.stringify({'district_id': $(this).val()});
        wWardEle.attr('data-params', dataParams).val("");
    });
}

function loadWWard(wardData) {
    wWardEle.initSelect2({
        data: (wardData ? wardData : null),
        keyResp: 'wards',
    });
}

$('#save-changes-modal-work-address').on('click', function () {
    try {
        let country_id = $('input[name="work_country"]').val();
        let city_id = wCityEle.val()
        let district_id = wDistrictEle.val();
        // let ward_id = wWardEle.val();

        if (country_id && city_id && district_id) {
            let detail_work_address = wWorkAddrDetail.val();
            let city = wCityEle.find(`option:selected`).text();
            let district = wDistrictEle.find(`option:selected`).text();
            let ward = wWardEle.find(`option:selected`).text();

            if (detail_work_address || city || district || ward) {
                loadAddressDisplay(wAddr, detail_work_address, ward, district, city);
                $(this).closest('div.modal').modal('hide');
            } else {
                $.fn.notifyB({description: "Missing address information!"}, 'failure');
            }
        } else {
            $.fn.notifyB({description: "Missing address information!"}, 'failure');
        }
    } catch (error) {
        $.fn.notifyB({description: "No address information!"}, 'failure');
    }
})

let [hAddr, hCity, hDistrict, hWard, hHomeAddrDetail] = [$('#home_address_id'), $('#homecity'), $("#homedistrict"), $("#homeward"), $('#detail-modal-home-address')];

function loadHCity(cityData) {
    hCity.initSelect2({
        data: (cityData ? cityData : null),
        keyResp: 'cities',
    }).on('change', function () {
        let dataParams = JSON.stringify({'city_id': $(this).val()});
        hDistrict.attr('data-params', dataParams).val("");
        hWard.attr('data-params', '{}').val("");
    });
}

function loadHDistrict(disData) {
    hDistrict.initSelect2({
        data: (disData ? disData : null),
        keyResp: 'districts',
    }).on('change', function () {
        let dataParams = JSON.stringify({'district_id': $(this).val()});
        hWard.attr('data-params', dataParams).val("");
    });
}

function loadHWard(wardData) {
    hWard.initSelect2({
        data: (wardData ? wardData : null),
        keyResp: 'wards',
    });
}

$('#save-changes-modal-home-address').on('click', function () {
    try {
        let country_id = $('input[name="home_country"]').val();
        let city_id = hCity.val()
        let district_id = hDistrict.val();
        // let ward_id = hWard.val();

        if (country_id && city_id && district_id) {
            let detail_home_address = hHomeAddrDetail.val();
            let city = hCity.find(`option:selected`).text();
            let district = hDistrict.find(`option:selected`).text();
            let ward = hWard.find(`option:selected`).text();

            if (detail_home_address || city || district || ward) {
                loadAddressDisplay(hAddr, detail_home_address, ward, district, city);
                $(this).closest('div.modal').modal('hide');
            } else {
                $.fn.notifyB({description: "Missing address information!"}, 'failure');
            }
        } else {
            $.fn.notifyB({description: "Missing address information!"}, 'failure');
        }
    } catch (error) {
        $.fn.notifyB({description: "No address information!"}, 'failure');
    }
})

class ContactHandle {
    static load() {
        loadEmployee()
        loadSalutation()
        loadAccount()
        loadInterest()
        loadWCities()
        loadWDistrict()
        loadWWard()
        loadHCity()
        loadHDistrict()
        loadHWard()
    }

    static combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['fullname'] = fullNameEle.val()

        frm.dataForm['additional_information'] = {
            'facebook': $('#facebook_id').val(),
            'twitter': $('#twitter_id').val(),
            'linkedln': $('#linkedln_id').val(),
            'gmail': $('#gmail_id').val(),
            'interests': intEle.val(),
            'tags': $('#tag_id').val(),
        };

        frm.dataForm['work_detail_address'] = wWorkAddrDetail.val()
        frm.dataForm['work_country'] = $('input[name="work_country"]').val();
        frm.dataForm['work_city'] = wCityEle.val()
        frm.dataForm['work_district'] = wDistrictEle.val()
        frm.dataForm['work_ward'] = wWardEle.val()
        frm.dataForm['home_detail_address'] = hHomeAddrDetail.val()
        frm.dataForm['home_country'] = $('input[name="home_country"]').val();
        frm.dataForm['home_city'] = hCity.val()
        frm.dataForm['home_district'] = hDistrict.val()
        frm.dataForm['home_ward'] = hWard.val()

        frm.dataForm['address_information'] = {
            'work_address': wAddr.val(),
            'home_address': hAddr.val(),
        };

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

    static loadDetailContact(option='detail') {
        let pk = $.fn.getPkDetail()
        let frmEle = $("#form-detail-contact");
        let url_loaded = frmEle.attr('data-detail-url').replace(0, pk);

        $.fn.callAjax2({
            'url': url_loaded,
            'method': 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let contact_detail = data?.['contact_detail'];
                    // console.log(contact_detail)
                    $.fn.compareStatusShowPageAction(contact_detail);
                    $x.fn.renderCodeBreadcrumb(contact_detail);

                    loadEmployee(contact_detail?.['owner']);
                    loadSalutation(contact_detail?.['salutation']);
                    loadAccount(contact_detail?.['account_name']);
                    loadReportTo(contact_detail?.['report_to'])
                    $('#first_name_id').val(contact_detail?.['fullname']?.['first_name']);
                    $('#last_name_id').val(contact_detail?.['fullname']?.['last_name']);
                    $('#full_name_id').val(contact_detail?.['fullname']?.['fullname']);
                    $('#bio').val(contact_detail?.['biography']);
                    $('#inp-phone').val(contact_detail?.['phone']);
                    $('#inp-mobile').val(contact_detail?.['mobile']);
                    $('#inp-mail').val(contact_detail?.['email']);
                    $('#inp-job-title').val(contact_detail?.['job_title']);
                    $('#work_address_id').val(contact_detail?.['address_information']?.['work_address']);
                    wWorkAddrDetail.val(contact_detail?.['work_address_data']?.['work_detail_address'])
                    loadWCities(contact_detail?.['work_address_data']?.['work_city']);
                    loadWDistrict(contact_detail?.['work_address_data']?.['work_district']);
                    loadWWard(contact_detail?.['work_address_data']?.['work_ward']);
                    $('#home_address_id').val(contact_detail?.['address_information']?.['home_address']);
                    hHomeAddrDetail.val(contact_detail?.['home_address_data']?.['home_detail_address'])
                    loadHCity(contact_detail?.['home_address_data']?.['home_city']);
                    loadHDistrict(contact_detail?.['home_address_data']?.['home_district']);
                    loadHWard(contact_detail?.['home_address_data']?.['home_ward']);
                    if (Object.keys(contact_detail?.['additional_information']).length > 0) {
                        loadInterest(contact_detail?.['additional_information']?.['interests'].map(obj => obj?.['id']));
                        $('#tag_id').val(contact_detail?.['additional_information']?.['tags']);
                        $('#facebook_id').val(contact_detail?.['additional_information']?.['facebook']);
                        $('#gmail_id').val(contact_detail?.['additional_information']?.['gmail']);
                        $('#linkedln_id').val(contact_detail?.['additional_information']?.['linkedln']);
                        $('#twitter_id').val(contact_detail?.['additional_information']?.['twitter']);
                    } else {
                        loadInterest();
                    }

                    if (option === 'detail') {
                        $(document.getElementsByTagName('input')).prop('disabled', true).prop('readonly', true)
                        $(document.getElementsByTagName('select')).prop('disabled', true)
                        $(document.getElementsByTagName('textarea')).prop('disabled', true).prop('readonly', true)
                    }
                }
            }
        )
    }
}