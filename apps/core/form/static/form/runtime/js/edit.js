$(document).ready(function () {
    let frm$ = $('form[data-url]');
    if (frm$.length > 0) {
        const dataUrl = frm$.data('url');
        frm$.removeAttr('data-url');

        let validator = frm$.validateB({
            onsubmit: true,
            submitHandler: function (form, event) {
                event.preventDefault();
                const bodyData = $.fn.formSerializerObject($(form));
                if (Object.keys(bodyData).length > 0) {
                    $.fn.formCallAjax({
                        url: dataUrl,
                        method: 'PUT',
                        data: $.fn.formSerializerObject($(form)),
                    }).then(
                        resp => {
                            if (resp?.status === 201 || resp?.status === 200) {
                                $.fn.formNotify($.fn.formGettext('Data has been registered'), 'success');
                                setTimeout(
                                    () => {
                                        $.fn.formNotify($.fn.formGettext('Automatic reload page after 1 second'), 'info');
                                        setTimeout(
                                            () => {
                                                window.location.reload();
                                            },
                                            1000
                                        )
                                    },
                                    500
                                )
                            }
                        },
                        errs => {
                            let data = errs?.['data'];
                            if (data) {
                                let errors = data?.['errors'];
                                if (errors.hasOwnProperty('detail') && $('#groupShowErrorsDetail').length === 0) {
                                    // fake input for showErrors with key detail
                                    $(`<div class="form-item" style="width: 100%;padding-top: 0;padding-bottom: 0;min-height: unset;height: auto;" id="groupShowErrorsDetail"><input name="detail" type="hidden" disabled readonly/></div>`).insertBefore($('.form-action'))
                                }
                                if (errors) {
                                    validator.showErrors(errors);
                                }
                            }
                        },
                    )
                } else {
                    validator.showErrors({
                        'detail': $.fn.formGettext('The body data is empty.')
                    });
                }
                return false;
            },
        });

        let data$ = frm$.find('script#submitted_data_idx');
        if (data$.length === 1) {
            let data = JSON.parse(data$.text());
            Object.keys(data).map(
                key => {
                    $(`[name=${key}]`).val(data[key]).trigger('change');
                }
            )
            frm$.valid();
            data$.remove();
            $('#contents').css('opacity', '100');
        }
    }
})