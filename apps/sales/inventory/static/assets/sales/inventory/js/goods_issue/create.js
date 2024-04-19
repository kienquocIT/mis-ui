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
            date_issue: true
        },
        submitHandler: function (form) {
            WindowControl.showLoading();
            let frm = new SetupFormSubmit($(form));
            let frm_data = frm.dataForm;
            frm.dataForm['date_issue'] = moment($('[name="date_issue"]').val(), "DD/MM/YYYY").format('YYYY-MM-DD')
            frm.dataForm['inventory_adjustment'] = $('#box-select-ia').val()
            frm.dataForm['goods_issue_type'] = $('#box-good-issue-type').val()
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
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        setTimeout(() => {
                            window.location.replace(frm.dataUrlRedirect);
                            location.reload.bind(location);
                        }, 1000);
                    }
                }, (errs) => {
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                        },
                        1000
                    )
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

})