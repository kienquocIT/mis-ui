const initEmployee = JSON.parse($('#employee_current').text());
const creatorEle = $('#creator-select-box')
const advancePaymentEle = $('#chooseAdvancePayment')
const chooseBeneficiaryEle = $('#chooseBeneficiary')
const returnAP_method_Ele =$('#box-method-payment')

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
        $('#creator-department').text(data?.['group']?.['title'] ? data?.['group']?.['title'] : '');
        let url = btn_detail.attr('data-url').replace('0', data?.['id']);
        btn_detail.attr('href', url);
    }
    static LoadAdvancePayment(data, params={}) {
        const oppId = $x.fn.getUrlParameter('opp_id');
        advancePaymentEle.initSelect2({
            allowClear: data === null,
            ajax: {
                data: params,
                url: advancePaymentEle.attr('data-url'),
                method: 'GET',
            },
            templateResult: function (state) {
                return $(`<span class="badge badge-soft-primary mr-2">${state.data?.['code']}</span><span>${state.data?.['title']}</span>`);
            },
            data: (data ? data : null),
            keyResp: 'advance_payment_list',
            dataParams: oppId && $x.fn.checkUUID4(oppId) ? {
                'opportunity_id': oppId,
            } : {},
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            let selected_ap = SelectDDControl.get_data_from_idx(advancePaymentEle, advancePaymentEle.val())
            ReturnAPLoadTab.LoadDetailAdvancePayment(selected_ap)
            $('#inp-sale-code').val(selected_ap?.['sale_code'] !== 'null' ? selected_ap?.['sale_code'] : '')
            $('#inp-process-mask').val(selected_ap?.['process']?.['id'] ? selected_ap?.['process']?.['title'] : '')
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
            dom: 't',
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            data: data,
            columns: [
                {
                    targets: 0,
                        render: () => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    data: 'expense_description',
                        render: (data, type, row) => {
                        return `<span class="text-primary row-expense" data-id="${row.id}">${data}</span>`
                    }
                },
                {
                    data: 'expense_type',
                    targets: 2,
                        render: (data) => {
                        return `<span class="row-expense-type" data-id="${data.id}">${data.title}</span>`
                    }
                },
                {
                    data: 'remain_total',
                    targets: 3,
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
    static LoadDetailAdvancePayment(advance_payment_mapped, type = 'create') {
        if (advance_payment_mapped?.['employee_inherit']) {
            ReturnAPLoadPage.LoadBeneficiary(advance_payment_mapped?.['employee_inherit'])
            ReturnAPLoadPage.LoadBeneficiaryInfor(advance_payment_mapped?.['employee_inherit'])
            if (type === 'create') {
                ReturnAPLoadTab.LoadCostTable(advance_payment_mapped?.['expense_items'])
            }
        }
        else {
            let dataParam = {'id': advance_payment_mapped?.['id'], 'system_status': 3}
            let ap_mapped_item = $.fn.callAjax2({
                url: advancePaymentEle.attr('data-url'),
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('advance_payment_list')) {
                        return data?.['advance_payment_list'].length > 0 ? data?.['advance_payment_list'][0] : null;
                    }
                    return {};
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([ap_mapped_item]).then(
                (results) => {
                    advance_payment_mapped = results[0]
                    ReturnAPLoadPage.LoadBeneficiary(advance_payment_mapped?.['employee_inherit'])
                    ReturnAPLoadPage.LoadBeneficiaryInfor(advance_payment_mapped?.['employee_inherit'])
                    if (type === 'create') {
                        ReturnAPLoadTab.LoadCostTable(advance_payment_mapped?.['expense_items'])
                    }
                })
        }
    }
}

class ReturnAPAction {
    static DisabledDetailPage(option) {
        if (option === 'detail') {
            $('.form-control').prop('readonly', true);
            $('.form-select').prop('disabled', true);
            $('.select2').prop('disabled', true);
            $('form input').prop('disabled', true);
        }
    }
}

class ReturnAPHandle {
    static LoadPage(advance_payment) {
        ReturnAPLoadPage.LoadCreatedDate()
        ReturnAPLoadPage.LoadCreator(initEmployee)
        ReturnAPLoadPage.LoadCreatorInfor(initEmployee)
        if (advance_payment) {
            advancePaymentEle.trigger('change')
        }
        ReturnAPLoadTab.DrawTableCost();

        let params = {'system_status': 3}
        const {
            opp_id, opp_code,
            process_id, process_title,
            inherit_id, inherit_title,
        } = $x.fn.getManyUrlParameters([
            'opp_id', 'opp_code',
            'process_id', 'process_title',
            'inherit_id', 'inherit_title',
        ])
        if (opp_id && $x.fn.checkUUID4(opp_id)) $('#inp-sale-code').val(opp_code);
        if (process_id && $x.fn.checkUUID4(process_id)) {
            $('#inp-process-mask').val(process_title);
            $('#inp-process').val(process_id);
            params['process_id'] = process_id
        }
        if (inherit_id && $x.fn.checkUUID4(inherit_id)) {
            chooseBeneficiaryEle.val(inherit_title);
        }
        ReturnAPLoadPage.LoadAdvancePayment(advance_payment ? advance_payment : null, params)
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
                'expense_description': $(this).find('.row-expense').text(),
                'expense_type_id': $(this).find('.row-expense-type').data('id'),
                'remain_value': parseFloat($(this).find('.remain-price').attr('data-init-money')),
                'return_value': parseFloat($(this).find('.return-price').attr('value')),
            })
        })
        frm.dataForm['returned_list'] = returned_list;
        // console.log(frm)
        return frm
    }
    static LoadDetail(option) {
        let url_loaded = $('#form-detail-return-ap').attr('data-url');
        $.fn.callAjax(url_loaded, 'GET').then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    data = data['return_advance'];
                    $.fn.compareStatusShowPageAction(data);
                    $x.fn.renderCodeBreadcrumb(data);
                    // console.log(data)

                    $('#title').val(data?.['title']);
                    $('#created_date').val(moment(data?.['date_created'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'))
                    ReturnAPLoadPage.LoadCreator(data?.['employee_created'])
                    ReturnAPLoadPage.LoadCreatorInfor(data?.['employee_created'])
                    ReturnAPLoadPage.LoadAdvancePayment(data?.['advance_payment'], {'system_status': 3})
                    returnAP_method_Ele.val(data.method)
                    ReturnAPLoadPage.LoadBeneficiary(data?.['employee_inherit'])
                    ReturnAPLoadPage.LoadBeneficiaryInfor(data?.['employee_inherit'])
                    $('#inp-sale-code').val(data?.['advance_payment']?.['sale_code'])
                    $('#inp-process-mask').val(data?.['process']?.['id'] ? data?.['process']?.['title'] : '')
                    ReturnAPLoadTab.DrawTableCost(data?.['returned_list'], option)
                    $('#total-value').attr('value', data?.['return_total'])
                    $('#money-received').prop('checked', data?.['money_received'])
                    ReturnAPAction.DisabledDetailPage(option)
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);
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
