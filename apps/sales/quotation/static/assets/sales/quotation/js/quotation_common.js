function loadBoxQuotationOpportunity(opp_id) {
    let jqueryId = '#' + opp_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                    ele.append(`<option value=""></option>`);
                    data.opportunity_list.map(function (item) {
                        let dataStr = JSON.stringify({
                            'id': item.id,
                            'title': item.title,
                            'code': item.code,
                            'customer': item.customer.title
                        }).replace(/"/g, "&quot;");
                        let opportunity_data = JSON.stringify(item).replace(/"/g, "&quot;");
                        let data_show = `${item.title}` + `-` + `${item.code}`;
                        ele.append(`<option value="${item.id}">
                                        <span class="opp-title">${data_show}</span>
                                        <input type="hidden" class="data-default" value="${opportunity_data}">
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </option>`)
                    })
                }
            }
        }
    )
}

function loadBoxQuotationCustomer(customer_id, valueToSelect = null, modalShipping = null, modalBilling = null, boxContact = null) {
    let jqueryId = '#' + customer_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                    ele.append(`<option value=""></option>`);
                    data.account_list.map(function (item) {
                        let ownerName = "";
                        if (item.owner) {
                            ownerName = item.owner.fullname;
                        }
                        let dataStr = JSON.stringify({
                            'id': item.id,
                            'Name': item.name,
                            'Owner name': ownerName,
                        }).replace(/"/g, "&quot;");
                        let customer_data = JSON.stringify(item).replace(/"/g, "&quot;");
                        let dataAppend = `<option value="${item.id}">
                                            <span class="account-title">${item.name}</span>
                                            <input type="hidden" class="data-default" value="${customer_data}">
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                        if (item.id === valueToSelect) {
                            dataAppend = `<option value="${item.id}" selected>
                                            <span class="account-title">${item.name}</span>
                                            <input type="hidden" class="data-default" value="${customer_data}">
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`

                            loadShippingBillingCustomer(modalShipping, modalBilling, item);
                            loadContactCustomer(boxContact, item);
                        }
                        ele.append(dataAppend)
                    })
                    if (valueToSelect) {
                        loadInformationSelectBox(ele);
                    }
                }
            }
        }
    )
}

function loadBoxQuotationContact(contact_id, valueToSelect = null) {
    let jqueryId = '#' + contact_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
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
                                        </option>`
                        }
                        ele.append(dataAppend)
                    })
                    if (valueToSelect) {
                        loadInformationSelectBox(ele);
                    }
                }
            }
        }
    )
}

function loadBoxQuotationSalePerson(sale_person_id) {
    let jqueryId = '#' + sale_person_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                    ele.append(`<option value=""></option>`);
                    data.employee_list.map(function (item) {
                        let group = '';
                        if (item.group) {
                            group = item.group.title
                        }
                        let dataStr = JSON.stringify({
                            'id': item.id,
                            'Name': item.full_name,
                            'Code': item.code,
                            'Group': group
                        }).replace(/"/g, "&quot;");
                        ele.append(`<option value="${item.id}">
                                        <span class="employee-title">${item.full_name}</span>
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </option>`)
                    })
                }
            }
        }
    )
}

function loadBoxQuotationPaymentTerm(term_id) {
    let jqueryId = '#' + term_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('payment_terms_list') && Array.isArray(data.payment_terms_list)) {
                    ele.append(`<option value=""></option>`);
                    data.payment_terms_list.map(function (item) {
                        let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                        ele.append(`<option value="${item.id}">
                                        <span class="opp-title">${item.title}</span>
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </option>`)
                    })
                }
            }
        }
    )
}

function loadBoxQuotationPrice(price_id) {
    let jqueryId = '#' + price_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('price_list') && Array.isArray(data.price_list)) {
                    ele.append(`<option value=""></option>`);
                    data.price_list.map(function (item) {
                        let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                        ele.append(`<option value="${item.id}">
                                        <span class="opp-title">${item.title}</span>
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </option>`)
                    })
                }
            }
        }
    )
}

function loadInitQuotationProduct(product_id) {
    let jqueryId = '#' + product_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('product_list') && Array.isArray(data.product_list)) {
                    ele.val(JSON.stringify(data.product_list))
                }
            }
        }
    )
}

function loadBoxQuotationProduct(product_id, box_id) {
    let ele = document.getElementById(product_id);
    let jqueryId = '#' + box_id;
    let eleBox = $(jqueryId);
    if (ele && eleBox) {
        let linkDetail = ele.getAttribute('data-link-detail');
        eleBox.attr('data-link-detail', linkDetail);
        let data = JSON.parse(ele.value);
        for (let i = 0; i < data.length; i++) {
            let uom_title = "";
            let default_uom = {};
            let tax_code = {};
            if (data[i].sale_information) {
                if (data[i].sale_information.default_uom) {
                    uom_title = data[i].sale_information.default_uom.title
                }
                default_uom = data[i].sale_information.default_uom;
                tax_code = data[i].sale_information.tax_code;
            }
            let dataStr = JSON.stringify({
                'id': data[i].id,
                'title': data[i].title,
                'code': data[i].code,
                'unit of measure': uom_title,
            }).replace(/"/g, "&quot;");
            let product_data = JSON.stringify({
                'id': data[i].id,
                'title': data[i].title,
                'code': data[i].code,
                'unit_of_measure': default_uom,
                'price_list': data[i].price_list,
                'cost_price': data[i].cost_price,
                'tax': tax_code,
            }).replace(/"/g, "&quot;");
            eleBox.append(`<option value="${data[i].id}">
                            <span class="product-title">${data[i].title}</span>
                            <input type="hidden" class="data-default" value="${product_data}">
                            <input type="hidden" class="data-info" value="${dataStr}">
                        </option>`)
        }
    }
}

function loadInitQuotationUOM(uom_id) {
    let jqueryId = '#' + uom_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('unit_of_measure') && Array.isArray(data.unit_of_measure)) {
                    ele.val(JSON.stringify(data.unit_of_measure))
                }
            }
        }
    )
}

function loadBoxQuotationUOM(uom_id, box_id) {
    let ele = document.getElementById(uom_id);
    let jqueryId = '#' + box_id;
    let eleBox = $(jqueryId);
    if (ele && eleBox) {
        let data = JSON.parse(ele.value);
        for (let i = 0; i < data.length; i++) {
            let dataStr = JSON.stringify({
                'id': data[i].id,
                'title': data[i].title,
                'code': data[i].code,
            }).replace(/"/g, "&quot;");
            eleBox.append(`<option value="${data[i].id}">
                                <span class="uom-title">${data[i].title}</span>
                                <input type="hidden" class="data-info" value="${dataStr}">
                            </option>`)
        }
    }
}

function loadInitQuotationTax(tax_id) {
    let jqueryId = '#' + tax_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('tax_list') && Array.isArray(data.tax_list)) {
                    ele.val(JSON.stringify(data.tax_list))
                }
            }
        }
    )
}

function loadBoxQuotationTax(tax_id, box_id) {
    let ele = document.getElementById(tax_id);
    let jqueryId = '#' + box_id;
    let eleBox = $(jqueryId);
    if (ele && eleBox) {
        let data = JSON.parse(ele.value);
        for (let i = 0; i < data.length; i++) {
            let dataStr = JSON.stringify({
                'id': data[i].id,
                'title': data[i].title,
                'value': data[i].rate,
            }).replace(/"/g, "&quot;");
            eleBox.append(`<option value="${data[i].id}" data-value="${data[i].rate}">
                            <span class="tax-title">${data[i].title}</span>
                            <input type="hidden" class="data-info" value="${dataStr}">
                        </option>`)
        }
    }
}

function dataTableProduct(data, table_id) {
    // init dataTable
    let listData = data ? data : [];
    let jqueryId = '#' + table_id;
    let $tables = $(jqueryId);
    $tables.DataTable({
        data: listData,
        searching: false,
        ordering: false,
        paginate: false,
        info: false,
        drawCallback: function (row, data) {
            // render icon after table callback
            feather.replace();
        },
        rowCallback: function (row, data) {},
        columns: [
            {
                targets: 0,
                width: "1%",
                render: (data, type, row) => {
                    return `<span class="table-row-order">${row.order}</span>`
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<div class="row">
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
                                        id="${row.selectProductID}"
                                        required>
                                            <option value=""></option>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<div class="row"><input type="text" class="form-control table-row-description"></div>`;
                }
            },
            {
                targets: 3,
                width: "1%",
                render: (data, type, row) => {
                    return `<div class="row">
                                <select class="form-select table-row-uom" id="${row.selectUOMID}" required>
                                    <option value=""></option>
                                </select>
                            </div>`;
                },
            },
            {
                targets: 4,
                width: "1%",
                render: (data, type, row) => {
                    return `<div class="row"><input type="text" class="form-control table-row-quantity" required></div>`;
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    return `<div class="row">
                                <select class="form-select table-row-price" required>
                                    <option value="0"></option>
                                </select>
                            </div>`;
                }
            },
            {
                targets: 6,
                render: (data, type, row) => {
                    return `<div class="row">
                                <div class="input-group">
                                    <span class="input-affix-wrapper">
                                        <input type="text" class="form-control table-row-discount">
                                        <span class="input-suffix">%</span>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-discount-amount"
                                    data-return-type="number"
                                    hidden
                                >
                            </div>`;
                }
            },
            {
                targets: 7,
                render: (data, type, row) => {
                    return `<div class="row">
                                <select class="form-select table-row-tax" id="${row.selectTaxID}">
                                    <option value="" data-value="0"></option>
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    data-return-type="number"
                                    hidden
                                >
                            </div>`;
                }
            },
            {
                targets: 8,
                render: (data, type, row) => {
                    return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-subtotal disabled-custom-show" 
                                    value="0"
                                    data-return-type="number"
                                    disabled
                                >
                            </div>`;
                }
            },
            {
                targets: 9,
                width: "1%",
                render: () => {
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                    return `${bt3}`
                }
            },
        ],
    });

}

function dataTableCost(data, table_id) {
    // init dataTable
    let listData = data ? data : [];
    let jqueryId = '#' + table_id;
    let $tables = $(jqueryId);
    $tables.DataTable({
        data: listData,
        searching: false,
        ordering: false,
        paginate: false,
        info: false,
        drawCallback: function (row, data) {
            // render icon after table callback
            feather.replace();
        },
        rowCallback: function (row, data) {
        },
        columns: [
            {
                targets: 0,
                width: "1%",
                render: (data, type, row) => {
                    return `<span class="table-row-order">${row.valueOrder}</span>`
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<div class="row">
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
                                        <select class="form-select table-row-item disabled-custom-show" disabled>
                                        </select>
                                    </span>
                                </div>
                            </div>`;
                }
            },
            {
                targets: 2,
                width: "1%",
                render: (data, type, row) => {
                    return `<div class="row">
                                <select class="form-select table-row-uom disabled-custom-show" disabled>
                                </select>
                            </div>`;
                },
            },
            {
                targets: 3,
                width: "1%",
                render: (data, type, row) => {
                    return `<div class="row"><input type="text" class="form-control table-row-quantity disabled-custom-show" value="${row.valueQuantity}" disabled></div>`;
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-price" 
                                    data-return-type="number"
                                    value="${row.valuePrice}"
                                    required
                                >
                            </div>`;
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    return `<div class="row">
                                <select class="form-select table-row-tax">
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    data-return-type="number"
                                    hidden
                                >
                            </div>`;
                }
            },
            {
                targets: 6,
                render: (data, type, row) => {
                    return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-subtotal disabled-custom-show" 
                                    value="${row.valueSubtotal}"
                                    data-return-type="number"
                                    disabled
                                >
                            </div>`;
                }
            },
            {
                targets: 7,
                width: "1%",
                render: () => {
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                    return `${bt3}`
                }
            },
        ],
    });
}

function dataTableExpense(data, table_id) {
    // init dataTable
    let listData = data ? data : [];
    let jqueryId = '#' + table_id;
    let $tables = $(jqueryId);
    $tables.DataTable({
        data: listData,
        searching: false,
        ordering: false,
        paginate: false,
        info: false,
        drawCallback: function (row, data) {
            // render icon after table callback
            feather.replace();
        },
        rowCallback: function (row, data) {
        },
        columns: [
            {
                targets: 0,
                width: "1%",
                render: (data, type, row) => {
                    return `<span class="table-row-order">${row.order}</span>`
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<div class="row">
                                <select class="form-select table-row-item" required>
                                    <option value=""></option>
                                    <option value="">Laptop HP</option>
                                    <option value="">Laptop Dell</option>
                                    <option value="">Laptop Lenovo</option>
                                </select>
                            </div>`;
                }
            },
            {
                targets: 2,
                width: "1%",
                render: (data, type, row) => {
                    return `<div class="row">
                                <select class="form-select table-row-uom" id="${row.selectUOMID}" required>
                                    <option value=""></option>
                                </select>
                            </div>`;
                },
            },
            {
                targets: 3,
                width: "1%",
                render: (data, type, row) => {
                    return `<div class="row"><input type="text" class="form-control table-row-quantity" required></div>`;
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-price" 
                                    data-return-type="number"
                                    required
                                >
                            </div>`;
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    return `<div class="row">
                                <select class="form-select table-row-tax" id="${row.selectTaxID}">
                                    <option value="" data-value="0"></option>
                                </select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    data-return-type="number"
                                    hidden
                                >
                            </div>`;
                }
            },
            {
                targets: 6,
                render: (data, type, row) => {
                    return `<div class="row">
                                <input 
                                    type="text" 
                                    class="form-control mask-money table-row-subtotal disabled-custom-show" 
                                    value="0"
                                    data-return-type="number"
                                    disabled
                                >
                            </div>`;
                }
            },
            {
                targets: 7,
                width: "1%",
                render: () => {
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                    return `${bt3}`
                }
            },
        ],
    });
}

function updateDiscountTotal(discount, pretax_id, taxes_id, total_id, discount_id) {
    let elePretaxAmount = document.getElementById(pretax_id);
    let eleTaxes = document.getElementById(taxes_id);
    let eleDiscount = document.getElementById(discount_id);
    let eleTotal = document.getElementById(total_id);
    let pretaxVal = $(elePretaxAmount).valCurrency();
    let taxVal = $(eleTaxes).valCurrency();
    let discountAmount = ((pretaxVal * Number(discount)) / 100);
    eleDiscount.value = discountAmount;
    $(eleDiscount).maskMoney('mask', discountAmount);
    let total = pretaxVal - discountAmount + taxVal;
    eleTotal.value = total;
    $(eleTotal).maskMoney('mask', total);
}

function updateTotal(table, pretax_id, taxes_id, total_id, discount_id = null) {
    let pretaxAmount = 0;
    let taxAmount = 0;
    let elePretaxAmount = document.getElementById(pretax_id);
    let eleDiscount = document.getElementById(discount_id);
    let eleTaxes = document.getElementById(taxes_id);
    let eleTotal = document.getElementById(total_id);
    let tableLen = table.tBodies[0].rows.length;
    for (let i = 0; i < tableLen; i++) {
        let row = table.tBodies[0].rows[i];
        let subtotal = row.querySelector('.table-row-subtotal');
        if (subtotal) {
            if (subtotal.value) {
                pretaxAmount += $(subtotal).valCurrency();
            }
        }
        let subTaxAmount = row.querySelector('.table-row-tax-amount');
        if (subTaxAmount) {
            if (subTaxAmount.value) {
                taxAmount += $(subTaxAmount).valCurrency();
            }
        }
    }
    let total = (pretaxAmount + taxAmount);
    if (eleDiscount) {
        let discount = document.getElementById('quotation-create-product-discount');
        if (discount.value) {
            let discountAmount = ((pretaxAmount * Number(discount.value)) / 100);
            eleDiscount.value = discountAmount;
            total = (pretaxAmount - discountAmount + taxAmount);
            $(eleDiscount).maskMoney('mask', discountAmount);
        }
    }
    elePretaxAmount.value = pretaxAmount;
    $(elePretaxAmount).maskMoney('mask', pretaxAmount);
    eleTaxes.value = taxAmount;
    $(eleTaxes).maskMoney('mask', taxAmount);
    eleTotal.value = total;
    $(eleTotal).maskMoney('mask', total);
}

function commonCalculate(table, row, is_product = false, is_cost = false, is_expense = false) {
    let price = 0;
    let quantity = 0;
    let elePrice = row.querySelector('.table-row-price');
    if (elePrice) {
        price = $(elePrice).valCurrency();
    }
    let eleQuantity = row.querySelector('.table-row-quantity');
    if (eleQuantity) {
        if (eleQuantity.value) {
            quantity = parseInt(eleQuantity.value)
        } else if (!eleQuantity.value || eleQuantity.value === "0") {
            quantity = 0
        }
    }
    let tax = 0;
    let discount = 0;
    let subtotal = (price * quantity);
    let eleDiscount = row.querySelector('.table-row-discount');
    if (eleDiscount) {
        if (eleDiscount.value) {
            discount = parseInt(eleDiscount.value)
        } else if (!eleDiscount.value || eleDiscount.value === "0") {
            discount = 0
        }
    }
    if (discount || discount === 0) {
        let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
        if (eleDiscountAmount) {
            let discountAmount = ((price * discount) / 100);
            eleDiscountAmount.value = discountAmount;
            subtotal = ((price - discountAmount) * quantity);
            $(eleDiscountAmount).maskMoney('mask', discountAmount);
        }
    }
    let eleTax = row.querySelector('.table-row-tax');
    if (eleTax) {
        let optionSelected = eleTax.options[eleTax.selectedIndex];
        if (optionSelected) {
            tax = parseInt(optionSelected.getAttribute('data-value'));
        }
    }
    if (tax || tax === 0) {
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        if (eleTaxAmount) {
            let taxAmount = ((subtotal * tax) / 100);
            eleTaxAmount.value = taxAmount;
            $(eleTaxAmount).maskMoney('mask', taxAmount);
        }
    }
    let eleSubtotal = row.querySelector('.table-row-subtotal');
    if (eleSubtotal) {
        eleSubtotal.value = subtotal;
        $(eleSubtotal).maskMoney('mask', subtotal);
    }
    if (is_product === true) {
        updateTotal(table[0], 'quotation-create-product-pretax-amount', 'quotation-create-product-taxes', 'quotation-create-product-total', 'quotation-create-product-discount-amount')
    } else if (is_cost === true) {
        updateTotal(table[0], 'quotation-create-cost-pretax-amount', 'quotation-create-cost-taxes', 'quotation-create-cost-total')
    } else if (is_expense === true) {
        updateTotal(table[0], 'quotation-create-expense-pretax-amount', 'quotation-create-expense-taxes', 'quotation-create-expense-total')
    }


}

function loadDataProductSelect(ele) {
    let optionSelected = ele[0].options[ele[0].selectedIndex];
    let productData = optionSelected.querySelector('.data-default');
    if (productData) {
        let data = JSON.parse(productData.value);
        let uom = ele[0].closest('tr').querySelector('.table-row-uom');
        let price = ele[0].closest('tr').querySelector('.table-row-price');
        let tax = ele[0].closest('tr').querySelector('.table-row-tax');
        if (uom) {
            uom.value = data.unit_of_measure.id;
        }
        if (price) {
            for (let i = 0; i < data.price_list.length; i++) {
                let option = `<option value="${data.price_list[i]}">
                                <input 
                                    type="text" 
                                    class="form-control mask-money" 
                                    data-return-type="number"
                                    value="${data.price_list[i]}"
                                    required
                                >
                            </option>`
                $(price).append(option);
            }
        }
        if (tax) {
            tax.value = data.tax.id;
        }
        loadInformationSelectBox(ele);
    }
}

function deleteRow(currentRow, tableBody, table, pretax_id, taxes_id, total_id, discount_id = null) {
    table.DataTable().row(currentRow).remove().draw();
    let order = 0;
    if (tableBody.rows.length === 0) {
        table.DataTable().clear();
    } else {
        for (let idx = 0; idx < tableBody.rows.length; idx++) {
            order++;
            let productOrder = tableBody.rows[idx].querySelector('.table-row-order');
            if (productOrder) {
                productOrder.innerHTML = order;
            }
        }
    }
    updateTotal(table[0], pretax_id, taxes_id, total_id, discount_id);
}

function loadInformationSelectBox(ele) {
    let optionSelected = ele[0].options[ele[0].selectedIndex];
    let inputWrapper = ele[0].closest('.input-affix-wrapper');
    let dropdownContent = inputWrapper.querySelector('.dropdown-menu');
    let link = "";
    if (optionSelected) {
        let eleData = optionSelected.querySelector('.data-info');
        if (eleData) {
            // remove attr disabled
            let eleInfo = ele[0].closest('.input-affix-wrapper').querySelector('.fa-info-circle');
            if (eleInfo) {
                eleInfo.removeAttribute('disabled');
            }
            // end
            let data = JSON.parse(eleData.value);
            let info = ``;
            info += `<h6 class="dropdown-header header-wth-bg">More Information</h6>`;
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
                        <div class="col-7">
                            <a href="${link}" target="_blank" class="link-primary underline_hover">
                                <span><span>View Detail</span><span class="icon ml-1"><span class="feather-icon"><i class="fas fa-arrow-circle-right"></i></span></span></span>
                            </a>
                        </div>
                        <div class="col-1"></div>
                    </div>`;
            dropdownContent.innerHTML = ``;
            dropdownContent.innerHTML = info;
        }
    }
}

function init_mask_money_single(ele) {
    $.fn.getCompanyCurrencyConfig().then((currencyConfig) => {
        if (currencyConfig) {
            ele.find('.mask-money').initInputCurrency(currencyConfig);
            ele.find('.mask-money-value').parseCurrencyDisplay(currencyConfig);
        } else throw  Error('Currency config is not found.')
    });
}

function loadShippingBillingCustomer(modalShipping, modalBilling, item) {
    let modalShippingContent = modalShipping[0].querySelector('.modal-body');
    if (modalShippingContent) {
        for (let i = 0; i < item.shipping_address.length; i++) {
            let address = item.shipping_address[i];
            $(modalShippingContent).append(`<div class="row ml-1 shipping-group">
                                                <div class="row mb-1">
                                                    <textarea class="form-control show-not-edit shipping-content disabled-custom-show" rows="3" cols="50" name="" disabled>${address}</textarea>
                                                </div>
                                                <div class="row">
                                                    <div class="col-5"></div>
                                                    <div class="col-4"></div>
                                                    <div class="col-3">
                                                        <button class="btn btn-primary choose-shipping">Select This Address</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <br>`)
        }
    }
    let modalBillingContent = modalBilling[0].querySelector('.modal-body');
    if (modalBillingContent) {
        for (let i = 0; i < item.billing_address.length; i++) {
            let address = item.billing_address[i];
            $(modalBillingContent).append(`<div class="row ml-1 billing-group">
                                                <div class="row mb-1">
                                                    <textarea class="form-control show-not-edit billing-content disabled-custom-show" rows="3" cols="50" name="" disabled>${address}</textarea>
                                                </div>
                                                <div class="row">
                                                    <div class="col-5"></div>
                                                    <div class="col-4"></div>
                                                    <div class="col-3">
                                                        <button class="btn btn-primary choose-billing">Select This Address</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <br>`)
        }
    }
}

function loadContactCustomer(boxContact, item) {
    if (item.owner) {
        let valueToSelect = item.owner.id;
        if (!boxContact[0].innerHTML) {
            loadBoxQuotationContact('select-box-quotation-create-contact', valueToSelect);
        } else {
            let optionSelectedContact = boxContact[0].options[boxContact[0].selectedIndex];
            if (optionSelectedContact) {
                optionSelectedContact.removeAttribute('selected');
            }
            for (let option of boxContact[0].options) {
                if (option.value === valueToSelect) {
                    option.setAttribute('selected', true);
                    break;
                }
            }
            loadInformationSelectBox(boxContact);
        }
    }
}

function setupDataProduct() {
    let result = [];
    let table = document.getElementById('datable-quotation-create-product');
    let tableBody = table.tBodies[0];
    for (let i = 0; i < tableBody.rows.length; i++) {
        let rowData = {};
        let row = tableBody.rows[i];
        let eleProduct = row.querySelector('.table-row-item');
        if (eleProduct) {
            let optionSelected = eleProduct.options[eleProduct.selectedIndex];
            if (optionSelected) {
                if (optionSelected.querySelector('.data-info')) {
                    let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                    rowData['product'] = dataInfo.id;
                    rowData['product_title'] = dataInfo.title;
                    rowData['product_code'] = dataInfo.code;
                }
            }

        }
        let eleUOM = row.querySelector('.table-row-uom');
        if (eleUOM) {
            let optionSelected = eleUOM.options[eleUOM.selectedIndex];
            if (optionSelected) {
                if (optionSelected.querySelector('.data-info')) {
                    let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                    rowData['unit_of_measure'] = dataInfo.id;
                    rowData['product_uom_title'] = dataInfo.title;
                    rowData['product_uom_code'] = dataInfo.code;
                }
            }

        }
        let eleTax = row.querySelector('.table-row-tax');
        if (eleTax) {
            let optionSelected = eleTax.options[eleTax.selectedIndex];
            if (optionSelected) {
                if (optionSelected.querySelector('.data-info')) {
                    let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                    rowData['tax'] = dataInfo.id;
                    rowData['product_tax_title'] = dataInfo.title;
                    rowData['product_tax_value'] = dataInfo.value;
                }
            }

        }
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        if (eleTaxAmount) {
            rowData['product_tax_amount'] = $(eleTaxAmount).valCurrency();
        }
        let eleDescription = row.querySelector('.table-row-description');
        if (eleDescription) {
            rowData['product_description'] = eleDescription.value;
        }
        let eleQuantity = row.querySelector('.table-row-quantity');
        if (eleQuantity) {
            rowData['product_quantity'] = eleQuantity.value;
        }
        let elePrice = row.querySelector('.table-row-price');
        if (elePrice) {
            rowData['product_unit_price'] = $(elePrice).valCurrency();
        }
        let eleDiscount = row.querySelector('.table-row-discount');
        if (eleDiscount) {
            rowData['product_discount_value'] = parseInt(eleDiscount.value);
        }
        let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
        if (eleDiscountAmount) {
            rowData['product_discount_amount'] = $(eleDiscountAmount).valCurrency();
        }
        let eleSubtotal = row.querySelector('.table-row-subtotal');
        if (eleSubtotal) {
            rowData['product_subtotal_price'] = $(eleSubtotal).valCurrency();
        }
        let eleOrder = row.querySelector('.table-row-order');
        if (eleOrder) {
            rowData['order'] = parseInt(eleOrder.innerHTML);
        }
        result.push(rowData);
    }
    return result
}

function setupDataCost() {
    let result = [];
    let table = document.getElementById('datable-quotation-create-cost');
    let tableBody = table.tBodies[0];
    for (let i = 0; i < tableBody.rows.length; i++) {
        let rowData = {};
        let row = tableBody.rows[i];
        let eleProduct = row.querySelector('.table-row-item');
        if (eleProduct) {
            let optionSelected = eleProduct.options[eleProduct.selectedIndex];
            if (optionSelected) {
                if (optionSelected.querySelector('.data-info')) {
                    let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                    rowData['product'] = dataInfo.id;
                    rowData['product_title'] = dataInfo.title;
                    rowData['product_code'] = dataInfo.code;
                }
            }
        }
        let eleUOM = row.querySelector('.table-row-uom');
        if (eleUOM) {
            let optionSelected = eleUOM.options[eleUOM.selectedIndex];
            if (optionSelected) {
                if (optionSelected.querySelector('.data-info')) {
                    let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                    rowData['unit_of_measure'] = dataInfo.id;
                    rowData['product_uom_title'] = dataInfo.title;
                    rowData['product_uom_code'] = dataInfo.code;
                }
            }

        }
        let eleTax = row.querySelector('.table-row-tax');
        if (eleTax) {
            let optionSelected = eleTax.options[eleTax.selectedIndex];
            if (optionSelected) {
                if (optionSelected.querySelector('.data-info')) {
                    let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                    rowData['tax'] = dataInfo.id;
                    rowData['product_tax_title'] = dataInfo.title;
                    rowData['product_tax_value'] = dataInfo.value;
                }
            }

        }
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        if (eleTaxAmount) {
            rowData['product_tax_amount'] = $(eleTaxAmount).valCurrency();
        }
        let eleQuantity = row.querySelector('.table-row-quantity');
        if (eleQuantity) {
            rowData['product_quantity'] = eleQuantity.value;
        }
        let elePrice = row.querySelector('.table-row-price');
        if (elePrice) {
            rowData['product_cost_price'] = $(elePrice).valCurrency();
        }
        let eleSubtotal = row.querySelector('.table-row-subtotal');
        if (eleSubtotal) {
            rowData['product_subtotal_price'] = $(eleSubtotal).valCurrency();
        }
        let eleOrder = row.querySelector('.table-row-order');
        if (eleOrder) {
            rowData['order'] = parseInt(eleOrder.innerHTML);
        }
        result.push(rowData);
    }
    return result
}

function setupDataExpense() {
    let result = [];
    let table = document.getElementById('datable-quotation-create-expense');
    let tableBody = table.tBodies[0];
    for (let i = 0; i < tableBody.rows.length; i++) {
        let rowData = {};
        let row = tableBody.rows[i];
        let eleExpense = row.querySelector('.table-row-item');
        if (eleExpense) {
            let optionSelected = eleExpense.options[eleExpense.selectedIndex];
            if (optionSelected) {
                if (optionSelected.querySelector('.data-info')) {
                    let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                    rowData['expense'] = dataInfo.id;
                    rowData['expense_title'] = dataInfo.title;
                    rowData['expense_code'] = dataInfo.code;
                }
            }
        }
        let eleUOM = row.querySelector('.table-row-uom');
        if (eleUOM) {
            let optionSelected = eleUOM.options[eleUOM.selectedIndex];
            if (optionSelected) {
                if (optionSelected.querySelector('.data-info')) {
                    let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                    rowData['unit_of_measure'] = dataInfo.id;
                    rowData['expense_uom_title'] = dataInfo.title;
                    rowData['expense_uom_code'] = dataInfo.code;
                }
            }

        }
        let eleTax = row.querySelector('.table-row-tax');
        if (eleTax) {
            let optionSelected = eleTax.options[eleTax.selectedIndex];
            if (optionSelected) {
                if (optionSelected.querySelector('.data-info')) {
                    let dataInfo = JSON.parse(optionSelected.querySelector('.data-info').value);
                    rowData['tax'] = dataInfo.id;
                    rowData['expense_tax_title'] = dataInfo.title;
                    rowData['expense_tax_value'] = dataInfo.value;
                }
            }

        }
        let eleTaxAmount = row.querySelector('.table-row-tax-amount');
        if (eleTaxAmount) {
            rowData['expense_tax_amount'] = $(eleTaxAmount).valCurrency();
        }
        let eleQuantity = row.querySelector('.table-row-quantity');
        if (eleQuantity) {
            rowData['expense_quantity'] = eleQuantity.value;
        }
        let elePrice = row.querySelector('.table-row-price');
        if (elePrice) {
            rowData['expense_price'] = $(elePrice).valCurrency();
        }
        let eleSubtotal = row.querySelector('.table-row-subtotal');
        if (eleSubtotal) {
            rowData['expense_subtotal_price'] = $(eleSubtotal).valCurrency();
        }
        let eleOrder = row.querySelector('.table-row-order');
        if (eleOrder) {
            rowData['order'] = parseInt(eleOrder.innerHTML);
        }
        result.push(rowData);
    }
    return []
}

function setupDataLogistic() {
    return {
        'shipping_address': $('#quotation-create-shipping-address').val(),
        'billing_address': $('#quotation-create-billing-address').val(),
    }
}

function setupDataSubmit(_form) {
    let dateCreatedVal = $('#quotation-create-date-created').val();
    if (dateCreatedVal) {
        _form.dataForm['data_created'] = moment(dateCreatedVal).format('YYYY-MM-DD HH:mm:ss')
    }
    _form.dataForm['status'] = $('#quotation-create-status').val();
    _form.dataForm['total_product_pretax_amount'] = $('#quotation-create-product-pretax-amount').valCurrency();
    _form.dataForm['total_product_discount'] = $('#quotation-create-product-discount-amount').valCurrency();
    _form.dataForm['total_product_tax'] = $('#quotation-create-product-taxes').valCurrency();
    _form.dataForm['total_product'] = $('#quotation-create-product-total').valCurrency();
    _form.dataForm['total_cost_pretax_amount'] = $('#quotation-create-cost-pretax-amount').valCurrency();
    _form.dataForm['total_cost_tax'] = $('#quotation-create-cost-taxes').valCurrency();
    _form.dataForm['total_cost'] = $('#quotation-create-cost-total').valCurrency();
    _form.dataForm['total_expense_pretax_amount'] = $('#quotation-create-expense-pretax-amount').valCurrency();
    _form.dataForm['total_expense_tax'] = $('#quotation-create-expense-taxes').valCurrency();
    _form.dataForm['total_expense'] = $('#quotation-create-expense-total').valCurrency();

    _form.dataForm['quotation_products_data'] = setupDataProduct();
    _form.dataForm['quotation_costs_data'] = setupDataCost();
    _form.dataForm['quotation_expenses_data'] = setupDataExpense();

    _form.dataForm['quotation_logistic_data'] = setupDataLogistic();
}