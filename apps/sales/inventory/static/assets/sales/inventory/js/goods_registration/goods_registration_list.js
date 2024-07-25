$(document).ready(function () {
    function loadGoodsRegistrationList() {
        if (!$.fn.DataTable.isDataTable('#goods_registration_list')) {
            let dtb = $('#goods_registration_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            // console.log(resp.data['goods_registration_list'])
                            return resp.data['goods_registration_list'] ? resp.data['goods_registration_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'wrap-text w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="badge badge-soft-primary w-70">${row.code}</a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-30',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}" class="text-primary"><b>${row.title}</b></a>`;
                        }
                    },
                    {
                        data: 'sale_person',
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            return `${row?.['sale_order']?.['sale_person']?.['fullname']}`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text w-25',
                        render: (data, type, row) => {
                            return `${moment(row.date_created.split(' ')[0]).format('DD/MM/YYYY')}`
                        }
                    },
                ],
            });
        }
    }

    loadGoodsRegistrationList();

    function CallProductWarehouse(sale_order_id, product_id, warehouse_id) {
        let dataParam11 = {}
        dataParam11['gre_item__product_id'] = product_id
        dataParam11['gre_item__so_item__sale_order_id'] = sale_order_id
        dataParam11['warehouse_id'] = warehouse_id
        let ajax1 = $.fn.callAjax2({
            url: $('#call-btn').attr('data-url-gre-general'),
            data: dataParam11,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('good_registration_general')) {
                    return data?.['good_registration_general'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        let dataParam2 = {}
        dataParam2['gre_item_source__product_id'] = product_id
        dataParam2['goods_registration_source__sale_order_id'] = sale_order_id
        let ajax2 = $.fn.callAjax2({
            url: $('#call-btn').attr('data-url-gre-borrow'),
            data: dataParam2,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('goods_registration_borrow_list')) {
                    return data?.['goods_registration_borrow_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([ajax1, ajax2]).then(
            (results) => {
                console.log(results[0], results[1])
            })
    }

    function CallProductWarehouseLot(sale_order_id, product_id, warehouse_id) {
        let dataParam1 = {}
        dataParam1['gre_general__gre_item__product_id'] = product_id
        dataParam1['gre_general__gre_item__so_item__sale_order_id'] = sale_order_id
        dataParam1['gre_general__warehouse_id'] = warehouse_id
        let ajax1 = $.fn.callAjax2({
            url: $('#call-btn').attr('data-url-gre-general-lot'),
            data: dataParam1,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('good_registration_lot')) {
                    return data?.['good_registration_lot'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        let dataParam2 = {}
        dataParam2['gre_item_source__product_id'] = product_id
        dataParam2['goods_registration_source__sale_order_id'] = sale_order_id
        let ajax2 = $.fn.callAjax2({
            url: $('#call-btn').attr('data-url-gre-borrow'),
            data: dataParam2,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('goods_registration_borrow_list')) {
                    return data?.['goods_registration_borrow_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([ajax1, ajax2]).then(
            (results) => {
                console.log(results[0], results[1])
            })
    }

    function CallProductWarehouseSerial(sale_order_id, product_id, warehouse_id) {
        let dataParam1 = {}
        dataParam1['gre_general__gre_item__product_id'] = product_id
        dataParam1['gre_general__gre_item__so_item__sale_order_id'] = sale_order_id
        dataParam1['gre_general__warehouse_id'] = warehouse_id
        let ajax1 = $.fn.callAjax2({
            url: $('#call-btn').attr('data-url-gre-general-sn'),
            data: dataParam1,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('good_registration_serial')) {
                    return data?.['good_registration_serial'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        let dataParam2 = {}
        dataParam2['gre_item_source__product_id'] = product_id
        dataParam2['goods_registration_source__sale_order_id'] = sale_order_id
        let ajax2 = $.fn.callAjax2({
            url: $('#call-btn').attr('data-url-gre-borrow'),
            data: dataParam2,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('goods_registration_borrow_list')) {
                    return data?.['goods_registration_borrow_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([ajax1, ajax2]).then(
            (results) => {
                console.log(results[0], results[1])
            })
    }

    function loadBoxSaleOrder(data) {
        $('#sale_order_id_box').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#sale_order_id_box').attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'sale_order_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    loadBoxSaleOrder()

    function loadBoxProduct(data) {
        $('#product_id_box').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#product_id_box').attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    loadBoxProduct()

    function loadBoxWarehouse(data) {
        $('#warehouse_id_box').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#warehouse_id_box').attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'warehouse_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    loadBoxWarehouse()

    $(document).on("click", '#call-btn', function () {
        let sale_order_obj = SelectDDControl.get_data_from_idx($('#sale_order_id_box'), $('#sale_order_id_box').val())
        let product_obj = SelectDDControl.get_data_from_idx($('#product_id_box'), $('#product_id_box').val())
        let warehouse_obj = SelectDDControl.get_data_from_idx($('#warehouse_id_box'), $('#warehouse_id_box').val())
        if (product_obj?.['general_traceability_method'] === 0) {
            CallProductWarehouse(sale_order_obj?.['id'], product_obj?.['id'], warehouse_obj?.['id'])
        }
        else if (product_obj?.['general_traceability_method'] === 1) {
            CallProductWarehouseLot(sale_order_obj?.['id'], product_obj?.['id'], warehouse_obj?.['id'])
        }
        else if (product_obj?.['general_traceability_method'] === 2) {
            CallProductWarehouseSerial(sale_order_obj?.['id'], product_obj?.['id'], warehouse_obj?.['id'])
        }
    })
})