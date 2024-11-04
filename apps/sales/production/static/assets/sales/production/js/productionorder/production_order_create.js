$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_production_order');
        ProdOrderLoadDataHandle.loadInitPage();

        ProdOrderLoadDataHandle.$boxType.on('change', function () {
            ProdOrderLoadDataHandle.loadBOM();
        });

        ProdOrderLoadDataHandle.$boxProd.on('change', function () {
            ProdOrderLoadDataHandle.loadBOM();
            let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxProd, ProdOrderLoadDataHandle.$boxProd.val());
            if (data) {
                let dataUOM = data?.['sale_information']?.['default_uom'];
                let dataUOMGr = data?.['general_information']?.['uom_group'];
                // load UOM
                if (dataUOM && dataUOMGr?.['id']) {
                    ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxUOM, [dataUOM], {'group': dataUOMGr?.['id']});
                }
                // check product type
                ProdOrderLoadDataHandle.$boxWH.removeAttr('readonly');
                if (data?.['general_information']?.['product_type']) {
                    for (let productType of data?.['general_information']?.['product_type']) {
                        if (productType?.['is_service'] === true) {
                            ProdOrderLoadDataHandle.$boxWH.attr('readonly', 'true');
                            break;
                        }
                    }
                }
            }
        });

        ProdOrderLoadDataHandle.$quantity.on('change', function () {
            ProdOrderLoadDataHandle.loadChangeQuantity();
            let multi = 1;
            if (ProdOrderLoadDataHandle.$quantity) {
                multi = parseInt(ProdOrderLoadDataHandle.$quantity.val());
            }
            let dataBOM = ProdOrderLoadDataHandle.loadGetDataBOM();
            if (dataBOM?.['sum_time']) {
                ProdOrderLoadDataHandle.$time.val(`${parseInt(dataBOM?.['sum_time']) * multi}`);
            }
        });

        ProdOrderLoadDataHandle.$manualDone.on('click', function () {
            ProdOrderLoadDataHandle.loadClickManualDone();
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
            ProdOrderLoadDataHandle.loadCheckAllWH(this);
        });


// SUBMIT FORM
        SetupFormSubmit.validate(formSubmit, {
            rules: {
                title: {
                    required: true,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

        function submitHandlerFunc() {
            let _form = new SetupFormSubmit(formSubmit);
            let result = ProdOrderSubmitHandle.setupDataSubmit(_form);
            if (result === false) {
                return false;
            }
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
                'sale_order_data',
                'status_production',
                'date_start',
                'date_end',
                'group_id',
                'group_data',
                'time',
                'task_data',
                'gr_remain_quantity',
            ]
            if (_form.dataForm) {
                ProdOrderCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        }


    });
});
