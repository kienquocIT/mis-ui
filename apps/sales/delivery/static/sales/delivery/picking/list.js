$(document).ready(function () {
    let letStateChoices = JSON.parse($('#dataStateChoices').text());
    let tbl = $('#dtbPickingList');
    let frm = new SetupFormSubmit(tbl);
    tbl.DataTableDefault({
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && resp.data.hasOwnProperty('picking_list')) {
                    return resp.data['picking_list'] ? resp.data['picking_list'] : []
                }
                throw Error('Call data raise errors.')
            },
        },
        rowIdx: true,
        columnDefs: [
            {
                "width": "10%",
                "targets": 0
            }, {
                "width": "20%",
                "targets": 1
            }, {
                "width": "20%",
                "targets": 2
            }, {
                "width": "20%",
                "targets": 3
            }, {
                "width": "20%",
                "targets": 4
            }, {
                "width": "10%",
                "targets": 5,
            }
        ],
        columns: [
            {
                render: (data, type, row, meta) => {
                    return ''
                },
            }, {
                data: 'code',
                render: (data, type, row) => {
                    return `<a href="{0}"><span class="badge badge-soft-primary">{1}</span></a>`.format_by_idx(
                        frm.getUrlDetail(row.id), data
                    )
                },
            }, {
                data: 'sale_order_data',
                render: (data, type, row) => {
                    if (data && data.hasOwnProperty('id') && data.hasOwnProperty('code')) {
                        return `<a href="{0}"><span class="badge badge-soft-success">{1}</span></a>`.format_by_idx(
                            SetupFormSubmit.getUrlDetailWithID(
                                tbl.attr('data-url-sale-order-detail'),
                                data['id']
                            ),
                            data['code'],
                        );
                    }
                    return '';
                },
            }, {
                data: 'date_created',
                render: (data, type, row) => {
                    return data;
                },
            }, {
                data: 'estimated_delivery_date',
                render: (data, type, row) => {
                    return data ? data : "_";
                },
            }, {
                data: 'state',
                render: (data, type, row, meta) => {
                    let templateEle = `<span class="badge badge-info badge-outline">{0}</span>`;
                    switch (data) {
                        case 0:
                            templateEle = `<span class="badge badge-warning badge-outline">{0}</span>`;
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