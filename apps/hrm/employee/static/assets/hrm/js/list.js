$(document).ready(function () {
    const $EmTable = $('#datable_employee_info_list')
    var _table = $EmTable.DataTableDefault({
        ajax: {
            url: $EmTable.attr('data-url'),
            type: "GET",
            dataSrc: 'data.employee_info_list',
        },
        useDataServer: true,
        info: true,
        pageLength: 50,
        autoWidth: false,
        scrollX: true,
        rowIdx: true,
        columns: [
            {
                targets: 0,
                orderable: false,
                width: '5%',
                defaultContent: ''
            },
            {
                data: 'employee',
                width: '30%',
                class: 'text-center',
                render: (row, type, data) => {
                    let badge = '--';
                    if (row?.id)
                        badge = `<span class="badge badge-soft-blue">${row.code}</span>`
                    return badge
                }
            },
            {
                data: 'employee',
                class: 'text-center',
                width: '25%',
                render: (row, index, data) =>{
                    const url = $EmTable.attr('data-url-detail').format_url_with_uuid(data.id)
                    return `<a href="${url}" class="text-link">${row.full_name}</a>`
                }
            },
            {
                data: 'user',
                width: '30%',
                class: 'text-center',
                render: (row) => {
                    let badge = '--';
                    if (row?.id) badge = `<span class="badge badge-soft-primary">${row.id}</span>`
                    return badge
                }
            },
            {
                data: 'date_joined',
                width: '10%',
                class: 'text-center',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = moment(row).format('DD/MM/YYYY')
                    return txt
                }
            }
        ],
        rowCallback: function (row) {
        },
    })
});