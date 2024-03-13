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
                columns: [  // 250,250,200,250,250,150,250,250,150 (2000p)
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
                            return `<div class="row"><span class="badge badge-primary badge-outline">${row?.['employee_inherit']?.['full_name'] ? row?.['employee_inherit']?.['full_name'] : ''}</span></div>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<div class="row"><span class="badge badge-soft-primary">${row?.['employee_inherit']?.['code'] ? row?.['employee_inherit']?.['code'] : ''}</span></div>`;
                        }
                    },
                    {
                        targets: 3,
                        width: '12.5%',
                        render: (data, type, row) => {
                            if (row?.['type_group_by'] === 1) {  // type is group
                                return `<b><span class="mask-money table-row-revenue-plan" data-init-money="${parseFloat(row?.['revenue_plan'])}"></span></b>`;
                            }
                            return `<span class="mask-money table-row-revenue-plan" data-init-money="${parseFloat(row?.['revenue_plan'])}"></span>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '12.5%',
                        render: (data, type, row) => {
                            if (row?.['type_group_by'] === 1) {  // type is group
                                return `<b><span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span></b>`;
                            }
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '7.5%',
                        render: (data, type, row) => {
                            if (row?.['type_group_by'] === 1) {  // type is group
                                return `<b><p>${parseFloat(row?.['revenue_ratio'])} %</p></b>`;
                            }
                            return `<p>${parseFloat(row?.['revenue_ratio'])} %</p>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '12.5',
                        render: (data, type, row) => {
                            if (row?.['type_group_by'] === 1) {  // type is group
                                return `<b><span class="mask-money table-row-profit-plan" data-init-money="${parseFloat(row?.['gross_profit_plan'])}"></span></b>`;
                            }
                            return `<span class="mask-money table-row-profit-plan" data-init-money="${parseFloat(row?.['gross_profit_plan'])}"></span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '12.5%',
                        render: (data, type, row) => {
                            if (row?.['type_group_by'] === 1) {  // type is group
                                return `<b><span class="mask-money table-row-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span></b>`;
                            }
                            return `<span class="mask-money table-row-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '7.5%',
                        render: (data, type, row) => {
                            if (row?.['type_group_by'] === 1) {  // type is group
                                return `<b><p>${parseFloat(row?.['gross_profit_ratio'])} %</p></b>`;
                            }
                            return `<p>${parseFloat(row?.['gross_profit_ratio'])} %</p>`;
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
                let totalRevenuePlan = 0;
                let totalProfitPlan = 0;
                let totalRevenueRate = 0;
                let totalProfitRate = 0;
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
                for (let empPlanKey in dataEmployeePlan) {
                    if (dataEmployeePlan[empPlanKey]?.[year]) {
                        if (detail.includes('p')) {  // period
                            totalRevenuePlan += dataEmployeePlan[empPlanKey]?.[year]?.['revenue_year'];
                            totalProfitPlan += dataEmployeePlan[empPlanKey]?.[year]?.['profit_year'];
                        }
                        if (detail.includes('q')) {  // quarter
                            let parts = detail.split('-');
                            if (parts.length > 1) {
                                let quarter = parseInt(parts[1]);
                                if (dataEmployeePlan[empPlanKey]?.[year]?.['revenue_quarter'].length >= 4) {
                                    totalRevenuePlan += dataEmployeePlan[empPlanKey]?.[year]?.['revenue_quarter'][quarter];
                                }
                                if (dataEmployeePlan[empPlanKey]?.[year]?.['profit_quarter'].length >= 4) {
                                    totalProfitPlan += dataEmployeePlan[empPlanKey]?.[year]?.['profit_quarter'][quarter];
                                }
                            }
                        }
                        if (detail.includes('m')) {  // month
                            let parts = detail.split('-');
                            if (parts.length > 1) {
                                let month = parseInt(parts[1]);
                                if (dataEmployeePlan[empPlanKey]?.[year]?.['revenue_month'].length >= 12) {
                                    totalRevenuePlan += dataEmployeePlan[empPlanKey]?.[year]?.['revenue_month'][month];
                                }
                                if (dataEmployeePlan[empPlanKey]?.[year]?.['profit_month'].length >= 12) {
                                    totalProfitPlan += dataEmployeePlan[empPlanKey]?.[year]?.['profit_month'][month];
                                }
                            }
                        }
                    }
                }
                if (totalRevenuePlan !== 0) {
                    totalRevenueRate = Math.round(totalRevenue / totalRevenuePlan * 100);
                }
                if (totalProfitPlan !== 0) {
                    totalProfitRate = Math.round(totalProfit / totalProfitPlan * 100);
                }
                let dataTotal = {  // push data total
                    'group': {'title': eleTrans.attr('data-total')},
                    'revenue': totalRevenue,
                    'revenue_plan': totalRevenuePlan,
                    'revenue_ratio': totalRevenueRate,
                    'gross_profit': totalProfit,
                    'gross_profit_plan': totalProfitPlan,
                    'gross_profit_ratio': totalProfitRate,
                    'type_group_by': 0,  // total
                }
                result.push(dataTotal);
                for (let groupKey in dataGroup) {  // push data group
                    let totalGrRevenuePlan = 0;
                    let totalGrProfitPlan = 0;
                    let totalGrRevenueRate = 0;
                    let totalGrProfitRate = 0;
                    for (let empPlanKey in dataEmployeePlan) {
                        if (dataEmployeePlan[empPlanKey]?.[year]) {
                            if (dataEmployeePlan[empPlanKey]?.['group_id'] === groupKey) {
                                if (detail.includes('p')) {  // period
                                    totalGrRevenuePlan += dataEmployeePlan[empPlanKey]?.[year]?.['revenue_year'];
                                    totalGrProfitPlan += dataEmployeePlan[empPlanKey]?.[year]?.['profit_year'];
                                }
                                if (detail.includes('q')) {  // quarter
                                    let parts = detail.split('-');
                                    if (parts.length > 1) {
                                        let quarter = parseInt(parts[1]);
                                        if (dataEmployeePlan[empPlanKey]?.[year]?.['revenue_quarter'].length >= 4) {
                                            totalGrRevenuePlan += dataEmployeePlan[empPlanKey]?.[year]?.['revenue_quarter'][quarter];
                                        }
                                        if (dataEmployeePlan[empPlanKey]?.[year]?.['profit_quarter'].length >= 4) {
                                            totalGrProfitPlan += dataEmployeePlan[empPlanKey]?.[year]?.['profit_quarter'][quarter];
                                        }
                                    }
                                }
                                if (detail.includes('m')) {  // month
                                    let parts = detail.split('-');
                                    if (parts.length > 1) {
                                        let month = parseInt(parts[1]);
                                        if (dataEmployeePlan[empPlanKey]?.[year]?.['revenue_month'].length >= 12) {
                                            totalGrRevenuePlan += dataEmployeePlan[empPlanKey]?.[year]?.['revenue_month'][month];
                                        }
                                        if (dataEmployeePlan[empPlanKey]?.[year]?.['profit_month'].length >= 12) {
                                            totalGrProfitPlan += dataEmployeePlan[empPlanKey]?.[year]?.['profit_month'][month];
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (totalGrRevenuePlan !== 0) {
                        totalGrRevenueRate = Math.round(dataGroupTotal?.[groupKey]?.['revenue'] / totalGrRevenuePlan * 100);
                    }
                    if (totalGrProfitPlan !== 0) {
                        totalGrProfitRate = Math.round(dataGroupTotal?.[groupKey]?.['gross_profit'] / totalGrProfitPlan * 100);
                    }
                    result.push({
                        'group': dataGroup[groupKey],
                        'revenue': dataGroupTotal?.[groupKey]?.['revenue'],
                        'revenue_plan': totalGrRevenuePlan,
                        'revenue_ratio': totalGrRevenueRate,
                        'gross_profit': dataGroupTotal?.[groupKey]?.['gross_profit'],
                        'gross_profit_plan': totalGrProfitPlan,
                        'gross_profit_ratio': totalGrProfitRate,
                        'type_group_by': 1,
                    });
                    for (let employeeKey in dataEmployee) {  // push data employee
                        if (dataEmployee[employeeKey]?.['group_id'] === groupKey) {
                            let resultEmployee = {
                                'employee_inherit': dataEmployee[employeeKey],
                                'revenue': dataEmployeeTotal?.[employeeKey]?.['revenue'],
                                'gross_profit': dataEmployeeTotal?.[employeeKey]?.['gross_profit'],
                                'type_group_by': 2
                            }
                            // setup data plan
                            let revenuePlan = 0;
                            let profitPlan = 0;
                            if (dataEmployeePlan?.[employeeKey]?.[year]) {
                                if (detail.includes('p')) {  // period
                                    revenuePlan = dataEmployeePlan?.[employeeKey]?.[year]?.['revenue_year'];
                                    profitPlan = dataEmployeePlan?.[employeeKey]?.[year]?.['profit_year'];
                                }
                                if (detail.includes('q')) {  // quarter
                                    let parts = detail.split('-');
                                    if (parts.length > 1) {
                                        let quarter = parseInt(parts[1]);
                                        if (dataEmployeePlan?.[employeeKey]?.[year]?.['revenue_quarter'].length >= 4) {
                                            revenuePlan = dataEmployeePlan?.[employeeKey]?.[year]?.['revenue_quarter'][quarter];
                                        }
                                        if (dataEmployeePlan?.[employeeKey]?.[year]?.['profit_quarter'].length >= 4) {
                                            profitPlan = dataEmployeePlan?.[employeeKey]?.[year]?.['profit_quarter'][quarter];
                                        }
                                    }
                                }
                                if (detail.includes('m')) {  // month
                                    let parts = detail.split('-');
                                    if (parts.length > 1) {
                                        let month = parseInt(parts[1]);
                                        if (dataEmployeePlan?.[employeeKey]?.[year]?.['revenue_month'].length >= 12) {
                                            revenuePlan = dataEmployeePlan?.[employeeKey]?.[year]?.['revenue_month'][month];
                                        }
                                        if (dataEmployeePlan?.[employeeKey]?.[year]?.['profit_month'].length >= 12) {
                                            profitPlan = dataEmployeePlan?.[employeeKey]?.[year]?.['profit_month'][month];
                                        }
                                    }
                                }
                            }
                            resultEmployee['revenue_plan'] = revenuePlan;
                            resultEmployee['gross_profit_plan'] = profitPlan;
                            resultEmployee['revenue_ratio'] = 0;
                            resultEmployee['gross_profit_ratio'] = 0;
                            if (resultEmployee?.['revenue_plan'] !== 0) {
                                resultEmployee['revenue_ratio'] = Math.round(resultEmployee['revenue'] / resultEmployee['revenue_plan'] * 100);
                            }
                            if (resultEmployee?.['gross_profit_plan'] !== 0) {
                                resultEmployee['gross_profit_ratio'] = Math.round(resultEmployee['gross_profit'] / resultEmployee['gross_profit_plan'] * 100);
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
                            btnView.click();
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

        // FORMAT DATE BY MONTH
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

        // FORMAT DATE BY QUARTER
        function getQuarterRange(quarter) {
            if (boxYear.val()) {
                let dataYear = SelectDDControl.get_data_from_idx(boxYear, boxYear.val());
                if (dataYear) {
                    let startDateFY = dataYear?.['start_date'];
                    let dateObject = new Date(startDateFY);
                    let year = dateObject.getFullYear();
                    let month = dateObject.getMonth() + 1;
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
            return {startDate: '', endDate: ''};
        }

        // FORMAT DATE BY YEAR
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

        function getYearRange() {
            if (boxYear.val()) {
                let dataYear = SelectDDControl.get_data_from_idx(boxYear, boxYear.val());
                if (dataYear) {
                    let startDate = dataYear?.['start_date'];
                    let endDate = getFiscalYearEndDate(startDate);
                    let datesFormat = formatStartEndDate(startDate, endDate);
                    return {startDate: datesFormat?.['startDate'], endDate: datesFormat?.['endDate']};
                } else {
                    // Handle invalid input
                    console.error('Invalid year input');
                    return null;
                }
            }
            return null;
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
            boxDetail.val('p-1').trigger('change');
        });

        btnView.on('click', function () {
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['group_inherit_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val()) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            let year = boxYear.val();
            let detail = boxDetail.val();
            if (year && detail) {
                if (detail.includes('p')) {  // period
                    let {startDate, endDate} = getYearRange(parseInt(boxYear.val()));
                    dataParams['date_approved__gte'] = startDate;
                    dataParams['date_approved__lte'] = endDate;
                }
                if (detail.includes('q')) {  // quarter
                    let parts = detail.split('-');
                    if (parts.length > 1) {
                        let quarter = parseInt(parts[1]);
                        let {startDate, endDate} = getQuarterRange(quarter);
                        dataParams['date_approved__gte'] = startDate;
                        dataParams['date_approved__lte'] = endDate;
                    }
                }
                if (detail.includes('m')) {  // month
                    let parts = detail.split('-');
                    if (parts.length > 1) {
                        let month = parseInt(parts[1]);
                        let {startDate, endDate} = getMonthRange(month, parseInt(boxYear.val()));
                        dataParams['date_approved__gte'] = startDate;
                        dataParams['date_approved__lte'] = endDate;
                    }
                }
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
                        if (data.hasOwnProperty('report_general_list') && Array.isArray(data.report_general_list)) {
                            setupDataLoadTable(data.report_general_list);
                        }
                    }
                }
            )
        });


    });
});