$(document).ready(function () {
    let frm$ = $('form[data-url]');
    if (frm$.length > 0) {
        const dataUrl = frm$.data('url');
        const urlSubmitted = frm$.attr('data-url-submitted');
        const urlSubmittedEdit = frm$.attr('data-url-submitted-edit');
        const urlSubmittedView = frm$.attr('data-url-submitted-view');
        // frm$.removeAttr('data-url').removeAttr('data-url-submitted').removeAttr('data-url-submitted-edit').removeAttr('data-url-submitted-view');

        let validator = frm$.validateB({
            onsubmit: true,
            submitHandler: function (form, event) {
                event.preventDefault();
                if (dataUrl){
                    $.fn.formShowLoaders('50%');
                    const bodyData = $.fn.formSerializerObject($(form));
                    if (Object.keys(bodyData).length > 0) {
                        $.fn.formCallAjax({
                            url: dataUrl,
                            method: 'POST',
                            data: $.fn.formSerializerObject($(form)),
                        }).then(resp => {
                            $.fn.formHideLoaders();
                            if (resp?.status === 201 || resp?.status === 200) {
                                console.log('resp:', resp);
                                const formPostId = resp?.['data']?.['form_post']?.['id'] || null;
                                const formAction$ = $('.form-action');
                                if (formPostId && formAction$.length > 0){
                                    $.fn.formNotify($.fn.formGettext('Data has been registered'), 'success');
                                    $(`
                                    <div class="form-item form-item-md">
                                        <span>${$.fn.formGettext('The data has been recorded')}</span>, 
                                        <a href="${urlSubmittedView.replaceAll('__pk__', formPostId)}">${$.fn.formGettext('review at here')}</a>
                                    </div>
                                `).insertAfter(formAction$);
                                }
                            }
                        }, errs => {
                            $.fn.formHideLoaders();
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
                        $.fn.formHideLoaders();
                        validator.showErrors({
                            'detail': $.fn.formGettext('The body data is empty.')
                        });
                    }
                }
                return false;
            },
        });
        frm$.find('button:not([type]), button[type=submit]').on('click', function (event){
            event.preventDefault();
            // disable button 1s after clicked!
            const btn$ = $(this);
            btn$.prop('disabled', true);
            setTimeout(
                () => btn$.prop('disabled', false),
                1000
            )
            // submit firing
            frm$.trigger('submit');
        })
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