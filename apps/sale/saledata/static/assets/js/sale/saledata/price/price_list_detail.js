$(document).ready(function () {
    let url_item_detail = $('#datatable-item-list').attr('data-url-detail')
    let config = {
        dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        ordering: false,
        paging: false,
        columnDefs: [{
            "searchable": false, "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
        }],
        order: [2, 'asc'],
        language: {
            search: "",
            searchPlaceholder: "Search",
            info: "_START_ - _END_ of _TOTAL_",
            sLengthMenu: "View  _MENU_",
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>', // or '?'
                previous: '<i class="ri-arrow-left-s-line"></i>' // or '?'
            }
        },
        drawCallback: function () {
            $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
            feather.replace();
        },
        data: [],
        columns: [{
            'render': (data, type, row, meta) => {
                let currentId = "chk_sel_" + String(meta.row + 1)
                return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
            }
        }, {
            'data': 'code', render: (data, type, row, meta) => {
                return `<a class="badge badge-outline badge-soft-success btn-detail" data-id="` + row.id + `"
                            style="min-width: max-content; width: 70%" href="` + url_item_detail.replace(0, row.id) + `"><center><span><b>` + row.code + `</b></span></center></a>`
            }
        }, {
            'data': 'title', render: (data, type, row, meta) => {
                return `<a class="btn-detail" href="` + url_item_detail.replace(0, row.id) + `" data-id="` + row.id + `">
                        <span><b>` + row.title + `</b></span>
                    </a>`
            }
        }, {
            'data': 'uom_group', 'render': (data, type, row, meta) => {
                return `<div class="row">
                        <div class="col-6" style="padding-right: 5px"><span class="badge badge-soft-danger badge-pill span-uom-group" data-id="` + row.uom_group.id + `" style="min-width: max-content; width: 100%">` + row.uom_group.title + `</span></div>
                        </div>`
            }
        }, {
            'data': 'uom', 'render': (data, type, row, meta) => {
                return `<div class="row">
                        <div class="col-6" style="padding-right: 5px"><span class="badge badge-soft-blue badge-pill span-uom" data-id="` + row.uom.id + `" style="min-width: max-content; width: 100%">` + row.uom.title + `</span></div>
                        </div>`
            }
        },]
    }

    function initDataTable(config, id_table) {
        /*DataTable Init*/
        let dtb = $(id_table);
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            /*Checkbox Add*/
            $(document).on('click', '.del-button', function () {
                targetDt.rows('.selected').remove().draw(false);
                return false;
            });
            $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-120p"><option selected>Bulk actions</option><option value="1">Edit</option><option value="2">Move to trash</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"> <label class="flex-shrink-0 mb-0 me-2">Sort by:</label> <select class="form-select form-select-sm w-130p"><option selected>Date Created</option><option value="1">Date Edited</option><option value="2">Frequent Contacts</option><option value="3">Recently Added</option> </select></div> <select class="d-flex align-items-center w-130p form-select form-select-sm"><option selected>Export to CSV</option><option value="2">Export to PDF</option><option value="3">Send Message</option><option value="4">Delegate Access</option> </select>');
            dtb.parent().addClass('table-responsive');
        }
    }

    function loadCurrency(list_id) {
        $('#select-box-currency').select2();
        let ele = $('#select-box-currency');
        let dropdown = $('#dropdown-currency')
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    if (data.hasOwnProperty('currency_list') && Array.isArray(data.currency_list)) {
                        data.currency_list.map(function (item) {
                            if ($('.price-currency-exists').map(function () {
                                return $(this).data('id');
                            }).get().includes(item.id)
                            ) {
                                dropdown.prepend(`<a class="dropdown-item bg-light bg-gradient" data-id="` + item.id + `">` + item.abbreviation + `</a>`)
                            } else {
                                dropdown.append(`<a class="dropdown-item btn-add-price" href="#" data-id="` + item.id + `">` + item.abbreviation + `</a>`)
                            }
                            if (list_id.includes(item.id)) {
                                if (item.is_primary === true) {
                                    ele.append(`<option disabled data-primary="1" value="` + item.id + `" selected>` + item.title + `</option>`);
                                } else
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

    function loadProduct(list_item) {
        let ele = $('#select-box-product');
        $.fn.callAjax(ele.attr('data-url'), ele.attr('data-method')).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_list')) {
                    ele.append(`<option value="0"></option>`);
                    resp.data.product_list.map(function (item) {
                        if (!list_item.includes(item.id) && Object.keys(item.sale_information).length > 0)
                            ele.append(`<option value="` + item.id + `">` + item.code + ` - ` + item.title + `</option>`);
                    })
                }
            }
        }, (errs) => {
        },)
    }

    function getProductWithCurrency(list_product) {
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
                list_result.find(obj => obj.id === item.id).price.push({
                    'id': item.currency_using.id,
                    'abbreviation': item.currency_using.abbreviation,
                    'value': item.price
                })
            }
        })
        return list_result
    }

// load detail price list
    let frm = $('#form-update-price-list')
    let pk = window.location.pathname.split('/').pop();
    $.fn.callAjax(frm.attr('data-url').replace(0, pk), 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.price.auto_update || data.price.is_default) {
                    $('#btn-add-new-product').prop('hidden', true);
                } else {
                    $('#btn-add-new-product').prop('hidden', false);
                }

                if (data.price.is_default) {
                    $('#price_list_name').text(data.price.title.toUpperCase())
                } else {
                    if (data.price.auto_update) {
                        $('#price_list_name').html(data.price.title + `
                            &nbsp;<i class="fas fa-info-circle" style="font-size: smaller" data-bs-toggle="tooltip" data-bs-placement="bottom" title='Get product from "` + data.price.price_list_mapped.title + `"'></i>`
                        )
                    } else {
                        $('#price_list_name').text(data.price.title)
                    }
                }
                $('#inp-source').val(data.price.price_list_mapped.id)
                if (data.hasOwnProperty('price')) {
                    let product_mapped = getProductWithCurrency(data.price.products_mapped)
                    config['data'] = product_mapped;
                    initDataTable(config, '#datatable-item-list');

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
                                table.find('thead tr').children().eq(index_th).after($(`<th class="w-15 price-currency-exists text-center" data-id="` + price_longest.price[i].id + `">Price In ` + price_longest.price[i].abbreviation + `<br><center><button type="button" class="" style="background: none; border: none" data-bs-toggle="dropdown"><span class="icon"><span class="feather-icon"><a href="#" class="bi bi-patch-plus"></a></span></span></button><div role="menu" class="dropdown-menu" id="dropdown-currency"></div></center></th>`))
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
                                        body_table[j].innerHTML += `<td><input style="background: None; border: None; pointer-events: None; color: black; min-width: max-content" class="form-control text-center" type="number" min="0" step="0.001" value="" disabled></td>`
                                    else
                                        body_table[j].innerHTML += `<td><input class="form-control text-center" type="number" min="0" step="0.001" value="" style="min-width: max-content"></td>`
                                } else {
                                    if (product_mapped[j].is_auto_update === true)
                                        body_table[j].innerHTML += `<td><input style="background: None; border: None; pointer-events: None; color: black; min-width: max-content" class="form-control text-center" type="number" min="0" step="0.001" value="` + product_mapped[j].price[i].value + `" disabled></td>`
                                    else
                                        body_table[j].innerHTML += `<td><input class="form-control text-center" type="number" step="0.001" min="0" value="` + product_mapped[j].price[i].value + `" style="min-width: max-content"></td>`
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
                                    body_table[i].innerHTML += `<td><a class="btn btn-icon btn-del"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a></td>`
                            }
                            feather.replace();
                        }
                    }

                    loadProduct(product_mapped.map(obj => obj.id));
                    loadCurrency(data.price.currency);

                    // load data tab settings
                    $('#select-box-type').val(data.price.price_list_type);
                    $('#inp-factor').val(data.price.factor);
                    if (data.price.auto_update === true) {
                        $('#checkbox-update-auto').prop('checked', true);
                        $('#select-product-category').prop('disabled', 'disabled');
                        $('#select-box-currency').prop('disabled', 'disabled');
                        $('#checkbox-can-delete').prop('disabled', false);
                        $('#btn-add-new-product').hide();
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
            $('#btn-add-new-product').hide();
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
            $('#btn-add-new-product').show();
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
            $.fn.callAjax(frm.dataUrl.replace(0, pk), frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            $.fn.redirectUrl(window.location, 1000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
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
                    if (item.id_source === '') {
                        let value = $(this).find('input').val();
                        if (value === '') {
                            value = null;
                        }
                        price_list.push({
                            'price_list_id': item.id,
                            'price_value': value,
                            'is_auto_update': '0',
                            'currency_using': $(this).find('input').attr('data-id')
                        })
                    } else {
                        price_list.push({
                            'price_list_id': item.id,
                            'price_value': price_list.find(obj => obj.price_list_id === item.id_source).price_value * item.factor,
                            'is_auto_update': '1',
                            'currency_using': $(this).find('input').attr('data-id')
                        })
                    }
                })
            })

            let data_product = {
                'id': $('#select-box-product').val(),
                'uom': $('#inp-uom').attr('data-id'),
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
                        // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
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
                        // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                    })
        })
    })

// add new price for currency in table list item
    $(document).on('click', '.btn-add-price', function () {
        $(this).addClass('bg-light bg-gradient')
        $(this).removeClass('btn-add-price')
        $('.th-dropdown .dropdown-menu').html($('#dropdown-currency').html().replaceAll('btn-add-price', 'btn-change-price'));
        $('.th-dropdown .dropdown-menu').append(`<li><hr class="dropdown-divider"></li><li><a class="dropdown-item btn-del-price" href="#">Delete</a></li>`)
        let table = document.getElementById('datatable-item-list')
        if (table.rows[1].childNodes.length !== 1) {
            let index = 0;
            if (table.rows[0].lastElementChild.childElementCount === 0) {
                index = table.rows[0].cells.length - 1;
            } else {
                index = table.rows[0].cells.length;
            }

            let rows = table.getElementsByTagName("tr");
            let cell = rows[0].insertCell(index);
            let th = document.createElement('th');
            th.textContent = 'Price In ' + $(this).text();
            th.className = "dropdown th-dropdown"
            th.setAttribute('data-id', $(this).attr('data-id'));
            th.innerHTML += `<a class="ml-2 pb-3" data-bs-toggle="dropdown" href="#">...</a><div role="menu" class="dropdown-menu">` + document.getElementById('dropdown-currency').innerHTML.replaceAll("btn-add-price", "btn-change-price") + `<li><hr class="dropdown-divider"></li><li><a class="dropdown-item btn-del-price" href="#">Delete</a></li></div>`
            cell.outerHTML = th.outerHTML;
            for (let i = 1; i < rows.length; i++) {
                let input = document.createElement("input");
                input.type = "number";
                input.className = "form-control"
                // input.setAttribute('disabled', true);
                if (rows[i].lastElementChild.previousElementSibling.lastElementChild.hasAttribute('disabled')) {
                    input.setAttribute('disabled', true);
                }
                let cell = rows[i].insertCell(index);
                cell.appendChild(input);
            }
        }
    })

// change price currency in table list item
    $(document).on('click', '.btn-change-price', function () {
        let element = $(this).closest('th')
        let thText = element.contents().filter(function () {
            return this.nodeType === Node.TEXT_NODE;
        }).text().trim();
        let html = element.html().replace(thText, "Price In " + $(this).text())
        element.html(html);
        let old_dropdown_primary = $(`#dropdown-currency .dropdown-item[data-id="` + element.attr('data-id') + `"]`)
        let new_dropdown_primary = $(`#dropdown-currency .dropdown-item[data-id="` + $(this).attr('data-id') + `"]`)
        old_dropdown_primary.addClass('btn-add-price')
        old_dropdown_primary.removeClass('bg-light bg-gradient')
        new_dropdown_primary.removeClass('btn-add-price')
        new_dropdown_primary.addClass('bg-light bg-gradient')

        let old_dropdown = $(`.th-dropdown .dropdown-item[data-id="` + element.attr('data-id') + `"]`)
        let new_dropdown = $(`.th-dropdown .dropdown-item[data-id="` + $(this).attr('data-id') + `"]`)
        old_dropdown.addClass('btn-change-price')
        old_dropdown.removeClass('bg-light bg-gradient')
        new_dropdown.removeClass('btn-change-price')
        new_dropdown.addClass('bg-light bg-gradient')

        element.attr('data-id', $(this).attr('data-id'))
    })

// delete price for currency in table list item
    $(document).on('click', '.btn-del-price', function () {
        let index = $(this).closest('th').index();
        let dropdown_primary = $(`#dropdown-currency .dropdown-item[data-id="` + $(this).closest('th').attr('data-id') + `"]`)
        dropdown_primary.addClass('btn-add-price')
        dropdown_primary.removeClass('bg-light bg-gradient')

        let dropdown = $(`.th-dropdown .dropdown-item[data-id="` + $(this).closest('th').attr('data-id') + `"]`)
        dropdown.addClass('btn-change-price')
        dropdown.removeClass('bg-light bg-gradient')
        let table = document.getElementById("datatable-item-list");
        let rows = table.getElementsByTagName("tr");

        for (let i = 0; i < rows.length; i++) {
            rows[i].deleteCell(index);
        }
    })

    // add input price in modal create new product
    let table_price_of_currency = $('#table-price-of-currency').html()
    $('#btn-add-new-product').on('click', function () {
        let table = $('#table-price-of-currency')
        table.html('');
        table.append(table_price_of_currency);
        if ($('#datatable-item-list tbody tr').first().find('td').length === 1) {
            let currency = $('#select-box-currency').find('option[data-primary="1"]')
            table.find('thead').find('tr').append(`<th class="w-20">` + currency.text() + `&nbsp;<span class="field-required">*</span></th>`)
            table.find('tbody').find('tr').append(`<td><input class="form-control" placeholder="200000" type="number" min="0" step="0.001" data-id="` + currency.val() + `"></td>`)
        } else {
            $('#datatable-item-list .price-currency-exists').each(function () {
                let thText = $(this).contents().filter(function () {
                    return this.nodeType === Node.TEXT_NODE;
                }).text().trim();
                table.find('thead').find('tr').append(`<th class="w-20">` + thText + `&nbsp;<span class="field-required">*</span></th>`)
                table.find('tbody').find('tr').append(`<td><input class="form-control" placeholder="200000" type="number" min="0" step="0.001" data-id="` + $(this).attr('data-id') + `"></td>`)
            })
            $('#datatable-item-list .th-dropdown').each(function () {
                let thText = $(this).contents().filter(function () {
                    return this.nodeType === Node.TEXT_NODE;
                }).text().trim();
                table.find('thead').find('tr').append(`<th class="w-20">` + thText + `&nbsp;<span class="field-required">*</span></th>`)
                table.find('tbody').find('tr').append(`<td><input class="form-control" placeholder="200000" type="number" min="0" step="0.001" data-id="` + $(this).attr('data-id') + `"></td>`)
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
            let data_url = $(this).closest('table').attr('data-url-delete').replace(0, pk)
            let data = {
                'product_id': product_id,
            }
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(data_url, 'PUT', data, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            $.fn.redirectUrl(window.location, 1000);
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
                        $('#inp-uom').val(data.product.sale_information.default_uom.title);
                        $('#inp-uom').attr('data-id', data.product.sale_information.default_uom.id);
                    }
                }
            })
        }
        else {
            $('#inp-code').val('');
            $('#inp-uom-group').val('');
            $('#inp-uom').val('');
            $('#save-product-selected').prop('disabled', true);
        }
    })
})
