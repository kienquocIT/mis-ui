$(function () {
    /***
     * get data received form ajax and parse value to HTML
     * @param res response data of workflow detail
     */
    function prepareDataAndRenderHTML(res){
        if(res.title) $('[name="title"]').val(res.title)
    }

    /***
     * show save button and turn on edit mode of Form
     */
    function clickOnOffEditForm(){
        $('form').off().on('dblclick', function(){
            const $form = $(this).closest('form');
            if (!$form.attr('readonly')) return false
            $('#btn-detail_workflow').removeClass('hidden');
            $form.removeAttr('readonly');
            $form.find('input[readonly]').removeAttr('readonly')
            $form.find('input[type="checkbox"][disabled]').prop('disabled', false)
            $form.find('select[disabled]').prop('disabled', false)
        });
    }

    /***
     * call ajax update form when user click update
     */
    function UpdateFormSubmit(){
        $('#btn-detail_workflow:not(.disabled)').on('click', function(){
            // show loading
            $(this).addClass('disabled')
            $(this).find('.loading-icon').removeClass('hidden')

            // prepare data
            let frm = new SetupFormSubmit($(this));
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            if (frm.dataForm) {
            for (let key in frm.dataForm) {
                if (frm.dataForm[key] === '') {
                    delete frm.dataForm[key]
                }
            }

            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: data.message}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 3000);
                    }
                },
                (errs) => {
                    // if (errs.data.errors.hasOwnProperty('detail')) {
                    //     $.fn.notifyPopup({description: String(errs.data.errors['detail'])}, 'failure')
                    // }
                }
            )
        }
        })
    }

    $(document).ready(function() {
        let $form = $('#form-detail_workflow')

        // call ajax get info wf detail
        $.fn.callAjax($form.data('url'), 'GET')
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        prepareDataAndRenderHTML(data);
                        clickOnOffEditForm();
                        UpdateFormSubmit();
                    }
                }
            )

    }); // end document ready
}, jQuery);