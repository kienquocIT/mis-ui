$(function () {
    $(document).ready(function () {
        const tax_list = JSON.parse($('#tax_list').text());
        const product_list = JSON.parse($('#product_list').text());
        const unit_of_measure = JSON.parse($('#unit_of_measure_list').text());
        const purchase_request_list = JSON.parse($('#purchase_request_list').text());

        $('#purchase-request-select-box').prop('disabled', true);
        $('#delivery_date').dateRangePickerDefault({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: true,
            minYear: 1901,
            locale: {
                format: 'YYYY-MM-DD'
            },
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY'), 10)
        });
        $('#delivery_date').val('');

        function LoadPurchaseRequestSelectBox(purchase_request_list_selected) {
            $('#purchase-request-select-box option').remove();
            for (let i = 0; i < purchase_request_list.length; i++) {
                if (purchase_request_list_selected.includes(purchase_request_list[i].id)) {
                    $('#purchase-request-select-box').append(`<option value="${purchase_request_list[i].id}" selected>${purchase_request_list[i].code}</option>`)
                }
            }
            $('#purchase-request-select-box').select2();
        }

        LoadPurchaseRequestSelectBox([]);

        function LoadPurchaseRequestTable() {
            if (!$.fn.DataTable.isDataTable('#table-select-purchase-request')) {
                let dtb = $('#table-select-purchase-request');
                let PR_code_badge_style = [
                    'badge-soft-primary',
                    'badge-soft-danger',
                    'badge-soft-blue',
                    'badge-soft-orange',
                    'badge-soft-green',
                    'badge-soft-secondary',
                    'badge-soft-warning',
                    'badge-soft-orange',
                    'badge-soft-brown',
                    'badge-soft-indigo',
                ]
                let last_purchase_request_code = '';
                let style_order = -1;
                dtb.DataTableDefault({
                    paging: false,
                    dom: "<'row mt-3 miner-group'>" + "<'row mt-3'<'col-sm-12'tr>>",
                    data: purchase_request_list,
                    columns: [
                        {
                            data: '',
                            className: 'wrap-text w-10',
                            render: (data, type, row, meta) => {
                                return `<input id="${row.id}" type="checkbox" class="form-check-purchase-request">`;
                            }
                        },
                        {
                            data: 'code',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                if (last_purchase_request_code !== row.code) {
                                    last_purchase_request_code = row.code;
                                    if (style_order === 9) {
                                        style_order = -1;
                                    }
                                    style_order = style_order + 1;
                                }
                                return `<span class="pr-code-span badge ` + PR_code_badge_style[style_order] + ` w-100">${row.code}</span>`;
                            }
                        },
                        {
                            data: 'title',
                            className: 'wrap-text- w-60',
                            render: (data, type, row, meta) => {
                                return row.title;
                            }
                        },
                    ],
                });
            }
            $('#table-select-purchase-request-products').DataTableDefault({
                paging: false,
                dom: "<'row mt-3 miner-group'>" + "<'row mt-3'<'col-sm-12'tr>>"
            })
            $('#table-select-purchase-request-products-for-merge').DataTableDefault({
                paging: false,
                dom: "<'row mt-3 miner-group'>" + "<'row mt-3'<'col-sm-12'tr>>"
            })
        }

        LoadPurchaseRequestTable();

        function LoadPurchaseRequestProductsTable() {
            let PR_code_badge_style = [];
            let purchase_request_products_data = [];
            $('.form-check-purchase-request:checked').each(function (i, e) {
                PR_code_badge_style.push($(this).closest('tr').find('.pr-code-span').attr('class'))
                let purchase_request_get = $(this).attr('id');
                purchase_request_products_data = purchase_request_products_data.concat(
                    purchase_request_list.filter(function (element) {
                        return element.id === purchase_request_get
                    })[0].product_list
                )
            })
            let last_purchase_request_code = '';
            let style_order = -1;
            $('#table-select-purchase-request-products').DataTable().destroy();
            $('#table-select-purchase-request-products').DataTableDefault({
                paging: false,
                dom: "<'row mt-3 miner-group'>" + "<'row mt-3'<'col-sm-12'tr>>",
                data: purchase_request_products_data,
                columns: [
                    {
                        data: '',
                        className: 'wrap-text w-10',
                        render: (data, type, row, meta) => {
                            return `<input id="${row.id}" data-title="${row.title}"data-uom-id="${row.uom.id}" data-uom-title="${row.uom.title}" data-quantity="${row.quantity}" data-pr-unit-price="${row.product_unit_price}" data-tax-id="${row.tax.id}" data-tax-value="${row.tax.value}" data-tax-code="${row.tax.code}" data-pr-code="${row.purchase_request_code}" type="checkbox" class="form-check-purchase-request-products">`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-30',
                        render: (data, type, row, meta) => {
                            return row.title;
                        }
                    },
                    {
                        data: 'purchase_request_code',
                        className: 'wrap-text w-20 text-center',
                        render: (data, type, row, meta) => {
                            if (last_purchase_request_code !== row.purchase_request_code) {
                                last_purchase_request_code = row.purchase_request_code;
                                style_order = style_order + 1;
                            }
                            return `<span class="badge ` + PR_code_badge_style[style_order] + ` w-80">${row.purchase_request_code}</span>`;
                        }
                    },
                    {
                        data: 'uom',
                        className: 'wrap-text w-20 text-center',
                        render: (data, type, row, meta) => {
                            return row.uom.title;
                        }
                    },
                    {
                        data: 'quantity',
                        className: 'wrap-text w-20 text-center',
                        render: (data, type, row, meta) => {
                            return row.quantity;
                        }
                    },
                ],
            })
        }

        function Group(data) {
            return data.reduce(function (acc, curr) {
                let found = acc.find(function (arr) {
                    return arr[0].id === curr.id;
                });

                if (found) {
                    found.push(curr);
                } else {
                    acc.push([curr]);
                }

                return acc;
            }, []);
        }

        function GetSmallestRatioElement(data) {
            return data.reduce(function (minElement, currentElement) {
                if (currentElement.uom.ratio < minElement.uom.ratio) {
                    return currentElement;
                } else {
                    return minElement;
                }
            }, data[0]);
        }

        function LoadPurchaseRequestProductsTableForMerge(product_id_list) {
            let pr_products_data = [];
            $('.form-check-purchase-request:checked').each(function (i, e) {
                let purchase_request_get = $(this).attr('id');
                pr_products_data = pr_products_data.concat(
                    purchase_request_list.filter(function (element) {
                        return element.id === purchase_request_get
                    })[0].product_list
                )
            })
            let pr_products_pre_merge_data = [];
            for (let i = 0; i < pr_products_data.length; i++) {
                let temp = pr_products_data[i];
                let product_get = product_id_list.filter(function (element) {
                    return element.product_id === temp.id && element.pr_code === temp.purchase_request_code && element.uom_id === temp.uom.id
                })
                if (product_get.length > 0) {
                    pr_products_pre_merge_data.push(temp)
                }
            }

            let pre_merge_data_group_by_product_id = Group(pr_products_pre_merge_data)

            let pr_products_merge_data = [];
            for (let i = 0; i < pre_merge_data_group_by_product_id.length; i++) {
                let temp = pre_merge_data_group_by_product_id[i];
                let smallestRatioElement = GetSmallestRatioElement(temp);

                let sum_converted_item = 0;
                for (let j = 0; j < temp.length; j++) {
                    sum_converted_item += temp[j].quantity * parseFloat(temp[j].uom.ratio) / parseFloat(smallestRatioElement.uom.ratio);
                }

                let pr_code_list = temp.map(function (item) {
                    return item.purchase_request_code;
                });

                pr_products_merge_data.push(
                    {
                        "id": temp[0].id,
                        "title": temp[0].title,
                        "uom": Object.keys(smallestRatioElement.uom).length > 0 ? smallestRatioElement.uom : {},
                        "quantity": sum_converted_item,
                        "purchase_request_code_list": pr_code_list,
                        "product_unit_price": smallestRatioElement.product_unit_price,
                        "tax": Object.keys(smallestRatioElement.tax).length > 0 ? smallestRatioElement.tax : {}
                    }
                )
            }

            $('#table-select-purchase-request-products-for-merge').DataTable().destroy();
            $('#table-select-purchase-request-products-for-merge').DataTableDefault({
                paging: false,
                dom: "<'row mt-3 miner-group'>" + "<'row mt-3'<'col-sm-12'tr>>",
                data: pr_products_merge_data,
                columns: [
                    {
                        data: '',
                        className: 'wrap-text w-10',
                        render: (data, type, row, meta) => {
                            return `<input checked id="${row.id}" data-title="${row.title}" data-uom-id="${row.uom.id}" data-uom-title="${row.uom.title}" data-quantity="${row.quantity}" data-pr-unit-price="${row.product_unit_price}" data-tax-id="${row.tax.id}" data-tax-value="${row.tax.value}" data-tax-code="${row.tax.code}" type="checkbox" class="form-check-purchase-request-products-for-merge">`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-30',
                        render: (data, type, row, meta) => {
                            return row.title;
                        }
                    },
                    {
                        data: 'purchase_request_code_list',
                        className: 'wrap-text w-20 text-center',
                        render: (data, type, row, meta) => {
                            let html = ``;
                            for (let i = 0; i < row.purchase_request_code_list.length; i++) {
                                let style = null;
                                $('#table-select-purchase-request tbody').find('.pr-code-span').each(function (index, element) {
                                    if ($(this).text() === row.purchase_request_code_list[i]) {
                                        style = $(this).attr('class');
                                    }
                                })
                                html += `<span class="` + style + ` w-80 mb-1">${row.purchase_request_code_list[i]}</span>`;
                            }
                            return html;
                        }
                    },
                    {
                        data: 'uom',
                        className: 'wrap-text w-20 text-center',
                        render: (data, type, row, meta) => {
                            return row.uom.title;
                        }
                    },
                    {
                        data: 'quantity',
                        className: 'wrap-text w-20 text-center',
                        render: (data, type, row, meta) => {
                            return row.quantity;
                        }
                    },
                ],
            })
        }

        $(document).on("change", '.form-check-purchase-request', function () {
            LoadPurchaseRequestProductsTable();
            $('#btn_create_new_purchase_quotation_request').addClass('disabled');
            $('#table-select-purchase-request-products-div').prop('hidden', false);
            $('#table-select-purchase-request-products-for-merge-div').prop('hidden', true);
            $('#merge').prop('disabled', true);
            $('#merge').prop('checked', false);
        })

        $(document).on("change", '.form-check-purchase-request-products', function () {
            if ($('.form-check-purchase-request-products:checked').length > 0) {
                $('#btn_create_new_purchase_quotation_request').removeClass('disabled');
                $('#merge').prop('disabled', false);
            } else {
                $('#btn_create_new_purchase_quotation_request').addClass('disabled');
                $('#merge').prop('disabled', true);
            }
        })

        $(document).on("change", '#merge', function () {
            if ($(this).is(':checked')) {
                let product_id_list = [];
                $('.form-check-purchase-request-products:checked').each(function (i, e) {
                    product_id_list.push({
                        'product_id': $(this).attr('id'),
                        'pr_code': $(this).attr('data-pr-code'),
                        'uom_id': $(this).attr('data-uom-id')
                    })
                })
                LoadPurchaseRequestProductsTableForMerge(product_id_list);
                $('#table-select-purchase-request-products-div').prop('hidden', true);
                $('#table-select-purchase-request-products-for-merge-div').prop('hidden', false);
            } else {
                $('#table-select-purchase-request-products-div').prop('hidden', false);
                $('#table-select-purchase-request-products-for-merge-div').prop('hidden', true);
            }
        })

        $('#purchase-request-select-box-div').on('click', function () {
            $('#create_purchase_quotation_request_modal').addClass('show');
            $('#create_purchase_quotation_request_modal').css('display', 'block');
        })

        $('#close_modal_create_purchase_quotation_request').on('click', function () {
            $('#create_purchase_quotation_request_modal').removeClass('show');
            $('#create_purchase_quotation_request_modal').css('display', 'none');
        })

        $(window).on('click', function (event) {
            if (event.target === $('#create_purchase_quotation_request_modal')[0]) {
                $('#create_purchase_quotation_request_modal').removeClass('show');
                $('#create_purchase_quotation_request_modal').css('display', 'none');
            }
        });

        $('#btn_create_new_purchase_quotation_request').on('click', function () {
            let pr_selected = [];
            $('.form-check-purchase-request:checked').each(function (index, element) {
                pr_selected.push($(this).attr('id'));
            })
            LoadPurchaseRequestSelectBox(pr_selected);

            $('#create_purchase_quotation_request_modal').removeClass('show');
            $('#create_purchase_quotation_request_modal').css('display', 'none');

            let purchase_request_products_selected_data = [];
            let index = 0;
            let pretax_value = 0;
            let taxes_value = 0;
            let total_value = 0;

            let product_element = $('.form-check-purchase-request-products:checked');
            if ($('#merge').is(':checked')) {
                product_element = $('.form-check-purchase-request-products-for-merge:checked');
            }

            product_element.each(function (i, e) {
                index += 1;
                let pr_unit_price = parseFloat($(this).attr('data-pr-unit-price'));
                let quantity = parseFloat($(this).attr('data-quantity'));
                let tax_value = parseFloat($(this).attr('data-tax-value'));
                let current_pretax_value = pr_unit_price * quantity;

                pretax_value += current_pretax_value;
                taxes_value += current_pretax_value * tax_value / 100;
                total_value += current_pretax_value + current_pretax_value * tax_value / 100;
                purchase_request_products_selected_data.push({
                    'index': index,
                    'product_id': $(this).attr('id'),
                    'product_title': $(this).attr('data-title'),
                    'uom_id': $(this).attr('data-uom-id'),
                    'uom_title': $(this).attr('data-uom-title'),
                    'quantity': $(this).attr('data-quantity'),
                    'pr_unit_price': $(this).attr('data-pr-unit-price'),
                    'tax_id': $(this).attr('data-tax-id'),
                    'tax_value': $(this).attr('data-tax-value'),
                    'tax_code': $(this).attr('data-tax-code'),
                    'pr_subtotal_price': current_pretax_value + current_pretax_value * tax_value / 100,
                })
            })

            $('#pretax-value').attr('data-init-money', pretax_value);
            $('#taxes-value').attr('data-init-money', taxes_value);
            $('#total-value').attr('data-init-money', total_value);

            $('#table-purchase-quotation-request-products-selected').DataTable().destroy();
            $('#table-purchase-quotation-request-products-selected').DataTableDefault({
                reloadCurrency: true,
                paging: false,
                dom: "",
                data: purchase_request_products_selected_data,
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
                            return `<span class="product-title" data-product-id="${row.product_id}">${row.product_title}</span>`;
                        }
                    },
                    {
                        data: 'description',
                        className: 'wrap-text w-15',
                        render: (data, type, row, meta) => {
                            return `<textarea class="product-description form-control" style="height: 38px"></textarea>`;
                        }
                    },
                    {
                        data: 'uom',
                        className: 'wrap-text w-10 text-center',
                        render: (data, type, row, meta) => {
                            return `<span class="product-uom" data-product-uom-id="${row.uom_id}">${row.uom_title}</span>`;
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
                            return `<input type="text" class="pr-unit-price-input form-control mask-money" data-return-type="number" value="${row.pr_unit_price}">`;
                        }
                    },
                    {
                        data: 'tax',
                        className: 'wrap-text w-15',
                        render: (data, type, row, meta) => {
                            let html = ``;
                            html += `<option data-rate="0"></option>`;
                            for (let i = 0; i < tax_list.length; i++) {
                                if (tax_list[i].id === row.tax_id) {
                                    html += `<option selected data-rate="${tax_list[i].rate}" value="${tax_list[i].id}">${tax_list[i].code} (${tax_list[i].rate}%)</option>`;
                                } else {
                                    html += `<option data-rate="${tax_list[i].rate}" value="${tax_list[i].id}">${tax_list[i].code} (${tax_list[i].rate}%)</option>`;
                                }
                            }
                            // <span class="badge badge-primary" data-tax-value="${row.tax_value}">${row.tax_code}</span>
                            return `<select class="form-select product-tax-select-box" data-method="GET">` + html + `</select>`;
                        }
                    },
                    {
                        data: 'pr_subtotal_price',
                        className: 'wrap-text w-15 text-center',
                        render: (data, type, row, meta) => {
                            return `<span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${row.pr_subtotal_price}"></span>`;
                        }
                    },
                ],
            })
        })

        function calculate_price(table_tr) {
            let sum_price_pre_tax_value = 0;
            let sum_tax_value = 0;
            let sum_price_after_tax_value = 0;
            table_tr.each(function (index, element) {
                let quantity = $(this).find('.product-quantity').val();
                let pr_unit_price = $(this).find('.pr-unit-price-input').attr('value');
                let tax_value = $(this).find('.product-tax-select-box option:selected').attr('data-rate');
                let current_pre_tax_value = parseFloat(quantity) * parseFloat(pr_unit_price);
                sum_price_pre_tax_value += current_pre_tax_value;
                sum_tax_value += current_pre_tax_value * parseFloat(tax_value) / 100;
                sum_price_after_tax_value += current_pre_tax_value + current_pre_tax_value * parseFloat(tax_value) / 100
            })
            $('#pretax-value').attr('data-init-money', sum_price_pre_tax_value);
            $('#taxes-value').attr('data-init-money', sum_tax_value);
            $('#total-value').attr('data-init-money', sum_price_after_tax_value);
        }

        $(document).on("change", '.pr-unit-price-input', function () {
            let quantity = $(this).closest('tr').find('.product-quantity').val();
            let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
            let tax_value = $(this).closest('tr').find('.product-tax-select-box option:selected').attr('data-rate');
            let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity) + parseFloat(pr_unit_price) * parseFloat(quantity) * parseFloat(tax_value) / 100;
            $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
            calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
            $.fn.initMaskMoney2();
        })

        $(document).on("change", '.product-tax-select-box', function () {
            let quantity = $(this).closest('tr').find('.product-quantity').val();
            let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
            let tax_value = $(this).closest('tr').find('.product-tax-select-box option:selected').attr('data-rate');
            let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity) + parseFloat(pr_unit_price) * parseFloat(quantity) * parseFloat(tax_value) / 100;
            $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
            calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
            $.fn.initMaskMoney2();
        })

        $(document).on("change", '.product-quantity', function () {
            let quantity = $(this).closest('tr').find('.product-quantity').val();
            let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
            let tax_value = $(this).closest('tr').find('.product-tax-select-box option:selected').attr('data-rate');
            let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity) + parseFloat(pr_unit_price) * parseFloat(quantity) * parseFloat(tax_value) / 100;
            $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
            calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
            $.fn.initMaskMoney2();
        })

        $('#form-create-purchase-quotation-request').submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['title'] = $('#title').val();
            frm.dataForm['purchase_request_list'] = [];
            frm.dataForm['delivered_date'] = $('#delivery_date').val();
            frm.dataForm['note'] = $('#note').val();

            frm.dataForm['products_selected'] = []
            $('#table-purchase-quotation-request-products-selected tbody tr').each(function (index, element) {
                frm.dataForm['products_selected'].push(
                    {
                        'product_id': $(this).find('.product-select-box option:selected').attr('value'),
                        'product_description': $(this).find('.product-description').val(),
                        'product_uom_id': $(this).find('.product-uom-select-box option:selected').attr('value'),
                        'product_quantity': $(this).find('.product-quantity').val(),
                        'product_unit_price': $(this).find('.manual-pr-unit-price-input').attr('value'),
                        'product_taxes': $(this).find('.product-tax-select-box option:selected').attr('value'),
                        'product_subtotal_price': $(this).find('.pr-subtotal-price-input').attr('data-init-money'),
                    }
                )
            })

            frm.dataForm['pretax_price'] = $('#pretax-value').attr('data-init-money');
            frm.dataForm['taxes_price'] = $('#taxes-value').attr('data-init-money');
            frm.dataForm['total_price'] = $('#total-value').attr('data-init-money');
            frm.dataForm['purchase_quotation_request_type'] = 1;

            console.log(frm.dataForm)

            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        })

        $(document).on("click", '#new-product-btn', function () {
            let table_body = $('#table-purchase-quotation-request-products-selected tbody');
            table_body.append(`<tr id="" class="row-number">
                    <td class="number text-center"></td>
                    <td><select class="form-select product-select-box" data-method="GET"><option selected></option></select></td>
                    <td><textarea class="form-control product-description" style="height: 38px"></textarea></td>
                    <td><select class="form-select product-uom-select-box" data-method="GET"><option selected></option></select></td>
                    <td><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control product-quantity" value="1"></td>
                    <td><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" style="color: black; background: none"></td>
                    <td><select class="form-select product-tax-select-box" data-method="GET"><option selected></option></select></td>
                    <td><span class="pr-subtotal-price-input mask-money text-primary" data-init-money=""></span></td>
                    <td><button class="btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
                </tr>
                <script>
                    function checkInputQuantity(value) {
                        if (parseInt(value) < 0) {
                            return value*(-1);
                        }
                        return value;
                    }
                </script>`);

            $.fn.initMaskMoney2();
            let row_count = count_row(table_body, 1);

            $('.btn-del-line-detail').on('click', function () {
                $(this).closest('tr').remove();
                count_row(table_body, 2);
                calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
            })

            $('#row-' + row_count + ' .product-select-box').on('change', function () {
                let parent_tr = $(this).closest('tr');
                parent_tr.find('.product-type').val($(this).find('option:selected').attr('data-type'));
                parent_tr.find('.product-tax-select-box').val($(this).find('option:selected').attr('data-tax-id'));

                $('#' + parent_tr.attr('id') + ' .product-unit-price-select-box').attr('value', '');
                $('#' + parent_tr.attr('id') + ' .product-quantity').val(1);
                $('#' + parent_tr.attr('id') + ' .product-subtotal-price').attr('value', '');
                $('#' + parent_tr.attr('id') + ' .product-subtotal-price-after-tax').attr('value', '');
                calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));

                if ($(this).find('option:selected').val() !== '') {
                    loadProductUomList(parent_tr.attr('id'), $(this).find('option:selected').attr('data-uom-group-id'));
                } else {
                    $('#' + parent_tr.attr('id') + ' .product-uom-select-box').empty();
                    $('#' + parent_tr.attr('id') + ' .dropdown-menu').html('');
                }
            })
        });

        function count_row(table_body, option) {
            let count = 0;
            table_body.find('tr td.number').each(function () {
                count = count + 1;
                $(this).text(count);
                $(this).closest('tr').attr('id', 'row-' + count.toString())
            });
            if (option === 1) {
                loadProductList('row-' + count.toString());
                loadProductTaxList('row-' + count.toString());
            }
            return count;
        }

        function loadProductList(row_id) {
            let ele = $('#' + row_id + ' .product-select-box');
            ele.select2();
            ele.html('');
            ele.append(`<option></option>`);
            product_list.map(function (item) {
                if (item.product_choice.includes(2)) {
                    let tax_code_id = '';
                    if (item.sale_information.tax_code) {
                        tax_code_id = item.sale_information.tax_code.id;
                    }
                    ele.append(`<option data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.product_type.title + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
                }
            })
        }

        function loadProductTaxList(row_id) {
            let ele = $('#' + row_id + ' .product-tax-select-box');
            ele.html('');
            ele.append(`<option data-rate="0" selected></option>`);
            tax_list.map(function (item) {
                ele.append(`<option data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
            })
        }

        function loadProductUomList(row_id, uom_group_id) {
            let ele = $('#' + row_id + ' .product-uom-select-box');
            ele.html('');
            ele.append(`<option></option>`);
            unit_of_measure.map(function (item) {
                if (item.group.id === uom_group_id) {
                    ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                }
            })
        }
    })
})