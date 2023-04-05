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
        let ele = $('#select-box-umo-group');
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
                        if(item.type === 0 || item.type === 2)
                            ele.append(`<option value="` + item.id + `">` + item.title + `&nbsp;&nbsp;(<span>` + item.code + `</span>)</option>`);
                    })
                }
            }
        }, (errs) => {
        },)

    }

    function loadPriceList() {
        let ele = $('#select-price-list');
        let html = ``;
        let count = 0;
        let currency_primary;
        let currency_id;
        $.fn.callAjax(ele.attr('data-currency'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('currency_list')) {
                    data.currency_list.map(function (item) {
                        if (item.is_primary === true)
                            currency_primary = item.abbreviation;
                            currency_id = item.id;
                    })
                }
            }
        }, (errs) => {
        },).then(
            (resp) => {
                $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {
                            data.price_list.map(function (item) {
                                if (item.price_list_type.value === 0 && item.auto_update === false) {
                                    if (item.is_default === true) {
                                        html += `<div class="row">
                                            <div class="col-7">
                                                <div class="form-check form-check-inline mt-2">
                                                    <input class="form-check-input" type="checkbox"
                                                        value="option1" checked disabled>
                                                    <label class="form-check-label">` + item.title + `</label>
                                                </div>
                                            </div>
                                            <div class="col-5 form-group">
                                                <span class="input-affix-wrapper affix-wth-text">
                                                    <input data-currency="`+ item.currency_id +`" data-id="` + item.id + `" class="form-control value-price-list" type="text">
                                                    <span class="input-suffix">` + currency_primary + `</span>
                                                </span>
                                            </div>
                                        </div>`
                                    } else {
                                        html += `<div class="row">
                                            <div class="col-7">
                                                <div class="form-check form-check-inline mt-2">
                                                    <input class="form-check-input" type="checkbox"
                                                        value="option1" data-check="check-` + count + `">
                                                    <label class="form-check-label">` + item.title + `</label>
                                                </div>
                                            </div>
                                            <div class="col-5 form-group">
                                                <span class="input-affix-wrapper affix-wth-text">
                                                    <input data-currency="`+ item.currency_id +`" data-id="` + item.id + `" class="form-control value-price-list" type="text" data-text="check-` + count + `" disabled>
                                                    <span class="input-suffix">` + currency_primary + `</span>
                                                </span>    
                                            </div>
                                        </div>`
                                    }
                                    count += 1;
                                }
                            })
                            ele.find('ul').append(html)
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
    $('#select-box-umo-group').on('change', function () {
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
            'uom_group': $('#select-box-umo-group').val()
        }

        if ($('#check-tab-inventory').is(':checked') === true) {
            frm.dataForm['inventory_information'] = {
                'uom': $('#select-box-uom-name').val(),
                'inventory_level_min': $('#inventory-level-min').val(),
                'inventory_level_max': $('#inventory-level-max').val()
            }
        } else {
            frm.dataForm['inventory_information'] = {}
        }

        let price_list = []
        $('.ul-price-list .value-price-list').each(function () {
            if ($(this).val() !== '')
                price_list.push(
                    {
                        'id': $(this).attr('data-id'),
                        'price': $(this).val(),
                        'currency_using': $(this).attr('data-currency')
                    }
                )
        })

        if ($('#check-tab-sale').is(':checked') === true) {
            frm.dataForm['sale_information'] = {
                'default_uom': $('#select-box-default-uom').val(),
                'tax_code': $('#select-box-tax-code').val()
            }
            if (price_list.length > 0)
                frm.dataForm['sale_information']['price_list'] = price_list;
            else
                frm.dataForm['sale_information']['price_list'] = null;
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

    $(document).on('click', '.ul-price-list .form-check-input', function () {
        if ($(this).prop('checked') === true)
            $(`input[data-text="` + $(this).attr('data-check') + `"]`).prop('disabled', false);
        else
            $(`input[data-text="` + $(this).attr('data-check') + `"]`).prop('disabled', true);
    })
})