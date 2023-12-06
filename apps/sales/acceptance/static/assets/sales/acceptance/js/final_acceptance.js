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
                            let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                            if (row?.['is_indicator'] === true) {
                                let formula = "";
                                if (row?.['indicator']?.['formula_data_show']) {
                                    formula = row?.['indicator']?.['formula_data_show'].replace(/"/g, "'");
                                }
                                return `<p class="table-row-indicator" data-id="${row?.['id']}" data-code="${row?.['indicator']?.['code'] ? row?.['indicator']?.['code'] : ''}" data-row="${dataRow}" data-formula="${formula}">${row?.['indicator']?.['title'] ? row?.['indicator']?.['title'] : ''}</p>`;
                            } else {
                                return `<p class="table-row-indicator" data-id="${row?.['id']}" data-code="" data-row="${dataRow}"></p>`;
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
                            if (row?.['is_indicator'] === true) { // INDICATOR ROWS
                                if (row?.['indicator']?.['acceptance_affect_by'] === 2) { // Plan value
                                    let actualVal = row?.['actual_value'];
                                    if (actualVal === 0) {
                                        actualVal = row?.['indicator_value'];
                                    }
                                    if (row?.['indicator']?.['is_acceptance_editable'] === true) { // editable
                                        return `<div class="row">
                                                <input 
                                                    type="text" 
                                                    class="form-control mask-money table-row-actual-value" 
                                                    value="${actualVal}"
                                                    data-return-type="number"
                                                >
                                            </div>`;
                                    } else { // not editable
                                        return `<b><span class="mask-money table-row-actual-value" data-init-money="${actualVal}"></span></b>`;
                                    }
                                } else {
                                    return `<b><span class="mask-money table-row-actual-value" data-init-money="${parseFloat(row?.['actual_value'])}"></span></b>`;
                                }
                            } else { // NOT INDICATOR ROWS
                                if (row?.['indicator']?.['is_acceptance_editable'] === true) {
                                    return `<div class="row">
                                                <input 
                                                    type="text" 
                                                    class="form-control mask-money table-row-actual-value" 
                                                    value="${row?.['actual_value']}"
                                                    data-return-type="number"
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
                            if (row?.['is_indicator'] === true) {
                                return `<p class="table-row-rate-value" data-value="${row?.['rate_value']}">${row?.['rate_value']} %</p>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 7,
                        render: (data, type, row) => {
                            return `<input class="form-control" value="${row?.['remark'] ? row?.['remark'] : ''}">`;
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
                                let planRows = [];
                                let payment_row_data = {};
                                let delivery_row_data = [];
                                let deliveryAffectRows = [];
                                let paymentAffectRows = [];
                                let otherExpensesRow = null;
                                let changeRows = [];
                                for (let indicator of data.final_acceptance_list[0]?.['final_acceptance_indicator']) {
                                    if (indicator?.['is_indicator'] === true) {
                                        let newRow = $table.DataTable().row.add(indicator).draw().node();
                                        // acceptance_affect_by plan value
                                        if (indicator?.['indicator']?.['acceptance_affect_by'] === 2) {
                                            planRows.push(newRow);
                                        }
                                        // acceptance_affect_by delivery
                                        if (indicator?.['indicator']?.['acceptance_affect_by'] === 3) {
                                            deliveryAffectRows.push(newRow);
                                        }
                                        // acceptance_affect_by payment
                                        if (indicator?.['indicator']?.['acceptance_affect_by'] === 4 && indicator?.['indicator']?.['code'] !== 'IN0005') {
                                            paymentAffectRows.push(newRow);
                                        }
                                        // other expenses
                                        if (indicator?.['indicator']?.['code'] === 'IN0005') {
                                            otherExpensesRow = newRow;
                                        }
                                    } else if (indicator?.['is_payment'] === true) {
                                        // payment on labor item
                                        if (indicator?.['labor_item']?.['title']) {
                                            if (payment_row_data.hasOwnProperty(indicator?.['labor_item']?.['title'].toLowerCase())) {
                                                payment_row_data[indicator['labor_item']['title'].toLowerCase()].push(indicator);
                                            } else {
                                                payment_row_data[indicator['labor_item']['title'].toLowerCase()] = [indicator];
                                            }
                                        } else {
                                            // payment on expense item
                                            if (indicator?.['expense_item']?.['title']) {
                                                if (payment_row_data.hasOwnProperty(indicator?.['expense_item']?.['title'].toLowerCase())) {
                                                    payment_row_data[indicator['expense_item']['title'].toLowerCase()].push(indicator);
                                                } else {
                                                    payment_row_data[indicator['expense_item']['title'].toLowerCase()] = [indicator];
                                                }
                                            }
                                        }
                                    } else if (indicator?.['is_delivery'] === true) {
                                        delivery_row_data.push(indicator);
                                    }
                                }
                                // Update Plan rows
                                for (let planRow of planRows) {
                                    let newActualValue = 0;
                                    if (planRow.querySelector('.table-row-actual-value').hasAttribute('data-init-money')) {
                                        newActualValue = parseFloat(planRow.querySelector('.table-row-actual-value').getAttribute('data-init-money'));
                                    } else {
                                        newActualValue = parseFloat($(planRow.querySelector('.table-row-actual-value')).valCurrency());
                                    }
                                    loadActualDifferentRateValue(planRow, newActualValue);
                                    changeRows.push(planRow);
                                }
                                // Add Payment child rows
                                for (let paymentRow of paymentAffectRows) {
                                    if (paymentRow?.querySelector('.table-row-indicator')) {
                                        let dataRowRaw = paymentRow.querySelector('.table-row-indicator')?.getAttribute('data-row');
                                        if (dataRowRaw) {
                                            let dataRow = JSON.parse(dataRowRaw);
                                            let dataFormula = dataRow?.['indicator']?.['formula_data_show'].replace(/"/g, "'");
                                            if (dataFormula) {
                                                dataFormula = dataFormula.toLowerCase();
                                                for (let key in payment_row_data) {
                                                    if (dataFormula.includes(key)) {
                                                        let newActualValue = 0;
                                                        for (let payment_data of payment_row_data[key]) {
                                                            if (dataFormula.includes('after tax')) {
                                                                payment_data['actual_value'] = payment_data?.['actual_value_after_tax'] ? payment_data?.['actual_value_after_tax'] : 0;
                                                            }
                                                            payment_data['indicator'] = {'is_acceptance_editable': dataRow?.['indicator']?.['is_acceptance_editable']};
                                                            let newPaymentRow = $table.DataTable().row.add(payment_data).node();
                                                            $(newPaymentRow).detach().insertAfter(paymentRow);
                                                            newPaymentRow.querySelector('.table-row-indicator').setAttribute('data-parent-id', paymentRow.querySelector('.table-row-indicator').getAttribute('data-id'));
                                                            newActualValue += payment_data?.['actual_value'];
                                                        }
                                                        if (newActualValue !== 0) {
                                                            loadActualDifferentRateValue(paymentRow, newActualValue);
                                                            changeRows.push(paymentRow);
                                                        }
                                                        delete payment_row_data[key];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                // Add Other expenses
                                if (otherExpensesRow?.querySelector('.table-row-indicator')) {
                                    let dataRowRaw = otherExpensesRow.querySelector('.table-row-indicator')?.getAttribute('data-row');
                                    if (dataRowRaw) {
                                        let dataRow = JSON.parse(dataRowRaw);
                                        let dataFormula = dataRow?.['indicator']?.['formula_data_show'].replace(/"/g, "'");
                                        if (dataFormula) {
                                            let newActualValue = 0;
                                            for (let key in payment_row_data) {
                                                for (let payment_data of payment_row_data[key]) {
                                                    payment_data['indicator'] = {'is_acceptance_editable': dataRow?.['indicator']?.['is_acceptance_editable']};
                                                    let newPaymentRow = $table.DataTable().row.add(payment_data).node();
                                                    $(newPaymentRow).detach().insertAfter(otherExpensesRow);
                                                    newPaymentRow.querySelector('.table-row-indicator').setAttribute('data-parent-id', otherExpensesRow.querySelector('.table-row-indicator').getAttribute('data-id'));
                                                    newActualValue += payment_data?.['actual_value'];
                                                }
                                                if (newActualValue !== 0) {
                                                    loadActualDifferentRateValue(otherExpensesRow, newActualValue);
                                                    changeRows.push(otherExpensesRow);
                                                }
                                                delete payment_row_data[key];
                                            }
                                        }
                                    }
                                }
                                // Add Delivery child rows
                                for (let deliveryAffectRow of deliveryAffectRows) {
                                    let newActualValue = 0;
                                    let deliveryExistRow = null;
                                    let dataRowRaw = deliveryAffectRow.querySelector('.table-row-indicator').getAttribute('data-row');
                                    if (dataRowRaw) {
                                        let dataRow = JSON.parse(dataRowRaw);
                                        for (let delivery_data of delivery_row_data) {
                                            delivery_data['indicator'] = {'is_acceptance_editable': dataRow?.['indicator']?.['is_acceptance_editable']};
                                            let newDeliRow = $table.DataTable().row.add(delivery_data).node();
                                            if (!deliveryExistRow) {
                                                deliveryExistRow = deliveryAffectRow;
                                            }
                                            $(newDeliRow).detach().insertAfter(deliveryExistRow);
                                            newDeliRow.querySelector('.table-row-indicator').setAttribute('data-parent-id', deliveryAffectRow.querySelector('.table-row-indicator').getAttribute('data-id'));
                                            deliveryExistRow = newDeliRow;
                                            newActualValue += delivery_data?.['actual_value'];
                                        }
                                    }
                                    if (newActualValue !== 0) {
                                        loadActualDifferentRateValue(deliveryAffectRow, newActualValue);
                                        changeRows.push(deliveryAffectRow);
                                    }
                                }
                                // init money
                                $.fn.initMaskMoney2();
                                // Recalculate change rows
                                for (let changeRow of changeRows) {
                                    calculateIndicatorFormula(changeRow);
                                }
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
                let differVal = parseFloat(newActualValue) - parseFloat(elePlanedVal);
                eleDifferent.setAttribute('data-init-money', String(differVal));
                // set rate value
                let rateValue = parseFloat(eleRate.getAttribute('data-value'));
                if (row.querySelector('.table-row-indicator').getAttribute('data-code') !== "IN0001") { // if current row is not REVENUE
                    let revenueEle = $table[0].querySelector('.table-row-indicator[data-code="IN0001"]');
                    if (revenueEle) {
                        let revenueRow = revenueEle.closest('tr');
                        let revenueActualVal = 0;
                        if (revenueRow?.querySelector('.table-row-actual-value').hasAttribute('data-init-money')) {
                            revenueActualVal = revenueRow?.querySelector('.table-row-actual-value')?.getAttribute('data-init-money');
                        } else {
                            revenueActualVal = $(revenueRow?.querySelector('.table-row-actual-value')).valCurrency();
                        }
                        if (parseFloat(revenueActualVal) > 0) {
                            eleRate.innerHTML = '';
                            rateValue = ((parseFloat(newActualValue) / parseFloat(revenueActualVal)) * 100).toFixed(1);
                            eleRate.innerHTML = String(rateValue) + ' %';
                        }
                    }
                } else { // if current row is REVENUE
                    for (let eleIndi of $table[0].querySelectorAll('.table-row-indicator[data-code]:not([data-code=""]):not([data-code="IN0001"])')) {
                        let indiRow = eleIndi.closest('tr');
                        let indiActualEle = indiRow?.querySelector('.table-row-actual-value');
                        let indiRateEle = indiRow?.querySelector('.table-row-rate-value');
                        if (indiActualEle && indiRateEle) {
                            if (indiActualEle.hasAttribute('data-init-money')) {
                                let indiActualVal = indiActualEle.getAttribute('data-init-money');
                                indiRateEle.innerHTML = '';
                                indiRateEle.innerHTML = String(((parseFloat(indiActualVal) / parseFloat(newActualValue)) * 100).toFixed(1)) + ' %';
                            } else {
                                let indiActualVal = $(indiActualEle).valCurrency();
                                indiRateEle.innerHTML = '';
                                indiRateEle.innerHTML = String(((parseFloat(indiActualVal) / parseFloat(newActualValue)) * 100).toFixed(1)) + ' %';
                            }
                        }
                    }
                }
                $.fn.initMaskMoney2();
                // update updateIndicatorData Submit Data
                let IDIndicator = row?.querySelector('.table-row-indicator')?.getAttribute('data-id');
                updateIndicatorData[IDIndicator] = {
                    'actual_value': newActualValue,
                    'different_value': differVal,
                    'rate_value': rateValue
                };
            }
        }

        function evaluateFormula(formulaText) {
            try {
                return eval(formulaText);
                // return evaluated;
            } catch (error) {
                return null;
            }
        }

        function calculateIndicatorFormula(changeRow) {
            // setup {} data indicator
            let dataIndicatorJSON = {};
            for (let eleIndicator of $table[0].querySelectorAll('.table-row-indicator')) {
                if (eleIndicator.innerHTML) {
                    let indicatorTitle = `indicator(${eleIndicator.innerHTML})`;
                    if (eleIndicator.closest('tr').querySelector('.table-row-actual-value').hasAttribute('data-init-money')) {
                        dataIndicatorJSON[indicatorTitle] = eleIndicator.closest('tr').querySelector('.table-row-actual-value').getAttribute('data-init-money');
                    } else {
                        dataIndicatorJSON[indicatorTitle] = $(eleIndicator.closest('tr').querySelector('.table-row-actual-value')).valCurrency();
                    }
                }
            }
            dataIndicatorJSON['%'] = '/100';
            let changeRows = [];
            let indicatorTitle = `indicator(${changeRow.querySelector('.table-row-indicator').innerHTML})`;
            for (let eleIndicator of $table[0].querySelectorAll('.table-row-indicator')) {
                if (eleIndicator.hasAttribute('data-formula')) {
                    let formula = eleIndicator.getAttribute('data-formula')
                    if (formula.includes(indicatorTitle)) {
                        for (let indiKey in dataIndicatorJSON) {
                            if (formula.includes(indiKey)) {
                                formula = formula.replace(indiKey, dataIndicatorJSON[indiKey]);
                            }
                        }
                        let newVal = evaluateFormula(formula);
                        if (newVal !== null) {
                            loadActualDifferentRateValue(eleIndicator.closest('tr'), newVal);
                            changeRows.push(eleIndicator.closest('tr'));
                        }
                    }
                }
            }
            if (changeRows.length > 0) {
                for (let row of changeRows) {
                    calculateIndicatorFormula(row);
                }
            }
            return true;
        }

        function changeActualValue(eleInput) {
            let newActualValue = 0;
            let row = eleInput.closest('tr');
            let eleIndicator = row?.querySelector('.table-row-indicator');
            if (eleIndicator) {
                let parentID = eleIndicator.getAttribute('data-parent-id');
                if (parentID) { // change on sub rows
                    let parentIndicator = $table[0].querySelector(`.table-row-indicator[data-id="${parentID}"]`);
                    if (parentIndicator) {
                        let parentRow = parentIndicator.closest('tr');
                        for (let childIndicatorRow of $table[0].querySelectorAll(`.table-row-indicator[data-parent-id="${parentID}"]`)) {
                            let childRow = childIndicatorRow.closest('tr');
                            let eleActual = childRow.querySelector('.table-row-actual-value');
                            if (eleActual.hasAttribute('data-init-money')) {
                                newActualValue += parseFloat(eleActual.getAttribute('data-init-money'));
                            } else {
                                newActualValue += parseFloat($(eleActual).valCurrency());
                            }
                        }
                        loadActualDifferentRateValue(parentRow, newActualValue);
                        calculateIndicatorFormula(parentRow);
                    }
                    let IDIndicator = eleIndicator?.getAttribute('data-id');
                    updateIndicatorData[IDIndicator] = {'actual_value': parseFloat(eleInput.value)}
                } else { // change on indicator rows
                    newActualValue = eleInput.value;
                    loadActualDifferentRateValue(row, newActualValue);
                    calculateIndicatorFormula(row);
                }
                $.fn.initMaskMoney2();
            }
            return true;
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
        $('#final-acceptance-date-save').val(null).trigger('change');

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
            changeActualValue(this);
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