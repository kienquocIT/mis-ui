$(document).ready(function () {
    function loadAdvancePaymentList() {
        if (!$.fn.DataTable.isDataTable('#datatable_advance_list')) {
            let dtb = $('#datatable_advance_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
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
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="text-secondary">` + row.code + `</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<a class="link-primary underline_hover" target="_blank" href="` + $('#datatable_advance_list').attr('data-url-detail').replace('0', row.id) + `"><span><b>` + row.title + `</b></span></a>`
                        }
                    },
                    {
                        data: 'advance_payment_type',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            if (row.advance_payment_type === 'To Employee') {
                                return `<span class="badge badge-soft-danger">` + row.advance_payment_type + `</span>`
                            }
                            else if (row.advance_payment_type === 'To Supplier') {
                                return `<span class="badge badge-soft-blue">` + row.advance_payment_type + `</span>`
                            }
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span>` + row.date_created.split(' ')[0] + `</span>`
                        }
                    },
                    {
                        data: 'return_date',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span>` + row.return_date.split(' ')[0] + `</span>`
                        }
                    },
                    {
                        data: 'advance_value',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="mask-money text-primary" data-init-money="` + row.advance_value + `"></span>`
                        }
                    },
                    {
                        data: 'to_payment',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="mask-money text-primary" data-init-money="` + row.to_payment + `"></span>`
                        }
                    },
                    {
                        data: 'return_value',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="mask-money text-primary" data-init-money="` + row.return_value + `"></span>`
                        }
                    },
                    {
                        data: 'remain_value',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="mask-money text-primary" data-init-money="` + row.remain_value + `"></span>`
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            if (row.money_gave) {
                                return `<span class="text-success">` + row.status + `&nbsp;<i class="bi bi-check2-circle"></i></span>`
                            }
                            return `<span class="text-success">` + row.status + `</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            let sale_code_id = '';
                            if (row.sale_order_mapped) {sale_code_id = row.sale_order_mapped;}
                            if (row.quotation_mapped) {sale_code_id = row.quotation_mapped;}
                            if (row.opportunity_mapped) {sale_code_id = row.opportunity_mapped;}
                            return `<div class="dropdown">
                                        <a type="button" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></a>
                                        <div class="dropdown-menu">
                                             <a class="dropdown-item" href="{0}">Return</a>
                                             <a class="dropdown-item" href="{1}">To Payment</a>
                                        </div>
                                    </div>`.format_by_idx(
                                        $('#datatable_advance_list').data('return-advance') + `?advance_payment_id={0}`.format_by_idx(row.id),
                                $('#datatable_advance_list').attr('data-payment') + `?sale_code_mapped={0}`.format_by_idx(sale_code_id)
                            );
                        }
                    }
                ],
            });
        }
    }

    loadAdvancePaymentList();
})