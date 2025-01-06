$(document).ready(function(){
    const $EmTable = $('#project_tb');
    const status_data = [
        {txt: $.fn.gettext("Draft"), cls: "soft-secondary"},
        {txt: $.fn.gettext("Created"), cls: "soft-primary"},
        {txt: $.fn.gettext("Added"), cls: "soft-warning"},
        {txt: $.fn.gettext("Finish"), cls: "soft-success"},
        {txt: $.fn.gettext("Cancel"), cls: "soft-dark"},
    ]
    // load employee table
    var _table = $EmTable.DataTableDefault({
        ajax: {
            url: $EmTable.attr('data-url'),
            type: "GET",
            dataSrc: 'data.project_list',
        },
        useDataServer: true,
        info: true,
        pageLength: 50,
        autoWidth: false,
        scrollX: true,
        rowIdx: true,
        columns: [
            {
                data: 'baseline',
                width: '1%',
                orderable: false,
                defaultContent: '',
            },
            {
                data: 'code',
                width: '9%',
                render: (row, type, data) => {
                    const url = $EmTable.attr('data-detail').format_url_with_uuid(data.id)
                    let badge = '';
                    if (data.baseline.count > 0){
                        badge = `<span class="badge-child badge-child-blue proj-badge"><img src="${
                        $('#url-factory').attr('data-img-url')}" alt="baseline">${data.baseline.count}</span>`
                    }
                    let html = `<span class="badge badge-primary position-relative">${row}${badge}</span>`
                    let htmlCode = `<a href="${url}" class="link-primary underline_hover">${html}</a>`
                    if(data.baseline.count > 0)
                        htmlCode += `<span class="btn-sh-baseline"><i class="fas fa-chevron-right"></i></span>`;
                    return htmlCode
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
                data: 'employee_inherit',
                width: '17%',
                class: 'text-center',
                render: (row) => {
                    return row ? row?.['full_name'] : '--'
                }
            },
            {
                data: 'start_date',
                width: '10%',
                class: 'text-center',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = moment(row).format('DD/MM/YYYY')
                    return txt
                }
            },
            {
                data: 'finish_date',
                width: '10%',
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
                width: '5%',
                class: 'text-center',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = `${row?.['all']} (${row?.['completed']})`
                    return txt
                }
            },
            {
                data: 'tasks',
                width: '5%',
                class: 'text-center',
                render: (row) => {
                    let txt = '--'
                    if (row) txt = `${row?.['all']} (${row?.['completed']})`
                    return txt
                }
            },
            {
                data: 'system_status',
                width: '8%',
                class: 'text-center',
                render: (row) => {
                    const status_data = {
                        1: {txt: $.fn.gettext("Created"), cls: "soft-primary"},
                        2: {txt: $.fn.gettext("Reopened"), cls: "soft-warning"},
                        3: {txt: $.fn.gettext("Finish"), cls: "soft-success"},
                        4: {txt: $.fn.gettext("Closed"), cls: "soft-danger"},
                    }
                    return `<span class="badge badge-${status_data[row]['cls']}">${status_data[row]['txt']}</span>`;
                }
            },
        ],
        rowCallback: function (row) {
            $('.btn-sh-baseline', row).on('click', function (e) {
                e.preventDefault();
                let tr = $(this).parents('tr');
                tr.toggleClass('active')
                let row = _table.row(tr);
                if (row.child.isShown()) row.child.hide();
                else{
                    row.child(handleBaseline.BaselineFormat(row.data().baseline['project_data'])).show();
                }
            });
        },
    })

    class handleBaseline{
        static BaselineFormat(d){
            let tr = ``;
            for (let item of d.reverse()){
                let url = $('#url-factory').attr('data-baseline-url').format_url_with_uuid(item.id)
                let badge = `<span class="badge-child badge-child-blue justify-content-center">${item.version}</span>`
                tr += `<tr class="baseline_tr"><td style="width: 1%"><span style="user-select: none;color:transparent">1</span></td>`+
                    `   <td style="width: 9%"><a href="${url}" target="_blank"><span class="badge badge-outline badge-soft-primary position-relative">${item.code}${badge}</span><a/></td>`+
                    `   <td style="width: 25%;"><p style="white-space: pre-wrap">${ item.title}</p></td>`+
                    `   <td style="width: 17%;text-align:center"><span>${item['project_pm'].full_name}</span></td>`+
                    `   <td style="width: 10%;text-align:center"><span>${moment(item.start_date).format('DD/MM/YYYY')}</span></td>`+
                    `   <td style="width: 10%;text-align:center"><span>${moment(item.finish_date).format('DD/MM/YYYY')}</span></td>`+
                    `   <td style="width: 10%;text-align:center"><span>${item['completion_rate']}%</span></td>`+
                    `   <td style="width: 5%;text-align:center"><span>${item['works']['all']} (${item['works']['completed']})</span></td>`+
                    `   <td style="width: 5%;text-align:center"><span>${item['tasks']?.['all']} (${item['tasks']?.['completed']})</span></td>`+
                    ` <td style="width: 8%;text-align:center"><span class="badge badge-${status_data[item.system_status]['cls']}">${status_data[item.system_status]['txt']}</span></td></tr>`
            }
            return $(`${tr}`)
        }
    }
});