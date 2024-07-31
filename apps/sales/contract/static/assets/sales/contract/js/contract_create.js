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
            let is_current = true;
            ContractDataTableHandle.$tableFile.DataTable().clear().draw();
            for (let mediaBody of ContractLoadDataHandle.$attachment[0].querySelectorAll('.media-body')) {
                let fileName = mediaBody.querySelector('.f-item-name');
                let dataAdd = {
                    'title': fileName.innerHTML,
                    'version': 1,
                    'date_created': ContractCommonHandle.getCurrentDate(),
                    'is_current': is_current,
                };
                ContractDataTableHandle.$tableFile.DataTable().row.add(dataAdd).draw().node();
                is_current = false;
            }


        });



    });
});
