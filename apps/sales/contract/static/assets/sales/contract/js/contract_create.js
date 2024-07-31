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

        ContractLoadDataHandle.$attachment.on('click', '.btn-primary', function () {
            let dataAdd = {
                'title': 'tap tin so 1',
                'version': 1,
                'date_created': '',
            };
            ContractDataTableHandle.$tableFile.DataTable().row.add(dataAdd).draw().node();
        });



    });
});
