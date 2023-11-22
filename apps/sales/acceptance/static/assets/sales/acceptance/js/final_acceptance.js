$(function () {
    $(document).ready(function () {

        let boxOpp = $('#box-final-acceptance-opp');
        let boxEmployee = $('#box-final-acceptance-employee');
        let boxSO = $('#box-final-acceptance-so');
        let btnRefresh = $('#btn-refresh-data');
        let $table = $('#table_final_acceptance_list');
        let updateIndicatorData = {};
        let $form = $('#frm_final_acceptance_update');

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
                                let formula = "";
                                if (row?.['sale_order_indicator']?.['indicator']?.['formula_data_show']) {
                                    formula = row?.['sale_order_indicator']?.['indicator']?.['formula_data_show'].replace(/"/g, "'");
                                }
                                return `<p class="table-row-indicator" data-id="${row?.['id']}" data-formula="${formula}">${row?.['sale_order_indicator']?.['indicator']?.['title'] ? row?.['sale_order_indicator']?.['indicator']?.['title'] : ''}</p>`;
                            } else {
                                return `<p class="table-row-indicator" data-id="${row?.['id']}"></p>`;
                            }
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            if (row?.['is_sale_order'] === true) {
                                return `<p>${row?.['sale_order']?.['code'] ? row?.['sale_order']?.['code'] : ''}</p>`;
                            } else if (row?.['is_payment'] === true) {
                                return `<p>${row?.['payment']?.['code'] ? row?.['payment']?.['code'] : ''}</p>`;
                            }
                            else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            if (row?.['is_sale_order'] === true) {
                                return `<p>${row?.['sale_order']?.['title'] ? row?.['sale_order']?.['title'] : ''}</p>`;
                            } else if (row?.['is_payment'] === true) {
                                return `<p>${row?.['payment']?.['title'] ? row?.['payment']?.['title'] : ''}</p>`;
                            }
                            else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-planed-value" data-init-money="${parseFloat(row?.['indicator_value'])}"></span>`;
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            if (row?.['sale_order_indicator']?.['indicator']?.['title'] !== 'HR labor expense') {
                                return `<span class="mask-money table-row-actual-value" data-init-money="${parseFloat(row?.['actual_value'])}"></span>`;
                            } else {
                                return `<div class="row">
                                            <input 
                                                type="text" 
                                                class="form-control mask-money table-row-actual-value" 
                                                value="${row?.['actual_value']}"
                                                data-return-type="number"
                                            >
                                        </div>`;
                            }
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row) => {
                            return `<span class="mask-money table-row-different-value" data-init-money="${parseFloat(row?.['different_value'])}"></span>`;
                        }
                    },
                    {
                        targets: 6,
                        render: (data, type, row) => {
                            return `<p>${row?.['rate_value']} %</p>`;
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
                                let urlDetail = $form.attr('data-url').format_url_with_uuid(data.final_acceptance_list[0]?.['id']);
                                $form[0].setAttribute('data-url', urlDetail);
                                let so_row_data = {};
                                let payment_row_data = {};
                                let revenueRow = null;
                                for (let indicator of data.final_acceptance_list[0]?.['final_acceptance_indicator']) {
                                    if (indicator?.['is_indicator'] === true) {
                                        let newRow = $table.DataTable().row.add(indicator).draw().node();
                                        if (indicator?.['sale_order_indicator']?.['indicator']?.['code'] === 'IN0001') {
                                            revenueRow = newRow;
                                        }
                                    } else if (indicator?.['is_sale_order'] === true) {
                                        so_row_data = indicator;
                                    } else if (indicator?.['is_payment'] === true) {
                                        if (payment_row_data.hasOwnProperty(indicator?.['expense_item']?.['title'])) {
                                            payment_row_data[indicator['expense_item']['title']].push(indicator);
                                        } else {
                                            payment_row_data[indicator['expense_item']['title']] = [indicator];
                                        }
                                        // payment_row_data.push(indicator);
                                    }
                                }
                                // Sale order row
                                let newSORow = $table.DataTable().row.add(so_row_data).node();
                                $(newSORow).detach().insertAfter(revenueRow);
                                // Payment rows
                                for (let i = 0; i < $table[0].tBodies[0].rows.length; i++) {
                                    let row = $table[0].tBodies[0].rows[i];
                                    if (row?.querySelector('.table-row-indicator')) {
                                        let dataFormula = row?.querySelector('.table-row-indicator').getAttribute('data-formula');
                                        if (dataFormula) {
                                            for (let key in payment_row_data) {
                                                if (dataFormula.includes(key)) {
                                                    let newActualValue = 0;
                                                    for (let payment_data of payment_row_data[key]) {
                                                        let newPaymentRow = $table.DataTable().row.add(payment_data).node();
                                                        $(newPaymentRow).detach().insertAfter(row);
                                                        newActualValue += payment_data?.['actual_value'];
                                                    }
                                                    loadActualDifferentValue(row, newActualValue);
                                                }
                                            }
                                        }
                                    }
                                }
                            $.fn.initMaskMoney2();
                            }
                            // $table.DataTable().rows.add(data.final_acceptance_list[0]?.['final_acceptance_indicator']).draw();
                        }
                    }
                }
            )
        }
        // loadFinalAcceptance();

        function loadActualDifferentValue(row, newActualValue) {
            let elePlanedVal = row?.querySelector('.table-row-planed-value')?.getAttribute('data-init-money');
            let eleActual = row?.querySelector('.table-row-actual-value');
            let eleDifferent = row?.querySelector('.table-row-different-value');
            if (elePlanedVal && eleActual && eleDifferent) {
                eleActual.setAttribute('data-init-money', String(newActualValue));
                let differVal = parseFloat(elePlanedVal) - parseFloat(newActualValue);
                eleDifferent.setAttribute('data-init-money', String(differVal));
                $.fn.initMaskMoney2();
                let IDIndicator = row?.querySelector('.table-row-indicator')?.getAttribute('data-id');
                updateIndicatorData[IDIndicator] = {'actual_value': newActualValue, 'different_value': differVal}
            }
        }

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

        $table.on('change', '.table-row-actual-value', function () {
            let row = this.closest('tr');
            let elePlanedVal = row?.querySelector('.table-row-planed-value')?.getAttribute('data-init-money');
            let eleDifferent = row?.querySelector('.table-row-different-value');
            if (elePlanedVal && eleDifferent) {
                let differVal = parseFloat(elePlanedVal) - parseFloat(this.value);
                eleDifferent.setAttribute('data-init-money', String(differVal));
                $.fn.initMaskMoney2();
                let IDIndicator = row?.querySelector('.table-row-indicator')?.getAttribute('data-id');
                updateIndicatorData[IDIndicator] = {'actual_value': parseFloat(this.value), 'different_value': differVal}
            }
        });

        // SUBMIT FORM
        $form.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit($form);
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, {'final_acceptance_indicator': updateIndicatorData}, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.message}, 'success')
                            $.fn.redirectUrl($form.attr('data-url-redirect'), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                    }
                )
        });

    });
});