let PQRSelectBoxEle = $('#purchase-request-select-box');
let deliveryDateInput = $('#delivery_date');
let PRTable = $('#table-select-purchase-request');
let PRProductsTable = $('#table-select-purchase-request-products');
let PRProductsForMergeTable = $('#table-select-purchase-request-products-for-merge');
let PQRProductsSelectedTable = $('#table-purchase-quotation-request-products-selected')
let PURCHASE_REQUEST_LIST = [];
let TAX_LIST = [];

PQRSelectBoxEle.prop('disabled', true);

deliveryDateInput.dateRangePickerDefault({
    singleDatePicker: true,
    timePicker: true,
    showDropdowns: true,
    minYear: 1901,
    locale: {
        format: 'YYYY-MM-DD'
    },
    "cancelClass": "btn-secondary",
    maxYear: parseInt(moment().format('YYYY'),10)
});

deliveryDateInput.prop('readonly', true).val('');

async function LoadTaxList() {
    await $.fn.callAjax(PQRProductsSelectedTable.attr('data-url-tax'), 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                TAX_LIST = data?.['tax_list'];
                return data?.['tax_list'];
            }
            return [];
        }
    })
}

function Group(data) {
    return data.reduce(function (acc, curr) {
        let found = acc.find(function (arr) {return arr[0].id === curr.id;});
        if (found) {found.push(curr)}
        else {acc.push([curr])}
        return acc;
    }, []);
}

function GetSmallestRatioElement(data) {
    return data.reduce(function (minElement, currentElement) {
        if (currentElement.uom.ratio < minElement.uom.ratio) {return currentElement;}
        else {return minElement;}
    }, data[0]);
}

function LoadPurchaseRequestSelectBox(purchase_request_list_selected) {
    $('#purchase-request-select-box option').remove();
    for (let i = 0; i < PURCHASE_REQUEST_LIST.length; i++) {
        if (purchase_request_list_selected.includes(PURCHASE_REQUEST_LIST[i].id)) {
            PQRSelectBoxEle.append(`<option value="${PURCHASE_REQUEST_LIST[i].id}" selected>${PURCHASE_REQUEST_LIST[i].code}</option>`)
        }
    }
    PQRSelectBoxEle.select2();
}

function LoadPurchaseRequestTable() {
    let PR_code_badge_style = [
        'badge-soft-primary',
        'badge-soft-danger',
        'badge-soft-blue',
        'badge-soft-orange',
        'badge-soft-green',
        'badge-soft-secondary',
        'badge-soft-warning',
        'badge-soft-orange',
        'badge-soft-brown',
        'badge-soft-indigo',
    ]
    let last_purchase_request_code = '';
    let style_order = -1;
    PRTable.DataTable().clear().destroy();
    PRTable.DataTableDefault({
        paging: false,
        dom: "<'row mt-3 miner-group'>" + "<'row mt-3'<'col-sm-12'tr>>",
        ajax: {
            url: PRTable.attr('data-url'),
            type: PRTable.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.data['purchase_request_list']) {
                        PURCHASE_REQUEST_LIST = resp.data['purchase_request_list'];
                        return resp.data['purchase_request_list'];
                    } else {
                        return [];
                    }
                }
                return [];
            }
        },
        columns: [
            {
                data: '',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<input id="${row.id}" type="checkbox" class="form-check-purchase-request">`;
                }
            },
            {
                data: 'code',
                className: 'wrap-text w-30',
                render: (data, type, row) => {
                    if (last_purchase_request_code !== row.code) {
                    last_purchase_request_code = row.code;
                    if (style_order === 9) { style_order = -1;}
                    style_order = style_order + 1;
                }
                    return `<span class="pr-code-span badge ` + PR_code_badge_style[style_order] + ` w-100">${row.code}</span>`;
                }
            },
            {
                data: 'title',
                className: 'wrap-text- w-60',
                render: (data, type, row) => {
                    return row.title;
                }
            },
        ],
    });
}

function LoadPurchaseRequestProductsTable() {
    let PR_code_badge_style = [];
    let purchase_request_products_data = [];
    $('.form-check-purchase-request:checked').each(function () {
        PR_code_badge_style.push($(this).closest('tr').find('.pr-code-span').attr('class'))
        let purchase_request_get = $(this).attr('id');
        purchase_request_products_data = purchase_request_products_data.concat(
            PURCHASE_REQUEST_LIST.filter(function(element) {
                return element.id === purchase_request_get
            })[0].product_list
        )
    })
    let last_purchase_request_code = '';
    let style_order = -1;
    PRProductsTable.DataTable().clear().destroy();
    PRProductsTable.DataTableDefault({
        paging: false,
        dom: "<'row mt-3 miner-group'>" + "<'row mt-3'<'col-sm-12'tr>>",
        data: purchase_request_products_data,
        columns: [
            {
                data: '',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<input id="${row.id}" data-title="${row.title}"data-uom-id="${row.uom.id}" data-uom-title="${row.uom.title}" data-quantity="${row.quantity}" data-pr-unit-price="${row.product_unit_price}" data-tax-id="${row.tax.id}" data-tax-value="${row.tax.value}" data-tax-code="${row.tax.code}" data-pr-code="${row?.['purchase_request_code']}" type="checkbox" class="form-check-purchase-request-products">`;
                }
            },
            {
                data: 'title',
                className: 'wrap-text w-30',
                render: (data, type, row) => {
                    return row.title;
                }
            },
            {
                data: 'purchase_request_code',
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    if (last_purchase_request_code !== row?.['purchase_request_code']) {
                        last_purchase_request_code = row?.['purchase_request_code'];
                        style_order = style_order + 1;
                    }
                    return `<span class="badge ` + PR_code_badge_style[style_order] + ` w-80">${row?.['purchase_request_code']}</span>`;
                }
            },
            {
                data: 'uom',
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    return row.uom.title;
                }
            },
            {
                data: 'quantity',
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    return row.quantity;
                }
            },
        ],
    })
}

function LoadPurchaseRequestProductsTableForMerge(product_id_list) {
    let pr_products_data = [];
    $('.form-check-purchase-request:checked').each(function () {
        let purchase_request_get = $(this).attr('id');
        pr_products_data = pr_products_data.concat(
            PURCHASE_REQUEST_LIST.filter(function(element) {
                return element.id === purchase_request_get
            })[0].product_list
        )
    })
    let pr_products_premerge_data = [];
    for (let i = 0; i < pr_products_data.length; i++) {
        let temp = pr_products_data[i];
        let product_get = product_id_list.filter(function(element) {
            return element.product_id === temp.id && element.pr_code === temp?.['purchase_request_code'] && element.uom_id === temp.uom.id
        })
        if (product_get.length > 0) {
            pr_products_premerge_data.push(temp)
        }
    }

    let pre_merge_data_group_by_product_id = Group(pr_products_premerge_data)

    let pr_products_merge_data = [];
    for (let i = 0; i < pre_merge_data_group_by_product_id.length; i++) {
        let temp = pre_merge_data_group_by_product_id[i];
        let smallestRatioElement = GetSmallestRatioElement(temp);

        let sum_converted_item = 0;
        for (let j = 0; j < temp.length; j++) {
            sum_converted_item += temp[j].quantity * parseFloat(temp[j].uom.ratio) / parseFloat(smallestRatioElement.uom.ratio);
        }

        let pr_code_list = temp.map(function (item) {
            return item?.['purchase_request_code'];
        });

        pr_products_merge_data.push(
            {
                "id": temp[0].id,
                "title": temp[0].title,
                "uom": Object.keys(smallestRatioElement.uom).length > 0 ? smallestRatioElement.uom : {},
                "quantity": sum_converted_item,
                "purchase_request_code_list": pr_code_list,
                "product_unit_price": smallestRatioElement.product_unit_price,
                "tax": Object.keys(smallestRatioElement.tax).length > 0 ? smallestRatioElement.tax : {}
            }
        )
    }

    PRProductsForMergeTable.DataTable().destroy();
    PRProductsForMergeTable.DataTableDefault({
        paging: false,
        dom: "<'row mt-3 miner-group'>" + "<'row mt-3'<'col-sm-12'tr>>",
        data: pr_products_merge_data,
        columns: [
            {
                data: '',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<input checked id="${row.id}" data-title="${row.title}" data-uom-id="${row.uom.id}" data-uom-title="${row.uom.title}" data-quantity="${row.quantity}" data-pr-unit-price="${row.product_unit_price}" data-tax-id="${row.tax.id}" data-tax-value="${row.tax.value}" data-tax-code="${row.tax.code}" type="checkbox" class="form-check-purchase-request-products-for-merge">`;
                }
            },
            {
                data: 'title',
                className: 'wrap-text w-30',
                render: (data, type, row) => {
                    return row.title;
                }
            },
            {
                data: 'purchase_request_code_list',
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    let html = ``;
                    for (let i = 0; i < row.purchase_request_code_list.length; i++) {
                        let style = null;
                        $('#table-select-purchase-request tbody').find('.pr-code-span').each(function () {
                            if ($(this).text() === row.purchase_request_code_list[i]) {
                                style = $(this).attr('class');
                            }
                        })
                        html += `<span class="` + style + ` w-80 mb-1">${row.purchase_request_code_list[i]}</span>`;
                    }
                    return html;
                }
            },
            {
                data: 'uom',
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    return row.uom.title;
                }
            },
            {
                data: 'quantity',
                className: 'wrap-text w-20 text-center',
                render: (data, type, row) => {
                    return row.quantity;
                }
            },
        ],
    })
}

function calculate_price(table_tr) {
    let sum_price_pre_tax_value = 0;
    let sum_tax_value = 0;
    let sum_price_after_tax_value = 0;
    table_tr.each(function () {
        let quantity = $(this).find('.product-quantity').val();
        let pr_unit_price = $(this).find('.pr-unit-price-input').attr('value');
        let tax_rate = 0;
        if ($(this).find('.product-tax-select-box').val()) {
            let tax_selected = JSON.parse($('#' + $(this).find('.product-tax-select-box').attr('data-idx-data-loaded')).text())[$(this).find('.product-tax-select-box').val()];
            tax_rate = tax_selected.rate;
        }
        let current_pre_tax_value = parseFloat(quantity) * parseFloat(pr_unit_price);
        sum_price_pre_tax_value += current_pre_tax_value;
        sum_tax_value += current_pre_tax_value * tax_rate / 100;
        sum_price_after_tax_value += current_pre_tax_value + current_pre_tax_value * tax_rate / 100
    })
    $('#pretax-value').attr('data-init-money', sum_price_pre_tax_value);
    $('#taxes-value').attr('data-init-money', sum_tax_value);
    $('#total-value').attr('data-init-money', sum_price_after_tax_value);
}

function loadProductList(row_id, data) {
    let ele = $('#' + row_id + ' .product-select-box');
    ele.initSelect2({
        ajax: {
            url: PQRProductsSelectedTable.attr('data-url-product'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'product_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadProductTaxList(row_id, data) {
    let ele = $('#' + row_id + ' .product-tax-select-box');
    ele.initSelect2({
        ajax: {
            url: PQRProductsSelectedTable.attr('data-url-tax'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'tax_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadProductUomList(row_id, data, uom_group_id) {
    let ele = $('#' + row_id + ' .product-uom-select-box');
    ele.initSelect2({
        ajax: {
            url: PQRProductsSelectedTable.attr('data-url-uom'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i]?.['group']['id'] === uom_group_id) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'unit_of_measure',
        keyId: 'id',
        keyText: 'title',
    })
}

function count_row(table_body, option) {
    let count = 0;
    table_body.find('tr td.number').each(function () {
        count = count + 1;
        $(this).text(count);
        $(this).closest('tr').attr('id', 'row-' + count.toString())
    });
    if (option === 1) {
        loadProductList('row-' + count.toString());
        loadProductTaxList('row-' + count.toString());
    }
    return count;
}

function Disable() {
    $('.form-control').prop('disabled', true).css({color: 'black'});
    $('.form-select').prop('disabled', true).css({color: 'black'});
    $('.select2').prop('disabled', true);
    $('input').prop('disabled', true);
}

function LoadDetailPQR() {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-purchase-quotation-request').attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['purchase_quotation_request_detail']?.['workflow_runtime_id']);
                let data_detail = data['purchase_quotation_request_detail'];
                $.fn.compareStatusShowPageAction(data_detail);
                console.log(data_detail)

                if (data_detail.purchase_quotation_request_type) {
                    $('#pr-div').prop('hidden', true);

                    $('#code-span').text(data_detail.code);
                    $('#title').val(data_detail.title);
                    deliveryDateInput.val(data_detail.delivered_date.split(' ')[0]);
                    $('#note').val(data_detail.note);
                    $('#pretax-value').attr('data-init-money', data_detail.pretax_price);
                    $('#taxes-value').attr('data-init-money', data_detail.taxes_price);
                    $('#total-value').attr('data-init-money', data_detail.total_price);

                    PQRProductsSelectedTable.DataTable().clear().destroy();
                    PQRProductsSelectedTable.DataTableDefault({
                        reloadCurrency: true,
                        paging: false,
                        dom: "",
                        data: data_detail?.['products_mapped'],
                        columns: [
                            {
                                data: 'index',
                                className: 'wrap-text text-center w-5',
                                render: (data, type, row) => {
                                    return row.index;
                                }
                            },
                            {
                                data: 'title',
                                className: 'wrap-text w-15',
                                render: (data, type, row) => {
                                    return `<span class="product-title" data-product-id="${row.product.id}">${row.product.title}</span>`;
                                }
                            },
                            {
                                data: 'description',
                                className: 'wrap-text w-15',
                                render: (data, type, row) => {
                                    return `<textarea readonly class="product-description form-control" style="height: 38px">${row.description}</textarea>`;
                                }
                            },
                            {
                                data: 'uom',
                                className: 'wrap-text w-10 text-center',
                                render: (data, type, row) => {
                                    return `<span class="product-uom" data-product-uom-id="${row.product.uom.id}">${row.product.uom.title}</span>`;
                                }
                            },
                            {
                                data: 'quantity',
                                className: 'wrap-text w-10 text-center',
                                render: (data, type, row) => {
                                    return `<span class="product-quantity">${row.quantity}</span>`;
                                }
                            },
                            {
                                data: 'pr_unit_price',
                                className: 'wrap-text w-15',
                                render: (data, type, row) => {
                                    return `<input readonly type="text" class="pr-unit-price-input form-control mask-money" data-return-type="number" value="${row.unit_price}">`;
                                }
                            },
                            {
                                data: 'tax',
                                className: 'wrap-text w-15',
                                render: (data, type, row) => {
                                    let html = `<option selected data-rate="${row.product.tax.rate}" value="${row.product.tax.id}">${row.product.tax.title} (${row.product.tax.rate}%)</option>`;
                                    return `<select style="color: #6f6f6f" disabled class="form-select product-tax-select-box" data-method="GET">${html}</select>`;
                                }
                            },
                            {
                                data: 'pr_subtotal_price',
                                className: 'wrap-text w-15 text-center',
                                render: (data, type, row) => {
                                    return `<span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${row.subtotal_price}"></span>`;
                                }
                            },
                        ],
                    })
                }
                else {
                    $('#code-span').text(data_detail.code);
                    $('#title').val(data_detail.title);
                    deliveryDateInput.val(data_detail.delivered_date.split(' ')[0]);
                    $('#note').val(data_detail.note);
                    $('#pretax-value').attr('data-init-money', data_detail.pretax_price);
                    $('#taxes-value').attr('data-init-money', data_detail.taxes_price);
                    $('#total-value').attr('data-init-money', data_detail.total_price);

                    for (let i = 0; i < data_detail.purchase_requests.length; i++) {
                        PQRSelectBoxEle.append(`<option data-bs-toggle="tooltip" data-bs-placement="bottom" title="${data_detail.purchase_requests[i].title}" value="${data_detail.purchase_requests[i].id}" selected>${data_detail.purchase_requests[i].code}</option>`)
                    }

                    PQRProductsSelectedTable.DataTable().clear().destroy();
                    PQRProductsSelectedTable.DataTableDefault({
                        reloadCurrency: true,
                        paging: false,
                        dom: "",
                        data: data_detail?.['products_mapped'],
                        columns: [
                            {
                                data: 'index',
                                className: 'wrap-text text-center w-5',
                                render: (data, type, row) => {
                                    return row.index;
                                }
                            },
                            {
                                data: 'title',
                                className: 'wrap-text w-15',
                                render: (data, type, row) => {
                                    return `<span class="product-title" data-product-id="${row.product.id}">${row.product.title}</span>`;
                                }
                            },
                            {
                                data: 'description',
                                className: 'wrap-text w-15',
                                render: (data, type, row) => {
                                    return `<textarea readonly class="product-description form-control" style="height: 38px">${row.description}</textarea>`;
                                }
                            },
                            {
                                data: 'uom',
                                className: 'wrap-text w-10 text-center',
                                render: (data, type, row) => {
                                    return `<span class="product-uom" data-product-uom-id="${row.product.uom.id}">${row.product.uom.title}</span>`;
                                }
                            },
                            {
                                data: 'quantity',
                                className: 'wrap-text w-10 text-center',
                                render: (data, type, row) => {
                                    return `<span class="product-quantity">${row.quantity}</span>`;
                                }
                            },
                            {
                                data: 'pr_unit_price',
                                className: 'wrap-text w-15',
                                render: (data, type, row) => {
                                    return `<input readonly type="text" class="pr-unit-price-input form-control mask-money" data-return-type="number" value="${row.unit_price}">`;
                                }
                            },
                            {
                                data: 'tax',
                                className: 'wrap-text w-15',
                                render: (data, type, row) => {
                                    let html = `<option selected data-rate="${row.product.tax.rate}" value="${row.product.tax.id}">${row.product.tax.title} (${row.product.tax.rate}%)</option>`;
                                    return `<select style="color: #6f6f6f" disabled class="form-select product-tax-select-box" data-method="GET">${html}</select>`;
                                }
                            },
                            {
                                data: 'pr_subtotal_price',
                                className: 'wrap-text w-15 text-center',
                                render: (data, type, row) => {
                                    return `<span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${row.subtotal_price}"></span>`;
                                }
                            },
                        ],
                    })
                }

                $.fn.initMaskMoney2();

                Disable();
            }
        })
}

$(document).on("change", '.form-check-purchase-request', function () {
    LoadPurchaseRequestProductsTable();
    $('#btn_create_new_purchase_quotation_request').addClass('disabled');
    $('#table-select-purchase-request-products-div').prop('hidden', false);
    $('#table-select-purchase-request-products-for-merge-div').prop('hidden', true);
    $('#merge').prop('disabled', true).prop('checked', false);
})

$(document).on("change", '.form-check-purchase-request-products', function () {
    if ($('.form-check-purchase-request-products:checked').length > 0) {
        $('#btn_create_new_purchase_quotation_request').removeClass('disabled');
        $('#merge').prop('disabled', false);
    }
    else {
        $('#btn_create_new_purchase_quotation_request').addClass('disabled');
        $('#merge').prop('disabled', true);
    }
})

$(document).on("change", '#merge', function () {
    if ($(this).is(':checked')) {
        let product_id_list = [];
        $('.form-check-purchase-request-products:checked').each(function () {
            product_id_list.push({
                'product_id': $(this).attr('id'),
                'pr_code': $(this).attr('data-pr-code'),
                'uom_id': $(this).attr('data-uom-id')
            })
        })
        LoadPurchaseRequestProductsTableForMerge(product_id_list);
        $('#table-select-purchase-request-products-div').prop('hidden', true);
        $('#table-select-purchase-request-products-for-merge-div').prop('hidden', false);
    }
    else {
        $('#table-select-purchase-request-products-div').prop('hidden', false);
        $('#table-select-purchase-request-products-for-merge-div').prop('hidden', true);
    }
})

$(document).on("click", '#btn_create_new_purchase_quotation_request', function () {
    let pr_selected = [];
    $('.form-check-purchase-request:checked').each(function () {
        pr_selected.push($(this).attr('id'));
    })
    LoadPurchaseRequestSelectBox(pr_selected);

    $('#create_purchase_quotation_request_modal').removeClass('show').css('display', 'none');

    let purchase_request_products_selected_data = [];
    let row_index = 0;
    let pretax_value = 0;
    let taxes_value = 0;
    let total_value = 0;

    let product_element = $('.form-check-purchase-request-products:checked');
    if ($('#merge').is(':checked')) {
        product_element = $('.form-check-purchase-request-products-for-merge:checked');
    }

    product_element.each(function () {
        row_index += 1;
        let pr_unit_price = parseFloat($(this).attr('data-pr-unit-price'));
        let quantity = parseFloat($(this).attr('data-quantity'));
        let tax_value = parseFloat($(this).attr('data-tax-value'));
        let current_pretax_value = pr_unit_price * quantity;

        pretax_value += current_pretax_value;
        taxes_value += current_pretax_value * tax_value / 100;
        total_value += current_pretax_value + current_pretax_value * tax_value / 100;
        purchase_request_products_selected_data.push({
            'index': row_index,
            'product_id': $(this).attr('id'),
            'product_title': $(this).attr('data-title'),
            'uom_id': $(this).attr('data-uom-id'),
            'uom_title': $(this).attr('data-uom-title'),
            'quantity': $(this).attr('data-quantity'),
            'pr_unit_price': $(this).attr('data-pr-unit-price'),
            'tax_id': $(this).attr('data-tax-id'),
            'tax_value': $(this).attr('data-tax-value'),
            'tax_code': $(this).attr('data-tax-code'),
            'pr_subtotal_price': current_pretax_value,
        })
    })

    $('#pretax-value').attr('data-init-money', pretax_value);
    $('#taxes-value').attr('data-init-money', taxes_value);
    $('#total-value').attr('data-init-money', total_value);

    PQRProductsSelectedTable.DataTable().destroy();
    PQRProductsSelectedTable.DataTableDefault({
        reloadCurrency: true,
        paging: false,
        dom: "",
        data: purchase_request_products_selected_data,
        columns: [
            {
                data: 'index',
                className: 'wrap-text text-center w-5',
                render: (data, type, row) => {
                    return row.index;
                }
            },
            {
                data: 'title',
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="product-title" data-product-id="${row.product_id}">${row.product_title}</span>`;
                }
            },
            {
                data: 'description',
                className: 'wrap-text w-15',
                render: () => {
                    return `<textarea class="product-description form-control" style="height: 38px"></textarea>`;
                }
            },
            {
                data: 'uom',
                className: 'wrap-text w-10 text-center',
                render: (data, type, row) => {
                    return `<span class="product-uom" data-product-uom-id="${row.uom_id}">${row.uom_title}</span>`;
                }
            },
            {
                data: 'quantity',
                className: 'wrap-text w-10 text-center',
                render: (data, type, row) => {
                    return `<span class="product-quantity">${row.quantity}</span>`;
                }
            },
            {
                data: 'pr_unit_price',
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<input type="text" class="pr-unit-price-input form-control mask-money" data-return-type="number" value="${row.pr_unit_price}">`;
                }
            },
            {
                data: 'tax',
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    let html = ``;
                    html += `<option data-rate="0"></option>`;
                    for (let i = 0; i < TAX_LIST.length; i++) {
                        if (TAX_LIST[i].id === row.tax_id) {
                            html += `<option selected data-rate="${TAX_LIST[i].rate}" value="${TAX_LIST[i].id}">${TAX_LIST[i].title} (${TAX_LIST[i].rate}%)</option>`;
                        }
                        else {
                            html += `<option data-rate="${TAX_LIST[i].rate}" value="${TAX_LIST[i].id}">${TAX_LIST[i].title} (${TAX_LIST[i].rate}%)</option>`;
                        }
                    }
                    return `<select class="form-select product-tax-select-box" data-method="GET">` + html + `</select>`;
                }
            },
            {
                data: 'pr_subtotal_price',
                className: 'wrap-text w-15 text-center',
                render: (data, type, row) => {
                    return `<span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${row.pr_subtotal_price}"></span>`;
                }
            },
        ],
    })
})

$(document).on("click", '#new-product-btn', function () {
    let table_body = $('#table-purchase-quotation-request-products-selected tbody');
    table_body.append(`<tr id="" class="row-number">
            <td class="number text-center"></td>
            <td><select class="form-select select2 product-select-box" data-method="GET"><option selected></option></select></td>
            <td><textarea class="form-control product-description" style="height: 38px"></textarea></td>
            <td><select class="form-select product-uom-select-box" data-method="GET"><option selected></option></select></td>
            <td><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control product-quantity" value="1"></td>
            <td><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" style="color: black; background: none"></td>
            <td><select class="form-select product-tax-select-box" data-method="GET"><option selected></option></select></td>
            <td><span class="pr-subtotal-price-input mask-money text-primary" data-init-money=""></span></td>
            <td><button class="btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
        </tr>
        <script>
            function checkInputQuantity(value) {
                if (parseInt(value) < 0) {
                    return value*(-1);
                }
                return value;
            }
        </script>`);
    $.fn.initMaskMoney2();
    let row_count = count_row(table_body, 1);

    $('.btn-del-line-detail').on('click', function () {
        $(this).closest('tr').remove();
        count_row(table_body, 2);
        calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
    })
    $('#row-' + row_count + ' .product-select-box').on('change', function () {
        let parent_tr = $(this).closest('tr');

        $('#' + parent_tr.attr('id') + ' .product-unit-price-select-box').attr('value', '');
        $('#' + parent_tr.attr('id') + ' .product-quantity').val(1);
        $('#' + parent_tr.attr('id') + ' .product-subtotal-price').attr('value', '');
        $('#' + parent_tr.attr('id') + ' .product-subtotal-price-after-tax').attr('value', '');
        calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));

        if ($(this).val() !== '') {
            let obj_selected = JSON.parse($('#' + $(this).attr('data-idx-data-loaded')).text())[$(this).val()];
            loadProductUomList(parent_tr.attr('id'), null, obj_selected?.['general_uom_group']['id']);
        } else {
            loadProductUomList(parent_tr.attr('id'), null, null);
        }
    })
});

$(document).on("click", '#btn-show-modal', function () {
    LoadPurchaseRequestTable()
})

$(document).on("change", '.pr-unit-price-input', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
    $.fn.initMaskMoney2();
})

$(document).on("change", '.product-tax-select-box', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
    $.fn.initMaskMoney2();
})

$(document).on("change", '.product-quantity', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
    $.fn.initMaskMoney2();
})

class PQRHandle {
    combinesDataFromPR(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['purchase_request_list'] = PQRSelectBoxEle.val();
        frm.dataForm['delivered_date'] = deliveryDateInput.val();
        frm.dataForm['note'] = $('#note').val();

        frm.dataForm['products_selected'] = []
        $('#table-purchase-quotation-request-products-selected tbody tr').each(function () {
            let product_id = $(this).find('.product-title').attr('data-product-id');
            let product_uom_id = $(this).find('.product-uom').attr('data-product-uom-id');
            let product_quantity =  $(this).find('.product-quantity').val();
            let product_unit_price = $(this).find('.pr-unit-price-input').attr('value');
            let product_subtotal_price = $(this).find('.pr-subtotal-price-input').attr('data-init-money');
            if (product_id !== '' && product_uom_id !== '' && product_quantity !== '' && product_unit_price !== '' && product_subtotal_price !== '') {
                frm.dataForm['products_selected'].push(
                    {
                        'product_id': product_id,
                        'product_description': $(this).find('.product-description').val(),
                        'product_uom_id': product_uom_id,
                        'product_quantity': product_quantity,
                        'product_unit_price': product_unit_price,
                        'product_taxes': $(this).find('.product-tax-select-box option:selected').attr('value'),
                        'product_subtotal_price': product_subtotal_price,
                    }
                )
            }
            else {
                $.fn.notifyB({description: 'Missing fields in Line Detail'}, 'failure');
                return false;
            }
        })

        frm.dataForm['pretax_price'] = $('#pretax-value').attr('data-init-money');
        frm.dataForm['taxes_price'] = $('#taxes-value').attr('data-init-money');
        frm.dataForm['total_price'] = $('#total-value').attr('data-init-money');
        frm.dataForm['purchase_quotation_request_type'] = 0;

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
    combinesDataManual(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['purchase_request_list'] = [];
        frm.dataForm['delivered_date'] = deliveryDateInput.val();
        frm.dataForm['note'] = $('#note').val();

        frm.dataForm['products_selected'] = []
        $('#table-purchase-quotation-request-products-selected tbody tr').each(function () {
            let product_id = $(this).find('.product-select-box').val();
            let product_uom_id = $(this).find('.product-uom-select-box').val();
            let product_quantity = $(this).find('.product-quantity').val();
            let product_unit_price = $(this).find('.pr-unit-price-input').attr('value');
            let product_subtotal_price = $(this).find('.pr-subtotal-price-input').attr('data-init-money');
            if (product_id !== '' && product_uom_id !== '' && product_quantity !== '' && product_unit_price !== '' && product_subtotal_price !== '') {
                frm.dataForm['products_selected'].push(
                    {
                        'product_id': product_id,
                        'product_description': $(this).find('.product-description').val(),
                        'product_uom_id': product_uom_id,
                        'product_quantity': product_quantity,
                        'product_unit_price': product_unit_price,
                        'product_taxes': $(this).find('.product-tax-select-box').val(),
                        'product_subtotal_price': product_subtotal_price,
                    }
                )
            }
            else {
                $.fn.notifyB({description: 'Missing fields in Line Detail'}, 'failure');
                return false;
            }
        })

        frm.dataForm['pretax_price'] = $('#pretax-value').attr('data-init-money');
        frm.dataForm['taxes_price'] = $('#taxes-value').attr('data-init-money');
        frm.dataForm['total_price'] = $('#total-value').attr('data-init-money');
        frm.dataForm['purchase_quotation_request_type'] = 1;

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}
