class Signature {
    init() {
        const clearEl = $('#sign_clear');
        const $canvas = $('#signature_element');
        const width = 570;
        const height = 9/16 * width;
        if (!$('.canvas-container').length){
            const canvas = new fabric.Canvas($canvas[0], {
                isDrawingMode: true,
            });
            canvas.setWidth(width);
            canvas.setHeight(height);
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

            clearEl.on('click', function () {
                canvas.clear();
            });

            if (canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = '#000';
                canvas.freeDrawingBrush.width = 1
            }

            $('#sign_export').on('click', () => {
                canvas.getElement().toBlob(blob => {
                    // const href = URL.createObjectURL(blob);
                    const date = moment(new Date()).format('YYYYMMDD')
                    let fileNew = new File([blob], `signature-${date}.png`, {type: blob.type});
                    this.uploadDataFile(fileNew)
                }, 'image/png');
            })
        }
    }

    // upload file to server
    uploadDataFile(dataFile) {
        let formData = new FormData();
        formData.append('file', dataFile);
        const signElm = $('#attach_sign');

        $.fn.callAjax2({
            url: signElm.find('.dad-file-control-group').attr('data-url'),
            method: 'POST',
            data: formData,
            contentType: 'multipart/form-data',
            // xhr: function () {
            //     let xhr = new XMLHttpRequest();
            //     xhr.upload.addEventListener("progress", function (evt) {
            //         if (evt.lengthComputable) {
            //             let percentComplete = evt.loaded / evt.total;
            //             percentComplete = parseInt(percentComplete * 100);
            //             progressBarEle.find('.progress-bar').alterClass('w-*', 'w-' + Math.ceil(percentComplete).toString());
            //
            //             if (percentComplete === 100) {
            //                 console.log('complete upload');
            //             }
            //
            //         }
            //     }, false);
            //     return xhr;
            // },
            // error: function (jqXHR, textStatus, errorThrown) {
            //     let resp_data = jqXHR.responseJSON;
            //     if ((!resp_data || typeof resp_data !== 'object') && jqXHR.status !== 204) {
            //         WindowControl.hideLoadingButton($(btnMainEle));
            //         progressBarEle.remove();
            //     }
            // },
        }).then((resp) => {
            let detailFile = resp?.data?.detail ? resp.data.detail : resp?.data?.['file_detail'];
            console.log(detailFile)
            const fileID = detailFile.id;

            // clsThis.setIdFile(detailFile?.['id']);
            // clsThis.setFileNameUploaded(detailFile?.['file_name'], detailFile?.['file_size']);
            // WindowControl.hideLoadingButton($(btnMainEle));
            // progressBarEle.remove();
        }, (errs) => {
            // progressBarEle.remove();
            // let existData = errs?.data?.['errors']?.['exist'];
            console.log(errs);
        });

        // let progressBarEle = $(`<div class="progress">
        //     <div
        //         class="progress-bar progress-bar-striped bg-info progress-bar-animated" role="progressbar"
        //         aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
        //     ></div>
        // </div>
        // `)
        // $(btnMainEle).parent().append(progressBarEle);
    }

    checkInit(Data){
        const isInit = $('#attach_sign .dad-file-control-group').find('.dm-uploader-initializer').length > 0
        if (isInit)
    }
}
var activeSignature;

$(document).ready(function () {
    activeSignature = new Signature();
    activeSignature.init()
})