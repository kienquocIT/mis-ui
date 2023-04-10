"use strict";

$(function () {

    function loadBoxQuotationSalePerson() {
        let ele = $('#select-box-quotation-sale-person');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('employee_list') && Array.isArray(data.employee_list)) {
                        data.employee_list.map(function (item) {
                            ele.append(`<option value="${item.id}">${item.full_name}</option>`)
                        })
                    }
                }
            }
        )
    }

    function updateTotal(tableProduct, is_change_subtotal = false, is_change_tax = false) {
        let pretaxAmount = 0;
        let taxAmount = 0;
        let elePretaxAmount = document.getElementById('quotation-create-product-pretax-amount');
        let eleTaxes = document.getElementById('quotation-create-product-taxes');
        let eleTotal = document.getElementById('quotation-create-product-total');
        let tableLen = tableProduct.tBodies[0].rows.length;
        for (let i = 0; i < tableLen; i++) {
            let row = tableProduct.tBodies[0].rows[i];
            if (is_change_subtotal === true) {
                let subtotal = row.querySelector('.quotation-product-subtotal').getAttribute('data-value');
                if (subtotal) {
                    pretaxAmount += Number(subtotal);
                }
            } else if (is_change_tax === true) {
                let subTaxAmount = row.querySelector('.quotation-product-tax').getAttribute('data-tax-amount');
                if (subTaxAmount) {
                    taxAmount += Number(subTaxAmount);
                }
            }
        }
        if (is_change_subtotal === true) {
            let total = (pretaxAmount + Number(eleTaxes.innerHTML));
            elePretaxAmount.innerHTML = String(pretaxAmount);
            eleTotal.innerHTML = String(total);
        } else if (is_change_tax === true) {
            let total = (Number(elePretaxAmount.innerHTML) + taxAmount);
            eleTaxes.innerHTML = String(taxAmount);
            eleTotal.innerHTML = String(total);
        }
    }

    function dataTableProduct(data) {
        // init dataTable
        let listData = data ? data : [];
        let $tables = $('#datable-quotation-create-product');
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
                    render: (data, type, row) => {
                        return `<span class="quotation-product-order">${row.order}</span>`;
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
                        return `<span class="quotation-product-subtotal" data-value=""></span>`;
                    }
                },
                {
                    targets: 8,
                    render: () => {
                        let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-product" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></span></span></a>`;
                        let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-product" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a>`;
                        let actionData = bt2 + bt3;
                        return `${actionData}`
                    }
                },
            ],
        });
    }

    $(document).ready(function () {

        loadBoxQuotationSalePerson();
        dataTableProduct();
        $("#select-box-quotation-term-price").select2();
        $("#select-box-quotation-term-discount").select2();
        let tableProduct = $('#datable-quotation-create-product');

// Action on click button add product
        $('#btn-add-product-quotation-create').on('click', function (e) {
            e.preventDefault();
            let order = 1;
            let tableEmpty = tableProduct[0].querySelector('.dataTables_empty');
            let tableLen = tableProduct[0].tBodies[0].rows.length;
            if (tableLen !== 0 && !tableEmpty) {
                order = (tableLen+1);
            }
            let dataAdd =
                {
                    'product': `<div class="row">
                                    <select class="form-select quotation-product-product" required>
                                        <option></option>
                                        <option>Laptop HP</option>
                                        <option>Laptop Dell</option>
                                        <option>Laptop Lenovo</option>
                                    </select>
                                </div>`,
                    'description': `<div class="row"><input type="text" class="form-control quotation-product-description"></div>`,
                    'unit_of_measure': `<div class="row">
                                            <select class="form-select quotation-product-uom" required>
                                                <option></option>
                                                <option>Item</option>
                                                <option>Box</option>
                                            </select>
                                        </div>`,
                    'quantity': `<div class="row"><input type="text" class="form-control quotation-product-quantity" required></div>`,
                    'unit_price': `<div class="row"><input type="text" class="form-control quotation-product-unit-price" required></div>`,
                    'tax': `<div class="row">
                                <select class="form-select quotation-product-tax" data-tax-amount="">
                                    <option></option>
                                    <option value="10">Vat-10</option>
                                    <option value="5">Vat-5</option>
                                    <option value="20">Vat-20</option>
                                </select>
                            </div>`,
                    'order': `<span class="product-order">${order}</span>`
                }
            tableProduct.DataTable().row.add(dataAdd).draw();
        });

// Action on delete row node
        tableProduct.on('click', '.del-product', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            let currentRow = $(this).closest('tr');
            let tableBody = $(this)[0].closest('tbody');
            currentRow.remove();
            let order = 0;
            for (let idx = 0; idx < tableBody.rows.length; idx++) {
                order++;
                let productOrder = tableBody.rows[idx].querySelector('.product-order');
                if (productOrder) {
                    productOrder.innerHTML = order;
                }
            }
            return false;
        });

// Action on change product quantity
        tableProduct.on('change', '.quotation-product-quantity', function (e) {
            let quantity = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let price = row.querySelector('.quotation-product-unit-price');
            if (price) {
                if (price.value && quantity) {
                    let subtotal = (Number(quantity) * Number(price.value));
                    let eleTotal = row.querySelector('.quotation-product-subtotal')
                    if (eleTotal) {
                        eleTotal.innerHTML = subtotal;
                        eleTotal.setAttribute('data-value', String(subtotal));
                    }
                }
            }
            updateTotal(tableProduct[0], true, false);
        });

// Action on change product unit price
        tableProduct.on('change', '.quotation-product-unit-price', function (e) {
            let price = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let quantity = row.querySelector('.quotation-product-quantity');
            if (quantity) {
                if (quantity.value && price) {
                    let subtotal = (Number(price) * Number(quantity.value));
                    let eleTotal = row.querySelector('.quotation-product-subtotal')
                    if (eleTotal) {
                        eleTotal.innerHTML = subtotal;
                        eleTotal.setAttribute('data-value', String(subtotal));
                    }
                }
            }
            updateTotal(tableProduct[0], true, false);
        });

// Action on change product tax
        tableProduct.on('change', '.quotation-product-tax', function (e) {
            let tax = $(this)[0].value;
            let row = $(this)[0].closest('tr');
            let subtotal = row.querySelector('.quotation-product-subtotal');
            if (subtotal) {
                let subtotalVal = subtotal.getAttribute('data-value');
                if (subtotalVal && tax) {
                    let taxAmount = ((Number(subtotalVal) * Number(tax))/100);
                    $(this)[0].setAttribute('data-tax-amount', String(taxAmount))
                }
            }
            updateTotal(tableProduct[0], false, true);
        });


    });
});
