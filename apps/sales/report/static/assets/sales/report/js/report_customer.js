$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-customer-group');
        let boxEmployee = $('#box-report-customer-employee');
        let boxCustomer = $('#box-report-customer-customer');
        let boxStart = $('#report-customer-date-from');
        let boxEnd = $('#report-customer-date-to');
        let btnView = $('#btn-view');
        let eleRevenue = $('#report-customer-revenue');
        let eleGrossProfit = $('#report-customer-gross-profit');
        let eleNetIncome = $('#report-customer-net-income');
        let $table = $('#table_report_customer_list');
        let eleFiscalYear = $('#data-fiscal-year');
        let $urlFact = $('#app-url-factory');
        let $transFact = $('#app-trans-factory');

        function loadDbl(data) {
            $table.DataTableDefault({
                ajax: {
                    url: $table.attr('data-url'),
                    // dataSrc: 'data.report_customer_list',
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            let dataResult = resp.data['report_customer_list'] ? resp.data['report_customer_list'] : [];
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
                columns: [
                    {
                        targets: 0,
                        width: '10%',
                        render: (data, type, row) => {
                            let link = $urlFact.attr('data-customer-detail').format_url_with_uuid(row?.['customer']?.['id']);
                            return `<a href="${link}" target="_blank" class="link-primary underline_hover">${row?.['customer']?.['code'] ? row?.['customer']?.['code'] : ''}</a>`;
                        }
                    },
                    {
                        targets: 0,
                        width: '30%',
                        render: (data, type, row) => {
                            let link = $urlFact.attr('data-customer-detail').format_url_with_uuid(row?.['customer']?.['id']);
                            return `<a href="${link}" target="_blank" class="link-primary underline_hover">${row?.['customer']?.['title'] ? row?.['customer']?.['title'] : ''}</a>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<p>${row?.['customer']?.['industry']?.['title'] ? row?.['customer']?.['industry']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 3,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 4,
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
                    dtbHDCustom();
                },
            });
        }

        function dtbHDCustom() {
            let wrapper$ = $table.closest('.dataTables_wrapper');
            let $theadEle = wrapper$.find('thead');
            if ($theadEle.length > 0) {
                for (let thEle of $theadEle[0].querySelectorAll('th')) {
                    if (!$(thEle).hasClass('border-right')) {
                        $(thEle).addClass('border-right');
                    }
                }
            }
            let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
            if (headerToolbar$.length > 0) {
                if (!$('#btn-open-filter').length) {
                    let $group = $(`<div class="btn-filter">
                                        <div class="d-flex justify-content-end align-items-center">
                                            <div class="btn-group dropdown ml-1" data-bs-toggle="tooltip" title="${$transFact.attr('data-filter')}">
                                                <button type="button" class="btn btn-light ml-1" id="btn-open-filter" data-bs-toggle="offcanvas" data-bs-target="#filterCanvas">
                                                    <span><span class="icon"><i class="fas fa-filter"></i></span></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>`);
                    headerToolbar$.append($group);
                }
            }
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
                                                if (data.hasOwnProperty('report_customer_list') && Array.isArray(data.report_customer_list)) {
                                                    setupDataLoadTable(data.report_customer_list);
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
            loadInitS2(boxGroup, [], {}, null, true);
            loadInitS2(boxEmployee, [], {}, null, true);
            loadInitS2(boxCustomer, [], {}, null, true);
            loadDbl();
            btnView.click();
        }

        initData();

        function loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
            let opts = {'allowClear': isClear};
            $ele.empty();
            if (data.length > 0) {
                opts['data'] = data;
            }
            if (Object.keys(dataParams).length !== 0) {
                opts['dataParams'] = dataParams;
            }
            if ($modal) {
                opts['dropdownParent'] = $modal;
            }
            if (Object.keys(customRes).length !== 0) {
                opts['templateResult'] = function (state) {
                    let res1 = `<span class="badge badge-soft-primary mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                    let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                    return $(`<span>${res1} ${res2}</span>`);
                }
            }
            $ele.initSelect2(opts);
            return true;
        }

        // init date picker
        $('.date-picker').each(function () {
            DateTimeControl.initDatePicker(this);
        });

        // mask money
        $.fn.initMaskMoney2();

        // Prevent dropdown from closing when clicking inside the dropdown
        $('.dropdown-menu').on('click', '.form-group', function (e) {
            e.stopPropagation();
        });

        // Events
        boxGroup.on('change', function() {
            loadInitS2(boxEmployee, [], {'group_id__in': boxGroup.val().join(',')}, null, true);
        });

        $('#btn-apply-filter').on('click', function () {
            let dataParams = {};
            let listViewBy = [];
            let listDate = [];
            if (boxCustomer.val() && boxCustomer.val().length > 0) {
                dataParams['customer_id__in'] = boxCustomer.val().join(',');
                let listTxt = getListTxtMultiSelect2(boxCustomer);
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
                        if (data.hasOwnProperty('report_customer_list') && Array.isArray(data.report_customer_list)) {
                            setupDataLoadTable(data.report_customer_list);
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