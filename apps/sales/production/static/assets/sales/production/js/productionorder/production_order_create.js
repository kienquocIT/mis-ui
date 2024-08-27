$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_production_order');
        ProdOrderLoadDataHandle.loadInitPage();

        // WFRTControl.setWFInitialData('productionorder', formSubmit.attr('data-method'));

        ProdOrderLoadDataHandle.$boxProd.on('change', function () {
            ProdOrderLoadDataHandle.loadBOM();
            let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxProd, ProdOrderLoadDataHandle.$boxProd.val());
            if (data) {
                let dataUOM = data?.['purchase_information']?.['uom'];
                let dataUOMGr = data?.['general_information']?.['uom_group'];
                // load UOM
                if (dataUOM && dataUOMGr?.['id']) {
                    ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxUOM, [dataUOM], {'group': dataUOMGr?.['id']});
                }
            }
        });

        ProdOrderLoadDataHandle.$quantity.on('change', function () {
            ProdOrderLoadDataHandle.loadChangeQuantity();
            // ProdOrderLoadDataHandle.loadTime();

            let multi = 1;
            if (ProdOrderLoadDataHandle.$quantity) {
                multi = parseInt(ProdOrderLoadDataHandle.$quantity.val());
            }
            let dataBOM = ProdOrderLoadDataHandle.loadGetDataBOM();
            if (dataBOM?.['sum_time']) {
                ProdOrderLoadDataHandle.$time.html(`${parseInt(dataBOM?.['sum_time']) * multi}`);
            }
        });

        ProdOrderDataTableHandle.$tableMain.on('change', '.table-row-item', function () {
            let row = this.closest('tr');
            ProdOrderLoadDataHandle.loadChangeProduct(row);
            // store data
            ProdOrderStoreHandle.storeRow(row);
        });

        ProdOrderDataTableHandle.$tableMain.on('change', '.table-row-uom', function () {
            let row = this.closest('tr');
            // store data
            ProdOrderStoreHandle.storeRow(row);
        });

        ProdOrderDataTableHandle.$tableMain.on('change', '.table-row-warehouse', function () {
            let row = this.closest('tr');
            ProdOrderLoadDataHandle.loadChangeWH(row);
            // store data
            ProdOrderStoreHandle.storeRow(row);
        });

        ProdOrderDataTableHandle.$tableMain.on('change', '.check-all-wh', function () {
            let row = this.closest('tr');
            if (row.querySelector('.table-row-warehouse') && row.querySelector('.table-row-stock') && row.querySelector('.table-row-available')) {
                row.querySelector('.table-row-stock').innerHTML = 0;
                row.querySelector('.table-row-available').innerHTML = 0;
                if (this.checked === true) {
                    row.querySelector('.table-row-warehouse').setAttribute('disabled', 'true');
                    ProdOrderLoadDataHandle.loadChangeWH(row, 1);
                }
                if (this.checked === false) {
                    row.querySelector('.table-row-warehouse').removeAttribute('disabled');
                }
            }
            // store data
            ProdOrderStoreHandle.storeRow(row);
        });


// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            ProdOrderSubmitHandle.setupDataSubmit(_form);
            let submitFields = [
                'title',
                'bom_id',
                'bom_data',
                'type_production',
                'product_id',
                'product_data',
                'quantity',
                'uom_id',
                'uom_data',
                'warehouse_id',
                'warehouse_data',
                'sale_order',
                'sale_order_data',
                'status_production',
                'date_start',
                'date_end',
                'group_id',
                'group_data',
                'time',
                'task_data',
            ]
            if (_form.dataForm) {
                ProdOrderCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        });



    });
});
