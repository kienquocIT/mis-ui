// LoadData
class loadDataHandle {
    loadMoreInformation(ele) {
        let optionSelected = ele[0].options[ele[0].selectedIndex];
        let eleInfo = ele[0].closest('.input-affix-wrapper').querySelector('.more-information');
        let inputWrapper = ele[0].closest('.input-affix-wrapper');
        let dropdownContent = inputWrapper.querySelector('.dropdown-menu');
        dropdownContent.innerHTML = ``;
        eleInfo.setAttribute('disabled', true);
        let link = "";
        if (optionSelected) {
            let eleData = optionSelected.querySelector('.data-info');
            if (eleData) {
                // remove attr disabled
                if (eleInfo) {
                    eleInfo.removeAttribute('disabled');
                }
                // end
                let data = JSON.parse(eleData.value);
                let info = ``;
                info += `<h6 class="dropdown-header header-wth-bg">${$.fn.transEle.attr('data-more-information')}</h6>`;
                for (let key in data) {
                    if (key === 'id') {
                        let linkDetail = ele.data('link-detail');
                        if (linkDetail) {
                            link = linkDetail.format_url_with_uuid(data[key]);
                        }
                    } else {
                        info += `<div class="row mb-1"><h6><i>${key}</i></h6><p>${data[key]}</p></div>`;
                    }
                }
                info += `<div class="dropdown-divider"></div>
                    <div class="row">
                        <div class="col-4"></div>
                        <div class="col-8">
                            <a href="${link}" target="_blank" class="link-primary underline_hover">
                                <span><span>${$.fn.transEle.attr('data-view-detail-info')}</span><span class="icon ml-1"><span class="feather-icon"><i class="fas fa-arrow-circle-right"></i></span></span></span>
                            </a>
                        </div>
                    </div>`;
                dropdownContent.innerHTML = info;
            }
        }
    };

    loadDataShowPurchaseRequest(elePurchaseRequest, tablePurchaseRequest) {
        if (!tablePurchaseRequest[0].querySelector('.dataTables_empty')) {
            let eleAppend = ``;
            let is_checked = false;
            for (let i = 0; i < tablePurchaseRequest[0].tBodies[0].rows.length; i++) {
                let row = tablePurchaseRequest[0].tBodies[0].rows[i];
                if (row.querySelector('.table-row-checkbox').checked === true) {
                    is_checked = true;
                    let link = "";
                    eleAppend += `<a href="${link}" target="_blank" class="link-primary underline_hover div-checkbox mr-2">
                                        <span>${row.querySelector('.table-row-code').innerHTML}</span>
                                    </a>`;
                }
            }
            if (is_checked === true) {
                elePurchaseRequest.empty();
                elePurchaseRequest.append(eleAppend);
            }
        }
    };

}

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
                        return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}"></div>`
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
                'id': 1,
                'title': 'Yeu cau mua linh kien',
                'code': 'PR0001',
                'uom': 'chai',
                'quantity': 10,
                'remain': 5,
                'quantity_purchase': 3,
            },
                {
                    'id': 1,
                    'title': 'Yeu cau mua linh kien',
                    'code': 'PR0002',
                    'uom': 'chai',
                    'quantity': 10,
                    'remain': 5,
                    'quantity_purchase': 3,
                },
                {
                    'id': 3,
                    'title': 'Yeu cau mua laptop',
                    'code': 'PR0003',
                    'uom': 'chai',
                    'quantity': 10,
                    'remain': 5,
                    'quantity_purchase': 3,
                },
                {
                    'id': 4,
                    'title': 'Yeu cau mua may in',
                    'code': 'PR0004',
                    'uom': 'chai',
                    'quantity': 10,
                    'remain': 5,
                    'quantity_purchase': 3,
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
                        return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}"></div>`
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
                        return `<span class="table-row-remain">${row.remain}</span>`
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-purchase">${row.quantity_purchase}</span>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

    dataTablePurchaseRequestProductMerge(data) {
        let $table = $('#datable-purchase-request-product-merge');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            data: data ? data : [],
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
                        return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}"></div>`
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
                        let codeList = ``;
                        for (let item of row.code_list) {
                            codeList += `<span class="dropdown-item">${item}</span>`
                        }
                        return `<button
                                    type="button"
                                    class="btn btn-link"
                                    aria-expanded="false"
                                    data-bs-toggle="dropdown"
                                ><i class="fas fa-ellipsis-h"></i></button>
                                <div role="menu" class="dropdown-menu">
                                    ${codeList}
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
                        return `<span class="table-row-remain">${row.remain}</span>`
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        return `<span class="table-row-quantity-purchase">${row.quantity_purchase}</span>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    }
}