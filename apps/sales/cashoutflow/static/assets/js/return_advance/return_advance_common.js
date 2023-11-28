let transEle = $('#trans-factory');
let urlEle = $('#url-factory');

function loadDetailBeneficiary(id) {
    let ele = $('[name="employee_created_id"]');
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
    let ele = $('[name="employee_created_id"]');
    let frm = new SetupFormSubmit(ele);
    if (!id) {
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
    table.clear().draw();
    let dict_cost = JSON.parse($('#data-costs').text());
    data.map(function (item) {
        if (dict_cost[item.id]) {
            item['remain_total'] += dict_cost[item.id].return_value;
        }
        table.row.add(item).draw();
    })
}

function loadDetailAdvancePayment(id, type = 'create') {
    let url = urlEle.data('url-detail-ap').format_url_with_uuid(id);
    $.fn.callAjax2({
        'url': url,
        'method': "GET"
    }).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_detail')) {
                let ele_beneficiary = $('#chooseBeneficiary');
                ele_beneficiary.empty();
                ReturnAdvanceLoadPage.loadBeneficiary(ele_beneficiary, data?.['advance_payment_detail'].employee_inherit)
                loadDetailBeneficiary(data?.['advance_payment_detail'].employee_inherit.id);

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
                    render: (data, type, row) => {
                        let value = data !== undefined ? data : '';
                        if (is_detail) {
                            return `<input class="mask-money form-control return-price" type="text" data-return-type="number" value="${value}" disabled>`
                        } else {
                            return `<input class="mask-money form-control return-price" type="text" data-return-type="number" value="${value}">`
                        }
                    }
                },
            ],
        });
    }
}

class ReturnAdvanceLoadPage {
    load() {
        $('input[name="date_created"]').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: false,
            minYear: 1901,
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY'), 10)
        });
        $('.daterangepicker').remove();

        $(document).on('change', '.return-price', function () {
            let total = 0;
            let ele = $(this).closest('tr').find('span.mask-money');
            if ($(this).valCurrency() > ele.attr('data-init-money')) {
                $.fn.notifyB({description: $('#trans-factory').data('trans-greater-remain')}, 'failure');
                $(this).attr('value', '');
            }
            $('.return-price').each(function () {
                total += $(this).valCurrency();
            })
            $('#total-value').attr('data-init-money', total);
            $.fn.initMaskMoney2();
        })
    }

    static saleCodeEle = $('#inp-sale-code');
    static methodPaymentEle = $('#box-method-payment')

    static loadAdvancePayment(ele, data, params) {
        ele.initSelect2({
            data: params.advance_payment ? params.advance_payment : data,
            disabled: !(ele.attr('data-url')),
            'dataParams': params,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                if (params?.['advance_payment']) {
                    resp.data[keyResp].map(function (item) {
                        if (item.id === params?.['advance_payment'].id) {
                            list_result.push(item)
                        }
                    })
                } else if (params?.['opportunity']) {
                    resp.data[keyResp].map(function (item) {
                        if (item?.['opportunity_id'] === params?.['opportunity'].id) {
                            list_result.push(item)
                        }
                    })
                } else {
                    list_result = resp.data[keyResp]
                }
                return list_result
            }
        }).on('change', function () {
            let obj_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
            let sale_code_mapped = null
            if (Object.keys(obj_selected?.['opportunity_mapped']).length !== 0) {
                sale_code_mapped = obj_selected?.['opportunity_mapped']
                if (obj_selected?.['opportunity_mapped']?.['is_close']) {
                    $.fn.notifyB({description: `Opportunity ${obj_selected?.['opportunity_mapped']?.['code']} has been closed. Can not select.`}, 'failure');
                    $(this).find('option').remove();
                    return;
                }
            }
            if (Object.keys(obj_selected?.['quotation_mapped']).length !== 0) {
                sale_code_mapped = obj_selected?.['quotation_mapped']
            }
            if (Object.keys(obj_selected?.['sale_order_mapped']).length !== 0) {
                sale_code_mapped = obj_selected?.['sale_order_mapped']
            }
            if (sale_code_mapped) {
                $('#inp-sale-code').val(sale_code_mapped.code)
            }
            loadDetailAdvancePayment($(this).val())
        });
    }

    static loadBeneficiary(ele, data) {
        ele.initSelect2({
            data: data,
            keyText: 'full_name',
        })
    }

    static loadMethodPayment() {
        let data = [
            {
                'id': 0,
                'title': transEle.data('trans-cash'),
            },
            {
                'id': 1,
                'title': transEle.data('trans-bank-transfer'),
            }
        ]
        ReturnAdvanceLoadPage.methodPaymentEle.initSelect2({
            data: data,
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
            let sale_code_mapped =null;
            if (Object.keys(return_advance_detail.advance_payment?.['opportunity_mapped']).length !== 0) {
                sale_code_mapped = return_advance_detail.advance_payment?.['opportunity_mapped']
            }
            if (Object.keys(return_advance_detail.advance_payment?.['quotation_mapped']).length !== 0) {
                sale_code_mapped = return_advance_detail.advance_payment?.['quotation_mapped']
            }
            if (Object.keys(return_advance_detail.advance_payment?.['sale_order_mapped']).length !== 0) {
                sale_code_mapped = return_advance_detail.advance_payment?.['sale_order_mapped']
            }
            if (sale_code_mapped) {
                $('#inp-sale-code').val(sale_code_mapped.code)
            }
            loadDetailAdvancePayment(return_advance_detail.advance_payment.id, 'detail');
            loadCreator(return_advance_detail.employee_created);
            $('[name="date_created"]').val(return_advance_detail.date_created.split(" ")[0]);
            ReturnAdvanceLoadPage.methodPaymentEle.val(return_advance_detail.method).trigger('change');

            let script_costs = $('#data-costs');
            let dict_cost = JSON.parse(script_costs.text());

            loadCostTable(return_advance_detail.cost);
            return_advance_detail.cost.map(function (item) {
                dict_cost[item?.['id']] = item;
            })
            script_costs.text(JSON.stringify(dict_cost));
            $('#total-value').attr('data-init-money', return_advance_detail.return_total);
            if (return_advance_detail.money_received) {
                let money_received_ele = $('#money-received')
                money_received_ele.prop('checked', true);
            }

        }
    }, (errs) => {
    },)
}