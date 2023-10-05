let SupplierSelectBox = $('#supplier-select-box');
let ContactSelectBox = $('#contact-select-box');
let PQRSelectBox = $('#pqr-select-box');
let FormCreatePQ = $('#form-create-purchase-quotation');
let FormDetailPQ = $('#form-detail-purchase-quotation');
let EXPDate = $('#expiration_date');
let PQR_LIST = [];
let tableLineDetail = $('#table-purchase-quotation-products-selected');

EXPDate.dateRangePickerDefault({
    singleDatePicker: true,
    timePicker: true,
    showDropdowns: true,
    minYear: 1901,
    locale: {
        format: 'YYYY-MM-DD'
    },
    "cancelClass": "btn-secondary",
    maxYear: parseInt(moment().format('YYYY'),10)
});

EXPDate.val('');

function loadSupplier(data) {
    SupplierSelectBox.initSelect2({
        ajax: {
            url: FormCreatePQ.attr('data-url-account'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'account_list',
        keyId: 'id',
        keyText: 'name',
    }).on('change', function () {
        let obj_selected = JSON.parse($('#' + SupplierSelectBox.attr('data-idx-data-loaded')).text())[SupplierSelectBox.val()];
        loadContact(null, obj_selected.contact_mapped)
    })
}

function loadContact(data, contact_mapped) {
    ContactSelectBox.initSelect2({
        ajax: {
            url: FormCreatePQ.attr('data-url-contact'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (contact_mapped.includes(resp.data[keyResp][i].id)) {
                    result.push(resp.data[keyResp][i]);
                }
            }
            return result;
        },
        data: data ? data : null,
        keyResp: 'contact_list',
        keyId: 'id',
        keyText: 'fullname',
    })
}

function loadPQR(data) {
    if (data && data.is_param) {
        PQRSelectBox.attr('disabled', true);
        let pqr_selected = data.id;
        let url_loaded = FormCreatePQ.attr('data-url-pqr-detail').replace(0, pqr_selected);
        let call_pqr_detail = $.fn.callAjax(url_loaded, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('purchase_quotation_request_detail')) {
                    return data?.['purchase_quotation_request_detail'];
                }
                return [];
            }
        })
        Promise.all([call_pqr_detail]).then((results) => {
            let product_list_get = results[0]?.['products_mapped']
            let table_body = tableLineDetail.find('tbody');
            table_body.html(``);
            for (let i = 0; i < product_list_get.length; i++) {
                table_body.append(`<tr id="row-${i}" class="row-number">
                        <td class="number text-center wrap-text w-5">${i+1}</td>
                        <td class="wrap-text w-15"><select class="form-select product-select-box" disabled data-method="GET"></select></td>
                        <td class="wrap-text w-10"><div data-simplebar class="h-100p bg-gray-light-4 border rounded-5 text-primary"><span class="product-description">${product_list_get[i].product.description}</span></div></td>
                        <td class="wrap-text w-10"><select class="form-select product-uom-select-box" data-method="GET"></select></td>
                        <td class="wrap-text w-10"><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control product-quantity" value="${product_list_get[i].quantity}"></td>
                        <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" style="color: black; background: none" value="${product_list_get[i].unit_price}"></td>
                        <td class="wrap-text w-15"><select class="form-select product-tax-select-box" data-method="GET"></select></td>
                        <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${product_list_get[i].subtotal_price}"></span></td>
                        <td class="wrap-text w-5"><button class="disabled btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
                    </tr>
                    <script>
                        function checkInputQuantity(value) {
                            if (parseInt(value) < 0) {
                                return value*(-1);
                            }
                            return value;
                        }
                    </script>`);
                $('.btn-del-line-detail').on('click', function () {
                    $(this).closest('tr').remove();
                    count_row(table_body, 2);
                    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
                    $.fn.initMaskMoney2();
                })
                loadProductList('row-'+i, product_list_get[i]?.['product'])
                loadProductUomList('row-'+i, product_list_get[i]?.['product']['uom'], product_list_get[i]?.['product']['uom_group']['id']);
                loadProductTaxList('row-'+i, product_list_get[i]?.['product']['tax']);
            }
            let quantity = $(this).closest('tr').find('.product-quantity').val();
            let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
            let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
            $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
            calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
            $.fn.initMaskMoney2();
        }).catch((error) => {
            console.log(error)
            $.fn.notifyB({description: "Load Sale Code Failed!"}, 'failure');
        });
    }
    PQRSelectBox.initSelect2({
        ajax: {
            url: FormCreatePQ.attr('data-url-pqr'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            PQR_LIST = resp.data[keyResp];
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'purchase_quotation_request_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        let pqr_selected = PQRSelectBox.val();
        let url_loaded = FormCreatePQ.attr('data-url-pqr-detail').replace(0, pqr_selected);
        let call_pqr_detail = $.fn.callAjax(url_loaded, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('purchase_quotation_request_detail')) {
                    return data?.['purchase_quotation_request_detail'];
                }
                return [];
            }
        })
        Promise.all([call_pqr_detail]).then((results) => {
            let product_list_get = results[0]?.['products_mapped']
            let table_body = tableLineDetail.find('tbody');
            table_body.html(``);
            for (let i = 0; i < product_list_get.length; i++) {
                table_body.append(`<tr id="row-${i}" class="row-number">
                        <td class="number text-center wrap-text w-5">${i+1}</td>
                        <td class="wrap-text w-15"><select class="form-select product-select-box" disabled data-method="GET"></select></td>
                        <td class="wrap-text w-10"><div data-simplebar class="h-100p bg-gray-light-4 border rounded-5 text-primary"><span class="product-description">${product_list_get[i].product.description}</span></div></td>
                        <td class="wrap-text w-10"><select class="form-select product-uom-select-box" data-method="GET"></select></td>
                        <td class="wrap-text w-10"><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control product-quantity" value="${product_list_get[i].quantity}"></td>
                        <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" style="color: black; background: none" value="${product_list_get[i].unit_price}"></td>
                        <td class="wrap-text w-15"><select class="form-select product-tax-select-box" data-method="GET"></select></td>
                        <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${product_list_get[i].subtotal_price}"></span></td>
                        <td class="wrap-text w-5"><button class="disabled btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
                    </tr>
                    <script>
                        function checkInputQuantity(value) {
                            if (parseInt(value) < 0) {
                                return value*(-1);
                            }
                            return value;
                        }
                    </script>`);
                $('.btn-del-line-detail').on('click', function () {
                    $(this).closest('tr').remove();
                    count_row(table_body, 2);
                    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
                    $.fn.initMaskMoney2();
                })
                loadProductList('row-'+i, product_list_get[i]?.['product'])
                loadProductUomList('row-'+i, product_list_get[i]?.['product']['uom'], product_list_get[i]?.['product']['uom_group']['id']);
                loadProductTaxList('row-'+i, product_list_get[i]?.['product']['tax']);
            }
            let quantity = $(this).closest('tr').find('.product-quantity').val();
            let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
            let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
            $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
            calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
            $.fn.initMaskMoney2();
        }).catch((error) => {
            console.log(error)
            $.fn.notifyB({description: "Load Sale Code Failed!"}, 'failure');
        });
    })
}

function count_row(table_body, option) {
    let count = 0;
    table_body.find('tr td.number').each(function () {
        count = count + 1;
        $(this).text(count);
        $(this).closest('tr').attr('id', 'row-' + count.toString())
    });
    if (option === 1) {
        loadProductList('row-' + count.toString());
        loadProductTaxList('row-' + count.toString());
    }
    return count;
}

function loadProductList(row_id, data) {
    let selected_product = [];
    $('#table-purchase-quotation-products-selected tbody tr').each(function () {
        selected_product.push($(this).find('.product-select-box').val());
    })
    let ele = $('#' + row_id + ' .product-select-box');
    ele.initSelect2({
        ajax: {
            url: FormCreatePQ.attr('data-url-product'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (!selected_product.includes(resp.data[keyResp][i].id)) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'product_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        let obj_selected = JSON.parse($('#' + $(this).attr('data-idx-data-loaded')).text())[$(this).val()];
        $(this).closest('tr').find('.product-description').text(obj_selected.description)
        loadProductUomList($(this).closest('tr').attr('id'), null, obj_selected?.['general_uom_group']['id']);
    })
}

function loadProductTaxList(row_id, data) {
    let ele = $('#' + row_id + ' .product-tax-select-box');
    ele.initSelect2({
        ajax: {
            url: FormCreatePQ.attr('data-url-tax'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'tax_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function loadProductUomList(row_id, data, uom_group_id) {
    let ele = $('#' + row_id + ' .product-uom-select-box');
    ele.initSelect2({
        ajax: {
            url: FormCreatePQ.attr('data-url-uom'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i]?.['group']['id'] === uom_group_id) {
                    result.push(resp.data[keyResp][i])
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'unit_of_measure',
        keyId: 'id',
        keyText: 'title',
    })
}

function calculate_price(table_tr) {
    let sum_price_pre_tax_value = 0;
    let sum_tax_value = 0;
    let sum_price_after_tax_value = 0;
    table_tr.each(function () {
        let quantity = $(this).find('.product-quantity').val();
        let pr_unit_price = $(this).find('.pr-unit-price-input').attr('value');
        let tax_rate = 0;
        if ($(this).find('.product-tax-select-box').val()) {
            let tax_selected = JSON.parse($('#' + $(this).find('.product-tax-select-box').attr('data-idx-data-loaded')).text())[$(this).find('.product-tax-select-box').val()];
            tax_rate = tax_selected.rate;
        }
        let current_pre_tax_value = parseFloat(quantity) * parseFloat(pr_unit_price);
        sum_price_pre_tax_value += current_pre_tax_value;
        sum_tax_value += current_pre_tax_value * tax_rate / 100;
        sum_price_after_tax_value += current_pre_tax_value + current_pre_tax_value * tax_rate / 100;
    })
    $('#pretax-value').attr('data-init-money', sum_price_pre_tax_value);
    $('#taxes-value').attr('data-init-money', sum_tax_value);
    $('#total-value').attr('data-init-money', sum_price_after_tax_value);
}

$(document).on("click", '#new-product-btn', function () {
    let table_body = $('#table-purchase-quotation-products-selected tbody');
    table_body.append(`<tr id="" class="row-number">
            <td class="number text-center wrap-text w-5"></td>
            <td class="wrap-text w-15"><select class="form-select product-select-box" data-method="GET"></select></td>
            <td class="wrap-text w-10"><div data-simplebar class="h-100p bg-gray-light-4 border rounded-5 text-primary"><span class="product-description"></span></div></td>
            <td class="wrap-text w-10"><select class="form-select product-uom-select-box" data-method="GET"><option selected></option></select></td>
            <td class="wrap-text w-10"><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control product-quantity" value="1"></td>
            <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" style="color: black; background: none"></td>
            <td class="wrap-text w-15"><select class="form-select product-tax-select-box" data-method="GET"><option selected></option></select></td>
            <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money=""></span></td>
            <td class="wrap-text w-5"><button class="btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
        </tr>
        <script>
            function checkInputQuantity(value) {
                if (parseInt(value) < 0) {
                    return value*(-1);
                }
                return value;
            }
        </script>`);
    $.fn.initMaskMoney2();
    count_row(table_body, 1);
    $('.btn-del-line-detail').on('click', function () {
        $(this).closest('tr').remove();
        count_row(table_body, 2);
        calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
        $.fn.initMaskMoney2();
    })
});

$(document).on("change", '.pr-unit-price-input', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
    $.fn.initMaskMoney2();
})

$(document).on("change", '.product-tax-select-box', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
    $.fn.initMaskMoney2();
})

$(document).on("change", '.product-quantity', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
    $.fn.initMaskMoney2();
})

function Disable() {
    $('.form-control').prop('disabled', true).css({color: 'black'});
    $('.form-select').prop('disabled', true).css({color: 'black'});
    $('.select2').prop('disabled', true);
    $('input').prop('disabled', true);
}

function LoadDetailPQ() {
    let pk = $.fn.getPkDetail()
    let url_detail = FormDetailPQ.attr('data-url-detail').replace('0', pk)
    $.fn.callAjax(url_detail, 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            $('#supplier-select-box').select2();
            $('#contact-select-box').select2();
            $('#pqr-select-box').select2();
            let data_detail = data?.['purchase_quotation_detail'];
            console.log(data_detail)
            $x.fn.renderCodeBreadcrumb(data_detail);

            $('#title').val(data_detail.title);
            loadSupplier(data_detail.supplier_mapped)
            loadContact(data_detail.contact_mapped)
            if (Object.keys(data_detail.purchase_quotation_request_mapped).length != 0) {
                loadPQR(data_detail.purchase_quotation_request_mapped);
            }
            $('#expiration_date').val(data_detail.expiration_date.split(' ')[0]);
            $('#lead-time-from').val(data_detail.lead_time_from);
            $('#lead-time-to').val(data_detail.lead_time_to);
            $('#lead-time-type').val(data_detail.lead_time_type);
            $('#note').val(data_detail.note);

            tableLineDetail.DataTable().clear().destroy();
            tableLineDetail.DataTableDefault({
                reloadCurrency: true,
                paging: false,
                dom: "",
                data: data_detail?.['products_mapped'],
                columns: [
                    {
                        data: 'index',
                        className: 'wrap-text text-center w-5',
                        render: (data, type, row, meta) => {
                            return row.index;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-15',
                        render: (data, type, row, meta) => {
                            return `<span class="product-title" data-product-id="${row.product.id}">${row.product.title}</span>`;
                        }
                    },
                    {
                        data: 'description',
                        className: 'wrap-text w-10',
                        render: (data, type, row, meta) => {
                            return `<div data-simplebar class="h-100p bg-gray-light-4 border rounded-5 text-primary"><span class="product-description">${row.product.description}</span></div>`;
                        }
                    },
                    {
                        data: 'uom',
                        className: 'wrap-text w-15 text-center',
                        render: (data, type, row, meta) => {
                            return `<span class="product-uom" data-product-uom-id="${row.product.uom.id}">${row.product.uom.title}</span>`;
                        }
                    },
                    {
                        data: 'quantity',
                        className: 'wrap-text w-10 text-center',
                        render: (data, type, row, meta) => {
                            return `<span class="product-quantity">${row.quantity}</span>`;
                        }
                    },
                    {
                        data: 'pr_unit_price',
                        className: 'wrap-text w-15',
                        render: (data, type, row, meta) => {
                            return `<input readonly type="text" class="pr-unit-price-input form-control mask-money" data-return-type="number" value="${row.unit_price}">`;
                        }
                    },
                    {
                        data: 'tax',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            let html = '';
                            if (Object.keys(row.product.tax).length !== 0) {
                                html = `<option selected data-rate="${row.product.tax.rate}" value="${row.product.tax.id}">${row.product.tax.title} (${row.product.tax.rate}%)</option>`;
                            }
                            return `<select style="color: #6f6f6f" disabled class="form-select product-tax-select-box" data-method="GET">${html}</select>`;
                        }
                    },
                    {
                        data: 'pr_subtotal_price',
                        className: 'wrap-text w-15 text-center',
                        render: (data, type, row, meta) => {
                            return `<span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${row.subtotal_price}"></span>`;
                        }
                    },
                ],
            })

            $('#pretax-value').attr('data-init-money', data_detail.pretax_price);
            $('#taxes-value').attr('data-init-money', data_detail.taxes_price);
            $('#total-value').attr('data-init-money', data_detail.total_price);
            $.fn.initMaskMoney2();

            Disable()
        }
    })
}

class PQHandle {
    load(param_PQR) {
        loadSupplier();
        loadPQR(param_PQR);
    }
    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['supplier_mapped'] = SupplierSelectBox.val();
        frm.dataForm['contact_mapped'] = ContactSelectBox.val();
        frm.dataForm['purchase_quotation_request_mapped'] = PQRSelectBox.val();
        frm.dataForm['expiration_date'] = EXPDate.val();
        frm.dataForm['lead_time_from'] = $('#lead-time-from').val();
        frm.dataForm['lead_time_to'] = $('#lead-time-to').val();
        frm.dataForm['lead_time_type'] = $('#lead-time-type option:selected').val();
        frm.dataForm['note'] = $('#note').val();

        frm.dataForm['products_selected'] = []
        $('#table-purchase-quotation-products-selected tbody tr').each(function () {
            if ($(this).find('.product-select-box option:selected').attr('value') !== '') {
                let product_id = $(this).find('.product-select-box').val();
                let product_uom_id = $(this).find('.product-uom-select-box').val();
                let product_quantity = $(this).find('.product-quantity').val();
                let product_unit_price = $(this).find('.pr-unit-price-input').attr('value');
                let product_subtotal_price = $(this).find('.pr-subtotal-price-input').attr('data-init-money');
                if (product_id !== '' && product_uom_id !== '' && product_quantity !== '' && product_unit_price !== '' && product_subtotal_price !== '') {
                    frm.dataForm['products_selected'].push(
                        {
                            'product_id': product_id,
                            'product_description': $(this).find('.product-description').val(),
                            'product_uom_id': product_uom_id,
                            'product_quantity': product_quantity,
                            'product_unit_price': product_unit_price,
                            'product_taxes': $(this).find('.product-tax-select-box').val(),
                            'product_subtotal_price': product_subtotal_price,
                        }
                    )
                }
                else {
                    $.fn.notifyB({description: 'Missing fields in Line Detail'}, 'failure');
                    return false;
                }
            }
        })

        frm.dataForm['pretax_price'] = $('#pretax-value').attr('data-init-money');
        frm.dataForm['taxes_price'] = $('#taxes-value').attr('data-init-money');
        frm.dataForm['total_price'] = $('#total-value').attr('data-init-money');

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}