$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-pipeline-group');
        let boxEmployee = $('#box-report-pipeline-employee');
        let boxQuarter = $('#box-report-pipeline-quarter');
        let boxMonth = $('#box-report-pipeline-month');
        let boxFrom = $('#report-pipeline-date-from');
        let boxTo = $('#report-pipeline-date-to');
        let checkWin100 = $('#checkbox-show-win-100');
        let eleAreaPeriodAll = $('#area-period-all');
        let eleFiscalYear = $('#data-fiscal-year');
        let btnView = $('#btn-view');
        let $table = $('#table_report_pipeline_list');
        let dataQuarter = JSON.parse($('#filter_quarter').text());
        let dataMonth = JSON.parse($('#filter_month').text());
        let eleTrans = $('#app-trans-factory');

        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                autoWidth: true,
                scrollX: true,
                pageLength: 50,
                columns: [  // 100,200,200,300,150,100,125,125,225,225,225,125,100,125,125 (2500p)
                    {
                        targets: 0,
                        width: '4%',
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
                        width: '8%',
                        render: (data, type, row) => {
                            return `<div class="row"><span class="badge badge-primary badge-outline">${row?.['employee_inherit']?.['full_name'] ? row?.['employee_inherit']?.['full_name'] : ''}</span></div>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '8%',
                        render: (data, type, row) => {
                            return `<div class="row"><span class="badge badge-soft-primary">${row?.['opportunity']?.['code'] ? row?.['opportunity']?.['code'] : ''}</span></div>`;
                        }
                    },
                    {
                        targets: 3,
                        width: '12%',
                        render: (data, type, row) => {
                            return `<p>${row?.['opportunity']?.['customer']?.['title'] ? row?.['opportunity']?.['customer']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '6%',
                        render: (data, type, row) => {
                            return `<p>${row?.['opportunity']?.['stage']?.['indicator'] ? row?.['opportunity']?.['stage']?.['indicator'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '4%',
                        render: (data, type, row) => {
                            if ([0, 1, 2].includes(row?.['type_group_by'])) {
                                return `<p></p>`;
                            } else {
                                return `<p>${row?.['opportunity']?.['win_rate'] ? row?.['opportunity']?.['win_rate'] : '0'} %</p>`;
                            }
                        }
                    },
                    {
                        targets: 6,
                        width: '5%',
                        render: (data, type, row) => {
                            if (row?.['opportunity']?.['open_date']) {
                                return `<p>${moment(row?.['opportunity']?.['open_date'] ? row?.['opportunity']?.['open_date'] : '').format('DD/MM/YYYY')}</p>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 7,
                        width: '5%',
                        render: (data, type, row) => {
                            if (row?.['opportunity']?.['close_date']) {
                                return `<p>${moment(row?.['opportunity']?.['close_date'] ? row?.['opportunity']?.['close_date'] : '').format('DD/MM/YYYY')}</p>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 8,
                        width: '9%',
                        render: (data, type, row) => {
                            if ([1, 2].includes(row?.['type_group_by'])) {
                                return `<b><span class="mask-money table-row-value" data-init-money="${parseFloat(row?.['opportunity']?.['value'])}"></span></b>`;
                            }
                            return `<span class="mask-money table-row-value" data-init-money="${parseFloat(row?.['opportunity']?.['value'])}"></span>`;
                        }
                    },
                    {
                        targets: 9,
                        width: '9%',
                        render: (data, type, row) => {
                            if ([1, 2].includes(row?.['type_group_by'])) {
                                return `<b><span class="mask-money table-row-forecast-value" data-init-money="${parseFloat(row?.['opportunity']?.['forecast_value'])}"></span></b>`;
                            }
                            return `<span class="mask-money table-row-forecast-value" data-init-money="${parseFloat(row?.['opportunity']?.['forecast_value'])}"></span>`;
                        }
                    },
                    {
                        targets: 10,
                        width: '9%',
                        render: (data, type, row) => {
                            if ([1, 2].includes(row?.['type_group_by'])) {
                                return `<b><span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['opportunity']?.['gross_profit'])}"></span></b>`;
                            }
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['opportunity']?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 11,
                        width: '5%',
                        render: (data, type, row) => {
                            if ([1, 2].includes(row?.['type_group_by'])) {
                                return `<b><p>${row?.['opportunity']?.['call'] ? row?.['opportunity']?.['call'] : '0'}</p></b>`;
                            }
                            return `<p>${row?.['opportunity']?.['call'] ? row?.['opportunity']?.['call'] : '0'}</p>`;
                        }
                    },
                    {
                        targets: 12,
                        width: '4%',
                        render: (data, type, row) => {
                            if ([1, 2].includes(row?.['type_group_by'])) {
                                return `<b><p>${row?.['opportunity']?.['email'] ? row?.['opportunity']?.['email'] : '0'}</p></b>`;
                            }
                            return `<p>${row?.['opportunity']?.['email'] ? row?.['opportunity']?.['email'] : '0'}</p>`;
                        }
                    },
                    {
                        targets: 13,
                        width: '5%',
                        render: (data, type, row) => {
                            if ([1, 2].includes(row?.['type_group_by'])) {
                                return `<b><p>${row?.['opportunity']?.['meeting'] ? row?.['opportunity']?.['meeting'] : '0'}</p></b>`;
                            }
                            return `<p>${row?.['opportunity']?.['meeting'] ? row?.['opportunity']?.['meeting'] : '0'}</p>`;
                        }
                    },
                    {
                        targets: 14,
                        width: '5%',
                        render: (data, type, row) => {
                            if ([1, 2].includes(row?.['type_group_by'])) {
                                return `<b><p>${row?.['opportunity']?.['document'] ? row?.['opportunity']?.['document'] : '0'}</p></b>`;
                            }
                            return `<p>${row?.['opportunity']?.['document'] ? row?.['opportunity']?.['document'] : '0'}</p>`;
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
            let result = [];
            let dataGroup = {};
            let dataGroupTotal = {};
            let dataGroupWinRate = {};
            let dataGroupCall = {};
            let dataGroupEmail = {};
            let dataGroupMeeting = {};
            let dataGroupDocument = {};
            let dataEmployee = {};
            let dataEmployeeTotal = {};
            let dataEmployeeWinRate = {};
            let dataEmployeeCall = {};
            let dataEmployeeEmail = {};
            let dataEmployeeMeeting = {};
            let dataEmployeeDocument = {};
            // total
            let totalValue = 0;
            let totalForecastValue = 0;
            let totalGrossProfit = 0;
            let totalWinRate = 0;
            let totalCall = 0;
            let totalEmail = 0;
            let totalMeeting = 0;
            let totalDocument = 0;
            let isShowWin100 = checkWin100[0].checked;
            for (let data of dataList) {
                if (isShowWin100 === false) {  // if not check show data have 100% win rate then pass
                    if (data?.['opportunity']?.['win_rate']) {
                        if (data?.['opportunity']?.['win_rate'] === 100) {
                            continue;
                        }
                    }
                }
                if (data?.['opportunity']?.['value']) {
                    totalValue += data?.['opportunity']?.['value'];
                }
                if (data?.['opportunity']?.['forecast_value']) {
                    totalForecastValue += data?.['opportunity']?.['forecast_value'];
                }
                if (data?.['opportunity']?.['gross_profit']) {
                    totalGrossProfit += data?.['opportunity']?.['gross_profit'];
                }
                if (data?.['opportunity']?.['win_rate']) {
                    totalWinRate += data?.['opportunity']?.['win_rate'];
                }
                if (data?.['opportunity']?.['call']) {
                    totalCall += data?.['opportunity']?.['call'];
                }
                if (data?.['opportunity']?.['email']) {
                    totalEmail += data?.['opportunity']?.['email'];
                }
                if (data?.['opportunity']?.['meeting']) {
                    totalMeeting += data?.['opportunity']?.['meeting'];
                }
                if (data?.['opportunity']?.['document']) {
                    totalDocument += data?.['opportunity']?.['document'];
                }
                // group setup
                if (data?.['group']?.['id']) {
                    // data group
                    if (!dataGroup.hasOwnProperty(data?.['group']?.['id'])) {
                        dataGroup[data?.['group']?.['id']] = data?.['group'];
                    }
                    // data group total
                    if (!dataGroupTotal.hasOwnProperty(data?.['group']?.['id'])) {
                        dataGroupTotal[data?.['group']?.['id']] = {'value': 0, 'forecast_value': 0, 'gross_profit': 0}
                        if (data?.['opportunity']?.['value']) {
                            dataGroupTotal[data?.['group']?.['id']]['value'] = data?.['opportunity']?.['value'];
                        }
                        if (data?.['opportunity']?.['forecast_value']) {
                            dataGroupTotal[data?.['group']?.['id']]['forecast_value'] = data?.['opportunity']?.['forecast_value'];
                        }
                        if (data?.['opportunity']?.['gross_profit']) {
                            dataGroupTotal[data?.['group']?.['id']]['gross_profit'] = data?.['opportunity']?.['gross_profit'];
                        }
                    } else {
                        if (data?.['opportunity']?.['value']) {
                            dataGroupTotal[data?.['group']?.['id']]['value'] += data?.['opportunity']?.['value'];
                        }
                        if (data?.['opportunity']?.['forecast_value']) {
                            dataGroupTotal[data?.['group']?.['id']]['forecast_value'] += data?.['opportunity']?.['forecast_value'];
                        }
                        if (data?.['opportunity']?.['gross_profit']) {
                            dataGroupTotal[data?.['group']?.['id']]['gross_profit'] += data?.['opportunity']?.['gross_profit'];
                        }
                    }
                    // data group win rate
                    if (!dataGroupWinRate.hasOwnProperty(data?.['group']?.['id'])) {
                        dataGroupWinRate[data?.['group']?.['id']] = data?.['opportunity']?.['win_rate'];
                    } else {
                        dataGroupWinRate[data?.['group']?.['id']] += data?.['opportunity']?.['win_rate'];
                    }
                    // data group call
                    if (!dataGroupCall.hasOwnProperty(data?.['group']?.['id'])) {
                        dataGroupCall[data?.['group']?.['id']] = data?.['opportunity']?.['call'];
                    } else {
                        dataGroupCall[data?.['group']?.['id']] += data?.['opportunity']?.['call'];
                    }
                    // data group email
                    if (!dataGroupEmail.hasOwnProperty(data?.['group']?.['id'])) {
                        dataGroupEmail[data?.['group']?.['id']] = data?.['opportunity']?.['email'];
                    } else {
                        dataGroupEmail[data?.['group']?.['id']] += data?.['opportunity']?.['email'];
                    }
                    // data group meeting
                    if (!dataGroupMeeting.hasOwnProperty(data?.['group']?.['id'])) {
                        dataGroupMeeting[data?.['group']?.['id']] = data?.['opportunity']?.['meeting'];
                    } else {
                        dataGroupMeeting[data?.['group']?.['id']] += data?.['opportunity']?.['meeting'];
                    }
                    // data group document
                    if (!dataGroupDocument.hasOwnProperty(data?.['group']?.['id'])) {
                        dataGroupDocument[data?.['group']?.['id']] = data?.['opportunity']?.['document'];
                    } else {
                        dataGroupDocument[data?.['group']?.['id']] += data?.['opportunity']?.['document'];
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
                        dataEmployeeTotal[data?.['employee_inherit']?.['id']] = {'value': 0, 'forecast_value': 0, 'gross_profit': 0}
                        if (data?.['opportunity']?.['value']) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']]['value'] = data?.['opportunity']?.['value'];
                        }
                        if (data?.['opportunity']?.['forecast_value']) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']]['forecast_value'] = data?.['opportunity']?.['forecast_value'];
                        }
                        if (data?.['opportunity']?.['gross_profit']) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']]['gross_profit'] = data?.['opportunity']?.['gross_profit'];
                        }
                    } else {
                        if (data?.['opportunity']?.['value']) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']]['value'] += data?.['opportunity']?.['value'];
                        }
                        if (data?.['opportunity']?.['forecast_value']) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']]['forecast_value'] += data?.['opportunity']?.['forecast_value'];
                        }
                        if (data?.['opportunity']?.['gross_profit']) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']]['gross_profit'] += data?.['opportunity']?.['gross_profit'];
                        }
                    }
                    // data employee win rate
                    if (!dataEmployeeWinRate.hasOwnProperty(data?.['employee_inherit']?.['id'])) {
                        dataEmployeeWinRate[data?.['employee_inherit']?.['id']] = data?.['opportunity']?.['win_rate'];
                    } else {
                        dataEmployeeWinRate[data?.['employee_inherit']?.['id']] += data?.['opportunity']?.['win_rate'];
                    }
                    // data employee call
                    if (!dataEmployeeCall.hasOwnProperty(data?.['employee_inherit']?.['id'])) {
                        dataEmployeeCall[data?.['employee_inherit']?.['id']] = data?.['opportunity']?.['call'];
                    } else {
                        dataEmployeeCall[data?.['employee_inherit']?.['id']] += data?.['opportunity']?.['call'];
                    }
                    // data employee email
                    if (!dataEmployeeEmail.hasOwnProperty(data?.['employee_inherit']?.['id'])) {
                        dataEmployeeEmail[data?.['employee_inherit']?.['id']] = data?.['opportunity']?.['email'];
                    } else {
                        dataEmployeeEmail[data?.['employee_inherit']?.['id']] += data?.['opportunity']?.['email'];
                    }
                    // data employee meeting
                    if (!dataEmployeeMeeting.hasOwnProperty(data?.['employee_inherit']?.['id'])) {
                        dataEmployeeMeeting[data?.['employee_inherit']?.['id']] = data?.['opportunity']?.['meeting'];
                    } else {
                        dataEmployeeMeeting[data?.['employee_inherit']?.['id']] += data?.['opportunity']?.['meeting'];
                    }
                    // data employee document
                    if (!dataEmployeeDocument.hasOwnProperty(data?.['employee_inherit']?.['id'])) {
                        dataEmployeeDocument[data?.['employee_inherit']?.['id']] = data?.['opportunity']?.['document'];
                    } else {
                        dataEmployeeDocument[data?.['employee_inherit']?.['id']] += data?.['opportunity']?.['document'];
                    }
                }
            }
            let dataTotal = {
                'opportunity': {
                    'value': totalValue,
                    'forecast_value': totalForecastValue,
                    'gross_profit': totalGrossProfit,
                    'call': totalCall,
                    'email': totalEmail,
                    'meeting': totalMeeting,
                    'document': totalDocument,
                },
                'group': {'title': eleTrans.attr('data-total')},
                'type_group_by': 0,  // total
            }
            result.push(dataTotal);  // push data total
            for (let groupKey in dataGroup) {  // push data group
                result.push({
                    'group': dataGroup[groupKey],
                    'opportunity': {
                        'value': dataGroupTotal?.[groupKey]?.['value'],
                        'forecast_value': dataGroupTotal?.[groupKey]?.['forecast_value'],
                        'gross_profit': dataGroupTotal?.[groupKey]?.['gross_profit'],
                        // 'win_rate': dataGroupWinRate?.[groupKey],
                        'call': dataGroupCall?.[groupKey],
                        'email': dataGroupEmail?.[groupKey],
                        'meeting': dataGroupMeeting?.[groupKey],
                        'document': dataGroupDocument?.[groupKey],
                    },
                    'type_group_by': 1,  // group
                });
                for (let employeeKey in dataEmployee) {  // push data employee
                    if (dataEmployee[employeeKey]?.['group_id'] === groupKey) {
                        result.push({
                            'employee_inherit': dataEmployee[employeeKey],
                            'opportunity': {
                                'value': dataEmployeeTotal?.[employeeKey]?.['value'],
                                'forecast_value': dataEmployeeTotal?.[employeeKey]?.['forecast_value'],
                                'gross_profit': dataEmployeeTotal?.[employeeKey]?.['gross_profit'],
                                // 'win_rate': dataEmployeeWinRate?.[employeeKey],
                                'call': dataEmployeeCall?.[employeeKey],
                                'email': dataEmployeeEmail?.[employeeKey],
                                'meeting': dataEmployeeMeeting?.[employeeKey],
                                'document': dataEmployeeDocument?.[employeeKey],
                            },
                            'type_group_by': 2,  // employee
                        });
                        for (let data of dataList) {  // push data opp
                            if (data?.['employee_inherit']?.['id'] === employeeKey) {
                                data['group'] = {};
                                data['employee_inherit'] = {};
                                if (isShowWin100 === false) {  // if not check show data have 100% win rate then pass
                                    if (data?.['opportunity']?.['win_rate']) {
                                        if (data?.['opportunity']?.['win_rate'] === 100) {
                                            continue;
                                        }
                                    }
                                }
                                result.push(data);
                            }
                        }
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
                            loadBoxQuarter();
                            loadBoxMonth();
                            let currentDate = new Date();
                            let currentMonth = currentDate.getMonth() + 1;
                            boxMonth.val(currentMonth).trigger('change');
                            btnView.click();
                        }
                    }
                }
            )
        }

        function getFiscalYearEndDate() {
            let endDateFY = '';
            if (eleFiscalYear.val()) {
                let dataFiscalYear = JSON.parse(eleFiscalYear.val());
                if (dataFiscalYear.length > 0) {
                    let startDateFY = new Date(dataFiscalYear[0]?.['start_date']);
                    endDateFY = new Date(startDateFY);
                    // Add 12 months to the start date
                    endDateFY.setMonth(startDateFY.getMonth() + 12);
                    // Subtract 1 day to get the last day of the fiscal year
                    endDateFY.setDate(endDateFY.getDate() - 1);
                    // Format the end date as 'YYYY-MM-DD'
                    endDateFY = endDateFY.toISOString().slice(0, 10);
                    return endDateFY;
                }
            }
            return endDateFY;
        }

        function getAllMonthsFiscalYear() {
            let months = [];
            if (eleFiscalYear.val()) {
                let dataFiscalYear = JSON.parse(eleFiscalYear.val());
                if (dataFiscalYear.length > 0) {
                    let currentDate = new Date();
                    let currentYear = currentDate.getFullYear();
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
            let resultReverse = [];
            let dataMonths = getAllMonthsFiscalYear();
            for (let monthYear of dataMonths) {
                const [year, month] = monthYear.split('-').map(Number);
                result.push({
                    year,
                    month,
                });
            }
            resultReverse = result.reverse();
            return resultReverse;
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

        function getDateFrom() {
            let formattedStartDate = boxFrom.val();
            formattedStartDate = convertDateFormat(formattedStartDate);
            return formattedStartDate;
        }

        function getDateTo() {
            let formattedEndDate = boxTo.val();
            formattedEndDate = convertDateFormat(formattedEndDate);
            return formattedEndDate;
        }

        function convertDateFormat(inputDate) {
            // Split the input date string into day, month, and year
            let parts = inputDate.split('/');
            // Create a new Date object using the parts (month is 0-based, so subtract 1)
            let dateObject = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
            // Format the date to 'YYYY-MM-DD HH:mm:ss'
            return dateObject.toISOString().slice(0, 19).replace('T', ' ');
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

        function loadBoxQuarter() {
            if (eleFiscalYear.val()) {
                let data = [];
                let dataReverse = [];
                let dataFiscalYear = JSON.parse(eleFiscalYear.val());
                if (dataFiscalYear.length > 0) {
                    let currentDate = new Date();
                    let currentYear = currentDate.getFullYear();
                    for (let fiscal of dataFiscalYear) {
                        let startDateFY = fiscal?.['start_date'];
                        let dateObject = new Date(startDateFY);
                        let year = dateObject.getFullYear();
                        if (year === currentYear) {
                            for (let quarter of dataQuarter) {
                                data.push({'id': quarter[0], 'title': quarter[1], 'year': year})
                            }
                            dataReverse = data.reverse();
                            boxQuarter.empty();
                            boxQuarter.initSelect2({
                                data: dataReverse,
                                'allowClear': true,
                                templateResult: function (state) {
                                    let groupHTML = `<span class="badge badge-soft-success ml-2">${state?.['data']?.['year'] ? state?.['data']?.['year'] : "_"}</span>`
                                    return $(`<span>${state.text} ${groupHTML}</span>`);
                                },
                            });
                            break;
                        }
                    }
                }
            }
        }

        function loadBoxMonth() {
            let data = [];
            let dataMonths = parseMonthJSON();
            for (let monthYear of dataMonths) {
                data.push({
                    'id': monthYear?.['month'],
                    'title': dataMonth[monthYear?.['month'] - 1][1],
                    'month': monthYear?.['month'],
                    'year': monthYear?.['year']
                })
            }
            boxMonth.empty();
            boxMonth.initSelect2({
                data: data,
                'allowClear': true,
                templateResult: function (state) {
                    let groupHTML = `<span class="badge badge-soft-success ml-2">${state?.['data']?.['year'] ? state?.['data']?.['year'] : "_"}</span>`
                    return $(`<span>${state.text} ${groupHTML}</span>`);
                },
            });
        }

        $('#btn-collapse').click(function () {
            $(this.querySelector('.collapse-icon')).toggleClass('fa-angle-double-up fa-angle-double-down');
        });

        // load init
        function initData() {
            boxGroup.initSelect2({'allowClear': true,});
            loadBoxEmployee();
            storeDataFiscalYear();
        }

        initData();

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
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
            });
            $(this).val('').trigger('change');
        })

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

        $('input[type=radio].check-period').on('click', function () {
            for (let ele of this.closest('.area-period-all').querySelectorAll('.area-period-element')) {
                ele.setAttribute('disabled', 'true');
            }
            for (let ele of this.closest('.area-period').querySelectorAll('.area-period-element')) {
                ele.removeAttribute('disabled');
            }
        });

        btnView.on('click', function () {
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['employee_inherit__group_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val()) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            let eleCheck = eleAreaPeriodAll[0].querySelector('.check-period:checked');
            if (eleCheck.classList.contains('check-quarter')) {  // quarter
                if (boxQuarter.val()) {
                    let {startDate, endDate} = getQuarterRange(parseInt(boxQuarter.val()));
                    dataParams['opportunity__close_date__gte'] = startDate;
                    dataParams['opportunity__close_date__lte'] = endDate;
                }
            }
            if (eleCheck.classList.contains('check-month')) {  // month
                if (boxMonth.val()) {
                    let dataMonth = SelectDDControl.get_data_from_idx(boxMonth, boxMonth.val());
                    if (dataMonth) {
                        let {startDate, endDate} = getMonthRange(parseInt(boxMonth.val()), parseInt(dataMonth?.['year']));
                        dataParams['opportunity__close_date__gte'] = startDate;
                        dataParams['opportunity__close_date__lte'] = endDate;
                    }
                }
            }
            if (eleCheck.classList.contains('check-custom')) {  // custom
                if (boxFrom.val()) {
                    let startDate = getDateFrom();
                    dataParams['opportunity__close_date__gte'] = startDate;
                }
                if (boxTo.val()) {
                    let endDate = getDateTo();
                    dataParams['opportunity__close_date__lte'] = endDate;
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
                        if (data.hasOwnProperty('report_pipeline_list') && Array.isArray(data.report_pipeline_list)) {
                            setupDataLoadTable(data.report_pipeline_list);
                        }
                    }
                }
            )
        });


    });
});