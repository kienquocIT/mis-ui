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
                if (Object.keys(bodyData).length > 0){
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
                                validator.showErrors(errors);
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
                            }
                            if (obj_ids.length > 0){

                                let eleGroup$ = $('<div class="form-item-group form-item-group-top"></div>');
                                eleGroup$.append(
                                    `
                                        <style>
                                            .btn-more-submitted {
                                                border: 1px solid #6bb4ba;
                                                color: #004b52;
                                                background-color: #fff;
                                                cursor: pointer;
                                                padding: 5px 3px;
                                                border-radius: 5px;
                                            }
                                        </style>
                                        <p style="font-size: large;color: #00646d;">
                                            ${$.fn.formGettext('You has submitted data.')}
                                            <button type="button" class="btn-more-submitted">Xem danh sách</button>
                                        </p>
                                        <script>
                                            $(document).ready(function (){
                                                $('button.btn-more-submitted').on('click', function (){
                                                    $(this).closest('p').hide(100, function (){
                                                        const tmpGroup$ = $(this).closest('.form-item-group'); 
                                                        $(this).remove();
                                                        tmpGroup$.find('p').slideDown();
                                                    });
                                                })
                                            })
                                        </script>
                                    `
                                );

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

                                        if (submitAllowEdit === true){
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

                                let sub$ = $(`<div class="form-head-sub"></div>`).append(eleGroup$);
                                $('<div class="form-item"></div>').append(sub$).insertAfter($('.form-head'));
                            }
                        }
                    }
                    $('#contents').css('opacity', '100');
                },
                errs => $('#contents').css('opacity', '100'),
            )
        }
    }
})