// DataTable
class dataTableHandle {
    dataTablePurchaseRequest() {
        let $table = $('#datable-purchase-request');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            data: [{
            'order': 1,
            'title': 'Yeu cau mua hang hoa',
            'code': 'PR0001',
        },
        {
            'order': 2,
            'title': 'Yeu cau mua hang hoa',
            'code': 'PR0002',
        },
        {
            'order': 3,
            'title': 'Yeu cau mua hang hoa',
            'code': 'PR0003',
        }],
            // ajax: {
            //     url: frm.dataUrl,
            //     type: frm.dataMethod,
            //     dataSrc: function (resp) {
            //         let data = $.fn.switcherResp(resp);
            //         if (data && resp.data.hasOwnProperty('sale_order_list')) {
            //             return resp.data['sale_order_list'] ? resp.data['sale_order_list'] : []
            //         }
            //         throw Error('Call data raise errors.')
            //     },
            // },
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div class="form-check"><input type="checkbox" class="form-check-input" id="merge-same-product"></div>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row.code}</span>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    dataTablePurchaseRequestProduct() {
        let $table = $('#datable-purchase-request-product');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            data: [{
            'title': 'Yeu cau mua hang hoa',
            'code': 'PR0001',
            'uom': 'chai',
            'quantity': 2,
            'remain': 2,
            'order': 10,
        },
        {
            'title': 'Yeu cau mua hang hoa',
            'code': 'PR0002',
            'uom': 'chai',
            'quantity': 2,
            'remain': 2,
            'order': 10,
        },
        {
            'title': 'Yeu cau mua hang hoa',
            'code': 'PR0003',
            'uom': 'chai',
            'quantity': 2,
            'remain': 2,
            'order': 10,
        },
        {
            'title': 'Yeu cau mua hang hoa',
            'code': 'PR0004',
            'uom': 'chai',
            'quantity': 2,
            'remain': 2,
            'order': 10,
        }],
            // ajax: {
            //     url: frm.dataUrl,
            //     type: frm.dataMethod,
            //     dataSrc: function (resp) {
            //         let data = $.fn.switcherResp(resp);
            //         if (data && resp.data.hasOwnProperty('sale_order_list')) {
            //             return resp.data['sale_order_list'] ? resp.data['sale_order_list'] : []
            //         }
            //         throw Error('Call data raise errors.')
            //     },
            // },
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div class="form-check"><input type="checkbox" class="form-check-input" id="merge-same-product"></div>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row.code}</span>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row.uom}</span>`
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row.quantity}</span>`
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row.remain}</span>`
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row.order}</span>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    dataTablePurchaseRequestProductMerge() {
        let $table = $('#datable-purchase-request-product-merge');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            data: [{
            'title': 'Yeu cau mua hang hoa',
            'uom': 'chai',
            'quantity': 2,
            'remain': 2,
            'order': 10,
        },
        {
            'title': 'Yeu cau mua hang hoa',
            'uom': 'chai',
            'quantity': 2,
            'remain': 2,
            'order': 10,
        }],
            // ajax: {
            //     url: frm.dataUrl,
            //     type: frm.dataMethod,
            //     dataSrc: function (resp) {
            //         let data = $.fn.switcherResp(resp);
            //         if (data && resp.data.hasOwnProperty('sale_order_list')) {
            //             return resp.data['sale_order_list'] ? resp.data['sale_order_list'] : []
            //         }
            //         throw Error('Call data raise errors.')
            //     },
            // },
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row, meta) => {
                        return `<span class="table-row-order">${(meta.row + 1)}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div class="form-check"><input type="checkbox" class="form-check-input" id="merge-same-product"></div>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    },
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<button
                                    type="button"
                                    class="btn btn-link"
                                    aria-expanded="false"
                                    data-bs-toggle="dropdown"
                                ><i class="fas fa-ellipsis-h"></i></button>
                                <div role="menu" class="dropdown-menu">
                                    <span class="dropdown-item">PR0001</span>
                                    <span class="dropdown-item">PR0003</span>
                                </div>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-uom">${row.uom}</span>`
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row.quantity}</span>`
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row.remain}</span>`
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity">${row.order}</span>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    }
}