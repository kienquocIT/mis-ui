$(function () {
    $(document).ready(function () {
        const tax_list = JSON.parse($('#tax_list').text());
        const pqr_list = JSON.parse($('#purchase_quotation_request_list').text());
        const account_list = JSON.parse($('#account_list').text());
        const contact_list = JSON.parse($('#contact_list').text());
        const uom_list = JSON.parse($('#uom_list').text());
        const product_list = JSON.parse($('#product_list').text());

        const urlParams = new URLSearchParams(window.location.search);
        const purchase_quotation_request_parameter = urlParams.get('purchase-quotation-request');
        console.log(purchase_quotation_request_parameter)

        function LoadSupplierSelectBox() {
            $('#supplier-select-box option').remove();
            $('#supplier-select-box').append(`<option selected></option>`)
            for (let i = 0; i < account_list.length; i++) {
                if (account_list[i].account_type.includes('Supplier')) {
                    $('#supplier-select-box').append(`<option value="${account_list[i].id}" data-contact="${account_list[i].contact_mapped}" data-code="${account_list[i].code}">${account_list[i].name}</option>`)
                }
            }
            $('#supplier-select-box').select2();
        }
        LoadSupplierSelectBox();

        function LoadContactSelectBox(filter) {
            filter = [].concat(filter);
            $('#contact-select-box option').remove();
            if (filter.length === 1) {
                for (let i = 0; i < contact_list.length; i++) {
                    if (filter.includes(contact_list[i].id)) {
                        $('#contact-select-box').append(`<option selected value="${contact_list[i].id}">${contact_list[i].fullname}</option>`)
                    }
                }
            }
            else {
                $('#contact-select-box').append(`<option selected></option>`)
                for (let i = 0; i < contact_list.length; i++) {
                    if (filter.includes(contact_list[i].id)) {
                        $('#contact-select-box').append(`<option value="${contact_list[i].id}">${contact_list[i].fullname}</option>`)
                    }
                }
            }
            $('#contact-select-box').select2();
        }

        $(document).on("change", '#supplier-select-box', function () {
            LoadContactSelectBox($('#supplier-select-box option:selected').attr('data-contact'));
        })

        function LoadPurchaseQuotationRequestSelectBox(purchase_quotation_request_selected) {
            $('#pqr-select-box option').remove();
            $('#pqr-select-box').append(`<option selected></option>`)
            for (let i = 0; i < pqr_list.length; i++) {
                if (purchase_quotation_request_selected === pqr_list[i].id) {
                    $('#pqr-select-box').append(`<option selected value="${pqr_list[i].id}">(${pqr_list[i].code}) ${pqr_list[i].title}</option>`);
                    $('#btn-add-product').prop('hidden', true);
                    let pqr_selected = $('#pqr-select-box option:selected').attr('value');
                    let product_list_get = [];
                    $.each(pqr_list, function (index, item) {
                        if ($(this)[0].id === pqr_selected) {
                            product_list_get = $(this)[0].product_list
                            return
                        }
                    });

                    let table_body = $('#table-purchase-quotation-products-selected tbody');
                    table_body.html(``);
                    for (let i = 0; i < product_list_get.length; i++) {
                        table_body.append(`<tr id="row-${i}" class="row-number">
                                    <td class="number text-center">${i+1}</td>
                                    <td><select class="form-select product-select-box" disabled data-method="GET"><option selected data-tax-id="${product_list_get[i].tax.id}" data-uom-id="${product_list_get[i].uom.id}" data-uom-group-id="${product_list_get[i].uom.group_id}" value="${product_list_get[i].id}">${product_list_get[i].title}</option></select></td>
                                    <td><textarea class="form-control product-description" readonly style="height: 38px">${product_list_get[i].description}</textarea></td>
                                    <td><select class="form-select product-uom-select-box" data-method="GET"><option selected></option></select></td>
                                    <td><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control product-quantity" value="${product_list_get[i].quantity}"></td>
                                    <td><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" style="color: black; background: none" value="${product_list_get[i].product_unit_price}"></td>
                                    <td><select class="form-select product-tax-select-box" data-method="GET"><option selected></option></select></td>
                                    <td><span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${product_list_get[i].product_subtotal_price}"></span></td>
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
                        $('.btn-del-line-detail').on('click', function () {
                            $(this).closest('tr').remove();
                            count_row(table_body, 2);
                            calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
                            $.fn.initMaskMoney2();
                        })
                        loadProductUomListForAuto('row-'+i, $('#row-'+i).find('.product-select-box option:selected').attr('data-uom-group-id'), $('#row-'+i).find('.product-select-box option:selected').attr('data-uom-id'));
                        loadProductTaxListForAuto('row-'+i, $('#row-'+i).find('.product-select-box option:selected').attr('data-tax-id'));
                    }
                    let quantity = $(this).closest('tr').find('.product-quantity').val();
                    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
                    let tax_value = $(this).closest('tr').find('.product-tax-select-box option:selected').attr('data-rate');
                    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
                    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
                    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
                    $.fn.initMaskMoney2();
                }
                else {
                    $('#pqr-select-box').append(`<option value="${pqr_list[i].id}">(${pqr_list[i].code}) ${pqr_list[i].title}</option>`);
                }
            }
            $('#pqr-select-box').select2();
        }
        LoadPurchaseQuotationRequestSelectBox(purchase_quotation_request_parameter);

        $('#expiration_date').dateRangePickerDefault({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: true,
            minYear: 1901,
            locale: {
                format: 'YYYY-MM-DD'
            },
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY'),10)
        });
        $('#expiration_date').val('');

        $(document).on("click", '#new-product-btn', function () {
            let table_body = $('#table-purchase-quotation-products-selected tbody');
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
                calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
                $.fn.initMaskMoney2();
            })

            $('#row-' + row_count + ' .product-select-box').on('change', function () {
                let current_value = $(this).val();
                let current_row = $(this).closest('tr').find('.number').text();
                let flag = true;
                $('#table-purchase-quotation-products-selected tbody tr').each(function () {
                    let temp_value = $(this).find('.product-select-box option:selected').attr('value');
                    let temp_row = $(this).closest('tr').find('.number').text();
                    if (temp_value === current_value && temp_row !== current_row) {
                        $.fn.notifyB({description: "Can not select selected item"}, 'failure');
                        flag = false;
                        return false;
                    }
                })

                if (flag) {
                    let parent_tr = $(this).closest('tr');
                    parent_tr.find('.product-type').val($(this).find('option:selected').attr('data-type'));
                    parent_tr.find('.product-tax-select-box').val($(this).find('option:selected').attr('data-tax-id'));

                    $('#' + parent_tr.attr('id') + ' .product-unit-price-select-box').attr('value', '');
                    $('#' + parent_tr.attr('id') + ' .product-quantity').val(1);
                    $('#' + parent_tr.attr('id') + ' .product-subtotal-price').attr('value', '');
                    $('#' + parent_tr.attr('id') + ' .product-subtotal-price-after-tax').attr('value', '');
                    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));

                    if ($(this).find('option:selected').val() !== '') {
                        loadProductUomList(parent_tr.attr('id'), $(this).find('option:selected').attr('data-uom-group-id'));
                    } else {
                        $('#' + parent_tr.attr('id') + ' .product-uom-select-box').empty();
                        $('#' + parent_tr.attr('id') + ' .dropdown-menu').html('');
                    }
                }
                else {
                    loadProductList('row-' + row_count.toString());
                    loadProductTaxList('row-' + row_count.toString());
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
                    if (item.sale_tax) {
                        tax_code_id = item.sale_tax.id;
                    }
                    ele.append(`<option data-uom-group-id="` + item.general_uom_group.id + `" data-type="` + item.general_product_type.title + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
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

        function loadProductTaxListForAuto(row_id, selected) {
            let ele = $('#' + row_id + ' .product-tax-select-box');
            ele.html('');
            ele.append(`<option data-rate="0" selected></option>`);
            tax_list.map(function (item) {
                if (item.id === selected) {
                    ele.append(`<option selected data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
                }
                else {
                    ele.append(`<option data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
                }
            })
        }

        function loadProductUomList(row_id, uom_group_id) {
            let ele = $('#' + row_id + ' .product-uom-select-box');
            ele.html('');
            ele.append(`<option></option>`);
            uom_list.map(function (item) {
                if (item.group.id === uom_group_id) {
                    ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                }
            })
        }

        function loadProductUomListForAuto(row_id, uom_group_id, selected) {
            let ele = $('#' + row_id + ' .product-uom-select-box');
            ele.html('');
            ele.append(`<option></option>`);
            uom_list.map(function (item) {
                if (item.group.id === uom_group_id) {
                    if (item.id === selected) {
                        ele.append(`<option selected value="` + item.id + `">` + item.title + `</option>`);
                    }
                    else {
                        ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    }
                }
            })
        }

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
            let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
            $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
            calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
            $.fn.initMaskMoney2();
        })

        $(document).on("change", '.product-tax-select-box', function () {
            let quantity = $(this).closest('tr').find('.product-quantity').val();
            let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
            let tax_value = $(this).closest('tr').find('.product-tax-select-box option:selected').attr('data-rate');
            let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
            $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
            calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
            $.fn.initMaskMoney2();
        })

        $(document).on("change", '.product-quantity', function () {
            let quantity = $(this).closest('tr').find('.product-quantity').val();
            let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
            let tax_value = $(this).closest('tr').find('.product-tax-select-box option:selected').attr('data-rate');
            let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
            $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
            calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
            $.fn.initMaskMoney2();
        })

        $(document).on("change", '#pqr-select-box', function () {
            $('#btn-add-product').prop('hidden', true);
            let pqr_selected = $('#pqr-select-box option:selected').attr('value');
            let product_list_get = [];
            $.each(pqr_list, function (index, item) {
                if ($(this)[0].id === pqr_selected) {
                    product_list_get = $(this)[0].product_list
                    return
                }
            });

            let table_body = $('#table-purchase-quotation-products-selected tbody');
            table_body.html(``);
            for (let i = 0; i < product_list_get.length; i++) {
                table_body.append(`<tr id="row-${i}" class="row-number">
                            <td class="number text-center">${i+1}</td>
                            <td><select class="form-select product-select-box" disabled data-method="GET"><option selected data-tax-id="${product_list_get[i].tax.id}" data-uom-id="${product_list_get[i].uom.id}" data-uom-group-id="${product_list_get[i].uom.group_id}" value="${product_list_get[i].id}">${product_list_get[i].title}</option></select></td>
                            <td><textarea class="form-control product-description" readonly style="height: 38px">${product_list_get[i].description}</textarea></td>
                            <td><select class="form-select product-uom-select-box" data-method="GET"><option selected></option></select></td>
                            <td><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control product-quantity" value="${product_list_get[i].quantity}"></td>
                            <td><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" style="color: black; background: none" value="${product_list_get[i].product_unit_price}"></td>
                            <td><select class="form-select product-tax-select-box" data-method="GET"><option selected></option></select></td>
                            <td><span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${product_list_get[i].product_subtotal_price}"></span></td>
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
                $('.btn-del-line-detail').on('click', function () {
                    $(this).closest('tr').remove();
                    count_row(table_body, 2);
                    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
                    $.fn.initMaskMoney2();
                })
                loadProductUomListForAuto('row-'+i, $('#row-'+i).find('.product-select-box option:selected').attr('data-uom-group-id'), $('#row-'+i).find('.product-select-box option:selected').attr('data-uom-id'));
                loadProductTaxListForAuto('row-'+i, $('#row-'+i).find('.product-select-box option:selected').attr('data-tax-id'));
            }
            let quantity = $(this).closest('tr').find('.product-quantity').val();
            let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
            let tax_value = $(this).closest('tr').find('.product-tax-select-box option:selected').attr('data-rate');
            let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
            $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
            calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
            $.fn.initMaskMoney2();
        })

        $('#form-create-purchase-quotation').submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['title'] = $('#title').val();
            frm.dataForm['supplier_mapped'] = $('#supplier-select-box option:selected').val();
            frm.dataForm['contact_mapped'] = $('#contact-select-box option:selected').val();
            frm.dataForm['purchase_quotation_request_mapped'] = $('#pqr-select-box option:selected').val();
            frm.dataForm['expiration_date'] = $('#expiration_date').val();
            frm.dataForm['lead_time_from'] = $('#lead-time-from').val();
            frm.dataForm['lead_time_to'] = $('#lead-time-to').val();
            frm.dataForm['lead_time_type'] = $('#lead-time-type option:selected').val();
            frm.dataForm['note'] = $('#note').val();

            frm.dataForm['products_selected'] = []
            $('#table-purchase-quotation-products-selected tbody tr').each(function (index, element) {
                if ($(this).find('.product-select-box option:selected').attr('value') !== '') {
                    frm.dataForm['products_selected'].push(
                        {
                            'product_id': $(this).find('.product-select-box option:selected').attr('value'),
                            'product_description': $(this).find('.product-description').val(),
                            'product_uom_id': $(this).find('.product-uom-select-box option:selected').attr('value'),
                            'product_quantity': $(this).find('.product-quantity').attr('value'),
                            'product_unit_price': $(this).find('.pr-unit-price-input').attr('value'),
                            'product_taxes': $(this).find('.product-tax-select-box option:selected').attr('value'),
                            'product_subtotal_price': $(this).find('.pr-subtotal-price-input').attr('data-init-money'),
                        }
                    )
                }

            })

            frm.dataForm['pretax_price'] = $('#pretax-value').attr('data-init-money');
            frm.dataForm['taxes_price'] = $('#taxes-value').attr('data-init-money');
            frm.dataForm['total_price'] = $('#total-value').attr('data-init-money');

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
    })
})