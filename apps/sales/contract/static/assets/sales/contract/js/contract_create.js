$(function () {

    $(document).ready(function () {

        let formSubmit = $('#frm_contract_create');

        ContractLoadDataHandle.loadCustomCss();
        ContractDataTableHandle.dataTableDocument();

        if (formSubmit.attr('data-method').toLowerCase() === 'post') {
            ContractTinymceHandle.initTinymce('', 'abstract-content');
            ContractTinymceHandle.initTinymce('', 'trade-content');
            ContractTinymceHandle.initTinymce('', 'legal-content');
            ContractTinymceHandle.initTinymce('', 'payment-content');
        }
        WFRTControl.setWFInitialData('contractapproval');

        // file
        if (formSubmit.attr('data-method').toLowerCase() === 'post') {
            new $x.cls.file($('#attachment')).init({
                name: 'attachment',
                enable_edit: true,
            });
        }

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

        ContractLoadDataHandle.$attachment.on('click', '.set-current', function () {
            ContractLoadDataHandle.loadSetCurrent(this);
        });

// SUBMIT FORM
        formSubmit.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit(formSubmit);
            ContractSubmitHandle.setupDataSubmit(_form);
            let submitFields = [
                'title',
                'document_data',
                'attachment',
                'tinymce_content',
            ]
            if (_form.dataForm) {
                ContractCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        });



    });
});
