$(document).ready(function () {
    const pk = window.location.pathname.split('/').pop();
    const frmDetail = $('#frm-detail');
    const ele_select_product_category = $('#select-box-product-category');
    let employee_current_id = $('#emp-current-id').val();

    let dict_product = {}

    // config input date
    $('input[name="open_date"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'auto',
        minYear: 2000,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10) + 100
    });
    $('input[name="close_date"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'auto',
        minYear: parseInt(moment().format('YYYY'), 10),
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10) + 100
    });

    function loadTax() {
        let ele_input = $('#input-data-tax');
        let ele = $('.box-select-tax');
        let url = ele_input.data('url');
        let method = ele_input.data('method');
        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    ele.append(`<option data-value="0"></option>`);
                    data.tax_list.map(function (item) {
                        ele.append(`<option value="${item.id}" data-value="${item.rate}">${item.title} (${item.rate} %)</option>`);
                    })
                }
            }
        })
    }

    function loadUoM() {
        let ele_input = $('#input-data-uom');

        let ele = $('.box-select-uom');

        let url = ele_input.data('url');
        let method = ele_input.data('method');

        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                    ele.append(`<option></option>`);
                    data.unit_of_measure.map(function (item) {
                        ele.append(`<option value="${item.id}">${item.title}</option>`);
                    })
                }
            }
        })
    }

    function loadProduct(list_category, product_datas) {
        let ele = $('.col-select-product .select-box-product');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_list')) {
                    ele.append(`<option></option>`);
                    $('#data-product').val(JSON.stringify(data.product_list));
                    data.product_list.map(function (item) {
                        if (list_category.length > 0 && list_category.includes(item.general_information.product_category.id)) {
                            ele.append(`<option value="${item.id}" data-category-id="${item.general_information.product_category.id}">${item.title}</option>`);
                        }
                    })

                }
            }
            if (product_datas.length > 0) {
                let pretax_amount = 0;
                let taxes = 0;
                product_datas.map(function (item) {
                    addRowProduct(item);
                    pretax_amount += item.product_subtotal_price;
                    taxes += item.product_subtotal_price * parseFloat(item.tax.rate) / 100;
                })
                $('#input-product-pretax-amount').attr('value', pretax_amount);
                $('#input-product-taxes').attr('value', taxes);
                $('#input-product-total').attr('value', pretax_amount + taxes);
            }
        })
    }

    function loadCustomer(id, end_customer_id, data_competitor, sale_person_id) {
        let ele = $('#select-box-customer');
        let ele_end_customer = $('#select-box-end-customer');
        let ele_competitor = $('.box-select-competitor');
        let url = ele.data('url');
        let method = ele.data('method');
        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('account_list')) {
                    ele.append(`<option></option>`)
                    ele_end_customer.append('<option></option>')
                    data.account_list.map(function (item) {
                        if (item.id === id) {
                            ele.append(`<option selected value="${item.id}">${item.name}</option>`);
                            loadSalePerson(item.manager.map(obj => obj.id), sale_person_id);
                        } else {
                            ele_competitor.append(`<option value="${item.id}">${item.name}</option>`);
                            ele.append(`<option value="${item.id}">${item.name}</option>`);
                        }

                        if (item.id === end_customer_id) {
                            ele_end_customer.append(`<option selected value="${item.id}">${item.name}</option>`);
                            $('#check-agency-role').prop('checked', true);
                            $('.box-select-type-customer option[value="1"]').prop('disabled', false);
                            ele_end_customer.prop('disabled', false);
                        } else {
                            ele_end_customer.append(`<option value="${item.id}">${item.name}</option>`);
                        }
                    })
                    ele_end_customer.find(`option[value="${ele.val()}"]`).prop('disabled', true);

                    loadCompetitor(data_competitor);
                }
            }
        })
    }

    function loadProductCategory(list_id) {
        let ele = ele_select_product_category;
        let ele_in_table = $('.box-select-product-category');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_category_list')) {
                    ele.append(`<option></option>`);
                    ele_in_table.append(`<option></option>`);
                    data.product_category_list.map(function (item) {
                        if (list_id.includes(item.id)) {
                            ele.append(`<option selected value="${item.id}">${item.title}</option>`);
                            ele_in_table.append(`<option value="${item.id}">${item.title}</option>`)
                        } else {
                            ele.append(`<option value="${item.id}">${item.title}</option>`);
                        }
                    })
                }
            }
        })
    }

    function loadContact(customer_id, end_customer_id, data_contact_role) {
        let ele_data_contact = $('#input-data-contact');
        let url = ele_data_contact.data('url');
        let method = ele_data_contact.data('method');
        let ele_select_box = $('.box-select-contact');
        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('contact_list')) {
                    data.contact_list.map(function (item) {
                        if (item.account_name.id === customer_id) {
                            ele_select_box.append(`<option value="${item.id}" data-type-customer="0" class="hidden">${item.fullname}</option>`);
                        } else if (item.account_name.id === end_customer_id) {
                            ele_select_box.append(`<option value="${item.id}" data-type-customer="1" class="hidden">${item.fullname}</option>`);
                        } else {
                            ele_select_box.append(`<option value="${item.id}" data-type-customer="-1" class="hidden">${item.fullname}</option>`);
                        }
                    })

                    ele_data_contact.val(JSON.stringify(data.contact_list));
                    loadContactRole(data_contact_role);
                }
            }
        })
    }

    function addRowProduct(data) {
        let table = $('#table-products');
        let col_empty = table.find('.col-table-empty');
        if (col_empty !== undefined) {
            col_empty.remove();
        }
        let last_row;
        if (data.product !== null) {
            let col = $('.col-select-product').html().replace('hidden', '');
            table.find('tbody').append(`<tr>${col}</tr>`);
            last_row = table.find('tbody tr').last();
            last_row.find('.select-box-product').val(data.product.id);

        } else {
            let col = $('.col-input-product').html().replace('hidden', '');
            table.find('tbody').append(`<tr>${col}</tr>`);
            last_row = table.find('tbody tr').last();
            last_row.find('.input-product-name').val(data.product_name);
        }
        last_row.find('.num-product').text(table.find('tbody tr').length - 2);
        last_row.find('.box-select-product-category').val(data.product_category.id);
        last_row.find('.box-select-uom').val(data.uom.id);
        last_row.find('.input-quantity').val(data.product_quantity);
        last_row.find('.box-select-tax').val(data.tax.id);
        last_row.find('.input-unit-price').attr('value', data.product_unit_price);
        last_row.find('.input-subtotal').attr('value', data.product_subtotal_price);
        $.fn.initMaskMoney2();
    }

    function loadCompetitor(data) {
        if (data.length > 0) {
            let table = $('#table-competitors');
            let col_empty = table.find('.col-table-empty');
            if (col_empty !== undefined) {
                col_empty.remove();
            }
            let col = $('.col-competitor').html().replace('hidden', '');
            data.map(function (item) {
                table.find('tbody').append(`<tr>${col}</tr>`);
                let last_row = table.find('tbody tr').last();
                last_row.find('.box-select-competitor').val(item.competitor.id);
                last_row.find('.input-strength').val(item.strength);
                last_row.find('.input-weakness').val(item.weakness);
                if (item.win_deal === true) {
                    last_row.find('.input-win-deal').prop('checked', true);
                }
            })
        }
    }

    function loadBoxContact(ele_row, type, status) {
        let list_contact = [];
        ele_row.find('.box-select-contact').each(function () {
            list_contact.push($(this).val());
        })
        let last_row = ele_row.last();

        last_row.find(`.box-select-contact option[data-type-customer!="${type}"]`).addClass('hidden');
        last_row.find(`.box-select-contact option[data-type-customer="${type}"]`).removeClass('hidden');
        list_contact.map(function (item) {
            last_row.find(`.box-select-contact option[value="${item}"]`).not(':last').addClass('hidden');
        })
    }

    function loadContactRole(data) {
        if (data.length > 0) {
            let table = $('#table-contact-role');
            let col_empty = table.find('.col-table-empty');
            if (col_empty !== undefined) {
                col_empty.remove();
            }
            let col = $('.col-contact').html().replace('hidden', '');
            data.map(function (item) {
                table.find('tbody').append(`<tr>${col}</tr>`);
                let last_row = table.find('tbody tr').last();
                last_row.find('.box-select-type-customer').val(item.type_customer);
                last_row.find('.box-select-contact').val(item.contact.id);
                last_row.find('.input-job-title').val(item.job_title);
                last_row.find('.box-select-role').val(item.role);

                loadBoxContact(table.find('tbody tr'), item.type_customer, 'detail');

            })
        }
    }

    function loadDecisionFactor(list_factor) {
        let ele = $('#box-select-factor');

        let url = ele.data('url');
        let method = ele.data('method');

        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_decision_factor')) {
                    data.opportunity_decision_factor.map(function (item) {
                        if (list_factor.includes(item.id)) {
                            ele.append(`<option value="${item.id}" selected>${item.title}</option>`);
                        }
                        ele.append(`<option value="${item.id}">${item.title}</option>`);
                    })
                }
            }
        })
    }

    function loadSalePerson(list_manager, sale_person_id) {
        let ele = $('#select-box-sale-person');
        let ele_emp_current_group = $('#group_id_emp_login');
        $.fn.callAjax(ele.data('url'), ele.data('method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                    $('#data-sale-person').val(JSON.stringify(data.employee_list));
                    let emp_current = data.employee_list.find(obj => obj.id === employee_current_id);
                    ele_emp_current_group.val(emp_current.group.id);
                    data.employee_list.map(function (employee) {
                        if (list_manager.includes(employee_current_id)) {
                            if (employee.group.id === emp_current.group.id && list_manager.includes(employee.id)) {
                                if(employee.id === sale_person_id){
                                    ele.append(`<option value="${employee.id}" selected>${employee.full_name}</option>`);
                                }
                                else{
                                    ele.append(`<option value="${employee.id}">${employee.full_name}</option>`);
                                }
                            }
                        }
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadDetail() {
        let url = frmDetail.data('url').replace(0, pk);
        $.fn.callAjax(url, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity')) {
                    let ele_header = $('#header-title');
                    ele_header.text(data.opportunity.title);
                    ele_header.append(`<span class="text-primary"> (${data.opportunity.code})</span>`)
                    $('#rangeInput').val(data.opportunity.win_rate);
                    $('#input-rate').val(data.opportunity.win_rate);
                    if (data.opportunity.is_input_rate) {
                        $('#check-input-rate').prop('checked', true);
                    } else
                        $('#check-input-rate').prop('checked', false);
                    loadCustomer(data.opportunity.customer, data.opportunity.end_customer, data.opportunity.opportunity_competitors_datas, data.opportunity.sale_person.id);
                    loadProductCategory(data.opportunity.product_category);
                    loadTax();
                    loadUoM();
                    $('#input-budget').attr('value', data.opportunity.budget_value);
                    if (data.opportunity.open_date !== null)
                        $('#input-open-date').val(data.opportunity.open_date.split(' ')[0]);
                    if (data.opportunity.close_date !== null)
                        $('#input-close-date').val(data.opportunity.close_date.split(' ')[0]);
                    if (data.opportunity.decision_maker !== null) {
                        let ele_decision_maker = $('#input-decision-maker');
                        ele_decision_maker.val(data.opportunity.decision_maker.name);
                        ele_decision_maker.attr('data-id', data.opportunity.decision_maker.id);
                    }
                    loadProduct(data.opportunity.product_category, data.opportunity.opportunity_product_datas);
                    loadContact(data.opportunity.customer, data.opportunity.end_customer, data.opportunity.opportunity_contact_role_datas);
                    loadDecisionFactor(data.opportunity.customer_decision_factor);
                    $.fn.initMaskMoney2();

                }
            }
        })
    }

    loadDetail();

    // even in tab product
    $('#btn-add-select-product').on('click', function () {
        let table = $('#table-products');
        let col_empty = table.find('.col-table-empty');
        if (col_empty !== undefined) {
            col_empty.remove();
        }
        let col = $('.col-select-product').html().replace('hidden', '');
        table.find('tbody').append(`<tr>${col}</tr>`);

        let last_row = table.find('tbody tr').last();
        last_row.find('.num-product').text(table.find('tbody tr').length - 2);
    })

    $('#btn-add-input-product').on('click', function () {
        let table = $('#table-products');
        let col_empty = table.find('.col-table-empty');
        if (col_empty !== undefined) {
            col_empty.remove();
        }

        let col = $('.col-input-product').html().replace('hidden', '');
        table.find('tbody').append(`<tr>${col}</tr>`);

        let last_row = table.find('tbody tr').last();
        last_row.find('.num-product').text(table.find('tbody tr').length - 2);
    })

    ele_select_product_category.on('select2:unselect', function (e) {
        let removedOption = e.params.data;
        let list_product = JSON.parse($('#data-product').val());
        $(`.box-select-product-category option[value="${removedOption.id}"]:selected`).closest('tr').remove();
        $('#table-product').addClass('tag-change');

        let list_product_remove = list_product.filter(function (item){
            return item.general_information.product_category.id === removedOption.id;
        })
        list_product_remove.map(function (item){
            $(`.select-box-product option[value="${item.id}"]`).remove();
        })


    });

    ele_select_product_category.on('select2:select', function (e) {
        let addOption = e.params.data;
        let list_product = JSON.parse($('#data-product').val());
        let list_product_add = list_product.filter(function (item){
            return item.general_information.product_category.id === addOption.id;
        })
        list_product_add.map(function (item){
            $('.select-box-product').append(`<option value="${item.id}">${item.title}</option>`)
        })
    });

    $(document).on('change', '.select-box-product', function () {
        let ele_tr = $(this).closest('tr');
        if (Object.keys(dict_product).length === 0) {
            dict_product = JSON.parse($('#data-product').val()).reduce((obj, item) => {
                obj[item.id] = item;
                return obj;
            }, {});
        }
        let product = dict_product[$(this).val().toString()];
        ele_tr.find(`.box-select-product-category`).val(product['general_information']['product_category']['id']);
        ele_tr.find('.box-select-uom').val(product['sale_information']['default_uom']['id']);
        ele_tr.find('.box-select-tax').val(product['sale_information']['tax_code']['id']);
    })

    function getTotalPrice() {
        let ele_tr_products = $('#table-products tbody tr.tag-change');
        let tax_value = 0;
        let total_pretax = 0;
        ele_tr_products.each(function () {
            let sub_total = $(this).find('.input-subtotal').valCurrency();
            let tax = parseFloat($(this).find('.box-select-tax option:selected').data('value')) / 100;
            total_pretax += sub_total;
            tax_value += sub_total * tax;
        })

        $('#input-product-pretax-amount').attr('value', total_pretax);
        $('#input-product-taxes').attr('value', tax_value);
        $('#input-product-total').attr('value', total_pretax + tax_value);
        $.fn.initMaskMoney2();
    }

    $(document).on('change', '.input-unit-price', function () {
        let quantity = $(this).valCurrency();
        let ele_parent = $(this).closest('tr');
        let price = ele_parent.find('.input-quantity').val();
        let subtotal = price * quantity;
        ele_parent.find('.input-subtotal').attr('value', subtotal);
        getTotalPrice();
    })

    $(document).on('change', '.input-quantity', function () {
        let price = $(this).val();
        let ele_parent = $(this).closest('tr');
        let quantity = ele_parent.find('.input-unit-price').valCurrency();
        let subtotal = price * quantity;
        ele_parent.find('.input-subtotal').attr('value', subtotal);

        getTotalPrice();
    })

    $(document).on('change', '.box-select-tax', function () {
        let ele_parent = $(this).closest('tr');
        let quantity = ele_parent.find('.input-quantity').val();
        let price = ele_parent.find('.input-unit-price').valCurrency();
        let subtotal = price * quantity;
        ele_parent.find('.input-subtotal').attr('value', subtotal);

        getTotalPrice();
    })

    // event in tab competitor
    $('#btn-add-competitor').on('click', function () {
        let table = $('#table-competitors');
        let col_empty = table.find('.col-table-empty');
        if (col_empty !== undefined) {
            col_empty.remove();
        }
        let col = $('.col-competitor').html().replace('hidden', '');
        table.find('tbody').append(`<tr>${col}</tr>`);
    })

    $(document).on('change', '.input-win-deal', function () {
        if ($(this).is(':checked')) {
            $('.input-win-deal').not(this).prop('checked', false);
        }
    })

    // event in tab contact role
    $('#btn-add-contact').on('click', function () {
        let table = $('#table-contact-role');
        let col_empty = table.find('.col-table-empty');
        if (col_empty !== undefined) {
            col_empty.remove();
        }
        let col = $('.col-contact').html().replace('hidden', '');
        table.find('tbody').append(`<tr>${col}</tr>`);

        loadBoxContact(table.find('tbody tr'), 0, 'add');
    })

    $(document).on('change', '#select-box-end-customer', function () {
        let contact_data = JSON.parse($('#input-data-contact').val());
        let table = $('#table-contact-role');
        if (table.find('tbody tr.col-table-empty').length === 0) {
            table.addClass('tag-change');
        }
        let account_id = $(this).val();

        table.find('.box-select-type-customer option[value="1"]:selected').closest('tr').remove();
        let contact_of_end_customer = contact_data.filter(function (item) {
            return item.account_name.id === account_id;
        })

        let select_box_contact = table.find('.box-select-contact');
        select_box_contact.find(`option[data-type-customer="1"]`).attr('data-type-customer', '-1');
        contact_of_end_customer.map(function (item) {
            select_box_contact.find(`option[value="${item.id}"]`).attr('data-type-customer', '1')
        })
    })

    $(document).on('change', '#select-box-customer', function () {
        let contact_data = JSON.parse($('#input-data-contact').val());
        let table = $('#table-contact-role');
        table.addClass('tag-change');
        let account_id = $(this).val();

        table.find('.box-select-type-customer option[value="0"]:selected').closest('tr').remove();
        let contact_of_customer = contact_data.filter(function (item) {
            return item.account_name.id === account_id;
        })

        let select_box_contact = table.find('.box-select-contact');
        select_box_contact.find(`option[data-type-customer="0"]`).attr('data-type-customer', '-1');
        contact_of_customer.map(function (item) {
            select_box_contact.find(`option[value="${item.id}"]`).attr('data-type-customer', '0')
        })
    })

    $(document).on('change', '.box-select-type-customer', function () {
        let box_select_contact = $(this).closest('tr').find('.box-select-contact');
        box_select_contact.prop("selectedIndex", -1);
        box_select_contact.find('option').addClass('hidden');
        $(this).closest('tr').find('.input-job-title').val('');
        box_select_contact.find(`option[data-type-customer="${$(this).val()}"]`).removeClass('hidden');
    })

    $(document).on('change', '.box-select-contact', function () {
        let contact_data = JSON.parse($('#input-data-contact').val());
        let id = $(this).val();
        let contact = contact_data.find(function (item) {
            return item.id === id;
        })
        $(this).closest('tr').find('.input-job-title').val(contact.job_title);

        if ($(this).closest('tr').find('.box-select-role option:selected').val() === '0') {
            let ele_decision_maker = $('#input-decision-maker');
            ele_decision_maker.val($(this).find('option:selected').text());
            ele_decision_maker.attr('data-id', $(this).val());
        }
    })

    $(document).on('click', '.box-select-role', function () {
        if ($('.box-select-role').find('option[value="0"]:selected').length === 1) {
            if ($(this).find('option[value="0"]:selected').length === 0)
                $(this).find('option[value="0"]').attr('disabled', 'disabled');
        } else {
            $(this).find('option[value="0"]').removeAttr('disabled');
        }
    })

    $(document).on('change', '.box-select-role', function () {
        let ele_decision_maker = $('#input-decision-maker');
        if ($(this).val() === '0') {
            let ele_contact = $(this).closest('tr').find('.box-select-contact option:selected');
            ele_decision_maker.val(ele_contact.text());
            ele_decision_maker.attr('data-id', ele_contact.val());
            ele_decision_maker.addClass('tag-change');
        } else {
            if ($('.box-select-role option[value="0"]:selected').length === 0) {
                ele_decision_maker.val('');
                ele_decision_maker.attr('data-id', '');
                ele_decision_maker.addClass('tag-change');
            }
        }
    })


    // event general
    $(document).on('change', 'select, input', function () {
        $(this).addClass('tag-change');
        $(this).closest('tr').addClass('tag-change');
        $(this).closest('table').addClass('tag-change');
    })

    $('#check-agency-role').on('change', function () {
        let table = $('#table-contact-role');
        let ele_end_customer = $('#select-box-end-customer');
        if ($(this).is(':checked')) {
            ele_end_customer.prop('disabled', false);
            table.find('.box-select-type-customer option[value="1"]').prop('disabled', false);
        } else {
            ele_end_customer.val(null).trigger('change');
            ele_end_customer.prop('disabled', true);
            table.find('.box-select-type-customer option[value="1"]:selected').closest('tr').remove();
            table.find('.box-select-type-customer option[value="1"]').prop('disabled', true);

        }
        ele_end_customer.addClass('tag-change');
    })

    $('#check-input-rate').on('change', function () {
        if ($(this).is(':checked')) {
            $('#input-rate').prop('readonly', false);
        } else {
            $('#input-rate').prop('readonly', true);
        }
    })

    $('#rangeInput').on('mousedown', function () {
        return false;
    });

    $('#input-rate').on('change', function () {
        $('#rangeInput').val($(this).val());
    })

    // get data form
    function getDataForm(data_form) {
        let ele_customer = $('#select-box-customer.tag-change');
        let ele_end_customer = $('#select-box-end-customer.tag-change');
        let ele_budget = $('#input-budget.tag-change');
        let ele_decision_maker = $('#input-decision-maker.tag-change');
        let ele_product_category = $('#select-box-product-category.tag-change');
        let ele_tr_products = $('#table-products.tag-change tbody tr:not(.hidden)');
        let ele_tr_competitors = $('#table-competitors.tag-change tbody tr:not(.hidden)');
        let ele_tr_contact_role = $('#table-contact-role.tag-change tbody tr:not(.hidden)');
        let ele_decision_factor = $('#box-select-factor.tag-change');

        data_form['is_input_rate'] = !!$('#check-input-rate').is(':checked');
        ele_customer.val() !== undefined ? data_form['customer'] = ele_customer.val() : undefined;
        ele_end_customer.val() !== undefined ? data_form['end_customer'] = ele_end_customer.val() : undefined;
        ele_budget.attr('value') !== undefined ? data_form['budget_value'] = ele_budget.attr('value') : undefined;
        ele_decision_maker.data('id') !== undefined ? data_form['decision_maker'] = ele_decision_maker.data('id') : undefined;

        ele_product_category.val() !== undefined ? data_form['product_category'] = ele_product_category.val() : undefined;
        ele_decision_factor.val() !== undefined ? data_form['customer_decision_factor'] = ele_decision_factor.val() : undefined;

        if (data_form['end_customer'] === '') {
            data_form['end_customer'] = null;
        }

        if (data_form['decision_maker'] === '') {
            data_form['decision_maker'] = null;
        }

        // tab product
        let list_product_data = []
        ele_tr_products.each(function () {
            let ele_product = $(this).find('.select-box-product');
            let product_id = ele_product.val();
            let product_name = ele_product.find('option:selected').text();
            if (ele_product.length === 0) {
                product_id = null;
                product_name = $(this).find('.input-product-name').val();
            }
            let data = {
                'product': product_id,
                'product_category': $(this).find('.box-select-product-category').val(),
                'tax': $(this).find('.box-select-tax').val(),
                'uom': $(this).find('.box-select-uom').val(),
                'product_name': product_name,
                'product_quantity': $(this).find('.input-quantity').val(),
                'product_unit_price': $(this).find('.input-unit-price').attr('value'),
                'product_subtotal_price': $(this).find('.input-subtotal').attr('value'),
            }
            list_product_data.push(data);
        })
        data_form['total_product'] = $('#input-product-total').valCurrency();
        data_form['total_product_pretax_amount'] = $('#input-product-pretax-amount').valCurrency();
        data_form['total_product_tax'] = $('#input-product-taxes').valCurrency();

        if ($('#table-products').hasClass('tag-change')) {
            data_form['opportunity_product_datas'] = list_product_data;
        }

        // tab competitor
        let list_competitor_data = []
        ele_tr_competitors.each(function () {
            let win_deal = false;
            if ($(this).find('.input-win-deal').is(':checked')) {
                win_deal = true;
            }

            let data = {
                'competitor': $(this).find('.box-select-competitor').val(),
                'strength': $(this).find('.input-strength').val(),
                'weakness': $(this).find('.input-weakness').val(),
                'win_deal': win_deal,
            }

            list_competitor_data.push(data);
        })

        if ($('#table-competitors').hasClass('tag-change')) {
            data_form['opportunity_competitors_datas'] = list_competitor_data;
        }

        // tab contact role
        let list_contact_role_data = []
        ele_tr_contact_role.each(function () {
            let data = {
                'type_customer': $(this).find('.box-select-type-customer').val(),
                'contact': $(this).find('.box-select-contact').val(),
                'job_title': $(this).find('.input-job-title').val(),
                'role': $(this).find('.box-select-role').val(),
            }
            list_contact_role_data.push(data);
        })

        if ($('#table-contact-role').hasClass('tag-change')) {
            data_form['opportunity_contact_role_datas'] = list_contact_role_data;
        }

        return data_form
    }

    // submit form edit
    frmDetail.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        frm.dataForm = getDataForm(frm.dataForm);
        console.log(frm.dataForm)
        $.fn.callAjax(frm.dataUrl.format_url_with_uuid(pk), frm.dataMethod, frm.dataForm, csr)
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