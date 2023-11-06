const $FormElm = $('#leave_edit')

$(document).ready(function () {

    // get detail request info
    $.fn.callAjax2({
        'url': $urlElm.attr('data-leave-detail'),
        'method': 'GET',
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp).leave_request_detail
            WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id'])
            $x.fn.renderCodeBreadcrumb(data);
            $('#inputTitle').val(data.title)
            $('#inputSystemStatus').val(JSON.parse($('#sys_stt').text())[data.system_status][1])

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

            $EmpElm.attr('data-onload', JSON.stringify(data.employee_inherit)).append(
                `<option selected value="${data.employee_inherit.id}">${
                    data.employee_inherit.full_name}</option>`).initSelect2()

            // wait until dropdown employee inherit init loaded then trigger element
            const awEmp = setInterval(function () {
                if ($EmpElm.hasClass("select2-hidden-accessible")) {
                    // Select2 has been initialized
                    clearInterval(awEmp)
                    let detail_data = $('<script type="application/json" id="temp_data_detail">')
                    detail_data.text(JSON.stringify(data.detail_data))
                    $('body').append(detail_data)
                    $EmpElm.trigger('Employee.Loaded')
                }
            }, 200)
        },
        (err) => $.fn.notifyB({description: err.data.errors}, 'failure')
    )

    // form submit
    SetupFormSubmit.validate($FormElm,{
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