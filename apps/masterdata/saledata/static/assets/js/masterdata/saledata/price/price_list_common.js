let [urlEle, transEle] = [$('#url-factory'), $('#trans-factory')];
let [priceSelectEle, currencySelectEle, canDeleteCheckBoxEle, autoUpdateCheckBoxEle, factorInputEle, itemSelectEle] = [$('#select-box-price-list'), $('#select-box-currency'), $('#checkbox-can-delete'), $('#checkbox-update-auto'), $('#inp-factor'), $('#select-box-product')]

let columns = [
    {
        className: 'w-5',
        render: () => {
            return '';
        }
    }, {
        data: 'code',
        className: 'w-10',
        render: (data, type, row, meta) => {
            return `<span class="badge badge-outline badge-soft-primary span-product w-100" data-auto-update="${row.is_auto_update}" data-id="${row.id}">${row.code}</span>`
        }
    }, {
        data: 'title',
        className: 'w-55',
        render: (data, type, row, meta) => {
            return `<span class="text-muted fw-bold">${row.title}</span>`
        }
    }, {
        data: 'uom_group',
        className: 'w-15',
        render: (data, type, row, meta) => {
            return `<span class="text-primary span-uom-group" data-id="${row.uom_group.id}">${row.uom_group.title}</span>`
        }
    }, {
        data: 'uom',
        className: 'w-15',
        render: (data, type, row, meta) => {
            return `<span class="text-blue span-uom" data-id="${row.uom.id}">${row.uom.title}</span>`
        }
    },
]

class PriceListAction {
    static generateColCurrency(product_mapped, currencies) {
        let table = $('#datatable-item-list');
        currencies.forEach(function (value, index) {
            table.find('thead tr').append(`<th>${transEle.data('trans-price')} ${value.abbreviation}</th>`)
            columns.push(
                {
                    data: 'price',
                    className: 'min-w-250p',
                    render: (data, type, row, meta) => {
                        let price_get = row.price.filter(function (item) {
                            return item.id === value.id
                        })[0]

                        if (price_get) {
                            if (row.is_auto_update) {
                                return `<input class="form-control mask-money money-input-value" data-abb="${price_get.abbreviation}" data-id-currency="${price_get.id}" value="${price_get.value}" readonly/>`
                            } else {
                                return `<input class="form-control mask-money money-input-value" data-abb="${price_get.abbreviation}" data-id-currency="${price_get.id}" value="${price_get.value}" />`
                            }
                        }
                        return ''
                    }
                },
            )
        })
    }

    static addRow(table, data) {
        data.map(function (item) {
            table.DataTable().row.add(item).draw();
        })
    }

    static loadDtbPriceItem(data, columns) {
        let dtb = $('#datatable-item-list');
        dtb.DataTable().clear().destroy()
        dtb.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            data: data,
            paging: false,
            scrollX: true,
            scrollY: '55vh',
            scrollCollapse: true,
            columns: columns,
            initComplete: function () {
                if ($.fn.getPkDetail()) {
                    dtb.find('tbody tr').each(function () {
                        $(this).find('td:eq(0)').append(`
                            <button hidden type="button" class="btn btn-sm btn-icon btn-flush-danger flush-soft-hover btn-rounded btn-del" data-id="${$.fn.getPkDetail()}">
                                <span class="btn-icon-wrap">
                                    <span class="feather-icon">
                                        <i class="fas fa-trash-alt"></i>
                                    </span>
                                </span>
                             </button>
                        `);
                    })
                }
            }
        });
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

    static getDataItemChangePrice() {
        let list_result = [];
        let ele_changed = document.querySelectorAll('.inp-edited');
        ele_changed.forEach(function (element) {
            let tr_parent_ele = element.closest('tr');
            let product_id = tr_parent_ele.querySelector('.span-product').getAttribute('data-id');
            let uom_id = tr_parent_ele.querySelector('.span-uom').getAttribute('data-id');
            let uom_group_id = tr_parent_ele.querySelector('.span-uom-group').getAttribute('data-id');
            let price = element.getAttribute('value');
            let currency = element.getAttribute('data-id-currency');
            list_result.push(
                {
                    'product_id': product_id,
                    'uom_id': uom_id,
                    'uom_group_id': uom_group_id,
                    'currency': currency,
                    'price': price
                }
            )
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

    static loadDetailPage(frm, pk, page_type) {
        $.fn.callAjax2({
            url: frm.data('url').format_url_with_uuid(pk),
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let price_list_detail = data?.['price'];
                    $('#data_detail').text(JSON.stringify(price_list_detail));
                    $.fn.compareStatusShowPageAction(price_list_detail)

                    if (price_list_detail.is_default) {
                        $('#price_list_name').text(price_list_detail.title.toUpperCase());
                        $('#config-modal input, #config-modal select').not(currencySelectEle).prop('disabled', true);
                    } else {
                        if (price_list_detail.auto_update) {
                            $('#price_list_name').html(`${price_list_detail.title}
                                <i class="fas fa-info-circle icon-info" data-bs-toggle="tooltip" data-bs-placement="bottom" title='${transEle.data('trans-source-price')} ${price_list_detail.price_list_mapped.title}'>
                            </i>`)
                        } else {
                            $('#price_list_name').text(price_list_detail.title)
                        }
                    }

                    $('#price-list-title').val(price_list_detail.title)

                    autoUpdateCheckBoxEle.prop('checked', price_list_detail.auto_update);
                    currencySelectEle.prop('disabled', price_list_detail.auto_update);
                    $('#btn-add-new-item').prop('disabled', price_list_detail.auto_update);
                    $('.btn-group-import-datatable').prop('disabled', price_list_detail.auto_update);
                    if (page_type !== 1) {
                        $('#inp-factor').prop('disabled', !price_list_detail.auto_update)
                    }
                    let timeValidEle = $('#time-valid');

                    if (price_list_detail.valid_time_start && price_list_detail.valid_time_start) {
                        if (price_list_detail.is_default) {
                            timeValidEle.html(`<span>${moment(price_list_detail.valid_time_start.split(' ')[0]).format('DD/MM/YYYY')} - ${transEle.data('trans-now')}</span>`)
                        } else {
                            timeValidEle.html(`<span>${moment(price_list_detail.valid_time_start.split(' ')[0]).format('DD/MM/YYYY')} - ${moment(price_list_detail.valid_time_end.split(' ')[0]).format('DD/MM/YYYY')}</span>`)
                        }
                    }


                    let product_mapped = PriceListAction.getProductWithCurrency(price_list_detail?.['products_mapped'], price_list_detail.currency);
                    PriceListAction.generateColCurrency(product_mapped, price_list_detail.currency);
                    PriceListAction.loadDtbPriceItem([], columns);
                    PriceListAction.addRow($('#datatable-item-list'), product_mapped.sort((a, b) => a.code.localeCompare(b.code)));


                    // load data tab settings
                    $('#select-box-type').val(price_list_detail?.['price_list_type']);

                    factorInputEle.val(price_list_detail.factor);

                    canDeleteCheckBoxEle.prop('checked', price_list_detail.can_delete);


                    // load parent price list
                    PriceListLoadPage.loadSourcePriceList(priceSelectEle, price_list_detail?.['price_list_mapped'])
                    if (Object.keys(price_list_detail?.['price_list_mapped']).length !== 0) {
                        if (page_type !== 1)
                            autoUpdateCheckBoxEle.prop('disabled', false);
                    } else {
                        autoUpdateCheckBoxEle.prop('disabled', true);
                    }

                    PriceListLoadPage.loadCurrency(currencySelectEle, price_list_detail.currency);

                    if (price_list_detail.status) {
                        if (price_list_detail.status === 'Valid') {
                            timeValidEle.find('span').addClass('text-green')
                        } else if (price_list_detail.status === 'Invalid') {
                            timeValidEle.find('span').addClass('text-orange')
                        } else if (price_list_detail.status === 'Expired') {
                            timeValidEle.find('span').addClass('text-red')

                            $('#btn-add-new-item').prop('disabled', true);
                            $('#datatable-item-list input').prop('readonly', true);
                            $('#datatable-item-list .del-button').remove();
                            $('#notify').text(`* {0} {1}`.format_by_idx(price_list_detail.status, transEle.data('trans-not-modify')))
                            factorInputEle.prop('disabled', true);
                            autoUpdateCheckBoxEle.prop('disabled', true);
                            canDeleteCheckBoxEle.prop('disabled', true);
                            currencySelectEle.prop('disabled', true);
                        } else {
                            timeValidEle.find('span').addClass('text-gray')
                        }
                    }

                    if (page_type) {
                        $('.modal').find('select').prop('disabled', true)
                        $('.modal').find('input').prop('disabled', true).prop('readonly', true)
                    }
                }
            }).then(
            () => {
                if (page_type === 1) {
                    $('#datatable-item-list input').prop('readonly', true);
                }
            }
        )
    }
}
