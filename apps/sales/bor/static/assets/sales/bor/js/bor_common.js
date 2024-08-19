const script_url = $('#script-url')
const process_description_table = $('#process-description-table')
const add_new_process_description = $('#add-new-process-description')
const material_table = $('#material-table')
const add_new_material = $('#add-new-material')

function addRow(table, data) {
    table.DataTable().row.add(data).draw();
}

function deleteRow(table, currentRow) {
    currentRow = parseInt(currentRow) - 1
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    row.remove().draw();
}

function loadLabor(ele, data) {
    ele.initSelect2({
        ajax: {
            url: script_url.attr('data-url-labor'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'expense_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        if (ele.val()) {
            let labor_selected = SelectDDControl.get_data_from_idx(ele, ele.val())
            loadUOM(ele.closest('tr').find('.process-uom'), labor_selected?.['uom_group']?.['id'])
            ele.closest('tr').find('.process-unit-price').attr('value', labor_selected?.['price_list'].length > 0 ? labor_selected?.['price_list'][0]?.['price_value'] : 0)
            $.fn.initMaskMoney2()
        }
    })
}

function loadUOM(ele, group_id, data) {
    if (group_id) {
        ele.initSelect2({
            ajax: {
                data: {
                  'group': group_id
                },
                url: script_url.attr('data-url-uom'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'unit_of_measure',
            keyId: 'id',
            keyText: 'title',
        })
    }
}

function loadProduct(ele, data) {
    ele.initSelect2({
        ajax: {
            url: script_url.attr('data-url-product'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = []
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                for (let j = 0; j < resp.data[keyResp][i]?.['general_product_types_mapped'].length; j++) {
                    let prd_type = resp.data[keyResp][i]?.['general_product_types_mapped'][j]
                    if (prd_type?.['title'] === "Nguyên vật liệu") {
                        result.push(resp.data[keyResp][i])
                        break;
                    }
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'product_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadProcessDescriptionTable(data_list=[], option='create') {
    process_description_table.DataTable().clear().destroy()
    process_description_table.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        scrollY: '35vh',
        scrollX: '100vh',
        scrollCollapse: true,
        data: data_list,
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                'render': () => {
                    return `<textarea ${option === 'detail' ? 'disabled readonly' : ''} class="form-control process-task-name"></textarea>`;
                }
            },
            {
                'render': () => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 process-labor"></select>`;
                }
            },
            {
                'render': () => {
                    return `<input ${option === 'detail' ? 'disabled readonly' : ''} type="number" class="form-control process-quantity" value="0">`;
                }
            },
            {
                'render': () => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 process-uom"></select>`;
                }
            },
            {
                'render': () => {
                    return `<input disabled readonly class="form-control mask-money process-unit-price" value="0">`;
                }
            },
            {
                'render': () => {
                    return `<input disabled readonly class="form-control mask-money process-subtotal-price" value="0">`;
                }
            },
            {
                'render': () => {
                    return `<textarea ${option === 'detail' ? 'disabled' : ''} class="form-control process-note"></textarea>`;
                }
            },
            {
                'render': () => {
                    return `<button ${option === 'detail' ? 'disabled' : ''} type="button" class="btn del-row"><i class="fas fa-trash-alt text-secondary"></i></button>`;
                }
            },
        ],
        initComplete: function () {
            if (data_list.length > 0) {
                process_description_table.find('tbody tr').each(function (index) {

                })
            }
        }
    });
}

function loadMaterialTable(data_list=[], option='create') {
    material_table.DataTable().clear().destroy()
    material_table.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        scrollY: '35vh',
        scrollX: '100vh',
        scrollCollapse: true,
        data: data_list,
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                'render': () => {
                    return `<span class="material-code"></span>`;
                }
            },
            {
                'render': () => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 material-item"></select>`;
                }
            },
            {
                'render': () => {
                    return `<input ${option === 'detail' ? 'disabled readonly' : ''} type="number" class="form-control material-quantity" value="0">`;
                }
            },
            {
                'render': () => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 material-uom"></select>`;
                }
            },
            {
                'render': () => {
                    return `<input disabled readonly class="form-control mask-money material-unit-price" value="0">`;
                }
            },
            {
                'render': () => {
                    return `<input disabled readonly class="form-control mask-money material-subtotal-price" value="0">`;
                }
            },
            {
                className: 'text-center',
                'render': () => {
                    return `<div class="form-check">
                                <input ${option === 'detail' ? 'disabled' : ''} type="checkbox" class="form-check-input material-disassemble">
                            </div>`;
                }
            },
            {
                'render': () => {
                    return `<textarea ${option === 'detail' ? 'disabled' : ''} class="form-control material-note"></textarea>`;
                }
            },
            {
                'render': () => {
                    return `<button ${option === 'detail' ? 'disabled' : ''} type="button" class="btn del-row"><i class="fas fa-trash-alt text-secondary"></i></button>`;
                }
            },
        ],
        initComplete: function () {
            if (data_list.length > 0) {
                material_table.find('tbody tr').each(function (index) {

                })
            }
        }
    });
}

class BORHandle {
    load(option) {
        loadProcessDescriptionTable()
        loadMaterialTable()
    }
}

add_new_process_description.on('click', function () {
    addRow(process_description_table, {})
    let row_added = process_description_table.find('tbody tr:last-child')
    loadLabor(row_added.find('.process-labor'))
})

add_new_material.on('click', function () {
    addRow(material_table, {})
    let row_added = material_table.find('tbody tr:last-child')
    loadProduct(row_added.find('.material-item'))
})

$(document).on("click", '.del-row', function () {
    deleteRow($(this).closest('table'), $(this).closest('tr').find('td:eq(0)').text())
})
