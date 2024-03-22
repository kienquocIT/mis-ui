$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-revenue-group');
        let boxEmployee = $('#box-report-revenue-employee');
        let btnView = $('#btn-view');
        let eleRevenue = $('#report-revenue-revenue');
        let eleGrossProfit = $('#report-revenue-gross-profit');
        let eleNetIncome = $('#report-revenue-net-income');
        let $table = $('#table_report_revenue_list');
        let $urlFact = $('#app-url-factory');
        let $transFact = $('#app-trans-factory');
        let eleFiscalYear = $('#data-fiscal-year');

        function loadDbl(data) {
            $table.DataTableDefault({
                ajax: {
                    url: $table.attr('data-url'),
                    data: {
                        "is_initial": false,
                        "group_inherit__is_delete": false,
                    },
                    // dataSrc: 'data.report_revenue_list',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            let dataResult = resp.data['report_revenue_list'] ? resp.data['report_revenue_list'] : [];
                            storeLoadInitByDataFiscalYear();
                            return dataResult;
                        }
                        return [];
                    },
                },
                data: data ? data : [],
                autoWidth: true,
                scrollX: true,
                pageLength: 50,
                cusFilter: [
                    {
                        dataUrl: $urlFact.attr('data-filter_so'),
                        keyResp: 'sale_order_list',
                        keyText: 'title',
                        keyParam: "sale_order_id",
                        placeholder: $transFact.attr('data-filter-so'),
                    },
                    {
                        dataUrl: $urlFact.attr('data-filter_customer'),
                        keyResp: 'account_sale_list',
                        keyText: 'name',
                        keyParam: "sale_order__customer_id",
                        placeholder: $transFact.attr('data-filter-customer'),
                    },
                ],
                columns: [  // 150,200,150,100,300,350,250,250,250 (2000p)
                    {
                        targets: 0,
                        width: '7.5%',
                        render: (data, type, row) => {
                            return `<div class="row"><span class="badge badge-primary">${row?.['sale_order']?.['employee_inherit']?.['code'] ? row?.['sale_order']?.['employee_inherit']?.['code'] : ''}</span></div>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<div class="row"><span class="badge badge-primary badge-outline">${row?.['sale_order']?.['employee_inherit']?.['full_name'] ? row?.['sale_order']?.['employee_inherit']?.['full_name'] : ''}</span></div>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '7.5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['code'] ? row?.['sale_order']?.['code'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        width: '5%',
                        render: (data, type, row) => {
                            if (row?.['date_approved']) {
                                return `<p>${moment(row?.['date_approved'] ? row?.['date_approved'] : '').format('DD/MM/YYYY')}</p>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 4,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['title'] ? row?.['sale_order']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '17.5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['customer']?.['title'] ? row?.['sale_order']?.['customer']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-net-income" data-init-money="${parseFloat(row?.['net_income'])}"></span>`;
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                    loadTotal();
                },
            });
        }

        function loadTotal() {
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
        loadDbl();

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
                                    $.fn.callAjax2({
                                            'url': $table.attr('data-url'),
                                            'method': $table.attr('data-method'),
                                            'data': {
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

        function loadBoxEmployee() {
            boxEmployee.empty();
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['group_id__in'] = boxGroup.val().join(',');
            }
            boxEmployee.initSelect2({
                'dataParams': dataParams,
                'allowClear': true,
            });
        }

        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        // load init
        function initData() {
            boxGroup.initSelect2({'allowClear': true,});
            loadBoxEmployee();
            btnView.click();
        }

        initData();

        // run datetimepicker
        $('input[type=text].date-picker').daterangepicker({
            minYear: 1901,
            timePicker: true,
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY'
            }
        });
        $('input[type=text].date-picker').val(null).trigger('change');

        // mask money
        $.fn.initMaskMoney2();

        // Events
        boxGroup.on('change', function() {
            loadBoxEmployee();
            $table.DataTable().clear().draw();
            loadTotal();
        });

        boxEmployee.on('change', function() {
            $table.DataTable().clear().draw();
            loadTotal();
        });

        btnView.on('click', function () {
            let dataParams = {};
            dataParams['is_initial'] = false;
            dataParams['group_inherit__is_delete'] = false;
            if (boxGroup.val()) {
                dataParams['employee_inherit__group_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val()) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            let date = $('#report-revenue-date-approved').val();
            if (date) {
                let dateStrings = date.split(' - ');
                let dateStart = moment(dateStrings[0], 'DD/MM/YYYY').format('YYYY-MM-DD');
                let dateEnd = moment(dateStrings[1], 'DD/MM/YYYY').format('YYYY-MM-DD');
                let datesFormat = formatStartEndDate(dateStart, dateEnd);
                dataParams['date_approved__gte'] = datesFormat?.['startDate'];
                dataParams['date_approved__lte'] = datesFormat?.['endDate'];
            }
            $.fn.callAjax2({
                    'url': $table.attr('data-url'),
                    'method': $table.attr('data-method'),
                    'data': dataParams,
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
        });


    });
});