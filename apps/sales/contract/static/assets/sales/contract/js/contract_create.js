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

        ContractLoadDataHandle.$attachment.on('change', '.dm-uploader-ids', function () {
            let dataAdd = {
                'title': 'tap tin so 1',
                'version': 1,
                'date_created': '',
            };
            ContractDataTableHandle.$tableFile.DataTable().row.add(dataAdd).draw().node();
        });



    });
});
