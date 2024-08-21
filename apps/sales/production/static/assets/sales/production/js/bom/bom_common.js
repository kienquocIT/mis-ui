const script_url = $('#script-url')
const process_description_table = $('#process-description-table')
const add_new_process_description = $('#add-new-process-description')
const material_table = $('#material-table')
const tools_table = $('#tools-table')
const add_new_tool = $('#add-new-tool')

function addRow(table, data) {
    table.DataTable().row.add(data).draw();
}

function addRowAfterRow(dtb, data, index) {
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
            calculate_process_table(ele.closest('tr'))
            $.fn.initMaskMoney2()

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
            ele.closest('tr').find('.material-unit-price').attr('value', product_selected?.['general_price'] ? product_selected?.['general_price'] : 0)
            calculate_material_table(ele.closest('tr'))
            $.fn.initMaskMoney2()
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
        dom: '<"row"<"col-12"<"blog-toolbar-right"f>>>',
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        // scrollY: '35vh',
        // scrollX: '100vh',
        // scrollCollapse: true,
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

function loadToolsTable(data_list=[], option='create') {
    tools_table.DataTable().clear().destroy()
    tools_table.DataTableDefault({
        dom: '<"row"<"col-12"<"blog-toolbar-right"f>>>',
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        // scrollY: '35vh',
        // scrollX: '100vh',
        // scrollCollapse: true,
        data: data_list,
        columns: [
            {
                'render': () => {
                    return ``;
                }
            },
            {
                'render': () => {
                    return `<span class="badge badge-secondary tool-code"></span>`;
                }
            },
            {
                'render': () => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 tool-item"></select>`;
                }
            },
            {
                'render': () => {
                    return `<input ${option === 'detail' ? 'disabled readonly' : ''} type="number" class="form-control tool-quantity" value="0">`;
                }
            },
            {
                'render': () => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 tool-uom"></select>`;
                }
            },
            {
                'render': () => {
                    return `<textarea ${option === 'detail' ? 'disabled' : ''} class="form-control tool-note"></textarea>`;
                }
            },
            {
                'render': () => {
                    return `<button ${option === 'detail' ? 'disabled' : ''} type="button" class="btn del-row-tool"><i class="fas fa-trash-alt text-secondary"></i></button>`;
                }
            },
        ],
        initComplete: function () {
            if (data_list.length > 0) {
                tools_table.find('tbody tr').each(function (index) {

                })
            }
        }
    });
}

class BORHandle {
    load(option) {
        loadProcessDescriptionTable()
        // loadMaterialTable()
        // loadToolsTable()
    }
}

function calculate_process_table(row) {
    let quantity = row.find('.process-quantity').val() ? parseFloat(row.find('.process-quantity').val()) : 0
    let unit_price = row.find('.process-unit-price').attr('value') ? parseFloat(row.find('.process-unit-price').attr('value')) : 0
    let subtotal = quantity * unit_price
    row.find('.process-subtotal-price').attr('value', subtotal)
    $.fn.initMaskMoney2()
}

function calculate_material_table(row) {
    let quantity = row.find('.material-quantity').val() ? parseFloat(row.find('.material-quantity').val()) : 0
    let unit_price = row.find('.material-unit-price').attr('value') ? parseFloat(row.find('.material-unit-price').attr('value')) : 0
    let subtotal = quantity * unit_price
    row.find('.material-subtotal-price').attr('value', subtotal)
    $.fn.initMaskMoney2()
}

add_new_process_description.on('click', function () {
    addRow(process_description_table, {})
    let row_added = process_description_table.find('tbody tr:last-child')
    loadLabor(row_added.find('.process-labor'))
})

add_new_tool.on('click', function () {
    addRow(tools_table, {})
    let row_added = tools_table.find('tbody tr:last-child')
    loadTool(row_added.find('.tool-item'))
})

function update_labor_summary_table() {
    process_description_table.find('tfoot .labor-summary-row').remove()
    process_description_table.find('tbody tr').each(function () {
        let this_row = $(this)
        let this_labor = this_row.find('.process-labor')
        let this_uom = this_row.find('.process-uom')
        let this_quantity = this_row.find('.process-quantity').val() ? parseFloat(this_row.find('.process-quantity').val()) : 0
        if (this_labor.val() && this_uom.val() && this_quantity) {
            let labor_selected = SelectDDControl.get_data_from_idx(this_labor, this_labor.val())
            let uom_selected = SelectDDControl.get_data_from_idx(this_uom, this_uom.val())
            let this_unit_price = parseFloat(this_row.find('.process-unit-price').attr('value'))
            let this_subtotal_price = parseFloat(this_row.find('.process-subtotal-price').attr('value'))
            let row_labor_summary = process_description_table.find(`tfoot tr .labor-summary-labor-${this_labor.val()}-${this_uom.val()}`).closest('tr')
            if (row_labor_summary.length > 0) {
                let old_quantity = parseFloat(row_labor_summary.find('.labor-summary-quantity').val())
                let old_subtotal_price = parseFloat(row_labor_summary.find('.labor-summary-subtotal-price').attr('value'))
                row_labor_summary.find('.labor-summary-quantity').val(old_quantity + this_quantity)
                row_labor_summary.find('.labor-summary-subtotal-price').attr('value', old_subtotal_price + this_subtotal_price)
            } else {
                process_description_table.find('tfoot').append(`
                    <tr class="labor-summary-row">
                        <td></td>
                        <td></td>
                        <td>
                            <input style="border: none; background: none" disabled readonly class="form-control labor-summary-labor-${this_labor.val()}-${this_uom.val()}" value="${labor_selected?.['title']}">
                        </td>
                        <td>
                            <input style="border: none; background: none" disabled readonly class="form-control labor-summary-quantity" value="${this_quantity}">
                        </td>
                        <td>
                            <input style="border: none; background: none" disabled readonly class="form-control labor-summary-uom" value="${uom_selected?.['title']}">
                        </td>
                        <td>
                            <input style="border: none; background: none" disabled readonly class="form-control labor-summary-unit-price mask-money" value="${this_unit_price}">
                        </td>
                        <td>
                            <input style="border: none; background: none" disabled readonly class="form-control labor-summary-subtotal-price mask-money" value="${this_subtotal_price}">
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                `)
            }
            $.fn.initMaskMoney2()
        }
    })
}

$(document).on("change", '.process-quantity', function () {
    let this_row = $(this).closest('tr')
    calculate_process_table(this_row)
    if (this_row.find('.process-labor').val() && this_row.find('.process-uom').val()) {
        update_labor_summary_table()
    }
})

$(document).on("change", '.process-uom', function () {
    let this_row = $(this).closest('tr')
    if (this_row.find('.process-labor').val() && this_row.find('.process-uom').val()) {
        update_labor_summary_table()
    }
})

$(document).on("change", '.material-quantity', function () {
    calculate_material_table($(this).closest('tr'))
})

$(document).on("click", '.del-row-process', function () {
    let row_index = $(this).closest('tr').find('td:eq(0)').text()
    deleteRow($(this).closest('table'), row_index)
})

$(document).on("click", '.del-row-material', function () {
    $(this).closest('tr').remove()
})

$(document).on("click", '.del-row-tool', function () {
    $(this).closest('tr').remove()
})

function create_material_group_row(index, param={}) {
    return $(`
        <tr>
            <td>${index}</td>
            <td colspan="9">
                <span id="material-for-task-${param?.['row_labor_material_index']}" class="material-group mr-2">${param?.['row_labor_name_material']}</span>
                <button type="button" class="add-new-material btn btn-icon btn-rounded btn-flush-primary flush-soft-hover">
                    <span class="icon"><i class="far fa-plus-square"></i></span>
                </button>
            </td>
        </tr>
    `)
}

function create_material_row() {
    return $(`
        <tr>
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

function add_material_group(this_row) {
    let index = parseInt(this_row.find('td:eq(0)').text())
    let get_material_row_group = material_table.find(`tbody #material-for-task-${index}`)
    if (get_material_row_group.length > 0) {
        get_material_row_group.text(this_row.find('.process-task-name').val())
    } else {
        let new_material_group_row = create_material_group_row(
            process_description_table.find('tbody tr').length,
            {
                'row_labor_material_index': this_row.find('td:eq(0)').text(),
                'row_labor_name_material': this_row.find('.process-task-name').val()
            }
        )
        material_table.find('tbody').append(new_material_group_row)
    }
}

$(document).on("change", '.process-task-name', function () {
    add_material_group($(this).closest('tr'))
})

$(document).on("click", '.add-new-material', function () {
    let new_material_row = create_material_row()
    $(this).closest('tr').after(new_material_row)
    loadProduct(new_material_row.find('.material-item'))
})