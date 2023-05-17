$(document).ready(function () {
    $(document).on("click", '#btn-add-row-line-detail', function () {
        let table_body = $('#tab_line_detail tbody');
        table_body.append(`<tr id="" class="row-number">
            <td class="number text-center"></td>
            <td><select class="form-select expense-select-box" data-method="GET"><option selected></option></select></td>
            <td><input class="form-control expense-type" style="color: black; background: none" disabled></td>
            <td><select class="form-select expense-uom-select-box" data-method="GET"><option selected></option></select></td>
            <td><input type="number" min="1" class="form-control expense-quantity" value="1"></td>
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
        </tr>`);
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

            $('#' + parent_tr.attr('id') + ' .expense-unit-price-select-box').val('');
            $('#' + parent_tr.attr('id') + ' .expense-quantity').val(1);
            $('#' + parent_tr.attr('id') + ' .expense-subtotal-price').val('');

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

    function loadExpenseList(row_id) {
        let ele = $('#' + row_id + ' .expense-select-box');
        ele.select2();
        ele.html('');
        $.fn.callAjax($('#tab_line_detail_datatable').attr('data-url-expense-list'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                console.log(data)
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense_list')) {
                    ele.append(`<option></option>`);
                    resp.data.expense_list.map(function (item) {
                        let tax_code_id = '';
                        if (item.general_information.tax_code) {
                            tax_code_id = item.general_information.tax_code.id;
                        }
                        ele.append(`<option data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.expense_type.title + `" data-uom-id="` + item.general_information.uom.id + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadExpenseUomList(row_id, uom_group_id, uom_mapped_id) {
        let ele = $('#' + row_id + ' .expense-uom-select-box');
        ele.html('');
        $.fn.callAjax($('#tab_line_detail_datatable').attr('data-url-uom-list'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                console.log(data)
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
                console.log(data)
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
                console.log(data)
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

    function loadSaleCode() {
        let ele = $('#sale-code-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                console.log(data)
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('quotation_list')) {
                    ele.append(`<option></option>`);
                    resp.data.quotation_list.map(function (item) {
                        if (item.opportunity.id) {
                            ele.append(`<option data-sale-code-id="` + item.sale_person.id + `" value="` + item.opportunity.id + `">` + item.opportunity.code + ` - ` + item.opportunity.title + `</option>`);
                        }
                    })
                }
            }
        }, (errs) => {
        },)
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
                }
            }
        }, (errs) => {
        },)
    }

    function loadBeneficiary(sale_person_id) {
        let ele = $('#beneficiary-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                    ele.append(`<option></option>`);
                    if (sale_person_id) {
                        resp.data.employee_list.map(function (item) {
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
                        resp.data.employee_list.map(function (item) {
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
            }
        }, (errs) => {
        },)
    }

    function loadSupplier() {
        let ele = $('#supplier-select-box');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('account_list')) {
                    ele.append(`<option></option>`);
                    resp.data.account_list.map(function (item) {
                        ele.append(`<option data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    loadCreator();
    $('#creator-select-box').select2();
    loadBeneficiary(sale_person_id=null);
    $('#beneficiary-select-box').select2();
    loadSupplier();

    $('#return-date-id').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'YYYY-MM-DD HH:mm'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'),10)
    });

    $('#created_date_id').daterangepicker({
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
            loadSaleCode();
            $('#beneficiary-select-box').prop('disabled', true);
        }
        if ($(this).val() === 'non-sale') {
            $('#sale-code-select-box').prop('disabled', true);
            $('#sale-code-select-box').val('');
            $('#beneficiary-select-box').prop('disabled', false);
        }
    })

    $('#sale-code-select-box').on('change', function () {
        if ($('#sale-code-select-box option:selected').attr('data-sale-code-id')) {
            $('#notify-none-sale-code').prop('hidden', true);
            loadBeneficiary($('#sale-code-select-box option:selected').attr('data-sale-code-id'));
        }
        else {
            $('#notify-none-sale-code').prop('hidden', false);
        }
    })

    $('#supplier-select-box').on('change', function () {
        if ($(this).val() !== '') {
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

    $('#type-select-box').on('change', function () {
        if ($(this).val() === '1') {
            $('#supplier-select-box').prop('disabled', false);
            $('#supplier-label').addClass('required');
        }
        else {
            $('#supplier-select-box').prop('disabled', true);
            $('#supplier-label').removeClass('required');
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

        if (frm.dataForm['type'] === '0') {
            frm.dataForm['type'] = 0;
        }
        else if (frm.dataForm['type'] === '1') {
            frm.dataForm['type'] = 1;
        }
        else {
            frm.dataForm['type'] = 2;
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
                let subtotal_price_value = parseFloat(table_body.find(row_id + ' .expense-subtotal-price').attr('value'));
                let price_after_tax_value = parseFloat(table_body.find(row_id + ' .expense-subtotal-price-after-tax').attr('value'));
                let tax_value = parseFloat(table_body.find(row_id + ' .expense-tax-select-box option:selected').attr('data-rate')) / 100 * subtotal_price_value;
                if (!isNaN(subtotal_price_value) && !isNaN(price_after_tax_value) && !isNaN(tax_value)) {
                    expense_valid_list.push({
                        'expense_id': expense_selected.attr('value'),
                        'unit_of_measure_id': expense_selected.attr('data-uom-id'),
                        'quantity': table_body.find(row_id + ' .expense-quantity').val(),
                        'tax_id': table_body.find(row_id + ' .expense-tax-select-box option:selected').attr('value'),
                        'unit_price': parseFloat(table_body.find(row_id + ' .expense-unit-price-select-box').attr('value')),
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
                    $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
    })
})
