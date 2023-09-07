$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_good_receipt_create');
        // Elements
        let btnEdit = $('#btn-edit-product-good-receipt');
        let tablePOProduct = $('#datable-good-receipt-po-product');
        let tablePR = $('#datable-good-receipt-purchase-request');
        let tableWH = $('#datable-good-receipt-warehouse');
        // Load init
        if (formSubmit.attr('data-method') === 'POST') {
            GRLoadDataHandle.loadBoxType();
            GRLoadDataHandle.loadBoxPO();
            GRLoadDataHandle.loadBoxSupplier();
            GRDataTableHandle.dataTableGoodReceiptProduct();
            GRDataTableHandle.dataTableGoodReceiptPOProduct();
            GRDataTableHandle.dataTableGoodReceiptPR();
            GRDataTableHandle.dataTableGoodReceiptWH();
            // PODataTableHandle.dataTablePurchaseRequestProduct();
            // PODataTableHandle.dataTablePurchaseRequestProductMerge();
            // PODataTableHandle.dataTablePurchaseQuotation();
            // PODataTableHandle.dataTablePurchaseOrderProductAdd();
            // PODataTableHandle.dataTablePurchaseOrderProductRequest();
        }

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
            // load supplier by po
            if ($(this).val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(GRLoadDataHandle.POSelectEle, $(this).val());
                GRLoadDataHandle.supplierSelectEle.empty();
                GRLoadDataHandle.loadBoxSupplier(dataSelected.supplier);
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

        tablePOProduct.on('click', '.table-row-checkbox', function () {
            let dataRow = JSON.parse($(this).attr('data-row'));
            let is_checked = false;
            if (this.checked === true) {
                is_checked = true;
            }
            for (let eleCheck of tablePOProduct[0].querySelectorAll('.table-row-checkbox')) {
                eleCheck.checked = false;
                if (is_checked === true) {
                    this.checked = true;
                }
            }
            tablePR.DataTable().clear().draw();
            if (is_checked === true) {
                if (dataRow?.['purchase_request_products_data'].length > 0) {
                    tablePR.DataTable().rows.add(dataRow?.['purchase_request_products_data']).draw();
                    $('#scroll-table-pr')[0].removeAttribute('hidden');
                } else {

                }
            }
        });

        tablePR.on('click', '.table-row-checkbox', function () {
            // let dataRow = JSON.parse($(this).attr('data-row'));
            let is_checked = false;
            if (this.checked === true) {
                is_checked = true;
            }
            for (let eleCheck of tablePR[0].querySelectorAll('.table-row-checkbox')) {
                eleCheck.checked = false;
                if (is_checked === true) {
                    this.checked = true;
                }
            }
            tableWH.DataTable().clear().draw();
            if (is_checked === true) {
                GRLoadDataHandle.loadModalWareHouse();
            }
        });

        tableWH.on('change', '.table-row-import', function() {
            let valueWH = parseFloat(this.value);
            let valueImport = parseFloat(tablePR[0].querySelector('.table-row-checkbox:checked').closest('tr').querySelector('.table-row-import').innerHTML);
            let valueOrder = parseFloat(tablePR[0].querySelector('.table-row-checkbox:checked').closest('tr').querySelector('.table-row-quantity').innerHTML);
            let value = valueImport + valueWH;

            if (value <= valueOrder) {
                tablePR[0].querySelector('.table-row-checkbox:checked').closest('tr').querySelector('.table-row-import').innerHTML = String(value);
                tablePOProduct[0].querySelector('.table-row-checkbox:checked').closest('tr').querySelector('.table-row-import').innerHTML = String(value);
            } else {
                $.fn.notifyB({description: $.fn.transEle.attr('data-validate-import')}, 'failure');
                return false
            }
        });

    });
});
