const employee_current = $('#employee_current').text()
const emp_current_id = employee_current ? JSON.parse(employee_current)?.['id'] : ''
const script_url = $('#script-url')
const script_trans = $('#script-trans')
const urlParams = new URLSearchParams(window.location.search);
const TYPE = urlParams.get('type');
// for so
const supplier_so = $('#supplier-so')
const contact_so = $('#contact-so')
const deliveryDate_so = $('#date-delivery-so')
const lineDetailTable_so = $('#datatable-pr-product-so')
const modalSelectSaleOrder = $('#modal-select-sale-order')
const tableSaleOrder = $('#datatable-sale-order')
const tableSaleOrderProduct = $('#datatable-product-of-so')
const btnSelectSOProduct = $('#btn-select-so-product')
// for sf
const supplier_sf = $('#supplier-sf')
const contact_sf = $('#contact-sf')
const deliveryDate_sf = $('#date-delivery-sf')
const lineDetailTable_sf = $('#datatable-pr-product-stock-free')
const btnAddSFProduct = $('#btn-add-stock-free-product')
// for fa
const supplier_fa = $('#supplier-fa')
const contact_fa = $('#contact-fa')
const deliveryDate_fa = $('#date-delivery-fa')
const lineDetailTable_fa = $('#datatable-pr-product-fixed-asset')
const btnAddFAProduct = $('#btn-add-fixed-asset-product')
// for db
const supplier_db = $('#supplier-db')
const contact_db = $('#contact-db')
const deliveryDate_db = $('#date-delivery-db')
const lineDetailTable_db = $('#datatable-pr-product-distribution')
const modalSelectDistribution = $('#modal-select-distribution')
const tableDistribution = $('#datatable-distribution')
const tableDistributionProduct = $('#datatable-product-of-distribution')
const btnSelectDBProduct = $('#btn-select-distribution-product')

function LoadSupplier(ele, data) {
    ele.initSelect2({
        ajax: {
            url: ele.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i].account_type.includes('Supplier')) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'account_sale_list',
        keyId: 'id',
        keyText: 'name',
    }).on('change', function () {
        let selected = SelectDDControl.get_data_from_idx(ele, ele.val())
        if (selected) {
            let contact_owner = selected?.['owner']
            if (TYPE === '0' || $('#request-for-so').attr('data-type') === '0') {
                LoadContactOwner(contact_so, contact_owner)
            }
            else if (TYPE === '1' || $('#request-for-sf').attr('data-type') === '1') {
                LoadContactOwner(contact_sf, contact_owner)
            }
            else if (TYPE === '2' || $('#request-for-sf').attr('data-type') === '1') {
                LoadContactOwner(contact_fa, contact_owner)
            }
            else if (TYPE === '3' || $('#request-for-db').attr('data-type') === '3') {
                LoadContactOwner(contact_db, contact_owner)
            }
        }
    })
}

function LoadContactOwner(ele, data) {
    ele.empty()
    ele.initSelect2({
        data: (data ? data : null),
        keyId: 'id',
        keyText: 'fullname',
    })
}

function LoadDeliveryDate(ele) {
    ele.daterangepicker({
        singleDatePicker: true,
        timepicker: false,
        showDropdowns: false,
        minYear: 2023,
        locale: {
            format: 'DD/MM/YYYY',
        },
        maxYear: parseInt(moment().format('YYYY'), 10),
        autoApply: true,
        autoUpdateInput: false,
    }).on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY'));
    }).val('');
}

function LoadProductLineDetail(ele, data) {
    ele.initSelect2({
        ajax: {
            url: script_url.attr('data-url-product'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            console.log(resp.data[keyResp])
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i]?.['product_choice'].includes(2)) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'product_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function() {
        let product_selected = SelectDDControl.get_data_from_idx(ele, ele.val())
        ele.closest('tr').find('.product-des-detail').text(product_selected?.['description'])
        LoadUOMLineDetail(
            ele.closest('tr').find('.product-uom-detail'),
            product_selected?.['general_uom_group']?.['id'],
            product_selected?.['purchase_information']?.['default_uom']
        )
        LoadTaxLineDetail(ele.closest('tr').find('.tax-detail'), product_selected?.['purchase_information']?.['tax'])
    })
}

function LoadUOMLineDetail(ele, group_id, data) {
    if (group_id) {
        ele.initSelect2({
            ajax: {
                data: {
                    'group': group_id
                },
                url: script_url.attr('data-url-uom'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'unit_of_measure',
            keyId: 'id',
            keyText: 'title',
        })
    }
}

function LoadTaxLineDetail(ele, data) {
    ele.initSelect2({
        allowClear: true,
        ajax: {
            url: script_url.attr('data-url-tax'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'tax_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function() {
        calculate_line_detail_table(ele.closest('tr'))
    })
}

function LoadLineDetailTable(ele, product_datas=[], disabled='') {
    ele.DataTable().clear().destroy()
    ele.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        scrollX: true,
        scrollCollapse: true,
        data: product_datas,
        columns: [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span data-so-product-id="${row?.['sale_order_product_id']}" data-id="${row?.['id']}" class="w-30 badge badge-soft-primary product-detail">${row?.['code']}</span>&nbsp;<span>${row?.['title']}</span>`;
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-xs btn-light" data-bs-toggle="tooltip" data-bs-placement="top" title="${row?.['description'] ? row?.['description'] : ''}">
                                <i class="fa-solid fa-circle-info"></i> ${script_trans.attr('data-trans-description')}
                            </button>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span data-id="${row?.['uom_id']}" class="product-uom-detail">${row?.['uom_title']}</span>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="request-number-detail">${row?.['request_number']}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<input ${disabled} class="form-control mask-money text-right unit-price-detail" value="${row?.['unit_price'] ? row?.['unit_price'] : 0}">`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<select data-tax-id="${row?.['tax_id']}"
                                    data-tax-code="${row?.['tax_code']}"
                                    data-tax-title="${row?.['tax_title']}"
                                    data-tax-rate="${row?.['tax_rate']}"
                                    ${disabled} class="form-select select2 tax-detail"></select>`;
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<input class="form-control mask-money text-right subtotal-detail" disabled readonly value="${row?.['sub_total_price'] ? row?.['sub_total_price'] : 0}">`
                }
            },
        ],
        initComplete: function () {
            if (product_datas.length > 0) {
                ele.find('tbody tr').each(function (index) {
                    if ($(this).find('.tax-detail').attr('data-tax-id') !== 'undefined') {
                        LoadTaxLineDetail(
                            $(this).find('.tax-detail'),
                            {
                                'id': $(this).find('.tax-detail').attr('data-tax-id'),
                                'code': $(this).find('.tax-detail').attr('data-tax-code'),
                                'title': $(this).find('.tax-detail').attr('data-tax-title'),
                                'rate': $(this).find('.tax-detail').attr('data-tax-rate'),
                            }
                        )
                    }
                    else {
                        LoadTaxLineDetail(
                            $(this).find('.tax-detail'),
                            product_datas[index]?.['tax'] ? product_datas[index]?.['tax'] : null
                        )
                    }
                })
            }
        }
    });
}

function LoadLineDetailTableAddRow(ele, product_datas=[], disabled='') {
    ele.DataTable().clear().destroy()
    ele.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        scrollX: true,
        scrollCollapse: true,
        data: product_datas,
        columns: [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<select ${disabled} class="form-select select2 product-detail"></select>`;
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="small product-des-detail">${row?.['description'] ? row?.['description'] : ''}</span>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<select ${disabled} class="form-select select2 product-uom-detail"></select>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<input ${disabled} type="number" class="form-control request-number-detail" value="${row?.['request_number'] ? row?.['request_number'] : 0}">`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<input ${disabled} class="form-control mask-money text-right unit-price-detail" value="${row?.['unit_price'] ? row?.['unit_price'] : 0}">`
                }
            },
            {
                className: 'w-15',
                render: () => {
                    return `<select ${disabled} class="form-select select2 tax-detail"></select>`;
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<input class="form-control mask-money text-right subtotal-detail" disabled readonly value="${row?.['sub_total_price'] ? row?.['sub_total_price'] : 0}">`
                }
            },
            {
                className: 'text-center',
                'render': () => {
                    return `<button class="btn-del-line-detail btn text-danger btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                }
            },
        ],
        initComplete: function () {
            if (product_datas.length > 0) {
                ele.find('tbody tr').each(function (index) {
                    LoadProductLineDetail(
                        $(this).find('.product-detail'),
                        {
                            'id': product_datas[index]?.['id'],
                            'code': product_datas[index]?.['code'],
                            'title': product_datas[index]?.['title'],
                        }
                    )
                    LoadUOMLineDetail(
                        $(this).find('.product-uom-detail'),
                        product_datas[index]?.['uom_group_id'],
                        {
                            'id': product_datas[index]?.['uom_id'],
                            'title': product_datas[index]?.['uom_title'],
                        }
                    )
                    LoadTaxLineDetail($(this).find('.tax-detail'), product_datas[index]?.['tax'])
                })
            }
        }
    });
}

function LoadSaleOrderTable(is_all_so=false) {
    $('#self-so').prop('hidden', is_all_so)
    $('#all-so').prop('hidden', !is_all_so)
    tableSaleOrder.DataTable().clear().destroy()
    let data_param = is_all_so ? {
        'system_status': 3,
    } : {
        'system_status': 3,
        'employee_inherit_id': emp_current_id
    }
    tableSaleOrder.DataTableDefault({
        useDataServer: true,
        rowIdx: true,
        scrollY: '25vh',
        scrollX: true,
        ajax: {
            url: tableSaleOrder.attr('data-url'),
            data: data_param,
            type: 'GET',
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && resp.data.hasOwnProperty('sale_order_list')) {
                    let sale_order_list = [];
                    resp.data['sale_order_list'].map(function (item) {
                        if (item?.['is_create_purchase_request']) {
                            sale_order_list.push(item);
                        }
                    })
                    return sale_order_list;
                }
                throw Error('Call data raise errors.')
            },
        },
        columns: [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            }, {
                className: 'w-5',
                render: (data, type, row) => {
                    return `<span class="form-check"><input type="radio" name="radioSaleOrder" class="form-check-input inp-check-so" data-id="${row?.['id']}"/></span>`
                }
            }, {
                className: 'w-45',
                render: (data, type, row) => {
                    return `<span class="badge badge-primary p-so-code">${row?.['code']}</span><br><span class="text-primary">${row?.['title']}</span>`
                }
            }, {
                className: 'w-45',
                render: (data, type, row) => {
                   let group = row?.['employee_inherit']?.['group']?.['title']
                    return `<span class="badge badge-light">${row?.['employee_inherit']?.['code']}</span><br><span class="text-muted">${row?.['employee_inherit']?.['full_name']} ${group ? '(' + group + ')' : ''}</span>`
                }
            }
        ],
    });
}

function LoadSaleOrderProductTable(sale_order_id=null) {
    tableSaleOrderProduct.DataTable().clear().destroy()
    if (!sale_order_id) {
        tableSaleOrderProduct.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            paging: false,
            scrollY: '30vh',
            scrollX: true,
            scrollCollapse: true,
            data: [],
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return ``
                    }
                }
            ],
        });
    }
    else {
        tableSaleOrderProduct.DataTableDefault({
            useDataServer: true,
            styleDom: 'hide-foot',
            rowIdx: true,
            paging: false,
            scrollY: '30h',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: tableSaleOrderProduct.attr('data-url').replace('/0', `/${sale_order_id}`),
                data: {},
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('so_product_list')) {
                        let product_data = []
                        for (let i = 0; i < resp.data['so_product_list']?.['product_data'].length; i++) {
                            let item = resp.data['so_product_list']?.['product_data'][i]
                            console.log(item)
                            if (item?.['product']?.['product_choice'].includes(2) && parseFloat(item?.['remain_for_purchase_request']) > 0) {
                                product_data.push(item)
                            }
                        }
                        return product_data;
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        return `<span data-so-product-id="${row?.['id']}"
                                  data-product-id="${row?.['product']?.['id']}"
                                  data-product-code="${row?.['product']?.['code']}"
                                  data-product-title="${row?.['product']?.['title']}"
                                  data-product-uom-id="${row?.['product']?.['uom']?.['id']}"
                                  data-product-uom-title="${row?.['product']?.['uom']?.['title']}"
                                  data-product-description="${row?.['product']?.['description']}"
                                  data-product-tax-id="${row?.['tax']?.['id']}"
                                  data-product-tax-code="${row?.['tax']?.['code']}"
                                  data-product-tax-title="${row?.['tax']?.['title']}"
                                  data-product-tax-rate="${row?.['tax']?.['rate']}"
                                  class="badge badge-outline badge-primary product-span"
                            >${row?.['product']?.['code']}</span><br><span class="text-secondary">${row?.['product']?.['title']}</span>`
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return `<span class="quantity-span">${row?.['product_quantity']}</span>`
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return `<span class="requested-span">${parseFloat(row?.['product_quantity']) - parseFloat(row?.['remain_for_purchase_request'])}</span>`
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return `<span class="remain-span">${row?.['remain_for_purchase_request']}</span>`
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return `<input type="number" class="form-control text-center request-number-input" value="0" max="${parseFloat(row?.['remain_for_purchase_request'])}">`
                    }
                }
            ],
        });
    }
}

function LoadDistributionTable() {
    tableDistribution.DataTable().clear().destroy()
    tableDistribution.DataTableDefault({
        useDataServer: true,
        rowIdx: true,
        scrollY: '25vh',
        scrollX: true,
        scrollCollapse: true,
        ajax: {
            url: tableDistribution.attr('data-url'),
            data: {
                'system_status': 3,
                'filter_expired': true
            },
            type: 'GET',
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && resp.data.hasOwnProperty('distribution_plan_list')) {
                    return resp.data['distribution_plan_list'];
                }
                throw Error('Call data raise errors.')
            },
        },
        columns: [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            }, {
                className: 'w-5',
                render: (data, type, row) => {
                    return `<span class="form-check"><input type="radio" name="radioSaleOrder" class="form-check-input inp-check-dp" data-id="${row?.['id']}"/></span>`
                }
            }, {
                className: 'w-45',
                render: (data, type, row) => {
                    return `<span class="badge badge-primary p-db-code">${row?.['code']}</span><br><span class="text-secondary">${row?.['title']}</span>`
                }
            }, {
                className: 'w-45',
                render: (data, type, row) => {
                   let group = row?.['employee_inherit']?.['group']?.['title']
                    return `<span class="badge badge-light">${row?.['employee_inherit']?.['code']}</span><br><span class="text-muted">${row?.['employee_inherit']?.['full_name']} ${group ? '(' + group + ')' : ''}</span>`
                }
            }
        ],
    });
}

function LoadDistributionProductTable(distribution_id=null) {
    tableDistributionProduct.DataTable().clear().destroy()
    if (!distribution_id) {
        tableDistributionProduct.DataTableDefault({
            rowIdx: true,
            paging: false,
            scrollY: '30vh',
            scrollX: true,
            scrollCollapse: true,
            data: [],
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return ``
                    }
                }
            ],
        });
    }
    else {
        tableDistributionProduct.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            paging: false,
            scrollY: '30vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: tableDistributionProduct.attr('data-url').replace('/0', `/${distribution_id}`),
                data: {},
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('distribution_plan_detail')) {
                        let product_data = resp.data['distribution_plan_detail']?.['product']
                        return [product_data]
                        // if (parseFloat(product_data?.['expected_number']) - parseFloat(product_data?.['purchase_request_number']) > 0) {
                        //     return [product_data]
                        // }
                        // return []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'w-5',
                    render: () => {
                        return ``
                    }
                },
                {
                    className: 'w-35',
                    render: (data, type, row) => {
                        return `<span data-so-product-id="${row?.['id']}"
                                  data-product-id="${row?.['id']}"
                                  data-product-code="${row?.['code']}"
                                  data-product-title="${row?.['title']}"
                                  data-product-uom-id="${row?.['uom']?.['id']}"
                                  data-product-uom-title="${row?.['uom']?.['title']}"
                                  data-product-description="${row?.['description']}"
                                  class="badge badge-outline badge-primary product-span"
                            >${row?.['code']}</span><br><span class="text-secondary">${row?.['title']}</span>`
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        let planned_quantity = parseFloat(row?.['expected_number']) * parseFloat(row?.['no_of_month'])
                        return `<span class="quantity-span">${planned_quantity}</span>`
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        let requested_quantity = parseFloat(row?.['purchase_request_number'])
                        return `<span class="requested-span">${requested_quantity}</span>`
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        let remain_quantity = (parseFloat(row?.['expected_number']) * parseFloat(row?.['no_of_month'])) - parseFloat(row?.['purchase_request_number'])
                        return `<span class="remain-span">${remain_quantity >= 0 ? remain_quantity : '(' + remain_quantity * (-1) + ')'}</span>`
                    }
                },
                {
                    className: 'text-center w-15',
                    render: (data, type, row) => {
                        return `<input type="number" class="form-control text-center request-number-input" value="0">`
                    }
                }
            ],
        });
    }
}

function calculate_line_detail_table(row) {
    let table_line_detail = row.closest('table')
    let sum_pre_tax = 0
    let sum_tax = 0
    let sum_after_tax = 0
    table_line_detail.find('tbody tr').each(function () {
        let row = $(this)
        let quantity = parseFloat(row.find('.request-number-detail').text())
        quantity = quantity ? quantity : parseFloat(row.find('.request-number-detail').val())
        quantity = quantity ? quantity : 0
        let unit_price = row.find('.unit-price-detail').attr('value') ? parseFloat(row.find('.unit-price-detail').attr('value')) : 0
        let tax_rate = row.find('.tax-detail').val() ? SelectDDControl.get_data_from_idx(row.find('.tax-detail'), row.find('.tax-detail').val())?.['rate'] : 0
        tax_rate = tax_rate ? tax_rate : 0
        let subtotal = quantity * unit_price
        let after_tax = subtotal + (subtotal * tax_rate/100)
        row.find('.subtotal-detail').attr('value', subtotal + (subtotal * tax_rate / 100))

        sum_pre_tax += subtotal
        sum_after_tax += after_tax
        sum_tax += subtotal * tax_rate/100
    })
    $('#input-product-pretax-amount').attr('value', sum_pre_tax)
    $('#input-product-taxes').attr('value', sum_tax)
    $('#input-product-total').attr('value', sum_after_tax)
    $.fn.initMaskMoney2()
}

class PurchaseRequestHandle {
    load(type, option=null) {
        if (type === '0') {
            $('.for-sale-order-request').prop('hidden', false)
            $('#request-for-so').val(script_trans.attr('data-trans-for-so')).attr('data-type', type)
            LoadDeliveryDate(deliveryDate_so)
            LoadSupplier(supplier_so)
            LoadLineDetailTable(lineDetailTable_so, [])

            let dataParam = {}
            let pr_config = $.fn.callAjax2({
                url: script_url.attr('data-url-pr-config-so'),
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('config')) {
                        return data?.['config']?.['employee_reference'] ? data?.['config']?.['employee_reference'] : [];
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([pr_config]).then(
                (results) => {
                    LoadSaleOrderTable(
                        (results[0] ? results[0] : []).some(emp => emp?.['employee']?.['id'] === emp_current_id)
                    )
                })

            LoadSaleOrderProductTable()
            if (option === 'create') {
                modalSelectSaleOrder.modal('show')
            }
        }
        else if (type === '1') {
            $('.for-stock-free-request').prop('hidden', false)
            $('#request-for-sf').val(script_trans.attr('data-trans-for-sf')).attr('data-type', type)
            LoadDeliveryDate(deliveryDate_sf)
            LoadSupplier(supplier_sf)
            LoadLineDetailTableAddRow(lineDetailTable_sf, [])
        }
        else if (type === '2') {
            $('.for-fixed-asset-request').prop('hidden', false)
            $('#request-for-fa').val(script_trans.attr('data-trans-for-fa')).attr('data-type', type)
            LoadDeliveryDate(deliveryDate_fa)
            LoadSupplier(supplier_fa)
            LoadLineDetailTableAddRow(lineDetailTable_fa, [])
        }
        else if (type === '3') {
            $('.for-distribution-request').prop('hidden', false)
            $('#request-for-db').val(script_trans.attr('data-trans-for-db')).attr('data-type', type)
            LoadDeliveryDate(deliveryDate_db)
            LoadSupplier(supplier_db)
            LoadLineDetailTable(lineDetailTable_db, [])
            LoadDistributionTable()
            LoadDistributionProductTable()
            if (option === 'create') {
                modalSelectDistribution.modal('show')
            }
        }
        WFRTControl.setWFInitialData('purchaserequest');
    }

    combinesDataSO(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title-so').val()
        frm.dataForm['delivered_date'] = moment(deliveryDate_so.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['supplier'] = supplier_so.val()
        frm.dataForm['contact'] = contact_so.val()
        frm.dataForm['request_for'] = $('#request-for-so').attr('data-type')
        frm.dataForm['sale_order'] = $('#code-so').attr('data-id')
        frm.dataForm['note'] = $('#note-so').val()
        frm.dataForm['pretax_amount'] = $('#input-product-pretax-amount').attr('value')
        frm.dataForm['taxes'] = $('#input-product-taxes').attr('value')
        frm.dataForm['total_price'] = $('#input-product-total').attr('value')
        let purchase_request_product_datas = []
        $('#datatable-pr-product-so tbody tr').each(function () {
            purchase_request_product_datas.push({
                'sale_order_product': $(this).find('.product-detail').attr('data-so-product-id'),
                'product': $(this).find('.product-detail').attr('data-id'),
                'uom': $(this).find('.product-uom-detail').attr('data-id'),
                'quantity': $(this).find('.request-number-detail').text(),
                'unit_price': $(this).find('.unit-price-detail').attr('value'),
                'tax': $(this).find('.tax-detail').val() ? $(this).find('.tax-detail').val() : null,
                'sub_total_price': $(this).find('.subtotal-detail').attr('value'),
            })
        })
        frm.dataForm['purchase_request_product_datas'] = purchase_request_product_datas
        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        // console.log(frm)
        return frm
    }

    combinesDataDP(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title-db').val()
        frm.dataForm['delivered_date'] = moment(deliveryDate_db.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['supplier'] = supplier_db.val()
        frm.dataForm['contact'] = contact_db.val()
        frm.dataForm['request_for'] = $('#request-for-db').attr('data-type')
        frm.dataForm['distribution_plan'] = $('#code-db').attr('data-id')
        frm.dataForm['note'] = $('#note-db').val()
        frm.dataForm['pretax_amount'] = $('#input-product-pretax-amount').attr('value')
        frm.dataForm['taxes'] = $('#input-product-taxes').attr('value')
        frm.dataForm['total_price'] = $('#input-product-total').attr('value')
        let purchase_request_product_datas = []
        $('#datatable-pr-product-distribution tbody tr').each(function () {
            purchase_request_product_datas.push({
                'sale_order_product': null,
                'product': $(this).find('.product-detail').attr('data-id'),
                'uom': $(this).find('.product-uom-detail').attr('data-id'),
                'quantity': $(this).find('.request-number-detail').text(),
                'unit_price': $(this).find('.unit-price-detail').attr('value'),
                'tax': $(this).find('.tax-detail').val() ? $(this).find('.tax-detail').val() : null,
                'sub_total_price': $(this).find('.subtotal-detail').attr('value'),
            })
        })
        frm.dataForm['purchase_request_product_datas'] = purchase_request_product_datas
        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        // console.log(frm)
        return frm
    }

    combinesDataSF(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title-sf').val()
        frm.dataForm['delivered_date'] = moment(deliveryDate_sf.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['supplier'] = supplier_sf.val()
        frm.dataForm['contact'] = contact_sf.val()
        frm.dataForm['request_for'] = $('#request-for-sf').attr('data-type')
        frm.dataForm['note'] = $('#note-sf').val()
        frm.dataForm['pretax_amount'] = $('#input-product-pretax-amount').attr('value')
        frm.dataForm['taxes'] = $('#input-product-taxes').attr('value')
        frm.dataForm['total_price'] = $('#input-product-total').attr('value')
        let purchase_request_product_datas = []
        $('#datatable-pr-product-stock-free tbody tr').each(function () {
            purchase_request_product_datas.push({
                'sale_order_product': null,
                'product': $(this).find('.product-detail').val(),
                'uom': $(this).find('.product-uom-detail').val(),
                'quantity': $(this).find('.request-number-detail').val(),
                'unit_price': $(this).find('.unit-price-detail').attr('value'),
                'tax': $(this).find('.tax-detail').val() ? $(this).find('.tax-detail').val() : null,
                'sub_total_price': $(this).find('.subtotal-detail').attr('value'),
            })
        })
        frm.dataForm['purchase_request_product_datas'] = purchase_request_product_datas
        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        // console.log(frm)
        return frm
    }

    combinesDataFA(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title-fa').val()
        frm.dataForm['delivered_date'] = moment(deliveryDate_fa.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['supplier'] = supplier_fa.val()
        frm.dataForm['contact'] = contact_fa.val()
        frm.dataForm['request_for'] = $('#request-for-fa').attr('data-type')
        frm.dataForm['note'] = $('#note-fa').val()
        frm.dataForm['pretax_amount'] = $('#input-product-pretax-amount').attr('value')
        frm.dataForm['taxes'] = $('#input-product-taxes').attr('value')
        frm.dataForm['total_price'] = $('#input-product-total').attr('value')
        let purchase_request_product_datas = []
        $('#datatable-pr-product-fixed-asset tbody tr').each(function () {
            purchase_request_product_datas.push({
                'sale_order_product': null,
                'product': $(this).find('.product-detail').val(),
                'uom': $(this).find('.product-uom-detail').val(),
                'quantity': $(this).find('.request-number-detail').val(),
                'unit_price': $(this).find('.unit-price-detail').attr('value'),
                'tax': $(this).find('.tax-detail').val() ? $(this).find('.tax-detail').val() : null,
                'sub_total_price': $(this).find('.subtotal-detail').attr('value'),
            })
        })
        frm.dataForm['purchase_request_product_datas'] = purchase_request_product_datas
        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        // console.log(frm)
        return frm
    }
}

function Disable(option) {
    if (option === 'detail') {
        $('.form-control').prop('readonly', true);
        $('.form-select').prop('disabled', true);
        $('.select2').prop('disabled', true);
        $('form input').prop('disabled', true);
        $('#btn-change-sale-order').prop('disabled', true);
        $('#btn-change-distribution').prop('disabled', true);
    }
}

function LoadDetailPR(option) {
    let url_loaded = $('#frm-detail-pr').attr('data-url');
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['purchase_request'];
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);

                if (data?.['request_for'] === 0) {
                    $('.for-sale-order-request').prop('hidden', false)
                    $('#request-for-so').val(script_trans.attr('data-trans-for-so')).attr('data-type', 0)
                    $('#title-so').val(data?.['title'])
                    deliveryDate_so.val(moment(data?.['delivered_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $('#pr-status-so').val(data?.['purchase_status'])
                    LoadSupplier(supplier_so, data?.['supplier'])
                    LoadContactOwner(contact_so, data?.['contact'])
                    $('#code-so').val(data?.['sale_order']?.['code'])
                    $('#note-so').val(data?.['note'])

                    let request_product_data = []
                    for (let i = 0; i < data?.['purchase_request_product_datas'].length; i++) {
                        let item = data?.['purchase_request_product_datas'][i]
                        request_product_data.push({
                            'sale_order_product_id': item?.['sale_order_product'],
                            'id': item?.['product']?.['id'],
                            'code': item?.['product']?.['code'],
                            'title': item?.['product']?.['title'],
                            'description': item?.['product']?.['description'],
                            'uom_title': item?.['uom']?.['title'],
                            'uom_id': item?.['uom']?.['id'],
                            'request_number': item?.['quantity'],
                            'tax': item?.['tax'],
                            'unit_price': item?.['unit_price'],
                            'sub_total_price': item?.['sub_total_price']
                        })
                    }
                    LoadLineDetailTable(lineDetailTable_so, request_product_data, option === 'detail' ? 'disabled readonly' : '')
                    $('#input-product-pretax-amount').attr('value', data?.['pretax_amount'])
                    $('#input-product-taxes').attr('value', data?.['taxes'])
                    $('#input-product-total').attr('value', data?.['total_price'])
                    $.fn.initMaskMoney2()
                }
                else if (data?.['request_for'] === 1) {
                    $('.for-stock-free-request').prop('hidden', false)
                    $('#request-for-sf').val(script_trans.attr('data-trans-for-sf')).attr('data-type', 1)
                    $('#title-sf').val(data?.['title'])
                    deliveryDate_sf.val(moment(data?.['delivered_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $('#pr-status-sf').val(data?.['purchase_status'])
                    LoadSupplier(supplier_sf, data?.['supplier'])
                    LoadContactOwner(contact_sf, data?.['contact'])
                    $('#note-sf').val(data?.['note'])

                    let request_product_data = []
                    for (let i = 0; i < data?.['purchase_request_product_datas'].length; i++) {
                        let item = data?.['purchase_request_product_datas'][i]
                        request_product_data.push({
                            'sale_order_product_id': item?.['sale_order_product'],
                            'id': item?.['product']?.['id'],
                            'code': item?.['product']?.['code'],
                            'title': item?.['product']?.['title'],
                            'description': item?.['product']?.['description'],
                            'uom_group_id': item?.['uom']?.['group_id'],
                            'uom_title': item?.['uom']?.['title'],
                            'uom_id': item?.['uom']?.['id'],
                            'request_number': item?.['quantity'],
                            'tax': item?.['tax'],
                            'unit_price': item?.['unit_price'],
                            'sub_total_price': item?.['sub_total_price']
                        })
                    }
                    LoadLineDetailTableAddRow(lineDetailTable_sf, request_product_data, option === 'detail' ? 'disabled readonly' : '')
                    $('#input-product-pretax-amount').attr('value', data?.['pretax_amount'])
                    $('#input-product-taxes').attr('value', data?.['taxes'])
                    $('#input-product-total').attr('value', data?.['total_price'])
                    $.fn.initMaskMoney2()
                }
                else if (data?.['request_for'] === 2) {
                    $('.for-fixed-asset-request').prop('hidden', false)
                    $('#request-for-fa').val(script_trans.attr('data-trans-for-fa')).attr('data-type', 2)
                    $('#title-fa').val(data?.['title'])
                    deliveryDate_fa.val(moment(data?.['delivered_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $('#pr-status-fa').val(data?.['purchase_status'])
                    LoadSupplier(supplier_fa, data?.['supplier'])
                    LoadContactOwner(contact_fa, data?.['contact'])
                    $('#note-fa').val(data?.['note'])

                    let request_product_data = []
                    for (let i = 0; i < data?.['purchase_request_product_datas'].length; i++) {
                        let item = data?.['purchase_request_product_datas'][i]
                        request_product_data.push({
                            'sale_order_product_id': item?.['sale_order_product'],
                            'id': item?.['product']?.['id'],
                            'code': item?.['product']?.['code'],
                            'title': item?.['product']?.['title'],
                            'description': item?.['product']?.['description'],
                            'uom_group_id': item?.['uom']?.['group_id'],
                            'uom_title': item?.['uom']?.['title'],
                            'uom_id': item?.['uom']?.['id'],
                            'request_number': item?.['quantity'],
                            'tax': item?.['tax'],
                            'unit_price': item?.['unit_price'],
                            'sub_total_price': item?.['sub_total_price']
                        })
                    }
                    LoadLineDetailTableAddRow(lineDetailTable_fa, request_product_data, option === 'detail' ? 'disabled readonly' : '')
                    $('#input-product-pretax-amount').attr('value', data?.['pretax_amount'])
                    $('#input-product-taxes').attr('value', data?.['taxes'])
                    $('#input-product-total').attr('value', data?.['total_price'])
                    $.fn.initMaskMoney2()
                }
                else if (data?.['request_for'] === 3) {
                    $('.for-distribution-request').prop('hidden', false)
                    $('#request-for-db').val(script_trans.attr('data-trans-for-db')).attr('data-type', 3)
                    $('#title-db').val(data?.['title'])
                    deliveryDate_db.val(moment(data?.['delivered_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $('#pr-status-db').val(data?.['purchase_status'])
                    LoadSupplier(supplier_db, data?.['supplier'])
                    LoadContactOwner(contact_db, data?.['contact'])
                    $('#code-db').val(data?.['distribution_plan']?.['code'])
                    $('#note-db').val(data?.['note'])

                    let request_product_data = []
                    for (let i = 0; i < data?.['purchase_request_product_datas'].length; i++) {
                        let item = data?.['purchase_request_product_datas'][i]
                        request_product_data.push({
                            'sale_order_product_id': item?.['sale_order_product'],
                            'id': item?.['product']?.['id'],
                            'code': item?.['product']?.['code'],
                            'title': item?.['product']?.['title'],
                            'description': item?.['product']?.['description'],
                            'uom_title': item?.['uom']?.['title'],
                            'uom_id': item?.['uom']?.['id'],
                            'request_number': item?.['quantity'],
                            'tax': item?.['tax'],
                            'unit_price': item?.['unit_price'],
                            'sub_total_price': item?.['sub_total_price']
                        })
                    }
                    LoadLineDetailTable(lineDetailTable_db, request_product_data, option === 'detail' ? 'disabled readonly' : '')
                    $('#input-product-pretax-amount').attr('value', data?.['pretax_amount'])
                    $('#input-product-taxes').attr('value', data?.['taxes'])
                    $('#input-product-total').attr('value', data?.['total_price'])
                    $.fn.initMaskMoney2()
                }

                new $x.cls.file($('#attachment')).init({
                    enable_download: option === 'detail',
                    enable_edit: option !== 'detail',
                    data: data.attachment,
                    name: 'attachment'
                })

                Disable(option);
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
            }
        })
}

$(document).on('change', '.inp-check-so', function () {
    $(this).closest('table').find('tr').removeClass('bg-secondary-light-5');
    $(this).closest('tr').addClass('bg-secondary-light-5');
    LoadSaleOrderProductTable($(this).attr('data-id'))
})

$(document).on('change', '.inp-check-dp', function () {
    $(this).closest('table').find('tr').removeClass('bg-secondary-light-5');
    $(this).closest('tr').addClass('bg-secondary-light-5');
    LoadDistributionProductTable($(this).attr('data-id'))
})

btnSelectSOProduct.on('click', function () {
    let request_product_data = []
    let flag = true
    tableSaleOrderProduct.find('tbody tr').each(function () {
        let limit_number = $(this).find('.remain-span').text() ? parseFloat($(this).find('.remain-span').text()) : ''
        let request_number = $(this).find('.request-number-input').val() ? parseFloat($(this).find('.request-number-input').val()) : ''

        if (limit_number && request_number && request_number <= limit_number) {
            request_product_data.push({
                'sale_order_product_id': $(this).find('.product-span').attr('data-so-product-id'),
                'id': $(this).find('.product-span').attr('data-product-id'),
                'code': $(this).find('.product-span').attr('data-product-code'),
                'title': $(this).find('.product-span').attr('data-product-title'),
                'description': $(this).find('.product-span').attr('data-product-description'),
                'uom_id': $(this).find('.product-span').attr('data-product-uom-id'),
                'uom_title': $(this).find('.product-span').attr('data-product-uom-title'),
                'tax_id': $(this).find('.product-span').attr('data-product-tax-id'),
                'tax_code': $(this).find('.product-span').attr('data-product-tax-code'),
                'tax_title': $(this).find('.product-span').attr('data-product-tax-title'),
                'tax_rate': $(this).find('.product-span').attr('data-product-tax-rate'),
                'request_number': request_number
            })
        }
        else {
            if (request_number) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Request number is invalid!',
                })
                flag = false
                request_product_data = []
            }
        }
    })
    if (flag) {
        LoadLineDetailTable(lineDetailTable_so, request_product_data)
        $('.inp-check-so').each(function () {
            if ($(this).prop('checked')) {
                $('#code-so').val($(this).closest('tr').find('.p-so-code').text()).attr('data-id', $(this).attr('data-id'))
            }
        })
        modalSelectSaleOrder.modal('hide')
    }
})

btnSelectDBProduct.on('click', function () {
    let request_product_data = []
    let flag = true
    tableDistributionProduct.find('tbody tr').each(function () {
        let limit_number = $(this).find('.remain-span').text() ? parseFloat($(this).find('.remain-span').text()) : ''
        let request_number = $(this).find('.request-number-input').val() ? parseFloat($(this).find('.request-number-input').val()) : ''

        if (limit_number && request_number && request_number <= limit_number || TYPE === '3') {
            request_product_data.push({
                'sale_order_product_id': $(this).find('.product-span').attr('data-so-product-id'),
                'id': $(this).find('.product-span').attr('data-product-id'),
                'code': $(this).find('.product-span').attr('data-product-code'),
                'title': $(this).find('.product-span').attr('data-product-title'),
                'description': $(this).find('.product-span').attr('data-product-description'),
                'uom_title': $(this).find('.product-span').attr('data-product-uom-title'),
                'uom_id': $(this).find('.product-span').attr('data-product-uom-id'),
                'request_number': request_number
            })
        }
        else {
            if (request_number) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Request number is invalid!',
                })
                flag = false
                request_product_data = []
            }
        }
    })
    if (flag) {
        LoadLineDetailTable(lineDetailTable_db, request_product_data)
        $('.inp-check-dp').each(function () {
            if ($(this).prop('checked')) {
                $('#code-db').val($(this).closest('tr').find('.p-db-code').text()).attr('data-id', $(this).attr('data-id'))
            }
        })
        modalSelectDistribution.modal('hide')
    }
})

function addRow(table, data) {
    table.DataTable().row.add(data).draw();
}

function deleteRow(table, currentRow) {
    currentRow = parseInt(currentRow) - 1
    let rowIndex = table.DataTable().row(currentRow).index();
    let row = table.DataTable().row(rowIndex);
    row.remove().draw();
}

btnAddSFProduct.on('click', function () {
    addRow(lineDetailTable_sf, {})
    let row_added = lineDetailTable_sf.find('tbody tr:last-child')
    LoadProductLineDetail(row_added.find('.product-detail'))
    LoadUOMLineDetail(row_added.find('.product-uom-detail'))
    LoadTaxLineDetail(row_added.find('.tax-detail'))
})

btnAddFAProduct.on('click', function () {
    addRow(lineDetailTable_fa, {})
    let row_added = lineDetailTable_fa.find('tbody tr:last-child')
    LoadProductLineDetail(row_added.find('.product-detail'))
    LoadUOMLineDetail(row_added.find('.product-uom-detail'))
    LoadTaxLineDetail(row_added.find('.tax-detail'))
})

$(document).on("click", '.btn-del-line-detail', function () {
    deleteRow($(this).closest('table'), parseInt($(this).closest('tr').find('td:first-child').text()))
});

$(document).on('change', '.unit-price-detail', function () {
    calculate_line_detail_table($(this).closest('tr'))
})

$(document).on('change', '.request-number-detail', function () {
    calculate_line_detail_table($(this).closest('tr'))
})

const url_create = script_url.data('url-create');

function changeHrefCreate(url_create, paramString) {
    window.location.href = url_create + "?" + paramString;
}

$(document).on('click', '#btn-create-for-sale-order', function () {
    let paramString = $.param({
        'type': '0',
    })
    changeHrefCreate(url_create, paramString);
})

$(document).on('click', '#btn-create-for-stock-free', function () {
    let paramString = $.param({
        'type': '1',
    })
    changeHrefCreate(url_create, paramString);
})

$(document).on('click', '#btn-create-for-fixed-asset', function () {
    let paramString = $.param({
        'type': '2',
    })
    changeHrefCreate(url_create, paramString);
})

$(document).on('click', '#btn-create-for-stock-plan', function () {
    let paramString = $.param({
        'type': '3',
    })
    changeHrefCreate(url_create, paramString);
})

$('.select-pr-type').on('mouseenter', function () {
    $(this).addClass('bg-secondary-light-5')
}).on('mouseleave', function () {
    $(this).removeClass('bg-secondary-light-5')
})
