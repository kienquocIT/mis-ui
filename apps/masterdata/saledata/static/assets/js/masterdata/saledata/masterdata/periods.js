$(document).ready(function () {
    const periods_fiscal_year_Ele = $('#periods-fiscal-year')
    const periods_fiscal_month_start_Ele = $('#periods-fiscal-month-start')
    const software_using_time_select_update = $('#software_using_time_select_update')

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
            let option_text = month.toString() + '/' + year.toString()
            if (option_text === selected) {
                ele.append(`
                    <option value="${1}" selected>${option_text}</option>
                `)
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
            $('#software_using_time_select').prop('disabled', false)
        }
        else {
            $('#software_using_time_select').val(0).prop('disabled', true)
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
        if ($(this).val() !== '' && periods_fiscal_month_start_Ele.val() !== '') {
            get_option_for_sw_using_time($('#software_using_time_select'), parseInt(periods_fiscal_year_Ele.val()), parseInt(periods_fiscal_month_start_Ele.val()))
            $('#periods-start-date').val(`${parseInt($(this).val())}-0${parseInt(periods_fiscal_month_start_Ele.val())}-01`)
        }
    })

    periods_fiscal_month_start_Ele.on('change', function () {
        if ($(this).val() !== '' && periods_fiscal_year_Ele.val() !== '') {
            get_option_for_sw_using_time($('#software_using_time_select'), parseInt(periods_fiscal_year_Ele.val()), parseInt(periods_fiscal_month_start_Ele.val()))
            $('#periods-start-date').val(`${parseInt(periods_fiscal_year_Ele.val())}-0${parseInt($(this).val())}-01`)
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
                            return resp.data['periods_list'] ? resp.data['periods_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                columns: [
                    {
                        className: 'wrap-text w-5',
                        render: () => {
                            return '';
                        }
                    },
                    {
                        data: 'code',
                        className: 'wrap-text w-10',
                        render: (data, type, row) => {
                            return `<span class="badge badge-primary">${row?.['code']}</span>`
                        }
                    },
                    {
                        data: 'title',
                        className: 'wrap-text w-30',
                        render: (data, type, row) => {
                            return `<span class="text-primary"><b>${row?.['title']}</b></span>`
                        }
                    },
                    {
                        data: 'fiscal_year',
                        className: 'wrap-text w-20',
                        render: (data, type, row) => {
                            return `<span class="initial-wrap">${row?.['fiscal_year']}</span>`
                        }
                    },
                    {
                        data: 'start_date',
                        className: 'wrap-text w-25',
                        render: (data, type, row,) => {
                            let parsedDate = new Date(row?.['start_date']);
                            let formattedDate = `${parsedDate.getDate().toString().padStart(2, '0')}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getFullYear()}`;
                            return `<span class="initial-wrap">${formattedDate}</span>`
                        }
                    },
                    {
                        className: 'wrap-text w-10 text-center',
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
        $('#periods-title-update').val(periods_title)
        $('#periods-code-update').val(periods_code)
        $('#periods-fiscal-year-update').val(periods_fiscal_year)
        $('#periods-fiscal-month-start-update').val(periods_fiscal_month_start)
        $('#periods-start-date-update').val(periods_start_date)
    })

    function combinesDataPeriodsCreate(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['title'] = $('#periods-title').val();
        frm.dataForm['code'] = $('#periods-code').val();
        frm.dataForm['fiscal_year'] = periods_fiscal_year_Ele.val();
        frm.dataForm['start_date'] = $('#periods-start-date').val();
        frm.dataForm['software_start_using_time'] = $('#software_using_time_select option:selected').text();

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

        frm.dataForm['title'] = $('#periods-title-update').val();
        frm.dataForm['code'] = $('#periods-code-update').val();
        frm.dataForm['fiscal_year'] = $('#periods-fiscal-year-update').val();
        frm.dataForm['start_date'] = $('#periods-start-date-update').val();
        frm.dataForm['software_start_using_time'] = $('#software_using_time_select_update option:selected').text();

        console.log(frm.dataForm)
        let pk = frmEle.attr('data-id');
        return {
            url: frmEle.attr('data-url').format_url_with_uuid(pk),
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

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