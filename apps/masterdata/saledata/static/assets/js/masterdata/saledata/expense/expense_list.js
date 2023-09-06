$(document).ready(function () {
    function loadExpenses() {
        if (!$.fn.DataTable.isDataTable('#dtbExpense')) {
            let dtb = $('#dtbExpense');
            let urlDetail = dtb.data('url-detail');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                rowIdx: true,
                useDataServer: true,
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
                callbackGetLinkBlank: function (rowData) {
                    return rowData.id ? urlDetail.format_url_with_uuid(rowData.id) : null;
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
                            return `<a href="{0}"><span class="badge badge-soft-primary">{1}</span></a>{2}`.format_by_idx(
                                frm.getUrlDetail(row.id), data, $x.fn.buttonLinkBlank(urlDetail.format_url_with_uuid(row.id))
                            )
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span>{0}</span></a>`.format_by_idx(
                                data
                            )
                        }
                    },
                    {
                        data: 'expense_type',
                        className: 'wrap-text',
                        render: (data, type, row, meta) => {
                            return `<span>{0}</span></a>`.format_by_idx(
                                row.expense_type.title,
                            )
                        }
                    }
                ],
            });
        }
    }

    loadExpenses();
})