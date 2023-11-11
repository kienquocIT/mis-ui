$(document).ready(function () {
    function loadShipping() {
        if (!$.fn.DataTable.isDataTable('#dtbShipping')) {
            let dtb = $('#dtbShipping');
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
                        data: 'is_active',
                        render: (data, type, row) => {
                            return (`<div class="form-check form-switch mb-1"><input type="checkbox" class="form-check-input" {0} disabled></div>`).format_by_idx((data === true ? "checked" : ""))
                        },
                    },

                ],
            });
        }
    }

    loadShipping();
})