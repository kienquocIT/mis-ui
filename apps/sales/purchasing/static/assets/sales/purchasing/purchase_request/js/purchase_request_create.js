$(document).ready(function () {

    let list_contact = [];
    let dict_contact = {};

    const searchParams = new URLSearchParams(window.location.search);
    const param = searchParams.get("type");
    let ele_request_for = $('[name="request_for"]')
    let ele_sale_order = $('[name="sale_order"]')
    let btn_change_pr_product = $('.btn-change-pr-product');
    let btn_add_pr_product = $('.btn-add-pr-product');

    let dict_supplier = {};

    function loadSupplier() {
        let ele = $('#box-select-supplier');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
            'url': url,
            'method': method,
            'isDropdown': true,
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                    ele.append(`<option></option>`)
                    data.account_list.map(function (item) {
                        dict_supplier[item.id] = item;
                        ele.append(`<option value="${item.id}">${item.name}</option>`);
                    })
                }
            }
        })
    }

    function loadContact() {
        let ele = $('#box-select-contact');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax2({
            'url': url,
            'method': method,
            'isDropdown': true,
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.data.hasOwnProperty('contact_list') && Array.isArray(resp.data.contact_list)) {
                    list_contact = data.contact_list;
                    dict_contact = data.contact_list.reduce((obj, item) => {
                        obj[item.id] = item;
                        return obj;
                    }, {});
                }
            }
        })
    }

    function loadTax() {
        let ele = $('#box-select-so-product-tax').find('select');
        let url = ele.data('url');
        let method = ele.data('method');
        $.fn.callAjax2({
            'url': url,
            'method': method,
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('tax_list')) {
                    ele.append(`<option data-value="0"></option>`);
                    data.tax_list.map(function (item) {
                        ele.append(`<option value="${item.id}" data-value="${item.rate}">${item.title} (${item.rate} %)</option>`);
                    })
                }
            }
        })
    }

    let list_uom = [];

    function loadUoM() {
        let ele = $('#box-select-so-product-uom').find('select');
        let url = ele.data('url');
        let method = ele.data('method');
        if (list_uom.length === 0) {
            $.fn.callAjax2({
                'url': url,
                'method': method,
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('unit_of_measure')) {
                        data.unit_of_measure.map(function (item) {
                            list_uom.push(item);
                        })
                    }
                }
            })
        }
    }

    // let list_product = []
    let dict_product = {}

    function loadProduct() {
        let ele = $('#box-select-so-product').find('select');
        let url = ele.data('url');
        let method = ele.data('method');
        if (ele.find('option').length === 0) {
            $.fn.callAjax2({
                'url': url,
                'method': method,
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('product_list')) {
                        ele.append(`<option></option>`);
                        data.product_list.map(function (item) {
                            dict_product[item.id] = item;
                            if (item.product_choice.includes(2)) {
                                ele.append(`<option value="${item.id}">${item.title}</option>`);
                            }
                        })
                    }
                }
            })
        }
    }

    function loadSaleOrder() {
        if (!$.fn.DataTable.isDataTable('#datatable-sale-order')) {
            let $table = $('#datatable-sale-order')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
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
                            return resp.data['sale_order_list'] ? resp.data['sale_order_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        targets: 0,
                        className: 'wrap-text',
                        render: (data, type, row) => {
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
                        render: (data, type, row) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'code',
                        targets: 3,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p class="p-so-code">${data}</p>`
                        }
                    },
                ],
            });
        }
    }

    let list_so_product = [];
    let dict_so_product = {}

    function loadSOProduct() {
        let url = $('#url-factory').data('url-so-product');
        $.fn.callAjax2({
            'url': url,
            'method': 'GET',
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.data.hasOwnProperty('so_product_list') && Array.isArray(resp.data.so_product_list)) {
                    list_so_product = data.so_product_list;
                    dict_so_product = list_so_product.reduce((obj, item) => {
                        obj[item.id] = item;
                        return obj;
                    }, {});
                }
            }
        })
    }

    function loadDtbSOProduct(product_datas) {
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
                        render: (data, type, row) => {
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
                        render: (data, type, row) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'quantity',
                        targets: 3,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'remain',
                        targets: 4,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'request',
                        targets: 5,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<input class="form-control inp-request-so-product"/>`
                        }
                    },
                ],
            });
        }
    }

    function getHtmlProductTitle(product) {
        let ele_trans = $('#trans-factory');
        let ele_url = $('#url-factory');
        return `<span class="input-affix-wrapper">
                <span class="input-prefix" id="dropdownBeneficiary">
                    <i class="fas fa-info-circle text-primary" aria-expanded="false"
                       data-bs-toggle="dropdown"></i>
                    <span role="menu" class="dropdown-menu ml-4 pl-3 pr-3 pt-3 pb-3"
                          style="width: 25rem;">
                        <div class="row">
                            <span class="col-7">${ele_trans.data('trans-more-info')}</span>
                            <a class="col-5 text-right" target="_blank"
                               href="${ele_url.data('url-product-detail')}">
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
                <input class="form-control" data-id="${product.id}" value="${product.title}" readonly/>
            </span>`
    }

    function loadDtbPRProduct(product_datas) {
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
                        render: (data, type, row) => {
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
                            return getHtmlProductTitle(data);
                        }
                    },
                    {
                        targets: 2,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<input class="form-control inp-description" />`
                        }
                    },
                    {
                        data: 'product',
                        targets: 3,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (row.product === undefined) {
                                return $('#box-select-so-product-uom').html();
                            }
                            return `<p class="uom" data-id="${data.uom.id}">${data.uom.title}</p>`
                        }
                    },
                    {
                        data: 'quantity',
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
                        render: (data, type, row) => {
                            return `<input class="form-control mask-money inp-unit-price" />`
                        }
                    },
                    {
                        targets: 6,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return $('#box-select-so-product-tax').html();

                        }
                    },
                    {
                        targets: 7,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="mask-money inp-subtotal" data-init-money=0></span>`

                        }
                    },
                ],
            });
        }
    }

    switch (param) {
        case 'sale-order':
            $('#modal-select-sale-order').modal('show');
            ele_request_for.val('Sale Order');
            ele_request_for.attr('data-id', 0);
            ele_sale_order.closest('.form-group').removeClass('hidden');
            btn_add_pr_product.addClass('hidden');
            loadSaleOrder();
            loadDtbSOProduct([]);
            break;
        case 'stock':
            ele_request_for.val('Stock');
            ele_request_for.attr('data-id', 1);
            ele_sale_order.closest('.form-group').addClass('hidden');
            btn_change_pr_product.addClass('hidden');
            loadProduct();
            loadUoM();
            break;
        case 'other':
            ele_request_for.val('Other');
            ele_request_for.attr('data-id', 2);
            ele_sale_order.closest('.form-group').addClass('hidden');
            btn_change_pr_product.addClass('hidden');
            loadProduct();
            loadUoM();
            break;
    }

    $('[name="delivered_date"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'down',
        minYear: 2000,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY-MM-DD'), 10) + 100
    });

    loadSupplier();
    loadContact();
    // loadSOProduct();
    loadTax();
    loadDtbPRProduct();

    // event in model select product from sale order
    $(document).on('change', '.inp-check-so', function () {
        let table_so_product = $('#datatable-product-of-so').DataTable();
        if ($(this).is(':checked')) {
            $('.inp-check-so').not($(this)).prop('checked', false);
            table_so_product.clear().draw();
            let so_product_datas = list_so_product.filter(obj => obj.sale_order === $(this).data('id') && obj.product.product_choice.includes(2));
            so_product_datas.map(function (item) {
                let data_temp = {
                    'id': item.id,
                    'title': item.product.title,
                    'quantity': item.product_quantity,
                    'remain': item.remain_for_purchase_request,
                }
                table_so_product.row.add(data_temp).draw().node();
            })
        } else {

        }
    })

    $(document).on('click', '#btn-select-so-product', function () {
        let ele_url = $('#url-factory');
        let table_pr_product = $('#datatable-pr-product').DataTable();
        $('.inp-check-so-product:checked').each(function () {
            let ele_tr_current = $(this).closest('tr')
            let num_request = $(this).closest('tr').find('.inp-request-so-product').val();
            let product = dict_so_product[$(this).data('id')];
            let data_temp = {
                'id': product.id,
                'product': {
                    'id': product.product.id,
                    'title': product.product.title,
                    'uom': product.product.uom,
                },
                'quantity': product.product_quantity,
                'request': num_request,
            }
            table_pr_product.row.add(data_temp).draw().node();
            let ele_new_product = $('#datatable-pr-product').find('tr').last();
            ele_new_product.find('.input-affix-wrapper a').attr('href', ele_url.data('url-product-detail').format_url_with_uuid(product.product.id));
            ele_new_product.find('.span-product-name').text(product.product.title);
            ele_new_product.find('.span-product-code').text(product.product.code);
            ele_new_product.find('.span-product-uom').text(product.product.uom.title);
            ele_new_product.find('.span-product-uom-group').text(product.product.uom_group);
        })

        let ele_so_selected = $('.inp-check-so:checked');
        let ele_so = $('[name="sale_order"]');
        ele_so.val(ele_so_selected.closest('tr').find('.p-so-code').text());
        ele_so.attr('data-id', ele_so_selected.data('id'));

        $('#modal-select-sale-order').modal('hide');
    })


    // event in table product of purchase request
    function loadPriceSubProduct(ele) {
        let quantity = ele.find('.inp-quantity').val();
        let unit_price = ele.find('.inp-unit-price').valCurrency();
        let ele_subtotal = ele.find('.inp-subtotal');
        ele_subtotal.attr('data-init-money', quantity * unit_price);
        $.fn.initMaskMoney2();
    }

    function loadFinalPrice(ele) {
        let sub_ele = ele.find('tbody tr');
        let total_pretax = 0;
        let taxes = 0;
        let total = 0;
        sub_ele.each(function () {
            let pretax = parseFloat($(this).find('.inp-subtotal').attr('data-init-money'));
            let tax = pretax * parseFloat($(this).find('.box-select-tax option:selected').data('value')) / 100;
            total_pretax += pretax;
            taxes += tax
            total += pretax + tax;
        })
        $('#input-product-pretax-amount').attr('value', total_pretax);
        $('#input-product-taxes').attr('value', taxes);
        $('#input-product-total').attr('value', total);
        $.fn.initMaskMoney2();
    }

    $(document).on('change', '.inp-unit-price', function () {
        let tr_current = $(this).closest('tr');
        if (tr_current.find('.inp-quantity').val() !== '') {
            loadPriceSubProduct(tr_current);
            loadFinalPrice($(this).closest('table'));

        }
    })

    $(document).on('change', '.inp-quantity', function () {
        let tr_current = $(this).closest('tr');
        if (tr_current.find('.inp-unit-price').val() !== '') {
            loadPriceSubProduct(tr_current);
            loadFinalPrice($(this).closest('table'));
            $.fn.initMaskMoney2();
        }
    })

    $(document).on('change', '.box-select-tax', function () {
        let tr_current = $(this).closest('tr');
        if (tr_current.find('.inp-quantity').val() !== '' && tr_current.find('.inp-unit-price').attr('value') !== 0) {
            loadPriceSubProduct(tr_current);
            loadFinalPrice($(this).closest('table'));
            $.fn.initMaskMoney2();
        }
    })

    $(document).on('click', '.btn-add-pr-product', function () {
        let table_pr_product = $('#datatable-pr-product').DataTable();
        table_pr_product.row.add([]).draw().node();
    })

    $(document).on('change', '.box-select-product', function () {
        let product = dict_product[$(this).val()];
        let ele_tr_current = $(this).closest('tr');
        let ele_uom = ele_tr_current.find('.box-select-uom');
        list_uom.filter(obj => obj.group.id === product.general_information.uom_group.id).map(function (item) {
            ele_uom.append(`<option value="${item.id}">${item.title}</option>`)
        })
        let ele_url = $('#url-factory');
        ele_tr_current.find('.input-affix-wrapper a').attr('href', ele_url.data('url-product-detail').format_url_with_uuid(product.id));
        ele_tr_current.find('.span-product-name').text(product.title);
        ele_tr_current.find('.span-product-code').text(product.code);
        ele_tr_current.find('.span-product-uom').text(product.sale_information.default_uom.title);
        ele_tr_current.find('.span-product-uom-group').text(product.general_information.uom_group.title);
    })

    // event change supplier
    $(document).on('change', '#box-select-supplier', function () {
        let supplier_id = $(this).val();
        let ele_contact = $('#box-select-contact');
        ele_contact.empty();
        ele_contact.append(`<option></option>`)
        list_contact.map(function (item) {
            if (item.account_name.id === supplier_id) {
                ele_contact.append(`<option value="${item.id}">${item.fullname}</option>`)
            }
        })
        let ele_url = $('#url-factory');
        let supplier_current = dict_supplier[$(this).val()];
        let ele_parent = $(this).closest('.input-affix-wrapper');
        ele_parent.find('a').attr('href', ele_url.data('url-account-detail').format_url_with_uuid(supplier_current.id));
        ele_parent.find('.span-supplier-name').text(supplier_current.name);
        ele_parent.find('.span-supplier-code').text(supplier_current.code);
        ele_parent.find('.span-supplier-owner').text(supplier_current.owner.fullname);
        ele_parent.find('.span-supplier-industry').text(supplier_current.industry.title);
    })

    // event change type of Purchase Request

    function updateURLParameter(paramName, paramValue) {
        const url = new URL(window.location.href);
        if (url.searchParams.has(paramName)) {
            url.searchParams.set(paramName, paramValue);
        } else {
            url.searchParams.append(paramName, paramValue);
        }

        window.history.replaceState({}, '', url.toString(undefined));
    }

    function deleteDtbPRProduct() {
        let table = $('#datatable-pr-product').DataTable();
        table.clear().draw();
        $('#input-product-pretax-amount').attr('value', '');
        $('#input-product-taxes').attr('value', '');
        $('#input-product-total').attr('value', '');
    }

    $(document).on('click', '#btn-select-type-sale-order', function () {
        updateURLParameter('type', 'sale-order');
        ele_request_for.val('Sale Order');
        ele_request_for.attr('data-id', 0);
        ele_sale_order.closest('.form-group').removeClass('hidden');
        btn_add_pr_product.addClass('hidden');
        btn_change_pr_product.removeClass('hidden');
        loadSaleOrder();
        loadDtbSOProduct([]);
        deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    $(document).on('click', '#btn-select-type-stock', function () {
        updateURLParameter('type', 'stock');
        ele_request_for.val('Stock');
        ele_request_for.attr('data-id', 1);
        ele_sale_order.closest('.form-group').addClass('hidden');
        btn_change_pr_product.addClass('hidden');
        btn_add_pr_product.removeClass('hidden');
        loadProduct();
        loadUoM();
        deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    $(document).on('click', '#btn-select-type-other', function () {
        updateURLParameter('type', 'other');
        ele_request_for.val('Other');
        ele_request_for.attr('data-id', 2);
        ele_sale_order.closest('.form-group').addClass('hidden');
        btn_change_pr_product.addClass('hidden');
        btn_add_pr_product.removeClass('hidden');
        loadProduct();
        loadUoM();
        deleteDtbPRProduct();
        $(this).closest('.modal').modal('hide');
    })

    // event change contact

    $(document).on('change', '#box-select-contact', function () {
        let ele_url = $('#url-factory');
        let contact_current = dict_contact[$(this).val()];
        let ele_parent = $(this).closest('.input-affix-wrapper');
        ele_parent.find('a').attr('href', ele_url.data('url-account-detail').format_url_with_uuid(contact_current.id));
        ele_parent.find('.span-contact-name').text(contact_current.fullname);
        ele_parent.find('.span-contact-job-title').text(contact_current.job_title);
        ele_parent.find('.span-contact-mobile').text(contact_current.mobile);
        ele_parent.find('.span-contact-email').text(contact_current.email);
        ele_parent.find('.span-contact-report-to').text(contact_current.report_to.name);
    })

    function getProductDataForStockAndOther(){
        let list_product_data = []
        let ele_tr = $('#datatable-pr-product tbody tr');
        ele_tr.each(function (){
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

    function getDataForm(dataForm) {
        dataForm['supplier'] = $('#box-select-supplier').val();
        dataForm['contact'] = $('#box-select-contact').val();
        dataForm['request_for'] = ele_request_for.data('id');
        if (ele_sale_order.val() !== '') {
            dataForm['sale_order'] = ele_sale_order.val();
        } else {
            dataForm['sale_order'] = null;
        }
        dataForm['system_status'] = 0;
        dataForm['purchase_status'] = 0;

        if (dataForm['request_for'] !== '0'){
            dataForm['purchase_request_product_datas'] = getProductDataForStockAndOther();
        }

        dataForm['pretax_amount'] = $('#input-product-pretax-amount').valCurrency();
        dataForm['taxes'] = $('#input-product-taxes').valCurrency();
        dataForm['total_price'] = $('#input-product-total').valCurrency();
        return dataForm
    }

    const frm_create = $('#form-create-pr');
    frm_create.submit(function (event) {
        event.preventDefault();
        let frm = new SetupFormSubmit(frm_create);
        let csr = $("[name=csrfmiddlewaretoken]").val();
        let frm_data = getDataForm(frm.dataForm);
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm_data, csr).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: data.message}, 'success')
                }
            }, (errs) => {
                console.log(errs)
                $.fn.notifyB({description: "PR create fail"}, 'failure')
            }
        )
    })
})