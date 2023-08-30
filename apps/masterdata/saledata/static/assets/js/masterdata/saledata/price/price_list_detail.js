let [urlEle, transEle] = [$('#url-factory'), $('#trans-factory')];
let [priceSelectEle, currencySelectEle, canDeleteCheckBoxEle, autoUpdateCheckBoxEle, factorInputEle, itemSelectEle] = [$('#select-box-price-list'), $('#select-box-currency'), $('#checkbox-can-delete'), $('#checkbox-update-auto'), $('#inp-factor'), $('#select-box-product')]

let columns = [
    {
        render: (data, type, row, meta) => {
            return '';
        }
    }, {
        data: 'code',
        render: (data, type, row, meta) => {
            return `<span class="badge badge-soft-success btn-detail" data-id="` + row.id + `"
                        style="min-width: max-content; width: 70%" href="#"><b>` + row.code + `</b></span>`
        }
    }, {
        data: 'title',
        render: (data, type, row, meta) => {
            return `<span><b>` + row.title + `</b></span>`
        }
    }, {
        data: 'uom_group',
        render: (data, type, row, meta) => {
            return `<div class="row">
                        <div class="col-10" style="padding-right: 5px">
                            <span class="badge badge-soft-danger badge-pill span-uom-group" data-id="` + row.uom_group.id + `" style="min-width: max-content; width: 100%">` + row.uom_group.title + `</span>
                        </div>
                    </div>`
        }
    }, {
        data: 'uom',
        render: (data, type, row, meta) => {
            return `<div class="row">
                    <div class="col-10" style="padding-right: 5px"><span class="badge badge-soft-blue badge-pill span-uom" data-id="` + row.uom.id + `" style="min-width: max-content; width: 100%">` + row.uom.title + `</span></div>
                    </div>`
        }
    },]

class PriceListAction {
    static generateColCurrency(product_mapped) {
        let temp_price = product_mapped[0].price;
        let table = $('#datatable-item-list');
        temp_price.forEach(function (value, index) {
            table.find('thead tr').append(`<th>{0} {1}</th>`.format_by_idx(transEle.data('trans-price'), value.abbreviation))
            columns.push(
                {
                    data: 'price',
                    render: (data, type, row, meta) => {
                        if (row.is_auto_update) {
                            return `<input class="form-control mask-money" data-id-currency="${data[index].id}" value="${data[index].value}" readonly/>`
                        } else {
                            return `<input class="form-control mask-money" data-id-currency="${data[index].id}" value="${data[index].value}" />`
                        }
                    }
                },
            )
        })
        this.addColDel(table);
    }

    static addColDel(table) {
        table.find('thead tr').append(`<th></th>`)
        columns.push(
            {
                render: (data, type, row, meta) => {
                    return `<a class="btn btn-icon btn-del btn btn-icon btn-flush-danger flush-soft-hover btn-rounded del-button"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`

                }
            },
        )
    }

    static callData(url, method) {
        return $.fn.callAjax2({
            url: url,
            method: method,
        }).then((resp) => {
            return $.fn.switcherResp(resp);
        });
    }

    static loadDtbPriceItem(data, columns) {
        if (!$.fn.DataTable.isDataTable('#datatable-item-list')) {
            let dtb = $('#datatable-item-list');
            dtb.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
                data: data,
                paging: false,
                columns: columns,
            });
        }
    }

    static async getChildPriceList(pk) {
        let price_list_update = [];
        price_list_update.push({
            'id': pk,
            'factor': 1,
            'id_source': ''
        });
        let price_data = await this.callData(urlEle.data('url-list'), 'GET');
        if (price_data.hasOwnProperty('price_list')) {
            price_data.price_list.map(function (item) {
                if (item.status === 'Valid' || item.status === 'Invalid') {
                    if (price_list_update.map(obj => obj.id).includes(item?.['price_list_mapped']))
                        price_list_update.push({
                            'id': item.id,
                            'factor': item.factor * price_list_update.find(obj => obj.id === item?.['price_list_mapped']).factor,
                            'id_source': item?.['price_list_mapped']
                        });

                }
            })
        }
        return price_list_update
    }

    static getProductWithCurrency(list_product, currency) {
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
                let exists = list_result.filter(function (obj) {
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

        list_result.map(function (item) {
            if (item.price.length !== currency.length) {
                currency.map(function (obj) {
                    if (!item.price.map(obj => obj.id).includes(obj.id)) {
                        item.price.push({
                            'id': obj.id,
                            'abbreviation': obj.abbreviation,
                            'value': 0
                        })
                    }
                })
            }

        })
        return list_result
    }
}

class PriceListLoadPage {
    static loadSourcePriceList(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadCurrency(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadItem(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadUoM(ele, data, group_id) {
        ele.initSelect2({
            data: data,
            dataParams: {'group': group_id},
        })

    }

    static loadDetailPage(frm, pk) {
        $.fn.callAjax2({
            url: frm.data('url').format_url_with_uuid(pk),
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let price_list_detail = data?.['price'];
                    $.fn.compareStatusShowPageAction(price_list_detail)

                    if (price_list_detail.is_default) {
                        $('#price_list_name').text(price_list_detail.title.toUpperCase())
                    } else {
                        if (price_list_detail.auto_update) {
                            $('#price_list_name').html(price_list_detail.title + `
                        <i class="fas fa-info-circle icon-info" data-bs-toggle="tooltip" data-bs-placement="bottom" title='Get product from "` + price_list_detail.price_list_mapped.title + `"'>
                        </i>`
                            )
                        } else {
                            $('#price_list_name').text(price_list_detail.title)
                        }
                    }

                    if (price_list_detail.auto_update) {
                        autoUpdateCheckBoxEle.prop('checked', true);
                        currencySelectEle.prop('disabled', true);
                        $('#btn-add-new-item').prop('disabled', true);
                    }

                    if (price_list_detail.valid_time_start && price_list_detail.valid_time_start) {
                        if (price_list_detail.is_default) {
                            $('#apply_time').html(`From <span style="min-width: max-content;" class="badge badge-soft-primary badge-outline">` + price_list_detail.valid_time_start + `</span> to <span style="min-width: max-content;" class="badge badge-soft-primary badge-outline">now</span>`)
                        } else {
                            $('#apply_time').html(`From <span style="min-width: max-content;" class="badge badge-soft-primary badge-outline">` + price_list_detail.valid_time_start + `</span> to <span style="min-width: max-content;" class="badge badge-soft-primary badge-outline">` + price_list_detail.valid_time_end + `</span>`)
                        }
                    }


                    let product_mapped = PriceListAction.getProductWithCurrency(price_list_detail?.['products_mapped'], price_list_detail.currency)
                    PriceListAction.generateColCurrency(product_mapped);
                    PriceListAction.loadDtbPriceItem(product_mapped.sort(function (a, b) {
                        return a.code - b.code;
                    }), columns)


                    // load data tab settings
                    $('#select-box-type').val(price_list_detail?.['price_list_type']);

                    factorInputEle.val(price_list_detail.factor);

                    canDeleteCheckBoxEle.prop('checked', price_list_detail.can_delete);


                    // load parent price list
                    PriceListLoadPage.loadSourcePriceList(priceSelectEle, price_list_detail?.['price_list_mapped'])
                    if (Object.keys(price_list_detail?.['price_list_mapped']).length !== 0) {
                        autoUpdateCheckBoxEle.prop('disabled', false);
                    } else {
                        autoUpdateCheckBoxEle.prop('disabled', true);
                    }

                    PriceListLoadPage.loadCurrency(currencySelectEle, price_list_detail.currency);

                    if (price_list_detail.status) {
                        let badge_type;
                        let text_type;
                        if (price_list_detail.status === 'Valid') {
                            badge_type = 'badge-green'
                            text_type = 'text-green'
                        } else if (price_list_detail.status === 'Invalid') {
                            badge_type = 'badge-orange'
                            text_type = 'text-orange'
                        } else if (price_list_detail.status === 'Expired') {
                            badge_type = 'badge-red'
                            text_type = 'text-red'
                            this.loadPriceExpired(price_list_detail);
                        } else {
                            badge_type = 'badge-gray'
                            text_type = 'text-gray'
                        }

                        $('#status').html(`<span class="badge badge-indicator badge-indicator-xl ` + badge_type + `"></span><span class="` + text_type + `">&nbsp;` + price_list_detail.status + `</span>`);
                    }
                }
            })
    }

    static loadPriceExpired(price_list_detail) {
        $('#btn-add-new-item').prop('disabled', true);
        $('#datatable-item-list input').prop('readonly', true);

        $('#datatable-item-list .del-button').remove();
        $('#notify').text(`* {0} {1}`.format_by_idx(price_list_detail.status, transEle.data('trans-not-modify')))
        factorInputEle.prop('disabled', true);
        autoUpdateCheckBoxEle.prop('disabled', true);
        canDeleteCheckBoxEle.prop('disabled', true);
        currencySelectEle.prop('disabled', true);
    }
}


$(document).ready(async function () {

// load detail price list
    let frm = $('#form-update-price-list');
    let pk = $.fn.getPkDetail();
    PriceListLoadPage.loadDetailPage(frm, pk);


// onchange checkbox auto-update
    autoUpdateCheckBoxEle.on('change', function () {
        if ($(this).prop("checked")) {
            $('#select-product-category').prop('disabled', 'disabled');
            currencySelectEle.prop('disabled', 'disabled');
            canDeleteCheckBoxEle.removeAttr('disabled');
            $.fn.callAjax2({
                url: frm.data('url').format_url_with_uuid(priceSelectEle.val()),
                method: 'GET',
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        PriceListLoadPage.loadCurrency(currencySelectEle, data?.['price_list_detail'].currency);
                    }
                })

        } else {
            canDeleteCheckBoxEle.prop('checked', false);
            currencySelectEle.removeAttr('disabled');
        }
    })

// submit form setting price list
    frm.submit(async function (event) {
        event.preventDefault();
        let frm = new SetupFormSubmit($(this));
        let price_list_update = await PriceListAction.getChildPriceList(pk);
        frm.dataForm['currency'] = currencySelectEle.val();
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

        $.fn.callAjax2({
            url: frm.dataUrl.format_url_with_uuid(pk),
            method: frm.dataMethod,
            data: frm.dataForm
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                    setTimeout(function () {
                        location.reload()
                    }, 1000);
                }
            },
            (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            })


        // form add new item
        let frm_create_product = $('#form-create-product')
        frm_create_product.submit(function (event) {
            event.preventDefault();
            let frm = new SetupFormSubmit($(this));
            let price_list = [];
            price_list_update.map(function (item) {
                if (item.id_source === '') {
                    price_list.push({
                        'price_list_id': item.id,
                        'price_value': 0,
                        'is_auto_update': '0',
                    })
                } else {
                    price_list.push({
                        'price_list_id': item.id,
                        'price_value': 0,
                        'is_auto_update': '1',
                    })
                }
            })

            let data_product = {
                'id': itemSelectEle.val(),
                'uom': $('#select-uom').val(),
                'uom_group': $('#inp-uom-group').attr('data-id'),
            }
            frm.dataForm['list_price_list'] = price_list;
            frm.dataForm['product'] = data_product;
            $.fn.callAjax2({
                url: frm.dataUrl.format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
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
    })

// form update item price
    let frm_update_item_price = $('#form-update-item-price')
    frm_update_item_price.submit(async function (event) {
        event.preventDefault();
        let price_list_update = await PriceListAction.getChildPriceList(pk);
        let frm = new SetupFormSubmit($(this));
        frm.dataForm['list_price'] = price_list_update;

        let list_price_of_currency = [];
        // $('.th-dropdown').each(function () {
        //     let index = $(this).index()
        //     let currency_id = $(this).attr('data-id')
        //     $('#datatable-item-list tbody tr').each(function () {
        //         let product_id = $(this).find('.btn-detail').attr('data-id')
        //         let uom_id = $(this).find('.span-uom').attr('data-id')
        //         let uom_gr_id = $(this).find('.span-uom-group').attr('data-id')
        //         let price = $(this).find('td:eq(' + index + ')').find('input').val();
        //         if (price === '') {
        //             price = 0;
        //         } else {
        //             price = parseFloat(price.replace(/\./g, '').replace(',', '.'))
        //         }
        //         list_price_of_currency.push({
        //             'product_id': product_id,
        //             'uom_id': uom_id,
        //             'uom_group_id': uom_gr_id,
        //             'price': price,
        //             'currency': currency_id,
        //         })
        //     });
        // })
        frm.dataForm['list_item'] = list_price_of_currency
        if (frm.dataForm['list_item'].length > 0) {
            $.fn.callAjax2({
                url: frm.dataUrl.format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: $('#base-trans-factory').data('success')}, 'success')
                        setTimeout(function () {
                            location.reload()
                        }, 1000);
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                })
        } else {
            $.fn.notifyB({description: 'Nothing to change'}, 'warning');
        }
    })

    $('#btn-add-new-item').on('click', function () {
        let type = $('#select-box-type').val();
        switch (type) {
            case '0':
                itemSelectEle.attr('data-keyResp', 'product_sale_list');
                itemSelectEle.attr('data-url', urlEle.data('url-product'));
                PriceListLoadPage.loadItem(itemSelectEle);
                break;
            case '2':
                itemSelectEle.attr('data-keyResp', 'expense_list');
                itemSelectEle.attr('data-url', urlEle.data('url-expense'));
                PriceListLoadPage.loadItem(itemSelectEle);
                break;
        }
    })


// delete item
    $(document).on('click', '.btn-del', function () {
        Swal.fire({
            html:
                '<div><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div>' +
                '<h6 class="text-danger">Delete this item ?</h6>',
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-danger',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container: 'swal2-has-bg'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
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
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                setTimeout(function () {
                                    location.reload()
                                }, 1000);
                            }
                        },
                        () => {
                            Swal.fire({
                                html:
                                    '<div><h6 class="text-danger mb-0">Can not delete this item!</h6></div>',
                                customClass: {
                                    content: 'text-center',
                                    confirmButton: 'btn btn-primary',
                                },
                                buttonsStyling: false,
                            })
                        })
            }
        })
    })

// on change price in table item
    $(document).on('input', '#datatable-item-list input.form-control', function () {
        $(this).addClass('inp-edited');
    })

    itemSelectEle.on('change', function () {
        let item = SelectDDControl.get_data_from_idx($(this), $(this).val());
        $('#save-product-selected').prop('disabled', false);
        let type = $('#select-box-type').val();

        let code_ele = $('#inp-code');
        let uom_gr_ele = $('#inp-uom-group');
        let uom_ele = $('#select-box-uom');

        switch (type) {
            case '0':
                code_ele.val(item.code);
                uom_gr_ele.attr('data-id', item?.['general_information'].uom_group.id);
                uom_gr_ele.val(item?.['general_information'].uom_group.title);
                PriceListLoadPage.loadUoM(uom_ele, {}, item?.['general_information'].uom_group.id);
                break;
            case '2':
                code_ele.val(item.code);
                uom_gr_ele.attr('data-id', item.uom_group.id);
                uom_gr_ele.val(item.uom_group.title);
                PriceListLoadPage.loadUoM(uom_ele, {}, item.uom_group.id);
                break;
        }
    })

    $('#setting-nav').on('click', function () {
        $('#btn-update').attr('form', 'form-update-price-list');
    })
    $('#products-nav').on('click', function () {
        $('#btn-update').attr('form', 'form-update-item-price');
    })
})
