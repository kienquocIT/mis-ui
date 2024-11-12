$(document).ready(function () {
     WFRTControl.setWFInitialData('bidding');

    let formSubmit = $('#frm_bidding_create');
    let transScript = $('#trans-script')

    $('#bid-date').each(function () {
        $(this).daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY',
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            autoApply: true,
            autoUpdateInput: false,
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
        });
        $(this).val('').trigger('change');
    })

    //init data only for create page
    if (formSubmit.attr('data-method').toLowerCase() === 'post') {
        new $x.cls.file($('#attachment')).init({
            name: 'attachment',
            enable_edit: true,
        });
        BiddingDataTableHandle.dataTableDocument({}, false);
        BiddingDataTableHandle.dataTableVenture({}, false);
        BiddingDataTableHandle.dataTableFile();
        BiddingDataTableHandle.dataTableDocumentModal();
        BiddingTinymceHandle.initTinymce()
        BiddingDataTableHandle.$tableDocument.on('click', '.attach-file', function () {
            BiddingStoreHandle.storeAttachment();
            BiddingLoadDataHandle.loadOpenAttachFile(this);
        });
    }

    BiddingLoadDataHandle.$btnOpenPartnerModal.on('click', function () {
        let title = transScript.attr('data-trans-modal-venture-title')
        BiddingLoadDataHandle.$modalAccount.find('.modal-title').html(title)
        BiddingLoadDataHandle.$modalAccount.attr('data-type', 'partner')
        BiddingDataTableHandle.dataTableAccountModal(true);
    })

    BiddingLoadDataHandle.$opportunitySelectEle.on('change', function () {
        BiddingLoadDataHandle.loadDataByOpportunity();
    });

    BiddingLoadDataHandle.$btnAddAccount.on('click', function (e) {
        data = []
        $("#account-modal-table .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let id = $(this).data('id');
            let type = $(this).data('type');
            if (type === "partner"){
                data.push({
                    "partner_account": id,
                    "code": selectedRow.find(".table-row-code").text(),
                    "title": selectedRow.find(".table-row-title").text(),
                })
                BiddingLoadDataHandle.loadAddVenture(data)
            } else if(type === "bidder"){
                data.push({
                    "bidder_account": id,
                    "code": selectedRow.find(".table-row-code").text(),
                    "title": selectedRow.find(".table-row-title").text(),
                })
                BiddingLoadDataHandle.loadAddBidder(data)
            }
        })
    })

    BiddingDataTableHandle.$tableVenture.on('click', '.del-row', function () {
        let row = $(this).closest('tr');

        let rowData = BiddingDataTableHandle.$tableVenture.DataTable().row(row).data();

        let checkbox = BiddingDataTableHandle.$tableAccountModal.find(`input[type="checkbox"][data-id="${rowData.partner_account}"]`);
        if (checkbox.length) {
            checkbox.prop('checked', false);
        }
        BiddingCommonHandle.commonDeleteRow(row, BiddingDataTableHandle.$tableVenture);
    });

    BiddingDataTableHandle.$tableBidder.on('click', '.del-row', function () {
        let row = $(this).closest('tr');

        let rowData = BiddingDataTableHandle.$tableBidder.DataTable().row(row).data();

        let checkbox = BiddingDataTableHandle.$tableAccountModal.find(`input[type="checkbox"][data-id="${rowData.bidder_account}"]`);
        if (checkbox.length) {
            checkbox.prop('checked', false);
        }
        BiddingCommonHandle.commonDeleteRow(row, BiddingDataTableHandle.$tableBidder);
    });

    BiddingDataTableHandle.$tableDocument.on('click', '.del-row', function () {
        Swal.fire({
            html: `<div class="mb-3">
                        <i class="fas fa-trash-alt text-danger"></i>
                   </div>
                   <h6 class="text-danger">
                        ${BiddingLoadDataHandle.$transScript.attr('data-trans-confirm-delete')}
                   </h6>`,
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-danger',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container: 'swal2-has-bg'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: BiddingLoadDataHandle.$transScript.attr('data-trans-delete'),
            cancelButtonText: BiddingLoadDataHandle.$transScript.attr('data-trans-cancel'),
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                let row = $(this).closest('tr');
                let rowData = BiddingDataTableHandle.$tableDocument.DataTable().row(row).data();
                if (rowData.isManual) {
                    let checkbox = BiddingDataTableHandle.$tableDocumentModalManual.find(`input[type="checkbox"][data-row-id="${rowData.id}"]`);
                    if (checkbox.length) {
                        checkbox.prop('checked', false);
                    }
                } else {
                    let checkbox = BiddingDataTableHandle.$tableDocumentModal.find(`input[type="checkbox"][data-id="${rowData.document_type}"]`);
                    if (checkbox.length) {
                        checkbox.prop('checked', false);
                    }
                }
                BiddingCommonHandle.commonDeleteRow(row, BiddingDataTableHandle.$tableDocument);
            }
        })
    });

    BiddingLoadDataHandle.$btnOpenDocModal.on('click',function (){
        BiddingStoreHandle.storeAttachment()
    })

    BiddingLoadDataHandle.$btnAddDoc.on('click', function () {
        data = []
        let dataDocList = JSON.parse(BiddingLoadDataHandle.$docDataScript.attr('data-doc-list') || '[]')
        $("#document-modal-table .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let document_type = $(this).data('id');
            let attachmentData =[]
            if (dataDocList.find(item => item?.['document_type'] === document_type)){
                attachmentData = dataDocList.find(item => item?.['document_type'] === document_type ).attachment_data
            }

            data.push({
                "document_type": document_type,
                "title": selectedRow.find(".table-row-title").text(),
                "attachment_data": attachmentData,
                "isManual": false
            })
        })
        $("#document-modal-table-manual .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let id = $(this).data('row-id');
            let attachmentData =[]
            if (dataDocList.find(item => item?.['id'] === id)){
                attachmentData = dataDocList.find(item => item?.['id'] === id).attachment_data
            }

            data.push({
                "id": id,
                "title": selectedRow.find(".table-row-title").val(),
                "attachment_data": attachmentData,
                "isManual": true
            })
        })

        BiddingLoadDataHandle.$fileArea.attr('doc-id',null);
        BiddingLoadDataHandle.loadAddDocument(data);
    })

    BiddingLoadDataHandle.$btnAddDocManual.on('click', function () {
        BiddingLoadDataHandle.loadAddDocumentManual();
    })

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

    $('#bid-bond-value').on('focus',function () {
        $('#bid-guarantee').attr('disabled',false)
        $('#bid-guarantee').attr('readonly',false)
        $('#bid-deposit').attr('disabled',false)
        $('#bid-deposit').attr('readonly',false)
    })

    let validator = SetupFormSubmit.call_validate(formSubmit, {

        onsubmit: true,
        submitHandler: function (form, event) {
            let _form = new SetupFormSubmit(formSubmit);
            BiddingSubmitHandle.setupDataSubmit(_form)
            const bidBondValue = $("#bid-bond-value").attr('value');
            const isSecurityChecked = $("input[name='security_type']:checked").length === 0
            if (bidBondValue && isSecurityChecked){
                $.fn.notifyB({description: "Please select a security type if Bid Bond Value has data."}, 'failure');
                return
            }
            let submitFields = [
                'title',
                'attachment',
                'opportunity',
                'document_data',
                'venture_partner',
                'bid_value' ,
                'bid_date',
                'employee_inherit_id',
                'tinymce_content',
            ]
            if (_form.dataForm) {
                BiddingCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form)
        },
    })
})