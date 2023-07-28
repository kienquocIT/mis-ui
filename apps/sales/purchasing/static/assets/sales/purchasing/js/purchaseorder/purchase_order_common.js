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
                    eleAppend += `<div class="inline-elements-badge mr-2">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover"><span>${row.querySelector('.table-row-code').innerHTML}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                }
            }
            if (is_checked === true) {
                elePurchaseRequest.empty();
                elePurchaseRequest.append(eleAppend);
            }
        }
    };

    loadModalPurchaseRequest(tablePurchaseRequest, tablePurchaseRequestProduct) {
        if (tablePurchaseRequest[0].querySelector('.dataTables_empty') && tablePurchaseRequestProduct[0].querySelector('.dataTables_empty')) {
            // load dataTablePurchaseRequest
            tablePurchaseRequest.DataTable().destroy();
            dataTableClass.dataTablePurchaseRequest([{
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
                }]);
            // load dataTablePurchaseRequestProduct
            tablePurchaseRequestProduct.DataTable().destroy();
            dataTableClass.dataTablePurchaseRequestProduct([{
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
                }]);
        }
    };

    loadMergeProduct(eleCheckbox, tablePurchaseRequestProductMerge, tablePurchaseRequestProduct) {
        if (eleCheckbox[0].checked === true) {
            let data = [];
            let dataJson = {};
            $('#sroll-datable-purchase-request-product')[0].setAttribute('hidden', 'true');
            $('#sroll-datable-purchase-request-product-merge')[0].removeAttribute('hidden');
            tablePurchaseRequestProductMerge.DataTable().destroy();
            if (!tablePurchaseRequestProduct[0].querySelector('.dataTables_empty')) {
                for (let i = 0; i < tablePurchaseRequestProduct[0].tBodies[0].rows.length; i++) {
                    let row = tablePurchaseRequestProduct[0].tBodies[0].rows[i];
                    if (row.querySelector('.table-row-checkbox').checked === true) {
                        if (!dataJson.hasOwnProperty(row.querySelector('.table-row-checkbox').id)) {
                            dataJson[row.querySelector('.table-row-checkbox').id] = {
                                'id': row.querySelector('.table-row-checkbox').id,
                                'title': row.querySelector('.table-row-title').innerHTML,
                                'code_list': [row.querySelector('.table-row-code').innerHTML],
                                'uom': row.querySelector('.table-row-uom').innerHTML,
                                'quantity': parseFloat(row.querySelector('.table-row-quantity').innerHTML),
                                'remain': parseFloat(row.querySelector('.table-row-remain').innerHTML),
                                'quantity_purchase': parseFloat(row.querySelector('.table-row-quantity-purchase').innerHTML),
                            }
                        } else {
                            dataJson[row.querySelector('.table-row-checkbox').id].code_list.push(row.querySelector('.table-row-code').innerHTML);
                            dataJson[row.querySelector('.table-row-checkbox').id].quantity += parseFloat(row.querySelector('.table-row-quantity').innerHTML);
                            dataJson[row.querySelector('.table-row-checkbox').id].remain += parseFloat(row.querySelector('.table-row-remain').innerHTML);
                            dataJson[row.querySelector('.table-row-checkbox').id].quantity_purchase += parseFloat(row.querySelector('.table-row-quantity-purchase').innerHTML);
                        }
                    }
                }
                for (let key in dataJson) {
                    data.push(dataJson[key]);
                }
            }
            dataTableClass.dataTablePurchaseRequestProductMerge(data);
        } else {
            $('#sroll-datable-purchase-request-product-merge')[0].setAttribute('hidden', 'true');
            $('#sroll-datable-purchase-request-product')[0].removeAttribute('hidden');
        }
    };

    loadModalPurchaseQuotation(tablePurchaseQuotation) {
        if (tablePurchaseQuotation[0].querySelector('.dataTables_empty')) {
            tablePurchaseQuotation.DataTable().destroy();
            dataTableClass.dataTablePurchaseQuotation([{
                'id': 1,
                'code': 'PQ0001',
                'title': 'Bao gia mua hang so 1',
                'supplier': {'id': 1, 'title': 'Cong ty Unilever'},
                'purchase_quotation_request': {'id': 1, 'code': 'PR0001'},
            }, {
                'id': 2,
                'code': 'PQ0002',
                'title': 'Bao gia mua hang so 2',
                'supplier': {'id': 1, 'title': 'Cong ty Apple'},
                'purchase_quotation_request': {'id': 1, 'code': 'PR0002'},
            }, {
                'id': 3,
                'code': 'PQ0003',
                'title': 'Bao gia mua hang so 3',
                'supplier': {'id': 1, 'title': 'Cong ty Lenovo'},
                'purchase_quotation_request': {'id': 1, 'code': 'PR0003'},
            }, {
                'id': 4,
                'code': 'PQ0004',
                'title': 'Bao gia mua hang so 4',
                'supplier': {'id': 1, 'title': 'Cong ty Hao Hao'},
                'purchase_quotation_request': {'id': 1, 'code': 'PR0004'},
            }]);
        }
    };

    loadDataShowPurchaseQuotation(elePurchaseQuotation, tablePurchaseQuotation) {
        if (!tablePurchaseQuotation[0].querySelector('.dataTables_empty')) {
            let eleAppend = ``;
            let is_checked = false;
            for (let i = 0; i < tablePurchaseQuotation[0].tBodies[0].rows.length; i++) {
                let row = tablePurchaseQuotation[0].tBodies[0].rows[i];
                if (row.querySelector('.table-row-checkbox').checked === true) {
                    is_checked = true;
                    let link = "";
                    eleAppend += `<div class="inline-elements-badge mr-2">
                                    <input type="checkbox" class="custom-checkbox" id="customCheck1">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover"><span>${row.querySelector('.table-row-code').innerHTML}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                }
            }
            if (is_checked === true) {
                elePurchaseQuotation.empty();
                elePurchaseQuotation.append(eleAppend);
            }
        }
    };

}

// DataTable
class dataTableHandle {
    dataTablePurchaseRequest(data) {
        let $table = $('#datable-purchase-request');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            data: data ? data : [],
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

    dataTablePurchaseRequestProduct(data) {
        let $table = $('#datable-purchase-request-product');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            data: data ? data : [],
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
                        return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}" checked disabled></div>`
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
    };

    dataTablePurchaseQuotation(data) {
        let $table = $('#datable-purchase-quotation');
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            data: data ? data : [],
            searching: false,
            paging: false,
            ordering: false,
            info: false,
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<div class="form-check"><input type="checkbox" class="form-check-input table-row-checkbox" id="${row.id}"></div>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<span class="table-row-code">${row.code}</span>`
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="table-row-title">${row.title}</span>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="table-row-supplier">${row.supplier.title}</span>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="table-row-purchase-quotation-request">${row.purchase_quotation_request.code}</span>`
                    }
                },
            ],
            drawCallback: function () {
            },
        });
    };

}

let dataTableClass = new dataTableHandle();