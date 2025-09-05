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
            const temp = data?.['employee_list_data'] || data?.['employee_inherit_data']
            const $objectLst = {}
            for (let item of temp){
                $objectLst[item.id] = item
            }
            $('#employee-checked').data('checked', $objectLst)

            let range = moment(data.end_date).diff(data.start_date, 'days') + 1;
            // + 1 vì moment không tính start_date là một ngày mà tính từ ngày tiếp theo của start_date
            if (data.start_date === data.end_date) range = 1;
            const dateRange = {};
            for (let i = 1; i <= range; i++) {
                let dateStr = data.start_date;
                dateStr = i > 1 ? moment(dateStr).add(i - 1, 'days').format('YYYY-MM-DD') : dateStr
                dateRange[dateStr] = {'shift': data.shift, 'ot_type': data.ot_type}
            }
            $('#date_selected').data('date', dateRange);

            $('#data_shift').data('shift', data.shift)
                .attr('data-start_date', data.start_date)
                .attr('data-end_date', data.end_date)

            // run all setup after add data to HTML
            new handleCommon();

        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )
});