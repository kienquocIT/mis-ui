// //logic checkbox
// $('#checkbox-copy-source').on('change', function () {
//     if ($(this).prop("checked")) {
//         $('#select-box-price-list').removeAttr('disabled')
//         $('#checkbox-update-auto').removeAttr('disabled');
//         $('#select-box-currency').prop('disabled', true);
//     } else {
//         $('#checkbox-update-auto').prop('checked', false);
//         $('#checkbox-can-delete').prop('checked', false);
//         $('#select-box-price-list').attr('disabled', 'disabled');
//         $('#select-box-price-list').find('option').prop('selected', false);
//         $('#checkbox-update-auto').attr('disabled', 'disabled');
//         $('#checkbox-can-delete').attr('disabled', 'disabled');
//         $('#select-box-currency').prop('disabled', false);
//     }
// })
//
// $('#checkbox-update-auto').on('change', function () {
//     if ($(this).prop("checked")) {
//         $('#checkbox-can-delete').removeAttr('disabled');
//     } else {
//         $('#checkbox-can-delete').prop('checked', false);
//         $('#checkbox-can-delete').attr('disabled', 'disabled');
//     }
// })
$(document).ready(function () {
    function loadCurrency(list_id) {
        $('#select-box-currency').select2();
        let ele = $('#select-box-currency');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('currency_list') && Array.isArray(data.currency_list)) {
                        data.currency_list.map(function (item) {
                            if (list_id.includes(item.id)) {
                                if (item.is_primary === true)
                                    ele.append(`<option disabled data-primary="1" value="` + item.id + `" selected>` + item.title + `</option>`);
                                else
                                    ele.append(`<option disabled data-primary="0" value="` + item.id + `" selected>` + item.title + `</option>`);
                            } else
                                ele.append(`<option data-primary="0" value="` + item.id + `">` + item.title + `</option>`);
                        })
                    }
                }
            }
        )
    }

    function loadSourcePriceList(id) {
        let ele = $('#select-box-price-list')
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {

                    ele.append(`<option></option>`)
                    data.price_list.map(function (item) {
                        if(item.id === id)
                        {
                            ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`);
                        }
                        else
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }

            }
        })
    }

        let frm = $('#form-update-price')
        let pk = window.location.pathname.split('/').pop();
        $.fn.callAjax(frm.attr('data-url').replace(0, pk), 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('price')) {
                        console.log(data)
                        loadCurrency(data.price.currency);
                        $('#select-box-type').val(data.price.price_list_type);
                        $('#inp-factor').val(data.price.factor);
                        if (data.price.auto_update === true) {
                            $('#checkbox-update-auto').prop('checked', true);
                        }
                        if (data.price.can_delete === true) {
                            $('#checkbox-can-delete').prop('checked', true);
                        }
                        loadSourcePriceList(data.price.price_list_mapped);
                    }
                }
            })
    }
)
