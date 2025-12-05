// Load data
class LeaseOrderLoadDataHandle {
    static $form = $('#frm_lease_create');
    static $configEle = $('#data-config-lease-order');
    static opportunitySelectEle = $('#opportunity_id');
    static $leaseFrom = $('#lease_from');
    static $leaseTo = $('#lease_to');
    static customerSelectEle = $('#customer_id');
    static contactSelectEle = $('#contact_id');
    static paymentSelectEle = $('#payment_term_id');
    static salePersonSelectEle = $('#employee_inherit_id');
    static quotationSelectEle = $('#quotation_id');
    static $btnSaveSelectProduct = $('#btn-save-select-product');
    static $btnSaveSelectOffset = $('#btn-save-select-offset');
    static $btnSaveSelectTool = $('#btn-save-select-tool');
    static $btnSaveSelectAsset = $('#btn-save-select-asset');
    static $btnSaveSelectQuantity = $('#btn-save-select-quantity');
    static $eleStoreDetail = $('#quotation-detail-data');
    static transEle = $('#app-trans-factory');
    static urlEle = $('#app-url-factory');
    static $priceModal = $('#selectPriceModal');
    static $btnSavePrice = $('#btn-save-select-price');
    static $costModal = $('#selectCostModal');
    static $btnSaveCost = $('#btn-save-select-cost');
    static $depreciationModal = $('#viewDepreciationDetail');
    static $btnSaveDepreciation = $('#btn-save-depreciation-detail');
    static $btnSaveTerm = $('#btn-save-select-term');
    static $btnSaveInvoice = $('#btn-save-select-invoice');
    static $btnSaveReconcile = $('#btn-save-select-reconcile');
    static $modalShipping = $('#shippingFeeModalCenter');

    static dataAssetType = [
        {'id': '', 'title': 'Select...',},
        {'id': 1, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-asset-type-1')},
        {'id': 2, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-asset-type-2')},
        {'id': 3, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-asset-type-3')},
    ];
    static dataConvertInto = [
        {'id': '', 'title': 'Select...',},
        {'id': 1, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-asset-type-2')},
        {'id': 2, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-asset-type-3')},
    ];
    static dataDepreciationMethod = [
        {'id': 0, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-depreciation-method-1')},
        {'id': 1, 'title': LeaseOrderLoadDataHandle.transEle.attr('data-depreciation-method-2')},
    ];

    static $productsCheckedEle = $('#products-checked');
    static $offsetsCheckedEle = $('#offsets-checked');
    static $toolsCheckedEle = $('#tools-checked');
    static $assetsCheckedEle = $('#assets-checked');

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

    static loadInitConfigLease() {
        $.fn.callAjax2({
                'url': LeaseOrderLoadDataHandle.$configEle.attr('data-url'),
                'method': 'GET',
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    LeaseOrderLoadDataHandle.$configEle.val(JSON.stringify(data));
                }
            }
        )
        return true;
    }

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
            FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.salePersonSelectEle, [JSON.parse(dataStr)]);
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
            if (oppData?.['customer']?.['id']) {
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': LeaseOrderLoadDataHandle.customerSelectEle.attr('data-url'),
                        'method': "GET",
                        'data': {'id': oppData?.['customer']?.['id']},
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('account_sale_list') && Array.isArray(data.account_sale_list)) {
                                if (data?.['account_sale_list'].length > 0) {
                                    FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.customerSelectEle, data?.['account_sale_list']);
                                    LeaseOrderLoadDataHandle.customerSelectEle.trigger('change');
                                }
                                WindowControl.hideLoading();
                            }
                        }
                    }
                )
            }
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
        FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.customerSelectEle, [dataCustomer], data_filter);
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            if (!dataCustomer?.['is_copy']) {
                LeaseOrderLoadDataHandle.loadDataProductAll();
            }
        }
    };

    static loadDataByCustomer() {
        let tableProduct = $('#datable-quotation-create-product');
        if (LeaseOrderLoadDataHandle.customerSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.customerSelectEle, LeaseOrderLoadDataHandle.customerSelectEle.val());
            if (dataSelected) {
                // load contact
                if (dataSelected?.['contact_list']) {
                    FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.contactSelectEle, dataSelected?.['contact_list']);
                    for (let contact of dataSelected?.['contact_list']) {
                        if (contact?.['is_owner'] === true) {
                            LeaseOrderLoadDataHandle.contactSelectEle.val(contact?.['id']).trigger('change');
                            break;
                        }
                    }
                }
                // load payment term
                if (dataSelected?.['payment_term_customer_mapped']) {
                    FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle, [dataSelected?.['payment_term_customer_mapped']], {}, null, true);
                    LeaseOrderLoadDataHandle.loadChangePaymentTerm();
                }
                // load Shipping & Billing by Customer
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
        FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle, [], {}, null, true);
        if ($(LeaseOrderLoadDataHandle.customerSelectEle).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.customerSelectEle, $(LeaseOrderLoadDataHandle.customerSelectEle).val());
            if (dataSelected) {
                if (dataSelected?.['payment_term_customer_mapped']) {
                    FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle, [dataSelected?.['payment_term_customer_mapped']], {}, null, true);
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

    static loadStoreSProduct() {
        let dataSelected = {};
        LeaseOrderDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(rowIndex);
            let dataRow = $row.data();
            if (dataRow?.['product_data']?.['id']) {
                dataSelected[dataRow?.['product_data']?.['id']] = {
                    "type": "selected",
                    "data": dataRow?.['product_data'],
                };
            }
        });
        LeaseOrderLoadDataHandle.$productsCheckedEle.val(JSON.stringify(dataSelected));
        return true;
    };

    static loadStoreCheckProduct(ele) {
        let row = ele.closest('tr');
        let rowIndex = LeaseOrderDataTableHandle.$tableSProduct.DataTable().row(row).index();
        let $row = LeaseOrderDataTableHandle.$tableSProduct.DataTable().row(rowIndex);
        let dataRow = $row.data();

        if (dataRow) {
            if (LeaseOrderLoadDataHandle.$productsCheckedEle.val()) {
                let storeID = JSON.parse(LeaseOrderLoadDataHandle.$productsCheckedEle.val());
                if (typeof storeID === 'object') {
                    if (ele.checked === true) {
                        if (!storeID?.[dataRow?.['id']]) {
                            storeID[dataRow?.['id']] = {
                                "type": "current",
                                "data": dataRow,
                            };
                        }
                    }
                    if (ele.checked === false) {
                        if (storeID?.[dataRow?.['id']]) {
                            delete storeID?.[dataRow?.['id']];
                        }
                    }
                    LeaseOrderLoadDataHandle.$productsCheckedEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (ele.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                LeaseOrderLoadDataHandle.$productsCheckedEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    };

    static loadModalSProduct() {
        LeaseOrderLoadDataHandle.loadStoreSProduct();
        LeaseOrderDataTableHandle.$tableSProduct.DataTable().destroy();
        LeaseOrderDataTableHandle.dataTableSelectProduct();
    };

    static loadStoreSOffset(ele) {
        let dataSelected = {};
        let row = ele.closest('tr');
        if (row) {
            let rowIndex = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(rowIndex);
            let dataRow = $row.data();
            if (dataRow?.['offset_data']) {
                for (let offsetData of dataRow?.['offset_data']) {
                    if (offsetData?.['offset_data']?.['id']) {
                        dataSelected[offsetData?.['offset_data']?.['id']] = {
                            "type": "selected",
                            "data": offsetData?.['offset_data'],
                        };
                    }

                }
            }
        }
        LeaseOrderLoadDataHandle.$offsetsCheckedEle.val(JSON.stringify(dataSelected));
        return true;
    };

    static loadStoreCheckOffset(ele) {
        let row = ele.closest('tr');
        let rowIndex = LeaseOrderDataTableHandle.$tableSOffset.DataTable().row(row).index();
        let $row = LeaseOrderDataTableHandle.$tableSOffset.DataTable().row(rowIndex);
        let dataRow = $row.data();
        let checkEle = row.querySelector('.table-row-checkbox');
        let quantityEle = row.querySelector('.table-row-quantity');
        if (dataRow && checkEle && quantityEle) {
            dataRow['product_quantity'] = 0;
            if ($(quantityEle).val()) {
                dataRow['product_quantity'] = parseFloat($(quantityEle).val());
            }
            if (LeaseOrderLoadDataHandle.$offsetsCheckedEle.val()) {
                let storeID = JSON.parse(LeaseOrderLoadDataHandle.$offsetsCheckedEle.val());
                if (typeof storeID === 'object') {
                    if (checkEle.checked === true) {
                        storeID[dataRow?.['id']] = {
                            "type": "current",
                            "data": dataRow,
                        };
                    }
                    if (checkEle.checked === false) {
                        if (storeID?.[dataRow?.['id']]) {
                            delete storeID?.[dataRow?.['id']];
                        }
                    }
                    LeaseOrderLoadDataHandle.$offsetsCheckedEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (checkEle.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                LeaseOrderLoadDataHandle.$offsetsCheckedEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    };

    static loadModalSOffset(ele) {
        let row = ele.closest('tr');
        LeaseOrderDataTableHandle.$tableSOffset.DataTable().clear().draw();
        if (row) {
            LeaseOrderLoadDataHandle.loadStoreSOffset(ele);
            LeaseOrderDataTableHandle.$tableSOffset.DataTable().destroy();
            LeaseOrderDataTableHandle.dataTableSelectOffset();
            // let eleType = row.querySelector('.table-row-asset-type');
            // if (eleType) {
            //     let params = {'lease_source_id__isnull': true};
            //     if ($(eleType).val() === "1") {
            //         params['general_product_types_mapped__is_goods'] = true;
            //     }
            //     if ($(eleType).val() === "2") {
            //         params['general_product_types_mapped__is_tool'] = true;
            //     }
            //     LeaseOrderDataTableHandle.$tableSOffset.DataTable().destroy();
            //     LeaseOrderDataTableHandle.dataTableSelectOffset(params);
            // }
        }
        return true;
    };

    static loadStoreSTool(ele) {
        let dataSelected = {};
        let row = ele.closest('tr');
        if (row) {
            let rowIndex = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(rowIndex);
            let dataRow = $row.data();
            if (dataRow?.['tool_data']) {
                for (let toolData of dataRow?.['tool_data']) {
                    if (toolData?.['tool_data']?.['id']) {
                        dataSelected[toolData?.['tool_data']?.['id']] = {
                            "type": "selected",
                            "data": toolData?.['tool_data'],
                        };
                    }

                }
            }
        }
        LeaseOrderLoadDataHandle.$toolsCheckedEle.val(JSON.stringify(dataSelected));
        return true;
    };

    static loadStoreCheckTool(ele) {
        let row = ele.closest('tr');
        let rowIndex = LeaseOrderDataTableHandle.$tableSTool.DataTable().row(row).index();
        let $row = LeaseOrderDataTableHandle.$tableSTool.DataTable().row(rowIndex);
        let dataRow = $row.data();
        let checkEle = row.querySelector('.table-row-checkbox');
        let quantityEle = row.querySelector('.table-row-quantity');
        if (dataRow && checkEle && quantityEle) {
            dataRow['product_quantity'] = 0;
            if ($(quantityEle).val()) {
                dataRow['product_quantity'] = parseFloat($(quantityEle).val());
            }
            if (LeaseOrderLoadDataHandle.$toolsCheckedEle.val()) {
                let storeID = JSON.parse(LeaseOrderLoadDataHandle.$toolsCheckedEle.val());
                if (typeof storeID === 'object') {
                    if (checkEle.checked === true) {
                        storeID[dataRow?.['id']] = {
                            "type": "current",
                            "data": dataRow,
                        };
                    }
                    if (checkEle.checked === false) {
                        if (storeID?.[dataRow?.['id']]) {
                            delete storeID?.[dataRow?.['id']];
                        }
                    }
                    LeaseOrderLoadDataHandle.$toolsCheckedEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (checkEle.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                LeaseOrderLoadDataHandle.$toolsCheckedEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    };

    static loadModalSTool(ele) {
        let row = ele.closest('tr');
        LeaseOrderDataTableHandle.$tableSTool.DataTable().clear().draw();
        if (row) {
            LeaseOrderLoadDataHandle.loadStoreSTool(ele);
            LeaseOrderDataTableHandle.$tableSTool.DataTable().destroy();
            LeaseOrderDataTableHandle.dataTableSelectTool();
        }
        return true;
    };

    static loadStoreSAsset(ele) {
        let dataSelected = {};
        let row = ele.closest('tr');
        if (row) {
            let rowIndex = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(rowIndex);
            let dataRow = $row.data();
            if (dataRow?.['asset_data']) {
                for (let assetData of dataRow?.['asset_data']) {
                    if (assetData?.['asset_data']?.['id']) {
                        dataSelected[assetData?.['asset_data']?.['id']] = {
                            "type": "selected",
                            "data": assetData?.['asset_data'],
                        };
                    }

                }
            }
        }
        LeaseOrderLoadDataHandle.$assetsCheckedEle.val(JSON.stringify(dataSelected));
        return true;
    };

    static loadStoreCheckAsset(ele) {
        let row = ele.closest('tr');
        let rowIndex = LeaseOrderDataTableHandle.$tableSAsset.DataTable().row(row).index();
        let $row = LeaseOrderDataTableHandle.$tableSAsset.DataTable().row(rowIndex);
        let dataRow = $row.data();

        if (dataRow) {
            if (LeaseOrderLoadDataHandle.$assetsCheckedEle.val()) {
                let storeID = JSON.parse(LeaseOrderLoadDataHandle.$assetsCheckedEle.val());
                if (typeof storeID === 'object') {
                    if (ele.checked === true) {
                        if (!storeID?.[dataRow?.['id']]) {
                            storeID[dataRow?.['id']] = {
                                "type": "current",
                                "data": dataRow,
                            };
                        }
                    }
                    if (ele.checked === false) {
                        if (storeID?.[dataRow?.['id']]) {
                            delete storeID?.[dataRow?.['id']];
                        }
                    }
                    LeaseOrderLoadDataHandle.$assetsCheckedEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (ele.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                LeaseOrderLoadDataHandle.$assetsCheckedEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    };

    static loadModalSAsset(ele) {
        let row = ele.closest('tr');
        if (row) {
            LeaseOrderLoadDataHandle.loadStoreSAsset(ele);
            LeaseOrderDataTableHandle.$tableSAsset.DataTable().destroy();
            LeaseOrderDataTableHandle.dataTableSelectAsset();
        }
        return true;
    };

    static loadModalSTerm(ele) {
        let row = ele.closest('tr');
        if (row) {
            let orderEle = row.querySelector('.table-row-order');
            if (orderEle) {
                LeaseOrderLoadDataHandle.$btnSaveTerm.attr('data-id', orderEle.innerHTML);
            }
        }
        let term = [];
        if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.paymentSelectEle, LeaseOrderLoadDataHandle.paymentSelectEle.val());
            if (dataSelected) {
                term = dataSelected?.['term'];
                let type = "percent";
                for (let termData of term) {
                    if (termData?.['unit_type'] === 1) {
                        type = "amount";
                    }
                    let isNum = parseFloat(termData?.['value']);
                    if (!isNum) {  // balance
                        termData['value'] = String(LeaseOrderLoadDataHandle.loadParseBalanceOfTerm("invoice"));
                        if (type === "percent") {
                            termData['unit_type'] = 0;
                        }
                        if (type === "amount") {
                            termData['unit_type'] = 1;
                        }
                    }
                }
            }
        }
        LeaseOrderDataTableHandle.$tableSTerm.DataTable().clear().draw();
        LeaseOrderDataTableHandle.$tableSTerm.DataTable().rows.add(term).draw();
        return true;
    };

    static loadModalSInvoice(ele) {
        let row = ele.closest('tr');
        if (row) {
            let orderEle = row.querySelector('.table-row-order');
            if (orderEle) {
                LeaseOrderLoadDataHandle.$btnSaveInvoice.attr('data-id', orderEle.innerHTML);
            }
        }
        let datas = LeaseOrderSubmitHandle.setupDataInvoice();
        LeaseOrderDataTableHandle.$tableSInvoice.DataTable().clear().draw();
        LeaseOrderDataTableHandle.$tableSInvoice.DataTable().rows.add(datas).draw();
        return true;
    };

    static loadModalSReconcile(ele) {
        let row = ele.closest('tr');
        if (row) {
            let orderEle = row.querySelector('.table-row-order');
            if (orderEle) {
                LeaseOrderLoadDataHandle.$btnSaveReconcile.attr('data-id', orderEle.innerHTML);
            }
        }
        let fnData = [];
        let check = parseInt(LeaseOrderLoadDataHandle.$btnSaveReconcile.attr('data-id'));
        let datas = LeaseOrderSubmitHandle.setupDataPaymentStage();
        for (let data of datas) {
            if (data?.['order'] < check && data?.['invoice'] === null) {
                fnData.push(data);
            }
        }
        LeaseOrderDataTableHandle.$tableSReconcile.DataTable().clear().draw();
        LeaseOrderDataTableHandle.$tableSReconcile.DataTable().rows.add(fnData).draw();
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

    static loadTableCopyQuotation() {
        LeaseOrderDataTableHandle.$tableQuotationCopy.DataTable().destroy();
        LeaseOrderDataTableHandle.dataTableCopyQuotation();
        return true;
    };

    static loadShippingBillingCustomer(data = {}) {
        let item = data ? data : {};
        let modalShippingContent = $('#quotation-create-modal-shipping-body')[0].querySelector('.modal-body');
        let modalBillingContent = $('#quotation-create-modal-billing-body')[0].querySelector('.modal-body');
        if (modalShippingContent && modalBillingContent) {
            $(modalShippingContent).empty();
            $(modalBillingContent).empty();
            if (item) {
                if (item?.['shipping_address']) {
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
                if (item?.['billing_address']) {
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
        }
    };

    // TABLE PRODUCT
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
        if (LeaseOrderLoadDataHandle.$productsCheckedEle.val()) {
            let storeID = JSON.parse(LeaseOrderLoadDataHandle.$productsCheckedEle.val());
            for (let key in storeID) {
                if (!LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${storeID[key]?.['data']?.['id']}"]`)) {
                    LeaseOrderLoadDataHandle.loadAddRowProduct(storeID[key]?.['data']);
                }
            }
        }
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
            "asset_type": 1,

            "uom_time_id": dataUOMTime?.['id'],
            "uom_time_data": dataUOMTime,
            "tax_id": dataTax?.['id'],
            "tax_data": dataTax,


            "product_quantity": 0,
            "product_quantity_time": 0,
            "product_tax_value": 0,
            "product_tax_amount": 0,
            "product_unit_price": 0,
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

    static loadChangeAssetType(ele) {
        let row = ele.closest('tr');
        if (row) {
            let offsetEle = row.querySelector('.table-row-offset');
            let offsetShowEle = row.querySelector('.table-row-offset-show');
            let btnSOffsetEle = row.querySelector('.btn-select-offset');
            let quantityEle = row.querySelector('.table-row-quantity');
            if (offsetShowEle && btnSOffsetEle && offsetEle && quantityEle) {
                let bsTarget = "";
                quantityEle.setAttribute('readonly', 'true');
                if ($(ele).val() === "1") {
                    bsTarget = "#selectOffsetModal";
                }
                if ($(ele).val() === "2") {
                    bsTarget = "#selectToolModal";
                }
                if ($(ele).val() === "3") {
                    bsTarget = "#selectAssetModal";
                }
                offsetShowEle.innerHTML = "";
                btnSOffsetEle.setAttribute('data-bs-target', bsTarget);
                btnSOffsetEle.removeAttribute('disabled');
            }
        }
        return true;
    };

    static loadOffset(ele) {
        let target = LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${$(ele).attr('data-product-id')}"]`);
        if (target) {
            let rowTarget = target.closest('tr');
            if (rowTarget) {
                let itemEle = rowTarget.querySelector('.table-row-item');
                let uomEle = rowTarget.querySelector('.table-row-uom');
                let offsetDataEle = rowTarget.querySelector('.table-row-offset-data');
                let quantityEle = rowTarget.querySelector('.table-row-quantity');
                if (itemEle && uomEle && offsetDataEle && quantityEle) {
                    let uomData = [];
                    let offsetData = [];
                    let quantity = 0;
                    if (LeaseOrderLoadDataHandle.$offsetsCheckedEle.val()) {
                        let storeID = JSON.parse(LeaseOrderLoadDataHandle.$offsetsCheckedEle.val());
                        for (let key in storeID) {
                            let itemData = SelectDDControl.get_data_from_idx($(itemEle), $(itemEle).val());
                            if (itemData?.['id']) {
                                offsetData.push({
                                    "product_id": itemData?.['id'],
                                    "product_data": itemData,
                                    "offset_id": storeID[key]?.['data']?.['id'],
                                    "offset_data": storeID[key]?.['data'],
                                    "product_quantity": storeID[key]?.['data']?.['product_quantity'],
                                });
                                quantity += storeID[key]?.['data']?.['product_quantity'];
                            }
                            if (storeID[key]?.['data']?.['sale_information']?.['default_uom']?.['id']) {
                                uomData = [storeID[key]?.['data']?.['sale_information']?.['default_uom']];
                            }
                        }
                    }
                    FormElementControl.loadInitS2($(uomEle), uomData);
                    $(offsetDataEle).val(JSON.stringify(offsetData));
                    $(quantityEle).val(quantity);
                }
            }
        }
        return true;
    };

    static loadTool(ele) {
        let target = LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${$(ele).attr('data-product-id')}"]`);
        if (target) {
            let rowTarget = target.closest('tr');
            if (rowTarget) {
                let itemEle = rowTarget.querySelector('.table-row-item');
                let uomEle = rowTarget.querySelector('.table-row-uom');
                let toolDataEle = rowTarget.querySelector('.table-row-tool-data');
                let quantityEle = rowTarget.querySelector('.table-row-quantity');
                if (itemEle && uomEle && toolDataEle && quantityEle) {
                    let uomData = [];
                    let toolData = [];
                    let quantity = 0;
                    if (LeaseOrderLoadDataHandle.$toolsCheckedEle.val()) {
                        let storeID = JSON.parse(LeaseOrderLoadDataHandle.$toolsCheckedEle.val());
                        for (let key in storeID) {
                            let itemData = SelectDDControl.get_data_from_idx($(itemEle), $(itemEle).val());
                            if (itemData?.['id']) {
                                toolData.push({
                                    "product_id": itemData?.['id'],
                                    "product_data": itemData,
                                    "tool_id": storeID[key]?.['data']?.['id'],
                                    "tool_data": storeID[key]?.['data'],
                                    "product_quantity": storeID[key]?.['data']?.['product_quantity'],
                                });
                                quantity += storeID[key]?.['data']?.['product_quantity'];
                            }
                            if (storeID[key]?.['data']?.['product_data']?.['sale_information']?.['default_uom']?.['id']) {
                                uomData = [storeID[key]?.['data']?.['product_data']?.['sale_information']?.['default_uom']];
                            }
                        }
                    }
                    FormElementControl.loadInitS2($(uomEle), uomData);
                    $(toolDataEle).val(JSON.stringify(toolData));
                    $(quantityEle).val(quantity);
                }
            }
        }
        return true;
    };

    static loadAsset(ele) {
        let target = LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${$(ele).attr('data-product-id')}"]`);
        if (target) {
            let rowTarget = target.closest('tr');
            if (rowTarget) {
                let itemEle = rowTarget.querySelector('.table-row-item');
                let uomEle = rowTarget.querySelector('.table-row-uom');
                let assetDataEle = rowTarget.querySelector('.table-row-asset-data');
                let quantityEle = rowTarget.querySelector('.table-row-quantity');
                if (itemEle && uomEle && assetDataEle && quantityEle) {
                    let uomData = [];
                    let assetData = [];

                    if (LeaseOrderLoadDataHandle.$assetsCheckedEle.val()) {
                        let storeID = JSON.parse(LeaseOrderLoadDataHandle.$assetsCheckedEle.val());
                        for (let key in storeID) {
                            let itemData = SelectDDControl.get_data_from_idx($(itemEle), $(itemEle).val());
                            if (itemData?.['id']) {
                                assetData.push({
                                    "product_id": itemData?.['id'],
                                    "product_data": itemData,
                                    "asset_id": storeID[key]?.['data']?.['id'],
                                    "asset_data": storeID[key]?.['data'],
                                    "product_quantity": 1,
                                });
                            }
                            if (storeID[key]?.['data']?.['product_data']?.['sale_information']?.['default_uom']?.['id']) {
                                uomData = [storeID[key]?.['data']?.['product_data']?.['sale_information']?.['default_uom']];
                            }
                        }
                    }
                    FormElementControl.loadInitS2($(uomEle), uomData);
                    $(assetDataEle).val(JSON.stringify(assetData));
                    $(quantityEle).val(assetData.length);
                }
            }
        }
        return true;
    };

    static loadPriceProduct(productELe) {
        let dataZone = "lease_products_data";
        if ($(productELe).val()) {
            let productData = SelectDDControl.get_data_from_idx($(productELe), $(productELe).val());
            let row = productELe.closest('tr');
            if (productData && row) {
                let data = productData;
                let priceGrEle = row.querySelector('.input-group-price');
                let priceEle = row.querySelector('.table-row-price');
                let modalBody = LeaseOrderLoadDataHandle.$priceModal[0].querySelector('.modal-body');
                // load PRICE
                if (priceGrEle && priceEle && modalBody) {
                    let account_price_id = null;
                    let dataAcc = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.customerSelectEle, LeaseOrderLoadDataHandle.customerSelectEle.val());
                    if (dataAcc) {
                        if (dataAcc?.['price_list_mapped']?.['id']) {
                            account_price_id = dataAcc?.['price_list_mapped']?.['id']
                        }
                    }
                    let lastPrice = 0;
                    $(modalBody).empty();
                    let htmlPriceList = `<div class="mb-4 product-target" data-product-id="${productData?.['id']}"><i class="fas fa-cube mr-2"></i><b>${productData?.['title']}</b></div>`;
                    if (Array.isArray(data?.['price_list']) && data?.['price_list'].length > 0) {
                        let typeChecked = 0;
                        if (priceGrEle.getAttribute('data-price-id')) {
                            typeChecked = 1;
                        }
                        for (let priceData of data?.['price_list']) {
                            if (priceData?.['price_status'] === 1) {
                                let checked = '';
                                if (typeChecked === 0) {  // Load default
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
                                if (typeChecked === 1) {  // Set checked to price checked before
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
        WindowControl.showLoading();
        $.fn.callAjax2(
            {
                'url': LeaseOrderLoadDataHandle.urlEle.attr('data-quotation-detail').format_url_with_uuid(select_id),
                'method': "GET",
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
        // if page detail use data products of detail else use realtime data products in dtb
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let detailDataEle = $('#quotation-detail-data');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
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
                let detailDataEle = $('#quotation-detail-data');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
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
        // Load dropdowns
        LeaseOrderLoadDataHandle.loadDropDowns(LeaseOrderDataTableHandle.$tableProduct);
        // Load price
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            LeaseOrderLoadDataHandle.loadReInitPrice(dataPriceJSON);
        }
        LeaseOrderDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let productEle = row.querySelector('.table-row-item');
            let shippingEle = row.querySelector('.table-row-shipping');
            let promotionEle = row.querySelector('.table-row-promotion');
            LeaseOrderCheckConfigHandle.checkConfig(1, row);
            if (productEle) {
                LeaseOrderLoadDataHandle.loadPriceProduct(productEle);
            }
            if (shippingEle || promotionEle) {
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
            let detailDataEle = $('#quotation-detail-data');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
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
                let detailDataEle = $('#quotation-detail-data');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
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

    static loadReInitDataTableExpense() {
        let tableData = [];
        let dataDetail = {};
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let detailDataEle = $('#quotation-detail-data');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
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
                let detailDataEle = $('#quotation-detail-data');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
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
            let detailDataEle = $('#quotation-detail-data');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
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
                let detailDataEle = $('#quotation-detail-data');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
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

    static loadReInitDataTableInvoice() {
        let tableData = [];
        let dataDetail = {};
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let detailDataEle = $('#quotation-detail-data');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
                    tableData = dataDetail?.['lease_invoice'];
                }
            }
        } else {
            LeaseOrderDataTableHandle.$tableInvoice.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = LeaseOrderDataTableHandle.$tableInvoice.DataTable().row(row).index();
                let $row = LeaseOrderDataTableHandle.$tableInvoice.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let detailDataEle = $('#quotation-detail-data');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
                        tableData = dataDetail?.['lease_invoice'];
                    }
                }
            }
        }
        LeaseOrderDataTableHandle.$tableInvoice.DataTable().destroy();
        LeaseOrderDataTableHandle.dataTableInvoice();
        LeaseOrderDataTableHandle.$tableInvoice.DataTable().rows.add(tableData).draw();
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            LeaseOrderLoadDataHandle.loadTableDisabled(LeaseOrderDataTableHandle.$tableInvoice);
        }
        $.fn.initMaskMoney2();
        // set again WF runtime
        LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitPrice(data) {
        LeaseOrderDataTableHandle.$tableProduct.DataTable().rows().every(function () {
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
    static loadParseBalanceOfTerm(invoice_or_payment) {
        let type = "percent";
        let totalValue = 0;
        let term = [];
        if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.paymentSelectEle, LeaseOrderLoadDataHandle.paymentSelectEle.val());
            if (dataSelected) {
                term = dataSelected?.['term'];
                for (let termDataCheck of term) {
                    if (termDataCheck?.['unit_type'] === 1) {
                        type = "amount";
                    }
                    if (parseFloat(termDataCheck?.['value'])) {
                        totalValue += parseFloat(termDataCheck?.['value']);
                    }
                }
            }
        }
        if (type === "percent") {
            return 100 - totalValue;
        }
        if (type === "amount") {
            let valueSO = 0;
            let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
            if (tableProductWrapper) {
                let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                if (tableProductFt) {
                    if (invoice_or_payment === "invoice") {
                        let eleTotal = tableProductFt.querySelector('.quotation-create-product-total-raw');
                        if (eleTotal) {
                            valueSO = parseFloat(eleTotal.value);
                            return valueSO - totalValue;
                        }
                    }
                    if (invoice_or_payment === "payment") {
                        let elePretax = tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw');
                        let eleDiscount = tableProductFt.querySelector('.quotation-create-product-discount-amount-raw');
                        if (elePretax && eleDiscount) {
                            valueSO = parseFloat(elePretax.value) - parseFloat(eleDiscount.value);
                            return valueSO - totalValue;
                        }
                    }
                }
            }
        }
        return 0;
    };

    static loadChangePaymentTerm() {
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            LeaseOrderDataTableHandle.$tableInvoice.DataTable().clear().draw();
            LeaseOrderDataTableHandle.$tablePayment.DataTable().clear().draw();
            $('#btn-load-payment-stage')[0].setAttribute('hidden', 'true');
            $('#btn-add-payment-stage')[0].setAttribute('hidden', 'true');
            if (!LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
                $('#btn-add-payment-stage')[0].removeAttribute('hidden');
            }
            if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
                $('#btn-load-payment-stage')[0].removeAttribute('hidden');
            }
        }
        return true;
    };

    // TABLE PAYMENT STAGE
    static loadAddPaymentStage() {
        let order = LeaseOrderDataTableHandle.$tablePayment[0].querySelectorAll('.table-row-order').length + 1;
        let dataAdd = {
            'order': order,
            'ratio': 0,
            'value_before_tax': 0,
            'is_ar_invoice': false,
        };
        LeaseOrderDataTableHandle.$tablePayment.DataTable().row.add(dataAdd).draw().node();
        // mask money
        $.fn.initMaskMoney2();
        return true;
    };

    static loadPaymentStage() {
        let datas = [];
        if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.paymentSelectEle, LeaseOrderLoadDataHandle.paymentSelectEle.val());
            if (dataSelected) {
                let terms = dataSelected?.['term'] ? dataSelected?.['term'] : [];
                let order = 1;
                for (let term of terms) {
                    datas.push({
                        'order': order,
                        'term_id': term?.['id'],
                    })
                    order++;
                }
            }
        }
        LeaseOrderDataTableHandle.$tablePayment.DataTable().clear().draw();
        LeaseOrderDataTableHandle.$tablePayment.DataTable().rows.add(datas).draw();

        LeaseOrderDataTableHandle.$tablePayment.DataTable().rows().every(function () {
            let row = this.node();
            let installmentEle = row.querySelector('.table-row-installment');
            if (installmentEle) {
                $(installmentEle).trigger('change');
            }
        })
        return true;
    };

    static loadChangeInstallment(ele) {
        let row = ele.closest('tr');
        let dataDateType = JSON.parse($('#payment_date_type').text());
        let remarkELe = row.querySelector('.table-row-remark');
        let ratioEle = row.querySelector('.table-row-ratio');
        let eleDate = row.querySelector('.table-row-date');
        let valBeforeEle = row.querySelector('.table-row-value-before-tax');
        let valReconcileEle = row.querySelector('.table-row-value-reconcile');
        let valTotalEle = row.querySelector('.table-row-value-total');
        let dueDateEle = row.querySelector('.table-row-due-date');
        if ($(ele).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx($(ele), $(ele).val());
            if (remarkELe && ratioEle && eleDate && valBeforeEle && valTotalEle && dueDateEle && dataSelected && dataDateType) {
                let rowIndex = LeaseOrderDataTableHandle.$tablePayment.DataTable().row(row).index();
                let $row = LeaseOrderDataTableHandle.$tablePayment.DataTable().row(rowIndex);
                let dataRow = $row.data();
                $(remarkELe).val(dataDateType[dataSelected?.['after']][1]);
                if (dataRow?.['remark']) {
                    $(remarkELe).val(dataRow?.['remark']);
                }
                ratioEle.setAttribute('readonly', 'true');
                $(ratioEle).val('');
                if (dataSelected?.['value']) {
                    if (dataSelected?.['unit_type'] === 0 || dataSelected?.['unit_type'] === 2) {
                        $(ratioEle).val(parseFloat(dataSelected?.['value']));
                        LeaseOrderLoadDataHandle.loadPaymentValues(ratioEle);
                    }
                    if (dataSelected?.['unit_type'] === 1) {
                        $(valBeforeEle).attr('value', String(dataSelected?.['value']));
                        if (!$(valReconcileEle).valCurrency()) {
                            $(valTotalEle).attr('value', String(dataSelected?.['value']));
                        }
                    }
                }
                // dueDateEle.setAttribute('disabled', 'true');
                let date = $(eleDate).val();
                if (date && dataSelected?.['no_of_days']) {
                    let dueDate = calculateDate(date, {'number_day_after': parseInt(dataSelected?.['no_of_days'])});
                    if (dueDate) {
                        $(dueDateEle).val(dueDate);
                    }
                    if (dataRow?.['due_date']) {
                        $(dueDateEle).val(DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', dataRow?.['due_date']));
                    }
                }
            }
        } else {
            if (ratioEle && valBeforeEle && dueDateEle) {
                if (["post", "put"].includes(LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    ratioEle.removeAttribute('readonly');
                    dueDateEle.removeAttribute('disabled');
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

    static loadPaymentValues(ele) {
        let row = ele.closest('tr');
        if (row) {
            let ratioEle = row.querySelector('.table-row-ratio');
            let valBeforeEle = row.querySelector('.table-row-value-before-tax');
            let valReconcileEle = row.querySelector('.table-row-value-reconcile');
            let taxEle = row.querySelector('.table-row-tax');
            let valTaxEle = row.querySelector('.table-row-value-tax');
            let valTotalEle = row.querySelector('.table-row-value-total');
            if (ratioEle && valBeforeEle && valReconcileEle && taxEle && valTaxEle && valTotalEle) {
                let valBefore = $(valBeforeEle).valCurrency();
                if ($(ratioEle).val()) {
                    let ratio = parseFloat($(ratioEle).val());
                    if (ratio > 0) {
                        let valueSO = 0;
                        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
                        if (tableProductWrapper) {
                            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                            if (tableProductFt) {
                                let elePretax = tableProductFt.querySelector('.quotation-create-product-pretax-amount-raw');
                                let eleDiscount = tableProductFt.querySelector('.quotation-create-product-discount-amount-raw');
                                if (elePretax && eleDiscount) {
                                    valueSO = parseFloat(elePretax.value) - parseFloat(eleDiscount.value);
                                    valBefore = ratio * valueSO / 100;
                                }
                            }
                        }
                    }
                }
                $(valBeforeEle).attr('value', valBefore);
                $(valTotalEle).attr('value', valBefore + $(valTaxEle).valCurrency());
                let taxData = SelectDDControl.get_data_from_idx($(taxEle), $(taxEle).val());
                if (taxData?.['rate']) {
                    let datasRelateTax1 = LeaseOrderCalculateCaseHandle.getDatasRelateTax(valBefore, taxData?.['rate']);
                    $(valTaxEle).attr('value', datasRelateTax1?.['valTax']);
                    $(valTotalEle).attr('value', datasRelateTax1?.['valAfter']);

                    if ($(valReconcileEle).valCurrency() > 0) {
                        let datasRelateTax2 = LeaseOrderCalculateCaseHandle.getDatasRelateTax($(valReconcileEle).valCurrency(), taxData?.['rate']);
                        $(valTaxEle).attr('value', datasRelateTax1?.['valTax'] + datasRelateTax2?.['valTax']);
                        $(valTotalEle).attr('value', datasRelateTax1?.['valAfter'] + datasRelateTax2?.['valTax']);
                    }
                }
                // mask money
                $.fn.initMaskMoney2();
            }
        }

        return true;
    };

    static loadAddInvoice() {
        let total = 0;
        LeaseOrderDataTableHandle.$tableInvoice.DataTable().rows().every(function () {
            let row = this.node();
            let totalEle = row.querySelector('.table-row-total');
            if (totalEle) {
                if ($(totalEle).valCurrency()) {
                    total += $(totalEle).valCurrency();
                }
            }
        });
        if (total > 0) {
            let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
            if (tableProductWrapper) {
                let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                if (tableProductFt) {
                    let totalSOEle = tableProductFt.querySelector('.quotation-create-product-total-raw');
                    if (totalSOEle) {
                        let totalSO = parseFloat(totalSOEle.value);
                        if (total >= totalSO) {
                            $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-paid-in-full')}, 'failure');
                            return false;
                        }
                    }
                }
            }
        }

        let orderEleList = LeaseOrderDataTableHandle.$tableInvoice[0].querySelectorAll('.table-row-order');

        LeaseOrderDataTableHandle.$tableInvoice.DataTable().row.add({"order": (orderEleList.length + 1)}).draw();
        return true;
    };

    static loadSaveSTerm() {
        let target = LeaseOrderDataTableHandle.$tableInvoice[0].querySelector(`[data-id="${LeaseOrderLoadDataHandle.$btnSaveTerm.attr('data-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');
            if (targetRow) {
                let termDataEle = targetRow.querySelector('.table-row-term-data');
                let ratioEle = targetRow.querySelector('.table-row-ratio');
                let totalEle = targetRow.querySelector('.table-row-total');
                let balanceEle = targetRow.querySelector('.table-row-balance');
                if (termDataEle && ratioEle && totalEle && balanceEle) {
                    let termData = [];
                    let ratio = 0;
                    let amount = 0;
                    for (let checkedEle of LeaseOrderDataTableHandle.$tableSTerm[0].querySelectorAll('.table-row-checkbox:checked')) {
                        let row = checkedEle.closest('tr');
                        if (row) {
                            let rowIndex = LeaseOrderDataTableHandle.$tableSTerm.DataTable().row(row).index();
                            let $row = LeaseOrderDataTableHandle.$tableSTerm.DataTable().row(rowIndex);
                            let dataRow = $row.data();
                            termData.push(dataRow);
                            if (dataRow?.['unit_type'] === 0 || dataRow?.['unit_type'] === 2) {
                                ratio += parseFloat(dataRow?.['value'] ? dataRow?.['value'] : "0");
                            }
                            if (dataRow?.['unit_type'] === 1) {
                                amount += parseFloat(dataRow?.['value'] ? dataRow?.['value'] : "0");
                            }
                        }
                    }
                    $(termDataEle).val(JSON.stringify(termData));
                    $(ratioEle).val('');
                    $(totalEle).attr('value', String(0));
                    $(balanceEle).attr('value', String(0));
                    $.fn.initMaskMoney2();
                    if (ratio > 0) {
                        $(ratioEle).val(ratio);
                        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
                        if (tableProductWrapper) {
                            let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                            if (tableProductFt) {
                                let totalSOEle = tableProductFt.querySelector('.quotation-create-product-total-raw');
                                if (totalSOEle) {
                                    let totalSO = parseFloat(totalSOEle.value);
                                    let total = (ratio * totalSO) / 100;
                                    $(totalEle).attr('value', String(total));
                                    $(balanceEle).attr('value', String(total));
                                    $.fn.initMaskMoney2();
                                }
                            }
                        }
                    }
                    if (amount > 0) {
                        $(totalEle).attr('value', String($(totalEle).valCurrency() + amount));
                        $(balanceEle).attr('value', String($(balanceEle).valCurrency() + amount));
                        $.fn.initMaskMoney2();
                    }
                }
            }
        }
        return true;
    };

    static loadSaveSInvoice() {
        let target = LeaseOrderDataTableHandle.$tablePayment[0].querySelector(`[data-id="${LeaseOrderLoadDataHandle.$btnSaveInvoice.attr('data-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');
            if (targetRow) {
                let dateEle = targetRow.querySelector('.table-row-date');
                let invoiceEle = targetRow.querySelector('.table-row-invoice');
                let invoiceDataEle = targetRow.querySelector('.table-row-invoice-data');
                let valBeforeEle = targetRow.querySelector('.table-row-value-before-tax');
                let taxEle = targetRow.querySelector('.table-row-tax');
                let valTaxEle = targetRow.querySelector('.table-row-value-tax');
                let valTotalEle = targetRow.querySelector('.table-row-value-total');

                let checkedEle = LeaseOrderDataTableHandle.$tableSInvoice[0].querySelector('.table-row-checkbox:checked');
                if (checkedEle && dateEle && invoiceEle && invoiceDataEle && valBeforeEle && taxEle && valTaxEle && valTotalEle) {
                    let row = checkedEle.closest('tr');
                    if (row) {
                        let rowIndex = LeaseOrderDataTableHandle.$tableSInvoice.DataTable().row(row).index();
                        let $row = LeaseOrderDataTableHandle.$tableSInvoice.DataTable().row(rowIndex);
                        let dataRow = $row.data();

                        $(dateEle).val(moment(dataRow?.['date']).format('DD/MM/YYYY')).trigger('change');
                        $(invoiceEle).val(dataRow?.['order']);
                        $(invoiceDataEle).val(JSON.stringify(dataRow));
                        FormElementControl.loadInitS2($(taxEle), [dataRow?.['tax_data']]);

                        $(valBeforeEle).trigger('change');
                    }
                }
            }
        }
        return true;
    };

    static loadSaveSReconcile() {
        let target = LeaseOrderDataTableHandle.$tablePayment[0].querySelector(`[data-id="${LeaseOrderLoadDataHandle.$btnSaveReconcile.attr('data-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');
            if (targetRow) {
                let valBeforeEle = targetRow.querySelector('.table-row-value-before-tax');
                let valReconcileEle = targetRow.querySelector('.table-row-value-reconcile');
                let reconcileDataEle = targetRow.querySelector('.table-row-reconcile-data');
                let reconcile = 0;
                let reconcileData = [];
                for (let checkedEle of LeaseOrderDataTableHandle.$tableSReconcile[0].querySelectorAll('.table-row-checkbox:checked')) {
                    let row = checkedEle.closest('tr');
                    let rowIndex = LeaseOrderDataTableHandle.$tableSReconcile.DataTable().row(row).index();
                    let $row = LeaseOrderDataTableHandle.$tableSReconcile.DataTable().row(rowIndex);
                    let dataRow = $row.data();
                    reconcile += dataRow?.['value_total'];
                    reconcileData.push(dataRow);
                }
                if (valBeforeEle && valReconcileEle && reconcileDataEle) {
                    $(valReconcileEle).attr('value', reconcile);
                    $.fn.initMaskMoney2();
                    $(valBeforeEle).trigger('change');
                    $(reconcileDataEle).val(JSON.stringify(reconcileData));
                }
            }
        }
        return true;
    };

    static loadMinusBalance() {
        LeaseOrderDataTableHandle.$tableInvoice.DataTable().rows().every(function () {
            let rowI = this.node();
            let rowIndex = LeaseOrderDataTableHandle.$tableInvoice.DataTable().row(rowI).index();
            let $row = LeaseOrderDataTableHandle.$tableInvoice.DataTable().row(rowIndex);
            let dataRow = $row.data();

            let totalEle = rowI.querySelector('.table-row-total');
            let balanceEle = rowI.querySelector('.table-row-balance');
            if (totalEle && balanceEle) {
                $(balanceEle).attr('value', String($(totalEle).valCurrency()));
                $.fn.initMaskMoney2();
                let balance = 0;

                LeaseOrderDataTableHandle.$tablePayment.DataTable().rows().every(function () {
                    let rowP = this.node();
                    let invoiceDataEle = rowP.querySelector('.table-row-invoice-data');
                    let valBeforeEle = rowP.querySelector('.table-row-value-before-tax');
                    let valReconcileEle = rowP.querySelector('.table-row-value-reconcile');
                    let valTaxEle = rowP.querySelector('.table-row-value-tax');
                    if (invoiceDataEle && valBeforeEle && valReconcileEle && valTaxEle) {
                        if ($(invoiceDataEle).val()) {
                            let invoiceData = JSON.parse($(invoiceDataEle).val());
                            let before = parseFloat($(valBeforeEle).valCurrency());
                            let reconcile = parseFloat($(valReconcileEle).valCurrency());
                            let tax = parseFloat($(valTaxEle).valCurrency());
                            if (dataRow?.['order'] === invoiceData?.['order']) {
                                balance += (before + reconcile + tax);
                            }
                        }
                    }

                });
                $(balanceEle).attr('value', String($(balanceEle).valCurrency() - balance));
                $.fn.initMaskMoney2();
            }
        });
        LeaseOrderStoreDataHandle.storeDtbData(5);
    };

    static loadCheckSameMixTax() {
        let listTaxID = [];
        let listTax = [];
        LeaseOrderDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let taxEle = row.querySelector('.table-row-tax');
            if (taxEle) {
                if ($(taxEle).val()) {
                    let taxData = SelectDDControl.get_data_from_idx($(taxEle), $(taxEle).val());
                    listTaxID.push(taxData?.['id']);
                    listTax.push(taxData);
                }
                if (!$(taxEle).val()) {
                    listTaxID.push(null);
                    listTax.push({});
                }
            }
        });
        return {"check": listTaxID.every(val => val === listTaxID[0]) ? "same" : "mixed", "list_tax": listTax};
    };

    // TABLE COST
    static loadDataTableCost() {
        /*
        asset_type = '1' (product): use product_data {} and offset_data [] to set data row
        asset_type = '2' (tool): use product_data {} and for data in tool_data [] to set data row
        asset_type = '3' (asset): use product_data {} and for data in asset_data [] to set data row
        */
        let $table = $('#datable-quotation-create-cost');
        let $tableProduct = $('#datable-quotation-create-product');
        // Store old cost
        let storeCost = {};
        $table.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = LeaseOrderDataTableHandle.$tableCost.DataTable().row(row).index();
            let $row = LeaseOrderDataTableHandle.$tableCost.DataTable().row(rowIndex);
            let dataRow = $row.data();

            if (dataRow?.['offset_data']?.['id']) {
                if (!storeCost.hasOwnProperty(dataRow?.['offset_data']?.['id'])) {
                    storeCost[dataRow?.['offset_data']?.['id']] = dataRow;
                }
            }
            if (dataRow?.['tool_data']?.['id']) {
                if (!storeCost.hasOwnProperty(dataRow?.['tool_data']?.['id'])) {
                    storeCost[dataRow?.['tool_data']?.['id']] = dataRow;
                }
            }
            if (dataRow?.['asset_data']?.['id']) {
                if (!storeCost.hasOwnProperty(dataRow?.['asset_data']?.['id'])) {
                    storeCost[dataRow?.['asset_data']?.['id']] = dataRow;
                }
            }
        });
        // Clear table
        $table.DataTable().clear().draw();
        let pretaxEle = $table[0].querySelector('.quotation-create-cost-pretax-amount');
        let taxEle = $table[0].querySelector('.quotation-create-cost-taxes');
        let totalEle = $table[0].querySelector('.quotation-create-cost-total');
        if (pretaxEle && taxEle && totalEle) {
            pretaxEle.innerHTML = "0";
            taxEle.innerHTML = "0";
            totalEle.innerHTML = "0";
        }
        // Begin load data
        if ($table.DataTable().data().count() === 0) {
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
            if (isHidden === true) {  // Product is zone hidden => use data product from data detail
                let storeDetail = JSON.parse(LeaseOrderLoadDataHandle.$eleStoreDetail.val());
                for (let data of storeDetail?.[dataZone]) {
                    let valueSubtotal = 0;
                    let valueQuantity = 0;
                    // asset_type = 3: Asset
                    for (let assetData of data?.['asset_data'] ? data?.['asset_data'] : []) {
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_id": data?.['product_data']?.['id'],
                            "product_data": data?.['product_data'],
                            "asset_type": data?.['asset_type'],
                            "asset_id": assetData?.['asset_id'],
                            "asset_data": assetData?.['asset_data'],
                            "uom_id": data?.['uom_data']?.['id'],
                            "uom_data": data?.['uom_data'],
                            "uom_time_id": data?.['uom_time_data']?.['id'],
                            "uom_time_data": data?.['uom_time_data'],
                            "tax_id": data?.['tax_data']?.['id'],
                            "tax_data": data?.['tax_data'],
                            "product_quantity": 1,
                            "product_quantity_time": data?.['product_quantity_time'],
                            "product_cost_price": assetData?.['asset_data']?.['origin_cost'],
                            "product_depreciation_method": assetData?.['asset_data']?.['depreciation_method'],
                            "product_depreciation_time": assetData?.['asset_data']?.['depreciation_time'],
                            "product_depreciation_adjustment": assetData?.['asset_data']?.['adjustment_factor'],
                            "product_depreciation_start_date": assetData?.['asset_data']?.['depreciation_start_date'],
                            "product_depreciation_end_date": assetData?.['asset_data']?.['depreciation_end_date'],
                        }
                        if (storeCost.hasOwnProperty(dataAdd?.['asset_data']?.['id'])) {
                            dataAdd = storeCost[dataAdd?.['asset_data']?.['id']];
                            dataAdd['product_quantity'] = 1;
                            dataAdd['product_quantity_time'] = data?.['product_quantity_time'];
                            dataAdd['uom_id'] = data?.['uom_data']?.['id'];
                            dataAdd['uom_data'] = data?.['uom_data'];
                        }
                        if (dataAdd?.['product_quantity'] > 0) {
                            $table.DataTable().row.add(dataAdd).draw().node();
                        }
                    }
                    // asset_type = 2: Tool
                    for (let toolData of data?.['tool_data'] ? data?.['tool_data'] : []) {
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_id": data?.['product_data']?.['id'],
                            "product_data": data?.['product_data'],
                            "asset_type": data?.['asset_type'],
                            "tool_id": toolData?.['tool_id'],
                            "tool_data": toolData?.['tool_data'],
                            "uom_id": data?.['uom_data']?.['id'],
                            "uom_data": data?.['uom_data'],
                            "uom_time_id": data?.['uom_time_data']?.['id'],
                            "uom_time_data": data?.['uom_time_data'],
                            "tax_id": data?.['tax_data']?.['id'],
                            "tax_data": data?.['tax_data'],
                            "product_quantity": toolData?.['product_quantity'],
                            "product_quantity_time": data?.['product_quantity_time'],
                            "product_cost_price": toolData?.['tool_data']?.['origin_cost'],
                            "product_depreciation_time": toolData?.['tool_data']?.['depreciation_time'],
                            "product_depreciation_start_date": toolData?.['tool_data']?.['depreciation_start_date'],
                            "product_depreciation_end_date": toolData?.['tool_data']?.['depreciation_end_date'],
                        }
                        if (storeCost.hasOwnProperty(dataAdd?.['tool_data']?.['id'])) {
                            dataAdd = storeCost[dataAdd?.['tool_data']?.['id']];
                            dataAdd['product_quantity'] = toolData?.['product_quantity'];
                            dataAdd['product_quantity_time'] = data?.['product_quantity_time'];
                            dataAdd['uom_id'] = data?.['uom_data']?.['id'];
                            dataAdd['uom_data'] = data?.['uom_data'];
                        }
                        if (dataAdd?.['product_quantity'] > 0) {
                            $table.DataTable().row.add(dataAdd).draw().node();
                        }
                    }
                    // asset_type = 1: Offset
                    for (let offsetData of data?.['offset_data'] ? data?.['offset_data'] : []) {
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_id": data?.['product_data']?.['id'],
                            "product_data": data?.['product_data'],
                            "asset_type": data?.['asset_type'],
                            "offset_id": offsetData?.['offset_id'],
                            "offset_data": offsetData?.['offset_data'],
                            "uom_id": data?.['uom_data']?.['id'],
                            "uom_data": data?.['uom_data'],
                            "uom_time_id": data?.['uom_time_data']?.['id'],
                            "uom_time_data": data?.['uom_time_data'],
                            "tax_id": data?.['tax_data']?.['id'],
                            "tax_data": data?.['tax_data'],
                            "product_quantity": offsetData?.['product_quantity'],
                            "product_quantity_time": data?.['product_quantity_time'],
                        }
                        if (storeCost.hasOwnProperty(dataAdd?.['offset_data']?.['id'])) {
                            dataAdd = storeCost[dataAdd?.['offset_data']?.['id']];
                            dataAdd['product_quantity'] = offsetData?.['product_quantity'];
                            dataAdd['product_quantity_time'] = data?.['product_quantity_time'];
                            dataAdd['uom_id'] = data?.['uom_data']?.['id'];
                            dataAdd['uom_data'] = data?.['uom_data'];
                        }
                        if (dataAdd?.['product_quantity'] > 0) {
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
                            "product_cost_price": valueSubtotal,
                            "product_tax_amount": data?.['product_tax_amount'],
                            "product_subtotal_price": valueSubtotal,
                            "is_shipping": true,
                            "shipping_id": dataShipping?.['id'],
                            "shipping_data": dataShipping,
                            "uom_id": data?.['uom_data']?.['id'],
                            "uom_data": data?.['uom_data'],
                            "tax_id": data?.['tax_data']?.['id'],
                            "tax_data": data?.['tax_data'],
                        }
                        $table.DataTable().row.add(dataAdd).draw().node();
                    }
                }
            } else {  // Product is not zone hidden => use realtime data product from $tableProduct
                $tableProduct.DataTable().rows().every(function () {
                    let row = this.node();
                    let rowIndex = $tableProduct.DataTable().row(row).index();
                    let $row = $tableProduct.DataTable().row(rowIndex);
                    let dataRow = $row.data();

                    let valueSubtotal = 0;
                    let valueQuantity = 0;
                    let shipping = row.querySelector('.table-row-shipping');
                    // asset_type = 3: Asset
                    for (let assetData of dataRow?.['asset_data'] ? dataRow?.['asset_data'] : []) {
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_id": dataRow?.['product_data']?.['id'],
                            "product_data": dataRow?.['product_data'],
                            "asset_type": dataRow?.['asset_type'],
                            "asset_id": assetData?.['asset_id'],
                            "asset_data": assetData?.['asset_data'],
                            "uom_id": dataRow?.['uom_data']?.['id'],
                            "uom_data": dataRow?.['uom_data'],
                            "uom_time_id": dataRow?.['uom_time_data']?.['id'],
                            "uom_time_data": dataRow?.['uom_time_data'],
                            "tax_id": dataRow?.['tax_data']?.['id'],
                            "tax_data": dataRow?.['tax_data'],
                            "product_quantity": 1,
                            "product_quantity_time": dataRow?.['product_quantity_time'],
                            "product_cost_price": assetData?.['asset_data']?.['origin_cost'],
                            "product_depreciation_method": assetData?.['asset_data']?.['depreciation_method'],
                            "product_depreciation_time": assetData?.['asset_data']?.['depreciation_time'],
                            "product_depreciation_adjustment": assetData?.['asset_data']?.['adjustment_factor'],
                            "product_depreciation_start_date": assetData?.['asset_data']?.['depreciation_start_date'],
                            "product_depreciation_end_date": assetData?.['asset_data']?.['depreciation_end_date'],
                        }
                        if (storeCost.hasOwnProperty(dataAdd?.['asset_data']?.['id'])) {
                            dataAdd = storeCost[dataAdd?.['asset_data']?.['id']];
                            dataAdd['product_quantity'] = 1;
                            dataAdd['product_quantity_time'] = dataRow?.['product_quantity_time'];
                            dataAdd['uom_id'] = dataRow?.['uom_data']?.['id'];
                            dataAdd['uom_data'] = dataRow?.['uom_data'];
                        }
                        if (dataAdd?.['product_quantity'] > 0) {
                            $table.DataTable().row.add(dataAdd).draw().node();
                        }
                    }
                    // asset_type = 2: Tool
                    for (let toolData of dataRow?.['tool_data'] ? dataRow?.['tool_data'] : []) {
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_id": dataRow?.['product_data']?.['id'],
                            "product_data": dataRow?.['product_data'],
                            "asset_type": dataRow?.['asset_type'],
                            "tool_id": toolData?.['tool_id'],
                            "tool_data": toolData?.['tool_data'],
                            "uom_id": dataRow?.['uom_data']?.['id'],
                            "uom_data": dataRow?.['uom_data'],
                            "uom_time_id": dataRow?.['uom_time_data']?.['id'],
                            "uom_time_data": dataRow?.['uom_time_data'],
                            "tax_id": dataRow?.['tax_data']?.['id'],
                            "tax_data": dataRow?.['tax_data'],
                            "product_quantity": toolData?.['product_quantity'],
                            "product_quantity_time": dataRow?.['product_quantity_time'],
                            "product_cost_price": toolData?.['tool_data']?.['origin_cost'],
                            "product_depreciation_time": toolData?.['tool_data']?.['depreciation_time'],
                            "product_depreciation_start_date": toolData?.['tool_data']?.['depreciation_start_date'],
                            "product_depreciation_end_date": toolData?.['tool_data']?.['depreciation_end_date'],
                        }
                        if (storeCost.hasOwnProperty(dataAdd?.['tool_data']?.['id'])) {
                            dataAdd = storeCost[dataAdd?.['tool_data']?.['id']];
                            dataAdd['product_quantity'] = toolData?.['product_quantity'];
                            dataAdd['product_quantity_time'] = dataRow?.['product_quantity_time'];
                            dataAdd['uom_id'] = dataRow?.['uom_data']?.['id'];
                            dataAdd['uom_data'] = dataRow?.['uom_data'];
                        }
                        if (dataAdd?.['product_quantity'] > 0) {
                            $table.DataTable().row.add(dataAdd).draw().node();
                        }
                    }
                    // asset_type = 1: Offset
                    for (let offsetData of dataRow?.['offset_data'] ? dataRow?.['offset_data'] : []) {
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_id": dataRow?.['product_data']?.['id'],
                            "product_data": dataRow?.['product_data'],
                            "asset_type": dataRow?.['asset_type'],
                            "offset_id": offsetData?.['offset_id'],
                            "offset_data": offsetData?.['offset_data'],
                            "uom_id": dataRow?.['uom_data']?.['id'],
                            "uom_data": dataRow?.['uom_data'],
                            "uom_time_id": dataRow?.['uom_time_data']?.['id'],
                            "uom_time_data": dataRow?.['uom_time_data'],
                            "tax_id": dataRow?.['tax_data']?.['id'],
                            "tax_data": dataRow?.['tax_data'],
                            "product_quantity": offsetData?.['offset_data']?.['product_quantity'],
                            "product_quantity_time": dataRow?.['product_quantity_time'],
                        }
                        if (storeCost.hasOwnProperty(dataAdd?.['offset_data']?.['id'])) {
                            dataAdd = storeCost[dataAdd?.['offset_data']?.['id']];
                            dataAdd['product_quantity'] = offsetData?.['product_quantity'];
                            dataAdd['product_quantity_time'] = dataRow?.['product_quantity_time'];
                            dataAdd['uom_id'] = dataRow?.['uom_data']?.['id'];
                            dataAdd['uom_data'] = dataRow?.['uom_data'];
                        }
                        if (dataAdd?.['product_quantity'] > 0) {
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
                                "product_cost_price": valueSubtotal,
                                "product_tax_amount": dataRow?.['product_tax_amount'],
                                "product_subtotal_price": valueSubtotal,
                                "is_shipping": true,
                                "shipping_id": dataShipping?.['id'],
                                "shipping_data": dataShipping,
                                "uom_id": dataRow?.['uom_data']?.['id'],
                                "uom_data": dataRow?.['uom_data'],
                                "tax_id": dataRow?.['tax_data']?.['id'],
                                "tax_data": dataRow?.['tax_data'],
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
        // assetType: 1: product, 2: tool, 3: asset
        let row = ele.closest('tr');
        if (row) {
            let assetType = "";
            let assetTypeEle = row.querySelector('.table-row-asset-type');
            if (assetTypeEle) {
                assetType = $(assetTypeEle).val();
            }
            if (assetType === "1") {
                let offsetEle = row.querySelector('.table-row-offset');
                if (offsetEle) {
                    if ($(offsetEle).val()) {
                        let dataOffset = SelectDDControl.get_data_from_idx($(offsetEle), $(offsetEle).val());
                        if (dataOffset) {
                            LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-product-id', dataOffset?.['id']);
                        }
                    }
                }
            }
            if (assetType === "2") {
                let toolEle = row.querySelector('.table-row-tool');
                if (toolEle) {
                    if ($(toolEle).val()) {
                        let dataTool = SelectDDControl.get_data_from_idx($(toolEle), $(toolEle).val());
                        if (dataTool) {
                            LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-product-id', dataTool?.['id']);
                        }
                    }
                }
            }
            if (assetType === "3") {
                let assetEle = row.querySelector('.table-row-asset');
                if (assetEle) {
                    if ($(assetEle).val()) {
                        let dataAsset = SelectDDControl.get_data_from_idx($(assetEle), $(assetEle).val());
                        if (dataAsset) {
                            LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-product-id', dataAsset?.['id']);
                        }
                    }
                }
            }

            let depreciationMethodEle = row.querySelector('.table-row-depreciation-method');
            let $methodEle = $('#depreciation_method');
            if (depreciationMethodEle && $methodEle.length > 0) {
                if (assetType === "1") {
                    $methodEle.removeAttr('disabled');
                }
                FormElementControl.loadInitS2($methodEle, LeaseOrderLoadDataHandle.dataDepreciationMethod, {}, LeaseOrderLoadDataHandle.$depreciationModal);
                if ($(depreciationMethodEle).val()) {
                    $methodEle.val(parseInt($(depreciationMethodEle).val())).trigger('change');
                }
            }
            let depreciationAdjustEle = row.querySelector('.table-row-depreciation-adjustment');
            let $adjustEle = $('#depreciation_adjustment');
            if (depreciationAdjustEle && $adjustEle.length > 0) {
                if ($(depreciationAdjustEle).val()) {
                    $adjustEle.val(parseFloat($(depreciationAdjustEle).val()));
                }
                if (["2", "3"].includes(assetType)) {
                    $adjustEle.attr('readonly', true);
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
                // mask money
                $.fn.initMaskMoney2();
            }
            let uomTimeEle = row.querySelector('.table-row-uom-time');
            let $uomEle = $('#depreciation_uom');
            if (uomTimeEle && $uomEle.length > 0) {
                let dataUOMTime = SelectDDControl.get_data_from_idx($(uomTimeEle), $(uomTimeEle).val());
                if (dataUOMTime) {
                    // $uomEle[0].innerHTML = dataUOMTime?.['title'];
                    $uomEle[0].innerHTML = LeaseOrderLoadDataHandle.transEle.attr('data-month');
                }
            }
            let depreciationStartDateEle = row.querySelector('.table-row-depreciation-start-date');
            let $startDateEle = $('#depreciation_start_date');
            if (depreciationStartDateEle && $startDateEle.length > 0) {
                $startDateEle.val("").trigger('change');
                if (assetType === "1") {
                    $startDateEle.removeAttr('disabled');
                }
                if ($(depreciationStartDateEle).val()) {
                    $startDateEle.val(moment($(depreciationStartDateEle).val()).format('DD/MM/YYYY'));
                }
                if (!$startDateEle.val()) {
                    $startDateEle.val(DateTimeControl.getCurrentDate("DMY", "/"));
                }
            }
            let depreciationEndDateEle = row.querySelector('.table-row-depreciation-end-date');
            let $endDateEle = $('#depreciation_end_date');
            if (depreciationEndDateEle && $endDateEle.length > 0) {
                $endDateEle.val("").trigger('change');
                if (assetType === "1") {
                    $endDateEle.removeAttr('disabled');
                }
                if ($(depreciationEndDateEle).val()) {
                    $endDateEle.val(moment($(depreciationEndDateEle).val()).format('DD/MM/YYYY'));
                }
                // if not data store depreciation_end_date then auto use DepreciationControl.getEndDateDepreciation
                if ($startDateEle.val() && $timeEle.val()) {
                    let endDate = DepreciationControl.getEndDateDepreciation($startDateEle.val(), parseInt($timeEle.val()));
                    $endDateEle.val(endDate).trigger('change');
                }
            }
            let leaseStartDateEle = row.querySelector('.table-row-lease-start-date');
            let $leaseStartDateEle = $('#lease_start_date');
            if (leaseStartDateEle && $leaseStartDateEle.length > 0) {
                $leaseStartDateEle.val("").trigger('change');
                $leaseStartDateEle.removeAttr('disabled');
                if (LeaseOrderLoadDataHandle.$leaseFrom.val()) {
                    $leaseStartDateEle.val(LeaseOrderLoadDataHandle.$leaseFrom.val());
                }
                if ($(leaseStartDateEle).val()) {
                    $leaseStartDateEle.val(moment($(leaseStartDateEle).val()).format('DD/MM/YYYY'));
                }
            }
            let leaseEndDateEle = row.querySelector('.table-row-lease-end-date');
            let $leaseEndDateEle = $('#lease_end_date');
            if (leaseEndDateEle && $leaseEndDateEle.length > 0) {
                $leaseEndDateEle.val("").trigger('change');
                $leaseEndDateEle.removeAttr('disabled');
                if (LeaseOrderLoadDataHandle.$leaseTo.val()) {
                    $leaseEndDateEle.val(LeaseOrderLoadDataHandle.$leaseTo.val());
                }
                if ($(leaseEndDateEle).val()) {
                    $leaseEndDateEle.val(moment($(leaseEndDateEle).val()).format('DD/MM/YYYY'));
                }
            }
            let convertEle = row.querySelector('.table-row-product-convert-into');
            let $convertAreaEle = $('#product_convert_into_area');
            let $convertEle = $('#product_convert_into');
            if (convertEle && $convertAreaEle.length > 0 && $convertEle.length > 0) {
                $convertAreaEle.addClass('hidden');
                FormElementControl.loadInitS2($convertEle, LeaseOrderLoadDataHandle.dataConvertInto);
                if (assetType === "1") {
                    $convertAreaEle.removeClass('hidden');
                    $convertEle.val("2");
                    if ($(convertEle).val()) {
                        $convertEle.val($(convertEle).val())
                    }
                    $convertEle.trigger('change');
                }
            }

            let dataFn = [];
            let depreciationDataEle = row.querySelector('.table-row-depreciation-data');
            let depreciationLeaseDataEle = row.querySelector('.table-row-depreciation-lease-data');
            if (depreciationDataEle && depreciationLeaseDataEle) {
                if ($(depreciationDataEle).val()) {
                    let dataDepreciation = JSON.parse($(depreciationDataEle).val());
                    if (dataDepreciation.length > 0) {
                        dataFn = dataDepreciation;
                        if ($(depreciationLeaseDataEle).val()) {
                            let dataLeaseDepreciation = JSON.parse($(depreciationLeaseDataEle).val());
                            dataFn = DepreciationControl.mapDataOfRange({
                                'data_depreciation': dataDepreciation,
                                'data_of_range': dataLeaseDepreciation,
                            });
                        }
                        LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().clear().draw();
                        LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().rows.add(dataFn).draw();
                        return true;
                    }
                }
                // Case row is asset then use depreciation_data of asset to render $tableDepreciationDetail
                let assetEle = row.querySelector('.table-row-asset');
                if (assetEle && assetType === "3") {
                    let dataAsset = SelectDDControl.get_data_from_idx($(assetEle), $(assetEle).val());
                    if (dataAsset?.['depreciation_data']) {
                        if (dataAsset?.['depreciation_data'].length > 0) {
                            dataFn = dataAsset?.['depreciation_data'];
                            LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().clear().draw();
                            LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().rows.add(dataFn).draw();
                            return true;
                        }
                    }
                }
            }
            // Case row is offset then use loadDataTableDepreciation to render $tableDepreciationDetail
            LeaseOrderLoadDataHandle.loadDataTableDepreciation();
        }

        return true;
    };

    static loadDataConfigAssetTool() {
        let $table = LeaseOrderDataTableHandle.$tableCost;
        let target = $table[0].querySelector(`[data-product-id="${LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-product-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');
            if (targetRow) {
                let $convertEle = $('#product_convert_into');
                let $DDMenuEle = $('#dropdown-menu-config-asset-tool');
                if ($convertEle.length > 0 && $DDMenuEle.length > 0) {
                    $DDMenuEle[0].addEventListener("click", function (e) {
                        e.stopPropagation();
                    });
                    let areaToolEle = $DDMenuEle[0].querySelector('.config-tool-area');
                    let areaAssetEle = $DDMenuEle[0].querySelector('.config-asset-area');
                    if (areaAssetEle && areaToolEle) {
                        $(areaToolEle).addClass('hidden');
                        $(areaAssetEle).addClass('hidden');
                        if ($convertEle.val() === "1") {
                            $(areaToolEle).removeClass('hidden');

                            let $toolTypeEle = $('#tool_type_id');
                            let $toolGMEle = $('#tool_group_manage_id');
                            let $toolGSEle = $('#tool_group_using_id');
                            if ($toolTypeEle.length > 0 && $toolGMEle.length > 0 && $toolGSEle.length > 0) {
                                let toolTypeDataEle = targetRow.querySelector('.table-row-tool-type-data');
                                let toolGMDataEle = targetRow.querySelector('.table-row-tool-group-manage-data');
                                let toolGSDataEle = targetRow.querySelector('.table-row-tool-group-using-data');
                                if (toolTypeDataEle && toolGMDataEle && toolGSDataEle) {
                                    if ($(toolTypeDataEle).val()) {
                                        FormElementControl.loadInitS2($toolTypeEle, [JSON.parse($(toolTypeDataEle).val())], {}, null, true);
                                    }
                                    if ($(toolGMDataEle).val()) {
                                        FormElementControl.loadInitS2($toolGMEle, [JSON.parse($(toolGMDataEle).val())], {}, null, true);
                                    }
                                    if ($(toolGSDataEle).val()) {
                                        FormElementControl.loadInitS2($toolGSEle, JSON.parse($(toolGSDataEle).val()), {}, null, true);
                                    }
                                }
                            }
                        }
                        if ($convertEle.val() === "2") {
                            $(areaAssetEle).removeClass('hidden');

                            let $assetTypeEle = $('#asset_type_id');
                            let $assetGMEle = $('#asset_group_manage_id');
                            let $assetGSEle = $('#asset_group_using_id');
                            if ($assetTypeEle.length > 0 && $assetGMEle.length > 0 && $assetGSEle.length > 0) {
                                let assetTypeDataEle = targetRow.querySelector('.table-row-asset-type-data');
                                let assetGMDataEle = targetRow.querySelector('.table-row-asset-group-manage-data');
                                let assetGSDataEle = targetRow.querySelector('.table-row-asset-group-using-data');
                                if (assetTypeDataEle && assetGMDataEle && assetGSDataEle) {

                                    if ($(assetTypeDataEle).val()) {
                                        FormElementControl.loadInitS2($assetTypeEle, [JSON.parse($(assetTypeDataEle).val())], {}, null, true);
                                    }
                                    if ($(assetGMDataEle).val()) {
                                        FormElementControl.loadInitS2($assetGMEle, [JSON.parse($(assetGMDataEle).val())], {}, null, true);
                                    }
                                    if ($(assetGSDataEle).val()) {
                                        FormElementControl.loadInitS2($assetGSEle, JSON.parse($(assetGSDataEle).val()), {}, null, true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
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
                if ($radioFinanceEle[0].checked === true) {
                    dataDepreciation = DepreciationControl.callDepreciation({
                        "method": parseInt($methodEle.val()),
                        "months": parseInt($timeEle.val()),
                        "start_date": $startEle.val(),
                        "end_date": $endEle.val(),
                        "price": parseFloat($costEle.valCurrency()),
                        "adjust": parseFloat($adjustEle.val())
                    });
                    let dataOfRange = DepreciationControl.extractDataOfRange({
                        'data_depreciation': dataDepreciation,
                        'start_date': $startLeaseEle.val(),
                        'end_date': $endLeaseEle.val(),
                    });
                    dataFn = DepreciationControl.mapDataOfRange({
                        'data_depreciation': dataDepreciation,
                        'data_of_range': dataOfRange,
                    });
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

    static loadSaveDepreciation() {
        let $table = LeaseOrderDataTableHandle.$tableCost;
        let target = $table[0].querySelector(`[data-product-id="${LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-product-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');
            if (targetRow) {
                let $priceEle = $('#cost_price');
                let $timeEle = $('#depreciation_time');
                let $methodEle = $('#depreciation_method');
                let $adjust = $('#depreciation_adjustment');
                let $startEle = $('#depreciation_start_date');
                let $endEle = $('#depreciation_end_date');
                let $leaseStartEle = $('#lease_start_date');
                let $leaseEndEle = $('#lease_end_date');
                let $convertEle = $('#product_convert_into');
                let $assetTypeEle = $('#asset_type_id');
                let $assetGMEle = $('#asset_group_manage_id');
                let $assetGSEle = $('#asset_group_using_id');
                let $toolTypeEle = $('#tool_type_id');
                let $toolGMEle = $('#tool_group_manage_id');
                let $toolGSEle = $('#tool_group_using_id');

                let fnCost = 0;
                let dataDepreciation = [];
                let dataDepreciationLease = [];
                if ($methodEle.length > 0 && $adjust.length > 0 && $startEle.length > 0 && $endEle.length > 0  && $leaseStartEle.length > 0 && $leaseEndEle.length > 0 && $convertEle.length > 0) {
                    let depreciationMethodEle = targetRow.querySelector('.table-row-depreciation-method');
                    let depreciationAdjustEle = targetRow.querySelector('.table-row-depreciation-adjustment');
                    let depreciationStartDateEle = targetRow.querySelector('.table-row-depreciation-start-date');
                    let depreciationEndDateEle = targetRow.querySelector('.table-row-depreciation-end-date');
                    let leaseStartDateEle = targetRow.querySelector('.table-row-lease-start-date');
                    let leaseEndDateEle = targetRow.querySelector('.table-row-lease-end-date');
                    let convertEle = targetRow.querySelector('.table-row-product-convert-into');

                    if (depreciationMethodEle && depreciationAdjustEle && depreciationStartDateEle && depreciationEndDateEle && leaseStartDateEle && leaseEndDateEle && convertEle) {
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
                        if ($convertEle.val()) {
                            $(convertEle).val(parseInt($convertEle.val()));
                            if ($convertEle.val() === "1") {
                                if ($toolTypeEle.length > 0 && $toolGMEle.length > 0 && $toolGSEle.length > 0) {
                                    let toolTypeDataEle = targetRow.querySelector('.table-row-tool-type-data');
                                    let toolGMDataEle = targetRow.querySelector('.table-row-tool-group-manage-data');
                                    let toolGSDataEle = targetRow.querySelector('.table-row-tool-group-using-data');
                                    if (toolTypeDataEle && toolGMDataEle && toolGSDataEle) {
                                        $(toolTypeDataEle).val("");
                                        if ($toolTypeEle.val()) {
                                            $(toolTypeDataEle).val(JSON.stringify(SelectDDControl.get_data_from_idx($toolTypeEle, $toolTypeEle.val())));
                                        }
                                        $(toolGMDataEle).val("");
                                        if ($toolGMEle.val()) {
                                            $(toolGMDataEle).val(JSON.stringify(SelectDDControl.get_data_from_idx($toolGMEle, $toolGMEle.val())));
                                        }
                                        $(toolGSDataEle).val("");
                                        let tool_gs_data = [];
                                        for (let gsID of $toolGSEle.val()) {
                                            tool_gs_data.push(SelectDDControl.get_data_from_idx($toolGSEle, gsID));
                                        }
                                        if (tool_gs_data.length > 0) {
                                            $(toolGSDataEle).val(JSON.stringify(tool_gs_data));
                                        }
                                    }
                                }
                            }
                            if ($convertEle.val() === "2") {
                                if ($assetTypeEle.length > 0 && $assetGMEle.length > 0 && $assetGSEle.length > 0) {
                                    let assetTypeDataEle = targetRow.querySelector('.table-row-asset-type-data');
                                    let assetGMDataEle = targetRow.querySelector('.table-row-asset-group-manage-data');
                                    let assetGSDataEle = targetRow.querySelector('.table-row-asset-group-using-data');
                                    if (assetTypeDataEle && assetGMDataEle && assetGSDataEle) {
                                        $(assetTypeDataEle).val("");
                                        if ($assetTypeEle.val()) {
                                            $(assetTypeDataEle).val(JSON.stringify(SelectDDControl.get_data_from_idx($assetTypeEle, $assetTypeEle.val())));
                                        }
                                        $(assetGMDataEle).val("");
                                        if ($assetGMEle.val()) {
                                            $(assetGMDataEle).val(JSON.stringify(SelectDDControl.get_data_from_idx($assetGMEle, $assetGMEle.val())));
                                        }
                                        $(assetGSDataEle).val("");
                                        let asset_gs_data = [];
                                        for (let gsID of $assetGSEle.val()) {
                                            asset_gs_data.push(SelectDDControl.get_data_from_idx($assetGSEle, gsID));
                                        }
                                        if (asset_gs_data.length > 0) {
                                            $(assetGSDataEle).val(JSON.stringify(asset_gs_data));
                                        }
                                    }
                                }
                            }
                        }

                        dataDepreciation = DepreciationControl.callDepreciation({
                            "method": parseInt($methodEle.val()),
                            "months": parseInt($timeEle.val()),
                            "start_date": $startEle.val(),
                            "end_date": $endEle.val(),
                            "price": parseFloat($priceEle.valCurrency()),
                            "adjust": parseFloat($adjust.val()),
                        });
                        dataDepreciationLease = DepreciationControl.extractDataOfRange({
                            'data_depreciation': dataDepreciation,
                            'start_date': $leaseStartEle.val(),
                            'end_date': $leaseEndEle.val(),
                        });
                    }
                    LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().rows().every(function () {
                        let row = this.node();
                        let rowIndex = LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().row(row).index();
                        let $row = LeaseOrderDataTableHandle.$tableDepreciationDetail.DataTable().row(rowIndex);
                        let dataRow = $row.data();
                        if (dataRow?.['lease_accumulative_allocated']) {
                            fnCost = dataRow?.['lease_accumulative_allocated'];
                        }
                    });
                }

                let depreciationSubtotalEle = targetRow.querySelector('.table-row-depreciation-subtotal');
                let fnCostEle = targetRow.querySelector('.table-row-subtotal');
                let fnCostRawEle = targetRow.querySelector('.table-row-subtotal-raw');
                let depreciationDataEle = targetRow.querySelector('.table-row-depreciation-data');
                let depreciationLeaseDataEle = targetRow.querySelector('.table-row-depreciation-lease-data');

                if (depreciationSubtotalEle && fnCostEle && fnCostRawEle) {
                    $(depreciationSubtotalEle).val(fnCost);
                    $(fnCostEle).attr('data-init-money', String(fnCost));
                    $(fnCostRawEle).val(String(fnCost));
                }
                if (depreciationDataEle) {
                    $(depreciationDataEle).val(JSON.stringify(dataDepreciation));
                }
                if (depreciationLeaseDataEle) {
                    $(depreciationLeaseDataEle).val(JSON.stringify(dataDepreciationLease));
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
        FormElementControl.loadInitS2($(newRow.querySelector('.table-row-item')));
        FormElementControl.loadInitS2($(newRow.querySelector('.table-row-uom')));
        FormElementControl.loadInitS2($(newRow.querySelector('.table-row-tax')));
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
        FormElementControl.loadInitS2($(newRow.querySelector('.table-row-labor-item')));
        FormElementControl.loadInitS2($(newRow.querySelector('.table-row-item')));
        FormElementControl.loadInitS2($(newRow.querySelector('.table-row-uom')));
        FormElementControl.loadInitS2($(newRow.querySelector('.table-row-tax')));
        // check disable
        tableExpense.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
    };

    static loadChangeLabor(ele) {
        if ($(ele).val()) {
            let row = ele.closest('tr');
            let dataSelected = SelectDDControl.get_data_from_idx($(ele), $(ele).val());
            if (dataSelected?.['expense_item']?.['id']) {
                FormElementControl.loadInitS2($(row.querySelector('.table-row-item')), [dataSelected?.['expense_item']]);
            }
            if (dataSelected?.['uom']?.['id'] && dataSelected?.['uom_group']?.['id']) {
                FormElementControl.loadInitS2($(row.querySelector('.table-row-uom')), [dataSelected?.['uom']], {'group': dataSelected?.['uom_group']?.['id']});
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
            FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.salePersonSelectEle, [data?.['sale_person']]);
        }
        if ($(form).attr('data-method').toLowerCase() !== 'get') {
            LeaseOrderLoadDataHandle.salePersonSelectEle[0].removeAttribute('readonly');
            LeaseOrderLoadDataHandle.customerSelectEle[0].removeAttribute('disabled');
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
                LeaseOrderLoadDataHandle.customerSelectEle[0].setAttribute('disabled', 'true');
            }
        }
        if (data?.['customer_data']) {
            if (is_copy === true) {
                data['customer_data']['is_copy'] = true;
            }
            LeaseOrderLoadDataHandle.loadBoxQuotationCustomer(data?.['customer_data']);
            // load shipping/ billing
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': LeaseOrderLoadDataHandle.customerSelectEle.attr('data-url'),
                    'method': "GET",
                    'data': {'id': oppData?.['customer']?.['id']},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('account_sale_list') && Array.isArray(data.account_sale_list)) {
                            if (data?.['account_sale_list'].length > 0) {
                                LeaseOrderLoadDataHandle.loadShippingBillingCustomer(data?.['account_sale_list'][0]);
                            }
                            WindowControl.hideLoading();
                        }
                    }
                }
            )
        }
        if (data?.['contact_data']) {
            LeaseOrderLoadDataHandle.loadBoxQuotationContact(data?.['contact_data']);
        }
        if (data?.['payment_term_data']) {
            // load realtime payment data
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': LeaseOrderLoadDataHandle.paymentSelectEle.attr('data-url'),
                    'method': "GET",
                    'data': {'id': data?.['payment_term_data']?.['id']},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('payment_terms_list') && Array.isArray(data.payment_terms_list)) {
                            if (data?.['payment_terms_list'].length > 0) {
                                if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
                                    if (LeaseOrderLoadDataHandle.paymentSelectEle.val() === data?.['payment_terms_list'][0]?.['id']) {
                                        FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle, [data?.['payment_terms_list'][0]], {}, null, true);
                                        LeaseOrderLoadDataHandle.loadReInitDataTablePayment();
                                        LeaseOrderLoadDataHandle.loadReInitDataTableInvoice();
                                    }
                                    if (LeaseOrderLoadDataHandle.paymentSelectEle.val() !== data?.['payment_terms_list'][0]?.['id']) {
                                        FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle, [data?.['payment_terms_list'][0]], {}, null, true);
                                        LeaseOrderLoadDataHandle.loadChangePaymentTerm();
                                    }
                                }
                                if (!LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
                                    FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle, [data?.['payment_terms_list'][0]], {}, null, true);
                                    LeaseOrderLoadDataHandle.loadReInitDataTablePayment();
                                    LeaseOrderLoadDataHandle.loadReInitDataTableInvoice();
                                }
                            }
                            if (data?.['payment_terms_list'].length === 0) {
                                FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle, [], {}, null, true);
                                LeaseOrderLoadDataHandle.loadReInitDataTablePayment();
                                LeaseOrderLoadDataHandle.loadReInitDataTableInvoice();
                            }
                            WindowControl.hideLoading();
                        }
                    }
                }
            )
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
            // check remove hidden btnDelivery
            if (data?.['delivery_call'] === false && data?.['system_status'] === 3 && $(form).attr('data-method').toLowerCase() === 'get') {
                if (LeaseOrderLoadDataHandle.opportunitySelectEle.val()) {
                    if (data?.['opportunity']?.['is_deal_closed'] === false) {
                        LeaseOrderDeliveryHandle.$btnDeliveryInfo[0].removeAttribute('hidden');
                    }
                } else {
                    LeaseOrderDeliveryHandle.$btnDeliveryInfo[0].removeAttribute('hidden');
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
        let tableExpense = LeaseOrderDataTableHandle.$tableExpense;
        let tableIndicator = $('#datable-quotation-create-indicator');
        let products_data = data?.['lease_products_data'];
        let costs_data = data?.['lease_costs_data'];
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
        tableExpense.DataTable().clear().draw();
        // load table product
        tableProduct.DataTable().rows.add(products_data).draw();
        tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let eleGroup = row.querySelector('.table-row-group');
            let eleProduct = row.querySelector('.table-row-item');

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
        });
        // load table cost
        if (costs_data) {
            tableCost.DataTable().rows.add(costs_data).draw();
        }
        // load table expense
        if (expenses_data) {
            tableExpense.DataTable().rows.add(expenses_data).draw();
        }
        // load table payment stage
        if (data?.['lease_invoice']) {
            LeaseOrderDataTableHandle.$tableInvoice.DataTable().clear().draw();
            LeaseOrderDataTableHandle.$tableInvoice.DataTable().rows.add(data?.['lease_invoice']).draw();
        }
        if (data?.['lease_payment_stage']) {
            LeaseOrderDataTableHandle.$tablePayment.DataTable().clear().draw();
            LeaseOrderDataTableHandle.$tablePayment.DataTable().rows.add(data?.['lease_payment_stage']).draw();
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
            LeaseOrderLoadDataHandle.loadTableDisabled(LeaseOrderDataTableHandle.$tablePayment);
            LeaseOrderLoadDataHandle.loadTableDisabled(LeaseOrderDataTableHandle.$tableInvoice);
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
        for (let ele of table[0].querySelectorAll('.table-row-total')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-before-tax')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-tax')) {
            ele.setAttribute('readonly', 'true');
        }
        for (let ele of table[0].querySelectorAll('.table-row-value-total')) {
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

    static loadGetDatasDetail() {
        let dataQuotationIndicator = [];
        let dataDetail = {};
        let dataDetailCopy = {};
        let $dataCopyEle = $('#data-copy-quotation-detail');
        if ($dataCopyEle && $dataCopyEle.length > 0) {
            if ($dataCopyEle.val()) {
                dataDetailCopy = JSON.parse($dataCopyEle.val());
            }
        }
        let $dataDetailEle = $('#quotation-detail-data');
        if ($dataDetailEle && $dataDetailEle.length > 0) {
            if ($dataDetailEle.val()) {
                dataDetail = JSON.parse($dataDetailEle.val());
            }
        }
        if (Object.keys(dataDetailCopy).length !== 0) {
            if (dataDetailCopy?.['quotation_indicators_data']) {
                dataQuotationIndicator = dataDetailCopy?.['quotation_indicators_data'];
            }
        }
        if (Object.keys(dataDetail).length !== 0) {
            if (dataDetail?.['quotation_data']?.['quotation_indicators_data']) {
                dataQuotationIndicator = dataDetail?.['quotation_data']?.['quotation_indicators_data'];
            }
        }
        return {
            'dataDetail': dataDetail,
            'dataQuotationIndicator': dataQuotationIndicator,
        };
    };

}

// DataTable
class LeaseOrderDataTableHandle {
    static $tableDepreciationDetail = $('#table-depreciation-detail');
    static $tableProduct = $('#datable-quotation-create-product');
    static $tableCost = $('#datable-quotation-create-cost');
    static $tableExpense = $('#datable-quotation-create-expense');
    static $tablePayment = $('#datable-quotation-payment-stage');
    static $tableInvoice = $('#datable-quotation-invoice');
    static $tablePromotion = $('#datable-quotation-create-promotion');
    static $tableShipping = $('#datable-quotation-create-shipping');
    static $tableQuotationCopy = $('#datable-copy-quotation');
    static $tableQuotationCopyProduct = $('#datable-copy-quotation-product');
    static $tableSProduct = $('#table-select-product');
    static $tableSOffset = $('#table-select-offset');
    static $tableSTool = $('#table-select-tool');
    static $tableSAsset = $('#table-select-asset');
    static $tableSTerm = $('#table-select-term');
    static $tableSInvoice = $('#table-select-invoice');
    static $tableSReconcile = $('#table-select-reconcile');

    static dataTableProduct(data) {
        /*
        asset_type = '1' (product): select 1 offset item
        data row have product_data {} (.table-row-item) and offset_data [] (.table-row-offset)
        asset_type = '2' (tool): select multiple tools and quantity is total of tools
        data row have product_data {} (.table-row-item) and tool_data [] (.table-row-tool-data)
        asset_type = '3' (asset): select multiple assets and quantity is total of assets
        data row have product_data {} (.table-row-item) and asset_data [] (.table-row-asset-data)
        */
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
                        return `<span class="table-row-order ml-2">${row?.['order']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '15%',
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        let itemType = 0  // product
                        if (row?.['promotion_id']) {
                            itemType = 1  // promotion
                        }
                        if (row?.['shipping_id']) {
                            itemType = 2  // shipping
                        }
                        if (itemType === 0) { // PRODUCT
                            return `<textarea class="form-control table-row-item-show zone-readonly" rows="3" data-zone="${dataZone}" readonly>${row?.['product_data']?.['title']}</textarea>
                                    <div class="row table-row-item-area hidden">
                                        <select 
                                            class="form-select table-row-item"
                                            id="product-${row?.['order']}"
                                            data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-product')}"
                                            data-method="GET"
                                            data-keyResp="product_sale_list"
                                            data-product-id="${row?.['product_data']?.['id']}"
                                            data-zone="${dataZone}"
                                            readonly>
                                        </select>
                                    </div>`;
                        } else if (itemType === 1) { // PROMOTION
                            return `<textarea class="form-control table-row-promotion-show zone-readonly" rows="3" data-zone="${dataZone}" readonly>${LeaseOrderLoadDataHandle.transEle.attr('data-promotion')}</textarea>
                                    <div class="row hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select 
                                                class="form-select table-row-promotion"
                                                id="promotion-${row?.['order']}"
                                                data-id-product="${row?.['promotion_data']?.['product_data']?.['id']}"
                                                data-zone="${dataZone}"
                                                readonly>
                                            </select>
                                        </div>
                                    </div>`;
                        } else if (itemType === 2) { // SHIPPING
                            return `<textarea class="form-control table-row-shipping-show zone-readonly" rows="3" data-zone="${dataZone}" readonly>${LeaseOrderLoadDataHandle.transEle.attr('data-shipping')}</textarea>
                                    <div class="row hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select 
                                                class="form-select table-row-shipping"
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
                        let disabled = "disabled";
                        let bsTarget = "";
                        if (row?.['asset_type']) {
                            disabled = "";
                            if (row?.['asset_type'] === 1) {
                                bsTarget = "#selectOffsetModal";
                            }
                            if (row?.['asset_type'] === 2) {
                                bsTarget = "#selectToolModal";
                            }
                            if (row?.['asset_type'] === 3) {
                                bsTarget = "#selectAssetModal";
                            }
                        }
                        return `<div class="d-flex align-items-center">
                                    <textarea class="form-control table-row-offset-show zone-readonly" rows="3" data-zone="${dataZone}" readonly></textarea>
                                    <button
                                            type="button"
                                            class="btn btn-icon btn-select-offset"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="${bsTarget}"
                                            data-zone="${dataZone}"
                                            ${disabled}
                                        ><i class="fas fa-ellipsis-h"></i>
                                        </button>
                                </div>
                                <div class="row table-row-item-area hidden">
                                    <select 
                                        class="form-select table-row-offset"
                                        id="offset-${row?.['order']}"
                                        data-offset-id="${row?.['offset_data']?.['id'] ? row?.['offset_data']?.['id'] : ""}"
                                        data-zone="${dataZone}"
                                        readonly>
                                    </select>
                                    <input type="text" class="form-control table-row-offset-data hidden">
                                    <input type="text" class="form-control table-row-asset-data hidden">
                                    <input type="text" class="form-control table-row-tool-data hidden">
                                </div>`;
                    }
                },
                {
                    targets: 4,
                    width: '8%',
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        return `<select 
                                    class="form-select table-row-uom"
                                    data-zone="${dataZone}"
                                    required
                                    readonly
                                 >
                                </select>`;
                    },
                },
                {
                    targets: 5,
                    width: '8%',
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        let readonly = "readonly";
                        return `<input type="text" class="form-control table-row-quantity valid-num" value="${row?.['product_quantity']}" data-zone="${dataZone}" ${readonly} required>`;
                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        return `<div class="row">
                                        <div class="input-group">
                                            <input type="text" class="form-control table-row-quantity-time valid-num" value="${row?.['product_quantity_time'] ? row?.['product_quantity_time'] : "0"}" data-zone="${dataZone}" required>
                                            <span class="input-group-text">${LeaseOrderLoadDataHandle.transEle.attr('data-month')}</span>
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
                    width: '13%',
                    render: (data, type, row) => {
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
                let offsetShowEle = row.querySelector('.table-row-offset-show');
                let offsetDataEle = row.querySelector('.table-row-offset-data');
                let toolDataEle = row.querySelector('.table-row-tool-data');
                let assetDataEle = row.querySelector('.table-row-asset-data');
                let uomEle = row.querySelector('.table-row-uom');
                let uomTimeEle = row.querySelector('.table-row-uom-time');
                let taxEle = row.querySelector('.table-row-tax');
                if (itemEle) {
                    let dataS2 = [];
                    if (data?.['product_data']) {
                        dataS2 = [data?.['product_data']];
                    }
                    FormElementControl.loadInitS2($(itemEle), dataS2);
                    $(itemEle).attr('data-product-id', data?.['product_data']?.['id']);
                    LeaseOrderLoadDataHandle.loadPriceProduct(itemEle);
                }
                if (promotionEle) {
                    let dataS2 = [];
                    if (data?.['promotion_data']) {
                        dataS2 = [data?.['promotion_data']];
                    }
                    FormElementControl.loadInitS2($(promotionEle), dataS2);
                }
                if (shippingEle) {
                    let dataS2 = [];
                    if (data?.['shipping_data']) {
                        dataS2 = [data?.['shipping_data']];
                    }
                    FormElementControl.loadInitS2($(shippingEle), dataS2);
                }
                if (assetTypeEle) {
                    FormElementControl.loadInitS2($(assetTypeEle), LeaseOrderLoadDataHandle.dataAssetType);
                    if (data?.['asset_type']) {
                        $(assetTypeEle).val(data?.['asset_type']).trigger('change');
                    }
                }
                if (offsetShowEle) {
                    if (data?.['asset_type']) {
                        if (data?.['asset_type'] === 1) {
                            let titles = [];
                            for (let offsetData of data?.['offset_data'] ? data?.['offset_data'] : []) {
                                let title = offsetData?.['offset_data']?.['title'];
                                if (offsetData?.['product_quantity']) {
                                    title += " (" + offsetData?.['product_quantity'] + ")";
                                }
                                titles.push(title);
                            }
                            $(offsetShowEle).val(titles.join("\n"));
                        }
                        if (data?.['asset_type'] === 2) {
                            let titles = [];
                            for (let toolData of data?.['tool_data'] ? data?.['tool_data'] : []) {
                                let title = toolData?.['tool_data']?.['title'];
                                if (toolData?.['product_quantity']) {
                                    title += " (" + toolData?.['product_quantity'] + ")";
                                }
                                titles.push(title);
                            }
                            $(offsetShowEle).val(titles.join("\n"));
                        }
                        if (data?.['asset_type'] === 3) {
                            let titles = [];
                            for (let assetData of data?.['asset_data'] ? data?.['asset_data'] : []) {
                                let title = assetData?.['asset_data']?.['title'];
                                if (assetData?.['asset_data']?.['product_data']?.['sale_information']?.['default_uom']?.['id']) {
                                    title += "(" + assetData?.['asset_data']?.['product_data']?.['sale_information']?.['default_uom']?.['title'] + ")"
                                }
                                titles.push(title);
                            }
                            $(offsetShowEle).val(titles.join("\n"));
                        }
                    }
                }
                if (offsetDataEle) {
                    $(offsetDataEle).val(JSON.stringify(data?.['offset_data'] ? data?.['offset_data'] : []));
                }
                if (toolDataEle) {
                    $(toolDataEle).val(JSON.stringify(data?.['tool_data'] ? data?.['tool_data'] : []));
                }
                if (assetDataEle) {
                    $(assetDataEle).val(JSON.stringify(data?.['asset_data'] ? data?.['asset_data'] : []));
                }
                if (uomEle) {
                    let dataS2 = [];
                    if (data?.['uom_data']) {
                        dataS2 = [data?.['uom_data']];
                    }
                    FormElementControl.loadInitS2($(uomEle), dataS2);
                }
                if (uomTimeEle) {
                    let dataS2 = [];
                    if (data?.['uom_time_data']) {
                        dataS2 = [data?.['uom_time_data']];
                    }
                    FormElementControl.loadInitS2($(uomTimeEle), dataS2);
                }
                if (taxEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    FormElementControl.loadInitS2($(taxEle), dataS2);
                }
            },
            drawCallback: function () {
                LeaseOrderDataTableHandle.dtbProductHDCustom();
            },
        });
    };

    static dataTableCost(data) {
        /*
        asset_type = '1' (product): data row have product_data {} (.table-row-item) and offset_data {} (.table-row-offset)
        asset_type = '2' (tool): data row have product_data {} (.table-row-item) and tool_data [] (.table-row-tool)
        asset_type = '3' (asset): data row have product_data {} (.table-row-item) and asset_data [] (.table-row-asset)
        */
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
                        return `<span class="table-row-order">${row?.['order']}</span>`;
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
                            let target = {};
                            if (row?.['asset_type'] === 1) {
                                target = row?.['offset_data'];
                            }
                            if (row?.['asset_type'] === 2) {
                                target = row?.['tool_data'];
                            }
                            if (row?.['asset_type'] === 3) {
                                target = row?.['asset_data'];
                            }
                            return `<textarea class="form-control table-row-item-show zone-readonly" rows="3" data-zone="${dataZone}" readonly>${target?.['title']}</textarea>
                                    <div class="row table-row-item-area hidden">
                                        <select
                                            class="form-select table-row-item"
                                            data-product-id="${row?.['product_data']?.['id']}"
                                            data-zone="${dataZone}"
                                            readonly
                                        >
                                        </select>
                                        <select 
                                            class="form-select table-row-asset-type"
                                         >
                                        </select>
                                        <select
                                            class="form-select table-row-offset"
                                            data-product-id="${row?.['offset_data']?.['id']}"
                                            data-offset-id="${row?.['offset_data']?.['id']}"
                                            data-zone="${dataZone}"
                                            readonly
                                        >
                                        </select>
                                        <select
                                            class="form-select table-row-tool"
                                            data-product-id="${row?.['tool_data']?.['id']}"
                                            data-tool-id="${row?.['tool_data']?.['id']}"
                                            data-zone="${dataZone}"
                                            readonly
                                        >
                                        </select>
                                        <select
                                            class="form-select table-row-asset"
                                            data-product-id="${row?.['asset_data']?.['id']}"
                                            data-asset-id="${row?.['asset_data']?.['id']}"
                                            data-zone="${dataZone}"
                                            readonly
                                        >
                                        </select>
                                    </div>`;
                        } else if (itemType === 1) {  // shipping
                            return `<div class="table-row-shipping" data-shipping="${JSON.stringify(row?.['shipping_data']).replace(/"/g, "&quot;")}"><i class="fas fa-shipping-fast mr-2"></i><span>${LeaseOrderLoadDataHandle.transEle.attr('data-shipping')}</span></div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: '15%',
                    render: (data, type, row) => {
                        let target = {};
                        if (row?.['asset_type'] === 1) {
                            target = row?.['offset_data'];
                        }
                        if (row?.['asset_type'] === 2) {
                            target = row?.['tool_data'];
                        }
                        if (row?.['asset_type'] === 3) {
                            target = row?.['asset_data'];
                        }
                        return `<textarea class="form-control table-row-code" rows="3" readonly>${target?.['code'] ? target?.['code'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: () => {
                        let dataZone = "lease_costs_data";
                        return `<select 
                                    class="form-select table-row-uom disabled-custom-show zone-readonly"
                                    data-zone="${dataZone}"
                                    readonly
                                >
                                </select>`;
                    },
                },
                {
                    targets: 4,
                    width: '6%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<input type="text" class="form-control table-row-quantity text-black zone-readonly" value="${row?.['product_quantity']}" data-zone="${dataZone}" readonly>`;
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        return `<div class="row">
                                        <div class="input-group">
                                            <input type="text" class="form-control table-row-quantity-time text-black valid-num" value="${row?.['product_quantity_time'] ? row?.['product_quantity_time'] : "0"}" required readonly>
                                            <span class="input-group-text">${LeaseOrderLoadDataHandle.transEle.attr('data-month')}</span>
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
                    targets: 6,
                    width: '15%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        let readonly = "readonly";
                        if (row?.['asset_type'] === 1) {
                            readonly = "";
                        }
                        let costPrice = row?.['product_cost_price'] ? row?.['product_cost_price'] : 0;
                        if (costPrice === 0) {
                            costPrice = row?.['offset_data']?.['standard_price'] ? row?.['offset_data']?.['standard_price'] : 0;
                        }
                        return `<div class="row">
                                    <input 
                                        type="text" 
                                        class="form-control mask-money table-row-price disabled-custom-show" 
                                        value="${costPrice}"
                                        data-return-type="number"
                                        data-zone="${dataZone}"
                                        ${readonly}
                                    >
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '12%',
                    render: (data, type, row) => {
                        let dataZone = "lease_costs_data";
                        let readonly = "readonly";
                        if (row?.['asset_type'] === 1) {
                            readonly = "";
                        }
                        return `<div class="row">
                                    <div class="d-flex align-items-center">
                                        <div class="input-group">
                                            <input 
                                                type="text" 
                                                class="form-control table-row-depreciation-time" 
                                                value="${row?.['product_depreciation_time'] ? row?.['product_depreciation_time'] : 0}"
                                                data-zone="${dataZone}"
                                                ${readonly}
                                            >
                                            <span class="input-group-text">${LeaseOrderLoadDataHandle.transEle.attr('data-month')}</span>
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
                                    <input type="text" class="form-control table-row-depreciation-data hidden">
                                    <input type="text" class="form-control table-row-depreciation-lease-data hidden">
                                    
                                    <input type="text" class="form-control table-row-product-convert-into" value="${row?.['product_convert_into'] ? row?.['product_convert_into'] : ""}" hidden>
                                    <input type="text" class="form-control table-row-asset-type-data" value="${row?.['asset_type_data'] ? row?.['asset_type_data'] : ""}" hidden>
                                    <input type="text" class="form-control table-row-asset-group-manage-data" value="${row?.['asset_group_manage_data'] ? row?.['asset_group_manage_data'] : ""}" hidden>
                                    <input type="text" class="form-control table-row-asset-group-using-data" value="${row?.['asset_group_using_data'] ? row?.['asset_group_using_data'] : ""}" hidden>
                                    <input type="text" class="form-control table-row-tool-type-data" value="${row?.['tool_type_data'] ? row?.['tool_type_data'] : ""}" hidden>
                                    <input type="text" class="form-control table-row-tool-group-manage-data" value="${row?.['tool_group_manage_data'] ? row?.['tool_group_manage_data'] : ""}" hidden>
                                    <input type="text" class="form-control table-row-tool-group-using-data" value="${row?.['tool_group_using_data'] ? row?.['tool_group_using_data'] : ""}" hidden>
                                </div>`;
                    }
                },
                {
                    targets: 8,
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
                let assetTypeEle = row.querySelector('.table-row-asset-type');
                let offsetEle = row.querySelector('.table-row-offset');
                let toolEle = row.querySelector('.table-row-tool');
                let assetEle = row.querySelector('.table-row-asset');
                let uomEle = row.querySelector('.table-row-uom');
                let uomTimeEle = row.querySelector('.table-row-uom-time');
                let depreciationDataEle = row.querySelector('.table-row-depreciation-data');
                let depreciationLeaseDataEle = row.querySelector('.table-row-depreciation-lease-data');
                let toolTypeDataEle = row.querySelector('.table-row-tool-type-data');
                let toolGMDataEle = row.querySelector('.table-row-tool-group-manage-data');
                let toolGSDataEle = row.querySelector('.table-row-tool-group-using-data');
                let assetTypeDataEle = row.querySelector('.table-row-asset-type-data');
                let assetGMDataEle = row.querySelector('.table-row-asset-group-manage-data');
                let assetGSDataEle = row.querySelector('.table-row-asset-group-using-data');
                if (itemEle) {
                    let dataS2 = [];
                    if (data?.['product_data']) {
                        dataS2 = [data?.['product_data']];
                    }
                    FormElementControl.loadInitS2($(itemEle), dataS2);
                    $(itemEle).attr('data-product-id', data?.['product_data']?.['id']);
                }
                if (assetTypeEle) {
                    FormElementControl.loadInitS2($(assetTypeEle), LeaseOrderLoadDataHandle.dataAssetType);
                    if (data?.['asset_type']) {
                        $(assetTypeEle).val(data?.['asset_type']).trigger('change');
                    }
                }
                if (offsetEle) {
                    let dataS2 = [];
                    if (data?.['offset_data']) {
                        dataS2 = [data?.['offset_data']];
                    }
                    FormElementControl.loadInitS2($(offsetEle), dataS2);
                }
                if (toolEle) {
                    let dataS2 = [];
                    if (data?.['tool_data']) {
                        dataS2 = [data?.['tool_data']];
                    }
                    FormElementControl.loadInitS2($(toolEle), dataS2);
                }
                if (assetEle) {
                    let dataS2 = [];
                    if (data?.['asset_data']) {
                        dataS2 = [data?.['asset_data']];
                    }
                    FormElementControl.loadInitS2($(assetEle), dataS2);
                }
                if (uomEle) {
                    let dataS2 = [];
                    if (data?.['uom_data']) {
                        dataS2 = [data?.['uom_data']];
                    }
                    FormElementControl.loadInitS2($(uomEle), dataS2);
                }
                if (uomTimeEle) {
                    let dataS2 = [];
                    if (data?.['uom_time_data']) {
                        dataS2 = [data?.['uom_time_data']];
                    }
                    FormElementControl.loadInitS2($(uomTimeEle), dataS2);
                }
                if (depreciationDataEle) {
                    $(depreciationDataEle).val(JSON.stringify(data?.['depreciation_data'] ? data?.['depreciation_data'] : []));
                }
                if (depreciationLeaseDataEle) {
                    $(depreciationLeaseDataEle).val(JSON.stringify(data?.['depreciation_lease_data'] ? data?.['depreciation_lease_data'] : []));
                }
                if (toolTypeDataEle && toolGMDataEle && toolGSDataEle) {
                    $(toolTypeDataEle).val("");
                    if (data?.['tool_type_data']) {
                        $(toolTypeDataEle).val(JSON.stringify(data?.['tool_type_data']));
                    }
                    $(toolGMDataEle).val("");
                    if (data?.['tool_group_manage_data']) {
                        $(toolGMDataEle).val(JSON.stringify(data?.['tool_group_manage_data']));
                    }
                    $(toolGSDataEle).val("");
                    if (data?.['tool_group_using_data']) {
                        $(toolGSDataEle).val(JSON.stringify(data?.['tool_group_using_data']));
                    }

                }
                if (assetTypeDataEle && assetGMDataEle && assetGSDataEle) {
                    $(assetTypeDataEle).val("");
                    if (data?.['asset_type_data']) {
                        $(assetTypeDataEle).val(JSON.stringify(data?.['asset_type_data']));
                    }
                    $(assetGMDataEle).val("");
                    if (data?.['asset_group_manage_data']) {
                        $(assetGMDataEle).val(JSON.stringify(data?.['asset_group_manage_data']));
                    }
                    $(assetGSDataEle).val("");
                    if (data?.['asset_group_using_data']) {
                        $(assetGSDataEle).val(JSON.stringify(data?.['asset_group_using_data']));
                    }
                }
            },
            drawCallback: function () {
                LeaseOrderDataTableHandle.dtbCostHDCustom();
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
                        return `<input type="text" class="form-control table-row-quantity valid-num" value="${row?.['expense_quantity']}" data-zone="${dataZone}" required>`;
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
                    FormElementControl.loadInitS2($(expenseEle), dataS2);
                }
                if (laborEle && data?.['is_labor'] === true) {
                    let dataS2 = [];
                    if (data?.['expense_data']) {
                        dataS2 = [data?.['expense_data']];
                    }
                    FormElementControl.loadInitS2($(laborEle), dataS2);
                }
                if (uomEle) {
                    let dataS2 = [];
                    if (data?.['uom_data']) {
                        dataS2 = [data?.['uom_data']];
                    }
                    FormElementControl.loadInitS2($(uomEle), dataS2);
                }
                if (taxEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    FormElementControl.loadInitS2($(taxEle), dataS2);
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                LeaseOrderDataTableHandle.dtbExpenseHDCustom();
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

    static dataTableCopyQuotation() {
        // init dataTable
        let params = {
            'employee_inherit': LeaseOrderLoadDataHandle.salePersonSelectEle.val(),
            'system_status__in': [2, 3].join(','),
        }
        if (!LeaseOrderLoadDataHandle.$form[0].classList.contains('sale-order')) {
            params = {
                'employee_inherit': LeaseOrderLoadDataHandle.salePersonSelectEle.val(),
                'system_status__in': [2, 3, 4].join(','),
            }
        }
        LeaseOrderDataTableHandle.$tableQuotationCopy.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: LeaseOrderLoadDataHandle.urlEle.attr('data-quotation'),
                type: "GET",
                data: params,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('quotation_list')) {
                        return resp.data['quotation_list'] ? resp.data['quotation_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        if (row?.['title'] && row?.['code']) {
                            return `<div class="form-check form-check-lg d-flex align-items-center">
                                        <input type="radio" name="row-check" class="form-check-input table-row-check" id="copy-${row?.['id'].replace(/-/g, "")}" data-id="${row?.['id']}">
                                        <label class="form-check-label table-row-title" for="copy-${row?.['id'].replace(/-/g, "")}">${row?.['title']}</label>
                                    </div>`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row?.['code'] ? row?.['code'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        if (row?.['opportunity']?.['title'] && row?.['opportunity']?.['code']) {
                            return `<span class="table-row-customer">${row?.['opportunity']?.['title']}</span>`;
                        }
                        return ``;
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        if (row?.['customer']?.['title']) {
                            return `<p class="table-row-customer">${row?.['customer']?.['title']}</p>`;
                        }
                        return ``;
                    },
                }
            ],
            drawCallback: function () {
                LeaseOrderLoadDataHandle.loadEventRadio(LeaseOrderDataTableHandle.$tableQuotationCopy);
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
                        return `<span class="mask-money table-row-price" data-init-money="${parseFloat(row?.['shipping_price'] ? row?.['shipping_price'] : '0')}"></span>`
                    }
                },
                {
                    targets: 3,
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
        let noMapArea = LeaseOrderLoadDataHandle.$modalShipping[0].querySelector('.no-map-area');
        let noLogistic = LeaseOrderLoadDataHandle.$modalShipping[0].querySelector('.no-logistic');
        if (noMapArea && noLogistic) {
            $(noMapArea).attr('hidden', 'true');
            $(noLogistic).attr('hidden', 'true');
        }
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
                                    let checkData = LeaseOrderShippingHandle.checkShippingValid(item, shippingAddress);
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
                            if (passList.length === failList.length) {
                                $(noMapArea).removeAttr('hidden');
                            }
                        } else {
                            LeaseOrderDataTableHandle.dataTableShipping(passList);
                            $(noLogistic).removeAttr('hidden');
                            // $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-check-if-shipping-address')}, 'info');
                        }
                    }
                }
            }
        )
    };

    static dataTableSelectProduct() {
        LeaseOrderDataTableHandle.$tableSProduct.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: LeaseOrderLoadDataHandle.urlEle.attr('data-md-product'),
                data: {'general_product_types_mapped__is_service': true},
                type: "GET",
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('product_sale_list')) {
                        return resp.data['product_sale_list'] ? resp.data['product_sale_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            autoWidth: true,
            scrollX: true,
            scrollY: "60vh",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        let clsZoneReadonly = '';
                        let disabled = '';
                        let checked = '';
                        if (LeaseOrderLoadDataHandle.$productsCheckedEle.val()) {
                            let storeID = JSON.parse(LeaseOrderLoadDataHandle.$productsCheckedEle.val());
                            if (typeof storeID === 'object') {
                                if (storeID?.[row?.['id']]) {
                                    if (storeID?.[row?.['id']]?.['type'] === "selected") {
                                        disabled = 'disabled';
                                    }
                                    checked = 'checked';
                                    clsZoneReadonly = 'zone-readonly';
                                }
                            }
                        }
                        let checkBOM = LeaseOrderLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            disabled = 'disabled';
                            checked = '';
                            clsZoneReadonly = 'zone-readonly';
                        }
                        if (row?.['title'] && row?.['code']) {
                            return `<div class="form-check form-check-lg d-flex align-items-center">
                                        <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox ${clsZoneReadonly}" id="s-service-${row?.['id'].replace(/-/g, "")}" ${disabled} ${checked} data-zone="${dataZone}">
                                        <textarea class="form-control form-check-label table-row-title" rows="3" readonly>${row?.['title']}</textarea>
                                    </div>`;
                        }
                        return `<span>--</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-code" rows="3" readonly>${row?.['code'] ? row?.['code'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-description" rows="3" readonly>${row?.['description'] ? row?.['description'] : ''}</textarea>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-category">${row?.['general_information']?.['product_category']?.['title'] ? row?.['general_information']?.['product_category']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['sale_information']?.['default_uom']?.['title'] ? row?.['sale_information']?.['default_uom']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 5,
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
                    targets: 6,
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
                LeaseOrderDataTableHandle.dtbSelectProductHDCustom();
            },
        });
    };

    static dataTableSelectOffset(params) {
        LeaseOrderDataTableHandle.$tableSOffset.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: LeaseOrderLoadDataHandle.urlEle.attr('data-md-product'),
                data: params,
                type: "GET",
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('product_sale_list')) {
                        return resp.data['product_sale_list'] ? resp.data['product_sale_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            autoWidth: true,
            scrollX: true,
            scrollY: "60vh",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        let clsZoneReadonly = '';
                        let checked = '';
                        if (LeaseOrderLoadDataHandle.$offsetsCheckedEle.val()) {
                            let storeID = JSON.parse(LeaseOrderLoadDataHandle.$offsetsCheckedEle.val());
                            if (typeof storeID === 'object') {
                                if (storeID?.[row?.['id']]) {
                                    checked = 'checked';
                                }
                            }
                        }
                        if (row?.['title'] && row?.['code']) {
                            return `<div class="form-check form-check-lg d-flex align-items-center">
                                        <input type="checkbox" name="row-checkbox-offset" class="form-check-input table-row-checkbox ${clsZoneReadonly}" id="s-product-${row?.['id'].replace(/-/g, "")}" ${checked} data-zone="${dataZone}">
                                        <textarea class="form-control form-check-label table-row-title" rows="3" readonly>${row?.['title']}</textarea>
                                    </div>`;
                        }
                        return `<span>--</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let value = 0;
                        let targetEle = LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${LeaseOrderLoadDataHandle.$btnSaveSelectOffset.attr('data-product-id')}"]`);
                        if (targetEle) {
                            let targetRow = targetEle.closest('tr');
                            if (targetRow) {
                                let offsetDataEle = targetRow.querySelector('.table-row-offset-data');
                                if (offsetDataEle) {
                                    if ($(offsetDataEle).val()) {
                                        let offsetData = JSON.parse($(offsetDataEle).val());
                                        for (let offset of offsetData) {
                                            if (offset?.['offset_id'] === row?.['id']) {
                                                value = offset?.['product_quantity'];
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return `<input type="text" class="form-control table-row-quantity valid-num" value="${value}">`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-code" rows="3" readonly>${row?.['code'] ? row?.['code'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-description" rows="3" readonly>${row?.['description'] ? row?.['description'] : ''}</textarea>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row?.['sale_information']?.['default_uom']?.['title'] ? row?.['sale_information']?.['default_uom']?.['title'] : ''}</span>`;
                    }
                },
            ],
            drawCallback: function () {
                LeaseOrderDataTableHandle.dtbSelectOffsetHDCustom();
            },
        });
    };

    static dataTableSelectTool() {
        LeaseOrderDataTableHandle.$tableSTool.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: LeaseOrderLoadDataHandle.urlEle.attr('data-md-tool'),
                type: "GET",
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('instrument_tool_for_lease_list')) {
                        return resp.data['instrument_tool_for_lease_list'] ? resp.data['instrument_tool_for_lease_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            autoWidth: true,
            scrollX: true,
            scrollY: "60vh",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        let clsZoneReadonly = '';
                        let checked = '';
                        if (LeaseOrderLoadDataHandle.$toolsCheckedEle.val()) {
                            let storeID = JSON.parse(LeaseOrderLoadDataHandle.$toolsCheckedEle.val());
                            if (typeof storeID === 'object') {
                                if (storeID?.[row?.['id']]) {
                                    checked = 'checked';
                                }
                            }
                        }
                        if (row?.['tool_id']) {
                            return `<div class="form-check form-check-lg d-flex align-items-center">
                                        <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox ${clsZoneReadonly}" id="s-tool-${row?.['tool_id'].replace(/-/g, "")}" ${checked} data-zone="${dataZone}">
                                        <label class="form-check-label table-row-title" for="s-tool-${row?.['tool_id'].replace(/-/g, "")}">${row?.['title'] ? row?.['title'] : ''}</label>
                                    </div>`;
                        }
                        return `<span>--</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row?.['code'] ? row?.['code'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-total">${row?.['quantity'] ? row?.['quantity'] : 0}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-origin-cost" data-init-money="${parseFloat(row?.['origin_cost'] ? row?.['origin_cost'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span>${moment(row?.['depreciation_start_date']).format('DD/MM/YYYY')}</span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        let netValue = DepreciationControl.getNetValue({
                            "data_depreciation": row?.['depreciation_data'],
                            "current_date": DateTimeControl.getCurrentDate("DMY", "/")
                        })
                        return `<span class="mask-money table-row-net-value" data-init-money="${netValue ? netValue : 0}"></span>`;
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span>${row?.['depreciation_time']}</span>`;
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        let available = row?.['quantity'] - row?.['quantity_leased'];
                        if (available <= 0) {
                            available = 0;
                        }
                        return `<span class="table-row-available">${available}</span>`;
                    }
                },
                {
                    targets: 8,
                    render: (data, type, row) => {
                        let value = 0;
                        let targetEle = LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${LeaseOrderLoadDataHandle.$btnSaveSelectTool.attr('data-product-id')}"]`);
                        if (targetEle) {
                            let targetRow = targetEle.closest('tr');
                            if (targetRow) {
                                let toolDataEle = targetRow.querySelector('.table-row-tool-data');
                                if (toolDataEle) {
                                    if ($(toolDataEle).val()) {
                                        let toolData = JSON.parse($(toolDataEle).val());
                                        for (let tool of toolData) {
                                            if (tool?.['tool_id'] === row?.['id']) {
                                                value = tool?.['product_quantity'];
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return `<input type="text" class="form-control table-row-quantity valid-num" value="${value}">`;
                    }
                },
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
                LeaseOrderLoadDataHandle.loadEventCheckbox(LeaseOrderDataTableHandle.$tableSTool);
                LeaseOrderDataTableHandle.dtbSelectToolHDCustom();
            },
        });
    };

    static dataTableSelectAsset() {
        LeaseOrderDataTableHandle.$tableSAsset.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: LeaseOrderLoadDataHandle.urlEle.attr('data-md-asset'),
                data: {"status": 0},
                type: "GET",
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('fixed_asset_for_lease_list')) {
                        return resp.data['fixed_asset_for_lease_list'] ? resp.data['fixed_asset_for_lease_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            autoWidth: true,
            scrollX: true,
            scrollY: "60vh",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataZone = "lease_products_data";
                        let clsZoneReadonly = '';
                        let checked = '';
                        if (LeaseOrderLoadDataHandle.$assetsCheckedEle.val()) {
                            let storeID = JSON.parse(LeaseOrderLoadDataHandle.$assetsCheckedEle.val());
                            if (typeof storeID === 'object') {
                                if (storeID?.[row?.['id']]) {
                                    checked = 'checked';
                                }
                            }
                        }
                        if (row?.['asset_id']) {
                            return `<div class="form-check form-check-lg d-flex align-items-center">
                                        <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox ${clsZoneReadonly}" id="s-asset-${row?.['asset_id'].replace(/-/g, "")}" ${checked} data-zone="${dataZone}">
                                        <label class="form-check-label table-row-title" for="s-asset-${row?.['asset_id'].replace(/-/g, "")}">${row?.['title'] ? row?.['title'] : ''}</label>
                                    </div>`;
                        }
                        return `<span>--</span>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row?.['code'] ? row?.['code'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-origin-cost" data-init-money="${parseFloat(row?.['origin_cost'] ? row?.['origin_cost'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span>${moment(row?.['depreciation_start_date']).format('DD/MM/YYYY')}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let netValue = DepreciationControl.getNetValue({
                            "data_depreciation": row?.['depreciation_data'],
                            "current_date": DateTimeControl.getCurrentDate("DMY", "/")
                        })
                        return `<span class="mask-money table-row-net-value" data-init-money="${netValue ? netValue : 0}"></span>`;
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span>${row?.['depreciation_time']}</span>`;
                    }
                },
                {
                    targets: 6,
                    render: () => {
                        return `<span>1</span>`;
                    }
                },
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
                LeaseOrderDataTableHandle.dtbSelectAssetHDCustom();
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
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-month">${row?.['month']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-start-date">${row?.['begin'] ? row?.['begin'] : ''}</span>`;
                    }
                },
                {
                    targets: 2,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-end-date">${row?.['end'] ? row?.['end'] : ''}</span>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-start-net-value" data-init-money="${parseFloat(row?.['start_value'] ? row?.['start_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-depreciation-value" data-init-money="${parseFloat(row?.['depreciation_value'] ? row?.['depreciation_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<span class="mask-money table-row-end-net-value" data-init-money="${parseFloat(row?.['end_value'] ? row?.['end_value'] : '0')}"></span>`;
                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    render: (data, type, row) => {
                        let $leaseStartDateEle = $('#lease_start_date');
                        let $leaseEndDateEle = $('#lease_end_date');
                        if ($leaseStartDateEle.val() && $leaseEndDateEle.val()) {
                            return `<span class="table-row-lease-time">${row?.['lease_time'] ? row?.['lease_time'] : ''}</span>`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 7,
                    width: '10%',
                    render: (data, type, row) => {
                        let $leaseStartDateEle = $('#lease_start_date');
                        let $leaseEndDateEle = $('#lease_end_date');
                        if ($leaseStartDateEle.val() && $leaseEndDateEle.val() && row?.['lease_allocated']) {
                            return `<span class="mask-money table-row-lease-allocated" data-init-money="${parseFloat(row?.['lease_allocated'] ? row?.['lease_allocated'] : '0')}"></span>`;
                        }
                        return ``;
                    }
                },
                {
                    targets: 8,
                    width: '10%',
                    render: (data, type, row) => {
                        let $leaseStartDateEle = $('#lease_start_date');
                        let $leaseEndDateEle = $('#lease_end_date');
                        if ($leaseStartDateEle.val() && $leaseEndDateEle.val() && row?.['lease_accumulative_allocated']) {
                            return `<span class="mask-money table-row-lease-accumulative-allocated" data-init-money="${parseFloat(row?.['lease_accumulative_allocated'] ? row?.['lease_accumulative_allocated'] : '0')}"></span>`;
                        }
                        return ``;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let leaseTimeEle = row.querySelector('.table-row-lease-time');
                let leaseAllocatedEle = row.querySelector('.table-row-lease-allocated');
                let leaseAccumulative = row.querySelector('.table-row-lease-accumulative-allocated');
                if (leaseTimeEle) {
                    if (data?.['lease_time']) {
                        let td = leaseTimeEle.closest('td');
                        if (td) {
                            $(td).addClass("bg-green-light-4");
                        }
                    }
                }
                if (leaseAllocatedEle) {
                    if (data?.['lease_allocated']) {
                        let td = leaseAllocatedEle.closest('td');
                        if (td) {
                            $(td).addClass("bg-blue-light-5");
                        }
                    }
                }
                if (leaseAccumulative) {
                    if (data?.['lease_accumulative_allocated']) {
                        let td = leaseAccumulative.closest('td');
                        if (td) {
                            $(td).addClass("bg-blue-light-5");
                        }
                    }
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                LeaseOrderLoadDataHandle.loadCssToDtb("table-depreciation-detail");
                LeaseOrderDataTableHandle.dtbDepreciationHDCustom();
            },
        });
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
                        return `<span class="table-row-order" data-id="${row?.['order']}">${row?.['order']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '8%',
                    render: () => {
                        return `<select class="form-select table-row-installment" readonly></select>`;
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
                    targets: 5,
                    width: '6%',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                                    <div class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-ratio valid-num" value="${row?.['ratio'] ? row?.['ratio'] : '0'}">
                                        <div class="input-suffix"><small><i class="fas fa-percentage"></i></small></div>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 6,
                    width: '6%',
                    render: (data, type, row) => {
                        // return `<select class="form-select table-row-issue-invoice"></select>`;
                        return `<div class="d-flex justify-content-between align-items-center">
                                    <input type="text" class="form-control table-row-invoice valid-num" value="${row?.['invoice_data']?.['order'] ? row?.['invoice_data']?.['order'] : ''}" readonly>
                                    <button
                                        type="button"
                                        class="btn btn-icon btn-select-invoice"
                                        data-bs-toggle="modal"
                                        data-bs-target="#selectInvoiceModal"
                                    ><i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control table-row-invoice-data hidden">`;
                    }
                },
                {
                    targets: 7,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-before-tax text-black" 
                                    value="${row?.['value_before_tax'] ? row?.['value_before_tax'] : '0'}"
                                    data-return-type="number"
                                    readonly
                                >`;
                    }
                },
                {
                    targets: 8,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-between align-items-center">
                                    <input 
                                        type="text" 
                                        class="form-control mask-money table-row-value-reconcile text-black" 
                                        value="${row?.['value_reconcile'] ? row?.['value_reconcile'] : '0'}"
                                        data-return-type="number"
                                        readonly
                                    >
                                    <button
                                        type="button"
                                        class="btn btn-icon btn-select-reconcile"
                                        data-bs-toggle="modal"
                                        data-bs-target="#selectReconcileModal"
                                    ><i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control table-row-reconcile-data hidden">`;
                    }
                },
                {
                    targets: 9,
                    width: '6%',
                    render: () => {
                        return `<div class="table-row-tax-area">
                                    <select
                                        class="form-select table-row-tax"
                                        data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-tax')}"
                                        data-method="GET"
                                        data-keyResp="tax_list"
                                        readonly
                                    >
                                    </select>
                                </div>
                                <span class="table-row-tax-check" hidden>${LeaseOrderLoadDataHandle.transEle.attr('data-mixed')}</span>`;
                    }
                },
                {
                    targets: 10,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-tax text-black" 
                                    value="${row?.['value_tax'] ? row?.['value_tax'] : '0'}"
                                    data-return-type="number"
                                    readonly
                                >`;
                    }
                },
                {
                    targets: 11,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-value-total text-black" 
                                    value="${row?.['value_total'] ? row?.['value_total'] : '0'}"
                                    data-return-type="number"
                                    readonly
                                >`;
                    }
                },
                {
                    targets: 10,
                    width: '1%',
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-zone="lease_payment_stage" hidden><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let installmentEle = row.querySelector('.table-row-installment');
                let dateEle = row.querySelector('.table-row-date');
                let dueDateEle = row.querySelector('.table-row-due-date');
                let invoiceDataEle = row.querySelector('.table-row-invoice-data');
                let valBeforeEle = row.querySelector('.table-row-value-before-tax');
                let reconcileDataEle = row.querySelector('.table-row-reconcile-data');
                let taxAreaEle = row.querySelector('.table-row-tax-area');
                let taxEle = row.querySelector('.table-row-tax');
                let taxCheckEle = row.querySelector('.table-row-tax-check');
                let valTaxEle = row.querySelector('.table-row-value-tax');
                let valTotalEle = row.querySelector('.table-row-value-total');
                let delEle = row.querySelector('.del-row');

                let $termMD = LeaseOrderLoadDataHandle.paymentSelectEle;
                let checkTax = LeaseOrderLoadDataHandle.loadCheckSameMixTax();
                if (installmentEle) {
                    let term = [];
                    if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
                        let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.paymentSelectEle, LeaseOrderLoadDataHandle.paymentSelectEle.val());
                        if (dataSelected) {
                            term = dataSelected?.['term'];
                            let type = "percent";
                            for (let termData of term) {
                                if (termData?.['unit_type'] === 1) {
                                    type = "amount";
                                }
                                let isNum = parseFloat(termData?.['value']);
                                if (!isNum) {  // balance
                                    termData['value'] = String(LeaseOrderLoadDataHandle.loadParseBalanceOfTerm("payment"));
                                    if (type === "percent") {
                                        termData['unit_type'] = 0;
                                    }
                                    if (type === "amount") {
                                        termData['unit_type'] = 1;
                                    }
                                }
                            }
                        }
                    }
                    term.unshift({'id': '', 'title': 'Select...',});
                    FormElementControl.loadInitS2($(installmentEle), term, {}, null, true);
                    if (data?.['term_id']) {
                        $(installmentEle).val(data?.['term_id']).trigger('change');
                    }
                    if (!$termMD.val()) {
                        installmentEle.setAttribute('readonly', 'true');
                    }
                }
                if (dateEle) {
                    DateTimeControl.initFlatPickrDate(dateEle);
                    if (data?.['date']) {
                        $(dateEle).val(moment(data?.['date']).format('DD/MM/YYYY'));
                    }
                }
                if (dueDateEle) {
                    DateTimeControl.initFlatPickrDate(dueDateEle);
                    if (data?.['due_date']) {
                        $(dueDateEle).val(moment(data?.['due_date']).format('DD/MM/YYYY'));
                    }
                }
                if (invoiceDataEle) {
                    $(invoiceDataEle).val(JSON.stringify(data?.['invoice_data'] ? data?.['invoice_data'] : {}));
                }
                if (valBeforeEle) {
                    if (!$termMD.val() || checkTax?.['check'] === "mixed" && LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        valBeforeEle.removeAttribute('readonly');
                    }
                }
                if (reconcileDataEle) {
                    $(reconcileDataEle).val(JSON.stringify(data?.['reconcile_data'] ? data?.['reconcile_data'] : []));
                }
                if (taxEle && taxAreaEle && taxCheckEle && installmentEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    FormElementControl.loadInitS2($(taxEle), dataS2);

                    if (checkTax?.['check'] === "same" && LeaseOrderDataTableHandle.$tableInvoice.DataTable().rows().count() === 0) {
                        FormElementControl.loadInitS2($(taxEle), checkTax?.['list_tax']);
                    }
                    if (checkTax?.['check'] === "mixed") {
                        taxAreaEle.setAttribute('hidden', 'true');
                        taxCheckEle.removeAttribute('hidden');
                    }
                }
                if (valTaxEle) {
                    if (!$termMD.val() || checkTax?.['check'] === "mixed" && LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        valTaxEle.removeAttribute('readonly');
                    }
                }
                if (valTotalEle) {
                    if (!$termMD.val() || checkTax?.['check'] === "mixed" && LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        valTotalEle.removeAttribute('readonly');
                    }
                }
                if ($(installmentEle).val()) {
                    LeaseOrderLoadDataHandle.loadChangeInstallment(installmentEle);
                }
                if (delEle) {
                    if (!$termMD.val()) {
                        delEle.removeAttribute('hidden');
                    }
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                LeaseOrderDataTableHandle.dtbPaymentHDCustom();
                if (['post', 'put'].includes(LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    // set again WF runtime
                    LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
                }
            },
        });
    };

    static dataTableInvoice(data) {
        // init dataTable
        LeaseOrderDataTableHandle.$tableInvoice.DataTableDefault({
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
                    width: '8%',
                    render: (data, type, row) => {
                        return `<span class="table-row-order" data-id="${row?.['order']}">${row?.['order']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '25%',
                    render: (data, type, row) => {
                        return `<textarea class="form-control table-row-remark" rows="2">${row?.['remark'] ? row?.['remark'] : ""}</textarea>`;
                    }
                },
                {
                    targets: 2,
                    width: '12%',
                    render: (data, type, row) => {
                        return `<div class="input-affix-wrapper">
                                    <input type="text" class="form-control flat-picker text-black table-row-date" autocomplete="off">
                                    <div class="input-suffix">
                                        <i class="fas fa-calendar-alt"></i>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        let ratio = '';
                        if (row?.['ratio']) {
                            if (row?.['ratio'] !== null) {
                                ratio = row?.['ratio'];
                            }
                        }
                        return `<div class="d-flex justify-content-between align-items-center">
                                    <div class="input-group">
                                        <div class="input-affix-wrapper">
                                            <input type="text" class="form-control table-row-ratio valid-num" value="${ratio}" readonly>
                                            <div class="input-suffix"><small><i class="fas fa-percentage"></i></small></div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        class="btn btn-icon btn-select-term"
                                        data-bs-toggle="modal"
                                        data-bs-target="#selectTermModal"
                                    ><i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>
                                <input type="text" class="form-control table-row-term-data hidden">`;
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: () => {
                        return `<div class="table-row-tax-area">
                                    <select
                                        class="form-select table-row-tax"
                                        data-url="${LeaseOrderLoadDataHandle.urlEle.attr('data-md-tax')}"
                                        data-method="GET"
                                        data-keyResp="tax_list"
                                    >
                                    </select>
                                </div>
                                <span class="table-row-tax-check" hidden>${LeaseOrderLoadDataHandle.transEle.attr('data-mixed')}</span>`;
                    }
                },
                {
                    targets: 5,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<input 
                                    type="text" 
                                    class="form-control mask-money table-row-total text-black" 
                                    value="${row?.['total'] ? row?.['total'] : '0'}"
                                    data-return-type="number"
                                    readonly
                                >`;
                    }
                },
                {
                    targets: 6,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<div class="row">
                                    <div class=input-group">
                                        <span class="input-affix-wrapper">
                                            <input 
                                                type="text" 
                                                class="form-control mask-money table-row-balance text-black" 
                                                value="${row?.['balance'] ? row?.['balance'] : 0}"
                                                data-return-type="number"
                                                readonly
                                            >
                                            <span class="input-suffix"><i class="far fa-check-circle text-success paid-full" hidden></i></span>
                                        </span>
                                    </div>
                                </div>`;
                    }
                },
                {
                    targets: 7,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-zone="lease_invoice"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let dateEle = row.querySelector('.table-row-date');
                let taxAreaEle = row.querySelector('.table-row-tax-area');
                let taxEle = row.querySelector('.table-row-tax');
                let taxCheckEle = row.querySelector('.table-row-tax-check');
                let termDataEle = row.querySelector('.table-row-term-data');
                let totalEle = row.querySelector('.table-row-total');
                let paidFullEle = row.querySelector('.paid-full');

                let $termMD = LeaseOrderLoadDataHandle.paymentSelectEle;
                let checkTax = LeaseOrderLoadDataHandle.loadCheckSameMixTax();
                if (dateEle) {
                    DateTimeControl.initFlatPickrDate(dateEle);
                    if (data?.['date']) {
                        $(dateEle).val(moment(data?.['date']).format('DD/MM/YYYY'));
                    }
                }
                if (taxEle && taxAreaEle && taxCheckEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    FormElementControl.loadInitS2($(taxEle), dataS2);

                    if (checkTax?.['check'] === "same") {
                        taxEle.setAttribute('readonly', 'true');
                        FormElementControl.loadInitS2($(taxEle), checkTax?.['list_tax']);
                    }
                    if (checkTax?.['check'] === "mixed") {
                        taxAreaEle.setAttribute('hidden', 'true');
                        taxCheckEle.removeAttribute('hidden');
                    }
                }
                if (termDataEle) {
                    $(termDataEle).val(JSON.stringify(data?.['term_data'] ? data?.['term_data'] : []));
                }
                if (totalEle) {
                    if (!$termMD.val() || checkTax?.['check'] === "mixed" && LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        totalEle.removeAttribute('readonly');
                    }
                }
                if (paidFullEle) {
                    if (data?.['total'] > 0 && data?.['balance'] === 0) {
                        paidFullEle.removeAttribute('hidden');
                    }
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                LeaseOrderDataTableHandle.dtbInvoiceHDCustom();
            },
        });
    };

    static dataTableSelectTerm(data) {
        LeaseOrderDataTableHandle.$tableSTerm.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "400px",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let disabled = "";
                        LeaseOrderDataTableHandle.$tableInvoice.DataTable().rows().every(function () {
                            let rowCheck = this.node();
                            if (!rowCheck.querySelector(`[data-id="${LeaseOrderLoadDataHandle.$btnSaveTerm.attr('data-id')}"]`)) {
                                let termDataEle = rowCheck.querySelector('.table-row-term-data');
                                if (termDataEle) {
                                    if ($(termDataEle).val()) {
                                        let termData = JSON.parse($(termDataEle).val());
                                        for (let term of termData) {
                                            if (term?.['id'] === row?.['id']) {
                                                disabled = "disabled";
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        let checked = "";
                        let target = LeaseOrderDataTableHandle.$tableInvoice[0].querySelector(`[data-id="${LeaseOrderLoadDataHandle.$btnSaveTerm.attr('data-id')}"]`);
                        if (target) {
                            let targetRow = target.closest('tr');
                            if (targetRow) {
                                let termDataEle = targetRow.querySelector('.table-row-term-data');
                                if (termDataEle) {
                                    if ($(termDataEle).val()) {
                                        let termData = JSON.parse($(termDataEle).val());
                                        for (let term of termData) {
                                            if (row?.['id'] === term?.['id']) {
                                                checked = "checked";
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox" id="s-term-${row?.['id'].replace(/-/g, "")}" ${checked} ${disabled}>
                                    <label class="form-check-label table-row-title" for="s-term-${row?.['id'].replace(/-/g, "")}">${row?.['title']}</label>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let dataDateType = JSON.parse($('#payment_date_type').text());
                        return `<span>${dataDateType[row?.['after']][1]}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let txt = ``;
                        if (row?.['unit_type'] === 0 || row?.['unit_type'] === 2) {
                            txt = `<span class="table-row-value">${row?.['value'] ? row?.['value'] : 0} %</span>`;
                        }
                        return txt;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let txt = ``;
                        if (row?.['unit_type'] === 1) {
                            txt = `<span class="mask-money table-row-value" data-init-money="${row?.['value'] ? row?.['value'] : 0}"></span>`;
                        }
                        return txt;
                    }
                },
            ],
            drawCallback: function () {
                LeaseOrderLoadDataHandle.loadEventCheckbox(LeaseOrderDataTableHandle.$tableSTerm);
                $.fn.initMaskMoney2();
            }
        });
    };

    static dataTableSelectInvoice(data) {
        LeaseOrderDataTableHandle.$tableSInvoice.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "400px",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let checked = "";
                        let target = LeaseOrderDataTableHandle.$tablePayment[0].querySelector(`[data-id="${LeaseOrderLoadDataHandle.$btnSaveInvoice.attr('data-id')}"]`);
                        if (target) {
                            let targetRow = target.closest('tr');
                            if (targetRow) {
                                let invoiceDataEle = targetRow.querySelector('.table-row-invoice-data');
                                if (invoiceDataEle) {
                                    if ($(invoiceDataEle).val()) {
                                        let invoiceData = JSON.parse($(invoiceDataEle).val());
                                        if (row?.['order'] === invoiceData?.['order']) {
                                            checked = "checked";
                                        }
                                    }
                                }
                            }
                        }
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="radio" name="radio-invoice" class="form-check-input table-row-checkbox" id="s-invoice-${row?.['order']}" ${checked}>
                                    <label class="form-check-label table-row-order" for="s-invoice-${row?.['order']}">${row?.['order']}</label>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span>${row?.['remark']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let txt = ``;
                        if (row?.['ratio']) {
                            if (row?.['ratio'] !== null) {
                                txt = `<span>${row?.['ratio']} %</span>`;
                            }
                        }
                        return txt;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span>${row?.['tax_data']?.['title'] ? row?.['tax_data']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['total'] ? row?.['total'] : 0}"></span>`;
                    }
                },
            ],
            drawCallback: function () {
                $.fn.initMaskMoney2();
            }
        });
    };

    static dataTableSelectReconcile(data) {
        LeaseOrderDataTableHandle.$tableSReconcile.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "400px",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let checked = "";
                        let target = LeaseOrderDataTableHandle.$tablePayment[0].querySelector(`[data-id="${LeaseOrderLoadDataHandle.$btnSaveReconcile.attr('data-id')}"]`);
                        if (target) {
                            let targetRow = target.closest('tr');
                            if (targetRow) {
                                let reconcileDataEle = targetRow.querySelector('.table-row-reconcile-data');
                                if (reconcileDataEle) {
                                    if ($(reconcileDataEle).val()) {
                                        let reconcileData = JSON.parse($(reconcileDataEle).val());
                                        for (let reconcile of reconcileData) {
                                            if (row?.['order'] === reconcile?.['order']) {
                                                checked = "checked";
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox" id="s-reconcile-${row?.['order']}" ${checked}>
                                    <label class="form-check-label table-row-order" for="s-reconcile-${row?.['order']}">${row?.['term_data']?.['title']}</label>
                                </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span>${row?.['remark']}</span>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let txt = ``;
                        if (row?.['ratio']) {
                            if (row?.['ratio'] !== null) {
                                txt = `<span>${row?.['ratio']} %</span>`;
                            }
                        }
                        return txt;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span>${row?.['tax_data']?.['title'] ? row?.['tax_data']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['value_total'] ? row?.['value_total'] : 0}"></span>`;
                    }
                },
            ],
            drawCallback: function () {
                LeaseOrderLoadDataHandle.loadEventCheckbox(LeaseOrderDataTableHandle.$tableSReconcile);
                $.fn.initMaskMoney2();
            }
        });
    };

    // Custom dtb
    static dtbProductHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableProduct;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-product-quotation-create').length && !$('#btn-add-product-group-quotation').length && !$('#btn-check-promotion').length && !$('#btn-add-shipping').length) {
                let hidden = "";
                if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hidden = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" aria-expanded="false" data-bs-toggle="dropdown" data-zone="lease_products_data" ${hidden}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${LeaseOrderLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>
                                <div class="dropdown-menu w-210p">
                                    <a class="dropdown-item" href="#" id="btn-add-product-quotation-create" data-bs-toggle="offcanvas" data-bs-target="#selectProductModal"><i class="dropdown-icon fas fa-cube"></i><span class="mt-2">${LeaseOrderLoadDataHandle.transEle.attr('data-add-service')}</span></a>
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
                    LeaseOrderLoadDataHandle.loadChangePaymentTerm();
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
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbExpenseHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableExpense;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-expense-quotation-create').length && !$('#btn-add-labor-quotation-create').length) {
                let hidden = "";
                if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hidden = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" aria-expanded="false" data-bs-toggle="dropdown" data-zone="lease_expenses_data" ${hidden}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${LeaseOrderLoadDataHandle.transEle.attr('data-add')}</span></span>
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
                    LeaseOrderStoreDataHandle.storeDtbData(3);
                    LeaseOrderLoadDataHandle.loadAddRowExpense();
                });
                $('#btn-add-labor-quotation-create').on('click', function () {
                    LeaseOrderStoreDataHandle.storeDtbData(3);
                    LeaseOrderLoadDataHandle.loadAddRowLabor();
                });
            }
        }
    };

    static dtbPaymentHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tablePayment;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-load-payment-stage').length && !$('#btn-add-payment-stage').length) {
                let hiddenLoad = "hidden";
                let hiddenAdd = "hidden";
                let $termMD = LeaseOrderLoadDataHandle.paymentSelectEle;
                if ($termMD.val()) {
                    hiddenLoad = "";
                }
                if (!$termMD.val()) {
                    hiddenAdd = "";
                }
                if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hiddenLoad = "hidden";
                    hiddenAdd = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-load-payment-stage" data-zone="sale_order_payment_stage" ${hiddenLoad}>
                                    <span><span class="icon"><i class="fas fa-arrow-down"></i></span><span>${LeaseOrderLoadDataHandle.transEle.attr('data-detail')}</span></span>
                                </button>
                                <button type="button" class="btn btn-primary" id="btn-add-payment-stage" data-zone="sale_order_payment_stage" ${hiddenAdd}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${LeaseOrderLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-load-payment-stage').on('click', function () {
                    LeaseOrderStoreDataHandle.storeDtbData(4);
                    LeaseOrderLoadDataHandle.loadPaymentStage();
                });
                $('#btn-add-payment-stage').on('click', function () {
                    LeaseOrderStoreDataHandle.storeDtbData(4);
                    LeaseOrderLoadDataHandle.loadAddPaymentStage();
                });
            }
        }
    };

    static dtbInvoiceHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableInvoice;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-invoice').length) {
                let hidden = "";
                if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hidden = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-add-invoice" data-zone="sale_order_payment_stage" ${hidden}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${LeaseOrderLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-invoice').on('click', function () {
                    LeaseOrderStoreDataHandle.storeDtbData(5);
                    LeaseOrderLoadDataHandle.loadAddInvoice();
                });
            }
        }
    };

    static dtbSelectProductHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableSProduct;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbSelectOffsetHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableSOffset;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbSelectToolHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableSTool;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbSelectAssetHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableSAsset;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
    };

    static dtbDepreciationHDCustom() {
        let $table = LeaseOrderDataTableHandle.$tableDepreciationDetail;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
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

    // Calculate funcs
    static getDatasRelateTax(valBefore, tax) {
        let valTax = valBefore * tax / 100;
        let valAfter = valBefore + valTax;
        return {'valBefore': valBefore, 'valTax': valTax, 'valAfter': valAfter};
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

// Shipping
class LeaseOrderShippingHandle {
    static checkShippingValid(data_shipping, shippingAddress) {
        let final_shipping_price = 0;
        let margin_shipping_price = 0;
        let formula_condition = data_shipping?.['formula_condition'];
        let margin = parseFloat(data_shipping?.['margin']);
        data_shipping['is_pass'] = false;
        if (data_shipping?.['cost_method'] === 0) {  // fixed price for all
            data_shipping['is_pass'] = true;
            data_shipping['shipping_price'] = data_shipping?.['fixed_price'];
            data_shipping['shipping_margin'] = data_shipping?.['margin'];
            return data_shipping;
        }
        if (data_shipping?.['cost_method'] === 1) {  // check price by formula
            for (let condition of formula_condition) {
                let location_condition = condition?.['location_condition'];
                for (let location of location_condition) {
                    let address = shippingAddress.toLowerCase().replace(/\s+/g, "");
                    let shipment = location?.['title'].toLowerCase().replace(/\s+/g, "");
                    if (address.includes(shipment)) { // check location
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
                                        data_shipping['shipping_price'] = final_shipping_price;
                                        return data_shipping;
                                    } else if (unit?.['title'] === "weight") { // if condition is weight
                                        data_shipping['is_pass'] = true;
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

// Delivery
class LeaseOrderDeliveryHandle {
    static $btnDeliveryInfo = $('#delivery-info');
    static $modalDeliveryInfoEle = $('#deliveryInfoModalCenter');
    static $deliveryEstimatedDateEle = $('#estimated_delivery_date');
    static $deliveryRemarkEle = $('#remarks');
    static $btnDelivery = $('#btn-delivery');

    static checkOpenDeliveryInfo(data) {
        // check CR all cancel then allow delivery
        WindowControl.showLoading();
        $.fn.callAjax2({
                'url': LeaseOrderLoadDataHandle.urlEle.attr('data-lo-list-api'),
                'method': 'GET',
                'data': {'document_root_id': data?.['document_root_id']},
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let dataCR = $.fn.switcherResp(resp);
                if (dataCR) {
                    if (dataCR.hasOwnProperty('lease_order_list') && Array.isArray(dataCR.lease_order_list)) {
                        let check = false;
                        if (dataCR?.['lease_order_list'].length > 0) {
                            let countCancel = 0;
                            for (let saleOrder of dataCR?.['lease_order_list']) {
                                if (saleOrder?.['system_status'] === 4) {
                                    countCancel++;
                                }
                            }
                            if (countCancel === (dataCR?.['lease_order_list'].length - 1)) {
                                check = true;
                            }
                        }
                        if (check === true) {
                            // open modal
                            LeaseOrderDeliveryHandle.$btnDelivery.attr('data-id', data?.['id']);
                            let targetCodeEle = LeaseOrderDeliveryHandle.$modalDeliveryInfoEle[0].querySelector('.target-code');
                            if (targetCodeEle) {
                                targetCodeEle.innerHTML = data?.['code'] ? data?.['code'] : '';
                            }
                            LeaseOrderDeliveryHandle.$modalDeliveryInfoEle.modal('show');
                        }
                        if (check === false) {
                            Swal.fire({
                                title: "Oops...",
                                text: $.fn.transEle.attr('data-check-cr'),
                                icon: "error",
                                allowOutsideClick: false,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                }
                            })
                        }
                        WindowControl.hideLoading();
                    }
                }
            }
        )
        return true;
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
            datas = LeaseOrderSubmitHandle.setupDataExpense();
            $table = LeaseOrderDataTableHandle.$tableExpense;
        }
        if (type === 4) {
            datas = LeaseOrderSubmitHandle.setupDataPaymentStage();
            $table = LeaseOrderDataTableHandle.$tablePayment;
        }
        if (type === 5) {
            datas = LeaseOrderSubmitHandle.setupDataInvoice();
            $table = LeaseOrderDataTableHandle.$tableInvoice;
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
                LeaseOrderLoadDataHandle.loadReInitDataTableExpense();
            }
            if (type === 4) {
                LeaseOrderLoadDataHandle.loadReInitDataTablePayment();
            }
            if (type === 5) {
                LeaseOrderLoadDataHandle.loadReInitDataTableInvoice();
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
            let productEle = row.querySelector('.table-row-item');
            let promotionEle = row.querySelector('.table-row-promotion');
            let shippingEle = row.querySelector('.table-row-shipping');
            if (productEle) { // PRODUCT
                if ($(productEle).val()) {
                    let dataProduct = SelectDDControl.get_data_from_idx($(productEle), $(productEle).val());
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
                let offsetDataEle = row.querySelector('.table-row-offset-data');
                if (assetType && offsetDataEle) {
                    if ($(assetType).val() === '1' && $(offsetDataEle).val()) {
                        rowData['offset_data'] = JSON.parse($(offsetDataEle).val());
                    }
                }
                let toolDataEle = row.querySelector('.table-row-tool-data');
                if (assetType && toolDataEle) {
                    if ($(assetType).val() === '2' && $(toolDataEle).val()) {
                        rowData['tool_data'] = JSON.parse($(toolDataEle).val());
                    }
                }
                let assetDataEle = row.querySelector('.table-row-asset-data');
                if (assetType && assetDataEle) {
                    if ($(assetType).val() === '3' && $(assetDataEle).val()) {
                        rowData['asset_data'] = JSON.parse($(assetDataEle).val());
                    }
                }
                let offsetShowEle = row.querySelector('.table-row-offset-show');
                if (offsetShowEle) {
                    if ($(offsetShowEle).val()) {
                        rowData['offset_show'] = $(offsetShowEle).val();
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
                let eleTaxAmount = row.querySelector('.table-row-tax-amount');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = 0;
                    if ($(eleTaxAmount).valCurrency()) {
                        rowData['product_tax_amount'] = parseFloat($(eleTaxAmount).valCurrency());
                    }
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
            } else if (promotionEle) { // PROMOTION
                rowData['is_group'] = false;
                rowData['is_promotion'] = true;
                if ($(promotionEle).val()) {
                    let dataPromotion = SelectDDControl.get_data_from_idx($(promotionEle), $(promotionEle).val());
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
                let eleTaxAmount = row.querySelector('.table-row-tax-amount');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = 0;
                    if ($(eleTaxAmount).valCurrency()) {
                        rowData['product_tax_amount'] = parseFloat($(eleTaxAmount).valCurrency());
                    }
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
            } else if (shippingEle) { // SHIPPING
                rowData['is_group'] = false;
                rowData['is_shipping'] = true;
                if ($(shippingEle).val()) {
                    let dataShipping = SelectDDControl.get_data_from_idx($(shippingEle), $(shippingEle).val());
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
                let eleTaxAmount = row.querySelector('.table-row-tax-amount');
                if (eleTaxAmount) {
                    rowData['product_tax_amount'] = 0;
                    if ($(eleTaxAmount).valCurrency()) {
                        rowData['product_tax_amount'] = parseFloat($(eleTaxAmount).valCurrency());
                    }
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
                let assetType = row.querySelector('.table-row-asset-type');
                if (assetType) {
                    if ($(assetType).val()) {
                        rowData['asset_type'] = parseInt($(assetType).val());
                    }
                }
                let offsetEle = row.querySelector('.table-row-offset');
                if (offsetEle) {
                    let offsetData = SelectDDControl.get_data_from_idx($(offsetEle), $(offsetEle).val());
                    if (offsetData) {
                        rowData['offset_id'] = offsetData?.['id'] ? offsetData?.['id'] : null;
                        rowData['offset_data'] = offsetData;
                    }
                }
                let toolEle = row.querySelector('.table-row-tool');
                if (toolEle) {
                    let toolData = SelectDDControl.get_data_from_idx($(toolEle), $(toolEle).val());
                    if (toolData) {
                        rowData['tool_id'] = toolData?.['id'] ? toolData?.['id'] : null;
                        rowData['tool_data'] = toolData;
                    }
                }
                let assetEle = row.querySelector('.table-row-asset');
                if (assetEle) {
                    let assetData = SelectDDControl.get_data_from_idx($(assetEle), $(assetEle).val());
                    if (assetData) {
                        rowData['asset_id'] = assetData?.['id'] ? assetData?.['id'] : null;
                        rowData['asset_data'] = assetData;
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
                let depreciationDataEle = row.querySelector('.table-row-depreciation-data');
                if (depreciationDataEle) {
                    if ($(depreciationDataEle).val()) {
                        rowData['depreciation_data'] = JSON.parse($(depreciationDataEle).val());
                    }
                }
                let depreciationLeaseDataEle = row.querySelector('.table-row-depreciation-lease-data');
                if (depreciationLeaseDataEle) {
                    if ($(depreciationLeaseDataEle).val()) {
                        rowData['depreciation_lease_data'] = JSON.parse($(depreciationLeaseDataEle).val());
                    }
                }
                let convertEle = row.querySelector('.table-row-product-convert-into');
                if (convertEle) {
                    rowData['product_convert_into'] = null;
                    if ($(convertEle).val()) {
                        rowData['product_convert_into'] = parseInt($(convertEle).val());

                        if (LeaseOrderLoadDataHandle.$configEle.val()) {
                            let configData = JSON.parse(LeaseOrderLoadDataHandle.$configEle.val());
                            rowData['tool_type_data'] = configData?.['tool_type_data'];
                            rowData['tool_group_manage_data'] = configData?.['tool_group_manage_data'];
                            rowData['tool_group_using_data'] = configData?.['tool_group_using_data'];
                            rowData['asset_type_data'] = configData?.['asset_type_data'];
                            rowData['asset_group_manage_data'] = configData?.['asset_group_manage_data'];
                            rowData['asset_group_using_data'] = configData?.['asset_group_using_data'];
                            if ($(convertEle).val() === "1") {
                                let toolTypeDataEle = row.querySelector('.table-row-tool-type-data');
                                let toolGMDataEle = row.querySelector('.table-row-tool-group-manage-data');
                                let toolGSDataEle = row.querySelector('.table-row-tool-group-using-data');
                                if (toolTypeDataEle && toolGMDataEle && toolGSDataEle) {
                                    if ($(toolTypeDataEle).val()) {
                                        rowData['tool_type_data'] = JSON.parse($(toolTypeDataEle).val());
                                    }
                                    if ($(toolGMDataEle).val()) {
                                        rowData['tool_group_manage_data'] = JSON.parse($(toolGMDataEle).val());
                                    }
                                    if ($(toolGSDataEle).val()) {
                                        rowData['tool_group_using_data'] = JSON.parse($(toolGSDataEle).val());
                                    }
                                }
                            }
                            if ($(convertEle).val() === "2") {
                                let assetTypeDataEle = row.querySelector('.table-row-asset-type-data');
                                let assetGMDataEle = row.querySelector('.table-row-asset-group-manage-data');
                                let assetGSDataEle = row.querySelector('.table-row-asset-group-using-data');
                                if (assetTypeDataEle && assetGMDataEle && assetGSDataEle) {
                                    if ($(assetTypeDataEle).val()) {
                                        rowData['asset_type_data'] = JSON.parse($(assetTypeDataEle).val());
                                    }
                                    if ($(assetGMDataEle).val()) {
                                        rowData['asset_group_manage_data'] = JSON.parse($(assetGMDataEle).val());
                                    }
                                    if ($(assetGSDataEle).val()) {
                                        rowData['asset_group_using_data'] = JSON.parse($(assetGSDataEle).val());
                                    }
                                }
                            }
                        }

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
                    rowData['expense_uom_title'] = dataUOM?.['title'];
                    rowData['expense_uom_code'] = dataUOM?.['code'];
                    rowData['uom_data'] = dataUOM;
                }
            }
            let eleTax = row.querySelector('.table-row-tax');
            if ($(eleTax).val()) {
                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                if (dataTax) {
                    rowData['tax_id'] = dataTax?.['id'];
                    rowData['expense_tax_title'] = dataTax?.['title'];
                    rowData['expense_tax_value'] = dataTax?.['rate'];
                    rowData['tax_data'] = dataTax;
                } else {
                    rowData['expense_tax_value'] = 0;
                }
            }
            let eleTaxAmount = row.querySelector('.table-row-tax-amount');
            if (eleTaxAmount) {
                rowData['expense_tax_amount'] = 0;
                if ($(eleTaxAmount).valCurrency()) {
                    rowData['expense_tax_amount'] = parseFloat($(eleTaxAmount).valCurrency());
                }
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

    static setupDataIndicator(result) {
        let quotation_indicators_data = 'lease_indicators_data';
        let keyInd = "quotation_indicator_data";
        let datasDetail = LeaseOrderLoadDataHandle.loadGetDatasDetail();
        let indicators_data_setup = IndicatorControl.loadIndicator(result, datasDetail);
        if (indicators_data_setup.length > 0) {
            result[quotation_indicators_data] = indicators_data_setup;
            for (let indicator of indicators_data_setup) {
                if (indicator?.[keyInd]?.['code'] === "IN0001") {
                    result['indicator_revenue'] = indicator?.['indicator_value'] ? indicator?.['indicator_value'] : 0;
                }
                if (indicator?.[keyInd]?.['code'] === "IN0003") {
                    result['indicator_gross_profit'] = indicator?.['indicator_value'] ? indicator?.['indicator_value'] : 0;
                }
                if (indicator?.[keyInd]?.['code'] === "IN0006") {
                    result['indicator_net_income'] = indicator?.['indicator_value'] ? indicator?.['indicator_value'] : 0;
                }
            }
        }
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
                    rowData['term_id'] = $(eleInstallment).val();
                    rowData['term_data'] = SelectDDControl.get_data_from_idx($(eleInstallment), $(eleInstallment).val());
                }
            }
            let remarkEle = row.querySelector('.table-row-remark');
            if (remarkEle) {
                rowData['remark'] = $(remarkEle).val();
            }
            let dateEle = row.querySelector('.table-row-date');
            if (dateEle) {
                if ($(dateEle).val()) {
                    rowData['date'] = String(moment($(dateEle).val(), 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                }
            }
            let eleDateType = row.querySelector('.table-row-date-type');
            if (eleDateType) {
                rowData['date_type'] = $(eleDateType).val();
            }
            let ratioEle = row.querySelector('.table-row-ratio');
            if (ratioEle) {
                rowData['ratio'] = null;
                if ($(ratioEle).val()) {
                    rowData['ratio'] = parseFloat($(ratioEle).val());
                }
            }
            let invoiceEle = row.querySelector('.table-row-invoice');
            if (invoiceEle) {
                rowData['invoice'] = null;
                rowData['is_ar_invoice'] = false;
                if ($(invoiceEle).val()) {
                    rowData['invoice'] = parseInt($(invoiceEle).val());
                    rowData['is_ar_invoice'] = true;
                }
            }
            let invoiceDataEle = row.querySelector('.table-row-invoice-data');
            if (invoiceDataEle) {
                if ($(invoiceDataEle).val()) {
                    rowData['invoice_data'] = JSON.parse($(invoiceDataEle).val());
                }
            }
            let valBeforeEle = row.querySelector('.table-row-value-before-tax');
            if (valBeforeEle) {
                if ($(valBeforeEle).valCurrency()) {
                    rowData['value_before_tax'] = parseFloat($(valBeforeEle).valCurrency());
                }
            }
            let valReconcileEle = row.querySelector('.table-row-value-reconcile');
            if (valReconcileEle) {
                if ($(valReconcileEle).valCurrency()) {
                    rowData['value_reconcile'] = parseFloat($(valReconcileEle).valCurrency());
                }
            }
            let reconcileDataEle = row.querySelector('.table-row-reconcile-data');
            if (reconcileDataEle) {
                if ($(reconcileDataEle).val()) {
                    rowData['reconcile_data'] = JSON.parse($(reconcileDataEle).val());
                }
            }
            let taxEle = row.querySelector('.table-row-tax');
            if (taxEle) {
                if ($(taxEle).val()) {
                    rowData['tax_id'] = $(taxEle).val();
                    rowData['tax_data'] = SelectDDControl.get_data_from_idx($(taxEle), $(taxEle).val());
                }
            }
            let valTaxEle = row.querySelector('.table-row-value-tax');
            if (valTaxEle) {
                if ($(valTaxEle).valCurrency()) {
                    rowData['value_tax'] = parseFloat($(valTaxEle).valCurrency());
                }
            }
            let valTotalEle = row.querySelector('.table-row-value-total');
            if (valTotalEle) {
                if ($(valTotalEle).valCurrency()) {
                    rowData['value_total'] = parseFloat($(valTotalEle).valCurrency());
                }
            }
            let dueDateEle = row.querySelector('.table-row-due-date');
            if (dueDateEle) {
                if ($(dueDateEle).val()) {
                    rowData['due_date'] = String(moment($(dueDateEle).val(), 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss'));
                }
            }
            result.push(rowData);
        });
        return result;
    };

    static setupDataInvoice() {
        let result = [];
        LeaseOrderDataTableHandle.$tableInvoice.DataTable().rows().every(function () {
            let rowData = {};
            let row = this.node();
            let orderEle = row.querySelector('.table-row-order');
            if (orderEle) {
                rowData['order'] = parseInt(orderEle.innerHTML);
            }
            let remarkEle = row.querySelector('.table-row-remark');
            if (remarkEle) {
                rowData['remark'] = $(remarkEle).val();
            }
            let dateEle = row.querySelector('.table-row-date');
            if (dateEle) {
                if ($(dateEle).val()) {
                    rowData['date'] = moment($(dateEle).val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
                }
            }
            let termDataEle = row.querySelector('.table-row-term-data');
            if (termDataEle) {
                if ($(termDataEle).val()) {
                    rowData['term_data'] = JSON.parse($(termDataEle).val());
                }
            }
            let ratioEle = row.querySelector('.table-row-ratio');
            if (ratioEle) {
                rowData['ratio'] = null;
                if ($(ratioEle).val()) {
                    rowData['ratio'] = parseFloat($(ratioEle).val());
                }
            }
            let taxEle = row.querySelector('.table-row-tax');
            if (taxEle) {
                if ($(taxEle).val()) {
                    rowData['tax_id'] = $(taxEle).val();
                    rowData['tax_data'] = SelectDDControl.get_data_from_idx($(taxEle), $(taxEle).val());
                }
            }
            let totalEle = row.querySelector('.table-row-total');
            if (totalEle) {
                rowData['total'] = parseFloat($(totalEle).valCurrency());
            }
            let balanceEle = row.querySelector('.table-row-balance');
            if (balanceEle) {
                rowData['balance'] = parseFloat($(balanceEle).valCurrency());
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
        _form.dataForm['payment_term_data'] = {};
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
        if (type === 0) {
            if (quotation_products_data_setup.length <= 0) {
                $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-required-product')}, 'failure');
                return false;
            }
        }
        // COST
        _form.dataForm[quotation_costs_data] = LeaseOrderSubmitHandle.setupDataCost();
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
        // EXPENSE
        _form.dataForm[quotation_expenses_data] = LeaseOrderSubmitHandle.setupDataExpense();
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
        // payment stage
        _form.dataForm['lease_payment_stage'] = LeaseOrderSubmitHandle.setupDataPaymentStage();
        _form.dataForm['lease_invoice'] = LeaseOrderSubmitHandle.setupDataInvoice();
        // attachment
        if (_form.dataForm.hasOwnProperty('attachment')) {
          _form.dataForm['attachment'] = $x.cls.file.get_val(_form.dataForm?.['attachment'], []);
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
                $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-paid-in-full')}, 'failure');
                return false;
            }
        }
    }
    return true;
}