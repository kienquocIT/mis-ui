$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_good_receipt_create');
        // Elements Case PO
        let btnEdit = $('#btn-edit-product-good-receipt');
        let btnConfirmAdd = $('#btn-confirm-add-product');

        // Load init
        if (formSubmit.attr('data-method') === 'POST') {
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
        if (formSubmit.attr('data-method').toLowerCase() === 'post') {
            new $x.cls.file($('#attachment')).init({
                name: 'attachment',
                enable_edit: true,
            });
        }

        // collapse
        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        GRLoadDataHandle.typeSelectEle.on('change', function () {
            GRLoadDataHandle.loadCustomAreaByType();
        });

        // Action on change dropdown PO
        GRLoadDataHandle.POSelectEle.on('change', function () {
            GRLoadDataHandle.loadChangePO($(this));
            GRLoadDataHandle.loadClearModal();
            GRLoadDataHandle.loadCallAjaxProduct();
            btnEdit.click();
        });

        btnConfirmAdd.on('click', function () {
            GRStoreDataHandle.storeDataProduct();
            GRLoadDataHandle.loadLineDetail();
        });

        GRDataTableHandle.tablePOProduct.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckPOProduct(this);
        });

        GRDataTableHandle.tablePOProduct.on('change', '.table-row-import', function () {
            let remain = parseFloat(this.closest('tr').querySelector('.table-row-gr-remain').innerHTML);
            let valid_import = GRValidateHandle.validateImportProductNotInventory(this, remain);
            let eleCheck = this?.closest('tr')?.querySelector('.table-row-checkbox');
            if (eleCheck) {
                eleCheck.checked = valid_import;
            }
        });

        GRDataTableHandle.tablePR.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckPR();
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
            GRStoreDataHandle.storeDataProduct();
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

        GRDataTableHandle.tableLot.on('change', '.table-row-expire-date, .table-row-manufacture-date', function () {
            let row = this.closest('tr');
            GRLoadDataHandle.loadDataIfChangeDateLotRow(row);
        });

        GRLoadDataHandle.btnAddSerial.on('click', function () {
            GRLoadDataHandle.loadAddRowSerial();
        });

        GRDataTableHandle.tableSerial.on('change', '.table-row-serial-number', function () {
            GRLoadDataHandle.loadCheckApplySerial(this);
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

        $('#productModalCenter').on('change', '.validated-number', function () {
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
            btnEdit.click();
        });

        // PRODUCTION BEGIN
        GRLoadDataHandle.$boxProductionOrder.on('change', function () {
            GRLoadDataHandle.loadClearModal();
            if (GRLoadDataHandle.$boxProductionOrder.val()) {
                let data = SelectDDControl.get_data_from_idx(GRLoadDataHandle.$boxProductionOrder, GRLoadDataHandle.$boxProductionOrder.val());
                GRLoadDataHandle.$boxProductionReport.removeAttr('disabled');
                GRLoadDataHandle.loadInitS2(GRLoadDataHandle.$boxProductionReport, [], {'production_order_id': data?.['id']});
            }
        });

        GRLoadDataHandle.$boxProductionReport.on('change', function () {
            if (GRLoadDataHandle.$boxProductionReport.val() && GRLoadDataHandle.$boxProductionReport.val().length > 0) {
                let dataProduction = GRLoadDataHandle.loadSetupProduction();
                if (dataProduction?.['product_data']) {
                    GRDataTableHandle.tablePOProduct.DataTable().clear().draw();
                    GRDataTableHandle.tablePOProduct.DataTable().rows.add([dataProduction]).draw();
                }
            }
            btnEdit.click();
        });

// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            GRSubmitHandle.setupDataSubmit(_form);
            let submitFields = [
                'goods_receipt_type',
                'title',
                'purchase_order_id',
                'purchase_order_data',
                'inventory_adjustment_id',
                'inventory_adjustment_data',
                'production_order_id',
                'production_order_data',
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
        });


    });
});
