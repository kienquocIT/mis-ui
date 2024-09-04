$(document).ready(function () {
    GISHandle.LoadPage();

    let frmCreate = $('#frmCreate');
    new SetupFormSubmit(frmCreate).validate({
        rules: {
            title: {
                required: true,
            },
            date_issue: true
        },
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm['date_issue'] = moment($('[name="date_issue"]').val(), "DD/MM/YYYY").format('YYYY-MM-DD')
            frm.dataForm['inventory_adjustment'] = $('#box-select-ia').val()
            frm.dataForm['goods_issue_type'] = 0
            if (frm.dataForm['goods_issue_type'] === '0') {
                let frm_data_temp = GISHandle.getDataProductForIA(frm.dataForm);
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