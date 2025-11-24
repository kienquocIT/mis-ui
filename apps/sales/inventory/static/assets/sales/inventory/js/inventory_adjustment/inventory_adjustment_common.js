const titleInput = $('#title')
const warehouseSelectBox = $('#warehouse-select-box')
const dateInput = $('#date')
const state_detail_Ele = $('#state-detail')
const script_trans = $('#trans_script')
const inChargeSelectBox = $('#in-charge-select-box')
const tableLineDetailTbody = $('#table-line-detail tbody')
const tableSelectProduct = $('#table-select-products')
const addRowLineDetailBtn = $('#btn-add-row-line-detail')
const selectProductBtn = $('#btn-select-product')
const selectAllProductBtn = $('#selected_all_product')
const get_increase_items_btn = $('#get-increase-items-btn')
const get_decrease_items_btn = $('#get-decrease-items-btn')
let LIST_WAREHOUSE_PRODUCT = []

class IALoadPage {
    static LoadDateCreated() {
        dateInput.daterangepicker({
    singleDatePicker: true,
    timepicker: false,
    showDropdowns: false,
    minYear: 2023,
    locale: {
        format: 'DD/MM/YYYY'
    },
    maxYear: parseInt(moment().format('YYYY'), 10),
    drops: 'up',
    autoApply: true,
});
    }
    static LoadWarehouseSelectBox(data) {
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
    static LoadInChargeSelectBox(data) {
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
}

class IAAction {
    static LoadTableSelectProduct() {
        let warehouses_products_list_ajax = $.fn.callAjax2({
                url: $('#url_script').attr('data-url-warehouse-product-list'),
                data: {},
                method: 'GET'
            }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data?.['warehouses_products_list']) {
                        let data_list = [];
                        let data_dict = {};
                        for (let i = 0; i < data?.['warehouses_products_list'].length; i++) {
                            let warehouse_temp = data?.['warehouses_products_list'][i];
                            if (warehouseSelectBox.val().includes(warehouse_temp['id'])) {
                                for (let j = 0; j < warehouse_temp['product_list'].length; j++) {
                                    let product_temp = warehouse_temp['product_list'];
                                    let data_temp = {
                                        'product_warehouse_id': product_temp[j]['id'],
                                        'warehouse_id': warehouse_temp['id'],
                                        'warehouse_code': warehouse_temp['code'],
                                        'warehouse_title': warehouse_temp['title'],
                                        'warehouse_is_active': warehouse_temp['is_active'],
                                        'warehouse_remarks': warehouse_temp['remarks'],
                                        'product_id': product_temp[j]['product']['id'],
                                        'product_code': product_temp[j]['product']['code'],
                                        'product_title': product_temp[j]['product']['title'],
                                        'product_inventory_uom_id': product_temp[j]['inventory_uom']['id'],
                                        'product_inventory_uom_title': product_temp[j]['inventory_uom']['title'],
                                        'available_amount': product_temp[j]['available_amount'],
                                    }
                                    data_list.push(data_temp)
                                    data_dict[product_temp[j]['id']] = data_temp;
                                }
                            }
                        }
                        LIST_WAREHOUSE_PRODUCT = data_list;
                        $('#data-product-warehouse').text(JSON.stringify(data_dict));
                        return data_list;
                    } else {
                        return [];
                    }
                }
                return [];
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([warehouses_products_list_ajax]).then(
            (results) => {
                tableSelectProduct.find('tbody').html('')
                let index = 0
                for (const item of results[0]) {
                    index += 1
                    tableSelectProduct.find('tbody').append(`
                        <tr>
                            <td>${index}</td>
                            <td>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input selected_product" data-warehouse-id="${item?.['warehouse_id']}" data-product-id="${item?.['product_id']}" data-id="${item?.['product_warehouse_id']}">
                                    <label class="form-check-label"></label>
                                </span>
                            </td>
                            <td><span class="badge badge-soft-blue">${item?.['warehouse_code']}</span> ${item?.['warehouse_title']}</td>
                            <td><span class="badge badge-soft-primary">${item?.['product_code']}</span> ${item?.['product_title']}</span></td>
                        </tr>
                    `)
                }
            })
    }
}

class IAHandle {
    static LoadPage() {
        IALoadPage.LoadDateCreated()
        IALoadPage.LoadWarehouseSelectBox()
        IALoadPage.LoadInChargeSelectBox()
    }
    static Disable(option) {
        if (option === 'detail') {
            $('.form-control').prop('disabled', true).prop('readonly', true);
            $('.form-select').prop('disabled', true).prop('readonly', true);
            $('.select2').prop('disabled', true);
            $('#collapse-area input').prop('disabled', true);
            addRowLineDetailBtn.prop('disabled', true)
            $('#printModal .form-select').prop('disabled', false)
        }
        if (option === 'update') {
            $('#collapse-area .form-control').prop('disabled', true).prop('readonly', true);
            $('#collapse-area .form-select').prop('disabled', true).prop('readonly', true);
            $('#collapse-area .select2').prop('disabled', true);
            $('#collapse-area input').prop('disabled', true);
        }
    }
    static GetDataFormCreate() {
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
        let product_dict = JSON.parse($('#data-product-warehouse').text());
        tableLineDetailTbody.find('tr').each(function () {
            let product_obj = product_dict[$(this).find('.product_id_td').attr('data-id')];
            let book_quantity = parseFloat(product_obj.available_amount)
            let count = parseFloat($(this).find('.count-input').val())
            let select_for_action = $(this).find('.selected_for_actions').is(':checked');
            let action_status = 0;
            let action_type = (count > book_quantity) ? 2 : (count < book_quantity) ? 1 : 0;
            ia_items_data_list.push({
                'product_warehouse_id': product_obj.product_warehouse_id,
                'product_mapped_id': product_obj.product_id,
                'warehouse_mapped_id': product_obj.warehouse_id,
                'uom_mapped_id': product_obj.product_inventory_uom_id,
                'book_quantity': product_obj.available_amount,
                'count': count,
                'action_type': action_type,
                'select_for_action': select_for_action,
                'action_status': action_status
            })
        });

        data['ia_items_data'] = ia_items_data_list;

        return data
    }
    static GetDataFormUpdate() {
        let data = {}

        data['title'] = titleInput.val();

        data['ia_employees_in_charge'] = inChargeSelectBox.val();
        if (data['ia_employees_in_charge'].length <= 0) {
            $.fn.notifyB({description: 'Employee in charge must not be NULL'}, 'failure');
            return false
        }

        let ia_items_data_list = [];
        tableLineDetailTbody.find('tr').each(function () {
            let book_quantity = parseFloat($(this).find('.quantity-td').text())
            let count = parseFloat($(this).find('.count-input').val())
            let action_type = (count > book_quantity) ? 2 : (count < book_quantity) ? 1 : 0;
            ia_items_data_list.push({
                'id': $(this).find('.product_id_td').attr('data-item-id'),
                'count': count,
                'action_type': action_type,
                'select_for_action': $(this).find('.selected_for_actions').is(':checked'),
            })
        });

        data['ia_items_data'] = ia_items_data_list;

        return data
    }
    static CombinesDataCreate(frmEle) {
        let dataForm = IAHandle.GetDataFormCreate();
        if (dataForm) {
            let frm = new SetupFormSubmit($(frmEle));
            return {
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: dataForm,
                urlRedirect: frm?.['urlRedirect'],
            };
        }
        return false;
    }
    static CombinesDataUpdate(frmEle) {
        let dataForm = IAHandle.GetDataFormUpdate();
        if (dataForm) {
            let frm = new SetupFormSubmit($(frmEle));
            let pk = $.fn.getPkDetail()
            return {
                url: frm.dataUrl.format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: dataForm,
                urlRedirect: frm?.['urlRedirect'],
            };
        }
        return false;
    }
    static LoadDetailIA(option, data_params={}, action='') {
        let pk = $.fn.getPkDetail()
        let url_loaded = $('#frm_inventory_adjustment_detail').attr('data-url-detail').replace(0, pk);
        $.fn.callAjax(url_loaded, 'GET', data_params).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (action) {
                        location.reload()
                    }
                    else {
                        data = data?.['inventory_adjustment_detail'];
                        if (option === 'detail') {
                            new PrintTinymceControl().render('c5de0a7d-bea3-4f39-922f-06a40a060aba', data, false);
                        }
                        $.fn.compareStatusShowPageAction(data);
                        $x.fn.renderCodeBreadcrumb(data);
                        // console.log(data)

                        $('#start-ia').prop('disabled', data?.['state'] !== 0);
                        $('#done-ia').prop('disabled', data?.['state'] !== 1);
                        $('#start-ia-space').prop('hidden', data?.['state'] !== 0);
                        $('#done-ia-space').prop('hidden', data?.['state'] !== 1);
                        $('.hidden-col').prop('hidden', data?.['state'] === 0);
                        $('#action-space').prop('hidden', data?.['state'] === 2 || option!=='detail');

                        titleInput.val(data.title);
                        dateInput.val(moment(data?.['date_created'].split(' ')[0]).format('DD/MM/YYYY'));
                        state_detail_Ele.val(data?.['state_detail']);
                        IALoadPage.LoadWarehouseSelectBox(data?.['warehouses']);
                        IALoadPage.LoadInChargeSelectBox(data?.['employees_in_charge']);

                        for (let i = 0; i < data?.['inventory_adjustment_item_mapped'].length; i++) {
                            let data_row = data?.['inventory_adjustment_item_mapped'][i];
                            let checked = '';
                            let class_ctn = '';
                            if (data_row?.['select_for_action']) {
                                checked = 'checked';
                                class_ctn = 'highlight-border-left-primary';
                            }
                            let done = '--';
                            if (data_row?.['action_status']) {
                                done = '<i class="fas fa-check"></i>';
                            }
                            let difference = parseFloat(data_row?.['count']) - parseFloat(data_row?.['book_quantity']);
                            let action_type = '';
                            let disabled_select = '';
                            if (data_row?.['action_status']) {
                                disabled_select = 'disabled readonly';
                            }
                            if (difference !== 0) {
                                if (difference < 0) {
                                    difference = '(' + difference * -1 + ')';
                                    action_type = '<span class="text-danger"><i class="bi bi-arrow-down"></i></span>';
                                }
                                if (difference > 0) {
                                    action_type = '<span class="text-primary"><i class="bi bi-arrow-up"></i></span>';
                                }
                            }
                            tableLineDetailTbody.append(`
                                <tr class="${class_ctn}">
                                    <td>${i + 1}</td>
                                    <td data-item-id="${data_row?.['id']}" data-product-warehouse-id="${data_row?.['product_warehouse_mapped_id']}" data-id="${data_row?.['product_mapped']?.['id']}" class="text-muted product_id_td">
                                        <span class="badge badge-sm badge-light">${data_row?.['product_mapped']?.['code']}</span><br><span>${data_row?.['product_mapped']?.['title']}</span>
                                    </td>
                                    <td data-id="${data_row?.['warehouse_mapped']?.['id']}" class="warehouse_id_td">
                                        <span class="badge badge-sm badge-light mr-1">${data_row?.['warehouse_mapped']?.['code']}</span><span>${data_row?.['warehouse_mapped']?.['title']}</span>
                                    </td>
                                    <td data-id="${data_row?.['uom_mapped']?.['id']}" class="uom_id_td">${data_row?.['uom_mapped']?.['title']}</td>
                                    <td class="quantity-td">${data_row?.['book_quantity']}</td>
                                    <td ${data?.['state'] === 0 ? 'hidden' : ''}><input step="0.01" ${disabled_select} class="form-control count-input" type="number" placeholder="Number" value="${data_row?.['count']}"></td>
                                    <td ${data?.['state'] === 0 ? 'hidden' : ''} class="difference_td">${difference}</td>
                                    <td ${data?.['state'] === 0 ? 'hidden' : ''} class="issued_receipted_td">${data_row?.['issued_receipted_quantity']}</td>
                                    <td hidden class="text-center">
                                        <div class="form-check">
                                            <input ${disabled_select} type="checkbox" class="form-check-input selected_for_actions" ${checked}>
                                            <label class="form-check-label"></label>
                                        </span>
                                    </td>
                                    <td ${data?.['state'] === 0 ? 'hidden' : ''} class="text-center action_type_td">${action_type}</td>
                                    <td ${data?.['state'] === 0 ? 'hidden' : ''} class="text-center ${done !== '--' ? 'text-success' : 'text-muted'}">${done}</td>
                                </tr>
                            `)
                        }

                        $.fn.initMaskMoney2();

                        new $x.cls.file($('#attachment')).init({
                            enable_download: option === 'detail',
                            enable_edit: option !== 'detail',
                            data: data.attachment,
                            name: 'attachment'
                        })

                        IAHandle.Disable(option);
                    }
                }
            })
    }
}

addRowLineDetailBtn.on('click', async function () {
    if (warehouseSelectBox.val().length < 1) {
        $.fn.notifyB({description: 'Please select at least 1 warehouse'}, 'warning');
    }
    else {
        selectAllProductBtn.prop('checked', false);
        IAAction.LoadTableSelectProduct();
    }
})

selectProductBtn.on('click', async function () {
    let selected_product = []
    let product_dict = JSON.parse($('#data-product-warehouse').text());
    tableSelectProduct.find('tbody tr').each(function () {
        let select_box = $(this).find('.selected_product');
        if (select_box.is(':checked')) {
            let product_id = select_box.attr('data-id');
            selected_product.push(product_dict[product_id]);
        }
    })
    tableLineDetailTbody.html('');
    for (let i = 0; i < selected_product.length; i++) {
        tableLineDetailTbody.append(`
            <tr>
                <td>${i+1}</td>
                <td data-id="${selected_product[i]?.['product_warehouse_id']}" class="text-muted product_id_td"><span class="badge badge-soft-primary">${selected_product[i]?.['product_code']}</span> ${selected_product[i]?.['product_title']}</td>
                <td data-id="${selected_product[i]?.['warehouse_id']}" class="warehouse_id_td"><span class="badge badge-soft-blue">${selected_product[i]?.['warehouse_code']}</span> ${selected_product[i]?.['warehouse_title']}</td>
                <td data-id="${selected_product[i]?.['product_inventory_uom_id']}" class="uom_id_td">${selected_product[i]?.['product_inventory_uom_title']}</td>
                <td class="quantity-td">${selected_product[i]?.['available_amount']}</td>
                <td hidden><input step="0.01" class="form-control count-input" type="number" placeholder="Number" value="${selected_product[i]?.['available_amount']}"></td>
                <td hidden class="difference_td text-center">0</td>
                <td hidden class="text-center issued_receipted_td">0</td>
                <td hidden class="text-center">
                    <div class="form-check">
                        <input type="checkbox" disabled class="form-check-input selected_for_actions">
                        <label class="form-check-label"></label>
                    </span>
                </td>
                <td hidden class="action_type_td text-center"></td>
                <td hidden></tdhidden>
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
    if (difference === 0) {
        $(this).closest('tr').removeClass('highlight-border-left-primary');
        $(this).closest('tr').find('.selected_for_actions').prop('checked', false);
        $(this).closest('tr').find('.selected_for_actions').attr('disabled', true);
    }
    else {
        $(this).closest('tr').find('.selected_for_actions').attr('disabled', false);
        if (difference < 0) {
            difference = '(' + difference.toFixed(2) * -1 + ')';
            action_type = '<span class="text-danger"><i class="bi bi-arrow-down"></i></span>';
        }
        if (difference > 0) {
            action_type = '<span class="text-primary"><i class="bi bi-arrow-up"></i></span>';
        }
    }
    $(this).closest('tr').find('.difference_td').html(difference);
    $(this).closest('tr').find('.action_type_td').html(action_type);
})

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

get_increase_items_btn.on('click', function () {
    let increase_items = [];
    tableLineDetailTbody.find('tr').each(function () {
        let book_quantity = $(this).find('.quantity-td').text();
        let count = $(this).find('.count-input').val();
        let select_for_action = $(this).find('.selected_for_actions').is(':checked');
        if (count > book_quantity && select_for_action) {
            let action_status = 0;
            let action_type = 2;
            increase_items.push({
                'product_warehouse_id': $(this).find('.product_id_td').attr('data-product-warehouse-id'),
                'product_mapped_id': $(this).find('.product_id_td').attr('data-id'),
                'warehouse_mapped_id': $(this).find('.warehouse_id_td').attr('data-id'),
                'uom_mapped_id': $(this).find('.uom_id_td').attr('data-id'),
                'book_quantity': book_quantity,
                'count': count,
                'action_type': action_type,
                'select_for_action': select_for_action,
                'action_status': action_status
            })
        }
    });
    let pk = $.fn.getPkDetail();
    let data_redirect = {
        'ia_id': pk,
        'ia_items': increase_items
    }
    if (increase_items.length > 0) {
        $.fn.notifyB({description: "Getting increase items to Goods Receipt."}, 'success')
        setTimeout(() => {
            window.location.replace($('#frm_inventory_adjustment_detail').attr('data-url-goods-receipt') + '?data_ia=' + JSON.stringify(data_redirect))
        }, 1000);
    }
})

get_decrease_items_btn.on('click', function () {
    let decrease_items = [];
    tableLineDetailTbody.find('tr').each(function () {
        let book_quantity = $(this).find('.quantity-td').text();
        let count = $(this).find('.count-input').val();
        let select_for_action = $(this).find('.selected_for_actions').is(':checked');
        if (count < book_quantity && select_for_action) {
            let action_status = 0;
            let action_type = 1;
            decrease_items.push({
                'product_warehouse_id': $(this).find('.product_id_td').attr('data-product-warehouse-id'),
                'product_mapped_id': $(this).find('.product_id_td').attr('data-id'),
                'warehouse_mapped_id': $(this).find('.warehouse_id_td').attr('data-id'),
                'uom_mapped_id': $(this).find('.uom_id_td').attr('data-id'),
                'book_quantity': book_quantity,
                'count': count,
                'action_type': action_type,
                'select_for_action': select_for_action,
                'action_status': action_status
            })
        }
    });
    let pk = $.fn.getPkDetail();
    let data_redirect = {
        'ia_id': pk,
        'ia_items': decrease_items
    }
    if (decrease_items.length > 0) {
        $.fn.notifyB({description: "Getting decrease items to Goods Receipt."}, 'success')
        setTimeout(() => {
            window.location.replace($('#frm_inventory_adjustment_detail').attr('data-url-goods-receipt') + '?data_ia=' + JSON.stringify(data_redirect))
        }, 1000);
    }
})

$(document).on('input', '.selected_for_actions', function () {
    $(this).closest('tr').toggleClass('highlight-border-left-primary', $(this).is(':checked'));
})

$('#start-ia').on('click', function () {
    Swal.fire({
		html: `<h5 class="text-primary">${script_trans.attr('data-trans-start-ia')}</h5><p class="small">${script_trans.attr('data-trans-start-ia-sub')}</p>`,
		customClass: {
			confirmButton: 'btn text-primary',
			cancelButton: 'btn text-gray',
			container:'swal2-has-bg',
			actions:'w-100'
		},
		showCancelButton: true,
		buttonsStyling: false,
		confirmButtonText: script_trans.attr('data-trans-change-ok'),
		cancelButtonText: script_trans.attr('data-trans-change-no'),
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
            IAHandle.LoadDetailIA('detail', {'start_ia': true}, 'start_ia')
		}
	})
})

$('#done-ia').on('click', function () {
    Swal.fire({
		html: `<h5 class="text-success">${script_trans.attr('data-trans-done-ia')}</h5><p class="small">${script_trans.attr('data-trans-done-ia-sub')}</p>`,
		customClass: {
			confirmButton: 'btn text-success',
			cancelButton: 'btn text-gray',
			container:'swal2-has-bg',
			actions:'w-100'
		},
		showCancelButton: true,
		buttonsStyling: false,
		confirmButtonText: script_trans.attr('data-trans-change-ok'),
		cancelButtonText: script_trans.attr('data-trans-change-no'),
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
            IAHandle.LoadDetailIA('detail', {'done_ia': true}, 'done_ia')
		}
	})
})
