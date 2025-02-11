const urlEle = $("#url-factory")
const transEle = $("#trans-factory")
const $dataDetail = $('#data-detail')

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
                        // if (item.group.id === $('#employee_current_group').val() && list_account_manager.includes(item.id)) {
                        if (list_account_manager.includes(item.id)) {
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
        $('#check-agency-role').prop('checked', Object.keys(data).length !== 0)
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
            dataParams: {
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

    static loadFactor(ele, data, is_detail=false) {
        ele.initSelect2({
            data: data,
        })
        ele.prop('disabled', is_detail)
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
    static input_prd_total_Ele= $('#input-product-total');
    static estimated_gross_profit_percent_Ele = $('#estimated-gross-profit-percent')

    static loadDetailTableProduct(data, is_detail=false) {
        const table = OpportunityLoadDetail.productTableEle;
        data.opportunity_product_datas.map(function (item) {
            table.DataTable().row.add(item).draw();
            let tr_current_ele = table.find('tbody tr').last();
            if (item.product) {
                OpportunityLoadDropdown.loadProduct(tr_current_ele.find('.select-box-product'), item.product, data.product_category.map(obj => obj.id))
            }
            else {
                table.find('tbody tr').last().find('.input-product-name').val(item.product_name)
            }
            OpportunityLoadDropdown.loadSubProductCategory(tr_current_ele.find('.box-select-product-category'), item.product_category, data.product_category.map(obj => obj.id))
            OpportunityLoadDropdown.loadUoM(tr_current_ele.find('.box-select-uom'), item.uom);
            OpportunityLoadDropdown.loadTax(tr_current_ele.find('.box-select-tax'), item.tax)
        })
        table.find('tbody input').prop('disabled', is_detail).prop('readonly', is_detail)
        table.find('tbody select').prop('disabled', is_detail)
        table.find('tbody button').prop('disabled', is_detail)
        table.find('tbody a').prop('disabled', is_detail)
        OpportunityLoadDetail.estimated_gross_profit_percent_Ele.prop('disabled', is_detail).prop('readonly', is_detail)
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
        this.input_prd_total_Ele.attr('value', total_pretax + tax_value);
        let value = parseFloat(this.input_prd_total_Ele.attr('value')) * parseFloat(this.estimated_gross_profit_percent_Ele.val()) / 100
        $('#estimated-gross-profit-value').attr('value', value)
        $.fn.initMaskMoney2();
    }

    static loadDetailTableCompetitor(data, is_detail=false) {
        const table = OpportunityLoadDetail.competitorTableEle;
        data.opportunity_competitors_datas.map(function (item) {
            table.DataTable().row.add(item).draw();
            let tr_current_ele = table.find('tbody tr').last();
            OpportunityLoadDropdown.loadCompetitor(tr_current_ele.find('.box-select-competitor'), item.competitor, OpportunityLoadDropdown.customerSelectEle.val());
        })
        table.find('tbody input').prop('disabled', is_detail).prop('readonly', is_detail)
        table.find('tbody select').prop('disabled', is_detail)
        table.find('tbody button').prop('disabled', is_detail)
        table.find('tbody a').prop('disabled', is_detail)
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

    static loadDetailTableContactRole(data, is_detail=false) {
        const table = OpportunityLoadDetail.contactRoleTableEle;
        data.opportunity_contact_role_datas.map(function (item) {
            table.DataTable().row.add(item).draw();
            let tr_current_ele = table.find('tbody tr').last();
            OpportunityLoadDropdown.loadContact(tr_current_ele.find('.box-select-contact'), item.contact, OpportunityLoadDropdown.customerSelectEle.val());
            OpportunityLoadDetail.appendTypeCustomer(item.type_customer, tr_current_ele.find('.box-select-type-customer'));
            OpportunityLoadDetail.appendRole(item.role, tr_current_ele.find('.box-select-role'));
        })
        table.find('tbody input').prop('disabled', is_detail).prop('readonly', is_detail)
        table.find('tbody select').prop('disabled', is_detail)
        table.find('tbody button').prop('disabled', is_detail)
        table.find('tbody a').prop('disabled', is_detail)
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

    static async loadMemberForDtb() {
        await LoadConfigAndLoadStage.loadMemberSaleTeam();
        let card_member = $('#card-member .card');
        let table = $('#dtbMember');
        await new Promise(resolve => setTimeout(resolve, 500));
        table.find('tbody tr').removeClass('selected');
        table.find('tbody tr .input-select-member:not(:disabled)').prop('checked', false);
        card_member.map(function () {
            table.find(`.input-select-member[data-id="${$(this).attr('data-member-id')}"]`).prop('checked', true);
            table.find(`.input-select-member[data-id="${$(this).attr('data-member-id')}"]`).closest('tr').addClass('selected');
        })
    }

    static configDateTimeEle() {
        // config input date
        $('input[name="open_date"]').daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            drops: 'up',
            autoApply: true,
        });

        $('input[name="close_date"]').daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            drops: 'up',
            autoApply: true,
        });
    }

    static async loadDetailCommon(opportunity_detail) {
        $.fn.compareStatusShowPageAction(opportunity_detail);
        // console.log(opportunity_detail)
        let stage_obj = await OpportunityLoadDetail.loadStage(opportunity_detail.stage, opportunity_detail.is_close_lost, opportunity_detail.is_deal_close);
        $('#header-title').text(opportunity_detail.title);
        $('#span-code').text(opportunity_detail.code);
        $('#rangeInput').val(opportunity_detail.win_rate);
        let ele_input_rate = $('#input-rate');
        ele_input_rate.val(opportunity_detail.win_rate);

        if (opportunity_detail.is_input_rate) {
            $('#check-input-rate').prop('checked', true);
            ele_input_rate.prop('disabled', false);
        } else
            $('#check-input-rate').prop('checked', false);

        if (opportunity_detail?.['open_date'])
            $('#input-open-date').val(
                moment(opportunity_detail?.['open_date'].split(' ')[0], 'YYYY-MM-DD').format("DD/MM/YYYY")
            );

        if (opportunity_detail?.['close_date'])
            $('#input-close-date').val(
                moment(opportunity_detail?.['close_date'].split(' ')[0], 'YYYY-MM-DD').format("DD/MM/YYYY")
            );
        else {
            $('#input-close-date').val('');
        }
        if (opportunity_detail.decision_maker) {
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
        let data = await LoadConfigAndLoadStage.callDataConfig(url, method);
        if (data.hasOwnProperty('opportunity_config_stage')) {
            list_stage = LoadConfigAndLoadStage.sortStage(data?.['opportunity_config_stage']);
            dict_stage = list_stage.reduce((obj, item) => {
                obj[item?.['id']] = item;
                return obj;
            }, {});

            list_stage.reverse().map(function (item) {
                ele.prepend(html);
                let ele_first_stage = ele.find('.sub-stage').first();
                ele_first_stage.attr('data-id', item?.['id']);
                ele_first_stage.find('.stage-indicator').attr('data-bs-tongle', 'tooltip');
                ele_first_stage.find('.stage-indicator').attr('title', item?.['indicator']);
                ele_first_stage.find('.stage-indicator').text(item?.['indicator']);
                if (item?.['is_closed_lost']) {
                    ele_first_stage.find('.dropdown').remove();
                    ele_first_stage.addClass('stage-lost')
                }
                if (item?.['is_deal_closed']) {
                    ele_first_stage.addClass('stage-close')
                    ele_first_stage.find('.dropdown-menu').empty();
                    if (is_deal_close) {
                        ele_first_stage.find('.dropdown-menu').append(
                            `<div class="form-check form-switch">
                                <input type="checkbox" class="form-check-input" id="input-close-deal" checked>
                                <label for="input-close-deal" class="form-label">Close Deal</label>
                            </div>`
                        )
                        let ele_stage = ele_first_stage.find('.dropdown-menu').closest('.sub-stage')
                        ele_stage.addClass('stage-selected')
                        ele_stage.css('background-color', '#0070D2')
                        ele_stage.css('color', 'white')
                        ele_stage.find('.dropdown span').css('color', 'white')
                        ele_stage.next().css('border-left', '30px solid #0070D2')
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
            let is_delivery = false
            stages.map(function (item) {
                if (item?.['indicator'] === 'Delivery') {
                    is_delivery = true
                }
            })
            stages.map(function (item) {
                let ele_stage = $(`.sub-stage[data-id="${item.id}"]`);
                if (ele_stage.hasClass('stage-lost')) {
                    if (!is_delivery) {
                        ele_stage.addClass('stage-selected')
                        ele_stage.css('background-color', '#EB2925')
                        ele_stage.css('color', 'white')
                        ele_stage.next().css('border-left', '16px solid #EB2925')
                    }
                } else if (ele_stage.hasClass('stage-close')) {
                    let el_close_deal = $('#input-close-deal');
                    $('.page-content input, .page-content select, .page-content .btn').not(el_close_deal).not($('#rangeInput')).prop('disabled', true);
                    el_close_deal.prop('checked', true);

                    ele_stage.addClass('stage-selected')
                    ele_stage.css('background-color', '#0070D2')
                    ele_stage.css('color', 'white')
                    ele_stage.find('.dropdown span').css('color', 'white')
                    ele_stage.next().css('border-left', '16px solid #0070D2')
                } else {
                    ele_stage.addClass('stage-selected')
                    ele_stage.css('background-color', '#0070D2')
                    ele_stage.css('color', 'white')
                    ele_stage.find('.dropdown span').css('color', 'white')
                    ele_stage.next().css('border-left', '16px solid #0070D2')
                }
            })
        }

        return {
            'list': list_stage,
            'dict': dict_stage,
        }
    }

    static clickEditMember(memberIdx, memberEditEle, boxEditPermitEle, eleViewOppMember, eleAddOppMember, change_member_selected = true) {
        boxEditPermitEle.removeClass('hidden');
        memberEditEle.val(memberIdx);
        if (change_member_selected === true) memberEditEle.trigger('change');
        boxEditPermitEle.attr('data-id', memberIdx);

        let urlTmp = boxEditPermitEle.data('url').replaceAll('__pk_member__', memberIdx);
        $.fn.callAjax2({
            url: urlTmp,
            type: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('member')) {
                    let memData = data['member'];
                    eleViewOppMember.prop('checked', memData.permit_view_this_opp);
                    eleAddOppMember.prop('checked', memData.permit_add_member);

                    HandlePlanAppNew.editEnabled = true;
                    HandlePlanAppNew.hasSpaceChoice = false;
                    HandlePlanAppNew.rangeAllowOfApp = ["1", "4"];
                    HandlePlanAppNew.manual_app_list_and_not_plan_app = true;

                    HandlePlanAppNew.setPlanApp([], true) // opp not using plan_app -> get from storage
                    HandlePlanAppNew.setPermissionByConfigured(memData.permission_by_configured || [])

                    let clsNew = new HandlePlanAppNew();
                    clsNew.renderPermissionSelected(
                        memberIdx, {
                            'get_from': 'opportunity',
                            'opportunity': $.fn.getPkDetail(),
                        })
                }
                return {};
            },
            (errs) => {
            }
        )
    }

    static loadSaleTeam(data, isEdit = true, employee_inherit = {}) {
        let employee_inherit_id = employee_inherit?.['id'] || null;
        let html = `
            <div class="member-item col-md-12 col-lg-6 col-xl-4">
               <div
                  class="card" data-manual-hide="false" data-footer-show="always"
                  data-id="__idx__"
                  >
                  <div class="card-header card-header-action">
                     <div class="hidden-md">__avatar__</div>
                     <div class="ml-1 card-main-title">
                        <p>__full_name__</p>
                        <p><small><a href="mailto:__email__">__email__</a></small></p> 
                    </div>
                     <div class="card-action-wrap __is_edit__">
                        <button
                           class="btn btn-xs btn-icon btn-rounded btn-flush-dark flush-soft-hover card-action-edit"
                           type="button"
                        >
                            <span class="icon">
                                <span class="feather-icon">
                                    <i data-feather="edit-2"></i>
                                </span>
                            </span>
                        </button>
                        <a class="btn btn-xs btn-icon btn-rounded btn-flush-dark flush-soft-hover card-action card-action-close __is_delete__">
                            <span class="icon">
                                <span class="feather-icon">
                                    <i data-feather="x"></i>
                                </span>
                            </span>
                        </a>
                     </div>
                  </div>
                  <script type="application/json" class="card-permit-data">__permit_data__</script>
               </div>
            </div>
        `;

        let memberItemListEle = $('#member-item-list');
        let memberEditEle = $('#member-current-edit');
        let dataMember = [];
        let boxEditPermitEle = $('#box-edit-permit');
        let eleViewOppMember = $('#enable-view-opp-member');
        let eleAddOppMember = $('#enable-add-opp-member');

        memberItemListEle.children().each(function () {
            if ($(this).find('#btn-show-modal-add-member').length <= 0) $(this).remove();
        });
        data.reverse().map(function (item) {
            let itemHTML = html.replaceAll(
                "__idx__",
                item.id
            ).replaceAll(
                "__full_name__",
                item.full_name,
            ).replaceAll(
                "__email__",
                item.email,
            ).replaceAll(
                "__avatar__",
                $x.fn.renderAvatar(item),
            ).replaceAll(
                "__permit_data__",
                JSON.stringify(item?.['permit_app'] || [])
            ).replaceAll(
                "__is_edit__",
                isEdit ? "" : "hidden"
            ).replaceAll(
                '__is_delete__',
                !!(employee_inherit_id && item.id === employee_inherit_id) ? "hidden" : ""
            );
            memberItemListEle.prepend(itemHTML);
            dataMember.push(item)
        });
        memberEditEle.initSelect2({
            data: dataMember,
            keyText: 'full_name',
        }).on('change', function () {
            OpportunityLoadDetail.clickEditMember($(this).val(), memberEditEle, boxEditPermitEle, eleViewOppMember, eleAddOppMember, false)
        })
        memberItemListEle.on('click', '.card-action-edit', function () {
            let eleCard = $(this).closest('.card');
            OpportunityLoadDetail.clickEditMember(eleCard.data('id'), memberEditEle, boxEditPermitEle, eleViewOppMember, eleAddOppMember)
        });

        $('#btnSavePermitMember').on('click', function () {
            WindowControl.showLoading()
            let bodyData = {
                'permit_view_this_opp': eleViewOppMember.prop('checked'),
                'permit_add_member': eleAddOppMember.prop('checked'),
                'permission_by_configured': new HandlePlanAppNew().combinesPermissions(),
            };
            let urlData = boxEditPermitEle.data('url').replaceAll('__pk_member__', boxEditPermitEle.data('id'));
            $.fn.callAjax2({
                url: urlData,
                method: 'PUT',
                data: bodyData,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && data.hasOwnProperty('member')) {
                        $.fn.notifyB({
                            'description': $.fn.transEle.attr('data-success'),
                        }, 'success')
                        OpportunityLoadDetail.clickEditMember(boxEditPermitEle.data('id'), memberEditEle, boxEditPermitEle, eleViewOppMember, eleAddOppMember);
                        WindowControl.hideLoading()
                        Swal.fire({
                            html:
                            `<h6 class="text-primary">${transEle.attr('data-trans-notify-update-permission')}</h6>`,
                            customClass: {
                                confirmButton: 'btn btn-sm btn-primary',
                                actions: '',
                            },
                            buttonsStyling: false,
                        })
                    } else {
                        $.fn.notifyB({
                            'description': $.fn.transEle.attr('data-fail'),
                        }, 'failure')
                        WindowControl.hideLoading()
                    }
                },
                (errs) => {
                    $.fn.notifyB({
                            'description': $.fn.transEle.attr('data-fail'),
                        }, 'failure')
                    WindowControl.hideLoading()
                }
            )
        });

        $('.member-item').find('.card').on('card.action.close.confirm', function () {
            let eleCard = $(this).closest('.card');
            $.fn.callAjax2({
                url: boxEditPermitEle.data('url').replaceAll('__pk_member__', eleCard.data('id')),
                method: 'DELETE',
                'sweetAlertOpts': {
                    'allowOutsideClick': true
                }
            }).then(
                (resp) => {
                    $.fn.switcherResp(resp);
                    $.fn.notifyB({
                        'description': $.fn.transEle.data('success'),
                    }, 'success');
                    $(this).trigger('card.action.close.purge');
                },
                (errs) => {
                    $.fn.notifyB({
                        'description': $.fn.transEle.data('fail') + ": " + $('#trans-factory').attr('data-msg-deny-delete-member-owner'),
                    }, 'failure');
                    $(this).trigger('card.action.close.show');
                }
            )
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

        if ($('#new_opp_title').length !== 0) {
            data_form['title'] = $('#new_opp_title').val()
            if (!data_form['title']) {
                $.fn.notifyB({description: "Missing Opp title"}, 'failure');
            }
        }

        data_form['win_rate'] = parseFloat($('#input-rate').val());
        data_form['is_input_rate'] = !!$('#check-input-rate').is(':checked');
        ele_customer.val() !== undefined ? data_form['customer'] = ele_customer.val() : undefined;
        ele_end_customer.val() !== undefined ? data_form['end_customer'] = ele_end_customer.val() : undefined;
        ele_budget.attr('value') !== undefined ? data_form['budget_value'] = ele_budget.attr('value') : undefined;
        ele_decision_maker.data('id') !== undefined ? data_form['decision_maker'] = ele_decision_maker.data('id') : undefined;

        data_form['open_date'] = moment($('#input-open-date').val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        data_form['close_date'] = moment($('#input-close-date').val(), "DD/MM/YYYY").format('YYYY-MM-DD')

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
        if (OpportunityLoadDetail.productTableEle.hasClass('tag-change')) {
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
                    if (!$(this).find('.box-select-tax').val()) {
                        delete data['tax']
                    }
                    list_product_data.push(data);
                })
            }
            data_form['total_product'] = OpportunityLoadDetail.input_prd_total_Ele.valCurrency();
            data_form['total_product_pretax_amount'] = $('#input-product-pretax-amount').valCurrency();
            data_form['total_product_tax'] = $('#input-product-taxes').valCurrency();
            data_form['estimated_gross_profit_percent'] = OpportunityLoadDetail.estimated_gross_profit_percent_Ele.val();
            data_form['estimated_gross_profit_value'] = $('#estimated-gross-profit-value').valCurrency();
            data_form['opportunity_product_datas'] = list_product_data;
        }

        // tab competitor
        if (OpportunityLoadDetail.competitorTableEle.hasClass('tag-change')) {
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
            data_form['opportunity_competitors_datas'] = list_competitor_data;
        }

        // tab contact role
        if (OpportunityLoadDetail.contactRoleTableEle.hasClass('tag-change')) {
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
            data_form['opportunity_contact_role_datas'] = list_contact_role_data;
        }

        // tab member
        if ($('#card-member').hasClass('tag-change')) {
            let list_member = []
            ele_sale_team_members.each(function () {
                list_member.push({'member': $(this).data('id')});
            })
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
}

class OpportunityActivity {
    static tabLogWork(dataList) {
        let $table = $('#table_log-work')
        if ($table.hasClass('datatable'))
            $table.DataTable().clear().rows.add(dataList).draw();
        else
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
                            let avClass = 'avatar-rounded avatar-xs avatar-' + $x.fn.randomColor()
                            avatar = $x.fn.renderAvatar(data, avClass)
                            return avatar;
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
    };

    static tabSubtask(taskID) {
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
    };

    static displayTaskView(url) {
        if (url)
            $.fn.callAjax2({
                url: url,
                method: 'GET'
            })
                .then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        // enable side panel
                        const $formElm = $('#formOpportunityTask');
                        $('#offCanvasRightTask').offcanvas('show');
                        resetFormTask()
                        $('.title-create').addClass('hidden')
                        $('.title-detail').removeClass('hidden')
                        $('#inputTextTitle').val(data.title)
                        $formElm.find(`input[name="id"]`).remove()
                        $formElm.append(`<input type="hidden" name="id" value="${data.id}">`)
                        $('#inputTextCode').val(data.code)
                        $('#rangeValue').text(data['percent_completed'])
                        $('#percent_completed').val(data['percent_completed'])
                        $('#selectStatus').attr('data-onload', JSON.stringify(data.task_status)).append(
                            `<option value="${data.task_status.id}" selected>${data.task_status.title}</option>`
                        ).trigger('change')
                        $('#inputTextStartDate').val(
                            moment(data.start_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                        )
                        $('#inputTextEndDate').val(
                            moment(data.end_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                        )
                        $('#inputTextEstimate').val(data.estimate)
                        $('#selectPriority').val(data.priority).trigger('change')
                        // render label
                        let htmlElm = $('.label-mark')
                        htmlElm.html('')
                        for (let item of data.label)
                            htmlElm.append($(`<span class="item-tag"><span>${item}</span></span>`))
                        $('#inputAssigner').val(data.employee_created.full_name)
                            .attr('value', data.employee_created.id)

                        const runComponent = (elm, data) => {
                            data.selected = true;
                            elm.attr('data-onload', JSON.stringify(data))
                                .html(`<option value="${data.id}" selected>${data.title}</option>`)
                                .trigger('change')
                        }
                        if (data?.process && data?.['process']?.['id']){
                            runComponent($('#process_id'), data.process)
                        }
                        else if (data?.opportunity && data?.opportunity?.id){
                            runComponent($('#opportunity_id'), data.opportunity)
                        }
                        if (data?.employee_inherit.hasOwnProperty("id")){
                            data.employee_inherit.title = data.employee_inherit.full_name
                            runComponent($('#employee_inherit_id'), data.employee_inherit)
                        }
                        window.editor.setData(data.remark)
                        window.checklist.setDataList = data.checklist
                        window.checklist.render()
                        if (data?.['task_log_work'].length) OpportunityActivity.tabLogWork(data['task_log_work'])
                        if (data?.['sub_task_list']) OpportunityActivity.tabSubtask(data.id)
                        if (data.attach) {
                            const fileDetail = data.attach[0]?.['files']
                            FileUtils.init($(`[name="attach"]`).siblings('button'), fileDetail);
                        }
                        const $btnSub = $('.create-subtask')
                        if (Object.keys(data.parent_n).length > 0) $btnSub.addClass('hidden')
                        else $btnSub.removeClass('hidden')
                    }
                })
    };

    static loadDblActivityLogs() {
        let $table = $('#table-timeline');
        let pk = $.fn.getPkDetail();
        let urlFactory = $('#url-factory');
        let transEle = $('#trans-factory');
        $table.DataTable().clear().destroy()
        $table.DataTableDefault({
            rowIdx: true,
            scrollX: '100vw',
            scrollY: '40vh',
            scrollCollapse: true,
            ajax: {
                url: $table.attr('data-url-logs_list'),
                type: 'GET',
                data: {'opportunity': pk},
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('activity_logs_list')) {
                        return resp.data['activity_logs_list'] ? resp.data['activity_logs_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columnDefs: [],
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
                        let appMapTrans = {
                            'quotation.quotation': transEle.attr('data-trans-quotation'),
                            'saleorder.saleorder': transEle.attr('data-trans-sale-order'),
                            'cashoutflow.advancepayment': transEle.attr('data-trans-advance'),
                            'cashoutflow.payment': transEle.attr('data-trans-payment'),
                            'cashoutflow.returnadvance': transEle.attr('data-trans-return'),
                            'task.opportunitytask': transEle.attr('data-trans-task'),
                            'production.bom': transEle.attr('data-trans-bom'),
                            'bidding.bidding': transEle.attr('data-trans-bidding'),
                            'consulting.consulting': transEle.attr('data-trans-consulting'),
                            'leaseorder.leaseorder': transEle.attr('data-trans-lease-order'),
                            'contract.contractapproval': transEle.attr('data-trans-contract'),
                        }
                        let typeMapActivityIcon = {
                            1: 'fa-solid fa-list-check',
                            2: 'fas fa-phone-volume',
                            3: 'bi bi-envelope-fill',
                            4: 'bi bi-person-workspace',
                        }
                        let typeMapActivity = {
                            1: transEle.attr('data-trans-task'),
                            2: transEle.attr('data-trans-call'),
                            3: transEle.attr('data-trans-email'),
                            4: transEle.attr('data-trans-meeting'),
                        }
                        if ([0, 1].includes(row?.['log_type'])) {
                            if (row?.['app_code']) {
                                return `<span class="badge badge-light badge-outline">${appMapTrans[row?.['app_code']]}</span>`;
                            }
                        } else {
                            let status = '';
                            if (row?.['call_log']['is_cancelled'] || row?.['meeting']['is_cancelled']) {
                                status = `<span class="badge badge-sm badge-icon-xs badge-soft-danger">${transEle.attr('data-trans-activity-cancelled')}</i>`
                            }
                            return `<i class="text-primary ${typeMapActivityIcon[row?.['log_type']]}"></i>  <span class="text-primary small">${typeMapActivity[row?.['log_type']]}</span> ${status}`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if ([0, 1].includes(row?.['log_type'])) {
                            if (row?.['app_code'] && row?.['doc_data']?.['code']) {
                                return `<span class="badge badge-primary">${row?.['doc_data']?.['code']}</span>`;
                            }
                        }
                        return ``;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let urlMapApp = {
                            'quotation.quotation': urlFactory.attr('data-url-quotation-detail'),
                            'saleorder.saleorder': urlFactory.attr('data-url-sale-order-detail'),
                            'cashoutflow.advancepayment': urlFactory.attr('data-url-advance-detail'),
                            'cashoutflow.payment': urlFactory.attr('data-url-payment-detail'),
                            'cashoutflow.returnadvance': urlFactory.attr('data-url-return-detail'),
                            'production.bom': urlFactory.attr('data-url-bom-detail'),
                            'bidding.bidding': urlFactory.attr('data-url-bidding-detail'),
                            'consulting.consulting': urlFactory.attr('data-url-consulting-detail'),
                            'leaseorder.leaseorder': urlFactory.attr('data-url-lease-order-detail'),
                            'contract.contractapproval': urlFactory.attr('data-url-contract-detail'),
                        }
                        let link = '';
                        let title = '';
                        if ([0, 1].includes(row?.['log_type'])) {
                            if (row?.['app_code'] && row?.['doc_data']?.['id'] && row?.['doc_data']?.['title']) {
                                if (urlMapApp[row?.['app_code']]) {
                                    link = urlMapApp[row?.['app_code']].format_url_with_uuid(row?.['doc_data']?.['id']);
                                }
                                let result = `<a href="${link}" target="_blank" class="link-primary underline_hover"><p>${row?.['doc_data']?.['title']}</p></a>`;
                                if (row?.['log_type'] === 1) {
                                    result = `<a href="#" target="" class="link-primary underline_hover"><p class="show-task-detail">${row?.['doc_data']?.['title']}</p></a>`;
                                }
                                return result;
                            } else {
                                return ``;
                            }
                        }
                        if (row?.['log_type'] === 1) {
                            title = row?.['task']?.['subject'];
                            return `<a href="#" class="show-task-detail" data-task-id="${row?.['task']['id']}"><p>${title}</p></a>`;
                        } else if (row?.['log_type'] === 2) {
                            title = row?.['call_log']?.['subject'];
                            return `<a href="#" data-bs-toggle="modal" data-bs-target="#offcanvas-call-log-detail" class="offcanvas-call-log-button-detail text-primary" data-id="${row?.['call_log']['id']}"><p>${title}</p></a>`;
                        } else if (row?.['log_type'] === 3) {
                            title = row?.['email']?.['subject'];
                            return `<a href="#" data-bs-toggle="modal" data-bs-target="#detail-send-email" class="detail-email-button text-primary" data-id="${row?.['email']['id']}"><p>${title}</p></a>`;
                        } else if (row?.['log_type'] === 4) {
                            title = row?.['meeting']?.['subject'];
                            return `<a href="#" data-bs-toggle="modal" data-bs-target="#detail-meeting" class="offcanvas-meeting-button text-primary" data-id="${row?.['meeting']['id']}"><p>${title}</p></a>`;
                        }
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        if (row?.['app_code'] && [0, 1].includes(row?.['log_type'])) {
                            if (row?.['log_type'] === 0 && (row?.['doc_data']?.['system_status'] || row?.['doc_data']?.['system_status'] === 0)) {
                                let sttTxt = JSON.parse($('#stt_sys').text());
                                let sttMapBadge = [
                                    "soft-light",
                                    "soft-primary",
                                    "soft-info",
                                    "soft-success",
                                    "soft-danger",
                                ]
                                return `<span class="badge badge-${sttMapBadge[row?.['doc_data']?.['system_status']]}">${sttTxt[row?.['doc_data']?.['system_status']][1]}</span>`;
                            }
                            if (row?.['log_type'] === 1 && row?.['doc_data']?.['task_status']) {
                                return `<span class="badge badge-soft-pink">${row?.['doc_data']?.['task_status']}</span>`;
                            }
                        }
                        return ``;
                    }
                },
                {
                    targets: 5,
                    className: 'text-right',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['date_created'], {
                            'outputFormat': 'DD/MM/YYYY',
                            'in_row': true
                        })
                    }
                }
            ],
            rowCallback: (row, data, index) => {
                $('.show-task-detail', row).on('click', function () {
                    const taskObj = data?.["doc_data"];
                    OpportunityActivity.displayTaskView($("#url-factory").attr("data-task_detail").format_url_with_uuid(taskObj.id))
                })
            }
        });
    };

    static loadOpenRelateApp(ele, $tableTimeLine) {
        // check permission before redirect
        let transEle = $('#trans-factory');
        if ($(ele).attr('data-label') && $dataDetail.text()) {
            let detail = JSON.parse($dataDetail.text());
            let label = $(ele).attr('data-label');
            let appMapPerm = {
                'quotation.quotation': 'quotation.quotation.create',
                'saleorder.saleorder': 'saleorder.saleorder.create',
                'leaseorder.leaseorder': 'leaseorder.leaseorder.create',
            };
            if (appMapPerm?.[label] && detail?.['id']) {
                let tableData = $tableTimeLine.DataTable().rows().data().toArray();
                $.fn.callAjax2({
                        'url': $('#url-factory').attr('data-url-opp-list'),
                        'method': 'GET',
                        'data': {'list_from_app': appMapPerm[label], 'id': detail?.['id']},
                        isLoading: true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                                if (data.opportunity_list.length === 1) {
                                    // Validate: check opp already has quotation/ sale order
                                    for (let tData of tableData) {
                                        if (label === 'quotation.quotation') {
                                            if (tData?.['app_code'] === 'saleorder.saleorder' && [1, 2, 3].includes(tData?.['doc_data']?.['system_status'])) {
                                                $.fn.notifyB({description: transEle.attr('data-cancel-quo-so')}, 'failure');
                                                return false;
                                            }
                                        }
                                        if (tData?.['app_code'] === label && [1, 2, 3].includes(tData?.['doc_data']?.['system_status'])) {
                                            let errTxt = transEle.attr('data-cancel-quo');
                                            if (label === 'saleorder.saleorder') {
                                                errTxt = transEle.attr('data-cancel-so');
                                            }
                                            $.fn.notifyB({description: errTxt}, 'failure');
                                            return false;
                                        }
                                    }
                                    const paramData = $.param({
                                        'create_open': true,
                                        'opp_id': detail?.['id'],
                                        'opp_title': detail?.['title'],
                                        'opp_code': detail?.['code'],
                                    });
                                    let url = $(ele).data('url') + '?' + paramData;
                                    window.open(url, '_blank');
                                    return true;
                                }
                                $.fn.notifyB({description: transEle.attr('data-forbidden')}, 'failure');
                                return false;
                            }
                        }
                    }
                )
            }
        }
        return true;
    };
}

class LoadConfigAndLoadStage {
    static async loadMemberSaleTeam() {
        if (!$.fn.DataTable.isDataTable('#dtbMember')) {
            let dtb = $('#dtbMember');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                scrollX: '100vw',
                scrollY: '50vh',
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
                        className: 'wrap-text w-5',
                        render: (data, type, row) => {
                            return '';
                        }
                    },
                    {
                        className: 'wrap-text w-45',
                        render: (data, type, row) => {
                            return `<span class="badge badge-soft-primary w-30">${row?.['code']}</span><span class="text-primary ml-2">${row?.['full_name']}</span>`
                        }
                    },
                    {
                        data: 'group',
                        className: 'wrap-text w-40',
                        render: (data) => {
                            return `<span class="badge badge-outline badge-blue">{0}</span>`.format_by_idx(
                                data.title
                            )
                        }
                    },
                    {
                        data: 'is_checked_new',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            if ($('.member-item .card[data-id="' + row.id + '"]').length > 0) {
                                return `<span class="form-check"><input data-id="${row.id}" type="checkbox" class="form-check-input input-select-member" checked readonly disabled /></span>`
                            }
                            return `<span class="form-check"><input data-id="${row.id}" type="checkbox" class="form-check-input input-select-member" ${data === true ? "checked" : ""}/></span>`
                        }
                    },
                ],
                rowCallback: function (row, data) {
                    $(row).find('.input-select-member').on('change', function (){
                        let is_checked = $(this).prop('checked');
                        $x.fn.updateDataRow(this, function (clsThat, rowIdx, rowData) {
                            rowData['is_checked_new'] = is_checked
                            return {
                                ...rowData,
                                is_checked_new: is_checked,
                                idx: rowIdx + 1,
                            }
                        }, false);
                    })
                },
            });
        }
    }

    static callDataConfig(url, method) {
        return $.fn.callAjax2({
            url: url,
            method: method,
        }).then((resp) => {
                return $.fn.switcherResp(resp);
            },
            (errs) => {
                console.log(errs)
            });
    }

    static loadConfigPromise() {
        let url = urlEle.data('url-config');
        let method = 'GET';
        return LoadConfigAndLoadStage.callDataConfig(url, method).then(
            result => {
                return result?.['opportunity_config']
            },
        );
    }

    static autoLoadStage(
        is_load_rate = false,
        just_check = false,
        list_stage_condition,
        list_stage,
        condition_sale_oder_approved,
        condition_quotation_approved,
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
            list_property_config.push({
                'property': 'Customer',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
            let compare_data = '0';
            if (obj_customer.total_employees) {
                compare_data = obj_customer.total_employees;
            }
            list_property_config.push({
                'property': 'Customer',
                'comparison_operator': '=',
                'compare_data': compare_data,
            })
        }
        else {
            list_property_config.push({
                'property': 'Customer',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        }

        let ele_product_category = $('#select-box-product-category option:selected');
        if (ele_product_category.length > 0) {
            list_property_config.push({
                'property': 'Product Category',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }
        else {
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
        }
        else {
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
        }
        else {
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
        }
        else {
            list_property_config.push({
                'property': 'Close Date',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        let ele_decision_maker = $('#input-decision-maker');
        if (ele_decision_maker.attr('data-id') === '') {
            list_property_config.push({
                'property': 'Decision Maker',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        }
        else {
            list_property_config.push({
                'property': 'Decision Maker',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        if (OpportunityLoadDetail.productTableEle.DataTable().data().length === 0) {
            list_property_config.push({
                'property': 'Product Line Detail',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        }
        else {
            list_property_config.push({
                'property': 'Product Line Detail',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        let ele_competitor_win = $('.input-win-deal:checked');
        if (ele_competitor_win.length === 0) {
            list_property_config.push({
                'property': 'Competitor Win',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }
        else {
            list_property_config.push({
                'property': 'Competitor Win',
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
        }
        else {
            list_property_config.push({
                'property': 'Lost By Other Reason',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        if (condition_quotation_approved) {
            list_property_config.push({
                'property': 'Quotation Status',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        }
        else {
            list_property_config.push({
                'property': 'Quotation Status',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        if (condition_sale_oder_approved) {
            list_property_config.push({
                'property': 'SaleOrder Status',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        }
        else {
            list_property_config.push({
                'property': 'SaleOrder Status',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        if (condition_sale_oder_delivery_status) {
            list_property_config.push({
                'property': 'SaleOrder Delivery Status',
                'comparison_operator': '=',
                'compare_data': '0',
            })
        }
        else {
            list_property_config.push({
                'property': 'SaleOrder Delivery Status',
                'comparison_operator': '≠',
                'compare_data': '0',
            })
        }

        let list_property_config_string = []
        for (let i = 0; i < list_property_config.length; i++) {
            let condition_temp = list_property_config[i]
            list_property_config_string.push(
                condition_temp.property + condition_temp.comparison_operator + condition_temp.compare_data
            )
        }

        let id_stage_current = '';
        let list_stage_condition_string = []
        for (let i = 0; i < list_stage_condition.length; i++) {
            let stage_condition_string = []
            for (let j = 0; j < list_stage_condition[i].condition_datas.length; j++) {
                let condition_temp = list_stage_condition[i].condition_datas[j]
                stage_condition_string.push(
                    condition_temp.property + condition_temp.comparison_operator + condition_temp.compare_data
                )
            }
            list_stage_condition_string.push({
                'stage_logic': list_stage_condition[i].logical_operator,
                'stage_id': list_stage_condition[i].id,
                'stage_condition': stage_condition_string,
                'stage_win_rate': dict_stage[list_stage_condition[i].id].win_rate
            })
        }

        let id_stage_current_list = []
        for (let i = 0; i < list_stage_condition_string.length; i++) {
            if (list_stage_condition_string[i]?.['stage_logic'] === 0) {
                let flag= true
                for (let j = 0; j < list_stage_condition_string[i]?.['stage_condition'].length; j++) {
                    if (!list_property_config_string.includes(list_stage_condition_string[i]?.['stage_condition'][j])) {
                        flag = false
                    }
                }
                if (flag) {
                    id_stage_current_list.push({
                        'stage_id': list_stage_condition_string[i].stage_id,
                        'stage_win_rate': list_stage_condition_string[i].stage_win_rate,
                    })
                }
            }
            else {
                let flag= false
                for (let j = 0; j < list_stage_condition_string[i]?.['stage_condition'].length; j++) {
                    if (list_property_config_string.includes(list_stage_condition_string[i]?.['stage_condition'][j])) {
                        flag = true
                        break
                    }
                }
                if (flag) {
                    id_stage_current_list.push({
                        'stage_id': list_stage_condition_string[i].stage_id,
                        'stage_win_rate': list_stage_condition_string[i].stage_win_rate,
                    })
                }
            }
        }
        if (id_stage_current_list.length > 0) {
            id_stage_current_list = id_stage_current_list.sort((a, b) => b.stage_win_rate - a.stage_win_rate);
            id_stage_current = id_stage_current_list[0].stage_id
        }

        let closed_lost_filter = list_stage.filter(function (ele) {
            return ele?.['indicator'] === "Closed Lost"
        })
        let closed_lost_config = closed_lost_filter.length > 0 ? closed_lost_filter[0] : null
        let closed_lost_condition_list = []
        let is_lost = false
        if (closed_lost_config) {
            for (const item of closed_lost_config?.['condition_datas']) {
                closed_lost_condition_list.push(item?.['condition_property']?.['title'] + item?.['comparison_operator'] + item?.['compare_data'])
            }
            if (closed_lost_config?.['logical_operator']) { // or
                for (let i = 0; i < closed_lost_condition_list.length; i++) {
                    if (list_property_config_string.includes(closed_lost_condition_list[i])) {
                        is_lost = true;
                        break;
                    }
                }
            }
            else { // and
                let bMap = {};
                list_property_config_string.forEach(item => {
                    bMap[item] = true;
                });
                is_lost = closed_lost_condition_list.every(item => bMap[item]);
            }
        }

        if (!just_check) {
            let stage_selected_ele = $('.stage-selected');
            let input_rate_ele = $('#check-input-rate');
            let ele_close_deal = $('#input-close-deal');
            let ele_stage = $(`.sub-stage`);
            if (id_stage_current === '') {
                id_stage_current = $('#div-stage').find('div:first-child').attr('data-id');
            }
            let ele_stage_current = $(`.sub-stage[data-id="${id_stage_current}"]`);
            let index = ele_stage_current.index() - (ele_stage_current.index()/2);
            if (ele_stage_current.hasClass('stage-lost')) {
                ele_stage_current.addClass('stage-selected');
                ele_stage.removeClass('stage-selected');
                ele_stage.css('background-color', '#e7e7e7')
                ele_stage.css('color', '#6f6f6f')
                ele_stage.find('.dropdown span').css('color', '#6f6f6f')
                ele_stage.next().css('border-left', '16px solid #e7e7e7')
            }
            else {
                for (let i = 0; i <= ele_stage.length; i++) {
                    if (i <= index) {
                        if (!ele_stage.eq(i).hasClass('stage-lost')) {
                            ele_stage.eq(i).addClass('stage-selected');
                            ele_stage.eq(i).css('background-color', '#0070D2')
                            ele_stage.eq(i).css('color', 'white')
                            ele_stage.eq(i).find('.dropdown span').css('color', 'white')
                            ele_stage.eq(i).next().css('border-left', '16px solid #0070D2')
                        }
                        else {
                            ele_stage.eq(i).removeClass('stage-selected');
                            ele_stage.eq(i).css('background-color', '#e7e7e7')
                            ele_stage.eq(i).css('color', '#6f6f6f')
                            ele_stage.eq(i).find('.dropdown span').css('color', '#6f6f6f')
                            ele_stage.eq(i).next().css('border-left', '16px solid #e7e7e7')
                        }
                    } else {
                        ele_stage.eq(i).removeClass('stage-selected');
                        ele_stage.eq(i).css('background-color', '#e7e7e7')
                        ele_stage.eq(i).css('color', '#6f6f6f')
                        ele_stage.eq(i).find('.dropdown span').css('color', '#6f6f6f')
                        ele_stage.eq(i).next().css('border-left', '16px solid #e7e7e7')
                    }
                }
            }

            if (ele_close_deal.is(':checked')) {
                ele_stage_current = ele_close_deal.closest('.sub-stage');
                ele_close_deal.closest('.sub-stage').addClass('stage-selected');
                ele_close_deal.closest('.sub-stage').css('background-color', '#0070D2')
                ele_close_deal.closest('.sub-stage').css('color', 'white')
                ele_close_deal.closest('.sub-stage').find('.dropdown span').css('color', 'white')
                ele_close_deal.closest('.sub-stage').next().css('border-left', '16px solid #0070D2')
                $('.page-content input, .page-content select, .page-content .btn').not(ele_close_deal).not($('#rangeInput')).prop('disabled', true);
                if (!config_is_input_rate) {
                    input_rate_ele.prop('disabled', true);
                    $('#input-rate').prop('disabled', true);
                }
            }
            else {
                $('.page-content input, .page-content select, .page-content .btn').prop('disabled', false);
                ele_close_deal.closest('.sub-stage').removeClass('stage-selected');
                ele_close_deal.closest('.sub-stage').css('background-color', '#e7e7e7')
                ele_close_deal.closest('.sub-stage').css('color', '#6f6f6f')
                ele_close_deal.closest('.sub-stage').find('.dropdown span').css('color', '#6f6f6f')
                ele_close_deal.closest('.sub-stage').next().css('border-left', '16px solid #e7e7e7')
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

            if (!input_rate_ele.is(':checked') && is_load_rate) {
                let obj_stage = dict_stage[ele_stage_current.data('id')]
                if (ele_stage_current.hasClass('stage-close'))
                    obj_stage = dict_stage[stage_selected_ele.not(ele_stage_current).last().data('id')];
                $('#input-rate').val(obj_stage?.win_rate);
                $('#rangeInput').val(obj_stage?.win_rate);
            }
        }

        return is_lost
    }

    static sortStage(list_stage) {
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
        if (delivery) {
            list_result.push(delivery);
        }
        list_result.push(object_close);

        return list_result
    }
}

class InitDataTables {
    static loadDtbOpportunityList() {
        if (!$.fn.DataTable.isDataTable('#table_opportunity_list-purchase-request')) {
            let $table = $('#table_opportunity_list')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '70vh',
                scrollCollapse: true,
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
                        className: 'wrap-text w-5',
                        render: () => {
                            return ``
                        }
                    },
                    {
                        targets: 1,
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            const link = $('#opportunity-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}"><span class="badge badge-primary">${row?.['code']}</span></a>`
                        }
                    },
                    {
                        targets: 2,
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            const link = $('#opportunity-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}"><span class="fw-bold text-primary">${row?.['title']}</span></a>`
                        }
                    },
                    {
                        targets: 3,
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            return `<span class="text-muted">${row?.['customer']?.['title']}</span>`
                        }
                    },
                    {
                        targets: 4,
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<span class="text-blue">${row?.['sale_person']?.['full_name']}</span>`
                        }
                    },
                    {
                        targets: 5,
                        className: 'wrap-text w-10',
                        data: "open_date",
                        render: (data, type, row) => {
                            return data !== null && data !== undefined ? $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                                callback: function (data) {
                                    return `<p>${data?.['relate']}</p><small>${data?.['output']}</small>`;
                                }
                            }) : "_";
                        }
                    },
                    {
                        targets: 6,
                        className: 'wrap-text w-10',
                        data: "close_date",
                        render: (data, type, row) => {
                            return data !== null && data !== undefined ? $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                                callback: function (data) {
                                    return `<p>${data?.['relate']}</p><small>${data?.['output']}</small>`;
                                }
                            }) : "_";
                        }
                    },
                    {
                        targets: 7,
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            let stage_current;
                            stage_current = row?.['stage'].find(function (obj) {
                                return obj?.['is_current'] === true;
                            });
                            return `<span class="${stage_current?.['win_rate'] === 100 ? 'text-gold' : 'text-secondary'}">${stage_current?.['indicator']} (${stage_current?.['win_rate']}%)</span>${stage_current?.['win_rate'] === 100 ? '&nbsp;<i class="bi bi-trophy-fill text-gold"></i>' : ''}`
                        }
                    },
                ],
            });
        }
    }

    static loadDtbProduct(data=[]) {
        if (!$.fn.DataTable.isDataTable('#table-products')) {
            let dtb = OpportunityLoadDetail.productTableEle;
            dtb.DataTableDefault({
                dom: 't',
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                scrollX: '100vw',
                scrollY: '25vh',
                scrollCollapse: true,
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
                            if (data) {
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
                            return `<select class="form-select box-select-uom" data-method="GET" data-url="${urlEle.data('url-uom')}" data-keyResp="unit_of_measure" required></select>`
                        }
                    },
                    {
                        data: 'product_quantity',
                        className: 'wrap-text',
                        render: (data) => {
                            return `<input type="number" class="form-control input-quantity" value="{0}" required/>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'product_unit_price',
                        className: 'wrap-text',
                        render: (data) => {
                            return `<input type="text" class="form-control mask-money input-unit-price" data-return-type="number" value="{0}" required/>`.format_by_idx(
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
                            return `<input class="form-control mask-money input-subtotal" type="text" data-return-type="number" value="{0}" readonly required>`.format_by_idx(
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

    static loadDtbCompetitor(data=[]) {
        if (!$.fn.DataTable.isDataTable('#table-competitors')) {
            let dtb = OpportunityLoadDetail.competitorTableEle;
            dtb.DataTableDefault({
                dom: 't',
                rowIdx: true,
                data: data,
                paging: false,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                columns: [
                    {
                        className: 'wrap-text',
                        render: () => {
                            return ``
                        }
                    },
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
                                return `<div class="form-check"><input checked type="checkbox" class="form-check-input input-win-deal"></div>`
                            } else {
                                return `<div class="form-check"><input type="checkbox" class="form-check-input input-win-deal"></div>`
                            }
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

    static loadDtbContactRole(data=[]) {
        if (!$.fn.DataTable.isDataTable('#table-contact-role')) {
            let dtb = OpportunityLoadDetail.contactRoleTableEle;
            dtb.DataTableDefault({
                dom: 't',
                rowIdx: true,
                data: data,
                paging: false,
                scrollX: '100vw',
                scrollY: '25vh',
                scrollCollapse: true,
                columns: [
                    {
                        className: 'wrap-text',
                        render: () => {
                            return ``
                        }
                    },
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
}

class OpportunityLoadPage {
    static loadLeadList() {
        if (!$.fn.DataTable.isDataTable('#lead-list-table')) {
            let dtb = $('#lead-list-table');
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                scrollX: '100vw',
                scrollY: '40vh',
                scrollCollapse: true,
                ajax: {
                    url: dtb.attr('data-url') + `?opp_id=${$.fn.getPkDetail()}`,
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('lead_list')) {
                            return resp.data['lead_list'] ? resp.data['lead_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['lead'].id);
                            return `<a href="${link}"><span class="badge badge-soft-primary w-70">${row?.['lead'].code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row?.['lead'].id);
                            return `<a href="${link}">${row?.['lead']?.['title']}</a>`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `<span class="badge badge-sm badge-primary">${row?.['lead']?.['source']}</span>`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `${row?.['lead']?.['contact_name']}`;
                        }
                    },
                    {
                        'render': (data, type, row) => {
                            return `${moment(row?.['lead']?.['date_created'].split(' ')[0]).format('DD/MM/YYYY')}`;
                        }
                    },
                ],
            });
        }
    }

    static push_param_to_url(url, params = {}) {
        const [baseUrl, queryString] = url.split('?');
        const currentParams = new URLSearchParams(queryString);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                currentParams.set(key, params[key]);
            }
        });
        return `${baseUrl}?${currentParams.toString()}`;
    }

    static checkPermissionAppRelated() {
        const urlFactory = $('#url-factory');

        const quotation_check_perm = $.fn.callAjax2({
            url: urlFactory.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'quotation.quotation.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const sale_order_check_perm = $.fn.callAjax2({
            url: urlFactory.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'saleorder.saleorder.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const advance_check_perm = $.fn.callAjax2({
            url: urlFactory.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'cashoutflow.advancepayment.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const payment_check_perm = $.fn.callAjax2({
            url: urlFactory.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'cashoutflow.payment.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const bom_check_perm = $.fn.callAjax2({
            url: urlFactory.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'production.bom.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const biding_check_perm = $.fn.callAjax2({
            url: urlFactory.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'bidding.bidding.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        const consulting_check_perm = $.fn.callAjax2({
            url: urlFactory.attr('data-url-opp-list'),
            data: {
                'list_from_app': 'consulting.consulting.create', 'id': $.fn.getPkDetail()
            },
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list) && data?.['opportunity_list'].length === 1) {
                        return data?.['opportunity_list'][0];
                    }
                    return null
                }
            },
            (errs) => {
                console.log(errs);
            }
        )
        let create_return_sc = $('#create-return-advance-shortcut')
        create_return_sc.attr('href', create_return_sc.attr('data-url'))

        Promise.all([quotation_check_perm, sale_order_check_perm, advance_check_perm, payment_check_perm, bom_check_perm, biding_check_perm, consulting_check_perm]).then(
            (results_perm_app) => {
                if (results_perm_app[0]) {
                    let create_quotation_sc = $('#create-quotation-shortcut')
                    create_quotation_sc.removeClass('disabled');
                    create_quotation_sc.removeAttr('href');
                }
                if (results_perm_app[1]) {
                    let create_so_sc = $('#create-sale-order-shortcut')
                    create_so_sc.removeClass('disabled');
                    create_so_sc.removeAttr('href');
                }
                if (results_perm_app[2]) {
                    let create_ap_sc = $('#create-advance-payment-shortcut')
                    create_ap_sc.removeClass('disabled');
                    let param_url = OpportunityLoadPage.push_param_to_url(create_ap_sc.attr('data-url'), {
                        'from_opp': true,
                        'opp_id': results_perm_app[2]?.['id'],
                        'opp_code': results_perm_app[2]?.['code'],
                        'opp_title': results_perm_app[2]?.['title'],
                        'quotation_object': encodeURIComponent(JSON.stringify(results_perm_app[2]?.['quotation'])),
                        'sale_order_object': encodeURIComponent(JSON.stringify(results_perm_app[2]?.['sale_order'])),
                    })
                    create_ap_sc.attr('href', param_url)
                }
                if (results_perm_app[3]) {
                    let create_payment_sc = $('#create-payment-shortcut')
                    create_payment_sc.removeClass('disabled');
                    let param_url = OpportunityLoadPage.push_param_to_url(create_payment_sc.attr('data-url'), {
                        'from_opp': true,
                        'opp_id': results_perm_app[3]?.['id'],
                        'opp_code': results_perm_app[3]?.['code'],
                        'opp_title': results_perm_app[3]?.['title'],
                        'quotation_object': encodeURIComponent(JSON.stringify(results_perm_app[3]?.['quotation'])),
                        'sale_order_object': encodeURIComponent(JSON.stringify(results_perm_app[3]?.['sale_order'])),
                    })
                    create_payment_sc.attr('href', param_url)
                }
                if (results_perm_app[4]) {
                    let create_bom_sc = $('#create-project-bom-shortcut')
                    create_bom_sc.removeClass('disabled');
                    let param_url = OpportunityLoadPage.push_param_to_url(create_bom_sc.attr('data-url'), {
                        'from_opp': true,
                        'opp_id': results_perm_app[4]?.['id'],
                        'opp_code': results_perm_app[4]?.['code'],
                        'opp_title': results_perm_app[4]?.['title'],
                        'sale_person_mapped': encodeURIComponent(JSON.stringify(results_perm_app[4]?.['sale_person'])),
                    })
                    create_bom_sc.attr('href', param_url)
                }
                if (results_perm_app[5]) {
                    let create_bidding_sc = $('#create-bidding-shortcut')
                    create_bidding_sc.removeClass('disabled');
                    let param_url = OpportunityLoadPage.push_param_to_url(create_bidding_sc.attr('data-url'), {
                        'opp_id': results_perm_app[5]?.['id'],
                        'opp_code': results_perm_app[5]?.['code'],
                        'opp_title': results_perm_app[5]?.['title'],
                        'inherit_id': results_perm_app[5]?.['sale_person']?.['id'],
                        'inherit_title': results_perm_app[5]?.['sale_person']?.['full_name'],
                        'customer': encodeURIComponent(JSON.stringify(results_perm_app[5]?.['customer'])),
                    })
                    create_bidding_sc.attr('href', param_url)
                }
                if (results_perm_app[6]) {
                    let create_consulting_sc = $('#create-consulting-shortcut')
                    create_consulting_sc.removeClass('disabled');
                    let param_url = this.push_param_to_url(create_consulting_sc.attr('data-url'), {
                        'opp_id': results_perm_app[6]?.['id'],
                        'opp_code': results_perm_app[6]?.['code'],
                        'opp_title': results_perm_app[6]?.['title'],
                        'inherit_id': results_perm_app[6]?.['sale_person']?.['id'],
                        'inherit_title': results_perm_app[6]?.['sale_person']?.['full_name'],
                        'customer': encodeURIComponent(JSON.stringify(results_perm_app[6]?.['customer'])),
                    })
                    create_consulting_sc.attr('href', param_url)
                }
                $('#btn-create-related-feature').attr('data-call-check-perm', 'true')
            })
    }

    static getDataMemberAddNew() {
        return $('#dtbMember').DataTable().data().filter((item) => item.is_checked_new === true).map((item) => item.id).toArray();
    }

    static loadWinRate(dict_stage, checkInputRateEle, inputRateEle, rangeInputEle) {
        let ele_deal_close = $('.stage-close');
        let win_rate = dict_stage[$('.stage-selected').not(ele_deal_close).last().data('id')].win_rate;
        if (!checkInputRateEle.is(':checked')) {
            inputRateEle.val(win_rate);
            rangeInputEle.val(win_rate);
        }
    }
}