$(function () {
    $(document).ready(function () {

        let boxOpp = $('#box-final-acceptance-opp');
        let boxEmployee = $('#box-final-acceptance-employee');
        let boxSO = $('#box-final-acceptance-so');
        let btnRefresh = $('#btn-refresh-data');
        let eleTrans = $('#app-trans-factory');
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
                                return `<p class="table-row-indicator" data-id="${row?.['id']}" data-code="${row?.['sale_order_indicator']?.['indicator']?.['code']}" data-is-delivery="${row?.['is_delivery']}" data-affect="${row?.['sale_order_indicator']?.['indicator']?.['acceptance_affect_by']}" data-editable="${row?.['sale_order_indicator']?.['indicator']?.['is_acceptance_editable']}" data-formula="${formula}">${row?.['sale_order_indicator']?.['indicator']?.['title'] ? row?.['sale_order_indicator']?.['indicator']?.['title'] : ''}</p>`;
                            } else {
                                return `<p class="table-row-indicator" data-id="${row?.['id']}" data-code="${row?.['sale_order_indicator']?.['indicator']?.['code']}" data-is-delivery="${row?.['is_delivery']}" data-affect="${row?.['sale_order_indicator']?.['indicator']?.['acceptance_affect_by']}" data-editable="${row?.['sale_order_indicator']?.['indicator']?.['is_acceptance_editable']}"></p>`;
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
                            } else if (row?.['is_delivery'] === true) {
                                return `<p>${row?.['delivery_sub']?.['code'] ? row?.['delivery_sub']?.['code'] : ''}</p>`;
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
                            } else if (row?.['is_delivery'] === true) {
                                return `<p>${row?.['delivery_sub']?.['title'] ? row?.['delivery_sub']?.['title'] : ''}</p>`;
                            }
                            else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            if (row?.['is_indicator'] === true) {
                                return `<b><span class="mask-money table-row-planed-value" data-init-money="${parseFloat(row?.['indicator_value'])}"></span></b>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 4,
                        render: (data, type, row) => {
                            if (row?.['is_indicator'] === true) {
                                return `<b><span class="mask-money table-row-actual-value" data-init-money="${parseFloat(row?.['actual_value'])}"></span></b>`;
                            } else {
                                if (row?.['sale_order_indicator']?.['indicator']?.['is_acceptance_editable'] === true) {
                                    return `<div class="row">
                                            <input 
                                                type="text" 
                                                class="form-control mask-money table-row-actual-value" 
                                                value="${row?.['actual_value']}"
                                                data-return-type="number"
                                                data-is-delivery="${row?.['is_delivery']}"
                                            >
                                        </div>`;
                                } else {
                                    return `<span class="mask-money table-row-actual-value" data-init-money="${parseFloat(row?.['actual_value'])}"></span>`;
                                }
                            }
                        }
                    },
                    {
                        targets: 5,
                        render: (data, type, row) => {
                            if (row?.['is_indicator'] === true) {
                                return `<span class="mask-money table-row-different-value" data-init-money="${parseFloat(row?.['different_value'])}"></span>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 6,
                        render: (data, type, row) => {
                            return `<p class="table-row-rate-value" data-value="${row?.['rate_value']}">${row?.['rate_value']} %</p>`;
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
                                let delivery_row_data = [];
                                let revenueRow = null;
                                let deliveryAffectRow = null;
                                for (let indicator of data.final_acceptance_list[0]?.['final_acceptance_indicator']) {
                                    if (indicator?.['is_indicator'] === true) {
                                        let newRow = $table.DataTable().row.add(indicator).draw().node();
                                        if (indicator?.['sale_order_indicator']?.['indicator']?.['code'] === 'IN0001') {
                                            revenueRow = newRow;
                                        }
                                        if (indicator?.['sale_order_indicator']?.['indicator']?.['acceptance_affect_by'] === 3) {
                                            deliveryAffectRow = newRow;
                                        }
                                    } else if (indicator?.['is_sale_order'] === true) {
                                        so_row_data = indicator;
                                    } else if (indicator?.['is_payment'] === true) {
                                        if (payment_row_data.hasOwnProperty(indicator?.['expense_item']?.['title'])) {
                                            payment_row_data[indicator['expense_item']['title']].push(indicator);
                                        } else {
                                            payment_row_data[indicator['expense_item']['title']] = [indicator];
                                        }
                                    } else if (indicator?.['is_delivery'] === true) {
                                        delivery_row_data.push(indicator);
                                    }
                                }
                                // Sale order row
                                let newSORow = $table.DataTable().row.add(so_row_data).node();
                                if (revenueRow) {
                                    $(newSORow).detach().insertAfter(revenueRow);
                                }
                                // Payment rows
                                for (let i = 0; i < $table[0].tBodies[0].rows.length; i++) {
                                    let row = $table[0].tBodies[0].rows[i];
                                    if (row?.querySelector('.table-row-indicator')) {
                                        if (row.getAttribute('data-affect') === '4') {
                                            let dataFormula = row?.querySelector('.table-row-indicator').getAttribute('data-formula');
                                            if (dataFormula) {
                                                for (let key in payment_row_data) {
                                                    if (dataFormula.includes(key)) {
                                                        let newActualValue = 0;
                                                        for (let payment_data of payment_row_data[key]) {
                                                            payment_data['is_acceptance_editable'] = row?.['is_acceptance_editable'];
                                                            let newPaymentRow = $table.DataTable().row.add(payment_data).node();
                                                            $(newPaymentRow).detach().insertAfter(row);
                                                            newActualValue += payment_data?.['actual_value'];
                                                        }
                                                        loadActualDifferentRateValue(row, newActualValue);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                // Delivery rows
                                let newActualValue = 0;
                                let deliveryExistRow = null;
                                for (let delivery_data of delivery_row_data) {
                                    if (deliveryAffectRow?.querySelector('.table-row-indicator').getAttribute('data-editable') === 'true') {
                                        delivery_data['is_acceptance_editable'] = true;
                                    } else {
                                        delivery_data['is_acceptance_editable'] = false;
                                    }
                                    let newDeliRow = $table.DataTable().row.add(delivery_data).node();
                                    if (!deliveryExistRow) {
                                        deliveryExistRow = deliveryAffectRow;
                                    }
                                    $(newDeliRow).detach().insertAfter(deliveryExistRow);
                                    deliveryExistRow = newDeliRow;
                                    newActualValue += delivery_data?.['actual_value'];
                                }
                                loadActualDifferentRateValue(deliveryAffectRow, newActualValue);
                            $.fn.initMaskMoney2();
                            }
                        }
                    }
                }
            )
        }

        function loadActualDifferentRateValue(row, newActualValue) {
            let elePlanedVal = row?.querySelector('.table-row-planed-value')?.getAttribute('data-init-money');
            let eleActual = row?.querySelector('.table-row-actual-value');
            let eleDifferent = row?.querySelector('.table-row-different-value');
            let eleRate = row?.querySelector('.table-row-rate-value');
            if (elePlanedVal && eleActual && eleDifferent && eleRate) {
                // set actual value
                if (eleActual.hasAttribute('data-init-money')) {
                    eleActual.setAttribute('data-init-money', String(newActualValue));
                } else {
                    $(eleActual).attr('value', String(newActualValue));
                }
                // set different value
                let differVal = parseFloat(elePlanedVal) - parseFloat(newActualValue);
                eleDifferent.setAttribute('data-init-money', String(differVal));
                // set rate value
                let rateValue = parseFloat(eleRate.getAttribute('data-value'));
                let revenueEle = $table[0].querySelector('.table-row-indicator[data-code="IN0001"]');
                if (revenueEle) {
                    let revenueRow = revenueEle.closest('tr');
                    let revenuePlanedVal = revenueRow?.querySelector('.table-row-planed-value')?.getAttribute('data-init-money');
                    eleRate.innerHTML = '';
                    rateValue = ((parseFloat(newActualValue) / parseFloat(revenuePlanedVal)) * 100).toFixed(1);
                    eleRate.innerHTML = String(rateValue) + ' %';
                }
                $.fn.initMaskMoney2();
                // update updateIndicatorData Submit Data
                let IDIndicator = row?.querySelector('.table-row-indicator')?.getAttribute('data-id');
                updateIndicatorData[IDIndicator] = {'actual_value': newActualValue, 'different_value': differVal, 'rate_value': rateValue};
            }
        }

        function changeActualValue(row, eleInput) {
            let elePlanedVal = row?.querySelector('.table-row-planed-value')?.getAttribute('data-init-money');
            let eleDifferent = row?.querySelector('.table-row-different-value');
            let eleRate = row?.querySelector('.table-row-rate-value');
            if (elePlanedVal && eleDifferent && eleRate) {
                // set different value
                let differVal = parseFloat(elePlanedVal) - parseFloat(eleInput.value);
                eleDifferent.setAttribute('data-init-money', String(differVal));
                // set rate value
                let rateValue = parseFloat(eleRate.getAttribute('data-value'));
                let revenueEle = $table[0].querySelector('.table-row-indicator[data-code="IN0001"]');
                if (revenueEle) {
                    let revenueRow = revenueEle.closest('tr');
                    let revenuePlanedVal = revenueRow?.querySelector('.table-row-planed-value')?.getAttribute('data-init-money');
                    eleRate.innerHTML = '';
                    rateValue = ((parseFloat(eleInput.value) / parseFloat(revenuePlanedVal)) * 100).toFixed(1);
                    eleRate.innerHTML = String(rateValue) + ' %';
                }
                // reCalculate LNT
                if (!['IN0001', 'IN0002', 'IN0003', 'IN0004', 'IN0005', 'IN0006'].includes(row?.querySelector('.table-row-indicator').getAttribute('data-code'))) {
                    let netIncomeEle = $table[0].querySelector('.table-row-indicator[data-code="IN0006"]');
                    if (netIncomeEle) {
                        let netIncomeRow = netIncomeEle.closest('tr');
                        let netIncomePlanedVal = parseFloat(netIncomeRow?.querySelector('.table-row-planed-value').getAttribute('data-init-money'));
                        let netIncomeActualVal = parseFloat(netIncomeRow?.querySelector('.table-row-actual-value').getAttribute('data-init-money'));
                        let newActualValue = netIncomePlanedVal;
                        if (differVal !== 0) {
                            newActualValue = netIncomeActualVal + differVal;
                        }
                        loadActualDifferentRateValue(netIncomeRow, newActualValue);
                    }
                } else {
                    if (row?.querySelector('.table-row-indicator').getAttribute('data-code') === 'IN0002') {
                        let grossProfitEle = $table[0].querySelector('.table-row-indicator[data-code="IN0003"]');
                        if (grossProfitEle) {
                            let grossProfitRow = grossProfitEle.closest('tr');
                            let grossProfitPlanedVal = parseFloat(grossProfitRow?.querySelector('.table-row-planed-value').getAttribute('data-init-money'));
                            let grossProfitActualVal = parseFloat(grossProfitRow?.querySelector('.table-row-actual-value').getAttribute('data-init-money'));
                            let newActualValue = grossProfitPlanedVal;
                            if (differVal !== 0) {
                                newActualValue = grossProfitActualVal + differVal;
                            }
                            loadActualDifferentRateValue(grossProfitRow, newActualValue);
                        }
                        let netIncomeEle = $table[0].querySelector('.table-row-indicator[data-code="IN0006"]');
                        if (netIncomeEle) {
                            let netIncomeRow = netIncomeEle.closest('tr');
                            let netIncomePlanedVal = parseFloat(netIncomeRow?.querySelector('.table-row-planed-value').getAttribute('data-init-money'));
                            let netIncomeActualVal = parseFloat(netIncomeRow?.querySelector('.table-row-actual-value').getAttribute('data-init-money'));
                            let newActualValue = netIncomePlanedVal;
                            if (grossProfitEle) {
                                let grossProfitRow = grossProfitEle.closest('tr');
                                let grossProfitDifferentVal = parseFloat(grossProfitRow?.querySelector('.table-row-different-value').getAttribute('data-init-money'));
                                if (grossProfitDifferentVal !== 0) {
                                    newActualValue = netIncomeActualVal + differVal;
                                }
                            }
                            loadActualDifferentRateValue(netIncomeRow, newActualValue);
                        }
                    }
                }
                $.fn.initMaskMoney2();
                let IDIndicator = row?.querySelector('.table-row-indicator')?.getAttribute('data-id');
                updateIndicatorData[IDIndicator] = {'actual_value': parseFloat(eleInput.value), 'different_value': differVal, 'rate_value': rateValue}
            }
        }

        function loadOpp(dataOpp = {}) {
            boxOpp.empty();
            boxOpp.initSelect2({
                data: dataOpp,
                'allowClear': true,
            });
        }
        loadOpp();

        function loadEmployee(dataEmployee = {}) {
            boxEmployee.empty();
            boxEmployee.initSelect2({
                data: dataEmployee,
            });
        }
        loadEmployee();

        function loadSO(dataSO = {}) {
            boxSO.empty();
            boxSO.initSelect2({
                data: dataSO,
                'allowClear': true,
            });
        }
        loadSO();

        function calculateIndicator(indicator_title, changeValue) {
            for (let i = 0; i < $table[0].tBodies[0].rows.length; i++) {
                let row = $table[0].tBodies[0].rows[i];
                if (row?.querySelector('.table-row-indicator')) {
                    let dataFormula = row?.querySelector('.table-row-indicator').getAttribute('data-formula');
                    if (dataFormula) {
                        if (dataFormula.includes(indicator_title)) {

                        }
                    }
                }

            }
        }

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
        boxOpp.on('change', function () {
            if (boxOpp.val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(boxOpp, boxOpp.val());
                if (dataSelected) {
                    loadSO(dataSelected?.['sale_order']);
                    loadEmployee(dataSelected?.['sale_person']);
                }
            }
        });

        boxSO.on('change', function () {
            if (boxSO.val()) {
                let dataSelected = SelectDDControl.get_data_from_idx(boxSO, boxSO.val());
                if (dataSelected) {
                    loadOpp(dataSelected?.['opportunity']);
                    loadEmployee(dataSelected?.['sale_person']);
                }
            }
        });

        btnRefresh.on('click', function () {
            if (boxSO.val()) {
                loadFinalAcceptance();
            } else {
                $.fn.notifyB({description: eleTrans.attr('data-select-so')}, 'failure');
                return false
            }
            return true;
        });

        $table.on('change', '.table-row-actual-value', function () {
            if (this.getAttribute('data-is-delivery') === 'true') {
                let totalCostEle = $table[0].querySelector('.table-row-indicator[data-code="IN0002"]');
                if (totalCostEle) {
                    let totalCostRow = totalCostEle.closest('tr');
                    let newActualValue = 0;
                    for (let eleIndicator of $table[0].querySelectorAll('.table-row-indicator[data-is-delivery="true"]')) {
                        let deliRow = eleIndicator.closest('tr');
                        newActualValue += parseFloat($(deliRow?.querySelector('.table-row-actual-value')).valCurrency());
                    }
                    loadActualDifferentRateValue(totalCostRow, newActualValue);
                }
            } else {
                let row = this.closest('tr');
                changeActualValue(row, this);
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