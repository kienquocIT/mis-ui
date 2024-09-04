$(document).ready(function () {
    new GISHandle().load();
    let pk = $.fn.getPkDetail();
    let frmUpdate = $('#frmUpdate');

    GISHandle.loadGoodsIssueDetail(frmUpdate, pk, 'update');
    new SetupFormSubmit(frmUpdate).validate({
        rules: {
            title: {
                required: true,
            },
            date_issue: true
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm['goods_issue_type'] = 0
            if (frm.dataForm['goods_issue_type'] === '0') {
                let frm_data_temp = GISHandle.getDataProductForIAUpdate(frm.dataForm);
                if (frm_data_temp) {
                    frm.dataForm = frm_data_temp
                }
                else {
                    $.fn.notifyB({description: 'Missing detail information. Click to Select detail.'}, 'failure');
                    return
                }
            }
            else {
                frm.dataForm = GISHandle.getDataProductForLiquidation(frm.dataForm);
            }
            WFRTControl.callWFSubmitForm(frm);
        }
    })
})