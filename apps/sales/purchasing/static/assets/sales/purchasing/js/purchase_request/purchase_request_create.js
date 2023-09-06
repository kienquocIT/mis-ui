$(document).ready(function () {

    const searchParams = new URLSearchParams(window.location.search);
    const param = searchParams.get("type");
    let ele_request_for = $('[name="request_for"]')
    let ele_sale_order = $('[name="sale_order"]')
    let btn_change_pr_product = $('.btn-change-pr-product');
    let btn_add_product = $('.btn-add-product');


    let dict_so_product = {} // {product_of_so_id: {.....}}
    let dict_so = {} // { sale_order_id: {...} }

    switch (param) {
        case 'sale-order':
            $('#modal-select-sale-order').modal('show');
            ele_request_for.val('Sale Order');
            ele_request_for.attr('data-id', 0);
            ele_sale_order.closest('.form-group').removeClass('hidden');
            btn_add_product.addClass('hidden');
            loadSaleOrder();
            loadDtbSOProduct([]);
            break;
        case 'stock':
            ele_request_for.val('Stock');
            ele_request_for.attr('data-id', 1);
            ele_sale_order.closest('.form-group').addClass('hidden');
            btn_change_pr_product.addClass('hidden');
            break;
        case 'other':
            ele_request_for.val('Other');
            ele_request_for.attr('data-id', 2);
            ele_sale_order.closest('.form-group').addClass('hidden');
            btn_change_pr_product.addClass('hidden');
            break;
    }

    $('[name="delivered_date"]').daterangepicker({
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
    }).val('');

    PurchaseRequestLoadPage.loadSupplier()


    loadDtbPRProduct();

    // event in model select product from sale order
    $(document).on('change', '.inp-check-so', function () {
        let table_so_product = $('#datatable-product-of-so').DataTable();
        if ($(this).is(':checked')) {
            $('.inp-check-so').not($(this)).prop('checked', false);
            loadSOProduct(dict_so, dict_so_product, $(this).data('id'), table_so_product);
        } else {

        }
    })

    $(document).on('click', '#btn-select-so-product', function () {
        let ele_url = PurchaseRequestLoadPage.urlEle;
        let table_pr_product = $('#datatable-pr-product').DataTable();
        table_pr_product.clear().draw();
        $('.inp-check-so-product:checked').each(function () {
            let num_request = $(this).closest('tr').find('.inp-request-so-product').val();
            let product = dict_so_product[$(this).data('id')];
            let data_temp = {
                'id': product.id,
                'product': {
                    'id': product.product.id,
                    'title': product.product.title,
                    'uom': product.product.uom,
                },
                'request': num_request,
            }
            table_pr_product.row.add(data_temp).draw().node();
            let ele_new_product = $('#datatable-pr-product').find('tr').last();
            ele_new_product.find('.input-affix-wrapper a').attr('href', ele_url.data('url-product-detail').format_url_with_uuid(product.product.id));
            ele_new_product.find('.span-product-name').text(product.product.title);
            ele_new_product.find('.span-product-code').text(product.product.code);
            ele_new_product.find('.span-product-uom').text(product.product.uom.title);
            ele_new_product.find('.span-product-uom-group').text(product.product.uom_group);

            PurchaseRequestLoadPage.loadTax(ele_new_product.find('.box-select-tax'), product.product.tax_code);
        })

        let ele_so_selected = $('.inp-check-so:checked');
        let ele_so = $('[name="sale_order"]');
        ele_so.val(ele_so_selected.closest('tr').find('.p-so-code').text());
        ele_so.attr('data-id', ele_so_selected.data('id'));

        $('#modal-select-sale-order').modal('hide');
    })

    $(document).on('change', '.inp-request-so-product', function () {
        let ele_trans = $('#trans-factory');
        if (parseInt($(this).val()) > parseInt($(this).closest('tr').find('.p-so-product-remain').text())) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: ele_trans.data('trans-request-greater-remain'),
            })
        }
    })


    $(document).on('change', '.inp-unit-price', function () {
        let tr_current = $(this).closest('tr');
        if (tr_current.find('.inp-quantity').val() !== '') {
            loadPriceSubProduct(tr_current);
            loadFinalPrice($(this).closest('table'));

        }
    })

    $(document).on('change', '.inp-quantity', function () {
        let tr_current = $(this).closest('tr');
        if (tr_current.find('.inp-unit-price').val() !== '') {
            loadPriceSubProduct(tr_current);
            loadFinalPrice($(this).closest('table'));
            $.fn.initMaskMoney2();
        }
    })

    $(document).on('change', '.box-select-tax', function () {
        let tr_current = $(this).closest('tr');
        if (tr_current.find('.inp-quantity').val() !== '' && tr_current.find('.inp-unit-price').attr('value') !== 0) {
            loadPriceSubProduct(tr_current);
            loadFinalPrice($(this).closest('table'));
            $.fn.initMaskMoney2();
        }
    })

    $(document).on('click', '.btn-add-pr-product', function () {
        let table = $('#datatable-pr-product')
        let dataTable = table.DataTable();
        dataTable.row.add([]).draw().node();

        let last_row = table.find('tbody tr').last();
        let productSelectEle = last_row.find('.box-select-product');
        let taxSelectEle = last_row.find('.box-select-tax');
        PurchaseRequestLoadPage.loadProduct(productSelectEle);
        PurchaseRequestLoadPage.loadTax(taxSelectEle)
    })

    $(document).on('change', '.box-select-product', function () {
        let product = SelectDDControl.get_data_from_idx($(this), $(this).val());
        let ele_tr_current = $(this).closest('tr');
        let ele_uom = ele_tr_current.find('.box-select-uom');
        let ele_tax = ele_tr_current.find('.box-select-tax');

        PurchaseRequestLoadPage.loadUoM(ele_uom, product?.['sale_information']?.['default_uom'], {'group': product?.['general_information'].uom_group.id});
        PurchaseRequestLoadPage.loadTax(ele_tax, product?.['sale_information'].tax_code);
        let ele_url = PurchaseRequestLoadPage.urlEle;
        loadProductDetail(ele_tr_current, ele_url, product)
    })

    $(document).on('click', '#btn-select-type-sale-order', function () {
        updateURLParameter('sale-order');
        ele_request_for.val('Sale Order');
        ele_request_for.attr('data-id', 0);
        ele_sale_order.closest('.form-group').removeClass('hidden');
        btn_add_product.addClass('hidden');
        btn_change_pr_product.removeClass('hidden');
        loadSaleOrder();
        loadDtbSOProduct([]);
        deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    $(document).on('click', '#btn-select-type-stock', function () {
        updateURLParameter('stock');
        ele_request_for.val('Stock');
        ele_request_for.attr('data-id', 1);
        ele_sale_order.closest('.form-group').addClass('hidden');
        btn_change_pr_product.addClass('hidden');
        btn_add_product.removeClass('hidden');
        deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    $(document).on('click', '#btn-select-type-other', function () {
        updateURLParameter('other');
        ele_request_for.val('Other');
        ele_request_for.attr('data-id', 2);
        ele_sale_order.closest('.form-group').addClass('hidden');
        btn_change_pr_product.addClass('hidden');
        btn_add_product.removeClass('hidden');
        deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    const frm_create = $('#form-create-pr');
    SetupFormSubmit.validate(
        frm_create,
        {
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                let frm_data = getDataForm(frm.dataForm, ele_request_for, ele_sale_order);
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