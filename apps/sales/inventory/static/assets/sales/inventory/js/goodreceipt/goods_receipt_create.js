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

        GRLoadDataHandle.typeSelectEle.on('change', function () {
            for (let eleArea of formSubmit[0].querySelectorAll('.custom-area')) {
                eleArea.setAttribute('hidden', 'true');
            }
            let idAreaShow = 'custom-area-' + String(GRLoadDataHandle.typeSelectEle.val());
            document.getElementById(idAreaShow).removeAttribute('hidden');
            if (idAreaShow !== 'custom-area-1') {
                btnEdit[0].setAttribute('hidden', 'true');
                btnAdd[0].removeAttribute('hidden');
            }
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
            GRStoreDataHandle.storeDataLot();
            GRStoreDataHandle.storeDataSerial();
            GRStoreDataHandle.storeDataWH();
            let row = this.closest('tr');
            GRDataTableHandle.tableLot.DataTable().clear().draw();
            GRDataTableHandle.tableSerial.DataTable().clear().draw();
            $('#scroll-table-lot-serial')[0].setAttribute('hidden', 'true');
            GRDataTableHandle.tableWH.DataTable().clear().draw();
            if (is_checked === true) {
                this.checked = true;
                GRLoadDataHandle.loadModalWareHouse(JSON.parse(this.getAttribute('data-row')));
                $(row).css('background-color', '#ebfcf5');
            } else {
                $(row).css('background-color', '');
            }
        });

        GRDataTableHandle.tableWH.on('click', '.table-row-checkbox', function () {
            let is_checked = false;
            if (this.checked === true) {
                is_checked = true;
            }
            for (let eleCheck of GRDataTableHandle.tableWH[0].querySelectorAll('.table-row-checkbox')) {
                eleCheck.checked = false;
                let row = eleCheck.closest('tr');
                $(row).css('background-color', '');
            }
            GRStoreDataHandle.storeDataLot();
            GRStoreDataHandle.storeDataSerial();
            let row = this.closest('tr');
            GRDataTableHandle.tableLot.DataTable().clear().draw();
            GRDataTableHandle.tableSerial.DataTable().clear().draw();
            if (is_checked === true) {
                this.checked = true;
                GRLoadDataHandle.loadNewRowsLotOrNewRowsSerial();
                $(row).css('background-color', '#ebfcf5');
            } else {
                $(row).css('background-color', '');
            }
        });

        GRDataTableHandle.tableWH.on('change', '.table-row-import', function () {
            GRLoadDataHandle.loadQuantityImport();
        });

        // btnLot.on('click', function () {
        //     if (GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')) {
        //         GRLoadDataHandle.loadAreaLotSerial(true, false);
        //     } else {
        //         $.fn.notifyB({description: $.fn.transEle.attr('data-validate-manage-lot')}, 'failure');
        //         return false
        //     }
        // });

        // btnSerial.on('click', function () {
        //     if (GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')) {
        //         GRLoadDataHandle.loadAreaLotSerial(false, true);
        //     } else {
        //         $.fn.notifyB({description: $.fn.transEle.attr('data-validate-manage-lot')}, 'failure');
        //         return false
        //     }
        // });

        // btnNoLotSerial.on('click', function () {
        //     for (let eleImport of GRDataTableHandle.tableWH[0].querySelectorAll('.table-row-import')) {
        //         eleImport.value = '0';
        //         eleImport.removeAttribute('disabled');
        //     }
        //     GRDataTableHandle.tableLot.DataTable().clear().draw();
        //     GRDataTableHandle.tableSerial.DataTable().clear().draw();
        //     for (let i = 0; i < GRDataTableHandle.tableWH[0].tBodies[0].rows.length; i++) {
        //         let row = GRDataTableHandle.tableWH[0].tBodies[0].rows[i];
        //         let dataWHCheckedRaw = row.querySelector('.table-row-checkbox').getAttribute('data-row');
        //         if (dataWHCheckedRaw) {
        //             let dataWHChecked = JSON.parse(dataWHCheckedRaw);
        //             let keyToDelete = ['lot_data', 'serial_data'];
        //             for (let key in dataWHChecked) {
        //                 if (dataWHChecked.hasOwnProperty(key) && keyToDelete.includes(key)) {
        //                     delete dataWHChecked[key];
        //                 }
        //             }
        //             row.querySelector('.table-row-checkbox').setAttribute('data-row', JSON.stringify(dataWHChecked));
        //         }
        //     }
        //     $('#scroll-table-lot-serial')[0].setAttribute('hidden', 'true');
        //     $('#btn-lot-serial-area')[0].removeAttribute('hidden');
        // });

        btnAddLot.on('click', function () {
            if (GRDataTableHandle.tableWH[0].querySelector('.table-row-checkbox:checked')) {
                GRLoadDataHandle.loadAddRowLot();
            } else {
                $.fn.notifyB({description: $.fn.transEle.attr('data-validate-manage-lot')}, 'failure');
                return false
            }
        });

        GRDataTableHandle.tableLot.on('change', '.table-row-import', function () {
            GRLoadDataHandle.loadQuantityImport();
        });

        GRDataTableHandle.tableSerial.on('change', '.table-row-serial-number', function () {
            GRLoadDataHandle.loadQuantityImport();
        });

        GRDataTableHandle.tableLineDetail.on('change', '.table-row-price, .table-row-tax', function () {
            let row = this.closest('tr');
            GRCalculateHandle.calculateMain(GRDataTableHandle.tableLineDetail, row);
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

// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            GRSubmitHandle.setupDataSubmit(_form);
            let submitFields = [
                'title',
                'purchase_order',
                'supplier',
                'purchase_requests',
                'remarks',
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
