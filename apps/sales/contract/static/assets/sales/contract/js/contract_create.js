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
            let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
            if (fileIds) {
                let ids = $x.cls.file.get_val(fileIds.value, []);
                let is_current = true;
                ContractDataTableHandle.$tableFile.DataTable().clear().draw();
                for (let mediaBody of ContractLoadDataHandle.$attachment[0].querySelectorAll('.media-body')) {
                    let fileName = mediaBody.querySelector('.f-item-name');
                    let dataAdd = {
                        'id': ids[ids.length - 1],
                        'title': fileName.innerHTML,
                        'version': 1,
                        'date_created': ContractCommonHandle.getCurrentDate(),
                        'is_current': is_current,
                    };
                    ContractDataTableHandle.$tableFile.DataTable().row.add(dataAdd).draw().node();
                    is_current = false;
                }
            }
        });

        ContractDataTableHandle.$tableFile.on('click', '.set-current', function () {
            let fileIds = ContractLoadDataHandle.$attachment[0].querySelector('.dm-uploader-ids');
            if (fileIds) {
                let ids = $x.cls.file.get_val(fileIds.value, []);
            }
        });



    });
});
