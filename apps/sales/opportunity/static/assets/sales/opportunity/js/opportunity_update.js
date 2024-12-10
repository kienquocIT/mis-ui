$(document).ready(function () {
    const opp_title_Ele = $('#header-title')
    opp_title_Ele.on('mouseenter', function () {
        $(this).append('<button type="button" id="edit_opp_title" class="ml-2 btn btn-floating btn-icon btn-flush-primary btn-xs"><span class="icon"><i class="bi bi-pencil-square"></i></span></button>')
    })
    opp_title_Ele.on('mouseleave', function () {
        $(this).find('button').remove()
    })
    $(document).on('click', '#edit_opp_title', function () {
        let old_title = opp_title_Ele.text()
        opp_title_Ele.closest('div').addClass('col-12').html(`
            <input style="min-height: 50px; font-weight: bolder; font-size: xx-large" id="new_opp_title" class="text-primary form-control text-center" value="${old_title}">
        `)
    })

    let eleFrmPermit = $('#permit-member');
    $(document).on('click', '#btnOpenPermit', function () {
        eleFrmPermit.removeClass('hidden');
        document.getElementById('permit-member').scrollIntoView({
            behavior: 'smooth'
        });
    });

    const urlFactory = $('#url-factory');
    const transEle = $('#trans-factory');
    const pk = $.fn.getPkDetail();
    const frmDetail = $('#frm-detail');
    const rangeInputEle = $('#rangeInput');
    const checkInputRateEle = $('#check-input-rate');
    const inputRateEle = $('#input-rate');
    const table_timeline = $('#table-timeline');

    // variable for auto select stage
    let condition_is_quotation_confirm = false;
    let condition_sale_oder_approved = false;
    let condition_sale_oder_delivery_status = false;
    let list_stage = [];
    let dict_stage = {};

    OpportunityLoadDetail.configDateTimeEle()

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

    let list_stage_condition = []
    let config_is_input_rate = null;
    Promise.all([prm_detail, prm_config]).then(
        (results) => {
            $x.fn.hideLoadingPage();
            const opportunity_detail_data = results[0];

            if (opportunity_detail_data) {
                const target$ = $('#process-runtime-detail');
                $('#btn-collapse-process-show').on('click', function (){
                    if ($(this).attr('data-loaded') !== '1'){
                        $(this).attr('data-loaded', '1');
                        $.fn.callAjax2({
                            url: target$.data('url').replaceAll('__pk__', opportunity_detail_data?.['process']?.['id']),
                            method: 'GET',
                            isLoading: true,
                        }).then(resp => {
                            const detailData = $.fn.switcherResp(resp);
                            if (detailData) {
                                const processDetail = detailData?.['process_runtime_detail'] || {};
                                const clsProcess = new ProcessStages(target$, processDetail, {
                                    'debug': true,
                                    'enableAppInfoShow': true,
                                    'enableAppControl': true,
                                    'enableStagesInfoShow': true,
                                    'showCopyConfigData': false,
                                },);
                                clsProcess.init();
                            }
                        });
                    }
                    $(this).toggleClass('collapsed-active');
                    target$.slideToggle('slow');
                });

                $('.page-content').prop('hidden', false)

                if (opportunity_detail_data?.['is_deal_close'] === true) {
                    $('.page-content input, .page-content select, .page-content .btn').not($('#input-close-deal')).not($('#rangeInput')).prop('disabled', true);
                }

                const config = results[1];
                const config_is_select_stage = config.is_select_stage;
                const config_is_AM_create = config.is_account_manager_create;
                config_is_input_rate = config.is_input_win_rate;
                if (config_is_select_stage) {
                    $('#btn-auto-update-stage').hide();
                }

                async function loadDetail(opportunity_detail) {
                    $x.fn.showLoadingPage()
                    $x.fn.renderCodeBreadcrumb(opportunity_detail);

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

                    // init table
                    InitDataTables.loadDtbProduct();
                    InitDataTables.loadDtbCompetitor();
                    InitDataTables.loadDtbContactRole();

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

                    // store data detail
                    $('#data-detail').text(JSON.stringify(opportunity_detail));
                    $.fn.initMaskMoney2();
                    $x.fn.hideLoadingPage()
                }

                loadDetail(opportunity_detail_data).then(function () {
                    let is_lost = LoadConfigAndLoadStage.autoLoadStage(
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
                    if (is_lost) {
                        let ele_stage = $('.stage-lost')
                        ele_stage.addClass('stage-selected');
                        ele_stage.css('background-color', 'rgb(255,94,94)')
                        ele_stage.css('color', 'white')
                        ele_stage.next().css('border-left', '16px solid rgb(255,94,94)')
                    } else {
                        $('.stage-lost').removeClass('stage-selected');
                        $('.stage-lost').css('background-color', '#e7e7e7')
                        $('.stage-lost').css('color', '#6f6f6f')
                        $('.stage-lost').next().css('border-left', '16px solid #e7e7e7')
                    }
                });

                // even in timeline table
                $('#btn-refresh-activity').on('click', function () {
                    OpportunityActivity.loadDblActivityLogs();
                });
                $('#btn-create-related-feature').on('click', function () {
                    if ($(this).attr('data-call-check-perm') !== 'true') {
                        OpportunityLoadPage.checkPermissionAppRelated()
                    }
                })
                OpportunityActivity.loadDblActivityLogs();

                // even in tab product
                $('#tab_details_btn').on('click', function () {
                    if ($(this).attr('data-is-loaded') !== 'true') {
                        OpportunityLoadDetail.loadDetailTableProduct(opportunity_detail_data);
                        $('#input-product-pretax-amount').attr('value', opportunity_detail_data.total_product_pretax_amount);
                        $('#input-product-taxes').attr('value', opportunity_detail_data.total_product_tax);
                        $('#input-product-total').attr('value', opportunity_detail_data.total_product);
                        $('#estimated-gross-profit-percent').val(opportunity_detail_data?.['estimated_gross_profit_percent'])
                        $('#estimated-gross-profit-value').attr('value', opportunity_detail_data?.['estimated_gross_profit_value'])
                        $(this).attr('data-is-loaded', 'true')
                    }
                })
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
                OpportunityLoadDetail.estimated_gross_profit_percent_Ele.on('input', function () {
                    if ($(this).val()) {
                        $(this).val(parseFloat($(this).val()))
                        let value = parseFloat($('#input-product-pretax-amount').attr('value')) * parseFloat(OpportunityLoadDetail.estimated_gross_profit_percent_Ele.val()) / 100
                        $('#estimated-gross-profit-value').attr('value', value)
                        $.fn.initMaskMoney2()
                    }
                    else {
                        $(this).val(0)
                        $('#estimated-gross-profit-value').attr('value', 0)
                        $.fn.initMaskMoney2()
                    }
                })
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
                $(document).on('change', '.input-win-deal', function () {
                    let flag = false
                    $('.input-win-deal').each(function () {
                        if ($(this).prop('checked')) {
                            flag = true
                        }
                    })
                    if (flag) {
                        $('#check-lost-reason').prop('checked', true).prop('disabled', true)
                    } else {
                        $('#check-lost-reason').prop('checked', false).prop('disabled', false)
                    }
                })

                // event in tab competitor
                $('#tab_competitor_btn').on('click', function () {
                    if ($(this).attr('data-is-loaded') !== 'true') {
                        OpportunityLoadDetail.loadDetailTableCompetitor(opportunity_detail_data)
                        $(this).attr('data-is-loaded', 'true')
                    }
                })
                $('#btn-add-competitor').on('click', function () {
                    OpportunityLoadDetail.addRowCompetitor()
                })

                // event in tab contact role
                $('#tab_contact_role_btn').on('click', function () {
                    if ($(this).attr('data-is-loaded') !== 'true') {
                        OpportunityLoadDetail.loadDetailTableContactRole(opportunity_detail_data);
                        OpportunityLoadDropdown.loadFactor($('#box-select-factor'), opportunity_detail_data.customer_decision_factor);
                        $(this).attr('data-is-loaded', 'true')
                    }
                })
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

                // even in tab Lead sale team
                OpportunityLoadDetail.loadSaleTeam(opportunity_detail_data.members, true, opportunity_detail_data?.['sale_person'] || {});

                // even in tab Lead
                $('#tab_lead_btn').on('click', function () {
                    if ($(this).attr('data-is-loaded') !== 'true') {
                        OpportunityLoadPage.loadLeadList();
                        $(this).attr('data-is-loaded', 'true')
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
                $(document).on('click', '.btn-add-document', function () {
                    let url = $(this).data('url') + "?opportunity={0}".format_by_idx(encodeURIComponent(JSON.stringify({
                        'id': opportunity_detail_data.id,
                        'code': opportunity_detail_data.code,
                        'title': opportunity_detail_data.title,
                        'sale_person': opportunity_detail_data.sale_person,
                    })));
                    window.open(url, '_blank');
                })

                // event on click to create relate apps from opportunity (for cancel quotation - sale order)
                $('#dropdown-menu-relate-app').on('click', '.relate-app', function () {
                    OpportunityActivity.loadOpenRelateApp(this, table_timeline);
                })

                // tab add member for sale
                $('#btn-show-modal-add-member').on('click', async function () {
                    await OpportunityLoadDetail.loadMemberForDtb().then();
                })
                $('.mask-money').on('change', function () {
                    if ($(this).valCurrency() < 0) {
                        $.fn.notifyB({description: transEle.data('trans-limit-money')}, 'failure');
                        $(this).attr('value', 0);
                        $.fn.initMaskMoney2();
                    }
                })
                $('#input-close-date').on('change', function () {
                    let open_date = moment($('#input-open-date').val(), "DD/MM/YYYY").format('YYYY-MM-DD')
                    let close_date = moment($('#input-close-date').val(), "DD/MM/YYYY").format('YYYY-MM-DD')
                    if (close_date < open_date) {
                        $.fn.notifyB({description: $('#limit-close-date').text()}, 'failure')
                        $(this).val('')
                    }
                })
                $('#input-open-date').on('change', function () {
                    let open_date = moment($('#input-open-date').val(), "DD/MM/YYYY").format('YYYY-MM-DD')
                    let close_date = moment($('#input-close-date').val(), "DD/MM/YYYY").format('YYYY-MM-DD')
                    if (close_date < open_date) {
                        $.fn.notifyB({description: $('#limit-close-date').text()}, 'failure')
                        $(this).val('')
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
                                $('.stage-lost').removeClass('stage-selected');
                                $('.stage-lost').css('background-color', '#e7e7e7')
                                $('.stage-lost').css('color', '#6f6f6f')
                                $('.stage-lost').next().css('border-left', '16px solid #e7e7e7')
                                for (let i = 0; i <= ele_stage.length; i++) {
                                    if (i <= index) {
                                        if (!ele_stage.eq(i).hasClass('stage-lost')) {
                                            ele_stage.eq(i).addClass('stage-selected');
                                            ele_stage.eq(i).css('background-color', '#5a82b7')
                                            ele_stage.eq(i).css('color', 'white')
                                            ele_stage.eq(i).find('.dropdown span').css('color', 'white')
                                            ele_stage.eq(i).next().css('border-left', '16px solid #5a82b7')
                                        }
                                    } else {
                                        ele_stage.eq(i).removeClass('stage-selected');
                                        ele_stage.eq(i).css('background-color', '#e7e7e7')
                                        ele_stage.eq(i).css('color', '#6f6f6f')
                                        ele_stage.eq(i).find('.dropdown span').css('color', '#6f6f6f')
                                        ele_stage.eq(i).next().css('border-left', '16px solid #e7e7e7')
                                    }
                                }
                                OpportunityLoadPage.loadWinRate(dict_stage, checkInputRateEle, inputRateEle, rangeInputEle)
                            }
                        }
                    } else {
                        OpportunityLoadDetail.renderAlert($('#not-select-stage').text());
                    }
                })

                $('#btn-auto-update-stage').on('click', function () {
                    let is_lost = LoadConfigAndLoadStage.autoLoadStage(
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
                    if (is_lost) {
                        let ele_stage = $('.stage-lost')
                        ele_stage.addClass('stage-selected');
                        ele_stage.css('background-color', 'rgb(255,94,94)')
                        ele_stage.css('color', 'white')
                        ele_stage.next().css('border-left', '16px solid rgb(255,94,94)')
                    } else {
                        $('.stage-lost').removeClass('stage-selected');
                        $('.stage-lost').css('background-color', '#e7e7e7')
                        $('.stage-lost').css('color', '#6f6f6f')
                        $('.stage-lost').next().css('border-left', '16px solid #e7e7e7')
                    }
                    $.fn.notifyB({description: "Stage has just updated!"}, 'success')
                })
                $(document).on('change', '#input-close-deal', function () {
                    if ($(this).is(':checked')) {
                        $(this).closest('.sub-stage').addClass('stage-selected');
                        $(this).closest('.sub-stage').css('background-color', '#5a82b7')
                        $(this).closest('.sub-stage').css('color', 'white')
                        $(this).closest('.sub-stage').find('.dropdown span').css('color', 'white')
                        $(this).closest('.sub-stage').next().css('border-left', '16px solid #5a82b7')
                        $('.page-content input, .page-content select, .page-content .btn').not($(this)).not($('#rangeInput')).prop('disabled', true);
                    } else {
                        $(this).closest('.sub-stage').removeClass('stage-selected');
                        $(this).closest('.sub-stage').css('background-color', '#e7e7e7')
                        $(this).closest('.sub-stage').css('color', '#6f6f6f')
                        $(this).closest('.sub-stage').find('.dropdown span').css('color', '#6f6f6f')
                        $(this).closest('.sub-stage').next().css('border-left', '16px solid #e7e7e7')
                        $('.page-content input, .page-content select, .page-content .btn').not($(this)).not($('#rangeInput')).prop('disabled', false);
                        if ($('#check-agency-role').is(':checked')) {
                            $('#select-box-end-customer').prop('disabled', false);
                        } else {
                            $('#select-box-end-customer').prop('disabled', true);
                        }
                    }
                    OpportunityLoadPage.loadWinRate(dict_stage, checkInputRateEle, inputRateEle, rangeInputEle)
                })
                $('.item-detail-related-feature').on('click', function () {
                    if ($(this).attr('href') === '#') {
                        $(this).removeAttr('target');
                        OpportunityLoadDetail.renderAlert(`${$(this).text()} ${transEle.data('trans-not-created')}`);
                    }
                })

                SetupFormSubmit.validate($('#frm-add-member'), {
                    submitHandler: function (form) {
                        let frm = new SetupFormSubmit($(form));
                        let memberIds = OpportunityLoadPage.getDataMemberAddNew();
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
                })

                // for task
                const $form = $('#formOpportunityTask')
                Task_in_opps.init(opportunity_detail_data)
                SetupFormSubmit.validate($form, {
                    errorClass: 'is-invalid cl-red',
                    submitHandler: function (){
                        TaskSubmitFuncOpps($form, OpportunityActivity.loadDblActivityLogs)
                    }
                })
            }
        }
    )

    // submit form edit
    new SetupFormSubmit(frmDetail).validate({
        submitHandler: function (form) {
            WindowControl.showLoading();
            let frm = new SetupFormSubmit($(form));
            frm.dataForm = OpportunityLoadDetail.getDataForm(frm.dataForm);
            $.fn.callAjax2({
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: 'Successfully'}, 'success')
                        setTimeout(() => {
                            window.location.replace(frm.dataUrlRedirect.format_url_with_uuid($.fn.getPkDetail()));
                            location.reload.bind(location);
                        }, 1000);
                    }
                },
                (errs) => {
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                        },
                        1000
                    )
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })
})
