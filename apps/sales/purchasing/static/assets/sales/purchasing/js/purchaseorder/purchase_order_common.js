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

    loadBoxQuotationContact(valueToSelect = null, customerID = null) {
        let self = this;
        let ele = $('#box-purchase-order-contact');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        if (customerID) {
            $.fn.callAjax(url, method, {'account_name_id': customerID}).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        ele.empty();
                        if (data.hasOwnProperty('contact_list') && Array.isArray(data.contact_list)) {
                            ele.append(`<option value=""></option>`);
                            data.contact_list.map(function (item) {
                                let dataStr = JSON.stringify({
                                    'id': item.id,
                                    'Name': item.fullname,
                                    'Job title': item.job_title,
                                    'Mobile': item.mobile,
                                    'Email': item.email
                                }).replace(/"/g, "&quot;");
                                let dataAppend = `<option value="${item.id}">
                                                <span class="contact-title">${item.fullname}</span>
                                                <input type="hidden" class="data-info" value="${dataStr}">
                                            </option>`
                                if (item.id === valueToSelect) {
                                    dataAppend = `<option value="${item.id}" selected>
                                                <span class="contact-title">${item.fullname}</span>
                                                <input type="hidden" class="data-info" value="${dataStr}">
                                            </option>`;
                                }
                                ele.append(dataAppend);
                            })
                            self.loadInformationSelectBox(ele);
                        }
                    }
                }
            )
        }
    }

    loadDataShowPurchaseRequest(elePurchaseRequest, tablePurchaseRequest) {
        if (!tablePurchaseRequest[0].querySelector('.dataTables_empty')) {
            let eleAppend = ``;
            let is_checked = false;
            for (let i = 0; i < tablePurchaseRequest[0].tBodies[0].rows.length; i++) {
                let row = tablePurchaseRequest[0].tBodies[0].rows[i];
                if (row.querySelector('.table-row-checkbox').checked === true) {
                    is_checked = true;
                    let link = "";
                    eleAppend += `<div class="inline-elements-badge mr-2 mb-1" id="${row.querySelector('.table-row-checkbox').id}">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover"><span>${row.querySelector('.table-row-code').innerHTML}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                }
            }
            if (is_checked === true) {
                elePurchaseRequest.empty();
                elePurchaseRequest.append(eleAppend);
                // hidden btn add product
                document.getElementById('btn-add-product-purchase-order').setAttribute('hidden', 'true');
            } else {
                elePurchaseRequest.empty();
            }
        }
    };

    loadModalPurchaseRequest(tablePurchaseRequest, tablePurchaseRequestProduct) {
        if (tablePurchaseRequest[0].querySelector('.dataTables_empty') && tablePurchaseRequestProduct[0].querySelector('.dataTables_empty')) {
            // load dataTablePurchaseRequest
            tablePurchaseRequest.DataTable().destroy();
            dataTableClass.dataTablePurchaseRequest([{
                'id': 1,
                'order': 1,
                'title': 'Yeu cau mua hang hoa',
                'code': 'PR0001',
            },
                {
                    'id': 2,
                    'order': 2,
                    'title': 'Yeu cau mua hang hoa',
                    'code': 'PR0002',
                },
                {
                    'id': 3,
                    'order': 3,
                    'title': 'Yeu cau mua hang hoa',
                    'code': 'PR0003',
                },{
                    'id': 4,
                    'order': 4,
                    'title': 'Yeu cau mua hang hoa',
                    'code': 'PR0003',
                },{
                    'id': 5,
                    'order': 5,
                    'title': 'Yeu cau mua hang hoa',
                    'code': 'PR0003',
                },{
                    'id': 6,
                    'order': 6,
                    'title': 'Yeu cau mua hang hoa',
                    'code': 'PR0003',
                },{
                    'id': 7,
                    'order': 7,
                    'title': 'Yeu cau mua hang hoa',
                    'code': 'PR0003',
                },{
                    'id': 8,
                    'order': 8,
                    'title': 'Yeu cau mua hang hoa',
                    'code': 'PR0003',
                },{
                    'id': 9,
                    'order': 9,
                    'title': 'Yeu cau mua hang hoa',
                    'code': 'PR0003',
                },{
                    'id': 10,
                    'order': 10,
                    'title': 'Yeu cau mua hang hoa',
                    'code': 'PR0003',
                },{
                    'id': 11,
                    'order': 11,
                    'title': 'Yeu cau mua hang hoa',
                    'code': 'PR0003',
                },{
                    'id': 12,
                    'order': 12,
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
                    eleAppend += `<div class="inline-elements-badge mr-2 mb-1" id="${row.querySelector('.table-row-checkbox').id}">
                                    <input class="form-check-input" type="checkbox" id="inlinewlable1" value="option1">
                                    <a href="${link}" target="_blank" class="link-primary underline_hover ml-3"><span>${row.querySelector('.table-row-code').innerHTML}</span></a>
                                    <button type="button" class="btn btn-link btn-sm custom-btn-remove" aria-label="Close">
                                        <span aria-hidden="true"><i class="fas fa-times"></i></span>
                                    </button>
                                </div>`;
                }
            }
            if (is_checked === true) {
                elePurchaseQuotation.empty();
                elePurchaseQuotation.append(eleAppend);
            } else {
                elePurchaseQuotation.empty();
            }
        }
    };

    loadDataAfterClickRemove(ele, eleShow, table, code) {
        let self = this;
        let targetID = ele[0].closest('.inline-elements-badge').id;
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            if (row.querySelector('.table-row-checkbox').checked === true) {
                if (row.querySelector('.table-row-checkbox').id === targetID) {
                    row.querySelector('.table-row-checkbox').checked = false;
                    break;
                }
            }
        }
        if (code === "purchase_request") {
            self.loadDataShowPurchaseRequest(eleShow, table);
        } else if (code === "purchase_quotation") {
            self.loadDataShowPurchaseQuotation(eleShow, table);
        }
    }

    loadTableProductByPurchaseRequest(tablePurchaseOrderProduct) {
        let data = [
            {
                'id': 1,
                'product': {'id': 1},
                'uom_request': {'id': 1},
                'uom_order': {'id': 1},
                'tax': {'id': 1, 'value': 10},
                'stock': 3,
                'product_title': 'SP A',
                'product_description': 'xxxxx',
                'product_uom_request_title': 'chai',
                'product_uom_order_title': 'box20',
                'product_quantity_request': 17,
                'product_quantity_order': 1,
                'product_unit_price': 1800000,
                'product_tax_title': 'vat-10',
                'product_tax_amount': 0,
                'product_subtotal_price': 1800000,
                'order': 1,
            },
            {
                'id': 2,
                'product': {'id': 2},
                'uom_request': {'id': 2},
                'uom_order': {'id': 2},
                'tax': {'id': 2, 'value': 10},
                'stock': 0,
                'product_title': 'SP B',
                'product_description': 'xxxxx',
                'product_uom_request_title': 'chai',
                'product_uom_order_title': 'chai',
                'product_quantity_request': 2,
                'product_quantity_order': 2,
                'product_unit_price': 60000,
                'product_tax_title': 'vat-10',
                'product_tax_amount': 0,
                'product_subtotal_price': 120000,
                'order': 2,
            }
        ];
        tablePurchaseOrderProduct.DataTable().destroy();
        dataTableClass.dataTablePurchaseOrderProduct(data);
    }
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

    dataTablePurchaseOrderProduct(data) {
        let $table = $('#datable-purchase-order-product');
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
                        return `<span class="table-row-order" id="${row.id}">${row.order}</span>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let selectProductID = 'line-product-item' + String(row.order);

                        let ele = `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <span class="input-prefix">
                                            <div class="btn-group dropstart">
                                                <i
                                                    class="fas fa-info-circle"
                                                    data-bs-toggle="dropdown"
                                                    data-dropdown-animation
                                                    aria-haspopup="true"
                                                    aria-expanded="false"
                                                    disabled
                                                >
                                                </i>
                                                <div class="dropdown-menu w-210p mt-4"></div>
                                            </div>
                                        </span>
                                        <select 
                                        class="form-select table-row-item" 
                                        id="${selectProductID}"
                                        required>
                                            <option value="${row.product.id}">${row.product_title}</option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                        return `<div class="row">
                                    <div class="col-3">
                                        <div class="btn-group dropstart">
                                            <i
                                                class="fas fa-info-circle"
                                                data-bs-toggle="dropdown"
                                                data-dropdown-animation
                                                aria-haspopup="true"
                                                aria-expanded="false"
                                                disabled
                                            >
                                            </i>
                                            <div class="dropdown-menu w-210p mt-4"></div>
                                        </div>
                                    </div>
                                    <div class="col-9"><span id="${row.product.id}">${row.product_title}</span></div>
                                </div>`
                    },
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        let ele = `<div class="row">
                                    <input type="text" class="form-control table-row-description" value="${row.product_description}">
                                </div>`;
                        return `<span>${row.product_description}</span>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let selectUOMID = 'line-product-uom-request' + String(row.order);
                        let ele = `<div class="row">
                                <select class="form-select table-row-uom-request" id="${selectUOMID}" required>
                                    <option value="${row.uom_request.id}">${row.product_uom_request_title}</option>
                                </select>
                            </div>`;
                        return `<span id="${row.uom_request.id}">${row.product_uom_request_title}</span>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        let ele = `<div class="row">
                                    <input type="text" class="form-control table-row-quantity-request validated-number" value="${row.product_quantity}" required>
                                </div>`;
                        return `<span>${row.product_quantity_request}</span>`
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        return `<span class="table-row-stock">${row.stock}</span>`
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        let selectUOMID = 'line-product-uom-order' + String(row.order);
                        let ele = `<div class="row">
                                <select class="form-select table-row-uom-order" id="${selectUOMID}" required>
                                    <option value="${row.uom_order.id}">${row.product_uom_order_title}</option>
                                </select>
                            </div>`;
                        return `<span id="${row.uom_order.id}">${row.product_uom_order_title}</span>`
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        let ele = `<div class="row">
                                    <input type="text" class="form-control table-row-quantity-order validated-number" value="${row.product_quantity}" required>
                                </div>`;
                        return `<span>${row.product_quantity_order}</span>`
                    }
                },
                {
                    targets: 8,
                    render: (data, type, row) => {
                        let ele = `<div class="row">
                                <div class="dropdown">
                                    <div class="input-group dropdown-action" aria-expanded="false" data-bs-toggle="dropdown">
                                    <span class="input-affix-wrapper">
                                        <input 
                                            type="text" 
                                            class="form-control mask-money table-row-price" 
                                            value="${row.product_unit_price}"
                                            data-return-type="number"
                                        >
                                        <span class="input-suffix table-row-btn-dropdown-price-list"><i class="fas fa-angle-down"></i></span>
                                    </span>
                                    </div>
                                    <div role="menu" class="dropdown-menu table-row-price-list w-460p">
                                    <a class="dropdown-item" data-value=""></a>
                                    </div>
                                </div>
                            </div>`;
                        return `<div class="row">
<div class="col-8"><span class="mask-money mr-4" data-init-money="${parseFloat(row.product_unit_price)}"></span></div>
<div class="col-4">
<button 
aria-expanded="false"
data-bs-toggle="dropdown"
class="btn btn-link btn-sm"
type="button">
<i class="fas fa-angle-down"></i>
</button>
<div role="menu" class="dropdown-menu w-460p">
</div>
</div>
</div>`;
                    }
                },
                {
                    targets: 9,
                    render: (data, type, row) => {
                        let selectTaxID = 'line-product-tax-' + String(row.order);
                        let taxID = "";
                        let taxRate = "0";
                        if (row.tax) {
                            taxID = row.tax.id;
                            taxRate = row.tax.value;
                        }
                        let ele = `<div class="row">
                                <select class="form-select table-row-tax" id="${selectTaxID}">
                                    <option value="${taxID}" data-value="${taxRate}">${taxRate} %</option>
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    value="${row.product_tax_amount}"
                                    data-return-type="number"
                                    hidden
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-tax-amount-raw"
                                    value="${row.product_tax_amount}"
                                    hidden
                                >
                            </div>`;
                        return `<span id="${row.tax.id}">${row.product_tax_title}</span>`
                    }
                },
                {
                    targets: 10,
                    render: (data, type, row) => {
                        let ele = `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-subtotal disabled-custom-show" 
                                    value="${row.product_subtotal_price}"
                                    data-return-type="number"
                                    disabled
                                >
                                <input
                                    type="text"
                                    class="form-control table-row-subtotal-raw"
                                    value="${row.product_subtotal_price}"
                                    hidden
                                >
                            </div>`;
                        return `<span class="mask-money" data-init-money="${parseFloat(row.product_subtotal_price)}"></span>`
                    }
                },
            ],
            drawCallback: function () {
                // mask money
                $.fn.initMaskMoney2();
            },
        });
    };

}

let dataTableClass = new dataTableHandle();

// COMMON FUNCTION
function clickCheckBoxAll(ele, table) {
    if (ele[0].checked === true) {
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            row.querySelector('.table-row-checkbox').checked = true;
        }
    } else {
        for (let i = 0; i < table[0].tBodies[0].rows.length; i++) {
            let row = table[0].tBodies[0].rows[i];
            row.querySelector('.table-row-checkbox').checked = false;
        }
    }
}