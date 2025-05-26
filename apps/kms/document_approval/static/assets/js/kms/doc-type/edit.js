$(document).ready(function(){
    $.fn.callAjax2({
        url: $('.form_main').attr('data-url'),
        method: 'get',
        isLoading: true,
    }).then((resp) => {
        let data = $.fn.switcherResp(resp);
        if (data) {
            $('#id').val(data.id)
            $('#txt_code').val(data.code)
            $('#txt_title').val(data.title)
            if (data?.folder && Object.keys(data.folder).length > 0)
                $('#select-box-folder').html(`<option selected value="${data.folder.id}">${data.folder.title}</option>`)
        }
    })
})