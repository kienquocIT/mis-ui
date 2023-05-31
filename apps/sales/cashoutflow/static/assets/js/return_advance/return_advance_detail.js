"use strict";

$(function () {
    $(document).ready(function () {
        const id = window.location.pathname.split('/').pop();
        const frmDetail = $('#frmDetail');
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
                        $('#chooseBeneficiary').append(`<option value="${data.advance_payment_detail.beneficiary.id}">${data.advance_payment_detail.beneficiary.name}</option>`);
                    }
                }
            }, (errs) => {
            },)
        }

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

        function loadCreator(id) {
            let ele = $('[name="creator"]');
            let frm = new SetupFormSubmit(ele);
            $.fn.callAjax(frm.getUrlDetail(id), frm.dataMethod).then((resp) => {
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
                                <td class="wrap-text"><span class="mask-money" data-init-money="${item.remain_total}"></span></td>
                                <td class="wrap-text">
                                    <input class="mask-money form-control return-price" type="text" value="${item.return_price}" data-return-type="number" readonly> 
                                </td>
                            </tr>`;
                table.find('tbody').append(html);
                cnt += 1;
            })
            $.fn.initMaskMoney2();
        }

        function loadDetail(id, frmDetail) {
            let frm = new SetupFormSubmit(frmDetail);
            $.fn.callAjax(frm.getUrlDetail(id), "GET").then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('return_advance')) {
                        $('[name="title"]').val(data.return_advance.title);
                        choose_AP_ele.find(`option[value="${data.return_advance.advance_payment}"]`).prop('selected', true);
                        loadDetailAdvancePayment(choose_AP_ele.attr('data-url-detail').replace(0, data.return_advance.advance_payment));
                        loadDetailBeneficiary(data.return_advance.beneficiary);
                        loadCreator(data.return_advance.creator);
                        $('[name="date_created"]').val(data.return_advance.date_created.split(" ")[0]);
                        $('[name="method"]').val(data.return_advance.method);
                        $('.select2').select2();
                        loadExpenseTable(data.return_advance.cost);
                        let total_value = data.return_advance.cost.map(obj=>obj.return_price).reduce((a, b) => a + b, 0)
                        $('#total-value').attr('data-init-money', total_value);
                        if(data.return_advance.money_received){
                            $('#money-received').prop('checked', true);
                        }
                        else{
                            $('#money-received').prop('checked', false);
                        }
                    }
                }
            }, (errs) => {
            },)
        }

        loadDetail(id, frmDetail);
    })
})