let urlEle = $('#url-factory');
let transEle = $('#trans-factory');

class GoodsTransferLoadPage {
    static loadAgency(ele, data) {
        ele.initSelect2({
            data: data,
            dataParams: {
                'account_types_mapped__account_type_order': 2
            }
        })
    }

    static loadWarehouse(ele, data, agency, wh_selected) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                resp.data[keyResp].map(function (item) {
                    if (item.agency === agency && item.id !== wh_selected) {
                        list_result.push(item)
                    }
                })
                return list_result
            }
        })
    }

    static loadProduct(ele, data, warehouse, list_selected) {
        ele.initSelect2({
            data: data,
            'dataParams': {'warehouse_id': warehouse},
            callbackDataResp(resp, keyResp) {
                let list_result = [];
                resp.data[keyResp].map(function (item) {
                    if (!list_selected.includes(item.id)) {
                        console.log(item)
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

    static loadDtbProduct(data) {
        if (!$.fn.DataTable.isDataTable('#dtbProduct')) {
            let dtb = $('#dtbProduct');
            dtb.DataTableDefault({
                data: data,
                reloadCurrency: true,
                columns: [
                    {
                        render: (data, type, row, meta) => {
                            return `<select class="box-select-wh form-select" data-method="GET" data-url="${urlEle.data('url-warehouse')}" data-keyResp="warehouse_list"></select>`
                        },
                    }, {
                        render: (data, type, row) => {
                            return `<select class="box-select-product form-select" data-method="GET" data-url="${urlEle.data('url-warehouse-product')}" data-keyResp="warehouse_products_list"></select>`
                        },
                    }, {
                        data: 'uom',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="col-uom">${data.title}</span>`;
                        },
                    }, {
                        data: 'quantity',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<input class="form-control col-quantity" value="${data}" />`;
                        },
                    }, {
                        render: (data, type, row, meta) => {
                            return `<select class="box-select-end-wh form-select" data-method="GET" data-url="${urlEle.data('url-warehouse')}" data-keyResp="warehouse_list"></select>`
                        },
                    }, {
                        data: 'unit_cost',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<input class="form-control mask-money col-unit-cost" value="${data}" />`;
                        },
                    }, {
                        data: 'subtotal',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<input class="form-control mask-money col-subtotal" readonly value="${data}" />`;
                        },
                    }, {
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-remove-row" ><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;

                        },
                    },
                ],
            });
        }
    }

    static getListPrProductSelected(ele) {
        let list_selected = []
        $('#dtbProduct .box-select-product').not(ele).each(function () {
            list_selected.push($(this).val());
        })
        return list_selected
    }

    static generateRowProduct(table) {
        let data = {
            'uom': {
                'title': '',
            },
            'quantity': '',
            'unit_cost': '',
            'subtotal': '',
        }
        table.DataTable().row.add(data).draw().node();
    }

    static generateSubtotal(ele) {
        let tr_current = ele.closest('tr');
        let quantity = tr_current.find('.col-quantity').val();
        let unit_cost = tr_current.find('.col-unit-cost').valCurrency();
        tr_current.find('.col-subtotal').attr('value', quantity * unit_cost);
        $.fn.initMaskMoney2();
    }

    static getDataForm(frmData) {
        let rows = $('#dtbProduct tbody tr');
        let list_product = [];
        rows.each(function () {
            let productEle = $(this).find('.box-select-product');
            let product = SelectDDControl.get_data_from_idx(productEle, productEle.val());
            let data = {
                'warehouse_product': product.id,
                'warehouse': $(this).find('.box-select-wh').val(),
                'uom': product.uom,
                'quantity': $(this).find('.col-quantity').val(),
                'end_warehouse': $(this).find('.box-select-end-wh').val(),
                'unit_cost': $(this).find('.col-unit-cost').valCurrency(),
                'subtotal': $(this).find('.col-subtotal').valCurrency(),
                'tax_data': product.tax_data,
                'unit_price': product.unit_price,
            }
            list_product.push(data)
        })
        frmData['goods_transfer_datas'] = list_product;
        frmData['system_status'] = 0;
        if (frmData['warehouse_type'] === '0') {
            delete frmData['agency']
        }
        return frmData
    }

    static loadGoodsTransferProductDatas(data){
        let table = $('#dtbProduct');
        data.map(function (item){
            table.DataTable().row.add(item).draw().node();
            let tr_current = table.find('tbody tr').last();
            GoodsTransferLoadPage.loadWarehouse(tr_current.find('.box-select-wh'), item.warehouse, null, item.end_warehouse.id);
            GoodsTransferLoadPage.loadWarehouse(tr_current.find('.box-select-end-wh'), item.end_warehouse, null, item.warehouse.id);
            GoodsTransferLoadPage.loadProduct(tr_current.find('.box-select-product'), item.warehouse_product, item.warehouse.id, []);
        })
        table.find('select, input').prop('disabled', true)
    }

    static loadGoodsTransferDetail(frmDetail, pk) {
        let url = frmDetail.data('url').format_url_with_uuid(pk);
        let agencySelectEle = $('#box-select-agency');
        $.fn.callAjax2({
            'url': url,
            'method': 'GET',
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let detail = data?.['goods_transfer_detail'];
                $x.fn.renderCodeBreadcrumb(detail);
                $('[name="title"]').val(detail.title);
                GoodsTransferLoadPage.loadAgency(agencySelectEle, detail.agency);
                $('[name="date_transfer"]').val(detail?.['date_transfer']);
                $('[name="system_status"]').val(detail?.['system_status']);
                $('[name="note"]').val(detail?.['note']);
                if (detail?.['goods_transfer_type'] === 0) {
                    $('#inlineRadio1').prop('checked', true);
                } else {
                    $('#inlineRadio2').prop('checked', true);
                    agencySelectEle.closest('.form-group').removeClass('hidden');
                }
                GoodsTransferLoadPage.loadGoodsTransferProductDatas(detail?.['goods_transfer_datas']);
            }
        })
    }


}