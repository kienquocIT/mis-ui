$(document).ready(function () {
    const ele_url = $('#url-factory');
    const url_detail = ele_url.data('url-detail');
    const url_create = ele_url.data('url-create');

    function loadDtb(url_detail) {
        if (!$.fn.DataTable.isDataTable('#datatable-purchase-request')) {
            let $table = $('#datatable-purchase-request')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('purchase_request_list')) {
                            return resp.data['purchase_request_list'] ? resp.data['purchase_request_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        data: 'code',
                        targets: 0,
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            let urlDetail = url_detail.format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="badge badge-primary">${data}</span></a>` + $x.fn.buttonLinkBlank(urlDetail);
                        }
                    },
                    {
                        data: 'title',
                        targets: 1,
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            let urlDetail = url_detail.format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="text-primary fw-bold">${data}</span></a>`
                        }
                    },
                    {
                        data: 'request_for',
                        targets: 2,
                        className: 'wrap-text w-15',
                        render: (data) => {
                            return `<span class="fst-italic">${data}</span>`
                        }
                    },
                    {
                        data: 'sale_order',
                        targets: 3,
                        className: 'wrap-text w-15',
                        render: (data) => {
                            return `<p class="fw-bold text-blue">${data?.['title'] ? data?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        data: 'supplier',
                        targets: 4,
                        className: 'wrap-text w-15',
                        render: (data) => {
                            return `<p class="text-muted fw-bold">${data.title}</p>`
                        }
                    },
                    {
                        data: 'delivered_date',
                        targets: 5,
                        className: 'wrap-text w-10',
                        orderable: true,
                        render: (data) => {
                            return `<p>${data.split(' ')[0]}</p>`
                        }
                    },
                    {
                        data: 'system_status',
                        targets: 6,
                        className: 'wrap-text w-10',
                        render: (data) => {
                            let status_data = {
                                "Draft": "badge badge-soft-light",
                                "Created": "badge badge-soft-primary",
                                "Added": "badge badge-soft-info",
                                "Finish": "badge badge-soft-success",
                                "Cancel": "badge badge-soft-danger",
                            }
                            return `<span class="${status_data[data]}">${data}</span>`;
                        }
                    },
                    {
                        data: 'purchase_status',
                        targets: 7,
                        className: 'wrap-text w-10',
                        render: (data) => {
                            let status_data = {
                                "Wait": "badge badge-soft-light",
                                "Partially ordered": "badge badge-soft-warning",
                                "Ordered": "badge badge-soft-success",
                            }
                            return `<span class="${status_data[data]}">${data}</span>`;
                        }
                    },
                    {
                        targets: 8,
                        className: 'wrap-text',
                        render: () => {
                            return ``
                        }
                    },
                ],
            });
        }
    }

    loadDtb(url_detail);

    function changeHrefCreate(url_create, paramString) {
        window.location.href = url_create + "?" + paramString;
    }

    $(document).on('click', '#btn-create-for-sale-order', function () {
        let paramString = $.param({
            'type': 'sale-order',
        })
        changeHrefCreate(url_create, paramString);
    })

    $(document).on('click', '#btn-create-for-stock', function () {
        let paramString = $.param({
            'type': 'stock',
        })
        changeHrefCreate(url_create, paramString);
    })

    $(document).on('click', '#btn-create-for-other', function () {
        let paramString = $.param({
            'type': 'other',
        })
        changeHrefCreate(url_create, paramString);
    })
})