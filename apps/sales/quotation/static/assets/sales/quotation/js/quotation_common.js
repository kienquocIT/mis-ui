// Load data
class QuotationLoadDataHandle {
    static $form = $('#frm_quotation_create');
    static opportunitySelectEle = $('#opportunity_id');
    static processSelectEle$ = $('#process_id');
    static customerSelectEle = $('#customer_id');
    static contactSelectEle = $('#contact_id');
    static paymentSelectEle = $('#payment_term_id');
    static salePersonSelectEle = $('#employee_inherit_id');
    static quotationSelectEle = $('#quotation_id');
    static $btnSaveSelectProduct = $('#btn-save-select-product');
    static $eleStoreDetail = $('#quotation-detail-data');
    static transEle = $('#app-trans-factory');
    static urlEle = $('#app-url-factory');
    static customerInitEle = $('#data-init-customer');
    static $priceModal = $('#selectPriceModal');
    static $btnSavePrice = $('#btn-save-select-price');
    static $costModal = $('#selectCostModal');
    static $btnSaveCost = $('#btn-save-select-cost');
    static dataSuppliedBy = [{'id': 0, 'title': QuotationLoadDataHandle.transEle.attr('data-supplied-purchase')}, {'id': 1, 'title': QuotationLoadDataHandle.transEle.attr('data-supplied-make')}];
    static dataIssueInvoice = [
        {'id': '', 'title': 'Select...',},
        {'id': 1, 'title': '1'}, {'id': 2, 'title': '2'},
        {'id': 3, 'title': '3'}, {'id': 4, 'title': '4'},
        {'id': 5, 'title': '5'}, {'id': 6, 'title': '6'},
        {'id': 7, 'title': '7'}, {'id': 8, 'title': '8'},
        {'id': 9, 'title': '9'}, {'id': 10, 'title': '10'},
        {'id': 11, 'title': '11'}, {'id': 12, 'title': '12'},
    ];

    static loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
        let opts = {'allowClear': isClear};
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }
        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

    static loadCssS2($ele, maxWidth) {
        if ($ele.is("select") && $ele.hasClass("select2-hidden-accessible")) {
            let $render = $ele.next('.select2-container').find('.select2-selection__rendered');
            if ($render && $render.length > 0) {
                $render.css('max-width', maxWidth);
            }
        }
        return true;
    };

    static loadCustomCss() {
        $('.accordion-item').css({
            'margin-bottom': 0
        });
    };

    static loadEventCheckbox($area, trigger = false) {
        // Use event delegation for dynamically added elements
        $area.on('click', '.form-check', function (event) {
            // Prevent handling if the direct checkbox is clicked
            if (event.target.classList.contains('form-check-input')) {
                return; // Let the checkbox handler handle this
            }

            // Find the checkbox inside the clicked element
            let checkbox = this.querySelector('.form-check-input[type="checkbox"]');
            if (checkbox) {
                // Check if the checkbox is disabled
                if (checkbox.disabled) {
                    return; // Exit early if the checkbox is disabled
                }
                // Prevent the default behavior
                event.preventDefault();
                event.stopImmediatePropagation();

                // Toggle the checkbox state manually
                checkbox.checked = !checkbox.checked;
                // Optional: Trigger a change event if needed
                if (trigger === true) {
                    $(checkbox).trigger('change');
                }
            }
        });

        // Handle direct clicks on the checkbox itself
        $area.on('click', '.form-check-input', function (event) {
            // Prevent the default behavior to avoid double-triggering
            event.stopPropagation();
            event.stopImmediatePropagation();

            // Checkbox state is toggled naturally, so no need to modify it
            if (trigger === true) {
                $(this).trigger('change'); // Optional: Trigger change event explicitly
            }
        });

        return true;
    };

    static loadEventRadio($area) {
        // Use event delegation for dynamically added elements
        $area.on('click', '.form-check', function () {
            // Find and mark the radio button inside this group as checked
            let radio = this.querySelector('.form-check-input');
            if (radio) {
                let checkboxes = $area[0].querySelectorAll('.form-check-input[type="radio"]');
                // Uncheck all radio buttons and reset row styles
                for (let eleCheck of checkboxes) {
                    eleCheck.checked = false;
                }
                // Set the current radio button as checked and apply style
                radio.checked = true;
            }
        });
        return true;
    };

    static loadInitOpportunity() {
        let urlParams = $x.fn.getManyUrlParameters(['opp_id', 'opp_title', 'opp_code']);
        if (urlParams?.['opp_id'] && urlParams?.['opp_title'] && urlParams?.['opp_code']) {
            if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'post') {
                let list_from_app = 'quotation.quotation.create';
                if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                    list_from_app = 'saleorder.saleorder.create';
                }
                $.fn.callAjax2({
                        'url': QuotationLoadDataHandle.opportunitySelectEle.attr('data-url'),
                        'method': QuotationLoadDataHandle.opportunitySelectEle.attr('data-method'),
                        'data': {'list_from_app': list_from_app, 'id': urlParams?.['opp_id']},
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                                if (data.opportunity_list.length > 0) {
                                    if (!QuotationLoadDataHandle.opportunitySelectEle.prop('disabled')) {
                                        QuotationLoadDataHandle.opportunitySelectEle.trigger('change');
                                        QuotationLoadDataHandle.loadDataByOpportunity(data.opportunity_list[0]);
                                    }
                                    return true;
                                }
                                WindowControl.showForbidden();
                            }
                        }
                    }
                )
            }
        }
        return true;
    };

    static loadInitInherit() {
        let dataStr = $('#employee_current').text();
        if (dataStr) {
            QuotationLoadDataHandle.loadInitS2(QuotationLoadDataHandle.salePersonSelectEle, [JSON.parse(dataStr)]);
        }
        return true;
    };

    static loadDataByOpportunity(oppData) {
        let tableProduct = $('#datable-quotation-create-product');
        if ($(QuotationLoadDataHandle.opportunitySelectEle).val()) {
            QuotationLoadDataHandle.salePersonSelectEle[0].setAttribute('readonly', 'true');
            QuotationLoadDataHandle.customerSelectEle[0].setAttribute('readonly', 'true');
            QuotationLoadDataHandle.contactSelectEle[0].setAttribute('readonly', 'true');
            // load sale person
            QuotationLoadDataHandle.salePersonSelectEle.empty();
            QuotationLoadDataHandle.salePersonSelectEle.initSelect2({
                data: oppData?.['sale_person'],
                'allowClear': true,
            });
            // load customer
            if (QuotationLoadDataHandle.customerInitEle.val()) {
                let initCustomer = JSON.parse(QuotationLoadDataHandle.customerInitEle.val());
                QuotationLoadDataHandle.customerSelectEle.empty();
                QuotationLoadDataHandle.customerSelectEle.initSelect2({
                    data: initCustomer?.[oppData?.['customer']?.['id']],
                });
                QuotationLoadDataHandle.customerSelectEle.trigger('change');
            }
        } else {
            QuotationLoadDataHandle.salePersonSelectEle[0].removeAttribute('readonly');
            QuotationLoadDataHandle.customerSelectEle[0].removeAttribute('readonly');
            QuotationLoadDataHandle.contactSelectEle[0].removeAttribute('readonly');
        }
        // Delete all promotion rows
        deletePromotionRows(tableProduct, true, false);
        // Delete all shipping rows
        deletePromotionRows(tableProduct, false, true);
        // ReCheck Config when change Opportunity
        QuotationCheckConfigHandle.checkConfig(0);
        // check ProductBOM
        for (let eleProduct of QuotationDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-item')) {
            let dataProduct = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
            if (dataProduct) {
                let checkBOM = QuotationLoadDataHandle.loadCheckProductBOM(dataProduct);
                if (checkBOM?.['is_pass'] === false) {
                    if (eleProduct.closest('tr')) {
                        if (eleProduct.closest('tr').querySelector('.del-row')) {
                            $(eleProduct.closest('tr').querySelector('.del-row')).trigger('click');
                        }
                    }
                }
            }
        }
    };

    static loadInitCustomer() {
        let result = {};
        let ele = QuotationLoadDataHandle.customerInitEle;
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('account_sale_list') && Array.isArray(data.account_sale_list)) {
                        for (let customer of data.account_sale_list) {
                            if (!result.hasOwnProperty(customer?.['id'])) {
                                result[customer?.['id']] = customer;
                            }
                        }
                        ele.val(JSON.stringify(result));
                    }
                }
            }
        )
    };

    static loadBoxQuotationCustomer(dataCustomer = {}) {
        let data_filter = {};
        let employee_current_data = JSON.parse($('#employee_current').text());
        let sale_person_id = employee_current_data?.['id'];
        if (QuotationLoadDataHandle.salePersonSelectEle.val()) {
            sale_person_id = QuotationLoadDataHandle.salePersonSelectEle.val();
        }
        if (sale_person_id) {
            data_filter['employee__id'] = sale_person_id;
        }
        QuotationLoadDataHandle.loadInitS2(QuotationLoadDataHandle.customerSelectEle, [dataCustomer], data_filter);
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            if (!dataCustomer?.['is_copy']) {
                QuotationLoadDataHandle.loadDataProductAll();
            }
        }
    };

    static loadDataByCustomer() {
        let tableProduct = $('#datable-quotation-create-product');
        QuotationLoadDataHandle.loadBoxQuotationContact();
        QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
        QuotationLoadDataHandle.loadChangePaymentTerm();
        if (QuotationLoadDataHandle.customerSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, QuotationLoadDataHandle.customerSelectEle.val());
            if (dataSelected) {
                // load Shipping & Billing by Customer
                QuotationLoadDataHandle.loadShippingBillingCustomer();
                QuotationLoadDataHandle.loadShippingBillingCustomer(dataSelected);
                // clear shipping + billing text area
                $('#quotation-create-shipping-address')[0].value = '';
                $('#quotation-create-customer-shipping').val('');
                $('#quotation-create-billing-address')[0].value = '';
                $('#quotation-create-customer-billing').val('');
                // Store Account Price List
                if (Object.keys(dataSelected?.['price_list_mapped']).length !== 0) {
                    document.getElementById('customer-price-list').value = dataSelected?.['price_list_mapped']?.['id'];
                }
            }
        } else {
            document.getElementById('customer-price-list').value = "";
        }
        // Delete all promotion rows
        deletePromotionRows(tableProduct, true, false);
        // Delete all shipping rows
        deletePromotionRows(tableProduct, false, true);
        // load again price of product by customer price list then Re Calculate
        QuotationLoadDataHandle.loadDataProductAll();
    };

    static loadBoxQuotationContact(dataContact = {}, customerID = null) {
        if ($(QuotationLoadDataHandle.customerSelectEle).val() && Object.keys(dataContact).length === 0) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, $(QuotationLoadDataHandle.customerSelectEle).val());
            if (dataSelected) {
                if (dataSelected?.['contact_mapped']) {
                    if (Object.keys(dataSelected?.['contact_mapped']).length > 0) {
                        dataContact = dataSelected?.['contact_mapped'];
                    }
                }
                if (dataSelected?.['owner']) {
                    if (Object.keys(dataSelected?.['owner']).length > 0) {
                        dataContact = dataSelected?.['owner'];
                    }
                }
                customerID = dataSelected?.['id'];
            }
        }
        QuotationLoadDataHandle.contactSelectEle.empty();
        QuotationLoadDataHandle.contactSelectEle.initSelect2({
            data: dataContact,
            'dataParams': {'account_name_id': customerID},
            disabled: !(QuotationLoadDataHandle.contactSelectEle.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['fullname'] || '';
            },
        });
    };

    static loadBoxQuotationPaymentTerm() {
        QuotationLoadDataHandle.loadInitS2(QuotationLoadDataHandle.paymentSelectEle);
        if ($(QuotationLoadDataHandle.customerSelectEle).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, $(QuotationLoadDataHandle.customerSelectEle).val());
            if (dataSelected) {
                if (dataSelected?.['payment_term_customer_mapped']) {
                    QuotationLoadDataHandle.loadInitS2(QuotationLoadDataHandle.paymentSelectEle, [dataSelected?.['payment_term_customer_mapped']]);
                }
            }
        }
        return true;
    };

    static loadDataBySalePerson() {
        if (!QuotationLoadDataHandle.opportunitySelectEle.val()) {
            // load opp
            if (QuotationLoadDataHandle.salePersonSelectEle.val()) {
                QuotationLoadDataHandle.opportunitySelectEle.empty();
                QuotationLoadDataHandle.opportunitySelectEle.initSelect2({
                    'dataParams': {'employee_inherit': QuotationLoadDataHandle.salePersonSelectEle.val()},
                    'allowClear': true,
                    templateResult: function (state) {
                        let titleHTML = `<span>${state.data?.title ? state.data.title : "_"}</span>`
                        let codeHTML = `<span class="badge badge-soft-primary mr-2">${state.text ? state.text : "_"}</span>`
                        return $(`<span>${codeHTML} ${titleHTML}</span>`);
                    },
                });
            } else {
                QuotationLoadDataHandle.opportunitySelectEle.empty();
                QuotationLoadDataHandle.opportunitySelectEle.initSelect2({
                    'allowClear': true,
                    templateResult: function (state) {
                        let titleHTML = `<span>${state.data?.title ? state.data.title : "_"}</span>`
                        let codeHTML = `<span class="badge badge-soft-primary mr-2">${state.text ? state.text : "_"}</span>`
                        return $(`<span>${codeHTML} ${titleHTML}</span>`);
                    },
                });
            }
            // load customer, contact, payment
            QuotationLoadDataHandle.loadBoxQuotationCustomer();
            QuotationLoadDataHandle.loadBoxQuotationContact();
            QuotationLoadDataHandle.loadBoxQuotationPaymentTerm();
        }
    };

    static loadInitDate() {
        let currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();
        let formattedDate = `${day}/${month}/${year}`;
        $('#quotation-create-date-created').val(formattedDate)
    };

    static loadBoxQuotationPrice() {
        let ele = $('#select-box-quotation-create-price-list');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('price_list') && Array.isArray(data.price_list)) {
                        ele.append(`<option value=""></option>`);
                        data.price_list.map(function (item) {
                            let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                            ele.append(`<option value="${item.id}">
                                        <span class="opp-title">${item.title}</span>
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </option>`)
                        })
                    }
                }
            }
        )
    };

    static loadModalSProduct() {
        let fnData = [];
        WindowControl.showLoading();
        $.fn.callAjax2({
                'url': QuotationDataTableHandle.productInitEle.attr('data-url'),
                'method': QuotationDataTableHandle.productInitEle.attr('data-method'),
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('product_sale_list') && Array.isArray(data.product_sale_list)) {
                        for (let product of data.product_sale_list) {
                            if (product.hasOwnProperty('product_choice') && Array.isArray(product.product_choice)) {
                                if (product['product_choice'].includes(0)) {
                                    fnData.push(product);
                                }
                            }
                        }
                        QuotationDataTableHandle.$tableSProduct.DataTable().clear().draw();
                        QuotationDataTableHandle.$tableSProduct.DataTable().rows.add(fnData).draw();
                        QuotationDataTableHandle.productInitEle.val(JSON.stringify(fnData));
                        WindowControl.hideLoading();
                    }
                }
            }
        )
    };

    static loadCheckProductBOM(data) {
        let check = true;
        let note_type = 'data-product-note-2';
        if (QuotationLoadDataHandle.opportunitySelectEle.val()) {
            if (data?.['bom_check_data']?.['is_bom_opp'] === true) {
                if (data?.['bom_check_data']?.['is_so_finished'] === false && data?.['bom_data']?.['opportunity']?.['id'] !== QuotationLoadDataHandle.opportunitySelectEle.val()) {
                    check = false;
                }
                if (data?.['bom_check_data']?.['is_so_finished'] === true && data?.['bom_check_data']?.['is_so_using'] === true) {
                    check = false;
                }
            }
            // if (data?.['bom_check_data']?.['is_bom_opp'] === false) {
            //     if (data?.['bom_check_data']?.['is_bom'] === true) {
            //         check = false;
            //         note_type = 'data-product-note-3';
            //     }
            // }
        } else {
            if (data?.['bom_check_data']?.['is_bom_opp'] === true) {
                check = false;
                note_type = 'data-product-note-4';
            }
        }
        return {'is_pass': check, 'note_type': note_type};
    };

    static loadBoxQuotationProduct($ele, dataProduct = {}) {
        let dataDD = []
        if (QuotationDataTableHandle.productInitEle.val()) {
            dataDD = JSON.parse(QuotationDataTableHandle.productInitEle.val());
        }
        if (Object.keys(dataProduct).length > 0) {
            dataDD = dataProduct
        }
        $ele.initSelect2({
            data: dataDD,
        });
        // add css to select2_rendered
        QuotationLoadDataHandle.loadCssS2($ele, '260px');
    };

    static loadTableCopyQuotation(opp_id = null, sale_person_id = null) {
        let ele = $('#data-init-copy-quotation');
        let formSubmit = $('#frm_quotation_create');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $('#datable-copy-quotation').DataTable().destroy();
        if (sale_person_id) {
            let data_filter = {
                'employee_inherit': sale_person_id,
                'system_status__in': [2, 3].join(','),
            };
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'data': data_filter,
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('quotation_list') && Array.isArray(data.quotation_list)) {
                            let dataInit = data.quotation_list;
                            // check OppID to get canceled quotation in same Opp then concat 2 list data (only for Quotation pages)
                            if (opp_id && !formSubmit[0].classList.contains('sale-order')) {
                                data_filter = {'system_status': 4}
                                data_filter['opportunity'] = opp_id;
                                data_filter['opportunity__is_close_lost'] = false;
                                data_filter['opportunity__is_deal_close'] = false;
                                $.fn.callAjax2({
                                        'url': url,
                                        'method': method,
                                        'data': data_filter,
                                        'isDropdown': true,
                                    }
                                ).then(
                                    (resp) => {
                                        let data = $.fn.switcherResp(resp);
                                        if (data) {
                                            if (data.hasOwnProperty('quotation_list') && Array.isArray(data.quotation_list)) {
                                                let dataHasOpp = data.quotation_list.concat(dataInit);
                                                QuotationDataTableHandle.dataTableCopyQuotation(dataHasOpp);
                                                WindowControl.hideLoading();
                                            }
                                        }
                                    }
                                )
                            } else {
                                QuotationDataTableHandle.dataTableCopyQuotation(dataInit);
                                WindowControl.hideLoading();
                            }
                        }
                    }
                }
            )
        } else {
            QuotationDataTableHandle.dataTableCopyQuotation();
            WindowControl.hideLoading();
        }
        return true;
    };

    static loadShippingBillingCustomer(item = null) {
        let modalShippingContent = $('#quotation-create-modal-shipping-body')[0].querySelector('.modal-body');
        if (modalShippingContent) {
            $(modalShippingContent).empty();
            if (item) {
                for (let i = 0; i < item.shipping_address.length; i++) {
                    let shipping = item.shipping_address[i];
                    $(modalShippingContent).append(`<div class="ml-1 shipping-group">
                                                        <textarea class="form-control show-not-edit shipping-content disabled-custom-show mb-2" rows="3" cols="50" id="${shipping.id}" disabled>${shipping.full_address}</textarea>
                                                        <div class="d-flex justify-content-end">
                                                            <button type="button" class="btn btn-primary choose-shipping" data-bs-dismiss="modal" id="${shipping.id}" data-address="${shipping.full_address}">${QuotationLoadDataHandle.transEle.attr('data-select-address')}</button>
                                                        </div>
                                                    </div>
                                                    <br>`)
                }
            }
        }
        let modalBillingContent = $('#quotation-create-modal-billing-body')[0].querySelector('.modal-body');
        if (modalBillingContent) {
            $(modalBillingContent).empty();
            if (item) {
                for (let i = 0; i < item.billing_address.length; i++) {
                    let billing = item.billing_address[i];
                    $(modalBillingContent).append(`<div class="ml-1 billing-group">
                                                        <textarea class="form-control show-not-edit billing-content disabled-custom-show mb-2" rows="3" cols="50" id="${billing.id}" disabled>${billing.full_address}</textarea>
                                                        <div class="d-flex justify-content-end">
                                                            <button type="button" class="btn btn-primary choose-billing" data-bs-dismiss="modal" id="${billing.id}" data-address="${billing.full_address}">${QuotationLoadDataHandle.transEle.attr('data-select-address')}</button>
                                                        </div>
                                                    </div>
                                                    <br>`)
                }
            }
        }
    };

    // TABLE PRODUCT
    static loadAddRowProductGr() {
        let tableProduct = $('#datable-quotation-create-product');
        let order = tableProduct[0].querySelectorAll('.table-row-group').length + 1;
        let dataAdd = {
            "group_title": '',
            "is_group": true,
            'group_order': order,
        }
        let newRow = tableProduct.DataTable().row.add(dataAdd).draw().node();
        $(newRow).find('td:eq(1)').attr('colspan', 2);
        return true;
    };

    static loadOnBlurGroupTitleEdit(ele) {
        let row = ele.closest('tr');
        let areaGroupShow = row.querySelector('.area-group-show');
        if (areaGroupShow) {
            let groupShow = areaGroupShow.querySelector('.table-row-group-title-show');
            if (groupShow) {
                areaGroupShow.classList.remove('hidden');
                groupShow.innerHTML = ele.value;
                ele.setAttribute('hidden', 'true');
            }
        }
        return true;
    };

    static loadOnClickBtnEditGroup(ele) {
        let row = ele.closest('tr');
        let areaGroupShow = row.querySelector('.area-group-show');
        let groupEdit = row.querySelector('.table-row-group-title-edit');
        if (areaGroupShow && groupEdit) {
            areaGroupShow.classList.add('hidden');
            groupEdit.removeAttribute('hidden');
        }
        return true;
    };

    static loadProductAfterDelGroup(ele) {
        let $table = $('#datable-quotation-create-product');
        let dataTarget = ele.getAttribute('data-bs-target');
        let dataTargetNoDot = dataTarget.replace(".", "");
        if (dataTarget) {
            let upperGroupsClass = QuotationLoadDataHandle.decrementGroupString(dataTargetNoDot);
            for (let upperGroupClass of upperGroupsClass) {
                let upperGroupClassDot = '.' + upperGroupClass;
                let dataGrOrder = upperGroupClass.replace("group-", "");
                if ($table[0].querySelector(`[data-bs-target="${upperGroupClassDot}"]`)) {
                    for (let row of $table[0].querySelectorAll(dataTarget)) {
                        // Update the class
                        row.classList.remove(dataTargetNoDot);
                        row.classList.add(upperGroupClass);
                        // Update the data attribute
                        row.setAttribute('data-group', dataGrOrder);
                    }
                    break;
                }
            }
        }
    };

    static decrementGroupString(str) {
        let match = str.match(/(\d+)$/);
        if (match) {
            let number = parseInt(match[0], 10);
            if (!isNaN(number) && number > 1) {
                let result = [];
                let resultFinal = [];
                for (let i = 1; i < number; i++) {
                    let strLower = str.replace(/\d+$/, i);
                    result.push(strLower);
                }
                resultFinal = result.reverse();
                return resultFinal;
            }
        }
        return [str];
    };

    static loadNewProduct() {
        QuotationDataTableHandle.$tableSProduct.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-checkbox:checked:not([disabled])')) {
                if (row.querySelector('.table-row-checkbox').getAttribute('data-row')) {
                    let dataRow = JSON.parse(row.querySelector('.table-row-checkbox').getAttribute('data-row'));
                    if (!QuotationDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${dataRow?.['id']}"]`)) {
                        QuotationLoadDataHandle.loadAddRowProduct(dataRow);
                    }
                }
            }
        });
        return true;
    };

    static loadAddRowProduct(data) {
        // delete all Promotion rows
        deletePromotionRows(QuotationDataTableHandle.$tableProduct, true, false);
        // Delete all shipping rows
        deletePromotionRows(QuotationDataTableHandle.$tableProduct, false, true);
        // ReCalculate Total
        QuotationCalculateCaseHandle.updateTotal(QuotationDataTableHandle.$tableProduct[0]);
        let TotalOrder = QuotationDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-order').length;
        let TotalGroup = QuotationDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-group').length;
        let order = (TotalOrder - TotalGroup) + 1;
        let dataAdd = {
            "order": order,
            "product_data": data,
            "product_quantity": 0,
            "product_uom_code": "",
            "product_tax_title": "",
            "product_tax_value": 0,
            "product_uom_title": "",
            "product_tax_amount": 0,
            "product_unit_price": 0,
            "product_description": "",
            "product_discount_value": 0,
            "product_subtotal_price": 0,
            "product_discount_amount": 0,
        }
        let newRow = QuotationDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
        // check disable
        QuotationDataTableHandle.$tableProduct.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
        // check config for new row
        QuotationCheckConfigHandle.checkConfig(1, newRow);
        // load data dropdown
        let eleProduct = newRow.querySelector('.table-row-item');
        let eleUOM = newRow.querySelector('.table-row-uom');
        let eleTax = newRow.querySelector('.table-row-tax');

        if (eleProduct) {
            QuotationLoadDataHandle.loadInitS2($(eleProduct), [data]);
            QuotationLoadDataHandle.loadCssS2($(eleProduct), '260px');
            $(eleProduct).attr('data-product-id', data?.['id']);
        }
        if (eleUOM) {
            QuotationLoadDataHandle.loadInitS2($(eleUOM));
        }
        if (eleTax) {
            QuotationLoadDataHandle.loadInitS2($(eleTax));
        }

        $(eleProduct).trigger('change');
        // load again table cost
        // QuotationLoadDataHandle.loadDataTableCost();
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
        // add classes for collapse
        let eleGroups = QuotationDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-group');
        if (eleGroups) {
            let lastGroup = eleGroups[eleGroups.length - 1];
            if (lastGroup) {
                let classGroupDot = lastGroup.getAttribute('data-bs-target');
                let dataGroupOrder = lastGroup.getAttribute('data-group-order');
                if (classGroupDot) {
                    let classGroup = classGroupDot.replace(".", "");
                    newRow.classList.add('collapse');
                    newRow.classList.add(classGroup);
                    newRow.classList.add('show');
                    newRow.setAttribute('data-group', dataGroupOrder);
                }
            }
        }
        return true;
    };

    static loadDataProductSelect(ele) {
        if (ele.val()) {
            let productData = SelectDDControl.get_data_from_idx(ele, ele.val());
            if (productData) {
                let data = productData;
                data['unit_of_measure'] = data?.['sale_information']?.['default_uom'];
                data['uom_group'] = data?.['general_information']?.['uom_group'];
                data['tax'] = data?.['sale_information']?.['tax_code'];
                let description = ele[0].closest('tr').querySelector('.table-row-description');
                let uom = ele[0].closest('tr').querySelector('.table-row-uom');
                let price = ele[0].closest('tr').querySelector('.table-row-price');
                let modalBody = QuotationLoadDataHandle.$priceModal[0].querySelector('.modal-body');
                let tax = ele[0].closest('tr').querySelector('.table-row-tax');
                // load Description
                if (description) {
                    description.innerHTML = data?.['description'] ? data?.['description'] : '';
                }
                // load UOM
                if (uom && data?.['unit_of_measure'] && data?.['uom_group']) {
                    $(uom).empty();
                    QuotationLoadDataHandle.loadInitS2($(uom), [data?.['unit_of_measure']], {'group': data?.['uom_group']?.['id']});
                } else {
                    QuotationLoadDataHandle.loadInitS2($(uom));
                }
                // load PRICE
                if (price && modalBody) {
                    let lastPrice = QuotationLoadDataHandle.loadPriceProduct(ele[0]);
                    $(price).attr('value', String(lastPrice));
                }
                // load TAX
                if (tax && data?.['tax']) {
                    $(tax).empty();
                    QuotationLoadDataHandle.loadInitS2($(tax), [data?.['tax']]);
                } else {
                    QuotationLoadDataHandle.loadInitS2($(tax));
                }
            }
            $.fn.initMaskMoney2();
        }
    };

    static loadPriceProduct(eleProduct) {
        let $form = $('#frm_quotation_create');
        let dataZone = "quotation_products_data";
        if ($form[0].classList.contains('sale-order')) {
            dataZone = "sale_order_products_data";
        }
        if ($(eleProduct).val()) {
            let productData = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
            let is_change_price = false;
            let row = eleProduct.closest('tr');
            if (productData && row) {
                let data = productData;
                let priceGr = row.querySelector('.input-group-price');
                let price = row.querySelector('.table-row-price');
                let modalBody= QuotationLoadDataHandle.$priceModal[0].querySelector('.modal-body');
                // load PRICE
                if (priceGr && price && modalBody) {
                    let account_price_id = null;
                    let dataAcc = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, QuotationLoadDataHandle.customerSelectEle.val());
                    if (dataAcc) {
                        if (dataAcc?.['price_list_mapped']?.['id']) {
                            account_price_id = dataAcc?.['price_list_mapped']?.['id']
                        }
                    }
                    let current_price_checked = price.getAttribute('value');
                    let lastPrice = 0;
                    $(modalBody).empty();
                    let htmlPriceList = `<div class="mb-4 product-target" data-product-id="${productData?.['id']}"><i class="fas fa-cube mr-2"></i><b>${productData?.['title']}</b></div>`;
                    if (Array.isArray(data?.['price_list']) && data?.['price_list'].length > 0) {
                        let typeChecked = 0;
                        if (priceGr.getAttribute('data-price-id')) {
                            typeChecked = 1;
                        }
                        for (let priceData of data?.['price_list']) {
                            if (priceData?.['price_status'] === 1) {
                                let checked = '';
                                if (typeChecked === 0) {  // load default
                                    if (account_price_id) {
                                        if (priceData?.['id'] === account_price_id) { // check CUSTOMER_PRICE then set customer_price
                                            lastPrice = parseFloat(priceData?.['value']);
                                            checked = 'checked';
                                        }
                                    } else {
                                        if (priceData?.['is_default'] === true) { // check GENERAL_PRICE_LIST OF PRODUCT then set general_price
                                            lastPrice = parseFloat(priceData?.['value']);
                                            checked = 'checked';
                                        }
                                    }
                                }
                                if (typeChecked === 1) {  // load check before
                                    if (row.querySelector(`.input-group-price[data-price-id="${priceData?.['id']}"]`)) {
                                        checked = 'checked';
                                    }
                                }
                                htmlPriceList += `<div class="d-flex justify-content-between align-items-center">
                                                    <div class="form-check form-check-lg">
                                                        <input type="radio" name="row-price-option" class="form-check-input table-row-price-option" id="price-${priceData?.['id'].replace(/-/g, "")}" data-value="${parseFloat(priceData?.['value'])}" data-price="${JSON.stringify(priceData).replace(/"/g, "&quot;")}" data-zone="${dataZone}" ${checked}>
                                                        <label class="form-check-label" for="price-${priceData?.['id'].replace(/-/g, "")}">${priceData?.['title']}</label>
                                                    </div>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <span class="mask-money mr-2" data-init-money="${parseFloat(priceData?.['value'])}"></span>
                                                        <span class="mr-2">/</span>
                                                        <span class="badge badge-light">${priceData?.['uom']?.['title']}</span>
                                                    </div>
                                                </div>`;
                            }
                        }
                    }
                    $(modalBody).append(`${htmlPriceList}`);
                    // If change price then remove promotion & shipping
                    if (current_price_checked !== price.getAttribute('value')) {
                        is_change_price = true;
                    }
                    if (is_change_price === true) {
                        let tableProduct = document.getElementById('datable-quotation-create-product');
                        deletePromotionRows($(tableProduct), true, false);
                        deletePromotionRows($(tableProduct), false, true);
                    }
                    QuotationLoadDataHandle.loadEventRadio(QuotationLoadDataHandle.$priceModal);
                    $.fn.initMaskMoney2();
                    return lastPrice;
                }
            }
        }
        $.fn.initMaskMoney2();
        return 0;
    };

    static loadAPIDetailQuotation(select_id) {
        let ele = $('#data-init-copy-quotation');
        let url = ele.attr('data-url-detail').format_url_with_uuid(select_id);
        let method = ele.attr('data-method');
        WindowControl.showLoading();
        $.fn.callAjax2(
            {
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#data-copy-quotation-detail').val(JSON.stringify(data));
                    WindowControl.hideLoading();
                }
            }
        )
    };

    static loadTotal(data, is_product, is_cost, is_expense) {
        let pretax = null;
        let tax = null;
        let total = null;
        let discount = null;
        let pretaxRaw = null;
        let taxRaw = null;
        let totalRaw = null;
        let discountRaw = null;
        let discountRate = null;
        let discountRateCopy = document.getElementById('quotation-copy-discount-on-total');
        let finalRevenueBeforeTax = null;
        if (is_product === true) {
            let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
            if (tableProductWrapper) {
                let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                if (tableProductFt) {
                    pretax = tableProductFt.querySelector('.quotation-create-product-pretax-amount');
                    tax = tableProductFt.querySelector('.quotation-create-product-taxes');
                    total = tableProductFt.querySelector('.quotation-create-product-total');
                    discount = tableProductFt.querySelector('.quotation-create-product-discount-amount');
                    pretaxRaw = tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw');
                    taxRaw = tableProductFt.querySelector('.quotation-create-product-taxes-raw');
                    totalRaw = tableProductFt.querySelector('.quotation-create-product-total-raw');
                    discountRaw = tableProductFt.querySelector('.quotation-create-product-discount-amount-raw');
                    discountRate = tableProductFt.querySelector('.quotation-create-product-discount');
                    finalRevenueBeforeTax = tableProductFt.querySelector('.quotation-final-revenue-before-tax');
                }
            }
        } else if (is_cost === true) {
            let tableCost = document.getElementById('datable-quotation-create-cost');
            pretax = tableCost.querySelector('.quotation-create-cost-pretax-amount');
            tax = tableCost.querySelector('.quotation-create-cost-taxes');
            total = tableCost.querySelector('.quotation-create-cost-total');
            pretaxRaw = tableCost.querySelector('.quotation-create-cost-pretax-amount-raw');
            taxRaw = tableCost.querySelector('.quotation-create-cost-taxes-raw');
            totalRaw = tableCost.querySelector('.quotation-create-cost-total-raw');
        } else if (is_expense === true) {
            let tableExpenseWrapper = document.getElementById('datable-quotation-create-expense_wrapper');
            if (tableExpenseWrapper) {
                let tableExpenseFt = tableExpenseWrapper.querySelector('.dataTables_scrollFoot');
                pretax = tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount');
                tax = tableExpenseFt.querySelector('.quotation-create-expense-taxes');
                total = tableExpenseFt.querySelector('.quotation-create-expense-total');
                pretaxRaw = tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount-raw');
                taxRaw = tableExpenseFt.querySelector('.quotation-create-expense-taxes-raw');
                totalRaw = tableExpenseFt.querySelector('.quotation-create-expense-total-raw');
            }
        }
        if (pretax && pretaxRaw && tax && taxRaw && total && totalRaw) {
            // pretax
            if (is_product === true) {
                $(pretax).attr('data-init-money', String(data.total_product_pretax_amount));
                pretaxRaw.value = data.total_product_pretax_amount
            } else if (is_cost === true) {
                $(pretax).attr('data-init-money', String(data.total_cost_pretax_amount));
                pretaxRaw.value = data.total_cost_pretax_amount
            } else if (is_expense === true) {
                $(pretax).attr('data-init-money', String(data.total_expense_pretax_amount));
                pretaxRaw.value = data.total_expense_pretax_amount
            }
            // discount
            if (discount && discountRaw && discountRate) {
                $(discount).attr('data-init-money', String(data.total_product_discount));
                discountRaw.value = data.total_product_discount;
                discountRate.value = data.total_product_discount_rate;
                discountRateCopy.value = data.total_product_discount_rate;
            }
            // tax
            if (is_product === true) {
                $(tax).attr('data-init-money', String(data.total_product_tax));
                taxRaw.value = data.total_product_tax
            } else if (is_cost === true) {
                $(tax).attr('data-init-money', String(data.total_cost_tax));
                taxRaw.value = data.total_cost_tax
            } else if (is_expense === true) {
                $(tax).attr('data-init-money', String(data.total_expense_tax));
                taxRaw.value = data.total_expense_tax
            }
            // total
            if (is_product === true) {
                $(total).attr('data-init-money', String(data.total_product));
                totalRaw.value = data.total_product
            } else if (is_cost === true) {
                $(total).attr('data-init-money', String(data.total_cost));
                totalRaw.value = data.total_cost
            } else if (is_expense === true) {
                $(total).attr('data-init-money', String(data.total_expense));
                totalRaw.value = data.total_expense
            }
            // load total revenue before tax for tab product
            if (finalRevenueBeforeTax) {
                finalRevenueBeforeTax.value = data.total_product_revenue_before_tax;
            }
        }
        $.fn.initMaskMoney2();
    };

    static loadRowDisabled(row) {
        if (row.querySelector('.table-row-item')) {
            row.querySelector('.table-row-item').setAttribute('readonly', 'true');
        }
        if (row.querySelector('.table-row-uom')) {
            row.querySelector('.table-row-uom').setAttribute('readonly', 'true');
        }
        if (row.querySelector('.table-row-quantity')) {
            row.querySelector('.table-row-quantity').setAttribute('readonly', 'true');
        }
        if (row.querySelector('.table-row-price')) {
            row.querySelector('.table-row-price').setAttribute('readonly', 'true');
        }
        if (row.querySelector('.input-group-price')) {
            row.querySelector('.input-group-price').setAttribute('disabled', 'true');
        }
        if (row.querySelector('.table-row-discount')) {
            row.querySelector('.table-row-discount').setAttribute('readonly', 'true');
        }
        if (row.querySelector('.table-row-tax')) {
            row.querySelector('.table-row-tax').setAttribute('readonly', 'true');
        }
    };

    static loadReInitDataTableProduct() {
        let tableData = [];
        let dataDetail = {};
        let dataPriceJSON = {};
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['quotation_products_data']) {
                        tableData = dataDetail?.['quotation_products_data'];
                    }
                    if (dataDetail?.['sale_order_products_data']) {
                        tableData = dataDetail?.['sale_order_products_data'];
                    }
                }
            }
        } else {
            QuotationDataTableHandle.$tableProduct.DataTable().rows().every(function () {
                let row = this.node();
                let eleOrder = row.querySelector('.table-row-order');
                let eleProduct = row.querySelector('.table-row-item');
                if (eleOrder.getAttribute('data-row')) {
                    let dataRow = JSON.parse(eleOrder.getAttribute('data-row'));
                    tableData.push(dataRow);
                    // setup price
                    if (eleProduct) {
                        if (dataRow?.['order'] && dataRow?.['product_unit_price']) {
                            if (!dataPriceJSON.hasOwnProperty(dataRow?.['order'])) {
                                dataPriceJSON[dataRow?.['order']] = dataRow?.['product_unit_price'];
                            }
                        }
                    }
                }
            })
        }
        QuotationDataTableHandle.$tableProduct.DataTable().destroy();
        QuotationDataTableHandle.dataTableProduct();
        if (tableData.length === 0 && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['quotation_products_data']) {
                        tableData = dataDetail?.['quotation_products_data'];
                    }
                    if (dataDetail?.['sale_order_products_data']) {
                        tableData = dataDetail?.['sale_order_products_data'];
                    }
                }
            }
        }
        QuotationDataTableHandle.$tableProduct.DataTable().rows.add(tableData).draw();
        // load dropdowns
        QuotationLoadDataHandle.loadDropDowns(QuotationDataTableHandle.$tableProduct);
        // load price
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            QuotationLoadDataHandle.loadReInitPrice(dataPriceJSON);
        }
        QuotationDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let eleOrder = row.querySelector('.table-row-order');
            let eleGroup = row.querySelector('.table-row-group');
            let eleProduct = row.querySelector('.table-row-item');
            let eleShipping = row.querySelector('.table-row-shipping');
            let elePromotion = row.querySelector('.table-row-promotion');

            QuotationCheckConfigHandle.checkConfig(1, row);

            if (eleOrder) {
                let dataRowRaw = eleOrder.getAttribute('data-row');
                if (dataRowRaw) {
                    let dataRow = JSON.parse(dataRowRaw);
                    // load product group
                    if (eleGroup) {
                        let eleGroupEdit = row.querySelector('.table-row-group-title-edit');
                        let areaGroupShow = row.querySelector('.area-group-show');
                        if (eleGroupEdit && areaGroupShow) {
                            let groupShow = areaGroupShow.querySelector('.table-row-group-title-show');
                            if (groupShow) {
                                areaGroupShow.classList.remove('hidden');
                                eleGroupEdit.setAttribute('hidden', 'true');
                            }
                        }
                        $(row).find('td:eq(1)').attr('colspan', 2);
                    }
                    if (eleProduct) {
                        QuotationLoadDataHandle.loadCssS2($(eleProduct), '260px');
                        QuotationLoadDataHandle.loadPriceProduct(eleProduct);
                        let dataGroup = dataRow?.['group_order'];
                        if (dataGroup) {
                            let classGroup = 'group-' + dataGroup;
                            row.classList.add('collapse');
                            row.classList.add(classGroup);
                            row.classList.add('show');
                            row.setAttribute('data-group', dataGroup);
                        }
                    }
                    if (eleShipping) {
                        QuotationLoadDataHandle.loadRowDisabled(row);
                    }
                    if (elePromotion) {
                        QuotationLoadDataHandle.loadRowDisabled(row);
                    }
                }
            }
        });
        // load disabled if page detail
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            QuotationLoadDataHandle.loadTableDisabled(QuotationDataTableHandle.$tableProduct);
        }
        $.fn.initMaskMoney2();
        // set again WF runtime
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitDataTableExpense() {
        let tableData = [];
        let dataDetail = {};
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['quotation_expenses_data']) {
                        tableData = dataDetail?.['quotation_expenses_data'];
                    }
                    if (dataDetail?.['sale_order_expenses_data']) {
                        tableData = dataDetail?.['sale_order_expenses_data'];
                    }
                }
            }
        } else {
            QuotationDataTableHandle.$tableExpense.DataTable().rows().every(function () {
                let row = this.node();
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder.getAttribute('data-row')) {
                    let dataRow = JSON.parse(eleOrder.getAttribute('data-row'));
                    tableData.push(dataRow);
                }
            })
        }
        QuotationDataTableHandle.$tableExpense.DataTable().destroy();
        QuotationDataTableHandle.dataTableExpense();
        if (tableData.length === 0 && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['quotation_expenses_data']) {
                        tableData = dataDetail?.['quotation_expenses_data'];
                    }
                    if (dataDetail?.['sale_order_expenses_data']) {
                        tableData = dataDetail?.['sale_order_expenses_data'];
                    }
                }
            }
        }
        QuotationDataTableHandle.$tableExpense.DataTable().rows.add(tableData).draw();
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            QuotationLoadDataHandle.loadTableDisabled(QuotationDataTableHandle.$tableExpense);
        }
        QuotationLoadDataHandle.loadDropDowns(QuotationDataTableHandle.$tableExpense);
        $.fn.initMaskMoney2();
        // set again WF runtime
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitDataTablePayment() {
        let tableData = [];
        let dataDetail = {};
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    tableData = dataDetail?.['sale_order_payment_stage'];
                }
            }
        } else {
            QuotationDataTableHandle.$tablePayment.DataTable().rows().every(function () {
                let row = this.node();
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder.getAttribute('data-row')) {
                    let dataRow = JSON.parse(eleOrder.getAttribute('data-row'));
                    tableData.push(dataRow);
                }
            })
        }
        QuotationDataTableHandle.$tablePayment.DataTable().destroy();
        QuotationDataTableHandle.dataTablePaymentStage();
        if (tableData.length === 0 && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    tableData = dataDetail?.['sale_order_payment_stage'];
                }
            }
        }
        QuotationDataTableHandle.$tablePayment.DataTable().rows.add(tableData).draw();
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            QuotationLoadDataHandle.loadTableDisabled(QuotationDataTableHandle.$tablePayment);
        }
        QuotationLoadDataHandle.loadDropDowns(QuotationDataTableHandle.$tablePayment);
        $.fn.initMaskMoney2();
        // set again WF runtime
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitPrice(data) {
        let $table = $('#datable-quotation-create-product');
        $table.DataTable().rows().every(function () {
            let row = this.node();
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                let order = parseInt(eleOrder.innerHTML);
                let value = data[order];
                for (let elePriceOption of row.querySelectorAll('.table-row-price-option')) {
                    let valueOptionStr = elePriceOption.getAttribute('data-value');
                    if (valueOptionStr) {
                        let valueOption = parseFloat(valueOptionStr);
                        if (valueOption === value) {
                            elePriceOption.click();
                            break;
                        }
                    }
                }
            }
        });
    };

    // PAYMENT TERM
    static loadBalanceValPaymentTerm() {
        let totalValue = 0;
        let term = [];
        if (QuotationLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
            if (dataSelected) {
                term = dataSelected?.['term'];
                for (let termDataCheck of term) {
                    if (parseFloat(termDataCheck?.['value'])) {
                        totalValue += parseFloat(termDataCheck?.['value']);
                    }
                }
            }
        }
        return 100 - totalValue;
    };

    static loadChangePaymentTerm() {
        let formSubmit = $('#frm_quotation_create');
        if (formSubmit[0].classList.contains('sale-order') && formSubmit.attr('data-method').toLowerCase() !== 'get') {
            let $table = $('#datable-quotation-payment-stage');
            let term = [];
            if (QuotationLoadDataHandle.paymentSelectEle.val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
                if (dataSelected) {
                    term = dataSelected?.['term'];
                    let dataDateType = JSON.parse($('#payment_date_type').text());
                    for (let termData of term) {
                        // termData['title'] = dataDateType[termData?.['after']][1];
                        let isNum = parseFloat(termData?.['value']);
                        if (!isNum) {  // balance
                            termData['value'] = String(QuotationLoadDataHandle.loadBalanceValPaymentTerm());
                        }
                    }
                }
            }
            $table.DataTable().rows().every(function () {
                let row = this.node();
                let eleInstallment = row.querySelector('.table-row-installment');
                if (eleInstallment) {
                    eleInstallment.removeAttribute('disabled');
                    QuotationLoadDataHandle.loadInitS2($(eleInstallment), term, {}, null, true);
                    $(eleInstallment).val('').trigger('change');
                }
            });
        }
    };

    // TABLE PAYMENT STAGE
    static loadAddPaymentStage() {
        let order = QuotationDataTableHandle.$tablePayment[0].querySelectorAll('.table-row-order').length + 1;
        let dataAdd = {
            'order': order,
            'payment_ratio': 0,
            'value_before_tax': 0,
            'is_ar_invoice': false,
        };
        let newRow = QuotationDataTableHandle.$tablePayment.DataTable().row.add(dataAdd).draw().node();
        if (newRow) {
            // load datePicker
            let eleDate = newRow.querySelector('.table-row-date');
            if (eleDate) {
                $(eleDate).daterangepicker({
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
                $(eleDate).val(null).trigger('change');
            }
            let eleDueDate = newRow.querySelector('.table-row-due-date');
            if (eleDueDate) {
                $(eleDueDate).daterangepicker({
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
                $(eleDueDate).val(null).trigger('change');
            }
            // installment
            let term = [];
            if (QuotationLoadDataHandle.paymentSelectEle.val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
                if (dataSelected) {
                    term = dataSelected?.['term'];
                    for (let termData of term) {
                        let isNum = parseFloat(termData?.['value']);
                        if (!isNum) {  // balance
                            termData['value'] = String(QuotationLoadDataHandle.loadBalanceValPaymentTerm());
                        }
                    }
                }
            }
            let eleInstallment = newRow.querySelector('.table-row-installment');
            if (eleInstallment) {
                QuotationLoadDataHandle.loadInitS2($(eleInstallment), term, {}, null, true);
                $(eleInstallment).val('').trigger('change');
            }
            // issue invoice
            let count = QuotationDataTableHandle.$tablePayment.DataTable().data().count();
            let dataIssue = [{'id': '', 'title': 'Select...',}];
            for (let i = 1; i <= count; i++) {
                let add = {'id': String(i), 'title': String(i)};
                dataIssue.push(add);
            }
            let eleIssueInvoice = newRow.querySelector('.table-row-issue-invoice');
            if (eleIssueInvoice) {
                QuotationLoadDataHandle.loadInitS2($(eleIssueInvoice), dataIssue, {}, null, true);
            }
            // mask money
            $.fn.initMaskMoney2();
        }
        return true;
    };

    static loadChangePSInstallment(ele) {
        let row = ele.closest('tr');
        let dataDateType = JSON.parse($('#payment_date_type').text());
        let eleDateType = row.querySelector('.table-row-date-type');
        let eleRatio = row.querySelector('.table-row-ratio');
        let eleDate = row.querySelector('.table-row-date');
        let eleValueBT = row.querySelector('.table-row-value-before-tax');
        let eleDueDate = row.querySelector('.table-row-due-date');
        if ($(ele).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx($(ele), $(ele).val());
            if (eleDateType && eleRatio && eleDate && eleValueBT && eleDueDate && dataSelected && dataDateType) {
                $(eleDateType).val(dataDateType[dataSelected?.['after']][1]);
                eleRatio.setAttribute('readonly', 'true');
                if (dataSelected?.['value']) {
                    eleRatio.value = parseFloat(dataSelected?.['value']);
                }
                QuotationLoadDataHandle.loadPSValueBeforeTax(eleValueBT, dataSelected?.['value']);
                eleDueDate.setAttribute('disabled', 'true');
                let date = $(eleDate).val();
                if (date && dataSelected?.['no_of_days']) {
                    let dueDate = calculateDate(date, {'number_day_after': parseInt(dataSelected?.['no_of_days'])});
                    if (dueDate) {
                        $(eleDueDate).val(dueDate);
                    }
                }
            }
        } else {
            if (eleRatio && eleValueBT && eleDueDate) {
                eleRatio.removeAttribute('readonly');
                eleDueDate.removeAttribute('disabled');
            }
        }
        // mask money
        $.fn.initMaskMoney2();
        return true;
    };

    static loadChangePSDate(ele) {
        let row = ele.closest('tr');
        let eleDueDate = row.querySelector('.table-row-due-date');
        let eleInstallment = row.querySelector('.table-row-installment');
        if (eleDueDate && eleInstallment) {
            if ($(eleInstallment).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx($(eleInstallment), $(eleInstallment).val());
                if (dataSelected) {
                    let date = $(ele).val();
                    if (date && dataSelected?.['no_of_days']) {
                        let dueDate = calculateDate(date, {'number_day_after': parseInt(dataSelected?.['no_of_days'])});
                        if (dueDate) {
                            $(eleDueDate).val(dueDate);
                        }
                    }
                }
            }
        }
        return true;
    };

    static loadChangePSIssueInvoice(ele) {
        let rowFocus = ele.closest('tr');
        if (rowFocus) {
            let eleValueATFocus = rowFocus.querySelector('.table-row-value-after-tax');
            if (eleValueATFocus) {

                if (!$(ele).val()) {
                    $(eleValueATFocus).attr('disabled', 'true');
                    $(eleValueATFocus).attr('value', String(0));
                    // mask money
                    $.fn.initMaskMoney2();
                    return true;
                }

                if ($(ele).val()) {
                    $(eleValueATFocus).removeAttr('disabled');
                    let issueTarget = parseInt($(ele).val());
                    QuotationDataTableHandle.$tablePayment.DataTable().rows().every(function () {
                        let row = this.node();
                        let eleIssueInvoice = row.querySelector('.table-row-issue-invoice');
                        if (eleIssueInvoice) {
                            if (eleIssueInvoice !== ele) {
                                if ($(eleIssueInvoice).val()) {
                                    let issue = parseInt($(eleIssueInvoice).val());
                                    // check other same issue
                                    if (issue === issueTarget) {
                                        let eleValueAT = row.querySelector('.table-row-value-after-tax');
                                        if (eleValueAT) {
                                            if ($(eleValueAT).valCurrency() === 0) {
                                                $(ele).val("").trigger('change');
                                                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-invalid')}, 'failure');
                                                return false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
        return true;
    };

    static loadPSValueBeforeTax(ele, ratio) {
        let valueSO = 0;
        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
        if (tableProductWrapper) {
            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
            if (tableProductFt) {
                let elePretax = tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw');
                let eleDiscount = tableProductFt.querySelector('.quotation-create-product-discount-amount-raw');
                if (elePretax && eleDiscount) {
                    valueSO = parseFloat(elePretax.value) - parseFloat(eleDiscount.value);
                    if (ratio) {
                        let value = (parseFloat(ratio) * valueSO) / 100;
                        $(ele).attr('value', String(value));
                        // mask money
                        $.fn.initMaskMoney2();
                    }
                }
            }
        }
        return true;
    };

    static loadChangePSValueBTAll() {
        let $table = $('#datable-quotation-payment-stage');
        $table.DataTable().rows().every(function () {
            let row = this.node();
            let eleInstallment = row.querySelector('.table-row-installment');
            let eleRatio = row.querySelector('.table-row-ratio');
            let eleValueBT = row.querySelector('.table-row-value-before-tax');
            if (eleInstallment && eleRatio && eleValueBT) {
                QuotationLoadDataHandle.loadPSValueBeforeTax(eleValueBT, $(eleRatio).val());
            }
        });
    };

    // TABLE COST
    static loadDataTableCost() {
        let $table = $('#datable-quotation-create-cost');
        let $tableProduct = $('#datable-quotation-create-product');
        // store old cost
        let storeCost = {};
        $table.DataTable().rows().every(function () {
            let row = this.node();
            let eleProduct = row.querySelector('.table-row-item');
            let elePrice = row.querySelector('.table-row-price');
            if ($(eleProduct).val() && elePrice) {
                let dataProduct = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                if (dataProduct) {
                    storeCost[dataProduct?.['id']] = {'product_cost_price': $(elePrice).valCurrency()};
                    if (elePrice.getAttribute('data-wh')) {
                        storeCost[dataProduct?.['id']]['warehouse_data'] = elePrice.getAttribute('data-wh');
                    }
                }
            }
        });
        // clear table
        $table.DataTable().clear().draw();
        $table[0].querySelector('.quotation-create-cost-pretax-amount').innerHTML = "0";
        $table[0].querySelector('.quotation-create-cost-taxes').innerHTML = "0";
        $table[0].querySelector('.quotation-create-cost-total').innerHTML = "0";
        // copy data table product to table cost
        if ($table.DataTable().data().count() === 0) {  // if dataTable empty then add init
            let valueOrder = 0;
            // check if product is hidden zone (page update)
            let $form = $('#frm_quotation_create');
            let isHidden = false;
            let dataZone = "quotation_products_data";
            if ($form[0].classList.contains('sale-order')) {
                dataZone = "sale_order_products_data";
            }
            let zoneHiddenData = WFRTControl.getZoneHiddenData();
            for (let zoneHidden of zoneHiddenData) {
                if (zoneHidden?.['code'] === dataZone) {
                    isHidden = true;
                    break;
                }
            }
            if (isHidden === true) {  // product is zone hidden
                let storeDetail = JSON.parse(QuotationLoadDataHandle.$eleStoreDetail.val());
                for (let data of storeDetail?.[dataZone]) {
                    let valueQuantity = 0;
                    let valueTaxAmount = 0;
                    let valueSubtotal = 0;
                    let dataProduct = {};
                    let dataUOM = {};
                    let dataTax = {};
                    if (data?.['product_data']?.['id']) { // PRODUCT
                        dataProduct = data?.['product_data'] ? data?.['product_data'] : {};
                        dataUOM = data?.['uom_data'] ? data?.['uom_data'] : {};
                        valueQuantity = data?.['product_quantity'] ? data?.['product_quantity'] : 0;
                        dataTax = data?.['tax_data'] ? data?.['tax_data'] : {};
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_data": dataProduct,
                            "product_quantity": valueQuantity,
                            "product_uom_code": "",
                            "product_tax_title": "",
                            "product_tax_value": 0,
                            "product_uom_title": "",
                            "product_cost_price": 0,
                            "product_tax_amount": valueTaxAmount,
                            "product_subtotal_price": valueSubtotal,
                        }
                        let newRow = $table.DataTable().row.add(dataAdd).draw().node();
                        QuotationLoadDataHandle.loadBoxQuotationProduct($(newRow.querySelector('.table-row-item')), dataProduct);
                        $(newRow.querySelector('.table-row-item')).attr('data-product-id', dataProduct?.['id']);
                        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')), [dataUOM]);
                        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')), [dataTax]);
                        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-supplied-by')), QuotationLoadDataHandle.dataSuppliedBy);
                        $(newRow.querySelector('.table-row-supplied-by')).val(dataProduct?.['supplied_by'] ? dataProduct?.['supplied_by'] : 0).change();
                    }
                    if (data?.['shipping_data']?.['id']) { // SHIPPING
                        let dataShipping = data?.['shipping_data'];
                        valueQuantity = 1;
                        valueSubtotal = parseFloat(row.querySelector('.table-row-subtotal-raw').value);
                        // check if margin then minus
                        if (dataShipping?.['shipping_margin']) {
                            if (dataShipping?.['shipping_margin'] > 0) {
                                valueSubtotal = valueSubtotal - dataShipping?.['shipping_margin'];
                            }
                        }
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_quantity": valueQuantity,
                            "product_uom_code": "",
                            "product_tax_title": "",
                            "product_tax_value": 0,
                            "product_uom_title": "",
                            "product_cost_price": valueSubtotal,
                            "product_tax_amount": valueTaxAmount,
                            "product_subtotal_price": valueSubtotal,
                            "is_shipping": true,
                            "shipping_id": dataShipping?.['id'],
                            "shipping_data": dataShipping,
                        }
                        let newRow = $table.DataTable().row.add(dataAdd).draw().node();
                        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')), [dataUOM]);
                        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')), [dataTax]);
                    }
                }
            } else {  // product is not zone hidden
                $tableProduct.DataTable().rows().every(function () {
                    let row = this.node();
                    let valueQuantity = 0;
                    let valueTaxAmount = 0;
                    let valueSubtotal = 0;
                    let dataProduct = {};
                    let dataUOM = {};
                    let dataTax = {};
                    let product = row.querySelector('.table-row-item');
                    let uom = row.querySelector('.table-row-uom');
                    let tax = row.querySelector('.table-row-tax');
                    let shipping = row.querySelector('.table-row-shipping');
                    if (product) { // PRODUCT
                        dataProduct = SelectDDControl.get_data_from_idx($(product), $(product).val());
                        if ($(uom).val()) {
                            dataUOM = SelectDDControl.get_data_from_idx($(uom), $(uom).val());
                        }
                        if ($(tax).val()) {
                            dataTax = SelectDDControl.get_data_from_idx($(tax), $(tax).val());
                        }
                        valueQuantity = 0;
                        if (row.querySelector('.table-row-quantity').value) {
                            valueQuantity = parseFloat(row.querySelector('.table-row-quantity').value);
                        }
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_data": dataProduct,
                            "product_quantity": valueQuantity,
                            "product_uom_code": "",
                            "product_tax_title": "",
                            "product_tax_value": 0,
                            "product_uom_title": "",
                            "product_cost_price": 0,
                            "product_tax_amount": valueTaxAmount,
                            "product_subtotal_price": valueSubtotal,
                        }
                        let newRow = $table.DataTable().row.add(dataAdd).draw().node();
                        QuotationLoadDataHandle.loadBoxQuotationProduct($(newRow.querySelector('.table-row-item')), dataProduct);
                        $(newRow.querySelector('.table-row-item')).attr('data-product-id', dataProduct?.['id']);
                        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')), [dataUOM]);
                        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')), [dataTax]);
                        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-supplied-by')), QuotationLoadDataHandle.dataSuppliedBy);
                        $(newRow.querySelector('.table-row-supplied-by')).val(dataProduct?.['supplied_by'] ? dataProduct?.['supplied_by'] : 0).change();
                    }
                    if (shipping) { // SHIPPING
                        if (shipping.getAttribute('data-shipping')) {
                            let dataShipping = JSON.parse(shipping.getAttribute('data-shipping'));
                            valueQuantity = 1;
                            valueSubtotal = parseFloat(row.querySelector('.table-row-subtotal-raw').value);
                            // check if margin then minus
                            if (dataShipping?.['shipping_margin']) {
                                if (dataShipping?.['shipping_margin'] > 0) {
                                    valueSubtotal = valueSubtotal - dataShipping?.['shipping_margin'];
                                }
                            }
                            valueOrder++
                            let dataAdd = {
                                "order": valueOrder,
                                "product_quantity": valueQuantity,
                                "product_uom_code": "",
                                "product_tax_title": "",
                                "product_tax_value": 0,
                                "product_uom_title": "",
                                "product_cost_price": valueSubtotal,
                                "product_tax_amount": valueTaxAmount,
                                "product_subtotal_price": valueSubtotal,
                                "is_shipping": true,
                                "shipping_id": dataShipping?.['id'],
                                "shipping_data": dataShipping,
                            }
                            let newRow = $table.DataTable().row.add(dataAdd).draw().node();
                            QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')), [dataUOM]);
                            QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')), [dataTax]);
                        }
                    }
                })
            }
            // Re calculate
            QuotationCalculateCaseHandle.calculateAllRowsTableCost();
            // load cost list
            $table.DataTable().rows().every(function () {
                let row = this.node();
                let eleProduct = row.querySelector('.table-row-item');
                let elePrice = row.querySelector('.table-row-price');
                // if (eleProduct) {
                //     QuotationLoadDataHandle.loadCostProduct(eleProduct);
                // }
                if ($(eleProduct).val() && elePrice) {
                    let dataProduct = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                    if (dataProduct) {
                        if (storeCost.hasOwnProperty(dataProduct?.['id'])) {
                            $(elePrice).attr('value', String(storeCost?.[dataProduct?.['id']]?.['product_cost_price']));
                            $.fn.initMaskMoney2();
                            QuotationCalculateCaseHandle.commonCalculate($table, row);
                            if (storeCost?.[dataProduct?.['id']]?.['warehouse_data']) {
                                $(elePrice).attr('data-wh', storeCost?.[dataProduct?.['id']]?.['warehouse_data'])
                            }
                        }
                    }
                }
            });
            QuotationLoadDataHandle.loadSetWFRuntimeZone();
        }
    };

    static loadCostProduct(eleProduct) {
        // wh cost > bom cost > standard cost
        let productData = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
        if (productData) {
            if (productData?.['id']) {
                // call ajax check BOM
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': QuotationLoadDataHandle.urlEle.attr('data-md-bom'),
                        'method': 'GET',
                        'data': {
                            'product_id': productData?.['id'],
                            'opportunity_id__isnull': false,
                        },
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('bom_order_list') && Array.isArray(data.bom_order_list)) {
                                let elePrice = eleProduct.closest('tr').querySelector('.table-row-price');
                                let btnSCost = eleProduct.closest('tr').querySelector('.btn-select-cost');
                                let costBom = 0;
                                let costStandard = 0;
                                let productData = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                                    if (productData) {
                                        costStandard = productData?.['standard_price'];
                                    }
                                if (data.bom_order_list.length > 0) {
                                    costBom = data.bom_order_list[0]?.['sum_price'];

                                    if (elePrice) {
                                        // elePrice.setAttribute('disabled', 'true');
                                        $(elePrice).attr('value', String(data.bom_order_list[0]?.['sum_price']));
                                        QuotationLoadDataHandle.loadSetWFRuntimeZone();
                                        $.fn.initMaskMoney2();
                                        if (btnSCost) {
                                            // btnSCost.setAttribute('disabled', 'true');
                                        }
                                    }
                                }
                                QuotationLoadDataHandle.loadCostWHProduct(eleProduct, {'costBom': costBom, 'costStandard': costStandard});
                            }
                            WindowControl.hideLoading();
                        }
                    }
                )
            }
        }
    };

    static loadCostWHProduct(eleProduct, costBomStandardData) {
        let productData = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
        let row = eleProduct.closest('tr');
        let $form = $('#frm_quotation_create');
        let dataZone = "quotation_costs_data";
        if ($form[0].classList.contains('sale-order')) {
            dataZone = "sale_order_costs_data";
        }
        if (productData && row) {
            let priceGr = row.querySelector('.input-group-price');
            let modalBody = QuotationLoadDataHandle.$costModal[0].querySelector('.modal-body');
            // load PRICE
            if (priceGr && modalBody && productData?.['id']) {
                let urlDetail = QuotationLoadDataHandle.urlEle.attr('data-md-product-detail').format_url_with_uuid(productData?.['id']);
                // call ajax get info product detail
                $.fn.callAjax2({
                    url: urlDetail,
                    method: 'GET',
                    isLoading: false,
                }).then(
                    (resp) => {
                        let dataDetail = $.fn.switcherResp(resp);
                        if (dataDetail) {
                            $(modalBody).empty();
                            let htmlCostList = `<div class="mb-4 product-target" data-product-id="${productData?.['id']}"><i class="fas fa-cube mr-2"></i><b>${productData?.['title']}</b></div>`;
                            if (dataDetail?.['cost_list']) {
                                let checkedBom = '';
                                let checkedStandard = '';
                                if (row.querySelector(`.input-group-price[data-cost-wh-id="bom"]`)) {
                                    checkedBom = 'checked';
                                }
                                if (row.querySelector(`.input-group-price[data-cost-wh-id="standard"]`)) {
                                    checkedStandard = 'checked';
                                }
                                if (Array.isArray(dataDetail?.['cost_list']) && dataDetail?.['cost_list'].length > 0) {
                                    for (let costData of dataDetail?.['cost_list']) {
                                        let checked = '';
                                        if (row.querySelector(`.input-group-price[data-cost-wh-id="${costData?.['warehouse']?.['id']}"]`)) {
                                            checked = 'checked';
                                        }
                                        htmlCostList += `<div class="d-flex justify-content-between">
                                                        <div class="form-check form-check-lg">
                                                            <input type="radio" name="row-price-option" class="form-check-input table-row-price-option" id="cost-${costData?.['warehouse']?.['id'].replace(/-/g, "")}" data-value="${parseFloat(costData?.['unit_cost'])}" data-wh="${JSON.stringify(costData?.['warehouse']).replace(/"/g, "&quot;")}" data-zone="${dataZone}" ${checked}>
                                                            <label class="form-check-label" for="cost-${costData?.['warehouse']?.['id'].replace(/-/g, "")}">${costData?.['warehouse']?.['title']}</label>
                                                        </div>
                                                        <span class="mask-money" data-init-money="${parseFloat(costData?.['unit_cost'])}"></span>
                                                    </div>`;
                                    }
                                } else {
                                    htmlCostList += `<p>${QuotationLoadDataHandle.transEle.attr('data-product-no-cost')}</p>`;
                                }
                                htmlCostList += `<hr>`;
                                htmlCostList += `<div class="d-flex justify-content-between">
                                                    <div class="form-check form-check-lg">
                                                        <input type="radio" name="row-price-option" class="form-check-input table-row-price-option" id="cost-bom-${dataDetail?.['id'].replace(/-/g, "")}" data-value="${parseFloat(costBomStandardData?.['costBom'])}" data-wh="${JSON.stringify({'id': 'bom'}).replace(/"/g, "&quot;")}" data-zone="${dataZone}" ${checkedBom}>
                                                        <label class="form-check-label" for="cost-bom-${dataDetail?.['id'].replace(/-/g, "")}">${QuotationLoadDataHandle.transEle.attr('data-cost-bom')}</label>
                                                    </div>
                                                    <span class="mask-money" data-init-money="${parseFloat(costBomStandardData?.['costBom'])}"></span>
                                                </div>`;
                                htmlCostList += `<div class="d-flex justify-content-between">
                                                    <div class="form-check form-check-lg">
                                                        <input type="radio" name="row-price-option" class="form-check-input table-row-price-option" id="cost-standard-${dataDetail?.['id'].replace(/-/g, "")}" data-value="${parseFloat(costBomStandardData?.['costStandard'])}" data-wh="${JSON.stringify({'id': 'standard'}).replace(/"/g, "&quot;")}" data-zone="${dataZone}" ${checkedStandard}>
                                                        <label class="form-check-label" for="cost-standard-${dataDetail?.['id'].replace(/-/g, "")}">${QuotationLoadDataHandle.transEle.attr('data-cost-standard')}</label>
                                                    </div>
                                                    <span class="mask-money" data-init-money="${parseFloat(costBomStandardData?.['costStandard'])}"></span>
                                                </div>`;
                                $(modalBody).append(`${htmlCostList}`);
                            }
                            QuotationLoadDataHandle.loadEventRadio(QuotationLoadDataHandle.$costModal);
                            $.fn.initMaskMoney2();
                            QuotationLoadDataHandle.loadSetWFRuntimeZone();
                        }
                    }
                )
            }
        }
    };

    // TABLE EXPENSE
    static loadAddRowExpense() {
        let tableExpense = $('#datable-quotation-create-expense');
        let order = tableExpense[0].querySelectorAll('.table-row-order').length + 1;
        let dataAdd = {
            "tax": {
                "id": "",
                "code": "",
                "title": "",
                "value": 0
            },
            "order": order,
            "expense": {
                "id": "",
                "code": "",
                "title": ""
            },
            "product": {
                "id": "",
                "code": "",
                "title": ""
            },
            "expense_code": "",
            "expense_price": 0,
            "expense_title": "",
            "unit_of_measure": {
                "id": "",
                "code": "",
                "title": ""
            },
            "expense_quantity": 0,
            "expense_uom_code": "",
            "expense_tax_title": "",
            "expense_tax_value": 0,
            "expense_uom_title": "",
            "expense_tax_amount": 0,
            "expense_subtotal_price": 0,
            "is_product": false,
            "is_labor": false,
        }
        let newRow = tableExpense.DataTable().row.add(dataAdd).draw().node();
        // load data dropdown
        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-item')));
        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
        // check disable
        tableExpense.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
    };

    static loadAddRowLabor() {
        let tableExpense = $('#datable-quotation-create-expense');
        let order = tableExpense[0].querySelectorAll('.table-row-order').length + 1;
        let dataAdd = {
            "tax": {
                "id": "",
                "code": "",
                "title": "",
                "value": 0
            },
            "order": order,
            "expense": {
                "id": "",
                "code": "",
                "title": ""
            },
            "product": {
                "id": "",
                "code": "",
                "title": ""
            },
            "expense_code": "",
            "expense_price": 0,
            "expense_title": "",
            "unit_of_measure": {
                "id": "",
                "code": "",
                "title": ""
            },
            "expense_quantity": 0,
            "expense_uom_code": "",
            "expense_tax_title": "",
            "expense_tax_value": 0,
            "expense_uom_title": "",
            "expense_tax_amount": 0,
            "expense_subtotal_price": 0,
            "is_product": false,
            "is_labor": true,
        }
        let newRow = tableExpense.DataTable().row.add(dataAdd).draw().node();
        // load data dropdown
        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-labor-item')));
        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-item')));
        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
        QuotationLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
        // check disable
        tableExpense.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
    };

    static loadChangeLabor(ele) {
        if ($(ele).val()) {
            let row = ele.closest('tr');
            let dataSelected = SelectDDControl.get_data_from_idx($(ele), $(ele).val());
            if (dataSelected?.['expense_item']?.['id']) {
                QuotationLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [dataSelected?.['expense_item']]);
            }
            if (dataSelected?.['uom']?.['id'] && dataSelected?.['uom_group']?.['id']) {
                QuotationLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')), [dataSelected?.['uom']], {'group': dataSelected?.['uom_group']?.['id']});
            }
            QuotationLoadDataHandle.loadPriceLabor(row, dataSelected, dataSelected?.['uom']?.['id']);
        }
        return true;
    };

    static loadPriceLabor(row, dataSelected, uomSelectedID) {
        $(row.querySelector('.table-row-price')).attr('value', String(0));
        if (dataSelected?.['price_list'].length > 0) {
            for (let priceData of dataSelected?.['price_list']) {
                if (priceData?.['uom']?.['id'] === uomSelectedID) {
                    $(row.querySelector('.table-row-price')).attr('value', String(priceData?.['price_value']));
                    break;
                }
            }
        }
        return true;
    };

    static loadSetWFRuntimeZone() {
        WFRTControl.activeZoneInDoc();
        return true;
    };

    static loadSetupCopy(ele) {
        let divCopyOption = $('#copy-quotation-option');
        let tableCopyQuotationProduct = $('#datable-copy-quotation-product');
        let eleDataCopy = $('#data-copy-quotation-detail');
        if (eleDataCopy && eleDataCopy.length > 0) {
            if (eleDataCopy.val()) {
                let dataCopy = JSON.parse(eleDataCopy.val());
                // BEGIN SETUP DATA COPY
                let dataCopyTo = {'id': dataCopy?.['id'], 'option': 'all'};
                let type = $(ele)[0].getAttribute('data-copy-type');
                if (divCopyOption[0].querySelector('.check-option').checked === false) { // if option copy is custom then setup data products & costs for load
                    let result = [];
                    let productCopyTo = [];
                    let order = 0;
                    tableCopyQuotationProduct.DataTable().rows().every(function () {
                        let row = this.node();
                        let check = row.querySelector('.table-row-check-product');
                        if (check.checked === true) {
                            let quantyInput = row.querySelector('.table-row-quantity-input').value;
                            let prodID = check.getAttribute('data-id');
                            for (let data of dataCopy?.['quotation_products_data']) {
                                if (data?.['product_data']?.['id'] === prodID) {
                                    data['product_quantity'] = parseFloat(quantyInput);
                                    order++
                                    data['order'] = order;
                                    result.push(data);
                                    productCopyTo.push({
                                        'id': data?.['product_data']?.['id'],
                                        'quantity': parseFloat(quantyInput)
                                    })
                                    break
                                }
                            }
                        }
                    });
                    dataCopy['quotation_products_data'] = result;
                    dataCopyTo['option'] = 'custom';
                    dataCopyTo['products'] = productCopyTo;
                    dataCopy['quotation_costs_data'] = [];
                } else { // if option copy is ALL product
                    dataCopy['quotation_products_data'] = dataCopy?.['quotation_products_data'];
                }
                // BEGIN COPY DATA
                if (type === 'copy-from') { // COPY FROM (SALE ORDER CREATE -> CHOOSE QUOTATION)
                    QuotationLoadDataHandle.loadCopyData(dataCopy);
                } else if (type === 'copy-to') { // COPY TO (QUOTATION DETAIL -> SALE ORDER CREATE)
                    // create URL and add to href
                    let eleRedirect = document.getElementById('link-to-sale-order-create');
                    let urlSaleOrder = eleRedirect.getAttribute('data-url') + "?data_copy_to=" + encodeURIComponent(JSON.stringify(dataCopyTo));
                    eleRedirect.setAttribute('href', urlSaleOrder);
                    // active event on click <a>
                    eleRedirect.click();
                }
            }
        }
    };

    static loadCopyData(dataCopy) {
        let tableProduct = $('#datable-quotation-create-product');
        document.getElementById('customer-price-list').value = dataCopy?.['customer']?.['customer_price_list'];
        QuotationLoadDataHandle.loadDataTablesAndDropDowns(dataCopy);
        QuotationLoadDataHandle.loadDetailQuotation(dataCopy, true);
        QuotationLoadDataHandle.loadDataTablesAndDropDowns(dataCopy);
        QuotationCalculateCaseHandle.calculateAllRowsTableProduct();
        // Check promotion -> re calculate
        QuotationLoadDataHandle.loadReApplyPromotion(dataCopy, tableProduct);
        // Load indicator
        indicatorHandle.loadIndicator();
        // Set form novalidate
        QuotationLoadDataHandle.$form[0].setAttribute('novalidate', 'novalidate');
        QuotationLoadDataHandle.loadCheckDataCopy();
        // set again WF runtime
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadCheckDataCopy() {
        let listProductID = [];
        for (let ele of QuotationDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-item')) {
            if (ele.getAttribute('data-product-id')) {
                listProductID.push(ele.getAttribute('data-product-id'));
            }
        }
        WindowControl.showLoading();
        $.fn.callAjax2({
                'url': QuotationDataTableHandle.productInitEle.attr('data-url'),
                'method': QuotationDataTableHandle.productInitEle.attr('data-method'),
                'data': {'id__in': listProductID.join(','),},
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('product_sale_list') && Array.isArray(data.product_sale_list)) {
                        let listExclude = [];
                        for (let product of data.product_sale_list) {
                            let checkBOM = QuotationLoadDataHandle.loadCheckProductBOM(product);
                            if (checkBOM?.['is_pass'] === false) {
                                listExclude.push(product?.['id']);
                            }
                        }
                        for (let ele of QuotationDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-item')) {
                            if (ele.getAttribute('data-product-id')) {
                                if (listExclude.includes(ele.getAttribute('data-product-id'))) {
                                    if (ele.closest('tr')) {
                                        if (ele.closest('tr').querySelector('.del-row')) {
                                            $(ele.closest('tr').querySelector('.del-row')).trigger('click');
                                        }
                                    }
                                }
                            }
                        }
                        WindowControl.hideLoading();
                        $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-copy-successfully')}, 'success');
                    }
                }
            }
        )
        return true;
    };

    static loadRecurrenceData() {
        let urlParams = $x.fn.getManyUrlParameters(['recurrence_template_id']);
        if (urlParams?.['recurrence_template_id']) {
            // call ajax get info quotation detail
            $.fn.callAjax2({
                url: QuotationLoadDataHandle.urlEle.attr('data-so-detail').format_url_with_uuid(urlParams?.['recurrence_template_id']),
                method: 'GET',
                isLoading: true,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        QuotationLoadDataHandle.loadDetailQuotation(data);
                        QuotationLoadDataHandle.loadDataTablesAndDropDowns(data);
                        indicatorHandle.loadIndicator();

                        //
                        const processData = data?.['process'] || {};
                        const oppData = data?.['opportunity'] || {};
                        const inheritData = data?.['employee_inherit'] || {};
                        new $x.cls.bastionField({
                            has_opp: true,
                            has_inherit: true,
                            has_process: true,
                            data_process: processData && Object.keys(processData).length > 0 ? [
                                {
                                    ...processData,
                                    'selected': true,
                                }
                            ] : [],
                            data_opp: oppData && Object.keys(oppData).length > 0 ? [
                                {
                                    ...oppData,
                                    'selected': true,
                                }
                            ] : [],
                            data_inherit: inheritData && Object.keys(inheritData).length > 0 ? [
                                {
                                    ...inheritData,
                                    'selected': true,
                                }
                            ] : [],
                        }).init();
                    }
                }
            )
        }
        return true;
    };

    // LOAD DATA DETAIL
    static loadDetailQuotation(data, is_copy = false) {
        let form = QuotationLoadDataHandle.$form[0];
        if (data?.['title'] && is_copy === false) {
            $('#title').val(data?.['title']);
        }
        //
        const processData = data?.['process'] || {};
        const processStageAppData = data?.['process_stage_app'] || {};
        const oppData = data?.['opportunity'] || {};
        const inheritData = data?.['employee_inherit'] || {};
        new $x.cls.bastionField({
            has_opp: true,
            has_inherit: true,
            has_process: true,
            data_process: processData && Object.keys(processData).length > 0 ? [
                {
                    ...processData,
                    'selected': true,
                }
            ] : [],
            data_process_stage_app: processStageAppData && Object.keys(processStageAppData).length > 0 ? [
                {
                    ...processStageAppData,
                    'selected': true,
                }
            ] : [],
            processStageAppFlagData: {
                'disable': true,
            },
            data_opp: oppData && Object.keys(oppData).length > 0 ? [
                {
                    ...oppData,
                    'selected': true,
                }
            ] : [],
            data_inherit: inheritData && Object.keys(inheritData).length > 0 ? [
                {
                    ...inheritData,
                    'selected': true,
                }
            ] : [],
        }).init();
        if (data?.['sale_person']) {
            QuotationLoadDataHandle.loadInitS2(QuotationLoadDataHandle.salePersonSelectEle, [data?.['sale_person']]);
        }
        if ($(form).attr('data-method').toLowerCase() !== 'get') {
            QuotationLoadDataHandle.salePersonSelectEle[0].removeAttribute('readonly');
            QuotationLoadDataHandle.customerSelectEle[0].removeAttribute('readonly');
            QuotationLoadDataHandle.contactSelectEle[0].removeAttribute('readonly');
        }
        if (Object.keys(data?.['opportunity']).length > 0) {
            if (data?.['opportunity']?.['quotation_id'] !== data?.['id']) {  // Check if quotation is invalid in Opp => disabled btn copy to SO (only for detail page)
                if (form.getAttribute('data-method').toLowerCase() === 'get') {
                    let btnCopy = document.getElementById('btn-copy-quotation');
                    if (btnCopy) {
                        btnCopy.setAttribute('disabled', 'true');
                    }
                }
            }
            if ($(form).attr('data-method').toLowerCase() !== 'get') {
                QuotationLoadDataHandle.salePersonSelectEle[0].setAttribute('readonly', 'true');
                QuotationLoadDataHandle.customerSelectEle[0].setAttribute('readonly', 'true');
                QuotationLoadDataHandle.contactSelectEle[0].setAttribute('readonly', 'true');
            }
        }
        if (data?.['customer_data']) {
            if (is_copy === true) {
                data['customer_data']['is_copy'] = true;
            }
            QuotationLoadDataHandle.loadBoxQuotationCustomer(data?.['customer_data']);
        }
        if (data?.['contact_data']) {
            QuotationLoadDataHandle.loadBoxQuotationContact(data?.['contact_data']);
        }
        if (data?.['payment_term_data']) {
            QuotationLoadDataHandle.loadInitS2(QuotationLoadDataHandle.paymentSelectEle, [data?.['payment_term_data']]);
        }
        if (data?.['quotation_data']) {
            if (data?.['quotation_data']?.['title']) {
                QuotationLoadDataHandle.quotationSelectEle.val(data?.['quotation_data']?.['title']);
            }
            QuotationLoadDataHandle.quotationSelectEle.attr('data-detail', JSON.stringify(data?.['quotation_data']));
        }
        if (data?.['date_created']) {
            $('#quotation-create-date-created').val(moment(data?.['date_created']).format('DD/MM/YYYY'));
        }
        if (data?.['is_customer_confirm'] && is_copy === false) {
            $('#is_customer_confirm')[0].checked = data?.['is_customer_confirm'];
        }
        if (is_copy === false) {
            // check if finish then remove hidden btnDelivery (SO)
            if (data?.['system_status'] === 3 && $(form).attr('data-method').toLowerCase() === 'get' && form.classList.contains('sale-order')) {
                if (QuotationLoadDataHandle.opportunitySelectEle.val()) {
                    if (data?.['opportunity']?.['is_deal_close'] === false) {
                        let btnDelivery = $('#btnDeliverySaleOrder');
                        if (btnDelivery && btnDelivery.length > 0) {
                            btnDelivery[0].removeAttribute('hidden');
                        }
                    }
                } else {
                    let btnDelivery = $('#btnDeliverySaleOrder');
                    if (btnDelivery && btnDelivery.length > 0) {
                        btnDelivery[0].removeAttribute('hidden');
                    }
                }
            }
            // check if finish then remove hidden btnCopy
            if (data?.['system_status'] === 3 && $(form).attr('data-method').toLowerCase() === 'get') {
                let btnCopy = $('#btn-copy-quotation');
                if (btnCopy && btnCopy.length > 0) {
                    btnCopy[0].removeAttribute('hidden');
                }
            }
        }
        if (is_copy === true) {
            QuotationLoadDataHandle.quotationSelectEle.val(data?.['title']);
            QuotationLoadDataHandle.quotationSelectEle.attr('data-detail', JSON.stringify(data));
        }
        if (data?.['quotation_logistic_data']) {
            document.getElementById('quotation-create-shipping-address').value = data?.['quotation_logistic_data']?.['shipping_address'];
            document.getElementById('quotation-create-billing-address').value = data?.['quotation_logistic_data']?.['billing_address'];
        } else if (data?.['sale_order_logistic_data']) {
            document.getElementById('quotation-create-shipping-address').value = data?.['sale_order_logistic_data']?.['shipping_address'];
            document.getElementById('quotation-create-billing-address').value = data?.['sale_order_logistic_data']?.['billing_address'];
        }
        $('#quotation-create-customer-shipping').val(data?.['customer_shipping_id']);
        $('#quotation-create-customer-billing').val(data?.['customer_billing_id']);
        // load totals
        QuotationLoadDataHandle.loadTotal(data, true, false, false);
        QuotationLoadDataHandle.loadTotal(data, false, true, false);
        QuotationLoadDataHandle.loadTotal(data, false, false, true);
        // check config (page update)
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
            QuotationCheckConfigHandle.checkConfig(0, null, data?.['opportunity']?.['id']);
        }
    };

    static loadDataProductAll() {
        let table = document.getElementById('datable-quotation-create-product');
        for (let i = 0; i < table.tBodies[0].rows.length; i++) {
            let row = table.tBodies[0].rows[i];
            let eleItem = row.querySelector('.table-row-item');
            if (eleItem) {
                QuotationLoadDataHandle.loadPriceProduct(eleItem);
                // Re Calculate all data of rows & total
                QuotationCalculateCaseHandle.commonCalculate($(table), row);
            }
        }
    };

    static loadInitQuotationConfig(page_method) {
        let ele = $('#quotation-config-data');
        if (ele.hasClass('quotation-config')) {
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax2(
                {
                    'url': url,
                    'method': method,
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.val(JSON.stringify(data));
                        // check SsLsRole first time
                        if (page_method === "POST" && !$('#data-init-quotation-copy-to').val()) {
                            QuotationCheckConfigHandle.checkSsLsRole();
                        }
                    }
                }
            )
        }
    };

    static loadDataTablesAndDropDowns(data) {
        QuotationLoadDataHandle.loadDataTables(data);
        QuotationLoadDataHandle.loadTableDropDowns();
        return true;
    };

    static loadDataTables(data) {
        let form = document.getElementById('frm_quotation_create');
        let tableProduct = $('#datable-quotation-create-product');
        let tableCost = $('#datable-quotation-create-cost');
        let tableExpense = $('#datable-quotation-create-expense');
        let tableIndicator = $('#datable-quotation-create-indicator');
        let tablePaymentStage = $('#datable-quotation-payment-stage');
        let products_data = data?.['quotation_products_data'];
        let costs_data = data?.['quotation_costs_data'];
        let expenses_data = data?.['quotation_expenses_data'];
        let indicators_data = data?.['quotation_indicators_data'];
        if (data.hasOwnProperty('sale_order_products_data') && data.hasOwnProperty('sale_order_costs_data') && data.hasOwnProperty('sale_order_expenses_data') && data.hasOwnProperty('sale_order_indicators_data')) {
            products_data = data?.['sale_order_products_data'];
            costs_data = data?.['sale_order_costs_data'];
            expenses_data = data?.['sale_order_expenses_data'];
            indicators_data = data?.['sale_order_indicators_data'];
        }
        tableProduct.DataTable().clear().draw();
        tableCost.DataTable().clear().draw();
        tableExpense.DataTable().clear().draw();
        // load table product
        tableProduct.DataTable().rows.add(products_data).draw();
        tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let eleOrder = row.querySelector('.table-row-order');
            let eleGroup = row.querySelector('.table-row-group');
            let eleProduct = row.querySelector('.table-row-item');

            if (eleOrder) {
                let dataRowRaw = eleOrder.getAttribute('data-row');
                if (dataRowRaw) {
                    let dataRow = JSON.parse(dataRowRaw);
                    // load collapse Group
                    if (eleGroup) {
                        let eleGroupEdit = row.querySelector('.table-row-group-title-edit');
                        let areaGroupShow = row.querySelector('.area-group-show');
                        if (eleGroupEdit && areaGroupShow) {
                            let groupShow = areaGroupShow.querySelector('.table-row-group-title-show');
                            if (groupShow) {
                                areaGroupShow.classList.remove('hidden');
                                eleGroupEdit.setAttribute('hidden', 'true');
                            }
                        }
                        $(row).find('td:eq(1)').attr('colspan', 2);
                    }
                    if (eleProduct) {
                        let dataGroup = dataRow?.['group_order'];
                        if (dataGroup) {
                            let classGroup = 'group-' + dataGroup;
                            row.classList.add('collapse');
                            row.classList.add(classGroup);
                            row.classList.add('show');
                            row.setAttribute('data-group', dataGroup);
                        }
                    }
                }
            }
        });
        // load table cost
        tableCost.DataTable().rows.add(costs_data).draw();
        // load table expense
        tableExpense.DataTable().rows.add(expenses_data).draw();
        // payment stage (sale order)
        if (form.classList.contains('sale-order')) {
            if (data?.['sale_order_payment_stage']) {
                tablePaymentStage.DataTable().clear().draw();
                tablePaymentStage.DataTable().rows.add(data?.['sale_order_payment_stage']).draw();
                tablePaymentStage.DataTable().rows().every(function () {
                    let row = this.node();
                    if (row.querySelector('.table-row-date')) {
                        $(row.querySelector('.table-row-date')).daterangepicker({
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
                    if (row.querySelector('.table-row-due-date')) {
                        $(row.querySelector('.table-row-due-date')).daterangepicker({
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
                })
            }
        }
        // load indicators & set attr disabled for detail page
        if ($(form).attr('data-method').toLowerCase() === 'get') {
            // load indicators
            tableIndicator.DataTable().clear().draw();
            tableIndicator.DataTable().rows.add(indicators_data).draw();
            // set disabled
            QuotationLoadDataHandle.loadTableDisabled(tableProduct);
            QuotationLoadDataHandle.loadTableDisabled(tableCost);
            QuotationLoadDataHandle.loadTableDisabled(tableExpense);
            if (form.classList.contains('sale-order')) {
                QuotationLoadDataHandle.loadTableDisabled(tablePaymentStage);
            }
            // mask money
            $.fn.initMaskMoney2();
        }
        return true
    };

    static loadTableDropDowns() {
        let tableProduct = $('#datable-quotation-create-product');
        let tableCost = $('#datable-quotation-create-cost');
        let tableExpense = $('#datable-quotation-create-expense');
        let tablePS = $('#datable-quotation-payment-stage');
        if (tableProduct && tableProduct.length > 0) {
            QuotationLoadDataHandle.loadDropDowns(tableProduct);
        }
        if (tableCost && tableCost.length > 0) {
            QuotationLoadDataHandle.loadDropDowns(tableCost);
        }
        if (tableExpense && tableExpense.length > 0) {
            QuotationLoadDataHandle.loadDropDowns(tableExpense);
        }
        if (tablePS && tablePS.length > 0) {
            QuotationLoadDataHandle.loadDropDowns(tablePS);
        }
    };

    static loadDropDowns(table) {
        if (table[0].id === "datable-quotation-create-product" || table[0].id === "datable-quotation-create-cost") {  // PRODUCT || COST
            table.DataTable().rows().every(function () {
                let row = this.node();
                if (!row.querySelector('.table-row-group')) {
                    let dataRow = JSON.parse(row.querySelector('.table-row-order')?.getAttribute('data-row'));
                    if (table[0].id === "datable-quotation-create-product") {  // PRODUCT
                        if (row.querySelector('.table-row-item')) {
                            QuotationLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [dataRow?.['product_data']]);
                            QuotationLoadDataHandle.loadCssS2($(row.querySelector('.table-row-item')), '260px');
                            QuotationLoadDataHandle.loadPriceProduct(row.querySelector('.table-row-item'));
                            for (let ele of table[0].querySelectorAll('.btn-select-price')) {
                                ele.removeAttribute('disabled');
                            }
                        }
                    }
                    if (table[0].id === "datable-quotation-create-cost") {  // COST
                        if (row.querySelector('.table-row-item')) {
                            QuotationLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [dataRow?.['product_data']]);
                            QuotationLoadDataHandle.loadCostProduct(row.querySelector('.table-row-item'));
                        }
                        let eleSuppliedBy = row.querySelector('.table-row-supplied-by');
                        if (eleSuppliedBy) {
                            QuotationLoadDataHandle.loadInitS2($(eleSuppliedBy), QuotationLoadDataHandle.dataSuppliedBy);
                            $(eleSuppliedBy).val(dataRow?.['supplied_by']).change();
                        }
                    }
                    let eleUOM = row.querySelector('.table-row-uom');
                    if (eleUOM) {
                        QuotationLoadDataHandle.loadInitS2($(eleUOM), [dataRow?.['uom_data']]);
                    }
                    let eleTax = row.querySelector('.table-row-tax');
                    if (eleTax) {
                        QuotationLoadDataHandle.loadInitS2($(eleTax), [dataRow?.['tax_data']]);
                    }
                }
            });
        }
        if (table[0].id === "datable-quotation-create-expense") {  // EXPENSE
            table.DataTable().rows().every(function () {
                let row = this.node();
                let dataRow = JSON.parse(row.querySelector('.table-row-order')?.getAttribute('data-row'));
                QuotationLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [dataRow?.['expense_item_data']]);
                if (row?.querySelector('.table-row-labor-item') && dataRow?.['is_labor'] === true) {
                    QuotationLoadDataHandle.loadInitS2($(row.querySelector('.table-row-labor-item')), [dataRow?.['expense_data']]);
                }
                QuotationLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')), [dataRow?.['uom_data']]);
                QuotationLoadDataHandle.loadInitS2($(row.querySelector('.table-row-tax')), [dataRow?.['tax_data']]);
            });
        }
        if (table[0].id === "datable-quotation-payment-stage") {  // PAYMENT
            table.DataTable().rows().every(function () {
                let row = this.node();
                let dataRow = JSON.parse(row.querySelector('.table-row-order')?.getAttribute('data-row'));
                let eleInstallment = row.querySelector('.table-row-installment');
                if (eleInstallment) {
                    let term = [];
                    if (QuotationLoadDataHandle.paymentSelectEle.val()) {
                        let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
                        if (dataSelected) {
                            term = dataSelected?.['term'];
                            for (let termData of term) {
                                let isNum = parseFloat(termData?.['value']);
                                if (!isNum) {  // balance
                                    termData['value'] = String(QuotationLoadDataHandle.loadBalanceValPaymentTerm());
                                }
                            }
                        }
                    }
                    QuotationLoadDataHandle.loadInitS2($(eleInstallment), term, {}, null, true);
                    $(eleInstallment).val(dataRow?.['term_id']).trigger('change');
                }
                let count = dataRow?.['order'];
                let dataIssue = [{'id': '', 'title': 'Select...',}];
                for (let i = 1; i <= count; i++) {
                    let add = {'id': String(i), 'title': String(i)};
                    dataIssue.push(add);
                }
                let eleIssueInvoice = row.querySelector('.table-row-issue-invoice');
                if (eleIssueInvoice) {
                    QuotationLoadDataHandle.loadInitS2($(eleIssueInvoice), dataIssue, {}, null, true);
                    $(eleIssueInvoice).val(dataRow?.['issue_invoice']).trigger('change');
                }
            });
        }
        return true;
    };

    static loadTableDisabled(table) {
        for (let ele of table[0].querySelectorAll('.table-row-item')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-labor-item')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-expense-title')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-uom')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-quantity')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-price')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-discount')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-tax')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.input-group-price')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.input-group-expense-purchase-product')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.del-row')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-remark')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-date')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('text-black');
        }
        for (let ele of table[0].querySelectorAll('.table-row-installment')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-ratio')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-before-tax')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-issue-invoice')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-after-tax')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-total')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-due-date')) {
            ele.setAttribute('disabled', 'true');
            ele.classList.add('text-black');
        }
        for (let ele of table[0].querySelectorAll('.table-row-checkbox-invoice')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.btn-edit-group')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.btn-del-group')) {
            ele.setAttribute('disabled', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-supplied-by')) {
            ele.setAttribute('readonly', 'true');
        }
        QuotationLoadDataHandle.$btnSavePrice[0].setAttribute('disabled', 'true');
        for (let ele of table[0].querySelectorAll('.btn-select-cost')) {
            ele.setAttribute('disabled', 'true');
        }
    };

    static loadReApplyPromotion(data) {
        if (Object.keys(data?.['customer_data']).length > 0) {
            let dataProductList = data?.['quotation_products_data'];
            for (let dataProduct of dataProductList) {
                if (dataProduct?.['promotion_id']) {
                    let checkData = QuotationPromotionHandle.checkPromotionValid(dataProduct?.['promotion_data'], data?.['customer_data']?.['id']);
                    let promotionParse = QuotationPromotionHandle.getPromotionResult(checkData);
                    let tableProduct = $('#datable-quotation-create-product');
                    if (promotionParse?.['is_discount'] === true) { // DISCOUNT
                        if (promotionParse?.['row_apply_index'] === null) { // on Specific product
                            if (promotionParse.hasOwnProperty('discount_rate_on_order')) {
                                if (promotionParse.discount_rate_on_order !== null) {
                                    if (promotionParse.is_before_tax === true) {
                                        QuotationPromotionHandle.calculatePromotion(tableProduct, promotionParse?.['discount_rate_on_order'], promotionParse?.['product_price']);
                                    } else {
                                        QuotationPromotionHandle.calculatePromotion(tableProduct, promotionParse?.['discount_rate_on_order'], promotionParse?.['product_price'], false)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

}

// DataTable
class QuotationDataTableHandle {
    static productInitEle = $('#data-init-quotation-create-tables-product');
    static expenseItemInitEle = $('#data-init-quotation-create-tables-expense-item');
    static expenseInitEle = $('#data-init-quotation-create-tables-expense');
    static uomInitEle = $('#data-init-quotation-create-tables-uom');
    static taxInitEle = $('#data-init-quotation-create-tables-tax');

    static $tableSProduct = $('#table-select-product');
    static $tableProduct = $('#datable-quotation-create-product');
    static $tableCost = $('#datable-quotation-create-cost');
    static $tableExpense = $('#datable-quotation-create-expense');
    static $tablePayment = $('#datable-quotation-payment-stage');

    static dataTableProduct(data) {
        // init dataTable
        QuotationDataTableHandle.$tableProduct.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        if (row?.['is_group'] === true) {
                            let target = ".group-" + String(row?.['group_order']);
                            return `<button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-xs table-row-group" 
                                        data-bs-toggle="collapse"
                                        data-bs-target="${target}"
                                        data-bs-placement="top"
                                        aria-expanded="true"
                                        aria-controls="newGroup"
                                        data-group-order="${row?.['group_order']}"
                                        data-row="${dataRow}"
                                    >
                                        <span class="icon"><i class="fas fa-chevron-down"></i></span>
                                    </button>
                                    <span class="table-row-order ml-2" data-row="${dataRow}" hidden>${row?.['order']}</span>`;
                        }
                        return `<span class="table-row-order ml-2" data-row="${dataRow}">${row?.['order']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '18%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return `<input type="text" class="form-control table-row-group-title-edit" value="${row?.['group_title']}">
                                    <div class="d-flex hidden area-group-show">
                                        <b><p class="text-uppercase mt-2 mr-2 table-row-group-title-show">${row?.['group_title']}</p></b>
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-edit-group"><span class="icon"><i class="far fa-edit"></i></span></button>
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-del-group"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                    </div>`;
                        }
                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        let itemType = 0  // product
                        if (row?.['promotion_id']) {
                            itemType = 1  // promotion
                        }
                        if (row?.['shipping_id']) {
                            itemType = 2  // shipping
                        }
                        if (itemType === 0) { // PRODUCT
                            return `<textarea class="form-control table-row-item-show zone-readonly" rows="2" data-zone="${dataZone}" readonly>${row?.['product_data']?.['title']}</textarea>
                                    <div class="row table-row-item-area hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select 
                                                class="form-select table-row-item zone-readonly"
                                                id="product-${row?.['order']}"
                                                data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-product')}"
                                                data-method="GET"
                                                data-keyResp="product_sale_list"
                                                data-product-id="${row?.['product_data']?.['id']}"
                                                data-zone="${dataZone}"
                                                readonly>
                                            </select>
                                        </div>
                                    </div>`;
                        } else if (itemType === 1) { // PROMOTION
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-promotion').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row?.['promotion_id']);
                            }
                            return `<div class="table-row-promotion" data-promotion="${JSON.stringify(row?.['promotion_data']).replace(/"/g, "&quot;")}" data-id-product="${row?.['promotion_data']?.['product_data']?.['id']}"><i class="fas fa-tags mr-2"></i><span>${QuotationLoadDataHandle.transEle.attr('data-promotion')}</span></div>`;
                        } else if (itemType === 2) { // SHIPPING
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-shipping').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row?.['shipping_id']);
                            }
                            return `<div class="table-row-shipping" data-shipping="${JSON.stringify(row?.['shipping_data']).replace(/"/g, "&quot;")}"><i class="fas fa-shipping-fast mr-2"></i><span>${QuotationLoadDataHandle.transEle.attr('data-shipping')}</span></div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        let itemType = 0  // product
                        if (row?.['promotion_id']) {
                            itemType = 1  // promotion
                        }
                        if (row?.['shipping_id']) {
                            itemType = 2  // shipping
                        }
                        let des = "--";
                        if (itemType === 0) {  // PRODUCT
                            des = row?.['product_data']?.['description'] ? row?.['product_data']?.['description'] : '';
                        } else if (itemType === 1) {  // PROMOTION
                            des = row?.['promotion_data']?.['product_data']?.['description'] ? row?.['promotion_data']?.['product_data']?.['description'] : '';
                        }
                        return `<textarea class="form-control table-row-description zone-readonly" rows="2" data-zone="${dataZone}" readonly>${des}</textarea>`;
                    }
                },
                {
                    targets: 3,
                    width: '8%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<select 
                                    class="form-select table-row-uom"
                                    data-url="${QuotationDataTableHandle.uomInitEle.attr('data-url')}"
                                    data-method="${QuotationDataTableHandle.uomInitEle.attr('data-method')}"
                                    data-keyResp="unit_of_measure"
                                    data-zone="${dataZone}"
                                    required
                                 >
                                </select>`;
                    },
                },
                {
                    targets: 4,
                    width: '8%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<input type="text" class="form-control table-row-quantity validated-number" value="${row?.['product_quantity']}" data-zone="${dataZone}" required>`;
                    }
                },
                {
                    targets: 5,
                    width: '16%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<div class="row">
                                    <div class="input-group input-group-price">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price" 
                                            value="${row?.['product_unit_price']}"
                                            data-return-type="number"
                                            data-zone="${dataZone}"
                                        >
                                        <button
                                            type="button"
                                            class="btn btn-icon btn-outline-light btn-select-price"
                                            data-bs-toggle="modal"
                                            data-bs-target="#selectPriceModal"
                                            data-zone="${dataZone}"
                                            disabled
                                        ><i class="fas fa-ellipsis-h"></i>
                                        </button>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    width: '8%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<div class="row">
                                    <div class="input-group">
                                        <div class="input-affix-wrapper">
                                            <input type="text" class="form-control table-row-discount validated-number zone-readonly" value="${row?.['product_discount_value']}" data-zone="${dataZone}">
                                            <div class="input-suffix"><small><i class="fas fa-percentage"></i></small></div>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        class="form-control mask-money table-row-discount-amount"
                                        data-return-type="number"
                                        hidden
                                    >
                                    <input
                                        type="text"
                                        class="form-control table-row-discount-amount-raw"
                                        value="0"
                                        hidden
                                    >
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '8%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<select
                                    class="form-select table-row-tax"
                                    data-url="${QuotationDataTableHandle.taxInitEle.attr('data-url')}"
                                    data-method="${QuotationDataTableHandle.taxInitEle.attr('data-method')}"
                                    data-keyResp="tax_list"
                                    data-zone="${dataZone}"
                                 >
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row?.['product_tax_amount']}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row?.['product_tax_amount']}"
                                    hidden
                                >`;
                    }
                },
                {
                    targets: 8,
                    width: '12%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<div class="row subtotal-area">
                                <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['product_subtotal_price'] ? row?.['product_subtotal_price'] : '0')}" data-zone="${dataZone}"></span></p>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row?.['product_subtotal_price']}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 9,
                    width: '1%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-zone="${dataZone}"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            drawCallback: function () {
                // QuotationCalculateCaseHandle.calculateAllRowsTableProduct();
                if (['post', 'put'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    QuotationDataTableHandle.dtbProductHDCustom();
                }
            },
        });
    };

    static dataTableCost(data) {
        // init dataTable
        QuotationDataTableHandle.$tableCost.DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            searching: false,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        let itemType = 0  // product
                        if (row?.['shipping_id']) {
                            itemType = 1  // shipping
                        }
                        if (itemType === 0) {  // product
                            return `<textarea class="form-control table-row-item-show zone-readonly" rows="2" data-zone="${dataZone}" readonly>${row?.['product_data']?.['title']}</textarea>
                                    <div class="row table-row-item-area hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select
                                                class="form-select table-row-item disabled-custom-show zone-readonly"
                                                data-url="${QuotationDataTableHandle.productInitEle.attr('data-url')}"
                                                data-link-detail="${QuotationDataTableHandle.productInitEle.attr('data-link-detail')}"
                                                data-method="${QuotationDataTableHandle.productInitEle.attr('data-method')}"
                                                data-keyResp="product_sale_list"
                                                data-product-id="${row?.['product_data']?.['id']}"
                                                data-zone="${dataZone}"
                                                readonly
                                            >
                                            </select>
                                        </div>
                                    </div>`;
                        } else if (itemType === 1) {  // shipping
                            let link = "";
                            let linkDetail = $('#data-init-quotation-create-shipping').data('link-detail');
                            if (linkDetail) {
                                link = linkDetail.format_url_with_uuid(row?.['shipping']?.['id']);
                            }
                            return `<div class="table-row-shipping" data-shipping="${JSON.stringify(row?.['shipping_data']).replace(/"/g, "&quot;")}"><i class="fas fa-shipping-fast mr-2"></i><span>${QuotationLoadDataHandle.transEle.attr('data-shipping')}</span></div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        let readonly = ''  // product
                        if (row?.['shipping_id']) {
                            readonly = 'readonly'  // shipping
                        }
                        return `<select class="form-select table-row-supplied-by" data-zone="${dataZone}" ${readonly}></select>`;
                    }
                },
                {
                    targets: 3,
                    render: () => {
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        return `<select 
                                    class="form-select table-row-uom disabled-custom-show zone-readonly"
                                    data-url="${QuotationDataTableHandle.uomInitEle.attr('data-url')}"
                                    data-method="${QuotationDataTableHandle.uomInitEle.attr('data-method')}"
                                    data-keyResp="unit_of_measure"
                                    data-zone="${dataZone}"
                                    readonly
                                >
                                </select>`;
                    },
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        return `<input type="text" class="form-control table-row-quantity disabled-custom-show zone-readonly" value="${row?.['product_quantity']}" data-zone="${dataZone}" disabled>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        let disabled = ''  // product
                        if (row?.['shipping_id']) {
                            disabled = 'disabled'  // shipping
                        }
                        return `<div class="row">
                                        <div class="input-group input-group-price">
                                            <input 
                                                type="text" 
                                                class="form-control mask-money table-row-price disabled-custom-show" 
                                                value="${row?.['product_cost_price']}"
                                                data-return-type="number"
                                                data-zone="${dataZone}"
                                            >
                                            <button
                                                type="button"
                                                class="btn btn-icon btn-outline-light btn-select-cost"
                                                data-bs-toggle="modal"
                                                data-bs-target="#selectCostModal"
                                                data-zone="${dataZone}"
                                                ${disabled}
                                            ><i class="fas fa-ellipsis-h"></i>
                                            </button>
                                        </div>
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        let readonly = ''  // product
                        if (row?.['shipping_id']) {
                            readonly = 'readonly'  // shipping
                        }
                        return `<select 
                                    class="form-select table-row-tax"
                                    data-url="${QuotationDataTableHandle.taxInitEle.attr('data-url')}"
                                    data-method="${QuotationDataTableHandle.taxInitEle.attr('data-method')}"
                                    data-keyResp="tax_list"
                                    data-zone="${dataZone}"
                                    ${readonly}
                                >
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row?.['product_tax_amount']}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row?.['product_tax_amount']}"
                                    hidden
                                >`;
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        return `<div class="row subtotal-area">
                                <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['product_subtotal_price'] ? row?.['product_subtotal_price'] : '0')}" data-zone="${dataZone}"></span></p>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row?.['product_subtotal_price']}"
                                    hidden
                                >
                            </div>`;
                    }
                },
            ],
        });
    };

    static dataTableExpense(data) {
        // init dataTable
        QuotationDataTableHandle.$tableExpense.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [  // 50,300,300,100,150,250,100,200,50 (1500p)
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '20%',
                    render: (data, type, row) => {
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        if (row?.['is_labor'] === false) {
                            return `<input type="text" class="form-control table-row-expense-title" value="${row?.['expense_title']}" data-zone="${dataZone}" required>`;
                        } else {
                            return `<select 
                                    class="form-select table-row-labor-item" 
                                    data-url="${QuotationDataTableHandle.expenseInitEle.attr('data-url')}"
                                    data-link-detail="${QuotationDataTableHandle.expenseInitEle.attr('data-link-detail')}"
                                    data-method="${QuotationDataTableHandle.expenseInitEle.attr('data-method')}"
                                    data-keyResp="expense_list"
                                    data-zone="${dataZone}"
                                    required>
                                    </select>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    render: (data, type, row) => {
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        if (row?.['is_labor'] === false) {
                           return `<select 
                                    class="form-select table-row-item" 
                                    data-url="${QuotationDataTableHandle.expenseItemInitEle.attr('data-url')}"
                                    data-link-detail="${QuotationDataTableHandle.expenseItemInitEle.attr('data-link-detail')}"
                                    data-method="${QuotationDataTableHandle.expenseItemInitEle.attr('data-method')}"
                                    data-keyResp="expense_item_list"
                                    data-zone="${dataZone}"
                                    required>
                                    </select>`;
                        } else {
                            return `<select 
                                    class="form-select table-row-item" 
                                    data-url="${QuotationDataTableHandle.expenseItemInitEle.attr('data-url')}"
                                    data-link-detail="${QuotationDataTableHandle.expenseItemInitEle.attr('data-link-detail')}"
                                    data-method="${QuotationDataTableHandle.expenseItemInitEle.attr('data-method')}"
                                    data-keyResp="expense_item_list"
                                    data-zone="${dataZone}"
                                    disabled>
                                    </select>`;
                        }

                    }
                },
                {
                    targets: 3,
                    width: '6.66%',
                    render: (data, type, row) => {
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        if (row?.['is_labor'] === false) {
                           return `<select 
                                        class="form-select table-row-uom"
                                        data-url="${QuotationDataTableHandle.uomInitEle.attr('data-url')}"
                                        data-method="${QuotationDataTableHandle.uomInitEle.attr('data-method')}"
                                        data-keyResp="unit_of_measure"
                                        data-zone="${dataZone}"
                                        required
                                    >
                                    </select>`;
                        } else {
                            return `<select 
                                        class="form-select table-row-uom"
                                        data-url="${QuotationDataTableHandle.uomInitEle.attr('data-url')}"
                                        data-method="${QuotationDataTableHandle.uomInitEle.attr('data-method')}"
                                        data-keyResp="unit_of_measure"
                                        data-zone="${dataZone}"
                                        required
                                    >
                                    </select>`;
                        }
                    },
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<input type="text" class="form-control table-row-quantity validated-number" value="${row?.['expense_quantity']}" data-zone="${dataZone}" required>`;
                    }
                },
                {
                    targets: 5,
                    width: '16.66%',
                    render: (data, type, row) => {
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-price" 
                                    value="${row?.['expense_price']}"
                                    data-return-type="number"
                                    data-zone="${dataZone}"
                                >`;
                    }
                },
                {
                    targets: 6,
                    width: '6.66%',
                    render: (data, type, row) => {
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<select 
                                    class="form-select table-row-tax"
                                    data-url="${QuotationDataTableHandle.taxInitEle.attr('data-url')}"
                                    data-method="${QuotationDataTableHandle.taxInitEle.attr('data-method')}"
                                    data-keyResp="tax_list"
                                    data-zone="${dataZone}"
                                >
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row.expense_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.expense_tax_amount}"
                                    hidden
                                >`;
                    }
                },
                {
                    targets: 7,
                    width: '13.33%',
                    render: (data, type, row) => {
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<div class="row subtotal-area">
                                <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['expense_subtotal_price'] ? row?.['expense_subtotal_price'] : '0')}" data-zone="${dataZone}"></span></p>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row.expense_subtotal_price}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 8,
                    width: '3.33%',
                    render: () => {
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-zone="${dataZone}"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`
                    }
                },
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
                if (['post', 'put'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    QuotationDataTableHandle.dtbExpenseHDCustom();
                }
            },
        });
    };

    static dataTablePromotion(data) {
        // init dataTable
        let $tables = $('#datable-quotation-create-promotion');
        $tables.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row?.['title']}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let disabled = ``;
                        if (row?.['is_pass'] === false) {
                            disabled = `disabled`;
                        }
                        return `<button type="button" class="btn btn-primary btn-sm apply-promotion" data-promotion="${JSON.stringify(row).replace(/"/g, "&quot;")}" data-bs-dismiss="modal" ${disabled}>${QuotationLoadDataHandle.transEle.attr('data-apply')}</button>`;
                    },
                }
            ],
        });
        if ($tables.hasClass('dataTable')) {
            $tables.DataTable().clear().draw();
            $tables.DataTable().rows.add(data ? data : []).draw();
        }
    };

    static dataTableCopyQuotation(data) {
        // init dataTable
        let $tables = $('#datable-copy-quotation');
        $tables.DataTableDefault({
            data: data ? data : [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        if (row?.['title'] && row?.['code']) {
                            return `<div class="d-flex align-items-center ml-2">
                                        <div class="form-check form-check-lg">
                                            <input type="radio" name="row-check" class="form-check-input table-row-check" id="copy-${row?.['id'].replace(/-/g, "")}" data-id="${row?.['id']}">
                                            <span class="badge badge-soft-success">${row?.['code'] ? row?.['code'] : ''}</span>
                                            <label class="form-check-label table-row-title" for="copy-${row?.['id'].replace(/-/g, "")}">${row?.['title']}</label>
                                        </div>
                                    </div>`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        if (row?.['opportunity']?.['title'] && row?.['opportunity']?.['code']) {
                            return `<span class="badge badge-light">${row?.['opportunity']?.['code'] ? row?.['opportunity']?.['code'] : ''}</span>
                                    <span class="table-row-customer">${row?.['opportunity']?.['title']}</span>`;
                        }
                        return ``;
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row?.['customer']?.['title']) {
                            return `<p class="table-row-customer">${row?.['customer']?.['title']}</p>`;
                        }
                        return ``;
                    },
                }
            ],
            drawCallback: function () {
                QuotationLoadDataHandle.loadEventRadio($tables);
            },
        });
    };

    static dataTableCopyQuotationProduct(data) {
        // init dataTable
        let $tables = $('#datable-copy-quotation-product');
        $tables.DataTableDefault({
            data: data ? data : [],
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function () {
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '40%',
                    render: (data, type, row) => {
                        return `<div class="d-flex align-items-center">
                                        <div class="form-check">
                                            <input 
                                                type="checkbox"
                                                class="form-check-input table-row-check-product"
                                                data-id="${row?.['product_data']?.['id']}"
                                            >
                                        </div>
                                        <span class="table-row-title">${row?.['product_title']}</span>
                                </div>`;
                    }
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row?.['product_quantity']}</span>`
                    },
                },
                {
                    targets: 3,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-quantity-input" value="${row?.['product_quantity']}">`
                    },
                }
            ],
        });
    };

    static dataTableShipping(data) {
        // init dataTable
        let $tables = $('#datable-quotation-create-shipping');
        $tables.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            drawCallback: function () {
                $.fn.initMaskMoney2();
            },
            rowCallback: function (row, data) {
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row?.['title']}</span>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let disabled = '';
                        if (row?.['is_pass'] === false) {
                            disabled = 'disabled';
                        }
                        return `<button type="button" class="btn btn-primary btn-sm apply-shipping" data-shipping="${JSON.stringify(row).replace(/"/g, "&quot;")}" data-bs-dismiss="modal" ${disabled}>${QuotationLoadDataHandle.transEle.attr('data-apply')}</button>`;
                    },
                }
            ],
        });
        if ($tables.hasClass('dataTable')) {
            $tables.DataTable().clear().draw();
            $tables.DataTable().rows.add(data ? data : []).draw();
        }
    };

    static loadTableQuotationShipping() {
        let ele = $('#data-init-quotation-create-shipping');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        let passList = [];
        let failList = [];
        let checkList = [];
        QuotationDataTableHandle.dataTableShipping();
        $.fn.callAjax2({
                'url': url,
                'method': method,
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('shipping_check_list') && Array.isArray(data.shipping_check_list)) {
                        let shippingAddress = $('#quotation-create-shipping-address').val();
                        if (shippingAddress) {
                            data.shipping_check_list.map(function (item) {
                                if (!checkList.includes(item?.['id'])) {
                                    let checkData = shippingHandle.checkShippingValid(item, shippingAddress);
                                    if (checkData?.['is_pass'] === true) {
                                        passList.push(checkData);
                                    } else {
                                        failList.push(checkData);
                                    }
                                    checkList.push(item?.['id']);
                                }
                            })
                            passList = passList.concat(failList);
                            QuotationDataTableHandle.dataTableShipping(passList);
                        } else {
                            QuotationDataTableHandle.dataTableShipping(passList);
                            $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-check-if-shipping-address')}, 'info');
                        }
                    }
                }
            }
        )
    };

    static dataTableQuotationIndicator(data) {
        let $tables = $('#datable-quotation-create-indicator');
        $tables.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row, meta) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}" data-value="${(meta.row + 1)}" data-zone="quotation_indicators_data">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '40%',
                    render: (data, type, row) => {
                        return `<b class="table-row-title" data-id="${row?.['indicator_data']?.['id']}" data-zone="quotation_indicators_data">${row?.['indicator_data']?.['title']}</b>`
                    }
                },
                {
                    targets: 2,
                    width: '30%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-value" data-init-money="${parseFloat(row?.['indicator_value'])}" data-value="${row?.['indicator_value']}" data-zone="quotation_indicators_data"></span>`
                    }
                },
                {
                    targets: 3,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="table-row-rate" data-value="${row?.['indicator_rate']}" data-zone="quotation_indicators_data">${row?.['indicator_rate']} %</span>`
                    }
                }
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
                QuotationDataTableHandle.dtbIndicatorHDCustom($tables);
            },
        });
        if ($tables.hasClass('dataTable')) {
            $tables.DataTable().clear().draw();
            $tables.DataTable().rows.add(data ? data : []).draw();
        }
    };

    static dataTableSaleOrderIndicator(data) {
        let $tables = $('#datable-quotation-create-indicator');
        $tables.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row, meta) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}" data-value="${(meta.row + 1)}" data-zone="sale_order_indicators_data">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<b class="table-row-title" data-id="${row?.['quotation_indicator_data']?.['id']}" data-zone="sale_order_indicators_data">${row?.['quotation_indicator_data']?.['title']}</b>`
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-quotation-value" data-init-money="${parseFloat(row?.['quotation_indicator_value'])}" data-value="${row?.['quotation_indicator_value']}" data-zone="sale_order_indicators_data"></span>`
                    }
                },
                {
                    targets: 3,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-value" data-init-money="${parseFloat(row?.['indicator_value'])}" data-value="${row?.['indicator_value']}" data-zone="sale_order_indicators_data"></span>`
                    }
                },
                {
                    targets: 4,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-difference-value" data-init-money="${parseFloat(row?.['difference_indicator_value'])}" data-value="${row?.['difference_indicator_value']}" data-zone="sale_order_indicators_data"></span>`
                    }
                },
                {
                    targets: 5,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<span class="table-row-rate" data-value="${row?.['indicator_rate']}" data-zone="sale_order_indicators_data">${row?.['indicator_rate']} %</span>`
                    }
                }
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
                QuotationDataTableHandle.dtbIndicatorHDCustom($tables);
            },
        });
        if ($tables.hasClass('dataTable')) {
            $tables.DataTable().clear().draw();
            $tables.DataTable().rows.add(data ? data : []).draw();
        }
    };

    static dataTablePaymentStage(data) {
        // init dataTable
        QuotationDataTableHandle.$tablePayment.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '10%',
                    render: () => {
                        return `<select class="form-select table-row-installment"></select>`;
                    }
                },
                {
                    targets: 2,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-remark" rows="2">${row?.['remark'] ? row?.['remark'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 3,
                    width: '8%',
                    render: (data, type, row) => {
                        let value = "";
                        if (row?.['date'] !== "") {
                            value = moment(row?.['date']).format('DD/MM/YYYY');
                        }
                        return `<div class="input-affix-wrapper">
                                    <input type="text" class="form-control table-row-date" data-number-of-day="${row?.['number_of_day']}" value="${value}">
                                    <div class="input-suffix"><i class="fas fa-calendar-alt"></i></div>
                                </div>`;
                    },
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-date-type" rows="2" readonly>${row?.['date_type'] ? row?.['date_type'] : ""}</textarea>`;
                    }
                },
                {
                    targets: 5,
                    width: '6%',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <div class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-ratio validated-number" value="${row?.['payment_ratio'] ? row?.['payment_ratio'] : '0'}">
                                        <div class="input-suffix"><small><i class="fas fa-percentage"></i></small></div>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-before-tax text-black" 
                                    value="${row?.['value_before_tax'] ? row?.['value_before_tax'] : '0'}"
                                    data-return-type="number"
                                    disabled
                                >`;
                    }
                },
                {
                    targets: 7,
                    width: '8%',
                    render: () => {
                        return `<select class="form-select table-row-issue-invoice"></select>`;
                    }
                },
                {
                    targets: 8,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-after-tax text-black" 
                                    value="${row?.['value_after_tax'] ? row?.['value_after_tax'] : '0'}"
                                    data-return-type="number"
                                    disabled
                                >`;
                    }
                },
                {
                    targets: 9,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-total text-black" 
                                    value="${row?.['value_total'] ? row?.['value_total'] : '0'}"
                                    data-return-type="number"
                                >`;
                    }
                },
                {
                    targets: 10,
                    width: '8%',
                    render: (data, type, row) => {
                        let value = "";
                        if (row?.['due_date'] !== "") {
                            value = moment(row?.['due_date']).format('DD/MM/YYYY');
                        }
                        return `<div class="input-affix-wrapper">
                                    <input type="text" class="form-control table-row-due-date text-black" value="${value}">
                                    <div class="input-suffix"><i class="fas fa-calendar-alt"></i></div>
                                </div>`;
                    }
                },
                {
                    targets: 11,
                    width: '1%',
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
                if (['post', 'put'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    QuotationDataTableHandle.dtbPaymentHDCustom();
                }
            },
        });
    };

    static dataTableSelectProduct(data) {
        QuotationDataTableHandle.$tableSProduct.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            pageLength: 5,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        let clsZoneReadonly = '';
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }

                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        let disabled = '';
                        let checked = '';
                        if (QuotationDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${row?.['id']}"]`)) {
                            disabled = 'disabled';
                            checked = 'checked';
                            clsZoneReadonly = 'zone-readonly';
                        }
                        let checkBOM = QuotationLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            disabled = 'disabled';
                            checked = '';
                            clsZoneReadonly = 'zone-readonly';
                        }
                        if (row?.['title'] && row?.['code']) {
                            return `<div class="d-flex align-items-center ml-2">
                                        <div class="form-check form-check-lg">
                                            <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox ${clsZoneReadonly}" id="s-product-${row?.['id'].replace(/-/g, "")}" data-row="${dataRow}" ${disabled} ${checked} data-zone="${dataZone}">
                                            <span class="badge badge-soft-success">${row?.['code'] ? row?.['code'] : ''}</span>
                                            <label class="form-check-label table-row-title" for="s-product-${row?.['id'].replace(/-/g, "")}">${row?.['title']}</label>
                                        </div>
                                    </div>`;
                        }
                        return `<span>--</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-description" rows="2" readonly>${row?.['description'] ? row?.['description'] : ''}</textarea>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['sale_information']?.['default_uom']?.['title'] ? row?.['sale_information']?.['default_uom']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let txt = QuotationLoadDataHandle.transEle.attr('data-available');
                        let badge = 'success';
                        if (QuotationDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${row?.['id']}"]`)) {
                            txt = QuotationLoadDataHandle.transEle.attr('data-product-note-1');
                            badge = 'warning';
                        }
                        let checkBOM = QuotationLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            txt = QuotationLoadDataHandle.transEle.attr('data-unavailable');
                            badge = 'danger';
                        }
                        return `<span class="badge badge-${badge} badge-outline table-row-status">${txt}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let txt = '';
                        if (QuotationDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${row?.['id']}"]`)) {
                            txt = QuotationLoadDataHandle.transEle.attr('data-product-note-1');
                        }
                        let checkBOM = QuotationLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            txt = QuotationLoadDataHandle.transEle.attr(checkBOM?.['note_type']);
                        }
                        return `<span class="table-row-note">${txt}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                QuotationLoadDataHandle.loadEventCheckbox(QuotationDataTableHandle.$tableSProduct);
            },
        });
    };

    // Custom dtb
    static dtbProductHDCustom() {
        let $table = QuotationDataTableHandle.$tableProduct;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-product-quotation-create').length && !$('#btn-add-product-group-quotation').length && !$('#btn-check-promotion').length && !$('#btn-add-shipping').length) {
                let dataZone = "quotation_products_data";
                if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                    dataZone = "sale_order_products_data";
                }
                let $group = $(`<button type="button" class="btn btn-outline-secondary" aria-expanded="false" data-bs-toggle="dropdown" data-zone="${dataZone}">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${QuotationLoadDataHandle.transEle.attr('data-add')}</span><span class="icon"><i class="fas fa-angle-down fs-8 text-light"></i></span></span>
                                </button>
                                <div class="dropdown-menu w-210p">
                                    <a class="dropdown-item" href="#" id="btn-add-product-quotation-create" data-bs-toggle="modal" data-bs-target="#selectProductModal"><i class="dropdown-icon fas fa-cube"></i><span class="mt-2">${QuotationLoadDataHandle.transEle.attr('data-add-product')}</span></a>
                                    <a class="dropdown-item" href="#" id="btn-add-product-group-quotation"><i class="dropdown-icon fas fa-layer-group"></i><span>${QuotationLoadDataHandle.transEle.attr('data-add-group')}</span></a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="#" id="btn-add-shipping" data-bs-toggle="modal" data-bs-target="#shippingFeeModalCenter"><i class="dropdown-icon fas fa-shipping-fast"></i><span class="mt-2">${QuotationLoadDataHandle.transEle.attr('data-shipping')}</span></a>
                                    <a class="dropdown-item" href="#" id="btn-check-promotion" data-bs-toggle="modal" data-bs-target="#promotionModalCenter"><i class="dropdown-icon fas fa-tags"></i><span>${QuotationLoadDataHandle.transEle.attr('data-promotion')}</span></a>
                                </div>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-product-quotation-create').on('click', function () {
                    QuotationLoadDataHandle.loadModalSProduct();
                    indicatorHandle.loadIndicator();
                });
                $('#btn-add-product-group-quotation').on('click', function () {
                    QuotationLoadDataHandle.loadAddRowProductGr();
                });
                $('#btn-add-shipping').on('click', function () {
                    QuotationDataTableHandle.loadTableQuotationShipping();
                });
                $('#btn-check-promotion').on('click', function () {
                    QuotationPromotionHandle.callPromotion(0);
                });
            }
        }
    };

    static dtbExpenseHDCustom() {
        let $table = QuotationDataTableHandle.$tableExpense;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-expense-quotation-create').length && !$('#btn-add-labor-quotation-create').length) {
                let dataZone = "quotation_expenses_data";
                if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                    dataZone = "sale_order_expenses_data";
                }
                let $group = $(`<button type="button" class="btn btn-outline-secondary" aria-expanded="false" data-bs-toggle="dropdown" data-zone="${dataZone}">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${QuotationLoadDataHandle.transEle.attr('data-add')}</span><span class="icon"><i class="fas fa-angle-down fs-8 text-light"></i></span></span>
                                </button>
                                <div class="dropdown-menu w-210p">
                                    <a class="dropdown-item" href="#" id="btn-add-expense-quotation-create"><i class="dropdown-icon fas fa-hand-holding-usd"></i><span class="mt-2">${QuotationLoadDataHandle.transEle.attr('data-add-expense')}</span></a>
                                    <a class="dropdown-item" href="#" id="btn-add-labor-quotation-create"><i class="dropdown-icon fas fa-people-carry"></i><span>${QuotationLoadDataHandle.transEle.attr('data-add-labor')}</span></a>
                                </div>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-expense-quotation-create').on('click', function () {
                    QuotationLoadDataHandle.loadAddRowExpense();
                });
                $('#btn-add-labor-quotation-create').on('click', function () {
                    QuotationLoadDataHandle.loadAddRowLabor();
                });
            }
        }
    };

    static dtbPaymentHDCustom() {
        let $table = QuotationDataTableHandle.$tablePayment;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-payment-stage').length) {
                let $group = $(`<button type="button" class="btn btn-outline-secondary" id="btn-add-payment-stage" data-zone="sale_order_payment_stage">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${QuotationLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-payment-stage').on('click', function () {
                    QuotationLoadDataHandle.loadAddPaymentStage();
                });
            }
        }
    };

    static dtbIndicatorHDCustom($table) {
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-refresh-indicator').length) {
                let html1 = `<button type="button" class="btn btn-outline-secondary" id="btn-refresh-indicator">${QuotationLoadDataHandle.transEle.attr('data-refresh')}</button>`;
                let $group = $(`<div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                                ${html1}
                            </div>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-refresh-indicator').on('click', function () {
                    document.getElementById('quotation-indicator-data').value = "";
                    indicatorHandle.loadIndicator();
                    $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-refreshed')}, 'success');
                });
            }
        }
    };
}

// Calculate
class QuotationCalculateCaseHandle {

    static updateTotal(table) {
        // *** quotation & sale order have different rules ***
        // Quotation: discount on row apply to subtotal => pretax includes discount on row => discount on total = pretax * %discountTotalRate
        // Sale order: discount on row not apply to subtotal => pretax not includes discount on row => discount on total = (pretax - discountRows) * %discountTotalRate
        let form = document.getElementById('frm_quotation_create');
        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
        let tableExpenseWrapper = document.getElementById('datable-quotation-create-expense_wrapper');
        let pretaxAmount = 0;
        let discountAmount = 0;
        let discountAmountTotal = 0;
        let taxAmount = 0;
        let elePretaxAmount = null;
        let eleTaxes = null;
        let eleTotal = null;
        let eleDiscount = null;
        let elePretaxAmountRaw = null;
        let eleTaxesRaw = null;
        let eleTotalRaw = null;
        let eleDiscountRaw = null;
        let eleDiscountRateTotal = null;
        let finalRevenueBeforeTax = null;
        if (table.id === 'datable-quotation-create-product') {
            if (tableProductWrapper) {
                let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                if (tableProductFt) {
                    elePretaxAmount = tableProductFt.querySelector('.quotation-create-product-pretax-amount');
                    eleTaxes = tableProductFt.querySelector('.quotation-create-product-taxes');
                    eleTotal = tableProductFt.querySelector('.quotation-create-product-total');
                    eleDiscount = tableProductFt.querySelector('.quotation-create-product-discount-amount');
                    elePretaxAmountRaw = tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw');
                    eleTaxesRaw = tableProductFt.querySelector('.quotation-create-product-taxes-raw');
                    eleTotalRaw = tableProductFt.querySelector('.quotation-create-product-total-raw');
                    eleDiscountRaw = tableProductFt.querySelector('.quotation-create-product-discount-amount-raw');
                    eleDiscountRateTotal = tableProductFt.querySelector('.quotation-create-product-discount');
                    finalRevenueBeforeTax = tableProductFt.querySelector('.quotation-final-revenue-before-tax');
                }
            }
        } else if (table.id === 'datable-quotation-create-cost') {
            let tableCost = document.getElementById('datable-quotation-create-cost');
            elePretaxAmount = tableCost.querySelector('.quotation-create-cost-pretax-amount');
            eleTaxes = tableCost.querySelector('.quotation-create-cost-taxes');
            eleTotal = tableCost.querySelector('.quotation-create-cost-total');
            elePretaxAmountRaw = tableCost.querySelector('.quotation-create-cost-pretax-amount-raw');
            eleTaxesRaw = tableCost.querySelector('.quotation-create-cost-taxes-raw');
            eleTotalRaw = tableCost.querySelector('.quotation-create-cost-total-raw');
        } else if (table.id === 'datable-quotation-create-expense') {
            if (tableExpenseWrapper) {
                let tableExpenseFt = tableExpenseWrapper.querySelector('.dataTables_scrollFoot');
                if (tableExpenseFt) {
                    elePretaxAmount = tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount');
                    eleTaxes = tableExpenseFt.querySelector('.quotation-create-expense-taxes');
                    eleTotal = tableExpenseFt.querySelector('.quotation-create-expense-total');
                    elePretaxAmountRaw = tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount-raw');
                    eleTaxesRaw = tableExpenseFt.querySelector('.quotation-create-expense-taxes-raw');
                    eleTotalRaw = tableExpenseFt.querySelector('.quotation-create-expense-total-raw');
                }
            }
        }
        if (elePretaxAmount && elePretaxAmountRaw && eleTaxes && eleTaxesRaw && eleTotal && eleTotalRaw) {
            let shippingFee = 0;
            $(table).DataTable().rows().every(function () {
                let row = this.node();
                let is_promotion = false;
                if (row.querySelector('.table-row-promotion')) {
                    is_promotion = true
                }
                // calculate Pretax Amount
                let subtotalRaw = row.querySelector('.table-row-subtotal-raw');
                if (subtotalRaw) {
                    if (subtotalRaw.value) {
                        // check if not promotion then plus else minus
                        if (is_promotion === false) { // not promotion
                            pretaxAmount += parseFloat(subtotalRaw.value)
                        } else { // promotion
                            if (row.querySelector('.table-row-promotion').getAttribute('data-promotion')) {
                                let dataPm = JSON.parse(row.querySelector('.table-row-promotion').getAttribute('data-promotion'));
                                if (dataPm?.['is_on_row'] === true) {
                                    pretaxAmount -= parseFloat(subtotalRaw.value);
                                }
                            }
                        }
                        // get shipping fee to minus on discount total
                        if (row.querySelector('.table-row-shipping')) {
                            shippingFee = parseFloat(subtotalRaw.value);
                        }
                    }
                }
                // calculate Tax Amount
                let subTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
                if (subTaxAmountRaw) {
                    if (subTaxAmountRaw.value) {
                        // check if not promotion then plus else minus
                        if (is_promotion === false) { // not promotion
                            taxAmount += parseFloat(subTaxAmountRaw.value)
                        } else { // promotion
                            if (row.querySelector('.table-row-promotion').getAttribute('data-promotion')) {
                                let dataPm = JSON.parse(row.querySelector('.table-row-promotion').getAttribute('data-promotion'));
                                if (dataPm?.['is_on_row'] === true) {
                                    taxAmount -= parseFloat(subTaxAmountRaw.value);
                                }
                            }
                        }
                    }
                }
                // calculate Discount Amount
                let eleRowDiscountAmountRaw = row.querySelector('.table-row-discount-amount-raw');
                let eleRowQuantity = row.querySelector('.table-row-quantity');
                if (eleRowDiscountAmountRaw && eleRowQuantity) {
                    discountAmount += (parseFloat(eleRowDiscountAmountRaw.value) * parseFloat(eleRowQuantity.value));
                }
            });
            let discount_on_total = 0;
            let discountTotalRate = '0';
            if (tableProductWrapper) {
                let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                if (tableProductFt) {
                    if (tableProductFt.querySelector('.quotation-create-product-discount')) {
                        discountTotalRate = tableProductFt.querySelector('.quotation-create-product-discount').value;
                    }
                }
            }
            if (form.classList.contains('sale-order')) {
                discountTotalRate = $('#quotation-copy-discount-on-total').val();
            }
            if (discountTotalRate && eleDiscount) {
                if (!form.classList.contains('sale-order')) {  // quotation
                    discount_on_total = parseFloat(discountTotalRate);
                    discountAmount = ((pretaxAmount * discount_on_total) / 100);
                    // check if shipping fee then minus before calculate discount
                    if (shippingFee > 0) {
                        discountAmount = (((pretaxAmount - shippingFee) * discount_on_total) / 100);
                    }
                    discountAmountTotal += discountAmount;
                } else {  // sale order
                    discount_on_total = parseFloat(discountTotalRate);
                    // check if shipping fee then minus before calculate discount
                    let discountAmountOnTotal = (((pretaxAmount - discountAmount) * discount_on_total) / 100);
                    if (shippingFee > 0) {
                        discountAmountOnTotal = (((pretaxAmount - discountAmount - shippingFee) * discount_on_total) / 100);
                    }
                    discountAmount += discountAmountOnTotal;
                    discountAmountTotal += discountAmountOnTotal;

                    if (pretaxAmount > 0) {
                        discount_on_total = ((discountAmount / pretaxAmount) * 100).toFixed(2);
                        if (eleDiscountRateTotal) {
                            eleDiscountRateTotal.value = discount_on_total;
                        }
                    }
                }
            }
            let totalFinal = (pretaxAmount - discountAmount + taxAmount);
            $(elePretaxAmount).attr('data-init-money', String(pretaxAmount));
            elePretaxAmountRaw.value = pretaxAmount;

            if (eleDiscount && eleDiscountRaw) {
                $(eleDiscount).attr('data-init-money', String(discountAmount));
                eleDiscountRaw.value = discountAmount;
            }

            if (finalRevenueBeforeTax) {
                if (!form.classList.contains('sale-order')) {  // quotation (revenue = pretaxAmount - discountAmountTotal)
                    finalRevenueBeforeTax.value = pretaxAmount - discountAmountTotal;
                } else {  // sale order (revenue = pretaxAmount - discountAmount)
                    finalRevenueBeforeTax.value = pretaxAmount - discountAmount;
                }
            }

            $(eleTaxes).attr('data-init-money', String(taxAmount));
            eleTaxesRaw.value = taxAmount;
            $(eleTotal).attr('data-init-money', String(totalFinal));
            eleTotalRaw.value = totalFinal;
        }
        $.fn.initMaskMoney2();
    };

    static calculate(row) {
        let form = document.getElementById('frm_quotation_create');
        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
        let price = 0;
        let quantity = 0;
        let elePrice = row.querySelector('.table-row-price');
        if (elePrice) {
            price = $(elePrice).valCurrency();
        }
        let eleQuantity = row.querySelector('.table-row-quantity');
        if (eleQuantity) {
            if (eleQuantity.value) {
                quantity = parseFloat(eleQuantity.value)
            } else if (!eleQuantity.value || eleQuantity.value === "0") {
                quantity = 0
            }
        }
        let tax = 0;
        let discount = 0;
        let subtotal = (price * quantity);
        let subtotalPlus = 0;
        let eleTax = row.querySelector('.table-row-tax');
        if (eleTax) {
            if ($(eleTax).val()) {
                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                if (dataTax.hasOwnProperty('rate')) {
                    tax = parseInt(dataTax.rate);
                }
            }
        }
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        let eleTaxAmountRaw = row.querySelector('.table-row-tax-amount-raw');
        // calculate discount + tax
        let eleDiscount = row.querySelector('.table-row-discount');
        let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
        let eleDiscountAmountRaw = row.querySelector('.table-row-discount-amount-raw');
        if (eleDiscount && eleDiscountAmount) {
            if (eleDiscount.value) {
                discount = parseFloat(eleDiscount.value)
            } else if (!eleDiscount.value || eleDiscount.value === "0") {
                discount = 0
            }
            let discount_on_total = 0;
            let discountTotalRate = '0';
            if (tableProductWrapper) {
                let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                if (tableProductFt) {
                    if (tableProductFt.querySelector('.quotation-create-product-discount')) {
                        discountTotalRate = tableProductFt.querySelector('.quotation-create-product-discount').value;
                    }
                }
            }
            if (form.classList.contains('sale-order')) {
                discountTotalRate = $('#quotation-copy-discount-on-total').val();
            }
            if (discountTotalRate) {
                discount_on_total = parseFloat(discountTotalRate);
            }
            let discountAmount = ((price * discount) / 100);
            let priceDiscountOnRow = (price - discountAmount);
            if (!form.classList.contains('sale-order')) {
                subtotal = (priceDiscountOnRow * quantity);
            }
            let discountAmountOnTotal = ((priceDiscountOnRow * discount_on_total) / 100);
            subtotalPlus = ((priceDiscountOnRow - discountAmountOnTotal) * quantity);
            // calculate tax
            if (eleTaxAmount) {
                if (!form.classList.contains('sale-order')) { // Quotation (normal calculate)
                    let taxAmount = ((subtotalPlus * tax) / 100);
                    $(eleTaxAmount).attr('value', String(taxAmount));
                    eleTaxAmountRaw.value = taxAmount;
                } else { // Sale Order
                    let taxAmount = ((subtotalPlus * tax) / 100);
                    $(eleTaxAmount).attr('value', String(taxAmount));
                    eleTaxAmountRaw.value = taxAmount;
                }
            }
            // store discount amount
            if (!form.classList.contains('sale-order')) {
                if (discountAmountOnTotal > 0) {
                    $(eleDiscountAmount).attr('value', String(discountAmountOnTotal));
                    eleDiscountAmountRaw.value = discountAmountOnTotal;
                } else {
                    $(eleDiscountAmount).attr('value', String(discountAmount));
                    eleDiscountAmountRaw.value = discountAmount;
                }
            } else {
                $(eleDiscountAmount).attr('value', String(discountAmount));
                eleDiscountAmountRaw.value = discountAmount;
            }
        } else {
            // calculate tax no discount on total
            if (eleTaxAmount) {
                let taxAmount = ((subtotal * tax) / 100);
                $(eleTaxAmount).attr('value', String(taxAmount));
                eleTaxAmountRaw.value = taxAmount;
            }
        }
        // set subtotal value
        let eleSubtotal = row.querySelector('.table-row-subtotal');
        let eleSubtotalRaw = row.querySelector('.table-row-subtotal-raw');
        if (eleSubtotal) {
            $(eleSubtotal).attr('data-init-money', String(subtotal));
            eleSubtotalRaw.value = subtotal;
        }
        $.fn.initMaskMoney2();
    };

    static commonCalculate(table, row) {
        QuotationCalculateCaseHandle.calculate(row);
        // calculate total
        QuotationCalculateCaseHandle.updateTotal(table[0]);
    };

    static calculateAllRowsTableProduct() {
        let $table = $('#datable-quotation-create-product');
        $table.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-item')) {
                QuotationCalculateCaseHandle.commonCalculate($table, row);
            }
        });
    };

    static calculateAllRowsTableCost() {
        let $table = $('#datable-quotation-create-cost');
        $table.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-item')) {
                QuotationCalculateCaseHandle.commonCalculate($table, row);
            }
        });
    };

}

// Config
class QuotationCheckConfigHandle {
    static checkSsLsRole() {
        let configRaw = $('#quotation-config-data').val();
        if (configRaw) {
            let config = JSON.parse(configRaw);
            // check role in ss_role or ls_role
            let empCurrent = JSON.parse($('#employee_current').text());
            let ss_role_id = [];
            let ls_role_id = [];
            for (let role of config?.['ss_role']) {
                ss_role_id.push(role?.['id']);
            }
            for (let role of config?.['ls_role']) {
                ls_role_id.push(role?.['id']);
            }
            for (let roleID of empCurrent?.['role']) {
                if (ss_role_id.includes(roleID)) {
                    QuotationLoadDataHandle.opportunitySelectEle[0].setAttribute('disabled', 'true');
                    $(QuotationLoadDataHandle.opportunitySelectEle[0].closest('.input-group')).after(`<small class="text-red">${QuotationLoadDataHandle.transEle.attr('data-validate-ss-role')}</small>`);
                }
            }
            for (let roleID of empCurrent?.['role']) {
                if (ls_role_id.includes(roleID)) {
                    QuotationLoadDataHandle.opportunitySelectEle[0].setAttribute('required', 'true');
                }
            }
        }
        return true;
    };

    static checkConfig(check_type, row = null, oppID = null) {
        // check_type 0: check all | 1: check single row
        let $form = $('#frm_quotation_create');
        if ($form.attr('data-method').toLowerCase() !== 'get') {
            let configRaw = $('#quotation-config-data').val();
            if (configRaw) {
                if (!oppID) {
                    oppID = QuotationLoadDataHandle.opportunitySelectEle.val();
                }
                let config = JSON.parse(configRaw);
                if (!oppID) { // short sale
                    if (check_type === 0) {  // check All
                        QuotationCheckConfigHandle.checkOnTotal(config, 0);
                        QuotationCheckConfigHandle.checkTableRows(config, 0);
                    }
                    if (check_type === 1) {  // check Single Row
                        QuotationCheckConfigHandle.checkTableRow(config, 0, row);
                    }
                    $.fn.initMaskMoney2();
                    return true;
                } else { // long sale
                    if (check_type === 0) {  // check All
                        QuotationCheckConfigHandle.checkOnTotal(config, 1);
                        QuotationCheckConfigHandle.checkTableRows(config, 1);
                    }
                    if (check_type === 1) {  // check Single Row
                        QuotationCheckConfigHandle.checkTableRow(config, 1, row);
                    }
                    $.fn.initMaskMoney2();
                    return true;
                }
            }
        }
        return true;
    };

    static checkOnTotal(config, check_type) {
        let form = document.getElementById('frm_quotation_create');
        if (check_type === 0) {  // short sale
            if (!form.classList.contains('sale-order')) {  // quotation
                let eleDiscountTotal = document.getElementById('datable-quotation-create-product').closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot').querySelector('.quotation-create-product-discount');
                if (eleDiscountTotal) {
                    if (config?.['short_sale_config']?.['is_discount_on_total'] === false) {
                        eleDiscountTotal.setAttribute('disabled', 'true');
                        eleDiscountTotal.classList.add('disabled-custom-show');
                    } else {
                        if (eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.removeAttribute('disabled');
                            eleDiscountTotal.classList.remove('disabled-custom-show');
                        }
                    }
                }
            }
        }
        if (check_type === 1) {  // long sale
            if (!form.classList.contains('sale-order')) {
                let eleDiscountTotal = document.getElementById('datable-quotation-create-product').closest('.dataTables_scroll').querySelector('.dataTables_scrollFoot').querySelector('.quotation-create-product-discount');
                if (eleDiscountTotal) {
                    if (config?.['long_sale_config']?.['is_not_discount_on_total'] === false) {
                        if (eleDiscountTotal.hasAttribute('disabled')) {
                            eleDiscountTotal.removeAttribute('disabled');
                            eleDiscountTotal.classList.remove('disabled-custom-show');
                        }
                    } else {
                        eleDiscountTotal.setAttribute('disabled', 'true');
                        eleDiscountTotal.classList.add('disabled-custom-show');
                    }
                }
            }
        }
    };

    static checkTableRows(config, check_type) {
        let $table = $('#datable-quotation-create-product');
        $table.DataTable().rows().every(function () {
            let row = this.node();
            QuotationCheckConfigHandle.checkTableRow(config, check_type, row);
        });
        return true;
    };

    static checkTableRow(config, check_type, row) {
        let eleProduct = row.querySelector('.table-row-item');
        if (eleProduct) {
            let btnSPrice = row.querySelector('.btn-select-price');
            let elePrice = row.querySelector('.table-row-price');
            let eleDiscount = row.querySelector('.table-row-discount');
            if (check_type === 0) {  // short sale
                if (config?.['short_sale_config']?.['is_choose_price_list'] === false) {
                    if (btnSPrice) {
                        btnSPrice.setAttribute('disabled', 'true');
                    }
                } else {
                    if (btnSPrice) {
                        btnSPrice.removeAttribute('disabled');
                    }
                }
                if (config?.['short_sale_config']?.['is_input_price'] === false) {
                    if (elePrice) {
                        elePrice.setAttribute('disabled', 'true');
                        elePrice.classList.add('disabled-custom-show');
                        QuotationLoadDataHandle.loadPriceProduct(eleProduct);
                    }
                } else {
                    if (elePrice) {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    }
                }
                if (eleDiscount) {
                    if (config?.['short_sale_config']?.['is_discount_on_product'] === false) {
                        eleDiscount.setAttribute('disabled', 'true');
                        eleDiscount.classList.add('disabled-custom-show');
                    } else {
                        if (eleDiscount.hasAttribute('disabled')) {
                            eleDiscount.removeAttribute('disabled');
                            eleDiscount.classList.remove('disabled-custom-show');
                        }
                    }
                }
            }
            if (check_type === 1) {  // long sale
                if (btnSPrice) {
                    btnSPrice.removeAttribute('disabled');
                }
                if (config?.['long_sale_config']?.['is_not_input_price'] === false) {
                    if (elePrice) {
                        if (elePrice.hasAttribute('disabled')) {
                            elePrice.removeAttribute('disabled');
                            elePrice.classList.remove('disabled-custom-show');
                        }
                    }
                } else {
                    if (elePrice) {
                        elePrice.setAttribute('disabled', 'true');
                        elePrice.classList.add('disabled-custom-show');
                        QuotationLoadDataHandle.loadPriceProduct(eleProduct);
                    }
                }
                if (eleDiscount) {
                    if (config?.['long_sale_config']?.['is_not_discount_on_product'] === false) {
                        if (eleDiscount.hasAttribute('disabled')) {
                            eleDiscount.removeAttribute('disabled');
                            eleDiscount.classList.remove('disabled-custom-show');
                        }
                    } else {
                        eleDiscount.setAttribute('disabled', 'true');
                        eleDiscount.classList.add('disabled-custom-show');
                    }
                }
            }
        }
        return true;
    };

}

// Indicator
class indicatorHandle {
    static loadIndicator() {
        let $ele = $('#quotation-indicator-data');
        if (!$ele.val()) {
            let url = $ele.attr('data-url');
            let method = $ele.attr('data-method');
            $.fn.callAjax2({
                    'url': url,
                    'method': method,
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('quotation_indicator_list') && Array.isArray(data.quotation_indicator_list)) {
                            $ele.val(JSON.stringify(data.quotation_indicator_list));
                            indicatorHandle.calculateIndicator(data.quotation_indicator_list);
                        }
                    }
                }
            )
        } else {
            let data_list = JSON.parse($ele.val());
            indicatorHandle.calculateIndicator(data_list);
        }
    };

    static calculateIndicator(indicator_list) {
        let result_list = [];
        let result_json = {};
        let revenueValue = 0;
        let formSubmit = $('#frm_quotation_create');
        let _form = new SetupFormSubmit(formSubmit);
        QuotationSubmitHandle.setupDataSubmit(_form, 1);
        let data_form = _form.dataForm;
        let dataDetailCopy = {};
        let eleDetailCopy = $('#data-copy-quotation-detail');
        if (eleDetailCopy && eleDetailCopy.length > 0) {
            if (eleDetailCopy.val()) {
                dataDetailCopy = JSON.parse(eleDetailCopy.val());
            }
        }
        let dataDetail = {};
        let eleDetail = $('#quotation-detail-data');
        if (eleDetail && eleDetail.length > 0) {
            if (eleDetail.val()) {
                dataDetail = JSON.parse(eleDetail.val());
            }
        }
        // check zone before calculate
        let keyHidden = WFRTControl.getZoneHiddenKeyData();
        if (keyHidden) {
            if (keyHidden.length > 0) {
                // special case: tab cost depend on tab detail
                if (!keyHidden.includes('quotation_products_data') && !keyHidden.includes('sale_order_products_data')) {
                    QuotationLoadDataHandle.loadDataTableCost();
                    QuotationSubmitHandle.setupDataSubmit(_form, 1);
                    data_form = _form.dataForm;
                    QuotationLoadDataHandle.loadSetWFRuntimeZone();
                }
                // set data detail to zones hidden
                if (data_form && dataDetail) {
                    for (let key of keyHidden) {
                        if (dataDetail.hasOwnProperty(key)) {
                            data_form[key] = dataDetail[key];
                        }
                    }
                }
            }
        }
        // Check special case
        indicatorHandle.checkSpecialCaseIndicator(data_form);
        for (let indicator of indicator_list) {
            let rateValue = 0;
            let parse_formula = "";
            let formula_data = indicator.formula_data;
            for (let item of formula_data) {
                if (typeof item === 'object' && item !== null) {
                    if (item.hasOwnProperty('is_property')) {
                        if (data_form.hasOwnProperty(item.code)) {
                            parse_formula += data_form[item.code];
                        }
                    } else if (item.hasOwnProperty('is_indicator')) {
                        if (result_json.hasOwnProperty(item.order)) {
                            if (item.order < indicator.order) {
                                parse_formula += result_json[item.order].indicator_value;
                            }
                        }
                    } else if (item.hasOwnProperty('param_type')) {
                        if (item.param_type === 2) { // FUNCTION
                            if (item.code === 'max' || item.code === 'min') {
                                let functionData = indicatorHandle.functionMaxMin(item, data_form, result_json);
                                parse_formula += functionData;
                            } else if (item.code === 'sumItemIf') {
                                let functionData = indicatorHandle.functionSumItemIf(item, data_form);
                                parse_formula += functionData;
                            }
                        }
                    }
                } else if (typeof item === 'string') {
                    parse_formula += item;
                }
            }
            // begin calculate
            // format
            parse_formula = indicatorHandle.formatExpression(parse_formula);
            // value
            let value = indicatorHandle.evaluateFormula(parse_formula);
            // rate value
            if (indicator?.['code'] === "IN0001") {
                revenueValue = value
            }
            if (value && revenueValue) {
                if (revenueValue !== 0) {
                    rateValue = ((value / revenueValue) * 100).toFixed(0);
                }
            }
            // quotation value
            let quotationValue = 0;
            let differenceValue = value;
            // check if sale order then get quotation value
            if (formSubmit[0].classList.contains('sale-order')) {
                if (formSubmit.attr('data-method') === 'POST') {
                    if (dataDetailCopy?.['quotation_indicators_data']) {
                        for (let quotation_indicator of dataDetailCopy?.['quotation_indicators_data']) {
                            if (indicator?.['title'] === quotation_indicator?.['indicator']?.['title']) {
                                quotationValue = quotation_indicator?.['indicator_value'];
                                differenceValue = (value - quotation_indicator?.['indicator_value']);
                                break;
                            }
                        }
                    }
                } else {
                    if (dataDetail?.['quotation_data']?.['quotation_indicators_data']) {
                        for (let quotation_indicator of dataDetail?.['quotation_data']?.['quotation_indicators_data']) {
                            if (indicator?.['title'] === quotation_indicator?.['indicator']?.['title']) {
                                quotationValue = quotation_indicator?.['indicator_value'];
                                differenceValue = (value - quotation_indicator?.['indicator_value']);
                                break;
                            }
                        }
                    }
                }
            }
            // append result
            result_list.push({
                'indicator': indicator?.['id'],
                'indicator_data': {
                    'id': indicator?.['id'],
                    'title': indicator?.['title'],
                    'code': indicator?.['code'],
                },
                'quotation_indicator': indicator?.['id'],
                'quotation_indicator_data': {
                    'id': indicator?.['id'],
                    'title': indicator?.['title'],
                    'code': indicator?.['code'],
                },
                'order': indicator?.['order'],
                'indicator_value': value ? value : 0,
                'indicator_rate': rateValue,
                'quotation_indicator_value': quotationValue,
                'difference_indicator_value': differenceValue ? differenceValue : 0,
            });
            result_json[indicator?.['order']] = {
                'indicator_value': value ? value : 0,
                'indicator_rate': rateValue
            }
        }
        if (!formSubmit.hasClass('sale-order')) {
            QuotationDataTableHandle.dataTableQuotationIndicator(result_list);
        } else {
            QuotationDataTableHandle.dataTableSaleOrderIndicator(result_list);
        }
    };

    static evaluateFormula(formulaText) {
        try {
            return eval(formulaText);
            // return evaluated;
        } catch (error) {
            return null;
        }
    };

    static functionMaxMin(item, data_form, result_json) {
        let functionBody = "[";
        let idx = 0;
        for (let function_child of item.function_data) {
            idx++;
            if (typeof function_child === 'object' && function_child !== null) {
                if (function_child.hasOwnProperty('is_property')) {
                    if (data_form.hasOwnProperty(function_child.code)) {
                        functionBody += data_form[function_child.code];
                        if (idx < item.function_data.length) {
                            functionBody += ",";
                        }
                    }
                } else if (function_child.hasOwnProperty('is_indicator')) {
                    if (result_json.hasOwnProperty(function_child.order)) {
                        functionBody += result_json[function_child.order].indicator_value;
                        if (idx < item.function_data.length) {
                            functionBody += ",";
                        }
                    }
                }
            } else if (typeof function_child === 'string') {
                functionBody += function_child;
                if (idx < item.function_data.length) {
                    functionBody += ",";
                }
            }
        }
        return item.syntax + functionBody + "])";
    };

    static functionSumItemIf(item, data_form) {
        let syntax = "sum(";
        let functionBody = "";
        let leftValueJSON = null;
        let rightValue = null;
        let operator_list = ['===', '!==', '<', '>', '<=', '>='];
        let condition_operator = operator_list.filter((element) => item.function_data.includes(element))[0];
        let operatorIndex = item.function_data.indexOf(condition_operator);
        if (operatorIndex !== -1 && operatorIndex > 0 && operatorIndex < item.function_data.length - 1) {
            leftValueJSON = item.function_data[operatorIndex - 1];
            rightValue = item.function_data[operatorIndex + 1];
        }
        let lastElement = item.function_data[item.function_data.length - 1];
        let dataList = [];
        // Tab Products
        if (data_form?.['quotation_products_data'] && leftValueJSON?.['code'].includes("product_data")) {
            dataList = data_form?.['quotation_products_data'];
        }
        if (data_form?.['sale_order_products_data'] && leftValueJSON?.['code'].includes("product_data")) {
            dataList = data_form?.['sale_order_products_data'];
        }
        if (data_form?.['quotation_expenses_data'] && ["expense_data", "expense_item_data"].some(keyword => leftValueJSON?.['code']?.includes(keyword))) {
            dataList = data_form?.['quotation_expenses_data'];
        }
        if (data_form?.['sale_order_expenses_data'] && ["expense_data", "expense_item_data"].some(keyword => leftValueJSON?.['code']?.includes(keyword))) {
            dataList = data_form?.['sale_order_expenses_data'];
        }
        functionBody = indicatorHandle.extractDataToSum(dataList, leftValueJSON, condition_operator, rightValue, lastElement);
        if (functionBody[functionBody.length - 1] === ",") {
            let functionBodySlice = functionBody.slice(0, -1);
            return syntax + functionBodySlice + ")";
        }
        return syntax + functionBody + ")";
    };

    static extractDataToSum(data_list, leftValueJSON, condition_operator, rightValue, lastElement) {
        let functionBody = "";
        for (let data of data_list) {
            if (typeof leftValueJSON === 'object' && leftValueJSON !== null) {
                let val = indicatorHandle.findKey(data, leftValueJSON.code);
                if (val) {
                    if (Array.isArray(val)) {
                        val = val.map(item => item.replace(/\s/g, "").toLowerCase());
                        let check = val.includes(rightValue);
                        if (check === true) {
                            functionBody += String(data[lastElement.code]);
                            functionBody += ",";
                        }
                    }
                    if (typeof val === 'string') {
                        let leftValue = val.replace(/\s/g, "").toLowerCase();
                        let checkExpression = `"${leftValue}" ${condition_operator} "${rightValue}"`;
                        let check = indicatorHandle.evaluateFormula(checkExpression);
                        if (check === true) {
                            functionBody += String(data[lastElement.code]);
                            functionBody += ",";
                        }
                    }
                }
            }
        }
        return functionBody
    };

    static checkSpecialCaseIndicator(data_form) {
        // check if product data has promotion gift then => += vào total_cost_pretax_amount
        if (data_form.hasOwnProperty('total_cost_pretax_amount')) {
            let promotion = document.getElementById('datable-quotation-create-product').querySelector('.table-row-promotion');
            if (promotion) {
                if (promotion.closest('tr').querySelector('.table-row-description').value === '(Gift)') {
                    let productGift = promotion.getAttribute('data-id-product');
                    let product_data_list = [];
                    if (data_form.hasOwnProperty('quotation_costs_data')) {
                        product_data_list = data_form['quotation_costs_data'];
                    } else if (data_form.hasOwnProperty('sale_order_costs_data')) {
                        product_data_list = data_form['sale_order_costs_data'];
                    }
                    for (let product of product_data_list) {
                        if (product.product === productGift) {
                            data_form['total_cost_pretax_amount'] += product.product_cost_price;
                            break;
                        }
                    }
                }
            }
        }
    };

    static formatExpression(input) {
        // Replace consecutive subtraction operators with a space before each minus sign
        return input.replace(/--/g, '+');
    };

    static findKey(data, key) {
        if (!key.includes("__")) {
            return data?.[key];
        }
        let listSub = key.split("__");
        return listSub.reduce((acc, curr) => {
            if (Array.isArray(acc)) {
                // If the current accumulator is an array, use flatMap to continue reduction
                return acc.flatMap(item => {
                    if (Array.isArray(item?.[curr])) {
                        // If the current item is also an array, return the array itself
                        return item?.[curr];
                    } else {
                        // If the item is not an array, proceed normally
                        return item?.[curr];
                    }
                });
            } else {
                // Regular reduction step if `acc` is not an array
                return acc?.[curr];
            }
        }, data);
    };

}

// Promotion
class QuotationPromotionHandle {
    static callPromotion(type_check) {
        let $ele = $('#data-init-quotation-create-promotion');
        let customer_id = QuotationLoadDataHandle.customerSelectEle.val();
        let currentDate = getCurrentDate();
        $.fn.callAjax2({  // promotion for all
                'url': $ele.attr('data-url'),
                'method': $ele.attr('data-method'),
                'data': {'customer_type': 0, 'valid_date_start__lte': currentDate, 'valid_date_end__gte': currentDate},
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('promotion_check_list') && Array.isArray(data.promotion_check_list)) {
                        let dataAllCus = data.promotion_check_list;
                        if (customer_id) {  // promotion for customer
                            $.fn.callAjax2({
                                    'url': $ele.attr('data-url'),
                                    'method': $ele.attr('data-method'),
                                    'data': {'customers_map_promotion__id': customer_id, 'valid_date_start__lte': currentDate, 'valid_date_end__gte': currentDate},
                                    'isDropdown': true,
                                }
                            ).then(
                                (resp) => {
                                    let data2 = $.fn.switcherResp(resp);
                                    if (data2) {
                                        if (data2.hasOwnProperty('promotion_check_list') && Array.isArray(data2.promotion_check_list)) {
                                            let dataFinal = dataAllCus.concat(data2.promotion_check_list);
                                            if (type_check === 0) {
                                                QuotationPromotionHandle.checkOnWorking(dataFinal, customer_id);
                                            }
                                            if (type_check === 1) {
                                                QuotationPromotionHandle.checkOnSubmit(dataFinal, customer_id);
                                            }
                                        }
                                    }
                                }
                            )
                        } else {
                            let dataFinal = dataAllCus;
                            if (type_check === 0) {
                                QuotationPromotionHandle.checkOnWorking(dataFinal, customer_id);
                            }
                            if (type_check === 1) {
                                QuotationPromotionHandle.checkOnSubmit(dataFinal, customer_id);
                            }
                        }
                    }
                }
            }
        )
        return true
    };

    static checkOnWorking(dataPromotion, customer_id) {
        let passList = [];
        let failList = [];
        dataPromotion.map(function (item) {
            let checkData = QuotationPromotionHandle.checkPromotionValid(item, customer_id);
            if (checkData?.['is_pass'] === true) {
                item['is_pass'] = true;
                item['condition'] = checkData?.['condition'];
                passList.push(item);
            } else {
                item['is_pass'] = false;
                failList.push(item);
            }
        })
        passList = passList.concat(failList);
        QuotationDataTableHandle.dataTablePromotion(passList);
        return true;
    };

    static checkOnSubmit(dataPromotion, customer_id) {
        let check_length = 0;
        let eleCheck = $('#quotation-check-promotion');
        dataPromotion.map(function (item) {
            let check = QuotationPromotionHandle.checkPromotionValid(item, customer_id);
            if (check?.['is_pass'] === false) {
                let tableProduct = document.getElementById('datable-quotation-create-product');
                let rowPromotion = tableProduct.querySelector('.table-row-promotion');
                if (rowPromotion) {
                    if (item?.['id'] === rowPromotion.getAttribute('data-id')) {
                        eleCheck.val('false');
                    }
                }
            }
            check_length++;
            if (check_length === dataPromotion.length) {
                if (!eleCheck.val()) {
                    eleCheck.val('true');
                }
            }
        })
        return true;
    };

    static checkPromotionValid(data_promotion, customer_id = null) {
        let pretaxRaw = null;
        let totalRaw = null;
        let discountRaw = null;
        let tableProd = $('#datable-quotation-create-product');
        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
        if (tableProductWrapper) {
            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
            if (tableProductFt) {
                pretaxRaw = tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw');
                totalRaw = tableProductFt.querySelector('.quotation-create-product-total-raw');
                discountRaw = tableProductFt.querySelector('.quotation-create-product-discount-amount-raw');
            }
        }
        if (tableProd.DataTable().data().count() !== 0) {
            data_promotion['is_pass'] = false;
            if (data_promotion?.['is_discount'] === true) { // DISCOUNT
                let is_before_tax = false;
                let is_after_tax = false;
                let percentDiscount = 0;
                let maxDiscountAmount = 0;
                let fixDiscountAmount = 0;
                let conditionCheck = data_promotion?.['discount_method'];
                // check limit used on Sale Order
                let check_limit = QuotationPromotionHandle.checkLimit(data_promotion, customer_id);
                if (check_limit === false) {
                    return data_promotion;
                }
                // end check limit
                if (conditionCheck?.['before_after_tax'] === true) {
                    is_before_tax = true;
                } else {
                    is_after_tax = true;
                }
                if (conditionCheck?.['percent_fix_amount'] === true) {
                    percentDiscount = conditionCheck?.['percent_value'];
                    maxDiscountAmount = conditionCheck?.['max_percent_value'];
                } else {
                    fixDiscountAmount = parseFloat(conditionCheck?.['fix_value']);
                }
                if (conditionCheck.hasOwnProperty('is_on_product')) { // discount on specific product
                    let prodID = conditionCheck?.['product_selected']?.['id'];
                    tableProd.DataTable().rows().every(function () {
                        let row = this.node();
                        let prod = row.querySelector('.table-row-item');
                        let quantity = row.querySelector('.table-row-quantity');
                        if (prod) {
                            if (prod.value === prodID && parseFloat(quantity.value) > 0) {
                                if (conditionCheck.hasOwnProperty('is_min_quantity')) { // Check condition quantity of product
                                    if (parseFloat(quantity.value) >= conditionCheck?.['num_minimum']) {
                                        if (conditionCheck.percent_fix_amount === true) { // discount by percent
                                            data_promotion['is_pass'] = true;
                                            data_promotion['condition'] = {
                                                'row_apply_index': tableProd.DataTable().row($(row)).index(),
                                                'is_discount': true,
                                                'is_gift': false,
                                                'is_before_tax': is_before_tax,
                                                'is_after_tax': is_after_tax,
                                                'is_on_product': true,
                                                'is_on_order': false,
                                                'is_on_percent': true,
                                                'is_fix_amount': false,
                                                'percent_discount': percentDiscount,
                                                'max_amount': maxDiscountAmount,
                                                'product_data': {
                                                    'id': "",
                                                    'title': data_promotion?.['title'],
                                                    'code': data_promotion?.['code'],
                                                    'description': data_promotion?.['remark'],
                                                },
                                                'product_quantity': 1,
                                            };
                                            return data_promotion;
                                        } else { // discount by fix amount
                                            data_promotion['is_pass'] = true;
                                            data_promotion['condition'] = {
                                                'row_apply_index': tableProd.DataTable().row($(row)).index(),
                                                'is_discount': true,
                                                'is_gift': false,
                                                'is_before_tax': is_before_tax,
                                                'is_after_tax': is_after_tax,
                                                'is_on_product': true,
                                                'is_on_order': false,
                                                'is_on_percent': false,
                                                'is_fix_amount': true,
                                                'fix_value': fixDiscountAmount,
                                                'product_data': {
                                                    'id': "",
                                                    'title': data_promotion?.['title'],
                                                    'code': data_promotion?.['code'],
                                                    'description': data_promotion?.['remark'],
                                                },
                                                'product_quantity': 1,
                                            };
                                            return data_promotion;
                                        }
                                    }
                                } else {
                                    if (conditionCheck.percent_fix_amount === true) { // discount by percent
                                        data_promotion['is_pass'] = true;
                                        data_promotion['condition'] = {
                                            'row_apply_index': tableProd.DataTable().row($(row)).index(),
                                            'is_discount': true,
                                            'is_gift': false,
                                            'is_before_tax': is_before_tax,
                                            'is_after_tax': is_after_tax,
                                            'is_on_product': true,
                                            'is_on_order': false,
                                            'is_on_percent': true,
                                            'is_fix_amount': false,
                                            'percent_discount': percentDiscount,
                                            'max_amount': maxDiscountAmount,
                                            'product_data': {
                                                'id': "",
                                                'title': data_promotion?.['title'],
                                                'code': data_promotion?.['code'],
                                                'description': data_promotion?.['remark'],
                                            },
                                            'product_quantity': 1,
                                        };
                                        return data_promotion;
                                    } else { // discount by fix amount
                                        data_promotion['is_pass'] = true;
                                        data_promotion['condition'] = {
                                            'row_apply_index': tableProd.DataTable().row($(row)).index(),
                                            'is_discount': true,
                                            'is_gift': false,
                                            'is_before_tax': is_before_tax,
                                            'is_after_tax': is_after_tax,
                                            'is_on_product': true,
                                            'is_on_order': false,
                                            'is_on_percent': false,
                                            'is_fix_amount': true,
                                            'fix_value': fixDiscountAmount,
                                            'product_data': {
                                                'id': "",
                                                'title': data_promotion?.['title'],
                                                'code': data_promotion?.['code'],
                                                'description': data_promotion?.['remark'],
                                            },
                                            'product_quantity': 1,
                                        };
                                        return data_promotion;
                                    }
                                }
                            }
                        }
                    });
                } else if ((conditionCheck.hasOwnProperty('is_on_order'))) { // discount on whole order
                    if (conditionCheck?.['is_minimum'] === true) {
                        if (totalRaw) {
                            if (parseFloat(totalRaw.value) >= parseFloat(conditionCheck?.['minimum_value'])) {
                                if (conditionCheck.percent_fix_amount === true) { // discount by percent
                                    data_promotion['is_pass'] = true;
                                    data_promotion['condition'] = {
                                        'row_apply_index': null,
                                        'is_discount': true,
                                        'is_gift': false,
                                        'is_before_tax': is_before_tax,
                                        'is_after_tax': is_after_tax,
                                        'is_on_product': false,
                                        'is_on_order': true,
                                        'is_on_percent': true,
                                        'is_fix_amount': false,
                                        'percent_discount': percentDiscount,
                                        'max_amount': maxDiscountAmount,
                                        'product_data': {
                                            'id': "",
                                            'title': data_promotion?.['title'],
                                            'code': data_promotion?.['code'],
                                            'description': data_promotion?.['remark'],
                                        },
                                        'product_quantity': 1,
                                    };
                                    return data_promotion;
                                } else { // discount by fix amount
                                    data_promotion['is_pass'] = true;
                                    data_promotion['condition'] = {
                                        'row_apply_index': null,
                                        'is_discount': true,
                                        'is_gift': false,
                                        'is_before_tax': is_before_tax,
                                        'is_after_tax': is_after_tax,
                                        'is_on_product': false,
                                        'is_on_order': true,
                                        'is_on_percent': false,
                                        'is_fix_amount': true,
                                        'fix_value': fixDiscountAmount,
                                        'product_data': {
                                            'id': "",
                                            'title': data_promotion?.['title'],
                                            'code': data_promotion?.['code'],
                                            'description': data_promotion?.['remark'],
                                        },
                                        'product_quantity': 1,
                                    };
                                    return data_promotion;
                                }
                            }
                        }
                    } else {
                        if (conditionCheck.percent_fix_amount === true) { // discount by percent
                            data_promotion['is_pass'] = true;
                            data_promotion['condition'] = {
                                'row_apply_index': null,
                                'is_discount': true,
                                'is_gift': false,
                                'is_before_tax': is_before_tax,
                                'is_after_tax': is_after_tax,
                                'is_on_product': false,
                                'is_on_order': true,
                                'is_on_percent': true,
                                'is_fix_amount': false,
                                'percent_discount': percentDiscount,
                                'max_amount': maxDiscountAmount,
                                'product_data': {
                                    'id': "",
                                    'title': data_promotion?.['title'],
                                    'code': data_promotion?.['code'],
                                    'description': data_promotion?.['remark'],
                                },
                                'product_quantity': 1,
                            };
                            return data_promotion;
                        } else { // discount by fix amount
                            data_promotion['is_pass'] = true;
                            data_promotion['condition'] = {
                                'row_apply_index': null,
                                'is_discount': true,
                                'is_gift': false,
                                'is_before_tax': is_before_tax,
                                'is_after_tax': is_after_tax,
                                'is_on_product': false,
                                'is_on_order': true,
                                'is_on_percent': false,
                                'is_fix_amount': true,
                                'fix_value': fixDiscountAmount,
                                'product_data': {
                                    'id': "",
                                    'title': data_promotion?.['title'],
                                    'code': data_promotion?.['code'],
                                    'description': data_promotion?.['remark'],
                                },
                                'product_quantity': 1,
                            };
                            return data_promotion;
                        }
                    }
                }
            } else if (data_promotion?.['is_gift'] === true) { // GIFT
                let conditionCheck = data_promotion?.['gift_method'];
                // check limit used on Sale Order
                let check_limit = QuotationPromotionHandle.checkLimit(data_promotion, customer_id);
                if (check_limit === false) {
                    return data_promotion;
                }
                // end check limit
                if (conditionCheck?.['is_free_product'] === true) {
                    if (conditionCheck.hasOwnProperty('is_min_purchase')) { // Check total price
                        if (conditionCheck?.['before_after_tax'] === true) {
                            if (pretaxRaw && discountRaw) {
                                if ((parseFloat(pretaxRaw.value) - parseFloat(discountRaw.value)) >= parseFloat(conditionCheck?.['min_purchase_cost'])) {
                                    data_promotion['is_pass'] = true;
                                    data_promotion['condition'] = {
                                        'row_apply_index': null,
                                        'is_discount': false,
                                        'is_gift': true,
                                        'product_data': {
                                            'id': conditionCheck?.['product_received']?.['id'],
                                            'title': conditionCheck?.['product_received']?.['title'],
                                            'code': conditionCheck?.['product_received']?.['code'],
                                            'description': data_promotion?.['remark'],
                                        },
                                        'product_quantity': parseFloat(conditionCheck?.['num_product_received']),
                                    };
                                    return data_promotion
                                }
                            }
                        } else {
                            if (totalRaw) {
                                if (parseFloat(totalRaw.value) >= parseFloat(conditionCheck?.['min_purchase_cost'])) {
                                    data_promotion['is_pass'] = true;
                                    data_promotion['condition'] = {
                                        'row_apply_index': null,
                                        'is_discount': false,
                                        'is_gift': true,
                                        'product_data': {
                                            'id': conditionCheck?.['product_received']?.['id'],
                                            'title': conditionCheck?.['product_received']?.['title'],
                                            'code': conditionCheck?.['product_received']?.['code'],
                                            'description': data_promotion?.['remark'],
                                        },
                                        'product_quantity': parseFloat(conditionCheck?.['num_product_received']),
                                    };
                                    return data_promotion
                                }
                            }
                        }
                    } else if (conditionCheck.hasOwnProperty('is_purchase')) { // Check quantity
                        let purchase_product_id = conditionCheck?.['purchase_product']?.['id'];
                        let purchase_num = conditionCheck?.['purchase_num'];
                        tableProd.DataTable().rows().every(function () {
                            let row = this.node();
                            let prod = row.querySelector('.table-row-item');
                            let quantity = row.querySelector('.table-row-quantity');
                            if (prod && quantity) {
                                if (prod.value === purchase_product_id && parseFloat(quantity.value) > 0) {
                                    if (parseFloat(quantity.value) >= purchase_num) {
                                        let total_received_raw = ((parseFloat(quantity.value) / parseFloat(purchase_num)) * parseFloat(conditionCheck.num_product_received))
                                        let total_received = Math.floor(total_received_raw);
                                        data_promotion['is_pass'] = true;
                                        data_promotion['condition'] = {
                                            'row_apply_index': tableProd.DataTable().row($(row)).index(),
                                            'is_discount': false,
                                            'is_gift': true,
                                            'product_data': {
                                                'id': conditionCheck?.['product_received']?.['id'],
                                                'title': conditionCheck?.['product_received']?.['title'],
                                                'code': conditionCheck?.['product_received']?.['code'],
                                                'description': data_promotion?.['remark'],
                                            },
                                            'product_quantity': total_received,
                                        };
                                        return data_promotion;
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
        return data_promotion;
    };

    static checkLimit(data_promotion, customer_id) {
        let conditionCheck = data_promotion?.['discount_method'];
        if (data_promotion?.['is_gift'] === true) {
            conditionCheck = data_promotion?.['gift_method'];
        }
        // CHECK MAX USAGES
        let max_usages = conditionCheck?.['max_usages'];
        if (max_usages > 0) {
            let check_max_usages = 0;
            for (let idx = 0; idx < data_promotion?.['sale_order_used'].length; idx++) {
                let order_used = data_promotion?.['sale_order_used'][idx];
                if (order_used?.['customer_id'] === customer_id) {
                    check_max_usages++
                }
            }
            if (check_max_usages >= max_usages) {
                return false
            }
        }
        // CHECK USE COUNT IN SPECIFIC TIME/ CURRENT WEEK/ CURRENT MONTH
        let use_count = conditionCheck?.['use_count'];
        if (use_count > 0) {
            let times_condition = conditionCheck?.['times_condition'];
            let check_use_count = 0;
            for (let i = 0; i < data_promotion?.['sale_order_used'].length; i++) {
                let order_used = data_promotion?.['sale_order_used'][i];
                if (order_used?.['customer_id'] === customer_id) {
                    if (times_condition === 1) { // IN SPECIFIC TIME
                        let dateToCheck = new Date(moment(order_used.date_created).format('YYYY-MM-DD')).getTime();
                        let startDate = new Date(data_promotion.valid_date_start).getTime();
                        let endDate = new Date(data_promotion.valid_date_end).getTime();
                        if (dateToCheck >= startDate && dateToCheck <= endDate) {
                            check_use_count++
                        }
                    } else if (times_condition === 2) { // IN CURRENT WEEK
                        let dateToCheck = new Date(moment(order_used.date_created).format('YYYY-MM'));
                        let dateCurrent = new Date(moment($('#quotation-create-date-created').val()).format('YYYY-MM'));
                        const weekNumber1 = QuotationPromotionHandle.getWeekNumber(dateToCheck);
                        const weekNumber2 = QuotationPromotionHandle.getWeekNumber(dateCurrent);
                        if (weekNumber1 === weekNumber2) {
                            check_use_count++
                        }
                    } else if (times_condition === 3) { // IN CURRENT MONTH
                        let dateToCheck = new Date(moment(order_used.date_created).format('YYYY-MM')).getTime();
                        let dateCurrent = new Date(moment($('#quotation-create-date-created').val()).format('YYYY-MM')).getTime();
                        if (dateToCheck === dateCurrent) {
                            check_use_count++
                        }
                    }
                }
            }
            if (check_use_count >= use_count) {
                return false
            }
        }
    return true
    };

    static getWeekNumber(date) {
        let yearStart = new Date(date.getFullYear(), 0, 1);
        return Math.ceil(((date - yearStart) / 86400000 + yearStart.getDay() + 1) / 7);
    };

    static getPromotionResult(promotionData) {
        let condition = promotionData?.['condition'];
        let result = {
            'product_quantity': 0,
            'product_price': 0
        };
        let tableProd = $('#datable-quotation-create-product');
        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
        let shippingFee = 0;
        let eleShipping = tableProd[0].querySelector('.table-row-shipping');
        if (eleShipping) {
            let shippingPrice = eleShipping.closest('tr').querySelector('.table-row-subtotal-raw');
            if (shippingPrice) {
                shippingFee = parseFloat(shippingPrice.value)
            }
        }
        promotionData['is_discount'] = false;
        promotionData['is_gift'] = false;
        if (condition?.['is_discount'] === true) { // DISCOUNT
            let DiscountAmount = 0;
            let taxID = "";
            let discount_rate_on_order = null;
            let is_on_row = false;
            let is_before_tax = true;
            let remark = '';
            if (condition?.['is_on_product'] === true) { // on product
                remark = QuotationLoadDataHandle.transEle.attr('data-discount-product');
                let row = tableProd.DataTable().row(condition?.['row_apply_index']).node();
                let taxSelected = row.querySelector('.table-row-tax').options[row.querySelector('.table-row-tax').selectedIndex];
                taxID = taxSelected.value;
                if (condition?.['is_on_percent'] === true) { // discount by percent
                    let subtotal = row.querySelector('.table-row-subtotal-raw').value;
                    DiscountAmount = ((parseFloat(subtotal) * parseFloat(condition.percent_discount)) / 100);
                    if (DiscountAmount > parseFloat(condition.max_amount)) { // check discount amount with max discount amount
                        DiscountAmount = parseFloat(condition.max_amount)
                    }
                } else if (condition?.['is_fix_amount'] === true) { // discount by fix amount
                    if (condition.is_before_tax === true) {
                        DiscountAmount = condition.fix_value;
                    } else if (condition.is_after_tax === true) {
                        DiscountAmount = condition.fix_value;
                        taxID = "";
                        is_before_tax = false;
                    }
                }
                is_on_row = true;
            } else if (condition?.['is_on_order'] === true) { // on whole order
                if (condition?.['is_on_percent'] === true) {
                    if (condition.is_before_tax === true) {
                        remark = QuotationLoadDataHandle.transEle.attr('data-discount-bt');
                        if (tableProductWrapper) {
                            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                            let elePreTaxRaw = tableProductFt?.querySelector('.quotation-create-product-pretax-amount-raw');
                            let eleDiscountRaw = tableProductFt?.querySelector('.quotation-create-product-discount-amount-raw');
                            if (elePreTaxRaw && eleDiscountRaw) {
                                let preTax = elePreTaxRaw.value;
                                let discount = eleDiscountRaw.value;
                                let total = parseFloat(preTax) - parseFloat(discount);
                                // check if shippingFee then minus
                                if (shippingFee > 0) {
                                    total = (parseFloat(preTax) - parseFloat(discount)) - shippingFee;
                                }
                                DiscountAmount = ((total * parseFloat(condition.percent_discount)) / 100);
                                // check discount amount with max discount amount & re calculate discount_rate_on_order
                                discount_rate_on_order = parseFloat(condition.percent_discount);
                                if (DiscountAmount > parseFloat(condition.max_amount)) {
                                    DiscountAmount = parseFloat(condition.max_amount)
                                    discount_rate_on_order = ((DiscountAmount / total) * 100)
                                }
                            }
                        }
                    } else if (condition.is_after_tax === true) {
                        remark = QuotationLoadDataHandle.transEle.attr('data-discount-at');
                        if (tableProductWrapper) {
                            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                            let eleTotal = tableProductFt?.querySelector('.quotation-create-product-total-raw');
                            if (eleTotal) {
                                let total = eleTotal.value;
                                // check if shippingFee then minus
                                if (shippingFee > 0) {
                                    total = parseFloat(eleTotal.value) - shippingFee;
                                }
                                DiscountAmount = ((parseFloat(total) * parseFloat(condition.percent_discount)) / 100);
                                // check discount amount with max discount amount & re calculate discount_rate_on_order
                                discount_rate_on_order = parseFloat(condition.percent_discount);
                                if (DiscountAmount > parseFloat(condition.max_amount)) {
                                    DiscountAmount = parseFloat(condition.max_amount)
                                    discount_rate_on_order = ((DiscountAmount / total) * 100)
                                }
                                is_before_tax = false;
                            }
                        }
                    }
                } else if (condition?.['is_fix_amount'] === true) { // discount by fix amount
                    if (condition.is_before_tax === true) {
                        remark = QuotationLoadDataHandle.transEle.attr('data-discount-bt');
                        DiscountAmount = condition.fix_value;
                        if (tableProductWrapper) {
                            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                            let elePreTaxRaw = tableProductFt?.querySelector('.quotation-create-product-pretax-amount-raw');
                            let eleDiscountRaw = tableProductFt?.querySelector('.quotation-create-product-discount-amount-raw');
                            if (elePreTaxRaw && eleDiscountRaw) {
                                // get promotion rate
                                let preTax = elePreTaxRaw.value;
                                let discount = eleDiscountRaw.value;
                                let total = parseFloat(preTax) - parseFloat(discount);
                                // check if shippingFee then minus
                                if (shippingFee > 0) {
                                    total = (parseFloat(preTax) - parseFloat(discount)) - shippingFee;
                                }
                                discount_rate_on_order = ((DiscountAmount / total) * 100);
                            }
                        }
                    } else if (condition.is_after_tax === true) {
                        remark = QuotationLoadDataHandle.transEle.attr('data-discount-at');
                        DiscountAmount = condition.fix_value;
                        if (tableProductWrapper) {
                            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                            let eleTotal = tableProductFt?.querySelector('.quotation-create-product-total-raw');
                            if (eleTotal) {
                                let total = eleTotal.value;
                                // check if shippingFee then minus
                                if (shippingFee > 0) {
                                    total = parseFloat(eleTotal.value) - shippingFee;
                                }
                                discount_rate_on_order = ((DiscountAmount / total) * 100);
                                is_before_tax = false;
                            }
                        }
                    }
                }
            }
            promotionData['is_discount'] = true;
            promotionData['title'] = -DiscountAmount;
            promotionData['row_apply_index'] = condition?.['row_apply_index'];
            promotionData['product_data'] = condition?.['product_data'];
            promotionData['product_data']['description'] = remark;
            promotionData['product_quantity'] = condition?.['product_quantity'];
            promotionData['product_price'] = DiscountAmount;
            promotionData['value_tax'] = taxID;
            promotionData['discount_rate_on_order'] = discount_rate_on_order;
            promotionData['is_on_row'] = is_on_row;
            promotionData['is_before_tax'] = is_before_tax;
            return promotionData;
        } else if (condition?.['is_gift'] === true) { // GIFT
            promotionData['is_gift'] = true;
            promotionData['row_apply_index'] = condition?.['row_apply_index'];
            promotionData['product_data'] = condition?.['product_data'];
            promotionData['product_data']['description'] = QuotationLoadDataHandle.transEle.attr('data-gift');
            promotionData['product_quantity'] = condition?.['product_quantity'];
            promotionData['product_price'] = 0;
            return promotionData;
        }
        return result
    };

    static calculatePromotion(table, promotion_discount_rate, promotion_amount, is_before_tax = true) {
        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
        if (tableProductWrapper) {
            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
            let eleTaxes = tableProductFt?.querySelector('.quotation-create-product-taxes');
            let eleTaxesRaw = tableProductFt?.querySelector('.quotation-create-product-taxes-raw');
            let eleTotal = tableProductFt?.querySelector('.quotation-create-product-total');
            let eleTotalRaw = tableProductFt?.querySelector('.quotation-create-product-total-raw');
            let elePretaxAmountRaw = tableProductFt?.querySelector('.quotation-create-product-pretax-amount-raw');
            let eleDiscountRaw = tableProductFt?.querySelector('.quotation-create-product-discount-amount-raw');
            let eleRevenueBT = tableProductFt?.querySelector('.quotation-final-revenue-before-tax');

            let taxAmountTotal = 0;
            if (is_before_tax === true) {
                table.DataTable().rows().every(function () {
                    let row = this.node();
                    if (!row.querySelector('.table-row-shipping')) {
                        if (row.querySelector('.table-row-price')) {
                            // setup data
                            let price = 0;
                            let quantity = 0;
                            let elePrice = row.querySelector('.table-row-price');
                            if (elePrice) {
                                price = $(elePrice).valCurrency();
                            }
                            let eleQuantity = row.querySelector('.table-row-quantity');
                            if (eleQuantity) {
                                if (eleQuantity.value) {
                                    quantity = parseFloat(eleQuantity.value)
                                } else if (!eleQuantity.value || eleQuantity.value === "0") {
                                    quantity = 0
                                }
                            }
                            let tax = 0;
                            let discount = 0;
                            let subtotalPlus = 0;
                            let eleTax = row.querySelector('.table-row-tax');
                            if (eleTax) {
                                if ($(eleTax).val()) {
                                    let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                                    if (dataTax.hasOwnProperty('rate')) {
                                        tax = parseInt(dataTax.rate);
                                    }
                                }
                            }
                            // calculate discount & tax
                            let eleDiscount = row.querySelector('.table-row-discount');
                            let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
                            if (eleDiscount && eleDiscountAmount) {
                                // apply discount ON ROW
                                if (eleDiscount.value) {
                                    discount = parseFloat(eleDiscount.value)
                                } else if (!eleDiscount.value || eleDiscount.value === "0") {
                                    discount = 0
                                }
                                let discountAmount = ((price * discount) / 100);
                                let priceDiscountOnRow = (price - discountAmount);
                                // apply discount ON TOTAL
                                let discountRateOnTotal = 0;
                                let eleDiscountRateOnTotal = tableProductFt?.querySelector('.quotation-create-product-discount');
                                if (eleDiscountRateOnTotal) {
                                    discountRateOnTotal = parseFloat(eleDiscountRateOnTotal.value);
                                }
                                let discountAmountOnTotal = ((priceDiscountOnRow * discountRateOnTotal) / 100);
                                let priceAfterDisCountTotal = (priceDiscountOnRow - discountAmountOnTotal);
                                // apply discount PROMOTION
                                let discountAmountPromotion = ((priceAfterDisCountTotal * promotion_discount_rate) / 100);
                                let finalPrice = (priceAfterDisCountTotal - discountAmountPromotion);
                                subtotalPlus = (finalPrice * quantity);
                                // ReCalculate tax
                                if (row.querySelector('.table-row-tax-amount')) {
                                    let taxAmount = ((subtotalPlus * tax) / 100);
                                    taxAmountTotal += taxAmount;
                                }
                            }
                        }
                    }
                });
            } else if (is_before_tax === false) {
                let totalTaxAmountMinus = 0;
                table.DataTable().rows().every(function () {
                    let row = this.node();
                    if (!row.querySelector('.table-row-shipping')) {
                        if (row.querySelector('.table-row-price')) {
                            // setup data
                            let price = 0;
                            let quantity = 0;
                            let elePrice = row.querySelector('.table-row-price');
                            if (elePrice) {
                                price = $(elePrice).valCurrency();
                            }
                            let eleQuantity = row.querySelector('.table-row-quantity');
                            if (eleQuantity) {
                                if (eleQuantity.value) {
                                    quantity = parseFloat(eleQuantity.value)
                                } else if (!eleQuantity.value || eleQuantity.value === "0") {
                                    quantity = 0
                                }
                            }
                            let tax = 0;
                            let discount = 0;
                            let subtotalPlus = 0;
                            let eleTax = row.querySelector('.table-row-tax');
                            if (eleTax) {
                                if ($(eleTax).val()) {
                                    let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                                    if (dataTax.hasOwnProperty('rate')) {
                                        tax = parseInt(dataTax.rate);
                                    }
                                }
                            }
                            // calculate discount & tax
                            let eleDiscount = row.querySelector('.table-row-discount');
                            let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
                            if (eleDiscount && eleDiscountAmount) {
                                // apply discount ON ROW
                                if (eleDiscount.value) {
                                    discount = parseFloat(eleDiscount.value)
                                } else if (!eleDiscount.value || eleDiscount.value === "0") {
                                    discount = 0
                                }
                                let discountAmount = ((price * discount) / 100);
                                let priceDiscountOnRow = (price - discountAmount);
                                // apply discount ON TOTAL
                                let discountRateOnTotal = 0;
                                let eleDiscountRateOnTotal = tableProductFt?.querySelector('.quotation-create-product-discount');
                                if (eleDiscountRateOnTotal) {
                                    discountRateOnTotal = parseFloat(eleDiscountRateOnTotal.value)
                                }
                                let discountAmountOnTotal = ((priceDiscountOnRow * discountRateOnTotal) / 100);
                                let finalPrice = (priceDiscountOnRow - discountAmountOnTotal);
                                subtotalPlus = (finalPrice * quantity);
                                // ReCalculate tax
                                if (row.querySelector('.table-row-tax-amount')) {
                                    let taxAmount = ((subtotalPlus * tax) / 100);
                                    let subtotalPlusAfterTax = subtotalPlus + taxAmount;
                                    let discountAmountPromotion = ((subtotalPlusAfterTax * promotion_discount_rate) / 100)
                                    totalTaxAmountMinus += ((discountAmountPromotion * tax) / 100);
                                }
                            }
                        }
                    }
                });
                taxAmountTotal = parseFloat(eleTaxesRaw.value) - totalTaxAmountMinus;
            }
            // apply Final Tax
            $(eleTaxes).attr('data-init-money', String(taxAmountTotal));
            eleTaxesRaw.value = taxAmountTotal;
            // ReCalculate TOTAL
            let totalFinal = (parseFloat(elePretaxAmountRaw.value) - parseFloat(eleDiscountRaw.value) - parseFloat(promotion_amount) + taxAmountTotal);
            eleRevenueBT.value = (parseFloat(elePretaxAmountRaw.value) - parseFloat(eleDiscountRaw.value) - parseFloat(promotion_amount));
            if (is_before_tax === false) { // CASE AFTER TAX
                totalFinal = (parseFloat(eleTotalRaw.value) - promotion_amount);
                eleRevenueBT.value = (totalFinal - taxAmountTotal);
            }
            // apply Final Total
            $(eleTotal).attr('data-init-money', String(totalFinal));
            eleTotalRaw.value = totalFinal;
            $.fn.initMaskMoney2();
        }
    };

}

// Shipping
class shippingHandle {
    static checkShippingValid(data_shipping, shippingAddress) {
        let final_shipping_price = 0;
        let margin_shipping_price = 0;
        let formula_condition = data_shipping?.['formula_condition'];
        let margin = parseFloat(data_shipping?.['margin']);
        data_shipping['is_pass'] = false;
        if (data_shipping?.['cost_method'] === 0) {  // fixed price for all
            data_shipping['is_pass'] = true;
            data_shipping['title'] = data_shipping?.['fixed_price'];
            data_shipping['shipping_price'] = data_shipping?.['fixed_price'];
            data_shipping['shipping_margin'] = data_shipping?.['margin'];
            return data_shipping;
        }
        if (data_shipping?.['cost_method'] === 1) {  // check price by formula
            for (let condition of formula_condition) {
                let location_condition = condition?.['location_condition'];
                for (let location of location_condition) {
                    if (shippingAddress.includes(location?.['title'])) { // check location
                        let $table = $('#datable-quotation-create-product');
                        let formula_list = condition?.['formula'];
                        for (let formula of formula_list) {
                            let unit = formula?.['unit'];
                            let amount_condition = parseFloat(formula?.['threshold']);
                            let operator = formula?.['comparison_operators'];
                            let extra_amount = parseFloat(formula?.['extra_amount']);
                            let shipping_price = parseFloat(formula?.['amount_condition']);
                            let result_to_check = 0;
                            $table.DataTable().rows().every(function () {
                                let row = this.node();
                                if (row.querySelector('.table-row-item')) {
                                    let quantity = row.querySelector('.table-row-quantity');
                                    let elePrice = row.querySelector('.table-row-price');
                                    if (unit?.['title'] === "price") { // if condition is price
                                        if (quantity && elePrice) {
                                            result_to_check += (parseFloat(quantity.value) * $(elePrice).valCurrency());
                                        }
                                    } else if (unit?.['title'] === "quantity") { // if condition is quantity
                                        if (quantity) {
                                            result_to_check += parseFloat(quantity.value);
                                        }
                                    } else if (unit?.['title'] === "volume") { // if condition is volume
                                        data_shipping['is_pass'] = true;
                                        data_shipping['title'] = final_shipping_price;
                                        data_shipping['shipping_price'] = final_shipping_price;
                                        return data_shipping;
                                    } else if (unit?.['title'] === "weight") { // if condition is weight
                                        data_shipping['is_pass'] = true;
                                        data_shipping['title'] = final_shipping_price;
                                        data_shipping['shipping_price'] = final_shipping_price;
                                        return data_shipping;
                                    }
                                }
                            });
                            if (operator === 1) {
                                if (result_to_check < amount_condition) {
                                    data_shipping['is_pass'] = true;
                                }
                            } else if (operator === 2) {
                                if (result_to_check > amount_condition) {
                                    data_shipping['is_pass'] = true;
                                }
                            } else if (operator === 3) {
                                if (result_to_check <= amount_condition) {
                                    data_shipping['is_pass'] = true;
                                }
                            } else if (operator === 4) {
                                if (result_to_check >= amount_condition) {
                                    data_shipping['is_pass'] = true;
                                }
                            }
                            if (data_shipping['is_pass'] === true) {
                                if (data_shipping?.['cost_method'] === 0) {
                                    final_shipping_price = parseFloat(data_shipping?.['fixed_price']);
                                } else if (data_shipping?.['cost_method'] === 1) {
                                    final_shipping_price = (shipping_price + (extra_amount * result_to_check));
                                }
                                if (margin > 0) {
                                    margin_shipping_price = ((final_shipping_price * margin) / 100);
                                    final_shipping_price = (final_shipping_price + margin_shipping_price)
                                }
                                data_shipping['title'] = final_shipping_price;
                                data_shipping['shipping_price'] = final_shipping_price;
                                data_shipping['shipping_margin'] = margin_shipping_price;
                                return data_shipping;
                            }
                        }
                    }
                }
            }
        }
        return data_shipping;
    };

    static calculateShipping(shipping_price) {
        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
        if (tableProductWrapper) {
            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
            if (tableProductFt) {
                let elePretaxAmount = tableProductFt?.querySelector('.quotation-create-product-pretax-amount');
                let eleTotalAmount = tableProductFt?.querySelector('.quotation-create-product-total');
                let elePretaxAmountRaw = tableProductFt?.querySelector('.quotation-create-product-pretax-amount-raw');
                let eleDiscountAmountRaw = tableProductFt?.querySelector('.quotation-create-product-discount-amount-raw');
                let eleTaxAmountRaw = tableProductFt?.querySelector('.quotation-create-product-taxes-raw');
                let eleTotalAmountRaw = tableProductFt?.querySelector('.quotation-create-product-total-raw');
                let eleRevenueBT = tableProductFt?.querySelector('.quotation-final-revenue-before-tax');
                // Re calculate pretax, discount, total
                let pretaxNew = parseFloat(elePretaxAmountRaw.value) + parseFloat(shipping_price);
                let totalNew = (pretaxNew - parseFloat(eleDiscountAmountRaw.value) + parseFloat(eleTaxAmountRaw.value));
                eleRevenueBT.value = (pretaxNew - parseFloat(eleDiscountAmountRaw.value));
                // Apply new pretax, total
                $(elePretaxAmount).attr('data-init-money', String(pretaxNew));
                elePretaxAmountRaw.value = pretaxNew;
                $(eleTotalAmount).attr('data-init-money', String(totalNew));
                eleTotalAmountRaw.value = totalNew;
                $.fn.initMaskMoney2();
            }
        }
        return true;
    };
}

// Store data
class QuotationStoreDataHandle {

    static storeDtbData(type) {
        let dataJSON = {};
        let datas = [];
        let $table = null;
        if (type === 1) {
            datas = QuotationSubmitHandle.setupDataProduct();
            $table = QuotationDataTableHandle.$tableProduct;
        }
        if (type === 3) {
            datas = QuotationSubmitHandle.setupDataExpense();
            $table = QuotationDataTableHandle.$tableExpense;
        }
        if (type === 4) {
            datas = QuotationSubmitHandle.setupDataPaymentStage();
            $table = QuotationDataTableHandle.$tablePayment;
        }
        if (datas.length > 0 && $table) {
            for (let data of datas) {
                if (!dataJSON.hasOwnProperty(String(data?.['order']))) {
                    dataJSON[String(data?.['order'])] = data;
                }
            }
            $table.DataTable().rows().every(function () {
                let row = this.node();
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    let key = eleOrder.innerHTML;
                    eleOrder.setAttribute('data-row', JSON.stringify(dataJSON?.[key]));
                }
            });
        }
        return true;
    };

}

// Submit Form
class QuotationSubmitHandle {
    static setupDataProduct() {
        let result = [];
        if (QuotationDataTableHandle.$tableProduct.DataTable().data().count() === 0) {
            return [];
        }
        QuotationDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let eleProductGr = row.querySelector('.table-row-group');
            let eleProduct = row.querySelector('.table-row-item');
            let elePromotion = row.querySelector('.table-row-promotion');
            let eleShipping = row.querySelector('.table-row-shipping');
            if (eleProductGr) {  // PRODUCT GROUP
                rowData['is_group'] = true;
                if (eleProductGr.getAttribute('data-group-order')) {
                    rowData['group_order'] = parseInt(eleProductGr.getAttribute('data-group-order'));
                }
                let eleGroupTitle = row.querySelector('.table-row-group-title-edit');
                if (eleGroupTitle) {
                    rowData['group_title'] = eleGroupTitle.value;
                }
                result.push(rowData);
            } else if (eleProduct) { // PRODUCT
                if ($(eleProduct).val()) {
                    let dataProduct = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                    if (dataProduct) {
                        rowData['product_id'] = dataProduct?.['id'];
                        rowData['product_title'] = dataProduct?.['title'];
                        rowData['product_code'] = dataProduct?.['code'];
                        rowData['product_data'] = dataProduct;
                    }
                }
                let eleUOM = row.querySelector('.table-row-uom');
                if ($(eleUOM).val()) {
                    let dataUOM = SelectDDControl.get_data_from_idx($(eleUOM), $(eleUOM).val());
                    if (dataUOM) {
                        rowData['unit_of_measure_id'] = dataUOM?.['id'];
                        rowData['product_uom_title'] = dataUOM?.['title'];
                        rowData['product_uom_code'] = dataUOM?.['code'];
                        rowData['uom_data'] = dataUOM;
                    }
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                    if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                        rowData['remain_for_purchase_request'] = parseFloat(eleQuantity.value);
                        rowData['remain_for_purchase_order'] = parseFloat(eleQuantity.value);
                        rowData['quantity_wo_remain'] = parseFloat(eleQuantity.value);
                    }
                }
                let eleTax = row.querySelector('.table-row-tax');
                if ($(eleTax).val()) {
                    let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                    if (dataTax) {
                        rowData['tax_id'] = dataTax?.['id'];
                        rowData['product_tax_title'] = dataTax?.['title'];
                        rowData['product_tax_value'] = dataTax?.['rate'];
                        rowData['tax_data'] = dataTax;
                    } else {
                        rowData['product_tax_value'] = 0;
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.innerHTML;
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
                }
                let eleDiscount = row.querySelector('.table-row-discount');
                if (eleDiscount) {
                    if (eleDiscount.value || eleDiscount.value === "0") {
                        rowData['product_discount_value'] = parseFloat(eleDiscount.value);
                    } else {
                        rowData['product_discount_value'] = 0;
                    }
                }
                let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
                if (eleDiscountAmount) {
                    rowData['product_discount_amount'] = $(eleDiscountAmount).valCurrency();
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                if (rowData.hasOwnProperty('product_subtotal_price') && rowData.hasOwnProperty('product_tax_amount')) {
                    rowData['product_subtotal_price_after_tax'] = rowData['product_subtotal_price'] + rowData['product_tax_amount']
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
                rowData['is_group'] = false;
                let dataGroupRaw = row.getAttribute('data-group');
                if (dataGroupRaw) {
                    rowData['group_order'] = parseInt(dataGroupRaw);
                }
                result.push(rowData);
            } else if (elePromotion) { // PROMOTION
                rowData['is_group'] = false;
                rowData['is_promotion'] = true;
                if (elePromotion.getAttribute('data-promotion')) {
                    let dataPm = JSON.parse(elePromotion.getAttribute('data-promotion'));
                    rowData['promotion_id'] = dataPm?.['id'];
                    rowData['promotion_data'] = dataPm;
                }
                let uomData = getDataByProductID(elePromotion.getAttribute('data-id-product'));
                if (uomData && Object.keys(uomData).length > 0) {
                    rowData['unit_of_measure'] = uomData?.['id'];
                    rowData['product_uom_title'] = uomData?.['title'];
                    rowData['product_uom_code'] = uomData?.['code'];
                }
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax'] = dataInfo?.['id'];
                            rowData['product_tax_title'] = dataInfo?.['title'];
                            rowData['product_tax_value'] = dataInfo?.['value'];
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.value;
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
                }
                rowData['product_discount_value'] = 0;
                rowData['product_discount_amount'] = 0;
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
                result.push(rowData);
            } else if (eleShipping) { // SHIPPING
                rowData['is_group'] = false;
                rowData['is_shipping'] = true;
                if (eleShipping.getAttribute('data-shipping')) {
                    let dataShipping = JSON.parse(eleShipping.getAttribute('data-shipping'));
                    rowData['shipping_id'] = dataShipping?.['id'];
                    rowData['shipping_data'] = dataShipping;
                }
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax_id'] = dataInfo?.['id'];
                            rowData['product_tax_title'] = dataInfo?.['title'];
                            rowData['product_tax_value'] = dataInfo?.['value'];
                            rowData['tax_data'] = dataInfo;
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = eleDescription.value;
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_unit_price'] = $(elePrice).valCurrency();
                }
                rowData['product_discount_value'] = 0;
                rowData['product_discount_amount'] = 0;
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
                result.push(rowData);
            }
        });
        return result;
    };

    static setupDataCost() {
        let result = [];
        if (QuotationDataTableHandle.$tableCost.DataTable().data().count() === 0) {
            return [];
        }
        QuotationDataTableHandle.$tableCost.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let eleProduct = row.querySelector('.table-row-item');
            let eleShipping = row.querySelector('.table-row-shipping');
            if ($(eleProduct).val()) { // PRODUCT
                let dataProduct = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                if (dataProduct) {
                    rowData['product_id'] = dataProduct?.['id'];
                    rowData['product_title'] = dataProduct?.['title'];
                    rowData['product_code'] = dataProduct?.['code'];
                    rowData['product_data'] = dataProduct;
                }
                if (row.querySelector('.table-row-supplied-by')) {
                    rowData['supplied_by'] = parseInt(row.querySelector('.table-row-supplied-by').value);
                }
                let eleUOM = row.querySelector('.table-row-uom');
                if ($(eleUOM).val()) {
                    let dataUOM = SelectDDControl.get_data_from_idx($(eleUOM), $(eleUOM).val());
                    if (dataUOM) {
                        rowData['unit_of_measure_id'] = dataUOM?.['id'];
                        rowData['product_uom_title'] = dataUOM?.['title'];
                        rowData['product_uom_code'] = dataUOM?.['code'];
                        rowData['uom_data'] = dataUOM;
                    }
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let eleTax = row.querySelector('.table-row-tax');
                if ($(eleTax).val()) {
                    let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                    if (dataTax) {
                        rowData['tax_id'] = dataTax?.['id'];
                        rowData['product_tax_title'] = dataTax?.['title'];
                        rowData['product_tax_value'] = dataTax?.['rate'];
                        rowData['tax_data'] = dataTax;
                    } else {
                        rowData['product_tax_value'] = 0;
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value)
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_cost_price'] = $(elePrice).valCurrency();
                    if ($(elePrice).attr('data-wh')) {
                        let dataWH = JSON.parse($(elePrice).attr('data-wh'));
                        rowData['warehouse_id'] = dataWH?.['id'];
                        if (["bom", "standard"].includes(rowData['warehouse_id'])) {
                            delete rowData['warehouse_id'];
                        }
                        rowData['warehouse_data'] = dataWH;
                    }
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                if (rowData.hasOwnProperty('product_subtotal_price') && rowData.hasOwnProperty('product_tax_amount')) {
                    rowData['product_subtotal_price_after_tax'] = rowData['product_subtotal_price'] + rowData['product_tax_amount']
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }
                result.push(rowData);
            } else if (eleShipping) { // SHIPPING
                rowData['is_shipping'] = true;
                if (eleShipping.getAttribute('data-shipping')) {
                    let dataShipping = JSON.parse(eleShipping.getAttribute('data-shipping'));
                    rowData['shipping_id'] = dataShipping?.['id'];
                    rowData['shipping_data'] = dataShipping;
                }
                let eleTax = row.querySelector('.table-row-tax');
                if (eleTax) {
                    let optionSelected = eleTax.options[eleTax.selectedIndex];
                    if (optionSelected) {
                        if (optionSelected.querySelector('.data-info')) {
                            let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                            rowData['tax_id'] = dataInfo?.['id'];
                            rowData['product_tax_title'] = dataInfo?.['title'];
                            rowData['product_tax_value'] = dataInfo?.['value'];
                            rowData['tax_data'] = dataInfo;
                        } else {
                            rowData['product_tax_value'] = 0;
                        }
                    }
                }
                let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = parseFloat(eleTaxAmount.value);
                }
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                }
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    rowData['product_cost_price'] = $(elePrice).valCurrency();
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    rowData['order'] = parseInt(eleOrder.innerHTML);
                }

                result.push(rowData);
            }
        });
        return result;
    };

    static setupDataExpense() {
        let result = [];
        if (QuotationDataTableHandle.$tableExpense.DataTable().data().count() === 0) {
            return [];
        }
        QuotationDataTableHandle.$tableExpense.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let dataRowRaw = row.querySelector('.table-row-order')?.getAttribute('data-row');
            if (dataRowRaw) {
                let dataRow = JSON.parse(dataRowRaw);
                rowData['is_labor'] = dataRow?.['is_labor'];
            }
            let eleExpenseItem = row.querySelector('.table-row-item');
            if ($(eleExpenseItem).val()) {
                let dataExpenseItem = SelectDDControl.get_data_from_idx($(eleExpenseItem), $(eleExpenseItem).val());
                if (dataExpenseItem) {
                    rowData['expense_item_id'] = dataExpenseItem?.['id'];
                    rowData['expense_code'] = dataExpenseItem?.['code'];
                    rowData['expense_type_title'] = dataExpenseItem?.['title'];
                    rowData['expense_item_data'] = dataExpenseItem;
                }
            }
            if (row?.querySelector('.table-row-expense-title')) {
                rowData['expense_title'] = row.querySelector('.table-row-expense-title').value;
            }
            let eleLaborItem = row?.querySelector('.table-row-labor-item');
            if (eleLaborItem) {
                if ($(eleLaborItem).val()) {
                    let dataLaborItem = SelectDDControl.get_data_from_idx($(eleLaborItem), $(eleLaborItem).val());
                    if (dataLaborItem) {
                        rowData['expense_id'] = dataLaborItem?.['id'];
                        rowData['expense_title'] = dataLaborItem?.['title'];
                        rowData['expense_data'] = dataLaborItem;
                    }
                }
            }
            let eleUOM = row.querySelector('.table-row-uom');
            if ($(eleUOM).val()) {
                let dataUOM = SelectDDControl.get_data_from_idx($(eleUOM), $(eleUOM).val());
                if (dataUOM) {
                    rowData['unit_of_measure_id'] = dataUOM?.['id'];
                    rowData['product_uom_title'] = dataUOM?.['title'];
                    rowData['product_uom_code'] = dataUOM?.['code'];
                    rowData['uom_data'] = dataUOM;
                }
            }
            let eleTax = row.querySelector('.table-row-tax');
            if ($(eleTax).val()) {
                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                if (dataTax) {
                    rowData['tax_id'] = dataTax?.['id'];
                    rowData['product_tax_title'] = dataTax?.['title'];
                    rowData['product_tax_value'] = dataTax?.['rate'];
                    rowData['tax_data'] = dataTax;
                } else {
                    rowData['product_tax_value'] = 0;
                }
            }
            let eleTaxAmount = row.querySelector('.table-row-tax-amount-raw');
            if (eleTaxAmount) {
                rowData['expense_tax_amount'] = parseFloat(eleTaxAmount.value)
            }
            let eleQuantity = row.querySelector('.table-row-quantity');
            if (eleQuantity) {
                rowData['expense_quantity'] = parseFloat(eleQuantity.value);
            }
            let elePrice = row.querySelector('.table-row-price');
            if (elePrice) {
                rowData['expense_price'] = $(elePrice).valCurrency();
            }
            let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
            if (eleSubtotal) {
                rowData['expense_subtotal_price'] = parseFloat(eleSubtotal.value)
            }
            if (rowData.hasOwnProperty('expense_subtotal_price') && rowData.hasOwnProperty('expense_tax_amount')) {
                rowData['expense_subtotal_price_after_tax'] = rowData['expense_subtotal_price'] + rowData['expense_tax_amount']
            }
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                rowData['order'] = parseInt(eleOrder.innerHTML);
            }
            result.push(rowData);
        });
        return result;
    };

    static setupDataLogistic() {
        return {
            'shipping_address': $('#quotation-create-shipping-address').val(),
            'billing_address': $('#quotation-create-billing-address').val(),
        }
    };

    static setupDataIndicator() {
        let result = [];
        let $table = $('#datable-quotation-create-indicator');
        $table.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-order')) {
                if (row.querySelector('.table-row-order').getAttribute('data-row')) {
                    let dataRow = JSON.parse(row.querySelector('.table-row-order').getAttribute('data-row'));
                    let indicator = row.querySelector('.table-row-title').getAttribute('data-id');
                    let indicator_value = row.querySelector('.table-row-value').getAttribute('data-value');
                    let indicator_rate = row.querySelector('.table-row-rate').getAttribute('data-value');
                    let order = row.querySelector('.table-row-order').getAttribute('data-value');
                    if (!$table.hasClass('sale-order')) { // QUOTATION INDICATOR
                        result.push({
                            'indicator': indicator,
                            'indicator_data': dataRow?.['indicator_data'],
                            'indicator_value': parseFloat(indicator_value),
                            'indicator_rate': parseFloat(indicator_rate),
                            'order': parseInt(order),
                        })
                    } else { // SALE ORDER INDICATOR
                        let quotation_indicator_value = row.querySelector('.table-row-quotation-value').getAttribute('data-value');
                        let difference_indicator_rate = row.querySelector('.table-row-difference-value').getAttribute('data-value');
                        result.push({
                            'quotation_indicator': indicator,
                            'quotation_indicator_data': dataRow?.['quotation_indicator_data'],
                            'indicator_value': parseFloat(indicator_value),
                            'indicator_rate': parseFloat(indicator_rate),
                            'quotation_indicator_value': parseFloat(quotation_indicator_value),
                            'difference_indicator_value': parseFloat(difference_indicator_rate) ? difference_indicator_rate : 0,
                            'order': parseInt(order),
                        })
                    }
                }
            }
        });
        return result
    };

    static setupDataPaymentStage() {
        let result = [];
        QuotationDataTableHandle.$tablePayment.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let eleOrder = row.querySelector('.table-row-order');
            if (eleOrder) {
                rowData['order'] = parseInt(eleOrder.innerHTML);
            }
            let eleInstallment = row.querySelector('.table-row-installment');
            if (eleInstallment) {
                if ($(eleInstallment).val()) {
                    let dataSelected = SelectDDControl.get_data_from_idx($(eleInstallment), $(eleInstallment).val());
                    if (dataSelected) {
                        rowData['term_id'] = $(eleInstallment).val();
                        rowData['term_data'] = dataSelected;
                    }
                }
            }
            let eleRemark = row.querySelector('.table-row-remark');
            if (eleRemark) {
                rowData['remark'] = $(eleRemark).val();
            }
            let eleDate = row.querySelector('.table-row-date');
            if (eleDate) {
                if (eleDate.value) {
                    rowData['date'] = String(moment(eleDate.value, 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                }
            }
            let eleDateType = row.querySelector('.table-row-date-type');
            if (eleDateType) {
                rowData['date_type'] = $(eleDateType).val();
            }
            let eleRatio = row.querySelector('.table-row-ratio');
            if (eleRatio) {
                rowData['payment_ratio'] = parseFloat(eleRatio.value);
            }
            let eleValueBT = row.querySelector('.table-row-value-before-tax');
            if (eleValueBT) {
                if ($(eleValueBT).valCurrency()) {
                    rowData['value_before_tax'] = parseFloat($(eleValueBT).valCurrency());
                }
            }
            let eleIssueInvoice = row.querySelector('.table-row-issue-invoice');
            if (eleIssueInvoice) {
                rowData['is_ar_invoice'] = false;
                if ($(eleIssueInvoice).val()) {
                    rowData['issue_invoice'] = parseInt($(eleIssueInvoice).val());
                    rowData['is_ar_invoice'] = true;
                }
            }
            let eleValueAT = row.querySelector('.table-row-value-after-tax');
            if (eleValueAT) {
                if ($(eleValueAT).valCurrency()) {
                    rowData['value_after_tax'] = parseFloat($(eleValueAT).valCurrency());
                }
            }
            let eleValueTotal = row.querySelector('.table-row-value-total');
            if (eleValueTotal) {
                if ($(eleValueTotal).valCurrency()) {
                    rowData['value_total'] = parseFloat($(eleValueTotal).valCurrency());
                }
            }
            let eleDueDate = row.querySelector('.table-row-due-date');
            if (eleDueDate) {
                if (eleDueDate.value) {
                    rowData['due_date'] = String(moment(eleDueDate.value, 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                }
            }
            result.push(rowData);
        });
        return result;
    };

    static setupDataSubmit(_form, type = 0) {
        // type 0: submit | 1: indicator

        let is_sale_order = false;
        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
            is_sale_order = true;
        }
        let quotation_products_data = 'quotation_products_data';
        let quotation_costs_data = 'quotation_costs_data';
        let quotation_expenses_data = 'quotation_expenses_data';
        let quotation_logistic_data = 'quotation_logistic_data';
        let quotation_indicators_data = 'quotation_indicators_data';
        if (is_sale_order === true) {
            quotation_products_data = 'sale_order_products_data';
            quotation_costs_data = 'sale_order_costs_data';
            quotation_expenses_data = 'sale_order_expenses_data';
            quotation_logistic_data = 'sale_order_logistic_data';
            quotation_indicators_data = 'sale_order_indicators_data';

            _form.dataForm['quotation_id'] = null;
            if (QuotationLoadDataHandle.quotationSelectEle && QuotationLoadDataHandle.quotationSelectEle.length > 0) {
                if (QuotationLoadDataHandle.quotationSelectEle.attr('data-detail')) {
                    let quotationData = JSON.parse(QuotationLoadDataHandle.quotationSelectEle.attr('data-detail'));
                    if (quotationData?.['id']) {
                        _form.dataForm['quotation_id'] = quotationData?.['id'];
                        _form.dataForm['quotation_data'] = quotationData;
                    }
                }
            }
        }
        if (QuotationLoadDataHandle.customerSelectEle.val()) {
            let data = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, QuotationLoadDataHandle.customerSelectEle.val());
            if (data) {
                _form.dataForm['customer_data'] = data;
            }
        }
        if (QuotationLoadDataHandle.contactSelectEle.val()) {
            let data = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.contactSelectEle, QuotationLoadDataHandle.contactSelectEle.val());
            if (data) {
                _form.dataForm['contact_data'] = data;
            }
        }
        if (QuotationLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
            if (dataSelected) {
                _form.dataForm['payment_term_data'] = dataSelected;
            }
        }
        if (type === 0) {
            if (!QuotationLoadDataHandle.customerSelectEle.val()) {
                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-required-customer')}, 'failure');
                return false;
            }
            if (!QuotationLoadDataHandle.contactSelectEle.val()) {
                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-required-contact')}, 'failure');
                return false;
            }
            if (!QuotationLoadDataHandle.paymentSelectEle.val()) {
                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-required-payment')}, 'failure');
                return false;
            }
        }
        let quotation_products_data_setup = QuotationSubmitHandle.setupDataProduct();
        if (quotation_products_data_setup.length > 0) {
            _form.dataForm[quotation_products_data] = quotation_products_data_setup;
            // total product
            let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
            if (tableProductWrapper) {
                let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                _form.dataForm['total_product_pretax_amount'] = parseFloat(tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw').value);
                if (!_form.dataForm['total_product_pretax_amount']) {
                    _form.dataForm['total_product_pretax_amount'] = 0;
                }
                let totalProductDiscountRate = tableProductFt.querySelector('.quotation-create-product-discount').value;
                if (totalProductDiscountRate) {
                    _form.dataForm['total_product_discount_rate'] = parseFloat(totalProductDiscountRate);
                } else {
                    _form.dataForm['total_product_discount_rate'] = 0;
                }
                _form.dataForm['total_product_discount'] = parseFloat(tableProductFt.querySelector('.quotation-create-product-discount-amount-raw').value);
                if (!_form.dataForm['total_product_discount']) {
                    _form.dataForm['total_product_discount'] = 0;
                }
                _form.dataForm['total_product_tax'] = parseFloat(tableProductFt.querySelector('.quotation-create-product-taxes-raw').value);
                if (!_form.dataForm['total_product_tax']) {
                    _form.dataForm['total_product_tax'] = 0;
                }
                _form.dataForm['total_product'] = parseFloat(tableProductFt.querySelector('.quotation-create-product-total-raw').value);
                if (!_form.dataForm['total_product']) {
                    _form.dataForm['total_product'] = 0;
                }
                _form.dataForm['total_product_revenue_before_tax'] = parseFloat(tableProductFt.querySelector('.quotation-final-revenue-before-tax').value);
                if (!_form.dataForm['total_product_revenue_before_tax']) {
                    _form.dataForm['total_product_revenue_before_tax'] = 0;
                }
            }
        }
        if (type === 0) {
            if (quotation_products_data_setup.length <= 0) {
                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-required-product')}, 'failure');
                return false;
            }
        }
        // COST
        let quotation_costs_data_setup = QuotationSubmitHandle.setupDataCost();
        if (quotation_costs_data_setup.length > 0) {
            _form.dataForm[quotation_costs_data] = quotation_costs_data_setup;
            // total cost
            let tableCost = document.getElementById('datable-quotation-create-cost');
            _form.dataForm['total_cost_pretax_amount'] = parseFloat(tableCost.querySelector('.quotation-create-cost-pretax-amount-raw').value);
            if (!_form.dataForm['total_cost_pretax_amount']) {
                _form.dataForm['total_cost_pretax_amount'] = 0;
            }
            _form.dataForm['total_cost_tax'] = parseFloat(tableCost.querySelector('.quotation-create-cost-taxes-raw').value);
            if (!_form.dataForm['total_cost_tax']) {
                _form.dataForm['total_cost_tax'] = 0;
            }
            _form.dataForm['total_cost'] = parseFloat(tableCost.querySelector('.quotation-create-cost-total-raw').value);
            if (!_form.dataForm['total_cost']) {
                _form.dataForm['total_cost'] = 0;
            }
        }
        // EXPENSE
        let quotation_expenses_data_setup = QuotationSubmitHandle.setupDataExpense();
        if (quotation_expenses_data_setup.length > 0) {
            _form.dataForm[quotation_expenses_data] = quotation_expenses_data_setup;
            // total expense
            let tableExpenseWrapper = document.getElementById('datable-quotation-create-expense_wrapper');
            if (tableExpenseWrapper) {
                let tableExpenseFt = tableExpenseWrapper.querySelector('.dataTables_scrollFoot');
                _form.dataForm['total_expense_pretax_amount'] = parseFloat(tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount-raw').value);
                if (!_form.dataForm['total_expense_pretax_amount']) {
                    _form.dataForm['total_expense_pretax_amount'] = 0;
                }
                _form.dataForm['total_expense_tax'] = parseFloat(tableExpenseFt.querySelector('.quotation-create-expense-taxes-raw').value);
                if (!_form.dataForm['total_expense_tax']) {
                    _form.dataForm['total_expense_tax'] = 0;
                }
                _form.dataForm['total_expense'] = parseFloat(tableExpenseFt.querySelector('.quotation-create-expense-total-raw').value);
                if (!_form.dataForm['total_expense']) {
                    _form.dataForm['total_expense'] = 0;
                }
            }
        }
        // LOGISTIC
        _form.dataForm[quotation_logistic_data] = QuotationSubmitHandle.setupDataLogistic();
        let customer_shipping = $('#quotation-create-customer-shipping');
        if (customer_shipping.val()) {
            _form.dataForm['customer_shipping'] = customer_shipping.val();
            // handle case hidden zone
            if (_form.dataMethod.toLowerCase() === 'put') {
                let btnEditShipping = $('#btn-edit-shipping');
                if (btnEditShipping.is(':hidden')) {
                    let eleDataDetail = $('#quotation-detail-data');
                    if (eleDataDetail && eleDataDetail.length > 0) {
                        if (eleDataDetail.val()) {
                            let dataDetail = JSON.parse(eleDataDetail.val());
                            _form.dataForm[quotation_logistic_data]['shipping_address'] = dataDetail?.[quotation_logistic_data]?.['shipping_address'];
                        }
                    }
                }
            }
        }
        let customer_billing = $('#quotation-create-customer-billing');
        if (customer_billing.val()) {
            _form.dataForm['customer_billing'] = customer_billing.val();
            // handle case hidden zone
            if (_form.dataMethod.toLowerCase() === 'put') {
                let btnEditShipping = $('#btn-edit-billing');
                if (btnEditShipping.is(':hidden')) {
                    let eleDataDetail = $('#quotation-detail-data');
                    if (eleDataDetail && eleDataDetail.length > 0) {
                        if (eleDataDetail.val()) {
                            let dataDetail = JSON.parse(eleDataDetail.val());
                            _form.dataForm[quotation_logistic_data]['billing_address'] = dataDetail?.[quotation_logistic_data]?.['billing_address'];
                        }
                    }
                }
            }
        }
        // indicator
        let quotation_indicators_data_setup = QuotationSubmitHandle.setupDataIndicator();
        if (quotation_indicators_data_setup.length > 0) {
            _form.dataForm[quotation_indicators_data] = quotation_indicators_data_setup;
            let keyInd = "indicator_data";
            if (is_sale_order === true) {
                keyInd = "quotation_indicator_data";
            }
            for (let indicator of quotation_indicators_data_setup) {
                if (indicator?.[keyInd]?.['code'] === "IN0001") {
                    _form.dataForm['indicator_revenue'] = indicator?.['indicator_value'] ? indicator?.['indicator_value'] : 0;
                }
                if (indicator?.[keyInd]?.['code'] === "IN0003") {
                    _form.dataForm['indicator_gross_profit'] = indicator?.['indicator_value'] ? indicator?.['indicator_value'] : 0;
                }
                if (indicator?.[keyInd]?.['code'] === "IN0006") {
                    _form.dataForm['indicator_net_income'] = indicator?.['indicator_value'] ? indicator?.['indicator_value'] : 0;
                }
            }
        }

        // payment stage
        if (is_sale_order === true) {
            _form.dataForm['sale_order_payment_stage'] = QuotationSubmitHandle.setupDataPaymentStage();
            // validate payment stage submit
            if (type === 0) {
                if (_form.dataForm?.['sale_order_payment_stage'] && _form.dataForm?.['total_product']) {
                    let totalRatio = 0;
                    let totalPayment = 0;
                    for (let payment of _form.dataForm['sale_order_payment_stage']) {
                        totalRatio += payment?.['payment_ratio'] ? payment?.['payment_ratio'] : 0;
                        totalPayment += payment?.['value_total'] ? payment?.['value_total'] : 0;
                    }
                    if (totalRatio !== 100) {
                        $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-validate-total-ratio-payment')}, 'failure');
                        return false;
                    }
                    if (totalPayment !== _form.dataForm?.['total_product']) {
                        $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-validate-total-payment')}, 'failure');
                        return false;
                    }
                }
            }

        }

        // recurrence
        let urlParams = $x.fn.getManyUrlParameters(['recurrence_task_id']);
        if (urlParams?.['recurrence_task_id']) {
            _form.dataForm['is_recurring'] = true;
            _form.dataForm['recurrence_task_id'] = urlParams?.['recurrence_task_id'];
        }
        return _form.dataForm;
    };
}

// *** COMMON FUNCTIONS ***
function deleteRow(currentRow, table) {
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    row.remove().draw();
}

function reOrderSTT(table) {
    let order = 1;
    let itemCount = table[0].querySelectorAll('.table-row-order').length;
    if (itemCount === 0) {
        table.DataTable().clear().draw();
    } else {
        for (let eleOrder of table[0].querySelectorAll('.table-row-order')) {
            eleOrder.innerHTML = order;
            order++
            if (order > itemCount) {
                break;
            }
        }
    }
}

function deletePromotionRows(table, is_promotion = false, is_shipping = false) {
    for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
        let row = table[0].tBodies[0].rows[i];
        if (row.querySelector('.table-row-promotion') && is_promotion === true) {
            deleteRow($(row), table);
            // Re order
            reOrderSTT(table);
        } else if (row.querySelector('.table-row-shipping') && is_shipping === true) {
            deleteRow($(row), table);
            // Re order
            reOrderSTT(table);
        }
    }
}

function filterDataProductNotPromotion(data_products) {
    let finalList = [];
    let order = 0;
    for (let i = 0; i < data_products.length; i++) {
        let dataProd = data_products[i];
        let itemType = 0  // product
        if (dataProd.hasOwnProperty('product') && dataProd.hasOwnProperty('promotion') && dataProd.hasOwnProperty('shipping')) {
            if (Object.keys(dataProd['promotion']).length > 0) {
                itemType = 1  // promotion
            }
            if (Object.keys(dataProd['shipping']).length > 0) {
                itemType = 2  // shipping
            }
        }
        if (itemType === 0) {
            order++;
            dataProd['order'] = order;
            finalList.push(dataProd)
        }
    }
    return finalList
}

function getDataByProductID(product_id) {
    let uom_data = {};
    let eleDataList = document.getElementById('data-init-quotation-create-tables-product');
    let dataList = JSON.parse(eleDataList.value);
    for (let i = 0; i < dataList.length; i++) {
        let data = dataList[i];
        if (data.id === product_id) {
            if (data?.['sale_information']) {
                uom_data = data?.['sale_information']?.['default_uom'];
                break
            }
        }
    }
    return uom_data
}

function getCurrentDate() {
    let currentDate = new Date();
    let day = String(currentDate.getDate()).padStart(2, '0');
    let month = String(currentDate.getMonth() + 1).padStart(2, '0');
    let year = currentDate.getFullYear();
    return `${year}-${month}-${day}`;
}

// math functions
function max(data_list) {
    return Math.max(...data_list);
}

function min(data_list) {
    return Math.min(...data_list);
}

function sum() {
    return Array.prototype.reduce.call(arguments, function (acc, val) {
        return acc + val;
    }, 0);
}

// date
function calculateDate(dateString, opts = {}) {
    let parts = dateString.split('/');
    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript
    let year = parseInt(parts[2], 10);
    let originalDate = new Date(year, month, day);
    if (opts.hasOwnProperty('number_day_after')) {
        let newDate = new Date(originalDate);
        newDate.setDate(originalDate.getDate() + opts?.['number_day_after']);
        let padWithZero = (value) => (value < 10 ? `0${value}` : value);
        return `${padWithZero(newDate.getDate())}/${padWithZero(newDate.getMonth() + 1)}/${newDate.getFullYear()}`;
    }
}

function validateStartEndDate(startDate, endDate) {
    let parseStartDate = parseDate(startDate);
    let parseEndDate = parseDate(endDate);
    // Check if startDate is greater than or equal to endDate
    return parseEndDate > parseStartDate;
}

function parseDate(dateString) {
    const parts = dateString.split('/');
    // Note: months are 0-based in JavaScript Dates, so subtract 1
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return new Date(formattedDate);
}

// validate
function validateNumber(ele) {
    let value = ele.value;
    // Replace non-digit characters with an empty string
    value = value.replace(/[^0-9.]/g, '');
    // Remove unnecessary zeros from the integer part
    value = value.replace("-", "").replace(/^0+(?=\d)/, '');
    // Update value of input
    ele.value = value;
    return true;
}

function validatePSValue(ele) {
    let row = ele.closest('tr');
    let tablePS = $('#datable-quotation-payment-stage');
    let eleRatio = row.querySelector('.table-row-ratio');
    let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
    if (tableProductWrapper) {
        let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
        let elePretax = tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw');
        let eleDiscount = tableProductFt.querySelector('.quotation-create-product-discount-amount-raw');
        if (elePretax && eleDiscount) {
            let valueSO = parseFloat(elePretax.value) - parseFloat(eleDiscount.value);
            let totalBT = 0;
            tablePS.DataTable().rows().every(function () {
                let row = this.node();
                let eleValueBT = row.querySelector('.table-row-value-before-tax');
                if (eleValueBT) {
                    totalBT += $(eleValueBT).valCurrency();
                }
            });
            if (totalBT > valueSO) {
                $(ele).attr('value', String(0));
                eleRatio.value = 0;
                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-validate-total-payment')}, 'failure');
                return false;
            }
        }
    }
    return true;
}