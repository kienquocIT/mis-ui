$(document).ready(function(){
    const $tblElm = $('#business_trip_request_tbl')
    $tblElm.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: $tblElm.attr('data-url'),
            dataSrc: 'data.business_trip_request',
        },
        rowIdx: true,
        pageLength:50,
        columns: [
            {
                targets: 0,
                orderable: false,
                defaultContent: ''
            },
            {
                data: 'title',
                render: (row, type, data)=>{
                    const url = $tblElm.attr('data-detail').format_url_with_uuid(data.id)
                    return row ? `<a href="${url}" target="blank">${row}</a>` : '--'
                }
            },
            {
                data: 'code',
                render: (row, type, data) =>{
                    let html = '--'
                    if (row){
                        html = `<span class="badge badge-info">${row}</span>`
                    }
                    return html
                }
            },
            {
                data: 'employee_inherit',
                render: (row, type, data) =>{
                    let time = '--';
                    if (Object.keys(row).length > 0) time = `${row.full_name}`
                    return time
                }
            },
            {
                data: 'date_f',
                render: (row, type, data) =>{
                    return row ? $x.fn.reformatData(row, 'YYYY-MM-DD', 'DD/MM/YYYY') : '--'
                }
            },
            {
                data: 'date_t',
                render: (row, type, data) =>{
                    return row ? $x.fn.reformatData(row, 'YYYY-MM-DD', 'DD/MM/YYYY') : '--'
                }
            },
            {
                data: 'system_status',
                render: (row, type, data) => {
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
            },
        ]
    })
});