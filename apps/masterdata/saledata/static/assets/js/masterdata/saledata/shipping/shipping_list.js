$(document).ready(function () {
    function loadShipping() {
        if (!$.fn.DataTable.isDataTable('#dtbShipping')) {
            let dtb = $('#dtbShipping');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            return resp.data['shipping_list'] ? resp.data['shipping_list'] : [];
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        render: (data, type, row, meta) => {
                            return '';
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
                        data: 'is_active', className: 'wrap-text', render: (data, type, row, meta) => {
                            if (data) {
                                return `<span class="badge badge-info badge-indicator badge-indicator-xl"></span>`;
                            } else {
                                return `<span class="badge badge-light badge-indicator badge-indicator-xl"></span>`;
                            }
                        }
                    }
                ],
            });
        }
    }

    loadShipping();
})