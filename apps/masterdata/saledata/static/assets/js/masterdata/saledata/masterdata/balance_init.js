$(document).ready(function () {
    const period_setup_sw_start_using_time = $('#period_setup_sw_start_using_time').text();
    const form_balance_Ele = $('#form-balance')
    const selectWH_Ele = $('#select-wh')
    const dtb_balance_init_item_Ele = $('#table-balance-item');
    const dtb_wh_product_Ele = $('#table-add-item-wh');
    const btn_add_item_Ele = $('#btn-add-item')
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
                                return `<span data-item-id="${row?.['product']?.['id']}" class="badge badge-secondary balance-item">${row?.['product']?.['code']}</span>&nbsp;<span>${row?.['product']?.['title']}</span>`;
                            }
                        },
                        {
                            className: 'wrap-text',
                            render: (data, type, row) => {
                                return `<span>${row?.['product']?.['uom']?.['title']}</span>`;
                            }
                        },
                        {
                            className: 'wrap-text',
                            render: (data, type, row) => {
                                return `<span data-wh-id="${row?.['warehouse']?.['id']}" class="badge badge-primary balance-wh">${row?.['warehouse']?.['code']}</span>&nbsp;<span>${row?.['warehouse']?.['title']}</span>`;
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
                            className: 'wrap-text',
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
            }).on('change', function () {
            })
        }
        LoadWarehouseList()

        function LoadProduct(data) {
            let ele = dtb_wh_product_Ele.find('tbody tr:last-child').find('.item-obj')
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
                }
                else {
                    ele.closest('tr').find('.item-uom').text('')
                }
            })
        }

        btn_add_item_Ele.on('click', function () {
            let new_ele = `<tr>
                    <td><select class="form-select select2 item-obj"></select></td>
                    <td><span class="item-uom"></span></td>
                    <td><input type="number" class="form-control item-quantity"></td>
                    <td><input class="form-control item-value mask-money"></td>
                    <td><a href="#" class="text-danger btn-delete-row-modal"><i class="far fa-trash-alt"></i></a></td>
                </tr>`
            dtb_wh_product_Ele.find('tbody').append(new_ele)
            $.fn.initMaskMoney2()
            LoadProduct()
        })

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
        });

        $(document).on("click", '.btn-delete-row-modal', function () {
            $(this).closest('tr').remove()
            let sum = 0
            $('.item-value').each(function (index, item) {
                sum += parseFloat($(item).attr('value'))
            })
            $('#modal-total-value').attr('data-init-money', sum)
            $.fn.initMaskMoney2()
        });

        selectWH_Ele.on('change', function () {
            dtb_wh_product_Ele.find('tbody').html(``)
        })

        btn_save_modal.on('click', function () {
            let flag = true
            let list_result = []
            let wh = SelectDDControl.get_data_from_idx(selectWH_Ele, selectWH_Ele.val())
            dtb_wh_product_Ele.find('tbody tr').each(function () {
                let item_selected = SelectDDControl.get_data_from_idx($(this).find('.item-obj'), $(this).find('.item-obj').val())
                if ($(this).find('.item-obj').val() && $(this).find('.item-quantity').val() && $(this).find('.item-value').attr('value')) {
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
            if (flag) {
                for (const item of list_result) {
                    dtb_balance_init_item_Ele.find('tbody').append(`
                        <tr class="bg-primary-light-5 new-row-data">
                            <td><span data-item-id="${item?.['product_data']?.['id']}" class="badge badge-secondary balance-item">${item?.['product_data']?.['code']}</span>&nbsp;<span>${item?.['product_data']?.['title']}</span></td>
                            <td><span>${item?.['uom_data']?.['title']}</span></td>
                            <td><span data-wh-id="${item?.['wh_data']?.['id']}" class="badge badge-primary balance-wh">${item?.['wh_data']?.['code']}</span>&nbsp;<span>${item?.['wh_data']?.['title']}</span></td>
                            <td><span class="balance-quantity">${item?.['quantity_balance']}</span></td>
                            <td><span class="balance-value mask-money" data-init-money="${item?.['value_balance']}"></span></td>
                            <td><a href="#" class="text-danger btn-delete-row"><i class="far fa-trash-alt"></i></a></td>
                        </tr>
                    `)
                }
                $('#modal-total-value').attr('data-init-money', 0)
                $.fn.initMaskMoney2()
                modal_add_balance.modal('hide')
                dtb_wh_product_Ele.find('tbody').html('')
                selectWH_Ele.empty()
            }
            else {
                $.fn.notifyB({description: "Missing row(s) information"}, 'warning')
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