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
                        width: "10%",
                        render: (data, type, row) => {
                            let urlDetail = url_detail.format_url_with_uuid(row.id);
                            return `<a href="${urlDetail}"><span class="badge badge-primary">${data}</span></a>` + $x.fn.buttonLinkBlank(urlDetail);
                        }
                    },
                    {
                        data: 'title',
                        targets: 1,
                        width: "20%",
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'request_for',
                        targets: 2,
                        width: "15%",
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'sale_order',
                        targets: 3,
                        width: "10%",
                        className: 'wrap-text',
                        render: (data) => {
                            if (data !== null) {
                                return `<p>${data.title}</p>`
                            }
                            else{
                                return `<p>${data}</p>`
                            }
                        }
                    },
                    {
                        data: 'supplier',
                        targets: 4,
                        width: "10%",
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data.title}</p>`
                        }
                    },
                    {
                        data: 'delivered_date',
                        targets: 5,
                        width: "10%",
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data.split(' ')[0]}</p>`
                        }
                    },
                    {
                        data: 'system_status',
                        targets: 6,
                        width: "10%",
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'purchase_status',
                        targets: 7,
                        width: "10%",
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        targets: 8,
                        width: "5%",
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