$(document).ready(function () {
    const period_setup_sw_start_using_time = $('#period_setup_sw_start_using_time').text();
    const form_balance_Ele = $('#form-balance')
    const selectWH_Ele = $('#select-wh')
    const dtb_balance_init_item_Ele = $('#table-balance-item');
    const dtb_wh_product_Ele = $('#table-add-item-wh');
    const btn_save_modal = $('#save-modal')
    const modal_add_balance = $('#modal-add-balance')

    if (period_setup_sw_start_using_time !== '""') {
        form_balance_Ele.prop('hidden', false)
        $('#notify-div').prop('hidden', true)

        function LoadBalanceInitList() {
            dtb_balance_init_item_Ele.DataTable().clear().destroy()
            let frm = new SetupFormSubmit(dtb_balance_init_item_Ele);
            dtb_balance_init_item_Ele.DataTableDefault(
                {
                    dom: '',
                    useDataServer: true,
                    reloadCurrency: true,
                    paging: false,
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('balance_init_list')) {
                                console.log(resp.data['balance_init_list'])
                                return resp.data['balance_init_list'] ? resp.data['balance_init_list'] : []
                            }
                            throw Error('Call data raise errors.')
                        },
                    },
                    columns: [
                        {
                            className: 'wrap-text',
                            render: (data, type, row) => {
                                return `<span data-item-id="${row?.['product']?.['id']}" class="badge badge-soft-secondary balance-item">${row?.['product']?.['code']}</span>&nbsp;<span>${row?.['product']?.['title']}</span>`;
                            }
                        },
                        {
                            className: 'wrap-text',
                            render: (data, type, row) => {
                                return `<span>${row?.['product']?.['uom']?.['title']}</span>`;
                            }
                        },
                        {
                            className: 'wrap-text warehouse',
                            render: (data, type, row) => {
                                return `<span data-wh-id="${row?.['warehouse']?.['id']}" class="badge badge-soft-primary balance-wh">${row?.['warehouse']?.['code']}</span>&nbsp;<span>${row?.['warehouse']?.['title']}</span>`;
                            }
                        },
                        {
                            className: 'wrap-text',
                            render: (data, type, row) => {
                                return `<span class="balance-quantity">${row?.['opening_balance_quantity']}</span>`;
                            }
                        },
                        {
                            className: 'wrap-text',
                            render: (data, type, row) => {
                                return `<span class="balance-value mask-money" data-init-money="${row?.['opening_balance_value']}"></span>`;
                            }
                        },
                        {
                            className: 'wrap-text text-right',
                            render: (data, type, row) => {
                                return `<a href="#" class="text-secondary"><i class="far fa-trash-alt"></i></a>`;
                            }
                        },
                    ],
                },
            );
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
                    return resp.data[keyResp];
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
                if (ele.val()) {
                    let selected = SelectDDControl.get_data_from_idx(ele, ele.val())
                    ele.closest('tr').find('.item-uom').text(selected?.['inventory_uom']?.['title'])
                    loadRowSN($(this))
                }
                else {
                    ele.closest('tr').find('.item-uom').text('')
                }
            })
        }
        LoadProduct()

        $(document).on("change", '.item-value', function () {
            let sum = 0
            $('.item-value').each(function (index, item) {
                let value = $(item).attr('value')
                let quantity = $(item).closest('tr').find('.item-quantity').val()

                if (quantity && value) {
                    sum += parseFloat($(item).attr('value'))
                }
            })
            $('#modal-total-value').attr('data-init-money', sum)
            $.fn.initMaskMoney2()
        });

        $(document).on("change", '.item-quantity', function () {
            let sum = 0
            $('.item-value').each(function (index, item) {
                let value = $(item).attr('value')
                let quantity = $(item).closest('tr').find('.item-quantity').val()

                if (quantity && value) {
                    sum += parseFloat($(item).attr('value'))
                }
            })
            $('#modal-total-value').attr('data-init-money', sum)
            $.fn.initMaskMoney2()
            loadRowSN($(this))
        });

        function loadRowSN(ele_in_row) {
            let prd_ele = ele_in_row.closest('tr').find('.item-obj')
            let prd_quantity = parseFloat(ele_in_row.closest('tr').find('.item-quantity').val())
            let selected = SelectDDControl.get_data_from_idx(prd_ele, prd_ele.val())
            if (prd_quantity && prd_ele.val()) {
                if (selected?.['general_traceability_method'] === 2) {
                    $(`.row-input-sn`).remove()
                    $(`.sn-input-label`).remove()
                    let sn_input_html = ``
                    for (let i = 0; i < prd_quantity; i++) {
                        sn_input_html += `<tr class="row-input-sn" data-warehouse-id="${selectWH_Ele.val()}" data-product-id="${selected?.['id']}">
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
                        <td class="w-10"><span>${ele_in_row.closest('tr').find('.item-uom').text()}</span></td>
                        <td class="w-25"><div class="row">
                            <div class="col-6">
                                <input type="text" class="form-control date-time-input expire-date-input">
                            </div>
                            <div class="col-6">
                                <input type="text" class="form-control date-time-input manufacture-date-input">
                            </div>
                        </div></td>
                        <td class="w-25"><div class="row">
                            <div class="col-6">
                                <input type="text" class="form-control date-time-input sn-warranty-start-input">
                            </div>
                            <div class="col-6">
                                <input type="text" class="form-control date-time-input sn-warranty-end-input">
                            </div>
                        </div></td>
                    </tr>`
                    }
                    ele_in_row.closest('tr').after(`
                    <tr class="sn-input-label">
                        <td class="text-primary" colspan="4"><b>Input serial number</b></td>
                    </tr>
                    <tr class="sn-input-label">
                        <td class="w-40">
                            <div class="row">
                                <div class="col-1"></div>
                                <div class="col-5">
                                    <span class="text-muted required">Vendor serial No.</span>
                                </div>
                                <div class="col-6">
                                    <span class="text-muted required">Serial No.</span>
                               </div>
                           </div>
                        </td>
                        <td class="w-10"></td>
                        <td class="w-25"><div class="row">
                            <div class="col-6">
                                <span class="text-muted">Expire date</span>
                            </div>
                            <div class="col-6">
                                <span class="text-muted">Manufacture date</span>
                            </div>
                        </div></td>
                        <td class="w-25"><div class="row">
                            <div class="col-6">
                                <span class="text-muted">Warranty start date</span>
                            </div>
                            <div class="col-6">
                                <span class="text-muted">Warranty end date</span>
                            </div>
                        </div></td>
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
        }

        btn_save_modal.on('click', function () {
            let flag = true
            let list_result = []
            let wh = SelectDDControl.get_data_from_idx(selectWH_Ele, selectWH_Ele.val())
            dtb_wh_product_Ele.find('tbody tr:first-child').each(function () {
                let item_selected = SelectDDControl.get_data_from_idx($(this).find('.item-obj'), $(this).find('.item-obj').val())
                if (selectWH_Ele.val() && $(this).find('.item-obj').val() && $(this).find('.item-quantity').val() && $(this).find('.item-value').attr('value')) {
                    list_result.push({
                        'wh_data': {
                            'id': selectWH_Ele.val(),
                            'code': wh?.['code'],
                            'title': wh?.['title'],
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
                        'quantity_balance': $(this).find('.item-quantity').val(),
                        'value_balance': $(this).find('.item-value').attr('value'),
                    })
                }
                else {
                    flag = false
                }
            })
            let data_sn = []
            dtb_wh_product_Ele.find('.row-input-sn').each(function () {
                if ($(this).find('.vendor-sn-input').val() && $(this).find('.sn-input').val()) {
                    data_sn.push({
                        'vendor_serial_number': $(this).find('.vendor-sn-input').val(),
                        'serial_number': $(this).find('.sn-input').val(),
                        'expire_date': $(this).find('.expire-date-input').val(),
                        'manufacture_date': $(this).find('.sn-manufacture-date-input').val(),
                        'warranty_start': $(this).find('.sn-warranty-start-input').val(),
                        'warranty_end': $(this).find('.sn-warranty-end-input').val(),
                    })
                }
                else {
                    flag = false
                }
            })
            if (flag) {
                dtb_balance_init_item_Ele.find('tbody .dataTables_empty').remove()
                for (const item of list_result) {
                    dtb_balance_init_item_Ele.find('tbody').append(`
                        <tr class="bg-primary-light-5 new-row-data">
                            <script class="data-sn"></script>
                            <td><span data-item-id="${item?.['product_data']?.['id']}" class="badge badge-soft-secondary balance-item">${item?.['product_data']?.['code']}</span>&nbsp;<span>${item?.['product_data']?.['title']}</span></td>
                            <td><span>${item?.['uom_data']?.['title']}</span></td>
                            <td><span data-wh-id="${item?.['wh_data']?.['id']}" class="badge badge-soft-primary balance-wh">${item?.['wh_data']?.['code']}</span>&nbsp;<span>${item?.['wh_data']?.['title']}</span></td>
                            <td><span class="balance-quantity">${item?.['quantity_balance']}</span></td>
                            <td><span class="balance-value mask-money" data-init-money="${item?.['value_balance']}"></span></td>
                            <td class="text-right"><a href="#" class="text-danger btn-delete-row"><i class="far fa-trash-alt"></i></a></td>
                        </tr>
                    `)
                }
                $('.data-sn').last().text(JSON.stringify(data_sn))
                $('#modal-total-value').attr('data-init-money', 0)
                $.fn.initMaskMoney2()
                modal_add_balance.modal('hide')
                selectWH_Ele.empty()
                $('.item-obj').empty()
                $('.item-quantity').val('')
                $('.item-value').attr('value', 0)
                dtb_wh_product_Ele.find('.sn-input-label').remove()
                dtb_wh_product_Ele.find('.row-input-sn').remove()
            }
            else {
                $.fn.notifyB({description: "Missing information"}, 'warning')
            }
        })

        $(document).on("click", '.btn-delete-row', function () {
            $(this).closest('tr').remove()
        });

        function combinesData(frmEle, for_update=false) {
            let frm = new SetupFormSubmit($(frmEle));

            let balance_data = []
            dtb_balance_init_item_Ele.find('tbody .new-row-data').each(function() {
                balance_data.push({
                    'product_id': $(this).find('.balance-item').attr('data-item-id'),
                    'warehouse_id': $(this).find('.balance-wh').attr('data-wh-id'),
                    'quantity': $(this).find('.balance-quantity').text(),
                    'value': $(this).find('.balance-value').attr('data-init-money'),
                    'data_sn': $(this).find('.data-sn').text() ? JSON.parse($(this).find('.data-sn').text()) : []
                })
            })
            frm.dataForm['balance_data'] = balance_data;

            if (for_update) {
                let pk = $.fn.getPkDetail();
                return {
                    url: frmEle.attr('data-url-detail').format_url_with_uuid(pk),
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect,
                };
            }
            return {
                url: frm.dataUrl.format_url_with_uuid(period_setup_sw_start_using_time.replace(/^"(.*)"$/, '$1')),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }

        form_balance_Ele.submit(function (event) {
            event.preventDefault();
            let data = combinesData($(this));
            console.log(data)
            if (data) {
                WindowControl.showLoading();
                $.fn.callAjax2(data)
                    .then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                setTimeout(() => {
                                    window.location.replace($(this).attr('data-redirect-url'));
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
    }
    else {
        form_balance_Ele.prop('hidden', true)
        $('#notify-div').prop('hidden', false)
    }
});