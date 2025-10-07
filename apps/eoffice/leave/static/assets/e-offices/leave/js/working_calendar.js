$(document).ready(function () {
    // declare element
    const $transElm = $('#trans-factory')
    const $formYear = $('#formYear')
    const $urlElm = $('#url-factory')
    const $formHld = $('#formHoliday')
    const $modalH = $('#modal_holidays')
    const _tableConfig = {
                    info: false,
                    paging: false,
                    data: [],
                    columns: [
                        {
                            data: 'holiday_date_to',
                            render: function (row) {
                                if (row) return moment(row, 'YYYY-MM-DD').format('DD/MM/YYYY');
                                return '--'
                            }
                        },
                        {
                            data: 'remark',
                            render: function (row) {
                                return row
                            }
                        },
                        {
                            target: 2,
                            render: function(){
                                let temp = $(`${$('.group-btn-tb').html()}`)
                                return temp.prop('outerHTML')
                            }
                        }
                    ],
                    rowCallback: (row, data, index) => {
                        $('.btn-edit-row', row).off().on('click', function () {
                            $modalH.find('form')[0].reset()
                            let id = $('<input name="id" type="hidden">')
                            let idx = $('<input name="idx" type="hidden">')
                            id.val(data.id)
                            idx.val(index)
                            $modalH.find('form').append(id).append(idx)
                            $('#inputHolidayDate', $modalH).val(moment(data.holiday_date_to, 'YYYY-MM-DD')
                                .format('DD/MM/YYYY')).trigger('change')
                            $('#inputRemark', $modalH).val(data.remark)
                            $modalH.modal('show')
                        })
                        $('.btn-remove-row', row).off().on('click', () => HolidayHandle.delete(data.id, index))
                    },
                }
    let dataRangeConfig = {
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: true,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }

    function deleteYear(elm=undefined){
        let $elm = elm ? elm : $('.wrap_years ul li button')
        $elm.each(function(){
            $(this).off().on('click', function(){
                const yearID = $(this).closest('.year-item').attr('data-year-id')
                $.fn.callAjax2({
                    'url': $urlElm.attr('data-year-delete').format_url_with_uuid(yearID),
                    'method': 'delete'
                })
                    .then((resp) => {
                            if (resp.status === 200){
                                $.fn.notifyB({description: resp.data.message}, 'success')
                                $(`${$(this).prev('a').attr('href')}`, $('.wrap_holidays')).remove()
                                $(this).closest('li.year-item').remove()
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors.detail}, 'failure')
                        })
            })
        })
    }

    class HolidayHandle {
        init() {
            HolidayHandle.load()
            HolidayHandle.create()
        }

        static load() {
            let $elm = $('.wrap_holidays .tab-pane')
            $elm.each(function () {
                const harshData = $(this).find('script').text().replaceAll("'", '"')
                const data = JSON.parse(harshData) || []
                const $table = $(this).find('table')
                $table.DataTableDefault({..._tableConfig, ...{'data':data}})
            })
        }

        static delete(ID, index){
            if (ID && index >= 0){
                const url = $urlElm.attr('data-holiday-detail').format_url_with_uuid(ID)
                $.fn.callAjax2({
                    'url': url,
                    'method': 'delete',
                    'data': {}
                })
                    .then(
                        (resp)=> {
                            if (resp.status === 200){
                                $.fn.notifyB({description: resp.data.message}, 'success')
                                $('.wrap_holidays .tab-pane.active table').DataTable().row(index).remove().draw();
                            }
                        },
                        (errs) => $.fn.notifyB({description: errs.data.errors.detail}, 'failure')
                    )
            }
        }

        static create() {
            $formHld.on('submit', function(e){
                e.preventDefault();
                let _form = new SetupFormSubmit($formHld);
                let dataBody = _form.dataForm
                dataBody.year = $('.wrap_holidays .tab-pane.active').attr('data-year-id')
                dataBody.holiday_date_to = moment(dataBody.holiday_date_to, 'DD/MM/YYYY').format('YYYY-MM-DD')
                if (parseInt($('.wrap_years .year-item a.active span').text()) !== moment(dataBody.holiday_date_to).year()){
                    $.fn.notifyB({description: $transElm.attr('data-holidays-error')}, 'failure')
                    return false
                }
                $.fn.callAjax2({
                    'url': dataBody?.id ? $urlElm.attr('data-holiday-detail').format_url_with_uuid(
                        dataBody.id) : $urlElm.attr('data-holiday'),
                    'method': dataBody?.id ? 'put' : 'post',
                    'data': dataBody
                })
                    .then((resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (resp.status === 200) {
                                const currentTb = $('.wrap_holidays .tab-pane.active').find('.table')
                                const newItem = [{
                                    "id": data.id,
                                    "holiday_date_to": data.holiday_date_to,
                                    "remark": data.remark
                                }]
                                let _table
                                if (!$.fn.DataTable.isDataTable(currentTb))
                                    $(currentTb).DataTableDefault(_tableConfig)
                                _table = $(currentTb).DataTable()
                                if (dataBody?.id)
                                    _table.row(dataBody.idx).data(dataBody).draw()
                                else _table.rows.add(newItem).draw()
                                $.fn.notifyB({description: data.message}, 'success')
                                $('#modal_holidays').modal('hide')
                            }
                        },
                        (errs) => {
                            $.fn.notifyB({description: errs.data.errors.detail}, 'failure')
                        }
                    )
            })
        }
    }


    // run delete year
    deleteYear()
    // handle event click btn add year
    $formYear.on('submit', function (e) {
        e.preventDefault();
        let _form = new SetupFormSubmit($formYear);
        let dataBody = _form.dataForm
        $.fn.callAjax2({
            'url': $urlElm.attr('data-year'),
            'method': 'post',
            'data': dataBody
        })
            .then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (resp.status === 200) {
                        $('.year-item-empty').remove() // xoá empty nếu year có
                        let elmItem = $(`${$('.li-year-item').html()}`)
                        elmItem.attr('data-year-id', data.id)
                        elmItem.find('a').attr('href', '#years_' + data.config_year)
                        elmItem.find('.nav-link-text').text(data.config_year)
                        $('.wrap_years ul').append(elmItem)
                        deleteYear(elmItem.find('button'))
                        // add holidays table
                        let $holidayTable = $($('.holidays-tabs').html())
                        $holidayTable.attr('data-year-id', data.id).attr('id', 'years_' + data.config_year)
                        $holidayTable.find('table').attr('id', 'holidays_' + data.config_year)
                        $('.wrap_holidays .tab-content').append($holidayTable);
                        $.fn.notifyB({description: data.message}, 'success')
                        $('#modal_years').modal('hide')
                        if ($('.wrap_years .year-item').length === 1){
                            $('.wrap_years .year-item a').addClass('active')
                            $('.wrap_holidays .tab-pane').addClass('active show')
                        }
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
    });

    // init holidays all table
    let holidays = new HolidayHandle()
    holidays.init()

    // reset form add year
    $('#modal_years').on('hidden.bs.modal', () => $('#inputConfigYear').val(''))

    // limit year when create holidays
    let $dateElm = $('.date-picker')
    $dateElm.daterangepicker(dataRangeConfig).val('').trigger('change')
    $modalH.on('hidden.bs.modal', function (){
        $('.date-picker').val('').trigger('change')
        $('#formHoliday')[0].reset()
        $('[name="id"], [name="idx"]', $formHld).remove()
    })
});