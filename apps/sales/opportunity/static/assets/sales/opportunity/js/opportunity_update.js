$(document).ready(function () {
    let eleFrmPermit = $('#permit-member');
    $(document).on('click', '#btnOpenPermit', function () {
        console.log('btnOpenPermit is clicked!');
        eleFrmPermit.removeClass('hidden');
        document.getElementById('permit-member').scrollIntoView({
            behavior: 'smooth'
        });
    });

    const urlFactory = $('#url-factory');
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
    let prm_acc = $.fn.callAjax2({
        url: urlFactory.data('url-account-list'),
        type: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('account_list')) {
                return data['account_list'];
            }
            return [];
        },
        (errs) => {

        }
    )

    let prm_contact = $.fn.callAjax2({
        url: urlFactory.data('url-contact-list'),
        type: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('contact_list')) {
                return data['contact_list'];
            }
            return [];
        },
        (errs) => {

        }
    )

    let prm_opp = $.fn.callAjax2({
        url: urlFactory.data('url-opp-list'),
        type: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_list')) {
                return data['opportunity_list'];
            }
            return [];
        },
        (errs) => {

        }
    )

    let prm_employee = $.fn.callAjax2({
        url: urlFactory.data('url-employee-list'),
        type: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('employee_list')) {
                return data['employee_list'];
            }
            return [];
        },
        (errs) => {

        }
    )

    let prm_config = $.fn.callAjax2({
        url: urlFactory.data('url-config'),
        type: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_config')) {
                return data['opportunity_config'];
            }
            return {};
        },
        (errs) => {

        }
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
        (errs) => {
        }
    )
    let list_stage_condition = []
    let config_is_input_rate = null;
    $x.fn.showLoadingPage()
    Promise.all([prm_acc, prm_contact, prm_opp, prm_employee, prm_detail, prm_config]).then(
        (results) => {
            $x.fn.hideLoadingPage();
            const account_list = results[0];
            const contact_list = results[1];
            const opportunity_list = results[2];
            const employee_list = results[3];
            const opportunity_detail_data = results[4]

            let config = results[5];
            const config_is_select_stage = config.is_select_stage;
            const config_is_AM_create = config.is_account_manager_create;
            config_is_input_rate = config.is_input_win_rate;

            if (config_is_select_stage) {
                $('#btn-auto-update-stage').hide();
            }

            let paramString = {}

            async function loadDetail(opportunity_detail) {
                $x.fn.renderCodeBreadcrumb(opportunity_detail);

                paramString = {
                    'id': opportunity_detail.id,
                    'code': opportunity_detail.code,
                    'title': opportunity_detail.title,
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
                if (opportunity_detail?.['open_date'] !== null)
                    $('#input-open-date').val(opportunity_detail?.['='].split(' ')[0]);
                if (opportunity_detail?.['open_date'] !== null)
                    $('#input-close-date').val(opportunity_detail?.['open_date'].split(' ')[0]);
                else {
                    $('#input-close-date').val('');
                }
                if (opportunity_detail.decision_maker !== null) {
                    let ele_decision_maker = $('#input-decision-maker');
                    ele_decision_maker.val(opportunity_detail.decision_maker.name);
                    ele_decision_maker.attr('data-id', opportunity_detail.decision_maker.id);
                }

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
                OpportunityLoadDetail.loadSaleTeam(opportunity_detail.members);

                if ($.fn.hasOwnProperties(opportunity_detail, ['sale_order'])) {
                    let so_id = opportunity_detail.sale_order.id;
                    let link = so_id !== undefined ? urlEle.data('url-related-sale-order').format_url_with_uuid(so_id) : '#';
                    $('#item-related-sale-order').attr('href', link)
                    if (opportunity_detail.sale_order.system_status === 0) {
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

            loadDetail(opportunity_detail_data).then();

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

            $(document).on('click', '#btn-show-modal-add-member', function () {
                OpportunityLoadDetail.loadMemberForDtb().then();
            })

            $(document).on('change', '.mask-money', function () {
                if ($(this).valCurrency() < 0) {
                    $.fn.notifyB({description: transEle.data('trans-limit-money')}, 'failure');
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

            $(document).on('change', '#check-lost-reason', function () {
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

            $(document).on('click', '#btn-auto-update-stage', function () {
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

            const frm_add_member = $('#frm-add-member');
            SetupFormSubmit.validate(
                frm_add_member,
                {
                    submitHandler: function (form) {
                        $x.fn.showLoadingPage();
                        let frm = new SetupFormSubmit($(form));
                        $.fn.callAjax2({
                            sweetAlertOpts: {'allowOutsideClick': true},
                            url: frm.dataUrl.replaceAll('__pk_opp__', pk),
                            method: frm.dataMethod,
                            data: {
                                'members': OpportunityLoadDetail.getDataMember().map(
                                    (item) => {
                                        return item.id;
                                    }
                                ),
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
                                $x.fn.hideLoadingPage();
                            }
                        )
                    }
                }
            )

            // // toggle action and activity
            toggleShowActivity()

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
                $('#account-select-box').prop('disabled', true);

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
                } else {
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


                $.fn.callAjax2({
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm
                }).then((resp) => {
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

                let contact_list_id = account_list.filter(function (item) {
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

                $.fn.callAjax2({
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            $('#send-email').hide();

                            callAjaxtoLoadTimeLineList();
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
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
                let opportunity_obj = JSON.parse($('#opportunity_list').text()).filter(function (item) {
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
                } else {
                    frm.dataForm['meeting_address'] = $('#meeting-address-select-box option:selected').val();
                }
                frm.dataForm['room_location'] = $('#meeting-room-location-input').val();
                frm.dataForm['input_result'] = $('#meeting-result-text-area').val();

                if ($('#meeting-repeat-activity').is(':checked')) {
                    frm.dataForm['repeat'] = 1;
                } else {
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

            function logworkSubmit() {
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
                    } else {
                        $('[name="log_time"]').attr('value', JSON.stringify(data))
                    }
                    $('#logWorkModal').modal('hide')
                });
            }

            class AssignToSetup {
                static case01(config, params) {
                    // có opps + config có in assign opt lớn hơn 0
                    if (config.in_assign_opt === 1) {
                        // chỉ employee trong opportunity
                        let selectOpt = '';
                        $('#card-member .card').each(function () {
                            let opt = `<option value="${$(this).attr('data-id')}">${$(this).find('.card-title').text()
                            }</option>`
                            selectOpt += opt
                        })
                        $('#selectAssignTo').html(selectOpt).removeAttr('data-url')

                    } else if (config.in_assign_opt === 2) {
                        // chỉ nhân viên của user
                        params = {'group__first_manager__id': true}
                    } else {
                        // vừa trong opportunity vừa là nhân viên của user
                        $('.is-lazy-loading').addClass('is_show')
                        let selectOpt = '<option value=""></option>';
                        $('#card-member .card').each(function () {
                            let opt = `<option value="${$(this).attr('data-id')}">${$(this).find('.card-title').text()
                            }</option>`
                            selectOpt += opt
                        })
                        const $sltElm = $('#selectAssignTo')
                        //
                        $.fn.callAjax2({
                            'url': $sltElm.attr('data-url'),
                            'method': 'get',
                            'data': {'group__first_manager__id': true}
                        }).then(
                            (resp) => {
                                const data = $.fn.switcherResp(resp);
                                let assigneeList = data?.[$sltElm.attr('data-keyresp')]
                                for (const item of assigneeList) {
                                    if (selectOpt.indexOf(item?.[$sltElm.attr('data-keyid')]) === -1) {
                                        let opt = `<option value="${item?.[$sltElm.attr('data-keyid')]
                                        }">${item?.[$sltElm.attr('data-keytext')]}</option>`
                                        selectOpt += opt
                                    }
                                }
                                $sltElm.html(selectOpt).removeAttr('data-url')
                                $('.is-lazy-loading').removeClass('is_show')
                            }
                        )
                    }
                    return params
                }

                static hasConfig(config) {
                    const $selectElm = $('#selectAssignTo')
                    let params = {}
                    if (config.in_assign_opt > 0) params = this.case01(config, params)

                    $selectElm.attr('data-params', JSON.stringify(params))
                    if ($selectElm.hasClass("select2-hidden-accessible")) $selectElm.select2('destroy')
                    $selectElm.initSelect2()
                }

                static init() {
                    $.fn.callAjax2({
                        'url': $('#task_url_sub').attr('data-task-config'),
                        'method': 'get'
                    }).then(
                        (resp) => {
                            const data = $.fn.switcherResp(resp);
                            let taskConfig = data?.['task_config']
                            this.hasConfig(taskConfig)
                        }
                    )
                }
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

                AssignToSetup.init()
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

                if ($btnInOpp.length) {
                    const pk = $.fn.getPkDetail()
                    let data = {
                        "id": pk,
                        "code": ''
                    }
                    const isCheck = setInterval(() => {
                        let oppCode = $('#span-code').text()
                        if (oppCode.length) {
                            clearInterval(isCheck)
                            data.code = oppCode
                            $selectElm.attr('data-onload', JSON.stringify(data)).attr('disabled', true)
                            $selectElm.initSelect2()
                        }
                    }, 1000)
                } else $selectElm.initSelect2()

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
                    .create(
                        document.querySelector('.ck5-rich-txt'),
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
                    else {
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
                    if (assign_to) {
                        assign_toData = {
                            'id': assign_to.id,
                            'first_name': assign_to.text.split('. ')[1],
                            'last_name': assign_to.text.split('. ')[0],
                        }
                        formData.employee_inherit_id = assign_to.id
                    } else {
                        $.fn.notifyB({'description': $('#trans-factory').attr('data-assignee_empty')}, 'failure')
                        return false
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

                    if ($('[name="attach"]').val()) {
                        let list = []
                        list.push($('[name="attach"]').val())
                        formData.attach = list
                    }

                    let method = 'POST'
                    let url = _form.dataUrl
                    if (formData.id && formData.id !== '') {
                        method = 'PUT'
                        url = $('#url-factory').attr('data-task-detail').format_url_with_uuid(formData.id)
                    }
                    $.fn.callAjax2({
                        'url': url,
                        'method': method,
                        'data': formData,
                        'sweetAlertOpts': {
                            'allowOutsideClick': true
                        }
                    }).then(
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
                        },
                        (error) => {
                            console.log(error)
                        }
                    )
                })
            }, jQuery)


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
                $('#table-timeline').DataTable().clear().destroy();
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
                                } else if (row.type === 'call') {
                                    txt = `<i class="bi bi-telephone-fill"></i>`
                                } else if (row.type === 'email') {
                                    txt = `<i class="bi bi-envelope-fill"></i>`
                                } else if (row.type === 'meeting') {
                                    txt = `<i class="bi bi-person-workspace"></i>`
                                } else if (row.type === 'document') {
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
                                } else if (row.type === 'email') {
                                    modal_detail_target = '#detail-send-email';
                                    modal_detail_class = 'detail-email-button';
                                } else if (row.type === 'meeting') {
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
                    rowCallback: function (row, data) {
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
                                    } else if (Object.keys(item.call_log).length > 0) {
                                        activity_logs_list.push({
                                            'id': item.call_log.id,
                                            'type': item.call_log.activity_type,
                                            'title': item.call_log.activity_name,
                                            'subject': item.call_log.subject,
                                            'date': item.date_created.split(' ')[0],
                                        })
                                    } else if (Object.keys(item.email).length > 0) {
                                        activity_logs_list.push({
                                            'id': item.email.id,
                                            'type': item.email.activity_type,
                                            'title': item.email.activity_name,
                                            'subject': item.email.subject,
                                            'date': item.date_created.split(' ')[0],
                                        })
                                    } else if (Object.keys(item.meeting).length > 0) {
                                        activity_logs_list.push({
                                            'id': item.meeting.id,
                                            'type': item.meeting.activity_type,
                                            'title': item.meeting.activity_name,
                                            'subject': item.meeting.subject,
                                            'date': item.date_created.split(' ')[0],
                                        })
                                    } else if (Object.keys(item.document).length > 0) {
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

            $(document).on('click', '#table-timeline .detail-call-log-button', function () {
                let call_log_id = $(this).attr('data-id');
                let call_log_obj = JSON.parse($('#opportunity_call_log_list').text()).filter(function (item) {
                    return item.id === call_log_id;
                })[0]
                $('#detail-subject-input').val(call_log_obj.subject);

                $('#detail-sale-code-select-box option').remove();
                $('#detail-sale-code-select-box').append(`<option selected>(${call_log_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${call_log_obj.opportunity.title}</option>`);

                $('#detail-account-select-box option').remove();
                $('#detail-account-select-box').append(`<option selected>${call_log_obj.customer.title}</option>`);

                $('#detail-contact-select-box option').remove();
                $('#detail-contact-select-box').append(`<option selected>${call_log_obj.contact.fullname}</option>`);

                let contact_get = contact_list.filter(function (item) {
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
                let email_obj = JSON.parse($('#opportunity_email_list').text()).filter(function (item) {
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
                let meeting_obj = JSON.parse($('#opportunity_meeting_list').text()).filter(function (item) {
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

            $(document).on('click', '.btn-create-related-feature', function () {
                let url = $(this).data('url') + "?opportunity={0}".format_by_idx(encodeURIComponent(JSON.stringify(paramString)));
                window.open(url, '_blank');
            })


            $(document).on('click', '.btn-add-document', function () {
                let url = $(this).data('url') + "?opportunity={0}".format_by_idx(encodeURIComponent(JSON.stringify(paramString)));
                window.open(url, '_blank');
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
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })
})
