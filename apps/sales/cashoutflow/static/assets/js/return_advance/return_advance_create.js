$(function () {
    $(document).ready(function () {
        const urlParams = new URLSearchParams(window.location.search);
        let param = null;
        let param_temp_1 = urlParams.get('advance_payment_id');
        if (param_temp_1) {param = param_temp_1};
        let param_temp_2 = urlParams.get('opportunity');
        if (param_temp_2) {param = param_temp_2};
        const advance_payment_id = param;

        const opportunity_id = urlParams.get('opportunity');
        const choose_AP_ele = $('#chooseAdvancePayment');
        $('#chooseBeneficiary').prop('disabled', true);


        function loadAdvancePayment(advance_payment_id, opportunity_id, choose_AP_ele) {
            let url = choose_AP_ele.data('select2-url');
            let method = 'GET'
            $.fn.callAjax2({
                'url': url,
                'method': method,
                isDropdown: true,
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_list')) {
                        choose_AP_ele.append(`<option></option>`);
                        if (advance_payment_id !== null) {
                            data.advance_payment_list.map(function (item) {
                                if (item.id === advance_payment_id) {
                                    choose_AP_ele.append(`<option value="${item.id}" selected>${item.title}</option>`);
                                } else {
                                    choose_AP_ele.append(`<option value="${item.id}">${item.title}</option>`);
                                }
                            })
                        } else if (opportunity_id !== null) {
                            let opportunityCode = null;

                            for (const item of data.advance_payment_list) {
                                if (
                                    item.opportunity_mapped &&
                                    item.opportunity_mapped.id === opportunity_id
                                ) {
                                    choose_AP_ele.append(`<option value="${item.id}">${item.title}</option>`);
                                    opportunityCode = item.opportunity_mapped.code;
                                    break;
                                } else if (
                                    item.sale_order_mapped &&
                                    item.sale_order_mapped.opportunity_id === opportunity_id
                                ) {
                                    choose_AP_ele.append(`<option value="${item.id}">${item.title}</option>`);
                                    opportunityCode = item.sale_order_mapped.opportunity_code;
                                    break;
                                } else if (
                                    item.quotation_mapped &&
                                    item.quotation_mapped.opportunity_id === opportunity_id
                                ) {
                                    choose_AP_ele.append(`<option value="${item.id}">${item.title}</option>`);
                                    opportunityCode = item.quotation_mapped.opportunity_code;
                                    break;
                                }
                            }
                            $('[name="sale_code"]').val(opportunityCode);
                        } else {
                            data.advance_payment_list.map(function (item) {
                                choose_AP_ele.append(`<option value="${item.id}">${item.title}</option>`);
                            })
                        }

                    }
                }
            }, (errs) => {
            },).then((resp) => {
                loadPageWithParameter(advance_payment_id, choose_AP_ele);
            })
        }

        function loadDetailAdvancePayment(url) {
            $.fn.callAjax2({
                'url': url,
                'method': "GET"
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_detail')) {
                        let ele_beneficiary = $('#chooseBeneficiary');
                        let sale_code_ele = $('[name="sale_code"]');
                        if (data.advance_payment_detail.sale_order_mapped.length > 0) {
                            sale_code_ele.val(data.advance_payment_detail.sale_order_mapped[0].opportunity.code);
                        } else if (data.advance_payment_detail.quotation_mapped.length > 0) {
                            sale_code_ele.val(data.advance_payment_detail.quotation_mapped[0].opportunity.code);
                        } else if (data.advance_payment_detail.opportunity_mapped.length > 0) {
                            sale_code_ele.val(data.advance_payment_detail.opportunity_mapped[0].code);
                        } else {
                            sale_code_ele.val('');
                        }
                        ele_beneficiary.empty();
                        ele_beneficiary.append(`<option value="${data.advance_payment_detail.beneficiary.id}">${data.advance_payment_detail.beneficiary.name}</option>`);
                        loadProductTable(data.advance_payment_detail.product_items)
                        loadDetailBeneficiary(data.advance_payment_detail.beneficiary.id);
                    }
                }
            }, (errs) => {
            },)
        }

        function loadPageWithParameter(advance_payment_id, choose_AP_ele) {
            if (advance_payment_id !== null) {
                choose_AP_ele.prop('disabled', true);
                choose_AP_ele.find(`option[value="${advance_payment_id}"]`).prop('selected', true);
                loadDetailAdvancePayment(choose_AP_ele.attr('data-url-detail').replace(0, advance_payment_id));
            }
        }

        loadAdvancePayment(advance_payment_id, opportunity_id, choose_AP_ele)

        // loadPageWithParameter(advance_payment_id, choose_AP_ele);

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

        function loadCreator() {
            let ele = $('[name="creator"]');
            let frm = new SetupFormSubmit(ele);
            $.fn.callAjax2({
                'url': frm.getUrlDetail(ele.attr('data-id')),
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

        function loadProductTable(data) {
            let table = $('#dtbProduct');
            table.find('tbody').html('');
            $('#total-value').attr('data-init-money', '');
            let cnt = table.find('tbody tr').length;
            data.map(function (item) {
                let html = `<tr>
                                <td class="number text-center wrap-text">${cnt + 1}</td>
                                <td class="wrap-text col-product text-primary" data-id="${item.id}"><span>${item.product.title}</span></td>
                                <td class="wrap-text"><span>${item.product.type.title}</span></td>
                                <td class="wrap-text"><span class="mask-money" data-init-money="${item.remain_total}"></span></td>
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
                $.fn.notifyB({description: 'return value: not greater than remain value'}, 'failure');
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
            frm.dataForm['money_received'] = !!$('#money-received').is(':checked');
            let tbProduct = $('#dtbProduct');
            let cost_list = []
            tbProduct.find('tbody tr').each(function () {
                cost_list.push({
                    'advance_payment_cost': $(this).find('.col-product').attr('data-id'),
                    'remain_value': parseFloat($(this).find('span.mask-money').attr('data-init-money')),
                    'return_value': $(this).find('input.mask-money').valCurrency(),
                })
            })
            frm.dataForm['cost'] = cost_list;
            frm.dataForm['return_total'] = $('#total-value').attr('data-init-money');

            frm.dataForm['advance_payment'] = $('#chooseAdvancePayment').val();
            frm.dataForm['beneficiary'] = $('#chooseBeneficiary').val();

            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
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