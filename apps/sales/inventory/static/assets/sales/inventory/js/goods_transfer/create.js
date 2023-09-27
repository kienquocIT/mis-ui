$(document).ready(function () {
    let agencySelectEle = $('#box-select-agency');
    $('[name="date_transfer"]').daterangepicker({
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
    GoodsTransferLoadPage.loadAgency(agencySelectEle);
    GoodsTransferLoadPage.loadDtbProduct([]);

    $('input[type="radio"]').on('change', function () {
        $('#dtbProduct').DataTable().clear().draw();
        let agencySelectEle = $('#box-select-agency');

        if ($(this).val() === '0') {
            $('#btnAddProduct').removeClass('hidden');
            $('#dropdownAddProduct').addClass('hidden');
            agencySelectEle.closest('.form-group').addClass('hidden');
            agencySelectEle.empty();
        } else {
            $('#btnAddProduct').addClass('hidden');
            $('#dropdownAddProduct').removeClass('hidden');
            agencySelectEle.closest('.form-group').removeClass('hidden');
        }
    })

    $('#btnSendProduct').on('click', function () {
        let table = $('#dtbProduct');
        GoodsTransferLoadPage.generateRowProduct(table);
        let tr_current = table.find('tbody tr').last();
        let whSelectEle = tr_current.find('.box-select-wh');
        let endWhSelectEle = tr_current.find('.box-select-end-wh');
        let agencySelectEle = $('#box-select-agency');
        GoodsTransferLoadPage.loadWarehouse(whSelectEle, {}, null, null);
        GoodsTransferLoadPage.loadWarehouse(endWhSelectEle, {}, agencySelectEle.val(), null);
    })

    $('#btnReturnProduct').on('click', function () {
        let table = $('#dtbProduct');
        GoodsTransferLoadPage.generateRowProduct(table);
        let tr_current = table.find('tbody tr').last();
        let whSelectEle = tr_current.find('.box-select-wh');
        let endWhSelectEle = tr_current.find('.box-select-end-wh');
        let agencySelectEle = $('#box-select-agency');
        $('#type_send_or_return').val(1);
        GoodsTransferLoadPage.loadWarehouse(whSelectEle, {}, agencySelectEle.val(), null);
        GoodsTransferLoadPage.loadWarehouse(endWhSelectEle, {}, null, null);
    })

    $('#btnAddProduct').on('click', function () {
        let table = $('#dtbProduct');
        GoodsTransferLoadPage.generateRowProduct(table);
        let tr_current = table.find('tbody tr').last();
        let whSelectEle = tr_current.find('.box-select-wh');
        let endWhSelectEle = tr_current.find('.box-select-end-wh');
        GoodsTransferLoadPage.loadWarehouse(whSelectEle, {}, null, null);
        GoodsTransferLoadPage.loadWarehouse(endWhSelectEle, {}, null, null);

    })

    $(document).on('change', '.box-select-wh', function () {
        let tr_current = $(this).closest('tr');
        let productSelectEle = tr_current.find('.box-select-product');
        let list_selected = GoodsTransferLoadPage.getListPrProductSelected(productSelectEle);
        GoodsTransferLoadPage.loadProduct(productSelectEle, {}, $(this).val(), list_selected);
        if ($('#type_send_or_return').val() === '0')
            GoodsTransferLoadPage.loadWarehouse(tr_current.find('.box-select-end-wh'), {}, agencySelectEle.val(), $(this).val());
        else
            GoodsTransferLoadPage.loadWarehouse(tr_current.find('.box-select-end-wh'), {}, null, $(this).val());
    })

    $(document).on('change', '.box-select-product', function () {
        let product_data = SelectDDControl.get_data_from_idx($(this), $(this).val());
        let tr_current = $(this).closest('tr');
        tr_current.find('.col-uom').text(product_data?.['uom_data'].title);
    })

    $(document).on('change', '.col-quantity', function () {
        let tr_current = $(this).closest('tr');
        let product = SelectDDControl.get_data_from_idx(tr_current.find('.box-select-product'), tr_current.find('.box-select-product').val());
        if ($(this).val() <= product?.['stock_amount'] - product?.['sold_amount']) {
            GoodsTransferLoadPage.generateSubtotal($(this));
        } else {
            $(this).val(0);
            tr_current.find('.col-subtotal').attr('value', 0)
            $.fn.notifyB({description: transEle.data('trans-fail-quantity').format_by_idx(product?.['stock_amount'])}, 'warning');
            $.fn.initMaskMoney2();
        }
    })

    $(document).on('change', '.col-unit-cost', function () {
        GoodsTransferLoadPage.generateSubtotal($(this));
    })

    agencySelectEle.on('change', function (){
        $('#dtbProduct').DataTable().clear().draw();
    })

    $.validator.addMethod(
        "customDate",
        function (value, element) {
            return this.optional(element) || /^\d{2}\/\d{2}\/\d{4}$/.test(value);
        },
        transEle.data('trans-date-format')
    );

    new SetupFormSubmit($('#frmCreate')).validate({
        rules: {
            title: {
                required: true,
            },
            date_received: {
                required: true,
                customDate: true,
            },
            warehouse_type: {
                required: true,
            },
            agency: {
                required: function () {
                    return $("#inlineRadio2").is(':checked');
                }
            }
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let frm_data = GoodsTransferLoadPage.getDataForm(frm.dataForm);
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