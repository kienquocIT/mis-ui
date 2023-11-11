$(document).ready(function () {
    let letStateChoices = JSON.parse($('#dataStateChoices').text());
    let tbl = $('#dtbPickingList');
    let frm = new SetupFormSubmit(tbl);
    tbl.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: "data.picking_list"
        },
        rowIdx: true,
        columns: [
            {
                orderable: false,
                render: (data, type, row, meta) => {
                    return ''
                },
            }, {
                orderable: true,
                render: (row, type, data) => {
                    return `<a href="{0}" class="text-link"><span>{1}</span></a>`.format_by_idx(
                        frm.getUrlDetail(data.id), UtilControl.getValueOrEmpty(data, 'code'),
                    )
                },
            }, {
                data: 'sale_order_data',
                orderable: true,
                render: (data, type, row) => {
                    if (data && data.hasOwnProperty('id') && data.hasOwnProperty('code')) {
                        return `<a href="{0}"><span>{1}</span><span class="badge badge-soft-success">{2}</span></a>`.format_by_idx(
                            SetupFormSubmit.getUrlDetailWithID(
                                tbl.attr('data-url-sale-order-detail'),
                                data['id']
                            ),
                            UtilControl.getValueOrEmpty(data, 'title'),
                            UtilControl.getValueOrEmpty(data, 'code'),
                        );
                    }
                    return '';
                },
            }, {
                data: 'date_created',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(data, {
                        'outputFormat': 'DD/MM/YYYY',
                    });
                },
            },
            {
                data: 'estimated_delivery_date',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(data, {
                        'outputFormat': 'DD/MM/YYYY',
                    });
                },
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
                data: 'state',
                orderable: true,
                render: (data, type, row, meta) => {
                    let templateEle = `<span class="badge badge-warning badge-outline">{0}</span>`;
                    switch (data) {
                        case 0:
                            templateEle = `<span class="badge badge-info badge-outline">{0}</span>`;
                            break
                        case 1:
                            templateEle = `<span class="badge badge-success badge-outline">{0}</span>`;
                            break
                    }
                    return templateEle.format_by_idx(letStateChoices?.[data]);
                }
            }
        ]
    })
});