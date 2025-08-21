$(document).ready(function(){
    const $urlElm = $('#url-factory')

    // get detail request info
    $.fn.callAjax2({
        'url': $urlElm.attr('data-detail-url'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data);
            $('#titleInput').val(data.title)
            $('#dateCreatedInput')[0]._flatpickr.setDate(data.date_created)
            // .val($x.fn.reformatData(data.date_created, 'YYYY-MM-DD', 'DD/MM/YYYY'))
            $('#remarkInput').val(data.remark)
            $('#SystemStatusInput').val(JSON.parse($('#sys_stt').text())[data.system_status][1])
            $('#selectDeparture').attr('data-onload', JSON.stringify({...data['departure'], 'selected': true})).initSelect2()
            $('#selectDestination').append(
                `<option value="${data.destination.id}" selected>${data.destination.title}</option>`
            ).trigger('change')

            data.employee_on_trip.map(function(item){
                item.selected = true
                return item
            })
            $('#selectEmployeeOnTrip').initSelect2({data:data.employee_on_trip})
            $(`[name="morning_f"][value="${data.morning_f}"], [name="morning_t"][value="${data.morning_t}"]`).prop('checked', true)
            let dateFormat = [data.date_f.split(' ')[0], data.date_t.split(' ')[0]]
            $('#dateFInput')[0]._flatpickr.set('minDate', data.date_f.split(' ')[0])
            $('#dateFInput')[0]._flatpickr.setDate(dateFormat)
            $('#totalDayInput').val(data.total_day)
            expenseItemTable.init(data.expense_items)
            $('[name="employee_inherit_id"]').val(data.employee_inherit.id)
            if (data.system_status >= 2) $('#idxRealAction').remove()

            // load attachments
            new $x.cls.file(
                $('#attachment')
            ).init({
                name: 'attachment',
                enable_edit: true,
                data: data.attachment,
            })
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
});