$(document).ready(function () {
    const currency_list = JSON.parse($('#currency_list').text());
    let currency_primary = null;
    for (let i = 0; i < currency_list.length; i++) {
        if (currency_list[i].is_primary) {
            currency_primary = currency_list[i].id
        }
    }

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

    $('#check-tab-inventory').change(function () {
        disabledTab(this.checked, '#link-tab-inventory', '#tab_inventory');
        $('#tab_inventory input,#tab_inventory select').val('');
        if (this.checked) {
            $('.dimensionControl').show();
        } else {
            $('.dimensionControl').hide();
        }
    });

    $('#check-tab-sale').change(function () {
        disabledTab(this.checked, '#link-tab-sale', '#tab_sale');
        $('#tab_sale select').val('');
    });

    $('#check-tab-purchase').change(function () {
        disabledTab(this.checked, '#link-tab-purchase', '#tab_purchase');
    });

    function loadProductType() {
        let ele = $('#general-select-box-product-type');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_type_list')) {
                    ele.append(`<option></option>`);
                    resp.data.product_type_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadProductCategory() {
        let ele = $('#general-select-box-product-category');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_category_list')) {
                    ele.append(`<option></option>`);
                    resp.data.product_category_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadUoMGroup() {
        let ele = $('#general-select-box-uom-group');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure_group')) {
                    ele.append(`<option></option>`);
                    resp.data.unit_of_measure_group.map(function (item) {
                        if (Object.keys(item.referenced_unit).length !== 0)
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadTaxCode() {
        let ele1 = $('#sale-select-box-tax-code');
        let ele2 = $('#purchase-select-box-tax-code');
        ele1.html('');
        ele2.html('');
        $.fn.callAjax(ele1.attr('data-url'), ele1.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    ele1.append(`<option></option>`);
                    ele2.append(`<option></option>`);
                    resp.data.tax_list.map(function (item) {
                        if (item.type === 0 || item.type === 2)
                            ele1.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                            ele2.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                    })
                }
            }
        }, (errs) => {
        },)

    }

    function loadPriceList() {
        let ele = $('#sale-select-price-list');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
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
                        if (item.is_default || (item.price_list_mapped !== null && item.auto_update === true)) {
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
                                <input data-is-default="${item.is_default}" ${is_default} data-source="${item.price_list_mapped}" data-auto-update="${item.auto_update}" data-factor="${item.factor}" data-id="${item.id}" data-return-type="number" type="text" class="form-control mask-money input_price_list">
                            </div>
                        </div>`;
                    }
                    ele.find('.ul-price-list').html(html);
                }
            }
        }, (errs) => {
        },)
    }

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

    loadPriceList();
    loadProductCategory();
    loadProductType();
    loadUoMGroup();
    loadTaxCode();

    // change select box UoM group tab general
    $('#general-select-box-uom-group').on('change', function () {
        $('#inventory-uom-code').val('');
        let sale_select_box_default_uom = $('#sale-select-box-default-uom');
        let purchase_select_box_default_uom = $('#purchase-select-box-default-uom');
        let inventory_select_box_uom_name = $('#inventory-select-box-uom-name');
        sale_select_box_default_uom.html('');
        purchase_select_box_default_uom.html('');
        inventory_select_box_uom_name.html('');
        if ($(this).val()) {
            let data_url = $(this).attr('data-url-detail').replace(0, $(this).val());
            let data_method = $(this).attr('data-method');
            $.fn.callAjax(data_url, data_method).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('uom_group')) {
                        sale_select_box_default_uom.append(`<option></option>`);
                        purchase_select_box_default_uom.append(`<option></option>`);
                        inventory_select_box_uom_name.append(`<option data-code=""></option>`);
                        data.uom_group.uom.map(function (item) {
                            sale_select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                            purchase_select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                            inventory_select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `">` + item.uom_title + `</option>`);
                        })
                    }
                }
            }, (errs) => {
            },)
        }
    })

    // change select box UoM Name in tab inventory
    $('#inventory-select-box-uom-name').on('change', function () {
        $('#inventory-uom-code').val($(this).find(":selected").attr('data-code'));
    })

    $('#sale-select-box-default-uom').on('change', function () {
        if ($('#check-tab-inventory').is(':checked') === true) {
            if ($('#inventory-select-box-uom-name').val() === '') {
                $('#inventory-select-box-uom-name').val($(this).val());
                $('#inventory-uom-code').val(($('#inventory-select-box-uom-name option:selected').attr('data-code')));
            }
        }
    })

    const item_unit_dict = JSON.parse($('#id-unit-list').text()).reduce((obj, item) => {
        obj[item.title] = item;
        return obj;
    }, {});

    function loadBaseItemUnit() {
        let eleVolume = $('#divVolume');
        let eleWeight = $('#divWeight');
        eleVolume.find('.input-suffix').text(item_unit_dict['volume'].measure)
        eleVolume.find('input').attr('data-id', item_unit_dict['volume'].id)
        eleWeight.find('.input-suffix').text(item_unit_dict['weight'].measure)
        eleWeight.find('input').attr('data-id', item_unit_dict['weight'].id)
    }
    loadBaseItemUnit();

    function getDataForm() {
        let data = {
            'title': $('#title').val(),
            'description': $('#description').val()
        };
        data['product_choice'] = []

        let product_size = {}
        if ($('#length').val() !== '' && $('#width').val() !== '' && $('#height').val() !== '' && $('#volume') !== '' && $('#weight') !== '') {
            product_size = {
                'length': $('#length').val(),
                'width': $('#width').val(),
                'height': $('#height').val(),
                'volume': $('#volume').val(),
                'weight': $('#weight').val(),
                'volume_id': $('#volume').attr('data-id'),
                'weight_id': $('#weight').attr('data-id')
            }
        }

        data['general_information'] = {
            'general_product_type': $('#general-select-box-product-type option:selected').attr('value'),
            'general_product_category': $('#general-select-box-product-category option:selected').attr('value'),
            'general_product_uom_group': $('#general-select-box-uom-group option:selected').attr('value'),
            'general_product_size': product_size
        }

        if ($('#check-tab-sale').is(':checked') === true) {
            data['product_choice'].push(0)
            let sale_product_price_list = [];
            $('.ul-price-list').find('.select_price_list').each(function (index, element) {
                let selected = $(this).is(':checked');
                if (selected) {
                    let price_list_id = $(this).closest('.select_price_list_row').find('.input_price_list').attr('data-id');
                    let price_list_value = $(this).closest('.select_price_list_row').find('.input_price_list').attr('value');
                    let is_auto_update = $(this).closest('.select_price_list_row').find('.input_price_list').attr('data-auto-update');
                    sale_product_price_list.push({
                        'price_list_id': price_list_id,
                        'price_list_value': price_list_value,
                        'is_auto_update': is_auto_update
                    });
                }
            })
            data['sale_information'] = {
                'sale_product_default_uom': $('#sale-select-box-default-uom option:selected').attr('value'),
                'sale_product_tax': $('#sale-select-box-tax-code option:selected').attr('value'),
                'sale_product_cost': $('#sale-cost').attr('value'),
                'sale_product_price_list': sale_product_price_list,
                'currency_using': currency_primary
            }
        }

        if ($('#check-tab-inventory').is(':checked') === true) {
            data['product_choice'].push(1)
            data['inventory_information'] = {
                'inventory_product_uom': $('#inventory-select-box-uom-name option:selected').attr('value'),
                'inventory_level_min': $('#inventory-level-min').val(),
                'inventory_level_max': $('#inventory-level-max').val(),
            }
        }

        if ($('#check-tab-purchase').is(':checked') === true) {
            data['product_choice'].push(2)
            data['purchase_information'] = {
                'purchase_product_default_uom': $('#purchase-select-box-default-uom option:selected').attr('value'),
                'purchase_product_tax': $('#purchase-select-box-tax-code option:selected').attr('value'),
            }
        }
        console.log(data)
        return data
    }

    //submit form create product
    let form_create_product = $('#form-create-product');
    form_create_product.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        let dataForm = getDataForm();

        $.fn.callAjax(frm.dataUrl, frm.dataMethod,  dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    // $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
    })

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
                        render: (data, type, row, meta) => {
                            return `<span class="text-secondary">` + row.code + `</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text text-center w-50',
                        render: (data, type, row, meta) => {
                            return `<center><span class="text-secondary"><b>` + row.title + `</b></span></center>`
                        }
                    },
                    {
                        data: 'stock_value',
                        className: 'wrap-text text-center w-25',
                        render: (data, type, row, meta) => {
                            return `<span>0</span>`
                        }
                    },
                ],
            });
        }
    }
    loadWareHouseList();

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
                        render: (data, type, row, meta) => {
                            return `<span style="font-weight: bolder" class="text-danger">0</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text text-center w-25',
                        render: (data, type, row, meta) => {
                            return `<span style="font-weight: bolder" class="text-danger">0</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text text-center w-25',
                        render: (data, type, row, meta) => {
                            return `<span style="font-weight: bolder" class="text-danger">0</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text text-center w-25',
                        render: (data, type, row, meta) => {
                            return `<span style="font-weight: bolder" class="text-danger">0</span>`
                        }
                    },
                ],
            });
        }
    }
    loadWareHouseOverView();
})