$(document).ready(function (){
    $('#btn-instruction-editor').on('click', function (){
        $('#idx-instruction-editor').fadeToggle('fast');
    })

    let frm = $('#frm-new-print-template');

    let txtArea = $('#inp-contents');
    let btnPrint = $('#idx-btn-print');

    // Array to store blob images
    let blobImageStore = []

    $('#inp-application').initSelect2().on('change', function (){
        txtArea.prop('disabled', false);
        btnPrint.prop('disabled', false);
        if (txtArea.tinymce()) txtArea.tinymce().destroy();
        let templateUrl = frm.attr('data-url-template')
        PrintTinymceControl.init_tinymce_editable(txtArea, $(this).val(), {
            height: 420,
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
        });
    })

    let stateChange = null;
    window.addEventListener('beforeunload', function (event) {
        if (stateChange === true) event.stopImmediatePropagation();
    });

    new SetupFormSubmit(frm).validate({
        submitHandler: function (form, event){
            let frmSetup = new SetupFormSubmit(frm);
            let bodyData = frmSetup.dataForm

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

                                setTimeout(
                                    () => {
                                        window.onbeforeunload = null;
                                        window.location.href = frm.attr('data-url-redirect');
                                    },
                                    1000
                                )
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
                            setTimeout(
                                () => {
                                    window.onbeforeunload = null;
                                    window.location.href = frm.attr('data-url-redirect');
                                },
                                1000
                            )
                        }
                    },
                    (errs) => $.fn.switcherResp(errs)
                );
            }
        },
    })

    // Print
    btnPrint.on('click', function (){
        txtArea.tinymce().execCommand('mcePrint');
    })
})