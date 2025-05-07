$('document').ready(function(){
    const $tb = $('#tbl_document_approval')
    $tb.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: $tb.attr('data-url'),
            type: 'GET',
            dataSrc: "data.kms_doc_approval_list"
        },
        columns: [
            {
                data: 'code',
                render: (row) => {
                    return row
                }
            },
            {
                data: 'title',
                render: (row, index, data) => {
                    const url = $tb.attr('data-url-detail').format_url_with_uuid(data.id)
                    return row ? `<a href="${url}" target="blank">${row}</a>` : '--'
                }
            },
        ],
        rowCallback: function(row, data){
        },
    })
});