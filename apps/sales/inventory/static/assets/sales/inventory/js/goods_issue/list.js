let urlEle = $('#url-factory');
$(document).ready(function () {
    function loadDtb() {
        if (!$.fn.DataTable.isDataTable('#dtbGoodsIssue')) {
            let $table = $('#dtbGoodsIssue')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('goods_issue_list')) {
                            return resp.data['goods_issue_list'] ? resp.data['goods_issue_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        data: 'code',
                        targets: 0,
                        width: "15%",
                        render: (data, type, row) => {
                            let urlDetail = urlEle.data('url-detail').format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="badge badge-primary w-70">${data}</span></a>` + $x.fn.buttonLinkBlank(urlDetail);
                        }
                    },
                    {
                        data: 'title',
                        targets: 1,
                        width: "35%",
                        render: (data, type, row) => {
                            let urlDetail = urlEle.data('url-detail').format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="text-primary fw-bold">${data}</span></a>`
                        }
                    },
                    {
                        data: 'goods_issue_type',
                        targets: 2,
                        width: "20%",
                        className: 'wrap-text',
                        render: (data) => {
                            return `<span class="badge badge-blue">${data}</span>`
                        }
                    },
                    {
                        data: 'date_issue',
                        targets: 3,
                        width: "20%",
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${moment(data.split(' ')[0], "YYYY-MM-DD").format('DD/MM/YYYY')}</p>`
                        }
                    },
                    {
                        data: 'system_status',
                        targets: 4,
                        width: "10%",
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let color = [
                                'badge-secondary',
                                'badge-primary',
                                'badge-indigo',
                                'badge-success',
                                'badge-danger'
                            ]
                            return `<span class="badge w-100 ${color[row?.['raw_system_status']]}">${data}</span>`
                        }
                    },
                ],
            });
        }
    }
    loadDtb();
})
