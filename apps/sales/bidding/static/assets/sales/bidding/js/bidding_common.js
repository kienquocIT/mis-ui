class BiddingLoadDataHandle {
    static $btnAddAccount = $('#btn-add-account')
    static $btnAddDoc = $('#btn-add-document')
    static $btnAddDocManual = $('#btn-add-document-manual')
    static $attachment = $('#attachment');
    static $attachmentTmp = $('#attachment-tmp');
    static $remark = $('#bidding-doc-remark');
    static $fileArea = $('#file-area');
    static $customerEle = $('#bidding-customer')
    static $opportunitySelectEle = $('#opportunity_id');
    static $salePersonSelectEle = $('#employee_inherit_id');
    static $transScript = $('#trans-script')
    static $docDataScript = $('#doc-data-script')
    static $partnerDataScript = $('#partner-data-script')
    static $bidderDataScript = $('#bidder-data-script')
    static $btnOpenDocModal = $('#btn-open-document-modal')
    static $btnOpenPartnerModal = $('#btn-open-partner-modal')
    static $btnOpenBidderModal = $('#btn-open-bidder-modal')
    static $modalAccount = $('#modal-account')
    static loadAddVenture(data) {
        BiddingDataTableHandle.$tableVenture.DataTable().clear().draw();
        for (const dataRow of data) {
            let TotalOrder = BiddingDataTableHandle.$tableVenture[0].querySelectorAll('.table-row-order').length;
            dataRow.order = TotalOrder + 1;
            BiddingDataTableHandle.$tableVenture.DataTable().row.add(dataRow).draw().node();
        }
    };
    static loadAddBidder(data) {
        BiddingDataTableHandle.$tableBidder.DataTable().clear().draw();
        for (const dataRow of data) {
            let TotalOrder = BiddingDataTableHandle.$tableBidder[0].querySelectorAll('.table-row-order').length;
            dataRow.order = TotalOrder + 1;
            BiddingDataTableHandle.$tableBidder.DataTable().row.add(dataRow).draw().node();
        }
    };
    static loadAddDocument(data) {
        let dataDocList = JSON.parse(BiddingLoadDataHandle.$docDataScript.attr('data-doc-list') || '[]')
        BiddingDataTableHandle.$tableDocument.DataTable().clear().draw();
        for (const dataRow of data) {
            let TotalOrder = BiddingDataTableHandle.$tableDocument[0].querySelectorAll('.table-row-order').length;
            dataRow.order = TotalOrder + 1;
            BiddingDataTableHandle.$tableDocument.DataTable().row.add(dataRow).draw().node();
            if(dataRow.isManual){
                if (!dataDocList.find(item => item?.['id'] === dataRow.id)){
                    dataDocList.push(dataRow);
                }
            } else {
                if (!dataDocList.find(item => item?.['document_type'] === dataRow.document_type)){
                    dataDocList.push(dataRow);
                }
            }
        }

        BiddingLoadDataHandle.$docDataScript.attr('data-doc-list',JSON.stringify(dataDocList))

    };
    static loadAddDocumentManual() {
        let TotalOrder = BiddingDataTableHandle.$tableDocumentModalManual[0].querySelectorAll('.table-row-order').length;
        let order = TotalOrder + 1;
        let dataAdd = {
            "id": order + "manual",
            "title": "",
        }
        BiddingDataTableHandle.$tableDocumentModalManual.DataTable().row.add(dataAdd).draw().node();
    }
    static loadDataByOpportunity() {
        if ($(BiddingLoadDataHandle.$opportunitySelectEle).val()) {
            let dataSelected = SelectDDControl.get_data_from_idx(BiddingLoadDataHandle.$opportunitySelectEle, $(BiddingLoadDataHandle.$opportunitySelectEle).val());
            if (dataSelected) {
                BiddingLoadDataHandle.$customerEle.val(dataSelected?.['customer']?.['name'])
            }
        }
    };

    //CSS
    static loadCssToDtb(tableID) {
        let tableIDWrapper = tableID + '_wrapper';
        let tableWrapper = document.getElementById(tableIDWrapper);
        if (tableWrapper) {
            let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
            if (headerToolbar) {
                headerToolbar.classList.add('hidden');
            }
            let footerToolbar = tableWrapper.querySelector('.tbl-footer-toolbar');
            if (footerToolbar) {
                footerToolbar.classList.add('hidden');
            }
        }
    };

    // FILE
    static loadOpenAttachFile(ele, enableEdit) {
        BiddingDataTableHandle.$tableDocument.DataTable().rows().every(function () {
            let row = this.node();
            $(row).css('background-color', '');
            $('#btn-attach-invite-doc').closest('.form-control').css('background-color', '');
        });
        let row = ele.closest('tr');
        if (row) {
            $(row).css('background-color', '#ebfcf5');
            BiddingLoadDataHandle.$fileArea[0].classList.remove('bg-light');
            let eleId = ''
            let isManual = row.querySelector('.attach-file').getAttribute('data-is-manual')
            if (isManual==='false'){
                eleId = row.querySelector('.attach-file').getAttribute('data-doctype-id');
            } else {
                eleId = row.querySelector('.attach-file').getAttribute('data-id');
            }
            BiddingLoadDataHandle.$fileArea[0].setAttribute('doc-id', eleId);
            BiddingLoadDataHandle.$fileArea[0].setAttribute('doc-is-manual', isManual);
            BiddingLoadDataHandle.$remark[0].removeAttribute('readonly');
            BiddingLoadDataHandle.$remark.val('');
            BiddingLoadDataHandle.loadAddFile([]);
            let fileIds = BiddingLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
            if (fileIds) {
                fileIds.value = "";
            }
            if (ele.getAttribute('data-store') && fileIds) {
                let dataStore = JSON.parse(ele.getAttribute('data-store'));
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
                    enable_edit: enableEdit,
                    enable_download: enableEdit,
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
        }
    };

    static loadAddFile(dataList) {
        if (dataList) {
            BiddingDataTableHandle.$tableFile.DataTable().clear().draw();
            BiddingDataTableHandle.$tableFile.DataTable().rows.add(dataList).draw();
        }
        return true;
    };

    static loadSetupAddFile() {
        let result = [];
        let order = 1;
        for (let mediaBody of BiddingLoadDataHandle.$attachment[0].querySelectorAll('.media-body')) {
            let fileName = mediaBody.querySelector('.f-item-name');
            let fileSize = mediaBody.querySelector('.f-item-info');
            if (fileName && fileSize) {
                let dataAdd = {
                    'attachment': {
                        'file_name': fileName.innerHTML,
                        'file_size': parseFloat(fileSize.innerHTML.replace(" KB", "")),
                    },
                    'date_created': BiddingCommonHandle.getCurrentDate(),
                    'order': order,
                };
                result.push(dataAdd);
            }
            order += 1;
        }
        return result;
    };

    static loadOpenBtnAttachInviteDoc(element, enableEdit){
        BiddingStoreHandle.storeAttachment()
        BiddingDataTableHandle.$tableDocument.DataTable().rows().every(function () {
            let row = this.node();
            $(row).css('background-color', '');
        });
        $(element).closest('.form-control').css('background-color', '#ebfcf5');
        let eleId = element.id
        let isManual = element.getAttribute('data-is-manual')
        BiddingLoadDataHandle.$fileArea[0].setAttribute('doc-id', eleId);
        BiddingLoadDataHandle.$fileArea[0].setAttribute('doc-is-manual', isManual);
        BiddingLoadDataHandle.$remark[0].removeAttribute('readonly');
        BiddingLoadDataHandle.$remark.val('');
        BiddingLoadDataHandle.loadAddFile([]);
        let fileIds = BiddingLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
        if (fileIds) {
            fileIds.value = "";
        }
        if (!element.getAttribute('data-store')) {
            let data = {
                "id": eleId,
                "title": '',
                "attachment_data": [],
                "isManual": true
            }
            element.setAttribute('data-store', JSON.stringify(data))
        }
        if (fileIds) {
            let dataStore = JSON.parse(element.getAttribute('data-store'));
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
                enable_edit: enableEdit,
                enable_download: enableEdit,
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
    };

    //DETAIL
    static loadDetail(data) {
         new $x.cls.bastionField({
            has_opp: true,
            has_inherit: true,
            has_process: true,
            has_prj: true,
            data_opp: data?.['opportunity']?.['id'] ? [
                {
                    "id": data?.['opportunity']?.['id'],
                    "title": data?.['opportunity']?.['title'] || '',
                    "code": data?.['opportunity']?.['code'] || '',
                    "selected": true,
                }
            ] : [],
            data_process: data?.['process']?.['id'] ? [
                {
                    "id": data?.['process']?.['id'],
                    "title": data?.['process']?.['title'] || '',
                    "selected": true,
                }
            ] : [],
            data_process_stage_app: data?.['process_stage_app']?.['id'] ? [
                {
                    "id": data?.['process_stage_app']?.['id'],
                    "title": data?.['process_stage_app']?.['title'] || '',
                    "selected": true,
                }
            ] : [],
            data_inherit: data?.['employee_inherit']?.['id'] ? [
                {
                    "id": data?.['employee_inherit']?.['id'],
                    "full_name": data?.['employee_inherit']?.['full_name'] || '',
                    "code": data?.['employee_inherit']?.['code'] || '',
                    "selected": true,
                }
            ] : [],
             "oppFlagData": {"disabled": true},
             "prjFlagData": {"disabled": true},
             "inheritFlagData": {"disabled": true},
             "processFlagData": {"disabled": true},
             "processStageAppFlagData": {"disabled": true},
        }).init();
        $('#bid-name').val(data?.['title']);
        BiddingLoadDataHandle.$customerEle.val(data?.['customer']?.['title'])
        $('#bid-value').attr('value', data?.['bid_value']);
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
            let dateData = data?.['bid_date']
            if (dateData) {
                dateData = $x.fn.reformatData(dateData, $x.cls.datetime.defaultFormatDate, 'DD/MM/YYYY', moment().format('DD/MM/YYYY'));
            }
            $(this).val(dateData).trigger('change');
        })
        $('#bid-bond-value').attr('value', data?.['bid_bond_value']);
        let securityType = data?.['security_type']
        $(`input[name="security_type"][value="${securityType}"]`).prop('checked', true)

        //load bidding documents
        let dataBiddingDocument = data?.['attachment_m2m'].find(item => item['is_invite_doc'] === true)
        $('#btn-attach-invite-doc').attr('data-store', JSON.stringify(dataBiddingDocument))

        let bidStatus = data?.['bid_status']
        $(`input[name="bid_status"][value="${bidStatus}"]`).prop('checked', true)
        //if bid is lost
        if (bidStatus===2){
            let causeOfLost = data?.['cause_of_lost']
            $('#cause-of-lost').attr('hidden',false)
            $('input[name="cause_of_lost"]').each(function () {
                let val = parseInt($(this).val())
                if(causeOfLost.includes(val)){
                    $(this).prop('checked',true)
                }
                if(val===4){
                    $(`input[name="other_cause"]`).val(data?.['other_cause'])
                }
            })
        }

        for (let i=0;i<data?.['venture_partner']?.length;i++){
            data['venture_partner'][i]['order'] = i+1
        }
        BiddingDataTableHandle.dataTableVenture(data?.['venture_partner'], data['isDetail'])

        for (let i=0;i<data?.['other_bidder']?.length;i++){
            data['other_bidder'][i]['order'] = i+1
        }
        BiddingDataTableHandle.dataTableBidder(data?.['other_bidder'], data['isDetail'])

        let bids = data?.['attachment_m2m'].filter(item => item['is_invite_doc'] !== true)
        BiddingLoadDataHandle.setupDetailDocAttach(data['attachment_m2m'])
        BiddingDataTableHandle.dataTableDocument(bids, data['isDetail'])
        BiddingDataTableHandle.dataTableDocumentModal(bids)

        // data for documents, partner, other bidders
        BiddingLoadDataHandle.$docDataScript.attr('data-doc-list', JSON.stringify(data['attachment_m2m']))
        BiddingLoadDataHandle.$partnerDataScript.attr('data-partner-list', JSON.stringify(data['venture_partner']))
        BiddingLoadDataHandle.$bidderDataScript.attr('data-bidder-list', JSON.stringify(data['other_bidder']))

        BiddingTinymceHandle.initTinymce(data?.['tinymce_content'])
        $.fn.initMaskMoney2()
    };

    static setupDetailDocAttach(data) {
        if (data?.['document_data']) {
            for (let dataDoc of data?.['document_data']) {
                if (dataDoc?.['attachment_data']) {
                    for (let attachData of dataDoc?.['attachment_data']) {
                        if (data?.['attachment']) {
                            for (let attach of data?.['attachment']) {
                                if (attachData?.['attachment']?.['id'] === attach?.['id']) {
                                    attachData['attachment'] = attach;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    };
}

class BiddingDataTableHandle {
    static $tableAccountModal = $('#account-modal-table');
    static $tableDocumentModal = $('#document-modal-table');
    static $tableDocumentModalManual = $('#document-modal-table-manual');
    static $tableVenture = $('#datatable-venture');
    static $tableBidder = $('#datatable-bidder');
    static $tableDocument = $('#datatable-document');
    static $url = $('#app-url-factory');
    static $tableFile = $('#datatable-bidding-file');

    static dataTableAccountModal(isPartner) {
        let data = isPartner ?  {"is_partner_account": true} : {"is_competitor_account": true}
        let ids = []
        if(isPartner){
            BiddingDataTableHandle.$tableVenture.find('.table-row-order').each(function () {
                let partnerAccountId = $(this).data('partner_account');
                if (partnerAccountId) {
                    ids.push(partnerAccountId);
                }
            })

        } else {
            BiddingDataTableHandle.$tableBidder.find('.table-row-order').each(function () {
                let bidderAccountId = $(this).data('bidder_account');
                if (bidderAccountId) {
                    ids.push(bidderAccountId);
                }
            })
        }
        if ($.fn.DataTable.isDataTable(BiddingDataTableHandle.$tableAccountModal)) {
            BiddingDataTableHandle.$tableAccountModal.DataTable().destroy();
        }
        BiddingDataTableHandle.$tableAccountModal.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: BiddingDataTableHandle.$url.attr('data-md-account'),
                type: "GET",
                data: data,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('account_for_bidding_list')) {
                        return resp.data['account_for_bidding_list'] ? resp.data['account_for_bidding_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            ordering: false,
            paging: true,
            scrollY: '50vh',
            scrollX: true,
            scrollCollapse: true,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '10%',
                    class: 'text-center',
                    render: (data, type, row) => {
                        let checked = ids.includes(row.id) ? "checked":""
                        return `<input data-type=${isPartner ? "partner" : "bidder"} type="checkbox" class="form-check-checkbox" data-id="${row.id}" ${checked}>`;
                    }
                },
                {
                    targets: 1,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="table-row-code">${row.code}</div>`;
                    }
                },
                {
                    targets: 2,
                    width: '80%',
                    render: (data, type, row) => {
                        return `<div class="table-row-title">${row.name}</div>`;
                    }
                },
            ],
        })
    }

    static dataTableDocumentModal(data) {
        let manualData = data ? data.filter(item => item.isManual === true) : []
        let checkedMasterDoc = data ? data.filter(item => item.isManual === false) : []
        BiddingDataTableHandle.$tableDocumentModal.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: BiddingDataTableHandle.$url.attr('data-md-document'),
                type: "GET",
                data: {doc_type_category: 'bidding'},
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('document_masterdata_bidding_list')) {
                        return resp.data['document_masterdata_bidding_list'] ? resp.data['document_masterdata_bidding_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            scrollY: '30vh',
            scrollX: true,
            scrollCollapse: true,
            ordering: false,
            paging: false,
            columns: [
                {
                    targets: 0,
                    width: '10%',
                    class: 'text-center',
                    render: (data, type, row) => {
                        let checked = checkedMasterDoc.find(item=>item.document_type===row.id) ? 'checked' : ''
                        return `<input type="checkbox" class="form-check-checkbox table-row-order" data-id=${row?.id} ${checked}>`;
                    }
                },
                {
                    targets: 1,
                    width: '90%',
                    render: (data, type, row) => {
                        return `<div class="table-row-title">${row.title}</div>`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                BiddingLoadDataHandle.loadCssToDtb(BiddingDataTableHandle.$tableDocumentModal[0].id);

            },
        })
        BiddingDataTableHandle.$tableDocumentModalManual.DataTableDefault({
            data: manualData ? manualData : [],
            scrollY: '30vh',
            scrollX: true,
            scrollCollapse: true,
            ordering: false,
            paging: false,
            columns: [
                {
                    targets: 0,
                    width: '10%',
                    class: 'text-center',
                    render: (data, type, row) => {
                        return `<input type="checkbox" class="form-check-checkbox table-row-order" data-row-id=${row?.id} checked>`;
                    }
                },
                {
                    targets: 1,
                    width: '90%',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-title required" value="${row?.['title'] ? row?.['title'] : ''}">`;
                    }
                },
            ],
            drawCallback: function () {
                // add css to Dtb
                BiddingLoadDataHandle.loadCssToDtb(BiddingDataTableHandle.$tableDocumentModalManual[0].id);
            },
        })
    }

    static dataTableVenture(data, isDetail=false) {
        BiddingDataTableHandle.$tableVenture.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-order" data-partner_account="${row?.partner_account}">${row.order}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<div class="table-row-code">${row.code}</div>`;
                    }
                },
                {
                    targets: 2,
                    width: '65%',
                    render: (data, type, row) => {
                        return `<div class="table-row-title">${row.title}</div>`;
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    class: 'text-center',
                    render: (data, type, row) => {
                        let checked = row?.["is_leader"] ? "checked" : ""
                        return `<input type="checkbox" class="form-check-checkbox venture-checkbox" ${checked}>`;
                    }
                },
                {
                    targets: 4,
                    class: 'text-center',
                    width: '10%',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" >
                                    <span class="icon"><i class="far fa-trash-alt"></i></span>
                                </button>`;
                    }
                },
            ],
            drawCallback: function () {
                $('.venture-checkbox').on('change', function () {
                    // Deselect all other checkboxes
                    $('.venture-checkbox').not(this).prop('checked', false);
                });
            },
            initComplete: function (){
                BiddingDataTableHandle.$tableVenture.find('tbody tr').each(function (){
                    if (isDetail){
                        $(this).find(".venture-checkbox").prop("disabled", true)
                        $(this).find("button").prop("disabled", true)
                    }
                })
            }
        })
    }

    static dataTableBidder(data, isDetail=false) {
        BiddingDataTableHandle.$tableBidder.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-order" data-bidder_account="${row?.bidder_account}">${row.order}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '15%',
                    render: (data, type, row) => {
                        return `<div class="table-row-code">${row.code}</div>`;
                    }
                },
                {
                    targets: 2,
                    width: '65%',
                    render: (data, type, row) => {
                        return `<div class="table-row-title">${row.title}</div>`;
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    class: 'text-center',
                    render: (data, type, row) => {
                        let checked = row?.["is_won"] ? "checked" : ""
                        return `<input type="checkbox" class="form-check-checkbox bidder-checkbox" ${checked}>`;
                    }
                },
                {
                    targets: 4,
                    class: 'text-center',
                    width: '10%',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" >
                                    <span class="icon"><i class="far fa-trash-alt"></i></span>
                                </button>`;
                    }
                },
            ],
            drawCallback: function () {
                $('.bidder-checkbox').on('change', function () {
                    // Deselect all other checkboxes
                    $('.bidder-checkbox').not(this).prop('checked', false);
                });
            },
            initComplete: function (){
                BiddingDataTableHandle.$tableBidder.find('tbody tr').each(function (){
                    if (isDetail){
                        $(this).find(".bidder-checkbox").prop("disabled", true)
                        $(this).find("button").prop("disabled", true)
                    }
                })
            }
        })
    }

    static dataTableDocument(data, isDetail=false) {
        BiddingDataTableHandle.$tableDocument.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<span class="table-row-order">${row?.order}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '75%',
                    render: (data, type, row) => {
                        return `<div class="table-row-title">${row.title}</div>`;
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    class: 'text-center',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-center">
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover attach-file" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom" 
                                        data-store="${JSON.stringify(row).replace(/"/g, "&quot;")}" 
                                        data-order="${row?.['order']}"
                                        data-id = "${row?.['id']}"
                                        data-doctype-id="${row?.document_type}"
                                        data-is-manual=${row?.isManual}
                                    >
                                            <span class="icon"><i class="fas fa-paperclip"></i></span>
                                    </button>
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom"
                                    >
                                        <span class="icon"><i class="far fa-trash-alt"></i></span>
                                    </button>
                                </div>`;
                    }
                },
            ],
            drawCallback: function () {
            },
            initComplete: function (){
                BiddingDataTableHandle.$tableDocument.find('tbody tr').each(function (){
                    if (isDetail){
                        $(this).find(".del-row").prop("disabled", true)
                    }
                })
            }
        })
    }

    static dataTableFile(data) {
        BiddingDataTableHandle.$tableFile.DataTableDefault({
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            columns: [
                {
                    targets: 0,
                    width: '60%',
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<span class="table-row-order" data-row="${dataRow}" hidden>${row?.['order'] ? row?.['order'] : 0}</span><span class="table-row-title" data-row="${dataRow}">${row?.['attachment']?.['file_name'] ? row?.['attachment']?.['file_name'] : ''}</span>`;
                    }
                },
                {
                    targets: 1,
                    width: '40%',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                    }
                }
            ],
            drawCallback: function () {
            },
        });
    };
}

// Store data
class BiddingStoreHandle {
    static storeAttachment() {
        let isInviteDoc = false
        let doc = BiddingLoadDataHandle.$fileArea.attr('doc-id');
        if (doc === 'btn-attach-invite-doc'){
            isInviteDoc = true
        }
        let dataStore = {};
        let fileData = [];
        dataStore['remark'] = BiddingLoadDataHandle.$remark.val();
        let fileIds = BiddingLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
        if (fileIds) {
            let ids = $x.cls.file.get_val(fileIds.value, []).slice().reverse()
            if (ids.length > 0) {
                let result = [];
                let order = 1;
                for (let mediaBody of BiddingLoadDataHandle.$attachment[0].querySelectorAll('.media-body')) {
                    let fileName = mediaBody.querySelector('.f-item-name');
                    let fileSize = mediaBody.querySelector('.f-item-info');
                    if (fileName && fileSize) {
                        let dataAdd = {
                            'attachment': {
                                'id': ids[order - 1],
                                'file_name': fileName.innerHTML,
                                'file_size': parseFloat(fileSize.innerHTML.replace(" KB", "")),
                            },
                            'date_created': BiddingCommonHandle.getCurrentDate(),
                            'order': order,
                        };
                        result.push(dataAdd);
                    }
                    order += 1;
                }
                fileData = result
            }
        }
        dataStore['attachment_data'] = fileData;

        let isManual = BiddingLoadDataHandle.$fileArea.attr('doc-is-manual');
        let dataDocList = JSON.parse(BiddingLoadDataHandle.$docDataScript.attr('data-doc-list') || '[]')

        if(isInviteDoc){
            let btnStore = $('#btn-attach-invite-doc')
            let doc_data = dataDocList.find(item => item.id === doc)
            if(doc_data){
                doc_data['attachment_data'] = fileData
            }
            btnStore.attr('data-store', JSON.stringify(dataStore));
            BiddingLoadDataHandle.$docDataScript.attr('data-doc-list',JSON.stringify(dataDocList))
            return
        }
        if (doc) {
            let btnStore = null
            if(isManual==='false'){
               let doc_data = dataDocList.find(item => item.document_type === doc)
                if(doc_data){
                    doc_data['attachment_data'] = fileData
                }
                btnStore = BiddingDataTableHandle.$tableDocument[0].querySelector(`.attach-file[data-doctype-id="${doc}"]`);
            } else {
                let doc_data = dataDocList.find(item => item.id === doc)
                if(doc_data){
                    doc_data['attachment_data'] = fileData
                }
                btnStore = BiddingDataTableHandle.$tableDocument[0].querySelector(`.attach-file[data-id="${doc}"]`);
            }
            if (btnStore) {
                btnStore.setAttribute('data-store', JSON.stringify(dataStore));
            }
            BiddingLoadDataHandle.$docDataScript.attr('data-doc-list',JSON.stringify(dataDocList))
        }
    };
}

class BiddingCommonHandle {
    static commonDeleteRow(currentRow, $table) {
        BiddingCommonHandle.deleteRow(currentRow, $table);
        BiddingCommonHandle.reOrderTbl($table);
        return true;
    };

    static reOrderTbl($table) {
        let itemCount = $table[0].querySelectorAll('.table-row-order').length;
        if (itemCount === 0) {
            $table.DataTable().clear().draw();
        } else {
            let order = 1;
            for (let eleOrder of $table[0].querySelectorAll('.table-row-order')) {
                if (eleOrder.getAttribute('data-row')) {
                    let dataRow = JSON.parse(eleOrder.getAttribute('data-row'));
                    dataRow['order'] = order;
                }
                eleOrder.innerHTML = order;
                order++
                if (order > itemCount) {
                    break;
                }
            }
        }
        return true;
    };

    static deleteRow(currentRow, $table) {
        let rowIdx = $table.DataTable().row(currentRow).index();
        let row = $table.DataTable().row(rowIdx);
        row.remove().draw();
        return true;
    };

    static getCurrentDate() {
        let currentDate = new Date();
        let day = String(currentDate.getDate()).padStart(2, '0');
        let month = String(currentDate.getMonth() + 1).padStart(2, '0');
        let year = currentDate.getFullYear();
        return `${year}-${month}-${day}`;
    }

     static filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }
}

class BiddingSubmitHandle {
    static setupDataDocument() {
        let result = [];
        let attachmentAll = [];
        BiddingDataTableHandle.$tableDocument.DataTable().rows().every(function () {
            let row = this.node();
            let eleOrd = row.querySelector('.table-row-order');
            let eleTitle = row.querySelector('.table-row-title');
            let btnAttach = row.querySelector('.attach-file');
            let isManual= this.data().isManual
            let document_type_id = !isManual ? this.data().document_type : null
            let remark = ''
            if (eleOrd && eleTitle && btnAttach) {
                let attachment_data = [];
                if (btnAttach.getAttribute('data-store')) {
                    let dataStore = JSON.parse(btnAttach.getAttribute('data-store'));
                    remark = dataStore['remark']
                    attachment_data = dataStore?.['attachment_data'];
                    for (let attach of dataStore?.['attachment_data']) {
                        attachmentAll.push(attach?.['attachment']?.['id']);
                    }
                }
                result.push({
                    'title': eleTitle.innerHTML,
                    'remark':remark,
                    'document_type': document_type_id,
                    'attachment_data': attachment_data,
                    'order': parseInt(eleOrd.innerHTML),
                    'isManual': isManual
                })
            }
        });
        let attachment_data = []
        let btnAttach = $('#btn-attach-invite-doc');
        let remark = ''
        if (btnAttach.attr('data-store')) {
            let dataStore = JSON.parse(btnAttach.attr('data-store'));
            remark = dataStore['remark']
            attachment_data = dataStore?.['attachment_data'];
            for (let attach of dataStore?.['attachment_data']) {
                attachmentAll.push(attach?.['attachment']?.['id']);
            }
        }
        result.push({
            'title': 'Tài liệu đấu thầu',
            'remark':remark,
            'attachment_data': attachment_data,
            'is_invite_doc': true,
            'isManual': true,
            'document_type': null,
            'order': 1
        })
        return {'dataDoc': result, 'attachment': attachmentAll}
    };

    static setupDataPartner(){
        let result = [];
        BiddingDataTableHandle.$tableVenture.DataTable().rows().every(function () {
            let data = {}
            let row = this.node();
            let isLeader = row.querySelector('.venture-checkbox').checked;
            let eleOrd = row.querySelector('.table-row-order');
            data['order'] = parseInt(eleOrd.innerHTML)
            data['id'] = this.data().id ? this.data().id : null
            data['partner_account'] = this.data().partner_account;
            data['is_leader'] = isLeader;
            result.push(data)
        })
        return result
    }

    static setupDataBidder(){
        let result = [];
        BiddingDataTableHandle.$tableBidder.DataTable().rows().every(function () {
            let data = {}
            let row = this.node();
            let isWon = row.querySelector('.bidder-checkbox').checked;
            let eleOrd = row.querySelector('.table-row-order');
            data['id'] = this.data().id ? this.data().id : null
            data['order'] = parseInt(eleOrd.innerHTML)
            data['bidder_account'] = this.data().bidder_account;
            data['is_won'] = isWon;
            result.push(data)
        })
        return result
    }

    static setupDataResult(){
        let data = {}
        data["id"] =  $.fn.getPkDetail()
        data["other_bidder"] = BiddingSubmitHandle.setupDataBidder()
        let causeOfLost = []
         $('input[name="cause_of_lost"]').each(function () {
            if ($(this).is(':checked')) {
                causeOfLost.push($(this).val());
            }
        });
        data["cause_of_lost"] = causeOfLost
        data["bid_status"] = $('input[name="bid_status"]:checked').val();
        if (causeOfLost.includes('4')){
            data["other_cause"] = $('input[name="other_cause"]').val();
        } else {
            data["other_cause"] = ""
        }
        return data
    }

    static setupDataSubmit(_form) {
        BiddingStoreHandle.storeAttachment();
        let dataDocParse = BiddingSubmitHandle.setupDataDocument();
        let dataPartner = BiddingSubmitHandle.setupDataPartner();
        _form.dataForm['document_data'] = dataDocParse?.['dataDoc'];
        _form.dataForm['attachment'] = dataDocParse?.['attachment'];
        _form.dataForm['venture_partner'] = dataPartner
        _form.dataForm['tinymce_content'] = BiddingTinymceHandle.getContent();
        if(!_form.dataForm?.['bid_date']){
            _form.dataForm['bid_date']=null
        } else {
            let tmpDate = _form.dataForm['bid_date'];
            _form.dataForm['bid_date'] = tmpDate.split('/').reverse().join('-');
        }
        _form.dataForm['bid_value'] = $('#bid-value').attr('value')
        _form.dataForm['bid_bond_value'] = $('#bid-bond-value').attr('value')
        if(! _form.dataForm['security_type'] || ! _form.dataForm['bid_bond_value']){
            _form.dataForm['security_type'] = 0
        }
        _form.dataForm['opportunity'] = _form.dataForm['opportunity_id']
        delete _form.dataForm['opportunity_id']
    };
}

class BiddingTinymceHandle {
    static initTinymce(htmlContent = '') {
        tinymce.init({
            selector: 'textarea#inp-contents',
            plugins: 'paste importcss autolink autosave save directionality code visualblocks visualchars fullscreen lists',
            menubar: false,  // Hide the menubar
            toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | numlist bullist | removeformat',
            toolbar_sticky: true,
            autosave_ask_before_unload: false,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: false,
            autosave_retention: '2m',
            image_advtab: false,  // Disable advanced image options
            importcss_append: true,
            height: 400,
            quickbars_selection_toolbar: 'bold italic underline | fontselect fontsizeselect',
            noneditable_noneditable_class: 'mceNonEditable',
            toolbar_mode: 'sliding',  // Toolbar slides to fit smaller screens
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            setup: function (editor) {
                // Set content when the editor is initialized
                editor.on('init', function () {
                    editor.setContent(htmlContent);
                });
            }
        });
    };

    static getContent() {
        return tinymce.get('inp-contents').getContent();
    };
}