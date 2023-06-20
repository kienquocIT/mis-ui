$(document).ready(function () {
    let load_default = 0;
    let advance_payment_expense_items = [];
    let payment_cost_items_filtered = [];
    const ap_list = JSON.parse($('#advance_payment_list').text());

    let plan_db = $('#tab_plan_datatable_div').html();
    const sale_order_list = JSON.parse($('#sale_order_list').text());
    const quotation_list = JSON.parse($('#quotation_list').text());
    const expense_list = JSON.parse($('#expense_list').text());
    const account_list = JSON.parse($('#account_list').text());
    const opportunity_list = JSON.parse($('#opportunity_list').text());
    const account_bank_accounts_information_dict = account_list.reduce((obj, item) => {
        obj[item.id] = item.bank_accounts_information;
        return obj;
    }, {});
    $(document).on("click", '#btn-add-row-line-detail', function () {
        let table_body = $('#tab_line_detail tbody');
        table_body.append(`<tr id="" class="row-number">
            <td class="number text-center"></td>
            <td><select class="form-select expense-select-box" data-method="GET"><option selected></option></select></td>
            <td><input class="form-control expense-type" style="color: black; background: none" disabled></td>
            <td><select class="form-select expense-uom-select-box" data-method="GET"><option selected></option></select></td>
            <td><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control expense-quantity" value="1"></td>
            <td><div class="input-group dropdown" aria-expanded="false" data-bs-toggle="dropdown">
                    <span class="input-affix-wrapper">
                        <input disabled data-return-type="number" type="text" class="form-control expense-unit-price-select-box mask-money" style="color: black; background: none" placeholder="Select a price or enter">
                    </span>
                </div>
                <div style="min-width: 25%" class="dropdown-menu" data-method="GET"></div></td>
            <td><select class="form-select expense-tax-select-box" data-method="GET"><option selected></option></select></td>
            <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price mask-money" style="color: black; background: none" disabled></td>
            <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price-after-tax mask-money" style="color: black; background: none" disabled></td>
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
        $('#row-' + row_count + ' .expense-select-box').on('change', function () {
            let parent_tr = $(this).closest('tr');
            parent_tr.find('.expense-type').val($(this).find('option:selected').attr('data-type'));
            parent_tr.find('.expense-tax-select-box').val($(this).find('option:selected').attr('data-tax-id'));

            $('#' + parent_tr.attr('id') + ' .expense-unit-price-select-box').attr('value', '');
            $('#' + parent_tr.attr('id') + ' .expense-quantity').val(1);
            $('#' + parent_tr.attr('id') + ' .expense-subtotal-price').attr('value', '');
            $('#' + parent_tr.attr('id') + ' .expense-subtotal-price-after-tax').attr('value', '');
            calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));

            if ($(this).find('option:selected').val() !== '') {
                loadExpenseUomList(parent_tr.attr('id'), $(this).find('option:selected').attr('data-uom-group-id'), $(this).find('option:selected').attr('data-uom-id'));
                loadUnitPriceList(parent_tr.attr('id'), $(this).find('option:selected').val());
            }
            else {
                $('#' + parent_tr.attr('id') + ' .expense-uom-select-box').empty();
                $('#' + parent_tr.attr('id') + ' .dropdown-menu').html('');
            }
        })
    });

    // console.log(sale_order_list)
    // console.log(quotation_list)
    // console.log(opportunity_list)

    function loadExpenseList(row_id) {
        let ele = $('#' + row_id + ' .expense-select-box');
        ele.select2();
        ele.html('');
        ele.append(`<option></option>`);
        expense_list.map(function (item) {
            let tax_code_id = '';
            if (item.general_information.tax_code) {
                tax_code_id = item.general_information.tax_code.id;
            }
            ele.append(`<option data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.expense_type.title + `" data-uom-id="` + item.general_information.uom.id + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
        })
    }

    function loadExpenseUomList(row_id, uom_group_id, uom_mapped_id) {
        let ele = $('#' + row_id + ' .expense-uom-select-box');
        ele.html('');
        $.fn.callAjax($('#tab_line_detail_datatable').attr('data-url-uom-list'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                    resp.data.unit_of_measure.map(function (item) {
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
            }
        }, (errs) => {
        },)
    }

    function loadExpenseTaxList(row_id) {
        let ele = $('#' + row_id + ' .expense-tax-select-box');
        ele.html('');
        $.fn.callAjax($('#tab_line_detail_datatable').attr('data-url-tax-list'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    ele.append(`<option data-rate="0" selected></option>`);
                    resp.data.tax_list.map(function (item) {
                        ele.append(`<option data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadUnitPriceList(row_id, expense_item_id) {
        let ele = $('#' + row_id + ' .dropdown-menu');
        ele.html('');
        $.fn.callAjax($('#tab_line_detail_datatable').attr('data-url-unit-price-list').replace('/0', '/' + expense_item_id), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense')) {
                    let primary_currency = 'VND';
                    resp.data.expense.general_information.price_list.map(function (item) {
                        if (item.is_primary === true) {
                            primary_currency = item.abbreviation;
                            ele.append(`<a data-id="` + item.id + `" data-value="` + item.price_value + `" class="dropdown-item"><div class="row">
                                        <div class="col-7 text-left"><span>` + item.title + `:</span></div>
                                        <div class="col-5 text-right"><span class="mask-money" data-init-money="` + item.price_value + `"></span></div>
                                        </div></a>`)
                            $.fn.initMaskMoney2();
                            $(`a[data-id=` + item.id + `]`).on('click', function () {
                                let tr = $(this).closest('tr');
                                let input_show = tr.find('.expense-unit-price-select-box');
                                let subtotal_show = tr.find('.expense-subtotal-price');
                                let subtotal_after_tax_show = tr.find('.expense-subtotal-price-after-tax');
                                let quantity = tr.find('.expense-quantity');
                                let tax = tr.find('.expense-tax-select-box option:selected');
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
                    ele.append(`<a data-id="unit-price-a-` + expense_item_id + `" data-value=""><div class="row">
                                <div class="col-7 text-left col-form-label"><span style="color: #007D88">Enter price in <b>` + primary_currency + `</b>:</span></div>
                                <div class="col-5 text-right"><input type="text" id="unit-price-input-` + expense_item_id + `" class="form-control mask-money" data-return-type="number"></div>
                                </div></a>`)
                    $.fn.initMaskMoney2();
                    $('#' + row_id + ' #unit-price-input-' + expense_item_id).on('change', function () {
                        let tr = $(this).closest('tr');
                        let input_show = tr.find('.expense-unit-price-select-box');
                        let quantity = tr.find('.expense-quantity');
                        let tax = tr.find('.expense-tax-select-box option:selected');
                        let subtotal_show = tr.find('.expense-subtotal-price');
                        let subtotal_after_tax_show = tr.find('.expense-subtotal-price-after-tax');
                        input_show.attr('value', $(this).attr('value'));
                        $(`a[data-id="unit-price-a-` + expense_item_id + `"]`).attr('data-value', $(this).attr('value'));
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
                    $('#' + row_id + ' .expense-quantity').on('change', function () {
                        let tr = $(this).closest('tr');
                        let input_show = tr.find('.expense-unit-price-select-box');
                        let tax = tr.find('.expense-tax-select-box option:selected');
                        let subtotal_show = tr.find('.expense-subtotal-price');
                        let subtotal_after_tax_show = tr.find('.expense-subtotal-price-after-tax');
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
                    $('#' + row_id + ' .expense-tax-select-box').on('change', function () {
                        let tr = $(this).closest('tr');
                        let tax = $(this).find('option:selected');
                        let quantity = tr.find('.expense-quantity');
                        let subtotal_show = tr.find('.expense-subtotal-price');
                        let subtotal_after_tax_show = tr.find('.expense-subtotal-price-after-tax');
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

    function count_row(table_body, option) {
        let count = 0;
        table_body.find('tr td.number').each(function() {
            count = count + 1;
            $(this).text(count);
            $(this).closest('tr').attr('id', 'row-' + count.toString())
        });
        if (option === 1) {
            loadExpenseList('row-' + count.toString());
            loadExpenseTaxList('row-' + count.toString());
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
            let subtotal_price_value = parseFloat(table_body.find(row_id + ' .expense-subtotal-price').attr('value'));
            let price_after_tax_value = parseFloat(table_body.find(row_id + ' .expense-subtotal-price-after-tax').attr('value'));
            let tax_value = parseFloat(table_body.find(row_id + ' .expense-tax-select-box option:selected').attr('data-rate')) / 100 * subtotal_price_value;
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

    function loadSaleCode(beneficiary) {
        let quotation_loaded = [];
        let oppcode_loaded = [];
        let ele = $('#sale-code-select-box2');
        ele.html('');
        ele.append(`<input class="form-control mb-2" type="text" id="search-sale-code-Input" placeholder="Search by sale code title">`)
        sale_order_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (Object.keys(item.quotation).length !== 0) {
                    quotation_loaded.push(item.quotation.id);
                }
                if (Object.keys(item.opportunity).length !== 0) {
                    oppcode_loaded.push(item.opportunity.id);
                    ele.append(`<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `"><div class="row"><span class="text-danger code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-left" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`);
                }
                else {
                    ele.append(`<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code"><div class="row"><span class="text-danger code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-left" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`);
                }
            }
        })
        quotation_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (quotation_loaded.includes(item.id) === false) {
                    if (Object.keys(item.opportunity).length !== 0) {
                        oppcode_loaded.push(item.opportunity.id);
                        ele.append(`<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `"><div class="row"><span class="text-primary code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-left" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`);
                    }
                    else {
                        ele.append(`<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code"><div class="row"><span class="text-primary code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-left" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`);
                    }
                }
            }
        })
        opportunity_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (oppcode_loaded.includes(item.id) === false) {
                    ele.append(`<a data-value="` + item.id + `" class="dropdown-item" href="#"><div class="row"><span class="text-blue code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-left" data-type="2" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`);
                }
            }
        })

        const searchInput = $('#search-sale-code-Input');
        const dropdownList = $('.dropdown-menu');
        const items = dropdownList.find('.title-span');

        searchInput.on('input', function() {
            const input = searchInput.val().toLowerCase();

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const text = item.textContent.toLowerCase();

                if (text.indexOf(input) > -1) {
                    item.closest('a').style.display = '';
                } else {
                    item.closest('a').style.display = 'none';
                }
            }
        });

        $('#sale-code-select-box2 .dropdown-item').on('click', function () {
            let sale_code_id = $(this).attr('data-value');
            $.fn.callAjax($('#tab_plan_datatable').attr('data-url-payment-cost-items') + '?filter_sale_code=' + sale_code_id, 'GET').then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('payment_cost_items_list')) {
                        payment_cost_items_filtered = data.payment_cost_items_list;
                    }
                }
            })

            advance_payment_expense_items = [];
            for (let i = 0; i < ap_list.length; i++) {
                if (ap_list[i].sale_order_mapped === $(this).attr('data-value') || ap_list[i].quotation_mapped === $(this).attr('data-value')) {
                    advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                }
            }

            $('#sale-code-select-box2-show').val($(this).find('.title-span').text())
            $('#sale-code-select-box option:selected').attr('selected', false);
            $('#sale-code-select-box').find(`option[value="` + $(this).attr('data-value') + `"]`).attr('selected', true);
            if ($('#sale-code-select-box option:selected').attr('data-sale-person-id')) {
                if ($('#sale-code-select-box option:selected').attr('data-type') === '0') {
                    loadSaleOrderExpense($('#sale-code-select-box option:selected').attr('value'));
                }
                if ($('#sale-code-select-box option:selected').attr('data-type') === '1') {
                    loadQuotationExpense($('#sale-code-select-box option:selected').attr('value'));
                }
                if ($('#sale-code-select-box option:selected').attr('data-type') === '2') {
                    $('#beneficiary-select-box').prop('disabled', true);
                }
                $('#notify-none-sale-code').prop('hidden', true);
                $('#tab_plan_datatable').prop('hidden', false);
            }
            else {
                $('#notify-none-sale-code').prop('hidden', false);
                $('#tab_plan_datatable').prop('hidden', true);
            }
        })

        let ele2 = $('#sale-code-select-box');
        ele2.html('');
        ele2.append(`<option></option>`);
        sale_order_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (Object.keys(item.quotation).length !== 0) {
                    quotation_loaded.push(item.quotation.id);
                }
                if (Object.keys(item.opportunity).length !== 0) {
                    oppcode_loaded.push(item.opportunity.id);
                    ele2.append(`<option data-sale-code="` + item.opportunity.code + `" data-type="0" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">` + item.title + `</option>`);
                }
                else {
                    ele2.append(`<option data-sale-code="` + item.code + `" data-type="0" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">` + item.title + `</option>`);
                }
            }
        })
        quotation_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (quotation_loaded.includes(item.id) === false) {
                    if (Object.keys(item.opportunity).length !== 0) {
                        oppcode_loaded.push(item.opportunity.id);
                        ele2.append(`<option data-sale-code="` + item.opportunity.code + `" data-type="1" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">` + item.title + `</option>`);
                    }
                    else {
                        ele2.append(`<option data-sale-code="` + item.code + `" data-type="1" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">` + item.title + `</option>`);
                    }
                }
            }
        })
        opportunity_list.map(function (item) {
            if (oppcode_loaded.includes(item.id) === false) {
                let sale_person_id_list = [];
                for (let i = 0; i < item.sale_person.length; i++) {
                    sale_person_id_list.push(item.sale_person[i].id)
                }
                if (sale_person_id_list.includes(beneficiary)) {
                    ele2.append(`<option data-sale-code="` + item.code + `" data-type="2" data-sale-person-id="` + sale_person_id_list + `" value="` + item.id + `">(` + item.code + `) ` + item.title + `</option>`);
                }
            }
        })
    }

    function loadCreator() {
        let ele = $('#creator-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                    ele.append(`<option></option>`);
                    resp.data.employee_list.map(function (item) {
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
                    if (load_default === 0) {
                        // $('#beneficiary-select-box').prop('disabled', true);
                        loadBeneficiary('', $('#creator-select-box option:selected').attr('data-department-id'), $('#data-init-advance-create-request-employee-id').val());
                        $('#sale-code-select-box').prop('disabled', false);
                        loadSaleCode($('#data-init-advance-create-request-employee-id').val());
                        load_default = 1;
                    }
                }
            }
        }, (errs) => {
        },)
    }

    function loadBeneficiary(sale_person_id, department_id, creator_id) {
        let ele = $('#beneficiary-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                    if (sale_person_id) {
                        resp.data.employee_list.map(function (item) {
                            if (sale_person_id.includes(item.id)) {
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
                        resp.data.employee_list.map(function (item) {
                            if (item.group.id === department_id) {
                                if (item.id === creator_id) {
                                    ele.append(`<option selected data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                                    $('#beneficiary-detail-span').prop('hidden', false);
                                    $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
                                    $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
                                    $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
                                    let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
                                    $('#btn-detail-beneficiary-tab').attr('href', url);
                                } else {
                                    ele.append(`<option data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                                    if ($('#radio-non-sale').is(':checked')) {
                                        $('#beneficiary-detail-span').prop('hidden', true);
                                        $('#beneficiary-name').text('');
                                        $('#beneficiary-code').text('');
                                        $('#beneficiary-department').text('');
                                        $('#btn-detail-beneficiary-tab').attr('href', '#');
                                    }
                                }
                            }
                        })
                    }
                }
            }
        }, (errs) => {
        },)
    }

    function loadSupplier() {
        let ele = $('#supplier-select-box');
        ele.html('');
        ele.append(`<option></option>`);
        account_list.map(function (item) {
            if (item.account_type.includes('Supplier')) {
                ele.append(`<option data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
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

    $('#return_date_id').dateRangePickerDefault({
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: true,
        minYear: parseInt(moment().format('YYYY')),
        minDate: new Date(parseInt(moment().format('YYYY')), parseInt(moment().format('MM'))-1, parseInt(moment().format('DD'))),
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY')) + 100
    });

    $('#created_date_id').dateRangePickerDefault({
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

    $('.sale_code_type').on('change', function () {
        $('#btn-change-sale-code-type').text($('input[name="sale_code_type"]:checked').val())
        if ($(this).val() === 'sale') {
            $('#sale-code-select-box').prop('disabled', false);
            $('#sale-code-select-box2-show').css({
                'background': 'none',
            });
            $('#sale-code-select-box2-show').attr('disabled', false);
            $('#sale-code-select-box2-show').attr('placeholder', 'Select one');
            loadSaleCode($('#beneficiary-select-box').val());
            // $('#beneficiary-select-box').prop('disabled', true);
        }
        if ($(this).val() === 'non-sale') {
            $('#sale-code-select-box').prop('disabled', true);
            $('#sale-code-select-box').val('');
            $('#sale-code-select-box2-show').attr('style', '');
            $('#sale-code-select-box2-show').attr('disabled', true);
            $('#sale-code-select-box2-show').attr('placeholder', 'Can not select with Non-Sale');
            $('#beneficiary-select-box').prop('disabled', false);
            $('#notify-none-sale-code').prop('hidden', false);
            $('#tab_plan_datatable').prop('hidden', true);
            $('#sale-code-select-box2-show').val('');
        }
    })

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

    $('#beneficiary-select-box').on('change', function () {
        loadSaleCode($('#beneficiary-select-box').val());
        $('#beneficiary-detail-span').prop('hidden', false);
        $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
        $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
        $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
        let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
        $('#btn-detail-beneficiary-tab').attr('href', url);
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

    $('#form-create-advance').submit(function (event) {
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
            let expense_valid_list = [];
            for (let i = 1; i <= row_count; i++) {
                let row_id = '#row-' + i.toString();
                let expense_selected = table_body.find(row_id + ' .expense-select-box option:selected');
                let uom_selected = table_body.find(row_id + ' .expense-uom-select-box option:selected');
                let subtotal_price_value = parseFloat(table_body.find(row_id + ' .expense-subtotal-price').attr('value'));
                let price_after_tax_value = parseFloat(table_body.find(row_id + ' .expense-subtotal-price-after-tax').attr('value'));
                let tax_value = parseFloat(table_body.find(row_id + ' .expense-tax-select-box option:selected').attr('data-rate')) / 100 * subtotal_price_value;
                let unit_price_value = parseFloat(table_body.find(row_id + ' .expense-unit-price-select-box').attr('value'));
                if (!isNaN(subtotal_price_value) && !isNaN(price_after_tax_value) && !isNaN(tax_value)) {
                    expense_valid_list.push({
                        'expense_id': expense_selected.attr('value'),
                        'unit_of_measure_id': uom_selected.attr('value'),
                        'quantity': table_body.find(row_id + ' .expense-quantity').val(),
                        'tax_id': table_body.find(row_id + ' .expense-tax-select-box option:selected').attr('value'),
                        'unit_price': unit_price_value,
                        'tax_price': tax_value,
                        'subtotal_price': subtotal_price_value,
                        'after_tax_price': price_after_tax_value,
                    })
                }
            }
            frm.dataForm['expense_valid_list'] = expense_valid_list;
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

        // console.log(frm.dataForm)

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let waittime = 1000;
                        if (frm.dataForm['money_gave']) {
                            setTimeout(
                                Swal.fire({
                                    html:
                                    '<div class="d-flex align-items-center"><i class="bi bi-cash-coin me-2 fs-1 text-success"></i><h4 class="mb-0">Money has been sent.</h4></div>',
                                    customClass: {
                                        content: 'p-0',
                                        actions: 'justify-content-start',
                                    },
                                    width: 400,
                                    showConfirmButton:false,
                                    buttonsStyling: false
                                }), 3000
                            );
                            waittime = 3000;
                        }
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, waittime);
                    }
                },
                (errs) => {
                    $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
    })

    function loadSaleOrderExpense(filter_sale_order) {
        $('#tab_plan_datatable').remove();
        $('#tab_plan_datatable_div').html(plan_db);
        let dtb = $('#tab_plan_datatable');
        let frm = new SetupFormSubmit(dtb);
        frm.dataUrl = dtb.attr('data-url-sale-order');
        dtb.DataTableDefault({
            dom: '',
            ajax: {
                url: frm.dataUrl + '?filter_sale_order=' + filter_sale_order,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_detail = data.sale_order_expense_list
                        for (let i = 0; i < data_detail.length; i++) {
                            let expense_id = data_detail[i].expense_id;
                            let results = advance_payment_expense_items.filter(function(item) {
                                return item.expense.id === expense_id;
                            });
                            let sum_AP_approved = results.reduce(function(s, item) {
                                return s + item.after_tax_price;
                            }, 0);
                            let returned = results.reduce(function(s, item) {
                                return s + item.returned_total;
                            }, 0);
                            let to_payment = results.reduce(function(s, item) {
                                return s + item.to_payment_total;
                            }, 0);
                            let available = results.reduce(function(s, item) {
                                return s + item.available_total;
                            }, 0);
                            data_detail[i].sum_AP_approved = sum_AP_approved;
                            data_detail[i].returned = returned;
                            data_detail[i].to_payment = to_payment;
                            data_detail[i].available = available;

                            let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                                return item.expense_id === expense_id;
                            });
                            let others_payment = payment_cost_items_list.reduce(function(s, item) {
                                return s + item.real_value;
                            }, 0);
                            data_detail[i].others_payment = others_payment;

                            if (data_detail[i].available < 0) {
                                data_detail[i].available = 0;
                            }

                        }
                        return resp.data['sale_order_expense_list'] ? resp.data['sale_order_expense_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    data: 'expense_title',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<a href="#"><span>` + row.expense_title + `</span></a>`
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
                        return `<span>` + row.plan_after_tax.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'sum_AP_approved',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.sum_AP_approved.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'returned',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.returned.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'to_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.to_payment.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'others_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.others_payment.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'available',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.available.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                }
            ],
        });
    }

    function loadQuotationExpense(filter_quotation) {
        $('#tab_plan_datatable').remove();
        $('#tab_plan_datatable_div').html(plan_db);
        let dtb = $('#tab_plan_datatable');
        let frm = new SetupFormSubmit(dtb);
        frm.dataUrl = dtb.attr('data-url-quotation');
        dtb.DataTableDefault({
            dom: '',
            ajax: {
                url: frm.dataUrl + '?filter_quotation=' + filter_quotation,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_detail = data.quotation_expense_list
                        for (let i = 0; i < data_detail.length; i++) {
                            let expense_id = data_detail[i].expense_id;
                            let results = advance_payment_expense_items.filter(function(item) {
                                return item.expense.id === expense_id;
                            });
                            let sum_AP_approved = results.reduce(function(s, item) {
                                return s + item.after_tax_price;
                            }, 0);
                            let returned = results.reduce(function(s, item) {
                                return s + item.returned_total;
                            }, 0);
                            let to_payment = results.reduce(function(s, item) {
                                return s + item.to_payment_total;
                            }, 0);
                            let available = results.reduce(function(s, item) {
                                return s + item.available_total;
                            }, 0);
                            data_detail[i].sum_AP_approved = sum_AP_approved;
                            data_detail[i].returned = returned;
                            data_detail[i].to_payment = to_payment;
                            data_detail[i].available = available;

                            let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                                return item.expense_id === expense_id;
                            });
                            let others_payment = payment_cost_items_list.reduce(function(s, item) {
                                return s + item.real_value;
                            }, 0);
                            data_detail[i].others_payment = others_payment;

                            if (data_detail[i].available < 0) {
                                data_detail[i].available = 0;
                            }
                        }
                        return resp.data['quotation_expense_list'] ? resp.data['quotation_expense_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    data: 'expense_title',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<a href="#"><span>` + row.expense_title + `</span></a>`
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
                        return `<span>` + row.plan_after_tax.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'sum_AP_approved',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.sum_AP_approved.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'returned',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.returned.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'to_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.to_payment.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'others_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.others_payment.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                },
                {
                    data: 'available',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.available.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span>`
                    }
                }
            ],
        });
    }

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
