$(document).ready(function () {
    const ele_url = $('#url-data');
    const url_detail = ele_url.data('url-detail');
    const url_create = ele_url.data('url-create');

    function loadDtb(url_detail) {
        if (!$.fn.DataTable.isDataTable('#datatable-purchase-request')) {
            let $table = $('#datatable-purchase-request')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
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
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<a href="#">${data}</a>`
                        }
                    },
                    {
                        data: 'title',
                        targets: 1,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'request_for',
                        targets: 2,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'sale_order',
                        targets: 3,
                        className: 'wrap-text',
                        render: (data, type, row) => {
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
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p>${data.title}</p>`
                        }
                    },
                    {
                        data: 'delivered_date',
                        targets: 5,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p>${data.split(' ')[0]}</p>`
                        }
                    },
                    {
                        data: 'system_status',
                        targets: 6,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        data: 'purchase_status',
                        targets: 7,
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<p>${data}</p>`
                        }
                    },
                    {
                        targets: 8,
                        className: 'wrap-text',
                        render: (data, type, row) => {
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

    $(document).on('click', '#btn-create-for-so', function () {
        let paramString = $.param({
            'type': 'sale-order',
        })
        changeHrefCreate(url_create, paramString);
    })
})