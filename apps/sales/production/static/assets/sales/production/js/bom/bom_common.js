const script_url = $('#script-url')
const script_trans = $('#script-trans')
const productEle = $('#product')
const priceEle = $('#price')
const timeEle = $('#time')
const process_description_table = $('#process-description-table')
const labor_summary_table = $('#labor-summary-table')
const add_new_process_description = $('#add-new-process-description')
const material_table = $('#material-table')
const material_table_outsourcing = $('#material-table-outsourcing')
const tools_table = $('#tools-table')
const is_outsourcing = $('#is-outsourcing')
const add_new_outsourcing_material = $('#add-new-outsourcing-material')
const normal_production_space = $('#normal-production-space')
const outsourcing_production_space = $('#outsourcing-production-space')

//// COMMON

class BOMLoadPage {
    static LoadFinishProduct(ele, data) {
        ele.initSelect2({
            ajax: {
                url: ele.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
}

class BOMLoadTab {
    // common
    static LoadUOM(ele, group_id, data) {
        if (group_id) {
            ele.empty()
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
    // process
    static LoadProcessDescriptionTable(data_list=[], option='create') {
        process_description_table.DataTable().clear().destroy()
        process_description_table.DataTableDefault({
            styleDom: 'hide-foot',
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
                    'render': (data, type, row) => {
                        return `<textarea required ${option === 'detail' ? 'disabled readonly' : ''} class="form-control process-task-name">${row?.['task_name'] ? row?.['task_name'] : ''}</textarea>`;
                    }
                },
                {
                    'render': () => {
                        return `<select required ${option === 'detail' ? 'disabled' : ''} class="form-select select2 process-labor"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input required ${option === 'detail' ? 'disabled readonly' : ''} type="number" class="form-control process-quantity" value="${row?.['quantity'] ? row?.['quantity'] : 0}">`;
                    }
                },
                {
                    'render': () => {
                        return `<select required ${option === 'detail' ? 'disabled' : ''} class="form-select select2 process-uom"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `
                        <div class="input-group">
                            <input required disabled readonly class="form-control mask-money process-unit-price" value="${row?.['unit_price'] ? row?.['unit_price'] : 0}">
                            <a ${option === 'detail' ? 'disabled' : ''} href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="input-group-text"><i class="bi bi-three-dots-vertical"></i></span>
                            </a>
                            <div style="min-width: 300px; max-height: 400px" class="dropdown-menu position-fixed overflow-y-scroll"></div>
                        </div>
                    `;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input disabled readonly class="form-control mask-money process-subtotal-price" value="${row?.['subtotal_price'] ? row?.['subtotal_price'] : 0}">`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<textarea ${option === 'detail' ? 'disabled' : ''} class="form-control process-note">${row?.['note'] ? row?.['note'] : ''}</textarea>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''} type="button" class="btn del-row-process"><i class="fas fa-trash-alt text-secondary"></i></button>`;
                    }
                },
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    process_description_table.find('tbody tr').each(function (index) {
                        BOMLoadTab.LoadLabor($(this).find('.process-labor'), data_list[index]?.['labor'])
                        BOMLoadTab.LoadUOM($(this).find('.process-uom'), data_list[index]?.['uom']?.['group_id'], data_list[index]?.['uom'])
                        let labor_selected = data_list[index]?.['labor']
                        BOMLoadTab.LoadLaborPrice($(this).find('.process-labor'), labor_selected, $(this).find('.process-uom').val())
                    })
                }
            }
        });
    }
    static LoadLaborSummaryTable(data_list=[]) {
        labor_summary_table.DataTable().clear().destroy()
        labor_summary_table.DataTableDefault({
            dom: '',
            reloadCurrency: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    'render': (data, type, row) => {
                        return `<span data-labor-id="${row?.['labor']?.['id']}" class="labor-summary-labor labor-summary-labor-${row?.['labor']?.['id']}-${row?.['uom']?.['id']}">${row?.['labor']?.['title']}</span>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<span class="labor-summary-quantity">${row?.['quantity']}</span>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<span data-uom-ratio="${row?.['uom']?.['ratio']}" data-uom-id="${row?.['uom']?.['id']}" class="labor-summary-uom">${row?.['uom']?.['title']}</span>`;
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
    static LoadLabor(ele, data) {
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
                BOMLoadTab.LoadUOM(ele.closest('tr').find('.process-uom'), labor_selected?.['uom_group'], labor_selected?.['uom'])
                BOMLoadTab.LoadLaborPrice(ele, labor_selected, ele.closest('tr').find('.process-uom').val())
                BOMAction.Update_labor_summary_table()
                BOMAction.Calculate_BOM_sum_price()
                BOMAction.Calculate_BOM_sum_time()
            }
        })
    }
    static LoadLaborPrice(ele, labor_selected, uom_id) {
    if (ele.closest('tr').find('.process-unit-price').attr('value') === '0') {
        ele.closest('tr').find('.process-subtotal-price').attr('value', 0)
    }
    ele.closest('tr').find('.dropdown-menu').html(`<h6 class="dropdown-header">${script_trans.attr('data-trans-select-one')}</h6>`)
    for (let i = 0; i < labor_selected?.['price_list'].length; i++) {
        ele.closest('tr').find('.dropdown-menu').append(
            `<a class="${labor_selected?.['price_list'][i]?.['uom']?.['id'] !== uom_id ? 'disabled' : ''} labor-price-option dropdown-item border rounded mb-1" href="#">
                <div class="row">
                    <div class="col-12">
                        <span class="text-muted">${labor_selected?.['price_list'][i]?.['price']?.['title']}</span>                 
                    </div>
                </div>
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
    // material
    static LoadOutsourcingMaterialTable(data_list=[], option='create') {
        material_table_outsourcing.DataTable().clear().destroy()
        material_table_outsourcing.DataTableDefault({
            styleDom: 'hide-foot',
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
                    'render': (data, type, row) => {
                        return `<span class="badge badge-blue material-code">${row?.['material']?.['code']}</span>`;
                    }
                },
                {
                    'render': () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 material-item"></select>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input ${option === 'detail' ? 'disabled readonly' : ''} type="number" class="form-control material-quantity" value="${row?.['quantity'] ? row?.['quantity'] : 0}">`;
                    }
                },
                {
                    'render': () => {
                        return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 material-uom"></select>`;
                    }
                },
                {
                    className: 'text-center',
                    'render': (data, type, row) => {
                        return `<div class="form-check">
                                    <input ${option === 'detail' ? 'disabled' : ''} type="checkbox" class="form-check-input material-disassemble" ${row?.['disassemble'] ? 'checked' : ''}>
                                </div>`;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<textarea ${option === 'detail' ? 'disabled readonly' : ''} class="form-control material-note">${row?.['note'] ? row?.['note'] : ''}</textarea>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': () => {
                        return `<button ${option === 'detail' ? 'disabled' : ''} type="button" class="btn del-row-material"><i class="fas fa-trash-alt text-secondary"></i></button>`;
                    }
                },
            ],
            initComplete: function () {
                if (data_list.length > 0) {
                    material_table_outsourcing.find('tbody tr').each(function (index) {
                        BOMLoadTab.LoadMaterial($(this).find('.material-item'), data_list[index]?.['material'])
                        BOMLoadTab.LoadUOM($(this).find('.material-uom'), data_list[index]?.['uom']?.['group_id'], data_list[index]?.['uom'])
                    })
                }
            }
        });
    }
    static LoadMaterial(ele, data) {
        ele.initSelect2({
            ajax: {
                url: script_url.attr('data-url-material'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'material_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            if (ele.val()) {
                let material_selected = SelectDDControl.get_data_from_idx(ele, ele.val())
                ele.closest('tr').find('.material-code').text(material_selected?.['code'])
                BOMLoadTab.LoadUOM(ele.closest('tr').find('.material-uom'), material_selected?.['general_uom_group'], material_selected?.['sale_default_uom'])
            }
        })
    }
    // tool
    static LoadTool(ele, data) {
        ele.initSelect2({
            ajax: {
                url: script_url.attr('data-url-tool'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                return resp.data[keyResp];
            },
            data: (data ? data : null),
            keyResp: 'tool_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            if (ele.val()) {
                let tool_selected = SelectDDControl.get_data_from_idx(ele, ele.val())
                ele.closest('tr').find('.tool-code').text(tool_selected?.['code'])
                BOMLoadTab.LoadUOM(ele.closest('tr').find('.tool-uom'), tool_selected?.['general_uom_group'])
            }
        })
    }
}

class BOMAction {
    // common
    static BOMAddRow(table, data) {
        table.DataTable().row.add(data).draw();
    }
    static BOMDeleteRow(table, currentRow) {
        currentRow = parseInt(currentRow) - 1
        let rowIndex = table.DataTable().row(currentRow).index();
        let row = table.DataTable().row(rowIndex);
        row.remove().draw();
    }
    static DisableDetailPage(option) {
        if (option === 'detail') {
            $('input').prop('readonly', true).prop('disabled', true)
            $('textarea').prop('readonly', true).prop('disabled', true)
            $('select').prop('readonly', true).prop('disabled', true)
            add_new_process_description.prop('disabled', true)
            add_new_outsourcing_material.prop('disabled', true)
            $('.del-row-material').prop('disabled', true)
            $('.add-new-material').prop('disabled', true)
            $('.del-row-tool').prop('disabled', true)
            $('.add-new-tool').prop('disabled', true)
            $('.material-unit-price').closest('div').find('a').prop('disabled', true)
        }
    }
    static Reload_index_for_material_and_tool_table() {
        material_table.find('tbody .material-group').each(function (index) {
            $(this).closest('tr').find('td:eq(0)').text(parseInt(index) + 1)
        })
        tools_table.find('tbody .tool-group').each(function (index) {
            $(this).closest('tr').find('td:eq(0)').text(parseInt(index) + 1)
        })
    }
    static Calculate_BOM_sum_price() {
        let sum_price = 0
        labor_summary_table.find('tbody tr').each(function () {
            sum_price += parseFloat($(this).find('.labor-summary-subtotal-price').attr('data-init-money'))
        })
        priceEle.attr('value', sum_price)
        $.fn.initMaskMoney2()
    }
    static Calculate_BOM_sum_time() {
        let sum_time = 0
        labor_summary_table.find('tbody tr').each(function () {
            sum_time += parseFloat($(this).find('.labor-summary-quantity').text()) * parseFloat($(this).find('.labor-summary-uom').attr('data-uom-ratio'))
        })
        timeEle.val(sum_time)
    }
    // tab process
    static Calculate_process_table(row) {
        let quantity = row.find('.process-quantity').val() ? parseFloat(row.find('.process-quantity').val()) : 0
        let unit_price = row.find('.process-unit-price').attr('value') ? parseFloat(row.find('.process-unit-price').attr('value')) : 0
        let subtotal = quantity * unit_price
        row.find('.process-subtotal-price').attr('value', subtotal)
        $.fn.initMaskMoney2()
    }
    static Update_labor_summary_table() {
        BOMLoadTab.LoadLaborSummaryTable()
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
                    BOMAction.BOMAddRow(labor_summary_table, {
                        'labor': {
                            'id': labor_selected?.['id'],
                            'title': labor_selected?.['title'],
                        },
                        'uom': {
                            'id': uom_selected?.['id'],
                            'title': uom_selected?.['title'],
                            'ratio': uom_selected?.['ratio'],
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
    // tab material
    static Create_material_group_row(index, task_name) {
        return $(`
            <tr class="material-for-task-${index}">
                <td>${index}</td>
                <td colspan="7">
                    <span class="material-group mr-2">${task_name}</span>
                    <button type="button" class="add-new-material btn btn-icon btn-rounded btn-flush-primary flush-soft-hover">
                        <span class="icon"><i class="far fa-plus-square"></i></span>
                    </button>
                </td>
            </tr>
        `)
    }
    static Create_material_row(index) {
        return $(`
            <tr class="material-for-task-${index}">
                <td></td>
                <td><span class="badge badge-blue material-code"></span></td>
                <td><select class="form-select select2 material-item"></select></td>
                <td><input type="number" class="form-control material-quantity" value="0"></td>
                <td><select class="form-select select2 material-uom"></select></td>
                <td class="text-center">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input material-disassemble">
                    </div>
                </td>
                <td><textarea class="form-control material-note"></textarea></td>
                <td class="text-right"><button type="button" class="btn del-row-material"><i class="fas fa-trash-alt text-secondary"></i></button></td>
            </tr>
        `)
    }
    static Add_material_group(index, task_name) {
        let get_material_row_group = material_table.find(`tbody .material-for-task-${index} .material-group`)
        if (get_material_row_group.length > 0) {
            get_material_row_group.text(task_name)
        } else {
            let new_material_group_row = BOMAction.Create_material_group_row(index, task_name)
            material_table.find('tbody').append(new_material_group_row)
        }
    }
    static Remove_material_group(index) {
        material_table.find(`tbody .material-for-task-${index}`).closest('tr').remove()
    }
    // tab tool
    static Create_tool_group_row(index, task_name) {
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
    static Create_tool_row(index) {
        return $(`
            <tr class="tool-for-task-${index}">
                <td></td>
                <td><span class="badge badge-secondary tool-code"></span></td>
                <td><select class="form-select select2 tool-item"></select></td>
                <td><input type="number" class="form-control tool-quantity" value="0"></td>
                <td><select class="form-select select2 tool-uom"></select></td>
                <td><textarea class="form-control tool-note"></textarea></td>
                <td class="text-right"><button type="button" class="btn del-row-tool"><i class="fas fa-trash-alt text-secondary"></i></button></td>
            </tr>
        `)
    }
    static Add_tool_group(index, task_name) {
        let get_tool_row_group = tools_table.find(`tbody .tool-for-task-${index} .tool-group`)
        if (get_tool_row_group.length > 0) {
            get_tool_row_group.text(task_name)
        } else {
            let new_tool_group_row = BOMAction.Create_tool_group_row(index, task_name)
            tools_table.find('tbody').append(new_tool_group_row)
        }
    }
    static Remove_tool_group(index) {
        tools_table.find(`tbody .tool-for-task-${index}`).closest('tr').remove()
    }
}

class BOMHandle {
    static LoadPage() {
        BOMLoadPage.LoadFinishProduct(productEle)
        BOMLoadTab.LoadProcessDescriptionTable()
        BOMLoadTab.LoadLaborSummaryTable()
        // outsourcing
        BOMLoadTab.LoadOutsourcingMaterialTable()
    }
    static CombinesDataForProductionBOM(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))

        frm.dataForm['bom_type'] = 0
        frm.dataForm['product_id'] = productEle.val()
        frm.dataForm['sum_price'] = priceEle.attr('value')
        frm.dataForm['sum_time'] = timeEle.val()

        let bom_process_data = []
        let bom_summary_process_data = []
        let bom_material_component_data = []
        let bom_tool_data = []
        if (!is_outsourcing.prop('checked')) {
            process_description_table.find('tbody tr').each(function () {
                bom_process_data.push({
                    'order': $(this).find('td:eq(0)').text(),
                    'task_name': $(this).find('.process-task-name').val(),
                    'labor_id': $(this).find('.process-labor').val(),
                    'quantity': $(this).find('.process-quantity').val(),
                    'uom_id': $(this).find('.process-uom').val(),
                    'unit_price': $(this).find('.process-unit-price').attr('value'),
                    'subtotal_price': $(this).find('.process-subtotal-price').attr('value'),
                    'note': $(this).find('.process-note').val()
                })
            })
            labor_summary_table.find('tbody tr').each(function (index) {
                bom_summary_process_data.push({
                    'order': parseInt(index) + 1,
                    'labor_id': $(this).find('.labor-summary-labor').attr('data-labor-id'),
                    'quantity': $(this).find('.labor-summary-quantity').text(),
                    'uom_id': $(this).find('.labor-summary-uom').attr('data-uom-id'),
                    'unit_price': $(this).find('.labor-summary-unit-price').attr('data-init-money'),
                    'subtotal_price': $(this).find('.labor-summary-subtotal-price').attr('data-init-money'),
                })
            })
            process_description_table.find('tbody tr').each(function () {
                let process_index = $(this).find('td:eq(0)').text()
                let material_order = 0
                material_table.find(`tbody .material-for-task-${process_index}`).each(function () {
                    if ($(this).find('.material-group').length === 0) {
                        material_order += 1
                        bom_material_component_data.push({
                            'bom_process_order': process_index,
                            'order': material_order,
                            'material_id': $(this).find('.material-item').val(),
                            'quantity': $(this).find('.material-quantity').val(),
                            'uom_id': $(this).find('.material-uom').val(),
                            'disassemble': $(this).find('.material-disassemble').prop('checked'),
                            'note': $(this).find('.material-note').val(),
                        })
                    }
                })
            })
            process_description_table.find('tbody tr').each(function () {
                let process_index = $(this).find('td:eq(0)').text()
                let tool_order = 0
                tools_table.find(`tbody .tool-for-task-${process_index}`).each(function () {
                    if ($(this).find('.tool-group').length === 0) {
                        tool_order += 1
                        bom_tool_data.push({
                            'bom_process_order': process_index,
                            'order': tool_order,
                            'tool_id': $(this).find('.tool-item').val(),
                            'quantity': $(this).find('.tool-quantity').val(),
                            'uom_id': $(this).find('.tool-uom').val(),
                            'note': $(this).find('.tool-note').val(),
                        })
                    }
                })
            })
        }
        else {
            frm.dataForm['for_outsourcing'] = true
            material_table_outsourcing.find(`tbody tr`).each(function (index) {
                bom_material_component_data.push({
                    'order': index+1,
                    'material_id': $(this).find('.material-item').val(),
                    'quantity': $(this).find('.material-quantity').val(),
                    'uom_id': $(this).find('.material-uom').val(),
                    'disassemble': $(this).find('.material-disassemble').prop('checked'),
                    'note': $(this).find('.material-note').val(),
                })
            })
        }

        frm.dataForm['bom_process_data'] = bom_process_data
        frm.dataForm['bom_summary_process_data'] = bom_summary_process_data
        frm.dataForm['bom_material_component_data'] = bom_material_component_data
        frm.dataForm['bom_tool_data'] = bom_tool_data

        console.log(frm.dataForm)
        return frm
    }
    static LoadDetailBOM(option) {
    let url_loaded = $('#form-detail-bom').attr('data-url');
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['bom_detail'];
                WFRTControl.setWFRuntimeID(data?.['bom_detail']);
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);
                console.log(data)

                BOMLoadPage.LoadFinishProduct(productEle, data?.['product'])
                priceEle.attr('value', data?.['sum_price'])
                timeEle.val(data?.['sum_time'])

                if (!data?.['for_outsourcing']) {
                    BOMLoadTab.LoadProcessDescriptionTable(data?.['bom_process_data'], option)
                    BOMLoadTab.LoadLaborSummaryTable(data?.['bom_summary_process_data'])

                    for (let i = 0; i < data?.['bom_process_data'].length; i++) {
                        let process_row_index = i + 1
                        let process_task_name = data?.['bom_process_data'][i]?.['task_name']
                        BOMAction.Add_material_group(process_row_index, process_task_name)
                        BOMAction.Add_tool_group(process_row_index, process_task_name)

                        for (let j = 0; j < data?.['bom_material_component_data'].length; j++) {
                            if (process_row_index === parseInt(data?.['bom_material_component_data'][j]?.['bom_process_order'])) {
                                let new_material_row = BOMAction.Create_material_row(process_row_index)
                                material_table.append(new_material_row)
                                let material_selected = data?.['bom_material_component_data'][j]?.['material']
                                BOMLoadTab.LoadMaterial(new_material_row.find('.material-item'), material_selected)
                                new_material_row.find('.material-code').text(material_selected?.['code'])
                                new_material_row.find('.material-quantity').val(data?.['bom_material_component_data'][j]?.['quantity'])
                                BOMLoadTab.LoadUOM(
                                    new_material_row.find('.material-uom'),
                                    data?.['bom_material_component_data'][j]?.['uom']?.['group_id'],
                                    data?.['bom_material_component_data'][j]?.['uom']
                                )
                                new_material_row.find('.material-disassemble').prop('checked', data?.['bom_material_component_data'][j]?.['disassemble'])
                                new_material_row.find('.material-note').val(data?.['bom_material_component_data'][j]?.['note'])
                                new_material_row.find('.del-row-material').prop('disabled', option === 'detail')
                            }
                        }

                        for (let k = 0; k < data?.['bom_tool_data'].length; k++) {
                            if (process_row_index === parseInt(data?.['bom_tool_data'][k]?.['bom_process_order'])) {
                                let new_tool_row = BOMAction.Create_tool_row(process_row_index)
                                tools_table.append(new_tool_row)
                                let tool_selected = data?.['bom_tool_data'][k]?.['tool']
                                BOMLoadTab.LoadTool(new_tool_row.find('.tool-item'), tool_selected)
                                new_tool_row.find('.tool-code').text(tool_selected?.['code'])
                                new_tool_row.find('.tool-quantity').val(data?.['bom_tool_data'][k]?.['quantity'])
                                BOMLoadTab.LoadUOM(
                                    new_tool_row.find('.tool-uom'),
                                    data?.['bom_tool_data'][k]?.['uom']?.['group_id'],
                                    data?.['bom_tool_data'][k]?.['uom']
                                )
                                new_tool_row.find('.tool-note').val(data?.['bom_tool_data'][k]?.['note'])
                                new_tool_row.find('.del-row-tool').prop('disabled', option === 'detail')
                            }
                        }
                    }
                }
                else {
                    is_outsourcing.prop('checked', true)
                    normal_production_space.prop('hidden', true)
                    outsourcing_production_space.prop('hidden', false)
                    material_table.find('tbody').html('')
                    tools_table.find('tbody').html('')
                    priceEle.attr('value', 0)
                    timeEle.val(0)
                    $.fn.initMaskMoney2()
                    BOMLoadTab.LoadOutsourcingMaterialTable(data?.['bom_material_component_data'], option)
                }

                $.fn.initMaskMoney2()
                BOMAction.DisableDetailPage(option);
            }
        })
}
}

// COMMON
is_outsourcing.on('change', function () {
    Swal.fire({
		html:
		'<h5 class="text-danger">Do you want to change?</h5><p>This action can not undo.</p>',
		customClass: {
			confirmButton: 'btn btn-outline-secondary text-danger',
			cancelButton: 'btn btn-outline-secondary text-gray',
			container:'swal2-has-bg',
			actions:'w-100'
		},
		showCancelButton: true,
		buttonsStyling: false,
		confirmButtonText: 'Change',
		cancelButtonText: 'No',
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
            normal_production_space.prop('hidden', is_outsourcing.prop('checked'))
            outsourcing_production_space.prop('hidden', !is_outsourcing.prop('checked'))
            BOMLoadTab.LoadOutsourcingMaterialTable()
            BOMLoadTab.LoadProcessDescriptionTable()
            BOMLoadTab.LoadLaborSummaryTable()
            material_table.find('tbody').html('')
            tools_table.find('tbody').html('')
            priceEle.attr('value', 0)
            timeEle.val(0)
            $.fn.initMaskMoney2()
		}
        else {
            let check = is_outsourcing.prop('checked')
            is_outsourcing.prop('checked', !check)
        }
	})
})

// PROCESS
add_new_process_description.on('click', function () {
    BOMAction.BOMAddRow(process_description_table, {})
    let row_added = process_description_table.find('tbody tr:last-child')
    BOMLoadTab.LoadLabor(row_added.find('.process-labor'))
})

$(document).on("click", '.del-row-process', function () {
    let row_index = $(this).closest('tr').find('td:eq(0)').text()
    BOMAction.BOMDeleteRow($(this).closest('table'), row_index)
    BOMAction.Remove_material_group(row_index)
    BOMAction.Remove_tool_group(row_index)
    BOMAction.Reload_index_for_material_and_tool_table()
    BOMAction.Update_labor_summary_table()
    BOMAction.Calculate_BOM_sum_price()
    BOMAction.Calculate_BOM_sum_time()
})

$(document).on("change", '.process-task-name', function () {
    let process_row_index = parseInt($(this).closest('tr').find('td:eq(0)').text())
    let process_task_name = $(this).closest('tr').find('.process-task-name').val()
    if ($(this).val()) {
        BOMAction.Add_material_group(process_row_index, process_task_name)
        BOMAction.Add_tool_group(process_row_index, process_task_name)
    }
    else {
        BOMAction.Remove_material_group(process_row_index)
        BOMAction.Remove_tool_group(process_row_index)
    }
})

$(document).on("change", '.process-quantity', function () {
    let this_row = $(this).closest('tr')
    BOMAction.Calculate_process_table(this_row)
    BOMAction.Update_labor_summary_table()
    BOMAction.Calculate_BOM_sum_price()
    BOMAction.Calculate_BOM_sum_time()
})

$(document).on("change", '.process-uom', function () {
    let this_row = $(this).closest('tr')
    let labor_selected = SelectDDControl.get_data_from_idx(this_row.find('.process-labor'), this_row.find('.process-labor').val())
    BOMLoadTab.LoadLaborPrice(this_row.find('.process-labor'), labor_selected, $(this).val())
    BOMAction.Update_labor_summary_table()
    BOMAction.Calculate_BOM_sum_price()
})

$(document).on("click", '.labor-price-option', function () {
    let this_row = $(this).closest('tr')
    this_row.find('.process-unit-price').attr('value', $(this).find('.labor-price-value').attr('data-init-money'))
    BOMAction.Calculate_process_table($(this).closest('tr'))
    BOMAction.Update_labor_summary_table()
    BOMAction.Calculate_BOM_sum_price()
    BOMAction.Calculate_BOM_sum_time()
    $.fn.initMaskMoney2()
})

// MATERIAL
$(document).on("click", '.add-new-material', function () {
    let row_index = $(this).closest('tr').find('td:eq(0)').text()
    let new_material_row = BOMAction.Create_material_row(row_index)
    $(this).closest('tr').after(new_material_row)
    BOMLoadTab.LoadMaterial(new_material_row.find('.material-item'))
})

$(document).on("click", '.del-row-material', function () {
    $(this).closest('tr').remove()
})

// TOOL
$(document).on("click", '.add-new-tool', function () {
    let row_index = $(this).closest('tr').find('td:eq(0)').text()
    let new_tool_row = BOMAction.Create_tool_row(row_index)
    $(this).closest('tr').after(new_tool_row)
    BOMLoadTab.LoadTool(new_tool_row.find('.tool-item'))
})

$(document).on("click", '.del-row-tool', function () {
    $(this).closest('tr').remove()
})

// OUTSOURCING

add_new_outsourcing_material.on('click', function () {
    BOMAction.BOMAddRow(material_table_outsourcing, {})
    let row_added = material_table_outsourcing.find('tbody tr:last-child')
    BOMLoadTab.LoadMaterial(row_added.find('.material-item'))
})
