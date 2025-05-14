$(document).ready(function () {
    const msgData = $("#account-update-page");
    const tbl = $('#datatable_account_list');
    // let urlEmployeeList = tbl.attr('data-url-employee')
    const childRowIndexes = [4, 5, 6, 9, 10]
    const table = tbl.DataTableDefault({
        buttons: [
            {
                extend: 'excel',
                text: `<i class="fas fa-file-excel me-1"></i>${$.fn.gettext('Export to Excel')}`,
                className: 'btn btn-xs rounded-pill',
                exportOptions: {
                    columns: ':visible',
                    format: {
                        body: function (data, row, column, node) {
                            const $el = $('<div>').html(data)
                            const text = $el.text().trim()
                            return text || ($(data).hasClass('mask-money') ? $(data).attr('data-init-money') : '')
                        }
                    }
                }
            }
        ],
        // responsive: {
        //     details: {
        //         type: 'inline',
        //         target: 'td.dt-control',
        //         renderer: function (api, rowIdx, columns) {
        //             const data = columns
        //                 .filter(col => col.hidden)
        //                 .map(col => `
        //                     <tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
        //                         <td>${col.title}:</td><td>${col.data}</td>
        //                     </tr>`
        //                 ).join('');
        //             return `<table class="table">${data}</table>` || false;
        //         }
        //     }
        // },
        columnDefs: [
            {
                targets: childRowIndexes,
                visible: false
            }
        ],
        visibleButton: true,
        rowIdx: true,
        scrollX: true,
        scrollY: '70vh',
        scrollCollapse: true,
        useDataServer: true,
        reloadCurrency: true,
        fixedColumns: {
            leftColumns: 2
        },
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('account_list')) return data['account_list'];
            },
        },
        // fullToolbar: true,
        // cusFilter: [
        //     {
        //         keyParam: "has_manager_custom",
        //         placeholder: msgData.attr('data-msg-by-group'),
        //         allowClear: true,
        //         keyText: "text",
        //         data: [
        //             {
        //                 'id': 'all',
        //                 'text': msgData.attr('data-msg-of-all'),
        //             },
        //             {
        //                 'id': 'same',
        //                 'text': msgData.attr('data-msg-of-group'),
        //             },
        //             {
        //                 'id': 'staff',
        //                 'text': msgData.attr('data-msg-of-staff'),
        //             },
        //             {
        //                 'id': 'me',
        //                 'text': msgData.attr('data-msg-of-me'),
        //                 selected: true,
        //             },
        //         ],
        //     },
        //     {
        //         dataUrl: urlEmployeeList,
        //         keyResp: 'employee_list',
        //         keyText: 'full_name',
        //         keyParam: "manager__contains",
        //         placeholder: msgData.attr('data-msg-filter-manager'),
        //         multiple: true,
        //     },
        // ],
        // cusTool: [
        //     {
        //         'code': 'draft',
        //         eClick: function (){
        //             console.log($(this));
        //         },
        //     },
        //     {
        //         'code': 'export',
        //         eClick: function (){
        //             console.log($(this));
        //         },
        //     },
        // ],
        columns: [
            {
                className: 'w-5 dt-control',
                render: function () {
                    return '';
                },
            },
            {
                className: 'ellipsis-cell-xs w-5',
                orderable: true,
                data: 'code',
                render: (data, type, row) => {
                    const link = msgData.attr('data-url').format_url_with_uuid(row?.['id']);
                    return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                }
            },
            {
                className: 'ellipsis-cell-lg w-15',
                orderable: true,
                data: 'name',
                render: (data, type, row) => {
                    let link = msgData.attr('data-url').format_url_with_uuid(row?.['id']);
                    return `<a href="${link}" class="link-primary underline_hover" title="${row?.['name']}">${row?.['name']}</a>`
                },
            },
            {
                className: 'w-5',
                render: (data, type, row) => {
                    return (row?.['account_type'] || []).map(type =>
                        `<span>${type || ''}</span>`
                    ).join(', ')
                },
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="text-muted">${row?.['revenue_information']?.['order_number'] || 0}</span>`;
                },
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="mask-money text-muted" data-init-money="${row?.['revenue_information']?.['revenue_ytd'] || 0}"></span>`;
                },
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="mask-money text-muted" data-init-money="${row?.['revenue_information']?.['revenue_average'] || 0}"></span>`;
                },
            },
            {
                className: 'ellipsis-cell-sm w-10',
                render: (data, type, row) => {
                    return WFRTControl.displayEmployeeWithGroup(row?.['owner'], 'fullname');
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return (row?.['manager'] || []).map(type =>
                        `<span>${type?.['full_name'] || ''}</span>`
                    ).join(', ')
                },
            },
            {
                className: 'ellipsis-cell-sm w-10',
                render: (data, type, row) => {
                    return WFRTControl.displayEmployeeWithGroup(row?.['employee_created']);
                }
            },
            {
                className: 'ellipsis-cell-sm w-10',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                }
            }
        ],
        initComplete: function () {

        }
    }).on('draw.dt', function () {
        $(this).find('tbody .dt-control').each(function (index, ele) {
            $(ele).prepend('<i class="fa-solid fa-circle-plus text-blue mr-1 dt-control-btn"></i>')
        })
    });

    tbl.on('click', 'tbody .dt-control-btn', function () {
        let tr = $(this).closest('tr')
        let tdi = tr.find("i.fa-solid")
        let row = table.row(tr)

        if (row.child.isShown()) {
            row.child.hide()
            tr.removeClass('shown')
            tdi.first().removeClass('fa-circle-minus text-danger')
            tdi.first().addClass('fa-circle-plus text-blue')
        }
        else {
            const columns = table.columns().header()
            const tableData = Array.from(columns)
                .map((col, idx) => {
                    if (table.column(idx).visible()) return '' // chỉ render cột bị ẩn

                    const columnTitle = $(col).text();
                    const cellText = $(row.cell(tr, idx).node()).html() || ''

                    return `
                        <tr>
                            <td>${columnTitle}</td>
                            <td>${cellText}</td>
                        </tr>
                    `;
                })
                .filter(row => row)
                .join('')


            row.child(`${tableData}`).show()
            tr.addClass('shown')
            tdi.first().removeClass('fa-circle-plus text-blue')
            tdi.first().addClass('fa-circle-minus text-danger')
        }
        $.fn.initMaskMoney2();
    });
});