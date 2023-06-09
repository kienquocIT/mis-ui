$(document).ready(function () {
    $('#rangeInput').on('mousedown', function () {
        return false;
    });

    $('input[name="open_date"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'auto',
        minYear: 2000,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10) + 100
    });

    $('input[name="close_date"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'auto',
        minYear: parseInt(moment().format('YYYY'), 10),
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10) + 100
    });

    function loadProduct() {
        let ele = $('.col-product .select-box-product');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        if (ele.html() !== '') {
            $.fn.callAjax(url, method).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_list')) {
                        ele.append('<option></option>')
                        data.product_list.map(function (item) {
                            ele.append(`<option value="${item.id}">${item.title}</option>`)
                        })
                    }
                }
            })
        }
    }

    loadProduct();

    $('#tab-select a').on('click', function () {
        let data_href = $(this).attr('href');
        switch (data_href) {
            case '#tab_product':
                break;
            case '#tab_competitors':
                break;
            case '#tab_contact_role':
                break;
        }
    })
})