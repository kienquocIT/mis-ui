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
                    data.opportunity_list.map(function (item) {
                        let customer = {};
                        if (item.customer) {
                            customer = JSON.stringify(item.customer)
                        }
                        let data_show = `${item.title}` + `-` + `${item.code}`;
                        ele.append(`<option value="${item.id}">
                                        <span class="opp-title">${data_show}</span>
                                        <input type="hidden" class="opp-customer-data" value="${customer}">
                                    </option>`)
                    })
                }
            }
        }
    )
}

function loadBoxQuotationCustomer(customer_id) {
    let jqueryId = '#' + customer_id;
    let ele = $(jqueryId);
    let url = ele.attr('data-url');
    let method = ele.attr('data-method');
    $.fn.callAjax(url, method).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                    data.account_list.map(function (item) {
                        let dataStr = JSON.stringify(item).replace(/"/g, "&quot;");
                        ele.append(`<option value="${item.id}">
                                        <span class="account-title">${item.title}</span>
                                        <input type="hidden" class="data-info" value="${dataStr}">
                                    </option>`)
                    })
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
                    data.contact_list.map(function (item) {
                        ele.append(`<option value="${item.id}"><span class="contact-title">${item.title}</span></option>`)
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
        let data = JSON.parse(ele.value);
        for (let i = 0; i < data.length; i++) {
            let product_data = JSON.stringify({
                'unit_of_measure': data[i].unit_of_measure,
                'unit_price': data[i].unit_price,
                'cost_price': data[i].cost_price,
                'tax': data[i].tax,
            }).replace(/"/g, "&quot;");
            eleBox.append(`<option value="${data[i].id}">
                            <span class="product-title">${data[i].title}</span>
                            <input type="hidden" class="product-data" value="${product_data}">
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
                if (data.hasOwnProperty('uom_list') && Array.isArray(data.uom_list)) {
                    ele.val(JSON.stringify(data.uom_list))
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
            eleBox.append(`<option value="${data[i].id}" data-value="${data[i].value}"><span class="tax-title">${data[i].title}</span></option>`)
        }
    }
}

function updateTotal(tableProduct, pretax_id, taxes_id, total_id) {
    let pretaxAmount = 0;
    let taxAmount = 0;
    let elePretaxAmount = document.getElementById(pretax_id);
    let eleTaxes = document.getElementById(taxes_id);
    let eleTotal = document.getElementById(total_id);
    let tableLen = tableProduct.tBodies[0].rows.length;
    for (let i = 0; i < tableLen; i++) {
        let row = tableProduct.tBodies[0].rows[i];
        let subtotal = row.querySelector('.table-row-subtotal');
        if (subtotal) {
            if (subtotal.value)
                pretaxAmount += Number(subtotal.value);
        }
        let subTaxAmount = row.querySelector('.table-row-tax-amount');
        if (subTaxAmount) {
            if (subTaxAmount.value) {
                taxAmount += Number(subTaxAmount.value);
            }
        }
    }
    let total = (pretaxAmount + taxAmount);
    elePretaxAmount.innerHTML = String(pretaxAmount);
    eleTaxes.innerHTML = String(taxAmount);
    eleTotal.innerHTML = String(total);
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
        rowCallback: function (row, data) {
        },
        columns: [
            {
                targets: 0,
                render: (data, type, row) => {
                    if (row.order) {
                        return row.order
                    }
                    return ``
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    if (row.product) {
                        return row.product;
                    }
                    return ``;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    if (row.description) {
                        return row.description;
                    }
                    return ``;
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    if (row.unit_of_measure) {
                        return row.unit_of_measure;
                    }
                    return ``;
                },
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    if (row.quantity) {
                        return row.quantity;
                    }
                    return ``;
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    if (row.unit_price) {
                        return row.unit_price;
                    }
                    return ``;
                }
            },
            {
                targets: 6,
                render: (data, type, row) => {
                    if (row.tax) {
                        return row.tax;
                    }
                    return ``;
                }
            },
            {
                targets: 7,
                render: (data, type, row) => {
                    if (row.subtotal) {
                        return row.subtotal;
                    }
                    return ``;
                }
            },
            {
                targets: 8,
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
                render: (data, type, row) => {
                    if (row.order) {
                        return row.order
                    }
                    return ``
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    if (row.product) {
                        return row.product;
                    }
                    return ``;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    if (row.unit_of_measure) {
                        return row.unit_of_measure;
                    }
                    return ``;
                },
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    if (row.quantity) {
                        return row.quantity;
                    }
                    return ``;
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    if (row.cost_price) {
                        return row.cost_price;
                    }
                    return ``;
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    if (row.tax) {
                        return row.tax;
                    }
                    return ``;
                }
            },
            {
                targets: 6,
                render: (data, type, row) => {
                    if (row.subtotal) {
                        return row.subtotal;
                    }
                    return ``;
                }
            },
            {
                targets: 7,
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
                render: (data, type, row) => {
                    if (row.order) {
                        return row.order
                    }
                    return ``
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    if (row.expense) {
                        return row.expense;
                    }
                    return ``;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    if (row.unit_of_measure) {
                        return row.unit_of_measure;
                    }
                    return ``;
                },
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    if (row.quantity) {
                        return row.quantity;
                    }
                    return ``;
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    if (row.expense_price) {
                        return row.expense_price;
                    }
                    return ``;
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    if (row.tax) {
                        return row.tax;
                    }
                    return ``;
                }
            },
            {
                targets: 6,
                render: (data, type, row) => {
                    if (row.subtotal) {
                        return row.subtotal;
                    }
                    return ``;
                }
            },
            {
                targets: 7,
                render: () => {
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                    return `${bt3}`
                }
            },
        ],
    });
}

function deleteRow(currentRow, tableBody, table, pretax_id, taxes_id, total_id) {
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
    updateTotal(table[0], pretax_id, taxes_id, total_id);
}

function updateRowTaxAmount(row, subtotal) {
    let eleTax = row.querySelector('.table-row-tax');
    if (eleTax) {
        let optionSelected = eleTax.options[eleTax.selectedIndex];
        if (optionSelected) {
            let taxAmount = ((Number(subtotal) * Number(optionSelected.getAttribute('data-value'))) / 100);
            let eleTaxAmount = row.querySelector('.table-row-tax-amount');
            if (eleTaxAmount) {
                eleTaxAmount.value = taxAmount
            }
        }
    }
}

function changeQuantity(quantity, row, table, pretax_id, taxes_id, total_id) {
    let price = row.querySelector('.table-row-price');
    if (price) {
        if (price.value && quantity) {
            let subtotal = (Number(quantity) * Number(price.value));
            let eleTotal = row.querySelector('.table-row-subtotal')
            if (eleTotal) {
                eleTotal.value = subtotal;
                updateRowTaxAmount(row, subtotal);
            }
        }
    }
    updateTotal(table, pretax_id, taxes_id, total_id);
}

function changePrice(price, row, table, pretax_id, taxes_id, total_id) {
    let quantity = row.querySelector('.table-row-quantity');
    if (quantity) {
        if (quantity.value && price) {
            let subtotal = (Number(price) * Number(quantity.value));
            let eleTotal = row.querySelector('.table-row-subtotal')
            if (eleTotal) {
                eleTotal.value = subtotal;
                updateRowTaxAmount(row, subtotal)
            }
        }
    }
    updateTotal(table, pretax_id, taxes_id, total_id);
}

function changeTax(tax, row, table, pretax_id, taxes_id, total_id) {
    let subtotal = row.querySelector('.table-row-subtotal');
    if (subtotal) {
        let subtotalVal = subtotal.value;
        if (subtotalVal && tax) {
            let taxAmount = ((Number(subtotalVal) * Number(tax)) / 100);
            let eleTaxAmount = row.querySelector('.table-row-tax-amount');
            if (eleTaxAmount) {
                eleTaxAmount.value = taxAmount
            }
        }
    }
    updateTotal(table, pretax_id, taxes_id, total_id);
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
                    link = ele.data('link-detail').format_url_with_uuid(data[key])
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