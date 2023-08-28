class OpportunityLoadDropdown {
    static transEle = $('#trans-factory');
    static urlEle = $('#url-factory');

    static productCategorySelectEle = $('#select-box-product-category');
    static customerSelectEle = $('#select-box-customer');
    static endCustomerSelectEle = $('#select-box-end-customer');

    static loadCustomer(ele, data, config, emp_current) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                if (config) {
                    let list_result = []
                    resp.data[keyResp].map(function (item) {
                        let list_id_am = item.manager.map(obj => obj.id)
                        if (list_id_am.includes(emp_current)) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                } else {
                    return resp.data[keyResp]
                }
            }
        })
    }

    static loadProductCategory(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadSalePerson(ele, data, config, emp_current_id, list_account_manager) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                if (config) {
                    let emp_current = resp.data[keyResp].find(obj => obj.id === emp_current_id)
                    resp.data[keyResp].map(function (item) {
                        if (item.group.id === emp_current.group.id && list_account_manager.includes(item.id)) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                } else {
                    resp.data[keyResp].map(function (item) {
                        if (item.id === emp_current_id.id) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                }
            }
        })
    }

    static loadSalePersonPageDetail(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadEndCustomer(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadProduct(ele, data, categories) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                resp.data[keyResp].map(function (item) {
                    if (categories.includes(item?.['general_information'].product_category.id)) {
                        list_result.push(item)
                    }
                })
                return list_result
            }
        })
    }

    static loadSubProductCategory(ele, data, categories) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                resp.data[keyResp].map(function (item) {
                    if (categories.includes(item.id)) {
                        list_result.push(item)
                    }
                })
                return list_result

            }
        })
    }

    static loadUoM(ele, data, product) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                if (product !== undefined) {
                    resp.data[keyResp].map(function (item) {
                        if (product?.['general_information'].uom_group.id === item.group.id) {
                            list_result.push(item)
                        }
                    })
                } else {
                    list_result = resp.data[keyResp]
                }
                return list_result
            }
        })
    }

    static loadTax(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadCompetitor(ele, data, customer) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                resp.data[keyResp].map(function (item) {
                    if (customer !== item.id) {
                        list_result.push(item)
                    }
                })
                return list_result
            }
        })
    }

    static loadFactor(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadContact(ele, data, customer) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                resp.data[keyResp].map(function (item) {
                    if (customer === item.account_name.id) {
                        list_result.push(item)
                    }
                })
                return list_result
            }
        })
    }

    static combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['product_category'] = this.productCategorySelectEle.val();
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }


}

class OpportunityLoadDetail {
    static productTableEle = $('#table-products');

    static competitorTableEle = $('#table-competitors');

    static contactRoleTableEle = $('#table-contact-role');

    static loadDetailTableProduct(table, data) {
        data.opportunity_product_datas.map(function (item) {
            table.DataTable().row.add(item).draw();
            let tr_current_ele = table.find('tbody tr').last();
            OpportunityLoadPage.loadProduct(tr_current_ele.find('.select-box-product'), item.product, data.product_category.map(obj => obj.id))
            OpportunityLoadPage.loadSubProductCategory(tr_current_ele.find('.box-select-product-category'), item.product_category, data.product_category.map(obj => obj.id))
            OpportunityLoadPage.loadUoM(tr_current_ele.find('.box-select-uom'), item.product_category);
            OpportunityLoadPage.loadTax(tr_current_ele.find('.box-select-tax'), item.tax)
        })
    }

    static addRowSelectProduct() {
        this.productTableEle.addClass('tag-change');
        let data = {
            'product': {},
            'product_quantity': '',
            'product_unit_price': '',
            'product_subtotal_price': '',

        }
        this.productTableEle.DataTable().row.add(data).draw();
        let tr_current_ele = this.productTableEle.find('tbody tr').last();
        OpportunityLoadPage.loadProduct(tr_current_ele.find('.select-box-product'), {}, OpportunityLoadPage.productCategorySelectEle.val());
        OpportunityLoadPage.loadTax(tr_current_ele.find('.box-select-tax'), {})
    }

    static addRowInputProduct() {
        this.productTableEle.addClass('tag-change');
        let data = {
            'product': null,
            'product_quantity': '',
            'product_unit_price': '',
            'product_subtotal_price': '',
        }
        this.productTableEle.DataTable().row.add(data).draw();
        let tr_current_ele = this.productTableEle.find('tbody tr').last();
        OpportunityLoadPage.loadSubProductCategory(tr_current_ele.find('.box-select-product-category'), {}, OpportunityLoadPage.productCategorySelectEle.val());
        OpportunityLoadPage.loadTax(tr_current_ele.find('.box-select-tax'), {})
        OpportunityLoadPage.loadUoM(tr_current_ele.find('.box-select-uom'), {})
    }

    static getRateTax(ele) {
        let tax_obj = SelectDDControl.get_data_from_idx(ele, ele.val());
        return tax_obj.rate
    }

    static getTotalPrice() {
        let ele_tr_products = this.productTableEle.find('tbody tr');
        let tax_value = 0;
        let total_pretax = 0;
        ele_tr_products.each(function () {
            let tax_rate = OpportunityLoadDetail.getRateTax($(this).find('.box-select-tax')) || 0;
            let sub_total = $(this).find('.input-subtotal').valCurrency();
            let tax_price = sub_total * (tax_rate / 100)
            total_pretax += sub_total;
            tax_value += tax_price;
        })

        $('#input-product-pretax-amount').attr('value', total_pretax);
        $('#input-product-taxes').attr('value', tax_value);
        $('#input-product-total').attr('value', total_pretax + tax_value);
        $.fn.initMaskMoney2();
    }


    static loadDetailTableCompetitor(table, data) {
        data.opportunity_competitors_datas.map(function (item) {
            table.DataTable().row.add(item).draw();
            let tr_current_ele = table.find('tbody tr').last();
            OpportunityLoadPage.loadCompetitor(tr_current_ele.find('.box-select-competitor'), item.competitor, OpportunityLoadPage.customerSelectEle.val());
        })
    }

    static addRowCompetitor() {
        let table = this.competitorTableEle;
        table.addClass('tag-change');
        let data = {
            'strength': '',
            'weakness': '',
            'win_deal': false,
        }
        table.DataTable().row.add(data).draw();
        let tr_current_ele = table.find('tbody tr').last();
        OpportunityLoadPage.loadCompetitor(tr_current_ele.find('.box-select-competitor'), {}, OpportunityLoadPage.customerSelectEle.val());
    }


    static loadDetailTableContactRole(table, data) {
        data.opportunity_contact_role_datas.map(function (item) {
            table.DataTable().row.add(item).draw();
            let tr_current_ele = table.find('tbody tr').last();
            OpportunityLoadPage.loadContact(tr_current_ele.find('.box-select-contact'), item.contact, OpportunityLoadPage.customerSelectEle.val());
            OpportunityLoadDetail.appendTypeCustomer(item.type_customer, tr_current_ele.find('.box-select-type-customer'));
            OpportunityLoadDetail.appendRole(item.role, tr_current_ele.find('.box-select-role'));
        })
    }

    static addRowContactRole() {
        let table = this.contactRoleTableEle;
        table.addClass('tag-change');
        let data = {
            'job_title': '',
        }
        table.DataTable().row.add(data).draw();
        let tr_current_ele = table.find('tbody tr').last();
        OpportunityLoadPage.loadContact(tr_current_ele.find('.box-select-contact'), {}, OpportunityLoadPage.customerSelectEle.val());
        this.appendTypeCustomer(null, tr_current_ele.find('.box-select-type-customer'));
        this.appendRole(null, tr_current_ele.find('.box-select-role'));
    }

    static appendTypeCustomer(value, ele) {
        let data = JSON.parse($('#data_type_customer').text());
        data.map(function (item) {
            if (value === item.value) {
                ele.append(`<option value="${item.value}" selected>${item.name}</option>`);
            } else {
                ele.append(`<option value="${item.value}">${item.name}</option>`);
            }
        })
    }

    static appendRole(value, ele) {
        let data = JSON.parse($('#data_role_customer').text());
        data.map(function (item) {
            if (value === item.value) {
                ele.append(`<option value="${item.value}" selected>${item.name}</option>`);
            } else {
                ele.append(`<option value="${item.value}">${item.name}</option>`);
            }
        })
    }

    static delRowTable(ele) {
        let table = ele.closest(`table`);
        table.addClass('tag-change');
        table.DataTable().row(ele.closest('tr').index()).remove().draw();
        switch (table.attr('id')) {
            case 'table-products':
                this.getTotalPrice();
                break;
            case 'table-contact-role':
                if (table.find(`.box-select-role option[value="0"]:selected`).length === 0) {
                    let ele_decision_maker = $('#input-decision-maker');
                    ele_decision_maker.val('');
                    ele_decision_maker.attr('data-id', '');
                    ele_decision_maker.addClass('tag-change');
                }
        }
    }


    static addMember() {
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
    }

    static async loadMemberForDtb() {
        await loadMemberSaleTeam();
        let card_member = $('#card-member .card');
        let table = $('#dtbMember');
        await new Promise(resolve => setTimeout(resolve, 500));
        table.find('tbody tr').removeClass('selected');
        table.find('tbody tr .input-select-member').prop('checked', false);
        card_member.map(function () {
            table.find(`.input-select-member[data-id="${$(this).attr('data-id')}"]`).prop('checked', true);
            table.find(`.input-select-member[data-id="${$(this).attr('data-id')}"]`).closest('tr').addClass('selected');
        })
    }

    static configDateTimeEle() {
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
    }

    static async loadDetailCommon(opportunity_detail) {
        $.fn.compareStatusShowPageAction(opportunity_detail);
        let stage_obj = await OpportunityLoadDetail.loadStage(opportunity_detail.stage, opportunity_detail.is_close_lost, opportunity_detail.is_deal_close);
        let ele_header = $('#header-title');
        ele_header.text(opportunity_detail.title);
        $('#span-code').text(opportunity_detail.code);
        $('#rangeInput').val(opportunity_detail.win_rate);
        let ele_input_rate = $('#input-rate');
        ele_input_rate.val(opportunity_detail.win_rate);

        if (opportunity_detail.is_input_rate) {
            $('#check-input-rate').prop('checked', true);
            ele_input_rate.prop('disabled', false);
        } else
            $('#check-input-rate').prop('checked', false);

        if (opportunity_detail?.['open_date'] !== null)
            $('#input-open-date').val(opportunity_detail?.['open_date'].split(' ')[0]);

        if (opportunity_detail?.['close_date'] !== null)
            $('#input-close-date').val(opportunity_detail?.['close_date'].split(' ')[0]);
        else {
            $('#input-close-date').val('');
        }
        if (opportunity_detail.decision_maker !== null) {
            let ele_decision_maker = $('#input-decision-maker');
            ele_decision_maker.val(opportunity_detail.decision_maker.name);
            ele_decision_maker.attr('data-id', opportunity_detail.decision_maker.id);
        }
        return stage_obj
    }

    static async loadStage(stages, is_close_lost, is_deal_close) {
        let ele = $('#div-stage');
        let method = ele.data('method');
        let url = ele.data('url');

        let html = $('#stage-hidden').html();
        let list_stage = [];
        let dict_stage = {};
        let data = await callData(url, method);
        if (data.hasOwnProperty('opportunity_config_stage')) {
            list_stage = sortStage(data?.['opportunity_config_stage']);
            dict_stage = list_stage.reduce((obj, item) => {
                obj[item.id] = item;
                return obj;
            }, {});

            list_stage.reverse().map(function (item) {
                ele.prepend(html);
                let ele_first_stage = ele.find('.sub-stage').first();
                ele_first_stage.attr('data-id', item.id);
                ele_first_stage.find('.stage-indicator').text(item.indicator);
                if (item?.['is_closed_lost']) {
                    ele_first_stage.find('.dropdown').remove();
                    ele_first_stage.addClass('stage-lost')
                }
                if (item?.['is_deal_closed']) {
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
                }
            )
        }

        return {
            'list': list_stage,
            'dict': dict_stage,
        }
    }

    static loadSaleTeam(data) {
        let card_member = $('#card-member');
        data.map(function (item) {
            card_member.append($('.card-member-hidden').html());
            let card = card_member.find('.card').last();
            card.find('.btn-detail-member').attr('href', OpportunityLoadPage.urlEle.data('url-emp-detail').format_url_with_uuid(item.member.id));
            card.find('.card-title').text(item.member.name);
            card.find('.card-text').text(item.member.email);
            card.attr('data-id', item.member.id);
        })
    }

    // get data form for update
    static getDataForm(data_form) {

        // only add field is change to form
        let ele_customer = $('#select-box-customer.tag-change');
        let ele_end_customer = $('#select-box-end-customer.tag-change');
        let ele_budget = $('#input-budget.tag-change');
        let ele_decision_maker = $('#input-decision-maker.tag-change');
        let ele_product_category = $('#select-box-product-category.tag-change');
        let ele_tr_products = $('#table-products.tag-change tbody tr');
        let ele_tr_competitors = $('#table-competitors.tag-change tbody tr');
        let ele_tr_contact_role = $('#table-contact-role.tag-change tbody tr');
        let ele_decision_factor = $('#box-select-factor.tag-change');
        let ele_sale_team_members = $('#card-member.tag-change .card');
        let ele_lost_other_reason = $('#check-lost-reason');

        data_form['win_rate'] = parseFloat(inputRateEle.val());
        data_form['is_input_rate'] = !!checkInputRateEle.is(':checked');
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

        if ($('#table-products').hasClass('tag-change')) {
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

        let list_member = []
        ele_sale_team_members.each(function () {
            list_member.push({'member': $(this).data('id')});
        })
        if ($('#card-member').hasClass('tag-change')) {
            data_form['opportunity_sale_team_datas'] = list_member;
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
}

// function in page list

function loadDtbOpportunityList() {
    if (!$.fn.DataTable.isDataTable('#table_opportunity_list-purchase-request')) {
        let $table = $('#table_opportunity_list')
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('opportunity_list')) {
                        return resp.data['opportunity_list'] ? resp.data['opportunity_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    targets: 0,
                    render: () => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        const link = $('#opportunity-link').data('link-update').format_url_with_uuid(row.id)
                        return `<a href="${link}" class="link-primary underline_hover">${row.code}</a>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<p>${row.title}</p>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<p>${row.customer.title}</p>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="badge badge badge-soft-success  ml-2 mt-2">${row?.['sale_person'].name}</span>`
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        let open_date = null;
                        if (row?.['open_date'] !== null) {
                            open_date = row?.['open_date'].split(" ")[0]
                        }
                        return `<p>${open_date}</p>`
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        let close_date = null;
                        if (row?.['close_date'] !== null) {
                            close_date = row?.['close_date'].split(" ")[0]
                        }
                        return `<p>${close_date}</p>`
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        let stage_current;
                        stage_current = row.stage.find(function (obj) {
                            return obj.is_current === true;
                        });
                        return `<p>${stage_current.indicator}</p>`
                    }
                },
                {
                    targets: 8,
                    className: 'action-center',
                    render: (data, type, row) => {
                        let urlUpdate = $('#opportunity-link').attr('data-link-update').format_url_with_uuid(row.id)
                        return `<div><a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" `
                            + `data-bs-original-title="Delete" href="javascript:void(0)" data-url="${urlUpdate}" `
                            + `data-method="DELETE"><span class="btn-icon-wrap"><span class="feather-icon">`
                            + `<i data-feather="trash-2"></i></span></span></a></div>`;
                    },
                }
            ],
        });
    }
}

function callData(url, method) {
    return $.fn.callAjax2({
        url: url,
        method: method,
    }).then((resp) => {
        return $.fn.switcherResp(resp);
    });
}

async function loadConfig() {
    let url = OpportunityLoadPage.urlEle.data('url-config');
    let method = 'GET';
    let result = await callData(url, method);
    return result?.['opportunity_config'];
}

// page detail

async function loadMemberSaleTeam() {
    if (!$.fn.DataTable.isDataTable('#dtbMember')) {
        let dtb = $('#dtbMember');
        let frm = new SetupFormSubmit(dtb);
        dtb.DataTableDefault({
            rowIdx: true,
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
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('employee_list')) {
                        return resp.data['employee_list'] ? resp.data['employee_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="span-emp-code">{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'full_name',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="span-emp-name">{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'email',
                    className: 'wrap-text hidden',
                    render: (data) => {
                        return `<span class="span-emp-email">{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="form-check"><input data-id="{0}" type="checkbox" class="form-check-input input-select-member" /></span>`.format_by_idx(row.id)
                    }
                },
            ],
        });
    }
}

function loadDtbProductDetailPageDetail(data) {
    if (!$.fn.DataTable.isDataTable('#table-products')) {
        let dtb = OpportunityLoadDetail.productTableEle;
        dtb.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            data: data,
            columns: [
                {
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'product_name',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'product_category',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.title
                        )
                    }
                },
                {
                    data: 'uom',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.title
                        )
                    }
                },
                {
                    data: 'product_quantity',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'product_unit_price',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="mask-money" data-init-money="{0}"></span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'tax',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.title
                        )
                    }
                },
                {
                    data: 'product_subtotal_price',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="mask-money" data-init-money="{0}"></span>`.format_by_idx(
                            data
                        )
                    }
                },
            ],
        });
    }
}

function loadDtbCompetitorPageDetail(data) {
    if (!$.fn.DataTable.isDataTable('#table-competitors')) {
        let dtb = OpportunityLoadDetail.competitorTableEle;
        dtb.DataTableDefault({
            data: data,
            columns: [

                {
                    data: 'competitor',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.name
                        )
                    }
                },
                {
                    data: 'strength',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'weakness',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'win_deal',
                    className: 'wrap-text text-center',
                    render: (data) => {
                        if (data) {
                            return `<div class="form-check"><input checked type="checkbox" class="form-check-input" disabled></div>`
                        } else {
                            return `<div class="form-check"><input type="checkbox" class="form-check-input" disabled></div>`
                        }
                    }
                },
            ],
        });
    }
}

function loadDtbContactRolePageDetail(data) {
    if (!$.fn.DataTable.isDataTable('#table-contact-role')) {
        let dtb = OpportunityLoadDetail.contactRoleTableEle;
        dtb.DataTableDefault({
            data: data,
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<span class="text-type-customer"></span>`
                    }
                },
                {
                    data: 'contact',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input type="text" class="form-control" value="${data.fullname}" disabled>`
                    }
                },
                {
                    data: 'job_title',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    className: 'wrap-text text-center',
                    render: () => {
                        return `<span class="text-contact-role"></span>`
                    }
                },
            ],
        });
    }
}

function loadDetailContactRole(data, table, transEle) {
    let row_current = table.find('tbody tr').last();
    let text_type_customer;
    if (data.type_customer === 0) {
        text_type_customer = transEle.data('trans-customer');
    } else {
        text_type_customer = transEle.data('end-customer');
    }

    let text_role;
    if (data.role === 0) {
        text_role = transEle.data('trans-decision-maker');
    } else if (data.role === 1) {
        text_role = transEle.data('trans-influence');
    } else {
        text_role = transEle.data('trans-contact-involved');
    }

    row_current.find('.text-type-customer').text(text_type_customer)
    row_current.find('.text-contact-role').text(text_role)
}

// page update

function loadDtbProduct(data) {
    if (!$.fn.DataTable.isDataTable('#table-products')) {
        let dtb = OpportunityLoadDetail.productTableEle;
        dtb.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            data: data,
            columns: [
                {
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'product',
                    className: 'wrap-text',
                    render: (data) => {
                        if (data !== null) {
                            return `<select class="form-select select-box-product" data-method="GET" data-url="${OpportunityLoadPage.urlEle.data('url-product')}" data-keyResp="product_sale_list"></select>`
                        } else {
                            return `<input class="form-control input-product-name" type="text"/>`
                        }
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-product-category" data-method="GET" data-url="${OpportunityLoadPage.urlEle.data('url-product-category')}" data-keyResp="product_category_list"></select>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-uom w-80p" data-method="GET" data-url="${OpportunityLoadPage.urlEle.data('url-uom')}" data-keyResp="unit_of_measure"></select>`
                    }
                },
                {
                    data: 'product_quantity',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input type="number" class="form-control w-80p input-quantity" value="{0}"/>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'product_unit_price',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input type="text" class="form-control w-150p mask-money input-unit-price" data-return-type="number" value="{0}"/>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-tax" data-method="GET" data-url="${OpportunityLoadPage.urlEle.data('url-tax')}" data-keyResp="tax_list"></select>`
                    }
                },
                {
                    data: 'product_subtotal_price',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input class="form-control mask-money w-200p input-subtotal" type="text" data-return-type="number" value="{0}" readonly>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<a class="btn btn-icon btn-del-item"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`
                    }
                },
            ],
        });
    }
}

function loadDtbCompetitor(data) {
    if (!$.fn.DataTable.isDataTable('#table-competitors')) {
        let dtb = OpportunityLoadDetail.competitorTableEle;
        dtb.DataTableDefault({
            data: data,
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-control box-select-competitor" data-method="GET" data-url="${OpportunityLoadPage.urlEle.data('url-competitor')}" data-keyResp="account_list" data-keyText="name"></select>`
                    }
                },
                {
                    data: 'strength',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input class="form-control input-strength" type="text" value="{0}"/>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'weakness',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input type="text" class="form-control input-weakness" value="{0}"/>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'win_deal',
                    className: 'wrap-text text-center',
                    render: (data) => {
                        if (data) {
                            return `<div class="form-check"><input checked type="checkbox" class="form-check-input"></div>`
                        } else {
                            return `<div class="form-check"><input type="checkbox" class="form-check-input input-win-deal"></div>`
                        }
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<a class="btn btn-icon btn-del-item"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>
`
                    }
                },
            ],
        });
    }
}

function loadDtbContactRole(data) {
    if (!$.fn.DataTable.isDataTable('#table-contact-role')) {
        let dtb = OpportunityLoadDetail.contactRoleTableEle;
        dtb.DataTableDefault({
            data: data,
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-type-customer"></select>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-contact" data-method="GET" data-url="${OpportunityLoadPage.urlEle.data('url-contact')}" data-keyResp="contact_list" data-keyText="fullname"></select>`
                    }
                },
                {
                    data: 'job_title',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input type="text" class="form-control input-job-title" value="{0}" readonly/>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-role"></select>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<a class="btn btn-icon btn-del-item">
                                    <span class="btn-icon-wrap">
                                        <span class="feather-icon"><i data-feather="trash-2"></i></span>
                                    </span>
                                </a>`
                    }
                }
            ],
        });
    }
}


function objectsMatch(objA, objB) {
    return objA.property === objB.property && objA.comparison_operator === objB.comparison_operator && objA.compare_data === objB.compare_data;
}

function autoLoadStage(
    is_load_rate = false,
    just_check = false,
    list_stage_condition,
    list_stage,
    condition_sale_oder_approved,
    condition_is_quotation_confirm,
    condition_sale_oder_delivery_status,
    config_is_input_rate,
    dict_stage
) {
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
    let ele_customer = OpportunityLoadPage.customerSelectEle;
    let obj_customer = SelectDDControl.get_data_from_idx(ele_customer, ele_customer.val());
    if (ele_customer.length > 0) {
        let compare_data = '0';
        if (obj_customer.annual_revenue !== null) {
            compare_data = obj_customer.annual_revenue;
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

    console.log(list_property_config)

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

        let stage_selected_ele = $('.stage-selected');
        let input_rate_ele = $('#check-input-rate');
        let ele_close_deal = $('#input-close-deal');
        if (stage_selected_ele.not(ele_close_deal.closest('.sub-stage')).last().data('id') !== id_stage_current) {
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
                input_rate_ele.prop('disabled', true);
                $('#input-rate').prop('disabled', true);
            }
        } else {
            $('.page-content input, .page-content select, .page-content .btn').prop('disabled', false);
            ele_close_deal.closest('.sub-stage').removeClass('bg-primary-light-5 stage-selected');
            if (!config_is_input_rate) {
                input_rate_ele.prop('disabled', true);
                $('#input-rate').prop('disabled', true);
            } else {
                let ele_check_input_rate = input_rate_ele;
                ele_check_input_rate.prop('disabled', false);
                if (ele_check_input_rate.is(':checked')) {
                    $('#input-rate').prop('disabled', false);
                } else {
                    $('#input-rate').prop('disabled', true);
                }

            }
            if (!$('#check-agency-role').is(':checked')) {
                OpportunityLoadPage.endCustomerSelectEle.prop('disabled', true);
            }
        }

        if (!input_rate_ele.is(':checked')) {
            if (is_load_rate) {
                let obj_stage = dict_stage[ele_stage_current.data('id')]
                if (ele_stage_current.hasClass('stage-close'))
                    obj_stage = dict_stage[stage_selected_ele.not(ele_stage_current).last().data('id')];
                $('#input-rate').val(obj_stage.win_rate);
                $('#rangeInput').val(obj_stage.win_rate);
            }
        }
    }
    return id_stage_current
}


//common
function toggleShowActivity() {
    $(document).on('click', '#btn-show-activity', function () {
        $('.div-activity').removeClass('hidden');
        $('.div-action').addClass('hidden');
    })

    $(document).on('click', '#btn-show-action', function () {
        $('.div-activity').addClass('hidden');
        $('.div-action').removeClass('hidden');
    })
}

function sortStage(list_stage) {
    let object_lost = null;
    let delivery = null;
    let object_close = null;
    let list_result = []

    for (let i = 0; i < list_stage.length; i++) {
        if (list_stage[i]?.['is_closed_lost']) {
            object_lost = list_stage[i];
        } else if (list_stage[i]?.['is_delivery']) {
            delivery = list_stage[i];
        } else if (list_stage[i]?.['is_deal_closed']) {
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

