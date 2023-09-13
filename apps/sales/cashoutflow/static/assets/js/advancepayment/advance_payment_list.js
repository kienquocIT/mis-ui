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
                    }, {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="text-secondary">` + row.code + `</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<a class="link-primary underline_hover" target="_blank" href="` + dtb.attr('data-url-detail').replace('0', row.id) + `"><span><b>` + row.title + `</b></span></a>`
                        }
                    },
                    {
                        data: 'advance_payment_type',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let to_employee_trans = dtb.attr('data-type-translate-employee')
                            let to_supplier_trans = dtb.attr('data-type-translate-supplier')
                            if (row.advance_payment_type === 'To Employee') {
                                return `<span class="badge badge-soft-danger">` + to_employee_trans + `</span>`
                            } else if (row.advance_payment_type === 'To Supplier') {
                                return `<span class="badge badge-soft-blue">` + to_supplier_trans + `</span>`
                            }
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span>` + row.date_created.split(' ')[0] + `</span>`
                        }
                    },
                    {
                        data: 'return_date',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span>` + row.return_date.split(' ')[0] + `</span>`
                        }
                    },
                    {
                        data: 'advance_value',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="` + row.advance_value + `"></span>`
                        }
                    },
                    {
                        data: 'to_payment',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="` + row.to_payment + `"></span>`
                        }
                    },
                    {
                        data: 'return_value',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="` + row.return_value + `"></span>`
                        }
                    },
                    {
                        data: 'remain_value',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="mask-money text-primary" data-init-money="` + row.remain_value + `"></span>`
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let approved_trans = dtb.attr('data-type-translate-approved')
                            if (row.money_gave) {
                                return `<span class="text-success">` + approved_trans + `&nbsp;<i class="bi bi-check2-circle"></i></span>`
                            }
                            return `<span class="text-success">` + approved_trans + `</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let sale_code_id = '';
                            let is_close = false;
                            let flag = -1;
                            console.log(row)
                            if (Object.keys(row.sale_order_mapped).length !== 0) {
                                sale_code_id = row.sale_order_mapped.id;
                                is_close = row.sale_order_mapped.is_close;
                                flag = 0;
                            }
                            if (Object.keys(row.quotation_mapped).length !== 0) {
                                sale_code_id = row.quotation_mapped.id;
                                is_close = row.quotation_mapped.is_close;
                                flag = 1;
                            }
                            if (Object.keys(row.opportunity_mapped).length !== 0) {
                                sale_code_id = row.opportunity_mapped.id;
                                is_close = row.opportunity_mapped.is_close;
                                flag = 2;
                            }
                            console.log(sale_code_id)
                            let disabled = ''
                            if (is_close) {
                                disabled = 'disabled';
                            }
                            let return_href = dtb.data('return-advance') + `?advance_payment={0}`.format_by_idx(encodeURIComponent(JSON.stringify({'id': row.id, 'title': row.title})));
                            let to_payment_href = '';
                            let html_to_payment = ''
                            if (sale_code_id !== '') {
                                to_payment_href = dtb.attr('data-payment') + `?sale_code_mapped=${encodeURIComponent(JSON.stringify(sale_code_id))}&type=${flag}`;
                                html_to_payment = `<a class="dropdown-item" href="${to_payment_href}">To Payment</a>`
                            }
                            return `<div class="dropdown">
                                        <a type="button" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></a>
                                        <div class="dropdown-menu">
                                             <a class="dropdown-item ${disabled}" href="${return_href}">Return</a>
                                             ${html_to_payment}
                                        </div>
                                    </div>`;
                        }
                    }
                ],
            });
        }
    }

    loadAdvancePaymentList();
})