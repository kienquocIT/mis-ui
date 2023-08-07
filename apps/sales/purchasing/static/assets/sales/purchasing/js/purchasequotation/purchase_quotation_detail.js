$(function () {
    $(document).ready(function () {
        const tax_list = JSON.parse($('#tax_list').text());
        // const purchase_quotation_request_list = JSON.parse($('#purchase_quotation_request_list').text());

        let url_detail = $('#form-detail-purchase-quotation').attr('data-url-detail').replace('0', $.fn.getPkDetail())
        $.fn.callAjax(url_detail, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $('#supplier-select-box').select2();
                $('#contact-select-box').select2();
                $('#pqr-select-box').select2();

                let data_detail = data.purchase_quotation_detail;
                $('#code-span').text(data_detail.code);
                $('#title').val(data_detail.title);
                LoadSupplierSelectBox(data_detail.supplier_mapped);
                LoadContactSelectBox(data_detail.contact_mapped);
                if (Object.keys(data_detail.purchase_quotation_request_mapped).length != 0) {
                    LoadPurchaseQuotationRequestSelectBox(data_detail.purchase_quotation_request_mapped);
                }
                $('#expiration_date').val(data_detail.expiration_date.split(' ')[0]);
                $('#lead-time-from').val(data_detail.lead_time_from);
                $('#lead-time-to').val(data_detail.lead_time_to);
                $('#lead-time-type').val(data_detail.lead_time_type);
                $('#note').val(data_detail.note);

                $('#table-purchase-quotation-products-selected').DataTable().destroy();
                $('#table-purchase-quotation-products-selected').DataTableDefault({
                    reloadCurrency: true,
                    paging: false,
                    dom: "",
                    data: data_detail.products_mapped,
                    columns: [
                        {
                            data: 'index',
                            className: 'wrap-text text-center w-5',
                            render: (data, type, row, meta) => {
                                return row.index;
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                return `<span class="product-title" data-product-id="${row.product.id}">${row.product.title}</span>`;
                            }
                        },
                        {
                            data: 'description',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                return `<textarea readonly class="product-description form-control" style="height: 38px">${row.description}</textarea>`;
                            }
                        },
                        {
                            data: 'uom',
                            className: 'wrap-text w-10 text-center',
                            render: (data, type, row, meta) => {
                                return `<span class="product-uom" data-product-uom-id="${row.product.uom.id}">${row.product.uom.title}</span>`;
                            }
                        },
                        {
                            data: 'quantity',
                            className: 'wrap-text w-10 text-center',
                            render: (data, type, row, meta) => {
                                return `<span class="product-quantity">${row.quantity}</span>`;
                            }
                        },
                        {
                            data: 'pr_unit_price',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                return `<input readonly type="text" class="pr-unit-price-input form-control mask-money" data-return-type="number" value="${row.unit_price}">`;
                            }
                        },
                        {
                            data: 'tax',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                let html = ``;
                                html += `<option data-rate="0"></option>`;
                                for (let i = 0; i < tax_list.length; i++) {
                                    if (tax_list[i].id === row.product.tax.id) {
                                        html += `<option selected data-rate="${tax_list[i].rate}" value="${tax_list[i].id}">${tax_list[i].code} (${tax_list[i].rate}%)</option>`;
                                    }
                                    else {
                                        html += `<option data-rate="${tax_list[i].rate}" value="${tax_list[i].id}">${tax_list[i].code} (${tax_list[i].rate}%)</option>`;
                                    }
                                }
                                // <span class="badge badge-primary" data-tax-value="${row.tax_value}">${row.tax_code}</span>
                                return `<select style="color: #6f6f6f" disabled class="form-select product-tax-select-box" data-method="GET">` + html + `</select>`;
                            }
                        },
                        {
                            data: 'pr_subtotal_price',
                            className: 'wrap-text w-15 text-center',
                            render: (data, type, row, meta) => {
                                return `<span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${row.subtotal_price}"></span>`;
                            }
                        },
                    ],
                })

                $('#pretax-value').attr('data-init-money', data_detail.pretax_price);
                $('#taxes-value').attr('data-init-money', data_detail.taxes_price);
                $('#total-value').attr('data-init-money', data_detail.total_price);
                $.fn.initMaskMoney2();

                $('.form-control').prop('readonly', true);
                $('.select2').prop('disabled', true);
            }
        })

        function LoadSupplierSelectBox(supplier_selected) {
            $('#supplier-select-box option').remove();
            $('#supplier-select-box').append(`<option value="${supplier_selected.id}" selected>${supplier_selected.name}</option>`)
        }

        function LoadContactSelectBox(contact_selected) {
            $('#contact-select-box option').remove();
            $('#contact-select-box').append(`<option value="${contact_selected.id}" selected>${contact_selected.fullname}</option>`)
        }

        function LoadPurchaseQuotationRequestSelectBox(pqr_selected) {
            $('#pqr-select-box option').remove();
            $('#pqr-select-box').append(`<option value="${pqr_selected.id}" selected>${pqr_selected.code}</option>`)
        }
    })
})