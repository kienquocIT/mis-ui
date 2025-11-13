$(document).ready(function(){
    const $tblElm = $('#asset_return_tb')
    $tblElm.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: $tblElm.attr('data-url'),
            dataSrc: 'data.asset_return_list',
        },
        pageLength:50,
        autoWidth: true,
        scrollX: true,
        columns: [
            {
                data: 'title',
                width: '35%',
                render: (row, type, data)=>{
                    const url = $tblElm.attr('data-detail').format_url_with_uuid(data.id)
                    return row ? `<a href="${url}" target="blank">${row}</a>` : '--'
                }
            },
            {
                data: 'code',
                width: '10%',
                render: (row) =>{
                    let html = '--'
                    if (row){
                        html = `<span class="badge badge-info">${row}</span>`
                    }
                    return html
                }
            },
            {
                data: 'employee_created',
                width: '15%',
                render: (row) =>{
                    let time = '--';
                    if (Object.keys(row).length > 0) time = `${row.full_name}`
                    return time
                }
            },
            {
                data: 'employee_inherit',
                width: '15%',
                render: (row) =>{
                    let time = '--';
                    if (Object.keys(row).length > 0) time = `${row.full_name}`
                    return time
                }
            },
            {
                data: 'date_created',
                width: '15%',
                render: (row) =>{
                    return row ? $x.fn.reformatData(row, 'YYYY-MM-DD', 'DD/MM/YYYY') : '--'
                }
            },
            {
                data: 'system_status',
                width: '10%',
                render: (row) => {
                    return WFRTControl.displayRuntimeStatus(row);
                }
            },
        ]
    })
});