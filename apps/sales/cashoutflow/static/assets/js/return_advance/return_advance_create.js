$(function () {
    $(document).ready(function () {
        const urlParams = new URLSearchParams(window.location.search);
        const advance_payment = JSON.parse(decodeURIComponent(urlParams.get('advance_payment')));
        const opportunity = JSON.parse(decodeURIComponent(urlParams.get('opportunity')));
        const choose_AP_ele = $('#chooseAdvancePayment');
        $('#chooseBeneficiary').prop('disabled', true);

        loadCreator(null);
        loadDataTableCost([]);
        ReturnAdvanceLoadPage.loadMethodPayment();

        if (advance_payment !== null) {
            ReturnAdvanceLoadPage.loadAdvancePayment(choose_AP_ele, {}, {'advance_payment': advance_payment});
            loadDetailAdvancePayment(advance_payment.id);
        } else if (opportunity !== null) {
            ReturnAdvanceLoadPage.saleCodeEle.val(opportunity.code)
            ReturnAdvanceLoadPage.loadAdvancePayment(choose_AP_ele, {}, {'opportunity': opportunity});
        } else {
            ReturnAdvanceLoadPage.loadAdvancePayment(choose_AP_ele, {}, {});
        }


        $('input[name="date_created"]').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: false,
            minYear: 1901,
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY'), 10)
        });
        $('.daterangepicker').remove();

        $(document).on('change', '.return-price', function () {
            let total = 0;
            let ele = $(this).closest('tr').find('span.mask-money');
            if ($(this).valCurrency() > ele.attr('data-init-money')) {
                $.fn.notifyB({description: $('#trans-factory').data('trans-greater-remain')}, 'failure');
                $(this).attr('value', '');
            }
            $('.return-price').each(function () {
                total += $(this).valCurrency();
            })
            $('#total-value').attr('data-init-money', total);
            $.fn.initMaskMoney2();
        })

        const frmCreate = $('#frmCreate');
        new SetupFormSubmit(frmCreate).validate({
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
                employee_created_id: {
                    required: true,
                },
                employee_inherit_id: {
                    required: true,
                }
            },
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form));
                frm.dataForm['employee_created_id'] = $('[name="employee_created_id"]').attr('data-id');
                frm.dataForm['status'] = 0;
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
                frm.dataForm['return_total'] = $('#total-value').attr('data-init-money');

                frm.dataForm['advance_payment'] = $('#chooseAdvancePayment').val();
                frm.dataForm['employee_inherit_id'] = $('#chooseBeneficiary').val();

                $.fn.callAjax2({
                    'url': frm.dataUrl,
                    'method': frm.dataMethod,
                    'data': frm.dataForm,
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