$(document).ready(function () {
    const period_setup_sw_start_using_time = $('#period_setup_sw_start_using_time').text();
    const form_balance_Ele = $('#form-balance')
    const $modal_add_balance_ele = $('#modal-add-balance')
    const selectWH_Ele = $('#select-wh')
    const prd_Ele = $('#select-prd')
    const prd_uom_Ele = $('#prd-uom')
    const prd_quantity_Ele = $('#prd-quantity')
    const prd_value_Ele = $('#prd-value')
    const dtb_balance_init_item_Ele = $('#table-balance-product')
    const dtb_load_lot = $('#table-load-lot')
    const dtb_load_lot_space = $('#table-load-lot-space')
    const dtb_load_sn = $('#table-load-sn')
    const dtb_load_sn_space = $('#table-load-sn-space')
    const trans_script = $('#trans-script')

    function LoadBalanceInitTable() {
        dtb_balance_init_item_Ele.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(dtb_balance_init_item_Ele);
        dtb_balance_init_item_Ele.DataTableDefault({
            rowIdx: true,
            useDataServer: true,
            reloadCurrency: true,
            scrollCollapse: true,
            scrollY: '70vh',
            scrollX: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('balance_init_list')) {
                        // console.log(resp.data['balance_init_list'])
                        return resp.data['balance_init_list'] || []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5 text-center',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<div class="input-group">
                            <select class="form-select select2 row-account-code" disabled>
                                <option selected>156</option>
                            </select>
                            <span class="input-group-text p-0">
                                <a href="#" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-regular fa-circle-question"></i>
                                </a>
                                <div class="dropdown-menu bflow-mirrow-card-80 p-3" style="min-width: 200px;">
                                    <h5 class="row-account-code fw-bold">Tài khoản 156</h5>
                                    <h6 class="row-fk-account-name">Goods</h6>
                                    <h6 class="row-account-name">Hàng hóa</h6>
                                </div>
                            </span>
                        </div>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        let value = 0
                        if (row?.['product']?.['valuation_method'] !== 2) {
                            value = row?.['value'] || 0
                        }
                        else {
                            for (let i=0; i < (row?.['data_sn'] || []).length; i++) {
                                value += Number(row?.['data_sn'][i]?.['specific_value'] || 0)
                            }
                        }
                        return `<span class="balance-value mask-money" data-init-money="${value}"></span>`;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        let dot = [
                            '<span class="badge bg-blue badge-indicator"></span>',
                            '<span class="badge bg-success badge-indicator"></span>',
                            '<span class="badge bg-danger badge-indicator"></span>'
                        ][parseInt(row?.['product']?.['valuation_method'])]
                        return `
                            ${dot}
                            <span data-item-id="${row?.['product']?.['id']}" class="badge badge-sm badge-light balance-product">
                                ${row?.['product']?.['code']}
                            </span><br>
                            <span>${row?.['product']?.['title']}</span>
                            <script class="script-lot">${JSON.stringify(row?.['data_lot'] || '[]')}</script>
                            <script class="script-sn">${JSON.stringify(row?.['data_sn'] || '[]')}</script>
                        `;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span class="balance-quantity mr-1">${row?.['quantity']}</span><span class="uom-title">${row?.['uom']?.['title']}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span data-wh-id="${row?.['warehouse']?.['id']}" class="badge badge-sm badge-light balance-wh">
                                    ${row?.['warehouse']?.['code']}
                                </span><br>
                                <span>${row?.['warehouse']?.['title']}</span>`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<span>${[
                            $.fn.gettext('None'), $.fn.gettext('Batch/Lot'), $.fn.gettext('Serial number')
                        ][row?.['product']?.['general_traceability_method']]}</span>`;
                    }
                },
                {
                    className: 'w-10 text-right',
                    render: (data, type, row) => {
                        let btn_detail = row?.['product']?.['general_traceability_method'] !== 0 ? `<a href="#" class="text-primary view-detail mr-3" data-bs-toggle="modal" data-bs-target="#modal-view-detail"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''
                        return `${btn_detail}<a href="#" class="text-danger clear-balance-init"><i class="far fa-trash-alt"></i></a>`;
                    }
                },
            ],
            initComplete: function () {
                InitialBalancePageFunction.CalculateAccountBalance()

                let wrapper$ = dtb_balance_init_item_Ele.closest('.dataTables_wrapper');
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
            }
        },);
    }
    LoadBalanceInitTable()

    function LoadLotTable(data_list=[]) {
        dtb_load_lot.DataTable().clear().destroy()
        dtb_load_lot.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            useDataServer: false,
            reloadCurrency: true,
            paging: false,
            scrollCollapse: true,
            scrollY: '38vh',
            scrollX: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        return `<input class="form-control lot-number-input">`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<input type="number" class="form-control lot-number-quantity-input">`;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control date-time-input lot-expire-date-input">`;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control date-time-input lot-manufacture-date-input">`;
                    }
                },
                {
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        return `<a href="#" class="text-secondary delete-row-lot"><i class="far fa-trash-alt"></i></a>`;
                    }
                },
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    let sum_quantity = 0
                    dtb_load_lot.find('tbody tr').each(function (index, ele) {
                        let item = data_list[index]
                        sum_quantity += Number(item?.['lot_quantity'] || 0)
                        $(ele).find('.lot-number-input').val(item?.['lot_number']);
                        $(ele).find('.lot-number-quantity-input').val(item?.['lot_quantity']);
                        $(ele).find('.lot-expire-date-input').val(item?.['expire_date']);
                        $(ele).find('.lot-manufacture-date-input').val(item?.['manufacture_date']);
                        UsualLoadPageFunction.LoadDate({element: $(ele).find('.date-time-input')})
                    })
                    prd_quantity_Ele.val(sum_quantity)
                }
            }
        });
    }
    LoadLotTable()

    function LoadSNTable(data_list=[]) {
        dtb_load_sn.DataTable().clear().destroy()
        dtb_load_sn.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            useDataServer: false,
            reloadCurrency: true,
            paging: false,
            scrollCollapse: true,
            scrollY: '38vh',
            scrollX: true,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<input class="form-control vendor-sn-input">`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<input class="form-control sn-input">`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control date-time-input sn-expire-date-input">`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control date-time-input sn-manufacture-date-input">`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control date-time-input sn-warranty-start-input">`;
                    }
                },
                {
                    className: 'w-10',
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control date-time-input sn-warranty-end-input">`;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        let selected = SelectDDControl.get_data_from_idx(prd_Ele, prd_Ele.val())
                        let is_disabled = selected?.['valuation_method'] === 2 ? '' : 'disabled'
                        return `<input ${is_disabled} class="form-control mask-money specific-value" value="0">`;
                    }
                },
                {
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        return `<a href="#" class="text-secondary delete-row-sn"><i class="far fa-trash-alt"></i></a>`;
                    }
                },
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    let selected = SelectDDControl.get_data_from_idx(prd_Ele, prd_Ele.val())
                    let is_disabled_specific_value = selected?.['valuation_method'] !== 2
                    dtb_load_sn.find('tbody tr').each(function (index, ele) {
                        let item = data_list[index]
                        $(ele).find('.vendor-sn-input').val(item?.['vendor_sn']);
                        $(ele).find('.sn-input').val(item?.['serial_number']);
                        $(ele).find('.sn-expire-date-input').val(item?.['expire_date']);
                        $(ele).find('.sn-manufacture-date-input').val(item?.['manufacture_date']);
                        $(ele).find('.sn-warranty-start-input').val(item?.['warranty_start']);
                        $(ele).find('.sn-warranty-end-input').val(item?.['warranty_end']);
                        $(ele).find('.specific-value').prop('disabled', is_disabled_specific_value ).attr('value', is_disabled_specific_value ? 0 : item?.['specific_value']);
                        UsualLoadPageFunction.LoadDate({element: $(ele).find('.date-time-input')})
                    })
                    prd_quantity_Ele.val(data_list.length)
                    $.fn.initMaskMoney2()
                }
            }
        });
    }
    LoadSNTable()

    function LoadWarehouseList(data) {
        selectWH_Ele.initSelect2({
            allowClear: true,
            ajax: {
                url: selectWH_Ele.attr('data-url'),
                method: 'GET',
            },
            templateResult: function(data) {
                return $(`<span class="badge badge-light badge-sm">${data.data?.['code']}</span><br><span>${data.data?.['title']}</span>`);
            },
            data: (data ? data : null),
            keyResp: 'warehouse_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    LoadWarehouseList()

    function LoadProduct(data) {
        prd_Ele.initSelect2({
            ajax: {
                url: prd_Ele.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let res = []
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    if (resp.data[keyResp][i]?.['product_choice'].includes(1)) {
                        res.push(resp.data[keyResp][i])
                    }
                }
                return res
            },
            templateResult: function(data) {
                return $(`<span class="badge badge-light badge-sm">${data.data?.['code']}</span><br><span>${data.data?.['title']}</span>`);
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: "title",
        }).on('change', function () {
            if (prd_Ele.val()) {
                let selected = SelectDDControl.get_data_from_idx(prd_Ele, prd_Ele.val())
                if (selected?.['valuation_method'] === 2) {
                    prd_value_Ele.val(0).prop('disabled', true)
                }
                else {
                    prd_value_Ele.prop('disabled', false)
                }
                dtb_load_sn_space.prop('hidden', selected?.['general_traceability_method'] !== 2)
                dtb_load_lot_space.prop('hidden', selected?.['general_traceability_method'] !== 1)
                prd_quantity_Ele.val('0').prop('disabled', selected?.['general_traceability_method'] !== 0)
                prd_uom_Ele.text(selected?.['inventory_uom']?.['title'])
                LoadLotTable()
                LoadSNTable()
                $('#excelFileInput').val('')
            }
        })
    }
    LoadProduct()

    $(document).on("click", '.clear-balance-init', function () {
        let this_row = $(this).closest('tr')
        Swal.fire({
            html:
            `<div class="mb-3"><i class="ri-delete-bin-6-line fs-5 text-danger"></i></div><h5 class="text-danger">${trans_script.attr('data-trans-notify-clear')}</h5><p class="small">${trans_script.attr('data-trans-warning')}</p>`,
            customClass: {
                confirmButton: 'btn btn-outline-secondary text-danger',
                cancelButton: 'btn btn-outline-secondary text-gray',
                container:'swal2-has-bg',
                actions:'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: $.fn.gettext('Delete'),
            cancelButtonText: $.fn.gettext('Cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                let data = CombinesDataDelete(
                    form_balance_Ele,
                    this_row.find('.balance-product').attr('data-item-id'),
                    this_row.find('.balance-wh').attr('data-wh-id')
                );
                // console.log(data)
                if (data) {
                    WindowControl.showLoading({'loadingTitleAction': 'DELETE'});
                    $.fn.callAjax2(data)
                        .then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyB({description: "Successfully"}, 'success')
                                    setTimeout(
                                        () => {
                                            LoadBalanceInitTable()
                                            WindowControl.hideLoading();
                                        },
                                        1000
                                    )
                                }
                            },
                            (errs) => {
                                setTimeout(
                                    () => {
                                        LoadBalanceInitTable()
                                        WindowControl.hideLoading();
                                    },
                                    1000
                                )
                                $.fn.notifyB({description: errs.data.errors}, 'failure');
                            }
                        )
                }
            }
        })
    })

    function CombinesDataDelete(frmEle, prd_id, wh_id) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['clear_balance_init_data'] = true
        frm.dataForm['product_id'] = prd_id
        frm.dataForm['warehouse_id'] = wh_id

        return {
            url: $(frmEle).attr('data-url-delete').format_url_with_uuid(period_setup_sw_start_using_time.replace(/^"(.*)"$/, '$1')),
            method: 'PUT',
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#add-row-lot').on("click", function () {
        UsualLoadPageFunction.AddTableRow(dtb_load_lot)
        let row_added = dtb_load_lot.find('tbody tr:last-child')
        UsualLoadPageFunction.LoadDate({element: row_added.find('.date-time-input')})
    })

    $(document).on("click", '.delete-row-lot', function () {
        UsualLoadPageFunction.DeleteTableRow(
            $(this).closest('table'),
            parseInt($(this).closest('tr').find('td:first-child').text())
        )
        let sum_quantity = 0
        dtb_load_lot.find('tbody tr').each(function (index, ele) {
            sum_quantity += Number($(ele).find('.lot-number-quantity-input').val() || 0)
        })
        prd_quantity_Ele.val(sum_quantity)
    })

    $('#add-row-sn').on("click", function () {
        let current_quantity = Number(prd_quantity_Ele.val() || 0)
        prd_quantity_Ele.val(current_quantity + 1)
        UsualLoadPageFunction.AddTableRow(dtb_load_sn)
        let row_added = dtb_load_sn.find('tbody tr:last-child')
        UsualLoadPageFunction.LoadDate({element: row_added.find('.date-time-input')})
    })

    $(document).on("click", '.delete-row-sn', function () {
        let current_quantity = Number(prd_quantity_Ele.val() || 0)
        prd_quantity_Ele.val(current_quantity - 1)
        UsualLoadPageFunction.DeleteTableRow(
            $(this).closest('table'),
            parseInt($(this).closest('tr').find('td:first-child').text())
        )
    })

    $(document).on("change", '.lot-number-quantity-input', function () {
        let sum_quantity = 0
        dtb_load_lot.find('tbody tr').each(function (index, ele) {
            sum_quantity += Number($(ele).find('.lot-number-quantity-input').val() || 0)
        })
        prd_quantity_Ele.val(sum_quantity)
    })

    $(document).on("click", '.view-detail', function () {
        let data_lot = $(this).closest('tr').find('.script-lot').text() ? JSON.parse($(this).closest('tr').find('.script-lot').text()) : []
        let data_sn = $(this).closest('tr').find('.script-sn').text() ? JSON.parse($(this).closest('tr').find('.script-sn').text()) : []
        let data_lot_html = ''
        let data_sn_html = ''
        if (data_lot.length > 0) {
            $('#modal-view-detail').modal('show')
            for (let i = 0; i < data_lot.length; i++) {
                data_lot_html += `<tr>
                    <td>${data_lot[i]?.['lot_number'] || ''}</td>
                    <td>${data_lot[i]?.['quantity_import']}</td>
                    <td>${$(this).closest('tr').closest('tr').find('.uom-title').text()}</td>
                    <td>${data_lot[i]?.['expire_date'] ? moment(data_lot[i]?.['expire_date']).format('DD/MM/YYYY') : ''}</td>
                    <td>${data_lot[i]?.['manufacture_date'] ? moment(data_lot[i]?.['manufacture_date']).format('DD/MM/YYYY') : ''}</td>
                </tr>`
            }
            $('#table-detail-space-sn').prop('hidden', true)
            $('#detail-space-sn').html(data_sn_html)
            $('#table-detail-space-lot').prop('hidden', false)
            $('#detail-space-lot').html(data_lot_html)
        }
        else if (data_sn.length > 0) {
            $('#modal-view-detail').modal('show')
            for (let i = 0; i < data_sn.length; i++) {
                data_sn_html += `<tr>
                    <td>${data_sn[i]?.['vendor_serial_number'] || ''}</td>
                    <td>${data_sn[i]?.['serial_number']}</td>
                    <td>${data_sn[i]?.['expire_date'] ? moment(data_sn[i]?.['expire_date']).format('DD/MM/YYYY') : ''}</td>
                    <td>${data_sn[i]?.['manufacture_date'] ? moment(data_sn[i]?.['manufacture_date']).format('DD/MM/YYYY') : ''}</td>
                    <td>${data_sn[i]?.['warranty_start'] ? moment(data_sn[i]?.['warranty_start']).format('DD/MM/YYYY') : ''}</td>
                    <td>${data_sn[i]?.['warranty_end'] ? moment(data_sn[i]?.['warranty_end']).format('DD/MM/YYYY') : ''}</td>
                    <td>${data_sn[i]?.['specific_value'] ? `<span class="mask-money" data-init-money="${data_sn[i]?.['specific_value']}"></span>` : '--'}</td>
                </tr>`
            }
            $('#table-detail-space-lot').prop('hidden', true)
            $('#detail-space-lot').html(data_sn_html)
            $('#table-detail-space-sn').prop('hidden', false)
            $('#detail-space-sn').html(data_sn_html)
            $.fn.initMaskMoney2()
        }
        else {
            $('#table-detail-space-lot').prop('hidden', true)
            $('#detail-space-lot').html(data_sn_html)
            $('#table-detail-space-sn').prop('hidden', true)
            $('#detail-space-sn').html(data_sn_html)
        }
    })

    function CombinesData(frmEle) {
        let wh_selected = SelectDDControl.get_data_from_idx(selectWH_Ele, selectWH_Ele.val())
        let prd_selected = SelectDDControl.get_data_from_idx(prd_Ele, prd_Ele.val())

        let data_lot = []
        if (prd_selected?.['general_traceability_method'] === 1) {
            dtb_load_lot.find('tbody tr').each(function (index, ele) {
                data_lot.push({
                    'lot_number': $(ele).find('.lot-number-input').val(),
                    'quantity_import': $(ele).find('.lot-number-quantity-input').val(),
                    'expire_date': $(ele).find('.lot-expire-date-input').val() ? moment($(ele).find('.lot-expire-date-input').val(), 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
                    'manufacture_date': $(ele).find('.lot-manufacture-date-input').val() ? moment($(ele).find('.lot-manufacture-date-input').val(), 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
                })
            })
        }

        let data_sn = []
        if (prd_selected?.['general_traceability_method'] === 2) {
            dtb_load_sn.find('tbody tr').each(function (index, ele) {
                data_sn.push({
                    'vendor_serial_number': $(ele).find('.vendor-sn-input').val(),
                    'serial_number': $(ele).find('.sn-input').val(),
                    'expire_date': $(ele).find('.sn-expire-date-input').val() ? moment($(ele).find('.sn-expire-date-input').val(), 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
                    'manufacture_date': $(ele).find('.sn-manufacture-date-input').val() ? moment($(ele).find('.sn-manufacture-date-input').val(), 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
                    'warranty_start': $(ele).find('.sn-warranty-start-input').val() ? moment($(ele).find('.sn-warranty-start-input').val(), 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
                    'warranty_end': $(ele).find('.sn-warranty-end-input').val() ? moment($(ele).find('.sn-warranty-end-input').val(), 'DD/MM/YYYY').format('YYYY-MM-DD') : null,
                    'specific_value': Number($(ele).find('.specific-value').attr('value')) || 0,
                })
            })
        }

        let dataForm = {
            'balance_init_data': {
                'warehouse_id': wh_selected?.['id'],
                'product_id': prd_selected?.['id'],
                'quantity': Number(prd_quantity_Ele.val() || 0),
                'value': prd_value_Ele.attr('value') || 0,
                'data_sn': data_sn,
                'data_lot': data_lot,
            }
        }

        // console.log(dataForm)

        let frm = new SetupFormSubmit($(frmEle));
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: dataForm,
        };
    }

    form_balance_Ele.submit(function (event) {
        event.preventDefault();
        let combinesData = CombinesData($(this));
        if (combinesData) {
            WindowControl.showLoading({'loadingTitleAction': 'CREATE'});
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(
                                () => {
                                    $modal_add_balance_ele.modal('hide')
                                    LoadBalanceInitTable()
                                    WindowControl.hideLoading();
                                },
                                1000
                            )
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    $('.excelFileInput').on('change', async function (even_object) {
        let prd_selected = SelectDDControl.get_data_from_idx(prd_Ele, prd_Ele.val())
        if (prd_selected?.['general_traceability_method'] === 1) {
            const data_list = await UsualLoadPageFunction.Read_file_excel(
                even_object,
                [
                    {key: 'lot_number'},
                    {key: 'lot_quantity'},
                    {key: 'expire_date'},
                    {key: 'manufacture_date'}
                ]
            );

            LoadLotTable(data_list)
        }
        if (prd_selected?.['general_traceability_method'] === 2) {
            const data_list = await UsualLoadPageFunction.Read_file_excel(
                even_object,
                [
                    {key: 'vendor_sn'},
                    {key: 'serial_number'},
                    {key: 'expire_date'},
                    {key: 'manufacture_date'},
                    {key: 'warranty_start'},
                    {key: 'warranty_end'},
                    {key: 'specific_value', default: 0}
                ]
            );

            LoadSNTable(data_list)
        }
    })
});

class TabGoodsElements {
    constructor() {

    }
}
const tabGoodsElements = new TabGoodsElements();

/**
 * Các hàm load page và hàm hỗ trợ
 */
class TabGoodsFunction {

}

/**
 * Khai báo các Event
 */
class TabGoodsEventHandler {
    static InitPageEvent() {

    }
}
