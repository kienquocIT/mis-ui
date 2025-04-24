$(document).ready(function () {
    function loadDtb() {
        if (!$.fn.DataTable.isDataTable('#dtbGoodsIssue')) {
            let $table = $('#dtbGoodsIssue')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                rowIdx: true,
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
                        className: 'w-5',
                        data: 'code',
                        render: (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-10',
                        data: 'code',
                        render: (data, type, row) => {
                            let link = $table.data('url-detail').format_url_with_uuid(row.id);
                            return `<a href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'w-40',
                        data: 'title',
                        render: (data, type, row) => {
                            let urlDetail = $table.data('url-detail').format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="text-primary fw-bold">${data}</span></a>`
                        }
                    },
                    {
                        data: 'goods_issue_type',
                        className: 'w-20',
                        render: (data) => {
                            let type_trans = [$table.attr('data-trans-ia'), $table.attr('data-trans-liquidation'), $table.attr('data-trans-production')]
                            return `<span class="text-muted fst-italic">${type_trans[data]}</span>`
                        }
                    },
                    {
                        data: 'date_created',
                        className: 'w-15',
                        render: (data) => {
                            return `<p>${moment(data.split(' ')[0], "YYYY-MM-DD").format('DD/MM/YYYY')}</p>`
                        }
                    },
                    {
                        data: 'system_status',
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                ],
            });
        }
    }
    loadDtb();
})
