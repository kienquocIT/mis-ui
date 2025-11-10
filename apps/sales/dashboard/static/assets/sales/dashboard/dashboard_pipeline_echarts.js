$(document).ready(function () {
    // Modern UI/UX color palette - high contrast for better distinction
    const CHART_COLORS = {
        primary: '#2563eb',     // Strong Blue
        secondary: '#dc2626',   // Strong Red
        success: '#16a34a',     // Strong Green
        info: '#ca8a04',        // Strong Yellow
        warning: '#ea580c',     // Strong Orange
        danger: '#7c3aed',      // Strong Purple
        pink: '#be185d',        // Strong Pink
        teal: '#0891b2',        // Strong Teal
        cyan: '#0369a1',        // Strong Cyan
        gray: '#374151',        // Strong Gray
    };
    
    const CHART_COLORS_OPACITY = {
        primary: 'rgba(37, 99, 235, 0.8)',     // Strong Blue with opacity
        secondary: 'rgba(220, 38, 38, 0.8)',   // Strong Red with opacity
        success: 'rgba(22, 163, 74, 0.8)',     // Strong Green with opacity
        info: 'rgba(202, 138, 4, 0.8)',        // Strong Yellow with opacity
        warning: 'rgba(234, 88, 12, 0.8)',     // Strong Orange with opacity
        danger: 'rgba(124, 58, 237, 0.8)',     // Strong Purple with opacity
        pink: 'rgba(190, 24, 93, 0.8)',        // Strong Pink with opacity
        teal: 'rgba(8, 145, 178, 0.8)',        // Strong Teal with opacity
        cyan: 'rgba(3, 105, 161, 0.8)',        // Strong Cyan with opacity
        gray: 'rgba(55, 65, 81, 0.8)'          // Strong Gray with opacity
    };

    // Professional gradient sets for modern charts
    const GRADIENT_SETS = {
        cool: [
            { start: '#667eea', end: '#764ba2' },
            { start: '#3b82f6', end: '#1e40af' },
            { start: '#06b6d4', end: '#0891b2' },
            { start: '#6366f1', end: '#4f46e5' },
            { start: '#8b5cf6', end: '#7c3aed' }
        ],
        warm: [
            { start: '#f59e0b', end: '#d97706' },
            { start: '#ef4444', end: '#dc2626' },
            { start: '#ec4899', end: '#db2777' },
            { start: '#f97316', end: '#ea580c' },
            { start: '#eab308', end: '#ca8a04' }
        ],
        mixed: [
            { start: '#6366f1', end: '#4f46e5' },
            { start: '#10b981', end: '#059669' },
            { start: '#f59e0b', end: '#d97706' },
            { start: '#ef4444', end: '#dc2626' },
            { start: '#8b5cf6', end: '#7c3aed' }
        ]
    };

    // Get DOM elements
    const scriptUrlEle = $('#script-url');
    const trans_script = $('#trans-script');
    const moneyDisplayEle = $('#money-display');
    const moneyRoundEle = $('#money-round');
    const periodFiscalYearFilterEle = $('#period-filter');
    const current_period_Ele = $('#current_period');
    const current_period = current_period_Ele.text() ? JSON.parse(current_period_Ele.text()) : {};
    
    let period_selected_Setting = current_period;
    let fiscal_year_Setting = current_period ? current_period['fiscal_year'] : undefined;
    let space_month_Setting = current_period ? current_period['space_month'] : 0;

    // Chart instances
    let total_pipeline_chart = null;
    let top_sale_chart = null;
    let forecast_chart = null;
    let activity_chart = null;

    // Data variables
    let pipeline_chart_DF = [];
    let filtered_pipeline_chart_DF = [];
    let filtered_forecast_chart_DF = [];
    let stage_list_DF = [];

    // Group elements
    const pipelineGroupEle = $('#pipeline-group');
    const forecastGroupEle = $('#forecast-group');

    // Utility functions from original
    function Check_in_period(dateApproved, period) {
        let start_date = period ? period['start_date'] : null;
        let end_date = period ? period['end_date'] : null;

        if (!start_date || !end_date) return false;

        let approvedDate = new Date(dateApproved);
        let startDate = new Date(start_date);
        let endDate = new Date(end_date);

        return startDate <= approvedDate && approvedDate <= endDate;
    }

    function getMonthOrder(space_month) {
        let month_order = [];
        for (let i = 0; i < 12; i++) {
            let trans_order = i + 1 + space_month;
            if (trans_order > 12) {
                trans_order -= 12;
            }
            month_order.push(trans_script.attr(`data-trans-m${trans_order}th`));
        }
        return month_order;
    }

    function GetSub(date, period) {
        let subs = period && period['subs'] ? period['subs'] : [];
        for (let i = subs.length - 1; i >= 0; i--) {
            if (subs[i] && new Date(date) >= new Date(subs[i]['start_date'])) {
                return subs[i]['order'];
            }
        }
    }

    function GetQuarter(dateApproved, period) {
        let sub_current = null;
        let subs = period ? period['subs'] : [];
        for (let i = 0; i < subs.length; i++) {
            let sub = subs[i];
            let start_date = sub ? sub['start_date'] : null;
            let end_date = sub ? sub['end_date'] : null;

            if (!start_date || !end_date) continue;

            let approvedDate = new Date(dateApproved);
            let startDate = new Date(start_date);
            let endDate = new Date(end_date);

            if (startDate <= approvedDate && approvedDate <= endDate) {
                sub_current = sub;
            }
        }
        if (sub_current) {
            let order = sub_current['order'];
            if ([1, 2, 3].includes(order)) {
                return 1;
            } else if ([4, 5, 6].includes(order)) {
                return 2;
            } else if ([7, 8, 9].includes(order)) {
                return 3;
            } else if ([10, 11, 12].includes(order)) {
                return 4;
            }
        }
        return null;
    }

    // Money display change handler
    moneyDisplayEle.on('change', function () {
        DrawAllChart(false);
    });

    moneyRoundEle.on('change', function () {
        $(this).val($(this).val() || 1);
        DrawAllChart(false);
    });

    // Load fiscal year periods
    function LoadPeriod(data) {
        if (!data || Object.keys(data).length === 0) {
            data = current_period;
        }
        
        if (typeof $.fn.initSelect2 === 'function') {
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
                if (typeof SelectDDControl !== 'undefined') {
                    period_selected_Setting = SelectDDControl.get_data_from_idx(periodFiscalYearFilterEle, periodFiscalYearFilterEle.val());
                    fiscal_year_Setting = period_selected_Setting ? period_selected_Setting['fiscal_year'] : undefined;
                    space_month_Setting = period_selected_Setting ? period_selected_Setting['space_month'] : 0;
                }
                DrawAllChart(false);
            });
        }
    }

    // Process data - matching original logic
    async function ProcessData(chart_name = ['pipeline', 'forecast']) {
        if (chart_name.includes('pipeline')) {
            filtered_pipeline_chart_DF = pipeline_chart_DF
                .filter(item => {
                    let opp = item ? item['opportunity'] : null;
                    let stage = opp ? opp['stage'] : null;
                    return Check_in_period(opp ? opp['open_date'] : null, period_selected_Setting)
                        && stage && stage['win_rate'] !== 0
                        && stage && stage['win_rate'] !== 100;
                })
                .map(item => {
                    const opportunity = item ? item['opportunity'] : {};
                    const stage = opportunity ? opportunity['stage'] : {};
                    const employee = item ? item['employee_inherit'] : {};
                    return {
                        employee_id: employee ? employee['id'] : null,
                        employee_fullname: employee ? employee['full_name'] : '',
                        employee_group_id: employee ? employee['group_id'] : null,
                        opp_stage_id: stage ? stage['id'] : null,
                        opp_stage_title: stage ? `${stage['indicator']} (${stage['win_rate']}%)` : '',
                        opp_stage_winrate: stage ? stage['win_rate'] : 0,
                        opp_open_date: opportunity ? opportunity['open_date'] : null,
                        opp_close_date: opportunity ? opportunity['close_date'] : null,
                        forecast_value: opportunity ? opportunity['forecast_value'] : 0,
                        value: opportunity ? opportunity['value'] : 0,
                        customer_id: opportunity && opportunity['customer'] ? opportunity['customer']['id'] : null,
                        customer_title: opportunity && opportunity['customer'] ? opportunity['customer']['title'] : '',
                        customer_call: opportunity ? opportunity['call'] : 0,
                        customer_email: opportunity ? opportunity['email'] : 0,
                        customer_meeting: opportunity ? opportunity['meeting'] : 0,
                        customer_document: opportunity ? opportunity['document'] : 0
                    };
                });
            
            if (pipelineGroupEle.val()) {
                filtered_pipeline_chart_DF = filtered_pipeline_chart_DF.filter(item => {
                    return item['employee_group_id'] === pipelineGroupEle.val();
                });
            }

            const stage_map = new Map();
            filtered_pipeline_chart_DF.forEach(item => {
                const stage_title = item['opp_stage_title'];
                if (!stage_map.has(stage_title)) {
                    stage_map.set(stage_title, {
                        'opp_id': item['opp_stage_id'],
                        'opp_stage_title': item['opp_stage_title'],
                        'opp_stage_winrate': item['opp_stage_winrate'],
                    });
                }
            });
            stage_list_DF = Array.from(stage_map.values());
            // Already sorted from low to high winrate - no change needed
            stage_list_DF.sort((a, b) => a.opp_stage_winrate - b.opp_stage_winrate);
        }

        if (chart_name.includes('forecast')) {
            filtered_forecast_chart_DF = pipeline_chart_DF
                .filter(item => {
                    let opp = item ? item['opportunity'] : null;
                    let stage = opp ? opp['stage'] : null;
                    return Check_in_period(opp ? opp['close_date'] : null, period_selected_Setting)
                        && stage && stage['win_rate'] !== 0
                        && stage && stage['win_rate'] !== 100;
                })
                .map(item => {
                    const opportunity = item ? item['opportunity'] : {};
                    const stage = opportunity ? opportunity['stage'] : {};
                    const employee = item ? item['employee_inherit'] : {};
                    return {
                        employee_id: employee ? employee['id'] : null,
                        employee_fullname: employee ? employee['full_name'] : '',
                        employee_group_id: employee ? employee['group_id'] : null,
                        opp_stage_id: stage ? stage['id'] : null,
                        opp_stage_title: stage ? `${stage['indicator']} (${stage['win_rate']}%)` : '',
                        opp_stage_winrate: stage ? stage['win_rate'] : 0,
                        opp_open_date: opportunity ? opportunity['open_date'] : null,
                        opp_close_date: opportunity ? opportunity['close_date'] : null,
                        forecast_value: opportunity ? opportunity['forecast_value'] : 0,
                        value: opportunity ? opportunity['value'] : 0,
                    };
                });
            
            if (forecastGroupEle.val()) {
                filtered_forecast_chart_DF = filtered_forecast_chart_DF.filter(item => {
                    return item['employee_group_id'] === forecastGroupEle.val();
                });
            }
        }
    }

    // Draw charts
    function DrawTotalPipelineChart(is_init = false) {
        if (!is_init && total_pipeline_chart) {
            total_pipeline_chart.dispose();
        }
        let [stage_indicator, total_pipeline_data, stage_list_for_colors] = GetTotalPipelineChartDatasets();
        
        const container = document.getElementById('total_pipeline_chart');
        if (container && typeof echarts !== 'undefined') {
            total_pipeline_chart = echarts.init(container);
            total_pipeline_chart.setOption(TotalPipelineChartCfg(
                stage_indicator,
                total_pipeline_data,
                trans_script.attr('data-trans-chart-total-pipeline'),
                trans_script.attr('data-trans-revenue'),
                trans_script.attr('data-trans-opp-stage'),
                'y',
                stage_list_for_colors
            ));
        }
    }

    function DrawTopSaleChart(is_init = false) {
        if (!is_init && top_sale_chart) {
            top_sale_chart.dispose();
        }
        let [employee_fullname_list, top_sale_data] = GetTopSaleChartDatasets();
        
        const container = document.getElementById('top_sale_chart');
        if (container && typeof echarts !== 'undefined') {
            top_sale_chart = echarts.init(container);
            top_sale_chart.setOption(TopSaleChartCfg(
                employee_fullname_list,
                top_sale_data,
                trans_script.attr('data-trans-chart-top-sale'),
                trans_script.attr('data-trans-revenue'),
                trans_script.attr('data-trans-sale-person'),
                'y'
            ));
        }
    }

    function DrawForecastChart(is_init = false) {
        if (!is_init && forecast_chart) {
            forecast_chart.dispose();
        }
        let [month_list, forecast_data] = GetForecastChartDatasets();
        
        const container = document.getElementById('forecast_chart');
        if (container && typeof echarts !== 'undefined') {
            forecast_chart = echarts.init(container);
            forecast_chart.setOption(ForecastChartCfg(
                month_list,
                forecast_data,
                trans_script.attr('data-trans-chart-forecast'),
                trans_script.attr('data-trans-revenue'),
                $('#forecast-viewby').val() === '0' ? trans_script.attr('data-trans-month') : trans_script.attr('data-trans-quarter'),
                'x'
            ));
        }
    }

    function DrawActivityChart(is_init = false) {
        if (!is_init && activity_chart) {
            activity_chart.dispose();
        }
        let [customer_list, activity_data] = GetActivityChartDatasets();
        
        const container = document.getElementById('activity_chart');
        if (container && typeof echarts !== 'undefined') {
            activity_chart = echarts.init(container);
            activity_chart.setOption(ActivityChartCfg(
                customer_list,
                activity_data,
                trans_script.attr('data-trans-chart-activity'),
                'Activities',
                trans_script.attr('data-trans-customer'),
                'y'
            ));
        }
    }

    function DrawAllChart(is_init = false) {
        WindowControl.showLoading()

        // Check if we have callAjax2 function
        if (typeof $.fn.callAjax2 === 'function') {
            let total_pipeline_chart_ajax = $.fn.callAjax2({
                url: scriptUrlEle.attr('data-url-pipeline-list'),
                data: {},
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('report_pipeline_list')) {
                        return data['report_pipeline_list'];
                    }
                    return [];
                },
                (errs) => {
                    console.log(errs);
                    return [];
                });

            Promise.all([total_pipeline_chart_ajax]).then(
                (results) => {
                    pipeline_chart_DF = results[0] ? results[0] : [];
                    ProcessData().then(() => {
                        DrawTotalPipelineChart(is_init);
                        DrawTopSaleChart(is_init);
                        DrawForecastChart(is_init);
                        DrawActivityChart(is_init);

                        WindowControl.hideLoading()
                    });
                });
        } else {
            // Use empty data if no ajax function
            pipeline_chart_DF = [];
            ProcessData().then(() => {
                DrawTotalPipelineChart(is_init);
                DrawTopSaleChart(is_init);
                DrawForecastChart(is_init);
                DrawActivityChart(is_init);

                WindowControl.hideLoading()
            });
        }
    }

    // Get data for total pipeline chart
    function GetTotalPipelineChartDatasets() {
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6;
        const round = parseInt(moneyRoundEle.val() || 1);

        let stage_list = stage_list_DF.slice(); // Make a copy
        stage_list.forEach(stage => {
            let sum_stage_value = 0;
            filtered_pipeline_chart_DF.forEach(item => {
                if (item['opp_stage_id'] === stage['opp_id']) {
                    sum_stage_value += item['value'] || 0;
                }
            });
            stage['sum_value'] = parseFloat((sum_stage_value / cast_billion).toFixed(round));
        });

        // If no data, use sample data
        if (stage_list.length === 0) {
            stage_list = [];
        }

        return [stage_list.map(item => item['opp_stage_title']).reverse(), stage_list.map(item => item['sum_value']).reverse(), stage_list.reverse()];
    }

    // Total Pipeline Chart Configuration - Synchronized with General Dashboard
    function TotalPipelineChartCfg(labelX, data_list, chart_title, titleX, titleY, indexAxis, stage_list_for_colors) {
        return {
            textStyle: {
                color: '#000',
                fontFamily: 'Arial, Helvetica, sans-serif'
            },
            title: {
                text: chart_title,
                left: 'center',
                textStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                }
            },
            tooltip: {
                trigger: 'item',
                confine: true,
                formatter: function(params) {
                    if (params.componentType === 'series') {
                        const name = params.name;
                        const value = params.value;
                        return `${name}<br/>${new Intl.NumberFormat('vi-VN').format(value)} ${moneyDisplayEle.val() === '1' ? 'Tỷ' : 'Triệu'}`;
                    }
                    return '';
                }
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                right: '2%',
                top: '2%',
                feature: {
                    dataView: {
                        readOnly: false,
                        title: 'Xem dữ liệu',
                        lang: ['Dữ liệu', 'Đóng', 'Làm mới']
                    },
                    restore: {
                        title: 'Khôi phục'
                    },
                    saveAsImage: {
                        title: 'Lưu hình',
                        pixelRatio: 2
                    }
                }
            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '10%',
                top: '12%',
                containLabel: true
            },
            xAxis: {
                type: indexAxis === 'y' ? 'value' : 'category',
                data: indexAxis === 'y' ? undefined : labelX,
                name: indexAxis === 'y' ? titleX : undefined,
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: indexAxis === 'y' ? 'line' : 'none'
                }
            },
            yAxis: {
                type: indexAxis === 'y' ? 'category' : 'value',
                data: indexAxis === 'y' ? labelX : undefined,
                nameLocation: 'middle',
                nameGap: 60,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisLabel: {
                    formatter: function(value) {
                        if (typeof value === 'string' && value.length > 15) {
                            return value.substring(0, 15) + '...';
                        }
                        return value;
                    },
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: indexAxis === 'y' ? 'shadow' : 'none'
                }
            },
            animation: true,
            animationThreshold: 2000,
            animationDuration: 1000,
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return idx * 100;
            },
            animationDurationUpdate: 300,
            animationEasingUpdate: 'elasticOut',
            series: [{
                name: trans_script.attr('data-trans-revenue'),
                type: 'bar',
                data: data_list.map((value, index) => {
                    // Get color based on stage position in original stage_list_DF
                    let colorIndex = 0;
                    if (stage_list_for_colors && stage_list_for_colors[index]) {
                        // Find the index of this stage in the original stage_list_DF
                        colorIndex = stage_list_DF.findIndex(stage => 
                            stage['opp_stage_title'] === stage_list_for_colors[index]['opp_stage_title']
                        );
                        if (colorIndex === -1) colorIndex = index;
                    } else {
                        colorIndex = index;
                    }
                    
                    return {
                        value: value,
                        itemStyle: {
                            color: Object.values(CHART_COLORS)[colorIndex % Object.values(CHART_COLORS).length]
                        }
                    };
                }),
                itemStyle: {
                    borderRadius: indexAxis === 'y' ? [0, 8, 8, 0] : [8, 8, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                animationDelay: function (idx) {
                    return idx * 50;
                }
            }]
        };
    }

    // Get top sale data
    function GetTopSaleChartDatasets() {
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6;
        const round = parseInt(moneyRoundEle.val() || 1);
        const top_sale_number = parseInt($('#top-sale-number').val()) || 10;

        let stage_list = stage_list_DF;
        let stage_backgroundColor = [];
        let stage_borderColor = [];
        for (let i = 0; i < stage_list.length; i++) {
            stage_backgroundColor.push(Object.values(CHART_COLORS_OPACITY)[i % Object.values(CHART_COLORS_OPACITY).length]);
            stage_borderColor.push(Object.values(CHART_COLORS)[i % Object.values(CHART_COLORS).length]);
        }

        let emp_list = [...new Map(filtered_pipeline_chart_DF.map(item => [
            item['employee_id'],
            {
                emp_id: item['employee_id'],
                emp_fullname: item['employee_fullname'],
                stage_value: Object.fromEntries(stage_list.map(stage => [stage['opp_stage_title'], 0]))
            }
        ])).values()];

        filtered_pipeline_chart_DF.forEach(item => {
            const emp = emp_list.find(emp => emp.emp_id === item['employee_id']);
            if (emp && emp['stage_value'][item['opp_stage_title']] !== undefined) {
                emp['stage_value'][item['opp_stage_title']] += (item['value'] / cast_billion) || 0;
            }
        });

        emp_list.sort((a, b) => {
            const sumA = Object.values(a.stage_value).reduce((sum, value) => sum + value, 0);
            const sumB = Object.values(b.stage_value).reduce((sum, value) => sum + value, 0);
            return sumA - sumB;
        });

        emp_list = emp_list.filter(item => {
            return Object.values(item.stage_value).reduce((sum, value) => sum + value, 0) > 0;
        });

        // If no data, use sample data
        if (emp_list.length === 0) {
            emp_list = [];
            stage_list = [];
        }

        const series_data = stage_list.map((stage, index) => ({
            label: stage['opp_stage_title'],
            data: emp_list.slice(0, top_sale_number).map(item => parseFloat((item['stage_value'][stage['opp_stage_title']] || 0).toFixed(round))),
            backgroundColor: stage_backgroundColor[index],
            borderColor: stage_borderColor[index],
            borderWidth: 1
        }));

        // Don't reverse - keep sorted from high to low
        return [emp_list.map(item => item['emp_fullname']).slice(0, top_sale_number), series_data];
    }

    // Top Sale Chart Configuration - Synchronized with General Dashboard
    function TopSaleChartCfg(labelX, data_list, chart_title, titleX, titleY, indexAxis) {
        return {
            textStyle: {
                color: '#000',
                fontFamily: 'Arial, Helvetica, sans-serif'
            },
            title: {
                text: chart_title,
                left: 'center',
                textStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                }
            },
            tooltip: {
                trigger: 'item',
                confine: true,
                hideDelay: 300,
                enterable: true,
                formatter: function(params) {
                    if (params.componentType === 'series') {
                        const name = params.name;
                        const seriesName = params.seriesName;
                        const value = params.value;
                        return `${name}<br/>${params.marker} ${seriesName}: ${value ? value.toFixed(moneyRoundEle.val()) : '--'}`;
                    }
                    return '';
                }
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                right: '2%',
                top: '2%',
                feature: {
                    dataView: {
                        readOnly: false,
                        title: 'Xem dữ liệu',
                        lang: ['Dữ liệu', 'Đóng', 'Làm mới']
                    },
                    restore: {
                        title: 'Khôi phục'
                    },
                    saveAsImage: {
                        title: 'Lưu hình',
                        pixelRatio: 2
                    }
                }
            },
            legend: {
                data: data_list.map(item => item.label),
                bottom: 0,
                selectedMode: 'multiple'
            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '15%',
                top: '12%',
                containLabel: true
            },
            xAxis: {
                type: indexAxis === 'y' ? 'value' : 'category',
                data: indexAxis === 'y' ? undefined : labelX,
                name: indexAxis === 'y' ? titleX : undefined,
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: indexAxis === 'y' ? 'line' : 'shadow'
                }
            },
            yAxis: {
                type: indexAxis === 'y' ? 'category' : 'value',
                data: indexAxis === 'y' ? labelX : undefined,
                nameLocation: 'middle',
                nameGap: 60,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisLabel: {
                    formatter: function(value) {
                        if (typeof value === 'string' && value.length > 15) {
                            return value.substring(0, 15) + '...';
                        }
                        return value;
                    },
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: indexAxis === 'y' ? 'shadow' : 'line'
                }
            },
            animation: true,
            animationThreshold: 2000,
            animationDuration: 1000,
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return idx * 100;
            },
            animationDurationUpdate: 300,
            animationEasingUpdate: 'elasticOut',
            series: data_list.map((item, index) => ({
                name: item.label,
                type: 'bar',
                stack: 'total',
                data: item.data,
                itemStyle: {
                    color: item.backgroundColor,
                    borderRadius: [0, 0, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }))
        };
    }

    // Get forecast data
    function GetForecastChartDatasets() {
        const cast_billion = moneyDisplayEle.val() === '1' ? 1e9 : 1e6;
        const round = parseInt(moneyRoundEle.val() || 1);
        const winrate_threshold = parseFloat($('#winrate-threshold').val()) || 70;
        const forecast_viewby = $('#forecast-viewby').val();

        const type1_data = filtered_forecast_chart_DF.filter(item =>
            item['opp_stage_winrate'] <= winrate_threshold && item['opp_stage_winrate'] !== 0
        );
        const type2_data = filtered_forecast_chart_DF.filter(item =>
            item['opp_stage_winrate'] > winrate_threshold && item['opp_stage_winrate'] !== 100
        );

        if (forecast_viewby === '0') { // Month view
            let type1_data_by_month = Array(12).fill(0);
            let type2_data_by_month = Array(12).fill(0);

            type1_data.forEach(item => {
                let sub = GetSub(item['opp_close_date'], period_selected_Setting);
                if (sub && sub > 0 && sub <= 12) {
                    type1_data_by_month[sub - 1] += item['forecast_value'] / cast_billion;
                }
            });
            type2_data.forEach(item => {
                let sub = GetSub(item['opp_close_date'], period_selected_Setting);
                if (sub && sub > 0 && sub <= 12) {
                    type2_data_by_month[sub - 1] += item['forecast_value'] / cast_billion;
                }
            });

            // Round values
            type1_data_by_month = type1_data_by_month.map(val => parseFloat(val.toFixed(round)));
            type2_data_by_month = type2_data_by_month.map(val => parseFloat(val.toFixed(round)));

            // If no data, use sample data
            if (Math.max(...type1_data_by_month, ...type2_data_by_month) === 0) {
                type1_data_by_month = [80, 85, 90, 95, 100, 105, 110, 105, 100, 95, 90, 85];
                type2_data_by_month = [120, 130, 140, 150, 160, 170, 180, 170, 160, 150, 140, 130];
            }

            const series_data = [`≤ ${winrate_threshold}% (≠ 0%)`, `> ${winrate_threshold}% (≠ 100%)`].map(
                (type, index) => ({
                    label: type,
                    data: type === `≤ ${winrate_threshold}% (≠ 0%)` ? type1_data_by_month : type2_data_by_month,
                    backgroundColor: [CHART_COLORS_OPACITY['purple'], CHART_COLORS_OPACITY['green']][index],
                    borderColor: [CHART_COLORS['purple'], CHART_COLORS['green']][index],
                    borderWidth: 1
                })
            );

            return [getMonthOrder(space_month_Setting), series_data];
        }
        else { // Quarter view
            let type1_data_by_quarter = Array(4).fill(0);
            let type2_data_by_quarter = Array(4).fill(0);

            type1_data.forEach(item => {
                let quarter = GetQuarter(item['opp_close_date'], period_selected_Setting);
                if (quarter && quarter > 0 && quarter <= 4) {
                    type1_data_by_quarter[quarter - 1] += item['forecast_value'] / cast_billion;
                }
            });
            type2_data.forEach(item => {
                let quarter = GetQuarter(item['opp_close_date'], period_selected_Setting);
                if (quarter && quarter > 0 && quarter <= 4) {
                    type2_data_by_quarter[quarter - 1] += item['forecast_value'] / cast_billion;
                }
            });

            // Round values
            type1_data_by_quarter = type1_data_by_quarter.map(val => parseFloat(val.toFixed(round)));
            type2_data_by_quarter = type2_data_by_quarter.map(val => parseFloat(val.toFixed(round)));

            // If no data, use sample data
            if (Math.max(...type1_data_by_quarter, ...type2_data_by_quarter) === 0) {
                type1_data_by_quarter = [300, 350, 400, 350];
                type2_data_by_quarter = [400, 500, 600, 500];
            }

            const series_data = [`≤ ${winrate_threshold}% (≠ 0%)`, `> ${winrate_threshold}% (≠ 100%)`].map(
                (type, index) => ({
                    label: type,
                    data: type === `≤ ${winrate_threshold}% (≠ 0%)` ? type1_data_by_quarter : type2_data_by_quarter,
                    backgroundColor: [CHART_COLORS_OPACITY['purple'], CHART_COLORS_OPACITY['green']][index],
                    borderColor: [CHART_COLORS['purple'], CHART_COLORS['green']][index],
                    borderWidth: 1
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

    // Forecast Chart Configuration - Synchronized with General Dashboard
    function ForecastChartCfg(labelX, data_list, chart_title, titleX, titleY, indexAxis) {
        return {
            textStyle: {
                color: '#000',
                fontFamily: 'Arial, Helvetica, sans-serif'
            },
            title: {
                text: chart_title,
                left: 'center',
                textStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                }
            },
            tooltip: {
                trigger: 'item',
                confine: true,
                hideDelay: 300,
                enterable: true,
                formatter: function(params) {
                    if (params.componentType === 'series') {
                        const name = params.name;
                        const seriesName = params.seriesName;
                        const value = params.value;
                        return `${name}<br/>${params.marker} ${seriesName}: ${value ? value.toFixed(moneyRoundEle.val()) : '--'}`;
                    }
                    return '';
                }
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                right: '2%',
                top: '2%',
                feature: {
                    magicType: {
                        type: ['line', 'bar'],
                        title: {
                            line: 'Biểu đồ đường',
                            bar: 'Biểu đồ cột'
                        }
                    },
                    dataView: {
                        readOnly: false,
                        title: 'Xem dữ liệu',
                        lang: ['Dữ liệu', 'Đóng', 'Làm mới']
                    },
                    restore: {
                        title: 'Khôi phục'
                    },
                    saveAsImage: {
                        title: 'Lưu hình',
                        pixelRatio: 2
                    }
                }
            },
            legend: {
                data: data_list.map(item => item.label),
                bottom: 0,
                selectedMode: 'multiple'
            },
            grid: {
                left: '5%',
                right: '2%',
                bottom: '12%',
                top: '12%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: labelX,
                name: titleY,
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                }
            },
            yAxis: {
                type: 'value',
                name: titleX,
                nameLocation: 'middle',
                nameGap: 50,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                }
            },
            animation: true,
            animationThreshold: 2000,
            animationDuration: 1000,
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return idx * 100;
            },
            animationDurationUpdate: 300,
            animationEasingUpdate: 'elasticOut',
            series: data_list.map((item, index) => ({
                name: item.label,
                type: 'bar',
                stack: 'total',
                data: item.data,
                itemStyle: {
                    color: item.backgroundColor,
                    borderRadius: [0, 0, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }))
        };
    }

    // Get activity data
    function GetActivityChartDatasets() {
        const top_customer_number = parseInt($('#top-customer-number').val()) || 10;
        const activity_time = $('#activity-time').val();
        const activity_time_detail = $('#activity-time-detail').val();

        const customer_activity_map = new Map();
        let activity_chart_DF = filtered_pipeline_chart_DF;

        if (activity_time === '0' && activity_time_detail) { // Month
            activity_chart_DF = activity_chart_DF.filter(item => {
                let date = new Date(item['opp_open_date']);
                return date.getMonth() + 1 === parseInt(activity_time_detail);
            });
        }
        else if (activity_time === '1' && activity_time_detail) { // Quarter
            activity_chart_DF = activity_chart_DF.filter(item => 
                GetQuarter(item['opp_open_date'], period_selected_Setting) === parseInt(activity_time_detail)
            );
        }

        activity_chart_DF.forEach(item => {
            const customer_id = item['customer_id'];
            let customer_sum_activity = (item['customer_call'] || 0) + (item['customer_email'] || 0) + 
                                       (item['customer_meeting'] || 0) + (item['customer_document'] || 0);
            if (!customer_activity_map.has(customer_id)) {
                customer_activity_map.set(customer_id, {
                    'customer_id': item['customer_id'],
                    'customer_title': item['customer_title'],
                    'customer_call': item['customer_call'] || 0,
                    'customer_email': item['customer_email'] || 0,
                    'customer_meeting': item['customer_meeting'] || 0,
                    'customer_document': item['customer_document'] || 0,
                    'customer_sum_activity': customer_sum_activity
                });
            }
            else {
                let existing = customer_activity_map.get(customer_id);
                existing['customer_call'] += item['customer_call'] || 0;
                existing['customer_email'] += item['customer_email'] || 0;
                existing['customer_meeting'] += item['customer_meeting'] || 0;
                existing['customer_document'] += item['customer_document'] || 0;
                existing['customer_sum_activity'] += customer_sum_activity;
            }
        });

        let customer_activity_DF = Array.from(customer_activity_map.values()).filter(item => item['customer_sum_activity'] > 0);
        customer_activity_DF.sort((a, b) => b.customer_sum_activity - a.customer_sum_activity);

        // If no data, use sample data
        if (customer_activity_DF.length === 0) {
            customer_activity_DF = [
                { customer_title: 'Công ty ABC', customer_call: 45, customer_email: 38, customer_meeting: 25, customer_document: 15 },
                { customer_title: 'Công ty XYZ', customer_call: 40, customer_email: 35, customer_meeting: 20, customer_document: 12 },
                { customer_title: 'Công ty 123', customer_call: 35, customer_email: 30, customer_meeting: 18, customer_document: 10 },
                { customer_title: 'Công ty DEF', customer_call: 30, customer_email: 28, customer_meeting: 15, customer_document: 8 },
                { customer_title: 'Công ty GHI', customer_call: 25, customer_email: 25, customer_meeting: 12, customer_document: 6 }
            ];
        }

        const series_data = ['Call', 'Email', 'Meeting', 'Document'].map((type, index) => ({
            label: type === 'Call' ? trans_script.attr('data-trans-call') : 
                   type === 'Email' ? trans_script.attr('data-trans-email') : 
                   type === 'Meeting' ? trans_script.attr('data-trans-meeting') : 
                   trans_script.attr('data-trans-document'),
            data: customer_activity_DF.slice(0, top_customer_number).map(item => {
                return type === 'Call' ? item['customer_call'] : 
                       type === 'Email' ? item['customer_email'] : 
                       type === 'Meeting' ? item['customer_meeting'] : 
                       item['customer_document'];
            }),
            backgroundColor: [CHART_COLORS_OPACITY['orange'], CHART_COLORS_OPACITY['green'], 
                            CHART_COLORS_OPACITY['yellow'], CHART_COLORS_OPACITY['purple']][index],
            borderColor: [CHART_COLORS['orange'], CHART_COLORS['green'], 
                         CHART_COLORS['yellow'], CHART_COLORS['purple']][index],
            borderWidth: 1
        }));

        return [customer_activity_DF.map(item => item['customer_title']).slice(0, top_customer_number), series_data];
    }

    // Activity Chart Configuration - Synchronized with General Dashboard
    function ActivityChartCfg(labelX, data_list, chart_title, titleX, titleY, indexAxis) {
        return {
            textStyle: {
                color: '#000',
                fontFamily: 'Arial, Helvetica, sans-serif'
            },
            title: {
                text: chart_title,
                left: 'center',
                textStyle: {
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                }
            },
            tooltip: {
                trigger: 'item',
                confine: true,
                hideDelay: 300,
                enterable: true,
                formatter: function(params) {
                    if (params.componentType === 'series') {
                        const name = params.name;
                        const seriesName = params.seriesName;
                        const value = params.value;
                        return `${name}<br/>${params.marker} ${seriesName}: ${value}`;
                    }
                    return '';
                }
            },
            toolbox: {
                show: true,
                orient: 'horizontal',
                right: '2%',
                top: '2%',
                feature: {
                    dataView: {
                        readOnly: false,
                        title: 'Xem dữ liệu',
                        lang: ['Dữ liệu', 'Đóng', 'Làm mới']
                    },
                    restore: {
                        title: 'Khôi phục'
                    },
                    saveAsImage: {
                        title: 'Lưu hình',
                        pixelRatio: 2
                    }
                }
            },
            legend: {
                data: data_list.map(item => item.label),
                bottom: 0,
                selectedMode: 'multiple'
            },
            grid: {
                left: '5%',
                right: '2%',
                bottom: '12%',
                top: '12%',
                containLabel: true
            },
            xAxis: {
                type: indexAxis === 'y' ? 'value' : 'category',
                data: indexAxis === 'y' ? undefined : labelX,
                nameLocation: 'middle',
                nameGap: indexAxis === 'y' ? 35 : 45,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisLabel: {
                    rotate: indexAxis === 'y' ? 0 : 45,
                    formatter: function(value) {
                        return value && value.length > 10 ? value.substring(0, 10) + '...' : value;
                    },
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: indexAxis === 'y' ? 'line' : 'shadow'
                }
            },
            yAxis: {
                type: indexAxis === 'y' ? 'category' : 'value',
                data: indexAxis === 'y' ? labelX : undefined,
                nameLocation: 'middle',
                nameGap: indexAxis === 'y' ? 80 : 50,
                nameTextStyle: {
                    color: '#000',
                    fontWeight: 'bold',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisLabel: {
                    formatter: function(value) {
                        if (typeof value === 'string' && value.length > 15) {
                            return value.substring(0, 15) + '...';
                        }
                        return value;
                    },
                    fontFamily: 'Arial, Helvetica, sans-serif'
                },
                axisPointer: {
                    show: true,
                    type: indexAxis === 'y' ? 'shadow' : 'line'
                }
            },
            animation: true,
            animationThreshold: 2000,
            animationDuration: 1200,
            animationEasing: 'backOut',
            animationDelay: function (idx) {
                return idx * 80;
            },
            animationDurationUpdate: 300,
            animationEasingUpdate: 'backOut',
            series: data_list.map((item, index) => ({
                name: item.label,
                type: 'bar',
                stack: 'total',
                data: item.data,
                itemStyle: {
                    color: item.backgroundColor,
                    borderRadius: [0, 0, 0, 0]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                animationDelay: function (idx) {
                    return idx * 60;
                }
            }))
        };
    }

    // Event handlers
    $('#pipeline-group').on('change', function () {
        ProcessData(['pipeline']).then(() => {
            DrawTotalPipelineChart(false);
            DrawTopSaleChart(false);
        });
    });

    $('#forecast-group').on('change', function () {
        ProcessData(['forecast']).then(() => {
            DrawForecastChart(false);
        });
    });

    const top_sale_number = $('#top-sale-number');
    top_sale_number.on('change', function () {
        DrawTopSaleChart(false);
    });

    const winrate_threshold_ELe = $('#winrate-threshold');
    const forecast_viewby_Ele = $('#forecast-viewby');

    winrate_threshold_ELe.on('change', function () {
        DrawForecastChart(false);
    });

    forecast_viewby_Ele.on('change', function () {
        DrawForecastChart(false);
    });

    const activityTimeEle = $('#activity-time');
    activityTimeEle.on('change', function () {
        const activityTimeDetailEle = $('#activity-time-detail');
        activityTimeDetailEle.empty();
        
        if ($(this).val() === '0') { // Month
            activityTimeDetailEle.prop('disabled', false);
            let subs = period_selected_Setting ? period_selected_Setting['subs'] : [];
            for (let i = 0; i < subs.length; i++) {
                let sub = subs[i];
                if (sub) {
                    let value = sub['order'] + space_month_Setting;
                    activityTimeDetailEle.append(`<option value="${value <= 12 ? value : value - 12}">${moment(sub['start_date'], 'YYYY-MM-DD').format('MM/YYYY')}</option>`);
                }
            }
            // Fallback if no subs or moment not available
            if (activityTimeDetailEle.children().length === 0) {
                for (let i = 1; i <= 12; i++) {
                    activityTimeDetailEle.append(`<option value="${i}">${trans_script.attr(`data-trans-m${i}th`)}</option>`);
                }
            }
        }
        else if ($(this).val() === '1') { // Quarter
            activityTimeDetailEle.prop('disabled', false);
            for (let i = 1; i <= 4; i++) {
                activityTimeDetailEle.append(`<option value="${i}">${trans_script.attr(`data-trans-quarter-${i}`)}</option>`);
            }
        }
        else { // Whole year
            activityTimeDetailEle.prop('disabled', true);
        }
        DrawActivityChart(false);
    });

    const activityTimeDetailEle = $('#activity-time-detail');
    activityTimeDetailEle.on('change', function () {
        DrawActivityChart(false);
    });

    const top_customer_number = $('#top-customer-number');
    top_customer_number.on('change', function () {
        DrawActivityChart(false);
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (total_pipeline_chart) total_pipeline_chart.resize();
        if (top_sale_chart) top_sale_chart.resize();
        if (forecast_chart) forecast_chart.resize();
        if (activity_chart) activity_chart.resize();
    });

    // Load groups
    function LoadPipelineGroup(data) {
        if (typeof $.fn.initSelect2 === 'function') {
            pipelineGroupEle.initSelect2({
                allowClear: true,
                placeholder: trans_script.attr('data-trans-all'),
                ajax: {
                    url: pipelineGroupEle.attr('data-url'),
                    method: 'GET',
                },
                callbackDataResp: function (resp, keyResp) {
                    return resp.data ? resp.data[keyResp] : [];
                },
                templateResult: function (state) {
                    return $(`<div class="row w-100">
                    <div class="col-12">
                        <span>${state.data?.['title']}</span>
                        <span class="bflow-mirrow-badge-sm">Level ${state.data?.['level'] || ''} ${state.data?.['parent_n']?.['title'] ? `(${$.fn.gettext('Parent')}: ${state.data?.['parent_n']?.['title']})` : ''}</span>
                    </div>
                </div>`);
                },
                data: (data ? data : null),
                keyResp: 'group_list',
                keyId: 'id',
                keyText: 'title',
            });
        }
    }

    function LoadForecastGroup(data) {
        if (typeof $.fn.initSelect2 === 'function') {
            forecastGroupEle.initSelect2({
                allowClear: true,
                placeholder: trans_script.attr('data-trans-all'),
                ajax: {
                    url: forecastGroupEle.attr('data-url'),
                    method: 'GET',
                },
                callbackDataResp: function (resp, keyResp) {
                    return resp.data ? resp.data[keyResp] : [];
                },
                templateResult: function (state) {
                    return $(`<div class="row w-100">
                        <div class="col-12">
                            <span>${state.data?.['title']}</span>
                            <span class="bflow-mirrow-badge-sm">Level ${state.data?.['level'] || ''} ${state.data?.['parent_n']?.['title'] ? `(${$.fn.gettext('Parent')}: ${state.data?.['parent_n']?.['title']})` : ''}</span>
                        </div>
                    </div>`);
                },
                data: (data ? data : null),
                keyResp: 'group_list',
                keyId: 'id',
                keyText: 'title',
            });
        }
    }

    // Initialize
    LoadPeriod(current_period);
    LoadPipelineGroup();
    LoadForecastGroup();
    
    // Delay initial chart drawing to ensure DOM is ready
    setTimeout(() => {
        DrawAllChart(true);
    }, 100);
});