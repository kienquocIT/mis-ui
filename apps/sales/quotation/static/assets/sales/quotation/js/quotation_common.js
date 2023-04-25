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

function loadBoxQuotationCustomer(customer_id, valueToSelect = null) {
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
                        let dataStr = JSON.stringify({
                            'id': item.id,
                            'Name': item.name,
                            'Owner name': item.owner.fullname,
                        }).replace(/"/g, "&quot;");
                        let dataAppend = `<option value="${item.id}">
                                            <span class="account-title">${item.name}</span>
                                            <input type="hidden" class="data-info" value="${dataStr}">
                                        </option>`
                        if (item.id === valueToSelect) {
                            dataAppend = `<option value="${item.id}" selected>
                                            <span class="account-title">${item.name}</span>
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

function loadBoxQuotationContact(contact_id) {
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
                        ele.append(`<option value="${item.id}">
                                        <span class="contact-title">${item.fullname}</span>
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </option>`)
                    })
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
            let dataStr = JSON.stringify({
                'id': data[i].id,
                'title': data[i].title,
                'code': data[i].code,
                'unit of measure': data[i].sale_information.default_uom.title,
            }).replace(/"/g, "&quot;");
            let product_data = JSON.stringify({
                'id': data[i].id,
                'title': data[i].title,
                'code': data[i].code,
                'unit_of_measure': data[i].sale_information.default_uom,
                'unit_price': data[i].unit_price,
                'cost_price': data[i].cost_price,
                'tax': data[i].sale_information.tax_code,
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
            eleBox.append(`<option value="${data[i].id}"><span class="uom-title">${data[i].title}</span></option>`)
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
            eleBox.append(`<option value="${data[i].id}" data-value="${data[i].rate}"><span class="tax-title">${data[i].title}</span></option>`)
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
                                    <option value=""></option>
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
                                    class="form-control mask-money table-row-subtotal" 
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
                                <select class="form-select table-row-item" disabled>
                                    <option value="${row.valueProduct}" selected>${row.showProduct}</option>
                                </select>
                            </div>`;
                }
            },
            {
                targets: 2,
                width: "1%",
                render: (data, type, row) => {
                    return `<div class="row">
                                <select class="form-select table-row-uom" disabled>
                                    <option value="${row.valueUOM}" selected>${row.showUOM}</option>
                                </select>
                            </div>`;
                },
            },
            {
                targets: 3,
                width: "1%",
                render: (data, type, row) => {
                    return `<div class="row"><input type="text" class="form-control table-row-quantity" value="${row.valueQuantity}" disabled></div>`;
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    return `<div class="row">
                                <input type="text" class="form-control w-80 table-row-price" value="${row.valuePrice}" required>
                                <span class="w-20 mt-2 quotation-currency">VND</span>
                            </div>`;
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    return `<div class="row">
                                <select class="form-select table-row-tax">${row.optionTax}</select>
                                <input
                                    type="text"
                                    class="form-control mask-money table-row-tax-amount"
                                    data-return-type="number"
                                    value="${row.valueTaxAmount}"
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
                                    class="form-control mask-money table-row-subtotal" 
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
                                    <option value=""></option>
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
                                    class="form-control mask-money table-row-subtotal" 
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

function updateTotal(tableProduct, pretax_id, taxes_id, total_id, discount_id = null) {
    let pretaxAmount = 0;
    let taxAmount = 0;
    let elePretaxAmount = document.getElementById(pretax_id);
    let eleDiscount = document.getElementById(discount_id);
    let eleTaxes = document.getElementById(taxes_id);
    let eleTotal = document.getElementById(total_id);
    let tableLen = tableProduct.tBodies[0].rows.length;
    for (let i = 0; i < tableLen; i++) {
        let row = tableProduct.tBodies[0].rows[i];
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

function deleteRow(currentRow, tableBody, table, pretax_id, taxes_id, total_id, discount_id = null) {
    currentRow.remove();
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

function updateRowTaxAmount(row, eleTotal) {
    let eleTax = row.querySelector('.table-row-tax');
    if (eleTax) {
        let optionSelected = eleTax.options[eleTax.selectedIndex];
        if (optionSelected) {
            let subTotalVal = $(eleTotal).valCurrency();
            let taxAmount = ((subTotalVal * Number(optionSelected.getAttribute('data-value'))) / 100);
            let eleTaxAmount = row.querySelector('.table-row-tax-amount');
            if (eleTaxAmount) {
                eleTaxAmount.value = taxAmount;
                $(eleTaxAmount).maskMoney('mask', taxAmount)
            }
        }
    }
}

function changeQuantity(quantity, row, table, pretax_id, taxes_id, total_id, discount_id = null) {
    let discountValue = "";
    let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
    if (eleDiscountAmount) {
        if (eleDiscountAmount.value) {
            discountValue = $(eleDiscountAmount).valCurrency();
        }
    }
    let price = row.querySelector('.table-row-price');
    let subtotal = "";
    if (price) {
        if (price.value && quantity) {
            let priceVal = $(price).valCurrency();
            if (discountValue) {
                subtotal = ((priceVal - discountValue) * parseInt(quantity));
            } else {
                subtotal = parseInt(quantity) * priceVal;
            }
            let eleTotal = row.querySelector('.table-row-subtotal')
            if (eleTotal && subtotal) {
                eleTotal.value = subtotal;
                $(eleTotal).maskMoney('mask', subtotal)
                updateRowTaxAmount(row, eleTotal);
            }
        }
    }
    updateTotal(table, pretax_id, taxes_id, total_id, discount_id);
}

function changePrice(price, row, table, pretax_id, taxes_id, total_id, discount_id = null) {
    let discountValue = "";
    let eleDiscountAmount = row.querySelector('.table-row-discount-amount');
    if (eleDiscountAmount) {
        if (eleDiscountAmount.value) {
            discountValue = $(eleDiscountAmount).valCurrency();
        }
    }
    let quantity = row.querySelector('.table-row-quantity');
    let subtotal = "";
    if (quantity) {
        if (quantity.value && price) {
            if (discountValue) {
                subtotal = ((price - discountValue) * parseInt(quantity.value));
            } else {
                subtotal = (price * parseInt(quantity.value));
            }
            let eleTotal = row.querySelector('.table-row-subtotal')
            if (eleTotal && subtotal) {
                eleTotal.value = subtotal;
                $(eleTotal).maskMoney('mask', subtotal)
                updateRowTaxAmount(row, subtotal)
            }
        }
    }
    updateTotal(table, pretax_id, taxes_id, total_id, discount_id);
}

function changeTax(tax, row, table, pretax_id, taxes_id, total_id, discount_id = null) {
    let subtotal = row.querySelector('.table-row-subtotal');
    if (subtotal) {
        let subtotalVal = $(subtotal).valCurrency();
        if (subtotalVal && tax) {
            let taxAmount = ((subtotalVal * Number(tax)) / 100);
            let eleTaxAmount = row.querySelector('.table-row-tax-amount');
            if (eleTaxAmount) {
                eleTaxAmount.value = taxAmount;
                $(eleTaxAmount).maskMoney('mask', taxAmount)
            }
        }
    }
    updateTotal(table, pretax_id, taxes_id, total_id, discount_id);
}

function changeDiscount(discount, row, table, pretax_id, taxes_id, total_id, discount_id = null) {
    let eleDiscount = row.querySelector('.table-row-discount-amount');
    let elePrice = row.querySelector('.table-row-price');
    let eleQuantity = row.querySelector('.table-row-quantity');
    let eleSubtotal = row.querySelector('.table-row-subtotal');
    if (discount && eleDiscount && elePrice) {
        if (elePrice.value) {
            let priceVal = $(elePrice).valCurrency();
            let discountAmount = ((priceVal * Number(discount)) / 100);
            eleDiscount.value = discountAmount;
            if (eleQuantity && discountAmount && eleSubtotal) {
                if (eleQuantity.value) {
                    let subtotal = ((priceVal - discountAmount) * parseInt(eleQuantity.value));
                    eleSubtotal.value = subtotal;
                    $(eleSubtotal).maskMoney('mask', subtotal);
                }
            }
            $(eleDiscount).maskMoney('mask', discountAmount);
        }
    }
    updateTotal(table, pretax_id, taxes_id, total_id, discount_id);
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
}