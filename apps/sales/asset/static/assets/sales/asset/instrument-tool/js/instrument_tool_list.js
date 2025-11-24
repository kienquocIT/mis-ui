$(document).ready(function () {
    function loadDataTable() {
        let $table = $('#table-instrument-tool-list')
        let urlDetail = $table.attr('data-url-detail');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('instrument_tool_list')) {
                        return resp.data['instrument_tool_list'] ? resp.data['instrument_tool_list'] : []
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
                        return `<a href=${link} class="badge badge-primary w-7">${row?.['code']}</a> ${$x.fn.buttonLinkBlank(link)}`
                    }
                },
                {
                    targets: 2,
                    width: '10%',
                    render: (data, type, row) => {
                        const link = urlDetail.replace('0', row.id);
                        return `<a href=${link} class="text-primary fw-bold">${row?.['title']}</a>`
                    }
                },
                {
                    targets: 3,
                    width: '5%',
                    render: (data, type, row) => {
                        return `<div>${row?.['asset_code']}</div>`
                    }
                },
                // {
                //     targets: 4,
                //     width: '10%',
                //     render: (data, type, row) => {
                //         return `<div>${row?.['product']?.['title']}</div>`
                //     }
                // },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['quantity']}</div>`
                    }
                },
                {
                    targets: 6,
                    width: '5%',
                    render: (data, type, row) => {
                        const statusMap = {
                            0: 'Using',
                            1: 'Leased',
                            2: 'Delivered',
                            3: 'Under Maintenance',
                            4: 'Fully Depreciated'
                        }
                        return `<div>${statusMap[row?.['status']]}</div>`
                    }
                },
                {
                    targets: 7,
                    width: '8%',
                    render: (data, type, row) => {
                        return `<div class="w-100 badge badge-soft-success badge-outline mb-1">${row?.['manage_department']?.['title']}</div>`
                    }
                },
                {
                    targets: 8,
                    width: '8%',
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
                    targets: 9,
                    width: '8%',
                    render: (data, type, row) => {
                        const customerName = row?.['use_customer']?.['name'] ? row?.['use_customer']?.['name'] : 'no data'
                        return `<div>${customerName}</div>`
                    }
                },
                {
                    targets: 10,
                    width: '8%',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                    }
                },
                {
                    targets: 11,
                    width: '8%',
                    render: (data, type, row) => {
                        const depreciationTimeUnitMap = {
                            0: 'Month',
                            1: 'Year',
                        }
                        return `<div>${row?.['depreciation_time']} ${depreciationTimeUnitMap[row?.['depreciation_time_unit']]}</div>`
                    }
                },
                {
                    targets: 12,
                    width: '8%',
                    render: (data, type, row) => {
                        return `<div>${row?.['write_off_quantity']}</div>`
                    }
                },
                {
                    targets: 13,
                    width: '8%',
                    render: (data, type, row) => {
                        let sttTxt = JSON.parse($('#stt_sys').text())
                        let sttData = [
                            "light",
                            "primary",
                            "info",
                            "success",
                            "danger",
                        ]
                        return `<span class="badge badge-soft-${sttData[row?.['system_status']]}">${sttTxt[row?.['system_status']][1]}</span>`;
                    }
                },
            ]
        });
    }

    loadDataTable()
})