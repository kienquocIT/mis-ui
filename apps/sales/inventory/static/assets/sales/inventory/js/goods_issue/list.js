let urlEle = $('#url-factory');
$(document).ready(function (){
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
                        width: "10%",
                        render: (data, type, row) => {
                            let urlDetail = urlEle.data('url-detail').format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="badge badge-primary">${data}</span></a>` + $x.fn.buttonLinkBlank(urlDetail);
                        }
                    },
                    {
                        data: 'title',
                        targets: 1,
                        width: "30%",
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'goods_issue_type',
                        targets: 2,
                        width: "20%",
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'date_issue',
                        targets: 3,
                        width: "20%",
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'system_status',
                        targets: 4,
                        width: "20%",
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                ],
            });
        }
    }
    loadDtb();
})
