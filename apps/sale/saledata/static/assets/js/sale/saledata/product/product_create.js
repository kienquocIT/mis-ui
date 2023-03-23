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
                    ele.append(`<option value="null"></option>`);
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
                    ele.append(`<option value="null"></option>`);
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
                    ele.append(`<option value="null"></option>`);
                    resp.data.unit_of_measure_group.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    loadProductCategory();
    loadProductType();
    loadUoMGroup();

    // change select box UoM group tab general
    $('#select-box-umo-group').on('change', function (){
        let data_url = $(this).attr('data-url-detail').replace(0,$(this).val());
        let data_method = $(this).attr('data-method');
        let select_box_default_uom = $('#select-box-default-uom');
        let select_box_uom_name = $('#select-box-uom-name');

        $.fn.callAjax(data_url, data_method).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('uom_group')) {
                    select_box_default_uom.append(`<option value="null"></option>`);
                    select_box_uom_name.append(`<option value="null" data-code=""></option>`);
                    data.uom_group.uom.map(function (item) {
                        select_box_default_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                        select_box_uom_name.append(`<option value="` + item.uom_id + `" data-code="` + item.uom_code + `">` + item.uom_title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    })

    // change select box UoM Name in tab inventory
    $('#select-box-uom-name').on('change', function (){
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

        console.log($('#check-tab-inventory').is(':checked'));
        if ($('#check-tab-inventory').is(':checked') === true) {
            frm.dataForm['inventory_information'] = {
                'uom': $('#select-box-uom-name').val(),
                'inventory_level_min': $('#inventory-level-min').val(),
                'inventory_level_max': $('#inventory-level-max').val()
            }
        }

        console.log($('#check-tab-sale').is(':checked'));
        if ($('#check-tab-sale').is(':checked') === true) {
            frm.dataForm['sale_information'] = {
                'default_uom': $('#select-box-default-uom').val()
            }
        }

        console.log(frm.dataForm)
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Tạo mới product"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
    })
})