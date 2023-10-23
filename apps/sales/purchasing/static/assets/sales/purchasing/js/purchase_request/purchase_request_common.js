let urlEle = $('#url-factory');
let transEle = $('#trans-factory')
let ele_request_for = $('[name="request_for"]')
let ele_sale_order = $('[name="sale_order"]')
let btn_change_pr_product = $('.btn-change-pr-product');
let btn_add_product = $('.btn-add-product');
let tableProductForSO = $('#datatable-pr-product-so');
let tableProductForOther = $('#datatable-pr-product-other');
let supplierSelectEle = $('#box-select-supplier')
let contactSelectEle = $('#box-select-contact')

$(document).on('click', '.del-row', function () {
    let table = tableProductForOther.DataTable();
    let row_index_delete = parseInt($(this).closest('tr').find('td:first-child').text()) - 1;
    table.row(row_index_delete).remove().draw();
})

function deleteSameRow(table, row) {
    table = tableProductForOther.DataTable();
    table.row(parseInt(row.find('td:first-child').text()) - 1).remove().draw();
}

function checkMergeRow(row) {
    let this_product_id = row.find('.box-select-product').val();
    let this_product_uom_id = row.find('.box-select-uom').val();
    let this_product_quantity = row.find('.inp-quantity').val();
    tableProductForOther.find('tr').each(function () {
        let product_id = $(this).find('.box-select-product').val();
        let product_uom_id = $(this).find('.box-select-uom').val();

        if ($(this).find('td:first-child').text() !== row.find('td:first-child').text() && this_product_id === product_id && this_product_uom_id === product_uom_id && this_product_quantity !== '') {
            if ($(this).find('.inp-quantity').val() !== '') {
                row.find('.inp-quantity').val(parseFloat($(this).find('.inp-quantity').val()) + parseFloat(this_product_quantity));
                row.find('.inp-unit-price').attr('value', 0);
                row.find('.box-select-tax option').remove();
                row.find('.pr-subtotal-price-input').attr('data-init-money', '0');
                deleteSameRow(tableProductForOther, $(this));
                if (row.find('.inp-unit-price').val() !== '') {
                    PurchaseRequestAction.loadPriceSubProduct(row);
                    PurchaseRequestAction.loadFinalPrice($(this).closest('table'));
                    $.fn.initMaskMoney2();
                }
            }
        }
    })
}

function callData(url, method) {
    return $.fn.callAjax2({
        url: url,
        method: method,
    }).then((resp) => {
        return $.fn.switcherResp(resp);
    });
}

async function loadConfig() {
    let url = urlEle.data('url-config');
    let method = 'GET';
    let result = await callData(url, method);
    return result?.['config'];
}

class PurchaseRequestLoadPage {

    static loadSupplier(data) {
        supplierSelectEle.initSelect2({
            data: data,
            dataParams: {
                'account_types_mapped__account_type_order': 1
            }
        }).on('change', function () {
            contactSelectEle.empty();
            let supplier_current = SelectDDControl.get_data_from_idx($(this), $(this).val());
            PurchaseRequestLoadPage.loadContact(supplier_current.owner, $(this).val());
            let ele_parent = $(this).closest('.input-affix-wrapper');
            PurchaseRequestAction.loadMoreInfoSupplier(ele_parent, supplier_current)
            PurchaseRequestAction.loadMoreInfoContact(contactSelectEle.closest('.input-affix-wrapper'), supplier_current.owner)
        })
    }

    static loadContact(data, account_id) {
        contactSelectEle.initSelect2({
            data: data,
            'dataParams': {'account_name_id': account_id},
        }).on('change', function () {
            let contact_current = SelectDDControl.get_data_from_idx($(this), $(this).val());
            let ele_parent = $(this).closest('.input-affix-wrapper');
            PurchaseRequestAction.loadMoreInfoContact(ele_parent, contact_current)
        })
    }

    static loadTax(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadUoM(ele, data, param) {
        ele.initSelect2({
            data: data,
            dataParams: param
        })
    }

    static loadProduct(ele, data, list_product_selected) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = [];
                resp.data[keyResp].map(function (item) {
                    if (!list_product_selected.includes(item.id)) {
                        list_result.push(item)
                    }
                })
                return list_result
            }
        })
    }

    static loadMoreInfoProduct(trEleCurrent, item) {
        trEleCurrent.find('.input-affix-wrapper a').attr('href', urlEle.data('url-product-detail').format_url_with_uuid(item.product.id));
        trEleCurrent.find('.span-product-name').text(item.product.title);
        trEleCurrent.find('.span-product-code').text(item.product.code);
        trEleCurrent.find('.span-product-uom').text(item.uom.title);
    }

    static loadDetail(frmDetail, pk, page_type) {
        let url = frmDetail.data('url').format_url_with_uuid(pk);
        $.fn.callAjax2({
            'url': url,
            'method': 'GET',
        }).then(async (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let detail = data?.['purchase_request'];
                $x.fn.renderCodeBreadcrumb(detail);
                $.fn.compareStatusShowPageAction(detail);
                WFRTControl.setWFRuntimeID(detail?.['workflow_runtime_id']);

                $('#data-detail-backup').text(JSON.stringify(detail));
                $x.fn.renderCodeBreadcrumb(detail);
                $('[name="title"]').val(detail.title);

                PurchaseRequestLoadPage.loadSupplier(detail.supplier);
                let moreInfoSupplierEle = supplierSelectEle.closest('.input-affix-wrapper');
                PurchaseRequestAction.loadMoreInfoSupplier(moreInfoSupplierEle, detail.supplier)

                PurchaseRequestLoadPage.loadContact(detail.contact, detail.supplier.id);
                let moreInfoContactEle = contactSelectEle.closest('.input-affix-wrapper');
                PurchaseRequestAction.loadMoreInfoContact(moreInfoContactEle, detail.contact)

                $('[name="purchase_status"]').val(detail.purchase_status);
                $('[name="delivered_date"]').val(detail.delivered_date.split(' ')[0]);
                $('[name="note"]').val(detail.note);

                if (detail.sale_order !== null) {
                    let saleOrderEle = $('[name="sale_order"]');
                    saleOrderEle.val(detail.sale_order.code);
                    saleOrderEle.attr('data-id', detail.sale_order.id);
                }

                let dict_self_so_product = {}
                if (page_type === 1) { // load table product for page update
                    await PurchaseRequestAction.changeType(detail?.['request_for'], detail.sale_order ? detail.sale_order.id : null)
                    if (detail?.['request_for'] === 0) { // table for sale order
                        detail.purchase_request_product_datas.map(function (item) {
                            dict_self_so_product[item.sale_order_product] = item;
                            let data_temp = {
                                'id': item.sale_order_product,
                                'product': {
                                    'id': item.product.id,
                                    'title': item.product.title,
                                    'uom': {
                                        'id': item.uom.id,
                                        'title': item.uom.title,
                                    },
                                    'description': item.tax.title,
                                },
                                'quantity': item.quantity,
                                'unit_price': item.unit_price,
                                'sub_total_price': item.sub_total_price,
                            }
                            tableProductForSO.DataTable().row.add(data_temp).draw().node();
                            let trEleCurrent = tableProductForSO.find('tbody tr').last();
                            PurchaseRequestLoadPage.loadMoreInfoProduct(trEleCurrent, item);
                            PurchaseRequestLoadPage.loadTax(trEleCurrent.find('.box-select-tax'), item.tax);
                        })
                    } else { // table for stock and other
                        let list_product_selected = []
                        detail.purchase_request_product_datas.map(function (item) {
                            dict_self_so_product[item.sale_order_product] = item;
                            tableProductForOther.DataTable().row.add(item).draw().node();
                            let trEleCurrent = tableProductForOther.find('tbody tr').last();
                            PurchaseRequestLoadPage.loadTax(trEleCurrent.find('.box-select-tax'), item.tax);
                            PurchaseRequestLoadPage.loadProduct(trEleCurrent.find('.box-select-product'), item.product, list_product_selected);
                            PurchaseRequestLoadPage.loadUoM(trEleCurrent.find('.box-select-uom'), item.uom, {'group': item.product.uom_group});
                            PurchaseRequestLoadPage.loadMoreInfoProduct(trEleCurrent, item);
                            list_product_selected.push(item.product.id);
                        })
                    }
                } else { // load data product for page detail
                    switch (detail?.['request_for']) {
                        case 0:
                            ele_request_for.val('Sale Order');
                            break;
                        case 1:
                            ele_request_for.val('Stock');
                            break;
                        case 2:
                            ele_request_for.val('Other');
                            break;
                    }
                    let table_product = $('#datatable-pr-product').DataTable();
                    detail.purchase_request_product_datas.map(function (item) {
                        table_product.row.add(item).draw().node();
                    })
                }
                $('#data-self-product').text(JSON.stringify(dict_self_so_product))

                $('#input-product-pretax-amount').attr('value', detail.pretax_amount);
                $('#input-product-taxes').attr('value', detail.taxes);
                $('#input-product-total').attr('value', detail.total_price);
            }
        })
    }
}

class PurchaseRequestAction {

    static loadDtbPRProductForSO(product_datas) {
        if (!$.fn.DataTable.isDataTable('#datatable-pr-product-so')) {
            tableProductForSO.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                autoWidth: false,
                data: product_datas,
                columns: [{
                    targets: 0,
                    className: 'wrap-text',
                    render: () => {
                        return ``
                    }
                }, {
                    data: 'product',
                    targets: 1,
                    render: (data, type, row) => {
                        return new PurchaseRequestAction().getHtmlProductTitle(row, data);
                    }
                }, {
                    data: 'product',
                    targets: 2,
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        if (data) return `<span class="inp-description">${data.description}</span>`
                        return `<span class="inp-description"></span>`
                    }
                }, {
                    data: 'product',
                    targets: 3,
                    render: (data, type, row) => {
                        return `<p class="inp-uom" data-id="${data.uom.id}">${data.uom.title}</p>`
                    }
                }, {
                    data: 'quantity',
                    targets: 4,
                    render: (data, type, row) => {
                        return `<input class="form-control inp-quantity" readonly value="${data}">`
                    }
                }, {
                    data: 'unit_price',
                    targets: 5,
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money inp-unit-price" value="${data}" />`
                    }
                }, {
                    targets: 6,
                    render: () => {
                        return $('#box-select-so-product-tax').html();

                    }
                }, {
                    data: 'sub_total_price',
                    targets: 7,
                    render: (data, type, row) => {
                        return `<span class="mask-money inp-subtotal" data-init-money=${data}></span>`

                    }
                },],
            });
        }
    }

    static loadDtbPRProductForOther(product_datas) {
        if (!$.fn.DataTable.isDataTable('#datatable-pr-product-other')) {
            tableProductForOther.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                autoWidth: false,
                data: product_datas,
                columns: [{
                    targets: 0,
                    render: () => {
                        return ``
                    }
                }, {
                    targets: 1,
                    render: (data, type, row) => {
                        return $('#box-select-so-product').html()
                    }
                }, {
                    data: 'description',
                    targets: 2,
                    render: (data, type, row) => {
                        return `<span class="inp-description">${data}</span>`

                    }
                }, {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<select class="form-select box-select-uom" data-method="GET" data-url=${urlEle.data('url-uom')} data-keyResp="unit_of_measure"></select>`
                    }
                }, {
                    data: 'quantity',
                    targets: 4,
                    render: (data, type, row) => {
                        return `<input class="form-control inp-quantity" value="${data}">`
                    }
                }, {
                    data: 'unit_price',
                    targets: 5,
                    render: (data, type, row) => {
                        return `<input class="form-control mask-money inp-unit-price"  value="${data}"/>`
                    }
                }, {
                    targets: 6,
                    render: () => {
                        return $('#box-select-so-product-tax').html();

                    }
                }, {
                    data: 'sub_total_price',
                    targets: 7,
                    render: (data, type, row) => {
                        return `<span class="mask-money inp-subtotal" data-init-money=${data}></span>`

                    }
                }, {
                    targets: 8,
                    render: () => {
                        return `<button type="button" class="btn btn-xs btn-soft-danger btn-icon btn-rounded flush-soft-hover del-row"><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`;
                    }
                },],
            });
        }
    }

    static loadPriceSubProduct(ele) {
        let quantity = ele.find('.inp-quantity').val();
        let unit_price = ele.find('.inp-unit-price').valCurrency();
        let ele_subtotal = ele.find('.inp-subtotal');
        ele_subtotal.attr('data-init-money', quantity * unit_price);
        $.fn.initMaskMoney2();
    }

    static loadFinalPrice(ele) {
        let sub_ele = ele.find('tbody tr');
        let total_pretax = 0;
        let taxes = 0;
        let total = 0;
        sub_ele.each(function () {
            let pretax = parseFloat($(this).find('.inp-subtotal').attr('data-init-money'));
            let ele_tax = $(this).find('.box-select-tax');
            let rate_tax = JSON.parse($(`#${ele_tax.data('idx-data-loaded')}`).text())[ele_tax.val()].rate;
            let tax = pretax * rate_tax / 100;
            total_pretax += pretax;
            taxes += tax
            total += pretax + tax;
        })
        $('#input-product-pretax-amount').attr('value', total_pretax);
        $('#input-product-taxes').attr('value', taxes);
        $('#input-product-total').attr('value', total);
        $.fn.initMaskMoney2();
    }

    static deleteDtbPRProduct() {
        $('#input-product-pretax-amount').attr('value', '');
        $('#input-product-taxes').attr('value', '');
        $('#input-product-total').attr('value', '');
    }

    static loadDtbSOProduct(product_datas) {
        if (!$.fn.DataTable.isDataTable('#datatable-product-of-so')) {
            let $table = $('#datatable-product-of-so')
            $table.DataTableDefault({
                rowIdx: true,
                paging: false,
                scrollY: '200px',
                autoWidth: false,
                data: product_datas,
                columns: [{
                    targets: 0,
                    className: 'wrap-text',
                    render: () => {
                        return ``
                    }
                }, {
                    targets: 1,
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="form-check"><input type="checkbox" class="form-check-input inp-check-so-product" data-id="${row.id}"/></span>`
                    }
                }, {
                    data: 'title',
                    targets: 2,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<p>${data}</p>`
                    }
                }, {
                    data: 'quantity',
                    targets: 3,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<p>${data}</p>`
                    }
                }, {
                    data: 'remain',
                    targets: 4,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<p class="p-so-product-remain">${data}</p>`
                    }
                }, {
                    data: 'quantity',
                    targets: 5,
                    className: 'wrap-text',
                    render: () => {
                        return `<input class="form-control inp-request-so-product"/>`
                    }
                },],
            });
        }
    }

    getHtmlProductTitle(row, product) {
        return `<span class="input-affix-wrapper">
                <span class="input-prefix" id="dropdownBeneficiary">
                    <i class="fas fa-info-circle text-primary" aria-expanded="false"
                       data-bs-toggle="dropdown"></i>
                    <span role="menu" class="dropdown-menu ml-4 pl-3 pr-3 pt-3 pb-3"
                          style="width: 25rem;">
                        <div class="row">
                            <span class="col-7">${transEle.data('trans-more-info')}</span>
                            <a class="col-5 text-right" target="_blank"
                               href="${urlEle.data('url-product-detail')}">
                                <span class="badge btn-outline-primary">${transEle.data('trans-more')}&nbsp;<i
                                    class="bi bi-arrow-right"></i></span>
                            </a>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div class="row">
                            <span class="col-5">${transEle.data('trans-product-name')}</span>
                            <span class="col-7 text-primary span-product-name"></span>
                        </div>
                        <div class="row">
                            <span class="col-5">${transEle.data('trans-code')}</span>
                            <span class="col-7 text-primary span-product-code"></span>
                        </div>
                        <div class="row">
                            <span class="col-5">UoM Group</span>
                            <span class="col-7 text-primary span-product-uom-group"></span>
                        </div>
                        <div class="row">
                            <span class="col-5">UoM</span>
                            <span class="col-7 text-primary span-product-uom"></span>
                        </div>
                    </span>
                </span>
                <input class="form-control inp-product" data-so-product-id="${row.id}" data-id="${product.id}" value="${product.title}" readonly/>
            </span>`
    }

    static async loadSaleOrder(sale_order_id) {
        if (!$.fn.DataTable.isDataTable('#datatable-sale-order')) {
            let $table = $('#datatable-sale-order')
            let frm = new SetupFormSubmit($table);
            let config = await loadConfig();
            let list_emp_reference = config.employee_reference.map(obj => obj.employee.id);
            let emp_current_id = $('#employee_current_id').val();
            let url = frm.dataUrl;
            if (!list_emp_reference.includes(emp_current_id)) {
                url = `{0}?employee_inherit={1}`.format_by_idx(frm.dataUrl, emp_current_id)
            }
            $table.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                paging: false,
                scrollY: '200px',
                autoWidth: false,
                ajax: {
                    url: url,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('sale_order_list')) {
                            let sale_order_list = [];
                            resp.data['sale_order_list'].map(function (item) {
                                if (item?.['is_create_purchase_request'] || item.id === sale_order_id) {
                                    sale_order_list.push(item);
                                }
                            })
                            return sale_order_list;
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [{
                    targets: 0,
                    className: 'wrap-text',
                    render: () => {
                        return ``
                    }
                }, {
                    targets: 1,
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="form-check"><input type="radio" name="radioSaleOrder" class="form-check-input inp-check-so" data-id="${row.id}"/></span>`
                    }
                }, {
                    data: 'title',
                    targets: 2,
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<p>${data}</p>`
                    }
                }, {
                    data: 'code',
                    targets: 3,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<p class="p-so-code">${data}</p>`
                    }
                },],
            });
        }
    }

    static loadSOProduct(id, table) {
        let dict_so = JSON.parse($('#data-sale-order').text());
        let dict_so_product = JSON.parse($('#data-sale-order-product').text());
        let dict_self_product = JSON.parse($('#data-self-product').text())
        table.clear().draw();
        if (dict_so.hasOwnProperty(id)) {
            let so_product_datas = dict_so[id]?.['product_data'];
            so_product_datas.map(function (item) {
                let self_product = dict_self_product[item.id];
                let remain = self_product ? item?.['remain_for_purchase_request'] + self_product.quantity : item?.['remain_for_purchase_request']
                let data_temp = {
                    'id': item.id,
                    'title': item.product.title,
                    'quantity': item.product_quantity,
                    'remain': remain,
                }
                table.row.add(data_temp).draw().node();
            })
        } else {
            if (id !== undefined) {
                let url = urlEle.data('url-so-product').format_url_with_uuid(id);
                $.fn.callAjax2({
                    'url': url,
                    'method': 'GET',
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.data.hasOwnProperty('so_product_list')) {
                            dict_so[data?.['so_product_list'].id] = data?.['so_product_list'];
                            $('#data-sale-order').text(JSON.stringify(dict_so));

                            let so_product_datas = data?.['so_product_list']?.['product_data'];
                            so_product_datas.map(function (item) {
                                dict_so_product[item.id] = item;
                                $('#data-sale-order-product').text(JSON.stringify(dict_so_product));
                                if (item.product.product_choice.includes(2)) {
                                    let self_product = dict_self_product[item.id];
                                    let remain = self_product ? item?.['remain_for_purchase_request'] + self_product.quantity : item?.['remain_for_purchase_request']
                                    let data_temp = {
                                        'id': item.id,
                                        'title': item.product.title,
                                        'quantity': item.product_quantity,
                                        'remain': remain,
                                    }
                                    table.row.add(data_temp).draw().node();
                                }
                            })
                        }
                    }
                })
            }
        }
    }

    static updateURLParameter(urlCurrent, paramValue) {
        let param = $.param({
            'type': paramValue
        })
        let url = "{0}?{1}".format_by_idx(urlCurrent, param);
        window.history.replaceState({}, '', url);
    }

// get data form

    getProductDataForStockAndOther() {
        let list_product_data = []
        let ele_tr = $('#datatable-pr-product-other tbody tr');
        ele_tr.each(function () {
            let data = {
                'sale_order_product': null,
                'product': $(this).find('.box-select-product').val(),
                'description': $(this).find('.inp-description').text(),
                'uom': $(this).find('.box-select-uom').val(),
                'quantity': $(this).find('.inp-quantity').val(),
                'unit_price': $(this).find('.inp-unit-price').valCurrency(),
                'tax': $(this).find('.box-select-tax').val(),
                'sub_total_price': $(this).find('.inp-subtotal').attr('data-init-money'),
            }
            list_product_data.push(data)
        })

        return list_product_data
    }

    getProductDataForSaleOrder() {
        let list_product_data = []
        let ele_tr = $('#datatable-pr-product-so tbody tr');
        ele_tr.each(function () {
            let data = {
                'sale_order_product': $(this).find('.inp-product').data('so-product-id'),
                'product': $(this).find('.inp-product').data('id'),
                'description': $(this).find('.inp-description').text(),
                'uom': $(this).find('.inp-uom').data('id'),
                'quantity': $(this).find('.inp-quantity').val(),
                'unit_price': $(this).find('.inp-unit-price').valCurrency(),
                'tax': $(this).find('.box-select-tax').val(),
                'sub_total_price': $(this).find('.inp-subtotal').attr('data-init-money'),
            }
            list_product_data.push(data)
        })

        return list_product_data
    }

    static getDataForm(dataForm, ele_request_for, ele_sale_order) {
        dataForm['supplier'] = supplierSelectEle.val();
        dataForm['contact'] = contactSelectEle.val();
        dataForm['request_for'] = ele_request_for.data('id');
        if (ele_sale_order.data('id') !== '') {
            dataForm['sale_order'] = ele_sale_order.data('id');
        } else {
            dataForm['sale_order'] = null;
        }
        dataForm['system_status'] = 1;
        dataForm['purchase_status'] = 0;

        if (dataForm['request_for'] !== 0) {
            dataForm['purchase_request_product_datas'] = new PurchaseRequestAction().getProductDataForStockAndOther();
        } else {
            dataForm['purchase_request_product_datas'] = new PurchaseRequestAction().getProductDataForSaleOrder();
        }

        dataForm['pretax_amount'] = $('#input-product-pretax-amount').valCurrency();
        dataForm['taxes'] = $('#input-product-taxes').valCurrency();
        dataForm['total_price'] = $('#input-product-total').valCurrency();
        return dataForm
    }

    static loadProductDetail(ele_tr_current, product) {
        ele_tr_current.find('.input-affix-wrapper a').attr('href', urlEle.data('url-product-detail').format_url_with_uuid(product.id));
        ele_tr_current.find('.span-product-name').text(product.title);
        ele_tr_current.find('.span-product-code').text(product.code);
        ele_tr_current.find('.span-product-uom').text(product?.['sale_information']?.['default_uom'].title);
    }

// page detail

    static loadDtbPrProductDetail(product_datas) {
        if (!$.fn.DataTable.isDataTable('#datatable-pr-product')) {
            let $table = $('#datatable-pr-product')
            $table.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                autoWidth: false,
                data: product_datas,
                columns: [{
                    targets: 0,
                    className: 'wrap-text',
                    render: () => {
                        return ``
                    }
                }, {
                    data: 'product',
                    targets: 1,
                    render: (data) => {
                        return `<input class="form-control inp-product" data-id="${data.id}" value="${data.title}" readonly/>`
                    }
                }, {
                    data: 'description',
                    targets: 2,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="inp-description">${data}</span>`
                    }
                }, {
                    data: 'uom',
                    targets: 3,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<p class="inp-uom" data-id="${data.id}">${data.title}</p>`
                    }
                }, {
                    data: 'quantity',
                    targets: 4,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input class="form-control inp-quantity" readonly value="${data}">`
                    }
                }, {
                    data: 'unit_price',
                    targets: 5,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input class="form-control mask-money inp-unit-price" readonly value="${data}"/>`
                    }
                }, {
                    data: 'tax',
                    targets: 6,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>${data.title}</span>`
                    }
                }, {
                    data: 'sub_total_price',
                    targets: 7,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="mask-money inp-subtotal" data-init-money=${data}></span>`

                    }
                },],
            });
        }
    }

    static getListPrProductSelected(ele) {
        let list_selected = []
        $('#datatable-pr-product-other .box-select-product').not(ele).each(function () {
            list_selected.push($(this).val());
        })
        return list_selected
    }

    static delOptionProductSelected(ele) {
        $('#datatable-pr-product-other .box-select-product').not(ele).each(function () {
            let list_selected = PurchaseRequestAction.getListPrProductSelected($(this));
            let optionSelected = $(this).find('option:selected');
            PurchaseRequestLoadPage.loadProduct($(this), {
                'id': optionSelected.val(),
                'title': optionSelected.text()
            }, list_selected)
        })
    }

    static async changeType(type, sale_order_id = null) {
        switch (type) {
            case 0:
                ele_request_for.val('Sale Order');
                ele_request_for.attr('data-id', 0);
                ele_sale_order.closest('.form-group').removeClass('hidden');
                btn_add_product.addClass('hidden');
                btn_change_pr_product.removeClass('hidden');
                tableProductForSO.removeClass('hidden');
                tableProductForOther.DataTable().clear().destroy();
                tableProductForOther.addClass('hidden');
                await PurchaseRequestAction.loadSaleOrder(sale_order_id);
                PurchaseRequestAction.loadDtbSOProduct([]);
                PurchaseRequestAction.loadDtbPRProductForSO();
                break;
            default:
                ele_sale_order.removeAttr('data-id');
                ele_sale_order.text('');
                ele_sale_order.closest('.form-group').addClass('hidden');
                btn_change_pr_product.addClass('hidden');
                btn_add_product.removeClass('hidden');
                tableProductForOther.removeClass('hidden');
                tableProductForOther.DataTable().clear().destroy();
                tableProductForSO.DataTable().clear().destroy();
                tableProductForSO.addClass('hidden');
                PurchaseRequestAction.loadDtbPRProductForOther();
                break;
        }
    }

    static loadMoreInfoSupplier(ele, data) {
        ele.find('a').attr('href', urlEle.data('url-account-detail').format_url_with_uuid(data.id));
        ele.find('.span-supplier-name').text(data.name);
        ele.find('.span-supplier-code').text(data.code);
    }

    static loadMoreInfoContact(ele, data) {
        ele.find('a').attr('href', urlEle.data('url-contact-detail').format_url_with_uuid(data.id));
        ele.find('.span-contact-name').text(data.fullname);
        ele.find('.span-contact-job-title').text(data.job_title);
        ele.find('.span-contact-mobile').text(data.mobile);
        ele.find('.span-contact-email').text(data.email);
    }
}

class PurchaseRequestEvent {
    load(param) {
        // event in model select product from sale order
        $(document).on('change', '.inp-check-so', function () {
            let table_so_product = $('#datatable-product-of-so').DataTable();
            if ($(this).is(':checked')) {
                $('.inp-check-so').not($(this)).prop('checked', false);
                PurchaseRequestAction.loadSOProduct($(this).data('id'), table_so_product);
            } else {
                table_so_product.clear().draw();
            }
        })

        $('#btn-select-so-product').on('click', function () {
            let dict_so_product = JSON.parse($('#data-sale-order-product').text());
            let table_pr_product = tableProductForSO.DataTable();
            table_pr_product.clear().draw();
            let is_input_request = true;
            $('.inp-check-so-product:checked').each(function () {
                let num_request = $(this).closest('tr').find('.inp-request-so-product').val();
                if (num_request === '') {
                    is_input_request = false;
                }
                let product = dict_so_product[$(this).data('id')];
                let data_temp = {
                    'id': product.id,
                    'product': {
                        'id': product.product.id,
                        'title': product.product.title,
                        'uom': product.product.uom,
                        'description': product.product.description,
                    },
                    'quantity': num_request,
                    'unit_price': '',
                    'sub_total_price': '',
                }
                table_pr_product.row.add(data_temp).draw().node();
                let ele_new_product = tableProductForSO.find('tr').last();
                ele_new_product.find('.input-affix-wrapper a').attr('href', urlEle.data('url-product-detail').format_url_with_uuid(product.product.id));
                ele_new_product.find('.span-product-name').text(product.product.title);
                ele_new_product.find('.span-product-code').text(product.product.code);
                ele_new_product.find('.span-product-uom').text(product.product.uom.title);
                ele_new_product.find('.span-product-uom-group').text(product.product.uom_group);
                PurchaseRequestLoadPage.loadTax(ele_new_product.find('.box-select-tax'), product.product.tax_code);
            })
            let ele_so_selected = $('.inp-check-so:checked');
            let ele_so = $('[name="sale_order"]');
            ele_so.val(ele_so_selected.closest('tr').find('.p-so-code').text());
            ele_so.attr('data-id', ele_so_selected.data('id'));
            if (is_input_request) {
                $('#modal-select-sale-order').modal('hide');
                $('.mask-money').attr('value', '');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: transEle.data('trans-enter-request'),
                })
            }
        })

        $(document).on('change', '.inp-request-so-product', function () {
            if (parseInt($(this).val()) > parseInt($(this).closest('tr').find('.p-so-product-remain').text())) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: transEle.data('trans-request-greater-remain'),
                })
                $(this).val(0);
                $(this).closest('tr').find('.inp-check-so-product').prop('checked', false)
            }
        })

        $(document).on('change', '.inp-unit-price', function () {
            let tr_current = $(this).closest('tr');
            if (tr_current.find('.inp-quantity').val() !== '') {
                PurchaseRequestAction.loadPriceSubProduct(tr_current);
                PurchaseRequestAction.loadFinalPrice($(this).closest('table'));
            }
        })

        $(document).on('change', '.inp-quantity', function () {
            let ele_tr_current = $(this).closest('tr');

            checkMergeRow(ele_tr_current)

            if (ele_tr_current.find('.inp-unit-price').val() !== '') {
                PurchaseRequestAction.loadPriceSubProduct(ele_tr_current);
                PurchaseRequestAction.loadFinalPrice($(this).closest('table'));
                $.fn.initMaskMoney2();
            }
        })

        $(document).on('change', '.box-select-tax', function () {
            let tr_current = $(this).closest('tr');
            if (tr_current.find('.inp-quantity').val() !== '' && tr_current.find('.inp-unit-price').attr('value') !== 0) {
                PurchaseRequestAction.loadPriceSubProduct(tr_current);
                PurchaseRequestAction.loadFinalPrice($(this).closest('table'));
                $.fn.initMaskMoney2();
            }
        })

        $('#btn-add-pr-product').on('click', function () {
            let table = tableProductForOther;
            let dataTable = table.DataTable();
            let temp_data = {
                'description': '',
                'unit_price': '',
                'sub_total_price': '',
                'quantity': '',
            }
            dataTable.row.add(temp_data).draw().node();

            let last_row = table.find('tbody tr').last();
            let productSelectEle = last_row.find('.box-select-product');
            let taxSelectEle = last_row.find('.box-select-tax');


            let list_selected = [];
            if (param !== 'stock' && param !== 'other') {
                list_selected = PurchaseRequestAction.getListPrProductSelected(productSelectEle);
            }
            PurchaseRequestLoadPage.loadProduct(productSelectEle, {}, list_selected);
            PurchaseRequestLoadPage.loadTax(taxSelectEle);
        })

        $(document).on('change', '.box-select-uom', function () {
            let ele_tr_current = $(this).closest('tr');
            checkMergeRow(ele_tr_current)
        })

        $(document).on('change', '.box-select-product', function () {
            let product = SelectDDControl.get_data_from_idx($(this), $(this).val());
            let ele_tr_current = $(this).closest('tr');
            let ele_uom = ele_tr_current.find('.box-select-uom');
            let ele_tax = ele_tr_current.find('.box-select-tax');

            checkMergeRow(ele_tr_current)

            ele_uom.empty();
            ele_tax.empty();

            ele_tr_current.find('.inp-description').text(product.description);
            PurchaseRequestLoadPage.loadTax(ele_tax, product?.['purchase_information'].tax);
            PurchaseRequestLoadPage.loadUoM(ele_uom, product?.['purchase_information']?.['uom'], {'group': product?.['general_information'].uom_group.id});
            PurchaseRequestAction.loadProductDetail(ele_tr_current, product)

            if (param !== 'stock' && param !== 'other') {
                PurchaseRequestAction.delOptionProductSelected($(this));
            }
        })
    }
}