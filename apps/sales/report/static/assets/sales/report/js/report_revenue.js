$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-revenue-group');
        let boxEmployee = $('#box-report-revenue-employee');
        let boxStart = $('#report-revenue-date-from');
        let boxEnd = $('#report-revenue-date-to');
        let eleRevenue = $('#report-revenue-revenue');
        let eleGrossProfit = $('#report-revenue-gross-profit');
        let eleNetIncome = $('#report-revenue-net-income');
        let $table = $('#table_report_revenue_list');
        let $urlFact = $('#app-url-factory');
        let $transFact = $('#app-trans-factory');
        let eleFiscalYear = $('#data-fiscal-year');

        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                autoWidth: true,
                scrollX: true,
                scrollY: "450px",
                pageLength: 50,
                columns: [
                    {
                        targets: 0,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span>${row?.['employee_inherit']?.['full_name'] ? row?.['employee_inherit']?.['full_name'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            let link = $urlFact.attr('data-opp-detail').format_url_with_uuid(row?.['opportunity']?.['id']);
                            return `<a href="${link}" target="_blank" class="link-primary underline_hover">${row?.['opportunity']?.['title'] ? row?.['opportunity']?.['title'] : ''}</a>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '10%',
                        render: (data, type, row) => {
                            let text = "";
                            if (row?.['sale_order']?.['title']) {
                                text = $transFact.attr('data-filter-so');
                            }
                            if (row?.['lease_order']?.['title']) {
                                text = $transFact.attr('data-filter-lo');
                            }
                            return `<span>${text}</span>`;
                        }
                    },
                    {
                        targets: 3,
                        width: '10%',
                        render: (data, type, row) => {
                            let link = $urlFact.data('so-detail').format_url_with_uuid(row?.['sale_order']?.['id']);
                            let title = row?.['sale_order']?.['title'] ? row?.['sale_order']?.['title'] : '';
                            if (row?.['lease_order']?.['id'] && row?.['lease_order']?.['title']) {
                                link = $urlFact.data('lo-detail').format_url_with_uuid(row?.['lease_order']?.['id']);
                                title = row?.['lease_order']?.['title'] ? row?.['lease_order']?.['title'] : '';
                            }
                            return `<a href="${link}" class="link-primary underline_hover">${title}</a>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '5%',
                        render: (data, type, row) => {
                            if (row?.['date_approved']) {
                                return `<p>${moment(row?.['date_approved'] ? row?.['date_approved'] : '').format('DD/MM/YYYY')}</p>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 5,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<p>${row?.['customer']?.['title'] ? row?.['customer']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '13%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '13%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '13%',
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
                                        <button type="button" class="btn btn-light btn-sm ml-1" id="btn-open-filter" data-bs-toggle="offcanvas" data-bs-target="#filterCanvas">
                                            <span><span class="icon"><i class="fas fa-filter"></i></span><span>${$.fn.transEle.attr('data-filter')}</span></span>
                                        </button>
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
                                    let formattedStartDate = DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "DD/MM/YYYY", startDate);
                                    let formattedEndDate = DateTimeControl.formatDateType("YYYY-MM-DD hh:mm:ss", "DD/MM/YYYY", endDate);
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
                                                if (data.hasOwnProperty('report_revenue_list') && Array.isArray(data.report_revenue_list)) {
                                                    $table.DataTable().clear().draw();
                                                    $table.DataTable().rows.add(data.report_revenue_list).draw();
                                                    loadTotal();
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
            FormElementControl.loadInitS2(boxGroup, [], {}, null, true);
            FormElementControl.loadInitS2(boxEmployee, [], {}, null, true);
            // init date picker
            $('.date-picker').each(function () {
                DateTimeControl.initFlatPicker(this);
            });
            loadDbl();
            storeLoadInitByDataFiscalYear();
        }

        initData();

        // mask money
        $.fn.initMaskMoney2();

        // Prevent dropdown from closing when clicking inside the dropdown
        $('.dropdown-menu').on('click', '.form-group', function (e) {
            e.stopPropagation();
        });

        // Events
        boxGroup.on('change', function() {
            FormElementControl.loadInitS2(boxEmployee, [], {'group_id__in': boxGroup.val().join(',')}, null, true);
        });

        $('#btn-apply-filter').on('click', function () {
            let dataParams = {};
            let listViewBy = [];
            let listDate = [];
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
                let dateStart = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', boxStart.val());
                dataParams['date_approved__gte'] = formatStartDate(dateStart);
                listDate.push(boxStart.val());
            }
            if (boxEnd.val()) {
                let dateEnd = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', boxEnd.val());
                dataParams['date_approved__lte'] = formatEndDate(dateEnd);
                listDate.push(boxEnd.val());
            }
            const appliedAdvanceFilter = $('.filter-item').find('input[type="radio"]:checked')
            if(appliedAdvanceFilter.length > 0) {
                dataParams['advance_filter_id'] = $(appliedAdvanceFilter[0]).attr('id')
            }
            loadFilter(listDate, $('#card-filter-date'));
            WindowControl.showLoading();
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
                        if (data.hasOwnProperty('report_revenue_list') && Array.isArray(data.report_revenue_list)) {
                            $table.DataTable().clear().draw();
                            $table.DataTable().rows.add(data.report_revenue_list).draw();
                            loadTotal();
                            WindowControl.hideLoading();
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