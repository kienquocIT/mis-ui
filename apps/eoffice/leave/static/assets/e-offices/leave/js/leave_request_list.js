$(document).ready(function () {
    const $leave_tbl = $('#leave_request_tbl');
    const $urlFact = $('#url-factory')
    $leave_tbl.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: $urlFact.attr('data-leave-list'),
            dataSrc: 'data.leave_request',
        },
        rowIdx: true,
        pageLength: 50,
        autoWidth: true,
        scrollX: true,
        columns: [
            {
                targets: 0,
                orderable: false,
                defaultContent: ''
            },
            {
                data: 'title',
                render: (row, type, data) => {
                    const url = $urlFact.attr('data-leave-detail').format_url_with_uuid(data.id)
                    return row ? `<a href="${url}" target="blank">${row}</a>` : '--'
                }
            },
            {
                data: 'employee_inherit',
                render: (row, type, data) => {
                    let time = '--';
                    if (Object.keys(row).length > 0) time = `${row.full_name}`
                    return time
                }
            },
            {
                data: 'code',
                render: (row, type, data) => {
                    let html = '--'
                    if (row) {
                        html = `<span class="badge badge-info">${row}</span>`
                    }
                    return html
                }
            },
            {
                data: 'start_day',
                render: (row, type, data) => {
                    return row ? moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'
                }
            },
            {
                data: 'total',
                render: (row, type, data) => {
                    return row ? row : '--'
                }
            },
            {
                data: 'system_status',
                render: (row, type, data) => {
                    const status_data = [
                        {txt: "Draft", cls: "soft-light"},
                        {txt: "Created", cls: "soft-primary"},
                        {txt: "Added", cls: "soft-info"},
                        {txt: "Finish", cls: "soft-success"},
                        {txt: "Cancel", cls: "soft-danger"},
                    ]
                    return `<span class="badge badge-${status_data[row]['cls']}">${status_data[row]['txt']}</span>`;
                }
            },
        ]
    })
})