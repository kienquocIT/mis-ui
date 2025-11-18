$(document).ready(function () {
    TemplateAttrEventHandler.initPageEvent();

    pageElements.$btnSubmit.on('click', function (e) {
        e.preventDefault();
        const $form = $('#frm_template_attribute');
        const frm = new SetupFormSubmit($form);
        const dataSubmit = TemplateAttrPageFunction.combineSubmitData(frm);

        // define method
        let method = 'POST';
        if (dataSubmit.dataForm?.id)
            method = 'PUT'
        const url = method === 'POST'
            ? $form.attr('data-url')
            : $form.attr('data-url-detail').format_url_with_uuid(dataSubmit.dataForm['id']);

        $.fn.callAjax2({
            url: url,
            method: method,
            data: dataSubmit.dataForm
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                $.fn.notifyB({description: data.message}, 'success')
                setTimeout(() => {
                    window.location.href = $form.attr('data-url-redirect');
                }, 1000);
            },
            (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            }
        );
    });
});