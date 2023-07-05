"use strict";

$(function () {

    $(document).ready(function () {
        let $form = $('#frm_quotation_create');
        let eleDataDetail = $('#quotation-detail-data');
        let dataTableClass = new dataTableHandle();
        let loadDataClass = new loadDataHandle();
        let configClass = new checkConfigHandle();

        // call ajax get info quotation detail
        $.fn.callAjax($form.data('url'), 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.compareStatusShowPageAction(data);
                    // store data detail
                    eleDataDetail.val(JSON.stringify(data));

                    loadDataClass.loadDetailQuotation(data);
                    $('#datable-quotation-create-product').DataTable().destroy();
                    $('#datable-quotation-create-cost').DataTable().destroy();
                    $('#datable-quotation-create-expense').DataTable().destroy();
                    if (!$form.hasClass('sale-order')) {
                        dataTableClass.dataTableProduct(data.quotation_products_data, 'datable-quotation-create-product', true);
                        dataTableClass.dataTableCost(data.quotation_costs_data, 'datable-quotation-create-cost', true);
                        dataTableClass.dataTableExpense(data.quotation_expenses_data, 'datable-quotation-create-expense', true);
                    } else {
                        dataTableClass.dataTableProduct(data.sale_order_products_data, 'datable-quotation-create-product', true);
                        dataTableClass.dataTableCost(data.sale_order_costs_data, 'datable-quotation-create-cost', true);
                        dataTableClass.dataTableExpense(data.sale_order_expenses_data, 'datable-quotation-create-expense', true);
                    }
                    // prepare for copy quotation to sale order
                    if (!$form.hasClass('sale-order')) {
                        $('#data-copy-quotation-detail').val(JSON.stringify(data))
                    } else {
                        if (Object.keys(data.quotation).length > 0) {
                            loadDataClass.loadAPIDetailQuotation('data-init-copy-quotation', data.quotation.id);
                        }
                    }

                    // delivery button
                    if (data?.['delivery_call'] === false) $('#btnDeliverySaleOrder').removeClass('hidden');
                    else $('#btnDeliverySaleOrder').addClass('hidden');
                }
            }
        )
        $.fn.initMaskMoney2();

        // enable edit
        $('#btn-edit_quotation').on('click', function () {
            $(this)[0].setAttribute('hidden', true)
            $('#btn-create_quotation')[0].removeAttribute('hidden');
            $form.find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
            $('#datable-quotation-create-product').find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
            $('#datable-quotation-create-cost').find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
            $('#datable-quotation-create-expense').find('.disabled-but-edit').removeAttr('disabled').removeClass('disabled-but-edit');
            // load data dropdown for Tabs
            let tableProduct = document.getElementById('datable-quotation-create-product');
            let tableCost = document.getElementById('datable-quotation-create-cost');
            let tableExpense = document.getElementById('datable-quotation-create-expense');
            for (let i = 0; i < tableProduct.tBodies[0].rows.length; i++) {
                let row = tableProduct.tBodies[0].rows[i];
                if (row.querySelector('.table-row-item')) {
                    loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', row.querySelector('.table-row-item').id, row.querySelector('.table-row-item').value);
                    loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value);
                    loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
                }
            }
            for (let i = 0; i < tableCost.tBodies[0].rows.length; i++) {
                let row = tableCost.tBodies[0].rows[i];
                if (row.querySelector('.table-row-item')) {
                    loadDataClass.loadBoxQuotationProduct('data-init-quotation-create-tables-product', row.querySelector('.table-row-item').id, row.querySelector('.table-row-item').value);
                    loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value);
                    loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
                }
            }
            for (let i = 0; i < tableExpense.tBodies[0].rows.length; i++) {
                let row = tableExpense.tBodies[0].rows[i];
                if (row.querySelector('.table-row-item')) {
                    loadDataClass.loadBoxQuotationExpense('data-init-quotation-create-tables-expense', row.querySelector('.table-row-item').id, row.querySelector('.table-row-item').value);
                    loadDataClass.loadBoxQuotationUOM('data-init-quotation-create-tables-uom', row.querySelector('.table-row-uom').id, row.querySelector('.table-row-uom').value);
                    loadDataClass.loadBoxQuotationTax('data-init-quotation-create-tables-tax', row.querySelector('.table-row-tax').id, row.querySelector('.table-row-tax').value);
                }
            }
            // Check config when begin edit
            configClass.checkConfig(true);

            // load again total products after check config
            let data = JSON.parse(eleDataDetail.val());
            loadDataClass.loadTotal(data, true, false, false);
        });




    });
});
