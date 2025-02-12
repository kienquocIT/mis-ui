$(document).ready(function () {
    function loadDataTable() {
        let $table = $('#table-fixed-asset-list')
        let urlDetail = $table.attr('data-url-detail');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('fixed_asset_list')) {
                        return resp.data['fixed_asset_list'] ? resp.data['fixed_asset_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            rowIdx: true,
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
                        return `<a href=${link} class="text-primary fw-bold">${row?.['code']}</a> ${$x.fn.buttonLinkBlank(link)}`
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['product']?.['title']}</div>`
                    }
                },
                {
                    targets: 3,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['title']}</div>`
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        const statusMap = {
                            0: 'Using',
                            1: 'Leased'
                        }
                        return `<div>${statusMap[row?.['status']]}</div>`
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['manage_department']?.['title']}</div>`
                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    render: (data, type, row) => {
                        const useDepartments = row?.['use_department']
                        let element = ''
                        for (let i = 0; i < useDepartments.length; i++) {
                            element += `<span class="w-100 badge badge-soft-success badge-outline mb-1">${useDepartments[i]?.['title']}</span>`;
                        }
                        return element;
                    }
                },
                {
                    targets: 7,
                    width: '10%',
                    render: (data, type, row) => {
                        const customerName = row?.['use_customer']?.['name'] ? row?.['use_customer']?.['name'] : 'no data'
                        return `<div>${customerName}</div>`
                    }
                },
                {
                    targets: 8,
                    width: '10%',
                    render: (data, type, row) => {
                        const date =row?.['date_created'] ? moment(row?.['date_created'].split(' ')[0], 'YYYY-MM-DD').format('DD-MM-YYYY') : ''
                        return `<div>${date}</div>`
                    }
                },
                {
                    targets: 9,
                    width: '10%',
                    render: (data, type, row) => {
                        const depreciationTimeUnitMap = {
                            0: 'Month',
                            1: 'Year',
                        }
                        return `<div>${row?.['depreciation_time']} ${depreciationTimeUnitMap[row?.['depreciation_time_unit']]}</div>`
                    }
                },
            ]
        });
    }

    loadDataTable()
})