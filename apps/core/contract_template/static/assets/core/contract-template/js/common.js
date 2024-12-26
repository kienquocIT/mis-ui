$(document).ready(function () {
    // run editor
    var is_editor = new tiny_editor()
    window.is_editor = is_editor

    // handle form SUBMIT
    SetupFormSubmit.validate(
        $('#form_contract_template'),
        {
            submitHandler: function (form) {
                let contractData = {};
                const serializerArray = SetupFormSubmit.serializerObject(form);
                for (let key in serializerArray) {
                    const item = serializerArray[key]
                    if (item) contractData[key] = item
                }

                $.fn.callAjax2({
                    url: form.attr('data-url'),
                    method: form.attr('data-method'),
                    data: contractData,
                    isLoading: true,
                    sweetAlertOpts: {
                        'allowOutsideClick': true,
                        'showCancelButton': true
                    },
                }).then((resp) => {
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
        }
    );
});

class signaturesHandle {

    template (idx=null){
        return `<div class="block-index-${idx}" tabindex="${idx}" >` +
                `<div class="wrap-param">` +
                    `<input class="form-control"><b> : </b>` +
                    `<div><select
                        class="select2 form-select"
                        data-method="GET"
                        data-keyResp="employee_list"
                        data-keyText="full_name" data-keyId="id"
                        data-allowClear="true"
                        multiple
                        data-closeOnSelect="false"
                    ></select></div>` +
                `</div>` +
                `<div class="wrap-action">` +
                    `<span class="text-danger del-row font-5" title="delete param"><i class="bi bi-x-octagon"></i></span>` +
                `</div>` +
            `</div>`
    }

    active_action(elm){
        const idx = elm.attr('class').slice("block-index-".length);
        const _this = this;
        // delete row
        $('.del-row:not(.disabled)', elm).on('click', function(){
            $(this).closest(`div[class*="block-index-${idx}"]`).remove()
        })

        // on focus add new row
        $('.select2', elm).initSelect2({
            ajax: {
                url: $('#url-factory').attr('data-employee'),
                method: 'GET',
            },
        }).on('select2:select', function(e){
            const sltData = e.params.data.data
            let old = $('input', elm).data('data-key') || []
            old.push({
                "id": sltData.id,
                "full_name": sltData.full_name,
                "first_name": sltData.first_name,
                "last_name": sltData.last_name,
                "selected": true
            })
            $('input', elm).data('data-key', old)
        });

        $('#signatures > div:last-child').on('click', function(e){
            // kiểm tra nếu last child mới tiếp tục check
            if (!$(this).is(":last-child")) return false
            const t_val = $(this).find('.wrap-param > input').val();
            if (!t_val && e.target.parentElement.classList.value.indexOf('del-row') === -1){
                let newElm = $(_this.template($('#signatures > div').length + 1))
                $('#signatures').append(newElm)
                _this.active_action(newElm)
            }
        })

        // on type first child
        $('.wrap-param > input', elm).on('keyup', function (){
            const regex = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/g;
            this.value = this.value.replace(regex, '')
        })
    }

    init(data=[], is_detail=false){
        const $signElm = $('#signatures')
        // nếu không phải là detail page thì load template đầu tiên
        if (Object.keys(data).length === 0 && !is_detail){
            let html = $(this.template(1))
            html.find('.del-row').addClass('disabled')
            $signElm.html('').append(html)
            this.active_action(html)
        }
        else if (Object.keys(data).length > 0){
            let idx = 1
            $signElm.html('')
            for (let key in data){
                const item = data[key]
                let html = $(this.template(idx))
                html.find('input').val(key)
                html.find('select').attr('data-onload', JSON.stringify(item))
                if (idx === 1) html.find('.del-row').addClass('disabled')
                $signElm.append(html)
                html.find('input').data('data-key', item)
                if (!is_detail) this.active_action(html)
                else $('.select2', html).prop('disabled', true).initSelect2()
                idx++
            }
        }
    }
}

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