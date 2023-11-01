$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-revenue-group');
        let boxEmployee = $('#box-report-revenue-employee');
        let $table = $('#table_report_revenue_list')

        function loadDbl() {
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('report_revenue_list')) {
                            return resp.data['report_revenue_list'] ? resp.data['report_revenue_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        targets: 0,
                        class: 'w-5',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['employee_inherit']?.['code'] ? row?.['sale_order']?.['employee_inherit']?.['code'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 1,
                        class: 'w-10',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['employee_inherit']?.['full_name'] ? row?.['sale_order']?.['employee_inherit']?.['full_name'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        class: 'w-5',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['code'] ? row?.['sale_order']?.['code'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        class: 'w-10',
                        render: (data, type, row) => {
                            return `<p>${moment(row?.['date_approved'] ? row?.['date_approved'] : '').format('DD/MM/YYYY')}</p>`;
                        }
                    },
                    {
                        targets: 4,
                        class: 'w-5',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['title'] ? row?.['sale_order']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 5,
                        class: 'w-20',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['customer']?.['title'] ? row?.['sale_order']?.['customer']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 6,
                        class: 'w-20',
                        render: (data, type, row) => {
                            let value = '0';
                            for (let indicator of row?.['indicator']) {
                                if (indicator?.['code'] === 'IN0001') {
                                    value = indicator?.['indicator_value'];
                                }
                            }
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(value)}"></span>`;
                        }
                    },
                    {
                        targets: 7,
                        class: 'w-20',
                        render: (data, type, row) => {
                            let value = '0';
                            for (let indicator of row?.['indicator']) {
                                if (indicator?.['code'] === 'IN0003') {
                                    value = indicator?.['indicator_value'];
                                }
                            }
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(value)}"></span>`;
                        }
                    },
                    {
                        targets: 8,
                        class: 'w-20',
                        render: (data, type, row) => {
                            let value = '0';
                            for (let indicator of row?.['indicator']) {
                                if (indicator?.['code'] === 'IN0005') {
                                    value = indicator?.['indicator_value'];
                                }
                            }
                            return `<span class="mask-money table-row-net-income" data-init-money="${parseFloat(value)}"></span>`;
                        }
                    },
                ],
                rowCallback: (row, data) => {
                    let eleRevenue = $('#report-revenue-revenue');
                    let currentRevenue = eleRevenue.attr('data-init-money');
                    let rowRevenue = row?.querySelector('.table-row-revenue')?.getAttribute('data-init-money');
                    if (currentRevenue && rowRevenue) {
                        let newRevenue = parseFloat(currentRevenue) + parseFloat(rowRevenue);
                    $(eleRevenue).attr('data-init-money', String(newRevenue));
                    }
                    //
                    let eleGrossProfit = $('#report-revenue-gross-profit');
                    let currentGrossProfit = eleGrossProfit.attr('data-init-money');
                    let rowGrossProfit = row?.querySelector('.table-row-gross-profit')?.getAttribute('data-init-money');
                    if (currentGrossProfit && rowGrossProfit) {
                        let newGrossProfit = parseFloat(currentGrossProfit) + parseFloat(rowGrossProfit);
                    $(eleGrossProfit).attr('data-init-money', String(newGrossProfit));
                    }
                    //
                    let eleNetIncome = $('#report-revenue-net-income');
                    let currentNetIncome = eleNetIncome.attr('data-init-money');
                    let rowNetIncome = row?.querySelector('.table-row-net-income')?.getAttribute('data-init-money');
                    if (currentNetIncome && rowNetIncome) {
                        let newNetIncome = parseFloat(currentNetIncome) + parseFloat(rowNetIncome);
                    $(eleNetIncome).attr('data-init-money', String(newNetIncome));
                    }
                },
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                },
            });
        }

        loadDbl();

        boxGroup.initSelect2({});
        loadBoxEmployee();

        function loadBoxEmployee() {
            if (boxGroup.val()) {
                boxEmployee.initSelect2({
                    'dataParams': {'group__id': boxGroup.val()},
                    callbackTextDisplay: function (item) {
                        return item?.['full_name'] || '';
                    },
                });
            } else {
                boxEmployee.initSelect2({
                    callbackTextDisplay: function (item) {
                        return item?.['full_name'] || '';
                    },
                });
            }
        }


        // run datetimepicker
        $('input[type=text].date-picker').daterangepicker({
            minYear: 1901,
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY hh:mm A'
            }
        });
        // mask money
        $.fn.initMaskMoney2();

        // Events
        boxGroup.on('change', function() {
            boxEmployee.empty();
            loadBoxEmployee();
        });

    });
});