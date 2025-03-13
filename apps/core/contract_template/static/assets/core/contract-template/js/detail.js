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

            const table = $('<table class="table table-bordered  mb-0"><thead><tr>' +
                `<th style="width: 50%">${$.fn.gettext('keyword')}</th><th style="width: 50%">${$.fn.gettext('User assign')}</th>` +
                '</tr></thead></table>')
            for (let key in data.extra_data){
                let item = data.extra_data[key]
                table.append('<tr>' +
                    `<th scope="row">${key}</th>` +
                    `<td>${item?.full_name}</td>` +
                    '</tr>')
            }
            $('.user_assign label').after(table)
            table.data('data-extra_data', data.extra_data)
        }
    })
});