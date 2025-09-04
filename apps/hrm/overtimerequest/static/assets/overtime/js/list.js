$(document).ready(function(){
    const $tblElm = $('#overtime_request_tbl')
    $tblElm.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: $tblElm.attr('data-url'),
            dataSrc: 'data.overtime_request_list',
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
                    return row ? `<a href="${url}" target="_self">${row}</a>` : '--'
                }
            },
            {
                data: 'code',
                render: (row) =>{
                    let html = '--'
                    if (row){
                        html = `<span class="badge badge-info">${row}</span>`
                    }
                    return html
                }
            },
            {
                data: 'employee_created_data',
                render: (row) =>{
                    let name = '--';
                    if (Object.keys(row).length > 0) name = `${row.full_name}`
                    return name
                }
            },
            {
                data: 'employee_list_data',
                render: (row, type, data) =>{
                    let name = `${data['employee_inherit_data']['full_name']}`;
                    if (Object.keys(row).length > 0){
                        name = '';
                        for (let item of row) {
                            name += String.format(`<span class="badge badge-soft-indigo mr-2">{0}</span>`,
                                item['full_name']
                            )
                        }
                    }
                    return name
                }
            },
            {
                data: 'date_created',
                render: (row) =>{
                    return row ? $x.fn.reformatData(row, 'YYYY-MM-DD', 'DD/MM/YYYY') : '--'
                }
            },
            {
                data: 'system_status',
                render: (row) => {
                    return WFRTControl.displayRuntimeStatus(row);
                }
            },
        ]
    })
});