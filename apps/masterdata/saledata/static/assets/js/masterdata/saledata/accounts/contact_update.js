$(document).ready(function () {
        let work_address_dict = [];
        let home_address_dict = [];

        // load Cities SelectBox
        function loadCitiesWork() {
            $("#workdistrict option:selected").prop("selected", false);
            $("#workcity option:selected").prop("selected", false);
            let ele = $('#workcity');
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax2(
                {
                    'url': url,
                    'method': method
                }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        ele.append(`<option value="" selected>---</option>`)
                        if (data.hasOwnProperty('cities') && Array.isArray(data.cities)) {
                            data.cities.map(function (item) {
                                ele.append(`<option data-country-id="` + item.country_id + `" value="` + item.id + `">` + item.title + `</option>`)
                            })
                        }
                    }
                }
            )
        }

        loadCitiesWork();

        // load Districts SelectBox
        function loadDistrictsWork() {
            let ele = $('#workdistrict');
            let url = ele.attr('data-url').replace('pk', $('#workcity').val())
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                'url': method,
                'method': method
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        ele.append(`<option value="" selected>---</option>`)
                        if (data.hasOwnProperty('districts') && Array.isArray(data.districts)) {
                            data.districts.map(function (item) {
                                ele.append(`<option data-city-id="` + item.city_id + `" value="` + item.id + `">` + item.title + `</option>`)
                            })
                        }
                    }
                }
            )
        }

        // load Wards SelectBox
        function loadWardsWork() {
            let ele = $('#workward');
            let url = ele.attr('data-url').replace('pk', $('#workdistrict').val())
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                'url': url,
                'method': method
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        ele.append(`<option value="" selected>---</option>`)
                        if (data.hasOwnProperty('wards') && Array.isArray(data.wards)) {
                            data.wards.map(function (item) {
                                ele.append(`<option data-district-id="` + item.district_id + `" value="` + item.id + `">` + item.title + `</option>`)
                            })
                        }
                    }
                }
            )
        }

        $('#workcity').on('change', function () {
            loadDistrictsWork();
            $('#workward').html('<option value="" selected>---</option>');
        })

        $('#workdistrict').on('change', function () {
            loadWardsWork();
        })

        $('#save-changes-modal-work-address').on('click', function () {
            try {
                let detail_work_address = $('#detail-modal-work-address').val();
                let city = $('#workcity').find(`option:selected`).text();
                let district = $('#workdistrict').find(`option:selected`).text();
                let ward = $('#workward').find(`option:selected`).text();

                let country_id = $('#workcity').find(`option:selected`).attr('data-country-id');
                let city_id = $('#workcity').find(`option:selected`).attr('value');
                let district_id = $('#workdistrict').find(`option:selected`).attr('value');
                let ward_id = $('#workward').find(`option:selected`).attr('value');

                let work_address = '';
                if (city !== '' && district !== '' && detail_work_address !== '') {
                    if (ward === '') {
                        work_address = detail_work_address + ', ' + district + ', ' + city;
                    } else {
                        work_address = detail_work_address + ', ' + ward + ', ' + district + ', ' + city;
                    }
                    $('#modal-work-address').modal('hide');
                    $('#detail-modal-work-address').val('');
                } else {
                    $.fn.notifyB({description: "Missing address information!"}, 'failure');
                }

                if (work_address !== '') {
                    $('#work_address_id').val(work_address);
                    work_address_dict.push({
                        'work_country_id': country_id,
                        'work_detail_address': detail_work_address,
                        'work_city_id': city_id,
                        'work_district_id': district_id,
                        'work_ward_id': ward_id,
                    })
                }
            } catch (error) {
                $.fn.notifyB({description: "No address information!"}, 'failure');
            }
        })

        // load Cities SelectBox
        function loadCitiesHome() {
            $("#homedistrict option:selected").prop("selected", false);
            $("#homecity option:selected").prop("selected", false);
            let ele = $('#homecity');
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                'url': url,
                'method': method
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        ele.append(`<option value="" selected>---</option>`)
                        if (data.hasOwnProperty('cities') && Array.isArray(data.cities)) {
                            data.cities.map(function (item) {
                                ele.append(`<option data-country-id="` + item.country_id + `" value="` + item.id + `">` + item.title + `</option>`)
                            })
                        }
                    }
                }
            )
        }

        loadCitiesHome();

        // load Districts SelectBox
        function loadDistrictsHome() {
            let ele = $('#homedistrict');
            let url = ele.attr('data-url').replace('pk', $('#homecity').val())
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                'url': url,
                'method': method
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        ele.append(`<option value="" selected>---</option>`)
                        if (data.hasOwnProperty('districts') && Array.isArray(data.districts)) {
                            data.districts.map(function (item) {
                                ele.append(`<option data-city-id="` + item.city_id + `" value="` + item.id + `">` + item.title + `</option>`)
                            })
                        }
                    }
                }
            )
        }

        // load Wards SelectBox
        function loadWardsHome() {
            let ele = $('#homeward');
            let url = ele.attr('data-url').replace('pk', $('#homedistrict').val())
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                'url': url,
                'method': method
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        ele.append(`<option value="" selected>---</option>`)
                        if (data.hasOwnProperty('wards') && Array.isArray(data.wards)) {
                            data.wards.map(function (item) {
                                ele.append(`<option data-district-id="` + item.district_id + `" value="` + item.id + `">` + item.title + `</option>`)
                            })
                        }
                    }
                }
            )
        }

        $('#homecity').on('change', function () {
            loadDistrictsHome();
            $('#homeward').html('<option value="" selected>---</option>');
        })

        $('#homedistrict').on('change', function () {
            loadWardsHome();
        })

        $('#save-changes-modal-home-address').on('click', function () {
            try {
                let detail_home_address = $('#detail-modal-home-address').val();
                let city = $('#homecity').find(`option:selected`).text();
                let district = $('#homedistrict').find(`option:selected`).text();
                let ward = $('#homeward').find(`option:selected`).text();

                let country_id = $('#homecity').find(`option:selected`).attr('data-country-id');
                let city_id = $('#homecity').find(`option:selected`).attr('value');
                let district_id = $('#homedistrict').find(`option:selected`).attr('value');
                let ward_id = $('#homeward').find(`option:selected`).attr('value');

                let home_address = '';
                if (city !== '' && district !== '' && detail_home_address !== '') {
                    if (ward === '') {
                        home_address = detail_home_address + ', ' + district + ', ' + city;
                    } else {
                        home_address = detail_home_address + ', ' + ward + ', ' + district + ', ' + city;
                    }
                    $('#modal-home-address').modal('hide');
                    $('#detail-modal-home-address').val('');
                } else {
                    $.fn.notifyB({description: "Missing address information!"}, 'failure');
                }

                if (home_address !== '') {
                    $('#home_address_id').val(home_address);
                    if (home_address !== '') {
                        $('#home_address_id').val(home_address);
                        home_address_dict.push({
                            'home_country_id': country_id,
                            'home_detail_address': detail_home_address,
                            'home_city_id': city_id,
                            'home_district_id': district_id,
                            'home_ward_id': ward_id,
                        })
                    }
                }
            } catch (error) {
                $.fn.notifyB({description: "No address information!"}, 'failure');
            }
        })

        let option_emp = [
            {
                'val': '',
                'text': ''
            }
        ];

        let frmEle = $("#form-create-contact");

        function loadSalutationList(id) {
            let ele = $('#select-box-salutation');
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                'url': url,
                'method': method
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        if (data.hasOwnProperty('salutation_list') && Array.isArray(data.salutation_list)) {
                            ele.append(`<option>` + `</option>`)
                            data.salutation_list.map(function (item) {
                                if (item.id === id) {
                                    ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                                } else {
                                    ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                                }
                            })
                        }
                    }
                }
            )
        }

        function loadInterestList(list_id) {
            let ele = $('#select-box-interests');
            let url = ele.attr('data-select2-url');
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                'url': url,
                'method': method
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        if (data.hasOwnProperty('interests_list') && Array.isArray(data.interests_list)) {
                            data.interests_list.map(function (item) {
                                if (list_id.includes(item.id)) {
                                    ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                                } else {
                                    ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                                }
                            })
                        }
                    }
                }
            )
        }

        function loadEmployee(id) {
            let ele = $('#select-box-emp');
            let url = ele.attr('data-select2-url');
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                    'url': url,
                    'method': method
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                            ele.append(`<option>` + `</option>`)
                            data.employee_list.map(function (item) {
                                if (item.id === id) {
                                    ele.append(`<option value="` + item.id + `" selected>` + item.full_name + `</option>`)
                                } else {
                                    ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
                                }
                                option_emp.push({
                                    'val': item.id,
                                    'text': item.full_name
                                })
                            })
                        }
                    }
                }
            )
        }

        function loadAccountName(id, id_report_to) {
            let ele = $('#select-box-account_name');
            let url = ele.attr('data-select2-url');
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                'url': url,
                'method': method
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                            ele.append(`<option>` + `</option>`)
                            data.account_list.map(function (item) {
                                if (item.id === id) {
                                    loadReportTo(id, id_report_to);
                                    ele.append(`<option selected value="` + item.id + `">` + item.name + `</option>`)
                                } else {
                                    ele.append(`<option value="` + item.id + `">` + item.name + `</option>`)
                                }
                            })
                        }
                    }
                }
            )
        }

        function loadReportTo(id, id_report_to) {
            let ele = $('#select-box-report-to');
            ele.attr('disabled', false);
            let url = ele.attr('data-select2-url').replace('0', id);
            let method = ele.attr('data-method');
            $.fn.callAjax2({
                'url': url,
                'method': method
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.text("");
                        ele.append(`<option selected>` + `</option>`)
                        for (let i = 0; i < data.account_detail.contact_mapped.length; i++) {
                            let contact_mapped = data.account_detail.contact_mapped[i];
                            if (contact_mapped.id === id_report_to) {
                                ele.append(`<option value="` + contact_mapped.id + `" selected>` + contact_mapped.fullname + `</option>`)
                            } else {
                                ele.append(`<option value="` + contact_mapped.id + `">` + contact_mapped.fullname + `</option>`)
                            }
                        }
                    }
                }
            )
        }

        function loadDefaultData() {
            $('#input-avatar').on('change', function () {
                let upload_img = $('#upload-area');
                upload_img.text("");
                upload_img.css('background-image', "url(" + URL.createObjectURL(this.files[0]) + ")");
                $(this).val()
            });
            $('#upload-area').click(function () {
                $('#input-avatar').click();
            });

            $('#select-box-interests').initSelect2();

            let pk = window.location.pathname.split('/').pop();
            let url_loaded = frmEle.attr('data-url-loaded').replace(0, pk);

            $.fn.callAjax2({
                'url': url_loaded,
                'method': 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let contact_detail = data?.['contact_detail'];
                        $.fn.compareStatusShowPageAction(contact_detail);

                        loadEmployee(contact_detail.owner.id);
                        loadSalutationList(contact_detail.salutation.id);
                        loadAccountName(contact_detail.account_name.id, contact_detail.report_to.id);
                        $('#first_name_id').val(contact_detail.fullname.first_name);
                        $('#last_name_id').val(contact_detail.fullname.last_name);
                        $('#full_name_id').val(contact_detail.fullname.fullname);
                        $('#text-bio').val(contact_detail.biography);
                        $('#inp-phone').val(contact_detail.phone);
                        $('#inp-mobile').val(contact_detail.mobile);
                        $('#inp-email').val(contact_detail.email);
                        $('#inp-jobtitle').val(contact_detail.job_title);
                        $('#work_address_id').val(contact_detail.address_information.work_address);
                        $('#home_address_id').val(contact_detail.address_information.home_address);
                        if (Object.keys(contact_detail.additional_information).length > 0) {
                            loadInterestList(contact_detail.additional_information.interests.map(obj => obj.id));
                            $('#tag_id').val(contact_detail.additional_information.tags);
                            $('#facebook_id').val(contact_detail.additional_information.facebook);
                            $('#gmail_id').val(contact_detail.additional_information.gmail);
                            $('#linkedln_id').val(contact_detail.additional_information.linkedln);
                            $('#twitter_id').val(contact_detail.additional_information.twitter);
                        } else {
                            loadInterestList([]);
                        }
                        WFRTControl.setWFRuntimeID(data?.['contact_detail']?.['workflow_runtime_id']);
                    }
                }
            )

        }

        loadDefaultData();

        //load report to while change select box account name
        $('#select-box-account_name').on('change', function () {
            let account_id = $(this).find('option:selected').val();
            let ele = $('#select-box-report-to');
            ele.empty();
            if (account_id !== '') {
                ele.attr('disabled', false);
                loadReportTo(account_id);
            } else {
                ele.attr('disabled', true);
            }
        })

        // remove employee in report to (selected in owner)
        $('#select-box-emp').on('change', function () {
            let id_emp = $(this).val();
            let ele = $('#select-box-report-to');
            let selected = ele.val()
            ele.empty();
            option_emp.map(function (item) {
                ele.append(`<option value="` + item.val + `">` + item.text + `</option>`)
            })
            ele.val(selected)
            $(`#select-box-report-to option[value="` + id_emp + `"]`).remove();
        });

        // remove employee in owner (selected in report to)
        $('#select-box-report-to').on('change', function () {
            let id_emp = $(this).val()
            let ele = $('#select-box-emp');
            let selected = ele.val()
            ele.empty();
            option_emp.map(function (item) {
                ele.append(`<option value="` + item.val + `">` + item.text + `</option>`)
            })
            ele.val(selected)
            $(`#select-box-emp option[value="` + id_emp + `"]`).remove();
        });

        frmEle.submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit(frmEle);
            frm.dataForm['additional_information'] = {
                'facebook': $('#facebook_id').val(),
                'twitter': $('#twitter_id').val(),
                'linkedln': $('#linkedln_id').val(),
                'gmail': $('#gmail_id').val(),
                'interests': $('#select-box-interests').val(),
                'tags': $('#tag_id').val(),
            };

            frm.dataForm['address_information'] = {
                'work_address': $('#work_address_id').val(),
                'home_address': $('#home_address_id').val(),
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

            frm.dataForm['home_address_dict'] = home_address_dict;

            frm.dataForm['work_address_dict'] = work_address_dict;

            let pk = window.location.pathname.split('/').pop();

            WindowControl.showLoading();
            $.fn.callAjax(frm.dataUrl.replace('0', pk), frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && data['status'] === 200) {
                            $.fn.notifyB({description: $('#base-trans-factory').attr('data-success')}, 'success');
                            setTimeout(
                                () => {
                                    // window.location.replace("/saledata/contacts");
                                    // location.reload.bind(location)
                                    window.location.reload();
                                }, 1000
                            );
                        }
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                    }, (err) => {
                        $.fn.notifyB({description: err.detail}, 'failure');
                    }
                )
        });
    }
)
;


$("#first_name_id").on('change', function () {
    if ($(this).val() !== '' && $("#last_name_id").val() !== '') {
        $("#full_name_id").val($(this).val() + ' ' + $("#last_name_id").val())
    }
})
$("#last_name_id").on('change', function () {
    if ($("#first_name_id").val() !== '' && $(this).val() !== '') {
        $("#full_name_id").val($("#first_name_id").val() + ' ' + $(this).val())
    }
})
