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
                // pageLength: 50,
                paging: false,
                info: false,
                columns: [
                    {
                        targets: 0,
                        width: '25%',
                        render: (data, type, row) => {
                            let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                            if (row?.['is_product'] === true) {
                                let target = ".cl-" + row?.['product']?.['id'].replace(/-/g, "");
                                return `<button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-xs table-row-task cl-parent" 
                                        data-bs-toggle="collapse"
                                        data-bs-target="${target}"
                                        data-bs-placement="top"
                                        aria-expanded="true"
                                        aria-controls="newGroup"
                                        data-group-order="${row?.['product']?.['id']}"
                                        data-row="${dataRow}"
                                    >
                                        <span class="icon"><i class="fas fa-chevron-right"></i></span>
                                    </button>
                                    <span class="badge badge-soft-success">${row?.['product']?.['code'] ? row?.['product']?.['code'] : ''}</span>
                                    <span>${row?.['product']?.['title'] ? row?.['product']?.['title'] : ''}</span>`;
                            }
                            return `<span class="badge badge-secondary badge-outline cl-child" data-row="${dataRow}">${row?.['sale_order']?.['customer']?.['code'] ? row?.['sale_order']?.['customer']?.['code'] : ''}</span>
                                    <span>${row?.['sale_order']?.['customer']?.['title'] ? row?.['sale_order']?.['customer']?.['title'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['is_product'] === true) {
                                return `<p>${row?.['product']?.['general_product_category']?.['title'] ? row?.['product']?.['general_product_category']?.['title'] : ''}</p>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 2,
                        width: '5%',
                        render: (data, type, row) => {
                            if (row?.['is_product'] === true) {
                                return `<p>${row?.['product']?.['uom']?.['title'] ? row?.['product']?.['uom']?.['title'] : ''}</p>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 3,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['quantity'] ? row?.['quantity'] : 0}</p>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<span class="table-row-rate-gross-profit">${row?.['rate_gross_profit'] ? row?.['rate_gross_profit'] : 0} %</span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-net-income" data-init-money="${parseFloat(row?.['net_income'])}"></span>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<span class="table-row-rate-net-income">${row?.['rate_net_income'] ? row?.['rate_net_income'] : 0} %</span>`;
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

        function loadSetCollapse() {
            for (let child of $table[0].querySelectorAll('.cl-child')) {
                if (child.getAttribute('data-row')) {
                    let dataRow = JSON.parse(child.getAttribute('data-row'));
                    let row = child.closest('tr');
                    let cls = '';
                    if (dataRow?.['product']?.['id']) {
                        cls = 'cl-' + dataRow?.['product']?.['id'].replace(/-/g, "");
                    }
                    row.classList.add(cls);
                    row.classList.add('collapse');
                    // row.classList.add('show');
                }
            }
            $table.DataTable().rows().every(function () {
                let row = this.node();
                if (row.querySelector('.cl-parent')) {
                    row.querySelector('.cl-parent').addEventListener('click', function () {
                        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
                    });
                }
            });


            return true;
        }

        function setupDataLoadTable(dataList) {
            let result = [];
            let dataByProduct = {};
            for (let data of dataList) {
                if (data?.['product']?.['id']) {
                    if (!dataByProduct.hasOwnProperty(data?.['product']?.['id'])) {
                        data['is_product'] = true;
                        dataByProduct[data?.['product']?.['id']] = data;
                        dataByProduct[data?.['product']?.['id']]['customer_data'] = {};
                        dataByProduct[data?.['product']?.['id']]['customer_data'][data?.['sale_order']?.['customer']?.['id']] = {
                            'sale_order': data?.['sale_order'],
                            'product': data?.['product'],
                            'revenue': data?.['revenue'],
                            'gross_profit': data?.['gross_profit'],
                            'net_income': data?.['net_income'],
                            'quantity': data?.['quantity'],
                        };
                    } else {
                        dataByProduct[data?.['product']?.['id']]['revenue'] += data?.['revenue'];
                        dataByProduct[data?.['product']?.['id']]['gross_profit'] += data?.['gross_profit'];
                        dataByProduct[data?.['product']?.['id']]['net_income'] += data?.['net_income'];
                        dataByProduct[data?.['product']?.['id']]['quantity'] += data?.['quantity'];
                        // setup customer
                        if (!dataByProduct[data?.['product']?.['id']]['customer_data'].hasOwnProperty(data?.['sale_order']?.['customer']?.['id'])) {
                            dataByProduct[data?.['product']?.['id']]['customer_data'][data?.['sale_order']?.['customer']?.['id']] = {
                                'sale_order': data?.['sale_order'],
                                'product': data?.['product'],
                                'revenue': data?.['revenue'],
                                'gross_profit': data?.['gross_profit'],
                                'net_income': data?.['net_income'],
                                'quantity': data?.['quantity'],
                                'is_customer': true,
                            }
                        } else {
                            dataByProduct[data?.['product']?.['id']]['customer_data'][data?.['sale_order']?.['customer']?.['id']]['revenue'] += data?.['revenue'];
                            dataByProduct[data?.['product']?.['id']]['customer_data'][data?.['sale_order']?.['customer']?.['id']]['gross_profit'] += data?.['gross_profit'];
                            dataByProduct[data?.['product']?.['id']]['customer_data'][data?.['sale_order']?.['customer']?.['id']]['net_income'] += data?.['net_income'];
                            dataByProduct[data?.['product']?.['id']]['customer_data'][data?.['sale_order']?.['customer']?.['id']]['quantity'] += data?.['quantity'];
                        }
                    }
                }
            }
            for (let keyProduct in dataByProduct) {
                dataByProduct[keyProduct]['rate_gross_profit'] = Math.round(dataByProduct[keyProduct]?.['gross_profit'] / dataByProduct[keyProduct]?.['revenue'] * 100);
                dataByProduct[keyProduct]['rate_net_income'] = Math.round(dataByProduct[keyProduct]?.['net_income'] / dataByProduct[keyProduct]?.['revenue'] * 100);
                result.push(dataByProduct[keyProduct]);
                for (let keyCus in dataByProduct[keyProduct]['customer_data']) {
                    dataByProduct[keyProduct]['customer_data'][keyCus]['rate_gross_profit'] = Math.round(dataByProduct[keyProduct]['customer_data'][keyCus]?.['gross_profit'] / dataByProduct[keyProduct]['customer_data'][keyCus]?.['revenue'] * 100);
                    dataByProduct[keyProduct]['customer_data'][keyCus]['rate_net_income'] = Math.round(dataByProduct[keyProduct]['customer_data'][keyCus]?.['net_income'] / dataByProduct[keyProduct]['customer_data'][keyCus]?.['revenue'] * 100);
                    result.push(dataByProduct[keyProduct]['customer_data'][keyCus]);
                }
            }
            $table.DataTable().clear().draw();
            $table.DataTable().rows.add(result).draw();
            loadSetCollapse();
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
            if (listData.length > 0) {
                $eleShow.html(`<div><small class="text-primary">${listData.join(" - ")}</small></div>`);
            } else {
                $eleShow.html(``);
            }
        }

        function getListTxtMultiSelect2 ($ele) {
            let result = [];
            if ($ele.val() && $ele.val().length > 0) {
                let selectedValues = $ele.val();
                let tempDiv = document.createElement('div');
                tempDiv.innerHTML = $ele[0].innerHTML;
                for (let val of selectedValues) {
                    let option = tempDiv.querySelector(`option[value="${val}"]`);
                    if (option) {
                        result.push(option.textContent);
                    }
                }
            }
            return result;
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
        $('.dropdown-menu').on('click', '.form-group', function (e) {
            e.stopPropagation();
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

        $('#btn-apply-filter').on('click', function () {
            // this.closest('.dropdown-menu').classList.remove('show');
            let dataParams = {};
            let listViewBy = [];
            let listDate = [];
            if (boxCategory.val() && boxCategory.val().length > 0) {
                dataParams['product__general_product_category_id'] = boxCategory.val().join(',');
                let listTxt = getListTxtMultiSelect2(boxCategory);
                for (let txt of listTxt) {
                    listViewBy.push(txt);
                }
            }
            if (boxProduct.val() && boxProduct.val().length > 0) {
                dataParams['product_id__in'] = boxProduct.val().join(',');
                let listTxt = getListTxtMultiSelect2(boxProduct);
                for (let txt of listTxt) {
                    listViewBy.push(txt);
                }
            }
            if (boxGroup.val() && boxGroup.val().length > 0) {
                dataParams['employee_inherit__group_id__in'] = boxGroup.val().join(',');
                let listTxt = getListTxtMultiSelect2(boxGroup);
                for (let txt of listTxt) {
                    listViewBy.push(txt);
                }
            }
            if (boxEmployee.val() && boxEmployee.val().length > 0) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
                let listTxt = getListTxtMultiSelect2(boxEmployee);
                for (let txt of listTxt) {
                    listViewBy.push(txt);
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