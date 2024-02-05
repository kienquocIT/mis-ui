// declare global scope element
const $transElm = $('#trans-factory')
const $urlElm = $('#url-factory')
const $EmpElm = $('#selectEmployeeInherit')

// return template html dropdown for select2 [FIELD LEAVE_TYPE]
function renderTemplateResult(state) {
    if (!state.id) return state.text
    return $(
        `<p class="d-flex justify-content-normal sl_temp_cont">`
        + `<b>${state?.data?.leave_type?.code}</b>`
        + `<span class="one-row-txt" title="${state?.data?.leave_type?.title}">&nbsp;|&nbsp;&nbsp;${state?.data?.leave_type?.title}&nbsp;${
            state?.data?.leave_type?.code === 'ANPY' ? `(${state?.data?.["open_year"]})` : ''}</span>`
        + `<span class="text-blue">${state?.data?.check_balance ? `(${state?.data.available})` : ''}</span></p>`
    )
}
// return template selected for selects [FIELD LEAVE TYPE]
function renderTemplateSelected(state){
    if (!state.id) return state.text
    return $(`<span>${state.text} ${state?.data?.leave_type.code === 'ANPY' ? `(${state?.data?.["open_year"]})` : ''}</span>`)
}

function ConvertToTotal(data){
    let tempTotal
    const dFrom = new Date(data.date_from.split(' ')[0])// số giờ bắt đầu
    const dTo = new Date(data.date_to.split(' ')[0])// số giờ kết thúc
    tempTotal = Math.abs(
        Math.floor(dTo.getTime() / (3600 * 24 * 1000)) -
        Math.floor(dFrom.getTime() / (3600 * 24 * 1000))
    ) + 1 // cộng 1 cho kết quả vì, khi cộng, phép toán ko tính ngày bắt đầu.
    return tempTotal
}
function filterWorkingDay(){
    const ws = JSON.parse($('#ws_data').text())
    // ds ngày ko làm or làm nửa buồi
    let convert_list = []
    for (let key in ws.working_days){
        const item = ws.working_days[key]
        item.work = !!item?.['work']
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
    if (ws)
        for (let item of ws) {
            lsYear[item["config_year"]] = item["list_holiday"]
        }
    return lsYear
}
function checkHalfDay(item, data, dayMapWs, total){
    if (item === data.date_from){
        if (dayMapWs){
            if (dayMapWs?.['work'])
                if (dayMapWs.mor.to && dayMapWs.mor.from) //nếu làm buổi sáng
                    total -= !data.morning_shift_f ?  1 : 0.5
                else // làm buổi chiều
                    total -= 0.5
            return total
        }
        else if (!data.morning_shift_f) total -= 0.5
        if (item === data.date_to && data.morning_shift_t) total -= 0.5
    }
    else
        if (dayMapWs){
            if (dayMapWs?.['work'])
                if (dayMapWs.mor.to && dayMapWs.mor.from) //nếu làm buổi sáng
                    total -= 1
                else // làm buổi chiều
                    total -= data.morning_shift_t ? 0.5 : 1
            return total
        }
        else if (data.morning_shift_t) total -= 0.5
    return total
}
class detailTab {
    static $tableElm = $('#leave_detail_tbl')

    static PrepareReturn(data) {
        let tempTotal = 0
        if (data.date_from === "Invalid date" || data.date_to === "Invalid date") return tempTotal
        const wsLsConvert = filterWorkingDay()
        const wsLsyear = yearList()

        // quy đổi date range thành tồng ngày
        tempTotal = ConvertToTotal(data)

        // quy đổi date range thành list ngày
        const dateList = dateRangeToList(data)

        for (let item of dateList){
            const day = new Date(item).getDay()
            const dayMapWs = wsLsConvert?.[day];
            // check range ngày nghỉ trong ngày làm việc, nếu ngày nghỉ trùng ngày ko làm => trừ 1 trong tổng ngày
            if (dayMapWs && !dayMapWs?.['work']) tempTotal -= 1

            // check range ngày nghỉ trong ngày holidays
            const year = moment(item).year()
            let isHoliday = false
            if (wsLsyear[year])
                for (let holiday of wsLsyear[year]){
                    // nếu ngày lễ ko trùng ngày nghỉ thì trừ 1 ngày
                    if (item === holiday.holiday_date_to) {
                        if (dayMapWs){
                            if (dayMapWs?.['work']) tempTotal -= 1
                        }else tempTotal -= 1
                        isHoliday = !isHoliday
                        break;
                    }
                    // trừ phép ngày làm nữa buổi và ko phải start/end day
                    if (item !== holiday.holiday_date_to && item !== data.date_from && item !== data.date_to){
                        if (dayMapWs){
                             if (dayMapWs?.['work'] && (!dayMapWs.aft.to || !dayMapWs.aft.from || !dayMapWs.mor.to || !dayMapWs.aft.from)){
                                tempTotal -= 0.5
                                break;
                             }
                        }
                    }
                }
            // check nghỉ nữa ngày
            if ((item === data.date_from || item === data.date_to) && !isHoliday)
                tempTotal = checkHalfDay(item, data, dayMapWs, tempTotal)
        }
        return tempTotal
    }

    static checkIsExp(data) {
        // check available của phép đặc biệt FF, MC, MY
        let code = data['leave_available']?.['leave_type']?.['code']
        let IsExp = true
        if (code && (code === 'AN' || code === 'ANPY')) {
            // check in stock
            IsExp = data.subtotal <= data['leave_available'].available
            // check in exp
            if (new Date().getTime() > new Date(data['leave_available'].expiration_date).getTime()) IsExp = false
        }
        return IsExp
    }
    static validDate(data, row){
        if (data.date_from && data.date_to && data.date_from !== 'Invalid date' &&
            data.date_to !== 'Invalid date') {
            const leave_available = data['leave_available']
            if (!leave_available){
                $.fn.notifyB({description: $transElm.attr('data-empty_leave')}, 'failure')
                return false
            }

            data.subtotal = detailTab.PrepareReturn(data)
            if ((leave_available.check_balance && data.subtotal > leave_available.available) || !detailTab.checkIsExp(data)
                || (['FF', 'MY', 'MC'].includes(leave_available.leave_type.code) && data.subtotal > data['leave_available'].total))
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
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    data: 'leave_available',
                    width: '35%',
                    class: 'child-mt',
                    render: (row, type, data, meta) => {
                        let dataLoad = []
                        if (row && Object.keys(row).length > 0) dataLoad.push(
                            {...row, selected: true}
                        )
                        let html = $(`<select>`).addClass('form-select row_leave-available w-100').attr('name', `leave_available_${meta.row}`).attr('data-zone', 'detail_data')
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
                            meta.row}`).attr('data-zone', 'detail_data').next('label').attr('for', `f_mor_${meta.row}`)
                        html.find('.f_aft').attr('id', `f_aft_${meta.row}`).attr('name', `morning_shift_f_${
                            meta.row}`).attr('data-zone', 'detail_data').next('label').attr('for', `f_aft_${meta.row}`)
                        html.find('.date-picker').attr('name', `date_from_${meta.row}`).attr('value', dateFrom).attr('id', `InputDateFrom_${meta.row}`).attr('data-zone', 'detail_data')
                        html.find(`[name="morning_shift_f_${meta.row}"][value="${data.morning_shift_f}"]`).attr('checked', true).attr('data-zone', 'detail_data')
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
                            meta.row}`).attr('data-zone', 'detail_data').next('label').attr('for', `t_mor_${meta.row}`)
                        html.find('.f_aft').attr('data-zone', 'detail_data').attr('id', `t_aft_${meta.row}`).attr('name', `morning_shift_t_${meta.row}`).next('label').attr('for', `t_aft_${meta.row}`)
                        html.find('.date-picker').attr('name', `date_to_${meta.row}`).attr('id', `InputDateTo_${meta.row}`).attr('value', dateTo).attr('data-zone', 'detail_data')
                        html.find('.spec-date-layout > span').remove()
                        html.find(`[name="morning_shift_t_${meta.row}"][value="${data.morning_shift_t}"]`).attr('checked', true).attr('data-zone', 'detail_data')
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
                        return `<input class="form-control" name="remark_${meta.row}" value="${row}" data-zone="detail_data">`
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
                $('.row_leave-available', row).attr('data-url', $urlElm.attr('data-leave-available'))
                    .attr('data-keyResp', "leave_available")
                    .attr('data-keyText', "leave_type.title")
                    .attr('data-keyId', "id")
                    .initSelect2({
                        "dropdownAutoWidth": true,
                        'dataParams': {employee: $EmpElm.val()},
                        'templateResult': renderTemplateResult,
                        'templateSelection': renderTemplateSelected,
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
                        data.leave_available = e.params.data.data
                        detailTab.validDate(data, row)
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
            autoWidth: true,
            scrollX: true,
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
    let specialStock = {'FF':0, 'MY':0, 'MC':0}
    for (let idx = 0; idx < formData.detail_data.length; idx++){
        const value = formData.detail_data[idx],
            _type = value.leave_available,
            _dateForm = new Date(value.date_from).getTime(),
            _dateTo = new Date(value.date_to).getTime();
        if (value.subtotal > _type.available && _type.check_balance){
            isError = true
            break
        }
        if (['FF', 'MY', 'MC'].includes(_type.leave_type.code)){
            specialStock[_type.leave_type.code] += value.subtotal
            if (specialStock[_type.leave_type.code] > _type.total){
                isError = true
                break
            }
        }

        if (!formData.start_day || _dateForm < new Date(formData.start_day).getTime())
            formData.start_day = value.date_from
        formData.total += value.subtotal
        let nextVal = formData.detail_data[idx + 1]
        if (nextVal) {
            // 1. nếu ngày bắt đầu tiếp theo bé hơn ngày kết thúc hiện tại
            // 2. nếu ngày bắt đầu tiếp theo bằng ngày kết thúc hiện tại, và ca kết thúc hiện tại là chiều,
            // và ca bắt đầu tiếp theo là sáng, và ngày bắt đầu ca chiều trùng ngày kết thúc ca sáng.

            if (new Date(nextVal.date_from).getTime() < _dateTo ||
                (new Date(nextVal.date_from).getTime() === _dateTo && !value.morning_shift_t && nextVal.morning_shift_f) ||
                (_dateForm === _dateTo & !value.morning_shift_f && value.morning_shift_t)
            ){
                errorRequest = true
                break
            }
        }
    }
    formData.request_date = moment($('#inputRequestDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')

    if (isError || errorRequest){
        let turnOffAlert = setInterval(() => {
            if($('.swal2-container').length){
                swal.close();
                clearInterval(turnOffAlert);
            }
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
    WFRTControl.callWFSubmitForm(frm);
}

function employeeTemplate(state) {
    if (!state.id) return state.text
    return $(`<p><span>${state.text}</span> <span class="badge badge-soft-success">${state?.data?.group?.title || '--'}</span></p>`)
}