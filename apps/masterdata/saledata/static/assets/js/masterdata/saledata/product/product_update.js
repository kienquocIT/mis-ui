$(document).ready(async function () {
    await ProductPageFunction.LoadPageDataFirst()
    ProductEventHandler.InitPageEven()
    ProductHandler.LoadDetailProduct('update');

    let pk = $.fn.getPkDetail()
    $('#form-update-product').submit(function (event) {
        event.preventDefault();
        let combinesData = ProductHandler.CombinesData($(this), true);
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')

                            // call API update avatar img
                            if (pageVariables.avatarFiles) {
                                let eleInputAvatar = $('#avatar-img-input');
                                let formData = new FormData();
                                formData.append('file', pageVariables.avatarFiles);
                                $.fn.callAjax2({
                                    url: eleInputAvatar.attr('data-url') + `?auto_rm_bg=${$('#auto-remove-bg').prop('checked')}`,
                                    method: eleInputAvatar.attr('data-method'),
                                    data: formData,
                                    contentType: 'multipart/form-data',
                                    isLoading: true,
                                    'loadingOpts': {
                                        'loadingTitleAction': 'UPDATE',
                                        'loadingTitleMore': 'Avatar',
                                    },
                                }).then(
                                    (resp) => {
                                        let data = $.fn.switcherResp(resp);
                                        if (data) {
                                            $.fn.notifyB({
                                                'title': `${$.fn.gettext('Avatar')} (May be take more time to load image)`,
                                                'description': $.fn.transEle.attr('data-success')
                                            }, 'success');
                                            setTimeout(() => window.location.reload(), 1000)
                                        }
                                    },
                                    (errs) => $.fn.switcherResp(errs),
                                )
                            } else {
                                setTimeout(() => window.location.reload(), 1000)
                            }

                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect').format_url_with_uuid(pk));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })
})