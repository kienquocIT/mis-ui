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
                rowIdx: true,
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
                        className: '',
                        render: (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            let urlDetail = url_detail.format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="badge badge-primary w-70">${data}</span></a>` + $x.fn.buttonLinkBlank(urlDetail);
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-15',
                        render: (data, type, row) => {
                            let urlDetail = url_detail.format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="text-primary fw-bold">${data}</span></a>`
                        }
                    },
                    {
                        data: 'request_for',
                        className: 'wrap-text w-15',
                        render: (data) => {
                            return `<span class="fst-italic">${data}</span>`
                        }
                    },
                    {
                        data: 'sale_order',
                        className: 'wrap-text w-15',
                        render: (data) => {
                            return `<p class="fw-bold text-blue">${data?.['title'] ? data?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        data: 'supplier',
                        className: 'wrap-text w-15',
                        render: (data) => {
                            return `<p class="text-muted fw-bold">${data.title}</p>`
                        }
                    },
                    {
                        data: 'delivered_date',
                        className: 'wrap-text w-10',
                        orderable: true,
                        render: (data) => {
                            return moment(data.split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY');
                        }
                    },
                    {
                        data: 'system_status',
                        className: 'wrap-text text-center w-10',
                        render: (data) => {
                            let status_data = {
                                "Draft": "badge badge-soft-light",
                                "Created": "badge badge-soft-primary",
                                "Added": "badge badge-soft-info",
                                "Finish": "badge badge-soft-success",
                                "Cancel": "badge badge-soft-danger",
                            }
                            return `<span class="w-80 ${status_data[data]}">${data}</span>`;
                        }
                    },
                    {
                        data: 'purchase_status',
                        className: 'wrap-text text-center w-10',
                        render: (data, type, row) => {
                            console.log(data)
                            let status_data = {
                                0: "badge-outline badge badge-light",
                                1: "badge-outline badge badge-warning",
                                2: "badge-outline badge badge-success",
                            }
                            return `<span class="w-80 ${status_data[row?.['purchase_status_raw']]}">${data}</span>`;
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