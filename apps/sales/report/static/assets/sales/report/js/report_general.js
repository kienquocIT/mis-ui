$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-general-group');
        let boxEmployee = $('#box-report-general-employee');
        let boxYear = $('#box-report-general-year');
        let boxDetail = $('#box-report-general-detail');
        let eleFiscalYear = $('#data-fiscal-year');
        let btnView = $('#btn-view');
        let $table = $('#table_report_general_list');
        let dataQuarter = JSON.parse($('#filter_quarter').text());
        let dataMonth = JSON.parse($('#filter_month').text());
        let eleTrans = $('#app-trans-factory');

        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                autoWidth: true,
                scrollX: true,
                pageLength: 10,
                columns: [  // 250,250,300,250,250,100,250,250,100 (2000p)
                    {
                        targets: 0,
                        width: '12.5%',
                        render: (data, type, row) => {
                            if (row?.['type_group_by'] === 0) {
                                return `<p>${row?.['group']?.['title'] ? row?.['group']?.['title'] : ''}</p>`;
                            } else {
                                return `<div class="row"><span class="badge badge-primary">${row?.['group']?.['title'] ? row?.['group']?.['title'] : ''}</span></div>`;
                            }
                        }
                    },
                    {
                        targets: 1,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<div class="row"><span class="badge badge-primary  badge-outline">${row?.['employee_inherit']?.['full_name'] ? row?.['employee_inherit']?.['full_name'] : ''}</span></div>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<p>${row?.['employee_inherit']?.['code'] ? row?.['employee_inherit']?.['code'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue-plan" data-init-money="${parseFloat(row?.['revenue_plan'])}"></span>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<p>${parseFloat(row?.['revenue_ratio'])}</p>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '12.5',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-profit-plan" data-init-money="${parseFloat(row?.['gross_profit_plan'])}"></span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<p>${parseFloat(row?.['gross_profit_ratio'])}</p>`;
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                },
            });
        }
        loadDbl();

        function setupDataLoadTable(dataList) {
            let year = boxYear.val();
            let detail = boxDetail.val();
            if (year && detail) {
                let result = [];
                let dataGroup = {};
                let dataGroupTotal = {};
                let dataEmployee = {};
                let dataEmployeeTotal = {};
                let dataEmployeePlan = {}
                // total
                let totalRevenue = 0;
                let totalProfit = 0;
                for (let data of dataList) {
                    totalRevenue += data?.['revenue'];
                    totalProfit += data?.['gross_profit'];
                    // group setup
                    if (data?.['group_inherit']?.['id']) {
                        // data group
                        if (!dataGroup.hasOwnProperty(data?.['group_inherit']?.['id'])) {
                            dataGroup[data?.['group_inherit']?.['id']] = data?.['group_inherit'];
                        }
                        // data group total
                        if (!dataGroupTotal.hasOwnProperty(data?.['group_inherit']?.['id'])) {
                            dataGroupTotal[data?.['group_inherit']?.['id']] = {
                                'revenue': 0, 'revenue_plan': 0, 'revenue_ratio': 0,
                                'gross_profit': 0, 'gross_profit_plan': 0, 'gross_profit_ratio': 0,
                            }
                            if (data?.['revenue']) {
                                dataGroupTotal[data?.['group_inherit']?.['id']]['revenue'] = data?.['revenue'];
                            }
                            if (data?.['gross_profit']) {
                                dataGroupTotal[data?.['group_inherit']?.['id']]['gross_profit'] = data?.['gross_profit'];
                            }
                        } else {
                            if (data?.['revenue']) {
                                dataGroupTotal[data?.['group_inherit']?.['id']]['revenue'] += data?.['revenue'];
                            }
                            if (data?.['gross_profit']) {
                                dataGroupTotal[data?.['group_inherit']?.['id']]['gross_profit'] += data?.['gross_profit'];
                            }
                        }
                    }
                    // employee setup
                    if (data?.['employee_inherit']?.['id']) {
                        // data employee
                        if (!dataEmployee.hasOwnProperty(data?.['employee_inherit']?.['id'])) {
                            dataEmployee[data?.['employee_inherit']?.['id']] = data?.['employee_inherit'];
                        }
                        // data employee total
                        if (!dataEmployeeTotal.hasOwnProperty(data?.['employee_inherit']?.['id'])) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']] = {
                                'revenue': 0, 'revenue_plan': 0, 'revenue_ratio': 0,
                                'gross_profit': 0, 'gross_profit_plan': 0, 'gross_profit_ratio': 0,
                            }
                            if (data?.['revenue']) {
                                dataEmployeeTotal[data?.['employee_inherit']?.['id']]['revenue'] = data?.['revenue'];
                            }
                            if (data?.['gross_profit']) {
                                dataEmployeeTotal[data?.['employee_inherit']?.['id']]['gross_profit'] = data?.['gross_profit'];
                            }
                        } else {
                            if (data?.['revenue']) {
                                dataEmployeeTotal[data?.['employee_inherit']?.['id']]['revenue'] += data?.['revenue'];
                            }
                            if (data?.['gross_profit']) {
                                dataEmployeeTotal[data?.['employee_inherit']?.['id']]['gross_profit'] += data?.['gross_profit'];
                            }
                        }
                        // data employee plan
                        if (!dataEmployeePlan.hasOwnProperty(data?.['employee_inherit']?.['id'])) {
                            dataEmployeePlan[data?.['employee_inherit']?.['id']] = data?.['plan'];
                        }
                    }
                }
                let dataTotal = {
                    'group': {'title': eleTrans.attr('data-total')},
                    'revenue': totalRevenue,
                    'revenue_plan': 0,
                    'revenue_ratio': 0,
                    'gross_profit': totalProfit,
                    'gross_profit_plan': 0,
                    'gross_profit_ratio': 0,
                    'group_by': 0,
                    'type_group_by': 0,  // total
                }
                result.push(dataTotal);  // push data total
                for (let groupKey in dataGroup) {  // push data group
                    result.push({
                        'group': dataGroup[groupKey],
                        'revenue': dataGroupTotal?.[groupKey]?.['revenue'],
                        'revenue_plan': dataGroupTotal?.[groupKey]?.['revenue_plan'],
                        'revenue_ratio': dataGroupTotal?.[groupKey]?.['revenue_ratio'],
                        'gross_profit': dataGroupTotal?.[groupKey]?.['gross_profit'],
                        'gross_profit_plan': dataGroupTotal?.[groupKey]?.['gross_profit_plan'],
                        'gross_profit_ratio': dataGroupTotal?.[groupKey]?.['gross_profit_ratio'],
                        'group_by': 1,
                    });
                    for (let employeeKey in dataEmployee) {  // push data employee
                        if (dataEmployee[employeeKey]?.['group_id'] === groupKey) {
                            let resultEmployee = {
                                'employee_inherit': dataEmployee[employeeKey],
                                'revenue': dataEmployeeTotal?.[employeeKey]?.['revenue'],
                                'gross_profit': dataEmployeeTotal?.[employeeKey]?.['gross_profit'],
                                'group_by': 2
                            }
                            let revenuePlan = 0;
                            let profitPlan = 0;
                            if (detail.includes('p')) {  // period
                                revenuePlan = dataEmployeePlan?.[year]?.['revenue_year'];
                                profitPlan = dataEmployeePlan?.[year]?.['profit_year'];
                            }
                            if (detail.includes('q')) {  // quarter

                            }
                            if (detail.includes('m')) {  // month

                            }
                            resultEmployee['revenue_plan'] = revenuePlan;
                            resultEmployee['gross_profit_plan'] = profitPlan;
                            resultEmployee['revenue_ratio'] = 0;
                            resultEmployee['gross_profit_ratio'] = 0;
                            if (resultEmployee?.['revenue_plan'] !== 0) {
                                resultEmployee['revenue_ratio'] = resultEmployee['revenue'] / resultEmployee['revenue_plan'] * 100;
                            }
                            if (resultEmployee?.['gross_profit_plan'] !== 0) {
                                resultEmployee['gross_profit_ratio'] = resultEmployee['gross_profit'] / resultEmployee['gross_profit_plan'] * 100;
                            }
                            result.push(resultEmployee);
                        }
                    }
                }
                $table.DataTable().clear().draw();
                $table.DataTable().rows.add(result).draw();
                // custom total row
                if ($table.DataTable().data().count() !== 0) {
                    let firstRow = $table.DataTable().row(0).node();
                    $(firstRow).css({
                        'background-color': '#ebf5f5',
                        'color': '#007D88',
                        'font-weight': 'bold'
                    });
                }
                $.fn.initMaskMoney2();
            }
        }

        function storeDataFiscalYear() {
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
                            loadBoxYear();
                            let currentYear = new Date().getFullYear();
                            boxYear.val(currentYear).trigger('change');
                            boxDetail.val('p-1').trigger('change');
                        }
                    }
                }
            )
        }

        function getAllMonthsFiscalYear() {
            let months = [];
            if (eleFiscalYear.val() && boxYear.val()) {
                let dataFiscalYear = JSON.parse(eleFiscalYear.val());
                if (dataFiscalYear.length > 0) {
                    let currentYear = parseInt(boxYear.val());
                    for (let fiscal of dataFiscalYear) {
                        let startDateFY = new Date(fiscal?.['start_date']);
                        let dateObject = new Date(startDateFY);
                        let year = dateObject.getFullYear();
                        let currentDateFY = new Date(startDateFY);
                        if (year === currentYear) {
                            // Loop for 12 months
                            for (let i = 0; i < 12; i++) {
                                let formattedMonth = currentDateFY.toISOString().slice(0, 7);
                                months.push(formattedMonth);
                                // Move to the next month
                                currentDateFY.setMonth(currentDateFY.getMonth() + 1);
                            }
                            break;
                        }
                    }
                }
            }
            return months;
        }

        function parseMonthJSON() {
            let result = [];
            let dataMonths = getAllMonthsFiscalYear();
            for (let monthYear of dataMonths) {
                const [year, month] = monthYear.split('-').map(Number);
                result.push({
                    year,
                    month,
                });
            }
            return result;
        }

        function getMonthRange(month, year) {
            // Ensure month is within valid range (1 to 12)
            if (month < 1 || month > 12) {
                throw new Error('Invalid month');
            }
            // Create the first day of the month
            let startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
            // Create the last day of the next month, then subtract one millisecond to get the last millisecond of the current month
            let endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
            // Format the dates
            let formattedStartDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
            let formattedEndDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
            return {startDate: formattedStartDate, endDate: formattedEndDate};
        }

        function getQuarterRange(quarter) {
            if (eleFiscalYear.val()) {
                let dataFiscalYear = JSON.parse(eleFiscalYear.val());
                if (dataFiscalYear.length > 0) {
                    let currentDate = new Date();
                    let currentYear = currentDate.getFullYear();
                    for (let fiscal of dataFiscalYear) {
                        let startDateFY = fiscal?.['start_date'];
                        let dateObject = new Date(startDateFY);
                        let year = dateObject.getFullYear();
                        let month = dateObject.getMonth() + 1;
                        if (year === currentYear) {
                            // Ensure quarter is within valid range (1 to 4)
                            if (quarter < 1 || quarter > 4) {
                                throw new Error('Invalid quarter');
                            }
                            // Calculate the start and end months of the quarter
                            let startMonth = (quarter - 1) * 3 + month;
                            let endMonth = startMonth + 2;
                            // Create the first day of the quarter
                            let startDate = new Date(Date.UTC(year, startMonth - 1, 1, 0, 0, 0));
                            // Create the last day of the quarter, then subtract one millisecond to get the last millisecond of the last day
                            let endDate = new Date(Date.UTC(year, endMonth, 0, 23, 59, 59, 999));
                            // Format the dates
                            let formattedStartDate = startDate.toISOString().slice(0, 19).replace('T', ' ');
                            let formattedEndDate = endDate.toISOString().slice(0, 19).replace('T', ' ');
                            return {startDate: formattedStartDate, endDate: formattedEndDate};
                        }
                    }
                }
            }
            return {startDate: '', endDate: ''};
        }

        // LOAD BOXS DROPDOWN
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

        function loadBoxYear() {
            if (eleFiscalYear.val()) {
                let data = [];
                let dataFiscalYear = JSON.parse(eleFiscalYear.val());
                if (dataFiscalYear.length > 0) {
                    for (let fiscalYear of dataFiscalYear) {
                        data.push({
                            'id': String(fiscalYear?.['fiscal_year']),
                            'title': String(fiscalYear?.['fiscal_year']),
                            'start_date': String(fiscalYear?.['start_date']),
                        })
                    }
                    boxYear.empty();
                    boxYear.initSelect2({
                        data: data,
                    });
                }
            }
        }

        function loadBoxDetail() {
            let data = [];
            if (boxYear.val()) {
                // period
                data.push({'id': 'p-' + String(1), 'title': eleTrans.attr('data-period'), 'year': boxYear.val()})
                // quarters
                for (let quarter of dataQuarter) {
                    data.push({'id': 'q-' + String(quarter[0]), 'title': quarter[1], 'year': boxYear.val()})
                }
                // months
                let dataMonths = parseMonthJSON();
                for (let monthYear of dataMonths) {
                    data.push({
                        'id': 'm-' + String(monthYear?.['month']),
                        'title': dataMonth[monthYear?.['month'] - 1][1],
                        'month': monthYear?.['month'],
                        'year': monthYear?.['year'],
                    })
                }
            }
            data.push({
                'id': '',
                'title': 'Select...',
                'month': 0,
                'year': 0,
            })
            boxDetail.empty();
            boxDetail.initSelect2({
                data: data,
                templateResult: function (state) {
                    let groupHTML = `<span class="badge badge-soft-success ml-2">${state?.['data']?.['year'] ? state?.['data']?.['year'] : "_"}</span>`
                    return $(`<span>${state.text} ${groupHTML}</span>`);
                },
            });
        }

        // load init
        function initData() {
            boxGroup.initSelect2({'allowClear': true,});
            loadBoxEmployee();
            storeDataFiscalYear();
        }

        initData();


        // run datetimepicker
        $('input[type=text].date-picker').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: true,
            minYear: 2023,
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
        });

        boxEmployee.on('change', function() {
            $table.DataTable().clear().draw();
        });

        boxYear.on('change', function () {
            loadBoxDetail();
        });

        btnView.on('click', function () {
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['employee_inherit__group_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val()) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            // if (boxDetail.val()) {
            //     let dataMonth = SelectDDControl.get_data_from_idx(boxDetail, boxDetail.val());
            //     if (dataMonth) {
            //         let {startDate, endDate} = getMonthRange(parseInt(boxDetail.val()), parseInt(dataMonth?.['year']));
            //         dataParams['opportunity__close_date__gte'] = startDate;
            //         dataParams['opportunity__close_date__lte'] = endDate;
            //     }
            // }
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
                        if (data.hasOwnProperty('report_general_list') && Array.isArray(data.report_general_list)) {
                            setupDataLoadTable(data.report_general_list);
                        }
                    }
                }
            )
        });


    });
});