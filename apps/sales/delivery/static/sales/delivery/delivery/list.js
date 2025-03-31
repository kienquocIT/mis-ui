$(document).ready(function () {
    let letStateChoices = JSON.parse($('#dataStateChoices').text());
    let tbl = $('#dtbDeliveryList');
    let frm = new SetupFormSubmit(tbl);
    let transEle = $('#app-trans-factory');
    tbl.DataTableDefault({
        useDataServer: true,
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: "data.delivery_list"
        },
        columns: [
            {
                width: '1%',
                render: (data, type, row, meta) => {
                    return `<span class="table-row-order">${(meta.row + 1)}</span>`
                }
            },
            {
                data: 'code',
                width: '10%',
                render: (row, type, data, meta) => {
                    let html = '--';
                    let url = $('#url-factory').attr('data-page-detail');
                    if (row) html = row
                    const link = url.format_url_with_uuid(data.id);
                    html = `<a href="${link}" class="link-primary underline_hover">${html}</a> ${$x.fn.buttonLinkBlank(link)}`
                    return html
                },
            }, {
                width: '20%',
                render: (data, type, row) => {
                    let target = row?.['sale_order_data'];
                    let url = tbl.attr('data-url-sale-order-detail');
                    if (row?.['lease_order_data']?.['id']) {
                        target = row?.['lease_order_data'];
                        url = tbl.attr('data-url-lease-order-detail');
                    }
                    if (target && target.hasOwnProperty('id') && target.hasOwnProperty('code')) {
                        return `<a href="{0}" class="link-primary underline_hover"><span class="mr-2">{1}</span><span class="badge badge-light badge-outline">{2}</span></a>`.format_by_idx(
                            SetupFormSubmit.getUrlDetailWithID(
                                url,
                                target['id']
                            ),
                            UtilControl.getValueOrEmpty(target, 'title'),
                            UtilControl.getValueOrEmpty(target, 'code'),
                        );
                    }
                    return '';
                },
            }, {
                data: 'date_created',
                width: '10%',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(data, {
                        'outputFormat': 'DD/MM/YYYY',
                    })
                },
            }, {
                data: 'estimated_delivery_date',
                width: '10%',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(data, {
                        'outputFormat': 'DD/MM/YYYY',
                    })
                },
            },
            {
                data: 'actual_delivery_date',
                width: '10%',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(data, {
                        'outputFormat': 'DD/MM/YYYY',
                    });
                },
            },
            {
                data: 'employee_inherit',
                width: '15%',
                render: (row, type, data) => {
                    let time = '--';
                    if (Object.keys(row).length > 0) time = `${row.full_name}`
                    return time
                },
            },
            {
                width: '10%',
                render: (data, type, row) => {
                    let sttTxt = JSON.parse($('#stt_sys').text())
                    let sttData = [
                        "light",
                        "primary",
                        "info",
                        "success",
                        "danger",
                    ]
                    return `<span class="badge badge-soft-${sttData[row?.['system_status']]}">${sttTxt[row?.['system_status']][1]}</span>`;
                }
            },
            {
                data: 'state',
                width: '12%',
                render: (data, type, row, meta) => {
                    let hidden = "hidden";
                    if (row?.['state'] === 2) {
                        hidden = "";
                    }
                    return `<span>${letStateChoices[data]}</span><i class="far fa-check-circle text-success ml-2" ${hidden}></i>`;
                }
            },
            {
                class: 'text-center',
                orderable: false,
                width: '1%',
                render: (data, type, row, meta) => {
                    let link = $('#url-factory').attr('data-page-edit').format_url_with_uuid(row?.['id']);
                    let disabled = '';
                    if ([2, 3, 4].includes(row?.['system_status'])) {
                        disabled = 'disabled';
                    }
                    return `<div class="dropdown">
                                <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-lg" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                <div role="menu" class="dropdown-menu">
                                    <a class="dropdown-item ${disabled}" href="${link}"><i class="dropdown-icon far fa-edit text-primary"></i><span>${transEle.attr('data-edit')}</span></a>
                                </div>
                            </div>`;
                }
            }
        ],
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
                // dataSrc: 'data.sale_order_list',
                data: function (params) {
                    params['delivery_call'] = true;
                    params['system_status__in'] = [2, 3].join(',');
                    // params['opportunity__is_deal_close'] = false;
                },
                dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('sale_order_list')) {
                            let fnData = [];
                            for (let dataSO of resp.data['sale_order_list']) {
                                if (Object.keys(dataSO?.['opportunity']).length > 0) {
                                    if (dataSO?.['opportunity']?.['is_deal_close'] === false) {
                                        fnData.push(dataSO);
                                    }
                                } else {
                                    fnData.push(dataSO);
                                }
                            }
                            return fnData;
                        }
                        throw Error('Call data raise errors.')
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
                            + `<input type="radio" class="form-check-input input_select" id="customChecks_${meta.row}">`
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
        const row = $('input[type="radio"]:checked', $('#sale_order_approved'))
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