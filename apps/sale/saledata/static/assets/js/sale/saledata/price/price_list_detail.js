$(document).ready(function () {
    $('.select2').select2();
    let url_item_detail = $('#datatable-item-list').attr('data-url-detail')
    const currency_list = JSON.parse($('#id-currency-list').text());
    const currency_dict = currency_list.reduce((obj, item) => {
        obj[item.id] = item;
        return obj;
    }, {});
    let config = {
        dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        ordering: false,
        paging: false,
        columnDefs: [{
            "searchable": false, "orderable": true, // "targets": [0,1,3,4,5,6,7,8,9]
        }],
        order: [[2, 'asc']],
        language: {
            search: "",
            searchPlaceholder: "Search",
        },
        drawCallback: function () {
            $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
            feather.replace();
        },
        data: [],
        columns: [{
            className: 'wrap-text',
            'render': (data, type, row, meta) => {
                let currentId = String(meta.row + 1)
                return currentId;
            }
        }, {
            className: 'wrap-text',
            'data': 'code', render: (data, type, row, meta) => {
                return `<span class="badge badge-soft-success btn-detail" data-id="` + row.id + `"
                        style="min-width: max-content; width: 70%" href="#"><b>` + row.code + `</b></span>`
            }
        }, {
            className: 'wrap-text',
            'data': 'title', render: (data, type, row, meta) => {
                return `<span><b>` + row.title + `</b></span>`
            }
        }, {
            className: 'wrap-text',
            'data': 'uom_group', 'render': (data, type, row, meta) => {
                return `<div class="row"><center>
                        <div class="col-10" style="padding-right: 5px">
                            <span class="badge badge-soft-danger badge-pill span-uom-group" data-id="` + row.uom_group.id + `" style="min-width: max-content; width: 100%">` + row.uom_group.title + `</span>
                        </div></center>
                    </div>`
            }
        }, {
            className: 'wrap-text',
            'data': 'uom', 'render': (data, type, row, meta) => {
                return `<div class="row"><center>
                    <div class="col-10" style="padding-right: 5px"><span class="badge badge-soft-blue badge-pill span-uom" data-id="` + row.uom.id + `" style="min-width: max-content; width: 100%">` + row.uom.title + `</span></div>
                    </center></div>`
            }
        },]
    }

    function initDataTable(config, id_table) {
        /*DataTable Init*/
        let dtb = $(id_table);
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            // targetDt.column(2).order('asc').draw();
            /*Checkbox Add*/
            $(document).on('click', '.del-button', function () {
                targetDt.rows('.selected').remove().draw(false);
                return false;
            });
            let html = $('.waiter-miner-item').html();
            $("div.blog-toolbar-left").html(html.replace('hidden', ''));
            dtb.parent().addClass('table-responsive');
        }
    }

    // load for tab setting and dropdown add currency for price lust
    function loadCurrency(list_id, currency_list) {
        let ele = $('#select-box-currency');
        currency_list.map(function (item) {
                if (item.is_primary === true) {
                    ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`);
                } else {
                    if (list_id.includes(item.id)) {
                        ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`);
                    } else {
                        ele.append(`<option data-primary="0" value="` + item.id + `">` + item.title + `</option>`);
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
                        if (item.id === id) {
                            ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`);
                        } else
                            ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                    })
                }

            }
        })
    }

    function loadProDuctCategory() {
        let element = $('#select-product-category');
        $.fn.callAjax(element.attr('data-url'), element.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_category_list')) {
                    element.append(`<option></option>`)
                    data.product_category_list.map(function (item) {
                        element.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadProduct() {
        let ele = $('#select-box-product');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_list')) {
                    ele.append(`<option value="0"></option>`);
                    resp.data.product_list.map(function (item) {
                        if (Object.keys(item.sale_information).length > 0)
                            ele.append(`<option value="` + item.id + `">` + item.code + ` - ` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function loadExpense() {
        let ele = $('#select-box-product');
        $.fn.callAjax(ele.attr('data-url-expense'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('expense_list')) {
                    ele.append(`<option value="0"></option>`);
                    resp.data.expense_list.map(function (item) {
                        ele.append(`<option value="` + item.id + `">` + item.code + ` - ` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }


    function getProductWithCurrency(list_product, currency) {
        console.log(list_product)
        let list_result = []
        list_product.map(function (item) {
            if (list_result.length === 0 || !list_result.find(obj => obj.id === item.id)) {
                list_result.push({
                    'code': item.code,
                    'id': item.id,
                    'title': item.title,
                    'uom': item.uom,
                    'uom_group': item.uom_group,
                    'price': [{
                        'id': item.currency_using.id,
                        'abbreviation': item.currency_using.abbreviation,
                        'value': item.price
                    }],
                    'is_auto_update': item.is_auto_update,
                })
            } else {
                let exists = list_result.filter(function (obj){
                    return obj.id === item.id;
                })
                if (!exists.find(obj => obj.uom.id === item.uom.id)) {
                    list_result.push({
                        'code': item.code,
                        'id': item.id,
                        'title': item.title,
                        'uom': item.uom,
                        'uom_group': item.uom_group,
                        'price': [{
                            'id': item.currency_using.id,
                            'abbreviation': item.currency_using.abbreviation,
                            'value': item.price
                        }],
                        'is_auto_update': item.is_auto_update,
                    })
                } else {
                    list_result.find(obj => obj.id === item.id && obj.uom.id === item.uom.id).price.push({
                        'id': item.currency_using.id,
                        'abbreviation': item.currency_using.abbreviation,
                        'value': item.price
                    })
                }
            }
        })
        console.log(list_result)

        list_result.map(function (item) {
            if (item.price.length !== currency.length) {
                currency.map(function (id) {
                    if (!item.price.map(obj => obj.id).includes(id)) {
                        item.price.push({
                            'id': id,
                            'abbreviation': currency_dict[id].abbreviation,
                            'value': 0
                        })
                    }
                })
            }

        })
        return list_result
    }

    function loadUoM(group_id, id) {
        let ele = $('#chooseUoM');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                    ele.append(`<option value="0"></option>`);
                    console.log(data)
                    resp.data.unit_of_measure.map(function (item) {
                        if (item.group.id === group_id) {
                            if (item.id === id) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.code + ` - ` + item.title + `</option>`);
                            } else
                                ele.append(`<option value="` + item.id + `">` + item.code + ` - ` + item.title + `</option>`);
                        }
                    })
                }
            }
        }, (errs) => {
        },)
    }

// load detail price list
    let frm = $('#form-update-price-list')
    let pk = window.location.pathname.split('/').pop();
    $.fn.callAjax(frm.attr('data-url').replace(0, pk), 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.price.auto_update || data.price.is_default) {
                    $('#btn-add-new-item').prop('hidden', true);
                } else {
                    $('#btn-add-new-item').prop('hidden', false);
                }

                if (data.price.is_default) {
                    $('#price_list_name').text(data.price.title.toUpperCase())
                } else {
                    $('#setting-nav').removeClass('disabled');
                    if (data.price.auto_update) {
                        $('#price_list_name').html(data.price.title + `
                        <i class="fas fa-info-circle icon-info" data-bs-toggle="tooltip" data-bs-placement="bottom" title='Get product from "` + data.price.price_list_mapped.title + `"'>
                        </i>`
                        )
                    } else {
                        $('#price_list_name').text(data.price.title)
                    }
                }

                if (data.price.valid_time_start && data.price.valid_time_start) {
                    if (data.price.is_default) {
                        $('#apply_time').html(`From <span style="min-width: max-content;" class="badge badge-soft-primary">` + data.price.valid_time_start + `</span> to <span style="min-width: max-content;" class="badge badge-soft-primary">now</span>`)
                    } else {
                        $('#apply_time').html(`From <span style="min-width: max-content;" class="badge badge-soft-primary">` + data.price.valid_time_start + `</span> to <span style="min-width: max-content;" class="badge badge-soft-primary">` + data.price.valid_time_end + `</span>`)
                    }
                }

                if (data.price.status) {
                    let badge_type = '';
                    if (data.price.status === 'Valid') {
                        badge_type = 'badge-green'
                    } else if (data.price.status === 'Invalid') {
                        badge_type = 'badge-orange'
                    } else if (data.price.status === 'Expired') {
                        badge_type = 'badge-red'
                    } else {
                        badge_type = 'badge-gray'
                    }

                    $('#status').html(`<span class="badge badge-indicator badge-indicator-xl ` + badge_type + `"></span><span>&nbsp;` + data.price.status + `</span>`)
                }

                $('#inp-source').val(data.price.price_list_mapped.id)
                if (data.hasOwnProperty('price')) {
                    let dropdown = $('.dropdown-currency');
                    data.price.currency.map(function (item) {
                        let abbreviation = currency_dict[item].abbreviation
                        dropdown.append(`<div class="form-check form-check mt-2">
                            <input data-id="` + item + `" class="form-check-input display-currency" type="checkbox" id="check-` + abbreviation + `" value="option1" checked>
                            <label class="form-check-label" for=check-` + abbreviation + `">` + abbreviation + `</label>
                        </div>`)
                    })
                    let product_mapped = getProductWithCurrency(data.price.products_mapped, data.price.currency)
                    config['data'] = product_mapped.sort(function (a, b) {
                        return a.code - b.code;
                    });
                    initDataTable(config, '#datatable-item-list');
                    loadCurrency(data.price.currency, currency_list);

                    // add column in table item list (Price Of currency and button Delete item)
                    if (product_mapped.length != 0) {
                        let index_th = 4
                        let table = $('#datatable-item-list')
                        let body_table = table.find('tbody tr')
                        let price_longest = product_mapped.reduce((acc, cur) => {
                            if (cur.price.length > acc.price.length) {
                                return cur;
                            }
                            return acc;
                        });
                        product_mapped.filter(item => item.price.length < price_longest.price.length).map(function (item) {
                            let ids = item.price.map(item => item.id);
                            price_longest.price.forEach(obj => {
                                if (!ids.includes(obj.id)) {
                                    item.price.push({'id': obj.id, 'abbreviation': obj.abbreviation, 'value': 0});
                                }
                            });
                        });

                        product_mapped.map(function (item) {
                            const order = price_longest.price.map(item => item.id);
                            item.price.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
                        })

                        // create thead
                        for (let i = 0; i < price_longest.price.length; i++) {
                            if (i === price_longest.price.length - 1) {
                                table.find('thead tr').children().eq(index_th).after($(`<th class="w-15 price-currency-exists text-center" data-id="` + price_longest.price[i].id + `">Price In ` + price_longest.price[i].abbreviation + `</th>`))
                            } else {
                                table.find('thead tr').children().eq(index_th).after($(`<th class="w-15 price-currency-exists text-center" data-id="` + price_longest.price[i].id + `">Price In ` + price_longest.price[i].abbreviation + `</th>`))
                            }
                            index_th += 1
                        }

                        // create tbody
                        for (let j = 0; j < body_table.length; j++) {
                            for (let i = 0; i < product_mapped[j].price.length; i++) {
                                if (product_mapped[j].price[i].value === 0) {
                                    if (product_mapped[j].is_auto_update === true)
                                        body_table[j].innerHTML += `<td><input style="background: None; border: None; pointer-events: None; color: black; min-width: max-content" class="form-control text-center number-separator" type="text" value="" disabled></td>`
                                    else
                                        body_table[j].innerHTML += `<td><input class="form-control text-center number-separator" type="text" value="" style="min-width: max-content"></td>`
                                } else {
                                    if (product_mapped[j].is_auto_update === true)
                                        body_table[j].innerHTML += `<td><input style="background: None; border: None; pointer-events: None; color: black; min-width: max-content" class="form-control text-center number-separator" type="text" value="` + product_mapped[j].price[i].value.toLocaleString('de-DE', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }) + `" disabled></td>`
                                    else
                                        body_table[j].innerHTML += `<td><input class="form-control text-center number-separator" type="text" value="` + product_mapped[j].price[i].value.toLocaleString('de-DE', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        }) + `" style="min-width: max-content"></td>`
                                }
                            }
                        }

                        // create button del
                        if (data.price.is_default !== true) {
                            table.find('thead tr').append('<th class="w-5"></th>')
                            for (let i = 0; i < body_table.length; i++) {
                                if (body_table[i].lastElementChild.firstElementChild.hasAttribute('disabled')) {
                                    if (data.price.can_delete === true) {
                                        body_table[i].innerHTML += `<td><a class="btn btn-icon btn-del btn btn-icon btn-flush-dark btn-rounded del-button"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a></td>`
                                    } else {
                                        body_table[i].innerHTML += '<td></td>'
                                    }
                                } else
                                    body_table[i].innerHTML += `<td><a class="btn btn-icon btn-del btn btn-icon btn-flush-dark btn-rounded del-button"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a></td>`
                            }
                            feather.replace();
                        }
                    }

                    // load data tab settings
                    $('#select-box-type').val(data.price.price_list_type);
                    $('#select-box-type').prop('disabled', true);
                    $('#select-box-type').css({'border': 'None', 'color': 'black'});
                    $('#inp-factor').val(data.price.factor);
                    if (data.price.auto_update === true) {
                        $('#checkbox-update-auto').prop('checked', true);
                        $('#select-product-category').prop('disabled', 'disabled');
                        $('#select-box-currency').prop('disabled', 'disabled');
                        $('#checkbox-can-delete').prop('disabled', false);
                        $('#btn-add-new-item').hide();
                    }
                    if (data.price.can_delete === true) {
                        $('#checkbox-can-delete').prop('checked', true);
                    }
                    if (Object.keys(data.price.price_list_mapped).length !== 0) {
                        loadSourcePriceList(data.price.price_list_mapped.id);
                        $('#checkbox-update-auto').prop('disabled', false);
                    }
                    loadProDuctCategory();

                    // edit field
                    $('.inp-can-edit select').mouseenter(function () {
                        $(this).css('cursor', 'text');
                    })
                    $('.inp-can-edit').focusin(function () {
                        $(this).find('input[class=form-control]').prop('readonly', false);
                        $(this).find('select').removeAttr('readonly');
                    });
                    $('.inp-can-edit').focusout(function () {
                        $(this).find('input[class=form-control]').attr('readonly', true);
                        $(this).find('select').attr('readonly', 'readonly');
                    });
                    $('.inp-can-edit').on('change', function () {
                        $(this).find('input[class=form-control]').css({
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

//onchage checkbox auto-update
    $('#checkbox-update-auto').on('change', function () {
        if ($(this).prop("checked")) {
            $('#select-product-category').prop('disabled', 'disabled');
            $('#select-box-currency').prop('disabled', 'disabled');
            $('#checkbox-can-delete').removeAttr('disabled');
            $('#btn-add-new-item').hide();
            if ($('#inp-source').val() !== '') {
                $.fn.callAjax(frm.attr('data-url').replace(0, $('#inp-source').val()), 'GET').then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $('#select-box-currency').val(data.price.currency).trigger("change");
                        }
                    })
            }
        } else {
            $('#checkbox-can-delete').prop('checked', false);
            $('#btn-add-new-item').show();
            $('#select-product-category').removeAttr('disabled');
            $('#select-box-currency').removeAttr('disabled');
        }
    })

// submit form setting price list
    let price_list_update = [];
    price_list_update.push({'id': pk, 'factor': 1, 'id_source': ''});
    $.fn.callAjax($('#form-update-price-list').attr('data-url-list'), 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('price_list')) {
                data.price_list.map(function (item) {
                    if (item.price_list_type.value === 0) {
                        if (price_list_update.length === 0) {
                            price_list_update.push({'id': item.id, 'factor': item.factor, 'id_source': ''});
                        } else {
                            if (price_list_update.map(obj => obj.id).includes(item.price_list_mapped))
                                price_list_update.push({
                                    'id': item.id,
                                    'factor': item.factor * price_list_update.find(obj => obj.id === item.price_list_mapped).factor,
                                    'id_source': item.price_list_mapped
                                });
                        }
                    }
                })
            }
        }
    }).then((resp) => {
        // form update price list
        frm.submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));
            frm.dataForm['currency'] = $('#select-box-currency').val();
            frm.dataForm['currency'].push($('#select-box-currency').find('option[data-primary="1"]').val())
            if (frm.dataForm['currency'].length === 0) {
                frm.dataForm['currency'] = null;
            }

            if (frm.dataForm['apply_for'] === '') {
                delete frm.dataForm.apply_for
            }
            frm.dataForm['price_list_child'] = price_list_update.map(obj => obj.id);

            if (frm.dataForm['auto_update'] === undefined) {
                frm.dataForm['auto_update'] = false
            }

            if (frm.dataForm['can_delete'] === undefined) {
                frm.dataForm['can_delete'] = false
            }
            frm.dataForm['currency'] = $('#select-box-currency').val()

            $.fn.callAjax(frm.dataUrl.replace(0, pk), frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            setTimeout(function () {
                                location.reload()
                            }, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    })
        })

        // form add new product
        let frm_create_product = $('#form-create-product')
        frm_create_product.submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));
            let price_list = [];
            price_list_update.map(function (item) {
                $('#table-price-of-currency tbody tr td').each(function () {
                    let value = $(this).find('input').val()
                    if (value === '') {
                        value = 0;
                    } else {
                        value = parseFloat(value.replace(/\./g, '').replace(',', '.'))
                    }
                    if (item.id_source === '') {
                        price_list.push({
                            'price_list_id': item.id,
                            'price_value': value,
                            'is_auto_update': '0',
                            'currency_using': $(this).find('input').attr('data-id')
                        })
                    } else {
                        price_list.push({
                            'price_list_id': item.id,
                            'price_value': value * item.factor,
                            'is_auto_update': '1',
                            'currency_using': $(this).find('input').attr('data-id')
                        })
                    }
                })
            })

            let data_product = {
                'id': $('#select-box-product').val(),
                'uom': frm.dataForm['uom'],
                'uom_group': $('#inp-uom-group').attr('data-id'),
            }

            frm.dataForm['list_price_list'] = price_list;
            frm.dataForm['product'] = data_product;
            $.fn.callAjax(frm.dataUrl.replace(0, pk), frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            setTimeout(function () {
                                location.reload()
                            }, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        })

        // form update item price
        let frm_update_item_price = $('#form-update-item-price')
        frm_update_item_price.submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));
            frm.dataForm['list_price'] = price_list_update

            let list_price_of_currency = [];
            $('.price-currency-exists').each(function () {
                let index = $(this).index()
                let currency_id = $(this).attr('data-id')
                $('#datatable-item-list tbody tr').each(function () {
                    let product_id = $(this).find('.btn-detail').attr('data-id')
                    let uom_id = $(this).find('.span-uom').attr('data-id')
                    let uom_gr_id = $(this).find('.span-uom-group').attr('data-id')
                    let price = $(this).find('td:eq(' + index + ')').find('input').val();
                    if (price === '') {
                        price = 0;
                    } else {
                        price = parseFloat(price.replace(/\./g, '').replace(',', '.'))
                    }
                    if ($(this).find('td:eq(' + index + ')').find('input').hasClass('inp-edited') === true) {
                        list_price_of_currency.push({
                            'product_id': product_id,
                            'uom_id': uom_id,
                            'uom_group_id': uom_gr_id,
                            'price': price,
                            'currency': currency_id,
                        })
                    }
                });
            })

            $('.th-dropdown').each(function () {
                let index = $(this).index()
                let currency_id = $(this).attr('data-id')
                $('#datatable-item-list tbody tr').each(function () {
                    let product_id = $(this).find('.btn-detail').attr('data-id')
                    let uom_id = $(this).find('.span-uom').attr('data-id')
                    let uom_gr_id = $(this).find('.span-uom-group').attr('data-id')
                    let price = $(this).find('td:eq(' + index + ')').find('input').val();
                    if (price === '') {
                        price = 0;
                    } else {
                        price = parseFloat(price.replace(/\./g, '').replace(',', '.'))
                    }
                    list_price_of_currency.push({
                        'product_id': product_id,
                        'uom_id': uom_id,
                        'uom_group_id': uom_gr_id,
                        'price': price,
                        'currency': currency_id,
                    })
                });
            })
            frm.dataForm['list_item'] = list_price_of_currency
            $.fn.callAjax(frm.dataUrl.replace(0, pk), frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            setTimeout(function () {
                                location.reload()
                            }, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    })
        })
    })

// add input price in modal create new product
    let table_price_of_currency = $('#table-price-of-currency').html()
    $('#btn-add-new-item').on('click', function () {
        if ($('#select-box-type').val() === '0')
            loadProduct();
        else if ($('#select-box-type').val() === '2') {
            loadExpense();
        }
        let table = $('#table-price-of-currency')
        table.html('');
        table.append(table_price_of_currency);
        if ($('#datatable-item-list tbody tr').first().find('td').length === 1) {
            let currency = $('#select-box-currency').find('option[data-primary="1"]')
            table.find('thead').find('tr').append(`<th class="w-20">` + currency.text() + `&nbsp;<span class="field-required">*</span></th>`)
            table.find('tbody').find('tr').append(`<td><input class="form-control number-separator" placeholder="200000" type="text" data-id="` + currency.val() + `"></td>`)
        } else {
            $('#datatable-item-list .price-currency-exists').each(function () {
                let thText = $(this).contents().filter(function () {
                    return this.nodeType === Node.TEXT_NODE;
                }).text().trim();
                table.find('thead').find('tr').append(`<th class="w-20">` + thText + `&nbsp;<span class="field-required">*</span></th>`)
                table.find('tbody').find('tr').append(`<td><input class="form-control number-separator" placeholder="200000" type="text" data-id="` + $(this).attr('data-id') + `"></td>`)
            })
            $('#datatable-item-list .th-dropdown').each(function () {
                let thText = $(this).contents().filter(function () {
                    return this.nodeType === Node.TEXT_NODE;
                }).text().trim();
                table.find('thead').find('tr').append(`<th class="w-20">` + thText + `&nbsp;<span class="field-required">*</span></th>`)
                table.find('tbody').find('tr').append(`<td><input class="form-control number-separator" placeholder="200000" type="text" data-id="` + $(this).attr('data-id') + `"></td>`)
            })
        }
    })

    $('#tab-select-table a').on('click', function () {
        if ($(this).attr('href') === "#tab-item-list") {
            $('#btn-update').attr('form', "form-update-item-price")
        } else {
            $('#btn-update').attr('form', "form-update-price-list")
        }
    })

// delete item

    $(document).on('click', '.btn-del', function () {
        if (confirm("Confirm Delete ?") === true) {
            let product_id = $(this).closest('tr').find('.btn-detail').attr('data-id');
            let uom_id = $(this).closest('tr').find('.span-uom').attr('data-id');
            let data_url = $(this).closest('table').attr('data-url-delete').replace(0, pk)
            let data = {
                'list_price': price_list_update,
                'product_id': product_id,
                'uom_id': uom_id
            }
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(data_url, 'PUT', data, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            setTimeout(function () {
                                location.reload()
                            }, 1000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                    })
        }
    })

//on change price in table item
    $(document).on('input', '#datatable-item-list input.form-control', function () {
        $(this).addClass('inp-edited');
    })

    $('#select-box-product').on('change', function () {
        if ($(this).val() !== '0') {
            $('#save-product-selected').prop('disabled', false);
            let data_url = $(this).closest('select').attr('data-url-detail').replace(0, $(this).val());
            $.fn.callAjax(data_url, 'GET').then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    console.log(data)
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product')) {
                        $('#inp-code').val(data.product.code);
                        $('#inp-uom-group').val(data.product.general_information.uom_group.title);
                        $('#inp-uom-group').attr('data-id', data.product.general_information.uom_group.id);
                        loadUoM(data.product.general_information.uom_group.id, data.product.sale_information.default_uom.id);
                    }
                }
            })
        } else {
            $('#inp-code').val('');
            $('#inp-uom-group').val('');
            $('#chooseUoM option:selected').prop('selected', false);
            $('#save-product-selected').prop('disabled', true);
        }
    })

    //display currency

    $(document).on('change', '.display-currency', function () {
        let dataId = $(this).attr('data-id')
        let col = $(`.price-currency-exists[data-id="` + dataId + `"]`);
        if (!$(this).is(`:checked`)) {
            col.hide()
            $('table tr').each(function () {
                $(this).find('td').eq(col.index()).hide();
            });
        } else {
            col.show();
            $('table tr').each(function () {
                $(this).find('td').eq(col.index()).show();
            });
        }
    })
})

