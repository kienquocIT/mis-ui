$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_production_report');
        ProdReportLoadDataHandle.loadInitPage();

        ProdReportLoadDataHandle.$boxType.on('change', function () {
            ProdReportLoadDataHandle.loadCustomAreaByType();
        });

        ProdReportLoadDataHandle.$boxProductionOrder.on('change', function () {
            ProdReportLoadDataHandle.loadChangeProductionWorkOrder();
        });

        ProdReportLoadDataHandle.$boxWorkOrder.on('change', function () {
            ProdReportLoadDataHandle.loadChangeProductionWorkOrder();
        });

        ProdReportDataTableHandle.$tableMain.on('change', '.table-row-labor-actual, .table-row-quantity-actual', function () {
            let row = this.closest('tr');
           ProdReportStoreHandle.storeRow(row);
        });

// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            let result = ProdReportSubmitHandle.setupDataSubmit(_form);
            if (result === false) {
                return false;
            }
            let submitFields = [
                'title',
                'production_report_type',
                'production_order_id',
                'production_order_data',
                'work_order_id',
                'work_order_data',
                'product_id',
                'product_data',
                'quantity',
                'uom_id',
                'uom_data',
                'warehouse_id',
                'warehouse_data',
                'quantity_finished',
                'quantity_ng',
                'task_data',
                'gr_remain_quantity',
            ]
            if (_form.dataForm) {
                ProdReportCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
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
                    if (data && (data['status'] === 201 || data['status'] === 200)) {
                        $.fn.notifyB({description: data.message}, 'success');
                        setTimeout(() => {
                            window.location.replace(_form.dataUrlRedirect);
                        }, 3000);
                    }
                }, (err) => {
                    setTimeout(() => {
                        WindowControl.hideLoading();
                    }, 1000)
                    $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                }
            )
        });



    });
});
