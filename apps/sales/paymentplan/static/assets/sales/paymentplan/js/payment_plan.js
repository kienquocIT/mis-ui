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
            0: $transFact.attr('data-document'),
            1: $transFact.attr('data-partner'),
            2: $transFact.attr('data-installment'),
            // 3: 'Invoice planed date',
            4: $transFact.attr('data-invoice'),
            5: $transFact.attr('data-over-due'),
            6: $transFact.attr('data-balance-due'),
        };

        function loadDbl(data, columns) {
            // if ($.fn.DataTable.isDataTable($dtbArea.find('.table_payment_plan'))) {
            //     $dtbArea.find('.table_payment_plan').DataTable().destroy();
            // }
            $dtbArea.find('.table_payment_plan').DataTableDefault({
                data: data ? data : [],
                autoWidth: true,
                scrollX: true,
                fixedColumns: {
                    leftColumns: Object.keys(staticHeaders).length
                },
                pageLength: 50,
                columns: columns ? columns : [],
                rowCallback: function (row, data, index) {
                    if (data?.['is_total_in'] === true) {
                        $(row).find('td:eq(1)').attr('colspan', 1);
                    }
                    if (data?.['is_total_out'] === true) {
                        $(row).find('td:eq(1)').attr('colspan', 1);
                    }
                },
                drawCallback: function (settings) {
                    // mask money
                    $.fn.initMaskMoney2();
                    // add css to Dtb
                    dtbHDCustom();
                    loadTotalInOut(settings);
                },
            });
        }

        function loadTotalInOut(settings) {
            let api = $dtbArea.find('.table_payment_plan').DataTable();

            // Store totals for each column separately
            let columnTotalsIn = {};
            let columnTotalsOut = {};
            let totalInRow = null;
            let totalOutRow = null;

            // Loop through all rows
            api.rows().every(function () {
                let row = this.node();
                let rowIndex = api.row(row).index();
                let $row = api.row(rowIndex);
                let dataRow = $row.data();

                // Identify special total rows
                if (dataRow?.is_total_in) {
                    totalInRow = row;
                    return;
                }
                if (dataRow?.is_total_out) {
                    totalOutRow = row;
                    return;
                }

                // Loop through columns to calculate totals
                api.columns().every(function (colIndex) {
                    let colDef = settings.aoColumns[colIndex];

                    if (colDef.checkRange && dataRow?.['date_approved']) {
                        const date = DateTimeControl.formatDateType(
                            'YYYY-MM-DD hh:mm:ss',
                            'DD/MM/YYYY',
                            dataRow['date_approved']
                        );

                        const inRange = isDateInRange(
                            colDef.checkRange.from,
                            colDef.checkRange.to,
                            date
                        );

                        if (inRange) {
                            let val = parseFloat(dataRow['value_pay']) || 0;

                            if (dataRow?.['purchase_order_data']?.['id']) {
                                columnTotalsOut[colIndex] = (columnTotalsOut[colIndex] || 0) + val;
                            } else {
                                columnTotalsIn[colIndex] = (columnTotalsIn[colIndex] || 0) + val;
                            }
                        }
                    }
                });
            });

            // Inject totals into totalInRow
            if (totalInRow) {
                Object.entries(columnTotalsIn).forEach(([colIndex, total]) => {
                    $(totalInRow).find('td').eq(colIndex).html(`<span class="text-success mask-money" data-init-money="${total}"></span>`);
                });
            }

            // Inject totals into totalOutRow
            if (totalOutRow) {
                Object.entries(columnTotalsOut).forEach(([colIndex, total]) => {
                    $(totalOutRow).find('td').eq(colIndex).html(`<span class="text-danger mask-money" data-init-money="${-total}"></span>`);
                });
            }
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
                                        <button type="button" class="btn btn-light btn-sm ml-1" id="btn-open-filter" data-bs-toggle="offcanvas" data-bs-target="#filterCanvas">
                                            <span><span class="icon"><i class="fas fa-filter"></i></span><span>${$.fn.transEle.attr('data-filter')}</span></span>
                                        </button>
                                    </div>`);
                    headerToolbar$.append($group);
                }
            }
        }

        function customDtbCommon() {
            $dtbArea.empty();
            $dtbArea.append(htmlDtb);
            let $table = $dtbArea.find('.table_payment_plan');
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
                    width: '5%',
                    render: (data, type, row) => {
                        let link = $urlFact.data('so-detail').format_url_with_uuid(row?.['sale_order_data']?.['id']);
                        let title = row?.['sale_order_data']?.['code'] ? row?.['sale_order_data']?.['code'] : '';
                        if (row?.['purchase_order_data']?.['id'] && row?.['purchase_order_data']?.['code']) {
                            link = $urlFact.data('po-detail').format_url_with_uuid(row?.['purchase_order_data']?.['id']);
                            title = row?.['purchase_order_data']?.['code'] ? row?.['purchase_order_data']?.['code'] : '';
                        }
                        return `<a href="${link}" class="link-primary underline_hover">${title}</a>`;
                    }
                }
            }
            if (key === "1") {
                return {
                    width: '5%',
                    render: (data, type, row) => {
                        let link = $urlFact.data('account-detail').format_url_with_uuid(row?.['customer_data']?.['id']);
                        let title = row?.['customer_data']?.['code'] ? row?.['customer_data']?.['code'] : '';
                        if (row?.['supplier_data']?.['id'] && row?.['supplier_data']?.['code']) {
                            link = $urlFact.data('account-detail').format_url_with_uuid(row?.['supplier_data']?.['id']);
                            title = row?.['supplier_data']?.['code'] ? row?.['supplier_data']?.['code'] : '';
                        }
                        return `<a href="${link}" class="link-primary underline_hover">${title}</a>`;
                    }
                }
            }
            if (key === "2") {
                return {
                    width: '5%',
                    render: (data, type, row) => {
                        let date = '';
                        let dateSub = '';
                        if (row?.['invoice_planned_date']) {
                            date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['invoice_planned_date']);
                            dateSub = "(Ngày xuất hóa đơn dự kiến)";
                        }
                        let paymentStageData = row?.['so_payment_stage_data'];
                        if (row?.['purchase_order_data']?.['id']) {
                            paymentStageData = row?.['po_payment_stage_data'];
                        }
                        return `<div><span>${paymentStageData?.['term_data']?.['title'] ? paymentStageData?.['term_data']?.['title'] : ''}</span></div>
                                <div><span>${date} ${dateSub}</span></div>`;
                    }
                }
            }
            // if (key === "3") {
            //     return {
            //         width: '5%',
            //         render: (data, type, row) => {
            //             if (row?.['invoice_planned_date']) {
            //                 return `<span>${DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['invoice_planned_date'])}</span>`;
            //             }
            //             return `<span></span>`;
            //         }
            //     }
            // }
            if (key === "4") {
                return {
                    width: '5%',
                    render: (data, type, row) => {
                        let date = '';
                        let dateSub = '';
                        if (row?.['invoice_actual_date']) {
                            date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['invoice_actual_date']);
                            dateSub = "(Ngày xuất hóa đơn thực tế)";
                        }
                        let link = $urlFact.data('ar-invoice-detail').format_url_with_uuid(row?.['ar_invoice_data']?.['id']);
                        let title = row?.['ar_invoice_data']?.['title'] ? row?.['ar_invoice_data']?.['title'] : '';
                        if (row?.['ap_invoice_data']?.['id'] && row?.['ap_invoice_data']?.['title']) {
                            link = $urlFact.data('ap-invoice-detail').format_url_with_uuid(row?.['ap_invoice_data']?.['id']);
                            title = row?.['ap_invoice_data']?.['title'] ? row?.['ap_invoice_data']?.['title'] : '';
                        }
                        return `<div><a href="${link}" class="link-primary underline_hover">${title}</a></div>
                                <div><span>${date} ${dateSub}</span></div>`;
                    }
                }
            }
            if (key === "5") {
                return {
                    width: '5%',
                    render: (data, type, row) => {
                        if (row?.['due_date']) {
                            let currentDate = DateTimeControl.getCurrentDate("DMY", "/");
                            let dueDate = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['due_date']);
                            return `<span>${daysBetween(currentDate, dueDate)} days</span>`;
                        }
                        return ``;
                    }
                }
            }
            if (key === "6") {
                return {
                    width: '5%',
                    render: (data, type, row) => {
                        if (row?.['is_total_in'] === true) {
                            return `<b>Total cash in</b>`;
                        }
                        if (row?.['is_total_out'] === true) {
                            return `<b>Total cash out</b>`;
                        }
                        let balance = row?.['value_balance'];
                        if (row?.['purchase_order_data']?.['id']) {
                            balance = -row?.['value_balance'];
                        }
                        return `<span class="mask-money" data-init-money="${balance}"></span>`;
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

        function setMinWidthDtb(columns) {
            let colLength = columns.length - 6;
            let rate = 70 / colLength;
            let width = `${rate}%`;
            for (let i = 0; i < columns.length; i++) {
                if (i > 6) {
                    columns[i]["width"] = width;
                }
            }
            let $table = $dtbArea.find('.table_payment_plan');
            let minWidth = "min-w-1440p";
            if (columns.length > 7) {
                minWidth = "min-w-2560p";
            }
            if (columns.length > 10) {
                minWidth = "min-w-3440p";
            }
            if (columns.length > 15) {
                minWidth = "min-w-3440p";
            }
            $table.addClass(minWidth);
            return true;
        }

        function customDtbByDay() {
            let dataDtbCommon = customDtbCommon();
            let columns = dataDtbCommon?.['columns'];
            let $theadRow = dataDtbCommon?.['$theadRow'];
            if (boxStart.val() && boxEnd.val()) {
                let dataByDay = setupDataViewByDay(boxStart.val(), boxEnd.val());
                for (let key in dataByDay) {
                    $theadRow.append(`<th data-check="${key}">${key}</th>`);
                    columns.push({
                        checkRange: dataByDay[key], // Custom key
                        render: (data, type, row, meta) => {
                            let value = "";
                            let checkRange = meta.settings.aoColumns[meta.col].checkRange;

                            if (checkRange && row?.['date_approved']) {
                                let date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['date_approved']);
                                let check = isDateInRange(checkRange?.['from'], checkRange?.['to'], date);
                                if (check) {
                                    value = row?.['value_pay'];
                                    if (row?.['purchase_order_data']?.['id']) {
                                        value = -row?.['value_pay'];
                                    }
                                }
                            }

                            return `<span class="mask-money" data-init-money="${value}"></span>`;
                        }
                    })
                }
                setMinWidthDtb(columns);
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
                result[formatDate(currentDate)] = {
                    from: formatDate(currentDate),
                    to: formatDate(currentDate),
                };
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
                for (let key in dataByWeek) {
                    let text = `${$transFact.attr('data-week')} ${key}<br>(${dataByWeek[key]["from"]} - ${dataByWeek[key]["to"]})`;
                    $theadRow.append(`<th data-check=${JSON.stringify(dataByWeek[key])}>${text}</th>`);
                    columns.push({
                        class: 'text-center',
                        checkRange: dataByWeek[key], // Custom key
                        render: (data, type, row, meta) => {
                            let value = "";
                            let checkRange = meta.settings.aoColumns[meta.col].checkRange;

                            if (checkRange && row?.['date_approved']) {
                                let date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['date_approved']);
                                let check = isDateInRange(checkRange?.['from'], checkRange?.['to'], date);
                                if (check) {
                                    value = row?.['value_pay'];
                                    if (row?.['purchase_order_data']?.['id']) {
                                        value = -row?.['value_pay'];
                                    }
                                }
                            }

                            return `<span class="mask-money" data-init-money="${value}"></span>`;
                        }
                    });
                }
                setMinWidthDtb(columns);
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
                for (let key in dataByMonth) {
                    let text = dataMonth[key - 1][1];
                    $theadRow.append(`<th data-check=${JSON.stringify(dataByMonth[key])}>${text}</th>`);
                    columns.push({
                        class: 'text-center',
                        checkRange: dataByMonth[key], // Custom key
                        render: (data, type, row, meta) => {
                            let value = "";
                            let checkRange = meta.settings.aoColumns[meta.col].checkRange;

                            if (checkRange && row?.['date_approved']) {
                                let date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['date_approved']);
                                let check = isDateInRange(checkRange?.['from'], checkRange?.['to'], date);
                                if (check) {
                                    value = row?.['value_pay'];
                                    if (row?.['purchase_order_data']?.['id']) {
                                        value = -row?.['value_pay'];
                                    }
                                }
                            }

                            return `<span class="mask-money" data-init-money="${value}"></span>`;
                        }
                    });
                }
                setMinWidthDtb(columns);
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
                            $dtbArea.find('.table_payment_plan').DataTable().row.add({"is_total_in": true}).draw().node();
                            $dtbArea.find('.table_payment_plan').DataTable().row.add({"is_total_out": true}).draw().node();
                            WindowControl.hideLoading();
                        }
                    }
                }
            )
        });

        initData();

    });
});