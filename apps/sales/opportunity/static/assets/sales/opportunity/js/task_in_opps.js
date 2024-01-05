function resetFormTask() {
    // clean html select etc.
    $('#formOpportunityTask').trigger('reset').removeClass('task_edit')
    $('#selectAssignTo').val(null).trigger('change');
    if ($('.current-create-task').length <= 0)
        $('#selectOpportunity').val(null).trigger('change').attr('disabled', false);
    $('.label-mark, .wrap-checklist, .wrap-subtask').html('');
    $('#inputLabel').val(null);
    $('[name="id"]').remove();
    const $inputAssigner = $('#inputAssigner');
    $inputAssigner.val($inputAssigner.attr('data-name'))
    $('.create-subtask').addClass('hidden')
    $('[name="parent_n"]').remove();
    window.editor.setData('')
    $('.create-task').attr('disabled', false)
}

function isValidString(inputString) {
    let pattern = /^\d+[wdh]*$/;
    return pattern.test(inputString);
}

function logworkSubmit() {
    $('#inputTextEstimate').on('blur', function(){
        if (!isValidString(this.value))
            $.fn.notifyB({description: $('#form_valid').attr('data-estimate-error')}, 'failure')
    })
    $('#save-logtime').off().on('click', function () {
        const startDate = $('#startDateLogTime').val()
        const endDate = $('#endDateLogTime').val()
        const est = $('#EstLogtime').val()
        if (!startDate && !endDate && !est) {
            $.fn.notifyB({description: $('#form_valid').attr('data-logtime-valid')}, 'failure')
            return false
        }
        const data = {
            'start_date': moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            'end_date': moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            'time_spent': est,
        }
        $('[name="log_time"]').attr('value', JSON.stringify(data))
        $('#logWorkModal').modal('hide')
    });
}

class Task_in_opps {
    static init(cls) {
        // init ASSIGNER
        const $assignerElm = $('#inputAssigner')
        $assignerElm.val($assignerElm.attr('data-name')).attr('value', $assignerElm.attr('data-value-id'))

        //--DROPDOWN ASSIGN TO-- assign to me btn
        const $assignBtnElm = $(`<a href="#" class="form-text text-muted link-info btn-assign">${$('#form_valid').attr('data-assign-txt')}</a>`)
        $empElm.parents('.form-group').append($assignBtnElm)
        $assignBtnElm.off().on('click', function () {
            if ($(this).hasClass('disabled')) return false
            const employee = JSON.parse($('#employee_info').text())
            const infoObj = {
                'full_name': employee.full_name,
                'id': employee.id,
                'selected': true
            }
            $empElm.attr('data-onload', JSON.stringify(infoObj))
            if ($(`option[value="${employee.id}"]`, $empElm).length <= 0)
                $empElm.append(`<option value="${employee.id}">${employee.full_name}</option>`)
            $empElm.val(employee.id).trigger('change')
        });
    }
}