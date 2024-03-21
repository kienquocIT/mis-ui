$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-customer-group');
        let boxEmployee = $('#box-report-customer-employee');
        let boxCustomer = $('#box-report-customer-customer');
        let btnView = $('#btn-view');
        let eleRevenue = $('#report-customer-revenue');
        let eleGrossProfit = $('#report-customer-gross-profit');
        let eleNetIncome = $('#report-customer-net-income');
        let $table = $('#table_report_customer_list');

        function loadDbl(data) {
            $table.DataTableDefault({
                ajax: {
                    url: $table.attr('data-url'),
                    dataSrc: 'data.report_customer_list',
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
        loadDbl();

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
            boxCustomer.initSelect2({'allowClear': true,});
            loadBoxEmployee();
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

        boxCustomer.on('change', function() {
            $table.DataTable().clear().draw();
            loadTotal();
        });

        btnView.on('click', function () {
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['group_inherit_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val()) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            if (boxCustomer.val()) {
                dataParams['customer_id__in'] = boxCustomer.val().join(',');
            }
            let date = $('#report-customer-date-approved').val();
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
                        if (data.hasOwnProperty('report_customer_list') && Array.isArray(data.report_customer_list)) {
                            setupDataLoadTable(data.report_customer_list);
                        }
                    }
                }
            )
        });


    });
});