$(document).ready(function () {
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
    });

    $('#check-tab-sale').change(function () {
        disabledTab(this.checked, '#link-tab-sale', '#tab_sale');
        $('#tab_sale select').val('');
    });

    $('#check-tab-purchasing').change(function () {
        disabledTab(this.checked, '#link-tab-purchasing');
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
                dataTree[i].child.push({'item': child, 'child': []})
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
                            <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                <input data-source="` + dataTree[i].item.price_list_mapped + `" class="form-check-input" type="checkbox"
                                    value="option1" data-check="check-` + count + `" data-id="` + dataTree[i].item.id + `" disabled>
                                <label class="form-check-label">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-source="` + dataTree[i].item.price_list_mapped + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="" readonly>
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                } else {
                    ele.find('ul').append(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                <input data-source="` + dataTree[i].item.price_list_mapped + `" class="form-check-input" type="checkbox"
                                    value="option1" data-check="check-` + count + `" data-id="` + dataTree[i].item.id + `">
                                <label class="form-check-label">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text inp-can-edit">
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
                            <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                <input data-is-default="1" class="form-check-input" type="checkbox"
                                    value="option1" checked data-check="check-` + count + `" disabled data-id="` + dataTree[i].item.id + `">
                                <label class="form-check-label required">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                <input data-is-default="1" data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list number-separator" type="text" value="">
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                } else {
                    ele.find('ul').append(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                <input class="form-check-input" type="checkbox"
                                    value="option1" data-check="check-` + count + `" data-id="` + dataTree[i].item.id + `">
                                <label class="form-check-label">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text inp-can-edit">
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
                        // console.log(list_price)
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
                                    dataTree.push({'item': item, 'child': []})
                                } else {
                                    dataTree = getTreePriceList(dataTree, item.price_list_mapped, item)
                                }
                            }
                        })
                        appendHtmlForPriceList(dataTree, ele, currency_primary, 0);
                        autoSelectPriceListCopyFromSource()
                        list_price.map(function (item) {
                            if (item.currency_using === currency_primary) {
                                document.querySelector(`input[type="text"][data-id="` + item.id + `"]`).value = item.price.toLocaleString();
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

    let pk = window.location.pathname.split('/').pop();
    let url_detail = $('#form-update-product').attr('data-url').replace(0, pk)

    // get detail product
    $.fn.callAjax(url_detail, 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product')) {
                $('#product-code').val(data.product.code);
                $('#product-title').val(data.product.title);
                loadProductCategory(data.product.general_information.product_category.id);
                loadProductType(data.product.general_information.product_type.id);
                loadUoMGroup(data.product.general_information.uom_group.id);

                let ele = $('#select-box-uom-group')
                let data_url = ele.attr('data-url-detail').replace(0, data.product.general_information.uom_group.id);
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
                            if (Object.keys(data.product.inventory_information).length === 0) {
                                $('#link-tab-inventory').addClass('disabled');
                                $('#tab_inventory').removeClass('active show');
                                $('#check-tab-inventory').prop('checked', false);
                            }
                            if (Object.keys(data.product.sale_information).length === 0) {
                                $('#link-tab-sale').addClass('disabled');
                                $('#tab_sale').removeClass('active show');
                                $('#check-tab-sale').prop('checked', false);
                            } else {
                                if (data.product.sale_information.hasOwnProperty('price_list'))
                                    loadPriceList(data.product.sale_information.price_list);
                                else {
                                    loadPriceList([]);
                                }
                                if (data.product.sale_information.hasOwnProperty('tax_code'))
                                    loadTaxCode(data.product.sale_information.tax_code.id);
                            }
                            data_uom_gr.uom_group.uom.map(function (item) {
                                if (item.uom_id === data.product.sale_information.default_uom.id)
                                    select_box_default_uom.append(`<option value="` + item.uom_id + `" selected>` + item.uom_title + `</option>`);
                                else
                                    select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);

                                if (Object.keys(data.product.inventory_information).length > 0) {
                                    if (item.uom_id === data.product.inventory_information.uom.id) {
                                        select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `" selected>` + item.uom_title + `</option>`);
                                        $('#uom-code').val(item.uom_code);
                                    } else
                                        select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `">` + item.uom_title + `</option>`);
                                }
                            })

                            $('#inventory-level-max').val(data.product.inventory_information.inventory_level_max);
                            $('#inventory-level-min').val(data.product.inventory_information.inventory_level_min);


                            $('.inp-can-edit').focusin(function () {
                                $(this).find('input[class=form-control]').prop('readonly', false);
                                $(this).find('select').removeAttr('readonly');
                            });
                            $('.inp-can-edit').focusout(function () {
                                $(this).find('input[class=form-control]').prop('readonly', true);
                                $(this).find('select').attr('readonly', 'readonly');
                            });
                            $('.inp-can-edit').on('change', function () {
                                $(this).find('input').css({
                                    'border-color': '#00D67F',
                                    'box-shadow': '0 0 0 0.125rem rgba(0, 214, 127, 0.25)'
                                })
                                $(this).find('select').css({
                                    'border-color': '#00D67F',
                                    'box-shadow': '0 0 0 0.125rem rgba(0, 214, 127, 0.25)'
                                })
                            })
                        }
                    }
                })
            }
        }
    })

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
    let form_update_product = $('#form-update-product');
    form_update_product.submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        frm.dataForm['general_information'] = {
            'product_type': $('#select-box-product-type').val(),
            'product_category': $('#select-box-product-category').val(),
            'uom_group': $('#select-box-uom-group').val()
        }

        if ($('#check-tab-inventory').is(':checked') === true) {
            let inventory_level_min = $('#inventory-level-min').val();
            if (inventory_level_min === '') {
                inventory_level_min = null;
            }

            let inventory_level_max = $('#inventory-level-max').val();
            if (inventory_level_max === '') {
                inventory_level_max = null;
            }

            frm.dataForm['inventory_information'] = {
                'uom': $('#select-box-uom-name').val(),
                'inventory_level_min': inventory_level_min,
                'inventory_level_max': inventory_level_max
            }
        } else {
            frm.dataForm['inventory_information'] = {}
        }

        let price_list = []
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
                            'price_value': parseFloat($(this).val().replace(/,/g, '')),
                            'is_auto_update': is_auto_update,
                        }
                    )
                } else {
                    price_list.push(
                        {
                            'price_list_id': $(this).attr('data-id'),
                            'price_value': null,
                            'is_auto_update': is_auto_update,
                        }
                    )
                }
            }
        })

        if ($('#check-tab-sale').is(':checked') === true) {
            frm.dataForm['sale_information'] = {
                'default_uom': $('#select-box-default-uom').val(),
                'tax_code': $('#select-box-tax-code').val()
            }
            if (price_list.length > 0) {
                frm.dataForm['price_list'] = price_list;
                frm.dataForm['sale_information']['currency_using'] = currency_id;
            } else {
                frm.dataForm['price_list'] = null;
                frm.dataForm['sale_information']['currency_using'] = null;
            }
        } else {
            frm.dataForm['sale_information'] = {}
        }

        $.fn.callAjax(frm.dataUrl.replace(0, pk), frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                }
            )
    })

    function autoSelectPriceListCopyFromSource() {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input[disabled]')
        for (let i = 0; i < element.length; i++) {
            if (element[i].hasAttribute('data-source')) {
                let data_id = element[i].getAttribute('data-source')
                if (document.querySelector(`input[type="checkbox"][data-id="` + data_id + `"]`).checked) {
                    element[i].checked = true;
                } else {
                    element[i].checked = false;
                }
            }
        }
    }

    $(document).on('click', '.ul-price-list .form-check-input', function () {
        autoSelectPriceListCopyFromSource()
        if ($(this).prop('checked')) {
            $(`input[data-text="` + $(this).attr('data-check') + `"]`).prop('disabled', false)
        } else {
            $(`input[data-text="` + $(this).attr('data-check') + `"]`).prop('disabled', true)
            let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input:not(:checked)')
            for (let i = 0; i < element.length; i++) {
                document.querySelector(`input[type="text"][data-text="` + element[i].getAttribute('data-check') + `"]`).value = null;
            }
        }

    })

    $(document).on('input', '.ul-price-list .value-price-list', function () {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.value-price-list[readonly]')
        for (let i = 0; i < element.length; i++) {
            if (element[i].hasAttribute('data-source')) {
                let data_id = element[i].getAttribute('data-source')
                if (document.querySelector(`input[type="text"][data-id="` + data_id + `"]`).value !== '') {
                    element[i].value = (parseFloat(document.querySelector(`input[type="text"][data-id="` + data_id + `"]`).value.replace(/,/g, '')) * element[i].getAttribute('data-factor')).toLocaleString();
                }
            }
        }
    })
})