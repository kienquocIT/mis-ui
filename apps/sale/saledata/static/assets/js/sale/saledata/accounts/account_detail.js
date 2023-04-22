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
                        list_shipping_address += `<div className="form-check ml-5">
                                <input className="form-check-input" type="radio" name="shippingaddressRadio" id="shippingaddressRadio0" checked>
                                <label className="form-check-label" htmlFor="shippingaddressRadio0">`+ data.shipping_address[i] +`</label>
                           </div>`;
                    }
                    else {
                        list_shipping_address += `<div className="form-check ml-5">
                                <input className="form-check-input" type="radio" name="shippingaddressRadio" id="shippingaddressRadio0">
                                <label className="form-check-label" htmlFor="shippingaddressRadio0">`+ data.shipping_address[i] +`</label>
                           </div>`;
                    }
                }
                $('#list-shipping-address').html(list_shipping_address);

                let list_billing_address = ``
                for (let i = 0; i < data.billing_address.length; i++) {
                    let billing_address = data.billing_address[i];
                    if (i === 0) {
                        list_billing_address += `<div className="form-check ml-5">
                                <input className="form-check-input" type="radio" name="billingaddressRadio" id="billingaddressRadio0" checked>
                                <label className="form-check-label" htmlFor="billingaddressRadio0">`+ billing_address + `</label>
                           </div>`;
                    }
                    else {
                        list_billing_address += `<div className="form-check ml-5">
                                <input className="form-check-input" type="radio" name="billingaddressRadio" id="billingaddressRadio0">
                                <label className="form-check-label" htmlFor="billingaddressRadio0">`+ billing_address + `</label>
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
            }
        })
})