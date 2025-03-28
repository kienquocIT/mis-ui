$(document).ready(function () {
    function loadDataTable() {
        let $table = $('#table-group-order-list')
        let urlDetail = $table.attr('data-url-detail');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('group_order_list')) {
                        return resp.data['group_order_list'] ? resp.data['group_order_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            rowIdx: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    width: '1%',
                    render: (data, type, row, meta) => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    width: '10%',
                    render: (data, type, row) => {
                        const link = urlDetail.replace('0', row.id);
                        const code = row?.['code'] ? row?.['code'] : '_'
                        return `<a href=${link} class="badge badge-primary w-7">${code}</a> ${$x.fn.buttonLinkBlank(link)}`
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="text-primary fw-bold">${row?.['order_number']}</div>`
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div class="text-primary fw-bold">${row?.['title']}</div>`
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        let startDate = row?.['service_start_date'].split('-').reverse().join('-')
                        let endDate = row?.['service_end_date'].split('-').reverse().join('-')
                        const serviceDuration = startDate + ' - ' + endDate
                        return `<div>${serviceDuration}</div>`
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['order_status']}</div>`
                    }
                },
                // {
                //     targets: 6,
                //     width: '10%',
                //     render: (data, type, row) => {
                //         return `<div></div>`
                //     }
                // },
            ]
        });
    }

    loadDataTable()
})