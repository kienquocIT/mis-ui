
$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_create');
        let eleDataDetail = $('#quotation-detail-data');
        let configClass = new checkConfigHandle();

        // call ajax get info quotation detail
        $.fn.callAjax($form.data('url'), 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.compareStatusShowPageAction(data);
                    // store data detail
                    eleDataDetail.val(JSON.stringify(data));
                    QuotationLoadDataHandle.loadDetailQuotation(data);
                    QuotationLoadDataHandle.loadDataTables(data, true);
                    // prepare for copy quotation to sale order
                    if (!$form.hasClass('sale-order')) {
                        $('#data-copy-quotation-detail').val(JSON.stringify(data))
                    } else {
                        if (Object.keys(data.quotation).length > 0) {
                            QuotationLoadDataHandle.loadAPIDetailQuotation('data-init-copy-quotation', data.quotation.id);
                        }
                    }

                    // delivery button
                    if (data?.['delivery_call'] === false) $('#btnDeliverySaleOrder').removeClass('hidden');
                    else $('#btnDeliverySaleOrder').addClass('hidden');
                }
            }
        )
        // mask money
        $.fn.initMaskMoney2();

        // enable edit
        $('#btn-edit_quotation').on('click', function () {
            $(this)[0].setAttribute('hidden', true)
            $('#btn-create_quotation')[0].removeAttribute('hidden');
            $form.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
            $form.find('#quotation-customer-confirm').removeAttr('disabled');

            // Render dataTable again then load data dropdown for Tabs
            let data = JSON.parse(eleDataDetail.val());
            QuotationLoadDataHandle.loadDataTablesAndDropDowns(data);

            // Check config when begin edit
            let check_config = configClass.checkConfig(true);

            // load again total products if after check config the price change
            if (check_config.hasOwnProperty('is_make_price_change')) {
                if (check_config.is_make_price_change === false) {
                    QuotationLoadDataHandle.loadTotal(data, true, false, false);
                }
            }

        });




    });
});
