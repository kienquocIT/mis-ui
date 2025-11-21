$(document).ready(function () {
    ////////////////////////////////////////////////// for periods group
    const periodEle = $('#period-select')
    const periodMonthEle = $('#period-month')
    const table_inventory_report = $('#table-inventory-report')
    const items_select_Ele = $('#items_select')
    const warehouses_select_Ele = $('#warehouses_select')
    const project_select_Ele = $('#project-select')
    const trans_script = $('#trans-script')
    const url_script = $('#url-script')
    const $definition_inventory_valuation = $('#definition_inventory_valuation').text()
    let $is_project = false
    const company_current_data = JSON.parse($('#company_current_data').text());
    if (company_current_data) {
        let company_current_data_ajax = $.fn.callAjax2({
            url: url_script.attr('data-url-company-config-detail') + `?company_id=${company_current_data?.['id']}`,
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    return data?.['config'] ? data?.['config'] : [];
                }
                return [];
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([company_current_data_ajax]).then(
            (results) => {
                $is_project = results[0]?.['cost_per_project']
            })
    }
    let PERIODIC_CLOSED = false
    let current_view_mode = 'general'
    let export_inventory_data_list = []

    let detail_lot_tbl = $('#view-wh-available-prd-detail-table-lot')
    let detail_sn_tbl = $('#view-wh-available-prd-detail-table-serial')

    function LoadItemsSelectBox(ele, data) {
        ele.initSelect2({
            placeholder: trans_script.attr('data-trans-all'),
            allowClear: true,
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    LoadItemsSelectBox(items_select_Ele)

    function LoadWarehouseSelectBox(ele, data) {
        ele.initSelect2({
            placeholder: trans_script.attr('data-trans-all'),
            allowClear: true,
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'warehouse_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {

        })
    }
    LoadWarehouseSelectBox(warehouses_select_Ele)

    function LoadProjectSelectBox(ele, data) {
        ele.prop('disabled', $is_project !== 'true')
        ele.closest('.project-filter').prop('hidden', $is_project !== 'true')
        if ($is_project === 'true') {
            ele.initSelect2({
                allowClear: true,
                ajax: {
                    url: ele.attr('data-url') + `?has_regis=1`,
                    method: 'GET',
                },
                templateResult: function (data) {
                    let ele = $('<div class="row"></div>');
                    ele.append(`<div class="col-9"><span class="badge badge-soft-primary">${data.data?.['code']}</span>&nbsp;&nbsp;&nbsp;${data.data?.['title']}</div>
                            <div class="col-3"><span class="badge badge-soft-blue badge-sm">${data.data?.['opportunity']?.['code']}</span></div>`);
                    return ele;
                },
                data: (data ? data : null),
                keyResp: 'sale_order_list',
                keyId: 'id',
                keyText: 'code',
            }).on('change', function () {
            })
        }
    }
    LoadProjectSelectBox(project_select_Ele)

    function ExportInventory() {
        let parseData = []
        export_inventory_data_list = export_inventory_data_list.filter(item => {return item?.type === "product_row"})
        export_inventory_data_list.forEach(function (data, index) {
            parseData.push({
                "Product Code": data?.['product_code'] || '',
                "Product Name": data?.['product_title'] || '',
                "Serial Number": data?.['product_serial_number'] || '',
                "Lot Number": data?.['product_lot_number'] || '',
                "Warehouse Code": data?.['warehouse_code'] || '',
                "Warehouse Name": data?.['warehouse_title'] || '',
                "Current Quantity": data?.['prd_end_quantity'] || 0,
                "Current Value": data?.['prd_end_value'] || 0
            })
        })

        const worksheet = XLSX.utils.json_to_sheet(parseData);

        const colWidths = Object.keys(parseData[0]).map(key => {
            const maxLength = Math.max(
                key.length,
                ...parseData.map(row => String(row[key] || "").length)
            );
            return {wch: maxLength + 2};
        });
        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");

        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, "_");
        XLSX.writeFile(workbook, `inventory_${timestamp}.xlsx`);
    }

    function RenderMainTable(table, data_list=[], data_wh=[], table_detail=false) {
        export_inventory_data_list = data_list
        table.DataTable().clear().destroy()
        let order_code_list = []
        table.DataTableDefault({
            styleDom: 'hide-foot',
            scrollY: '65vh',
            scrollX: true,
            scrollCollapse: true,
            ordering: false,
            paging: false,
            reloadCurrency: true,
            data: data_list,
            columns: [
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['order_code']) {
                            if (!order_code_list.includes(`${row?.['warehouse_code']}-so-code-${row?.['order_code']}`)) {
                                order_code_list.push(`${row?.['warehouse_code']}-so-code-${row?.['order_code']}`)
                            }
                            return `<span class="${row?.['warehouse_code']}-so-code-${row?.['order_code']}">${row?.['order_code']}</span>`
                        }
                        return ``
                    }
                },
                {
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            if (row?.['warehouse_title']) {
                                return `<button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-available-product-list" data-wh-id="${row?.['warehouse_id']}" class="see-detail-wh btn btn-primary btn-xs btn-rounded">
                                            <span>${row?.['warehouse_code']}&nbsp;<i class="fa-solid fa-square-arrow-up-right"></i></span>
                                        </button>
                                        <span data-id="${row?.['warehouse_id']}" class="fw-bold text-primary ${row?.['type']}">${row?.['warehouse_title']}</span>`
                            }
                        }
                        if (row?.['type'] === 'product_row') {
                            let lot_number = ''
                            let serial_number = ''
                            if (row?.['product_lot_number']) {
                                lot_number = `<br><span class="text-blue mr-1">${$.fn.gettext('Lot')}:</span><span class="text-blue">${row?.['product_lot_number']}</span><br>`
                            }
                            if (row?.['product_serial_number']) {
                                serial_number = `<br><span class="text-danger mr-1">${$.fn.gettext('Specific serial number')}:</span><span class="text-danger">${row?.['product_serial_number']}</span>`
                            }
                            let dot = [
                                '<span class="badge bg-blue badge-indicator"></span>',
                                '<span class="badge bg-success badge-indicator"></span>',
                                '<span class="badge bg-danger badge-indicator"></span>'
                            ][parseInt(row?.['vm'])]
                            return `
                                ${dot}
                                <span class="badge badge-sm badge-soft-secondary badge-outline">${row?.['product_code']}</span><br>
                                <span class="${row?.['type']} fw-bold" data-product-vm="${row?.['vm']}" data-product-code="${row?.['product_code']}" data-wh-title="${row?.['warehouse_title']}">${row?.['product_title']}</span>${lot_number}${serial_number}
                            `
                        }
                        if (row?.['type'] === 'detail_row') {
                            return `<span class="detail_row ${row?.['product_code']} ${row?.['bg_in']} ${row?.['bg_out']} mr-1">${row?.['trans_title']} ${row?.['trans_code']}</span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'product_row') {
                            return `<span class="text-secondary">${row?.['uom_title'] ? row?.['uom_title'] : '--'}</span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'detail_row') {
                            return `<span>${row?.['date'] ? row?.['date'] : ''}</span>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-center',
                    render: (data, type, row) => {
                        let lot_info_html = ''
                        if (row?.['type'] === 'detail_row') {
                            if (row?.['lot_number']) {
                                lot_info_html += `<span class="text-blue">${row?.['lot_number']}</span>`
                            }
                            if (row?.['expired_date']) {
                                lot_info_html += `<br><span class="text-danger">${row?.['expired_date'] ? moment(row?.['expired_date'], 'YYYY-MM-DD').format('DD/MM/YYYY') : ''}</span>`
                            }
                        }
                        return lot_info_html
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<div class="row">
                                        <div class="col-4">--</div>
                                        <div class="col-8"><span class="text-primary fw-bold wh-opening-value-span mask-money wh-open-value-${row?.['warehouse_id']}" data-init-money="0"></span></div>
                                    </div>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<div class="row">
                                        <div class="col-4"><span class="text-secondary opening-quantity-span prd-open-quantity-${row?.['warehouse_id']}">${row?.['prd_open_quantity']}</span></div>
                                        <div class="col-8"><span class="text-secondary opening-value-span mask-money prd-open-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_open_value']}"></span></div>
                                    </div>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<div class="row">
                                        <div class="col-4">--</div>
                                        <div class="col-8"><span class="text-primary fw-bold wh-in-value-span wh-in-value-${row?.['warehouse_id']} mask-money" data-init-money="0"></span></div>
                                    </div>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<div class="row">
                                        <div class="col-4"><span class="text-secondary in-quantity-span prd-in-quantity-${row?.['warehouse_id']}">${row?.['prd_in_quantity']}</span></div>
                                        <div class="col-8"><span class="text-secondary in-value-span mask-money prd-in-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_in_value']}"></span></div>
                                    </div>`
                        }
                        if (row?.['type'] === 'detail_row') {
                            return `<div class="row">
                                        <div class="col-4"><span class="in-quantity-span prd-in-quantity-${row?.['warehouse_id']} ${row?.['bg_in']} ${row?.['bg_out']}">${row?.['in_quantity']}</span></div>
                                        <div class="col-8"><span class="in-quantity-span mask-money prd-in-value-${row?.['warehouse_id']} ${row?.['bg_in']} ${row?.['bg_out']}" data-init-money="${row?.['in_value']}"></span></div>
                                    </div>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<div class="row">
                                        <div class="col-4">--</div>
                                        <div class="col-8"><span class="text-primary fw-bold wh-out-value-span mask-money wh-out-value-${row?.['warehouse_id']}" data-init-money="0"></span></div>
                                    </div>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<div class="row">
                                        <div class="col-4"><span class="text-secondary out-quantity-span prd-out-quantity-${row?.['warehouse_id']}">${row?.['prd_out_quantity']}</span></div>
                                        <div class="col-8"><span class="text-secondary out-value-span mask-money prd-out-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_out_value']}"></span></div>
                                    </div>`
                        }
                        if (row?.['type'] === 'detail_row') {
                            return `<div class="row">
                                        <div class="col-4"><span class="out-quantity-span prd-out-quantity-${row?.['warehouse_id']} ${row?.['bg_in']} ${row?.['bg_out']}">${row?.['out_quantity']}</span></div>
                                        <div class="col-8"><span class="out-quantity-span mask-money prd-out-value-${row?.['warehouse_id']} ${row?.['bg_in']} ${row?.['bg_out']}" data-init-money="${row?.['out_value']}"></span></div>
                                    </div>`
                        }
                        return ``
                    }
                },
                {
                    className: 'text-right',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'warehouse_row') {
                            return `<div class="row">
                                        <div class="col-4">--</div>
                                        <div class="col-8"><span class="text-primary fw-bold wh-ending-value-span mask-money wh-end-value-${row?.['warehouse_id']}" data-init-money="0"></span></div>
                                    </div>`
                        }
                        if (row?.['type'] === 'product_row') {
                            return `<div class="row">
                                        <div class="col-4"><span class="text-secondary ending-quantity-span prd-end-quantity-${row?.['warehouse_id']}">${row?.['prd_end_quantity']}</span></div>
                                        <div class="col-8"><span class="text-secondary ending-value-span mask-money prd-end-value-${row?.['warehouse_id']}" data-init-money="${row?.['prd_end_value']}"></span></div>
                                    </div>`
                        }
                        return ``
                    }
                },
            ],
            initComplete: function(settings, json) {
                table.find('tbody tr').each(function () {
                    if ($(this).find('.see-detail-wh').length > 0) {
                        $(this).closest('tr').addClass('bg-primary-light-5')
                        $(this).closest('tr').addClass('fixed-row')
                    }
                    if ($(this).find('.product_row').length > 0) {
                        $(this).attr('data-bs-toggle', 'tooltip')
                        $(this).attr('title', $(this).find('.product_row').attr('data-product-code') + ' - ' + $(this).find('.product_row').text())
                    }
                })

                let sum_wh_open_value = 0;
                let sum_wh_in_value = 0;
                let sum_wh_out_value = 0;
                let sum_wh_end_value = 0;

                for (const wh of data_wh) {
                    let wh_open_value = 0
                    table.find(`.prd-open-value-${wh}`).each(function () {
                        wh_open_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-open-value-${wh}`).attr('data-init-money', wh_open_value)

                    let wh_in_value = 0
                    table.find(`.prd-in-value-${wh}`).each(function () {
                        wh_in_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-in-value-${wh}`).attr('data-init-money', wh_in_value)

                    let wh_out_value = 0
                    table.find(`.prd-out-value-${wh}`).each(function () {
                        wh_out_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-out-value-${wh}`).attr('data-init-money', wh_out_value)

                    let wh_end_value = 0
                    table.find(`.prd-end-value-${wh}`).each(function () {
                        wh_end_value += parseFloat($(this).attr('data-init-money'))
                    })
                    table.find(`.wh-end-value-${wh}`).attr('data-init-money', wh_end_value)

                    sum_wh_open_value += wh_open_value;
                    sum_wh_in_value += wh_in_value;
                    sum_wh_out_value += wh_out_value;
                    sum_wh_end_value += wh_end_value;
                }

                if (data_wh.length === 0) {
                    table.find('tbody tr').each(function () {
                        sum_wh_open_value += $(this).find('td:eq(7) span').attr('data-init-money') ? parseFloat($(this).find('td:eq(7) span').attr('data-init-money')) : 0
                        sum_wh_in_value += $(this).find('td:eq(9) span').attr('data-init-money') ? parseFloat($(this).find('td:eq(9) span').attr('data-init-money')) : 0
                        sum_wh_out_value += $(this).find('td:eq(11) span').attr('data-init-money') ? parseFloat($(this).find('td:eq(11) span').attr('data-init-money')) : 0
                        sum_wh_end_value += $(this).find('td:eq(13) span').attr('data-init-money') ? parseFloat($(this).find('td:eq(13) span').attr('data-init-money')) : 0
                    })
                }

                $('.opening-total-value').attr('data-init-money', sum_wh_open_value)
                $('.in-total-value').attr('data-init-money', sum_wh_in_value)
                $('.out-total-value').attr('data-init-money', sum_wh_out_value)
                $('.ending-total-value').attr('data-init-money', sum_wh_end_value)

                if (!table_detail) {
                    $('.detail_row').each(function () {
                        $(this).closest('tr').remove()
                    })

                    table.DataTable().column(3).visible(false)
                    table.DataTable().column(4).visible(false)
                }

                if (order_code_list.length === 0) {
                    table.DataTable().column(0).visible(false)
                }

                for (const so_code_class of order_code_list) {
                    let number_row = table.find(`.${so_code_class}`).length + 1
                    table.find(`.${so_code_class}:eq(0)`).closest('tr').before(`
                        <tr>
                            <td rowspan="${number_row}" class="text-center">
                                <span class="text-danger fw-bold">${so_code_class.split('-')[3]}</span>
                            </td>
                        </tr>
                    `)
                    table.find(`.${so_code_class}`).each(function () {
                        $(this).closest('tr').find('td:eq(0)').remove()
                    })
                }
                MatchTooltip()

                let wrapper$ = table.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="text-muted">${trans_script.attr('data-trans-vm')}</span>`)
                    ).append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="badge bg-blue badge-indicator"></span><span class="text-muted">${trans_script.attr('data-trans-fifo')}</span>`)
                    ).append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="badge bg-success badge-indicator"></span><span class="text-muted">${trans_script.attr('data-trans-we')}</span>`)
                    ).append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="badge bg-danger badge-indicator"></span><span class="text-muted">${trans_script.attr('data-trans-si')}</span>`)
                    )
                }
            },
        });
    }

    function RenderWarehouseAvailableProductListTable(table, data_list=[]) {
        table.DataTable().clear().destroy()
        table.DataTableDefault({
            reloadCurrency: true,
            data: data_list,
            rowIdx: true,
            ordering: false,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'w-55',
                    render: (data, type, row) => {
                        return `<span class="badge badge-sm badge-light">${row?.['product']?.['code']}</span><br>
                                <span class="prd-title">${row?.['product']?.['title']}</span>`
                    }
                },
                {
                    className: 'w-20 text-right',
                    render: (data, type, row) => {
                        return `<span class="text-muted">${row?.['stock_amount']}</span><span class="ml-1 text-muted">${row?.['product']?.['uom']?.['title']}</span>`
                    }
                },
                {
                    className: 'w-20 text-right',
                    render: (data, type, row) => {
                        if (row?.['product']?.['general_traceability_method'] === 0) {
                            return $.fn.gettext('None')
                        }
                        else if (row?.['product']?.['general_traceability_method'] === 1) {
                            return `<button data-prd-id="${row?.['product']?.['id']}" type="button" data-bs-toggle="modal" data-bs-target="#modal-available-product-detail-lot" class="see-detail-prd btn btn-soft-danger btn-animated btn-xs">Batch/Lot</button>`
                        }
                        else if (row?.['product']?.['general_traceability_method'] === 2) {
                            return `<button data-prd-id="${row?.['product']?.['id']}" type="button" data-bs-toggle="modal" data-bs-target="#modal-available-product-detail-serial" class="see-detail-prd btn btn-soft-primary btn-animated btn-xs">Serial</button>`
                        }
                        return ''
                    }
                },
            ],
        });
    }

    function RenderWarehouseAvailableProductDetailLotTable(data_list=[]) {
        detail_lot_tbl.DataTable().clear().destroy()
        detail_lot_tbl.DataTableDefault({
            reloadCurrency: true,
            data: data_list,
            rowIdx: true,
            ordering: false,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'w-45',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'lot_row') {
                            return `<span class="text-muted">${row?.['lot_number'] || ''}</span>`
                        }
                        else if (row?.['row_type'] === 'sn_row') {
                            return `<span class="text-muted">${row?.['vendor_serial_number'] || ''}</span>`
                        }
                        return ''
                    }
                },
                {
                    className: 'w-45',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'lot_row') {
                            return `<span class="text-muted">${row?.['quantity_import'] || 0}</span>`
                        }
                        else if (row?.['row_type'] === 'sn_row') {
                            return `<span class="text-muted">${row?.['serial_number'] || ''}</span>`
                        }
                        return ''
                    },
                },
                {
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'lot_row') {
                            return `<a href="#" class="scan_qr"><span class="text-blue fw-bold qr-code-lot-info"
                                          data-product-id="${row?.['product']?.['id']}"
                                          data-product-code="${row?.['product']?.['code']}"
                                          data-product-title="${row?.['product']?.['title']}"
                                          data-product-description="${row?.['product']?.['description']}"
                                          data-lot-number="${row?.['lot_number']}"
                                          data-expire-date="${row?.['expire_date']}"
                                          data-goods-receipt-date="${row?.['goods_receipt_date']}"
                                    >
                                        <i class="fa-solid fa-qrcode"></i>
                                    </span></a>`
                        }
                        else if (row?.['row_type'] === 'sn_row') {
                            return `<a href="#" class="scan_qr"><span class="text-muted fw-bold qr-code-sn-info"
                                          data-product-id="${row?.['product']?.['id']}"
                                          data-product-code="${row?.['product']?.['code']}"
                                          data-product-title="${row?.['product']?.['title']}"
                                          data-product-description="${row?.['product']?.['description']}"
                                          data-serial-number="${row?.['serial_number']}"
                                          data-vendor-serial-number="${row?.['vendor_serial_number']}"
                                          data-goods-receipt-date="${row?.['goods_receipt_date']}"
                                    >
                                        <i class="fa-solid fa-qrcode"></i>
                                    </span></a>`
                        }
                        return ''
                    }
                }
            ],
        });
    }

    function RenderWarehouseAvailableProductDetailSerialTable(data_list=[]) {
        detail_sn_tbl.DataTable().clear().destroy()
        detail_sn_tbl.DataTableDefault({
            reloadCurrency: true,
            data: data_list,
            rowIdx: true,
            ordering: false,
            scrollX: true,
            scrollY: '70vh',
            scrollCollapse: true,
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'w-45',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'lot_row') {
                            return `<span class="text-muted">${row?.['lot_number'] || ''}</span>`
                        }
                        else if (row?.['row_type'] === 'sn_row') {
                            return `<span class="text-muted">${row?.['vendor_serial_number'] || ''}</span>`
                        }
                        return ''
                    }
                },
                {
                    className: 'w-45',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'lot_row') {
                            return `<span class="text-muted">${row?.['quantity_import'] || 0}</span>`
                        }
                        else if (row?.['row_type'] === 'sn_row') {
                            return `<span class="text-muted">${row?.['serial_number'] || ''}</span>`
                        }
                        return ''
                    },
                },
                {
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        if (row?.['row_type'] === 'lot_row') {
                            return `<a href="#" class="scan_qr"><span class="text-blue fw-bold qr-code-lot-info"
                                          data-product-id="${row?.['product']?.['id']}"
                                          data-product-code="${row?.['product']?.['code']}"
                                          data-product-title="${row?.['product']?.['title']}"
                                          data-product-description="${row?.['product']?.['description']}"
                                          data-lot-number="${row?.['lot_number']}"
                                          data-expire-date="${row?.['expire_date']}"
                                          data-goods-receipt-date="${row?.['goods_receipt_date']}"
                                    >
                                        <i class="fa-solid fa-qrcode"></i>
                                    </span></a>`
                        }
                        else if (row?.['row_type'] === 'sn_row') {
                            return `<a href="#" class="scan_qr"><span class="text-muted fw-bold qr-code-sn-info"
                                          data-product-id="${row?.['product']?.['id']}"
                                          data-product-code="${row?.['product']?.['code']}"
                                          data-product-title="${row?.['product']?.['title']}"
                                          data-product-description="${row?.['product']?.['description']}"
                                          data-serial-number="${row?.['serial_number']}"
                                          data-vendor-serial-number="${row?.['vendor_serial_number']}"
                                          data-goods-receipt-date="${row?.['goods_receipt_date']}"
                                    >
                                        <i class="fa-solid fa-qrcode"></i>
                                    </span></a>`
                        }
                        return ''
                    }
                }
            ],
        });
    }

    $('#btn-view').on('click', function () {
        current_view_mode = 'general'
        $('#thead-value').find('span').text('0')
        $('#thead-value').find('span').attr('data-init-money', 0)
        if (periodMonthEle.val()) {
            WindowControl.showLoading();
            let dataParam = {}
            dataParam['sub_period_order'] = parseInt(periodMonthEle.val())
            dataParam['period_mapped'] = periodEle.val()
            if (project_select_Ele.val()) {
                dataParam['sale_order'] = project_select_Ele.val()
            }
            dataParam['product_id_list'] = items_select_Ele.val().join(',')
            let inventory_detail_list_ajax = $.fn.callAjax2({
                url: url_script.attr('data-url-inventory-list') + `?date_range=${$('#period-day-from').val()}-${$('#period-day-to').val()}`,
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_cost_list')) {
                        return data?.['report_inventory_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([inventory_detail_list_ajax]).then(
                (results) => {
                    let results_data = []
                    for (const item of results[0]) {
                        if (Object.keys(item?.['warehouse']).length > 0) {
                            results_data.push(item)
                        }
                        else {
                            for (let i = 0; i < item?.['warehouse_sub_list'].length; i++) {
                                results_data.push({
                                    "id": item?.['id'],
                                    "product": item?.['product'],
                                    "warehouse": item?.['warehouse_sub_list'][i],
                                    "period_mapped": item?.['period_mapped'],
                                    "sub_period_order": item?.['sub_period_order'],
                                    "stock_activities": item?.['stock_activities'][i],
                                    "for_balance_init": item?.['for_balance_init']
                                })
                            }
                        }
                    }
                    results_data.sort((a, b) => (a.warehouse.code > b.warehouse.code) ? 1 : -1)
                    let table_inventory_report_wh_row = []
                    let table_inventory_report_data = []
                    for (const warehouse_activities of results_data) {
                        if (warehouses_select_Ele.val().length === 0) {
                            if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                    table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                }
                                table_inventory_report_data.push({
                                    'type': 'warehouse_row',
                                    'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                    'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                    'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                })
                                table_inventory_report_data.push({
                                    'type': 'product_row',
                                    'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                    'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                    'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                    'product_code': warehouse_activities?.['product']?.['code'] || '',
                                    'product_title': warehouse_activities?.['product']?.['title'] || '',
                                    'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                    'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                    'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                    'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                    'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                    'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                    'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                    'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                    'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                    'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                    'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                    'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                    'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0,
                                })
                            }
                            else {
                                table_inventory_report_data.push({
                                    'type': 'product_row',
                                    'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                    'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                    'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                    'product_code': warehouse_activities?.['product']?.['code'] || '',
                                    'product_title': warehouse_activities?.['product']?.['title'] || '',
                                    'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                    'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                    'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                    'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                    'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                    'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                    'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                    'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                    'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                    'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                    'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                    'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                    'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0,
                                })
                            }
                        }
                        else {
                            if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse']?.['id'])) {
                                if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                    if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                        table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                    }
                                    table_inventory_report_data.push({
                                        'type': 'warehouse_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                    })
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'product_title': warehouse_activities?.['product']?.['title'] || '',
                                        'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                        'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                        'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                        'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                        'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                        'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                        'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                        'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                        'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                        'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                        'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0
                                    })
                                } else {
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'product_title': warehouse_activities?.['product']?.['title'] || '',
                                        'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                        'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                        'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                        'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                        'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                        'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                        'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                        'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                        'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                        'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                        'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0
                                    })
                                }
                            }
                        }
                    }
                    RenderMainTable(table_inventory_report, table_inventory_report_data, table_inventory_report_wh_row)
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                            if ($definition_inventory_valuation === '1') {
                                let condition1 = $definition_inventory_valuation === '1' && PERIODIC_CLOSED === false
                                let condition2 = $definition_inventory_valuation === '1'
                                let condition3 = PERIODIC_CLOSED === false

                                table_inventory_report.find('#out-total-value').prop('hidden', condition1)
                                table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition1)
                                table_inventory_report.find('tbody .out-value-span').prop('hidden', condition1)
                                table_inventory_report.find('#ending-total-value').prop('hidden', condition1)
                                table_inventory_report.find('tbody .wh-ending-value-span').prop('hidden', condition1)
                                table_inventory_report.find('tbody .ending-value-span').prop('hidden', condition1)

                                table_inventory_report.find('tbody .out-value-span-detail').prop('hidden', condition2)

                                table_inventory_report.find('tbody .out-value-span').prop('hidden', condition3)
                                table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition3)
                            }
                        },
                        500
                    )
                })
        }
        else {
            $.fn.notifyB({"description": 'No sub period selected.', "timeout": 3500}, 'warning')
        }
    })
    $('#btn-view').trigger('click')

    $('#btn-view-detail').on('click', function () {
        current_view_mode = 'detail'
        $('#thead-value').find('span').text('0')
        $('#thead-value').find('span').attr('data-init-money', 0)
        if (periodMonthEle.val()) {
            WindowControl.showLoading();
            let dataParam = {}
            dataParam['sub_period_order'] = parseInt(periodMonthEle.val())
            dataParam['period_mapped'] = periodEle.val()
            if (project_select_Ele.val()) {
                dataParam['sale_order'] = project_select_Ele.val()
            }
            dataParam['product_id_list'] = items_select_Ele.val().join(',')
            let inventory_detail_list_ajax = $.fn.callAjax2({
                url: url_script.attr('data-url-inventory-list') + `?date_range=${$('#period-day-from').val()}-${$('#period-day-to').val()}`,
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_cost_list')) {
                        return data?.['report_inventory_cost_list'];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([inventory_detail_list_ajax]).then(
                (results) => {
                    let results_data = []
                    for (const item of results[0]) {
                        if (Object.keys(item?.['warehouse']).length > 0) {
                            results_data.push(item)
                        }
                        else {
                            for (let i = 0; i < item?.['warehouse_sub_list'].length; i++) {
                                results_data.push({
                                    "id": item?.['id'],
                                    "product": item?.['product'],
                                    "warehouse": item?.['warehouse_sub_list'][i],
                                    "period_mapped": item?.['period_mapped'],
                                    "sub_period_order": item?.['sub_period_order'],
                                    "stock_activities": item?.['stock_activities'][i],
                                    "for_balance_init": item?.['for_balance_init']
                                })
                            }
                        }
                    }
                    results_data.sort((a, b) => (a.warehouse.code > b.warehouse.code) ? 1 : -1)
                    let table_inventory_report_wh_row = []
                    let table_inventory_report_data = []
                    for (const warehouse_activities of results_data) {
                        if (warehouses_select_Ele.val().length === 0) {
                            if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                    table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                }
                                table_inventory_report_data.push({
                                    'type': 'warehouse_row',
                                    'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                    'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                    'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                })
                                table_inventory_report_data.push({
                                    'type': 'product_row',
                                    'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                    'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                    'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                    'product_code': warehouse_activities?.['product']?.['code'] || '',
                                    'product_title': warehouse_activities?.['product']?.['title'] || '',
                                    'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                    'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                    'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                    'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                    'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                    'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                    'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                    'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                    'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                    'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                    'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                    'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                    'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0,
                                })
                                for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                    let bg_in = ''
                                    let bg_out = ''
                                    if (activity?.['trans_title'] === 'Goods receipt') {
                                        bg_in = 'text-primary'
                                    }
                                    if (activity?.['trans_title'] === 'Goods return') {
                                        bg_in = 'text-blue'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery (sale)') {
                                        bg_out = 'text-danger dlvr-sale'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery (lease)') {
                                        bg_out = 'text-danger dlvr-lease'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery (service)') {
                                        bg_out = 'text-danger dlvr-service'
                                    }
                                    if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                        bg_in = 'text-green'
                                    }
                                    if (activity?.['trans_title'] === 'Goods issue') {
                                        bg_out = 'text-orange'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                        bg_in = 'text-purple gtf-in'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                        bg_out = 'text-purple gtf-out'
                                    }
                                    if (activity?.['trans_title'] === 'Balance init input') {
                                        bg_in = 'text-secondary'
                                    }
                                    let trans_title_sub = {
                                        'Goods receipt': trans_script.attr('data-trans-grc'),
                                        'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                        'Goods return': trans_script.attr('data-trans-grt'),
                                        'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                        'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                        'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                        'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                        'Goods issue': trans_script.attr('data-trans-gis'),
                                        'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                    }

                                    table_inventory_report_data.push({
                                        'type': 'detail_row',
                                        'trans_code': activity?.['trans_code'] || '',
                                        'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                        'lot_number': activity?.['lot_number'] || '',
                                        'serial_number': activity?.['serial_number'] || '',
                                        'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                        'bg_in': bg_in,
                                        'in_quantity': activity?.['in_quantity'] || 0,
                                        'in_value': activity?.['in_value'] || 0,
                                        'bg_out': bg_out,
                                        'out_quantity': activity?.['out_quantity'] || 0,
                                        'out_value': activity?.['out_value'] || 0,
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                    })
                                }
                            }
                            else {
                                table_inventory_report_data.push({
                                    'type': 'product_row',
                                    'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                    'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                    'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                    'product_code': warehouse_activities?.['product']?.['code'] || '',
                                    'product_title': warehouse_activities?.['product']?.['title'] || '',
                                    'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                    'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                    'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                    'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                    'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                    'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                    'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                    'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                    'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                    'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                    'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                    'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                    'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0,
                                })
                                for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                    let bg_in = ''
                                    let bg_out = ''
                                    if (activity?.['trans_title'] === 'Goods receipt') {
                                        bg_in = 'text-primary'
                                    }
                                    if (activity?.['trans_title'] === 'Goods return') {
                                        bg_in = 'text-blue'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery (sale)') {
                                        bg_out = 'text-danger dlvr-sale'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery (lease)') {
                                        bg_out = 'text-danger dlvr-lease'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery (service)') {
                                        bg_out = 'text-danger dlvr-service'
                                    }
                                    if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                        bg_in = 'text-green'
                                    }
                                    if (activity?.['trans_title'] === 'Goods issue') {
                                        bg_out = 'text-orange'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                        bg_in = 'text-purple gtf-in'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                        bg_out = 'text-purple gtf-out'
                                    }
                                    if (activity?.['trans_title'] === 'Balance init input') {
                                        bg_in = 'text-secondary'
                                    }
                                    let trans_title_sub = {
                                        'Goods receipt': trans_script.attr('data-trans-grc'),
                                        'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                        'Goods return': trans_script.attr('data-trans-grt'),
                                        'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                        'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                        'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                        'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                        'Goods issue': trans_script.attr('data-trans-gis'),
                                        'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                    }

                                    table_inventory_report_data.push({
                                        'type': 'detail_row',
                                        'trans_code': activity?.['trans_code'] || '',
                                        'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                        'lot_number': activity?.['lot_number'] || '',
                                        'serial_number': activity?.['serial_number'] || '',
                                        'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                        'bg_in': bg_in,
                                        'in_quantity': activity?.['in_quantity'] || 0,
                                        'in_value': activity?.['in_value'] || 0,
                                        'bg_out': bg_out,
                                        'out_quantity': activity?.['out_quantity'] || 0,
                                        'out_value': activity?.['out_value'] || 0,
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                    })
                                }
                            }
                        }
                        else {
                            if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse']?.['id'])) {
                                if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                    if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                        table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                    }
                                    table_inventory_report_data.push({
                                        'type': 'warehouse_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                    })
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'product_title': warehouse_activities?.['product']?.['title'] || '',
                                        'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                        'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                        'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                        'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                        'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                        'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                        'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                        'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                        'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                        'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                        'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0
                                    })
                                    for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                    let bg_in = ''
                                    let bg_out = ''
                                    if (activity?.['trans_title'] === 'Goods receipt') {
                                        bg_in = 'text-primary'
                                    }
                                    if (activity?.['trans_title'] === 'Goods return') {
                                        bg_in = 'text-blue'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery (sale)') {
                                        bg_out = 'text-danger dlvr-sale'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery (lease)') {
                                        bg_out = 'text-danger dlvr-lease'
                                    }
                                    if (activity?.['trans_title'] === 'Delivery (service)') {
                                        bg_out = 'text-danger dlvr-service'
                                    }
                                    if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                        bg_in = 'text-green'
                                    }
                                    if (activity?.['trans_title'] === 'Goods issue') {
                                        bg_out = 'text-orange'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                        bg_in = 'text-purple gtf-in'
                                    }
                                    if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                        bg_out = 'text-purple gtf-out'
                                    }
                                    if (activity?.['trans_title'] === 'Balance init input') {
                                        bg_in = 'text-secondary'
                                    }
                                    let trans_title_sub = {
                                        'Goods receipt': trans_script.attr('data-trans-grc'),
                                        'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                        'Goods return': trans_script.attr('data-trans-grt'),
                                        'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                        'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                        'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                        'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                        'Goods issue': trans_script.attr('data-trans-gis'),
                                        'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                    }

                                    table_inventory_report_data.push({
                                        'type': 'detail_row',
                                        'trans_code': activity?.['trans_code'] || '',
                                        'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                        'lot_number': activity?.['lot_number'] || '',
                                        'serial_number': activity?.['serial_number'] || '',
                                        'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                        'bg_in': bg_in,
                                        'in_quantity': activity?.['in_quantity'] || 0,
                                        'in_value': activity?.['in_value'] || 0,
                                        'bg_out': bg_out,
                                        'out_quantity': activity?.['out_quantity'] || 0,
                                        'out_value': activity?.['out_value'] || 0,
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                    })
                                }
                                } else {
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'product_title': warehouse_activities?.['product']?.['title'] || '',
                                        'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                        'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                        'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                        'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                        'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                        'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                        'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                        'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                        'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                        'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                        'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0
                                    })
                                    for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                        let bg_in = ''
                                        let bg_out = ''
                                        if (activity?.['trans_title'] === 'Goods receipt') {
                                            bg_in = 'text-primary'
                                        }
                                        if (activity?.['trans_title'] === 'Goods return') {
                                            bg_in = 'text-blue'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (sale)') {
                                            bg_out = 'text-danger dlvr-sale'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (lease)') {
                                            bg_out = 'text-danger dlvr-lease'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (service)') {
                                            bg_out = 'text-danger dlvr-service'
                                        }
                                        if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                            bg_in = 'text-green'
                                        }
                                        if (activity?.['trans_title'] === 'Goods issue') {
                                            bg_out = 'text-orange'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                            bg_in = 'text-purple gtf-in'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            bg_out = 'text-purple gtf-out'
                                        }
                                        if (activity?.['trans_title'] === 'Balance init input') {
                                            bg_in = 'text-secondary'
                                        }
                                        let trans_title_sub = {
                                            'Goods receipt': trans_script.attr('data-trans-grc'),
                                            'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                            'Goods return': trans_script.attr('data-trans-grt'),
                                            'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                            'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                            'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                            'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                            'Goods issue': trans_script.attr('data-trans-gis'),
                                            'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                        }

                                        table_inventory_report_data.push({
                                            'type': 'detail_row',
                                            'trans_code': activity?.['trans_code'] || '',
                                            'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                            'product_code': warehouse_activities?.['product']?.['code'] || '',
                                            'date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                            'lot_number': activity?.['lot_number'] || '',
                                            'serial_number': activity?.['serial_number'] || '',
                                            'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                            'bg_in': bg_in,
                                            'in_quantity': activity?.['in_quantity'] || 0,
                                            'in_value': activity?.['in_value'] || 0,
                                            'bg_out': bg_out,
                                            'out_quantity': activity?.['out_quantity'] || 0,
                                            'out_value': activity?.['out_value'] || 0,
                                            'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || 0,
                                            'order_code': warehouse_activities?.['product']?.['order_code'] || 0,
                                        })
                                    }
                                }
                            }
                        }
                    }
                    RenderMainTable(table_inventory_report, table_inventory_report_data, table_inventory_report_wh_row, true)
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                            if ($definition_inventory_valuation === '1') {
                                let condition1 = $definition_inventory_valuation === '1' && PERIODIC_CLOSED === false
                                let condition2 = $definition_inventory_valuation === '1'
                                let condition3 = PERIODIC_CLOSED === false

                                table_inventory_report.find('#out-total-value').prop('hidden', condition1)
                                table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition1)
                                table_inventory_report.find('tbody .out-value-span').prop('hidden', condition1)
                                table_inventory_report.find('#ending-total-value').prop('hidden', condition1)
                                table_inventory_report.find('tbody .wh-ending-value-span').prop('hidden', condition1)
                                table_inventory_report.find('tbody .ending-value-span').prop('hidden', condition1)

                                table_inventory_report.find('tbody .out-value-span-detail').prop('hidden', condition2)

                                table_inventory_report.find('tbody .out-value-span').prop('hidden', condition3)
                                table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition3)
                            }
                        },
                        500
                    )
                })
        }
        else {
            $.fn.notifyB({"description": 'No sub period selected.', "timeout": 3500}, 'warning')
        }
    })

    $('#btn-refresh').on('click', function () {
        if (current_view_mode === 'general') {
            $('#thead-value').find('span').text('0')
            $('#thead-value').find('span').attr('data-init-money', 0)
            if (periodMonthEle.val()) {
                WindowControl.showLoading();
                let dataParam = {}
                dataParam['sub_period_order'] = parseInt(periodMonthEle.val())
                dataParam['period_mapped'] = periodEle.val()
                if (project_select_Ele.val()) {
                    dataParam['sale_order'] = project_select_Ele.val()
                }
                dataParam['product_id_list'] = items_select_Ele.val().join(',')
                let inventory_detail_list_ajax = $.fn.callAjax2({
                    url: url_script.attr('data-url-inventory-list') + `?date_range=${$('#period-day-from').val()}-${$('#period-day-to').val()}`,
                    data: dataParam,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_cost_list')) {
                            return data?.['report_inventory_cost_list'];
                        }
                        return {};
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([inventory_detail_list_ajax]).then(
                    (results) => {
                        let results_data = []
                        for (const item of results[0]) {
                            if (Object.keys(item?.['warehouse']).length > 0) {
                                results_data.push(item)
                            } else {
                                for (let i = 0; i < item?.['warehouse_sub_list'].length; i++) {
                                    results_data.push({
                                        "id": item?.['id'],
                                        "product": item?.['product'],
                                        "warehouse": item?.['warehouse_sub_list'][i],
                                        "period_mapped": item?.['period_mapped'],
                                        "sub_period_order": item?.['sub_period_order'],
                                        "stock_activities": item?.['stock_activities'][i],
                                        "for_balance_init": item?.['for_balance_init']
                                    })
                                }
                            }
                        }
                        results_data.sort((a, b) => (a.warehouse.code > b.warehouse.code) ? 1 : -1)
                        let table_inventory_report_wh_row = []
                        let table_inventory_report_data = []
                        for (const warehouse_activities of results_data) {
                            if (warehouses_select_Ele.val().length === 0) {
                                if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                    if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                        table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                    }
                                    table_inventory_report_data.push({
                                        'type': 'warehouse_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                    })
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'product_title': warehouse_activities?.['product']?.['title'] || '',
                                        'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                        'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                        'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                        'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                        'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                        'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                        'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                        'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                        'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                        'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                        'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0,
                                    })
                                } else {
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'product_title': warehouse_activities?.['product']?.['title'] || '',
                                        'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                        'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                        'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                        'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                        'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                        'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                        'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                        'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                        'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                        'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                        'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0,
                                    })
                                }
                            } else {
                                if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse']?.['id'])) {
                                    if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                        if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                            table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                        }
                                        table_inventory_report_data.push({
                                            'type': 'warehouse_row',
                                            'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                            'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                            'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                        })
                                        table_inventory_report_data.push({
                                            'type': 'product_row',
                                            'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                            'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                            'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                            'product_code': warehouse_activities?.['product']?.['code'] || '',
                                            'product_title': warehouse_activities?.['product']?.['title'] || '',
                                            'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                            'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                            'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                            'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                            'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                            'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                            'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                            'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                            'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                            'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                            'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                            'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                            'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0
                                        })
                                    } else {
                                        table_inventory_report_data.push({
                                            'type': 'product_row',
                                            'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                            'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                            'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                            'product_code': warehouse_activities?.['product']?.['code'] || '',
                                            'product_title': warehouse_activities?.['product']?.['title'] || '',
                                            'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                            'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                            'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                            'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                            'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                            'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                            'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                            'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                            'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                            'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                            'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                            'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                            'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0
                                        })
                                    }
                                }
                            }
                        }
                        RenderMainTable(table_inventory_report, table_inventory_report_data, table_inventory_report_wh_row)
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                                if ($definition_inventory_valuation === '1') {
                                    let condition1 = $definition_inventory_valuation === '1' && PERIODIC_CLOSED === false
                                    let condition2 = $definition_inventory_valuation === '1'
                                    let condition3 = PERIODIC_CLOSED === false

                                    table_inventory_report.find('#out-total-value').prop('hidden', condition1)
                                    table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition1)
                                    table_inventory_report.find('tbody .out-value-span').prop('hidden', condition1)
                                    table_inventory_report.find('#ending-total-value').prop('hidden', condition1)
                                    table_inventory_report.find('tbody .wh-ending-value-span').prop('hidden', condition1)
                                    table_inventory_report.find('tbody .ending-value-span').prop('hidden', condition1)

                                    table_inventory_report.find('tbody .out-value-span-detail').prop('hidden', condition2)

                                    table_inventory_report.find('tbody .out-value-span').prop('hidden', condition3)
                                    table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition3)
                                }
                            },
                            500
                        )
                    })
            } else {
                $.fn.notifyB({"description": 'No sub period selected.', "timeout": 3500}, 'warning')
            }
        }
        else {
            current_view_mode = 'detail'
            $('#thead-value').find('span').text('0')
            $('#thead-value').find('span').attr('data-init-money', 0)
            if (periodMonthEle.val()) {
                WindowControl.showLoading();
                let dataParam = {}
                dataParam['sub_period_order'] = parseInt(periodMonthEle.val())
                dataParam['period_mapped'] = periodEle.val()
                if (project_select_Ele.val()) {
                    dataParam['sale_order'] = project_select_Ele.val()
                }
                dataParam['product_id_list'] = items_select_Ele.val().join(',')
                let inventory_detail_list_ajax = $.fn.callAjax2({
                    url: url_script.attr('data-url-inventory-list') + `?date_range=${$('#period-day-from').val()}-${$('#period-day-to').val()}`,
                    data: dataParam,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && typeof data === 'object' && data.hasOwnProperty('report_inventory_cost_list')) {
                            return data?.['report_inventory_cost_list'];
                        }
                        return {};
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([inventory_detail_list_ajax]).then(
                    (results) => {
                        let results_data = []
                        for (const item of results[0]) {
                            if (Object.keys(item?.['warehouse']).length > 0) {
                                results_data.push(item)
                            }
                            else {
                                for (let i = 0; i < item?.['warehouse_sub_list'].length; i++) {
                                    results_data.push({
                                        "id": item?.['id'],
                                        "product": item?.['product'],
                                        "warehouse": item?.['warehouse_sub_list'][i],
                                        "period_mapped": item?.['period_mapped'],
                                        "sub_period_order": item?.['sub_period_order'],
                                        "stock_activities": item?.['stock_activities'][i],
                                        "for_balance_init": item?.['for_balance_init']
                                    })
                                }
                            }
                        }
                        results_data.sort((a, b) => (a.warehouse.code > b.warehouse.code) ? 1 : -1)
                        let table_inventory_report_wh_row = []
                        let table_inventory_report_data = []
                        for (const warehouse_activities of results_data) {
                            if (warehouses_select_Ele.val().length === 0) {
                                if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                    if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                        table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                    }
                                    table_inventory_report_data.push({
                                        'type': 'warehouse_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                    })
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'product_title': warehouse_activities?.['product']?.['title'] || '',
                                        'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                        'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                        'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                        'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                        'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                        'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                        'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                        'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                        'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                        'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                        'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0,
                                    })
                                    for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                        let bg_in = ''
                                        let bg_out = ''
                                        if (activity?.['trans_title'] === 'Goods receipt') {
                                            bg_in = 'text-primary'
                                        }
                                        if (activity?.['trans_title'] === 'Goods return') {
                                            bg_in = 'text-blue'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (sale)') {
                                            bg_out = 'text-danger dlvr-sale'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (lease)') {
                                            bg_out = 'text-danger dlvr-lease'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (service)') {
                                            bg_out = 'text-danger dlvr-service'
                                        }
                                        if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                            bg_in = 'text-green'
                                        }
                                        if (activity?.['trans_title'] === 'Goods issue') {
                                            bg_out = 'text-orange'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                            bg_in = 'text-purple gtf-in'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            bg_out = 'text-purple gtf-out'
                                        }
                                        if (activity?.['trans_title'] === 'Balance init input') {
                                            bg_in = 'text-secondary'
                                        }
                                        let trans_title_sub = {
                                            'Goods receipt': trans_script.attr('data-trans-grc'),
                                            'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                            'Goods return': trans_script.attr('data-trans-grt'),
                                            'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                            'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                            'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                            'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                            'Goods issue': trans_script.attr('data-trans-gis'),
                                            'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                        }

                                        table_inventory_report_data.push({
                                            'type': 'detail_row',
                                            'trans_code': activity?.['trans_code'] || '',
                                            'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                            'product_code': warehouse_activities?.['product']?.['code'] || '',
                                            'date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                            'lot_number': activity?.['lot_number'] || '',
                                            'serial_number': activity?.['serial_number'] || '',
                                            'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                            'bg_in': bg_in,
                                            'in_quantity': activity?.['in_quantity'] || 0,
                                            'in_value': activity?.['in_value'] || 0,
                                            'bg_out': bg_out,
                                            'out_quantity': activity?.['out_quantity'] || 0,
                                            'out_value': activity?.['out_value'] || 0,
                                            'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                            'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        })
                                    }
                                }
                                else {
                                    table_inventory_report_data.push({
                                        'type': 'product_row',
                                        'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                        'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                        'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                        'product_code': warehouse_activities?.['product']?.['code'] || '',
                                        'product_title': warehouse_activities?.['product']?.['title'] || '',
                                        'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                        'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                        'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                        'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                        'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                        'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                        'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                        'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                        'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                        'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                        'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                        'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0,
                                    })
                                    for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                        let bg_in = ''
                                        let bg_out = ''
                                        if (activity?.['trans_title'] === 'Goods receipt') {
                                            bg_in = 'text-primary'
                                        }
                                        if (activity?.['trans_title'] === 'Goods return') {
                                            bg_in = 'text-blue'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (sale)') {
                                            bg_out = 'text-danger dlvr-sale'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (lease)') {
                                            bg_out = 'text-danger dlvr-lease'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (service)') {
                                            bg_out = 'text-danger dlvr-service'
                                        }
                                        if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                            bg_in = 'text-green'
                                        }
                                        if (activity?.['trans_title'] === 'Goods issue') {
                                            bg_out = 'text-orange'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                            bg_in = 'text-purple gtf-in'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            bg_out = 'text-purple gtf-out'
                                        }
                                        if (activity?.['trans_title'] === 'Balance init input') {
                                            bg_in = 'text-secondary'
                                        }
                                        let trans_title_sub = {
                                            'Goods receipt': trans_script.attr('data-trans-grc'),
                                            'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                            'Goods return': trans_script.attr('data-trans-grt'),
                                            'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                            'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                            'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                            'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                            'Goods issue': trans_script.attr('data-trans-gis'),
                                            'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                        }

                                        table_inventory_report_data.push({
                                            'type': 'detail_row',
                                            'trans_code': activity?.['trans_code'] || '',
                                            'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                            'product_code': warehouse_activities?.['product']?.['code'] || '',
                                            'date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                            'lot_number': activity?.['lot_number'] || '',
                                            'serial_number': activity?.['serial_number'] || '',
                                            'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                            'bg_in': bg_in,
                                            'in_quantity': activity?.['in_quantity'] || 0,
                                            'in_value': activity?.['in_value'] || 0,
                                            'bg_out': bg_out,
                                            'out_quantity': activity?.['out_quantity'] || 0,
                                            'out_value': activity?.['out_value'] || 0,
                                            'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                            'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        })
                                    }
                                }
                            }
                            else {
                                if (warehouses_select_Ele.val().includes(warehouse_activities?.['warehouse']?.['id'])) {
                                    if (!table_inventory_report_wh_row.includes(warehouse_activities?.['warehouse']?.['id']) && Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                        if (Object.keys(warehouse_activities?.['warehouse']).length !== 0) {
                                            table_inventory_report_wh_row.push(warehouse_activities?.['warehouse']?.['id'])
                                        }
                                        table_inventory_report_data.push({
                                            'type': 'warehouse_row',
                                            'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                            'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                            'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                        })
                                        table_inventory_report_data.push({
                                            'type': 'product_row',
                                            'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                            'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                            'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                            'product_code': warehouse_activities?.['product']?.['code'] || '',
                                            'product_title': warehouse_activities?.['product']?.['title'] || '',
                                            'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                            'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                            'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                            'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                            'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                            'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                            'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                            'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                            'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                            'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                            'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                            'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                            'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0
                                        })
                                        for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                        let bg_in = ''
                                        let bg_out = ''
                                        if (activity?.['trans_title'] === 'Goods receipt') {
                                            bg_in = 'text-primary'
                                        }
                                        if (activity?.['trans_title'] === 'Goods return') {
                                            bg_in = 'text-blue'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (sale)') {
                                            bg_out = 'text-danger dlvr-sale'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (lease)') {
                                            bg_out = 'text-danger dlvr-lease'
                                        }
                                        if (activity?.['trans_title'] === 'Delivery (service)') {
                                            bg_out = 'text-danger dlvr-service'
                                        }
                                        if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                            bg_in = 'text-green'
                                        }
                                        if (activity?.['trans_title'] === 'Goods issue') {
                                            bg_out = 'text-orange'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                            bg_in = 'text-purple gtf-in'
                                        }
                                        if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                            bg_out = 'text-purple gtf-out'
                                        }
                                        if (activity?.['trans_title'] === 'Balance init input') {
                                            bg_in = 'text-secondary'
                                        }
                                            let trans_title_sub = {
                                                'Goods receipt': trans_script.attr('data-trans-grc'),
                                                'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                                'Goods return': trans_script.attr('data-trans-grt'),
                                                'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                                'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                                'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                                'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                                'Goods issue': trans_script.attr('data-trans-gis'),
                                                'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                            }

                                        table_inventory_report_data.push({
                                            'type': 'detail_row',
                                            'trans_code': activity?.['trans_code'] || '',
                                            'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                            'product_code': warehouse_activities?.['product']?.['code'] || '',
                                            'date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                            'lot_number': activity?.['lot_number'] || '',
                                            'serial_number': activity?.['serial_number'] || '',
                                            'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                            'bg_in': bg_in,
                                            'in_quantity': activity?.['in_quantity'] || 0,
                                            'in_value': activity?.['in_value'] || 0,
                                            'bg_out': bg_out,
                                            'out_quantity': activity?.['out_quantity'] || 0,
                                            'out_value': activity?.['out_value'] || 0,
                                            'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                            'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                        })
                                    }
                                    } else {
                                        table_inventory_report_data.push({
                                            'type': 'product_row',
                                            'warehouse_id': warehouse_activities?.['warehouse']?.['id'] || '',
                                            'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || '',
                                            'warehouse_title': warehouse_activities?.['warehouse']?.['title'] || '',
                                            'product_code': warehouse_activities?.['product']?.['code'] || '',
                                            'product_title': warehouse_activities?.['product']?.['title'] || '',
                                            'vm': warehouse_activities?.['product']?.['valuation_method'] || 0,
                                            'product_lot_number': warehouse_activities?.['product']?.['lot_number'] || '',
                                            'product_serial_number': warehouse_activities?.['product']?.['serial_number'] || '',
                                            'order_code': warehouse_activities?.['product']?.['order_code'] || '',
                                            'uom_title': warehouse_activities?.['product']?.['uom']?.['title'] || '',
                                            'prd_open_quantity': warehouse_activities?.['stock_activities']?.['opening_balance_quantity'] || 0,
                                            'prd_open_value': warehouse_activities?.['stock_activities']?.['opening_balance_value'] || 0,
                                            'prd_in_quantity': warehouse_activities?.['stock_activities']?.['sum_in_quantity'] || 0,
                                            'prd_in_value': warehouse_activities?.['stock_activities']?.['sum_in_value'] || 0,
                                            'prd_out_quantity': warehouse_activities?.['stock_activities']?.['sum_out_quantity'] || 0,
                                            'prd_out_value': warehouse_activities?.['stock_activities']?.['sum_out_value'] || 0,
                                            'prd_end_quantity': warehouse_activities?.['stock_activities']?.['ending_balance_quantity'] || 0,
                                            'prd_end_value': warehouse_activities?.['stock_activities']?.['ending_balance_value'] || 0
                                        })
                                        for (const activity of warehouse_activities?.['stock_activities']?.['data_stock_activity']) {
                                            let bg_in = ''
                                            let bg_out = ''
                                            if (activity?.['trans_title'] === 'Goods receipt') {
                                                bg_in = 'text-primary'
                                            }
                                            if (activity?.['trans_title'] === 'Goods return') {
                                                bg_in = 'text-blue'
                                            }
                                            if (activity?.['trans_title'] === 'Delivery (sale)') {
                                                bg_out = 'text-danger dlvr-sale'
                                            }
                                            if (activity?.['trans_title'] === 'Delivery (lease)') {
                                                bg_out = 'text-danger dlvr-lease'
                                            }
                                            if (activity?.['trans_title'] === 'Delivery (service)') {
                                                bg_out = 'text-danger dlvr-service'
                                            }
                                            if (activity?.['trans_title'] === 'Goods receipt (IA)') {
                                                bg_in = 'text-green'
                                            }
                                            if (activity?.['trans_title'] === 'Goods issue') {
                                                bg_out = 'text-orange'
                                            }
                                            if (activity?.['trans_title'] === 'Goods transfer (in)') {
                                                bg_in = 'text-purple gtf-in'
                                            }
                                            if (activity?.['trans_title'] === 'Goods transfer (out)') {
                                                bg_out = 'text-purple gtf-out'
                                            }
                                            if (activity?.['trans_title'] === 'Balance init input') {
                                                bg_in = 'text-secondary'
                                            }
                                            let trans_title_sub = {
                                                'Goods receipt': trans_script.attr('data-trans-grc'),
                                                'Goods receipt (IA)': trans_script.attr('data-trans-grc') + ' (IA)',
                                                'Goods return': trans_script.attr('data-trans-grt'),
                                                'Goods transfer (in)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-in')})`,
                                                'Delivery (sale)': trans_script.attr('data-trans-dlvr-sale'),
                                                'Delivery (lease)': trans_script.attr('data-trans-dlvr-lease'),
                                                'Delivery (service)': trans_script.attr('data-trans-dlvr-service'),
                                                'Goods issue': trans_script.attr('data-trans-gis'),
                                                'Goods transfer (out)': trans_script.attr('data-trans-gtf') + ` (${trans_script.attr('data-trans-gtf-out')})`,
                                            }

                                            table_inventory_report_data.push({
                                                'type': 'detail_row',
                                                'trans_code': activity?.['trans_code'] || '',
                                                'trans_title': trans_title_sub?.[activity?.['trans_title']] || '',
                                                'product_code': warehouse_activities?.['product']?.['code'] || '',
                                                'date': activity?.['system_date'] ? moment(activity?.['system_date']).format("DD/MM/YYYY HH:mm") : '',
                                                'lot_number': activity?.['lot_number'] || '',
                                                'serial_number': activity?.['serial_number'] || '',
                                                'expired_date': activity?.['expire_date'] ? moment(activity?.['expire_date']).format("DD/MM/YYYY") : '',
                                                'bg_in': bg_in,
                                                'in_quantity': activity?.['in_quantity'] || 0,
                                                'in_value': activity?.['in_value'] || 0,
                                                'bg_out': bg_out,
                                                'out_quantity': activity?.['out_quantity'] || 0,
                                                'out_value': activity?.['out_value'] || 0,
                                                'warehouse_code': warehouse_activities?.['warehouse']?.['code'] || 0,
                                                'order_code': warehouse_activities?.['product']?.['order_code'] || 0,
                                            })
                                        }
                                    }
                                }
                            }
                        }
                        RenderMainTable(table_inventory_report, table_inventory_report_data, table_inventory_report_wh_row, true)
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                                if ($definition_inventory_valuation === '1') {
                                    let condition1 = $definition_inventory_valuation === '1' && PERIODIC_CLOSED === false
                                    let condition2 = $definition_inventory_valuation === '1'
                                    let condition3 = PERIODIC_CLOSED === false

                                    table_inventory_report.find('#out-total-value').prop('hidden', condition1)
                                    table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition1)
                                    table_inventory_report.find('tbody .out-value-span').prop('hidden', condition1)
                                    table_inventory_report.find('#ending-total-value').prop('hidden', condition1)
                                    table_inventory_report.find('tbody .wh-ending-value-span').prop('hidden', condition1)
                                    table_inventory_report.find('tbody .ending-value-span').prop('hidden', condition1)

                                    table_inventory_report.find('tbody .out-value-span-detail').prop('hidden', condition2)

                                    table_inventory_report.find('tbody .out-value-span').prop('hidden', condition3)
                                    table_inventory_report.find('tbody .wh-out-value-span').prop('hidden', condition3)
                                }
                            },
                            500
                        )
                    })
            }
            else {
                $.fn.notifyB({"description": 'No sub period selected.', "timeout": 3500}, 'warning')
            }
        }
    })

    $('#btn-export-to-excel').on('click', function () {
        ExportInventory()
    })

    function MatchTooltip() {
        table_inventory_report.find('.detail_row').each(function () {
            $(this).closest('tr').attr('data-bs-toggle', 'tooltip')
            $(this).closest('tr').attr('data-bs-placement', 'top')
            if ($(this).attr('class').includes('text-primary')) {
                $(this).closest('tr').attr('title', trans_script.attr('data-trans-grc'))
            }
            if ($(this).attr('class').includes('text-blue')) {
                $(this).closest('tr').attr('title', trans_script.attr('data-trans-grt'))
            }
            if ($(this).attr('class').includes('text-danger dlvr-sale')) {
                $(this).closest('tr').attr('title', trans_script.attr('data-trans-dlvr-sale'))
            }
            if ($(this).attr('class').includes('text-danger dlvr-lease')) {
                $(this).closest('tr').attr('title', trans_script.attr('data-trans-dlvr-lease'))
            }
            if ($(this).attr('class').includes('text-green')) {
                $(this).closest('tr').attr('title', `${trans_script.attr('data-trans-grc')} (IA)`)
            }
            if ($(this).attr('class').includes('text-orange')) {
                $(this).closest('tr').attr('title', trans_script.attr('data-trans-gis'))
            }
            if ($(this).attr('class').includes('text-purple gtf-in')) {
                $(this).closest('tr').attr('title', `${trans_script.attr('data-trans-gtf')} (${trans_script.attr('data-trans-gtf-in')})`)
            }
            if ($(this).attr('class').includes('text-purple gtf-out')) {
                $(this).closest('tr').attr('title', `${trans_script.attr('data-trans-gtf')} (${trans_script.attr('data-trans-gtf-out')})`)
            }
            if ($(this).attr('class').includes('text-secondary')) {
                $(this).closest('tr').attr('title', `${trans_script.attr('data-trans-bii')}`)
            }
        })
        table_inventory_report.find('.no-info').each(function () {
            $(this).find('.in-quantity-span').addClass('required')
            $(this).find('.in-quantity-span').attr('data-bs-toggle', 'tooltip').attr('data-bs-placement', 'top').attr('title', trans_script.attr('data-trans-no-info'))
        })
    }

    $(document).on('click', '.see-detail-wh', function () {
        WindowControl.showLoading()
        $('#view-warehouse-title').text($(this).closest('td').find('.warehouse_row').text())
        $('#view-warehouse-title').attr('data-wh-id', $(this).closest('td').find('.warehouse_row').attr('data-id'))
        let dataParam = {}
        dataParam['warehouse_id'] = $(this).attr('data-wh-id')
        let wh_available_prd_list_ajax = $.fn.callAjax2({
            url: url_script.attr('data-url-warehouse-available-product-list'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_available_product_list')) {
                    return data?.['warehouse_available_product_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([wh_available_prd_list_ajax]).then(
            (results) => {
                WindowControl.hideLoading()
                let data_view_list = []
                for (const data of results[0]) {
                    data_view_list.push({
                        'id': data?.['id'],
                        'product': data?.['product'],
                        'stock_amount': data?.['stock_amount'],
                        'lot_data': data?.['detail']?.['lot_data'],
                        'sn_data': data?.['detail']?.['sn_data']
                    })
                }

                RenderWarehouseAvailableProductListTable($('#view-wh-available-prd-list-table'), data_view_list)
            })
    })

    $(document).on('click', '.see-detail-prd', function () {
        WindowControl.showLoading()
        $('#view-product-title').text($(this).closest('tr').find('.prd-title').text())
        let dataParam = {}
        dataParam['warehouse_id'] = $('#view-warehouse-title').attr('data-wh-id')
        dataParam['product_id'] = $(this).attr('data-prd-id')
        let wh_available_prd_detail_ajax = $.fn.callAjax2({
            url: url_script.attr('data-url-warehouse-available-product-detail'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('warehouse_available_product_detail')) {
                    return data?.['warehouse_available_product_detail'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([wh_available_prd_detail_ajax]).then(
            (results) => {
                WindowControl.hideLoading()
                let data_view_list_lot = []
                let data_view_list_sn = []

                if (results[0].length > 0) {
                    let data = results[0][0]
                    for (const lot of data?.['detail']?.['lot_data']) {
                        data_view_list_lot.push({
                            'row_type': 'lot_row',
                            'product': data?.['product'],
                            'id': lot?.['id'],
                            'lot_number': lot?.['lot_number'],
                            'serial_number': activity?.['serial_number'],
                            'expire_date': lot?.['expire_date'] ? moment(lot?.['expire_date'].split('T')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : '',
                            'quantity_import': lot?.['quantity_import'],
                            'goods_receipt_date': lot?.['goods_receipt_date'] ? moment(lot?.['goods_receipt_date'].split('T')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : ''
                        })
                    }
                    for (const sn of data?.['detail']?.['sn_data']) {
                        data_view_list_sn.push({
                            'row_type': 'sn_row',
                            'product': data?.['product'],
                            'id': sn?.['id'],
                            'vendor_serial_number': sn?.['vendor_serial_number'],
                            'serial_number': sn?.['serial_number'],
                            'goods_receipt_date': sn?.['goods_receipt_date'] ? moment(sn?.['goods_receipt_date'].split('T')[0], 'YYYY-MM-DD').format('DD/MM/YYYY') : ''
                        })
                    }
                }

                RenderWarehouseAvailableProductDetailLotTable(data_view_list_lot)
                RenderWarehouseAvailableProductDetailSerialTable(data_view_list_sn)
            })
    })

    $(document).on('click', '.qr-code-sn-info', function () {
        let dataParam = {}
        dataParam['product_id'] = $(this).attr('data-product-id')
        dataParam['product_code'] = $(this).attr('data-product-code')
        dataParam['product_title'] = $(this).attr('data-product-title')
        dataParam['product_des'] = $(this).attr('data-product-description')
        dataParam['serial_number'] = $(this).attr('data-serial-number')
        dataParam['vendor_serial_number'] = $(this).attr('data-vendor-serial-number')
        dataParam['goods_receipt_date'] = $(this).attr('data-goods-receipt-date').split('T')[0]
        let sn_info_ajax = $.fn.callAjax2({
            url: url_script.attr('data-url-qr-code-sn-info'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('qr_path_sn')) {
                    return data?.['qr_path_sn'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([sn_info_ajax]).then(
            (results) => {
                $('#modal-QR-sn #sn-view').text(dataParam['serial_number'])
                $('#modal-QR-sn .QR-sn-img').attr('src', results[0][0]?.['path'])
                $('#modal-QR-sn').modal('show')
            })
    })

    function printQRsn(sn_qr_id) {
        let divContents = document.getElementById(sn_qr_id).innerHTML;
        let a = window.open('', '');
        a.document.write('<html><body>');
        a.document.write(divContents);
        a.document.write('</body></html>');
        a.document.close();
        a.print();
    }

    $('#print-qr-sn').on('click', function () {
        printQRsn('QR-sn-img-div')
    })

    $(document).on('click', '.qr-code-lot-info', function () {
        let dataParam = {}
        dataParam['product_id'] = $(this).attr('data-product-id')
        dataParam['product_code'] = $(this).attr('data-product-code')
        dataParam['product_title'] = $(this).attr('data-product-title')
        dataParam['product_des'] = $(this).attr('data-product-description')
        dataParam['lot_number'] = $(this).attr('data-lot-number')
        dataParam['expire_date'] = $(this).attr('data-expire-date').split('T')[0]
        dataParam['goods_receipt_date'] = $(this).attr('data-goods-receipt-date').split('T')[0]
        let lot_info_ajax = $.fn.callAjax2({
            url: url_script.attr('data-url-qr-code-lot-info'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('qr_path_lot')) {
                    return data?.['qr_path_lot'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([lot_info_ajax]).then(
            (results) => {
                $('#modal-QR-lot #lot-view').text(dataParam['lot_number'])
                $('#modal-QR-lot .QR-lot-img').attr('src', results[0][0]?.['path'])
                $('#modal-QR-lot').modal('show')
            })
    })

    function printQRLot(lot_qr_id) {
        let divContents = document.getElementById(lot_qr_id).innerHTML;
        let a = window.open('', '');
        a.document.write('<html><body>');
        a.document.write(divContents);
        a.document.write('</body></html>');
        a.document.close();
        a.print();
    }

    $('#print-qr-lot').on('click', function () {
        printQRLot('QR-lot-img-div')
    })

    $(document).on("click", '#btn-filter', function () {
        LoadItemsSelectBox(items_select_Ele)
        LoadWarehouseSelectBox(warehouses_select_Ele)
        LoadProjectSelectBox(project_select_Ele)
    })
})