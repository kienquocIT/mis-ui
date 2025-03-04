$(document).ready(function () {
    // run editor
    window.is_editor = new tiny_editor();
    const $modal = $('#modal_sign_definition')

    function sendData(opt, form){
        $.fn.callAjax2(opt).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.notifyB({description: data.message}, 'success')
                $(form)[0].reset();
                setTimeout(() => {
                    window.location.replace(form.attr('data-redirect'));
                }, 1000)
            }
        }, (errs) => {
            $.fn.switcherResp(errs);
        })
    }

    // handle form SUBMIT
    SetupFormSubmit.validate(
        $('#form_contract_template'),
        {
            submitHandler: function (form) {
                let contractData = {};
                const serializerArray = SetupFormSubmit.serializerObject(form);
                const extra_data = $('.user_assign table').data('data-extra_data')
                for (let key in serializerArray) {
                    const item = serializerArray[key]
                    if (item) contractData[key] = item
                }
                let matches = contractData?.template.match(/{{(.*?)}}/g);
                if (matches) {
                    matches = matches.map(function (item) {
                        return item.replace(/{{|}}/g, '').trim();
                    });
                }
                if (matches.length){
                    let html = '';
                    for (let item of matches) {
                        let temp = '';
                        if (extra_data?.[item] && extra_data[item].length){
                            temp = extra_data[item].map(function (val) {
                                return `<option value="${val.id}" selected>${val.full_name}</option>`
                            })
                        }

                        html += `<div class="item_sign">` +
                            `<input type="text" class="form-control" readonly value="${item}"><strong> : </strong>` +
                            `<div><select class="form-select" id="sign_emp_${item}" data-allowClear="true">${temp}</select></div></div>`
                    }
                    $modal.find('.modal-body').html('').append(html)
                    $('.modal-body select', $modal).each(function () {
                        $(this).initSelect2({
                            ajax: {
                                url: $('#url-factory').attr('data-employee'),
                                method: 'GET',
                            },
                            keyResp: 'employee_list',
                            keyText: 'full_name',
                            keyId: "id",
                        }).on('select2:select', function(e){
                            $(this).data('data-select', {
                                id: e.params.data.id,
                                code: e.params.data.data.code,
                                full_name: e.params.data.data.full_name
                            })
                        }).on('select2:unselect', function(){
                            $(this).removeData('data-select')
                        })
                    });
                }

                const optionSubmit = {
                    url: form.attr('data-url'),
                    method: form.attr('data-method'),
                    data: contractData,
                    isLoading: true,
                    sweetAlertOpts: {
                        'allowOutsideClick': true,
                        'showCancelButton': true
                    },
                };
                let has_assign = true;
                if (extra_data && Object.keys(extra_data).length){
                    for (let idx in extra_data){
                        if (extra_data[idx].length <= 0){
                            has_assign = false
                            break;
                        }
                    }
                    if (extra_data.length !== matches.length) has_assign = false
                }
                else if (matches.length) has_assign = false
                if (!has_assign)
                    Swal.fire({
                        title: $.fn.gettext("User Signature Definition"),
                        text: $.fn.gettext("Template include signature keyword do you want to assign user"),
                        icon: "question",
                        showCancelButton: false,
                        confirmButtonText: $.fn.gettext('Okay'),
                        showDenyButton: true,
                        denyButtonText: $.fn.gettext('Let me see')
                    }).then((result) => {
                        if (result.value) {
                            $('#modal_sign_definition').modal('show');
                        } else return false
                    })
                else{
                    optionSubmit.data['extra_data'] = extra_data
                    sendData(optionSubmit, form)
                }

                $('#confirm_definition').off().on('click', function (e) {
                    e.preventDefault();
                    let extraData = {}
                    $('#modal_sign_definition .modal-body .item_sign').each(function () {
                        const self_key = $(this).find('input').val()
                        extraData[self_key] = $(this).find('select').data('data-select')
                    });
                    optionSubmit.data['extra_data'] = extraData
                    sendData(optionSubmit, form)
                })
            }
        }
    );
});

class tiny_editor {
    init(data= []){
        const $txtArea = $('#txt_template');
        let opt = {
            height: 500,
            menubar: false,
            plugins: ['columns', 'print', 'preview', 'paste', 'importcss', 'searchreplace', 'autolink', 'autosave',
                'save', 'directionality', 'code', 'visualblocks', 'visualchars', 'fullscreen', 'image', 'link', 'media',
                'template', 'codesample', 'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc',
                'insertdatetime', 'advlist', 'lists', 'wordcount', 'imagetools', 'textpattern', 'noneditable',
                'help', 'charmap', 'quickbars', 'emoticons'],
            toolbar: 'bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist table twoColumn threeColumn | preview pagebreak removeformat print visualblocks | template | rarely_used',
            quickbars_insert_toolbar: 'link image | numlist bullist table twoColumn threeColumn | hr pagebreak',
            toolbar_groups: {
                rarely_used: {
                    icon: 'more-drawer',
                    tooltip: 'Rarely Used',
                    items: 'ltr rtl | charmap emoticons | superscript subscript | nonbreaking anchor media | undo redo | '
                }
            },
            font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Cambria=cambria,serif; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
            pagebreak_split_block: true,
            pagebreak_separator: '<span class="page-break-here"><!-- my page break --></span>',
            nonbreaking_force_tab: true,
            insertdatetime_formats: ['%d-%m-%Y %H:%M:%S', '%d-%m-%Y', '%H:%M:%S', '%I:%M:%S %p'],
            content_style: `
                body { font-family: Cambria,sans-serif; font-size: 12pt; }
                @import url('/static/assets/fonts/cambria/Cambria.ttf');
                @media print {
                    .mce-visual-caret {
                        display: none;
                    }
                }
            `
        }
        if (data) opt['data'] = data
        $.fn.callAjax2({
            url: $('#url-factory').attr('data-template'),
            method: 'GET',
            isLoading: true,
            sweetAlertOpts: {
                'allowOutsideClick': true,
                'showCancelButton': true
            },
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                opt.templates = data.templates
                $txtArea.tinymce(opt);
            }
        })
    }
}