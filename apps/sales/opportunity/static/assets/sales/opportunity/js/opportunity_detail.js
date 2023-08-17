$(document).ready(function () {
    const pk = $.fn.getPkDetail()
    const frmDetail = $('#frm-detail');
    const ele_select_product_category = $('#select-box-product-category');

    const config = JSON.parse($('#id-config-data').text());
    const account_list = JSON.parse($('#account_list').text());
    const contact_list = JSON.parse($('#contact_list').text());
    const opportunity_list = JSON.parse($('#opportunity_list').text());
    const employee_list = JSON.parse($('#employee_list').text());
    const account_map_employees = JSON.parse($('#account_map_employees').text());

    const opportunity_call_log_list = JSON.parse($('#opportunity_call_log_list').text());
    const opportunity_email_list = JSON.parse($('#opportunity_email_list').text());
    const opportunity_meeting_list = JSON.parse($('#opportunity_meeting_list').text());

    const config_is_select_stage = config.is_select_stage;
    const config_is_AM_create = config.is_account_manager_create;
    const config_is_input_rate = config.is_input_win_rate;

    let opp_stage_id;
    let opp_is_closed = false;
    let employee_current_id = $('#emp-current-id').val();

    let dict_product = {}

    let condition_is_quotation_confirm = false;
    let condition_sale_oder_approved = false;
    let condition_sale_oder_delivery_status = false;

    function autoLoadStage(is_load_rate = false, just_check = false) {
        if (list_stage_condition.length === 0) {
            list_stage.map(function (item) {
                let list_condition = []
                item.condition_datas.map(function (condition) {
                    list_condition.push({
                        'property': condition.condition_property.title,
                        'comparison_operator': condition.comparison_operator,
                        'compare_data': condition.compare_data,
                    })
                })
                list_stage_condition.push({
                    'id': item.id,
                    'logical_operator': item.logical_operator,
                    'condition_datas': list_condition
                })
            })
        }
        let list_property_config = []
        let ele_customer = $('#select-box-customer option:selected');
        if (ele_customer.length > 0) {
            let compare_data = 0;
            if (ele_customer.data('annual-revenue') !== null) {
                compare_data = ele_customer.data('annual-revenue').toString();
            }
            list_property_config.push({
                'property': 'Customer',
                'comparison_operator': '≠',
                'compare_data': '0',
            })

            list_property_config.push({
                'property': 'Customer',
                'comparison_operator': '=',
                'compare_data': compare_data,
            })
        }

        let ele_product_category = $('#select-box-product-category option:selected');
        if (ele_product_category.length > 0) {
            list_property_config.push({
                'property': 'Product Category',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'Product Category',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        }

        let ele_budget = $('#input-budget');
        if (ele_budget.valCurrency() === 0) {
            list_property_config.push({
                'property': 'Budget',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'Budget',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        let ele_open_date = $('#input-open-date');
        if (ele_open_date.val() === '') {
            list_property_config.push({
                'property': 'Open Date',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'Open Date',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        let ele_close_date = $('#input-close-date');
        if (ele_close_date.val() === '') {
            list_property_config.push({
                'property': 'Close Date',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'Close Date',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        let ele_decision_maker = $('#input-decision-maker');
        if (ele_decision_maker.attr('data-id') === '') {
            list_property_config.push({
                'property': 'Decision maker',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'Decision maker',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        let ele_tr_product = $('#table-products tbody tr:not(.hidden)');
        if (ele_tr_product.length === 0 || ele_tr_product.hasClass('col-table-empty')) {
            list_property_config.push({
                'property': 'Product.Line.Detail',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'Product.Line.Detail',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        let ele_competitor_win = $('.input-win-deal:checked');
        if (ele_competitor_win.length === 0) {
            list_property_config.push({
                'property': 'Competitor.Win',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'Competitor.Win',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        }

        let ele_check_lost = $('#check-lost-reason');
        if (ele_check_lost.is(':checked')) {
            list_property_config.push({
                'property': 'Lost By Other Reason',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'Lost By Other Reason',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        if (condition_is_quotation_confirm) {
            list_property_config.push({
                'property': 'Quotation.confirm',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'Quotation.confirm',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }


        if (condition_sale_oder_approved) {
            list_property_config.push({
                'property': 'SaleOrder.status',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'SaleOrder.status',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        if (condition_sale_oder_delivery_status) {
            list_property_config.push({
                'property': 'SaleOrder.Delivery.Status',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        } else {
            list_property_config.push({
                'property': 'SaleOrder.Delivery.Status',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        }

        let id_stage_current = '';
        for (let i = 0; i < list_stage_condition.length; i++) {
            if (list_stage_condition[i].logical_operator === 0) {
                if (list_stage_condition[i].condition_datas.every(objA => list_property_config.some(objB => objectsMatch(objA, objB)))) {
                    id_stage_current = list_stage_condition[i].id
                    break;
                }
            } else {
                if (list_stage_condition[i].condition_datas.some(objA => list_property_config.some(objB => objectsMatch(objA, objB)))) {
                    id_stage_current = list_stage_condition[i].id
                    break;
                }
            }
        }
        if (!just_check) {
            let ele_close_deal = $('#input-close-deal');
            if ($('.stage-selected').not(ele_close_deal.closest('.sub-stage')).last().data('id') !== id_stage_current) {
                Swal.fire($('#opp-updated').text());
            }
            let ele_stage = $(`.sub-stage`);
            let ele_stage_current = $(`.sub-stage[data-id="${id_stage_current}"]`);
            let index = ele_stage_current.index();
            if (ele_stage_current.hasClass('stage-lost')) {
                ele_stage_current.addClass('bg-red-light-5 stage-selected');
                ele_stage.removeClass('bg-primary-light-5 stage-selected');
            } else {
                for (let i = 0; i <= ele_stage.length; i++) {
                    if (i <= index) {
                        if (!ele_stage.eq(i).hasClass('stage-lost'))
                            ele_stage.eq(i).addClass('bg-primary-light-5 stage-selected');
                        else {
                            ele_stage.eq(i).removeClass('bg-red-light-5 stage-selected');
                        }
                    } else {
                        ele_stage.eq(i).removeClass('bg-primary-light-5 bg-red-light-5 stage-selected');
                    }
                }
            }

            if (ele_close_deal.is(':checked')) {
                ele_stage_current = ele_close_deal.closest('.sub-stage');
                ele_close_deal.closest('.sub-stage').addClass('bg-primary-light-5 stage-selected');
                $('.page-content input, .page-content select, .page-content .btn').not(ele_close_deal).not($('#rangeInput')).prop('disabled', true);
                if (!config_is_input_rate) {
                    $('#check-input-rate').prop('disabled', true);
                    $('#input-rate').prop('disabled', true);
                }
            } else {
                $('.page-content input, .page-content select, .page-content .btn').prop('disabled', false);
                ele_close_deal.closest('.sub-stage').removeClass('bg-primary-light-5 stage-selected');
                if (!config_is_input_rate) {
                    $('#check-input-rate').prop('disabled', true);
                    $('#input-rate').prop('disabled', true);
                } else {
                    let ele_check_input_rate = $('#check-input-rate')
                    ele_check_input_rate.prop('disabled', false);
                    if (ele_check_input_rate.is(':checked')) {
                        $('#input-rate').prop('disabled', false);
                    } else {
                        $('#input-rate').prop('disabled', true);
                    }

                }
                if (!$('#check-agency-role').is(':checked')) {
                    $('#select-box-end-customer').prop('disabled', true);
                }
            }

            if (!$('#check-input-rate').is(':checked')) {
                if (is_load_rate) {
                    let obj_stage = dict_stage[ele_stage_current.data('id')]
                    if (ele_stage_current.hasClass('stage-close'))
                        obj_stage = dict_stage[$('.stage-selected').not(ele_stage_current).last().data('id')];
                    $('#input-rate').val(obj_stage.win_rate);
                    $('#rangeInput').val(obj_stage.win_rate);
                }
            }
        }
        return id_stage_current
    }

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
        maxYear: parseInt(moment().format('YYYY-MM-DD'), 10) + 100
    });
    $('input[name="close_date"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'auto',
        minYear: parseInt(moment().format('YYYY-MM-DD'), 10) - 1,
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

    function loadCustomer(id, end_customer_id, data_competitor, sale_person) {
        let ele = $('#select-box-customer');
        let ele_end_customer = $('#select-box-end-customer');
        let ele_competitor = $('.box-select-competitor');
        if (end_customer_id === null || end_customer_id === id) {
            ele_end_customer.attr('disabled', true);
        }

        let url = ele.data('url');
        let method = ele.data('method');
        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('account_list')) {
                    ele_end_customer.append('<option></option>')
                    data.account_list.map(function (item) {
                        if (item.id === id) {
                            ele.append(`<option selected value="${item.id}" data-annual-revenue="${item.annual_revenue}">${item.name}</option>`);
                            loadSalePerson(item.manager.map(obj => obj.id), sale_person);
                        } else {
                            ele_competitor.append(`<option value="${item.id}">${item.name}</option>`);
                            ele.append(`<option value="${item.id}" data-annual-revenue="${item.annual_revenue}">${item.name}</option>`);
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
            col_empty.addClass('hidden');
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
        last_row.find('.num-product').text(table.find('tbody tr').length - 3);
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
                col_empty.addClass('hidden');
            }
            let col = $('.col-competitor').html().replace('hidden', '');
            data.map(function (item) {
                table.find('tbody').append(`<tr>${col}</tr>`);
                let last_row = table.find('tbody tr').last();
                last_row.find('.box-select-competitor').val(item.competitor.id);
                last_row.find('.input-strength').val(item.strength);
                last_row.find('.input-weakness').val(item.weakness);
                if (item.win_deal === true) {
                    last_row.find('.input-win-deal').prop(' ', true);
                }
            })
        }
    }

    function loadBoxContact(ele_row, type) {
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
                col_empty.addClass('hidden');
            }
            let col = $('.col-contact').html().replace('hidden', '');
            data.map(function (item) {
                table.find('tbody').append(`<tr>${col}</tr>`);
                let last_row = table.find('tbody tr').last();
                last_row.find('.box-select-type-customer').val(item.type_customer);
                last_row.find('.box-select-contact').val(item.contact.id);
                last_row.find('.input-job-title').val(item.job_title);
                last_row.find('.box-select-role').val(item.role);

                loadBoxContact(table.find('tbody tr'), item.type_customer);

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

    function loadMemberSaleTeam(employee_list) {
        if (!$.fn.DataTable.isDataTable('#dtbMember')) {
            let dtb = $('#dtbMember');
            dtb.DataTableDefault({
                paging: false,
                scrollY: '200px',
                autoWidth: false,
                columnDefs: [
                    {
                        "width": "10%",
                        "targets": 0
                    }, {
                        "width": "30%",
                        "targets": 1
                    }, {
                        "width": "50%",
                        "targets": 2
                    },
                    {
                        "width": "0%",
                        "targers": 3
                    },
                    {
                        "width": "10%",
                        "targets": 4
                    }
                ],
                data: employee_list,
                columns: [
                    {
                        render: (data, type, row, meta) => {
                            return '';
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="span-emp-code">{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'full_name',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="span-emp-name">{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'email',
                        className: 'wrap-text hidden',
                        render: (data, type, row, meta) => {
                            return `<span class="span-emp-email">{0}</span>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="form-check"><input data-id="{0}" type="checkbox" class="form-check-input input-select-member" /></span>`.format_by_idx(row.id)
                        }
                    },
                ],
            });
        }
    }

    function loadSalePerson(list_manager, sale_person) {
        let ele = $('#select-box-sale-person');
        let ele_emp_current_group = $('#group_id_emp_login');
        $.fn.callAjax(ele.data('url'), ele.data('method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                    loadMemberSaleTeam(data.employee_list);
                    $('#data-sale-person').val(JSON.stringify(data.employee_list));
                    let emp_current = data.employee_list.find(obj => obj.id === employee_current_id);
                    ele_emp_current_group.val(emp_current.group.id);
                    data.employee_list.map(function (employee) {
                        if (employee.id === sale_person.id) {
                            ele.append(`<option value="${employee.id}" selected>${employee.full_name}</option>`);
                        }
                    })
                    // if (config_is_AM_create) {
                    //     data.employee_list.map(function (employee) {
                    //         if (list_manager.includes(employee_current_id)) {
                    //             if (employee.group.id === emp_current.group.id && list_manager.includes(employee.id)) {
                    //                 if (employee.id === sale_person.id) {
                    //                     ele.append(`<option value="${employee.id}" selected>${employee.full_name}</option>`);
                    //                 } else {
                    //                     ele.append(`<option value="${employee.id}">${employee.full_name}</option>`);
                    //                 }
                    //             }
                    //         } else {
                    //             if (employee.id === sale_person.id) {
                    //                 ele.append(`<option value="${employee.id}" selected>${employee.full_name}</option>`);
                    //             }
                    //         }
                    //     })
                    // } else {
                    //     data.employee_list.map(function (employee) {
                    //         if (employee.group.id === emp_current.group.id) {
                    //             if (employee.id === sale_person.id) {
                    //                 ele.append(`<option value="${employee.id}" selected>${employee.full_name}</option>`);
                    //             } else {
                    //                 ele.append(`<option value="${employee.id}">${employee.full_name}</option>`);
                    //             }
                    //         }
                    //     })
                    // }
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
                let opportunity_detail = data?.['opportunity'];
                $.fn.compareStatusShowPageAction(opportunity_detail);
                opp_stage_id = opportunity_detail.stage;
                opp_is_closed = opportunity_detail.is_close;
                loadStage(opportunity_detail.stage, opportunity_detail.is_close_lost, opportunity_detail.is_deal_close);
                let ele_header = $('#header-title');
                ele_header.text(opportunity_detail.title);
                $('#span-code').text(opportunity_detail.code);
                $('#rangeInput').val(opportunity_detail.win_rate);
                let ele_input_rate = $('#input-rate')
                ele_input_rate.val(opportunity_detail.win_rate);

                if (opportunity_detail.is_input_rate) {
                    $('#check-input-rate').prop('checked', true);
                    ele_input_rate.prop('disabled', false);
                } else
                    $('#check-input-rate').prop('checked', false);

                if (config_is_input_rate) {
                    let ele_check = $('#check-input-rate');
                    ele_check.prop('disabled', false);
                    if (ele_check.is(':checked')) {
                        ele_input_rate.prop('readonly', false);
                    }
                    // ele_input_rate.prop('readonly', true);
                } else {
                    let ele_check = $('#check-input-rate');
                    ele_check.prop('checked', false);
                    ele_check.prop('disabled', true);
                }

                if (opportunity_detail.lost_by_other_reason) {
                    $('#check-lost-reason').prop('checked', true);
                } else
                    $('#check-lost-reason').prop('checked', false);
                loadCustomer(opportunity_detail.customer, opportunity_detail.end_customer, opportunity_detail.opportunity_competitors_datas, opportunity_detail.sale_person);
                loadProductCategory(opportunity_detail.product_category);
                loadTax();
                loadUoM();
                $('#input-budget').attr('value', opportunity_detail.budget_value);
                if (opportunity_detail.open_date !== null)
                    $('#input-open-date').val(opportunity_detail.open_date.split(' ')[0]);
                if (opportunity_detail.close_date !== null)
                    $('#input-close-date').val(opportunity_detail.close_date.split(' ')[0]);
                else {
                    $('#input-close-date').val('');
                }
                if (opportunity_detail.decision_maker !== null) {
                    let ele_decision_maker = $('#input-decision-maker');
                    ele_decision_maker.val(opportunity_detail.decision_maker.name);
                    ele_decision_maker.attr('data-id', opportunity_detail.decision_maker.id);
                }
                loadProduct(opportunity_detail.product_category, opportunity_detail.opportunity_product_datas);
                loadContact(opportunity_detail.customer, opportunity_detail.end_customer, opportunity_detail.opportunity_contact_role_datas);
                loadSaleTeam(opportunity_detail.opportunity_sale_team_datas);
                loadDecisionFactor(opportunity_detail.customer_decision_factor);

                if ($.fn.hasOwnProperties(opportunity_detail, ['sale_order'])) {
                    if (opportunity_detail.sale_order.system_status === 0) {
                        condition_sale_oder_approved = true;
                        if ($.fn.hasOwnProperties(opportunity_detail.sale_order, ['delivery'])) {
                            condition_sale_oder_delivery_status = true;
                        }
                    }
                }

                if ($.fn.hasOwnProperties(opportunity_detail, ['quotation'])) {
                    if (opportunity_detail.quotation.is_customer_confirm === true) {
                        condition_is_quotation_confirm = true;
                    }
                }
                $.fn.initMaskMoney2();
            }
        })
    }

    loadDetail();

    // even in tab product
    $('#btn-add-select-product').on('click', function () {
        let table = $('#table-products');
        table.addClass('tag-change');
        let col_empty = table.find('.col-table-empty');
        if (col_empty !== undefined) {
            col_empty.addClass('hidden');
        }
        let col = $('.col-select-product').html().replace('hidden', '');
        table.find('tbody').append(`<tr>${col}</tr>`);

        let last_row = table.find('tbody tr').last();
        last_row.find('.num-product').text(table.find('tbody tr').length - 3);
    })

    $('#btn-add-input-product').on('click', function () {
        let table = $('#table-products');
        table.addClass('tag-change');
        let col_empty = table.find('.col-table-empty');
        if (col_empty !== undefined) {
            col_empty.addClass('hidden');
        }

        let col = $('.col-input-product').html().replace('hidden', '');
        table.find('tbody').append(`<tr>${col}</tr>`);

        let last_row = table.find('tbody tr').last();
        last_row.find('.num-product').text(table.find('tbody tr').length - 3);
    })

    ele_select_product_category.on('select2:unselect', function (e) {
        let removedOption = e.params.data;
        let list_product = JSON.parse($('#data-product').val());
        $(`.box-select-product-category option[value="${removedOption.id}"]:selected`).closest('tr').remove();
        $('#table-product').addClass('tag-change');
        $(`.box-select-product-category option[value="${removedOption.id}"]`).remove();

        let list_product_remove = list_product.filter(function (item) {
            return item.general_information.product_category.id === removedOption.id;
        })
        list_product_remove.map(function (item) {
            $(`.select-box-product option[value="${item.id}"]`).remove();
        })
    });

    ele_select_product_category.on('select2:select', function (e) {
        let addOption = e.params.data;
        let list_product = JSON.parse($('#data-product').val());
        $(`.box-select-product-category`).append(`<option value="${addOption.id}">${addOption.text}</option>`)
        let list_product_add = list_product.filter(function (item) {
            return item.general_information.product_category.id === addOption.id;
        })
        list_product_add.map(function (item) {
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
        if ($.fn.hasOwnProperties(product['sale_information'], ['default_uom'])) {
            ele_tr.find('.box-select-uom').val(product['sale_information']['default_uom']['id']);
        }
        if ($.fn.hasOwnProperties(product['sale_information'], ['tax_code'])) {
            ele_tr.find('.box-select-tax').val(product['sale_information']['tax_code']['id']);
        }
    })

    function getTotalPrice() {
        let ele_tr_products = $('#table-products tbody tr:not(.hidden)');
        let tax_value = 0;
        let total_pretax = 0;
        ele_tr_products.each(function () {
            let tax = 0;
            if ($(this).find('.box-select-tax option:selected').data('value') !== undefined)
                tax = parseFloat($(this).find('.box-select-tax option:selected').data('value')) / 100;
            let sub_total = $(this).find('.input-subtotal').valCurrency();
            total_pretax += sub_total;
            tax_value += sub_total * tax;
        })

        $('#input-product-pretax-amount').attr('value', total_pretax);
        $('#input-product-taxes').attr('value', tax_value);
        $('#input-product-total').attr('value', total_pretax + tax_value);
        $.fn.initMaskMoney2();
    }

    $(document).on('change', '.input-unit-price', function () {
        let price = $(this).valCurrency();
        let ele_parent = $(this).closest('tr');
        let quantity = ele_parent.find('.input-quantity').val();
        let subtotal = price * quantity;
        ele_parent.find('.input-subtotal').attr('value', subtotal);
        getTotalPrice();
    })

    $(document).on('change', '.input-quantity', function () {
        let quantity = $(this).val();
        if (quantity < 0) {
            $.fn.notifyB({description: $('#limit-quantity').text()}, 'failure');
            $(this).val(0);
            quantity = 0;
        }
        let ele_parent = $(this).closest('tr');
        let price = ele_parent.find('.input-unit-price').valCurrency();
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
        table.addClass('tag-change');
        let col_empty = table.find('.col-table-empty');
        if (col_empty !== undefined) {
            col_empty.addClass('hidden');
        }
        let col = $('.col-competitor').html().replace('hidden', '');
        table.find('tbody').append(`<tr>${col}</tr>`);
    })

    $(document).on('change', '.input-win-deal', function () {

        if ($(this).is(':checked')) {
            if (checkOppWonOrDelivery()) {
                $(this).prop('checked', false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Opp has been Win Deal',
                })
            } else {
                $('.input-win-deal').not(this).prop('checked', false);
                $('.stage-lost').addClass('bg-red-light-5 stage-selected');
                loadWinRate();
            }
        } else {
            $('.stage-lost').removeClass('bg-red-light-5 stage-selected');
            loadWinRate();
        }
    })

    // event in tab contact role
    $('#btn-add-contact').on('click', function () {
        let table = $('#table-contact-role');
        table.addClass('tag-change')
        let col_empty = table.find('.col-table-empty');
        if (col_empty !== undefined) {
            col_empty.addClass('hidden');
        }
        let col = $('.col-contact').html().replace('hidden', '');
        table.find('tbody').append(`<tr>${col}</tr>`);

        loadBoxContact(table.find('tbody tr'), 0);
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
        if (table.find('tbody tr.col-table-empty').length === 0) {
            table.addClass('tag-change');
        }
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
        let value = $(this).val();
        if (value < 0 || value > 100) {
            $.fn.notifyB({description: $('#limit-rate').text()}, 'failure');
            $(this).val(0);
        } else {
            $('#rangeInput').val($(this).val());
        }
    })

    // get data form
    function getDataForm(data_form) {

        // only add field is change to form
        let ele_customer = $('#select-box-customer.tag-change');
        let ele_end_customer = $('#select-box-end-customer.tag-change');
        let ele_budget = $('#input-budget.tag-change');
        let ele_decision_maker = $('#input-decision-maker.tag-change');
        let ele_product_category = $('#select-box-product-category.tag-change');
        let ele_tr_products = $('#table-products.tag-change tbody tr:not(.hidden)');
        let ele_tr_competitors = $('#table-competitors.tag-change tbody tr:not(.hidden)');
        let ele_tr_contact_role = $('#table-contact-role.tag-change tbody tr:not(.hidden)');
        let ele_decision_factor = $('#box-select-factor.tag-change');
        let ele_sale_team_members = $('#card-member.tag-change .card');
        let ele_lost_other_reason = $('#check-lost-reason');

        data_form['win_rate'] = parseFloat($('#input-rate').val());
        data_form['is_input_rate'] = !!$('#check-input-rate').is(':checked');
        ele_customer.val() !== undefined ? data_form['customer'] = ele_customer.val() : undefined;
        ele_end_customer.val() !== undefined ? data_form['end_customer'] = ele_end_customer.val() : undefined;
        ele_budget.attr('value') !== undefined ? data_form['budget_value'] = ele_budget.attr('value') : undefined;
        ele_decision_maker.data('id') !== undefined ? data_form['decision_maker'] = ele_decision_maker.data('id') : undefined;

        ele_product_category.val() !== undefined ? data_form['product_category'] = ele_product_category.val() : undefined;
        ele_decision_factor.val() !== undefined ? data_form['customer_decision_factor'] = ele_decision_factor.val() : undefined;

        data_form['is_close_lost'] = false;
        data_form['is_deal_close'] = false;

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

        if ($('#table-products').hasClass('tag-change') && !ele_tr_products.hasClass('col-table-empty')) {
            data_form['opportunity_product_datas'] = list_product_data;
        }

        // tab competitor
        let list_competitor_data = []
        ele_tr_competitors.each(function () {
            let win_deal = false;
            if ($(this).find('.input-win-deal').is(':checked')) {
                win_deal = true;
                data_form['is_close_lost'] = true;
            }

            let data = {
                'competitor': $(this).find('.box-select-competitor').val(),
                'strength': $(this).find('.input-strength').val(),
                'weakness': $(this).find('.input-weakness').val(),
                'win_deal': win_deal,
            }

            list_competitor_data.push(data);
        })

        if ($('#table-competitors').hasClass('tag-change') && !ele_tr_competitors.hasClass('col-table-empty')) {
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

        if ($('#table-contact-role').hasClass('tag-change') && !ele_tr_contact_role.hasClass('col-table-empty')) {
            data_form['opportunity_contact_role_datas'] = list_contact_role_data;
        }

        let list_member = []
        ele_sale_team_members.each(function () {
            list_member.push({'member': $(this).data('id')});
        })
        if ($('#card-member').hasClass('tag-change')) {
            data_form['opportunity_sale_team_datas'] = list_member
        }

        // stage
        let list_stage = []
        let ele_stage = $('.stage-selected');
        ele_stage.not(':last').each(function () {
            list_stage.push({
                'stage': $(this).data('id'),
                'is_current': false,
            })
        })
        list_stage.push({
            'stage': ele_stage.last().data('id'),
            'is_current': true,
        })


        if ($('#input-close-deal').is(':checked')) {
            data_form['is_deal_close'] = true;
        }

        data_form['list_stage'] = list_stage;

        data_form['lost_by_other_reason'] = false;

        if (ele_lost_other_reason.is(':checked')) {
            data_form['lost_by_other_reason'] = true;
            data_form['is_close_lost'] = true;
        }
        return data_form
    }

    // submit form edit
    frmDetail.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        frm.dataForm = getDataForm(frm.dataForm);
        $.fn.callAjax(frm.dataUrl.format_url_with_uuid(pk), frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    })

    $(document).on('click', '.btn-del-item', function () {
        let table = $(this).closest(`table`);
        table.addClass('tag-change');
        $(this).closest('tr').remove();
        if (table.find('tbody tr:not(.hidden)').length === 0) {
            table.find('.col-table-empty').removeClass('hidden');
        }
        switch (table.attr('id')) {
            case 'table-products':
                getTotalPrice();
                break;
            case 'table-contact-role':
                if (table.find(`.box-select-role option[value="0"]:selected`).length === 0) {
                    let ele_decision_maker = $('#input-decision-maker');
                    ele_decision_maker.val('');
                    ele_decision_maker.attr('data-id', '');
                    ele_decision_maker.addClass('tag-change');
                }
        }
    })

    // tab add member for sale

    $(document).on('click', '#btn-show-modal-add-member', function () {
        let card_member = $('#card-member .card');
        let table = $('#dtbMember');
        table.find('tbody tr').removeClass('selected');
        table.find('tbody tr .input-select-member').prop('checked', false);
        card_member.map(function () {
            table.find(`.input-select-member[data-id="${$(this).attr('data-id')}"]`).prop('checked', true);
            table.find(`.input-select-member[data-id="${$(this).attr('data-id')}"]`).closest('tr').addClass('selected');
        })
    })

    $(document).on('click', '#btn-add-member', function () {
        let ele_tr = $('#dtbMember').find('tr.selected');
        let card_member = $('#card-member');
        card_member.html('');
        ele_tr.each(function () {
            card_member.append($('.card-member-hidden').html());
            let card = card_member.find('.card').last();
            let member_id = $(this).find('.input-select-member').attr('data-id');
            card.find('.btn-detail-member').attr('href', $('#url-member').val().format_url_with_uuid(member_id));
            card.find('.card-title').text($(this).find('.span-emp-name').text());
            card.find('.card-text').text($(this).find('.span-emp-email').text());
            card.attr('data-id', member_id);
        })
        $('#modalAddMember').modal('hide');
        card_member.addClass('tag-change');
    })

    $(document).on('click', '#dtbMember .input-select-member', function () {
        if ($(this).is(':checked')) {
            $(this).closest('tr').addClass('tr-change selected');
        } else {
            $(this).closest('tr').removeClass('tr-change selected');
        }
    })

    function loadSaleTeam(data) {
        let card_member = $('#card-member');
        data.map(function (item) {
            card_member.append($('.card-member-hidden').html());
            let card = card_member.find('.card').last();
            card.find('.btn-detail-member').attr('href', $('#url-member').val().format_url_with_uuid(item.member.id));
            card.find('.card-title').text(item.member.name);
            card.find('.card-text').text(item.member.email);
            card.attr('data-id', item.member.id);
        })
    }

    $(document).on('click', '.btn-remove-card', function () {
        $(this).closest('.card').remove();
        $('#card-member').addClass('tag-change');
    })

    $(document).on('change', '.mask-money', function () {
        if ($(this).valCurrency() < 0) {
            $.fn.notifyB({description: $('#limit-money').text()}, 'failure');
            $(this).attr('value', 0);
            $.fn.initMaskMoney2();
        }
    })

    $(document).on('change', '#input-close-date', function () {
        let open_date = $('#input-open-date').val();
        if ($(this).val() < open_date) {
            $.fn.notifyB({description: $('#limit-close-date').text()}, 'failure');
            $(this).val(open_date);
        }
    })

    $(document).on('focus', '#input-rate', function () {
        if ($(this).val() === '0') {
            $(this).val('');
        }
    });

    // Stage

    function sortStage(list_stage) {
        let object_lost = null;
        let delivery = null;
        let object_close = null;
        let list_result = []

        for (let i = 0; i < list_stage.length; i++) {
            if (list_stage[i].is_closed_lost) {
                object_lost = list_stage[i];
            } else if (list_stage[i].is_delivery) {
                delivery = list_stage[i];
            } else if (list_stage[i].is_deal_closed) {
                object_close = list_stage[i];
            } else {
                list_result.push(list_stage[i]);
            }
        }

        list_result.sort(function (a, b) {
            return a.win_rate - b.win_rate;
        });
        list_result.push(object_lost);
        if (delivery !== null)
            list_result.push(delivery);
        list_result.push(object_close);

        return list_result
    }

    let list_stage = [];
    let dict_stage = {};

    function loadStage(stages, is_close_lost, is_deal_close) {
        let ele = $('#div-stage');
        let method = ele.data('method');
        let url = ele.data('url');

        let html = $('#stage-hidden').html();
        $.fn.callAjax(url, method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_config_stage')) {
                    list_stage = sortStage(data.opportunity_config_stage);
                    dict_stage = list_stage.reduce((obj, item) => {
                        obj[item.id] = item;
                        return obj;
                    }, {});

                    list_stage.reverse().map(function (item) {
                        ele.prepend(html);
                        let ele_first_stage = ele.find('.sub-stage').first();
                        ele_first_stage.attr('data-id', item.id);
                        ele_first_stage.find('.stage-indicator').text(item.indicator);
                        if (item.is_closed_lost) {
                            ele_first_stage.find('.dropdown').remove();
                            ele_first_stage.addClass('stage-lost')
                        }
                        if (item.is_deal_closed) {
                            ele_first_stage.addClass('stage-close')
                            ele_first_stage.find('.dropdown-menu').empty();
                            if (is_close_lost || is_deal_close) {
                                ele_first_stage.find('.dropdown-menu').append(
                                    `<div class="form-check form-switch">
                                    <input type="checkbox" class="form-check-input" id="input-close-deal" checked>
                                    <label for="input-close-deal" class="form-label">Close Deal</label>
                                </div>`
                                )
                            } else {
                                ele_first_stage.find('.dropdown-menu').append(
                                    `<div class="form-check form-switch">
                                    <input type="checkbox" class="form-check-input" id="input-close-deal">
                                    <label for="input-close-deal" class="form-label">Close Deal</label>
                                </div>`
                                )
                            }
                        }
                    })
                }
            }
            if (stages.length !== 0) {
                stages.map(function (item) {
                    let ele_stage = $(`.sub-stage[data-id="${item.id}"]`);
                    if (ele_stage.hasClass('stage-lost')) {
                        ele_stage.addClass('bg-red-light-5 stage-selected');
                    } else if (ele_stage.hasClass('stage-close')) {
                        let el_close_deal = $('#input-close-deal');
                        $('.page-content input, .page-content select, .page-content .btn').not(el_close_deal).not($('#rangeInput')).prop('disabled', true);
                        ele_stage.addClass('bg-primary-light-5 stage-selected');
                        el_close_deal.prop('checked', true);
                    } else {
                        ele_stage.addClass('bg-primary-light-5 stage-selected');
                    }
                })
            }
        })
    }

    $(document).on('click', '.btn-go-to-stage', function () {
        if (config_is_select_stage) {
            if ($('#input-close-deal').is(':checked')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: $('#deal-closed').text(),
                })
            } else {
                if ($('#check-lost-reason').is(':checked') || $('.input-win-deal:checked').length > 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: $('#deal-close-lost').text(),
                    })
                } else {
                    let stage = $(this).closest('.sub-stage');
                    let index = stage.index();
                    let ele_stage = $('#div-stage .sub-stage');
                    $('.stage-lost').removeClass('bg-red-light-5 stage-selected');
                    for (let i = 0; i <= ele_stage.length; i++) {
                        if (i <= index) {
                            if (!ele_stage.eq(i).hasClass('stage-lost'))
                                ele_stage.eq(i).addClass('bg-primary-light-5 stage-selected');
                        } else {
                            ele_stage.eq(i).removeClass('bg-primary-light-5 stage-selected');
                        }
                    }
                    loadWinRate();
                }
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: $('#not-select-stage').text(),
            })
        }
    })

    function loadWinRate() {
        let ele_deal_close = $('.stage-close');
        let win_rate = dict_stage[$('.stage-selected').not(ele_deal_close).last().data('id')].win_rate;
        if (!$('#check-input-rate').is(':checked')) {
            $('#input-rate').val(win_rate);
            $('#rangeInput').val(win_rate);
        }
    }

    $(document).on('change', '#check-lost-reason', function () {
        let ele_stage_lost = $('.stage-lost')
        if (!$(this).is(':checked')) {
            ele_stage_lost.removeClass('bg-red-light-5 stage-selected');
            loadWinRate();
        } else {
            if (checkOppWonOrDelivery()) {
                $(this).prop('checked', false);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Opp has been Win Deal',
                })
            } else {
                $('.input-win-deal').not(this).prop('checked', false);
                ele_stage_lost.addClass('bg-red-light-5 stage-selected');
                loadWinRate();
            }
        }
    })


    // event auto select stage

    function objectsMatch(objA, objB) {
        return objA.property === objB.property && objA.comparison_operator === objB.comparison_operator && objA.compare_data === objB.compare_data;
    }

    let list_stage_condition = []
    $(document).on('click', '#btn-auto-update-stage', function () {
        autoLoadStage(true);
        $(this).tooltip('hide');
    })

    $(document).on('change', '#input-close-deal', function () {
        if ($(this).is(':checked')) {
            $(this).closest('.sub-stage').addClass('bg-primary-light-5 stage-selected');
            $('.page-content input, .page-content select, .page-content .btn').not($(this)).not($('#rangeInput')).prop('disabled', true);
        } else {
            $(this).closest('.sub-stage').removeClass('bg-primary-light-5 stage-selected');
            $('.page-content input, .page-content select, .page-content .btn').not($(this)).not($('#rangeInput')).prop('disabled', false);
            if($('#check-agency-role').is(':checked')){
                $('#select-box-end-customer').prop('disabled', false);
            }
            else{
                $('#select-box-end-customer').prop('disabled', true);
            }
        }
        loadWinRate();
    })

    if (config_is_select_stage) {
        $('#btn-auto-update-stage').hide();
    }

    function checkOppWonOrDelivery() {
        let check = false;
        let stage_id = $('.stage-selected').last().data('id');
        let indicator = dict_stage[stage_id].indicator;
        if (indicator === 'Closed Won' || indicator === 'Delivery') {
            check = true;
        }
        return check;
    }

    // toggle action and activity
    $(document).on('click', '#btn-show-activity', function () {
        $('.div-activity').removeClass('hidden');
        $('.div-action').addClass('hidden');
    })

    $(document).on('click', '#btn-show-action', function () {
        $('.div-activity').addClass('hidden');
        $('.div-action').removeClass('hidden');
    })


    // for call log

    function LoadSaleCodeListCallLog(default_sale_code_id) {
        let $sale_code_sb = $('#sale-code-select-box');
        $sale_code_sb.html(``);
        opportunity_list.map(function (item) {
            if (default_sale_code_id === item.id) {
                $sale_code_sb.append(`<option selected value="${item.id}">(${item.code})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.title}</option>`);
            }
        })
        $sale_code_sb.select2();
    }

    function LoadCustomerList(default_customer_id) {
        let $account_sb = $('#account-select-box');
        $account_sb.html(``);
        $account_sb.append(`<option></option>`)
        account_list.map(function (item) {
            if (default_customer_id === item.id) {
                $account_sb.append(`<option selected value="${item.id}">${item.name}</option>`);
            } else {
                $account_sb.append(`<option value="${item.id}">${item.name}</option>`);
            }
        })
        $account_sb.select2();
    }

    function LoadContactList(contact_list_id) {
        $('#call-log-contact-name').text('');
        $('#call-log-contact-job-title').text('');
        $('#call-log-contact-mobile').text('');
        $('#call-log-contact-email').text('');
        $('#call-log-contact-report-to').text('');
        $('#btn-detail-call-log-contact-tab').attr('href', '');
        $('#call-log-contact-detail-span').prop('hidden', true);

        let $contact_sb = $('#contact-select-box');
        $contact_sb.html(``);
        $contact_sb.append(`<option></option>`)
        contact_list.map(function (item) {
            if (contact_list_id.includes(item.id)) {
                let report_to = null
                if (Object.keys(item.report_to).length !== 0) {
                    report_to = item.report_to.name;
                }
                $contact_sb.append(`<option data-name="${item.fullname}" data-job-title="${item.job_title}" data-mobile="${item.mobile}" data-email="${item.email}" data-report-to="` + report_to + `" value="${item.id}">${item.fullname}</option>`);
            }
        })
        $contact_sb.select2({dropdownParent: $("#create-new-call-log")});
    }

    $('.create-new-call-log-button').on('click', function () {
        $('#subject-input').val('');
        $('#date-input').val('');
        $('#result-text-area').val('');
        $('#call-log-repeat-activity').attr('checked', false);
        $('#sale-code-select-box').prop('disabled', true);
        $('#account-select-box').prop('disabled', true);;

        let contact_list_id = account_list.filter(function (item) {
            return item.id === $('#select-box-customer option:selected').attr('value');
        })[0].contact_mapped;
        LoadContactList(contact_list_id);
        LoadSaleCodeListCallLog(pk);
        LoadCustomerList($('#select-box-customer option:selected').attr('value'));
    })

    $('#date-input').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'up',
        minYear: parseInt(moment().format('YYYY-MM-DD'), 10) - 1,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10) + 100
    });

    $('#contact-select-box').on('change', function () {
        if ($('#contact-select-box option:selected').attr('value')) {
            $('#call-log-contact-name').text($('#contact-select-box option:selected').attr('data-name'));
            $('#call-log-contact-job-title').text($('#contact-select-box option:selected').attr('data-job-title'));
            $('#call-log-contact-mobile').text($('#contact-select-box option:selected').attr('data-mobile'));
            $('#call-log-contact-email').text($('#contact-select-box option:selected').attr('data-email'));
            $('#call-log-contact-report-to').text($('#contact-select-box option:selected').attr('data-report-to'));
            let url = $('#btn-detail-call-log-contact-tab').attr('data-url').replace('0', $('#contact-select-box option:selected').attr('value'));
            $('#btn-detail-call-log-contact-tab').attr('href', url);
            $('#call-log-contact-detail-span').prop('hidden', false);
        }
        else {
            $('#call-log-contact-name').text('');
            $('#call-log-contact-job-title').text('');
            $('#call-log-contact-mobile').text('');
            $('#call-log-contact-email').text('');
            $('#call-log-contact-report-to').text('');
            $('#btn-detail-call-log-contact-tab').attr('href', '');
            $('#call-log-contact-detail-span').prop('hidden', true);
        }
    })

    $('#form-create-new-call-log').submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        frm.dataForm['subject'] = $('#subject-input').val();
        frm.dataForm['opportunity'] = $('#sale-code-select-box').val();
        frm.dataForm['customer'] = $('#account-select-box').val();
        frm.dataForm['contact'] = $('#contact-select-box').val();
        frm.dataForm['call_date'] = $('#date-input').val();
        frm.dataForm['input_result'] = $('#result-text-area').val();
        if ($('#call-log-repeat-activity').is(':checked')) {
            frm.dataForm['repeat'] = 1;
        } else {
            frm.dataForm['repeat'] = 0;
        }

        // console.log(frm.dataForm)

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.notifyB({description: "Successfully"}, 'success')
                $('#create-new-call-log').hide();

                callAjaxtoLoadTimeLineList();
            }
        })
    })


    // for send email

    $('#email-to-select-box').select2({
        dropdownParent: $("#send-email"),
        tags: true,
        tokenSeparators: [',', ' ']
    });

    $('#email-cc-select-box').select2({
        dropdownParent: $("#send-email"),
        tags: true,
        tokenSeparators: [',', ' '],
    });

    $('#detail-email-to-select-box').select2({
        dropdownParent: $("#detail-send-email"),
        tags: true,
        tokenSeparators: [',', ' ']
    });

    $('#detail-email-cc-select-box').select2({
        dropdownParent: $("#detail-send-email"),
        tags: true,
        tokenSeparators: [',', ' '],
    });

    function LoadEmailToList(contact_id_list) {
        let $to_sb = $('#email-to-select-box');
        $to_sb.html(``);
        contact_list.map(function (item) {
            if (contact_id_list.includes(item.id)) {
                if (item.email === null) {
                    $to_sb.append(`<option disabled>${item.fullname}</option>`);
                } else {
                    $to_sb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.email}</option>`);
                }
            }
        });
    }

    function LoadEmailCcList(contact_id_list) {
        let $cc_sb = $('#email-cc-select-box');
        $cc_sb.html(``);
        contact_list.map(function (item) {
            if (contact_id_list.includes(item.id)) {
                if (item.email === null) {
                    $cc_sb.append(`<option disabled>${item.fullname}</option>`);
                } else {
                    $cc_sb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.email}</option>`);
                }
            }
        });
    }

    $('.send-email-button').on('click', function () {
        $('#email-subject-input').val('');
        $('#email-content-area').val('');

        $('#email-to-select-box').prop('hidden', false);
        $('#email-to-select-box').next(1).prop('hidden', false);
        $('#inputEmailTo').prop('hidden', true);
        $('#email-to-select-btn').prop('hidden', true);
        $('#email-to-input-btn').prop('hidden', false);

        $('#email-cc-input-btn').prop('hidden', false);
        $('#inputEmailCc').prop('hidden', true);
        $('#email-cc-add').prop('hidden', true);
        $('#email-cc-remove').prop('hidden', true);

        let contact_list_id = account_list.filter(function(item) {
            return item.id === $('#select-box-customer option:selected').attr('value');
        })[0].contact_mapped;
        LoadEmailToList(contact_list_id);
        LoadEmailCcList(contact_list_id);
    })

    $('#form-new-email').submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        frm.dataForm['opportunity'] = pk;
        frm.dataForm['subject'] = $('#email-subject-input').val();
        frm.dataForm['email_to_list'] = $('#email-to-select-box').val();
        frm.dataForm['email_cc_list'] = $('#email-cc-select-box').val();
        frm.dataForm['content'] = $('#email-content-area').val();

        // console.log(frm.dataForm)

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
        .then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    $('#send-email').hide();

                    callAjaxtoLoadTimeLineList();
                }
            },
            (errs) => {
                // $.fn.notifyB({description: errs.data.errors}, 'failure');
            }
        )
    })


    // for meeting

    function LoadMeetingSaleCodeList(default_sale_code_id) {
        let $sc_sb = $('#meeting-sale-code-select-box');
        $sc_sb.html(``);
        opportunity_list.map(function (item) {
            if (item.id === default_sale_code_id) {
                $sc_sb.append(`<option selected data-customer-id="${item.customer.id}" value="${item.id}">(${item.code})&nbsp;&nbsp;&nbsp;${item.title}</option>`);
            }
        })
        $sc_sb.select2({dropdownParent: $("#create-meeting")});
    }

    function LoadCustomerMember(customer_id) {
            let contact_mapped_list = null;
            account_list.map(function (item) {
                if (customer_id === item.id) {
                    contact_mapped_list = item.contact_mapped;
                }
            })
            let $customer_member_sb = $('#meeting-customer-member-select-box');
            $customer_member_sb.html(``);
            $customer_member_sb.append(`<option></option>`);
            contact_list.map(function (item) {
                if (contact_mapped_list.includes(item.id)) {
                    $customer_member_sb.append(`<option value="${item.id}">${item.fullname}</option>`);
                }
            })
            $customer_member_sb.select2({dropdownParent: $("#create-meeting")});
        }

    function LoadEmployeeAttended() {
        let $employee_attended_sb = $('#meeting-employee-attended-select-box');
        $employee_attended_sb.html(``);
        $employee_attended_sb.append(`<option></option>`);
        employee_list.map(function (item) {
            $employee_attended_sb.append(`<option data-code="${item.code}" value="${item.id}">${item.full_name}</option>`);
        })
        $employee_attended_sb.select2({dropdownParent: $("#create-meeting")});
    }

    function LoadMeetingAddress(customer_id) {
        let opportunity_obj = JSON.parse($('#opportunity_list').text()).filter(function(item) {
            return item.customer.id === customer_id;
        })
        let shipping_address_list = opportunity_obj[0].customer.shipping_address;
        $('#meeting-address-select-box option').remove();
        $('#meeting-address-select-box').append(`<option></option>`);
        for (let i = 0; i < shipping_address_list.length; i++) {
            $('#meeting-address-select-box').append(`<option>` + shipping_address_list[i] + `</option>`);
        }
    }

    $('#meeting-date-input').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'down',
        minYear: parseInt(moment().format('YYYY-MM-DD'), 10) - 1,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10) + 100
    });
    $('#meeting-date-input').val('');

    $('.new-meeting-button').on('click', function () {
        $('#meeting-subject-input').val('');
        $('#meeting-date-input').val('');
        $('#meeting-room-location-input').val('');
        $('#meeting-address-input').val('');
        $('#meeting-result-text-area').val('');
        $('#meeting-repeat-activity').attr('checked', false);
        $('#meeting-address-select-box').prop('hidden', false);
        $('#meeting-address-input-btn').prop('hidden', false);
        $('#meeting-address-input').prop('hidden', true);
        $('#meeting-address-select-btn').prop('hidden', true);

        $('#meeting-sale-code-select-box').prop('disabled', true);
        LoadEmployeeAttended();
        LoadMeetingSaleCodeList(pk);
        let customer_id = $('#meeting-sale-code-select-box option:selected').attr('data-customer-id');
        LoadMeetingAddress(customer_id);
        LoadCustomerMember(customer_id);
    })

    $('#meeting-address-input-btn').on('click', function () {
        $('#meeting-address-select-box').prop('hidden', true);
        $('#meeting-address-input-btn').prop('hidden', true);
        $('#meeting-address-input').prop('hidden', false);
        $('#meeting-address-select-btn').prop('hidden', false);
    })

    $('#meeting-address-select-btn').on('click', function () {
        $('#meeting-address-select-box').prop('hidden', false);
        $('#meeting-address-input-btn').prop('hidden', false);
        $('#meeting-address-input').prop('hidden', true);
        $('#meeting-address-select-btn').prop('hidden', true);
    })

    $('#form-new-meeting').submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        frm.dataForm['subject'] = $('#meeting-subject-input').val();
        frm.dataForm['opportunity'] = $('#meeting-sale-code-select-box option:selected').val();
        frm.dataForm['meeting_date'] = $('#meeting-date-input').val();
        if ($('#meeting-address-select-box').is(':hidden')) {
            frm.dataForm['meeting_address'] = $('#meeting-address-input').val();
        }
        else {
            frm.dataForm['meeting_address'] = $('#meeting-address-select-box option:selected').val();
        }
        frm.dataForm['room_location'] = $('#meeting-room-location-input').val();
        frm.dataForm['input_result'] = $('#meeting-result-text-area').val();

        if ($('#meeting-repeat-activity').is(':checked')) {
            frm.dataForm['repeat'] = 1;
        }
        else {
            frm.dataForm['repeat'] = 0;
        }

        let employee_attended_list = [];
        $('#meeting-employee-attended-select-box option:selected').each(function (index, element) {
            employee_attended_list.push(
                {
                    'id': $(this).attr('value'),
                    'code': $(this).attr('data-code'),
                    'fullname': $(this).text()
                }
            )
        })

        let customer_member_list = [];
        $('#meeting-customer-member-select-box option:selected').each(function (index, element) {
            customer_member_list.push(
                {
                    'id': $(this).attr('value'),
                    'fullname': $(this).text()
                }
            )
        })

        frm.dataForm['employee_attended_list'] = employee_attended_list;
        frm.dataForm['customer_member_list'] = customer_member_list;

        // console.log(frm.dataForm)

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
        .then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    $('#create-meeting').hide();

                    callAjaxtoLoadTimeLineList();
                }
            },
            (errs) => {
                // $.fn.notifyB({description: errs.data.errors}, 'failure');
            }
        )
    })


    // for task

    function resetFormTask() {
    // clean html select etc.
    $('#formOpportunityTask').trigger('reset').removeClass('task_edit')
    $('#selectAssignTo').val(null).trigger('change');
    if ($('.current-create-task').length <= 0)
        $('#selectOpportunity').val(null).trigger('change').attr('disabled', false);
    $('.label-mark, .wrap-checklist, .wrap-subtask').html('');
    $('#inputLabel').val(null);
    $('[name="id"]').remove();
    const $inputAssigner = $('#inputAssigner');
    $inputAssigner.val($inputAssigner.attr('data-name'))
    $('.create-subtask').addClass('hidden')
    $('[name="parent_n"]').remove();
    window.editor.setData('')
    $('.create-task').attr('disabled', false)
}
    function logworkSubmit(){
        $('#save-logtime').off().on('click', function () {
            const startDate = $('#startDateLogTime').val()
            const endDate = $('#endDateLogTime').val()
            const est = $('#EstLogtime').val()
            const taskID = $('#logtime_task_id').val()
            if (!startDate && !endDate && !est) {
                $.fn.notifyB({description: $('#form_valid').attr('data-logtime-valid')}, 'failure')
                return false
            }
            const data = {
                'start_date': moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                'end_date': moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                'time_spent': est,
            }
            // if has task id => log time
            if (taskID && taskID.valid_uuid4()) {
                data.task = taskID
                let url = $('#url-factory').attr('data-logtime')
                $.fn.callAjax(url, 'POST', data, true)
                    .then(
                        (req) => {
                            let data = $.fn.switcherResp(req);
                            if (data?.['status'] === 200) {
                                $.fn.notifyB({description: data.message}, 'success')
                            }
                        }
                    )
            }else{
                $('[name="log_time"]').attr('value', JSON.stringify(data))
            }
            $('#logWorkModal').modal('hide')
        });
    }

    $(function () {
        // declare variable
        const $form = $('#formOpportunityTask')
        const $taskLabelElm = $('#inputLabel')

        // run single date
        $('input[type=text].date-picker').daterangepicker({
            minYear: 2023,
            singleDatePicker: true,
            timePicker: false,
            showDropdowns: true,
            // "cancelClass": "btn-secondary",
            // maxYear: parseInt(moment().format('YYYY'), 10)
            locale: {
                format: 'DD/MM/YYYY'
            }
        })

        // label handle
        class labelHandle {
            deleteLabel(elm) {
                elm.find('.tag-delete').on('click', function (e) {
                    e.stopPropagation();
                    const selfTxt = $(this).prev().text();
                    elm.remove();
                    let labelList = JSON.parse($taskLabelElm.val())
                    const idx = labelList.indexOf(selfTxt)
                    if (idx > -1) labelList.splice(idx, 1)
                    $taskLabelElm.attr('value', JSON.stringify(labelList))
                })
            }

            renderLabel(list) {
                // reset empty
                let htmlElm = $('.label-mark')
                htmlElm.html('')
                for (let item of list) {
                    const labelHTML = $(`<span class="item-tag"><span>${item}</span><span class="tag-delete">x</span></span>`)
                    htmlElm.append(labelHTML)
                    this.deleteLabel(labelHTML)
                }
            }

            // on click add label
            addLabel() {
                const _this = this
                $('.form-tags-input-wrap .btn-add-tag').on('click', function () {
                    const $elmInputLabel = $('#inputLabelName')
                    const newTxt = $elmInputLabel.val()
                    let labelList = $taskLabelElm.val()
                    if (labelList !== undefined && labelList !== '') labelList = JSON.parse(labelList)
                    if (!labelList.length) labelList = []
                    labelList.push(newTxt)
                    $taskLabelElm.attr('value', JSON.stringify(labelList))
                    const labelHTML = $(`<span class="item-tag"><span>${newTxt}</span><span class="tag-delete">x</span></span>`)
                    $('.label-mark').append(labelHTML)
                    $elmInputLabel.val('')
                    _this.deleteLabel(labelHTML)
                })
            }

            showDropdown() {
                $('.label-mark').off().on('click', function () {
                    const isParent = $(this).parent('.dropdown')
                    isParent.children().toggleClass('show')
                    $('input', isParent).focus()
                });
                $('.form-tags-input-wrap .btn-close-tag').on('click', function () {
                    $(this).parents('.dropdown').children().removeClass('show')
                })
            }

            init() {
                this.showDropdown()
                this.addLabel()
            }
        }

        // checklist handle
        class checklistHandle {

            datalist = []

            set setDataList(data) {
                this.datalist = data;
            }

            render() {
                let $elm = $('.wrap-checklist')
                $elm.html('')
                for (const item of this.datalist) {
                    let html = $($('.check-item-template').html())
                    // html.find
                    html.find('label').text(item.name)
                    html.find('input').prop('checked', item.done)
                    $elm.append(html)
                    html.find('label').focus()
                    this.delete(html)
                }
            }

            delete(elm) {
                elm.find('button').off().on('click', () => elm.remove())
            }

            get() {
                let checklist = []
                $('.wrap-checklist .checklist_item').each(function () {
                    checklist.push({
                        'name': $(this).find('label').text(),
                        'done': $(this).find('input').prop('checked')
                    })
                })
                return checklist
            }

            add() {
                const _this = this;
                $('.create-checklist').off().on('click', function () {
                    let html = $($('.check-item-template').html())
                    // html.find
                    $('.wrap-checklist').append(html)
                    html.find('label').focus(function () {
                        $(this).select();
                    });
                    _this.delete(html)
                });
            }

            init() {
                this.add()
            }
        }

        /** start run and init all function **/
        // run status select default
        const sttElm = $('#selectStatus');
        sttElm.attr('data-url')
        $.fn.callAjax2({
            'url': sttElm.attr('data-url'),
            'method': 'get'
        })
            .then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    let todoItem = data[sttElm.attr('data-keyResp')][0]
                    sttElm.attr('data-onload', JSON.stringify(todoItem))
                    sttElm.initSelect2()
                })

        // load assigner
        const $assignerElm = $('#inputAssigner')
        $assignerElm.val($assignerElm.attr('data-name')).attr('value', $assignerElm.attr('data-value-id'))

        // assign to me btn
        const $assignBtnElm = $('.btn-assign');
        const $assigneeElm = $('#selectAssignTo')
        $assigneeElm.initSelect2()
        $assignBtnElm.off().on('click', function () {
            const name = $assignerElm.attr('data-name')
            const id = $assignerElm.attr('data-value-id')
            const infoObj = {
                'full_name': name,
                'id': id
            }
            $assigneeElm.attr('data-onload', JSON.stringify(infoObj))
            $assigneeElm.initSelect2()
        });

        // run init label function
        let formLabel = new labelHandle()
        formLabel.init()
        // public global scope for list page render when edit
        window.formLabel = formLabel

        // auto load opp if in page opp
        const $btnInOpp = $('.current-create-task')
        const $selectElm = $('#selectOpportunity')

        if($btnInOpp.length){
            const pk = $.fn.getPkDetail()
            let data = {
                "id": pk,
                "title": ''
            }
            const isCheck = setInterval(()=>{
                let oppCode = $('#span-code').text()
                if (oppCode.length){
                    clearInterval(isCheck)
                    data.title = oppCode
                    $selectElm.attr('data-onload', JSON.stringify(data)).attr('disabled', true)
                    $selectElm.initSelect2()
                }
            }, 1000)
        }
        else $selectElm.initSelect2()

        // click to log-work
        $('.btn-log_work').off().on('click', () => {
            $('#logWorkModal').modal('show')
            $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
            const taskID = $('.task_edit [name="id"]').val()
            if (taskID) $('#logtime_task_id').val(taskID)
            logworkSubmit()
        })

        // run CKEditor
        ClassicEditor
            .create(document.querySelector('.ck5-rich-txt'),
                {
                    toolbar: {
                        items: ['heading', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList']
                    },
                },
            )
            .then(newEditor => {
                // public global scope for clean purpose when reset form.
                let editor = newEditor;
                window.editor = editor;
            })

        // run checklist tab
        let checklist = new checklistHandle()
        checklist.init();
        // public global scope with name checklist
        window.checklist = checklist;

        // reset form create task khi click huỷ bỏ hoặc tạo mới task con
        $('.cancel-task, [data-drawer-target="#drawer_task_create"]').each((idx, elm) => {
            $(elm).on('click', function () {
                if ($(this).hasClass('cancel-task')) {
                    $(this).closest('.ntt-drawer').toggleClass('open');
                    $('.hk-wrapper').toggleClass('open');
                }
                resetFormTask()
            });
        });

        // validate form
        jQuery.validator.setDefaults({
            debug: false,
            success: "valid"
        });

        $form.validate({
            errorElement: 'p',
            errorClass: 'is-invalid cl-red',
        })

        // form submit
        $form.off().on('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let _form = new SetupFormSubmit($form);
            let formData = _form.dataForm
            const start_date = new Date(formData.start_date).getDate()
            const end_date = new Date(formData.end_date).getDate()
            if (end_date < start_date) {
                $.fn.notifyB({description: $('#form_valid').attr('data-valid-datetime')}, 'failure')
                return false
            }
            if (formData.log_time === "")
                delete formData.log_time
            else{
                let temp = formData.log_time.replaceAll("'", '"')
                temp = JSON.parse(temp)
                formData.log_time = temp
            }
            formData.start_date = moment(formData.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            formData.end_date = moment(formData.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            formData.priority = parseInt(formData.priority)
            let tagsList = $('#inputLabel').attr('value')
            if (tagsList)
                formData.label = JSON.parse(tagsList)
            formData.employee_created = $('#inputAssigner').attr('value')
            formData.task_status = $('#selectStatus').val()
            const task_status = $('#selectStatus').select2('data')[0]
            const taskSttData = {
                'id': task_status.id,
                'title': task_status.title,
            }

            const assign_to = $('#selectAssignTo').select2('data')[0]
            let assign_toData = {}
            if (assign_to)
                assign_toData = {
                    'id': assign_to.id,
                    'first_name': assign_to.text.split('. ')[1],
                    'last_name': assign_to.text.split('. ')[0],
                }

            formData.checklist = []
            $('.wrap-checklist .checklist_item').each(function () {
                formData.checklist.push({
                    'name': $(this).find('label').text(),
                    'done': $(this).find('input').prop('checked'),
                })
            })

            if (!formData.opportunity) delete formData.opportunity
            if ($('#selectOpportunity').val()) formData.opportunity = $('#selectOpportunity').val()

            if ($('[name="attach"]').val()){
                let list = []
                list.push($('[name="attach"]').val())
                formData.attach = list
            }

            let method = 'POST'
            let url = _form.dataUrl
            if(formData.id && formData.id !== ''){
                method = 'PUT'
                url = $('#url-factory').attr('data-task-detail').format_url_with_uuid(formData.id)
            }
            $.fn.callAjax(url, method, formData, true).then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success')
                        // if in task page load add task function
                        if ($(document).find('#tasklist_wrap').length) {
                            let elm = $('<input type="hidden" id="addNewTaskData"/>');
                            // case update
                            if (!data?.id && data?.status === 200) {
                                elm = $('<input type="hidden" id="updateTaskData"/>');
                                formData.code = $('#inputTextCode').val();
                                formData.assign_to = assign_toData
                                formData.task_status = taskSttData
                            }
                            // case create
                            if (data?.id) formData = data
                            const datadump = JSON.stringify(formData)
                            elm.attr('data-task', datadump)
                            $('body').append(elm)
                        }
                        if ($('.current-create-task').length) $('.cancel-task').trigger('click')

                        callAjaxtoLoadTimeLineList();
                    }
                })
        })
    }, jQuery)


    // TIMELINE
    function tabSubtask(taskID){
        if (!taskID) return false
        const $wrap = $('.wrap-subtask')
        const url = $('#url-factory').attr('data-task_list')
        $.fn.callAjax(url, 'GET', {parent_n: taskID})
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    for (let [key, item] of data.task_list.entries()) {
                        const template = $(`<div class="d-flex justify-content-start align-items-center subtask_item">
                                    <p>${item.title}</p>
                                    <button class="btn btn-flush-primary btn-icon btn-rounded ml-auto flush-soft-hover" disabled>
                                        <span><i class="fa-regular fa-trash-can fa-sm"></i></span>
                                    </button>
                                 </div>`);
                        $wrap.append(template);
                    }
                }
            })
    }

    function tabLogWork(dataList){
        let $table = $('#table_log-work')
        if ($table.hasClass('datatable')) $table.DataTable().clear().draw();
        $table.DataTable({
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            data: dataList,
            columns: [
                {
                    data: 'employee_created',
                    targets: 0,
                    width: "35%",
                    render: (data, type, row) => {
                        let avatar = ''
                        const full_name = data.last_name + ' ' + data.first_name
                        if (data?.avatar)
                            avatar = `<img src="${data.avatar}" alt="user" class="avatar-img">`
                        else avatar = $.fn.shortName(full_name, '', 5)
                        const randomResource = randomColor[Math.floor(Math.random() * randomColor.length)];
                        return `<div class="avatar avatar-rounded avatar-xs avatar-${randomResource}">
                                        <span class="initial-wrap">${avatar}</span>
                                    </div>
                                    <span class="ml-2">${full_name}</span>`;
                    }
                },
                {
                    data: 'start_date',
                    targets: 1,
                    width: "35%",
                    render: (data, type, row) => {
                        let date = moment(data, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD')
                        if (data !== row.end_date) {
                            date += ' ~ '
                            date += moment(row.end_date, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD')
                        }
                        return date;
                    }
                },
                {
                    data: 'time_spent',
                    targets: 2,
                    width: "20%",
                    render: (data, type, row) => {
                        return data;
                    }
                },
                {
                    data: 'id',
                    targets: 3,
                    width: "10%",
                    render: (data, type, row) => {
                        return ''
                    }
                }
            ]
        })
    }

    function displayTaskView(url){
        if (url)
            $.fn.callAjax(url, 'GET')
                .then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        // enable side panel
                        if (!$('#drawer_task_create').hasClass('open')){
                            $($('.current-create-task span')[0]).trigger('click')
                        }
                        $('#inputTextTitle').val(data.title)
                        $('#inputTextCode').val(data.code)
                        $('#selectStatus').attr('data-onload', JSON.stringify(data.task_status))
                        $('#inputTextStartDate').val(
                            moment(data.start_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                        )
                        $('#inputTextEndDate').val(
                            moment(data.end_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                        )
                        $('#inputTextEstimate').val(data.estimate)
                        if (data?.opportunity_data && Object.keys(data.opportunity_data).length)
                            $('#selectOpportunity').attr('data-onload', JSON.stringify({
                                "id": data.opportunity_data.id,
                                "title": data.opportunity_data.code
                            }))
                        $('#selectPriority').val(data.priority).trigger('change')
                        window.formLabel.renderLabel(data.label)
                        $('#inputLabel').attr('value', JSON.stringify(data.label))
                        $('#inputAssigner').val(data.employee_created.last_name + '. ' + data.employee_created.first_name)
                            .attr('value', data.employee_created.id)
                        if (data.assign_to.length)
                            $('#selectAssignTo').attr('data-onload', JSON.stringify(data.assign_to))
                        window.editor.setData(data.remark)
                        window.checklist.setDataList = data.checklist
                        window.checklist.render()
                        initSelectBox($('#selectOpportunity, #selectAssignTo, #selectStatus'))
                        $('.create-subtask, .create-checklist').addClass('hidden')
                        if (data.task_log_work.length) tabLogWork(data.task_log_work)
                        tabSubtask(data.id)

                        if (data.attach) {
                            const fileDetail = data.attach[0]?.['files']
                            FileUtils.init($(`[name="attach"]`).siblings('button'), fileDetail);
                        }
                        $('.create-task').attr('disabled', true)
                    }
                })
    }

    function loadTimelineList(data_timeline_list) {
        const $urlElm = $('#url-factory')
        const $trans = $('#trans-factory')
        $('#table-timeline').DataTable().destroy();
        let dtb = $('#table-timeline');
        const type_trans = {
            0: $trans.attr('data-activity-type01'),
            1: $trans.attr('data-activity-type02'),
            2: $trans.attr('data-activity-type03'),
        }
        const type_icon = {
            0: `<i class="bi bi-telephone-fill"></i>`,
            1: `<i class="bi bi-envelope-fill"></i>`,
            2: `<i class="bi bi-person-workspace"></i>`,
            task: '<i class="fa-solid fa-file-arrow-up"></i>'
        }
        dtb.DataTableDefault({
            pageLength: 5,
            dom: "<'row miner-group'<'col-sm-3 mt-3'f><'col-sm-9'p>>" + "<'row mt-3'<'col-sm-12'tr>>" + "<'row mt-3'<'col-sm-12 col-md-6'i>>",
            data: data_timeline_list,
            columns: [
                {
                    data: 'activity',
                    className: 'wrap-text w-25',
                    render: (data, type, row, meta) => {
                        return row.title;
                    }
                },
                {
                    data: 'type',
                    className: 'wrap-text w-10 text-center',
                    render: (data, type, row, meta) => {
                        let txt = ''
                        if (row.type === 'task') {
                            txt = `<i class="fa-solid fa-list-check"></i>`
                        }
                        else if (row.type === 'call') {
                            txt = `<i class="bi bi-telephone-fill"></i>`
                        }
                        else if (row.type === 'email') {
                            txt = `<i class="bi bi-envelope-fill"></i>`
                        }
                        else if (row.type === 'meeting') {
                            txt = `<i class="bi bi-person-workspace"></i>`
                        }
                        else if (row.type === 'document') {
                            txt = `<i class="bi bi-file-earmark-fill"></i>`
                        }
                        return txt
                    }
                },
                {
                    data: 'subject',
                    className: 'wrap-text w-50',
                    render: (data, type, row, meta) => {
                        let modal_detail_target = '';
                        let modal_detail_class = '';
                        if (row.type === 'call') {
                            modal_detail_target = '#detail-call-log';
                            modal_detail_class = 'detail-call-log-button';
                        }
                        else if (row.type === 'email') {
                            modal_detail_target = '#detail-send-email';
                            modal_detail_class = 'detail-email-button';
                        }
                        else if (row.type === 'meeting') {
                            modal_detail_target = '#detail-meeting';
                            modal_detail_class = 'detail-meeting-button';
                        }
                        return `<a data-type="${row.type}" class="${modal_detail_class} text-primary link-primary underline_hover"
                                   href="" data-bs-toggle="modal" data-id="${row.id}"data-bs-target="${modal_detail_target}">
                                    <span><b>${row.subject}</b></span>
                                </a>`
                    }
                },
                {
                    data: 'date',
                    className: 'wrap-text w-15',
                    render: (data, type, row, meta) => {
                        return row.date
                    }
                },
            ],
            rowCallback: function(row, data){
                // click show task
                $('.view_task_log', row).off().on('click', function (e) {
                    e.stopPropagation();
                    displayTaskView(this.dataset.url)
                })
            },
        });
    }

    function callAjaxtoLoadTimeLineList() {
        // let call_1 = $.fn.callAjax($('#table-timeline').attr('data-url-call-log'), $('#table-timeline').attr('data-method')).then((resp) => {
        //     let data = $.fn.switcherResp(resp);
        //     if (data) {
        //         let call_1_result = [];
        //         if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('call_log_list')) {
        //             data.call_log_list.map(function (item) {
        //                 if (item.opportunity.id === pk) {
        //                     call_1_result.push({
        //                         'id': item.id,
        //                         'type': 0,
        //                         'subject': item.subject,
        //                         'date': item.call_date.split(' ')[0],
        //                     })
        //                 }
        //             })
        //         }
        //         return call_1_result;
        //     }
        // })
        // let call_2 = $.fn.callAjax($('#table-timeline').attr('data-url-email'), $('#table-timeline').attr('data-method')).then((resp) => {
        //     let data = $.fn.switcherResp(resp);
        //     if (data) {
        //         let call_2_result = [];
        //         if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('email_list')) {
        //             data.email_list.map(function (item) {
        //                 if (item.opportunity.id === pk) {
        //                     call_2_result.push({
        //                         'id': item.id,
        //                         'type': 1,
        //                         'subject': item.subject,
        //                         'date': item.date_created.split(' ')[0],
        //                     })
        //                 }
        //             })
        //         }
        //         return call_2_result;
        //     }
        // })
        // let call_3 = $.fn.callAjax($('#table-timeline').attr('data-url-meeting'), $('#table-timeline').attr('data-method')).then((resp) => {
        //     let data = $.fn.switcherResp(resp);
        //     if (data) {
        //         let call_3_result = [];
        //         if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('meeting_list')) {
        //             data.meeting_list.map(function (item) {
        //                 if (item.opportunity.id === pk) {
        //                     call_3_result.push({
        //                         'id': item.id,
        //                         'type': 2,
        //                         'subject': item.subject,
        //                         'date': item.meeting_date.split(' ')[0],
        //                     })
        //                 }
        //             })
        //         }
        //         return call_3_result;
        //     }
        // })
        //
        $.fn.callAjax($('#table-timeline').attr('data-url-logs_list'), 'GET', {'opportunity': pk})
        .then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let activity_logs_list = [];
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('activity_logs_list')) {
                    data.activity_logs_list.map(function (item) {
                        if (Object.keys(item.task).length > 0) {
                            activity_logs_list.push({
                                'id': item.task.id,
                                'type': item.task.activity_type,
                                'title': item.task.activity_name,
                                'subject': item.task.subject,
                                'date': item.date_created.split(' ')[0],
                            })
                        }
                        else if (Object.keys(item.call_log).length > 0) {
                            activity_logs_list.push({
                                'id': item.call_log.id,
                                'type': item.call_log.activity_type,
                                'title': item.call_log.activity_name,
                                'subject': item.call_log.subject,
                                'date': item.date_created.split(' ')[0],
                            })
                        }
                        else if (Object.keys(item.email).length > 0) {
                            activity_logs_list.push({
                                'id': item.email.id,
                                'type': item.email.activity_type,
                                'title': item.email.activity_name,
                                'subject': item.email.subject,
                                'date': item.date_created.split(' ')[0],
                            })
                        }
                        else if (Object.keys(item.meeting).length > 0) {
                            activity_logs_list.push({
                                'id': item.meeting.id,
                                'type': item.meeting.activity_type,
                                'title': item.meeting.activity_name,
                                'subject': item.meeting.subject,
                                'date': item.date_created.split(' ')[0],
                            })
                        }
                        else if (Object.keys(item.document).length > 0) {
                            activity_logs_list.push({
                                'id': item.document.id,
                                'type': item.document.activity_type,
                                'title': item.document.activity_name,
                                'subject': item.document.subject,
                                'date': item.date_created.split(' ')[0],
                            })
                        }
                    });
                }
                loadTimelineList(activity_logs_list)
            }
        })
        // Promise.all([call_1, call_2, call_3, call_4]).then((results) => {
        //     let sorted = results.flat().sort(function (a, b) {
        //         return new Date(b.date) - new Date(a.date);
        //     })
        //     loadTimelineList(sorted);
        // }).catch((error) => {
        //     console.log(error);
        // });
    }
    callAjaxtoLoadTimeLineList();

    const ele_move_doc_page = $('.btn-add-document')
    let url_doc_page = ele_move_doc_page.attr('href');
    const paramString = $.param({
        'opportunity': pk,
    })
    ele_move_doc_page.attr('href', url_doc_page + "?" + paramString);

    $(document).on('click', '#table-timeline .detail-call-log-button', function () {
        let call_log_id = $(this).attr('data-id');
        let call_log_obj = JSON.parse($('#opportunity_call_log_list').text()).filter(function(item) {
            return item.id === call_log_id;
        })[0]
        $('#detail-subject-input').val(call_log_obj.subject);

        $('#detail-sale-code-select-box option').remove();
        $('#detail-sale-code-select-box').append(`<option selected>(${call_log_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${call_log_obj.opportunity.title}</option>`);

        $('#detail-account-select-box option').remove();
        $('#detail-account-select-box').append(`<option selected>${call_log_obj.customer.title}</option>`);

        $('#detail-contact-select-box option').remove();
        $('#detail-contact-select-box').append(`<option selected>${call_log_obj.contact.fullname}</option>`);

        let contact_get = contact_list.filter(function(item) {
            return item.id === call_log_obj.contact.id;
        })
        if (contact_get.length > 0) {
            contact_get = contact_get[0];
            $('#detail-call-log-contact-name').text(contact_get.fullname);
            $('#detail-call-log-contact-job-title').text(contact_get.job_title);
            $('#detail-call-log-contact-mobile').text(contact_get.mobile);
            $('#detail-call-log-contact-email').text(contact_get.email);
            let report_to = null;
            if (Object.keys(contact_get.report_to).length !== 0) {
                report_to = contact_get.report_to.name;
            }
            $('#detail-call-log-contact-report-to').text(report_to);
            let url = $('#detail-btn-detail-call-log-contact-tab').attr('data-url').replace('0', contact_get.id);
            $('#detail-btn-detail-call-log-contact-tab').attr('href', url);
            $('#detail-call-log-contact-detail-span').prop('hidden', false);
        }

        $('#detail-date-input').val(call_log_obj.call_date.split(' ')[0]);
        $('#detail-repeat-activity').prop('checked', call_log_obj.repeat);
        $('#detail-result-text-area').val(call_log_obj.input_result);
    })

    $(document).on('click', '#table-timeline .detail-email-button', function () {
        let email_id = $(this).attr('data-id');
        let email_obj = JSON.parse($('#opportunity_email_list').text()).filter(function(item) {
            return item.id === email_id;
        })[0]
        $('#detail-email-subject-input').val(email_obj.subject);

        $('#detail-email-sale-code-select-box option').remove();
        $('#detail-email-sale-code-select-box').append(`<option selected>(${email_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${email_obj.opportunity.title}</option>`);

        $('#detail-email-to-select-box option').remove();
        for (let i = 0; i < email_obj.email_to_list.length; i++) {
            $('#detail-email-to-select-box').append(`<option selected>${email_obj.email_to_list[i]}</option>`);
        }

        $('#detail-email-cc-select-box option').remove();
        for (let i = 0; i < email_obj.email_cc_list.length; i++) {
            $('#detail-email-cc-select-box').append(`<option selected>${email_obj.email_cc_list[i]}</option>`);
        }

        $('#detail-email-content-area').val(email_obj.content);
    })

    $(document).on('click', '#table-timeline .detail-meeting-button', function () {
        let meeting_id = $(this).attr('data-id');
        let meeting_obj = JSON.parse($('#opportunity_meeting_list').text()).filter(function(item) {
            return item.id === meeting_id;
        })[0]
        $('#detail-meeting-subject-input').val(meeting_obj.subject);

        $('#detail-meeting-sale-code-select-box option').remove();
        $('#detail-meeting-sale-code-select-box').append(`<option selected>(${meeting_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${meeting_obj.opportunity.title}</option>`);

        $('#detail-meeting-address-select-box option').remove();
        $('#detail-meeting-address-select-box').append(`<option selected>${meeting_obj.meeting_address}</option>`);

        $('#detail-meeting-room-location-input').val(meeting_obj.room_location);

        $('#detail-meeting-employee-attended-select-box option').remove();
        for (let i = 0; i < meeting_obj.employee_attended_list.length; i++) {
            let employee_attended_item = meeting_obj.employee_attended_list[i];
            $('#detail-meeting-employee-attended-select-box').append(`<option selected>${employee_attended_item.fullname}</option>`);
        }
        $('#detail-meeting-employee-attended-select-box').prop('disabled', true);

        $('#detail-meeting-customer-member-select-box option').remove();
        for (let i = 0; i < meeting_obj.customer_member_list.length; i++) {
            let customer_member_item = meeting_obj.customer_member_list[i];
            $('#detail-meeting-customer-member-select-box').append(`<option selected>${customer_member_item.fullname}</option>`);
        }
        $('#detail-meeting-customer-member-select-box').prop('disabled', true);

        $('#detail-meeting-date-input').val(meeting_obj.meeting_date.split(' ')[0]);

        $('#detail-repeat-activity-2').prop('checked', meeting_obj.repeat);

        $('#detail-meeting-result-text-area').val(meeting_obj.input_result);
    })

    // event create related features

    $(document).on('click', '.btn-create-related-feature', function (){
        let url = $(this).data('url') + "?" + paramString;
        window.open(url, '_blank');
    })

})
