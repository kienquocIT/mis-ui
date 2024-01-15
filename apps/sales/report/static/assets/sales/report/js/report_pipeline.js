$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-pipeline-group');
        let boxEmployee = $('#box-report-pipeline-employee');
        let boxQuarter = $('#box-report-pipeline-quarter');
        let boxMonth = $('#box-report-pipeline-month');
        let btnView = $('#btn-view');
        let $table = $('#table_report_pipeline_list');
        let dataQuarter = JSON.parse($('#filter_quarter').text());
        let dataMonth = JSON.parse($('#filter_month').text());

        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                autoWidth: true,
                scrollX: true,
                columns: [  // 150,200,150,250,150,100,150,150,150,150,100,100,100,100 (2000p)
                    {
                        targets: 0,
                        width: '7.5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['group']?.['title'] ? row?.['group']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<p>${row?.['employee_inherit']?.['full_name'] ? row?.['employee_inherit']?.['full_name'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '7.5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['opportunity']?.['code'] ? row?.['opportunity']?.['code'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['opportunity']?.['customer']?.['title'] ? row?.['opportunity']?.['customer']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '7.5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['opportunity']?.['stage']?.['indicator'] ? row?.['opportunity']?.['stage']?.['indicator'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['opportunity']?.['win_rate'] ? row?.['opportunity']?.['win_rate'] : '0'} %</p>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '7.5%',
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
                        width: '7.5%',
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
                        width: '7.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-value" data-init-money="${parseFloat(row?.['opportunity']?.['value'])}"></span>`;
                        }
                    },
                    {
                        targets: 9,
                        width: '7.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-forecast-value" data-init-money="${parseFloat(row?.['opportunity']?.['forecast_value'])}"></span>`;
                        }
                    },
                    {
                        targets: 10,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['opportunity']?.['call'] ? row?.['opportunity']?.['call'] : '0'}</p>`;
                        }
                    },
                    {
                        targets: 11,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['opportunity']?.['email'] ? row?.['opportunity']?.['email'] : '0'}</p>`;
                        }
                    },
                    {
                        targets: 12,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['opportunity']?.['meeting'] ? row?.['opportunity']?.['meeting'] : '0'}</p>`;
                        }
                    },
                    {
                        targets: 13,
                        width: '5%',
                        render: (data, type, row) => {
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

        function setupData(dataList) {
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
            let totalWinRate = 0;
            let totalCall = 0;
            let totalEmail = 0;
            let totalMeeting = 0;
            let totalDocument = 0;
            for (let data of dataList) {
                if (data?.['opportunity']?.['value']) {
                    totalValue += data?.['opportunity']?.['value'];
                }
                if (data?.['opportunity']?.['forecast_value']) {
                    totalForecastValue += data?.['opportunity']?.['forecast_value'];
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
                        dataGroupTotal[data?.['group']?.['id']] = {'value': 0, 'forecast_value': 0}
                        if (data?.['opportunity']?.['value']) {
                            dataGroupTotal[data?.['group']?.['id']]['value'] = data?.['opportunity']?.['value'];
                        }
                        if (data?.['opportunity']?.['forecast_value']) {
                            dataGroupTotal[data?.['group']?.['id']]['forecast_value'] = data?.['opportunity']?.['value'];
                        }
                    } else {
                        if (data?.['opportunity']?.['value']) {
                            dataGroupTotal[data?.['group']?.['id']]['value'] += data?.['opportunity']?.['value'];
                        }
                        if (data?.['opportunity']?.['forecast_value']) {
                            dataGroupTotal[data?.['group']?.['id']]['forecast_value'] += data?.['opportunity']?.['forecast_value'];
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
                        dataEmployeeTotal[data?.['employee_inherit']?.['id']] = {'value': 0, 'forecast_value': 0}
                        if (data?.['opportunity']?.['value']) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']]['value'] = data?.['opportunity']?.['value'];
                        }
                        if (data?.['opportunity']?.['forecast_value']) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']]['forecast_value'] = data?.['opportunity']?.['value'];
                        }
                    } else {
                        if (data?.['opportunity']?.['value']) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']]['value'] += data?.['opportunity']?.['value'];
                        }
                        if (data?.['opportunity']?.['forecast_value']) {
                            dataEmployeeTotal[data?.['employee_inherit']?.['id']]['forecast_value'] += data?.['opportunity']?.['forecast_value'];
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
                    'call': totalCall,
                    'email': totalEmail,
                    'meeting': totalMeeting,
                    'document': totalDocument,
                },
                'group': {'title': 'Total'},
                'group_by': 0,
            }
            result.push(dataTotal);  // push data total
            for (let groupKey in dataGroup) {  // push data group
                result.push({
                    'group': dataGroup[groupKey],
                    'opportunity': {
                        'value': dataGroupTotal?.[groupKey]?.['value'],
                        'forecast_value': dataGroupTotal?.[groupKey]?.['forecast_value'],
                        // 'win_rate': dataGroupWinRate?.[groupKey],
                        'call': dataGroupCall?.[groupKey],
                        'email': dataGroupEmail?.[groupKey],
                        'meeting': dataGroupMeeting?.[groupKey],
                        'document': dataGroupDocument?.[groupKey],
                    },
                    'group_by': 1,
                });
                for (let employeeKey in dataEmployee) {  // push data employee
                    if (dataEmployee[employeeKey]?.['group_id'] === groupKey) {
                        result.push({
                            'employee_inherit': dataEmployee[employeeKey],
                            'opportunity': {
                                'value': dataEmployeeTotal?.[employeeKey]?.['value'],
                                'forecast_value': dataEmployeeTotal?.[employeeKey]?.['forecast_value'],
                                // 'win_rate': dataEmployeeWinRate?.[employeeKey],
                                'call': dataEmployeeCall?.[employeeKey],
                                'email': dataEmployeeEmail?.[employeeKey],
                                'meeting': dataEmployeeMeeting?.[employeeKey],
                                'document': dataEmployeeDocument?.[employeeKey],
                            },
                            'group_by': 2
                        });
                        for (let data of dataList) {  // push data opp
                            if (data?.['employee_inherit']?.['id'] === employeeKey) {
                                data['group'] = {};
                                data['employee_inherit'] = {};
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
                // $(firstRow).css('background-color', '#ebfcf5');
                // $(firstRow).css('color', '#00ab66');
                $(firstRow).css('background-color', '#ebf5f5');
                $(firstRow).css('color', '#007D88');
            }

            $.fn.initMaskMoney2();
        }

        function loadBoxEmployee() {
            boxEmployee.empty();
            if (boxGroup.val()) {
                boxEmployee.initSelect2({
                    'dataParams': {'group_id__in': boxGroup.val().join(',')},
                    'allowClear': true,
                });
            } else {
                boxEmployee.initSelect2({
                    'allowClear': true,
                });
            }
        }

        function loadBoxQuarter() {
            let data = [];
            for (let quarter of dataQuarter) {
                data.push({'id': quarter[0], 'title': quarter[1]})
            }
            boxQuarter.empty();
            boxQuarter.initSelect2({data: data, 'allowClear': true,});
        }

        function loadBoxMonth() {
            let data = [];
            for (let month of dataMonth) {
                data.push({'id': month[0], 'title': month[1]})
            }
            boxMonth.empty();
            boxMonth.initSelect2({data: data, 'allowClear': true,});
        }

        boxGroup.initSelect2({'allowClear': true,});
        loadBoxEmployee();
        loadBoxQuarter();
        loadBoxMonth();

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
            // loadTotal();
        });

        boxEmployee.on('change', function() {
            $table.DataTable().clear().draw();
            // loadTotal();
        });

        btnView.on('click', function () {
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['group_inherit_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val()) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            let date = $('#report-pipeline-date-approved').val();
            if (date) {
                let dateStrings = date.split(' - ');
                let dateStart = dateStrings[0] + " 00:00:00";
                let dateEnd = dateStrings[1] + " 23:59:59";
                dataParams['date_approved__gte'] = moment(dateStart, 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD hh:mm:ss');
                dataParams['date_approved__lte'] = moment(dateEnd, 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD hh:mm:ss');
            }
            $.fn.callAjax2({
                    'url': $table.attr('data-url'),
                    'method': $table.attr('data-method'),
                    // 'data': dataParams,
                    isLoading: true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('report_pipeline_list') && Array.isArray(data.report_pipeline_list)) {
                            setupData(data.report_pipeline_list);
                        }
                    }
                }
            )
        });


    });
});