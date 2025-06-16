$('document').ready(function(){
    const $tb = $('#tbl_incoming_document')
    $tb.DataTableDefault({
        useDataServer: true,
        rowIndex: true,
        autoWidth: true,
        scrollX: true,
        ajax: {
            url: $tb.attr('data-url'),
            type: 'GET',
            dataSrc: "data.incoming_document_list"
        },
        columns: [
            {
                width: '5%',
                render: (row) => {
                    return ""
                }
            },
            {
                data: 'management_number',
                width: '16%',
                render: (row) => {
                    return row ? row : '--'
                }
            },
            {
                data: 'original_number',
                width: '16%',
                render: (row, index, data) => {
                    const url = $tb.attr('data-url-detail').format_url_with_uuid(data.id)
                    return row ? `<a href="${url}" target="blank">${row}</a>` : '--'
                }
            },
            {
                data: 'name',
                width: '21%',
                render: (row) => {
                    return row ? row : '--'
                }
            },
            {
                data: 'sender',
                width: '16%',
                render: (row) => {
                    return row ? row : '--'
                }
            },
            {
                data: 'incoming_date',
                width: '16%',
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