$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_production_order');
        ProdOrderLoadDataHandle.loadInitPage();

        // WFRTControl.setWFInitialData('productionorder', formSubmit.attr('data-method'));

        ProdOrderLoadDataHandle.$boxProd.on('change', function () {
            ProdOrderLoadDataHandle.loadBOM();
            let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxProd, ProdOrderLoadDataHandle.$boxProd.val());
            if (data) {
                data['unit_of_measure'] = data?.['purchase_information']?.['uom'];
                data['uom_group'] = data?.['general_information']?.['uom_group'];
                // load UOM
                if (data?.['unit_of_measure'] && data?.['uom_group']?.['id']) {
                    ProdOrderLoadDataHandle.loadInitS2(ProdOrderLoadDataHandle.$boxUOM, [data?.['unit_of_measure']], {'group': data?.['uom_group']?.['id']});
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
        });

        ProdOrderDataTableHandle.$tableMain.on('change', '.table-row-warehouse', function () {
            let row = this.closest('tr');
            ProdOrderLoadDataHandle.loadChangeWH(row);
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
        });


// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            ContractSubmitHandle.setupDataSubmit(_form);
            let submitFields = []
            if (_form.dataForm) {
                ContractCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        });



    });
});
