const $tab_line_detail_datatable = $('#tab_line_detail_datatable')
const $btn_add_row_line_detail = $('#btn-add-row-line-detail')
const $trans_script = $('#trans-script')
const $url_script = $('#url-script')

function loadDefaultTableLineDetail() {
    if (!$.fn.DataTable.isDataTable('#tab_line_detail_datatable')) {
        $tab_line_detail_datatable.DataTableDefault({
            dom: '',
            data: [],
            columns: [
                {
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },{
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },{
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },{
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },{
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },{
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },{
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },{
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },{
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
            ],
        });
    }
}

loadDefaultTableLineDetail()

function loadProduct(ele, data) {
    ele.initSelect2({
        placeholder: $trans_script.attr('data-trans-product-list'),
        allowClear: true,
        ajax: {
            url: $url_script.attr('data-url-product-list') + `?warehouse_id=${ele.closest('tr').find('.from-wh').val()}`,
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'warehouse_products_list',
        keyId: 'id',
        keyText: 'product.title',
    }).on('change', function () {
        if ($(this).val()) {
            let selected = SelectDDControl.get_data_from_idx(ele, ele.val())
            ele.closest('tr').find('.uom').text(selected?.['uom']?.['title'])
            ele.closest('tr').find('.quantity').attr('data-quantity-limit', selected?.['stock_amount'])
        }
        else {
            ele.closest('tr').find('.uom').text('')
        }
    })
}

function loadFromWH(ele, data) {
    ele.initSelect2({
        placeholder: $trans_script.attr('data-trans-out-warehouse-list'),
        allowClear: true,
        ajax: {
            url: $url_script.attr('data-url-warehouse-list') + '?is_dropship=False',
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'warehouse_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        loadProduct(ele.closest('tr').find('.prd'))
        loadTargetWH(ele.closest('tr').find('.to-wh'), null, $(this))
        ele.closest('tr').find('.prd').empty()
        ele.closest('tr').find('.to-wh').empty()
    })
}

function loadTargetWH(ele, data, from_wh) {
    ele.initSelect2({
        placeholder: $trans_script.attr('data-trans-target-warehouse-list'),
        allowClear: true,
        ajax: {
            url: $url_script.attr('data-url-warehouse-list') + '?is_dropship=False',
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i]?.['id'] !== from_wh.val()) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'warehouse_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {})
}

$btn_add_row_line_detail.on('click', function () {
    $tab_line_detail_datatable.find('tbody .dataTables_empty').closest('tr').remove()
    let index = $tab_line_detail_datatable.find('tbody tr').length + 1
    let row_html = $(`<tr>
        <td class="index">${index}</td>
        <td><select class="from-wh form-select select2"></select></td>
        <td><select class="prd form-select select2"></select></td>
        <td><span class="uom"></span></td>
        <td><input class="quantity form-control" type="number"></td>
        <td><select class="to-wh form-select select2"></select></td>
        <td><input class="unit-price form-control mask-money"></td>
        <td><input class="subtotal-price form-control mask-money"></td>
        <td class="text-center"><a href="#" class="btn-delete text-danger"><i class="bi bi-trash"></i></a></td>
    </tr>`)
    $tab_line_detail_datatable.find('tbody').append(row_html)
    loadFromWH(row_html.find('.from-wh'))
})

$(document).on("click", '.btn-delete', function () {
    $(this).closest('tr').remove();
    $tab_line_detail_datatable.find('tbody tr').each(function (index) {
        $(this).find('.index').text(index+1)
    })
});

$(document).on("change", '.quantity', function () {
    if (parseFloat($(this).val()) > parseFloat($(this).attr('data-quantity-limit'))) {
        $(this).val(0)
        $.fn.notifyB({description: `Input quantity > stock quantity (${$(this).attr('data-quantity-limit')})`}, 'warning')
    }
});
