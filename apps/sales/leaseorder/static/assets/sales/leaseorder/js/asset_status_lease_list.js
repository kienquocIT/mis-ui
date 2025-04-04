$(function () {
    $(document).ready(function () {

        let $boxLease = $('#box-lease-order');
        let $table = $('#table_asset_status_lease_list');
        let $urlFact = $('#app-urls-factory');
        let $transFact = $('#app-trans-factory');

        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                autoWidth: true,
                scrollX: true,
                pageLength: 50,
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            return `<span>${row?.['code'] ? row?.['code'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            return `<span>${row?.['title'] ? row?.['title'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            return `<span>${row?.['asset_type'] ? row?.['asset_type'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            return `<span>1</span>`;
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            return `<span>1</span>`;
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row) => {
                            return `<span>${row?.['lease_order_data']?.['title'] ? row?.['lease_order_data']?.['title'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 6,
                        render: (data, type, row) => {
                            return `<span>${row?.['lease_order_data']?.['code'] ? row?.['lease_order_data']?.['code'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 7,
                        render: (data, type, row) => {
                            return `<span>${row?.['employee_inherit']?.['full_name'] ? row?.['employee_inherit']?.['full_name'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 8,
                        render: (data, type, row) => {
                            return `<span>${row?.['employee_inherit']?.['full_name'] ? row?.['employee_inherit']?.['full_name'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 9,
                        render: (data, type, row) => {
                            return `<span>${row?.['lease_order_data']?.['customer']?.['title'] ? row?.['lease_order_data']?.['customer']?.['title'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 10,
                        render: (data, type, row) => {
                            return `<span>${row?.['original_cost'] ? row?.['original_cost'] : 0}</span>`;
                        }
                    },
                    {
                        targets: 11,
                        render: (data, type, row) => {
                            return `<span>${row?.['net_value'] ? row?.['net_value'] : 0}</span>`;
                        }
                    },
                    {
                        targets: 12,
                        render: (data, type, row) => {
                            return `<span>${row?.['depreciation_time'] ? row?.['depreciation_time'] : 0}</span>`;
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                    // add css to Dtb
                    dtbHDCustom();
                },
            });
        }

        function dtbHDCustom() {
            let wrapper$ = $table.closest('.dataTables_wrapper');
            let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
            let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
            headerToolbar$.prepend(textFilter$);

            if (textFilter$.length > 0) {
                textFilter$.css('display', 'flex');
                // Check if the button already exists before appending
                if (!$('#btn-open-filter').length) {
                    let $group = $(`<button type="button" class="btn btn-outline-secondary" id="btn-open-filter" data-bs-toggle="offcanvas" data-bs-target="#filterCanvas">
                                        <span><span class="icon"><i class="fas fa-filter"></i></span><span>${$transFact.attr('data-filter')}</span></span>
                                    </button>`);
                    textFilter$.append(
                        $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                    );
                }
            }
        }

        function callAjaxData() {
            let newRevenue = 0;
            let newGrossProfit = 0;
            let newNetIncome = 0;
            $table.DataTable().rows().every(function () {
                let row = this.node();
                let rowRevenue = row?.querySelector('.table-row-revenue')?.getAttribute('data-init-money');
                let rowGrossProfit = row?.querySelector('.table-row-gross-profit')?.getAttribute('data-init-money');
                let rowNetIncome = row?.querySelector('.table-row-net-income')?.getAttribute('data-init-money');
                if (rowRevenue) {
                    newRevenue += parseFloat(rowRevenue);
                }
                if (rowGrossProfit) {
                    newGrossProfit += parseFloat(rowGrossProfit);
                }
                if (rowNetIncome) {
                    newNetIncome += parseFloat(rowNetIncome);
                }
            });
            eleRevenue.attr('data-init-money', String(newRevenue));
            eleGrossProfit.attr('data-init-money', String(newGrossProfit));
            eleNetIncome.attr('data-init-money', String(newNetIncome));
        }

        function storeLoadInitByDataFiscalYear() {
            $.fn.callAjax2({
                    'url': eleFiscalYear.attr('data-url'),
                    'method': eleFiscalYear.attr('data-method'),
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('periods_list') && Array.isArray(data.periods_list)) {
                            eleFiscalYear.val(JSON.stringify(data.periods_list));
                            let currentYear = new Date().getFullYear();
                            for (let period of data.periods_list) {
                                if (period?.['fiscal_year'] === currentYear) {
                                    let {startDate, endDate} = getYearRange(period?.['start_date']);
                                    // set init val date range
                                    let startDateObj = new Date(startDate);
                                    let endDateObj = new Date(endDate);
                                    let formattedStartDate = `${padWithZero(startDateObj.getDate())}/${padWithZero(startDateObj.getMonth() + 1)}/${startDateObj.getFullYear()}`;
                                    let formattedEndDate = `${padWithZero(endDateObj.getDate())}/${padWithZero(endDateObj.getMonth() + 1)}/${endDateObj.getFullYear()}`;
                                    boxStart.val(formattedStartDate);
                                    boxEnd.val(formattedEndDate);
                                    $.fn.callAjax2({
                                            'url': $table.attr('data-url'),
                                            'method': $table.attr('data-method'),
                                            'data': {
                                                'is_initial': false,
                                                'date_approved__gte': startDate,
                                                'date_approved__lte': endDate,
                                            },
                                            isLoading: true,
                                        }
                                    ).then(
                                        (resp) => {
                                            let data = $.fn.switcherResp(resp);
                                            if (data) {
                                                if (data.hasOwnProperty('report_revenue_list') && Array.isArray(data.report_revenue_list)) {
                                                    $table.DataTable().clear().draw();
                                                    $table.DataTable().rows.add(data.report_revenue_list).draw();
                                                    loadTotal();
                                                }
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            )
        }

        function padWithZero(num) {
            return num < 10 ? '0' + num : num;
        }

        function getYearRange(startDate) {
            let endDate = getFiscalYearEndDate(startDate);
            let datesFormat = formatStartEndDate(startDate, endDate);
            return {startDate: datesFormat?.['startDate'], endDate: datesFormat?.['endDate']};
        }

        function getFiscalYearEndDate(startDate) {
            let endDateFY = '';
            if (startDate) {
                let startDateFY = new Date(startDate);
                endDateFY = new Date(startDateFY);
                // Add 12 months to the start date
                endDateFY.setMonth(startDateFY.getMonth() + 12);
                // Subtract 1 day to get the last day of the fiscal year
                endDateFY.setDate(endDateFY.getDate() - 1);
                // Format the end date as 'YYYY-MM-DD'
                endDateFY = endDateFY.toISOString().slice(0, 10);
                return endDateFY;
            }
            return endDateFY;
        }

        function formatStartEndDate(startDate, endDate) {
            if (startDate && endDate) {
                startDate = startDate + ' 00:00:00';
                endDate = endDate + ' 23:59:59';
                return {startDate, endDate};
            }
            return {startDate: '', endDate: ''};
        }

        function formatStartDate(startDate) {
            if (startDate) {
                startDate = startDate + ' 00:00:00';
                return startDate;
            }
            return '';
        }

        function formatEndDate(endDate) {
            if (endDate) {
                endDate = endDate + ' 23:59:59';
                return endDate;
            }
            return '';
        }

        function loadFilter(listData, $eleShow) {
            if (listData.length > 0) {
                $eleShow.html(`<div><small class="text-primary">${listData.join(" - ")}</small></div>`);
            } else {
                $eleShow.html(``);
            }
        }

        function getListTxtMultiSelect2 ($ele) {
            let result = [];
            if ($ele.val() && $ele.val().length > 0) {
                let selectedValues = $ele.val();
                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = $ele[0].innerHTML;
                for (let val of selectedValues) {
                    let option = tempDiv.querySelector(`option[value="${val}"]`);
                    if (option) {
                        result.push(option.textContent);
                    }
                }
            }
            return result;
        }

        // load init
        function initData() {
            loadInitS2($boxLease, [], {}, null, true);
            loadDbl();
            $('#btn-apply-filter').trigger('click');
        }

        initData();

        function loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
            let opts = {'allowClear': isClear};
            $ele.empty();
            if (data.length > 0) {
                opts['data'] = data;
            }
            if (Object.keys(dataParams).length !== 0) {
                opts['dataParams'] = dataParams;
            }
            if ($modal) {
                opts['dropdownParent'] = $modal;
            }
            if (Object.keys(customRes).length !== 0) {
                opts['templateResult'] = function (state) {
                    let res1 = `<span class="badge badge-soft-primary mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                    let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                    return $(`<span>${res1} ${res2}</span>`);
                }
            }
            $ele.initSelect2(opts);
            return true;
        }

        // init date picker
        $('.date-picker').each(function () {
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
                drops: 'down',
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
            });
            $(this).val('').trigger('change');
        })

        // mask money
        $.fn.initMaskMoney2();

        $('#btn-apply-filter').on('click', function () {
            let dataParams1 = {};
            if ($boxLease.val() && $boxLease.val().length > 0) {
                dataParams1['delivery_pa_asset__delivery_sub__order_delivery__lease_order_id__in'] = $boxLease.val().join(',');
            }
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': $urlFact.attr('data-asset-status-lease'),
                    'method': 'GET',
                    'data': dataParams1,
                    isLoading: true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('fixed_asset_status_lease_list') && Array.isArray(data.fixed_asset_status_lease_list)) {
                            $table.DataTable().clear().draw();
                            $table.DataTable().rows.add(data.fixed_asset_status_lease_list).draw();
                            WindowControl.hideLoading();
                        }
                    }
                }
            )
        });

    });
});