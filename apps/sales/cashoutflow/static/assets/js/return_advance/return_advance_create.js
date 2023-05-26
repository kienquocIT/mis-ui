"use strict";

$(function () {
    $(document).ready(function () {
        const urlParams = new URLSearchParams(window.location.search);
        const advance_payment_id = urlParams.get('advance_payment_id');
        const choose_AP_ele = $('#chooseAdvancePayment');

        function loadDetailOpp(data) {
            let dropdown = $('#dropdownOpp');
            dropdown.find('[name="opp-name"]').text(data.title);
            dropdown.find('[name="opp-code"]').text(data.code);
            dropdown.find('[name="opp-customer"]').text(data.customer);
        }

        function loadDetailAdvancePayment(url) {
            $.fn.callAjax(url, "GET").then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_detail')) {
                        let sale_code_ele = $('[name="sale_code"]');
                        if (data.advance_payment_detail.sale_order_mapped !== null) {
                            sale_code_ele.val(data.advance_payment_detail.sale_order_mapped.title);
                            loadDetailOpp(data.advance_payment_detail.sale_order_mapped.opportunity);
                        } else {
                            if (data.advance_payment_detail.quotation_mapped !== null) {
                                sale_code_ele.val(data.advance_payment_detail.quotation_mapped.title);
                                loadDetailOpp(data.advance_payment_detail.quotation_mapped.opportunity);
                            }
                            else{
                                sale_code_ele.val("Advance Payment is None-Sale");
                            }
                        }
                        loadExpenseTable(data.advance_payment_detail.expense_items)

                        $('#chooseBeneficiary').append(`<option value="${data.advance_payment_detail.beneficiary.id}">${data.advance_payment_detail.beneficiary.name}</option>`);
                        loadDetailBeneficiary(data.advance_payment_detail.beneficiary.id);
                    }
                }
            }, (errs) => {
            },)
        }

        function loadPageWithParameter(advance_payment_id, choose_AP_ele) {
            if (advance_payment_id !== null) {
                choose_AP_ele.find(`option[value="${advance_payment_id}"]`).prop('selected', true);
                loadDetailAdvancePayment(choose_AP_ele.attr('data-url-detail').replace(0, advance_payment_id));
            }
            choose_AP_ele.select2();

        }

        loadPageWithParameter(advance_payment_id, choose_AP_ele);

        function loadDetailBeneficiary(id) {
            let ele = $('[name="creator"]');
            let frm = new SetupFormSubmit(ele);
            $.fn.callAjax(frm.getUrlDetail(id), frm.dataMethod).then((resp) => {
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

        function loadCreator() {
            let ele = $('[name="creator"]');
            let frm = new SetupFormSubmit(ele);
            $.fn.callAjax(frm.getUrlDetail(ele.attr('data-id')), frm.dataMethod).then((resp) => {
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
        loadCreator()

        $('input[name="date_created"]').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: false,
            minYear: 1901,
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY'), 10)
        });
        $('.daterangepicker').remove();

        choose_AP_ele.on('change', function () {
            let data_url = $(this).attr('data-url-detail').replace(0, $(this).val());
            loadDetailAdvancePayment(data_url)
        })

        function loadExpenseTable(data) {
            let table = $('#dtbExpense');
            table.find('tbody').html('');
            $('#total-value').attr('data-init-money', '');
            let cnt = table.find('tbody tr').length;
            data.map(function (item) {
                let html = `<tr>
                                <td class="number text-center wrap-text">${cnt}</td>
                                <td class="wrap-text col-expense" data-id="${item.expense.id}"><span>${item.expense.title}</span></td>
                                <td class="wrap-text"><span>${item.expense_type}</span></td>
                                <td class="wrap-text"><span class="mask-money" data-init-money="${item.after_tax_price}"></span></td>
                                <td class="wrap-text"><input class="mask-money form-control return-price" type="text" data-return-type="number"></td>
                            </tr>`;
                table.find('tbody').append(html);
                cnt += 1;
            })
            $.fn.initMaskMoney2();
        }

        $(document).on('change', '.return-price', function () {
            let total = 0;
            let ele = $(this).closest('tr').find('span.mask-money');
            if ($(this).valCurrency() > ele.attr('data-init-money')) {
                $.fn.notifyPopup({description: 'return value: not greater than remain value'}, 'failure');
                $(this).attr('value', '');
            }
            $('.return-price').each(function () {
                total += $(this).valCurrency();
            })
            $('#total-value').attr('data-init-money', total);
            $.fn.initMaskMoney2();
        })

        const frmCreate = $('#frmCreate');
        frmCreate.submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));
            frm.dataForm['creator'] = $('[name="creator"]').attr('data-id');
            frm.dataForm['status'] = 0;
            if($('#money-received').is(':checked')){
                frm.dataForm['money_received'] = true;
            }
            else{
                frm.dataForm['money_received'] = false;
            }

            let tbExpense = $('#dtbExpense');
            let cost_list = []
            tbExpense.find('tbody tr').each(function (){
                cost_list.push({
                    'expense': $(this).find('.col-expense').attr('data-id'),
                    'remain_total': parseFloat($(this).find('span.mask-money').attr('data-init-money')),
                    'return_price': $(this).find('input.mask-money').valCurrency(),
                })
            })
            frm.dataForm['cost'] = cost_list;

            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: "Successfully"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                    }
                )
        })
    })
})