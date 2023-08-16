$(document).ready(function () {
    $("#form-edit-company").submit(function (event) {
        event.preventDefault();
        let csr = $("input[name=csrfmiddlewaretoken]").val();
        let frm = new SetupFormSubmit($(this));
        $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: resp.detail}, 'success')
                        setTimeout(location.reload.bind(location), 1000);
                        window.location = '/company/list';
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.detail}, 'failure')
                }
            )
    });

    $("input[class=form-control]").each(function() {
      if ($(this).val() === 'None') {
          $(this).val('')
      }
    });

    if ($("input[name=representative_fullname]").val() === '') {
        $("input[name=representative_fullname]").val($("input[name=default_representative_name]").val())
    }

    console.log('renderCodeBreadcrumb: ', $('#form-code').val())
    $x.fn.renderCodeBreadcrumb({
        'code': $('#form-code').val(),
    })
});