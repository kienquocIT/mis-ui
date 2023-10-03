let [cityEle, districtEle, wardEle, agencyEle] = [$('#warehouseCity'), $('#warehouseDistrict'), $('#warehouseWard'), $('#boxSelectAgency')];

class WarehouseLoadPage {
    static loadCities(cityData) {
        cityEle.initSelect2({
            data: (cityData ? cityData : null),
            keyResp: 'cities',
        }).on('change', function () {
            let dataParams = JSON.stringify({'city_id': $(this).val()});
            districtEle.empty();
            wardEle.empty();
            districtEle.attr('data-params', dataParams).val("");
            wardEle.attr('data-params', '{}').val("");
        });
    }

    static loadDistrict(disData) {
        districtEle.initSelect2({
            data: (disData ? disData : null),
            keyResp: 'districts',
        }).on('change', function () {
            let dataParams = JSON.stringify({'district_id': $(this).val()});
            wardEle.empty();
            wardEle.attr('data-params', dataParams).val("");
        });
    }

    static loadWard(wardData) {
        wardEle.initSelect2({
            data: (wardData ? wardData : null),
            keyResp: 'wards',
        });
    }

    static loadAgency(data) {
        agencyEle.initSelect2({
            data: data,
            dataParams: {
                'account_types_mapped__account_type_order': 2
            }
        })
    }

    static getFormDataCreate() {
        let type = $('#warehouseType').val();
        let data = {
            'title': $('#inpTitle').val(),
            'remarks': $('#inpRemarks').val(),
            'address': $('#addressDetail').val(),
            'city': cityEle.val(),
            'district': districtEle.val(),
            'ward': wardEle.val(),
            'warehouse_type': type,
            'agency': agencyEle.val(),
            'full_address': $('#warehouseAddress').val(),
            'is_active': $('#inputActive').is(':checked'),
        }
        if (type !== '3') {
            delete data['agency']
        }
        return data
    }

    static loadDetail(frmDetail, pk) {
        let frm = new SetupFormSubmit(frmDetail);
        $.fn.callAjax2({
            'url': frm.getUrlDetail(pk),
            'method': 'GET'
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let detail = data?.['warehouse_detail'];
                $x.fn.renderCodeBreadcrumb(detail);
                $('#inpTitle').val(detail.title);
                $('#inpRemarks').val(detail.remarks);

                let agencyParentEle = agencyEle.closest('.form-group');
                let typeEle = $('#warehouseType')
                switch (detail.warehouse_type) {
                    case 1:
                        $('#checkDropShip').prop('checked', true);
                        typeEle.val(1);
                        break;
                    case 2:
                        $('#checkBinLocation').prop('checked', true);
                        typeEle.val(2);
                        break;
                    case 3:
                        $('#checkAgencyLocation').prop('checked', true);
                        agencyParentEle.removeClass('hidden');
                        WarehouseLoadPage.loadAgency(detail.agency);
                        typeEle.val(3);
                        break;
                }

                $('#inputActive').prop('checked', detail.is_active);
                $('#warehouseAddress').val(detail.full_address);
                $('#addressDetail').val(detail.address);
                this.loadCities(detail.city);
                this.loadDistrict(detail.district);
                this.loadWard(detail.ward);
            }
        })
    }

    static getFormDataUpdate() {
        let type = $('#warehouseType').val();
        let data = {
            'title': $('#inpTitle').val(),
            'remarks': $('#inpRemarks').val(),
            'address': $('#addressDetail').val(),
            'city': cityEle.val(),
            'district': districtEle.val(),
            'ward': wardEle.val(),
            'warehouse_type': type,
            'agency': agencyEle.val(),
            'full_address': $('#warehouseAddress').val(),
            'is_active': $('#inputActive').is(':checked'),
        }
        if (type !== '3') {
            data['agency'] = null;
        }
        return data
    }
}

function eventPage() {
    $('#saveWarehouseAddress').on('click', function () {
        let city = SelectDDControl.get_data_from_idx(cityEle, cityEle.val());
        let district = SelectDDControl.get_data_from_idx(districtEle, districtEle.val());
        let ward = SelectDDControl.get_data_from_idx(wardEle, wardEle.val());
        let detail = $('#addressDetail').val();

        let fullAddress = `${detail}, ${ward.title}, ${district.title}, ${city.title}`;

        $('#warehouseAddress').val(fullAddress);

        $('#modalWarehouseAddress').modal('hide');
    })

    $('#checkAgencyLocation').on('change', function () {
        if ($(this).is(':checked')) {
            agencyEle.closest('.form-group').removeClass('hidden');
        } else {
            agencyEle.closest('.form-group').addClass('hidden');
        }
    })

    $(".checkType").change(function () {
        let typeEle = $('#warehouseType');
        if ($(this).is(':checked')) {
            let id = $(this).attr("id");
            $(".checkType").not(this).prop("checked", false);

            if (id === "checkDropShip") {
                typeEle.val(1);
            } else if (id === "checkBinLocation") {
                typeEle.val(2);
            } else if (id === "checkAgencyLocation") {
                typeEle.val(3);
            }
        }
        else{
            typeEle.val(0);
        }

    });
}