let [urlEle, transEle] = [$("#url-factory"), $("#trans-factory")];

class OpportunityLoadDropdown {
    static productCategorySelectEle = $('#select-box-product-category');
    static customerSelectEle = $('#select-box-customer');
    static endCustomerSelectEle = $('#select-box-end-customer');
    static salePersonSelectEle = $('#select-box-sale-person');

    static loadCustomer(data, config, emp_current) {
        this.customerSelectEle.initSelect2({
            data: data,
            dataParams: {
                'account_types_mapped__account_type_order': 0,
                'employee__id': emp_current,
            },
        })
    }

    static loadProductCategory(data) {
        this.productCategorySelectEle.initSelect2({
            data: data,
        })
    }

    static loadSalePerson(data, config, emp_current_id, list_account_manager) {
        this.salePersonSelectEle.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                if (!config) {
                    resp.data[keyResp].map(function (item) {
                        if (item.group.id === $('#employee_current_group').val() && list_account_manager.includes(item.id)) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                } else {
                    resp.data[keyResp].map(function (item) {
                        if (item.id === emp_current_id) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                }
            }
        })
    }

    static loadSalePersonPageDetail(data) {
        this.salePersonSelectEle.initSelect2({
            data: data,
        })
    }

    static loadEndCustomer(data, customer) {
        this.endCustomerSelectEle.initSelect2({
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
            dataParams:{
                'group': product?.['general_information'].uom_group.id
            },
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
            dataParams: {
                'account_types_mapped__account_type_order': 3,
            },
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
            'dataParams': {'account_name_id': customer},
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
            OpportunityLoadDropdown.loadProduct(tr_current_ele.find('.select-box-product'), item.product, data.product_category.map(obj => obj.id))
            OpportunityLoadDropdown.loadSubProductCategory(tr_current_ele.find('.box-select-product-category'), item.product_category, data.product_category.map(obj => obj.id))
            OpportunityLoadDropdown.loadUoM(tr_current_ele.find('.box-select-uom'), item.uom);
            OpportunityLoadDropdown.loadTax(tr_current_ele.find('.box-select-tax'), item.tax)
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
        OpportunityLoadDropdown.loadProduct(tr_current_ele.find('.select-box-product'), {}, OpportunityLoadDropdown.productCategorySelectEle.val());
        OpportunityLoadDropdown.loadTax(tr_current_ele.find('.box-select-tax'), {})
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
        OpportunityLoadDropdown.loadSubProductCategory(tr_current_ele.find('.box-select-product-category'), {}, OpportunityLoadDropdown.productCategorySelectEle.val());
        OpportunityLoadDropdown.loadTax(tr_current_ele.find('.box-select-tax'), {})
        OpportunityLoadDropdown.loadUoM(tr_current_ele.find('.box-select-uom'), {})
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
            OpportunityLoadDropdown.loadCompetitor(tr_current_ele.find('.box-select-competitor'), item.competitor, OpportunityLoadDropdown.customerSelectEle.val());
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
        OpportunityLoadDropdown.loadCompetitor(tr_current_ele.find('.box-select-competitor'), {}, OpportunityLoadDropdown.customerSelectEle.val());
    }

    static loadDetailTableContactRole(table, data) {
        data.opportunity_contact_role_datas.map(function (item) {
            table.DataTable().row.add(item).draw();
            let tr_current_ele = table.find('tbody tr').last();
            OpportunityLoadDropdown.loadContact(tr_current_ele.find('.box-select-contact'), item.contact, OpportunityLoadDropdown.customerSelectEle.val());
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
        OpportunityLoadDropdown.loadContact(tr_current_ele.find('.box-select-contact'), {}, OpportunityLoadDropdown.customerSelectEle.val());
        this.appendTypeCustomer(null, tr_current_ele.find('.box-select-type-customer'));
        this.appendRole(null, tr_current_ele.find('.box-select-role'));
        tr_current_ele.find('.box-select-role').val('');
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


    static getDataMember() {
        let ele_tr = $('#dtbMember').find('tr.selected');
        let list_result = []
        ele_tr.each(function () {
            if ($(this).hasClass('tr-added')) {
                list_result.push(
                    {
                        'id': $(this).find('.input-select-member').data('id')
                    }
                )
            }
        })
        return list_result

    }

    static async loadMemberForDtb() {
        await loadMemberSaleTeam();
        let card_member = $('#card-member .card');
        let table = $('#dtbMember');
        await new Promise(resolve => setTimeout(resolve, 500));
        table.find('tbody tr').removeClass('selected');
        table.find('tbody tr .input-select-member').prop('checked', false);
        card_member.map(function () {
            table.find(`.input-select-member[data-id="${$(this).attr('data-member-id')}"]`).prop('checked', true);
            table.find(`.input-select-member[data-id="${$(this).attr('data-member-id')}"]`).closest('tr').addClass('selected');
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
        card_member.empty();
        data.map(function (item) {
            card_member.append($('.card-member-hidden').html());
            let card = card_member.find('.card').last();
            card.find('.btn-detail-member').attr('href', urlEle.data('url-emp-detail').format_url_with_uuid(item.member.id));
            card.find('.card-title').text(item.member.name);
            card.find('.card-text').text(item.member.email);
            card.attr('data-id', item.id);
            card.attr('data-member-id', item.member.id);
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
        if (this.productTableEle.DataTable().data().length > 0) {
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
        }
        data_form['total_product'] = $('#input-product-total').valCurrency();
        data_form['total_product_pretax_amount'] = $('#input-product-pretax-amount').valCurrency();
        data_form['total_product_tax'] = $('#input-product-taxes').valCurrency();

        if (OpportunityLoadDetail.productTableEle.hasClass('tag-change')) {
            data_form['opportunity_product_datas'] = list_product_data;
        }

        // tab competitor
        let list_competitor_data = []
        if (this.competitorTableEle.DataTable().data().length > 0) {
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
        }

        if (OpportunityLoadDetail.competitorTableEle.hasClass('tag-change')) {
            data_form['opportunity_competitors_datas'] = list_competitor_data;
        }

        // tab contact role
        let list_contact_role_data = []
        if (this.contactRoleTableEle.DataTable().data().length > 0) {
            ele_tr_contact_role.each(function () {
                let data = {
                    'type_customer': $(this).find('.box-select-type-customer').val(),
                    'contact': $(this).find('.box-select-contact').val(),
                    'job_title': $(this).find('.input-job-title').val(),
                    'role': $(this).find('.box-select-role').val(),
                }
                list_contact_role_data.push(data);
            })
        }

        if (OpportunityLoadDetail.contactRoleTableEle.hasClass('tag-change')) {
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


    // function support event
    static onChangeContactRole(ele) {
        let ele_decision_maker = $('#input-decision-maker');
        if (ele.val() === '0') {
            let table = this.contactRoleTableEle;
            if (table.find('.box-select-role').not(ele).find('option[value="0"]:selected').length === 1) {
                ele.val('');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: transEle.data('trans-role-decision-maker'),
                })
            } else {
                let ele_contact = ele.closest('tr').find('.box-select-contact');
                let contact_data = SelectDDControl.get_data_from_idx(ele_contact, ele_contact.val());
                this.setDataDecisionMaker(ele_decision_maker, contact_data.fullname, contact_data.id);
            }
        }

        if ($('.box-select-role option[value="0"]:selected').length === 0) {
            this.setDataDecisionMaker(ele_decision_maker, '', '');
        }
    }

    static setDataDecisionMaker(ele_decision_maker, value, id) {
        ele_decision_maker.val(value);
        ele_decision_maker.attr('data-id', id);
        ele_decision_maker.addClass('tag-change');
    }

    static renderAlert(text) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: text,
        })
    }

    static loadDtbApplication() {
        if (!$.fn.DataTable.isDataTable('#table-applications')) {
            let $table = $('#table-applications')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                paging: false,
                scrollY: '200px',
                autoWidth: false,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('applications')) {
                            return resp.data['applications'] ? resp.data['applications'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        data: 'title',
                        targets: 0,
                        render: (data, type, row, meta) => {
                            return `<span class="application_name" data-id="${row.id}">${data}</span>`
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row, meta) => {
                            return `<div class="form-check form-switch"><input type="checkbox" class="form-check-input check-all" /></div>`
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row, meta) => {
                            return `<div class="form-check form-switch"><input type="checkbox" class="form-check-input check-create" /></div>`
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row, meta) => {
                            return `<div class="form-check form-switch"><input type="checkbox" class="form-check-input check-view" /></div>`
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row, meta) => {
                            return `<div class="form-check form-switch"><input type="checkbox" class="form-check-input check-edit" /></div>`
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row, meta) => {
                            return `<div class="form-check form-switch"><input type="checkbox" class="form-check-input check-delete" /></div>`
                        }
                    },
                    {
                        targets: 6,
                        render: (data, type, row, meta) => {
                            return `<select class="form-select box-select-belong-to">`
                        }
                    },

                ],
            })
        }
    }

    static loadBelongTo(ele) {
        let data = [
            {
                'id': 0,
                'title': 'User'
            },
            {
                'id': 1,
                'title': 'Opp member'
            },
        ]
        ele.initSelect2({
            data: data
        })
    }

    static loadMemberPermission(url, method) {
        $.fn.callAjax2({
            url: url,
            method: method,
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let member_detail = data?.['member'];
                $('#checkViewThisOpp').prop('checked', member_detail?.['permit_view_this_opp']);
                $('#checkCanAddMember').prop('checked', member_detail?.['permit_add_member']);
                let permit_app = member_detail?.['permit_app']
                for (let key in permit_app) {
                    if (permit_app.hasOwnProperty(key)) {
                        let tr_current = $(`#table-applications .application_name[data-id=${key}]`).closest('tr');
                        tr_current.find('input[type="checkbox"]').prop('checked', false);
                        tr_current.find('.check-all').prop('checked', permit_app[key].is_all);
                        tr_current.find('.check-create').prop('checked', permit_app[key].is_create);
                        tr_current.find('.check-view').prop('checked', permit_app[key]?.['is_view']);
                        tr_current.find('.check-edit').prop('checked', permit_app[key].is_edit);
                        tr_current.find('.check-delete').prop('checked', permit_app[key]?.['is_delete']);
                        tr_current.find('.box-select-belong-to').empty();
                        OpportunityLoadDetail.loadBelongTo(tr_current.find('.box-select-belong-to'));
                        tr_current.find(`.box-select-belong-to`).val(permit_app[key]?.['belong_to']).trigger('change');
                        tr_current.removeClass('tr-updated')
                    }
                }
            }
        })
    }

    static getFormDataMemberPermission() {
        let data = {}
        data['employee_current'] = $('#emp-current-id').val();
        data['permit_view_this_opp'] = $('#checkViewThisOpp').is(':checked');
        data['permit_add_member'] = $('#checkCanAddMember').is(':checked');
        let table = document.getElementById('table-applications');
        let updated_tr_ele = table.getElementsByClassName('tr-updated');
        let list_app = []
        for (let i = 0; i < updated_tr_ele.length; i++) {
            let currentElement = updated_tr_ele[i];
            let data = {
                'app': currentElement.querySelector('.application_name').getAttribute('data-id'),
                'is_all': currentElement.querySelector('.check-all').checked,
                'is_create': currentElement.querySelector('.check-create').checked,
                'is_edit': currentElement.querySelector('.check-edit').checked,
                'is_view': currentElement.querySelector('.check-view').checked,
                'is_delete': currentElement.querySelector('.check-delete').checked,
                'belong_to': parseInt(currentElement.querySelector('.box-select-belong-to').value),
            }
            list_app.push(data);
        }
        data['app_permit'] = list_app
        return data
    }

    static checkAllPermissionChecked(ele) {
        let elements = ele.find('.check-create, .check-view, .check-delete, .check-edit');
        return elements.filter(":not(:checked)").length === 0;
    }

    static reloadMemberList(pk) {
        let url = urlEle.data('url-member-list').format_url_with_uuid(pk);
        $.fn.callAjax2({
            'url': url,
            'method': 'get'
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                let data_member = data?.['opportunity_member']?.['sale_team'];
                OpportunityLoadDetail.loadSaleTeam(data_member);
            }
        )
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
                        return `<a href="${link}" class="badge badge-soft-primary">${row.code}</a> ${$x.fn.buttonLinkBlank(link)}`
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
                        return `<span class="badge badge badge-soft-success  ml-2 mt-2">${row?.['sale_person'].full_name}</span>`
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
    let url = urlEle.data('url-config');
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
            paging: false,
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
                            return `<select class="form-select select-box-product" data-method="GET" data-url="${urlEle.data('url-product')}" data-keyResp="product_sale_list" required></select><input class="form-control input-product-name hidden" type="text" value="${data.title}"/>`
                        } else {
                            return `<input class="form-control input-product-name" type="text" required/>`
                        }
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-product-category" data-method="GET" data-url="${urlEle.data('url-product-category')}" data-keyResp="product_category_list" required></select>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-uom w-80p" data-method="GET" data-url="${urlEle.data('url-uom')}" data-keyResp="unit_of_measure" required></select>`
                    }
                },
                {
                    data: 'product_quantity',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input type="number" class="form-control w-80p input-quantity" value="{0}" required/>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'product_unit_price',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input type="text" class="form-control w-150p mask-money input-unit-price" data-return-type="number" value="{0}" required/>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-tax" data-method="GET" data-url="${urlEle.data('url-tax')}" data-keyResp="tax_list" required></select>`
                    }
                },
                {
                    data: 'product_subtotal_price',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input class="form-control mask-money w-200p input-subtotal" type="text" data-return-type="number" value="{0}" readonly required>`.format_by_idx(
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
            paging: false,
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-control box-select-competitor" data-method="GET" data-url="${urlEle.data('url-competitor')}" data-keyResp="account_sale_list" data-keyText="name" required></select>`
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
            paging: false,
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-type-customer" required></select>`
                    }
                },
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<select class="form-select box-select-contact" data-method="GET" data-url="${urlEle.data('url-contact')}" data-keyResp="contact_list" data-keyText="fullname" required></select>`
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
                        return `<select class="form-select box-select-role" required></select>`
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
    let ele_customer = OpportunityLoadDropdown.customerSelectEle;
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

    if (OpportunityLoadDetail.productTableEle.DataTable().data().length === 0) {
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

        let stage_selected_ele = $('.stage-selected');
        let input_rate_ele = $('#check-input-rate');
        let ele_close_deal = $('#input-close-deal');
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
                OpportunityLoadDropdown.endCustomerSelectEle.prop('disabled', true);
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
