const script_url = $('#script-url')
const script_trans = $('#script-trans')
const process_description_table = $('#process-description-table')
const labor_summary_labor = $('#labor-summary-table')
const add_new_process_description = $('#add-new-process-description')
const material_table = $('#material-table')
const tools_table = $('#tools-table')
const add_new_tool = $('#add-new-tool')

function addRow(table, data) {
    table.DataTable().row.add(data).draw();
}

function deleteRow(table, currentRow) {
    currentRow = parseInt(currentRow) - 1
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    row.remove().draw();
}

function loadLaborPrice(ele, labor_selected, uom_id) {
    ele.closest('tr').find('.process-unit-price').attr('value', 0)
    ele.closest('tr').find('.dropdown-menu').html(`<h6 class="dropdown-header">${script_trans.attr('data-trans-select-one')}</h6>`)
    for (let i = 0; i < labor_selected?.['price_list'].length; i++) {
        ele.closest('tr').find('.dropdown-menu').append(
            `<a class="${labor_selected?.['price_list'][i]?.['uom']?.['id'] !== uom_id ? 'disabled' : ''} labor-price-option dropdown-item border rounded mb-1" href="#">
                <div class="row">
                    <div class="col-5">
                        <span class="labor-uom badge badge-success badge-sm" data-id="${labor_selected?.['price_list'][i]?.['uom']?.['id']}">${labor_selected?.['price_list'][i]?.['uom']?.['title']}</span>                 
                    </div>
                    <div class="col-7 text-right">
                        <span class="labor-price-value text-success mask-money" data-init-money="${labor_selected?.['price_list'][i]?.['price_value']}"></span>
                    </div>
                </div>
                ${labor_selected?.['price_list'][i]?.['uom']?.['id'] !== uom_id ? `<span class="fst-italic small">${script_trans.attr('data-trans-can-not-select')}</span>` : ''}
            </a>`
        )
    }
    $.fn.initMaskMoney2()
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
        keyResp: 'labor_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        if (ele.val()) {
            let labor_selected = SelectDDControl.get_data_from_idx(ele, ele.val())
            loadUOM(ele.closest('tr').find('.process-uom'), labor_selected?.['uom_group']?.['id'])
            loadLaborPrice(ele, labor_selected, ele.closest('tr').find('.process-uom').val())

            let this_row = ele.closest('tr')
            if (ele.val() && this_row.find('.process-uom').val() && this_row.find('.process-quantity').val()) {
                update_labor_summary_table()
            }
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
    }).on('change', function () {
        if (ele.val()) {
            let product_selected = SelectDDControl.get_data_from_idx(ele, ele.val())
            ele.closest('tr').find('.material-code').text(product_selected?.['code'])
            loadUOM(ele.closest('tr').find('.material-uom'), product_selected?.['general_uom_group']?.['id'])
        }
    })
}

function loadTool(ele, data) {
    let dataParam = {}
    let ajax = $.fn.callAjax2({
        url: script_url.attr('data-url-tool-config'),
        data: dataParam,
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('product_type')) {
                return data?.['product_type'];
            }
            return {};
        },
        (errs) => {
            console.log(errs);
        }
    )

    Promise.all([ajax]).then(
        (results) => {
            let tool_type_id = results[0]?.['id']
            if (tool_type_id) {
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
                                if (prd_type?.['id'] === tool_type_id) {
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
                }).on('change', function () {
                    if (ele.val()) {
                        let tool_selected = SelectDDControl.get_data_from_idx(ele, ele.val())
                        ele.closest('tr').find('.tool-code').text(tool_selected?.['code'])
                        loadUOM(ele.closest('tr').find('.tool-uom'), tool_selected?.['general_uom_group']?.['id'])
                    }
                })
            }
        })
}

function loadProcessDescriptionTable(data_list=[], option='create') {
    process_description_table.DataTable().clear().destroy()
    process_description_table.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
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
                    return `<textarea required ${option === 'detail' ? 'disabled readonly' : ''} class="form-control process-task-name"></textarea>`;
                }
            },
            {
                'render': () => {
                    return `<select required ${option === 'detail' ? 'disabled' : ''} class="form-select select2 process-labor"></select>`;
                }
            },
            {
                'render': () => {
                    return `<input required ${option === 'detail' ? 'disabled readonly' : ''} type="number" class="form-control process-quantity" value="0">`;
                }
            },
            {
                'render': () => {
                    return `<select required ${option === 'detail' ? 'disabled' : ''} class="form-select select2 process-uom"></select>`;
                }
            },
            {
                'render': () => {
                    return `
                        <div class="input-group">
                            <input required disabled readonly class="form-control mask-money process-unit-price" value="0">
                            <a href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="input-group-text"><i class="bi bi-three-dots-vertical"></i></span>
                            </a>
                            <div class="dropdown-menu position-fixed overflow-y-scroll"></div>
                        </div>
                    `;
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
                    return `<button ${option === 'detail' ? 'disabled' : ''} type="button" class="btn del-row-process"><i class="fas fa-trash-alt text-secondary"></i></button>`;
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

function loadLaborSummaryTable(data_list=[], option='create') {
    labor_summary_labor.DataTable().clear().destroy()
    labor_summary_labor.DataTableDefault({
        dom: '',
        reloadCurrency: true,
        paging: false,
        data: data_list,
        columns: [
            {
                'render': (data, type, row) => {
                    return `<span class="labor-summary-labor-${row?.['labor']?.['id']}-${row?.['uom']?.['id']}">${row?.['labor']?.['title']}</span>`;
                }
            },
            {
                'render': (data, type, row) => {
                    return `<span class="labor-summary-quantity">${row?.['quantity']}</span>`;
                }
            },
            {
                'render': (data, type, row) => {
                    return `<span class="labor-summary-uom">${row?.['uom']?.['title']}</span>`;
                }
            },
            {
                'render': (data, type, row) => {
                    return `<span class="labor-summary-unit-price mask-money" data-init-money="${row?.['unit_price']}"></span>`;
                }
            },
            {
                'render': (data, type, row) => {
                    return `<span class="labor-summary-subtotal-price mask-money" data-init-money="${row?.['subtotal_price']}"></span>`;
                }
            },
        ]
    })
}

class BORHandle {
    load(option) {
        loadProcessDescriptionTable()
        loadLaborSummaryTable()
    }
}

//// COMMON

function reload_index_for_material_and_tool_table() {
    material_table.find('tbody tr').each(function (index) {
        $(this).find('td:eq(0)').text(parseInt(index) + 1)
    })
    tools_table.find('tbody tr').each(function (index) {
        $(this).find('td:eq(0)').text(parseInt(index) + 1)
    })
}

//// PROCESS

add_new_process_description.on('click', function () {
    addRow(process_description_table, {})
    let row_added = process_description_table.find('tbody tr:last-child')
    loadLabor(row_added.find('.process-labor'))
})

function calculate_process_table(row) {
    let quantity = row.find('.process-quantity').val() ? parseFloat(row.find('.process-quantity').val()) : 0
    let unit_price = row.find('.process-unit-price').attr('value') ? parseFloat(row.find('.process-unit-price').attr('value')) : 0
    let subtotal = quantity * unit_price
    row.find('.process-subtotal-price').attr('value', subtotal)
    $.fn.initMaskMoney2()
}

$(document).on("change", '.process-task-name', function () {
    let process_row_index = parseInt($(this).closest('tr').find('td:eq(0)').text())
    let process_task_name = $(this).closest('tr').find('.process-task-name').val()
    if ($(this).val()) {
        add_material_group(process_row_index, process_task_name)
        add_tool_group(process_row_index, process_task_name)
    }
    else {
        remove_material_group(process_row_index)
        remove_tool_group(process_row_index)
    }
})

$(document).on("change", '.process-quantity', function () {
    let this_row = $(this).closest('tr')
    calculate_process_table(this_row)
    if (this_row.find('.process-labor').val() && this_row.find('.process-uom').val()) {
        update_labor_summary_table()
        process_description_table.DataTable().draw(false)
    }
})

$(document).on("change", '.process-uom', function () {
    let this_row = $(this).closest('tr')
    let labor_selected = SelectDDControl.get_data_from_idx(this_row.find('.process-labor'), this_row.find('.process-labor').val())
    loadLaborPrice(this_row.find('.process-labor'), labor_selected, $(this).val())

    if (this_row.find('.process-labor').val() && this_row.find('.process-uom').val()) {
        update_labor_summary_table()
        process_description_table.DataTable().draw(false)
    }
})

$(document).on("click", '.labor-price-option', function () {
    loadUOM(
        $(this).closest('tr').find('.process-uom'),
        null,
        {
            'id': $(this).find('.labor-uom').attr('data-id'),
            'title': $(this).find('.labor-uom').text()
        }
    )
    let labor_price_value = $(this).find('.labor-price-value').attr('data-init-money')
    $(this).closest('tr').find('.process-unit-price').attr('value', labor_price_value)
    calculate_process_table($(this).closest('tr'))
    update_labor_summary_table()
    $.fn.initMaskMoney2()
})

$(document).on("click", '.del-row-process', function () {
    let row_index = $(this).closest('tr').find('td:eq(0)').text()
    deleteRow($(this).closest('table'), row_index)
    remove_material_group(row_index)
    remove_tool_group(row_index)
    reload_index_for_material_and_tool_table()
})

function update_labor_summary_table() {
    loadLaborSummaryTable()
    process_description_table.find('tbody tr').each(function () {
        let this_row = $(this)
        let this_labor = this_row.find('.process-labor')
        let this_uom = this_row.find('.process-uom')
        let this_quantity = this_row.find('.process-quantity').val() ? parseFloat(this_row.find('.process-quantity').val()) : 0
        let this_unit_price = parseFloat(this_row.find('.process-unit-price').attr('value'))
        if (this_labor.val() && this_uom.val() && this_quantity !== 0 && this_unit_price !== 0) {
            let labor_selected = SelectDDControl.get_data_from_idx(this_labor, this_labor.val())
            let uom_selected = SelectDDControl.get_data_from_idx(this_uom, this_uom.val())
            let this_subtotal_price = parseFloat(this_row.find('.process-subtotal-price').attr('value'))
            let row_labor_summary = $(`.labor-summary-labor-${this_labor.val()}-${this_uom.val()}`).closest('tr')
            if (row_labor_summary.length > 0) {
                let old_quantity = parseFloat(row_labor_summary.find('.labor-summary-quantity').text())
                let old_subtotal_price = parseFloat(row_labor_summary.find('.labor-summary-subtotal-price').attr('data-init-money'))
                row_labor_summary.find('.labor-summary-quantity').text(old_quantity + this_quantity)
                row_labor_summary.find('.labor-summary-subtotal-price').attr('data-init-money', old_subtotal_price + this_subtotal_price)
            } else {
                addRow(labor_summary_labor, {
                    'labor': {
                        'id': labor_selected?.['id'],
                        'title': labor_selected?.['title'],
                    },
                    'uom': {
                        'id': uom_selected?.['id'],
                        'title': uom_selected?.['title'],
                    },
                    'quantity': this_quantity,
                    'unit_price': this_unit_price,
                    'subtotal_price': this_subtotal_price
                })
            }
        }
    })
    $.fn.initMaskMoney2()
}

//// MATERIAL

$(document).on("click", '.add-new-material', function () {
    let row_index = $(this).closest('tr').find('td:eq(0)').text()
    let new_material_row = create_material_row(row_index)
    $(this).closest('tr').after(new_material_row)
    loadProduct(new_material_row.find('.material-item'))
})

$(document).on("click", '.del-row-material', function () {
    $(this).closest('tr').remove()
})

function create_material_group_row(index, task_name) {
    return $(`
        <tr class="material-for-task-${index}">
            <td>${index}</td>
            <td colspan="9">
                <span class="material-group mr-2">${task_name}</span>
                <button type="button" class="add-new-material btn btn-icon btn-rounded btn-flush-primary flush-soft-hover">
                    <span class="icon"><i class="far fa-plus-square"></i></span>
                </button>
            </td>
        </tr>
    `)
}

function create_material_row(index) {
    return $(`
        <tr class="material-for-task-${index}">
            <td></td>
            <td><span class="badge badge-blue material-code"></span></td>
            <td><select class="form-select select2 material-item"></select></td>
            <td><input type="number" class="form-control material-quantity" value="0"></td>
            <td><select class="form-select select2 material-uom"></select></td>
            <td><input disabled readonly class="form-control mask-money material-unit-price" value="0"></td>
            <td><input disabled readonly class="form-control mask-money material-subtotal-price" value="0"></td>
            <td>
                <div class="form-check">
                    <input type="checkbox" class="form-check-input material-disassemble">
                </div>
            </td>
            <td><textarea class="form-control material-note"></textarea></td>
            <td><button type="button" class="btn del-row-material"><i class="fas fa-trash-alt text-secondary"></i></button></td>
        </tr>
    `)
}

function add_material_group(index, task_name) {
    let get_material_row_group = material_table.find(`tbody .material-for-task-${index} .material-group`)
    if (get_material_row_group.length > 0) {
        get_material_row_group.text(task_name)
    } else {
        let new_material_group_row = create_material_group_row(index, task_name)
        material_table.find('tbody').append(new_material_group_row)
    }
}

function remove_material_group(index) {
    material_table.find(`tbody .material-for-task-${index}`).closest('tr').remove()
}

//// TOOL

$(document).on("click", '.add-new-tool', function () {
    let row_index = $(this).closest('tr').find('td:eq(0)').text()
    let new_tool_row = create_tool_row(row_index)
    $(this).closest('tr').after(new_tool_row)
    loadTool(new_tool_row.find('.tool-item'))
})

$(document).on("click", '.del-row-tool', function () {
    $(this).closest('tr').remove()
})

function create_tool_group_row(index, task_name) {
    return $(`
        <tr class="tool-for-task-${index}">
            <td>${index}</td>
            <td colspan="6">
                <span class="tool-group mr-2">${task_name}</span>
                <button type="button" class="add-new-tool btn btn-icon btn-rounded btn-flush-primary flush-soft-hover">
                    <span class="icon"><i class="far fa-plus-square"></i></span>
                </button>
            </td>
        </tr>
    `)
}

function create_tool_row(index) {
    return $(`
        <tr class="tool-for-task-${index}">
            <td></td>
            <td><span class="badge badge-secondary tool-code"></span></td>
            <td><select class="form-select select2 tool-item"></select></td>
            <td><input type="number" class="form-control tool-quantity" value="0"></td>
            <td><select class="form-select select2 tool-uom"></select></td>
            <td><textarea class="form-control tool-note"></textarea></td>
            <td><button type="button" class="btn del-row-tool"><i class="fas fa-trash-alt text-secondary"></i></button></td>
        </tr>
    `)
}

function add_tool_group(index, task_name) {
    let get_tool_row_group = tools_table.find(`tbody .tool-for-task-${index} .tool-group`)
    if (get_tool_row_group.length > 0) {
        get_tool_row_group.text(task_name)
    } else {
        let new_tool_group_row = create_tool_group_row(index, task_name)
        tools_table.find('tbody').append(new_tool_group_row)
    }
}

function remove_tool_group(index) {
    tools_table.find(`tbody .tool-for-task-${index}`).closest('tr').remove()
}
