// declare global scope element
const $transElm = $('#trans-factory')
const $urlElm = $('#url-factory')
const $EmpElm = $('#selectEmployeeInherit')

// return template html dropdown for select2
function renderTemplateResult(state) {
    if (!state.id) return state.text
    return $(
        `<p class="d-flex justify-content-normal sl_temp_cont">`
        + `<b>${state?.data?.leave_type.code}</b>`
        + `<span class="one-row-txt" title="${state?.data?.leave_type.title}">&nbsp;|&nbsp;&nbsp;${state?.data?.leave_type.title}&nbsp;${
            state?.data?.leave_type.code === 'ANPY' ? `(${state?.data?.["open_year"]})` : ''}</span>`
        + `<span class="text-blue">${state?.data?.check_balance ? `(${state?.data.available})` : ''}</span></p>`
    )
}
// return template selected for selects
function renderTemplateSelected(state){
    if (!state.id) return state.text
    return $(`<span>${state.text} ${state?.data?.leave_type.code === 'ANPY' ? `(${state?.data?.["open_year"]})` : ''}</span>`)
}

function ConvertToTotal(data){
    let tempTotal
    const dFrom = new Date(data.date_from)// số giờ bắt đầu
    const dTo = new Date(data.date_to)// số giờ kết thúc
    tempTotal = Math.abs(
        Math.floor(dTo.getTime() / (3600 * 24 * 1000)) -
        Math.floor(dFrom.getTime() / (3600 * 24 * 1000))
    ) + 1 // cộng 1 cho kết quả vì, khi cộng, phép toán ko tính ngày bắt đầu.
    if (!data.morning_shift_f) tempTotal = tempTotal - 0.5
    if (data.morning_shift_t) tempTotal = tempTotal - 0.5
    return tempTotal
}
function filterWorkingDay(){
    const ws = JSON.parse($('#ws_data').text())
    // ds ngày ko làm or làm nửa buồi
    let convert_list = []
    for (let key in ws.working_days){
        const item = ws.working_days[key]
        if (!item?.work ||(!item?.aft.to || !item?.aft.from || !item?.mor.to || !item?.mor.from)) convert_list[key] = item
    }
    return convert_list
}
function dateRangeToList(data){
    // get all date between two date
    let dateList = [];
    let currentDate = new Date(data.date_from);
    const endDate = new Date(data.date_to)
    while (currentDate <= endDate) {
        dateList.push(moment(currentDate).format('YYYY-MM-DD'))
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateList
}
function yearList(){
    let lsYear = {}
    const ws = JSON.parse($('#ws_data').text()).years
    if (ws) for (let item of ws) {
        lsYear[item["config_year"]] = item["list_holiday"]
    }
    return lsYear
}

class detailTab {
    static $tableElm = $('#leave_detail_tbl')

    // - loop trong danh sách ngày làm việc lấy ra các ngày ko làm or làm nửa buổi => wsLsConvert
    // - từ range ngày convert thành list ngày.
    // - check range ngày nghỉ trong ngày làm việc
    //     + loop trong ds ngày nghỉ convert thành "thứ"(2,3,4,5,6,7,cn) cụ thể trong tuần
    //         => loop trong ds ds_da_convert trừ total nếu "thứ" đó có trong ds này.
    // - check range ngày nghỉ trong ngày holidays
    //     + từ range ngày lấy ra năm đăng ký của ds holiday theo năm
    //     + loop trong ds ngày nghỉ convert thành "thứ"(2,3,4,5,6,7,cn) cụ thể trong tuần
    //         => loop trong ds holiday nếu "thứ" trùng vs holiday thì trừ total
    static PrepareReturn(data) {
        let tempTotal = 0
        // $.fn.notifyB({description: $transElm.attr('data-dayoff-error')}, 'failure')
        if (data.date_from === "Invalid date" || data.date_to === "Invalid date") return tempTotal
        const wsLsConvert = filterWorkingDay()
        const wsLsyear = yearList()

        // quy đổi date range thành tồng ngày
        tempTotal = ConvertToTotal(data)

        // quy đổi date range thành list ngày
        const dateList = dateRangeToList(data)

        for (let item of dateList){
            // check range ngày nghỉ trong ngày làm việc
            const day = new Date(item).getDay()
            const dayMapWs = wsLsConvert?.[day];
            if (dayMapWs){
                if (!dayMapWs?.work) tempTotal -= 1
                else if (!dayMapWs?.aft?.to || !dayMapWs?.aft?.from || !dayMapWs?.mor?.to || !dayMapWs?.mor?.from)
                    tempTotal -= 0.5
            }
            // check range ngày nghỉ trong ngày holidays
            const year = moment(item).year()
            if (wsLsyear[year]){
                for (let holiday of wsLsyear[year]){
                    if (item === holiday.holiday_date_to) {
                        const hDay = new Date(holiday.holiday_date_to).getDay()
                        let dayMapWs = wsLsConvert?.[hDay];
                        if (!dayMapWs) tempTotal -= 1
                        else if (!dayMapWs?.aft?.to || !dayMapWs?.aft?.from || !dayMapWs?.mor?.to || !dayMapWs?.mor?.from)
                            tempTotal -= 0.5
                        break;
                    }
                }
            }
        }

        return tempTotal
    }

    static checkIsExp(data) {
        // check available của phép đặc biệt FF, MC, MY
        let code = data?.leave_type?.['leave_type']?.['code']
        let IsExp = true
        if (code && code === 'FF' || code === 'MC' || code === 'MY' || code === 'AN' || code === 'ANPY') {
            // check in stock
            IsExp = data.subtotal <= data?.leave_type.available
            // check in exp
            if (new Date().getTime() > new Date(data.leave_type.expiration_date).getTime()) IsExp = false
        }
        return IsExp
    }
    static validDate(data, row){
        if (data.date_from && data.date_to && data.date_from !== 'Invalid date' &&
            data.date_to !== 'Invalid date') {
            const available = data.leave_type?.['available']
            data.subtotal = detailTab.PrepareReturn(data)
            if (data.subtotal > available && data.leave_type.check_balance || !detailTab.checkIsExp(data))
                $.fn.notifyB({description: $transElm.attr('data-out-of-stock')}, 'failure')

            $('[name*="subtotal_"]', row).val(data.subtotal)
            $(document).trigger("footerCallback");
        }
    }

    static load_table(datalist=[]) {
        detailTab.$tableElm.DataTableDefault({
            data: datalist,
            ordering: false,
            paginate: false,
            info: false,
            columns: [
                {
                    data: 'leave_type',
                    width: '35%',
                    class: 'child-mt',
                    render: (row, type, data, meta) => {
                        let dataLoad = []
                        if (row && Object.keys(row).length > 0) dataLoad.push(
                            {...row, selected: true}
                        )
                        let html = $(`<select>`).addClass('form-select row_leave-type').attr('name', `leave_type_${meta.row}`)
                        if (row && Object.keys(row).length > 0) html.attr('data-onload', JSON.stringify(dataLoad))
                        return html.prop('outerHTML')
                    }
                },
                {
                    data: 'date_from',
                    width: '20%',
                    render: (row, type, data, meta) => {
                        let dateFrom = row
                        if (dateFrom !== '') dateFrom = moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        let html = $(`${$('.date_from').html()}`)
                        html.find('.f_mor').attr('id', `f_mor_${meta.row}`).attr('name', `morning_shift_f_${
                            meta.row}`).next('label').attr('for', `f_mor_${meta.row}`)
                        html.find('.f_aft').attr('id', `f_aft_${meta.row}`).attr('name', `morning_shift_f_${
                            meta.row}`).next('label').attr('for', `f_aft_${meta.row}`)
                        html.find('.date-picker').attr('name', `date_from_${meta.row}`).attr('value', dateFrom).attr('id', `InputDateFrom_${meta.row}`)
                        html.find(`[name="morning_shift_f_${meta.row}"][value="${data.morning_shift_f}"]`).attr('checked', true)
                        return html.prop('outerHTML')
                    }
                },
                {
                    data: 'date_to',
                    width: '20%',
                    render: (row, type, data, meta) => {
                        let dateTo = row
                        if (dateTo !== '') dateTo = moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        let html = $(`${$('.date_from').html()}`)
                        html.find('.f_mor').attr('id', `t_mor_${meta.row}`).attr('name', `morning_shift_t_${
                            meta.row}`).next('label').attr('for', `t_mor_${meta.row}`)
                        html.find('.f_aft').attr('id', `t_aft_${meta.row}`).attr('name', `morning_shift_t_${meta.row}`).next('label').attr('for', `t_aft_${meta.row}`)
                        html.find('.date-picker').attr('name', `date_to_${meta.row}`).attr('id', `InputDateTo_${meta.row}`).attr('value', dateTo)
                        html.find('.spec-date-layout > span').remove()
                        html.find(`[name="morning_shift_t_${meta.row}"][value="${data.morning_shift_t}"]`).attr('checked', true)
                        return html.prop('outerHTML')
                    }
                },
                {
                    data: 'subtotal',
                    width: '5%',
                    class: 'child-mt',
                    render: (row, type, data, meta) => {
                        return `<input type="text" class="form-control" name="subtotal_${meta.row}" readonly value="${
                            JSON.stringify(row)}">`
                    }
                },
                {
                    data: 'remark',
                    width: '15%',
                    class: 'child-mt',
                    render: (row, type, data, meta) => {
                        return `<input class="form-control" name="remark_${meta.row}" value="${row}">`
                    }
                },
                {
                    targets: 6,
                    width: '5%',
                    render: () => {
                        return $('.delete_btn').html()
                    }
                }
            ],
            rowCallback: (row, data, index) => {
                // run date picker after render row
                $('.date-picker', row).daterangepicker({
                    singleDatePicker: true,
                    timepicker: false,
                    showDropdowns: false,
                    minYear: 2023,
                    locale: {
                        format: 'DD/MM/YYYY'
                    },
                    maxYear: parseInt(moment().format('YYYY'), 10),
                })
                    .on('change', function () {
                        // valid và add vào data table
                        if ($(this).attr('name').indexOf('date_from_') > -1) {
                            data.date_from = moment(this.value, 'DD/MM/YYYY').format('YYYY-MM-DD')
                            data.morning_shift_f = JSON.parse($('input[name*="morning_shift_f_"]:checked', row).val())
                        }
                        // valid và add vào data table
                        if ($(this).attr('name').indexOf('date_to_') > -1) {
                            data.date_to = moment(this.value, 'DD/MM/YYYY').format('YYYY-MM-DD')
                            data.morning_shift_t = JSON.parse($('input[name*="morning_shift_t_"]:checked', row).val())
                        }
                        // valid ngày kết thúc lớn hơn ngày bắt đầu
                        if (data.date_from && data.date_to && (new Date(data.date_to) < new Date(data.date_from))) {
                            $.fn.notifyB({description: $transElm.attr('data-err-date')}, 'failure')
                            return false
                        }
                        detailTab.validDate(data, row)
                    })
                if (!data.date_from || !data.date_to) $('.date-picker', row).val('').trigger('change')

                // trigger shift follow by date pick
                $('input[name*="morning_shift_"]', row).on('change', function () {
                    if ($(this).attr('name').indexOf('morning_shift_f_') > -1)
                        data.morning_shift_f = JSON.parse($('input[name*="morning_shift_f_"]:checked', row).val())
                    else
                        data.morning_shift_t = JSON.parse($('input[name*="morning_shift_t_"]:checked', row).val())
                    detailTab.validDate(data, row)
                })

                // load leave type with employee filter
                $('.row_leave-type', row).attr('data-url', $urlElm.attr('data-leave-available'))
                    .attr('data-keyResp', "leave_available")
                    .attr('data-keyText', "leave_type.title")
                    .attr('data-keyId', "id")
                    .initSelect2({
                        'dataParams': {employee: $EmpElm.val()},
                        'templateResult': renderTemplateResult,
                        'templateSelection': renderTemplateSelected,
                        'cache': true,
                        callbackDataResp(resp, keyResp) {
                            let list_result = resp.data[keyResp]
                            list_result.sort((a, b) =>{
                                let aT = a.leave_type.code;
                                let bT = b.leave_type.code;
                                return aT.localeCompare(bT);
                            })
                            return list_result
                        },
                    })
                    .on('select2:select', function (e) {
                        data.leave_type = e.params.data.data
                    })

                // remark trigger on change
                $('input[name*="remark_"]', row).on('blur', function () {
                    data.remark = this.value
                })

                // add index for detail list
                data.order = index

                // delete btn
                $('.btn-remove-row', row).off().on('click', ()=>{
                    detailTab.$tableElm.DataTable().row(row).remove().draw(false)
                })
            },
            footerCallback: function () {
                let api = this.api();
                function handleTotal() {
                    // Total over this page
                    const allStock = api
                        .column(3, {page: 'current'})
                        .data()
                        .reduce(function (a, b) {
                            return a + b;
                        }, 0);
                    // Update footer
                    $(api.column(3).footer()).html(`<p class="pl-3 font-3"><b><i>${allStock}</i></b></p><b><i></i></b>`);
                }

                // first time to draw table
                handleTotal()
                // trigger when change data
                $(document).on("footerCallback", function () {
                    handleTotal()
                })
            },
        })
    }

    static add() {
        let temp = [
            {
                'leave_type': {},
                'date_from': '',
                'morning_shift_f': true,
                'date_to': '',
                'morning_shift_t': false,
                'subtotal': 0,
                'remark': ''
            }
        ]
        detailTab.$tableElm.DataTable().rows.add(temp).draw()
    }

    static get_data() {
        return detailTab.$tableElm.DataTable().data().toArray() || []
    }
}

class TabAvailable {
    static $tableElm = $('#leave_available_tbl')

    static load_table() {
        TabAvailable.$tableElm.DataTableDefault({
            ajax: {
                url: $urlElm.attr('data-leave-available'),
                type: "GET",
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('leave_available')) {
                        let dataList = resp.data['leave_available']
                        dataList.sort(function(a, b) {
                            let nameA = a.leave_type.code
                            let nameB = b.leave_type.code
                            let statement = 0
                            if (nameA < nameB) statement = -1
                            if (nameA > nameB) statement = 1
                            return statement
                        })
                        return dataList
                    }
                    throw Error('Call data raise errors.')
                },
                data: function (a) {
                    a.employee = $('#selectEmployeeInherit').val()
                    // a.check_balance = true
                    return a
                }
            },
            ordering: false,
            paginate: false,
            info: false,
            responsive: true,
            columns: [
                {
                    data: 'leave_type',
                    width: '40%',
                    responsivePriority: 1,
                    render: (row) => {
                        return row?.title ? row?.title : '--'
                    }
                },
                {
                    data: 'open_year',
                    width: '10%',
                    responsivePriority: 2,
                    render: (row) => {
                        return row ? row : '--'
                    }
                },
                {
                    data: 'total',
                    class: 'text-center',
                    width: '10%',
                    render: (row) => {
                        return row !== '' ? row : '--'
                    }
                },
                {
                    data: 'used',
                    class: 'text-center',
                    width: '10%',
                    render: (row) => {
                        return row !== '' ? row : '--'
                    }
                },
                {
                    data: 'available',
                    class: 'text-center',
                    width: '10%',
                    render: (row) => {
                        return row !== '' ? row : '--'
                    }
                },
                {
                    data: 'expiration_date',
                    width: '20%',
                    render: (row) => {
                        return row ? moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY') : '--'
                    }
                }
            ]
        })
    }
}


// Wait employee trigger loaded
// - load detail tab
// - available load
// - enable button add date
// - trigger button add date
$(document).on('Employee.Loaded', function () {

    // run table when page loaded
    let tempData = $('#temp_data_detail')
    const temp = tempData?.text() ? JSON.parse(tempData.text()) : [];
    detailTab.load_table(temp)

    // button click Add Date
    const $AddBtn = $('#add_new_line')
    $AddBtn.prop('disabled', false)
    $AddBtn.off().on('click', () => detailTab.add())

    // after load employee inherit load table leave available
    TabAvailable.load_table()
});

function submitHandleFunc() {
    WindowControl.showLoading();
    const frm = new SetupFormSubmit($FormElm);
    let formData = frm.dataForm;
    if (frm.dataMethod.toLowerCase() === 'post') formData.system_status = 1
    formData.employee_inherit_id = $EmpElm.val()
    formData.detail_data = detailTab.get_data()
    formData.total = 0
    let isError = false
    let errorRequest = false
    for (let idx = 0; idx < formData.detail_data.length; idx++){
        const value = formData.detail_data[idx]
        if (value.subtotal > value.leave_type.available && value.leave_type.check_balance){
            isError = true
            break
        }
        if (!formData.start_day || new Date(value.date_from).getTime() < new Date(formData.start_day).getTime())
            formData.start_day = value.date_from
        formData.total += value.subtotal
        let nextVal = formData.detail_data[idx + 1]
        if (nextVal) {
            if (new Date(nextVal.date_from).getTime() < new Date(value.date_to).getTime()
                || (new Date(nextVal.date_from).getTime() === new Date(value.date_to).getTime()
                    && !value.morning_shift_t && nextVal.morning_shift_f)) {
                errorRequest = true
                break
            }
        }

    }

    formData.request_date = moment($('#inputRequestDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')

    if (isError || errorRequest){
        let turnOffAlert = setInterval(() => {
            WindowControl.hideLoading();
            clearInterval(turnOffAlert);
        }, 500);
        if (isError)
            $.fn.notifyB({description: $transElm.attr('data-out-of-stock')}, 'failure');
        else $.fn.notifyB({description: $transElm.attr('data-err-date-setup')}, 'failure');
        return false
    }
    if (formData.total === 0){
        $.fn.notifyB({description: $transElm.attr('data-detail-tab')}, 'failure');
        return false
    }
    $.fn.callAjax2({
        'url': frm.dataUrl,
        'method': frm.dataMethod,
        'data': formData,
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && (data['status'] === 201 || data['status'] === 200)) {
                $.fn.notifyB({description: $('#base-trans-factory').attr('data-success')}, 'success');
                setTimeout(() => {
                    window.location.replace($FormElm.attr('data-url-redirect'));
                }, 1000);
            }
        }, (err) => {
            setTimeout(() => {
                WindowControl.hideLoading();
            }, 1000)
            $.fn.notifyB({description: err.data.errors}, 'failure');
        }
    )
}

function employeeTemplate(state) {
    if (!state.id) return state.text
    return $(`<p><span>${state.text}</span> - (${state?.data?.group?.title || '--'})</p>`)
}