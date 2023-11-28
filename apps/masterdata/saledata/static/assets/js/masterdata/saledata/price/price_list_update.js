$(document).ready(function () {
    // load detail price list
    let frm = $('#form-update-price-list');
    let pk = $.fn.getPkDetail();
    PriceListLoadPage.loadDetailPage(frm, pk);
    let load_parent = false;
// onchange checkbox auto-update
    autoUpdateCheckBoxEle.on('change', function () {
        if ($(this).prop("checked")) {
            if (load_parent) {
                let data = JSON.parse($('#price_parent').text());
                PriceListLoadPage.loadCurrency(currencySelectEle, data?.['price'].currency);
            } else {
                $.fn.callAjax2({
                    url: frm.data('url').format_url_with_uuid(priceSelectEle.val()),
                    method: 'GET',
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            load_parent = true;
                            PriceListLoadPage.loadCurrency(currencySelectEle, data?.['price'].currency);
                            $('#price_parent').text(JSON.stringify(data));
                        }
                    })
            }
            currencySelectEle.prop('disabled', 'disabled');
            canDeleteCheckBoxEle.removeAttr('disabled');

        } else {
            canDeleteCheckBoxEle.prop('checked', false);
            currencySelectEle.removeAttr('disabled');
        }
    })

// submit form setting price list
    new SetupFormSubmit(frm).validate({
        rules: {
            currency: {
                required: true,
            },
            factor: {
                required: true,
            },
            price_list_type: {
                required: true,
            },
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm['currency'] = currencySelectEle.val();
            if (frm.dataForm['currency'].length === 0) {
            }

            if (!currencySelectEle.hasClass('tag-changed')) {
                delete frm.dataForm['currency']
            }

            if (!factorInputEle.hasClass('tag-changed')) {
                delete frm.dataForm['factor']
            }

            if (frm.dataForm['auto_update'] === undefined) {
                frm.dataForm['auto_update'] = false
            }

            if (frm.dataForm['can_delete'] === undefined) {
                frm.dataForm['can_delete'] = false
            }

            $.fn.callAjax2({
                url: frm.dataUrl.format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                })
        }
    })

    // form add new item
    let frm_create_product = $('#form-create-product')
    new SetupFormSubmit(frm_create_product).validate({
        rules: {
            product: {
                required: true,
            },
            uom_group: {
                required: true,
            },
            uom: {
                required: true,
            },
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit(form);

            frm.dataForm['product'] = {
                'id': itemSelectEle.val(),
                'uom': $('#select-box-uom').val(),
                'uom_group': $('#inp-uom-group').attr('data-id'),
            };

            $.fn.callAjax2({
                url: frm.dataUrl.format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

// form update item price
    let frm_update_item_price = $('#form-update-item-price')
    new SetupFormSubmit(frm_update_item_price).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm['list_item'] = PriceListAction.getDataItemChangePrice()
            $.fn.callAjax2({
                url: frm.dataUrl.format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                })
        }
    })

    $('#btn-add-new-item').on('click', function () {
        let type = $('#select-box-type').val();
        switch (type) {
            case '0':
                itemSelectEle.attr('data-keyResp', 'product_sale_list');
                itemSelectEle.attr('data-url', urlEle.data('url-product'));
                PriceListLoadPage.loadItem(itemSelectEle);
                break;
            case '2':
                itemSelectEle.attr('data-keyResp', 'expense_list');
                itemSelectEle.attr('data-url', urlEle.data('url-expense'));
                PriceListLoadPage.loadItem(itemSelectEle);
                break;
        }
    })


// delete item
    $(document).on('click', '.btn-del', function () {
        let data = JSON.parse($('#data_detail').text());
        if (data.can_delete) {
            Swal.fire({
                icon: 'error',
                title: transEle.data('trans-delete-item-failed'),
                text: transEle.data('trans-update-setting'),
            })
        } else {
            Swal.fire({
                html:
                    '<div><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div>' +
                    `<h6 class="text-danger">${$('#base-trans-factory').data('sure-delete')}</h6>`,
                customClass: {
                    confirmButton: 'btn btn-outline-secondary text-danger',
                    cancelButton: 'btn btn-outline-secondary text-gray',
                    container: 'swal2-has-bg'
                },
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    let product_id = $(this).closest('tr').find('.span-product').attr('data-id');
                    let uom_id = $(this).closest('tr').find('.span-uom').attr('data-id');
                    let data = {
                        'item': {
                            'id': product_id,
                            'uom_id': uom_id,
                        }
                    }

                    $.fn.callAjax2({
                        url: urlEle.data('url-del-item').format_url_with_uuid($(this).data('id')),
                        method: 'PUT',
                        data: data,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                                setTimeout(function () {
                                    location.reload()
                                }, 1000);
                            }
                        },
                        () => {
                            Swal.fire({
                                html:
                                    `<div><h6 class="text-danger mb-0">${transEle.data('trans-delete-item-failed')}</h6></div>`,
                                customClass: {
                                    content: 'text-center',
                                    confirmButton: 'btn btn-primary',
                                },
                                buttonsStyling: false,
                            })
                        })
                }
            })
        }

    })

// on change price in table item
    $(document).on('input', '#datatable-item-list input.form-control', function () {
        $(this).addClass('inp-edited');
    })

    itemSelectEle.on('change', function () {
        let item = SelectDDControl.get_data_from_idx($(this), $(this).val());
        $('#save-product-selected').prop('disabled', false);
        let type = $('#select-box-type').val();

        let code_ele = $('#inp-code');
        let uom_gr_ele = $('#inp-uom-group');
        let uom_ele = $('#select-box-uom');

        switch (type) {
            case '0':
                code_ele.val(item.code);
                uom_gr_ele.attr('data-id', item?.['general_information'].uom_group.id);
                uom_gr_ele.val(item?.['general_information'].uom_group.title);
                PriceListLoadPage.loadUoM(uom_ele, {}, item?.['general_information'].uom_group.id);
                break;
            case '2':
                code_ele.val(item.code);
                uom_gr_ele.attr('data-id', item.uom_group.id);
                uom_gr_ele.val(item.uom_group.title);
                PriceListLoadPage.loadUoM(uom_ele, {}, item.uom_group.id);
                break;
        }
    })

    let fragment = window.location.hash;

    switch (fragment) {
        case '#tab-setting':
            PriceListAction.configBtnUpdate('form-update-price-list', transEle.data('trans-save-setting'));
            break;
        case '#tab-item-list':
            PriceListAction.configBtnUpdate('form-update-item-price', transEle.data('trans-save-item'));
            break;
    }

    $('#setting-nav').on('click', function () {
        PriceListAction.configBtnUpdate('form-update-price-list', transEle.data('trans-save-setting'));
    })
    $('#products-nav').on('click', function () {
        PriceListAction.configBtnUpdate('form-update-item-price', transEle.data('trans-save-item'));
    })

    $('#tab-setting input,#tab-setting select').on('change', function () {
        $(this).addClass('tag-changed')
    })
})
