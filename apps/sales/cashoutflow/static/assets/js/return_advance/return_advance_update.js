$(function () {
    $(document).ready(function () {
        const id = $.fn.getPkDetail()
        const frmDetail = $('#frmUpdate');

        new ReturnAdvanceLoadPage().load();

        loadDataTableCost([], false);
        loadDetail(id, frmDetail);

        ReturnAdvanceLoadPage.loadMethodPayment();

        new SetupFormSubmit(frmDetail).validate({
            rules: {
                title: {
                    required: true,
                },
                advance_payment: {
                    required: true,
                },
                method: {
                    required: true,
                },
                date_created: {
                    required: true,
                },
            },
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                frm.dataForm['system_status'] = 1;
                frm.dataForm['money_received'] = !!$('#money-received').is(':checked');
                let tbProduct = $('#dtbProduct');
                let cost_list = []
                tbProduct.find('tbody tr').each(function () {
                    cost_list.push({
                        'advance_payment_cost': $(this).find('.row-expense').data('id'),
                        'expense_name': $(this).find('.row-expense').text(),
                        'expense_type': $(this).find('.row-expense-type').data('id'),
                        'remain_value': parseFloat($(this).find('span.mask-money').attr('data-init-money')),
                        'return_value': $(this).find('input.mask-money').valCurrency(),
                    })
                })
                frm.dataForm['cost'] = cost_list;
                $('#cost').val(cost_list)
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