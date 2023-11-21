$(function () {
    $(document).ready(function () {

        let boxOpp = $('#box-final-acceptance-opp');
        let boxEmployee = $('#box-final-acceptance-employee');
        let boxSO = $('#box-final-acceptance-so');
        let btnRefresh = $('#btn-refresh-data');
        let $table = $('#table_final_acceptance_list');

        function loadDbl(data) {
            $table.DataTableDefault({
                data: data ? data : [],
                searching: false,
                info: false,
                paging: false,
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            if (row?.['is_indicator'] === true) {
                                return `<p>${row?.['sale_order_indicator']?.['indicator']?.['title'] ? row?.['sale_order_indicator']?.['indicator']?.['title'] : ''}</p>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            if (row?.['is_sale_order'] === true) {
                                return `<p>${row?.['sale_order']?.['code'] ? row?.['sale_order']?.['code'] : ''}</p>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            if (row?.['is_sale_order'] === true) {
                                return `<p>${row?.['sale_order']?.['title'] ? row?.['sale_order']?.['title'] : ''}</p>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['indicator_value'])}"></span>`;
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['actual_value'])}"></span>`;
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['different_value'])}"></span>`;
                        }
                    },
                    {
                        targets: 6,
                        render: (data, type, row) => {
                            return `<p>${row?.['rate_value']}</p>`;
                        }
                    },
                    {
                        targets: 7,
                        render: (data, type, row) => {
                            return `<p>${row?.['remark'] ? row?.['remark'] : ''}</p>`;
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                },
            });
        }
        loadDbl();

        function loadFinalAcceptance() {
            $.fn.callAjax2({
                    'url': $table.attr('data-url'),
                    'method': $table.attr('data-method'),
                    'data': {'sale_order_id': boxSO.val()},
                    'isDropdown': true,
                }
            ).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('final_acceptance_list') && Array.isArray(data.final_acceptance_list)) {
                            $table.DataTable().clear().draw();
                            if (data.final_acceptance_list[0]?.['final_acceptance_indicator']) {
                                let so_row_data = {};
                                let revenueRow = null;
                                for (let indicator of data.final_acceptance_list[0]?.['final_acceptance_indicator']) {
                                    if (indicator?.['is_indicator'] === true) {
                                        let newRow = $table.DataTable().row.add(indicator).draw().node();
                                        if (indicator?.['sale_order_indicator']?.['indicator']?.['code'] === 'IN0001') {
                                            revenueRow = newRow;
                                        }
                                    } else if (indicator?.['is_sale_order'] === true) {
                                        so_row_data = indicator;
                                    }
                                }
                                let newSORow = $table.DataTable().row.add(so_row_data).draw().node();
                                $(newSORow).detach().insertAfter(revenueRow);
                            }


                            // $table.DataTable().rows.add(data.final_acceptance_list[0]?.['final_acceptance_indicator']).draw();
                        }
                    }
                }
            )
        }
        // loadFinalAcceptance();

        boxOpp.initSelect2({'allowClear': true,});
        boxEmployee.initSelect2({'allowClear': true,});
        boxSO.initSelect2({'allowClear': true,});

        // run datetimepicker
        $('input[type=text].date-picker').daterangepicker({
            minYear: 1901,
            timePicker: true,
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY'
            }
        });

        // mask money
        $.fn.initMaskMoney2();

        // Events
        // boxSO.on('change', function () {
        //     loadFinalAcceptance();
        // });

        btnRefresh.on('click', function() {
            loadFinalAcceptance();
        });

    });
});