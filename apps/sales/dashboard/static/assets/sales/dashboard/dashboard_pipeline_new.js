$(document).ready(function () {
    const CHART_COLORS = {
        blue: 'rgb(54, 162, 235)',
        green: 'rgb(75, 192, 96)',
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)',
        custom1: 'rgb(58, 110, 31)',
        custom2: 'rgb(194, 0, 35)',
        custom3: 'rgb(13, 46, 118)',
    }
    const CHART_COLORS_OPACITY = {
        blue: 'rgba(54, 162, 235, 0.6)',
        green: 'rgba(75, 192, 96, 0.6)',
        red: 'rgba(255, 99, 132, 0.6)',
        orange: 'rgba(255, 159, 64, 0.6)',
        yellow: 'rgba(255, 205, 86, 0.6)',
        purple: 'rgba(153, 102, 255, 0.6)',
        grey: 'rgba(201, 203, 207, 0.6)',
        custom1: 'rgba(58, 110, 31, 0.6)',
        custom2: 'rgba(194, 0, 35, 0.6)',
        custom3: 'rgba(13, 46, 118, 0.6)'
    }
    const scriptUrlEle = $('#script-url')
    const trans_script = $('#trans-script')
    const moneyDisplayEle = $('#money-display')
    const moneyRoundEle = $('#money-round')
    const periodFiscalYearFilterEle = $('#period-filter')
    const current_period_Ele = $('#current_period')
    const current_period = current_period_Ele.text() ? JSON.parse(current_period_Ele.text()) : {}
    let period_selected_Setting = current_period
    let fiscal_year_Setting = current_period?.['fiscal_year']
    let space_month_Setting = current_period?.['space_month']

    function LoadPeriod(data) {
        if (Object.keys(data).length === 0) {
            data = current_period
        }
        periodFiscalYearFilterEle.initSelect2({
            ajax: {
                url: periodFiscalYearFilterEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'periods_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            $('#revenue-spinner').prop('hidden', false)
            $('#profit-spinner').prop('hidden', false)
            period_selected_Setting = SelectDDControl.get_data_from_idx(periodFiscalYearFilterEle, periodFiscalYearFilterEle.val())
            fiscal_year_Setting = period_selected_Setting?.['fiscal_year']
            space_month_Setting = period_selected_Setting?.['space_month']
            DrawPipelineChart(false)
        })
    }

    function Check_in_period(dateApproved, period) {
        let start_date = period?.['start_date'];
        let end_date = period?.['end_date'];

        if (!start_date || !end_date) return false;

        let approvedDate = new Date(dateApproved);
        let startDate = new Date(start_date);
        let endDate = new Date(end_date);

        return startDate <= approvedDate && approvedDate <= endDate;
    }

    function getMonthOrder(space_month) {
        let month_order = []
        for (let i = 0; i < 12; i++) {
            let trans_order = i + 1 + space_month
            if (trans_order > 12) {
                trans_order -= 12
            }
            month_order.push(trans_script.attr(`data-trans-m${trans_order}th`))
        }
        return month_order
    }

    function GetSub(date, period) {
        let subs = period?.['subs'] ? period?.['subs'] : []
        for (let i=subs.length - 1; i >= 0; i--) {
            if (new Date(date) >= new Date(subs[i]?.['start_date'])) {
                return subs[i]?.['order']
            }
        }
    }

    function GetQuarter(dateApproved, period) {
        let sub_current = null
        for (let i=0; i < period?.['subs'].length; i++) {
            let sub = period?.['subs'][i]
            let start_date = sub?.['start_date'];
            let end_date = sub?.['end_date'];

            if (!start_date || !end_date) return false;

            let approvedDate = new Date(dateApproved);
            let startDate = new Date(start_date);
            let endDate = new Date(end_date);

            if (startDate <= approvedDate && approvedDate <= endDate) {
                sub_current = sub
            }
        }
        if (sub_current) {
            if ([1, 2, 3].includes(sub_current?.['order'])) {
                return 1
            } else if ([4, 5, 6].includes(sub_current?.['order'])) {
                return 2
            } else if ([7, 8, 9].includes(sub_current?.['order'])) {
                return 3
            } else if ([10, 11, 12].includes(sub_current?.['order'])) {
                return 4
            }
        }
        return null
    }

    moneyDisplayEle.on('change', function () {
        DrawPipelineChart(false)
    })

    moneyRoundEle.on('change', function () {
        $(this).val($(this).val() || 1);
        DrawPipelineChart(false)
    })

    $('.large-view-btn').on('click', function () {
        if ($(this).closest('.view-space').attr('class') === 'view-space col-6 col-md-6 col-lg-6 mt-3') {
            $(this).closest('.view-space').attr('class', 'view-space col-12 col-md-12 col-lg-12 mt-3')
        }
        else {
            $(this).closest('.view-space').attr('class', 'view-space col-6 col-md-6 col-lg-6 mt-3')
        }
        $(this).closest('.view-space').find('.reload-data-btn').trigger('click')
    })

    // common of total pipeline + top sale + forecast

    let filtered_pipeline_chart_DF = []
    let stage_list_DF = []

    const totalPipelineGroupEle = $('#total-pipeline-group')

    async function ProcessData(pipeline_chart_DF) {
        filtered_pipeline_chart_DF = (pipeline_chart_DF || [])
            .filter(item =>
                Check_in_period(item?.['opportunity']?.['open_date'], period_selected_Setting)
                && item?.['opportunity']?.['stage']?.['win_rate'] !== 0
                && item?.['opportunity']?.['stage']?.['win_rate'] !== 100
            )
            .map(item => {
                const opportunity = item?.['opportunity'] || {};
                const stage = opportunity?.['stage'] || {};
                const employee = item?.['employee_inherit'] || {};
                return {
                    employee_id: employee?.['id'],
                    employee_fullname: employee?.['full_name'],
                    employee_group_id: employee?.['group_id'],
                    opp_stage_id: stage?.['id'],
                    opp_stage_title: `${stage?.['indicator']} (${stage?.['win_rate']}%)`,
                    opp_stage_winrate: stage?.['win_rate'],
                    opp_open_date: opportunity?.['open_date'],
                    opp_close_date: opportunity?.['close_date'],
                    forecast_value: opportunity?.['forecast_value'],
                    value: opportunity?.['value'],
                };
            })
        filtered_forecast_chart_DF = pipeline_chart_DF
            .filter(item =>
                Check_in_period(item?.['opportunity']?.['close_date'], period_selected_Setting)
                && item?.['opportunity']?.['stage']?.['win_rate'] !== 0
                && item?.['opportunity']?.['stage']?.['win_rate'] !== 100
            )
            .map(item => {
                    const opportunity = item?.['opportunity'] || {};
                    const stage = opportunity?.['stage'] || {};
                    const employee = item?.['employee_inherit'] || {};
                    return {
                        employee_id: employee?.['id'],
                        employee_fullname: employee?.['full_name'],
                        employee_group_id: employee?.['group_id'],
                        opp_stage_id: stage?.['id'],
                        opp_stage_title: `${stage?.['indicator']} (${stage?.['win_rate']}%)`,
                        opp_stage_winrate: stage?.['win_rate'],
                        opp_open_date: opportunity?.['open_date'],
                        opp_close_date: opportunity?.['close_date'],
                        forecast_value: opportunity?.['forecast_value'],
                        value: opportunity?.['value'],
                    };
                })

        const stage_map = new Map();
        filtered_pipeline_chart_DF.forEach(item => {
            const stage_title = item?.['opp_stage_title'];
            if (!stage_map.has(stage_title)) {
                stage_map.set(stage_title, {
                    'opp_id': item?.['opp_stage_id'],
                    'opp_stage_title': item?.['opp_stage_title'],
                    'opp_stage_winrate': item?.['opp_stage_winrate'],
                });
            }
        });
        stage_list_DF = Array.from(stage_map.values());
        stage_list_DF.sort((a, b) => a.opp_stage_winrate - b.opp_stage_winrate);
    }

    function DrawPipelineChart(is_init=false) {
        $('#total-pipeline-spinner').prop('hidden', false)
        $('#top-sale-spinner').prop('hidden', false)
        $('#forecast-spinner').prop('hidden', false)

        let total_pipeline_chart_ajax = $.fn.callAjax2({
            url: scriptUrlEle.attr('data-url-pipeline-list'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('report_pipeline_list')) {
                    return data?.['report_pipeline_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            })

        Promise.all([total_pipeline_chart_ajax]).then(
            (results) => {
                ProcessData(results[0]).then(() => {
                    if (!is_init) {
                        total_pipeline_chart.destroy();
                        top_sale_chart.destroy();
                        forecast_chart.destroy();
                    }

                    let [stage_indicator, total_pipeline_data] = GetTotalPipelineChartDatasets()
                    total_pipeline_chart = new Chart(
                        $('#total_pipeline_chart')[0].getContext('2d'),
                        TotalPipelineChartCfg(
                            'bar',
                            stage_indicator,
                            total_pipeline_data,
                            trans_script.attr('data-trans-chart-total-pipeline'),
                            trans_script.attr('data-trans-revenue'),
                            trans_script.attr('data-trans-opp-stage'),
                            'y'
                        )
                    )
                    $('#total-pipeline-spinner').prop('hidden', true)

                    let [employee_fullname_list, top_sale_data] = GetTopSaleChartDatasets()
                    top_sale_chart = new Chart(
                        $('#top_sale_chart')[0].getContext('2d'),
                        TopSaleChartCfg(
                            'bar',
                            employee_fullname_list,
                            top_sale_data,
                            trans_script.attr('data-trans-chart-top-sale'),
                            trans_script.attr('data-trans-revenue'),
                            trans_script.attr('data-trans-sale-person'),
                            'y'
                        )
                    )
                    $('#top-sale-spinner').prop('hidden', true)

                    let [month_list, forecast_data] = GetForecastChartDatasets()
                    forecast_chart = new Chart(
                        $('#forecast_chart')[0].getContext('2d'),
                        ForecastChartCfg(
                            'bar',
                            month_list,
                            forecast_data,
                            trans_script.attr('data-trans-chart-forecast'),
                            trans_script.attr('data-trans-revenue'),
                            forecast_viewby_Ele.val() === '0' ? trans_script.attr('data-trans-month') : trans_script.attr('data-trans-quarter'),
                            'y'
                        )
                    )
                    $('#forecast-spinner').prop('hidden', true)
                })
            })
    }

    $('#reload-pipeline-data-btn').on('click', function () {
        DrawPipelineChart(false)
    })

    // total pipeline

    let total_pipeline_chart = null

    function TotalPipelineChartCfg(chart_type, labelX, data_list, chart_title='', titleX='', titleY='', indexAxis='x') {
        let stage_backgroundColor = []
        let stage_borderColor = []
        for (let i=0; i < data_list.length; i++) {
            stage_backgroundColor.push(Object.values(CHART_COLORS_OPACITY)[i])
            stage_borderColor.push(Object.values(CHART_COLORS)[i])
        }
        return {
            type: chart_type,
            data: {
                labels: labelX,
                datasets: [{
                    data: data_list,
                    backgroundColor: stage_backgroundColor,
                    borderColor: stage_borderColor,
                    borderWidth: 2
                }]
            },
            options: {
                indexAxis: indexAxis,
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                        display: true,
                        title: {
                            display: true,
                            text: titleX,
                        }
                    },
                    y: {
                        stacked: true,
                        display: true,
                        title: {
                            display: true,
                            text: titleY,
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: chart_title
                    }
                },
            }
        }
    }

    function GetTotalPipelineChartDatasets() {
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6;

        let stage_list = stage_list_DF
        stage_list.forEach(stage => {
            let sum_stage_value = 0
            filtered_pipeline_chart_DF.forEach(item => {
                if (item?.['opp_stage_id'] === stage?.['opp_id']) {
                    sum_stage_value += item?.['value'] || 0
                }
            })
            stage['sum_value'] = sum_stage_value / cast_billion
        })

        return [stage_list.map(item => item['opp_stage_title']), stage_list.map(item => item['sum_value'])];
    }

    // top sale

    let top_sale_chart = null
    const top_sale_number = $('#top-sale-number')

    top_sale_number.on('change', function () {
        DrawPipelineChart(false)
    })

    function TopSaleChartCfg(chart_type, labelX, data_list, chart_title='', titleX='', titleY='', indexAxis='x') {
        return {
            type: chart_type,
            data: {
                labels: labelX,
                datasets: data_list,
            },
            options: {
                indexAxis: indexAxis,
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                        display: true,
                        title: {
                            display: true,
                            text: titleX,
                        }
                    },
                    y: {
                        stacked: true,
                        display: true,
                        title: {
                            display: true,
                            text: titleY,
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: chart_title
                    }
                },
            }
        }
    }

    function GetTopSaleChartDatasets() {
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6;

        let stage_list = stage_list_DF
        let stage_backgroundColor = []
        let stage_borderColor = []
        for (let i=0; i < stage_list.length; i++) {
            stage_backgroundColor.push(Object.values(CHART_COLORS_OPACITY)[i])
            stage_borderColor.push(Object.values(CHART_COLORS)[i])
        }

        let emp_list = [...new Map(filtered_pipeline_chart_DF.map(item => [
            item?.['employee_id'],
            {
                emp_id: item?.['employee_id'],
                emp_fullname: item?.['employee_fullname'],
                stage_value: Object.fromEntries(stage_list.map(stage => [stage['opp_stage_title'], 0]))
            }
        ])).values()];

        filtered_pipeline_chart_DF.forEach(item => {
            const emp = emp_list.find(emp => emp.emp_id === item?.['employee_id']);
            if (emp) {
                emp['stage_value'][item?.['opp_stage_title']] += (item?.['value'] / cast_billion) || 0;
            }
        });

        emp_list.sort((a, b) => {
            const sumA = Object.values(a.stage_value).reduce((sum, value) => sum + value, 0);
            const sumB = Object.values(b.stage_value).reduce((sum, value) => sum + value, 0);
            return sumB - sumA;
        });

        emp_list = emp_list.filter(item => {
            return Object.values(item.stage_value).reduce((sum, value) => sum + value, 0) > 0
        })

        const series_data = stage_list.map(
            (stage, index) => ({
                label: stage?.['opp_stage_title'],
                data: emp_list.map(item => item['stage_value'][stage?.['opp_stage_title']]),
                backgroundColor: stage_backgroundColor[index],
                borderColor: stage_borderColor[index],
                borderWidth: 2
            })
        );

        return [emp_list.map(item => item['emp_fullname']).slice(0, top_sale_number.val()), series_data];
    }

    // forecast

    let forecast_chart = null
    let filtered_forecast_chart_DF = []
    const winrate_threshold_ELe = $('#winrate-threshold')
    const forecast_viewby_Ele = $('#forecast-viewby')

    winrate_threshold_ELe.on('change', function () {
        forecast_chart.destroy();
        let [month_list, forecast_data] = GetForecastChartDatasets()
        forecast_chart = new Chart(
            $('#forecast_chart')[0].getContext('2d'),
            ForecastChartCfg(
                'bar',
                month_list,
                forecast_data,
                trans_script.attr('data-trans-chart-forecast'),
                trans_script.attr('data-trans-revenue'),
                forecast_viewby_Ele.val() === '0' ? trans_script.attr('data-trans-month') : trans_script.attr('data-trans-quarter'),
                'y'
            )
        )
        $('#forecast-spinner').prop('hidden', true)
    })

    forecast_viewby_Ele.on('change', function () {
        forecast_chart.destroy();
        let [month_list, forecast_data] = GetForecastChartDatasets()
        forecast_chart = new Chart(
            $('#forecast_chart')[0].getContext('2d'),
            ForecastChartCfg(
                'bar',
                month_list,
                forecast_data,
                trans_script.attr('data-trans-chart-forecast'),
                trans_script.attr('data-trans-revenue'),
                forecast_viewby_Ele.val() === '0' ? trans_script.attr('data-trans-month') : trans_script.attr('data-trans-quarter'),
                'y'
            )
        )
        $('#forecast-spinner').prop('hidden', true)
    })

    function ForecastChartCfg(chart_type, labelX, data_list, chart_title='', titleX='', titleY='', indexAxis='x') {
        return {
            type: chart_type,
            data: {
                labels: labelX,
                datasets: data_list,
            },
            options: {
                indexAxis: indexAxis,
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                        display: true,
                        title: {
                            display: true,
                            text: titleX,
                        }
                    },
                    y: {
                        stacked: true,
                        display: true,
                        title: {
                            display: true,
                            text: titleY,
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: chart_title
                    }
                },
            }
        }
    }

    function GetForecastChartDatasets() {
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6;

        const winrate_threshold = parseFloat(winrate_threshold_ELe.val())
        const type1_data = filtered_forecast_chart_DF.filter(item =>
            item?.['opp_stage_winrate'] <= winrate_threshold && item?.['opp_stage_winrate'] !== 0
        )
        const type2_data = filtered_forecast_chart_DF.filter(item =>
            item?.['opp_stage_winrate'] > winrate_threshold && item?.['opp_stage_winrate'] !== 100
        )

        if (forecast_viewby_Ele.val() === '0') {
            let type1_data_by_month = Array(12).fill(0)
            let type2_data_by_month = Array(12).fill(0)

            type1_data.forEach(item => {
                type1_data_by_month[GetSub(item?.['opp_close_date'], period_selected_Setting) - 1] += item?.['forecast_value'] / cast_billion
            })
            type2_data.forEach(item => {
                type2_data_by_month[GetSub(item?.['opp_close_date'], period_selected_Setting) - 1] += item?.['forecast_value'] / cast_billion
            })

            const series_data = [`≤ ${winrate_threshold}% (≠ 0%)`, `> ${winrate_threshold}% (≠ 100%)`].map(
                (type, index) => ({
                    label: type,
                    data: type === `≤ ${winrate_threshold}% (≠ 0%)` ? type1_data_by_month : type2_data_by_month,
                    backgroundColor: [CHART_COLORS_OPACITY?.['blue'], CHART_COLORS_OPACITY?.['green']]?.[index],
                    borderColor: [CHART_COLORS?.['blue'], CHART_COLORS?.['green']]?.[index],
                    borderWidth: 2
                })
            );

            return [getMonthOrder(space_month_Setting), series_data];
        }
        else {
            let type1_data_by_month = Array(4).fill(0)
            let type2_data_by_month = Array(4).fill(0)

            type1_data.forEach(item => {
                type1_data_by_month[GetQuarter(item?.['opp_close_date'], period_selected_Setting) - 1] += item?.['forecast_value'] / cast_billion
            })
            type2_data.forEach(item => {
                type2_data_by_month[GetQuarter(item?.['opp_close_date'], period_selected_Setting) - 1] += item?.['forecast_value'] / cast_billion
            })

            const series_data = [`≤ ${winrate_threshold}% (≠ 0%)`, `> ${winrate_threshold}% (≠ 100%)`].map(
                (type, index) => ({
                    label: type,
                    data: type === `≤ ${winrate_threshold}% (≠ 0%)` ? type1_data_by_month : type2_data_by_month,
                    backgroundColor: [CHART_COLORS_OPACITY?.['blue'], CHART_COLORS_OPACITY?.['green']]?.[index],
                    borderColor: [CHART_COLORS?.['blue'], CHART_COLORS?.['green']]?.[index],
                    borderWidth: 2
                })
            );

            return [
                [
                    trans_script.attr('data-trans-quarter-1'),
                    trans_script.attr('data-trans-quarter-2'),
                    trans_script.attr('data-trans-quarter-3'),
                    trans_script.attr('data-trans-quarter-4')
                ],
                series_data
            ];
        }
    }

    $('#reload-forecast-data-btn').on('click', function () {
        DrawPipelineChart(false)
    })

    // Load Page

    LoadPeriod(current_period)
    DrawPipelineChart(true)
})
