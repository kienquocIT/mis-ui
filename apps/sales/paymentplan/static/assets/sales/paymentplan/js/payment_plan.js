$(function () {
    $(document).ready(function () {

        let $dtbArea = $('#dtb-area');
        let $table = $('#table_payment_plan');
        let $btnGroup = $('#btn-group-view');
        let $btnDay = $('#btn-view-day');
        let $btnWeek = $('#btn-view-week');
        let $btnMonth = $('#btn-view-month');
        let boxCustomer = $('#box-customer');
        let boxSO = $('#box-so');
        let boxPO = $('#box-po');
        let boxStart = $('#date-from');
        let boxEnd = $('#date-to');
        let $urlFact = $('#app-url-factory');
        let $transFact = $('#app-trans-factory');
        let eleFiscalYear = $('#data-fiscal-year');
        let dataMonth = JSON.parse($('#filter_month').text());

        let htmlDtb = `<table
                                class="table nowrap w-100 table_payment_plan"
                                data-url="${$urlFact.attr('data-payment-plan')}"
                                data-method="get"
                        >
                            <thead>
                            <tr class="bg-light"></tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>`;
        let staticHeaders = {
            0: 'Document',
            1: 'Partner',
            2: 'Installment',
            3: 'Invoice planed date',
            4: 'Invoice actual date',
            5: 'Over due',
            6: 'Balance due',
        };

        function loadDbl(data, columns) {
            $dtbArea.find('.table_payment_plan').DataTableDefault({
                data: data ? data : [],
                autoWidth: true,
                scrollX: true,
                fixedColumns: {
                    leftColumns: Object.keys(staticHeaders).length
                },
                pageLength: 50,
                columns: columns ? columns : [],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                    // add css to Dtb
                    dtbHDCustom();
                },
            });
        }

        function dtbHDCustom() {
            let wrapper$ = $dtbArea.find('.table_payment_plan').closest('.dataTables_wrapper');
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

        function customDtbCommon() {
            $dtbArea.empty();
            $dtbArea.append(htmlDtb);
            let $table = $dtbArea.find('.table_payment_plan');
            let minWidth = "min-w-2560p";
            for (let btn of $btnGroup[0].querySelectorAll('.btn-view')) {
                if ($(btn).hasClass('active')) {
                    if (btn === $btnDay[0]) {
                        minWidth = "min-w-4000p";
                    }
                }
            }
            $table.addClass(minWidth);
            let $theadRow = $table.find('thead tr');
            $theadRow.empty(); // Clear all headers first
            let columns = [];
            for (let key in staticHeaders) {
                $theadRow.append(`<th>${staticHeaders[key]}</th>`);
                columns.push(renderCustom(key));
            }
            return {"columns": columns, "$theadRow": $theadRow};
        }

        function renderCustom(key) {
            if (key === "0") {
                return {
                    width: '8%',
                    render: (data, type, row) => {
                        let link = $urlFact.data('so-detail').format_url_with_uuid(row?.['sale_order_data']?.['id']);
                        let title = row?.['sale_order_data']?.['title'] ? row?.['sale_order_data']?.['title'] : '';
                        if (row?.['purchase_order_data']?.['id'] && row?.['purchase_order_data']?.['title']) {
                            link = $urlFact.data('po-detail').format_url_with_uuid(row?.['purchase_order_data']?.['id']);
                            title = row?.['purchase_order_data']?.['title'] ? row?.['purchase_order_data']?.['title'] : '';
                        }
                        return `<a href="${link}" class="link-primary underline_hover">${title}</a>`;
                    }
                }
            }
            if (key === "1") {
                return {
                    width: '8%',
                    render: (data, type, row) => {
                        let link = $urlFact.data('account-detail').format_url_with_uuid(row?.['customer_data']?.['id']);
                        let title = row?.['customer_data']?.['name'] ? row?.['customer_data']?.['name'] : '';
                        if (row?.['supplier_data']?.['id'] && row?.['supplier_data']?.['title']) {
                            link = $urlFact.data('account-detail').format_url_with_uuid(row?.['supplier_data']?.['id']);
                            title = row?.['supplier_data']?.['title'] ? row?.['supplier_data']?.['title'] : '';
                        }
                        return `<a href="${link}" class="link-primary underline_hover">${title}</a>`;
                    }
                }
            }
            if (key === "2") {
                return {
                    width: '5%',
                    render: (data, type, row) => {
                        let paymentStageData = row?.['so_payment_stage_data'];
                        if (row?.['purchase_order_data']?.['id']) {
                            paymentStageData = row?.['po_payment_stage_data'];
                        }
                        return `<span>${paymentStageData?.['term_data']?.['title'] ? paymentStageData?.['term_data']?.['title'] : ''}</span>`;
                    }
                }
            }
            if (key === "3") {
                return {
                    width: '5%',
                    render: (data, type, row) => {
                        if (row?.['invoice_planned_date']) {
                            return `<span>${DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['invoice_planned_date'])}</span>`;
                        }
                        return `<span></span>`;
                    }
                }
            }
            if (key === "4") {
                return {
                    width: '5%',
                    render: (data, type, row) => {
                        if (row?.['invoice_actual_date']) {
                            return `<span>${DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['invoice_actual_date'])}</span>`;
                        }
                        return `<span></span>`;
                    }
                }
            }
            if (key === "5") {
                return {
                    width: '5%',
                    render: (data, type, row) => {
                        let currentDate = DateTimeControl.getCurrentDate("DMY", "/");
                        let dueDate = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['due_date']);
                        return `<span>${daysBetween(currentDate, dueDate)} days</span>`;
                    }
                }
            }
            return {
                // width: '5%',
                render: (data, type, row) => {
                    return ``;
                }
            };
        }

        function customDtbByDay() {
            let dataDtbCommon = customDtbCommon();
            let columns = dataDtbCommon?.['columns'];
            let $theadRow = dataDtbCommon?.['$theadRow'];
            if (boxStart.val() && boxEnd.val()) {
                let dataByDay = setupDataViewByDay(boxStart.val(), boxEnd.val());
                let rate = 70 / Object.keys(dataByDay).length;
                let width = `${rate}%`;
                for (let key in dataByDay) {
                    $theadRow.append(`<th data-check="${key}">${key}</th>`);
                    columns.push({
                        // width: width,
                        render: (data, type, row, meta) => {

                            let value = "";
                            let colIndex = meta.col;
                            let table = $dtbArea.find('.table_payment_plan').DataTable();
                            let $thElement = $(table.column(colIndex).header());
                            if ($thElement.length > 0) {
                                if ($thElement.attr('data-check')) {
                                    let dataCheck = $thElement.attr('data-check');
                                    if (row?.['date_approved']) {
                                        let date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['date_approved']);
                                        if (date === dataCheck) {
                                            value = row?.['value_pay'];
                                        }
                                    }
                                }
                            }
                            return `<span class="mask-money" data-init-money="${value}"></span>`;
                        }
                    })
                }
                loadDbl([], columns);
            }
            return true;
        }

        function setupDataViewByDay(from, to) {
            const result = {};

            // Helper to parse DD/MM/YYYY to Date
            const parseDate = (str) => {
                const [day, month, year] = str.split('/').map(Number);
                return new Date(year, month - 1, day);
            };

            // Helper to format Date to DD/MM/YYYY
            const formatDate = (date) => {
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
                return `${dd}/${mm}/${yyyy}`;
            };

            let currentDate = parseDate(from);
            const endDate = parseDate(to);

            while (currentDate <= endDate) {
                result[formatDate(currentDate)] = {};
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return result;
        }

        function customDtbByWeek() {
            let dataDtbCommon = customDtbCommon();
            let columns = dataDtbCommon?.['columns'];
            let $theadRow = dataDtbCommon?.['$theadRow'];
            if (boxStart.val() && boxEnd.val()) {
                let dataByWeek = setupDataViewByWeek(boxStart.val(), boxEnd.val());
                let rate = 70 / Object.keys(dataByWeek).length;
                let width = `${rate}%`;
                for (let key in dataByWeek) {
                    let text = `${$transFact.attr('data-week')} ${key}<br>(${dataByWeek[key]["from"]} - ${dataByWeek[key]["to"]})`;
                    $theadRow.append(`<th data-check=${JSON.stringify(dataByWeek[key])}>${text}</th>`);
                    columns.push({
                        class: 'text-center',
                        width: width,
                        checkRange: dataByWeek[key], // Custom key
                        render: (data, type, row, meta) => {
                            let value = "";
                            let checkRange = meta.settings.aoColumns[meta.col].checkRange;

                            if (checkRange && row?.['date_approved']) {
                                let date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['date_approved']);
                                let check = isDateInRange(checkRange?.['from'], checkRange?.['to'], date);
                                if (check) {
                                    value = row?.['value_pay'];
                                }
                            }

                            return `<span class="mask-money" data-init-money="${value}"></span>`;
                        }
                    });
                }
                loadDbl([], columns);
            }

            return true;
        }

        function setupDataViewByWeek(from, to) {
            const result = {};

            // Helper to parse DD/MM/YYYY to Date
            const parseDate = (str) => {
                const [day, month, year] = str.split('/').map(Number);
                return new Date(year, month - 1, day);
            };

            // Helper to format Date to DD/MM/YYYY
            const formatDate = (date) => {
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
                return `${dd}/${mm}/${yyyy}`;
            };

            // Get the Monday of the current week
            const getWeekStart = (date) => {
                const d = new Date(date);
                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday (0)
                return new Date(d.setDate(diff));
            };

            // Get the Sunday of the current week
            const getWeekEnd = (start) => {
                const d = new Date(start);
                d.setDate(d.getDate() + 6);
                return d;
            };

            // Get week number in the year (simple approach based on Jan 1 as week 1)
            const getWeekNumber = (date) => {
                const start = new Date(date.getFullYear(), 0, 1);
                const diff = (date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
                const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
                return Math.floor(dayDiff / 7) + 1;
            };

            let current = getWeekStart(parseDate(from));
            const end = parseDate(to);

            while (current <= end) {
                const weekNum = getWeekNumber(current);
                const weekStart = new Date(current);
                const weekEnd = getWeekEnd(weekStart);

                result[String(weekNum)] = {
                    from: formatDate(weekStart),
                    to: formatDate(weekEnd < end ? weekEnd : end)
                };

                current.setDate(current.getDate() + 7);
            }

            return result;
        }

        function customDtbByMonth() {
            let dataDtbCommon = customDtbCommon();
            let columns = dataDtbCommon?.['columns'];
            let $theadRow = dataDtbCommon?.['$theadRow'];
            if (boxStart.val() && boxEnd.val()) {
                let dataByMonth = setupDataViewByMonth(boxStart.val(), boxEnd.val());
                let rate = 70 / Object.keys(dataByMonth).length;
                let width = `${rate}%`;
                for (let key in dataByMonth) {
                    let text = dataMonth[key - 1][1];
                    $theadRow.append(`<th data-check=${JSON.stringify(dataByMonth[key])}>${text}</th>`);
                    columns.push({
                        class: 'text-center',
                        width: width,
                        checkRange: dataByMonth[key], // Custom key
                        render: (data, type, row, meta) => {
                            let value = "";
                            let checkRange = meta.settings.aoColumns[meta.col].checkRange;

                            if (checkRange && row?.['date_approved']) {
                                let date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['date_approved']);
                                let check = isDateInRange(checkRange?.['from'], checkRange?.['to'], date);
                                if (check) {
                                    value = row?.['value_pay'];
                                }
                            }

                            return `<span class="mask-money" data-init-money="${value}"></span>`;
                        }
                    });
                }
                loadDbl([], columns);
            }

            return true;
        }

        function setupDataViewByMonth(from, to) {
            const result = {};

            const parseDate = (str) => {
                const [day, month, year] = str.split('/').map(Number);
                return new Date(year, month - 1, day);
            };

            const formatDate = (date) => {
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
                return `${dd}/${mm}/${yyyy}`;
            };

            let current = parseDate(from);
            const end = parseDate(to);

            while (current <= end) {
                const month = current.getMonth() + 1;
                const year = current.getFullYear();

                // Get first day for this entry
                const isFirstMonth = (current.getMonth() === parseDate(from).getMonth() && current.getFullYear() === parseDate(from).getFullYear());
                const fromDate = isFirstMonth ? new Date(current) : new Date(year, current.getMonth(), 1);

                // Get last day for this entry
                const isLastMonth = (current.getMonth() === end.getMonth() && current.getFullYear() === end.getFullYear());
                const toDate = isLastMonth ? end : new Date(year, current.getMonth() + 1, 0); // last day of month

                result[String(month)] = {
                    from: formatDate(fromDate),
                    to: formatDate(toDate)
                };

                // Move to next month
                current = new Date(year, current.getMonth() + 1, 1);
            }

            return result;
        }

        function getCurrentMonthInfo() {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth(); // 0-based

            // First day of the month
            const firstDate = new Date(year, month, 1);

            // Last day of the month: set day = 0 of next month
            const lastDate = new Date(year, month + 1, 0);

            const formatDate = (date) => {
                const dd = String(date.getDate()).padStart(2, '0');
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const yyyy = date.getFullYear();
                return `${dd}/${mm}/${yyyy}`;
            };

            return {
                "month": month + 1, // Make it 1-based
                "from": formatDate(firstDate),
                "to": formatDate(lastDate)
            };
        }

        function isDateInRange(fromDateStr, toDateStr, myDateStr) {
            // Convert DD/MM/YYYY to Date object
            function parseDate(str) {
                let [day, month, year] = str.split('/').map(Number);
                return new Date(year, month - 1, day); // month is 0-based
            }

            let fromDate = parseDate(fromDateStr);
            let toDate = parseDate(toDateStr);
            let myDate = parseDate(myDateStr);

            return myDate >= fromDate && myDate <= toDate;
        }

        function daysBetween(date1Str, date2Str) {
            // Parse the "DD/MM/YYYY" format to Date objects
            const [d1, m1, y1] = date1Str.split('/').map(Number);
            const [d2, m2, y2] = date2Str.split('/').map(Number);

            const date1 = new Date(y1, m1 - 1, d1);
            const date2 = new Date(y2, m2 - 1, d2);

            // Calculate the difference in milliseconds and convert to days
            const diffTime = Math.abs(date1 - date2);
            return Math.floor(diffTime / (1000 * 60 * 60 * 24));
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
                                                'is_initial': false,
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

        function removeActiveBtn() {
            for (let btn of $btnGroup[0].querySelectorAll('.btn-view')) {
                $(btn).removeClass('active');
            }
            return true;
        }

        // load init
        function initData() {
            FormElementControl.loadInitS2(boxCustomer, [], {}, null, true);
            FormElementControl.loadInitS2(boxSO, [], {}, null, true);
            FormElementControl.loadInitS2(boxPO, [], {}, null, true);
            let dataCurrentMonth = getCurrentMonthInfo();
            boxStart.val(dataCurrentMonth?.['from']);
            boxEnd.val(dataCurrentMonth?.['to']);
            $btnWeek.click();
            // storeLoadInitByDataFiscalYear();
        }

        // init date picker
        $('.date-picker').each(function () {
            DateTimeControl.initDatePicker(this);
        });

        // mask money
        $.fn.initMaskMoney2();

        $btnDay.on('click', function () {
            removeActiveBtn();
            $btnDay.addClass('active');
            // customDtbByDay();
            $('#btn-apply-filter').trigger('click');
        });

        $btnWeek.on('click', function () {
            removeActiveBtn();
            $btnWeek.addClass('active');
            // customDtbByWeek();
            $('#btn-apply-filter').trigger('click');
        });

        $btnMonth.on('click', function () {
            removeActiveBtn();
            $btnMonth.addClass('active');
            // customDtbByMonth();
            $('#btn-apply-filter').trigger('click');
        });

        $('#btn-apply-filter').on('click', function () {
            let dataParams = {};
            if (boxStart.val()) {
                let dateStart = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', boxStart.val());
                dataParams['date_approved__gte'] = dateStart + ' 00:00:00';
            }
            if (boxEnd.val()) {
                let dateEnd = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', boxEnd.val());
                dataParams['date_approved__lte'] = dateEnd + ' 23:59:59';
            }
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': $urlFact.attr('data-payment-plan'),
                    'method': 'GET',
                    'data': dataParams,
                    isLoading: true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('payment_plan_list') && Array.isArray(data.payment_plan_list)) {
                            let dataPP = data?.['payment_plan_list'];
                            for (let btn of $btnGroup[0].querySelectorAll('.btn-view')) {
                                if ($(btn).hasClass('active')) {
                                    if (btn === $btnDay[0]) {
                                        customDtbByDay();
                                    }
                                    if (btn === $btnWeek[0]) {
                                        customDtbByWeek();
                                    }
                                    if (btn === $btnMonth[0]) {
                                        customDtbByMonth();
                                    }
                                }
                            }

                            $dtbArea.find('.table_payment_plan').DataTable().clear().draw();
                            $dtbArea.find('.table_payment_plan').DataTable().rows.add(dataPP).draw();
                            WindowControl.hideLoading();
                        }
                    }
                }
            )
        });

        initData();

    });
});