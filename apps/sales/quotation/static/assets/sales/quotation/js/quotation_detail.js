$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_create');

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
                    MaskMoney2.initCurrencyExchange(data);
                    // store && load data detail
                    QuotationLoadDataHandle.$eleStoreDetail.val(JSON.stringify(data));
                    QuotationLoadDataHandle.loadDetailQuotation(data);
                    QuotationLoadDataHandle.loadDataTablesAndDropDowns(data);
                    // indicator
                    let indicatorsData = data?.['quotation_indicators_data'];
                    if (QuotationLoadDataHandle.$form[0].classList.contains('sale-order')) {
                        indicatorsData = data?.['sale_order_indicators_data'];
                    }
                    IndicatorControl.dtbIndicator(indicatorsData);
                    // prepare for copy quotation to sale order
                    if (!$form.hasClass('sale-order')) { // QUOTATION PAGES
                        $('#data-copy-quotation-detail').val(JSON.stringify(data));
                    }
                    // attachment
                    let enable_edit = true;
                    if (QuotationLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
                        enable_edit = false;
                    }
                    new $x.cls.file($('#attachment')).init({
                        name: 'attachment',
                        enable_edit: enable_edit,
                        enable_download: true,
                        data: data?.['attachment'],
                    });

                    // init workflow
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                    // init diagram
                    if ($form[0].classList.contains('sale-order')) {
                        DiagramControl.setBtnDiagram('saleorder.saleorder');
                    }

                    // init delivery button
                    if (data?.['delivery_call'] === false) $('#btnDeliverySaleOrder').removeClass('hidden');
                    else $('#btnDeliverySaleOrder').addClass('hidden');
                }
            }
        )
        // mask money
        $.fn.initMaskMoney2();

        function getDetailPrint() {
            $.fn.callAjax2({
                url: $form.data('url-print'),
                method: 'GET',
                isLoading: true,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if ($form.attr('data-method').toLowerCase() === 'get') {
                            let appID = 'b9650500-aba7-44e3-b6e0-2542622702a3';
                            if ($form[0].classList.contains('sale-order')) {
                                appID = 'a870e392-9ad2-4fe2-9baa-298a38691cf2';
                            }
                            new PrintTinymceControl().render(appID, data, false);
                            PrintTinymceControl.open_modal();
                        }
                    }
                }
            )
        }

        $('#print-document').on('click', function () {
            getDetailPrint();
        });


    });
});
