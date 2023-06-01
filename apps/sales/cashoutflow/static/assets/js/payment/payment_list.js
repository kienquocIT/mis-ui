$(document).ready(function () {
    function loadAdvanceList() {
        if (!$.fn.DataTable.isDataTable('#datatable_payment_list')) {
            let dtb = $('#datatable_payment_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['payment_list'] ? resp.data['payment_list'] : [];
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
                            return `<a href="` + $('#datatable_payment_list').attr('data-url-detail').replace('0', row.id) + `"><span><b>` + row.title + `</b></span></a>`
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
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="text-success">Approved</span>`
                        }
                    }
                ],
            });
        }
    }

    loadAdvanceList();

    $(document).on('click', '.btn-change-status', function () {
        alert('Waiting "Return Advance" and "Payment"');
    })
})