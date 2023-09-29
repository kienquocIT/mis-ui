$(document).ready(function () {
    let iaSelectEle = $('#box-select-ia');

    GoodsIssueLoadPage.loadInventoryAdjustment(iaSelectEle);
    GoodsIssueLoadPage.loadDtbProductForIA([]);

    $('[name="date_issue"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'down',
        minYear: 2000,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY-MM-DD'), 10) + 100
    })

    $('#inlineRadio2').on('change', function () {
        if ($(this).is(':checked')) {
            $('#row-for-liquidation').removeClass('hidden');
            $('#row-for-ia').addClass('hidden');
            GoodsIssueLoadPage.loadDtbProductForLiquidation([]);
            $('#dtbProductIA').DataTable().clear().draw();
            $('#box-select-ia').closest('.form-group').addClass('hidden');
        }
    })
    $('#inlineRadio1').on('change', function () {
        if ($(this).is(':checked')) {
            $('#row-for-liquidation').addClass('hidden');
            $('#row-for-ia').removeClass('hidden');
            $('#dtbProductLiquidation').DataTable().clear().draw();
            $('#box-select-ia').closest('.form-group').removeClass('hidden');
        }
    })

    $('#btnAddProduct').on('click', function () {
        GoodsIssueLoadPage.generateRowProductLiquidation()
    })

    // onchange select box warehouse in table for liquidation
    $(document).on('change', '.box-select-wh', function () {
        let tr_current = $(this).closest('tr');
        let productSelectEle = tr_current.find('.box-select-product');
        let list_selected = GoodsIssueLoadPage.getListPrProductSelected(productSelectEle);
        GoodsIssueLoadPage.loadProduct(productSelectEle, {}, $(this).val(), list_selected);
    })

    // onchange select box product in table for liquidation
    $(document).on('change', '.box-select-product', function () {
        let product_data = SelectDDControl.get_data_from_idx($(this), $(this).val());
        let tr_current = $(this).closest('tr');
        tr_current.find('.col-uom').text(product_data?.['uom_data'].title);
    })

    // onchange quantity in table for liquidation
    $(document).on('change', '.col-quantity', function () {
        let tr_current = $(this).closest('tr');
        let product = SelectDDControl.get_data_from_idx(tr_current.find('.box-select-product'), tr_current.find('.box-select-product').val());
        if ($(this).val() <= product?.['stock_amount'] - product?.['sold_amount']) {
            GoodsIssueLoadPage.generateSubtotal($(this));
        } else {
            $(this).val(0);
            tr_current.find('.col-subtotal').attr('value', 0)
            $.fn.notifyB({description: transEle.data('trans-fail-quantity').format_by_idx(product?.['stock_amount'])}, 'warning');
            $.fn.initMaskMoney2();
        }
    })

    // onchange in table for liquidation
    $(document).on('change', '.col-unit-cost', function () {
        GoodsIssueLoadPage.generateSubtotal($(this));
    })

    let frmCreate = $('#frmCreate');
    new SetupFormSubmit(frmCreate).validate({
        rules: {
            title: {
                required: true,
            },
            date_issue: true,
            inventory_adjustment: {
                required: function () {
                    return $('#inlineRadio1').is(':checked')
                }
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let frm_data = frm.dataForm;
            if (frm.dataForm['goods_issue_type'] === '0') {
                frm_data = GoodsIssueLoadPage.getDataProductForIA(frm_data);
            } else {
                frm_data = GoodsIssueLoadPage.getDataProductForLiquidation(frm_data);
            }
            $.fn.callAjax2({
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: frm_data
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                }, (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

})