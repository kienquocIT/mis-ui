$(document).ready(function () {
    const periods_fiscal_year_Ele = $('#periods-fiscal-year')
    const periods_fiscal_month_start_Ele = $('#periods-fiscal-month-start')
    const software_using_time_select = $('#software_using_time_select')
    const software_using_time_select_update = $('#software_using_time_select_update')
    const generate_period_table = $('#generate-period-table')
    const sub_periods_type_select = $('#sub-periods-select')
    const period_title_Ele = $('#periods-title')
    const period_code_Ele = $('#periods-code')
    const period_title_update_Ele = $('#periods-title-update')
    const period_code_update_Ele = $('#periods-code-update')
    const periods_fiscal_year_update_Ele = $('#periods-fiscal-year-update')
    const periods_fiscal_month_start_update_Ele = $('#periods-fiscal-month-start-update')

    function get_option_for_sw_using_time(ele, fiscal_year, fiscal_month_start, selected) {
        ele.html(`<option value="0"></option>`)
        for (let i = 0; i < 12; i++) {
            let month = fiscal_month_start + i
            let year = fiscal_year
            if (month > 12) {
                month -= 12
                year += 1
            }
            if (month < 10) {
                month = '0' + month.toString()
            }
            let option_text = month.toString() + '-' + year.toString()
            if (selected) {
                if (option_text === selected.replace('/', '-')) {
                    ele.append(`
                        <option value="${1}" selected>${option_text}</option>
                    `)
                }
            }
            else {
                ele.append(`
                    <option value="${1}">${option_text}</option>
                `)
            }
        }
    }

    $('#software_using_time_check').on('change', function () {
        if ($(this).prop('checked')) {
            software_using_time_select.prop('disabled', false)
        }
        else {
            software_using_time_select.val(0).prop('disabled', true)
        }
    })

    $('#software_using_time_check_update').on('change', function () {
        if ($(this).prop('checked')) {
            software_using_time_select_update.prop('disabled', false)
        }
        else {
            software_using_time_select_update.val(0).prop('disabled', true)
        }
    })

    periods_fiscal_year_Ele.on('change', function () {
        if (periods_fiscal_year_Ele.val() !== '' && periods_fiscal_month_start_Ele.val() !== '0') {
            software_using_time_select.removeClass('is-invalid').addClass('is-valid')
            get_option_for_sw_using_time(software_using_time_select, parseInt(periods_fiscal_year_Ele.val()), parseInt(periods_fiscal_month_start_Ele.val()))
            let month_data = periods_fiscal_month_start_Ele.val()
            if (periods_fiscal_month_start_Ele.val().length === 1) {
                month_data = 0 + periods_fiscal_month_start_Ele.val()
            }
            $('#periods-start-date').val(`01-${month_data}-${parseInt($(this).val())}`)
        }
        else {
            software_using_time_select.removeClass('is-valid').addClass('is-invalid')
            software_using_time_select.html(`<option value="0"></option>`)
        }
    })

    periods_fiscal_month_start_Ele.on('change', function () {
        if (periods_fiscal_year_Ele.val() !== '' && periods_fiscal_month_start_Ele.val() !== '0') {
            software_using_time_select.removeClass('is-invalid').addClass('is-valid')
            get_option_for_sw_using_time(software_using_time_select, parseInt(periods_fiscal_year_Ele.val()), parseInt(periods_fiscal_month_start_Ele.val()))
            let month_data = periods_fiscal_month_start_Ele.val()
            if (periods_fiscal_month_start_Ele.val().length === 1) {
                month_data = 0 + periods_fiscal_month_start_Ele.val()
            }
            $('#periods-start-date').val(`01-${month_data}-${parseInt(periods_fiscal_year_Ele.val())}`)
        }
        else {
            software_using_time_select.removeClass('is-valid').addClass('is-invalid')
            software_using_time_select.html(`<option value="0"></option>`)
        }
    })

    const TablePeriodsConfig = $('#table-periods-config')

    function loadPeriodsList() {
        TablePeriodsConfig.DataTable().clear().destroy()
        let frm = new SetupFormSubmit(TablePeriodsConfig);
        TablePeriodsConfig.DataTableDefault(
            {
                useDataServer: true,
                rowIdx: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('periods_list')) {
                            console.log(resp.data['periods_list'])
                            return resp.data['periods_list'] ? resp.data['periods_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        className: 'wrap-text',
                        render: () => {
                            return '';
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="badge badge-primary">${row?.['code']}</span>`
                        }
                    },
                    {
                        data: 'subs',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<a href="#" data-period-id="${row?.['id']}" data-state="hidden" class="expand-sub-rows text-secondary">
                                        <script>${JSON.stringify(row?.['subs'])}</script>
                                        <b><i class="fas fa-angle-down"></i></b>
                                    </a>`
                        }
                    },
                    {
                        data: 'period_name',
                        className: 'wrap-text',
                        render: (data, type, row) => {
                            return `<span class="text-secondary"><b>${row?.['title']}</b></span>`
                        }
                    },
                    {
                        data: 'status',
                        className: 'wrap-text',
                        render: (data, type, row,) => {
                            let state = ['Opening', 'Closed']
                            let state_color = ['primary', 'secondary']
                            return `<span class="text-${state_color[row?.['state']]}"><b>${state[row?.['state']]}</b></span>`
                        }
                    },
                    {
                        className: 'from',
                        render: (data, type, row) => {
                            return `<i class="far fa-calendar-alt"></i> <span class="text-secondary">${row?.['subs'][0]?.['start_date']}</span>`
                        }
                    },
                    {
                        className: 'to',
                        render: (data, type, row) => {
                            return `<i class="far fa-calendar-alt"></i> <span class="text-secondary">${row?.['subs'][row?.['subs'].length-1]?.['end_date']}</span>`
                        }
                    },
                    {
                        className: 'action',
                        render: (data, type, row) => {
                            return `<button data-id="${row?.['id']}" data-title="${row?.['title']}" data-code="${row?.['code']}" data-fiscal-year="${row?.['fiscal_year']}" data-space-month="${row?.['space_month']}" data-start-date="${row?.['start_date']}" data-is-sw-start-using-time="${row?.['software_start_using_time']}"
                                            class="btn btn-icon btn-rounded btn-flush-primary edit-periods" type="button" data-bs-toggle="modal" data-bs-target="#modal-periods-update">
                                        <span class="icon"><i class="bi bi-pencil-square"></i></span>
                                    </button>`
                        }
                    }
                ],
            },
        );
    }

    loadPeriodsList()

    $(document).on("click", '.edit-periods', function () {
        let periods_id = $(this).attr('data-id')
        let periods_title = $(this).attr('data-title')
        let periods_code = $(this).attr('data-code')
        let periods_fiscal_year = parseInt($(this).attr('data-fiscal-year'))
        let periods_fiscal_month_start = parseInt($(this).attr('data-space-month')) + 1
        let periods_start_date = $(this).attr('data-start-date')

        if ($(this).attr('data-is-sw-start-using-time') !== 'false') {
            $('#software_using_time_check_update').prop('checked', true)
            software_using_time_select_update.prop('disabled', false)
            get_option_for_sw_using_time(
                software_using_time_select_update,
                periods_fiscal_year,
                periods_fiscal_month_start,
                $(this).attr('data-is-sw-start-using-time')
            )
        }
        else {
            $('#software_using_time_check_update').prop('checked', false)
            software_using_time_select_update.prop('disabled', true)
            software_using_time_select_update.html(`<option value="0"></option>`)
            get_option_for_sw_using_time(
                software_using_time_select_update,
                periods_fiscal_year,
                periods_fiscal_month_start
            )
        }

        $('#form-update-periods-config').attr('data-id', periods_id)
        period_title_update_Ele.val(periods_title)
        period_code_update_Ele.val(periods_code)
        periods_fiscal_year_update_Ele.val(periods_fiscal_year)
        periods_fiscal_month_start_update_Ele.val(periods_fiscal_month_start)
        $('#periods-start-date-update').val(periods_start_date)
    })

    function changeDateFormat(date) {
        return moment(date, "DD-MM-YYYY").format("YYYY-MM-DD");
    }

    function combinesDataPeriodsCreate(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = period_title_Ele.val();
        frm.dataForm['code'] = period_code_Ele.val();
        frm.dataForm['fiscal_year'] = periods_fiscal_year_Ele.val();
        frm.dataForm['start_date'] = changeDateFormat($('#periods-start-date').val());
        frm.dataForm['software_start_using_time'] = $('#software_using_time_select option:selected').text();
        frm.dataForm['sub_periods_type'] = sub_periods_type_select.val()
        frm.dataForm['sub_period_data'] = []
        generate_period_table.find('tbody tr').each(function (index) {
            frm.dataForm['sub_period_data'].push({
                'order': index + 1,
                'code': $(this).find('.code').text(),
                'name': $(this).find('.name').text(),
                'start_date': changeDateFormat($(this).find('.start_date').attr('data-value')),
                'end_date': changeDateFormat($(this).find('.end_date').attr('data-value')),
                'state': 0,
            })
        })

        console.log(frm.dataForm)
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    function combinesDataPeriodsUpdate(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = period_title_update_Ele.val();
        frm.dataForm['code'] = period_code_update_Ele.val();
        frm.dataForm['fiscal_year'] = periods_fiscal_year_update_Ele.val();
        frm.dataForm['start_date'] = $('#periods-start-date-update').val();
        frm.dataForm['software_start_using_time'] = $('#software_using_time_select_update option:selected').text();

        let pk = frmEle.attr('data-id');
        return {
            url: frmEle.attr('data-url').format_url_with_uuid(pk),
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    function combinesDataPeriodsUpdateSub(frmEle, pk, sub_id, state) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['sub_id'] = sub_id;
        frm.dataForm['state'] = state;

        return {
            url: frmEle.attr('data-url').format_url_with_uuid(pk),
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    function get_final_date_of_current_month(filter_year, filter_month) {
        let currentDate = new Date();

        let year = currentDate.getFullYear();

        let nextMonth = currentDate.getMonth() + 1;

        if (filter_year && filter_month) {
            year = filter_year;
            nextMonth = filter_month;
        }

        if (nextMonth > 11) {
            year++;
            nextMonth = 0;
        }

        let firstDayOfNextMonth = new Date(year, nextMonth, 0);

        return firstDayOfNextMonth.getDate();
    }

    period_title_Ele.on('change', function () {
        GeneratePeriodTable()
    })

    period_code_Ele.on('change', function () {
        GeneratePeriodTable()
    })

    periods_fiscal_year_Ele.on('change', function () {
        GeneratePeriodTable()
    })

    periods_fiscal_month_start_Ele.on('change', function () {
        GeneratePeriodTable()
    })

    sub_periods_type_select.on('change', function () {
        GeneratePeriodTable()
    })

    function GeneratePeriodTable() {
        generate_period_table.DataTable().clear().destroy()
        generate_period_table.find('.main-row').remove()
        if (period_title_Ele.val() && period_code_Ele.val() && periods_fiscal_year_Ele.val() && periods_fiscal_month_start_Ele.val() !== '0') {
            let first_month = $(software_using_time_select.find('option')[1]).text()
            let last_month = $(software_using_time_select.find('option')[12]).text()

            let from_value = `01-${first_month}`
            let to_value = `${get_final_date_of_current_month(last_month.split('-')[1], last_month.split('-')[0])}-${last_month}`

            generate_period_table.find('thead').append(`
                <tr class="bg-secondary-light-5 main-row">
                    <td><span class="badge badge-primary">${period_code_Ele.val()}</span></td>
                    <td></td>
                    <td><span class="text-primary">${period_title_Ele.val()}</span></td>
                    <td>Opening</td>
                    <td><i class="far fa-calendar-alt"></i> ${from_value}</td>
                    <td><i class="far fa-calendar-alt"></i> ${to_value}</td>           
                </tr>
            `)

            let key_sub = sub_periods_type_select.val() === '0' ? 'M' :
                sub_periods_type_select.val() === '1' ? 'Q' :
                sub_periods_type_select.val() === '2' ? 'Y' : '';

            for (let i = 0; i < 12; i++) {
                let sub_month = $(software_using_time_select.find('option')[i+1]).text()
                let key_month = sub_month.split('-')[0]
                let key_year = sub_month.split('-')[1]

                generate_period_table.find('tbody').append(`
                    <tr class="sub-periods-row">
                        <td></td>
                        <td><span class="code badge badge-soft-primary">${period_code_Ele.val()}-${key_sub}${key_month}-${key_year}</span></td>
                        <td><span class="name text-primary">${period_code_Ele.val()}-${key_sub}${key_month}-${key_year}</span></td>
                        <td>
                            <div class="btn-group dropdown-sub-group">
                                <button disabled readonly type="button" class="btn btn-soft-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" data-dropdown-animation aria-haspopup="true" aria-expanded="false">
                                    <i class="bi bi-door-open"></i> Open
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item dropdown-sub-action" href="#"><i class="bi bi-door-open"></i> Open</a>
                                    <a class="dropdown-item dropdown-sub-action" href="#"><i class="bi bi-door-closed-fill"></i> Close</a>
                                    <a class="dropdown-item dropdown-sub-action" href="#"><i class="bi bi-lock"></i> Lock</a>
                                </div>
                            </div>                        
                        </td>
                        <td class="start_date" data-value="01-${sub_month}"><i class="far fa-calendar"></i> 01-${sub_month}</td>
                        <td class="end_date" data-value="${get_final_date_of_current_month(key_year, key_month)}-${sub_month}"><i class="far fa-calendar"></i> ${get_final_date_of_current_month(key_year, key_month)}-${sub_month}</td>           
                    </tr>
                `)
            }
            generate_period_table.DataTable( {
                paging: false,
                ordering: false,
                searching: false,
                scrollCollapse: true,
                scrollY: '40vh'
            });
        }
    }

    $(document).on("click", '.expand-sub-rows', function () {
        if ($(this).find('script').text() !== '') {
            if ($(this).attr('data-state') === 'show') {
                $('.sub-periods-row').remove()
                $(this).attr('data-state', 'hidden')
            }
            else {
                $('.sub-periods-row').remove()
                let data_subs = JSON.parse($(this).find('script').text())
                let html = ``
                for (const item of data_subs) {
                    let dropdown_state = item?.['state']
                    let dropdown_text = ['Open', 'Close', 'Lock'][item?.['state']]
                    let dropdown_class = ['bi bi-door-open', 'bi bi-door-closed-fill', 'bi bi-lock'][item?.['state']]
                    let btn_class = ['btn-soft-primary', 'btn-soft-secondary', 'btn-soft-danger'][item?.['state']]

                    html += `<tr class="sub-periods-row">
                                <td></td>
                                <td></td>
                                <td><span class="code badge badge-outline badge-primary">${item?.['code']}</span></td>
                                <td><span class="name text-primary">${item?.['name']}</span></td> 
                                <td>
                                    <div class="btn-group dropdown-sub-group w-50">
                                        <button type="button" data-value="${dropdown_state}" class="btn-state btn ${btn_class} btn-sm dropdown-toggle" data-bs-toggle="dropdown" data-dropdown-animation aria-haspopup="true" aria-expanded="false">
                                            <i class="${dropdown_class}"></i> ${dropdown_text}
                                        </button>
                                        <div class="dropdown-menu" data-period-id="${$(this).attr('data-period-id')}" data-id="${item?.['id']}">
                                            <a data-state="0" class="dropdown-item dropdown-sub-action" href="#"><i class="bi bi-door-open"></i> Open</a>
                                            <a data-state="1" class="dropdown-item dropdown-sub-action" href="#"><i class="bi bi-door-closed-fill"></i> Close</a>
                                            <a data-state="2" class="dropdown-item dropdown-sub-action" href="#"><i class="bi bi-lock"></i> Lock</a>
                                        </div>
                                    </div>                      
                                </td>      
                                <td class="start_date text-primary" data-value="${item?.['start_date']}"><i class="far fa-calendar"></i> ${item?.['start_date']}</td>
                                <td class="end_date text-primary" data-value="${item?.['end_date']}"><i class="far fa-calendar"></i> ${item?.['end_date']}</td>
                                <td></td>
                            </tr>`
                }
                $(this).closest('tr').after(`${html}`)
                $(this).attr('data-state', 'show')
            }
        }
    })

    $(document).on("click", '.dropdown-sub-action', function () {
        Swal.fire({
            html:
                '<span class="mt-3"><i class="fas fa-exclamation-triangle"></i></span>' +
                '<p class="text-secondary">This update may affect inventory activities, still updated?</p>',
            customClass: {
                confirmButton: 'btn btn-outline-primary text-primary',
                cancelButton: 'btn btn-outline-secondary text-secondary',
                container:'swal2-has-bg',
                actions:'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                WindowControl.showLoading();
                let state = $(this).attr('data-state')
                $(this).closest('.dropdown-sub-group').find('.btn-state').attr('data-value', state)
                let frm = $('#form-update-periods-config')
                let period_id = $(this).closest('.dropdown-menu').attr('data-period-id')
                let sub_id = $(this).closest('.dropdown-menu').attr('data-id')
                let notify_des = ''
                let notify_des_state = ['Opened', 'Closed', 'Locked']
                notify_des = `This sub period has ${notify_des_state[parseInt(state)]} successfully.`

                let combinesDataUpdSub = combinesDataPeriodsUpdateSub(frm, period_id, sub_id, state);
                if (combinesDataUpdSub) {
                    $.fn.callAjax2(combinesDataUpdSub).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                WindowControl.hideLoading();
                                Swal.fire({
                                    html:
                                    `<div class="text-center"><h5 class="text-primary">${notify_des}</h5></div>`,
                                    customClass: {
                                        confirmButton: 'btn btn-primary',
                                    },
                                    buttonsStyling: false,
                                })
                                $(this).closest('.dropdown-sub-group').find('.btn-state').html($(this).html())
                                let btn_class = ['btn-soft-primary', 'btn-soft-secondary', 'btn-soft-danger'][parseInt(state)]
                                $(this).closest('.dropdown-sub-group').find('.btn-state').attr('class', `btn-state btn ${btn_class} btn-sm dropdown-toggle`)
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                            setTimeout(
                                () => {
                                    WindowControl.hideLoading();
                                },
                                1000
                            )
                        }
                    )
                }
            }
        })
    })

    $('#form-create-periods-config').submit(function (event) {
        event.preventDefault();
        let combinesDataCre = combinesDataPeriodsCreate($(this));
        if (combinesDataCre) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesDataCre).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        setTimeout(() => {
                            window.location.replace($(this).attr('data-url-redirect'));
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

    $('#form-update-periods-config').submit(function (event) {
        event.preventDefault();
        let combinesDataUpd = combinesDataPeriodsUpdate($(this));
        if (combinesDataUpd) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesDataUpd).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        setTimeout(() => {
                            window.location.replace($(this).attr('data-url-redirect'));
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
});