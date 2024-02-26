const revenuePlanPeriodEle = $('#revenue-plan-period')
const modalGroupEle = $('#modal-group')
const revenuePlanTable = $('#revenue-plan-table')
let revenue_plan_config_list = []
if ($('#revenue_plan_config').text() !== '') {
    let revenue_plan_config = JSON.parse($('#revenue_plan_config').text());
    for (let i = 0; i < revenue_plan_config[0]?.['roles_mapped_list'].length; i++) {
        revenue_plan_config_list.push(
            revenue_plan_config[0]['roles_mapped_list'][i]['id']
        )
    }
    if (revenue_plan_config_list.length > 0) {
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
const btn_update_group = $('#btn_update_group')
const button_group_change_text = btn_update_group.text()
const QUARTER_1 = ['m1', 'm2', 'm3']
const QUARTER_2 = ['m4', 'm5', 'm6']
const QUARTER_3 = ['m7', 'm8', 'm9']
const QUARTER_4 = ['m10', 'm11', 'm12']
const trans_script = $('#trans-url')
let group_change_title = []
let group_change_obj = []
let DETAIL_DATA = null
let NEW_DATA = []
let REMOVED_ROW = []

function getMonthOrder(space_month) {
    for (let i = 0; i < 12; i++) {
        let trans_order = i+1+space_month
        if (trans_order > 12) {
            trans_order -= 12
        }
        $(`#m${i+1}th`).text(trans_script.attr(`data-trans-m${trans_order}th`))
    }
}

function getQuarterBelong(value) {
    let quarter_belong = ''
    if (QUARTER_1.includes(value)) {
        quarter_belong = 'quarter1belong'
    }
    else if (QUARTER_2.includes(value)) {
        quarter_belong = 'quarter2belong'
    }
    else if (QUARTER_3.includes(value)) {
        quarter_belong = 'quarter3belong'
    }
    else if (QUARTER_4.includes(value)) {
        quarter_belong = 'quarter4belong'
    }
    return quarter_belong
}

function calculatePlan(this_row) {
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
    this_row.find('.ytarget-td .yeartargetvalue').attr('data-init-money', sum_year)

    $.fn.initMaskMoney2()
}

function calculatePlanProfit(this_row) {
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
    this_row.find('.ytarget-td .yeartargetvalue-profit').attr('data-init-money', sum_year)

    $.fn.initMaskMoney2()
}

function updatePriceAfterReloadGroupMember() {
    $('.month-target').each(function () {
        calculatePlan($(this).closest('tr'))
        let sum_month_target_company = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let sum_quarter_target_company = [0, 0, 0, 0]
        let sum_year_target_company = 0
        revenuePlanTable.find('tr[data-row="group-sum-row"]').each(function () {
            let sum_m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            let sum_q = [0, 0, 0, 0]
            let sum_year = 0
            revenuePlanTable.find(`.${$(this).attr('data-group-id')}`).each(function () {
                let row_month_target_value = [
                    parseFloat($(this).find('.m1targetvalue').attr('value')),
                    parseFloat($(this).find('.m2targetvalue').attr('value')),
                    parseFloat($(this).find('.m3targetvalue').attr('value')),
                    parseFloat($(this).find('.m4targetvalue').attr('value')),
                    parseFloat($(this).find('.m5targetvalue').attr('value')),
                    parseFloat($(this).find('.m6targetvalue').attr('value')),
                    parseFloat($(this).find('.m7targetvalue').attr('value')),
                    parseFloat($(this).find('.m8targetvalue').attr('value')),
                    parseFloat($(this).find('.m9targetvalue').attr('value')),
                    parseFloat($(this).find('.m10targetvalue').attr('value')),
                    parseFloat($(this).find('.m11targetvalue').attr('value')),
                    parseFloat($(this).find('.m12targetvalue').attr('value'))
                ]
                let row_quarter_target_value = [
                    parseFloat($(this).find('.q1targetvalue').attr('value')),
                    parseFloat($(this).find('.q2targetvalue').attr('value')),
                    parseFloat($(this).find('.q3targetvalue').attr('value')),
                    parseFloat($(this).find('.q4targetvalue').attr('value')),
                ]

                sum_m = sum_m.map(function (value, index) {
                    if (!isNaN(row_month_target_value[index])) {
                        return value + row_month_target_value[index];
                    }
                    else {
                        return value
                    }
                });
                sum_q = sum_q.map(function (value, index) {
                    if (!isNaN(row_quarter_target_value[index])) {
                        return value + row_quarter_target_value[index];
                    }
                    else {
                        return value
                    }
                });
                if (!isNaN($(this).find('.ytarget-td .yeartargetvalue').attr('data-init-money'))) {
                    sum_year += parseFloat($(this).find('.ytarget-td .yeartargetvalue').attr('data-init-money'))
                }
            })

            for (let i = 0; i < 12; i++) {
                $(this).find(`.sum-m${i+1} .sum-group-m${i+1}`).attr('data-init-money', sum_m[i])
                sum_month_target_company[i] += parseFloat(sum_m[i])
            }
            for (let i = 0; i < 4; i++) {
                $(this).find(`.sum-q${i+1} .sum-group-q${i+1}`).attr('data-init-money', sum_q[i])
                sum_quarter_target_company[i] += parseFloat(sum_q[i])
            }
            $(this).find('.sum-year .sum-group-year').attr('data-init-money', sum_year)
            sum_year_target_company += parseFloat(sum_year)
        })


        for (let i = 0; i < 12; i++) {
            revenuePlanTable.find(`tfoot .sum-company-m${i+1}`).attr('data-init-money', sum_month_target_company[i])
        }

        for (let i = 0; i < 4; i++) {
            revenuePlanTable.find(`tfoot .sum-company-q${i+1}`).attr('data-init-money', sum_quarter_target_company[i])
        }

        $('tfoot .sum-company-year').attr('data-init-money', sum_year_target_company)

        $.fn.initMaskMoney2()
    })

    $('.month-target-profit').each(function () {
        calculatePlanProfit($(this).closest('tr'))
        let sum_month_profit_target_company = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let sum_quarter_profit_target_company = [0, 0, 0, 0]
        let sum_year_profit_target_company = 0
        revenuePlanTable.find('tr[data-row="group-sum-row"]').each(function () {
            let sum_m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            let sum_q = [0, 0, 0, 0]
            let sum_year = 0
            revenuePlanTable.find(`.${$(this).attr('data-group-id')}`).each(function () {
                let row_month_target_value = [
                    parseFloat($(this).find('.m1targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m2targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m3targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m4targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m5targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m6targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m7targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m8targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m9targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m10targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m11targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.m12targetvalue-profit').attr('value'))
                ]
                let row_quarter_target_value = [
                    parseFloat($(this).find('.q1targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.q2targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.q3targetvalue-profit').attr('value')),
                    parseFloat($(this).find('.q4targetvalue-profit').attr('value')),
                ]

                sum_m = sum_m.map(function (value, index) {
                    if (!isNaN(row_month_target_value[index])) {
                        return value + row_month_target_value[index];
                    }
                    else {
                        return value
                    }
                });
                sum_q = sum_q.map(function (value, index) {
                    if (!isNaN(row_quarter_target_value[index])) {
                        return value + row_quarter_target_value[index];
                    }
                    else {
                        return value
                    }
                });
                if (!isNaN($(this).find('.ytarget-td .yeartargetvalue-profit').attr('data-init-money'))) {
                    sum_year += parseFloat($(this).find('.ytarget-td .yeartargetvalue-profit').attr('data-init-money'))
                }
            })

            for (let i = 0; i < 12; i++) {
                $(this).find(`.sum-m${i+1} .sum-group-m${i+1}-profit`).attr('data-init-money', sum_m[i])
                sum_month_profit_target_company[i] += parseFloat(sum_m[i])
            }
            for (let i = 0; i < 4; i++) {
                $(this).find(`.sum-q${i+1} .sum-group-q${i+1}-profit`).attr('data-init-money', sum_q[i])
                sum_quarter_profit_target_company[i] += parseFloat(sum_q[i])
            }
            $(this).find('.sum-year .sum-group-year-profit').attr('data-init-money', sum_year)
            sum_year_profit_target_company += parseFloat(sum_year)
        })


        for (let i = 0; i < 12; i++) {
            revenuePlanTable.find(`tfoot .sum-company-m${i+1}-profit`).attr('data-init-money', sum_month_profit_target_company[i])
        }

        for (let i = 0; i < 4; i++) {
            revenuePlanTable.find(`tfoot .sum-company-q${i+1}-profit`).attr('data-init-money', sum_quarter_profit_target_company[i])
        }

        $('tfoot .sum-company-year-profit').attr('data-init-money', sum_year_profit_target_company)

        $.fn.initMaskMoney2()
    })

    $('#notify-change-group').remove()
}

$(document).on("change", '.month-target', function () {
    calculatePlan($(this).closest('tr'))
    let sum_month_target_company = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let sum_quarter_target_company = [0, 0, 0, 0]
    let sum_year_target_company = 0
    revenuePlanTable.find('tr[data-row="group-sum-row"]').each(function () {
        let sum_m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let sum_q = [0, 0, 0, 0]
        let sum_year = 0
        revenuePlanTable.find(`.${$(this).attr('data-group-id')}`).each(function () {
            let row_month_target_value = [
                parseFloat($(this).find('.m1targetvalue').attr('value')),
                parseFloat($(this).find('.m2targetvalue').attr('value')),
                parseFloat($(this).find('.m3targetvalue').attr('value')),
                parseFloat($(this).find('.m4targetvalue').attr('value')),
                parseFloat($(this).find('.m5targetvalue').attr('value')),
                parseFloat($(this).find('.m6targetvalue').attr('value')),
                parseFloat($(this).find('.m7targetvalue').attr('value')),
                parseFloat($(this).find('.m8targetvalue').attr('value')),
                parseFloat($(this).find('.m9targetvalue').attr('value')),
                parseFloat($(this).find('.m10targetvalue').attr('value')),
                parseFloat($(this).find('.m11targetvalue').attr('value')),
                parseFloat($(this).find('.m12targetvalue').attr('value'))
            ]
            let row_quarter_target_value = [
                parseFloat($(this).find('.q1targetvalue').attr('value')),
                parseFloat($(this).find('.q2targetvalue').attr('value')),
                parseFloat($(this).find('.q3targetvalue').attr('value')),
                parseFloat($(this).find('.q4targetvalue').attr('value')),
            ]

            sum_m = sum_m.map(function (value, index) {
                if (!isNaN(row_month_target_value[index])) {
                    return value + row_month_target_value[index];
                }
                else {
                    return value
                }
            });
            sum_q = sum_q.map(function (value, index) {
                if (!isNaN(row_quarter_target_value[index])) {
                    return value + row_quarter_target_value[index];
                }
                else {
                    return value
                }
            });
            if (!isNaN($(this).find('.ytarget-td .yeartargetvalue').attr('data-init-money'))) {
                sum_year += parseFloat($(this).find('.ytarget-td .yeartargetvalue').attr('data-init-money'))
            }
        })

        for (let i = 0; i < 12; i++) {
            $(this).find(`.sum-m${i+1} .sum-group-m${i+1}`).attr('data-init-money', sum_m[i])
            sum_month_target_company[i] += parseFloat(sum_m[i])
        }
        for (let i = 0; i < 4; i++) {
            $(this).find(`.sum-q${i+1} .sum-group-q${i+1}`).attr('data-init-money', sum_q[i])
            sum_quarter_target_company[i] += parseFloat(sum_q[i])
        }
        $(this).find('.sum-year .sum-group-year').attr('data-init-money', sum_year)
        sum_year_target_company += parseFloat(sum_year)
    })


    for (let i = 0; i < 12; i++) {
        revenuePlanTable.find(`tfoot .sum-company-m${i+1}`).attr('data-init-money', sum_month_target_company[i])
    }

    for (let i = 0; i < 4; i++) {
        revenuePlanTable.find(`tfoot .sum-company-q${i+1}`).attr('data-init-money', sum_quarter_target_company[i])
    }

    $('tfoot .sum-company-year').attr('data-init-money', sum_year_target_company)

    $.fn.initMaskMoney2()
})

$(document).on("change", '.month-target-profit', function () {
    calculatePlanProfit($(this).closest('tr'))
    let sum_month_profit_target_company = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let sum_quarter_profit_target_company = [0, 0, 0, 0]
    let sum_year_profit_target_company = 0
    revenuePlanTable.find('tr[data-row="group-sum-row"]').each(function () {
        let sum_m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let sum_q = [0, 0, 0, 0]
        let sum_year = 0
        revenuePlanTable.find(`.${$(this).attr('data-group-id')}`).each(function () {
            let row_month_target_value = [
                parseFloat($(this).find('.m1targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m2targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m3targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m4targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m5targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m6targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m7targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m8targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m9targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m10targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m11targetvalue-profit').attr('value')),
                parseFloat($(this).find('.m12targetvalue-profit').attr('value'))
            ]
            let row_quarter_target_value = [
                parseFloat($(this).find('.q1targetvalue-profit').attr('value')),
                parseFloat($(this).find('.q2targetvalue-profit').attr('value')),
                parseFloat($(this).find('.q3targetvalue-profit').attr('value')),
                parseFloat($(this).find('.q4targetvalue-profit').attr('value')),
            ]

            sum_m = sum_m.map(function (value, index) {
                if (!isNaN(row_month_target_value[index])) {
                    return value + row_month_target_value[index];
                }
                else {
                    return value
                }
            });
            sum_q = sum_q.map(function (value, index) {
                if (!isNaN(row_quarter_target_value[index])) {
                    return value + row_quarter_target_value[index];
                }
                else {
                    return value
                }
            });
            if (!isNaN($(this).find('.ytarget-td .yeartargetvalue-profit').attr('data-init-money'))) {
                sum_year += parseFloat($(this).find('.ytarget-td .yeartargetvalue-profit').attr('data-init-money'))
            }
        })

        for (let i = 0; i < 12; i++) {
            $(this).find(`.sum-m${i+1} .sum-group-m${i+1}-profit`).attr('data-init-money', sum_m[i])
            sum_month_profit_target_company[i] += parseFloat(sum_m[i])
        }
        for (let i = 0; i < 4; i++) {
            $(this).find(`.sum-q${i+1} .sum-group-q${i+1}-profit`).attr('data-init-money', sum_q[i])
            sum_quarter_profit_target_company[i] += parseFloat(sum_q[i])
        }
        $(this).find('.sum-year .sum-group-year-profit').attr('data-init-money', sum_year)
        sum_year_profit_target_company += parseFloat(sum_year)
    })


    for (let i = 0; i < 12; i++) {
        revenuePlanTable.find(`tfoot .sum-company-m${i+1}-profit`).attr('data-init-money', sum_month_profit_target_company[i])
    }

    for (let i = 0; i < 4; i++) {
        revenuePlanTable.find(`tfoot .sum-company-q${i+1}-profit`).attr('data-init-money', sum_quarter_profit_target_company[i])
    }

    $('tfoot .sum-company-year-profit').attr('data-init-money', sum_year_profit_target_company)

    $.fn.initMaskMoney2()
})

function UpdateTablePlan(group_employee_list, group_selected) {
    let profit_type = trans_script.attr('data-trans-gross-profit')
    if ($('#net-income').prop('checked')) {
        profit_type = trans_script.attr('data-trans-net-profit')
    }
    let group_employee_valid = group_employee_list.filter(function (item) {
        return item.role.some(function (role) {
            return revenue_plan_config_list.includes(role.id);
        });
    });
    if (group_employee_valid.length > 0) {
        revenuePlanTable.find('tbody').append(
            `<tr class="bg-overlay bg-secondary bg-opacity-10" data-row="group-sum-row" data-group-id="${group_selected.id}">
                <td><span class="text-primary"><b>${group_selected.title}</b></span></td>
                <td></td>
                <td>
                    <label class="col-form-label text-primary">${trans_script.attr('data-trans-revenue')}</label>
                    <div class="my-1"></div>
                    <label class="profit-type-span col-form-label text-success">${profit_type}</label>
                </td>
                <td class="sum-m1">
                    <span class="sum-group-m1 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m1-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m2">
                    <span class="sum-group-m2 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m2-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m3">
                    <span class="sum-group-m3 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m3-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-q1">
                    <span class="sum-group-q1 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-q1-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m4">
                    <span class="sum-group-m4 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m4-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m5">
                    <span class="sum-group-m5 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m5-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m6">
                    <span class="sum-group-m6 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m6-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-q2">
                    <span class="sum-group-q2 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-q2-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m7">
                    <span class="sum-group-m7 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m7-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m8">
                    <span class="sum-group-m8 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m8-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m9">
                    <span class="sum-group-m9 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m9-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-q3">
                    <span class="sum-group-q3 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-q3-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m10">
                    <span class="sum-group-m10 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m10-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m11">
                    <span class="sum-group-m11 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m11-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-m12">
                    <span class="sum-group-m12 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-m12-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-q4">
                    <span class="sum-group-q4 mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-q4-profit mask-money text-success" data-init-money="0"></span>
                </td>
                <td class="sum-year">
                    <span class="sum-group-year mask-money text-primary" data-init-money="0"></span>
                    <div class="my-3"></div>
                    <span class="sum-group-year-profit mask-money text-success" data-init-money="0"></span>
                </td>
            </tr>`
        )
        for (let i = 0; i < group_employee_valid.length; i++) {
            revenuePlanTable.find('tbody').append(
                `<tr class="${group_selected.id}">
                    <td></td>
                    <td class="employee-mapped" data-employee-id="${group_employee_valid[i]?.['id']}"><b>${group_employee_valid[i]?.['full_name']}</b></td>
                    <td>
                        <label class="col-form-label text-primary">${trans_script.attr('data-trans-revenue')}</label>
                        <div class="my-1"></div>
                        <label class="profit-type-span col-form-label text-success">${profit_type}</label>
                    </td>
                    <td class="mtarget-td" data-type="m1"></td>
                    <td class="mtarget-td" data-type="m2"></td>
                    <td class="mtarget-td" data-type="m3"></td>
                    <td class="qtarget-td q1target-td" data-type="q1"></td>
                    <td class="mtarget-td" data-type="m4"></td>
                    <td class="mtarget-td" data-type="m5"></td>
                    <td class="mtarget-td" data-type="m6"></td>
                    <td class="qtarget-td q2target-td" data-type="q2"></td>
                    <td class="mtarget-td" data-type="m7"></td>
                    <td class="mtarget-td" data-type="m8"></td>
                    <td class="mtarget-td" data-type="m9"></td>
                    <td class="qtarget-td q3target-td" data-type="q3"></td>
                    <td class="mtarget-td" data-type="m10"></td>
                    <td class="mtarget-td" data-type="m11"></td>
                    <td class="mtarget-td" data-type="m12"></td>
                    <td class="qtarget-td q4target-td" data-type="q4"></td>
                    <td class="ytarget-td" data-type="year"></td>
                </tr>`
            )
        }

        if ($('#monthly').prop('checked')) {
            revenuePlanTable.find('.mtarget-td').each(function () {
                if ($(this).html() === '') {
                    let quarter_belong = getQuarterBelong($(this).closest('td').attr('data-type'))
                    $(this).append(`
                        <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target ${quarter_belong} ${$(this).closest('td').attr('data-type')}targetvalue">
                        <input value="0" data-return-type="number" class="is-valid mask-money form-control month-target-profit ${quarter_belong}-profit ${$(this).closest('td').attr('data-type')}targetvalue-profit">
                    `)
                }
            })
            revenuePlanTable.find('.qtarget-td').each(function () {
                if ($(this).html() === '') {
                    $(this).append(`
                        <input readonly value="0" data-return-type="number" class="mb-1 mask-money form-control quarter-target ${$(this).closest('td').attr('data-type')}targetvalue">
                        <input readonly value="0" data-return-type="number" class="is-valid mask-money form-control quarter-target-profit ${$(this).closest('td').attr('data-type')}targetvalue-profit">
                    `)
                }
            })
            revenuePlanTable.find('.ytarget-td').each(function () {
                if ($(this).html() === '') {
                    $(this).append(`
                        <span class="mask-money text-primary yeartargetvalue" data-init-money="0"></span>
                        <div class="my-3"></div>
                        <span class="mask-money text-success yeartargetvalue-profit" data-init-money="0"></span>
                    `)
                }
            })

            $.fn.initMaskMoney2()
        }
    }
}

function LoadPeriod(data) {
    revenuePlanPeriodEle.initSelect2({
        ajax: {
            url: revenuePlanPeriodEle.attr('data-url'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'periods_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {
        let selected_option = SelectDDControl.get_data_from_idx(revenuePlanPeriodEle, revenuePlanPeriodEle.val())
        if (selected_option) {
            getMonthOrder(selected_option['space_month'])
        }
    })
}

function LoadModalGroup(data) {
    modalGroupEle.initSelect2({
        ajax: {
            url: modalGroupEle.attr('data-url'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'group_list',
        keyId: 'id',
        keyText: 'title',
    })
}

$('#btn-add-group-plan').on('click', function () {
    let group_selected = SelectDDControl.get_data_from_idx(modalGroupEle, modalGroupEle.val());
    if (revenuePlanTable.find('tbody').find(`.${group_selected.id}`).length === 0) {
        if (Object.keys(group_selected).length !== 0) {
            let pk = group_selected.id
            let url_loaded = $('#revenue-plan-table').attr('data-group-url').replace(0, pk);
            $.fn.callAjax(url_loaded, 'GET').then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        data = data['group'];
                        let group_employee_list = data.group_employee
                        if (revenue_plan_config_list.length > 0) {
                            UpdateTablePlan(group_employee_list, group_selected)
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

btn_update_group.on('click', function () {
    let profit_type = trans_script.attr('data-trans-gross-profit')
    if ($('#net-income').prop('checked')) {
        profit_type = trans_script.attr('data-trans-net-profit')
    }
    for (const group of NEW_DATA) {
        revenuePlanTable.find(`tbody .${group['group_id']}`).each(function () {
            $(this).find('.employee-mapped').each(function () {
                let this_emp_id = $(this).attr('data-employee-id')
                let exist = group['employee_valid_list'].filter(function (item) {
                    return item?.['id'] === this_emp_id
                }).length
                if (!exist) {
                    REMOVED_ROW.push({
                        'employee_id': this_emp_id,
                        'html': $(this).closest('tr')
                    })
                    $(this).closest('tr').remove()
                }
            })
        })
    }
    for (const group of NEW_DATA) {
        let current_emp = []
        revenuePlanTable.find(`tbody .${group['group_id']}`).each(function () {
            $(this).find('.employee-mapped').each(function () {
                current_emp.push($(this).attr('data-employee-id'))
            })
        })
        for (const emp of group['employee_valid_list']) {
            if (!current_emp.includes(emp?.['id'])) {
                let old = REMOVED_ROW.filter(function (item) {
                    return item?.['employee_id'] === emp?.['id']
                })[0]

                let new_html = ``
                if (old) {
                    new_html = old?.['html']
                }
                else {
                    new_html = `
                        <tr class="${group['group_id']} bg-warning-light-5">
                            <td></td>
                            <td class="employee-mapped" data-employee-id="${emp?.['id']}"><b>${emp?.['full_name']}</b></td>
                            <td>
                                <label class="col-form-label text-primary">${trans_script.attr('data-trans-revenue')}</label>
                                <div class="my-1"></div>
                                <label class="profit-type-span col-form-label text-secondary">${profit_type}</label>
                            </td>
                            <td class="mtarget-td" data-type="m1">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter1belong m1targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m1targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m2">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter1belong m2targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m2targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m3">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter1belong m3targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m3targetvalue-profit">
                            </td>
                            <td class="qtarget-td q1target-td" data-type="q1">
                                <input readonly value="0" data-return-type="number" class="mb-1 mask-money form-control quarter-target q1targetvalue">
                                <input readonly value="0" data-return-type="number" class="net-income-form-control mask-money form-control quarter-target-profit q1targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m4">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter2belong m4targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m4targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m5">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter2belong m5targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m5targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m6">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter2belong m6targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m6targetvalue-profit">
                            </td>
                            <td class="qtarget-td q2target-td" data-type="q2">
                                <input readonly value="0" data-return-type="number" class="mb-1 mask-money form-control quarter-target q2targetvalue">
                                <input readonly value="0" data-return-type="number" class="net-income-form-control mask-money form-control quarter-target-profit q2targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m7">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter3belong m7targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m7targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m8">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter3belong m8targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m8targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m9">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter3belong m9targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m9targetvalue-profit">
                            </td>
                            <td class="qtarget-td q3target-td" data-type="q3">
                                <input readonly value="0" data-return-type="number" class="mb-1 mask-money form-control quarter-target q3targetvalue">
                                <input readonly value="0" data-return-type="number" class="net-income-form-control mask-money form-control quarter-target-profit q3targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m10">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter4belong m10targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m10targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m11">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter4belong m11targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m11targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m12">
                                <input value="0" data-return-type="number" class="mb-1 mask-money form-control month-target quarter4belong m12targetvalue">
                                <input value="0" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m12targetvalue-profit">
                            </td>
                            <td class="qtarget-td q4target-td" data-type="q4">
                                <input readonly value="0" data-return-type="number" class="mb-1 mask-money form-control quarter-target q4targetvalue">
                                <input readonly value="0" data-return-type="number" class="net-income-form-control mask-money form-control quarter-target-profit q4targetvalue-profit">
                            </td>
                            <td class="ytarget-td" data-type="year">
                                <span class="mask-money text-primary yeartargetvalue" data-init-money="0"></span>
                                <div class="my-3"></div>
                                <span class="mask-money text-secondary yeartargetvalue-profit" data-init-money="0"></span>
                            </td>
                        </tr>
                    `
                }

                $(new_html).insertAfter(revenuePlanTable.find(`tbody tr[data-group-id="${group['group_id']}"]`)[0]);
                $(new_html).attr('class', `${group['group_id']} bg-warning-light-5`)
            }
        }
    }
    updatePriceAfterReloadGroupMember()
    $.fn.initMaskMoney2()
})

$('input[name="profit-type"]').on('change', function () {
    let profit_type = trans_script.attr('data-trans-gross-profit')
    if ($('#net-income').prop('checked')) {
        profit_type = trans_script.attr('data-trans-net-profit')
    }
    $('.profit-type-span').text(profit_type)
})

class RevenuePlanHandle {
    load() {
        LoadPeriod()
        LoadModalGroup()
    }

    combinesData(frmEle, for_update=false) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#revenue-plan-name').val();
        frm.dataForm['period_mapped'] = $('#revenue-plan-period').val()
        frm.dataForm['group_mapped_list'] = []
        revenuePlanTable.find('tbody tr[data-row="group-sum-row"]').each(function () {
            frm.dataForm['group_mapped_list'].push($(this).attr('data-group-id'))
        })
        frm.dataForm['monthly'] = $('#monthly').prop('checked')
        frm.dataForm['quarterly'] = $('#quarterly').prop('checked')
        frm.dataForm['auto_sum_target'] = $('#equal').prop('checked')
        if ($('#net-income').prop('checked')) {
            frm.dataForm['profit_target_type'] = 1
        }
        else {
            frm.dataForm['profit_target_type'] = 0
        }
        frm.dataForm['company_month_target'] = []
        frm.dataForm['company_month_profit_target'] = []
        for (let i = 0; i < 12; i++) {
            frm.dataForm['company_month_target'].push(
                parseFloat($(`.sum-company-m${i+1}`).attr('data-init-money'))
            )
            frm.dataForm['company_month_profit_target'].push(
                parseFloat($(`.sum-company-m${i+1}-profit`).attr('data-init-money'))
            )
        }
        frm.dataForm['company_quarter_target'] = []
        frm.dataForm['company_quarter_profit_target'] = []
        for (let i = 0; i < 4; i++) {
            frm.dataForm['company_quarter_target'].push(
                parseFloat($(`.sum-company-q${i+1}`).attr('data-init-money'))
            )
            frm.dataForm['company_quarter_profit_target'].push(
                parseFloat($(`.sum-company-q${i+1}-profit`).attr('data-init-money'))
            )
        }
        frm.dataForm['company_year_target'] = parseFloat($('.sum-company-year').attr('data-init-money'))
        frm.dataForm['company_year_profit_target'] = parseFloat($('.sum-company-year-profit').attr('data-init-money'))

        frm.dataForm['RevenuePlanGroup_data'] = []
        for (let i = 0; i < frm.dataForm['group_mapped_list'].length; i++) {
            let group_month_target = []
            let group_month_profit_target = []
            for (let j = 0; j < 12; j++) {
                group_month_target.push(
                    parseFloat(
                        revenuePlanTable.find(
                            `tbody tr[data-group-id="${frm.dataForm['group_mapped_list'][i]}"] .sum-group-m${j+1}`
                        ).attr('data-init-money')
                    )
                )
                group_month_profit_target.push(
                    parseFloat(
                        revenuePlanTable.find(
                            `tbody tr[data-group-id="${frm.dataForm['group_mapped_list'][i]}"] .sum-group-m${j+1}-profit`
                        ).attr('data-init-money')
                    )
                )
            }
            let group_quarter_target = []
            let group_quarter_profit_target = []
            for (let j = 0; j < 4; j++) {
                group_quarter_target.push(
                    parseFloat(
                        revenuePlanTable.find(
                            `tbody tr[data-group-id="${frm.dataForm['group_mapped_list'][i]}"] .sum-group-q${j+1}`
                        ).attr('data-init-money')
                    )
                )
                group_quarter_profit_target.push(
                    parseFloat(
                        revenuePlanTable.find(
                            `tbody tr[data-group-id="${frm.dataForm['group_mapped_list'][i]}"] .sum-group-q${j+1}-profit`
                        ).attr('data-init-money')
                    )
                )
            }
            let group_year_target = parseFloat(
                revenuePlanTable.find(
                    `tbody tr[data-group-id="${frm.dataForm['group_mapped_list'][i]}"] .sum-group-year`
                ).attr('data-init-money')
            )
            let group_year_profit_target = parseFloat(
                revenuePlanTable.find(
                    `tbody tr[data-group-id="${frm.dataForm['group_mapped_list'][i]}"] .sum-group-year-profit`
                ).attr('data-init-money')
            )
            let employee_mapped_list = []
            revenuePlanTable.find(`tr[class="${frm.dataForm['group_mapped_list'][i]}"] td[class="employee-mapped"]`).each(function () {
                employee_mapped_list.push($(this).attr('data-employee-id'))
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
            revenuePlanTable.find(`tbody .${frm.dataForm['group_mapped_list'][i]}`).each(function (){
                let emp_month_target = []
                let emp_month_profit_target = []
                for (let j = 0; j < 12; j++) {
                    emp_month_target.push(parseFloat($(this).find(`.m${j+1}targetvalue`).attr('value')))
                    emp_month_profit_target.push(parseFloat($(this).find(`.m${j+1}targetvalue-profit`).attr('value')))
                }
                let emp_quarter_target = []
                let emp_quarter_profit_target = []
                for (let j = 0; j < 4; j++) {
                    emp_quarter_target.push(parseFloat($(this).find(`.q${j+1}targetvalue`).attr('value')))
                    emp_quarter_profit_target.push(parseFloat($(this).find(`.q${j+1}targetvalue-profit`).attr('value')))
                }
                let emp_year_target = parseFloat($(this).find(`.ytarget-td .yeartargetvalue`).attr('data-init-money'))
                let emp_year_profit_target = parseFloat($(this).find(`.ytarget-td .yeartargetvalue-profit`).attr('data-init-money'))
                frm.dataForm['RevenuePlanGroupEmployee_data'].push({
                    'revenue_plan_group_mapped_id': frm.dataForm['group_mapped_list'][i],
                    'employee_mapped_id': $(this).find('td[class="employee-mapped"]').attr('data-employee-id'),
                    'emp_month_target': emp_month_target,
                    'emp_quarter_target': emp_quarter_target,
                    'emp_year_target': emp_year_target,
                    'emp_month_profit_target': emp_month_profit_target,
                    'emp_quarter_profit_target': emp_quarter_profit_target,
                    'emp_year_profit_target': emp_year_profit_target
                })
            })
        }

        console.log(frm.dataForm)
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
}

function Disabled(option) {
    if (option === 'detail') {
        $('input').prop('readonly', true).prop('disabled', true)
        $('select').prop('disabled', true)
        $('#add-group-plan').addClass('disabled')
    }
}

function LoadDetailRevenuePlan(option) {
    let pk = $.fn.getPkDetail()
    let dataParam = {}
    let url_loaded = $.fn.callAjax2({
        url: $('#form-detail-revenue-plan').attr('data-url-detail-api').replace(0, pk),
        data: dataParam,
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

    Promise.all([url_loaded]).then(
        (results) => {
            let data = results[0];
            $x.fn.renderCodeBreadcrumb(data);
            console.log(data)
            DETAIL_DATA = data
            getMonthOrder(data?.['period_mapped']?.['space_month'])

            $('#revenue-plan-name').val(data?.['title'])
            LoadPeriod(data?.['period_mapped'])
            $('#monthly').prop('checked', data?.['monthly'])
            $('#quarterly').prop('checked', data?.['quarterly'])
            $('#equal').prop('checked', data?.['auto_sum_target'])

            for (let i = 0; i < data?.['company_month_target'].length; i++) {
                revenuePlanTable.find('tfoot .company-row').find(`.sum-m${i+1} .sum-company-m${i+1}`).attr('data-init-money', data?.['company_month_target'][i])
            }
            for (let i = 0; i < data?.['company_quarter_target'].length; i++) {
                revenuePlanTable.find('tfoot .company-row').find(`.sum-q${i+1} .sum-company-q${i+1}`).attr('data-init-money', data?.['company_quarter_target'][i])
            }
            revenuePlanTable.find('tfoot .company-row').find(`.sum-company-year`).attr('data-init-money', data?.['company_year_target'])

            for (let i = 0; i < data?.['company_month_profit_target'].length; i++) {
                revenuePlanTable.find('tfoot .company-row').find(`.sum-m${i+1} .sum-company-m${i+1}-profit`).attr('data-init-money', data?.['company_month_profit_target'][i])
            }
            for (let i = 0; i < data?.['company_quarter_profit_target'].length; i++) {
                revenuePlanTable.find('tfoot .company-row').find(`.sum-q${i+1} .sum-company-q${i+1}-profit`).attr('data-init-money', data?.['company_quarter_profit_target'][i])
            }
            revenuePlanTable.find('tfoot .company-row').find(`.sum-company-year-profit`).attr('data-init-money', data?.['company_year_profit_target'])

            $('#net-income').prop('checked', data?.['profit_target_type'])
            let profit_type = trans_script.attr('data-trans-gross-profit')
            if (data?.['profit_target_type']) {
                profit_type = trans_script.attr('data-trans-net-profit')
            }
            $('.profit-type-span').text(profit_type)

            let data_get_group_emp = []
            for (let i = 0; i < data?.['revenue_plan_group_data'].length; i++) {
                let group_selected = data?.['revenue_plan_group_data'][i]?.['group_mapped']
                let group_month_target = data?.['revenue_plan_group_data'][i]?.['group_month_target']
                let group_quarter_target = data?.['revenue_plan_group_data'][i]?.['group_quarter_target']
                let group_year_target = data?.['revenue_plan_group_data'][i]?.['group_year_target']
                let group_month_profit_target = data?.['revenue_plan_group_data'][i]?.['group_month_profit_target']
                let group_quarter_profit_target = data?.['revenue_plan_group_data'][i]?.['group_quarter_profit_target']
                let group_year_profit_target = data?.['revenue_plan_group_data'][i]?.['group_year_profit_target']
                revenuePlanTable.find('tbody').append(
                    `<tr class="bg-overlay bg-secondary bg-opacity-10" data-row="group-sum-row" data-group-id="${group_selected.id}">
                        <td><span class="text-primary"><b>${group_selected.title}</b></span></td>
                        <td></td>
                        <td>
                            <label class="col-form-label text-primary">${trans_script.attr('data-trans-revenue')}</label>
                            <div class="my-1"></div>
                            <label class="profit-type-span col-form-label text-secondary">${profit_type}</label>
                        </td>
                        <td class="sum-m1">
                            <span class="sum-group-m1 mask-money text-primary" data-init-money="${group_month_target[0]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m1-profit mask-money text-secondary" data-init-money="${group_month_profit_target[0]}"></span>
                        </td>
                        <td class="sum-m2">
                            <span class="sum-group-m2 mask-money text-primary" data-init-money="${group_month_target[1]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m2-profit mask-money text-secondary" data-init-money="${group_month_profit_target[1]}"></span>
                        </td>
                        <td class="sum-m3">
                            <span class="sum-group-m3 mask-money text-primary" data-init-money="${group_month_target[2]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m3-profit mask-money text-secondary" data-init-money="${group_month_profit_target[2]}"></span>
                        </td>
                        <td class="sum-q1">
                            <span class="sum-group-q1 mask-money text-primary" data-init-money="${group_quarter_target[0]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-q1-profit mask-money text-secondary" data-init-money="${group_quarter_profit_target[0]}"></span>
                        </td>
                        <td class="sum-m4">
                            <span class="sum-group-m4 mask-money text-primary" data-init-money="${group_month_target[3]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m4-profit mask-money text-secondary" data-init-money="${group_month_profit_target[3]}"></span>
                        </td>
                        <td class="sum-m5">
                            <span class="sum-group-m5 mask-money text-primary" data-init-money="${group_month_target[4]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m5-profit mask-money text-secondary" data-init-money="${group_month_profit_target[4]}"></span>
                        </td>
                        <td class="sum-m6">
                            <span class="sum-group-m6 mask-money text-primary" data-init-money="${group_month_target[5]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m6-profit mask-money text-secondary" data-init-money="${group_month_profit_target[5]}"></span>
                        </td>
                        <td class="sum-q2">
                            <span class="sum-group-q2 mask-money text-primary" data-init-money="${group_quarter_target[1]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-q2-profit mask-money text-secondary" data-init-money="${group_quarter_profit_target[1]}"></span>
                        </td>
                        <td class="sum-m7">
                            <span class="sum-group-m7 mask-money text-primary" data-init-money="${group_month_target[6]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m7-profit mask-money text-secondary" data-init-money="${group_month_profit_target[6]}"></span>
                        </td>
                        <td class="sum-m8">
                            <span class="sum-group-m8 mask-money text-primary" data-init-money="${group_month_target[7]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m8-profit mask-money text-secondary" data-init-money="${group_month_profit_target[7]}"></span>
                        </td>
                        <td class="sum-m9">
                            <span class="sum-group-m9 mask-money text-primary" data-init-money="${group_month_target[8]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m9-profit mask-money text-secondary" data-init-money="${group_month_profit_target[8]}"></span>
                        </td>
                        <td class="sum-q3">
                            <span class="sum-group-q3 mask-money text-primary" data-init-money="${group_quarter_target[2]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-q3-profit mask-money text-secondary" data-init-money="${group_quarter_profit_target[2]}"></span>
                        </td>
                        <td class="sum-m10">
                            <span class="sum-group-m10 mask-money text-primary" data-init-money="${group_month_target[9]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m10-profit mask-money text-secondary" data-init-money="${group_month_profit_target[9]}"></span>
                        </td>
                        <td class="sum-m11">
                            <span class="sum-group-m11 mask-money text-primary" data-init-money="${group_month_target[10]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m11-profit mask-money text-secondary" data-init-money="${group_month_profit_target[10]}"></span>
                        </td>
                        <td class="sum-m12">
                            <span class="sum-group-m12 mask-money text-primary" data-init-money="${group_month_target[11]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-m12-profit mask-money text-secondary" data-init-money="${group_month_profit_target[11]}"></span>
                        </td>
                        <td class="sum-q4">
                            <span class="sum-group-q4 mask-money text-primary" data-init-money="${group_quarter_target[3]}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-q4-profit mask-money text-secondary" data-init-money="${group_quarter_profit_target[3]}"></span>
                        </td>
                        <td class="sum-year">
                            <span class="sum-group-year mask-money text-primary" data-init-money="${group_year_target}"></span>
                            <div class="my-3"></div>
                            <span class="sum-group-year-profit mask-money text-secondary" data-init-money="${group_year_profit_target}"></span>
                        </td>
                    </tr>`
                )

                let group_employee_valid = data?.['revenue_plan_group_data'][i]?.['employee_target_data']
                let data_get_emp = []
                for (let j = 0; j < group_employee_valid.length; j++) {
                    data_get_emp.push(group_employee_valid[j]?.['id'])
                    let emp_month_target = group_employee_valid[j]?.['emp_month_target']
                    let emp_quarter_target = group_employee_valid[j]?.['emp_quarter_target']
                    let emp_year_target = group_employee_valid[j]?.['emp_year_target']
                    let emp_month_profit_target = group_employee_valid[j]?.['emp_month_profit_target']
                    let emp_quarter_profit_target = group_employee_valid[j]?.['emp_quarter_profit_target']
                    let emp_year_profit_target = group_employee_valid[j]?.['emp_year_profit_target']
                    revenuePlanTable.find('tbody').append(
                        `<tr class="${group_selected.id}">
                            <td></td>
                            <td class="employee-mapped" data-employee-id="${group_employee_valid[j]?.['id']}"><b>${group_employee_valid[j]?.['full_name']}</b></td>
                            <td>
                                <label class="col-form-label text-primary">${trans_script.attr('data-trans-revenue')}</label>
                                <div class="my-1"></div>
                                <label class="profit-type-span col-form-label text-secondary">${profit_type}</label>
                            </td>
                            <td class="mtarget-td" data-type="m1">
                                <input value="${emp_month_target[0]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter1belong m1targetvalue">
                                <input value="${emp_month_profit_target[0]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m1targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m2">
                                <input value="${emp_month_target[1]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter1belong m2targetvalue">
                                <input value="${emp_month_profit_target[1]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m2targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m3">
                                <input value="${emp_month_target[2]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter1belong m3targetvalue">
                                <input value="${emp_month_profit_target[2]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter1belong-profit m3targetvalue-profit">
                            </td>
                            <td class="qtarget-td q1target-td" data-type="q1">
                                <input readonly value="${emp_quarter_target[0]}" data-return-type="number" class="mb-1 mask-money form-control quarter-target q1targetvalue">
                                <input readonly value="${emp_quarter_profit_target[0]}" data-return-type="number" class="net-income-form-control mask-money form-control quarter-target-profit q1targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m4">
                                <input value="${emp_month_target[3]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter2belong m4targetvalue">
                                <input value="${emp_month_profit_target[3]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m4targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m5">
                                <input value="${emp_month_target[4]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter2belong m5targetvalue">
                                <input value="${emp_month_profit_target[4]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m5targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m6">
                                <input value="${emp_month_target[5]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter2belong m6targetvalue">
                                <input value="${emp_month_profit_target[5]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter2belong-profit m6targetvalue-profit">
                            </td>
                            <td class="qtarget-td q2target-td" data-type="q2">
                                <input readonly value="${emp_quarter_target[1]}" data-return-type="number" class="mb-1 mask-money form-control quarter-target q2targetvalue">
                                <input readonly value="${emp_quarter_profit_target[1]}" data-return-type="number" class="net-income-form-control mask-money form-control quarter-target-profit q2targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m7">
                                <input value="${emp_month_target[6]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter3belong m7targetvalue">
                                <input value="${emp_month_profit_target[6]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m7targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m8">
                                <input value="${emp_month_target[7]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter3belong m8targetvalue">
                                <input value="${emp_month_profit_target[7]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m8targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m9">
                                <input value="${emp_month_target[8]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter3belong m9targetvalue">
                                <input value="${emp_month_profit_target[8]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter3belong-profit m9targetvalue-profit">
                            </td>
                            <td class="qtarget-td q3target-td" data-type="q3">
                                <input readonly value="${emp_quarter_target[2]}" data-return-type="number" class="mb-1 mask-money form-control quarter-target q3targetvalue">
                                <input readonly value="${emp_quarter_profit_target[2]}" data-return-type="number" class="net-income-form-control mask-money form-control quarter-target-profit q3targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m10">
                                <input value="${emp_month_target[9]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter4belong m10targetvalue">
                                <input value="${emp_month_profit_target[9]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m10targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m11">
                                <input value="${emp_month_target[10]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter4belong m11targetvalue">
                                <input value="${emp_month_profit_target[10]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m11targetvalue-profit">
                            </td>
                            <td class="mtarget-td" data-type="m12">
                                <input value="${emp_month_target[11]}" data-return-type="number" class="mb-1 mask-money form-control month-target quarter4belong m12targetvalue">
                                <input value="${emp_month_profit_target[11]}" data-return-type="number" class="net-income-form-control mask-money form-control month-target-profit quarter4belong-profit m12targetvalue-profit">
                            </td>
                            <td class="qtarget-td q4target-td" data-type="q4">
                                <input readonly value="${emp_quarter_target[3]}" data-return-type="number" class="mb-1 mask-money form-control quarter-target q4targetvalue">
                                <input readonly value="${emp_quarter_profit_target[3]}" data-return-type="number" class="net-income-form-control mask-money form-control quarter-target-profit q4targetvalue-profit">
                            </td>
                            <td class="ytarget-td" data-type="year">
                                <span class="mask-money text-primary yeartargetvalue" data-init-money="${emp_year_target}"></span>
                                <div class="my-3"></div>
                                <span class="mask-money text-secondary yeartargetvalue-profit" data-init-money="${emp_year_profit_target}"></span>
                            </td>
                        </tr>`
                    )
                }
                data_get_group_emp.push({
                    'group_id': group_selected?.['id'],
                    'employee_planed_list': data_get_emp.sort()
                })
            }

            Disabled(option)

            // $('#btn-update-revenue-plan').prop(
            //     'disabled',
            //     new Date(data?.['period_mapped']?.['start_date']).getFullYear() < new Date().getFullYear()
            // )

            $.fn.initMaskMoney2();

            for (let i = 0; i < data?.['group_mapped_list'].length; i++) {
                let pk = data?.['group_mapped_list'][i]
                let url_loaded = trans_script.attr('data-url-group-detail').replace(0, pk);
                $.fn.callAjax(url_loaded, 'GET').then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            data = data['group'];
                            let employee_planed_list_item = data_get_group_emp.filter(function (item) {
                                return item?.['group_id'] === data?.['id']
                            })[0]
                            let valid_emp = []
                            for (const emp of data?.['group_employee']) {
                                for (const role of emp?.['role']) {
                                    if (revenue_plan_config_list.includes(role?.['id'])) {
                                        valid_emp.push(emp)
                                    }
                                }
                            }
                            NEW_DATA.push({
                                'group_id': data?.['id'],
                                'group_title': data?.['title'],
                                'employee_valid_list': valid_emp
                            })
                            if (employee_planed_list_item?.['employee_planed_list'].length !== valid_emp.length) {
                                group_change_title.push(data?.['title'])
                                group_change_obj.push({
                                    'id': data?.['id'],
                                    'code': data?.['code'],
                                    'title': data?.['title'],
                                })
                                btn_update_group.text(group_change_title.join(', ') + button_group_change_text)
                                $('#notify-change-group').prop('hidden', false)
                            }
                            else {
                                for (const emp of valid_emp) {
                                    if (!employee_planed_list_item?.['employee_planed_list'].includes(emp?.['id'])) {
                                        group_change_title.push(data?.['title'])
                                        group_change_obj.push({
                                            'id': data?.['id'],
                                            'code': data?.['code'],
                                            'title': data?.['title'],
                                        })
                                        btn_update_group.text(group_change_title.join(', ') + button_group_change_text)
                                        $('#notify-change-group').prop('hidden', false)
                                        break
                                    }
                                }
                            }
                        }
                    })
            }
        })
}
