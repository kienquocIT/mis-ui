$(function () {
    $(document).ready(function () {

        let $boxLease = $('#box-lease-order');
        let $table = $('#table_asset_status_lease_list');
        let $urlFact = $('#app-urls-factory');
        let $transFact = $('#app-trans-factory');
        let dataAssetType = {
            'Fixed asset': $transFact.attr('data-fixed-asset'),
            'Tool': $transFact.attr('data-tool'),
        };

        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                autoWidth: true,
                scrollX: true,
                pageLength: 50,
                columns: [
                    {
                        targets: 0,
                        width: '3%',
                        render: (data, type, row) => {
                            return `<span>${row?.['code'] ? row?.['code'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span>${row?.['title'] ? row?.['title'] : ''}</span>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '5%',
                        render: (data, type, row) => {
                            if (row?.['asset_type']) {
                                return `<span>${dataAssetType[row?.['asset_type']]}</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 3,
                        width: '3%',
                        render: (data, type, row) => {
                            return `<span>${row?.['quantity'] ? row?.['quantity'] : 0}</span>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '5%',
                        render: (data, type, row) => {
                            return `<span>${row?.['quantity_leased'] ? row?.['quantity_leased'] : 0}</span>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['lease_order_data']?.['id']) {
                                let link = $urlFact.data('lo-detail').format_url_with_uuid(row?.['lease_order_data']?.['id']);
                                return `<a href="${link}" class="link-primary underline_hover">${row?.['lease_order_data']?.['code']}</a>`;
                            }
                            return `<span>--</span>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '8%',
                        render: (data, type, row) => {
                            if (row?.['lease_order_data']?.['id']) {
                                let link = $urlFact.data('lo-detail').format_url_with_uuid(row?.['lease_order_data']?.['id']);
                                return `<a href="${link}" class="link-primary underline_hover">${row?.['lease_order_data']?.['title']}</a>`;
                            }
                            return `<span>--</span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '5%',
                        render: (data, type, row) => {
                            if (row?.['lease_order_data']?.['product_lease_start_date']) {
                               return `<span>${DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", row?.['lease_order_data']?.['product_lease_start_date'])}</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 8,
                        width: '5%',
                        render: (data, type, row) => {
                            if (row?.['lease_order_data']?.['product_lease_end_date']) {
                                return `<span>${DateTimeControl.formatDateType("YYYY-MM-DD", "DD/MM/YYYY", row?.['lease_order_data']?.['product_lease_end_date'])}</span>`;
                            }
                            return ``;
                        }
                    },
                    {
                        targets: 9,
                        width: '10%',
                        render: (data, type, row) => {
                            if (row?.['lease_order_data']?.['customer']?.['id']) {
                                let link = $urlFact.data('customer-detail').format_url_with_uuid(row?.['lease_order_data']?.['customer']?.['id']);
                                return `<a href="${link}" class="link-primary underline_hover">${row?.['lease_order_data']?.['customer']?.['title']}</a>`;
                            }
                            return `<span>--</span>`;
                        }
                    },
                    // {
                    //     targets: 10,
                    //     width: '10%',
                    //     render: (data, type, row) => {
                    //         return `<span class="mask-money table-row-net-value" data-init-money="${row?.['origin_cost'] ? row?.['origin_cost'] : 0}"></span>`;
                    //     }
                    // },
                    // {
                    //     targets: 11,
                    //     width: '10%',
                    //     render: (data, type, row) => {
                    //         let netValue = DepreciationControl.getNetValue({
                    //             "data_depreciation": row?.['depreciation_data'],
                    //             "current_date": DateTimeControl.getCurrentDate("DMY", "/")
                    //         })
                    //         return `<span class="mask-money table-row-net-value" data-init-money="${netValue ? netValue : 0}"></span>`;
                    //     }
                    // },
                    {
                        targets: 10,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<span>${row?.['depreciation_time'] ? row?.['depreciation_time'] : 0} ${$transFact.attr('data-month')}</span>`;
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
            loadInitS2($boxLease, [], {}, null, true);
            loadDbl();
            callAjaxAssetTool();
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

        function callAjaxAssetTool() {
            let dataParams1 = {};
            let dataParams2 = {};
            if ($boxLease.val() && $boxLease.val().length > 0) {
                dataParams1['delivery_pa_asset__delivery_sub__order_delivery__lease_order_id__in'] = $boxLease.val().join(',');
                dataParams2['delivery_pt_tool__delivery_sub__order_delivery__lease_order_id__in'] = $boxLease.val().join(',');
            }
            WindowControl.showLoading();
            $.fn.callAjax2({
                    'url': $urlFact.attr('data-asset-status-lease'),
                    'method': 'GET',
                    'data': dataParams1,
                    isLoading: true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('fixed_asset_status_lease_list') && Array.isArray(data.fixed_asset_status_lease_list)) {
                            let data1 = data.fixed_asset_status_lease_list;
                            $.fn.callAjax2({
                                    'url': $urlFact.attr('data-tool-status-lease'),
                                    'method': 'GET',
                                    'data': dataParams2,
                                    isLoading: true,
                                }
                            ).then(
                                (resp) => {
                                    let data = $.fn.switcherResp(resp);
                                    if (data) {
                                        if (data.hasOwnProperty('instrument_tool_status_lease_list') && Array.isArray(data.instrument_tool_status_lease_list)) {
                                            let dataFn = data1.concat(data.instrument_tool_status_lease_list);
                                            $table.DataTable().clear().draw();
                                            $table.DataTable().rows.add(dataFn).draw();
                                            WindowControl.hideLoading();
                                        }
                                    }
                                }
                            )
                        }
                    }
                }
            )
        }

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
                drops: 'down',
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
            });
            $(this).val('').trigger('change');
        })

        // mask money
        $.fn.initMaskMoney2();

        $('#btn-apply-filter').on('click', function () {
            callAjaxAssetTool();
        });

    });
});