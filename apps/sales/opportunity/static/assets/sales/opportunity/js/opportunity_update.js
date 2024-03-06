$(document).ready(function () {
    let trans_script = $('#trans-script')
    let eleFrmPermit = $('#permit-member');
    $(document).on('click', '#btnOpenPermit', function () {
        eleFrmPermit.removeClass('hidden');
        document.getElementById('permit-member').scrollIntoView({
            behavior: 'smooth'
        });
    });

    const urlFactory = $('#url-factory');
    let transEle = $('#trans-factory');
    const pk = $.fn.getPkDetail();
    const frmDetail = $('#frm-detail');
    // element
    const rangeInputEle = $('#rangeInput');
    const checkInputRateEle = $('#check-input-rate');
    const inputRateEle = $('#input-rate');

    // variable for auto select stage
    let condition_is_quotation_confirm = false;
    let condition_sale_oder_approved = false;
    let condition_sale_oder_delivery_status = false;

    // Stage
    let list_stage = [];
    let dict_stage = {};

    // load input date time
    OpportunityLoadDetail.configDateTimeEle()

    // Promise.all

    let prm_config = $.fn.callAjax2({
        url: urlFactory.data('url-config'),
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_config')) {
                return data['opportunity_config'];
            }
            return {};
        },
        (errs) => {}
    )

    let prm_detail = $.fn.callAjax2({
        url: frmDetail.data('url'),
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('opportunity')) {
                loadPermitEmpty();
                return data?.['opportunity'];
            }
            return {};
        },
        (errs) => {}
    )

    let list_stage_condition = []
    let config_is_input_rate = null;
    $x.fn.showLoadingPage()
    Promise.all([prm_detail, prm_config]).then(
        (results) => {
            $x.fn.hideLoadingPage();
            const opportunity_detail_data = results[0];

            const config = results[1];
            const config_is_select_stage = config.is_select_stage;
            const config_is_AM_create = config.is_account_manager_create;
            config_is_input_rate = config.is_input_win_rate;
            if (config_is_select_stage) {
                $('#btn-auto-update-stage').hide();
            }
            let paramString = {}

            $('#estimated-gross-profit-percent').val(opportunity_detail_data?.['estimated_gross_profit_percent'])
            $('#estimated-gross-profit-value').attr('value', opportunity_detail_data?.['estimated_gross_profit_value'])

            async function loadDetail(opportunity_detail) {
                $x.fn.renderCodeBreadcrumb(opportunity_detail);

                paramString = {
                    'id': opportunity_detail.id,
                    'code': opportunity_detail.code,
                    'title': opportunity_detail.title,
                    'sale_person': opportunity_detail.sale_person,
                }
                let stage_obj = await OpportunityLoadDetail.loadDetailCommon(opportunity_detail);
                list_stage = stage_obj.list;
                dict_stage = stage_obj.dict;

                if (config_is_input_rate) {
                    let ele_check = checkInputRateEle;
                    ele_check.prop('disabled', false);
                    if (ele_check.is(':checked')) {
                        inputRateEle.prop('readonly', false);
                    }
                } else {
                    let ele_check = checkInputRateEle;
                    ele_check.prop('checked', false);
                    ele_check.prop('disabled', true);
                }

                if (opportunity_detail.lost_by_other_reason) {
                    $('#check-lost-reason').prop('checked', true);
                } else
                    $('#check-lost-reason').prop('checked', false);

                $('#input-budget').attr('value', opportunity_detail.budget_value);

                OpportunityLoadDropdown.loadCustomer(opportunity_detail.customer, config_is_AM_create, opportunity_detail?.['sale_person'].id);
                OpportunityLoadDropdown.loadProductCategory(opportunity_detail.product_category);

                OpportunityLoadDropdown.loadSalePersonPageDetail(opportunity_detail?.['sale_person']);
                OpportunityLoadDropdown.loadEndCustomer(opportunity_detail.end_customer, opportunity_detail.customer.id);

                // load table product
                loadDtbProduct([]);
                let table_product = OpportunityLoadDetail.productTableEle;
                OpportunityLoadDetail.loadDetailTableProduct(table_product, opportunity_detail);

                $('#input-product-pretax-amount').attr('value', opportunity_detail.total_product_pretax_amount);
                $('#input-product-taxes').attr('value', opportunity_detail.total_product_tax);
                $('#input-product-total').attr('value', opportunity_detail.total_product);

                // load competitor
                loadDtbCompetitor([]);
                let table_competitor = OpportunityLoadDetail.competitorTableEle;
                OpportunityLoadDetail.loadDetailTableCompetitor(table_competitor, opportunity_detail)

                // load table contact role
                loadDtbContactRole([]);
                let table_contact_role = OpportunityLoadDetail.contactRoleTableEle;
                OpportunityLoadDetail.loadDetailTableContactRole(table_contact_role, opportunity_detail);
                OpportunityLoadDropdown.loadFactor($('#box-select-factor'), opportunity_detail.customer_decision_factor);

                // load sale team
                OpportunityLoadDetail.loadSaleTeam(opportunity_detail.members, true, opportunity_detail?.['sale_person'] || {});

                if ($.fn.hasOwnProperties(opportunity_detail, ['sale_order'])) {
                    let so_id = opportunity_detail.sale_order.id;
                    let link = so_id !== undefined ? urlEle.data('url-related-sale-order').format_url_with_uuid(so_id) : '#';
                    $('#item-related-sale-order').attr('href', link)
                    if (opportunity_detail.sale_order.system_status === 3) {
                        condition_sale_oder_approved = true;
                        if ($.fn.hasOwnProperties(opportunity_detail.sale_order, ['delivery'])) {
                            condition_sale_oder_delivery_status = true;
                        }
                    }
                }

                if ($.fn.hasOwnProperties(opportunity_detail, ['quotation'])) {
                    let quotation_id = opportunity_detail.quotation.id;
                    let link = quotation_id !== undefined ? urlEle.data('url-related-quotation').format_url_with_uuid(quotation_id) : '#';
                    $('#item-related-quotation').attr('href', link)
                    if (opportunity_detail.quotation.is_customer_confirm === true) {
                        condition_is_quotation_confirm = true;
                    }
                }
                $.fn.initMaskMoney2();
            }

            loadDetail(opportunity_detail_data).then(function () {
                autoLoadStage(
                    true,
                    false,
                    list_stage_condition,
                    list_stage,
                    condition_sale_oder_approved,
                    condition_is_quotation_confirm,
                    condition_sale_oder_delivery_status,
                    config_is_input_rate,
                    dict_stage
                )
            });

            // even in tab product

            $('#btn-add-select-product').on('click', function () {
                OpportunityLoadDetail.addRowSelectProduct();
            })

            $('#btn-add-input-product').on('click', function () {
                OpportunityLoadDetail.addRowInputProduct()
            })

            OpportunityLoadDropdown.productCategorySelectEle.on('select2:unselect', function (e) {
                let removedOption = e.params.data;
                let table = $('#table-products');
                $(`.box-select-product-category option[value="${removedOption.id}"]:selected`).closest('tr').each(function () {
                    table.DataTable().row($(this).index()).remove().draw();
                })
                table.addClass('tag-change');
                $(`.box-select-product-category option[value="${removedOption.id}"]`).remove();
                OpportunityLoadDetail.getTotalPrice();
                table.find('.select-box-product').each(function () {
                    let optionSelected = $(this).find('option:selected');
                    OpportunityLoadDropdown.loadProduct(
                        $(this),
                        {
                            'id': optionSelected.val(),
                            'title': optionSelected.text()
                        },
                        OpportunityLoadDropdown.productCategorySelectEle.val()
                    );
                })
            });

            OpportunityLoadDropdown.productCategorySelectEle.on('select2:select', function () {
                let table = $('#table-products');
                table.find('.select-box-product').each(function () {
                    let optionSelected = $(this).find('option:selected');
                    OpportunityLoadDropdown.loadProduct(
                        $(this),
                        {
                            'id': optionSelected.val(),
                            'title': optionSelected.text()
                        },
                        OpportunityLoadDropdown.productCategorySelectEle.val()
                    );
                })
            });

            $(document).on('change', '.select-box-product', function () {
                let ele_tr = $(this).closest('tr');
                let product = SelectDDControl.get_data_from_idx($(this), $(this).val());
                ele_tr.find(`.input-product-name`).attr('value', product.title)

                let [product_category_ele, uom_ele, tax_ele] = [ele_tr.find(`.box-select-product-category`), ele_tr.find(`.box-select-uom`), ele_tr.find(`.box-select-tax`)];
                product_category_ele.empty();
                uom_ele.empty();
                tax_ele.empty();

                OpportunityLoadDropdown.loadSubProductCategory(
                    product_category_ele,
                    product?.['general_information'].product_category,
                    OpportunityLoadDropdown.productCategorySelectEle.val(),
                )

                OpportunityLoadDropdown.loadUoM(
                    uom_ele,
                    product?.['sale_information']?.['default_uom'],
                    product,
                )

                OpportunityLoadDropdown.loadTax(
                    tax_ele,
                    product?.['sale_information'].tax_code,
                )
            })

            $(document).on('change', '.input-unit-price', function () {
                let price = $(this).valCurrency();
                let ele_parent = $(this).closest('tr');
                let quantity = ele_parent.find('.input-quantity').val();
                let subtotal = price * quantity;
                ele_parent.find('.input-subtotal').attr('value', subtotal);
                OpportunityLoadDetail.getTotalPrice();
            })

            $(document).on('change', '.input-quantity', function () {
                let quantity = $(this).val();
                if (quantity < 0) {
                    $.fn.notifyB({description: transEle.data('trans-limit-quantity')}, 'failure');
                    $(this).val(0);
                    quantity = 0;
                }
                let ele_parent = $(this).closest('tr');
                let price = ele_parent.find('.input-unit-price').valCurrency();
                let subtotal = price * quantity;
                ele_parent.find('.input-subtotal').attr('value', subtotal);
                OpportunityLoadDetail.getTotalPrice();
            })

            $(document).on('change', '.box-select-tax', function () {
                let ele_parent = $(this).closest('tr');
                let quantity = ele_parent.find('.input-quantity').val();
                let price = ele_parent.find('.input-unit-price').valCurrency();
                let subtotal = price * quantity;
                ele_parent.find('.input-subtotal').attr('value', subtotal);

                OpportunityLoadDetail.getTotalPrice();
            })

            // event in tab competitor

            $('#btn-add-competitor').on('click', function () {
                OpportunityLoadDetail.addRowCompetitor()
            })

            $(document).on('change', '.input-win-deal', function () {
                if ($(this).is(':checked')) {
                    if (checkOppWonOrDelivery()) {
                        $(this).prop('checked', false);
                        OpportunityLoadDetail.renderAlert(transEle.data('trans-opp-win-deal'));
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
                OpportunityLoadDetail.addRowContactRole();
            })

            $(document).on('change', '#select-box-end-customer', function () {
                let table = $('#table-contact-role');
                table.addClass('tag-change');

                table.find('.box-select-type-customer option[value="1"]:selected').closest('tr').each(function () {
                    table.addClass('tag-change');
                    table.DataTable().row($(this).index()).remove().draw();
                });
            })

            $(document).on('change', '#select-box-customer', function () {
                let table = $('#table-contact-role');
                table.find('.box-select-type-customer option[value="0"]:selected').closest('tr').each(function () {
                    table.addClass('tag-change');
                    table.DataTable().row($(this).index()).remove().draw();
                });
            })

            $(document).on('change', '.box-select-type-customer', function () {
                let box_select_contact = $(this).closest('tr').find('.box-select-contact');
                $(this).closest('tr').find('.input-job-title').val('');
                if ($(this).val() === '0') {
                    OpportunityLoadDropdown.loadContact(box_select_contact, {}, OpportunityLoadDropdown.customerSelectEle.val());
                } else {
                    OpportunityLoadDropdown.loadContact(box_select_contact, {}, OpportunityLoadDropdown.endCustomerSelectEle.val());
                }
            })

            $(document).on('change', '.box-select-contact', function () {
                let contact_data = SelectDDControl.get_data_from_idx($(this), $(this).val());
                $(this).closest('tr').find('.input-job-title').val(contact_data.job_title);

                if ($(this).closest('tr').find('.box-select-role option:selected').val() === '0') {
                    let ele_decision_maker = $('#input-decision-maker');
                    ele_decision_maker.val($(this).find('option:selected').text());
                    ele_decision_maker.attr('data-id', $(this).val());
                }
            })

            $(document).on('change', '.box-select-role', function () {
                OpportunityLoadDetail.onChangeContactRole($(this));
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

            checkInputRateEle.on('change', function () {
                if ($(this).is(':checked')) {
                    inputRateEle.prop('readonly', false);
                } else {
                    inputRateEle.prop('readonly', true);
                }
            })

            rangeInputEle.on('mousedown', function () {
                return false;
            });

            inputRateEle.on('change', function () {
                let value = $(this).val();
                if (value < 0 || value > 100) {
                    $.fn.notifyB({description: $('#limit-rate').text()}, 'failure');
                    $(this).val(0);
                } else {
                    rangeInputEle.val($(this).val());
                }
            })

            $(document).on('click', '.btn-del-item', function () {
                OpportunityLoadDetail.delRowTable($(this));
            })

            // tab add member for sale

            $('#btn-show-modal-add-member').on('click', function () {
                OpportunityLoadDetail.loadMemberForDtb().then();
            })

            $('.mask-money').on('change', function () {
                if ($(this).valCurrency() < 0) {
                    $.fn.notifyB({description: transEle.data('trans-limit-money')}, 'failure');
                    $(this).attr('value', 0);
                    $.fn.initMaskMoney2();
                }
            })

            $('#input-close-date').on('change', function () {
                let open_date = $('#input-open-date').val();
                if ($(this).val() < open_date) {
                    $.fn.notifyB({description: $('#limit-close-date').text()}, 'failure');
                    $(this).val(open_date);
                }
            })

            $('#input-rate').on('focus', function () {
                if ($(this).val() === '0') {
                    $(this).val('');
                }
            });

            $(document).on('click', '.btn-go-to-stage', function () {
                if (config_is_select_stage) {
                    if ($('#input-close-deal').is(':checked')) {
                        OpportunityLoadDetail.renderAlert($('#deal-closed').text());
                    } else {
                        if ($('#check-lost-reason').is(':checked') || $('.input-win-deal:checked').length > 0) {
                            OpportunityLoadDetail.renderAlert($('#deal-close-lost').text());
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
                    OpportunityLoadDetail.renderAlert($('#not-select-stage').text());
                }
            })

            function loadWinRate() {
                let ele_deal_close = $('.stage-close');
                let win_rate = dict_stage[$('.stage-selected').not(ele_deal_close).last().data('id')].win_rate;
                if (!checkInputRateEle.is(':checked')) {
                    inputRateEle.val(win_rate);
                    rangeInputEle.val(win_rate);
                }
            }

            $('#check-lost-reason').on('change', function () {
                let ele_stage_lost = $('.stage-lost')
                if (!$(this).is(':checked')) {
                    ele_stage_lost.removeClass('bg-red-light-5 stage-selected');
                    loadWinRate();
                } else {
                    if (checkOppWonOrDelivery()) {
                        $(this).prop('checked', false);
                        OpportunityLoadDetail.renderAlert(transEle.data('trans-opp-win-deal'));
                    } else {
                        $('.input-win-deal').not(this).prop('checked', false);
                        ele_stage_lost.addClass('bg-red-light-5 stage-selected');
                        loadWinRate();
                    }
                }
            })


            $('#btn-auto-update-stage').on('click', function () {
                autoLoadStage(
                    true,
                    false,
                    list_stage_condition,
                    list_stage,
                    condition_sale_oder_approved,
                    condition_is_quotation_confirm,
                    condition_sale_oder_delivery_status,
                    config_is_input_rate,
                    dict_stage
                );
                $.fn.notifyB({description: "Stage has just updated!"}, 'success')
                $(this).tooltip('hide');
            })

            $(document).on('change', '#input-close-deal', function () {
                if ($(this).is(':checked')) {
                    $(this).closest('.sub-stage').addClass('bg-primary-light-5 stage-selected');
                    $('.page-content input, .page-content select, .page-content .btn').not($(this)).not($('#rangeInput')).prop('disabled', true);
                } else {
                    $(this).closest('.sub-stage').removeClass('bg-primary-light-5 stage-selected');
                    $('.page-content input, .page-content select, .page-content .btn').not($(this)).not($('#rangeInput')).prop('disabled', false);
                    if ($('#check-agency-role').is(':checked')) {
                        $('#select-box-end-customer').prop('disabled', false);
                    } else {
                        $('#select-box-end-customer').prop('disabled', true);
                    }
                }
                loadWinRate();
            })

            function checkOppWonOrDelivery() {
                let check = false;
                let stage_id = $('.stage-selected').last().data('id');
                let indicator = dict_stage[stage_id].indicator;
                if (indicator === 'Closed Won' || indicator === 'Delivery') {
                    check = true;
                }
                return check;
            }

            $('.item-detail-related-feature').on('click', function () {
                if ($(this).attr('href') === '#') {
                    $(this).removeAttr('target');
                    OpportunityLoadDetail.renderAlert(`${$(this).text()} ${transEle.data('trans-not-created')}`);
                }
            })

            function getDataMemberAddNew(){
                return $('#dtbMember').DataTable().data().filter((item) => item.is_checked_new === true).map((item)=> item.id).toArray();
            }

            const frm_add_member = $('#frm-add-member');
            SetupFormSubmit.validate(
                frm_add_member,
                {
                    submitHandler: function (form) {
                        let frm = new SetupFormSubmit($(form));
                        let memberIds = getDataMemberAddNew();
                        $.fn.callAjax2({
                            sweetAlertOpts: {'allowOutsideClick': true},
                            url: frm.dataUrl.replaceAll('__pk_opp__', pk),
                            method: frm.dataMethod,
                            data: {
                                'members': memberIds,
                            },
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                                    setTimeout(
                                        () => {
                                            window.location.reload();
                                        },
                                        1000
                                    )

                                    // OpportunityLoadDetail.reloadMemberList(pk);
                                    // $('#modalAddMember').modal('hide');
                                }
                                $x.fn.hideLoadingPage();
                            },
                            (errs) => {
                                $.fn.switcherResp(errs);
                                $x.fn.hideLoadingPage();
                            }
                        )
                    }
                }
            )

            // // toggle action and activity

            toggleShowActivity()

            // for call log

            let table_timeline = $('#table-timeline');

            let call_log_Opp_slb = $('#sale-code-select-box');
            let date_input = $('#date-input');
            let customer_slb = $('#account-select-box');
            let contact_slb = $('#contact-select-box');

            function loadSaleCodeListCallLog() {
                call_log_Opp_slb.prop('disabled', true);
                call_log_Opp_slb.html(``);
                call_log_Opp_slb.append(`<option selected value="${opportunity_detail_data.id}">(${opportunity_detail_data.code})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${opportunity_detail_data.title}</option>`);
                call_log_Opp_slb.initSelect2();
            }

            function loadCustomerList() {
                customer_slb.prop('disabled', true);
                customer_slb.html(``);
                customer_slb.append(`<option selected value="${opportunity_detail_data.customer.id}">${opportunity_detail_data.customer.name}</option>`);
                customer_slb.initSelect2();
            }

            function loadContactList() {
                let contact_list = opportunity_detail_data.customer.contact_mapped;
                contact_slb.html(``);
                contact_slb.append(`<option></option>`)
                for (let i = 0; i < contact_list.length; i++) {
                    contact_slb.append(`<option value="${contact_list[i].id}">${contact_list[i].fullname}</option>`)
                }
                contact_slb.initSelect2();
            }

            $('.create-new-call-log-button').on('click', function () {
                $('#subject-input').val('');
                date_input.val('');
                $('#result-text-area').val('');

                loadSaleCodeListCallLog();
                loadCustomerList();
                loadContactList();
            })

            date_input.daterangepicker({
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

            function combinesData_CallLog(frmEle) {
                let frm = new SetupFormSubmit($(frmEle));

                frm.dataForm['subject'] = $('#subject-input').val();
                frm.dataForm['opportunity'] = call_log_Opp_slb.val();
                frm.dataForm['customer'] = customer_slb.val();
                frm.dataForm['contact'] = contact_slb.val();
                frm.dataForm['call_date'] = date_input.val();
                frm.dataForm['input_result'] = $('#result-text-area').val();
                if ($('#repeat-activity').is(':checked')) {
                    frm.dataForm['repeat'] = 1;
                }
                else {
                    frm.dataForm['repeat'] = 0;
                }

                return {
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect,
                };
            }

            $('#form-create-new-call-log').submit(function (event) {
                event.preventDefault();
                let combinesData = new combinesData_CallLog($(this));
                if (combinesData) {
                    $.fn.callAjax2(combinesData)
                        .then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyB({description: "Successfully"}, 'success')
                                    $('#create-new-call-log').hide();
                                    loadDblActivityLogs();
                                }
                            },
                            (errs) => {
                                $.fn.notifyB({description: errs.data.errors}, 'failure');
                            }
                        )
                }
            })

            $(document).on('click', '#table-timeline .detail-call-log-button', function () {
                let call_log_id = $(this).attr('data-id');
                let call_log_detail = $.fn.callAjax2({url: $('#detail-call-log').attr('data-url').replace(0, call_log_id), method: 'GET'}).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_call_log_detail')) {
                            return data?.['opportunity_call_log_detail'];
                        }
                        return {};
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )
                Promise.all([call_log_detail]).then(
                    (results) => {
                        let call_log_obj = results[0];
                        $('#detail-subject-input').val(call_log_obj.subject);

                        $('#detail-sale-code-select-box option').remove();
                        $('#detail-sale-code-select-box').append(`<option selected>(${call_log_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${call_log_obj.opportunity.title}</option>`);

                        $('#detail-account-select-box option').remove();
                        $('#detail-account-select-box').append(`<option selected>${call_log_obj.opportunity.customer.title}</option>`);

                        $('#detail-contact-select-box option').remove();
                        $('#detail-contact-select-box').append(`<option selected>${call_log_obj.contact.fullname}</option>`);

                        $('#detail-date-input').val(call_log_obj.call_date.split(' ')[0]);
                        $('#detail-repeat-activity').prop('checked', call_log_obj.repeat);
                        $('#detail-result-text-area').val(call_log_obj.input_result);

                        $('#detail-call-log #cancel-activity').prop('hidden', call_log_obj.is_cancelled)
                        if (call_log_obj.is_cancelled) {
                            $('#detail-call-log #is-cancelled').text(trans_script.attr('data-trans-activity-cancelled'))
                        }
                        else {
                            $('#detail-call-log #is-cancelled').text('')
                        }
                        $('#detail-call-log .modal-body').attr('data-id', call_log_obj.id)
                    })
            })

            $(document).on('click', '#detail-call-log #cancel-activity', function () {
                Swal.fire({
                    html:
                    `<div class="mb-3"><i class="bi bi-x-square text-danger"></i></div>
                         <h5 class="text-danger">${trans_script.attr('data-trans-alert-cancel-call-log')}</h5>
                         <p>${trans_script.attr('data-trans-alert-warn-call-log')}</p>`,
                    customClass: {
                        confirmButton: 'btn btn-outline-secondary text-danger',
                        cancelButton: 'btn btn-outline-secondary text-gray',
                        container:'swal2-has-bg',
                        actions:'w-100'
                    },
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) {
                        let call_log_id = $('#detail-call-log .modal-body').attr('data-id')

                        let csr = $("input[name=csrfmiddlewaretoken]").val();
                        $.fn.callAjax($('#detail-call-log').attr('data-url').replace(0, call_log_id), 'PUT', {'is_cancelled': !$('#detail-call-log #cancel-activity').prop('disabled')}, csr)
                        .then((resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                $('#detail-call-log').modal('hide')
                                loadDblActivityLogs();
                            }
                        },(errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        })
                    }
                })
            })

            // for send email.

            let email_Opp_slb = $('#email-sale-code-select-box');
            let email_to_slb = $('#email-to-select-box');
            let email_cc_slb = $('#email-cc-select-box');

            function loadSaleCodeListEmail() {
                email_Opp_slb.prop('disabled', true);
                email_Opp_slb.html(``);
                email_Opp_slb.append(`<option selected value="${opportunity_detail_data.id}">(${opportunity_detail_data.code})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${opportunity_detail_data.title}</option>`);
                email_Opp_slb.initSelect2();
            }

            function loadEmailToList(contact_list) {
                email_to_slb.html(``);
                for (let i = 0; i < contact_list.length; i++) {
                    let item = contact_list[i];
                    if (item.email !== null) {
                        email_to_slb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.email}</option>`);
                    }
                }
                email_to_slb.select2({
                    dropdownParent: $("#send-email"),
                    tags: true,
                    tokenSeparators: [',', ' ']
                });
            }

            function loadEmailCcList(contact_list) {
                email_cc_slb.html(``);
                for (let i = 0; i < contact_list.length; i++) {
                    let item = contact_list[i];
                    if (item.email) {
                        email_cc_slb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.email}</option>`);
                    }
                }
                email_cc_slb.select2({
                    dropdownParent: $("#send-email"),
                    tags: true,
                    tokenSeparators: [',', ' ']
                });
            }

            ClassicEditor
                .create(document.querySelector('#email-content-area'))
                .catch(error => {console.error(error);})

            $('.send-email-button').on('click', function () {
                $('#email-subject-input').val('');
                $('#email-content-area').val('');

                loadSaleCodeListEmail();
                loadEmailToList(opportunity_detail_data.customer.contact_mapped);
                loadEmailCcList(opportunity_detail_data.customer.contact_mapped);
            })

            function combinesData_Email(frmEle) {
                let frm = new SetupFormSubmit($(frmEle));

                frm.dataForm['subject'] = $('#email-subject-input').val();
                frm.dataForm['opportunity'] = $('#email-sale-code-select-box option:selected').val();
                frm.dataForm['email_to_list'] = email_to_slb.val();
                frm.dataForm['email_cc_list'] = email_cc_slb.val();
                frm.dataForm['content'] = $('#form-new-email .ck-content').html();

                return {
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect,
                };
            }

            $('#form-new-email').submit(function (event) {
                event.preventDefault();
                let combinesData = new combinesData_Email($(this));
                if (combinesData) {
                    $.fn.callAjax2(combinesData)
                        .then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyB({description: "Successfully"}, 'success')
                                    $('#send-email').hide();
                                    loadDblActivityLogs();
                                }
                            },
                            (errs) => {
                                $.fn.notifyB({description: errs.data.errors}, 'failure');
                            }
                        )
                }
            })

            $(document).on('click', '#table-timeline .detail-email-button', function () {
                let email_id = $(this).attr('data-id');
                let email_detail = $.fn.callAjax2({url: $('#detail-send-email').attr('data-url').replace(0, email_id), method: 'GET'}).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_email_detail')) {
                            return data?.['opportunity_email_detail'];
                        }
                        return {};
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )
                Promise.all([email_detail]).then(
                    (results) => {
                        let email_obj = results[0];
                        let detail_email_Opp_slb = $('#detail-email-sale-code-select-box')
                        let detail_email_to_slb = $('#detail-email-to-select-box')
                        let detail_email_cc_slb = $('#detail-email-cc-select-box')

                        $('#detail-email-subject-input').val(email_obj.subject);

                        detail_email_Opp_slb.html('');
                        detail_email_Opp_slb.append(`<option selected>(${email_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${email_obj.opportunity.title}</option>`);

                        detail_email_to_slb.html('');
                        for (let i = 0; i < email_obj.email_to_list.length; i++) {
                            detail_email_to_slb.append(`<option selected>${email_obj.email_to_list[i]}</option>`);
                        }

                        detail_email_cc_slb.html('');
                        for (let i = 0; i < email_obj.email_cc_list.length; i++) {
                            detail_email_cc_slb.append(`<option selected>${email_obj.email_cc_list[i]}</option>`);
                        }

                        $('#detail-email-content-area').html(email_obj.content)
                    })
            })

            $(document).on('click', '#table-timeline .delete-email-button', function () {
                let email_id = $(this).attr('data-id');
                $.fn.callAjax2({url: table_timeline.attr('data-url-delete-email').replace(0, email_id), method:'DELETE'}).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            loadDblActivityLogs();
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            })

            // for meeting

            let meeting_Opp_slb = $('#meeting-sale-code-select-box');
            let meeting_address_slb = $('#meeting-address-select-box');
            let meeting_customer_member_slb = $('#meeting-customer-member-select-box');
            let meeting_employee_attended_slb = $('#meeting-employee-attended-select-box');
            let meeting_date_input = $('#meeting-date-input');

            function loadMeetingSaleCodeList() {
                meeting_Opp_slb.prop('disabled', true);
                meeting_Opp_slb.html(``);
                meeting_Opp_slb.append(`<option selected value="${opportunity_detail_data.id}">(${opportunity_detail_data.code})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${opportunity_detail_data.title}</option>`);
                meeting_Opp_slb.initSelect2();
            }

            function loadMeetingAddress(shipping_address_list) {
                meeting_address_slb.attr('disabled', false);
                $('#meeting-address-select-box option').remove();
                meeting_address_slb.initSelect2();
                for (let i = 0; i < shipping_address_list.length; i++) {
                    if (shipping_address_list[i].is_default) {
                        meeting_address_slb.append(`<option selected>${shipping_address_list[i].full_address}</option>`);
                    }
                    else {
                        meeting_address_slb.append(`<option>${shipping_address_list[i].full_address}</option>`);
                    }
                }
            }

            function loadCustomerMember(contact_list) {
                meeting_customer_member_slb.attr('disabled', false);
                $('#meeting-customer-member-select-box option').remove();
                meeting_customer_member_slb.initSelect2();
                for (let i = 0; i < contact_list.length; i++) {
                    meeting_customer_member_slb.append(`<option value="${contact_list[i].id}">${contact_list[i].fullname}</option>`)
                }
            }

            function loadEmployeeAttended(data) {
                meeting_employee_attended_slb.initSelect2({
                    ajax: {
                        url: meeting_employee_attended_slb.attr('data-url'),
                        method: 'GET',
                    },
                    data: (data ? data : null),
                    keyResp: 'employee_list',
                    keyId: 'id',
                    keyText: 'full_name',
                })
            }

            meeting_date_input.daterangepicker({
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
            meeting_date_input.val('');

            $('#meeting-address-input-btn').on('click', function () {
                $('#meeting-address-select-div').prop('hidden', true);
                $('#meeting-address-input-div').prop('hidden', false);
            })

            $('#meeting-address-select-btn').on('click', function () {
                $('#meeting-address-select-div').prop('hidden', false);
                $('#meeting-address-input-div').prop('hidden', true);
            })

            $('.new-meeting-button').on('click', function () {
                $('#meeting-subject-input').val('');
                meeting_date_input.val('');
                $('#meeting-room-location-input').val('');
                $('#meeting-address-input').val('');
                $('#meeting-result-text-area').val('');
                $('#meeting-repeat-activity').attr('checked', false);
                $('#meeting-address-select-div').prop('hidden', false);
                $('#meeting-address-input-div').prop('hidden', true);
                $('#meeting-employee-attended-select-box option').remove();

                loadMeetingSaleCodeList();
                loadMeetingAddress(opportunity_detail_data.customer.shipping_address);
                loadCustomerMember(opportunity_detail_data.customer.contact_mapped);
                loadEmployeeAttended();
            })

            function combinesData_Meeting(frmEle) {
                let frm = new SetupFormSubmit($(frmEle));

                frm.dataForm['subject'] = $('#meeting-subject-input').val();
                frm.dataForm['opportunity'] = $('#meeting-sale-code-select-box option:selected').val();
                frm.dataForm['meeting_date'] = meeting_date_input.val();
                if ($('#meeting-address-select-div').is(':hidden')) {
                    frm.dataForm['meeting_address'] = $('#meeting-address-input').val();
                }
                else {
                    frm.dataForm['meeting_address'] = $('#meeting-address-select-box option:selected').val();
                }
                frm.dataForm['room_location'] = $('#meeting-room-location-input').val();
                frm.dataForm['input_result'] = $('#meeting-result-text-area').val();

                frm.dataForm['repeat'] = $('#repeat-activity').is(':checked') ? 1 : 0;

                let employee_attended_list = [];
                $('#meeting-employee-attended-select-box option:selected').each(function () {
                    employee_attended_list.push(
                        {
                            'id': $(this).attr('value'),
                            'code': $(this).attr('data-code'),
                            'fullname': $(this).text()
                        }
                    )
                })

                let customer_member_list = [];
                $('#meeting-customer-member-select-box option:selected').each(function () {
                    customer_member_list.push(
                        {
                            'id': $(this).attr('value'),
                            'fullname': $(this).text()
                        }
                    )
                })

                frm.dataForm['employee_attended_list'] = employee_attended_list;
                frm.dataForm['customer_member_list'] = customer_member_list;
                frm.dataForm['meeting_from_time'] = frm.dataForm['meeting_from_time'].split(' ')[0]+':00';
                frm.dataForm['meeting_to_time'] = frm.dataForm['meeting_to_time'].split(' ')[0]+':00';

                return {
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect,
                };
            }

            $('#form-new-meeting').submit(function (event) {
                event.preventDefault();
                let combinesData = new combinesData_Meeting($(this));
                if (combinesData) {
                    $.fn.callAjax2(combinesData)
                        .then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyB({description: "Successfully"}, 'success')
                                    $('#create-meeting').hide();
                                    loadDblActivityLogs();
                                }
                            },
                            (errs) => {
                                $.fn.notifyB({description: errs.data.errors}, 'failure');
                            }
                        )
                }
            })

            $(document).on('click', '#table-timeline .detail-meeting-button', function () {
                let meeting_id = $(this).attr('data-id');
                let meeting_detail = $.fn.callAjax2({url: $('#detail-meeting').attr('data-url').replace(0, meeting_id), method: 'GET'}).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_meeting_detail')) {
                            return data?.['opportunity_meeting_detail'];
                        }
                        return {};
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )
                Promise.all([meeting_detail]).then(
                    (results) => {
                        let meeting_obj = results[0];
                        $('#detail-meeting-subject-input').val(meeting_obj.subject);

                        $('#detail-meeting-sale-code-select-box option').remove();
                        $('#detail-meeting-sale-code-select-box').append(`<option selected>(${meeting_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${meeting_obj.opportunity.title}</option>`);

                        $('#detail-meeting-address-select-box option').remove();
                        $('#detail-meeting-address-select-box').append(`<option selected>${meeting_obj.meeting_address}</option>`);

                        $('#detail-meeting-room-location-input').val(meeting_obj.room_location);

                        let detail_meeting_employee_attended_slb = $('#detail-meeting-employee-attended-select-box');
                        $('#detail-meeting-employee-attended-select-box option').remove();
                        for (let i = 0; i < meeting_obj.employee_attended_list.length; i++) {
                            let employee_attended_item = meeting_obj.employee_attended_list[i];
                            detail_meeting_employee_attended_slb.append(`<option selected>${employee_attended_item.fullname}</option>`);
                        }
                        detail_meeting_employee_attended_slb.prop('disabled', true);

                        let detail_meeting_customer_member_slb = $('#detail-meeting-customer-member-select-box');
                        $('#detail-meeting-customer-member-select-box option').remove();
                        for (let i = 0; i < meeting_obj.customer_member_list.length; i++) {
                            let customer_member_item = meeting_obj.customer_member_list[i];
                            detail_meeting_customer_member_slb.append(`<option selected>${customer_member_item.fullname}</option>`);
                        }
                        detail_meeting_customer_member_slb.prop('disabled', true);

                        $('#detail-meeting-date-input').val(meeting_obj.meeting_date.split(' ')[0]).prop('readonly', true);
                        moment.locale('en')
                        $('#detail-meeting #meeting-from-time').val(moment.utc(meeting_obj['meeting_from_time'], 'hh:mm:ss.SSSSSS').format('hh:mm A'))
                        $('#detail-meeting #meeting-to-time').val(moment.utc(meeting_obj['meeting_to_time'], 'hh:mm:ss.SSSSSS').format('hh:mm A'))

                        $('#detail-repeat-activity').prop('checked', meeting_obj.repeat);

                        $('#detail-meeting-result-text-area').val(meeting_obj.input_result);
                        $('#cancel-activity').prop('hidden', meeting_obj.is_cancelled)
                        if (meeting_obj.is_cancelled) {
                            $('#is-cancelled').text(trans_script.attr('data-trans-activity-cancelled'))
                        }
                        else {
                            $('#is-cancelled').text('')
                        }
                        $('#detail-meeting .modal-body').attr('data-id', meeting_obj.id)

                        $('#detail-meeting #cancel-activity').prop('hidden', meeting_obj.is_cancelled)
                        if (meeting_obj.is_cancelled) {
                            $('#detail-meeting #is-cancelled').text(trans_script.attr('data-trans-activity-cancelled'))
                        }
                        else {
                            $('#detail-meeting #is-cancelled').text('')
                        }
                        $('#detail-meeting .modal-body').attr('data-id', meeting_obj.id)
                    })
            })

            $(document).on('click', '#detail-meeting #cancel-activity', function () {
                Swal.fire({
                    html:
                    `<div class="mb-3"><i class="bi bi-x-square text-danger"></i></div>
                         <h5 class="text-danger">${trans_script.attr('data-trans-alert-cancel-meeting')}</h5>
                         <p>${trans_script.attr('data-trans-alert-warn-meeting')}</p>`,
                    customClass: {
                        confirmButton: 'btn btn-outline-secondary text-danger',
                        cancelButton: 'btn btn-outline-secondary text-gray',
                        container:'swal2-has-bg',
                        actions:'w-100'
                    },
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) {
                        let call_log_id = $('#detail-meeting .modal-body').attr('data-id')

                        let csr = $("input[name=csrfmiddlewaretoken]").val();
                        $.fn.callAjax($('#detail-meeting').attr('data-url').replace(0, call_log_id), 'PUT', {'is_cancelled': !$('#detail-meeting #cancel-activity').prop('disabled')}, csr)
                        .then((resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                $('#detail-meeting').modal('hide')
                                loadDblActivityLogs();
                            }
                        },(errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        })
                    }
                })
            })


            // TIMELINE

            function tabSubtask(taskID) {
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

            function tabLogWork(dataList) {
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

            function displayTaskView(url) {
                if (url)
                    $.fn.callAjax(url, 'GET')
                        .then((resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                // enable side panel
                                if (!$('#drawer_task_create').hasClass('open')) {
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
                                // to do here

                                if (data.attach) {
                                    const fileDetail = data.attach[0]?.['files']
                                    FileUtils.init($(`[name="attach"]`).siblings('button'), fileDetail);
                                }
                                $('.create-task').attr('disabled', true)
                            }
                        })
            }

            function loadDblActivityLogs() {
                let $table = table_timeline;
                let urlMapApp = {
                    'quotation.quotation': urlFactory.attr('data-url-quotation-detail'),
                    'saleorder.saleorder': urlFactory.attr('data-url-sale-order-detail'),
                    'cashoutflow.advancepayment': urlFactory.attr('data-url-advance-detail'),
                    'cashoutflow.payment': urlFactory.attr('data-url-payment-detail'),
                    'cashoutflow.returnadvance': urlFactory.attr('data-url-return-detail'),
                }
                let activityMapApp = {
                    'quotation.quotation': transEle.attr('data-trans-quotation'),
                    'saleorder.saleorder': transEle.attr('data-trans-sale-order'),
                    'cashoutflow.advancepayment': transEle.attr('data-trans-advance'),
                    'cashoutflow.payment': transEle.attr('data-trans-payment'),
                    'cashoutflow.returnadvance': transEle.attr('data-trans-return'),
                }
                let typeMapActivity = {
                    1: transEle.attr('data-trans-task'),
                    2: transEle.attr('data-trans-call'),
                    3: transEle.attr('data-trans-email'),
                    4: transEle.attr('data-trans-meeting'),
                }
                let typeMapIcon = {
                    0: `<i class="fas fa-file-alt"></i>`,
                    1: `<i class="fas fa-tasks"></i>`,
                    2: `<i class="fas fa-phone-alt"></i>`,
                    3: `<i class="far fa-envelope"></i>`,
                    4: `<i class="fas fa-users"></i>`,
                }
                $table.DataTable().clear().destroy()
                $table.DataTableDefault({
                    rowIdx: true,
                    ajax: {
                        url: $table.attr('data-url-logs_list'),
                        type: 'GET',
                        data: {'opportunity': pk},
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('activity_logs_list')) {
                                console.log(resp.data['activity_logs_list'])
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
                                if (row?.['log_type'] === 0) {
                                    if (row?.['app_code']) {
                                        let status = ``;
                                        if (row?.['app_code'] === 'quotation.quotation') {
                                            if (opportunity_detail_data?.['quotation']?.['id'] === row?.['doc_id']) {
                                                status = `<small class="text-green">${transEle.attr('data-trans-valid')}</small>`
                                            } else {
                                                status = `<small class="text-red">${transEle.attr('data-trans-invalid')}</small>`
                                            }
                                        }

                                        return `<div class="d-flex justify-content-start">
                                            <span class="badge badge-soft-primary mr-2">${activityMapApp[row?.['app_code']]}</span>
                                            ${status}
                                        </div>`;
                                    }
                                } else {
                                    let status = ''
                                    if (row?.['call_log']['is_cancelled'] || row?.['meeting']['is_cancelled']) {
                                        status = `<span class="badge badge-sm badge-soft-danger">${trans_script.attr('data-trans-activity-cancelled')}</i>`
                                    }
                                    return `<span class="badge badge-soft-primary">${typeMapActivity[row?.['log_type']]}</span> ${status}`;
                                }
                                return `<p></p>`;
                            }
                        },
                        {
                            targets: 2,
                            render: (data, type, row) => {
                                let link = '';
                                let title = '';
                                if (row?.['log_type'] === 0) {
                                    if (row?.['app_code'] && row?.['doc_id']) {
                                        link = urlMapApp[row?.['app_code']].format_url_with_uuid(row?.['doc_id']);
                                        title = row?.['title'];
                                        return `<a href="${link}" target="_blank"><p>${title}</p></a>`;
                                    } else {
                                        return `<p></p>`;
                                    }
                                }
                                if (row?.['log_type'] === 1) {
                                    title = row?.['task']?.['subject'];
                                    return `<a><p>${title}</p></a>`;
                                } else if (row?.['log_type'] === 2) {
                                    title = row?.['call_log']?.['subject'];
                                    return `<a href="#" data-bs-toggle="modal" data-bs-target="#detail-call-log" class="detail-call-log-button text-primary" data-id="${row?.['call_log']['id']}"><p>${title}</p></a>`;
                                } else if (row?.['log_type'] === 3) {
                                    title = row?.['email']?.['subject'];
                                    return `<a href="#" data-bs-toggle="modal" data-bs-target="#detail-send-email" class="detail-email-button text-primary" data-id="${row?.['email']['id']}"><p>${title}</p></a>`;
                                } else if (row?.['log_type'] === 4) {
                                    title = row?.['meeting']?.['subject'];
                                    return `<a href="#" data-bs-toggle="modal" data-bs-target="#detail-meeting" class="detail-meeting-button text-primary" data-id="${row?.['meeting']['id']}"><p>${title}</p></a>`;
                                }
                            }
                        },
                        {
                            targets: 3,
                            render: (data, type, row) => {
                                return typeMapIcon[row?.['log_type']];
                            }
                        },
                        {
                            targets: 4,
                            render: (data, type, row) => {
                                return $x.fn.displayRelativeTime(row?.['date_created'], {
                                    'outputFormat': 'DD-MM-YYYY',
                                });
                            }
                        }
                    ],
                });
            }

            loadDblActivityLogs();

            // for task
            Task_in_opps.init(opportunity_detail_data, loadDblActivityLogs)

            // event create related features
            $('#dropdown-menu-relate-app #create-advance-payment-shortcut').on('click', function () {
                let url = $(this).attr('data-url') + `?type=0&&sale_code_mapped=${$(this).attr('data-sale_code_mapped')}&&quotation_object=${$(this).attr('data-quotation_object')}&&sale_order_object=${$(this).attr('data-sale_order_object')}`
                window.open(url, '_blank');
            })
            $('#dropdown-menu-relate-app #create-payment-shortcut').on('click', function () {
                let url = $(this).attr('data-url') + `?type=0&&sale_code_mapped=${$(this).attr('data-sale_code_mapped')}&&quotation_object=${$(this).attr('data-quotation_object')}&&sale_order_object=${$(this).attr('data-sale_order_object')}`
                window.open(url, '_blank');
            })
            $('#dropdown-menu-relate-app #create-return-advance-shortcut').on('click', function () {
                let url = $(this).attr('data-url') + `?opportunity=${$(this).attr('data-opportunity_mapped')}`
                window.open(url, '_blank');
            })

            $(document).on('click', '.btn-add-document', function () {
                let url = $(this).data('url') + "?opportunity={0}".format_by_idx(encodeURIComponent(JSON.stringify(paramString)));
                window.open(url, '_blank');
            })

            // event on click to create relate apps from opportunity
            $('#dropdown-menu-relate-app').on('click', '.relate-app', function () {
                let url = $(this).data('url') + "?opportunity={0}".format_by_idx(encodeURIComponent(JSON.stringify(paramString)));
                window.open(url, '_blank');
            })

            $('#btn-create-related-feature').on('click', function () {
                let dataInitSaleCode = results[0];

                let dataParam_ap = {'list_from_app': 'cashoutflow.advancepayment.create'}
                let opp_list_ajax= $.fn.callAjax2({
                    url: $('#script-url').attr('data-url-opp-list'),
                    data: dataParam_ap,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                                return data?.['opportunity_list'];
                            }
                        }
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([opp_list_ajax]).then(
                    (results) => {
                        let opp_list = results[0];
                        for (let opp of opp_list) {
                            if (opp?.['id'] === dataInitSaleCode?.['id']) {
                                let sale_code_mapped= encodeURIComponent(JSON.stringify({'id': opp?.['id'], 'code': opp?.['code'], 'title': opp?.['title']}));
                                let quotation= encodeURIComponent(JSON.stringify(opp?.['quotation']));
                                let sale_order= encodeURIComponent(JSON.stringify(opp?.['sale_order']));
                                $('#create-advance-payment-shortcut').removeClass('disabled');
                                $('#create-advance-payment-shortcut').attr('data-sale_code_mapped', sale_code_mapped)
                                $('#create-advance-payment-shortcut').attr('data-quotation_object', quotation)
                                $('#create-advance-payment-shortcut').attr('data-sale_order_object', sale_order)
                                break;
                            }
                        }
                    })

                let dataParam_payment = {'list_from_app': 'cashoutflow.payment.create'}
                opp_list_ajax= $.fn.callAjax2({
                    url: $('#script-url').attr('data-url-opp-list'),
                    data: dataParam_payment,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                                return data?.['opportunity_list'];
                            }
                        }
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([opp_list_ajax]).then(
                    (results) => {
                        let opp_list = results[0];
                        for (let opp of opp_list) {
                            if (opp?.['id'] === dataInitSaleCode?.['id']) {
                                let sale_code_mapped= encodeURIComponent(JSON.stringify({'id': opp?.['id'], 'code': opp?.['code'], 'title': opp?.['title']}));
                                let quotation= encodeURIComponent(JSON.stringify(opp?.['quotation']));
                                let sale_order= encodeURIComponent(JSON.stringify(opp?.['sale_order']));
                                $('#create-payment-shortcut').removeClass('disabled')
                                $('#create-payment-shortcut').attr('data-sale_code_mapped', sale_code_mapped)
                                $('#create-payment-shortcut').attr('data-quotation_object', quotation)
                                $('#create-payment-shortcut').attr('data-sale_order_object', sale_order)
                                break;
                            }
                        }
                    })

                $('#create-return-advance-shortcut').attr('data-opportunity_mapped', encodeURIComponent(JSON.stringify({'id': dataInitSaleCode?.['id'], 'code': dataInitSaleCode?.['code'], 'title': dataInitSaleCode?.['title']})))
            })
        }
    )

    // submit form edit
    new SetupFormSubmit(frmDetail).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            autoLoadStage(
                true,
                false,
                list_stage_condition,
                list_stage,
                condition_sale_oder_approved,
                condition_is_quotation_confirm,
                condition_sale_oder_delivery_status,
                config_is_input_rate,
                dict_stage
            );
            frm.dataForm = OpportunityLoadDetail.getDataForm(frm.dataForm);
            $.fn.callAjax2({
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect.format_url_with_uuid($.fn.getPkDetail()), 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })
})
