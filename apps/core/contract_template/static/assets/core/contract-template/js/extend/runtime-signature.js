class PrepareSign {
    init(){
        const $requestElm = $('.request_sign');
        const $ModalElm = $('#modal_prepare_sign');
        $requestElm.removeClass('hidden')

        $ModalElm.on('shown.bs.modal', function(){
            const data = tinymce.activeEditor.getContent()
            let matches = data.match(/{{(.*?)}}/g);
            if (matches) {
                matches = matches.map(function (item) {
                    return item.replace(/{{|}}/g, '').trim();
                });
            }
            let html = ''
            for (let item of matches) {
                html += `<div class="item_sign">` +
                    `<input type="text" class="form-control" readonly value="${item}"><strong> : </strong>` +
                    `<div><select class="form-select" id="sign_emp_${item}" multiple data-allowClear="true" data-closeOnSelect="false"></select></div></div>`
            }

            $ModalElm.find('.modal-body').html('').append(html)
            $('.modal-body select', $ModalElm).each(function () {
                $(this).initSelect2({
                    ajax: {
                        url: $('#url-factory').attr('data-employee'),
                        method: 'GET',
                    },
                    keyResp: 'employee_list',
                    keyText: 'full_name',
                    keyId: "id",
                })
            });

            $('#submit_runtime').on('click', function(){
                let data_form = {
                    'employee_contract': $('#contract_id').val(),
                    'contract': data,
                }
                let signature_list = {}
                let value_count = 0
                $('.item_sign').each(function () {
                    const key = $(this).find('input').val();
                    const value = $(this).find('select').val() || []
                    const old = data_form.members || []
                    if (!value.length) return false
                    value_count++
                    signature_list[key] = {}
                    signature_list[key]['assignee'] = value
                    signature_list[key]['stt'] = false
                    data_form.members = old.concat(value)
                });
                data_form['signatures'] = signature_list
                if (value_count !== matches.length) {
                    $('#modal_prepare_sign').prepend(`<ul><li><p class="text-warning">${
                        $.fn.gettext('Signature and employee not equal')}</p></li></ul>`)
                    return false
                }
                data_form.csrfmiddlewaretoken = $('#frm_employee_hrm input[name="csrfmiddlewaretoken"]').val()
                // todo here đang check đến đây

                $.fn.callAjax2({
                    url: $('#url-factory').attr('data-contract-sign'),
                    method: 'POST',
                    isLoading: true,
                    sweetAlertOpts: {
                        'allowOutsideClick': true,
                        'showCancelButton': true
                    },
                    data: data_form
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success');
                        $('#modal_prepare_sign').modal('hide');
                        $('.request_sign').addClass('hidden');
                    }
                });
            })
        })
    }
}