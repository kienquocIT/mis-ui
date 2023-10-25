let url_script = $('#url-script');
let SupplierSelectBox = $('#supplier-select-box');
let ContactSelectBox = $('#contact-select-box');
let PQRSelectBox = $('#pqr-select-box');
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

function deleteSameRow(table, row) {
    console.log(row)
    row.remove();
    count_row(table.find('tbody'));
    calculate_price(table.find('tbody tr'));
}

function checkMergeRow(row) {
    let this_product_id = row.find('.product-select-box').val();
    let this_product_uom_id = row.find('.product-uom-select-box').val();
    let this_product_quantity = row.find('.product-quantity').val();
    tableLineDetail.find('tr').each(function () {
        let product_id = $(this).find('.product-select-box').val();
        let product_uom_id = $(this).find('.product-uom-select-box').val();

        if ($(this).find('td:first-child').text() !== row.find('td:first-child').text() && this_product_id === product_id && this_product_uom_id === product_uom_id && this_product_quantity !== '') {
            if ($(this).find('.product-quantity').val() !== '') {
                row.find('.product-quantity').val(parseFloat($(this).find('.product-quantity').val()) + parseFloat(this_product_quantity));
                row.find('.pr-unit-price-input').attr('value', 0);
                row.find('.product-tax-select-box option').remove();
                row.find('.pr-subtotal-price-input').attr('data-init-money', '0');
                row.find('.btn-del-line-detail').removeClass('disabled');
                deleteSameRow(tableLineDetail, $(this));
            }
        }
    })
}

function loadSupplier(data) {
    SupplierSelectBox.initSelect2({
        ajax: {
            url: url_script.attr('data-url-account'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i].account_type.includes('Supplier')) {
                    result.push(resp.data[keyResp][i]);
                }
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'account_list',
        keyId: 'id',
        keyText: 'name',
    }).on('change', function () {
        let obj_selected = JSON.parse($('#' + SupplierSelectBox.attr('data-idx-data-loaded')).text())[SupplierSelectBox.val()];
        console.log(obj_selected.contact_mapped)
        loadContact(null, obj_selected.contact_mapped)
    })
}

function loadContact(data, contact_mapped=[]) {
    ContactSelectBox.find('option').remove()
    ContactSelectBox.initSelect2({
        ajax: {
            url: url_script.attr('data-url-contact'),
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
        let url_loaded = url_script.attr('data-url-pqr-detail').replace(0, data.id);
        let call_pqr_detail_with_param = $.fn.callAjax(url_loaded, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('purchase_quotation_request_detail')) {
                    return data?.['purchase_quotation_request_detail'];
                }
                return [];
            }
        })
        Promise.all([call_pqr_detail_with_param]).then((results) => {
            let product_list_get = results[0]?.['products_mapped']
            let table_body = tableLineDetail.find('tbody');
            table_body.html(``);
            for (let i = 0; i < product_list_get.length; i++) {
                table_body.append(`<tr>
                        <td class="number text-center wrap-text w-5">${i+1}</td>
                        <td class="wrap-text w-15"><select class="select2 form-select product-select-box" disabled data-method="GET"></select></td>
                        <td class="wrap-text w-10"><span class="product-description">${product_list_get[i].product.description}</span></td>
                        <td class="wrap-text w-10"><select class="select2 form-select product-uom-select-box" data-method="GET"></select></td>
                        <td class="wrap-text w-10"><input type="number" min="1" class="form-control product-quantity" value="${product_list_get[i].quantity}"></td>
                        <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" value="${product_list_get[i].unit_price}"></td>
                        <td class="wrap-text w-15"><select class="select2 form-select product-tax-select-box" data-method="GET"></select></td>
                        <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${product_list_get[i].subtotal_price}"></span></td>
                        <td class="wrap-text w-5"><button class="disabled btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
                    </tr>`);
                loadProductList(tableLineDetail.find('tbody tr:last').find('.product-select-box'), {'id': product_list_get[i].product.id, 'title': product_list_get[i].product.title})
                loadProductUomList(tableLineDetail.find('tbody tr:last').find('.product-uom-select-box'), {'id': product_list_get[i].product.uom.id, 'title': product_list_get[i].product.uom.title}, product_list_get[i].product.uom_group.id)
                let tax_data = null;
                if (Object.keys(product_list_get[i].product.tax).length !== 0) {
                    tax_data = {'id': product_list_get[i].product.tax.id, 'title': product_list_get[i].product.tax.title, 'rate': product_list_get[i].product.tax.rate}
                }
                loadProductTaxList(tableLineDetail.find('tbody tr:last').find('.product-tax-select-box'), tax_data)
            }
            calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
        }).catch((error) => {
            console.log(error)
            $.fn.notifyB({description: "Load Sale Code Failed!"}, 'failure');
        });
    }
    PQRSelectBox.initSelect2({
        ajax: {
            url: url_script.attr('data-url-pqr'),
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
        let url_loaded = url_script.attr('data-url-pqr-detail').replace(0, PQRSelectBox.val());
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
                table_body.append(`<tr>
                        <td class="number text-center wrap-text w-5">${i+1}</td>
                        <td class="wrap-text w-15"><select class="select2 form-select product-select-box" disabled data-method="GET"></select></td>
                        <td class="wrap-text w-10"><span class="product-description">${product_list_get[i].product.description}</span></td>
                        <td class="wrap-text w-10"><select class="select2 form-select product-uom-select-box" data-method="GET"></select></td>
                        <td class="wrap-text w-10"><input type="number" min="1" class="form-control product-quantity" value="${product_list_get[i].quantity}"></td>
                        <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" value="${product_list_get[i].unit_price}"></td>
                        <td class="wrap-text w-15"><select class="select2 form-select product-tax-select-box" data-method="GET"></select></td>
                        <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${product_list_get[i].subtotal_price}"></span></td>
                        <td class="wrap-text w-5"><button class="disabled btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
                    </tr>`);
                loadProductList(tableLineDetail.find('tbody tr:last').find('.product-select-box'), {'id': product_list_get[i].product.id, 'title': product_list_get[i].product.title})
                loadProductUomList(tableLineDetail.find('tbody tr:last').find('.product-uom-select-box'), {'id': product_list_get[i].product.uom.id, 'title': product_list_get[i].product.uom.title}, product_list_get[i].product.uom_group.id)
                let tax_data = null;
                if (Object.keys(product_list_get[i].product.tax).length !== 0) {
                    tax_data = {'id': product_list_get[i].product.tax.id, 'title': product_list_get[i].product.tax.title, 'rate': product_list_get[i].product.tax.rate}
                }
                loadProductTaxList(tableLineDetail.find('tbody tr:last').find('.product-tax-select-box'), tax_data)
            }
            calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
        }).catch((error) => {
            console.log(error)
            $.fn.notifyB({description: "Load Sale Code Failed!"}, 'failure');
        });
    })
}

function count_row(table_body) {
    table_body.find('tr').each(function (index) {
        $(this).find('.number').text(index + 1);
    });
    $.fn.initMaskMoney2();
}

function loadProductList(ele, data) {
    ele.initSelect2({
        ajax: {
            url: url_script.attr('data-url-product'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'product_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        let obj_selected = JSON.parse($('#' + $(this).attr('data-idx-data-loaded')).text())[$(this).val()];
        $(this).closest('tr').find('.product-description').text(obj_selected.description);
        loadProductUomList($(this).closest('tr').find('.product-uom-select-box'), null, obj_selected?.['general_uom_group']['id']);
        checkMergeRow($(this).closest('tr'))
    })
}

function loadProductUomList(ele, data, uom_group_id) {
    ele.initSelect2({
        ajax: {
            url: url_script.attr('data-url-uom'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                if (resp.data[keyResp][i]?.['group']['id'] === uom_group_id) {
                    result.push(resp.data[keyResp][i])
                }
            }
            if (result.length > 0) {
                $('.select2-results__message').prop('hidden', true);
            }
            return result;
        },
        data: (data ? data : null),
        keyResp: 'unit_of_measure',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        checkMergeRow($(this).closest('tr'))
    })
}

function loadProductTaxList(ele, data) {
    ele.initSelect2({
        ajax: {
            url: url_script.attr('data-url-tax'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'tax_list',
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
        let tax_selected = $(this).find('.product-tax-select-box').val();
        if (tax_selected !== null) {
            tax_selected = JSON.parse($('#' + $(this).find('.product-tax-select-box').attr('data-idx-data-loaded')).text())[$(this).find('.product-tax-select-box').val()]
        }
        let tax_rate = 0;
        if (tax_selected) {
            tax_rate = tax_selected.rate;
        }
        let current_pre_tax_value = parseFloat(quantity) * parseFloat(pr_unit_price);
        // console.log(quantity, pr_unit_price, tax_selected, tax_rate, current_pre_tax_value)
        if (current_pre_tax_value) {
            sum_price_pre_tax_value += current_pre_tax_value;
            sum_tax_value += current_pre_tax_value * tax_rate / 100;
            sum_price_after_tax_value += current_pre_tax_value + current_pre_tax_value * tax_rate / 100;
        }
    })
    $('#pretax-value').attr('data-init-money', sum_price_pre_tax_value);
    $('#taxes-value').attr('data-init-money', sum_tax_value);
    $('#total-value').attr('data-init-money', sum_price_after_tax_value);
    $.fn.initMaskMoney2();
}

$(document).on("click", '#new-product-btn', function () {
    tableLineDetail.find('tbody').append(`<tr>
            <td class="number text-center wrap-text w-5"></td>
            <td class="wrap-text w-15"><select class="select2 form-select product-select-box" data-method="GET"></select></td>
            <td class="wrap-text w-10"><span class="product-description"></span></td>
            <td class="wrap-text w-10"><select class="select2 form-select product-uom-select-box" data-method="GET"></select></td>
            <td class="wrap-text w-10"><input type="number" min="1" class="form-control product-quantity"></td>
            <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money"></td>
            <td class="wrap-text w-15"><select class="select2 form-select product-tax-select-box" data-method="GET"></select></td>
            <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money=""></span></td>
            <td class="wrap-text w-5"><button class="btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
        </tr>`);
    count_row(tableLineDetail.find('tbody'));
    loadProductList(tableLineDetail.find('tbody tr:last').find('.product-select-box'), null)
    loadProductUomList(tableLineDetail.find('tbody tr:last').find('.product-uom-select-box'), null, null)
    loadProductTaxList(tableLineDetail.find('tbody tr:last').find('.product-tax-select-box'), null)
});

$(document).on("change", '.pr-unit-price-input', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
})

$(document).on("change", '.product-tax-select-box', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
})

$(document).on("change", '.product-quantity', function () {
    let quantity = $(this).closest('tr').find('.product-quantity').val();
    if (parseInt(quantity) < 0) {
        $(this).closest('tr').find('.product-quantity').val(parseInt(quantity) * (-1));
        quantity = $(this).closest('tr').find('.product-quantity').val();
    }
    let pr_unit_price = $(this).closest('tr').find('.pr-unit-price-input').attr('value');
    let new_sub_total_price = parseFloat(pr_unit_price) * parseFloat(quantity);
    $(this).closest('tr').find('.pr-subtotal-price-input').attr('data-init-money', new_sub_total_price)
    checkMergeRow($(this).closest('tr'))
    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
})

$(document).on("click", '.btn-del-line-detail', function () {
    $(this).closest('tr').remove();
    count_row(tableLineDetail.find('tbody'));
    calculate_price($('#table-purchase-quotation-products-selected tbody tr'));
})

function Disable(for_update=false) {
    if (for_update === false) {
        $('.form-control').prop('disabled', true).css({color: 'black'});
        $('.form-select').prop('disabled', true).css({color: 'black'});
        $('.select2').prop('disabled', true);
        $('input').prop('disabled', true);
        $('#new-product-btn').attr('hidden', true);
    }
}

function LoadDetailPQ(for_update=false) {
    let pk = $.fn.getPkDetail()
    let url_detail = FormDetailPQ.attr('data-url').replace('0', pk)
    $.fn.callAjax(url_detail, 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            let data_detail = data?.['purchase_quotation_detail'];
            console.log(data_detail)
            $x.fn.renderCodeBreadcrumb(data_detail);

            $('#title').val(data_detail.title);
            loadSupplier(data_detail.supplier_mapped)
            loadContact(data_detail.contact_mapped, data_detail.supplier_mapped.contact_mapped)
            if (Object.keys(data_detail.purchase_quotation_request_mapped).length !== 0) {
                loadPQR(data_detail.purchase_quotation_request_mapped);
            }
            $('#expiration_date').val(data_detail.expiration_date.split(' ')[0]);
            $('#lead-time-from').val(data_detail.lead_time_from);
            $('#lead-time-to').val(data_detail.lead_time_to);
            $('#lead-time-type').val(data_detail.lead_time_type);
            $('#note').val(data_detail.note);

            tableLineDetail.DataTable().clear().destroy();
            let table_body = tableLineDetail.find('tbody');
            table_body.html(``);
            for (let i = 0; i < data_detail?.['products_mapped'].length; i++) {
                let item = data_detail?.['products_mapped'][i];
                table_body.append(`<tr id="row-${i}" class="row-number">
                        <td class="number text-center wrap-text w-5">${i+1}</td>
                        <td class="wrap-text w-15"><select class="select2 form-select product-select-box" disabled data-method="GET"></select></td>
                        <td class="wrap-text w-10"><span class="product-description">${item.product.description}</span></td>
                        <td class="wrap-text w-10"><select class="select2 form-select product-uom-select-box" data-method="GET"></select></td>
                        <td class="wrap-text w-10"><input type="number" min="1" class="form-control product-quantity" value="${item.quantity}"></td>
                        <td class="wrap-text w-15"><input type="text" data-return-type="number" class="form-control pr-unit-price-input mask-money" value="${item.unit_price}"></td>
                        <td class="wrap-text w-15"><select class="select2 form-select product-tax-select-box" data-method="GET"></select></td>
                        <td class="wrap-text w-15"><span class="pr-subtotal-price-input mask-money text-primary" data-init-money="${item.subtotal_price}"></span></td>
                        <td class="wrap-text w-5"><button class="disabled btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></button></td>
                    </tr>`);
                loadProductList(tableLineDetail.find('tbody tr:last').find('.product-select-box'), {'id': item.product.id, 'title': item.product.title})
                loadProductUomList(tableLineDetail.find('tbody tr:last').find('.product-uom-select-box'), {'id': item.product.uom.id, 'title': item.product.uom.title}, item.product.uom_group.id)
                let tax_data = null;
                if (Object.keys(item.product.tax).length !== 0) {
                    tax_data = {'id': item.product.tax.id, 'title': item.product.tax.title, 'rate': item.product.tax.rate}
                }
                loadProductTaxList(tableLineDetail.find('tbody tr:last').find('.product-tax-select-box'), tax_data)
            }

            $('#pretax-value').attr('data-init-money', data_detail.pretax_price);
            $('#taxes-value').attr('data-init-money', data_detail.taxes_price);
            $('#total-value').attr('data-init-money', data_detail.total_price);
            $.fn.initMaskMoney2();

            Disable(for_update);
        }
    })
}

class PQHandle {
    load(param_PQR) {
        loadSupplier();
        loadPQR(param_PQR);
    }
    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));
        let flag = true;

        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['supplier_mapped'] = SupplierSelectBox.val();
        frm.dataForm['contact_mapped'] = ContactSelectBox.val();
        frm.dataForm['purchase_quotation_request_mapped'] = PQRSelectBox.val();
        frm.dataForm['expiration_date'] = EXPDate.val();
        frm.dataForm['lead_time_from'] = $('#lead-time-from').val();
        frm.dataForm['lead_time_to'] = $('#lead-time-to').val();
        frm.dataForm['lead_time_type'] = $('#lead-time-type option:selected').val();

        if (parseFloat(frm.dataForm['lead_time_from']) > parseFloat(frm.dataForm['lead_time_to'])) {
            $.fn.notifyB({description: "Lead Time From can not greater than Lead Time To."}, 'failure');
            return false;
        }

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
                    flag = false;
                }
            }
        })

        frm.dataForm['pretax_price'] = $('#pretax-value').attr('data-init-money');
        frm.dataForm['taxes_price'] = $('#taxes-value').attr('data-init-money');
        frm.dataForm['total_price'] = $('#total-value').attr('data-init-money');

        if (flag) {
            if (for_update) {
                let pk = $.fn.getPkDetail()
                return {
                    url: frm.dataUrl.format_url_with_uuid(pk),
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect.format_url_with_uuid(pk),
                };
            } else {
                return {
                    url: frm.dataUrl,
                    method: frm.dataMethod,
                    data: frm.dataForm,
                    urlRedirect: frm.dataUrlRedirect,
                };
            }
        }
        else {
            return false;
        }
    }
}