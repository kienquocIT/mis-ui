$(document).ready(function () {
    let shipping_address_id_dict = [];
    let billing_address_id_dict = [];

    // load Cities SelectBox
    function loadCities() {
        $("#shipping-district option:selected").prop("selected", false);
        $("#shipping-ward option:selected").prop("selected", false);
        let ele = $('#shipping-city');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
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
    loadCities();

    // load Districts SelectBox
    function loadDistricts() {
        let ele = $('#shipping-district');
        let url = ele.attr('data-url').replace('pk', $('#shipping-city').val())
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
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
    function loadWards() {
        let ele = $('#shipping-ward');
        let url = ele.attr('data-url').replace('pk', $('#shipping-district').val())
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
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

    $('#shipping-city').on('change', function () {
        loadDistricts();
        $('#shipping-ward').html('<option value="" selected>---</option>');
    })

    $('#shipping-district').on('change', function () {
        loadWards();
    })

    $('#save-changes-modal-shipping-address').on('click', function () {
        try {
            let detail_shipping_address = $('#detail-modal-shipping-address').val();
            let city = $('#shipping-city').find(`option:selected`).text();
            let district = $('#shipping-district').find(`option:selected`).text();
            let ward = $('#shipping-ward').find(`option:selected`).text();

            let country_id = $('#shipping-city').find(`option:selected`).attr('data-country-id');
            let city_id = $('#shipping-city').find(`option:selected`).attr('value');
            let district_id = $('#shipping-district').find(`option:selected`).attr('value');
            let ward_id = $('#shipping-ward').find(`option:selected`).attr('value');

            let shipping_address = '';
            if (city !== '' && district !== '' && detail_shipping_address !== '') {

                if (ward === '') {
                    shipping_address = detail_shipping_address + ', ' + district + ', ' + city;
                } else {
                    shipping_address = detail_shipping_address + ', ' + ward + ', ' + district + ', ' + city;
                }

                $('#modal-shipping-address').modal('hide');
                $('#detail-modal-shipping-address').val('');
            } else {
                $.fn.notifyB({description: "Missing address information!"}, 'failure');
            }

            if (shipping_address !== '') {
                let is_default = '';
                if ($('#make-default-shipping-address').prop('checked') === true) {
                    is_default = 'checked';
                }

                $('#list-shipping-address').append(
                    `<div class="form-check ml-5 mb-2">
                        <input class="form-check-input" type="radio" name="shippingaddressRadio" ` + is_default +`>
                        <label>` + shipping_address + `</label>
                        <a href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                    </div>`
                )

                // delete address item
                $('.del-address-item').on('click', function () {
                    $(this).parent().remove();
                })

                shipping_address_id_dict.push({
                    'country_id': country_id,
                    'detail_address': detail_shipping_address,
                    'city_id': city_id,
                    'district_id': district_id,
                    'ward_id': ward_id,
                    'full_address': shipping_address,
                    'is_default': $('#make-default-shipping-address').prop('checked')
                })
            }
        } catch (error) {
            $.fn.notifyB({description: "No address information!"}, 'failure');
        }
    })

    $('#save-changes-modal-billing-address').on('click', function () {
        try {
            let acc_name = $('#select-box-account-name').find(`option:selected`).text();
            let email_address = $('#inp-email-address').val();
            let tax_code = $('#inp-tax-code-address').val();

            let acc_name_id = $('#select-box-account-name').find(`option:selected`).attr('value');

            let account_address = $('#select-box-address').find('option:selected').val();
            if ($('#select-box-address').is(':hidden')) {
                account_address = $('#edited-billing-address').val()
            }

            let billing_address = '';
            if (email_address !== '' && tax_code !== '' && account_address !== '0') {
                billing_address = acc_name + ', ' + account_address + ' (email: ' + email_address + ', tax code: ' + tax_code + ')';
                $('#modal-billing-address').modal('hide');
            } else {
                $.fn.notifyB({description: "Missing address information!"}, 'failure');
            }

            if (billing_address !== '') {
                let is_default = '';
                if ($('#make-default-billing-address').prop('checked') === true) {
                    is_default = 'checked';
                }

                $('#list-billing-address').append(
                    `<div class="form-check ml-5">
                        <input class="form-check-input" type="radio" name="billingaddressRadio" ` + is_default + `>
                        <label>` + billing_address + `</label>
                        <a href="#" class="del-address-item"><i class="bi bi-x"></i></a>
                    </div>`
                )

                // delete address item
                $('.del-address-item').on('click', function () {
                    $(this).parent().remove();
                })

                billing_address_id_dict.push({
                    'account_name_id': acc_name_id,
                    'email': email_address,
                    'tax_code': tax_code,
                    'account_address': account_address,
                    'full_address': billing_address,
                    'is_default': $('#make-default-billing-address').prop('checked'),
                })
            }
        } catch (error) {
            $.fn.notifyB({description: "No address information!"}, 'failure');
        }
    })


    let ele_table_offcanvas = $('#table-offcanvas').html()
    let config = {
        dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        ordering: false,
        scrollY: $(window).height() * 0.45,
        scrollCollapse: true,
        paging: false,
        columnDefs: [{
            "searchable": false,
            "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
        }],
        order: [2, 'asc'],
        language: {
            search: "",
            searchPlaceholder: "Search",
            info: "_START_ - _END_ of _TOTAL_",
            sLengthMenu: "View  _MENU_",
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
                previous: '<i class="ri-arrow-left-s-line"></i>' // or '←'
            }
        },
        drawCallback: function () {
            $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
            feather.replace();
        },
        data: [],
        columns: [{
            'data': 'fullname',
            render: (data, type, row, meta) => {
                return `<a href="#"><span><b>` + row.fullname + `</b></span></a>`
            }
        }, {
            'data': 'job_title',
            render: (data, type, row, meta) => {
                if (row.job_title) {
                    return `<span>` + row.job_title + `</span>`
                }
                return ``
            }
        }, {
            'data': 'owner',
            render: (data, type, row, meta) => {
                if (row.owner.fullname) {
                    return `<span>` + row.owner.fullname + `</span>`
                }
                return ``
            }
        }, {
            'data': 'mobile',
            'render': (data, type, row, meta) => {
                if (row.mobile) {
                    return `<span>` + row.mobile + `</span>`
                }
                return ``
            }
        }, {
            'data': 'email',
            'render': (data, type, row, meta) => {
                if (row.email) {
                    return `<span>` + row.email + `</span>`
                }
                return ``
            }
        }, {
            'render': (data, type, row, meta) => {
                let currentId = "chk_sel_" + String(meta.row + 1)
                return `<span class="form-check mb-0"><input type="checkbox" class="contact-added form-check-input check-select" id="${currentId}" value=` + row.id + `></span>`;
            }
        }]
    }

    function loadEmployee() {
        let ele = $('#select-box-acc-manager');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        data.employee_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
                        })
                    }
                }
            }
        )
    }

    function loadAccountOwner(id) {
        let ele = $('#select-box-contact');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('contact_list_not_map_account') && Array.isArray(data.contact_list_not_map_account)) {
                        ele.append(`<option selected></option>`)
                        data.contact_list_not_map_account.map(function (item) {
                            if (item.id === id) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.fullname + `</option>`)
                            } else
                                ele.append(`<option value="` + item.id + `">` + item.fullname + `</option>`)
                        })
                    }
                }
            }
        )
    }

    function loadAccountType() {
        let ele = $('#select-box-acc-type');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('account_type_list') && Array.isArray(data.account_type_list)) {
                        data.account_type_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    function loadIndustry() {
        let ele = $('#select-box-industry');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('industry_list') && Array.isArray(data.industry_list)) {
                        ele.append(`<option value="" selected></option>`)
                        data.industry_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    function loadAccountGroup() {
        let ele = $('#select-box-account-group');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('account_group_list') && Array.isArray(data.account_group_list)) {
                        ele.append(`<option value="" selected></option>`)
                        data.account_group_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                        })
                    }
                }
            }
        )
    }

    function loadParentAccount() {
        let ele = $('#select-box-parent-account');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                        ele.append(`<option selected></option>`)
                        data.account_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.name + `</option>`)
                        })
                    }
                }
            }
        )
    }

    function loadTableContact() {
        let dtb = $('#datatable-add-contact');
        let frm = new SetupFormSubmit(dtb);
        $.fn.callAjax(frm.dataUrl, "GET").then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    config['data'] = data.contact_list_not_map_account
                    initDataTableOffCanvas(config);
                }
            }
        )
    }

    $('#select-box-acc-type').select2();
    $('#select-box-acc-manager').select2();

    loadEmployee();
    loadAccountType();
    loadIndustry();
    loadAccountOwner(null);
    loadParentAccount();
    loadTableContact();
    loadAccountGroup();

    // button add contact in offCanvas
    function tableContactAdd() {
        let tableShowBodyOffModal = $('#datatable_contact_list tbody');

        while (tableShowBodyOffModal[0].rows.length > 0) {
            tableShowBodyOffModal[0].deleteRow(0);
        }

        let table = $('#datatable-add-contact').DataTable();
        let dataCheckedIndexes = table.rows('.selected').indexes();
        for (let idx = 0; idx < dataCheckedIndexes.length; idx++) {
            let dataChecked = table.rows(dataCheckedIndexes[idx]).data()[0];
            let rowNode = table.rows(dataCheckedIndexes[idx]).nodes()[0];
            if (rowNode.lastElementChild.children[0].firstElementChild.getAttribute('data-owner') === '1') {
                let trData = `<td><span>` + dataChecked.fullname + `</span><span class="field-required">*</span></td><td><span>` + dataChecked.job_title + `</span></td><td><span>` + dataChecked.phone + `</span></td><td><span>` + dataChecked.email + `</span></td>`;
                tableShowBodyOffModal.prepend(`<tr class="contact_primary" data-value="` + dataChecked.id + `">` + trData + `</tr>`);
            } else {
                let trData = `<td><span>` + dataChecked.fullname + `</span></td><td><span>` + dataChecked.job_title + `</span></td><td><span>` + dataChecked.phone + `</span></td><td><span>` + dataChecked.email + `</span></td>`;
                tableShowBodyOffModal.append(`<tr class="contact_selected" data-value="` + dataChecked.id + `">` + trData + `</tr>`);
            }
        }
        return false;
    }

    // button add Contact in table Contact
    $('#btn-add-contact').on('click', function () {
        tableContactAdd();
        if ($('#datatable_contact_list tr').filter('.contact_primary').length === 0) {
            $('#select-box-contact option:eq(0)').prop('selected', true);
            $('#job_title').val('');
        }
    })

    // Change Account Owner
    $('#select-box-contact').on('change', function () {
        let oldValue = $(this).data('oldValue');
        let newValue = $(this).val();
        let tableShowBodyOffModal = $('#datatable_contact_list tbody');

        let table = $("#datatable-add-contact").DataTable();
        let indexList = table.rows().indexes();

        if ($(this).val() === '') {
            while (tableShowBodyOffModal[0].rows.length > 0) {
                tableShowBodyOffModal[0].deleteRow(0);
            }
            $('#job_title').val('');
            for (let idx = 0; idx < indexList.length; idx++) {
                let rowNode = table.rows(indexList[idx]).nodes()[0]
                rowNode.classList.remove('selected');
                rowNode.lastElementChild.children[0].firstElementChild.checked = false;
                rowNode.lastElementChild.children[0].firstElementChild.setAttribute('data-owner', '0');
            }
        } else {
            let data_url = $(this).attr('data-url-detail').replace(0, $(this).val())
            $.fn.callAjax(data_url, $(this).attr('data-method')).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('contact_detail')) {
                            $('#job_title').val(data.contact_detail.job_title);
                            if ($('.contact_selected').length > 0 && $('.contact_selected').filter(`[data-value="` + newValue + `"]`))
                                $('.contact_selected').filter(`[data-value="` + newValue + `"]`).remove();
                            $('.contact_primary').remove();
                            tableShowBodyOffModal.prepend(`<tr class="contact_primary" data-value="` + newValue + `"><td><span>` + data.contact_detail.fullname.fullname + `</span><span class="field-required">*</span></td><td><span>` + data.contact_detail.job_title + `</span></td><td><span>` + data.contact_detail.phone + `</span></td><td><span>` + data.contact_detail.email + `</span></td></tr>`);
                            for (let idx = 0; idx < indexList.length; idx++) {
                                let rowNode = table.rows(indexList[idx]).nodes()[0]
                                if (data.contact_detail.id === rowNode.lastElementChild.children[0].firstElementChild.getAttribute('value')) {
                                    rowNode.classList.add('selected');
                                    rowNode.lastElementChild.children[0].firstElementChild.checked = true;
                                    rowNode.lastElementChild.children[0].firstElementChild.setAttribute('data-owner', '1');
                                } else if (oldValue === rowNode.lastElementChild.children[0].firstElementChild.getAttribute('value')) {
                                    rowNode.classList.remove('selected');
                                    rowNode.lastElementChild.children[0].firstElementChild.checked = false;
                                    rowNode.lastElementChild.children[0].firstElementChild.setAttribute('data-owner', '0');
                                }
                            }
                        }
                    }
                }
            )
        }
        $(this).data('oldValue', newValue);
    }).each(function () {
        $(this).data('oldValue', $(this).val());
    });

    $('#inp-individual').on('change', function () {
        $('#select-box-parent-account').prop('selectedIndex', -1);
        $('#select-box-parent-account').attr('disabled', true);
        $("#tax-code-label").removeClass("required");
        $("#total_employees_label").removeClass("required");
    })

    $('#inp-organization').on('change', function () {
        $('#select-box-parent-account').attr('disabled', false);
        $("#tax-code-label").addClass("required");
        $("#total_employees_label").addClass("required");
    })

    // Button add shipping address
    $('#edit-shipping-address-btn').on('click', function () {
        if ($('#list-shipping-address input').length === 0)
            $('#make-default-shipping-address').prop('checked', true);
    })

    // Button add billing address
    $('#edit-billing-address-btn').on('click', function () {
        let ele = $('#select-box-account-name')
        ele.html('');
        $('#edited-billing-address').val('');
        $('#button_add_new_billing_address').prop('hidden', true);
        $('#select-box-address').prop('hidden', false);
        $('#edited-billing-address').prop('hidden', true);
        $('#button_add_new_billing_address').html(`<i class="fas fa-plus-circle"></i> Add/Edit`)

        let list_emp = []
        $('#select-box-acc-manager').find('option:selected').each(function () {
            list_emp.push($(this).val());
        })

        let list_acc_map_emp = []
        let data_url = $('#select-box-acc-manager').attr('data-url-accounts')
        let data_method = $('#select-box-acc-manager').attr('data-method')
        $.fn.callAjax(data_url, data_method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('accounts_map_employee')) {
                        data.accounts_map_employee.map(function (item) {
                            if (list_emp.includes(item.employee)) {
                                if (!list_acc_map_emp.includes(item.account.id)) {
                                    list_acc_map_emp.push(item.account.id)
                                    ele.append(`<option value="` + item.account.id + `">` + item.account.name + `</option>`)
                                }
                            }
                        })
                    }
                }
            }
        )

        $('#inp-tax-code-address').val($('#inp-tax-code').val());
        $('#inp-email-address').val($('#inp-email').val());
        $('#select-box-account-name').prepend(`<option value="">` + $('#inp-account-name').val() + `</option>`)

        if ($('#list-billing-address input').length === 0)
            $('#make-default-billing-address').prop('checked', true);

        let select_box = $('#select-box-address')
        select_box.empty();
        select_box.append(`<option value="0" selected></option>`)
        $('#list-shipping-address').children().each(function () {
            if ($(this).find('input').prop('checked') === true)
                select_box.append(`<option value="` + $(this).find('label').text() + `">` + $(this).find('label').text() + `</option>`)
            else
                select_box.append(`<option value="` + $(this).find('label').text() + `">` + $(this).find('label').text() + `</option>`)
        });
    })

    // button event change select-box-account-name in modal billing address
    $('#select-box-account-name').on('change', function () {
        $('#edited-billing-address').val('');
        let id_account = $(this).find('option:selected').val();
        let select_box = $('#select-box-address');
        select_box.empty();
        select_box.append(`<option value="0" selected></option>`)

        if (id_account === '') {
            $('#button_add_new_billing_address').prop('hidden', true);
            $('#inp-tax-code-address').val($('#inp-tax-code').val());
            $('#inp-email-address').val($('#inp-email').val());

            $('#list-shipping-address').children().each(function () {
                if ($(this).find('input').prop('checked') === true)
                    select_box.append(`<option value="` + $(this).find('label').text() + `">` + $(this).find('label').text() + `</option>`)
                else
                    select_box.append(`<option value="` + $(this).find('label').text() + `">` + $(this).find('label').text() + `</option>`)
            });
        } else {
            $('#button_add_new_billing_address').prop('hidden', false);
            let url = $(this).attr('data-url').replace(0, id_account);
            let method = $(this).attr('data-method');
            $.fn.callAjax(url, method).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('account_detail')) {
                            $('#inp-email-address').val(data.account_detail.email);
                            $('#inp-tax-code-address').val(data.account_detail.tax_code);
                            data.account_detail.shipping_address.map(function (item) {
                                $('#select-box-address').append(`<option value="` + item + `">` + item + `</option>`)
                            })
                        }
                    }
                }
            )
        }
    })

    // Conditions for show offCanvas add Contact
    $('#add-contact-btn').on('click', function () {
        let allFieldsFilled = true;
        $('.inp-required').each(function () {
            if ($(this).val() === '') {
                allFieldsFilled = false;
            }
            return false;
        });
        $('.select2-required').each(function () {
            if ($(this).val().length === 0) {
                allFieldsFilled = false;
                return false;
            }
        });
        $('.select-required').each(function () {
            if ($(this).find('option:selected').val() === '') {
                allFieldsFilled = false;
                return false;
            }
        });
        // if (!allFieldsFilled) {
        //     $.fn.notifyB({description: "Not yet filled"}, 'warning')
        //     $('#offcanvasRight').offcanvas('hide');
        // } else {
        //     $('#offcanvasRight').offcanvas('show');
        // }
        $('#offcanvasRight').offcanvas('show');
    })

    // Form Create Account
    let frm = $('#form-create-account')
    frm.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();

        let shipping_address_list = [];
        $('#list-shipping-address input[type=radio]').each(function () {
            if ($(this).is(':checked')) {
                shipping_address_list.unshift($(this).next('label').text().trim());
            }
            else {
                shipping_address_list.push($(this).next('label').text().trim());
            }
        });

        let billing_address_list = [];
        $('#list-billing-address input[type=radio]').each(function () {
            if ($(this).is(':checked')) {
                billing_address_list.unshift($(this).next('label').text().trim());
            }
            else {
                billing_address_list.push($(this).next('label').text().trim());
            }
        });

        let frm = new SetupFormSubmit($(this));

        if (frm.dataForm['code'] === '') {
            frm.dataForm['code'] = null;
        }

        if (frm.dataForm['parent_account'] === '') {
            frm.dataForm['parent_account'] = null;
        }

        if (frm.dataForm['tax_code'] === '') {
            frm.dataForm['tax_code'] = null;
        }

        if ($('#select-box-annual-revenue').val() === '0') {
            frm.dataForm['annual_revenue'] = null;
        }

        if ($('#select-box-total-emp').val() === '0') {
            frm.dataForm['total_employees'] = null;
        }

        if ($('#select-box-acc-manager').val().length > 0) {
            frm.dataForm['manager'] = $('#select-box-acc-manager').val();
        }

        if ($('#select-box-acc-type').val().length > 0) {
            frm.dataForm['account_type'] = $('#select-box-acc-type').val();
        }

        if ($('#inp-organization').is(':checked')) {
            frm.dataForm['account_type_selection'] = 1;
        } else {
            frm.dataForm['account_type_selection'] = 0;
        }

        frm.dataForm['contact_select_list'] = $('.contact_selected').map(function () {
            return $(this).attr('data-value');
        }).get();
        frm.dataForm['contact_primary'] = $('.contact_primary').attr('data-value');

        frm.dataForm['shipping_address'] = shipping_address_list;
        frm.dataForm['billing_address'] = billing_address_list;
        frm.dataForm['shipping_address_id_dict'] = shipping_address_id_dict;
        frm.dataForm['billing_address_id_dict'] = billing_address_id_dict;

        frm.dataForm['system_status'] = 1; // save, not draft

        WindowControl.showLoading();
        $.fn.callAjax2({url: frm.dataUrl, method:frm.dataMethod, data: frm.dataForm, urlRedirect: frm.dataUrlRedirect})
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        setTimeout(() => {
                            window.location.replace($(this).attr('data-url-redirect'));
                            location.reload.bind(location);
                        }, 1000);
                    }

                },
                (errs) => {
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                        },
                        1000
                    )
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    });

    // process address
    $('#select-box-address').on('change', function () {
        $('#edited-billing-address').val($(this).find('option:selected').text());
    })

    $('#button_add_new_billing_address').on('click', function () {
        if ($('#button_add_new_billing_address i').attr('class') === 'fas fa-plus-circle') {
            $(this).html(`<i class="bi bi-backspace-fill"></i> Select`);
            $('#select-box-address').prop('hidden', true);
            $('#edited-billing-address').prop('hidden', false);
        } else {
            $(this).html(`<i class="fas fa-plus-circle"></i> Add/Edit`)
            $('#select-box-address').prop('hidden', false);
            $('#edited-billing-address').prop('hidden', true);
        }
    })

    // show modal add new contact
    $('#btn-add-new-contact').on('click', function () {
        let ele = $('#select-box-contact-owner');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $('#modal-add-new-contact input').val('');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        ele.append(`<option selected></option>`)
                        data.employee_list.map(function (item) {
                            ele.append(`<option value="` + item.id + `">` + item.full_name + `</option>`)
                        })
                    }
                }
            }
        )
    })

    // function reload table add contact after add contact
    function initDataTableOffCanvas(config) {
        let dtb = $('#datatable-add-contact');
        if (dtb.length > 0) {
            let targetDt = dtb.DataTable(config);
            let indexList = targetDt.rows().indexes();
            $('#datatable_contact_list tr').each(function () {
                let rowValue = $(this).attr('data-value');
                for (let idx = 0; idx < indexList.length; idx++) {
                    let rowNode = targetDt.rows(indexList[idx]).nodes()[0]
                    if (rowValue === rowNode.lastElementChild.children[0].firstElementChild.getAttribute('value')) {
                        if ($(this).hasClass('contact_primary')) {
                            rowNode.lastElementChild.children[0].firstElementChild.setAttribute('data-owner', '1');
                        } else {
                            rowNode.lastElementChild.children[0].firstElementChild.setAttribute('data-owner', '0')
                        }
                        rowNode.classList.add('selected');
                        rowNode.lastElementChild.children[0].firstElementChild.checked = true;
                    }
                }
            })
        }
    }

    $('#save-modal-add-new-contact').on('click', function () {
        let contact_name = $('#inp-fullname').val();
        let contact_owner = $('#select-box-contact-owner').val();
        let job_title = $('#inp-jobtitle').val();
        let contact_email = $('#inp-email-contact').val();
        let contact_mobile = $('#inp-mobile').val();
        let contact_phone = $('#inp-phone').val();
        let data = {
            'owner': contact_owner,
            'fullname': contact_name,
            'job_title': job_title,
            'email': contact_email,
            'phone': contact_phone,
            'mobile': contact_mobile
        }
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        $.fn.callAjax($(this).attr('data-url'), $(this).attr('data-method'), data, csr).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    //reload select box account owner
                    let id_contact_primary = null;
                    if ($('#datatable_contact_list .contact_primary').length !== 0) {
                        id_contact_primary = $('#datatable_contact_list .contact_primary').attr('data-value');
                    }

                    loadAccountOwner(id_contact_primary);
                    $('#table-offcanvas').empty();
                    $('#table-offcanvas').append(ele_table_offcanvas);

                    // reload datatable contact in offCanvas
                    let table = $('#datatable-add-contact')
                    $.fn.callAjax(table.attr('data-url'), table.attr('data-method')).then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('contact_list_not_map_account')) {
                                config['data'] = resp.data.contact_list_not_map_account;
                            }
                            initDataTableOffCanvas(config, '#datatable-add-contact');
                        }
                    }, (errs) => {
                        initDataTableOffCanvas(config, '#datatable-add-contact');
                    },)

                    $('#modal-add-new-contact').hide();
                    $('#offcanvasRight').offcanvas('show');
                }
            },
            (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            })
    })

    // select all checkbox in offCanvas
    $(document).on('click', '#datatable-add-contact .check-select', function () {
        if ($(this).is(":checked")) {
            $(this).closest('tr').addClass('selected');
        } else {
            $(this).closest('tr').removeClass('selected');
            $('.check-select-all').prop('checked', false);
        }
    });
    $('#datatable-add-contact .check-select-all').on('click', function () {
        $('.check-select').attr('checked', true);
        let table = $('#datatable-add-contact').DataTable();
        let indexList = table.rows().indexes();
        if ($(this).is(":checked")) {
            for (let idx = 0; idx < indexList.length; idx++) {
                let rowNode = table.rows(indexList[idx]).nodes()[0];
                rowNode.classList.add('selected');
                rowNode.lastElementChild.children[0].firstElementChild.checked = true;
            }
            $('.check-select').prop('checked', true);
        } else {
            for (let idx = 0; idx < indexList.length; idx++) {
                let rowNode = table.rows(indexList[idx]).nodes()[0];
                rowNode.classList.remove("selected");
                rowNode.firstElementChild.children[0].firstElementChild.checked = false;
            }
            $('.check-select').prop('checked', false);
        }
    });
});
