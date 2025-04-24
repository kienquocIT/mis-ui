$(document).ready(function () {
    const ele_url = $('#url-factory');
    const url_detail = ele_url.data('url-detail');
    const url_create = ele_url.data('url-create');

    function loadDtb(url_detail) {
        if (!$.fn.DataTable.isDataTable('#datatable-purchase-request')) {
            let $table = $('#datatable-purchase-request')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                scrollX: true,
                scrollCollapse: true,
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
                        render: (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        render: (data, type, row) => {
                            let link = url_detail.format_url_with_uuid(row.id)+`?type=${row?.['request_for']}`;
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        data: 'title',
                        render: (data, type, row) => {
                            let urlDetail = url_detail.format_url_with_uuid(row.id)+`?type=${row?.['request_for']}`;
                            return `<a href="${urlDetail}"><span class="text-primary fw-bold">${data}</span></a>`
                        }
                    },
                    {
                        data: 'request_for_string',
                        render: (data, type, row) => {
                            let doc_code = ''
                            if (row?.['request_for'] === 0) {
                                doc_code = row?.['sale_order']?.['code'];
                            }
                            else if (row?.['request_for'] === 3) {
                                doc_code = row?.['distribution_plan']?.['code'];
                            }
                            return `<span class="fst-italic small">${data}&nbsp;<span class="fw-bold">${doc_code}</span></span>`
                        }
                    },
                    {
                        data: 'supplier',
                        render: (data) => {
                            return `<p class="text-muted">${data.title}</p>`
                        }
                    },
                    {
                        data: 'delivered_date',
                        render: (data) => {
                            return moment(data.split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY');
                        }
                    },
                    {
                        data: 'system_status',
                        className: 'text-center',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                    {
                        data: 'purchase_status_string',
                        className: 'text-center',
                        render: (data, type, row) => {
                            let status_data = {
                                0: "badge-outline badge badge-secondary",
                                1: "badge-outline badge badge-warning",
                                2: "badge-outline badge badge-success",
                            }
                            return `<span class="${status_data[row?.['purchase_status']]}">${data}</span>`;
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
            'type': '0',
        })
        changeHrefCreate(url_create, paramString);
    })

    $(document).on('click', '#btn-create-for-stock-free', function () {
        let paramString = $.param({
            'type': '1',
        })
        changeHrefCreate(url_create, paramString);
    })

    $(document).on('click', '#btn-create-for-fixed-asset', function () {
        let paramString = $.param({
            'type': '2',
        })
        changeHrefCreate(url_create, paramString);
    })

    $(document).on('click', '#btn-create-for-stock-plan', function () {
        let paramString = $.param({
            'type': '3',
        })
        changeHrefCreate(url_create, paramString);
    })

    $('.select-pr-type').on('mouseenter', function () {
        $(this).addClass('bg-secondary-light-5')
    }).on('mouseleave', function () {
        $(this).removeClass('bg-secondary-light-5')
    })
})