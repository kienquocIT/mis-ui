$(document).ready(function () {
    new CompanyHandle().load();
    LoadDetailCompany($('#frm-update-company'), 'update');

    let pk = $.fn.getPkDetail();
    $("#frm-update-company").submit(function (event) {
        event.preventDefault();
        let combinesData = new CompanyHandle().combinesData($(this), true);
        if (combinesData) {
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            let frm = new SetupFormSubmit($('#tblCompanyConfig'));
                            let dataBody = frm.dataForm
                            dataBody['currency_rule'] = SetupFormSubmit.groupDataFromPrefix(dataBody, 'currency_rule__');
                            dataBody['sub_domain'] = $(this).find('input[name="sub_domain"]').val();
                            dataBody['definition_inventory_valuation'] = !$('#perpetual-selection').prop('checked');
                            dataBody['default_inventory_value_method'] = $('#default-inventory-value-method').val();
                            dataBody['cost_per_warehouse'] = $('#cost-per-warehouse').is(':checked');
                            dataBody['cost_per_lot_batch'] = $('#cost-per-lot-batch').is(':checked');

                            if (
                                dataBody['currency_rule'] &&
                                (
                                    dataBody['currency_rule']['thousands'] &&
                                    dataBody['currency_rule']['decimal'] &&
                                    dataBody['currency_rule']['thousands'] === dataBody['currency_rule']['decimal']
                                )
                            ) {
                                $.fn.notifyB({
                                    'description': "Decimal values are not allowed to be the same as thousands"
                                }, 'failure');
                            } else if (dataBody['currency_rule'] && dataBody['currency_rule']['thousands'] === '.' && !dataBody['currency_rule']['decimal']) {
                                $.fn.notifyB({
                                    'description': "Decimal default values is dot(.), please select thousand value isn't dot(.)"
                                }, 'failure');
                            } else {
                                return $.fn.callAjax2({
                                    'url': frm.dataUrl,
                                    'method': frm.dataMethod,
                                    'data': dataBody,
                                    isLoading: true,
                                }).then(
                                    (resp) => {
                                        // debugger
                                        let data = $.fn.switcherResp(resp);
                                        if (data['status'] === 200) {
                                            $.fn.notifyB({description: "Successfully"}, 'success')
                                            setTimeout(() => {
                                                window.location.reload();
                                            }, 1000);
                                        }
                                    },
                                );
                            }

                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect').format_url_with_uuid(pk));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })
});