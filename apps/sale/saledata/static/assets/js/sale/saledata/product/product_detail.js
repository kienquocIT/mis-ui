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

    let pk = window.location.pathname.split('/').pop();
    let url_detail = $('#form-update-product').attr('data-url').replace(0, pk)

    // get detail product
    $.fn.callAjax(url_detail, 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product')) {
                console.log(data)
                let sale_active = true;
                let inventory_active = true;
                $('#product-code').val(data.product.code);
                $('#product-title').val(data.product.title);

                $('#product-title').addClass('inp-can-edit');
                $('#select-box-product-type-div').addClass('inp-can-edit');
                $('#select-box-product-category-div').addClass('inp-can-edit');
                $('#select-box-uom-group-div').addClass('inp-can-edit');
                $('#select-box-default-uom-div').addClass('inp-can-edit');
                $('#select-box-uom-name-div').addClass('inp-can-edit');
                $('#inventory-level-min').addClass('inp-can-edit');
                $('#inventory-level-max').addClass('inp-can-edit');

                loadProductCategory(data.product.general_information.product_category);
                loadProductType(data.product.general_information.product_type);
                loadUoMGroup(data.product.general_information.uom_group);
                if (Object.keys(data.product.inventory_information).length === 0) {
                    $('#link-tab-inventory').addClass('disabled');
                    $('#tab_inventory').removeClass('active show');
                    $('#check-tab-inventory').prop('checked', false);
                    inventory_active = false
                }
                if (Object.keys(data.product.sale_information).length === 0) {
                    $('#link-tab-sale').addClass('disabled');
                    $('#tab_sale').removeClass('active show');
                    $('#check-tab-sale').prop('checked', false);
                    sale_active = false
                }

                let ele = $('#select-box-uom-group')
                let data_url = ele.attr('data-url-detail').replace(0, data.product.general_information.uom_group);
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
                            data_uom_gr.uom_group.uom.map(function (item) {
                                if (item.uom_id === data.product.sale_information.default_uom)
                                    select_box_default_uom.append(`<option value="` + item.uom_id + `" selected>` + item.uom_title + `</option>`);
                                else
                                    select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);

                                if (item.uom_id === data.product.inventory_information.uom) {
                                    select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `" selected>` + item.uom_title + `</option>`);
                                    $('#uom-code').val(item.uom_code);
                                } else
                                    select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `">` + item.uom_title + `</option>`);
                            })

                            $('#inventory-level-max').val(data.product.inventory_information.inventory_level_max);
                            $('#inventory-level-min').val(data.product.inventory_information.inventory_level_min);
                        }
                    }
                }, (errs) => {
                },)

                // mouse enter to edit
                $('.inp-can-edit').mouseenter(function () {
                    $(this).prop("readonly", false);
                    $(this).find('select').prop("disabled", false);
                });
                $('.inp-can-edit').mouseleave(function () {
                    $(this).prop("readonly", true);
                    $(this).find('select').prop("disabled", true);
                });
                $('.inp-can-edit').on('change', function () {
                    if ($(this).is(':input')) {
                        $(this).css({
                            'border-color': '#00D67F',
                            'box-shadow': '0 0 0 0.125rem rgba(0, 214, 127, 0.25)'
                        })
                    }
                    else {
                        $(this).find('select').css({
                            'border-color': '#00D67F',
                            'box-shadow': '0 0 0 0.125rem rgba(0, 214, 127, 0.25)'
                        })
                    }
                })

            }
        }
    }, (errs) => {
    },)


    // change select box UoM group tab general
    $('#select-box-uom-group').on('change', function () {
        if ($(this).val()) {
            let data_url = $(this).attr('data-url-detail').replace(0, $(this).val());
            let data_method = $(this).attr('data-method');
            let select_box_default_uom = $('#select-box-default-uom');
            let select_box_uom_name = $('#select-box-uom-name');
            select_box_default_uom.html('');
            select_box_uom_name.html('');
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
            frm.dataForm['inventory_information'] = {
                'uom': $('#select-box-uom-name').val(),
                'inventory_level_min': $('#inventory-level-min').val(),
                'inventory_level_max': $('#inventory-level-max').val()
            }
        }

        if ($('#check-tab-sale').is(':checked') === true) {
            frm.dataForm['sale_information'] = {
                'default_uom': $('#select-box-default-uom').val()
            }
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
                    // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
    })
})