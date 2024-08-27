$(document).ready(function(){
    const $EmTable = $('#project_baseline_tb'), $urlFact = $('#url-factory');
    const status_data = [
        {txt: $.fn.gettext("Draft"), cls: "soft-secondary"},
        {txt: $.fn.gettext("Created"), cls: "soft-primary"},
        {txt: $.fn.gettext("Added"), cls: "soft-warning"},
        {txt: $.fn.gettext("Finish"), cls: "soft-success"},
        {txt: $.fn.gettext("Cancel"), cls: "soft-dark"},
    ]
    // load project baseline table
    $EmTable.DataTableDefault({
        ajax: {
            url: $EmTable.attr('data-url'),
            type: "get",
            dataSrc: 'data.baseline_list',
        },
        useDataServer: true,
        info: true,
        pageLength: 50,
        autoWidth: true,
        scrollX: true,
        cusFilter: [
            {
                dataUrl: $urlFact.attr('data-filter_employee'),
                keyResp: 'employee_list',
                keyText: 'full_name',
                keyParam: "project_related__employee_inherit__id",
                placeholder: $.fn.gettext('By Project owner'),
                params: "{'list_from_app':'project.project.view'}",
            },
            {
                keyParam: "system_status",
                placeholder: $.fn.gettext('By System status'),
                allowClear: true,
                keyText: "text",
                data: [
                    {
                        'id': 0,
                        'text': status_data[0]['txt'],
                    },
                    {
                        'id': 1,
                        'text': status_data[1]['txt'],
                    },
                    {
                        'id': 2,
                        'text': status_data[2]['txt'],
                    },
                    {
                        'id': 3,
                        'text': status_data[3]['txt'],
                    },
                    {
                        'id': 4,
                        'text': status_data[4]['txt'],
                    },
                    {
                        'id': '',
                        'text': '',
                    },
                ],
            },
        ],
        columns: [
            {
                data: 'project_data',
                width: '5%',
                render: (row, type, data) => {
                    const _code = row.code,
                        _url = $urlFact.attr('data-baseline-url').format_url_with_uuid(data.project_data.id);
                    let html = `<span class="badge badge-primary position-relative">${_code}</span>`
                    return row ? `<a href="${_url}" class="link-primary underline_hover">${html}</a>` : '--'
                }
            },
            {
                data: 'project_data',
                width: '30%',
                render: (row) => {
                    return row.title
                }
            },
            {
                data: 'project_data',
                width: '15%',
                render: (row, type, data) => {
                    return row?.['employee_inherit'] ? row?.['employee_inherit'].full_name : '--'
                }
            },
            {
                data: 'project_data',
                width: '10%',
                class: 'text-center',
                render: (row) => {
                    // start_date
                    let txt = '--'
                    if (row) txt = moment(row.start_date).format('DD/MM/YYYY')
                    return txt
                }
            },
            {
                data: 'project_data',
                width: '10%',
                class: 'text-center',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = moment(row.finish_date).format('DD/MM/YYYY')
                    return txt
                }
            },
            {
                data: 'project_data',
                width: '15%',
                class: 'text-center',
                render: (row) => {
                    const comRate = row?.['completion_rate']
                    let percent = 100
                    if (comRate > 0) percent = 100 - comRate
                    let txt = `<div class="d-flex justify-content-center align-items-center gap-2">` +
                        `<div class="bar-percent" style="width: ${comRate ? 100 : 0}%" ${comRate ? '' : 'hidden'
                        }><span style="left: -${percent}%"></span></div><b>${row?.['completion_rate']}%</b></div>`
                    return txt
                }
            },
            {
                data: 'date_created',
                width: '5%',
                class: 'text-center',
                render: (row, index, data) => {
                    let txt = '--'
                    if (row) txt = moment(row).format('DD/MM/YYYY')
                    return txt
                }
            },
            {
                data: 'system_status',
                width: '10%',
                class: 'text-center',
                render: (row, type, data) => {
                    return `<span class="badge badge-${status_data[row]['cls']}">${status_data[row]['txt']}</span>`;
                }
            },
        ],
    })
});