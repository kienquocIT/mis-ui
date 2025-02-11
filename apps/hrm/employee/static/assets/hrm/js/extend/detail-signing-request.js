$(document).ready(function () {
    const runtimeStage = new SigningRequest();
    runtimeStage.init()
});

class SigningRequest {
    getRuntimeStage() {
        const $formElm = $('#form_signing_request')
        $.fn.callAjax2({
            url: $formElm.attr('data-url'),
            method: 'GET',
            // isLoading: true,
            // sweetAlertOpts: {
            //     'allowOutsideClick': true,
            //     'showCancelButton': true
            // }
        }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    console.log(data)
                }
            },
            (error) => {
                console.log(error)
                // $.fn.notifyB({description: error.data.errors || $.fn.gettext('Page Not Found') }, 'failure');
            });
    }

    actionBtn(){
        const $drawSignature = $('#modal_draw_signature');
        $('#btn_allow_signing').off().on('click', function(){
            console.log('is signing')
        })
    }

    init() {
        this.getRuntimeStage()
        this.actionBtn()
    }
}