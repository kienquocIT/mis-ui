$(function () {

    $(document).ready(function () {

        // Elements
        let divCopyOption = $('#copy-quotation-option');
        let modalShipping = $('#quotation-create-modal-shipping-body');
        let modalBilling = $('#quotation-create-modal-billing-body');
        let $quotationTabs = $('#quotation-tabs');

        // Load inits
        LeaseOrderLoadDataHandle.loadInitConfigLease();
        LeaseOrderLoadDataHandle.loadInitInherit();
        LeaseOrderLoadDataHandle.loadBoxQuotationCustomer();
        FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.contactSelectEle);
        FormElementControl.loadInitS2(LeaseOrderLoadDataHandle.paymentSelectEle, [], {}, null, true);
        $('#quotation-create-date-created').val(DateTimeControl.getCurrentDate("DMY", "/"));
        // LeaseOrderLoadDataHandle.loadEventRadio(LeaseOrderLoadDataHandle.$depreciationModal);
        // init dataTable
        LeaseOrderDataTableHandle.dataTableProduct();
        LeaseOrderDataTableHandle.dataTableCost();
        LeaseOrderDataTableHandle.dataTableDepreciationDetail();
        LeaseOrderDataTableHandle.dataTableExpense();
        LeaseOrderDataTableHandle.dataTablePaymentStage();
        LeaseOrderDataTableHandle.dataTableInvoice();
        LeaseOrderDataTableHandle.dataTableSelectTerm();
        LeaseOrderDataTableHandle.dataTableSelectInvoice();
        LeaseOrderDataTableHandle.dataTableSelectReconcile();
        LeaseOrderDataTableHandle.dataTableSelectProduct();
        LeaseOrderDataTableHandle.dataTableSelectOffset();
        LeaseOrderDataTableHandle.dataTableSelectTool();
        LeaseOrderDataTableHandle.dataTableSelectAsset();
        // init config
        LeaseOrderLoadDataHandle.loadInitQuotationConfig(LeaseOrderLoadDataHandle.$form.attr('data-method'));
        // date picker
        $('.flat-picker').each(function () {
            DateTimeControl.initFlatPickrDate(this);
        });
        // attachment
        if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() === 'post') {
            new $x.cls.file($('#attachment')).init({
                name: 'attachment',
                enable_edit: true,
            });
        }

        // get WF initial zones
        WFRTControl.setWFInitialData('leaseorder');

        LeaseOrderLoadDataHandle.opportunitySelectEle.on('change', function () {
            let dataSelected = SelectDDControl.get_data_from_idx(LeaseOrderLoadDataHandle.opportunitySelectEle, LeaseOrderLoadDataHandle.opportunitySelectEle.val());
            if (dataSelected) {
                LeaseOrderLoadDataHandle.loadDataByOpportunity(dataSelected);
            }
        });

        LeaseOrderLoadDataHandle.customerSelectEle.on('change', function () {
            LeaseOrderLoadDataHandle.loadDataByCustomer();
        });

        LeaseOrderLoadDataHandle.salePersonSelectEle.on('change', function () {
            LeaseOrderLoadDataHandle.loadDataBySalePerson();
        });

        LeaseOrderLoadDataHandle.paymentSelectEle.on('click', function () {
            LeaseOrderLoadDataHandle.loadBoxQuotationPaymentTerm();
        });

        LeaseOrderLoadDataHandle.paymentSelectEle.on('change', function () {
            LeaseOrderLoadDataHandle.loadChangePaymentTerm();
            $('#btn-load-payment-stage')[0].setAttribute('hidden', 'true');
            $('#btn-add-payment-stage')[0].setAttribute('hidden', 'true');
            if (!LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
                $('#btn-add-payment-stage')[0].removeAttribute('hidden');
            }
            if (LeaseOrderLoadDataHandle.paymentSelectEle.val()) {
                $('#btn-load-payment-stage')[0].removeAttribute('hidden');
            }
        });

// PRODUCT
        $quotationTabs.on('click', '.tab-detail', function () {
            LeaseOrderStoreDataHandle.storeDtbData(1);
            LeaseOrderStoreDataHandle.storeDtbData(2);
            LeaseOrderStoreDataHandle.storeDtbData(3);
            LeaseOrderStoreDataHandle.storeDtbData(4);
            LeaseOrderStoreDataHandle.storeDtbData(5);
        });

        LeaseOrderDataTableHandle.$tableSProduct.on('click', '.table-row-checkbox', function () {
            LeaseOrderLoadDataHandle.loadStoreCheckProduct(this);
        });

        LeaseOrderLoadDataHandle.$btnSaveSelectProduct.on('click', function () {
            LeaseOrderStoreDataHandle.storeDtbData(1);
            LeaseOrderLoadDataHandle.loadNewProduct();
        });

        LeaseOrderDataTableHandle.$tableSOffset.on('click', '.table-row-checkbox', function () {
            LeaseOrderLoadDataHandle.loadStoreCheckOffset(this);
        });

        LeaseOrderDataTableHandle.$tableSOffset.on('change', '.table-row-quantity', function () {
            if ($(this).val()) {
                let row = this.closest('tr');
                if (row) {
                    let checkELe = row.querySelector('.table-row-checkbox');
                    if (checkELe) {
                        if ($(this).val() > 0) {
                            checkELe.checked = true;
                        }
                        if ($(this).val() <= 0) {
                            checkELe.checked = false;
                        }
                    }
                }
                LeaseOrderLoadDataHandle.loadStoreCheckOffset(this);
            }
        });

        LeaseOrderLoadDataHandle.$btnSaveSelectOffset.on('click', function () {
            LeaseOrderLoadDataHandle.loadOffset(this);
            LeaseOrderStoreDataHandle.storeDtbData(1);
        });

        LeaseOrderDataTableHandle.$tableSTool.on('click', '.table-row-checkbox', function () {
            LeaseOrderLoadDataHandle.loadStoreCheckTool(this);
        });

        LeaseOrderDataTableHandle.$tableSTool.on('change', '.table-row-quantity', function () {
            if ($(this).val()) {
                let lease = parseFloat($(this).val());
                let row = this.closest('tr');
                if (row) {
                    let availableEle = row.querySelector('.table-row-available');
                    if (availableEle) {
                        if (availableEle.innerHTML) {
                            let available = parseFloat(availableEle.innerHTML);
                            if (lease > available) {
                                $(this).val(0);
                                $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-exceed-quantity')}, 'failure');
                                return false;
                            }
                        }
                    }
                    let checkELe = row.querySelector('.table-row-checkbox');
                    if (checkELe) {
                        if ($(this).val() > 0) {
                            checkELe.checked = true;
                        }
                        if ($(this).val() <= 0) {
                            checkELe.checked = false;
                        }
                    }
                }
                LeaseOrderLoadDataHandle.loadStoreCheckTool(this);
            }
        });

        LeaseOrderLoadDataHandle.$btnSaveSelectTool.on('click', function () {
            LeaseOrderLoadDataHandle.loadTool(this);
            LeaseOrderStoreDataHandle.storeDtbData(1);
        });

        LeaseOrderDataTableHandle.$tableSAsset.on('click', '.table-row-checkbox', function () {
            LeaseOrderLoadDataHandle.loadStoreCheckAsset(this);
        });

        LeaseOrderLoadDataHandle.$btnSaveSelectAsset.on('click', function () {
            LeaseOrderLoadDataHandle.loadAsset(this);
            LeaseOrderStoreDataHandle.storeDtbData(1);
        });

        // QUICK PRODUCT
        $('#addQuickProduct').on('shown.bs.modal', function () {
            let $boxPType = $('#add-product-type');
            let $boxPCategory = $('#add-product-category');
            let $boxPUomGr = $('#add-product-uom-group');
            let $boxPUom = $('#add-product-uom');
            let $boxPTax = $('#add-product-tax');
            let $boxPMethod = $('#add-product-method');
            let dataMethod = [
                {'id': 0, 'title': 'None'},
                {'id': 1, 'title': 'Batch/Lot number'},
                {'id': 2, 'title': 'Serial number'},
            ];
            let $modal = $(this);
            FormElementControl.loadInitS2($boxPType, [], {'is_default': true}, $modal);
            FormElementControl.loadInitS2($boxPCategory, [], {}, $modal);
            FormElementControl.loadInitS2($boxPUomGr, [], {}, $modal);
            FormElementControl.loadInitS2($boxPUom, [], {}, $modal);
            FormElementControl.loadInitS2($boxPTax, [], {}, $modal);
            FormElementControl.loadInitS2($boxPMethod, dataMethod, {}, $modal);
        });

        $('#add-product-uom-group').on('change', function () {
            let $boxPUom = $('#add-product-uom');
            let $modal = $('#addQuickProduct');
            FormElementControl.loadInitS2($boxPUom, [], {'group': $(this).val()}, $modal);
        });

        $('#btn-save-product').on('click', function () {
            let dataSubmit = {};
            dataSubmit['title'] = $('#add-product-title').val();
            dataSubmit['code'] = $('#add-product-code').val();
            dataSubmit['description'] = $('#add-product-remark').val();
            dataSubmit['product_types_mapped_list'] = $('#add-product-type').val();
            dataSubmit['general_product_category'] = $('#add-product-category').val();
            dataSubmit['general_uom_group'] = $('#add-product-uom-group').val();
            dataSubmit['sale_default_uom'] = $('#add-product-uom').val();
            dataSubmit['sale_tax'] = $('#add-product-tax').val();
            dataSubmit['general_traceability_method'] = parseInt($('#add-product-method').val());
            dataSubmit['product_choice'] = [0];
            for (let choice of $('#quick-product-choice')[0].querySelectorAll('.form-check-input:checked')) {
                dataSubmit['product_choice'].push(parseInt(choice.value));
            }
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': LeaseOrderLoadDataHandle.urlEle.attr('data-url-quick-product'),
                    'method': 'POST',
                    'data': dataSubmit,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        LeaseOrderLoadDataHandle.loadModalSProduct();
                        $('#selectProductModal').offcanvas('show');
                        setTimeout(() => {
                            WindowControl.hideLoading();
                        }, 1000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        });

        LeaseOrderDataTableHandle.$tableProduct.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow(this.closest('tr'), LeaseOrderDataTableHandle.$tableProduct);
            // Re order
            reOrderSTT(LeaseOrderDataTableHandle.$tableProduct);
            // Delete all promotion rows
            deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, false, true);
            // ReCalculate Total
            LeaseOrderCalculateCaseHandle.updateTotal(LeaseOrderDataTableHandle.$tableProduct[0]);
            // load again table cost
            LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
            LeaseOrderStoreDataHandle.storeDtbData(1);
        });

        LeaseOrderDataTableHandle.$tableProduct.on('click', '.btn-select-price', function () {
            if (this.closest('tr')) {
                if (this.closest('tr').querySelector('.table-row-item')) {
                    LeaseOrderLoadDataHandle.loadPriceProduct(this.closest('tr').querySelector('.table-row-item'));
                }
            }
         });

        LeaseOrderLoadDataHandle.$btnSavePrice.on('click', function () {
            let modalBody = LeaseOrderLoadDataHandle.$priceModal[0].querySelector('.modal-body');
            if (modalBody) {
                let productTarget = modalBody.querySelector('.product-target');
                let priceChecked = modalBody.querySelector('.table-row-price-option:checked');
                if (productTarget && priceChecked) {
                    let product = LeaseOrderDataTableHandle.$tableProduct[0].querySelector(`.table-row-item[data-product-id="${productTarget.getAttribute('data-product-id')}"]`);
                    if (product) {
                        let row = product.closest('tr');
                        if (priceChecked.getAttribute('data-value') && priceChecked.getAttribute('data-price') && row.querySelector('.table-row-uom')) {
                            let priceVal = priceChecked.getAttribute('data-value');
                            let eleUOM = row.querySelector('.table-row-uom');
                            let dataPrice = JSON.parse(priceChecked.getAttribute('data-price'));
                            if (dataPrice?.['uom']?.['id'] !== $(eleUOM).val()) {
                                $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-valid-price-uom')}, 'failure');
                                return false;
                            }
                            let priceEle = row.querySelector('.table-row-price');
                            if (priceEle) {
                                $(priceEle).attr('value', String(priceVal));
                                $.fn.initMaskMoney2();
                                LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableProduct, row);
                                let priceGrEle = priceEle.closest('.input-group-price');
                                if (priceGrEle) {
                                    priceGrEle.setAttribute('data-price-id', dataPrice?.['id']);
                                }
                            }
                        }
                    }
                }
            }
        });

        LeaseOrderDataTableHandle.$tableProduct.on('change', '.table-row-item, .table-row-asset-type, .table-row-uom, .table-row-quantity, .table-row-uom-time, .table-row-quantity-time, .table-row-price, .table-row-tax', function () {
            if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                let row = this.closest('tr');
                if ($(this).hasClass('table-row-asset-type')) {
                    LeaseOrderLoadDataHandle.loadChangeAssetType(this);
                }
                if ($(this).hasClass('table-row-price')) {
                    $(this).removeClass('text-primary');
                    LeaseOrderLoadDataHandle.loadChangePaymentTerm();
                }
                if ($(this).hasClass('table-row-item') || $(this).hasClass('table-row-uom') || $(this).hasClass('table-row-quantity') || $(this).hasClass('table-row-tax')) {
                    // load again table cost
                    LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
                    if ($(this).hasClass('table-row-uom')) {
                        let modalBody = LeaseOrderLoadDataHandle.$priceModal[0].querySelector('.modal-body');
                        if (modalBody) {
                            let priceChecked = modalBody.querySelector('.table-row-price-option:checked');
                            if (priceChecked) {
                                if (priceChecked.getAttribute('data-price')) {
                                    let dataPrice = JSON.parse(priceChecked.getAttribute('data-price'));
                                    if (dataPrice?.['uom']?.['id'] !== $(this).val()) {
                                        let elePrice = row.querySelector('.table-row-price');
                                        if (elePrice) {
                                            $(elePrice).attr('value', String(0));
                                        }
                                        $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-valid-price-uom')}, 'failure');
                                    }
                                }
                            }
                        }
                    }
                    LeaseOrderLoadDataHandle.loadChangePaymentTerm();
                }
                // Delete all promotion rows
                deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, true, false);
                // Delete all shipping rows
                deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, false, true);
                // Re Calculate all data of rows & total
                LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableProduct, row);
            }
        });

        LeaseOrderDataTableHandle.$tableProduct.on('click', '.btn-select-offset', function () {
            let row = this.closest('tr');
            if (row) {
                let rowIndex = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(row).index();
                let $row = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(rowIndex);
                let dataRow = $row.data();

                let typeEle = row.querySelector('.table-row-asset-type');
                if (typeEle) {
                    if ($(typeEle).val()) {
                        if ($(typeEle).val() === '1') {
                            LeaseOrderLoadDataHandle.$btnSaveSelectOffset.attr('data-product-id', dataRow?.['product_data']?.['id']);
                            LeaseOrderLoadDataHandle.loadModalSOffset(this);
                        }
                        if ($(typeEle).val() === '2') {
                            LeaseOrderLoadDataHandle.$btnSaveSelectTool.attr('data-product-id', dataRow?.['product_data']?.['id']);
                            LeaseOrderLoadDataHandle.loadModalSTool(this);
                        }
                        if ($(typeEle).val() === '3') {
                            LeaseOrderLoadDataHandle.$btnSaveSelectAsset.attr('data-product-id', dataRow?.['product_data']?.['id']);
                            LeaseOrderLoadDataHandle.loadModalSAsset(this);
                        }
                    }
                }
            }
        });

        LeaseOrderDataTableHandle.$tableProduct.on('click', '.btn-select-quantity', function () {
            let row = this.closest('tr');
            if (row) {
                let rowIndex = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(row).index();
                let $row = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(rowIndex);
                let dataRow = $row.data();

                LeaseOrderLoadDataHandle.$btnSaveSelectQuantity.attr('data-product-id', dataRow?.['product_data']?.['id']);
            }
        });

        LeaseOrderDataTableHandle.$tableProduct.on('click', '.table-row-group', function () {
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        });

        LeaseOrderDataTableHandle.$tableProduct.on('blur', '.table-row-group-title-edit', function () {
            LeaseOrderLoadDataHandle.loadOnBlurGroupTitleEdit(this);
        });

        LeaseOrderDataTableHandle.$tableProduct.on('click', '.btn-edit-group', function () {
            LeaseOrderLoadDataHandle.loadOnClickBtnEditGroup(this);
        });

        LeaseOrderDataTableHandle.$tableProduct.on('click', '.btn-del-group', function () {
            // show product first then delete
            let row = this.closest('tr');
            let eleGroup = row.querySelector('.table-row-group');
            if (eleGroup) {
                if ($(eleGroup).attr('aria-expanded') === 'false') {
                    $(eleGroup).click();
                }
                deleteRow(this.closest('tr'), LeaseOrderDataTableHandle.$tableProduct);
                // load products to another group after del group
                LeaseOrderLoadDataHandle.loadProductAfterDelGroup(row.querySelector('.table-row-group'));
            }
        });

        $('input[type=text].quotation-create-product-discount').on('change', function () {
            // Delete all promotion rows
            deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, false, true);
            // Calculate with discount on Total
            LeaseOrderDataTableHandle.$tableProduct.DataTable().rows().every(function () {
                let row = this.node();
                LeaseOrderCalculateCaseHandle.calculate(row);
            });
            LeaseOrderCalculateCaseHandle.updateTotal(LeaseOrderDataTableHandle.$tableProduct[0])
        });

// EXPENSE
        $quotationTabs.on('click', '.tab-expense', function () {
            LeaseOrderStoreDataHandle.storeDtbData(1);
            LeaseOrderStoreDataHandle.storeDtbData(2);
            LeaseOrderStoreDataHandle.storeDtbData(3);
            LeaseOrderStoreDataHandle.storeDtbData(4);
            LeaseOrderStoreDataHandle.storeDtbData(5);
        });

        LeaseOrderDataTableHandle.$tableExpense.on('click', '.del-row', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            deleteRow(this.closest('tr'), LeaseOrderDataTableHandle.$tableExpense);
            // Re order
            reOrderSTT(LeaseOrderDataTableHandle.$tableExpense);
            LeaseOrderCalculateCaseHandle.updateTotal(LeaseOrderDataTableHandle.$tableExpense[0]);
            LeaseOrderStoreDataHandle.storeDtbData(3);
        });

        LeaseOrderDataTableHandle.$tableExpense.on('click', '.table-row-price-option', function () {
            let priceValRaw = $(this)[0].getAttribute('data-value');
            if (priceValRaw) {
                let row = $(this)[0].closest('tr');
                let elePrice = row.querySelector('.table-row-price');
                if (elePrice) {
                    $(elePrice).attr('value', String(priceValRaw));
                    $.fn.initMaskMoney2();
                    LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableExpense, row);
                }
            }
        });

        LeaseOrderDataTableHandle.$tableExpense.on('change', '.table-row-item, .table-row-labor-item, .table-row-uom, .table-row-quantity, .table-row-price, .table-row-tax', function () {
            let row = $(this)[0].closest('tr');
            if (this.classList.contains('table-row-labor-item')) {
                LeaseOrderLoadDataHandle.loadChangeLabor(this);
            }
            if (this.classList.contains('table-row-uom')) {
                if (row.querySelector('.table-row-labor-item')) {
                    let dataLabor = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-labor-item')), $(row.querySelector('.table-row-labor-item')).val());
                    let dataUOM = SelectDDControl.get_data_from_idx($(row.querySelector('.table-row-uom')), $(row.querySelector('.table-row-uom')).val());
                    if (dataLabor && dataUOM) {
                        LeaseOrderLoadDataHandle.loadPriceLabor(row, dataLabor, dataUOM?.['id']);
                    }
                }
            }
            LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableExpense, row);
        });

// COST
        $quotationTabs.on('click', '.tab-cost', function () {
            LeaseOrderStoreDataHandle.storeDtbData(1);
            LeaseOrderStoreDataHandle.storeDtbData(2);
            LeaseOrderStoreDataHandle.storeDtbData(3);
            LeaseOrderStoreDataHandle.storeDtbData(4);
            LeaseOrderStoreDataHandle.storeDtbData(5);
            if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                LeaseOrderLoadDataHandle.loadDataTableCost();
            }
        });

        LeaseOrderDataTableHandle.$tableCost.on('change', '.table-row-quantity, .table-row-price, .table-row-depreciation-time', function () {
            if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                let row = this.closest('tr');
                LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableCost, row);
                let btnDepreciationEle = row.querySelector('.btn-depreciation-detail');
                let depreciationDataEle = row.querySelector('.table-row-depreciation-data');
                let depreciationLeaseDataEle = row.querySelector('.table-row-depreciation-lease-data');
                if (btnDepreciationEle && depreciationDataEle && depreciationLeaseDataEle) {
                    $(depreciationDataEle).val("");
                    $(depreciationLeaseDataEle).val("");
                    LeaseOrderLoadDataHandle.loadShowDepreciation(btnDepreciationEle);
                    LeaseOrderLoadDataHandle.loadSaveDepreciation();
                }
                LeaseOrderStoreDataHandle.storeDtbData(2);
            }
        });

        LeaseOrderDataTableHandle.$tableCost.on('click', '.btn-select-cost', function () {
            if (this.closest('tr')) {
                if (this.closest('tr').querySelector('.table-row-item')) {
                    LeaseOrderLoadDataHandle.loadCostProduct(this.closest('tr').querySelector('.table-row-item'));
                }
            }
         });

        LeaseOrderLoadDataHandle.$btnSaveCost.on('click', function () {
            let modalBody = LeaseOrderLoadDataHandle.$costModal[0].querySelector('.modal-body');
            if (modalBody) {
                let productTarget = modalBody.querySelector('.product-target');
                let priceChecked = modalBody.querySelector('.table-row-price-option:checked');
                if (productTarget && priceChecked) {
                    let product = LeaseOrderDataTableHandle.$tableCost[0].querySelector(`.table-row-item[data-product-id="${productTarget.getAttribute('data-product-id')}"]`);
                    if (product) {
                        let priceValRaw = priceChecked.getAttribute('data-value');
                        if (priceValRaw) {
                            let row = product.closest('tr');
                            let elePrice = row.querySelector('.table-row-price');
                            if (elePrice) {
                                $(elePrice).attr('value', String(priceValRaw));
                                if (priceChecked.getAttribute('data-wh')) {
                                    $(elePrice).attr('data-wh', priceChecked.getAttribute('data-wh'));
                                    let dataWH = JSON.parse(priceChecked.getAttribute('data-wh'));
                                    let inputGrPrice = elePrice.closest('.input-group-price');
                                    if (inputGrPrice) {
                                        inputGrPrice.setAttribute('data-cost-wh-id', dataWH?.['id']);
                                    }
                                }
                                $.fn.initMaskMoney2();
                                LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableCost, row);
                            }
                        }
                    }
                }
            }
        });

        LeaseOrderDataTableHandle.$tableCost.on('click', '.btn-depreciation-detail', function () {
            LeaseOrderLoadDataHandle.loadShowDepreciation(this);
        });

        LeaseOrderLoadDataHandle.$depreciationModal.on('change', '.depreciation-method, .depreciation-start-date, .depreciation-end-date, .depreciation-adjustment, .lease-start-date, .lease-end-date, .product-convert-into', function () {
            if (this.classList.contains('depreciation-method')) {
                let $adjustEle = $('#depreciation_adjustment');
                if ($adjustEle.length > 0) {
                    $adjustEle.attr('readonly', 'true');
                    if ($(this).val() === '0') {
                        $adjustEle.val(1);
                    }
                    if ($(this).val() === '1') {
                        $adjustEle.removeAttr('readonly');
                    }
                }
            }
            if (this.classList.contains('depreciation-start-date')) {
                let $endDateEle = $('#depreciation_end_date');
                let $timeEle = $('#depreciation_time');
                if ($endDateEle.length > 0 && $timeEle.length > 0) {
                    let endDate = DepreciationControl.getEndDateDepreciation($(this).val(), parseInt($timeEle.val()));
                    $endDateEle.val(endDate).trigger('change');
                }
            }
            if (this.classList.contains('lease-start-date')) {
                let $leaseEndDateEle = $('#lease_end_date');
                let $table = LeaseOrderDataTableHandle.$tableCost;
                let target = $table[0].querySelector(`[data-product-id="${LeaseOrderLoadDataHandle.$btnSaveDepreciation.attr('data-product-id')}"]`);
                if (target) {
                    let targetRow = target.closest('tr');
                    if ($leaseEndDateEle.length > 0 && targetRow) {
                        let leaseTimeEle = targetRow.querySelector('.table-row-quantity-time');
                        if (leaseTimeEle) {
                            let endDate = DepreciationControl.getEndDateDepreciation($(this).val(), parseInt($(leaseTimeEle).val()));
                            $leaseEndDateEle.val(endDate).trigger('change');
                        }
                    }
                }
            }
            if (this.classList.contains('product-convert-into')) {
                let $methodEle = $('#depreciation_method');
                if ($methodEle.length > 0) {
                    $methodEle[0].setAttribute('readonly', 'true');
                    if ($(this).val() === "1") {
                        $methodEle.val(0).trigger('change');
                    }
                    if ($(this).val() === "2") {
                        $methodEle[0].removeAttribute('readonly');
                    }
                }
            }
            LeaseOrderLoadDataHandle.loadDataTableDepreciation();
        });

        LeaseOrderLoadDataHandle.$depreciationModal.on('click', '.btn-config-asset-tool', function () {
            LeaseOrderLoadDataHandle.loadDataConfigAssetTool();
        });

        LeaseOrderLoadDataHandle.$btnSaveDepreciation.on('click', function () {
            LeaseOrderLoadDataHandle.loadSaveDepreciation();
            LeaseOrderCalculateCaseHandle.calculateAllRowsTableCost();
            LeaseOrderStoreDataHandle.storeDtbData(2);
        });

        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        modalShipping.on('click', '.choose-shipping', function () {
            // Enable other buttons
            $('.choose-shipping').prop('disabled', false);
            // Disable the clicked button
            $(this).prop('disabled', true);
            $('#quotation-create-shipping-address')[0].value = this.getAttribute('data-address');
            $('#quotation-create-customer-shipping').val(this.id);
            let rowShipping = LeaseOrderDataTableHandle.$tableProduct[0].querySelector('.table-row-shipping');
            if (rowShipping) {
                // Delete all promotion rows
                deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, true, false);
                // Delete all shipping rows
                deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, false, true);
                // ReCalculate Total
                LeaseOrderCalculateCaseHandle.updateTotal(LeaseOrderDataTableHandle.$tableProduct[0]);
            }
        });

        modalBilling.on('click', '.choose-billing', function () {
            // Enable other buttons
            $('.choose-billing').prop('disabled', false);
            // Disable the clicked button
            $(this).prop('disabled', true);
            $('#quotation-create-billing-address')[0].value = this.getAttribute('data-address');
            $('#quotation-create-customer-billing').val(this.id);
        });

// COPY FROM - TO
// Action on click button copy quotation on sale order page + restart all status of all element of modal
        $('#btn-copy-quotation').on('click', function () {
            let type = $(this)[0].getAttribute('data-copy-type');
            $(divCopyOption[0].querySelector('.check-option')).prop('checked', true);
            LeaseOrderDataTableHandle.$tableQuotationCopyProduct[0].setAttribute('hidden', true);
            if (type === 'copy-from') {
                // restart all status of all element of modal
                $('#btn-select-quotation-copy')[0].removeAttribute('hidden');
                $('#btn-quotation-copy-confirm')[0].setAttribute('hidden', true);
                LeaseOrderDataTableHandle.$tableQuotationCopy[0].removeAttribute('hidden');
                divCopyOption[0].setAttribute('hidden', true);
                // load table quotation list for copy
                LeaseOrderLoadDataHandle.loadTableCopyQuotation();
            } else if (type === 'copy-to') {
                // load data product for table datable-copy-quotation-product
                let dataCopy = JSON.parse($('#data-copy-quotation-detail')[0].value);
                LeaseOrderDataTableHandle.$tableQuotationCopyProduct.DataTable().destroy();
                // Filter all data is not Promotion from quotation_products_data
                let finalList = filterDataProductNotPromotion(dataCopy.quotation_products_data);
                LeaseOrderDataTableHandle.dataTableCopyQuotationProduct(finalList);
            }
        });

        LeaseOrderDataTableHandle.$tableQuotationCopy.on('click', '.table-row-check', function () {
            LeaseOrderDataTableHandle.$tableQuotationCopy.find('.table-row-check').prop('checked', false);
            $(this).prop('checked', true);
            LeaseOrderLoadDataHandle.loadAPIDetailQuotation($(this)[0].getAttribute('data-id'));
        });

        $('#btn-select-quotation-copy').on('click', function() {
            LeaseOrderDataTableHandle.$tableQuotationCopy[0].setAttribute('hidden', true);
            LeaseOrderDataTableHandle.$tableQuotationCopy.DataTable().clear().draw();
            LeaseOrderDataTableHandle.$tableQuotationCopy.empty();
            LeaseOrderDataTableHandle.$tableQuotationCopy.DataTable().destroy();
            $('#copy-quotation-option')[0].removeAttribute('hidden');
            // load data product for table datable-copy-quotation-product
            let dataCopy = JSON.parse($('#data-copy-quotation-detail')[0].value);
            LeaseOrderDataTableHandle.$tableQuotationCopyProduct.DataTable().destroy();
            // Filter all data is not Promotion from quotation_products_data
            let finalList = filterDataProductNotPromotion(dataCopy.quotation_products_data);
            LeaseOrderDataTableHandle.dataTableCopyQuotationProduct(finalList);

            $('#btn-select-quotation-copy')[0].setAttribute('hidden', true);
            $('#btn-quotation-copy-confirm')[0].removeAttribute('hidden')
        });

        divCopyOption.on('change', '.check-option', function() {
            if ($(this)[0].checked === false) {
                LeaseOrderDataTableHandle.$tableQuotationCopyProduct[0].removeAttribute('hidden');
            } else {
                LeaseOrderDataTableHandle.$tableQuotationCopyProduct[0].setAttribute('hidden', true);
            }
        });

        $('#btn-quotation-copy-confirm').on('click', function () {
            LeaseOrderLoadDataHandle.loadSetupCopy(this);
        });

        function prepareDataCopyTo() {
            let eleDataCopy = $('#data-init-quotation-copy-to');
            if (eleDataCopy) {
                if (eleDataCopy.val()) {
                    let dataRaw = JSON.parse(eleDataCopy.val());
                    LeaseOrderLoadDataHandle.loadAPIDetailQuotation(dataRaw?.['id']);
                    checkElementValuesBeforeLoadDataCopy();
                }
            }
        }
        prepareDataCopyTo();

        function loadDataCopyTo(dataCopy) {
            let eleDataCopy = $('#data-init-quotation-copy-to');
            if (eleDataCopy) {
                if (eleDataCopy.val()) {
                    let dataRaw = JSON.parse(eleDataCopy.val());
                    if (dataRaw?.['option'] === 'custom') { // if option copy is custom then setup data products & costs for load
                        let products = dataRaw?.['products'];
                        let result = [];
                        let order = 0;
                        for (let idx = 0; idx < products.length; idx++) {
                            let checkedID = products[idx]?.['id'];
                            let checkedQuantity = products[idx]?.['quantity'];
                            for (let i = 0; i < dataCopy?.['lease_products_data'].length; i++) {
                                let data = dataCopy?.['lease_products_data'][i];
                                if (data?.['product']?.['id'] === checkedID) {
                                    data['product_quantity'] = parseFloat(checkedQuantity);
                                    order++
                                    data['order'] = order;
                                    result.push(data);
                                    break
                                }
                            }
                        }
                        dataCopy['lease_products_data'] = result;
                        dataCopy['lease_costs_data'] = [];
                    }
                    LeaseOrderLoadDataHandle.loadCopyData(dataCopy);
                }
            }
        }

        function checkElementValuesBeforeLoadDataCopy() {
            let element0 = $('#data-copy-quotation-detail').val();
            if (element0) {
                loadDataCopyTo(JSON.parse(element0));  // call loadDataCopyTo() if all condition pass
            } else {
                setTimeout(checkElementValuesBeforeLoadDataCopy, 1000);  // call again after 1s if condition not pass yet
            }
        }

        LeaseOrderLoadDataHandle.loadInitOpportunity();
        LeaseOrderLoadDataHandle.loadRecurrenceData();

// PROMOTION
// Action on click button Check Available Promotion (show list promotions)
        $('#btn-check-promotion').on('click', function () {
            LeaseOrderPromotionHandle.callPromotion(0);
        });

        LeaseOrderDataTableHandle.$tablePromotion.on('click', '.apply-promotion', function () {
            $(this).prop('disabled', true);
            deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, true, false);
            // ReCalculate Total
            LeaseOrderCalculateCaseHandle.updateTotal(LeaseOrderDataTableHandle.$tableProduct[0]);
            // get promotion condition to apply
            let promotionData = JSON.parse($(this)[0].getAttribute('data-promotion'));
            let promotionParse = LeaseOrderPromotionHandle.getPromotionResult(promotionData);
            let TotalOrder = LeaseOrderDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-order').length;
            let TotalGroup = LeaseOrderDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-group').length;
            let order = (TotalOrder - TotalGroup) + 1;
            let dataAdd = {
                "tax": {},
                "order": order,
                "product": {},
                "product_code": promotionParse?.['product_code'],
                "product_title": promotionParse?.['product_title'],
                "unit_of_measure": {},
                "product_quantity": promotionParse?.['product_quantity'],
                "product_uom_code": "",
                "product_tax_title": "",
                "product_tax_value": 0,
                "product_uom_title": "",
                "product_tax_amount": 0,
                "product_unit_price": promotionParse?.['product_price'],
                "product_description": promotionParse?.['product_description'],
                "product_discount_value": 0,
                "product_subtotal_price": 0,
                "product_discount_amount": 0,
                "is_promotion": true,
                "promotion_id": promotionParse?.['id'],
                "promotion_data": promotionParse,
                "is_shipping": false,
                "shipping": {},
            };
            if (promotionParse?.['is_discount'] === true) { // DISCOUNT
                if (promotionParse?.['row_apply_index'] !== null) { // on product
                    let newRow = LeaseOrderDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    let afterRow = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(promotionParse?.['row_apply_index']).node();
                    $(newRow).detach().insertAfter(afterRow);
                    LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableProduct, newRow);
                    LeaseOrderLoadDataHandle.loadRowDisabled(newRow);
                } else { // on whole order
                    let newRow = LeaseOrderDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    LeaseOrderCalculateCaseHandle.commonCalculate(LeaseOrderDataTableHandle.$tableProduct, newRow);
                    if (promotionParse.hasOwnProperty('discount_rate_on_order')) {
                        if (promotionParse.discount_rate_on_order !== null) {
                            if (promotionParse.is_before_tax === true) {
                                LeaseOrderPromotionHandle.calculatePromotion(LeaseOrderDataTableHandle.$tableProduct, promotionParse?.['discount_rate_on_order'], promotionParse?.['product_price']);
                            } else {
                                LeaseOrderPromotionHandle.calculatePromotion(LeaseOrderDataTableHandle.$tableProduct, promotionParse?.['discount_rate_on_order'], promotionParse?.['product_price'], false)
                            }
                        }
                    }
                    LeaseOrderLoadDataHandle.loadRowDisabled(newRow);
                }
            } else if (promotionParse?.['is_gift'] === true) { // GIFT
                if (promotionParse?.['row_apply_index'] !== null) { // on product
                    let newRow = LeaseOrderDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
                    let afterRow = LeaseOrderDataTableHandle.$tableProduct.DataTable().row(promotionParse?.['row_apply_index']).node();
                    $(newRow).detach().insertAfter(afterRow);
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-uom')));
                    FormElementControl.loadInitS2($(newRow.querySelector('.table-row-tax')));
                    LeaseOrderLoadDataHandle.loadRowDisabled(newRow);
                } else { // on whole order
                    let newRow = LeaseOrderDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
                    LeaseOrderLoadDataHandle.loadRowDisabled(newRow);
                }
            }
            reOrderSTT(LeaseOrderDataTableHandle.$tableProduct);
        });

// SHIPPING
// Action on click button Add Shipping Fee (show list shipping)
        $('#btn-add-shipping').on('click', function() {
            LeaseOrderDataTableHandle.loadTableQuotationShipping();
        });

        LeaseOrderDataTableHandle.$tableShipping.on('click', '.apply-shipping', function () {
            $(this).prop('disabled', true);
            // Delete all promotion rows
            deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, true, false);
            // Delete all shipping rows
            deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, false, true);
            // ReCalculate Total
            LeaseOrderCalculateCaseHandle.updateTotal(LeaseOrderDataTableHandle.$tableProduct[0]);
            if (this.getAttribute('data-shipping')) {
                let dataShipping = JSON.parse(this.getAttribute('data-shipping'));
                let shippingPrice = parseFloat(dataShipping?.['shipping_price']);
                let TotalOrder = LeaseOrderDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-order').length;
                let TotalGroup = LeaseOrderDataTableHandle.$tableProduct[0].querySelectorAll('.table-row-group').length;
                let order = (TotalOrder - TotalGroup) + 1;
                let dataAdd = {
                    "order": order,
                    "product_quantity": 1,
                    "product_uom_code": "",
                    "product_tax_title": "",
                    "product_tax_value": 0,
                    "product_uom_title": "",
                    "product_tax_amount": 0,
                    "product_unit_price": shippingPrice,
                    "product_description": dataShipping?.['title'],
                    "product_discount_value": 0,
                    "product_subtotal_price": shippingPrice,
                    "product_discount_amount": 0,
                    "is_promotion": false,
                    "is_shipping": true,
                    "shipping_id": dataShipping?.['id'],
                    "shipping_data": dataShipping,
                };
                let newRow = LeaseOrderDataTableHandle.$tableProduct.DataTable().row.add(dataAdd).draw().node();
                FormElementControl.loadInitS2($(newRow.querySelector('.table-row-uom')));
                FormElementControl.loadInitS2($(newRow.querySelector('.table-row-tax')));
                // Re Calculate after add shipping (pretax, discount, total)
                LeaseOrderShippingHandle.calculateShipping(shippingPrice);
                // Load disabled
                LeaseOrderLoadDataHandle.loadRowDisabled(newRow);
                // ReOrder STT
                reOrderSTT(LeaseOrderDataTableHandle.$tableProduct);
                LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
            }
        });

// INDICATORS
        IndicatorControl.$openCanvas.on('click', function () {
            let datasDetail = LeaseOrderLoadDataHandle.loadGetDatasDetail();
            if (LeaseOrderLoadDataHandle.$form.attr('data-method').toLowerCase() !== 'get') {
                let _form = new SetupFormSubmit(LeaseOrderLoadDataHandle.$form);
                let dataForm = LeaseOrderSubmitHandle.setupDataSubmit(_form, 1);
                IndicatorControl.loadIndicator(dataForm, datasDetail);
                LeaseOrderLoadDataHandle.loadSetWFRuntimeZone();
            }
            IndicatorControl.$canvas.offcanvas('show');
        });

// PAYMENT STAGE
        $quotationTabs.on('click', '.tab-payment', function () {
            LeaseOrderStoreDataHandle.storeDtbData(1);
            LeaseOrderStoreDataHandle.storeDtbData(2);
            LeaseOrderStoreDataHandle.storeDtbData(3);
            LeaseOrderStoreDataHandle.storeDtbData(4);
            LeaseOrderStoreDataHandle.storeDtbData(5);
        });

        LeaseOrderDataTableHandle.$tableInvoice.on('click', '.btn-select-term', function () {
            LeaseOrderLoadDataHandle.loadModalSTerm(this);
        });

        LeaseOrderDataTableHandle.$tableInvoice.on('change', '.table-row-total', function () {
            let row = this.closest('tr');
            if (row) {
                let balanceEle = row.querySelector('.table-row-balance');
                if (balanceEle) {
                    $(balanceEle).attr('value', String($(this).valCurrency()));
                    $.fn.initMaskMoney2();
                }
            }
        });

        LeaseOrderDataTableHandle.$tableInvoice.on('click', '.del-row', function (e) {
            deleteRow(this.closest('tr'), LeaseOrderDataTableHandle.$tableInvoice);
            reOrderSTT(LeaseOrderDataTableHandle.$tableInvoice);
            LeaseOrderDataTableHandle.$tablePayment.DataTable().clear().draw();
            LeaseOrderStoreDataHandle.storeDtbData(5);
        });

        LeaseOrderLoadDataHandle.$btnSaveTerm.on('click', function () {
           LeaseOrderLoadDataHandle.loadSaveSTerm();
        });

        LeaseOrderDataTableHandle.$tablePayment.on('change', '.table-row-date, .table-row-installment, .table-row-ratio, .table-row-value-before-tax, .table-row-issue-invoice, .table-row-value-tax, .table-row-value-total, .table-row-due-date', function () {
            let row = this.closest('tr');
            if ($(this).hasClass('table-row-date')) {
                let isCheck = true;
                let eleDueDate = row.querySelector('.table-row-due-date');
                let eleInstallment = row.querySelector('.table-row-installment');
                if (eleDueDate && eleInstallment) {
                    if ($(this).val() && $(eleDueDate).val() && !$(eleInstallment).val()) {
                        isCheck = validateStartEndDate($(this).val(), $(eleDueDate).val());
                    }
                }
                if (isCheck === true) {
                    LeaseOrderLoadDataHandle.loadChangePSDate(this);
                } else {
                    $(this).val(null);
                    $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-validate-due-date')}, 'failure');
                    return false;
                }
            }
            if ($(this).hasClass('table-row-installment')) {
                LeaseOrderLoadDataHandle.loadChangeInstallment(this);
            }
            if ($(this).hasClass('table-row-ratio')) {
                LeaseOrderLoadDataHandle.loadPaymentValues(this);
                let valBeforeEle = row.querySelector('.table-row-value-before-tax');
                validatePSValue(valBeforeEle);
                LeaseOrderLoadDataHandle.loadMinusBalance();
            }
            if ($(this).hasClass('table-row-issue-invoice')) {
                LeaseOrderLoadDataHandle.loadChangePSIssueInvoice(this);
            }
            if ($(this).hasClass('table-row-due-date')) {
                let row = this.closest('tr');
                let eleDate = row.querySelector('.table-row-date');
                let eleTerm = row.querySelector('.table-row-term');
                if (eleDate && eleTerm) {
                    if ($(this).val() && $(eleDate).val() && !$(eleTerm).val()) {
                        let isCheck = validateStartEndDate($(eleDate).val(), $(this).val());
                        if (isCheck === false) {
                            $(this).val(null);
                            $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-validate-due-date')}, 'failure');
                            return false;
                        }
                    }
                }
            }
            if ($(this).hasClass('table-row-value-before-tax')) {
                LeaseOrderLoadDataHandle.loadPaymentValues(this);
                LeaseOrderLoadDataHandle.loadMinusBalance();
            }
            if ($(this).hasClass('table-row-value-tax')) {
                LeaseOrderLoadDataHandle.loadPaymentValues(this);
                LeaseOrderLoadDataHandle.loadMinusBalance();
            }
        });

        LeaseOrderDataTableHandle.$tablePayment.on('click', '.btn-select-invoice', function () {
            LeaseOrderLoadDataHandle.loadModalSInvoice(this);
        });

        LeaseOrderLoadDataHandle.$btnSaveInvoice.on('click', function () {
            LeaseOrderLoadDataHandle.loadSaveSInvoice();
        });

        LeaseOrderDataTableHandle.$tablePayment.on('click', '.btn-select-reconcile', function () {
            LeaseOrderLoadDataHandle.loadModalSReconcile(this);
        });

        LeaseOrderLoadDataHandle.$btnSaveReconcile.on('click', function () {
            LeaseOrderLoadDataHandle.loadSaveSReconcile();
        });

        LeaseOrderDataTableHandle.$tablePayment.on('click', '.del-row', function () {
            deleteRow(this.closest('tr'), LeaseOrderDataTableHandle.$tablePayment);
            reOrderSTT(LeaseOrderDataTableHandle.$tablePayment);
            LeaseOrderStoreDataHandle.storeDtbData(4);
        });

// IMPORT TABLE


// DELIVERY
        LeaseOrderDeliveryHandle.$btnDeliveryInfo.on('click', function () {
            if (LeaseOrderLoadDataHandle.$eleStoreDetail.val()) {
                let dataDetail = JSON.parse(LeaseOrderLoadDataHandle.$eleStoreDetail.val());
                LeaseOrderDeliveryHandle.checkOpenDeliveryInfo(dataDetail);
            }
        });

        LeaseOrderDeliveryHandle.$btnDelivery.on('click', function () {
            if (!LeaseOrderDeliveryHandle.$deliveryEstimatedDateEle.val()) {
                $.fn.notifyB({description: LeaseOrderLoadDataHandle.transEle.attr('data-required-delivery-date')}, 'failure');
                return false;
            }

            let dataDelivery = {};
            dataDelivery['estimated_delivery_date'] = moment(LeaseOrderDeliveryHandle.$deliveryEstimatedDateEle.val(), "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss");
            dataDelivery['remarks'] = LeaseOrderDeliveryHandle.$deliveryRemarkEle.val();

            WindowControl.showLoading();
            $.fn.callAjax2({
                url: LeaseOrderLoadDataHandle.urlEle.attr('data-create-delivery').replace('1', $(this).attr('data-id')),
                method: 'POST',
                data: dataDelivery,
                urlRedirect: null,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data?.['status'] === 200) {
                        const config = data?.config
                        let url_redirect = LeaseOrderLoadDataHandle.urlEle.attr('data-delivery')
                        if (config?.is_picking && !data?.['is_not_picking'])
                            url_redirect = LeaseOrderLoadDataHandle.urlEle.attr('data-picking')
                        setTimeout(() => {
                            window.location.href = url_redirect
                        }, 1000);
                    }
                },
                (errs) => {
                    WindowControl.hideLoading();
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        });




// Submit form quotation + sale order
        SetupFormSubmit.validate(LeaseOrderLoadDataHandle.$form, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
                employee_inherit_id: {
                    required: true,
                },
                customer_id: {
                    required: true,
                },
                contact_id: {
                    required: true,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

        function submitHandlerFunc() {
            if (LeaseOrderDataTableHandle.$tableProduct[0].querySelector('.table-row-promotion') && $(this).attr('data-method').toLowerCase() === "post") { // HAS PROMOTION => Check condition again
                LeaseOrderPromotionHandle.callPromotion(1);
                // Check promotion then Submit Form
                submitCheckPromotion();
            } else { // NO PROMOTION => submit normal
                // Submit Form normal
                submitForm();
            }
        }

        function submitCheckPromotion() {
            let valueCheck = $('#quotation-check-promotion').val();
            if (valueCheck) {
                if (valueCheck === 'true') {
                    submitForm();
                } else if (valueCheck === 'false') {
                    $('#btn-invalid-promotion').click();
                    return false
                }
            } else {
                setTimeout(submitCheckPromotion, 1000);  // call again after 1s if condition not pass yet
            }
        }

        function submitForm() {
            let _form = new SetupFormSubmit(LeaseOrderLoadDataHandle.$form);
            LeaseOrderLoadDataHandle.loadDataTableCost();
            let result = LeaseOrderSubmitHandle.setupDataSubmit(_form);
            if (result === false) {
                return false;
            }
            LeaseOrderSubmitHandle.setupDataIndicator(result);
            let submitFields = [
                // process
                'process',
                'process_stage_app',
                //
                'title',
                'opportunity_id',
                'customer_id',
                'customer_data',
                'contact_id',
                'contact_data',
                'employee_inherit_id',
                'payment_term_id',
                'payment_term_data',
                'quotation_id',
                'quotation_data',
                'lease_from',
                'lease_to',
                // total amount of products
                'total_product_pretax_amount',
                'total_product_discount_rate',
                'total_product_discount',
                'total_product_tax',
                'total_product',
                'total_product_revenue_before_tax',
                // total amount of costs
                'total_cost_pretax_amount',
                'total_cost_tax',
                'total_cost',
                // total amount of expenses
                'total_expense_pretax_amount',
                'total_expense_tax',
                'total_expense',
                // sale order tabs
                'lease_products_data',
                'lease_logistic_data',
                'customer_shipping',
                'customer_billing',
                'lease_costs_data',
                'lease_costs_leased_data',
                'lease_expenses_data',
                // indicator tab
                'lease_indicators_data',
                // indicators
                'indicator_revenue',
                'indicator_gross_profit',
                'indicator_net_income',
                // payment stage tab
                'lease_payment_stage',
                'lease_invoice',
                // abstract
                'system_status',
                'next_node_collab_id',
                'is_change',
                'document_root_id',
                'document_change_order',
                'is_recurrence_template',
                'is_recurring',
                'recurrence_task_id',
                'attachment',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            WFRTControl.callWFSubmitForm(_form);
        }

// WORKFLOW

        // events on btn action WF zone (depend on business rule)
        $('#btn-active-edit-zone-wf').on('click', function () {
            LeaseOrderCheckConfigHandle.checkConfig(0);
        });

        $('#btn-remove-promotion').on('click', function() {
            $('#quotation-check-promotion').val("");
            // Delete Promotion Row & ReCalculate Total
            deletePromotionRows(LeaseOrderDataTableHandle.$tableProduct, true, false);
            LeaseOrderCalculateCaseHandle.updateTotal(LeaseOrderDataTableHandle.$tableProduct[0]);
        });

        $('#btn-check-another-promotion').on('click', function() {
            $('#quotation-check-promotion').val("");
            $('#btn-check-promotion').click();
        })




    });
});
