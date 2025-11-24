// Load data
class QuotationLoadDataHandle {
    static $form = $('#frm_quotation_create');
    static opportunitySelectEle = $('#opportunity_id');
    static customerSelectEle = $('#customer_id');
    static contactSelectEle = $('#contact_id');
    static paymentSelectEle = $('#payment_term_id');
    static salePersonSelectEle = $('#employee_inherit_id');
    static quotationSelectEle = $('#quotation_id');
    static $btnSaveSelectProduct = $('#btn-save-select-product');
    static $eleStoreDetail = $('#quotation-detail-data');
    static transEle = $('#app-trans-factory');
    static urlEle = $('#app-url-factory');
    static $priceModal = $('#selectPriceModal');
    static $btnSavePrice = $('#btn-save-select-price');
    static $costModal = $('#selectCostModal');
    static $btnSaveCost = $('#btn-save-select-cost');
    static $btnSaveTerm = $('#btn-save-select-term');
    static $btnSaveInvoice = $('#btn-save-select-invoice');
    static $btnSaveReconcile = $('#btn-save-select-reconcile');
    static $modalShipping = $('#shippingFeeModalCenter');

    static dataSuppliedBy = [{'id': 0, 'title': QuotationLoadDataHandle.transEle.attr('data-supplied-purchase')}, {'id': 1, 'title': QuotationLoadDataHandle.transEle.attr('data-supplied-make')}];

    static $productsCheckedEle = $('#products-checked');

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

    static loadCssS2($ele, maxWidth) {
        if ($ele.is("select") && $ele.hasClass("select2-hidden-accessible")) {
            let $render = $ele.next('.select2-container').find('.select2-selection__rendered');
            if ($render && $render.length > 0) {
                $render.css('max-width', maxWidth);
            }
        }
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
            FormElementControl.loadInitS2(QuotationLoadDataHandle.salePersonSelectEle, [JSON.parse(dataStr)]);
        }
        return true;
    };

    static loadDataByOpportunity(oppData) {
        let tableProduct = $('#datable-quotation-create-product');
        if (!$(QuotationLoadDataHandle.opportunitySelectEle).val()) {
            QuotationLoadDataHandle.customerSelectEle[0].removeAttribute('disabled');
        }
        QuotationLoadDataHandle.salePersonSelectEle[0].removeAttribute('disabled');
        if ($(QuotationLoadDataHandle.opportunitySelectEle).val()) {
            QuotationLoadDataHandle.salePersonSelectEle[0].setAttribute('disabled', 'true');
            QuotationLoadDataHandle.customerSelectEle[0].setAttribute('disabled', 'true');
            // load sale person
            QuotationLoadDataHandle.salePersonSelectEle.empty();
            QuotationLoadDataHandle.salePersonSelectEle.initSelect2({
                data: oppData?.['sale_person'],
                'allowClear': true,
            });
            // load customer
            if (oppData?.['customer']?.['id']) {
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': QuotationLoadDataHandle.customerSelectEle.attr('data-url'),
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
                                    FormElementControl.loadInitS2(QuotationLoadDataHandle.customerSelectEle, data?.['account_sale_list']);
                                    QuotationLoadDataHandle.customerSelectEle.trigger('change');
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
        FormElementControl.loadInitS2(QuotationLoadDataHandle.customerSelectEle, [dataCustomer], data_filter);
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            if (!dataCustomer?.['is_copy']) {
                QuotationLoadDataHandle.loadDataProductAll();
            }
        }
    };

    static loadDataByCustomer() {
        let tableProduct = $('#datable-quotation-create-product');
        if (QuotationLoadDataHandle.customerSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, QuotationLoadDataHandle.customerSelectEle.val());
            if (dataSelected) {
                // load contact
                if (dataSelected?.['contact_list']) {
                    FormElementControl.loadInitS2(QuotationLoadDataHandle.contactSelectEle, dataSelected?.['contact_list'], {'account_name_id': QuotationLoadDataHandle.customerSelectEle.val()});
                    for (let contact of dataSelected?.['contact_list']) {
                        if (contact?.['is_owner'] === true) {
                            QuotationLoadDataHandle.contactSelectEle.val(contact?.['id']).trigger('change');
                            break;
                        }
                    }
                }
                // load payment term
                if (dataSelected?.['payment_term_customer_mapped']) {
                    FormElementControl.loadInitS2(QuotationLoadDataHandle.paymentSelectEle, [dataSelected?.['payment_term_customer_mapped']], {}, null, true);
                    QuotationLoadDataHandle.loadChangePaymentTerm();
                }
                // load Shipping & Billing by Customer
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

    static loadStoreSProduct() {
        let dataSelected = {};
        QuotationDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = QuotationDataTableHandle.$tableProduct.DataTable().row(row).index();
            let $row = QuotationDataTableHandle.$tableProduct.DataTable().row(rowIndex);
            let dataRow = $row.data();
            let ID = dataRow?.['product_data']?.['id'];
            if (dataRow?.['product_data']?.['specific_data']?.['id']) {
                ID = dataRow?.['product_data']?.['id'] + "-" + dataRow?.['product_data']?.['specific_data']?.['id'];
            }
            if (ID) {
                dataSelected[ID] = {
                    "type": "selected",
                    "data": dataRow?.['product_data'],
                };
            }
        });
        QuotationLoadDataHandle.$productsCheckedEle.val(JSON.stringify(dataSelected));
        return true;
    };

    static loadStoreCheckProduct(ele) {
        let row = ele.closest('tr');
        let rowIndex = QuotationDataTableHandle.$tableSProduct.DataTable().row(row).index();
        let $row = QuotationDataTableHandle.$tableSProduct.DataTable().row(rowIndex);
        let dataRow = $row.data();

        if (dataRow) {
            if (QuotationLoadDataHandle.$productsCheckedEle.val()) {
                let storeID = JSON.parse(QuotationLoadDataHandle.$productsCheckedEle.val());
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
                    QuotationLoadDataHandle.$productsCheckedEle.val(JSON.stringify(storeID));
                }
            } else {
                let dataStore = {};
                if (ele.checked === true) {
                    dataStore[dataRow?.['id']] = {
                        "type": "current",
                        "data": dataRow,
                    };
                }
                QuotationLoadDataHandle.$productsCheckedEle.val(JSON.stringify(dataStore));
            }
        }
        return true;
    };

    static loadStoreCheckSpecProduct(ele) {
        let table = ele.closest('table');
        let row = ele.closest('tr');
        let rowIndex = $(table).DataTable().row(row).index();
        let $row = $(table).DataTable().row(rowIndex);
        let dataRow = $row.data();

        if (dataRow) {
            let productID = $(ele).attr('data-product-id');
            let btnClEle = QuotationDataTableHandle.$tableSProduct[0].querySelector(`.btn-collapse-parent[data-product-id="${productID}"]`);
            if (btnClEle) {
                let rowParent = btnClEle.closest('tr');
                if (rowParent) {
                    let rowIndex = QuotationDataTableHandle.$tableSProduct.DataTable().row(rowParent).index();
                    let $row = QuotationDataTableHandle.$tableSProduct.DataTable().row(rowIndex);
                    let dataRowP = $row.data();
                    if (dataRowP) {
                        let combineID = productID + "-" + dataRow?.['id'];
                        dataRowP['specific_data'] = dataRow;
                        if (QuotationLoadDataHandle.$productsCheckedEle.val()) {
                            let storeID = JSON.parse(QuotationLoadDataHandle.$productsCheckedEle.val());
                            if (typeof storeID === 'object') {
                                if (ele.checked === true) {
                                    if (!storeID?.[combineID]) {
                                        storeID[combineID] = {
                                            "type": "current",
                                            "data": dataRowP,
                                        };
                                    }
                                }
                                if (ele.checked === false) {
                                    if (storeID?.[combineID]) {
                                        delete storeID?.[combineID];
                                    }
                                }
                                QuotationLoadDataHandle.$productsCheckedEle.val(JSON.stringify(storeID));
                            }
                        } else {
                            let dataStore = {};
                            if (ele.checked === true) {
                                dataStore[combineID] = {
                                    "type": "current",
                                    "data": dataRowP,
                                };
                            }
                            QuotationLoadDataHandle.$productsCheckedEle.val(JSON.stringify(dataStore));
                        }
                    }
                }
            }
        }
        return true;
    };

    static loadModalSProduct() {
        QuotationLoadDataHandle.loadStoreSProduct();
        QuotationDataTableHandle.$tableSProduct.DataTable().destroy();
        QuotationDataTableHandle.dataTableSelectProduct();
    };

    static loadModalSTerm(ele) {
        let row = ele.closest('tr');
        if (row) {
            let orderEle = row.querySelector('.table-row-order');
            if (orderEle) {
                QuotationLoadDataHandle.$btnSaveTerm.attr('data-id', orderEle.innerHTML);
            }
        }
        let term = [];
        if (QuotationLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
            if (dataSelected) {
                term = dataSelected?.['term'];
                let type = "percent";
                for (let termData of term) {
                    if (termData?.['unit_type'] === 1) {
                        type = "amount";
                    }
                    let isNum = parseFloat(termData?.['value']);
                    if (!isNum) {  // balance
                        termData['value'] = String(QuotationLoadDataHandle.loadParseBalanceOfTerm("invoice"));
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
        QuotationDataTableHandle.$tableSTerm.DataTable().clear().draw();
        QuotationDataTableHandle.$tableSTerm.DataTable().rows.add(term).draw();
        return true;
    };

    static loadModalSInvoice(ele) {
        let row = ele.closest('tr');
        if (row) {
            let orderEle = row.querySelector('.table-row-order');
            if (orderEle) {
                QuotationLoadDataHandle.$btnSaveInvoice.attr('data-id', orderEle.innerHTML);
            }
        }
        let datas = QuotationSubmitHandle.setupDataInvoice();
        QuotationDataTableHandle.$tableSInvoice.DataTable().clear().draw();
        QuotationDataTableHandle.$tableSInvoice.DataTable().rows.add(datas).draw();
        return true;
    };

    static loadModalSReconcile(ele) {
        let row = ele.closest('tr');
        if (row) {
            let orderEle = row.querySelector('.table-row-order');
            if (orderEle) {
                QuotationLoadDataHandle.$btnSaveReconcile.attr('data-id', orderEle.innerHTML);
            }
        }
        let fnData = [];
        let check = parseInt(QuotationLoadDataHandle.$btnSaveReconcile.attr('data-id'));
        let datas = QuotationSubmitHandle.setupDataPaymentStage();
        for (let data of datas) {
            if (data?.['order'] < check && data?.['invoice'] === null) {
                fnData.push(data);
            }
        }
        QuotationDataTableHandle.$tableSReconcile.DataTable().clear().draw();
        QuotationDataTableHandle.$tableSReconcile.DataTable().rows.add(fnData).draw();
        return true;
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

    static loadTableCopyQuotation() {
        QuotationDataTableHandle.$tableQuotationCopy.DataTable().destroy();
        QuotationDataTableHandle.dataTableCopyQuotation();
        return true;
    };

    static loadShippingBillingCustomer(data = {}) {
        let dataZone = "quotation_logistic_data";
        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
            dataZone = "sale_order_logistic_data";
        }
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
                                                            <button type="button" class="btn btn-primary choose-shipping" data-bs-dismiss="modal" id="${shipping.id}" data-address="${shipping.full_address}" data-zone="${dataZone}">${QuotationLoadDataHandle.transEle.attr('data-select-address')}</button>
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
                                                            <button type="button" class="btn btn-primary choose-billing" data-bs-dismiss="modal" id="${billing.id}" data-address="${billing.full_address}" data-zone="${dataZone}">${QuotationLoadDataHandle.transEle.attr('data-select-address')}</button>
                                                        </div>
                                                    </div>
                                                    <br>`)
                    }
                }
            }
        }
    };

    // TABLE PRODUCT
    static loadAddRowProductGr() {
        let tableProduct = $('#datable-quotation-create-product');
        let order = tableProduct[0].querySelectorAll('.table-row-group').length + 1;
        let dataAdd = {
            "is_group": true,
            "group_title": '',
            'group_order': order,
        }
        tableProduct.DataTable().row.add(dataAdd).draw().node();
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

    static loadClsGroupToProducts() {
        let order = "";
        let cls = "";
        QuotationDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = QuotationDataTableHandle.$tableProduct.DataTable().row(row).index();
            let $row = QuotationDataTableHandle.$tableProduct.DataTable().row(rowIndex);
            let dataRow = $row.data();

            if (dataRow?.['is_group'] === true && dataRow?.['group_order']) {
                order = dataRow?.['group_order'];
                cls = "group-" + String(order);
            }
            if (dataRow?.['is_group'] !== true) {
                if (cls && order) {
                    row.classList.add('collapse');
                    row.classList.add(cls);
                    row.classList.add('show');
                    row.setAttribute('data-group', order);
                }
            }
        });
        return true;
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
        if (QuotationLoadDataHandle.$productsCheckedEle.val()) {
            let storeID = JSON.parse(QuotationLoadDataHandle.$productsCheckedEle.val());
            for (let key in storeID) {
                let dataAdd = storeID[key]?.['data'];
                if (!dataAdd?.['specific_data']?.['id']) {
                    let check = dataAdd?.['id'];
                    if (!QuotationDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${check}"]`)) {
                        QuotationLoadDataHandle.loadAddRowProduct(dataAdd);
                    }
                }
                if (dataAdd?.['specific_data']?.['id']) {
                    let check = dataAdd?.['specific_data']?.['id'];
                    if (!QuotationDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-specific-id="${check}"]`)) {
                        QuotationLoadDataHandle.loadAddRowProduct(dataAdd);
                    }
                }
            }
        }
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
        let order = TotalOrder + 1;
        let dataUOM = {};
        let dataTax = {};
        if (data?.['sale_information']?.['default_uom']?.['id']) {
            dataUOM = data?.['sale_information']?.['default_uom'];
        }
        if (data?.['sale_information']?.['tax_code']?.['id']) {
            dataTax = data?.['sale_information']?.['tax_code'];
        }
        let dataAdd = {
            "order": order,
            "product_id": data?.['id'],
            "product_data": data,
            "uom_id": dataUOM?.['id'],
            "uom_data": dataUOM,
            "tax_id": dataTax?.['id'],
            "tax_data": dataTax,
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
        // load default price
        let itemEle = newRow.querySelector('.table-row-item');
        let priceEle = newRow.querySelector('.table-row-price');
        let lastPrice = QuotationLoadDataHandle.loadPriceProduct(itemEle);
        $(priceEle).attr('value', String(lastPrice));
        QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableProduct, newRow);
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
        $.fn.initMaskMoney2();

        return true;
    };

    static loadPriceProduct(productEle) {
        if (['post', 'put'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
            let dataZone = "quotation_products_data";
            if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                dataZone = "sale_order_products_data";
            }
            if ($(productEle).val()) {
                let productData = SelectDDControl.get_data_from_idx($(productEle), $(productEle).val());
                let row = productEle.closest('tr');
                if (productData && row) {
                    let data = productData;
                    let priceGrEle = row.querySelector('.input-group-price');
                    let priceEle = row.querySelector('.table-row-price');
                    let modalBody = QuotationLoadDataHandle.$priceModal[0].querySelector('.modal-body');
                    // load PRICE
                    if (priceGrEle && priceEle && modalBody) {
                        let account_price_id = null;
                        let dataAcc = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, QuotationLoadDataHandle.customerSelectEle.val());
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
                                    let price = priceData?.['value'] ? priceData?.['value'] : 0;
                                    let dataExchange = MaskMoney2.setupSubmitCurrencyExchange();
                                    if (dataExchange?.['is_currency_exchange'] === true) {
                                        price = price / parseFloat(dataExchange?.['currency_exchange_rate'] || 1);
                                    }
                                    let checked = '';
                                    if (typeChecked === 0) {  // Load default
                                        if (account_price_id) {
                                            if (priceData?.['id'] === account_price_id) { // Check CUSTOMER_PRICE then set customer_price
                                                lastPrice = parseFloat(price);
                                                checked = 'checked';
                                            }
                                        } else {
                                            if (priceData?.['is_default'] === true) { // Check GENERAL_PRICE_LIST OF PRODUCT then set general_price
                                                lastPrice = parseFloat(price);
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
                                                        <input type="radio" name="row-price-option" class="form-check-input table-row-price-option" id="price-${priceData?.['id'].replace(/-/g, "")}" data-value="${parseFloat(price)}" data-price="${JSON.stringify(priceData).replace(/"/g, "&quot;")}" data-zone="${dataZone}" ${checked}>
                                                        <label class="form-check-label" for="price-${priceData?.['id'].replace(/-/g, "")}">${priceData?.['title']}</label>
                                                    </div>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <div class="mr-2"><span class="mask-money" data-init-money="${parseFloat(price)}"></span></div>
                                                        <span class="badge badge-light">${priceData?.['uom']?.['title']}</span>
                                                    </div>
                                                </div>`;
                                }
                            }
                        }
                        $(modalBody).append(`${htmlPriceList}`);
                        QuotationLoadDataHandle.loadEventRadio(QuotationLoadDataHandle.$priceModal);
                        $.fn.initMaskMoney2();
                        return lastPrice;
                    }
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
                'url': QuotationLoadDataHandle.urlEle.attr('data-quotation-detail').format_url_with_uuid(select_id),
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
                discountRateCopy.value = "0";
                if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                    if (QuotationLoadDataHandle.quotationSelectEle.attr('data-detail')) {
                        let dataCopy = JSON.parse(QuotationLoadDataHandle.quotationSelectEle.attr('data-detail'));
                        if (dataCopy?.['id']) {
                            discountRateCopy.value = data?.['total_product_discount_rate'];
                        }
                    }
                }
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

    static loadImport() {
        let import_data_rows = $('#tab_line_detail').find('.import_data_rows');
        let dataIP = [];
        if (import_data_rows.text()) {
            dataIP = JSON.parse(import_data_rows.text());
        }
        if (dataIP.length > 0) {
            let listProdID = [];
            let JSonProd = {};
            let quotation_products_data = [];
            let result = {};
            for (let data of dataIP) {
                listProdID.push(data?.['product']?.['id']);
                JSonProd[data?.['product']?.['id']] = data;
            }
            if (listProdID.length > 0) {
                WindowControl.showLoading();
                $.fn.callAjax2({
                        'url': QuotationLoadDataHandle.urlEle.attr('data-md-product'),
                        'method': 'GET',
                        'data': {'id__in': listProdID.join(',')},
                        'isDropdown': true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('product_sale_list') && Array.isArray(data.product_sale_list)) {
                                let order = 1;
                                for (let dataProd of data?.['product_sale_list']) {
                                    let dataPush = {'product_data': dataProd, 'order': order};
                                    if (JSonProd.hasOwnProperty(dataProd?.['id'])) {
                                        dataPush['uom_data'] = JSonProd[dataProd?.['id']]?.['uom'];
                                        dataPush['tax_data'] = JSonProd[dataProd?.['id']]?.['tax'];
                                        dataPush['product_quantity'] = JSonProd[dataProd?.['id']]?.['quantity'];
                                        dataPush['product_unit_price'] = JSonProd[dataProd?.['id']]?.['unit_price'];
                                        dataPush['product_tax_value'] = JSonProd[dataProd?.['id']]?.['tax_value'];
                                        dataPush['product_discount_value'] = 0;
                                        dataPush['product_subtotal_price'] = JSonProd[dataProd?.['id']]?.['subtotal_price'];
                                    }
                                    order++;
                                    quotation_products_data.push(dataPush);
                                }

                                result['quotation_products_data'] = quotation_products_data;
                                QuotationLoadDataHandle.loadDataTablesAndDropDowns(result);
                                QuotationCalculateCaseHandle.calculateAllRowsTableProduct();

                                $('#modal-load-datatable-from-excel').modal('hide');
                                WindowControl.hideLoading();
                            }
                        }
                    }
                )
            }
        }
        return true;
    };

    static loadReInitDataTableProduct() {
        let tableData = [];
        let dataDetail = {};
        let dataPriceJSON = {};
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let detailDataEle = $('#quotation-detail-data');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
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
                let rowIndex = QuotationDataTableHandle.$tableProduct.DataTable().row(row).index();
                let $row = QuotationDataTableHandle.$tableProduct.DataTable().row(rowIndex);
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

            if (tableData.length === 0 && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let detailDataEle = $('#quotation-detail-data');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
                        if (dataDetail?.['quotation_products_data']) {
                            tableData = dataDetail?.['quotation_products_data'];
                        }
                        if (dataDetail?.['sale_order_products_data']) {
                            tableData = dataDetail?.['sale_order_products_data'];
                        }
                    }
                }
            }
        }
        QuotationDataTableHandle.dataTableProduct(tableData);
        // load dropdowns
        QuotationLoadDataHandle.loadDropDowns(QuotationDataTableHandle.$tableProduct);
        // load price
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            QuotationLoadDataHandle.loadReInitPrice(dataPriceJSON);
        }
        QuotationDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            let productEle = row.querySelector('.table-row-item');
            let shippingEle = row.querySelector('.table-row-shipping');
            let promotionEle = row.querySelector('.table-row-promotion');
            QuotationCheckConfigHandle.checkConfig(1, row);
            if (productEle) {
                QuotationLoadDataHandle.loadPriceProduct(productEle);
            }
            if (shippingEle || promotionEle) {
                QuotationLoadDataHandle.loadRowDisabled(row);
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

    static loadReInitDataTableCost() {
        let tableData = [];
        let dataDetail = {};
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let detailDataEle = $('#quotation-detail-data');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
                    if (dataDetail?.['quotation_costs_data']) {
                        tableData = dataDetail?.['quotation_costs_data'];
                    }
                    if (dataDetail?.['sale_order_costs_data']) {
                        tableData = dataDetail?.['sale_order_costs_data'];
                    }
                }
            }
        } else {
            QuotationDataTableHandle.$tableCost.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = QuotationDataTableHandle.$tableCost.DataTable().row(row).index();
                let $row = QuotationDataTableHandle.$tableCost.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let detailDataEle = $('#quotation-detail-data');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
                        if (dataDetail?.['quotation_costs_data']) {
                            tableData = dataDetail?.['quotation_costs_data'];
                        }
                        if (dataDetail?.['sale_order_costs_data']) {
                            tableData = dataDetail?.['sale_order_costs_data'];
                        }
                    }
                }
            }
        }
        QuotationDataTableHandle.dataTableCost(tableData);
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            QuotationLoadDataHandle.loadTableDisabled(QuotationDataTableHandle.$tableCost);
        }
        QuotationLoadDataHandle.loadDropDowns(QuotationDataTableHandle.$tableCost);
        $.fn.initMaskMoney2();
        // set again WF runtime
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitDataTableExpense() {
        let tableData = [];
        let dataDetail = {};
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let detailDataEle = $('#quotation-detail-data');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
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
                let rowIndex = QuotationDataTableHandle.$tableExpense.DataTable().row(row).index();
                let $row = QuotationDataTableHandle.$tableExpense.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let detailDataEle = $('#quotation-detail-data');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
                        if (dataDetail?.['quotation_expenses_data']) {
                            tableData = dataDetail?.['quotation_expenses_data'];
                        }
                        if (dataDetail?.['sale_order_expenses_data']) {
                            tableData = dataDetail?.['sale_order_expenses_data'];
                        }
                    }
                }
            }
        }
        QuotationDataTableHandle.dataTableExpense(tableData);
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
            let detailDataEle = $('#quotation-detail-data');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
                    tableData = dataDetail?.['sale_order_payment_stage'];
                }
            }
        } else {
            QuotationDataTableHandle.$tablePayment.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = QuotationDataTableHandle.$tablePayment.DataTable().row(row).index();
                let $row = QuotationDataTableHandle.$tablePayment.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let detailDataEle = $('#quotation-detail-data');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
                        tableData = dataDetail?.['sale_order_payment_stage'];
                    }
                }
            }
        }
        QuotationDataTableHandle.dataTablePaymentStage(tableData);
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            QuotationLoadDataHandle.loadTableDisabled(QuotationDataTableHandle.$tablePayment);
        }
        QuotationLoadDataHandle.loadDropDowns(QuotationDataTableHandle.$tablePayment);
        $.fn.initMaskMoney2();
        // set again WF runtime
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitDataTableInvoice() {
        let tableData = [];
        let dataDetail = {};
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            let detailDataEle = $('#quotation-detail-data');
            if (detailDataEle && detailDataEle.length > 0) {
                if (detailDataEle.val()) {
                    dataDetail = JSON.parse(detailDataEle.val());
                    tableData = dataDetail?.['sale_order_invoice'];
                }
            }
        } else {
            QuotationDataTableHandle.$tableInvoice.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = QuotationDataTableHandle.$tableInvoice.DataTable().row(row).index();
                let $row = QuotationDataTableHandle.$tableInvoice.DataTable().row(rowIndex);
                let dataRow = $row.data();

                tableData.push(dataRow);
            });

            if (tableData.length === 0 && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'put') {
                let detailDataEle = $('#quotation-detail-data');
                if (detailDataEle && detailDataEle.length > 0) {
                    if (detailDataEle.val()) {
                        dataDetail = JSON.parse(detailDataEle.val());
                        tableData = dataDetail?.['sale_order_invoice'];
                    }
                }
            }
        }
        QuotationDataTableHandle.dataTableInvoice(tableData);
        if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            QuotationLoadDataHandle.loadTableDisabled(QuotationDataTableHandle.$tableInvoice);
        }
        $.fn.initMaskMoney2();
        // set again WF runtime
        QuotationLoadDataHandle.loadSetWFRuntimeZone();
        return true;
    };

    static loadReInitPrice(data) {
        QuotationDataTableHandle.$tableProduct.DataTable().rows().every(function () {
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
        if (QuotationLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
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
        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order') && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
            QuotationDataTableHandle.$tableInvoice.DataTable().clear().draw();
            QuotationDataTableHandle.$tablePayment.DataTable().clear().draw();
            $('#btn-load-payment-stage')[0].setAttribute('hidden', 'true');
            $('#btn-add-payment-stage')[0].setAttribute('hidden', 'true');
            if (!QuotationLoadDataHandle.paymentSelectEle.val()) {
                $('#btn-add-payment-stage')[0].removeAttribute('hidden');
            }
            if (QuotationLoadDataHandle.paymentSelectEle.val()) {
                $('#btn-load-payment-stage')[0].removeAttribute('hidden');
            }
        }
        return true;
    };

    // TABLE PAYMENT STAGE
    static loadAddPaymentStage() {
        let order = QuotationDataTableHandle.$tablePayment[0].querySelectorAll('.table-row-order').length + 1;
        let dataAdd = {
            'order': order,
            'ratio': 0,
            'value_before_tax': 0,
            'is_ar_invoice': false,
        };
        QuotationDataTableHandle.$tablePayment.DataTable().row.add(dataAdd).draw().node();
        // mask money
        $.fn.initMaskMoney2();
        return true;
    };

    static loadPaymentStage() {
        let datas = [];
        if (QuotationLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
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
        QuotationDataTableHandle.$tablePayment.DataTable().clear().draw();
        QuotationDataTableHandle.$tablePayment.DataTable().rows.add(datas).draw();

        QuotationDataTableHandle.$tablePayment.DataTable().rows().every(function () {
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
                let rowIndex = QuotationDataTableHandle.$tablePayment.DataTable().row(row).index();
                let $row = QuotationDataTableHandle.$tablePayment.DataTable().row(rowIndex);
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
                        QuotationLoadDataHandle.loadPaymentValues(ratioEle);
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
                if (["post", "put"].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
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
                    QuotationDataTableHandle.$tablePayment.DataTable().rows().every(function () {
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
                    QuotationDataTableHandle.$tablePayment.DataTable().rows().every(function () {
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
                            $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-invalid')}, 'failure');
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
                    let datasRelateTax1 = QuotationCalculateCaseHandle.getDatasRelateTax(valBefore, taxData?.['rate']);
                    $(valTaxEle).attr('value', datasRelateTax1?.['valTax']);
                    $(valTotalEle).attr('value', datasRelateTax1?.['valAfter']);

                    if ($(valReconcileEle).valCurrency() > 0) {
                        let datasRelateTax2 = QuotationCalculateCaseHandle.getDatasRelateTax($(valReconcileEle).valCurrency(), taxData?.['rate']);
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
        QuotationDataTableHandle.$tableInvoice.DataTable().rows().every(function () {
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
                            $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-paid-in-full')}, 'failure');
                            return false;
                        }
                    }
                }
            }
        }

        let orderEleList = QuotationDataTableHandle.$tableInvoice[0].querySelectorAll('.table-row-order');

        QuotationDataTableHandle.$tableInvoice.DataTable().row.add({"order": (orderEleList.length + 1)}).draw();
        return true;
    };

    static loadSaveSTerm() {
        let target = QuotationDataTableHandle.$tableInvoice[0].querySelector(`[data-id="${QuotationLoadDataHandle.$btnSaveTerm.attr('data-id')}"]`);
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
                    for (let checkedEle of QuotationDataTableHandle.$tableSTerm[0].querySelectorAll('.table-row-checkbox:checked')) {
                        let row = checkedEle.closest('tr');
                        if (row) {
                            let rowIndex = QuotationDataTableHandle.$tableSTerm.DataTable().row(row).index();
                            let $row = QuotationDataTableHandle.$tableSTerm.DataTable().row(rowIndex);
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
        let target = QuotationDataTableHandle.$tablePayment[0].querySelector(`[data-id="${QuotationLoadDataHandle.$btnSaveInvoice.attr('data-id')}"]`);
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

                let checkedEle = QuotationDataTableHandle.$tableSInvoice[0].querySelector('.table-row-checkbox:checked');
                if (checkedEle && dateEle && invoiceEle && invoiceDataEle && valBeforeEle && taxEle && valTaxEle && valTotalEle) {
                    let row = checkedEle.closest('tr');
                    if (row) {
                        let rowIndex = QuotationDataTableHandle.$tableSInvoice.DataTable().row(row).index();
                        let $row = QuotationDataTableHandle.$tableSInvoice.DataTable().row(rowIndex);
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
        let target = QuotationDataTableHandle.$tablePayment[0].querySelector(`[data-id="${QuotationLoadDataHandle.$btnSaveReconcile.attr('data-id')}"]`);
        if (target) {
            let targetRow = target.closest('tr');
            if (targetRow) {
                let valBeforeEle = targetRow.querySelector('.table-row-value-before-tax');
                let valReconcileEle = targetRow.querySelector('.table-row-value-reconcile');
                let reconcileDataEle = targetRow.querySelector('.table-row-reconcile-data');
                let reconcile = 0;
                let reconcileData = [];
                for (let checkedEle of QuotationDataTableHandle.$tableSReconcile[0].querySelectorAll('.table-row-checkbox:checked')) {
                    let row = checkedEle.closest('tr');
                    let rowIndex = QuotationDataTableHandle.$tableSReconcile.DataTable().row(row).index();
                    let $row = QuotationDataTableHandle.$tableSReconcile.DataTable().row(rowIndex);
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
        QuotationDataTableHandle.$tableInvoice.DataTable().rows().every(function () {
            let rowI = this.node();
            let rowIndex = QuotationDataTableHandle.$tableInvoice.DataTable().row(rowI).index();
            let $row = QuotationDataTableHandle.$tableInvoice.DataTable().row(rowIndex);
            let dataRow = $row.data();

            let totalEle = rowI.querySelector('.table-row-total');
            let balanceEle = rowI.querySelector('.table-row-balance');
            if (totalEle && balanceEle) {
                $(balanceEle).attr('value', String($(totalEle).valCurrency()));
                $.fn.initMaskMoney2();
                let balance = 0;

                QuotationDataTableHandle.$tablePayment.DataTable().rows().every(function () {
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
        QuotationStoreDataHandle.storeDtbData(5);
    };

    static loadCheckSameMixTax() {
        let listTaxID = [];
        let listTax = [];
        QuotationDataTableHandle.$tableProduct.DataTable().rows().every(function () {
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
        let $table = $('#datable-quotation-create-cost');
        let $tableProduct = $('#datable-quotation-create-product');
        // Store old cost
        let storeCost = {};
        $table.DataTable().rows().every(function () {
            let row = this.node();
            let rowIndex = QuotationDataTableHandle.$tableCost.DataTable().row(row).index();
            let $row = QuotationDataTableHandle.$tableCost.DataTable().row(rowIndex);
            let dataRow = $row.data();
            let ID = dataRow?.['product_data']?.['id'];
            if (dataRow?.['product_data']?.['specific_data']?.['id']) {
                ID = dataRow?.['product_data']?.['id'] + "-" + dataRow?.['product_data']?.['specific_data']?.['id'];
            }
            if (ID) {
                if (!storeCost.hasOwnProperty(ID)) {
                    storeCost[ID] = dataRow;
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
            let datasAdd = [];
            if (isHidden === true) {  // product is zone hidden => use data product from data detail
                let storeDetail = JSON.parse(QuotationLoadDataHandle.$eleStoreDetail.val());
                for (let data of storeDetail?.[dataZone]) {
                    let valueQuantity = 0;
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
                            "product_id": data?.['product_data']?.['id'],
                            "product_data": data?.['product_data'],
                            "product_description": data?.['product_description'],
                            "uom_id": data?.['uom_data']?.['id'],
                            "uom_data": data?.['uom_data'],
                            "tax_id": data?.['tax_data']?.['id'],
                            "tax_data": data?.['tax_data'],
                            "product_quantity": data?.['product_quantity'],
                            "product_tax_amount": data?.['product_tax_amount'],
                            "product_subtotal_price": data?.['product_subtotal_price'],
                        }
                        let ID = dataAdd?.['product_data']?.['id'];
                        if (dataAdd?.['product_data']?.['specific_data']?.['id']) {
                            ID = dataAdd?.['product_data']?.['id'] + "-" + dataAdd?.['product_data']?.['specific_data']?.['id'];
                        }
                        if (storeCost.hasOwnProperty(ID)) {
                            dataAdd = storeCost[ID];
                            dataAdd['product_description'] = data?.['product_description'];
                            dataAdd['product_quantity'] = data?.['product_quantity'];
                            dataAdd['uom_id'] = data?.['uom_data']?.['id'];
                            dataAdd['uom_data'] = data?.['uom_data'];
                            dataAdd['tax_id'] = data?.['tax_data']?.['id'];
                            dataAdd['tax_data'] = data?.['tax_data'];
                        }
                        datasAdd.push(dataAdd);
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
                        datasAdd.push(dataAdd);
                    }
                }
            } else {  // product is not zone hidden => use realtime data product from $tableProduct
                $tableProduct.DataTable().rows().every(function () {
                    let row = this.node();
                    let rowIndex = $tableProduct.DataTable().row(row).index();
                    let $row = $tableProduct.DataTable().row(rowIndex);
                    let dataRow = $row.data();

                    let des = '';
                    let valueSubtotal = 0;
                    let valueQuantity = 0;
                    let shipping = row.querySelector('.table-row-shipping');
                    let desEle = row.querySelector('.table-row-description');
                    if (desEle) {
                        if ($(desEle).val()) {
                            des = $(desEle).val();
                        }
                    }
                    if (dataRow?.['product_data']?.['id']) { // PRODUCT
                        valueOrder++
                        let dataAdd = {
                            "order": valueOrder,
                            "product_id": dataRow?.['product_data']?.['id'],
                            "product_data": dataRow?.['product_data'],
                            "product_description": des,
                            "uom_id": dataRow?.['uom_data']?.['id'],
                            "uom_data": dataRow?.['uom_data'],
                            "tax_id": dataRow?.['tax_data']?.['id'],
                            "tax_data": dataRow?.['tax_data'],
                            "product_quantity": dataRow?.['product_quantity'],
                        }
                        let ID = dataAdd?.['product_data']?.['id'];
                        if (dataAdd?.['product_data']?.['specific_data']?.['id']) {
                            ID = dataAdd?.['product_data']?.['id'] + "-" + dataAdd?.['product_data']?.['specific_data']?.['id'];
                        }
                        if (storeCost.hasOwnProperty(ID)) {
                            dataAdd = storeCost[ID];
                            dataAdd['product_description'] = des;
                            dataAdd['product_quantity'] = dataRow?.['product_quantity'];
                            dataAdd['uom_id'] = dataRow?.['uom_data']?.['id'];
                            dataAdd['uom_data'] = dataRow?.['uom_data'];
                            dataAdd['tax_id'] = dataRow?.['tax_data']?.['id'];
                            dataAdd['tax_data'] = dataRow?.['tax_data'];
                        }
                        datasAdd.push(dataAdd);
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
                            datasAdd.push(dataAdd);
                        }
                    }
                })
            }
            QuotationDataTableHandle.dataTableCost(datasAdd);
            QuotationLoadDataHandle.loadSetWFRuntimeZone();
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
                                                        <div><span class="mask-money" data-init-money="${parseFloat(costData?.['unit_cost'])}"></span></div>
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
                                                    <div><span class="mask-money" data-init-money="${parseFloat(costBomStandardData?.['costBom'])}"></span></div>
                                                </div>`;
                                htmlCostList += `<div class="d-flex justify-content-between">
                                                    <div class="form-check form-check-lg">
                                                        <input type="radio" name="row-price-option" class="form-check-input table-row-price-option" id="cost-standard-${dataDetail?.['id'].replace(/-/g, "")}" data-value="${parseFloat(costBomStandardData?.['costStandard'])}" data-wh="${JSON.stringify({'id': 'standard'}).replace(/"/g, "&quot;")}" data-zone="${dataZone}" ${checkedStandard}>
                                                        <label class="form-check-label" for="cost-standard-${dataDetail?.['id'].replace(/-/g, "")}">${QuotationLoadDataHandle.transEle.attr('data-cost-standard')}</label>
                                                    </div>
                                                    <div><span class="mask-money" data-init-money="${parseFloat(costBomStandardData?.['costStandard'])}"></span></div>
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
        // Set form novalidate
        QuotationLoadDataHandle.$form[0].setAttribute('novalidate', 'novalidate');
        QuotationLoadDataHandle.loadCheckDataCopy();
        // Reinit dtb payment
        QuotationLoadDataHandle.loadReInitDataTablePayment();
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
                'url': QuotationLoadDataHandle.urlEle.attr('data-md-product'),
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
        if (data?.['title']) {
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
            FormElementControl.loadInitS2(QuotationLoadDataHandle.salePersonSelectEle, [data?.['sale_person']]);
        }
        if ($(form).attr('data-method').toLowerCase() !== 'get') {
            QuotationLoadDataHandle.salePersonSelectEle[0].removeAttribute('readonly');
            QuotationLoadDataHandle.customerSelectEle[0].removeAttribute('disabled');
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
                QuotationLoadDataHandle.customerSelectEle[0].setAttribute('disabled', 'true');
            }
        }
        if (data?.['customer_data']) {
            if (is_copy === true) {
                data['customer_data']['is_copy'] = true;
            }
            QuotationLoadDataHandle.loadBoxQuotationCustomer(data?.['customer_data']);
            // load shipping/ billing
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': QuotationLoadDataHandle.customerSelectEle.attr('data-url'),
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
                                QuotationLoadDataHandle.loadShippingBillingCustomer(data?.['account_sale_list'][0]);
                            }
                            WindowControl.hideLoading();
                        }
                    }
                }
            )
        }
        if (data?.['contact_data']) {
            FormElementControl.loadInitS2(QuotationLoadDataHandle.contactSelectEle, [data?.['contact_data']], {'account_name_id': QuotationLoadDataHandle.customerSelectEle.val()});
        }
        if (data?.['payment_term_data']) {
            // load realtime payment data
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': QuotationLoadDataHandle.paymentSelectEle.attr('data-url'),
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
                                if (QuotationLoadDataHandle.paymentSelectEle.val()) {
                                    if (QuotationLoadDataHandle.paymentSelectEle.val() === data?.['payment_terms_list'][0]?.['id']) {
                                        FormElementControl.loadInitS2(QuotationLoadDataHandle.paymentSelectEle, [data?.['payment_terms_list'][0]], {}, null, true);
                                        QuotationLoadDataHandle.loadReInitDataTablePayment();
                                        QuotationLoadDataHandle.loadReInitDataTableInvoice();
                                    }
                                    if (QuotationLoadDataHandle.paymentSelectEle.val() !== data?.['payment_terms_list'][0]?.['id']) {
                                        FormElementControl.loadInitS2(QuotationLoadDataHandle.paymentSelectEle, [data?.['payment_terms_list'][0]], {}, null, true);
                                        QuotationLoadDataHandle.loadChangePaymentTerm();
                                    }
                                }
                                if (!QuotationLoadDataHandle.paymentSelectEle.val()) {
                                    FormElementControl.loadInitS2(QuotationLoadDataHandle.paymentSelectEle, [data?.['payment_terms_list'][0]], {}, null, true);
                                    QuotationLoadDataHandle.loadReInitDataTablePayment();
                                    QuotationLoadDataHandle.loadReInitDataTableInvoice();
                                }
                            }
                            if (data?.['payment_terms_list'].length === 0) {
                                FormElementControl.loadInitS2(QuotationLoadDataHandle.paymentSelectEle, [], {}, null, true);
                                QuotationLoadDataHandle.loadReInitDataTablePayment();
                                QuotationLoadDataHandle.loadReInitDataTableInvoice();
                            }
                            WindowControl.hideLoading();
                        }
                    }
                }
            )
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
        if (data?.['valid_until']) {
            $('#quotation-create-valid-until').val(moment(data?.['valid_until']).format('DD/MM/YYYY'));
        }
        if (data?.['is_customer_confirm'] && is_copy === false) {
            $('#is_customer_confirm')[0].checked = data?.['is_customer_confirm'];
        }
        if (is_copy === false) {
            // check remove hidden btnDelivery (SO)
            if (data?.['delivery_call'] === false && data?.['system_status'] === 3 && $(form).attr('data-method').toLowerCase() === 'get' && form.classList.contains('sale-order')) {
                if (QuotationLoadDataHandle.opportunitySelectEle.val()) {
                    if (data?.['opportunity']?.['is_deal_close'] === false) {
                        QuotationDeliveryHandle.$btnDeliveryInfo[0].removeAttribute('hidden');
                    }
                } else {
                    QuotationDeliveryHandle.$btnDeliveryInfo[0].removeAttribute('hidden');
                }
            }
            // check remove hidden btnCopy
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
        // init currency exchange
        MaskMoney2.initCurrencyExchange(data);
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
        let form = QuotationLoadDataHandle.$form[0];
        let tableProduct = QuotationDataTableHandle.$tableProduct;
        let tableCost = QuotationDataTableHandle.$tableCost;
        let tableExpense = QuotationDataTableHandle.$tableExpense;
        let tableIndicator = $('#datable-quotation-create-indicator');
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
        // load table cost
        if (costs_data) {
            tableCost.DataTable().rows.add(costs_data).draw();
        }
        // load table expense
        if (expenses_data) {
            tableExpense.DataTable().rows.add(expenses_data).draw();
        }
        // payment stage (sale order)
        if (form.classList.contains('sale-order')) {
            if (data?.['sale_order_invoice']) {
                QuotationDataTableHandle.$tableInvoice.DataTable().clear().draw();
                QuotationDataTableHandle.$tableInvoice.DataTable().rows.add(data?.['sale_order_invoice']).draw();
            }
            if (data?.['sale_order_payment_stage']) {
                QuotationDataTableHandle.$tablePayment.DataTable().clear().draw();
                QuotationDataTableHandle.$tablePayment.DataTable().rows.add(data?.['sale_order_payment_stage']).draw();
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
                QuotationLoadDataHandle.loadTableDisabled(QuotationDataTableHandle.$tablePayment);
                QuotationLoadDataHandle.loadTableDisabled(QuotationDataTableHandle.$tableInvoice);
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
        if (table[0]) {
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
        }
        return true;
    };

    static loadTableDisabled(table) {
        if (table.length > 0 && ['get'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
            for (let ele of table[0].querySelectorAll('.table-row-item')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.table-row-description')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.table-row-labor-item')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.table-row-expense-title')) {
                ele.setAttribute('readonly', 'true');
                ele.classList.add('text-black');
            }
            for (let ele of table[0].querySelectorAll('.table-row-uom')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.table-row-uom-time')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.table-row-quantity')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.table-row-quantity-time')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.table-row-price')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.table-row-discount')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.table-row-discount-amount')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.table-row-tax')) {
                ele.setAttribute('readonly', 'true');
            }
            for (let ele of table[0].querySelectorAll('.input-group-price')) {
                ele.setAttribute('disabled', 'true');
            }
            for (let ele of table[0].querySelectorAll('.btn-select-price')) {
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
            for (let ele of table[0].querySelectorAll('.btn-select-cost')) {
                ele.setAttribute('disabled', 'true');
            }
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

    //
    static loadPushDtbSpecProduct(trEle, productID) {
        let idTbl = UtilControl.generateRandomString(12);
        if (!trEle.next().hasClass('child-list')) {
            let dtlSub = `<table id="${idTbl}" class="table table-child nowrap w-100"><thead></thead><tbody></tbody></table>`
            trEle.after(
                `<tr class="child-list"><td colspan="9"><div class="child-workflow-group hidden-simple">${dtlSub}</div></td></tr>`
            );
        }
        if (trEle.next().hasClass('child-list')) {
            let $tableChildEle = trEle.next().find('.table-child');
            if ($tableChildEle.length > 0) {
                idTbl = $tableChildEle[0].id;
            }
        }
        QuotationDataTableHandle.dataTableSpecProduct(idTbl, productID);
        return true;
    };

}

// DataTable
class QuotationDataTableHandle {
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
    static $tableSTerm = $('#table-select-term');
    static $tableSInvoice = $('#table-select-invoice');
    static $tableSReconcile = $('#table-select-reconcile');

    static dataTableProduct(data) {
        // init dataTable
        if ($.fn.dataTable.isDataTable(QuotationDataTableHandle.$tableProduct)) {
            QuotationDataTableHandle.$tableProduct.DataTable().destroy();
        }
        QuotationDataTableHandle.$tableProduct.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            // buttons: DTBControl.customExportExel(),
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
                                    </button>`;
                        }
                        return `<span class="table-row-order ml-2">${row?.['order']}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '12%',
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
                            return `<textarea class="form-control table-row-item-show zone-readonly" rows="3" data-zone="${dataZone}" readonly>${row?.['product_data']?.['title']}</textarea>
                                    <div class="row table-row-item-area hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select 
                                                class="form-select table-row-item zone-readonly"
                                                id="product-${row?.['order']}"
                                                data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-product')}"
                                                data-method="GET"
                                                data-keyResp="product_sale_list"
                                                data-zone="${dataZone}"
                                                readonly>
                                            </select>
                                        </div>
                                    </div>`;
                        } else if (itemType === 1) { // PROMOTION
                            return `<textarea class="form-control table-row-promotion-show zone-readonly" rows="3" data-zone="${dataZone}" readonly>${QuotationLoadDataHandle.transEle.attr('data-promotion')}</textarea>
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
                            return `<textarea class="form-control table-row-shipping-show zone-readonly" rows="3" data-zone="${dataZone}" readonly>${QuotationLoadDataHandle.transEle.attr('data-shipping')}</textarea>
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
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<textarea class="form-control table-row-serial" rows="3" data-zone="${dataZone}" readonly>${row?.['product_data']?.['specific_data']?.['serial_number'] ? row?.['product_data']?.['specific_data']?.['serial_number'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 3,
                    width: '10%',
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
                        if ([0, 2].includes(itemType)) {  // PRODUCT
                            des = row?.['product_data']?.['description'] ? row?.['product_data']?.['description'] : '';
                            if (row?.['product_description']) {
                                if (row?.['product_description'] !== "") {
                                    des = row?.['product_description'] ? row?.['product_description'] : '';
                                }
                            }
                            if (row?.['product_data']?.['specific_data']?.['new_description']) {
                                des = row?.['product_data']?.['specific_data']?.['new_description'] ? row?.['product_data']?.['specific_data']?.['new_description'] : '';
                            }
                        } else if (itemType === 1) {  // PROMOTION
                            des = row?.['promotion_data']?.['product_data']?.['description'] ? row?.['promotion_data']?.['product_data']?.['description'] : '';
                        }
                        return `<textarea class="form-control table-row-description" rows="3" data-zone="${dataZone}">${des}</textarea>`;
                    }
                },
                {
                    targets: 4,
                    width: '6%',
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
                                    data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-uom')}"
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
                    width: '6%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<input type="text" class="form-control table-row-quantity valid-num" value="${row?.['product_quantity']}" data-zone="${dataZone}" required>`;
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
                        return `<select 
                                    class="form-select table-row-uom-time"
                                    data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-uom')}"
                                    data-method="GET"
                                    data-keyResp="unit_of_measure"
                                    data-zone="${dataZone}"
                                 >
                                </select>`;
                    },
                },
                {
                    targets: 7,
                    width: '6%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<input type="text" class="form-control table-row-quantity-time valid-num" value="${row?.['product_quantity_time'] ? row?.['product_quantity_time'] : 0}" data-zone="${dataZone}" disabled>`;
                    }
                },
                {
                    targets: 8,
                    width: '14%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<div class="d-flex">
                                    <div class="input-group-price">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price valid-num" 
                                            value="${row?.['product_unit_price']}"
                                            data-return-type="number"
                                            data-zone="${dataZone}"
                                        >
                                    </div>
                                    <button
                                        type="button"
                                        class="btn btn-icon btn-outline-light btn-sm btn-select-price"
                                        data-bs-toggle="modal"
                                        data-bs-target="#selectPriceModal"
                                        data-zone="${dataZone}"
                                        disabled
                                    ><i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>`;
                    }
                },
                {
                    targets: 9,
                    width: '14%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_products_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        return `<div class="d-flex">
                                    <div class="input-group w-60">
                                        <div class="input-affix-wrapper">
                                            <input type="text" class="form-control table-row-discount valid-num zone-readonly" value="${row?.['product_discount_value']}" data-zone="${dataZone}">
                                            <div class="input-suffix"><small><i class="fas fa-percentage"></i></small></div>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        class="form-control mask-money table-row-discount-amount"
                                        value="${row?.['product_discount_amount'] ? row?.['product_discount_amount'] : 0}"
                                        data-return-type="number"
                                    >
                                    <div class="form-check form-check-lg d-flex align-items-center hidden">
                                        <input type="checkbox" name="row-checkbox-discount" class="form-check-input table-row-discount-check" checked hidden>
                                    </div>
                                    <input
                                        type="text"
                                        class="form-control mask-money table-row-discount-amount-total"
                                        value="${row?.['product_discount_amount_total'] ? row?.['product_discount_amount_total'] : 0}"
                                        data-return-type="number"
                                        hidden
                                    >
                                </div>`;
                    }
                },
                {
                    targets: 10,
                    width: '4%',
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
                                    data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-tax')}"
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
                                >`;
                    }
                },
                {
                    targets: 11,
                    width: '14%',
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
                    targets: 12,
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
            rowCallback: function (row, data, index) {
                let itemEle = row.querySelector('.table-row-item');
                let promotionEle = row.querySelector('.table-row-promotion');
                let shippingEle = row.querySelector('.table-row-shipping');
                let uomEle = row.querySelector('.table-row-uom');
                let quantityEle = row.querySelector('.table-row-quantity');
                let uomTimeEle = row.querySelector('.table-row-uom-time');
                let quantityTimeEle = row.querySelector('.table-row-quantity-time');
                let taxEle = row.querySelector('.table-row-tax');
                let btnSPriceEle = row.querySelector('.btn-select-price');
                if (itemEle) {
                    let dataS2 = [];
                    if (data?.['product_data']) {
                        dataS2 = [data?.['product_data']];
                    }
                    FormElementControl.loadInitS2($(itemEle), dataS2);
                    QuotationLoadDataHandle.loadCssS2($(itemEle), '260px');
                    if (!data?.['product_data']?.['specific_data']?.['id']) {
                        $(itemEle).attr('data-product-id', data?.['product_data']?.['id']);
                    }
                    if (data?.['product_data']?.['specific_data']?.['id']) {
                        $(itemEle).attr('data-specific-id', data?.['product_data']?.['specific_data']?.['id']);
                    }
                    QuotationLoadDataHandle.loadPriceProduct(itemEle);
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
                if (uomEle) {
                    let dataS2 = [];
                    if (data?.['uom_data']) {
                        dataS2 = [data?.['uom_data']];
                    }
                    FormElementControl.loadInitS2($(uomEle), dataS2);
                }
                if (quantityEle) {
                    if (data?.['product_data']?.['specific_data']?.['id']) {
                        $(quantityEle).attr('disabled', 'true');
                        $(quantityEle).val(1);
                        // QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableProduct, row);
                    }
                }
                if (uomTimeEle) {
                    let dataS2 = [];
                    if (data?.['uom_time_data']) {
                        dataS2 = [data?.['uom_time_data']];
                        if (quantityTimeEle) {
                            quantityTimeEle.removeAttribute('disabled');
                        }
                    }
                    FormElementControl.loadInitS2($(uomTimeEle), dataS2, {'group__code': 'Time', 'group__is_default': true}, null, true);
                }
                if (taxEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    FormElementControl.loadInitS2($(taxEle), dataS2);
                }
                if (btnSPriceEle) {
                    if (['get'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                        $(btnSPriceEle).attr('hidden', 'true');
                    }
                }
                // add classes for collapse
                if (data?.['is_group'] === true) {
                    $(row).find('td:eq(1)').attr('colspan', 2);
                    row.classList.add('tr-group');
                }
            },
            drawCallback: function () {
                QuotationDataTableHandle.dtbProductHDCustom();
                if (['post', 'put'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    // set again WF runtime
                    QuotationLoadDataHandle.loadSetWFRuntimeZone();
                }
                // set cls of group to products
                QuotationLoadDataHandle.loadClsGroupToProducts();

            },
            initComplete: function () {
                // add buttons
                // DTBControl.pushButtonsToDtb("datable-quotation-create-product");
            },
        });
    };

    static dataTableCost(data) {
        // init dataTable
        if ($.fn.dataTable.isDataTable(QuotationDataTableHandle.$tableCost)) {
            QuotationDataTableHandle.$tableCost.DataTable().destroy();
        }
        QuotationDataTableHandle.$tableCost.DataTableDefault({
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
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        let itemType = 0  // product
                        if (row?.['shipping_id']) {
                            itemType = 1  // shipping
                        }
                        if (itemType === 0) {  // product
                            return `<textarea class="form-control table-row-item-show zone-readonly" rows="3" data-zone="${dataZone}" readonly>${row?.['product_data']?.['title']}</textarea>
                                    <div class="row table-row-item-area hidden">
                                        <div class="col-12 col-md-12 col-lg-12">
                                            <select
                                                class="form-select table-row-item disabled-custom-show zone-readonly"
                                                data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-product')}"
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
                            return `<div class="table-row-shipping" data-shipping="${JSON.stringify(row?.['shipping_data']).replace(/"/g, "&quot;")}"><i class="fas fa-shipping-fast mr-2"></i><span>${QuotationLoadDataHandle.transEle.attr('data-shipping')}</span></div>`;
                        }
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        return `<textarea class="form-control table-row-serial" rows="3" data-zone="${dataZone}" readonly>${row?.['product_data']?.['specific_data']?.['serial_number'] ? row?.['product_data']?.['specific_data']?.['serial_number'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 3,
                    width: '12%',
                    render: (data, type, row) => {
                        if (row?.['is_group'] === true) {
                            return ``;
                        }

                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        return `<textarea class="form-control table-row-description" rows="3" data-zone="${dataZone}" readonly>${row?.['product_description'] ? row?.['product_description'] : ''}</textarea>`;
                    }
                },
                {
                    targets: 4,
                    width: '10%',
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
                    targets: 5,
                    width: '8%',
                    render: () => {
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        return `<select 
                                    class="form-select table-row-uom disabled-custom-show zone-readonly"
                                    data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-uom')}"
                                    data-method="GET"
                                    data-keyResp="unit_of_measure"
                                    data-zone="${dataZone}"
                                    readonly
                                >
                                </select>`;
                    },
                },
                {
                    targets: 6,
                    width: '8%',
                    render: (data, type, row) => {
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        return `<input type="text" class="form-control table-row-quantity disabled-custom-show zone-readonly" value="${row?.['product_quantity']}" data-zone="${dataZone}" disabled>`;
                    }
                },
                {
                    targets: 7,
                    width: '18%',
                    render: (data, type, row) => {
                        let dataZone = "quotation_costs_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_costs_data";
                        }
                        let disabled = ''  // product
                        if (row?.['shipping_id']) {
                            disabled = 'disabled'  // shipping
                        }
                        let costPrice = row?.['product_cost_price'] ? row?.['product_cost_price'] : 0;
                        if (costPrice === 0) {
                            costPrice = row?.['product_data']?.['specific_data']?.['specific_value'] ? row?.['product_data']?.['specific_data']?.['specific_value'] : 0;
                        }
                        if (costPrice === 0) {
                            costPrice = row?.['product_data']?.['standard_price'] ? row?.['product_data']?.['standard_price'] : 0;
                        }
                        return `<div class="d-flex">
                                    <div class="input-group-price">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price disabled-custom-show valid-num" 
                                            value="${costPrice}"
                                            data-return-type="number"
                                            data-zone="${dataZone}"
                                        >
                                    </div>
                                    <button
                                        type="button"
                                        class="btn btn-icon btn-outline-light btn-sm btn-select-cost"
                                        data-bs-toggle="modal"
                                        data-bs-target="#selectCostModal"
                                        data-zone="${dataZone}"
                                        ${disabled}
                                    ><i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>`;
                    }
                },
                {
                    targets: 8,
                    width: '6%',
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
                                    data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-tax')}"
                                    data-method="GET"
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
                                >`;
                    }
                },
                {
                    targets: 9,
                    width: '15%',
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
            rowCallback: function (row, data, index) {
                let itemEle = row.querySelector('.table-row-item');
                let suppliedByEle = row.querySelector('.table-row-supplied-by');
                let uomEle = row.querySelector('.table-row-uom');
                let priceGrEle = row.querySelector('.input-group-price');
                let priceEle = row.querySelector('.table-row-price');
                let taxEle = row.querySelector('.table-row-tax');
                let btnSCostEle = row.querySelector('.btn-select-cost');
                if (itemEle) {
                    let dataS2 = [];
                    if (data?.['product_data']) {
                        dataS2 = [data?.['product_data']];
                    }
                    FormElementControl.loadInitS2($(itemEle), dataS2);
                    QuotationLoadDataHandle.loadCssS2($(itemEle), '260px');
                    $(itemEle).attr('data-product-id', data?.['product_data']?.['id']);
                }
                if (suppliedByEle) {
                    if (!$(suppliedByEle).val()) {
                        FormElementControl.loadInitS2($(suppliedByEle), QuotationLoadDataHandle.dataSuppliedBy);
                    }
                    if (data?.['supplied_by'] || data?.['supplied_by'] === 0) {
                        $(suppliedByEle).val(data?.['supplied_by']).trigger('change');
                    }
                }
                if (uomEle) {
                    let dataS2 = [];
                    if (data?.['uom_data']) {
                        dataS2 = [data?.['uom_data']];
                    }
                    FormElementControl.loadInitS2($(uomEle), dataS2);
                }
                if (priceGrEle) {
                    if (data?.['warehouse_data']) {
                        $(priceGrEle).attr('data-cost-wh-id', data?.['warehouse_data']?.['id']);
                    }
                }
                if (priceEle) {
                    if (data?.['warehouse_data']) {
                        $(priceEle).attr('data-wh', JSON.stringify(data?.['warehouse_data']));
                    }
                    if (data?.['product_data']?.['specific_data']?.['id']) {
                        $(priceEle).attr('readonly', 'true');
                    }
                }
                if (taxEle) {
                    let dataS2 = [];
                    if (data?.['tax_data']) {
                        dataS2 = [data?.['tax_data']];
                    }
                    FormElementControl.loadInitS2($(taxEle), dataS2);
                }
                if (btnSCostEle) {
                    if (data?.['product_data']?.['specific_data']?.['id']) {
                        $(btnSCostEle).attr('hidden', 'true');
                    }
                    if (['get'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                        $(btnSCostEle).attr('hidden', 'true');
                    }
                }
                // re calculate
                QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableCost, row);
            },
            drawCallback: function () {
                QuotationDataTableHandle.dtbCostHDCustom();
                QuotationDataTableHandle.loadDtbHideHeader("datable-quotation-create-cost");
            },
        });
    };

    static dataTableExpense(data) {
        // init dataTable
        if ($.fn.dataTable.isDataTable(QuotationDataTableHandle.$tableExpense)) {
            QuotationDataTableHandle.$tableExpense.DataTable().destroy();
        }
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
                        return `<span class="table-row-order">${row?.['order']}</span>`
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
                                    data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-labor')}"
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
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        let readonly = "";
                        if (row?.['is_labor'] === true) {
                            readonly = "readonly";
                        }
                        return `<select 
                                    class="form-select table-row-item" 
                                    data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-expense')}"
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
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<select 
                                    class="form-select table-row-uom"
                                    data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-uom')}"
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
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
                        return `<input type="text" class="form-control table-row-quantity valid-num" value="${row?.['expense_quantity']}" data-zone="${dataZone}" required>`;
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
                                    data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-tax')}"
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
                        let dataZone = "quotation_expenses_data";
                        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_expenses_data";
                        }
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
                QuotationDataTableHandle.dtbExpenseHDCustom();
                if (['post', 'put'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    // set again WF runtime
                    QuotationLoadDataHandle.loadSetWFRuntimeZone();
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

    static dataTableCopyQuotation() {
        // init dataTable
        let params = {
            'employee_inherit': QuotationLoadDataHandle.salePersonSelectEle.val(),
            'system_status__in': [2, 3].join(','),
        }
        if (!QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
            params = {
                'employee_inherit': QuotationLoadDataHandle.salePersonSelectEle.val(),
                'system_status__in': [2, 3, 4].join(','),
            }
        }
        QuotationDataTableHandle.$tableQuotationCopy.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: QuotationLoadDataHandle.urlEle.attr('data-quotation'),
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
            scrollY: "50vh",
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
                            return `<span class="table-row-customer mr-1">${row?.['opportunity']?.['title']}</span>`;
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
                QuotationLoadDataHandle.loadEventRadio(QuotationDataTableHandle.$tableQuotationCopy);
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
        let noMapArea = QuotationLoadDataHandle.$modalShipping[0].querySelector('.no-map-area');
        let noLogistic = QuotationLoadDataHandle.$modalShipping[0].querySelector('.no-logistic');
        if (noMapArea && noLogistic) {
            $(noMapArea).attr('hidden', 'true');
            $(noLogistic).attr('hidden', 'true');
        }
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
                            if (passList.length === failList.length) {
                                $(noMapArea).removeAttr('hidden');
                            }
                        } else {
                            QuotationDataTableHandle.dataTableShipping(passList);
                            $(noLogistic).removeAttr('hidden');
                            // $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-check-if-shipping-address')}, 'info');
                        }
                    }
                }
            }
        )
    };

    static dataTablePaymentStage(data) {
        // init dataTable
        if ($.fn.dataTable.isDataTable(QuotationDataTableHandle.$tablePayment)) {
            QuotationDataTableHandle.$tablePayment.DataTable().destroy();
        }
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
                                        data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-tax')}"
                                        data-method="GET"
                                        data-keyResp="tax_list"
                                        readonly
                                    >
                                    </select>
                                </div>
                                <span class="table-row-tax-check" hidden>${QuotationLoadDataHandle.transEle.attr('data-mixed')}</span>`;
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
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-zone="sale_order_payment_stage" hidden><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
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
                let btnSInvoiceEle = row.querySelector('.btn-select-invoice');
                let btnSReconcileEle = row.querySelector('.btn-select-reconcile');
                let delEle = row.querySelector('.del-row');

                let $termMD = QuotationLoadDataHandle.paymentSelectEle;
                let checkTax = QuotationLoadDataHandle.loadCheckSameMixTax();
                if (installmentEle) {
                    let term = [];
                    if (QuotationLoadDataHandle.paymentSelectEle.val()) {
                        let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
                        if (dataSelected) {
                            term = dataSelected?.['term'];
                            let type = "percent";
                            for (let termData of term) {
                                if (termData?.['unit_type'] === 1) {
                                    type = "amount";
                                }
                                let isNum = parseFloat(termData?.['value']);
                                if (!isNum) {  // balance
                                    termData['value'] = String(QuotationLoadDataHandle.loadParseBalanceOfTerm("payment"));
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
                    if (!$termMD.val() || checkTax?.['check'] === "mixed" && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
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

                    if (checkTax?.['check'] === "same" && QuotationDataTableHandle.$tableInvoice.DataTable().rows().count() === 0) {
                        FormElementControl.loadInitS2($(taxEle), checkTax?.['list_tax']);
                    }
                    if (checkTax?.['check'] === "mixed") {
                        taxAreaEle.setAttribute('hidden', 'true');
                        taxCheckEle.removeAttribute('hidden');
                    }
                }
                if (valTaxEle) {
                    if (!$termMD.val() || checkTax?.['check'] === "mixed" && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        valTaxEle.removeAttribute('readonly');
                    }
                }
                if (valTotalEle) {
                    if (!$termMD.val() || checkTax?.['check'] === "mixed" && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        valTotalEle.removeAttribute('readonly');
                    }
                }
                if ($(installmentEle).val()) {
                    QuotationLoadDataHandle.loadChangeInstallment(installmentEle);
                }
                if (btnSInvoiceEle) {
                    if (['get'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                        $(btnSInvoiceEle).attr('hidden', 'true');
                    }
                }
                if (btnSReconcileEle) {
                    if (['get'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                        $(btnSReconcileEle).attr('hidden', 'true');
                    }
                }
                if (delEle) {
                    if (!$termMD.val()) {
                        delEle.removeAttribute('hidden');
                    }
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                QuotationDataTableHandle.dtbPaymentHDCustom();
                if (['post', 'put'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    // set again WF runtime
                    QuotationLoadDataHandle.loadSetWFRuntimeZone();
                }
            },
        });
    };

    static dataTableInvoice(data) {
        // init dataTable
        if ($.fn.dataTable.isDataTable(QuotationDataTableHandle.$tableInvoice)) {
            QuotationDataTableHandle.$tableInvoice.DataTable().destroy();
        }
        QuotationDataTableHandle.$tableInvoice.DataTableDefault({
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
                                        data-url="${QuotationLoadDataHandle.urlEle.attr('data-md-tax')}"
                                        data-method="GET"
                                        data-keyResp="tax_list"
                                    >
                                    </select>
                                </div>
                                <span class="table-row-tax-check" hidden>${QuotationLoadDataHandle.transEle.attr('data-mixed')}</span>`;
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
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-zone="sale_order_invoice"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
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
                let btnSTermEle = row.querySelector('.btn-select-term');

                let $termMD = QuotationLoadDataHandle.paymentSelectEle;
                let checkTax = QuotationLoadDataHandle.loadCheckSameMixTax();
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
                    if (!$termMD.val() || checkTax?.['check'] === "mixed" && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                        totalEle.removeAttribute('readonly');
                    }
                }
                if (paidFullEle) {
                    if (data?.['total'] > 0 && data?.['balance'] === 0) {
                        paidFullEle.removeAttribute('hidden');
                    }
                }
                if (btnSTermEle) {
                    if (['get'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                        $(btnSTermEle).attr('hidden', 'true');
                    }
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                QuotationDataTableHandle.dtbInvoiceHDCustom();
            },
        });
    };

    static dataTableSelectProduct() {
        QuotationDataTableHandle.$tableSProduct.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: QuotationLoadDataHandle.urlEle.attr('data-md-product'),
                type: "GET",
                data: {'sale_default_uom_id__isnull': false},
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
                        let $form = $('#frm_quotation_create');
                        let dataZone = "quotation_products_data";
                        let clsZoneReadonly = '';
                        if ($form[0].classList.contains('sale-order')) {
                            dataZone = "sale_order_products_data";
                        }
                        let disabled = '';
                        let checked = '';
                        if (QuotationLoadDataHandle.$productsCheckedEle.val()) {
                            let storeID = JSON.parse(QuotationLoadDataHandle.$productsCheckedEle.val());
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

                        let checkBOM = QuotationLoadDataHandle.loadCheckProductBOM(row);
                        if (checkBOM?.['is_pass'] === false) {
                            disabled = 'disabled';
                            checked = '';
                            clsZoneReadonly = 'zone-readonly';
                        }
                        if (row?.['title'] && row?.['code']) {
                            return `<div class="form-check form-check-lg d-flex align-items-center">
                                        <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox ${clsZoneReadonly}" id="s-product-${row?.['id'].replace(/-/g, "")}" ${disabled} ${checked} data-zone="${dataZone}">
                                        <textarea class="form-control form-check-label table-row-title" rows="3" readonly>${row?.['title']}</textarea>
                                        <button class="btn-collapse-parent btn btn-icon btn-rounded" data-product-id="${row?.['id']}"><span class="icon"><i class="fas fa-chevron-right icon-collapse"></i></span></button>
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
                        return `<span class="table-row-uom">${row?.['duration_unit']?.['title'] ? row?.['duration_unit']?.['title'] : ''}</span>`;
                    }
                },
                {
                    targets: 6,
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
                    targets: 7,
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
                if (['post', 'put'].includes(QuotationLoadDataHandle.$form.attr('data-method').toLowerCase())) {
                    QuotationDataTableHandle.dtbSProductHDCustom();
                }
            },
        });
    };

    static dataTableSelectTerm(data) {
        QuotationDataTableHandle.$tableSTerm.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "50vh",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let disabled = "";
                        QuotationDataTableHandle.$tableInvoice.DataTable().rows().every(function () {
                            let rowCheck = this.node();
                            if (!rowCheck.querySelector(`[data-id="${QuotationLoadDataHandle.$btnSaveTerm.attr('data-id')}"]`)) {
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
                        let target = QuotationDataTableHandle.$tableInvoice[0].querySelector(`[data-id="${QuotationLoadDataHandle.$btnSaveTerm.attr('data-id')}"]`);
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
                QuotationLoadDataHandle.loadEventCheckbox(QuotationDataTableHandle.$tableSTerm);
                $.fn.initMaskMoney2();
            }
        });
    };

    static dataTableSelectInvoice(data) {
        QuotationDataTableHandle.$tableSInvoice.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "50vh",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let checked = "";
                        let target = QuotationDataTableHandle.$tablePayment[0].querySelector(`[data-id="${QuotationLoadDataHandle.$btnSaveInvoice.attr('data-id')}"]`);
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
        QuotationDataTableHandle.$tableSReconcile.not('.dataTable').DataTableDefault({
            data: data ? data : [],
            paging: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            scrollY: "50vh",
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let checked = "";
                        let target = QuotationDataTableHandle.$tablePayment[0].querySelector(`[data-id="${QuotationLoadDataHandle.$btnSaveReconcile.attr('data-id')}"]`);
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
                                    <label class="form-check-label table-row-order" for="s-reconcile-${row?.['order']}">${row?.['term_data']?.['title'] ? row?.['term_data']?.['title'] : row?.['remark']}</label>
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
                QuotationLoadDataHandle.loadEventCheckbox(QuotationDataTableHandle.$tableSReconcile);
                $.fn.initMaskMoney2();
            }
        });
    };

    static dataTableSpecProduct(idTbl, productID) {
        let $tableChild = $('#' + idTbl);
        if ($.fn.dataTable.isDataTable($tableChild)) {
            $tableChild.DataTable().destroy();
        }
        $tableChild.not('.dataTable').DataTableDefault({
            useDataServer: true,
            ajax: {
                url: QuotationLoadDataHandle.urlEle.attr('data-spec-product'),
                type: 'GET',
                data: {
                    'product_id': productID,
                    // 'from_pm': true,
                    'product_warehouse_serial__serial_status': 0,
                },
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) return resp.data['product_si_serial_number_list'] ? resp.data['product_si_serial_number_list'] : [];
                    return [];
                },
            },
            pageLength: 5,
            info: false,
            columns: [
                {
                    title: QuotationLoadDataHandle.transEle.attr('data-spec-prod-1'),
                    render: (data, type, row) => {
                        let disabled = '';
                        let checked = '';
                        if (QuotationLoadDataHandle.$productsCheckedEle.val()) {
                            let storeID = JSON.parse(QuotationLoadDataHandle.$productsCheckedEle.val());
                            if (typeof storeID === 'object') {
                                let combineID = productID + "-" + row?.['id'];
                                if (storeID?.[combineID]) {
                                    if (storeID?.[combineID]?.['type'] === "selected") {
                                        disabled = 'disabled';
                                    }
                                    checked = 'checked';
                                }
                            }
                        }

                        return `<div class="form-check form-check-lg d-flex align-items-center">
                                    <input type="checkbox" name="row-checkbox" class="form-check-input table-row-checkbox-spec" id="s-spec-product-${row?.['id'].replace(/-/g, "")}" data-product-id="${productID}" ${disabled} ${checked}>
                                    <textarea class="form-control form-check-label table-row-title" rows="2" readonly>${row?.['serial_number']}</textarea>
                                </div>`;
                    }
                },
                {
                    title: QuotationLoadDataHandle.transEle.attr('data-spec-prod-2'),
                    render: (data, type, row) => {
                        return `<textarea class="form-control form-check-label" rows="2" readonly>${row?.['vendor_serial_number'] ? row?.['vendor_serial_number'] : ''}</textarea>`;
                    }
                },
                {
                    title: QuotationLoadDataHandle.transEle.attr('data-spec-prod-3'),
                    render: (data, type, row) => {
                        return `<textarea class="form-control form-check-label" rows="2" readonly>${row?.['new_description'] ? row?.['new_description'] : ''}</textarea>`;
                    }
                },
                {
                    title: QuotationLoadDataHandle.transEle.attr('data-spec-prod-4'),
                    render: (data, type, row) => {
                        let date = '--';
                        if (row?.['expire_date']) {
                            date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['expire_date']);
                        }
                        return `<span>${date}</span>`;
                    }
                },
                {
                    title: QuotationLoadDataHandle.transEle.attr('data-spec-prod-5'),
                    render: (data, type, row) => {
                        let date = '--';
                        if (row?.['manufacture_date']) {
                            date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['manufacture_date']);
                        }
                        return `<span>${date}</span>`;
                    }
                },
                {
                    title: QuotationLoadDataHandle.transEle.attr('data-spec-prod-6'),
                    render: (data, type, row) => {
                        let date = '--';
                        if (row?.['warranty_start']) {
                            date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['warranty_start']);
                        }
                        return `<span>${date}</span>`;
                    }
                },
                {
                    title: QuotationLoadDataHandle.transEle.attr('data-spec-prod-7'),
                    render: (data, type, row) => {
                        let date = '--';
                        if (row?.['warranty_end']) {
                            date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['warranty_end']);
                        }
                        return `<span>${date}</span>`;
                    }
                },
                {
                    title: QuotationLoadDataHandle.transEle.attr('data-spec-prod-8'),
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${parseFloat(row?.['specific_value'])}"></span>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
            },
            drawCallback: function () {
                QuotationDataTableHandle.loadDtbHideHeader(idTbl);
                $.fn.initMaskMoney2();
            },
        });
    };

    // Custom dtb
    static dtbSProductHDCustom() {
        let $table = $('#table-select-product');
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
            if (!$('#btn-quick-product').length) {
                let dataZone = "quotation_products_data";
                if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                    dataZone = "sale_order_products_data";
                }
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-quick-product" data-bs-toggle="modal" data-bs-target="#addQuickProduct" data-zone="${dataZone}">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${QuotationLoadDataHandle.transEle.attr('data-new')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
            }
        }
    };

    static dtbProductHDCustom() {
        let $table = QuotationDataTableHandle.$tableProduct;
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
                let dataZone = "quotation_products_data";
                if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                    dataZone = "sale_order_products_data";
                }
                let hidden = "";
                if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hidden = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" aria-expanded="false" data-bs-toggle="dropdown" data-zone="${dataZone}" ${hidden}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${QuotationLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>
                                <div class="dropdown-menu w-210p">
                                    <a class="dropdown-item" href="#" id="btn-add-product-quotation-create" data-bs-toggle="offcanvas" data-bs-target="#selectProductCanvas"><i class="dropdown-icon fas fa-cube"></i><span class="mt-2">${QuotationLoadDataHandle.transEle.attr('data-add-product')}</span></a>
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
                    QuotationLoadDataHandle.loadChangePaymentTerm();
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

    static dtbCostHDCustom() {
        let $table = QuotationDataTableHandle.$tableCost;
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
        let $table = QuotationDataTableHandle.$tableExpense;
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
                let dataZone = "quotation_expenses_data";
                if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                    dataZone = "sale_order_expenses_data";
                }
                let hidden = "";
                if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hidden = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" aria-expanded="false" data-bs-toggle="dropdown" data-zone="${dataZone}" ${hidden}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${QuotationLoadDataHandle.transEle.attr('data-add')}</span></span>
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
                    QuotationStoreDataHandle.storeDtbData(3);
                    QuotationLoadDataHandle.loadAddRowExpense();
                });
                $('#btn-add-labor-quotation-create').on('click', function () {
                    QuotationStoreDataHandle.storeDtbData(3);
                    QuotationLoadDataHandle.loadAddRowLabor();
                });
            }
        }
    };

    static dtbPaymentHDCustom() {
        let $table = QuotationDataTableHandle.$tablePayment;
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
                let $termMD = QuotationLoadDataHandle.paymentSelectEle;
                if ($termMD.val()) {
                    hiddenLoad = "";
                }
                if (!$termMD.val()) {
                    hiddenAdd = "";
                }
                if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hiddenLoad = "hidden";
                    hiddenAdd = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-load-payment-stage" data-zone="sale_order_payment_stage" ${hiddenLoad}>
                                    <span><span class="icon"><i class="fas fa-arrow-down"></i></span><span>${QuotationLoadDataHandle.transEle.attr('data-detail')}</span></span>
                                </button>
                                <button type="button" class="btn btn-primary" id="btn-add-payment-stage" data-zone="sale_order_payment_stage" ${hiddenAdd}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${QuotationLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-load-payment-stage').on('click', function () {
                    QuotationStoreDataHandle.storeDtbData(4);
                    QuotationLoadDataHandle.loadPaymentStage();
                });
                $('#btn-add-payment-stage').on('click', function () {
                    QuotationStoreDataHandle.storeDtbData(4);
                    QuotationLoadDataHandle.loadAddPaymentStage();
                });
            }
        }
    };

    static dtbInvoiceHDCustom() {
        let $table = QuotationDataTableHandle.$tableInvoice;
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
                if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                    hidden = "hidden";
                }
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-add-invoice" data-zone="sale_order_payment_stage" ${hidden}>
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${QuotationLoadDataHandle.transEle.attr('data-add')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-invoice').on('click', function () {
                    QuotationStoreDataHandle.storeDtbData(5);
                    QuotationLoadDataHandle.loadAddInvoice();
                });
            }
        }
    };

    static loadDtbHideHeader(tableID) {
        let tableIDWrapper = tableID + '_wrapper';
        let tableWrapper = document.getElementById(tableIDWrapper);
        if (tableWrapper) {
            let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
            if (headerToolbar) {
                headerToolbar.classList.add('hidden');
            }
        }
        let tableIDLength = tableID + '_length';
        let tableLength = document.getElementById(tableIDLength);
        if (tableLength) {
            tableLength.classList.add('hidden');
        }
    };

}

// Calculate
class QuotationCalculateCaseHandle {

    static updateTotal(table) {
        // *** quotation & sale order have different rules ***
        // Quotation: discount on row apply to subtotal => pretax includes discount on row => discount on total = pretax * %discountTotalRate
        // Sale order: discount on row not apply to subtotal => pretax not includes discount on row => discount on total = (pretax - discountRows) * %discountTotalRate
        let form = QuotationLoadDataHandle.$form[0];
        let app = 'quotation';
        if (form.classList.contains('sale-order')) {
            app = 'sale_order';
        }
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
                let eleRowTax = row.querySelector('.table-row-tax-amount');
                if (eleRowTax) {
                    if ($(eleRowTax).valCurrency()) {
                        // check if not promotion then plus else minus
                        if (is_promotion === false) { // not promotion
                            taxAmount += parseFloat($(eleRowTax).valCurrency())
                        } else { // promotion
                            if (row.querySelector('.table-row-promotion').getAttribute('data-promotion')) {
                                let dataPm = JSON.parse(row.querySelector('.table-row-promotion').getAttribute('data-promotion'));
                                if (dataPm?.['is_on_row'] === true) {
                                    taxAmount -= parseFloat($(eleRowTax).valCurrency());
                                }
                            }
                        }
                    }
                }
                // calculate Discount Amount
                let eleRowDiscount = row.querySelector('.table-row-discount-amount');
                let eleRowQuantity = row.querySelector('.table-row-quantity');
                let eleRowQuantityTime = row.querySelector('.table-row-quantity-time');
                if (eleRowDiscount && eleRowQuantity && eleRowQuantityTime) {
                    if ($(eleRowDiscount).valCurrency() && $(eleRowQuantity).val()) {
                        if (app === 'quotation') {
                            discountAmount += parseFloat($(eleRowDiscount).valCurrency()) * parseFloat($(eleRowQuantity).val());
                        }
                        if (app === 'sale_order') {
                            if ($(eleRowQuantityTime).val()) {
                                let time = parseFloat($(eleRowQuantityTime).val());
                                if (time === 0) {
                                    discountAmount += parseFloat($(eleRowDiscount).valCurrency()) * parseFloat($(eleRowQuantity).val());
                                }
                                if (time > 0) {
                                    discountAmount += parseFloat($(eleRowDiscount).valCurrency()) * parseFloat($(eleRowQuantity).val()) * parseFloat($(eleRowQuantityTime).val());
                                }
                            }

                        }
                    }
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
            if (app === 'sale_order') {
                discountTotalRate = $('#quotation-copy-discount-on-total').val();
            }
            if (discountTotalRate && eleDiscount) {
                if (app === 'quotation') {
                    discount_on_total = parseFloat(discountTotalRate);
                    discountAmount = ((pretaxAmount * discount_on_total) / 100);
                    // check if shipping fee then minus before calculate discount
                    if (shippingFee > 0) {
                        discountAmount = (((pretaxAmount - shippingFee) * discount_on_total) / 100);
                    }
                    discountAmountTotal += discountAmount;
                }
                if (app === 'sale_order') {
                    discount_on_total = parseFloat(discountTotalRate);
                    // check if shipping fee then minus before calculate discount
                    let discountAmountOnTotal = (((pretaxAmount - discountAmount) * discount_on_total) / 100);
                    if (shippingFee > 0) {
                        discountAmountOnTotal = (((pretaxAmount - discountAmount - shippingFee) * discount_on_total) / 100);
                    }
                    discountAmount += discountAmountOnTotal;
                    discountAmountTotal += discountAmountOnTotal;

                    if (pretaxAmount > 0) {
                        discount_on_total = (discountAmount / pretaxAmount) * 100;
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
                if (app === 'quotation') {  // quotation (revenue = pretaxAmount - discountAmountTotal)
                    finalRevenueBeforeTax.value = pretaxAmount - discountAmountTotal;
                }
                if (app === 'sale_order') {  // sale order (revenue = pretaxAmount - discountAmount)
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
        let form = QuotationLoadDataHandle.$form[0];
        let app = 'quotation';
        if (form.classList.contains('sale-order')) {
            app = 'sale_order';
        }

        let tableProductWrapper = document.getElementById('datable-quotation-create-product_wrapper');
        let price = 0;
        let quantity = 0;
        let quantityTime = 0;
        let isTime = false;
        let elePrice = row.querySelector('.table-row-price');
        if (elePrice) {
            price = $(elePrice).valCurrency();
        }
        let eleQuantity = row.querySelector('.table-row-quantity');
        if (eleQuantity) {
            if (eleQuantity.value) {
                quantity = parseFloat(eleQuantity.value);
            } else if (!eleQuantity.value || eleQuantity.value === "0") {
                quantity = 0;
            }
        }
        let discountRate = 0;
        let discount = 0;
        let subtotal = QuotationCalculateCaseHandle.rowSubtotal(price, quantity);
        let subtotalAfterDiscount = 0;
        let subtotalAfterDiscountTotal = 0;
        let taxRate = 0;
        let tax = 0;
        let eleUOMTime = row.querySelector('.table-row-uom-time');
        let eleQuantityTime = row.querySelector('.table-row-quantity-time');
        let eleTax = row.querySelector('.table-row-tax');
        if (eleTax) {
            if ($(eleTax).val()) {
                let dataTax = SelectDDControl.get_data_from_idx($(eleTax), $(eleTax).val());
                if (dataTax.hasOwnProperty('rate')) {
                    taxRate = parseInt(dataTax.rate);
                }
            }
        }
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        // calculate discount + tax
        let eleDiscountCheck = row.querySelector('.table-row-discount-check');
        let eleDiscount = row.querySelector('.table-row-discount');
        let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
        let eleDiscountAmountTotal = row.querySelector('.table-row-discount-amount-total');
        if (eleDiscountCheck && eleDiscount && eleDiscountAmount && eleDiscountAmountTotal) {
            // handle check discount type
            if (eleDiscountCheck.checked === true) {
                if ($(eleDiscount).val()) {
                    discountRate = parseFloat($(eleDiscount).val());
                }
                discount = QuotationCalculateCaseHandle.rowDiscount(price, discountRate);
                $(eleDiscountAmount).attr('value', String(discount));
            }
            if (eleDiscountCheck.checked === false) {
                if ($(eleDiscountAmount).valCurrency()) {
                    discount = $(eleDiscountAmount).valCurrency();
                }
                if (price > 0) {
                    discountRate = (discount / price) * 100;
                    // discountRate = Number(percent.toFixed(1));
                }
                $(eleDiscount).val(discountRate);
            }
            let priceAfterDiscount = (price - discount);
            if (app === 'quotation') {
                subtotal = subtotal - QuotationCalculateCaseHandle.rowDiscount(subtotal, discountRate);
            }
            if (app === 'sale_order') {
                subtotalAfterDiscount = subtotal - QuotationCalculateCaseHandle.rowDiscount(subtotal, discountRate);
            }
            // handle check discount total
            let discountRateTotal = 0;
            if (tableProductWrapper) {
                let tableProductFt = tableProductWrapper.querySelector('.dataTables_scrollFoot');
                if (tableProductFt) {
                    if (tableProductFt.querySelector('.quotation-create-product-discount')) {
                        if (tableProductFt.querySelector('.quotation-create-product-discount').value) {
                            discountRateTotal = parseFloat(tableProductFt.querySelector('.quotation-create-product-discount').value);
                        }
                    }
                }
            }
            if (app === 'sale_order') {
                let $eleRateTotalCopy = $('#quotation-copy-discount-on-total');
                if ($eleRateTotalCopy.length > 0) {
                    if ($eleRateTotalCopy.val()) {
                        discountRateTotal = parseFloat($eleRateTotalCopy.val());
                    }
                }
            }

            // check quantity time
            if (eleUOMTime && eleQuantityTime) {
                if ($(eleUOMTime).val()) {
                    if (eleQuantityTime.value) {
                        quantityTime = parseFloat(eleQuantityTime.value)
                    } else if (!eleQuantityTime.value || eleQuantityTime.value === "0") {
                        quantityTime = 0;
                    }
                    isTime = true;
                }
            }
            if (isTime === true) {
                subtotal = QuotationCalculateCaseHandle.rowSubtotal(subtotal, quantityTime);
                subtotalAfterDiscount = QuotationCalculateCaseHandle.rowSubtotal(subtotalAfterDiscount, quantityTime);
            }
            let discountAmountOnTotal = ((priceAfterDiscount * discountRateTotal) / 100);
            // store discount amount
            if (app === 'quotation') {
                if (discountAmountOnTotal > 0) {
                    $(eleDiscountAmountTotal).attr('value', String(discountAmountOnTotal));
                }
            }
            subtotalAfterDiscountTotal = subtotal - QuotationCalculateCaseHandle.rowDiscount(subtotal, discountRateTotal);
            // if (isTime === true) {
            //     subtotalAfterDiscountTotal = QuotationCalculateCaseHandle.rowSubtotal(subtotalAfterDiscountTotal, quantityTime);
            // }
            // calculate tax
            if (eleTaxAmount) {
                if (app === 'quotation') {
                    tax = QuotationCalculateCaseHandle.rowTax(subtotalAfterDiscountTotal, taxRate);
                }
                if (app === 'sale_order') {
                    let subSO = subtotalAfterDiscount - QuotationCalculateCaseHandle.rowDiscount(subtotalAfterDiscount, discountRateTotal);
                    tax = QuotationCalculateCaseHandle.rowTax(subSO, taxRate);
                }
                $(eleTaxAmount).attr('value', String(tax));
            }
        } else {
            // calculate tax no discount on total
            if (eleTaxAmount) {
                tax = QuotationCalculateCaseHandle.rowTax(subtotal, taxRate);
                $(eleTaxAmount).attr('value', String(tax));
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
        QuotationCalculateCaseHandle.calculate(row);
        // calculate total
        QuotationCalculateCaseHandle.updateTotal(table[0]);
    };

    static calculateAllRowsTableProduct() {
        QuotationDataTableHandle.$tableProduct.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-item')) {
                QuotationCalculateCaseHandle.commonCalculate(QuotationDataTableHandle.$tableProduct, row);
            }
        });
    };

    // Calculate funcs
    static getDatasRelateTax(valBefore, tax) {
        let valTax = valBefore * tax / 100;
        let valAfter = valBefore + valTax;
        return {'valBefore': valBefore, 'valTax': valTax, 'valAfter': valAfter};
    };

    static rowSubtotal(price, quantity) {
        return price * quantity;
    };

    static rowDiscount(subtotal, discountRate) {
        return (subtotal * discountRate) / 100;
    };

    static rowTax(subtotal, taxRate) {
        return (subtotal * taxRate) / 100;
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

// Promotion
class QuotationPromotionHandle {
    static callPromotion(type_check) {
        let $ele = $('#data-init-quotation-create-promotion');
        let customer_id = QuotationLoadDataHandle.customerSelectEle.val();
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
class QuotationDeliveryHandle {
    static $btnDeliveryInfo = $('#delivery-info');
    static $modalDeliveryInfoEle = $('#deliveryInfoModalCenter');
    static $deliveryEstimatedDateEle = $('#estimated_delivery_date');
    static $deliveryRemarkEle = $('#remarks');
    static $btnDelivery = $('#btn-delivery');

    static checkOpenDeliveryInfo(data) {
        // check CR all cancel then allow delivery
        WindowControl.showLoading();
        $.fn.callAjax2({
                'url': QuotationLoadDataHandle.urlEle.attr('data-so-list-api'),
                'method': 'GET',
                'data': {'document_root_id': data?.['document_root_id']},
                'isDropdown': true,
            }
        ).then(
            (resp) => {
                let dataCR = $.fn.switcherResp(resp);
                if (dataCR) {
                    if (dataCR.hasOwnProperty('sale_order_list') && Array.isArray(dataCR.sale_order_list)) {
                        let check = false;
                        if (dataCR?.['sale_order_list'].length > 0) {
                            let countCancel = 0;
                            for (let saleOrder of dataCR?.['sale_order_list']) {
                                if (saleOrder?.['system_status'] === 4) {
                                    countCancel++;
                                }
                            }
                            if (countCancel === (dataCR?.['sale_order_list'].length - 1)) {
                                check = true;
                            }
                        }
                        if (check === true) {
                            // open modal
                            QuotationDeliveryHandle.$btnDelivery.attr('data-id', data?.['id']);
                            let targetCodeEle = QuotationDeliveryHandle.$modalDeliveryInfoEle[0].querySelector('.target-code');
                            if (targetCodeEle) {
                                targetCodeEle.innerHTML = data?.['code'] ? data?.['code'] : '';
                            }
                            QuotationDeliveryHandle.$modalDeliveryInfoEle.modal('show');
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
class QuotationStoreDataHandle {

    static storeDtbData(type) {
        let datas = [];
        let $table = null;
        if (type === 1) {
            datas = QuotationSubmitHandle.setupDataProduct();
            $table = QuotationDataTableHandle.$tableProduct;
        }
        if (type === 2) {
            datas = QuotationSubmitHandle.setupDataCost();
            $table = QuotationDataTableHandle.$tableCost;
        }
        if (type === 3) {
            datas = QuotationSubmitHandle.setupDataExpense();
            $table = QuotationDataTableHandle.$tableExpense;
        }
        if (type === 4) {
            datas = QuotationSubmitHandle.setupDataPaymentStage();
            $table = QuotationDataTableHandle.$tablePayment;
        }
        if (type === 5) {
            datas = QuotationSubmitHandle.setupDataInvoice();
            $table = QuotationDataTableHandle.$tableInvoice;
        }
        let dataJSON = {};
        let dataGrJSON = {};
        if (datas.length > 0 && $table) {
            for (let data of datas) {
                if (data?.['order']) {
                    if (!dataJSON.hasOwnProperty(String(data?.['order']))) {
                        dataJSON[String(data?.['order'])] = data;
                    }
                }
                if (data?.['group_order']) {
                    if (!dataGrJSON.hasOwnProperty(String(data?.['group_order']))) {
                        dataGrJSON[String(data?.['group_order'])] = data;
                    }
                }
            }
            $table.DataTable().rows().every(function () {
                let row = this.node();
                let rowIndex = $table.DataTable().row(row).index();
                let orderEle = row.querySelector('.table-row-order');
                let groupEle = row.querySelector('.table-row-group');
                if (orderEle) {
                    let key = orderEle.innerHTML;
                    $table.DataTable().row(rowIndex).data(dataJSON?.[key]);
                }
                if (groupEle) {
                    let key = groupEle.getAttribute('data-group-order');
                    $table.DataTable().row(rowIndex).data(dataGrJSON?.[key]);
                }
            });
            if (type === 1) {
                QuotationLoadDataHandle.loadReInitDataTableProduct();
            }
            if (type === 2) {
                QuotationLoadDataHandle.loadReInitDataTableCost();
            }
            if (type === 3) {
                QuotationLoadDataHandle.loadReInitDataTableExpense();
            }
            if (type === 4) {
                QuotationLoadDataHandle.loadReInitDataTablePayment();
            }
            if (type === 5) {
                QuotationLoadDataHandle.loadReInitDataTableInvoice();
            }
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
            let rowIndex = QuotationDataTableHandle.$tableProduct.DataTable().row(row).index();
            let $row = QuotationDataTableHandle.$tableProduct.DataTable().row(rowIndex);
            let dataRow = $row.data();

            let groupEle = row.querySelector('.table-row-group');
            let productEle = row.querySelector('.table-row-item');
            let promotionEle = row.querySelector('.table-row-promotion');
            let shippingEle = row.querySelector('.table-row-shipping');
            if (groupEle) {  // PRODUCT GROUP
                rowData['is_group'] = true;
                if (groupEle.getAttribute('data-group-order')) {
                    rowData['group_order'] = parseInt(groupEle.getAttribute('data-group-order'));
                }
                let groupTitleEle = row.querySelector('.table-row-group-title-edit');
                if (groupTitleEle) {
                    rowData['group_title'] = groupTitleEle.value;
                }
                rowData['unit_of_measure_id'] = null;
                result.push(rowData);
            } else if (productEle) { // PRODUCT
                if ($(productEle).val()) {
                    let dataProduct = SelectDDControl.get_data_from_idx($(productEle), $(productEle).val());
                    if (dataProduct) {
                        rowData['product_id'] = dataProduct?.['id'];
                        rowData['product_title'] = dataProduct?.['title'];
                        rowData['product_code'] = dataProduct?.['code'];
                        rowData['product_data'] = dataRow?.['product_data'];
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
                    rowData['product_description'] = $(eleDescription).val();
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
                let eleDiscountAmountTotal = row.querySelector('.table-row-discount-amount-total');
                if (eleDiscountAmountTotal) {
                    rowData['product_discount_amount_total'] = $(eleDiscountAmountTotal).valCurrency();
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
                    rowData['product_description'] = $(eleDescription).val();
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
                    rowData['product_description'] = $(eleDescription).val();
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
                let suppliedByEle = row.querySelector('.table-row-supplied-by');
                if (suppliedByEle) {
                    if ($(suppliedByEle).val()) {
                        rowData['supplied_by'] = parseInt($(suppliedByEle).val());
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
                    if ($(eleTaxAmount).valCurrency()) {
                        rowData['product_tax_amount'] = parseFloat($(eleTaxAmount).valCurrency());
                    }
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = $(eleDescription).val();
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
                let eleTaxAmount = row.querySelector('.table-row-tax-amount');
                if (eleTaxAmount) {
                    if ($(eleTaxAmount).valCurrency()) {
                        rowData['product_tax_amount'] = parseFloat($(eleTaxAmount).valCurrency());
                    }
                }
                let eleDescription = row.querySelector('.table-row-description');
                if (eleDescription) {
                    rowData['product_description'] = $(eleDescription).val();
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
            let rowIndex = QuotationDataTableHandle.$tableExpense.DataTable().row(row).index();
            let $row = QuotationDataTableHandle.$tableExpense.DataTable().row(rowIndex);
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
        let quotation_indicators_data = 'quotation_indicators_data';
        let keyInd = "indicator_data";
        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
            quotation_indicators_data = 'sale_order_indicators_data';
            keyInd = "quotation_indicator_data";
        }
        let datasDetail = QuotationLoadDataHandle.loadGetDatasDetail();
        let _form = new SetupFormSubmit(QuotationLoadDataHandle.$form);
        let dataForm = QuotationSubmitHandle.setupDataSubmit(_form, 1);
        let indicators_data_setup = IndicatorControl.loadIndicator(dataForm, datasDetail);
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
        QuotationDataTableHandle.$tableInvoice.DataTable().rows().every(function () {
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

        let is_sale_order = false;
        if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
            is_sale_order = true;
        }
        let quotation_products_data = 'quotation_products_data';
        let quotation_costs_data = 'quotation_costs_data';
        let quotation_expenses_data = 'quotation_expenses_data';
        let quotation_logistic_data = 'quotation_logistic_data';
        if (is_sale_order === true) {
            quotation_products_data = 'sale_order_products_data';
            quotation_costs_data = 'sale_order_costs_data';
            quotation_expenses_data = 'sale_order_expenses_data';
            quotation_logistic_data = 'sale_order_logistic_data';

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
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.customerSelectEle, QuotationLoadDataHandle.customerSelectEle.val());
            if (dataSelected) {
                _form.dataForm['customer_data'] = dataSelected;
            }
        }
        if (QuotationLoadDataHandle.contactSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.contactSelectEle, QuotationLoadDataHandle.contactSelectEle.val());
            if (dataSelected) {
                _form.dataForm['contact_data'] = dataSelected;
            }
        }
        _form.dataForm['payment_term_data'] = {};
        if (QuotationLoadDataHandle.paymentSelectEle.val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(QuotationLoadDataHandle.paymentSelectEle, QuotationLoadDataHandle.paymentSelectEle.val());
            if (dataSelected) {
                _form.dataForm['payment_term_data'] = dataSelected;
            }
        }
        if (type === 0 && QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'post') {
            if (!QuotationLoadDataHandle.customerSelectEle.val()) {
                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-required-customer')}, 'failure');
                return false;
            }
            if (!QuotationLoadDataHandle.contactSelectEle.val()) {
                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-required-contact')}, 'failure');
                return false;
            }
        }
        let quotation_products_data_setup = QuotationSubmitHandle.setupDataProduct();
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
                if (type === 1) {
                    let dataExchange = MaskMoney2.setupSubmitCurrencyExchange();
                    if (dataExchange?.['is_currency_exchange'] === true) {
                        _form.dataForm['total_product_revenue_before_tax'] = _form.dataForm['total_product_revenue_before_tax'] * parseFloat(dataExchange?.['currency_exchange_rate'] || 1);
                    }
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
        _form.dataForm[quotation_costs_data] = QuotationSubmitHandle.setupDataCost();
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
        _form.dataForm[quotation_expenses_data] = QuotationSubmitHandle.setupDataExpense();
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
        // payment stage
        if (is_sale_order === true) {
            _form.dataForm['sale_order_payment_stage'] = QuotationSubmitHandle.setupDataPaymentStage();
            _form.dataForm['sale_order_invoice'] = QuotationSubmitHandle.setupDataInvoice();
        }
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

        // date created
        let $dateCreatedEle = $('#quotation-create-date-created');
        if ($dateCreatedEle.length > 0) {
            if ($dateCreatedEle.val()) {
                _form.dataForm['date_created'] = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD hh:mm:ss', $dateCreatedEle.val());
            }
        }

        // valid until
        let $validUntilEle = $('#quotation-create-valid-until');
        if ( _form.dataForm.hasOwnProperty('valid_until')) {
            delete _form.dataForm['valid_until'];
        }
        if ($validUntilEle.length > 0) {
            if ($validUntilEle.val()) {
                _form.dataForm['valid_until'] = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD hh:mm:ss', $validUntilEle.val());
            }
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
                $.fn.notifyB({description: QuotationLoadDataHandle.transEle.attr('data-paid-in-full')}, 'failure');
                return false;
            }
        }
    }
    return true;
}