$(document).ready(function () {
    let btn$ = $('#btn-save-document');

    function render_published(published, form_title){
        const embed$ = $('#config-embed-form-sub');

        const publishedId = published?.id;
        if (publishedId) {
            let btnAccess$ = $('#btn-access-form');
            btnAccess$.attr('href', btnAccess$.attr('data-href').replaceAll('__pk__', published.id));

            embed$.attr('data-url', embed$.attr('data-url').replaceAll('__pk__', published['id']));
        }
        $('#public-form-enabled')
            .prop('checked', published?.['is_public'] || false)
            .on('change', function () {
            $.fn.callAjax2({
                url: embed$.attr('data-url'),
                method: embed$.attr('data-method') ?? 'PUT',
                data: {
                    'is_public': $(this).prop('checked'),
                }
            }).then(
                resp => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success');
                    }
                },
                errs => $.fn.switcherResp(errs),
            )
        });

        $('#iframe-form-enabled')
            .prop('checked', published?.['is_iframe'] || false)
            .on('change', function () {
            $.fn.callAjax2({
                url: embed$.attr('data-url'),
                method: embed$.attr('data-method') ?? 'PUT',
                data: {
                    'is_iframe': $(this).prop('checked'),
                }
            }).then(
                resp => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({'description': $.fn.gettext('Successful')}, 'success');
                    }
                },
                errs => $.fn.switcherResp(errs),
            )
        });

        let code = published?.['code'];
        if (code) {
            const formPermalink$ = $('#form-permalink');
            const formIframeLink$ = $('#idx-iframe-url');

            let link = window.location.origin + formPermalink$.attr('data-url').replaceAll('__form_code__', code);
            formPermalink$
                .val(link)
                .on('click', function () {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(
                            formPermalink$.val()
                        ).then(
                            function () {
                                $.fn.notifyB({
                                    'description': $.fn.gettext('Copied')
                                }, 'success')
                            },
                            function () {
                            },
                        );
                    }
                });
            formPermalink$.siblings('a').attr('href', link);

            new QRCode(document.getElementById('QRCodeLink'), {
                text: link,
                width: 100,
                height: 100,
                colorDark: '#000',
                colorLight: '#fff',
                correctLevel: QRCode.CorrectLevel.H
            });
            $('#DownloadQRCodeLink').on('click', function () {
                let a = document.createElement("a"); //Create <a>
                a.href = "data:image/png;base64," + $('#QRCodeLink').find('img').attr('src').split('base64,').at(-1);
                a.download = `QR-${link.split("//").at(-1).split('/')[0].replaceAll('.', '-')}.png`;
                a.click();
            });

            let linkIframe = window.location.origin + formIframeLink$.attr('data-url').replace('__form_code__', code);
            formIframeLink$
                .val(`<iframe aria-label="${form_title}" frameborder="0" style="height:500px;width:100%;border:none;" src="${linkIframe}"></iframe>`)
                .on('click', function () {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(
                            formIframeLink$.val()
                        ).then(
                            function () {
                                $.fn.notifyB({
                                    'description': $.fn.gettext('Copied')
                                }, 'success')
                            },
                            function () {
                            },
                        );
                    }
                });
        }
    }

    function render(configs, configs_order, published, form_config) {
        // published
        render_published(published, configs?.['title'] ?? '');
        // -- published


        // component
        let formTitleCls = new FormTitleComponentType({
            'config': form_config,
        });
        formTitleCls.trigger('sortable.add');
        formTitleCls.generate_init_load(configs_order, configs);

        // -- component


        function saving(){
            let data = formTitleCls.return_config_all();
            if (formTitleCls.check_rules_form_global(data)) {
                $.fn.callAjax2({
                    url: $(btn$).attr('data-url'),
                    method: $(btn$).attr('data-method') || 'PUT',
                    data: data,
                    isLoading: true,
                }).then(
                    resp => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            formTitleCls.stateChangeAll = false;
                            $.fn.notifyB({
                                'description': $.fn.gettext('Successful'),
                            }, 'success');
                            $x.fn.showTimeOut({
                                timer: 1000,
                                'callback': () => {
                                    window.location.href = $(btn$).attr('data-url-redirect')
                                }
                            })
                        }
                    },
                    errs => $.fn.switcherResp(errs, {
                        'isNotify': true,
                        'notifyOpts': {
                            'keyNotMatch': '',
                            'replaceKey': {},
                            'isShowKey': true
                        },
                        'swalOpts': {'allowOutsideClick': true},
                    }),
                )
            }
        }

        // save
        btn$.on('click', function () {
            saving();
        })

        // -- save
    }

    $.fn.callAjax2({
        url: btn$.attr('data-url-detail'),
        method: 'GET',
        isLoading: true,
    }).then(
        resp => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let formDetail = data?.['form_detail'] || {};
                if (formDetail) {
                    let {
                        configs,
                        configs_order,
                        published,
                        ...form_config
                    } = formDetail;
                    render(configs, configs_order, published, form_config);
                } else setTimeout(() => $x.fn.showNotFound({'allowOutsideClick': true}), 500);
            }
        },
        errs => $.fn.switcherResp(errs),
    )
})