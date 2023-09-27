function loadDetailBeneficiary(id) {
    let ele = $('[name="creator"]');
    let frm = new SetupFormSubmit(ele);
    $.fn.callAjax2({
        'url': frm.getUrlDetail(id),
        'method': frm.dataMethod
    }).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee')) {
                let dropdown = $('#dropdownBeneficiary');
                dropdown.find('[name="beneficiary-name"]').text(data.employee.full_name);
                dropdown.find('[name="beneficiary-code"]').text(data.employee.code);
                dropdown.find('[name="beneficiary-department"]').text(data.employee.group.title);
                let oldHref = dropdown.find('a').attr('href');
                let newHref = oldHref.replace(0, id)
                dropdown.find('a').attr('href', newHref);
            }
        }
    }, (errs) => {
    },)
}

function loadCreator(id) {
    let ele = $('[name="creator"]');
    let frm = new SetupFormSubmit(ele);
    if (id === null) {
        id = ele.attr('data-id')
    }
    $.fn.callAjax2({
        'url': frm.getUrlDetail(id),
        'method': frm.dataMethod
    }).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee')) {
                ele.val(data.employee.full_name);
                let dropdown = $('#dropdownCreator');
                dropdown.find('[name="creator-name"]').text(data.employee.full_name);
                dropdown.find('[name="creator-code"]').text(data.employee.code);
                dropdown.find('[name="creator-department"]').text(data.employee.group.title);
                let oldHref = dropdown.find('a').attr('href');
                let newHref = oldHref.replace(0, data.employee.id)
                dropdown.find('a').attr('href', newHref);
            }
        }
    }, (errs) => {
    },)
}

function loadCostTable(data) {
    let table = $('#dtbProduct').DataTable();
    data.map(function (item) {
        table.row.add(item).draw().node();
    })
}

function loadDetailAdvancePayment(id, type = 'create') {
    let url = $('#url-factory').data('url-detail-ap').format_url_with_uuid(id)
    $.fn.callAjax2({
        'url': url,
        'method': "GET"
    }).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_detail')) {
                let ele_beneficiary = $('#chooseBeneficiary');
                ele_beneficiary.empty();
                let sale_code_ele = $('[name="sale_code"]');
                if (data?.['advance_payment_detail']?.['sale_order_mapped'].length > 0) {
                    sale_code_ele.val(data?.['advance_payment_detail']?.['sale_order_mapped'][0].opportunity_linked.code);
                } else if (data?.['advance_payment_detail']?.['quotation_mapped'].length > 0) {
                    sale_code_ele.val(data?.['advance_payment_detail']?.['quotation_mapped'][0].opportunity_linked.code);
                } else if (data?.['advance_payment_detail']?.['opportunity_mapped'].length > 0) {
                    sale_code_ele.val(data?.['advance_payment_detail']?.['opportunity_mapped'][0].code);
                } else {
                    sale_code_ele.val('');
                }
                ReturnAdvanceLoadPage.loadBeneficiary(ele_beneficiary, data?.['advance_payment_detail'].beneficiary)
                loadDetailBeneficiary(data?.['advance_payment_detail'].beneficiary.id);

                console.log(data?.['advance_payment_detail'])
                if (type === 'create') {
                    loadCostTable(data?.['advance_payment_detail']?.['expense_items'])
                }
            }
        }
    }, (errs) => {
    },)
}

function loadDataTableCost(data, is_detail = false) {
    if (!$.fn.DataTable.isDataTable('#dtbProduct')) {
        let $table = $('#dtbProduct')
        $table.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            data: data,
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
                    data: 'expense_name',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="text-primary row-expense" data-id="${row.id}">${data}</span>`
                    }
                },
                {
                    data: 'expense_type',
                    targets: 2,
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="row-expense-type" data-id="${data.id}">${data.title}</span>`
                    }
                },
                {
                    data: 'remain_total',
                    targets: 3,
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${data}"></span>`
                    }
                },
                {
                    data: 'return_value',
                    targets: 4,
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        let value = data !== undefined ? data : '';
                        if (is_detail) {
                            return `<input class="mask-money form-control return-price" type="text" data-return-type="number" value="${value}" disabled>`
                        }
                        else{
                            return `<input class="mask-money form-control return-price" type="text" data-return-type="number" value="${value}">`
                        }
                    }
                },
            ],
        });
    }
}

function loadDataTableProductPageDetailloadDataTableProductPageDetail(data, type_page = 'create') {
    if (!$.fn.DataTable.isDataTable('#dtbProduct')) {
        let $table = $('#dtbProduct')
        $table.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            data: data,
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
                    data: 'product',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${data.title}</span>`
                    }
                },
                {
                    data: 'product_type',
                    targets: 2,
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span>${data}</span>`
                    }
                },
                {
                    data: 'remain_total',
                    targets: 3,
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${data}"></span>`
                    }
                },
                {
                    data: 'return_price',
                    targets: 4,
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        if (type_page === 'detail') {
                            return `<input class="mask-money form-control return-price" type="text" data-return-type="number" value="${data}" disabled>`
                        } else
                            return `<input class="mask-money form-control return-price" type="text" data-return-type="number" value="${data}">`
                    }
                },
            ],
        });
    }
}

class ReturnAdvanceLoadPage {
    static saleCodeEle = $('#inp-sale-code');
    static methodPaymentEle = $('#box-method-payment')

    static loadAdvancePayment(ele, data, params) {
        ele.initSelect2({
            data: params.advance_payment ? params.advance_payment : data,
            disabled: !(ele.attr('data-url')),
            'dataParams': params,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                if ($.fn.hasOwnProperties(params, ['advance_payment'])) {
                    resp.data[keyResp].map(function (item) {
                        if (item.id === params.advance_payment.id) {
                            list_result.push(item)
                        }
                    })
                } else if ($.fn.hasOwnProperties(params, ['opportunity'])) {
                    resp.data[keyResp].map(function (item) {
                        if (item?.['opportunity_id'] === params.opportunity.id) {
                            list_result.push(item)
                        }
                    })
                } else {
                    list_result = resp.data[keyResp]
                }
                return list_result
            }
        }).on('change', function () {
            loadDetailAdvancePayment($(this).val())
        });
    }

    static loadBeneficiary(ele, data) {
        ele.initSelect2({
            data: data,
            keyText: 'full_name',
        })
    }

    static loadMethodPayment(data = {}) {
        ReturnAdvanceLoadPage.methodPaymentEle.initSelect2({
            data: data
        })
    }
}

function loadDetail(id, frmDetail) {
    let frm = new SetupFormSubmit(frmDetail);
    let choose_AP_ele = $('#chooseAdvancePayment');
    $.fn.callAjax2({
        url: frm.getUrlDetail(id),
        method: 'GET'
    }).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            let return_advance_detail = data?.['return_advance'];
            $x.fn.renderCodeBreadcrumb(return_advance_detail);
            $.fn.compareStatusShowPageAction(return_advance_detail);
            $('.header-code').text(return_advance_detail.code);
            $('[name="title"]').val(return_advance_detail.title);
            ReturnAdvanceLoadPage.loadAdvancePayment(choose_AP_ele, return_advance_detail.advance_payment, {});
            loadDetailAdvancePayment(return_advance_detail.advance_payment.id, 'detail');
            loadCreator(return_advance_detail.creator);
            $('[name="date_created"]').val(return_advance_detail.date_created.split(" ")[0]);
            $('[name="method"]').val(return_advance_detail.method);
            loadCostTable(return_advance_detail.cost);
            let total_value = return_advance_detail.cost.map(obj => obj?.['return_price']).reduce((a, b) => a + b, 0)
            $('#total-value').attr('data-init-money', total_value);
            if (return_advance_detail.money_received) {
                let money_received_ele = $('#money-received')
                money_received_ele.prop('checked', true);
            }

        }
    }, (errs) => {
    },)
}