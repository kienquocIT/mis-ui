$(document).ready(async function () {
    const searchParams = new URLSearchParams(window.location.search);
    const param = searchParams.get("type");

    switch (param) {
        case 'sale-order':
            $('#modal-select-sale-order').modal('show');
            await PurchaseRequestAction.changeType(0);
            break;
        case 'stock':
            ele_request_for.val('Stock');
            ele_request_for.attr('data-id', 1);
            await PurchaseRequestAction.changeType(1)
            break;
        case 'other':
            ele_request_for.val('Other');
            ele_request_for.attr('data-id', 2);
            await PurchaseRequestAction.changeType(2)
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
    new PurchaseRequestEvent().load(param);

    $('#btn-select-type-sale-order').on('click', async function () {
        $('#modal-select-sale-order').modal('show');
        PurchaseRequestAction.updateURLParameter(urlEle.data('url-this-page'), 'sale-order');
        await PurchaseRequestAction.changeType(0);
        PurchaseRequestAction.deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    $('#btn-select-type-stock').on('click', async function () {
        PurchaseRequestAction.updateURLParameter(urlEle.data('url-this-page'), 'stock');
        ele_request_for.val('Stock');
        ele_request_for.attr('data-id', 1);
        await PurchaseRequestAction.changeType(1);
        PurchaseRequestAction.deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    $('#btn-select-type-other').on('click', async function () {
        PurchaseRequestAction.updateURLParameter(urlEle.data('url-this-page'), 'other');
        ele_request_for.val('Other');
        ele_request_for.attr('data-id', 2);
        await PurchaseRequestAction.changeType(2);
        PurchaseRequestAction.deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    const frm_create = $('#form-create-pr');
    new SetupFormSubmit(frm_create).validate({
        rules: {
            title: {
                required: true,
            },
            delivered_date: {
                required: true,
            },
            supplier: {
                required: true,
            },
            request_for: {
                required: true,
            },
            contact: {
                required: true,
            },
            sale_order: {
                required: function () {
                    return $('input[name="request_for"]').data('id') === 0
                },
            },
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            let frm_data = PurchaseRequestAction.getDataForm(frm.dataForm, ele_request_for, ele_sale_order);
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