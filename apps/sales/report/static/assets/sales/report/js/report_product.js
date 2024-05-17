$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-product-group');
        let boxEmployee = $('#box-report-product-employee');
        let boxProduct = $('#box-report-product-product');
        let boxCategory = $('#box-report-product-category');
        let boxStart = $('#report-product-date-from');
        let boxEnd = $('#report-product-date-to');
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
                autoWidth: true,
                scrollX: true,
                pageLength: 50,
                columns: [  // (1024p)
                    {
                        targets: 0,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<div class="row"><span class="badge badge-primary">${row?.['product']?.['code'] ? row?.['product']?.['code'] : ''}</span></div>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '20%',
                        render: (data, type, row) => {
                            return `<p class="text-primary">${row?.['product']?.['title'] ? row?.['product']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<p>${row?.['product']?.['general_product_category']?.['title'] ? row?.['product']?.['general_product_category']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-net-income" data-init-money="${parseFloat(row?.['net_income'])}"></span>`;
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                    loadTotal();
                    // add css to Dtb
                    loadCssToDtb('table_report_product_list');
                },
            });
        }

        function loadCssToDtb(tableID) {
            let tableIDWrapper = tableID + '_wrapper';
            let tableWrapper = document.getElementById(tableIDWrapper);
            if (tableWrapper) {
                let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
                if (headerToolbar) {
                    headerToolbar.classList.add('hidden');
                }
            }
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

        function loadFilter(listData, $eleShow) {
            $eleShow.html(`<div><small class="text-primary">${listData.join(" - ")}</small></div>`);
        }

        // load init
        function initData() {
            boxGroup.initSelect2({'allowClear': true,});
            boxProduct.initSelect2({'allowClear': true,});
            boxCategory.initSelect2({'allowClear': true,});
            loadBoxEmployee();
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
                drops: 'up',
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
            });
            $(this).val('').trigger('change');
        })

        // mask money
        $.fn.initMaskMoney2();

        // Prevent dropdown from closing when clicking inside the dropdown
        $('.dropdown-menu').on('click', function (e) {
            e.stopPropagation();
        });

        // Prevent the dropdown from closing when clicking outside it
        $('.btn-group').on('hide.bs.dropdown', function (e) {
            e.preventDefault();
        });

        // Reopen dropdown on button click
        $('.btn-group').on('click', '.btn', function (e) {
            $(this).siblings('.dropdown-menu').toggleClass('show');
        });

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

        $('#btn-apply-vb, #btn-apply-date').on('click', function () {
            this.closest('.dropdown-menu').classList.remove('show');
            let dataParams = {};
            let listViewBy = [];
            let listDate = [];
            if (boxGroup.val() && boxGroup.val().length > 0) {
                dataParams['employee_inherit__group_id__in'] = boxGroup.val().join(',');
                for (let text of boxGroup[0].innerText.split("\n")) {
                    listViewBy.push(text);
                }
            }
            if (boxEmployee.val() && boxEmployee.val().length > 0) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
                for (let text of boxEmployee[0].innerText.split("\n")) {
                    listViewBy.push(text);
                }
            }
            if (boxCategory.val() && boxCategory.val().length > 0) {
                dataParams['product__general_product_category_id'] = boxCategory.val().join(',');
                for (let text of boxCategory[0].innerText.split("\n")) {
                    listViewBy.push(text);
                }
            }
            if (boxProduct.val() && boxProduct.val().length > 0) {
                dataParams['product_id__in'] = boxProduct.val().join(',');
                for (let text of boxProduct[0].innerText.split("\n")) {
                    listViewBy.push(text);
                }
            }
            loadFilter(listViewBy, $('#card-filter-vb'));
            if (boxStart.val()) {
                let dateStart = moment(boxStart.val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
                dataParams['date_approved__gte'] = formatStartDate(dateStart);
                listDate.push(boxStart.val());
            }
            if (boxEnd.val()) {
                let dateEnd = moment(boxEnd.val(), 'DD/MM/YYYY').format('YYYY-MM-DD');
                dataParams['date_approved__lte'] = formatEndDate(dateEnd);
                listDate.push(boxEnd.val());
            }
            loadFilter(listDate, $('#card-filter-date'));
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

        $('#btn-cancel-vb, #btn-cancel-date').on('click', function () {
            this.closest('.dropdown-menu').classList.remove('show');
        });


    });
});