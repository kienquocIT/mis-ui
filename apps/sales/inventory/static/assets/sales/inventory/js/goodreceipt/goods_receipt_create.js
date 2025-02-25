$(function () {

    $(document).ready(function () {

        // Elements Case PO
        let btnConfirmAdd = $('#btn-confirm-add-product');

        // Load init
        if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() === 'post') {
            GRLoadDataHandle.loadInitS2(GRLoadDataHandle.typeSelectEle, GRLoadDataHandle.dataTypeGr);
            GRLoadDataHandle.loadCustomAreaByType();
        }

        // run datetimepicker
        $('.date-picker').each(function () {
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
            });
            $(this).val('').trigger('change');
        });

        // file
        if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() === 'post') {
            new $x.cls.file($('#attachment')).init({
                name: 'attachment',
                enable_edit: true,
            });
        }

        // collapse
        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        // workflow init
        WFRTControl.setWFInitialData("goodsreceipt");

        GRLoadDataHandle.typeSelectEle.on('change', function () {
            GRLoadDataHandle.loadCustomAreaByType();
        });

        // Action on change dropdown PO
        GRLoadDataHandle.POSelectEle.on('change', function () {
            GRLoadDataHandle.loadChangePO($(this));
            GRLoadDataHandle.loadClearModal();
            GRLoadDataHandle.loadCallAjaxProduct();
            $('#btn-edit-product-good-receipt').click();
        });

        btnConfirmAdd.on('click', function () {
            GRStoreDataHandle.storeDataProduct();
            GRLoadDataHandle.loadLineDetail();
        });

        GRDataTableHandle.tablePOProduct.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckPOProduct(this);
        });

        GRDataTableHandle.tablePOProduct.on('change', '.table-row-import', function () {
            let row = this.closest('tr');
            if (row) {
                let remainEle = row.querySelector('.table-row-gr-remain');
                if (remainEle) {
                    if (remainEle.innerHTML) {
                        let remain = parseFloat(remainEle.innerHTML);
                        let valid_import = GRValidateHandle.validateImportProductNotInventory(this, remain);
                        let checkEle = row?.querySelector('.table-row-checkbox');
                        if (checkEle) {
                            checkEle.checked = valid_import;
                        }
                    }
                }

            }
        });

        GRLoadDataHandle.$isNoWHEle.on('click', function () {
            let checked = this.checked;

            GRDataTableHandle.tablePR.DataTable().rows().every(function () {
                let row = this.node();
                let importEle = row.querySelector('.table-row-checkbox');
                if (importEle) {
                    importEle.setAttribute('readonly', 'true');
                }
            });
            GRDataTableHandle.tablePOProduct.DataTable().rows().every(function () {
                let row = this.node();
                let importEle = row.querySelector('.table-row-checkbox');
                if (importEle) {
                    importEle.setAttribute('readonly', 'true');
                }
                let checkedPOEle = row.querySelector('.table-row-checkbox:checked');
                if (checkedPOEle) {
                    let rowChecked = checkedPOEle.closest('tr');
                    let rowIndex = GRDataTableHandle.tablePOProduct.DataTable().row(rowChecked).index();
                    let $row = GRDataTableHandle.tablePOProduct.DataTable().row(rowIndex);
                    let dataRow = $row.data();
                    if (dataRow?.['pr_products_data'].length > 0) {
                        if (checked === true) {
                            GRDataTableHandle.tablePR.DataTable().rows().every(function () {
                                let row = this.node();
                                let importEle = row.querySelector('.table-row-checkbox');
                                if (importEle) {
                                    importEle.removeAttribute('readonly');
                                }
                            });
                        }
                    } else {

                    }
                }
            });


            if (checked === true) {
                GRLoadDataHandle.$scrollWarehouse[0].setAttribute('hidden', 'true');
                GRLoadDataHandle.$scrollLot[0].setAttribute('hidden', 'true');
                GRLoadDataHandle.$scrollSerial[0].setAttribute('hidden', 'true');
            }
            if (checked === false) {
                GRLoadDataHandle.$scrollWarehouse[0].removeAttribute('hidden');
            }

        });

        GRDataTableHandle.tableWH.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckWH(this);
        });

        GRDataTableHandle.tableWH.on('change', '.table-row-import', function () {
            if (this.closest('tr').querySelector('.table-row-checkbox').checked === false) {
                $(this.closest('tr').querySelector('.table-row-checkbox')).click();
            }
            let result = GRLoadDataHandle.loadQuantityImport();
            if (result === false) {
                this.value = 0;
                GRLoadDataHandle.loadQuantityImport();
            }
            GRStoreDataHandle.storeDataProduct();
        });

        GRDataTableHandle.tableWH.on('click', '.table-row-checkbox-additional', function () {
            GRLoadDataHandle.loadCheckIsAdditional(this);
        });

        GRLoadDataHandle.btnAddLot.on('click', function () {
            GRLoadDataHandle.loadAddRowLot();
        });

        GRDataTableHandle.tableLot.on('click', '.dropdown-item-lot', function () {
            let row = this.closest('tr');
            GRLoadDataHandle.loadUnCheckLotDDItem(row);
            GRLoadDataHandle.loadCheckLotDDItem(this, row);
        });

        GRDataTableHandle.tableLot.on('change', '.table-row-lot-number', function () {
            GRLoadDataHandle.loadCheckApplyLot(this);
        });

        GRDataTableHandle.tableLot.on('change', '.table-row-import', function () {
            let result = GRLoadDataHandle.loadQuantityImport();
            if (result === false) {
                let rowIndex = GRDataTableHandle.tableLot.DataTable().row(this.closest('tr')).index();
                let row = GRDataTableHandle.tableLot.DataTable().row(rowIndex);
                row.remove().draw();
                GRLoadDataHandle.loadQuantityImport();
            }
            GRStoreDataHandle.storeDataProduct();
        });

        GRDataTableHandle.tableLot.on('change', '.date-picker', function () {
            let row = this.closest('tr');
            GRLoadDataHandle.loadDataIfChangeDateLotRow(row);
            GRStoreDataHandle.storeDataProduct();
        });

        GRLoadDataHandle.btnAddSerial.on('click', function () {
            GRLoadDataHandle.loadAddRowSerial();
        });

        GRDataTableHandle.tableSerial.on('change', '.table-row-serial-number', function () {
            GRLoadDataHandle.loadCheckApplySerial(this);
        });

        GRDataTableHandle.tableSerial.on('change', '.date-picker', function () {
            GRStoreDataHandle.storeDataProduct();
        });

        GRDataTableHandle.tableLineDetailPO.on('change', '.table-row-price, .table-row-tax', function () {
            let row = this.closest('tr');
            GRCalculateHandle.calculateMain(GRDataTableHandle.tableLineDetailPO, row);
        });

        GRDataTableHandle.tableLineDetailPO.on('click', '.del-row', function () {
            deleteRowGR(this.closest('tr'), GRDataTableHandle.tableLineDetailPO);
            reOrderRowTable(GRDataTableHandle.tableLineDetailPO);
            GRCalculateHandle.calculateTable(GRDataTableHandle.tableLineDetailPO);
        });

        GRDataTableHandle.tableLot.on('click', '.del-row', function () {
            deleteRowGR(this.closest('tr'), GRDataTableHandle.tableLot);
        });

        GRDataTableHandle.tableSerial.on('click', '.del-row', function () {
            deleteRowGR(this.closest('tr'), GRDataTableHandle.tableSerial);
        });

        $('#productCanvas').on('change', '.validated-number', function () {
            GRValidateHandle.validateNumber(this);
        });

        $('#productIAModalCenter').on('change', '.validated-number', function () {
            GRValidateHandle.validateNumber(this);
        });

        // IA BEGIN
        GRLoadDataHandle.IASelectEle.on('change', function () {
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(GRLoadDataHandle.IASelectEle, $(this).val());
                for (let dataIAProduct of dataSelected?.['gr_products_data']) {
                    if (dataIAProduct?.['product_data']?.['general_traceability_method'] !== 0) {
                        dataIAProduct['quantity_import'] = 0;
                    }
                }
                GRDataTableHandle.tablePOProduct.DataTable().clear().draw();
                GRDataTableHandle.tablePOProduct.DataTable().rows.add(dataSelected?.['gr_products_data']).draw();
            }
            $('#btn-edit-product-good-receipt').click();
        });

        // PRODUCTION BEGIN
        GRLoadDataHandle.$boxTypeReport.on('change', function () {
           GRLoadDataHandle.loadCustomAreaReportByType();
        });

        GRLoadDataHandle.$boxProductionOrder.on('change', function () {
            GRLoadDataHandle.loadChangeProductionWorkOrder();
        });

        GRLoadDataHandle.$boxWorkOrder.on('change', function () {
            GRLoadDataHandle.loadChangeProductionWorkOrder();
        });

        GRLoadDataHandle.$btnSR.on('click', function () {
            let listData = [];
            for (let eleCheck of GRDataTableHandle.tableProductionReport[0].querySelectorAll('.table-row-checkbox:checked')) {
                if (eleCheck.getAttribute('data-row')) {
                    listData.push(JSON.parse(eleCheck.getAttribute('data-row')));
                }
            }
            GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxProductionReport, listData);
            GRLoadDataHandle.$boxProductionReport.change();
        });

        GRLoadDataHandle.$boxProductionReport.on('change', function () {
            if (GRLoadDataHandle.$boxProductionReport.val() && GRLoadDataHandle.$boxProductionReport.val().length > 0) {
                let dataProduction = GRLoadDataHandle.loadSetupProduction();
                if (dataProduction?.['product_data']) {
                    GRDataTableHandle.tablePOProduct.DataTable().clear().draw();
                    GRDataTableHandle.tablePOProduct.DataTable().rows.add([dataProduction]).draw();
                }
            }
            $('#btn-edit-product-good-receipt').click();
        });

// SUBMIT FORM
        SetupFormSubmit.validate(GRLoadDataHandle.$form, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

        function submitHandlerFunc() {
            let _form = new SetupFormSubmit(GRLoadDataHandle.$form);
            let result = GRSubmitHandle.setupDataSubmit(_form);
            if (result === false) {
                return false;
            }
            let submitFields = [
                'goods_receipt_type',
                'title',
                'purchase_order_id',
                'purchase_order_data',
                'inventory_adjustment_id',
                'inventory_adjustment_data',
                'production_report_type',
                'production_order_id',
                'production_order_data',
                'work_order_id',
                'work_order_data',
                'supplier_id',
                'supplier_data',
                'purchase_requests',
                'production_reports_data',
                'remarks',
                'date_received',
                // tab product
                'gr_products_data',
                // total
                'total_pretax',
                'total_tax',
                'total',
                'total_revenue_before_tax',
                // attachment
                'attachment',
                // abstract
                'system_status',
                'next_node_collab_id',
                'is_change',
                'document_root_id',
                'document_change_order',
            ]
            if (_form.dataForm) {
                filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        }


    });
});
