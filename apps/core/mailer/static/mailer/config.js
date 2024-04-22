$(document).ready(function () {
    let sslKeyFiles = null;
    let sslCertFiles = null;

    let inpServerGeneral = $('#inp-server-general');
    let groupConfigEle = $('#group-server-mail');
    let inpUseSSLEle = $('#inp-use-ssl');
    let groupSSLEle = $('#group-ssl-config');
    let btnShowHidePass = $('#btn-show-hide-password');

    inpServerGeneral.on('change', function () {
        let checked = $(this).prop('checked');
        checked === true ? groupConfigEle.slideUp() : groupConfigEle.slideDown();
        inpUseSSLEle.trigger('change');
    });

    inpUseSSLEle.on('change', function () {
        let checked = $(this).prop('checked');
        checked === true ? groupSSLEle.slideDown() : groupSSLEle.slideUp();
    });

    btnShowHidePass.on('click', function () {
        $(this).find('span').toggleClass('d-none');
        let inp$ = $(this).closest('.input-group').find('input');
        inp$.attr('type', inp$.attr('type') === 'password' ? 'text' : 'password');
    });

    let frmConfig$ = $('#frm-mail-config');
    let inpUseOurServer$ = frmConfig$.find('input[name=use_our_server]');
    let inpIsActive$ = frmConfig$.find('input[name=is_active]');
    let inpHost$ = frmConfig$.find('input[name=host]');
    let inpPort$ = frmConfig$.find('input[name=port]');
    let inpUsername$ = frmConfig$.find('input[name=username]');
    let inpPassword$ = frmConfig$.find('input[name=password]');
    let inpTls$ = frmConfig$.find('input[name=use_tls]');
    let inpSsl$ = frmConfig$.find('input[name=use_ssl]');
    let inpSslKey$ = frmConfig$.find('input[name=ssl_key]');
    inpSslKey$.on('change', function (event) {
        sslKeyFiles = event.target.files[0];
    })
    let inpSslCrt$ = frmConfig$.find('input[name=ssl_cert]');
    inpSslCrt$.on('change', function (event) {
        sslCertFiles = event.target.files[0];
    })

    new SetupFormSubmit(frmConfig$).validate({
        // rules: {
        //     ssl_key: {
        //         required: function (element){
        //             return $(frmConfig$).find('input[name=use_ssl]').prop('checked');
        //         },
        //     },
        //     ssl_cert: {
        //         required: function (element){
        //             return $(frmConfig$).find('input[name=use_ssl]').prop('checked');
        //         }
        //     },
        //     host: {
        //         required: (element) => !$(frmConfig$).find('input[name=use_our_server]').prop('checked'),
        //     },
        //     port: {
        //         required: (element) => !$(frmConfig$).find('input[name=use_our_server]').prop('checked'),
        //     },
        //     username: {
        //         required: (element) => !$(frmConfig$).find('input[name=use_our_server]').prop('checked'),
        //     },
        //     password: {
        //         required: (element) => !$(frmConfig$).find('input[name=use_our_server]').prop('checked'),
        //     },
        // },
        submitHandler: function (form, event) {
            let frmSetup = new SetupFormSubmit($(form));
            let formData = new FormData();
            if (frmSetup.dataForm['use_our_server'] === true){
                formData.append('is_active', frmSetup.dataForm['is_active']);
                formData.append('use_our_server', true);
            } else {
                for (let key in frmSetup.dataForm) {
                    if (frmSetup.dataForm[key] !== '') formData.append(key, frmSetup.dataForm[key]);
                }
                if (frmSetup.dataForm['use_ssl'] === true){
                    if (sslKeyFiles) formData.append('ssl_key', sslKeyFiles);
                    if (sslCertFiles) formData.append('ssl_cert', sslCertFiles);
                }
            }
            $.fn.callAjax2({
                url: frmSetup.dataUrl,
                method: frmSetup.dataMethod,
                data: formData,
                contentType: 'multipart/form-data',
                sweetAlertOpts: {'allowOutsideClick': true},
                isLoading: true,
                loadingOpts: {
                    'loadingTitleAction': 'UPDATE',
                },
            }).then(
                resp => {
                    let data = $.fn.switcherResp(resp);
                    if (data){
                        $.fn.notifyB({
                            'description': $.fn.gettext('Success'),
                        }, 'success');
                        setTimeout(
                            () => window.location.reload(),
                            600,
                        )
                    }
                },
                errs => $.fn.switcherResp(errs),
            )
        }
    })

    let connectGroup$ = $('#connection-group');
    let connectMsgInProgress$ = $('#connect-msg-in-progress');
    let connectMsgFail$ = $('#connect-msg-fail');
    let connectMsgSuccess$ = $('#connect-msg-success');
    let connectMsgNeedMore$ = $('#connect-msg-need-more');
    let connectErrorsGroup$ = $('#group-connect-errs');
    let connectErrorsValue$ = $('#connect-errs-value');

    let btnTestConfig = $('#btn-verify-saved-config');
    btnTestConfig.on('click', function (){
        connectGroup$.show();
        connectGroup$.find('.connect-msg').hide();
        connectMsgInProgress$.show();
        connectErrorsGroup$.hide();

        $.fn.callAjax2({
            url: $(this).attr('data-url'),
            method: 'GET',
            isLoading: true,
            successOnly: true,
            success: function (rest, textStatus, jqXHR){
                if (rest.status === 200) {
                    connectGroup$.find('.connect-msg').hide();
                    connectMsgSuccess$.show();
                }
            }
        }).then(
            resp => {},
            errs => {
                connectGroup$.find('.connect-msg').hide();
                let connectErrs = errs?.data?.errors || {};
                if (connectErrs?.['connect_state'] === 400){
                    connectMsgNeedMore$.show();
                    connectErrorsValue$.text(connectErrs?.['connect_errors'] || '').show();
                } else if (connectErrs?.['connect_state'] === 503){
                    connectMsgFail$.show();
                    connectErrorsValue$.text(connectErrs?.['connect_errors'] || '').show();
                } else {
                    connectMsgFail$.show();
                    connectErrorsValue$.text(connectErrs?.['connect_errors'] || 'ERRORS').show();
                }
                connectErrorsGroup$.show();
            },
        )
    });

    let btnTestNewConfig = $('#btn-verify-newly-config');
    btnTestNewConfig.on('click', function (){
        let bodyData = {};

        let hostVal = inpHost$.val();
        if (hostVal) bodyData['host'] = hostVal; else $.fn.notifyB({
            'title': inpHost$.closest('.form-group').find('label').text(),
            'description': $.fn.gettext('This field is required')
        }, 'failure');
        let portVal = inpPort$.val();
        if (portVal) bodyData['host'] = portVal; else $.fn.notifyB({
            'title': inpPort$.closest('.form-group').find('label').text(),
            'description': $.fn.gettext('This field is required')
        }, 'failure');
        let usernameVal = inpUsername$.val();
        if (usernameVal) bodyData['host'] = usernameVal; else $.fn.notifyB({
            'title': inpUsername$.closest('.form-group').find('label').text(),
            'description': $.fn.gettext('This field is required')
        }, 'failure');
        let passwordVal = inpPassword$.val();
        if (passwordVal) bodyData['host'] = passwordVal; else $.fn.notifyB({
            'title': inpPassword$.closest('.form-group').find('label').text(),
            'description': $.fn.gettext('This field is required')
        }, 'failure');

        if (bodyData['host'] && bodyData['port'] && bodyData['username'] && bodyData['password']){
            connectGroup$.show();
            connectGroup$.find('.connect-msg').hide();
            connectMsgInProgress$.show();
            connectErrorsGroup$.hide();
            $.fn.callAjax2({
                url: $(this).attr('data-url'),
                method: 'POST',
                data: bodyData,
                isLoading: true,
                successOnly: true,
                success: function (rest, textStatus, jqXHR){
                    if (rest.status === 200) {
                        connectGroup$.find('.connect-msg').hide();
                        connectMsgSuccess$.show();
                    }
                }
            }).then(
                resp => {},
                errs => {
                    connectGroup$.find('.connect-msg').hide();
                    let connectErrs = errs?.data?.errors || {};
                    if (connectErrs?.['connect_state'] === 400){
                        connectMsgNeedMore$.show();
                        connectErrorsValue$.text(connectErrs?.['connect_errors'] || '').show();
                    } else if (connectErrs?.['connect_state'] === 503){
                        connectMsgFail$.show();
                        connectErrorsValue$.text(connectErrs?.['connect_errors'] || '').show();
                    } else {
                        connectMsgFail$.show();
                        connectErrorsValue$.text(connectErrs?.['connect_errors'] || 'ERRORS').show();
                    }
                    connectErrorsGroup$.show();
                },
            )
        }
    });

    $('#link-tab-config').on('shown.bs.tab', function () {
        if (!frmConfig$.attr('data-loaded') !== 'true') {
            frmConfig$.attr('data-loaded', 'true');
            $.fn.callAjax2({
                url: frmConfig$.attr('data-url-detail'),
                method: 'GET',
                isLoading: true,
                sweetAlertOpts: {'allowOutsideClick': true},
            }).then(
                resp => {
                    let data = $.fn.switcherResp(resp);
                    if (typeof data === 'object' && data.hasOwnProperty('config_detail')) {
                        let configDetail = data.config_detail;

                        frmConfig$.attr('data-url', frmConfig$.attr('data-url').replaceAll('__pk__', configDetail.id));
                        btnTestConfig.attr('data-url', btnTestConfig.attr('data-url').replaceAll('__pk__', configDetail.id));
                        btnTestNewConfig.attr('data-url', btnTestNewConfig.attr('data-url').replaceAll('__pk__', configDetail.id));

                        inpUseOurServer$.prop('checked', configDetail['use_our_server']).trigger('change');
                        inpIsActive$.prop('checked', configDetail['is_active']).trigger('change');
                        inpHost$.val('').attr('placeholder', configDetail['host']);
                        inpPort$.val('').attr('placeholder', configDetail['port']);
                        inpUsername$.val('').attr('placeholder', configDetail['username']);
                        inpPassword$.val('').attr('placeholder', configDetail['password']);
                        inpTls$.prop('checked', configDetail['use_tls']).trigger('change');
                        inpSsl$.prop('checked', configDetail['use_ssl']).trigger('change');

                        if (configDetail['ssl_key']) {
                            let file = new File([""], configDetail['ssl_key']);
                            let container = new DataTransfer();
                            container.items.add(file);
                            inpSslKey$[0].files = container.files;
                        }

                        if (configDetail['ssl_cert']) {
                            let file = new File([""], configDetail['ssl_cert']);
                            let container = new DataTransfer();
                            container.items.add(file);
                            inpSslCrt$[0].files = container.files;
                        }
                    }
                },
                errs => console.log(errs),
            )
        }
    });

    $('#btn-collapse-policy').on('click', function (){
        $(this).siblings('ol').slideToggle();
        $(this).find('i').toggleClass('rotate-180deg');
    });
})