$(document).ready(function () {
    function loadAdvanceList() {
        if (!$.fn.DataTable.isDataTable('#datatable_payment_list')) {
            let dtb = $('#datatable_payment_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
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
                        'render': (data, type, row, meta) => {
                            return ``;
                        }
                    }, {
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
                            return `<a class="link-primary underline_hover" target="_blank" href="` + $('#datatable_payment_list').attr('data-url-detail').replace('0', row.id) + `"><span><b>` + row.title + `</b></span></a>`
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
                        data: 'payment_value',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span class="mask-money text-primary" data-init-money="` + row.payment_value + `"></span>`
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            let approved_trans = $('#datatable_payment_list').attr('data-type-translate-approved')
                            return `<span class="text-success">` + approved_trans + `&nbsp;<i class="bi bi-check2-circle"></i></span>`
                        }
                    }
                ],
            });
        }
    }

    loadAdvanceList();
})