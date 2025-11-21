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
        cusFilter: [{
            dataUrl: $urlFact.attr('data-filter_employee'),
            keyResp: 'employee_list',
            keyText: 'full_name',
            keyParam: "employee_inherit__in",
            placeholder: $('#trans-factory').attr('data-employee_filter_head'),
            multiple: true,
        },],
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
                    return `<a href="${url}" target="blank">${row ? row : '--'}</a>`
                }
            },
            {
                data: 'employee_inherit',
                render: (row, type, data) => {
                    let time = '--';
                    if (Object.keys(row).length > 0) time = `${row.full_name}`
                    return time
                },
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
                render: (data, type, row) => {
                    return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                }
            },
        ]
    })
})