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
        const {
            opp_id,
            opp_title,
            opp_code,
            process_id,
            process_title,
            process_stage_app_id,
            process_stage_app_title,
            inherit_id,
            inherit_title,
        } = $x.fn.getManyUrlParameters([
            'opp_id', 'opp_title', 'opp_code',
            'process_id', 'process_title',
            'process_stage_app_id', 'process_stage_app_title',
            'inherit_id', 'inherit_title',
        ])

        new $x.cls.bastionField({
            has_opp: true,
            has_inherit: true,
            has_process: true,
            has_prj: true,
            data_opp: $x.fn.checkUUID4(opp_id) ? [
                {
                    "id": opp_id,
                    "title": $x.fn.decodeURI(opp_title),
                    "code": $x.fn.decodeURI(opp_code),
                    "selected": true,
                }
            ] : [],
            data_process: $x.fn.checkUUID4(process_id) ? [
                {
                    "id": process_id,
                    "title": process_title,
                    "selected": true,
                }
            ] : [],
            data_process_stage_app: $x.fn.checkUUID4(process_stage_app_id) ? [
                {
                    "id": process_stage_app_id,
                    "title": process_stage_app_title,
                    "selected": true,
                }
            ] : [],
            data_inherit: $x.fn.checkUUID4(inherit_id) ? [
                {
                    "id": inherit_id,
                    "full_name": inherit_title,
                    "selected": true,
                }
            ] : [],
            opp_call_trigger_change: true,
            inherit_call_trigger_change: true
        }).init();
        BiddingDataTableHandle.dataTableDocument({}, false);
        BiddingDataTableHandle.dataTableVenture({}, false);
        BiddingDataTableHandle.dataTableFile();
        BiddingDataTableHandle.dataTableDocumentModal();
        BiddingTinymceHandle.initTinymce()
        BiddingDataTableHandle.$tableDocument.on('click', '.attach-file', function () {
            BiddingStoreHandle.storeAttachment();
            BiddingLoadDataHandle.loadOpenAttachFile(this, true);
        });
    }

    BiddingLoadDataHandle.$btnOpenPartnerModal.on('click', function () {
        let data = BiddingSubmitHandle.setupDataPartner()
        BiddingLoadDataHandle.$partnerDataScript.attr('data-partner-list', JSON.stringify(data))
        let title = transScript.attr('data-trans-modal-venture-title')
        BiddingLoadDataHandle.$modalAccount.find('.modal-title').html(title)
        BiddingLoadDataHandle.$modalAccount.attr('data-type', 'partner')
        BiddingDataTableHandle.dataTableAccountModal(true);
    })

    BiddingLoadDataHandle.$opportunitySelectEle.on('change', function () {
        BiddingLoadDataHandle.loadDataByOpportunity();
    });

    BiddingLoadDataHandle.$btnAddAccount.on('click', function (e) {
        let data = []
        let dataPartnerList = JSON.parse(BiddingLoadDataHandle.$partnerDataScript.attr('data-partner-list') || '[]')
        $("#account-modal-table .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let id = $(this).data('id');
            let type = $(this).data('type');
            if (type === "partner"){
                let is_leader = false
                if (dataPartnerList.find(item => item?.['partner_account'] === id)){
                    if (dataPartnerList.find(item => item?.['partner_account'] === id)?.["is_leader"]){
                        is_leader=true
                    }
                }
                data.push({
                    "partner_account": id,
                    "code": selectedRow.find(".table-row-code").text(),
                    "title": selectedRow.find(".table-row-title").text(),
                    "is_leader": is_leader
                })
                BiddingLoadDataHandle.loadAddVenture(data)
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
        let isCreatePage = formSubmit.attr('data-method').toLowerCase() === 'post'
        BiddingLoadDataHandle.loadOpenBtnAttachInviteDoc(this, isCreatePage)
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
            const isSecurityChecked = $("input[name='security_type']:checked").length !== 0
            if (bidBondValue && !isSecurityChecked){
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
                'bid_bond_value',
                'security_type',
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