$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-customer-group');
        let boxEmployee = $('#box-report-customer-employee');
        let boxCustomer = $('#box-report-customer-customer');
        let boxStart = $('#report-product-date-from');
        let boxEnd = $('#report-product-date-to');
        let btnView = $('#btn-view');
        let eleRevenue = $('#report-customer-revenue');
        let eleGrossProfit = $('#report-customer-gross-profit');
        let eleNetIncome = $('#report-customer-net-income');
        let $table = $('#table_report_customer_list');
        let eleFiscalYear = $('#data-fiscal-year');

        function loadDbl(data) {
            $table.DataTableDefault({
                ajax: {
                    url: $table.attr('data-url'),
                    // dataSrc: 'data.report_customer_list',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            let dataResult = resp.data['report_customer_list'] ? resp.data['report_customer_list'] : [];
                            storeLoadInitByDataFiscalYear();
                            return dataResult;
                        }
                        return [];
                    },
                },
                data: data ? data : [],
                pageLength: 50,
                columns: [
                    {
                        targets: 0,
                        class: 'w-5',
                        render: (data, type, row) => {
                            return `<div class="row"><span class="badge badge-primary">${row?.['customer']?.['code'] ? row?.['customer']?.['code'] : ''}</span></div>`;
                        }
                    },
                    {
                        targets: 1,
                        class: 'w-20',
                        render: (data, type, row) => {
                            return `<p class="text-primary">${row?.['customer']?.['title'] ? row?.['customer']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        class: 'w-15',
                        render: (data, type, row) => {
                            return `<p>${row?.['customer']?.['industry']?.['title'] ? row?.['customer']?.['industry']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        class: 'w-20',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 4,
                        class: 'w-20',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 5,
                        class: 'w-20',
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

        function setupDataLoadTable(dataList) {
            let result = [];
            let dataByCustomer = {};
            for (let data of dataList) {
                if (data?.['customer']?.['id']) {
                    if (!dataByCustomer.hasOwnProperty(data?.['customer']?.['id'])) {
                        dataByCustomer[data?.['customer']?.['id']] = data;
                    } else {
                        dataByCustomer[data?.['customer']?.['id']]['revenue'] += data?.['revenue'];
                        dataByCustomer[data?.['customer']?.['id']]['gross_profit'] += data?.['gross_profit'];
                        dataByCustomer[data?.['customer']?.['id']]['net_income'] += data?.['net_income'];
                    }
                }
            }
            for (let keyCustomer in dataByCustomer) {
                result.push(dataByCustomer[keyCustomer]);
            }
            $table.DataTable().clear().draw();
            $table.DataTable().rows.add(result).draw();
            // init money
            $.fn.initMaskMoney2();
            loadTotal();
            return true;
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
                                                'date_approved__gte': startDate,
                                                'date_approved__lte': endDate,
                                            },
                                            isLoading: true,
                                        }
                                    ).then(
                                        (resp) => {
                                            let data = $.fn.switcherResp(resp);
                                            if (data) {
                                                if (data.hasOwnProperty('report_customer_list') && Array.isArray(data.report_customer_list)) {
                                                    setupDataLoadTable(data.report_customer_list);
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
            boxCustomer.initSelect2({'allowClear': true,});
            loadBoxEmployee();
            loadDbl();
            btnView.click();
        }

        initData();

        // run datetimepicker
        $('input[type=text].date-picker').daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            autoApply: true,
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

        boxCustomer.on('change', function() {
            $table.DataTable().clear().draw();
            loadTotal();
        });

        btnView.on('click', function () {
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['employee_inherit__group_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val()) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            if (boxCustomer.val()) {
                dataParams['customer_id__in'] = boxCustomer.val().join(',');
            }
            if (boxStart.val()) {
                let dateStart = moment(boxStart.val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
                dataParams['date_approved__gte'] = formatStartDate(dateStart);
            }
            if (boxEnd.val()) {
                let dateEnd = moment(boxEnd.val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
                dataParams['date_approved__lte'] = formatEndDate(dateEnd);
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
                        if (data.hasOwnProperty('report_customer_list') && Array.isArray(data.report_customer_list)) {
                            setupDataLoadTable(data.report_customer_list);
                        }
                    }
                }
            )
        });


    });
});