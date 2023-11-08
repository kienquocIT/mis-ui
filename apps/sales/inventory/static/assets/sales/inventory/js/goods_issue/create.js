$(document).ready(function () {
    new GoodsIssueLoadPage().load();

    let iaSelectEle = $('#box-select-ia');

    GoodsIssueLoadPage.loadInventoryAdjustment(iaSelectEle);
    GoodsIssueLoadPage.loadDtbProductForIA([]);

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