$(document).ready(function () {
    let transEle = $('#app-trans-factory');

    function loadGRListTable() {
        let $table = $('#datable_goods_receipt_list')
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '64vh',
            scrollCollapse: true,
            fixedColumns: {
                leftColumns: 2,
                rightColumns: window.innerWidth <= 768 ? 0 : 1
            },
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('goods_receipt_list')) {
                        return resp.data['goods_receipt_list'] ? resp.data['goods_receipt_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'ellipsis-cell-xs w-10',
                    render: (data, type, row) => {
                        let link = $('#goods-receipt-link').data('link-detail').format_url_with_uuid(row?.['id']);
                        return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                    }
                },
                {
                    className: 'ellipsis-cell-lg w-25',
                    render: (data, type, row) => {
                        const link = $('#goods-receipt-link').data('link-detail').format_url_with_uuid(row?.['id'])
                        return `<a href="${link}" class="underline_hover">${row?.['title']}</a>`
                    }
                },
                {
                    className: 'ellipsis-cell-xs w-15',
                    render: (data, type, row) => {
                        let typeTxt = JSON.parse($('#gr_type').text())
                        return `${typeTxt[row?.['goods_receipt_type']][1]}`;
                    }
                },
                {
                    className: 'ellipsis-cell-xs w-10',
                    render: (data, type, row) => {
                        let type_code = {
                            0: 'purchase_order_data',
                            1: 'inventory_adjustment_data',
                            2: 'production_order_data',
                            3: 'product_modification_data',
                        }
                        let type_link = {
                            0: 'link-detail-po',
                            1: 'link-detail-ia',
                            2: 'link-detail-pro',
                            3: 'link-detail-pm',
                        }
                        const link = $('#goods-receipt-link').data(type_link[row?.['goods_receipt_type']]).format_url_with_uuid(row?.[type_code[row?.['goods_receipt_type']]]?.['id']);
                        return `<a href="${link}" class="underline_hover">${row?.[type_code[row?.['goods_receipt_type']]]?.['code']}</a>`
                    }
                },
                {
                    className: 'ellipsis-cell-sm w-10',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['date_received'], {'outputFormat': 'DD/MM/YYYY'});
                    }
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
                },
                {
                    className: 'text-center w-5',
                    render: (data, type, row) => {
                        return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                    }
                },
            ],
        });
    }

    loadGRListTable();
});

