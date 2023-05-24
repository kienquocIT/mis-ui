"use strict";

$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_detail');
        let dataTableClass = new dataTableHandle();
        let loadDataClass = new loadDataHandle();

        // call ajax get info quotation detail
        $.fn.callAjax($form.data('url'), 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    loadDataClass.loadDetailQuotation(data);
                    $('#datable-quotation-create-product').DataTable().destroy();
                    $('#datable-quotation-create-cost').DataTable().destroy();
                    $('#datable-quotation-create-expense').DataTable().destroy();
                    if (!$form.hasClass('sale-order-detail')) {
                        dataTableClass.dataTableProduct(data.quotation_products_data, 'datable-quotation-create-product');
                        dataTableClass.dataTableCost(data.quotation_costs_data, 'datable-quotation-create-cost');
                        dataTableClass.dataTableExpense(data.quotation_expenses_data, 'datable-quotation-create-expense');
                    } else {
                        dataTableClass.dataTableProduct(data.sale_order_products_data, 'datable-quotation-create-product');
                        dataTableClass.dataTableCost(data.sale_order_costs_data, 'datable-quotation-create-cost');
                        dataTableClass.dataTableExpense(data.sale_order_expenses_data, 'datable-quotation-create-expense');
                    }
                    // prepare for copy quotation to sale order
                    $('#data-copy-quotation-detail').val(JSON.stringify(data))
                    $.fn.initMaskMoney2();
                }
            }
        )
        $.fn.initMaskMoney2();
    });
});
