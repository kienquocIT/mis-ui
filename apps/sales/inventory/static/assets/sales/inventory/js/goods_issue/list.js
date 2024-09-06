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
                            console.log(resp.data['goods_issue_list'])
                            return resp.data['goods_issue_list'] ? resp.data['goods_issue_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        className: 'w-10',
                        data: 'code',
                        render: (data, type, row) => {
                            let urlDetail = $table.data('url-detail').format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="badge badge-primary w-70">${data}</span></a>` + $x.fn.buttonLinkBlank(urlDetail);
                        }
                    },
                    {
                        className: 'w-45',
                        data: 'title',
                        render: (data, type, row) => {
                            let urlDetail = $table.data('url-detail').format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="text-primary fw-bold">${data}</span></a>`
                        }
                    },
                    {
                        data: 'goods_issue_type',
                        className: 'wrap-text w-20',
                        render: (data) => {
                            return `<span class="badge badge-blue">${data}</span>`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'wrap-text w-15',
                        render: (data) => {
                            return `<p>${moment(data.split(' ')[0], "YYYY-MM-DD").format('DD/MM/YYYY')}</p>`
                        }
                    },
                    {
                        data: 'system_status',
                        className: 'wrap-text text-center w-10',
                        render: (data, type, row) => {
                            let approved_trans = ``
                            let text_color = ``
                            if (row?.['system_status'] === 0) {
                                approved_trans = 'Draft'
                                text_color = 'badge-soft-secondary'
                            }
                            else if (row?.['system_status'] === 1) {
                                approved_trans = 'Created'
                                text_color = 'badge-soft-primary'
                            }
                            else if (row?.['system_status'] === 2) {
                                approved_trans = 'Added'
                                text_color = 'badge-soft-blue'
                            }
                            else if (row?.['system_status'] === 3) {
                                approved_trans = 'Finish'
                                text_color = 'badge-soft-success'
                            }
                            else if (row?.['system_status'] === 4) {
                                approved_trans = 'Cancel'
                                text_color = 'badge-soft-danger'
                            }
                            return `<span class="w-100 badge ${text_color}">` + approved_trans + `</span>`
                        }
                    },
                ],
            });
        }
    }
    loadDtb();
})
