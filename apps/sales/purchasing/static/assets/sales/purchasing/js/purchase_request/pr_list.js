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
                scrollX: true,
                scrollY: '70vh',
                scrollCollapse: true,
                reloadCurrency: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
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
                        className: 'w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        className: 'w-5',
                        render: (data, type, row) => {
                            let link = url_detail.format_url_with_uuid(row.id)+`?type=${row?.['request_for']}`;
                            return `<a href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-30',
                        render: (data, type, row) => {
                            let link = url_detail.format_url_with_uuid(row.id)+`?type=${row?.['request_for']}`;
                            return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            let doc_code = ''
                            if (row?.['request_for'] === 0) {
                                doc_code = row?.['sale_order']?.['code'];
                            }
                            else if (row?.['request_for'] === 3) {
                                doc_code = row?.['distribution_plan']?.['code'];
                            }
                            return `<span>${row?.['request_for_string']}&nbsp;<span class="fw-bold">${doc_code}</span></span>`
                        }
                    },
                    {
                        className: 'ellipsis-cell-lg w-15',
                        render: (data, type, row) => {
                            return `<p class="text-muted">${row?.['supplier']?.['title']}</p>`
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['delivered_date'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                    {
                        className: 'w-10',
                        render: (data, type, row) => {
                            let status_data = {
                                0: "text-blue",
                                1: "text-orange",
                                2: "text-success",
                            }
                            return `<span class="${status_data[row?.['purchase_status']]}">${row?.['purchase_status_string']}</span>`;
                        }
                    },
                    {
                        className: 'text-center w-10',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
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