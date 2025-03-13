$(document).ready(function () {
    function loadDataTable() {
        let $table = $('#table-instrument-tool-write-off-list')
        let urlDetail = $table.attr('data-url-detail');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('instrument_tool_writeoff_list')) {
                        return resp.data['instrument_tool_writeoff_list'] ? resp.data['instrument_tool_writeoff_list'] : []
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
                        const code = row?.['code'] ? row?.['code'] : '_'
                        return `<a href=${link} class="badge badge-primary w-7">${code}</a> ${$x.fn.buttonLinkBlank(link)}`
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
                    width: '10%',
                    render: (data, type, row) => {
                        const date =row?.['document_date'] ? moment(row?.['document_date'].split(' ')[0], 'YYYY-MM-DD').format('DD-MM-YYYY') : ''
                        return `<div>${date}</div>`
                    }
                },
                {
                    targets: 4,
                    width: '10%',
                    render: (data, type, row) => {
                        const date =row?.['posting_date'] ? moment(row?.['posting_date'].split(' ')[0], 'YYYY-MM-DD').format('DD-MM-YYYY') : ''
                        return `<div>${date}</div>`
                    }
                },
                {
                    targets: 5,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['type']}</div>`
                    }
                },
                {
                    targets: 6,
                    width: '10%',
                    render: (data, type, row) => {
                        return `<div>${row?.['quantity']}</div>`
                    }
                },
                {
                    targets: 7,
                    width: '10%',
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