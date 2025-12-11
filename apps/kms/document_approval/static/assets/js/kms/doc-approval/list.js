$(document).ready(function(){
    const $tb = $('#tbl_document_approval')
    $tb.DataTableDefault({
        useDataServer: true,
        autoWidth: true,
        scrollX: true,
        ajax: {
            url: $tb.attr('data-url'),
            type: 'GET',
            dataSrc: "data.kms_doc_approval_list"
        },
        columns: [
            {
                data: 'code',
                width: '30%',
                render: (row) => {
                    return row ? row : '--'
                }
            },
            {
                data: 'title',
                width: '30%',
                render: (row, index, data) => {
                    const url = $tb.attr('data-url-detail').format_url_with_uuid(data.id)
                    return row ? `<a href="${url}" target="blank">${row}</a>` : '--'
                }
            },
            {
                data: 'remark',
                width: '30%',
                render: (row) => {
                    return row ? row : '--'
                }
            },
            {
                data: 'system_status',
                width: '10%',
                render: (row) =>{
                    if (!row) row = 1
                    let sttTxt = JSON.parse($('#stt_sys').text())
                    const sttData = [
                        "soft-light",
                        "soft-primary",
                        "soft-info",
                        "soft-success",
                        "soft-danger",
                    ]
                    return `<span class="badge badge-${sttData[row]}">${sttTxt[row][1]}</span>`;
                }
            }
        ],
        rowCallback: function(row, data){
        },
    })
});