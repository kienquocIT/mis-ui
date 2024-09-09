$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_good_receipt_create');
        // Elements Case PO
        let btnEdit = $('#btn-edit-product-good-receipt');
        let btnAdd = $('#btn-add-product-good-receipt');
        let btnConfirmAdd = $('#btn-confirm-add-product');
        // Elements Case IA
        let btnIAConfirmAdd = $('#btn-confirm-add-ia-product');
        let btnIAEdit = $('#btn-edit-ia-product-good-receipt');
        let btnProductionEdit = $('#btn-edit-production-good-receipt');

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
            GRLoadDataHandle.loadClearModalAreas();
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

        GRDataTableHandle.tablePR.on('change', '.table-row-import', function () {
            for (let eleCheck of GRDataTableHandle.tablePR[0].querySelectorAll('.table-row-checkbox')) {
                eleCheck.checked = false;
            }
            let remain = parseFloat(this.closest('tr').querySelector('.table-row-gr-remain').innerHTML);
            let valid_import = GRValidateHandle.validateImportProductNotInventory(this, remain);
            let eleCheck = this?.closest('tr')?.querySelector('.table-row-checkbox');
            if (eleCheck) {
                eleCheck.checked = valid_import;
            }
            // Load quantity import
            GRLoadDataHandle.loadQuantityImport();
        });

        GRDataTableHandle.tableWH.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckWH(this);
        });

        GRDataTableHandle.tableWH.on('change', '.table-row-import', function () {
            if (this.closest('tr').querySelector('.table-row-checkbox').checked === false) {
                $(this.closest('tr').querySelector('.table-row-checkbox')).click();
            }
            let importResult = GRLoadDataHandle.loadQuantityImport();
            if (importResult === false) {
                this.value =  '0';
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
            let row = this.closest('tr');
            // validate lot exist
            GRValidateHandle.validateLotNumber(this);
            GRValidateHandle.validateLotNumberExistRow(this);
            //
            let is_checked = GRLoadDataHandle.loadUnCheckLotDDItem(row);
            if (this.value === '') {
                row.querySelector('.table-row-import').value = '0';
                GRLoadDataHandle.loadQuantityImport();
            }
            if (is_checked === true) {
                row.querySelector('.table-row-expire-date').value = '';
                row.querySelector('.table-row-manufacture-date').value = '';
            }
        });

        GRDataTableHandle.tableLot.on('change', '.table-row-import', function () {
            let importResult = GRLoadDataHandle.loadQuantityImport();
            if (importResult === false) {
                this.value = '0';
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
            // validate serial exist
            GRValidateHandle.validateSerialNumber(this);
            GRValidateHandle.validateSerialNumberExistRow(this);
            let importResult = GRLoadDataHandle.loadQuantityImport();
            if (importResult === false) {
                this.value = '0';
                GRLoadDataHandle.loadQuantityImport();
            }
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

        GRDataTableHandle.tableIAProduct.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckIAProduct(this);
        });

        GRDataTableHandle.tableIAProduct.on('click', '.table-row-checkbox-additional', function () {
            GRLoadDataHandle.loadCheckIAIsAdditional(this);
        });

        GRLoadDataHandle.btnAddIASerial.on('click', function () {
            GRLoadDataHandle.loadAddRowIASerial();
        });

        GRDataTableHandle.tableIASerial.on('change', '.table-row-serial-number', function () {
            // validate serial exist
            GRValidateHandle.validateIASerialNumber(this);
            GRValidateHandle.validateIASerialNumberExistRow(this);
        });

        GRLoadDataHandle.btnAddIALot.on('click', function () {
            GRLoadDataHandle.loadAddRowIALot();
        });

        GRDataTableHandle.tableIALot.on('click', '.dropdown-item-lot', function () {
            let row = this.closest('tr');
            GRLoadDataHandle.loadUnCheckLotDDItem(row);
            GRLoadDataHandle.loadCheckLotDDItem(this, row);
        });

        GRDataTableHandle.tableIALot.on('change', '.table-row-lot-number', function () {
            let row = this.closest('tr');
            // validate lot exist
            GRValidateHandle.validateIALotNumber(this);
            GRValidateHandle.validateIALotNumberExistRow(this);
            //
            let is_checked = GRLoadDataHandle.loadUnCheckLotDDItem(row);
            if (this.value === '') {
                row.querySelector('.table-row-import').value = '0';
                GRLoadDataHandle.loadIAQuantityImport();
            }
            if (is_checked === true) {
                row.querySelector('.table-row-expire-date').value = '';
                row.querySelector('.table-row-manufacture-date').value = '';
            }
        });

        GRDataTableHandle.tableIALot.on('change', '.table-row-import', function () {
            let importResult = GRLoadDataHandle.loadIAQuantityImport();
            if (importResult === false) {
                this.value = '0';
                GRLoadDataHandle.loadIAQuantityImport();
            }
        });

        GRDataTableHandle.tableIALot.on('change', '.table-row-expire-date, .table-row-manufacture-date', function () {
            let row = this.closest('tr');
            GRLoadDataHandle.loadDataIfChangeDateLotRow(row);
        });

        btnIAConfirmAdd.on('click', function () {
            GRStoreDataHandle.storeIADataAll();
            GRLoadDataHandle.loadIALineDetail();
        });

        GRDataTableHandle.tableLineDetailIA.on('change', '.table-row-price', function () {
            let row = this.closest('tr');
            GRCalculateHandle.calculateMain(GRDataTableHandle.tableLineDetailIA, row);
        });

        // PRODUCTION BEGIN
        GRLoadDataHandle.$boxProduction.on('change', function () {
            if (GRLoadDataHandle.$boxProduction.val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(GRLoadDataHandle.$boxProduction, GRLoadDataHandle.$boxProduction.val());
                let data = [{
                    'product': dataSelected?.['product_data'],
                    'uom_order_actual': dataSelected?.['uom_data'],
                    'product_quantity_order_actual': dataSelected?.['quantity'],
                }]
                GRDataTableHandle.tableProductionProduct.DataTable().clear().draw();
                GRDataTableHandle.tableProductionProduct.DataTable().rows.add(data).draw();

                GRLoadDataHandle.loadCheckProductionProduct();
            }
            btnProductionEdit.click();
        });

// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            GRSubmitHandle.setupDataSubmit(_form);
            let submitFields = [
                'goods_receipt_type',
                'title',
                'purchase_order',
                'purchase_order_data',
                'inventory_adjustment',
                'inventory_adjustment_data',
                'supplier',
                'supplier_data',
                'purchase_requests',
                'remarks',
                'date_received',
                // tab product
                'gr_products_data',
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
