$(function () {

    $(document).ready(function () {

        ContractDataTableHandle.dataTableDocument();
        ContractDataTableHandle.dataTableFile();

        ContractLoadDataHandle.$btnAddDoc.on('click', function () {
            ContractLoadDataHandle.loadAddDoc();
        });

        ContractDataTableHandle.$tableDocument.on('click', '.attach-file', function () {
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



    });
});
