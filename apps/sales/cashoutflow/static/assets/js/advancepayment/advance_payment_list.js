$(document).ready(function () {
    function loadAdvanceList() {
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
                        render: (data, type, row, meta) => {
                            return ''
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="badge badge-soft-indigo badge-outline">` + row.code + `</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<a href="#"><span><b>` + row.title + `</b></span></a>`
                        }
                    },
                    {
                        data: 'type',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="badge badge-soft-danger">` + row.type + `</span>`
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
                        data: 'value',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<p class="text-primary">` + row.advance_value.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</p>`
                        }
                    },
                    {
                        data: 'to_payment',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<p class="text-primary">` + row.to_payment.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</p>`
                        }
                    },
                    {
                        data: 'return_value',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<p class="text-primary">` + row.return_value.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</p>`
                        }
                    },
                    {
                        data: 'remain_value',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<p class="text-primary">` + row.remain_value.toLocaleString('en-US').replace(/,/g, '.') + ` VNĐ</p>`
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            if (row.money_gave) {
                                return `<span class="badge badge-soft-success">` + row.status + `&nbsp;<i class="bi bi-check2-circle"></i></span>`
                            }
                            return `<span class="badge badge-soft-success">` + row.status + `</span>`
                        }
                    },
                    {
                        data: '',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<a type="button" class="btn btn-flush-primary btn-change-status" href="#"><i class="bi bi-grid-1x2"></i></a>`
                        }
                    }
                ],
            });
        }
    }

    loadAdvanceList();

    $(document).on('click', '.btn-change-status', function () {
        alert('Waiting "Return Advance" and "Payment"')
    })
})