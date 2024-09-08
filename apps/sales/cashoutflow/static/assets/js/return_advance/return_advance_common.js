const initEmployee = JSON.parse($('#employee_current').text());
const creatorEle = $('#creator-select-box')
const advancePaymentEle = $('#chooseAdvancePayment')
const chooseBeneficiaryEle = $('#chooseBeneficiary')
const returnAP_method_Ele =$('#box-method-payment')
const returnAP_method_default_data = [
    {'value': 0, 'title': returnAP_method_Ele.attr('data-trans-cash')},
    {'value': 1, 'title': returnAP_method_Ele.attr('data-trans-bank-transfer')},
]

class ReturnAPLoadPage {
    static LoadCreatedDate() {
        $('#created_date').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: false,
            minYear: 1901,
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY'), 10)
        });
    }
    static LoadCreator(data) {
        creatorEle.val(data?.['full_name'])
        creatorEle.prop('readonly', true).prop('disabled', true)
    }
    static LoadCreatorInfor(data) {
        let btn_detail = $('#btn-detail-creator-tab');
        $('#creator-detail-span').prop('hidden', false);
        $('#creator-name').text(data?.['full_name']);
        $('#creator-code').text(data?.['code']);
        $('#creator-department').text(data?.['group']['title']);
        let url = btn_detail.attr('data-url').replace('0', data?.['id']);
        btn_detail.attr('href', url);
    }
    static LoadAdvancePayment(data, params) {
        advancePaymentEle.initSelect2({
            allowClear: data === null,
            ajax: {
                data: params,
                url: advancePaymentEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'advance_payment_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            let selected_ap = SelectDDControl.get_data_from_idx(advancePaymentEle, advancePaymentEle.val())
            ReturnAPLoadTab.LoadDetailAdvancePayment(selected_ap)
            $('#inp-sale-code').val(selected_ap?.['sale_code'])
        })
    }
    static LoadMethod(data) {
        returnAP_method_Ele.initSelect2({
            data: data ? data : returnAP_method_default_data,
            keyId: 'value',
            keyText: 'title',
        })
    }
    static LoadBeneficiary(data) {
        chooseBeneficiaryEle.val(data?.['full_name'])
    }
    static LoadBeneficiaryInfor(data) {
        let btn_detail = $('#btn-move-to-beneficiary');
        $('#dropdownBeneficiary').prop('hidden', false);
        $('#beneficiary-name').text(data?.['full_name']);
        $('#beneficiary-code').text(data?.['code']);
        $('#beneficiary-department').text(data?.['group']['title']);
        let url = btn_detail.attr('data-url').replace('0', data?.['id']);
        btn_detail.attr('href', url);
    }
}

class ReturnAPLoadTab {
    static DrawTableCost(data=[], option = 'create') {
        let $table = $('#dtbProduct')
        $table.DataTable().clear().destroy()
        $table.DataTableDefault({
            styleDom: 'hide-foot',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            data: data,
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
                    render: (data) => {
                        return `<span class="row-expense-type" data-id="${data.id}">${data.title}</span>`
                    }
                },
                {
                    data: 'remain_total',
                    targets: 3,
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="mask-money remain-price" data-init-money="${data}"></span>`
                    }
                },
                {
                    data: 'return_value',
                    targets: 4,
                    render: (data) => {
                        let value = data !== undefined ? data : '';
                        return `<input class="mask-money form-control return-price" value="${value ? value : 0}" name="cost" ${option === 'detail' ? 'disabled readonly' : ''}>`
                    }
                },
            ],
        });
    }
    static LoadCostTable(data) {
        let table = $('#dtbProduct').DataTable();
        table.clear().draw();
        data.map(function (item) {
            table.row.add(item).draw();
        })
    }
    static LoadDetailAdvancePayment(advance_payment_detail, type = 'create') {
        ReturnAPLoadPage.LoadBeneficiary(advance_payment_detail?.['employee_inherit'])
        ReturnAPLoadPage.LoadBeneficiaryInfor(advance_payment_detail?.['employee_inherit'])
        if (type === 'create') {
            ReturnAPLoadTab.LoadCostTable(advance_payment_detail?.['expense_items'])
        }
    }
}

class ReturnAPAction {
    static DisabledDetailPage(option) {
        if (option === 'detail') {
            $('.form-control').prop('readonly', true);
            $('.form-select').prop('disabled', true);
            $('.select2').prop('disabled', true);
            $('input').prop('disabled', true);
        }
    }
}

class ReturnAPHandle {
    static LoadPage() {
        ReturnAPLoadPage.LoadCreatedDate()
        ReturnAPLoadPage.LoadCreator(initEmployee)
        ReturnAPLoadPage.LoadCreatorInfor(initEmployee)
        ReturnAPLoadPage.LoadAdvancePayment(null, {'system_status': 3})
        ReturnAPLoadPage.LoadMethod()
        ReturnAPLoadTab.DrawTableCost()
    }
    static CombinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));
        frm.dataForm['title'] = $('#title').val()
        frm.dataForm['method'] = returnAP_method_Ele.val()
        frm.dataForm['advance_payment_id'] = advancePaymentEle.val();
        frm.dataForm['money_received'] = $('#money-received').prop('checked');
        let tbProduct = $('#dtbProduct');
        let returned_list = []
        tbProduct.find('tbody tr').each(function () {
            returned_list.push({
                'advance_payment_cost_id': $(this).find('.row-expense').data('id'),
                'expense_name': $(this).find('.row-expense').text(),
                'expense_type_id': $(this).find('.row-expense-type').data('id'),
                'remain_value': parseFloat($(this).find('.remain-price').attr('data-init-money')),
                'return_value': $(this).find('.return-price').attr('value'),
            })
        })
        frm.dataForm['returned_list'] = returned_list;

        // console.log(frm)
        return frm
    }
    static LoadDetail(option) {
        let url_loaded = $('#frmDetail').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['return_advance'];
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);
                    console.log(data)

                    $('#title').val(data?.['title']);
                    $('#created_date').val(moment(data?.['date_created'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    ReturnAPLoadPage.LoadCreator(data?.['employee_created'])
                    ReturnAPLoadPage.LoadCreatorInfor(data?.['employee_created'])
                    ReturnAPLoadPage.LoadAdvancePayment(data?.['advance_payment'], {'system_status': 3})
                    ReturnAPLoadPage.LoadMethod({
                        'value': data.method,
                        'title': [
                            returnAP_method_Ele.attr('data-trans-cash'),
                            returnAP_method_Ele.attr('data-trans-bank-transfer')
                        ][data.method]
                    })
                    ReturnAPLoadPage.LoadBeneficiary(data?.['employee_inherit'])
                    ReturnAPLoadPage.LoadBeneficiaryInfor(data?.['employee_inherit'])
                    $('#inp-sale-code').val(data?.['advance_payment']?.['sale_code'])
                    ReturnAPLoadTab.DrawTableCost(data?.['returned_list'], option)
                    $('#total-value').attr('value', data?.['return_total'])
                    $('#money-received').prop('checked', data?.['money_received'])
                    ReturnAPAction.DisabledDetailPage(option)
                }
            })
    }
}

$(document).on("change", '.return-price', function () {
    let return_total = 0
    $('#dtbProduct').find('tbody tr').each(function () {
        return_total += parseFloat($(this).find('.return-price').attr('value'))
    })
    $('#total-value').attr('value', return_total)
    $.fn.initMaskMoney2()
})
