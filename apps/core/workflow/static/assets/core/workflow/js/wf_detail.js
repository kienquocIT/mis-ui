$(function () {
    /***
     * get data received form ajax and parse value to HTML
     * @param res response data of workflow detail
     * @param {{is_define_zone:string}} data
     */
    function prepareDataAndRenderHTML(res){
        if(res.title) $('[name="title"]').val(res.title);
        if (res.application) {
            // $("#select-box-features").initSelect2({
            //     data: res.application,
            // });
            loadInitS2($("#select-box-features"), [res.application]);
            // load data-params select property zone modal
            loadInitS2($('#property_list_choices'), [], {'application': res.application.id, 'is_wf_zone': true});
        }
        if (res.is_define_zone) $('[name="define_zone"]').val(res.is_define_zone);
        if (res.zone){
            $('#table_workflow_zone').DataTable().destroy();
            initTableZone(res.zone);
            $('#zone-list').val(JSON.stringify(res.zone));
        }
        if (res.node) $('#node-list').val(JSON.stringify(res.node));
        if (res.association) $('#node-associate').val(JSON.stringify(res.association))
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
                        NodeLoadDataHandle.loadDetail(data?.['node']);
                        NodeLoadDataHandle.loadInit();
                    }
                }
            )


    }); // end document ready
});