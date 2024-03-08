$(document).ready(function () {
    let letStateChoices = JSON.parse($('#dataStateChoices').text());
    let tbl = $('#dtbDeliveryList');
    let frm = new SetupFormSubmit(tbl);
    tbl.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: "data.delivery_list"
        },
        columns: [
            {
                data: 'code',
                render: (row, type, data, meta) => {
                    let html = '--';
                    let url = $('#url-factory').attr('data-page-detail');
                    if (row) html = row
                    html = `<a href="${url.format_url_with_uuid(data.id)}">${html}</a>`
                    return html
                },
            }, {
                data: 'sale_order_data',
                render: (data, type, row) => {
                    if (data && data.hasOwnProperty('id') && data.hasOwnProperty('code')) {
                        return `<a href="{0}"><span>{1}</span><span class="badge badge-soft-success">{2}</span></a>`.format_by_idx(
                            SetupFormSubmit.getUrlDetailWithID(
                                tbl.attr('data-url-sale-order-detail'),
                                data['id']
                            ),
                            UtilControl.getValueOrEmpty(data, 'title'),
                            UtilControl.getValueOrEmpty(data, 'code'),
                        );
                    }
                    return '';
                },
            }, {
                data: 'date_created',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(data, {
                        'outputFormat': 'DD/MM/YYYY',
                    })
                },
            }, {
                data: 'estimated_delivery_date',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(data, {
                        'outputFormat': 'DD/MM/YYYY',
                    })
                },
            },
            {
                data: 'actual_delivery_date',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(data, {
                        'outputFormat': 'DD/MM/YYYY',
                    });
                },
            },
            {
                data: 'employee_inherit',
                render: (row, type, data) => {
                    let time = '--';
                    if (Object.keys(row).length > 0) time = `${row.full_name}`
                    return time
                },
            },
            {
                data: 'state',
                class: 'text-center',
                render: (data, type, row, meta) => {
                    const stateMap = {
                        0: 'warning',
                        1: 'info',
                        2: 'success',
                    }
                    return `<span class="badge badge-${stateMap[data]} badge-outline">${letStateChoices[data]}</span>`;
                }
            },
            {
                class: 'text-center',
                orderable: false,
                render: (data, type, row, meta) => {
                    const isTxt = $('#trans-factory').attr('data-return')
                    return `<div class="dropdown pointer mr-2">
                                <i class="far fa-window-maximize"
                                   data-bs-toggle="dropdown"
                                   data-dropdown-animation
                                   aria-haspopup="true"
                                   aria-expanded="false"></i>
                                <div class="dropdown-menu w-210p mt-2">
                                <a class="dropdown-item" href="#">${isTxt}</a></div>
                            </div>`;
                }
            }
        ],
        visibleSearchField: false,
        rowIdx: false,
    })

    const $Table = $('#sale_order_approved');
    $('#sale_order_select').on('shown.bs.modal', function (e) {
        e.stopPropagation();
        if ($Table.hasClass('dataTable')) $Table.DataTable().ajax.reload();
        else
            $Table.not('.dataTable').DataTableDefault({
            searching: false,
            ordering: false,
            paginate: true,
            ajax: {
                url: $('#url-factory').attr('data-sale-order'),
                type: 'GET',
                dataSrc: 'data.sale_order_list',
                data: function (params) {
                    params['delivery_call'] = true;
                    params['system_status__in'] = [2, 3].join(',');
                },
            },
            rowIdx: true,
            columns: [
                {
                    defaultContent: '',
                }, {
                    data: 'title',
                    render: (data, type, row, meta) => {
                        const title = `<div class="form-check">`
                            + `<input type="checkbox" class="form-check-input input_select" id="customChecks_${meta.row}">`
                            + `<label class="form-check-label" for="customChecks_${meta.row}">${data}</label>`
                            + `</div>`
                        return title;
                    },
                },
                {
                    data: 'code',
                    render: (row, type, data) => {
                        return row;
                    },
                }
            ],
            rowCallback(row, data, index) {
                $('input[type="checkbox"]', row).on('change', function(){
                    $('input[type="checkbox"]', $('#sale_order_approved')).not(this).prop('checked', false);
                });
            }
        });

    });


    $('#call_delivery').off().on('click', function () {
        const row = $('input[type="checkbox"]:checked', $('#sale_order_approved'))
        const isData = $Table.DataTable().row(row.closest('tr')).data();
        if (isData && isData.hasOwnProperty('id')){
            WindowControl.showLoading();
            const url = $('#url-factory').attr('data-create-delivery').replace('1', isData.id);
            $.fn.callAjax2({
                "url": url,
                "method": "POST"
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data?.['status'] === 200) {
                        const config = data?.config
                        if (config?.is_picking){
                            setTimeout(() => {
                                window.location.href = $('#url-factory').attr('data-picking')
                            }, 1000);
                        }
                        else{
                            WindowControl.hideLoading();
                            $('#dtbDeliveryList').DataTable().ajax.reload();
                        }
                    }
                },
                (errs) => {
                    WindowControl.hideLoading();
                    $.fn.notifyB({"description": errs?.data?.errors, "timeout": 3500}, 'failure')
                }
            )
        }
    })
});