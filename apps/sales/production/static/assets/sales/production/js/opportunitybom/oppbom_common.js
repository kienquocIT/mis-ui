const script_url = $('#script-url')
const script_trans = $('#script-trans')
const opp_mapped_select = $('#opportunity_id')
const employeeInheritEle = $('#employee_inherit_id')
const productEle = $('#product')
const priceEle = $('#price')
const timeEle = $('#time')
const process_description_table = $('#process-description-table')
const labor_summary_table = $('#labor-summary-table')
const add_new_process_description = $('#add-new-process-description')
const material_table = $('#material-table')
const tools_table = $('#tools-table')
const replacement_material_table = $('#replacement-material-table')
const replacement_material_table_warning = $('#replacement-material-table-warning')
const table_select_bom_copy = $('#table-select-bom-copy')
let REPLACEMENT_ROW = null

const select_material_table = $('#select-material-table')
const select_tool_table = $('#select-tool-table')
let MATERIAL_ROW = null
let TOOL_ROW = null

//// COMMON

class OpportunityBOMLoadPage {
    static LoadInherit(ele, data) {
        if (data) {
            ele.initSelect2({
                data: data,
                keyId: 'id',
                keyText: 'full_name',
            }).trigger('change')
        }
        else {
            ele.empty()
        }
    }
    static LoadFinishGoodsAndServices(ele, data) {
        ele.initSelect2({
            ajax: {
                data: {'get_finished_goods_and_services': true},
                url: ele.attr('data-url'),
                method: 'GET',
            },
            callbackDataResp: function (resp, keyResp) {
                let res = []
                let existed = []
                for (let i = 0; i < resp.data[keyResp].length; i++) {
                    if (!existed.includes(resp.data[keyResp][i]?.['id'])) {
                        res.push(resp.data[keyResp][i])
                        existed.push(resp.data[keyResp][i]?.['id'])
                    }
                }
                return res;
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
}

class OpportunityBOMLoadTab {
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
    static LoadBOMCopyTable() {
        table_select_bom_copy.DataTable().clear().destroy()
        table_select_bom_copy.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            scrollX: '100vw',
            scrollY: '60vh',
            scrollCollapse: true,
            reloadCurrency: true,
            ajax: {
                url: table_select_bom_copy.attr('data-url'),
                data: {'system_status': 3},
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['bom_list'] ? resp.data['bom_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-5',
                    'render': (data, type, row) => {
                        return `<div class="form-check">
                            <input data-id="${row?.['id']}" type="radio" name="bom-copy-group" class="bom-copy-selected form-check-input">
                        </div>`;
                    }
                },
                {
                    className: 'w-30',
                    'render': (data, type, row) => {
                        return `<span class="badge badge-light">${row?.['code']}</span> ${row?.['title']}`;
                    }
                },
                {
                    className: 'w-30',
                    'render': (data, type, row) => {
                        return `<span class="badge badge-soft-primary">${row?.['product']?.['code']}</span> ${row?.['product']?.['title']}`;
                    }
                },
                {
                    className: 'w-30',
                    'render': (data, type, row) => {
                        if (row?.['opportunity']?.['id']) {
                            return `<span class="badge badge-soft-blue">${row?.['opportunity']?.['code']}</span> ${row?.['opportunity']?.['title']}`;
                        }
                        return '--'
                    }
                },
            ]
        });
    }
    // process
    static LoadProcessDescriptionTable(data_list=[], option='create') {
        process_description_table.DataTable().clear().destroy()
        process_description_table.DataTableDefault({
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
            scrollCollapse: true,
            data: data_list,
            columns: [
                {
                    className: 'text-center',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': (data, type, row) => {
                        return `<input required ${option === 'detail' ? 'disabled readonly' : ''} class="form-control process-task-name" value="${row?.['task_name'] ? row?.['task_name'] : ''}">`;
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
                        return `<textarea ${option === 'detail' ? 'disabled' : ''} class="form-control process-note small">${row?.['note'] ? row?.['note'] : ''}</textarea>`;
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
                        OpportunityBOMLoadTab.LoadLabor($(this).find('.process-labor'), data_list[index]?.['labor'])
                        OpportunityBOMLoadTab.LoadUOM($(this).find('.process-uom'), data_list[index]?.['uom']?.['group_id'], data_list[index]?.['uom'])
                        let labor_selected = data_list[index]?.['labor']
                        OpportunityBOMLoadTab.LoadLaborPrice($(this).find('.process-labor'), labor_selected, $(this).find('.process-uom').val())
                    })
                }
            }
        });
    }
    static LoadLaborSummaryTable(data_list=[]) {
        labor_summary_table.DataTable().clear().destroy()
        labor_summary_table.DataTableDefault({
            dom: 't',
            reloadCurrency: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    className: 'text-left',
                    'render': (data, type, row) => {
                        return `<span data-labor-id="${row?.['labor']?.['id']}" class="labor-summary-labor labor-summary-labor-${row?.['labor']?.['id']}-${row?.['uom']?.['id']}">${row?.['labor']?.['title']}</span>`;
                    }
                },
                {
                    className: 'text-center',
                    'render': (data, type, row) => {
                        return `<span class="labor-summary-quantity">${parseFloat(row?.['quantity'].toFixed(2))}</span>`;
                    }
                },
                {
                    className: 'text-center',
                    'render': (data, type, row) => {
                        return `<span data-uom-ratio="${row?.['uom']?.['ratio']}" data-uom-id="${row?.['uom']?.['id']}" class="labor-summary-uom">${row?.['uom']?.['title']}</span>`;
                    }
                },
                {
                    className: 'text-right',
                    'render': (data, type, row) => {
                        return `<span class="labor-summary-unit-price mask-money" data-init-money="${row?.['unit_price']}"></span>`;
                    }
                },
                {
                    className: 'text-right',
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
                OpportunityBOMLoadTab.LoadUOM(ele.closest('tr').find('.process-uom'), labor_selected?.['uom_group'], labor_selected?.['uom'])
                OpportunityBOMLoadTab.LoadLaborPrice(ele, labor_selected, ele.closest('tr').find('.process-uom').val())
                OpportunityBOMAction.Update_labor_summary_table()
                OpportunityBOMAction.Calculate_BOM_sum_price()
                OpportunityBOMAction.Calculate_BOM_sum_time()
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
    static LoadMaterialTable() {
        material_table.DataTable().clear().destroy()
        material_table.DataTableDefault({
            dom: "t",
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
            scrollCollapse: true,
            data: [],
            columns: [
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
            ],
            initComplete: function () {}
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
                ele.closest('tr').find('.add-new-swap-material').attr('data-root-material-id', material_selected?.['id'])
                if (material_selected?.['has_bom']) {
                    ele.closest('tr').find('.material-code').text(material_selected?.['code']).attr('class', 'badge btn-gradient-primary material-code w-100')
                    let is_opp_bom = material_selected?.['is_opp_bom']
                    let url = script_url.attr('data-url-bom-detail').replace('/0', `/${material_selected?.['bom_id']}`)
                    if (is_opp_bom) (
                        url = script_url.attr('data-url-opp-bom-detail').replace('/0', `/${material_selected?.['bom_id']}`)
                    )
                    ele.closest('tr').find('.material-code').closest('a').attr('href', url).removeClass('disabled')
                }
                else {
                    ele.closest('tr').find('.material-code').text(material_selected?.['code']).attr('class', 'badge badge-light material-code w-100')
                    ele.closest('tr').find('.material-code').closest('a').attr('href', '').addClass('disabled')
                }
                OpportunityBOMLoadTab.LoadUOM(ele.closest('tr').find('.material-uom'), material_selected?.['general_uom_group'], material_selected?.['inventory_uom'])
                ele.closest('tr').find('.material-unit-price').attr('value', material_selected?.['standard_price'])
                let quantity = parseFloat(ele.closest('tr').find('.material-quantity').val())
                ele.closest('tr').find('.material-subtotal-price').attr('value', parseFloat(material_selected?.['standard_price']) * quantity)
                $.fn.initMaskMoney2()
            }
        })
    }
    static LoadMaterialSelectTable(selected_list=[]) {
        select_material_table.DataTable().clear().destroy()
        select_material_table.DataTableDefault({
            useDataServer: true,
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
            scrollY: '65vh',
            scrollCollapse: true,
            ajax: {
                url: select_material_table.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['material_list'] ? resp.data['material_list'].filter(function (item) {
                            return !selected_list.includes(item.id)
                        }) : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'text-center',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'text-center',
                    'render': (data, type, row) => {
                        return `<div class="form-check">
                                    <input type="checkbox"
                                        data-material-id="${row?.['id']}"
                                        data-material-code="${row?.['code']}"
                                        data-material-title="${row?.['title']}"
                                        data-material-standard-price="${row?.['standard_price']}"
                                        class="form-check-input material-checkbox">
                                    <label class="form-check-label"></label>
                                </div>`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<span class="badge badge-light w-100">${row?.['code']}</span>`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<span class="text-muted">${row?.['title']}</span>`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<input disabled type="number" value="0" class="form-control material-quantity">`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<select disabled data-group-id="${row?.['general_uom_group']}" class="form-select select2 material-uom"></select>`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<input disabled type="number" value="${row?.['standard_price']}" class="form-control material-unit-price">`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<input disabled type="number" value="0" class="form-control material-subtotal-price">`;
                    }
                },
                {
                    className: 'text-center',
                    'render': () => {
                        return `<div class="form-check">
                                    <input type="checkbox" disabled class="form-check-input material-disassemble">
                                </div>`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<textarea disabled class="form-control material-note small"></textarea>`;
                    }
                },
            ],
            initComplete: function () {
                select_material_table.find('tbody tr').each(function () {
                    OpportunityBOMLoadTab.LoadUOM($(this).find('.material-uom'), $(this).find('.material-uom').attr('data-group-id'))
                })
                for (let i = 0; i < selected_list.length; i++) {
                    select_material_table.find('tbody tr').each(function () {
                        if ($(this).find('.material-checkbox').attr('data-material-id') === selected_list[i]?.['material_id']) {
                            $(this).find('.material-checkbox').prop('checked', true)
                            $(this).find('.material-quantity').val(selected_list[i]?.['quantity']).prop('disabled', false)
                            $(this).find('.material-uom').prop('disabled', false)
                            OpportunityBOMLoadTab.LoadUOM($(this).find('.material-uom'), selected_list[i]?.['uom_data']?.['group_id'], selected_list[i]?.['uom_data'])
                            $(this).find('.material-disassemble').prop('disabled', false).prop('checked', selected_list[i]?.['disassemble'])
                            $(this).find('.material-note').val(selected_list[i]?.['note']).prop('disabled', false)
                        }
                    })
                }
            }
        });
    }
    static LoadMaterialReplacementTable(data_list=[], root_material_id=null, selected_list=[]) {
        replacement_material_table.DataTable().clear().destroy()
        if (root_material_id) {
            replacement_material_table_warning.prop('hidden', true)
            replacement_material_table.DataTableDefault({
                useDataServer: true,
                dom: 't',
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                scrollX: '100vw',
                scrollY: '50vh',
                scrollCollapse: true,
                ajax: {
                    url: replacement_material_table.attr('data-url'),
                    type: 'GET',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['material_list'] ? resp.data['material_list'].filter(function (item) {
                                return item.id !== root_material_id
                            }) : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'text-center',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'text-center',
                        'render': (data, type, row) => {
                            return `<div class="form-check">
                                        <input type="checkbox" data-material-id="${row?.['id']}" class="form-check-input replacement-checkbox">
                                        <label class="form-check-label"></label>
                                    </div>`;
                        }
                    },
                    {
                        className: '',
                        'render': (data, type, row) => {
                            return `<span class="badge badge-light w-100">${row?.['code']}</span>`;
                        }
                    },
                    {
                        className: '',
                        'render': (data, type, row) => {
                            return `${row?.['title']}`;
                        }
                    },
                    {
                        className: '',
                        'render': (data, type, row) => {
                            return `<input disabled type="number" value="0" class="form-control replacement-quantity">`;
                        }
                    },
                    {
                        className: '',
                        'render': (data, type, row) => {
                            return `<select disabled data-group-id="${row?.['general_uom_group']}" class="form-select select2 replacement-uom"></select>`;
                        }
                    },
                    {
                        className: 'text-center',
                        'render': () => {
                            return `<div class="form-check">
                                        <input type="checkbox" disabled class="form-check-input replacement-material-disassemble">
                                    </div>`;
                        }
                    },
                    {
                        className: '',
                        'render': (data, type, row) => {
                            return `<textarea disabled class="form-control replacement-note"></textarea>`;
                        }
                    },
                ],
                initComplete: function () {
                    replacement_material_table.find('tbody tr').each(function () {
                        OpportunityBOMLoadTab.LoadUOM($(this).find('.replacement-uom'), $(this).find('.replacement-uom').attr('data-group-id'))
                    })
                    for (let i = 0; i < selected_list.length; i++) {
                        replacement_material_table.find('tbody tr').each(function () {
                            if ($(this).find('.replacement-checkbox').attr('data-material-id') === selected_list[i]?.['material_id']) {
                                $(this).find('.replacement-checkbox').prop('checked', true)
                                $(this).find('.replacement-quantity').val(selected_list[i]?.['quantity']).prop('disabled', false)
                                $(this).find('.replacement-uom').prop('disabled', false)
                                OpportunityBOMLoadTab.LoadUOM($(this).find('.replacement-uom'), selected_list[i]?.['uom_data']?.['group_id'], selected_list[i]?.['uom_data'])
                                $(this).find('.replacement-material-disassemble').prop('disabled', false).prop('checked', selected_list[i]?.['disassemble'])
                                $(this).find('.replacement-note').val(selected_list[i]?.['note']).prop('disabled', false)
                            }
                        })
                    }
                }
            });
        }
        else {
            replacement_material_table_warning.prop('hidden', false)
            replacement_material_table.DataTableDefault({
                useDataServer: false,
                dom: 't',
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                scrollX: '100vw',
                scrollY: '50vh',
                scrollCollapse: true,
                data: [],
                columns: [
                    {
                        className: 'text-center',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'text-center',
                        'render': (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        className: '',
                        'render': (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        className: '',
                        'render': (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        className: '',
                        'render': (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        className: '',
                        'render': (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        className: '',
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: '',
                        'render': (data, type, row) => {
                            return `<textarea disabled class="form-control replacement-note"></textarea>`;
                        }
                    },
                ],
                initComplete: function () {}
            });
        }
    }
    // tool
    static LoadToolTable() {
        tools_table.DataTable().clear().destroy()
        tools_table.DataTableDefault({
            dom: "t",
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
            scrollCollapse: true,
            data: [],
            columns: [
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
                {
                    'render': () => {
                        return ``;
                    }
                },
            ],
            initComplete: function () {}
        });
    }
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
                OpportunityBOMLoadTab.LoadUOM(ele.closest('tr').find('.tool-uom'), tool_selected?.['general_uom_group'])
            }
        })
    }
    static LoadToolSelectTable(selected_list=[]) {
        select_tool_table.DataTable().clear().destroy()
        select_tool_table.DataTableDefault({
            useDataServer: true,
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
            scrollY: '65vh',
            scrollCollapse: true,
            ajax: {
                url: select_tool_table.attr('data-url'),
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['tool_list'] ? resp.data['tool_list'].filter(function (item) {
                            return !selected_list.includes(item.id)
                        }) : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    className: 'text-center',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'text-center',
                    'render': (data, type, row) => {
                        return `<div class="form-check">
                                    <input type="checkbox"
                                        data-tool-id="${row?.['id']}"
                                        data-tool-code="${row?.['code']}"
                                        data-tool-title="${row?.['title']}"
                                        class="form-check-input tool-checkbox">
                                    <label class="form-check-label"></label>
                                </div>`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<span class="badge badge-light w-100">${row?.['code']}</span>`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<span class="text-muted">${row?.['title']}</span>`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<input disabled type="number" value="0" class="form-control tool-quantity">`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<select disabled data-group-id="${row?.['general_uom_group']}" class="form-select select2 tool-uom"></select>`;
                    }
                },
                {
                    className: '',
                    'render': (data, type, row) => {
                        return `<textarea disabled class="form-control tool-note small"></textarea>`;
                    }
                },
            ],
            initComplete: function () {
                select_tool_table.find('tbody tr').each(function () {
                    OpportunityBOMLoadTab.LoadUOM($(this).find('.tool-uom'), $(this).find('.tool-uom').attr('data-group-id'))
                })
                for (let i = 0; i < selected_list.length; i++) {
                    select_tool_table.find('tbody tr').each(function () {
                        if ($(this).find('.tool-checkbox').attr('data-tool-id') === selected_list[i]?.['tool_id']) {
                            $(this).find('.tool-checkbox').prop('checked', true)
                            $(this).find('.tool-quantity').val(selected_list[i]?.['quantity']).prop('disabled', false)
                            $(this).find('.tool-uom').prop('disabled', false)
                            OpportunityBOMLoadTab.LoadUOM($(this).find('.tool-uom'), selected_list[i]?.['uom_data']?.['group_id'], selected_list[i]?.['uom_data'])
                            $(this).find('.tool-note').val(selected_list[i]?.['note']).prop('disabled', false)
                        }
                    })
                }
            }
        });
    }
}

class OpportunityBOMAction {
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
            $('form input').prop('readonly', true).prop('disabled', true)
            $('form textarea').prop('readonly', true).prop('disabled', true)
            $('form select').prop('disabled', true)
            add_new_process_description.prop('disabled', true)
            $('.del-row-material').prop('disabled', true)
            $('.add-new-material').prop('disabled', true)
            $('.del-row-tool').prop('disabled', true)
            $('.add-new-tool').prop('disabled', true)
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
        material_table.find('tbody tr').each(function () {
                sum_price += $(this).find('.material-subtotal-price').attr('value') ? parseFloat($(this).find('.material-subtotal-price').attr('value')) : 0
            })
        priceEle.attr('value', sum_price)
        $.fn.initMaskMoney2()
    }
    static Calculate_BOM_sum_time() {
        let sum_time = 0
        labor_summary_table.find('tbody tr').each(function () {
            sum_time += parseFloat($(this).find('.labor-summary-quantity').text()) * parseFloat($(this).find('.labor-summary-uom').attr('data-uom-ratio'))
        })
        timeEle.val(parseFloat(sum_time.toFixed(2)))
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
        OpportunityBOMLoadTab.LoadLaborSummaryTable()
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
                    OpportunityBOMAction.BOMAddRow(labor_summary_table, {
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
                <td class="text-center">${index}</td>
                <td colspan="9">
                    <span class="material-group mr-2">${task_name}</span>
                    <button type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#select-material-modal"
                            class="add-new-material btn btn-icon btn-rounded btn-flush-primary flush-soft-hover">
                        <span class="icon"><i class="far fa-plus-square"></i></span>
                    </button>
                </td>
            </tr>
        `)
    }
    static Create_material_row(index) {
        return $(`
            <tr class="material-for-task-${index}">
                <td class="text-center">
                    <button type="button"
                            class="btn btn-icon btn-rounded btn-soft-secondary btn-xs add-new-swap-material"
                            data-bs-toggle="modal"
                            data-bs-target="#replacement-material-modal">
                        <span class="icon"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Add replacement material/component">
                              <i class="fas fa-retweet fa-fw"></i>
                        </span>
                    </button>
                    <script class="replacement-material-script"></script>
                </td>
                <td>
                    <a target="_blank"><span class="badge badge-light material-code w-100"></span></a>
                </td>
                <td><select class="form-select select2 material-item"></select></td>
                <td><input type="number" class="form-control material-quantity" value="0"></td>
                <td><select class="form-select select2 material-uom"></select></td>
                <td><input disabled readonly class="form-control mask-money material-unit-price" value="0"></td>
                <td><input disabled readonly class="form-control mask-money material-subtotal-price" value="0"></td>
                <td class="text-center">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input material-disassemble">
                    </div>
                </td>
                <td><textarea class="form-control material-note small"></textarea></td>
                <td class="text-right"><button type="button" class="btn del-row-material"><i class="fas fa-trash-alt text-secondary"></i></button></td>
            </tr>
        `)
    }
    static Add_or_Update_material_group(index, task_name) {
        let get_material_row_group = material_table.find(`tbody .material-for-task-${index} `)
        if (get_material_row_group.length > 0) {
            get_material_row_group.find('.material-group').text(task_name)
        } else {
            let new_material_group_row = OpportunityBOMAction.Create_material_group_row(index, task_name)
            material_table.find(`tbody`).append(new_material_group_row)
        }
    }
    static Remove_material_group(index) {
        material_table.find(`tbody .material-for-task-${index}`).closest('tr').remove()
        material_table.find('tbody tr').each(function () {
            let this_class_row = parseInt($(this).attr('class').slice(-1))
            if (this_class_row > parseInt(index)) {
                $(this).attr('class', `material-for-task-${this_class_row-1}`)
            }
        })
    }
    // tab tool
    static Create_tool_group_row(index, task_name) {
        return $(`
            <tr class="tool-for-task-${index}">
                <td class="text-center">${index}</td>
                <td colspan="6">
                    <span class="tool-group mr-2">${task_name}</span>
                    <button type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#select-tool-modal"
                            class="add-new-tool btn btn-icon btn-rounded btn-flush-primary flush-soft-hover">
                        <span class="icon"><i class="far fa-plus-square"></i></span>
                    </button>
                </td>
            </tr>
        `)
    }
    static Create_tool_row(index) {
        return $(`
            <tr class="tool-for-task-${index}">
                <td class="text-center"></td>
                <td><span class="badge badge-light tool-code w-100"></span></td>
                <td><select class="form-select select2 tool-item"></select></td>
                <td><input type="number" class="form-control tool-quantity" value="0"></td>
                <td><select class="form-select select2 tool-uom"></select></td>
                <td><textarea class="form-control tool-note small"></textarea></td>
                <td class="text-right"><button type="button" class="btn del-row-tool"><i class="fas fa-trash-alt text-secondary"></i></button></td>
            </tr>
        `)
    }
    static Add_or_Update_tool_group(index, task_name) {
        let get_tool_row_group = tools_table.find(`tbody .tool-for-task-${index}`)
        if (get_tool_row_group.length > 0) {
            get_tool_row_group.find('.tool-group').text(task_name)
        } else {
            let new_tool_group_row = OpportunityBOMAction.Create_tool_group_row(index, task_name)
            tools_table.find(`tbody`).append(new_tool_group_row)
        }
    }
    static Remove_tool_group(index) {
        tools_table.find(`tbody .tool-for-task-${index}`).closest('tr').remove()
        tools_table.find('tbody tr').each(function () {
            let this_class_row = parseInt($(this).attr('class').slice(-1))
            if (this_class_row > parseInt(index)) {
                $(this).attr('class', `tool-for-task-${this_class_row-1}`)
            }
        })
    }
}

class OpportunityBOMHandle {
    static LoadPage() {
        OpportunityBOMLoadPage.LoadFinishGoodsAndServices(productEle)
        OpportunityBOMLoadTab.LoadProcessDescriptionTable()
        OpportunityBOMLoadTab.LoadLaborSummaryTable()
        // material
        OpportunityBOMLoadTab.LoadMaterialTable()
        // tool
        OpportunityBOMLoadTab.LoadToolTable()
    }
    static CombinesBOMData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))
        frm.dataForm['bom_type'] = 4
        frm.dataForm['opportunity_id'] = opp_mapped_select.val()

        frm.dataForm['product_id'] = productEle.val()
        frm.dataForm['sum_price'] = priceEle.attr('value')
        frm.dataForm['sum_time'] = timeEle.val()

        let bom_process_data = []
        let bom_summary_process_data = []
        let bom_material_component_data = []
        let bom_tool_data = []

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
                        'standard_price': $(this).find('.material-unit-price').attr('value'),
                        'subtotal_price': $(this).find('.material-subtotal-price').attr('value'),
                        'uom_id': $(this).find('.material-uom').val(),
                        'disassemble': $(this).find('.material-disassemble').prop('checked'),
                        'note': $(this).find('.material-note').val(),
                        'replacement_data': $(this).find('.replacement-material-script').text() ? JSON.parse($(this).find('.replacement-material-script').text()) : []
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

        frm.dataForm['bom_process_data'] = bom_process_data
        frm.dataForm['bom_summary_process_data'] = bom_summary_process_data
        frm.dataForm['bom_material_component_data'] = bom_material_component_data
        frm.dataForm['bom_tool_data'] = bom_tool_data

        // console.log(frm.dataForm)
        return frm
    }
    static LoadDetailBOM(option) {
        let url_loaded = $('#form-detail-prj-bom').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['bom_detail'];
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);

                    new $x.cls.bastionField({
                        has_opp: true,
                        has_inherit: true,
                        data_inherit: [{
                            "id": data?.['opportunity']?.['sale_person']?.['id'],
                            "full_name": data?.['opportunity']?.['sale_person']?.['full_name'] || '',
                            "first_name": data?.['opportunity']?.['sale_person']?.['first_name'] || '',
                            "last_name": data?.['opportunity']?.['sale_person']?.['last_name'] || '',
                            "email": data?.['opportunity']?.['sale_person']?.['email'] || '',
                            "is_active": data?.['opportunity']?.['sale_person']?.['is_active'] || false,
                            "selected": true,
                        }],
                        data_opp: [{
                            "id": data?.['opportunity']?.['id'] || '',
                            "title": data?.['opportunity']?.['title'] || '',
                            "code": data?.['opportunity']?.['code'] || '',
                            "selected": true,
                        }]
                    }).init();

                    OpportunityBOMLoadPage.LoadFinishGoodsAndServices(productEle, data?.['product'])
                    priceEle.attr('value', data?.['sum_price'])
                    timeEle.val(parseFloat(data?.['sum_time'].toFixed(2)))

                    OpportunityBOMLoadTab.LoadProcessDescriptionTable(data?.['bom_process_data'], option)
                    OpportunityBOMLoadTab.LoadLaborSummaryTable(data?.['bom_summary_process_data'])

                    material_table.find('tbody').html('')
                    tools_table.find('tbody').html('')
                    for (let i = 0; i < data?.['bom_process_data'].length; i++) {
                        let process_row_index = i + 1
                        let process_task_name = data?.['bom_process_data'][i]?.['task_name']
                        OpportunityBOMAction.Add_or_Update_material_group(process_row_index, process_task_name)
                        OpportunityBOMAction.Add_or_Update_tool_group(process_row_index, process_task_name)

                        for (let j = 0; j < data?.['bom_material_component_data'].length; j++) {
                            if (process_row_index === parseInt(data?.['bom_material_component_data'][j]?.['bom_process_order'])) {
                                let new_material_row = OpportunityBOMAction.Create_material_row(process_row_index)
                                material_table.append(new_material_row)
                                let material_selected = data?.['bom_material_component_data'][j]
                                new_material_row.find('.add-new-swap-material').attr('data-root-material-id', material_selected?.['material']?.['id'])
                                new_material_row.find('.replacement-material-script').text(material_selected?.['replacement_data'] ? JSON.stringify(material_selected?.['replacement_data']) : '[]')
                                OpportunityBOMLoadTab.LoadMaterial(new_material_row.find('.material-item'), material_selected?.['material'])
                                new_material_row.find('.material-code').text(material_selected?.['material']?.['code'])
                                new_material_row.find('.material-quantity').val(material_selected?.['quantity'])
                                new_material_row.find('.material-unit-price').attr('value', material_selected?.['standard_price'])
                                new_material_row.find('.material-subtotal-price').attr('value', material_selected?.['subtotal_price'])
                                OpportunityBOMLoadTab.LoadUOM(
                                    new_material_row.find('.material-uom'),
                                    material_selected?.['uom']?.['group_id'],
                                    material_selected?.['uom']
                                )
                                new_material_row.find('.material-disassemble').prop('checked', material_selected?.['disassemble'])
                                new_material_row.find('.material-note').val(material_selected?.['note'])
                                new_material_row.find('.del-row-material').prop('disabled', option === 'detail')
                            }
                        }

                        for (let k = 0; k < data?.['bom_tool_data'].length; k++) {
                            if (process_row_index === parseInt(data?.['bom_tool_data'][k]?.['bom_process_order'])) {
                                let new_tool_row = OpportunityBOMAction.Create_tool_row(process_row_index)
                                tools_table.append(new_tool_row)
                                let tool_selected = data?.['bom_tool_data'][k]
                                OpportunityBOMLoadTab.LoadTool(new_tool_row.find('.tool-item'), tool_selected?.['tool'])
                                new_tool_row.find('.tool-code').text(tool_selected?.['tool']?.['code'])
                                new_tool_row.find('.tool-quantity').val(tool_selected?.['quantity'])
                                OpportunityBOMLoadTab.LoadUOM(
                                    new_tool_row.find('.tool-uom'),
                                    tool_selected?.['uom']?.['group_id'],
                                    tool_selected?.['uom']
                                )
                                new_tool_row.find('.tool-note').val(tool_selected?.['note'])
                                new_tool_row.find('.del-row-tool').prop('disabled', option === 'detail')
                            }
                        }
                    }

                    $.fn.initMaskMoney2()
                    OpportunityBOMAction.DisableDetailPage(option);
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                }
            })
    }
}

// COMMON

function Clean_MaterialTable_ToolTable() {
    if (material_table.find('tbody tr').length === 0) {
        OpportunityBOMLoadTab.LoadMaterialTable()
    }
    if (tools_table.find('tbody tr').length === 0) {
        OpportunityBOMLoadTab.LoadToolTable()
    }
}

$(document).on("change", '#opportunity_id', function () {
    let selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
    OpportunityBOMLoadPage.LoadInherit(employeeInheritEle, selected?.['sale_person'])
})

$('#btn-copy-bom').on('click', function () {
    OpportunityBOMLoadTab.LoadBOMCopyTable()
})

$(document).on("change", '.bom-copy-selected', function () {
    table_select_bom_copy.find('tbody tr').each(function () {
        $(this).removeClass('bg-primary-light-5')
    })
    $(this).closest('tr').addClass('bg-primary-light-5')
})

$(document).on("click", '#table-select-bom-copy tbody tr', function () {
    table_select_bom_copy.find('tr').each(function () {
        $(this).removeClass('bg-primary-light-5')
    })
    $(this).addClass('bg-primary-light-5')
    $(this).find('.bom-copy-selected').prop('checked', true)
})

$('#btn-accept-copy-bom').on('click', function () {
    let dataParam = {}
    let bom_copy_id = null
    table_select_bom_copy.find('tbody tr .bom-copy-selected').each(function () {
        if ($(this).prop('checked')) {
            bom_copy_id = $(this).attr('data-id')
        }
    })
    if (bom_copy_id) {
        WindowControl.showLoading()
        let bom_detail_ajax = $.fn.callAjax2({
            url: script_url.attr('data-url-bom-detail-api').replace('/0', `/${bom_copy_id}`),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('bom_detail')) {
                    return data?.['bom_detail']
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([bom_detail_ajax]).then(
            (results) => {
                let data = results[0];

                priceEle.attr('value', data?.['sum_price'])
                timeEle.val(parseFloat(data?.['sum_time'].toFixed(2)))

                OpportunityBOMLoadTab.LoadProcessDescriptionTable(data?.['bom_process_data'], 'update')
                OpportunityBOMLoadTab.LoadLaborSummaryTable(data?.['bom_summary_process_data'])

                material_table.find('tbody').html('')
                tools_table.find('tbody').html('')
                for (let i = 0; i < data?.['bom_process_data'].length; i++) {
                    let process_row_index = i + 1
                    let process_task_name = data?.['bom_process_data'][i]?.['task_name']
                    OpportunityBOMAction.Add_or_Update_material_group(process_row_index, process_task_name)
                    OpportunityBOMAction.Add_or_Update_tool_group(process_row_index, process_task_name)

                    for (let j = 0; j < data?.['bom_material_component_data'].length; j++) {
                        if (process_row_index === parseInt(data?.['bom_material_component_data'][j]?.['bom_process_order'])) {
                            let new_material_row = OpportunityBOMAction.Create_material_row(process_row_index)
                            material_table.append(new_material_row)
                            let material_selected = data?.['bom_material_component_data'][j]
                            new_material_row.find('.add-new-swap-material').attr('data-root-material-id', material_selected?.['material']?.['id'])
                            new_material_row.find('.replacement-material-script').text(material_selected?.['replacement_data'] ? JSON.stringify(material_selected?.['replacement_data']) : '[]')
                            OpportunityBOMLoadTab.LoadMaterial(new_material_row.find('.material-item'), material_selected?.['material'])
                            new_material_row.find('.material-code').text(material_selected?.['material']?.['code'])
                            new_material_row.find('.material-quantity').val(material_selected?.['quantity'])
                            new_material_row.find('.material-unit-price').attr('value', material_selected?.['standard_price'])
                            new_material_row.find('.material-subtotal-price').attr('value', material_selected?.['subtotal_price'])
                            OpportunityBOMLoadTab.LoadUOM(
                                new_material_row.find('.material-uom'),
                                material_selected?.['uom']?.['group_id'],
                                material_selected?.['uom']
                            )
                            new_material_row.find('.material-disassemble').prop('checked', material_selected?.['disassemble'])
                            new_material_row.find('.material-note').val(material_selected?.['note'])
                            new_material_row.find('.del-row-material').prop('disabled', false)
                        }
                    }

                    for (let k = 0; k < data?.['bom_tool_data'].length; k++) {
                        if (process_row_index === parseInt(data?.['bom_tool_data'][k]?.['bom_process_order'])) {
                            let new_tool_row = OpportunityBOMAction.Create_tool_row(process_row_index)
                            tools_table.append(new_tool_row)
                            let tool_selected = data?.['bom_tool_data'][k]
                            OpportunityBOMLoadTab.LoadTool(new_tool_row.find('.tool-item'), tool_selected?.['tool'])
                            new_tool_row.find('.tool-code').text(tool_selected?.['tool']?.['code'])
                            new_tool_row.find('.tool-quantity').val(tool_selected?.['quantity'])
                            OpportunityBOMLoadTab.LoadUOM(
                                new_tool_row.find('.tool-uom'),
                                tool_selected?.['uom']?.['group_id'],
                                tool_selected?.['uom']
                            )
                            new_tool_row.find('.tool-note').val(tool_selected?.['note'])
                            new_tool_row.find('.del-row-tool').prop('disabled', false)
                        }
                    }
                }

                $.fn.initMaskMoney2()

                $('#modal-select-BOM').modal('hide')
                WindowControl.hideLoading()
            })
    }
    else {
        $.fn.notifyB({description: 'Please select BOM first!'}, 'warning');
    }
})

// PROCESS

add_new_process_description.on('click', function () {
    let flag = true
    process_description_table.find('tbody tr .process-task-name').each(function () {
        if ($(this).val() === '') {
            flag = false
            return flag
        }
    })
    if (flag) {
        OpportunityBOMAction.BOMAddRow(process_description_table, {})
        let row_added = process_description_table.find('tbody tr:last-child')
        OpportunityBOMLoadTab.LoadLabor(row_added.find('.process-labor'))
    }
    else {
        $.fn.notifyB({description: 'Please fill in all "Task name" inputs first!'}, 'warning');
    }
})

$(document).on("click", '.del-row-process', function () {
    let row_index = $(this).closest('tr').find('td:eq(0)').text()
    OpportunityBOMAction.BOMDeleteRow($(this).closest('table'), row_index)
    OpportunityBOMAction.Remove_material_group(row_index)
    OpportunityBOMAction.Remove_tool_group(row_index)
    OpportunityBOMAction.Reload_index_for_material_and_tool_table()
    OpportunityBOMAction.Update_labor_summary_table()
    OpportunityBOMAction.Calculate_BOM_sum_price()
    OpportunityBOMAction.Calculate_BOM_sum_time()
    Clean_MaterialTable_ToolTable()
})

$(document).on("change", '.process-task-name', function () {
    let process_row_index = parseInt($(this).closest('tr').find('td:eq(0)').text())
    let process_task_name = $(this).closest('tr').find('.process-task-name').val()
    material_table.find('.dataTables_empty').closest('tr').remove()
    tools_table.find('.dataTables_empty').closest('tr').remove()
    OpportunityBOMAction.Add_or_Update_material_group(process_row_index, process_task_name)
    OpportunityBOMAction.Add_or_Update_tool_group(process_row_index, process_task_name)
})

$(document).on("change", '.process-quantity', function () {
    let this_row = $(this).closest('tr')
    OpportunityBOMAction.Calculate_process_table(this_row)
    OpportunityBOMAction.Update_labor_summary_table()
    OpportunityBOMAction.Calculate_BOM_sum_price()
    OpportunityBOMAction.Calculate_BOM_sum_time()
})

$(document).on("change", '.process-uom', function () {
    let this_row = $(this).closest('tr')
    let labor_selected = SelectDDControl.get_data_from_idx(this_row.find('.process-labor'), this_row.find('.process-labor').val())
    OpportunityBOMLoadTab.LoadLaborPrice(this_row.find('.process-labor'), labor_selected, $(this).val())
    OpportunityBOMAction.Update_labor_summary_table()
    OpportunityBOMAction.Calculate_BOM_sum_price()
})

$(document).on("click", '.labor-price-option', function () {
    let this_row = $(this).closest('tr')
    this_row.find('.process-unit-price').attr('value', $(this).find('.labor-price-value').attr('data-init-money'))
    OpportunityBOMAction.Calculate_process_table($(this).closest('tr'))
    OpportunityBOMAction.Update_labor_summary_table()
    OpportunityBOMAction.Calculate_BOM_sum_price()
    OpportunityBOMAction.Calculate_BOM_sum_time()
    $.fn.initMaskMoney2()
})

// MATERIAL

$(document).on("click", '.add-new-material', function () {
    MATERIAL_ROW = $(this).closest('tr')
    let selected_list = []
    material_table.find(`tbody .${MATERIAL_ROW.attr('class')}`).each(function () {
        selected_list.push($(this).find('.material-item').val())
    })
    OpportunityBOMLoadTab.LoadMaterialSelectTable(selected_list)
})

$(document).on("click", '.del-row-material', function () {
    $(this).closest('tr').remove()
    OpportunityBOMAction.Calculate_BOM_sum_price()
})

$(document).on("click", '.add-new-swap-material', function () {
    REPLACEMENT_ROW = $(this).closest('tr')
    let root_material_id = $(this).attr('data-root-material-id')
    let selected_list = REPLACEMENT_ROW.find('.replacement-material-script').text() ? JSON.parse(REPLACEMENT_ROW.find('.replacement-material-script').text()) : []
    OpportunityBOMLoadTab.LoadMaterialReplacementTable([], root_material_id, selected_list)
})

$(document).on("change", '.replacement-checkbox', function () {
    let is_checked = $(this).prop('checked')
    $(this).closest('tr').find('.replacement-quantity').val(0).prop('disabled', !is_checked)
    $(this).closest('tr').find('.replacement-uom').empty().prop('disabled', !is_checked)
    $(this).closest('tr').find('.replacement-material-disassemble').prop('checked', false).prop('disabled', !is_checked)
    $(this).closest('tr').find('.replacement-note').val('').prop('disabled', !is_checked)
})

$(document).on("change", '.material-quantity', function () {
    let unit_price = parseFloat($(this).closest('tr').find('.material-unit-price').attr('value'))
    let quantity = parseFloat($(this).val())
    $(this).closest('tr').find('.material-subtotal-price').attr('value', unit_price * quantity)
    OpportunityBOMAction.Calculate_BOM_sum_price()
    $.fn.initMaskMoney2()
})

$('#btn-get-replacement-material').on('click', function () {
    let replacement_data = []
    replacement_material_table.find('tbody tr').each(function () {
        let row = $(this)
        if (row.find('.replacement-checkbox').prop('checked')) {
            replacement_data.push({
                'material_id': row.find('.replacement-checkbox').attr('data-material-id'),
                'quantity': row.find('.replacement-quantity').val(),
                'uom_id': row.find('.replacement-uom').val(),
                'disassemble': row.find('.replacement-material-disassemble').prop('checked'),
                'note': row.find('.replacement-note').val()
            })
        }
    })
    REPLACEMENT_ROW.find('.replacement-material-script').text(JSON.stringify(replacement_data))
    $('#replacement-material-modal').modal('hide')
})

$(document).on("change", '.material-checkbox', function () {
    let is_checked = $(this).prop('checked')
    $(this).closest('tr').find('.material-quantity').val(0).prop('disabled', !is_checked)
    $(this).closest('tr').find('.material-uom').empty().prop('disabled', !is_checked)
    $(this).closest('tr').find('.material-disassemble').prop('checked', false).prop('disabled', !is_checked)
    $(this).closest('tr').find('.material-note').val('').prop('disabled', !is_checked)
})

$('#btn-get-selected-material').on('click', function () {
    select_material_table.find('tbody tr').each(function () {
        let row = $(this)
        if (row.find('.material-checkbox').prop('checked')) {
            let row_index = MATERIAL_ROW.find('td:eq(0)').text()
            let new_material_row = OpportunityBOMAction.Create_material_row(row_index)
            MATERIAL_ROW.after(new_material_row)
            new_material_row.find('.material-code').text(row.find('.material-checkbox').attr('data-material-code'))
            OpportunityBOMLoadTab.LoadMaterial(
                new_material_row.find('.material-item'),
                {
                    'id': row.find('.material-checkbox').attr('data-material-id'),
                    'code': row.find('.material-checkbox').attr('data-material-code'),
                    'title': row.find('.material-checkbox').attr('data-material-title'),
                }
            )
            new_material_row.find('.material-quantity').val(row.find('.material-quantity').val())
            OpportunityBOMLoadTab.LoadUOM(
                new_material_row.find('.material-uom'),
                row.find('.material-uom').attr('data-group-id'),
                SelectDDControl.get_data_from_idx(row.find('.material-uom'), row.find('.material-uom').val())
            )
            let quantity = parseFloat(row.find('.material-quantity').val())
            let standard_price = parseFloat(row.find('.material-checkbox').attr('data-material-standard-price'))
            new_material_row.find('.material-unit-price').attr('value', standard_price)
            new_material_row.find('.material-subtotal-price').attr('value', standard_price * quantity)
            $.fn.initMaskMoney2()
            new_material_row.find('.material-disassemble').prop('checked', row.find('.material-disassemble').prop('checked'))
            new_material_row.find('.material-note').val(row.find('.material-note').val())
            new_material_row.find('.add-new-swap-material').attr('data-root-material-id', row.find('.material-checkbox').attr('data-material-id'))
        }
    })
    $('#select-material-modal').offcanvas('hide')
})

// TOOL

$(document).on("click", '.add-new-tool', function () {
    TOOL_ROW = $(this).closest('tr')
    let selected_list = []
    tools_table.find(`tbody .${TOOL_ROW.attr('class')}`).each(function () {
        selected_list.push($(this).find('.tool-item').val())
    })
    OpportunityBOMLoadTab.LoadToolSelectTable(selected_list)
})

$(document).on("click", '.del-row-tool', function () {
    $(this).closest('tr').remove()
})

$(document).on("change", '.tool-checkbox', function () {
    let is_checked = $(this).prop('checked')
    $(this).closest('tr').find('.tool-quantity').val(0).prop('disabled', !is_checked)
    $(this).closest('tr').find('.tool-uom').empty().prop('disabled', !is_checked)
    $(this).closest('tr').find('.tool-note').val('').prop('disabled', !is_checked)
})

$('#btn-get-selected-tool').on('click', function () {
    select_tool_table.find('tbody tr').each(function () {
        let row = $(this)
        if (row.find('.tool-checkbox').prop('checked')) {
            let row_index = TOOL_ROW.find('td:eq(0)').text()
            let new_tool_row = OpportunityBOMAction.Create_tool_row(row_index)
            TOOL_ROW.after(new_tool_row)
            new_tool_row.find('.tool-code').text(row.find('.tool-checkbox').attr('data-tool-code'))
            OpportunityBOMLoadTab.LoadMaterial(
                new_tool_row.find('.tool-item'),
                {
                    'id': row.find('.tool-checkbox').attr('data-tool-id'),
                    'code': row.find('.tool-checkbox').attr('data-tool-code'),
                    'title': row.find('.tool-checkbox').attr('data-tool-title'),
                }
            )
            new_tool_row.find('.tool-quantity').val(row.find('.tool-quantity').val())
            OpportunityBOMLoadTab.LoadUOM(
                new_tool_row.find('.tool-uom'),
                row.find('.tool-uom').attr('data-group-id'),
                SelectDDControl.get_data_from_idx(row.find('.tool-uom'), row.find('.tool-uom').val())
            )
            new_tool_row.find('.tool-note').val(row.find('.tool-note').val())
        }
    })
    $('#select-tool-modal').offcanvas('hide')
})
