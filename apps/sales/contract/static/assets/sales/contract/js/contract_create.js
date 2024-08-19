$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_contract_create');

        ContractDataTableHandle.dataTableDocument();
        ContractDataTableHandle.dataTableFile();
        ContractTinymceHandle.initTinymce();

        ContractLoadDataHandle.$btnAddDoc.on('click', function () {
            ContractLoadDataHandle.loadAddDoc();
        });

        ContractDataTableHandle.$tableDocument.on('click', '.attach-file', function () {
            ContractStoreHandle.storeAttachment();
            ContractLoadDataHandle.loadOpenAttachFile(this);
        });

        ContractDataTableHandle.$tableDocument.on('click', '.del-row', function () {
            ContractCommonHandle.commonDeleteRow(this.closest('tr'), ContractDataTableHandle.$tableDocument);
        });

        ContractLoadDataHandle.$attachment.find('input[type="file"]').on('change', '', function () {
            let dataList = ContractLoadDataHandle.loadSetupAddFile();
            ContractLoadDataHandle.loadAddFile(dataList);
        });

        ContractDataTableHandle.$tableFile.on('click', '.set-current', function () {
            let dataList = ContractLoadDataHandle.loadSetupSetCurrent(this);
            ContractLoadDataHandle.loadAddFile(dataList);
        });

// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            ContractSubmitHandle.setupDataSubmit(_form);
            let submitFields = [
                'title',
                'document_data',
            ]
            if (_form.dataForm) {
                ContractCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        });



    });
});
