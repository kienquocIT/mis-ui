// Load data
class RecurrenceLoadDataHandle {
    static $form = $('#frm_production_order');
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
        for (let i = 1; i <= 5; i++) {
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
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxApp, [], {"is_workflow": true});
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
                RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxDocTem, [], {"is_recurring": true});
            }
        }
    }

    static loadChangeByPeriod() {
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxRepeat, RecurrenceLoadDataHandle.dataRepeat[RecurrenceLoadDataHandle.$boxPeriod.val()]);

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

    static loadExecutionDate() {
        RecurrenceLoadDataHandle.$dateNext.val("");
        if (RecurrenceLoadDataHandle.$boxPeriod.val() && RecurrenceLoadDataHandle.$boxRepeat.val()) {
            if (RecurrenceLoadDataHandle.$boxPeriod.val() === "1") {
                if (RecurrenceLoadDataHandle.$dateRecurrenceDaily.val()) {
                    let next = RecurrenceLoadDataHandle.getNextDaily(RecurrenceLoadDataHandle.$dateRecurrenceDaily.val(), parseInt(RecurrenceLoadDataHandle.$boxRepeat.val()));
                    RecurrenceLoadDataHandle.$dateNext.val(next);
                }
            }
            if (RecurrenceLoadDataHandle.$boxPeriod.val() === "2") {
                if (RecurrenceLoadDataHandle.$boxDateWeekly.val() && RecurrenceLoadDataHandle.$dateStart.val()) {
                    let next = RecurrenceLoadDataHandle.getNextWeekly(RecurrenceLoadDataHandle.$dateStart.val(), parseInt(RecurrenceLoadDataHandle.$boxRepeat.val()), parseInt(RecurrenceLoadDataHandle.$boxDateWeekly.val()));
                    RecurrenceLoadDataHandle.$dateNext.val(next);
                }
            }
        }
        return true;
    };

    static loadConvertDate(startDate) {
        let [day, month, year] = startDate.split('/');
        startDate = new Date(`${year}-${month}-${day}`);
        return startDate;
    };

    static getNextDaily(startDate, repeatIntervalDays, occurrences = 1) {
        startDate = RecurrenceLoadDataHandle.loadConvertDate(startDate);
        let nextDate = new Date(startDate); // Convert startDate to Date object
        nextDate.setDate(nextDate.getDate() + repeatIntervalDays * occurrences);

        // Format to DD/MM/YYYY
        let nextDay = String(nextDate.getDate()).padStart(2, '0'); // Ensure day is two digits
        let nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        let nextYear = nextDate.getFullYear();


        if (RecurrenceLoadDataHandle.$dateStart.val()) {
            let start = RecurrenceLoadDataHandle.loadConvertDate(RecurrenceLoadDataHandle.$dateStart.val());
            let rangeStart = new Date(start);
        }


        return `${nextDay}/${nextMonth}/${nextYear}`;
    };

    static getNextWeekly(startDate, repeatIntervalWeeks, targetDayOfWeek) {
        startDate = RecurrenceLoadDataHandle.loadConvertDate(startDate);
        const currentDayOfWeek = startDate.getDay(); // Get weekday as a number (0 = Sunday, 1 = Monday, ...)

        // Calculate the difference in days from the start day to the target weekday
        let daysUntilTarget = targetDayOfWeek - currentDayOfWeek;
        if (daysUntilTarget <= 0) {
            daysUntilTarget += 7; // Adjust if target day is today or has already passed this week
        }

        // Set the next recurrence date by adding the calculated days and weeks interval
        const nextDate = new Date(startDate);
        nextDate.setDate(nextDate.getDate() + daysUntilTarget + (repeatIntervalWeeks - 1) * 7);

        // Format to DD/MM/YYYY
        let nextDay = String(nextDate.getDate()).padStart(2, '0'); // Ensure day is two digits
        let nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        let nextYear = nextDate.getFullYear();

        return `${nextDay}/${nextMonth}/${nextYear}`;
    }

}

// Submit Form
class RecurrenceSubmitHandle {

    static setupTask() {
        let result = [];
        ProdOrderDataTableHandle.$tableMain.DataTable().rows().every(function () {
            let row = this.node();
            if (row.querySelector('.table-row-order')) {
                if (row.querySelector('.table-row-order').getAttribute('data-row')) {
                    result.push(JSON.parse(row.querySelector('.table-row-order').getAttribute('data-row')));
                }
            }
        });
        return result;
    };

    static setupDataSubmit(_form) {
        if (ProdOrderLoadDataHandle.$dataBOM.val()) {
            let dataBom = JSON.parse(ProdOrderLoadDataHandle.$dataBOM.val());
            _form.dataForm['bom_id'] = dataBom?.['id'];
            _form.dataForm['bom_data'] = dataBom;

            if (ProdOrderLoadDataHandle.$boxType.val()) {
                _form.dataForm['type_production'] = parseInt(ProdOrderLoadDataHandle.$boxType.val());
            }
            if (ProdOrderLoadDataHandle.$boxProd.val()) {
                _form.dataForm['product_id'] = ProdOrderLoadDataHandle.$boxProd.val();
                let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxProd, ProdOrderLoadDataHandle.$boxProd.val());
                if (data) {
                    _form.dataForm['product_data'] = data;
                }
            }
            if (ProdOrderLoadDataHandle.$quantity.val()) {
                _form.dataForm['quantity'] = parseFloat(ProdOrderLoadDataHandle.$quantity.val());
                _form.dataForm['gr_remain_quantity'] = parseFloat(ProdOrderLoadDataHandle.$quantity.val());
                if (_form.dataForm['quantity'] <= 0) {
                    $.fn.notifyB({description: ProdOrderLoadDataHandle.$trans.attr('data-validate-quantity')}, 'failure');
                    return false;
                }
            }
            if (ProdOrderLoadDataHandle.$boxUOM.val()) {
                _form.dataForm['uom_id'] = ProdOrderLoadDataHandle.$boxUOM.val();
                let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxUOM, ProdOrderLoadDataHandle.$boxUOM.val());
                if (data) {
                    _form.dataForm['uom_data'] = data;
                }
            }
            if (ProdOrderLoadDataHandle.$boxWH.val()) {
                _form.dataForm['warehouse_id'] = ProdOrderLoadDataHandle.$boxWH.val();
                let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxWH, ProdOrderLoadDataHandle.$boxWH.val());
                if (data) {
                    _form.dataForm['warehouse_data'] = data;
                }
            }
            if (ProdOrderLoadDataHandle.$boxSO.val()) {
                let dataSO = [];
                for (let val of ProdOrderLoadDataHandle.$boxSO.val()) {
                    let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxSO, val);
                    if (data) {
                        dataSO.push(data);
                    }
                }
                _form.dataForm['sale_order_data'] = dataSO;
            }
            if (ProdOrderLoadDataHandle.$dateStart.val()) {
                _form.dataForm['date_start'] = String(moment(ProdOrderLoadDataHandle.$dateStart.val(), 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD'));
            }
            if (ProdOrderLoadDataHandle.$dateEnd.val()) {
                _form.dataForm['date_end'] = String(moment(ProdOrderLoadDataHandle.$dateEnd.val(), 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD'));
            }
            if (ProdOrderLoadDataHandle.$boxGroup.val()) {
                _form.dataForm['group_id'] = ProdOrderLoadDataHandle.$boxGroup.val();
                let data = SelectDDControl.get_data_from_idx(ProdOrderLoadDataHandle.$boxGroup, ProdOrderLoadDataHandle.$boxGroup.val());
                if (data) {
                    _form.dataForm['group_data'] = data;
                }
            }
            if (ProdOrderLoadDataHandle.$time.val()) {
                _form.dataForm['time'] = parseInt(ProdOrderLoadDataHandle.$time.val());
            }

            ProdOrderStoreHandle.storeAll();
            _form.dataForm['task_data'] = ProdOrderSubmitHandle.setupTask();

        }
    };
}
