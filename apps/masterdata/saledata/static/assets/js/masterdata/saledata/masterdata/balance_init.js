$(document).ready(function () {
    const period_setup_sw_start_using_time = $('#period_setup_sw_start_using_time').text();
    const form_balance_Ele = $('#form-balance')
    const selectWH_Ele = $('#select-wh')
    const dtb_balance_init_item_Ele = $('#table-balance-item');
    const dtb_wh_product_Ele = $('#table-add-item-wh');
    const modal_add_balance = $('#modal-add-balance')
    const trans_script = $('#trans-script')

    if (period_setup_sw_start_using_time !== '""') {
        form_balance_Ele.prop('hidden', false)
        $('#notify-div').prop('hidden', true)

        function LoadBalanceInitList() {
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
                        className: 'w-15',
                        render: (data, type, row) => {
                            return `<span data-item-id="${row?.['product']?.['id']}" class="fw-bold text-primary balance-item">
                                        ${row?.['product']?.['code']}
                                    </span>`;
                        }
                    },
                    {
                        className: 'w-20',
                        render: (data, type, row) => {
                            return `<span class="text-primary">${row?.['product']?.['title']}</span>
                                    <script class="script-lot">${JSON.stringify(row?.['data_lot'])}</script>
                                    <script class="script-sn">${JSON.stringify(row?.['data_sn'])}</script>
                            `;
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return `<span data-wh-id="${row?.['warehouse']?.['id']}" class="text-primary fw-bold balance-wh">${row?.['warehouse']?.['code']}</span>`;
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            return `<span class="text-primary">${row?.['warehouse']?.['title']}</span>`;
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
                        className: 'w-5 text-center',
                        render: (data, type, row) => {
                            return `<a href="#" class="text-danger clear-balance-init"><i class="ri-delete-bin-6-line fs-5"></i></a>`;
                        }
                    },
                ],
            },);
        }
        LoadBalanceInitList()

        function LoadWarehouseList(data) {
            selectWH_Ele.initSelect2({
                allowClear: true,
                ajax: {
                    url: selectWH_Ele.attr('data-url'),
                    method: 'GET',
                },
                data: (data ? data : null),
                keyResp: 'warehouse_list',
                keyId: 'id',
                keyText: 'title',
            })
        }
        LoadWarehouseList()

        function LoadProduct(data) {
            let ele = $('.item-obj')
            ele.initSelect2({
                ajax: {
                    url: dtb_wh_product_Ele.attr('data-url'),
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
                    let ele = $('<div class="row"></div>');
                    ele.append(`<div class="col-4"><span class="badge badge-soft-primary">${data.data?.['code']}</span></div><div class="col-8">${data.data?.['title']}</div>`);
                    return ele;
                },
                data: (data ? data : null),
                keyResp: 'product_list',
                keyId: 'id',
                keyText: "title",
            }).on('change', function () {
                $(`.row-input-sn`).remove()
                $(`.sn-input-label`).remove()
                $(`.row-input-lot`).remove()
                $(`.lot-input-label`).remove()
                if (ele.val()) {
                    let selected = SelectDDControl.get_data_from_idx(ele, ele.val())
                    ele.closest('tr').find('.item-uom').text(selected?.['inventory_uom']?.['title'])
                    if (selected?.['general_traceability_method'] === 2) {
                        $('.item-quantity').val('').prop('disabled', false)
                        loadRowSN(parseFloat(selected?.['inventory_uom']?.['ratio']))
                    }
                    else if (selected?.['general_traceability_method'] === 1) {
                        $('.item-quantity').val('').prop('disabled', true)
                        loadRowLOT()
                    }
                    else if (selected?.['general_traceability_method'] === 0) {
                        $('.item-quantity').val('').prop('disabled', false)
                    }
                }
                else {
                    ele.closest('tr').find('.item-uom').text('')
                }
            })
        }
        LoadProduct()

        $(document).on("change", '.item-quantity', function () {
            let item_obj_ele = $(this).closest('tr').find('.item-obj')
            let selected = SelectDDControl.get_data_from_idx(item_obj_ele, item_obj_ele.val())
            if (selected?.['general_traceability_method'] === 2) {
                let selected = SelectDDControl.get_data_from_idx($('.item-obj'), $('.item-obj').val())
                loadRowSN(parseFloat(selected?.['inventory_uom']?.['ratio']))
            }
            else if (selected?.['general_traceability_method'] === 1) {
                loadRowLOT($(this))
            }
        });

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
                confirmButtonText: trans_script.attr('data-trans-delete'),
                cancelButtonText: trans_script.attr('data-trans-cancel'),
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    let data = combinesDataDelete(
                        form_balance_Ele,
                        this_row.find('.balance-item').attr('data-item-id'),
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
                                            window.location.replace(form_balance_Ele.attr('data-redirect-url'));
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

            frm.dataForm['clear_balance_data'] = true
            frm.dataForm['product_id'] = prd_id
            frm.dataForm['warehouse_id'] = wh_id

            return {
                url: $(frmEle).attr('data-url-delete').format_url_with_uuid(period_setup_sw_start_using_time.replace(/^"(.*)"$/, '$1')),
                method: 'PUT',
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }

        function loadRowSN(ratio) {
            let prd_ele = $('.item-obj:first-child')
            let prd_quantity = parseFloat($('.item-quantity:first-child').val())
            if (prd_quantity && prd_ele.val()) {
                let sn_input_html = ``
                for (let i = 0; i < prd_quantity * ratio; i++) {
                    sn_input_html += `<tr class="row-input-sn">
                    <td class="w-40">
                        <div class="row">
                            <div class="col-1 mt-2"><span>${i + 1}</span></div>
                            <div class="col-5">
                                <input class="form-control vendor-sn-input">
                            </div>
                            <div class="col-6">
                                <input class="form-control sn-input">
                           </div>
                       </div>
                    </td>
                    <td class="w-10"><span>${$('.item-uom:first-child').text()}</span></td>
                    <td class="w-25">
                        <div class="row">
                            <div class="col-6">
                                <input type="text" class="form-control date-time-input sn-expire-date-input">
                            </div>
                            <div class="col-6">
                                <input type="text" class="form-control date-time-input sn-manufacture-date-input">
                            </div>
                        </div>
                    </td>
                    <td class="w-25">
                        <div class="row">
                            <div class="col-6">
                                <input type="text" class="form-control date-time-input sn-warranty-start-input">
                            </div>
                            <div class="col-6">
                                <input type="text" class="form-control date-time-input sn-warranty-end-input">
                            </div>
                        </div>
                    </td>
                </tr>`
                }
                dtb_wh_product_Ele.find('tbody .sn-input-label').remove()
                dtb_wh_product_Ele.find('tbody .row-input-sn').remove()

                dtb_wh_product_Ele.find('tbody').append(`
                    <tr class="sn-input-label">
                        <td class="text-primary" colspan="4"><b>${trans_script.attr('data-trans-input-sn')}</b></td>
                    </tr>
                    <tr class="sn-input-label">
                        <td class="w-40">
                            <div class="row">
                                <div class="col-1"></div>
                                <div class="col-5">
                                    <span class="text-muted">${trans_script.attr('data-trans-vendor-sn-no')}</span>
                                </div>
                                <div class="col-6">
                                    <span class="text-muted">${trans_script.attr('data-trans-sn-no')}</span>
                               </div>
                           </div>
                        </td>
                        <td class="w-10"></td>
                        <td class="w-25">
                            <div class="row">
                                <div class="col-6">
                                    <span class="text-muted">${trans_script.attr('data-trans-sn-exp')}</span>
                                </div>
                                <div class="col-6">
                                    <span class="text-muted">${trans_script.attr('data-trans-sn-manu')}</span>
                                </div>
                            </div>
                        </td>
                        <td class="w-25">
                            <div class="row">
                                <div class="col-6">
                                    <span class="text-muted">${trans_script.attr('data-trans-sn-warranty-start')}</span>
                                </div>
                                <div class="col-6">
                                    <span class="text-muted">${trans_script.attr('data-trans-sn-warranty-end')}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    ${sn_input_html}
                `)
                $('.date-time-input').daterangepicker({
                    singleDatePicker: true,
                    timePicker: true,
                    showDropdowns: false,
                    minYear: 1901,
                    locale: {
                        format: 'YYYY-MM-DD'
                    },
                    "cancelClass": "btn-secondary",
                    maxYear: parseInt(moment().format('YYYY'), 10)
                }).val('')
            }
        }

        function loadRowLOT() {
            dtb_wh_product_Ele.find('tbody').append(`
                <tr class="lot-input-label">
                    <td class="text-primary" colspan="4"><b>${trans_script.attr('data-trans-input-lot')}</b>&nbsp;<span><a href="#" class="text-secondary add-row-lot"><i class="bi bi-plus-circle"></i></a></span></td>
                </tr>
                <tr class="lot-input-label">
                    <td class="w-40">
                        <div class="row">
                            <div class="col-8">
                                <span class="text-muted">${trans_script.attr('data-trans-lot-no')}</span>
                            </div>
                            <div class="col-4">
                                <span class="text-muted">${trans_script.attr('data-trans-lot-quantity')}</span>
                            </div>
                       </div>
                    </td>
                    <td class="w-10"></td>
                    <td class="w-25">
                        <div class="row">
                            <div class="col-6">
                                <span class="text-muted">${trans_script.attr('data-trans-lot-exp')}</span>
                            </div>
                            <div class="col-6">
                                <span class="text-muted">${trans_script.attr('data-trans-lot-manu')}</span>
                            </div>
                        </div>
                    </td>
                    <td class="w-25"></td>
                </tr>
            `)
        }

        $(document).on("click", '.add-row-lot', function () {
            let lot_input_html =  `<tr class="row-input-lot">
                <td class="w-40">
                    <div class="row">
                        <div class="col-8">
                            <input class="form-control lot-number-input">
                        </div>
                        <div class="col-4">
                            <input type="number" class="form-control lot-number-quantity-input">
                        </div>
                   </div>
                </td>
                <td class="w-10"><span>${$('.item-uom:first-child').text()}</span></td>
                <td class="w-25">
                    <div class="row">
                        <div class="col-6">
                            <input type="text" class="form-control date-time-input lot-expire-date-input">
                        </div>
                        <div class="col-6">
                            <input type="text" class="form-control date-time-input lot-manufacture-date-input">
                        </div>
                    </div>
                </td>
                <td class="w-25 text-right"><a href="#" class="text-secondary delete-row-lot"><i class="far fa-trash-alt"></i></a></td>
            </tr>`
            dtb_wh_product_Ele.find('tbody').append(lot_input_html)
            $('.date-time-input').daterangepicker({
                singleDatePicker: true,
                timePicker: true,
                showDropdowns: false,
                minYear: 1901,
                locale: {
                    format: 'YYYY-MM-DD'
                },
                "cancelClass": "btn-secondary",
                maxYear: parseInt(moment().format('YYYY'), 10)
            }).val('')
        });

        $(document).on("click", '.delete-row-lot', function () {
            $(this).closest('tr').remove()
        });

        $(document).on("change", '.lot-number-quantity-input', function () {
            let sum_quantity = 0
            $('.lot-number-quantity-input').each(function () {
                if ($(this).val()) {
                    sum_quantity += parseFloat($(this).val())
                }
            })
            $('.item-quantity:first-child').val(sum_quantity)
        });

        $(document).on("click", 'tbody tr', function () {
            let data_lot = JSON.parse($(this).find('.script-lot').text())
            let data_sn = JSON.parse($(this).find('.script-sn').text())
            if (data_lot.length > 0) {
                let data_lot_html = ''
                for (let i = 0; i < data_lot.length; i++) {
                    data_lot_html += `<tr>
                        <td>${data_lot[i]?.['lot_number']}</td>
                        <td>${data_lot[i]?.['quantity_import']}</td>
                        <td>${$(this).find('.uom-title').text()}</td>
                        <td>${moment(data_lot[i]?.['expire_date']).format('DD/MM/YYYY')}</td>
                        <td>${moment(data_lot[i]?.['manufacture_date']).format('DD/MM/YYYY')}</td>
                    </tr>`
                    }
                    $('#table-detail-space-sn').prop('hidden', true)
                    $('#detail-space-sn').html(``)
                    $('#table-detail-space-lot').prop('hidden', false)
                    $('#detail-space-lot').html(`
                    ${data_lot_html}
                `)
            }
            else if (data_sn.length > 0) {
                let data_sn_html = ''
                for (let i = 0; i < data_sn.length; i++) {
                    data_sn_html += `<tr>
                        <td>${data_sn[i]?.['vendor_serial_number']}</td>
                        <td>${data_sn[i]?.['serial_number']}</td>
                        <td>${moment(data_sn[i]?.['expire_date']).format('DD/MM/YYYY')}</td>
                        <td>${moment(data_sn[i]?.['manufacture_date']).format('DD/MM/YYYY')}</td>
                        <td>${moment(data_sn[i]?.['warranty_start']).format('DD/MM/YYYY')}</td>
                        <td>${moment(data_sn[i]?.['warranty_end']).format('DD/MM/YYYY')}</td>
                    </tr>`
                    }
                    $('#table-detail-space-lot').prop('hidden', true)
                    $('#detail-space-lot').html(``)
                    $('#table-detail-space-sn').prop('hidden', false)
                    $('#detail-space-sn').html(`
                    ${data_sn_html}
                `)
            }
            else {
                $('#table-detail-space-lot').prop('hidden', true)
                $('#detail-space-lot').html(``)
                $('#table-detail-space-sn').prop('hidden', true)
                $('#detail-space-sn').html(``)
            }
        });

        function combinesData(frmEle, data) {
            let frm = new SetupFormSubmit($(frmEle));

            return {
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: data,
                urlRedirect: frm.dataUrlRedirect,
            };
        }

        form_balance_Ele.submit(function (event) {
            let result = {}
            let tbody = dtb_wh_product_Ele.find('tbody')
            let wh_selected = SelectDDControl.get_data_from_idx(selectWH_Ele, selectWH_Ele.val())
            let item_selected = SelectDDControl.get_data_from_idx(tbody.find('.item-obj:first-child'), tbody.find('.item-obj:first-child').val())
            if (selectWH_Ele.val() && tbody.find('.item-obj:first-child').val() && tbody.find('.item-quantity:first-child').val() && tbody.find('.item-value:first-child').attr('value')) {
                result = {
                    'wh_data': {
                        'id': selectWH_Ele.val(),
                        'code': wh_selected?.['code'],
                        'title': wh_selected?.['title'],
                    },
                    'product_data': {
                        'id': item_selected?.['id'],
                        'code': item_selected?.['code'],
                        'title': item_selected?.['title'],
                    },
                    'uom_data': {
                        'id': item_selected?.['inventory_uom']?.['id'],
                        'code': item_selected?.['inventory_uom']?.['code'],
                        'title': item_selected?.['inventory_uom']?.['title'],
                    },
                    'quantity_balance': tbody.find('.item-quantity:first-child').val(),
                    'value_balance': tbody.find('.item-value:first-child').attr('value'),
                }

                dtb_balance_init_item_Ele.find('tbody .dataTables_empty').remove()
                dtb_balance_init_item_Ele.find('tbody').append(`
                    <tr class="new-row-data">
                        <script class="data-lot"></script>
                        <script class="data-sn"></script>
                        <td></td>
                        <td><span data-item-id="${result?.['product_data']?.['id']}" class="badge badge-soft-primary balance-item">${result?.['product_data']?.['code']}</span>&nbsp;<span>${result?.['product_data']?.['title']}</span></td>
                        <td><span class="text-muted uom-title">${result?.['uom_data']?.['title']}</span></td>
                        <td><span data-wh-id="${result?.['wh_data']?.['id']}" class="badge badge-soft-blue balance-wh">${result?.['wh_data']?.['code']}</span>&nbsp;<span>${result?.['wh_data']?.['title']}</span></td>
                        <td><span class="balance-quantity">${result?.['quantity_balance']}</span></td>
                        <td><span class="balance-value mask-money" data-init-money="${result?.['value_balance']}"></span></td>
                        <td class="text-right"><span class="badge badge-success badge-indicator badge-indicator-xl"></span></td>
                    </tr>
                `)

                $.fn.initMaskMoney2()

                let data_sn = []
                dtb_wh_product_Ele.find('.row-input-sn').each(function () {
                    data_sn.push({
                        'vendor_serial_number': $(this).find('.vendor-sn-input').val(),
                        'serial_number': $(this).find('.sn-input').val(),
                        'expire_date': $(this).find('.sn-expire-date-input').val(),
                        'manufacture_date': $(this).find('.sn-manufacture-date-input').val(),
                        'warranty_start': $(this).find('.sn-warranty-start-input').val(),
                        'warranty_end': $(this).find('.sn-warranty-end-input').val(),
                    })
                })

                let data_lot = []
                dtb_wh_product_Ele.find('.row-input-lot').each(function () {
                    data_lot.push({
                        'lot_number': $(this).find('.lot-number-input').val(),
                        'quantity_import': $(this).find('.lot-number-quantity-input').val(),
                        'expire_date': $(this).find('.lot-expire-date-input').val(),
                        'manufacture_date': $(this).find('.lot-manufacture-date-input').val(),
                    })
                })

                $('.data-sn').last().text(JSON.stringify(data_sn))
                $('.data-lot').last().text(JSON.stringify(data_lot))

                modal_add_balance.modal('hide')
                selectWH_Ele.empty()
                $('.item-obj').empty()
                $('.item-quantity').val('')
                $('.item-value').attr('value', 0)
                $('.sn-input-label').remove()
                $('.row-input-sn').remove()
                $('.lot-input-label').remove()
                $('.row-input-lot').remove()
            }
            else {
                $.fn.notifyB({description: "Missing information"}, 'warning')
            }

            event.preventDefault();
            let no_new_row = dtb_balance_init_item_Ele.find('tbody .new-row-data').length
            let count = 0
            dtb_balance_init_item_Ele.find('tbody .new-row-data').each(function() {
                let data = combinesData(
                    form_balance_Ele,
                    {
                        'balance_data': {
                            'product_id': $(this).find('.balance-item').attr('data-item-id'),
                            'warehouse_id': $(this).find('.balance-wh').attr('data-wh-id'),
                            'quantity': $(this).find('.balance-quantity').text(),
                            'value': $(this).find('.balance-value').attr('data-init-money'),
                            'data_sn': $(this).find('.data-sn').text() ? JSON.parse($(this).find('.data-sn').text()) : [],
                            'data_lot': $(this).find('.data-lot').text() ? JSON.parse($(this).find('.data-lot').text()) : [],
                        }
                    }
                );
                // console.log(data)
                if (data) {
                    WindowControl.showLoading();
                    $.fn.callAjax2(data)
                        .then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyB({description: "Successfully"}, 'success')
                                    count += 1
                                    if (count === no_new_row) {
                                        setTimeout(() => {
                                            window.location.replace(form_balance_Ele.attr('data-redirect-url'));
                                            location.reload.bind(location);
                                        }, 1000);
                                    }
                                    else {
                                        setTimeout(
                                            () => {
                                                WindowControl.hideLoading();
                                            },
                                            1000
                                        )
                                    }
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
        })
    }
    else {
        form_balance_Ele.prop('hidden', true)
        $('#notify-div').prop('hidden', false)
    }
});