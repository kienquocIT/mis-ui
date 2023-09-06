$(document).ready(function () {
    const sale_order_list = JSON.parse($('#sale_order_list').text());
    const quotation_list = JSON.parse($('#quotation_list').text());
    const product_list = JSON.parse($('#product_list').text());
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

    let current_value_converted_from_ap = '';
    let payment_cost_items_filtered = [];
    let advance_payment_product_items = [];
    const ap_list = JSON.parse($('#advance_payment_list').text());

    const urlParams = new URLSearchParams(window.location.search);
    let param = null;
    let param_temp_1 = urlParams.get('sale_code_mapped');
    if (param_temp_1) {param = param_temp_1};
    let param_temp_2 = urlParams.get('opportunity');
    if (param_temp_2) {param = param_temp_2};
    const sale_code_mapped_parameter = param;
    let sale_order = []
    let quotation = []
    let opportunity = []
    if (sale_order_list !== {}) {
        sale_order = sale_order_list.filter(function(element) {
            return element.id === sale_code_mapped_parameter;}
        );
    }
    if (quotation_list !== {}) {
        quotation = quotation_list.filter(function (element) {
            return element.id === sale_code_mapped_parameter;
        });
    }
    if (opportunity_list !== {}) {
        opportunity = opportunity_list.filter(function (element) {
            return element.id === sale_code_mapped_parameter;
        });
    }
    let sale_code_default_obj = [];
    let sale_code_default_type = -1;
    if (sale_order.length > 0) {sale_code_default_obj = sale_order; sale_code_default_type = 0;}
    if (quotation.length > 0) {sale_code_default_obj = quotation; sale_code_default_type = 1;}
    if (opportunity.length > 0) {sale_code_default_obj = opportunity; sale_code_default_type = 2;}

    function loadSaleOrderPlan(filter_sale_order_id, filter_sale_order_code) {
        let ap_product_list_mapped = []
        for (let i = 0; i < advance_payment_product_items.length; i++) {
            let ap_product_item = advance_payment_product_items[i];
            let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                return item.product_id === ap_product_item.product.id;
            });
            let paid = payment_cost_items_list.reduce(function(s, item) {
                return s + item.sum_value;
            }, 0);
            ap_product_list_mapped.push(
                {
                    'product_id': ap_product_item.product.id,
                    'ap_approved': ap_product_item.after_tax_price,
                    'returned': ap_product_item.returned_total,
                    'paid': paid,
                    'remain_ap': ap_product_item.remain_total,
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
                    let results = advance_payment_product_items.filter(function(item) {
                        return item.product.id === expense_id;
                    });
                    let ap_approved = results.reduce(function(s, item) {
                        return s + item.after_tax_price;
                    }, 0);
                    let returned = results.reduce(function(s, item) {
                        return s + item.returned_total;
                    }, 0);
                    let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                        return item.product_id === expense_id;
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
            if (item.quotation_mapped) {
                return item.quotation_mapped.id === filter_quotation_id;
            }
        });

        let ap_product_list_mapped = []
        for (let i = 0; i < ap_item.length; i++) {
            for (let j = 0; j < ap_item[i].product_items.length; j++) {
                let ap_product_item = ap_item[i].product_items[j];
                let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                    return item.product_id === ap_product_item.product.id;
                });
                let paid = payment_cost_items_list.reduce(function(s, item) {
                    return s + item.sum_value;
                }, 0);
                ap_product_list_mapped.push(
                    {
                        'product_id': ap_product_item.product.id,
                        'ap_approved': ap_product_item.after_tax_price,
                        'returned': ap_product_item.returned_total,
                        'paid': paid,
                        'remain_ap': ap_product_item.remain_total,
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
                    let results = advance_payment_product_items.filter(function (item) {
                        return item.product.id === expense_id;
                    });
                    let ap_approved = results.reduce(function (s, item) {
                        return s + item.after_tax_price;
                    }, 0);
                    let returned = results.reduce(function (s, item) {
                        return s + item.returned_total;
                    }, 0);
                    let payment_cost_items_list = payment_cost_items_filtered.filter(function (item) {
                        return item.product_id === expense_id;
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
        let ap_product_list_mapped = []
        for (let i = 0; i < advance_payment_product_items.length; i++) {
            let ap_product_item = advance_payment_product_items[i];
            let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                return item.product_id === ap_product_item.product.id;
            });
            let paid = payment_cost_items_list.reduce(function(s, item) {
                return s + item.sum_value;
            }, 0);
            ap_product_list_mapped.push(
                {
                    'product_id': ap_product_item.product.id,
                    'ap_approved': ap_product_item.after_tax_price,
                    'returned': ap_product_item.returned_total,
                    'paid': paid,
                    'remain_ap': ap_product_item.remain_total,
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
                    let results = advance_payment_product_items.filter(function(item) {
                        return item.product.id === expense_id;
                    });
                    let ap_approved = results.reduce(function(s, item) {
                        return s + item.after_tax_price;
                    }, 0);
                    let returned = results.reduce(function(s, item) {
                        return s + item.returned_total;
                    }, 0);
                    let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                        return item.product_id === expense_id;
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
                if (new_line === '') {
                    found_line.after(`<tr class="detail-line-for-` + filter_sale_order_id + `"><td colspan="8">No Plan Information</td></tr>`);
                }
                else {
                    found_line.after(new_line);
                }
                $.fn.initMaskMoney2();
            }
        })
    }

    function loadQuotationPlanMULTI(filter_quotation_id) {
        let ap_item = ap_list.filter(function(item) {
            if (item.quotation_mapped) {
                return item.quotation_mapped.id === filter_quotation_id;
            }
        });

        let ap_product_list_mapped = []
        for (let i = 0; i < ap_item.length; i++) {
            for (let j = 0; j < ap_item[i].product_items.length; j++) {
                let ap_product_item = ap_item[i].product_items[j];
                let payment_cost_items_list = payment_cost_items_filtered.filter(function(item) {
                    return item.product_id === ap_product_item.product.id;
                });
                let paid = payment_cost_items_list.reduce(function(s, item) {
                    return s + item.sum_value;
                }, 0);
                ap_product_list_mapped.push(
                    {
                        'product_id': ap_product_item.product.id,
                        'ap_approved': ap_product_item.after_tax_price,
                        'returned': ap_product_item.returned_total,
                        'paid': paid,
                        'remain_ap': ap_product_item.remain_total,
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
                    let results = advance_payment_product_items.filter(function (item) {
                        return item.product.id === expense_id;
                    });
                    let ap_approved = results.reduce(function (s, item) {
                        return s + item.after_tax_price;
                    }, 0);
                    let returned = results.reduce(function (s, item) {
                        return s + item.returned_total;
                    }, 0);
                    let payment_cost_items_list = payment_cost_items_filtered.filter(function (item) {
                        return item.product_id === expense_id;
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
                if (new_line === '') {
                    found_line.after(`<tr class="detail-line-for-` + filter_quotation_id + `"><td colspan="8">No Plan Information</td></tr>`);
                }
                else {
                    found_line.after(new_line);
                }
                $.fn.initMaskMoney2();
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
            } else {
                ele.append(`<option data-department-id="` + item.group.id + `" data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
            }
        })
        let beneficiary = $('#data-init-payment-create-request-employee-id').val()
        if (sale_code_default_obj.length > 0) {
            beneficiary = sale_code_default_obj[0].sale_person.id;
        }
        loadSaleCode(beneficiary);
        if (sale_code_default_type === -1) {
            loadBeneficiary($('#creator-select-box option:selected').attr('data-department-id'), $('#data-init-payment-create-request-employee-id').val());
        }
        else {
            if (sale_code_default_type === 0) {
                $('#sale-code-select-box').prop('disabled', true);
                // $('#beneficiary-select-box').prop('disabled', true);
                $('#btn-change-sale-code-type').prop('disabled', true);
                // get ap product items
                let so_id = sale_code_default_obj[0].id;
                let so_filter = sale_order_list.filter(function (item) {
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
                if (so_mapped) {
                    so_mapped_id = so_mapped.id
                }
                if (quo_mapped) {
                    quo_mapped_id = quo_mapped.id
                }
                if (opp_mapped) {
                    opp_mapped_id = opp_mapped.id
                }

                advance_payment_product_items = [];
                for (let i = 0; i < ap_list.length; i++) {
                    if (ap_list[i].sale_order_mapped) {
                        if (ap_list[i].sale_order_mapped.id === so_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    if (ap_list[i].quotation_mapped) {
                        if (ap_list[i].quotation_mapped.id === quo_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    if (ap_list[i].opportunity_mapped) {
                        if (ap_list[i].opportunity_mapped.id === opp_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                }
                // console.log(0, advance_payment_product_items)

                // get payment items
                payment_cost_items_filtered = [];
                for (let i = 0; i < payment_cost_items_list.length; i++) {
                    let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                    if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                        payment_cost_items_filtered.push(payment_cost_items_list[i]);
                    }
                }

                let sale_code_CODE_plan = so_mapped.code;
                if (opp_mapped) {
                    sale_code_CODE_plan = opp_mapped.code;
                }

                $('#sale-code-select-box').val(so_mapped.code).trigger('change');
                let beneficiaries_mapped = [];
                beneficiaries_mapped.push(so_mapped.sale_person.id)
                if (so_mapped.opportunity) {
                    $.each(so_mapped.opportunity.opportunity_sale_team_datas, function (index, member_obj) {
                        if (beneficiaries_mapped.includes(member_obj.member.id) === false) {
                            beneficiaries_mapped.push(member_obj.member.id);
                        }
                    })
                }
                loadBeneficiaryDefault($('#creator-select-box option:selected').attr('data-department-id'), beneficiaries_mapped);

                loadSaleOrderPlan(so_mapped_id, sale_code_CODE_plan);
                $('#notify-none-sale-code').prop('hidden', true);
                $('#tab_plan_datatable').prop('hidden', false);
            }
            else if (sale_code_default_type === 1) {
                $('#sale-code-select-box').prop('disabled', true);
                // $('#beneficiary-select-box').prop('disabled', true);
                $('#btn-change-sale-code-type').prop('disabled', true);
                // get ap product items
                let quo_id = sale_code_default_obj[0].id;
                let so_filter = sale_order_list.filter(function (item) {
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
                } else {
                    let quo_filter = quotation_list.filter(function (item) {
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
                if (so_mapped) {
                    so_mapped_id = so_mapped.id
                }
                if (quo_mapped) {
                    quo_mapped_id = quo_mapped.id
                }
                if (opp_mapped) {
                    opp_mapped_id = opp_mapped.id
                }

                advance_payment_product_items = [];
                for (let i = 0; i < ap_list.length; i++) {
                    if (ap_list[i].sale_order_mapped) {
                        if (ap_list[i].sale_order_mapped.id === so_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    if (ap_list[i].quotation_mapped) {
                        if (ap_list[i].quotation_mapped.id === quo_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    if (ap_list[i].opportunity_mapped) {
                        if (ap_list[i].opportunity_mapped.id === opp_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                }
                // console.log(advance_payment_product_items)

                // get payment items
                payment_cost_items_filtered = [];
                for (let i = 0; i < payment_cost_items_list.length; i++) {
                    let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                    if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                        payment_cost_items_filtered.push(payment_cost_items_list[i]);
                    }
                }

                if (so_mapped) {
                    let sale_code_CODE_plan = so_mapped.code;
                    if (opp_mapped) {
                        sale_code_CODE_plan = opp_mapped.code;
                    }

                    $('#sale-code-select-box').val(so_mapped.code).trigger('change');
                    let beneficiaries_mapped = [];
                    beneficiaries_mapped.push(so_mapped.sale_person.id)
                    if (so_mapped.opportunity) {
                        $.each(so_mapped.opportunity.opportunity_sale_team_datas, function (index, member_obj) {
                            if (beneficiaries_mapped.includes(member_obj.member.id) === false) {
                                beneficiaries_mapped.push(member_obj.member.id);
                            }
                        })
                    }
                    loadBeneficiaryDefault($('#creator-select-box option:selected').attr('data-department-id'), beneficiaries_mapped);

                    loadSaleOrderPlan(so_mapped_id, sale_code_CODE_plan);
                }
                else if (quo_mapped) {
                    let sale_code_CODE_plan = quo_mapped.code;
                    if (opp_mapped) {
                        sale_code_CODE_plan = opp_mapped.code;
                    }

                    $('#sale-code-select-box').val(quo_mapped.code).trigger('change');
                    let beneficiaries_mapped = [];
                    beneficiaries_mapped.push(quo_mapped.sale_person.id)
                    if (quo_mapped.opportunity) {
                        $.each(quo_mapped.opportunity.opportunity_sale_team_datas, function (index, member_obj) {
                            if (beneficiaries_mapped.includes(member_obj.member.id) === false) {
                                beneficiaries_mapped.push(member_obj.member.id);
                            }
                        })
                    }
                    loadBeneficiaryDefault($('#creator-select-box option:selected').attr('data-department-id'), beneficiaries_mapped);

                    loadQuotationPlan(quo_mapped_id, sale_code_CODE_plan);
                }

                $('#notify-none-sale-code').prop('hidden', true);
                $('#tab_plan_datatable').prop('hidden', false);
            }
            else if (sale_code_default_type === 2) {
                $('#sale-code-select-box').prop('disabled', true);
                $('#btn-change-sale-code-type').prop('disabled', true);
                // get ap product items
                let opp_id = sale_code_default_obj[0].id;
                let so_filter = sale_order_list.filter(function (item) {
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
                } else {
                    let quo_filter = quotation_list.filter(function (item) {
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

                if (opp_mapped === null) {
                    let opp_filter = opportunity_list.filter(function (item) {
                        return item.id === opp_id;
                    });
                    if (opp_filter.length > 0) {
                        opp_mapped = opp_filter[0];
                    }
                }

                let so_mapped_id = null;
                let quo_mapped_id = null;
                let opp_mapped_id = null;
                if (so_mapped) {
                    so_mapped_id = so_mapped.id
                }
                if (quo_mapped) {
                    quo_mapped_id = quo_mapped.id
                }
                if (opp_mapped) {
                    opp_mapped_id = opp_mapped.id
                }

                advance_payment_product_items = [];
                for (let i = 0; i < ap_list.length; i++) {
                    if (ap_list[i].sale_order_mapped) {
                        if (ap_list[i].sale_order_mapped.id === so_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    if (ap_list[i].quotation_mapped) {
                        if (ap_list[i].quotation_mapped.id === quo_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    if (ap_list[i].opportunity_mapped) {
                        if (ap_list[i].opportunity_mapped.id === opp_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                }

                // get payment items
                payment_cost_items_filtered = [];
                for (let i = 0; i < payment_cost_items_list.length; i++) {
                    let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                    if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                        payment_cost_items_filtered.push(payment_cost_items_list[i]);
                    }
                }
                if (so_mapped) {
                    let sale_code_CODE_plan = so_mapped.code;
                    if (opp_mapped) {
                        sale_code_CODE_plan = opp_mapped.code;
                    }

                    $('#sale-code-select-box').val(so_mapped.code).trigger('change');
                    let beneficiaries_mapped = [];
                    beneficiaries_mapped.push(so_mapped)

                    if (so_mapped.opportunity) {
                        $.each(so_mapped.opportunity.opportunity_sale_team_datas, function (index, member_obj) {
                            if (beneficiaries_mapped.includes(member_obj.member.id) === false) {
                                beneficiaries_mapped.push(member_obj.member.id);
                            }
                        })
                    }
                    loadBeneficiaryDefault($('#creator-select-box option:selected').attr('data-department-id'), beneficiaries_mapped);

                    loadSaleOrderPlan(so_mapped_id, sale_code_CODE_plan)
                    $('#notify-none-sale-code').prop('hidden', true);
                    $('#tab_plan_datatable').prop('hidden', false);
                }
                else if (quo_mapped) {
                    let sale_code_CODE_plan = quo_mapped.code;
                    if (opp_mapped) {
                        sale_code_CODE_plan = opp_mapped.code;
                    }

                    $('#sale-code-select-box').val(quo_mapped.code).trigger('change');
                    let beneficiaries_mapped = [];
                    beneficiaries_mapped.push(quo_mapped.sale_person.id)
                    if (quo_mapped.opportunity) {
                        $.each(quo_mapped.opportunity.opportunity_sale_team_datas, function (index, member_obj) {
                            if (beneficiaries_mapped.includes(member_obj.member.id) === false) {
                                beneficiaries_mapped.push(member_obj.member.id);
                            }
                        })
                    }
                    loadBeneficiaryDefault($('#creator-select-box option:selected').attr('data-department-id'), beneficiaries_mapped);

                    loadQuotationPlan(quo_mapped_id, sale_code_CODE_plan)
                    $('#notify-none-sale-code').prop('hidden', true);
                    $('#tab_plan_datatable').prop('hidden', false);
                }
                else if (opp_mapped) {
                    $('#sale-code-select-box').val(opp_mapped.code).trigger('change');
                    let beneficiaries_mapped = [];
                    beneficiaries_mapped.push(opp_mapped.sale_person.id)
                    $.each(opp_mapped.opportunity_sale_team_datas, function (index, member_obj) {
                        if (beneficiaries_mapped.includes(member_obj.member.id) === false) {
                            beneficiaries_mapped.push(member_obj.member.id);
                        }
                    })
                    loadBeneficiaryDefault($('#creator-select-box option:selected').attr('data-department-id'), beneficiaries_mapped);

                    $('#notify-none-sale-code').prop('hidden', false);
                    $('#tab_plan_datatable').prop('hidden', true);
                }
            }
        }
    }

    function loadBeneficiary(department_id, creator_id) {
        let ele = $('#beneficiary-select-box');
        ele.html('');
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

    function loadBeneficiaryDefault(department_id, beneficiaries_mapped) {
        let ele = $('#beneficiary-select-box');
        ele.html('');
        ele.append(`<option></option>`);
        employee_list.map(function (item) {
            if (beneficiaries_mapped.includes(item.id)) {
                if (item.group.id === department_id) {
                    ele.append(`<option data-department="` + item.group.title + `" data-code="` + item.code + `" data-name="` + item.full_name + `" value="` + item.id + `">` + item.full_name + `</option>`);
                }
            }
        })
    }

    function loadSaleCode(beneficiary) {
        $('#notify-none-sale-code').prop('hidden', false);
        $('#tab_plan_datatable').prop('hidden', true);
        let quotation_loaded = [];
        let oppcode_loaded = [];
        let ele = $('#sale-code-select-box');
        ele.prop('multiple', false);
        ele.html('');
        ele.append(`<option></option>`);
        sale_order_list.map(function (item) {
            let added = false;
            if (item.sale_person.id === beneficiary) {
                if (Object.keys(item.quotation).length !== 0) {
                    quotation_loaded.push(item.quotation.id);
                }
                if (Object.keys(item.opportunity).length !== 0) {
                    if (item.opportunity.is_close === false) {
                        oppcode_loaded.push(item.opportunity.id);
                        ele.append(`<option class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" data-opp-id="` + item.opportunity.id + `" title="` + item.opportunity.code + `: ` + item.opportunity.title + `" data-sale-code="` + item.opportunity.code + `" data-type="0" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                        added = true;
                    }
                }
                else {
                    ele.append(`<option class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code." data-sale-code="` + item.code + `" data-type="0" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                    added = true;
                }
            }
            if (Object.keys(item.opportunity).length !== 0) {
                if (item.opportunity.opportunity_sale_team_datas.length > 0 && added === false) {
                    $.each(item.opportunity.opportunity_sale_team_datas, function (index, member_obj) {
                        if (member_obj.member.id === beneficiary) {
                            if (Object.keys(item.quotation).length !== 0) {
                                quotation_loaded.push(item.quotation.id);
                            }
                            if (item.opportunity.is_close === false) {
                                oppcode_loaded.push(item.opportunity.id);
                                ele.append(`<option class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" data-opp-id="` + item.opportunity.id + `" title="` + item.opportunity.code + `: ` + item.opportunity.title + `" data-sale-code="` + item.opportunity.code + `" data-type="0" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                                added = true;
                                return;
                            }
                        }
                    });
                }
            }
        })
        quotation_list.map(function (item) {
            let added = false;
            if (item.sale_person.id === beneficiary && quotation_loaded.includes(item.id) === false) {
                if (Object.keys(item.opportunity).length !== 0) {
                    if (item.opportunity.is_close === false) {
                        oppcode_loaded.push(item.opportunity.id);
                        ele.append(`<option class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `" data-sale-code="` + item.opportunity.code + `" data-type="1" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                        added = true;
                    }
                }
                else {
                    ele.append(`<option class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code." data-sale-code="` + item.code + `" data-type="1" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                    added = true;
                }
            }
            if (Object.keys(item.opportunity).length !== 0) {
                if (item.opportunity.opportunity_sale_team_datas.length > 0 && added === false) {
                    $.each(item.opportunity.opportunity_sale_team_datas, function (index, member_obj) {
                        if (member_obj.member.id === beneficiary && item.opportunity.is_close === false) {
                            oppcode_loaded.push(item.opportunity.id);
                            ele.append(`<option class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `" data-sale-code="` + item.opportunity.code + `" data-type="1" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                            added = true;
                            return;
                        }
                    });
                }
            }
        })
        opportunity_list.map(function (item) {
            let added = false;
            if (item.sale_person.id === beneficiary && oppcode_loaded.includes(item.id) === false && item.is_close === false) {
                ele.append(`<option data-sale-code="` + item.code + `" data-type="2" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                added = true;
            }
            if (item.opportunity_sale_team_datas.length > 0 && added === false && item.is_close === false) {
                $.each(item.opportunity_sale_team_datas, function(index, member_obj) {
                    if (member_obj.member.id === beneficiary && oppcode_loaded.includes(item.id) === false) {
                        ele.append(`<option data-sale-code="` + item.code + `" data-type="2" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                        added = true;
                    }
                });
            }
        })

        $('#sale-code-select-box').select2({
            templateResult: function(data) {
                let ele = $('<div class="row col-12"></div>');
                ele.append('<div class="col-5">' + data.id + '</div>');
                ele.append('<div class="col-7">' + data.text + '</div>');
                return ele;
            }
        });
    }

    function loadSaleCodeMulti() {
        $('#notify-none-sale-code').prop('hidden', false);
        $('#tab_plan_datatable').prop('hidden', true);
        let quotation_loaded = [];
        let oppcode_loaded = [];
        let ele = $('#sale-code-select-box');
        ele.prop('multiple', true);
        ele.html('');
        ele.append(`<option></option>`);
        sale_order_list.map(function (item) {
            if (Object.keys(item.quotation).length !== 0) {
                quotation_loaded.push(item.quotation.id);
            }
            if (Object.keys(item.opportunity).length !== 0) {
                if (item.opportunity.is_close === false) {
                    oppcode_loaded.push(item.opportunity.id);
                    ele.append(`<option class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" data-opp-id="` + item.opportunity.id + `" title="` + item.opportunity.code + `: ` + item.opportunity.title + `" data-sale-code="` + item.opportunity.code + `" data-type="0" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                }
            }
            else {
                ele.append(`<option class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code." data-sale-code="` + item.code + `" data-type="0" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
            }
        })
        quotation_list.map(function (item) {
            if (quotation_loaded.includes(item.id) === false) {
                if (Object.keys(item.opportunity).length !== 0) {
                    if (item.opportunity.is_close === false) {
                        oppcode_loaded.push(item.opportunity.id);
                        ele.append(`<option class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="` + item.opportunity.code + `: ` + item.opportunity.title + `" data-sale-code="` + item.opportunity.code + `" data-type="1" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                    }
                }
                else {
                    ele.append(`<option class="dropdown-item" href="#" data-bs-toggle="tooltip" data-bs-placement="right" title="No Opportunity Code." data-sale-code="` + item.code + `" data-type="1" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
                }
            }
        })
        opportunity_list.map(function (item) {
            if (oppcode_loaded.includes(item.id) === false && item.is_close === false) {
                ele.append(`<option data-sale-code="` + item.code + `" data-type="2" data-sale-code-id="` + item.id + `" value="` + item.code + `">` + item.title + `</option>`);
            }
        })

        $('#sale-code-select-box').select2({
            templateResult: function(data) {
                let ele = $('<div class="row col-12"></div>');
                ele.append('<div class="col-5">' + data.id + '</div>');
                ele.append('<div class="col-7">' + data.text + '</div>');
                return ele;
            }
        });
        $('.select2-selection').css({'min-height': '38px'});
    }

    function loadSupplier() {
        let ele = $('#supplier-select-box');
        ele.html('');
        ele.append(`<option></option>`);
        account_list.map(function (item) {
            if (item.account_type.includes('Supplier')) {
                ele.append(`<option data-name="` + item.name + `" data-industry="` + item.industry.title + `" data-owner="` + item.owner.fullname + `" data-code="` + item.code + `" value="` + item.id + `">` + item.name + `</option>`);
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

    function count_row(table_body, sale_code_length, option) {
        let count = 0;
        table_body.find('tr td.number').each(function() {
            count = count + 1;
            $(this).text(count);
            $(this).closest('tr').attr('id', 'row-' + count.toString());
            let detail_product_element = $(this).closest('tr').nextAll().slice(0, sale_code_length)
            detail_product_element.each(function (index, element) {
                $(this).attr('class', 'row-detail-product-' + count.toString());
            });
        });
        if (option === 1) {
            loadProductList('row-' + count.toString());
            loadProductTaxList('row-' + count.toString());
        }
        return count;
    }

    function loadProductList(row_id) {
        let ele = $('#' + row_id + ' .product-select-box');
        ele.select2();
        ele.html('');
        ele.append(`<option></option>`);
        product_list.map(function (item) {
            let tax_code_id = '';
            if (item.sale_information.tax_code) {
                tax_code_id = item.sale_information.tax_code.id;
            }
            let uom_id = '';
            if (item.sale_information.default_uom) {
                uom_id = item.sale_information.default_uom.id;
            }
            ele.append(`<option data-uom-id="` + uom_id + `" data-uom-group-id="` + item.general_information.uom_group.id + `" data-type="` + item.general_information.product_type.title + `" data-tax-id="` + tax_code_id + `" value="` + item.id + `">` + item.title + `</option>`);
        })
    }

    function loadProductTaxList(row_id) {
        let ele = $('#' + row_id + ' .product-tax-select-box');
        ele.html('');
        ele.append(`<option data-rate="0" selected></option>`);
        tax_list.map(function (item) {
            ele.append(`<option data-rate="` + item.rate + `" value="` + item.id + `">` + item.title + ` (` + item.rate + `%)</option>`);
        })
    }

    function loadProductUomList(row_id, uom_id, uom_group_id) {
        let ele = $('#' + row_id + ' .product-uom-select-box');
        ele.html('');
        ele.append(`<option></option>`);
        unit_of_measure.map(function (item) {
            if (item.group.id === uom_group_id) {
                if (uom_id === item.id) {
                    ele.append(`<option selected value="` + item.id + `">` + item.title + `</option>`);
                }
                else {
                    ele.append(`<option value="` + item.id + `">` + item.title + `</option>`);
                }
            }
        })
    }

    function changeUnitPrice(row_id, product_item_id) {
        $('#' + row_id + ' .product-unit-price-select-box').on('change', function () {
            let tr = $(this).closest('tr');
            let input_show = tr.find('.product-unit-price-select-box');
            let quantity = tr.find('.product-quantity');
            let tax = tr.find('.product-tax-select-box option:selected');
            let subtotal_show = tr.find('.product-subtotal-price');
            let subtotal_after_tax_show = tr.find('.product-subtotal-price-after-tax');
            input_show.attr('value', $(this).attr('value'));
            $(`a[data-id="unit-price-a-` + product_item_id + `"]`).attr('data-value', $(this).attr('value'));
            $.fn.initMaskMoney2();
            if ($(this).attr('value') && input_show.attr('value') && quantity.val() && tax.attr('data-rate')) {
                subtotal_show.attr('value', parseFloat(input_show.attr('value')) * parseInt(quantity.val()));
                let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                subtotal_after_tax_show.attr('value',parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
            }
            else {
                input_show.attr('value', '');
                subtotal_show.attr('value', '');
                subtotal_after_tax_show.attr('value', '');
            }
            // calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
        })
        $('#' + row_id + ' .product-quantity').on('change', function () {
            let tr = $(this).closest('tr');
            let input_show = tr.find('.product-unit-price-select-box');
            let tax = tr.find('.product-tax-select-box option:selected');
            let subtotal_show = tr.find('.product-subtotal-price');
            let subtotal_after_tax_show = tr.find('.product-subtotal-price-after-tax');
            $.fn.initMaskMoney2();
            if (input_show.attr('value') && $(this).attr('value') && tax.attr('data-rate')) {
                subtotal_show.attr('value', parseFloat(input_show.attr('value')) * parseInt($(this).val()));
                let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                subtotal_after_tax_show.attr('value', parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
            }
            else {
                input_show.attr('value', '');
                subtotal_show.attr('value', '');
                subtotal_after_tax_show.attr('value', '');
            }
            // calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
        })
        $('#' + row_id + ' .product-tax-select-box').on('change', function () {
            let tr = $(this).closest('tr');
            let tax = $(this).find('option:selected');
            let quantity = tr.find('.product-quantity');
            let subtotal_show = tr.find('.product-subtotal-price');
            let subtotal_after_tax_show = tr.find('.product-subtotal-price-after-tax');
            $.fn.initMaskMoney2();
            if (quantity.val() && tax.attr('data-rate')) {
                let tax_value = parseFloat(tax.attr('data-rate')) / 100;
                subtotal_after_tax_show.attr('value', parseFloat(subtotal_show.attr('value')) + parseFloat(subtotal_show.attr('value')) * parseFloat(tax_value));
            }
            // calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));
        })
    }

    let AP_db = $('#advance_payment_list_datatable');

    function loadAPList(sale_code_id) {
        console.log(sale_code_id)
        $('#advance_payment_list_datatable').DataTable().clear().destroy();
        let AP_db = $('#advance_payment_list_datatable');
        AP_db.DataTableDefault({
            reloadCurrency: true,
            dom: "<'row mt-3 miner-group'<'col-sm-12 col-md-3'f><'col-sm-12 col-md-9'p>>" + "<'row mt-3'<'col-sm-12'tr>>" + "<'row mt-3'<'col-sm-12 col-md-6'i>>",
            visibleDisplayRowTotal: false,
            pageLength: 5,
            paginate: true,
            ajax: {
                url: AP_db.attr('data-url'),
                type: AP_db.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.data['advance_payment_list']) {
                            let all = [];
                            for (let i = 0; i < sale_code_id.length; i++) {
                                // if sale_code_id is so_id
                                let so_filter = sale_order_list.filter(function (item) {
                                    return item.id === sale_code_id[i];
                                });
                                // if sale_code_id is quo_id
                                let quo_filter = quotation_list.filter(function (item) {
                                    return item.id === sale_code_id[i];
                                });
                                // find quotation mapped with this sale_order_id (if sale_order_id is opp_id)
                                let opp_filter = opportunity_list.filter(function (item) {
                                    return item.id === sale_code_id[i];
                                });

                                let sale_order_mapped = null;
                                let quotation_mapped = null;
                                let opportunity_mapped = null;
                                if (opp_filter.length > 0) {
                                    sale_order_mapped = opp_filter[0].sale_order_id;
                                    quotation_mapped = opp_filter[0].quotation_id;
                                    opportunity_mapped = opp_filter[0].id;
                                } else if (quo_filter.length > 0) {
                                    quotation_mapped = quo_filter[0].id;
                                    if (Object.keys(quo_filter[0].opportunity).length !== 0) {
                                        opportunity_mapped = quo_filter[0].opportunity.id;
                                    }
                                } else if (so_filter.length > 0) {
                                    sale_order_mapped = so_filter[0].id;
                                    if (Object.keys(so_filter[0].quotation).length !== 0) {
                                        quotation_mapped = so_filter[0].quotation.id;
                                    }
                                    if (Object.keys(so_filter[0].opportunity).length !== 0) {
                                        opportunity_mapped = so_filter[0].opportunity.id;
                                    }
                                }

                                console.log(sale_order_mapped)
                                console.log(quotation_mapped)
                                console.log(opportunity_mapped)

                                // find ap mapped with this sale_order_mapped
                                let sale_order_mapped_ap = resp.data['advance_payment_list'].filter(function (item) {
                                    if (item.sale_order_mapped) {
                                        return item.sale_order_mapped.id === sale_order_mapped;
                                    }
                                });
                                // find ap mapped with this quotation_mapped
                                let quotation_mapped_ap = resp.data['advance_payment_list'].filter(function (item) {
                                    if (item.quotation_mapped) {
                                        return item.quotation_mapped.id === quotation_mapped;
                                    }
                                });
                                // find ap mapped with this opportunity_mapped
                                let opportunity_mapped_ap = resp.data['advance_payment_list'].filter(function (item) {
                                    if (item.opportunity_mapped) {
                                        return item.opportunity_mapped.id === opportunity_mapped;
                                    }
                                });

                                all = all.concat(sale_order_mapped_ap).concat(quotation_mapped_ap).concat(opportunity_mapped_ap)
                            }
                            return all
                        }
                        else {
                            return [];
                        }
                    }
                    return [];
                },
            },
            columns: [
                {
                    render: (data, type, row, meta) => {
                        if (row.remain_value <= 0) {
                            return `<input data-id="` + row.id + `" class="ap-selected" type="checkbox" disabled>`
                        }
                        else {
                            return `<input data-id="` + row.id + `" class="ap-selected" type="checkbox">`
                        }
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-outline badge-soft-danger">` + row.code + `</span>`;
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.title + `</span>`;
                    }
                },
                {
                    data: 'to_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.to_payment + `"></span>`
                    }
                },
                {
                    data: 'return_value',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.return_value + `"></span>`
                    }
                },
                {
                    data: 'remain_value',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.remain_value + `"></span>`
                    }
                },
            ],
        });
    }

    function loadAPOnly(sale_code_id) {
        $('#advance_payment_list_datatable').DataTable().clear().destroy();
        let AP_db = $('#advance_payment_list_datatable');
        AP_db.DataTableDefault({
            reloadCurrency: true,
            dom: "<'row mt-3 miner-group'<'col-sm-12 col-md-3'f><'col-sm-12 col-md-9'p>>" + "<'row mt-3'<'col-sm-12'tr>>" + "<'row mt-3'<'col-sm-12 col-md-6'i>>",
            visibleDisplayRowTotal: false,
            pageLength: 5,
            paginate: true,
            ajax: {
                url: AP_db.attr('data-url'),
                type: AP_db.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.data['advance_payment_list']) {
                            // find ap mapped with this sale_order_mapped
                            let sale_order_mapped_ap = resp.data['advance_payment_list'].filter(function(item) {
                                if (item.sale_order_mapped) {
                                    return item.sale_order_mapped.id === sale_code_id;
                                }
                            });
                            // find ap mapped with this quotation_mapped
                            let quotation_mapped_ap = resp.data['advance_payment_list'].filter(function(item) {
                                if (item.quotation_mapped) {
                                    return item.quotation_mapped.id === sale_code_id;
                                }
                            });
                            // find ap mapped with this opportunity_mapped
                            let opportunity_mapped_ap = resp.data['advance_payment_list'].filter(function(item) {
                                if (item.opportunity_mapped) {
                                    return item.opportunity_mapped.id === sale_code_id;
                                }
                            });

                            // console.log(sale_order_mapped_ap.concat(quotation_mapped_ap).concat(opportunity_mapped_ap))
                            return sale_order_mapped_ap.concat(quotation_mapped_ap).concat(opportunity_mapped_ap)
                        }
                        else {
                            return [];
                        }
                    }
                    return [];
                },
            },
            columns: [
                {
                    render: (data, type, row, meta) => {
                        if (row.remain_value <= 0) {
                            return `<input data-id="` + row.id + `" class="ap-selected" type="checkbox" disabled>`
                        }
                        else {
                            return `<input data-id="` + row.id + `" class="ap-selected" type="checkbox">`
                        }
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="badge badge-outline badge-soft-danger">` + row.code + `</span>`;
                    }
                },
                {
                    data: 'title',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.title + `</span>`;
                    }
                },
                {
                    data: 'to_payment',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.to_payment + `"></span>`
                    }
                },
                {
                    data: 'return_value',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.return_value + `"></span>`
                    }
                },
                {
                    data: 'remain_value',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="text-primary mask-money" data-init-money="` + row.remain_value + `"></span>`
                    }
                },
            ],
        });
    }

    function calculate_sum_ap_product_items() {
        let result_total_value = 0;
        $('.product-tables').find('.total-converted-value').each(function (index, element) {
            result_total_value += parseFloat($(this).attr('data-init-money'));
        })
        return result_total_value;
    }

    function get_ap_product_items() {
        let ap_product_items = [];
        $('.product-tables').find('.product-selected').each(function (index, element) {
            if ($(this).is(':checked')) {
                let value = parseFloat($(this).closest('tr').find('.converted-value-inp').attr('value'));
                if ($(this).attr('data-id') && value > 0) {
                    ap_product_items.push({'id': $(this).attr('data-id'), 'value': value});
                }
            }
        })
        return ap_product_items;
    }

    loadCreator();
    $('#beneficiary-select-box').select2();
    loadSupplier();

    $('#created_date_id').dateRangePickerDefault({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        minYear: 1901,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'),10)
    });

    $('#supplier-select-box').on('change', function () {
        if ($(this).find('option:selected').attr('value')) {
            LoadBankAccount();
            $('#supplier-detail-span').prop('hidden', false);
            $('#supplier-name').text($('#supplier-select-box option:selected').attr('data-name'));
            $('#supplier-code').text($('#supplier-select-box option:selected').attr('data-code'));
            $('#supplier-owner').text($('#supplier-select-box option:selected').attr('data-owner'));
            $('#supplier-industry').text($('#supplier-select-box option:selected').attr('data-industry'));
            let url = $('#btn-detail-supplier-tab').attr('data-url').replace('0', $('#supplier-select-box option:selected').attr('value'));
            $('#btn-detail-supplier-tab').attr('href', url);
        }
        else {
            $('#supplier-detail-span').prop('hidden', true);
            $('#btn-detail-supplier-tab').attr('href', '#');
            $('#list-bank-account-information').html(`<div class="row">
                <div class="col-12">
                    <div id="notify-none-bank-account" class="alert alert-secondary" role="alert">
                        <span class="alert-icon-wrap"></span>
                        &nbsp;No bank accounts information!
                    </div>
                </div>
            </div>`)
        }
    })

    $('#beneficiary-select-box').on('change', function () {
        if (sale_code_default_type !== -1) {
            $('#beneficiary-detail-span').prop('hidden', false);
            $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
            $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
            $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
        }
        else {
            $('#tab_line_detail_datatable tbody').html(``);
            loadSaleCode($(this).val());
            $('#sale-code-select-box').find('option:selected').prop('selected', false);
            $('#beneficiary-detail-span').prop('hidden', false);
            $('#beneficiary-name').text($('#beneficiary-select-box option:selected').attr('data-name'));
            $('#beneficiary-code').text($('#beneficiary-select-box option:selected').attr('data-code'));
            $('#beneficiary-department').text($('#beneficiary-select-box option:selected').attr('data-department'));
            let url = $('#btn-detail-beneficiary-tab').attr('data-url').replace('0', $('#beneficiary-select-box option:selected').attr('value'));
            $('#btn-detail-beneficiary-tab').attr('href', url);
            if ($('#radio-non-sale').is(':checked')) {
                $('#sale-code-select-box').prop('disabled', false);
            }
        }
    })

    $('.sale_code_type').on('change', function (event) {
        $('#tab_line_detail_datatable tbody').html(``);
        $('#tab_plan_datatable tbody').html(``);
        $('#btn-change-sale-code-type').text($('input[name="sale_code_type"]:checked').val())
        if ($(this).val() === 'sale') {
            $('#beneficiary-select-box').prop('disabled', false);
            $('#sale-code-select-box').prop('disabled', false);
            loadSaleCode($('#data-init-payment-create-request-employee-id').val());
        }
        else if ($(this).val() === 'non-sale') {
            $('#beneficiary-select-box').prop('disabled', false);
            $('#sale-code-select-box').prop('disabled', true);
            $('#sale-code-select-box').val('');
        }
        else if ($(this).val() === 'MULTI') {
            loadSaleCodeMulti();
            $('#beneficiary-select-box').prop('disabled', true);
            loadBeneficiary($('#creator-select-box option:selected').attr('data-department-id'), $('#data-init-payment-create-request-employee-id').val());
            $('#sale-code-select-box').prop('disabled', false);
        }
    })

    $('#sale-code-select-box').on('change', function () {
        $('#tab_line_detail_datatable tbody').html(``);
        $('#tab_plan_datatable tbody').html(``);
        if ($('input[name="sale_code_type"]:checked').val() === 'sale') {
            if ($('#sale-code-select-box option:selected').attr('data-type') === '0') {
                // get ap product items
                let so_id = $('#sale-code-select-box option:selected').attr('data-sale-code-id');
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

                advance_payment_product_items = [];
                for (let i = 0; i < ap_list.length; i++) {
                    if (ap_list[i].sale_order_mapped) {
                        if (ap_list[i].sale_order_mapped.id === so_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    if (ap_list[i].quotation_mapped) {
                        if (ap_list[i].quotation_mapped.id === quo_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    if (ap_list[i].opportunity_mapped) {
                        if (ap_list[i].opportunity_mapped.id === opp_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                }
                // console.log(0, advance_payment_product_items)

                // get payment items
                payment_cost_items_filtered = [];
                for (let i = 0; i < payment_cost_items_list.length; i++) {
                    let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                    if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                        payment_cost_items_filtered.push(payment_cost_items_list[i]);
                    }
                }
                loadSaleOrderPlan($('#sale-code-select-box option:selected').attr('data-sale-code-id'), $('#sale-code-select-box option:selected').attr('data-sale-code'));
                $('#notify-none-sale-code').prop('hidden', true);
                $('#tab_plan_datatable').prop('hidden', false);
                // console.log(1, payment_cost_items_filtered)
            }
            else if ($('#sale-code-select-box option:selected').attr('data-type') === '1') {
                // get ap product items
                let quo_id = $('#sale-code-select-box option:selected').attr('data-sale-code-id');
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

                advance_payment_product_items = [];
                for (let i = 0; i < ap_list.length; i++) {
                    if (ap_list[i].sale_order_mapped) {
                        if (ap_list[i].sale_order_mapped.id === so_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    if (ap_list[i].quotation_mapped) {
                        if (ap_list[i].quotation_mapped.id === quo_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                    if (ap_list[i].opportunity_mapped) {
                        if (ap_list[i].opportunity_mapped.id === opp_mapped_id) {
                            advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                        }
                    }
                }
                // console.log(advance_payment_product_items)

                // get payment items
                payment_cost_items_filtered = [];
                for (let i = 0; i < payment_cost_items_list.length; i++) {
                    let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                    if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                        payment_cost_items_filtered.push(payment_cost_items_list[i]);
                    }
                }
                loadQuotationPlan($('#sale-code-select-box option:selected').attr('data-sale-code-id'), $('#sale-code-select-box option:selected').attr('data-sale-code'));
                $('#notify-none-sale-code').prop('hidden', true);
                $('#tab_plan_datatable').prop('hidden', false);
            }
            else if ($('#sale-code-select-box option:selected').attr('data-type') === '2') {
                $('#sale-code-select-box').attr('data-placeholder', 'Select One');
                $('#notify-none-sale-code').prop('hidden', false);
                $('#tab_plan_datatable').prop('hidden', true);
            }
        }
        else if ($('input[name="sale_code_type"]:checked').val() === 'MULTI') {
            $('#notify-none-sale-code').prop('hidden', true);
            $('#tab_plan_datatable').prop('hidden', false);
            $('#sale-code-select-box option:selected').each(function (index, element) {
                if ($(this).attr('data-type') !== '2') {
                    $('#tab_plan_datatable tbody').append(`<tr>
                        <td colspan="1" data-type="` + $(this).attr('data-type') + `" data-sale-code-id="` + $(this).attr('data-sale-code-id') + `" data-sale-code="` + $(this).attr('data-sale-code') + `">
                        <span class="badge badge-primary w-100">` + $(this).attr('data-sale-code') + `</span>
                        <a class="btn-load-detail-multi" data-detail-view="hide" href="#"><i class="bi bi-caret-down-square"></i></a>
                        </td>
                        <td colspan="7"></td>
                    </tr>`)
                }
            })

            $('.btn-load-detail-multi').on('click', function () {
                if ($(this).attr('data-detail-view') === 'hide') {
                    $(this).attr('data-detail-view', 'show');
                    if ($(this).closest('td').attr('data-type') === '0') {
                        // get ap product items
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

                        advance_payment_product_items = [];
                        for (let i = 0; i < ap_list.length; i++) {
                            if (ap_list[i].sale_order_mapped) {
                                if (ap_list[i].sale_order_mapped.id === so_mapped_id) {
                                    advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                                }
                            }
                            if (ap_list[i].quotation_mapped) {
                                if (ap_list[i].quotation_mapped.id === quo_mapped_id) {
                                    advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                                }
                            }
                            if (ap_list[i].opportunity_mapped) {
                                if (ap_list[i].opportunity_mapped.id === opp_mapped_id) {
                                    advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                                }
                            }
                        }
                        // console.log(0, advance_payment_product_items)

                        // get payment items
                        payment_cost_items_filtered = [];
                        for (let i = 0; i < payment_cost_items_list.length; i++) {
                            let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                            if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                                payment_cost_items_filtered.push(payment_cost_items_list[i]);
                            }
                        }
                        loadSaleOrderPlanMULTI($(this).closest('td').attr('data-sale-code-id'));
                        $('#notify-none-sale-code').prop('hidden', true);
                        $('#tab_plan_datatable').prop('hidden', false);
                        // console.log(1, payment_cost_items_filtered)
                    }
                    else if ($(this).closest('td').attr('data-type') === '1') {
                        // get ap product items
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

                        advance_payment_product_items = [];
                        for (let i = 0; i < ap_list.length; i++) {
                            if (ap_list[i].sale_order_mapped) {
                                if (ap_list[i].sale_order_mapped.id === so_mapped_id) {
                                    advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                                }
                            }
                            if (ap_list[i].quotation_mapped) {
                                if (ap_list[i].quotation_mapped.id === quo_mapped_id) {
                                    advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                                }
                            }
                            if (ap_list[i].opportunity_mapped) {
                                if (ap_list[i].opportunity_mapped.id === opp_mapped_id) {
                                    advance_payment_product_items = advance_payment_product_items.concat(ap_list[i].product_items)
                                }
                            }
                        }
                        // console.log(advance_payment_product_items)

                        // get payment items
                        payment_cost_items_filtered = [];
                        for (let i = 0; i < payment_cost_items_list.length; i++) {
                            let sale_code_mapped = payment_cost_items_list[i].sale_code_mapped;
                            if (sale_code_mapped === so_mapped_id || sale_code_mapped === quo_mapped_id || sale_code_mapped === opp_mapped_id) {
                                payment_cost_items_filtered.push(payment_cost_items_list[i]);
                            }
                        }
                        loadQuotationPlanMULTI($(this).closest('td').attr('data-sale-code-id'));
                        $('#notify-none-sale-code').prop('hidden', true);
                        $('#tab_plan_datatable').prop('hidden', false);
                    }
                }
                else if ($(this).attr('data-detail-view') === 'show') {
                    $(this).attr('data-detail-view', 'hide');
                    $(`#tab_plan_datatable tbody tr[class="detail-line-for-` + $(this).closest('td').attr('data-sale-code-id') + `"`).remove();
                }
            })
        }
    })

    $('#save-changes-modal-bank-account').on('click', function () {
        ChangeBankInfor();
        LoadBankAccount();
        $('#btn-close-edit-bank-account').click();
    })

    $(document).on("click", '#btn-add-row-line-detail', function () {
        let sale_code_length = 0;
        let opp_code_list = [];
        let sale_code_id_clicked = [];
        if ($('#radio-non-sale').is(':checked') || $('#radio-sale').is(':checked')) {
            if ($('#sale-code-select-box').val()) {
                sale_code_length = 1;
                opp_code_list.push($('#sale-code-select-box option:selected').attr('data-sale-code'));
                sale_code_id_clicked.push($('#sale-code-select-box option:selected').attr('data-sale-code-id'));
            }
        }
        if ($('#radio-special').is(':checked')) {
            sale_code_length = $('#sale-code-select-box option:selected').length;
            $('#sale-code-select-box option:selected').each(function() {
                opp_code_list.push($(this).attr('data-sale-code'));
                sale_code_id_clicked.push($(this).attr('data-sale-code-id'));
            });
        }

        if (sale_code_length > 0) {
            let table_body = $('#tab_line_detail_datatable tbody');
            table_body.append(`<tr id="" class="row-number">
                <td class="number text-center"></td>
                <td><select class="form-select product-select-box" data-method="GET"><option selected></option></select></td>
                <td><input class="form-control product-type" style="color: black; background: none" disabled></td>
                <td><select class="form-select product-uom-select-box" data-method="GET"><option selected></option></select></td>
                <td><input type="number" min="1" class="form-control product-quantity" value="1"></td>
                <td><input data-return-type="number" type="text" class="form-control product-unit-price-select-box mask-money"></td>
                <td><select class="form-select product-tax-select-box" data-method="GET"><option selected></option></select></td>
                <td><input type="text" data-return-type="number" class="form-control product-subtotal-price mask-money" style="color: black; background: none" disabled></td>
                <td><input type="text" data-return-type="number" class="form-control product-subtotal-price-after-tax mask-money" style="color: black; background: none" disabled></td>
                <td><input type="text" class="form-control product-document-number" required></td>
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
                table_body.append(`<tr class="" hidden>
                    <td colspan="1"></td>
                    <td colspan="1">
                        <span class="sale_code_product_detail badge badge-outline badge-soft-primary" data-sale-code-id="` + sale_code_id_clicked[i] + `"><b>` + opp_code_list[i] + `</b></span>
                    </td>
                    <td colspan="2">
                        <input data-return-type="number" placeholder="Enter payment value" class="value-inp form-control mask-money ">
                    </td>
                    <td colspan="1">
                        <center><i class="fas fa-plus text-primary"></i></center>
                    </td>
                    <td colspan="2">
                        <div class="input-group">
                            <input data-return-type="number" placeholder="Click button to select payment value" class="value-converted-from-ap-inp form-control mask-money" disabled style="background-color: white; color: black">
                            <button style="border: 1px solid #ced4da" data-bs-toggle="offcanvas" 
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
                        <span class="mask-money total-value-salecode-item text-primary" data-init-money="0"></span>
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

            let row_count = count_row(table_body, sale_code_length+1, 1);

            $('#row-' + row_count.toString()).find('.btn-del-line-detail').on('click', function () {
                for (let i = 0; i <= sale_code_length; i++) {
                    $(this).closest('tr').next('tr').remove();
                }
                $(this).closest('tr').remove();
                count_row(table_body, sale_code_length, 2);
            })

            $('#row-' + row_count.toString()).find(".row-toggle").on('click', function() {
                let this_row = $('#row-' + row_count.toString());
                let this_product_item = this_row.find('.product-select-box');
                let this_type = this_row.find('.product-type');
                let this_uom = this_row.find('.product-uom-select-box');
                let this_quantity = this_row.find('.product-quantity');
                let this_unit_price = this_row.find('.product-unit-price-select-box');
                let this_subtotal_price = this_row.find('.product-subtotal-price');
                let this_after_tax_subtotal = this_row.find('.product-subtotal-price-after-tax');
                let this_document_number = this_row.find('.product-document-number');

                if (this_product_item.val() && this_type.val() && this_uom.val() && this_quantity.val() && this_unit_price.attr('value')
                    && this_subtotal_price.attr('value') && this_after_tax_subtotal.attr('value') && this_document_number.val())
                {
                    let row_number = this_row.attr('id').split('-')[1];
                    let detail_product_id = '.row-detail-product-' + row_number;
                    if ($(detail_product_id).is(":hidden")) {
                        $(detail_product_id).prop('hidden', false);
                    }
                    else {
                        $(detail_product_id).prop('hidden', true);
                    }
                }
            });

            $('.row-detail-product-' + row_count.toString()).find(".btn-add-payment-value").on('click', function() {
                $('.total-converted').attr('hidden', true);
                $("#tab-1-offCanvas").attr('style', "font-size: xx-large; font-weight: bolder");
                $("#tab-2-offCanvas").attr('style', "font-size: large; font-weight: bolder");
                current_value_converted_from_ap = $(this);
                $('.total-product-selected').attr('data-init-money', 0);
                $.fn.initMaskMoney2();
                $('.product-tables').html(``);
                $('#wizard-t-0').click();
                if (sale_code_default_type === -1) {
                    loadAPList(sale_code_id_clicked);
                }
                else {
                    loadAPOnly(sale_code_mapped_parameter);
                }
            });

            $('#row-' + row_count + ' .product-select-box').on('change', function () {
                let parent_tr = $(this).closest('tr');
                parent_tr.find('.product-type').val($(this).find('option:selected').attr('data-type'));
                parent_tr.find('.product-tax-select-box').val($(this).find('option:selected').attr('data-tax-id'));

                $('#' + parent_tr.attr('id') + ' .product-unit-price-select-box').attr('value', '');
                $('#' + parent_tr.attr('id') + ' .product-quantity').val(1);
                $('#' + parent_tr.attr('id') + ' .product-subtotal-price').attr('value', '');
                $('#' + parent_tr.attr('id') + ' .product-subtotal-price-after-tax').attr('value', '');
                // calculate_price($('#tab_line_detail tbody'), $('#pretax-value'), $('#taxes-value'), $('#total-value'));

                if ($(this).find('option:selected').val() !== '') {
                    loadProductUomList(parent_tr.attr('id'), $(this).find('option:selected').attr('data-uom-id'), $(this).find('option:selected').attr('data-uom-group-id'));
                    changeUnitPrice(parent_tr.attr('id'), $(this).find('option:selected').val());
                }
                else {
                    $('#' + parent_tr.attr('id') + ' .product-uom-select-box').empty();
                    $('#' + parent_tr.attr('id') + ' .dropdown-menu').html('');
                }
            })

            $.fn.initMaskMoney2();
        }
        else {
            $.fn.notifyB({description: "Warning: You have not selected Sale Code yet!"}, 'warning');
        }
    });

    $("#wizard").steps({
        transitionEffect: 'slide',
    });

    $('#wizard-t-0').attr('hidden', true);
    $('#wizard-t-1').attr('hidden', true);
    $('#wizard-t-0').closest('li').append(`<span id="tab-1-offCanvas" class="text-primary mr-3" style="font-size: xx-large; font-weight: bolder">1. Select Advance Payment</span>`);
    $('#wizard-t-1').closest('li').append(`<span id="tab-2-offCanvas" class="text-primary ml-3" style="font-size: larger; font-weight: bolder">2. Select Product</span>`);

    $('.content').css({
        'background': 'none'
    })

    $('.content').addClass('h-70');
    $('#wizard-p-0').addClass('w-100');
    $('#advance_payment_list_datatable_wrapper').addClass('h-80');

    $('.actions').find('a[href="#next"]').on('click', function () {
        $('.total-converted').attr('hidden', false);
        $("#tab-2-offCanvas").attr('style', "font-size: xx-large; font-weight: bolder");
        $("#tab-1-offCanvas").attr('style', "font-size: large; font-weight: bolder");
        let selected_ap_list = [];
        let selected_ap_code_list = [];
        $('.ap-selected').each(function (index, element) {
            if ($(this).is(':checked') === true) {
                selected_ap_list.push($(this).attr('data-id'));
                selected_ap_code_list.push($(this).closest('td').next('td').text());
            }
        })
        if (selected_ap_list.length === 0) {
            setTimeout(function(){
            $('.alert.alert-dismissible .close').addClass('btn-close').removeClass('close');
            },100);
            $.notify("Warning: Select at least 1 Advance Payment Item for next step.", {
                animate: {
                    enter: 'animated bounceInDown',
                    exit: 'animated bounceOutUp'
                },
                type: "dismissible alert-warning",
            });
        }
        else {
            let tab2 = $('.product-tables');
            tab2.html(``);
            for (let i = 0; i < selected_ap_list.length; i++) {
                $.fn.callAjax(AP_db.attr('data-url-ap-detail').replace('/0', '/' + selected_ap_list[i]), AP_db.attr('data-method')).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('advance_payment_detail')) {
                            let ap_item_detail = data.advance_payment_detail;
                            if (ap_item_detail.product_items.length > 0) {
                                tab2.append(`<div class="mt-7 mb-3 row">
                                    <div class="col-2 mt-2"><span class="ap-code-span badge badge-primary">` + selected_ap_code_list[i] + `</span></div>
                                </div>`)
                                tab2.append(`<table id="product-item-table-` + ap_item_detail.id + `" class="table nowrap w-100">
                                    <thead>
                                        <tr>
                                            <th class="w-5"></th>
                                            <th class="w-10">Product Items</th>
                                            <th class="w-10">Type</th>
                                            <th class="w-5">Quantity</th>
                                            <th class="w-15">Unit Price</th>
                                            <th class="w-10">Tax</th>
                                            <th class="w-15">Remain</th>
                                            <th class="w-15">Converted Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>`);
                                let product_table = $('#product-item-table-' + ap_item_detail.id)
                                let total_remain_value = 0;
                                for (let i = 0; i < ap_item_detail.product_items.length; i++) {
                                    let product_item = ap_item_detail.product_items[i];
                                    let tax_code = '';
                                    if (product_item.tax) {
                                        tax_code = product_item.tax.code
                                    }
                                    let disabled = 'disabled';
                                    if (product_item.remain_total > 0) {
                                        disabled = '';
                                    }
                                    total_remain_value += product_item.remain_total;
                                    product_table.append(`<tr>
                                        <td><input data-id="` + product_item.id + `" class="product-selected" type="checkbox" ` + disabled + `></td>
                                        <td>` + product_item.product.title + `</td>
                                        <td>` + product_item.product.type.title + `</td>
                                        <td class="text-center">` + product_item.product_quantity + `</td>
                                        <td><span class="text-primary mask-money" data-init-money="` + product_item.unit_price + `"></span></td>
                                        <td><span class="badge badge-soft-danger">` + tax_code + `</span></td>
                                        <td><span class="text-primary mask-money product-remain-value" data-init-money="` + product_item.remain_total + `"></span></td>
                                        <td><input class="mask-money form-control converted-value-inp" disabled></td>
                                    </tr>`)
                                }
                                product_table.append(`<tr style="background-color: #ebf5f5">
                                    <td></td><td></td><td></td><td></td><td></td>
                                    <td><span style="text-align: left"><b>Total:</b></span></td>
                                    <td><span class="mask-money total-available-value text-primary" data-init-money="` + total_remain_value + `"></span></td>
                                    <td><span class="mask-money total-converted-value text-primary" data-init-money="0"></span></td>
                                </tr>`)

                                $('.converted-value-inp').on('change', function () {
                                    let product_remain_value = $(this).closest('tr').find('.product-remain-value').attr('data-init-money');
                                    let converted_value = $(this).attr('value');
                                    if (parseFloat(converted_value) > parseFloat(product_remain_value)) {
                                        $(this).attr('value', parseFloat(product_remain_value));
                                    }

                                    let new_total_converted_value = 0;
                                    $(this).closest('tbody').find('.converted-value-inp').each(function (index, element) {
                                        if (parseFloat($(this).attr('value'))) {
                                            new_total_converted_value += parseFloat($(this).attr('value'));
                                        }
                                    });
                                    $(this).closest('tbody').find('.total-converted-value').attr('data-init-money', new_total_converted_value);

                                    $('.total-product-selected').attr('data-init-money', calculate_sum_ap_product_items());

                                    $.fn.initMaskMoney2();
                                });

                                $('.product-selected').on('change', function () {
                                    if ($(this).is(':checked')) {
                                        $(this).closest('tr').find('.converted-value-inp').prop('disabled', false);
                                    }
                                    else {
                                        $(this).closest('tr').find('.converted-value-inp').prop('disabled', true);
                                        $(this).closest('tr').find('.converted-value-inp').attr('value', '');
                                    }

                                    let new_total_converted_value = 0;
                                    $(this).closest('tbody').find('.converted-value-inp').each(function (index, element) {
                                        if (parseFloat($(this).attr('value'))) {
                                            new_total_converted_value += parseFloat($(this).attr('value'));
                                        }
                                    });
                                    $(this).closest('tbody').find('.total-converted-value').attr('data-init-money', new_total_converted_value);

                                    $('.total-product-selected').attr('data-init-money', calculate_sum_ap_product_items());

                                    $.fn.initMaskMoney2();
                                });

                                $.fn.initMaskMoney2();
                            }
                        }
                    }
                });
            }
        }
    })

    $('.actions').find('a[href="#previous"]').on('click', function () {
        $('.total-converted').attr('hidden', true);
        $("#tab-1-offCanvas").attr('style', "font-size: xx-large; font-weight: bolder");
        $("#tab-2-offCanvas").attr('style', "font-size: large; font-weight: bolder");
    })

    $('.actions').find('a[href="#finish"]').on('click', function () {
        $('.total-converted').attr('hidden', true);
        let result_total_value = calculate_sum_ap_product_items();
        current_value_converted_from_ap.closest('div').find('.value-converted-from-ap-inp').attr('value', result_total_value);

        let value_input_ap = parseFloat(current_value_converted_from_ap.closest('tr').find('.value-inp').attr('value'));
        if (isNaN(value_input_ap)) {
            value_input_ap = 0;
        }
        current_value_converted_from_ap.closest('tr').find('.total-value-salecode-item').attr('data-init-money', result_total_value + value_input_ap);
        current_value_converted_from_ap.closest('tr').find('.detail-ap-items').text(JSON.stringify(get_ap_product_items()));

        $.fn.initMaskMoney2();
        $('#offcanvasSelectDetailAP').offcanvas('hide');
    })

    $('.actions').find('ul').prepend(`<li aria-disabled="false" class="total-converted" hidden>
            <label class="col-form-label text-primary text-decoration-underline"><b>TOTAL</b></label>
        </li>
        <li aria-disabled="false" class="total-converted" hidden>
            <div class="row form-group">
                <div class="col-12 text-left">
                    <span style="font-size: x-large" class="mask-money total-product-selected text-primary" data-init-money="0"></span>
                </div>
            </div>
        </li>`)

    $('#wizard-p-1').addClass('w-100');

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

    $('#form-create-payment').submit(function (event) {
        let can_submit = 1;
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));

        let product_valid_list = [];
        if ($('#tab_line_detail tbody').find('tr').length > 0) {
            let table_body = $('#tab_line_detail tbody');
            let row_count = table_body.find('.row-number').length;
            for (let i = 1; i <= row_count; i++) {
                let product_detail_value = 0;

                let row_id = '#row-' + i.toString();
                let document_number = table_body.find(row_id + ' .product-document-number').val();
                let product_selected = table_body.find(row_id + ' .product-select-box option:selected');
                let uom_selected = table_body.find(row_id + ' .product-uom-select-box option:selected');
                let subtotal_price_value = parseFloat(table_body.find(row_id + ' .product-subtotal-price').attr('value'));
                let price_after_tax_value = parseFloat(table_body.find(row_id + ' .product-subtotal-price-after-tax').attr('value'));
                let tax_value = parseFloat(table_body.find(row_id + ' .product-tax-select-box option:selected').attr('data-rate')) / 100 * subtotal_price_value;
                let unit_price_value = parseFloat(table_body.find(row_id + ' .product-unit-price-select-box').attr('value'));

                let product_ap_detail_list = [];
                let sale_code_len = 1;
                if (frm.dataForm['sale_code_type'] === 'MULTI') {
                    sale_code_len = $('#sale-code-select-box option:selected').length;
                }
                let sale_code_item = table_body.find(row_id).nextAll().slice(1, sale_code_len + 1);
                sale_code_item.each(function() {
                    let converted_value_detail = [{'id': null, 'value': 0}];
                    if ($(this).find('.detail-ap-items').html()) {
                        converted_value_detail = JSON.parse($(this).find('.detail-ap-items').html());
                    }
                    let real_value = 0;
                    if ($(this).find('.value-inp').attr('value')) {
                        real_value = $(this).find('.value-inp').attr('value');
                    }
                    let converted_value = $(this).find('.value-converted-from-ap-inp').attr('value');
                    if (converted_value_detail.length <= 0) {
                        converted_value = 0;
                    }
                    let sum_value = 0;
                    if ($(this).find('.total-value-salecode-item').attr('data-init-money')) {
                        sum_value = $(this).find('.total-value-salecode-item').attr('data-init-money');
                    }
                    product_ap_detail_list.push({
                        'sale_code_mapped': $(this).find('.sale_code_product_detail').attr('data-sale-code-id'),
                        'real_value': real_value,
                        'converted_value': converted_value,
                        'sum_value':  sum_value,
                        'converted_value_detail': converted_value_detail
                    })

                    product_detail_value = parseFloat(product_detail_value) + parseFloat(sum_value);
                });
                if (!isNaN(subtotal_price_value) && !isNaN(price_after_tax_value) && !isNaN(tax_value)) {
                    product_valid_list.push({
                        'product_id': product_selected.attr('value'),
                        'unit_of_measure_id': uom_selected.attr('value'),
                        'quantity': table_body.find(row_id + ' .product-quantity').val(),
                        'tax_id': table_body.find(row_id + ' .product-tax-select-box option:selected').attr('value'),
                        'unit_price': unit_price_value,
                        'tax_price': tax_value,
                        'subtotal_price': subtotal_price_value,
                        'after_tax_price': price_after_tax_value,
                        'document_number': document_number,
                        'product_ap_detail_list': product_ap_detail_list
                    })
                }

                if (price_after_tax_value !== product_detail_value) {
                    can_submit = 0;
                    $.fn.notifyB({description: 'Detail tab - line ' + i.toString() + ': product value must be equal to sum Sale Code value.'}, 'failure');
                }
            }
        }

        frm.dataForm['product_valid_list'] = product_valid_list;

        if ($('input[name="sale_code_type"]:checked').val() === 'non-sale') {
            frm.dataForm['sale_code_type'] = 2;
        }
        else if ($('input[name="sale_code_type"]:checked').val() === 'sale') {
            frm.dataForm['sale_code_type'] = 0;
        }
        else if ($('input[name="sale_code_type"]:checked').val() === 'purchase') {
            frm.dataForm['sale_code_type'] = 1;
        }
        else if ($('input[name="sale_code_type"]:checked').val() === 'MULTI') {
            frm.dataForm['sale_code_type'] = 3;
        }

        if (frm.dataForm['sale_code_type'] === 3) { // multi
            delete frm.dataForm['sale_code']
            let sale_order_selected_list = [];
            let quotation_selected_list = [];
            let opportunity_selected_list = [];
            $('#sale-code-select-box option:selected').each(function (index, element) {
                if ($(this).attr('data-type') === '0') {
                    sale_order_selected_list.push($(this).attr('data-sale-code-id'))
                }
                else if ($(this).attr('data-type') === '1') {
                    quotation_selected_list.push($(this).attr('data-sale-code-id'))
                }
                else if ($(this).attr('data-type') === '2') {
                    opportunity_selected_list.push($(this).attr('data-sale-code-id'))
                }
            })

            frm.dataForm['sale_order_selected_list'] = sale_order_selected_list;
            frm.dataForm['quotation_selected_list'] = quotation_selected_list;
            frm.dataForm['opportunity_selected_list'] = opportunity_selected_list;
        }
        else if (frm.dataForm['sale_code_type'] === 0) {  // sale
            frm.dataForm['sale_code'] = $('#sale-code-select-box option:selected').attr('data-sale-code-id');
            if ($('#sale-code-select-box option:selected').attr('data-type') === '0') {
                frm.dataForm['sale_code_detail'] = 0;
            }
            if ($('#sale-code-select-box option:selected').attr('data-type') === '1') {
                frm.dataForm['sale_code_detail'] = 1;
            }
            if ($('#sale-code-select-box option:selected').attr('data-type') === '2') {
                frm.dataForm['sale_code_detail'] = 2;
            }
        }

        if ($('#creator-select-box').val() !== null) {
            frm.dataForm['creator_name'] = $('#creator-select-box').val();
        }
        else {
            frm.dataForm['creator_name'] = null;
        }

        if ($('#beneficiary-select-box').val() !== null) {
            frm.dataForm['beneficiary'] = $('#beneficiary-select-box').val();
        }
        else {
            frm.dataForm['beneficiary'] = null;
        }

        if (frm.dataForm['method'] === '0') {
            frm.dataForm['method'] = 0;
        }
        else if (frm.dataForm['method'] === '1') {
            frm.dataForm['method'] = 1;
        }
        else {
            frm.dataForm['method'] = 2;
        }

        if (can_submit) {
            WindowControl.showLoading();
            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                    setTimeout(
                        () => {
                            WindowControl.hideLoading();
                        },
                        1000
                    )
                },
                (errs) => {
                    // $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })
})

