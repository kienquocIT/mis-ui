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
                render: (row, type, data) => {
                    const url = $EmTable.attr('data-detail').format_url_with_uuid(data.id)
                    return row ? `<a href="${url}">${row}</a>` : '--'
                }
            },
            {
                data: 'title',
                width: '25%',
                render: (row) => {
                    return `${row ? row : '--'}`
                }
            },
            {
                data: 'start_date',
                width: '15%',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = moment(row).format('YYYY/MM/DD')
                    return txt
                }
            },
            {
                data: 'finish_date',
                width: '15%',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = moment(row).format('YYYY/MM/DD')
                    return txt
                }
            },
            {
                data: 'completion_rate',
                width: '10%',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = `${row}%`
                    return txt
                }
            },
            {
                data: 'works',
                width: '15%',
                render: (row, index, data) => {
                    let txt = '--'
                    if (row) txt = `${row?.['all']} (${row?.['completed']})`
                    return txt
                }
            },
            {
                data: 'tasks',
                width: '15%',
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
        ],
        rowCallback: function (row, data, index) {
            $(row).on('click', function(){
                if ($(this).hasClass('selected')) $(this).removeClass('selected');
                else{
                    ListByUserHandle.callToolsListData(data.id)
                    $(this).parents('table').find('tr').removeClass('selected')
                    $(this).addClass('selected')
                    if (window.isMobile && $(window).width() < 1024){
                        $('.content_left').removeClass('is_active')
                        $('#employee_tbl_wrapper').slideToggle()
                    }
                }
            })
        }
    })
});