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

    function loadProductType() {
        let ele = $('#select-box-product-type');
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
        let ele = $('#select-box-product-category');
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
        let ele = $('#select-box-uom-group');
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
        let ele = $('#select-box-tax-code');
        ele.html('');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    ele.append(`<option></option>`);
                    resp.data.tax_list.map(function (item) {
                        if (item.type === 0 || item.type === 2)
                            ele.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
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
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-source="` + dataTree[i].item.price_list_mapped + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list" type="number" step="0.001" value="" readonly>
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
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-source="` + dataTree[i].item.price_list_mapped + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list" type="number" step="0.001" value="" disabled>
                                <span class="input-suffix">` + currency + `</span>
                            </span>
                        </div>
                    </div>`)
                }
            } else {
                if (dataTree[i].item.is_default === true) {
                    ele.find('ul').append(`<div class="row">
                        <div class="col-6">
                            <div class="form-check form-check-inline mt-2 ml-5 inp-can-edit">
                                <input class="form-check-input" type="checkbox"
                                    value="option1" checked data-check="check-` + count + `" disabled data-id="` + dataTree[i].item.id + `">
                                <label class="form-check-label">` + dataTree[i].item.title + `</label>
                            </div>
                        </div>
                        <div class="col-6 form-group">
                            <span class="input-affix-wrapper affix-wth-text inp-can-edit">
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list" type="number" step="0.001" value="">
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
                                <input data-auto-update="` + dataTree[i].item.auto_update + `" data-factor="` + dataTree[i].item.factor + `" data-text="check-` + count + `" data-id="` + dataTree[i].item.id + `" class="form-control value-price-list" type="number" step="0.001" value="" disabled>
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

    function loadPriceList() {
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
        },).then(
            (resp) => {
                let dataTree = [];
                $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {
                            data.price_list.map(function (item) {
                                if (item.price_list_type.value === 0) {
                                    if (item.price_list_mapped === null) {
                                        dataTree.push({'item': item, 'child': []})
                                    } else {
                                        dataTree = getTreePriceList(dataTree, item.price_list_mapped, item)
                                    }
                                }
                            })
                            appendHtmlForPriceList(dataTree, ele, currency_primary, 0);
                            autoSelectPriceListCopyFromSource()
                        }
                    }
                }, (errs) => {
                },)
            }
        )
    }

    loadPriceList();
    loadProductCategory();
    loadProductType();
    loadUoMGroup();
    loadTaxCode();

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

    //submit form create product
    let form_create_product = $('#form-create-product');
    form_create_product.submit(function (event) {
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
                            'price_value': $(this).val(),
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

        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
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
            // $(`input[data-text="`+ $(this).attr('data-check') +`"]`).val(null);
            let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.form-check-input:not(:checked)')
            for (let i = 0; i < element.length; i++) {
                document.querySelector(`input[type="number"][data-text="` + element[i].getAttribute('data-check') + `"]`).value = null;
            }
        }

    })

    $(document).on('input', '.ul-price-list .value-price-list', function () {
        let element = document.getElementsByClassName('ul-price-list')[0].querySelectorAll('.value-price-list[readonly]')
        for (let i = 0; i < element.length; i++) {
            if (element[i].hasAttribute('data-source')) {
                let data_id = element[i].getAttribute('data-source')
                if (document.querySelector(`input[type="number"][data-id="` + data_id + `"]`).value !== '') {
                    element[i].value = document.querySelector(`input[type="number"][data-id="` + data_id + `"]`).value * element[i].getAttribute('data-factor');
                }
            }
        }
    })
})