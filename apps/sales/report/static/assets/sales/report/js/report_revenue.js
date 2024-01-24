$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-revenue-group');
        let boxEmployee = $('#box-report-revenue-employee');
        let btnView = $('#btn-view');
        let eleRevenue = $('#report-revenue-revenue');
        let eleGrossProfit = $('#report-revenue-gross-profit');
        let eleNetIncome = $('#report-revenue-net-income');
        let $table = $('#table_report_revenue_list');

        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                autoWidth: true,
                scrollX: true,
                columns: [  // 150,200,150,100,250,400,250,250,250 (2000p)
                    {
                        targets: 0,
                        width: '7.5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['employee_inherit']?.['code'] ? row?.['sale_order']?.['employee_inherit']?.['code'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '10%',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['employee_inherit']?.['full_name'] ? row?.['sale_order']?.['employee_inherit']?.['full_name'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '7.5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['code'] ? row?.['sale_order']?.['code'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 3,
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
                        targets: 4,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['title'] ? row?.['sale_order']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '20%',
                        render: (data, type, row) => {
                            return `<p>${row?.['sale_order']?.['customer']?.['title'] ? row?.['sale_order']?.['customer']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 6,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '12.5%',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-net-income" data-init-money="${parseFloat(row?.['net_income'])}"></span>`;
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                },
            });
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

        boxGroup.initSelect2({'allowClear': true,});
        loadBoxEmployee();

        // run datetimepicker
        $('input[type=text].date-picker').daterangepicker({
            minYear: 1901,
            timePicker: true,
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY'
            }
        });
        $('input[type=text].date-picker').val(null).trigger('change');

        // mask money
        $.fn.initMaskMoney2();

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

        btnView.on('click', function () {
            let dataParams = {};
            if (boxGroup.val()) {
                dataParams['group_inherit_id__in'] = boxGroup.val().join(',');
            }
            if (boxEmployee.val()) {
                dataParams['employee_inherit_id__in'] = boxEmployee.val().join(',');
            }
            let date = $('#report-revenue-date-approved').val();
            if (date) {
                let dateStrings = date.split(' - ');
                let dateStart = dateStrings[0] + " 00:00:00";
                let dateEnd = dateStrings[1] + " 23:59:59";
                dataParams['date_approved__gte'] = moment(dateStart, 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD hh:mm:ss');
                dataParams['date_approved__lte'] = moment(dateEnd, 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD hh:mm:ss');
            }
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
                        }
                    }
                }
            )
        });


    });
});