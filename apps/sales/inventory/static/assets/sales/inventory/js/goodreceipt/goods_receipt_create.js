$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_good_receipt_create');
        // Elements Case PO
        let btnEdit = $('#btn-edit-product-good-receipt');
        let btnAdd = $('#btn-add-product-good-receipt');
        let btnConfirmAdd = $('#btn-confirm-add-product');
        let btnAddLot = $('#btn-add-manage-lot');
        let btnAddSerial = $('#btn-add-manage-serial');
        // Elements Case IA
        let btnIAConfirmAdd = $('#btn-confirm-add-ia-product');
        let btnIAEdit = $('#btn-edit-ia-product-good-receipt');
        let btnAddIALot = $('#btn-add-ia-lot');
        let btnAddIASerial = $('#btn-add-ia-serial');


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


            GRDataTableHandle.dataTableGoodReceiptIAProduct();
            GRDataTableHandle.dataTableGoodReceiptIAWHLot();
            GRDataTableHandle.dataTableGoodReceiptIAWHSerial();
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
            // GRLoadDataHandle.loadMoreInformation($(this));
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

        GRDataTableHandle.tablePOProduct.on('change', '.table-row-import', function () {
            let remain = parseFloat(this.closest('tr').querySelector('.table-row-gr-remain').innerHTML);
            let valid_import = GRValidateHandle.validateImportProductNotInventory(this, remain);
            let eleCheck = this?.closest('tr')?.querySelector('.table-row-checkbox');
            if (eleCheck) {
                eleCheck.checked = valid_import;
            }
        });

        GRDataTableHandle.tablePR.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckPR(this);
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
        });

        btnAddLot.on('click', function () {
            if (GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')) {
                GRLoadDataHandle.loadAddRowLot();
            } else {
                $.fn.notifyB({description: GRLoadDataHandle.transEle.attr('data-validate-no-warehouse')}, 'failure');
                return false
            }
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
        });

        GRDataTableHandle.tableLot.on('change', '.table-row-expire-date, .table-row-manufacture-date', function () {
            let row = this.closest('tr');
            GRLoadDataHandle.loadDataIfChangeDateLotRow(row);
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
            GRValidateHandle.validateSerialNumberExistRow(this);
        });

        GRDataTableHandle.tableLineDetailPO.on('change', '.table-row-price, .table-row-tax', function () {
            let row = this.closest('tr');
            GRCalculateHandle.calculateMain(GRDataTableHandle.tableLineDetailPO, row);
        });

        GRDataTableHandle.tableLineDetailPO.on('click', '.del-row', function() {
            deleteRowTable(this.closest('tr'), GRDataTableHandle.tableLineDetailPO);
        });

        // Action on click button collapse
        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
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

        // IA BEGIN
        GRLoadDataHandle.IASelectEle.on('change', function () {
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(GRLoadDataHandle.IASelectEle, $(this).val());
                GRDataTableHandle.tableIAProduct.DataTable().clear().draw();
                GRDataTableHandle.tableIAProduct.DataTable().rows.add(dataSelected?.['inventory_adjustment_product']).draw();
            }
            btnIAEdit.click();
        });

        GRDataTableHandle.tableIAProduct.on('click', '.table-row-checkbox', function () {
            GRLoadDataHandle.loadCheckIAProduct(this);
        });

        btnAddIASerial.on('click', function () {
            GRLoadDataHandle.loadAddRowIASerial();
        });

        GRDataTableHandle.tableIASerial.on('change', '.table-row-serial-number', function () {
            // validate serial exist
            GRValidateHandle.validateIASerialNumber(this);
            GRValidateHandle.validateIASerialNumberExistRow(this);
        });

        btnAddIALot.on('click', function () {
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
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': _form.dataUrl,
                    'method': _form.dataMethod,
                    'data': _form.dataForm,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success')
                        $.fn.redirectUrl(formSubmit.attr('data-url-redirect'), 1000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err.data.errors}, 'failure');
                }
            )
        });


    });
});
