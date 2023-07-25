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

    function loadProductType(id) {
        let ele = $('#select-box-product-type');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_type_list')) {
                    ele.append(`<option></option>`);
                    resp.data.product_type_list.map(function (item) {
                        if (item.id === id)
                            ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`);
                        else
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadProductCategory(id) {
        let ele = $('#select-box-product-category');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_category_list')) {
                    ele.append(`<option></option>`);
                    resp.data.product_category_list.map(function (item) {
                        if (item.id === id) {
                            ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`);
                        } else {
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                        }
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadUoMGroup(id) {
        let ele = $('#select-box-uom-group');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure_group')) {
                    ele.append(`<option></option>`);
                    resp.data.unit_of_measure_group.map(function (item) {
                        if (Object.keys(item.referenced_unit).length !== 0)
                            if (item.id === id)
                                ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`);
                            else
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadTaxCode(id) {
        let ele = $('#select-box-tax-code');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    ele.append(`<option></option>`);
                    resp.data.tax_list.map(function (item) {
                        if (item.type === 0 || item.type === 2) {
                            if (item.id === id)
                                ele.append(`<option value="` + item.id + `" selected>` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                            else
                                ele.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                        }
                    })
                }
            }
        }, (errs) => {
        },)

    }

    function getTreePriceList(dataTree, parent_id, child) {
        for (let i = 0; i < dataTree.length; i++) {
            if (dataTree[i].item.id === parent_id) {
                dataTree[i].child.push({
                    'item': child,
                    'child': []
                })
            } else {
                if (dataTree[i].child.length === 0)
                    continue;
                else {
                    getTreePriceList(dataTree[i].child, parent_id, child)
                }
            }
        }
        return dataTree
    }

    function appendHtmlForPriceList(dataTree, ele, currency, count) {
        for (let i = 0; i < dataTree.length; i++) {
            if (dataTree[i].item.price_list_mapped !== null) {
                if (dataTree[i].item.auto_update === true) {
                    ele.find('ul').append(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5">
                                <input data-source="` + dataTree[i].item.price_list_mapped + `" class="form-check-input" type="checkbox"
                                    value="option1" data-check="check-` + count + `" data-id="` + dataTree[i].item.id + `" disabled>
                                <label class="form-check-label">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text">
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-source="` + dataTree[i].item.price_list_mapped + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="" readonly>
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                } else {
                    ele.find('ul').append(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5">
                                <input data-source="` + dataTree[i].item.price_list_mapped + `" class="form-check-input" type="checkbox"
                                    value="option1" data-check="check-` + count + `" data-id="` + dataTree[i].item.id + `">
                                <label class="form-check-label">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text">
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-source="` + dataTree[i].item.price_list_mapped + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="" disabled>
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                }
            } else {
                if (dataTree[i].item.is_default === true) {
                    ele.find('ul').prepend(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5">
                                <input data-is-default="1" class="form-check-input" type="checkbox"
                                    value="option1" checked data-check="check-` + count + `" disabled data-id="` + dataTree[i].item.id + `">
                                <label class="form-check-label required">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text">
                                <input data-is-default="1" data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="">
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                } else {
                    ele.find('ul').append(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5">
                                <input class="form-check-input" type="checkbox"
                                    value="option1" data-check="check-` + count + `" data-id="` + dataTree[i].item.id + `">
                                <label class="form-check-label">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text">
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="" disabled>
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                }
            }
            count += 1
            if (dataTree[i].child.length !== 0) {
                count = appendHtmlForPriceList(dataTree[i].child, ele, currency, count)
            } else {
                continue;
            }
        }
        return count
    }

    let currency_id;

    function loadPriceList(list_price) {
        let ele = $('#select-price-list');
        let currency_primary;
        $.fn.callAjax(ele.attr('data-currency'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('currency_list')) {
                    data.currency_list.map(function (item) {
                        if (item.is_primary === true) {
                            currency_primary = item.abbreviation;
                            currency_id = item.id;
                        }
                    })
                }
            }
        }, (errs) => {
        },).then((resp) => {
            let dataTree = []
            $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {
                        data.price_list.map(function (item) {
                            if (item.price_list_type.value === 0) {
                                let price_list_exists = list_price.find(function (obj) {
                                    return obj.id === item.id
                                })
                                if (price_list_exists !== undefined) {
                                    item.auto_update = list_price.find(function (obj) {
                                        return obj.id === item.id
                                    }).is_auto_update;
                                }
                                if (item.price_list_mapped === null) {
                                    dataTree.push({
                                        'item': item,
                                        'child': []
                                    })
                                } else {
                                    dataTree = getTreePriceList(dataTree, item.price_list_mapped, item)
                                }
                            }
                        })
                        appendHtmlForPriceList(dataTree, ele, currency_primary, 0);
                        autoSelectPriceListCopyFromSource()
                        list_price.map(function (item) {
                            if (item.currency_using === currency_primary) {
                                document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).value = item.price.toLocaleString('de-DE', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                });
                            }
                            if (item.is_auto_update === false) {
                                document.querySelector(`input[type="checkbox"][data-id="` + item.id + `"]`).checked = true;
                                document.querySelector(`input[type="checkbox"][data-id="` + item.id + `"]`).disabled = false;
                                document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).disabled = false;
                                document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).readOnly = false;
                                document.querySelector(`input[type="checkbox"][data-is-default="1"]`).disabled = true;
                            } else {
                                document.querySelector(`input[type="checkbox"][data-id="` + item.id + `"]`).checked = true;
                                document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).disabled = true;
                            }
                        })
                    }
                }
            })
        })
    }

    let pk = $.fn.getPkDetail()


    // get detail product
    function loadDetail() {
        let url_detail = form_update_product.data('url').format_url_with_uuid(pk)
        $.fn.callAjax(url_detail, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let product_detail = data?.['product'];

                $.fn.compareStatusShowPageAction(product_detail);
                $('#product-code').text(product_detail.code);
                $('#product-title').val(product_detail.title);
                loadProductCategory(product_detail.general_information.product_category.id);
                loadProductType(product_detail.general_information.product_type.id);
                loadUoMGroup(product_detail.general_information.uom_group.id);

                let ele = $('#select-box-uom-group')
                let data_url = ele.attr('data-url-detail').replace(0, product_detail.general_information.uom_group.id);
                let data_method = ele.attr('data-method');
                let select_box_default_uom = $('#select-box-default-uom');
                let select_box_uom_name = $('#select-box-uom-name');
                select_box_default_uom.html('');
                select_box_uom_name.html('');

                $.fn.callAjax(data_url, data_method).then((resp) => {
                    let data_uom_gr = $.fn.switcherResp(resp);
                    if (data_uom_gr) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('uom_group')) {
                            select_box_uom_name.append(`<option data-code=""></option>`);
                            select_box_default_uom.append(`<option></option>`);
                            if (!product_detail.product_choice.includes(1)) {
                                $('#link-tab-inventory').addClass('disabled');
                                $('#tab_inventory').removeClass('active show');
                                $('#check-tab-inventory').prop('checked', false);
                                $('.dimensionControl').hide();
                            } else {
                                let warehouse_stock_list = GetProductFromWareHouseStockList(pk, product_detail.inventory_information.uom.id);
                                loadWareHouseList(warehouse_stock_list);
                                loadWareHouseOverView(warehouse_stock_list);
                            }
                            if (!product_detail.product_choice.includes(0)) {
                                $('#link-tab-sale').addClass('disabled');
                                $('#tab_sale').removeClass('active show');
                                $('#check-tab-sale').prop('checked', false);
                                loadPriceList([]);
                                loadTaxCode(null);
                            } else {
                                if (product_detail.sale_information.hasOwnProperty('price_list'))
                                    loadPriceList(product_detail.sale_information.price_list);
                                else {
                                    loadPriceList([]);
                                }
                                if (product_detail.sale_information.hasOwnProperty('tax_code'))
                                    loadTaxCode(product_detail.sale_information.tax_code.id);
                                else
                                    loadTaxCode(null);

                                $('[name="length"]').val(product_detail.sale_information.length);
                                $('[name="width"]').val(product_detail.sale_information.width);
                                $('[name="height"]').val(product_detail.sale_information.height);
                                if (product_detail.sale_information.measure !== undefined) {
                                    product_detail.sale_information.measure.map(function (item) {
                                        if (item.unit.title === 'volume') {
                                            $('[name="volume"]').val(item.value);
                                        } else {
                                            $('[name="weight"]').val(item.value);
                                        }
                                    })
                                }
                            }

                            if (!product_detail.product_choice.includes(2)) {
                                $('#link-tab-purchase').addClass('disabled');
                                $('#check-tab-purchase').prop('checked', false);
                            }

                            data_uom_gr.uom_group.uom.map(function (item) {
                                if ($.fn.hasOwnProperties(product_detail.sale_information, ['default_uom']) && product_detail.sale_information.default_uom !== null) {
                                    if (item.uom_id === product_detail.sale_information.default_uom.id)
                                        select_box_default_uom.append(`<option value="` + item.uom_id + `" selected>` + item.uom_title + `</option>`);
                                    else
                                        select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                                } else {
                                    select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                                }

                                if ($.fn.hasOwnProperties(product_detail.inventory_information, ['uom']) && product_detail.inventory_information.uom !== null) {
                                    if (item.uom_id === product_detail.inventory_information.uom.id) {
                                        select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `" selected>` + item.uom_title + `</option>`);
                                        $('#uom-code').val(item.uom_code);
                                    } else
                                        select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `">` + item.uom_title + `</option>`);
                                } else {
                                    select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `">` + item.uom_title + `</option>`);
                                }
                            })

                            $('#inventory-level-max').val(product_detail.inventory_information.inventory_level_max);
                            $('#inventory-level-min').val(product_detail.inventory_information.inventory_level_min);
                        }
                    }
                })

            }
        })
    }

    loadDetail();

    // change select box UoM group tab general
    $('#select-box-uom-group').on('change', function () {
        $('#uom-code').val('');
        let select_box_default_uom = $('#select-box-default-uom');
        let select_box_uom_name = $('#select-box-uom-name');
        select_box_default_uom.html('');
        select_box_uom_name.html('');
        if ($(this).val()) {
            let data_url = $(this).attr('data-url-detail').replace(0, $(this).val());
            let data_method = $(this).attr('data-method');
            $.fn.callAjax(data_url, data_method).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('uom_group')) {
                        select_box_default_uom.append(`<option></option>`);
                        select_box_uom_name.append(`<option data-code=""></option>`);
                        data.uom_group.uom.map(function (item) {
                            select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                            select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `">` + item.uom_title + `</option>`);
                        })
                    }
                }
            }, (errs) => {
            },)
        }
    })

    // change select box UoM Name in tab inventory
    $('#select-box-uom-name').on('change', function () {
        $('#uom-code').val($(this).find(":selected").attr('data-code'));
    })

    $('#select-box-default-uom').on('change', function () {
        if ($('#check-tab-inventory').is(':checked') === true) {
            if ($('#select-box-uom-name').val() === '') {
                $('#select-box-uom-name').val($(this).val());
                $('#uom-code').val(($('#select-box-uom-name option:selected').attr('data-code')));
            }
        }
    })

    //submit form edit product
    function getDataForm(dataForm) {
        let list_option = []
        let price_list = []
        dataForm['product_type'] = $('#select-box-product-type').val();
        dataForm['product_category'] = $('#select-box-product-category').val();
        dataForm['uom_group'] = $('#select-box-uom-group').val();

        dataForm['default_uom'] = $('#select-box-default-uom').val();
        dataForm['tax_code'] = $('#select-box-tax-code').val();

        dataForm['inventory_uom'] = $('#select-box-uom-name').val();

        $('.ul-price-list .value-price-list').each(function () {
            let is_auto_update = '1';
            if ($(this).attr('data-auto-update') === 'false') {
                is_auto_update = '0';
            }
            if ($(`input[type="checkbox"][data-id="` + $(this).attr('data-id') + `"]`).prop('checked') === true) {
                if ($(this).val() !== '') {
                    price_list.push(
                        {
                            'price_list_id': $(this).attr('data-id'),
                            'price_value': parseFloat($(this).val().replace(/\./g, '').replace(',', '.')),
                            'is_auto_update': is_auto_update,
                        }
                    )
                } else {
                    price_list.push(
                        {
                            'price_list_id': $(this).attr('data-id'),
                            'price_value': 0,
                            'is_auto_update': is_auto_update,
                        }
                    )
                }
            }
        })

        if ($('#check-tab-sale').is(':checked') === true) {
            dataForm['price_list'] = price_list;
            let measurementList = []
            dataForm['currency_using'] = currency_id;

            if ($('[name="length"]').val() === '') {
                delete dataForm['length']
            }
            if ($('[name="width"]').val() === '') {
                delete dataForm['width']
            }
            if ($('[name="height"]').val() === '') {
                delete dataForm['height']
            }
            let inpVolume = $('[name="volume"]');
            let inpWeight = $('[name="weight"]');
            if (inpVolume.val() !== '') {
                measurementList.push({
                    'unit': inpVolume.attr('data-id'),
                    'value': parseFloat(inpVolume.val())
                })
            }
            if (inpWeight.val() !== '') {
                measurementList.push({
                    'unit': inpWeight.attr('data-id'),
                    'value': parseFloat(inpWeight.val())
                })
            }


            dataForm['measure'] = measurementList;
            list_option.push(0)
        } else {
            let list_field_del = ['default_uom', 'tax_code', 'currency_using', 'length', 'width', 'height', 'measure', 'price_list']
            for (const key of list_field_del) {
                if (key in dataForm) {
                    delete dataForm[key];
                }
            }
        }

        if ($('#check-tab-inventory').is(':checked') === true) {
            if (dataForm['inventory_level_min'] === '') {
                delete dataForm['inventory_level_min']
            }
            if (dataForm['inventory_level_max'] === '') {
                delete dataForm['inventory_level_max']
            }
            list_option.push(1)
        } else {
            let list_field_del = ['inventory_uom', 'inventory_level_min', 'inventory_level_max', 'height', 'width', 'length', 'measure']
            for (const key of list_field_del) {
                if (key in dataForm) {
                    delete dataForm[key];
                }
            }
        }

        if ($('#check-tab-purchase').is(':checked') === true) {
            list_option.push(2)
        }

        dataForm['product_choice'] = list_option;
        return dataForm
    }


    form_update_product.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        let dataForm = getDataForm(frm.dataForm);

        $.fn.callAjax(frm.dataUrl.format_url_with_uuid(pk), frm.dataMethod, dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
    })

    function autoSelectPriceListCopyFromSource() {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input[disabled]')
        for (let i = 0; i < element.length; i++) {
            if (element[i].hasAttribute('data-source')) {
                let data_id = element[i].getAttribute('data-source')
                element[i].checked = !!document.querySelector(`input[type="checkbox"][data-id="` + data_id + `"]`).checked;
            }
        }
    }

    $(document).on('click', '.ul-price-list .form-check-input', function () {
        autoSelectPriceListCopyFromSource()
        if ($(this).prop('checked')) {
            $(`input[data-text="` + $(this).attr('data-check') + `"]`).prop('disabled', false)
            $(`input[data-text="` + $(this).attr('data-check') + `"]`).addClass('price-list-change');
        } else {
            $(`input[data-text="` + $(this).attr('data-check') + `"]`).prop('disabled', true)
            let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input:not(:checked)')
            for (let i = 0; i < element.length; i++) {
                document.querySelector(`input[type="text"][data-text="` + element[i].getAttribute('data-check') + `"]`).value = null;
            }
        }

    })

    $(document).on('input', '.ul-price-list .value-price-list', function () {
        $(this).addClass('price-list-change');
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.value-price-list[readonly]')
        for (let i = 0; i < element.length; i++) {
            if (element[i].hasAttribute('data-source')) {
                let data_id = element[i].getAttribute('data-source')
                if (document.querySelector(`input[type="text"][data-id="` + data_id + `"]`).value !== '') {
                    element[i].value = (parseFloat(document.querySelector(`input[type="text"][data-id="` + data_id + `"]`).value.replace(/\./g, '').replace(',', '.')) * element[i].getAttribute('data-factor')).toLocaleString('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    element[i].classList.add('price-list-change');
                }
            }
        }
    })

    const inpDimensionEle = $('.inpDimension')
    const inpVolumeEle = $('input[name="volume"]');
    inpDimensionEle.on('change', function () {
        let dimensions = $('.inpDimension').map(function () {
            return $(this).val();
        }).get();

        let volume = dimensions.reduce(function (a, b) {
            return (a * b).toFixed(2);
        }, 1);

        if (volume === (0).toFixed(2)) {
            inpVolumeEle.val('');
        } else {
            inpVolumeEle.val(volume);
        }
    });

    const item_unit_list = JSON.parse($('#id-unit-list').text());
    const item_unit_dict = item_unit_list.reduce((obj, item) => {
        obj[item.title] = item;
        return obj;
    }, {});
    const warehouse_product_list = JSON.parse($('#warehouse_product_list').text());
    const unit_of_measure_list = JSON.parse($('#unit_of_measure').text());

    function loadBaseItemUnit() {
        let eleVolume = $('#divVolume');
        let eleWeight = $('#divWeight');

        eleVolume.find('.input-suffix').text(item_unit_dict['volume'].measure)
        eleVolume.find('input').attr('data-id', item_unit_dict['volume'].id)
        eleWeight.find('.input-suffix').text(item_unit_dict['weight'].measure)
        eleWeight.find('input').attr('data-id', item_unit_dict['weight'].id)
    }

    loadBaseItemUnit()

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