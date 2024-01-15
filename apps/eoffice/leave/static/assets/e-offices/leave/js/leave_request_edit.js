const $FormElm = $('#leave_edit')

function validApproved(dataList) {
    let $trans = $('#trans-factory')
    if (!dataList.length) return true
    for (let item of dataList) {
        const LType = item.leave_available
        if (LType.check_balance && item.subtotal > LType.available) {
            let noti = $(`<span class="text-red">`)
            noti.text($trans.attr('data-out-of-stock'))

            let setITerval = setInterval(() => {
                const $btn = $('.btnAddFilter')
                if ($btn.length) {
                    clearInterval(setITerval)
                    $btn.append(noti)
                }
            }, 200)
            $('.btn-action-wf, #idxSaveInZoneWFThenNext, #idxSaveInZoneWF, #idxGroupAction .btn-action-wf[data-value="1"] .dropdown-item').addClass('disabled')
        }
    }
}

$(document).ready(function () {

    // get detail request info
    $.fn.callAjax2({
        'url': $urlElm.attr('data-leave-detail'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp)['leave_request_detail']
            $x.fn.renderCodeBreadcrumb(data);
            $('#inputTitle').val(data.title)
            $('#inputSystemStatus').val(JSON.parse($('#sys_stt').text())[data.system_status][1])
            if (data.system_status >= 3) $('#add_new_line').addClass('disabled')
            // load datepicker for request date
            $('#inputRequestDate').val(moment(data.request_date, 'YYYY-MM-DD').format('DD/MM/YYYY')).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY'
                },
                maxYear: parseInt(moment().format('YYYY'), 10)
            })
            data.employee_inherit = {...data.employee_inherit, ...{selected: true}}
            $EmpElm.attr('data-onload', JSON.stringify(data.employee_inherit))
                .initSelect2({'templateResult': employeeTemplate})

            // wait until dropdown employee inherit init loaded then trigger element
            const awEmp = setInterval(function () {
                if ($EmpElm.hasClass("select2-hidden-accessible")) {
                    // Select2 has been initialized
                    clearInterval(awEmp)
                    let detail_data = $('<script type="application/json" id="temp_data_detail">')
                    detail_data.text(JSON.stringify(data.detail_data))
                    $('body').append(detail_data)
                    $EmpElm.trigger('Employee.Loaded')

                    // set workflow runtime + active zone
                    WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
                }
            }, 200)
            if (data.system_status >= 2) $('#idxRealAction').remove()
            if (data.system_status < 3)
                validApproved(data.detail_data)
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )

    // form submit
    SetupFormSubmit.validate($FormElm, {
        rules: {
            title: {
                required: true,
            },
            request_date: {
                required: true,
            },
            employee_inherit: {
                required: true,
            },
        },
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })

})