let data_URL_script = $('#data-url-script');
let PQRSelectBoxEle = $('#purchase-request-select-box');
let deliveryDateInput = $('#delivery_date');
let PRTable = $('#table-select-purchase-request');
let PRProductsTable = $('#table-select-purchase-request-products');
let PRProductsForMergeTable = $('#table-select-purchase-request-products-for-merge');
let PQRProductsSelectedTable = $('#table-purchase-quotation-request-products-selected')
let PURCHASE_REQUEST_LIST = [];

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

deliveryDateInput.val('');

$('#input-file-now').dropify({
    messages: {
        'default': 'Drag and drop your file here.',
    },
    tpl: {
        message: '<div class="dropify-message">' +
            '<span class="file-icon"></span>' +
            '<h5>{{ default }}</h5>' +
            '</div>',
    }
});

function deleteSameRow(table, row) {
    console.log(row)
    row.remove();
    count_row(table.find('tbody'));
    calculate_price(table.find('tbody tr'));
}

function checkMergeRow(row) {
    if (data_URL_script.attr('data-pqr-type') === '1') {
        let this_product_id = row.find('.product-select-box').val();
        let this_product_uom_id = row.find('.product-uom-select-box').val();
        let this_product_quantity = row.find('.product-quantity').val();
        PQRProductsSelectedTable.find('tr').each(function () {
            let product_id = $(this).find('.product-select-box').val();
            let product_uom_id = $(this).find('.product-uom-select-box').val();

            if ($(this).find('td:first-child').text() !== row.find('td:first-child').text() && this_product_id === product_id && this_product_uom_id === product_uom_id && this_product_quantity !== '') {
                if ($(this).find('.product-quantity').val() !== '') {
                    row.find('.product-quantity').val(parseFloat($(this).find('.product-quantity').val()) + parseFloat(this_product_quantity));
                    row.find('.pr-unit-price-input').attr('value', 0);
                    row.find('.product-tax-select-box option').remove();
                    row.find('.pr-subtotal-price-input').attr('data-init-money', '0');
                    deleteSameRow(PQRProductsSelectedTable, $(this));
                }
            }
        })
    }
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
    let minEle = data.reduce(function (minElement, currentElement) {
        if (currentElement.uom.ratio < minElement.uom.ratio) {return currentElement;}
        else {return minElement;}
    }, data[0]);
    let minTax = data.reduce(function (minElement, currentElement) {
        if (currentElement.tax.value < minElement.tax.value) {return currentElement;}
        else {return minElement;}
    }, data[0]);
    let minUnitPrice = data.reduce(function (minElement, currentElement) {
        if (currentElement.product_unit_price < minElement.product_unit_price) {return currentElement;}
        else {return minElement;}
    }, data[0]);
    return [minEle, minTax.tax, minUnitPrice.product_unit_price]
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
        dom: "",
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
        dom: "",
        data: purchase_request_products_data,
        columns: [
            {
                data: '',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<input id="${row.id}" data-des="${row.description}" data-title="${row.title}" data-uom-group-id="${row.uom_group.id}" data-uom-id="${row.uom.id}" data-uom-title="${row.uom.title}" data-quantity="${row.quantity}" data-pr-unit-price="${row.product_unit_price}" data-tax-id="${row.tax.id}" data-tax-value="${row.tax.value}" data-tax-code="${row.tax.code}" data-tax-title="${row.tax.title}" data-pr-code="${row?.['purchase_request_code']}" type="checkbox" class="form-check-purchase-request-products">`;
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

function LoadPurchaseRequestProductsTableForMerge(product_id_list=[]) {
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
        let [smallestRatioElement, smallestTax, smallestUnitPrice] = GetSmallestRatioElement(temp);

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
                "description": temp[0].description,
                "uom": Object.keys(smallestRatioElement.uom).length > 0 ? smallestRatioElement.uom : {},
                "uom_group": temp[0].uom_group,
                "quantity": sum_converted_item,
                "purchase_request_code_list": pr_code_list,
                "product_unit_price": smallestUnitPrice,
                "tax": Object.keys(smallestTax).length > 0 ? smallestTax : {}
            }
        )
    }

    PRProductsForMergeTable.DataTable().clear().destroy();
    PRProductsForMergeTable.DataTableDefault({
        paging: false,
        dom: "",
        data: pr_products_merge_data,
        columns: [
            {
                data: '',
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<input checked id="${row.id}" data-des="${row.description}" data-title="${row.title}" data-uom-group-id="${row.uom_group.id}" data-uom-id="${row.uom.id}" data-uom-title="${row.uom.title}" data-quantity="${row.quantity}" data-pr-unit-price="${row.product_unit_price}" data-tax-id="${row.tax.id}" data-tax-value="${row.tax.value}" data-tax-code="${row.tax.code}" data-tax-title="${row.tax.title}" type="checkbox" class="form-check-purchase-request-products-for-merge">`;
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
        let tax_selected = $(this).find('.product-tax-select-box').val();
        if (tax_selected !== null) {
            tax_selected = JSON.parse($('#' + $(this).find('.product-tax-select-box').attr('data-idx-data-loaded')).text())[$(this).find('.product-tax-select-box').val()]
        }
        let tax_rate = 0;
        if (tax_selected) {
            tax_rate = tax_selected.rate;
        }
        let current_pre_tax_value = parseFloat(quantity) * parseFloat(pr_unit_price);
        // console.log(quantity, pr_unit_price, tax_selected, tax_rate, current_pre_tax_value)
        if (current_pre_tax_value) {
            sum_price_pre_tax_value += current_pre_tax_value;
            sum_tax_value += current_pre_tax_value * tax_rate / 100;
            sum_price_after_tax_value += current_pre_tax_value + current_pre_tax_value * tax_rate / 100;
        }
    })
    $('#pretax-value').attr('data-init-money', sum_price_pre_tax_value);
    $('#taxes-value').attr('data-init-money', sum_tax_value);
    $('#total-value').attr('data-init-money', sum_price_after_tax_value);
    $.fn.initMaskMoney2();
}

function loadProductList(ele, data) {
    ele.initSelect2({
        ajax: {
            url: data_URL_script.attr('data-url-product'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'product_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        let obj_selected = JSON.parse($('#' + $(this).attr('data-idx-data-loaded')).text())[$(this).val()];
        $(this).closest('tr').find('.product-description').text(obj_selected.description);
        loadProductUomList($(this).closest('tr').find('.product-uom-select-box'), null, obj_selected?.['general_uom_group']['id']);
        checkMergeRow($(this).closest('tr'))
    })
}

function loadProductUomList(ele, data, uom_group_id) {
    ele.initSelect2({
        ajax: {
            url: data_URL_script.attr('data-url-uom'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i]?.['group']['id'] === uom_group_id) {
                    result.push(resp.data[keyResp][i])
                }
            }
            if (result.length > 0) {
                $('.select2-results__message').prop('hidden', true);
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'unit_of_measure',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        checkMergeRow($(this).closest('tr'))
    })
}

function loadProductTaxList(ele, data) {
    ele.initSelect2({
        ajax: {
            url: data_URL_script.attr('data-url-tax'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'tax_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function count_row(table_body) {
    table_body.find('tr').each(function (index) {
        $(this).find('.number').text(index + 1);
    });
    $.fn.initMaskMoney2();
}

function Disable(for_update) {
    if (for_update === false) {
        $('.form-control').prop('disabled', true).css({color: 'black'});
        $('.form-select').prop('disabled', true).css({color: 'black'});
        $('.select2').prop('disabled', true);
        $('input').prop('disabled', true);
        $('#btn-show-modal').attr('hidden', true);
    }
}

function LoadDetailPQR(for_update=false) {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-purchase-quotation-request').attr('data-url').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['purchase_quotation_request_detail']?.['workflow_runtime_id']);
                let data_detail = data['purchase_quotation_request_detail'];
                $.fn.compareStatusShowPageAction(data_detail);
                $x.fn.renderCodeBreadcrumb(data_detail);
                console.log(data_detail)

                data_URL_script.attr('data-pqr-type', data_detail.purchase_quotation_request_type);
                if (data_detail.purchase_quotation_request_type) {
                    $('#pr-div').attr('hidden', true);
                    $('#title').val(data_detail.title);
                    deliveryDateInput.val(data_detail.delivered_date.split(' ')[0]);
                    $('#note').val(data_detail.note);
                    $('#pretax-value').attr('data-init-money', data_detail.pretax_price);
                    $('#taxes-value').attr('data-init-money', data_detail.taxes_price);
                    $('#total-value').attr('data-init-money', data_detail.total_price);

                    for (let i = 0; i < data_detail?.['products_mapped'].length; i++) {
                        let item = data_detail?.['products_mapped'][i];
                        PQRProductsSelectedTable.find('tbody').append(`<tr>
                                <td class="number text-center wrap-text w-5">${item.index}</td>
                                <td class="wrap-text w-15"><select class="form-select select2 product-select-box" data-method="GET"></select></td>
                                <td class="wrap-text w-10"><span class="product-description">${item.product.description}</span></td>
                                <td class="wrap-text w-10"><select class="form-select product-uom-select-box" data-method="GET"></select></td>
                                <td class="wrap-text w-10"><input type="number" min="1" class="form-control product-quantity" value="${item.quantity}"></td>
                                <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" value="${item.unit_price}"></td>
                                <td class="wrap-text w-15"><select class="form-select product-tax-select-box" data-method="GET"></select></td>
                                <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${item.subtotal_price}"></span></td>
                                <td class="wrap-text w-5"><button class="disabled btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
                            </tr>`);
                        count_row(PQRProductsSelectedTable.find('tbody'));
                        loadProductList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-select-box'), {'id': item.product.id, 'title': item.product.title})
                        loadProductUomList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-uom-select-box'), {'id': item.product.uom.id, 'title': item.product.uom.title}, item.product.uom_group.id)
                        let tax_data = null;
                        if (Object.keys(item.product.tax).length !== 0) {
                            tax_data = {'id': item.product.tax.id, 'title': item.product.tax.title, 'rate': item.product.tax.rate}
                        }
                        loadProductTaxList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-tax-select-box'), tax_data)
                    }
                }
                else {
                    $('#new-product-btn').prop('hidden', true)
                    $('#title').val(data_detail.title);
                    deliveryDateInput.val(data_detail.delivered_date.split(' ')[0]);
                    $('#note').val(data_detail.note);
                    $('#pretax-value').attr('data-init-money', data_detail.pretax_price);
                    $('#taxes-value').attr('data-init-money', data_detail.taxes_price);
                    $('#total-value').attr('data-init-money', data_detail.total_price);

                    for (let i = 0; i < data_detail.purchase_requests.length; i++) {
                        PQRSelectBoxEle.append(`<option data-bs-toggle="tooltip" data-bs-placement="bottom" title="${data_detail.purchase_requests[i].title}" value="${data_detail.purchase_requests[i].id}" selected>${data_detail.purchase_requests[i].code}</option>`)
                    }

                    for (let i = 0; i < data_detail?.['products_mapped'].length; i++) {
                        let item = data_detail?.['products_mapped'][i];
                        PQRProductsSelectedTable.find('tbody').append(`<tr>
                                <td class="number text-center wrap-text w-5">${item.index}</td>
                                <td class="wrap-text w-15"><select disabled class="form-select select2 product-select-box" data-method="GET"></select></td>
                                <td class="wrap-text w-10"><span class="product-description">${item.product.description}</span></td>
                                <td class="wrap-text w-10"><select class="form-select product-uom-select-box" data-method="GET"></select></td>
                                <td class="wrap-text w-10"><input type="number" min="1" class="form-control product-quantity" value="${item.quantity}"></td>
                                <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" value="${item.unit_price}"></td>
                                <td class="wrap-text w-15"><select class="form-select product-tax-select-box" data-method="GET"></select></td>
                                <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${item.subtotal_price}"></span></td>
                                <td class="wrap-text w-5"><button class="disabled btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
                            </tr>`);
                        count_row(PQRProductsSelectedTable.find('tbody'));
                        loadProductList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-select-box'), {'id': item.product.id, 'title': item.product.title})
                        loadProductUomList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-uom-select-box'), {'id': item.product.uom.id, 'title': item.product.uom.title}, item.product.uom_group.id)
                        let tax_data = null;
                        if (Object.keys(item.product.tax).length !== 0) {
                            tax_data = {'id': item.product.tax.id, 'title': item.product.tax.title, 'rate': item.product.tax.rate}
                        }
                        loadProductTaxList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-tax-select-box'), tax_data)
                    }
                }

                $.fn.initMaskMoney2();

                Disable(for_update);
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
    let pretax_value = 0;
    let taxes_value = 0;
    let total_value = 0;

    let product_element = $('.form-check-purchase-request-products:checked');
    if ($('#merge').is(':checked')) {
        product_element = $('.form-check-purchase-request-products-for-merge:checked');
    }

    product_element.each(function () {
        let pr_unit_price = parseFloat($(this).attr('data-pr-unit-price'));
        let quantity = parseFloat($(this).attr('data-quantity'));
        let tax_value = parseFloat($(this).attr('data-tax-value'));
        let current_pretax_value = pr_unit_price * quantity;

        pretax_value += current_pretax_value;
        taxes_value += current_pretax_value * tax_value / 100;
        total_value += current_pretax_value + current_pretax_value * tax_value / 100;
        purchase_request_products_selected_data.push({
            'product_id': $(this).attr('id'),
            'product_title': $(this).attr('data-title'),
            'product_des': $(this).attr('data-des'),
            'uom_id': $(this).attr('data-uom-id'),
            'uom_title': $(this).attr('data-uom-title'),
            'uom_group_id': $(this).attr('data-uom-group-id'),
            'quantity': $(this).attr('data-quantity'),
            'pr_unit_price': $(this).attr('data-pr-unit-price'),
            'tax_id': $(this).attr('data-tax-id'),
            'tax_value': $(this).attr('data-tax-value'),
            'tax_title': $(this).attr('data-tax-title'),
            'pr_subtotal_price': current_pretax_value,
        })
    })

    $('#pretax-value').attr('data-init-money', pretax_value);
    $('#taxes-value').attr('data-init-money', taxes_value);
    $('#total-value').attr('data-init-money', total_value);

    PQRProductsSelectedTable.find('tbody').html('');
    for (let i = 0; i < purchase_request_products_selected_data.length; i++) {
        let item = purchase_request_products_selected_data[i];
        PQRProductsSelectedTable.find('tbody').append(`<tr>
                <td class="number text-center wrap-text w-5"></td>
                <td class="wrap-text w-15"><select disabled class="form-select select2 product-select-box" data-method="GET"></select></td>
                <td class="wrap-text w-10"><span class="product-description">${item.product_des}</span></td>
                <td class="wrap-text w-10"><select class="form-select product-uom-select-box" data-method="GET"></select></td>
                <td class="wrap-text w-10"><input type="number" min="1" class="form-control product-quantity" value="${item.quantity}"></td>
                <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" value="${item.pr_unit_price}"></td>
                <td class="wrap-text w-15"><select class="form-select product-tax-select-box" data-method="GET"></select></td>
                <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${item.pr_subtotal_price}"></span></td>
                <td class="wrap-text w-5"><button class="disabled btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
            </tr>`);
        count_row(PQRProductsSelectedTable.find('tbody'));
        loadProductList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-select-box'), {'id': item.product_id, 'title': item.product_title})
        loadProductUomList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-uom-select-box'), {'id': item.uom_id, 'title': item.uom_title}, item.uom_group_id)
        loadProductTaxList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-tax-select-box'), {'id': item.tax_id, 'title': item.tax_title, 'rate': item.tax_value})
    }
})

$(document).on("click", '#new-product-btn', function () {
    PQRProductsSelectedTable.find('tbody').append(`<tr>
            <td class="number text-center wrap-text w-5"></td>
            <td class="wrap-text w-15"><select class="form-select select2 product-select-box" data-method="GET"></select></td>
            <td class="wrap-text w-10"><span class="product-description"></span></td>
            <td class="wrap-text w-10"><select class="form-select product-uom-select-box" data-method="GET"></select></td>
            <td class="wrap-text w-10"><input type="number" min="1" class="form-control product-quantity"></td>
            <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" value=""></td>
            <td class="wrap-text w-15"><select class="form-select product-tax-select-box" data-method="GET"></select></td>
            <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money=""></span></td>
            <td class="wrap-text w-5"><button class="btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
        </tr>`);
    count_row(PQRProductsSelectedTable.find('tbody'));
    loadProductList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-select-box'), null)
    loadProductUomList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-uom-select-box'), null, null)
    loadProductTaxList(PQRProductsSelectedTable.find('tbody tr:last').find('.product-tax-select-box'), null)
});

$(document).on("click", '.btn-del-line-detail', function () {
    $(this).closest('tr').remove();
    count_row(PQRProductsSelectedTable.find('tbody'));
    calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
})

$(document).on("click", '#btn-show-modal', function () {
    LoadPurchaseRequestTable()
    LoadPurchaseRequestProductsTable()
    LoadPurchaseRequestProductsTableForMerge()
})

$(document).on("change", '.pr-unit-price-input', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
})

$(document).on("change", '.product-tax-select-box', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
})

$(document).on("change", '.product-quantity', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    if (parseInt(quantity) < 0) {
        $(this).closest('tr').find('.product-quantity').val(parseInt(quantity) * (-1));
        quantity = $(this).closest('tr').find('.product-quantity').val();
    }
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    checkMergeRow($(this).closest('tr'))
    calculate_price($('#table-purchase-quotation-request-products-selected tbody tr'));
})

class PQRHandle {
    combinesDataFromPR(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));
        let flag = true;

        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['purchase_request_list'] = PQRSelectBoxEle.val();
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
                        'uom_id': product_uom_id,
                        'quantity': product_quantity,
                        'unit_price': product_unit_price,
                        'tax_id': $(this).find('.product-tax-select-box').val(),
                        'subtotal_price': product_subtotal_price,
                    }
                )
            }
            else {
                $.fn.notifyB({description: 'Missing fields in Line Detail'}, 'failure');
                flag = false;
            }
        })

        frm.dataForm['pretax_price'] = $('#pretax-value').attr('data-init-money');
        frm.dataForm['taxes_price'] = $('#taxes-value').attr('data-init-money');
        frm.dataForm['total_price'] = $('#total-value').attr('data-init-money');
        frm.dataForm['purchase_quotation_request_type'] = 0;

        if (flag) {
            if (for_update) {
                let pk = $.fn.getPkDetail()
                return {
                    url: frm.dataUrl.format_url_with_uuid(pk),
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect.format_url_with_uuid(pk),
                };
            } else {
                return {
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect,
                };
            }
        }
        else {
            return false;
        }
    }
    combinesDataManual(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));
        let flag = true;

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
                        'uom_id': product_uom_id,
                        'quantity': product_quantity,
                        'unit_price': product_unit_price,
                        'tax_id': $(this).find('.product-tax-select-box').val(),
                        'subtotal_price': product_subtotal_price,
                    }
                )
            }
            else {
                $.fn.notifyB({description: 'Missing fields in Line Detail'}, 'failure');
                flag = false;
            }
        })

        frm.dataForm['pretax_price'] = $('#pretax-value').attr('data-init-money');
        frm.dataForm['taxes_price'] = $('#taxes-value').attr('data-init-money');
        frm.dataForm['total_price'] = $('#total-value').attr('data-init-money');
        frm.dataForm['purchase_quotation_request_type'] = 1;

        if (flag) {
            if (for_update) {
                let pk = $.fn.getPkDetail()
                return {
                    url: frm.dataUrl.format_url_with_uuid(pk),
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect.format_url_with_uuid(pk),
                };
            } else {
                return {
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect,
                };
            }
        }
        else {
            return false;
        }
    }
    combinesDataUpdate(frmEle) {
        if (data_URL_script.attr('data-pqr-type') === '1') {
            return this.combinesDataManual(frmEle, true);
        }
        else {
            return this.combinesDataFromPR(frmEle, true);
        }
    }
}
