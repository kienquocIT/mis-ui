$(function () {
    $(document).ready(function () {

        let $navList = $('#nav-item-list');
        let $tableList = $('#table_list');
        let boxCustomer1 = $('#box-customer-1');
        let boxSO1 = $('#box-so-1');
        let boxSupplier1 = $('#box-supplier-1');
        let boxPO1 = $('#box-po-1');
        let checkNotPaid1 = $('#checkbox-not-paid-1');
        let boxStart1 = $('#date-from-1');
        let boxEnd1 = $('#date-to-1');
        let $btnApplyFilterList = $('#btn-apply-filter-list');

        let $navDetailOfMonth = $('#nav-item-detail-of-month');
        let $dtbArea = $('#dtb-area');
        let boxCustomer = $('#box-customer');
        let boxSO = $('#box-so');
        let boxSupplier = $('#box-supplier');
        let boxPO = $('#box-po');
        let checkNotPaid = $('#checkbox-not-paid');
        let $boxMonth = $('#box-month');
        let boxStart = $('#date-from');
        let boxEnd = $('#date-to');
        let $btnApplyFilter = $('#btn-apply-filter');

        let $urlFact = $('#app-url-factory');
        let $transFact = $('#app-trans-factory');
        let $eleFiscalYear = $('#data-fiscal-year');
        let dataMonth = JSON.parse($('#filter_month').text());

        let htmlDtb = `<table class="table nowrap w-100 table_payment_plan">
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
            3: $transFact.attr('data-invoice'),
            4: $transFact.attr('data-status'),
            5: $transFact.attr('data-due-date'),
            6: $transFact.attr('data-balance-due'),
        };

        function loadDblList(dataParams) {
            $tableList.not('.dataTable').DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: $urlFact.attr('data-payment-plan'),
                    type: "GET",
                    data: dataParams,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('payment_plan_list')) {
                            let dataFn = resp.data['payment_plan_list'] ? resp.data['payment_plan_list'] : [];
                            // dataFn.push({"is_total_in": true});
                            // dataFn.push({"is_total_out": true});
                            return dataFn;
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                autoWidth: true,
                scrollX: true,
                pageLength: 10,
                columns: [
                    {
                        targets: 0,
                        width: '15%',
                        render: (data, type, row) => {
                            let link = $urlFact.data('so-detail').format_url_with_uuid(row?.['sale_order_data']?.['id']);
                            let title = row?.['sale_order_data']?.['title'] ? row?.['sale_order_data']?.['title'] : '';
                            let code = row?.['sale_order_data']?.['code'] ? row?.['sale_order_data']?.['code'] : '';
                            if (row?.['lease_order_data']?.['id'] && row?.['lease_order_data']?.['title'] && row?.['lease_order_data']?.['code']) {
                                link = $urlFact.data('lo-detail').format_url_with_uuid(row?.['lease_order_data']?.['id']);
                                title = row?.['lease_order_data']?.['title'] ? row?.['lease_order_data']?.['title'] : '';
                                code = row?.['lease_order_data']?.['code'] ? row?.['lease_order_data']?.['code'] : '';
                            }
                            if (row?.['purchase_order_data']?.['id'] && row?.['purchase_order_data']?.['title'] && row?.['purchase_order_data']?.['code']) {
                                link = $urlFact.data('po-detail').format_url_with_uuid(row?.['purchase_order_data']?.['id']);
                                title = row?.['purchase_order_data']?.['title'] ? row?.['purchase_order_data']?.['title'] : '';
                                code = row?.['purchase_order_data']?.['code'] ? row?.['purchase_order_data']?.['code'] : '';
                            }
                            return `<a href="${link}" class="link-primary underline_hover">${title}</a><div><span class="badge text-dark-10 fs-8 bg-orange-light-4">${code}</span></div>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '15%',
                        render: (data, type, row) => {
                            let link = $urlFact.data('account-detail').format_url_with_uuid(row?.['customer_data']?.['id']);
                            let title = row?.['customer_data']?.['name'] ? row?.['customer_data']?.['name'] : '';
                            if (row?.['supplier_data']?.['id'] && row?.['supplier_data']?.['name']) {
                                link = $urlFact.data('account-detail').format_url_with_uuid(row?.['supplier_data']?.['id']);
                                title = row?.['supplier_data']?.['name'] ? row?.['supplier_data']?.['name'] : '';
                            }
                            return `<a href="${link}" class="link-primary underline_hover">${title}</a>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '10%',
                        render: (data, type, row) => {
                            let date = '';
                            let dateSub = '';
                            if (row?.['invoice_planned_date']) {
                                date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['invoice_planned_date']);
                                dateSub = `${$transFact.attr('data-expected-invoice-date')}: `;
                            }
                            let paymentStageData = row?.['so_payment_stage_data'];
                            if (row?.['purchase_order_data']?.['id']) {
                                paymentStageData = row?.['po_payment_stage_data'];
                            }
                            let term = "";
                            if (paymentStageData?.['remark']) {
                                term = paymentStageData?.['remark'];
                            }
                            if (paymentStageData?.['term_data']?.['title']) {
                                term = paymentStageData?.['term_data']?.['title'];
                            }
                            return `<div><b>${term}</b></div>
                                <div><span>${dateSub}${date}</span></div>`;
                        }
                    },
                    {
                        targets: 3,
                        width: '10%',
                        render: (data, type, row) => {
                            let date = '';
                            let dateSub = '';
                            if (row?.['invoice_actual_date']) {
                                date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['invoice_actual_date']);
                                dateSub = `${$transFact.attr('data-actual-invoice-date')}: `;
                            }
                            let link = $urlFact.data('ar-invoice-detail').format_url_with_uuid(row?.['ar_invoice_data']?.['id']);
                            let title = row?.['ar_invoice_data']?.['title'] ? row?.['ar_invoice_data']?.['title'] : '';
                            if (row?.['ap_invoice_data']?.['id'] && row?.['ap_invoice_data']?.['title']) {
                                link = $urlFact.data('ap-invoice-detail').format_url_with_uuid(row?.['ap_invoice_data']?.['id']);
                                title = row?.['ap_invoice_data']?.['title'] ? row?.['ap_invoice_data']?.['title'] : '';
                            }
                            return `<div><a href="${link}" class="link-primary underline_hover">${title}</a></div>
                                <div><span>${dateSub}${date}</span></div>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['value_balance'] === 0) {
                                return `<span class="badge text-dark-10 fs-8 bg-green-light-4">${$transFact.attr('data-paid')}</span>`;
                            }
                            if (row?.['due_date']) {
                                let btnTxt = $transFact.attr('data-create-cash-in');
                                let btnUrl = $urlFact.attr('data-cash-in-create');
                                if (row?.['purchase_order_data']?.['id']) {
                                    btnTxt = $transFact.attr('data-create-cash-out');
                                    btnUrl = $urlFact.attr('data-cash-out-create');
                                }
                                let btn = `<a href="${btnUrl}" target="_blank"><button type="button" class="btn btn-outline-primary btn-xs mt-2">
                                                <span>
                                                    <span class="icon">
                                                        <i class="fa-solid fa-plus"></i>
                                                    </span>
                                                    <span>${btnTxt}</span>
                                                </span>
                                            </button></a>`;
                                let currentDate = DateTimeControl.getCurrentDate("DMY", "/");
                                let dueDate = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['due_date']);
                                let daysLeft = daysBetween(currentDate, dueDate);
                                if (daysLeft >= 0) {
                                    if (row?.['ar_invoice_data']?.['id'] || row?.['ap_invoice_data']?.['id']) {
                                        return `<span class="badge text-dark-10 fs-8 bg-pink-light-4">${$transFact.attr('data-partially-paid')}</span>${btn}`;
                                    }
                                    return `<span class="badge text-dark-10 fs-8 bg-yellow-light-4">${$transFact.attr('data-not-paid')}</span>${btn}`;
                                }
                                return `<span class="badge text-dark-10 fs-8 bg-red-light-4">${$transFact.attr('data-over-due')}</span>${btn}`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 5,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['value_balance'] === 0) {
                                return `--`;
                            }
                            if (row?.['due_date']) {
                                let currentDate = DateTimeControl.getCurrentDate("DMY", "/");
                                let dueDate = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['due_date']);
                                let daysLeft = daysBetween(currentDate, dueDate);
                                if (daysLeft >= 0) {
                                    return `<span>${daysLeft} ${$transFact.attr('data-day-left')} (${dueDate})</span>`;
                                }
                                daysLeft = Math.abs(daysLeft);
                                return `<span>${daysLeft} ${$transFact.attr('data-day-previous')} (${dueDate})</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 6,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['is_total_in'] === true) {
                                return `<div class="d-flex justify-content-between">
                                        <b>Total cash in</b>
                                        <b><i class="fa-solid fa-arrow-left text-green"></i></b>
                                    </div>`;
                            }
                            if (row?.['is_total_out'] === true) {
                                return `<div class="d-flex justify-content-between">
                                        <b>Total cash out</b>
                                        <b><i class="fa-solid fa-arrow-right text-red"></i></b>
                                    </div>`;
                            }
                            let balance = row?.['value_balance'];
                            let clsText = "";
                            if (balance > 0) {
                                clsText = "text-green";
                                if (row?.['purchase_order_data']?.['id']) {
                                    balance = -row?.['value_balance'];
                                    clsText = "text-red"
                                }
                            }
                            return `<span class="mask-money ${clsText}" data-init-money="${balance}"></span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['due_date']) {
                                return DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['due_date']);
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 8,
                        width: '10%',
                        render: (data, type, row) => {
                            let value = row?.['value_pay'];
                            if (row?.['purchase_order_data']?.['id']) {
                                value = -row?.['value_pay'];
                            }
                            return `<span class="mask-money" data-init-money="${value}"></span>`;
                        }
                    },
                ],
                rowCallback: function (row, data, index) {
                    // if (data?.['is_total_in'] === true) {
                    //     $(row).find('td:eq(1)').attr('colspan', 1);
                    // }
                    // if (data?.['is_total_out'] === true) {
                    //     $(row).find('td:eq(1)').attr('colspan', 1);
                    // }
                },
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                    // add css to Dtb
                    dtbListHDCustom();
                },
            });
        }

        function dtbListHDCustom() {
            let wrapper$ = $tableList.closest('.dataTables_wrapper');
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
                if (!$('#btn-open-filter-list').length) {
                    let $group = $(`<div class="btn-filter">
                                        <button type="button" class="btn btn-light btn-sm ml-1" id="btn-open-filter-list" data-bs-toggle="offcanvas" data-bs-target="#filterListCanvas">
                                            <span><span class="icon"><i class="fas fa-filter"></i></span><span>${$.fn.transEle.attr('data-filter')}</span></span>
                                        </button>
                                    </div>`);
                    headerToolbar$.append($group);
                }
            }
        }

        function loadDbl(dataParams, columns) {
            $dtbArea.find('.table_payment_plan').not('.dataTable').DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: $urlFact.attr('data-payment-plan'),
                    type: "GET",
                    data: dataParams,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('payment_plan_list')) {
                            let dataFn = resp.data['payment_plan_list'] ? resp.data['payment_plan_list'] : [];
                            dataFn.unshift({"is_total_in": true});
                            dataFn.unshift({"is_total_out": true});
                            return dataFn;
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                autoWidth: true,
                scrollX: true,
                scrollY: "60vh",
                fixedHeader: true,
                fixedColumns: {
                    leftColumns: Object.keys(staticHeaders).length
                },
                pageLength: 50,
                columns: columns ? columns : [],
                rowCallback: function (row, data, index) {
                    if (data?.['is_total_in'] === true) {
                        $(row).find('td:eq(1)').attr('colspan', 1);
                        $(row).css({
                            "position": 'sticky',
                            'top': '43px',
                            'background': 'white',
                            'z-index': 10,
                        });
                    }
                    if (data?.['is_total_out'] === true) {
                        $(row).find('td:eq(1)').attr('colspan', 1);
                        $(row).css({
                            "position": 'sticky',
                            'top': '0px',
                            'background': 'white',
                            'z-index': 11,
                        });
                    }
                },
                drawCallback: function (settings) {
                    // mask money
                    $.fn.initMaskMoney2();
                    // add css to Dtb
                    dtbHDCustom();
                    removeActiveBtn();
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

                    if (colDef.checkRange && dataRow?.['due_date']) {
                        const date = DateTimeControl.formatDateType(
                            'YYYY-MM-DD hh:mm:ss',
                            'DD/MM/YYYY',
                            dataRow['due_date']
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
                    $(totalInRow).find('td').eq(colIndex).html(`<span class="mask-money" data-init-money="${total}"></span>`);
                });
            }

            // Inject totals into totalOutRow
            if (totalOutRow) {
                Object.entries(columnTotalsOut).forEach(([colIndex, total]) => {
                    $(totalOutRow).find('td').eq(colIndex).html(`<span class="mask-money" data-init-money="${-total}"></span>`);
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

            let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the element already exists before appending
            if (!$('#btn-group-view').length && !$('#btn-view-day').length && !$('#btn-view-week').length && !$('#btn-view-month').length) {
                let $group = $(`<div class="btn-group" role="group" aria-label="Button group with nested dropdown" id="btn-group-view">
                                    <button type="button" class="btn btn-outline-secondary btn-view" id="btn-view-day">${$transFact.attr('data-day')}</button>
                                    <button type="button" class="btn btn-outline-secondary btn-view" id="btn-view-week">${$transFact.attr('data-week')}</button>
                                    <button type="button" class="btn btn-outline-secondary btn-view" id="btn-view-month">${$transFact.attr('data-month')}</button>
                                </div>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-view-day').on('click', function () {
                    $dtbArea.attr('data-active-id', 'btn-view-day');
                    $('#btn-apply-filter').trigger('click');
                });
                $('#btn-view-week').on('click', function () {
                    $dtbArea.attr('data-active-id', 'btn-view-week');
                    $('#btn-apply-filter').trigger('click');
                });
                $('#btn-view-month').on('click', function () {
                    $dtbArea.attr('data-active-id', 'btn-view-month');
                    $('#btn-apply-filter').trigger('click');
                });
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
                    width: '8%',
                    render: (data, type, row) => {
                        let link = $urlFact.data('so-detail').format_url_with_uuid(row?.['sale_order_data']?.['id']);
                        let title = row?.['sale_order_data']?.['title'] ? row?.['sale_order_data']?.['title'] : '';
                        let code = row?.['sale_order_data']?.['code'] ? row?.['sale_order_data']?.['code'] : '';
                        if (row?.['lease_order_data']?.['id'] && row?.['lease_order_data']?.['title'] && row?.['lease_order_data']?.['code']) {
                            link = $urlFact.data('lo-detail').format_url_with_uuid(row?.['lease_order_data']?.['id']);
                            title = row?.['lease_order_data']?.['title'] ? row?.['lease_order_data']?.['title'] : '';
                            code = row?.['lease_order_data']?.['code'] ? row?.['lease_order_data']?.['code'] : '';
                        }
                        if (row?.['purchase_order_data']?.['id'] && row?.['purchase_order_data']?.['title'] && row?.['purchase_order_data']?.['code']) {
                            link = $urlFact.data('po-detail').format_url_with_uuid(row?.['purchase_order_data']?.['id']);
                            title = row?.['purchase_order_data']?.['title'] ? row?.['purchase_order_data']?.['title'] : '';
                            code = row?.['purchase_order_data']?.['code'] ? row?.['purchase_order_data']?.['code'] : '';
                        }
                        return `<a href="${link}" class="link-primary underline_hover">${title}</a><div><span class="badge text-dark-10 fs-8 bg-orange-light-4">${code}</span></div>`;
                    }
                }
            }
            if (key === "1") {
                return {
                    width: '8%',
                    render: (data, type, row) => {
                        let link = $urlFact.data('account-detail').format_url_with_uuid(row?.['customer_data']?.['id']);
                        let title = row?.['customer_data']?.['name'] ? row?.['customer_data']?.['name'] : '';
                        if (row?.['supplier_data']?.['id'] && row?.['supplier_data']?.['name']) {
                            link = $urlFact.data('account-detail').format_url_with_uuid(row?.['supplier_data']?.['id']);
                            title = row?.['supplier_data']?.['name'] ? row?.['supplier_data']?.['name'] : '';
                        }
                        return `<a href="${link}" class="link-primary underline_hover">${title}</a>`;
                    }
                }
            }
            if (key === "2") {
                return {
                    width: '7%',
                    render: (data, type, row) => {
                        let date = '';
                        let dateSub = '';
                        if (row?.['invoice_planned_date']) {
                            date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['invoice_planned_date']);
                            dateSub = `${$transFact.attr('data-expected-invoice-date')}: `;
                        }
                        let paymentStageData = row?.['so_payment_stage_data'];
                        if (row?.['purchase_order_data']?.['id']) {
                            paymentStageData = row?.['po_payment_stage_data'];
                        }
                        let term = "";
                        if (paymentStageData?.['remark']) {
                            term = paymentStageData?.['remark'];
                        }
                        if (paymentStageData?.['term_data']?.['title']) {
                            term = paymentStageData?.['term_data']?.['title'];
                        }
                        return `<div><b>${term}</b></div>
                                <div><span>${dateSub}${date}</span></div>`;
                    }
                }
            }
            if (key === "3") {
                return {
                    width: '7%',
                    render: (data, type, row) => {
                        let date = '';
                        let dateSub = '';
                        if (row?.['invoice_actual_date']) {
                            date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['invoice_actual_date']);
                            dateSub = `${$transFact.attr('data-actual-invoice-date')}: `;
                        }
                        let link = $urlFact.data('ar-invoice-detail').format_url_with_uuid(row?.['ar_invoice_data']?.['id']);
                        let title = row?.['ar_invoice_data']?.['title'] ? row?.['ar_invoice_data']?.['title'] : '';
                        if (row?.['ap_invoice_data']?.['id'] && row?.['ap_invoice_data']?.['title']) {
                            link = $urlFact.data('ap-invoice-detail').format_url_with_uuid(row?.['ap_invoice_data']?.['id']);
                            title = row?.['ap_invoice_data']?.['title'] ? row?.['ap_invoice_data']?.['title'] : '';
                        }
                        return `<div><a href="${link}" class="link-primary underline_hover">${title}</a></div>
                                <div><span>${dateSub}${date}</span></div>`;
                    }
                }
            }
            if (key === "4") {
                return {
                    width: '6%',
                    render: (data, type, row) => {
                        if (row?.['value_balance'] === 0) {
                            return `<span class="badge text-dark-10 fs-8 bg-green-light-4">${$transFact.attr('data-paid')}</span>`;
                        }
                        if (row?.['due_date']) {
                            let btnTxt = $transFact.attr('data-create-cash-in');
                            let btnUrl = $urlFact.attr('data-cash-in-create');
                            if (row?.['purchase_order_data']?.['id']) {
                                btnTxt = $transFact.attr('data-create-cash-out');
                                btnUrl = $urlFact.attr('data-cash-out-create');
                            }
                            let btn = `<a href="${btnUrl}" target="_blank"><button type="button" class="btn btn-outline-primary btn-xs mt-2">
                                            <span>
                                                <span class="icon">
                                                    <i class="fa-solid fa-plus"></i>
                                                </span>
                                                <span>${btnTxt}</span>
                                            </span>
                                        </button></a>`;
                            let currentDate = DateTimeControl.getCurrentDate("DMY", "/");
                            let dueDate = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['due_date']);
                            let daysLeft = daysBetween(currentDate, dueDate);
                            if (daysLeft >= 0) {
                                if (row?.['ar_invoice_data']?.['id'] || row?.['ap_invoice_data']?.['id']) {
                                    return `<span class="badge text-dark-10 fs-8 bg-pink-light-4">${$transFact.attr('data-partially-paid')}</span>${btn}`;
                                }
                                return `<span class="badge text-dark-10 fs-8 bg-yellow-light-4">${$transFact.attr('data-not-paid')}</span>${btn}`;
                            }
                            return `<span class="badge text-dark-10 fs-8 bg-red-light-4">${$transFact.attr('data-over-due')}</span>${btn}`;
                        }
                        return ``;
                    }
                }
            }
            if (key === "5") {
                return {
                    width: '6%',
                    render: (data, type, row) => {
                        if (row?.['value_balance'] === 0) {
                            return `--`;
                        }
                        if (row?.['due_date']) {
                            let currentDate = DateTimeControl.getCurrentDate("DMY", "/");
                            let dueDate = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['due_date']);
                            let daysLeft = daysBetween(currentDate, dueDate);
                            if (daysLeft >= 0) {
                                return `<span>${daysLeft} ${$transFact.attr('data-day-left')} (${dueDate})</span>`;
                            }
                            daysLeft = Math.abs(daysLeft);
                            return `<span>${daysLeft} ${$transFact.attr('data-day-previous')} (${dueDate})</span>`;
                        }
                        return ``;
                    }
                }
            }
            if (key === "6") {
                return {
                    width: '7%',
                    render: (data, type, row) => {
                        if (row?.['is_total_in'] === true) {
                            return `<div class="d-flex justify-content-between">
                                        <b>${$transFact.attr('data-total-cash-in')}</b>
                                        <b><i class="fa-solid fa-arrow-left text-green"></i></b>
                                    </div>`;
                        }
                        if (row?.['is_total_out'] === true) {
                            return `<div class="d-flex justify-content-between">
                                        <b>${$transFact.attr('data-total-cash-out')}</b>
                                        <b><i class="fa-solid fa-arrow-right text-red"></i></b>
                                    </div>`;
                        }
                        let balance = row?.['value_balance'];
                        let clsText = "";
                        if (balance > 0) {
                            clsText = "text-green";
                            if (row?.['purchase_order_data']?.['id']) {
                                balance = -row?.['value_balance'];
                                clsText = "text-red"
                            }
                        }
                        return `<span class="mask-money ${clsText}" data-init-money="${balance}"></span>`;
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
            let $table = $dtbArea.find('.table_payment_plan');
            let minWidth = "min-w-1600p";
            if (columns.length <= 10) {
                for (let i = 0; i < columns.length; i++) {
                    if (i <= 7) {
                        if (columns[i]?.['width']) {
                            delete columns[i]["width"];
                        }
                    }
                }
            }
            if (columns.length > 10) {
                let colLength = columns.length - 6;
                let rate = 51 / colLength;
                let width = `${rate}%`;
                for (let i = 0; i < columns.length; i++) {
                    if (i > 7) {
                        columns[i]["width"] = width;
                    }
                }
                if (columns.length <= 15) {
                    minWidth = "min-w-1920p";
                }
                if (columns.length > 15) {
                    minWidth = "min-w-4000p";
                }
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
                                let date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['due_date']);
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
            }
            return columns;
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
                                let date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['due_date']);
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
            }

            return columns;
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
                                let date = DateTimeControl.formatDateType('YYYY-MM-DD hh:mm:ss', 'DD/MM/YYYY', row?.['due_date']);
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
            }

            return columns;
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
            let result = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            // Nếu date1 < date2 thì return giá trị âm
            if (date1 > date2) {
                return -result;
            }
            return result;
        }

        function removeActiveBtn() {
            for (let btn of $('#btn-group-view')[0].querySelectorAll('.btn-view')) {
                $(btn).removeClass('active');
            }
            if ($dtbArea.attr('data-active-id')) {
                let activeID = $dtbArea.attr('data-active-id');
                let $activeEle = $(`#${activeID}`);
                if ($activeEle.length > 0) {
                    $activeEle.addClass('active');
                }
            }
            return true;
        }

        // init filter
        function storeFiscalYear() {
            $.fn.callAjax2({
                    'url': $urlFact.attr('data-fiscal-year'),
                    'method': "GET",
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('periods_list') && Array.isArray(data.periods_list)) {
                            $eleFiscalYear.val(JSON.stringify(data.periods_list));
                            loadBoxMonth();
                            let currentDate = new Date();
                            let currentMonth = currentDate.getMonth() + 1;
                            $boxMonth.val(currentMonth).trigger('change');
                        }
                    }
                }
            )
        }

        function loadBoxMonth() {
            let initDataMonth = JSON.parse($('#filter_month').text());
            let data = [];
            let dataMonths = parseMonthJSON();
            for (let monthYear of dataMonths) {
                data.push({
                    'id': monthYear?.['month'],
                    'title': initDataMonth[monthYear?.['month'] - 1][1],
                    'month': monthYear?.['month'],
                    'year': monthYear?.['year'],
                })
            }
            data.push({
                'id': '',
                'title': 'Select...',
                'month': 0,
                'year': 0,
            })
            $boxMonth.empty();
            $boxMonth.initSelect2({
                data: data,
                'allowClear': true,
                templateResult: function (state) {
                    let groupHTML = `<span class="badge badge-soft-success ml-2">${state?.['data']?.['year'] ? state?.['data']?.['year'] : "_"}</span>`
                    return $(`<span>${state.text} ${groupHTML}</span>`);
                },
            });
        }

        function parseMonthJSON() {
            let result = [];
            let dataMonths = getAllMonthsFiscalYear();
            for (let monthYear of dataMonths) {
                const [year, month] = monthYear.split('-').map(Number);
                result.push({
                    year,
                    month,
                });
            }
            return result;
        }

        function getAllMonthsFiscalYear() {
            let months = [];
            if ($eleFiscalYear.val()) {
                let year = new Date().getFullYear();
                let dataFiscalYear = JSON.parse($eleFiscalYear.val());
                if (dataFiscalYear.length > 0) {
                    for (let dataFY of dataFiscalYear) {
                        if (dataFY?.['fiscal_year'] === year) {
                            let startDateFY = new Date(dataFY?.['start_date']);
                            let currentDate = new Date(startDateFY);
                            // Loop for 12 months
                            for (let i = 0; i < 12; i++) {
                                let formattedMonth = currentDate.toISOString().slice(0, 7);
                                months.push(formattedMonth);
                                // Move to the next month
                                currentDate.setMonth(currentDate.getMonth() + 1);
                            }
                            break;
                        }
                    }

                }
            }
            return months;
        }

        // load init
        function initData() {
            FormElementControl.loadInitS2(boxCustomer1, [], {'account_types_mapped__account_type_order': 0}, null, true);
            FormElementControl.loadInitS2(boxSO1, [], {}, null, true);
            FormElementControl.loadInitS2(boxSupplier1, [], {'account_types_mapped__account_type_order': 1}, null, true);
            FormElementControl.loadInitS2(boxPO1, [], {}, null, true);

            FormElementControl.loadInitS2(boxCustomer, [], {'account_types_mapped__account_type_order': 0}, null, true);
            FormElementControl.loadInitS2(boxSO, [], {}, null, true);
            FormElementControl.loadInitS2(boxSupplier, [], {'account_types_mapped__account_type_order': 1}, null, true);
            FormElementControl.loadInitS2(boxPO, [], {}, null, true);

            storeFiscalYear();

            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth();
            let dataMonth = DateTimeControl.getMonthInfo((month + 1), year);
            boxStart1.val(dataMonth?.['from']);
            boxEnd1.val(dataMonth?.['to']);

            boxStart.val(dataMonth?.['from']);
            boxEnd.val(dataMonth?.['to']);

            $btnApplyFilterList.click();
        }

        // init date picker
        $('.flat-picker').each(function () {
            DateTimeControl.initFlatPickrDate(this);
        });

        $('.flat-picker-in-month').each(function () {
            DateTimeControl.initFlatPickrDateInMonth(this, 7, 2025);
        });

        // mask money
        $.fn.initMaskMoney2();

        $btnApplyFilterList.on('click', function () {
            let dataParams = {};
            if (boxCustomer1.val().length > 0) {
                dataParams['customer_id__in'] = boxCustomer1.val().join(',');
            }
            if (boxSO1.val().length > 0) {
                dataParams['sale_order_id__in'] = boxSO1.val().join(',');
            }
            if (boxSupplier1.val().length > 0) {
                dataParams['supplier_id__in'] = boxSupplier1.val().join(',');
            }
            if (boxPO1.val().length > 0) {
                dataParams['purchase_order_id__in'] = boxPO1.val().join(',');
            }
            if (checkNotPaid1[0].checked === true) {
                dataParams['value_balance__gt'] = 0;
            }
            if (boxStart1.val()) {
                let dateStart = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', boxStart1.val());
                dataParams['due_date__gte'] = dateStart + ' 00:00:00';
            }
            if (boxEnd1.val()) {
                let dateEnd = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', boxEnd1.val());
                dataParams['due_date__lte'] = dateEnd + ' 23:59:59';
            }
            if ($.fn.dataTable.isDataTable($tableList)) {
                $tableList.DataTable().destroy();
            }
            loadDblList(dataParams);
        });

        $navList.on('click', function () {
            $btnApplyFilterList.click();
        })

        $boxMonth.on('change', function () {
            let data = SelectDDControl.get_data_from_idx($boxMonth, $boxMonth.val());
            if (data?.['month'] && data?.['year']) {
                $('.flat-picker-in-month').each(function () {
                    DateTimeControl.initFlatPickrDateInMonth(this, data?.['month'], data?.['year']);
                });
                let dataMonth = DateTimeControl.getMonthInfo(data?.['month'], data?.['year']);
                boxStart.val(dataMonth?.['from']);
                boxEnd.val(dataMonth?.['to']);
            }
        })

        $btnApplyFilter.on('click', function () {
            let dataParams = {};
            if (boxCustomer.val().length > 0) {
                dataParams['customer_id__in'] = boxCustomer.val().join(',');
            }
            if (boxSO.val().length > 0) {
                dataParams['sale_order_id__in'] = boxSO.val().join(',');
            }
            if (boxSupplier.val().length > 0) {
                dataParams['supplier_id__in'] = boxSupplier.val().join(',');
            }
            if (boxPO.val().length > 0) {
                dataParams['purchase_order_id__in'] = boxPO.val().join(',');
            }
            if (checkNotPaid[0].checked === true) {
                dataParams['value_balance__gt'] = 0;
            }
            if (boxStart.val()) {
                let dateStart = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', boxStart.val());
                dataParams['due_date__gte'] = dateStart + ' 00:00:00';
            }
            if (boxEnd.val()) {
                let dateEnd = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', boxEnd.val());
                dataParams['due_date__lte'] = dateEnd + ' 23:59:59';
            }
            let columns = [];
            if ($dtbArea.attr('data-active-id')) {
                let activeID = $dtbArea.attr('data-active-id');
                if (activeID === "btn-view-day") {
                    columns = customDtbByDay();
                }
                if (activeID === "btn-view-week") {
                    columns = customDtbByWeek();
                }
                if (activeID === "btn-view-month") {
                    columns = customDtbByMonth();
                }
            }
            if (!$dtbArea.attr('data-active-id')) {
                $dtbArea.attr('data-active-id', 'btn-view-week');
                columns = customDtbByWeek();
            }
            if ($.fn.dataTable.isDataTable($dtbArea.find('.table_payment_plan'))) {
                $dtbArea.find('.table_payment_plan').DataTable().destroy();
            }
            loadDbl(dataParams, columns);
        });

        $navDetailOfMonth.on('click', function () {
            $btnApplyFilter.click();
        })

        initData();

    });
});