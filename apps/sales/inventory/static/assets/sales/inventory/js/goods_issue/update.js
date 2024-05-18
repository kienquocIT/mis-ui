$(document).ready(function () {
    new GoodsIssueLoadPage().load();
    let pk = $.fn.getPkDetail();
    let frmUpdate = $('#frmUpdate');

    GoodsIssueLoadPage.loadGoodsIssueDetail(frmUpdate, pk, 'update');
    new SetupFormSubmit(frmUpdate).validate({
        rules: {
            title: {
                required: true,
            },
            date_issue: true
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm['goods_issue_type'] = $('#box-good-issue-type').val()
            if (frm.dataForm['goods_issue_type'] === '0') {
                let frm_data_temp = GoodsIssueLoadPage.getDataProductForIAUpdate(frm.dataForm);
                if (frm_data_temp) {
                    frm.dataForm = frm_data_temp
                }
                else {
                    $.fn.notifyB({description: 'Missing detail information. Click to Select detail.'}, 'failure');
                    return
                }
            }
            else {
                frm.dataForm = GoodsIssueLoadPage.getDataProductForLiquidation(frm.dataForm);
            }
            WFRTControl.callWFSubmitForm(frm);
        }
    })
})