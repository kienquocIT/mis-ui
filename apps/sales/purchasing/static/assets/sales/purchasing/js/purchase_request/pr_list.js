$(document).ready(function () {
    const ele_url = $('#url-factory');
    const url_detail = ele_url.data('url-detail');
    const url_create = ele_url.data('url-create');

    function loadDtb(url_detail) {
        if (!$.fn.DataTable.isDataTable('#datatable-purchase-request')) {
            let $table = $('#datatable-purchase-request')
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                scrollX: '100vh',
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
                        className: '',
                        render: (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let urlDetail = url_detail.format_url_with_uuid(row.id)+`?type=${row?.['request_for']}`;
                            return `<a href="${urlDetail}"><span class="badge badge-primary w-70">${data}</span></a>` + $x.fn.buttonLinkBlank(urlDetail);
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let urlDetail = url_detail.format_url_with_uuid(row.id)+`?type=${row?.['request_for']}`;
                            return `<a href="${urlDetail}"><span class="text-primary fw-bold">${data}</span></a>`
                        }
                    },
                    {
                        data: 'request_for_string',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            let doc_code = ''
                            if (row?.['request_for'] === 0) {
                                doc_code = `<span data-bs-toggle="tooltip" title="${row?.['sale_order']?.['title']}" class="badge badge-outline badge-soft-secondary w-80">${row?.['sale_order']?.['code']}</span>`;
                            }
                            else if (row?.['request_for'] === 3) {
                                doc_code = `<span data-bs-toggle="tooltip" title="${row?.['distribution_plan']?.['title']}" class="badge badge-outline badge-soft-secondary w-80">${row?.['distribution_plan']?.['code']}</span>`;
                            }
                            return `<span class="fst-italic small">${data}</span>&nbsp;${doc_code}`
                        }
                    },
                    {
                        data: 'supplier',
                        className: 'wrap-text',
                        render: (data) => {
                            return `<p class="text-muted">${data.title}</p>`
                        }
                    },
                    {
                        data: 'delivered_date',
                        className: 'wrap-text',
                        render: (data) => {
                            return moment(data.split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY');
                        }
                    },
                    {
                        data: 'system_status',
                        className: 'wrap-text text-center',
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
                    {
                        data: 'purchase_status_string',
                        className: 'wrap-text text-center',
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

    $(document).on('click', '#btn-create-for-other', function () {
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