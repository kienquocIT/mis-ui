$(function () {
    $(document).ready(function () {
        const id = $.fn.getPkDetail()
        const frmDetail = $('#frmDetail');

        loadDataTableCost([], true);
        loadDetail(id, frmDetail);

        new SetupFormSubmit(frmDetail).validate({
            rules: {
                title: {
                    required: true,
                },
                advance_payment: {
                    required: true,
                },
                sale_code: {
                    required: true,
                },
                method: {
                    required: true,
                },
                date_created: {
                    required: true,
                },
                creator: {
                    required: true,
                },
                beneficiary: {
                    required: true,
                }
            },
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));

                frm.dataForm['money_received'] = !!$('#money-received').is(':checked');
                $.fn.callAjax2({
                    url: frm.getUrlDetail(id),
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
    })
})