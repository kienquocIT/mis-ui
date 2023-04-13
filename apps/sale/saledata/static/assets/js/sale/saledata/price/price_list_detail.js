$(document).ready(function () {
    let url_item_detail = $('#datatable-item-list').attr('data-url-detail')
    let config = {
        dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        ordering: false,
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

    function loadUoMGroup() {
        let ele = $('#select-uom-group');
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

// onchange uom-group in modal create new product
    $('#select-uom-group').on('change', function () {
        let select_box_uom = $('#select-uom');
        select_box_uom.html('');
        if ($(this).val()) {
            let data_url = $(this).attr('data-url-detail').replace(0, $(this).val());
            let data_method = $(this).attr('data-method');
            $.fn.callAjax(data_url, data_method).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('uom_group')) {
                        select_box_uom.append(`<option></option>`);
                        data.uom_group.uom.map(function (item) {
                            select_box_uom.append(`<option value="` + item.uom_id + `">` + item.uom_title + `</option>`);
                        })
                    }
                }
            }, (errs) => {
            },)
        }
    })


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
                if (data.price.auto_update) {
                    $('#btn-add-new-product').prop('hidden', true);
                } else {
                    $('#btn-add-new-product').prop('hidden', false);
                }

                if (data.price.is_default) {
                    $('#price_list_name').text(data.price.title.toUpperCase())
                } else {
                    if (data.price.auto_update) {
                        $('#price_list_name').html(data.price.title + `
                            <span class="badge badge-sm badge-soft-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title='Get product from "` + data.price.price_list_mapped.title + `"'>
                                <i class="bi bi-box-arrow-down-right"></i>
                            </span>`
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

                    // add col in table item list (Price Of currency and button Delete item)
                    let index_th = 4
                    let table = $('#datatable-item-list')
                    let body_table = table.find('tbody tr')
                    for (let i = 0; i < product_mapped[0].price.length; i++) {
                        if (i === product_mapped[0].price.length - 1) {
                            table.find('thead tr').children().eq(index_th).after($(`<th class="w-15 price-currency-exists" data-id="` + product_mapped[0].price[i].id + `">Price In ` + product_mapped[0].price[i].abbreviation + `<button type="button" class="" style="background: none; border: none" data-bs-toggle="dropdown"><span class="icon"><span class="feather-icon"><a href="#" class="bi bi-patch-plus ml-3"></a></span></span></button><div role="menu" class="dropdown-menu" id="dropdown-currency"></div></th>`))
                        } else {
                            table.find('thead tr').children().eq(index_th).after($(`<th class="w-15 price-currency-exists" data-id="` + product_mapped[0].price[i].id + `">Price In ` + product_mapped[0].price[i].abbreviation + `</th>`))
                        }
                        for (let j = 0; j < body_table.length; j++) {
                            if (product_mapped[j].price[i].value === 0) {
                                if (product_mapped[j].is_auto_update === true)
                                    body_table[j].innerHTML += `<td><input style="background: None; border: None; pointer-events: None; color: black" class="form-control" type="number" value="" disabled></td>`
                                else
                                    body_table[j].innerHTML += `<td><input class="form-control" type="number" value=""></td>`
                            } else {
                                if (product_mapped[j].is_auto_update === true)
                                    body_table[j].innerHTML += `<td><input style="background: None; border: None; pointer-events: None; color: black" class="form-control" type="number" value="` + product_mapped[j].price[i].value + `" disabled></td>`
                                else
                                    body_table[j].innerHTML += `<td><input class="form-control" type="number" value="` + product_mapped[j].price[i].value + `"></td>`
                            }
                        }
                        index_th += 1
                    }
                    table.find('thead tr').append('<th class="w-5"></th>')
                    for (let i = 0; i < body_table.length; i++) {
                        if(body_table[i].lastElementChild.firstElementChild.hasAttribute('disabled')){
                            body_table[i].innerHTML += '<td></td>'
                        }
                        else
                            body_table[i].innerHTML += `<td><a class="btn btn-icon btn-del"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a></td>`
                    }

                    feather.replace();

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
                    loadUoMGroup();

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
        }).then((resp) => {
        if (config['data'].length === 0) {
            let table = document.getElementById('datatable-item-list')
            table.rows[0].cells[6].remove();
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
    let price_list_add_new_item = [];
    price_list_add_new_item.push({'id': pk, 'factor': 1, 'id_source': ''});

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
                            if (price_list_update.map(obj => obj.id).includes(item.price_list_mapped) && item.auto_update === true)
                                price_list_update.push({
                                    'id': item.id,
                                    'factor': item.factor,
                                    'id_source': item.price_list_mapped
                                });
                        }
                        if (item.is_default === true) {
                            price_list_add_new_item.push({
                                'id': item.id,
                                'factor': item.factor,
                                'id_source': ''
                            });
                        } else {
                            if (price_list_add_new_item.map(obj => obj.id).includes(item.price_list_mapped) && item.auto_update === true)
                                price_list_add_new_item.push({
                                    'id': item.id,
                                    'factor': item.factor,
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
                    }
                )
        })

        // form add new product
        let frm_create_product = $('#form-create-product')
        frm_create_product.submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));
            frm.dataForm['general_information'] = {
                'uom_group': frm.dataForm['uom_group'],
                'product_type': null,
                'product_category': null
            }
            let price_list = [];
            price_list_add_new_item.map(function (item) {
                let value = $('#inp-price').val()
                if (item.id_source === '') {
                    price_list.push({
                        'price_list_id': item.id,
                        'price_value': value,
                        'is_auto_update': '0',
                    })
                } else {
                    price_list.push({
                        'price_list_id': item.id,
                        'price_value': price_list.find(obj => obj.price_list_id === item.id_source).price_value * item.factor,
                        'is_auto_update': '1',
                    })
                }
            })

            frm.dataForm['sale_information'] = {
                'default_uom': frm.dataForm['uom'],
                'tax_code': null,
                'price_list': price_list,
                'currency_using': $('#select-box-currency').find('option[data-primary="1"]').val()
            }
            frm.dataForm['inventory_information'] = {}
            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
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
                    let is_auto_update;
                    if ($(this).find('td:eq(' + index + ')').find('input').prop('disabled') === true) {
                        is_auto_update = true
                    } else
                        is_auto_update = false
                    list_price_of_currency.push({
                        'product_id': product_id,
                        'uom_id': uom_id,
                        'uom_group_id': uom_gr_id,
                        'price': price,
                        'currency': currency_id,
                        'is_auto_update': is_auto_update
                    })
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
                    let is_auto_update;
                    if ($(this).find('td:eq(' + index + ')').find('input').prop('disabled') === true) {
                        is_auto_update = true
                    } else
                        is_auto_update = false
                    list_price_of_currency.push({
                        'product_id': product_id,
                        'uom_id': uom_id,
                        'uom_group_id': uom_gr_id,
                        'price': price,
                        'currency': currency_id,
                        'is_auto_update': is_auto_update
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
                            $.fn.redirectUrl(window.location, 1000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                    }
                )
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

    let table_price_of_currency = $('#table-price-of-currency').html()
    $('#btn-add-new-product').on('click', function () {
        let table = $('#table-price-of-currency')
        table.html('');
        table.append(table_price_of_currency);
        $('#datatable-item-list .th-dropdown').each(function () {
            let thText = $(this).contents().filter(function () {
                return this.nodeType === Node.TEXT_NODE;
            }).text().trim();
            table.find('thead').find('tr').append(`<th class="w-20">` + thText + `&nbsp;<span class="field-required">*</span></th>`)
            table.find('tbody').find('tr').append(`<td><input class="form-control" placeholder="200000" type="number" data-id="` + $(this).attr('data-id') + `"></td>`)
        })
    })

    $('#tab-select-table a').on('click', function () {
        if ($(this).attr('href') === "#tab-item-list") {
            $('#btn-update').attr('form', "form-update-item-price")
        } else {
            $('#btn-update').attr('form', "form-update-price-list")
        }
    })

    $(document).on('click', '.btn-del', function (){
        let index = $(this).closest('tr').index();
        let table = document.getElementById('datatable-item-list');
        table.deleteRow(index + 1);
    })
})

