$(function () {
    $(document).ready(function () {
        const tax_list = JSON.parse($('#tax_list').text());
        const purchase_request_list = JSON.parse($('#purchase_request_list').text());

        let url_detail = $('#form-detail-purchase-quotation-request').attr('data-url-detail').replace('0', $.fn.getPkDetail())
        $.fn.callAjax(url_detail, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                console.log(data)
                let data_detail = data.purchase_quotation_request_detail;
                $('#code-span').text(data_detail.code);
                $('#title').val(data_detail.title);
                LoadPurchaseRequestSelectBox(data_detail.purchase_requests);
                $('#delivery_date').val(data_detail.delivered_date.split(' ')[0]);
                $('#note').val(data_detail.note);

                $('#table-purchase-quotation-request-products-selected').DataTable().destroy();
                $('#table-purchase-quotation-request-products-selected').DataTableDefault({
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

        function LoadPurchaseRequestSelectBox(purchase_request_list_selected) {
            $('#purchase-request-select-box option').remove();
            for (let i = 0; i < purchase_request_list.length; i++) {
                if (purchase_request_list_selected.includes(purchase_request_list[i].id)) {
                    $('#purchase-request-select-box').append(`<option value="${purchase_request_list[i].id}" selected>${purchase_request_list[i].code}</option>`)
                }
            }
            $('#purchase-request-select-box').select2();
        }
    })
})