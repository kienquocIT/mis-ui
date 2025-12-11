$(document).ready(function () {
    let letStateChoices = JSON.parse($('#dataStateChoices').text());
    let tbl = $('#dtbDeliveryList');
    let frm = new SetupFormSubmit(tbl);
    let transEle = $('#app-trans-factory');

    let $boxStatus = $('#box-status');
    let $boxState = $('#box-state');
    let dataState = [
        {'id': 0, 'title': letStateChoices[0]},
        {'id': 1, 'title': letStateChoices[1]},
        {'id': 2, 'title': letStateChoices[2]},
    ]

    init();

    function loadDtb(params) {
        tbl.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                data: params,
                dataSrc: "data.delivery_list"
            },
            columns: [
                {
                    width: '1%',
                    render: (data, type, row, meta) => {
                        console.log(row)
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
                        let app = transEle.attr('data-app-1');
                        let badge = "success";
                        if (row?.['lease_order_data']?.['id']) {
                            target = row?.['lease_order_data'];
                            url = tbl.attr('data-url-lease-order-detail');
                            app = transEle.attr('data-app-2');
                            badge = "warning";
                        }
                        if (row?.['service_order_data']?.['id']) {
                            target = row?.['service_order_data'];
                            url = tbl.attr('data-url-service-order-detail');
                            app = transEle.attr('data-app-3');
                            badge = "pink";
                        }
                        if (target && target.hasOwnProperty('id') && target.hasOwnProperty('code')) {
                            return `<a href="{0}" class="link-primary underline_hover"><span class="badge badge-soft-${badge} mr-1">${app}</span><span class="mr-1">{1}</span><span class="badge badge-light badge-outline">{2}</span></a>`.format_by_idx(
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
                        return WFRTControl.displayRuntimeStatus(row?.['system_status']);
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
                        return `<div class="d-flex align-items-center justify-content-between"><span>${letStateChoices[data]}</span><i class="fas fa-check text-success fs-4" ${hidden}></i></div>`;
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
                                    <a class="dropdown-item ${disabled}" href="${link}"><i class="dropdown-icon far fa-edit"></i><span>${transEle.attr('data-edit')}</span></a>
                                </div>
                            </div>`;
                    }
                }
            ],
            drawCallback: function () {
                dtbHDCustom();
            },
            rowIdx: false,
        })
    }

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
                    // params['opportunity__is_deal_closed'] = false;
                },
                dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('sale_order_list')) {
                            let fnData = [];
                            for (let dataSO of resp.data['sale_order_list']) {
                                if (Object.keys(dataSO?.['opportunity']).length > 0) {
                                    if (dataSO?.['opportunity']?.['is_deal_closed'] === false) {
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

    $('#btn-apply-filter').on('click', function () {
        let dataParams = {};
        if ($boxStatus.val()) {
            dataParams['system_status'] = $boxStatus.val();
        }
        if ($boxState.val()) {
            dataParams['state'] = $boxState.val();
        }
        tbl.DataTable().destroy();
        loadDtb(dataParams);
    });

    function init() {
        loadDtb({});
        FormElementControl.loadInitS2($boxStatus, WFRTControl.getDataDDSystemStatus(), {}, null, true);
        FormElementControl.loadInitS2($boxState, dataState, {}, null, true);
        return true;
    }

    function dtbHDCustom() {
        let wrapper$ = tbl.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        if (headerToolbar$.length > 0) {
            if (!$('#btn-open-filter').length) {
                let $group = $(`<div class="btn-filter">
                                        <button type="button" class="btn btn-light btn-sm ml-1" id="btn-open-filter" data-bs-toggle="offcanvas" data-bs-target="#filterCanvas">
                                            <span><span class="icon"><i class="fas fa-filter"></i></span><span>${$.fn.transEle.attr('data-filter')}</span></span>
                                        </button>
                                    </div>`);
                headerToolbar$.append($group);
            }
        }
    }
});