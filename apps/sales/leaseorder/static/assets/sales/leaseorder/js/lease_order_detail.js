$(function () {

    $(document).ready(function () {
        // call ajax get info lease detail
        $.fn.callAjax2({
            url: LeaseOrderLoadDataHandle.$form.data('url'),
            method: 'GET',
            isLoading: true,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $x.fn.renderCodeBreadcrumb(data);
                    $.fn.compareStatusShowPageAction(data);
                    // store && load data detail
                    LeaseOrderLoadDataHandle.$eleStoreDetail.val(JSON.stringify(data));
                    LeaseOrderLoadDataHandle.loadDetailQuotation(data);
                    LeaseOrderLoadDataHandle.loadDataTablesAndDropDowns(data);
                    LeaseOrderIndicatorHandle.loadIndicator();

                    // init workflow
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                    // get WF initial zones for change
                    let appCode = 'leaseorder';
                    WFRTControl.setWFInitialData(appCode);

                    // init diagram
                    if (LeaseOrderLoadDataHandle.$form[0].classList.contains('sale-order')) {
                        DiagramControl.setBtnDiagram('leaseorder.leaseorder');
                    }

                    // init delivery button
                    if (data?.['delivery_call'] === false) $('#btnDeliverySaleOrder').removeClass('hidden');
                    else $('#btnDeliverySaleOrder').addClass('hidden');

                    // init print
                    // if ($form.attr('data-method').toLowerCase() === 'get') {
                    //     new PrintTinymceControl().render('010404b3-bb91-4b24-9538-075f5f00ef14', data, false);
                    // }
                }
            }
        )
        // mask money
        $.fn.initMaskMoney2();

    });
});
