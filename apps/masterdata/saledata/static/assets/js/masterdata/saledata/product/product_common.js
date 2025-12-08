/**
 * Khai báo các element trong page
 */
class ProductPageElements {
    constructor() {
        this.$url_script = $('#url_script')
        // information
        this.$product_image = $('#product-image')
        this.$code = $('#code')
        this.$title = $('#title')
        this.$part_number = $('#part-number')
        this.$description = $('#description')
        // general tab
        this.$general_product_type = $('#general-product-type')
        this.$general_product_category = $('#general-product-category')
        this.$general_uom_group = $('#general-uom-group')
        this.$general_manufacturer = $('#general-manufacturer')
        this.$general_traceability_method = $('#general-traceability-method')
        this.$general_standard_price = $('#general-standard-price')
        this.$length = $('#length')
        this.$width = $('#width')
        this.$height = $('#height')
        this.$volume = $('#volume')
        this.$weight = $('#weight')
        this.$representative_product = $('#representative-product')
        this.$copy_config_from_product = $('#copy-config-from-product')
        this.$datatable_config_content = $('#datatable-config-content')
        // sale tab
        this.$check_tab_sale = $('#check-tab-sale')
        this.$sale_uom = $('#sale-uom')
        this.$sale_tax = $('#sale-tax')
        this.$is_publish_website = $('#is_publish_website')
        this.$price_list_for_sale_online = $('#price_list_for_sale_online')
        this.$available_notify_checkbox = $('#available_notify_checkbox')
        this.$less_than_number = $('#less_than_number')
        this.$table_price_list = $('#table_price_list')
        // inventory tab
        this.$check_tab_inventory = $('#check-tab-inventory')
        this.$inventory_uom = $('#inventory-uom')
        this.$inventory_level_min = $('#inventory-level-min')
        this.$inventory_level_max = $('#inventory-level-max')
        this.$valuation_method = $('#valuation-method')
        this.$notify_inventory = $('#notify-inventory')
        this.$datatable_warehouse_list = $('#datatable-warehouse-list')
        this.$datatable_specific_serial_number_list = $('#datatable-specific-serial-number-list')
        this.$datatable_warehouse_overview = $('#datatable-warehouse-overview')
        // purchase tab
        this.$check_tab_purchase = $('#check-tab-purchase')
        this.$purchase_uom = $('#purchase-uom')
        this.$purchase_tax = $('#purchase-tax')
        this.$purchase_supplied_by = $('#purchase-supplied-by')
        // component tab
        this.$component_table = $('#component-table')
        this.$btn_add_row_component = $('#btn-add-row-component')
        // variant tab
        this.$table_variant_attributes = $('#table-variant-attributes')
        this.$btn_add_row_variant_attributes = $('#btn-add-row-variant-attributes')
        this.$modal_variant_attributes = $('#modal-variant-attributes')
        this.$attribute_display_select_by = $('#attribute-display-select-by')
        this.$table_variant_items = $('#table-variant-items')
        this.$add_attribute_display_item = $('#add-attribute-display-item')
        this.$add_variant_des = $('#add-variant-des')
        // attribute tab
        this.$duration_unit = $('#duration-unit')
        this.$btn_select_attribute = $('#btn-select-attribute')
        this.$btn_add_product_attribute = $('#btn-add-product-attribute')
        this.$table_select_attribute = $('#table-select-attribute')
        this.$table_selected_attribute = $('#table-selected-attribute')
    }
}
const pageElements = new ProductPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class ProductPageVariables {
    constructor() {
        this.data_detail = null
        this.data_detail_config = null
        this.current_row_variant_attribute = null
        this.current_row_variant_item = null
        // attribute tab
        this.raw_attribute_list = []
        // account determination tab
        this.account_deter_columns_cfg = [
            {
                className: 'w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                'render': (data, type, row) => {
                    return `<span class="text-muted">${row?.['account_determination_type_convert']}</span>`;
                }
            },
            {
                className: ' w-30',
                'render': (data, type, row) => {
                    return `<h6 class="text-muted fw-bold">${row?.['title']}</h6><h6 class="small text-primary fw-bold">${row?.['foreign_title']}</h6>`;
                }
            },
            {
                className: 'w-20',
                'render': (data, type, row) => {
                    return `<select disabled data-account-mapped='${JSON.stringify(row?.['account_mapped'])}' class="form-select select2 selected-accounts"></select>`;
                }
            },
            {
                className: 'w-35',
                'render': () => {
                    return `<div class="selected-accounts-des"></div>`;
                }
            },
            {
                className: 'text-right w-10',
                'render': (data, type, row) => {
                    let change_btn = `<a class="btn btn-icon btn-flush-primary btn-rounded flush-soft-hover btn-xs btn-change-account">
                       <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i class="fa-solid fa-pen-to-square"></i></span></span>
                    </a>`;
                    let save_btn = `<button type="button" data-id="${row?.['id']}" hidden class="btn btn-custom btn-primary btn-xs btn-save-change-account">
                        <span>
                            <span class="icon"><span class="feather-icon"><i class="fa-solid fa-file-pen"></i></span></span>
                            <span>${$.fn.gettext('Save changes')}</span>
                        </span>
                    </button>`;
                    return row?.['can_change_account'] ? change_btn + save_btn : ''
                }
            },
        ]

        // file
        this.avatarFiles = null;
    }
}
const pageVariables = new ProductPageVariables();

/**
 * Các hàm load page và hàm hỗ trợ
 */
class ProductPageFunction {
    static async LoadPageDataFirst() {
        try {
            // Gọi nhiều AJAX song song
            let [baseUnits] = await Promise.all([
                $.fn.callAjax2({ url: pageElements.$url_script.attr('data-url-unit'), method: 'GET' }),
            ])

            let base_unit_data = $.fn.switcherResp(baseUnits)?.['base_unit_list'] || []

            // chạy các hàm cức năng sử dụng dữ liệu init
            ProductPageFunction.LoadBaseUnit(base_unit_data)
        } catch (error) {
            console.error("Load page data error!!!", error);
        } finally {
            console.log("Load page data done!!!");
        }
    }
    // general tab
    static LoadGeneralProductType(data) {
        pageElements.$general_product_type.initSelect2({
            ajax: {
                url: pageElements.$general_product_type.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_type_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            let selected = SelectDDControl.get_data_from_idx(pageElements.$general_product_type, pageElements.$general_product_type.val())
            let is_service = selected?.['is_service']
            if (is_service) {
                if (pageElements.$check_tab_inventory.prop('checked')) {
                    $.fn.notifyB({description: $.fn.gettext('Inventory tab is not allowed for Service product. Turn off Inventory tab first.')}, 'failure');
                    pageElements.$general_product_type.empty()
                }
                else {
                    pageElements.$check_tab_inventory.prop('checked', false).prop('disabled', true).trigger('change')
                    pageElements.$notify_inventory.prop('hidden', false)
                }
            }
            else {
                pageElements.$check_tab_inventory.prop('disabled', false).trigger('change')
                pageElements.$notify_inventory.prop('hidden', true)
            }
        })
    }
    static LoadGeneralProductCategory(data) {
        pageElements.$general_product_category.initSelect2({
            ajax: {
                url: pageElements.$general_product_category.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_category_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static LoadGeneralUoMGroup(data) {
        pageElements.$general_uom_group.initSelect2({
            ajax: {
                url: pageElements.$general_uom_group.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp].filter(function (item) {
                    return Object.keys(item?.['referenced_unit']).length !== 0 && item?.['code'] !== 'ImportGroup';
                });
            },
            data: (data ? data : null),
            keyResp: 'unit_of_measure_group',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            ProductPageFunction.LoadSaleUom();
            ProductPageFunction.LoadInventoryUom();
            ProductPageFunction.LoadPurchaseUom();
        })
    }
    static LoadGeneralManufacturer(data) {
        pageElements.$general_manufacturer.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$general_manufacturer.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'manufacturer_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static LoadBaseUnit(base_unit_data) {
        for (let i = 0; i < base_unit_data.length; i++) {
            if (base_unit_data[i]?.['title'] === 'volume') {
                $('#VolumeSpan').text(base_unit_data[i]?.['measure'])
                pageElements.$volume.attr('data-id', base_unit_data[i]?.['id'])
            }
            if (base_unit_data[i]?.['title'] === 'weight') {
                $('#WeightSpan').text(base_unit_data[i]?.['measure'])
                pageElements.$weight.attr('data-id', base_unit_data[i]?.['id'])
            }
        }
    }
    static LoadRepresentativeForPMProduct(data) {
        pageElements.$representative_product.initSelect2({
            allowClear: true,
            data: data,
            ajax: {
                data: {},
                url: pageElements.$representative_product.attr('data-url'),
                method: 'GET',
            },
            templateResult: function(data) {
                return $(`<span class="badge badge-light badge-sm">${data.data?.['code']}</span><br><span>${data.data?.['title']}</span>`);
            },
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static LoadCopyProductFrom(data) {
        $('#copy-config-product-space').prop('hidden', false)
        ProductPageFunction.LoadProductConfigContent()
        pageElements.$copy_config_from_product.initSelect2({
            allowClear: true,
            data: data,
            ajax: {
                data: {},
                url: pageElements.$copy_config_from_product.attr('data-url'),
                method: 'GET',
            },
            templateResult: function(data) {
                return $(`<span class="badge badge-light badge-sm">${data.data?.['code']}</span><br><span>${data.data?.['title']}</span>`);
            },
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            if ($(this).val()) {
                let ajax_detail_prd = $.fn.callAjax2({
                        url: pageElements.$datatable_config_content.attr('data-url').replace('/0', `/${$(this).val()}`),
                        data: {},
                        method: 'GET'
                    }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('product')) {
                            return data?.['product'];
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )

                Promise.all([ajax_detail_prd]).then(
                    (results) => {
                        if (results.length === 1) {
                            pageVariables.data_detail_config = results[0]

                            let data_list = []
                            let product_detail = pageVariables.data_detail_config

                            if (Object.keys(product_detail?.['general_information']).length !== 0) {
                                let general_information = product_detail?.['general_information'];
                                data_list.push({
                                    'content': $.fn.gettext('Product type'),
                                    'value': general_information['general_product_types_mapped'][0]?.['title'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Product category'),
                                    'value': general_information['product_category']?.['title'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('UOM group'),
                                    'value': general_information['uom_group']?.['title'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Manufacturer'),
                                    'value': general_information['general_manufacturer']?.['title'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Traceability method'),
                                    'value': general_information['traceability_method'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Standard price'),
                                    'value': general_information['standard_price'] || 0,
                                    'type': 'currency'
                                })
                                if (Object.keys(general_information['product_size']).length !== 0) {
                                    data_list.push({
                                        'content': $.fn.gettext('Product size'),
                                        'value': `${general_information['product_size']['length'] || 0} x ${general_information['product_size']['width'] || 0} x ${general_information['product_size']['height'] || 0} = ${general_information['product_size']['weight']['value'] || 0} (V = ${general_information['product_size']['volume']['value'] || 0})`
                                    })
                                }
                            }
                            if (Object.keys(product_detail?.['sale_information']).length !== 0) {
                                let sale_information = product_detail?.['sale_information'];
                                data_list.push({
                                    'content': $.fn.gettext('Sale UOM'),
                                    'value': sale_information['default_uom']?.['title'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Sale tax'),
                                    'value': sale_information['tax']?.['code'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Price list'),
                                    'value': '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Sale online price list'),
                                    'value': sale_information['price_list_for_online_sale']?.['title'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Public website'),
                                    'value': product_detail?.['is_public_website'] ? $.fn.gettext('Yes') : $.fn.gettext('No')
                                })
                                if (sale_information?.['available_notify']) {
                                    data_list.push({
                                        'content': $.fn.gettext('Notify when available quantity less than'),
                                        'value': sale_information?.['available_notify_quantity'] || '--'
                                    })
                                }
                            }
                            if (Object.keys(product_detail?.['inventory_information']).length !== 0) {
                                let inventory_information = product_detail?.['inventory_information'];
                                data_list.push({
                                    'content': $.fn.gettext('Inventory UOM'),
                                    'value': inventory_information['uom']?.['title'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Inventory level min'),
                                    'value': inventory_information['inventory_level_min'] || 0
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Inventory level max'),
                                    'value': inventory_information['inventory_level_max'] || 0
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Valuation method'),
                                    'value': inventory_information['valuation_method'] || '--'
                                })
                            }
                            if (Object.keys(product_detail?.['purchase_information']).length !== 0) {
                                let purchase_information = product_detail?.['purchase_information'];
                                data_list.push({
                                    'content': $.fn.gettext('Purchase UOM'),
                                    'value': purchase_information['default_uom']?.['title'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Purchase tax'),
                                    'value': purchase_information['tax']?.['code'] || '--'
                                })
                                data_list.push({
                                    'content': $.fn.gettext('Purchase supplied by'),
                                    'value': product_detail?.['purchase_information']?.['supplied_by'] || '--'
                                })
                            }
                            ProductPageFunction.LoadProductConfigContent(data_list)
                        }
                    }
                )
            }
            else {
                ProductPageFunction.LoadProductConfigContent()
            }
        })
    }
    static LoadProductConfigContent(data_list=[]) {
        pageElements.$datatable_config_content.DataTable().clear().destroy();
        pageElements.$datatable_config_content.DataTableDefault({
            dom: 't',
            paging: false,
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '55vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-10 text-center',
                    render: (data, type, row) => {
                        return `<div class="form-check">
                            <input type="checkbox" name="content-select" checked disabled class="form-check-input content-select">
                        </div>`;
                    }
                },
                {
                    className: 'w-40',
                    render: (data, type, row) => {
                        return `<span class="config-content">${row?.['content']}</span>`
                    }
                },
                {
                    className: 'w-45',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'currency') {
                            return `<span class="config-value mask-money" data-init-money="${row?.['value']}"></span>`;
                        }
                        return `<span class="config-value">${row?.['value']}</span>`;
                    }
                },
            ]
        });
    }
    // sale tab
    static LoadSaleUom(data) {
        pageElements.$sale_uom.empty()
        pageElements.$sale_uom.initSelect2({
            ajax: {
                url: pageElements.$sale_uom.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let result = [];
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    if (resp.data[keyResp][i].group.id === pageElements.$general_uom_group.val()) {
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
    static LoadSaleTax(data) {
        pageElements.$sale_tax.initSelect2({
            ajax: {
                url: pageElements.$sale_tax.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'tax_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static LoadSalePriceListForSaleOnline(data, filter = []) {
        pageElements.$price_list_for_sale_online.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$price_list_for_sale_online.attr('data-url'),
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
    static LoadPriceListTable(price_list_from_detail=[], option) {
        let disabled_all_input = option === 'detail' ? 'disabled readonly' : ''
        pageElements.$table_price_list.DataTable().clear().destroy()
        pageElements.$table_price_list.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '59vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: pageElements.$table_price_list.attr('data-url'),
                type: pageElements.$table_price_list.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let price_list_data = []
                        let resp_price_list = resp.data['price_list'] ? resp.data['price_list'] : []
                        let general_price_list_id = null;
                        for (let i = 0; i < resp_price_list.length; i++) {
                            let item = resp_price_list[i];
                            let price_value = price_list_from_detail.find(obj => obj.id === item?.['id'])?.price || '';
                            let checked = '';
                            let disabled = '';
                            let disabled_input = 'disabled';
                            let is_default = false;
                            if (item.is_default) {
                                general_price_list_id = item.id
                                disabled_input = ''
                                is_default = true;
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
                                'id': item?.['id'],
                                'title': item?.['title'],
                                'price_value': price_value,
                                'price_list_mapped': item?.['price_list_mapped'],
                                'valid_time_start': moment(item?.['valid_time_start'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'),
                                'valid_time_end': is_default ? '--' : moment(item?.['valid_time_end'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'),
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
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                }, {
                    className: 'w-5 text-center',
                    render: (data, type, row) => {
                        return `<div class="form-check"><input ${disabled_all_input} ${row.hidden} class="select_price_list form-check-input" type="checkbox" data-id="${row.id}" ${row.checked} ${row.disabled}><label class="form-check-label" for="select_price_list"></label></div>`
                    }
                }, {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<label class="form-label text-primary">${row.title}</label>`
                    }
                }, {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['valid_time_start']}</span>`
                    }
                }, {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span>${row?.['valid_time_end']}</span>`
                    }
                }, {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<input ${disabled_all_input} value="${row.price_value}" data-is-default="${row.is_default}" ${row.disabled_input} data-source="${row?.['price_list_mapped']}" data-auto-update="${row.auto_update}" data-factor="${row.factor}" data-id="${row.id}" data-return-type="number" type="text" class="form-control text-primary mask-money input_price_list">`
                    }
                }
            ],
        });
    }
    static LoadPriceForChild(element_id, element_value) {
        $('.ul-price-list').find('.input_price_list').each(function () {
            if ($(this).attr('data-source') === element_id && $(this).attr('data-auto-update') === 'true' && $(this).attr('data-is-default') === 'false') {
                let value = parseFloat(element_value) * parseFloat($(this).attr('data-factor'));
                $(this).attr('value', value);
                ProductPageFunction.LoadPriceForChild($(this).attr('data-id'), value);
            }
        })
        $.fn.initMaskMoney2();
    }
    // inventory tab
    static LoadInventoryUom(data) {
        pageElements.$inventory_uom.empty()
        pageElements.$inventory_uom.initSelect2({
            ajax: {
                url: pageElements.$inventory_uom.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let result = [];
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    if (resp.data[keyResp][i].group.id === pageElements.$general_uom_group.val()) {
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
    static LoadSpecificSerialNumberList(data_list=[]) {
        $('#specific-modal-btn').prop('hidden', data_list.length === 0)
        pageElements.$datatable_specific_serial_number_list.DataTable().clear().destroy()
        pageElements.$datatable_specific_serial_number_list.DataTableDefault({
            dom: 't',
            paging: false,
            rowIdx: true,
            reloadCurrency: true,
            scrollY: '55vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span>${row?.['vendor_serial_number'] || ''}</span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span>${row?.['serial_number']}</span>`
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['specific_value'] || 0}"></span>`;
                    }
                },
                {
                    className: 'w-20 text-center',
                    render: (data, type, row) => {
                        return row?.['serial_status'] ? `<span class="text-secondary">${$.fn.gettext('Not available')}</span>` : `<span class="text-success">${$.fn.gettext('Available')}</span>`;
                    }
                },
                {
                    className: 'w-15 text-center',
                    render: (data, type, row) => {
                        return row?.['from_pm'] ? `<span class="text-muted">${row?.['product_modification_code'] || ''}</span>` : `${$.fn.gettext('Receipt')}`;
                    }
                },
            ]
        });
    }
    static LoadWareHouseListDetail(data_list=[]) {
        pageElements.$datatable_warehouse_list.DataTable().clear().destroy()
        pageElements.$datatable_warehouse_list.DataTableDefault({
            dom: 't',
            paging: false,
            data: data_list,
            columns: [
                {
                    className: 'w-70',
                    render: (data, type, row) => {
                        return `<span class="badge badge-blue badge-sm table-row-code mr-1" data-id="${row?.['warehouse']?.['id']}">${row?.['warehouse']?.['code']}</span><span>${row?.['warehouse']?.['title']}</span>`
                    }
                },
                {
                    className: 'w-30',
                    render: (data, type, row) => {
                        return `<span class="fw-bold">${row?.['stock_amount']}</span>`;
                    }
                },
            ]
        });
    }
    static LoadWareHouseOverViewDetail(data_list=[]) {
        pageElements.$datatable_warehouse_overview.DataTable().clear().destroy();
        pageElements.$datatable_warehouse_overview.DataTableDefault({
            dom: 't',
            paging: false,
            scrollX: true,
            scrollY: '59vh',
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    data: 'sum_stock',
                    className: 'text-center w-20',
                    render: (data, type, row) => {
                        let sum_stock = row?.['sum_stock'] ? row?.['sum_stock'] : 0
                        return `<span class="fw-bold ${sum_stock > 0 ? 'text-primary' : 'text-danger'}">${sum_stock}</span>`
                    }
                },
                {
                    data: 'sum_wait_for_delivery',
                    className: 'text-center w-20',
                    render: (data, type, row) => {
                        let sum_wait_for_delivery = row?.['sum_wait_for_delivery'] ? row?.['sum_wait_for_delivery'] : 0
                        return `<span class="fw-bold ${sum_wait_for_delivery > 0 ? 'text-primary' : 'text-danger'}">${sum_wait_for_delivery}</span>`
                    }
                },
                {
                    data: 'sum_wait_for_receipt',
                    className: 'text-center w-20',
                    render: (data, type, row) => {
                        let sum_wait_for_receipt = row?.['sum_wait_for_receipt'] ? row?.['sum_wait_for_receipt'] : 0
                        return `<span class="fw-bold ${sum_wait_for_receipt > 0 ? 'text-primary' : 'text-danger'}">${sum_wait_for_receipt}</span>`
                    }
                },
                {
                    data: 'production_amount',
                    className: 'text-center w-20',
                    render: (data, type, row) => {
                        let production_amount = row?.['sum_production'] ? row?.['sum_production'] : 0
                        return `<span class="fw-bold ${production_amount > 0 ? 'text-primary' : 'text-danger'}">${production_amount}</span>`
                    }
                },
                {
                    data: 'sum_available_value',
                    className: 'text-center w-20',
                    render: (data, type, row) => {
                        let sum_available_value = row?.['sum_available_value'] ? row?.['sum_available_value'] : 0
                        return `<span class="fw-bold ${sum_available_value > 0 ? 'text-primary' : 'text-danger'}">${sum_available_value}</span>`
                    }
                },
            ],
        });
    }
    // purchase tab
    static LoadPurchaseUom(data) {
        pageElements.$purchase_uom.empty()
        pageElements.$purchase_uom.initSelect2({
            ajax: {
                url: pageElements.$purchase_uom.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let result = [];
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    if (resp.data[keyResp][i].group.id === pageElements.$general_uom_group.val()) {
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
    static LoadPurchaseTax(data) {
        pageElements.$purchase_tax.initSelect2({
            ajax: {
                url: pageElements.$purchase_tax.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'tax_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    // component tab
    static LoadComponentTable(option='create', data_list=[]) {
        pageElements.$component_table.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '62vh',
            scrollX: true,
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-75',
                    'render': (data, type, row) => {
                        return `<input placeholder="${$.fn.gettext('Component name')}" ${option === 'detail' ? 'disabled readonly' : ''} class="form-control form-control-line fw-bold mb-1 component-name" value="${row?.['component_name'] || ''}">
                                <textarea placeholder="${$.fn.gettext('Description')}..." ${option === 'detail' ? 'disabled readonly' : ''} rows="5" class="form-control small component-des">${row?.['component_des'] || ''}</textarea>`;
                    }
                },
                {
                    className: 'w-15',
                    'render': (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} type="number" class="form-control component-quantity" value="${row?.['component_quantity'] || 1}">`;
                    }
                },
                {
                    className: 'text-center w-5',
                    'render': (data, type, row) => {
                        return `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete ${option === 'detail' ? 'disabled' : ''}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                    }
                },
            ]
        });
    }
    // variant tab
    static ReloadModalConfig(option='create', color_data) {
        if (color_data !== '') {
            color_data = JSON.parse(color_data);
        }

        pageElements.$attribute_display_select_by.html('');
        pageElements.$attribute_display_select_by.initSelect2();
        pageElements.$attribute_display_select_by.append(`
            <option></option>
            <option value="0">Dropdown list</option>
            <option value="1">Radio select</option>
            <option value="2">Select</option>
        `);

        let variants_value_list = [];
        pageVariables.current_row_variant_attribute.find('.variant-attributes-span').find('.attribute-value').each(function () {
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
                    <div class="mb-2 pt-2 pb-2 pr-2 pl-2 border rounded border-grey selection-fill-by text-center">
                        <input type="color" id="color-picker-${variants_value_list[i]}" class="form-control form-control-color color-picker-attribute-value" value="${color}" title="Choose your color">
                        <label for="color-picker-${variants_value_list[i]}" class="form-label">${variants_value_list[i]}</label>
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
                    <div class="mb-2 pt-2 pb-2 pr-2 pl-2 border rounded border-grey selection-fill-by text-center">
                        <input type="file" id="photo-picker-${variants_value_list[i]}" class="photo-picker-dropify">
                        <label for="photo-picker-${variants_value_list[i]}" class="form-label">${variants_value_list[i]}</label>
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
            pageElements.$attribute_display_select_by.val(0);
            $('#dropdown-list-selection-preview').attr('hidden', false);
            radio_selection_preview.attr('hidden', true);
            $('#select-selection-preview').attr('hidden', true);
            fill_by_text_preview.attr('hidden', true);
            fill_by_color_preview.attr('hidden', true);
            fill_by_photo_preview.attr('hidden', true);
        }
        if (option === '1') {
            pageElements.$attribute_display_select_by.val(1);
            $('#dropdown-list-selection-preview').attr('hidden', true);
            radio_selection_preview.attr('hidden', false);
            $('#select-selection-preview').attr('hidden', true);
            fill_by_text_preview.attr('hidden', true);
            fill_by_color_preview.attr('hidden', true);
            fill_by_photo_preview.attr('hidden', true);
        }
        if (option === '2') {
            pageElements.$attribute_display_select_by.val(2);
            $('#radio-fill-by-text').prop('checked', true);

            $('#dropdown-list-selection-preview').attr('hidden', true);
            radio_selection_preview.attr('hidden', true);
            $('#select-selection-preview').attr('hidden', false);
            fill_by_text_preview.attr('hidden', false);
            fill_by_color_preview.attr('hidden', true);
            fill_by_photo_preview.attr('hidden', true);
        }
        if (option === '3') {
            pageElements.$attribute_display_select_by.val(2);
            $('#radio-fill-by-color').prop('checked', true);

            $('#dropdown-list-selection-preview').attr('hidden', true);
            radio_selection_preview.attr('hidden', true);
            $('#select-selection-preview').attr('hidden', false);
            fill_by_text_preview.attr('hidden', true);
            fill_by_color_preview.attr('hidden', false);
            fill_by_photo_preview.attr('hidden', true);
        }
        if (option === '4') {
            pageElements.$attribute_display_select_by.val(2);
            $('#radio-fill-by-photo').prop('checked', true);

            $('#dropdown-list-selection-preview').attr('hidden', true);
            radio_selection_preview.attr('hidden', true);
            $('#select-selection-preview').attr('hidden', false);
            fill_by_text_preview.attr('hidden', true);
            fill_by_color_preview.attr('hidden', true);
            fill_by_photo_preview.attr('hidden', false);
        }
    }
    static GenerateCombinations(arrays, current = [], index = 0, result = []) {
        if (index === arrays.length) {
            result.push(current.slice());
        } else {
            for (let i = 0; i < arrays[index].length; i++) {
                current[index] = arrays[index][i];
                ProductPageFunction.GenerateCombinations(arrays, current, index + 1, result);
            }
        }
        return result;
    }
    static RenderVariantItemsTable() {
        let all_row_value_list = [];
        pageElements.$table_variant_attributes.find('tbody tr .variant-attributes-span').each(function (index) {
            $(this).closest('tr').attr('id', 'row-' + (index+1));
            $(this).closest('tr').find('.row-index').text(index+1);
            let value_list = [];
            $(this).find('.attribute-value').each(function () {
                value_list.push($(this).text());
            })
            all_row_value_list.push(value_list);
        })
        let combinations = ProductPageFunction.GenerateCombinations(all_row_value_list);
        pageElements.$table_variant_items.find('tbody').html('');
        $('#table-variant-items-label').text(combinations.length);
        if (combinations.length > 0) {
            $('#table-variant-items-div').prop('hidden', false);
            for (let i = 0; i < combinations.length; i++) {
                let exist_variant = [];
                if (pageVariables.data_detail !== null) {
                    exist_variant = pageVariables.data_detail?.['product_variant_item_list'].filter(function (element) {
                        return JSON.stringify(element?.['variant_value_list'].slice().sort()) === JSON.stringify(combinations[i].slice().sort());
                    })
                }
                let variant_html = ``;
                for (let j = 0; j < combinations[i].length; j++) {
                    variant_html += `<span class="variant-item badge badge-soft-danger badge-outline mr-1 mb-1">${combinations[i][j]}</span>`;
                }
                if (exist_variant.length === 0) {
                    pageElements.$table_variant_items.find('tbody').append(`
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
                    pageElements.$table_variant_items.find('tbody').append(`
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
    static ReloadAttributeValueListSpan() {
        let option = pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value');
        let color_data = pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text()
        ProductPageFunction.ReloadModalConfig(option, color_data);
        let value = pageElements.$attribute_display_select_by.val();
        if (value !== '') {
            if (value === '0') {
                pageVariables.current_row_variant_attribute.find('.config-selection').text('Dropdown list');
                pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value', 0);
                let attribute_value_list = []
                $('#dropdown-list-preview option').each(function() {
                    if ($(this).text() !== '') {
                        attribute_value_list.push({
                            'value': $(this).text(),
                            'color': null
                        })
                    }
                })
                pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list))
            }
            if (value === '1') {
                pageVariables.current_row_variant_attribute.find('.config-selection').text('Radio select');
                pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value', 1);
                let attribute_value_list = []
                $('#radio-selection-preview .radio-attribute-value').each(function() {
                    if ($(this).attr('value') !== '') {
                        attribute_value_list.push({
                            'value': $(this).attr('value'),
                            'color': null
                        })
                    }
                })
                pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
            }
            if (value === '2') {
                let detail_select = ''
                if ($('#radio-fill-by-text').is(':checked')) {
                    pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value', 2);
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
                    pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
                }
                if ($('#radio-fill-by-color').is(':checked')) {
                    pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value', 3);
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
                    pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
                }
                if ($('#radio-fill-by-photo').is(':checked')) {
                    pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value', 4);
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
                    pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
                }
                pageVariables.current_row_variant_attribute.find('.config-selection').text(`Select ${detail_select}`);
            }
        }
    }
    // attribute tab
    static LoadDurationUnit(data) {
        pageElements.$duration_unit.empty()
        pageElements.$duration_unit.initSelect2({
            ajax: {
                url: pageElements.$duration_unit.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let result = [];
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    if (resp.data[keyResp][i].group.id === pageElements.$general_uom_group.val()) {
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
    static RemoveChildRow($table, parentId) {
        $table.find(`tr[data-parent-id="${parentId}"]`).each(function (index, ele) {
            let childId = $(ele).find('.btn-child-collapse').attr('data-id');
            if (childId) {
                ProductPageFunction.RemoveChildRow($table, childId);
            }
            $(ele).remove();
        });
    }
    static LoadSelectAttributeTable() {
        pageVariables.raw_attribute_list = []
        pageElements.$table_select_attribute.DataTable().clear().destroy()
        pageElements.$table_select_attribute.DataTableDefault({
            dom: 't',
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollY: '62vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: pageElements.$table_select_attribute.attr('data-url'),
                type: pageElements.$table_select_attribute.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('attribute_list')) {
                        pageVariables.raw_attribute_list = data?.['attribute_list']
                        return data?.['attribute_list'].filter(item => item?.['is_category'] === true && Object.keys(item?.['parent_n']).length === 0);
                    }
                    return [];
                }
            },
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-5',
                    'render': (data, type, row) => {
                        return `<div class="form-check">
                                    <input type="checkbox" data-id="${row?.['id']}" class="form-check-input selected-attribute-category">
                                </div>`;
                    }
                },
                {
                    className: 'w-85',
                    'render': (data, type, row) => {
                        return `<span><i class="bi bi-box-seam"></i> ${row?.['title']}</span>`;
                    }
                },
                {
                    className: 'w-5 text-right',
                    'render': (data, type, row) => {
                        let list_item = JSON.stringify(row?.['price_config_data']?.['list_item'] || [])
                        return `<button type="button"
                                        class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs btn-child-collapse btn-show-child-attribute"
                                        data-level="0"
                                        data-id="${row?.['id']}"
                                        data-list-item='${list_item}'
                                        data-is-show="0"
                                        >
                                    <span class="icon">
                                        <i class="bi bi-caret-down-fill"></i>
                                    </span>
                                </button>`;
                    }
                },
            ]
        });
    }
    static LoadSelectedAttributeTable(data_list=[], selected_id_list=[]) {
        pageElements.$table_selected_attribute.DataTable().clear().destroy()
        if (selected_id_list.length !== 0) {
            pageElements.$table_selected_attribute.DataTableDefault({
                dom: 't',
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                scrollY: '52vh',
                scrollX: true,
                scrollCollapse: true,
                ajax: {
                    url: pageElements.$table_select_attribute.attr('data-url'),
                    type: pageElements.$table_select_attribute.attr('data-method'),
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('attribute_list')) {
                            // vẫn gán pageVariables.raw_attribute_list để collapse
                            pageVariables.raw_attribute_list = data?.['attribute_list'].filter(item => item?.['is_inventory'] === pageElements.$check_tab_inventory.is(':checked'))
                            // nhưng hiển thị theo data detail nên sử dụng data?.['attribute_list']
                            return data?.['attribute_list'].filter(item => selected_id_list.includes(item?.['id']))
                        }
                        return [];
                    }
                },
                columns: [
                    {
                        className: 'w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-90',
                        'render': (data, type, row) => {
                            return `<span class="selected-attribute" data-id="${row?.['id']}">${row?.['title']}</span>`;
                        }
                    },
                    {
                        className: 'w-5 text-right',
                        'render': (data, type, row) => {
                            let list_item = JSON.stringify(row?.['price_config_data']?.['list_item'] || [])
                            return `<button type="button"
                                            class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs btn-child-collapse btn-show-child-selected-attribute"
                                            data-level="0" 
                                            data-id="${row?.['id']}"
                                            data-list-item='${list_item}'
                                            data-is-show="0"
                                            >
                                        <span class="icon">
                                            <i class="bi bi-caret-down-fill"></i>
                                        </span>
                                    </button>`;
                        }
                    },
                ]
            });
        }
        else {
            pageElements.$table_selected_attribute.DataTableDefault({
                dom: 't',
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                scrollY: '52vh',
                scrollX: true,
                scrollCollapse: true,
                data: data_list,
                columns: [
                    {
                        className: 'w-5',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-90',
                        'render': (data, type, row) => {
                            return `<span class="selected-attribute" data-id="${row?.['id']}">${row?.['title']}</span>`;
                        }
                    },
                    {
                        className: 'w-5 text-right',
                        'render': (data, type, row) => {
                            let list_item = JSON.stringify(row?.['price_config_data']?.['list_item'] || [])
                            return `<button type="button"
                                            class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs btn-child-collapse btn-show-child-selected-attribute"
                                            data-level="0" 
                                            data-id="${row?.['id']}"
                                            data-list-item='${list_item}'
                                            data-is-show="0"
                                            >
                                        <span class="icon">
                                            <i class="bi bi-caret-down-fill"></i>
                                        </span>
                                    </button>`;
                        }
                    },
                ]
            });
        }
    }
    // init upload image ele
    static initImgUpload(data) {
        let $avatarEle = $('#avatar-img-input');
        if (data?.['avatar_img']) {
            $avatarEle.attr('data-default-file', data?.['avatar_img'])
        }
        $avatarEle.dropify({
            messages: {
                'default': '',
            }
        })
        $avatarEle.on('change', function (event) {
            pageVariables.avatarFiles = event.target.files[0];
            console.log('avatarFiles:', pageVariables.avatarFiles);
        })
        $avatarEle.fadeIn();
    }
    static loadImgDetail(data) {
        let avatarEle = $('#avatar-img-input');
        if (data?.['avatar_img']) {
            $(`
                    <img src="${data?.['avatar_img']}" style="width: 50%; height: 50%; object-fit: cover;"/>
                `).insertAfter(avatarEle);
        }
        avatarEle.remove();
    }
}

/**
 * Khai báo các hàm chính
 */
class ProductHandler {
    static GetDataForm() {
        let data = {
            'code': pageElements.$code.val(),
            'title': pageElements.$title.val(),
            'description': pageElements.$description.val()
        };
        data['product_choice'] = []

        data['part_number'] = pageElements.$part_number.val();

        data['length'] = parseFloat(pageElements.$length.val());
        data['width'] = parseFloat(pageElements.$width.val());
        data['height'] = parseFloat(pageElements.$height.val());
        data['volume'] = parseFloat(pageElements.$volume.val());
        data['weight'] = parseFloat(pageElements.$weight.val());

        if (isNaN(data['length']) && pageElements.$length.val() !== '') {
            $.fn.notifyB({description: 'Length values in General tab is not valid'}, 'failure');
            return false
        }
        if (isNaN(data['width']) && pageElements.$width.val() !== '') {
            $.fn.notifyB({description: 'Width values in General tab is not valid'}, 'failure');
            return false
        }
        if (isNaN(data['height']) && pageElements.$height.val() !== '') {
            $.fn.notifyB({description: 'Height values in General tab is not valid'}, 'failure');
            return false
        }
        if (isNaN(data['weight']) && pageElements.$weight.val() !== '') {
            $.fn.notifyB({description: 'Weight values in General tab is not valid'}, 'failure');
            return false
        }

        data['volume_id'] = pageElements.$volume.attr('data-id');
        data['weight_id'] = pageElements.$weight.attr('data-id');
        data['product_types_mapped_list'] = pageElements.$general_product_type.val() ? [pageElements.$general_product_type.val()] : [];
        data['general_product_category'] = pageElements.$general_product_category.val() || null;
        data['general_uom_group'] = pageElements.$general_uom_group.val() || null;
        data['general_manufacturer'] = pageElements.$general_manufacturer.val() || null;
        data['general_traceability_method'] = $('#general-traceability-method').val();
        data['standard_price'] = pageElements.$general_standard_price.attr('value')
        data['representative_product'] = pageElements.$representative_product.val() || null

        let component_create_valid = true;
        let component_list_data = []
        pageElements.$component_table.find('tbody tr').each(function (index) {
            let row = $(this);
            let component_name = row.find('.component-name').val()
            let component_des = row.find('.component-des').val()
            let component_quantity = row.find('.component-quantity').val()

            if (component_name !== '' && parseFloat(component_quantity) > 0) {
                component_list_data.push({
                    'order': index + 1,
                    'component_name': component_name,
                    'component_des': component_des,
                    'component_quantity': component_quantity
                })
            } else {
                if (!row.find('.dataTables_empty')) {
                    $.fn.notifyB({description: 'Component Table is missing data (Row ' + (index + 1) + ')'}, 'failure');
                    component_create_valid = false;
                }
            }
        })
        if (!component_create_valid) {
            return false;
        }
        data['component_list_data'] = component_list_data

        data['duration_unit'] = pageElements.$check_tab_inventory.is(':checked') ? null : pageElements.$duration_unit.val() || null

        let attribute_list_data = []
        pageElements.$table_selected_attribute.find('tbody tr .selected-attribute').each(function (index, ele) {
            attribute_list_data.push($(ele).attr('data-id'))
        })
        data['attribute_list_data'] = attribute_list_data

        let variant_attribute_create_valid = true;
        let variant_item_create_valid = true;
        data['product_variant_attribute_list'] = [];
        data['product_variant_item_list'] = [];

        if (pageElements.$table_variant_attributes.find('tbody tr').length > 0) {
            pageElements.$table_variant_attributes.find('tbody tr').each(function (index) {
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

            pageElements.$table_variant_items.find('tbody tr').each(function (index) {
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
                    variant_name = pageElements.$title.val() + ' (' + variant_name_content.join(', ') + ')';
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

            if (!variant_attribute_create_valid || !variant_item_create_valid) {
                return false;
            }

            if (pageElements.$table_variant_attributes.find('tbody tr').length !== data['product_variant_attribute_list'].length || pageElements.$table_variant_items.find('tbody tr').length !== data['product_variant_item_list'].length) {
                $.fn.notifyB({description: 'Variant Tables is invalid'}, 'failure');
                return false;
            }
        }

        if (pageElements.$check_tab_sale.is(':checked') === true) {
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
            data['sale_default_uom'] = $('#sale-uom').val() || null;
            data['sale_tax'] = $('#sale-tax').val() || null;
            data['sale_price_list'] = sale_product_price_list;

            data['is_public_website'] = pageElements.$is_publish_website.prop('checked');
            if (pageElements.$is_publish_website.prop('checked')) {
                data['online_price_list'] = pageElements.$price_list_for_sale_online.val();
            }
            data['available_notify'] = pageElements.$available_notify_checkbox.prop('checked');
            data['available_notify_quantity'] = parseFloat(pageElements.$less_than_number.val());
        } else {
            data['sale_default_uom'] = null;
            data['sale_tax'] = null;
            data['sale_price_list'] = [];
        }

        if (pageElements.$check_tab_inventory.is(':checked') === true) {
            data['product_choice'].push(1)
            data['inventory_uom'] = $('#inventory-uom').val() || null;
            data['inventory_level_min'] = parseFloat(pageElements.$inventory_level_min.val());
            data['inventory_level_max'] = parseFloat(pageElements.$inventory_level_max.val());
            data['valuation_method'] = pageElements.$valuation_method.val()
        } else {
            data['inventory_uom'] = null;
            data['inventory_level_min'] = null;
            data['inventory_level_max'] = null;
        }

        if (pageElements.$check_tab_purchase.is(':checked') === true) {
            data['product_choice'].push(2)
            data['purchase_default_uom'] = $('#purchase-uom').val() || null;
            data['purchase_tax'] = $('#purchase-tax').val() || null;
            data['supplied_by'] = pageElements.$purchase_supplied_by.val();
        } else {
            data['purchase_default_uom'] = null
            data['purchase_tax'] = null
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
            if (!data['sale_default_uom'] || !data['sale_tax']) {
                $.fn.notifyB({description: 'Some fields in Sale tab is missing'}, 'failure');
                return false
            }
        }

        if (data['product_choice'].includes(1)) {
            // if (pageElements.$length.val() === '' || pageElements.$width.val() === '' || pageElements.$height.val() === '' || pageElements.$volume.val() === '' || pageElements.$weight.val() === '') {
            //     $.fn.notifyB({description: 'Tab inventory is selected, product size must not null'}, 'failure');
            //     return false
            // }

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
    static CombinesData(frmEle, for_update = false) {
        let dataForm = ProductHandler.GetDataForm();
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
    static LoadDetailProduct(option) {
        let pk = $.fn.getPkDetail()
        $.fn.callAjax($('#form-update-product').data('url').format_url_with_uuid(pk), 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let product_detail = data['product'];
                    pageVariables.data_detail = product_detail;
                    $('#data-detail-page').val(JSON.stringify(product_detail));

                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(product_detail);

                    // console.log(product_detail)
                    $('#copy-config-product-space').remove()
                    $('#modal-copy-config-product').remove()

                    pageElements.$code.val(product_detail?.['code']).prop('disabled', true).prop('readonly', true).addClass('form-control-line fw-bold text-primary')
                    pageElements.$title.val(product_detail?.['title'])
                    pageElements.$description.val(product_detail?.['description'])
                    pageElements.$part_number.val(product_detail?.['part_number'])

                    if (product_detail?.['product_choice'].includes(0)) {
                        $('#check-tab-sale').attr('checked', true);
                        $('#link-tab-sale').removeClass('disabled');
                        $('#tab_sale').find('.row').prop('hidden', false)
                    }

                    if (product_detail?.['product_choice'].includes(1)) {
                        $('#check-tab-inventory').attr('checked', true);
                        $('#link-tab-inventory').removeClass('disabled');
                        $('#tab_inventory').find('.row').prop('hidden', false)
                        pageElements.$duration_unit.prop('disabled', true)
                    }

                    if (product_detail?.['product_choice'].includes(2)) {
                        $('#check-tab-purchase').attr('checked', true);
                        $('#link-tab-purchase').removeClass('disabled');
                        $('#tab_purchase').find('.row').prop('hidden', false)
                    }

                    if (Object.keys(product_detail?.['general_information']).length !== 0) {
                        let general_information = product_detail?.['general_information'];
                        ProductPageFunction.LoadGeneralProductType(general_information['general_product_types_mapped'][0]);
                        pageElements.$general_product_type.trigger('change');
                        ProductPageFunction.LoadGeneralProductCategory(general_information['product_category']);
                        ProductPageFunction.LoadGeneralUoMGroup(general_information['uom_group']);
                        ProductPageFunction.LoadGeneralManufacturer(general_information['general_manufacturer']);
                        pageElements.$general_traceability_method.val(general_information['traceability_method'])
                        pageElements.$general_standard_price.attr('value', general_information['standard_price'])
                        if (Object.keys(general_information['product_size']).length !== 0) {
                            pageElements.$length.val(general_information['product_size']['length']);
                            pageElements.$width.val(general_information['product_size']['width']);
                            pageElements.$height.val(general_information['product_size']['height']);
                            pageElements.$volume.val(general_information['product_size']['volume']['value']);
                            pageElements.$weight.val(general_information['product_size']['weight']['value']);
                        }
                        ProductPageFunction.LoadRepresentativeForPMProduct(general_information?.['representative_product'])
                    }

                    if (Object.keys(product_detail?.['sale_information']).length !== 0) {
                        let sale_information = product_detail?.['sale_information'];
                        ProductPageFunction.LoadSaleUom(sale_information['default_uom']);
                        ProductPageFunction.LoadSaleTax(sale_information['tax']);

                        let price_list_filter = []
                        for (let i = 0; i < sale_information['sale_product_price_list'].length; i++) {
                            let item = sale_information['sale_product_price_list'][i];
                            price_list_filter.push(item.id)
                        }

                        ProductPageFunction.LoadPriceListTable(sale_information['sale_product_price_list'] || [], option);

                        ProductPageFunction.LoadSalePriceListForSaleOnline(sale_information['price_list_for_online_sale'], price_list_filter)

                        pageElements.$is_publish_website.prop('checked', product_detail?.['is_public_website'])
                        pageElements.$price_list_for_sale_online.prop('disabled', !product_detail?.['is_public_website'])

                        pageElements.$available_notify_checkbox.prop('checked', sale_information?.['available_notify']);
                        if (sale_information?.['available_notify']) {
                            pageElements.$less_than_number.prop('disabled', false).val(sale_information?.['available_notify_quantity']);
                        }
                        else {
                            pageElements.$less_than_number.prop('disabled', true).val('')
                        }
                        $.fn.initMaskMoney2();
                    }

                    if (Object.keys(product_detail?.['inventory_information']).length !== 0) {
                        let inventory_information = product_detail?.['inventory_information'];
                        ProductPageFunction.LoadInventoryUom(inventory_information['uom']);
                        pageElements.$inventory_level_min.val(inventory_information['inventory_level_min']);
                        pageElements.$inventory_level_max.val(inventory_information['inventory_level_max']);
                        pageElements.$valuation_method.val(inventory_information['valuation_method'])

                        ProductPageFunction.LoadWareHouseListDetail(product_detail?.['product_warehouse_detail']);
                        let data_overview = [];
                        let sum_stock = product_detail?.['stock_amount'] ? product_detail?.['stock_amount'] : 0;
                        let sum_wait_for_delivery = product_detail?.['wait_delivery_amount'] ? product_detail?.['wait_delivery_amount'] : 0;
                        let sum_wait_for_receipt = product_detail?.['wait_receipt_amount'] ? product_detail?.['wait_receipt_amount'] : 0;
                        let sum_production = product_detail?.['production_amount'] ? product_detail?.['production_amount'] : 0;
                        let sum_available_value = product_detail?.['available_amount'] ? product_detail?.['available_amount'] : 0;
                        data_overview.push({
                            'sum_stock': sum_stock,
                            'sum_wait_for_delivery': sum_wait_for_delivery,
                            'sum_wait_for_receipt': sum_wait_for_receipt,
                            'sum_production': sum_production,
                            'sum_available_value': sum_available_value
                        })
                        ProductPageFunction.LoadWareHouseOverViewDetail(data_overview);

                        ProductPageFunction.LoadSpecificSerialNumberList(inventory_information?.['data_specific_serial_number'] || [])
                    }

                    if (Object.keys(product_detail?.['purchase_information']).length !== 0) {
                        let purchase_information = product_detail?.['purchase_information'];
                        ProductPageFunction.LoadPurchaseUom(purchase_information['default_uom']);
                        ProductPageFunction.LoadPurchaseTax(purchase_information['tax']);
                        pageElements.$purchase_supplied_by.val(product_detail?.['purchase_information']?.['supplied_by'])
                    }

                    ProductPageFunction.LoadComponentTable(option, product_detail?.['component_list_data'] || [])

                    ProductPageFunction.LoadDurationUnit(product_detail?.['duration_unit_data'] || {})

                    ProductPageFunction.LoadSelectedAttributeTable([], product_detail?.['attribute_list_data'] || [])

                    let readonly = '';
                    let disabled = '';
                    if (option === 'detail') {
                        readonly = 'readonly';
                        disabled = 'disabled';
                    }

                    for (let i = 0; i < product_detail?.['product_variant_attribute_list'].length; i++) {
                         let item = product_detail?.['product_variant_attribute_list'][i];
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
                         pageElements.$table_variant_attributes.find('tbody').append(`<tr id="row-${i + 1}" data-variant-attribute-id="${item.id}">
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

                    $('#table-variant-items-label').text(product_detail?.['product_variant_item_list'].length);

                    let data_list = []
                    for (let i = 0; i < product_detail?.['product_variant_item_list'].length; i++) {
                        let item = product_detail?.['product_variant_item_list'][i];
                        let variant_html = ``;
                        for (let j = 0; j < item?.['variant_value_list'].length; j++) {
                            variant_html += `<span class="variant-item badge badge-soft-danger badge-outline mr-1 mb-1">${item?.['variant_value_list'][j]}</span>`;
                        }
                        data_list.push({
                                'index': i + 1,
                                'id': item?.['id'],
                                'html': variant_html,
                                'variant_name': item?.['variant_name'],
                                'variant_des': item?.['variant_des'],
                                'variant_SKU': item?.['variant_SKU'],
                                'variant_extra_price': item?.['variant_extra_price'],
                                'is_activate': item?.['is_active'] ? 'checked' : ''
                        })
                     // pageElements.$table_variant_items.find('tbody').append(`
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
                    pageElements.$table_variant_items.DataTableDefault({
                        dom: "<'d-flex dtb-header-toolbar'<'btnAddFilter'><'textFilter overflow-hidden'>f<'util-btn'>><'row manualFilter hidden'>rt",
                        reloadCurrency: true,
                        paging: false,
                        scrollX: true,
                        scrollY: '62vh',
                        scrollCollapse: true,
                        data: data_list ? data_list : [],
                        columns: [
                         {
                            data: '',
                            className: 'text-center w-5',
                            render: (data, type, row) => {
                                return row.index;
                            }
                        },
                         {
                            data: '',
                            className: 'w-40',
                            render: (data, type, row) => {
                                return row.html;
                            }
                        },
                         {
                            data: '',
                                render: (data, type, row) => {
                                return `<button type="button" data-bs-toggle="modal" data-bs-target="#modal-variant-item-des" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs add-variant-item-des"><span class="icon"><i class="fas fa-ellipsis-v"></i></span></button>
                                 <span hidden class="variant-name-span">${row.variant_name}</span>
                                 <span hidden class="variant-des-span">${row.variant_des}</span>`
                            }
                        },
                         {
                            data: '',
                            className: 'w-20',
                            render: (data, type, row) => {
                                return `<input class="form-control SKU-input" ${readonly} value="${row.variant_SKU}">`;
                            }
                        },
                         {
                            data: '',
                            className: 'w-25',
                            render: (data, type, row) => {
                                return `<input data-return-type="number" type="text" ${readonly} class="form-control mask-money extra-price-input" value="${row.variant_extra_price}">`;
                            }
                        },
                         {
                            data: '',
                            className: 'text-center w-10',
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

                    if (product_detail?.['product_variant_item_list'].length > 0) {
                     $('#table-variant-items-div').prop('hidden', false);
                    }

                    $.fn.initMaskMoney2();

                    UsualLoadPageFunction.DisablePage(
                        option==='detail',
                        ['.btn-show-child-selected-attribute', '#specific-modal-btn']
                    )

                    // init and load avatar img
                    if (option === 'detail') {
                        ProductPageFunction.loadImgDetail(product_detail);
                    }
                    if (option === 'update') {
                        ProductPageFunction.initImgUpload(product_detail);
                    }
                }
            })
    }
}

/**
 * Khai báo các Event
 */
class ProductEventHandler {
    static InitPageEven() {
        pageElements.$product_image.dropify({
            messages: {
                'default': '',
            },
            tpl: {
                message: '<div class="dropify-message">' +
                    '<span class="file-icon"></span>' +
                    '<h5>{{ default }}</h5>' +
                    '</div>',
            }
        })
        // general
        $('#to-fix-left').on('click', function () {
            let now = pageElements.$volume.val().split('.')[1].length
            if (now - 1 > 0) {
                pageElements.$volume.val(parseFloat(pageElements.$volume.val()).toFixed(now - 1))
            }
        })
        $('#to-fix-right').on('click', function () {
            let now = pageElements.$volume.val().split('.')[1].length
            if (now < 5) {
                let length = pageElements.$length.val();
                let width = pageElements.$width.val();
                let height = pageElements.$height.val();
                let volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
                pageElements.$volume.val(volume.toFixed(now + 1))
            }
        })
        pageElements.$length.on("change", function () {
            let length = pageElements.$length.val();
            let width = pageElements.$width.val();
            let height = pageElements.$height.val();
            let volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
            if (!isNaN(volume)) {
                pageElements.$volume.val(volume.toFixed(5));
            }
            else {
                pageElements.$volume.val('');
            }
        })
        pageElements.$width.on("change", function () {
            let length = pageElements.$length.val();
            let width = pageElements.$width.val();
            let height = pageElements.$height.val();
            let volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
            if (!isNaN(volume)) {
                pageElements.$volume.val(volume.toFixed(5));
            }
            else {
                pageElements.$volume.val('');
            }
        })
        pageElements.$height.on("change", function () {
            let length = pageElements.$length.val();
            let width = pageElements.$width.val();
            let height = pageElements.$height.val();
            let volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
            if (!isNaN(volume)) {
                pageElements.$volume.val(volume.toFixed(5));
            }
            else {
                pageElements.$volume.val('');
            }
        })
        $('#btn-accept-product-config').on("click", function () {
            let option = 'create'
            let product_detail = pageVariables.data_detail_config

            if (product_detail?.['product_choice'].includes(0)) {
                $('#check-tab-sale').attr('checked', true);
                $('#link-tab-sale').removeClass('disabled');
                $('#tab_sale').find('.row').prop('hidden', false)
            }
            if (product_detail?.['product_choice'].includes(1)) {
                $('#check-tab-inventory').attr('checked', true);
                $('#link-tab-inventory').removeClass('disabled');
                $('#tab_inventory').find('.row').prop('hidden', false)
                pageElements.$duration_unit.prop('disabled', true)
            }
            if (product_detail?.['product_choice'].includes(2)) {
                $('#check-tab-purchase').attr('checked', true);
                $('#link-tab-purchase').removeClass('disabled');
                $('#tab_purchase').find('.row').prop('hidden', false)
            }

            if (Object.keys(product_detail?.['general_information']).length !== 0) {
                let general_information = product_detail?.['general_information'];
                ProductPageFunction.LoadGeneralProductType(general_information['general_product_types_mapped'][0]);
                pageElements.$general_product_type.trigger('change');
                ProductPageFunction.LoadGeneralProductCategory(general_information['product_category']);
                ProductPageFunction.LoadGeneralUoMGroup(general_information['uom_group']);
                ProductPageFunction.LoadGeneralManufacturer(general_information['general_manufacturer']);
                pageElements.$general_traceability_method.val(general_information['traceability_method'])
                pageElements.$general_standard_price.attr('value', general_information['standard_price'])
                if (Object.keys(general_information['product_size']).length !== 0) {
                    pageElements.$length.val(general_information['product_size']['length']);
                    pageElements.$width.val(general_information['product_size']['width']);
                    pageElements.$height.val(general_information['product_size']['height']);
                    pageElements.$volume.val(general_information['product_size']['volume']['value']);
                    pageElements.$weight.val(general_information['product_size']['weight']['value']);
                }
            }
            if (Object.keys(product_detail?.['sale_information']).length !== 0) {
                let sale_information = product_detail?.['sale_information'];
                ProductPageFunction.LoadSaleUom(sale_information['default_uom']);
                ProductPageFunction.LoadSaleTax(sale_information['tax']);

                let price_list_filter = []
                for (let i = 0; i < sale_information['sale_product_price_list'].length; i++) {
                    let item = sale_information['sale_product_price_list'][i];
                    price_list_filter.push(item.id)
                }

                ProductPageFunction.LoadPriceListTable(sale_information['sale_product_price_list'] || [], option);
                ProductPageFunction.LoadSalePriceListForSaleOnline(sale_information['price_list_for_online_sale'], price_list_filter)
                pageElements.$is_publish_website.prop('checked', product_detail?.['is_public_website'])
                pageElements.$price_list_for_sale_online.prop('disabled', !product_detail?.['is_public_website'])

                pageElements.$available_notify_checkbox.prop('checked', sale_information?.['available_notify']);
                if (sale_information?.['available_notify']) {
                    pageElements.$less_than_number.prop('disabled', false).val(sale_information?.['available_notify_quantity']);
                } else {
                    pageElements.$less_than_number.prop('disabled', true).val('')
                }
                $.fn.initMaskMoney2();
            }
            if (Object.keys(product_detail?.['inventory_information']).length !== 0) {
                let inventory_information = product_detail?.['inventory_information'];
                ProductPageFunction.LoadInventoryUom(inventory_information['uom']);
                pageElements.$inventory_level_min.val(inventory_information['inventory_level_min']);
                pageElements.$inventory_level_max.val(inventory_information['inventory_level_max']);
                pageElements.$valuation_method.val(inventory_information['valuation_method'])
            }
            if (Object.keys(product_detail?.['purchase_information']).length !== 0) {
                let purchase_information = product_detail?.['purchase_information'];
                ProductPageFunction.LoadPurchaseUom(purchase_information['default_uom']);
                ProductPageFunction.LoadPurchaseTax(purchase_information['tax']);
                pageElements.$purchase_supplied_by.val(product_detail?.['purchase_information']?.['supplied_by'])
            }

            $('#modal-copy-config-product').modal('hide')
        })
        // inventory tab
        pageElements.$check_tab_inventory.change(function () {
            pageElements.$duration_unit.empty()
            pageElements.$duration_unit.prop('disabled', pageElements.$check_tab_inventory.is(':checked'))
            $('#tab_inventory').find('.row').prop('hidden', !pageElements.$check_tab_inventory.is(':checked'))
            $.fn.initMaskMoney2()
        })
        // sale tab
        pageElements.$check_tab_sale.change(function () {
            $('#tab_sale').find('.row').prop('hidden', !pageElements.$check_tab_sale.is(':checked'))
            $.fn.initMaskMoney2()
        })
        pageElements.$available_notify_checkbox.on('change', function () {
            pageElements.$less_than_number.val('').prop('disabled', !$(this).prop('checked'))
        })
        pageElements.$is_publish_website.on('change', function () {
            if (!$(this).prop('checked')) {
                pageElements.$price_list_for_sale_online.val('').trigger('change')
                pageElements.$price_list_for_sale_online.prop('disabled', true)
            } else {
                pageElements.$price_list_for_sale_online.prop('disabled', false)
            }
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
                    ProductPageFunction.LoadPriceForChild($(this).attr('data-id'), value);
                }

                let price_list_id = $(this).attr('data-id');
                let price_list_value = $(this).attr('value');
                if (price_list_id && price_list_value) {
                    sale_product_price_list.push(price_list_id);
                }
            })
            $.fn.initMaskMoney2();

            ProductPageFunction.LoadSalePriceListForSaleOnline(null, sale_product_price_list)
        })
        // purchase tab
        pageElements.$check_tab_purchase.change(function () {
            $('#tab_purchase').find('.row').prop('hidden', !pageElements.$check_tab_purchase.is(':checked'))
            $.fn.initMaskMoney2()
        })
        // component tab
        pageElements.$btn_add_row_component.on('click', function () {
            UsualLoadPageFunction.AddTableRow(pageElements.$component_table, {})
            let row_added = pageElements.$component_table.find('tbody tr:last-child')
        })
        $(document).on("click", '.btn-delete', function () {
            UsualLoadPageFunction.DeleteTableRow(
                pageElements.$component_table,
                parseInt($(this).closest('tr').find('td:first-child').text())
            )
            UsualLoadPageFunction.AutoScrollEnd(pageElements.$component_table)
        })
        // variant tab
        $('#add-variant-value-item').on('click', function () {
            let value = $('#value-name-modal-input').val();
            if (value !== '') {
                pageVariables.current_row_variant_attribute.find('.variant-attributes-span').append(`
                    <span class="badge badge-primary badge-outline mr-1 mb-1">
                        <span>
                            <span class="icon delete-value"><i class="fas fa-times"></i></span>
                            <span class="attribute-value">${value}</span>
                        </span>
                    </span>
                `);
                ProductPageFunction.RenderVariantItemsTable();
                ProductPageFunction.ReloadAttributeValueListSpan();
            }
            else {
                $.fn.notifyB({description: 'Value is missing'}, 'warning');
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
        pageElements.$btn_add_row_variant_attributes.on('click', function () {
            if (parseFloat($('#datatable-warehouse-overview tbody tr:first-child td:first-child span').text()) > 0) {
                $.fn.notifyB({description: 'Can not add variants when product is in stock'}, 'failure');
            }
            else {
                let tb_length = pageElements.$table_variant_attributes.find('tbody').find('tr').length;
                pageElements.$table_variant_attributes.find('tbody').append(`
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
        pageElements.$add_attribute_display_item.on('click', function () {
            let value = pageElements.$attribute_display_select_by.val();
            if (value !== '') {
                if (value === '0') {
                    pageVariables.current_row_variant_attribute.find('.config-selection').text('Dropdown list');
                    pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value', 0);
                    let attribute_value_list = []
                    $('#dropdown-list-preview option').each(function() {
                        if ($(this).text() !== '') {
                            attribute_value_list.push({
                                'value': $(this).text(),
                                'color': null
                            })
                        }
                    })
                    pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list))
                }
                if (value === '1') {
                    pageVariables.current_row_variant_attribute.find('.config-selection').text('Radio select');
                    pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value', 1);
                    let attribute_value_list = []
                    $('#radio-selection-preview .radio-attribute-value').each(function() {
                        if ($(this).attr('value') !== '') {
                            attribute_value_list.push({
                                'value': $(this).attr('value'),
                                'color': null
                            })
                        }
                    })
                    pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
                }
                if (value === '2') {
                    let detail_select = ''
                    if ($('#radio-fill-by-text').is(':checked')) {
                        pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value', 2);
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
                        pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
                    }
                    if ($('#radio-fill-by-color').is(':checked')) {
                        pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value', 3);
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
                        pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
                    }
                    if ($('#radio-fill-by-photo').is(':checked')) {
                        pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value', 4);
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
                        pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text(JSON.stringify(attribute_value_list));
                    }
                    pageVariables.current_row_variant_attribute.find('.config-selection').text(`Select ${detail_select}`);
                }
            }
            else {
                $.fn.notifyB({description: 'Value is missing'}, 'warning');
            }
        })
        pageElements.$add_variant_des.on('click', function () {
            let variant_name = $('#variant-name').val();
            let variant_des = $('#variant-des').val();
            if (variant_name !== '' && variant_des !== '') {
                pageVariables.current_row_variant_item.find('.variant-name-span').text(variant_name);
                pageVariables.current_row_variant_item.find('.variant-des-span').text(variant_des);
            }
        })
        pageElements.$attribute_display_select_by.on('change', function () {
            let value = pageElements.$attribute_display_select_by.val();
            if (value !== '') {
                if (value === '0') {
                    $('#view-mode-for-select').prop('hidden', true)
                    $('#dropdown-list-selection-preview').prop('hidden', false)
                    $('#radio-selection-preview').prop('hidden', true)
                    $('#fill-by-text-preview').prop('hidden', true)
                    $('#fill-by-color-preview').prop('hidden', true)
                    $('#fill-by-photo-preview').prop('hidden', true)
                }
                if (value === '1') {
                    $('#view-mode-for-select').prop('hidden', true)
                    $('#dropdown-list-selection-preview').prop('hidden', true)
                    $('#radio-selection-preview').prop('hidden', false)
                    $('#fill-by-text-preview').prop('hidden', true)
                    $('#fill-by-color-preview').prop('hidden', true)
                    $('#fill-by-photo-preview').prop('hidden', true)
                }
                if (value === '2') {
                    $('#view-mode-for-select').prop('hidden', false)
                    $('#dropdown-list-selection-preview').prop('hidden', true)
                    $('#radio-selection-preview').prop('hidden', true)
                    $('#radio-fill-by-text').prop('checked', true)
                    $('#fill-by-text-preview').prop('hidden', false)
                    $('#fill-by-color-preview').prop('hidden', true)
                    $('#fill-by-photo-preview').prop('hidden', true)
                }
            }
            else {
                $.fn.notifyB({description: 'Invalid selection'}, 'warning');
            }
        })
        $(document).on("click", '.add-variant-values', function () {
            pageElements.$modal_variant_attributes.find('#value-name-modal-input').val('');
            pageVariables.current_row_variant_attribute = $(this).closest('tr');
            pageElements.$modal_variant_attributes.find('#attribute-name-modal-input').val($(this).closest('tr').find('.variant-attribute').val())
        })
        $(document).on("click", '.add-variant-configs', function () {
            pageVariables.current_row_variant_attribute = $(this).closest('tr');
            let option = pageVariables.current_row_variant_attribute.find('.config-selection').attr('data-value');
            let color_data = pageVariables.current_row_variant_attribute.find('.attribute_value_list_span').text()
            ProductPageFunction.ReloadModalConfig(option, color_data);
        })
        $(document).on("click", '.add-variant-item-des', function () {
            pageVariables.current_row_variant_item = $(this).closest('tr');
            let variant_name = pageVariables.current_row_variant_item.find('.variant-name-span').text();
            let variant_des = pageVariables.current_row_variant_item.find('.variant-des-span').text();
            if (variant_name !== '' && variant_des !== '') {
                $('#variant-name').val(variant_name);
                $('#variant-des').val(variant_des);
            }
            else {
                if (pageElements.$title.val() !== '') {
                    let variant_name_content = [];
                    let variant_des_content = [];
                    pageVariables.current_row_variant_item.find('.variant-item').each(function () {
                        variant_name_content.push($(this).text());
                        variant_des_content.push($(this).text());
                    })
                    $('#variant-name').val(pageElements.$title.val() + ' (' + variant_name_content.join(', ') + ')');
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
        $(document).on("change", '.variant-attributes-select', function () {
            ProductPageFunction.RenderVariantItemsTable();
        })
        $(document).on("click", '.delete-attribute-row', function () {
            $(this).closest('tr').remove();
            ProductPageFunction.RenderVariantItemsTable();
        })
        $(document).on("click", '.delete-value', function () {
            pageVariables.current_row_variant_attribute = $(this).closest('tr');
            $(this).closest('.badge').remove();
            ProductPageFunction.RenderVariantItemsTable();
            ProductPageFunction.ReloadAttributeValueListSpan();
        })
        $(document).on("click", '.selection-fill-by', function () {
            let elements = document.getElementsByClassName('selection-fill-by');
            for (let i = 0; i < elements.length; i++) {
              elements[i].classList.remove('bg-primary-light-5');
              elements[i].classList.add('bg-gray-light-4');
            }
            $(this).addClass('bg-primary-light-5');
        })
        // attribute tab
        pageElements.$btn_select_attribute.on('click', function () {
            ProductPageFunction.LoadSelectAttributeTable()
        })
        pageElements.$btn_add_product_attribute.on('click', function () {
            Swal.fire({
                html:
                `<div class="d-flex align-items-center">
                    <div class="avatar avatar-icon avatar-soft-blue me-3"><span class="initial-wrap"><i class="fa-solid fa-repeat"></i></span></div>
                    <div>
                        <h4 class="text-blue">${pageElements.$table_selected_attribute.attr('data-trans-change-confirm')}</h4>
                        <p>${pageElements.$table_selected_attribute.attr('data-trans-change-noti')}</p>
                    </div>
                </div>`,
                customClass: {
                    confirmButton: 'btn btn-outline-secondary text-blue',
                    cancelButton: 'btn btn-outline-secondary text-gray',
                    container: 'swal2-has-bg',
                    htmlContainer: 'bg-transparent text-start',
                    actions:'w-100'
                },
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: $.fn.gettext('Confirm'),
                cancelButtonText: $.fn.gettext('Cancel'),
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    let selected_id = []
                    pageElements.$table_select_attribute.find('tbody tr .selected-attribute-category').each(function (index, ele) {
                        if ($(ele).prop('checked')) {
                            selected_id.push($(ele).attr('data-id'))
                        }
                    })
                    ProductPageFunction.LoadSelectedAttributeTable(pageVariables.raw_attribute_list.filter(item => selected_id.includes(item?.['id'])))
                    $('#modal-product-attribute').modal('hide')
                }
            })
        })
        $(document).on("click", '.btn-show-child-attribute', function () {
            let parentLevel = parseInt($(this).attr('data-level') || 0);
            let childLevel = parentLevel + 1;

            if ($(this).attr('data-is-show') === '0') {
                let this_row = $(this).closest('tr');
                let this_child = pageVariables.raw_attribute_list.filter(item => item?.['parent_n']?.['id'] === $(this).attr('data-id'));
                if (this_child.length > 0) {
                    let child_row_html = '';
                    for (let i = 0; i < this_child.length; i++) {
                        let list_item = JSON.stringify(this_child[i]?.['price_config_data']?.['list_item'] || []);
                        let duration_unit = JSON.stringify(this_child[i]?.['price_config_data']?.['duration_unit_data'] || {});
                        child_row_html += `<tr data-parent-id="${$(this).attr('data-id')}" data-level="${childLevel}">
                                                <td></td>
                                                <td></td>
                                                <td><span style="padding-left:${childLevel * 20}px"><i class="bi bi-box-seam"></i> ${this_child[i]?.['title']}</span><span class="text-success ml-1">${this_child[i]?.['is_inventory'] ? '(' + $.fn.gettext('is inventory tracking') + ')' : ''}</span></td>
                                                <td>
                                                    <button class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs btn-show-child-attribute" 
                                                            data-id="${this_child[i]?.['id']}" 
                                                            data-level="${childLevel}" 
                                                            data-list-item='${list_item}' 
                                                            data-duration-unit='${duration_unit}' 
                                                            data-is-show="0"
                                                            >
                                                        <span class="icon">
                                                            <i class="bi bi-caret-down-fill"></i>
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>`;
                    }
                    this_row.after(child_row_html);
                }
                else {
                    let child_row_html = '';
                    let data_list_item = JSON.parse($(this).attr('data-list-item') || '[]');
                    let data_duration_unit = JSON.parse($(this).attr('data-duration-unit') || '{}');
                    for (let i = 0; i < data_list_item.length; i++) {
                        child_row_html += `<tr data-parent-id="${$(this).attr('data-id')}" data-level="${childLevel}">
                                                <td></td>
                                                <td></td>
                                                <td class="text-primary"><span style="padding-left:${childLevel * 20}px">${data_list_item[i]?.['title']}</span>, +<span class="mask-money" data-init-money="${data_list_item[i]?.['additional_cost'] || 0}"></span>, <span>${data_duration_unit?.['title'] || ''}</span></td>
                                                <td></td>
                                            </tr>`;
                    }
                    this_row.after(child_row_html);
                }
                $(this).attr('data-is-show', '1');
                $.fn.initMaskMoney2()
            } else {
                ProductPageFunction.RemoveChildRow(pageElements.$table_select_attribute, $(this).attr('data-id'));
                $(this).attr('data-is-show', '0');
            }
        });
        $(document).on("click", '.btn-show-child-selected-attribute', function () {
            let parentLevel = parseInt($(this).attr('data-level') || 0);
            let childLevel = parentLevel + 1;

            if ($(this).attr('data-is-show') === '0') {
                let this_row = $(this).closest('tr');
                let this_child = pageVariables.raw_attribute_list.filter(item => item?.['parent_n']?.['id'] === $(this).attr('data-id'));
                if (this_child.length > 0) {
                    let child_row_html = '';
                    for (let i = 0; i < this_child.length; i++) {
                        let list_item = JSON.stringify(this_child[i]?.['price_config_data']?.['list_item'] || []);
                        let duration_unit = JSON.stringify(this_child[i]?.['price_config_data']?.['duration_unit_data'] || {});
                        if (this_child[i]?.['is_inventory'] === pageElements.$check_tab_inventory.is(':checked')) {
                            child_row_html += `<tr data-parent-id="${$(this).attr('data-id')}" data-level="${childLevel}">
                                                    <td></td>
                                                    <td><span style="padding-left:${childLevel * 20}px"><i class="bi bi-box-seam"></i> ${this_child[i]?.['title']}</span></td>
                                                    <td class="text-right">
                                                        <button type="button"
                                                                class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs btn-child-collapse btn-show-child-selected-attribute" 
                                                                data-id="${this_child[i]?.['id']}" 
                                                                data-level="${childLevel}" 
                                                                data-list-item='${list_item}' 
                                                                data-duration-unit='${duration_unit}' 
                                                                data-is-show="0"
                                                                >
                                                            <span class="icon">
                                                                <i class="bi bi-caret-down-fill"></i>
                                                            </span>
                                                        </button>
                                                    </td>
                                                </tr>`;
                        }
                    }
                    this_row.after(child_row_html);
                }
                else {
                    let child_row_html = '';
                    let data_list_item = JSON.parse($(this).attr('data-list-item') || '[]');
                    let data_duration_unit = JSON.parse($(this).attr('data-duration-unit') || '{}');
                    for (let i = 0; i < data_list_item.length; i++) {
                        child_row_html += `<tr data-parent-id="${$(this).attr('data-id')}" data-level="${childLevel}">
                                                <td></td>
                                                <td class="text-primary"><span style="padding-left:${childLevel * 20}px">${data_list_item[i]?.['title']}</span>, +<span class="mask-money" data-init-money="${data_list_item[i]?.['additional_cost'] || 0}"></span>, <span>${data_duration_unit?.['title'] || ''}</span></td>
                                                <td></td>
                                            </tr>`;
                    }
                    this_row.after(child_row_html);
                }
                $(this).attr('data-is-show', '1');
                $.fn.initMaskMoney2()
            } else {
                ProductPageFunction.RemoveChildRow(pageElements.$table_selected_attribute, $(this).attr('data-id'));
                $(this).attr('data-is-show', '0');
            }
        });
    }
}