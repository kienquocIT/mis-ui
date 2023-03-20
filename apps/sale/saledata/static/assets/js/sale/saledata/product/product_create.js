$(document).ready(function () {


    function disablesTab(check, link_tab, id_tab) {
        if (!check) {
            $(link_tab).addClass('disabled');
            $(id_tab).removeClass('active show');
            $('#tab_general').addClass('active show');
            $('a[href="#tab_general"]').addClass('active');
            $(`a[href="`+id_tab+`"]`).removeClass('active');
        } else {
            $(link_tab).removeClass('disabled');
        }
    }

    $('#check-tab-inventory').change(function () {
        disablesTab(this.checked, '#link-tab-inventory', '#tab_inventory');
        $('#tab_inventory input,#tab_inventory select').val('');
    });

    $('#check-tab-sale').change(function () {
        disablesTab(this.checked, '#link-tab-sale', '#tab_sale');
        $('#tab_sale select').val('');
    });

    $('#check-tab-purchasing').change(function () {
        disablesTab(this.checked, '#link-tab-purchasing');
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

    function loadUoMGroup(){
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

    function loadUnitOfMeasure(){
        let select_box_default_uom = $('#select-box-default-uom');
        let select_box_uom_code = $('#select-box-uom-code');
        let select_box_uom_name = $('#select-box-uom-name');

        $.fn.callAjax(select_box_default_uom.attr('data-url'), select_box_default_uom.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                    select_box_default_uom.append(`<option value="null"></option>`);
                    select_box_uom_name.append(`<option value="null"></option>`);
                    select_box_uom_code.append(`<option value="null"></option>`);
                    resp.data.unit_of_measure.map(function (item) {
                        select_box_default_uom.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                        select_box_uom_name.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                        select_box_uom_code.append(`<option value="` + item.id + `">` + item.code + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    loadProductCategory();
    loadProductType();
    loadUoMGroup();
    loadUnitOfMeasure();
})