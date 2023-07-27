$(function () {
    $(document).ready(function () {
        const id = $.fn.getPkDetail()
        const frmDetail = $('#frmDetail');
        const choose_AP_ele = $('#chooseAdvancePayment');

        function loadDetailOpp(data) {
            let dropdown = $('#dropdownOpp');
            if (data === null) {
                dropdown.find('.opp-info').addClass('hidden');
                dropdown.find('.non-opp').removeClass('hidden');
            } else {
                dropdown.find('.opp-info').removeClass('hidden');
                dropdown.find('.non-opp').addClass('hidden');
                dropdown.find('[name="opp-name"]').text(data.title);
                dropdown.find('[name="opp-code"]').text(data.code);
                dropdown.find('[name="opp-customer"]').text(data.customer);
            }
        }

        function loadDetailAdvancePayment(url) {
            $.fn.callAjax(url, "GET").then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_detail')) {
                        let ele_benefication = $('#chooseBeneficiary');
                        let sale_code_ele = $('[name="sale_code"]');
                        sale_code_ele.val(data.advance_payment_detail.code);
                        if (data.advance_payment_detail.sale_order_mapped.length > 0) {
                            loadDetailOpp(data.advance_payment_detail.sale_order_mapped[0].opportunity);
                        } else if (data.advance_payment_detail.quotation_mapped.length > 0) {
                            loadDetailOpp(data.advance_payment_detail.quotation_mapped[0].opportunity);
                        } else if (data.advance_payment_detail.opportunity_mapped.length > 0) {
                            loadDetailOpp(data.advance_payment_detail.opportunity_mapped[0]);
                        } else {
                            loadDetailOpp(null);
                        }
                        ele_benefication.empty();
                        ele_benefication.append(`<option value="${data.advance_payment_detail.beneficiary.id}">${data.advance_payment_detail.beneficiary.name}</option>`);
                        loadProductTable(data.advance_payment_detail.product_items)
                        loadDetailBeneficiary(data.advance_payment_detail.beneficiary.id);
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

        function loadProductTable(data) {
            let table = $('#dtbProduct');
            table.find('tbody').html('');
            $('#total-value').attr('data-init-money', '');
            let cnt = table.find('tbody tr').length;
            data.map(function (item) {
                let html = `<tr>
                                <td class="number text-center wrap-text">${cnt + 1}</td>
                                <td class="wrap-text col-product" data-id="${item.id}"><span class="text-primary">${item.product.title}</span></td>
                                <td class="wrap-text"><span>${item.product_type}</span></td>
                                <td class="wrap-text"><span class="mask-money" data-init-money="${item.remain_total}"></span></td>
                                <td class="wrap-text">
                                    <input class="mask-money form-control return-price" disabled type="text" value="${item.return_price}" data-return-type="number" readonly> 
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
                    let return_advance_detail = data?.['return_advance'];
                    $.fn.compareStatusShowPageAction(return_advance_detail);
                    $('.header-code').text(return_advance_detail.code);
                    $('[name="title"]').val(return_advance_detail.title);
                    choose_AP_ele.find(`option[value="${return_advance_detail.advance_payment}"]`).prop('selected', true);
                    loadDetailAdvancePayment(choose_AP_ele.attr('data-url-detail').replace(0, return_advance_detail.advance_payment));
                    loadDetailBeneficiary(return_advance_detail.beneficiary);
                    loadCreator(return_advance_detail.creator);
                    $('[name="date_created"]').val(return_advance_detail.date_created.split(" ")[0]);
                    $('[name="method"]').val(return_advance_detail.method);
                    $('.select2').select2();
                    loadProductTable(return_advance_detail.cost);
                    let total_value = return_advance_detail.cost.map(obj => obj.return_price).reduce((a, b) => a + b, 0)
                    $('#total-value').attr('data-init-money', total_value);
                    if (return_advance_detail.money_received) {
                        $('#money-received').prop('checked', true);
                        $('#money-received').prop('disabled', true);
                    } else {
                        $('#money-received').prop('checked', false);
                    }
                    
                }
            }, (errs) => {
            },)
        }

        loadDetail(id, frmDetail);

        frmDetail.submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['money_received'] = !!$('#money-received').is(':checked');
            $.fn.callAjax(frm.getUrlDetail(id), frm.dataMethod, frm.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                        }
                    },
                    (errs) => {
                        // $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        })
    })
})