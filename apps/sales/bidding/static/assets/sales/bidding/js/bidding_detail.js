$(document).ready(function () {
    let formSubmit = $('#frm_bidding_create');
    BiddingDataTableHandle.dataTableFile();
    BiddingDataTableHandle.$tableDocument.on('click', '.attach-file', function () {
        BiddingStoreHandle.storeAttachment();
        BiddingLoadDataHandle.loadOpenAttachFile(this);
    });
    // call ajax get data detail
    $.fn.callAjax2({
        url: formSubmit.data('url'),
        method: 'GET',
        isLoading: true,
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $x.fn.renderCodeBreadcrumb(data);
                $.fn.compareStatusShowPageAction(data);

                // store && load data detail
                if (formSubmit.attr('data-method').toLowerCase() !== 'put') {
                    BiddingLoadDataHandle.$opportunitySelectEle.prop('disabled',true)
                    BiddingLoadDataHandle.$salePersonSelectEle.prop('disabled',true)
                    $('#bid-name').prop('disabled',true)
                    $('#bidding-customer').prop('disabled',true)
                    $('#bid-date').prop('disabled',true)
                    $('#bid-value').prop('disabled',true)
                    $('#btn-open-venture-modal').prop('disabled',true)
                    $('#btn-open-document-modal').prop('disabled',true)
                    data['isDetail'] = true
                }
                BiddingLoadDataHandle.loadDetail(data);

                // file
                new $x.cls.file($('#attachment')).init({
                    name: 'attachment',
                    enable_edit: true,
                    data: data?.['attachment'],
                });
                // init workflow
                // WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                // get WF initial zones for change
            }
        }
    )
});
