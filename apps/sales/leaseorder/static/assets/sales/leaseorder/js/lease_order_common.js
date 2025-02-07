// Load data
class LeaseOrderLoadDataHandle {
    static $form = $('#frm_lease_create');
    static opportunitySelectEle = $('#opportunity_id');
    static processSelectEle$ = $('#process_id');
    static $leaseFrom = $('#lease_from');
    static $leaseTo = $('#lease_to');
    static customerSelectEle = $('#customer_id');
    static contactSelectEle = $('#contact_id');
    static paymentSelectEle = $('#payment_term_id');
    static salePersonSelectEle = $('#employee_inherit_id');
    static quotationSelectEle = $('#quotation_id');
    static $btnSaveSelectProduct = $('#btn-save-select-product');
    static $btnSaveSelectOffset = $('#btn-save-select-offset');
    static $btnSaveSelectQuantity = $('#btn-save-select-quantity');
    static $quantityModal = $('#selectQuantityModal');
    static $eleStoreDetail = $('#quotation-detail-data');
    static transEle = $('#app-trans-factory');
    static urlEle = $('#app-url-factory');
    static customerInitEle = $('#data-init-customer');
    static $priceModal = $('#selectPriceModal');
    static $btnSavePrice = $('#btn-save-select-price');
    static $costModal = $('#selectCostModal');
    static $btnSaveCost = $('#btn-save-select-cost');
    static $depreciationModal = $('#viewDepreciationDetail');
    static $btnSaveDepreciation = $('#btn-save-depreciation-detail');
    static dataAssetType = [
        {'id': '', 'title': 'Select...',},
        {'id': 1, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-asset-type-1')},
        {'id': 2, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-asset-type-2')},
        {'id': 3, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-asset-type-3')},
    ];
    static dataDepreciationMethod = [
        {'id': 0, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-depreciation-method-1')},
        {'id': 1, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-depreciation-method-2')},
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
                let res1 = ``;
                let res2 = ``;
                if (customRes?.['res1']) {
                    res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`;
                }
                if (customRes?.['res2']) {
                    res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`;
                }
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
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
            if (radio && !radio.disabled) {
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
        let form = $('#frm_lease_create');
        let urlParams = $x.fn.getManyUrlParameters(['opp_id', 'opp_title', 'opp_code']);
        if (urlParams?.['opp_id'] && urlParams?.['opp_title'] && urlParams?.['opp_code']) {
            if (form.attr('data-method').toLowerCase() === 'post') {
                let list_from_app = 'leaseorder.leaseorder.create';
                $.fn.callAjax2({
                        'url': LeaseOrderLoadDataHandle.opportunitySelectEle.attr('data-url'),
                        'method': LeaseOrderLoadDataHandle.opportunitySelectEle.attr('data-method'),
                        'data': {'list_from_app': list_from_app, 'id': urlParams?.['opp_id']},
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                                if (data.opportunity_list.length > 0) {
                                    if (!LeaseOrderLoadDataHandle.opportunitySelectEle.prop('disabled')) {
                                        LeaseOrderLoadDataHandle.opportunitySelectEle.trigger('change');
                                        LeaseOrderLoadDataHandle.loadDataByOpportunity(data.opportunity_list[0]);
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
            LeaseOrderLoadDataHandle.loadInitS2(LeaseOrderLoadDataHandle.salePersonSelectEle, [JSON.parse(dataStr)]);
        }
        return true;
    };

    static loadDataByOpportunity(oppData) {
        let tableProduct = $('#datable-quotation-create-product');
        if ($(LeaseOrderLoadDataHandle.opportunitySelectEle).val()) {
            LeaseOrderLoadDataHandle.salePersonSelectEle[0].setAttribute('readonly', 'true');
            LeaseOrderLoadDataHandle.customerSelectEle[0].setAttribute('readonly', 'true');
            // load sale person
            LeaseOrderLoadDataHandle.salePersonSelectEle.empty();
            LeaseOrderLoadDataHandle.salePersonSelectEle.initSelect2({
                data: oppData?.['sale_person'],
                'allowClear': true,
            });
            // load customer
            if (LeaseOrderLoadDataHandle.customerInitEle.val()) {
                let initCustomer = JSON.parse(LeaseOrderLoadDataHandle.customerInitEle.val());
                LeaseOrderLoadDataHandle.customerSelectEle.empty();
                LeaseOrderLoadDataHandle.customerSelectEle.initSelect2({
                    data: initCustomer?.[oppData?.['customer']?.['id']],
                });
                LeaseOrderLoadDataHandle.customerSelectEle.trigger('change');
            }
        } else {
            LeaseOrderLoadDataHandle.salePersonSelectEle[0].removeAttribute('readonly');
            LeaseOrderLoadDataHandle.customerSelectEle[0].removeAttribute('readonly');
            LeaseOrderLoadDataHandle.contactSelectEle[0].removeAttribute('readonly');
        }
        // Delete all promotion rows
        deletePromotionRows(tableProduct, true, false);
        // Delete all shipping rows
        deletePromotionRows(tableProduct, false, true);
        // ReCheck Config when change Opportunity
        LeaseOrderCheckConfigHandle.checkConfig(0);
        // check ProductBOM
        for (let eleProduct of LeaseOrderDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-item')) {
            let dataProduct = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
            if (dataProduct) {
                let checkBOM = LeaseOrderLoadDataHandle.loadCheckProductBOM(dataProduct);
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
        let ele = LeaseOrderLoadDataHandle.customerInitEle;
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
        if (LeaseOrderLoadDataHandle.salePersonSelectEle.val()) {
            sale_person_id = LeaseOrderLoadDataHandle.salePersonSelectEle.val();
        }
        if (sale_person_id) {
            data_filter['employee__id'] = sale_person_id;
        }
        LeaseOrderLoadDataHandle.loadInitS2(LeaseOrderLoadDataHandle.customerSelectEle, [dataCustomer], data_filter);
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            if (!dataCustomer?.['is_copy']) {
                LeaseOrderLoadDataHandle.loadDataProductAll();
            }
        }
    };

    static loadDataByCustomer() {
        let tableProduct = $('#datable-quotation-create-product');
        LeaseOrderLoadDataHandle.loadBoxQuotationContact();
        LeaseOrderLoadDataHandle.loadBoxQuotationPaymentTerm();
        LeaseOrderLoadDataHandle.loadChangePaymentTerm();
        if (LeaseOrderLoadDataHandle.customerSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.customerSelectEle, LeaseOrderLoadDataHandle.customerSelectEle.val());
            if (dataSelected) {
                // load Shipping & Billing by Customer
                LeaseOrderLoadDataHandle.loadShippingBillingCustomer();
                LeaseOrderLoadDataHandle.loadShippingBillingCustomer(dataSelected);
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
        LeaseOrderLoadDataHandle.loadDataProductAll();
    };

    static loadBoxQuotationContact(dataContact = {}, customerID = null) {
        if ($(LeaseOrderLoadDataHandle.customerSelectEle).val() && Object.keys(dataContact).length === 0) {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.customerSelectEle, $(LeaseOrderLoadDataHandle.customerSelectEle).val());
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
        LeaseOrderLoadDataHandle.contactSelectEle.empty();
        LeaseOrderLoadDataHandle.contactSelectEle.initSelect2({
            data: dataContact,
            'dataParams': {'account_name_id': customerID},
            disabled: !(LeaseOrderLoadDataHandle.contactSelectEle.attr('data-url')),
            callbackTextDisplay: function (item) {
                return item?.['fullname'] || '';
            },
        });
    };

    static loadBoxQuotationPaymentTerm() {
        LeaseOrderLoadDataHandle.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle);
        if ($(LeaseOrderLoadDataHandle.customerSelectEle).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.customerSelectEle, $(LeaseOrderLoadDataHandle.customerSelectEle).val());
            if (dataSelected) {
                if (dataSelected?.['payment_term_customer_mapped']) {
                    LeaseOrderLoadDataHandle.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle, [dataSelected?.['payment_term_customer_mapped']], {}, null, true);
                }
            }
        }
        return true;
    };

    static loadDataBySalePerson() {
        if (!LeaseOrderLoadDataHandle.opportunitySelectEle.val()) {
            // load opp
            if (LeaseOrderLoadDataHandle.salePersonSelectEle.val()) {
                LeaseOrderLoadDataHandle.opportunitySelectEle.empty();
                LeaseOrderLoadDataHandle.opportunitySelectEle.initSelect2({
                    'dataParams': {'employee_inherit': LeaseOrderLoadDataHandle.salePersonSelectEle.val()},
                    'allowClear': true,
                    templateResult: function (state) {
                        let titleHTML = `<span>${state.data?.title ? state.data.title : "_"}</span>`
                        let codeHTML = `<span class="badge badge-soft-primary mr-2">${state.text ? state.text : "_"}</span>`
                        return $(`<span>${codeHTML} ${titleHTML}</span>`);
                    },
                });
            } else {
                LeaseOrderLoadDataHandle.opportunitySelectEle.empty();
                LeaseOrderLoadDataHandle.opportunitySelectEle.initSelect2({
                    'allowClear': true,
                    templateResult: function (state) {
                        let titleHTML = `<span>${state.data?.title ? state.data.title : "_"}</span>`
                        let codeHTML = `<span class="badge badge-soft-primary mr-2">${state.text ? state.text : "_"}</span>`
                        return $(`<span>${codeHTML} ${titleHTML}</span>`);
                    },
                });
            }
            // load customer, contact, payment
            LeaseOrderLoadDataHandle.loadBoxQuotationCustomer();
            LeaseOrderLoadDataHandle.loadBoxQuotationContact();
            LeaseOrderLoadDataHandle.loadBoxQuotationPaymentTerm();
        }
    };

    static loadInitDate() {
        let currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();
        let formattedDate = `${day}/${month}/${year}`;
        $('#quotation-create-date-created').val(formattedDate);
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
                'url': LeaseOrderLoadDataHandle.urlEle.attr('data-md-product'),
                'method': 'GET',
                'data': {'general_product_types_mapped__is_service': true},
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
                        LeaseOrderDataTableHandle.$tableSProduct.DataTable().clear().draw();
                        LeaseOrderDataTableHandle.$tableSProduct.DataTable().rows.add(fnData).draw();
                        WindowControl.hideLoading();
                    }
                }
            }
        )
    };

    static loadModalSOffset(ele) {
        let fnData = [];
        let row = ele.closest('tr');
        LeaseOrderDataTableHandle.$tableSOffset.DataTable().clear().draw();
        if (row) {
            let eleType = row.querySelector('.table-row-asset-type');
            if (eleType) {
                if (!$(eleType).val()) {
                    $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-required-asset-type')}, 'info');
                    return false;
                }
                let params = {'lease_source_id__isnull': true};
                if ($(eleType).val() === "1") {
                    params['general_product_types_mapped__is_goods'] = true;
                }
                if ($(eleType).val() === "2") {
                    params['general_product_types_mapped__is_asset_tool'] = true;
                }
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': LeaseOrderLoadDataHandle.urlEle.attr('data-md-product'),
                        'method': 'GET',
                        'data': params,
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
                                LeaseOrderDataTableHandle.$tableSOffset.DataTable().rows.add(fnData).draw();
                                WindowControl.hideLoading();
                            }
                        }
                    }
                )
            }
        }
        return true;
    };

    static loadModalSQuantity(ele) {
        let row = ele.closest('tr');
        if (row) {
            let newEle = LeaseOrderLoadDataHandle.$quantityModal[0].querySelector('.quantity-new');
            let leasedEle = LeaseOrderLoadDataHandle.$quantityModal[0].querySelector('.quantity-leased');
            let rowNewEle = row.querySelector('.table-row-quantity-new');
            let rowLeasedEle = row.querySelector('.table-row-quantity-leased');
            if (newEle && leasedEle && rowNewEle && rowLeasedEle) {
                if (rowNewEle.value && rowLeasedEle.value) {
                    $(newEle).val(parseFloat(rowNewEle.value));
                    $(leasedEle).val(parseFloat(rowLeasedEle.value));
                }
            }
            let offsetEle = row.querySelector('.table-row-offset');
            if (offsetEle) {
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': LeaseOrderLoadDataHandle.urlEle.attr('data-md-product'),
                        'method': 'GET',
                        'data': {'lease_source_id': $(offsetEle).val()},
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('product_sale_list') && Array.isArray(data.product_sale_list)) {
                                LeaseOrderDataTableHandle.$tableSLeasedProduct.DataTable().clear().draw();
                                LeaseOrderDataTableHandle.$tableSLeasedProduct.DataTable().rows.add(data.product_sale_list).draw();
                                WindowControl.hideLoading();
                            }
                        }
                    }
                )
            }
        }
        return true;
    };

    static loadCheckProductBOM(data) {
        let check = true;
        let note_type = 'data-product-note-2';
        if (LeaseOrderLoadDataHandle.opportunitySelectEle.val()) {
            if (data?.['bom_check_data']?.['is_bom_opp'] === true) {
                if (data?.['bom_check_data']?.['is_so_finished'] === false && data?.['bom_data']?.['opportunity']?.['id'] !== LeaseOrderLoadDataHandle.opportunitySelectEle.val()) {
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

    static loadTableCopyQuotation(opp_id = null, sale_person_id = null) {
        let ele = $('#data-init-copy-quotation');
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
                            LeaseOrderDataTableHandle.dataTableCopyQuotation(dataInit);
                            WindowControl.hideLoading();
                        }
                    }
                }
            )
        } else {
            LeaseOrderDataTableHandle.dataTableCopyQuotation();
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
                                                            <button type="button" class="btn btn-primary choose-shipping" data-bs-dismiss="modal" id="${shipping.id}" data-address="${shipping.full_address}">${LeaseOrderLoadDataHandle.transEle.attr('data-select-address')}</button>
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
                                                            <button type="button" class="btn btn-primary choose-billing" data-bs-dismiss="modal" id="${billing.id}" data-address="${billing.full_address}">${LeaseOrderLoadDataHandle.transEle.attr('data-select-address')}</button>
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
            let upperGroupsClass = LeaseOrderLoadDataHandle.decrementGroupString(dataTargetNoDot);
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
        LeaseOrderDataTableHandle.$tableSProduct.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = LeaseOrderDataTableHandle.$tableSProduct.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableSProduct.DataTable().row(rowIndex);
            let dataRow = $row.data();

            if (row.querySelector('.table-row-checkbox:checked:not([disabled])')) {
                if (!LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${dataRow?.['id']}"]`)) {
                    LeaseOrderLoadDataHandle.loadAddRowProduct(dataRow);
                }
            }
        });
        return true;
    };

    static loadAddRowProduct(data) {
        // delete all Promotion rows
        deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, true, false);
        // Delete all shipping rows
        deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, false, true);
        // ReCalculate Total
        LeaseOrderCalculateCaseHandle.updateTotal(LeaseOrderDataTableHandle.$tableProduct[0]);
        let TotalOrder = LeaseOrderDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-order').length;
        let TotalGroup = LeaseOrderDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-group').length;
        let order = (TotalOrder - TotalGroup) + 1;
        let dataUOMTime = {};
        let dataTax = {};
        if (data?.['sale_information']?.['default_uom']?.['id']) {
            dataUOMTime = data?.['sale_information']?.['default_uom'];
        }
        if (data?.['sale_information']?.['tax_code']?.['id']) {
            dataTax = data?.['sale_information']?.['tax_code'];
        }
        let dataAdd = {
            "order": order,
            "product_id": data?.['id'],
            "product_data": data,
            "uom_time_id": dataUOMTime?.['id'],
            "uom_time_data": dataUOMTime,
            "tax_id": dataTax?.['id'],
            "tax_data": dataTax,


            "product_quantity": 0,
            "product_quantity_time": 0,
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
        let newRow = LeaseOrderDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
        // check disable
        LeaseOrderDataTableHandle.$tableProduct.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
        // check config for new row
        LeaseOrderCheckConfigHandle.checkConfig(1, newRow);
        // load default price
        let itemEle = newRow.querySelector('.table-row-item');
        let priceEle = newRow.querySelector('.table-row-price');
        let lastPrice = LeaseOrderLoadDataHandle.loadPriceProduct(itemEle);
        $(priceEle).attr('value', String(lastPrice));
        LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
        $.fn.initMaskMoney2();

        return true;
    };

    static loadDataOffsetSelect(ele) {
        if (ele.val()) {
            let productData = SelectDDControl.get_data_from_idx(ele, ele.val());
            if (productData) {
                let data = productData;
                data['unit_of_measure'] = data?.['sale_information']?.['default_uom'];
                data['uom_group'] = data?.['general_information']?.['uom_group'];
                let uomEle = ele[0].closest('tr').querySelector('.table-row-uom');
                if (uomEle && data?.['unit_of_measure'] && data?.['uom_group']) {
                    $(uomEle).empty();
                    LeaseOrderLoadDataHandle.loadInitS2($(uomEle), [data?.['unit_of_measure']], {'group': data?.['uom_group']?.['id']});
                } else {
                    LeaseOrderLoadDataHandle.loadInitS2($(uomEle));
                }
            }
        }
        return true;
    };

    static loadOffset(ele) {
        let eleChecked = LeaseOrderDataTableHandle.$tableSOffset[0].querySelector('.table-row-checkbox:checked:not([disabled])');
        if (eleChecked) {
            let row = eleChecked.closest('tr');
            let rowIndex = LeaseOrderDataTableHandle.$tableSOffset.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableSOffset.DataTable().row(rowIndex);
            let dataRow = $row.data();

            let target = LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${$(ele).attr('data-product-id')}"]`);
            if (target) {
                let rowTarget = target.closest('tr');
                if (rowTarget) {
                    let eleOffset = rowTarget.querySelector('.table-row-offset');
                    let eleOffsetShow = rowTarget.querySelector('.table-row-offset-show');
                    if (eleOffset && eleOffsetShow) {
                        $(eleOffset).attr('data-offset-id', dataRow?.['id']);
                        LeaseOrderLoadDataHandle.loadInitS2($(eleOffset), [dataRow]);
                        eleOffsetShow.innerHTML = dataRow?.['title'];
                        LeaseOrderLoadDataHandle.loadDataOffsetSelect($(eleOffset));
                    }
                }
            }
        }
        return true;
    };

    static loadQuantity(ele) {
        let newEle = LeaseOrderLoadDataHandle.$quantityModal[0].querySelector('.quantity-new');
        let leasedEle = LeaseOrderLoadDataHandle.$quantityModal[0].querySelector('.quantity-leased');
        if (newEle && leasedEle) {
            if (newEle.value) {
                let quantityNew = parseFloat(newEle.value);
                let quantityLeased = 0;
                LeaseOrderDataTableHandle.$tableSLeasedProduct.DataTable().rows().every(function () {
                    let SLeasedRow = this.node();
                    let checkEle = SLeasedRow.querySelector('.table-row-checkbox');
                    if (checkEle.checked === true) {
                        quantityLeased++;
                    }
                });
                let quantity = quantityNew + quantityLeased;
                let target = LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${$(ele).attr('data-product-id')}"]`);
                if (target) {
                    let row = target.closest('tr');
                    if (row) {
                        let quantityEle = row.querySelector('.table-row-quantity');
                        let quantityNewEle = row.querySelector('.table-row-quantity-new');
                        let quantityLeasedEle = row.querySelector('.table-row-quantity-leased');
                        let quantityLeasedDataEle = row.querySelector('.table-row-quantity-leased-data');
                        if (quantityEle && quantityNewEle && quantityLeasedEle && quantityLeasedDataEle) {
                            $(quantityEle).val(quantity);
                            $(quantityEle).trigger('change');
                            $(quantityNewEle).val(quantityNew);
                            $(quantityLeasedEle).val(quantityLeased);
                            let leasedData = [];
                            for (let checkedEle of LeaseOrderDataTableHandle.$tableSLeasedProduct[0].querySelectorAll('.table-row-checkbox:checked')) {
                                let row = checkedEle.closest('tr');
                                if (row) {
                                    let rowIndex = LeaseOrderDataTableHandle.$tableSLeasedProduct.DataTable().row(row).index();
                                    let $row = LeaseOrderDataTableHandle.$tableSLeasedProduct.DataTable().row(rowIndex);
                                    let rowData = $row.data();
                                    leasedData.push({'product_id': rowData?.['id'], 'product_data': rowData});
                                }
                            }
                            $(quantityLeasedDataEle).val(JSON.stringify(leasedData));
                        }
                    }
                }
            }
        }
        return true;
    };

    static loadPriceProduct(eleProduct) {
        let dataZone = "lease_products_data";
        if ($(eleProduct).val()) {
            let productData = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
            let is_change_price = false;
            let row = eleProduct.closest('tr');
            if (productData && row) {
                let data = productData;
                let priceGr = row.querySelector('.input-group-price');
                let price = row.querySelector('.table-row-price');
                let modalBody = LeaseOrderLoadDataHandle.$priceModal[0].querySelector('.modal-body');
                // load PRICE
                if (priceGr && price && modalBody) {
                    let account_price_id = null;
                    let dataAcc = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.customerSelectEle, LeaseOrderLoadDataHandle.customerSelectEle.val());
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
                    LeaseOrderLoadDataHandle.loadEventRadio(LeaseOrderLoadDataHandle.$priceModal);
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
            let tableCostWrapper = document.getElementById('datable-quotation-create-cost_wrapper');
            if (tableCostWrapper) {
                let tableCostFt = tableCostWrapper.querySelector('.dataTables_scrollFoot');
                if (tableCostFt) {
                    pretax = tableCostFt.querySelector('.quotation-create-cost-pretax-amount');
                    tax = tableCostFt.querySelector('.quotation-create-cost-taxes');
                    total = tableCostFt.querySelector('.quotation-create-cost-total');
                    pretaxRaw = tableCostFt.querySelector('.quotation-create-cost-pretax-amount-raw');
                    taxRaw = tableCostFt.querySelector('.quotation-create-cost-taxes-raw');
                    totalRaw = tableCostFt.querySelector('.quotation-create-cost-total-raw');
                }
            }
        } else if (is_expense === true) {
            let tableExpenseWrapper = document.getElementById('datable-quotation-create-expense_wrapper');
            if (tableExpenseWrapper) {
                let tableExpenseFt = tableExpenseWrapper.querySelector('.dataTables_scrollFoot');
                if (tableExpenseFt) {
                    pretax = tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount');
                    tax = tableExpenseFt.querySelector('.quotation-create-expense-taxes');
                    total = tableExpenseFt.querySelector('.quotation-create-expense-total');
                    pretaxRaw = tableExpenseFt.querySelector('.quotation-create-expense-pretax-amount-raw');
                    taxRaw = tableExpenseFt.querySelector('.quotation-create-expense-taxes-raw');
                    totalRaw = tableExpenseFt.querySelector('.quotation-create-expense-total-raw');
                }
            }
        }
        if (pretax && pretaxRaw && tax && taxRaw && total && totalRaw) {
            // pretax
            if (is_product === true) {
                $(pretax).attr('data-init-money', String(data?.['total_product_pretax_amount']));
                pretaxRaw.value = data?.['total_product_pretax_amount']
            } else if (is_cost === true) {
                $(pretax).attr('data-init-money', String(data?.['total_cost_pretax_amount']));
                pretaxRaw.value = data?.['total_cost_pretax_amount']
            } else if (is_expense === true) {
                $(pretax).attr('data-init-money', String(data?.['total_expense_pretax_amount']));
                pretaxRaw.value = data?.['total_expense_pretax_amount']
            }
            // discount
            if (discount && discountRaw && discountRate) {
                $(discount).attr('data-init-money', String(data?.['total_product_discount']));
                discountRaw.value = data?.['total_product_discount'];
                discountRate.value = data?.['total_product_discount_rate'];
                discountRateCopy.value = data?.['total_product_discount_rate'];
            }
            // tax
            if (is_product === true) {
                $(tax).attr('data-init-money', String(data?.['total_product_tax']));
                taxRaw.value = data?.['total_product_tax']
            } else if (is_cost === true) {
                $(tax).attr('data-init-money', String(data?.['total_cost_tax']));
                taxRaw.value = data?.['total_cost_tax']
            } else if (is_expense === true) {
                $(tax).attr('data-init-money', String(data?.['total_expense_tax']));
                taxRaw.value = data?.['total_expense_tax']
            }
            // total
            if (is_product === true) {
                $(total).attr('data-init-money', String(data?.['total_product']));
                totalRaw.value = data?.['total_product']
            } else if (is_cost === true) {
                $(total).attr('data-init-money', String(data?.['total_cost']));
                totalRaw.value = data?.['total_cost']
            } else if (is_expense === true) {
                $(total).attr('data-init-money', String(data?.['total_expense']));
                totalRaw.value = data?.['total_expense']
            }
            // load total revenue before tax for tab product
            if (finalRevenueBeforeTax) {
                finalRevenueBeforeTax.value = data?.['total_product_revenue_before_tax'];
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
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['lease_products_data']) {
                        tableData = dataDetail?.['lease_products_data'];
                    }
                }
            }
        } else {
            LeaseOrderDataTableHandle.$tableProduct.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(row).index();
                let $row = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(rowIndex);
                let dataRow = $row.data();

                let eleProduct = row.querySelector('.table-row-item');
                tableData.push(dataRow);
                // setup price
                if (eleProduct) {
                    if (dataRow?.['order'] && dataRow?.['product_unit_price']) {
                        if (!dataPriceJSON.hasOwnProperty(dataRow?.['order'])) {
                            dataPriceJSON[dataRow?.['order']] = dataRow?.['product_unit_price'];
                        }
                    }
                }
            });

            if (tableData.length === 0 && LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let eleDetail = $('#quotation-detail-data');
                if (eleDetail && eleDetail.length > 0) {
                    if (eleDetail.val()) {
                        dataDetail = JSON.parse(eleDetail.val());
                        if (dataDetail?.['lease_products_data']) {
                            tableData = dataDetail?.['lease_products_data'];
                        }
                    }
                }
            }
        }
        LeaseOrderDataTableHandle.$tableProduct.DataTable().destroy();
        LeaseOrderDataTableHandle.dataTableProduct();
        LeaseOrderDataTableHandle.$tableProduct.DataTable().rows.add(tableData).draw();
        // load dropdowns
        LeaseOrderLoadDataHandle.loadDropDowns(LeaseOrderDataTableHandle.$tableProduct);
        // load price
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            LeaseOrderLoadDataHandle.loadReInitPrice(dataPriceJSON);
        }
        LeaseOrderDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let eleGroup = row.querySelector('.table-row-group');
            let eleProduct = row.querySelector('.table-row-item');
            let eleAssetType = row.querySelector('.table-row-asset-type');
            let btnSOffset = row.querySelector('.btn-select-offset');
            let btnSQuantity = row.querySelector('.btn-select-quantity');
            let eleShipping = row.querySelector('.table-row-shipping');
            let elePromotion = row.querySelector('.table-row-promotion');

            LeaseOrderCheckConfigHandle.checkConfig(1, row);

            let rowIndex = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(rowIndex);
            let dataRow = $row.data();

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
                LeaseOrderLoadDataHandle.loadPriceProduct(eleProduct);
                let dataGroup = dataRow?.['group_order'];
                if (dataGroup) {
                    let classGroup = 'group-' + dataGroup;
                    row.classList.add('collapse');
                    row.classList.add(classGroup);
                    row.classList.add('show');
                    row.setAttribute('data-group', dataGroup);
                }
            }
            if (eleAssetType) {
                LeaseOrderLoadDataHandle.loadInitS2($(eleAssetType), LeaseOrderLoadDataHandle.dataAssetType);
                $(eleAssetType).val(dataRow?.['asset_type']).trigger('change');
            }
            if (btnSOffset) {
                $(btnSOffset).on('click', function () {
                    LeaseOrderLoadDataHandle.$btnSaveSelectOffset.attr('data-product-id', dataRow?.['product_data']?.['id']);
                    LeaseOrderLoadDataHandle.loadModalSOffset(btnSOffset);
                });
            }
            if (btnSQuantity) {
                $(btnSQuantity).on('click', function () {
                    LeaseOrderLoadDataHandle.$btnSaveSelectQuantity.attr('data-product-id', dataRow?.['product_data']?.['id']);
                    LeaseOrderLoadDataHandle.loadModalSQuantity(btnSQuantity);
                });
            }
            if (eleShipping) {
                LeaseOrderLoadDataHandle.loadRowDisabled(row);
            }
            if (elePromotion) {
                LeaseOrderLoadDataHandle.loadRowDisabled(row);
            }
        });
        // load disabled if page detail
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            LeaseOrderLoadDataHandle.loadTableDisabled(LeaseOrderDataTableHandle.$tableProduct);
        }
        $.fn.initMaskMoney2();
        // set again WF runtime
        LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitDataTableCost() {
        let tableData = [];
        let dataDetail = {};
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['lease_costs_data']) {
                        tableData = dataDetail?.['lease_costs_data'];
                    }
                }
            }
        } else {
            LeaseOrderDataTableHandle.$tableCost.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = LeaseOrderDataTableHandle.$tableCost.DataTable().row(row).index();
                let $row = LeaseOrderDataTableHandle.$tableCost.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let eleDetail = $('#quotation-detail-data');
                if (eleDetail && eleDetail.length > 0) {
                    if (eleDetail.val()) {
                        dataDetail = JSON.parse(eleDetail.val());
                        if (dataDetail?.['lease_costs_data']) {
                            tableData = dataDetail?.['lease_costs_data'];
                        }
                    }
                }
            }
        }
        LeaseOrderDataTableHandle.$tableCost.DataTable().destroy();
        LeaseOrderDataTableHandle.dataTableCost();
        LeaseOrderDataTableHandle.$tableCost.DataTable().rows.add(tableData).draw();
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            LeaseOrderLoadDataHandle.loadTableDisabled(LeaseOrderDataTableHandle.$tableCost);
        }
        LeaseOrderLoadDataHandle.loadDropDowns(LeaseOrderDataTableHandle.$tableCost);
        $.fn.initMaskMoney2();
        // set again WF runtime
        LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitDataTableCostLeased() {
        let tableData = [];
        let dataDetail = {};
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['lease_costs_leased_data']) {
                        tableData = dataDetail?.['lease_costs_leased_data'];
                    }
                }
            }
        } else {
            LeaseOrderDataTableHandle.$tableCostLeased.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(row).index();
                let $row = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let eleDetail = $('#quotation-detail-data');
                if (eleDetail && eleDetail.length > 0) {
                    if (eleDetail.val()) {
                        dataDetail = JSON.parse(eleDetail.val());
                        if (dataDetail?.['lease_costs_leased_data']) {
                            tableData = dataDetail?.['lease_costs_leased_data'];
                        }
                    }
                }
            }
        }
        LeaseOrderDataTableHandle.$tableCostLeased.DataTable().destroy();
        LeaseOrderDataTableHandle.dataTableCostLeased();
        LeaseOrderDataTableHandle.$tableCostLeased.DataTable().rows.add(tableData).draw();
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            LeaseOrderLoadDataHandle.loadTableDisabled(LeaseOrderDataTableHandle.$tableCostLeased);
        }
        $.fn.initMaskMoney2();
        // set again WF runtime
        LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitDataTableExpense() {
        let tableData = [];
        let dataDetail = {};
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['lease_expenses_data']) {
                        tableData = dataDetail?.['lease_expenses_data'];
                    }
                }
            }
        } else {
            LeaseOrderDataTableHandle.$tableExpense.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = LeaseOrderDataTableHandle.$tableExpense.DataTable().row(row).index();
                let $row = LeaseOrderDataTableHandle.$tableExpense.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let eleDetail = $('#quotation-detail-data');
                if (eleDetail && eleDetail.length > 0) {
                    if (eleDetail.val()) {
                        dataDetail = JSON.parse(eleDetail.val());
                        if (dataDetail?.['lease_expenses_data']) {
                            tableData = dataDetail?.['lease_expenses_data'];
                        }
                    }
                }
            }
        }
        LeaseOrderDataTableHandle.$tableExpense.DataTable().destroy();
        LeaseOrderDataTableHandle.dataTableExpense();
        LeaseOrderDataTableHandle.$tableExpense.DataTable().rows.add(tableData).draw();
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            LeaseOrderLoadDataHandle.loadTableDisabled(LeaseOrderDataTableHandle.$tableExpense);
        }
        LeaseOrderLoadDataHandle.loadDropDowns(LeaseOrderDataTableHandle.$tableExpense);
        $.fn.initMaskMoney2();
        // set again WF runtime
        LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitDataTablePayment() {
        let tableData = [];
        let dataDetail = {};
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let eleDetail = $('#quotation-detail-data');
            if (eleDetail && eleDetail.length > 0) {
                if (eleDetail.val()) {
                    dataDetail = JSON.parse(eleDetail.val());
                    tableData = dataDetail?.['lease_payment_stage'];
                }
            }
        } else {
            LeaseOrderDataTableHandle.$tablePayment.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = LeaseOrderDataTableHandle.$tablePayment.DataTable().row(row).index();
                let $row = LeaseOrderDataTableHandle.$tablePayment.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let eleDetail = $('#quotation-detail-data');
                if (eleDetail && eleDetail.length > 0) {
                    if (eleDetail.val()) {
                        dataDetail = JSON.parse(eleDetail.val());
                        tableData = dataDetail?.['sale_order_payment_stage'];
                    }
                }
            }
        }
        LeaseOrderDataTableHandle.$tablePayment.DataTable().destroy();
        LeaseOrderDataTableHandle.dataTablePaymentStage();
        LeaseOrderDataTableHandle.$tablePayment.DataTable().rows.add(tableData).draw();
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            LeaseOrderLoadDataHandle.loadTableDisabled(LeaseOrderDataTableHandle.$tablePayment);
        }
        LeaseOrderLoadDataHandle.loadDropDowns(LeaseOrderDataTableHandle.$tablePayment);
        $.fn.initMaskMoney2();
        // set again WF runtime
        LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
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
        if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.paymentSelectEle, LeaseOrderLoadDataHandle.paymentSelectEle.val());
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
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            let $table = $('#datable-quotation-payment-stage');
            let term = [];
            if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.paymentSelectEle, LeaseOrderLoadDataHandle.paymentSelectEle.val());
                if (dataSelected) {
                    term = dataSelected?.['term'];
                    for (let termData of term) {
                        let isNum = parseFloat(termData?.['value']);
                        if (!isNum) {  // balance
                            termData['value'] = String(LeaseOrderLoadDataHandle.loadBalanceValPaymentTerm());
                        }
                    }
                }
            }
            $table.DataTable().rows().every(function () {
                let row = this.node();
                let eleInstallment = row.querySelector('.table-row-installment');
                if (eleInstallment) {
                    eleInstallment.removeAttribute('disabled');
                    LeaseOrderLoadDataHandle.loadInitS2($(eleInstallment), term, {}, null, true);
                    $(eleInstallment).val('').trigger('change');
                }
            });
        }
    };

    // TABLE PAYMENT STAGE
    static loadAddPaymentStage() {
        let order = LeaseOrderDataTableHandle.$tablePayment[0].querySelectorAll('.table-row-order').length + 1;
        let dataAdd = {
            'order': order,
            'payment_ratio': 0,
            'value_before_tax': 0,
            'is_ar_invoice': false,
        };
        LeaseOrderDataTableHandle.$tablePayment.DataTable().row.add(dataAdd).draw().node();
        // mask money
        $.fn.initMaskMoney2();
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
                eleDateType.innerHTML = dataDateType[dataSelected?.['after']][1];
                eleRatio.setAttribute('readonly', 'true');
                if (dataSelected?.['value']) {
                    eleRatio.value = parseFloat(dataSelected?.['value']);
                }
                LeaseOrderLoadDataHandle.loadPSValueBeforeTax(eleValueBT, dataSelected?.['value']);
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
                if (["post", "put"].includes(LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    eleRatio.removeAttribute('readonly');
                    eleDueDate.removeAttribute('disabled');
                }
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
            let issueTarget = $(ele).val();
            let eleValueATFocus = rowFocus.querySelector('.table-row-value-after-tax');
            if (eleValueATFocus) {

                if (!issueTarget) {
                    $(eleValueATFocus).attr('hidden', 'true');
                    $(eleValueATFocus).attr('value', String(0));
                    // mask money
                    $.fn.initMaskMoney2();
                    let issueTarget = parseInt($(ele).val());
                    LeaseOrderDataTableHandle.$tablePayment.DataTable().rows().every(function () {
                        let row = this.node();
                        let eleIssueInvoice = row.querySelector('.table-row-issue-invoice');
                        if (eleIssueInvoice) {
                            if (eleIssueInvoice !== ele) {
                                if ($(eleIssueInvoice).val()) {
                                    let issue = parseInt($(eleIssueInvoice).val());
                                    // check other different issue -> trigger change
                                    if (issue !== issueTarget) {
                                        $(eleIssueInvoice).trigger('change');
                                    }
                                }
                            }
                        }
                    });
                    return true;
                }
                if (issueTarget) {
                    let countInvoiceIssue = 0;
                    let countInvoiceVal0 = 0;
                    LeaseOrderDataTableHandle.$tablePayment.DataTable().rows().every(function () {
                        let row = this.node();
                        let invoiceIssueEle = row.querySelector('.table-row-issue-invoice');
                        let invoiceValueEle = row.querySelector('.table-row-value-after-tax');
                        if (invoiceIssueEle && invoiceValueEle) {
                            let issue = $(invoiceIssueEle).val();
                            let value = $(invoiceValueEle).valCurrency();
                            if (issue === issueTarget) {
                                countInvoiceIssue++;
                                if (value === 0) {
                                    $(invoiceValueEle).attr('hidden', 'true');
                                    countInvoiceVal0++;
                                }
                                if (value !== 0) {
                                    $(invoiceValueEle).removeAttr('hidden');
                                }
                            }
                        }
                    });
                    if (countInvoiceIssue === 1) {
                        $(eleValueATFocus).removeAttr('hidden');
                    }
                    if (countInvoiceIssue > 1) {
                        if (countInvoiceIssue === countInvoiceVal0) {
                            $(ele).val("").trigger('change');
                            $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-invalid')}, 'failure');
                            return false;
                        }
                    }
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
                LeaseOrderLoadDataHandle.loadPSValueBeforeTax(eleValueBT, $(eleRatio).val());
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
            let rowIndex = LeaseOrderDataTableHandle.$tableCost.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableCost.DataTable().row(rowIndex);
            let dataRow = $row.data();

            if (dataRow?.['product_data']?.['id']) {
                if (!storeCost.hasOwnProperty(dataRow?.['product_data']?.['id'])) {
                    storeCost[dataRow?.['product_data']?.['id']] = dataRow;
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
            let isHidden = false;
            let dataZone = "lease_products_data";
            let zoneHiddenData = WFRTControl.getZoneHiddenData();
            for (let zoneHidden of zoneHiddenData) {
                if (zoneHidden?.['code'] === dataZone) {
                    isHidden = true;
                    break;
                }
            }
            if (isHidden === true) {  // product is zone hidden
                let storeDetail = JSON.parse(LeaseOrderLoadDataHandle.$eleStoreDetail.val());
                for (let data of storeDetail?.[dataZone]) {
                    let valueQuantity = 0;
                    let valueQuantityTime = 0;
                    let valueTaxAmount = 0;
                    let valueSubtotal = 0;
                    let dataProduct = {};
                    let dataUOM = {};
                    let dataUOMTime = {};
                    let dataTax = {};
                    if (data?.['product_data']?.['id']) { // PRODUCT
                        dataProduct = data?.['product_data'] ? data?.['product_data'] : {};
                        dataUOM = data?.['uom_data'] ? data?.['uom_data'] : {};
                        valueQuantity = data?.['product_quantity_new'] ? data?.['product_quantity_new'] : 0;
                        dataUOMTime = data?.['uom_time_data'] ? data?.['uom_time_data'] : {};
                        valueQuantityTime = data?.['product_quantity_time'] ? data?.['product_quantity_time'] : 0;
                        dataTax = data?.['tax_data'] ? data?.['tax_data'] : {};
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_id": dataProduct?.['id'],
                            "product_data": dataProduct,
                            "uom_id": dataUOM?.['id'],
                            "uom_data": dataUOM,
                            "uom_time_id": dataUOMTime?.['id'],
                            "uom_time_data": dataUOMTime,
                            "tax_id": dataTax?.['id'],
                            "tax_data": dataTax,
                            "product_quantity": valueQuantity,
                            "product_quantity_time": valueQuantityTime,
                            "product_uom_code": "",
                            "product_tax_title": "",
                            "product_tax_value": 0,
                            "product_uom_title": "",
                            "product_cost_price": 0,
                            "product_tax_amount": valueTaxAmount,
                            "product_subtotal_price": valueSubtotal,
                        }
                        if (storeCost.hasOwnProperty(dataAdd?.['product_data']?.['id'])) {
                            dataAdd = storeCost[dataAdd?.['product_data']?.['id']];
                            dataAdd['product_quantity'] = valueQuantity;
                            dataAdd['product_quantity_time'] = valueQuantityTime;
                            dataAdd['uom_id'] = dataUOM?.['id'];
                            dataAdd['uom_data'] = dataUOM;
                        }
                        if (valueQuantity > 0) {
                            $table.DataTable().row.add(dataAdd).draw().node();
                        }
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
                            "uom_id": dataUOM?.['id'],
                            "uom_data": dataUOM,
                            "tax_id": dataTax?.['id'],
                            "tax_data": dataTax,
                        }
                        $table.DataTable().row.add(dataAdd).draw().node();
                    }
                }
            } else {  // product is not zone hidden
                $tableProduct.DataTable().rows().every(function () {
                    let row = this.node();
                    let valueTaxAmount = 0;
                    let valueSubtotal = 0;
                    let dataProduct = {};
                    let dataUOM = {};
                    let valueQuantity = 0;
                    let dataUOMTime = {};
                    let valueQuantityTime = 0;
                    let dataTax = {};
                    let itemEle = row.querySelector('.table-row-item');
                    let uomEle = row.querySelector('.table-row-uom');
                    let quantityEle = row.querySelector('.table-row-quantity-new');
                    let uomTimeEle = row.querySelector('.table-row-uom-time');
                    let quantityTimeEle = row.querySelector('.table-row-quantity-time');
                    let taxEle = row.querySelector('.table-row-tax');
                    let shipping = row.querySelector('.table-row-shipping');
                    //
                    if (itemEle) { // PRODUCT
                        if ($(itemEle).val()) {
                            dataProduct = SelectDDControl.get_data_from_idx($(itemEle), $(itemEle).val());
                        }
                        if (uomEle) {
                            if ($(uomEle).val()) {
                                dataUOM = SelectDDControl.get_data_from_idx($(uomEle), $(uomEle).val());
                            }
                        }
                        if (quantityEle) {
                            if ($(quantityEle).val()) {
                                valueQuantity = parseFloat($(quantityEle).val());
                            }
                        }
                        if (uomTimeEle) {
                            if ($(uomTimeEle).val()) {
                                dataUOMTime = SelectDDControl.get_data_from_idx($(uomTimeEle), $(uomTimeEle).val());
                            }
                        }
                        if (quantityTimeEle) {
                            if ($(quantityTimeEle).val()) {
                                valueQuantityTime = parseFloat($(quantityTimeEle).val());
                            }
                        }
                        if (taxEle) {
                            if ($(taxEle).val()) {
                                dataTax = SelectDDControl.get_data_from_idx($(taxEle), $(taxEle).val());
                            }
                        }
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_id": dataProduct?.['id'],
                            "product_data": dataProduct,
                            "uom_id": dataUOM?.['id'],
                            "uom_data": dataUOM,
                            "uom_time_id": dataUOMTime?.['id'],
                            "uom_time_data": dataUOMTime,
                            "tax_id": dataTax?.['id'],
                            "tax_data": dataTax,
                            "product_quantity": valueQuantity,
                            "product_quantity_time": valueQuantityTime,
                            "product_uom_code": "",
                            "product_tax_title": "",
                            "product_tax_value": 0,
                            "product_uom_title": "",
                            "product_cost_price": 0,
                            "product_tax_amount": valueTaxAmount,
                            "product_subtotal_price": valueSubtotal,
                        }
                        if (storeCost.hasOwnProperty(dataAdd?.['product_data']?.['id'])) {
                            dataAdd = storeCost[dataAdd?.['product_data']?.['id']];
                            dataAdd['product_quantity'] = valueQuantity;
                            dataAdd['product_quantity_time'] = valueQuantityTime;
                            dataAdd['uom_id'] = dataUOM?.['id'];
                            dataAdd['uom_data'] = dataUOM;
                        }
                        if (valueQuantity > 0) {
                            $table.DataTable().row.add(dataAdd).draw().node();
                        }
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
                                "uom_id": dataUOM?.['id'],
                                "uom_data": dataUOM,
                                "tax_id": dataTax?.['id'],
                                "tax_data": dataTax,
                            }
                            $table.DataTable().row.add(dataAdd).draw().node();
                        }
                    }
                })
            }
            LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
        }
        return true;
    };

    static loadDataTableCostLeased() {
        let $tableLeased = $('#datable-quotation-create-cost-leased');
        let $tableProduct = $('#datable-quotation-create-product');
        // store old cost
        let storeCost = {};
        $tableLeased.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(rowIndex);
            let dataRow = $row.data();

            if (dataRow?.['product_data']?.['id']) {
                if (!storeCost.hasOwnProperty(dataRow?.['product_data']?.['id'])) {
                    storeCost[dataRow?.['product_data']?.['id']] = dataRow;
                }
            }
        });
        // clear table
        $tableLeased.DataTable().clear().draw();
        // copy data table product to table cost
        if ($tableLeased.DataTable().data().count() === 0) {  // if dataTable empty then add init
            let valueOrder = 0;
            // check if product is hidden zone (page update)
            let isHidden = false;
            let dataZone = "lease_products_data";
            let zoneHiddenData = WFRTControl.getZoneHiddenData();
            for (let zoneHidden of zoneHiddenData) {
                if (zoneHidden?.['code'] === dataZone) {
                    isHidden = true;
                    break;
                }
            }
            if (isHidden === true) {  // product is zone hidden => use data product from data detail
                let storeDetail = JSON.parse(LeaseOrderLoadDataHandle.$eleStoreDetail.val());
                for (let data of storeDetail?.[dataZone]) {
                    let valueQuantityTime = 0;
                    let valueSubtotal = 0;
                    let dataProduct = {};
                    let dataUOMTime = {};
                    let dataParseList = data?.['product_quantity_leased_data'];
                    for (let dataParse of dataParseList) {
                        dataProduct = dataParse?.['product_data'];
                        valueOrder++;
                        let dataAdd = {
                            "order": valueOrder,
                            "product_id": dataProduct?.['id'],
                            "product_data": dataProduct,
                            "product_quantity_time": valueQuantityTime,
                            "uom_time_id": dataUOMTime?.['id'],
                            "uom_time_data": dataUOMTime,
                            "product_depreciation_time": dataProduct?.['depreciation_time'] ? dataProduct?.['depreciation_time'] : 0,
                            "product_subtotal_price": valueSubtotal,
                        }
                        if (storeCost.hasOwnProperty(dataAdd?.['product_data']?.['id'])) {
                            dataAdd = storeCost[dataAdd?.['product_data']?.['id']];
                            dataAdd['product_quantity_time'] = valueQuantityTime;
                        }
                        $tableLeased.DataTable().row.add(dataAdd).draw().node();
                    }
                }
            } else {  // product is not zone hidden => use realtime data product from $tableProduct
                $tableProduct.DataTable().rows().every(function () {
                    let row = this.node();
                    let valueSubtotal = 0;
                    let dataProduct = {};
                    let dataUOMTime = {};
                    let valueQuantityTime = 0;
                    let quantityTimeEle = row.querySelector('.table-row-quantity-time');
                    let uomTimeEle = row.querySelector('.table-row-uom-time');
                    //
                    if (quantityTimeEle) {
                        if ($(quantityTimeEle).val()) {
                            valueQuantityTime = parseFloat($(quantityTimeEle).val());
                        }
                    }
                    if (uomTimeEle) {
                        if ($(uomTimeEle).val()) {
                            dataUOMTime = SelectDDControl.get_data_from_idx($(uomTimeEle), $(uomTimeEle).val());
                        }
                    }
                    let quantityLeasedDataEle = row.querySelector('.table-row-quantity-leased-data');
                    if (quantityLeasedDataEle) {
                        if ($(quantityLeasedDataEle).val()) {
                            let dataParseList = JSON.parse($(quantityLeasedDataEle).val());
                            for (let dataParse of dataParseList) {
                                dataProduct = dataParse?.['product_data'];
                                valueOrder++;
                                let dataAdd = {
                                    "order": valueOrder,
                                    "product_id": dataProduct?.['id'],
                                    "product_data": dataProduct,
                                    "product_quantity_time": valueQuantityTime,
                                    "uom_time_id": dataUOMTime?.['id'],
                                    "uom_time_data": dataUOMTime,
                                    "product_depreciation_time": dataProduct?.['depreciation_time'] ? dataProduct?.['depreciation_time'] : 0,
                                    "product_subtotal_price": valueSubtotal,
                                }
                                if (storeCost.hasOwnProperty(dataAdd?.['product_data']?.['id'])) {
                                    dataAdd = storeCost[dataAdd?.['product_data']?.['id']];
                                    dataAdd['product_quantity_time'] = valueQuantityTime;
                                }
                                $tableLeased.DataTable().row.add(dataAdd).draw().node();
                            }
                        }
                    }
                })
            }
            LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
        }
        return true;
    };

    static loadCostProduct(eleProduct) {
        // wh cost > bom cost > standard cost
        let productData = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
        if (productData) {
            if (productData?.['id']) {
                // call ajax check BOM
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': LeaseOrderLoadDataHandle.urlEle.attr('data-md-bom'),
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
                                        LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
                                        $.fn.initMaskMoney2();
                                        if (btnSCost) {
                                            // btnSCost.setAttribute('disabled', 'true');
                                        }
                                    }
                                }
                                LeaseOrderLoadDataHandle.loadCostWHProduct(eleProduct, {
                                    'costBom': costBom,
                                    'costStandard': costStandard
                                });
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
        let $form = $('#frm_lease_create');
        let dataZone = "lease_costs_data";
        if (productData && row) {
            let priceGr = row.querySelector('.input-group-price');
            let modalBody = LeaseOrderLoadDataHandle.$costModal[0].querySelector('.modal-body');
            // load PRICE
            if (priceGr && modalBody && productData?.['id']) {
                let urlDetail = LeaseOrderLoadDataHandle.urlEle.attr('data-md-product-detail').format_url_with_uuid(productData?.['id']);
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
                                    htmlCostList += `<p>${LeaseOrderLoadDataHandle.transEle.attr('data-product-no-cost')}</p>`;
                                }
                                htmlCostList += `<hr>`;
                                htmlCostList += `<div class="d-flex justify-content-between">
                                                    <div class="form-check form-check-lg">
                                                        <input type="radio" name="row-price-option" class="form-check-input table-row-price-option" id="cost-bom-${dataDetail?.['id'].replace(/-/g, "")}" data-value="${parseFloat(costBomStandardData?.['costBom'])}" data-wh="${JSON.stringify({'id': 'bom'}).replace(/"/g, "&quot;")}" data-zone="${dataZone}" ${checkedBom}>
                                                        <label class="form-check-label" for="cost-bom-${dataDetail?.['id'].replace(/-/g, "")}">${LeaseOrderLoadDataHandle.transEle.attr('data-cost-bom')}</label>
                                                    </div>
                                                    <span class="mask-money" data-init-money="${parseFloat(costBomStandardData?.['costBom'])}"></span>
                                                </div>`;
                                htmlCostList += `<div class="d-flex justify-content-between">
                                                    <div class="form-check form-check-lg">
                                                        <input type="radio" name="row-price-option" class="form-check-input table-row-price-option" id="cost-standard-${dataDetail?.['id'].replace(/-/g, "")}" data-value="${parseFloat(costBomStandardData?.['costStandard'])}" data-wh="${JSON.stringify({'id': 'standard'}).replace(/"/g, "&quot;")}" data-zone="${dataZone}" ${checkedStandard}>
                                                        <label class="form-check-label" for="cost-standard-${dataDetail?.['id'].replace(/-/g, "")}">${LeaseOrderLoadDataHandle.transEle.attr('data-cost-standard')}</label>
                                                    </div>
                                                    <span class="mask-money" data-init-money="${parseFloat(costBomStandardData?.['costStandard'])}"></span>
                                                </div>`;
                                $(modalBody).append(`${htmlCostList}`);
                            }
                            LeaseOrderLoadDataHandle.loadEventRadio(LeaseOrderLoadDataHandle.$costModal);
                            $.fn.initMaskMoney2();
                            LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
                        }
                    }
                )
            }
        }
    };




    // DEPRECIATION
    static loadShowDepreciation(ele) {
        let row = ele.closest('tr');
        if (row) {
            let productEle = row.querySelector('.table-row-item');
            if (productEle) {
                if ($(productEle).val()) {
                    let dataProduct = SelectDDControl.get_data_from_idx($(productEle), $(productEle).val());
                    if (dataProduct) {
                        LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-product-id', dataProduct?.['id']);
                    }
                }
            }


            let depreciationMethodEle = row.querySelector('.table-row-depreciation-method');
            let $methodEle = $('#depreciation_method');
            if (depreciationMethodEle && $methodEle.length > 0) {
                $methodEle.removeAttr('readonly');
                LeaseOrderLoadDataHandle.loadInitS2($methodEle, LeaseOrderLoadDataHandle.dataDepreciationMethod, {}, LeaseOrderLoadDataHandle.$depreciationModal);
                if ($(depreciationMethodEle).val()) {
                    $methodEle.val(parseInt($(depreciationMethodEle).val())).trigger('change');
                }
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-net-value') {
                    $methodEle.attr('readonly', 'true');
                }
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-fn-cost') {
                    $methodEle.attr('readonly', 'true');
                }
            }
            let depreciationAdjustEle = row.querySelector('.table-row-depreciation-adjustment');
            let $adjustEle = $('#depreciation_adjustment');
            if (depreciationAdjustEle && $adjustEle.length > 0) {
                if ($(depreciationAdjustEle).val()) {
                    $adjustEle.val(parseFloat($(depreciationAdjustEle).val()));
                }
            }
            let depreciationTimeEle = row.querySelector('.table-row-depreciation-time');
            let $timeEle = $('#depreciation_time');
            if (depreciationTimeEle && $timeEle.length > 0) {
                if ($(depreciationTimeEle).val()) {
                    $timeEle.val(parseFloat($(depreciationTimeEle).val()));
                }
            }
            let priceEle = row.querySelector('.table-row-price');
            let quantityEle = row.querySelector('.table-row-quantity');
            let netValueEle = row.querySelector('.table-row-net-value');
            let $priceEle = $('#cost_price');
            if ($priceEle.length > 0) {
                $($priceEle).attr('value', String(0));
                if (priceEle && quantityEle) {
                    if ($(priceEle).valCurrency() && $(quantityEle).val()) {
                        let total = parseFloat($(priceEle).valCurrency()) * parseFloat($(quantityEle).val());
                        $($priceEle).attr('value', String(total));
                    }
                }
                if (netValueEle) {
                    if ($(netValueEle).attr('data-init-money')) {
                        let total = parseFloat($(netValueEle).attr('data-init-money'));
                        $($priceEle).attr('value', String(total));
                    }
                }
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-net-value') {
                    let originCostEle = row.querySelector('.table-row-origin-cost');
                    if (originCostEle) {
                        if ($(originCostEle).attr('data-init-money')) {
                            let total = parseFloat($(originCostEle).attr('data-init-money'));
                            $($priceEle).attr('value', String(total));
                        }
                    }
                }
                // mask money
                $.fn.initMaskMoney2();
            }
            let uomTimeEle = row.querySelector('.table-row-uom-time');
            let $uomEle = $('#depreciation_uom');
            if (uomTimeEle && $uomEle.length > 0) {
                let dataUOMTime = SelectDDControl.get_data_from_idx($(uomTimeEle), $(uomTimeEle).val());
                if (dataUOMTime) {
                    $uomEle[0].innerHTML = dataUOMTime?.['title'];
                }
            }
            let depreciationStartDateEle = row.querySelector('.table-row-depreciation-start-date');
            let $startDateEle = $('#depreciation_start_date');
            if (depreciationStartDateEle && $startDateEle.length > 0) {
                $startDateEle.val("").trigger('change');
                $startDateEle.removeAttr('disabled');
                if ($(depreciationStartDateEle).val()) {
                    $startDateEle.val(moment($(depreciationStartDateEle).val()).format('DD/MM/YYYY'));
                }
                if (!$startDateEle.val()) {
                    $startDateEle.val(DateTimeControl.getCurrentDate("DMY", "/"));
                }
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-net-value') {
                    let rowIndex = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(row).index();
                    let $row = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(rowIndex);
                    let rowData = $row.data();
                    if (rowData?.['product_data']?.['depreciation_start_date']) {
                        $startDateEle.val(moment(rowData?.['product_data']?.['depreciation_start_date']).format('DD/MM/YYYY'));
                        $startDateEle.attr('disabled', 'true');
                    }
                }
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-fn-cost') {
                    let rowIndex = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(row).index();
                    let $row = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(rowIndex);
                    let rowData = $row.data();
                    if (rowData?.['product_data']?.['depreciation_start_date']) {
                        $startDateEle.val(moment(rowData?.['product_data']?.['depreciation_start_date']).format('DD/MM/YYYY'));
                        $startDateEle.attr('disabled', 'true');
                    }
                }
            }
            let depreciationEndDateEle = row.querySelector('.table-row-depreciation-end-date');
            let $endDateEle = $('#depreciation_end_date');
            if (depreciationEndDateEle && $endDateEle.length > 0) {
                $endDateEle.val("").trigger('change');
                $endDateEle.removeAttr('disabled');
                if ($(depreciationEndDateEle).val()) {
                    $endDateEle.val(moment($(depreciationEndDateEle).val()).format('DD/MM/YYYY'));
                }
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-net-value') {
                    let rowIndex = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(row).index();
                    let $row = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(rowIndex);
                    let rowData = $row.data();
                    if (rowData?.['product_data']?.['depreciation_end_date']) {
                        $endDateEle.val(DateTimeControl.getCurrentDate("DMY", "/"));
                        $endDateEle.attr('disabled', 'true');
                    }
                }
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-fn-cost') {
                    let rowIndex = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(row).index();
                    let $row = LeaseOrderDataTableHandle.$tableCostLeased.DataTable().row(rowIndex);
                    let rowData = $row.data();
                    if (rowData?.['product_data']?.['depreciation_start_date']) {
                        $endDateEle.val(moment(rowData?.['product_data']?.['depreciation_end_date']).format('DD/MM/YYYY'));
                        $endDateEle.attr('disabled', 'true');
                    }
                }
            }
            let leaseStartDateEle = row.querySelector('.table-row-lease-start-date');
            let $leaseStartDateEle = $('#lease_start_date');
            if (leaseStartDateEle && $leaseStartDateEle.length > 0) {
                $leaseStartDateEle.val("").trigger('change');
                $leaseStartDateEle.removeAttr('disabled');
                if ($(leaseStartDateEle).val()) {
                    $leaseStartDateEle.val(moment($(leaseStartDateEle).val()).format('DD/MM/YYYY'));
                }
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-net-value') {
                    $leaseStartDateEle.attr('disabled', 'true');
                }
            }
            let leaseEndDateEle = row.querySelector('.table-row-lease-end-date');
            let $leaseEndDateEle = $('#lease_end_date');
            if (leaseEndDateEle && $leaseEndDateEle.length > 0) {
                $leaseEndDateEle.val("").trigger('change');
                $leaseEndDateEle.removeAttr('disabled');
                if ($(leaseEndDateEle).val()) {
                    $leaseEndDateEle.val(moment($(leaseEndDateEle).val()).format('DD/MM/YYYY'));
                }
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-net-value') {
                    $leaseEndDateEle.attr('disabled', 'true');
                }
            }
        }
        LeaseOrderLoadDataHandle.loadDataTableDepreciation();
        return true;
    };

    static loadDataTableDepreciation() {
        let $costEle = $('#cost_price');
        let $timeEle = $('#depreciation_time');
        let $methodEle = $('#depreciation_method');
        let $adjustEle = $('#depreciation_adjustment');

        let $startEle = $('#depreciation_start_date');
        let $endEle = $('#depreciation_end_date');
        let $startLeaseEle = $('#lease_start_date');
        let $endLeaseEle = $('#lease_end_date');

        let $radioSaleEle = $('#depreciation_for_sale');
        let $radioFinanceEle = $('#depreciation_for_finance');
        LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().clear().draw();
        if ($methodEle.length > 0 && $timeEle.length > 0 && $startEle.length > 0 && $endEle.length > 0 && $costEle.length > 0 && $adjustEle.length > 0 && $radioSaleEle.length > 0 && $radioFinanceEle.length > 0) {
            if ($methodEle.val() && $timeEle.val() && $startEle.val() && $endEle.val() && $costEle.valCurrency()) {
                let dataFn = [];
                let dataDepreciation = [];
                if ($radioSaleEle[0].checked === true) {
                    dataDepreciation = LeaseOrderLoadDataHandle.calDepreciationSale(parseInt($methodEle.val()), parseInt($timeEle.val()), $startEle.val(), $endEle.val(), parseFloat($costEle.valCurrency()), parseInt($adjustEle.val()));
                }
                if ($radioFinanceEle[0].checked === true) {
                    dataDepreciation = LeaseOrderLoadDataHandle.calDepreciation(parseInt($methodEle.val()), parseInt($timeEle.val()), $startEle.val(), $endEle.val(), parseFloat($costEle.valCurrency()), parseInt($adjustEle.val()));
                    dataFn = dataDepreciation;
                    if ($startLeaseEle.length > 0 && $endLeaseEle.length > 0) {
                        if ($startLeaseEle.val() && $endLeaseEle.val()) {
                            let matchingRange = LeaseOrderLoadDataHandle.findMatchingRange($startLeaseEle.val(), $endLeaseEle.val(), dataDepreciation);
                            if (matchingRange.length > 0) {
                                let firstData = matchingRange[0];
                                let lastData = matchingRange[matchingRange.length - 1];
                                let accumulativeMonthStart = LeaseOrderLoadDataHandle.getAccumulativeMonth($startLeaseEle.val(), firstData?.['end']);
                                firstData['lease_time'] = $startLeaseEle.val();
                                firstData['lease_allocated'] = firstData['depreciation_value'] * accumulativeMonthStart;
                                firstData['lease_accumulative_allocated'] = firstData['lease_allocated'];
                                let accumulativeMonthEnd = LeaseOrderLoadDataHandle.getAccumulativeMonth(lastData?.['begin'], $endLeaseEle.val());
                                lastData['lease_time'] = lastData?.['begin'];
                                lastData['lease_allocated'] = lastData['depreciation_value'] * accumulativeMonthEnd;
                                // Loop through matchingRange and update lease_allocated and lease_accumulative_allocated
                                for (let i = 1; i < matchingRange.length; i++) {
                                    if (i < (matchingRange.length - 1)) {
                                        matchingRange[i]['lease_allocated'] = matchingRange[i]['depreciation_value'];
                                    }
                                    matchingRange[i]["lease_accumulative_allocated"] = matchingRange[i - 1]["lease_accumulative_allocated"] + matchingRange[i]["lease_allocated"];
                                }

                                let matchingRangeJSON = {};
                                for (let matching of matchingRange) {
                                    matchingRangeJSON[matching?.['month']] = matching;
                                }
                                for (let data of dataFn) {
                                    if (matchingRangeJSON.hasOwnProperty(data?.['month'])) {
                                        data['lease_allocated'] = Math.round(matchingRangeJSON[data?.['month']]?.['lease_allocated']);
                                        data['lease_accumulative_allocated'] = Math.round(matchingRangeJSON[data?.['month']]?.['lease_accumulative_allocated']);
                                    }
                                }
                            }
                        }
                    }
                }

                $('#depreciation_spinner').removeAttr('hidden');
                LeaseOrderDataTableHandle.$tableDepreciationDetail.attr('hidden', 'true');
                setTimeout(function () {
                    $('#depreciation_spinner').attr('hidden', true);
                    LeaseOrderDataTableHandle.$tableDepreciationDetail.removeAttr('hidden');
                }, 300);

                LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().rows.add(dataFn).draw();
            }
        }
        return true;
    };

    static addOneMonth(date_current) {
        const [day, month, year] = date_current.split('/').map(num => parseInt(num));
        const date = new Date(year, month - 1, day);
        date.setMonth(date.getMonth() + 1);
        date.setDate(date.getDate() - 1);

        const newDay = String(date.getDate()).padStart(2, '0');
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newYear = date.getFullYear();

        return `${newDay}/${newMonth}/${newYear}`;
    };

    static addOneDay(date_current) {
        const [day, month, year] = date_current.split('/').map(num => parseInt(num));
        const date = new Date(year, month - 1, day);
        date.setDate(date.getDate() + 1);

        const newDay = String(date.getDate()).padStart(2, '0');
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newYear = date.getFullYear();

        return `${newDay}/${newMonth}/${newYear}`;
    };

    static parseToDateObj(dateStr) {
        const [day, month, year] = dateStr.split('/').map(num => parseInt(num));
        return new Date(year, month - 1, day); // Convert to Date object
    };

    static calculateDaysBetween(startDateObj, endDateObj) {
        let timeDifference = endDateObj - startDateObj;
        return timeDifference / (1000 * 60 * 60 * 24);
    };

    static calDepreciationSale(method, months, start_date, end_date, price, adjust = null) {
        // method: 0: line method || 1: adjust method

        let result = [];
        let totalMonths = months;
        let depreciationValue = Math.round(price / totalMonths); // Khấu hao đều
        let accumulativeValue = 0;

        let currentStartDate = start_date;
        // let currentMonth = parseInt(start_date.split('/')[1]);
        let currentMonth = 1;
        let currentValue = price;

        let endDateObj = LeaseOrderLoadDataHandle.parseToDateObj(end_date);

        while (true) {
            let currentStartDateObj = LeaseOrderLoadDataHandle.parseToDateObj(currentStartDate);

            let currentEndDate = LeaseOrderLoadDataHandle.addOneMonth(currentStartDate);
            let currentEndDateObj = LeaseOrderLoadDataHandle.parseToDateObj(currentEndDate);

            let daysEven = LeaseOrderLoadDataHandle.calculateDaysBetween(currentStartDateObj, currentEndDateObj);

            if (method === 1 && adjust) {
                let depreciationAdjustValue = Math.round(price / totalMonths * adjust); // Khấu hao hệ số
                depreciationValue = depreciationAdjustValue;

                if (result.length > 0) {
                    let last_end_value = 0;
                    let last = result[result.length - 1];
                    last_end_value = last?.['end_value'];
                    let total_accumulative_month = 0;
                    for (let data of result) {
                        total_accumulative_month += data?.['accumulative_month'];
                    }

                    depreciationAdjustValue = Math.round(last_end_value / totalMonths * adjust);  // Khấu hao hệ số
                    // Kiểm tra nếu khấu hao theo hệ số mà lớn hơn khấu hao chia đều số tháng còn lại thì lấy theo khấu hao hệ số còn ngược lại thì lấy theo khấu hao chia đều.
                    let monthsRemain = totalMonths - total_accumulative_month;
                    let depreciationValueCompare = last_end_value / monthsRemain;
                    if (depreciationAdjustValue > depreciationValueCompare) {
                        depreciationValue = depreciationAdjustValue;
                    } else {
                        depreciationValue = depreciationValueCompare;
                    }
                }
            }


            if (currentEndDateObj > endDateObj) {
                if (currentStartDateObj < endDateObj) {
                    let daysOdd = LeaseOrderLoadDataHandle.calculateDaysBetween(currentStartDateObj, endDateObj);
                    depreciationValue = depreciationValue * (daysOdd + 1) / (daysEven + 1)
                    accumulativeValue += depreciationValue;
                    result.push({
                        month: currentMonth.toString(),
                        begin: currentStartDate,
                        end: end_date,
                        accumulative_month: LeaseOrderLoadDataHandle.getAccumulativeMonth(currentStartDate, end_date),
                        start_value: Math.round(currentValue),
                        depreciation_value: Math.round(depreciationValue),
                        accumulative_value: Math.round(accumulativeValue),
                        end_value: Math.round(currentValue - depreciationValue),
                    });
                }
                break;
            } else {
                accumulativeValue += depreciationValue;
                result.push({
                    month: currentMonth.toString(),
                    begin: currentStartDate,
                    end: currentEndDate,
                    accumulative_month: LeaseOrderLoadDataHandle.getAccumulativeMonth(currentStartDate, currentEndDate),
                    start_value: Math.round(currentValue),
                    depreciation_value: Math.round(depreciationValue),
                    accumulative_value: Math.round(accumulativeValue),
                    end_value: Math.round(currentValue - depreciationValue),
                });
            }

            currentStartDate = currentEndDate;
            currentStartDate = LeaseOrderLoadDataHandle.addOneDay(currentStartDate);
            currentMonth++;
            currentValue = Math.round(currentValue - depreciationValue);
        }

        return result;
    };

    static addOneMonthToLast(date_current, alignToEndOfMonth = false) {
        const [day, month, year] = date_current.split('/').map(num => parseInt(num));
        const date = new Date(year, month - 1, day);

        if (alignToEndOfMonth) {
            // Move to the last day of the current month
            date.setMonth(date.getMonth() + 1, 0);
        } else {
            // Move to the same day next month
            date.setMonth(date.getMonth() + 1);
        }

        const newDay = String(date.getDate()).padStart(2, '0');
        const newMonth = String(date.getMonth() + 1).padStart(2, '0');
        const newYear = date.getFullYear();

        return `${newDay}/${newMonth}/${newYear}`;
    };

    static getMonthsDepreciation(start_date, end_date) {
        let months = [];
        let currentDate = start_date;
        let currentDateObj = LeaseOrderLoadDataHandle.parseToDateObj(start_date);
        let endDateObj = LeaseOrderLoadDataHandle.parseToDateObj(end_date);
        while (currentDateObj <= endDateObj) {
            months.push(currentDate);
            currentDate = LeaseOrderLoadDataHandle.addOneMonthToLast(currentDate);
            currentDateObj = LeaseOrderLoadDataHandle.parseToDateObj(currentDate);
        }
        return months.length + 1;
    };

    static getAccumulativeMonth(begin, end) {
        // Convert strings to Date objects
        let [beginDay, beginMonth, beginYear] = begin.split('/').map(Number);
        let [endDay, endMonth, endYear] = end.split('/').map(Number);
        let beginDate = new Date(beginYear, beginMonth - 1, beginDay);
        let endDate = new Date(endYear, endMonth - 1, endDay);
        // Get total days between begin and end
        let totalDaysBetween = (endDate - beginDate) / (1000 * 60 * 60 * 24) + 1;
        // Get total days of the month
        let totalDaysInMonth = new Date(beginYear, beginMonth, 0).getDate();
        // Calculate the fraction
        return totalDaysBetween / totalDaysInMonth;
    };

    static calDepreciation(method, months, start_date, end_date, price, adjust = null) {
        // method: 0: line method || 1: adjust method

        let result = [];
        let totalMonths = months;
        // let totalMonths = LeaseOrderLoadDataHandle.getMonthsDepreciation(start_date, end_date);
        let depreciationValue = Math.round(price / totalMonths); // Khấu hao đều
        let accumulativeValue = 0;

        let currentStartDate = start_date;
        // let currentMonth = parseInt(start_date.split('/')[1]);
        let currentMonth = 1;
        let currentValue = price;

        let endDateObj = LeaseOrderLoadDataHandle.parseToDateObj(end_date);

        while (true) {
            let currentStartDateObj = LeaseOrderLoadDataHandle.parseToDateObj(currentStartDate);

            // Determine the end date for the current range
            let currentEndDate;
            if (result.length === 0) {
                // First range: ends at the last day of the starting month
                currentEndDate = LeaseOrderLoadDataHandle.addOneMonthToLast(currentStartDate, true);
            } else {
                // Other ranges: align to calendar months
                currentStartDate = `01/${String(currentStartDateObj.getMonth() + 1).padStart(2, '0')}/${currentStartDateObj.getFullYear()}`;
                currentEndDate = LeaseOrderLoadDataHandle.addOneMonthToLast(currentStartDate, true);
            }
            let currentEndDateObj = LeaseOrderLoadDataHandle.parseToDateObj(currentEndDate);

            let daysEven = LeaseOrderLoadDataHandle.calculateDaysBetween(currentStartDateObj, currentEndDateObj);

            if (method === 1 && adjust) {
                let depreciationAdjustValue = Math.round(price / totalMonths * adjust); // Khấu hao hệ số
                depreciationValue = depreciationAdjustValue;

                if (result.length > 0) {
                    let last_end_value = 0;
                    let last = result[result.length - 1];
                    last_end_value = last?.['end_value'];
                    let total_accumulative_month = 0;
                    for (let data of result) {
                        total_accumulative_month += data?.['accumulative_month'];
                    }

                    depreciationAdjustValue = Math.round(last_end_value / totalMonths * adjust);  // Khấu hao hệ số
                    // Kiểm tra nếu khấu hao theo hệ số mà lớn hơn khấu hao chia đều số tháng còn lại thì lấy theo khấu hao hệ số còn ngược lại thì lấy theo khấu hao chia đều.
                    let monthsRemain = totalMonths - total_accumulative_month;
                    let depreciationValueCompare = last_end_value / monthsRemain;
                    if (depreciationAdjustValue > depreciationValueCompare) {
                        depreciationValue = depreciationAdjustValue;
                    } else {
                        depreciationValue = depreciationValueCompare;
                    }
                }
            }


            if (currentEndDateObj > endDateObj) {
                if (currentStartDateObj < endDateObj) {
                    let daysOdd = LeaseOrderLoadDataHandle.calculateDaysBetween(currentStartDateObj, endDateObj);
                    depreciationValue = depreciationValue * (daysOdd + 1) / (daysEven + 1);
                    accumulativeValue += depreciationValue;
                    result.push({
                        month: currentMonth.toString(),
                        begin: currentStartDate,
                        end: end_date,
                        accumulative_month: LeaseOrderLoadDataHandle.getAccumulativeMonth(currentStartDate, end_date),
                        start_value: Math.round(currentValue),
                        depreciation_value: Math.round(depreciationValue),
                        accumulative_value: Math.round(accumulativeValue),
                        end_value: Math.round(currentValue - depreciationValue),
                    });
                }
                break;
            } else {
                if (currentStartDateObj.getDate() !== 1) {
                    let daysOdd = LeaseOrderLoadDataHandle.calculateDaysBetween(currentStartDateObj, currentEndDateObj);
                    depreciationValue = depreciationValue * (daysOdd + 1) / (30 + 1);
                }
                accumulativeValue += depreciationValue;
                result.push({
                    month: currentMonth.toString(),
                    begin: currentStartDate,
                    end: currentEndDate,
                    accumulative_month: LeaseOrderLoadDataHandle.getAccumulativeMonth(currentStartDate, currentEndDate),
                    start_value: Math.round(currentValue),
                    depreciation_value: Math.round(depreciationValue),
                    accumulative_value: Math.round(accumulativeValue),
                    end_value: Math.round(currentValue - depreciationValue),
                });
            }

            currentValue = Math.round(currentValue - depreciationValue);
            if (currentStartDateObj.getDate() !== 1) {
                depreciationValue = Math.round(price / totalMonths);
            }
            currentStartDate = LeaseOrderLoadDataHandle.addOneDay(currentEndDate);
            currentMonth++;
        }

        return result;
    };

    static findMatchingRange(lease_from, lease_to, data) {
        let leaseFromDate = new Date(lease_from.split('/').reverse().join('-'));
        let leaseToDate = new Date(lease_to.split('/').reverse().join('-'));

        // Find start index (first dict where lease_from falls in range)
        let startIndex = data.findIndex(item => {
            let beginDate = new Date(item.begin.split('/').reverse().join('-'));
            let endDate = new Date(item.end.split('/').reverse().join('-'));
            return leaseFromDate >= beginDate && leaseFromDate <= endDate;
        });

        // Find end index (first dict where lease_to falls in range)
        let endIndex = data.findIndex(item => {
            let beginDate = new Date(item.begin.split('/').reverse().join('-'));
            let endDate = new Date(item.end.split('/').reverse().join('-'));
            return leaseToDate >= beginDate && leaseToDate <= endDate;
        });

        // If both start and end indexes are found, return the range
        if (startIndex !== -1 && endIndex !== -1) {
            return data.slice(startIndex, endIndex + 1);
        }

        return []; // Return empty array if no match found
    };

    static loadSaveDepreciation() {
        let $table = LeaseOrderDataTableHandle.$tableCost;
        if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-net-value' || LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-fn-cost') {
            $table = LeaseOrderDataTableHandle.$tableCostLeased;
        }
        let target = $table[0].querySelector(`.table-row-item[data-product-id="${LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-product-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');

            if (targetRow) {
                let $methodEle = $('#depreciation_method');
                let $adjust = $('#depreciation_adjustment');
                let $startEle = $('#depreciation_start_date');
                let $endEle = $('#depreciation_end_date');
                let $leaseStartEle = $('#lease_start_date');
                let $leaseEndEle = $('#lease_end_date');
                if ($methodEle.length > 0 && $adjust.length > 0 && $startEle.length > 0 && $endEle.length > 0  && $leaseStartEle.length > 0 && $leaseEndEle.length > 0) {
                    let depreciationMethodEle = targetRow.querySelector('.table-row-depreciation-method');
                    let depreciationAdjustEle = targetRow.querySelector('.table-row-depreciation-adjustment');
                    let depreciationStartDateEle = targetRow.querySelector('.table-row-depreciation-start-date');
                    let depreciationEndDateEle = targetRow.querySelector('.table-row-depreciation-end-date');
                    let leaseStartDateEle = targetRow.querySelector('.table-row-lease-start-date');
                    let leaseEndDateEle = targetRow.querySelector('.table-row-lease-end-date');

                    if (depreciationMethodEle && depreciationAdjustEle && depreciationStartDateEle && depreciationEndDateEle && leaseStartDateEle && leaseEndDateEle) {
                        if ($methodEle.val()) {
                            $(depreciationMethodEle).val(parseInt($methodEle.val()));
                        }
                        if ($adjust.val()) {
                            $(depreciationAdjustEle).val(parseFloat($adjust.val()))
                        }
                        if ($startEle.val()) {
                            $(depreciationStartDateEle).val(moment($startEle.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD'));
                        }
                        if ($endEle.val()) {
                            $(depreciationEndDateEle).val(moment($endEle.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD'));
                        }
                        if ($leaseStartEle.val()) {
                            $(leaseStartDateEle).val(moment($leaseStartEle.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD'));
                        }
                        if ($leaseEndEle.val()) {
                            $(leaseEndDateEle).val(moment($leaseEndEle.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD'));
                        }
                    }
                }
                let fnCost = 0;
                LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().rows().every(function () {
                    let row = this.node();
                    let rowIndex = LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().row(row).index();
                    let $row = LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().row(rowIndex);
                    let dataRow = $row.data();
                    if (dataRow?.['lease_accumulative_allocated']) {
                        fnCost = dataRow?.['lease_accumulative_allocated'];
                    }
                    if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-net-value') {
                        if (dataRow?.['end_value']) {
                            fnCost = dataRow?.['end_value'];
                        }
                    }
                });
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'new-product-fn-cost' || LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-fn-cost') {
                    let depreciationSubtotalEle = targetRow.querySelector('.table-row-depreciation-subtotal');
                    let fnCostEle = targetRow.querySelector('.table-row-subtotal');
                    let fnCostRawEle = targetRow.querySelector('.table-row-subtotal-raw');

                    if (depreciationSubtotalEle && fnCostEle && fnCostRawEle) {
                        $(depreciationSubtotalEle).val(fnCost);
                        $(fnCostEle).attr('data-init-money', String(fnCost));
                        $(fnCostRawEle).val(String(fnCost));
                    }
                }
                if (LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-target') === 'leased-product-net-value') {
                    let netValueEle = targetRow.querySelector('.table-row-net-value');
                    if (netValueEle) {
                        $(netValueEle).attr('data-init-money', String(fnCost));
                    }
                }
                $.fn.initMaskMoney2();
            }
        }
        return true;
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
        LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-item')));
        LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
        LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
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
        LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-labor-item')));
        LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-item')));
        LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-uom')));
        LeaseOrderLoadDataHandle.loadInitS2($(newRow.querySelector('.table-row-tax')));
        // check disable
        tableExpense.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
    };

    static loadChangeLabor(ele) {
        if ($(ele).val()) {
            let row = ele.closest('tr');
            let dataSelected = SelectDDControl.get_data_from_idx($(ele), $(ele).val());
            if (dataSelected?.['expense_item']?.['id']) {
                LeaseOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-item')), [dataSelected?.['expense_item']]);
            }
            if (dataSelected?.['uom']?.['id'] && dataSelected?.['uom_group']?.['id']) {
                LeaseOrderLoadDataHandle.loadInitS2($(row.querySelector('.table-row-uom')), [dataSelected?.['uom']], {'group': dataSelected?.['uom_group']?.['id']});
            }
            LeaseOrderLoadDataHandle.loadPriceLabor(row, dataSelected, dataSelected?.['uom']?.['id']);
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
                            for (let data of dataCopy?.['lease_products_data']) {
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
                    dataCopy['lease_products_data'] = result;
                    dataCopyTo['option'] = 'custom';
                    dataCopyTo['products'] = productCopyTo;
                    dataCopy['lease_costs_data'] = [];
                } else { // if option copy is ALL product
                    dataCopy['lease_products_data'] = dataCopy?.['lease_products_data'];
                }
                // BEGIN COPY DATA
                if (type === 'copy-from') { // COPY FROM (SALE ORDER CREATE -> CHOOSE QUOTATION)
                    LeaseOrderLoadDataHandle.loadCopyData(dataCopy);
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
        let $form = $('#frm_lease_create');
        let tableProduct = $('#datable-quotation-create-product');
        document.getElementById('customer-price-list').value = dataCopy?.['customer']?.['customer_price_list'];
        LeaseOrderLoadDataHandle.loadDataTablesAndDropDowns(dataCopy);
        LeaseOrderLoadDataHandle.loadDetailQuotation(dataCopy, true);
        LeaseOrderLoadDataHandle.loadDataTablesAndDropDowns(dataCopy);
        LeaseOrderCalculateCaseHandle.calculateAllRowsTableProduct();
        // Check promotion -> re calculate
        LeaseOrderLoadDataHandle.loadReApplyPromotion(dataCopy, tableProduct);
        // Load indicator
        LeaseOrderIndicatorHandle.loadIndicator();
        // Set form novalidate
        $form[0].setAttribute('novalidate', 'novalidate');
        LeaseOrderLoadDataHandle.loadCheckDataCopy();
        // set again WF runtime
        LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadCheckDataCopy() {
        let listProductID = [];
        for (let ele of LeaseOrderDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-item')) {
            if (ele.getAttribute('data-product-id')) {
                listProductID.push(ele.getAttribute('data-product-id'));
            }
        }
        WindowControl.showLoading();
        $.fn.callAjax2({
                'url': LeaseOrderLoadDataHandle.urlEle.attr('data-md-product'),
                'method': 'GET',
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
                            // check BOM
                            let checkBOM = LeaseOrderLoadDataHandle.loadCheckProductBOM(product);
                            if (checkBOM?.['is_pass'] === false) {
                                listExclude.push(product?.['id']);
                            }
                            // check type service
                            if (product?.['general_information']?.['product_type']) {
                                for (let type of product?.['general_information']?.['product_type']) {
                                    if (type?.['is_service'] === false) {
                                        listExclude.push(product?.['id']);
                                        break;
                                    }
                                }
                            }
                        }
                        for (let ele of LeaseOrderDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-item')) {
                            if (ele.getAttribute('data-product-id')) {
                                if (listExclude.includes(ele.getAttribute('data-product-id'))) {
                                    let row = ele.closest('tr');
                                    if (row) {
                                        let btnDel = row.querySelector('.del-row');
                                        if (btnDel) {
                                            $(btnDel).trigger('click');
                                        }
                                    }
                                }
                            }
                        }
                        WindowControl.hideLoading();
                        $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-copy-successfully')}, 'success');
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
                url: LeaseOrderLoadDataHandle.urlEle.attr('data-lo-detail').format_url_with_uuid(urlParams?.['recurrence_template_id']),
                method: 'GET',
                isLoading: true,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        LeaseOrderLoadDataHandle.loadDetailQuotation(data);
                        LeaseOrderLoadDataHandle.loadDataTablesAndDropDowns(data);
                        LeaseOrderIndicatorHandle.loadIndicator();

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

    static loadCssToDtb(tableID) {
        let tableIDWrapper = tableID + '_wrapper';
        let tableWrapper = document.getElementById(tableIDWrapper);
        if (tableWrapper) {
            let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
            if (headerToolbar) {
                headerToolbar.classList.add('hidden');
            }
        }
    };

    // LOAD DATA DETAIL
    static loadDetailQuotation(data, is_copy = false) {
        let form = LeaseOrderLoadDataHandle.$form[0];
        if (data?.['title'] && is_copy === false) {
            $('#title').val(data?.['title']);
        }
        LeaseOrderLoadDataHandle.$leaseFrom.val('');
        if (data?.['lease_from']) {
            LeaseOrderLoadDataHandle.$leaseFrom.val(moment(data?.['lease_from']).format('DD/MM/YYYY'));
        }
        LeaseOrderLoadDataHandle.$leaseTo.val('');
        if (data?.['lease_to']) {
            LeaseOrderLoadDataHandle.$leaseTo.val(moment(data?.['lease_to']).format('DD/MM/YYYY'));
        }
        if (data?.['sale_person']) {
            LeaseOrderLoadDataHandle.loadInitS2(LeaseOrderLoadDataHandle.salePersonSelectEle, [data?.['sale_person']]);
        }
        if ($(form).attr('data-method').toLowerCase() !== 'get') {
            LeaseOrderLoadDataHandle.salePersonSelectEle[0].removeAttribute('readonly');
            LeaseOrderLoadDataHandle.customerSelectEle[0].removeAttribute('readonly');
            LeaseOrderLoadDataHandle.contactSelectEle[0].removeAttribute('readonly');
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
                LeaseOrderLoadDataHandle.salePersonSelectEle[0].setAttribute('readonly', 'true');
                LeaseOrderLoadDataHandle.customerSelectEle[0].setAttribute('readonly', 'true');
                LeaseOrderLoadDataHandle.contactSelectEle[0].setAttribute('readonly', 'true');
            }
        }
        if (data?.['customer_data']) {
            if (is_copy === true) {
                data['customer_data']['is_copy'] = true;
            }
            LeaseOrderLoadDataHandle.loadBoxQuotationCustomer(data?.['customer_data']);
        }
        if (data?.['contact_data']) {
            LeaseOrderLoadDataHandle.loadBoxQuotationContact(data?.['contact_data']);
        }
        if (data?.['payment_term_data']) {
            LeaseOrderLoadDataHandle.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle, [data?.['payment_term_data']]);
        }
        if (data?.['quotation_data']) {
            if (data?.['quotation_data']?.['title']) {
                LeaseOrderLoadDataHandle.quotationSelectEle.val(data?.['quotation_data']?.['title']);
            }
            LeaseOrderLoadDataHandle.quotationSelectEle.attr('data-detail', JSON.stringify(data?.['quotation_data']));
        }
        if (data?.['date_created']) {
            $('#quotation-create-date-created').val(moment(data?.['date_created']).format('DD/MM/YYYY'));
        }
        if (data?.['is_customer_confirm'] && is_copy === false) {
            $('#is_customer_confirm')[0].checked = data?.['is_customer_confirm'];
        }
        if (is_copy === false) {
            // check if finish then remove hidden btnDelivery (SO)
            if (data?.['system_status'] === 3 && $(form).attr('data-method').toLowerCase() === 'get') {
                if (LeaseOrderLoadDataHandle.opportunitySelectEle.val()) {
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
            LeaseOrderLoadDataHandle.quotationSelectEle.val(data?.['title']);
            LeaseOrderLoadDataHandle.quotationSelectEle.attr('data-detail', JSON.stringify(data));
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
        // check config
        LeaseOrderCheckConfigHandle.checkConfig(0);
        // load totals
        LeaseOrderLoadDataHandle.loadTotal(data, true, false, false);
        LeaseOrderLoadDataHandle.loadTotal(data, false, true, false);
        LeaseOrderLoadDataHandle.loadTotal(data, false, false, true);
    };

    static loadDataProductAll() {
        let table = document.getElementById('datable-quotation-create-product');
        for (let i = 0; i < table.tBodies[0].rows.length; i++) {
            let row = table.tBodies[0].rows[i];
            let eleItem = row.querySelector('.table-row-item');
            if (eleItem) {
                LeaseOrderLoadDataHandle.loadPriceProduct(eleItem);
                // Re Calculate all data of rows & total
                LeaseOrderCalculateCaseHandle.commonCalculate($(table), row);
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
                            LeaseOrderCheckConfigHandle.checkSsLsRole();
                        }
                    }
                }
            )
        }
    };

    static loadDataTablesAndDropDowns(data) {
        LeaseOrderLoadDataHandle.loadDataTables(data);
        LeaseOrderLoadDataHandle.loadTableDropDowns();
        return true;
    };

    static loadDataTables(data) {
        let form = LeaseOrderLoadDataHandle.$form[0];
        let tableProduct = LeaseOrderDataTableHandle.$tableProduct;
        let tableCost = LeaseOrderDataTableHandle.$tableCost;
        let tableCostLeased = LeaseOrderDataTableHandle.$tableCostLeased;
        let tableExpense = LeaseOrderDataTableHandle.$tableExpense;
        let tableIndicator = $('#datable-quotation-create-indicator');
        let tablePaymentStage = LeaseOrderDataTableHandle.$tablePayment;
        let products_data = data?.['lease_products_data'];
        let costs_data = data?.['lease_costs_data'];
        let costs_leased_data = data?.['lease_costs_leased_data'];
        let expenses_data = data?.['lease_expenses_data'];
        let indicators_data = data?.['lease_indicators_data'];
        if (data.hasOwnProperty('quotation_products_data') && data.hasOwnProperty('quotation_costs_data') && data.hasOwnProperty('quotation_expenses_data') && data.hasOwnProperty('quotation_indicators_data')) {
            products_data = data?.['quotation_products_data'];
            costs_data = data?.['quotation_costs_data'];
            expenses_data = data?.['quotation_expenses_data'];
            indicators_data = data?.['quotation_indicators_data'];
        }
        tableProduct.DataTable().clear().draw();
        tableCost.DataTable().clear().draw();
        tableCostLeased.DataTable().clear().draw();
        tableExpense.DataTable().clear().draw();
        // load table product
        tableProduct.DataTable().rows.add(products_data).draw();
        tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let eleGroup = row.querySelector('.table-row-group');
            let eleProduct = row.querySelector('.table-row-item');
            let btnSOffset = row.querySelector('.btn-select-offset');
            let btnSQuantity = row.querySelector('.btn-select-quantity');

            let rowIndex = tableProduct.DataTable().row(row).index();
            let $row = tableProduct.DataTable().row(rowIndex);
            let dataRow = $row.data();

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
            if (btnSOffset) {
                $(btnSOffset).on('click', function () {
                    LeaseOrderLoadDataHandle.$btnSaveSelectOffset.attr('data-product-id', dataRow?.['product_data']?.['id']);
                    LeaseOrderLoadDataHandle.loadModalSOffset(btnSOffset);
                });
            }
            if (btnSQuantity) {
                $(btnSQuantity).on('click', function () {
                    LeaseOrderLoadDataHandle.$btnSaveSelectQuantity.attr('data-product-id', dataRow?.['product_data']?.['id']);
                    LeaseOrderLoadDataHandle.loadModalSQuantity(btnSQuantity);
                });
            }
        });
        // load table cost
        if (costs_data) {
            tableCost.DataTable().rows.add(costs_data).draw();
        }
        // load table cost
        if (costs_leased_data) {
            tableCostLeased.DataTable().rows.add(costs_leased_data).draw();
        }
        // load table expense
        if (expenses_data) {
            tableExpense.DataTable().rows.add(expenses_data).draw();
        }
        // load table payment stage
        if (data?.['lease_payment_stage']) {
            tablePaymentStage.DataTable().clear().draw();
            tablePaymentStage.DataTable().rows.add(data?.['lease_payment_stage']).draw();
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
        // load indicators & set attr disabled for detail page
        if ($(form).attr('data-method').toLowerCase() === 'get') {
            // load indicators
            tableIndicator.DataTable().clear().draw();
            tableIndicator.DataTable().rows.add(indicators_data).draw();
            // set disabled
            LeaseOrderLoadDataHandle.loadTableDisabled(tableProduct);
            LeaseOrderLoadDataHandle.loadTableDisabled(tableCost);
            LeaseOrderLoadDataHandle.loadTableDisabled(tableExpense);
            LeaseOrderLoadDataHandle.loadTableDisabled(tablePaymentStage);
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
            LeaseOrderLoadDataHandle.loadDropDowns(tableProduct);
        }
        if (tableCost && tableCost.length > 0) {
            LeaseOrderLoadDataHandle.loadDropDowns(tableCost);
        }
        if (tableExpense && tableExpense.length > 0) {
            LeaseOrderLoadDataHandle.loadDropDowns(tableExpense);
        }
        if (tablePS && tablePS.length > 0) {
            LeaseOrderLoadDataHandle.loadDropDowns(tablePS);
        }
    };

    static loadDropDowns(table) {
        if (table[0].id === "datable-quotation-create-product" || table[0].id === "datable-quotation-create-cost") {  // PRODUCT || COST
            table.DataTable().rows().every(function () {
                let row = this.node();

                if (!row.querySelector('.table-row-group')) {
                    if (table[0].id === "datable-quotation-create-product") {  // PRODUCT
                        for (let ele of table[0].querySelectorAll('.btn-select-price')) {
                            ele.removeAttribute('disabled');
                        }
                    }
                    if (table[0].id === "datable-quotation-create-cost") {  // COST
                        for (let ele of table[0].querySelectorAll('.btn-select-cost')) {
                            ele.removeAttribute('disabled');
                        }
                    }
                }
            });
        }
        return true;
    };

    static loadTableDisabled(table) {
        for (let ele of table[0].querySelectorAll('.table-row-item')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-asset-type')) {
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
        for (let ele of table[0].querySelectorAll('.table-row-quantity-time')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-depreciation-time')) {
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
        LeaseOrderLoadDataHandle.$btnSavePrice[0].setAttribute('disabled', 'true');
        for (let ele of table[0].querySelectorAll('.btn-select-cost')) {
            ele.setAttribute('disabled', 'true');
        }
    };

    static loadReApplyPromotion(data) {
        if (Object.keys(data?.['customer_data']).length > 0) {
            let dataProductList = data?.['lease_products_data'];
            if (data.hasOwnProperty('quotation_products_data')) {
                dataProductList = data?.['quotation_products_data'];
            }
            for (let dataProduct of dataProductList) {
                if (dataProduct?.['promotion_id']) {
                    let checkData = LeaseOrderPromotionHandle.checkPromotionValid(dataProduct?.['promotion_data'], data?.['customer_data']?.['id']);
                    let promotionParse = LeaseOrderPromotionHandle.getPromotionResult(checkData);
                    let tableProduct = $('#datable-quotation-create-product');
                    if (promotionParse?.['is_discount'] === true) { // DISCOUNT
                        if (promotionParse?.['row_apply_index'] === null) { // on Specific product
                            if (promotionParse.hasOwnProperty('discount_rate_on_order')) {
                                if (promotionParse.discount_rate_on_order !== null) {
                                    if (promotionParse.is_before_tax === true) {
                                        LeaseOrderPromotionHandle.calculatePromotion(tableProduct, promotionParse?.['discount_rate_on_order'], promotionParse?.['product_price']);
                                    } else {
                                        LeaseOrderPromotionHandle.calculatePromotion(tableProduct, promotionParse?.['discount_rate_on_order'], promotionParse?.['product_price'], false)
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
class LeaseOrderDataTableHandle {
    static $tableSProduct = $('#table-select-product');
    static $tableSOffset = $('#table-select-offset');
    static $tableSLeasedProduct = $('#table-select-leased-product');
    static $tableDepreciationDetail = $('#table-depreciation-detail');
    static $tableProduct = $('#datable-quotation-create-product');
    static $tableCost = $('#datable-quotation-create-cost');
    static $tableCostLeased = $('#datable-quotation-create-cost-leased');
    static $tableExpense = $('#datable-quotation-create-expense');
    static $tablePayment = $('#datable-quotation-payment-stage');

    static dataTableProduct(data) {
        // init dataTable
        LeaseOrderDataTableHandle.$tableProduct.DataTableDefault({
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
                                    >
                                        <span class="icon"><i class="fas fa-chevron-down"></i></span>
                                    </button>
                                    <span class="table-row-order ml-2" hidden>${row?.['order']}</span>`;
                        }
                        return `<span class="table-row-order ml-2">${row?.['order']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '15%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return `<input type="text" class="form-control table-row-group-title-edit" value="${row?.['group_title']}">
                                    <div class="d-flex hidden area-group-show">
                                        <b><p class="text-uppercase mt-2 mr-2 table-row-group-title-show">${row?.['group_title']}</p></b>
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-edit-group"><span class="icon"><i class="far fa-edit"></i></span></button>
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-del-group"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                    </div>`;
                        }
                        let dataZone = "lease_products_data";
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
                                                data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-product')}"
                                                data-method="GET"
                                                data-keyResp="product_sale_list"
                                                data-product-id="${row?.['product_data']?.['id']}"
                                                data-zone="${dataZone}"
                                                readonly>
                                            </select>
                                        </div>
                                    </div>`;
                        } else if (itemType === 1) { // PROMOTION
                            return `<textarea class="form-control table-row-promotion-show zone-readonly" rows="2" data-zone="${dataZone}" readonly>${LeaseOrderLoadDataHandle.transEle.attr('data-promotion')}</textarea>
                                    <div class="row hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select 
                                                class="form-select table-row-promotion zone-readonly"
                                                id="promotion-${row?.['order']}"
                                                data-id-product="${row?.['promotion_data']?.['product_data']?.['id']}"
                                                data-zone="${dataZone}"
                                                readonly>
                                            </select>
                                        </div>
                                    </div>`;
                        } else if (itemType === 2) { // SHIPPING
                            return `<textarea class="form-control table-row-shipping-show zone-readonly" rows="2" data-zone="${dataZone}" readonly>${LeaseOrderLoadDataHandle.transEle.attr('data-shipping')}</textarea>
                                    <div class="row hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select 
                                                class="form-select table-row-shipping zone-readonly"
                                                id="shipping-${row?.['order']}"
                                                data-zone="${dataZone}"
                                                readonly>
                                            </select>
                                        </div>
                                    </div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: '8%',
                    render: (data, type, row) => {
                        return `<select 
                                    class="form-select table-row-asset-type"
                                    required
                                 >
                                </select>`;
                    }
                },
                {
                    targets: 3,
                    width: '15%',
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        return `<div class="d-flex align-items-center">
                                    <textarea class="form-control table-row-offset-show zone-readonly" rows="2" data-zone="${dataZone}" readonly>${row?.['offset_data']?.['title'] ? row?.['offset_data']?.['title'] : ""}</textarea>
                                    <button
                                            type="button"
                                            class="btn btn-icon btn-select-offset"
                                            data-bs-toggle="modal"
                                            data-bs-target="#selectOffsetModal"
                                            data-zone="${dataZone}"
                                        ><i class="fas fa-ellipsis-h"></i>
                                        </button>
                                </div>

                                    <div class="row table-row-item-area hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select 
                                                class="form-select table-row-offset zone-readonly"
                                                id="offset-${row?.['order']}"
                                                data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-product')}"
                                                data-method="GET"
                                                data-keyResp="product_sale_list"
                                                data-offset-id="${row?.['offset_data']?.['id']}"
                                                data-zone="${dataZone}"
                                                readonly>
                                            </select>
                                        </div>
                                    </div>`;
                    }
                },
                {
                    targets: 4,
                    width: '8%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        let dataZone = "lease_products_data";
                        return `<select 
                                    class="form-select table-row-uom"
                                    data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-uom')}"
                                    data-method="GET"
                                    data-keyResp="unit_of_measure"
                                    data-zone="${dataZone}"
                                    required
                                 >
                                </select>`;
                    },
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        let dataZone = "lease_products_data";

                        return `<div class="input-group">
                                    <input type="text" class="form-control table-row-quantity validated-number" value="${row?.['product_quantity']}" data-zone="${dataZone}" readonly required>
                                    <input type="text" class="form-control table-row-quantity-new validated-number hidden" value="${row?.['product_quantity_new'] ? row?.['product_quantity_new'] : "0"}">
                                    <input type="text" class="form-control table-row-quantity-leased validated-number hidden" value="${row?.['product_quantity_leased'] ? row?.['product_quantity_leased'] : "0"}">
                                    <input type="text" class="form-control table-row-quantity-leased-data hidden">
                                    <button
                                        type="button"
                                        class="btn btn-icon btn-outline-light btn-select-quantity"
                                        data-bs-toggle="modal"
                                        data-bs-target="#selectQuantityModal"
                                        data-zone="${dataZone}"
                                    ><i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        let dataZone = "lease_products_data";
                        return `<div class="row">
                                        <div class="input-group">
                                            <input type="text" class="form-control table-row-quantity-time validated-number" value="${row?.['product_quantity_time'] ? row?.['product_quantity_time'] : "0"}" data-zone="${dataZone}" required>
                                            <span class="input-group-text">${row?.['uom_time_data']?.['title'] ? row?.['uom_time_data']?.['title'] : ''}</span>
                                        </div>
                                        <div hidden>
                                            <select 
                                                class="form-select table-row-uom-time"
                                                data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-uom')}"
                                                data-method="GET"
                                                data-keyResp="unit_of_measure"
                                                required
                                                readonly
                                             >
                                            </select>
                                        </div>
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '15%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        let dataZone = "lease_products_data";
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
                    targets: 8,
                    width: '5%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        let dataZone = "lease_products_data";
                        return `<select
                                    class="form-select table-row-tax"
                                    data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-tax')}"
                                    data-method="GET"
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
                    targets: 9,
                    width: '11%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "lease_products_data";
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
                    targets: 10,
                    width: '1%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }
                        let dataZone = "lease_products_data";
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-zone="${dataZone}"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let itemEle = row.querySelector('.table-row-item');
                let promotionEle = row.querySelector('.table-row-promotion');
                let shippingEle = row.querySelector('.table-row-shipping');
                let assetTypeEle = row.querySelector('.table-row-asset-type');
                let offsetEle = row.querySelector('.table-row-offset');
                let btnSOffsetEle = row.querySelector('.btn-select-offset');
                let uomEle = row.querySelector('.table-row-uom');
                let btnSQuantityEle = row.querySelector('.btn-select-quantity');
                let quantityLeasedDataEle = row.querySelector('.table-row-quantity-leased-data');
                let uomTimeEle = row.querySelector('.table-row-uom-time');
                let taxEle = row.querySelector('.table-row-tax');
                if (itemEle) {
                    let dataS2 = [];
                    if (data?.['product_data']) {
                        dataS2 = [data?.['product_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(itemEle), dataS2);
                    $(itemEle).attr('data-product-id', data?.['product_data']?.['id']);
                    LeaseOrderLoadDataHandle.loadPriceProduct(itemEle);
                }
                if (promotionEle) {
                    let dataS2 = [];
                    if (data?.['promotion_data']) {
                        dataS2 = [data?.['promotion_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(promotionEle), dataS2);
                }
                if (shippingEle) {
                    let dataS2 = [];
                    if (data?.['shipping_data']) {
                        dataS2 = [data?.['shipping_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(shippingEle), dataS2);
                }
                if (assetTypeEle) {
                    LeaseOrderLoadDataHandle.loadInitS2($(assetTypeEle), LeaseOrderLoadDataHandle.dataAssetType);
                    if (data?.['asset_type']) {
                        $(assetTypeEle).val(data?.['asset_type']).trigger('change');
                    }
                }
                if (offsetEle) {
                    let dataS2 = [];
                    if (data?.['offset_data']) {
                        dataS2 = [data?.['offset_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(offsetEle), dataS2);
                }
                if (btnSOffsetEle) {
                    $(btnSOffsetEle).on('click', function () {
                        LeaseOrderLoadDataHandle.$btnSaveSelectOffset.attr('data-product-id', data?.['product_data']?.['id']);
                        LeaseOrderLoadDataHandle.loadModalSOffset(btnSOffsetEle);
                    });
                }
                if (uomEle) {
                    let dataS2 = [];
                    if (data?.['uom_data']) {
                        dataS2 = [data?.['uom_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(uomEle), dataS2);
                }
                if (btnSQuantityEle) {
                    $(btnSQuantityEle).on('click', function () {
                        LeaseOrderLoadDataHandle.$btnSaveSelectQuantity.attr('data-product-id', data?.['product_data']?.['id']);
                        LeaseOrderLoadDataHandle.loadModalSQuantity(btnSQuantityEle);
                    });
                }
                if (quantityLeasedDataEle) {
                    $(quantityLeasedDataEle).val(JSON.stringify(data?.['product_quantity_leased_data'] ? data?.['product_quantity_leased_data'] : []));
                }
                if (uomTimeEle) {
                    let dataS2 = [];
                    if (data?.['uom_time_data']) {
                        dataS2 = [data?.['uom_time_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(uomTimeEle), dataS2);
                }
                if (taxEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(taxEle), dataS2);
                }
                // add classes for collapse
                let groupsEle = LeaseOrderDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-group');
                if (groupsEle) {
                    let lastGroup = groupsEle[groupsEle.length - 1];
                    if (lastGroup) {
                        let classGroupDot = lastGroup.getAttribute('data-bs-target');
                        let dataGroupOrder = lastGroup.getAttribute('data-group-order');
                        if (classGroupDot) {
                            let classGroup = classGroupDot.replace(".", "");
                            row.classList.add('collapse');
                            row.classList.add(classGroup);
                            row.classList.add('show');
                            row.setAttribute('data-group', dataGroupOrder);
                        }
                    }
                }
            },
            drawCallback: function () {
                if (['post', 'put'].includes(LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    LeaseOrderDataTableHandle.dtbProductHDCustom();
                }
            },
        });
    };

    static dataTableCost(data) {
        // init dataTable
        LeaseOrderDataTableHandle.$tableCost.DataTableDefault({
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
                        return `<span class="table-row-order">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '15%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
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
                                                data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-product')}"
                                                data-method="GET"
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
                            return `<div class="table-row-shipping" data-shipping="${JSON.stringify(row?.['shipping_data']).replace(/"/g, "&quot;")}"><i class="fas fa-shipping-fast mr-2"></i><span>${LeaseOrderLoadDataHandle.transEle.attr('data-shipping')}</span></div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: () => {
                        let dataZone = "lease_costs_data";
                        return `<select 
                                    class="form-select table-row-uom disabled-custom-show zone-readonly"
                                    data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-uom')}"
                                    data-method="GET"
                                    data-keyResp="unit_of_measure"
                                    data-zone="${dataZone}"
                                    readonly
                                >
                                </select>`;
                    },
                },
                {
                    targets: 3,
                    width: '6%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<input type="text" class="form-control table-row-quantity text-black zone-readonly" value="${row?.['product_quantity']}" data-zone="${dataZone}" disabled>`;
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<div class="row">
                                        <div class="input-group">
                                            <input type="text" class="form-control table-row-quantity-time text-black validated-number" value="${row?.['product_quantity_time'] ? row?.['product_quantity_time'] : "0"}" data-zone="${dataZone}" required readonly>
                                            <span class="input-group-text">${row?.['uom_time_data']?.['title'] ? row?.['uom_time_data']?.['title'] : ''}</span>
                                        </div>
                                        <div hidden>
                                            <select 
                                                class="form-select table-row-uom-time"
                                                data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-uom')}"
                                                data-method="GET"
                                                data-keyResp="unit_of_measure"
                                                required
                                                readonly
                                             >
                                            </select>
                                        </div>
                                </div>`;
                    }
                },
                {
                    targets: 5,
                    width: '15%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        let disabled = ''  // product
                        if (row?.['shipping_id']) {
                            disabled = 'disabled'  // shipping
                        }
                        return `<div class="row">
                                    <input 
                                        type="text" 
                                        class="form-control mask-money table-row-price disabled-custom-show" 
                                        value="${row?.['product_cost_price']}"
                                        data-return-type="number"
                                        data-zone="${dataZone}"
                                    >
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    width: '15%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<div class="row">
                                    <div class="d-flex align-items-center">
                                        <div class="input-group">
                                            <input 
                                                type="text" 
                                                class="form-control table-row-depreciation-time" 
                                                value="${row?.['product_depreciation_time'] ? row?.['product_depreciation_time'] : 0}"
                                                data-zone="${dataZone}"
                                            >
                                            <span class="input-group-text">${row?.['uom_time_data']?.['title'] ? row?.['uom_time_data']?.['title'] : ''}</span>
                                        </div>
                                        <button
                                            type="button"
                                            class="btn btn-icon btn-depreciation-detail"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#viewDepreciationDetail"
                                            data-zone="${dataZone}"
                                        ><i class="fas fa-ellipsis-h"></i>
                                        </button>
                                    </div>
                                    
                                    <input type="text" class="form-control table-row-depreciation-subtotal" value="${row?.['product_depreciation_subtotal'] ? row?.['product_depreciation_subtotal'] : 0}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-method" value="${row?.['product_depreciation_method'] ? row?.['product_depreciation_method'] : 0}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-start-date" value="${row?.['product_depreciation_start_date'] ? row?.['product_depreciation_start_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-end-date" value="${row?.['product_depreciation_end_date'] ? row?.['product_depreciation_end_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-adjustment" value="${row?.['product_depreciation_adjustment'] ? row?.['product_depreciation_adjustment'] : 1}" hidden>
                                
                                    <input type="text" class="form-control table-row-lease-start-date" value="${row?.['product_lease_start_date'] ? row?.['product_lease_start_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-lease-end-date" value="${row?.['product_lease_end_date'] ? row?.['product_lease_end_date'] : ''}" hidden>
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '15%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
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
            rowCallback: function (row, data, index) {
                let itemEle = row.querySelector('.table-row-item');
                let uomEle = row.querySelector('.table-row-uom');
                let uomTimeEle = row.querySelector('.table-row-uom-time');
                if (itemEle) {
                    let dataS2 = [];
                    if (data?.['product_data']) {
                        dataS2 = [data?.['product_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(itemEle), dataS2);
                    $(itemEle).attr('data-product-id', data?.['product_data']?.['id']);
                }
                if (uomEle) {
                    let dataS2 = [];
                    if (data?.['uom_data']) {
                        dataS2 = [data?.['uom_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(uomEle), dataS2);
                }
                if (uomTimeEle) {
                    let dataS2 = [];
                    if (data?.['uom_time_data']) {
                        dataS2 = [data?.['uom_time_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(uomTimeEle), dataS2);
                }
                // re calculate
                LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableCost, row);
            },
            drawCallback: function () {
                LeaseOrderDataTableHandle.dtbCostHDCustom();
            },
        });
    };

    static dataTableCostLeased(data) {
        // init dataTable
        LeaseOrderDataTableHandle.$tableCostLeased.DataTableDefault({
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
                        return `<span class="table-row-order">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '12%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<textarea class="form-control table-row-item-show zone-readonly" rows="2" data-zone="${dataZone}" readonly>${row?.['product_data']?.['lease_code']}</textarea>
                                <div class="row table-row-item-area hidden">
                                    <div class="col-12 col-md-12 col-lg-12">
                                        <select
                                            class="form-select table-row-item disabled-custom-show zone-readonly"
                                            data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-product')}"
                                            data-method="GET"
                                            data-keyResp="product_sale_list"
                                            data-product-id="${row?.['product_data']?.['id']}"
                                            data-zone="${dataZone}"
                                            readonly
                                        >
                                        </select>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 2,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-name" rows="2" readonly>${row?.['product_data']?.['title'] ? row?.['product_data']?.['title'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 3,
                    width: '8%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<div class="row">
                                        <div class="input-group">
                                            <input type="text" class="form-control table-row-quantity-time text-black validated-number" value="${row?.['product_quantity_time'] ? row?.['product_quantity_time'] : "0"}" data-zone="${dataZone}" required readonly>
                                            <span class="input-group-text">${row?.['uom_time_data']?.['title'] ? row?.['uom_time_data']?.['title'] : ''}</span>
                                        </div>
                                        <div hidden>
                                            <select 
                                                class="form-select table-row-uom-time"
                                                data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-uom')}"
                                                data-method="GET"
                                                data-keyResp="unit_of_measure"
                                                required
                                                readonly
                                             >
                                            </select>
                                        </div>
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    width: '8%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-origin-cost" data-init-money="${parseFloat(row?.['product_data']?.['origin_cost'] ? row?.['product_data']?.['origin_cost'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<div class="row">
                                    <div class="d-flex align-items-center net-value-area">
                                        <button
                                            type="button"
                                            class="btn btn-icon btn-depreciation-detail"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#viewDepreciationDetail"
                                            data-zone="${dataZone}"
                                        ><i class="fas fa-ellipsis-h"></i>
                                        </button>
                                        <span class="mask-money table-row-net-value" data-init-money="${parseFloat(row?.['net_value'] ? row?.['net_value'] : '0')}"></span>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    width: '8%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<div class="row">
                                        <div class="input-group">
                                            <input type="text" class="form-control table-row-quantity-time-previous text-black validated-number" value="${row?.['product_data']?.['lease_time_previous'] ? row?.['product_data']?.['lease_time_previous'] : "0"}" data-zone="${dataZone}" required readonly>
                                            <span class="input-group-text">${row?.['uom_time_data']?.['title'] ? row?.['uom_time_data']?.['title'] : ''}</span>
                                        </div>
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '8%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<div class="row">
                                        <div class="input-group">
                                            <input 
                                                type="text" 
                                                class="form-control table-row-depreciation-time-old text-black" 
                                                value="${row?.['product_data']?.['depreciation_time'] ? row?.['product_data']?.['depreciation_time'] : 0}"
                                                data-zone="${dataZone}"
                                                readonly
                                            >
                                            <span class="input-group-text">${row?.['uom_time_data']?.['title'] ? row?.['uom_time_data']?.['title'] : ''}</span>
                                        </div>
                                </div>`;
                    }
                },
                {
                    targets: 8,
                    width: '10%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<div class="row">
                                    <div class="d-flex align-items-center depreciation-area">
                                        <div class="input-group">
                                            <input 
                                                type="text" 
                                                class="form-control table-row-depreciation-time" 
                                                value="${row?.['product_depreciation_time'] ? row?.['product_depreciation_time'] : 0}"
                                                data-zone="${dataZone}"
                                            >
                                            <span class="input-group-text">${row?.['uom_time_data']?.['title'] ? row?.['uom_time_data']?.['title'] : ''}</span>
                                        </div>
                                        <button
                                            type="button"
                                            class="btn btn-icon btn-depreciation-detail"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#viewDepreciationDetail"
                                            data-zone="${dataZone}"
                                        ><i class="fas fa-ellipsis-h"></i>
                                        </button>
                                    </div>
                                    
                                    <input type="text" class="form-control table-row-depreciation-subtotal" value="${row?.['product_depreciation_subtotal'] ? row?.['product_depreciation_subtotal'] : 0}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-method" value="${row?.['product_depreciation_method'] ? row?.['product_depreciation_method'] : 0}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-start-date" value="${row?.['product_depreciation_start_date'] ? row?.['product_depreciation_start_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-end-date" value="${row?.['product_depreciation_end_date'] ? row?.['product_depreciation_end_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-depreciation-adjustment" value="${row?.['product_depreciation_adjustment'] ? row?.['product_depreciation_adjustment'] : 1}" hidden>
                                
                                    <input type="text" class="form-control table-row-lease-start-date" value="${row?.['product_lease_start_date'] ? row?.['product_lease_start_date'] : ''}" hidden>
                                    <input type="text" class="form-control table-row-lease-end-date" value="${row?.['product_lease_end_date'] ? row?.['product_lease_end_date'] : ''}" hidden>
                                </div>`;
                    }
                },
                {
                    targets: 9,
                    width: '8%',
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-lg">
                                    <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox">
                                </div>`;
                    }
                },
                {
                    targets: 10,
                    width: '12%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
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
            rowCallback: function (row, data, index) {
                let itemEle = row.querySelector('.table-row-item');
                let uomTimeEle = row.querySelector('.table-row-uom-time');
                if (itemEle) {
                    let dataS2 = [];
                    if (data?.['product_data']) {
                        dataS2 = [data?.['product_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(itemEle), dataS2);
                    $(itemEle).attr('data-product-id', data?.['product_data']?.['id']);
                }
                if (uomTimeEle) {
                    let dataS2 = [];
                    if (data?.['uom_time_data']) {
                        dataS2 = [data?.['uom_time_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(uomTimeEle), dataS2);
                }
            },
            drawCallback: function () {
                LeaseOrderDataTableHandle.dtbCostLeasedHDCustom();
            },
        });
    };

    static dataTableExpense(data) {
        // init dataTable
        let $tables = $('#datable-quotation-create-expense');
        $tables.DataTableDefault({
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
                        return `<span class="table-row-order">${row?.['order']}</span>`
                    }
                },
                {
                    targets: 1,
                    width: '20%',
                    render: (data, type, row) => {
                        let dataZone = "lease_expenses_data";
                        if (row?.['is_labor'] === false) {
                            return `<input type="text" class="form-control table-row-expense-title" value="${row?.['expense_title']}" data-zone="${dataZone}" required>`;
                        } else {
                            return `<select 
                                    class="form-select table-row-labor-item" 
                                    data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-labor')}"
                                    data-method="GET"
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
                        let dataZone = "lease_expenses_data";
                        let readonly = "";
                        if (row?.['is_labor'] === true) {
                            readonly = "readonly";
                        }
                        return `<select 
                                    class="form-select table-row-item" 
                                    data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-expense')}"
                                    data-method="GET"
                                    data-keyResp="expense_item_list"
                                    data-zone="${dataZone}"
                                    required
                                    ${readonly}>
                                </select>`;
                    }
                },
                {
                    targets: 3,
                    width: '6.66%',
                    render: (data, type, row) => {
                        let dataZone = "lease_expenses_data";
                        return `<select 
                                    class="form-select table-row-uom"
                                    data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-uom')}"
                                    data-method="GET"
                                    data-keyResp="unit_of_measure"
                                    data-zone="${dataZone}"
                                    required
                                >
                                </select>`;
                    },
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        let dataZone = "lease_expenses_data";
                        return `<input type="text" class="form-control table-row-quantity validated-number" value="${row?.['expense_quantity']}" data-zone="${dataZone}" required>`;
                    }
                },
                {
                    targets: 5,
                    width: '16.66%',
                    render: (data, type, row) => {
                        let dataZone = "lease_expenses_data";
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
                        let dataZone = "lease_expenses_data";
                        return `<select 
                                    class="form-select table-row-tax"
                                    data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-tax')}"
                                    data-method="GET"
                                    data-keyResp="tax_list"
                                    data-zone="${dataZone}"
                                >
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row?.['expense_tax_amount']}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row?.['expense_tax_amount']}"
                                    hidden
                                >`;
                    }
                },
                {
                    targets: 7,
                    width: '13.33%',
                    render: (data, type, row) => {
                        let dataZone = "lease_expenses_data";
                        return `<div class="row subtotal-area">
                                <p><span class="mask-money table-row-subtotal" data-init-money="${parseFloat(row?.['expense_subtotal_price'] ? row?.['expense_subtotal_price'] : '0')}" data-zone="${dataZone}"></span></p>
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row?.['expense_subtotal_price']}"
                                    hidden
                                >
                            </div>`;
                    }
                },
                {
                    targets: 8,
                    width: '3.33%',
                    render: () => {
                        let dataZone = "lease_expenses_data";
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-zone="${dataZone}"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let expenseEle = row.querySelector('.table-row-item');
                let laborEle = row.querySelector('.table-row-labor-item');
                let uomEle = row.querySelector('.table-row-uom');
                let taxEle = row.querySelector('.table-row-tax');
                if (expenseEle) {
                    let dataS2 = [];
                    if (data?.['expense_item_data']) {
                        dataS2 = [data?.['expense_item_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(expenseEle), dataS2);
                }
                if (laborEle && data?.['is_labor'] === true) {
                    let dataS2 = [];
                    if (data?.['expense_data']) {
                        dataS2 = [data?.['expense_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(laborEle), dataS2);
                }
                if (uomEle) {
                    let dataS2 = [];
                    if (data?.['uom_data']) {
                        dataS2 = [data?.['uom_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(uomEle), dataS2);
                }
                if (taxEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(taxEle), dataS2);
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                if (['post', 'put'].includes(LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    LeaseOrderDataTableHandle.dtbExpenseHDCustom();
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
                        return `<button type="button" class="btn btn-primary btn-sm apply-promotion" data-promotion="${JSON.stringify(row).replace(/"/g, "&quot;")}" data-bs-dismiss="modal" ${disabled}>${LeaseOrderLoadDataHandle.transEle.attr('data-apply')}</button>`;
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
                LeaseOrderLoadDataHandle.loadEventRadio($tables);
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
                        return `<button type="button" class="btn btn-primary btn-sm apply-shipping" data-shipping="${JSON.stringify(row).replace(/"/g, "&quot;")}" data-bs-dismiss="modal" ${disabled}>${LeaseOrderLoadDataHandle.transEle.attr('data-apply')}</button>`;
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
        LeaseOrderDataTableHandle.dataTableShipping();
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
                            LeaseOrderDataTableHandle.dataTableShipping(passList);
                        } else {
                            LeaseOrderDataTableHandle.dataTableShipping(passList);
                            $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-check-if-shipping-address')}, 'info');
                        }
                    }
                }
            }
        )
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
                        return `<span class="table-row-order" data-value="${(meta.row + 1)}" data-zone="sale_order_indicators_data">${(meta.row + 1)}</span>`
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
                LeaseOrderDataTableHandle.dtbIndicatorHDCustom();
            },
        });
        if ($tables.hasClass('dataTable')) {
            $tables.DataTable().clear().draw();
            $tables.DataTable().rows.add(data ? data : []).draw();
        }
    };

    static dataTablePaymentStage(data) {
        // init dataTable
        LeaseOrderDataTableHandle.$tablePayment.DataTableDefault({
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
                        return `<span class="table-row-order">${row?.['order']}</span>`;
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
                    width: '10%',
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-remark" rows="2">${row?.['remark'] ? row?.['remark'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
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
                                    hidden
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
                    width: '10%',
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
            rowCallback: function (row, data, index) {
                let installmentEle = row.querySelector('.table-row-installment');
                let issueInvoiceEle = row.querySelector('.table-row-issue-invoice');
                let dateEle = row.querySelector('.table-row-date');
                let dueDateEle = row.querySelector('.table-row-due-date');
                if (installmentEle) {
                    let term = [];
                    if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
                        let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.paymentSelectEle, LeaseOrderLoadDataHandle.paymentSelectEle.val());
                        if (dataSelected) {
                            term = dataSelected?.['term'];
                            for (let termData of term) {
                                let isNum = parseFloat(termData?.['value']);
                                if (!isNum) {  // balance
                                    termData['value'] = String(LeaseOrderLoadDataHandle.loadBalanceValPaymentTerm());
                                }
                            }
                        }
                    }
                    term.unshift({'id': '', 'title': 'Select...',});
                    LeaseOrderLoadDataHandle.loadInitS2($(installmentEle), term, {}, null, true);
                    if (data?.['term_id']) {
                        $(installmentEle).val(data?.['term_id']).trigger('change');
                    }
                }
                if (dateEle) {
                    $(dateEle).daterangepicker({
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
                    $(dateEle).val(null).trigger('change');
                    if (data?.['date']) {
                        $(dateEle).val(moment(data?.['date']).format('DD/MM/YYYY'));
                    }
                }
                if (dueDateEle) {
                    $(dueDateEle).daterangepicker({
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
                    $(dueDateEle).val(null).trigger('change');
                    if (data?.['due_date']) {
                        $(dueDateEle).val(moment(data?.['due_date']).format('DD/MM/YYYY'));
                    }
                }
                if (issueInvoiceEle) {
                    let count = data?.['order'];
                    let dataIssue = [{'id': '', 'title': 'Select...',}];
                    for (let i = 1; i <= count; i++) {
                        let add = {'id': String(i), 'title': String(i)};
                        dataIssue.push(add);
                    }
                    LeaseOrderLoadDataHandle.loadInitS2($(issueInvoiceEle), dataIssue, {}, null, true);
                    if (data?.['issue_invoice']) {
                        $(issueInvoiceEle).val(data?.['issue_invoice']).trigger('change');
                    }
                    LeaseOrderLoadDataHandle.loadChangePSIssueInvoice(issueInvoiceEle);
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                if (['post', 'put'].includes(LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    LeaseOrderDataTableHandle.dtbPaymentHDCustom();
                }
            },
        });
    };

    static dataTableSelectProduct(data) {
        LeaseOrderDataTableHandle.$tableSProduct.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            pageLength: 5,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        let clsZoneReadonly = '';
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        let disabled = '';
                        let checked = '';
                        if (LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${row?.['id']}"]`)) {
                            disabled = 'disabled';
                            checked = 'checked';
                            clsZoneReadonly = 'zone-readonly';
                        }
                        let checkBOM = LeaseOrderLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            disabled = 'disabled';
                            checked = '';
                            clsZoneReadonly = 'zone-readonly';
                        }
                        if (row?.['title'] && row?.['code']) {
                            return `<div class="d-flex align-items-center ml-2">
                                        <div class="form-check form-check-lg">
                                            <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox ${clsZoneReadonly}" id="s-product-${row?.['id'].replace(/-/g, "")}" ${disabled} ${checked} data-zone="${dataZone}">
                                            <label class="form-check-label table-row-title" for="s-product-${row?.['id'].replace(/-/g, "")}">${row?.['title']}</label>
                                            <span class="badge badge-light badge-outline">${row?.['code'] ? row?.['code'] : ''}</span>
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
                        let txt = LeaseOrderLoadDataHandle.transEle.attr('data-available');
                        let badge = 'success';
                        if (LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${row?.['id']}"]`)) {
                            txt = LeaseOrderLoadDataHandle.transEle.attr('data-product-note-1');
                            badge = 'warning';
                        }
                        let checkBOM = LeaseOrderLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            txt = LeaseOrderLoadDataHandle.transEle.attr('data-unavailable');
                            badge = 'danger';
                        }
                        return `<span class="badge badge-${badge} badge-outline table-row-status">${txt}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let txt = '';
                        if (LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${row?.['id']}"]`)) {
                            txt = LeaseOrderLoadDataHandle.transEle.attr('data-product-note-1');
                        }
                        let checkBOM = LeaseOrderLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            txt = LeaseOrderLoadDataHandle.transEle.attr(checkBOM?.['note_type']);
                        }
                        return `<span class="table-row-note">${txt}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                LeaseOrderLoadDataHandle.loadEventCheckbox(LeaseOrderDataTableHandle.$tableSProduct);
            },
        });
    };

    static dataTableSelectOffset(data) {
        LeaseOrderDataTableHandle.$tableSOffset.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            pageLength: 5,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        let clsZoneReadonly = '';
                        let disabled = '';
                        let checked = '';
                        if (LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-offset[data-offset-id="${row?.['id']}"]`)) {
                            disabled = 'disabled';
                            checked = 'checked';
                            clsZoneReadonly = 'zone-readonly';
                        }
                        let checkBOM = LeaseOrderLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            disabled = 'disabled';
                            checked = '';
                            clsZoneReadonly = 'zone-readonly';
                        }
                        if (row?.['title'] && row?.['code']) {
                            return `<div class="d-flex align-items-center ml-2">
                                        <div class="form-check form-check-lg">
                                            <input type="radio" name="row-checkbox" class="form-check-input table-row-checkbox ${clsZoneReadonly}" id="s-product-${row?.['id'].replace(/-/g, "")}" ${disabled} ${checked} data-zone="${dataZone}">
                                            <label class="form-check-label table-row-title" for="s-product-${row?.['id'].replace(/-/g, "")}">${row?.['title']}</label>
                                            <span class="badge badge-light badge-outline">${row?.['code'] ? row?.['code'] : ''}</span>
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
                        let txt = LeaseOrderLoadDataHandle.transEle.attr('data-available');
                        let badge = 'success';
                        if (LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-offset[data-offset-id="${row?.['id']}"]`)) {
                            txt = LeaseOrderLoadDataHandle.transEle.attr('data-product-note-1');
                            badge = 'warning';
                        }
                        let checkBOM = LeaseOrderLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            txt = LeaseOrderLoadDataHandle.transEle.attr('data-unavailable');
                            badge = 'danger';
                        }
                        return `<span class="badge badge-${badge} badge-outline table-row-status">${txt}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let txt = '';
                        if (LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-offset[data-offset-id="${row?.['id']}"]`)) {
                            txt = LeaseOrderLoadDataHandle.transEle.attr('data-product-note-1');
                        }
                        let checkBOM = LeaseOrderLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            txt = LeaseOrderLoadDataHandle.transEle.attr(checkBOM?.['note_type']);
                        }
                        return `<span class="table-row-note">${txt}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                LeaseOrderLoadDataHandle.loadEventRadio(LeaseOrderDataTableHandle.$tableSOffset);
            },
        });
    };

    static dataTableSelectLeasedProduct(data) {
        LeaseOrderDataTableHandle.$tableSLeasedProduct.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            pageLength: 5,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        let clsZoneReadonly = '';
                        let disabled = '';
                        let checked = '';
                        if (row?.['title'] && row?.['code']) {
                            return `<div class="d-flex align-items-center ml-2">
                                        <div class="form-check form-check-lg">
                                            <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox ${clsZoneReadonly}" id="s-leased-${row?.['id'].replace(/-/g, "")}" ${disabled} ${checked} data-zone="${dataZone}">
                                            <label class="form-check-label table-row-title" for="s-leased-${row?.['id'].replace(/-/g, "")}">${row?.['lease_code'] ? row?.['lease_code'] : ''}</label>
                                        </div>
                                    </div>`;
                        }
                        return `<span>--</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-name" rows="2" readonly>${row?.['title'] ? row?.['title'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-depreciation-price" data-init-money="${parseFloat(row?.['depreciation_price'] ? row?.['depreciation_price'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span>${row?.['lease_time_previous']}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-net-value" data-init-money="${parseFloat(row?.['net_value'] ? row?.['net_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span>${row?.['depreciation_time']}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
                LeaseOrderLoadDataHandle.loadEventCheckbox(LeaseOrderDataTableHandle.$tableSLeasedProduct);
            },
        });
    };

    static dataTableDepreciationDetail(data) {
        LeaseOrderDataTableHandle.$tableDepreciationDetail.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<span class="table-row-month">${row?.['month']}</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-start-date">${row?.['begin'] ? row?.['begin'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-end-date">${row?.['end'] ? row?.['end'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-start-net-value" data-init-money="${parseFloat(row?.['start_value'] ? row?.['start_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-depreciation-value" data-init-money="${parseFloat(row?.['depreciation_value'] ? row?.['depreciation_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-end-net-value" data-init-money="${parseFloat(row?.['end_value'] ? row?.['end_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span class="table-row-lease-time">${row?.['lease_time'] ? row?.['lease_time'] : ''}</span>`;
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        if (row?.['lease_allocated']) {
                            return `<span class="mask-money table-row-lease-allocated" data-init-money="${parseFloat(row?.['lease_allocated'] ? row?.['lease_allocated'] : '0')}"></span>`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 8,
                    render: (data, type, row) => {
                        if (row?.['lease_accumulative_allocated']) {
                            return `<span class="mask-money table-row-lease-accumulative-allocated" data-init-money="${parseFloat(row?.['lease_accumulative_allocated'] ? row?.['lease_accumulative_allocated'] : '0')}"></span>`;
                        }
                        return ``;


                        // return `<span class="mask-money table-row-accumulative" data-init-money="${parseFloat(row?.['accumulative_value'] ? row?.['accumulative_value'] : '0')}"></span>`;
                    }
                },
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
                LeaseOrderLoadDataHandle.loadCssToDtb("table-depreciation-detail");
            },
        });
    };

    // Custom dtb
    static dtbProductHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableProduct;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-product-quotation-create').length && !$('#btn-add-product-group-quotation').length && !$('#btn-check-promotion').length && !$('#btn-add-shipping').length) {
                let $group = $(`<button type="button" class="btn btn-outline-secondary btn-floating" aria-expanded="false" data-bs-toggle="dropdown" data-zone="lease_products_data">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${LeaseOrderLoadDataHandle.transEle.attr('data-add')}</span><span class="icon"><i class="fas fa-angle-down fs-8 text-light"></i></span></span>
                                </button>
                                <div class="dropdown-menu w-210p">
                                    <a class="dropdown-item" href="#" id="btn-add-product-quotation-create" data-bs-toggle="modal" data-bs-target="#selectProductModal"><i class="dropdown-icon fas fa-cube"></i><span class="mt-2">${LeaseOrderLoadDataHandle.transEle.attr('data-add-product')}</span></a>
                                    <a class="dropdown-item hidden" href="#" id="btn-add-product-group-quotation"><i class="dropdown-icon fas fa-layer-group"></i><span>${LeaseOrderLoadDataHandle.transEle.attr('data-add-group')}</span></a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="#" id="btn-add-shipping" data-bs-toggle="modal" data-bs-target="#shippingFeeModalCenter"><i class="dropdown-icon fas fa-shipping-fast"></i><span class="mt-2">${LeaseOrderLoadDataHandle.transEle.attr('data-shipping')}</span></a>
                                    <a class="dropdown-item" href="#" id="btn-check-promotion" data-bs-toggle="modal" data-bs-target="#promotionModalCenter"><i class="dropdown-icon fas fa-tags"></i><span>${LeaseOrderLoadDataHandle.transEle.attr('data-promotion')}</span></a>
                                </div>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-product-quotation-create').on('click', function () {
                    LeaseOrderLoadDataHandle.loadModalSProduct();
                    LeaseOrderIndicatorHandle.loadIndicator();
                });
                $('#btn-add-product-group-quotation').on('click', function () {
                    LeaseOrderLoadDataHandle.loadAddRowProductGr();
                });
                $('#btn-add-shipping').on('click', function () {
                    LeaseOrderDataTableHandle.loadTableQuotationShipping();
                });
                $('#btn-check-promotion').on('click', function () {
                    LeaseOrderPromotionHandle.callPromotion(0);
                });
            }
        }
    };

    static dtbCostHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableCost;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#label-new-product').length) {
                let $group = $(`<b id="label-new-product">New products</b>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
            }
        }
    };

    static dtbCostLeasedHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableCostLeased;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#label-leased-product').length) {
                let $group = $(`<b id="label-leased-product">Leased products</b>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
            }
        }
    };

    static dtbExpenseHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableExpense;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-expense-quotation-create').length && !$('#btn-add-labor-quotation-create').length) {
                let $group = $(`<button type="button" class="btn btn-outline-secondary btn-floating" aria-expanded="false" data-bs-toggle="dropdown" data-zone="lease_expenses_data">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${LeaseOrderLoadDataHandle.transEle.attr('data-add')}</span><span class="icon"><i class="fas fa-angle-down fs-8 text-light"></i></span></span>
                                </button>
                                <div class="dropdown-menu w-210p">
                                    <a class="dropdown-item" href="#" id="btn-add-expense-quotation-create"><i class="dropdown-icon fas fa-hand-holding-usd"></i><span class="mt-2">${LeaseOrderLoadDataHandle.transEle.attr('data-add-expense')}</span></a>
                                    <a class="dropdown-item" href="#" id="btn-add-labor-quotation-create"><i class="dropdown-icon fas fa-people-carry"></i><span>${LeaseOrderLoadDataHandle.transEle.attr('data-add-labor')}</span></a>
                                </div>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-expense-quotation-create').on('click', function () {
                    LeaseOrderStoreDataHandle.storeDtbData(4);
                    LeaseOrderLoadDataHandle.loadAddRowExpense();
                });
                $('#btn-add-labor-quotation-create').on('click', function () {
                    LeaseOrderStoreDataHandle.storeDtbData(4);
                    LeaseOrderLoadDataHandle.loadAddRowLabor();
                });
            }
        }
    };

    static dtbPaymentHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tablePayment;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-payment-stage').length) {
                let $group = $(`<button type="button" class="btn btn-outline-secondary btn-floating" id="btn-add-payment-stage" data-zone="lease_payment_stage">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${LeaseOrderLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-payment-stage').on('click', function () {
                    LeaseOrderStoreDataHandle.storeDtbData(5);
                    LeaseOrderLoadDataHandle.loadAddPaymentStage();
                });
            }
        }
    };

    static dtbIndicatorHDCustom() {
        let $table = $('#datable-quotation-create-indicator');
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-refresh-indicator').length) {
                let html1 = `<button type="button" class="btn btn-outline-secondary btn-floating" id="btn-refresh-indicator">${LeaseOrderLoadDataHandle.transEle.attr('data-refresh')}</button>`;
                let $group = $(`<div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                                ${html1}
                            </div>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-refresh-indicator').on('click', function () {
                    document.getElementById('quotation-indicator-data').value = "";
                    LeaseOrderIndicatorHandle.loadIndicator();
                    $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-refreshed')}, 'success');
                });
            }
        }
    };


}

// Calculate
class LeaseOrderCalculateCaseHandle {

    static updateTotal(table) {
        // *** quotation & sale order have different rules ***
        // Quotation: discount on row apply to subtotal => pretax includes discount on row => discount on total = pretax * %discountTotalRate
        // Sale order: discount on row not apply to subtotal => pretax not includes discount on row => discount on total = (pretax - discountRows) * %discountTotalRate
        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
        let tableCostWrapper = document.getElementById('datable-quotation-create-cost_wrapper');
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
            if (tableCostWrapper) {
                let tableCostFt = tableCostWrapper.querySelector('.dataTables_scrollFoot');
                if (tableCostFt) {
                    elePretaxAmount = tableCostFt.querySelector('.quotation-create-cost-pretax-amount');
                    eleTaxes = tableCostFt.querySelector('.quotation-create-cost-taxes');
                    eleTotal = tableCostFt.querySelector('.quotation-create-cost-total');
                    elePretaxAmountRaw = tableCostFt.querySelector('.quotation-create-cost-pretax-amount-raw');
                    eleTaxesRaw = tableCostFt.querySelector('.quotation-create-cost-taxes-raw');
                    eleTotalRaw = tableCostFt.querySelector('.quotation-create-cost-total-raw');
                }
            }
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
            discountTotalRate = $('#quotation-copy-discount-on-total').val();
            if (discountTotalRate && eleDiscount) {
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
            let totalFinal = (pretaxAmount - discountAmount + taxAmount);
            $(elePretaxAmount).attr('data-init-money', String(pretaxAmount));
            elePretaxAmountRaw.value = pretaxAmount;

            if (eleDiscount && eleDiscountRaw) {
                $(eleDiscount).attr('data-init-money', String(discountAmount));
                eleDiscountRaw.value = discountAmount;
            }

            if (finalRevenueBeforeTax) {
                finalRevenueBeforeTax.value = pretaxAmount - discountAmount;
            }

            $(eleTaxes).attr('data-init-money', String(taxAmount));
            eleTaxesRaw.value = taxAmount;
            $(eleTotal).attr('data-init-money', String(totalFinal));
            eleTotalRaw.value = totalFinal;
        }
        $.fn.initMaskMoney2();
    };

    static calculate(row) {
        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
        let price = 0;
        let quantity = 0;
        let quantityTime = 0;
        let elePrice = row.querySelector('.table-row-price');
        if (elePrice) {
            price = $(elePrice).valCurrency();
        }
        let eleQuantity = row.querySelector('.table-row-quantity');
        if (eleQuantity) {
            if (eleQuantity.value) {
                quantity = parseFloat(eleQuantity.value)
            } else if (!eleQuantity.value || eleQuantity.value === "0") {
                quantity = 0;
            }
        }
        let tax = 0;
        let discount = 0;
        let subtotal = (price * quantity);
        let eleQuantityTime = row.querySelector('.table-row-quantity-time');
        if (eleQuantityTime) {
            if (eleQuantityTime.value) {
                quantityTime = parseFloat(eleQuantityTime.value)
            } else if (!eleQuantityTime.value || eleQuantityTime.value === "0") {
                quantityTime = 0;
            }
            subtotal = (price * quantity * quantityTime);
        }
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
            discountTotalRate = $('#quotation-copy-discount-on-total').val();
            if (discountTotalRate) {
                discount_on_total = parseFloat(discountTotalRate);
            }
            let discountAmount = ((price * discount) / 100);
            let priceDiscountOnRow = (price - discountAmount);
            let discountAmountOnTotal = ((priceDiscountOnRow * discount_on_total) / 100);
            subtotalPlus = ((priceDiscountOnRow - discountAmountOnTotal) * quantity);
            // calculate tax
            if (eleTaxAmount) {
                let taxAmount = ((subtotalPlus * tax) / 100);
                $(eleTaxAmount).attr('value', String(taxAmount));
                eleTaxAmountRaw.value = taxAmount;
            }
            // store discount amount
            $(eleDiscountAmount).attr('value', String(discountAmount));
            eleDiscountAmountRaw.value = discountAmount;
        } else {
            // calculate tax no discount on total
            if (eleTaxAmount) {
                let taxAmount = ((subtotal * tax) / 100);
                $(eleTaxAmount).attr('value', String(taxAmount));
                eleTaxAmountRaw.value = taxAmount;
            }
        }
        // tab cost
        let depreciationSubtotalEle = row.querySelector('.table-row-depreciation-subtotal');
        if (depreciationSubtotalEle) {
            if ($(depreciationSubtotalEle).val()) {
                subtotal = parseFloat($(depreciationSubtotalEle).val());
            }
        }
        // set subtotal value
        let eleSubtotal = row.querySelector('.table-row-subtotal');
        let eleSubtotalRaw = row.querySelector('.table-row-subtotal-raw');
        if (eleSubtotal && eleSubtotalRaw) {
            $(eleSubtotal).attr('data-init-money', String(subtotal));
            eleSubtotalRaw.value = subtotal;
        }
        $.fn.initMaskMoney2();
    };

    static commonCalculate(table, row) {
        LeaseOrderCalculateCaseHandle.calculate(row);
        // calculate total
        LeaseOrderCalculateCaseHandle.updateTotal(table[0]);
    };

    static calculateAllRowsTableProduct() {
        LeaseOrderDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-item')) {
                LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableProduct, row);
            }
        });
    };

    static calculateAllRowsTableCost() {
        LeaseOrderDataTableHandle.$tableCost.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-item')) {
                LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableCost, row);
            }
        });
    };

}

// Config
class LeaseOrderCheckConfigHandle {
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
                    LeaseOrderLoadDataHandle.opportunitySelectEle[0].setAttribute('disabled', 'true');
                    $(LeaseOrderLoadDataHandle.opportunitySelectEle[0].closest('.input-group')).after(`<small class="text-red">${LeaseOrderLoadDataHandle.transEle.attr('data-validate-ss-role')}</small>`);
                }
            }
            for (let roleID of empCurrent?.['role']) {
                if (ls_role_id.includes(roleID)) {
                    LeaseOrderLoadDataHandle.opportunitySelectEle[0].setAttribute('required', 'true');
                }
            }
        }
        return true;
    };

    static checkConfig(check_type, row = null) {
        let $form = $('#frm_lease_create');
        if ($form.attr('data-method').toLowerCase() !== 'get') {
            let configRaw = $('#quotation-config-data').val();
            if (configRaw) {
                let opportunity = LeaseOrderLoadDataHandle.opportunitySelectEle.val();
                let config = JSON.parse(configRaw);
                if (["", null].includes(opportunity)) {
                    opportunity = null;
                }
                if (!opportunity) { // short sale
                    if (check_type === 0) {  // check All
                        LeaseOrderCheckConfigHandle.checkOnTotal(config, 0);
                        LeaseOrderCheckConfigHandle.checkTableRows(config, 0);
                    }
                    if (check_type === 1) {  // check Single Row
                        LeaseOrderCheckConfigHandle.checkTableRow(config, 0, row);
                    }
                    $.fn.initMaskMoney2();
                    return true;
                } else { // long sale
                    if (check_type === 0) {  // check All
                        LeaseOrderCheckConfigHandle.checkOnTotal(config, 1);
                        LeaseOrderCheckConfigHandle.checkTableRows(config, 1);
                    }
                    if (check_type === 1) {  // check Single Row
                        LeaseOrderCheckConfigHandle.checkTableRow(config, 1, row);
                    }
                    $.fn.initMaskMoney2();
                    return true;
                }
            }
        }
        return true;
    };

    static checkOnTotal(config, check_type) {
        let form = document.getElementById('frm_lease_create');
        if (check_type === 0) {  // short sale
        }
        if (check_type === 1) {  // long sale
        }
    };

    static checkTableRows(config, check_type) {
        let $table = $('#datable-quotation-create-product');
        $table.DataTable().rows().every(function () {
            let row = this.node();
            LeaseOrderCheckConfigHandle.checkTableRow(config, check_type, row);
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
                        LeaseOrderLoadDataHandle.loadPriceProduct(eleProduct);
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
                        LeaseOrderLoadDataHandle.loadPriceProduct(eleProduct);
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
class LeaseOrderIndicatorHandle {
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
                            LeaseOrderIndicatorHandle.calculateIndicator(data.quotation_indicator_list);
                        }
                    }
                }
            )
        } else {
            let data_list = JSON.parse($ele.val());
            LeaseOrderIndicatorHandle.calculateIndicator(data_list);
        }
    };

    static calculateIndicator(indicator_list) {
        let result_list = [];
        let result_json = {};
        let revenueValue = 0;
        let formSubmit = $('#frm_lease_create');
        let _form = new SetupFormSubmit(formSubmit);
        LeaseOrderSubmitHandle.setupDataSubmit(_form, 1);
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
                if (!keyHidden.includes('lease_products_data')) {
                    LeaseOrderLoadDataHandle.loadDataTableCost();
                    LeaseOrderSubmitHandle.setupDataSubmit(_form, 1);
                    data_form = _form.dataForm;
                    LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
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
        LeaseOrderIndicatorHandle.checkSpecialCaseIndicator(data_form);
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
                                let functionData = LeaseOrderIndicatorHandle.functionMaxMin(item, data_form, result_json);
                                parse_formula += functionData;
                            } else if (item.code === 'sumItemIf') {
                                let functionData = LeaseOrderIndicatorHandle.functionSumItemIf(item, data_form);
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
            parse_formula = LeaseOrderIndicatorHandle.formatExpression(parse_formula);
            // value
            let value = LeaseOrderIndicatorHandle.evaluateFormula(parse_formula);
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
            if (formSubmit.attr('data-method') === 'POST') {
                if (dataDetailCopy?.['lease_indicators_data']) {
                    for (let quotation_indicator of dataDetailCopy?.['lease_indicators_data']) {
                        if (indicator?.['title'] === quotation_indicator?.['indicator']?.['title']) {
                            quotationValue = quotation_indicator?.['indicator_value'];
                            differenceValue = (value - quotation_indicator?.['indicator_value']);
                            break;
                        }
                    }
                }
            } else {
                if (dataDetail?.['quotation_data']?.['lease_indicators_data']) {
                    for (let quotation_indicator of dataDetail?.['quotation_data']?.['lease_indicators_data']) {
                        if (indicator?.['title'] === quotation_indicator?.['indicator']?.['title']) {
                            quotationValue = quotation_indicator?.['indicator_value'];
                            differenceValue = (value - quotation_indicator?.['indicator_value']);
                            break;
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
        LeaseOrderDataTableHandle.dataTableSaleOrderIndicator(result_list);
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
        if (data_form?.['lease_products_data'] && leftValueJSON?.['code'].includes("product_data")) {
            dataList = data_form?.['lease_products_data'];
        }
        if (data_form?.['lease_expenses_data'] && ["expense_data", "expense_item_data"].some(keyword => leftValueJSON?.['code']?.includes(keyword))) {
            dataList = data_form?.['lease_expenses_data'];
        }
        functionBody = LeaseOrderIndicatorHandle.extractDataToSum(dataList, leftValueJSON, condition_operator, rightValue, lastElement);
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
                let val = LeaseOrderIndicatorHandle.findKey(data, leftValueJSON.code);
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
                        let check = LeaseOrderIndicatorHandle.evaluateFormula(checkExpression);
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
                    if (data_form.hasOwnProperty('lease_costs_data')) {
                        product_data_list = data_form['lease_costs_data'];
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
class LeaseOrderPromotionHandle {
    static callPromotion(type_check) {
        let $ele = $('#data-init-quotation-create-promotion');
        let customer_id = LeaseOrderLoadDataHandle.customerSelectEle.val();
        let currentDate = DateTimeControl.getCurrentDate();
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
                                    'data': {
                                        'customers_map_promotion__id': customer_id,
                                        'valid_date_start__lte': currentDate,
                                        'valid_date_end__gte': currentDate
                                    },
                                    'isDropdown': true,
                                }
                            ).then(
                                (resp) => {
                                    let data2 = $.fn.switcherResp(resp);
                                    if (data2) {
                                        if (data2.hasOwnProperty('promotion_check_list') && Array.isArray(data2.promotion_check_list)) {
                                            let dataFinal = dataAllCus.concat(data2.promotion_check_list);
                                            if (type_check === 0) {
                                                LeaseOrderPromotionHandle.checkOnWorking(dataFinal, customer_id);
                                            }
                                            if (type_check === 1) {
                                                LeaseOrderPromotionHandle.checkOnSubmit(dataFinal, customer_id);
                                            }
                                        }
                                    }
                                }
                            )
                        } else {
                            let dataFinal = dataAllCus;
                            if (type_check === 0) {
                                LeaseOrderPromotionHandle.checkOnWorking(dataFinal, customer_id);
                            }
                            if (type_check === 1) {
                                LeaseOrderPromotionHandle.checkOnSubmit(dataFinal, customer_id);
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
            let checkData = LeaseOrderPromotionHandle.checkPromotionValid(item, customer_id);
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
        LeaseOrderDataTableHandle.dataTablePromotion(passList);
        return true;
    };

    static checkOnSubmit(dataPromotion, customer_id) {
        let check_length = 0;
        let eleCheck = $('#quotation-check-promotion');
        dataPromotion.map(function (item) {
            let check = LeaseOrderPromotionHandle.checkPromotionValid(item, customer_id);
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
                let check_limit = LeaseOrderPromotionHandle.checkLimit(data_promotion, customer_id);
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
                let check_limit = LeaseOrderPromotionHandle.checkLimit(data_promotion, customer_id);
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
                        const weekNumber1 = LeaseOrderPromotionHandle.getWeekNumber(dateToCheck);
                        const weekNumber2 = LeaseOrderPromotionHandle.getWeekNumber(dateCurrent);
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
                remark = LeaseOrderLoadDataHandle.transEle.attr('data-discount-product');
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
                        remark = LeaseOrderLoadDataHandle.transEle.attr('data-discount-bt');
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
                        remark = LeaseOrderLoadDataHandle.transEle.attr('data-discount-at');
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
                        remark = LeaseOrderLoadDataHandle.transEle.attr('data-discount-bt');
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
                        remark = LeaseOrderLoadDataHandle.transEle.attr('data-discount-at');
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
            promotionData['product_data']['description'] = LeaseOrderLoadDataHandle.transEle.attr('data-gift');
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

// Store data
class LeaseOrderStoreDataHandle {

    static storeDtbData(type) {
        let dataJSON = {};
        let datas = [];
        let $table = null;
        if (type === 1) {
            datas = LeaseOrderSubmitHandle.setupDataProduct();
            $table = LeaseOrderDataTableHandle.$tableProduct;
        }
        if (type === 2) {
            datas = LeaseOrderSubmitHandle.setupDataCost();
            $table = LeaseOrderDataTableHandle.$tableCost;
        }
        if (type === 3) {
            datas = LeaseOrderSubmitHandle.setupDataCostLeased();
            $table = LeaseOrderDataTableHandle.$tableCostLeased;
        }
        if (type === 4) {
            datas = LeaseOrderSubmitHandle.setupDataExpense();
            $table = LeaseOrderDataTableHandle.$tableExpense;
        }
        if (type === 5) {
            datas = LeaseOrderSubmitHandle.setupDataPaymentStage();
            $table = LeaseOrderDataTableHandle.$tablePayment;
        }
        if (datas.length > 0 && $table) {
            for (let data of datas) {
                if (!dataJSON.hasOwnProperty(String(data?.['order']))) {
                    dataJSON[String(data?.['order'])] = data;
                }
            }
            $table.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = $table.DataTable().row(row).index();
                let eleOrder = row.querySelector('.table-row-order');
                if (eleOrder) {
                    let key = eleOrder.innerHTML;
                    $table.DataTable().row(rowIndex).data(dataJSON?.[key]);
                }
            });
            if (type === 1) {
                LeaseOrderLoadDataHandle.loadReInitDataTableProduct();
            }
            if (type === 2) {
                LeaseOrderLoadDataHandle.loadReInitDataTableCost();
            }
            if (type === 3) {
                LeaseOrderLoadDataHandle.loadReInitDataTableCostLeased();
            }
            if (type === 4) {
                LeaseOrderLoadDataHandle.loadReInitDataTableExpense();
            }
            if (type === 5) {
                LeaseOrderLoadDataHandle.loadReInitDataTablePayment();
            }
        }
        return true;
    };

}

// Submit Form
class LeaseOrderSubmitHandle {
    static setupDataProduct() {
        let result = [];
        if (LeaseOrderDataTableHandle.$tableProduct.DataTable().data().count() === 0) {
            return [];
        }
        LeaseOrderDataTableHandle.$tableProduct.DataTable().rows().every(function () {
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
                let assetType = row.querySelector('.table-row-asset-type');
                if (assetType) {
                    if ($(assetType).val()) {
                        rowData['asset_type'] = parseInt($(assetType).val());
                    }
                }
                let eleOffset = row.querySelector('.table-row-offset');
                if (eleOffset) {
                    if ($(eleOffset).val()) {
                        let dataOffset = SelectDDControl.get_data_from_idx($(eleOffset), $(eleOffset).val());
                        if (dataOffset) {
                            rowData['offset_id'] = dataOffset?.['id'];
                            rowData['offset_data'] = dataOffset;
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
                let eleQuantity = row.querySelector('.table-row-quantity');
                if (eleQuantity) {
                    rowData['product_quantity'] = parseFloat(eleQuantity.value);
                    rowData['remain_for_purchase_request'] = parseFloat(eleQuantity.value);
                    rowData['remain_for_purchase_order'] = parseFloat(eleQuantity.value);
                    rowData['quantity_wo_remain'] = parseFloat(eleQuantity.value);
                }
                let eleQuantityNew = row.querySelector('.table-row-quantity-new');
                if (eleQuantityNew) {
                    rowData['product_quantity_new'] = parseFloat(eleQuantityNew.value);
                }
                let eleQuantityLeased = row.querySelector('.table-row-quantity-leased');
                if (eleQuantityLeased) {
                    rowData['product_quantity_leased'] = parseFloat(eleQuantityLeased.value);
                }
                let quantityLeasedDataEle = row.querySelector('.table-row-quantity-leased-data');
                if (quantityLeasedDataEle) {
                    if ($(quantityLeasedDataEle).val()) {
                        rowData['product_quantity_leased_data'] = JSON.parse($(quantityLeasedDataEle).val());
                    }
                }
                let eleUOMTime = row.querySelector('.table-row-uom-time');
                if ($(eleUOMTime).val()) {
                    let dataUOMTime = SelectDDControl.get_data_from_idx($(eleUOMTime), $(eleUOMTime).val());
                    if (dataUOMTime) {
                        rowData['uom_time_id'] = dataUOMTime?.['id'];
                        rowData['uom_time_data'] = dataUOMTime;
                    }
                }
                let eleQuantityTime = row.querySelector('.table-row-quantity-time');
                if (eleQuantityTime) {
                    rowData['product_quantity_time'] = parseFloat(eleQuantityTime.value);
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
                if ($(elePromotion).val()) {
                    let dataPromotion = SelectDDControl.get_data_from_idx($(elePromotion), $(elePromotion).val());
                    if (dataPromotion) {
                        rowData['promotion_id'] = dataPromotion?.['id'];
                        rowData['promotion_data'] = dataPromotion;
                    }
                }
                let uomData = {};
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
                if ($(eleShipping).val()) {
                    let dataShipping = SelectDDControl.get_data_from_idx($(eleShipping), $(eleShipping).val());
                    if (dataShipping) {
                        rowData['shipping_id'] = dataShipping?.['id'];
                        rowData['shipping_data'] = dataShipping;
                    }
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
        if (LeaseOrderDataTableHandle.$tableCost.DataTable().data().count() === 0) {
            return [];
        }
        LeaseOrderDataTableHandle.$tableCost.DataTable().rows().every(function () {
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
                let eleUOMTime = row.querySelector('.table-row-uom-time');
                if ($(eleUOMTime).val()) {
                    let dataUOMTime = SelectDDControl.get_data_from_idx($(eleUOMTime), $(eleUOMTime).val());
                    if (dataUOMTime) {
                        rowData['uom_time_id'] = dataUOMTime?.['id'];
                        rowData['uom_time_data'] = dataUOMTime;
                    }
                }
                let eleQuantityTime = row.querySelector('.table-row-quantity-time');
                if (eleQuantityTime) {
                    rowData['product_quantity_time'] = parseFloat(eleQuantityTime.value);
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

                let depreciationSubtotalEle = row.querySelector('.table-row-depreciation-subtotal');
                if (depreciationSubtotalEle) {
                    if ($(depreciationSubtotalEle).val()) {
                        rowData['product_depreciation_subtotal'] = parseFloat($(depreciationSubtotalEle).val());
                        if (rowData?.['product_depreciation_subtotal'] && rowData?.['product_quantity']) {
                            rowData['product_depreciation_price'] = rowData?.['product_depreciation_subtotal'] / rowData?.['product_quantity'];
                        }
                    }
                }
                let depreciationMethodEle = row.querySelector('.table-row-depreciation-method');
                if (depreciationMethodEle) {
                    if ($(depreciationMethodEle).val()) {
                        rowData['product_depreciation_method'] = parseInt($(depreciationMethodEle).val());
                    }
                }
                let depreciationAdjustEle = row.querySelector('.table-row-depreciation-adjustment');
                if (depreciationAdjustEle) {
                    if ($(depreciationAdjustEle).val()) {
                        rowData['product_depreciation_adjustment'] = parseFloat($(depreciationAdjustEle).val());
                    }
                }
                let depreciationTimeEle = row.querySelector('.table-row-depreciation-time');
                if (depreciationTimeEle) {
                    if ($(depreciationTimeEle).val()) {
                        rowData['product_depreciation_time'] = parseFloat($(depreciationTimeEle).val());
                    }
                }
                let depreciationStartDEle = row.querySelector('.table-row-depreciation-start-date');
                if (depreciationStartDEle) {
                    if ($(depreciationStartDEle).val()) {
                        rowData['product_depreciation_start_date'] = $(depreciationStartDEle).val();
                    }
                }
                let depreciationEndDEle = row.querySelector('.table-row-depreciation-end-date');
                if (depreciationEndDEle) {
                    if ($(depreciationEndDEle).val()) {
                        rowData['product_depreciation_end_date'] = $(depreciationEndDEle).val();
                    }
                }
                let leaseStartDateEle = row.querySelector('.table-row-lease-start-date');
                if (leaseStartDateEle) {
                    if ($(leaseStartDateEle).val()) {
                        rowData['product_lease_start_date'] = $(leaseStartDateEle).val();
                    }
                }
                let leaseEndDateEle = row.querySelector('.table-row-lease-end-date');
                if (leaseEndDateEle) {
                    if ($(leaseEndDateEle).val()) {
                        rowData['product_lease_end_date'] = $(leaseEndDateEle).val();
                    }
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

    static setupDataCostLeased() {
        let result = [];
        if (LeaseOrderDataTableHandle.$tableCostLeased.DataTable().data().count() === 0) {
            return [];
        }
        LeaseOrderDataTableHandle.$tableCostLeased.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let eleProduct = row.querySelector('.table-row-item');
            if ($(eleProduct).val()) { // PRODUCT
                let dataProduct = SelectDDControl.get_data_from_idx($(eleProduct), $(eleProduct).val());
                if (dataProduct) {
                    rowData['product_id'] = dataProduct?.['id'];
                    rowData['product_data'] = dataProduct;
                }
                let eleUOMTime = row.querySelector('.table-row-uom-time');
                if ($(eleUOMTime).val()) {
                    let dataUOMTime = SelectDDControl.get_data_from_idx($(eleUOMTime), $(eleUOMTime).val());
                    if (dataUOMTime) {
                        rowData['uom_time_id'] = dataUOMTime?.['id'];
                        rowData['uom_time_data'] = dataUOMTime;
                    }
                }
                let eleQuantityTime = row.querySelector('.table-row-quantity-time');
                if (eleQuantityTime) {
                    rowData['product_quantity_time'] = parseFloat(eleQuantityTime.value);
                }
                let netValueEle = row.querySelector('.table-row-net-value');
                if (netValueEle) {
                    if ($(netValueEle).attr('data-init-money')) {}
                    rowData['net_value'] = parseFloat($(netValueEle).attr('data-init-money'));
                }
                let eleSubtotal = row.querySelector('.table-row-subtotal-raw');
                if (eleSubtotal) {
                    rowData['product_subtotal_price'] = parseFloat(eleSubtotal.value);
                }

                let depreciationSubtotalEle = row.querySelector('.table-row-depreciation-subtotal');
                if (depreciationSubtotalEle) {
                    if ($(depreciationSubtotalEle).val()) {
                        rowData['product_depreciation_subtotal'] = parseFloat($(depreciationSubtotalEle).val());
                        if (rowData?.['product_depreciation_subtotal'] && rowData?.['product_quantity']) {
                            rowData['product_depreciation_price'] = rowData?.['product_depreciation_subtotal'] / rowData?.['product_quantity'];
                        }
                    }
                }
                let depreciationTimeEle = row.querySelector('.table-row-depreciation-time');
                if (depreciationTimeEle) {
                    if ($(depreciationTimeEle).val()) {
                        rowData['product_depreciation_time'] = parseFloat($(depreciationTimeEle).val());
                    }
                }
                let leaseStartDateEle = row.querySelector('.table-row-lease-start-date');
                if (leaseStartDateEle) {
                    if ($(leaseStartDateEle).val()) {
                        rowData['product_lease_start_date'] = $(leaseStartDateEle).val();
                    }
                }
                let leaseEndDateEle = row.querySelector('.table-row-lease-end-date');
                if (leaseEndDateEle) {
                    if ($(leaseEndDateEle).val()) {
                        rowData['product_lease_end_date'] = $(leaseEndDateEle).val();
                    }
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
        if (LeaseOrderDataTableHandle.$tableExpense.DataTable().data().count() === 0) {
            return [];
        }
        LeaseOrderDataTableHandle.$tableExpense.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let rowIndex = LeaseOrderDataTableHandle.$tableExpense.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableExpense.DataTable().row(rowIndex);
            let dataRow = $row.data();

            rowData['is_labor'] = dataRow?.['is_labor'];

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
            let rowIndex = $table.DataTable().row(row).index();
            let $row = $table.DataTable().row(rowIndex);
            let dataRow = $row.data();

            let indicator = row.querySelector('.table-row-title').getAttribute('data-id');
            let indicator_value = row.querySelector('.table-row-value').getAttribute('data-value');
            let indicator_rate = row.querySelector('.table-row-rate').getAttribute('data-value');
            let order = row.querySelector('.table-row-order').getAttribute('data-value');
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
        });
        return result;
    };

    static setupDataPaymentStage() {
        let result = [];
        LeaseOrderDataTableHandle.$tablePayment.DataTable().rows().every(function () {
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
            let eleARInvoice = row.querySelector('.table-row-checkbox-invoice');
            if (eleARInvoice) {
                rowData['is_ar_invoice'] = eleARInvoice.checked;
            }
            result.push(rowData);
        });
        return result;
    };

    static setupDataSubmit(_form, type = 0) {
        // type 0: submit | 1: indicator

        let quotation_products_data = 'lease_products_data';
        let quotation_costs_data = 'lease_costs_data';
        let quotation_expenses_data = 'lease_expenses_data';
        let quotation_logistic_data = 'lease_logistic_data';
        let quotation_indicators_data = 'lease_indicators_data';

        _form.dataForm['quotation_id'] = null;
        if (LeaseOrderLoadDataHandle.quotationSelectEle && LeaseOrderLoadDataHandle.quotationSelectEle.length > 0) {
            if (LeaseOrderLoadDataHandle.quotationSelectEle.attr('data-detail')) {
                let quotationData = JSON.parse(LeaseOrderLoadDataHandle.quotationSelectEle.attr('data-detail'));
                if (quotationData?.['id']) {
                    _form.dataForm['quotation_id'] = quotationData?.['id'];
                    _form.dataForm['quotation_data'] = quotationData;
                }
            }
        }
        let dateLFVal = LeaseOrderLoadDataHandle.$leaseFrom.val();
        if (dateLFVal) {
            _form.dataForm['lease_from'] = moment(dateLFVal,
                'DD/MM/YYYY').format('YYYY-MM-DD')
        }
        let dateLTVal = LeaseOrderLoadDataHandle.$leaseTo.val();
        if (dateLTVal) {
            _form.dataForm['lease_to'] = moment(dateLTVal,
                'DD/MM/YYYY').format('YYYY-MM-DD')
        }
        if (LeaseOrderLoadDataHandle.customerSelectEle.val()) {
            let data = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.customerSelectEle, LeaseOrderLoadDataHandle.customerSelectEle.val());
            if (data) {
                _form.dataForm['customer_data'] = data;
            }
        }
        if (LeaseOrderLoadDataHandle.contactSelectEle.val()) {
            let data = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.contactSelectEle, LeaseOrderLoadDataHandle.contactSelectEle.val());
            if (data) {
                _form.dataForm['contact_data'] = data;
            }
        }
        if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.paymentSelectEle, LeaseOrderLoadDataHandle.paymentSelectEle.val());
            if (dataSelected) {
                _form.dataForm['payment_term_data'] = dataSelected;
            }
        }
        if (type === 0) {
            if (!LeaseOrderLoadDataHandle.customerSelectEle.val()) {
                $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-required-customer')}, 'failure');
                return false;
            }
            if (!LeaseOrderLoadDataHandle.contactSelectEle.val()) {
                $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-required-contact')}, 'failure');
                return false;
            }
        }
        let quotation_products_data_setup = LeaseOrderSubmitHandle.setupDataProduct();
        if (quotation_products_data_setup.length > 0) {
            _form.dataForm[quotation_products_data] = quotation_products_data_setup;
            // total product
            let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
            if (tableProductWrapper) {
                let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                if (tableProductFt) {
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
        }
        if (type === 0) {
            if (quotation_products_data_setup.length <= 0) {
                $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-required-product')}, 'failure');
                return false;
            }
        }
        // COST
        let quotation_costs_data_setup = LeaseOrderSubmitHandle.setupDataCost();
        if (quotation_costs_data_setup.length > 0) {
            _form.dataForm[quotation_costs_data] = quotation_costs_data_setup;
            // total cost
            let tableCostWrapper = document.getElementById('datable-quotation-create-cost_wrapper');
            if (tableCostWrapper) {
                let tableCostFt = tableCostWrapper.querySelector('.dataTables_scrollFoot');
                if (tableCostFt) {
                    _form.dataForm['total_cost_pretax_amount'] = parseFloat(tableCostFt.querySelector('.quotation-create-cost-pretax-amount-raw').value);
                    if (!_form.dataForm['total_cost_pretax_amount']) {
                        _form.dataForm['total_cost_pretax_amount'] = 0;
                    }
                    _form.dataForm['total_cost_tax'] = parseFloat(tableCostFt.querySelector('.quotation-create-cost-taxes-raw').value);
                    if (!_form.dataForm['total_cost_tax']) {
                        _form.dataForm['total_cost_tax'] = 0;
                    }
                    _form.dataForm['total_cost'] = parseFloat(tableCostFt.querySelector('.quotation-create-cost-total-raw').value);
                    if (!_form.dataForm['total_cost']) {
                        _form.dataForm['total_cost'] = 0;
                    }
                }
            }
        }
        // COST LEASED
        let costs_leased_data_setup = LeaseOrderSubmitHandle.setupDataCostLeased();
        if (costs_leased_data_setup.length > 0) {
            _form.dataForm["lease_costs_leased_data"] = costs_leased_data_setup;
        }
        // EXPENSE
        let quotation_expenses_data_setup = LeaseOrderSubmitHandle.setupDataExpense();
        if (quotation_expenses_data_setup.length > 0) {
            _form.dataForm[quotation_expenses_data] = quotation_expenses_data_setup;
            // total expense
            let tableExpenseWrapper = document.getElementById('datable-quotation-create-expense_wrapper');
            if (tableExpenseWrapper) {
                let tableExpenseFt = tableExpenseWrapper.querySelector('.dataTables_scrollFoot');
                if (tableExpenseFt) {
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
        }
        // LOGISTIC
        _form.dataForm[quotation_logistic_data] = LeaseOrderSubmitHandle.setupDataLogistic();
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
        let quotation_indicators_data_setup = LeaseOrderSubmitHandle.setupDataIndicator();
        if (quotation_indicators_data_setup.length > 0) {
            _form.dataForm[quotation_indicators_data] = quotation_indicators_data_setup;
            let keyInd = "quotation_indicator_data";
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
        _form.dataForm['lease_payment_stage'] = LeaseOrderSubmitHandle.setupDataPaymentStage();
        // validate payment stage submit
        if (type === 0) {
            if (_form.dataForm?.['lease_payment_stage'] && _form.dataForm?.['total_product']) {
                if (_form.dataForm?.['lease_payment_stage'].length > 0) {
                    let totalRatio = 0;
                    let totalPayment = 0;
                    for (let payment of _form.dataForm['lease_payment_stage']) {
                        totalRatio += payment?.['payment_ratio'] ? payment?.['payment_ratio'] : 0;
                        totalPayment += payment?.['value_total'] ? payment?.['value_total'] : 0;
                    }
                    if (totalRatio !== 100) {
                        $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-validate-total-ratio-payment')}, 'failure');
                        return false;
                    }
                    if (totalPayment !== _form.dataForm?.['total_product']) {
                        $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-validate-total-payment')}, 'failure');
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
                $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-validate-total-payment')}, 'failure');
                return false;
            }
        }
    }
    return true;
}