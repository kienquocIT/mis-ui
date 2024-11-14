$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_create');
        let eleDataDetail = $('#quotation-detail-data');

        // call ajax get info quotation detail
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
                    eleDataDetail.val(JSON.stringify(data));
                    QuotationLoadDataHandle.loadDetailQuotation(data);
                    QuotationLoadDataHandle.loadDataTablesAndDropDowns(data);
                    indicatorHandle.loadIndicator();

                    // prepare for copy quotation to sale order
                    if (!$form.hasClass('sale-order')) { // QUOTATION PAGES
                        $('#data-copy-quotation-detail').val(JSON.stringify(data));
                    }
                    if ($form.attr('data-method').toLowerCase() === 'put') {
                        // Check config when begin edit
                        QuotationCheckConfigHandle.checkConfig(0);
                    }

                    // init workflow
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                    // get WF initial zones for change
                    let appCode = 'quotation';
                    if ($form[0].classList.contains('sale-order')) {
                        appCode = 'saleorder';
                    }
                    WFRTControl.setWFInitialData(appCode);

                    // init diagram
                    if ($form[0].classList.contains('sale-order')) {
                        DiagramControl.setBtnDiagram('saleorder.saleorder');
                    }

                    // init delivery button
                    if (data?.['delivery_call'] === false) $('#btnDeliverySaleOrder').removeClass('hidden');
                    else $('#btnDeliverySaleOrder').addClass('hidden');

                    // init print
                    if ($form.attr('data-method').toLowerCase() === 'get') {
                        if ($form[0].classList.contains('sale-order')) {  // sale order
                            new PrintTinymceControl().render('a870e392-9ad2-4fe2-9baa-298a38691cf2', data, false);
                        } else {  // quotation
                            new PrintTinymceControl().render('b9650500-aba7-44e3-b6e0-2542622702a3', data, false);
                        }
                    }

                    //
                    const processData = data?.['process'] || {};
                    const oppData = data?.['opportunity'] || {};
                    const inheritData = data?.['employee_inherit'] || {};
                    new $x.cls.bastionField({
                        has_opp: true,
                        has_inherit: true,
                        has_process: true,
                        data_process: processData && Object.keys(processData).length > 0 ? [
                            {
                               ...processData,
                               'selected': true,
                            }
                        ] : [],
                        data_opp: oppData && Object.keys(oppData).length > 0 ? [
                            {
                                ...oppData,
                                'selected': true,
                            }
                        ] : [],
                        data_inherit: inheritData && Object.keys(inheritData).length > 0 ? [
                            {
                                ...inheritData,
                                'selected': true,
                            }
                        ] : [],
                    }).init();
                }
            }
        )
        // mask money
        $.fn.initMaskMoney2();

    });
});
