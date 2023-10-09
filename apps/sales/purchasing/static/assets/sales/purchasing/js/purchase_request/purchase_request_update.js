$(document).ready(function () {
    const frmDetail = $('#frmUpdate');
    const pk = $.fn.getPkDetail();

    PurchaseRequestLoadPage.loadDetail(frmDetail, pk, 1);

    new PurchaseRequestEvent().load();

    $('#btn-select-type-sale-order').on('click', async function () {
        $('#modal-select-sale-order').modal('show');
        let so_id_current = JSON.parse($('#data-detail-backup').text()).sale_order.id;
        await PurchaseRequestAction.changeType(0, so_id_current);
        PurchaseRequestAction.deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    $('#btn-select-type-stock').on('click', async function () {
        ele_request_for.val('Stock');
        ele_request_for.attr('data-id', 1);
        await PurchaseRequestAction.changeType(1);
        PurchaseRequestAction.deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    $('#btn-select-type-other').on('click', async function () {
        ele_request_for.val('Other');
        ele_request_for.attr('data-id', 2);
        await PurchaseRequestAction.changeType(2);
        PurchaseRequestAction.deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    new SetupFormSubmit(frmDetail).validate({
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
                url: frm.dataUrl.format_url_with_uuid(pk),
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