$(document).ready(function () {
    function loadAdvancePaymentList() {
        if (!$.fn.DataTable.isDataTable('#datatable_advance_list')) {
            let dtb = $('#datatable_advance_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['advance_payment_list'] ? resp.data['advance_payment_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return `<a href="${link}"><span class="text-primary">${row.code}</span></a> ${$x.fn.buttonLinkBlank(link)}`;
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            let sale_code_code = row.opportunity_mapped.code || row.quotation_mapped.code || row.sale_order_mapped.code || null
                            return `<a href="${link}"><span class="text-primary ap_info" data-sale-code-code="${sale_code_code}" data-id="${row.id}" data-title="${row.title}" data-code="${row.code}"><b>${row.title}</b></span></a>`
                        }
                    },
                    {
                        data: 'advance_payment_type',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let to_employee_trans = dtb.attr('data-type-translate-employee')
                            let to_supplier_trans = dtb.attr('data-type-translate-supplier')
                            if (row.advance_payment_type === 'To Employee') {
                                return `<i class="bi bi-person"></i>&nbsp;${to_employee_trans}`
                            } else if (row.advance_payment_type === 'To Supplier') {
                                return `<i class="bi bi-truck"></i>&nbsp;${to_supplier_trans}`
                            }
                        }
                    },
                    {
                        data: 'sale_code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (Object.keys(row.opportunity_mapped).length !== 0) {
                                return `Opp <span><a class="link-secondary underline_hover" href="${dtb.attr('data-url-opp-detail').replace('0', row.opportunity_mapped.id)}"><b>${row.opportunity_mapped.title}</b></a></span>`
                            }
                            else if (Object.keys(row.quotation_mapped).length !== 0) {
                                return `Quo <span><a class="link-secondary underline_hover" href="${dtb.attr('data-url-opp-detail').replace('0', row.quotation_mapped.id)}"><b>${row.quotation_mapped.title}</b></a></span>`
                            }
                            else if (Object.keys(row.sale_order_mapped).length !== 0) {
                                return `SO <span><a class="link-secondary underline_hover" href="${dtb.attr('data-url-opp-detail').replace('0', row.sale_order_mapped.id)}"><b>${row.sale_order_mapped.title}</b></a></span>`
                            }
                            else {
                                return ''
                            }
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                            });
                        }
                    },
                    {
                        data: 'return_date',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                            });
                        }
                    },
                    {
                        data: 'advance_value',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="${row?.['advance_value']}"></span>`
                        }
                    },
                    {
                        data: 'to_payment',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="${row?.['to_payment']}"></span>`
                        }
                    },
                    {
                        data: 'return_value',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="${row?.['return_value']}"></span>`
                        }
                    },
                    {
                        data: 'remain_value',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="${row?.['remain_value']}"></span>`
                        }
                    },
                    {
                        data: 'ap_status',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            if (row.money_gave) {
                                return `<div>
                                        <span class="badge-status">
                                            <span class="badge badge-primary badge-indicator"></span>
                                            <span class="badge-label">Money gave/transferred</span>
                                        </span>
                                    </div>`
                            }
                            else {
                                return `<div>
                                        <span class="badge-status">
                                            <span class="badge badge-primary badge-indicator"></span>
                                            <span class="badge-label">Waiting</span>
                                        </span>
                                    </div>`
                            }
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let approved_trans = ``
                            let text_color = ``
                            if (row.system_status === 0) {
                                approved_trans = 'Draft'
                                text_color = 'badge-secondary'
                            }
                            else if (row.system_status === 1) {
                                approved_trans = 'Created'
                                text_color = 'badge-primary'
                            }
                            else if (row.system_status === 2) {
                                approved_trans = 'Added'
                                text_color = 'badge-blue'
                            }
                            else if (row.system_status === 3) {
                                approved_trans = 'Finish'
                                text_color = 'badge-success'
                            }
                            else if (row.system_status ===4) {
                                approved_trans = 'Cancel'
                                text_color = 'badge-danger'
                            }
                            return `<span class="badge ${text_color}">` + approved_trans + `</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text text-center',
                        render: (data, type, row) => {
                            if (row.system_status !== 3) {
                                return ``;
                            }
                            else {
                                let sale_code_id = null;
                                let sale_code_title = null;
                                let sale_code_CODE = null;
                                let is_close = false;
                                let flag = null;
                                if (Object.keys(row?.['opportunity_mapped']).length !== 0) {
                                    sale_code_id = row?.['opportunity_mapped'].id;
                                    sale_code_title = row?.['opportunity_mapped'].title;
                                    sale_code_CODE = row?.['opportunity_mapped'].code;
                                    is_close = row?.['opportunity_mapped']['is_close'];
                                    flag = 0;
                                }
                                else if (Object.keys(row?.['quotation_mapped']).length !== 0) {
                                    sale_code_id = row?.['quotation_mapped'].id;
                                    sale_code_title = row?.['quotation_mapped'].title;
                                    sale_code_CODE = row?.['quotation_mapped'].code;
                                    is_close = row?.['quotation_mapped']['is_close'];
                                    flag = 1;
                                }
                                else if (Object.keys(row?.['sale_order_mapped']).length !== 0) {
                                    sale_code_id = row?.['sale_order_mapped'].id;
                                    sale_code_title = row?.['sale_order_mapped'].title;
                                    sale_code_CODE = row?.['sale_order_mapped'].code;
                                    is_close = row?.['sale_order_mapped']['is_close'];
                                    flag = 2;
                                }


                                return `<div class="dropdown ap-shortcut" data-ap-id="${row.id}" data-sale-code-id="${sale_code_id}" data-sale-code-title="${sale_code_title}" data-sale-code-CODE="${sale_code_CODE}" data-flag="${flag}">
                                            <a type="button" data-bs-toggle="dropdown"><i class="fas fa-stream text-primary"></i></a>
                                            <div class="dropdown-menu"></div>
                                        </div>`;
                            }
                        }
                    }
                ],
            });
        }
    }

    loadAdvancePaymentList();
})

$(document).on("click", '.ap-shortcut', function() {
    $(this).find('.dropdown-menu').html('')
    let html_to_payment = '';
    if ($(this).attr('data-sale-code-id') && $(this).attr('data-sale-code-title') && $(this).attr('data-sale-code-CODE') && $(this).attr('data-flag')) {
        let sale_code_mapped_obj = JSON.stringify({'id': $(this).attr('data-sale-code-id'), 'title': $(this).attr('data-sale-code-title'), 'code': $(this).attr('data-sale-code-CODE')});
        if ($(this).attr('data-flag') === '0') {
            let dataInitSaleCode = JSON.parse(sale_code_mapped_obj);
            let list_from_app = 'cashoutflow.payment.create';

            let dataParam = {'list_from_app': list_from_app}
            let opp_list_ajax= $.fn.callAjax2({
                url: $('#script-url').attr('data-url-opp-list'),
                data: dataParam,
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                            return data?.['opportunity_list'];
                        }
                    }
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([opp_list_ajax]).then(
                (results) => {
                    let opp_list = results[0];
                    for (let opp of opp_list) {
                        if (opp?.['id'] === dataInitSaleCode?.['id']) {
                            let sale_code_mapped= encodeURIComponent(sale_code_mapped_obj);
                            let quotation= encodeURIComponent(JSON.stringify(opp?.['quotation']));
                            let sale_order= encodeURIComponent(JSON.stringify(opp?.['sale_order']));
                            let ap_mapped_id= encodeURIComponent(JSON.stringify({'id': $(this).attr('data-ap-id')}));
                            html_to_payment = `<a class="dropdown-item" href="${$('#datatable_advance_list').attr('data-payment')}?ap_mapped_id=${ap_mapped_id}&sale_code_mapped=${sale_code_mapped}&type=${$(this).attr('data-flag')}&quotation_object=${quotation}&sale_order_object=${sale_order}">To Payment</a>`;
                            $(this).find('.dropdown-menu').append(html_to_payment)
                            break;
                        }
                    }
                })
        }
        else if ($(this).attr('data-flag') === '1') {
            let dataInitSaleCode = JSON.parse(sale_code_mapped_obj);

            let quo_list_ajax= $.fn.callAjax2({
                url: $('#script-url').attr('data-url-quo-list'),
                method: 'GET'
            }).then(
                (resp) => {
                    let data= $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('quotation_list') && Array.isArray(data.quotation_list)) {
                            let result = [];
                            for (let i = 0; i < data?.['quotation_list'].length; i++) {
                                if (Object.keys(data?.['quotation_list'][i]?.['opportunity']).length === 0) {
                                    result.push(data?.['quotation_list'][i])
                                }
                            }
                            return result;
                        }
                    }
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([quo_list_ajax]).then(
                (results) => {
                    let quo_list= results[0];
                    for (let quo of quo_list) {
                        if (quo?.['id'] === dataInitSaleCode?.['id']) {
                            let sale_code_mapped= encodeURIComponent(sale_code_mapped_obj);
                            let quotation= encodeURIComponent(JSON.stringify(quo?.['quotation']));
                            let sale_order= encodeURIComponent(JSON.stringify(quo?.['sale_order']));
                            let ap_mapped_id= encodeURIComponent(JSON.stringify({'id': $(this).attr('data-ap-id')}));
                            html_to_payment = `<a class="dropdown-item" href="${$('#datatable_advance_list').attr('data-payment')}?ap_mapped_id=${ap_mapped_id}&sale_code_mapped=${sale_code_mapped}&type=${$(this).attr('data-flag')}&quotation_object=${quotation}&sale_order_object=${sale_order}">To Payment</a>`;
                            $(this).find('.dropdown-menu').append(html_to_payment)
                            break;
                        }
                    }
                })
        }
        else if ($(this).attr('data-flag') === '2') {
            let dataInitSaleCode = JSON.parse(sale_code_mapped_obj);

            let so_list_ajax= $.fn.callAjax2({
                url: $('#script-url').attr('data-url-so-list'),
                method: 'GET'
            }).then(
                (resp) => {
                    let data= $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('sale_order_list') && Array.isArray(data.sale_order_list)) {
                            let result = [];
                            for (let i = 0; i < data?.['sale_order_list'].length; i++) {
                                if (Object.keys(data?.['sale_order_list'][i]?.['opportunity']).length === 0) {
                                    result.push(data?.['sale_order_list'][i])
                                }
                            }
                            return result;
                        }
                    }
                },
                (errs) => {
                    console.log(errs);
                }
            )

            Promise.all([so_list_ajax]).then(
                (results) => {
                    let so_list= results[0];
                    for (let so of so_list) {
                        if (so?.['id'] === dataInitSaleCode?.['id']) {
                            let sale_code_mapped= encodeURIComponent(sale_code_mapped_obj);
                            let quotation= encodeURIComponent(JSON.stringify(so?.['quotation']));
                            let sale_order= encodeURIComponent(JSON.stringify(so?.['sale_order']));
                            let ap_mapped_id= encodeURIComponent(JSON.stringify({'id': $(this).attr('data-ap-id')}));
                            html_to_payment = `<a class="dropdown-item" href="${$('#datatable_advance_list').attr('data-payment')}?ap_mapped_id=${ap_mapped_id}&sale_code_mapped=${sale_code_mapped}&type=${$(this).attr('data-flag')}&quotation_object=${quotation}&sale_order_object=${sale_order}">To Payment</a>`;
                            $(this).find('.dropdown-menu').append(html_to_payment)
                            break;
                        }
                    }
                })
        }
    }

    let opp_mapped = {};
    if ($(this).attr('data-flag') === '0') {
        opp_mapped = JSON.stringify({'id': $(this).attr('data-sale-code-id'), 'title': $(this).attr('data-sale-code-title'), 'code': $(this).attr('data-sale-code-CODE')});
    }
    let opp_obj = encodeURIComponent(opp_mapped);


    let ap_id = $(this).closest('tr').find('.ap_info').attr('data-id');
    let ap_code = $(this).closest('tr').find('.ap_info').attr('data-code');
    let ap_title = $(this).closest('tr').find('.ap_info').attr('data-title');
    let sale_code_code = $(this).closest('tr').find('.ap_info').attr('data-sale-code-code');
    let advance_payment_obj= encodeURIComponent(JSON.stringify({'id': ap_id, 'title': ap_title, 'code': ap_code, 'sale_code_code': sale_code_code}));
    let html_return = `<a class="dropdown-item" href="${$('#datatable_advance_list').attr('data-return')}?advance_payment=${advance_payment_obj}&opportunity=${opp_obj}">Return</a>`;
    $(this).find('.dropdown-menu').append(html_return)
});
