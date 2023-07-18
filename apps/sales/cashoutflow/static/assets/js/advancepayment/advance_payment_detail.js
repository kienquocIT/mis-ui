$(document).ready(function () {
    let advance_payment_product_items = [];
    let payment_cost_items_filtered = [];
    let url_detail = $('#form-update-advance').attr('data-url-detail').replace('0', $.fn.getPkDetail())
    $.fn.callAjax(url_detail, 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            // console.log(data)
            let advance_payment = data.advance_payment_detail;
            $.fn.compareStatusShowPageAction(advance_payment);
            $('#advance-payment-code').text(advance_payment.code);
            $('#advance-payment-title').val(advance_payment.title);
            if (advance_payment.sale_code_type === 0) {
                $('#sale-code-label-id').addClass('required');
                $('#radio-sale').prop('checked', true);
                $('#btn-change-sale-code-type').text('Sale');

                let sale_code_mapped = null;
                if (advance_payment.sale_order_mapped.length > 0) {
                    sale_code_mapped = advance_payment.sale_order_mapped;
                    // get ap product items
                    let so_id = sale_code_mapped[0].id;
                    let so_filter = sale_order_list.filter(function(item) {
                        return item.id === so_id;
                    });
                    let so_mapped = null;
                    let quo_mapped = null;
                    let opp_mapped = null;
                    if (so_filter.length > 0) {
                        so_mapped = so_filter[0];
                    }
                    if (so_mapped) {
                        if (Object.keys(so_mapped.quotation).length !== 0) {
                            quo_mapped = so_mapped.quotation;
                        }
                        if (Object.keys(so_mapped.opportunity).length !== 0) {
                            opp_mapped = so_mapped.opportunity;
                        }
                    }
                    let so_mapped_id = null;
                    let quo_mapped_id = null;
                    let opp_mapped_id = null;
                    if (so_mapped) {so_mapped_id = so_mapped.id}
                    if (quo_mapped) {quo_mapped_id = quo_mapped.id}
                    if (opp_mapped) {opp_mapped_id = opp_mapped.id}

                    // console.log(so_mapped_id)
                    // console.log(quo_mapped_id)
                    // console.log(opp_mapped_id)

                    advance_payment_product_items = [];
                    for (let i = 0; i < ap_list.length; i++) {
                        if (ap_list[i].sale_order_mapped === so_mapped_id && ap_list[i].sale_order_mapped) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                        if (ap_list[i].quotation_mapped === quo_mapped_id && ap_list[i].quotation_mapped) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                        if (ap_list[i].opportunity_mapped === opp_mapped_id && ap_list[i].opportunity_mapped) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    // console.log(advance_payment_product_items)

                    // get payment items
                    payment_cost_items_filtered = [];
                    for (let i = 0; i < payment_cost_items_list.length; i++) {
                        // console.log(data.payment_cost_items_list[i])
                        let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                        if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                            payment_cost_items_filtered.push(payment_cost_items_list[i]);
                        }
                    }
                    // console.log(payment_cost_items_filtered)

                    if (so_mapped_id) {
                        // loadSaleOrderProduct(so_mapped_id);
                        $('#notify-none-sale-code').prop('hidden', true);
                        $('#tab_plan_datatable').prop('hidden', false);
                    }
                    else if (quo_mapped_id) {
                        // loadQuotationProduct(quo_mapped_id);
                        $('#notify-none-sale-code').prop('hidden', true);
                        $('#tab_plan_datatable').prop('hidden', false);
                    }
                    else {
                        $('#notify-none-sale-code').prop('hidden', false);
                        $('#tab_plan_datatable').prop('hidden', true);
                    }
                }
                if (advance_payment.quotation_mapped.length > 0) {
                    sale_code_mapped = advance_payment.quotation_mapped;
                    // get ap product items
                    let quo_id = sale_code_mapped[0].id;
                    let so_filter = sale_order_list.filter(function(item) {
                        if (Object.keys(item.quotation).length !== 0) {
                            return item.quotation.id === quo_id;
                        }
                    });
                    let so_mapped = null;
                    let quo_mapped = null;
                    let opp_mapped = null;
                    if (so_filter.length > 0) {
                        so_mapped = so_filter[0];
                        if (so_mapped) {
                            if (Object.keys(so_mapped.quotation).length !== 0) {
                                quo_mapped = so_mapped.quotation;
                            }
                            if (Object.keys(so_mapped.opportunity).length !== 0) {
                                opp_mapped = so_mapped.opportunity;
                            }
                        }
                    }
                    else {
                        let quo_filter = quotation_list.filter(function(item) {
                            return item.id === quo_id;
                        });
                        if (quo_filter.length > 0) {
                            quo_mapped = quo_filter[0];
                        }
                        if (quo_mapped) {
                            if (Object.keys(quo_mapped.opportunity).length !== 0) {
                                opp_mapped = quo_mapped.opportunity;
                            }
                        }
                    }

                    let so_mapped_id = null;
                    let quo_mapped_id = null;
                    let opp_mapped_id = null;
                    if (so_mapped) {so_mapped_id = so_mapped.id}
                    if (quo_mapped) {quo_mapped_id = quo_mapped.id}
                    if (opp_mapped) {opp_mapped_id = opp_mapped.id}

                    // console.log(so_mapped_id)
                    // console.log(quo_mapped_id)
                    // console.log(opp_mapped_id)

                    advance_payment_product_items = [];
                    for (let i = 0; i < ap_list.length; i++) {
                        if (ap_list[i].sale_order_mapped === so_mapped_id && ap_list[i].sale_order_mapped) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                        if (ap_list[i].quotation_mapped === quo_mapped_id && ap_list[i].quotation_mapped) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                        if (ap_list[i].opportunity_mapped === opp_mapped_id && ap_list[i].opportunity_mapped) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    // console.log(advance_payment_product_items)

                    // get payment items
                    payment_cost_items_filtered = [];
                    for (let i = 0; i < payment_cost_items_list.length; i++) {
                        // console.log(payment_cost_items_list[i])
                        let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                        if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                            payment_cost_items_filtered.push(payment_cost_items_list[i]);
                        }
                    }
                    // console.log(payment_cost_items_filtered)

                    if (so_mapped_id) {
                        // loadSaleOrderProduct(so_mapped_id);
                        $('#notify-none-sale-code').prop('hidden', true);
                        $('#tab_plan_datatable').prop('hidden', false);
                    }
                    else if (quo_mapped_id) {
                        // loadQuotationProduct(quo_mapped_id);
                        $('#notify-none-sale-code').prop('hidden', true);
                        $('#tab_plan_datatable').prop('hidden', false);
                    }
                    else {
                        $('#notify-none-sale-code').prop('hidden', false);
                        $('#tab_plan_datatable').prop('hidden', true);
                    }
                }
                let is_opp = false;
                if (advance_payment.opportunity_mapped.length > 0) {
                    is_opp = true;
                    sale_code_mapped = advance_payment.opportunity_mapped;
                    // get ap product items
                    let opp_id = sale_code_mapped[0].id;
                    let so_filter = sale_order_list.filter(function(item) {
                        if (Object.keys(item.opportunity).length !== 0) {
                            return item.opportunity.id === opp_id;
                        }
                    });
                    let so_mapped = null;
                    let quo_mapped = null;
                    let opp_mapped = null;
                    if (so_filter.length > 0) {
                        so_mapped = so_filter[0];
                        if (so_mapped) {
                            if (Object.keys(so_mapped.quotation).length !== 0) {
                                quo_mapped = so_mapped.quotation;
                            }
                            if (Object.keys(so_mapped.opportunity).length !== 0) {
                                opp_mapped = so_mapped.opportunity;
                            }
                        }
                    }
                    else {
                        let quo_filter = quotation_list.filter(function(item) {
                            if (Object.keys(item.opportunity).length !== 0) {
                                return item.opportunity.id === opp_id;
                            }
                        });
                        if (quo_filter.length > 0) {
                            quo_mapped = quo_filter[0];
                        }
                        if (quo_mapped) {
                            if (Object.keys(quo_mapped.opportunity).length !== 0) {
                                opp_mapped = quo_mapped.opportunity;
                            }
                        }
                    }

                    let so_mapped_id = null;
                    let quo_mapped_id = null;
                    let opp_mapped_id = null;
                    if (so_mapped) {so_mapped_id = so_mapped.id}
                    if (quo_mapped) {quo_mapped_id = quo_mapped.id}
                    if (opp_mapped) {opp_mapped_id = opp_mapped.id}

                    // console.log(so_mapped_id)
                    // console.log(quo_mapped_id)
                    // console.log(opp_mapped_id)

                    advance_payment_product_items = [];
                    for (let i = 0; i < ap_list.length; i++) {
                        if (ap_list[i].sale_order_mapped === so_mapped_id && ap_list[i].sale_order_mapped) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                        if (ap_list[i].quotation_mapped === quo_mapped_id && ap_list[i].quotation_mapped) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                        if (ap_list[i].opportunity_mapped === opp_mapped_id && ap_list[i].opportunity_mapped) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    // console.log(advance_payment_product_items)

                    // get payment items
                    payment_cost_items_filtered = [];
                    for (let i = 0; i < payment_cost_items_list.length; i++) {
                        // console.log(payment_cost_items_list[i])
                        let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                        if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                            payment_cost_items_filtered.push(payment_cost_items_list[i]);
                        }
                    }
                    // console.log(payment_cost_items_filtered)

                    if (so_mapped_id) {
                        // loadSaleOrderProduct(so_mapped_id);
                        $('#notify-none-sale-code').prop('hidden', true);
                        $('#tab_plan_datatable').prop('hidden', false);
                    }
                    else if (quo_mapped_id) {
                        // loadQuotationProduct(quo_mapped_id);
                        $('#notify-none-sale-code').prop('hidden', true);
                        $('#tab_plan_datatable').prop('hidden', false);
                    }
                    else {
                        $('#notify-none-sale-code').prop('hidden', false);
                        $('#tab_plan_datatable').prop('hidden', true);
                    }
                }

                $('#sale-code-show').val(sale_code_mapped[0].title);
                if (is_opp === false) {
                    $('#sale-code-show').attr('href', '#');
                    $('#sale-code-show').attr('data-bs-toggle', 'tooltip');
                    $('#sale-code-show').attr('data-bs-placement', 'right');
                    $('#sale-code-show').attr('title', sale_code_mapped[0].opportunity.code + ': ' + sale_code_mapped[0].opportunity.title);
                }
                $('#beneficiary-select-box').prop('disabled', true);
            }
            if (advance_payment.sale_code_type === 1) {
                $('#radio-purchase').prop('checked', true);
                $('#btn-change-sale-code-type').text('Purchase');
            }
            if (advance_payment.sale_code_type === 2) {
                $('#radio-non-sale').prop('checked', true);
                $('#btn-change-sale-code-type').text('Non-Sale');
                $('#beneficiary-select-box').prop('disabled', false);
                $('#notify-none-sale-code').prop('hidden', false);
                $('#tab_plan_datatable').prop('hidden', true);
            }

            if (advance_payment.advance_payment_type === 0) {
                $('#type-select-box').find('option[value="0"]').prop('selected', true);
            }
            if (advance_payment.advance_payment_type === 1) {
                $('#type-select-box').find('option[value="1"]').prop('selected', true);
                $('#supplier-label').addClass('required');
            }

            if (advance_payment.supplier) {
                loadSupplier(advance_payment.supplier);
                $('#supplier-select-box').prop('disabled', false);
                LoadBankAccount();
                $('#supplier-detail-span').prop('hidden', false);
                $('#supplier-name').text($('#supplier-select-box option:selected').attr('data-name'));
                $('#supplier-code').text($('#supplier-select-box option:selected').attr('data-code'));
                $('#supplier-owner').text($('#supplier-select-box option:selected').attr('data-owner'));
                $('#supplier-industry').text($('#supplier-select-box option:selected').attr('data-industry'));
                let url = $('#btn-detail-supplier-tab').attr('data-url').replace('0', $('#supplier-select-box option:selected').attr('value'));
                $('#btn-detail-supplier-tab').attr('href', url);
            }
            else {
                $('#supplier-detail-span').prop('hidden', true);
                $('#btn-detail-supplier-tab').attr('href', '#');
                $('#list-bank-account-information').html(`<div class="row">
                    <div class="col-12">
                        <div id="notify-none-bank-account" class="alert alert-secondary" role="alert">
                            <span class="alert-icon-wrap"></span>
                            &nbsp;No bank accounts information!
                        </div>
                    </div>
                </div>`)
            }

            if (advance_payment.method === 0) {
                $('#method-select-box').find('option[value="0"]').prop('selected', true);
            }
            if (advance_payment.method === 1) {
                $('#method-select-box').find('option[value="1"]').prop('selected', true);
            }

            $('#created_date_id').val(advance_payment.date_created.split(' ')[0]);
            $('#return_date_id').val(advance_payment.return_date.split(' ')[0])

            if (advance_payment.beneficiary) {
                loadBeneficiary(advance_payment.beneficiary.id);
            }

            if (advance_payment.product_items.length > 0) {
                let table_body = $('#tab_line_detail tbody');

                let pretax_value = 0;
                let total_value = 0;
                for (let i = 0; i < advance_payment.product_items.length; i++) {
                    pretax_value = pretax_value + advance_payment.product_items[i].subtotal_price
                    total_value = total_value + advance_payment.product_items[i].after_tax_price

                    table_body.append(`<tr id="" class="row-number">
                    <td class="number text-center"></td>
                    <td><select class="form-select product-select-box" data-method="GET"><option selected></option></select></td>
                    <td><input class="form-control product-type" disabled></td>
                    <td><select class="form-select product-uom-select-box" data-method="GET"><option selected></option></select></td>
                    <td><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control product-quantity" value="1"></td>
                    <td><input disabled data-return-type="number" type="text" class="form-control product-unit-price-select-box mask-money" placeholder="Select a price or enter"></td>
                    <td><select class="form-select product-tax-select-box" data-method="GET"><option selected></option></select></td>
                    <td><input type="text" data-return-type="number" class="form-control product-subtotal-price mask-money" disabled></td>
                    <td><input type="text" data-return-type="number" class="form-control product-subtotal-price-after-tax mask-money" disabled></td>
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
                    let tax_id = null;
                    if (advance_payment.product_items[i].tax) {
                        tax_id = advance_payment.product_items[i].tax.id
                    }
                    count_row(table_body, 1, advance_payment.product_items[i].product.id, tax_id, advance_payment.product_items[i].product_uom.id);
                    $('#row-' + (i+1).toString() + ' .product-quantity').val(advance_payment.product_items[i].product_quantity);
                    $('#row-' + (i+1).toString() + ' .product-subtotal-price').attr('value', advance_payment.product_items[i].subtotal_price);
                    $('#row-' + (i+1).toString() + ' .product-subtotal-price-after-tax').attr('value', advance_payment.product_items[i].after_tax_price);
                    $('#row-' + (i+1).toString() + ' .product-unit-price-select-box').attr('value', advance_payment.product_items[i].unit_price);
                    $.fn.initMaskMoney2();

                    $('.btn-del-line-detail').on('click', function () {
                        $(this).closest('tr').remove();
                        count_row(table_body, 2);
                        calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
                    })
                    $('#row-' + (i+1).toString() + ' .product-select-box').on('change', function () {
                        let parent_tr = $(this).closest('tr');
                        parent_tr.find('.product-type').val($(this).find('option:selected').attr('data-type'));
                        parent_tr.find('.product-tax-select-box').val($(this).find('option:selected').attr('data-tax-id'));

                        $('#' + parent_tr.attr('id') + ' .product-unit-price-select-box').attr('value', '');
                        $('#' + parent_tr.attr('id') + ' .product-quantity').val(1);
                        $('#' + parent_tr.attr('id') + ' .product-subtotal-price').attr('value', '');
                        $('#' + parent_tr.attr('id') + ' .product-subtotal-price-after-tax').attr('value', '');
                        calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));

                        if ($(this).find('option:selected').val() !== '') {
                            loadProductUomList(parent_tr.attr('id'), $(this).find('option:selected').attr('data-uom-group-id'), $(this).find('option:selected').attr('data-uom-id'));
                            loadUnitPriceList(parent_tr.attr('id'), $(this).find('option:selected').val());
                        }
                        else {
                            $('#' + parent_tr.attr('id') + ' .product-uom-select-box').empty();
                            $('#' + parent_tr.attr('id') + ' .dropdown-menu').html('');
                        }
                    })
                }

                $('#pretax-value').attr('data-init-money', pretax_value);
                $('#taxes-value').attr('data-init-money', total_value - pretax_value);
                $('#total-value').attr('data-init-money', total_value);

                $.fn.initMaskMoney2();
            }

            if (advance_payment.money_gave) {
                $('#money-gave').prop('checked', true);
            }
            else {
                $('#money-gave').prop('checked', false);
            }
        }

        $('.form-control').prop('disabled', true);
        $('.form-select').prop('disabled', true);
        $('.dropdown-toggle').prop('disabled', true);
        if ($('#money-gave').is(':checked')) {
            $('#money-gave').prop('disabled', true);
        }
        $('#btn-add-row-line-detail').addClass('disabled');
        $('.btn-del-line-detail').addClass('disabled');

        $('.form-control').css({
            'color': 'black'
        });
        $('.form-select').css({
            'color': 'black'
        });
        $('.dropdown-toggle').css({
            'color': 'black'
        });
    })

    const plan_db = $('#tab_plan_datatable_div').html();
    const tax_list = JSON.parse($('#tax_list').text());
    const product_list = JSON.parse($('#product_list').text());
    const account_list = JSON.parse($('#account_list').text());
    const employee_list = JSON.parse($('#employee_list').text());
    const ap_list = JSON.parse($('#advance_payment_list').text());
    const quotation_list = JSON.parse($('#quotation_list').text());
    const sale_order_list = JSON.parse($('#sale_order_list').text());
    const unit_of_measure = JSON.parse($('#unit_of_measure').text());
    const payment_cost_items_list = JSON.parse($('#payment_cost_items_list').text());
    const account_bank_accounts_information_dict = account_list.reduce((obj, item) => {
        obj[item.id] = item.bank_accounts_information;
        return obj;
    }, {});

    $(document).on("click", '#btn-add-row-line-detail', function () {
        let table_body = $('#tab_line_detail tbody');
        table_body.append(`<tr id="" class="row-number">
            <td class="number text-center"></td>
            <td><select class="form-select product-select-box" data-method="GET"><option selected></option></select></td>
            <td><input class="form-control product-type" style="color: black; background: none" disabled></td>
            <td><select class="form-select product-uom-select-box" data-method="GET"><option selected></option></select></td>
            <td><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control product-quantity" value="1"></td>
            <td><div class="input-group dropdown" aria-expanded="false" data-bs-toggle="dropdown">
                    <span class="input-affix-wrapper">
                        <input disabled data-return-type="number" type="text" class="form-control product-unit-price-select-box mask-money" style="color: black; background: none" placeholder="Select a price or enter">
                    </span>
                </div>
                <div style="min-width: 25%" class="dropdown-menu" data-method="GET"></div></td>
            <td><select class="form-select product-tax-select-box" data-method="GET"><option selected></option></select></td>
            <td><input type="text" data-return-type="number" class="form-control product-subtotal-price mask-money" style="color: black; background: none" disabled></td>
            <td><input type="text" data-return-type="number" class="form-control product-subtotal-price-after-tax mask-money" style="color: black; background: none" disabled></td>
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
        let row_count = count_row(table_body, 1, '', '');

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
                loadProductUomList(parent_tr.attr('id'), $(this).find('option:selected').attr('data-uom-group-id'), $(this).find('option:selected').attr('data-uom-id'));
                loadUnitPriceList(parent_tr.attr('id'), $(this).find('option:selected').val());
            }
            else {
                $('#' + parent_tr.attr('id') + ' .product-uom-select-box').empty();
                $('#' + parent_tr.attr('id') + ' .dropdown-menu').html('');
            }
        })
    });

    function loadSaleOrderProduct(filter_sale_order) {
        $('#tab_plan_datatable').remove();
        $('#tab_plan_datatable_div').html(plan_db);
        let dtb = $('#tab_plan_datatable');
        let frm = new SetupFormSubmit(dtb);
        frm.dataUrl = dtb.attr('data-url-sale-order');
        dtb.DataTableDefault({
            reloadCurrency: true,
            dom: '',
            ajax: {
                url: frm.dataUrl + '?filter_sale_order=' + filter_sale_order,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_detail = data.sale_order_product_list;
                        for (let i = 0; i < data_detail.length; i++) {
                            let product_id = data_detail[i].product_id;
                            let results = advance_payment_product_items.filter(function(item) {
                                return item.product.id === product_id;
                            });
                            let sum_AP_approved = results.reduce(function(s, item) {
                                return s + item.after_tax_price;
                            }, 0);
                            let returned = results.reduce(function(s, item) {
                                return s + item.returned_total;
                            }, 0);
                            let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                                return item.product_id === product_id;
                            });
                            let to_payment = payment_cost_items_list.reduce(function(s, item) {
                                return s + item.converted_value;
                            }, 0);
                            let others_payment = payment_cost_items_list.reduce(function(s, item) {
                                return s + item.real_value;
                            }, 0);
                            data_detail[i].to_payment = to_payment;
                            data_detail[i].sum_AP_approved = sum_AP_approved;
                            data_detail[i].returned = returned;
                            data_detail[i].others_payment = others_payment;
                            data_detail[i].available = data_detail[i].plan_after_tax - sum_AP_approved - others_payment + returned;
                            if (data_detail[i].available < 0) {
                                data_detail[i].available = 0;
                            }
                        }
                        return resp.data['sale_order_product_list'] ? resp.data['sale_order_product_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    data: 'product_title',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<a href="#"><span>` + row.product_title + `</span></a>`
                    }
                },
                {
                    data: 'tax',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        if (row.tax.title) {
                            return `<span class="badge badge-soft-indigo badge-outline">` + row.tax.title + `</span>`
                        }
                        return ``
                    }
                },
                {
                    data: 'plan_after_tax',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.plan_after_tax + `"></span>`
                    }
                },
                {
                    data: 'sum_AP_approved',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.sum_AP_approved + `"></span>`
                    }
                },
                {
                    data: 'returned',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.returned + `"></span>`
                    }
                },
                {
                    data: 'to_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.to_payment + `"></span>`
                    }
                },
                {
                    data: 'others_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.others_payment + `"></span>`
                    }
                },
                {
                    data: 'available',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.available + `"></span>`
                    }
                }
            ],
        });
    }

    function loadQuotationProduct(filter_quotation) {
        $('#tab_plan_datatable').remove();
        $('#tab_plan_datatable_div').html(plan_db);
        let dtb = $('#tab_plan_datatable');
        let frm = new SetupFormSubmit(dtb);
        frm.dataUrl = dtb.attr('data-url-quotation');
        dtb.DataTableDefault({
            reloadCurrency: true,
            dom: '',
            ajax: {
                url: frm.dataUrl + '?filter_quotation=' + filter_quotation,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_detail = data.quotation_product_list;
                        for (let i = 0; i < data_detail.length; i++) {
                            let product_id = data_detail[i].product_id;
                            let results = advance_payment_product_items.filter(function(item) {
                                return item.product.id === product_id;
                            });
                            let sum_AP_approved = results.reduce(function(s, item) {
                                return s + item.after_tax_price;
                            }, 0);
                            let returned = results.reduce(function(s, item) {
                                return s + item.returned_total;
                            }, 0);
                            let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                                return item.product_id === product_id;
                            });
                            let to_payment = payment_cost_items_list.reduce(function(s, item) {
                                return s + item.converted_value;
                            }, 0);
                            let others_payment = payment_cost_items_list.reduce(function(s, item) {
                                return s + item.real_value;
                            }, 0);
                            data_detail[i].to_payment = to_payment;
                            data_detail[i].sum_AP_approved = sum_AP_approved;
                            data_detail[i].returned = returned;
                            data_detail[i].others_payment = others_payment;
                            data_detail[i].available = data_detail[i].plan_after_tax - sum_AP_approved - others_payment + returned;
                            if (data_detail[i].available < 0) {
                                data_detail[i].available = 0;
                            }
                        }
                        return resp.data['quotation_product_list'] ? resp.data['quotation_product_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    data: 'product_title',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<a href="#"><span>` + row.product_title + `</span></a>`
                    }
                },
                {
                    data: 'tax',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        if (row.tax.title) {
                            return `<span class="badge badge-soft-indigo badge-outline">` + row.tax.title + `</span>`
                        }
                        return ``
                    }
                },
                {
                    data: 'plan_after_tax',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.plan_after_tax + `"></span>`
                    }
                },
                {
                    data: 'sum_AP_approved',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.sum_AP_approved + `"></span>`
                    }
                },
                {
                    data: 'returned',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.returned + `"></span>`
                    }
                },
                {
                    data: 'to_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.to_payment + `"></span>`
                    }
                },
                {
                    data: 'others_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.others_payment + `"></span>`
                    }
                },
                {
                    data: 'available',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="mask-money text-primary" data-init-money="` + row.available + `"></span>`
                    }
                }
            ],
        });
    }

    function loadProductList(row_id, product_id, uom_id) {
        let ele = $('#' + row_id + ' .product-select-box');
        ele.select2();
        ele.html('');
        ele.append(`<option></option>`);
        product_list.map(function (item) {
            let tax_code_id = '';
            if (item.sale_information.tax_code) {
                tax_code_id = item.sale_information.tax_code.id;
            }
            if (item.id === product_id) {
                ele.append(`<option selected data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.product_type.title + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
                $('#' + row_id + ' .product-type').val(item.general_information.product_type.title)
                loadProductUomList(row_id, item.general_information.uom_group.id, uom_id);
            }
            else {
                ele.append(`<option data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.product_type.title + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
            }
        })
    }

    function loadProductUomList(row_id, uom_group_id, uom_mapped_id) {
        let ele = $('#' + row_id + ' .product-uom-select-box');
        ele.html('');
        ele.append(`<option></option>`);
        unit_of_measure.map(function (item) {
            if (item.group.id === uom_group_id) {
                if (item.id === uom_mapped_id) {
                    ele.append(`<option selected value="` + item.id + `">` + item.title + `</option>`);
                }
                else {
                    ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                }
            }
        })
    }

    function loadProductTaxList(row_id, tax_id) {
        let ele = $('#' + row_id + ' .product-tax-select-box');
        ele.html('');
        ele.append(`<option data-rate="0" selected></option>`);
        tax_list.map(function (item) {
            if (item.id === tax_id) {
                ele.append(`<option selected data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
            }
            else {
                ele.append(`<option data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
            }
        })
    }

    function loadUnitPriceList(row_id, product_item_id) {
        let ele = $('#' + row_id + ' .dropdown-menu');
        ele.html('');
        $.fn.callAjax($('#tab_line_detail_datatable').attr('data-url-unit-price-list').replace('/0', '/' + product_item_id), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product')) {
                    console.log(resp.data.product)
                    let primary_currency = 'VND';
                    resp.data.product.sale_information.price_list.map(function (item) {
                        if (item.is_primary === true) {
                            primary_currency = item.currency_using;
                            ele.append(`<a data-id="` + item.id + `" data-value="` + item.price + `" class="dropdown-item"><div class="row">
                                        <div class="col-7 text-left"><span>` + item.title + `:</span></div>
                                        <div class="col-5 text-right"><span class="mask-money" data-init-money="` + item.price + `"></span></div>
                                        </div></a>`)
                            $.fn.initMaskMoney2();
                            $(`a[data-id=` + item.id + `]`).on('click', function () {
                                let tr = $(this).closest('tr');
                                let input_show = tr.find('.product-unit-price-select-box');
                                let subtotal_show = tr.find('.product-subtotal-price');
                                let subtotal_after_tax_show = tr.find('.product-subtotal-price-after-tax');
                                let quantity = tr.find('.product-quantity');
                                let tax = tr.find('.product-tax-select-box option:selected');
                                input_show.attr('value', $(this).attr('data-value'));
                                $.fn.initMaskMoney2();
                                if (input_show.attr('value') && quantity.val() && tax.attr('data-rate')) {
                                    subtotal_show.attr('value', parseFloat(input_show.attr('value')) * parseInt(quantity.val()));
                                    let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                                    subtotal_after_tax_show.attr('value', parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
                                }
                                calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
                            })
                        }
                    })
                    ele.append(`<div class="dropdown-divider"></div>`)
                    ele.append(`<a data-id="unit-price-a-` + product_item_id + `" data-value=""><div class="row">
                                <div class="col-5 text-left col-form-label"><span style="color: #007D88">Enter price in <b>` + primary_currency + `</b>:</span></div>
                                <div class="col-7 text-right"><input type="text" id="unit-price-input-` + product_item_id + `" class="form-control mask-money" data-return-type="number"></div>
                                </div></a>`)
                    $.fn.initMaskMoney2();
                    $('#' + row_id + ' #unit-price-input-' + product_item_id).on('change', function () {
                        let tr = $(this).closest('tr');
                        let input_show = tr.find('.product-unit-price-select-box');
                        let quantity = tr.find('.product-quantity');
                        let tax = tr.find('.product-tax-select-box option:selected');
                        let subtotal_show = tr.find('.product-subtotal-price');
                        let subtotal_after_tax_show = tr.find('.product-subtotal-price-after-tax');
                        input_show.attr('value', $(this).attr('value'));
                        $(`a[data-id="unit-price-a-` + product_item_id + `"]`).attr('data-value', $(this).attr('value'));
                        $.fn.initMaskMoney2();
                        if ($(this).attr('value') && input_show.attr('value') && quantity.val() && tax.attr('data-rate')) {
                            subtotal_show.attr('value', parseFloat(input_show.attr('value')) * parseInt(quantity.val()));
                            let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                            subtotal_after_tax_show.attr('value',parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
                        }
                        else {
                            input_show.attr('value', '');
                            subtotal_show.attr('value', '');
                            subtotal_after_tax_show.attr('value', '');
                        }
                        calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
                    })
                    $('#' + row_id + ' .product-quantity').on('change', function () {
                        let tr = $(this).closest('tr');
                        let input_show = tr.find('.product-unit-price-select-box');
                        let tax = tr.find('.product-tax-select-box option:selected');
                        let subtotal_show = tr.find('.product-subtotal-price');
                        let subtotal_after_tax_show = tr.find('.product-subtotal-price-after-tax');
                        $.fn.initMaskMoney2();
                        if (input_show.attr('value') && $(this).attr('value') && tax.attr('data-rate')) {
                            subtotal_show.attr('value', parseFloat(input_show.attr('value')) * parseInt($(this).val()));
                            let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                            subtotal_after_tax_show.attr('value', parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
                        }
                        else {
                            input_show.attr('value', '');
                            subtotal_show.attr('value', '');
                            subtotal_after_tax_show.attr('value', '');
                        }
                        calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
                    })
                    $('#' + row_id + ' .product-tax-select-box').on('change', function () {
                        let tr = $(this).closest('tr');
                        let tax = $(this).find('option:selected');
                        let quantity = tr.find('.product-quantity');
                        let subtotal_show = tr.find('.product-subtotal-price');
                        let subtotal_after_tax_show = tr.find('.product-subtotal-price-after-tax');
                        $.fn.initMaskMoney2();
                        if (quantity.val() && tax.attr('data-rate')) {
                            let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                            subtotal_after_tax_show.attr('value', parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
                        }
                        calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function count_row(table_body, option, product_id, tax_id, uom_id) {
        let count = 0;
        table_body.find('tr td.number').each(function() {
            count = count + 1;
            $(this).text(count);
            $(this).closest('tr').attr('id', 'row-' + count.toString())
        });
        if (option === 1) {
            loadProductList('row-' + count.toString(), product_id, uom_id);
            loadProductTaxList('row-' + count.toString(), tax_id);
            loadUnitPriceList('row-' + count.toString(), product_id);
        }
        return count;
    }

    function calculate_price(table_body, pretax_div, taxes_div, total_div) {
        $.fn.initMaskMoney2();
        let row_count = table_body.find('tr').length;
        let sum_subtotal_price_value = 0;
        let sum_price_after_tax_value = 0;
        let sum_tax_value = 0;
        for (let i = 1; i <= row_count; i++) {
            let row_id = '#row-' + i.toString();
            let subtotal_price_value = parseFloat(table_body.find(row_id + ' .product-subtotal-price').attr('value'));
            let price_after_tax_value = parseFloat(table_body.find(row_id + ' .product-subtotal-price-after-tax').attr('value'));
            let tax_value = parseFloat(table_body.find(row_id + ' .product-tax-select-box option:selected').attr('data-rate')) / 100 * subtotal_price_value;
            if (!isNaN(subtotal_price_value) && !isNaN(price_after_tax_value) && !isNaN(tax_value)) {
                sum_subtotal_price_value = sum_subtotal_price_value + subtotal_price_value;
                sum_price_after_tax_value = sum_price_after_tax_value + price_after_tax_value;
                sum_tax_value = sum_tax_value + tax_value;
            }
        }
        pretax_div.attr('data-init-money', sum_subtotal_price_value);
        taxes_div.attr('data-init-money', sum_tax_value);
        total_div.attr('data-init-money', sum_price_after_tax_value);
    }

    function loadCreator() {
        let ele = $('#creator-select-box');
        ele.html('');
        employee_list.map(function (item) {
            if (item.id === $('#data-init-advance-create-request-employee-id').val()) {
                ele.append(`<option selected data-department-id="` + item.group.id + `" data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                $('#creator-detail-span').prop('hidden', false);
                $('#creator-name').text($('#creator-select-box option:selected').attr('data-name'));
                $('#creator-code').text($('#creator-select-box option:selected').attr('data-code'));
                $('#creator-department').text($('#creator-select-box option:selected').attr('data-department'));
                let url = $('#btn-detail-creator-tab').attr('data-url').replace('0', $('#creator-select-box option:selected').attr('value'));
                $('#btn-detail-creator-tab').attr('href', url);
            }
            else {
                ele.append(`<option data-department-id="` + item.group.id + `" data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
            }
        })
    }

    function loadBeneficiary(sale_person_id) {
        let ele = $('#beneficiary-select-box');
        ele.html('');
        if (sale_person_id) {
            employee_list.map(function (item) {
                if (item.id === sale_person_id) {
                    ele.append(`<option selected data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                    $('#beneficiary-detail-span').prop('hidden', false);
                    $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
                    $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
                    $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
                    let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
                    $('#btn-detail-beneficiary-tab').attr('href', url);
                }
            })
        }
        else {
            employee_list.map(function (item) {
                if (item.group.id === $('#creator-select-box option:selected').attr('data-department-id')) {
                    if (item.id === $('#data-init-advance-create-request-employee-id').val()) {
                        ele.append(`<option selected data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                        $('#beneficiary-detail-span').prop('hidden', false);
                        $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
                        $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
                        $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
                        let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
                        $('#btn-detail-beneficiary-tab').attr('href', url);
                    } else {
                        ele.append(`<option data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                    }
                }
            })
        }
    }

    function loadSupplier(supplier_id) {
        let ele = $('#supplier-select-box');
        ele.html('');
        ele.append(`<option></option>`);
        account_list.map(function (item) {
            if (item.account_type.includes('Supplier')) {
                if (supplier_id === item.id) {
                    ele.append(`<option selected data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
                }
                else {
                    ele.append(`<option data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
                }
            }
        })
    }

    function loadCountries(country_mapped) {
        let ele = $('#country-select-box-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected></option>`)
                    if (data.hasOwnProperty('countries') && Array.isArray(data.countries)) {
                        data.countries.map(function (item) {
                            if (country_mapped === item.id) {
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

    function ClickEditBankBtn() {
        loadCountries($(this).closest('.card').find('a.country-id-label').text());
        $('#bank-account-order').val($(this).closest('.card').attr('id'));
        $('#bank-name-id').val($(this).closest('.card').find('a.bank-name-label').text());
        $('#bank-code-id').val($(this).closest('.card').find('a.bank-code-label').text());
        $('#bank-account-name-id').val($(this).closest('.card').find('a.bank-account-name-label').text());
        $('#bank-account-number-id').val($(this).closest('.card').find('a.bank-account-number-label').text());
        $('#bic-swift-code-id').val($(this).closest('.card').find('a.bic-swift-code-label').text());

        let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
        let bank_order = parseInt($(this).closest('.card').attr('id').replace('bank-account-', ''));
        let is_default = account_bank_accounts_information_dict[supplier_id][bank_order].is_default
        if (is_default) {
            $('#make-default-shipping-address').prop('checked', true);
            $('#make-default-shipping-address').prop('disabled', true);
        }
        else {
            $('#make-default-shipping-address').prop('checked', false);
            $('#make-default-shipping-address').prop('disabled', false);
        }
    }

    function LoadBankAccount() {
        let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
        let bank_info = account_bank_accounts_information_dict[supplier_id];
        let list_bank_accounts_html = ``;

        if (bank_info.length > 0) {
            for (let i = 0; i < bank_info.length; i++) {
                let country_id = bank_info[i].country_id;
                let bank_name = bank_info[i].bank_name;
                let bank_code = bank_info[i].bank_code;
                let bank_account_name = bank_info[i].bank_account_name;
                let bank_account_number = bank_info[i].bank_account_number;
                let bic_swift_code = bank_info[i].bic_swift_code;
                let is_default = '';
                if (bank_info[i].is_default) {
                    is_default = 'checked';
                }
                list_bank_accounts_html += `<div id="bank-account-` + i + `" style="border: solid 2px #ddd;" class="card card-bank-account col-5 ml-3">
                            <span class="mt-2">
                                <div class="row">
                                    <div class="col-6">
                                        <a class="btn-del-bank-account" href="#"><i class="bi bi-x"></i></a>
                                    </div>
                                    <div class="col-6 text-right">
                                        <input disabled class="form-check-input ratio-select-bank-account-default" type="radio" name="bank-account-select-default"` + is_default + `>
                                    </div>
                                </div>
                            </span>
                            <label class="ml-4">Bank account name: <a href="#" class="bank-account-name-label"><b>` + bank_account_name + `</b></a></label>
                            <label class="ml-4">Bank name: <a href="#" class="bank-name-label"><b>` + bank_name + `</b></a></label>
                            <label class="ml-4">Bank account number: <a href="#" class="bank-account-number-label"><b>` + bank_account_number + `</b></a></label>
                            <label hidden class="ml-4">Country ID: <a class="country-id-label"><b>` + country_id + `</b></a></label>
                            <label hidden class="ml-4">Bank code: <a class="bank-code-label"><b>` + bank_code + `</b></a></label>
                            <label hidden class="ml-4">BIC/SWIFT Code: <a class="bic-swift-code-label"><b>` + bic_swift_code + `</b></a></label>
                            <span class="mb-2">
                                <div class="row">
                                    <div class="col-12 text-right">
                                        <a data-bs-toggle="offcanvas" data-bs-target="#modal-bank-account-information" type="button"
                                           class="btn-edit-bank-account mr-1" href="#">
                                           <i class="bi bi-pencil-square"></i>
                                        </a>
                                    </div>
                                </div>
                            </span>
                        </div>`
            }
            $('#list-bank-account-information').html(list_bank_accounts_html);
            // delete bank account item
            $('.btn-del-bank-account').on('click', function () {
                let bank_order = parseInt($(this).closest('.card').attr('id').replace('bank-account-', ''));
                let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
                account_bank_accounts_information_dict[supplier_id].splice(bank_order, 1);
                $(this).closest('.card').remove();
            })
            // edit bank account item
            $('.btn-edit-bank-account').on('click', ClickEditBankBtn);
        }
        else {
            let supplier_name = $('#supplier-select-box').find('option:selected').text()
            $('#list-bank-account-information').html(`<div class="row">
                <div class="col-12">
                    <div id="notify-none-bank-account" class="alert alert-secondary" role="alert">
                        <span class="alert-icon-wrap"></span>
                        "` + supplier_name + `" has no bank accounts information!
                    </div>
                </div>
            </div>`);
        }
    }

    function ChangeBankInfor() {
        let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
        let bank_order = parseInt($('#bank-account-order').val().replace('bank-account-', ''));
        let is_default = false;
        if ($('#make-default-shipping-address').is(':checked')) {
            is_default = true;
        }
        for (let i = 0; i < account_bank_accounts_information_dict[supplier_id].length; i++) {
            if (is_default) {
                if (i !== bank_order) {
                    account_bank_accounts_information_dict[supplier_id][i].is_default = false;
                }
                else {
                    account_bank_accounts_information_dict[supplier_id][i] = {
                        "bank_code": $('#bank-code-id').val(),
                        "bank_name": $('#bank-name-id').val(),
                        "country_id": $('#country-select-box-id option:selected').attr('value'),
                        "is_default": is_default,
                        "bic_swift_code": $('#bic-swift-code-id').val(),
                        "bank_account_name": $('#bank-account-name-id').val(),
                        "bank_account_number": $('#bank-account-number-id').val()
                    }
                }
            }
            else {
                if (i === bank_order) {
                    account_bank_accounts_information_dict[supplier_id][i] = {
                        "bank_code": $('#bank-code-id').val(),
                        "bank_name": $('#bank-name-id').val(),
                        "country_id": $('#country-select-box-id option:selected').attr('value'),
                        "is_default": is_default,
                        "bic_swift_code": $('#bic-swift-code-id').val(),
                        "bank_account_name": $('#bank-account-name-id').val(),
                        "bank_account_number": $('#bank-account-number-id').val()
                    }
                }
            }
        }
    }

    loadCreator();
    $('#beneficiary-select-box').select2();
    loadSupplier();

    $('#supplier-select-box').on('change', function () {
        if ($(this).find('option:selected').attr('value')) {
            LoadBankAccount();
            $('#supplier-detail-span').prop('hidden', false);
            $('#supplier-name').text($('#supplier-select-box option:selected').attr('data-name'));
            $('#supplier-code').text($('#supplier-select-box option:selected').attr('data-code'));
            $('#supplier-owner').text($('#supplier-select-box option:selected').attr('data-owner'));
            $('#supplier-industry').text($('#supplier-select-box option:selected').attr('data-industry'));
            let url = $('#btn-detail-supplier-tab').attr('data-url').replace('0', $('#supplier-select-box option:selected').attr('value'));
            $('#btn-detail-supplier-tab').attr('href', url);
        }
        else {
            $('#supplier-detail-span').prop('hidden', true);
            $('#btn-detail-supplier-tab').attr('href', '#');
            $('#list-bank-account-information').html(`<div class="row">
                <div class="col-12">
                    <div id="notify-none-bank-account" class="alert alert-secondary" role="alert">
                        <span class="alert-icon-wrap"></span>
                        &nbsp;No bank accounts information!
                    </div>
                </div>
            </div>`)
        }
    })

    $('#creator-select-box').on('change', function () {
        if ($(this).val() !== '') {
            $('#creator-detail-span').prop('hidden', false);
            $('#creator-name').text($('#creator-select-box option:selected').attr('data-name'));
            $('#creator-code').text($('#creator-select-box option:selected').attr('data-code'));
            $('#creator-department').text($('#creator-select-box option:selected').attr('data-department'));
            let url = $('#btn-detail-creator-tab').attr('data-url').replace('0', $('#creator-select-box option:selected').attr('value'));
            $('#btn-detail-creator-tab').attr('href', url);
            loadBeneficiary();
            $('#beneficiary-detail-span').prop('hidden', true);
        }
        else {
            $('#creator-detail-span').prop('hidden', true);
            $('#btn-detail-creator-tab').attr('href', '#');
        }
    })

    $('#beneficiary-select-box').on('change', function () {
        if ($(this).val() !== '') {
            $('#beneficiary-detail-span').prop('hidden', false);
            $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
            $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
            $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
            let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
            $('#btn-detail-beneficiary-tab').attr('href', url);
        }
        else {
            $('#beneficiary-detail-span').prop('hidden', true);
            $('#btn-detail-beneficiary-tab').attr('href', '#');
        }
    })

    $('#save-changes-modal-bank-account').on('click', function () {
        ChangeBankInfor();
        LoadBankAccount();
        $('#btn-close-edit-bank-account').click();
    })

    $('#type-select-box').on('change', function () {
        if ($(this).val() === '1') {
            $('#supplier-select-box').prop('disabled', false);
            $('#supplier-label').addClass('required');
        }
        else {
            $('#supplier-detail-span').prop('hidden', true);
            $('#supplier-select-box').prop('disabled', true);
            $('#supplier-label').removeClass('required');
            $('#supplier-select-box option:selected').prop('selected', false);
        }
    })

    $('#recalculate-price').on('click', function () {
        calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
    })

    $('#form-update-advance').submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        if ($('input[name="sale_code_type"]:checked').val() === 'non-sale') {
            frm.dataForm['sale_code_type'] = 2;
        }
        else if ($('input[name="sale_code_type"]:checked').val() === 'sale') {
            frm.dataForm['sale_code_type'] = 0;
        }
        else if ($('input[name="sale_code_type"]:checked').val() === 'purchase') {
            frm.dataForm['sale_code_type'] = 1;
        }
        else {
            frm.dataForm['sale_code_type'] = 3;
        }

        if (frm.dataForm['method'] === '0') {
            frm.dataForm['method'] = 0;
        }
        else if (frm.dataForm['method'] === '1') {
            frm.dataForm['method'] = 1;
        }
        else {
            frm.dataForm['method'] = 2;
        }

        if (frm.dataForm['advance_payment_type'] === '0') {
            frm.dataForm['advance_payment_type'] = 0;
        }
        else if (frm.dataForm['advance_payment_type'] === '1') {
            frm.dataForm['advance_payment_type'] = 1;
        }
        else {
            frm.dataForm['advance_payment_type'] = 2;
        }

        if ($('#creator-select-box').val() !== null) {
            frm.dataForm['creator_name'] = $('#creator-select-box').val();
        }
        else {
            frm.dataForm['creator_name'] = null;
        }

        if ($('#beneficiary-select-box').val() !== null) {
            frm.dataForm['beneficiary'] = $('#beneficiary-select-box').val();
        }
        else {
            frm.dataForm['beneficiary'] = null;
        }

        if ($('#tab_line_detail tbody').find('tr').length > 0) {
            let table_body = $('#tab_line_detail tbody');
            let row_count = table_body.find('tr').length;
            let product_valid_list = [];
            for (let i = 1; i <= row_count; i++) {
                let row_id = '#row-' + i.toString();
                let product_selected = table_body.find(row_id + ' .product-select-box option:selected');
                let uom_selected = table_body.find(row_id + ' .product-uom-select-box option:selected');
                let subtotal_price_value = parseFloat(table_body.find(row_id + ' .product-subtotal-price').attr('value'));
                let price_after_tax_value = parseFloat(table_body.find(row_id + ' .product-subtotal-price-after-tax').attr('value'));
                let tax_value = parseFloat(table_body.find(row_id + ' .product-tax-select-box option:selected').attr('data-rate')) / 100 * subtotal_price_value;
                let unit_price_value = parseFloat(table_body.find(row_id + ' .product-unit-price-select-box').attr('value'));
                if (!isNaN(subtotal_price_value) && !isNaN(price_after_tax_value) && !isNaN(tax_value)) {
                    product_valid_list.push({
                        'product_id': product_selected.attr('value'),
                        'unit_of_measure_id': uom_selected.attr('value'),
                        'quantity': table_body.find(row_id + ' .product-quantity').val(),
                        'tax_id': table_body.find(row_id + ' .product-tax-select-box option:selected').attr('value'),
                        'unit_price': unit_price_value,
                        'tax_price': tax_value,
                        'subtotal_price': subtotal_price_value,
                        'after_tax_price': price_after_tax_value,
                    })
                }
            }
            frm.dataForm['product_valid_list'] = product_valid_list;
        }

        frm.dataForm['money_gave'] = false;
        if ($('#money-gave').is(':checked')) {
            frm.dataForm['money_gave'] = true;
        }

        if (frm.dataForm['sale_code']) {
            frm.dataForm['sale_code'] = {
                'id': frm.dataForm['sale_code'],
                'type': $('#sale-code-select-box option:selected').attr('data-type')
            }
        }

        frm.dataForm['account_bank_information_dict'] = account_bank_accounts_information_dict;

        frm.dataUrl = frm.dataUrl.replace('/0', '/' + window.location.pathname.split('/').pop())
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
    })

    $('#input-file-now').dropify({
        messages: {
            'default': 'Drag and drop your file here.',
        },
        tpl: {
            message: '<div class="dropify-message">' +
                '<span class="file-icon"></span>' +
                '<h5>{{ default }}</h5>' +
                '</div>',
        }
    });
})
