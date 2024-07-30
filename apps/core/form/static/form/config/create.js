$(document).ready(function () {
    let formTitleCls = new FormTitleComponentType({
        'config': {
            'title': $.fn.gettext('Form title'),
            'remark': $.fn.gettext('Form descriptions'),
            'label_placement': 'top',
            'instruction_placement': 'bottom',
            'authentication_required': true,
        }
    });
    formTitleCls.trigger('sortable.add');

    $('#btn-save-document').on('click', function () {
        let btn$ = $(this);
        let data = formTitleCls.return_config_all();
        if (formTitleCls.check_rules_form_global(data)){
            $.fn.callAjax2({
                url: $(btn$).attr('data-url'),
                method: $(btn$).attr('data-method') || 'POST',
                data: data,
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
    });
})