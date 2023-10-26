$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_good_receipt_create');
        // Elements
        let btnEdit = $('#btn-edit-product-good-receipt');
        let btnAdd = $('#btn-add-product-good-receipt');
        let btnConfirmAdd = $('#btn-confirm-add-product');
        // let btnLot = $('#btn-manage-by-lot');
        // let btnSerial = $('#btn-manage-by-serial');
        // let btnNoLotSerial = $('#btn-no-manage-by-lot-serial');
        let btnAddLot = $('#btn-add-manage-lot');
        let btnAddSerial = $('#btn-add-manage-serial');

        // Load init
        if (formSubmit.attr('data-method') === 'POST') {
            GRLoadDataHandle.loadBoxType();
            GRLoadDataHandle.loadBoxPO();
            GRLoadDataHandle.loadBoxSupplier();
            GRLoadDataHandle.loadBoxIA();
            GRDataTableHandle.dataTableGoodReceiptPOProduct();
            GRDataTableHandle.dataTableGoodReceiptPR();
            GRDataTableHandle.dataTableGoodReceiptWH();
            GRDataTableHandle.dataTableGoodReceiptWHLot();
            GRDataTableHandle.dataTableGoodReceiptWHSerial();
            GRDataTableHandle.dataTableGoodReceiptLineDetailPO();
            GRDataTableHandle.dataTableGoodReceiptLineDetailIA();
        }

        // run datetimepicker
        $('input[type=text].date-picker').daterangepicker({
            minYear: 1901,
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY hh:mm A'
            }
        });
        // $('#good-receipt-date-created').val(null).trigger('change');

        GRLoadDataHandle.typeSelectEle.on('change', function () {
            GRLoadDataHandle.loadCustomAreaByType();
        });

        // Action on change dropdown PO
        GRLoadDataHandle.POSelectEle.on('change', function () {
            GRLoadDataHandle.loadChangePO($(this));
            btnEdit.click();
        });

        // Action on change dropdown supplier
        GRLoadDataHandle.supplierSelectEle.on('change', function () {
            GRLoadDataHandle.loadMoreInformation($(this));
        });

        btnEdit.on('click', function () {
            GRLoadDataHandle.loadModalProduct();
        });

        btnAdd.on('click', function () {
            GRLoadDataHandle.loadAddRowLineDetail();
        });

        btnConfirmAdd.on('click', function () {
            GRStoreDataHandle.storeDataAll();
            GRLoadDataHandle.loadLineDetail();
        });

        GRDataTableHandle.tablePOProduct.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckPOProduct(this);
        });

        GRDataTableHandle.tablePR.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckPR(this);
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
        });

        btnAddLot.on('click', function () {
            if (GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')) {
                GRLoadDataHandle.loadAddRowLot();
            } else {
                $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-validate-no-warehouse')}, 'failure');
                return false
            }
        });

        GRDataTableHandle.tableLot.on('change', '.table-row-lot-number', function () {
            GRValidateHandle.validateLotNumber(this);
        });

        GRDataTableHandle.tableLot.on('change', '.table-row-import', function () {
            let importResult = GRLoadDataHandle.loadQuantityImport();
            if (importResult === false) {
                this.value = '0';
                GRLoadDataHandle.loadQuantityImport();
            }
        });

        btnAddSerial.on('click', function () {
            if (GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')) {
                GRLoadDataHandle.loadAddRowSerial();
            } else {
                $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-validate-no-warehouse')}, 'failure');
                return false
            }
        });

        GRDataTableHandle.tableSerial.on('change', '.table-row-serial-number', function () {
            // validate serial exist
            GRValidateHandle.validateSerialNumber(this);
            // // update quantity import by serial
            // let importResult = GRLoadDataHandle.loadQuantityImport();
            // if (importResult === false) {
            //     // Get the index of the current row within the DataTable
            //     let rowIndex = GRDataTableHandle.tableSerial.DataTable().row(this.closest('tr')).index();
            //     let row = GRDataTableHandle.tableSerial.DataTable().row(rowIndex);
            //     // Delete current row
            //     row.remove().draw();
            //     GRLoadDataHandle.loadQuantityImport();
            // }
        });

        GRDataTableHandle.tableLineDetailPO.on('change', '.table-row-price, .table-row-tax', function () {
            let row = this.closest('tr');
            GRCalculateHandle.calculateMain(GRDataTableHandle.tableLineDetailPO, row);
        });

        GRDataTableHandle.tableLineDetailPO.on('click', '.del-row', function() {
            deleteRowTable(this.closest('tr'), GRDataTableHandle.tableLineDetailPO);
        });

        // Action on click button collapse
        $('#info-collapse').click(function () {
            $(this).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        $('#productModalCenter').on('change', '.validated-number', function () {
            let value = this.value;
            // Replace non-digit characters with an empty string
            value = value.replace(/[^0-9.]/g, '');
            // Remove unnecessary zeros from the integer part
            value = value.replace("-", "").replace(/^0+(?=\d)/, '');
            // Update value of input
            this.value = value;
        });

        GRLoadDataHandle.IASelectEle.on('change', function () {
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(GRLoadDataHandle.IASelectEle, $(this).val());
                GRDataTableHandle.tableLineDetailIA.DataTable().rows.add(dataSelected?.['inventory_adjustment_product']).draw();
                GRLoadDataHandle.loadDataRowTable(GRDataTableHandle.tableLineDetailIA);
            }
        });

        GRDataTableHandle.tableLineDetailIA.on('change', '.table-row-price', function () {
            let row = this.closest('tr');
            GRCalculateHandle.calculateMain(GRDataTableHandle.tableLineDetailIA, row);
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
                'inventory_adjustment',
                'supplier',
                'purchase_requests',
                'remarks',
                'date_received',
                // line detail
                'goods_receipt_product',
                // system
                'system_status',
            ]
            if (_form.dataForm) {
                filterFieldList(submitFields, _form.dataForm);
            }
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.message}, 'success')
                            $.fn.redirectUrl(formSubmit.attr('data-url-redirect'), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });


    });
});
