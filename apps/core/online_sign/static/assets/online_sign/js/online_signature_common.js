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
                    const date = new Date().getTime()
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
        }).then((resp) => {
            let detailFile = resp?.data?.detail ? resp.data.detail : resp?.data?.['file_detail'];
            console.log(detailFile)
            const fileID = detailFile.id;
            let lst = []
            lst.push(detailFile)
            this.checkInit(lst)
            // clsThis.setIdFile(detailFile?.['id']);
            // clsThis.setFileNameUploaded(detailFile?.['file_name'], detailFile?.['file_size']);
        }, (errs) => {
            // progressBarEle.remove();
            // let existData = errs?.data?.['errors']?.['exist'];
            console.log(errs);
            // todo here
        });


    }

    checkInit(Data){
        const isInit = $('#attach_sign .dad-file-control-group').find('.dm-uploader-initializer').length > 0
        const attchElm = $('#attach_sign')
        if (isInit){
            // đã init => reinit lại data
            attchElm.find('.dm-uploader-results input[name="attachment"]').remove()
            attchElm.find('.dm-uploader').dmUploader("destroy");
        }
        new $x.cls.file(
            attchElm,
            {
                allowedTypes: 'image',
                extFilter: ['png'],
            }
        ).init({
            name: 'attach_sign',
            enable_edit: true,
            data: Data,
        });

    }
}
var activeSignature;

$(document).ready(function () {
    activeSignature = new Signature();
    activeSignature.init()
})