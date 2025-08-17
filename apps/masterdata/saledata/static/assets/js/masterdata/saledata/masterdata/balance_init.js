$(document).ready(function () {
    const period_setup_sw_start_using_time = $('#period_setup_sw_start_using_time').text();
    const form_balance_Ele = $('#form-balance')
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
    const modal_add_balance = $('#modal-add-balance')
    const trans_script = $('#trans-script')

    form_balance_Ele.prop('hidden', false)
    $('#notify-div').prop('hidden', true)

    function LoadBalanceInitTable() {
        dtb_balance_init_item_Ele.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(dtb_balance_init_item_Ele);
        dtb_balance_init_item_Ele.DataTableDefault({
            rowIdx: true,
            useDataServer: true,
            reloadCurrency: true,
            paging: false,
            scrollCollapse: true,
            scrollY: '60vh',
            scrollX: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('balance_init_list')) {
                        // console.log(resp.data['balance_init_list'])
                        return resp.data['balance_init_list'] ? resp.data['balance_init_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
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
                        return `<span data-item-id="${row?.['product']?.['id']}" class="badge badge-sm badge-primary balance-product">
                                    ${row?.['product']?.['code']}
                                </span><br>
                                <span class="text-primary">${row?.['product']?.['title']}</span>
                                <script class="script-lot">${JSON.stringify(row?.['data_lot'])}</script>
                                <script class="script-sn">${JSON.stringify(row?.['data_sn'])}</script>
                        `;
                    }
                },
                {
                    className: 'w-20',
                    render: (data, type, row) => {
                        return `<span data-wh-id="${row?.['warehouse']?.['id']}"
                                      class="badge badge-sm badge-blue balance-wh">${row?.['warehouse']?.['code']}</span><br>
                                <span class="text-blue">${row?.['warehouse']?.['title']}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="balance-quantity mr-1">${row?.['quantity']}</span><span class="text-muted uom-title">${row?.['uom']?.['title']}</span>`;
                    }
                },
                {
                    className: 'w-15',
                    render: (data, type, row) => {
                        return `<span class="balance-value mask-money" data-init-money="${row?.['value']}"></span>`;
                    }
                },
                {
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        return `<a href="#" class="text-danger clear-balance-init"><i class="ri-delete-bin-6-line fs-5"></i></a>`;
                    }
                },
            ],
        },);
    }
    LoadBalanceInitTable()

    function LoadLotTable(data_list=[]) {
        dtb_load_lot.DataTable().clear().destroy()
        dtb_load_lot.DataTableDefault({
            rowIdx: true,
            useDataServer: false,
            reloadCurrency: true,
            paging: false,
            scrollCollapse: true,
            scrollY: '35vh',
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
        });
    }
    LoadLotTable()

    function LoadSNTable(data_list=[]) {
        dtb_load_sn.DataTable().clear().destroy()
        dtb_load_sn.DataTableDefault({
            rowIdx: true,
            useDataServer: false,
            reloadCurrency: true,
            paging: false,
            scrollCollapse: true,
            scrollY: '35vh',
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
                    className: 'w-25',
                    render: (data, type, row) => {
                        return `<input class="form-control vendor-sn-input">`;
                    }
                },
                {
                    className: 'w-25',
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
                    className: 'w-5 text-right',
                    render: (data, type, row) => {
                        return `<a href="#" class="text-secondary delete-row-sn"><i class="far fa-trash-alt"></i></a>`;
                    }
                },
            ]
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
                return $(`<span class="badge badge-soft-blue badge-sm mr-1">${data.data?.['code']}</span><span>${data.data?.['title']}</span>`);
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
                return $(`<span class="badge badge-soft-primary badge-sm mr-1">${data.data?.['code']}</span><span>${data.data?.['title']}</span>`);
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: "title",
        }).on('change', function () {
            if (prd_Ele.val()) {
                let selected = SelectDDControl.get_data_from_idx(prd_Ele, prd_Ele.val())
                dtb_load_sn_space.prop('hidden', selected?.['general_traceability_method'] !== 2)
                dtb_load_lot_space.prop('hidden', selected?.['general_traceability_method'] !== 1)
                prd_quantity_Ele.val('0').prop('disabled', selected?.['general_traceability_method'] !== 0)
                prd_uom_Ele.text(selected?.['inventory_uom']?.['title'])
                LoadLotTable()
                LoadSNTable()
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
                let data = combinesDataDelete(
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
                                    setTimeout(() => {
                                        window.location.replace(form_balance_Ele.attr('data-url-redirect'));
                                        location.reload.bind(location);
                                    }, 1000);
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
            }
        })
    });

    function combinesDataDelete(frmEle, prd_id, wh_id) {
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
    });

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
    });

    $(document).on("change", '.lot-number-quantity-input', function () {
        let sum_quantity = 0
        dtb_load_lot.find('tbody tr').each(function (index, ele) {
            sum_quantity += Number($(ele).find('.lot-number-quantity-input').val() || 0)
        })
        prd_quantity_Ele.val(sum_quantity)
    });

    $(document).on("click", 'tbody tr', function () {
        let data_lot = $(this).find('.script-lot').text() ? JSON.parse($(this).find('.script-lot').text()) : []
        let data_sn = $(this).find('.script-sn').text() ? JSON.parse($(this).find('.script-sn').text()) : []
        let data_lot_html = ''
        let data_sn_html = ''
        if (data_lot.length > 0) {
            for (let i = 0; i < data_lot.length; i++) {
                data_lot_html += `<tr>
                        <td>${data_lot[i]?.['lot_number']}</td>
                        <td>${data_lot[i]?.['quantity_import']}</td>
                        <td>${$(this).find('.uom-title').text()}</td>
                        <td>${data_lot[i]?.['expire_date'] ? moment(data_lot[i]?.['expire_date']).format('DD/MM/YYYY') : '--'}</td>
                        <td>${data_lot[i]?.['manufacture_date'] ? moment(data_lot[i]?.['manufacture_date']).format('DD/MM/YYYY') : '--'}</td>
                    </tr>`
                }
                $('#table-detail-space-sn').prop('hidden', true)
                $('#detail-space-sn').html(data_sn_html)
                $('#table-detail-space-lot').prop('hidden', false)
                $('#detail-space-lot').html(data_lot_html)
        }
        else if (data_sn.length > 0) {
            for (let i = 0; i < data_sn.length; i++) {
                data_sn_html += `<tr>
                        <td>${data_sn[i]?.['vendor_serial_number']}</td>
                        <td>${data_sn[i]?.['serial_number']}</td>
                        <td>${data_sn[i]?.['expire_date'] ? moment(data_sn[i]?.['expire_date']).format('DD/MM/YYYY') : '--'}</td>
                        <td>${data_sn[i]?.['manufacture_date'] ? moment(data_sn[i]?.['manufacture_date']).format('DD/MM/YYYY') : '--'}</td>
                        <td>${data_sn[i]?.['warranty_start'] ? moment(data_sn[i]?.['warranty_start']).format('DD/MM/YYYY') : '--'}</td>
                        <td>${data_sn[i]?.['warranty_end'] ? moment(data_sn[i]?.['warranty_end']).format('DD/MM/YYYY') : '--'}</td>
                    </tr>`
                }
                $('#table-detail-space-lot').prop('hidden', true)
                $('#detail-space-lot').html(data_sn_html)
                $('#table-detail-space-sn').prop('hidden', false)
                $('#detail-space-sn').html(data_sn_html)
        }
        else {
            $('#table-detail-space-lot').prop('hidden', true)
            $('#detail-space-lot').html(data_sn_html)
            $('#table-detail-space-sn').prop('hidden', true)
            $('#detail-space-sn').html(data_sn_html)
        }
    });

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
        console.log(dataForm)

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
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
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
});