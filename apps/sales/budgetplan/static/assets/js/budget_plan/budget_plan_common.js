const budgetPlanTitleEle = $('#budget-plan-title')
const budgetPlanPeriodEle = $('#budget-plan-period')
const trans_script = $('#trans-script')
const url_script = $('#url-script')
let IS_DETAIL = false

function getMonthOrder(dtb_id, space_month) {
    for (let i = 0; i < 12; i++) {
        let trans_order = i+1+space_month
        if (trans_order > 12) {
            trans_order -= 12
        }
        $(`#${dtb_id} .m${i+1}th`).text(trans_script.attr(`data-trans-m${trans_order}th`))
    }
}

function LoadPeriod(data) {
    budgetPlanPeriodEle.initSelect2({
        ajax: {
            url: budgetPlanPeriodEle.attr('data-url'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'periods_list',
        keyId: 'id',
        keyText: 'title',
    })
}

function LoadTabCompanyTable(company_budget_data, space_month) {
    let tab_table = $(`
        <table class="table nowrap w-100" id="table-company">
            <thead class="sticky bg-primary-light-5">
            <tr>
                <th class="bg-primary-light-5"></th>
                <th class="bg-primary-light-5 expense-item">${trans_script.attr('data-trans-expense-item')}</th>
                <th class="text-right m1th money-input"></th>
                <th class="text-right m2th money-input"></th>
                <th class="text-right m3th money-input"></th>
                <th class="text-right money-input">${trans_script.attr('data-trans-quarter')} 1</th>
                <th class="text-right m4th money-input"></th>
                <th class="text-right m5th money-input"></th>
                <th class="text-right m6th money-input"></th>
                <th class="text-right money-input">${trans_script.attr('data-trans-quarter')} 2</th>
                <th class="text-right m7th money-input"></th>
                <th class="text-right m8th money-input"></th>
                <th class="text-right m9th money-input"></th>
                <th class="text-right money-input">${trans_script.attr('data-trans-quarter')} 3</th>
                <th class="text-right m10th money-input"></th>
                <th class="text-right m11th money-input"></th>
                <th class="text-right m12th money-input"></th>
                <th class="text-right money-input">${trans_script.attr('data-trans-quarter')} 4</th>
                <th class="text-right money-input">${trans_script.attr('data-trans-year')}</th>
            </tr>
            </thead>
            <tbody></tbody>
        </table>
    `)
    for (const company_data of company_budget_data) {
        let expense_row_ele = $(`<tr>
            <td class="bg-white"><span class="index">${company_data?.['order']}</span></td>
            <td class="bg-white"><span class="fw-bold text-primary expense-item-span"></span></td>
            <td class="text-right"><span class="mask-money money-m1th belong-q1" data-init-money="${company_data?.['company_month_list'][0]}"></td>
            <td class="text-right"><span class="mask-money money-m2th belong-q1" data-init-money="${company_data?.['company_month_list'][1]}"></td>
            <td class="text-right"><span class="mask-money money-m3th belong-q1" data-init-money="${company_data?.['company_month_list'][2]}"></td>
            <td class="text-right"><span class="text-primary mask-money money-q1th belong-year" data-init-money="${company_data?.['company_quarter_list'][0]}"></td>
            <td class="text-right"><span class="mask-money money-m4th belong-q2" data-init-money="${company_data?.['company_month_list'][3]}"></td>
            <td class="text-right"><span class="mask-money money-m5th belong-q2" data-init-money="${company_data?.['company_month_list'][4]}"></td>
            <td class="text-right"><span class="mask-money money-m6th belong-q2" data-init-money="${company_data?.['company_month_list'][5]}"></td>
            <td class="text-right"><span class="text-primary mask-money money-q2th belong-year" data-init-money="${company_data?.['company_quarter_list'][1]}"></td>
            <td class="text-right"><span class="mask-money money-m7th belong-q3" data-init-money="${company_data?.['company_month_list'][6]}"></td>
            <td class="text-right"><span class="mask-money money-m8th belong-q3" data-init-money="${company_data?.['company_month_list'][7]}"></td>
            <td class="text-right"><span class="mask-money money-m9th belong-q3" data-init-money="${company_data?.['company_month_list'][8]}"></td>
            <td class="text-right"><span class="text-primary mask-money money-q3th belong-year" data-init-money="${company_data?.['company_quarter_list'][2]}"></td>
            <td class="text-right"><span class="mask-money money-m10th belong-q4" data-init-money="${company_data?.['company_month_list'][9]}"></td>
            <td class="text-right"><span class="mask-money money-m11th belong-q4" data-init-money="${company_data?.['company_month_list'][10]}"></td>
            <td class="text-right"><span class="mask-money money-m12th belong-q4" data-init-money="${company_data?.['company_month_list'][11]}"></td>
            <td class="text-right"><span class="text-primary mask-money money-q4th belong-year" data-init-money="${company_data?.['company_quarter_list'][3]}"></td>
            <td class="text-right"><span class="text-primary fw-bold mask-money money-year" data-init-money="${company_data?.['company_year']}"></span></td>   
        </tr>`)
        expense_row_ele.find('.expense-item-span').text(company_data?.['expense_item']?.['title'])
        tab_table.append(expense_row_ele)
    }
    $('#table-company').append(tab_table)
    getMonthOrder(`table-company`, space_month)
    $.fn.initMaskMoney2()
}

function LoadTabGroupTable(group_budget_data, space_month, is_lock) {
    $(document.getElementsByClassName('tab-table')).each(function () {
        let tab_table = $(`
            <table class="table nowrap w-100" id="table-${$(this).attr('data-group-id')}">
                <thead class="sticky bg-primary-light-5">
                <tr>
                    <th class="bg-primary-light-5"></th>
                    <th class="bg-primary-light-5 expense-item">${trans_script.attr('data-trans-expense-item')}</th>
                    <th class="text-right m1th money-input"></th>
                    <th class="text-right m2th money-input"></th>
                    <th class="text-right m3th money-input"></th>
                    <th class="text-right money-input">${trans_script.attr('data-trans-quarter')} 1</th>
                    <th class="text-right m4th money-input"></th>
                    <th class="text-right m5th money-input"></th>
                    <th class="text-right m6th money-input"></th>
                    <th class="text-right money-input">${trans_script.attr('data-trans-quarter')} 2</th>
                    <th class="text-right m7th money-input"></th>
                    <th class="text-right m8th money-input"></th>
                    <th class="text-right m9th money-input"></th>
                    <th class="text-right money-input">${trans_script.attr('data-trans-quarter')} 3</th>
                    <th class="text-right m10th money-input"></th>
                    <th class="text-right m11th money-input"></th>
                    <th class="text-right m12th money-input"></th>
                    <th class="text-right money-input">${trans_script.attr('data-trans-quarter')} 4</th>
                    <th class="text-right money-input">${trans_script.attr('data-trans-year')}</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        `)
        for (const group_data of group_budget_data) {
            if (group_data?.['group']?.['id'] === $(this).attr('data-group-id')) {
                for (const expense of group_data?.['data_expense']) {
                    let expense_row_ele = $(`<tr>
                        <td class="bg-white"><span class="index">${expense?.['order']}</span>&nbsp;<button class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs delete-row-btn" ${IS_DETAIL ? 'hidden' : ''}><span class="icon"><i class="far fa-trash-alt"></i></span></button></td>
                        <td class="bg-white"><select ${is_lock ? 'disabled' : ''} class="select2 form-select expense-item-select" ${IS_DETAIL ? 'disabled' : ''}></select></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m1th belong-q1" value="${expense?.['group_month_list'][0]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m2th belong-q1" value="${expense?.['group_month_list'][1]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m3th belong-q1" value="${expense?.['group_month_list'][2]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="text-primary form-control mask-money money-q1th belong-year" value="${expense?.['group_quarter_list'][0]}" readonly></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m4th belong-q2" value="${expense?.['group_month_list'][3]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m5th belong-q2" value="${expense?.['group_month_list'][4]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m6th belong-q2" value="${expense?.['group_month_list'][5]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="text-primary form-control mask-money money-q2th belong-year" value="${expense?.['group_quarter_list'][1]}" readonly></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m7th belong-q3" value="${expense?.['group_month_list'][6]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m8th belong-q3" value="${expense?.['group_month_list'][7]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m9th belong-q3" value="${expense?.['group_month_list'][8]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="text-primary form-control mask-money money-q3th belong-year" value="${expense?.['group_quarter_list'][2]}" readonly></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m10th belong-q4" value="${expense?.['group_month_list'][9]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m11th belong-q4" value="${expense?.['group_month_list'][10]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="form-control mask-money money-m12th belong-q4" value="${expense?.['group_month_list'][11]}" ${IS_DETAIL ? 'readonly' : ''}></td>
                        <td><input ${is_lock ? 'disabled readonly' : ''} class="text-primary form-control mask-money money-q4th belong-year" value="${expense?.['group_quarter_list'][3]}" readonly></td>
                        <td class="text-right"><span class="text-primary fw-bold mask-money money-year" data-init-money="${expense?.['group_year']}"></span></td>   
                    </tr>`)
                    LoadRowExpenseItem(expense_row_ele.find('.expense-item-select'), expense?.['expense_item'])
                    tab_table.append(expense_row_ele)
                }
            }
        }
        $(this).append(tab_table)
        getMonthOrder(`table-${$(this).attr('data-group-id')}`, space_month)
        $.fn.initMaskMoney2()
    })
}

function LoadTabs(group_budget_data, company_budget_data, space_month, is_lock, option) {
    let dataParam = {}
    let ajax = $.fn.callAjax2({
        url: url_script.attr('data-url-group-list'),
        data: dataParam,
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

    Promise.all([ajax]).then(
        (results) => {
            // console.log(results[0])
            // let group_budget_data_id_list = []
            for (const item of group_budget_data) {
                // group_budget_data_id_list.push(item?.['group']?.['id'])
                let group = item?.['group']
                let new_tab = $(`
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="pill" href="#tab_${group?.['code']}">
                            <span class="nav-link-text badge-on-text">${group?.['title']}</span>
                        </a>
                    </li>
                `)
                let row_btn = option === 'update' ? `<div class="row mb-5">
                    <div class="col-6 text-left">
                        <button ${is_lock ? 'disabled' : ''} type="button" class="btn btn-custom btn-light btn-sm btn-add-new-row" data-group-id="${group?.['id']}">
                            <span>
                                <span class="icon"><span class="feather-icon"><i class="fas fa-plus"></i></span></span>
                                <span>${trans_script.attr('data-trans-add-new-row')}</span>
                            </span>
                        </button>
                    </div>
                    <div class="col-6 text-right">
                        <button ${is_lock ? 'disabled' : ''} type="submit" form="tab-budget-${group?.['id']}" class="btn btn-custom btn-sm btn-animated btn-save-tab" style="background-color: #4885e1; color: #f0f0f0" data-group-id="${group?.['id']}">
                            <span>
                                <span class="icon"><span class="feather-icon"><i class="fa-regular fa-floppy-disk"></i></span></span>
                                <span>${trans_script.attr('data-trans-save-tab')}</span>
                            </span>
                        </button>
                    </div>
                </div>` : ''
                let form = `<form class="tab-form" data-method="PUT" data-group-id="${group?.['id']}" id="tab-budget-${group?.['id']}">
                    <div class="col-12 tab-table p-0" data-group-id="${group?.['id']}" style="position: relative; overflow: auto; width: 100%; max-height: 60vh"></div>
                </form>`
                let new_tab_content = $(`
                    <div class="tab-pane fade" id="tab_${group?.['code']}">
                        ${row_btn}
                        <div class="row">
                            ${form}
                        </div>
                    </div>
                `)
                $('.nav-pills').append(new_tab)
                $('.tab-content').append(new_tab_content)

                let pk = $.fn.getPkDetail();
                $(`#tab-budget-${group?.['id']}`).submit(function (event) {
                    event.preventDefault();
                    let combinesData = combinesDataTab($(this));
                    if (combinesData) {
                        WindowControl.showLoading({'loadingTitleAction': 'UPDATE'});
                        $.fn.callAjax2(combinesData)
                            .then(
                                (resp) => {
                                    let data = $.fn.switcherResp(resp);
                                    if (data) {
                                        $.fn.notifyB({description: "Successfully"}, 'success')
                                        setTimeout(() => {
                                            window.location.replace(url_script.attr('data-url-redirect-tab').format_url_with_uuid(pk));
                                            location.reload.bind(location);
                                        }, 1000);
                                    }
                                },
                                (errs) => {
                                    setTimeout(
                                        () => {
                                            WindowControl.hideLoading();
                                        },
                                        1000
                                    )
                                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                                }
                            )
                    }
                })
            }
            LoadTabCompanyTable(company_budget_data, space_month)
            LoadTabGroupTable(group_budget_data, space_month, is_lock)

            // if (results[0].length > group_budget_data.length) {
            //     let all_added_group_title = ''
            //     for (const group of results[0]) {
            //         if (!group_budget_data_id_list.includes(group?.['id'])) {
            //             all_added_group_title += group?.['title'] + ' '
            //         }
            //     }
            //     let raw_text = $('#alert-change').find('.alert-heading').text()
            //     $('#alert-change').find('.alert-heading').text(all_added_group_title + raw_text)
            //     $('#alert-change').prop('hidden', false)
            // }
        })
}

function combinesDataTab(frmEle) {
    let frm = new SetupFormSubmit($(frmEle));

    frm.dataForm['group_id'] = $(frmEle).attr('data-group-id');

    let data_group_budget_plan = []
    $(`#table-${$(frmEle).attr('data-group-id')}`).find('tbody tr').each(function () {
        let row = $(this)
        data_group_budget_plan.push({
            'order': row.find('.index').text(),
            'expense_item_id': row.find('.expense-item-select').val(),
            'group_month_list': [
                row.find('.money-m1th').attr('value'), row.find('.money-m2th').attr('value'), row.find('.money-m3th').attr('value'),
                row.find('.money-m4th').attr('value'), row.find('.money-m5th').attr('value'), row.find('.money-m6th').attr('value'),
                row.find('.money-m7th').attr('value'), row.find('.money-m8th').attr('value'), row.find('.money-m9th').attr('value'),
                row.find('.money-m10th').attr('value'), row.find('.money-m11th').attr('value'), row.find('.money-m12th').attr('value'),
            ],
            'group_quarter_list': [
                row.find('.money-q1th').attr('value'), row.find('.money-q2th').attr('value'),
                row.find('.money-q3th').attr('value'), row.find('.money-q4th').attr('value')
            ],
            'group_year': row.find('.money-year').attr('data-init-money')
        })
    })
    frm.dataForm['data_group_budget_plan'] = data_group_budget_plan;

    // console.log(frm)
    return {
        url: url_script.attr('data-url-update-tab').replace('/0', `/${$.fn.getPkDetail()}`),
        method: 'PUT',
        data: frm.dataForm,
        urlRedirect: url_script.attr('data-url-redirect-tab').replace('/0', `/${$.fn.getPkDetail()}`),
    };
}

function ReloadTableIndex(dtb) {
    dtb.find('tbody tr').each(function (index, ele) {
        $(this).find('td:eq(0) .index').text(index + 1)
    })
}

function LoadRowExpenseItem(ele, data) {
    ele.initSelect2({
        ajax: {
            url: url_script.attr('data-url-row-expense-item'),
            method: 'GET',
        },
        data: (data ? data : null),
        keyResp: 'expense_item_list',
        keyId: 'id',
        keyText: 'title',
    })
}

$(document).on("click", '.btn-add-new-row', function () {
    let group_id = $(this).attr('data-group-id')
    let tab_table = $(document.getElementById(`table-${group_id}`))
    let row = $(`
        <tr>
            <td class="bg-white"><span class="index"></span>&nbsp;<button class="btn btn-icon btn-rounded btn-flush-secondary flush-soft-hover btn-xs delete-row-btn"><span class="icon"><i class="far fa-trash-alt"></i></span></button></td>
            <td class="bg-white"><select class="select2 form-select expense-item-select"></select></td>
            <td class="text-right"><input class="form-control mask-money money-m1th belong-q1" value="0"></td>
            <td class="text-right"><input class="form-control mask-money money-m2th belong-q1" value="0"></td>
            <td class="text-right"><input class="form-control mask-money money-m3th belong-q1" value="0"></td>
            <td class="text-right"><input class="text-primary form-control mask-money money-q1th belong-year" value="0" readonly></td>
            <td class="text-right"><input class="form-control mask-money money-m4th belong-q2" value="0"></td>
            <td class="text-right"><input class="form-control mask-money money-m5th belong-q2" value="0"></td>
            <td class="text-right"><input class="form-control mask-money money-m6th belong-q2" value="0"></td>
            <td class="text-right"><input class="text-primary form-control mask-money money-q2th belong-year" value="0" readonly></td>
            <td class="text-right"><input class="form-control mask-money money-m7th belong-q3" value="0"></td>
            <td class="text-right"><input class="form-control mask-money money-m8th belong-q3" value="0"></td>
            <td class="text-right"><input class="form-control mask-money money-m9th belong-q3" value="0"></td>
            <td class="text-right"><input class="text-primary form-control mask-money money-q3th belong-year" value="0" readonly></td>
            <td class="text-right"><input class="form-control mask-money money-m10th belong-q4" value="0"></td>
            <td class="text-right"><input class="form-control mask-money money-m11th belong-q4" value="0"></td>
            <td class="text-right"><input class="form-control mask-money money-m12th belong-q4" value="0"></td>
            <td class="text-right"><input class="text-primary form-control mask-money money-q4th belong-year" value="0" readonly></td>
            <td class="text-right"><span class="text-primary fw-bold mask-money money-year" data-init-money="0"></span></td>   
        </tr>
    `)
    tab_table.find('tbody').append(row)
    $.fn.initMaskMoney2()
    ReloadTableIndex(tab_table)
    LoadRowExpenseItem(row.find('.expense-item-select'))
})

$(document).on("click", '.delete-row-btn', function () {
    if (!IS_DETAIL) {
        let tab_table = $(this).closest('table')
        $(this).closest('tr').remove()
        ReloadTableIndex(tab_table)
    }
})

$(document).on("change", '.belong-q1', function () {
    let row = $(this).closest('tr')
    let this_quarter = 0
    row.find('.belong-q1').each(function () {
        this_quarter += parseFloat($(this).attr('value'))
    })
    row.find('.money-q1th').attr('value', this_quarter)

    let this_year = 0
    row.find('.belong-year').each(function () {
        this_year += parseFloat($(this).attr('value'))
    })
    row.find('.money-year').attr('data-init-money', this_year)

    $.fn.initMaskMoney2()
})

$(document).on("change", '.belong-q2', function () {
    let row = $(this).closest('tr')
    let this_quarter = 0
    row.find('.belong-q2').each(function () {
        this_quarter += parseFloat($(this).attr('value'))
    })
    row.find('.money-q2th').attr('value', this_quarter)

    let this_year = 0
    row.find('.belong-year').each(function () {
        this_year += parseFloat($(this).attr('value'))
    })
    row.find('.money-year').attr('data-init-money', this_year)

    $.fn.initMaskMoney2()
})

$(document).on("change", '.belong-q3', function () {
    let row = $(this).closest('tr')
    let this_quarter = 0
    row.find('.belong-q3').each(function () {
        this_quarter += parseFloat($(this).attr('value'))
    })
    row.find('.money-q3th').attr('value', this_quarter)

    let this_year = 0
    row.find('.belong-year').each(function () {
        this_year += parseFloat($(this).attr('value'))
    })
    row.find('.money-year').attr('data-init-money', this_year)

    $.fn.initMaskMoney2()
})

$(document).on("change", '.belong-q4', function () {
    let row = $(this).closest('tr')
    let this_quarter = 0
    row.find('.belong-q4').each(function () {
        this_quarter += parseFloat($(this).attr('value'))
    })
    row.find('.money-q4th').attr('value', this_quarter)

    let this_year = 0
    row.find('.belong-year').each(function () {
        this_year += parseFloat($(this).attr('value'))
    })
    row.find('.money-year').attr('data-init-money', this_year)

    $.fn.initMaskMoney2()
})

function Disabled() {
    $('form input').prop('readonly', true).prop('disabled', true)
    $('form select').prop('disabled', true)
}

function LoadDetailBudgetPlan(option, dataParam={}) {
    IS_DETAIL = option === 'detail'
    let pk = $.fn.getPkDetail()
    let url_loaded = $.fn.callAjax2({
        url: url_script.attr('data-url-budget-plan-detail').replace(0, pk),
        data: dataParam,
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('budget_plan_detail')) {
                return data?.['budget_plan_detail'];
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
            // console.log(data)

            budgetPlanTitleEle.val(data?.['title'])
            LoadPeriod(data?.['period_mapped'])

            $('#nav-item-company').prop('hidden', !data?.['company_budget_data']?.['emp_can_view_company'])
            $('#tab_company').prop('hidden', !data?.['company_budget_data']?.['emp_can_view_company'])
            if (data?.['company_budget_data']?.['emp_can_lock_plan']) {
                $('#lock-plan').prop('hidden', data?.['is_lock'])
                $('#unlock-plan').prop('hidden', !data?.['is_lock'])
            }
            else {
                $('#lock-plan').remove()
                $('#unlock-plan').remove()
            }
            $('#locked-noti').prop('hidden', !data?.['is_lock'])

            LoadTabs(data?.['group_budget_data'], data?.['company_budget_data']?.['data_budget'], data?.['period_mapped']?.['space_month'], data?.['is_lock'], option)

            Disabled()

            $.fn.initMaskMoney2();
        })
}

$('#lock-plan').on('click', function () {
    Swal.fire({
        html:
        '<div class="mb-3 text-danger"><i class="fas fa-lock"></i></div><h5 class="text-danger">Lock this budget plan ?</h5>',
        customClass: {
            confirmButton: 'btn btn-outline-secondary text-danger',
            cancelButton: 'btn btn-outline-secondary text-gray',
            container:'swal2-has-bg',
            actions:'w-100'
        },
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            LoadDetailBudgetPlan('detail', {'lock_this_plan': true})
            location.reload(true);
        }
    })
})

$('#unlock-plan').on('click', function () {
    Swal.fire({
        html:
        '<div class="mb-3 text-primary"><i class="fas fa-unlock"></i></div><h5 class="text-primary">Unlock this budget plan ?</h5>',
        customClass: {
            confirmButton: 'btn btn-outline-secondary text-primary',
            cancelButton: 'btn btn-outline-secondary text-gray',
            container:'swal2-has-bg',
            actions:'w-100'
        },
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            LoadDetailBudgetPlan('detail', {'unlock_this_plan': true})
            location.reload(true);
        }
    })
})

// $('#update-group-btn').on('click', function () {
//     if (confirm("Are you sure?")) {
//         let pk = $.fn.getPkDetail()
//         let dataParam = {'update_group': true}
//         let url_loaded = $.fn.callAjax2({
//             url: url_script.attr('data-url-budget-plan-detail').replace(0, pk),
//             data: dataParam,
//             method: 'GET'
//         }).then(
//             (resp) => {
//                 let data = $.fn.switcherResp(resp);
//                 if (data && typeof data === 'object' && data.hasOwnProperty('budget_plan_detail')) {
//                     return data?.['budget_plan_detail'];
//                 }
//                 return {};
//             },
//             (errs) => {
//                 console.log(errs);
//             }
//         )
//         WindowControl.showLoading();
//         Promise.all([url_loaded]).then(
//             (resp) => {
//                 $.fn.notifyB({description: "Successfully"}, 'success')
//                 setTimeout(() => {
//                     window.location.replace(url_script.attr('data-url-redirect-tab').format_url_with_uuid(pk));
//                     location.reload.bind(location);
//                 }, 1000);
//             }
//         )
//     }
// })
