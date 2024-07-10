$(document).ready(function(){
    const $EmTable = $('#project_tb');
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
        autoWidth: true,
        scrollX: true,
        columns: [
            {
                data: 'baseline',
                width: '3%',
                render:  (row, type, data) => {
                    let btn = `<button class="btn-sh-baseline btn-flush-primary btn btn-icon btn-rounded flush-soft-hover" ${row.count === 0 ? 'disabled': ''}><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button>`
                    return btn
                }
            },
            {
                data: 'code',
                width: '7%',
                render: (row, type, data) => {
                    const url = $EmTable.attr('data-detail').format_url_with_uuid(data.id)
                    let badge = '', btn = ''
                    if (data.baseline.count > 0){
                        badge = `<span class="badge-child badge-child-blue proj-badge"><img src="${
                        $('#url-factory').attr('data-img-url')}" alt="baseline">${data.baseline.count}</span>`
                    }
                    let html = `<span class="badge badge-primary position-relative">${row}${badge}</span>`
                    return row ? `<a href="${url}" class="link-primary underline_hover">${html}</a>` : '--'
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
                width: '10%',
                class: 'text-center',
                render: (row, type, data) => {
                    return row ? row?.['full_name'] : '--'
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
                width: '5%',
                class: 'text-center',
                render: (row, index, data) => {
                    let txt = '--'
                    if (row) txt = `${row?.['all']} (${row?.['completed']})`
                    return txt
                }
            },
            {
                data: 'tasks',
                width: '5%',
                class: 'text-center',
                render: (row, index, data) => {
                    let txt = '--'
                    if (row) txt = `${row?.['all']} (${row?.['completed']})`
                    return txt
                }
            },
            {
                data: 'id',
                width: '5%',
                render: (row, index, data) => {
                    let txt = $('.table_btn').html();
                    return txt
                }
            },
        ],
        rowCallback: function (row, data) {
            $('.btn-sh-baseline', row).on('click', function (e) {
                e.preventDefault();
                let tr = $(this).parents('tr');
                tr.toggleClass('active')
                let row = _table.row(tr);
                if (row.child.isShown()) row.child.hide();
                else{
                    row.child(handleBaseline.BaselineFormat(row.data().baseline['project_data'])).show();
                    tr.next().addClass('baseline_tr');
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
                tr += `<tr><td style="width:3%;min-width:38px"></td>`+
                    `   <td style="width:7%;min-width:63px"><a href="${url}" target="_blank"><span class="badge badge-outline badge-soft-primary position-relative">${item.code}${badge}</span><a/></td>`+
                    `   <td style="width:25%;min-width:265px"><span>${item.title}</span></td>`+
                    `   <td style="width:10%;text-align:center;min-width:109px"><span>${item['project_pm'].full_name}</span></td>`+
                    `   <td style="width:15%;text-align:center;min-width:163px"><span>${moment(item.start_date).format('DD/MM/YYYY')}</span></td>`+
                    `   <td style="width:15%;text-align:center;min-width:170px"><span>${moment(item.finish_date).format('DD/MM/YYYY')}</span></td>`+
                    `   <td style="width:10%;text-align:center;min-width:115px"><span>${item['completion_rate']}%</span></td>`+
                    `   <td style="width:5%;text-align:center;min-width:71px"><span>${item.works['all']} (${item.works['completed']})</span></td>`+
                    `   <td style="width:5%;text-align:center;min-width:66.7px"><span>${item['tasks']?.['all']} (${item['tasks']?.['completed']})</span></td>`+
                    ` <td style="width:5%;min-width:38px"></td></tr>`
            }
            return `<div class="wrap-baseline"><table class="table nowrap w-100 min-w-1500p">${tr}</table></div>`
        }
    }
});