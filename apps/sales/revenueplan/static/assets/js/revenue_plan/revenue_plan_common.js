const revenuePlanPeriodEle = $('#revenue-plan-period')
const modalGroupEle = $('#modal-group')
const revenuePlanTable = $('#revenue-plan-table')
let revenue_plan_config_list = []
if ($('#revenue_plan_config').text() !== '') {
    let revenue_plan_config = JSON.parse($('#revenue_plan_config').text());
    for (let i = 0; i < revenue_plan_config[0]['roles_mapped_list'].length; i++) {
        revenue_plan_config_list.push(
            revenue_plan_config[0]['roles_mapped_list'][i]['id']
        )
    }
}
const QUARTER_1 = ['m1', 'm2', 'm3']
const QUARTER_2 = ['m4', 'm5', 'm6']
const QUARTER_3 = ['m7', 'm8', 'm9']
const QUARTER_4 = ['m10', 'm11', 'm12']

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
    this_row.find('.ytarget-td').html(`<span class="mask-money text-primary" data-init-money="${sum_year}"></span>`)

    $.fn.initMaskMoney2()
}

$('#monthly').on('change', function () {
    let readonly1 = 'readonly'
    if ($(this).prop('checked')) {
        readonly1 = ''
    }

    revenuePlanTable.find('.mtarget-td').each(function () {
        $(this).html('')
        let quarter_belong = getQuarterBelong($(this).closest('td').attr('data-type'))
        $(this).append(`<input ${readonly1} value="0" data-return-type="number" class="mask-money form-control month-target ${quarter_belong} ${$(this).closest('td').attr('data-type')}targetvalue">`)
    })

    let readonly2 = 'readonly'
    if ($('#quarterly').prop('checked')) {
        readonly2 = ''
    }
    revenuePlanTable.find('.qtarget-td').each(function () {
        $(this).html('')
        $(this).append(`<input ${readonly2} value="0" data-return-type="number" class="mask-money form-control quarter-target ${$(this).closest('td').attr('data-type')}targetvalue">`)
    })

    $.fn.initMaskMoney2()
})

$('#quarterly').on('change', function () {
    let readonly1 = 'readonly'
    if ($(this).prop('checked')) {
        readonly1 = ''
    }

    revenuePlanTable.find('.qtarget-td').each(function () {
        $(this).html('')
        $(this).append(`<input ${readonly1} value="0" data-return-type="number" class="mask-money form-control quarter-target ${$(this).closest('td').attr('data-type')}targetvalue">`)
    })

    let readonly2 = 'readonly'
    if ($(this).prop('checked')) {
        readonly2 = ''
    }

    revenuePlanTable.find('.mtarget-td').each(function () {
        $(this).html('')
        let quarter_belong = getQuarterBelong($(this).closest('td').attr('data-type'))
        $(this).append(`<input ${readonly2} value="0" data-return-type="number" class="mask-money form-control month-target ${quarter_belong} ${$(this).closest('td').attr('data-type')}targetvalue">`)
    })

    $.fn.initMaskMoney2()
})

$(document).on("change", '.month-target', function () {
    calculatePlan($(this).closest('tr'))
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
            if (!isNaN($(this).find('.ytarget-td span').attr('data-init-money'))) {
                sum_year += parseFloat($(this).find('.ytarget-td span').attr('data-init-money'))
            }
        })

        for (let i = 0; i < 12; i++) {
            $(this).find(`.sum-m${i+1}`).html(`<span class="sum-group-m${i+1} mask-money text-primary" data-init-money="${sum_m[i]}"></span>`)
        }
        for (let i = 0; i < 4; i++) {
            $(this).find(`.sum-q${i+1}`).html(`<span class="sum-group-q${i+1} mask-money text-primary" data-init-money="${sum_q[i]}"></span>`)
        }
        $(this).find('.sum-year').html(`<span class="sum-group-year mask-money text-primary" data-init-money="${sum_year}"></span>`)
    })

    let sum_month_target_company = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let sum_quarter_target_company = [0, 0, 0, 0]
    let sum_year_target_company = 0

    for (let i = 0; i < 12; i++) {
        revenuePlanTable.find(`.sum-group-m${i + 1}`).each(function () {
            if ($(this).attr('data-init-money')) {
                sum_month_target_company[i] += parseFloat($(this).attr('data-init-money'))
            }
        })
    }

    for (let i = 0; i < 4; i++) {
        revenuePlanTable.find(`.sum-group-q${i + 1}`).each(function () {
            if ($(this).attr('data-init-money')) {
                sum_quarter_target_company[i] += parseFloat($(this).attr('data-init-money'))
            }
        })
    }

    revenuePlanTable.find('.sum-group-year').each(function () {
        if ($(this).attr('data-init-money')) {
            sum_year_target_company += parseFloat($(this).attr('data-init-money'))
        }
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

function UpdateTablePlan(group_employee_list, group_selected) {
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
                <td class="sum-m1"></td>
                <td class="sum-m2"></td>
                <td class="sum-m3"></td>
                <td class="sum-q1"></td>
                <td class="sum-m4"></td>
                <td class="sum-m5"></td>
                <td class="sum-m6"></td>
                <td class="sum-q2"></td>
                <td class="sum-m7"></td>
                <td class="sum-m8"></td>
                <td class="sum-m9"></td>
                <td class="sum-q3"></td>
                <td class="sum-m10"></td>
                <td class="sum-m11"></td>
                <td class="sum-m12"></td>
                <td class="sum-q4"></td>
                <td class="sum-year"></td>
            </tr>`
        )
        for (let i = 0; i < group_employee_valid.length; i++) {
            revenuePlanTable.find('tbody').append(
                `<tr class="${group_selected.id}">
                    <td></td>
                    <td class="employee-mapped" data-employee-id="${group_employee_valid[i]?.['id']}">${group_employee_valid[i]?.['full_name']}</td>
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
                $(this).html('')
                let quarter_belong = getQuarterBelong($(this).closest('td').attr('data-type'))
                $(this).append(`<input value="0" data-return-type="number" class="mask-money form-control month-target ${quarter_belong} ${$(this).closest('td').attr('data-type')}targetvalue">`)
            })
            revenuePlanTable.find('.qtarget-td').each(function () {
                $(this).html('')
                $(this).append(`<input readonly value="0" data-return-type="number" class="mask-money form-control quarter-target ${$(this).closest('td').attr('data-type')}targetvalue">`)
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
                }
            })
        $('#add-group-plan-modal').modal('hide')
    }
    else {
        $.fn.notifyB({description: "No group has been selected"}, 'warning')
    }
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
        frm.dataForm['company_month_target'] = []
        for (let i = 0; i < 12; i++) {
            frm.dataForm['company_month_target'].push(
                parseFloat($(`.sum-company-m${i+1}`).attr('data-init-money'))
            )
        }
        frm.dataForm['company_quarter_target'] = []
        for (let i = 0; i < 4; i++) {
            frm.dataForm['company_quarter_target'].push(
                parseFloat($(`.sum-company-q${i+1}`).attr('data-init-money'))
            )
        }
        frm.dataForm['company_year_target'] = parseFloat($('.sum-company-year').attr('data-init-money'))

        frm.dataForm['RevenuePlanGroup_data'] = []
        for (let i = 0; i < frm.dataForm['group_mapped_list'].length; i++) {
            let group_month_target = []
            for (let j = 0; j < 12; j++) {
                group_month_target.push(
                    parseFloat(
                        revenuePlanTable.find(
                            `tbody tr[data-group-id="${frm.dataForm['group_mapped_list'][i]}"] .sum-group-m${j+1}`
                        ).attr('data-init-money')
                    )
                )
            }
            let group_quarter_target = []
            for (let j = 0; j < 4; j++) {
                group_quarter_target.push(
                    parseFloat(
                        revenuePlanTable.find(
                            `tbody tr[data-group-id="${frm.dataForm['group_mapped_list'][i]}"] .sum-group-q${j+1}`
                        ).attr('data-init-money')
                    )
                )
            }
            let group_year_target = parseFloat(
                revenuePlanTable.find(
                    `tbody tr[data-group-id="${frm.dataForm['group_mapped_list'][i]}"] .sum-group-year`
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
                'employee_mapped_list': employee_mapped_list
            })
        }

        frm.dataForm['RevenuePlanGroupEmployee_data'] = []
        for (let i = 0; i < frm.dataForm['group_mapped_list'].length; i++) {
            let emp_target_list = []
            revenuePlanTable.find(`tbody tr[class="${frm.dataForm['group_mapped_list'][i]}"]`).each(function (){
                let emp_month_target = []
                for (let j = 0; j < 12; j++) {
                    emp_month_target.push(
                        parseFloat(
                            revenuePlanTable.find(
                                `tbody tr[class="${frm.dataForm['group_mapped_list'][i]}"] .m${j+1}targetvalue`
                            ).attr('value')
                        )
                    )
                }
                let emp_quarter_target = []
                for (let j = 0; j < 4; j++) {
                    emp_quarter_target.push(
                        parseFloat(
                            revenuePlanTable.find(
                                `tbody tr[class="${frm.dataForm['group_mapped_list'][i]}"] .q${j+1}targetvalue`
                            ).attr('value')
                        )
                    )
                }
                let emp_year_target = parseFloat(revenuePlanTable.find(
                    `tbody tr[class="${frm.dataForm['group_mapped_list'][i]}"] .ytarget-td span`
                ).attr('data-init-money'))
                emp_target_list.push({
                    'revenue_plan_group_mapped_id': frm.dataForm['group_mapped_list'][i],
                    'employee_mapped_id': $(this).find('td[class="employee-mapped"]').attr('data-employee-id'),
                    'emp_month_target': emp_month_target,
                    'emp_quarter_target': emp_quarter_target,
                    'emp_year_target': emp_year_target
                })
            })

            frm.dataForm['RevenuePlanGroupEmployee_data'] = emp_target_list
        }

        console.log(frm.dataForm)
        if (for_update) {
            let pk = $.fn.getPkDetail();
            return {
                url: frmEle.attr('data-url-detail').format_url_with_uuid(pk),
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
