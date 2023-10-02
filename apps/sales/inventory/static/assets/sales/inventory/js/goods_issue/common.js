let urlEle = $('#url-factory');
let transEle = $('#trans-factory');

class GoodsIssueLoadPage {
    static loadInventoryAdjustment(ele, data) {
        ele.initSelect2({
            data: data,
            callbackTextDisplay: function (item) {
                return `${item?.['code']} - ${item?.['title']}` || '';
            }
        }).on('change', function () {
            let url = urlEle.data('url-ia-product').format_url_with_uuid($(this).val());
            let tableEle = $('#dtbProductIA');
            tableEle.DataTable().clear().draw();
            $.fn.callAjax(url, 'GET').then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('ia_product_list')) {
                        let product_list = data?.['ia_product_list'].filter(function (obj) {
                            return (obj.book_quantity - obj.count) > 0;
                        });
                        let data_dict = {};
                        product_list.map(function (item) {
                            if (!item.action_status) {
                                data_dict[item.id] = item;
                                tableEle.DataTable().row.add(item).draw();
                            }
                        })
                        $('#data-ia-product').text(JSON.stringify(data_dict));
                    }
                })
        })
    }

    static loadWarehouse(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static getListPrProductSelected(ele) {
        let list_selected = []
        $('#dtbProductLiquidation .box-select-product').not(ele).each(function () {
            list_selected.push($(this).val());
        })
        return list_selected
    }

    static loadProduct(ele, data, warehouse, list_selected) {
        ele.initSelect2({
            data: data,
            'dataParams': {'warehouse_id': warehouse},
            callbackDataResp(resp, keyResp) {
                let list_result = [];
                resp.data[keyResp].map(function (item) {
                    if (!list_selected.includes(item.id)) {
                        list_result.push(item)
                    }
                })
                return list_result
            },
            callbackTextDisplay: function (item) {
                return item?.['product_data']?.['title'] || '';
            },
        })
    }

    static loadDtbProductForIA(data) {
        if (!$.fn.DataTable.isDataTable('#dtbProductIA')) {
            let dtb = $('#dtbProductIA');
            dtb.DataTableDefault({
                data: data,
                reloadCurrency: true,
                columns: [
                    {
                        data: 'product_mapped',
                        render: (data, type, row, meta) => {
                            return `<span class="col-product" data-id="${row.id}">${data.title}</span>`
                        },
                    }, {
                        render: (data, type, row) => {
                            return `<input type="text" class="form-control col-remarks">`
                        },
                    }, {
                        data: 'uom_mapped',
                        render: (data, type, row) => {
                            return `<span class="col-uom">${data.title}</span>`;
                        },
                    }, {
                        render: (data, type, row) => {
                            return `<input class="form-control col-quantity" readonly value="${row.book_quantity - row.count}" />`;
                        },
                    }, {
                        data: 'warehouse_mapped',
                        render: (data, type, row, meta) => {
                            return `<span class="col-warehouse">${data.title}</span>`
                        },
                    }, {
                        render: (data, type, row) => {
                            return `<input class="form-control mask-money col-unit-cost"/>`;
                        },
                    }, {
                        data: 'subtotal',
                        render: (data, type, row) => {
                            return `<input class="form-control mask-money col-subtotal" readonly/>`;
                        },
                    },
                ],
            });
        }
    }

    static loadDtbProductForLiquidation(data) {
        if (!$.fn.DataTable.isDataTable('#dtbProductLiquidation')) {
            let dtb = $('#dtbProductLiquidation');
            dtb.DataTableDefault({
                data: data,
                reloadCurrency: true,
                columns: [
                    {
                        render: (data, type, row, meta) => {
                            return `<select class="box-select-wh form-select" data-method="GET" data-url="${urlEle.data('url-warehouse')}" data-keyResp="warehouse_list"></select>`
                        },
                    },
                    {
                        render: (data, type, row) => {
                            return `<select class="box-select-product form-select" data-method="GET" data-url="${urlEle.data('url-warehouse-product')}" data-keyResp="warehouse_products_list"></select>`
                        },
                    }, {
                        render: (data, type, row) => {
                            return `<input type="text" class="form-control col-remarks">`
                        },
                    }, {
                        data: 'uom',
                        render: (data, type, row) => {
                            return `<span class="col-uom">${data.title}</span>`;
                        },
                    }, {
                        data: 'quantity',
                        render: (data, type, row) => {
                            return `<input class="form-control col-quantity" value="${data}" />`;
                        },
                    }, {
                        data: 'unit_cost',
                        render: (data, type, row) => {
                            return `<input class="form-control mask-money col-unit-cost" value="${data}" />`;
                        },
                    }, {
                        data: 'subtotal',
                        render: (data, type, row) => {
                            return `<input class="form-control mask-money col-subtotal" readonly value="${data}" />`;
                        },
                    },
                ],
            });
        }
    }

    static generateSubtotal(ele) {
        let tr_current = ele.closest('tr');
        let quantity = tr_current.find('.col-quantity').val();
        let unit_cost = tr_current.find('.col-unit-cost').valCurrency();
        tr_current.find('.col-subtotal').attr('value', quantity * unit_cost);
        $.fn.initMaskMoney2();
    }

    static generateRowProductLiquidation() {
        let table = $('#dtbProductLiquidation')
        let data = {
            'uom': {
                'title': '',
            },
            'quantity': '',
            'subtotal': '',
            'unit_cost': '',
        }
        table.DataTable().row.add(data).draw();
        let tr_current = table.find('tbody tr').last();
        let whSelectEle = tr_current.find('.box-select-wh');
        GoodsIssueLoadPage.loadWarehouse(whSelectEle, {});
    }

    static getDataProductForIA(dataForm) {
        let rows = $('#dtbProductIA tbody tr');
        let dict_product = JSON.parse($('#data-ia-product').text());
        let list_product = [];
        rows.each(function () {
            let obj = dict_product[$(this).find('.col-product').data('id')];
            let data = {
                'inventory_adjustment_item': obj.id,
                'product_warehouse': obj.product_warehouse,
                'warehouse': obj?.['warehouse_mapped'].id,
                'uom': obj?.['uom_mapped'].id,
                'description': $(this).find('.col-remarks').val(),
                'quantity': $(this).find('.col-quantity').val(),
                'unit_cost': $(this).find('.col-unit-cost').valCurrency(),
                'subtotal': $(this).find('.col-subtotal').valCurrency(),
            }
            list_product.push(data);
        })
        dataForm['goods_issue_datas'] = list_product;
        return dataForm
    }

    static getDataProductForLiquidation(dataForm) {
        let rows = $('#dtbProductLiquidation tbody tr');
        let list_product = [];
        rows.each(function () {
            let productEle = $(this).find('.box-select-product')
            let obj = SelectDDControl.get_data_from_idx(productEle, productEle.val());
            let data = {
                'inventory_adjustment_item': null,
                'product_warehouse': obj.id,
                'warehouse': obj?.['warehouse'],
                'uom': obj?.['uom'],
                'description': $(this).find('.col-remarks').val(),
                'quantity': $(this).find('.col-quantity').val(),
                'unit_cost': $(this).find('.col-unit-cost').valCurrency(),
                'subtotal': $(this).find('.col-subtotal').valCurrency(),
            }
            list_product.push(data);
        })
        dataForm['goods_issue_datas'] = list_product;
        return dataForm
    }

    static loadGoodsIssueDetail(frmDetail, pk) {
        let url = frmDetail.data('url').format_url_with_uuid(pk);
        let iaSelectEle = $('#box-select-ia');
        $.fn.callAjax2({
            'url': url,
            'method': 'GET',
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let detail = data?.['goods_issue_detail'];
                $x.fn.renderCodeBreadcrumb(detail);
                $('[name="title"]').val(detail.title);
                $('[name="date_issue"]').val(detail?.['date_issue']);
                $('[name="system_status"]').val(detail?.['system_status']);
                $('[name="note"]').val(detail?.['note']);
                if (detail?.['goods_issue_type'] === 0) {
                    $('#inlineRadio1').prop('checked', true);
                    GoodsIssueLoadPage.loadInventoryAdjustment(iaSelectEle, detail?.['inventory_adjustment']);
                } else {
                    $('#inlineRadio2').prop('checked', true);
                    iaSelectEle.closest('.form-group').addClass('hidden');
                }
                GoodsIssueLoadPage.loadDtbProductPageDetail(detail?.['goods_issue_datas']);
            }
        })
    }

    static loadDtbProductPageDetail(data) {
        if (!$.fn.DataTable.isDataTable('#dtbProduct')) {
            let dtb = $('#dtbProduct');
            dtb.DataTableDefault({
                data: data,
                reloadCurrency: true,
                columns: [
                    {
                        data: 'warehouse',
                        render: (data, type, row, meta) => {
                            return `<span>${data.title}</span>`
                        },
                    }, {
                        data: 'product_warehouse',
                        render: (data, type, row) => {
                            return `<span>${data?.['product_data'].title}</span>`
                        },
                    }, {
                        data: 'description',
                        render: (data, type, row) => {
                            return `<span>${data}</span>`
                        },
                    }, {
                        data: 'uom',
                        render: (data, type, row) => {
                            return `<span>${data.title}</span>`
                        },
                    }, {
                        data: 'quantity',
                        render: (data, type, row) => {
                            return `<span>${data}</span>`
                        },
                    }, {
                        data: 'unit_cost',
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money=${data}></span>`
                        },
                    }, {
                        data: 'subtotal',
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money=${data}></span>`
                        },
                    },
                ],
            });
        }
    }
}