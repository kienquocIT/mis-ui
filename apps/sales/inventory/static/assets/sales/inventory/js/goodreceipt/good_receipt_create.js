$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_good_receipt_create');
        // Elements
        let btnEdit = $('#btn-edit-product-good-receipt');
        let btnAdd = $('#btn-confirm-add-product');
        let btnLot = $('#btn-manage-by-lot');
        let btnSerial = $('#btn-manage-by-serial');
        let btnNoLotSerial = $('#btn-no-manage-by-lot-serial');
        let btnAddLot = $('#btn-add-manage-lot');

        // Load init
        if (formSubmit.attr('data-method') === 'POST') {
            GRLoadDataHandle.loadBoxType();
            GRLoadDataHandle.loadBoxPO();
            GRLoadDataHandle.loadBoxSupplier();
            GRDataTableHandle.dataTableGoodReceiptPOProduct();
            GRDataTableHandle.dataTableGoodReceiptPR();
            GRDataTableHandle.dataTableGoodReceiptWH();
            GRDataTableHandle.dataTableGoodReceiptWHLot();
            GRDataTableHandle.dataTableGoodReceiptWHSerial();
            GRDataTableHandle.dataTableGoodReceiptLineDetail();
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

        GRLoadDataHandle.typeSelectEle.on('change', function() {
           for (let eleArea of formSubmit[0].querySelectorAll('.custom-area')) {
               eleArea.setAttribute('hidden', 'true');
           }
           let idAreaShow = 'custom-area-' +  String(GRLoadDataHandle.typeSelectEle.val());
           document.getElementById(idAreaShow).removeAttribute('hidden');
        });

        // Action on change dropdown PO
        GRLoadDataHandle.POSelectEle.on('change', function () {
            GRLoadDataHandle.loadMoreInformation($(this));
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(GRLoadDataHandle.POSelectEle, $(this).val());
                // load supplier
                GRLoadDataHandle.supplierSelectEle.empty();
                GRLoadDataHandle.loadBoxSupplier(dataSelected.supplier);
                // load PR
                GRLoadDataHandle.loadDataShowPR(dataSelected.purchase_requests_data);
            }
            btnEdit.click();
        });

        // Action on change dropdown supplier
        GRLoadDataHandle.supplierSelectEle.on('change', function () {
            GRLoadDataHandle.loadMoreInformation($(this));
        });

        btnEdit.on('click', function() {
            GRLoadDataHandle.loadModalProduct();
        });

        btnAdd.on('click', function() {
            GRLoadDataHandle.loadLineDetail();
        });

        GRDataTableHandle.tablePOProduct.on('click', '.table-row-checkbox', function () {
            let dataRow = JSON.parse($(this).attr('data-row'));
            let is_checked = false;
            if (this.checked === true) {
                is_checked = true;
            }
            for (let eleCheck of GRDataTableHandle.tablePOProduct[0].querySelectorAll('.table-row-checkbox')) {
                eleCheck.checked = false;
                let row = eleCheck.closest('tr');
                $(row).css('background-color', '#fff');
            }
            //
            GRStoreDataHandle.storeDataPR();
            let row = this.closest('tr');
            GRDataTableHandle.tablePR.DataTable().clear().draw();
            if (is_checked === true) {
                this.checked = true;
                if (dataRow?.['purchase_request_products_data'].length > 0) {
                    GRDataTableHandle.tablePR.DataTable().rows.add(dataRow?.['purchase_request_products_data']).draw();
                    $('#scroll-table-pr')[0].removeAttribute('hidden');
                }
                $(row).css('background-color', '#ebfcf5');
            } else {
                $(row).css('background-color', '#fff');
            }
        });

        GRDataTableHandle.tablePR.on('click', '.table-row-checkbox', function () {
            // let dataRow = JSON.parse($(this).attr('data-row'));
            let is_checked = false;
            if (this.checked === true) {
                is_checked = true;
            }
            for (let eleCheck of GRDataTableHandle.tablePR[0].querySelectorAll('.table-row-checkbox')) {
                eleCheck.checked = false;
                let row = eleCheck.closest('tr');
                $(row).css('background-color', '');
            }
            //
            GRStoreDataHandle.storeDataWH();
            let row = this.closest('tr');
            GRDataTableHandle.tableWH.DataTable().clear().draw();
            if (is_checked === true) {
                this.checked = true;
                GRLoadDataHandle.loadModalWareHouse(JSON.parse(this.getAttribute('data-row')));
                $(row).css('background-color', '#ebfcf5');
            } else {
                $(row).css('background-color', '');
            }
        });

        GRDataTableHandle.tableWH.on('change', '.table-row-import', function () {
            GRLoadDataHandle.loadQuantityImport();
        });

        btnLot.on('click',  function() {
            GRLoadDataHandle.loadAreaLotSerial(true, false);
        });

        btnSerial.on('click',  function() {
            GRLoadDataHandle.loadAreaLotSerial(false, true);
        });

        btnNoLotSerial.on('click', function() {
            for (let eleImport of GRDataTableHandle.tableWH[0].querySelectorAll('.table-row-import')) {
                eleImport.value = '0';
                eleImport.removeAttribute('disabled');
            }
            GRDataTableHandle.tableLot.DataTable().clear().draw();
            GRDataTableHandle.tableSerial.DataTable().clear().draw();
            $('#scroll-table-lot-serial')[0].setAttribute('hidden', 'true');
            $('#btn-lot-serial-area')[0].removeAttribute('hidden');
        });

        GRDataTableHandle.tableLineDetail.on('change', '.table-row-price, .table-row-tax', function() {
            let row = this.closest('tr');
            GRCalculateHandle.calculateMain(GRDataTableHandle.tableLineDetail, row);
        });

        // Action on click button collapse
        $('#info-collapse').click(function () {
            $(this).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        btnAddLot.on('click', function() {
            if (GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')) {
                GRLoadDataHandle.loadNewRowLot();
            } else {
                $.fn.notifyB({description: $.fn.transEle.attr('data-validate-manage-lot')}, 'failure');
                return false
            }
        });

        GRDataTableHandle.tableLot.on('change', '.table-row-import', function() {
            GRLoadDataHandle.loadQuantityImport();
        });



    });
});
