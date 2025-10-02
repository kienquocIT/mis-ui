$(document).ready(function(){

    SetupFormSubmit.validate(
        $('.form_main'),
        {
            errorClass: 'is-invalid cl-red',
            submitHandler: function (form) {
                const serializerArray = SetupFormSubmit.serializerObject(form)
                const data = {};
                for (let key in serializerArray) {
                    const item = serializerArray[key]
                    if (item) data[key] = item
                }
                let $applicationsEle = $('#box_applications');
                let appData = [];
                for (let appID of $applicationsEle.val() || []) {
                    appData.push(SelectDDControl.get_data_from_idx($applicationsEle, appID));
                }
                data['applications_data'] = appData;
                let method = 'post'
                if (data?.id) method = 'put'
                $.fn.callAjax2({
                    url: form.attr('data-url'),
                    method: method,
                    data: data,
                    isLoading: true,
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success');
                        $(form)[0].reset();
                        setTimeout(() => {
                            window.location.href = $(form).attr('data-url-redirect');
                        }, 1000);
                    }
                }, (errs) => {
                    $.fn.switcherResp(errs);
                })
            }
        })

    function init() {
        FormElementControl.loadInitS2($('#box_applications'), [], {}, null, true);
    }
    init();

});