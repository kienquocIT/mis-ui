$(document).ready(function () {
    // get info
    $.fn.callAjax2({
        url: $('#form_contract_template').attr('data-url'),
        method: 'get',
        isLoading: true,
        'sweetAlertOpts': {
            'allowOutsideClick': true,
            'showCancelButton': true
        }
    }).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            $('input[name="title"]').val(data.title)
            $('select[name="application"]').append(`<option value="${data.application.id}" selected>${
                data.application.title}</option>`)
            window.signObj.init(data.signatures)
            $('#txt_template').text(data.template)
            window.is_editor.init()
        }
    })
});