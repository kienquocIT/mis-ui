$(document).ready(function () {
    TemplateAttrEventHandler.initPageEvent();

    pageElements.$btnSubmit.on('click', function (e) {
        e.preventDefault();
        WindowControl.showLoading();

        const $form = $('#frm_template_attribute');
        const $title = $('#template_attr_modal_title');
        const isCreate = !$title.attr('data-id');

        const frm = new SetupFormSubmit($form);
        const dataSubmit = TemplateAttrPageFunction.combineSubmitData(frm);

        // define method
        const method = isCreate ? 'POST' : 'PUT';
        const url = isCreate
            ? $form.attr('data-url')
            : $form.attr('data-url-detail').replace('0', $title.attr('data-id'));

        $.fn.callAjax2({
            url: url,
            method: method,
            data: dataSubmit.dataForm,
            urlRedirect: $form.attr('data-url-redirect')
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                if (data?.['status'] === 200) {
                    $.fn.notifyB({
                        description: `${isCreate ? 'Create' : 'Update'} template attribute successfully`
                    }, 'success');

                    WindowControl.hideLoading();

                    setTimeout(() => {
                        window.location.href = $form.attr('data-url-redirect');
                    }, 1000);
                } else {
                    WindowControl.hideLoading();
                }
            },
            (errs) => {
                WindowControl.hideLoading();
                $.fn.notifyB({ description: errs.data.errors }, 'failure');
            }
        );
    });
});