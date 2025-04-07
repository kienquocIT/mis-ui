$(document).ready(function (){
    $('#btn-instruction-editor').on('click', function (){
        $('#idx-instruction-editor').fadeToggle('fast');
    })

    // Array to store blob images
    let blobImageStore = []

    let frm = $('#frm-detail-print-template');
    if (frm.attr('data-url')){
        $.fn.callAjax2({
            url: frm.attr('data-url'),
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('template_detail')){
                    let detail = data.template_detail;
                    // application
                    $('#inp-application').initSelect2({
                        data: [{
                            ...detail.application,
                            selected: true,
                        }]
                    })
                    // Title
                    $('#inp-title').val(detail.title || '');
                    // Remarks
                    $('#inp-remarks').val(detail.remarks || '');

                    //
                    let activeEle = $('#inp-is-active');
                    let defaultEle = $('#inp-is-default');
                    // Active
                    activeEle.prop('checked', detail?.['is_active'] === true).on('change', function (){
                        if ($(this).prop('checked') === false) defaultEle.prop('checked', false);
                    });
                    // Default
                    defaultEle.prop('checked', detail?.['is_default'] === true).on('change', function (){
                        if ($(this).prop('checked') === true) activeEle.prop('checked', true);
                    });
                    // content
                    let txtArea = $('#inp-contents');
                    let templateUrl = frm.attr('data-url-template')
                    PrintTinymceControl.init_tinymce_editable(txtArea, detail?.['application']?.['id'], {
                        height: 682,
                        readonly: 0,
                        templateUrl: templateUrl,
                        images_upload_handler: function (blobInfo, success, failure) {
                            let blob = blobInfo.blob()
                            let blobUrl = URL.createObjectURL(blob) // Create a blob URL
                            blobImageStore.push({
                                blob: blob,           // Store the Blob object
                                blobUrl: blobUrl,     // Store the blob URL
                                filename: blobInfo.filename()
                            });
                            success(blobUrl); // Display the image in TinyMCE as a blob URL
                        },
                        automatic_uploads: true, // Automatically upload pasted images
                        paste_data_images: true,
                    }, detail.contents);
                    // Print
                    $('#idx-btn-print').on('click', function (){
                        txtArea.tinymce().execCommand('mcePrint');
                    })
                }
            },
            (errs) => $.fn.switcherResp(errs),
        );

        let stateChange = null;
        window.addEventListener('beforeunload', function (event) {
            if (stateChange === true) event.stopImmediatePropagation();
        });

        new SetupFormSubmit(frm).validate({
            submitHandler: function (form, event){
                let frmSetup = new SetupFormSubmit(frm);
                let bodyData = frmSetup.dataForm;
                bodyData['is_default'] = $(form).find('input[name="is_default"]').prop('checked');
                bodyData['is_active'] = $(form).find('input[name="is_active"]').prop('checked');
                console.log(bodyData)

                // Get TinyMCE images with blob url
                let txtArea = $('#inp-contents');
                let editor = txtArea.tinymce()
                let content = editor.getContent()
                let $content = $('<div>').html(content)
                let blobImages = $content.find('img[src^="blob:"]')
                if (blobImages.length > 0) {
                    let uploadPromises = [];
                    blobImages.each(function (index) {
                        let blobUrl = $(this).attr('src')
                        let blobData = blobImageStore.find(item => item?.blobUrl === blobUrl)
                        let blob = blobData.blob
                        let fileName = blobData.filename
                        let formData = new FormData()
                        formData.append('file', blob, fileName)
                        // Promise to upload each image
                        uploadPromises.push(
                            $.fn.callAjax2({
                                url: frm.attr('data-url-upload'),
                                method: 'POST',
                                data: formData,
                                contentType: 'multipart/form-data'
                            }).then(
                                (resp) => {
                                    let data = $.fn.switcherResp(resp);
                                    return {
                                        index: index,
                                        url: data?.['file_detail']?.['url'] //get url of file stored in server
                                    };
                                },
                                (errs) => {
                                    console.error('Upload error:', errs);
                                    return null;
                                }
                            )
                        );
                    });

                    // Wait for all uploads to complete
                    Promise.all(uploadPromises).then((results) => {
                        results.forEach((result) => {
                            if (result) {
                                // Update the src of the corresponding img
                                blobImages.eq(result.index).attr('src', result.url)
                            }
                        });

                        // Update TinyMCE content with new URLs
                        editor.setContent($content.html())
                        bodyData['contents'] = editor.getContent()

                        $.fn.callAjax2({
                            url: frmSetup.dataUrl,
                            method: frmSetup.dataMethod,
                            data: bodyData,
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyB({
                                        'description': $.fn.transEle.attr('data-success'),
                                    }, 'success');
                                    stateChange = true

                                    // clean up blob objects after finish
                                    blobImageStore.forEach(item => URL.revokeObjectURL(item.blobUrl))

                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 1000);
                                }

                            },
                            (errs) => $.fn.switcherResp(errs)
                        )
                    }).catch((error) => {
                        console.error('Error uploading images:', error);
                    });
                } else {
                    // No blob images, submit directly
                    bodyData['contents'] = content;
                    $.fn.callAjax2({
                        url: frmSetup.dataUrl,
                        method: frmSetup.dataMethod,
                        data: bodyData,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                $.fn.notifyB({
                                    'description': $.fn.transEle.attr('data-success'),
                                }, 'success');
                                stateChange = true;
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1000);
                            }
                        },
                        (errs) => $.fn.switcherResp(errs)
                    );
                }
            }
        })
    }
})