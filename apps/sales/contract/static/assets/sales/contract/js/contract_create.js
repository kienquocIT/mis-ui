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

        ContractLoadDataHandle.$boxOpp.on('change', function () {
            ContractLoadDataHandle.loadDataByOpp();
        });

        ContractLoadDataHandle.$btnAddDoc.on('click', function () {
            ContractLoadDataHandle.loadAddDoc();
        });

        ContractDataTableHandle.$tableDocument.on('click', '.open-attach', function () {
            ContractStoreHandle.storeAttachment();
            ContractLoadDataHandle.loadOpenAttach(this);
        });

        ContractDataTableHandle.$tableDocument.on('click', '.del-row', function () {
            ContractCommonHandle.commonDeleteRow(this.closest('tr'), ContractDataTableHandle.$tableDocument);
        });

        ContractLoadDataHandle.$attachment.on('click', '.set-current', function () {
            ContractLoadDataHandle.loadSetCurrent(this);
        });

// SUBMIT FORM
        SetupFormSubmit.validate(formSubmit, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

        function submitHandlerFunc() {
            let _form = new SetupFormSubmit(formSubmit);
            ContractSubmitHandle.setupDataSubmit(_form);
            let submitFields = [
                'title',
                'opportunity_id',
                'opportunity_data',
                'employee_inherit_id',
                'employee_inherit_data',
                'document_data',
                'attachment',
                'abstract_content',
                'trade_content',
                'legal_content',
                'payment_content',
            ]
            if (_form.dataForm) {
                ContractCommonHandle.filterFieldList(submitFields, _form.dataForm);
            }
            WFRTControl.callWFSubmitForm(_form);
        }


    });
});
