$(function () {
    $(document).ready(function () {

        let $boxOpp = $('#opportunity_id');
        let $boxEmployee = $('#employee_inherit_id');
        let $boxSO = $('#sale_order_id');
        let $boxLO = $('#lease_order_id');
        let btnRefresh = $('#btn-refresh-data');
        let eleTrans = $('#app-trans-factory');
        let $table = $('#table_final_acceptance_list');
        let updateIndicatorData = {};
        let $form = $('#frm_final_acceptance_update');
        let $btnS = $('#btn-save');
        let $eleDataFact = $('#app-data-factory');

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
                    let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                    let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                    return $(`<span>${res1} ${res2}</span>`);
                }
            }
            $ele.initSelect2(opts);
            return true;
        }

        function loadCustomCss() {
            $('.accordion-item').css({
                'margin-bottom': 0
            });
        }

        function loadDbl(data) {
            $table.not('.dataTable').DataTableDefault({
                data: data ? data : [],
                info: false,
                paging: false,
                autoWidth: true,
                scrollX: true,
                columns: [
                    {
                        targets: 0,
                        width: '12%',
                        render: (data, type, row) => {
                            let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                            if (row?.['acceptance_affect_by'] === 1) {
                                let formula = "";
                                if (row?.['indicator']?.['formula_data_show']) {
                                    formula = row?.['indicator']?.['formula_data_show'].replace(/"/g, "'");
                                }
                                return `<b class="table-row-indicator" data-id="${row?.['id']}" data-code="${row?.['indicator']?.['code'] ? row?.['indicator']?.['code'] : ''}" data-row="${dataRow}" data-formula="${formula}">${row?.['indicator']?.['title'] ? row?.['indicator']?.['title'] : ''}</b>`;
                            } else {
                                return `<b class="table-row-indicator" data-id="${row?.['id']}" data-code="" data-row="${dataRow}"></b>`;
                            }
                        }
                    },
                    {
                        targets: 1,
                        width: '12%',
                        render: (data, type, row) => {
                            let faAffectBy = row?.['acceptance_affect_by'];
                            let app = '';
                            let title = '';
                            let code = '';
                            if (row?.['is_sale_order'] === true) {
                                title = row?.['sale_order']?.['title'] ? row?.['sale_order']?.['title'] : '';
                                code = row?.['sale_order']?.['code'] ? row?.['sale_order']?.['code'] : '';
                            }
                            if (faAffectBy === 4) {
                                app = eleTrans.attr('data-payment');
                                title = row?.['payment']?.['title'] ? row?.['payment']?.['title'] : '';
                                code = row?.['payment']?.['code'] ? row?.['payment']?.['code'] : '';
                            }
                            if (faAffectBy === 3) {
                                app = eleTrans.attr('data-delivery');
                                title = row?.['delivery_sub']?.['title'] ? row?.['delivery_sub']?.['title'] : '';
                                code = row?.['delivery_sub']?.['code'] ? row?.['delivery_sub']?.['code'] : '';
                            }
                            return `<span class="badge badge-light badge-outline">${app}</span>
                                    <span class="badge badge-light">${code}</span>
                                    <span class="table-row-title">${title}</span>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '15%',
                        render: (data, type, row) => {
                            if (row?.['acceptance_affect_by'] === 1) {
                                return `<span class="mask-money table-row-planed-value" data-init-money="${parseFloat(row?.['indicator_value'])}"></span>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 3,
                        width: '15%',
                        render: (data, type, row) => {
                            let dataFA = {};
                            if ($eleDataFact.attr('data-detail')) {
                                dataFA = JSON.parse($eleDataFact.attr('data-detail'));
                            }
                            let disabled = "";
                            if (dataFA?.['system_status'] === 3) {
                                disabled = "disabled"
                            }
                            if (row?.['acceptance_affect_by'] === 1) { // INDICATOR ROWS
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
                                                    ${disabled}
                                                >
                                            </div>`;
                                    } else { // not editable
                                        return `<span class="mask-money table-row-actual-value" data-init-money="${actualVal}"></span>`;
                                    }
                                } else {
                                    return `<span class="mask-money table-row-actual-value" data-init-money="${parseFloat(row?.['actual_value'])}"></span>`;
                                }
                            } else { // NOT INDICATOR ROWS
                                if (row?.['indicator']?.['is_acceptance_editable'] === true) {
                                    return `<div class="row">
                                                <input 
                                                    type="text" 
                                                    class="form-control mask-money table-row-actual-value" 
                                                    value="${row?.['actual_value']}"
                                                    data-return-type="number"
                                                    ${disabled}
                                                >
                                            </div>`;
                                } else {
                                    return `<span class="mask-money table-row-actual-value" data-init-money="${parseFloat(row?.['actual_value'])}"></span>`;
                                }
                            }
                        }
                    },
                    {
                        targets: 4,
                        width: '15%',
                        render: (data, type, row) => {
                            if (row?.['acceptance_affect_by'] === 1) {
                                return `<span class="mask-money table-row-different-value" data-init-money="${parseFloat(row?.['different_value'])}"></span>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 5,
                        width: '6%',
                        render: (data, type, row) => {
                            if (row?.['acceptance_affect_by'] === 1) {
                                let rate = parseInt(row?.['rate_value'].toFixed(1));
                                return `<p class="table-row-rate-value" data-value="${rate}">${rate}%</p>`;
                            } else {
                                return `<p></p>`;
                            }
                        }
                    },
                    {
                        targets: 6,
                        width: '25%',
                        render: (data, type, row) => {
                            let dataFA = {};
                            if ($eleDataFact.attr('data-detail')) {
                                dataFA = JSON.parse($eleDataFact.attr('data-detail'));
                            }
                            let disabled = "";
                            if (dataFA?.['system_status'] === 3) {
                                disabled = "disabled"
                            }
                            return `<input class="form-control table-row-remark" value="${row?.['remark'] ? row?.['remark'] : ''}" ${disabled}>`;
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                    // add css to Dtb
                    loadCssToDtb('table_final_acceptance_list');
                },
            });
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

        function loadFinalAcceptance() {
            let dataParams = {};
            if ($boxSO.val() || $boxLO.val()) {
                if ($boxSO.val()) {
                    dataParams = {'sale_order_id': $boxSO.val()};
                }
                if ($boxLO.val()) {
                    dataParams = {'lease_order_id': $boxLO.val()};
                }

                $.fn.callAjax2({
                        'url': $table.attr('data-url'),
                        'method': $table.attr('data-method'),
                        'data': dataParams,
                        'isDropdown': true,
                        isLoading: true,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('final_acceptance_list') && Array.isArray(data.final_acceptance_list)) {
                                if (data.final_acceptance_list.length > 0) {
                                    let fa = data.final_acceptance_list[0];
                                    $eleDataFact.attr('data-detail', JSON.stringify(fa));
                                    if (fa?.['system_status'] === 3 && fa?.['date_approved']) {
                                        $('#final-acceptance-date-approved').val(moment(fa?.['date_approved']).format('DD/MM/YYYY'));
                                    }
                                    $x.fn.renderCodeBreadcrumb(fa);
                                    WFRTControl.setWFRuntimeID(fa?.['workflow_runtime_id']);
                                    $table.DataTable().clear().draw();
                                    if (fa?.['final_acceptance_indicator']) {
                                        let urlDetail = $form.attr('data-url').format_url_with_uuid(data.final_acceptance_list[0]?.['id']);
                                        $form[0].setAttribute('data-url', urlDetail);
                                        let planRows = [];
                                        let payment_row_data = {};
                                        let delivery_row_data = [];
                                        let deliveryAffectRows = [];
                                        let paymentAffectRows = [];
                                        let otherExpensesRow = null;
                                        let changeRows = [];
                                        for (let fa_indicator of data.final_acceptance_list[0]?.['final_acceptance_indicator']) {
                                            let faAffectBy = fa_indicator?.['acceptance_affect_by'];
                                            if (faAffectBy === 1) {
                                                let newRow = $table.DataTable().row.add(fa_indicator).draw().node();
                                                // acceptance_affect_by plan value
                                                if (fa_indicator?.['indicator']?.['acceptance_affect_by'] === 2) {
                                                    planRows.push(newRow);
                                                }
                                                // acceptance_affect_by delivery
                                                if (fa_indicator?.['indicator']?.['acceptance_affect_by'] === 3) {
                                                    deliveryAffectRows.push(newRow);
                                                }
                                                // acceptance_affect_by payment
                                                if (fa_indicator?.['indicator']?.['acceptance_affect_by'] === 4 && fa_indicator?.['indicator']?.['code'] !== 'IN0005') {
                                                    paymentAffectRows.push(newRow);
                                                }
                                                // other expenses
                                                if (fa_indicator?.['indicator']?.['code'] === 'IN0005') {
                                                    otherExpensesRow = newRow;
                                                }
                                            } else if (faAffectBy === 4) {
                                                // payment on labor item
                                                if (fa_indicator?.['labor_item']?.['title']) {
                                                    if (payment_row_data.hasOwnProperty(fa_indicator?.['labor_item']?.['title'].toLowerCase())) {
                                                        payment_row_data[fa_indicator['labor_item']['title'].toLowerCase()].push(fa_indicator);
                                                    } else {
                                                        payment_row_data[fa_indicator['labor_item']['title'].toLowerCase()] = [fa_indicator];
                                                    }
                                                } else {
                                                    // payment on expense item
                                                    if (fa_indicator?.['expense_item']?.['title']) {
                                                        if (payment_row_data.hasOwnProperty(fa_indicator?.['expense_item']?.['title'].toLowerCase())) {
                                                            payment_row_data[fa_indicator['expense_item']['title'].toLowerCase()].push(fa_indicator);
                                                        } else {
                                                            payment_row_data[fa_indicator['expense_item']['title'].toLowerCase()] = [fa_indicator];
                                                        }
                                                    }
                                                }
                                            } else if (faAffectBy === 3) {
                                                delivery_row_data.push(fa_indicator);
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
                                        if ($table.DataTable().rows().count() > 0) {  // has data
                                            $btnS[0].removeAttribute('hidden');
                                        } else {  // no data
                                            $btnS[0].setAttribute('hidden', 'true');
                                        }
                                    }
                                }
                            }
                        }
                    }
                )
            }
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
                            rateValue = parseInt(((parseFloat(newActualValue) / parseFloat(revenueActualVal)) * 100).toFixed(1));
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
                                indiRateEle.innerHTML = String(parseInt(((parseFloat(indiActualVal) / parseFloat(newActualValue)) * 100).toFixed(1))) + ' %';
                            } else {
                                let indiActualVal = $(indiActualEle).valCurrency();
                                indiRateEle.innerHTML = '';
                                indiRateEle.innerHTML = String(parseInt(((parseFloat(indiActualVal) / parseFloat(newActualValue)) * 100).toFixed(1))) + ' %';
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
                    'rate_value': rateValue,
                };
                let eleRemark = row?.querySelector('.table-row-remark');
                if (eleRemark) {
                    updateIndicatorData[IDIndicator]['remark'] = eleRemark.value;
                }
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

        // function loadOpp() {
        //     boxOpp.empty();
        //     let dataParams = {};
        //     if (boxEmployee.val()) {
        //         dataParams['employee_inherit'] = boxEmployee.val();
        //     }
        //     boxOpp.initSelect2({
        //         'dataParams': dataParams,
        //         'allowClear': true,
        //     });
        // }

        // function loadEmployee(dataEmployee = {}) {
        //     boxEmployee.empty();
        //     boxEmployee.initSelect2({
        //         data: dataEmployee,
        //         'allowClear': true,
        //     });
        // }

        // function loadSO() {
        //     boxSO.empty();
        //     let dataParams = {'system_status': 3};
        //     if (boxOpp.val()) {
        //         dataParams['opportunity_id'] = boxOpp.val();
        //     }
        //     if (boxEmployee.val()) {
        //         dataParams['employee_inherit_id'] = boxEmployee.val();
        //     }
        //     boxSO.initSelect2({
        //         'dataParams': dataParams,
        //         'allowClear': true,
        //     });
        // }

        function loadDataByEmployee() {
            // loadSO();
            // loadOpp();
            return true;
        }

        function loadDataByOpp() {
            if ($boxOpp.val()) {
                let dataSelected = SelectDDControl.get_data_from_idx($boxOpp, $boxOpp.val());
                if (dataSelected) {
                    $boxEmployee[0].setAttribute('readonly', 'true');
                    $boxEmployee.empty();
                    $boxEmployee.initSelect2({
                        data: dataSelected?.['sale_person'],
                        'allowClear': true,
                    });
                    if (dataSelected?.['sale_order']?.['id']) {
                        $SO.val(dataSelected?.['sale_order']?.['title']);
                        $SO.attr('data-detail', JSON.stringify(dataSelected?.['sale_order']));
                    }
                }
            } else {
                $boxEmployee[0].removeAttribute('readonly');
            }
            return true;
        }

        // function loadDataBySO() {
        //     if (boxSO.val()) {
        //         let dataSelected = SelectDDControl.get_data_from_idx(boxSO, boxSO.val());
        //         if (dataSelected) {
        //             boxEmployee.empty();
        //             boxEmployee.initSelect2({
        //                 data: dataSelected?.['sale_person'],
        //                 'allowClear': true,
        //             });
        //             boxEmployee[0].setAttribute('readonly', 'true');
        //             boxOpp.empty();
        //             boxOpp.initSelect2({
        //                 data: dataSelected?.['opportunity'],
        //                 'allowClear': true,
        //             });
        //             boxOpp[0].setAttribute('readonly', 'true');
        //         }
        //     } else {
        //         boxEmployee[0].removeAttribute('readonly');
        //         boxOpp[0].removeAttribute('readonly');
        //     }
        //     return true;
        // }

        function filterFieldList(field_list, data_json) {
            for (let key in data_json) {
                if (!field_list.includes(key)) delete data_json[key]
            }
            return data_json;
        }

        function loadInit() {
            // loadEmployee();
            // loadOpp();
            // loadSO();
            loadCustomCss();
            loadInitS2($boxSO, [], {}, null, true);
            loadInitS2($boxLO, [], {}, null, true);
            loadDbl();
        }

        loadInit();

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
        $('#final-acceptance-date-approved').val(null).trigger('change');

        // mask money
        $.fn.initMaskMoney2();

        // Events
        $boxEmployee.on('change', function () {
            loadDataByEmployee();
        });

        $boxOpp.on('change', function () {
            loadDataByOpp();
            loadFinalAcceptance();
        });

        $boxSO.on('change', function () {
            loadFinalAcceptance();
        });

        $boxLO.on('change', function () {
            loadFinalAcceptance();
        });

        // btnRefresh.on('click', function () {
        //     if (boxSO.val()) {
        //         loadFinalAcceptance();
        //     } else {
        //         $.fn.notifyB({description: eleTrans.attr('data-select-so')}, 'failure');
        //         return false
        //     }
        //     return true;
        // });

        $table.on('change', '.table-row-actual-value', function () {
            changeActualValue(this);
        });

        $table.on('change', '.table-row-remark', function () {
            let row = this.closest('tr');
            let IDIndicator = row?.querySelector('.table-row-indicator')?.getAttribute('data-id');
            if (updateIndicatorData.hasOwnProperty(IDIndicator)) {
                updateIndicatorData[IDIndicator]['remark'] = this.value;
            } else {
                updateIndicatorData[IDIndicator] = {};
                updateIndicatorData[IDIndicator]['remark'] = this.value;
            }
        });

        // SUBMIT FORM
        $form.submit(function (e) {
            e.preventDefault();
            let _form = new SetupFormSubmit($form);
            _form.dataForm['final_acceptance_indicator'] = updateIndicatorData;
            let field_list = [
                'final_acceptance_indicator',
                'system_status',
                'employee_inherit_id',
            ]
            filterFieldList(field_list, _form.dataForm);
            WFRTControl.callWFSubmitForm(_form);
        });

    });
});