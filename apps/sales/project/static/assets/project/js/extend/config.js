$(document).ready(function(){
    let $selectElm = $('#select_project_pm'), $ConfigForm = $('#prj_config_form');
    function employeeTemplate(state) {
        if (!state.id) return state.text
        return $(`<p><span>${state.text}</span> <span class="badge badge-soft-success">${state?.data?.group?.title || '--'}</span></p>`)
    }

    // init submit form
    $ConfigForm.on('submit', function(e){
        e.preventDefault();
        e.stopPropagation();
        let data = {}, $btn = $('button[form="prj_config_form"]'), _empLst = $selectElm.val();
        if (_empLst.length) data = {'person_can_end': _empLst}
        else return false

        $btn.attr('disabled', true)

        $.fn.callAjax2({
            'url': $ConfigForm.attr('data-url'),
            'method': 'put',
            'data': data
        }).then(
            (resp) => {
                const res = $.fn.switcherResp(resp);
                if (res) {
                    $btn.attr('disabled', false)
                    $.fn.notifyB({description: res?.message || res?.detail}, 'success')
                }
            },
            (err) => {
                $.fn.notifyB({description: err?.data?.errors}, 'failure')
                $btn.attr('disabled', true)
            }
        )
    });

    // load config
    $.fn.callAjax2({
        'url': $ConfigForm.attr('data-url'),
        'method': 'get'
    }).then(
        (resp) => {
            const res = $.fn.switcherResp(resp);
            if (res) {
                $('#id').val(res.id)
                // init employee select
                $selectElm.attr('data-onload', JSON.stringify(res.person_can_end)).initSelect2(
                    {'templateResult': employeeTemplate})
            }
        },
        (err) => $.fn.notifyB({description: err?.data?.errors}, 'failure')
    )

});