let urlEle = $('#url-factory');

class PurchaseRequestLoadPage {
    static supplierSelectEle = $('#box-select-supplier')
    static contactSelectEle = $('#box-select-contact')

    static loadSupplier(data) {
        this.supplierSelectEle.initSelect2({
            data: data,
            dataParams: {
                'account_types_mapped__account_type_order': 1
            }
        }).on('change', function () {
            PurchaseRequestLoadPage.contactSelectEle.empty();
            let supplier_current = SelectDDControl.get_data_from_idx($(this), $(this).val());
            PurchaseRequestLoadPage.loadContact(supplier_current.owner, $(this).val());
            let ele_parent = $(this).closest('.input-affix-wrapper');
            ele_parent.find('a').attr('href', urlEle.data('url-account-detail').format_url_with_uuid(supplier_current.id));
            ele_parent.find('.span-supplier-name').text(supplier_current.name);
            ele_parent.find('.span-supplier-code').text(supplier_current.code);
            ele_parent.find('.span-supplier-owner').text(supplier_current?.['owner'].fullname);
            ele_parent.find('.span-supplier-industry').text(supplier_current?.['industry'].title);
        })
    }

    static loadContact(data, account_id) {
        this.contactSelectEle.initSelect2({
            data: data,
            'dataParams': {'account_name_id': account_id},
        }).on('change', function () {
            let ele_url = urlEle;
            let contact_current = SelectDDControl.get_data_from_idx($(this), $(this).val());
            let ele_parent = $(this).closest('.input-affix-wrapper');
            ele_parent.find('a').attr('href', ele_url.data('url-account-detail').format_url_with_uuid(contact_current.id));
            ele_parent.find('.span-contact-name').text(contact_current.fullname);
            ele_parent.find('.span-contact-job-title').text(contact_current.job_title);
            ele_parent.find('.span-contact-mobile').text(contact_current.mobile);
            ele_parent.find('.span-contact-email').text(contact_current.email);
            ele_parent.find('.span-contact-report-to').text(contact_current?.['report_to']?.['name']);
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
}

class PurchaseRequestAction {

    static loadDtbPRProduct(product_datas) {
        if (!$.fn.DataTable.isDataTable('#datatable-pr-product')) {
            let $table = $('#datatable-pr-product')
            $table.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
                paging: false,
                autoWidth: false,
                data: product_datas,
                columns: [
                    {
                        targets: 0,
                        className: 'wrap-text',
                        render: () => {
                            return ``
                        }
                    },
                    {
                        data: 'product',
                        targets: 1,
                        render: (data, type, row) => {
                            if (data === undefined) {
                                return $('#box-select-so-product').html()
                            }
                            return new PurchaseRequestAction().getHtmlProductTitle(row, data);
                        }
                    },
                    {
                        targets: 2,
                        className: 'wrap-text',
                        render: () => {
                            return `<input class="form-control inp-description" />`
                        }
                    },
                    {
                        data: 'product',
                        targets: 3,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (row.product === undefined) {
                                return `<select class="form-select box-select-uom" data-method="GET" data-url=${urlEle.data('url-uom')} data-keyResp="unit_of_measure"></select>`
                            }
                            return `<p class="inp-uom" data-id="${data.uom.id}">${data.uom.title}</p>`
                        }
                    },
                    {
                        data: 'request',
                        targets: 4,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (row.product === undefined) {
                                return `<input class="form-control inp-quantity"/>`
                            }
                            return `<div class="readonly"><input class="form-control inp-quantity" readonly value="${data}"></div>`
                        }
                    },
                    {
                        targets: 5,
                        className: 'wrap-text',
                        render: () => {
                            return `<input class="form-control mask-money inp-unit-price" />`
                        }
                    },
                    {
                        targets: 6,
                        className: 'wrap-text',
                        render: () => {
                            return $('#box-select-so-product-tax').html();

                        }
                    },
                    {
                        targets: 7,
                        className: 'wrap-text',
                        render: () => {
                            return `<span class="mask-money inp-subtotal" data-init-money=0></span>`

                        }
                    },
                ],
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
        let table = $('#datatable-pr-product').DataTable();
        table.clear().draw();
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
                columns: [
                    {
                        targets: 0,
                        className: 'wrap-text',
                        render: () => {
                            return ``
                        }
                    },
                    {
                        targets: 1,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="form-check"><input type="checkbox" class="form-check-input inp-check-so-product" data-id="${row.id}"/></span>`
                        }
                    },
                    {
                        data: 'title',
                        targets: 2,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'quantity',
                        targets: 3,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'remain',
                        targets: 4,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p class="p-so-product-remain">${data}</p>`
                        }
                    },
                    {
                        data: 'request',
                        targets: 5,
                        className: 'wrap-text',
                        render: () => {
                            return `<input class="form-control inp-request-so-product"/>`
                        }
                    },
                ],
            });
        }
    }

    getHtmlProductTitle(row, product) {
        let ele_trans = $('#trans-factory');
        return `<span class="input-affix-wrapper">
                <span class="input-prefix" id="dropdownBeneficiary">
                    <i class="fas fa-info-circle text-primary" aria-expanded="false"
                       data-bs-toggle="dropdown"></i>
                    <span role="menu" class="dropdown-menu ml-4 pl-3 pr-3 pt-3 pb-3"
                          style="width: 25rem;">
                        <div class="row">
                            <span class="col-7">${ele_trans.data('trans-more-info')}</span>
                            <a class="col-5 text-right" target="_blank"
                               href="${urlEle.data('url-product-detail')}">
                                <span class="badge btn-outline-primary">${ele_trans.data('trans-more')}&nbsp;<i
                                    class="bi bi-arrow-right"></i></span>
                            </a>
                        </div>
                        <div class="dropdown-divider"></div>
                        <div class="row">
                            <span class="col-5">${ele_trans.data('trans-product-name')}</span>
                            <span class="col-7 text-primary span-product-name"></span>
                        </div>
                        <div class="row">
                            <span class="col-5">${ele_trans.data('trans-code')}</span>
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

    static loadSaleOrder() {
        if (!$.fn.DataTable.isDataTable('#datatable-sale-order')) {
            let $table = $('#datatable-sale-order')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                paging: false,
                scrollY: '200px',
                autoWidth: false,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('sale_order_list')) {
                            return resp.data['sale_order_list'] ? resp.data['sale_order_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        targets: 0,
                        className: 'wrap-text',
                        render: () => {
                            return ``
                        }
                    },
                    {
                        targets: 1,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="form-check"><input type="checkbox" class="form-check-input inp-check-so" data-id="${row.id}"/></span>`
                        }
                    },
                    {
                        data: 'title',
                        targets: 2,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'code',
                        targets: 3,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p class="p-so-code">${data}</p>`
                        }
                    },
                ],
            });
        }
    }

    static loadSOProduct(dict_so, dict_so_product, id, table) {
        table.clear().draw();
        if (dict_so.hasOwnProperty(id)) {
            let so_product_datas = dict_so[id]?.['product_data'];
            so_product_datas.map(function (item) {
                let data_temp = {
                    'id': item.id,
                    'title': item.product.title,
                    'quantity': item.product_quantity,
                    'remain': item?.['remain_for_purchase_request'],
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
                            let so_product_datas = data?.['so_product_list']?.['product_data'];
                            so_product_datas.map(function (item) {
                                dict_so_product[item.id] = item;
                                if (item.product.product_choice.includes(2)) {
                                    let data_temp = {
                                        'id': item.id,
                                        'title': item.product.title,
                                        'quantity': item.product_quantity,
                                        'remain': item?.['remain_for_purchase_request'],
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

    static updateURLParameter(paramValue) {
        let param = $.param({
            'type': paramValue
        })
        let url = "{0}?{1}".format_by_idx(urlEle.data('url-this-page'), param);
        window.history.replaceState({}, '', url);
    }

// get data form

    getProductDataForStockAndOther() {
        let list_product_data = []
        let ele_tr = $('#datatable-pr-product tbody tr');
        ele_tr.each(function () {
            let data = {
                'sale_order_product': null,
                'product': $(this).find('.box-select-product').val(),
                'description': $(this).find('.inp-description').val(),
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
        let ele_tr = $('#datatable-pr-product tbody tr');
        ele_tr.each(function () {
            let data = {
                'sale_order_product': $(this).find('.inp-product').data('so-product-id'),
                'product': $(this).find('.inp-product').data('id'),
                'description': $(this).find('.inp-description').val(),
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
        dataForm['supplier'] = PurchaseRequestLoadPage.supplierSelectEle.val();
        dataForm['contact'] = PurchaseRequestLoadPage.contactSelectEle.val();
        dataForm['request_for'] = ele_request_for.data('id');
        if (ele_sale_order.data('id') !== '') {
            dataForm['sale_order'] = ele_sale_order.data('id');
        } else {
            dataForm['sale_order'] = null;
        }
        dataForm['system_status'] = 0;
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

    static loadProductDetail(ele_tr_current, ele_url, product) {
        ele_tr_current.find('.input-affix-wrapper a').attr('href', ele_url.data('url-product-detail').format_url_with_uuid(product.id));
        ele_tr_current.find('.span-product-name').text(product.title);
        ele_tr_current.find('.span-product-code').text(product.code);
        ele_tr_current.find('.span-product-uom').text(product?.['sale_information']?.['default_uom'].title);
        ele_tr_current.find('.span-product-uom-group').text(product?.['general_information'].uom_group.title);
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
                columns: [
                    {
                        targets: 0,
                        className: 'wrap-text',
                        render: () => {
                            return ``
                        }
                    },
                    {
                        data: 'product',
                        targets: 1,
                        render: (data) => {
                            return `<input class="form-control inp-product" data-id="${data.id}" value="${data.title}" readonly/>`
                        }
                    },
                    {
                        data: 'description',
                        targets: 2,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<input class="form-control inp-description" value="${data}" readonly/>`
                        }
                    },
                    {
                        data: 'uom',
                        targets: 3,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p class="inp-uom" data-id="${data.id}">${data.title}</p>`
                        }
                    },
                    {
                        data: 'quantity',
                        targets: 4,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<input class="form-control inp-quantity" readonly value="${data}">`
                        }
                    },
                    {
                        data: 'unit_price',
                        targets: 5,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<input class="form-control mask-money inp-unit-price" readonly value="${data}"/>`
                        }
                    },
                    {
                        data: 'tax',
                        targets: 6,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<span>${data.title}</span>`
                        }
                    },
                    {
                        data: 'sub_total_price',
                        targets: 7,
                        className: 'wrap-text',
                        render: (data) => {
                            return `<span class="mask-money inp-subtotal" data-init-money=${data}></span>`

                        }
                    },
                ],
            });
        }
    }

    static getListPrProductSelected(ele) {
        let list_selected = []
        $('#datatable-pr-product .box-select-product').not(ele).each(function () {
            list_selected.push($(this).val());
        })
        return list_selected
    }

    static delOptionProductSelected(ele) {
        $('#datatable-pr-product .box-select-product').not(ele).each(function () {
            let list_selected = PurchaseRequestAction.getListPrProductSelected($(this));
            let optionSelected = $(this).find('option:selected');
            PurchaseRequestLoadPage.loadProduct($(this), {
                'id': optionSelected.val(),
                'title': optionSelected.text()
            }, list_selected)
        })
    }
}
