$(document).ready(function () {
    new CompanyHandle().load();
    LoadDetailCompany($('#frm-update-company'), 'update');

    let logoFiles = null;
    let eleLogo = $('#company_logo');
    eleLogo.on('change', event => {
        logoFiles = event.target.files[0];
    })

    let pk = $.fn.getPkDetail();
    $("#frm-update-company").submit(function (event) {
        event.preventDefault();
        let frmConfig = new SetupFormSubmit($('#tblCompanyConfig'));
        let configState = false;
        let dataBodyConfig = frmConfig.dataForm
        dataBodyConfig['currency_rule'] = SetupFormSubmit.groupDataFromPrefix(dataBodyConfig, 'currency_rule__');
        dataBodyConfig['sub_domain'] = $(this).find('input[name="sub_domain"]').val();
        dataBodyConfig['definition_inventory_valuation'] = !$('#perpetual-selection').prop('checked');
        dataBodyConfig['default_inventory_value_method'] = $('#default-inventory-value-method').val();
        dataBodyConfig['cost_per_warehouse'] = $('#cost-per-warehouse').is(':checked');
        dataBodyConfig['cost_per_lot_batch'] = $('#cost-per-lot-batch').is(':checked');

        if (
            dataBodyConfig['currency_rule'] &&
            (
                dataBodyConfig['currency_rule']['thousands'] &&
                dataBodyConfig['currency_rule']['decimal'] &&
                dataBodyConfig['currency_rule']['thousands'] === dataBodyConfig['currency_rule']['decimal']
            )
        ) {
            $.fn.notifyB({
                'description': "Decimal values are not allowed to be the same as thousands"
            }, 'failure');
        } else if (dataBodyConfig['currency_rule'] && dataBodyConfig['currency_rule']['thousands'] === '.' && !dataBodyConfig['currency_rule']['decimal']) {
            $.fn.notifyB({
                'description': "Decimal default values is dot(.), please select thousand value isn't dot(.)"
            }, 'failure');
        } else {
            configState = true;
        }

        let combinesData = new CompanyHandle().combinesData($(this), true);
        if (combinesData && configState) {
            $.fn.callAjax2({
                ...combinesData,
                isLoading: true,
                'loadingOpts': {
                    'loadingTitleAction': 'UPDATE',
                    'loadingTitleMore': 'General information',
                },
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({'title': 'General information', 'description': $.fn.transEle.attr('data-success')}, 'success')
                        return $.fn.callAjax2({
                            'url': frmConfig.dataUrl,
                            'method': frmConfig.dataMethod,
                            'data': dataBodyConfig,
                            'isLoading': true,
                            'loadingOpts': {
                                'loadingTitleAction': 'UPDATE',
                                'loadingTitleMore': 'Config',
                            },
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data['status'] === 200) {
                                    $.fn.notifyB({'title': 'Config', 'description': $.fn.transEle.attr('data-success')}, 'success')

                                    if (logoFiles){
                                        let formData = new FormData();
                                        formData.append('file', logoFiles);
                                        return $.fn.callAjax2({
                                            url: eleLogo.attr('data-url'),
                                            method: eleLogo.attr('data-method'),
                                            data: formData,
                                            contentType: 'multipart/form-data',
                                            'isLoading': true,
                                            'loadingOpts': {
                                                'loadingTitleAction': 'UPDATE',
                                                'loadingTitleMore': 'Logo',
                                            },
                                        }).then(
                                            (resp) => {
                                                let data = $.fn.switcherResp(resp);
                                                if (data){
                                                    $.fn.notifyB({'title': 'Logo', 'description': $.fn.transEle.attr('data-success')}, 'success')
                                                    setTimeout(() => {
                                                        window.location.replace($(this).attr('data-url-redirect').format_url_with_uuid(pk));
                                                        location.reload.bind(location);
                                                    }, 1000);
                                                }
                                            },
                                            (errs) => $.fn.switcherResp(errs),
                                        )
                                    } else {
                                        setTimeout(() => {
                                            window.location.replace($(this).attr('data-url-redirect').format_url_with_uuid(pk));
                                            location.reload.bind(location);
                                        }, 1000);
                                    }
                                }
                            },
                            (errs) => $.fn.switcherResp(errs),
                        )
                    }
                },
                (errs) => $.fn.notifyB({description: errs.data.errors}, 'failure'),
            )
        }
    })
});