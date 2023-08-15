function loadAddressDisplay(idx, addr, ward, district, city) {
    // #detail-modal-work-address
    let txt = `${addr ? addr : ''}, ${ward ? addr : ''}, ${district ? district : ''}, ${city ? city : ''}`;
    $(idx).val(txt);
}

let [firstNameEle, lastNameEle, fullNameEle] = [$("#first_name_id"), $("#last_name_id"), $("#full_name_id")];

firstNameEle.on('change', function () {
    if ($(this).val() !== '' && lastNameEle.val() !== '') {
        fullNameEle.val($(this).val() + ' ' + lastNameEle.val())
    }
})

lastNameEle.on('change', function () {
    if (firstNameEle.val() !== '' && $(this).val() !== '') {
        fullNameEle.val(firstNameEle.val() + ' ' + $(this).val())
    }
})

let [empEle, salEle, accEle, repEle, intEle] = [$('#select-box-emp'), $('#select-box-salutation'), $('#select-box-account_name'), $('#select-box-report-to'), $('#select-box-interests')];

function loadEmployee(empData) {
    empEle.initSelect2({
        data: (empData ? empData : null),
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
        data: (accData ? accData : null),
        keyResp: 'account_list',
        keyText: 'name',
    }).on('change', function () {
        let selectedVal = $(this).val();

        let reportEleUrl = repEle.attr('data-url');
        reportEleUrl = reportEleUrl.replace("__pk__", selectedVal);
        repEle.attr('data-url', reportEleUrl);

        if (repEle.data('select2')) {
            repEle.select2("destroy")
        }
        repEle.initSelect2({
            keyResp: 'account_detail--contact_mapped',
            keyText: 'fullname',
        }).prop('disabled', false);
    });
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

$('#save-changes-modal-work-address').click(function () {
    try {
        let country_id = $('input[name="work_country"]').val();
        let city_id = wCityEle.val()
        let district_id = wDistrictEle.val();
        let ward_id = wWardEle.val();

        if (country_id && city_id && district_id && ward_id) {
            let detail_work_address = wWorkAddrDetail.val();
            let city = wCityEle.find(`option[value="` + city_id + `"]`).text();
            let district = wDistrictEle.find(`option[value="` + district_id + `"]`).text();
            let ward = wWardEle.find(`option[value="` + ward_id + `"]`).text();

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

let [hAddr, hCity, hDistrict, hWard, wHomeAddrDetail] = [$('#home_address_id'), $('#homecity'), $("#homedistrict"), $("#homeward"), $('#detail-modal-home-address')];

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
        let ward_id = hWard.val();

        if (country_id && city_id && district_id && ward_id) {
            let detail_home_address = wHomeAddrDetail.val();
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
    load(respData) {
        loadEmployee(respData?.['owner']);
        loadSalutation(respData?.['salutation']);
        loadAccount(respData?.['account_name']);
        loadInterest(respData?.['additional_information']?.['interests']);
        loadWCities(respData?.['work_city']);
        loadWDistrict(respData?.['work_district']);
        loadWWard(respData?.['work_ward']);
        loadHCity(respData?.['home_city']);
        loadHDistrict(respData?.['home_district']);
        loadHWard(respData?.['home_ward']);
    }

    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));
        frm.dataForm['additional_information'] = {
            'facebook': $('#facebook_id').val(),
            'twitter': $('#twitter_id').val(),
            'linkedln': $('#linkedln_id').val(),
            'gmail': $('#gmail_id').val(),
            'interests': intEle.val(),
            'tags': $('#tag_id').val(),
        };

        frm.dataForm['address_information'] = {
            'work_address': wAddr.val(),
            'home_address': hAddr.val(),
        };

        if (frm.dataForm['account_name'] === '') {
            delete frm.dataForm['account_name'];
        }

        if (frm.dataForm['report_to'] === '') {
            delete frm.dataForm['report_to'];
        }

        if (frm.dataForm['owner'] === '') {
            frm.dataForm['owner'] = null;
        }

        if (frm.dataForm['email'] === '') {
            delete frm.dataForm['email'];
        }

        if (frm.dataForm['mobile'] === '') {
            delete frm.dataForm['mobile'];
        }

        frm.dataForm['system_status'] = 1; // save, not draft

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}