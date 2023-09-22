let titleInput = $('#title')
let warehouseSelectBox = $('#warehouse-select-box')
let dateInput = $('#date')
let statusInput = $('#status')
let inChargeSelectBox = $('#in-charge-select-box')
let tableLineDetail = $('#table-line-detail')
let tableLineDetailTbody = $('#table-line-detail tbody')
let tableSelectProduct = $('#table-select-products')
let addRowLineDetailBtn = $('#btn-add-row-line-detail')
let fileInput = $('#input-file-now')
let selectProductBtn = $('#btn-select-product')
let selectAllProductBtn = $('#selected_all_product')
let LIST_WAREHOUSE_PRODUCT = []
let WAREHOUSE_STOCK_LIST = []

addRowLineDetailBtn.on('click', async function () {
    if (warehouseSelectBox.val().length < 1) {
        $.fn.notifyB({description: 'Please select at least 1 warehouse'}, 'warning');
    }
    else {
        selectAllProductBtn.prop('checked', false);
        LoadTableSelectProduct(warehouseSelectBox.val());
    }
})

async function loadWarehouseProducts(product_id) {
    await $.fn.callAjax(tableLineDetail.attr('data-warehouse-product-list'), 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('warehouse_products_list')) {
                let product_get_from_wh_product_list = data?.['warehouse_products_list'].filter(function (item) {
                    return item.product === product_id;
                })
                let warehouse_stock_list = [];
                for (let i = 0; i < product_get_from_wh_product_list.length; i++) {
                    let raw_stock_quantity = product_get_from_wh_product_list[i]?.['stock_amount'];
                    let delivered_quantity = product_get_from_wh_product_list[i]?.['sold_amount'];
                    let ready_quantity = product_get_from_wh_product_list[i]?.['picked_ready'];

                    warehouse_stock_list.push(
                        {
                            'warehouse_id': product_get_from_wh_product_list[i].warehouse,
                            'uom_id': product_get_from_wh_product_list[i].uom,
                            'stock': raw_stock_quantity - delivered_quantity,
                            'wait_for_delivery': ready_quantity,
                            'wait_for_receipt': 0,
                        }
                    );
                }
                WAREHOUSE_STOCK_LIST = warehouse_stock_list;
            }
            return false;
        }
    }, (errs) => {
        console.log(errs)
    },)
}

selectProductBtn.on('click', async function () {
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
        await loadWarehouseProducts(selected_product[i].product_id);
        let quantity = WAREHOUSE_STOCK_LIST.filter(function (element) {
            return element.warehouse_id === selected_product[i].warehouse_id && element.uom_id === selected_product[i].product_inventory_uom_id;
        })[0]?.['stock'];
        tableLineDetailTbody.append(`
            <tr>
                <td data-id="${selected_product[i].product_id}" class="text-primary product_id_td">${selected_product[i].product_title}</td>
                <td data-id="${selected_product[i].warehouse_id}" class="warehouse_id_td"><i class="fas fa-warehouse"></i> ${selected_product[i].warehouse_title}</td>
                <td data-id="${selected_product[i].product_inventory_uom_id}" class="uom_id_td">${selected_product[i].product_inventory_uom_title}</td>
                <td class="quantity-td">${quantity}</td>
                <td><input class="form-control count-input" type="text" placeholder="Number" value="${quantity}"></td>
                <td class="difference_td">0</td>
                <td>
                    <span class="form-check">
                        <input type="checkbox" class="form-check-input selected_for_actions">
                        <label class="form-check-label"></label>
                    </span>
                </td>
                <td class="action_type_td"></td>
                <td></td>
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
    let action_type = '';
    if (difference < 0) {
        difference = '(' + difference * -1 + ')';
        action_type = '<span class="text-danger">Decreasing <i class="bi bi-arrow-down"></i></span>';
    }
    if (difference > 0) {
        action_type = '<span class="text-primary">Increasing <i class="bi bi-arrow-up"></i></span>';
    }
    $(this).val(parseFloat($(this).val() ? $(this).val() : 0));
    $(this).closest('tr').find('.difference_td').html(difference);
    $(this).closest('tr').find('.action_type_td').html(action_type);
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
                            console.log(resp.data['warehouses_products_list'])
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
                                            'product_inventory_uom_id': product_temp[j]['inventory_uom']['id'],
                                            'product_inventory_uom_title': product_temp[j]['inventory_uom']['title'],
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
                    data: 'warehouse_code',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary w-80">${row.warehouse_code}</span>`
                    }
                },
                {
                    data: 'warehouse_title',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span><i class="fas fa-warehouse"></i> ${row.warehouse_title}</span>`
                    }
                },
                {
                    data: 'product_title',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${row.product_title}</span>`
                    }
                }
            ],
    });
}

function getDataForm() {
    let data = {}

    data['title'] = titleInput.val();
    if (data['title'] === '') {
        $.fn.notifyB({description: 'Title must not be NULL'}, 'failure');
        return false
    }
    data['date_created'] = dateInput.val();
    if (data['date'] === '') {
        $.fn.notifyB({description: 'Date must not be NULL'}, 'failure');
        return false
    }
    data['ia_warehouses_data'] = warehouseSelectBox.val();
    if (data['ia_warehouses_data'].length <= 0) {
        $.fn.notifyB({description: 'Warehouse must not be NULL'}, 'failure');
        return false
    }
    data['ia_employees_in_charge'] = inChargeSelectBox.val();
    if (data['ia_employees_in_charge'].length <= 0) {
        $.fn.notifyB({description: 'Employee in charge must not be NULL'}, 'failure');
        return false
    }

    let ia_items_data_list = [];
    tableLineDetailTbody.find('tr').each(function () {
        let product_mapped_id = $(this).find('.product_id_td').attr('data-id');
        let warehouse_mapped_id = $(this).find('.warehouse_id_td').attr('data-id');
        let uom_mapped_id = $(this).find('.uom_id_td').attr('data-id');
        let book_quantity = $(this).find('.quantity-td').text();
        let count = $(this).find('.count-input').val();
        let select_for_action = $(this).find('.selected_for_actions').is(':checked');
        let action_status = 0;
        ia_items_data_list.push({
            'product_mapped_id': product_mapped_id,
            'warehouse_mapped_id': warehouse_mapped_id,
            'uom_mapped_id': uom_mapped_id,
            'book_quantity': book_quantity,
            'count': count,
            'select_for_action': select_for_action,
            'action_status': action_status
        })
    });

    data['ia_items_data'] = ia_items_data_list;

    return data
}

class InventoryAdjustmentHandle {
    load() {
        LoadCreatedDate();
        LoadStatus();
        LoadWarehouseSelectBox();
        LoadInChargeSelectBox();
    }
    combinesData(frmEle, for_update=false) {
        let dataForm = getDataForm();
        if (dataForm) {
            let frm = new SetupFormSubmit($(frmEle));

            let url_return = frm.dataUrl;
            if (for_update === true) {
                let pk = $.fn.getPkDetail()
                url_return = frm.dataUrl.format_url_with_uuid(pk);
            }

            return {
                url: url_return,
                method: frm.dataMethod,
                data: dataForm,
                urlRedirect: frm?.['urlRedirect'],
            };
        }
        return false;
    }
}

function Disable() {
    $('.form-control').prop('disabled', true).css({color: 'black'});
    $('.form-select').prop('disabled', true).css({color: 'black'});
    $('.select2').prop('disabled', true);
    $('input').prop('disabled', true);
}

function LoadDetailIA(option) {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#frm_inventory_adjustment_detail').attr('data-url-detail').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['inventory_adjustment_detail']?.['workflow_runtime_id']);
                data = data['inventory_adjustment_detail'];
                $.fn.compareStatusShowPageAction(data);

                console.log(data)
                $('#ia-code').text(data.code);
                titleInput.val(data.title);
                dateInput.val(data.date_created.split(' ')[0]);
                LoadStatus();
                LoadWarehouseSelectBox(data?.['warehouses']);
                LoadInChargeSelectBox(data?.['employees_in_charge']);

                Disable(option);

                for (let i = 0; i < data?.['inventory_adjustment_item_mapped'].length; i++) {
                    let data_row = data?.['inventory_adjustment_item_mapped'][i];
                    let checked = '';
                    if (data_row?.['select_for_action']) {
                        checked = 'checked';
                    }
                    let done = '';
                    if (data_row?.['action_status']) {
                        done = 'Done';
                    }
                    let difference = parseFloat(data_row?.['count']) - parseFloat(data_row?.['book_quantity']);
                    let action_type = '';
                    if (difference < 0) {
                        difference = '(' + difference * -1 + ')';
                        action_type = '<span class="text-danger">Decreasing <i class="bi bi-arrow-down"></i></span>';
                    }
                    if (difference > 0) {
                        action_type = '<span class="text-primary">Increasing <i class="bi bi-arrow-up"></i></span>';
                    }
                    tableLineDetailTbody.append(`
                        <tr>
                            <td data-id="${data_row?.['product_mapped'].id}" class="text-primary product_id_td">${data_row?.['product_mapped'].title}</td>
                            <td data-id="${data_row?.['warehouse_mapped'].id}" class="warehouse_id_td"><i class="fas fa-warehouse"></i> ${data_row?.['warehouse_mapped'].title}</td>
                            <td data-id="${data_row?.['uom_mapped'].id}" class="uom_id_td">${data_row?.['uom_mapped'].title}</td>
                            <td class="quantity-td">${data_row?.['book_quantity']}</td>
                            <td><input class="form-control count-input" type="text" placeholder="Number" value="${data_row?.['count']}"></td>
                            <td class="difference_td">${difference}</td>
                            <td>
                                <span class="form-check">
                                    <input type="checkbox" class="form-check-input selected_for_actions" ${checked}>
                                    <label class="form-check-label"></label>
                                </span>
                            </td>
                            <td class="action_type_td">${action_type}</td>
                            <td>${done}</td>
                        </tr>
                    `)
                }

                $.fn.initMaskMoney2();
            }
        })
}