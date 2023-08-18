$(function () {
    $(document).ready(function () {
        const id = $.fn.getPkDetail()
        const frmDetail = $('#frmDetail');
        const choose_AP_ele = $('#chooseAdvancePayment');

        loadDataTableProductPageDetail([]);
        function loadDetail(id, frmDetail) {
            let frm = new SetupFormSubmit(frmDetail);
            $.fn.callAjax(frm.getUrlDetail(id), "GET").then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let return_advance_detail = data?.['return_advance'];
                    $.fn.compareStatusShowPageAction(return_advance_detail);
                    $('.header-code').text(return_advance_detail.code);
                    $('[name="title"]').val(return_advance_detail.title);
                    ReturnAdvanceLoadPage.loadAdvancePayment(choose_AP_ele ,return_advance_detail.advance_payment, {});
                    loadDetailAdvancePayment(return_advance_detail.advance_payment.id, 'detail');
                    loadCreator(return_advance_detail.creator);
                    $('[name="date_created"]').val(return_advance_detail.date_created.split(" ")[0]);
                    $('[name="method"]').val(return_advance_detail.method);
                    loadProductTable(return_advance_detail.cost);
                    let total_value = return_advance_detail.cost.map(obj => obj.return_price).reduce((a, b) => a + b, 0)
                    $('#total-value').attr('data-init-money', total_value);
                    if (return_advance_detail.money_received) {
                        $('#money-received').prop('checked', true);
                        $('#money-received').prop('disabled', true);
                    } else {
                        $('#money-received').prop('checked', false);
                    }

                }
            }, (errs) => {
            },)
        }

        loadDetail(id, frmDetail);

        frmDetail.submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['money_received'] = !!$('#money-received').is(':checked');
            $.fn.callAjax(frm.getUrlDetail(id), frm.dataMethod, frm.dataForm, csr)
                .then(
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