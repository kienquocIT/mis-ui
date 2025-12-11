$(document).ready(function(){
    const $form = $('#overtime_request_form')
    // get detail request info
    $.fn.callAjax2({
        'url': $form.attr('data-url-detail'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
            $x.fn.renderCodeBreadcrumb(data);
            $.fn.compareStatusShowPageAction(data);
            $('#ipt_title').val(data.title)
            $('#start_time').val(data.start_time)
            $('#end_time').val(data.end_time)
            $('#reason').val(data.reason)
            $('#id').val(data.id)
            const temps = data?.['employee_list_data'] || data?.['employee_inherit']
            $('#employee-checked').data('checked', temps.reduce((acc, item) => {
                acc[item.id] = item
                return acc
            }, {}))

            const dateRange = {};
            const dateShift = [];
            for (let temp of data?.['date_list']) {
                dateRange[temp.date] = temp
                dateShift.push(temp.shift)
            }
            $('#date_selected').data('date', dateRange);
            $('#data_shift').data('shift', dateShift);

            // run all setup after add data to HTML
            new handleCommon();

        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
});