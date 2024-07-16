$(document).ready(function () {
    let frm$ = $('form[data-url]');
    if (frm$.length > 0) {
        frm$.find('button:not([type]), button[type=submit]').on('click', function (event){
            event.preventDefault();
            $(this).prop('disabled', true);
            frm$.trigger('submit');
            setTimeout(
                () => {
                    $(this).prop('disabled', false);
                }
            )
        })

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
                        method: 'POST',
                        data: $.fn.formSerializerObject($(form)),
                    }).then(resp => {
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
                    }, errs => {
                        let data = errs?.['data'];
                        if (data) {
                            let errors = data?.['errors'];
                            if (errors.hasOwnProperty('detail') && $('#groupShowErrorsDetail').length === 0) {
                                // fake input for showErrors with key detail
                                $(`<div class="form-item" style="width: 100%;padding-top: 0;padding-bottom: 0;min-height: unset;height: auto;" id="groupShowErrorsDetail"><input name="detail" type="hidden" disabled readonly/></div>`).insertBefore($('.form-action'))
                            }
                            if (errors) {
                                $.fn.formNotify(
                                    $.fn.formGettext("Some data are incomplete. Please complete them before submitting data."),
                                    'failure'
                                )
                                validator.showErrors($.fn.formConvertErrorsBeforeRaise(errors));
                            }
                        }
                    },)
                } else {
                    validator.showErrors({
                        'detail': $.fn.formGettext('The body data is empty.')
                    });
                }
                return false;
            },
        });

        const urlSubmitted = frm$.attr('data-url-submitted');
        const urlSubmittedEdit = frm$.attr('data-url-submitted-edit');
        const urlSubmittedView = frm$.attr('data-url-submitted-view');
        frm$.removeAttr('data-url-submitted').removeAttr('data-url-submitted-edit').removeAttr('data-url-submitted-view');
        if (urlSubmitted) {
            $.fn.formCallAjax({
                url: urlSubmitted,
                method: 'GET',
            }).then(
                resp => {
                    if (resp?.status === 200) {
                        let data = resp?.data || {};
                        if (data) {
                            const obj_ids = data?.['ids'] || [];
                            const submitOnlyOne = data?.['submit_only_one'] || false;
                            const submitAllowEdit = data?.['edit_submitted'] || false;
                            if (submitOnlyOne === true && obj_ids.length > 0) {
                                onlyView();
                                $('.form-content').remove();
                                $('.form-page').remove();
                            }
                            if (obj_ids.length > 0) {
                                let eleGroup$ = $('#data-submitted');
                                obj_ids.map(
                                    obj => {
                                        const urlEdit = urlSubmittedEdit.replaceAll('__pk__', obj.id);
                                        const urlView = urlSubmittedView.replaceAll('__pk__', obj.id);
                                        const dateCreated = $.fn.formDisplayRelativeTime(obj.date_created);
                                        const eleViewDetail$ = $(`
                                            <p style="margin-bottom: 15px; display: none;">
                                                <span>
                                                    [${dateCreated.relate}]
                                                </span>
                                                <a style="margin-left: 15px;" href="${urlView}">${$.fn.formGettext('View')}</a>
                                            </p>`
                                        );

                                        if (submitAllowEdit === true) {
                                            eleViewDetail$.append(`
                                                <a style="margin-left: 15px;" href="${urlEdit}">${$.fn.formGettext('Edit')}</a>
                                            `)
                                        }
                                        return eleViewDetail$;
                                    }
                                ).map(
                                    ele$ => {
                                        eleGroup$.append(ele$);
                                    }
                                )
                            }
                        }
                    }
                    $.fn.formShowContentAndHideLoader();
                },
                errs => $.fn.formShowContentAndHideLoader(),
            )
        } else $.fn.formShowContentAndHideLoader();

        $.fn.formInitSelect2All();
        $.fn.formInitDatePickerAll();
        $.fn.formInitDatetimePickerAll();
        $.fn.formInitTimePickerAll();
        $.fn.formRangeSlider();
    }
})