let urlEle = $('#url-factory');
let transEle = $('#trans-factory');
let NOW_BTN = null
let select_detail_table_sn = $('#select-detail-table-sn')
let select_detail_table_sn_done = $('#select-detail-table-sn-done')
let select_detail_table_lot = $('#select-detail-table-lot')
let select_detail_table_lot_done = $('#select-detail-table-lot-done')
let amount_balance = $('#amount-balance')
let IS_DETAIL = false

class GoodsIssueLoadPage {
    load() {
        $('[name="date_issue"]').daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            // drops: 'up',
            autoApply: true,
        })

        $('#box-good-issue-type').on('change', function () {
            if ($(this).val() === '1') {
                $('#row-for-liquidation').removeClass('hidden');
                $('#row-for-ia').addClass('hidden');
                GoodsIssueLoadPage.loadDtbProductForLiquidation([]);
                $('#dtbProductIA').DataTable().clear().draw();
                let iaSelectEle = $('#box-select-ia');
                iaSelectEle.empty();
                iaSelectEle.closest('.form-group').addClass('hidden');
            }
            if ($(this).val() === '0') {
                $('#row-for-liquidation').addClass('hidden');
                $('#row-for-ia').removeClass('hidden');
                $('#dtbProductLiquidation').DataTable().clear().draw();
                $('#box-select-ia').closest('.form-group').removeClass('hidden');
            }
        })

        $('#btnAddProduct').on('click', function () {
            GoodsIssueLoadPage.generateRowProductLiquidation()
        })

        // onchange select box warehouse in table for liquidation
        $(document).on('change', '.box-select-wh', function () {
            let tr_current = $(this).closest('tr');
            let productSelectEle = tr_current.find('.box-select-product');
            let list_selected = GoodsIssueLoadPage.getListPrProductSelected(productSelectEle);
            GoodsIssueLoadPage.loadProduct(productSelectEle, {}, $(this).val(), list_selected);
        })

        // onchange select box product in table for liquidation
        $(document).on('change', '.box-select-product', function () {
            let product_data = SelectDDControl.get_data_from_idx($(this), $(this).val());
            let tr_current = $(this).closest('tr');
            tr_current.find('.col-uom').text(product_data?.['uom_data'].title);
        })

        // onchange quantity in table for liquidation
        $(document).on('change', '.col-quantity', function () {
            let tr_current = $(this).closest('tr');
            let product = SelectDDControl.get_data_from_idx(tr_current.find('.box-select-product'), tr_current.find('.box-select-product').val());
            if ($(this).val() <= product?.['stock_amount'] - product?.['sold_amount']) {
                GoodsIssueLoadPage.generateSubtotal($(this));
            } else {
                $(this).val(0);
                tr_current.find('.col-subtotal').attr('value', 0)
                $.fn.notifyB({description: transEle.data('trans-fail-quantity').format_by_idx(product?.['stock_amount'] - product?.['sold_amount'])}, 'warning');
                $.fn.initMaskMoney2();
            }
        })

        // onchange in table for liquidation
        $(document).on('change', '.col-unit-cost', function () {
            GoodsIssueLoadPage.generateSubtotal($(this));
        })

        $(document).on('click', '.select-detail', function () {
            NOW_BTN = $(this)
            let disabled = ''
            if (IS_DETAIL) {
                disabled = 'disabled readonly'
            }
            if (NOW_BTN.attr('data-manage-type') === '2') { // sn
                select_detail_table_sn.prop('hidden', false)
                select_detail_table_sn_done.prop('hidden', false)
                select_detail_table_lot.prop('hidden', true)
                select_detail_table_lot_done.prop('hidden', true)

                amount_balance.text(` ${$(this).closest('tr').find('.col-quantity').attr('value')} `)
                let row_selected = NOW_BTN.attr('data-is-done') === '1' ? JSON.parse(NOW_BTN.find('.data-sn-selected').text()) : []
                select_detail_table_sn.find('tbody').html('')

                let select_detail_table_sn_ajax = $.fn.callAjax2({
                    url: select_detail_table_sn.attr('data-sn-url') + `?product_warehouse__product_id=${$(this).attr('data-product-mapped-id')}&&product_warehouse__warehouse_id=${$(this).attr('data-warehouse-mapped-id')}`,
                    data: {},
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_serial_list')) {
                            return data?.['warehouse_serial_list'];
                        }
                        return {};
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([select_detail_table_sn_ajax]).then(
                    (results) => {
                        for (const item of results[0]) {
                            if (item?.['is_delete'] === false || row_selected.includes(item?.['id'])) {
                                let checked = ''
                                if (row_selected.includes(item?.['id'])) {
                                    checked = 'checked'
                                }
                                select_detail_table_sn.find('tbody').append(`
                                    <tr>
                                        <td>${item?.['vendor_serial_number'] ? item?.['vendor_serial_number'] : ''}</td>
                                        <td>${item?.['serial_number'] ? item?.['serial_number'] : ''}</td>
                                        <td>${item?.['expire_date'] ? moment(item?.['expire_date'].split(' ')[0]).format('DD/MM/YYYY') : ''}</td>
                                        <td>${item?.['manufacture_date'] ? moment(item?.['manufacture_date'].split(' ')[0]).format('DD/MM/YYYY') : ''}</td>
                                        <td>${item?.['warranty_start'] ? moment(item?.['warranty_start'].split(' ')[0]).format('DD/MM/YYYY') : ''}</td>
                                        <td>${item?.['warranty_end'] ? moment(item?.['warranty_end'].split(' ')[0]).format('DD/MM/YYYY') : ''}</td>
                                        <td>
                                            <div class="form-check">
                                                <input type="checkbox" ${disabled} ${checked} data-sn-id="${item?.['id']}" class="select-detail-check-sn">
                                                <label class="form-check-label"></label>
                                            </div>
                                        </td>
                                    </tr>
                                `)
                            }
                        }
                    })
            }
            else if (NOW_BTN.attr('data-manage-type') === '1') { // lot
                select_detail_table_sn.prop('hidden', true)
                select_detail_table_sn_done.prop('hidden', true)
                select_detail_table_lot.prop('hidden', false)
                select_detail_table_lot_done.prop('hidden', false)

                amount_balance.text(` ${$(this).closest('tr').find('.col-quantity').attr('value')} `)
                let data_lot = NOW_BTN.attr('data-is-done') === '1' ? JSON.parse(NOW_BTN.find('.data-lot-selected').text()) : {}
                select_detail_table_lot.find('tbody').html('')
                let select_detail_table_lot_ajax = $.fn.callAjax2({
                    url: select_detail_table_lot.attr('data-lot-url') + `?product_warehouse__product_id=${$(this).attr('data-product-mapped-id')}&&product_warehouse__warehouse_id=${$(this).attr('data-warehouse-mapped-id')}`,
                    data: {},
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_lot_list')) {
                            return data?.['warehouse_lot_list'];
                        }
                        return {};
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([select_detail_table_lot_ajax]).then(
                    (results) => {
                        for (const item of results[0]) {
                            let quantity = item?.['quantity_import'] ? item?.['quantity_import'] : 0
                            let old_quantity = item?.['quantity_import'] ? item?.['quantity_import'] : 0
                            if (data_lot.length > 0) {
                                let get_quantity = data_lot.filter(function (obj) {
                                    return obj?.['lot_id'] === item?.['id']
                                })
                                if (get_quantity.length > 0) {
                                    quantity = get_quantity[0]?.['quantity']
                                    old_quantity = get_quantity[0]?.['old_quantity']
                                }
                            }

                            select_detail_table_lot.find('tbody').append(`
                                <tr>
                                    <td>${item?.['lot_number'] ? item?.['lot_number'] : ''}</td>
                                    <td><input disabled readonly class="form-control old_quantity" value="${old_quantity}"></td>
                                    <td>${item?.['expire_date'] ? moment(item?.['expire_date'].split(' ')[0]).format('DD/MM/YYYY') : ''}</td>
                                    <td>${item?.['manufacture_date'] ? moment(item?.['manufacture_date'].split(' ')[0]).format('DD/MM/YYYY') : ''}</td>
                                    <td><input ${disabled} type="number" data-lot-id="${item?.['id']}" value="${quantity}" class="form-control select-detail-check-lot"></td>
                                </tr>
                            `)
                        }
                    })
            }
        })

        $(document).on('change', '.select-detail-check-lot', function () {
            if ($(this).val() > $(this).closest('tr').find('.old_quantity').val()) {
                $.fn.notifyB({description: `Reality quantity must be <= system quantity`}, 'failure')
            }
        })

        $('#select-detail-table-sn-done').on('click', function () {
            let select_detail_table = $('#select-detail-table-sn')
            let selected_sn_list = []
            select_detail_table.find('tbody tr .select-detail-check-sn').each(function () {
                if ($(this).prop('checked')) {
                    selected_sn_list.push($(this).attr('data-sn-id'))
                }
            })
            if (selected_sn_list.length !== parseInt(amount_balance.text())) {
                $.fn.notifyB({description: `Serial row(s) selected must be ${amount_balance.text()}`}, 'failure')
            }
            else {
                NOW_BTN.find('.data-sn-selected').text(JSON.stringify(selected_sn_list))
                $('#select-detail-modal').modal('hide')
                NOW_BTN.attr('data-is-done', '1')
                NOW_BTN.closest('tr').addClass('bg-primary-light-5')
            }
        })

        $('#select-detail-table-lot-done').on('click', function () {
            let select_detail_table = $('#select-detail-table-lot')
            let sum_old_quantity = 0
            let sum_reality_quantity = 0
            let data_lot = []
            select_detail_table.find('tbody tr').each(function () {
                data_lot.push({
                    'lot_id': $(this).find('.select-detail-check-lot').attr('data-lot-id'),
                    'old_quantity': $(this).find('.old_quantity').val() ? parseInt($(this).find('.old_quantity').val()) : 0,
                    'quantity': $(this).find('.select-detail-check-lot').val() ? parseInt($(this).find('.select-detail-check-lot').val()) : parseInt($(this).find('.old_quantity').val())
                })
                sum_old_quantity += $(this).find('.old_quantity').val() ? parseInt($(this).find('.old_quantity').val()) : 0
                sum_reality_quantity += $(this).find('.select-detail-check-lot').val() ? parseInt($(this).find('.select-detail-check-lot').val()) : parseInt($(this).find('.old_quantity').val())
            })
            if (sum_old_quantity - sum_reality_quantity !== parseInt(amount_balance.text())) {
                $.fn.notifyB({description: `Sum reality quantity must be ${amount_balance.text()}`}, 'failure')
            }
            else {
                NOW_BTN.find('.data-lot-selected').text(JSON.stringify(data_lot))
                $('#select-detail-modal').modal('hide')
                NOW_BTN.attr('data-is-done', '1')
                NOW_BTN.closest('tr').addClass('bg-primary-light-5')
            }
        })
    }

    static loadInventoryAdjustment(ele, data) {
        ele.initSelect2({
            data: data,
            templateResult: function(data) {
                let ele = $('<div class="row col-12"></div>');
                ele.append(`<div class="col-3"><span class="badge badge-soft-primary">${data.data?.['code']}</span></div>`);
                ele.append(`<div class="col-9">${data.data?.['title']}</div>`);
                return ele;
            }
        }).on('change', function () {
            let url = urlEle.data('url-ia-product').format_url_with_uuid($(this).val());
            let tableEle = $('#dtbProductIA');
            let dataProductEle = $('#data-ia-product');
            let data_dict = JSON.parse(dataProductEle.text());
            tableEle.DataTable().clear().draw();
            $.fn.callAjax(url, 'GET').then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('ia_product_list')) {
                        let product_list = data?.['ia_product_list'].filter(function (obj) {
                            return (obj.book_quantity - obj.count) > 0;
                        });
                        product_list.map(function (item) {
                            if (data_dict[item.id]) {
                                item['action_status'] = false
                            }

                            if (!item.action_status) {
                                data_dict[item.id] = item;
                                item['description'] = item?.['product_mapped']?.['description'];
                                item['subtotal'] = '';
                                item['unit_cost'] = '';
                                tableEle.DataTable().row.add(item).draw();
                                tableEle.find('tbody tr').each(function () {
                                    if ($(this).find('.col-product').attr('data-manage-type') === '0') {
                                        $(this).addClass('bg-primary-light-5')
                                    }
                                })
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
        }).on('change', function (){
            let product = SelectDDControl.get_data_from_idx($(this), $(this).val());
            let trCurrent = $(this).closest('tr');
            trCurrent.find('.col-uom').attr('data-id', product.uom);
            trCurrent.find('.col-remarks').val('');
            trCurrent.find('.col-quantity').val('');
            trCurrent.find('.col-unit-cost').attr('value', '');
            trCurrent.find('.col-subtotal').attr('value', '');
            $.fn.initMaskMoney2();
        })
    }

    static loadDtbProductForIA(data) {
        if (!$.fn.DataTable.isDataTable('#dtbProductIA')) {
            let dtb = $('#dtbProductIA');
            dtb.DataTableDefault({
                dom: '',
                data: data,
                reloadCurrency: true,
                columns: [
                    {
                        data: 'product_mapped',
                        className: 'wrap-text w-20',
                        render: (data, type, row, meta) => {
                            return `<span class="badge badge-primary badge-sm mb-1">${data.code}</span>&nbsp;<span class="text-primary col-product" data-manage-type="${row?.['product_mapped']?.['general_traceability_method']}" data-id="${row.id}">${data.title}</span>`
                        },
                    },
                    {
                        data: 'description',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<textarea style="min-width: 250px" rows="2" disabled readonly class="form-control col-remarks small">${data}</textarea>`
                        },
                    },
                    {
                        data: 'uom_mapped',
                        className: 'wrap-text w-5',
                        render: (data, type, row) => {
                            return `<span class="col-uom">${data.title}</span>`;
                        },
                    },
                    {
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `<input style="min-width: 100px" class="form-control col-quantity" readonly value="${row.book_quantity - row.count}">`;
                        },
                    },
                    {
                        data: 'warehouse_mapped',
                        className: 'wrap-text w-10',
                        render: (data, type, row, meta) => {
                            return `<span class="badge badge-secondary badge-sm mb-1">${data.code}</span>&nbsp;<span class="text-secondary col-warehouse">${data.title}</span>`
                        },
                    },
                    {
                        data: 'unit_cost',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<input style="min-width: 250px" class="form-control mask-money col-unit-cost" value="${data}"/>`;
                        },
                    },
                    {
                        data: 'subtotal',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<input style="min-width: 250px" class="form-control mask-money col-subtotal" value="${data}" readonly/>`;
                        },
                    },
                    {
                        data: '',
                        className: 'wrap-text w-10 text-center',
                        render: (data, type, row) => {
                            if (row?.['product_mapped']?.['general_traceability_method'] !== 0) {
                                return `<button type="button"
                                            data-manage-type="${row?.['product_mapped']?.['general_traceability_method']}"
                                            data-is-done="0"
                                            data-product-mapped-id="${row?.['product_mapped']?.['id']}"
                                            data-warehouse-mapped-id="${row?.['warehouse_mapped']?.['id']}"
                                            data-bs-toggle="modal"
                                            data-bs-target="#select-detail-modal"
                                            class="select-detail btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs">
                                        <script class="data-sn-selected"></script>
                                        <script class="data-lot-selected"></script>
                                        <span class="icon"><i class="fas fa-chevron-down"></i></span>
                                    </button>`;
                            }
                            else {
                                return ``
                            }
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
                        data: 'description',
                        render: (data, type, row) => {
                            return `<input type="text" class="form-control col-remarks" value="${data}">`
                        },
                    }, {
                        data: 'uom',
                        render: (data, type, row) => {
                            return `<span class="col-uom" data-id="${data.id}">${data.title}</span>`;
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
            'description': '',
        }
        table.DataTable().row.add(data).draw();
        let tr_current = table.find('tbody tr').last();
        let whSelectEle = tr_current.find('.box-select-wh');
        GoodsIssueLoadPage.loadWarehouse(whSelectEle, {});
    }

    static getDataProductForIA(dataForm) {
        let flag = true;
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
            if ($(this).find('.select-detail').attr('data-manage-type') === '2') { // sn
                if ($(this).find('.select-detail').find('.data-sn-selected').text()) {
                    data['sn_changes'] = JSON.parse(
                        $(this).find('.select-detail').find('.data-sn-selected').text()
                    )
                }
                else {
                    $.fn.notifyB({description: "Serial data can not NULL"}, 'warning');
                    flag = false;
                }
                data['lot_changes'] = []
            }
            if ($(this).find('.select-detail').attr('data-manage-type') === '1') { // lot
                if ($(this).find('.select-detail').find('.data-lot-selected').text()) {
                    data['lot_changes'] = JSON.parse(
                        $(this).find('.select-detail').find('.data-lot-selected').text()
                    )
                }
                else {
                    $.fn.notifyB({description: "Lot data can not NULL"}, 'warning');
                    flag = false;
                }
                data['sn_changes'] = []
            }
            list_product.push(data);
        })
        dataForm['goods_issue_datas'] = list_product;
        if (flag) {
            return dataForm
        }
        else {
            return false;
        }
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
                'warehouse': $(this).find('.box-select-wh').val(),
                'uom': $(this).find('.col-uom').data('id'),
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

    static loadGoodsIssueDetail(frmDetail, pk, page_type = 0) {
        let url = frmDetail.data('url').format_url_with_uuid(pk);
        let iaSelectEle = $('#box-select-ia');
        $.fn.callAjax2({
            'url': url,
            'method': 'GET',
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                IS_DETAIL = true;
                let detail = data?.['goods_issue_detail'];
                $.fn.compareStatusShowPageAction(detail);
                $x.fn.renderCodeBreadcrumb(detail);

                $('[name="title"]').val(detail.title);
                $('[name="date_issue"]').val(moment(detail?.['date_issue'].split(' ')[0]).format('DD/MM/YYYY'));
                $('[name="note"]').val(detail?.['note']);
                if (detail?.['goods_issue_type'] === 0) {
                    $('#box-good-receipt-type').val(0)
                    GoodsIssueLoadPage.loadInventoryAdjustment(iaSelectEle, detail?.['inventory_adjustment']);
                } else {
                    $('#box-good-receipt-type').val(1)
                    iaSelectEle.closest('.form-group').addClass('hidden');
                }
                if (page_type === 0) {
                    GoodsIssueLoadPage.loadDtbProductPageDetail(detail?.['goods_issue_datas']);
                } else {
                    if (detail?.['goods_issue_type'] === 0) {
                        let product_list = GoodsIssueLoadPage.backupDataProductsDetail(detail?.['goods_issue_datas'])
                        GoodsIssueLoadPage.loadDtbProductForIA(product_list)
                    } else {
                        $('#row-for-liquidation').removeClass('hidden');
                        $('#row-for-ia').addClass('hidden');
                        GoodsIssueLoadPage.loadDtbProductForLiquidation([]);
                        $('#box-select-ia').closest('.form-group').addClass('hidden');
                        let table = $('#dtbProductLiquidation');
                        let list_selected = []
                        detail?.['goods_issue_datas'].map(function (item){
                            list_selected.push(item.product_warehouse.id);
                            table.DataTable().row.add(item).draw();
                            let trCurrent = table.find('tbody tr');
                            GoodsIssueLoadPage.loadWarehouse(trCurrent.find('.box-select-wh'), item.warehouse);
                            GoodsIssueLoadPage.loadProduct(trCurrent.find('.box-select-product'), item.product_warehouse, item.warehouse.id, list_selected);
                        })
                    }
                }
            }
        })
    }

    static backupDataProductsDetail(data) {
        let dataEle = $('#data-ia-product');
        let data_dict = JSON.parse(dataEle.text());
        let list_result = []
        data.map(function (item) {
            let data_temp = {
                'id': item.inventory_adjustment_item,
                'product_warehouse': item.product_warehouse.id,
                'warehouse_mapped': item.warehouse,
                'description': item.description,
                'uom_mapped': item.uom,
                'book_quantity': item.quantity,
                'count': 0,
                'product_mapped': item.product_warehouse?.['product_data'],
                'unit_cost': item.unit_cost,
                'subtotal': item.subtotal,
            }
            data_dict[item.inventory_adjustment_item] = data_temp
            list_result.push(data_temp)
        })
        dataEle.text(JSON.stringify(data_dict));
        return list_result
    }

    static loadDtbProductPageDetail(data) {
        if (!$.fn.DataTable.isDataTable('#dtbProduct')) {
            let dtb = $('#dtbProduct');
            dtb.DataTableDefault({
                dom: '',
                data: data,
                reloadCurrency: true,
                columns: [
                    {
                        data: 'product_warehouse',
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            return `<span class="badge badge-primary badge-sm mb-1">${data?.['product_mapped'].code}</span>&nbsp;<span class="text-primary">${data?.['product_mapped'].title}</span>`
                        },
                    }, {
                        data: 'product_warehouse',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<textarea style="min-width: 250px" rows="2" disabled readonly class="form-control small">${data?.['product_mapped'].description}</textarea>`
                        },
                    }, {
                        data: 'product_warehouse',
                        className: 'wrap-text w-5',
                        render: (data, type, row) => {
                            return `<span>${data?.['uom_mapped'].title}</span>`
                        },
                    }, {
                        data: 'quantity',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `<input style="min-width: 100px" class="form-control col-quantity" readonly value="${data}">`
                        },
                    }, {
                        data: 'product_warehouse',
                        className: 'wrap-text w-10',
                        render: (data, type, row, meta) => {
                            return `<span class="badge badge-secondary badge-sm mb-1">${data?.['warehouse_mapped'].code}</span>&nbsp;<span class="text-secondary">${data?.['warehouse_mapped'].title}</span>`
                        },
                    }, {
                        data: 'unit_cost',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<span class="text-primary mask-money" data-init-money=${data}></span>`
                        },
                    }, {
                        data: 'subtotal',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            return `<span class="text-primary mask-money" data-init-money=${data}></span>`
                        },
                    }, {
                        data: 'product_warehouse',
                        className: 'wrap-text w-10 text-center',
                        render: (data, type, row) => {
                            if (data?.['product_mapped']?.['general_traceability_method'] !== 0) {
                                return `<button type="button"
                                            data-manage-type="${data?.['product_mapped']?.['general_traceability_method']}"
                                            data-is-done="1"
                                            data-product-mapped-id="${data?.['product_mapped']?.['id']}"
                                            data-warehouse-mapped-id="${data?.['warehouse_mapped']?.['id']}"
                                            data-bs-toggle="modal"
                                            data-bs-target="#select-detail-modal"
                                            class="select-detail btn btn-icon btn-rounded btn-flush-primary flush-soft-hover btn-xs">
                                        <script class="data-sn-selected">${row?.['sn_data'].length > 0 ? JSON.stringify(row?.['sn_data']) : ''}</script>
                                        <script class="data-lot-selected">${row?.['lot_data'].length > 0 ? JSON.stringify(row?.['lot_data']) : ''}</script>
                                        <span class="icon"><i class="fas fa-chevron-down"></i></span>
                                    </button>`;
                            }
                            else {
                                return ``
                            }
                        },
                    },
                ],
                initComplete: function () {
                    $('#dtbProduct').find('tbody tr').attr('class', 'bg-primary-light-5')
                }
            });
        }
    }
}