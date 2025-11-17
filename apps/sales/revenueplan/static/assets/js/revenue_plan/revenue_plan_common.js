/**
 * Khai báo các element trong page
 */
class RevenuePlanPageElements {
    constructor() {
        this.$trans_script = $('#trans-script')
        this.$url_script = $('#url-script')
        this.$revenuePlanPeriodEle = $('#revenue-plan-period')
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
            scrollY: '60vh',
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
        $table.DataTable().clear().destroy()
        $table.DataTableDefault({
            styleDom: 'hide-foot',
            reloadCurrency: true,
            rowIdx: true,
            scrollX: true,
            scrollY: '60vh',
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
                                ${row?.['is_changed_group'] ? `<button type="button" class="btn bflow-mirrow-btn-sm btn-move-plan" data-current-group-id="${row?.['current_group']?.['id'] || ''}">${$.fn.gettext('Move plan to')} <span class="fw-bold">${row?.['current_group']?.['title']}</span></button>` : ''}`
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
                $('.revenue-plan-group').each(function (index, ele) {
                    RevenuePlanPageFunction.getMonthOrder($(ele), selected_option['space_month'])
                })
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
        frm.dataForm['monthly'] = $('#monthly').prop('checked')
        frm.dataForm['quarterly'] = $('#quarterly').prop('checked')
        frm.dataForm['auto_sum_target'] = $('#equal').prop('checked')
        frm.dataForm['profit_target_type'] = $('#net-income').prop('checked') ? 1 : 0

        frm.dataForm['group_mapped_list'] = [] = []

        frm.dataForm['RevenuePlanGroup_data'] = []
        pageElements.$nav_group.find('.nav-group-item').each(function (index, ele) {
            let group_id = $(ele).attr('data-group-id')
            let group_table = $(`#revenue-plan-group-${group_id}-table`)

            let $wrapper = group_table.closest('.dataTables_wrapper')
            let $tfoot = $wrapper.find('.dataTables_scrollFoot tfoot tr')
            let group_year_target = parseFloat($tfoot.find(`.sum-group-year`).attr('value'))
            let group_year_profit_target = parseFloat($tfoot.find(`.sum-group-year-profit`).attr('value'))

            if (group_year_target > 0 && group_year_profit_target > 0) {
                frm.dataForm['group_mapped_list'].push(group_id)

                let group_month_target = []
                let group_month_profit_target = []
                for (let j = 0; j < 12; j++) {
                    group_month_target.push(parseFloat($tfoot.find(`.sum-group-m${j + 1}`).attr('value')))
                    group_month_profit_target.push(parseFloat($tfoot.find(`.sum-group-m${j + 1}-profit`).attr('value')))
                }

                let group_quarter_target = []
                let group_quarter_profit_target = []
                for (let j = 0; j < 4; j++) {
                    group_quarter_target.push(parseFloat($tfoot.find(`.sum-group-q${j + 1}`).attr('value')))
                    group_quarter_profit_target.push(parseFloat($tfoot.find(`.sum-group-q${j + 1}-profit`).attr('value')))
                }

                let employee_mapped_list = []
                group_table.find('tbody tr').each(function (index, ele) {
                    employee_mapped_list.push($(ele).find('.employee-mapped').attr('data-employee-id'))
                })

                frm.dataForm['RevenuePlanGroup_data'].push({
                    'group_mapped_id': group_id,
                    'group_month_target': group_month_target,
                    'group_quarter_target': group_quarter_target,
                    'group_year_target': group_year_target,
                    'group_month_profit_target': group_month_profit_target,
                    'group_quarter_profit_target': group_quarter_profit_target,
                    'group_year_profit_target': group_year_profit_target,
                    'employee_mapped_list': employee_mapped_list
                })
            }
        })

        frm.dataForm['company_month_target'] = Array(12).fill(0)
        frm.dataForm['company_month_profit_target'] = Array(12).fill(0)
        frm.dataForm['company_quarter_target'] = Array(4).fill(0)
        frm.dataForm['company_quarter_profit_target'] = Array(4).fill(0)
        frm.dataForm['company_year_target'] = 0
        frm.dataForm['company_year_profit_target'] = 0
        for (let x = 0; x < frm.dataForm['RevenuePlanGroup_data'].length; x++) {
            let group_data = frm.dataForm['RevenuePlanGroup_data'][x]

            for (let i = 0; i < 12; i++) {
                frm.dataForm['company_month_target'][i] += group_data?.['group_month_target'][i]
                frm.dataForm['company_month_profit_target'][i] += group_data?.['group_month_profit_target'][i]
            }

            for (let i = 0; i < 4; i++) {
                frm.dataForm['company_quarter_target'][i] += group_data?.['group_quarter_target'][i]
                frm.dataForm['company_quarter_profit_target'][i] += group_data?.['group_quarter_profit_target'][i]
            }

            frm.dataForm['company_year_target'] += group_data?.['group_year_target']
            frm.dataForm['company_year_profit_target'] += group_data?.['group_year_profit_target']
        }

        frm.dataForm['RevenuePlanGroupEmployee_data'] = []
        for (let i = 0; i < frm.dataForm['group_mapped_list'].length; i++) {
            let group_id = frm.dataForm['group_mapped_list'][i]
            let group_table = $(`#revenue-plan-group-${group_id}-table`)
            group_table.find('tbody tr').each(function (index, ele) {
                if ($(ele).find('.employee-mapped')) {
                    let emp_row = $(ele).closest('tr')

                    let emp_month_target = []
                    let emp_month_profit_target = []
                    for (let j = 0; j < 12; j++) {
                        emp_month_target.push(parseFloat(emp_row.find(`.m${j + 1}targetvalue`).attr('value')))
                        emp_month_profit_target.push(parseFloat(emp_row.find(`.m${j + 1}targetvalue-profit`).attr('value')))
                    }

                    let emp_quarter_target = []
                    let emp_quarter_profit_target = []
                    for (let j = 0; j < 4; j++) {
                        emp_quarter_target.push(parseFloat(emp_row.find(`.q${j + 1}targetvalue`).attr('value')))
                        emp_quarter_profit_target.push(parseFloat(emp_row.find(`.q${j + 1}targetvalue-profit`).attr('value')))
                    }

                    let emp_year_target = parseFloat(emp_row.find(`.yeartargetvalue`).attr('value'))
                    let emp_year_profit_target = parseFloat(emp_row.find(`.yeartargetvalue-profit`).attr('value'))

                    frm.dataForm['RevenuePlanGroupEmployee_data'].push({
                        'revenue_plan_group_mapped_id': group_id,
                        'employee_mapped_id': $(ele).find('.employee-mapped').attr('data-employee-id'),
                        'emp_month_target': emp_month_target,
                        'emp_quarter_target': emp_quarter_target,
                        'emp_year_target': emp_year_target,
                        'emp_month_profit_target': emp_month_profit_target,
                        'emp_quarter_profit_target': emp_quarter_profit_target,
                        'emp_year_profit_target': emp_year_profit_target
                    })
                }
            })
        }

        // console.log(frm.dataForm)

        return for_update ? {
            url: frmEle.attr('data-url-detail-api').format_url_with_uuid($.fn.getPkDetail()),
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        } : {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
    static async LoadDetailRevenuePlan(option) {
        WindowControl.showLoading()

        try {
            let url_group = $.fn.callAjax2({
                url: pageElements.$url_script.attr('data-url-group'),
                data: {},
                method: 'GET'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('group_list')) {
                        return data?.['group_list'];
                    }
                    return [];
                },
                (errs) => {
                    console.log(errs);
                    return [];
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
                    return {};
                }
            )

            let [group_list, data] = await Promise.all([url_group, url_loaded]);

            $('#title').val(data?.['title'])
            RevenuePlanPageFunction.LoadPeriod(data?.['period_mapped'])
            $('#monthly').prop('checked', data?.['monthly'])
            $('#quarterly').prop('checked', data?.['quarterly'])
            $('#equal').prop('checked', data?.['auto_sum_target'])
            $('#net-income').prop('checked', data?.['profit_target_type'])

            $x.fn.renderCodeBreadcrumb(data);

            RevenuePlanPageFunction.getMonthOrder($('#revenue-plan-company-table'), data?.['period_mapped']?.['space_month'])
            RevenuePlanPageFunction.LoadTableCompany(data)

            // Fetch tất cả group detail data trước
            let groupDetailPromises = group_list.map(group => {
                let url_loaded = pageElements.$url_script.attr('data-url-group-detail').replace(0, group?.['id']);
                return $.fn.callAjax(url_loaded, 'GET').then(
                    (resp) => {
                        return {
                            groupId: group?.['id'],
                            groupInfo: group,
                            data: $.fn.switcherResp(resp)
                        };
                    },
                    (errs) => {
                        console.log(errs);
                        return {
                            groupId: group?.['id'],
                            groupInfo: group,
                            data: null
                        };
                    }
                );
            });

            // Đợi tất cả group detail data load xong
            let groupDetails = await Promise.all(groupDetailPromises);

            // Tạo DOM và init tables với data đã có
            for (let i = 0; i < group_list.length; i++) {
                let is_set_up = data?.['group_mapped_list'].includes(group_list[i]?.['id']);
                let groupId = group_list[i]?.['id'];

                pageElements.$nav_group.append(`
                <li class="nav-item nav-group-item" data-group-id="${groupId}">
                    <a class="nav-link" data-bs-toggle="pill" href="#tab_group_${groupId}">
                        <span class="nav-link-text ${is_set_up ? 'fw-bold' : ''}">${group_list[i]?.['title']}</span>
                    </a>
                </li>
            `)

                let group_data = {}
                if (data?.['group_mapped_list'].includes(groupId)) {
                    group_data = data?.['revenue_plan_group_data'].find(item => item?.['group_mapped']?.['id'] === groupId) || {}
                }

                pageElements.$nav_content.append(`
                <div class="tab-pane fade" id="tab_group_${groupId}">
                    <table class="table nowrap w-100 revenue-plan-group" id="revenue-plan-group-${groupId}-table">
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

                let group_table = $(`#revenue-plan-group-${groupId}-table`);
                let groupDetail = groupDetails.find(gd => gd.groupId === groupId);

                if (groupDetail && groupDetail.data) {
                    if (pageVariables.revenue_plan_config_list.length > 0) {
                        RevenuePlanPageFunction.getMonthOrder(group_table, data?.['period_mapped']?.['space_month'])
                        if (is_set_up) {
                            RevenuePlanPageFunction.LoadTableGroup(group_table, group_data?.['employee_target_data'] || [], group_data)
                        } else {
                            let employee_target_data = RevenuePlanPageFunction.GetDataGroup(groupDetail.data, groupDetail.groupInfo)
                            RevenuePlanPageFunction.LoadTableGroup(group_table, employee_target_data)
                        }
                    }
                }
            }

            UsualLoadPageFunction.DisablePage(option === 'detail')

        } catch (error) {
            console.error('Error loading revenue plan:', error);
        } finally {
            WindowControl.hideLoading()
        }
    }
}

/**
 * Khai báo các Event
 */
class RevenuePlanEventHandler {
    static InitPageEven() {
        $(document).on("change", '.month-target', function () {
            RevenuePlanPageFunction.calculatePlan($(this).closest('tr'))

            let sum_group_order = Array(17).fill(0);
            $(this).closest('tbody').find('tr').each(function (index, ele) {
                for (let i=0; i < 17; i++) {
                    sum_group_order[i] += parseFloat($(ele).find(`td:eq(${i+2}) input:eq(0)`).attr('value') || 0)
                }
            })
            let $wrapper = $(this).closest('table').closest('.dataTables_wrapper')
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
            let $wrapper = $(this).closest('table').closest('.dataTables_wrapper');
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
            $(`.nav-group-item[data-group-id="${move_to_group_id}"] .nav-link-text`).addClass('fw-bold')
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
    }
}
