$(document).ready(function () {
    let advance_payment_expense_items = [];
    let payment_cost_items_filtered = [];
    const ap_list = JSON.parse($('#advance_payment_list').text());

    let url_detail = $('#form-update-payment').attr('data-url-detail').replace('0', $.fn.getPkDetail())
    $.fn.callAjax(url_detail, 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            // console.log(data)
            let opp_code_list = [];
            let payment_detail = data.payment_detail;
            $.fn.compareStatusShowPageAction(payment_detail);
            $('#payment-code').text(payment_detail.code);
            $('#payment-title').val(payment_detail.title);
            $('#created_date_id').val(payment_detail.date_created.split(' ')[0]);
            loadBeneficiary(payment_detail.beneficiary)

            let sale_code_mapped = null;
            if (payment_detail.sale_order_mapped.length > 0) {sale_code_mapped = payment_detail.sale_order_mapped}
            if (payment_detail.quotation_mapped.length > 0) {sale_code_mapped = payment_detail.quotation_mapped}
            if (payment_detail.opportunity_mapped.length > 0) {sale_code_mapped = payment_detail.opportunity_mapped}

            if (payment_detail.sale_code_type === 3) {
                $('#radio-special').prop('checked', true);
                $('#btn-change-sale-code-type').text('MULTI');
                let ele = $('#sale-code-select-box2');
                ele.html(``);
                ele.append(`<div class="h-400p"></div>`);
                ele = $('#sale-code-select-box2 .h-400p');

                ele.append(`<div class="row mb-3"><div class="col-12 text-primary"><b>Sale order</b></div></div>`)
                payment_detail.sale_order_mapped.map(function (item) {
                    opp_code_list.push(item.opportunity.code);
                    if (Object.keys(item.opportunity).length !== 0) {
                        ele.append(`<div class="row mb-2" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `">
                                        <span class="col-4 code-span">&nbsp;&nbsp;` + item.code + `</span>
                                        <span class="col-7 title-span">` + item.title +`</span>
                                        <span class="col-1"><input disabled checked type="checkbox" class="form-check-input multi-sale-code" data-type="0" id="` + item.id + `"></span>
                                    </div>`)
                    }
                    else {
                        ele.append(`<div class="row mb-2" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code">
                                            <span class="col-4 code-span">&nbsp;&nbsp;` + item.code + `</span>
                                            <span class="col-7 title-span">` + item.title +`</span>
                                            <span class="col-1"><input disabled checked type="checkbox" class="form-check-input multi-sale-code" data-type="0" id="` + item.id + `"></span>
                                        </div>`)
                    }
                })

                ele.append(`<div class="row mb-3"><div class="col-12 text-primary"><b>Quotation</b></div></div>`)
                payment_detail.quotation_mapped.map(function (item) {
                    if (Object.keys(item.opportunity).length !== 0) {
                        opp_code_list.push(item.opportunity.code);
                    }
                    if (Object.keys(item.opportunity).length !== 0) {
                        ele.append(`<div class="row mb-2" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `">
                                        <span class="col-4 code-span">&nbsp;&nbsp;` + item.code + `</span>
                                        <span class="col-7 title-span">` + item.title +`</span>
                                        <span class="col-1"><input disabled checked type="checkbox" class="form-check-input multi-sale-code" data-type="0" id="` + item.id + `"></span>
                                    </div>`)
                    }
                    else {
                        ele.append(`<div class="row mb-2" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code">
                                            <span class="col-4 code-span">&nbsp;&nbsp;` + item.code + `</span>
                                            <span class="col-7 title-span">` + item.title +`</span>
                                            <span class="col-1"><input disabled checked type="checkbox" class="form-check-input multi-sale-code" data-type="0" id="` + item.id + `"></span>
                                        </div>`)
                    }
                })
            }
            else if (payment_detail.sale_code_type === 0) {
                $('#radio-sale').prop('checked', true);
                $('#btn-change-sale-code-type').text('Sale');
                if (Object.keys(sale_code_mapped[0].opportunity).length !== 0) {
                    opp_code_list.push(sale_code_mapped[0].opportunity.code);
                    $('#sale-code-select-box2-show').attr('title', sale_code_mapped[0].opportunity.code + ': ' + sale_code_mapped[0].opportunity.title);
                }
                else {
                    $('#sale-code-select-box2-show').attr('title', 'No Opportunity Code');
                }
                $('#sale-code-select-box2-show').val(sale_code_mapped[0].title);
                $('#sale-code-select-box2-show').attr('data-bs-toggle', 'tooltip');
                $('#sale-code-select-box2-show').attr('data-bs-placement', 'right');
            }

            loadSupplier(payment_detail.supplier);

            LoadBankAccount();

            $('select[name="method"]').find(`option[value="` + payment_detail.method + `"]`).prop('selected', true)

            let sale_code_id_list = null;
            if (payment_detail.sale_order_mapped.length > 0) {sale_code_id_list = payment_detail.sale_order_mapped}
            if (payment_detail.quotation_mapped.length > 0) {sale_code_id_list = payment_detail.quotation_mapped}
            if (payment_detail.opportunity_mapped.length > 0) {sale_code_id_list = payment_detail.opportunity_mapped}

            let sale_code_length = sale_code_id_list.length;
            if (sale_code_length > 0) {
                let table_body = $('#tab_line_detail_datatable tbody');
                for (let i = 0; i < payment_detail.expense_mapped.length; i++) {
                    let expense_item = payment_detail.expense_mapped[i];
                    let expense_ap_detail_list = payment_detail.expense_mapped[i].expense_ap_detail_list;
                    table_body.append(`<tr id="" class="row-number">
                        <td class="number text-center"></td>
                        <td><select class="form-select expense-select-box" data-method="GET"><option selected></option></select></td>
                        <td><input class="form-control expense-type" style="color: black;" disabled></td>
                        <td><select class="form-select expense-uom-select-box" data-method="GET"><option selected></option></select></td>
                        <td><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control expense-quantity" value="1"></td>
                        <td><div class="input-group dropdown" aria-expanded="false" data-bs-toggle="dropdown">
                                <span class="input-affix-wrapper">
                                    <input disabled data-return-type="number" type="text" class="form-control expense-unit-price-select-box mask-money" style="color: black;" placeholder="Select a price or enter">
                                </span>
                            </div>
                            <div style="min-width: 25%" class="dropdown-menu" data-method="GET"></div></td>
                        <td><select class="form-select expense-tax-select-box" data-method="GET"><option selected></option></select></td>
                        <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price mask-money" style="color: black;" disabled></td>
                        <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price-after-tax mask-money" style="color: black;" disabled></td>
                        <td><input type="text" class="form-control expense-document-number" required></td>
                        <td class="action">
                            <a class="btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></a>
                            <a class="row-toggle btn text-primary btn-link btn-animated" title="Toggle row"><span class="icon"><i class="bi bi-caret-down-square"></i></span></a>
                        </td>
                    </tr>`);

                    table_body.append(`<tr class="" hidden>
                        <td colspan="1"></td>
                        <td colspan="1">
                            <label class="text-primary"><b>Sale code</b></label>
                        </td>
                        <td colspan="2">
                            <label class="text-primary"><b>Value</b></label>
                        </td>
                        <td colspan="1"></td>
                        <td colspan="2">
                            <label class="text-primary"><b>Value converted from advance payment</b></label>
                        </td>
                        <td colspan="1"></td>
                        <td colspan="1">
                            <label class="text-primary"><b>Sum</b></label>
                        </td>
                        <td colspan="1"></td>
                    </tr>`)

                    for (let i = 0; i < sale_code_length; i++) {
                        let expense_ap_detail_item = expense_ap_detail_list[i];
                        let real_value = expense_ap_detail_item.real_value;
                        if (real_value === undefined) {
                            real_value = 0;
                        }
                        let converted_value = expense_ap_detail_item.converted_value;
                        if (converted_value === undefined) {
                            converted_value = 0;
                        }
                        let sale_code_detail_show = opp_code_list[i];
                        if (sale_code_detail_show === undefined) {sale_code_detail_show = sale_code_id_list[i].code}
                        table_body.append(`<tr class="" hidden>
                            <td colspan="1"></td>
                            <td colspan="1">
                                <span class="sale_code_expense_detail badge badge-outline badge-soft-primary" data-sale-code-id="` + sale_code_id_list[i].id + `"><b>`+ sale_code_detail_show+ `</b></span>
                            </td>
                            <td colspan="2">
                                <input value="` + real_value + `" data-return-type="number" placeholder="Enter payment value" class="value-inp form-control mask-money">
                            </td>
                            <td colspan="1">
                                <center><i class="fas fa-plus text-primary"></i></center>
                            </td>
                            <td colspan="2">
                                <div class="input-group">
                                    <input value="` + converted_value + `" data-return-type="number" placeholder="Click button to select payment value" class="value-converted-from-ap-inp form-control mask-money" disabled style="color: black">
                                    <button style="border: 1px solid #ced4da" data-bs-toggle="offcanvas" disabled
                                    data-bs-target="#offcanvasSelectDetailAP" aria-controls="offcanvasExample" 
                                    class="btn btn-icon btn-flush-primary flush-soft-hover btn-add-payment-value" type="button">
                                        <span class="icon"><i class="bi bi-pencil-square text-primary"></i></span>
                                    </button>
                                </div>
                            </td>
                            <td colspan="1">
                                <center><i class="fas fa-equals text-primary"></i></center>
                            </td>
                            <td colspan="1">
                                <span class="mask-money total-value-salecode-item text-primary" data-init-money="` + expense_ap_detail_item.sum_value + `"></span>
                            </td>
                            <td colspan="1">
                                <script type="application/json" class="detail-ap-items"></script>
                            </td>
                        </tr>`);
                    }

                    $('.value-inp').on('change', function () {
                        let value_converted_from_ap = parseFloat($(this).closest('tr').find('.value-converted-from-ap-inp').attr('value'));
                        let this_value = parseFloat($(this).attr('value'));
                        if (isNaN(value_converted_from_ap)) { value_converted_from_ap = 0; }
                        if (isNaN(this_value)) { this_value = 0; }
                        $(this).closest('tr').find('.total-value-salecode-item').attr('data-init-money', this_value + value_converted_from_ap);
                        $.fn.initMaskMoney2();
                    })

                    table_body.append(`<script>
                        function checkInputQuantity(value) {
                            if (parseInt(value) < 0) {
                                return value*(-1);
                            }
                            return value;
                        }
                    </script>`);

                    let tax_id_value = '';
                    let tax_code_value = '';
                    if (expense_item.tax) {
                        tax_id_value = expense_item.tax.id;
                        tax_code_value = expense_item.tax.code;
                    }
                    let row_count = count_row(table_body, sale_code_length+1, 1, expense_item.expense.id, tax_id_value);

                    $('#row-' + row_count.toString()).find('.expense-type').val($('#row-' + row_count.toString()).find('.expense-select-box option:selected').attr('data-type'));

                    $('#row-' + row_count.toString()).find('.expense-uom-select-box').append(`<option selected>` + expense_item.expense_unit_of_measure.title + `</option>`);

                    $('#row-' + row_count.toString()).find('.expense-quantity').val(expense_item.expense_quantity);

                    $('#row-' + row_count.toString()).find('.expense-unit-price-select-box').attr('value', expense_item.expense_unit_price);

                    $('#row-' + row_count.toString()).find('.expense-subtotal-price').attr('value', expense_item.subtotal_price);

                    $('#row-' + row_count.toString()).find('.expense-subtotal-price-after-tax').attr('value', expense_item.after_tax_price);

                    $('#row-' + row_count.toString()).find('.expense-document-number').val(expense_item.document_number);

                    $('#row-' + row_count.toString()).find('.btn-del-line-detail').on('click', function () {
                        for (let i = 0; i <= sale_code_length; i++) {
                            $(this).closest('tr').next('tr').remove();
                        }
                        $(this).closest('tr').remove();
                        count_row(table_body, sale_code_length, 2, '', '');
                    })

                    $('#row-' + row_count.toString()).find(".row-toggle").on('click', function() {
                        let this_row = $('#row-' + row_count.toString());
                        let this_expense_item = this_row.find('.expense-select-box');
                        let this_type = this_row.find('.expense-type');
                        let this_uom = this_row.find('.expense-uom-select-box');
                        let this_quantity = this_row.find('.expense-quantity');
                        let this_unit_price = this_row.find('.expense-unit-price-select-box');
                        let this_subtotal_price = this_row.find('.expense-subtotal-price');
                        let this_after_tax_subtotal = this_row.find('.expense-subtotal-price-after-tax');
                        let this_document_number = this_row.find('.expense-document-number');

                        if (this_expense_item.val() && this_type.val() && this_uom.val() && this_quantity.val() && this_unit_price.attr('value')
                            && this_subtotal_price.attr('value') && this_after_tax_subtotal.attr('value') && this_document_number.val())
                        {
                            let row_number = this_row.attr('id').split('-')[1];
                            let detail_expense_id = '.row-detail-expense-' + row_number;
                            if ($(detail_expense_id).is(":hidden")) {
                                $(detail_expense_id).prop('hidden', false);
                            }
                            else {
                                $(detail_expense_id).prop('hidden', true);
                            }
                        }
                    });

                    $.fn.initMaskMoney2();
                }

                let sale_code_id = sale_code_id_list[0].id;
                let sale_code_oppcode = sale_code_id_list[0].opportunity.code;
                if (sale_code_oppcode === undefined) {
                    sale_code_oppcode = sale_code_id_list[0].code;
                }
                if ($('#radio-non-sale').is(':checked') === false) {
                    loadBeneficiary(payment_detail.beneficiary);
                }
                if (payment_detail.sale_order_mapped.length > 0) {
                    $.fn.callAjax($('#tab_plan_datatable').attr('data-url-payment-cost-items') + '?filter_sale_code=' + sale_code_id, 'GET').then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('payment_cost_items_list')) {
                                payment_cost_items_filtered = data.payment_cost_items_list;
                                loadSaleOrderPlan(sale_code_id, sale_code_oppcode)
                            }
                        }
                    })

                    advance_payment_expense_items = [];
                    for (let i = 0; i < ap_list.length; i++) {
                        if (ap_list[i].sale_order_mapped === $(this).attr('data-value') || ap_list[i].quotation_mapped === $(this).attr('data-value')) {
                            advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                        }
                    }
                }
                if (payment_detail.quotation_mapped.length > 0) {
                    $.fn.callAjax($('#tab_plan_datatable').attr('data-url-payment-cost-items') + '?filter_sale_code=' + sale_code_id, 'GET').then((resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('payment_cost_items_list')) {
                                payment_cost_items_filtered = data.payment_cost_items_list;
                                loadQuotationPlan(sale_code_id, sale_code_oppcode);
                            }
                        }
                    })

                    advance_payment_expense_items = [];
                    for (let i = 0; i < ap_list.length; i++) {
                        if (ap_list[i].sale_order_mapped === $(this).attr('data-value') || ap_list[i].quotation_mapped === $(this).attr('data-value')) {
                            advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                        }
                    }
                }
                $('#notify-none-sale-code').prop('hidden', true);
                $('#tab_plan_datatable').prop('hidden', false);
            }

            $('#supplier-detail-span').prop('hidden', false);
            $('#supplier-name').text($('#supplier-select-box option:selected').attr('data-name'));
            $('#supplier-code').text($('#supplier-select-box option:selected').attr('data-code'));
            $('#supplier-owner').text($('#supplier-select-box option:selected').attr('data-owner'));
            $('#supplier-industry').text($('#supplier-select-box option:selected').attr('data-industry'));
            let url = $('#btn-detail-supplier-tab').attr('data-url').replace('0', $('#supplier-select-box option:selected').attr('value'));
            $('#btn-detail-supplier-tab').attr('href', url);

            $.fn.callAjax($('#tab_plan_datatable').attr('data-url-payment-cost-items') + '?filter_sale_code=' + sale_code_mapped[0].id, 'GET').then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('payment_cost_items_list')) {
                        payment_cost_items_filtered = data.payment_cost_items_list;
                    }
                }
            })

            for (let i = 0; i < ap_list.length; i++) {
                if (ap_list[i].sale_order_mapped === sale_code_mapped[0].id || ap_list[i].quotation_mapped === sale_code_mapped[0].id) {
                    advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                }
            }
        }

        $('.form-control').prop('disabled', true);
        $('.form-select').prop('disabled', true);
        $('#btn-change-sale-code-type').prop('disabled', true);
        $('#sale-code-select-box2-show').prop('disabled', false);
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

    let plan_db = $('#tab_plan_datatable_div').html();
    let load_default = 0;

    const account_list = JSON.parse($('#account_list').text());
    const expense_list = JSON.parse($('#expense_list').text());
    const account_bank_accounts_information_dict = account_list.reduce((obj, item) => {
        obj[item.id] = item.bank_accounts_information;
        return obj;
    }, {});
    function loadSupplier(supplier_id) {
        let ele = $('#supplier-select-box');
        ele.html('');
        ele.append(`<option></option>`);
        account_list.map(function (item) {
            if (item.account_type.includes('Supplier')) {
                if (item.id === supplier_id) {
                    ele.append(`<option selected data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
                }
                else {
                    ele.append(`<option data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
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
                        if (item.id === $('#data-init-payment-create-request-employee-id').val()) {
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
                        $('#beneficiary-select-box').prop('disabled', true);
                        loadBeneficiary('', $('#creator-select-box option:selected').attr('data-department-id'), $('#data-init-payment-create-request-employee-id').val());
                        $('#sale-code-select-box').prop('disabled', false);
                        // $('#sale-code-select-box2-show').css({
                        //     'background': 'none',
                        // });
                        // $('#sale-code-select-box2-show').attr('disabled', false);
                        // $('#sale-code-select-box2-show').attr('placeholder', 'Select one');
                        // $('#sale-code-select-box2-show').val('');
                        $('#sale-code-select-box2').prop('hidden', false);
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

    function loadSaleOrderPlan(filter_sale_order_id, filter_sale_order_code) {
        let ap_item = ap_list.find(function(item) {
            return item.sale_order_mapped === filter_sale_order_id;
        });
        let ap_expense_list_mapped = []
        if (ap_item !== undefined) {
            for (let i = 0; i < ap_item.expense_items.length; i++) {
                let ap_expense_item = ap_item.expense_items[i];
                let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                    return item.expense_id === ap_expense_item.expense.id;
                });
                let others_payment = payment_cost_items_list.reduce(function(s, item) {
                    return s + item.real_value;
                }, 0);
                ap_expense_list_mapped.push(
                    {
                        'expense_id': ap_expense_item.expense.id,
                        'ap_approved': ap_expense_item.after_tax_price,
                        'paid': ap_expense_item.to_payment_total + others_payment,
                        'remain_ap': ap_expense_item.remain_total,
                        'available': ap_expense_item.available_total
                    }
                )
            }
        }
        $('#tab_plan_datatable tbody').html(``);
        $('#tab_plan_datatable tbody').append(`<tr>
            <td colspan="3"><span class="badge badge-secondary">` + filter_sale_order_code + `</span></td>
            <td colspan="4"></td>
        </tr>`)
        let url = $('#tab_plan_datatable').attr('data-url-sale-order') + '?filter_sale_order=' + filter_sale_order_id;
        $.fn.callAjax(url, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                for (let i = 0; i < data.sale_order_expense_list.length; i++) {
                    let expense_item = data.sale_order_expense_list[i];
                    let tax_item = '';
                    if (expense_item.tax.title) {
                        tax_item = expense_item.tax.title;
                    }

                    let expense_get = ap_expense_list_mapped.find(function(item) {
                        return item.expense_id === expense_item.expense_id;
                    });
                    let remain_ap = 0;
                    let ap_approved = 0;
                    let available = 0;
                    let paid = 0;
                    if (expense_get !== undefined) {
                        remain_ap = expense_get.remain_ap;
                        ap_approved = expense_get.ap_approved;
                        available = expense_get.available;
                        paid = expense_get.paid
                    }

                    $('#tab_plan_datatable tbody').append(`<tr>
                        <td><a href="#"><span data-id="` + expense_item.expense_id + `">` + expense_item.expense_title + `</span></a></td>
                        <td><span class="badge badge-soft-indigo badge-outline">` + tax_item + `</span></td>
                        <td><span>` + expense_item.plan_after_tax.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span></td>
                        <td><span>` + ap_approved.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span></td>
                        <td><span>` + remain_ap.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span></td>
                        <td><span>` + paid.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span></td>
                        <td><span>` + available.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span></td>
                    </tr>`)
                }
            }
        })
    }

    function loadQuotationPlan(filter_quotation_id, filter_quotation_code) {
        let ap_item = ap_list.find(function(item) {
            return item.quotation_mapped === filter_quotation_id;
        });
        let ap_expense_list_mapped = []
        if (ap_item !== undefined) {
            for (let i = 0; i < ap_item.expense_items.length; i++) {
                let ap_expense_item = ap_item.expense_items[i];
                let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                    return item.expense_id === ap_expense_item.expense.id;
                });
                let others_payment = payment_cost_items_list.reduce(function(s, item) {
                    return s + item.real_value;
                }, 0);
                ap_expense_list_mapped.push(
                    {
                        'expense_id': ap_expense_item.expense.id,
                        'ap_approved': ap_expense_item.after_tax_price,
                        'paid': ap_expense_item.to_payment_total + others_payment,
                        'remain_ap': ap_expense_item.remain_total,
                        'available': ap_expense_item.available_total
                    }
                )
            }
        }
        $('#tab_plan_datatable tbody').html(``);
        $('#tab_plan_datatable tbody').append(`<tr>
            <td colspan="3"><span class="badge badge-secondary">` + filter_quotation_code + `</span></td>
            <td colspan="4"></td>
        </tr>`)
        let url = $('#tab_plan_datatable').attr('data-url-quotation') + '?filter_quotation=' + filter_quotation_id;
        $.fn.callAjax(url, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                for (let i = 0; i < data.quotation_expense_list.length; i++) {
                    let expense_item = data.quotation_expense_list[i];
                    let tax_item = '';
                    if (expense_item.tax.title) {
                        tax_item = expense_item.tax.title;
                    }

                    let expense_get = ap_expense_list_mapped.find(function(item) {
                        return item.expense_id === expense_item.expense_id;
                    });
                    let remain_ap = 0;
                    let ap_approved = 0;
                    let available = 0;
                    let paid = 0;
                    if (expense_get !== undefined) {
                        remain_ap = expense_get.remain_ap;
                        ap_approved = expense_get.ap_approved;
                        available = expense_get.available;
                        paid = expense_get.paid
                    }

                    $('#tab_plan_datatable tbody').append(`<tr>
                        <td><a href="#"><span data-id="` + expense_item.expense_id + `">` + expense_item.expense_title + `</span></a></td>
                        <td><span class="badge badge-soft-indigo badge-outline">` + tax_item + `</span></td>
                        <td><span>` + expense_item.plan_after_tax.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span></td>
                        <td><span>` + ap_approved.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span></td>
                        <td><span>` + remain_ap.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span></td>
                        <td><span>` + paid.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span></td>
                        <td><span>` + available.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</span></td>
                    </tr>`)
                }
            }
        })
    }

    function count_row(table_body, sale_code_length, option, expense_id, tax_id) {
        let count = 0;
        table_body.find('tr td.number').each(function() {
            count = count + 1;
            $(this).text(count);
            $(this).closest('tr').attr('id', 'row-' + count.toString());
            let detail_expense_element = $(this).closest('tr').nextAll().slice(0, sale_code_length)
            detail_expense_element.each(function (index, element) {
                $(this).attr('class', 'row-detail-expense-' + count.toString());
            });
        });
        if (option === 1) {
            loadExpenseList('row-' + count.toString(), expense_id);
            loadExpenseTaxList('row-' + count.toString(), tax_id);
        }
        return count;
    }

    function loadExpenseList(row_id, expense_id) {
        let ele = $('#' + row_id + ' .expense-select-box');
        ele.select2();
        ele.html('');
        ele.append(`<option></option>`);
        expense_list.map(function (item) {
            let tax_code_id = '';
            if (item.general_information.tax_code) {
                tax_code_id = item.general_information.tax_code.id;
            }
            if (item.id === expense_id) {
                ele.append(`<option selected data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.expense_type.title + `" data-uom-id="` + item.general_information.uom.id + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
            }
            else {
                ele.append(`<option data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.expense_type.title + `" data-uom-id="` + item.general_information.uom.id + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
            }
        })
    }

    function loadExpenseTaxList(row_id, tax_id) {
        let ele = $('#' + row_id + ' .expense-tax-select-box');
        ele.html('');
        $.fn.callAjax($('#tab_line_detail_datatable').attr('data-url-tax-list'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    ele.append(`<option data-rate="0" selected></option>`);
                    resp.data.tax_list.map(function (item) {
                        if (item.id === tax_id) {
                            ele.append(`<option selected data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
                        }
                        else {
                            ele.append(`<option data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
                        }
                    })
                }
            }
        }, (errs) => {
        },)
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

    $('#save-changes-modal-bank-account').on('click', function () {
        ChangeBankInfor();
        LoadBankAccount();
        $('#btn-close-edit-bank-account').click();
    })

    loadCreator();
    $('#beneficiary-select-box').select2();

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
