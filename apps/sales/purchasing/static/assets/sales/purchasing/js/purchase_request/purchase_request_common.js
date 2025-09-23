const employee_current = $('#employee_current').text()
const emp_current_id = employee_current ? JSON.parse(employee_current)?.['id'] : ''
const script_url = $('#script-url')
const script_trans = $('#script-trans')
const urlParams = new URLSearchParams(window.location.search);
const TYPE = urlParams.get('type');
const $request_for = $('#request-for')
let is_all_so = false
// for so
const supplier_so = $('#supplier-so')
const contact_so = $('#contact-so')
const deliveryDate_so = $('#date-delivery-so')
const lineDetailTable_so = $('#datatable-pr-product-so')
const modalSelectSaleOrder = $('#modal-select-sale-order')
const tableSaleOrder = $('#datatable-sale-order')
const tableSaleOrderProduct = $('#datatable-product-of-so')
const btnSelectSOProduct = $('#btn-select-so-product')
const $so_filter_by_customer = $('#so-filter-by-customer')
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
// variable
let current_so_id = null

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
            if ($request_for.val() === '0') {
                contact_so.empty()
                LoadContactOwner(contact_so, contact_owner)
            }
            else if ($request_for.val() === '1') {
                contact_sf.empty()
                LoadContactOwner(contact_sf, contact_owner)
            }
            else if ($request_for.val() === '2') {
                contact_fa.empty()
                LoadContactOwner(contact_fa, contact_owner)
            }
            else if ($request_for.val() === '3') {
                contact_db.empty()
                LoadContactOwner(contact_db, contact_owner)
            }
        }
    })
}

function LoadContactOwner(ele, data) {
    ele.initSelect2({
        ajax: {
            url: ele.attr('data-url'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'contact_list',
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

$(document).on('change', '.product-detail', function () {
    let product_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
    $(this).closest('tr').find('.product-des-detail').text(product_selected?.['description'] || '')
    UsualLoadPageFunction.LoadUOM({
        element: $(this).closest('tr').find('.product-uom'),
        data: product_selected?.['purchase_information']?.['default_uom'] || {},
        data_params: {'group_id': product_selected?.['general_uom_group']?.['id']},
        data_url: script_url.attr('data-url-uom')
    })
    UsualLoadPageFunction.LoadTax({
        element: $(this).closest('tr').find('.tax'),
        data: product_selected?.['purchase_information']?.['tax'] || {},
        data_url: script_url.attr('data-url-tax')
    })
})

function LoadLineDetailTable($table, data_list=[], option='create') {
    $table.DataTable().clear().destroy()
    $table.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        scrollX: true,
        scrollCollapse: true,
        data: data_list,
        columns: [
            {
                className: 'w-5',
                render: () => {
                    return ``
                }
            },
            {
                className: 'w-30',
                render: (data, type, row) => {
                    return `<span data-so-product-id="${row?.['sale_order_product_id'] || ''}" data-product-id="${row?.['product_data']?.['id'] || ''}" class="badge badge-soft-primary badge-sm product-detail">${row?.['product_data']?.['code'] || ''}</span>
                            <br><span class="fw-bold">${row?.['product_data']?.['title'] || ''}</span>
                            <br><span class="small">${row?.['product_data']?.['description'] || ''}</span>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="request-number">${row?.['quantity'] || 0}</span>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span data-uom-id="${row?.['uom_data']?.['id'] || ''}" class="product-uom">${row?.['uom_data']?.['title'] || ''}</span>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control mask-money unit-price" value="${row?.['unit_price'] || 0}">`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 tax"></select>`;
                }
            },
            {
                className: 'w-15 text-right',
                render: (data, type, row) => {
                    return `<input class="form-control mask-money text-right subtotal-price" disabled readonly value="${row?.['sub_total_price'] ? row?.['sub_total_price'] : 0}">`
                }
            },
        ],
        initComplete: function () {
            $table.find('tbody tr').each(function (index) {
                UsualLoadPageFunction.LoadTax({
                    element: $(this).find('.tax'),
                    data: data_list[index]?.['tax_data'] || {},
                    data_url: script_url.attr('data-url-tax')
                })
            })
        }
    });
}

function LoadLineDetailTableAddRow($table, data_list=[], option='create') {
    $table.DataTable().clear().destroy()
    $table.DataTableDefault({
        rowIdx: true,
        reloadCurrency: true,
        paging: false,
        scrollX: true,
        scrollCollapse: true,
        data: data_list,
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
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 product-detail"></select>`;
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span class="small product-des-detail">${row?.['description'] || ''}</span>`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<input ${option === 'detail' ? 'disabled' : ''} type="number" class="form-control request-number" value="${row?.['request_number'] || 0}">`
                }
            },
            {
                className: 'w-10',
                render: (data, type, row) => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 product-uom"></select>`
                }
            },
            {
                className: 'w-15',
                render: (data, type, row) => {
                    return `<input ${option === 'detail' ? 'disabled' : ''} class="form-control mask-money unit-price" value="${row?.['unit_price'] || 0}">`
                }
            },
            {
                className: 'w-15',
                render: () => {
                    return `<select ${option === 'detail' ? 'disabled' : ''} class="form-select select2 tax"></select>`;
                }
            },
            {
                className: 'w-15 text-right',
                render: (data, type, row) => {
                    return `<input class="form-control mask-money text-right subtotal-price" disabled readonly value="${row?.['sub_total_price'] || 0}">`
                }
            },
            {
                className: 'w-5 text-right',
                'render': () => {
                    return `<button ${option === 'detail' ? 'disabled' : ''} type='button' class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs btn-del-line-detail">
                                    <span class="icon"><i class="fas fa-trash"></i></span>
                                </button>`;
                }
            },
        ],
        initComplete: function () {
            if (data_list.length > 0) {
                $table.find('tbody tr').each(function (index) {
                    UsualLoadPageFunction.LoadProduct({
                        element: $(this).find('.product-detail'),
                        data: data_list[index]?.['product_data'] || {},
                        data_url: script_url.attr('data-url-product')
                    })
                    UsualLoadPageFunction.LoadUOM({
                        element: $(this).find('.product-uom'),
                        data: data_list[index]?.['uom_data'] || {},
                        data_params: {'group_id': data_list[index]?.['uom_group_id']?.['group_id']},
                        data_url: script_url.attr('data-url-uom')
                    })
                    UsualLoadPageFunction.LoadTax({
                        element: $(this).find('.tax'),
                        data: data_list[index]?.['tax_data'] || {},
                        data_url: script_url.attr('data-url-tax')
                    })
                })
            }
        }
    });
}

function LoadSaleOrderTable() {
    $('#self-so').prop('hidden', is_all_so)
    $('#all-so').prop('hidden', !is_all_so)
    tableSaleOrder.DataTable().clear().destroy()
    tableSaleOrder.DataTableDefault({
        useDataServer: true,
        rowIdx: true,
        scrollY: '45vh',
        scrollX: true,
        scrollCollapse: true,
        ajax: {
            url: tableSaleOrder.attr('data-url'),
            data: is_all_so ? {'customer_id': $so_filter_by_customer.val()} : {'customer_id': $so_filter_by_customer.val(), 'employee_inherit_id': emp_current_id},
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
                    return `<div class="form-check"><input type="radio" name="radioSaleOrder" class="form-check-input inp-check-so" data-id="${row?.['id']}"/></span>`
                }
            }, {
                className: 'w-90',
                render: (data, type, row) => {
                    let group = row?.['employee_inherit']?.['group']?.['title']
                    return `<span class="badge badge-soft-primary mr-1 so-code">${row?.['code']}</span><span class="text-primary">${row?.['title']}</span>
                            <br><span class="text-muted">${row?.['customer_data']?.['name']}</span>
                            <br><span class="text-blue">${row?.['employee_inherit']?.['full_name']} ${group ? `(${group})` : ''}</span>`
                }
            }
        ],
    });
}

function LoadSaleOrderProductTable(sale_order_id=null) {
    const table_cfg = [
        {
            className: 'w-5',
            render: () => {
                return ``
            }
        },
        {
            className: 'w-45',
            render: (data, type, row) => {
                return `<span data-so-product-id="${row?.['id']}"
                          data-product='${JSON.stringify(row?.['product_data'] || {})}'
                          data-uom='${JSON.stringify(row?.['uom_data'] || {})}'
                          data-tax='${JSON.stringify(row?.['tax_data'] || {})}'
                          class="badge badge-sm badge-soft-primary product-span"
                    >${row?.['product_data']?.['code']}</span>
                    <br><span class="text-muted">${row?.['product_data']?.['title'] || ''}</span>
                    <br><span class="text-muted small">${row?.['product_data']?.['description'] || ''}</span>`
            }
        },
        {
            className: 'w-35',
            render: (data, type, row) => {
                return `<span class="mr-1">${$.fn.gettext('Ordered')}:</span><span class="quantity-span mr-1">${row?.['product_quantity'] || 0}</span><span>${row?.['uom_data']?.['title'] || ''}</span>
                        <br><span class="mr-1">${$.fn.gettext('Requested')}:</span><span class="requested-span mr-1">${parseFloat(row?.['product_quantity'] || 0) - parseFloat(row?.['remain_for_purchase_request'] || 0)}</span><span>${row?.['uom_data']?.['title'] || ''}</span>
                        <br><span class="mr-1">${$.fn.gettext('Remain')}:</span><span class="remain-span mr-1">${row?.['remain_for_purchase_request'] || 0}</span><span>${row?.['uom_data']?.['title'] || ''}</span>`
            }
        },
        {
            className: 'text-center w-15',
            render: (data, type, row) => {
                return `<input type="number" class="form-control text-center request-number-input" value="0" max="${parseFloat(row?.['remain_for_purchase_request'] || 0)}">`
            }
        }
    ]
    tableSaleOrderProduct.DataTable().clear().destroy()
    if (!sale_order_id) {
        tableSaleOrderProduct.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            paging: false,
            scrollY: '45vh',
            scrollX: true,
            scrollCollapse: true,
            data: [],
            columns: table_cfg,
        });
    }
    else {
        tableSaleOrderProduct.DataTableDefault({
            useDataServer: true,
            styleDom: 'hide-foot',
            rowIdx: true,
            paging: false,
            scrollY: '45vh',
            scrollX: true,
            scrollCollapse: true,
            ajax: {
                url: tableSaleOrderProduct.attr('data-url').replace('0', sale_order_id),
                data: {},
                type: 'GET',
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('so_product_list')) {
                        console.log(resp.data['so_product_list']?.['product_data'])
                        return resp.data['so_product_list']?.['product_data'] || [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: table_cfg,
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
                    return `<div class="form-check"><input type="radio" name="radioSaleOrder" class="form-check-input inp-check-dp" data-id="${row?.['id']}"/></span>`
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
        let quantity = parseFloat(row.find('.request-number').text())
        quantity = quantity ? quantity : parseFloat(row.find('.request-number').val())
        quantity = quantity ? quantity : 0
        let unit_price = row.find('.unit-price').attr('value') ? parseFloat(row.find('.unit-price').attr('value')) : 0
        let tax_rate = row.find('.tax').val() ? SelectDDControl.get_data_from_idx(row.find('.tax'), row.find('.tax').val())?.['rate'] : 0
        tax_rate = tax_rate ? tax_rate : 0
        let subtotal = quantity * unit_price
        let after_tax = subtotal + (subtotal * tax_rate/100)
        row.find('.subtotal-price').attr('value', subtotal + (subtotal * tax_rate / 100))

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
    combinesDataSO(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title-so').val()
        frm.dataForm['delivered_date'] = moment(deliveryDate_so.val(), "DD/MM/YYYY").format('YYYY-MM-DD')
        frm.dataForm['supplier'] = supplier_so.val()
        frm.dataForm['contact'] = contact_so.val()
        frm.dataForm['request_for'] = $request_for.val()
        frm.dataForm['sale_order'] = current_so_id || null
        frm.dataForm['note'] = $('#note-so').val()
        frm.dataForm['pretax_amount'] = $('#input-product-pretax-amount').attr('value')
        frm.dataForm['taxes'] = $('#input-product-taxes').attr('value')
        frm.dataForm['total_price'] = $('#input-product-total').attr('value')
        let purchase_request_product_datas = []
        lineDetailTable_so.find('tbody tr').each(function () {
            purchase_request_product_datas.push({
                'sale_order_product': $(this).find('.product-detail').attr('data-so-product-id'),
                'product': $(this).find('.product-detail').attr('data-product-id') || null,
                'uom': $(this).find('.product-uom').attr('data-uom-id') || null,
                'tax': $(this).find('.tax').val() || null,
                'quantity': $(this).find('.request-number').text(),
                'unit_price': $(this).find('.unit-price').attr('value'),
                'sub_total_price': $(this).find('.subtotal-price').attr('value'),
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
                'uom': $(this).find('.product-uom').attr('data-id'),
                'quantity': $(this).find('.request-number').text(),
                'unit_price': $(this).find('.unit-price').attr('value'),
                'tax': $(this).find('.tax').val() ? $(this).find('.tax').val() : null,
                'sub_total_price': $(this).find('.subtotal-price').attr('value'),
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
                'uom': $(this).find('.product-uom').val(),
                'quantity': $(this).find('.request-number').val(),
                'unit_price': $(this).find('.unit-price').attr('value'),
                'tax': $(this).find('.tax').val() ? $(this).find('.tax').val() : null,
                'sub_total_price': $(this).find('.subtotal-price').attr('value'),
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
                'uom': $(this).find('.product-uom').val(),
                'quantity': $(this).find('.request-number').val(),
                'unit_price': $(this).find('.unit-price').attr('value'),
                'tax': $(this).find('.tax').val() ? $(this).find('.tax').val() : null,
                'sub_total_price': $(this).find('.subtotal-price').attr('value'),
            })
        })
        frm.dataForm['purchase_request_product_datas'] = purchase_request_product_datas
        frm.dataForm['attachment'] = frm.dataForm?.['attachment'] ? $x.cls.file.get_val(frm.dataForm?.['attachment'], []) : []

        // console.log(frm)
        return frm
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
                    $request_for.val(0)
                    $('#title-so').val(data?.['title'])
                    deliveryDate_so.val(moment(data?.['delivered_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $('#pr-status-so').val(data?.['purchase_status'])
                    LoadSupplier(supplier_so, data?.['supplier'])
                    contact_so.empty()
                    LoadContactOwner(contact_so, data?.['contact'])
                    $('#code-so').val(data?.['sale_order']?.['code'])
                    $('#note-so').val(data?.['note'])

                    LoadLineDetailTable(lineDetailTable_so, data?.['purchase_request_product_datas'] || [], option)
                    $('#input-product-pretax-amount').attr('value', data?.['pretax_amount'])
                    $('#input-product-taxes').attr('value', data?.['taxes'])
                    $('#input-product-total').attr('value', data?.['total_price'])
                    $.fn.initMaskMoney2()
                }
                else if (data?.['request_for'] === 1) {
                    $('.for-stock-free-request').prop('hidden', false)
                    $request_for.val(1)
                    $('#title-sf').val(data?.['title'])
                    deliveryDate_sf.val(moment(data?.['delivered_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $('#pr-status-sf').val(data?.['purchase_status'])
                    LoadSupplier(supplier_sf, data?.['supplier'])
                    contact_sf.empty()
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
                    LoadLineDetailTableAddRow(lineDetailTable_sf, request_product_data, option)
                    $('#input-product-pretax-amount').attr('value', data?.['pretax_amount'])
                    $('#input-product-taxes').attr('value', data?.['taxes'])
                    $('#input-product-total').attr('value', data?.['total_price'])
                    $.fn.initMaskMoney2()
                }
                else if (data?.['request_for'] === 2) {
                    $('.for-fixed-asset-request').prop('hidden', false)
                    $request_for.val(2)
                    $('#title-fa').val(data?.['title'])
                    deliveryDate_fa.val(moment(data?.['delivered_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $('#pr-status-fa').val(data?.['purchase_status'])
                    LoadSupplier(supplier_fa, data?.['supplier'])
                    contact_fa.empty()
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
                    LoadLineDetailTableAddRow(lineDetailTable_fa, request_product_data, option)
                    $('#input-product-pretax-amount').attr('value', data?.['pretax_amount'])
                    $('#input-product-taxes').attr('value', data?.['taxes'])
                    $('#input-product-total').attr('value', data?.['total_price'])
                    $.fn.initMaskMoney2()
                }
                else if (data?.['request_for'] === 3) {
                    $('.for-distribution-request').prop('hidden', false)
                    $request_for.val(3)
                    $('#title-db').val(data?.['title'])
                    deliveryDate_db.val(moment(data?.['delivered_date'], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    $('#pr-status-db').val(data?.['purchase_status'])
                    LoadSupplier(supplier_db, data?.['supplier'])
                    contact_db.empty()
                    LoadContactOwner(contact_db, data?.['contact'])
                    $('#code-db').val(data?.['distribution_plan']?.['code'])
                    $('#note-db').val(data?.['note'])

                    LoadLineDetailTable(lineDetailTable_db, data?.['purchase_request_product_datas'] || [], option)
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

                UsualLoadPageFunction.DisablePage(option === 'detail')

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
        let limit_number = parseFloat($(this).find('.remain-span').text() || 0)
        let request_number = parseFloat($(this).find('.request-number-input').val() || 0)

        if (request_number <= limit_number) {
            request_product_data.push({
                'sale_order_product_id': $(this).find('.product-span').attr('data-so-product-id'),
                'product_data': JSON.parse($(this).find('.product-span').attr('data-product') || '{}'),
                'uom_data': JSON.parse($(this).find('.product-span').attr('data-uom') || '{}'),
                'tax_data': JSON.parse($(this).find('.product-span').attr('data-tax') || '{}'),
                'quantity': request_number
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
                current_so_id = $(this).attr('data-id')
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

btnAddSFProduct.on('click', function () {
    UsualLoadPageFunction.AddTableRow(lineDetailTable_sf)
    let row_added = lineDetailTable_sf.find('tbody tr:last-child')
    UsualLoadPageFunction.LoadProduct({
        element: row_added.find('.product-detail'),
        data_url: script_url.attr('data-url-product')
    })
    UsualLoadPageFunction.LoadTax({
        element: row_added.find('.tax'),
        data_url: script_url.attr('data-url-tax')
    })
})

btnAddFAProduct.on('click', function () {
    UsualLoadPageFunction.AddTableRow(lineDetailTable_fa)
    let row_added = lineDetailTable_fa.find('tbody tr:last-child')
    UsualLoadPageFunction.LoadProduct({
        element: row_added.find('.product-detail'),
        data_url: script_url.attr('data-url-product')
    })
    UsualLoadPageFunction.LoadTax({
        element: row_added.find('.tax'),
        data_url: script_url.attr('data-url-tax')
    })
})

$(document).on("click", '.btn-del-line-detail', function () {
    UsualLoadPageFunction.DeleteTableRow(
        $(this).closest('table'),
        parseInt($(this).closest('tr').find('td:first-child').text())
    )
});

$(document).on('change', '.unit-price', function () {
    calculate_line_detail_table($(this).closest('tr'))
})

$(document).on('change', '.request-number', function () {
    calculate_line_detail_table($(this).closest('tr'))
})

$request_for.on('change', function () {
    $('.for-sale-order-request, .for-stock-free-request, .for-fixed-asset-request, .for-distribution-request').prop('hidden', true)
    if ($request_for.val() === '0') {
        $('.for-sale-order-request').prop('hidden', false)
        LoadDeliveryDate(deliveryDate_so)
        LoadSupplier(supplier_so)
        LoadLineDetailTable(lineDetailTable_so, [])
        UsualLoadPageFunction.LoadCustomer({
            element: $so_filter_by_customer,
            data_url: $so_filter_by_customer.attr('data-url')
        })

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
                is_all_so = (results[0] || []).some(emp => emp?.['employee']?.['id'] === emp_current_id)
                LoadSaleOrderTable()
                LoadSaleOrderProductTable()
            })
    }
    else if ($request_for.val() === '1') {
        $('.for-stock-free-request').prop('hidden', false)
        LoadDeliveryDate(deliveryDate_sf)
        LoadSupplier(supplier_sf)
        LoadLineDetailTableAddRow(lineDetailTable_sf, [])
    }
    else if ($request_for.val() === '2') {
        $('.for-fixed-asset-request').prop('hidden', false)
        LoadDeliveryDate(deliveryDate_fa)
        LoadSupplier(supplier_fa)
        LoadLineDetailTableAddRow(lineDetailTable_fa, [])
    }
    else if ($request_for.val() === '3') {
        $('.for-distribution-request').prop('hidden', false)
        LoadDeliveryDate(deliveryDate_db)
        LoadSupplier(supplier_db)
        LoadLineDetailTable(lineDetailTable_db, [])
        LoadDistributionTable()
        LoadDistributionProductTable()
    }
})

$so_filter_by_customer.on('change', function () {
    LoadSaleOrderTable()
    LoadSaleOrderProductTable()
})

$('.select-pr-type').on('mouseenter', function () {
    $(this).addClass('bg-secondary-light-5')
}).on('mouseleave', function () {
    $(this).removeClass('bg-secondary-light-5')
})
