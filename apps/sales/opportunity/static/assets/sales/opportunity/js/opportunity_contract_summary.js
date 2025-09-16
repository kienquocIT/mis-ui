$(document).ready(function () {
    const $script_url = $('#script-url')
    const $dtb_sale_order_indicator = $('#dtb-sale-order-indicator')
    const $dtb_lease_order_indicator = $('#dtb-lease-order-indicator')

    function LoadSaleOrderIndicatorTable(datasource=[]) {
        $dtb_sale_order_indicator.DataTable().clear().destroy()
        $dtb_sale_order_indicator.DataTableDefault({
            styleDom: "hide-foot",
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            data: datasource,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-25',
                    'render': (data, type, row) => {
                        return `<span>${row?.['quotation_indicator_data']?.['title']}</span>`;
                    }
                },
                {
                    className: 'w-20',
                    'render': (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['quotation_indicator_value']}"></span>`;
                    }
                },
                {
                    className: 'w-20',
                    'render': (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['indicator_value']}"></span>`;
                    }
                },
                {
                    className: 'w-20',
                    'render': (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['difference_indicator_value']}"></span>`;
                    }
                },
                {
                    className: 'w-10',
                    'render': (data, type, row) => {
                        return `<span>${row?.['indicator_rate']}%</span>`;
                    }
                },
            ],
            initComplete: function () {
                let wrapper$ = $dtb_sale_order_indicator.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(`<span class="text-muted fw-bold h5"><i class="fas fa-shopping-cart"></i> ${$.fn.gettext('Sale order indicator')}</span>`)
                }
            }
        });
    }

    function LoadLeaseOrderIndicatorTable(datasource=[]) {
        $dtb_lease_order_indicator.DataTable().clear().destroy()
        $dtb_lease_order_indicator.DataTableDefault({
            styleDom: "hide-foot",
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: true,
            scrollY: '50vh',
            scrollCollapse: true,
            data: datasource,
            columns: [
                {
                    className: 'w-5',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    className: 'w-25',
                    'render': (data, type, row) => {
                        return `<span>${row?.['quotation_indicator_data']?.['title']}</span>`;
                    }
                },
                {
                    className: 'w-20',
                    'render': (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['quotation_indicator_value']}"></span>`;
                    }
                },
                {
                    className: 'w-20',
                    'render': (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['indicator_value']}"></span>`;
                    }
                },
                {
                    className: 'w-20',
                    'render': (data, type, row) => {
                        return `<span class="mask-money" data-init-money="${row?.['difference_indicator_value']}"></span>`;
                    }
                },
                {
                    className: 'w-10',
                    'render': (data, type, row) => {
                        return `<span>${row?.['indicator_rate']}%</span>`;
                    }
                },
            ],
            initComplete: function () {
                let wrapper$ = $dtb_lease_order_indicator.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(`<span class="text-muted fw-bold h5"><i class="fas fa-handshake"></i> ${$.fn.gettext('Lease order indicator')}</span>`)
                }
            }
        });
    }

    const {opportunity_id} = $x.fn.getManyUrlParameters(['opportunity_id'])

    let dataParam = {'opportunity_id': opportunity_id}
    let ajax_call_opportunity_contract_summary = $.fn.callAjax2({
        url: $script_url.attr('data-url-call-opportunity-contract-summary'),
        data: dataParam,
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_contract_summary')) {
                return data?.['opportunity_contract_summary'];
            }
            return {};
        },
        (errs) => {
            console.log(errs);
        }
    )

    Promise.all([ajax_call_opportunity_contract_summary]).then(
        (results) => {
            if (results[0].length === 1) {
                const opportunity_contract_summary = results[0][0]
                const sale_order_contract_summary_data = opportunity_contract_summary?.['sale_order_contract_summary_data'] || []
                const lease_order_contract_summary_data = opportunity_contract_summary?.['lease_order_contract_summary_data'] || []

                $('#opp-title').text(opportunity_contract_summary?.['title'])
                $('#customer-name').text(opportunity_contract_summary?.['customer_data']?.['name'])

                let group_title = opportunity_contract_summary?.['sale_person']?.['group']?.['title']
                $('#sale-person').text(opportunity_contract_summary?.['sale_person']?.['full_name'] + (group_title ? ` (${group_title})` : ''))
                $('#open-date').text(opportunity_contract_summary?.['open_date'] ? moment(opportunity_contract_summary?.['open_date'], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--')
                $('#close-date').text(opportunity_contract_summary?.['close_date'] ? moment(opportunity_contract_summary?.['close_date'], 'YYYY-MM-DD').format('DD/MM/YYYY') : '--')

                LoadSaleOrderIndicatorTable(sale_order_contract_summary_data)

                LoadLeaseOrderIndicatorTable(lease_order_contract_summary_data)
            }
        })
})
