let check_tab_inventory =  $('#check-tab-inventory');
let check_tab_sale =  $('#check-tab-sale');
let check_tab_purchase =  $('#check-tab-purchase');
let generalUomGroupEle = $('#general-select-box-uom-group');
let generalProductTypeEle = $('#general-select-box-product-type');
let generalProductCateEle = $('#general-select-box-product-category');
let saleDefaultUomEle = $('#sale-select-box-default-uom');
let purchaseDefaultUomEle = $('#purchase-select-box-default-uom');
let inventoryDefaultUomEle = $('#inventory-select-box-uom-name');
let inventoryDefaultUomCodeEle = $('#inventory-uom-code');
let saleProductTaxEle = $('#sale-select-box-tax-code');
let purchaseProductTaxEle = $('#purchase-select-box-tax-code');
let lengthEle = $('#length');
let widthEle = $('#width');
let heightEle = $('#height');
let volumeEle = $('#volume');
let weightEle = $('#weight');
let productImageEle = $('#product-image');
let warehouseProductListEle = $('#warehouse_product_list');
let unitOfMeasureListEle = $('#unit_of_measure');
const currency_list = JSON.parse($('#currency_list').text());
let currency_primary = null;
for (let i = 0; i < currency_list.length; i++) {
    if (currency_list[i]?.['is_primary']) {
        currency_primary = currency_list[i].id
    }
}
const item_unit_dict = JSON.parse($('#id-unit-list').text()).reduce((obj, item) => {
    obj[item.title] = item;
    return obj;
}, {});
let warehouse_product_list = [];
if (warehouseProductListEle.text() !== '') {
    warehouse_product_list = JSON.parse(warehouseProductListEle.text());
}
let unit_of_measure_list = [];
if (unitOfMeasureListEle.text() !== '') {
    unit_of_measure_list = JSON.parse(unitOfMeasureListEle.text());
}

productImageEle.dropify({
    messages: {
        'default': 'Upload an image',
        'replace': 'Drag and drop or click to replace',
        'remove':  'Remove',
        'error':   'Oops, something wrong happened.'
    },
    tpl: {
        message:' {{ default }}',
    }
});

check_tab_inventory.change(function () {
    disabledTab(this.checked, '#link-tab-inventory', '#tab_inventory');
    $('#tab_inventory input, #tab_inventory select').val('');
});

check_tab_sale.change(function () {
    disabledTab(this.checked, '#link-tab-sale', '#tab_sale');
    $('#tab_sale input, #tab_sale select').val('');
});

check_tab_purchase.change(function () {
    disabledTab(this.checked, '#link-tab-purchase', '#tab_purchase');
    $('#tab_purchase input, #tab_purchase select').val('');
});

$(document).on("change", '#length', function () {
    let length = lengthEle.val();
    let width = widthEle.val();
    let height = heightEle.val();
    let volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
    volumeEle.val(volume.toFixed(2));
})

$(document).on("change", '#width', function () {
    let length = lengthEle.val();
    let width = widthEle.val();
    let height = heightEle.val();
    let volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
    volumeEle.val(volume.toFixed(2));
})

$(document).on("change", '#height', function () {
    let length = lengthEle.val();
    let width = widthEle.val();
    let height = heightEle.val();
    let volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
    volumeEle.val(volume.toFixed(2));
})

$(document).on('change', '.select_price_list', function () {
    if ($(this).is(':checked') === true) {
        $(this).closest('.select_price_list_row').find('.input_price_list').attr('disabled', false);
    }
    else {
        $(this).closest('.select_price_list_row').find('.input_price_list').attr('disabled', true);
        $(this).closest('.select_price_list_row').find('.input_price_list').attr('value', '');
        $(this).closest('.select_price_list_row').find('.input_price_list').val('');
    }
})

$(document).on('change', '.input_price_list', function () {
    let this_data_id = $(this).attr('data-id');
    let this_data_value = $(this).attr('value');
    $('.ul-price-list').find('.input_price_list').each(function () {
        if ($(this).attr('data-source') === this_data_id && $(this).attr('data-auto-update') === 'true' && $(this).attr('data-is-default') === 'false') {
            let value = parseFloat(this_data_value) * parseFloat($(this).attr('data-factor'));
            $(this).attr('value', value);
            loadPriceForChild($(this).attr('data-id'), value);
        }
    })
    $.fn.initMaskMoney2();
})

function disabledTab(check, link_tab, id_tab) {
    let tab = $(`a[href="` + id_tab + `"]`);
    if (!check) {
        $(link_tab).addClass('disabled');
        $(id_tab).removeClass('active show');
        if (tab.hasClass('active')) {
            $('a[href="#tab_general"]').addClass('active');
            $('#tab_general').addClass('active show');
        }
        tab.removeClass('active');
    } else {
        $(link_tab).removeClass('disabled');
    }
}

function loadGeneralProductType(product_type_list) {
    generalProductTypeEle.initSelect2({
        ajax: {
            url: generalProductTypeEle.attr('data-url'),
            method: 'GET',
        },
        data: (product_type_list ? product_type_list : null),
        keyResp: 'product_type_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadGeneralProductCategory(product_category_list) {
    generalProductCateEle.initSelect2({
        ajax: {
            url: generalProductCateEle.attr('data-url'),
            method: 'GET',
        },
        data: (product_category_list ? product_category_list : null),
        keyResp: 'product_category_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadGeneralUoMGroup(unit_of_measure_group) {
    generalUomGroupEle.initSelect2({
        ajax: {
            url: generalUomGroupEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp].filter(function (item) {
                return Object.keys(item?.['referenced_unit']).length !== 0;
            });
        },
        data: (unit_of_measure_group ? unit_of_measure_group : null),
        keyResp: 'unit_of_measure_group',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        loadSaleDefaultUom(null, $(this).attr('data-url-detail').replace(0, $(this).val()));
        loadInventoryDefaultUom(null, $(this).attr('data-url-detail').replace(0, $(this).val()));
        loadPurchaseDefaultUom(null, $(this).attr('data-url-detail').replace(0, $(this).val()));
    })
}

function loadSaleTaxCode(tax_list) {
    saleProductTaxEle.initSelect2({
        ajax: {
            url: saleProductTaxEle.attr('data-url'),
            method: 'GET',
        },
        data: (tax_list ? tax_list : null),
        keyResp: 'tax_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadSaleDefaultUom(uom_list, url) {
    if (uom_list === null) {
        saleDefaultUomEle.initSelect2({
            ajax: {
                url: url,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp]?.['uom'];
            },
            data: null,
            keyResp: 'uom_group',
            keyId: 'uom_id',
            keyText: 'uom_title',
        })
    }
    else {
        saleDefaultUomEle.initSelect2({
            ajax: {
                url: url,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp]?.['uom'];
            },
            data: uom_list,
            keyResp: 'uom_group',
            keyId: 'uom_id',
            keyText: 'uom_title',
        })
    }
}

async function loadPriceList() {
    let ele = $('#sale-select-price-list');
    await $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {
                let html = ``
                for (let i = 0; i < data.price_list.length; i++) {
                    let item = data.price_list[i];
                    let checked = '';
                    let disabled = '';
                    let is_default = 'disabled';
                    if (item.is_default) {
                        is_default = ''
                    }
                    if (item.is_default || (item?.['price_list_mapped'] !== null && item.auto_update === true)) {
                        checked = 'checked';
                        disabled = 'disabled';
                    }
                    html += `<div class="row select_price_list_row">
                        <div class="col-6">
                            <div class="form-check mt-2">
                                <input class="form-check-input select_price_list" type="checkbox" data-id="${item.id}" ${checked} ${disabled}>
                                <label>` + item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <input data-is-default="${item.is_default}" ${is_default} data-source="${item?.['price_list_mapped']}" data-auto-update="${item.auto_update}" data-factor="${item.factor}" data-id="${item.id}" data-return-type="number" type="text" class="form-control mask-money input_price_list">
                        </div>
                    </div>`;
                }
                ele.find('.ul-price-list').html(html);
            }
        }
    }, (errs) => {
        console.log(errs)
    },)
}

function loadInventoryDefaultUom(uom_list, url) {
    if (uom_list === null) {
        inventoryDefaultUomEle.initSelect2({
            ajax: {
                url: url,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp]?.['uom'];
            },
            data: (uom_list ? uom_list : null),
            keyResp: 'uom_group',
            keyId: 'uom_id',
            keyText: 'uom_title',
        }).on('change', function () {
            let uom_selected = inventoryDefaultUomEle.val();
            if (uom_selected !== '') {
                let obj_uom_selected = JSON.parse($('#' + inventoryDefaultUomEle.attr('data-idx-data-loaded')).text())[uom_selected];
                inventoryDefaultUomCodeEle.val(obj_uom_selected?.['uom_code']);
            }
        })
    }
    else {
        inventoryDefaultUomEle.initSelect2({
            ajax: {
                url: url,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp]?.['uom'];
            },
            data: uom_list,
            keyResp: 'uom_group',
            keyId: 'uom_id',
            keyText: 'uom_title',
        }).on('change', function () {
            let uom_selected = inventoryDefaultUomEle.val();
            if (uom_selected !== '') {
                let obj_uom_selected = JSON.parse($('#' + inventoryDefaultUomEle.attr('data-idx-data-loaded')).text())[uom_selected];
                inventoryDefaultUomCodeEle.val(obj_uom_selected?.['uom_code']);
            }
        })
    }
}

function loadPurchaseDefaultUom(uom_list, url) {
    if (uom_list === null) {
        purchaseDefaultUomEle.initSelect2({
            ajax: {
                url: url,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp]?.['uom'];
            },
            data: (uom_list ? uom_list : null),
            keyResp: 'uom_group',
            keyId: 'uom_id',
            keyText: 'uom_title',
        })
    }
    else {
        purchaseDefaultUomEle.initSelect2({
            ajax: {
                url: url,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp]?.['uom'];
            },
            data: uom_list,
            keyResp: 'uom_group',
            keyId: 'uom_id',
            keyText: 'uom_title',
        })
    }
}

function loadPurchaseTaxCode(tax_list) {
    purchaseProductTaxEle.initSelect2({
        ajax: {
            url: purchaseProductTaxEle.attr('data-url'),
            method: 'GET',
        },
        data: (tax_list ? tax_list : null),
        keyResp: 'tax_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadBaseItemUnit() {
    let eleVolume = $('#divVolume');
    let eleWeight = $('#divWeight');
    eleVolume.find('.input-suffix').text(item_unit_dict['volume'].measure)
    eleVolume.find('input').attr('data-id', item_unit_dict['volume'].id)
    eleWeight.find('.input-suffix').text(item_unit_dict['weight'].measure)
    eleWeight.find('input').attr('data-id', item_unit_dict['weight'].id)
}

function loadPriceForChild(element_id, element_value) {
    $('.ul-price-list').find('.input_price_list').each(function () {
        if ($(this).attr('data-source') === element_id && $(this).attr('data-auto-update') === 'true' && $(this).attr('data-is-default') === 'false') {
            let value = parseFloat(element_value) * parseFloat($(this).attr('data-factor'));
            $(this).attr('value', value);
            loadPriceForChild($(this).attr('data-id'), value);
        }
    })
    $.fn.initMaskMoney2();
}

function loadWareHouseList() {
    if (!$.fn.DataTable.isDataTable('#datatable-warehouse-list')) {
        let dtb = $('#datatable-warehouse-list');
        let frm = new SetupFormSubmit(dtb);
        dtb.DataTableDefault({
            dom: '',
            paging: false,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['warehouse_list'] ? resp.data['warehouse_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    data: 'code',
                    className: 'wrap-text w-25',
                    render: (data, type, row) => {
                        return `<span class="text-secondary">` + row.code + `</span>`
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text text-center w-50',
                    render: (data, type, row) => {
                        return `<span class="text-secondary"><b>` + row.title + `</b></span>`
                    }
                },
                {
                    data: 'stock_value',
                    className: 'wrap-text text-center w-25',
                    render: () => {
                        return `<span>0</span>`
                    }
                },
            ],
        });
    }
}

function loadWareHouseOverView() {
    if (!$.fn.DataTable.isDataTable('#datatable-warehouse-overview')) {
        let dtb = $('#datatable-warehouse-overview');
        dtb.DataTableDefault({
            dom: '',
            paging: false,
            data: [''],
            columns: [
                {
                    data: '',
                    className: 'wrap-text text-center w-25',
                    render: () => {
                        return `<span style="font-weight: bolder" class="text-danger">0</span>`
                    }
                },
                {
                    data: '',
                    className: 'wrap-text text-center w-25',
                    render: () => {
                        return `<span style="font-weight: bolder" class="text-danger">0</span>`
                    }
                },
                {
                    data: '',
                    className: 'wrap-text text-center w-25',
                    render: () => {
                        return `<span style="font-weight: bolder" class="text-danger">0</span>`
                    }
                },
                {
                    data: '',
                    className: 'wrap-text text-center w-25',
                    render: () => {
                        return `<span style="font-weight: bolder" class="text-danger">0</span>`
                    }
                },
            ],
        });
    }
}

function ConvertToUnitUoM(uom_id_src, uom_id_des) {
    let get_uom_src_item = unit_of_measure_list.filter(function (item) {
        return item.id === uom_id_src;
    })
    let get_uom_des_item = unit_of_measure_list.filter(function (item) {
        return item.id === uom_id_des;
    })
    let ratio_src = get_uom_src_item[0].ratio;
    let ratio_des = get_uom_des_item[0].ratio;
    return ratio_src / ratio_des
}

function GetProductFromWareHouseStockList(product_id, uom_id_des) {
    let product_get_from_wh_product_list = warehouse_product_list.filter(function (item) {
        return item.product === product_id;
    })
    let warehouse_stock_list = [];
    for (let i = 0; i < product_get_from_wh_product_list.length; i++) {
        let calculated_ratio = ConvertToUnitUoM(product_get_from_wh_product_list[i].uom, uom_id_des);
        let raw_stock_quantity = calculated_ratio * product_get_from_wh_product_list[i]?.['stock_amount'];
        let delivered_quantity = calculated_ratio * product_get_from_wh_product_list[i]?.['sold_amount'];
        let ready_quantity = calculated_ratio * product_get_from_wh_product_list[i]?.['picked_ready'];

        warehouse_stock_list.push(
            {
                'warehouse_id': product_get_from_wh_product_list[i].warehouse,
                'stock': raw_stock_quantity - delivered_quantity,
                'wait_for_delivery': ready_quantity,
                'wait_for_receipt': 0,
            }
        );
    }
    return warehouse_stock_list;
}

function loadWareHouseListDetail(warehouse_stock_list) {
    let dtb = $('#datatable-warehouse-list');
    dtb.DataTable().destroy();
    let frm = new SetupFormSubmit(dtb);
    dtb.DataTableDefault({
        dom: '',
        paging: false,
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data?.['warehouse_list'].length > 0) {
                        for (let i = 0; i < data?.['warehouse_list'].length; i++) {
                            let value_list = warehouse_stock_list.filter(function (item) {
                                return item.warehouse_id === data?.['warehouse_list'][i].id;
                            });
                            let stock_value = 0;
                            let wait_for_delivery_value = 0;
                            let wait_for_receipt_value = 0;
                            for (let i = 0; i < value_list.length; i++) {
                                stock_value = stock_value + value_list[i].stock;
                                wait_for_delivery_value = wait_for_delivery_value + value_list[i].wait_for_delivery;
                                wait_for_receipt_value = wait_for_receipt_value + value_list[i].wait_for_receipt;
                            }
                            let available_value = stock_value - wait_for_delivery_value + wait_for_receipt_value;
                            resp.data['warehouse_list'][i].stock_value = stock_value;
                            resp.data['warehouse_list'][i].wait_for_delivery_value = wait_for_delivery_value;
                            resp.data['warehouse_list'][i].wait_for_receipt_value = wait_for_receipt_value;
                            resp.data['warehouse_list'][i].available_value = available_value;
                        }
                        return resp.data['warehouse_list'];
                    } else {
                        return [];
                    }
                }
                return [];
            },
        },
        columns: [
            {
                data: 'code',
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="text-secondary">` + row.code + `</span>`
                }
            },
            {
                data: 'title',
                className: 'wrap-text text-center w-25',
                render: (data, type, row) => {
                    return `<span class="text-secondary"><b>` + row.title + `</b></span>`
                }
            },
            {
                data: 'stock_value',
                className: 'wrap-text text-center w-15',
                render: (data, type, row) => {
                    return `<span>` + row.stock_value + `</span>`
                }
            },
        ],
        footerCallback: function () {
            let api = this.api();

            let sum2 = api
                .column(2, {page: 'current'})
                .data()
                .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                }, 0);

            $(api.column(2).footer()).html(`<span style="font-weight: bolder">` + sum2 + `</span>`);
        }
    });
}

function loadWareHouseOverViewDetail(warehouse_stock_list) {
    let dtb = $('#datatable-warehouse-overview');
    dtb.DataTable().destroy();
    let frm = new SetupFormSubmit(dtb);
    dtb.DataTableDefault({
        dom: '',
        paging: false,
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data?.['warehouse_list'].length > 0) {
                        let sum_stock = 0;
                        let sum_wait_for_delivery_value = 0;
                        let sum_wait_for_receipt_value = 0;
                        let sum_available_value = 0;

                        for (let i = 0; i < data?.['warehouse_list'].length; i++) {
                            let value_list = warehouse_stock_list.filter(function (item) {
                                return item.warehouse_id === data?.['warehouse_list'][i].id;
                            });
                            let stock_value = 0;
                            let wait_for_delivery_value = 0;
                            let wait_for_receipt_value = 0;
                            for (let i = 0; i < value_list.length; i++) {
                                stock_value = stock_value + value_list[i].stock;
                                wait_for_delivery_value = wait_for_delivery_value + value_list[i].wait_for_delivery;
                                wait_for_receipt_value = wait_for_receipt_value + value_list[i].wait_for_receipt;
                            }
                            let available_value = stock_value - wait_for_delivery_value + wait_for_receipt_value;

                            sum_stock = sum_stock + stock_value;
                            sum_wait_for_delivery_value = sum_wait_for_delivery_value + wait_for_delivery_value;
                            sum_wait_for_receipt_value = sum_wait_for_receipt_value + wait_for_receipt_value;
                            sum_available_value = sum_available_value + available_value;
                        }
                        return [{
                            'sum_stock': sum_stock,
                            'sum_wait_for_delivery_value': sum_wait_for_delivery_value,
                            'sum_wait_for_receipt_value': sum_wait_for_receipt_value,
                            'sum_available_value': sum_available_value
                        }];
                    } else {
                        return [];
                    }
                }
                return [];
            },
        },
        columns: [
            {
                data: 'sum_stock',
                className: 'wrap-text text-center w-25',
                render: (data, type, row) => {
                    if (row.sum_stock > 0) {
                        return `<span style="font-weight: bolder" class="text-primary">${row.sum_stock}</span>`
                    }
                    else {
                        return `<span style="font-weight: bolder" class="text-danger">${row.sum_stock}</span>`
                    }
                }
            },
            {
                data: 'sum_wait_for_delivery_value',
                className: 'wrap-text text-center w-25',
                render: (data, type, row) => {
                    if (row.sum_wait_for_delivery_value > 0) {
                        return `<span style="font-weight: bolder" class="text-primary">${row.sum_wait_for_delivery_value}</span>`
                    }
                    else {
                        return `<span style="font-weight: bolder" class="text-danger">${row.sum_wait_for_delivery_value}</span>`
                    }
                }
            },
            {
                data: 'sum_wait_for_receipt_value',
                className: 'wrap-text text-center w-25',
                render: (data, type, row) => {
                    if (row.sum_wait_for_receipt_value > 0) {
                        return `<span style="font-weight: bolder" class="text-primary">${row.sum_wait_for_receipt_value}</span>`
                    }
                    else {
                        return `<span style="font-weight: bolder" class="text-danger">${row.sum_wait_for_receipt_value}</span>`
                    }
                }
            },
            {
                data: 'sum_available_value',
                className: 'wrap-text text-center w-25',
                render: (data, type, row) => {
                    if (row.sum_available_value > 0) {
                        return `<span style="font-weight: bolder" class="text-primary">${row.sum_available_value}</span>`
                    }
                    else {
                        return `<span style="font-weight: bolder" class="text-danger">${row.sum_available_value}</span>`
                    }
                }
            },
        ],
    });
}

function Disable(option) {
    if (option === 'detail') {
        $('.form-control').prop('disabled', true).css({color: 'black'});
        $('.form-select').prop('disabled', true).css({color: 'black'});
        $('.select2').prop('disabled', true);
        $('input').prop('disabled', true);
    }
}

function getDataForm() {
    let data = {
        'title': $('#title').val(),
        'description': $('#description').val()
    };
    data['product_choice'] = []

    data['length'] = parseFloat(lengthEle.val());
    data['width'] = parseFloat(widthEle.val());
    data['height'] = parseFloat(heightEle.val());
    data['volume'] = parseFloat(volumeEle.val());
    data['weight'] = parseFloat(weightEle.val());
    data['volume_id'] = volumeEle.attr('data-id');
    data['weight_id'] = weightEle.attr('data-id');
    data['general_product_type'] = $('#general-select-box-product-type option:selected').attr('value');
    data['general_product_category'] = $('#general-select-box-product-category option:selected').attr('value');
    data['general_uom_group'] = $('#general-select-box-uom-group option:selected').attr('value');
    data['general_traceability_method'] = $('#general-select-box-traceability-method option:selected').attr('value');

    if (check_tab_sale.is(':checked') === true) {
        data['product_choice'].push(0)
        let sale_product_price_list = [];
        $('.ul-price-list').find('.select_price_list').each(function () {
            let selected = $(this).is(':checked');
            if (selected) {
                let price_list_id = $(this).closest('.select_price_list_row').find('.input_price_list').attr('data-id');
                let price_list_value = $(this).closest('.select_price_list_row').find('.input_price_list').attr('value');
                let is_auto_update = $(this).closest('.select_price_list_row').find('.input_price_list').attr('data-auto-update');
                if (price_list_id && price_list_value) {
                    sale_product_price_list.push({
                        'price_list_id': price_list_id,
                        'price_list_value': price_list_value,
                        'is_auto_update': is_auto_update
                    });
                }
            }
        })
        data['sale_default_uom'] = $('#sale-select-box-default-uom option:selected').attr('value');
        data['sale_tax'] = $('#sale-select-box-tax-code option:selected').attr('value');
        data['sale_cost'] = parseFloat($('#sale-cost').attr('value'));
        data['sale_price_list'] = sale_product_price_list;
        data['sale_currency_using'] = currency_primary;
    }
    else {
        data['sale_default_uom'] = null;
        data['sale_tax'] = null;
        data['sale_cost'] = null;
        data['sale_price_list'] = [];
        data['sale_currency_using'] = null;
    }

    if (check_tab_inventory.is(':checked') === true) {
        data['product_choice'].push(1)
        data['inventory_uom'] = $('#inventory-select-box-uom-name option:selected').attr('value');
        data['inventory_level_min'] = parseFloat($('#inventory-level-min').val());
        data['inventory_level_max'] = parseFloat($('#inventory-level-max').val());
    }
    else {
        data['inventory_uom'] = null;
        data['inventory_level_min'] = null;
        data['inventory_level_max'] = null;
    }

    if (check_tab_purchase.is(':checked') === true) {
        data['product_choice'].push(2)
        data['purchase_default_uom'] = $('#purchase-select-box-default-uom option:selected').attr('value');
        data['purchase_tax'] = $('#purchase-select-box-tax-code option:selected').attr('value');
    }
    else {
        data['purchase_default_uom'] = null;
        data['purchase_tax'] = null;
    }

    if (!data['general_product_type'] || !data['general_product_category'] || !data['general_uom_group']) {
        $.fn.notifyB({description: 'Some fields in General tab is missing'}, 'failure');
        return false
    }

    if (data['product_choice'].includes(0)) {
        if (!data['sale_default_uom'] || !data['sale_currency_using'] || !data['sale_tax'] || data['sale_price_list'].length < 1) {
            $.fn.notifyB({description: 'Some fields in Sale tab is missing'}, 'failure');
            return false
        }
    }

    if (data['product_choice'].includes(1)) {
        if (lengthEle.val() === '' || widthEle.val() === '' || heightEle.val() === '' || volumeEle.val() === '' || weightEle.val() === '') {
            $.fn.notifyB({description: 'Tab inventory is selected, product size must not null'}, 'failure');
            return false
        }

        if (!data['inventory_uom']) {
            $.fn.notifyB({description: 'Some fields in Inventory tab is missing'}, 'failure');
            return false
        }
    }

    if (data['product_choice'].includes(2)) {
        if (!data['purchase_default_uom'] || !data['purchase_tax']) {
            $.fn.notifyB({description: 'Some fields in Purchase tab is missing'}, 'failure');
            return false
        }
    }

    if (data['inventory_level_min'] > data['inventory_level_max']) {
        $.fn.notifyB({description: 'Inventory level min can not greater than Inventory level max'}, 'failure');
        return false
    }

    return data
}

class ProductHandle {
    async load() {
        loadGeneralProductType();
        loadGeneralProductCategory();
        loadGeneralUoMGroup();
        loadSaleTaxCode();
        loadPurchaseTaxCode();
        loadSaleDefaultUom();
        loadInventoryDefaultUom();
        loadPurchaseDefaultUom();
        loadBaseItemUnit();
        loadWareHouseList();
        loadWareHouseOverView();
        await loadPriceList();
    }
    combinesData(frmEle, for_update=false) {
        let dataForm = getDataForm();
        if (dataForm) {
            let frm = new SetupFormSubmit($(frmEle));

            let url_return = frm.dataUrl;
            let urlRedirect_return = frm?.['urlRedirect'];
            if (for_update === true) {
                let pk = $.fn.getPkDetail()
                url_return = frm.dataUrl.format_url_with_uuid(pk);
                urlRedirect_return = frm.dataUrlRedirect.format_url_with_uuid(pk);
            }

            return {
                url: url_return,
                method: frm.dataMethod,
                data: dataForm,
                urlRedirect: urlRedirect_return,
            };
        }
        return false;
    }
}

function LoadDetailProduct(option) {
    let pk = $.fn.getPkDetail()
    $.fn.callAjax($('#form-update-product').data('url').format_url_with_uuid(pk), 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['product']?.['workflow_runtime_id']);
                let product_detail = data['product'];
                $.fn.compareStatusShowPageAction(data);

                $('#product-code').text(product_detail['code']);
                $('#title').val(product_detail['title']);
                $('#description').val(product_detail['description']);

                if (product_detail['product_choice'].includes(0)) {
                    $('#check-tab-sale').attr('checked', true);
                    $('#link-tab-sale').removeClass('disabled');
                }

                if (product_detail['product_choice'].includes(1)) {
                    $('#check-tab-inventory').attr('checked', true);
                    $('#link-tab-inventory').removeClass('disabled');
                }

                if (product_detail['product_choice'].includes(2)) {
                    $('#check-tab-purchase').attr('checked', true);
                    $('#link-tab-purchase').removeClass('disabled');
                }

                if (Object.keys(product_detail['general_information']).length !== 0) {
                    let general_information = product_detail['general_information'];
                    loadGeneralProductType(general_information['product_type']);
                    loadGeneralProductCategory(general_information['product_category']);
                    loadGeneralUoMGroup(general_information['uom_group']);
                    $('#general-select-box-traceability-method').val(general_information['traceability_method']);
                    if (Object.keys(general_information['product_size']).length !== 0) {
                        lengthEle.val(general_information['product_size']['length']);
                        widthEle.val(general_information['product_size']['width']);
                        heightEle.val(general_information['product_size']['height']);
                        volumeEle.val(general_information['product_size']['volume']['value']);
                        weightEle.val(general_information['product_size']['weight']['value']);
                    }
                }

                if (Object.keys(product_detail['sale_information']).length !== 0) {
                    let sale_information = product_detail['sale_information'];
                    loadSaleDefaultUom(sale_information['default_uom'], generalUomGroupEle.attr('data-url-detail').replace(0, generalUomGroupEle.val()));
                    loadSaleTaxCode(sale_information['tax']);
                    $('#sale-cost').attr('value', sale_information['sale_product_cost']);
                    for (let i = 0; i < sale_information['sale_product_price_list'].length; i++) {
                        let item = sale_information['sale_product_price_list'][i];
                        $(`.input_price_list[data-id="` + item.id + `"]`).attr('value', item.price);
                    }
                    $.fn.initMaskMoney2();
                }

                if (Object.keys(product_detail['inventory_information']).length !== 0) {
                    let inventory_information = product_detail['inventory_information'];
                    loadInventoryDefaultUom(inventory_information['uom'], generalUomGroupEle.attr('data-url-detail').replace(0, generalUomGroupEle.val()));
                    inventoryDefaultUomCodeEle.val(inventory_information['uom']['uom_code']);
                    $('#inventory-level-min').val(inventory_information['inventory_level_min']);
                    $('#inventory-level-max').val(inventory_information['inventory_level_max']);

                    let warehouse_stock_list = GetProductFromWareHouseStockList(product_detail.id, product_detail?.['inventory_information']['uom']['uom_id']);
                    loadWareHouseListDetail(warehouse_stock_list);
                    loadWareHouseOverViewDetail(warehouse_stock_list);
                }

                if (Object.keys(product_detail['purchase_information']).length !== 0) {
                    let purchase_information = product_detail['purchase_information'];
                    loadPurchaseDefaultUom(purchase_information['default_uom'], generalUomGroupEle.attr('data-url-detail').replace(0, generalUomGroupEle.val()));
                    loadPurchaseTaxCode(purchase_information['tax']);
                }

                $.fn.initMaskMoney2();

                Disable(option);
            }
        })
}