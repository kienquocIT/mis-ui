$(function () {
    $(document).ready(function () {

        let boxGroup = $('#box-report-product-group');
        let boxEmployee = $('#box-report-product-employee');
        let boxProduct = $('#box-report-product-product');
        let boxCategory = $('#box-report-product-category');
        let btnView = $('#btn-view');
        let eleRevenue = $('#report-product-revenue');
        let eleGrossProfit = $('#report-product-gross-profit');
        let eleNetIncome = $('#report-product-net-income');
        let $table = $('#table_report_product_list');

        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                columns: [
                    {
                        targets: 0,
                        class: 'w-5',
                        render: (data, type, row) => {
                            return `<p>${row?.['product']?.['code'] ? row?.['product']?.['code'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 1,
                        class: 'w-20',
                        render: (data, type, row) => {
                            return `<p>${row?.['product']?.['title'] ? row?.['product']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        class: 'w-15',
                        render: (data, type, row) => {
                            return `<p>${row?.['product']?.['general_product_category']?.['title'] ? row?.['product']?.['general_product_category']?.['title'] : ''}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        class: 'w-20',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-revenue" data-init-money="${parseFloat(row?.['revenue'])}"></span>`;
                        }
                    },
                    {
                        targets: 4,
                        class: 'w-20',
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-gross-profit" data-init-money="${parseFloat(row?.['gross_profit'])}"></span>`;
                        }
                    },
                    {
                        targets: 5,
                        class: 'w-20',
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

        boxGroup.initSelect2({'allowClear': true,});
        boxProduct.initSelect2({'allowClear': true,});
        boxCategory.initSelect2({'allowClear': true,});
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

        boxCategory.on('change', function() {
            loadBoxProduct();
            $table.DataTable().clear().draw();
            loadTotal();
        });

        boxProduct.on('change', function() {
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
            let date = $('#report-product-date-approved').val();
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
                        if (data.hasOwnProperty('report_product_list') && Array.isArray(data.report_product_list)) {
                            $table.DataTable().clear().draw();
                            $table.DataTable().rows.add(data.report_product_list).draw();
                            loadTotal();
                        }
                    }
                }
            )
        });


    });
});