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

async function filterWorkingDay(data, dateRequest){
    const params = {
        'employee_id': $('#selectEmployeeInherit').val(),
    }
    if (data.date_from === data.date_to)
        params['date'] = data.date_from
    else {
        params['date__gte'] = data.date_from
        params['date__lte'] = data.date_to
    }
    const getData = await $.fn.callAjax2({
        url: $('#url-factory').attr('data-shift-assignment'),
        data: params,
    })
    let ws = []
    let res = $.fn.switcherResp(getData)
    if ([200, 201].indexOf(res.status) !== -1) {
        ws = res?.['shift_assignment_list']
    }
    let work_shift = {}
    for (const key in ws) {
        const item = ws[key]
        const date_shift = item.shift
        work_shift[item.date] = {
            ...item,
            'work': true,
            'only_all_day': false,
        }
        if (!date_shift?.['break_in_time'] && !date_shift?.['break_out_time']) {
            work_shift[item.date]['only_all_day'] = true
        }
    }
    if (Object.keys(work_shift).length !== dateRequest.length){
        const tempNew = {}
        for (const dateStr of dateRequest){
            if (!work_shift?.[dateStr]) tempNew[dateStr] = {'work': false}
        }
        work_shift = {...work_shift, ...tempNew}
    }
    // trả về danh sách full ngày nào làm nửa buổi thì need_all = true
    return work_shift
}

function yearList(){
    let lsYear = {};
    const $elmWs = $('#ws_data')
    const ws = $elmWs.text().length ? JSON.parse($elmWs.text())?.['years'] : []
    if (ws && ws.length)
        for (let item of ws) {
            lsYear[item["config_year"]] = item["list_holiday"]
        }
    return lsYear
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

class detailTab {
    constructor(data) {
        this.user_data = {};
        this.$tableElm = $('#leave_detail_tbl');
        this.$transElm = $('#trans-factory')
        this.load_table(data)
    }

    async PrepareReturn(data) {
        let tempTotal = 0;
        if (data.date_from === "Invalid date" || data.date_to === "Invalid date") return tempTotal
        const wsLsyear = yearList()

        // quy đổi date range thành tồng ngày
        tempTotal = ConvertToTotal(data)
        // quy đổi date range thành list ngày
        const dateList = dateRangeToList(data)

        const wsLsConvert = await filterWorkingDay(data, dateList)

        for (let item of dateList){
            const dayMapWs = wsLsConvert?.[item] || null;
            // nếu ngày nghỉ ko có ca => trừ 1 trong tổng ngày
            if (!dayMapWs.work){
                tempTotal -= 1
                continue
            }

            // check range ngày nghỉ trong ngày holidays
            const year = moment(item).year()
            let isHoliday = false
            if (wsLsyear[year]){
                for (let holiday of wsLsyear[year]){
                    if (item === holiday.holiday_date_to) {
                        tempTotal -= 1
                        isHoliday = !isHoliday
                        break;
                    }
                }
            }
            // ngày nghỉ ko phải ngày lễ và có ca
            if (!isHoliday && dayMapWs.work){
                // nghỉ nửa buổi và ngày bắt đầu và ngày kết thúc bằng nhau
                if((data?.['first_half'] || data?.['second_half']) && data.date_from === data.date_to){
                    tempTotal -= 0.5
                    continue
                }
                else if ((data?.['first_half'] || data?.['second_half']) && data.date_from !== data.date_to){
                    let mess = $.fn.gettext('Please select All day')
                    if(data.date_from !== data.date_to)
                        mess = $.fn.gettext('Please ensure the start and end dates match')
                    $.fn.notifyB({
                        'description': mess
                    }, 'failure')
                    return false
                }
            }
        }

        if (!data.all_day
            && (new Date(data.date_to) !== new Date(data.date_from))
            && wsLsConvert[data.date_to]?.['only_all_day']
        ) { // nếu ko chọn all day và ngày bắt đầu ko bằng ngày kết thúc và ngày này chỉ có thể nghỉ nguyên ngày
            $.fn.notifyB({
                description: $.fn.gettext('Please select All day or ensure the start and end dates match')
            }, 'failure')
            return false
        }
        return tempTotal
    }

    checkIsExp(data) {
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

    async validDate(data, row){
        const _this = this;
        if (data.date_from && data.date_to && data.date_from !== 'Invalid date' &&
            data.date_to !== 'Invalid date') {
            const leave_available = data['leave_available']
            if (!leave_available){
                $.fn.notifyB({description: this.$transElm.attr('data-empty_leave')}, 'failure')
                return false
            }

            data.subtotal = await _this.PrepareReturn(data)
            if ((leave_available.check_balance && data.subtotal > leave_available.available)
                || !_this.checkIsExp(data)
                || (['FF', 'MY', 'MC'].includes(leave_available.leave_type.code) && data.subtotal > data['leave_available'].total)
            )
                $.fn.notifyB({description: this.$transElm.attr('data-out-of-stock')}, 'failure')

            if  (!data.subtotal) data.subtotal = 0
            $('input[name*="subtotal_"]', row).val(data.subtotal)
            $(document).trigger("footerCallback");
        }
    }

    load_table(datalist=[]) {
        const _this = this;
        const _tbl = this.$tableElm.DataTableDefault({
            data: datalist,
            ordering: false,
            paginate: false,
            info: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    data: 'leave_available',
                    width: '30%',
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
                    width: '25%',
                    render: (row, type, data, meta) => {
                        let dateFrom = row
                        if (dateFrom !== '') dateFrom = moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        let html = $(`${$('.date_from').html()}`)
                        html.find('.all_day')
                            .attr('id', `all_${meta.row}`)
                            .attr('name', `day_shift_${meta.row}`)
                            .attr('data-zone', 'detail_data')
                            .next('label').attr('for', `all_${meta.row}`)

                        html.find('.first_half')
                            .attr('id', `first_${meta.row}`)
                            .attr('name', `day_shift_${meta.row}`)
                            .attr('data-zone', 'detail_data')
                            .next('label').attr('for', `first_${meta.row}`)

                        html.find('.second_half')
                            .attr('id', `second_${meta.row}`)
                            .attr('name', `day_shift_${meta.row}`)
                            .attr('data-zone', 'detail_data')
                            .next('label').attr('for', `second_${meta.row}`)

                        html.find('.date-picker')
                            .attr('name', `date_from_${meta.row}`)
                            .attr('value', dateFrom)
                            .attr('id', `InputDateFrom_${meta.row}`)
                            .attr('data-zone', 'detail_data')
                        let nameIptTrue = `.all_day`
                        if (data?.['first_half']) nameIptTrue = `.first_half`
                        if (data?.['second_half']) nameIptTrue = `.second_half`
                        html.find(`${nameIptTrue}[name="day_shift_${meta.row}"]`)
                            .attr('checked', true)
                        return html.prop('outerHTML')
                    }
                },
                {
                    data: 'date_to',
                    width: '20%',
                    class: 'child-mt',
                    render: (row, type, data, meta) => {
                        let dateTo = row
                        if (dateTo !== '') dateTo = moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY')
                        let html = `<div class="form-group spec-date-layout mb-0">`
                            + `<div class="input-affix-wrapper">`
                            + `<input type="text" name="date_to_${meta.row}" value="${dateTo}" id="InputDateFrom_$${
                                meta.row}" class="form-control date-picker" autocomplete="off" data-zone="detail_data">`
                            + `<span class="input-suffix"><i class="fa-solid fa-calendar-days"></i></span></div></div>`
                        return html
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
                    autoApply: true,
                    timepicker: false,
                    showDropdowns: false,
                    minYear: 2023,
                    locale: {
                        format: 'DD/MM/YYYY'
                    },
                    maxYear: parseInt(moment().format('YYYY'), 10),
                })
                if (!data.date_from || !data.date_to) $('.date-picker', row).val('').trigger('change')

                // load leave type with employee filter
                $('.row_leave-available', row).attr('data-url', $('#url-factory').attr('data-leave-available'))
                    .attr('data-keyResp', "leave_available")
                    .attr('data-keyText', "leave_type.title")
                    .attr('data-keyId', "id")
                    .initSelect2({
                        "dropdownAutoWidth": true,
                        'dataParams': {employee: $('#selectEmployeeInherit').val()},
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

                // remark trigger on change
                $('input[name*="remark_"]', row).on('blur', function () {
                    data.remark = this.value
                })

                // add index for detail list
                data.order = index

                // delete btn
                $('.btn-remove-row', row).off().on('click', ()=>{
                    _this.$tableElm.DataTable().row(row).remove().draw(false)
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

        _tbl.on('change', 'tbody input.date-picker', async function() {
            let td = _tbl.cell($(this).closest('td'));
            let data = _tbl.row(td[0][0].row).data();
            // valid và add vào data table
            if ($(this).attr('name').indexOf('date_from_') > -1) {
                data.date_from = moment(this.value, 'DD/MM/YYYY').format('YYYY-MM-DD')
            }
            // valid và add vào data table
            if ($(this).attr('name').indexOf('date_to_') > -1) {
                data.date_to = moment(this.value, 'DD/MM/YYYY').format('YYYY-MM-DD')
            }
            const elmChecked = $(`input[name="day_shift_${td[0][0].row}"]:checked`).val()
            data.all_day = elmChecked === 'all';
            data.first_half = elmChecked === 'first';
            data.second_half = elmChecked !== 'all' && elmChecked !== 'first';
            // valid ngày kết thúc lớn hơn ngày bắt đầu
            if (data.date_from && data.date_to && (new Date(data.date_to) < new Date(data.date_from))) {
                $.fn.notifyB({description: _this.$transElm.attr('data-err-date')}, 'failure')
                return false
            }
            if (data.date_to && data.date_from && data.leave_available)
                await _this.validDate(data, _tbl.row(td[0][0].row).node())
        })

        _tbl.on('select2:select', 'tbody select[name*="leave_available_"]', async function(e){
            let td = _tbl.cell($(this).closest('td'));
            let data = _tbl.row(td[0][0].row).data();
            data.leave_available = e.params.data.data
            if (data.date_to && data.date_from && data.leave_available)
                await _this.validDate(data, _tbl.row(td[0][0].row).node())
        })

        _tbl.on('change', 'input[name*="day_shift_"]', async function () {
            let td = _tbl.cell($(this).closest('td'));
            let data = _tbl.row(td[0][0].row).data();
            // valid và add vào data table
            const elmChecked = this.value
            data.all_day = elmChecked === 'all';
            data.first_half = elmChecked === 'first';
            data.second_half = elmChecked !== 'all' && elmChecked !== 'first';
            if (data.date_to && data.date_from && data.leave_available)
                await _this.validDate(data, _tbl.row(td[0][0].row).node())
        })
    }

    add() {
        let temp = [
            {
                'leave_type': {},
                'date_from': '',
                'all_day': true,
                'first_half': false,
                'date_to': '',
                'second_half': false,
                'subtotal': 0,
                'remark': ''
            }
        ]
        this.$tableElm.DataTable().rows.add(temp).draw()
    }
}

class TabAvailable {
    static $tableElm = $('#leave_available_tbl')

    static load_table() {
        TabAvailable.$tableElm.DataTableDefault({
            ajax: {
                url: $('#url-factory').attr('data-leave-available'),
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
    let tempData = $('#temp_data_detail')  // get data task
    const temp = tempData?.text() ? JSON.parse(tempData.text()) : [];
    let dtTab = new detailTab(temp)

    // button click Add Date
    const $AddBtn = $('#add_new_line')
    $AddBtn.prop('disabled', false)
    $AddBtn.off().on('click', () => dtTab.add())

    // after load employee inherit load table leave available
    TabAvailable.load_table();
});

function submitHandleFunc() {
    const frm = new SetupFormSubmit($('#leave_form'));
    let formData = frm.dataForm;
    if (frm.dataMethod.toLowerCase() === 'post') formData.system_status = 1
    formData.employee_inherit_id = formData.employee_inherit
    formData.detail_data = $('#leave_detail_tbl').DataTable().data().toArray()
    formData.total = 0
    let isError = false
    let errorRequest = false
    let errorRow = false
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
        if (value.subtotal === 0){
            errorRow = true
            break
        }
        formData.total += value.subtotal
        let nextVal = formData.detail_data[idx + 1]
        if (nextVal) {
            // 1. nếu ngày bắt đầu tiếp theo bé hơn ngày kết thúc trả về lỗi
            const _nextFrom = new Date(nextVal.date_from).getTime()
            if (_nextFrom < _dateTo) {
                errorRequest = true
                break
            }
        }
    }
    formData.request_date = moment($('#inputRequestDate').val(), 'DD/MM/YYYY').format('YYYY-MM-DD')

    if (isError || errorRequest || errorRow){
        let turnOffAlert = setInterval(() => {
            if($('.swal2-container').length){
                swal.close();
                clearInterval(turnOffAlert);
            }
        }, 500);
        if (isError)
            $.fn.notifyB({description: $.fn.gettext('Not enough leave or no leave available')}, 'failure');
        else if (errorRequest)
            $.fn.notifyB({description: $.fn.gettext('Ordinal date in detail tab is in complex setup')}, 'failure');
        else
            $.fn.notifyB({description: $.fn.gettext('The date list has a row with missing details')}, 'failure');
        return false
    }
    if (formData.total === 0){
        $.fn.notifyB({description: $.fn.gettext('Total day off is 0 please verify again')}, 'failure');
        return false
    }
    frm.dataForm = formData
    WFRTControl.callWFSubmitForm(frm);
}

function employeeTemplate(state) {
    if (!state.id) return state.text
    return $(`<p><span>${state.text}</span> <span class="badge badge-soft-success">${state?.data?.group?.title || '--'}</span></p>`)
}