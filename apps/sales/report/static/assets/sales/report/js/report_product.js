$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-product-group');
        let boxEmployee = $('#box-report-product-employee');
        let boxProduct = $('#box-report-product-product');
        let boxCategory = $('#box-report-product-category');
        let btnView = $('#btn-view');
        let eleRevenue = $('#report-product-revenue');
        let eleGrossProfit = $('#report-product-gross-profit');
        let eleNetIncome = $('#report-product-net-income');
        let $table = $('#table_report_product_list');
        let eleFiscalYear = $('#data-fiscal-year');

        function loadDbl(data) {
            $table.DataTableDefault({
                ajax: {
                    url: $table.attr('data-url'),
                    // dataSrc: 'data.report_product_list',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            let dataResult = resp.data['report_product_list'] ? resp.data['report_product_list'] : [];
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
                            return `<div class="row"><span class="badge badge-primary">${row?.['product']?.['code'] ? row?.['product']?.['code'] : ''}</span></div>`;
                        }
                    },
                    {
                        targets: 1,
                        class: 'w-20',
                        render: (data, type, row) => {
                            return `<p class="text-primary">${row?.['product']?.['title'] ? row?.['product']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        class: 'w-15',
                        render: (data, type, row) => {
                            return `<p>${row?.['product']?.['general_product_category']?.['title'] ? row?.['product']?.['general_product_category']?.['title'] : ''}</p>`;
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
            let dataByProduct = {};
            for (let data of dataList) {
                if (data?.['product']?.['id']) {
                    if (!dataByProduct.hasOwnProperty(data?.['product']?.['id'])) {
                        dataByProduct[data?.['product']?.['id']] = data;
                    } else {
                        dataByProduct[data?.['product']?.['id']]['revenue'] += data?.['revenue'];
                        dataByProduct[data?.['product']?.['id']]['gross_profit'] += data?.['gross_profit'];
                        dataByProduct[data?.['product']?.['id']]['net_income'] += data?.['net_income'];
                    }
                }
            }
            for (let keyProduct in dataByProduct) {
                result.push(dataByProduct[keyProduct]);
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
                                                if (data.hasOwnProperty('report_product_list') && Array.isArray(data.report_product_list)) {
                                                    setupDataLoadTable(data.report_product_list);
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

        function loadBoxProduct() {
            boxProduct.empty();
            let dataParams = {};
            if (boxCategory.val()) {
                dataParams['category_id__in'] = boxCategory.val().join(',');
            }
            boxProduct.initSelect2({
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
            boxProduct.initSelect2({'allowClear': true,});
            boxCategory.initSelect2({'allowClear': true,});
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

        boxCategory.on('change', function() {
            loadBoxProduct();
            $table.DataTable().clear().draw();
            loadTotal();
        });

        boxProduct.on('change', function() {
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
            if (boxCategory.val()) {
                dataParams['product__general_product_category_id'] = boxCategory.val().join(',');
            }
            if (boxProduct.val()) {
                dataParams['product_id__in'] = boxProduct.val().join(',');
            }
            let date = $('#report-product-date-approved').val();
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
                        if (data.hasOwnProperty('report_product_list') && Array.isArray(data.report_product_list)) {
                            setupDataLoadTable(data.report_product_list);
                        }
                    }
                }
            )
        });


    });
});