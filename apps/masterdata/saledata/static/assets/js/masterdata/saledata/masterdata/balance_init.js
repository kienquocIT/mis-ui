$(document).ready(function () {
    const selectWH_Ele = $('#select-wh')
    const dtb_balance_init_item_Ele = $('#table-balance-item');
    const dtb_wh_product_Ele = $('#table-add-item-wh');
    const btn_add_item_Ele = $('#btn-add-item')
    const btn_save_modal = $('#save-modal')

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
                url: dtb_wh_product_Ele.attr('data-url') + `?warehouse_id=${selectWH_Ele.val()}`,
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            templateResult: function(data) {
                let ele = $('<div class="row"></div>');
                ele.append(`<div class="col-4"><span class="badge badge-soft-primary">${data.data?.['product']?.['code']}</span></div><div class="col-8">${data.data?.['product']?.['title']}</div>`);
                return ele;
            },
            data: (data ? data : null),
            keyResp: 'warehouse_products_list',
            keyId: 'id',
            keyText: "product.title",
        }).on('change', function () {
            if (ele.val()) {
                let selected = SelectDDControl.get_data_from_idx(ele, ele.val())
                ele.closest('tr').find('.item-uom').text(selected?.['uom']?.['title'])
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
        let list_result = []
        let wh = SelectDDControl.get_data_from_idx(selectWH_Ele, selectWH_Ele.val())
        dtb_wh_product_Ele.find('tbody tr').each(function () {
            let item_selected = SelectDDControl.get_data_from_idx($(this).find('.item-obj'), $(this).find('.item-obj').val())
            list_result.push({
                'wh_data': {
                    'id': selectWH_Ele.val(),
                    'code': wh?.['code'],
                    'title': wh?.['title'],
                },
                'product_data': item_selected?.['product'],
                'uom_data': item_selected?.['uom'],
                'quantity_balance': $(this).find('.item-quantity').val(),
                'value_balance': $(this).find('.item-value').attr('value'),
            })
        })
        for (const item of list_result) {
            dtb_balance_init_item_Ele.find('tbody').append(`
                <tr>
                    <td></td>
                    <td><span>${item?.['product_data']?.['code']}</span></td>
                    <td><span>${item?.['product_data']?.['title']}</span></td>
                    <td><span>${item?.['wh_data']?.['code']}</span></td>
                    <td><span>${item?.['wh_data']?.['title']}</span></td>
                    <td><span>${item?.['uom_data']?.['title']}</span></td>
                    <td><span>${item?.['quantity_balance']}</span></td>
                    <td><span>${item?.['value_balance']}</span></td>
                    <td><a href="#" class="text-danger btn-delete-row"><i class="far fa-trash-alt"></i></a></td>
                </tr>
            `)
        }
    })
});