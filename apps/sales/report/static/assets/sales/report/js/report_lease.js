$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-lease-group');
        let boxEmployee = $('#box-report-lease-employee');
        let boxStart = $('#report-lease-lease-from');
        let boxEnd = $('#report-lease-lease-to');
        let $table = $('#table_report_lease_list');
        let $tableDetail = $('#table-lease-detail');
        let $urlFact = $('#app-url-factory');
        let $transFact = $('#app-trans-factory');
        let eleFiscalYear = $('#data-fiscal-year');
        let dataStatusLease = {
            1: $transFact.attr('data-status-lease-1'),
            2: $transFact.attr('data-status-lease-2'),
            3: $transFact.attr('data-status-lease-3'),
            4: $transFact.attr('data-status-lease-4'),
        }
        let dataAssetType = {
            1: $transFact.attr('data-asset-type-1'),
            2: $transFact.attr('data-asset-type-2'),
            3: $transFact.attr('data-asset-type-3'),
        }
        let dataStatusAsset = {
            0: $transFact.attr('data-status-recovered'),
            2: $transFact.attr('data-status-leased'),
        }

        function loadDbl(dataParams = {}) {
            $table.not('.dataTable').DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: $urlFact.attr('data-report-lease-api'),
                    type: "GET",
                    data: dataParams,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('report_lease_list')) {
                            return resp.data['report_lease_list'] ? resp.data['report_lease_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                autoWidth: true,
                scrollX: true,
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
                            let link = $urlFact.data('lo-detail').format_url_with_uuid(row?.['lease_order']?.['id']);
                            return `<div class="d-flex justify-content-between align-items-center">
                                        <a href="${link}" class="link-primary underline_hover">${row?.['lease_order']?.['code']}</a>
                                        <button
                                            type="button"
                                            class="btn btn-icon btn-lease-detail"
                                            data-bs-toggle="modal"
                                            data-bs-target="#leaseDetailModal"
                                        ><i class="fas fa-ellipsis-h"></i>
                                        </button>
                                    </div>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '10%',
                        render: (data, type, row) => {
                            let link = $urlFact.data('lo-detail').format_url_with_uuid(row?.['lease_order']?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['lease_order']?.['title']}</a>`;
                        }
                    },
                    {
                        targets: 3,
                        width: '10%',
                        render: (data, type, row) => {
                            let link = $urlFact.data('customer-detail').format_url_with_uuid(row?.['customer']?.['id']);
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['customer']?.['title']}</a>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['lease_from']) {
                                return `<span>${DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", row?.['lease_from'])}</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 5,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['lease_to']) {
                                return `<span>${DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", row?.['lease_to'])}</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 6,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['lease_status']) {
                                return `<span>${dataStatusLease[row?.['lease_status']]}</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 7,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 9,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-net-income" data-init-money="${parseFloat(row?.['net_income'])}"></span>`;
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
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

        function loadDtbDetail(dataParams = {}) {
            $tableDetail.not('.dataTable').DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: $urlFact.attr('data-delivery-product-lease-api'),
                    data: dataParams,
                    type: "GET",
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('delivery_product_lease')) {
                            let dataFn = [];
                            let dataRaw = [];
                            let checkList = [];
                            for (let deliveryProduct of resp.data['delivery_product_lease']) {
                                if (deliveryProduct?.['tool_asset_data']) {
                                    for (let dataToolAsset of deliveryProduct?.['tool_asset_data']) {
                                        dataRaw.push(dataToolAsset);
                                    }
                                }
                            }
                            for (let dataR of dataRaw) {
                                if (!checkList.includes(dataR?.['id'])) {
                                    dataFn.push(dataR);
                                }
                                checkList.push(dataR?.['id']);
                            }
                            return dataFn;
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        targets: 0,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['asset_type']) {
                                return `<span>${dataAssetType?.[row?.['asset_type']]}</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            let txt = '';
                            if (row?.['asset_type'] === 2 && row?.['tool_data']?.['id']) {
                                txt = row?.['tool_data']?.['title'];
                            }
                            if (row?.['asset_type'] === 3 && row?.['asset_data']?.['id']) {
                                txt = row?.['asset_data']?.['title'];
                            }
                            return `<span class="table-row-offset">${txt}</span>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['offset_data']?.['id']) {
                                return `<span class="table-row-offset">${row?.['offset_data']?.['title']}</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 3,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['product_lease_start_date']) {
                                return `<span>${DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", row?.['product_lease_start_date'])}</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 4,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['product_lease_end_date']) {
                                return `<span>${DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", row?.['product_lease_end_date'])}</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 5,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span>${row?.['quantity']}</span>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span>${row?.['quantity_leased']}</span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${row?.['product_cost'] ? row?.['product_cost'] : 0}"></span>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '10%',
                        render: (data, type, row) => {
                            let netValue = DepreciationControl.getNetValue({
                                "data_depreciation": row?.['depreciation_data'],
                                "current_date": DateTimeControl.getCurrentDate("DMY", "/")
                            })
                            if (row?.['asset_type'] === 1 && row?.['offset_to_asset_tool_data']?.['depreciation_data']) {
                                netValue = DepreciationControl.getNetValue({
                                    "data_depreciation": row?.['offset_to_asset_tool_data']?.['depreciation_data'],
                                    "current_date": DateTimeControl.getCurrentDate("DMY", "/")
                                })
                            }
                            return `<span class="mask-money table-row-net-value" data-init-money="${netValue ? netValue : 0}"></span>`;
                        }
                    },
                    {
                        targets: 9,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span>${row?.['product_depreciation_time']} ${$transFact.attr('data-month')}</span>`;
                        }
                    },
                ],
                drawCallback: function () {
                    $.fn.initMaskMoney2();
                    dtbDetailHDCustom();
                },
            });
        }

        function dtbDetailHDCustom() {
            let wrapper$ = $tableDetail.closest('.dataTables_wrapper');
            let $theadEle = wrapper$.find('thead');
            if ($theadEle.length > 0) {
                for (let thEle of $theadEle[0].querySelectorAll('th')) {
                    if (!$(thEle).hasClass('border-right')) {
                        $(thEle).addClass('border-right');
                    }
                }
            }
        }

        function loadModalDetail(ele) {
            let row = ele.closest('tr');
            let rowIndex = $table.DataTable().row(row).index();
            let $row = $table.DataTable().row(rowIndex);
            let rowData = $row.data();
            if (rowData?.['lease_order']?.['id']) {
                if ($.fn.dataTable.isDataTable($tableDetail)) {
                    $tableDetail.DataTable().destroy();
                }
                loadDtbDetail({
                    'delivery_sub__order_delivery__lease_order_id': rowData?.['lease_order']?.['id'],
                    'delivery_sub__system_status': 3,
                });
            }
            return true;
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
            loadDbl();
            // storeLoadInitByDataFiscalYear();
        }

        initData();

        // init date picker
        $('.date-picker').each(function () {
            DateTimeControl.initFlatPickrDate(this);
        });

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

        $table.on('click', '.btn-lease-detail', function () {
            loadModalDetail(this);
        });

        $('#btn-apply-filter').on('click', function () {
            let dataParams = {};
            if (boxGroup.val() && boxGroup.val().length > 0) {
                dataParams['employee_inherit__group_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val() && boxEmployee.val().length > 0) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            if (boxStart.val()) {
                dataParams['lease_from__gte'] = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', boxStart.val());
            }
            if (boxEnd.val()) {
                dataParams['lease_to__lte'] = DateTimeControl.formatDateType('DD/MM/YYYY', 'YYYY-MM-DD', boxEnd.val());
            }
            if ($.fn.dataTable.isDataTable($table)) {
                $table.DataTable().destroy();
            }
            loadDbl(dataParams);
        });


    });
});