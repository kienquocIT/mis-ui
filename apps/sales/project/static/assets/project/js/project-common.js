$(document).ready(function(){
    const $FormElm = $('#project_form');

    function submitHandleFunc() {
        const frm = new SetupFormSubmit($FormElm);
        let formData = frm.dataForm;
        formData['employee_inherit_id'] = $('#selectEmployeeInherit').val()
        formData['start_date'] = moment(formData['start_date']).format('YYYY-MM-DD')
        formData['finish_date'] = moment(formData['finish_date']).format('YYYY-MM-DD')
        $.fn.callAjax2({
            'url': frm.dataUrl,
            'method': frm.dataMethod,
            'data': formData,
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)){
                    $.fn.notifyB({description: data.message}, 'success');
                    $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                }
            },
            (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            }
        )
    }

    // form submit
    SetupFormSubmit.validate($FormElm, {
        errorClass: 'is-invalid cl-red',
        submitHandler: submitHandleFunc
    })
});
