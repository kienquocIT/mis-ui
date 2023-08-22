$(function () {
    $(document).ready(function () {
        const id = $.fn.getPkDetail()
        const frmDetail = $('#frmDetail');

        loadDataTableProductPageDetail([], 'detail');
        loadDetail(id, frmDetail);

        frmDetail.submit(function (event) {
            event.preventDefault();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['money_received'] = !!$('#money-received').is(':checked');
            $.fn.callAjax2({
                url: frm.getUrlDetail(id),
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        })
    })
})