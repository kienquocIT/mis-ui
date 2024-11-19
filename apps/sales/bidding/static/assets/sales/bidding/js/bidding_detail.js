$(document).ready(function () {
    let formSubmit = $('#frm_bidding_create');
    BiddingDataTableHandle.dataTableFile();
    BiddingDataTableHandle.$tableDocument.on('click', '.attach-file', function () {
        BiddingStoreHandle.storeAttachment();
        BiddingLoadDataHandle.loadOpenAttachFile(this);
    });
    let transScript = $('#trans-script')
    let $urlBidResultConfig = $('#app-url-factory').attr('data-bid-result-config')

    $('#btn-attach-invite-doc').on('click', function () {
        BiddingStoreHandle.storeAttachment()
        BiddingDataTableHandle.$tableDocument.DataTable().rows().every(function () {
            let row = this.node();
            $(row).css('background-color', '');
        });
        $(this).closest('.form-control').css('background-color', '#ebfcf5');
        let eleId = this.id
        let isManual = this.getAttribute('data-is-manual')
        BiddingLoadDataHandle.$fileArea[0].setAttribute('doc-id', eleId);
        BiddingLoadDataHandle.$fileArea[0].setAttribute('doc-is-manual', isManual);
        BiddingLoadDataHandle.$remark[0].removeAttribute('readonly');
        BiddingLoadDataHandle.$remark.val('');
        BiddingLoadDataHandle.loadAddFile([]);
        let fileIds = BiddingLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
        if (fileIds) {
            fileIds.value = "";
        }
        if(!this.getAttribute('data-store')){
            let data = {
                "id": eleId,
                "title": '',
                "attachment_data": [],
                "isManual": true
            }
            this.setAttribute('data-store', JSON.stringify(data))
        }
         if (fileIds) {
             let dataStore = JSON.parse(this.getAttribute('data-store'));
            BiddingLoadDataHandle.$remark.val(dataStore?.['remark']);
            BiddingLoadDataHandle.loadAddFile(dataStore?.['attachment_data']);
            console.log(dataStore?.['attachment_data'])
             let ids = [];
            for (let fileData of dataStore?.['attachment_data']) {
                ids.push(fileData?.['attachment']?.['id']);
            }
            let fileIds = BiddingLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
            fileIds.value = ids.join(',');
            let attachmentParse = [];
            for (let attachData of dataStore?.['attachment_data']) {
                attachmentParse.push(attachData?.['attachment']);
            }
            // append html file again
            BiddingLoadDataHandle.$attachment.empty().html(`${BiddingLoadDataHandle.$attachmentTmp.html()}`);
            // init file again
            new $x.cls.file(BiddingLoadDataHandle.$attachment).init({
                name: 'attachment',
                enable_edit: true,
                enable_download: true,
                data: attachmentParse,
            });
            // add event
            let inputs = BiddingLoadDataHandle.$attachment[0].querySelectorAll('input[type="file"]');

            inputs.forEach((input) => {
                input.addEventListener('change', function () {
                    let dataList = BiddingLoadDataHandle.loadSetupAddFile();
                    BiddingLoadDataHandle.loadAddFile(dataList);
                });
            });
         }
         BiddingLoadDataHandle.$attachment[0].removeAttribute('hidden');
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
                    BiddingLoadDataHandle.$btnOpenBidderModal.on('click', function () {
                        let data = BiddingSubmitHandle.setupDataBidder()
                        BiddingLoadDataHandle.$bidderDataScript.attr('data-bidder-list', JSON.stringify(data))
                        let title = transScript.attr('data-trans-modal-bidder-title')
                        BiddingLoadDataHandle.$modalAccount.find('.modal-title').html(title)
                        BiddingLoadDataHandle.$modalAccount.attr('data-type', 'bidder')
                        BiddingDataTableHandle.dataTableAccountModal(false);
                    })
                    BiddingLoadDataHandle.$opportunitySelectEle.prop('disabled',true)
                    BiddingLoadDataHandle.$salePersonSelectEle.prop('disabled',true)
                    $('#bid-name').prop('disabled',true)
                    $('#bidding-customer').prop('disabled',true)
                    $('#bid-date').prop('disabled',true)
                    $('#bid-value').prop('disabled',true)
                    $('#bid-bond-value').prop('disabled',true)
                    $('#btn-open-partner-modal').prop('disabled',true)
                    $('#btn-open-document-modal').prop('disabled',true)
                    $('#btn-open-bidder-modal').prop('disabled',true)
                    $('#inp-contents').prop('disabled',true)
                    data['isDetail'] = true
                    new PrintTinymceControl().render('ad1e1c4e-2a7e-4b98-977f-88d069554657', data, false);
                }
                BiddingLoadDataHandle.loadDetail(data);
                if ($('#bid-bond-value').attr('value') && formSubmit.attr('data-method').toLowerCase() === 'put') {
                    $('#bid-guarantee').attr('disabled',false)
                    $('#bid-guarantee').attr('readonly',false)
                    $('#bid-deposit').attr('disabled',false)
                    $('#bid-deposit').attr('readonly',false)
                }
                let empCurrent = JSON.parse($('#employee_current').text());
                let systemStatus = data?.['system_status']
                loadUIBidResult(empCurrent, systemStatus)

                // file
                new $x.cls.file($('#attachment')).init({
                    name: 'attachment',
                    enable_edit: true,
                    data: data?.['attachment'],
                });
                // init workflow
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
            }
        }
    )

    BiddingLoadDataHandle.$btnAddAccount.on('click', function (e) {
        let data = []
        let dataBidderList = JSON.parse(BiddingLoadDataHandle.$bidderDataScript.attr('data-bidder-list') || '[]')
        $("#account-modal-table .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let id = $(this).data('id');
            let type = $(this).data('type');
            if(type === "bidder"){
                let is_won = false
                if (dataBidderList.find(item => item?.['bidder_account'] === id)){
                    if (dataBidderList.find(item => item?.['bidder_account'] === id)?.["is_won"]){
                        is_won=true
                    }
                }
                data.push({
                    "bidder_account": id,
                    "code": selectedRow.find(".table-row-code").text(),
                    "title": selectedRow.find(".table-row-title").text(),
                    "is_won": is_won
                })
                BiddingLoadDataHandle.loadAddBidder(data)
            }
        })
    })

    $('#bid-status-lost').on('change',function () {
         if ($(this).is(':checked')) {
            $('#cause-of-lost').attr('hidden',false)
         }
    })
    $('#bid-status-won').on('change',function () {
         if ($(this).is(':checked')) {
            $('#cause-of-lost').attr('hidden',true)
         }
    })
    $('#cause-withdrawal').on('change', function () {
        if ($(this).is(':checked')) {
            $('input[name="cause_of_lost"]').not(this).prop('checked', false);
            $('#cause-other-input').prop('disabled', true);
        }
    });
    $('#cause-other').on('change', function () {
        if ($(this).is(':checked')) {
            $('#cause-other-input').prop('disabled', false);
        } else{
            $('#cause-other-input').prop('disabled', true);
        }
    });

    $('input[name="cause_of_lost"]').not('#cause-withdrawal').on('change', function () {
        if ($(this).is(':checked')) {
            $('#cause-withdrawal').prop('checked', false);
        }
    });

    $('#btn-save-result').on('click', function () {
        let dataSubmit = {}
        dataSubmit = BiddingSubmitHandle.setupDataResult()
        console.log(dataSubmit)
        let submitFields = [
            'id',
            'cause_of_lost',
            'other_bidder',
            'other_cause',
            'bid_status'
        ]
        if (dataSubmit) {
            BiddingCommonHandle.filterFieldList(submitFields,dataSubmit);
        }
        WindowControl.showLoading();
        $.fn.callAjax2(
            {
                'url': BiddingDataTableHandle.$url.attr('data-md-result'),
                'method': 'POST',
                'data': dataSubmit,
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            }, (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            }
        )
    })

    function loadUIBidResult(empCurrent, sysStatus) {
        console.log($urlBidResultConfig)
        $.fn.callAjax2({
            url: $urlBidResultConfig,
            method: 'GET',
        }).then(
            (resp)=>{
                let dataConfig = $.fn.switcherResp(resp);
                if(dataConfig){
                    let employeeList = dataConfig?.["bidding_result_config"][0]?.["employee"]
                    // !! convert value to boolean
                    let isAllowedModify = !!employeeList.find(item => item?.["id"] === empCurrent?.["id"])
                    if(isAllowedModify && sysStatus === 3){
                        $('#btn-save-result').attr('disabled', false)
                        $('#btn-open-bidder-modal').attr('disabled', false)
                        $('#bid-status-won').attr('disabled', false)
                        $('#bid-status-lost').attr('disabled', false)
                        $('input[name="cause_of_lost"]').each(function () {
                            $(this).attr('disabled', false)
                        })
                        if($('#cause-other').is(':checked')){
                            $('#cause-other-input').prop('disabled', false);
                        }
                        BiddingDataTableHandle.$tableBidder.find('tbody tr').each(function (){
                            $(this).find(".bidder-checkbox").prop("disabled", false)
                            $(this).find("button").prop("disabled", false)
                        })
                    }
                }
            }
        );
    }
});
