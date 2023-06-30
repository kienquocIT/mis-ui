$(document).ready(function () {
    let advance_payment_expense_items = [];
    let payment_cost_items_filtered = [];
    const ap_list = JSON.parse($('#advance_payment_list').text());
    let url_detail = $('#form-update-payment').attr('data-url-detail').replace('0', $.fn.getPkDetail())
    $.fn.callAjax(url_detail, 'GET').then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            let opp_code_list = [];
            let payment_detail = data.payment_detail;
            // console.log(payment_detail)
            $.fn.compareStatusShowPageAction(payment_detail);
            $('#payment-code').text(payment_detail.code);
            $('#payment-title').val(payment_detail.title);
            $('#created_date_id').val(payment_detail.date_created.split(' ')[0]);
            loadBeneficiary(payment_detail.beneficiary)

            let sale_code_mapped = null;
            let sale_code_id_list = [];
            if (payment_detail.sale_order_mapped.length > 0) {
                sale_code_mapped = payment_detail.sale_order_mapped;
                sale_code_id_list = sale_code_id_list.concat(payment_detail.sale_order_mapped);
            }
            if (payment_detail.quotation_mapped.length > 0) {
                sale_code_mapped = payment_detail.quotation_mapped;
                sale_code_id_list = sale_code_id_list.concat(payment_detail.quotation_mapped);
            }
            if (payment_detail.opportunity_mapped.length > 0) {
                sale_code_mapped = payment_detail.opportunity_mapped;
                sale_code_id_list = sale_code_id_list.concat(payment_detail.opportunity_mapped);
            }

            if (payment_detail.sale_code_type === 3) {
                $('#sale-code-select-box').css({'height': '38px'});
                $('#sale-code-select-box').prop('multiple', true);
                $('#sale-code-select-box').select2({
                    templateResult: function(data) {
                        let ele = $('<div class="row col-12"></div>');
                        ele.append('<div class="col-5">' + data.id + '</div>');
                        ele.append('<div class="col-7">' + data.text + '</div>');
                        return ele;
                    }
                });

                $('#radio-special').prop('checked', true);
                $('#btn-change-sale-code-type').text('MULTI');

                payment_detail.sale_order_mapped.map(function (item) {
                    let title = 'No Opportunity Code';
                    let opp_code = item.code;
                    if (Object.keys(item.opportunity).length !== 0) {
                        opp_code_list.push(sale_code_mapped[0].opportunity.code);
                        title = item.opportunity.code + ': ' + item.opportunity.title;
                        opp_code = item.opportunity.code;
                    }
                    $('#sale-code-select-box').append(`<option title="` + title + `" data-bs-placement="right" data-bs-toggle="tooltip" selected>` + item.title + `</option>`);
                    $('#tab_plan_datatable tbody').append(`<tr>
                        <td colspan="1" data-type="0" data-sale-code-id="` + item.id + `" data-sale-code="` + opp_code + `">
                        <span class="badge badge-primary w-100">` + opp_code + `</span>
                        <a class="btn-load-detail-multi" data-detail-view="hide" href="#"><i class="bi bi-caret-down-square"></i></a>
                        </td>
                        <td colspan="7"></td>
                    </tr>`)
                })

                payment_detail.quotation_mapped.map(function (item) {
                    let title = 'No Opportunity Code';
                    let opp_code = item.code;
                    if (Object.keys(item.opportunity).length !== 0) {
                        opp_code_list.push(sale_code_mapped[0].opportunity.code);
                        title = item.opportunity.code + ': ' + item.opportunity.title;
                        opp_code = item.opportunity.code;
                    }
                    $('#sale-code-select-box').append(`<option title="` + title + `" data-bs-placement="right" data-bs-toggle="tooltip" selected>` + item.title + `</option>`);
                    $('#tab_plan_datatable tbody').append(`<tr>
                        <td colspan="1" data-type="1" data-sale-code-id="` + item.id + `" data-sale-code="` + opp_code + `">
                        <span class="badge badge-primary w-100">` + opp_code + `</span>
                        <a class="btn-load-detail-multi" data-detail-view="hide" href="#"><i class="bi bi-caret-down-square"></i></a>
                        </td>
                        <td colspan="7"></td>
                    </tr>`)
                })

                payment_detail.opportunity_mapped.map(function (item) {
                    $('#sale-code-select-box').append(`<option selected>` + item.title + `</option>`);
                })

                $('#sale-code-select-box').prop('disabled', true);

                $('.btn-load-detail-multi').on('click', function () {
                    if ($(this).attr('data-detail-view') === 'hide') {
                        $(this).attr('data-detail-view', 'show');
                        if ($(this).closest('td').attr('data-type') === '0') {
                            // get ap expense items
                            let so_id = $(this).closest('td').attr('data-sale-code-id');
                            let so_filter = sale_order_list.filter(function(item) {
                                return item.id === so_id;
                            });
                            let so_mapped = null;
                            let quo_mapped = null;
                            let opp_mapped = null;
                            if (so_filter.length > 0) {
                                so_mapped = so_filter[0];
                            }
                            if (so_mapped) {
                                if (Object.keys(so_mapped.quotation).length !== 0) {
                                    quo_mapped = so_mapped.quotation;
                                }
                                if (Object.keys(so_mapped.opportunity).length !== 0) {
                                    opp_mapped = so_mapped.opportunity;
                                }
                            }
                            let so_mapped_id = null;
                            let quo_mapped_id = null;
                            let opp_mapped_id = null;
                            if (so_mapped) {so_mapped_id = so_mapped.id}
                            if (quo_mapped) {quo_mapped_id = quo_mapped.id}
                            if (opp_mapped) {opp_mapped_id = opp_mapped.id}

                            advance_payment_expense_items = [];
                            for (let i = 0; i < ap_list.length; i++) {
                                if (ap_list[i].sale_order_mapped === so_mapped_id && ap_list[i].sale_order_mapped) {
                                    advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                                }
                                if (ap_list[i].quotation_mapped === quo_mapped_id && ap_list[i].quotation_mapped) {
                                    advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                                }
                                if (ap_list[i].opportunity_mapped === opp_mapped_id && ap_list[i].opportunity_mapped) {
                                    advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                                }
                            }
                            // console.log(0, advance_payment_expense_items)

                            // get payment items
                            payment_cost_items_filtered = [];
                            for (let i = 0; i < payment_cost_items_list.length; i++) {
                                let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                                if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                                    payment_cost_items_filtered.push(payment_cost_items_list[i]);
                                }
                            }

                            if (so_mapped_id) {
                                loadSaleOrderPlanMULTI(so_mapped_id)
                                $('#notify-none-sale-code').prop('hidden', true);
                                $('#tab_plan_datatable').prop('hidden', false);
                            }
                            else if (quo_mapped_id) {
                                loadQuotationPlanMULTI(quo_mapped_id)
                                $('#notify-none-sale-code').prop('hidden', true);
                                $('#tab_plan_datatable').prop('hidden', false);
                            }
                            else {
                                $('#notify-none-sale-code').prop('hidden', false);
                                $('#tab_plan_datatable').prop('hidden', true);
                            }
                        }
                        else if ($(this).closest('td').attr('data-type') === '1') {
                            // get ap expense items
                            let quo_id = $(this).closest('td').attr('data-sale-code-id');
                            let so_filter = sale_order_list.filter(function(item) {
                                if (Object.keys(item.quotation).length !== 0) {
                                    return item.quotation.id === quo_id;
                                }
                            });
                            let so_mapped = null;
                            let quo_mapped = null;
                            let opp_mapped = null;
                            if (so_filter.length > 0) {
                                so_mapped = so_filter[0];
                                if (so_mapped) {
                                    if (Object.keys(so_mapped.quotation).length !== 0) {
                                        quo_mapped = so_mapped.quotation;
                                    }
                                    if (Object.keys(so_mapped.opportunity).length !== 0) {
                                        opp_mapped = so_mapped.opportunity;
                                    }
                                }
                            }
                            else {
                                let quo_filter = quotation_list.filter(function(item) {
                                    return item.id === quo_id;
                                });
                                quo_mapped = quo_filter[0];
                                if (quo_mapped) {
                                    if (Object.keys(quo_mapped.opportunity).length !== 0) {
                                        opp_mapped = quo_mapped.opportunity;
                                    }
                                }
                            }

                            let so_mapped_id = null;
                            let quo_mapped_id = null;
                            let opp_mapped_id = null;
                            if (so_mapped) {so_mapped_id = so_mapped.id}
                            if (quo_mapped) {quo_mapped_id = quo_mapped.id}
                            if (opp_mapped) {opp_mapped_id = opp_mapped.id}

                            advance_payment_expense_items = [];
                            for (let i = 0; i < ap_list.length; i++) {
                                if (ap_list[i].sale_order_mapped === so_mapped_id && ap_list[i].sale_order_mapped) {
                                    advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                                }
                                if (ap_list[i].quotation_mapped === quo_mapped_id && ap_list[i].quotation_mapped) {
                                    advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                                }
                                if (ap_list[i].opportunity_mapped === opp_mapped_id && ap_list[i].opportunity_mapped) {
                                    advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                                }
                            }
                            // console.log(advance_payment_expense_items)

                            // get payment items
                            payment_cost_items_filtered = [];
                            for (let i = 0; i < payment_cost_items_list.length; i++) {
                                let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                                if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                                    payment_cost_items_filtered.push(payment_cost_items_list[i]);
                                }
                            }

                            if (so_mapped_id) {
                                loadSaleOrderPlanMULTI(so_mapped_id)
                                $('#notify-none-sale-code').prop('hidden', true);
                                $('#tab_plan_datatable').prop('hidden', false);
                            }
                            else if (quo_mapped_id) {
                                loadQuotationPlanMULTI(quo_mapped_id)
                                $('#notify-none-sale-code').prop('hidden', true);
                                $('#tab_plan_datatable').prop('hidden', false);
                            }
                            else {
                                $('#notify-none-sale-code').prop('hidden', false);
                                $('#tab_plan_datatable').prop('hidden', true);
                            }
                        }
                        else if ($(this).closest('td').attr('data-type') === '2') {
                            $('#sale-code-select-box').attr('data-placeholder', 'Select One');
                            $('#beneficiary-select-box').prop('disabled', true);
                            $('#notify-none-sale-code').prop('hidden', false);
                            $('#tab_plan_datatable').prop('hidden', true);
                        }
                    }
                    else if ($(this).attr('data-detail-view') === 'show') {
                        $(this).attr('data-detail-view', 'hide');
                        $(`#tab_plan_datatable tbody tr[class="detail-line-for-` + $(this).closest('td').attr('data-sale-code-id') + `"`).remove();
                    }
                })
            }
            else if (payment_detail.sale_code_type === 0) {
                $('#sale-code-select-box').css({'height': '38px'});
                $('#radio-sale').prop('checked', true);
                $('#btn-change-sale-code-type').text('Sale');
                let title = 'No Opportunity Code'
                if (Object.keys(sale_code_mapped[0].opportunity).length !== 0) {
                    opp_code_list.push(sale_code_mapped[0].opportunity.code);
                    title =  sale_code_mapped[0].opportunity.code + ': ' + sale_code_mapped[0].opportunity.title;
                }
                $('#sale-code-select-box').append(`<option title="` + title + `" data-bs-placement="right" data-bs-toggle="tooltip" selected>` + sale_code_mapped[0].title + `</option>`);
                $('#sale-code-select-box').prop('disabled', true);

                let sale_code_id_list = [];
                if (payment_detail.sale_order_mapped.length > 0) {
                    sale_code_id_list = sale_code_id_list.concat(payment_detail.sale_order_mapped)
                    $('#tab_plan_datatable tbody').html(``);
                    for (let i = 0; i < payment_detail.sale_order_mapped.length; i++) {
                        let sale_code_detail_show = sale_code_id_list[i].opportunity.code;
                        if (sale_code_detail_show === undefined) {sale_code_detail_show = sale_code_id_list[i].code}
                        // get ap expense items
                        let so_id = payment_detail.sale_order_mapped[i].id;
                        let so_filter = sale_order_list.filter(function(item) {
                            return item.id === so_id;
                        });
                        let so_mapped = null;
                        let quo_mapped = null;
                        let opp_mapped = null;
                        if (so_filter.length > 0) {
                            so_mapped = so_filter[0];
                        }
                        if (so_mapped) {
                            if (Object.keys(so_mapped.quotation).length !== 0) {
                                quo_mapped = so_mapped.quotation;
                            }
                            if (Object.keys(so_mapped.opportunity).length !== 0) {
                                opp_mapped = so_mapped.opportunity;
                            }
                        }
                        let so_mapped_id = null;
                        let quo_mapped_id = null;
                        let opp_mapped_id = null;
                        if (so_mapped) {so_mapped_id = so_mapped.id}
                        if (quo_mapped) {quo_mapped_id = quo_mapped.id}
                        if (opp_mapped) {opp_mapped_id = opp_mapped.id}

                        advance_payment_expense_items = [];
                        for (let i = 0; i < ap_list.length; i++) {
                            if (ap_list[i].sale_order_mapped === so_mapped_id && ap_list[i].sale_order_mapped) {
                                advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                            }
                            if (ap_list[i].quotation_mapped === quo_mapped_id && ap_list[i].quotation_mapped) {
                                advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                            }
                            if (ap_list[i].opportunity_mapped === opp_mapped_id && ap_list[i].opportunity_mapped) {
                                advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                            }
                        }

                        // get payment items
                        payment_cost_items_filtered = [];
                        for (let i = 0; i < payment_cost_items_list.length; i++) {
                            // console.log(payment_cost_items_list[i])
                            let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                            if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                                payment_cost_items_filtered.push(payment_cost_items_list[i]);
                            }
                        }
                        if (so_mapped_id) {
                            loadSaleOrderPlan(so_mapped_id, sale_code_detail_show)
                            $('#notify-none-sale-code').prop('hidden', true);
                            $('#tab_plan_datatable').prop('hidden', false);
                        }
                        else if (quo_mapped_id) {
                            loadQuotationPlan(quo_mapped_id, sale_code_detail_show)
                            $('#notify-none-sale-code').prop('hidden', true);
                            $('#tab_plan_datatable').prop('hidden', false);
                        }
                        else {
                            $('#notify-none-sale-code').prop('hidden', false);
                            $('#tab_plan_datatable').prop('hidden', true);
                        }
                    }
                }
                if (payment_detail.quotation_mapped.length > 0) {
                    sale_code_id_list = sale_code_id_list.concat(payment_detail.quotation_mapped)
                    for (let i = 0; i < payment_detail.quotation_mapped.length; i++) {
                        let sale_code_detail_show = sale_code_id_list[i].opportunity.code;
                        if (sale_code_detail_show === undefined) {sale_code_detail_show = sale_code_id_list[i].code}
                        // get ap expense items
                        let quo_id = payment_detail.quotation_mapped[i].id;
                        let so_filter = sale_order_list.filter(function(item) {
                            if (Object.keys(item.quotation).length !== 0) {
                                return item.quotation.id === quo_id;
                            }
                        });
                        let so_mapped = null;
                        let quo_mapped = null;
                        let opp_mapped = null;
                        if (so_filter.length > 0) {
                            so_mapped = so_filter[0];
                            if (so_mapped) {
                                if (Object.keys(so_mapped.quotation).length !== 0) {
                                    quo_mapped = so_mapped.quotation;
                                }
                                if (Object.keys(so_mapped.opportunity).length !== 0) {
                                    opp_mapped = so_mapped.opportunity;
                                }
                            }
                        }
                        else {
                            let quo_filter = quotation_list.filter(function(item) {
                                return item.id === quo_id;
                            });
                            if (quo_filter.length > 0) {
                                quo_mapped = quo_filter[0];
                            }
                            if (quo_mapped) {
                                if (Object.keys(quo_mapped.opportunity).length !== 0) {
                                    opp_mapped = quo_mapped.opportunity;
                                }
                            }
                        }

                        let so_mapped_id = null;
                        let quo_mapped_id = null;
                        let opp_mapped_id = null;
                        if (so_mapped) {so_mapped_id = so_mapped.id}
                        if (quo_mapped) {quo_mapped_id = quo_mapped.id}
                        if (opp_mapped) {opp_mapped_id = opp_mapped.id}

                        advance_payment_expense_items = [];
                        for (let i = 0; i < ap_list.length; i++) {
                            if (ap_list[i].sale_order_mapped === so_mapped_id && ap_list[i].sale_order_mapped) {
                                advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                            }
                            if (ap_list[i].quotation_mapped === quo_mapped_id && ap_list[i].quotation_mapped) {
                                advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                            }
                            if (ap_list[i].opportunity_mapped === opp_mapped_id && ap_list[i].opportunity_mapped) {
                                advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                            }
                        }

                        // get payment items
                        payment_cost_items_filtered = [];
                        for (let i = 0; i < payment_cost_items_list.length; i++) {
                            // console.log(payment_cost_items_list[i])
                            let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                            if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                                payment_cost_items_filtered.push(payment_cost_items_list[i]);
                            }
                        }
                        if (so_mapped_id) {
                            loadSaleOrderPlan(so_mapped_id, sale_code_detail_show)
                            $('#notify-none-sale-code').prop('hidden', true);
                            $('#tab_plan_datatable').prop('hidden', false);
                        }
                        else if (quo_mapped_id) {
                            loadQuotationPlan(quo_mapped_id, sale_code_detail_show)
                            $('#notify-none-sale-code').prop('hidden', true);
                            $('#tab_plan_datatable').prop('hidden', false);
                        }
                        else {
                            $('#notify-none-sale-code').prop('hidden', false);
                            $('#tab_plan_datatable').prop('hidden', true);
                        }
                    }
                }
                if (payment_detail.opportunity_mapped.length > 0) {
                    sale_code_id_list = sale_code_id_list.concat(payment_detail.opportunity_mapped)
                    for (let i = 0; i < payment_detail.quotation_mapped.length; i++) {
                        let sale_code_detail_show = sale_code_id_list[i].opportunity.code;
                        if (sale_code_detail_show === undefined) {sale_code_detail_show = sale_code_id_list[i].code}
                        // get ap expense items
                        let opp_id = sale_code_mapped[0].id;
                        let so_filter = sale_order_list.filter(function(item) {
                            if (Object.keys(item.opportunity).length !== 0) {
                                return item.opportunity.id === opp_id;
                            }
                        });
                        let so_mapped = null;
                        let quo_mapped = null;
                        let opp_mapped = null;
                        if (so_filter.length > 0) {
                            so_mapped = so_filter[0];
                            if (so_mapped) {
                                if (Object.keys(so_mapped.quotation).length !== 0) {
                                    quo_mapped = so_mapped.quotation;
                                }
                                if (Object.keys(so_mapped.opportunity).length !== 0) {
                                    opp_mapped = so_mapped.opportunity;
                                }
                            }
                        }
                        else {
                            let quo_filter = quotation_list.filter(function(item) {
                                if (Object.keys(item.opportunity).length !== 0) {
                                    return item.opportunity.id === opp_id;
                                }
                            });
                            if (quo_filter.length > 0) {
                                quo_mapped = quo_filter[0];
                            }
                            if (quo_mapped) {
                                if (Object.keys(quo_mapped.opportunity).length !== 0) {
                                    opp_mapped = quo_mapped.opportunity;
                                }
                            }
                        }

                        let so_mapped_id = null;
                        let quo_mapped_id = null;
                        let opp_mapped_id = null;
                        if (so_mapped) {so_mapped_id = so_mapped.id}
                        if (quo_mapped) {quo_mapped_id = quo_mapped.id}
                        if (opp_mapped) {opp_mapped_id = opp_mapped.id}

                        advance_payment_expense_items = [];
                        for (let i = 0; i < ap_list.length; i++) {
                            if (ap_list[i].sale_order_mapped === so_mapped_id && ap_list[i].sale_order_mapped) {
                                advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                            }
                            if (ap_list[i].quotation_mapped === quo_mapped_id && ap_list[i].quotation_mapped) {
                                advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                            }
                            if (ap_list[i].opportunity_mapped === opp_mapped_id && ap_list[i].opportunity_mapped) {
                                advance_payment_expense_items = advance_payment_expense_items.concat(ap_list[i].expense_items)
                            }
                        }

                        // get payment items
                        payment_cost_items_filtered = [];
                        for (let i = 0; i < payment_cost_items_list.length; i++) {
                            // console.log(payment_cost_items_list[i])
                            let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                            if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                                payment_cost_items_filtered.push(payment_cost_items_list[i]);
                            }
                        }
                        if (so_mapped_id) {
                            loadSaleOrderPlan(so_mapped_id, sale_code_detail_show)
                            $('#notify-none-sale-code').prop('hidden', true);
                            $('#tab_plan_datatable').prop('hidden', false);
                        }
                        else if (quo_mapped_id) {
                            loadQuotationPlan(quo_mapped_id, sale_code_detail_show)
                            $('#notify-none-sale-code').prop('hidden', true);
                            $('#tab_plan_datatable').prop('hidden', false);
                        }
                        else {
                            $('#notify-none-sale-code').prop('hidden', false);
                            $('#tab_plan_datatable').prop('hidden', true);
                        }
                    }
                }
            }

            loadSupplier(payment_detail.supplier);

            LoadBankAccount();

            $('select[name="method"]').find(`option[value="` + payment_detail.method + `"]`).prop('selected', true)

            let sale_code_length = sale_code_id_list.length;
            if (sale_code_length > 0) {
                let table_body = $('#tab_line_detail_datatable tbody');
                for (let i = 0; i < payment_detail.expense_mapped.length; i++) {
                    let expense_item = payment_detail.expense_mapped[i];
                    let expense_ap_detail_list = payment_detail.expense_mapped[i].expense_ap_detail_list;
                    table_body.append(`<tr id="" class="row-number">
                        <td class="number text-center"></td>
                        <td><select class="form-select expense-select-box" data-method="GET"><option selected></option></select></td>
                        <td><input class="form-control expense-type" style="color: black;" disabled></td>
                        <td><select class="form-select expense-uom-select-box" data-method="GET"><option selected></option></select></td>
                        <td><input type="number" min="1" onchange="this.value=checkInputQuantity(this.value)" class="form-control expense-quantity" value="1"></td>
                        <td><div class="input-group dropdown" aria-expanded="false" data-bs-toggle="dropdown">
                                <span class="input-affix-wrapper">
                                    <input disabled data-return-type="number" type="text" class="form-control expense-unit-price-select-box mask-money" style="color: black;" placeholder="Select a price or enter">
                                </span>
                            </div>
                            <div style="min-width: 25%" class="dropdown-menu" data-method="GET"></div></td>
                        <td><select class="form-select expense-tax-select-box" data-method="GET"><option selected></option></select></td>
                        <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price mask-money" style="color: black;" disabled></td>
                        <td><input type="text" data-return-type="number" class="form-control expense-subtotal-price-after-tax mask-money" style="color: black;" disabled></td>
                        <td><input type="text" class="form-control expense-document-number" required></td>
                        <td class="action">
                            <a class="btn-del-line-detail btn text-danger btn-link btn-animated" title="Delete row"><span class="icon"><i class="bi bi-dash-circle"></i></span></a>
                            <a class="row-toggle btn text-primary btn-link btn-animated" title="Toggle row"><span class="icon"><i class="bi bi-caret-down-square"></i></span></a>
                        </td>
                    </tr>`);

                    table_body.append(`<tr class="" hidden>
                        <td colspan="1"></td>
                        <td colspan="1">
                            <label class="text-primary"><b>Sale code</b></label>
                        </td>
                        <td colspan="2">
                            <label class="text-primary"><b>Value</b></label>
                        </td>
                        <td colspan="1"></td>
                        <td colspan="2">
                            <label class="text-primary"><b>Value converted from advance payment</b></label>
                        </td>
                        <td colspan="1"></td>
                        <td colspan="1">
                            <label class="text-primary"><b>Sum</b></label>
                        </td>
                        <td colspan="1"></td>
                    </tr>`)

                    for (let i = 0; i < sale_code_length; i++) {
                        let expense_ap_detail_item = expense_ap_detail_list[i];
                        let real_value = expense_ap_detail_item.real_value;
                        if (real_value === undefined) {
                            real_value = 0;
                        }
                        let converted_value = expense_ap_detail_item.converted_value;
                        if (converted_value === undefined) {
                            converted_value = 0;
                        }
                        let sale_code_detail_show = sale_code_id_list[i].opportunity.code;
                        if (sale_code_detail_show === undefined) {sale_code_detail_show = sale_code_id_list[i].code}
                        table_body.append(`<tr class="" hidden>
                            <td colspan="1"></td>
                            <td colspan="1">
                                <span class="sale_code_expense_detail badge badge-outline badge-soft-primary" data-sale-code-id="` + sale_code_id_list[i].id + `"><b>`+ sale_code_detail_show+ `</b></span>
                            </td>
                            <td colspan="2">
                                <input value="` + real_value + `" data-return-type="number" placeholder="Enter payment value" class="value-inp form-control mask-money">
                            </td>
                            <td colspan="1">
                                <center><i class="fas fa-plus text-primary"></i></center>
                            </td>
                            <td colspan="2">
                                <div class="input-group">
                                    <input value="` + converted_value + `" data-return-type="number" placeholder="Click button to select payment value" class="value-converted-from-ap-inp form-control mask-money" disabled style="color: black">
                                    <button style="border: 1px solid #ced4da" data-bs-toggle="offcanvas" disabled
                                    data-bs-target="#offcanvasSelectDetailAP" aria-controls="offcanvasExample" 
                                    class="btn btn-icon btn-flush-primary flush-soft-hover btn-add-payment-value" type="button">
                                        <span class="icon"><i class="bi bi-pencil-square text-primary"></i></span>
                                    </button>
                                </div>
                            </td>
                            <td colspan="1">
                                <center><i class="fas fa-equals text-primary"></i></center>
                            </td>
                            <td colspan="1">
                                <span class="mask-money total-value-salecode-item text-primary" data-init-money="` + expense_ap_detail_item.sum_value + `"></span>
                            </td>
                            <td colspan="1">
                                <script type="application/json" class="detail-ap-items"></script>
                            </td>
                        </tr>`);
                    }

                    $('.value-inp').on('change', function () {
                        let value_converted_from_ap = parseFloat($(this).closest('tr').find('.value-converted-from-ap-inp').attr('value'));
                        let this_value = parseFloat($(this).attr('value'));
                        if (isNaN(value_converted_from_ap)) { value_converted_from_ap = 0; }
                        if (isNaN(this_value)) { this_value = 0; }
                        $(this).closest('tr').find('.total-value-salecode-item').attr('data-init-money', this_value + value_converted_from_ap);
                        $.fn.initMaskMoney2();
                    })

                    table_body.append(`<script>
                        function checkInputQuantity(value) {
                            if (parseInt(value) < 0) {
                                return value*(-1);
                            }
                            return value;
                        }
                    </script>`);

                    let tax_id_value = '';
                    let tax_code_value = '';
                    if (expense_item.tax) {
                        tax_id_value = expense_item.tax.id;
                        tax_code_value = expense_item.tax.code;
                    }
                    let row_count = count_row(table_body, sale_code_length+1, 1, expense_item.expense.id, tax_id_value);

                    $('#row-' + row_count.toString()).find('.expense-type').val($('#row-' + row_count.toString()).find('.expense-select-box option:selected').attr('data-type'));

                    $('#row-' + row_count.toString()).find('.expense-uom-select-box').append(`<option selected>` + expense_item.expense_unit_of_measure.title + `</option>`);

                    $('#row-' + row_count.toString()).find('.expense-quantity').val(expense_item.expense_quantity);

                    $('#row-' + row_count.toString()).find('.expense-unit-price-select-box').attr('value', expense_item.expense_unit_price);

                    $('#row-' + row_count.toString()).find('.expense-subtotal-price').attr('value', expense_item.subtotal_price);

                    $('#row-' + row_count.toString()).find('.expense-subtotal-price-after-tax').attr('value', expense_item.after_tax_price);

                    $('#row-' + row_count.toString()).find('.expense-document-number').val(expense_item.document_number);

                    $('#row-' + row_count.toString()).find('.btn-del-line-detail').on('click', function () {
                        for (let i = 0; i <= sale_code_length; i++) {
                            $(this).closest('tr').next('tr').remove();
                        }
                        $(this).closest('tr').remove();
                        count_row(table_body, sale_code_length, 2, '', '');
                    })

                    $('#row-' + row_count.toString()).find(".row-toggle").on('click', function() {
                        let this_row = $('#row-' + row_count.toString());
                        let this_expense_item = this_row.find('.expense-select-box');
                        let this_type = this_row.find('.expense-type');
                        let this_uom = this_row.find('.expense-uom-select-box');
                        let this_quantity = this_row.find('.expense-quantity');
                        let this_unit_price = this_row.find('.expense-unit-price-select-box');
                        let this_subtotal_price = this_row.find('.expense-subtotal-price');
                        let this_after_tax_subtotal = this_row.find('.expense-subtotal-price-after-tax');
                        let this_document_number = this_row.find('.expense-document-number');

                        if (this_expense_item.val() && this_type.val() && this_uom.val() && this_quantity.val() && this_unit_price.attr('value')
                            && this_subtotal_price.attr('value') && this_after_tax_subtotal.attr('value') && this_document_number.val())
                        {
                            let row_number = this_row.attr('id').split('-')[1];
                            let detail_expense_id = '.row-detail-expense-' + row_number;
                            if ($(detail_expense_id).is(":hidden")) {
                                $(detail_expense_id).prop('hidden', false);
                            }
                            else {
                                $(detail_expense_id).prop('hidden', true);
                            }
                        }
                    });
                    $.fn.initMaskMoney2();
                }
            }

            $('#supplier-detail-span').prop('hidden', false);
            $('#supplier-name').text($('#supplier-select-box option:selected').attr('data-name'));
            $('#supplier-code').text($('#supplier-select-box option:selected').attr('data-code'));
            $('#supplier-owner').text($('#supplier-select-box option:selected').attr('data-owner'));
            $('#supplier-industry').text($('#supplier-select-box option:selected').attr('data-industry'));
            let url = $('#btn-detail-supplier-tab').attr('data-url').replace('0', $('#supplier-select-box option:selected').attr('value'));
            $('#btn-detail-supplier-tab').attr('href', url);
        }

        $('.form-control').prop('disabled', true);
        $('.form-select').prop('disabled', true);
        $('#btn-change-sale-code-type').prop('disabled', true);
        $('#sale-code-select-box2-show').prop('disabled', false);
        $('#btn-add-row-line-detail').addClass('disabled');
        $('.btn-del-line-detail').addClass('disabled');

        $('.form-control').css({
            'color': 'black'
        });
        $('.form-select').css({
            'color': 'black'
        });
        $('.dropdown-toggle').css({
            'color': 'black'
        });
    })

    const sale_order_list = JSON.parse($('#sale_order_list').text());
    const quotation_list = JSON.parse($('#quotation_list').text());
    const expense_list = JSON.parse($('#expense_list').text());
    const employee_list = JSON.parse($('#employee_list').text());
    const unit_of_measure = JSON.parse($('#unit_of_measure').text());
    const tax_list = JSON.parse($('#tax_list').text());
    const account_list = JSON.parse($('#account_list').text());
    const opportunity_list = JSON.parse($('#opportunity_list').text());
    const payment_cost_items_list = JSON.parse($('#payment_cost_items_list').text());
    const account_bank_accounts_information_dict = account_list.reduce((obj, item) => {
        obj[item.id] = item.bank_accounts_information;
        return obj;
    }, {});
    function loadSupplier(supplier_id) {
        let ele = $('#supplier-select-box');
        ele.html('');
        ele.append(`<option></option>`);
        account_list.map(function (item) {
            if (item.account_type.includes('Supplier')) {
                if (item.id === supplier_id) {
                    ele.append(`<option selected data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
                }
                else {
                    ele.append(`<option data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
                }
            }
        })
    }

    function loadCreator() {
        let ele = $('#creator-select-box');
        ele.html('');
        employee_list.map(function (item) {
            if (item.id === $('#data-init-payment-create-request-employee-id').val()) {
                ele.append(`<option selected data-department-id="` + item.group.id + `" data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                $('#creator-detail-span').prop('hidden', false);
                $('#creator-name').text($('#creator-select-box option:selected').attr('data-name'));
                $('#creator-code').text($('#creator-select-box option:selected').attr('data-code'));
                $('#creator-department').text($('#creator-select-box option:selected').attr('data-department'));
                let url = $('#btn-detail-creator-tab').attr('data-url').replace('0', $('#creator-select-box option:selected').attr('value'));
                $('#btn-detail-creator-tab').attr('href', url);
            }
            else {
                ele.append(`<option data-department-id="` + item.group.id + `" data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
            }
        })
        $('#beneficiary-select-box').prop('disabled', true);
        $('#sale-code-select-box').prop('disabled', false);
        $('#sale-code-select-box2').prop('hidden', false);
    }

    function loadBeneficiary(sale_person_id, department_id, creator_id) {
        let ele = $('#beneficiary-select-box');
        ele.html('');
        if (sale_person_id) {
            employee_list.map(function (item) {
                if (item.id === sale_person_id) {
                    ele.append(`<option selected data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                    $('#beneficiary-detail-span').prop('hidden', false);
                    $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
                    $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
                    $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
                    let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
                    $('#btn-detail-beneficiary-tab').attr('href', url);
                }
            })
        }
        else {
            employee_list.map(function (item) {
                if (item.group.id === department_id) {
                    if (item.id === creator_id) {
                        ele.append(`<option selected data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                        $('#beneficiary-detail-span').prop('hidden', false);
                        $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
                        $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
                        $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
                        let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
                        $('#btn-detail-beneficiary-tab').attr('href', url);
                    } else {
                        ele.append(`<option data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                        if ($('#radio-non-sale').is(':checked')) {
                            $('#beneficiary-detail-span').prop('hidden', true);
                            $('#beneficiary-name').text('');
                            $('#beneficiary-code').text('');
                            $('#beneficiary-department').text('');
                            $('#btn-detail-beneficiary-tab').attr('href', '#');
                        }
                    }
                }
            })
        }
    }

    function loadSaleOrderPlan(filter_sale_order_id, filter_sale_order_code) {
        let ap_expense_list_mapped = []
        for (let i = 0; i < advance_payment_expense_items.length; i++) {
            let ap_expense_item = advance_payment_expense_items[i];
            let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                return item.expense_id === ap_expense_item.expense.id;
            });
            let paid = payment_cost_items_list.reduce(function(s, item) {
                return s + item.sum_value;
            }, 0);
            ap_expense_list_mapped.push(
                {
                    'expense_id': ap_expense_item.expense.id,
                    'ap_approved': ap_expense_item.after_tax_price,
                    'returned': ap_expense_item.returned_total,
                    'paid': paid,
                    'remain_ap': ap_expense_item.remain_total,
                }
            )
        }

        let url = $('#tab_plan_datatable').attr('data-url-sale-order') + '?filter_sale_order=' + filter_sale_order_id;
        $.fn.callAjax(url, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $('#tab_plan_datatable tbody').append(`<tr>
                    <td colspan="3"><span class="badge badge-primary">` + filter_sale_order_code + `</span></td>
                    <td colspan="5"></td>
                </tr>`)
                let data_detail = data.sale_order_expense_list;
                for (let i = 0; i < data_detail.length; i++) {
                    let expense_id = data_detail[i].expense_id;
                    let results = advance_payment_expense_items.filter(function(item) {
                        return item.expense.id === expense_id;
                    });
                    let ap_approved = results.reduce(function(s, item) {
                        return s + item.after_tax_price;
                    }, 0);
                    let returned = results.reduce(function(s, item) {
                        return s + item.returned_total;
                    }, 0);
                    let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                        return item.expense_id === expense_id;
                    });
                    let to_payment = payment_cost_items_list.reduce(function(s, item) {
                        return s + item.converted_value;
                    }, 0);
                    let others_payment = payment_cost_items_list.reduce(function(s, item) {
                        return s + item.real_value;
                    }, 0);

                    let plan_after_tax = 0;
                    plan_after_tax = data_detail[i].plan_after_tax;
                    let remain_ap = ap_approved - returned - to_payment;
                    let paid = to_payment + others_payment;
                    let available = plan_after_tax - remain_ap - paid;

                    if (remain_ap < 0) {remain_ap = 0}
                    if (available < 0) {available = 0}

                    let tax_item = '';
                    if (data_detail[i].tax.title) {
                        tax_item = data_detail[i].tax.title;
                    }

                    $('#tab_plan_datatable tbody').append(`<tr>
                        <td><a href="#"><span data-id="` + data_detail[i].expense_id + `">` + data_detail[i].expense_title + `</span></a></td>
                        <td><span class="badge badge-soft-indigo badge-outline">` + tax_item + `</span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + plan_after_tax + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + ap_approved + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + returned + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + remain_ap + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + paid + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + available + `"></span></td>
                    </tr>`)

                    $.fn.initMaskMoney2();
                }
            }
        })
    }

    function loadQuotationPlan(filter_quotation_id, filter_quotation_code) {
        let ap_item = ap_list.filter(function(item) {
            return item.quotation_mapped === filter_quotation_id;
        });

        let ap_expense_list_mapped = []
        for (let i = 0; i < ap_item.length; i++) {
            for (let j = 0; j < ap_item[i].expense_items.length; j++) {
                let ap_expense_item = ap_item[i].expense_items[j];
                let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                    return item.expense_id === ap_expense_item.expense.id;
                });
                let paid = payment_cost_items_list.reduce(function(s, item) {
                    return s + item.sum_value;
                }, 0);
                ap_expense_list_mapped.push(
                    {
                        'expense_id': ap_expense_item.expense.id,
                        'ap_approved': ap_expense_item.after_tax_price,
                        'returned': ap_expense_item.returned_total,
                        'paid': paid,
                        'remain_ap': ap_expense_item.remain_total,
                    }
                )
            }
        }

        let url = $('#tab_plan_datatable').attr('data-url-quotation') + '?filter_quotation=' + filter_quotation_id;
        $.fn.callAjax(url, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $('#tab_plan_datatable tbody').append(`<tr>
                    <td colspan="3"><span class="badge badge-primary">` + filter_quotation_code + `</span></td>
                    <td colspan="5"></td>
                </tr>`)
                let data_detail = data.quotation_expense_list;
                for (let i = 0; i < data_detail.length; i++) {
                    let expense_id = data_detail[i].expense_id;
                    let results = advance_payment_expense_items.filter(function (item) {
                        return item.expense.id === expense_id;
                    });
                    let ap_approved = results.reduce(function (s, item) {
                        return s + item.after_tax_price;
                    }, 0);
                    let returned = results.reduce(function (s, item) {
                        return s + item.returned_total;
                    }, 0);
                    let payment_cost_items_list = payment_cost_items_filtered.filter(function (item) {
                        return item.expense_id === expense_id;
                    });
                    let to_payment = payment_cost_items_list.reduce(function (s, item) {
                        return s + item.converted_value;
                    }, 0);
                    let others_payment = payment_cost_items_list.reduce(function (s, item) {
                        return s + item.real_value;
                    }, 0);

                    let plan_after_tax = 0;
                    plan_after_tax = data_detail[i].plan_after_tax;
                    let remain_ap = ap_approved - returned - to_payment;
                    let paid = to_payment + others_payment;
                    let available = plan_after_tax - remain_ap - paid;

                    if (remain_ap < 0) {
                        remain_ap = 0
                    }
                    if (available < 0) {
                        available = 0
                    }

                    let tax_item = '';
                    if (data_detail[i].tax.title) {
                        tax_item = data_detail[i].tax.title;
                    }

                    $('#tab_plan_datatable tbody').append(`<tr>
                        <td><a href="#"><span data-id="` + data_detail[i].expense_id + `">` + data_detail[i].expense_title + `</span></a></td>
                        <td><span class="badge badge-soft-indigo badge-outline">` + tax_item + `</span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + plan_after_tax + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + ap_approved + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + returned + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + remain_ap + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + paid + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + available + `"></span></td>
                    </tr>`)

                    $.fn.initMaskMoney2();
                }
            }
        })
    }

    function loadSaleOrderPlanMULTI(filter_sale_order_id) {
        let ap_expense_list_mapped = []
        for (let i = 0; i < advance_payment_expense_items.length; i++) {
            let ap_expense_item = advance_payment_expense_items[i];
            let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                return item.expense_id === ap_expense_item.expense.id;
            });
            let paid = payment_cost_items_list.reduce(function(s, item) {
                return s + item.sum_value;
            }, 0);
            ap_expense_list_mapped.push(
                {
                    'expense_id': ap_expense_item.expense.id,
                    'ap_approved': ap_expense_item.after_tax_price,
                    'returned': ap_expense_item.returned_total,
                    'paid': paid,
                    'remain_ap': ap_expense_item.remain_total,
                }
            )
        }

        let url = $('#tab_plan_datatable').attr('data-url-sale-order') + '?filter_sale_order=' + filter_sale_order_id;
        $.fn.callAjax(url, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let found_line = $(`#tab_plan_datatable tbody tr td[data-sale-code-id="` + filter_sale_order_id + `"]`).closest('tr');
                $(`#tab_plan_datatable tbody tr[class="detail-line-for-` + filter_sale_order_id + `"`).remove();
                let data_detail = data.sale_order_expense_list;
                let new_line = ``;
                for (let i = 0; i < data_detail.length; i++) {
                    let expense_id = data_detail[i].expense_id;
                    let results = advance_payment_expense_items.filter(function(item) {
                        return item.expense.id === expense_id;
                    });
                    let ap_approved = results.reduce(function(s, item) {
                        return s + item.after_tax_price;
                    }, 0);
                    let returned = results.reduce(function(s, item) {
                        return s + item.returned_total;
                    }, 0);
                    let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                        return item.expense_id === expense_id;
                    });
                    let to_payment = payment_cost_items_list.reduce(function(s, item) {
                        return s + item.converted_value;
                    }, 0);
                    let others_payment = payment_cost_items_list.reduce(function(s, item) {
                        return s + item.real_value;
                    }, 0);

                    let plan_after_tax = 0;
                    plan_after_tax = data_detail[i].plan_after_tax;
                    let remain_ap = ap_approved - returned - to_payment;
                    let paid = to_payment + others_payment;
                    let available = plan_after_tax - remain_ap - paid;

                    if (remain_ap < 0) {remain_ap = 0}
                    if (available < 0) {available = 0}

                    let tax_item = '';
                    if (data_detail[i].tax.title) {
                        tax_item = data_detail[i].tax.title;
                    }

                    new_line = new_line + `<tr class="detail-line-for-` + filter_sale_order_id + `">
                        <td><a href="#"><span data-id="` + data_detail[i].expense_id + `">` + data_detail[i].expense_title + `</span></a></td>
                        <td><span class="badge badge-soft-indigo badge-outline">` + tax_item + `</span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + plan_after_tax + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + ap_approved + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + returned + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + remain_ap + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + paid + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + available + `"></span></td>
                    </tr>`
                }
                found_line.after(new_line);
                $.fn.initMaskMoney2();
            }
        })
    }

    function loadQuotationPlanMULTI(filter_quotation_id) {
        let ap_item = ap_list.filter(function(item) {
            return item.quotation_mapped === filter_quotation_id;
        });

        let ap_expense_list_mapped = []
        for (let i = 0; i < ap_item.length; i++) {
            for (let j = 0; j < ap_item[i].expense_items.length; j++) {
                let ap_expense_item = ap_item[i].expense_items[j];
                let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                    return item.expense_id === ap_expense_item.expense.id;
                });
                let paid = payment_cost_items_list.reduce(function(s, item) {
                    return s + item.sum_value;
                }, 0);
                ap_expense_list_mapped.push(
                    {
                        'expense_id': ap_expense_item.expense.id,
                        'ap_approved': ap_expense_item.after_tax_price,
                        'returned': ap_expense_item.returned_total,
                        'paid': paid,
                        'remain_ap': ap_expense_item.remain_total,
                    }
                )
            }
        }

        let url = $('#tab_plan_datatable').attr('data-url-quotation') + '?filter_quotation=' + filter_quotation_id;
        $.fn.callAjax(url, 'GET').then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let found_line = $(`#tab_plan_datatable tbody tr td[data-sale-code-id="` + filter_quotation_id + `"]`).closest('tr');
                $(`#tab_plan_datatable tbody tr[class="detail-line-for-` + filter_quotation_id + `"`).remove();
                let new_line = ``;
                let data_detail = data.quotation_expense_list;
                for (let i = 0; i < data_detail.length; i++) {
                    let expense_id = data_detail[i].expense_id;
                    let results = advance_payment_expense_items.filter(function (item) {
                        return item.expense.id === expense_id;
                    });
                    let ap_approved = results.reduce(function (s, item) {
                        return s + item.after_tax_price;
                    }, 0);
                    let returned = results.reduce(function (s, item) {
                        return s + item.returned_total;
                    }, 0);
                    let payment_cost_items_list = payment_cost_items_filtered.filter(function (item) {
                        return item.expense_id === expense_id;
                    });
                    let to_payment = payment_cost_items_list.reduce(function (s, item) {
                        return s + item.converted_value;
                    }, 0);
                    let others_payment = payment_cost_items_list.reduce(function (s, item) {
                        return s + item.real_value;
                    }, 0);

                    let plan_after_tax = 0;
                    plan_after_tax = data_detail[i].plan_after_tax;
                    let remain_ap = ap_approved - returned - to_payment;
                    let paid = to_payment + others_payment;
                    let available = plan_after_tax - remain_ap - paid;

                    if (remain_ap < 0) {
                        remain_ap = 0
                    }
                    if (available < 0) {
                        available = 0
                    }

                    let tax_item = '';
                    if (data_detail[i].tax.title) {
                        tax_item = data_detail[i].tax.title;
                    }

                    new_line = new_line + `<tr class="detail-line-for-` + filter_quotation_id + `">
                        <td><a href="#"><span data-id="` + data_detail[i].expense_id + `">` + data_detail[i].expense_title + `</span></a></td>
                        <td><span class="badge badge-soft-indigo badge-outline">` + tax_item + `</span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + plan_after_tax + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + ap_approved + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + returned + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + remain_ap + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + paid + `"></span></td>
                        <td><span class="mask-money text-primary" data-init-money="` + available + `"></span></td>
                    </tr>`
                }
                found_line.after(new_line);
                $.fn.initMaskMoney2();
            }
        })
    }

    function count_row(table_body, sale_code_length, option, expense_id, tax_id) {
        let count = 0;
        table_body.find('tr td.number').each(function() {
            count = count + 1;
            $(this).text(count);
            $(this).closest('tr').attr('id', 'row-' + count.toString());
            let detail_expense_element = $(this).closest('tr').nextAll().slice(0, sale_code_length)
            detail_expense_element.each(function (index, element) {
                $(this).attr('class', 'row-detail-expense-' + count.toString());
            });
        });
        if (option === 1) {
            loadExpenseList('row-' + count.toString(), expense_id);
            loadExpenseTaxList('row-' + count.toString(), tax_id);
        }
        return count;
    }

    function loadExpenseList(row_id, expense_id) {
        let ele = $('#' + row_id + ' .expense-select-box');
        ele.select2();
        ele.html('');
        ele.append(`<option></option>`);
        expense_list.map(function (item) {
            let tax_code_id = '';
            if (item.general_information.tax_code) {
                tax_code_id = item.general_information.tax_code.id;
            }
            if (item.id === expense_id) {
                ele.append(`<option selected data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.expense_type.title + `" data-uom-id="` + item.general_information.uom.id + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
            }
            else {
                ele.append(`<option data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.expense_type.title + `" data-uom-id="` + item.general_information.uom.id + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
            }
        })
    }

    function loadExpenseTaxList(row_id, tax_id) {
        let ele = $('#' + row_id + ' .expense-tax-select-box');
        ele.html('');
        ele.append(`<option data-rate="0" selected></option>`);
        tax_list.map(function (item) {
            if (item.id === tax_id) {
                ele.append(`<option selected data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
            }
            else {
                ele.append(`<option data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
            }
        })
    }

    function LoadBankAccount() {
        let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
        let bank_info = account_bank_accounts_information_dict[supplier_id];
        let list_bank_accounts_html = ``;

        if (bank_info.length > 0) {
            for (let i = 0; i < bank_info.length; i++) {
                let country_id = bank_info[i].country_id;
                let bank_name = bank_info[i].bank_name;
                let bank_code = bank_info[i].bank_code;
                let bank_account_name = bank_info[i].bank_account_name;
                let bank_account_number = bank_info[i].bank_account_number;
                let bic_swift_code = bank_info[i].bic_swift_code;
                let is_default = '';
                if (bank_info[i].is_default) {
                    is_default = 'checked';
                }
                list_bank_accounts_html += `<div id="bank-account-` + i + `" style="border: solid 2px #ddd;" class="card card-bank-account col-5 ml-3">
                            <span class="mt-2">
                                <div class="row">
                                    <div class="col-6">
                                        <a class="btn-del-bank-account" href="#"><i class="bi bi-x"></i></a>
                                    </div>
                                    <div class="col-6 text-right">
                                        <input disabled class="form-check-input ratio-select-bank-account-default" type="radio" name="bank-account-select-default"` + is_default + `>
                                    </div>
                                </div>
                            </span>
                            <label class="ml-4">Bank account name: <a href="#" class="bank-account-name-label"><b>` + bank_account_name + `</b></a></label>
                            <label class="ml-4">Bank name: <a href="#" class="bank-name-label"><b>` + bank_name + `</b></a></label>
                            <label class="ml-4">Bank account number: <a href="#" class="bank-account-number-label"><b>` + bank_account_number + `</b></a></label>
                            <label hidden class="ml-4">Country ID: <a class="country-id-label"><b>` + country_id + `</b></a></label>
                            <label hidden class="ml-4">Bank code: <a class="bank-code-label"><b>` + bank_code + `</b></a></label>
                            <label hidden class="ml-4">BIC/SWIFT Code: <a class="bic-swift-code-label"><b>` + bic_swift_code + `</b></a></label>
                            <span class="mb-2">
                                <div class="row">
                                    <div class="col-12 text-right">
                                        <a data-bs-toggle="offcanvas" data-bs-target="#modal-bank-account-information" type="button"
                                           class="btn-edit-bank-account mr-1" href="#">
                                           <i class="bi bi-pencil-square"></i>
                                        </a>
                                    </div>
                                </div>
                            </span>
                        </div>`
            }
            $('#list-bank-account-information').html(list_bank_accounts_html);
            // delete bank account item
            $('.btn-del-bank-account').on('click', function () {
                let bank_order = parseInt($(this).closest('.card').attr('id').replace('bank-account-', ''));
                let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
                account_bank_accounts_information_dict[supplier_id].splice(bank_order, 1);
                $(this).closest('.card').remove();
            })
            // edit bank account item
            $('.btn-edit-bank-account').on('click', ClickEditBankBtn);
        }
        else {
            let supplier_name = $('#supplier-select-box').find('option:selected').text()
            $('#list-bank-account-information').html(`<div class="row">
                <div class="col-12">
                    <div id="notify-none-bank-account" class="alert alert-secondary" role="alert">
                        <span class="alert-icon-wrap"></span>
                        "` + supplier_name + `" has no bank accounts information!
                    </div>
                </div>
            </div>`);
        }
    }

    function ClickEditBankBtn() {
        loadCountries($(this).closest('.card').find('a.country-id-label').text());
        $('#bank-account-order').val($(this).closest('.card').attr('id'));
        $('#bank-name-id').val($(this).closest('.card').find('a.bank-name-label').text());
        $('#bank-code-id').val($(this).closest('.card').find('a.bank-code-label').text());
        $('#bank-account-name-id').val($(this).closest('.card').find('a.bank-account-name-label').text());
        $('#bank-account-number-id').val($(this).closest('.card').find('a.bank-account-number-label').text());
        $('#bic-swift-code-id').val($(this).closest('.card').find('a.bic-swift-code-label').text());

        let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
        let bank_order = parseInt($(this).closest('.card').attr('id').replace('bank-account-', ''));
        let is_default = account_bank_accounts_information_dict[supplier_id][bank_order].is_default
        if (is_default) {
            $('#make-default-shipping-address').prop('checked', true);
            $('#make-default-shipping-address').prop('disabled', true);
        }
        else {
            $('#make-default-shipping-address').prop('checked', false);
            $('#make-default-shipping-address').prop('disabled', false);
        }
    }

    function loadCountries(country_mapped) {
        let ele = $('#country-select-box-id');
        let url = ele.attr('data-url');
        let method = ele.attr('data-method');
        $.fn.callAjax(url, method).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    ele.text("");
                    ele.append(`<option value="" selected></option>`)
                    if (data.hasOwnProperty('countries') && Array.isArray(data.countries)) {
                        data.countries.map(function (item) {
                            if (country_mapped === item.id) {
                                ele.append(`<option value="` + item.id + `" selected>` + item.title + `</option>`)
                            } else {
                                ele.append(`<option value="` + item.id + `">` + item.title + `</option>`)
                            }
                        })
                    }
                }
            }
        )
    }

    function ChangeBankInfor() {
        let supplier_id = $('#supplier-select-box').find('option:selected').attr('value');
        let bank_order = parseInt($('#bank-account-order').val().replace('bank-account-', ''));
        let is_default = false;
        if ($('#make-default-shipping-address').is(':checked')) {
            is_default = true;
        }
        for (let i = 0; i < account_bank_accounts_information_dict[supplier_id].length; i++) {
            if (is_default) {
                if (i !== bank_order) {
                    account_bank_accounts_information_dict[supplier_id][i].is_default = false;
                }
                else {
                    account_bank_accounts_information_dict[supplier_id][i] = {
                        "bank_code": $('#bank-code-id').val(),
                        "bank_name": $('#bank-name-id').val(),
                        "country_id": $('#country-select-box-id option:selected').attr('value'),
                        "is_default": is_default,
                        "bic_swift_code": $('#bic-swift-code-id').val(),
                        "bank_account_name": $('#bank-account-name-id').val(),
                        "bank_account_number": $('#bank-account-number-id').val()
                    }
                }
            }
            else {
                if (i === bank_order) {
                    account_bank_accounts_information_dict[supplier_id][i] = {
                        "bank_code": $('#bank-code-id').val(),
                        "bank_name": $('#bank-name-id').val(),
                        "country_id": $('#country-select-box-id option:selected').attr('value'),
                        "is_default": is_default,
                        "bic_swift_code": $('#bic-swift-code-id').val(),
                        "bank_account_name": $('#bank-account-name-id').val(),
                        "bank_account_number": $('#bank-account-number-id').val()
                    }
                }
            }
        }
    }

    $('#save-changes-modal-bank-account').on('click', function () {
        ChangeBankInfor();
        LoadBankAccount();
        $('#btn-close-edit-bank-account').click();
    })

    loadCreator();
    $('#beneficiary-select-box').select2();

    $('#input-file-now').dropify({
        messages: {
            'default': 'Drag and drop your file here.',
        },
        tpl: {
            message: '<div class="dropify-message">' +
                '<span class="file-icon"></span>' +
                '<h5>{{ default }}</h5>' +
                '</div>',
        }
    });
})
