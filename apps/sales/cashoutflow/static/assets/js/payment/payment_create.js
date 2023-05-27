$(document).ready(function () {
    const sale_order_list = JSON.parse($('#sale_order_list').text());
    const quotation_list = JSON.parse($('#quotation_list').text());
    const expense_list = JSON.parse($('#expense_list').text());
    const account_list = JSON.parse($('#account_list').text());

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
                                if (item.id === $('#data-init-payment-create-request-employee-id').val()) {
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

    function loadSaleCode(beneficiary) {
        let ele = $('#sale-code-select-box2');
        ele.html('');
        let sale_not_opp = '';
        let quotation_not_opp = '';
        ele.append(`<optgroup label="Sale Order" class="text-primary">`)
        sale_order_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (item.opportunity.id) {
                    ele.append(`<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` + item.opportunity.title + `"><div class="row"><span class="code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-right" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`);
                }
                else {
                    sale_not_opp += `<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code"><div class="row"><span class="code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-right" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`;
                }
            }
        })
        ele.append(sale_not_opp);
        ele.append(`</optgroup>`);
        ele.append(`<optgroup label="Quotation" class="text-primary">`);
        quotation_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (item.opportunity.id) {
                    ele.append(`<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` + item.opportunity.title + `"><div class="row"><span class="code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-right" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`);
                }
                else {
                    quotation_not_opp += `<a data-value="` + item.id + `" class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code"><div class="row"><span class="code-span col-4 text-left">` + item.code + `</span><span class="title-span col-8 text-right" data-type="0" data-sale-person-id="` + item.sale_person.id + `" data-value="` + item.id + `">` + item.title + `</span></div></a>`;
                }
            }
        })
        ele.append(quotation_not_opp);
        ele.append(`</optgroup>`);

        $('#sale-code-select-box2 .dropdown-item').on('click', function () {
            $('#sale-code-select-box2-show').val($(this).find('.title-span').text())
            $('#sale-code-select-box option:selected').attr('selected', false);
            $('#sale-code-select-box').find(`option[value="` + $(this).attr('data-value') + `"]`).attr('selected', true);
            if ($('#sale-code-select-box option:selected').attr('data-sale-person-id')) {
                loadBeneficiary($('#sale-code-select-box option:selected').attr('data-sale-person-id'));
                if ($('#sale-code-select-box option:selected').attr('data-type') === '0') {
                    loadSaleOrderExpense($('#sale-code-select-box option:selected').attr('value'));
                }
                if ($('#sale-code-select-box option:selected').attr('data-type') === '1') {
                    loadQuotationExpense($('#sale-code-select-box option:selected').attr('value'));
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
        ele2.append(`<optgroup label="Sale Order">`);
        sale_order_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (item.opportunity.id) {
                    ele2.append(`<option data-type="0" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">(` + item.code + `) ` + item.title + `</option>`);
                } else {
                    ele2.append(`<option data-type="0" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">(No OppCode) ` + item.title + `</option>`);
                }
            }
        })
        ele2.append(`</optgroup>`);
        ele2.append(`<optgroup label="Quotation">`);
        quotation_list.map(function (item) {
            if (item.sale_person.id === beneficiary) {
                if (item.opportunity.id) {
                    ele2.append(`<option data-type="1" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">(` + item.code + `) ` + item.title + `</option>`);
                } else {
                    ele2.append(`<option data-type="1" data-sale-person-id="` + item.sale_person.id + `" value="` + item.id + `">(No OppCode) ` + item.title + `</option>`);
                }
            }
        })
        ele2.append(`</optgroup>`);
    }

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

    loadCreator();
    $('#beneficiary-select-box').select2();

    $('.sale_code_type').on('change', function () {
        $('#btn-change-sale-code-type').text($('input[name="sale_code_type"]:checked').val())
        if ($(this).val() === 'sale-1') {
            $('#beneficiary-select-box').prop('disabled', true);
            loadBeneficiary();
            $('#sale-code-select-box').prop('disabled', false);
            $('#sale-code-select-box2-show').css({
                'background': 'none',
            });
            $('#sale-code-select-box2-show').attr('disabled', false);
            $('#sale-code-select-box2-show').attr('placeholder', 'Select one');
            loadSaleCode($('#data-init-payment-create-request-employee-id').val());
        }
        else if ($(this).val() === 'sale-n') {
            $('#sale-code-select-box').prop('disabled', false);
            $('#sale-code-select-box2-show').css({
                'background': 'none',
            });
            $('#sale-code-select-box2-show').attr('disabled', false);
            $('#sale-code-select-box2-show').attr('placeholder', 'Multiple Select');
            // loadSaleCode();
            $('#beneficiary-select-box').prop('disabled', false);
        }
        else if ($(this).val() === 'non-sale') {
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
})