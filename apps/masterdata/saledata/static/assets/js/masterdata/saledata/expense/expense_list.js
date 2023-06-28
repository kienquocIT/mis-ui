$(document).ready(function () {
    function loadExpenses() {
        if (!$.fn.DataTable.isDataTable('#dtbExpense')) {
            let dtb = $('#dtbExpense');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                rowIdx: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['expense_list'] ? resp.data['expense_list'] : [];
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
                        data: 'code', className: 'wrap-text', render: (data, type, row, meta) => {
                            return `<a href="{0}"><span class="badge badge-soft-primary">{1}</span></a>`.format_by_idx(
                                frm.getUrlDetail(row.id), data
                            )
                        }
                    },
                    {
                        data: 'title', className: 'wrap-text', render: (data, type, row, meta) => {
                            return `<span>{0}</span></a>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'expense_type', className: 'wrap-text', render: (data, type, row, meta) => {
                            return `<span>{0}</span></a>`.format_by_idx(
                                row.general_information.expense_type.title
                            )
                        }
                    }
                ],
            });
        }
    }
    loadExpenses();
})