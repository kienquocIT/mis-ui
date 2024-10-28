$(document).ready(function () {
    let formSubmit = $('#frm_bidding_create');
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
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
        });
        $(this).val('').trigger('change');
    })
    if (formSubmit.attr('data-method').toLowerCase() === 'post') {
        new $x.cls.file($('#attachment')).init({
            name: 'attachment',
            enable_edit: true,
        });
    }
    WFRTControl.setWFInitialData('bidding');
    BiddingTinymceHandle.initTinymce()
    BiddingDataTableHandle.dataTableVentureModal();
    BiddingDataTableHandle.dataTableDocumentModal();
    BiddingDataTableHandle.dataTableDocument();
    BiddingDataTableHandle.dataTableVenture();
    BiddingDataTableHandle.dataTableFile();
    BiddingLoadDataHandle.loadInitCustomer();

    BiddingLoadDataHandle.$opportunitySelectEle.on('change', function () {
            BiddingLoadDataHandle.loadDataByOpportunity();
        });

    BiddingLoadDataHandle.$btnAddVenture.on('click', function(e){
        data = []
        $("#venture-modal-table .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let id = $(this).data('id');
            data.push({
                "id": id,
                "code": selectedRow.find(".table-row-code").text(),
                "title": selectedRow.find(".table-row-title").text(),
            })
        })
        BiddingLoadDataHandle.loadAddVenture(data)
    })

    BiddingDataTableHandle.$tableVenture.on('click', '.del-row', function () {
        let row = $(this).closest('tr');

        let rowData = BiddingDataTableHandle.$tableVenture.DataTable().row(row).data();

        let checkbox = BiddingDataTableHandle.$tableVentureModal.find(`input[type="checkbox"][data-id="${rowData.id}"]`);
        if (checkbox.length) {
            checkbox.prop('checked', false);
        }

        BiddingCommonHandle.commonDeleteRow(row, BiddingDataTableHandle.$tableVenture);

    });

    BiddingDataTableHandle.$tableDocument.on('click', '.del-row', function () {
        let row = $(this).closest('tr');
        let rowData = BiddingDataTableHandle.$tableDocument.DataTable().row(row).data();
        console.log(rowData)
        if (rowData.isManual) {
            let checkbox = BiddingDataTableHandle.$tableDocumentModalManual.find(`input[type="checkbox"][data-id="${rowData.id}"]`);
            if (checkbox.length) {
                checkbox.prop('checked', false);
            }
        } else {
            let checkbox = BiddingDataTableHandle.$tableDocumentModal.find(`input[type="checkbox"][data-id="${rowData.id}"]`);
            if (checkbox.length) {
                checkbox.prop('checked', false);
            }
        }
        BiddingCommonHandle.commonDeleteRow(row, BiddingDataTableHandle.$tableDocument);
    });

    BiddingLoadDataHandle.$btnAddDoc.on('click',function(){
        data = []
        $("#document-modal-table .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let id = $(this).data('id');
            data.push({
                "id": id,
                "title": selectedRow.find(".table-row-title").text(),
                "attachment_data": [],
                "isManual": false
            })
        })
        $("#document-modal-table-manual .form-check-checkbox:checked").each(function (e) {
            let selectedRow = $(this).closest("tr");
            let id = $(this).data('id');
            data.push({
                "id": id,
                "title": selectedRow.find(".table-row-title").val(),
                "attachment_data": [],
                "isManual": true
            })
        })
        console.log(data)
        BiddingLoadDataHandle.loadAddDocument(data);
    })

    BiddingLoadDataHandle.$btnAddDocManual.on('click',function(){
        BiddingLoadDataHandle.loadAddDocumentManual();
    })

    BiddingDataTableHandle.$tableDocument.on('click', '.attach-file', function () {
            BiddingStoreHandle.storeAttachment();
            BiddingLoadDataHandle.loadOpenAttachFile(this);
        });

    formSubmit.submit(function (e) {
        e.preventDefault();
        let _form = new SetupFormSubmit(formSubmit);
        BiddingSubmitHandle.setupDataSubmit(_form);
        console.log(_form)
        // let submitFields = [
        //     'title',
        //     'document_data',
        //     'attachment',
        //     'tinymce_content',
        // ]
        // if (_form.dataForm) {
        //     ContractCommonHandle.filterFieldList(submitFields, _form.dataForm);
        // }
        // WFRTControl.callWFSubmitForm(_form);
    });
})