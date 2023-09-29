$(document).ready(function () {
    // declare element
    const $formYear = $('#formYear')
    const $urlElm = $('#url-factory')
    const $formHld = $('#formHoliday')
    const $modalH = $('#modal_holidays')

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
                $table.DataTableDefault({
                    info: false,
                    paging: false,
                    data: data || [],
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
                                .format('DD/MM/YYYY'))
                            $('#inputRemark', $modalH).val(data.remark)
                            $modalH.modal('show')
                        })
                        $('.btn-remove-row', row).off().on('click', () => HolidayHandle.delete(data.id, index))
                    },
                })
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
            $formHld.off().on('submit', function(e){
                e.preventDefault();
                let _form = new SetupFormSubmit($formHld);
                let dataBody = _form.dataForm
                dataBody.year = $('.wrap_holidays .tab-pane.active').attr('data-year-id')
                dataBody.holiday_date_to = moment(dataBody.holiday_date_to, 'DD/MM/YYYY').format('YYYY-MM-DD')
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
                                const table = $(currentTb).DataTable()
                                if (dataBody?.id)
                                    table.row(dataBody.idx).data(dataBody).draw()
                                else table.rows.add(newItem).draw()
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
    $formYear.off().on('submit', function (e) {
        e.preventDefault();
        let _form = new SetupFormSubmit($formYear);
        let dataBody = _form.dataForm
        dataBody.working_calendar = $('#config_id').val()
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
                        $.fn.notifyB({description: data.message}, 'success')
                        $('#modal_years').modal('hide')
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors.detail}, 'failure')
                }
            )
    });

    // init daterange picker
    $('.date-picker').daterangepicker({
        minYear: 1901,
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: true,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }).val(null).trigger('change');

    // init holidays all table
    let holidays = new HolidayHandle()
    holidays.init()

    // reset form modal when form close
    $('#modal_years').on('hidden.bs.modal', () => $('#inputConfigYear').val(''))
    $modalH.on('hidden.bs.modal', function (){
        $('#formHoliday')[0].reset()
        $('[name="id"], [name="idx"]', $formHld).remove()
    })

    $('#working_calendar').off().on('submit', function(e){
        e.preventDefault()
        let _form = new SetupFormSubmit($(this));
        let harshDataBody = _form.dataForm;
        let dataBody = {
            working_days:{
                "mon": {
                    "work": harshDataBody.mon_work,
                    "mor": {"from": harshDataBody.mon_mor_from, "to": harshDataBody.mon_mor_to},
                    "aft": {"from": harshDataBody.mon_aft_from, "to": harshDataBody.mon_aft_to}
                },
                "tue": {
                    "work": harshDataBody.tue_work,
                    "mor": {"from": harshDataBody.tue_mor_from, "to": harshDataBody.tue_mor_to},
                    "aft": {"from": harshDataBody.tue_aft_from, "to": harshDataBody.tue_aft_to}
                },
                "wed": {
                    "work": harshDataBody.wed_work,
                    "mor": {"from": harshDataBody.wed_mor_from, "to": harshDataBody.wed_mor_to},
                    "aft": {"from": harshDataBody.wed_aft_from, "to": harshDataBody.wed_aft_to}
                },
                "thu": {
                    "work": harshDataBody.thu_work,
                    "mor": {"from": harshDataBody.thu_mor_from, "to": harshDataBody.thu_mor_to},
                    "aft": {"from": harshDataBody.thu_aft_from, "to": harshDataBody.thu_aft_to}
                },
                "fri": {
                    "work": harshDataBody.fri_work,
                    "mor": {"from": harshDataBody.fri_mor_from, "to": harshDataBody.fri_mor_to},
                    "aft": {"from": harshDataBody.fri_aft_from, "to": harshDataBody.fri_aft_to}
                },
                "sat": {
                    "work": harshDataBody.sat_work,
                    "mor": {"from": harshDataBody.sat_mor_from, "to": harshDataBody.sat_mor_to},
                    "aft": {"from": harshDataBody.sat_aft_from, "to": harshDataBody.sat_aft_to}
                },
                "sun": {
                    "work": harshDataBody.sun_work,
                    "mor": {"from": harshDataBody.sun_mor_from, "to": harshDataBody.sun_mor_to},
                    "aft": {"from": harshDataBody.sun_aft_from, "to": harshDataBody.sun_aft_to}
                },
            }
        }
        $.fn.callAjax2({
            'url': $urlElm.attr('data-update'),
            'method':'put',
            'data': dataBody
        })
            .then((resp) => {
                    if (resp.status === 200) $.fn.notifyB({description: resp.data.message}, 'success')
                },
                (errs) => $.fn.notifyB({description: errs.data.errors.detail}, 'failure')
            )
    });
});