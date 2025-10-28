$(document).ready(function () {
    const $table = $('#payroll_template_tbl')
    $table.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: $table.attr('data-url'),
            dataSrc: 'data.payroll_template_list',
        },
        rowIdx: true,
        pageLength: 50,
        columns: [
            {
                targets: 0,
                orderable: false,
                defaultContent: ''
            },
            {
                data: 'title',
                render: (row, type, data) => {
                    const url = $table.attr('data-detail').format_url_with_uuid(data.id)
                    return row ? `<a href="${url}" target="blank">${row}</a>` : '--'
                }
            },
            {
                data: 'code',
                render: (row) => {
                    let html = '--'
                    if (row) {
                        html = `<span class="badge badge-info">${row}</span>`
                    }
                    return html
                }
            },
            {
                data: 'employee_inherit',
                render: (row) => {
                    let time = '--';
                    if (Object.keys(row).length > 0) time = `${row.full_name}`
                    return time
                }
            },
            {
                data: 'department_applied_data',
                render: (row) => {
                    let group_lst = !row ? '--' : ''
                    for (let group of row){
                         group_lst += `<span class="badge badge-info badge-outline mr-2">${group.title}</span>`
                    }
                    return group_lst
                }
            },
            {
                data: 'date_created',
                render: (row) => {
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
})