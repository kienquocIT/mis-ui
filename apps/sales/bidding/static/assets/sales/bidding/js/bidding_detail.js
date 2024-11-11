$(document).ready(function () {
    let formSubmit = $('#frm_bidding_create');
    BiddingDataTableHandle.dataTableFile();
    BiddingDataTableHandle.$tableDocument.on('click', '.attach-file', function () {
        BiddingStoreHandle.storeAttachment();
        BiddingLoadDataHandle.loadOpenAttachFile(this);
    });
    let transScript = $('#trans-script')
    // $('#btn-attach-invite-doc').on('click', function () {
    //     BiddingStoreHandle.storeAttachment()
    //     BiddingDataTableHandle.$tableDocument.DataTable().rows().every(function () {
    //         let row = this.node();
    //         $(row).css('background-color', '');
    //     });
    //     $(this).closest('.form-control').css('background-color', '#ebfcf5');
    //     let eleId = this.id
    //     let isManual = this.getAttribute('data-is-manual')
    //     BiddingLoadDataHandle.$fileArea[0].setAttribute('doc-id', eleId);
    //     BiddingLoadDataHandle.$fileArea[0].setAttribute('doc-is-manual', isManual);
    //     BiddingLoadDataHandle.$remark[0].removeAttribute('readonly');
    //     BiddingLoadDataHandle.$remark.val('');
    //     BiddingLoadDataHandle.loadAddFile([]);
    //     let fileIds = BiddingLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
    //     if (fileIds) {
    //         fileIds.value = "";
    //     }
    //     if(!this.getAttribute('data-store')){
    //         let data = {
    //             "id": eleId,
    //             "title": '',
    //             "attachment_data": [],
    //             "isManual": true
    //         }
    //         this.setAttribute('data-store', JSON.stringify(data))
    //     }
    //      if (fileIds) {
    //          let dataStore = JSON.parse(this.getAttribute('data-store'));
    //         BiddingLoadDataHandle.$remark.val(dataStore?.['remark']);
    //         BiddingLoadDataHandle.loadAddFile(dataStore?.['attachment_data']);
    //         console.log(dataStore?.['attachment_data'])
    //          let ids = [];
    //         for (let fileData of dataStore?.['attachment_data']) {
    //             ids.push(fileData?.['attachment']?.['id']);
    //         }
    //         let fileIds = BiddingLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
    //         fileIds.value = ids.join(',');
    //         let attachmentParse = [];
    //         for (let attachData of dataStore?.['attachment_data']) {
    //             attachmentParse.push(attachData?.['attachment']);
    //         }
    //         // append html file again
    //         BiddingLoadDataHandle.$attachment.empty().html(`${BiddingLoadDataHandle.$attachmentTmp.html()}`);
    //         // init file again
    //         new $x.cls.file(BiddingLoadDataHandle.$attachment).init({
    //             name: 'attachment',
    //             enable_edit: true,
    //             enable_download: true,
    //             data: attachmentParse,
    //         });
    //         // add event
    //         let inputs = BiddingLoadDataHandle.$attachment[0].querySelectorAll('input[type="file"]');
    //
    //         inputs.forEach((input) => {
    //             input.addEventListener('change', function () {
    //                 let dataList = BiddingLoadDataHandle.loadSetupAddFile();
    //                 BiddingLoadDataHandle.loadAddFile(dataList);
    //             });
    //         });
    //      }
    //      BiddingLoadDataHandle.$attachment[0].removeAttribute('hidden');
    // });

    $('#btn-attach-invite-doc').on('click', function () {
        BiddingStoreHandle.storeAttachment();
        BiddingLoadDataHandle.handleAttachFileEvent(this);
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
                BiddingLoadDataHandle.loadDetail(data);
                if (formSubmit.attr('data-method').toLowerCase() !== 'put') {
                    BiddingLoadDataHandle.$btnOpenBidderModal.on('click', function () {
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
                } else {
                    if ($('#bid-bond-value').attr('value')) {
                        $('#bid-guarantee').attr('disabled',false)
                        $('#bid-guarantee').attr('readonly',false)
                        $('#bid-deposit').attr('disabled',false)
                        $('#bid-deposit').attr('readonly',false)
                    }
                }
                let empCurrent = JSON.parse($('#employee_current').text());
                console.log(empCurrent)
                let isCreatedUser = empCurrent?.["id"] === data?.["employee_created_id"]
                if(isCreatedUser && (data?.['system_status'] === 3)){
                    $('#btn-save-result').attr('disabled', false)
                    $('#btn-open-bidder-modal').attr('disabled', false)
                    $('#bid-status-won').attr('disabled', false)
                    $('#bid-status-lost').attr('disabled', false)
                }
                // file
                new $x.cls.file($('#attachment')).init({
                    name: 'attachment',
                    enable_edit: true,
                    data: data?.['attachment'],
                });
                // init workflow
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                // get WF initial zones for change
            }
        }
    )

    BiddingLoadDataHandle.$btnAddAccount.on('click', function (e) {
        data = []
        $("#account-modal-table .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let id = $(this).data('id');
            let type = $(this).data('type');
            if(type === "bidder"){
                data.push({
                    "bidder_account": id,
                    "code": selectedRow.find(".table-row-code").text(),
                    "title": selectedRow.find(".table-row-title").text(),
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
});
