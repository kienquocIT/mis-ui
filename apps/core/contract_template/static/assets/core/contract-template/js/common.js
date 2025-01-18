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