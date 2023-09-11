let titleInput = $('#title')
let warehouseSelectBox = $('#warehouse-select-box')
let dateInput = $('#date')
let statusInput = $('#status')
let inChargeSelectBox = $('#in-charge-select-box')
let tableLineDetailTbody = $('#table-line-detail tbody')
let tableSelectProduct = $('#table-select-products')
let addRowLineDetailBtn = $('#btn-add-row-line-detail')
let fileInput = $('#input-file-now')
let selectProductBtn = $('#btn-select-product')
let selectAllProductBtn = $('#selected_all_product')
let LIST_WAREHOUSE_PRODUCT = []
let GOODS_RECEIPT_PRODUCT_LIST = []

addRowLineDetailBtn.on('click', async function () {
    if (warehouseSelectBox.val().length < 1) {
        $.fn.notifyB({description: 'Please select at least 1 warehouse'}, 'warning');
    }
    else {
        selectAllProductBtn.prop('checked', false);
        LoadTableSelectProduct(warehouseSelectBox.val());
    }
})

selectProductBtn.on('click', async function () {
    await LoadGoodsReceiptProduct();
    let selected_product = []
    tableSelectProduct.find('tbody tr').each(function () {
        let select_box = $(this).find('.selected_product');
        if (select_box.is(':checked')) {
            let product_id = select_box.attr('data-product-id');
            let warehouse_id = select_box.attr('data-warehouse-id');
            selected_product.push(LIST_WAREHOUSE_PRODUCT.filter(function (element) {
                return element.product_id === product_id && element.warehouse_id === warehouse_id;
            })[0])
        }
    })
    tableLineDetailTbody.html('');
    for (let i = 0; i < selected_product.length; i++) {
        let quantity = GOODS_RECEIPT_PRODUCT_LIST.filter(function (element) {
            return element.product === selected_product[i].product_id && element.warehouse === selected_product[i].warehouse_id && element.uom === selected_product[i].product_uom_id;
        })[0]?.['quantity'];
        let count = 0;
        let difference = count - parseFloat(quantity);
        let action_type = 'Increasing';
        if (difference < 0) {
            difference = '(' + difference + ')';
            action_type = 'Decreasing';
        }
        tableLineDetailTbody.append(`
            <tr>
                <td>${selected_product[i].product_title}</td>
                <td>${selected_product[i].warehouse_title}</td>
                <td>${selected_product[i].product_uom_title}</td>
                <td class="quantity-td">${quantity}</td>
                <td><input class="form-control count-input" type="text" placeholder="Number"></td>
                <td class="difference-td">${difference}</td>
                <td>
                    <span class="form-check">
                        <input type="checkbox" class="form-check-input selected_for_actions" data-warehouse-id="${selected_product[i].warehouse_id}" data-product-id="${selected_product[i].product_id}">
                        <label class="form-check-label"></label>
                    </span>
                </td>
                <td class="action_type-td">${action_type}</td>
                <td></td>
                <td><i class="bi bi-trash text-danger delete-row"></i></td>
            </tr>
        `)
    }
})

$(document).on('input', '.count-input', function () {
    let count = $(this).val();
    if ($(this).val() === '') {
        count = 0;
    }
    let quantity = $(this).closest('tr').find('.quantity-td').text();
    let difference = parseFloat(count) - parseFloat(quantity);
    let action_type = 'Increasing';
    if (difference < 0) {
        difference = '(' + difference + ')';
        action_type = 'Decreasing';
    }
    $(this).closest('tr').find('.difference-td').text(difference);
    $(this).closest('tr').find('.action_type-td').text(action_type);
})

fileInput.dropify({
    messages: {
        'default': 'Drag and drop your file here.',
    },
    tpl: {
        message: '<div class="dropify-message">' +
            '<span class="file-icon"></span>' +
            '<h5>{{ default }}</h5>' +
            '</div>',
    }
});

async function LoadGoodsReceiptProduct() {
    await $.fn.callAjax($('#frm_inventory_adjustment_create').attr('data-url-goods-receipt-product-stock-list'), 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            console.log(data)
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('goods_receipt_product_list')) {
                GOODS_RECEIPT_PRODUCT_LIST = data?.['goods_receipt_product_list'];
                return data?.['goods_receipt_product_list'];
            }
            return [];
        }
    })
}

selectAllProductBtn.on('click', function () {
    if ($(this).is(':checked')) {
        document.querySelectorAll('.selected_product').forEach(function (element) {
            element.checked = true;
        })
    }
    else {
        document.querySelectorAll('.selected_product').forEach(function (element) {
            element.checked = false;
        })
    }
})

function LoadCreatedDate() {
    dateInput.dateRangePickerDefault({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'),10)
    }).prop('disabled', true).css({'color': 'black'});
}

function LoadStatus() {
    statusInput.val('Open').prop('disabled', true).css({'color': 'black'});
}

function LoadWarehouseSelectBox(data) {
    warehouseSelectBox.initSelect2({
        ajax: {
            url: warehouseSelectBox.attr('data-url'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'warehouse_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function LoadInChargeSelectBox(data) {
    inChargeSelectBox.initSelect2({
        ajax: {
            url: inChargeSelectBox.attr('data-url'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'employee_list',
        keyId: 'id',
        keyText: 'full_name',
    })
}

function LoadTableSelectProduct(warehouse_list) {
    tableSelectProduct.DataTable().clear().destroy();
    tableSelectProduct.DataTableDefault({
        scrollY: true,
        paging: false,
        useDataServer: true,
        ajax: {
            url: $('#frm_inventory_adjustment_create').attr('data-url-warehouse-product-list'),
            type: 'GET',
            dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.data['warehouses_products_list']) {
                            let data_list = [];
                            for (let i = 0; i < resp.data['warehouses_products_list'].length; i++) {
                                let warehouse_temp = resp.data['warehouses_products_list'][i];
                                if (warehouse_list.includes(warehouse_temp['id'])) {
                                    for (let j = 0; j < warehouse_temp['product_list'].length; j++) {
                                        let product_temp = warehouse_temp['product_list'];
                                        data_list.push({
                                            'warehouse_id': warehouse_temp['id'],
                                            'warehouse_code': warehouse_temp['code'],
                                            'warehouse_title': warehouse_temp['title'],
                                            'warehouse_is_active': warehouse_temp['is_active'],
                                            'warehouse_remarks': warehouse_temp['remarks'],
                                            'product_id': product_temp[j]['id'],
                                            'product_title': product_temp[j]['title'],
                                            'product_uom_id': product_temp[j]['uom']['id'],
                                            'product_uom_title': product_temp[j]['uom']['title'],
                                        })
                                    }
                                }
                            }
                            LIST_WAREHOUSE_PRODUCT = data_list;
                            return data_list;
                        } else {
                            return [];
                        }
                    }
                    return [];
                }
            },
        columns: [
                {
                    render: (data, type, row) => {
                        return `<span class="form-check">
                            <input type="checkbox" class="form-check-input selected_product" data-warehouse-id="${row.warehouse_id}" data-product-id="${row.product_id}">
                            <label class="form-check-label"></label>
                        </span>`;
                    }
                },
                {
                    data: 'warehouse_title',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row.warehouse_title}`
                    }
                },
                {
                    data: 'warehouse_code',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary w-100">${row.warehouse_code}</span>`
                    }
                },
                {
                    data: 'product_title',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${row.product_title}`
                    }
                }
            ],
    });
}

class InventoryAdjustmentHandle {
    load() {
        LoadCreatedDate();
        LoadStatus();
        LoadWarehouseSelectBox();
        LoadInChargeSelectBox();
    }
}