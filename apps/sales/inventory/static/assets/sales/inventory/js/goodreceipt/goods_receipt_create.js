$(function () {

    $(document).ready(function () {

        // Elements Case PO
        let btnConfirmAdd = $('#btn-confirm-add-product');

        // Load init
        if (GRLoadDataHandle.$form.attr('data-method').toLowerCase() === 'post') {
            FormElementControl.loadInitS2(GRLoadDataHandle.typeSelectEle, GRLoadDataHandle.dataTypeGrPost);
            GRLoadDataHandle.loadCustomAreaByType();
        }

        // run datetimepicker
        $('.date-picker').each(function () {
            DateTimeControl.initFlatPickrDate(this);
        });

        // attachment
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
            GRLoadDataHandle.loadCallAjaxPOProduct();
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
                GRStoreDataHandle.storeDataProduct();
                let check = GRLoadDataHandle.loadCheckExceedQuantity();
                if (check === false) {
                    let rowIndex = GRDataTableHandle.tablePOProduct.DataTable().row(row).index();
                    let $row = GRDataTableHandle.tablePOProduct.DataTable().row(rowIndex);
                    let rowData = $row.data();
                    rowData['quantity_import'] = 0;
                    GRDataTableHandle.tablePOProduct.DataTable().row(rowIndex).data(rowData);
                    GRStoreDataHandle.storeDataProduct();
                }
            }
        });

        GRDataTableHandle.tablePR.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckPR();
        });

        GRDataTableHandle.tablePR.on('change', '.table-row-import', function () {
            let row = this.closest('tr');
            if (row) {
                GRStoreDataHandle.storeDataProduct();
                let check = GRLoadDataHandle.loadCheckExceedQuantity();
                if (check === false) {
                    let rowIndex = GRDataTableHandle.tablePR.DataTable().row(row).index();
                    let $row = GRDataTableHandle.tablePR.DataTable().row(rowIndex);
                    let rowData = $row.data();
                    rowData['quantity_import'] = 0;
                    GRDataTableHandle.tablePR.DataTable().row(rowIndex).data(rowData);
                    GRStoreDataHandle.storeDataProduct();
                }
            }
        });

        GRLoadDataHandle.$isNoWHEle.on('click', function () {
            GRLoadDataHandle.loadCheckIsNoWH();
            GRStoreDataHandle.storeDataProduct();
        });

        GRDataTableHandle.tableWH.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckWH(this);
        });

        GRDataTableHandle.tableWH.on('change', '.table-row-import', function () {
            let row = this.closest('tr');
            if (row) {
                GRStoreDataHandle.storeDataProduct();
                let check = GRLoadDataHandle.loadCheckExceedQuantity();
                if (check === false) {
                    let rowIndex = GRDataTableHandle.tableWH.DataTable().row(row).index();
                    let $row = GRDataTableHandle.tableWH.DataTable().row(rowIndex);
                    let rowData = $row.data();
                    rowData['quantity_import'] = 0;
                    GRDataTableHandle.tableWH.DataTable().row(rowIndex).data(rowData);
                    GRStoreDataHandle.storeDataProduct();
                }
            }
        });

        GRDataTableHandle.tableWH.on('click', '.table-row-checkbox-additional', function () {
            GRLoadDataHandle.loadCheckIsAdditional(this);
        });

        GRDataTableHandle.tableLot.on('click', '.dropdown-item-lot', function () {
            let row = this.closest('tr');
            if (row) {
                GRLoadDataHandle.loadUnCheckLotDDItem(row);
                GRLoadDataHandle.loadCheckLotDDItem(this, row);
                GRStoreDataHandle.storeDataProduct();
            }
        });

        GRDataTableHandle.tableLot.on('change', '.table-row-lot-number', function () {
            GRLoadDataHandle.loadCheckApplyLot(this);
        });

        GRDataTableHandle.tableLot.on('change', '.table-row-import', function () {
            let rowCurrent = this.closest('tr');
            GRStoreDataHandle.storeDataProduct();
            let check = GRLoadDataHandle.loadCheckExceedQuantity();
            if (check === false) {
                let rowIndex = GRDataTableHandle.tableLot.DataTable().row(rowCurrent).index();
                let row = GRDataTableHandle.tableLot.DataTable().row(rowIndex);
                row.remove().draw();
                GRStoreDataHandle.storeDataProduct();
            }
            GRLoadDataHandle.loadDateDateDtbLot();
        });

        GRDataTableHandle.tableLot.on('change', '.date-picker', function () {
            let row = this.closest('tr');
            GRLoadDataHandle.loadDataIfChangeDateLotRow(row);
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
            GRStoreDataHandle.storeDataProduct();
            GRLoadDataHandle.loadDateDateDtbLot();
        });

        GRDataTableHandle.tableSerial.on('click', '.del-row', function () {
            deleteRowGR(this.closest('tr'), GRDataTableHandle.tableSerial);
            GRStoreDataHandle.storeDataProduct();
            GRLoadDataHandle.loadDateDateDtbSerial();
        });

        // Inventory Adjustment BEGIN
        GRLoadDataHandle.IASelectEle.on('change', function () {
            if ($(this).val()) {
                GRLoadDataHandle.loadCallAjaxIAProduct();
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
            FormElementControl.loadInitS2(GRLoadDataHandle.$boxProductionReport, listData);
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

        // PRODUCT MODIFICATION BEGIN
        GRLoadDataHandle.PMSelectEle.on('change', function () {
            GRLoadDataHandle.loadClearModal();
            GRLoadDataHandle.loadCallAjaxPMProduct();
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
                'product_modification_id',
                'product_modification_data',
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
                // is_no_warehouse
                'is_no_warehouse',
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
