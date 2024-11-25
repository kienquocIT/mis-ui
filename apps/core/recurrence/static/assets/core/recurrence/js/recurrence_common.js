// Load data
class RecurrenceLoadDataHandle {
    static $form = $('#frm_recurrence_create');
    static $title = $('#title');
    static $boxStatus = $('#box-status') ;
    static $boxApp = $('#box-app') ;
    static $boxDocTem = $('#box-doc-template') ;
    static $boxPeriod = $('#box-period') ;
    static $boxRepeat = $('#box-repeat') ;
    static $periodArea = $('#period-area') ;
    static $dateRecurrenceDaily = $('#date-recurrence-daily');
    static $dateRecurrenceYearly = $('#date-recurrence-yearly');
    static $boxDateWeekly = $('#box-date-recurrence-weekly');
    static $boxDateMonthly = $('#box-date-recurrence-monthly');
    static $dateStart = $('#date-start');
    static $dateEnd = $('#date-end');
    static $dateNext = $('#date-next');

    static $trans = $('#app-trans-factory');
    static $urls = $('#app-urls-factory');
    static dataStatus = [
        {'id': 0, 'title': RecurrenceLoadDataHandle.$trans.attr('data-active')},
        {'id': 1, 'title': RecurrenceLoadDataHandle.$trans.attr('data-expired')},
    ];
    static dataPeriod = [
        {'id': '', 'title': 'Select...',},
        {'id': 1, 'title': RecurrenceLoadDataHandle.$trans.attr('data-daily')},
        {'id': 2, 'title': RecurrenceLoadDataHandle.$trans.attr('data-weekly')},
        {'id': 3, 'title': RecurrenceLoadDataHandle.$trans.attr('data-monthly')},
        {'id': 4, 'title': RecurrenceLoadDataHandle.$trans.attr('data-yearly')},
    ];
    static dataRepeat = {
        '1': [
            {'id': '', 'title': 'Select...',},
        ],
        '2': [
            {'id': '', 'title': 'Select...',},
        ],
        '3': [
            {'id': '', 'title': 'Select...',},
        ],
        '4': [
            {'id': '', 'title': 'Select...',},
        ]
    };
    static dataDateRecurrenceWeekly = [
        {'id': 0, 'title': RecurrenceLoadDataHandle.$trans.attr('data-sunday')},
        {'id': 1, 'title': RecurrenceLoadDataHandle.$trans.attr('data-monday')},
        {'id': 2, 'title': RecurrenceLoadDataHandle.$trans.attr('data-tuesday')},
        {'id': 3, 'title': RecurrenceLoadDataHandle.$trans.attr('data-wednesday')},
        {'id': 4, 'title': RecurrenceLoadDataHandle.$trans.attr('data-thursday')},
        {'id': 5, 'title': RecurrenceLoadDataHandle.$trans.attr('data-friday')},
        {'id': 6, 'title': RecurrenceLoadDataHandle.$trans.attr('data-saturday')},
    ];
    static dataDateRecurrenceMonthly = [
        {'id': '', 'title': 'Select...',},
    ];
    static appMapUrl = {
        'saleorder.saleorder': {
            'url': RecurrenceLoadDataHandle.$urls.attr('data-sale-order'),
            'keyResp': "sale_order_recurrence",
        },
    }

    static loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
        let opts = {'allowClear': isClear};
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }
        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = `<span class="badge badge-soft-primary mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

    static loadInitPage() {
        // data
        for (let i = 1; i <= 6; i++) {
            RecurrenceLoadDataHandle.dataRepeat["1"].push({
                    'id': i,
                    'title': `${i} ${RecurrenceLoadDataHandle.$trans.attr('data-day')}`
                })
        }
        for (let i = 1; i <= 3; i++) {
            RecurrenceLoadDataHandle.dataRepeat["2"].push({
                    'id': i,
                    'title': `${i} ${RecurrenceLoadDataHandle.$trans.attr('data-week')}`
                })
        }
        for (let i = 1; i <= 11; i++) {
            RecurrenceLoadDataHandle.dataRepeat["3"].push({
                    'id': i,
                    'title': `${i} ${RecurrenceLoadDataHandle.$trans.attr('data-month')}`
                })
        }
        for (let i = 1; i <= 4; i++) {
            RecurrenceLoadDataHandle.dataRepeat["4"].push({
                    'id': i,
                    'title': `${i} ${RecurrenceLoadDataHandle.$trans.attr('data-year')}`
                })
        }
        for (let i = 1; i <= 31; i++) {
            RecurrenceLoadDataHandle.dataDateRecurrenceMonthly.push({
                    'id': i,
                    'title': `${RecurrenceLoadDataHandle.$trans.attr('data-day')} ${i}`
                })
        }
        // select2
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxStatus, RecurrenceLoadDataHandle.dataStatus);
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxApp, [], {"allow_recurrence": true});
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxDocTem, []);
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxPeriod, RecurrenceLoadDataHandle.dataPeriod);
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxRepeat, []);
        // date picker
        $('.date-picker').each(function () {
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY'));
                RecurrenceLoadDataHandle.loadExecutionDate();
            });
            $(this).val('').trigger('change');
        })
        return true;
    };

    static loadChangeApp() {
        if (RecurrenceLoadDataHandle.$boxApp.val()) {
            let data = SelectDDControl.get_data_from_idx(RecurrenceLoadDataHandle.$boxApp, RecurrenceLoadDataHandle.$boxApp.val());
            if (data?.['app_label'] && data?.['model_code']) {
                let contentType = data?.['app_label'] + "." + data?.['model_code'];
                RecurrenceLoadDataHandle.$boxDocTem.attr('data-url', RecurrenceLoadDataHandle.appMapUrl[contentType]?.['url']);
                RecurrenceLoadDataHandle.$boxDocTem.attr('data-keyResp', RecurrenceLoadDataHandle.appMapUrl[contentType]?.['keyResp']);
                RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxDocTem, [], {"is_recurrence_template": true});
            }
        }
    };

    static loadChangeByPeriod() {
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxRepeat, RecurrenceLoadDataHandle.dataRepeat[RecurrenceLoadDataHandle.$boxPeriod.val()]);

        RecurrenceLoadDataHandle.$dateRecurrenceDaily[0].setAttribute('disabled', 'true');
        RecurrenceLoadDataHandle.$boxDateWeekly[0].setAttribute('disabled', 'true');
        RecurrenceLoadDataHandle.$boxDateMonthly[0].setAttribute('disabled', 'true');
        RecurrenceLoadDataHandle.$dateRecurrenceYearly[0].setAttribute('disabled', 'true');
        for (let eleArea of RecurrenceLoadDataHandle.$periodArea[0].querySelectorAll('.custom-area')) {
            eleArea.setAttribute('hidden', 'true');
        }
        let idAreaShow = 'custom-area-' + String(RecurrenceLoadDataHandle.$boxPeriod.val());
        RecurrenceLoadDataHandle.$periodArea[0].querySelector(`#${idAreaShow}`).removeAttribute('hidden');
        if (RecurrenceLoadDataHandle.$boxPeriod.val() === "2") {
            RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxDateWeekly, RecurrenceLoadDataHandle.dataDateRecurrenceWeekly);
        }
        if (RecurrenceLoadDataHandle.$boxPeriod.val() === "3") {
            RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxDateMonthly, RecurrenceLoadDataHandle.dataDateRecurrenceMonthly);
        }

        return true;
    };

    static loadChangeRepeat() {
        if (RecurrenceLoadDataHandle.$boxRepeat.val()) {
            RecurrenceLoadDataHandle.$dateRecurrenceDaily[0].removeAttribute('disabled');
            RecurrenceLoadDataHandle.$boxDateWeekly[0].removeAttribute('disabled');
            RecurrenceLoadDataHandle.$boxDateMonthly[0].removeAttribute('disabled');
            RecurrenceLoadDataHandle.$dateRecurrenceYearly[0].removeAttribute('disabled');
        }
        return true;
    }

    static loadExecutionDate() {
        RecurrenceLoadDataHandle.$dateNext.val("");
        let nextList = [];
        if (RecurrenceLoadDataHandle.$boxPeriod.val() && RecurrenceLoadDataHandle.$boxRepeat.val() && RecurrenceLoadDataHandle.$dateEnd.val() && RecurrenceLoadDataHandle.$dateStart.val() && RecurrenceLoadDataHandle.$dateEnd.val()) {
            if (RecurrenceLoadDataHandle.$boxPeriod.val() === "1") {
                if (RecurrenceLoadDataHandle.$dateRecurrenceDaily.val()) {
                    nextList = RecurrenceCalculateHandle.getRecurrencesDailyInRange(RecurrenceLoadDataHandle.$dateRecurrenceDaily.val(), RecurrenceLoadDataHandle.$dateStart.val(), RecurrenceLoadDataHandle.$dateEnd.val(), parseInt(RecurrenceLoadDataHandle.$boxRepeat.val()));
                    if (nextList.length > 0) {
                        let next = RecurrenceLoadDataHandle.loadConvertDate(nextList[0], 1);
                        RecurrenceLoadDataHandle.$dateNext.val(next);
                    }
                }
            }
            if (RecurrenceLoadDataHandle.$boxPeriod.val() === "2") {
                if (RecurrenceLoadDataHandle.$boxDateWeekly.val()) {
                    nextList = RecurrenceCalculateHandle.getRecurrencesWeeklyInRange(RecurrenceLoadDataHandle.$dateStart.val(), RecurrenceLoadDataHandle.$dateStart.val(), RecurrenceLoadDataHandle.$dateEnd.val(), parseInt(RecurrenceLoadDataHandle.$boxRepeat.val()), parseInt(RecurrenceLoadDataHandle.$boxDateWeekly.val()));
                    if (nextList.length > 0) {
                        let next = RecurrenceLoadDataHandle.loadConvertDate(nextList[0], 1);
                        RecurrenceLoadDataHandle.$dateNext.val(next);
                    }
                }
            }
            if (RecurrenceLoadDataHandle.$boxPeriod.val() === "3") {
                if (RecurrenceLoadDataHandle.$boxDateMonthly.val()) {
                    nextList = RecurrenceCalculateHandle.getRecurrencesMonthlyInRange(RecurrenceLoadDataHandle.$dateStart.val(), RecurrenceLoadDataHandle.$dateStart.val(), RecurrenceLoadDataHandle.$dateEnd.val(), parseInt(RecurrenceLoadDataHandle.$boxRepeat.val()), parseInt(RecurrenceLoadDataHandle.$boxDateMonthly.val()));
                    if (nextList.length > 0) {
                        let next = RecurrenceLoadDataHandle.loadConvertDate(nextList[0], 1);
                        RecurrenceLoadDataHandle.$dateNext.val(next);
                    }
                }
            }
            if (RecurrenceLoadDataHandle.$boxPeriod.val() === "4") {
                if (RecurrenceLoadDataHandle.$dateRecurrenceYearly.val()) {
                    nextList = RecurrenceCalculateHandle.getRecurrencesYearlyInRange(RecurrenceLoadDataHandle.$dateRecurrenceYearly.val(), RecurrenceLoadDataHandle.$dateStart.val(), RecurrenceLoadDataHandle.$dateEnd.val(), parseInt(RecurrenceLoadDataHandle.$boxRepeat.val()));
                    if (nextList.length > 0) {
                        let next = RecurrenceLoadDataHandle.loadConvertDate(nextList[0], 1);
                        RecurrenceLoadDataHandle.$dateNext.val(next);
                    }
                }
            }
        }
        return nextList;
    };

    static loadConvertDate(startDate, type = 0) {
        if (type === 0) {
            let [day, month, year] = startDate.split('/');
            startDate = new Date(`${year}-${month}-${day}`);
        } else if (type === 1) {
            let [year, month, day] = startDate.split('-');
            startDate = `${day}/${month}/${year}`;
        }
        return startDate;
    };

    static loadDetail(data) {
        RecurrenceLoadDataHandle.$title.val(data?.['title']);
        RecurrenceLoadDataHandle.$boxStatus.val(data?.['recurrence_status']).trigger('change');
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxApp, [data?.['application_data']], {"is_workflow": true});
        RecurrenceLoadDataHandle.$boxApp.trigger('change');
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxDocTem, [data?.['doc_template_data']], {"is_recurrence_template": true});
        RecurrenceLoadDataHandle.$boxPeriod.val(data?.['period']).trigger('change');
        RecurrenceLoadDataHandle.$boxRepeat.val(data?.['repeat']).trigger('change');

        if (RecurrenceLoadDataHandle.$form.attr('data-method').toLowerCase() === 'get') {
            RecurrenceLoadDataHandle.$dateRecurrenceDaily[0].setAttribute('disabled', 'true');
            RecurrenceLoadDataHandle.$boxDateWeekly[0].setAttribute('disabled', 'true');
            RecurrenceLoadDataHandle.$boxDateMonthly[0].setAttribute('disabled', 'true');
            RecurrenceLoadDataHandle.$dateRecurrenceYearly[0].setAttribute('disabled', 'true');
        }

        if (data?.['period'] === 1) {
            RecurrenceLoadDataHandle.$dateRecurrenceDaily.val(moment(data?.['date_daily']).format('DD/MM/YYYY'));
        }
        if (data?.['period'] === 2) {
            RecurrenceLoadDataHandle.$boxDateWeekly.val(data?.['weekday']).trigger('change');
        }
        if (data?.['period'] === 3) {
            RecurrenceLoadDataHandle.$boxDateMonthly.val(data?.['monthday']).trigger('change');
        }
        if (data?.['period'] === 4) {
            RecurrenceLoadDataHandle.$dateRecurrenceDaily.val(moment(data?.['date_yearly']).format('DD/MM/YYYY'));
        }
        RecurrenceLoadDataHandle.$dateStart.val(moment(data?.['date_start']).format('DD/MM/YYYY'));
        RecurrenceLoadDataHandle.$dateEnd.val(moment(data?.['date_end']).format('DD/MM/YYYY'));
        RecurrenceLoadDataHandle.$dateNext.val(moment(data?.['date_next']).format('DD/MM/YYYY'));
        return true;
    };

}

// calculate
class RecurrenceCalculateHandle {
    static getRecurrencesDailyInRange(recurrenceDate, startDate, endDate, repeatIntervalDays) {
        // Convert dates to standard Date objects
        recurrenceDate = RecurrenceLoadDataHandle.loadConvertDate(recurrenceDate);
        startDate = RecurrenceLoadDataHandle.loadConvertDate(startDate);
        endDate = RecurrenceLoadDataHandle.loadConvertDate(endDate);

        let currentRecurrence = new Date(recurrenceDate);
        let rangeStart = new Date(startDate);
        let rangeEnd = new Date(endDate);
        const recurrenceDates = [];

        // Generate all recurrence dates within the range
        while (currentRecurrence <= rangeEnd) {
            // Only add dates that are within the specified range
            if (currentRecurrence >= rangeStart) {
                let day = String(currentRecurrence.getDate()).padStart(2, '0');
                let month = String(currentRecurrence.getMonth() + 1).padStart(2, '0');
                let year = currentRecurrence.getFullYear();
                recurrenceDates.push(`${year}-${month}-${day}`);
            }

            // Move to the next recurrence date
            currentRecurrence.setDate(currentRecurrence.getDate() + repeatIntervalDays);
        }

        return recurrenceDates;
    };

    static getRecurrencesWeeklyInRange(recurrenceDate, startDate, endDate, repeatIntervalWeeks, targetDayOfWeek) {
        // Convert dates to standard Date objects
        recurrenceDate = RecurrenceLoadDataHandle.loadConvertDate(recurrenceDate);
        startDate = RecurrenceLoadDataHandle.loadConvertDate(startDate);
        endDate = RecurrenceLoadDataHandle.loadConvertDate(endDate);

        let recurrenceDates = [];
        let currentRecurrence = new Date(recurrenceDate);
        const rangeEnd = new Date(endDate);
        const rangeStart = new Date(startDate);

        // Calculate initial offset to the target day of the week
        let daysUntilTarget = targetDayOfWeek - currentRecurrence.getDay();
        if (daysUntilTarget < 0) daysUntilTarget += 7;

        // Adjust the currentRecurrence date to the first target weekday after the start date
        currentRecurrence.setDate(currentRecurrence.getDate() + daysUntilTarget);

        // Loop through each recurrence until it surpasses the end date
        while (currentRecurrence <= rangeEnd) {
            // Add only dates that fall within the range
            if (currentRecurrence >= rangeStart) {
                let day = String(currentRecurrence.getDate()).padStart(2, '0');
                let month = String(currentRecurrence.getMonth() + 1).padStart(2, '0');
                let year = currentRecurrence.getFullYear();
                recurrenceDates.push(`${year}-${month}-${day}`);
            }

            // Move to the next recurrence by adding the repeat interval in weeks
            currentRecurrence.setDate(currentRecurrence.getDate() + repeatIntervalWeeks * 7);
        }

        return recurrenceDates;
    };

    static getRecurrencesMonthlyInRange(recurrenceDate, startDate, endDate, repeatIntervalMonths, targetDayOfMonth) {
        // Convert dates to standard Date objects
        recurrenceDate = RecurrenceLoadDataHandle.loadConvertDate(recurrenceDate);
        startDate = RecurrenceLoadDataHandle.loadConvertDate(startDate);
        endDate = RecurrenceLoadDataHandle.loadConvertDate(endDate);

        let recurrenceDates = [];
        let currentRecurrence = new Date(recurrenceDate);
        const rangeEnd = new Date(endDate);
        const rangeStart = new Date(startDate);

        // Loop through each month until surpassing the end date
        while (currentRecurrence <= rangeEnd) {
            // Set the month and year for the next occurrence
            currentRecurrence.setMonth(currentRecurrence.getMonth() + repeatIntervalMonths);
            const lastDayOfMonth = new Date(currentRecurrence.getFullYear(), currentRecurrence.getMonth() + 1, 0).getDate();

            // Ensure the target day is within the range of days for the month
            const day = Math.min(targetDayOfMonth, lastDayOfMonth);
            currentRecurrence.setDate(day);

            // Add only dates that fall within the range
            if (currentRecurrence >= rangeStart && currentRecurrence <= rangeEnd) {
                let day = String(currentRecurrence.getDate()).padStart(2, '0');
                let month = String(currentRecurrence.getMonth() + 1).padStart(2, '0');
                let year = currentRecurrence.getFullYear();
                recurrenceDates.push(`${year}-${month}-${day}`);
            }
        }

        return recurrenceDates;
    };

    static getRecurrencesYearlyInRange(recurrenceDate, startDate, endDate, repeatIntervalYears = 1) {
        // Convert dates to Date objects
        recurrenceDate = RecurrenceLoadDataHandle.loadConvertDate(recurrenceDate);
        startDate = RecurrenceLoadDataHandle.loadConvertDate(startDate);
        endDate = RecurrenceLoadDataHandle.loadConvertDate(endDate);

        let recurrenceDates = [];
        let currentRecurrence = new Date(recurrenceDate);
        const rangeEnd = new Date(endDate);
        const rangeStart = new Date(startDate);

        // Loop through each year until surpassing the end date
        while (currentRecurrence <= rangeEnd) {
            // Only add dates that fall within the specified range
            if (currentRecurrence >= rangeStart && currentRecurrence <= rangeEnd) {
                let day = String(currentRecurrence.getDate()).padStart(2, '0');
                let month = String(currentRecurrence.getMonth() + 1).padStart(2, '0');
                let year = currentRecurrence.getFullYear();
                recurrenceDates.push(`${year}-${month}-${day}`);
            }

            // Set the next occurrence by incrementing the year
            currentRecurrence.setFullYear(currentRecurrence.getFullYear() + repeatIntervalYears);
        }

        return recurrenceDates;
    };
}

// Submit Form
class RecurrenceSubmitHandle {

    static setupDataSubmit(_form) {
        if (RecurrenceLoadDataHandle.$boxApp.val()) {
            let data = SelectDDControl.get_data_from_idx(RecurrenceLoadDataHandle.$boxApp, RecurrenceLoadDataHandle.$boxApp.val());
            if (data?.['id'] && data?.['app_label'] && data?.['model_code']) {
                let contentType = data?.['app_label'] + "." + data?.['model_code'];
                _form.dataForm['application_id'] = data?.['id'];
                _form.dataForm['application_data'] = data;
                _form.dataForm['app_code'] = contentType;

                //
                if (RecurrenceLoadDataHandle.$boxDocTem.val()) {
                    let data = SelectDDControl.get_data_from_idx(RecurrenceLoadDataHandle.$boxDocTem, RecurrenceLoadDataHandle.$boxDocTem.val());
                    if (data?.['id']) {
                        _form.dataForm['doc_template_id'] = data?.['id'];
                        _form.dataForm['doc_template_data'] = data;
                        if (data?.['employee_inherit']?.['id']) {
                            _form.dataForm['employee_inherit_id'] = data?.['employee_inherit']?.['id'];
                        }
                    }
                }

                //
                if (RecurrenceLoadDataHandle.$boxPeriod.val()) {
                    _form.dataForm['period'] = parseInt(RecurrenceLoadDataHandle.$boxPeriod.val());

                    if (RecurrenceLoadDataHandle.$boxRepeat.val()) {
                        _form.dataForm['repeat'] = parseInt(RecurrenceLoadDataHandle.$boxRepeat.val());
                    }

                    if (RecurrenceLoadDataHandle.$boxPeriod.val() === '1') {
                        if (RecurrenceLoadDataHandle.$dateRecurrenceDaily.val()) {
                            _form.dataForm['date_daily'] = moment(RecurrenceLoadDataHandle.$dateRecurrenceDaily.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD')
                        }
                    }
                    if (RecurrenceLoadDataHandle.$boxPeriod.val() === '2') {
                        if (RecurrenceLoadDataHandle.$boxDateWeekly.val()) {
                            _form.dataForm['weekday'] = parseInt(RecurrenceLoadDataHandle.$boxDateWeekly.val())
                        }
                    }
                    if (RecurrenceLoadDataHandle.$boxPeriod.val() === '3') {
                        if (RecurrenceLoadDataHandle.$boxDateMonthly.val()) {
                            _form.dataForm['monthday'] = parseInt(RecurrenceLoadDataHandle.$boxDateMonthly.val())
                        }
                    }
                    if (RecurrenceLoadDataHandle.$boxPeriod.val() === '4') {
                        if (RecurrenceLoadDataHandle.$dateRecurrenceDaily.val()) {
                            _form.dataForm['date_yearly'] = moment(RecurrenceLoadDataHandle.$dateRecurrenceYearly.val(),
                                'DD/MM/YYYY').format('YYYY-MM-DD')
                        }
                    }
                }

                if (RecurrenceLoadDataHandle.$dateStart.val()) {
                    _form.dataForm['date_start'] = moment(RecurrenceLoadDataHandle.$dateStart.val(),
                        'DD/MM/YYYY').format('YYYY-MM-DD')
                }
                if (RecurrenceLoadDataHandle.$dateEnd.val()) {
                    _form.dataForm['date_end'] = moment(RecurrenceLoadDataHandle.$dateEnd.val(),
                        'DD/MM/YYYY').format('YYYY-MM-DD')
                }
                if (RecurrenceLoadDataHandle.$dateNext.val()) {
                    _form.dataForm['date_next'] = moment(RecurrenceLoadDataHandle.$dateNext.val(),
                        'DD/MM/YYYY').format('YYYY-MM-DD')
                }

                let next_recurrences = RecurrenceLoadDataHandle.loadExecutionDate();
                _form.dataForm['next_recurrences'] = next_recurrences;

                if (RecurrenceLoadDataHandle.$boxStatus.val()) {
                    _form.dataForm['recurrence_status'] = parseInt(RecurrenceLoadDataHandle.$boxStatus.val());
                }


                //

            }
        }
        return _form.dataForm;
    };
}

// Common
class RecurrenceCommonHandle {

    static filterFieldList(field_list, data_json) {
        for (let key in data_json) {
            if (!field_list.includes(key)) delete data_json[key]
        }
        return data_json;
    }

}
