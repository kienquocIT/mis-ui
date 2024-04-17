$(document).ready(function () {
    new GoodsIssueLoadPage().load();
    let pk = $.fn.getPkDetail();
    let frmUpdate = $('#frmUpdate');

    GoodsIssueLoadPage.loadGoodsIssueDetail(frmUpdate, pk, 1);
    new SetupFormSubmit(frmUpdate).validate({
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
            frm.dataForm['date_issue'] = moment($('[name="date_issue"]').val(), "DD/MM/YYYY").format('YYYY-MM-DD')

            console.log(frm.dataForm)

            if ($('#box-good-issue-type').val() === '0') {
                frm_data = GoodsIssueLoadPage.getDataProductForIA(frm_data);
            } else {
                frm_data = GoodsIssueLoadPage.getDataProductForLiquidation(frm_data);
            }

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