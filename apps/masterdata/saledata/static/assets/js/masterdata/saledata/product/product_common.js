let check_tab_inventory = $('#check-tab-inventory');
let check_tab_sale = $('#check-tab-sale');
let check_tab_purchase = $('#check-tab-purchase');
let generalUomGroupEle = $('#general-select-box-uom-group');
let generalProductTypeEle = $('#general-select-box-product-type');
let generalProductCateEle = $('#general-select-box-product-category');
let saleDefaultUomEle = $('#sale-select-box-default-uom');
let public_website_Ele = $('#is_publish_website')
let price_list_for_online_sale_Ele = $('#price_list_for_sale_online')
let purchaseDefaultUomEle = $('#purchase-select-box-default-uom');
let inventoryDefaultUomEle = $('#inventory-select-box-uom-name');
let saleProductTaxEle = $('#sale-select-box-tax-code');
let purchaseProductTaxEle = $('#purchase-select-box-tax-code');
let table_warehouse_list = $('#datatable-warehouse-list');
let lengthEle = $('#length');
let widthEle = $('#width');
let heightEle = $('#height');
let volumeEle = $('#volume');
let weightEle = $('#weight');
let productImageEle = $('#product-image');
let available_notify_checkboxEle = $('#available_notify_checkbox')
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

// for variant
let Detail_data = null;
let table_Variant_Attributes = $('#table-variant-attributes');
let btn_Add_Line_Variant_Attributes = $('#btn-add-row-variant-attributes');
let modal_Variant_Attributes = $('#modal-variant-attributes');
let attribute_display_select_by = $('#attribute-display-select-by');
let table_Variant_Items = $('#table-variant-items');
let add_attribute_display_item = $('#add-attribute-display-item');
let add_variant_des = $('#add-variant-des');
let current_row_variant_attribute = null;
let current_row_variant_item = null;

productImageEle.dropify({
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

check_tab_inventory.change(function () {
    disabledTab(this.checked, '#link-tab-inventory', '#tab_inventory');
    $('#tab_inventory input, #tab_inventory select').val('');
    if (check_tab_inventory.is(':checked')) {
        $('#label-dimension').addClass('required');
    } else {
        $('#label-dimension').removeClass('required');
    }
});

check_tab_sale.change(function () {
    disabledTab(this.checked, '#link-tab-sale', '#tab_sale');
    $('#tab_sale input, #tab_sale select').val('');
});

check_tab_purchase.change(function () {
    disabledTab(this.checked, '#link-tab-purchase', '#tab_purchase');
    $('#tab_purchase input, #tab_purchase select').val('');
});

available_notify_checkboxEle.on('change', function () {
    $('#less_than_number').val('').prop('disabled', !$(this).prop('checked'))
})

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
        $(this).closest('tr').find('.input_price_list').attr('disabled', false);
    } else {
        $(this).closest('tr').find('.input_price_list').attr('disabled', true);
        $(this).closest('tr').find('.input_price_list').attr('value', '');
        $(this).closest('tr').find('.input_price_list').val('');
    }
})

$(document).on('change', '.input_price_list', function () {
    let this_data_id = $(this).attr('data-id');
    let this_data_value = $(this).attr('value');
    let sale_product_price_list = []
    $('.ul-price-list').find('.input_price_list').each(function () {
        if ($(this).attr('data-source') === this_data_id && $(this).attr('data-auto-update') === 'true' && $(this).attr('data-is-default') === 'false') {
            let value = parseFloat(this_data_value) * parseFloat($(this).attr('data-factor'));
            $(this).attr('value', value);
            loadPriceForChild($(this).attr('data-id'), value);
        }

        let price_list_id = $(this).attr('data-id');
        let price_list_value = $(this).attr('value');
        if (price_list_id && price_list_value) {
            sale_product_price_list.push(price_list_id);
        }
    })
    $.fn.initMaskMoney2();

    loadSalePriceListForSaleOnline(null, sale_product_price_list)
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
        loadSaleDefaultUom();
        loadInventoryDefaultUom();
        loadPurchaseDefaultUom();
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

public_website_Ele.on('change', function () {
    if (!$(this).prop('checked')) {
        price_list_for_online_sale_Ele.val('').trigger('change')
        price_list_for_online_sale_Ele.prop('disabled', true)
    } else {
        price_list_for_online_sale_Ele.prop('disabled', false)
    }
})

function loadSalePriceListForSaleOnline(data, filter = []) {
    price_list_for_online_sale_Ele.initSelect2({
        allowClear: true,
        ajax: {
            url: price_list_for_online_sale_Ele.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (filter.includes(resp.data[keyResp][i].id)) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'price_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function findObjectById(data, targetId) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === targetId) {
            return data[i]?.['price'];
        }
    }
    return '';
}

function loadPriceList(price_list_from_detail, option) {
    let disabled_all_input = ''
    if (option === 'detail') {
        disabled_all_input = 'disabled readonly'
    }
    let tbl = $('#table_price_list');
    tbl.DataTableDefault({
        paging: false,
        useDataServer: true,
        reloadCurrency: true,
        rowIdx: true,
        ajax: {
            url: tbl.attr('data-url'),
            type: tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let price_list_data = []
                    let resp_price_list = resp.data['price_list'] ? resp.data['price_list'] : []
                    let general_price_list_id = null;
                    for (let i = 0; i < resp_price_list.length; i++) {
                        let item = resp_price_list[i];
                        let price_value = findObjectById(price_list_from_detail, item?.['id'])
                        let checked = '';
                        let disabled = '';
                        let disabled_input = 'disabled';
                        let is_default = false;
                        let required = '';
                        if (item.is_default) {
                            general_price_list_id = item.id
                            disabled_input = ''
                            is_default = true;
                            required = 'required';
                        }
                        if (item.is_default || (item?.['price_list_mapped'] === general_price_list_id && item?.['auto_update'] === true)) {
                            checked = 'checked';
                            disabled = 'disabled';
                        }
                        let hidden = '';
                        if (item?.['price_list_mapped'] !== null) {
                            hidden = 'hidden';
                        }
                        if (price_value) {
                            checked = 'checked';
                        }
                        price_list_data.push({
                            'hidden': hidden,
                            'checked': checked,
                            'disabled': disabled,
                            'is_default': is_default,
                            'disabled_input': disabled_input,
                            'required': required,
                            'id': item?.['id'],
                            'title': item?.['title'],
                            'price_value': price_value,
                            'price_list_mapped': item?.['price_list_mapped'],
                            'auto_update': item?.['auto_update'],
                            'factor': item?.['factor']
                        })
                    }
                    return price_list_data;
                }
            }
        },
        columns: [
            {
                className: 'wrap-text w-10',
                'render': () => {
                    return ``;
                }
            }, {
                className: 'wrap-text w-10',
                render: (data, type, row) => {
                    return `<input ${disabled_all_input} ${row.hidden} class="select_price_list" type="checkbox" data-id="${row.id}" ${row.checked} ${row.disabled}>`
                }
            }, {
                className: 'wrap-text w-40',
                render: (data, type, row) => {
                    return `<label class="${row.required} form-label">${row.title}</label>`
                }
            }, {
                className: 'wrap-text w-40',
                render: (data, type, row) => {
                    return `<input ${disabled_all_input} value="${row.price_value}" data-is-default="${row.is_default}" ${row.disabled_input} data-source="${row?.['price_list_mapped']}" data-auto-update="${row.auto_update}" data-factor="${row.factor}" data-id="${row.id}" data-return-type="number" type="text" class="form-control mask-money input_price_list">`
                }
            }
        ],
    })
}

function loadSaleDefaultUom(data) {
    saleDefaultUomEle.initSelect2({
        ajax: {
            url: saleDefaultUomEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i].group.id === generalUomGroupEle.val()) {
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

function loadInventoryDefaultUom(data) {
    inventoryDefaultUomEle.initSelect2({
        ajax: {
            url: inventoryDefaultUomEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i].group.id === generalUomGroupEle.val()) {
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

function loadPurchaseDefaultUom(data) {
    purchaseDefaultUomEle.initSelect2({
        ajax: {
            url: purchaseDefaultUomEle.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i].group.id === generalUomGroupEle.val()) {
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
    $('#VolumeSpan').text(item_unit_dict['volume'].measure)
    volumeEle.attr('data-id', item_unit_dict['volume'].id)
    $('#WeightSpan').text(item_unit_dict['weight'].measure)
    weightEle.attr('data-id', item_unit_dict['weight'].id)
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

function loadWareHouseListDetail(product_warehouse_detail) {
    table_warehouse_list.DataTableDefault({
        dom: '',
        paging: false,
        data: product_warehouse_detail,
        columns: [
            {
                data: 'code',
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="text-secondary table-row-code" data-id="${row.warehouse.id}">${row.warehouse.code}</span>`;
                }
            },
            {
                data: 'title',
                className: 'wrap-text text-center w-25',
                render: (data, type, row) => {
                    return `<span class="text-secondary"><b>${row.warehouse.title}</b></span>`
                }
            },
            {
                data: '',
                className: 'wrap-text text-center w-15',
                render: (data, type, row) => {
                    return `<span>${row?.['stock_amount']}</span>`;
                }
            },
        ],
        rowCallback(row, data, index) {
            $(`button.btn-detail`, row).on('click', function (e) {
                let $tableLot = $('#datable-lot');
                let $tableSerial = $('#datable-serial');
                let idProduct = $.fn.getPkDetail();
                let idWH = row?.querySelector('.table-row-code')?.getAttribute('data-id');
                let eleDetail = $('#data-detail-page');
                if (eleDetail.val()) {
                    let dataDetail = JSON.parse(eleDetail.val());
                    if (dataDetail?.['general_information']?.['traceability_method'] === 1) {
                        $('#table-lot-area')[0].removeAttribute('hidden');
                        $.fn.callAjax2({
                                'url': $tableLot.attr('data-url'),
                                'method': $tableLot.attr('data-method'),
                                'data': {
                                    'product_warehouse__product_id': idProduct,
                                    'product_warehouse__warehouse_id': idWH,
                                },
                                'isDropdown': true,
                            }
                        ).then(
                            (resp) => {
                                let dataLot = $.fn.switcherResp(resp);
                                if (dataLot) {
                                    if (dataLot.hasOwnProperty('warehouse_lot_list') && Array.isArray(dataLot.warehouse_lot_list)) {
                                        $tableLot.DataTable().clear().draw();
                                        $tableLot.DataTable().rows.add(dataLot.warehouse_lot_list).draw();
                                    }
                                }
                            }
                        )
                    } else if (dataDetail?.['general_information']?.['traceability_method'] === 2) {
                        $('#table-serial-area')[0].removeAttribute('hidden');
                        $.fn.callAjax2({
                                'url': $tableSerial.attr('data-url'),
                                'method': $tableSerial.attr('data-method'),
                                'data': {
                                    'product_warehouse__product_id': idProduct,
                                    'product_warehouse__warehouse_id': idWH,
                                    'is_delete': false
                                },
                                'isDropdown': true,
                            }
                        ).then(
                            (resp) => {
                                let dataSerial = $.fn.switcherResp(resp);
                                if (dataSerial) {
                                    if (dataSerial.hasOwnProperty('warehouse_serial_list') && Array.isArray(dataSerial.warehouse_serial_list)) {
                                        $tableSerial.DataTable().clear().draw();
                                        $tableSerial.DataTable().rows.add(dataSerial.warehouse_serial_list).draw();
                                    }
                                }
                            }
                        )
                    }
                }
            });
        }
    });
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

function loadWareHouseOverViewDetail(data_overview) {
    let dtb = $('#datatable-warehouse-overview');
    dtb.DataTable().clear().destroy();
    dtb.DataTableDefault({
        dom: '',
        paging: false,
        data: data_overview,
        columns: [
            {
                data: 'sum_stock',
                className: 'wrap-text text-center w-25',
                render: (data, type, row) => {
                    if (row.sum_stock > 0) {
                        return `<span style="font-weight: bolder" class="text-primary">${row.sum_stock}</span>`
                    } else {
                        return `<span style="font-weight: bolder" class="text-danger">${row.sum_stock}</span>`
                    }
                }
            },
            {
                data: 'sum_wait_for_delivery',
                className: 'wrap-text text-center w-25',
                render: (data, type, row) => {
                    if (row.sum_wait_for_delivery > 0) {
                        return `<span style="font-weight: bolder" class="text-primary">${row.sum_wait_for_delivery}</span>`
                    } else {
                        return `<span style="font-weight: bolder" class="text-danger">${row.sum_wait_for_delivery}</span>`
                    }
                }
            },
            {
                data: 'sum_wait_for_receipt',
                className: 'wrap-text text-center w-25',
                render: (data, type, row) => {
                    if (row.sum_wait_for_receipt > 0) {
                        return `<span style="font-weight: bolder" class="text-primary">${row.sum_wait_for_receipt}</span>`
                    } else {
                        return `<span style="font-weight: bolder" class="text-danger">${row.sum_wait_for_receipt}</span>`
                    }
                }
            },
            {
                data: 'sum_available_value',
                className: 'wrap-text text-center w-25',
                render: (data, type, row) => {
                    if (row.sum_available_value > 0) {
                        return `<span style="font-weight: bolder" class="text-primary">${row.sum_available_value}</span>`
                    } else {
                        return `<span style="font-weight: bolder" class="text-danger">${row.sum_available_value}</span>`
                    }
                }
            },
        ],
    });
}

function dataTableLot(data) {
    $('#datable-lot').DataTableDefault({
        data: data ? data : [],
        paging: false,
        info: false,
        columnDefs: [],
        columns: [
            {
                targets: 0,
                render: (data, type, row) => {
                    let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                    return `<span class="table-row-uom">${row?.['uom']?.['title'] ? row?.['uom']?.['title'] : ''}</span>`;

                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<span class="table-row-uom">${row?.['uom']?.['title'] ? row?.['uom']?.['title'] : ''}</span>`;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<span class="table-row-uom">${row?.['uom']?.['title'] ? row?.['uom']?.['title'] : ''}</span>`;
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    return `<span class="table-row-uom">${row?.['uom']?.['title'] ? row?.['uom']?.['title'] : ''}</span>`;
                }
            },
        ],
    });
}

function dataTableSerial(data) {
    $('#datable-serial').DataTableDefault({
        data: data ? data : [],
        columns: [
            {
                targets: 0,
                render: (data, type, row) => {
                    let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                    return `<span class="badge badge-soft-primary">${row?.['vendor_serial_number'] ? row?.['vendor_serial_number'] : ''}</span>`;
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<span class="badge badge-soft-success">${row?.['serial_number'] ? row?.['serial_number'] : ''}</span>`;
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['expire_date'], {
                        'outputFormat': 'DD-MM-YYYY',
                    });
                }
            },
            {
                targets: 3,
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['manufacture_date'], {
                        'outputFormat': 'DD-MM-YYYY',
                    });
                }
            },
            {
                targets: 4,
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['warranty_start'], {
                        'outputFormat': 'DD-MM-YYYY',
                    });
                }
            },
            {
                targets: 5,
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['warranty_end'], {
                        'outputFormat': 'DD-MM-YYYY',
                    });
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
        $('#btn-add-row-variant-attributes').prop('disabled', true);
    }
}

function getDataForm() {
    let data = {
        'code': $('#code').val(),
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
    data['product_types_mapped_list'] = generalProductTypeEle.val();
    data['general_product_category'] = generalProductCateEle.val();
    data['general_uom_group'] = generalUomGroupEle.val();
    data['general_traceability_method'] = $('#general-select-box-traceability-method option:selected').attr('value');

    let variant_attribute_create_valid = true;
    let variant_item_create_valid = true;
    data['product_variant_attribute_list'] = [];
    data['product_variant_item_list'] = [];

    if (table_Variant_Attributes.find('tbody tr').length > 0) {
        table_Variant_Attributes.find('tbody tr').each(function (index) {
            let row = $(this);
            let attribute_title = row.find('.variant-attribute').val();
            let attribute_value_list = row.find('.attribute_value_list_span').text();
            let attribute_config = row.find('.config-selection').attr('data-value');

            if (attribute_title !== '' && attribute_value_list.length > 0 && attribute_config !== '') {
                data['product_variant_attribute_list'].push({
                    'attribute_title': attribute_title,
                    'attribute_value_list': JSON.parse(attribute_value_list),
                    'attribute_config': attribute_config
                })
            } else {
                $.fn.notifyB({description: 'Variant Attributes Table is missing data (Row ' + (index + 1) + ')'}, 'failure');
                variant_attribute_create_valid = false;
            }
        })

        table_Variant_Items.find('tbody tr').each(function (index) {
            let row = $(this);
            let variant_value_list = [];
            row.find('.variant-item').each(function () {
                variant_value_list.push($(this).text())
            });
            let variant_name = row.find('.variant-name-span').text();
            let variant_des = row.find('.variant-des-span').text();
            if (variant_name === '' || variant_des === '') {
                let variant_name_content = [];
                let variant_des_content = [];
                row.find('.variant-item').each(function () {
                    variant_name_content.push($(this).text());
                    variant_des_content.push($(this).text());
                })
                variant_name = $('#title').val() + ' (' + variant_name_content.join(', ') + ')';
                variant_des = variant_des_content.join(', ');
            }
            let variant_SKU = row.find('.SKU-input').val();
            let variant_extra_price = row.find('.extra-price-input').attr('value');
            let is_active = row.find('.variant-active').is(':checked');

            if (variant_value_list.length > 0 && variant_des !== '' && variant_name !== '' && data['title'] !== '') {
                if (row.attr('data-variant-value-id') !== undefined) {
                    data['product_variant_item_list'].push({
                        'variant_value_id': row.attr('data-variant-value-id'),
                        'variant_value_list': variant_value_list,
                        'variant_name': variant_name,
                        'variant_des': variant_des,
                        'variant_SKU': variant_SKU,
                        'variant_extra_price': variant_extra_price,
                        'is_active': is_active
                    })
                } else {
                    data['product_variant_item_list'].push({
                        'variant_value_list': variant_value_list,
                        'variant_name': variant_name,
                        'variant_des': variant_des,
                        'variant_SKU': variant_SKU,
                        'variant_extra_price': variant_extra_price,
                        'is_active': is_active
                    })
                }
            } else {
                $.fn.notifyB({description: 'Variant Items Table is missing data (Row ' + (index + 1) + ')'}, 'failure');
                variant_item_create_valid = false;
            }
        })

        if (!variant_attribute_create_valid && !variant_item_create_valid) {
            return false;
        }

        if (table_Variant_Attributes.find('tbody tr').length !== data['product_variant_attribute_list'].length || table_Variant_Items.find('tbody tr').length !== data['product_variant_item_list'].length) {
            $.fn.notifyB({description: 'Variant Tables is invalid'}, 'failure');
            return false;
        }
    }

    if (check_tab_sale.is(':checked') === true) {
        data['product_choice'].push(0)
        let sale_product_price_list = [];
        $('.input_price_list').each(function () {
            let price_list_id = $(this).attr('data-id');
            let price_list_value = $(this).attr('value');
            let is_auto_update = $(this).attr('data-auto-update');
            if (price_list_id && price_list_value) {
                sale_product_price_list.push({
                    'price_list_id': price_list_id,
                    'price_list_value': price_list_value,
                    'is_auto_update': is_auto_update
                });
            }
        })
        data['sale_default_uom'] = $('#sale-select-box-default-uom option:selected').attr('value');
        data['sale_tax'] = $('#sale-select-box-tax-code option:selected').attr('value');
        data['sale_cost'] = parseFloat($('#sale-cost').attr('value'));
        data['sale_price_list'] = sale_product_price_list;
        data['sale_currency_using'] = currency_primary;

        data['is_public_website'] = public_website_Ele.prop('checked');
        if (public_website_Ele.prop('checked')) {
            data['online_price_list'] = price_list_for_online_sale_Ele.val();
        }
        data['available_notify'] = available_notify_checkboxEle.prop('checked');
        data['available_notify_quantity'] = parseFloat($('#less_than_number').val());
    } else {
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
    } else {
        data['inventory_uom'] = null;
        data['inventory_level_min'] = null;
        data['inventory_level_max'] = null;
    }

    if (check_tab_purchase.is(':checked') === true) {
        data['product_choice'].push(2)
        data['purchase_default_uom'] = $('#purchase-select-box-default-uom option:selected').attr('value');
        data['purchase_tax'] = $('#purchase-select-box-tax-code option:selected').attr('value');
    } else {
        data['purchase_default_uom'] = null;
        data['purchase_tax'] = null;
    }

    if (!data['product_types_mapped_list'].length > 0 || !data['general_product_category'] || !data['general_uom_group']) {
        $.fn.notifyB({description: 'Some fields in General tab is missing'}, 'failure');
        return false
    }

    if (data['product_choice'].includes(0)) {
        if (data['is_public_website'] && Object.keys(data).includes('price_list_for_sale_online')) {
            $.fn.notifyB({description: 'Missing Price list for Sale online'}, 'failure');
            return false
        }
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
    load() {
        loadGeneralProductType();
        loadGeneralProductCategory();
        loadGeneralUoMGroup();
        loadSaleTaxCode();
        loadPurchaseTaxCode();
        loadSaleDefaultUom();
        loadSalePriceListForSaleOnline(null, []);
        loadInventoryDefaultUom();
        loadPurchaseDefaultUom();
        loadBaseItemUnit();
        loadWareHouseOverView();
    }

    combinesData(frmEle, for_update = false) {
        let dataForm = getDataForm();
        if (dataForm) {
            let frm = new SetupFormSubmit($(frmEle));

            let url_return = frm.dataUrl;
            if (for_update === true) {
                let pk = $.fn.getPkDetail()
                url_return = frm.dataUrl.format_url_with_uuid(pk);
            }

            return {
                url: url_return,
                method: frm.dataMethod,
                data: dataForm,
                urlRedirect: frm?.['urlRedirect'],
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
                Detail_data = product_detail;
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(product_detail);
                console.log(product_detail)

                $('#code').val(product_detail['code']);
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
                    loadGeneralProductType(general_information['general_product_types_mapped']);
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
                    loadBaseItemUnit();
                }

                if (Object.keys(product_detail['sale_information']).length !== 0) {
                    let sale_information = product_detail['sale_information'];
                    loadSaleDefaultUom(sale_information['default_uom']);
                    loadSaleTaxCode(sale_information['tax']);
                    $('#sale-cost').attr('value', sale_information['sale_product_cost']);

                    let price_list_filter = []
                    for (let i = 0; i < sale_information['sale_product_price_list'].length; i++) {
                        let item = sale_information['sale_product_price_list'][i];
                        price_list_filter.push(item.id)
                    }

                    loadPriceList(sale_information['sale_product_price_list'], option);

                    loadSalePriceListForSaleOnline(sale_information['price_list_for_online_sale'], price_list_filter)

                    public_website_Ele.prop('checked', product_detail['is_public_website'])
                    if (product_detail['is_public_website']) {
                        price_list_for_online_sale_Ele.prop('disabled', false)
                    }
                    else {
                        price_list_for_online_sale_Ele.prop('disabled', true)
                    }

                    available_notify_checkboxEle.prop('checked', sale_information?.['available_notify']);
                    if (sale_information?.['available_notify']) {
                        $('#less_than_number').prop('disabled', false).val(sale_information?.['available_notify_quantity']);
                    }
                    else {
                        $('#less_than_number').prop('disabled', true).val('')
                    }
                    $.fn.initMaskMoney2();
                }

                if (Object.keys(product_detail['inventory_information']).length !== 0) {
                    let inventory_information = product_detail['inventory_information'];
                    loadInventoryDefaultUom(inventory_information['uom']);
                    $('#inventory-level-min').val(inventory_information['inventory_level_min']);
                    $('#inventory-level-max').val(inventory_information['inventory_level_max']);

                    loadWareHouseListDetail(product_detail['product_warehouse_detail']);
                    let data_overview = [];
                    let sum_stock = product_detail?.['stock_amount'] ? product_detail?.['stock_amount'] : 0;
                    let sum_wait_for_delivery = product_detail?.['wait_delivery_amount'] ? product_detail?.['wait_delivery_amount'] : 0;
                    let sum_wait_for_receipt = product_detail?.['wait_receipt_amount'] ? product_detail?.['wait_receipt_amount'] : 0;
                    let sum_available_value = product_detail?.['available_amount'] ? product_detail?.['available_amount'] : 0;
                    data_overview.push({
                        'sum_stock': sum_stock,
                        'sum_wait_for_delivery': sum_wait_for_delivery,
                        'sum_wait_for_receipt': sum_wait_for_receipt,
                        'sum_available_value': sum_available_value
                    })
                    loadWareHouseOverViewDetail(data_overview);
                }

                if (Object.keys(product_detail['purchase_information']).length !== 0) {
                    let purchase_information = product_detail['purchase_information'];
                    loadPurchaseDefaultUom(purchase_information['default_uom']);
                    loadPurchaseTaxCode(purchase_information['tax']);
                }

                $('#data-detail-page').val(JSON.stringify(product_detail));

                let readonly = '';
                let disabled = '';
                if (option === 'detail') {
                    readonly = 'readonly';
                    disabled = 'disabled';
                }

                for (let i = 0; i < product_detail['product_variant_attribute_list'].length; i++) {
                     let item = product_detail['product_variant_attribute_list'][i];
                     let attribute_config_list = [
                         'Dropdown List', 'Radio Select',
                         'Select (Fill by text)', 'Select (Fill by color)', 'Select (Fill bu photo)'
                     ]
                     let variant_attributes_select_html = '';
                     for (let j = 0; j < item['attribute_value_list'].length; j++) {
                         variant_attributes_select_html += `<span class="badge badge-primary mr-1 mb-1">
                             <span>
                                 <span class="attribute-value">${item['attribute_value_list'][j]['value']}</span>
                             </span>
                         </span>`;
                     }
                     table_Variant_Attributes.find('tbody').append(`<tr id="row-${i + 1}" data-variant-attribute-id="${item.id}">
                         <td class="w-5 row-index">${i + 1}</td>
                         <td class="w-15"><input readonly class="form-control variant-attribute" value="${item.attribute_title}"></td>
                         <td class="w-50">
                             <span class="variant-attributes-span">${variant_attributes_select_html}</span>
                             <button type="button" ${disabled} data-bs-toggle="modal" data-bs-target="#modal-variant-attributes" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs add-variant-values"><span class="icon"><i class="fas fa-plus-circle"></i></span></button>
                         </td>
                         <td class="w-5"></td>
                         <td class="w-20">
                             <label class="config-selection" data-value="${item.attribute_config}">${attribute_config_list[item.attribute_config]}</label>
                             <button type="button" ${disabled} data-bs-toggle="modal" data-bs-target="#modal-attribute-display" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs add-variant-configs"><span class="icon"><i class="fas fa-stream"></i></span></button>
                             <script class="attribute_value_list_span" hidden></script>
                         </td>
                         <td class="w-5">
                             <button type="button" disabled class="btn btn-icon btn-rounded btn-flush-danger flush-soft-hover btn-xs delete-attribute-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                         </td>
                     </tr>`)

                     $(`#row-${i + 1} .variant-attributes-select`).initSelect2();
                     $(`#row-${i + 1} .variant-attributes-select option:selected`).prop('disabled', true);
                     $(`#row-${i + 1} .attribute_value_list_span`).text(JSON.stringify(item.attribute_value_list))
                 }

                $('#table-variant-items-label').text(product_detail['product_variant_item_list'].length);

                let data_table_Variant_Items = []
                for (let i = 0; i < product_detail['product_variant_item_list'].length; i++) {
                 let item = product_detail['product_variant_item_list'][i];
                 let variant_html = ``;
                 for (let j = 0; j < item?.['variant_value_list'].length; j++) {
                     variant_html += `<span class="variant-item badge badge-soft-danger badge-outline mr-1 mb-1">${item?.['variant_value_list'][j]}</span>`;
                 }
                 data_table_Variant_Items.push(
                     {
                         'index': i + 1,
                         'id': item?.['id'],
                         'html': variant_html,
                         'variant_name': item?.['variant_name'],
                         'variant_des': item?.['variant_des'],
                         'variant_SKU': item?.['variant_SKU'],
                         'variant_extra_price': item?.['variant_extra_price'],
                         'is_activate': item?.['is_active'] ? 'checked' : ''
                     }
                 )
                 // table_Variant_Items.find('tbody').append(`
                 //     <tr id="variant-item-row-${i + 1}" data-variant-value-id="${item.id}">
                 //         <td class="w-5">${i + 1}</td>
                 //         <td class="w-45">${variant_html}</td>
                 //         <td class="w-5">
                 //             <button type="button" data-bs-toggle="modal" data-bs-target="#modal-variant-item-des" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs add-variant-item-des"><span class="icon"><i class="fas fa-ellipsis-v"></i></span></button>
                 //             <span hidden class="variant-name-span">${item.variant_name}</span>
                 //             <span hidden class="variant-des-span">${item.variant_des}</span>
                 //         </td>
                 //         <td class="w-20"><input class="form-control SKU-input" value="${item.variant_SKU}"></td>
                 //         <td class="w-20"><input data-return-type="number" type="text" class="form-control mask-money extra-price-input" value="${item.variant_extra_price}"></td>
                 //         <td class="w-5">
                 //             <div class="form-check form-switch">
                 //                 <input ${is_active} type="checkbox" class="form-check-input variant-active">
                 //             </div>
                 //         </td>
                 //     </tr>
                 // `)
                }
                table_Variant_Items.DataTableDefault({
                    dom: "<'d-flex dtb-header-toolbar'<'btnAddFilter'><'textFilter overflow-hidden'>f<'util-btn'>><'row manualFilter hidden'>rt",
                    reloadCurrency: true,
                    paging: false,
                    data: data_table_Variant_Items ? data_table_Variant_Items : [],
                    columns: [
                     {
                        data: '',
                        className: 'wrap-text text-center w-5',
                        render: (data, type, row) => {
                            return row.index;
                        }
                    },
                     {
                        data: '',
                        className: 'wrap-text w-40',
                        render: (data, type, row) => {
                            return row.html;
                        }
                    },
                     {
                        data: '',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<button type="button" data-bs-toggle="modal" data-bs-target="#modal-variant-item-des" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs add-variant-item-des"><span class="icon"><i class="fas fa-ellipsis-v"></i></span></button>
                             <span hidden class="variant-name-span">${row.variant_name}</span>
                             <span hidden class="variant-des-span">${row.variant_des}</span>`
                        }
                    },
                     {
                        data: '',
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            return `<input class="form-control SKU-input" ${readonly} value="${row.variant_SKU}">`;
                        }
                    },
                     {
                        data: '',
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            return `<input data-return-type="number" type="text" ${readonly} class="form-control mask-money extra-price-input" value="${row.variant_extra_price}">`;
                        }
                    },
                     {
                        data: '',
                        className: 'wrap-text text-center w-10',
                        render: (data, type, row) => {
                            return `<div class="form-check form-switch">
                                 <input ${row.is_activate} type="checkbox" ${disabled} class="form-check-input variant-active">
                             </div>`;
                        }
                    }
                    ],
                    createdRow: (row, data, dataIndex) => {
                        $(row).attr('id', `variant-item-row-${dataIndex+1}`);
                        $(row).attr('data-variant-value-id', data.id);
                    }
                });

                if (product_detail['product_variant_item_list'].length > 0) {
                 $('#table-variant-items-div').prop('hidden', false);
                }


                $.fn.initMaskMoney2();

                Disable(option);
            }
        })
}

// variants

btn_Add_Line_Variant_Attributes.on('click', function () {
    if (parseFloat($('#datatable-warehouse-overview tbody tr:first-child td:first-child span').text()) > 0) {
        $.fn.notifyB({description: 'Can not add variants when product is in stock'}, 'failure');
    }
    else {
        let tb_length = table_Variant_Attributes.find('tbody').find('tr').length;
        table_Variant_Attributes.find('tbody').append(`
            <tr id="row-${tb_length + 1}">
                <td class="w-5 row-index">${tb_length + 1}</td>
                <td class="w-15"><input class="form-control variant-attribute"></td>
                <td class="w-50">
                    <span class="variant-attributes-span"></span>
                    <button type="button" disabled data-bs-toggle="modal" data-bs-target="#modal-variant-attributes" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs add-variant-values"><span class="icon"><i class="fas fa-plus-circle"></i></span></button>
                </td>
                <td class="w-5"></td>
                <td class="w-20">
                    <label class="config-selection"></label>
                    <button type="button" disabled data-bs-toggle="modal" data-bs-target="#modal-attribute-display" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs add-variant-configs"><span class="icon"><i class="fas fa-stream"></i></span></button>
                    <script class="attribute_value_list_span" hidden></script>
                </td>
                <td class="w-5">
                    <button type="button" class="btn btn-icon btn-rounded btn-flush-danger flush-soft-hover btn-xs delete-attribute-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                </td>
            </tr>
        `)
        $(`#row-${tb_length + 1} .variant-attributes-select`).initSelect2();
    }
})

function ReloadModalConfig(option, color_data) {
    if (color_data !== '') {
        color_data = JSON.parse(color_data);
    }

    attribute_display_select_by.html('');
    attribute_display_select_by.initSelect2();
    attribute_display_select_by.append(`
        <option></option>
        <option value="0">Dropdown list</option>
        <option value="1">Radio select</option>
        <option value="2">Select</option>
    `);

    let variants_value_list = [];
    current_row_variant_attribute.find('.variant-attributes-span').find('.attribute-value').each(function () {
        variants_value_list.push($(this).text());
    })

    // dropdown_list_preview
    let dropdown_list_preview = $('#dropdown-list-preview');
    dropdown_list_preview.html('');
    dropdown_list_preview.initSelect2();
    dropdown_list_preview.append(`<option></option>`);
    for (let i = 0; i < variants_value_list.length; i++) {
        dropdown_list_preview.append(`<option>${variants_value_list[i]}</option>`);
    }

    // radio_selection_preview
    let radio_selection_preview = $('#radio-selection-preview');
    radio_selection_preview.html('');
    for (let i = 0; i < variants_value_list.length; i++) {
        radio_selection_preview.append(`
            <div class="col-3">
                <div class="form-check">
                    <input type="radio" value="${variants_value_list[i]}" name="radio-type-1" class="form-check-input radio-attribute-value" checked>
                    <label class="form-check-label" for="${variants_value_list[i]}">${variants_value_list[i]}</label>
                </div>
            </div>
        `);
    }

    // fill_by_text_preview
    let fill_by_text_preview = $('#fill-by-text-preview');
    fill_by_text_preview.html('');
    for (let i = 0; i < variants_value_list.length; i++) {
        fill_by_text_preview.append(`
            <div class="col-3">
                <div class="text-center mb-2 pt-2 pb-2 pr-2 pl-2 bg-gray-light-4 border rounded border-grey selection-fill-by">
                    ${variants_value_list[i]}
                </div>
            </div>
        `);
    }

    // fill_by_color_preview
    let fill_by_color_preview = $('#fill-by-color-preview');
    fill_by_color_preview.html('');
    for (let i = 0; i < variants_value_list.length; i++) {
        let color = '#000000';
        if (color_data.length > 0) {
            color = color_data[i]?.['color'] ? color_data[i]?.['color'] : '#000000';
        }
        fill_by_color_preview.append(`
            <div class="col-3">
                <div class="mb-2 pt-2 pb-2 pr-2 pl-2 border rounded border-grey selection-fill-by">
                <center>
                    <input type="color" id="color-picker-${variants_value_list[i]}" class="form-control form-control-color color-picker-attribute-value" value="${color}" title="Choose your color">
                    <label for="color-picker-${variants_value_list[i]}" class="form-label">${variants_value_list[i]}</label>
                </center>
                </div> 
            </div>
        `);
    }

    // fill_by_photo_preview
    let fill_by_photo_preview = $('#fill-by-photo-preview');
    fill_by_photo_preview.html('');
    for (let i = 0; i < variants_value_list.length; i++) {
        fill_by_photo_preview.append(`
            <div class="col-3">
                <div class="mb-2 pt-2 pb-2 pr-2 pl-2 border rounded border-grey selection-fill-by">
                <center>
                    <input type="file" id="photo-picker-${variants_value_list[i]}" class="photo-picker-dropify">
                    <label for="photo-picker-${variants_value_list[i]}" class="form-label">${variants_value_list[i]}</label>
                </center>
                </div> 
            </div>
        `);
    }
    $('.photo-picker-dropify').dropify({
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
    $('.selection-fill-by .dropify-wrapper').addClass('h-90p');

    if (option === undefined) {
        $('#dropdown-list-selection-preview').attr('hidden', true);
        radio_selection_preview.attr('hidden', true);
        $('#select-selection-preview').attr('hidden', true);
        fill_by_text_preview.attr('hidden', true);
        fill_by_color_preview.attr('hidden', true);
        fill_by_photo_preview.attr('hidden', true);
    }
    if (option === '0') {
        attribute_display_select_by.val(0);
        $('#dropdown-list-selection-preview').attr('hidden', false);
        radio_selection_preview.attr('hidden', true);
        $('#select-selection-preview').attr('hidden', true);
        fill_by_text_preview.attr('hidden', true);
        fill_by_color_preview.attr('hidden', true);
        fill_by_photo_preview.attr('hidden', true);
    }
    if (option === '1') {
        attribute_display_select_by.val(1);
        $('#dropdown-list-selection-preview').attr('hidden', true);
        radio_selection_preview.attr('hidden', false);
        $('#select-selection-preview').attr('hidden', true);
        fill_by_text_preview.attr('hidden', true);
        fill_by_color_preview.attr('hidden', true);
        fill_by_photo_preview.attr('hidden', true);
    }
    if (option === '2') {
        attribute_display_select_by.val(2);
        $('#radio-fill-by-text').prop('checked', true);

        $('#dropdown-list-selection-preview').attr('hidden', true);
        radio_selection_preview.attr('hidden', true);
        $('#select-selection-preview').attr('hidden', false);
        fill_by_text_preview.attr('hidden', false);
        fill_by_color_preview.attr('hidden', true);
        fill_by_photo_preview.attr('hidden', true);
    }
    if (option === '3') {
        attribute_display_select_by.val(2);
        $('#radio-fill-by-color').prop('checked', true);

        $('#dropdown-list-selection-preview').attr('hidden', true);
        radio_selection_preview.attr('hidden', true);
        $('#select-selection-preview').attr('hidden', false);
        fill_by_text_preview.attr('hidden', true);
        fill_by_color_preview.attr('hidden', false);
        fill_by_photo_preview.attr('hidden', true);
    }
    if (option === '4') {
        attribute_display_select_by.val(2);
        $('#radio-fill-by-photo').prop('checked', true);

        $('#dropdown-list-selection-preview').attr('hidden', true);
        radio_selection_preview.attr('hidden', true);
        $('#select-selection-preview').attr('hidden', false);
        fill_by_text_preview.attr('hidden', true);
        fill_by_color_preview.attr('hidden', true);
        fill_by_photo_preview.attr('hidden', false);
    }
}

$(document).on("click", '.add-variant-values', function () {
    modal_Variant_Attributes.find('#value-name-modal-input').val('');
    current_row_variant_attribute = $(this).closest('tr');
    modal_Variant_Attributes.find('#attribute-name-modal-input').val($(this).closest('tr').find('.variant-attribute').val())
})

$(document).on("click", '.add-variant-configs', function () {
    current_row_variant_attribute = $(this).closest('tr');
    let option = current_row_variant_attribute.find('.config-selection').attr('data-value');
    let color_data = current_row_variant_attribute.find('.attribute_value_list_span').text()
    ReloadModalConfig(option, color_data);
})

$(document).on("click", '.add-variant-item-des', function () {
    current_row_variant_item = $(this).closest('tr');
    let variant_name = current_row_variant_item.find('.variant-name-span').text();
    let variant_des = current_row_variant_item.find('.variant-des-span').text();
    if (variant_name !== '' && variant_des !== '') {
        $('#variant-name').val(variant_name);
        $('#variant-des').val(variant_des);
    }
    else {
        if ($('#title').val() !== '') {
            let variant_name_content = [];
            let variant_des_content = [];
            current_row_variant_item.find('.variant-item').each(function () {
                variant_name_content.push($(this).text());
                variant_des_content.push($(this).text());
            })
            $('#variant-name').val($('#title').val() + ' (' + variant_name_content.join(', ') + ')');
            $('#variant-des').val(variant_des_content.join(', '));
        }
        else {
            $('#variant-name').val('');
            $('#variant-des').val('');
            $.fn.notifyB({description: 'Please enter a name for product!'}, 'warning');
        }
    }
})

$(document).on("input", '.variant-attribute', function () {
    if ($(this).val() !== '') {
        $(this).closest('tr').find('.add-variant-values').attr('disabled', false);
        $(this).closest('tr').find('.add-variant-configs').attr('disabled', false);
    }
    else {
        $(this).closest('tr').find('.add-variant-values').attr('disabled', true);
        $(this).closest('tr').find('.add-variant-configs').attr('disabled', true);
    }
})

function generateCombinations(arrays, current = [], index = 0, result = []) {
    if (index === arrays.length) {
        result.push(current.slice());
    } else {
        for (let i = 0; i < arrays[index].length; i++) {
            current[index] = arrays[index][i];
            generateCombinations(arrays, current, index + 1, result);
        }
    }
    return result;
}

function LoadVariantItemsTable() {
    let all_row_value_list = [];
    table_Variant_Attributes.find('tbody tr .variant-attributes-span').each(function (index) {
        $(this).closest('tr').attr('id', 'row-' + (index+1));
        $(this).closest('tr').find('.row-index').text(index+1);
        let value_list = [];
        $(this).find('.attribute-value').each(function () {
            value_list.push($(this).text());
        })
        all_row_value_list.push(value_list);
    })
    let combinations = generateCombinations(all_row_value_list);
    table_Variant_Items.find('tbody').html('');
    $('#table-variant-items-label').text(combinations.length);
    if (combinations.length > 0) {
        $('#table-variant-items-div').prop('hidden', false);
        for (let i = 0; i < combinations.length; i++) {
            let exist_variant = [];
            if (Detail_data !== null) {
                exist_variant = Detail_data?.['product_variant_item_list'].filter(function (element) {
                    return JSON.stringify(element?.['variant_value_list'].slice().sort()) === JSON.stringify(combinations[i].slice().sort());
                })
            }
            let variant_html = ``;
            for (let j = 0; j < combinations[i].length; j++) {
                variant_html += `<span class="variant-item badge badge-soft-danger badge-outline mr-1 mb-1">${combinations[i][j]}</span>`;
            }
            if (exist_variant.length === 0) {
                table_Variant_Items.find('tbody').append(`
                    <tr id="variant-item-row-${i + 1}">
                        <td class="w-5"><span class="badge badge-primary badge-indicator"></span>${i + 1}</td>
                        <td class="w-45">${variant_html}</td>
                        <td class="w-5">
                            <button type="button" data-bs-toggle="modal" data-bs-target="#modal-variant-item-des" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs add-variant-item-des"><span class="icon"><i class="fas fa-ellipsis-v"></i></span></button>
                            <span hidden class="variant-name-span"></span>
                            <span hidden class="variant-des-span"></span>
                        </td>
                        <td class="w-20"><input class="form-control SKU-input"></td>
                        <td class="w-20"><input data-return-type="number" type="text" class="form-control mask-money extra-price-input" value="0"></td>
                        <td class="w-5" style="align-items: center;">
                            <div class="form-check form-switch">
                                <input checked type="checkbox" class="form-check-input variant-active">
                            </div>
                        </td>
                    </tr>
                `)
            }
            else {
                let exist_variant_data = exist_variant[0];
                let checked = '';
                if (exist_variant_data.is_active) {
                    checked = 'checked';
                }
                table_Variant_Items.find('tbody').append(`
                    <tr id="variant-item-row-${i + 1}" data-variant-value-id="${exist_variant_data.id}">
                        <td class="w-5">${i + 1}</td>
                        <td class="w-45">${variant_html}</td>
                        <td class="w-5">
                            <button type="button" data-bs-toggle="modal" data-bs-target="#modal-variant-item-des" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs add-variant-item-des"><span class="icon"><i class="fas fa-ellipsis-v"></i></span></button>
                            <span hidden class="variant-name-span">${exist_variant_data.variant_name}</span>
                            <span hidden class="variant-des-span">${exist_variant_data.variant_des}</span>
                        </td>
                        <td class="w-20"><input class="form-control SKU-input" value="${exist_variant_data.variant_SKU}"></td>
                        <td class="w-20"><input data-return-type="number" type="text" class="form-control mask-money extra-price-input" value="${exist_variant_data.variant_extra_price}"></td>
                        <td class="w-5">
                            <div class="form-check form-switch">
                                <input ${checked} type="checkbox" class="form-check-input variant-active">
                            </div>
                        </td>
                    </tr>
                `)
            }
        }
    }
    else {
        $('#table-variant-items-div').prop('hidden', true);
    }
    $.fn.initMaskMoney2();
}

$(document).on("change", '.variant-attributes-select', function () {
    LoadVariantItemsTable();
})

function ReloadAttributeValueListSpan() {
    let option = current_row_variant_attribute.find('.config-selection').attr('data-value');
    let color_data = current_row_variant_attribute.find('.attribute_value_list_span').text()
    ReloadModalConfig(option, color_data);
    let value = attribute_display_select_by.val();
    if (value !== '') {
        if (value === '0') {
            current_row_variant_attribute.find('.config-selection').text('Dropdown list');
            current_row_variant_attribute.find('.config-selection').attr('data-value', 0);
            let attribute_value_list = []
            $('#dropdown-list-preview option').each(function() {
                if ($(this).text() !== '') {
                    attribute_value_list.push({
                        'value': $(this).text(),
                        'color': null
                    })
                }
            })
            current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list))
        }
        if (value === '1') {
            current_row_variant_attribute.find('.config-selection').text('Radio select');
            current_row_variant_attribute.find('.config-selection').attr('data-value', 1);
            let attribute_value_list = []
            $('#radio-selection-preview .radio-attribute-value').each(function() {
                if ($(this).attr('value') !== '') {
                    attribute_value_list.push({
                        'value': $(this).attr('value'),
                        'color': null
                    })
                }
            })
            current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
        }
        if (value === '2') {
            let detail_select = ''
            if ($('#radio-fill-by-text').is(':checked')) {
                current_row_variant_attribute.find('.config-selection').attr('data-value', 2);
                detail_select = '(Fill by text)';
                let attribute_value_list = []
                $('#fill-by-text-preview .selection-fill-by').each(function() {
                    if ($(this).text() !== '') {
                        attribute_value_list.push({
                            'value': $(this).text(),
                            'color': null
                        })
                    }
                })
                current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
            }
            if ($('#radio-fill-by-color').is(':checked')) {
                current_row_variant_attribute.find('.config-selection').attr('data-value', 3);
                detail_select = '(Fill by color)';
                let attribute_value_list = []
                $('#fill-by-color-preview .selection-fill-by').each(function() {
                    if ($(this).text() !== '') {
                        attribute_value_list.push({
                            'value': $(this).find('label').text(),
                            'color': $(this).find('.color-picker-attribute-value').val()
                        })
                    }
                })
                current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
            }
            if ($('#radio-fill-by-photo').is(':checked')) {
                current_row_variant_attribute.find('.config-selection').attr('data-value', 4);
                detail_select = '(Fill by photo)';
                let attribute_value_list = []
                $('#fill-by-photo-preview .selection-fill-by').each(function() {
                    if ($(this).text() !== '') {
                        attribute_value_list.push({
                            'value': $(this).find('label').text(),
                            'color': null
                        })
                    }
                })
                current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
            }
            current_row_variant_attribute.find('.config-selection').text(`Select ${detail_select}`);
        }
    }
}

$('#add-variant-value-item').on('click', function () {
    let value = $('#value-name-modal-input').val();
    if (value !== '') {
        current_row_variant_attribute.find('.variant-attributes-span').append(`
            <span class="badge badge-primary badge-outline mr-1 mb-1">
                <span>
                    <span class="icon delete-value"><i class="fas fa-times"></i></span>
                    <span class="attribute-value">${value}</span>
                </span>
            </span>
        `);
        LoadVariantItemsTable();
        ReloadAttributeValueListSpan();
    }
    else {
        $.fn.notifyB({description: 'Value is missing'}, 'warning');
    }
})

add_attribute_display_item.on('click', function () {
    let value = attribute_display_select_by.val();
    if (value !== '') {
        if (value === '0') {
            current_row_variant_attribute.find('.config-selection').text('Dropdown list');
            current_row_variant_attribute.find('.config-selection').attr('data-value', 0);
            let attribute_value_list = []
            $('#dropdown-list-preview option').each(function() {
                if ($(this).text() !== '') {
                    attribute_value_list.push({
                        'value': $(this).text(),
                        'color': null
                    })
                }
            })
            current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list))
        }
        if (value === '1') {
            current_row_variant_attribute.find('.config-selection').text('Radio select');
            current_row_variant_attribute.find('.config-selection').attr('data-value', 1);
            let attribute_value_list = []
            $('#radio-selection-preview .radio-attribute-value').each(function() {
                if ($(this).attr('value') !== '') {
                    attribute_value_list.push({
                        'value': $(this).attr('value'),
                        'color': null
                    })
                }
            })
            current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
        }
        if (value === '2') {
            let detail_select = ''
            if ($('#radio-fill-by-text').is(':checked')) {
                current_row_variant_attribute.find('.config-selection').attr('data-value', 2);
                detail_select = '(Fill by text)';
                let attribute_value_list = []
                $('#fill-by-text-preview .selection-fill-by').each(function() {
                    if ($(this).text() !== '') {
                        attribute_value_list.push({
                            'value': $(this).text(),
                            'color': null
                        })
                    }
                })
                current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
            }
            if ($('#radio-fill-by-color').is(':checked')) {
                current_row_variant_attribute.find('.config-selection').attr('data-value', 3);
                detail_select = '(Fill by color)';
                let attribute_value_list = []
                $('#fill-by-color-preview .selection-fill-by').each(function() {
                    if ($(this).text() !== '') {
                        attribute_value_list.push({
                            'value': $(this).find('label').text(),
                            'color': $(this).find('.color-picker-attribute-value').val()
                        })
                    }
                })
                current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
            }
            if ($('#radio-fill-by-photo').is(':checked')) {
                current_row_variant_attribute.find('.config-selection').attr('data-value', 4);
                detail_select = '(Fill by photo)';
                let attribute_value_list = []
                $('#fill-by-photo-preview .selection-fill-by').each(function() {
                    if ($(this).text() !== '') {
                        attribute_value_list.push({
                            'value': $(this).find('label').text(),
                            'color': null
                        })
                    }
                })
                current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
            }
            current_row_variant_attribute.find('.config-selection').text(`Select ${detail_select}`);
        }
    }
    else {
        $.fn.notifyB({description: 'Value is missing'}, 'warning');
    }
})

add_variant_des.on('click', function () {
    let variant_name = $('#variant-name').val();
    let variant_des = $('#variant-des').val();
    if (variant_name !== '' && variant_des !== '') {
        current_row_variant_item.find('.variant-name-span').text(variant_name);
        current_row_variant_item.find('.variant-des-span').text(variant_des);
    }
})

$(document).on("click", '.selection-fill-by', function () {
    let elements = document.getElementsByClassName('selection-fill-by');
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove('bg-primary-light-5');
      elements[i].classList.add('bg-gray-light-4');
    }
    $(this).addClass('bg-primary-light-5');
})

attribute_display_select_by.on('change', function () {
    let value = attribute_display_select_by.val();
    if (value !== '') {
        if (value === '0') {
            $('#dropdown-list-selection-preview').attr('hidden', false);
            $('#radio-selection-preview').attr('hidden', true);
            $('#select-selection-preview').attr('hidden', true);
            $('#fill-by-text-preview').attr('hidden', true);
            $('#fill-by-color-preview').attr('hidden', true);
            $('#fill-by-photo-preview').attr('hidden', true);
        }
        if (value === '1') {
            $('#dropdown-list-selection-preview').attr('hidden', true);
            $('#radio-selection-preview').attr('hidden', false);
            $('#select-selection-preview').attr('hidden', true);
            $('#fill-by-text-preview').attr('hidden', true);
            $('#fill-by-color-preview').attr('hidden', true);
            $('#fill-by-photo-preview').attr('hidden', true);
        }
        if (value === '2') {
            $('#dropdown-list-selection-preview').attr('hidden', true);
            $('#radio-selection-preview').attr('hidden', true);
            $('#radio-fill-by-text').prop('checked', true);
            $('#select-selection-preview').attr('hidden', false);
            $('#fill-by-text-preview').attr('hidden', false);
            $('#fill-by-color-preview').attr('hidden', true);
            $('#fill-by-photo-preview').attr('hidden', true);
        }
    }
    else {
        $.fn.notifyB({description: 'Invalid selection'}, 'warning');
    }
})

$('.fill-by-selection').on('change', function () {
    if ($('#radio-fill-by-text').is(':checked')) {
        $('#fill-by-text-preview').attr('hidden', false);
        $('#fill-by-color-preview').attr('hidden', true);
        $('#fill-by-photo-preview').attr('hidden', true);
    }
    if ($('#radio-fill-by-color').is(':checked')) {
        $('#fill-by-text-preview').attr('hidden', true);
        $('#fill-by-color-preview').attr('hidden', false);
        $('#fill-by-photo-preview').attr('hidden', true);
    }
    if ($('#radio-fill-by-photo').is(':checked')) {
        $('#fill-by-text-preview').attr('hidden', true);
        $('#fill-by-color-preview').attr('hidden', true);
        $('#fill-by-photo-preview').attr('hidden', false);
    }
})

$(document).on("click", '.delete-attribute-row', function () {
    $(this).closest('tr').remove();
    LoadVariantItemsTable();
})

$(document).on("click", '.delete-value', function () {
    current_row_variant_attribute = $(this).closest('tr');
    $(this).closest('.badge').remove();
    LoadVariantItemsTable();
    ReloadAttributeValueListSpan();
})
