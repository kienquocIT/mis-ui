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
    static $boxDateWeekly = $('#box-date-recurrence-weekly') ;

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
            {'id': 1, 'title': '1', 'type': RecurrenceLoadDataHandle.$trans.attr('data-day')},
            {'id': 2, 'title': '2', 'type': RecurrenceLoadDataHandle.$trans.attr('data-day')},
            {'id': 3, 'title': '3', 'type': RecurrenceLoadDataHandle.$trans.attr('data-day')},
            {'id': 4, 'title': '4', 'type': RecurrenceLoadDataHandle.$trans.attr('data-day')},
            {'id': 5, 'title': '5', 'type': RecurrenceLoadDataHandle.$trans.attr('data-day')},
            {'id': 6, 'title': '6', 'type': RecurrenceLoadDataHandle.$trans.attr('data-day')},
        ],
        '2': [
            {'id': '', 'title': 'Select...',},
            {'id': 1, 'title': '1', 'type': RecurrenceLoadDataHandle.$trans.attr('data-week')},
            {'id': 2, 'title': '2', 'type': RecurrenceLoadDataHandle.$trans.attr('data-week')},
            {'id': 3, 'title': '3', 'type': RecurrenceLoadDataHandle.$trans.attr('data-week')},
        ],
        '3': [
            {'id': '', 'title': 'Select...',},
            {'id': 1, 'title': '1', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
            {'id': 2, 'title': '2', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
            {'id': 3, 'title': '3', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
            {'id': 4, 'title': '4', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
            {'id': 5, 'title': '5', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
            {'id': 6, 'title': '6', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
            {'id': 7, 'title': '7', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
            {'id': 8, 'title': '8', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
            {'id': 9, 'title': '9', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
            {'id': 10, 'title': '10', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
            {'id': 11, 'title': '11', 'type': RecurrenceLoadDataHandle.$trans.attr('data-month')},
        ],
        '4': [
            {'id': '', 'title': 'Select...',},
            {'id': 1, 'title': '1', 'type': RecurrenceLoadDataHandle.$trans.attr('data-year')},
            {'id': 2, 'title': '2', 'type': RecurrenceLoadDataHandle.$trans.attr('data-year')},
            {'id': 3, 'title': '3', 'type': RecurrenceLoadDataHandle.$trans.attr('data-year')},
            {'id': 4, 'title': '4', 'type': RecurrenceLoadDataHandle.$trans.attr('data-year')},
            {'id': 5, 'title': '5', 'type': RecurrenceLoadDataHandle.$trans.attr('data-year')},
            {'id': 6, 'title': '6', 'type': RecurrenceLoadDataHandle.$trans.attr('data-year')},
            {'id': 7, 'title': '7', 'type': RecurrenceLoadDataHandle.$trans.attr('data-year')},
            {'id': 8, 'title': '8', 'type': RecurrenceLoadDataHandle.$trans.attr('data-year')},
            {'id': 9, 'title': '9', 'type': RecurrenceLoadDataHandle.$trans.attr('data-year')},
            {'id': 10, 'title': '10', 'type': RecurrenceLoadDataHandle.$trans.attr('data-year')},
        ]
    };
    static dataDateRecurrenceWeekly = [
        {'id': '', 'title': 'Select...',},
        {'id': 2, 'title': RecurrenceLoadDataHandle.$trans.attr('data-monday')},
        {'id': 3, 'title': RecurrenceLoadDataHandle.$trans.attr('data-tuesday')},
        {'id': 4, 'title': RecurrenceLoadDataHandle.$trans.attr('data-wednesday')},
        {'id': 5, 'title': RecurrenceLoadDataHandle.$trans.attr('data-thursday')},
        {'id': 6, 'title': RecurrenceLoadDataHandle.$trans.attr('data-friday')},
        {'id': 7, 'title': RecurrenceLoadDataHandle.$trans.attr('data-saturday')},
        {'id': 8, 'title': RecurrenceLoadDataHandle.$trans.attr('data-sunday')},
    ];
    static appMapUrl = {
        'saleorder.saleorder': RecurrenceLoadDataHandle.$urls.attr('data-sale-order'),
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
                RecurrenceLoadDataHandle.$boxDocTem.attr('data-url', RecurrenceLoadDataHandle.appMapUrl[contentType]);
                RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxDocTem, [], {"is_recurring": true});
            }
        }
    }

    static loadChangeByPeriod() {
        RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxRepeat, RecurrenceLoadDataHandle.dataRepeat[RecurrenceLoadDataHandle.$boxPeriod.val()], {}, null, false, {'res1': 'title', 'res2': 'type'});

        for (let eleArea of RecurrenceLoadDataHandle.$periodArea[0].querySelectorAll('.custom-area')) {
            eleArea.setAttribute('hidden', 'true');
        }
        let idAreaShow = 'custom-area-' + String(RecurrenceLoadDataHandle.$boxPeriod.val());
        RecurrenceLoadDataHandle.$periodArea[0].querySelector(`#${idAreaShow}`).removeAttribute('hidden');
        if (RecurrenceLoadDataHandle.$boxPeriod.val() === "2") {
            RecurrenceLoadDataHandle.loadInitS2(RecurrenceLoadDataHandle.$boxDateWeekly, RecurrenceLoadDataHandle.dataDateRecurrenceWeekly);
        }

        return true;
    };

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
