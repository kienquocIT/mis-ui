$(document).ready(function () {
    let letStateChoices = JSON.parse($('#dataStateChoices').text());
    let tbl = $('#dtbDeliveryList');
    let frm = new SetupFormSubmit(tbl);
    tbl.DataTable({
        searching: true,
        ordering: false,
        paginate: false,
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && resp.data.hasOwnProperty('delivery_list')) {
                    return resp.data['delivery_list'] ? resp.data['delivery_list'] : []
                }
                throw Error('Call data raise errors.')
            },
        },
        rowIdx: false,
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
                render: (row, type, data, meta) => {
                    let html = '--';
                    let url = $('#url-factory').attr('data-page-detail');
                    if (data.code) html = data.code
                    html = `<a href="${url.format_url_with_uuid(data.id)}" target="_blank">${html}</a>`
                    return html
                },
            }, {
                data: 'sale_order_data',
                render: (data, type, row) => {
                    if (data && data.hasOwnProperty('id') && data.hasOwnProperty('code')) {
                        return `<a href="{0}"><span>{1}</span><span class="badge badge-soft-success">{2}</span></a>`.format_by_idx(
                            SetupFormSubmit.getUrlDetailWithID(
                                tbl.attr('data-url-sale-order-detail'),
                                data['id']
                            ),
                            $.fn.getValueOrEmpty(data, 'title'),
                            $.fn.getValueOrEmpty(data, 'code'),
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
                data: 'actual_delivery_date',
                render: (data, type, row) => {
                    return data ? data : "_";
                },
            }, {
                data: 'state',
                render: (data, type, row, meta) => {
                    const stateMap = {
                        0: 'info',
                        1: 'warning',
                        2: 'success',
                        3: 'primary'
                    }
                    return `<span class="badge badge-${stateMap[data]} badge-outline">${letStateChoices[data]}</span>`;
                }
            },
            {
                class:'text-center',
                render: (data, type, row, meta) => {
                    const isTxt = $('#trans-factory').attr('data-return')
                    return `<div class="dropdown pointer mr-2">
                                <i class="fa-regular fa-window-restore"
                                   data-bs-toggle="dropdown"
                                   data-dropdown-animation
                                   aria-haspopup="true"
                                   aria-expanded="false"></i>
                                <div class="dropdown-menu w-210p mt-2">
                                <a class="dropdown-item" href="#">${isTxt}</a></div>
                            </div>`;
                }
            }
        ]
    }, false)
});