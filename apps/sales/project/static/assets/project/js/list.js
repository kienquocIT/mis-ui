$(document).ready(function(){
    const $EmTable = $('#project_tb');
    // load employee table
    $EmTable.DataTableDefault({
        ajax: {
            url: $EmTable.attr('data-url'),
            type: "GET",
            dataSrc: 'data.project_list',
        },
        useDataServer: true,
        info: true,
        pageLength: 50,
        autoWidth: true,
        scrollX: true,
        columns: [
            {
                data: 'code',
                width: '10%',
                class: 'text-center',
                render: (row, type, data) => {
                    const url = $EmTable.attr('data-detail').format_url_with_uuid(data.id)
                    return row ? `<a href="${url}">${row}</a>` : '--'
                }
            },
            {
                data: 'title',
                width: '25%',
                class: 'text-center',
                render: (row) => {
                    return `${row ? row : '--'}`
                }
            },
            {
                data: 'start_date',
                width: '15%',
                class: 'text-center',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = moment(row).format('DD/MM/YYYY')
                    return txt
                }
            },
            {
                data: 'finish_date',
                width: '15%',
                class: 'text-center',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = moment(row).format('DD/MM/YYYY')
                    return txt
                }
            },
            {
                data: 'completion_rate',
                width: '10%',
                class: 'text-center',
                render: (row) => {
                    return `${row}%`
                }
            },
            {
                data: 'works',
                width: '15%',
                class: 'text-center',
                render: (row, index, data) => {
                    let txt = '--'
                    if (row) txt = `${row?.['all']} (${row?.['completed']})`
                    return txt
                }
            },
            {
                data: 'tasks',
                width: '15%',
                class: 'text-center',
                render: (row, index, data) => {
                    let txt = '--'
                    if (row) txt = `${row?.['all']} (${row?.['completed']})`
                    return txt
                }
            },
            {
                data: 'id',
                width: '10%',
                render: (row, index, data) => {
                    let txt = $('.table_btn').html();
                    return txt
                }
            },
        ]
    })
});