$(function () {

    $(document).ready(function () {
        let $form = $('#frm_lease_create');

        // call ajax get info lease detail
        $.fn.callAjax2({
            url: $form.data('url'),
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

                    // prepare for copy quotation to sale order
                    if (!$form.hasClass('sale-order')) { // QUOTATION PAGES
                        $('#data-copy-quotation-detail').val(JSON.stringify(data));
                    }

                    // init workflow
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                    // get WF initial zones for change
                    let appCode = 'leaseorder';
                    WFRTControl.setWFInitialData(appCode);

                    // init diagram
                    if ($form[0].classList.contains('sale-order')) {
                        DiagramControl.setBtnDiagram('leaseorder.leaseorder');
                    }

                    // init delivery button
                    if (data?.['delivery_call'] === false) $('#btnDeliverySaleOrder').removeClass('hidden');
                    else $('#btnDeliverySaleOrder').addClass('hidden');

                    // init print
                    // if ($form.attr('data-method').toLowerCase() === 'get') {
                    //     new PrintTinymceControl().render('b9650500-aba7-44e3-b6e0-2542622702a3', data, false);
                    // }
                }
            }
        )
        // mask money
        $.fn.initMaskMoney2();

    });
});
