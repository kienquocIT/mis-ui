$(function () {
    "use strict";

    /**
     * Task Dashboard Analytics
     * Phân tích và visualize dữ liệu task theo:
     * 1. Task theo tháng (Monthly)
     * 2. Task theo tuần (Weekly)
     * 3. Task theo trạng thái (Status)
     * 4. Theo nhân viên (Employees - Assigned & Completed)
     */

    class TaskDashboardAnalytics {
        constructor(taskList = []) {
            this.taskList = taskList;
            this.chartConfigs = {};
            this.initCharts();
        }

        /**
         * Parse date and get month/year
         */
        getMonthYear(dateStr) {
            if (!dateStr) return null;
            const date = moment(dateStr, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD']);
            return date.isValid() ? date.format('MM/YYYY') : null;
        }

        /**
         * Parse date and get week number and year
         * Format: W##/YYYY (e.g., W01/2025, W52/2024)
         */
        getWeekYear(dateStr) {
            if (!dateStr) return null;
            const date = moment(dateStr, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD']);
            return date.isValid() ? `W${date.format('WW')}/${date.format('YYYY')}` : null;
        }

        /**
         * Parse date and get day only
         */
        getDayOnly(dateStr) {
            if (!dateStr) return null;
            const date = moment(dateStr, ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD']);
            return date.isValid() ? date.format('YYYY-MM-DD') : null;
        }

        /**
         * 1. Analyze Tasks by Month
         * Returns: { 'MM/YYYY': count, ... }
         */
        analyzeTasksByMonth() {
            const monthlyData = {};

            this.taskList.forEach(task => {
                const monthYear = this.getMonthYear(task.end_date);
                if (monthYear) {
                    monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
                }
            });

            // Sort by date
            const sorted = Object.entries(monthlyData)
                .sort((a, b) => moment(a[0], 'MM/YYYY').diff(moment(b[0], 'MM/YYYY')))
                .reduce((obj, [key, value]) => {
                    obj[key] = value;
                    return obj;
                }, {});

            return sorted;
        }

        /**
         * 2. Analyze Tasks by Week
         * Returns: { 'W##/YYYY': count, ... }
         * Example: { 'W01/2025': 3, 'W02/2025': 5, ... }
         */
        analyzeTasksByWeek() {
            const weeklyData = {};

            this.taskList.forEach(task => {
                const weekYear = this.getWeekYear(task.end_date);
                if (weekYear) {
                    weeklyData[weekYear] = (weeklyData[weekYear] || 0) + 1;
                }
            });

            // Sort by year first, then by week number
            const sorted = Object.entries(weeklyData)
                .sort((a, b) => {
                    // Parse format: 'W##/YYYY'
                    const [weekA, yearA] = a[0].split('/');
                    const [weekB, yearB] = b[0].split('/');

                    // Compare by year first
                    if (yearA !== yearB) {
                        return yearA.localeCompare(yearB);
                    }

                    // If same year, compare by week number
                    const weekNumA = parseInt(weekA.replace('W', ''));
                    const weekNumB = parseInt(weekB.replace('W', ''));
                    return weekNumA - weekNumB;
                })
                .reduce((obj, [key, value]) => {
                    obj[key] = value;
                    return obj;
                }, {});

            return sorted;
        }

        /**
         * 3. Analyze Tasks by Status
         * Returns: { 'Status Name': count, ... }
         */
        analyzeTasksByStatus() {
            const statusData = {};

            this.taskList.forEach(task => {
                if (task.task_status) {
                    const statusName = task.task_status.name || task.task_status.title || 'Unknown';
                    statusData[statusName] = (statusData[statusName] || 0) + 1;
                }
            });

            return statusData;
        }

        /**
         * 4. Analyze Tasks by Employee
         * Returns: {
         *   assignees: { 'Employee Name': count },
         *   completed: { 'Employee Name': count }
         * }
         */
        analyzeTasksByEmployee() {
            const assignees = {};
            const completed = {};

            this.taskList.forEach(task => {
                // Count assignees (người được giao việc)
                if (task.employee_inherit && Object.keys(task.employee_inherit).length > 0) {
                    const empName = task.employee_inherit.full_name ||
                                   `${task.employee_inherit.first_name} ${task.employee_inherit.last_name}`;
                    assignees[empName] = (assignees[empName] || 0) + 1;

                    // Count completed (hoàn thành = 100% hoặc status là finish)
                    if (task.percent_completed === 100 || (task.task_status && task.task_status.is_finish)) {
                        completed[empName] = (completed[empName] || 0) + 1;
                    }
                }
            });

            return { assignees, completed };
        }

        /**
         * Get statistics overview
         */
        getStatistics() {
            const stats = {
                totalTasks: this.taskList.length,
                completedTasks: this.taskList.filter(t => t.percent_completed === 100 || (t.task_status && t.task_status.is_finish)).length,
                inProgressTasks: this.taskList.filter(t => t.percent_completed > 0 && t.percent_completed < 100).length,
                pendingTasks: this.taskList.filter(t => t.percent_completed === 0).length,
                totalEmployees: new Set(
                    this.taskList
                        .filter(t => t.employee_inherit && Object.keys(t.employee_inherit).length > 0)
                        .map(t => t.employee_inherit.id)
                ).size
            };

            stats.completionRate = stats.totalTasks > 0
                ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                : 0;

            return stats;
        }

        /**
         * Initialize all charts
         */
        initCharts() {
            this.createMonthlyChart();
            this.createWeeklyChart();
            this.createStatusChart();
            this.createEmployeeChart();
            this.displayStatistics();
        }

        /**
         * Create Monthly Chart (Line Chart)
         */
        createMonthlyChart() {
            const monthlyData = this.analyzeTasksByMonth();
            const labels = Object.keys(monthlyData);
            const data = Object.values(monthlyData);

            const options = {
                chart: {
                    type: 'line',
                    height: 350,
                    sparkline: { enabled: false },
                    toolbar: { show: true }
                },
                title: {
                    text: 'Task Theo Tháng',
                    align: 'left',
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }
                },
                series: [{
                    name: 'Số Task',
                    data: data
                }],
                xaxis: {
                    categories: labels,
                    title: {
                        text: 'Tháng'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Số Lượng'
                    }
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                markers: {
                    size: 5
                },
                colors: ['#0084FF'],
                dataLabels: {
                    enabled: true
                }
            };

            this.chartConfigs.monthly = options;
            if ($('#chartMonthly').length) {
                new ApexCharts(document.querySelector('#chartMonthly'), options).render();
            }
        }

        /**
         * Create Weekly Chart (Bar Chart)
         */
        createWeeklyChart() {
            const weeklyData = this.analyzeTasksByWeek();
            const labels = Object.keys(weeklyData);
            const data = Object.values(weeklyData);

            const options = {
                chart: {
                    type: 'bar',
                    height: 350,
                    sparkline: { enabled: false },
                    toolbar: { show: true }
                },
                title: {
                    text: 'Task Theo Tuần',
                    align: 'left',
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }
                },
                series: [{
                    name: 'Số Task',
                    data: data
                }],
                xaxis: {
                    categories: labels,
                    title: {
                        text: 'Tuần'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Số Lượng'
                    }
                },
                colors: ['#10B981'],
                dataLabels: {
                    enabled: true,
                    position: 'top'
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%'
                    }
                }
            };

            this.chartConfigs.weekly = options;
            if ($('#chartWeekly').length) {
                new ApexCharts(document.querySelector('#chartWeekly'), options).render();
            }
        }

        /**
         * Create Status Chart (Pie/Donut Chart)
         */
        createStatusChart() {
            const statusData = this.analyzeTasksByStatus();
            const labels = Object.keys(statusData);
            const data = Object.values(statusData);

            const colors = [
                '#0084FF', '#10B981', '#F59E0B', '#EF4444',
                '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1'
            ];

            const options = {
                chart: {
                    type: 'donut',
                    height: 350
                },
                title: {
                    text: 'Task Theo Trạng Thái',
                    align: 'left',
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }
                },
                labels: labels,
                series: data,
                colors: colors.slice(0, labels.length),
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return Math.round(val) + '%';
                    }
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%',
                            labels: {
                                show: true,
                                name: {
                                    show: true
                                },
                                value: {
                                    show: true,
                                    formatter: function (val) {
                                        return val;
                                    }
                                },
                                total: {
                                    show: true,
                                    label: 'Tổng Task',
                                    fontSize: '16px',
                                    fontWeight: 600
                                }
                            }
                        }
                    }
                },
                legend: {
                    position: 'bottom'
                }
            };

            this.chartConfigs.status = options;
            if ($('#chartStatus').length) {
                new ApexCharts(document.querySelector('#chartStatus'), options).render();
            }
        }

        /**
         * Create Employee Chart (Grouped Bar Chart)
         * So sánh số task được giao vs hoàn thành cho mỗi nhân viên
         */
        createEmployeeChart() {
            const employeeData = this.analyzeTasksByEmployee();
            const employees = Object.keys(employeeData.assignees);

            const assignedCounts = employees.map(emp => employeeData.assignees[emp] || 0);
            const completedCounts = employees.map(emp => employeeData.completed[emp] || 0);

            const options = {
                chart: {
                    type: 'bar',
                    height: 400,
                    sparkline: { enabled: false },
                    toolbar: { show: true }
                },
                title: {
                    text: 'Task Theo Nhân Viên',
                    align: 'left',
                    style: {
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }
                },
                series: [
                    {
                        name: 'Được Giao',
                        data: assignedCounts
                    },
                    {
                        name: 'Hoàn Thành',
                        data: completedCounts
                    }
                ],
                xaxis: {
                    categories: employees,
                    title: {
                        text: 'Nhân Viên'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Số Lượng'
                    }
                },
                colors: ['#3B82F6', '#10B981'],
                dataLabels: {
                    enabled: true,
                    position: 'top'
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%'
                    }
                },
                legend: {
                    position: 'top'
                }
            };

            this.chartConfigs.employee = options;
            if ($('#chartEmployee').length) {
                new ApexCharts(document.querySelector('#chartEmployee'), options).render();
            }
        }

        /**
         * Display statistics cards
         */
        displayStatistics() {
            const stats = this.getStatistics();

            if ($('#statTotalTasks').length) {
                $('#statTotalTasks').text(stats.totalTasks);
            }
            if ($('#statCompleted').length) {
                $('#statCompleted').text(stats.completedTasks);
            }
            if ($('#statInProgress').length) {
                $('#statInProgress').text(stats.inProgressTasks);
            }
            if ($('#statPending').length) {
                $('#statPending').text(stats.pendingTasks);
            }
            if ($('#statEmployees').length) {
                $('#statEmployees').text(stats.totalEmployees);
            }
            if ($('#statCompletionRate').length) {
                $('#statCompletionRate').text(stats.completionRate + '%');
            }
        }

        /**
         * Update dashboard with new task list
         */
        updateDashboard(newTaskList) {
            this.taskList = newTaskList;
            // Clear existing charts
            document.querySelectorAll('.apexcharts-canvas').forEach(el => el.remove());
            // Re-initialize
            this.initCharts();
        }

        /**
         * Export data as JSON
         */
        exportDataAsJSON() {
            const data = {
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                statistics: this.getStatistics(),
                monthlyAnalysis: this.analyzeTasksByMonth(),
                weeklyAnalysis: this.analyzeTasksByWeek(),
                statusAnalysis: this.analyzeTasksByStatus(),
                employeeAnalysis: this.analyzeTasksByEmployee()
            };

            return JSON.stringify(data, null, 2);
        }

        /**
         * Download report as JSON file
         */
        downloadReport() {
            const jsonData = this.exportDataAsJSON();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `task-report-${moment().format('YYYY-MM-DD')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    // Export to global scope for use in other scripts
    window.TaskDashboardAnalytics = TaskDashboardAnalytics;

    // Auto-initialize if task data exists
    if (typeof taskListData !== 'undefined' && taskListData.length > 0) {
        window.dashboardAnalytics = new TaskDashboardAnalytics(taskListData);

        // Setup download button
        $('#btnDownloadReport').off().on('click', function () {
            window.dashboardAnalytics.downloadReport();
            $.fn.notifyB({ description: 'Báo cáo đã được tải xuống' }, 'success');
        });

        // Setup refresh button
        $('#btnRefreshDashboard').off().on('click', function () {
            // Re-fetch data from API and update
            $.fn.callAjax2({
                'url': $('#url-factory').attr('data-task-list'),
                'method': 'GET'
            }).then((req) => {
                let data = $.fn.switcherResp(req);
                if (data?.['status'] === 200 && data?.['task_list']) {
                    window.dashboardAnalytics.updateDashboard(data['task_list']);
                    $.fn.notifyB({ description: 'Dashboard đã được cập nhật' }, 'success');
                }
            });
        });
    }

}, jQuery);
