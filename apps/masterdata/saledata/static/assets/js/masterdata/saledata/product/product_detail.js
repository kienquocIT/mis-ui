$(document).ready(function () {
    let form_update_product = $('#form-update-product');

    function disabledTab(check, link_tab, id_tab) {
        if (!check) {
            $(link_tab).addClass('disabled');
            $(id_tab).removeClass('active show');
            if ($(`a[href="` + id_tab + `"]`).hasClass('active')) {
                $('a[href="#tab_general"]').addClass('active');
                $('#tab_general').addClass('active show');
            }
            $(`a[href="` + id_tab + `"]`).removeClass('active');
        } else {
            $(link_tab).removeClass('disabled');
        }
    }

    $('#check-tab-inventory').change(function () {
        disabledTab(this.checked, '#link-tab-inventory', '#tab_inventory');
        $('#tab_inventory input,#tab_inventory select').val('');
        if (this.checked) {
            $('.dimensionControl').show();
        } else {
            $('.dimensionControl').hide();
        }
        let chooseUoMInventory = $('#select-box-uom-name');
        chooseUoMInventory.html('');
        chooseUoMInventory.html($('#select-box-default-uom').html());
    });

    $('#check-tab-sale').change(function () {
        disabledTab(this.checked, '#link-tab-sale', '#tab_sale');
        $('#tab_sale select').val('');
    });

    $('#check-tab-purchase').change(function () {
        disabledTab(this.checked, '#link-tab-purchase', '#tab_purchase');
    });

    let pk = $.fn.getPkDetail()

    $('#product-image').dropify({
        messages: {
            'default': 'Upload an image',
            'replace': 'Drag and drop or click to replace',
            'remove':  'Remove',
            'error':   'Ooops, something wrong happended.'
        },
        tpl: {
            message:' {{ default }}',
        }
    });

    $(document).on("change", '.select_price_list', function () {
        if ($(this).is(':checked') === true) {
            $(this).closest('.select_price_list_row').find('.input_price_list').attr('disabled', false);
        }
        else {
            $(this).closest('.select_price_list_row').find('.input_price_list').attr('disabled', true);
            $(this).closest('.select_price_list_row').find('.input_price_list').attr('value', '');
            $(this).closest('.select_price_list_row').find('.input_price_list').val('');
        }
    })

    $(document).on("change", '.input_price_list', function () {
        let this_data_id = $(this).attr('data-id');
        let this_data_value = $(this).attr('value');
        $('.ul-price-list').find('.input_price_list').each(function (index, element) {
            if ($(this).attr('data-source') === this_data_id && $(this).attr('data-auto-update') === 'true' && $(this).attr('data-is-default') === 'false') {
                let value = parseFloat(this_data_value) * parseFloat($(this).attr('data-factor'));
                $(this).attr('value', parseFloat(value));
                loadPriceForChild($(this).attr('data-id'), value);
            }
        })
        $.fn.initMaskMoney2();
    })

    $(document).on("change", '#length', function () {
        let length = $('#length').val();
        let width = $('#width').val();
        let height = $('#height').val();
        let volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
        $('#volume').val(volume.toFixed(2));
    })

    $(document).on("change", '#width', function () {
        let length = $('#length').val();
        let width = $('#width').val();
        let height = $('#height').val();
        let volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
        $('#volume').val(volume.toFixed(2));
    })

    $(document).on("change", '#height', function () {
        let length = $('#length').val();
        let width = $('#width').val();
        let height = $('#height').val();
        let volume = parseFloat(length) * parseFloat(width) * parseFloat(height);
        $('#volume').val(volume.toFixed(2));
    })

    function loadPriceForChild(element_id, element_value) {
        $('.ul-price-list').find('.input_price_list').each(function (index, element) {
            if ($(this).attr('data-source') === element_id && $(this).attr('data-auto-update') === 'true' && $(this).attr('data-is-default') === 'false') {
                let value = parseFloat(element_value) * parseFloat($(this).attr('data-factor'));
                $(this).attr('value', parseFloat(value));
                loadPriceForChild($(this).attr('data-id'), value);
            }
        })
        $.fn.initMaskMoney2();
    }

    function Load1() {
        $('#inventory-uom-code').val('');
        let sale_select_box_default_uom = $('#sale-select-box-default-uom');
        let purchase_select_box_default_uom = $('#purchase-select-box-default-uom');
        let inventory_select_box_uom_name = $('#inventory-select-box-uom-name');
        sale_select_box_default_uom.html('');
        purchase_select_box_default_uom.html('');
        inventory_select_box_uom_name.html('');
        if ($('#general-select-box-uom-group option:selected').attr('value')) {
            sale_select_box_default_uom.append(`<option></option>`);
            purchase_select_box_default_uom.append(`<option></option>`);
            inventory_select_box_uom_name.append(`<option data-code=""></option>`);
            let unit_of_measure_group_get = unit_of_measure_group.filter(function(element) {
                return element.id === $('#general-select-box-uom-group option:selected').attr('value');
            })
            unit_of_measure_group_get[0].uom.map(function (item) {
                sale_select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                purchase_select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                inventory_select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `">` + item.uom_title + `</option>`);
            })
        }
    }

    $('#general-select-box-uom-group').on('change', function () {
        Load1();
    })

    $('#inventory-select-box-uom-name').on('change', function () {
        $('#inventory-uom-code').val($(this).find(":selected").attr('data-code'));
    })

    $('#sale-select-box-default-uom').on('change', function () {
        $('#inventory-select-box-uom-name').val($(this).val());
        $('#inventory-uom-code').val(($('#inventory-select-box-uom-name option:selected').attr('data-code')));
    })

    const item_unit_dict = JSON.parse($('#id-unit-list').text()).reduce((obj, item) => {
        obj[item.title] = item;
        return obj;
    }, {});
    const unit_of_measure_group = JSON.parse($('#unit_of_measure_group').text());
    const currency_list = JSON.parse($('#currency_list').text());
    let currency_primary = null;
    for (let i = 0; i < currency_list.length; i++) {
        if (currency_list[i].is_primary) {
            currency_primary = currency_list[i].id
        }
    }

    function loadBaseItemUnit() {
        let eleVolume = $('#divVolume');
        let eleWeight = $('#divWeight');
        eleVolume.find('.input-suffix').text(item_unit_dict['volume'].measure)
        eleVolume.find('input').attr('data-id', item_unit_dict['volume'].id)
        eleWeight.find('.input-suffix').text(item_unit_dict['weight'].measure)
        eleWeight.find('input').attr('data-id', item_unit_dict['weight'].id)
    }
    loadBaseItemUnit();

    function loadDetail() {
        let call_1 = $.fn.callAjax($('#general-select-box-product-type').attr('data-url'), $('#general-select-box-product-type').attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                return data.product_type_list;
            }
        }, (errs) => {})
        let call_2 = $.fn.callAjax($('#general-select-box-product-category').attr('data-url'), $('#general-select-box-product-category').attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_category_list')) {
                    return data.product_category_list;
                }
            }
        }, (errs) => {})
        let call_3 = $.fn.callAjax($('#general-select-box-uom-group').attr('data-url'), $('#general-select-box-uom-group').attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure_group')) {
                    return data.unit_of_measure_group;
                }
            }
        }, (errs) => {})
        let call_4 = $.fn.callAjax($('#sale-select-box-tax-code').attr('data-url'), $('#sale-select-box-tax-code').attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    return data.tax_list;
                }
            }
        }, (errs) => {})
        let call_5 = $.fn.callAjax($('#sale-select-price-list').attr('data-url'), $('#sale-select-price-list').attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {
                    return data.price_list;
                }
            }
        }, (errs) => {})
        let call_6 = $.fn.callAjax(form_update_product.data('url').format_url_with_uuid(pk), 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                return data.product
            }
        })
        Promise.all([call_1, call_2, call_3, call_4, call_5, call_6]).then((results) => {
            let ele1 = $('#general-select-box-product-type');
            ele1.html('');
            ele1.append(`<option></option>`);
            results[0].map(function (item) {
                ele1.append(`<option value="` + item.id + `">` + item.title + `</option>`);
            })

            let ele2 = $('#general-select-box-product-category');
            ele2.html('');
            ele2.append(`<option></option>`);
            results[1].map(function (item) {
                ele2.append(`<option value="` + item.id + `">` + item.title + `</option>`);
            })

            let ele3 = $('#general-select-box-uom-group');
            ele3.html('');
            ele3.append(`<option></option>`);
            results[2].map(function (item) {
                if (Object.keys(item.referenced_unit).length !== 0)
                    ele3.append(`<option value="` + item.id + `">` + item.title + `</option>`);
            })

            let ele4 = $('#sale-select-box-tax-code');
            let ele5 = $('#purchase-select-box-tax-code');
            ele4.html('');
            ele5.html('');
            ele4.append(`<option></option>`);
            ele5.append(`<option></option>`);
            results[3].map(function (item) {
                if (item.type === 0 || item.type === 2)
                {
                    ele4.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                    ele5.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                }
            })

            let ele6 = $('#sale-select-price-list');
            let html = ``
            for (let i = 0; i < results[4].length; i++) {
                let item = results[4][i];
                let checked = '';
                let disabled = '';
                let is_default = 'disabled';
                if (item.is_default) {
                    is_default = ''
                }
                if (item.is_default || (item.price_list_mapped !== null && item.auto_update === true)) {
                    checked = 'checked';
                    disabled = 'disabled';
                }
                html += `<div class="row select_price_list_row">
                    <div class="col-6">
                        <div class="form-check mt-2">
                            <input class="form-check-input select_price_list" type="checkbox" data-id="${item.id}" ${checked} disabled>
                            <label>` + item.title + `</label>
                        </div>
                    </div>
                    <div class="col-6 form-group">
                        <input data-is-default="${item.is_default}" data-source="${item.price_list_mapped}" data-auto-update="${item.auto_update}" data-factor="${item.factor}" data-id="${item.id}" data-return-type="number" type="text" class="form-control mask-money input_price_list" readonly>
                    </div>
                </div>`;
            }
            ele6.find('.ul-price-list').html(html);

            let product_detail = results[5];
            console.log(product_detail)
            $.fn.compareStatusShowPageAction(product_detail);

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
                $('#general-select-box-product-type').val(general_information['product_type']['id']);
                $('#general-select-box-product-category').val(general_information['product_category']['id']);
                $('#general-select-box-uom-group').val(general_information['uom_group']['id']);
                if (Object.keys(general_information['product_size']).length !== 0) {
                    $('#length').val(general_information['product_size']['length']);
                    $('#width').val(general_information['product_size']['width']);
                    $('#height').val(general_information['product_size']['height']);
                    $('#volume').val(general_information['product_size']['volume']['value']);
                    $('#weight').val(general_information['product_size']['weight']['value']);
                }
                Load1();
            }

            if (Object.keys(product_detail['sale_information']).length !== 0) {
                let sale_information = product_detail['sale_information'];

                $('#sale-select-box-default-uom').val(sale_information['default_uom']['id']);
                $('#sale-select-box-tax-code').val(sale_information['tax']['id']);
                $('#sale-cost').attr('value', sale_information['sale_product_cost']);

                for (let i = 0; i < sale_information['sale_product_price_list'].length; i++) {
                    console.log(sale_information['sale_product_price_list'])
                    let item = sale_information['sale_product_price_list'][i];
                    $(`.input_price_list[data-id="` + item.id + `"]`).attr('value', item.price);
                }
                $.fn.initMaskMoney2();
            }

            if (Object.keys(product_detail['inventory_information']).length !== 0) {
                let inventory_information = product_detail['inventory_information'];

                $('#inventory-select-box-uom-name').val(inventory_information['uom']['id']);
                $('#inventory-uom-code').val(inventory_information['uom']['code']);
                $('#inventory-level-min').val(inventory_information['inventory_level_min']);
                $('#inventory-level-max').val(inventory_information['inventory_level_max']);

                let warehouse_stock_list = GetProductFromWareHouseStockList(product_detail.id, product_detail.inventory_information['uom']['id']);
                loadWareHouseList(warehouse_stock_list);
                loadWareHouseOverView(warehouse_stock_list);
            }

            if (Object.keys(product_detail['purchase_information']).length !== 0) {
                let purchase_information = product_detail['purchase_information'];

                $('#purchase-select-box-default-uom').val(purchase_information['default_uom']['id']);
                $('#purchase-select-box-tax-code').val(purchase_information['tax']['id']);
            }

        }).catch((error) => {
            console.log(error);
        });
    }
    loadDetail();

    const warehouse_product_list = JSON.parse($('#warehouse_product_list').text());
    const unit_of_measure_list = JSON.parse($('#unit_of_measure').text());

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
            let raw_stock_quantity = calculated_ratio * product_get_from_wh_product_list[i].stock_amount;
            let delivered_quantity = calculated_ratio * product_get_from_wh_product_list[i].sold_amount;
            let ready_quantity = calculated_ratio * product_get_from_wh_product_list[i].picked_ready;

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

    function loadWareHouseList(warehouse_stock_list) {
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
                            if (data.warehouse_list.length > 0) {
                                for (let i = 0; i < data.warehouse_list.length; i++) {
                                    let value_list = warehouse_stock_list.filter(function (item) {
                                        return item.warehouse_id === data.warehouse_list[i].id;
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
                        render: (data, type, row, meta) => {
                            return `<span class="text-secondary">` + row.code + `</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text text-center w-25',
                        render: (data, type, row, meta) => {
                            return `<center><span class="text-secondary"><b>` + row.title + `</b></span></center>`
                        }
                    },
                    {
                        data: 'stock_value',
                        className: 'wrap-text text-center w-15',
                        render: (data, type, row, meta) => {
                            return `<span>` + row.stock_value + `</span>`
                        }
                    },
                ],
                footerCallback: function (tfoot, data, start, end, display) {
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
    }

    function loadWareHouseOverView(warehouse_stock_list) {
        if (!$.fn.DataTable.isDataTable('#datatable-warehouse-overview')) {
            let dtb = $('#datatable-warehouse-overview');
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
                            if (data.warehouse_list.length > 0) {
                                let sum_stock = 0;
                                let sum_wait_for_delivery_value = 0;
                                let sum_wait_for_receipt_value = 0;
                                let sum_available_value = 0;

                                for (let i = 0; i < data.warehouse_list.length; i++) {
                                    let value_list = warehouse_stock_list.filter(function (item) {
                                        return item.warehouse_id === data.warehouse_list[i].id;
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
                        render: (data, type, row, meta) => {
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
                        render: (data, type, row, meta) => {
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
                        render: (data, type, row, meta) => {
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
                        render: (data, type, row, meta) => {
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
    }
})