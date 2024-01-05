$(function () {
    /***
     * get data received form ajax and parse value to HTML
     * @param res response data of workflow detail
     * @param {{is_define_zone:string}} data
     */
    function prepareDataAndRenderHTML(res){
        if(res.title) $('[name="title"]').val(res.title);
        if (res.application) {
            $("#select-box-features").initSelect2({
                data: res.application,
            });
            // load data-params select property zone modal
            $('#property_list_choices').attr('data-params', JSON.stringify({application: res.application.id, is_sale_indicator: false, parent_n__isnull: true}));
        }
        if (res.is_define_zone) $('[name="define_zone"]').val(res.is_define_zone);
        if (res.zone){
            initTableZone(res.zone);
            $('#zone-list').val(JSON.stringify(res.zone));
        }
        if (res.node) $('#node-list').val(JSON.stringify(res.node));
        if (res.association) $('#node-associate').val(JSON.stringify(res.association))
    }

    /***
     * show save button and turn on edit mode of Form
     */
    function clickEditForm(){
        $('form').off().on('dblclick', function(){
            const $form = $(this).closest('form');
            if (!$form.attr('readonly')) return false
            $('#btn-detail_workflow').removeClass('hidden');
            $form.removeAttr('readonly');
            $form.find('input[readonly]').removeAttr('readonly');
            $form.find('input[type="checkbox"][disabled]:not(.is-not-enabled)').prop('disabled', false);
            $form.find('select[disabled]:not(.is-not-enabled)').prop('disabled', false);
            $form.find('.wf-is-editable').prop('disabled', false);
            $('.actions-btn a').removeClass('disabled')
        });
    }

    /***
     * call ajax update form when user click button
     */
    function UpdateFormSubmit(){
        $('#btn-detail_workflow:not(.disabled)').on('click', function(){
            // show loading
            $(this).addClass('disabled')
            $(this).find('.feather-icon').addClass('hidden')
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
                        $.fn.notifyB({description: data.message}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 3000);
                    }
                },
                (errs) => {
                    // if (errs.data.errors.hasOwnProperty('detail')) {
                    //     $.fn.notifyB({description: String(errs.data.errors['detail'])}, 'failure')
                    // }
                }
            )
        }
        })
    }



    $(document).ready(function() {
        let formSubmit = $('#form-create_workflow');
        // call ajax get info wf detail
        $.fn.callAjax2({
            url: formSubmit.data('url'),
            method: 'GET',
            isLoading: true,
        }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        prepareDataAndRenderHTML(data);
                        NodeLoadDataHandle.loadDetailNode(data?.['node']);
                        // clickEditForm();
                        // UpdateFormSubmit();
                    }
                }
            )


    }); // end document ready
});