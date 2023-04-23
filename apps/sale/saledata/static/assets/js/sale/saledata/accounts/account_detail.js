$(document).ready(function () {
    // load data detail
    let pk = window.location.pathname.split('/').pop();
    let url_loaded = $('#form-detail-account').attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['account_detail'];
                console.log(data);
                $('#account-title-id').val(data.name);
                $('#account-code-id').val(data.code);
                $('#account-website-id').val(data.website);
                if (data.owner !== {}) {
                    $('#account-owner-id').val(data.owner.fullname);
                    $('#owner-job-title-id').val(data.owner.job_title);
                    $('#owner-email-id').val(data.owner.email);
                    $('#owner-mobile-id').val(data.owner.mobile);
                }
                $('#phone-number-id').val(data.phone);
                $('#account-email-id').val(data.email);
                $('#account-tax-code-id').val(data.tax_code);

                let list_shipping_address = ``;
                for (let i = 0; i < data.shipping_address.length; i++) {
                    if (i === 0) {
                        list_shipping_address += `<div class="form-check ml-5">
                                <input class="form-check-input" type="radio" name="shippingaddressRadio" id="shippingaddressRadio0" checked>
                                <label class="form-check-label" for="shippingaddressRadio0">`+ data.shipping_address[i] +`</label>
                           </div>`;
                    }
                    else {
                        list_shipping_address += `<div class="form-check ml-5">
                                <input class="form-check-input" type="radio" name="shippingaddressRadio" id="shippingaddressRadio0">
                                <label class="form-check-label" for="shippingaddressRadio0">`+ data.shipping_address[i] +`</label>
                           </div>`;
                    }
                }
                $('#list-shipping-address').html(list_shipping_address);

                let list_billing_address = ``
                for (let i = 0; i < data.billing_address.length; i++) {
                    let billing_address = data.billing_address[i];
                    if (i === 0) {
                        list_billing_address += `<div class="form-check ml-5">
                                <input class="form-check-input" type="radio" name="billingaddressRadio" id="billingaddressRadio0" checked>
                                <label class="form-check-label" for="billingaddressRadio0">`+ billing_address + `</label>
                           </div>`;
                    }
                    else {
                        list_billing_address += `<div class="form-check ml-5">
                                <input class="form-check-input" type="radio" name="billingaddressRadio" id="billingaddressRadio0">
                                <label class="form-check-label" for="billingaddressRadio0">`+ billing_address + `</label>
                           </div>`;
                    }
                }
                $('#list-billing-address').html(list_billing_address)

                function load_contact_mapped(contact_mapped) {
                    if (!$.fn.DataTable.isDataTable('#datatable_contact_mapped_list')) {
                        let dtb = $('#datatable_contact_mapped_list');
                        dtb.DataTableDefault({
                            data: contact_mapped,
                            columns: [
                                {
                                    render: (data, type, row, meta) => {
                                        return ''
                                    }
                                },
                                {
                                    data: 'fullname', render: (data, type, row, meta) => {
                                        return `<a href="/saledata/contact/` + row.id + `"><span><b>` + data + `</b></span></a>`
                                    }
                                },
                                {
                                    data: 'job_title', render: (data, type, row, meta) => {
                                        return `<span class="badge badge-soft-danger badge-pill span-product-type" style="min-width: 100%; width: 100%">` + data + `</span>`
                                    }
                                },
                                {
                                    data: 'mobile', render: (data, type, row, meta) => {
                                        return `<span class="badge badge-soft-blue badge-pill span-product-type" style="min-width: 100%; width: 100%">` + data + `</span>`
                                    }
                                },
                                {
                                    data: 'email', render: (data, type, row, meta) => {
                                        return `<span class="badge badge-soft-green badge-pill span-product-type" style="min-width: 100%; width: 100%">` + data + `</span>`
                                    }
                                },
                            ],
                        });
                    }
                }

                load_contact_mapped(data.contact_mapped);
                loadAccountType(data.account_type.map(obj => obj.id));
                if ($.inArray("organization", data.account_type.map(obj => obj.detail)) !== -1) {
                    $('#parent-account-id').attr('disabled', false);
                }

                loadIndustry(data.industry);

                $('#account-revenue-id').find(`option[value="` + data.annual_revenue + `"]`).prop('selected', true);
                $('#total-employees-id').find(`option[value="` + data.total_employees + `"]`).prop('selected', true);

                loadParentAccount(data.parent_account);
            }
        })

    // load Account Type SelectBox
    function loadAccountType(account_type_mapped) {
        let ele = $('#account-type-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('account_type_list') && Array.isArray(data.account_type_list)) {
                        data.account_type_list.map(function (item) {
                            if (account_type_mapped.includes(item.id)) {
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
    $('#account-type-id').select2();
    // condition to choosing ParentAccount
    $('#account-type-id').on('change', function () {
        let selected_acc_type = $('#account-type-id option:selected').filter(function () {
            return $(this).text().toLowerCase() === 'customer'
        })

        if (selected_acc_type.length > 0) {
            $('#parent-account-id').attr('disabled', false);
        } else {
            $('#parent-account-id').attr('disabled', true);
        }

    });

    // load Industry SelectBox
    function loadIndustry(industry_mapped) {
        let ele = $('#account-industry-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('industry_list') && Array.isArray(data.industry_list)) {
                        data.industry_list.map(function (item) {
                            if (industry_mapped === item.id) {
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
    $('#account-industry-id').select2();

    // load Parent Account SelectBox
    function loadParentAccount(parent_account_mapped) {
        let ele = $('#parent-account-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                        ele.append(`<option value="0"></option>`)
                        data.account_list.map(function (item) {
                            if (parent_account_mapped === item.id) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.name + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.name + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }
    $('#parent-account-id').select2();
})