$(document).ready(function () {
    $.fn.callAjax2({
        url: $('#form_contract_template').attr('data-detail'),
        method: 'get',
        isLoading: true,
        'sweetAlertOpts': {
            'allowOutsideClick': true,
            'showCancelButton': true
        }
    }).then((resp) => {``
        let data = $.fn.switcherResp(resp);
        if (data) {
            $('input[name="title"]').val(data.title)
            $('select[name="application"]').append(`<option value="${data.application.id}" selected>${
                data.application.title}</option>`).prop('disabled', true)
            $('#txt_template').text(data.template);
            window.is_editor.init()
            setTimeout(()=>{
                tinymce.activeEditor.setMode('readonly');
            }, 200)
        }
    })
});