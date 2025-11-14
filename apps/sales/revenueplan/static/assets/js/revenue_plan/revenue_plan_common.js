/**
 * Khai báo các element trong page
 */
class RevenuePlanPageElements {
    constructor() {
        this.$trans_script = $('#trans-script')
        this.$revenuePlanPeriodEle = $('#revenue-plan-period')
        this.$modalGroupEle = $('#modal-group')
        this.$revenuePlanTable = $('#revenue-plan-table')
        this.$btn_update_group = $('#btn_update_group')
        this.$nav_group = $('#nav-group')
        this.$nav_content = $('#nav-content')
    }
}
const pageElements = new RevenuePlanPageElements()

/**
 * Khai báo các biến sử dụng trong page
 */
class RevenuePlanPageVariables {
    constructor() {
        this.button_group_change_text = pageElements.$btn_update_group.text()
        this.group_change_title = []
        this.group_change_obj = []
        this.DETAIL_DATA = null
        this.NEW_DATA = []
        this.revenue_plan_config_list = []
        if ($('#revenue_plan_config').text() !== '') {
            let revenue_plan_config = JSON.parse($('#revenue_plan_config').text());
            for (let i = 0; i < revenue_plan_config[0]?.['roles_mapped_list'].length; i++) {
                this.revenue_plan_config_list.push(
                    revenue_plan_config[0]['roles_mapped_list'][i]['id']
                )
            }
            if (this.revenue_plan_config_list.length > 0) {
                $('#notify').attr('hidden', true)
                $('.main').attr('hidden', false)
                $('#btn-save-revenue-plan').attr('hidden', false)
                $('#btn-update-revenue-plan').attr('hidden', false)
            }
            else {
                $('#notify').attr('hidden', false)
                $('.main').attr('hidden', true)
                $('#btn-save-revenue-plan').attr('hidden', true)
                $('#btn-update-revenue-plan').attr('hidden', true)
            }
        }
    }
}
const pageVariables = new RevenuePlanPageVariables()

/**
 * Các hàm load page và hàm hỗ trợ
 */
class RevenuePlanPageFunction {
    // sub
    static getMonthOrder($table, space_month) {
        for (let i = 0; i < 12; i++) {
            let trans_order = i+1+space_month
            if (trans_order > 12) {
                trans_order -= 12
            }
            $table.find(`thead .m${i+1}th`).text(pageElements.$trans_script.attr(`data-trans-m${trans_order}th`))
        }
    }
    static calculatePlan(this_row) {
        let sum_q1 = 0
        this_row.find('.quarter1belong').each(function () {
            if ($(this).attr('value')) {sum_q1 += parseFloat($(this).attr('value'))}
        })
        let sum_q2 = 0
        this_row.find('.quarter2belong').each(function () {
            if ($(this).attr('value')) {sum_q2 += parseFloat($(this).attr('value'))}
        })
        let sum_q3 = 0
        this_row.find('.quarter3belong').each(function () {
            if ($(this).attr('value')) {sum_q3 += parseFloat($(this).attr('value'))}
        })
        let sum_q4 = 0
        this_row.find('.quarter4belong').each(function () {
            if ($(this).attr('value')) {sum_q4 += parseFloat($(this).attr('value'))}
        })

        if (!$('#quarterly').prop('checked')) {
            this_row.find('.q1targetvalue').attr('value', sum_q1)
            this_row.find('.q2targetvalue').attr('value', sum_q2)
            this_row.find('.q3targetvalue').attr('value', sum_q3)
            this_row.find('.q4targetvalue').attr('value', sum_q4)
        }

        let sum_year = sum_q1 + sum_q2 + sum_q3 + sum_q4
        this_row.find('.yeartargetvalue').attr('value', sum_year)

        $.fn.initMaskMoney2()
    }
    static calculatePlanProfit(this_row) {
        let sum_q1 = 0
        this_row.find('.quarter1belong-profit').each(function () {
            if ($(this).attr('value')) {sum_q1 += parseFloat($(this).attr('value'))}
        })
        let sum_q2 = 0
        this_row.find('.quarter2belong-profit').each(function () {
            if ($(this).attr('value')) {sum_q2 += parseFloat($(this).attr('value'))}
        })
        let sum_q3 = 0
        this_row.find('.quarter3belong-profit').each(function () {
            if ($(this).attr('value')) {sum_q3 += parseFloat($(this).attr('value'))}
        })
        let sum_q4 = 0
        this_row.find('.quarter4belong-profit').each(function () {
            if ($(this).attr('value')) {sum_q4 += parseFloat($(this).attr('value'))}
        })

        if (!$('#quarterly').prop('checked')) {
            this_row.find('.q1targetvalue-profit').attr('value', sum_q1)
            this_row.find('.q2targetvalue-profit').attr('value', sum_q2)
            this_row.find('.q3targetvalue-profit').attr('value', sum_q3)
            this_row.find('.q4targetvalue-profit').attr('value', sum_q4)
        }

        let sum_year = sum_q1 + sum_q2 + sum_q3 + sum_q4
        this_row.find('.yeartargetvalue-profit').attr('value', sum_year)

        $.fn.initMaskMoney2()
    }
    // main
    static LoadTableCompany(data={}) {
        let $table = $('#revenue-plan-company-table')
        $table.DataTable().clear().destroy()
        $table.DataTableDefault({
            styleDom: 'hide-foot',
            reloadCurrency: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '55vh',
            scrollCollapse: true,
            paging: false,
            data: [{}],
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m1 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m1-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m2 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m2-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m3 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m3-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-q1 mask-money" data-init-money="0"></span>
                        <span class="sum-company-q1-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m4 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m4-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m5 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m5-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m6 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m6-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-q2 mask-money" data-init-money="0"></span>
                        <span class="sum-company-q2-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m7 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m7-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m8 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m8-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m9 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m9-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-q3 mask-money" data-init-money="0"></span>
                        <span class="sum-company-q3-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m10 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m10-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m11 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m11-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-m12 mask-money" data-init-money="0"></span>
                        <span class="sum-company-m12-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-q4 mask-money" data-init-money="0"></span>
                        <span class="sum-company-q4-profit mask-money" data-init-money="0"></span>`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<span class="mb-1 sum-company-year mask-money" data-init-money="0"></span>
                        <span class="sum-company-year-profit mask-money" data-init-money="0"></span>`
                    }
                },
            ],
            initComplete: function() {
                let wrapper$ = $table.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="small text-muted">${$.fn.gettext('In each row, the first input is Revenue, the next one is Profit')}</span>`)
                    )
                }

                if (Object.keys(data).length > 0) {
                    $table.find('tbody tr').each(function (index, ele) {
                        for (let i = 0; i < 12; i++) {
                            $(ele).find(`.sum-company-m${i + 1}`).attr('data-init-money', data['company_month_target'][i])
                            $(ele).find(`.sum-company-m${i + 1}-profit`).attr('data-init-money', data['company_month_profit_target'][i])
                        }
                        for (let i = 0; i < 4; i++) {
                            $(ele).find(`.sum-company-q${i + 1}`).attr('data-init-money', data['company_quarter_target'][i])
                            $(ele).find(`.sum-company-q${i + 1}-profit`).attr('data-init-money', data['company_quarter_profit_target'][i])
                        }
                        $(ele).find(`.sum-company-year`).attr('data-init-money', data['company_year_target'])
                        $(ele).find(`.sum-company-year-profit`).attr('data-init-money', data['company_year_profit_target'])
                    })
                }
            }
        })
    }
    static LoadTableGroup($table, data_list=[]) {
        console.log(data_list)
        $table.DataTable().clear().destroy()
        $table.DataTableDefault({
            styleDom: 'hide-foot',
            reloadCurrency: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '55vh',
            scrollCollapse: true,
            paging: false,
            data: data_list,
            columns: [
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        return ``
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<script class="script-data-employee" type="application/json">${JSON.stringify(row).replace(/</g, '\\u003c')}</script>
                                <span class="employee-mapped ${row?.['is_changed_group'] ? 'text-orange' : ''}" data-employee-id="${row?.['id']}">${row?.['full_name']}</span><br>
                                ${row?.['is_changed_group'] ? `<button type="button" class="btn bflow-mirrow-btn-sm btn-move-plan" data-current-group-id="${row?.['current_group']?.['id'] || ''}">${$.fn.gettext('Move plan to')} ${row?.['current_group']?.['title']}</button>` : ''}`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][0] || 0}" class="mb-1 mask-money form-control month-target quarter1belong m1targetvalue">
                                <input value="${row?.['emp_month_profit_target'][0] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m1targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][1] || 0}" class="mb-1 mask-money form-control month-target quarter1belong m2targetvalue">
                                <input value="${row?.['emp_month_profit_target'][1] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m2targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][2] || 0}" class="mb-1 mask-money form-control month-target quarter1belong m3targetvalue">
                                <input value="${row?.['emp_month_profit_target'][2] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m3targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input disabled value="${row?.['emp_quarter_target'][0] || 0}" class="mb-1 mask-money form-control quarter-target q1targetvalue">
                                <input disabled value="${row?.['emp_quarter_profit_target'][0] || 0}" class="net-income-form-control mask-money form-control quarter-target-profit q1targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][3] || 0}" class="mb-1 mask-money form-control month-target quarter2belong m4targetvalue">
                                <input value="${row?.['emp_month_profit_target'][3] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m4targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][4] || 0}" class="mb-1 mask-money form-control month-target quarter2belong m5targetvalue">
                                <input value="${row?.['emp_month_profit_target'][4] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m5targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][5] || 0}" class="mb-1 mask-money form-control month-target quarter2belong m6targetvalue">
                                <input value="${row?.['emp_month_profit_target'][5] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m6targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input disabled value="${row?.['emp_quarter_target'][1] || 0}" class="mb-1 mask-money form-control quarter-target q2targetvalue">
                                <input disabled value="${row?.['emp_quarter_profit_target'][1] || 0}" class="net-income-form-control mask-money form-control quarter-target-profit q2targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][6] || 0}" class="mb-1 mask-money form-control month-target quarter3belong m7targetvalue">
                                <input value="${row?.['emp_month_profit_target'][6] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m7targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][7] || 0}" class="mb-1 mask-money form-control month-target quarter3belong m8targetvalue">
                                <input value="${row?.['emp_month_profit_target'][7] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m8targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][8] || 0}" class="mb-1 mask-money form-control month-target quarter3belong m9targetvalue">
                                <input value="${row?.['emp_month_profit_target'][8] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m9targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input disabled value="${row?.['emp_quarter_target'][2] || 0}" class="mb-1 mask-money form-control quarter-target q3targetvalue">
                                <input disabled value="${row?.['emp_quarter_profit_target'][2] || 0}" class="net-income-form-control mask-money form-control quarter-target-profit q3targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][9] || 0}" class="mb-1 mask-money form-control month-target quarter4belong m10targetvalue">
                                <input value="${row?.['emp_month_profit_target'][9] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m10targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][10] || 0}" class="mb-1 mask-money form-control month-target quarter4belong m11targetvalue">
                                <input value="${row?.['emp_month_profit_target'][10] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m11targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input value="${row?.['emp_month_target'][11] || 0}" class="mb-1 mask-money form-control month-target quarter4belong m12targetvalue">
                                <input value="${row?.['emp_month_profit_target'][11] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m12targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input disabled value="${row?.['emp_quarter_target'][3] || 0}" class="mb-1 mask-money form-control quarter-target q4targetvalue">
                                <input disabled value="${row?.['emp_quarter_profit_target'][3] || 0}" class="net-income-form-control mask-money form-control quarter-target-profit q4targetvalue-profit">`
                    }
                },
                {
                    render: (data, type, row) => {
                        return `<input disabled class="mb-1 mask-money form-control yeartargetvalue" value="${row?.emp_year_target || 0}">
                                <input disabled class="mask-money form-control yeartargetvalue-profit" value="${row?.emp_year_profit_target || 0}">`
                    }
                },
            ],
            initComplete: function() {
                let wrapper$ = $table.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="small text-muted">${$.fn.gettext('In each row, the first input is Revenue, the next one is Profit')}</span>`)
                    )
                }
            }
        })
    }

    static LoadPeriod(data) {
        pageElements.$revenuePlanPeriodEle.initSelect2({
            ajax: {
                url: pageElements.$revenuePlanPeriodEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'periods_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
            let selected_option = SelectDDControl.get_data_from_idx(pageElements.$revenuePlanPeriodEle, pageElements.$revenuePlanPeriodEle.val())
            if (selected_option) {
                RevenuePlanPageFunction.getMonthOrder(pageElements.$revenuePlanTable, selected_option['space_month'])
            }
        })
    }
    static LoadModalGroup(data) {
        pageElements.$modalGroupEle.initSelect2({
            ajax: {
                url: pageElements.$modalGroupEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'group_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    static UpdateTablePlan(group_employee_list, group_selected) {
        let parsed_data = []
        let group_employee_valid = group_employee_list.filter(function (item) {
            return item.role.some(function (role) {
                return pageVariables.revenue_plan_config_list.includes(role.id);
            });
        });
        if (group_employee_valid.length > 0) {
            parsed_data.push({
                'type': 'group-sum-row',
                'group_selected': group_selected,
                'group_month_target': [],
                'group_quarter_target': [],
                'group_year_target': 0,
                'group_month_profit_target': [],
                'group_quarter_profit_target': [],
                'group_year_profit_target': 0,
            })
            for (let i = 0; i < group_employee_valid.length; i++) {
                parsed_data.push({
                    'group_selected': group_selected,
                    'group_employee_valid': group_employee_valid[i],
                    'emp_month_target': [],
                    'emp_quarter_target': [],
                    'emp_year_target': 0,
                    'emp_month_profit_target': [],
                    'emp_quarter_profit_target': [],
                    'emp_year_profit_target': 0,
                })
            }

            for (let i=0; i < parsed_data.length; i++) {
                UsualLoadPageFunction.AddTableRow(
                    pageElements.$revenuePlanTable,
                    parsed_data[i]
                )
                let row_added = pageElements.$revenuePlanTable.find('tbody tr:last-child')
                $(row_added).addClass('bg-warning-light-5')
            }
        }
        else {
            $.fn.notifyB({description: "No role accepted in this group."}, 'warning')
        }
    }
    static ParseDataRevenuePlan(data) {
        let parsed_data = []

        let data_get_group_emp = []
        data?.['revenue_plan_group_data'].sort((a, b) => a?.['group_mapped']?.['code'].localeCompare(b?.['group_mapped']?.['code']));
        for (let i = 0; i < data?.['revenue_plan_group_data'].length; i++) {
            let group_selected = data?.['revenue_plan_group_data'][i]?.['group_mapped']
            let group_month_target = data?.['revenue_plan_group_data'][i]?.['group_month_target']
            let group_quarter_target = data?.['revenue_plan_group_data'][i]?.['group_quarter_target']
            let group_year_target = data?.['revenue_plan_group_data'][i]?.['group_year_target']
            let group_month_profit_target = data?.['revenue_plan_group_data'][i]?.['group_month_profit_target']
            let group_quarter_profit_target = data?.['revenue_plan_group_data'][i]?.['group_quarter_profit_target']
            let group_year_profit_target = data?.['revenue_plan_group_data'][i]?.['group_year_profit_target']

            parsed_data.push({
                'type': 'group-sum-row',
                'group_selected': group_selected,
                'group_month_target': group_month_target,
                'group_quarter_target': group_quarter_target,
                'group_year_target': group_year_target,
                'group_month_profit_target': group_month_profit_target,
                'group_quarter_profit_target': group_quarter_profit_target,
                'group_year_profit_target': group_year_profit_target,
            })

            let group_employee_valid = data?.['revenue_plan_group_data'][i]?.['employee_target_data']
            let data_get_emp = []
            group_employee_valid.sort((a, b) => a?.['code'].localeCompare(b?.['code']));
            for (let j = 0; j < group_employee_valid.length; j++) {
                data_get_emp.push(group_employee_valid[j]?.['id'])
                let emp_month_target = group_employee_valid[j]?.['emp_month_target']
                let emp_quarter_target = group_employee_valid[j]?.['emp_quarter_target']
                let emp_year_target = group_employee_valid[j]?.['emp_year_target']
                let emp_month_profit_target = group_employee_valid[j]?.['emp_month_profit_target']
                let emp_quarter_profit_target = group_employee_valid[j]?.['emp_quarter_profit_target']
                let emp_year_profit_target = group_employee_valid[j]?.['emp_year_profit_target']

                parsed_data.push({
                    'group_selected': group_selected,
                    'group_employee_valid': group_employee_valid[j],
                    'emp_month_target': emp_month_target,
                    'emp_quarter_target': emp_quarter_target,
                    'emp_year_target': emp_year_target,
                    'emp_month_profit_target': emp_month_profit_target,
                    'emp_quarter_profit_target': emp_quarter_profit_target,
                    'emp_year_profit_target': emp_year_profit_target,
                })
            }
            data_get_group_emp.push({
                'id': group_selected?.['id'],
                'employee_planed_list': data_get_emp.sort()
            })
        }

        return [parsed_data, data_get_group_emp]
    }
    static RenderRPTable(
        data_list=[],
        company_month_target=[],
        company_quarter_target=[],
        company_year_target=0,
        company_month_profit_target=[],
        company_quarter_profit_target=[],
        company_year_profit_target=0,
        option='create'
    ) {
        pageElements.$revenuePlanTable.DataTable().clear().destroy()
        pageElements.$revenuePlanTable.DataTableDefault({
            styleDom: 'hide-foot',
            reloadCurrency: true,
            rowIdx: false,
            scrollX: true,
            scrollY: '55vh',
            scrollCollapse: true,
            paging: false,
            fixedColumns: {
                leftColumns: 1
            },
            data: data_list,
            columns: [
                {
                    className: 'w-5 bg-primary-light-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<span data-group-id="${row.group_selected.id}" class="minimize-group w-100">
                                        <a href="#" class="text-primary fw-bold fs-5">${row.group_selected.title} <i class="bi bi-caret-up-fill"></i></a>
                                    </span>`
                        }
                        return `<span class="employee-mapped text-primary ${row.group_selected.id}" data-employee-id="${row.group_employee_valid?.['id']}">${row.group_employee_valid?.['full_name']}</span>`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m1 mask-money form-control" value="${row.group_month_target[0] || 0}">
                                    <input readonly disabled class="sum-group-m1-profit mask-money form-control" value="${row.group_month_profit_target[0] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[0] || 0}" class="mb-1 mask-money form-control month-target quarter1belong m1targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[0] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m1targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m2 mask-money form-control" value="${row.group_month_target[1] || 0}">
                                    <input readonly disabled class="sum-group-m2-profit mask-money form-control" value="${row.group_month_profit_target[1] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[1] || 0}" class="mb-1 mask-money form-control month-target quarter1belong m2targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[1] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m2targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m3 mask-money form-control" value="${row.group_month_target[2] || 0}">
                                    <input readonly disabled class="sum-group-m3-profit mask-money form-control" value="${row.group_month_profit_target[2] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[2] || 0}" class="mb-1 mask-money form-control month-target quarter1belong m3targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[2] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m3targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-q1 mask-money form-control" value="${row.group_quarter_target[0] || 0}">
                                    <input readonly disabled class="sum-group-q1-profit mask-money form-control" value="${row.group_quarter_profit_target[0] || 0}">`
                        }
                        return `<input readonly disabled value="${row.emp_quarter_target[0] || 0}" class="mb-1 mask-money form-control quarter-target q1targetvalue">
                                <input readonly disabled value="${row.emp_quarter_profit_target[0] || 0}" class="net-income-form-control mask-money form-control quarter-target-profit q1targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m4 mask-money form-control" value="${row.group_month_target[3] || 0}">
                                    <input readonly disabled class="sum-group-m4-profit mask-money form-control" value="${row.group_month_profit_target[3] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[3] || 0}" class="mb-1 mask-money form-control month-target quarter2belong m4targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[3] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m4targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m5 mask-money form-control" value="${row.group_month_target[4] || 0}">
                                    <input readonly disabled class="sum-group-m5-profit mask-money form-control" value="${row.group_month_profit_target[4] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[4] || 0}" class="mb-1 mask-money form-control month-target quarter2belong m5targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[4] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m5targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m6 mask-money form-control" value="${row.group_month_target[5] || 0}">
                                    <input readonly disabled class="sum-group-m6-profit mask-money form-control" value="${row.group_month_profit_target[5] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[5] || 0}" class="mb-1 mask-money form-control month-target quarter2belong m6targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[5] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m6targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-q2 mask-money form-control" value="${row.group_quarter_target[1] || 0}">
                                    <input readonly disabled class="sum-group-q2-profit mask-money form-control" value="${row.group_quarter_profit_target[1] || 0}">`
                        }
                        return `<input readonly disabled value="${row.emp_quarter_target[1] || 0}" class="mb-1 mask-money form-control quarter-target q2targetvalue">
                                <input readonly disabled value="${row.emp_quarter_profit_target[1] || 0}" class="net-income-form-control mask-money form-control quarter-target-profit q2targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m7 mask-money form-control" value="${row.group_month_target[6] || 0}">
                                    <input readonly disabled class="sum-group-m7-profit mask-money form-control" value="${row.group_month_profit_target[6] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[6] || 0}" class="mb-1 mask-money form-control month-target quarter3belong m7targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[6] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m7targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m8 mask-money form-control" value="${row.group_month_target[7] || 0}">
                                    <input readonly disabled class="sum-group-m8-profit mask-money form-control" value="${row.group_month_profit_target[7] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[7] || 0}" class="mb-1 mask-money form-control month-target quarter3belong m8targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[7] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m8targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m9 mask-money form-control" value="${row.group_month_target[8] || 0}">
                                    <input readonly disabled class="sum-group-m9-profit mask-money form-control" value="${row.group_month_profit_target[8] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[8] || 0}" class="mb-1 mask-money form-control month-target quarter3belong m9targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[8] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m9targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-q3 mask-money form-control" value="${row.group_quarter_target[2] || 0}">
                                    <input readonly disabled class="sum-group-q3-profit mask-money form-control" value="${row.group_quarter_profit_target[2] || 0}">`
                        }
                        return `<input readonly disabled value="${row.emp_quarter_target[2] || 0}" class="mb-1 mask-money form-control quarter-target q3targetvalue">
                                <input readonly disabled value="${row.emp_quarter_profit_target[2] || 0}" class="net-income-form-control mask-money form-control quarter-target-profit q3targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m10 mask-money form-control" value="${row.group_month_target[9] || 0}">
                                    <input readonly disabled class="sum-group-m10-profit mask-money form-control" value="${row.group_month_profit_target[9] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[9] || 0}" class="mb-1 mask-money form-control month-target quarter4belong m10targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[9] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m10targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m11 mask-money form-control" value="${row.group_month_target[10] || 0}">
                                    <input readonly disabled class="sum-group-m11-profit mask-money form-control" value="${row.group_month_profit_target[10] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[10] || 0}" class="mb-1 mask-money form-control month-target quarter4belong m11targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[10] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m11targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-m12 mask-money form-control" value="${row.group_month_target[11] || 0}">
                                    <input readonly disabled class="sum-group-m12-profit mask-money form-control" value="${row.group_month_profit_target[11] || 0}">`
                        }
                        return `<input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_target[11] || 0}" class="mb-1 mask-money form-control month-target quarter4belong m12targetvalue">
                                <input ${option==='detail' ? 'disabled readonly' : ''} value="${row.emp_month_profit_target[11] || 0}" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m12targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-q4 mask-money form-control" value="${row.group_quarter_target[3] || 0}">
                                    <input readonly disabled class="sum-group-q4-profit mask-money form-control" value="${row.group_quarter_profit_target[3] || 0}">`
                        }
                        return `<input readonly disabled value="${row.emp_quarter_target[3] || 0}" class="mb-1 mask-money form-control quarter-target q4targetvalue">
                                <input readonly disabled value="${row.emp_quarter_profit_target[3] || 0}" class="net-income-form-control mask-money form-control quarter-target-profit q4targetvalue-profit">`
                    }
                },
                {
                    className: 'w-5',
                    render: (data, type, row) => {
                        if (row?.['type'] === 'group-sum-row') {
                            return `<input readonly disabled class="mb-1 sum-group-year mask-money form-control" value="${row.group_year_target || 0}">
                                    <input readonly disabled class="sum-group-year-profit mask-money form-control" value="${row.group_year_profit_target || 0}">`
                        }
                        return `<input readonly disabled class="mb-1 mask-money form-control yeartargetvalue" value="${row.emp_year_target || 0}">
                                <input readonly disabled class="mask-money form-control yeartargetvalue-profit" value="${row.emp_year_profit_target || 0}">`
                    }
                },
            ],
            initComplete: function () {
                let wrapper$ = pageElements.$revenuePlanTable.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(
                        $(`<div class="d-inline-block mr-3"></div>`).append(`<span class="small text-muted">${$.fn.gettext('In each row, the first input is Revenue, the next one is Profit')}</span>`)
                    )
                }

                for (let i = 1; i <= 12; i++) {
                    pageElements.$revenuePlanTable.find(`.sum-group-m${i}:eq(0)`).closest('td').addClass(`sum-m${i}`)
                }
                for (let i = 1; i <= 4; i++) {
                    pageElements.$revenuePlanTable.find(`.sum-group-q${i}:eq(0)`).closest('td').addClass(`sum-q${i}`)
                }

                company_month_target.forEach((value, i) => {
                    $(`.sum-m${i+1} .sum-company-m${i+1}`).attr('value', value)
                })
                company_quarter_target.forEach((value, i) => {
                    $(`.sum-q${i+1} .sum-company-q${i+1}`).attr('value', value)
                })
                $(`.sum-company-year`).attr('value', company_year_target)

                company_month_profit_target.forEach((value, i) => {
                    $(`.sum-m${i+1} .sum-company-m${i+1}-profit`).attr('value', value)
                })
                company_quarter_profit_target.forEach((value, i) => {
                    $(`.sum-q${i+1} .sum-company-q${i+1}-profit`).attr('value', value)
                })
                $(`.sum-company-year-profit`).attr('value', company_year_profit_target)
            }
        })
    }

    static GetDataGroup(data_group_detail=[], group_list_data={}) {
        let group_employee_valid = (data_group_detail?.['group']?.['group_employee'] || []).filter(function (item) {
            return (item?.['role'] || []).some(function (role) {
                return pageVariables.revenue_plan_config_list.includes(role?.['id']);
            });
        });
        let employee_target_data = []
        for (let j = 0; j < group_employee_valid.length; j++) {
            let temp = group_employee_valid[j]
            employee_target_data.push({
                'emp_month_target': Array(12).fill(0),
                'emp_quarter_target': Array(4).fill(0),
                'emp_year_target': 0,
                'emp_month_profit_target': Array(12).fill(0),
                'emp_quarter_profit_target': Array(4).fill(0),
                'emp_year_profit_target': 0,
                'id': temp?.['id'],
                'code': temp?.['code'],
                'full_name': temp?.['full_name'],
                'current_group': {
                    'id': group_list_data?.['id'],
                    'code': group_list_data?.['code'],
                    'title': group_list_data?.['title'],
                },
                'is_changed_group': false,
            })
        }
        return employee_target_data
    }
}

/**
 * Khai báo các hàm chính
 */
class RevenuePlanHandler {
    static CombinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#title').val();
        frm.dataForm['period_mapped'] = $('#revenue-plan-period').val()
        frm.dataForm['group_mapped_list'] = []
        pageElements.$revenuePlanTable.find('tbody tr .minimize-group').each(function (index, ele) {
            frm.dataForm['group_mapped_list'].push($(ele).attr('data-group-id'))
        })
        frm.dataForm['monthly'] = $('#monthly').prop('checked')
        frm.dataForm['quarterly'] = $('#quarterly').prop('checked')
        frm.dataForm['auto_sum_target'] = $('#equal').prop('checked')
        frm.dataForm['profit_target_type'] = $('#net-income').prop('checked') ? 1 : 0
        frm.dataForm['company_month_target'] = []
        frm.dataForm['company_month_profit_target'] = []
        for (let i = 0; i < 12; i++) {
            frm.dataForm['company_month_target'].push(
                parseFloat($(`.sum-company-m${i+1}`).attr('value'))
            )
            frm.dataForm['company_month_profit_target'].push(
                parseFloat($(`.sum-company-m${i+1}-profit`).attr('value'))
            )
        }
        frm.dataForm['company_quarter_target'] = []
        frm.dataForm['company_quarter_profit_target'] = []
        for (let i = 0; i < 4; i++) {
            frm.dataForm['company_quarter_target'].push(
                parseFloat($(`.sum-company-q${i+1}`).attr('value'))
            )
            frm.dataForm['company_quarter_profit_target'].push(
                parseFloat($(`.sum-company-q${i+1}-profit`).attr('value'))
            )
        }
        frm.dataForm['company_year_target'] = parseFloat($('.sum-company-year').attr('value'))
        frm.dataForm['company_year_profit_target'] = parseFloat($('.sum-company-year-profit').attr('value'))

        frm.dataForm['RevenuePlanGroup_data'] = []
        for (let i = 0; i < frm.dataForm['group_mapped_list'].length; i++) {
            let group_tr = pageElements.$revenuePlanTable.find(`tbody span[data-group-id="${frm.dataForm['group_mapped_list'][i]}"]`).closest('tr')

            let group_month_target = []
            let group_month_profit_target = []
            for (let j = 0; j < 12; j++) {
                group_month_target.push(parseFloat(group_tr.find(`.sum-group-m${j+1}`).attr('value')))
                group_month_profit_target.push(parseFloat(group_tr.find(`.sum-group-m${j+1}-profit`).attr('value')))
            }

            let group_quarter_target = []
            let group_quarter_profit_target = []
            for (let j = 0; j < 4; j++) {
                group_quarter_target.push(parseFloat(group_tr.find(`.sum-group-q${j+1}`).attr('value')))
                group_quarter_profit_target.push(parseFloat(group_tr.find(`.sum-group-q${j+1}-profit`).attr('value')))
            }

            let group_year_target = parseFloat(group_tr.find(`.sum-group-year`).attr('value'))
            let group_year_profit_target = parseFloat(group_tr.find(`.sum-group-year-profit`).attr('value'))

            let employee_mapped_list = []
            pageElements.$revenuePlanTable.find(`tbody tr .${frm.dataForm['group_mapped_list'][i]}`).each(function (index, ele) {
                employee_mapped_list.push($(ele).attr('data-employee-id'))
            })

            frm.dataForm['RevenuePlanGroup_data'].push({
                'group_mapped_id': frm.dataForm['group_mapped_list'][i],
                'group_month_target': group_month_target,
                'group_quarter_target': group_quarter_target,
                'group_year_target': group_year_target,
                'group_month_profit_target': group_month_profit_target,
                'group_quarter_profit_target': group_quarter_profit_target,
                'group_year_profit_target': group_year_profit_target,
                'employee_mapped_list': employee_mapped_list
            })
        }

        frm.dataForm['RevenuePlanGroupEmployee_data'] = []
        for (let i = 0; i < frm.dataForm['group_mapped_list'].length; i++) {
            pageElements.$revenuePlanTable.find(`tbody tr .${frm.dataForm['group_mapped_list'][i]}`).each(function (index, ele){
                let emp_row = $(ele).closest('tr')

                let emp_month_target = []
                let emp_month_profit_target = []
                for (let j = 0; j < 12; j++) {
                    emp_month_target.push(parseFloat(emp_row.find(`.m${j+1}targetvalue`).attr('value')))
                    emp_month_profit_target.push(parseFloat(emp_row.find(`.m${j+1}targetvalue-profit`).attr('value')))
                }

                let emp_quarter_target = []
                let emp_quarter_profit_target = []
                for (let j = 0; j < 4; j++) {
                    emp_quarter_target.push(parseFloat(emp_row.find(`.q${j+1}targetvalue`).attr('value')))
                    emp_quarter_profit_target.push(parseFloat(emp_row.find(`.q${j+1}targetvalue-profit`).attr('value')))
                }

                let emp_year_target = parseFloat(emp_row.find(`.yeartargetvalue`).attr('value'))
                let emp_year_profit_target = parseFloat(emp_row.find(`.yeartargetvalue-profit`).attr('value'))

                frm.dataForm['RevenuePlanGroupEmployee_data'].push({
                    'revenue_plan_group_mapped_id': frm.dataForm['group_mapped_list'][i],
                    'employee_mapped_id': $(ele).attr('data-employee-id'),
                    'emp_month_target': emp_month_target,
                    'emp_quarter_target': emp_quarter_target,
                    'emp_year_target': emp_year_target,
                    'emp_month_profit_target': emp_month_profit_target,
                    'emp_quarter_profit_target': emp_quarter_profit_target,
                    'emp_year_profit_target': emp_year_profit_target
                })
            })
        }

        // console.log(frm.dataForm)

        if (for_update) {
            let pk = $.fn.getPkDetail();
            return {
                url: frmEle.attr('data-url-detail-api').format_url_with_uuid(pk),
                method: frm.dataMethod,
                data: frm.dataForm,
                urlRedirect: frm.dataUrlRedirect,
            };
        }
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
    static LoadDetailRevenuePlan(option) {
        WindowControl.showLoading()

        let url_group = $.fn.callAjax2({
            url: pageElements.$modalGroupEle.attr('data-url'),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('group_list')) {
                    return data?.['group_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        let pk = $.fn.getPkDetail()
        let url_loaded = $.fn.callAjax2({
            url: $('#form-detail-revenue-plan').attr('data-url-detail-api').replace(0, pk),
            data: {},
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('revenue_plan_detail')) {
                    return data?.['revenue_plan_detail'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([url_group, url_loaded]).then(
            (results) => {
                let group_list = results[0];
                let data = results[1];

                $('#title').val(data?.['title'])
                RevenuePlanPageFunction.LoadPeriod(data?.['period_mapped'])
                $('#monthly').prop('checked', data?.['monthly'])
                $('#quarterly').prop('checked', data?.['quarterly'])
                $('#equal').prop('checked', data?.['auto_sum_target'])
                $('#net-income').prop('checked', data?.['profit_target_type'])

                $x.fn.renderCodeBreadcrumb(data);

                RevenuePlanPageFunction.getMonthOrder($('#revenue-plan-company-table'), data?.['period_mapped']?.['space_month'])
                RevenuePlanPageFunction.LoadTableCompany(data)

                for (let i=0; i < group_list.length; i++) {
                    let is_set_up = data?.['group_mapped_list'].includes(group_list[i]?.['id']);
                    pageElements.$nav_group.append(`
                        <li class="nav-item nav-group-item" data-group-id="${group_list[i]?.['id']}">
                            <a class="nav-link" data-bs-toggle="pill" href="#tab_group_${group_list[i]?.['id']}">
                                <span class="nav-link-text">${group_list[i]?.['title']} ${is_set_up ? `<i class="fa-solid fa-check"></i>` : ''}</span>
                            </a>
                        </li>
                    `)

                    let group_data = {}
                    if (data?.['group_mapped_list'].includes(group_list[i]?.['id'])) {
                        group_data = data?.['revenue_plan_group_data'].find(item => item?.['group_mapped']?.['id'] === group_list[i]?.['id']) || {}
                    }
                    pageElements.$nav_content.append(`
                        <div class="tab-pane fade" id="tab_group_${group_list[i]?.['id']}">
                            <table class="table nowrap w-100" id="revenue-plan-group-${group_list[i]?.['id']}-table">
                                <thead class="bg-light">
                                <tr>
                                    <th style="min-width: 50px;"></th>
                                    <th style="min-width: 200px;"></th>
                                    <th style="min-width: 200px;" class="m1th"></th>
                                    <th style="min-width: 200px;" class="m2th"></th>
                                    <th style="min-width: 200px;" class="m3th"></th>
                                    <th style="min-width: 200px;">${$.fn.gettext('QUARTER')} 1</th>
                                    <th style="min-width: 200px;" class="m4th"></th>
                                    <th style="min-width: 200px;" class="m5th"></th>
                                    <th style="min-width: 200px;" class="m6th"></th>
                                    <th style="min-width: 200px;">${$.fn.gettext('QUARTER')} 2</th>
                                    <th style="min-width: 200px;" class="m7th"></th>
                                    <th style="min-width: 200px;" class="m8th"></th>
                                    <th style="min-width: 200px;" class="m9th"></th>
                                    <th style="min-width: 200px;">${$.fn.gettext('QUARTER')} 3</th>
                                    <th style="min-width: 200px;" class="m10th"></th>
                                    <th style="min-width: 200px;" class="m11th"></th>
                                    <th style="min-width: 200px;" class="m12th"></th>
                                    <th style="min-width: 200px;">${$.fn.gettext('QUARTER')} 4</th>
                                    <th style="min-width: 200px;">${$.fn.gettext('YEAR')}</th>
                                </tr>
                                </thead>
                                <tbody></tbody>
                                <tfoot>
                                <tr>
                                    <th style="min-width: 50px;"></th>
                                    <th style="min-width: 200px;">${$.fn.gettext('TOTAL')}</th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m1 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][0] : 0}">
                                        <input disabled class="sum-group-m1-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][0] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m2 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][1] : 0}">
                                        <input disabled class="sum-group-m2-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][1] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m3 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][2] : 0}">
                                        <input disabled class="sum-group-m3-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][2] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-q1 mask-money form-control" value="${group_data?.['group_quarter_target'] ? group_data?.['group_quarter_target'][0] : 0}">
                                        <input disabled class="sum-group-q1-profit mask-money form-control" value="${group_data?.['group_quarter_profit_target'] ? group_data?.['group_quarter_profit_target'][0] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m4 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][3] : 0}">
                                        <input disabled class="sum-group-m4-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][3] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m5 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][4] : 0}">
                                        <input disabled class="sum-group-m5-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][4] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m6 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][5] : 0}">
                                        <input disabled class="sum-group-m6-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][5] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-q2 mask-money form-control" value="${group_data?.['group_quarter_target'] ? group_data?.['group_quarter_target'][1] : 0}">
                                        <input disabled class="sum-group-q2-profit mask-money form-control" value="${group_data?.['group_quarter_profit_target'] ? group_data?.['group_quarter_profit_target'][1] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m7 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][6] : 0}">
                                        <input disabled class="sum-group-m7-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][6] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m8 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][7] : 0}">
                                        <input disabled class="sum-group-m8-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][7] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m9 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][8] : 0}">
                                        <input disabled class="sum-group-m9-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][8] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-q3 mask-money form-control" value="${group_data?.['group_quarter_target'] ? group_data?.['group_quarter_target'][2] : 0}">
                                        <input disabled class="sum-group-q3-profit mask-money form-control" value="${group_data?.['group_quarter_profit_target'] ? group_data?.['group_quarter_profit_target'][2] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m10 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][9] : 0}">
                                        <input disabled class="sum-group-m10-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][9] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m11 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][10] : 0}">
                                        <input disabled class="sum-group-m11-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][10] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-m12 mask-money form-control" value="${group_data?.['group_month_target'] ? group_data?.['group_month_target'][11] : 0}">
                                        <input disabled class="sum-group-m12-profit mask-money form-control" value="${group_data?.['group_month_profit_target'] ? group_data?.['group_month_profit_target'][11] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-q4 mask-money form-control" value="${group_data?.['group_quarter_target'] ? group_data?.['group_quarter_target'][3] : 0}">
                                        <input disabled class="sum-group-q4-profit mask-money form-control" value="${group_data?.['group_quarter_profit_target'] ? group_data?.['group_quarter_profit_target'][3] : 0}">
                                    </th>
                                    <th style="min-width: 200px;">
                                        <input disabled class="mb-1 sum-group-year mask-money form-control" value="${group_data?.['group_year_target'] ? group_data?.['group_year_target'] : 0}">
                                        <input disabled class="sum-group-year-profit mask-money form-control" value="${group_data?.['group_year_profit_target'] ? group_data?.['group_year_profit_target'] : 0}">
                                    </th>
                                </tr>
                            </tfoot>
                            </table>
                        </div>
                    `)
                    let group_table = $(`#revenue-plan-group-${group_list[i]?.['id']}-table`)


                    let url_loaded = pageElements.$modalGroupEle.attr('data-url-detail').replace(0, group_list[i]?.['id']);
                    $.fn.callAjax(url_loaded, 'GET').then(
                        (resp) => {
                            let data_group_detail = $.fn.switcherResp(resp);
                            if (data_group_detail) {
                                if (pageVariables.revenue_plan_config_list.length > 0) {
                                    RevenuePlanPageFunction.getMonthOrder(group_table, data?.['period_mapped']?.['space_month'])
                                    if (is_set_up) {
                                        RevenuePlanPageFunction.LoadTableGroup(group_table, group_data?.['employee_target_data'] || [], group_data)
                                    }
                                    else {
                                        let employee_target_data = RevenuePlanPageFunction.GetDataGroup(data_group_detail, group_list[i])
                                        RevenuePlanPageFunction.LoadTableGroup(group_table, employee_target_data)
                                    }
                                }
                            }
                        })
                }

                // pageVariables.DETAIL_DATA = data
                // RevenuePlanPageFunction.getMonthOrder(pageElements.$revenuePlanTable, data?.['period_mapped']?.['space_month'])
                //
                // let [parsed_data, data_get_group_emp] = RevenuePlanPageFunction.ParseDataRevenuePlan(data)
                // RevenuePlanPageFunction.RenderRPTable(
                //     parsed_data,
                //     data?.['company_month_target'] || [],
                //     data?.['company_quarter_target'] || [],
                //     data?.['company_year_target'] || 0,
                //     data?.['company_month_profit_target'] || [],
                //     data?.['company_quarter_profit_target'] || [],
                //     data?.['company_year_profit_target'] || 0,
                //     option
                // )
                //
                // // check group changed
                // for (let i = 0; i < data?.['group_mapped_list'].length; i++) {
                //     let pk = data?.['group_mapped_list'][i]
                //     let url_loaded = pageElements.$trans_script.attr('data-url-group-detail').replace(0, pk);
                //     $.fn.callAjax(url_loaded, 'GET').then(
                //         (resp) => {
                //             let data = $.fn.switcherResp(resp);
                //             if (data) {
                //                 data = data['group'];
                //                 let employee_planed_list_item = data_get_group_emp.filter(function (item) {
                //                     return item?.['id'] === data?.['id']
                //                 })[0]
                //                 let valid_emp = []
                //                 let valid_emp_existed = []
                //                 for (const emp of data?.['group_employee']) {
                //                     for (const role of emp?.['role']) {
                //                         if (pageVariables.revenue_plan_config_list.includes(role?.['id']) && !valid_emp_existed.includes(emp?.['id'])) {
                //                             valid_emp.push(emp)
                //                             valid_emp_existed.push(emp?.['id'])
                //                         }
                //                     }
                //                 }
                //                 pageVariables.NEW_DATA.push({
                //                     'id': data?.['id'],
                //                     'code': data?.['code'],
                //                     'title': data?.['title'],
                //                     'employee_valid_list': valid_emp
                //                 })
                //                 if (employee_planed_list_item?.['employee_planed_list'].length !== valid_emp.length) {
                //                     pageVariables.group_change_title.push(data?.['title'])
                //                     pageVariables.group_change_obj.push({
                //                         'id': data?.['id'],
                //                         'code': data?.['code'],
                //                         'title': data?.['title'],
                //                     })
                //                     pageElements.$btn_update_group.text(pageVariables.group_change_title.join(', ') + pageVariables.button_group_change_text)
                //                     $('#notify-change-group').prop('hidden', false)
                //                 }
                //                 else {
                //                     for (const emp of valid_emp) {
                //                         if (!employee_planed_list_item?.['employee_planed_list'].includes(emp?.['id'])) {
                //                             pageVariables.group_change_title.push(data?.['title'])
                //                             pageVariables.group_change_obj.push({
                //                                 'id': data?.['id'],
                //                                 'code': data?.['code'],
                //                                 'title': data?.['title'],
                //                             })
                //                             pageElements.$btn_update_group.text(pageVariables.group_change_title.join(', ') + pageVariables.button_group_change_text)
                //                             $('#notify-change-group').prop('hidden', false)
                //                             break
                //                         }
                //                     }
                //                 }
                //             }
                //         })
                // }

                UsualLoadPageFunction.DisablePage(option==='detail')
            }).then(() => {
                WindowControl.hideLoading()
            })
    }
}

/**
 * Khai báo các Event
 */
class RevenuePlanEventHandler {
    static InitPageEven() {
        pageElements.$btn_update_group.on('click', function () {
            for (const group of pageVariables.NEW_DATA) {
                let current_emp = []
                pageElements.$revenuePlanTable.find(`tbody tr .${group['id']}`).each(function (index, ele) {
                    current_emp.push($(ele).attr('data-employee-id'))
                })

                for (const emp of group['employee_valid_list']) {
                    if (!current_emp.includes(emp?.['id'])) {
                        let groupEle = pageElements.$revenuePlanTable.find(`tbody tr span[data-group-id="${group['id']}"]`).closest('tr')
                        let index = pageElements.$revenuePlanTable.DataTable().row(groupEle).index() + 1
                        UsualLoadPageFunction.AddTableRowAtIndex(
                            pageElements.$revenuePlanTable,
                            {
                                'group_selected': group,
                                'group_employee_valid': emp,
                                'emp_month_target': [],
                                'emp_quarter_target': [],
                                'emp_year_target': 0,
                                'emp_month_profit_target': [],
                                'emp_quarter_profit_target': [],
                                'emp_year_profit_target': 0,
                            },
                            index
                        )
                        const row_added = pageElements.$revenuePlanTable.DataTable().row(index).node()
                        $(row_added).addClass('bg-warning-light-5')
                    }
                }
            }
            $.fn.initMaskMoney2()
        })
        $(document).on("click", '.minimize-group', function () {
            let group_id = $(this).attr('data-group-id')
            let hidden_state = $(`.${group_id}:eq(0)`).closest('tr').prop('hidden')
            pageElements.$revenuePlanTable.find(`.${group_id}`).closest('tr').prop('hidden', !hidden_state)
            $(this).find('i').attr('class', hidden_state ? "bi bi-caret-up-fill" : "bi bi-caret-down-fill")
        })
        $(document).on("change", '.month-target', function () {
            RevenuePlanPageFunction.calculatePlan($(this).closest('tr'))

            let sum_group_order = Array(17).fill(0);
            $(this).closest('tbody').find('tr').each(function (index, ele) {
                for (let i=0; i < 17; i++) {
                    sum_group_order[i] += parseFloat($(ele).find(`td:eq(${i+2}) input:eq(0)`).attr('value') || 0)
                }
            })
            let $wrapper = $(this).closest('.dataTables_wrapper')
            let $tfoot = $wrapper.find('.dataTables_scrollFoot tfoot tr')
            for (let i=0; i < 17; i++) {
                $tfoot.find(`th:eq(${i+2}) input:eq(0)`).attr('value', sum_group_order[i])
            }
            $.fn.initMaskMoney2()
        })
        $(document).on("change", '.month-target-profit', function () {
            RevenuePlanPageFunction.calculatePlanProfit($(this).closest('tr'))

            let sum_group_profit_order = Array(17).fill(0);
            $(this).closest('tbody').find('tr').each(function (index, ele) {
                for (let i=0; i < 17; i++) {
                    sum_group_profit_order[i] += parseFloat($(ele).find(`td:eq(${i+2}) input:eq(1)`).attr('value') || 0)
                }
            })
            let $wrapper = $(this).closest('.dataTables_wrapper');
            let $tfoot = $wrapper.find('.dataTables_scrollFoot tfoot tr');
            for (let i=0; i < 17; i++) {
                $tfoot.find(`th:eq(${i+2}) input:eq(1)`).attr('value', sum_group_profit_order[i])
            }
            $.fn.initMaskMoney2()
        })
        $(document).on("click", '.btn-move-plan', function () {
            let this_row = $(this).closest('tr')
            let this_row_data = JSON.parse(this_row.find('.script-data-employee').text() || '{}')
            this_row_data['is_changed_group'] = false

            let $this_table = $(this).closest('table')
            let move_to_group_id = $(this).attr('data-current-group-id')
            let $move_to_table = $(`#revenue-plan-group-${move_to_group_id}-table`)
            UsualLoadPageFunction.DeleteTableRow(
                $move_to_table,
                parseInt($move_to_table.find(`.employee-mapped[data-employee-id=${this_row_data?.['id']}]`).closest('tr').find('td:first-child').text())
            )

            UsualLoadPageFunction.AddTableRow($move_to_table, this_row_data)
            let row_added = $move_to_table.find('tbody tr:last-child')
            row_added.addClass('bg-warning-light-5')

            UsualLoadPageFunction.DeleteTableRow(
                $this_table,
                parseInt($(this).closest('tr').find('td:first-child').text())
            )

            // recalculate this table
            let sum_group_order = Array(17).fill(0);
            let sum_group_profit_order = Array(17).fill(0);
            $this_table.find('tbody tr').each(function (index, ele) {
                for (let i=0; i < 17; i++) {
                    sum_group_order[i] += parseFloat($(ele).find(`td:eq(${i+2}) input:eq(0)`).attr('value') || 0)
                    sum_group_profit_order[i] += parseFloat($(ele).find(`td:eq(${i+2}) input:eq(1)`).attr('value') || 0)
                }
            })
            let $wrapper = $this_table.closest('.dataTables_wrapper')
            let $tfoot = $wrapper.find('.dataTables_scrollFoot tfoot tr')
            for (let i=0; i < 17; i++) {
                $tfoot.find(`th:eq(${i+2}) input:eq(0)`).attr('value', sum_group_order[i])
                $tfoot.find(`th:eq(${i+2}) input:eq(1)`).attr('value', sum_group_profit_order[i])
            }

            // recalculate move to table
            let sum_group_order_move_to = Array(17).fill(0);
            let sum_group_profit_order_move_to = Array(17).fill(0);
            $move_to_table.find('tbody tr').each(function (index, ele) {
                for (let i=0; i < 17; i++) {
                    sum_group_order_move_to[i] += parseFloat($(ele).find(`td:eq(${i+2}) input:eq(0)`).attr('value') || 0)
                    sum_group_profit_order_move_to[i] += parseFloat($(ele).find(`td:eq(${i+2}) input:eq(1)`).attr('value') || 0)
                }
            })
            let $wrapper_move_to = $move_to_table.closest('.dataTables_wrapper')
            let $tfoot_move_to = $wrapper_move_to.find('.dataTables_scrollFoot tfoot tr')
            for (let i=0; i < 17; i++) {
                $tfoot_move_to.find(`th:eq(${i+2}) input:eq(0)`).attr('value', sum_group_order_move_to[i])
                $tfoot_move_to.find(`th:eq(${i+2}) input:eq(1)`).attr('value', sum_group_profit_order_move_to[i])
            }

            $.fn.initMaskMoney2()
        })
        $('#btn-add-group-plan').on('click', function () {
            let group_selected = SelectDDControl.get_data_from_idx(pageElements.$modalGroupEle, pageElements.$modalGroupEle.val());
            if (pageElements.$revenuePlanTable.find('tbody').find(`.${group_selected.id}`).length === 0) {
                if (Object.keys(group_selected).length !== 0) {
                    let pk = group_selected.id
                    let url_loaded = $('#revenue-plan-table').attr('data-group-url').replace(0, pk);
                    $.fn.callAjax(url_loaded, 'GET').then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                data = data['group'];
                                let group_employee_list = data.group_employee
                                if (pageVariables.revenue_plan_config_list.length > 0) {
                                    RevenuePlanPageFunction.UpdateTablePlan(group_employee_list, group_selected)
                                }
                                else {
                                    $.fn.notifyB({description: "Missing config role(s) that has permission to create revenue plans"}, 'warning')
                                }
                            }
                        })
                    $('#add-group-plan-modal').modal('hide')
                }
                else {
                    $.fn.notifyB({description: "No group has been selected"}, 'warning')
                }
            }
            else {
                $.fn.notifyB({description: "This group has been selected"}, 'warning')
            }
        })
        $('input[name="profit-type"]').on('change', function () {
            let profit_type = $('#net-income').prop('checked') ? pageElements.$trans_script.attr('data-trans-net-profit') : pageElements.$trans_script.attr('data-trans-gross-profit')
            pageElements.$revenuePlanTable.find('tr td input:eq(1)').attr('placeholder', profit_type)
        })
    }
}
