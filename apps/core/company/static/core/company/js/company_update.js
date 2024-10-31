$(document).ready(function () {
    const trans_script = $('#trans-script')
    const current_period = $('#current_period').text() ? JSON.parse($('#current_period').text()) : []
    if (current_period.length === 0) {
        ShowToastrCreatePeriod();
        $('#save-company').prop('hidden', true)
    }
    else {
        $('#save-company').prop('hidden', false)
    }

    let pk = $.fn.getPkDetail()
    let redirect_create_period = $('#form-create-periods-config').attr('data-url-redirect').replace(`/0`, `/${pk}`)
    $('#form-create-periods-config').attr('data-url-redirect', redirect_create_period)

    new CompanyHandle().load();
    LoadDetailCompany($('#frm-update-company'), 'update');

    let logoFiles = null;
    let eleLogo = $('#company_logo');
    eleLogo.on('change', event => {
        logoFiles = event.target.files[0];
    })

    let iconFiles = null;
    const eleIcon$ = $('#company_icon');
    eleIcon$.on('change', event => {
        iconFiles = event.target.files[0];
    })

    function ShowToastrCreatePeriod() {
        const customHtml = `
            <div>
                <h6 class="text-white fw-bold">${trans_script.attr('data-trans-alert-toastr-1')}</h6>
                <div class="mt-3">
                    <span class="text-white small fst-italic">${trans_script.attr('data-trans-alert-toastr-2')}</span>
                </div>
                <div>
                    <span class="text-white small fst-italic">${trans_script.attr('data-trans-alert-toastr-3')}</span>
                </div>
                <div class="mt-3">
                    <button id="showModalButton"
                            class="btn btn-sm btn-light"
                            data-bs-toggle="modal"
                            data-bs-target="#modal-periods-create"
                    >${trans_script.attr('data-trans-alert-toastr-4')}</button>
                </div>
            </div>
        `;

        toastr.options = {
            "closeButton": true,  // Disable the default close button
            "positionClass": "toast-top-right",
            "timeOut": 0, // Toastr will not auto-hide
            "extendedTimeOut": 0, // Extended timeout also set to 0
            "tapToDismiss": false,
            "onclick": null,
            "showDuration": "3000",
            "hideDuration": "1000",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
            "toastClass": "custom-toastr"
        };

        toastr.warning(customHtml);
    }

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
        dataBodyConfig['cost_per_lot'] = $('#cost-per-lot').is(':checked');
        dataBodyConfig['cost_per_project'] = $('#cost-per-prj').is(':checked');
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

                                    if (logoFiles || iconFiles){
                                        let formData = new FormData();
                                        if (logoFiles) formData.append('file_logo', logoFiles);
                                        if (iconFiles) formData.append('file_icon', iconFiles);
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
                            (errs) => {
                                $.fn.switcherResp(errs)
                                if (Object.keys(errs.data.errors).length > 0) {
                                    let key = Object.keys(errs.data.errors)[0]
                                    if (key === 'fiscal_year_not_found') {
                                        ShowToastrCreatePeriod();
                                    }
                                }
                            },
                        )
                    }
                },
                (errs) => $.fn.notifyB({description: errs.data.errors}, 'failure'),
            )
        }
    })
});