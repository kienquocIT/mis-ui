$(document).ready(function () {
    const runtimeStage = new SigningRequest();
    runtimeStage.init()

    // load attachment when choose image signature
    $("#fileInput").on("change", function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var base64String = e.target.result;
                $('.img-draw').html(`<img id="previewImage" src="${base64String}" />`)
            };
            reader.readAsDataURL(file); // tranfer to Base64
        }
    });

    // load canvas
    const $btnTabTbl2 = $('a.nav-link[href="#tab_block_2"]')
    $btnTabTbl2.on('shown.bs.tab', function(){
        const $canvas = $('#signature_element');
        const width = $canvas.closest('#tab_block_2').width();
        const height = 1 / 3 * width;
        if (!$('.canvas-container').length) {
            const canvas = new fabric.Canvas($canvas[0], {
                isDrawingMode: true,
            });
            canvas.setWidth(width);
            canvas.setHeight(height);
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);

            $('#sign_clear').on('click', () => canvas.clear());

            if (canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = '#000';
                canvas.freeDrawingBrush.width = 4
            }

            // khi user vẽ xong
            canvas.on('mouse:up', function (event) {
                setTimeout(() => {
                    $('.img-draw').html(`<img id="previewImage" src="${canvas.toDataURL("image/png")}" />`)
                }, 1000);
            });

            // Nếu cần xử lý thêm riêng cho cảm ứng:
            canvas.upperCanvasEl.addEventListener("touchend", function (event) {
                setTimeout(() => {
                    $('.img-draw').html(`<img id="previewImage" src="${canvas.toDataURL("image/png")}" />`)
                }, 1000);
            });
        }
    });

    // when click button SIGN load draw tool
    var target = $(".draw-sign")[0];
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (window.getComputedStyle(target).display === "block") {
                $btnTabTbl2.tab('show');
            }
        });
    });

    observer.observe(target, {attributes: true, attributeFilter: ["style", "class"]});
});

class SigningRequest {
    getRuntimeStage() {
        const $formElm = $('#form_signing_request');
        const _this = this
        $.fn.callAjax2({
            url: $formElm.attr('data-url'),
            method: 'GET',
        }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $('#id', $formElm).val(data.id)
                    let employee_current = $x.fn.getEmployeeCurrentID();
                    let user_sign = {}
                    let fist_false = null
                    let dataClone = data.contract
                    for (let idx in data.signatures){
                        let item = data.signatures[idx]
                        if (!item.stt){
                            fist_false = fist_false === null
                            if (item?.assignee?.id === employee_current && Object.keys(user_sign).length <= 0 && fist_false)
                                user_sign[idx] = item
                            data.contract = data.contract.replace('{{' + idx + '}}', `<img class="sign_img" id="${idx}" src="/static/assets/hrm/img/contract_runtime/sign_document.png" />`)
                        }
                    }
                    $('#content').html(data.contract)
                    $('.wrap-hd-review').data('contract', dataClone).data('user_sign', user_sign)

                    _this.renderHistory(data.signatures)

                    if (!Object.keys(user_sign).length) $('.wrap_action button').prop('disabled', true)

                    // create PDF view
                    splitIntoPages('.wrap-hd-review')
                }
            },
            (error) => {
                $.fn.notifyB({description: error.data.errors || $.fn.gettext('Page Not Found') }, 'failure');
            });
    }

    actionBtn(){
        const $drawSignature = $('#btn_allow_signing');
        const $modalDrawSign = $('.draw-sign');

        $drawSignature.add('.draw-header .btn-close').off().on('click', () => $modalDrawSign.toggleClass('show'));
        $('.history-sign button').off().on('click', () => $('.history_wrap_content').toggleClass('is_show'));

        $('#submit_runtime').on('click', ()=>{
            const docsElm = $('.wrap-hd-review');
            const imgData = $('.img-draw img').attr('src');
            const user_data = docsElm.data('user_sign')
            let contract = docsElm.data('contract');

            if (imgData.startsWith("data:image/")){
                contract = contract.replace(`{{${Object.keys(user_data)[0]}}}`,
                    `<img class="signed_img" src="${imgData}"/>`)
                $(`#${Object.keys(user_data)[0]}`, docsElm).attr('src', imgData)
                    .removeAttr('id')
                    .addClass('signed_img')
                    .removeClass('sign_img')

                $modalDrawSign.toggleClass('show')
                this.userSubmit({'contract': contract, 'is_sign': true})
            }

        });

        $('#btn_reject_signing').off().on('click', ()=>{
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var imgElement = document.getElementsByClassName("reject_url_img");
            canvas.width = imgElement[0].naturalWidth
            canvas.height = imgElement[0].naturalHeight
            ctx.drawImage(imgElement[0], 0, 0);

            const docsElm = $('.wrap-hd-review');
            const user_data = docsElm.data('user_sign');
            let contract = docsElm.data('contract');

            contract = contract.replace(`{{${Object.keys(user_data)[0]}}}`,
                    `<img class="signed_img" src="${canvas.toDataURL("image/png")}"/>`)
            $(`#${Object.keys(user_data)[0]}`, docsElm).attr('src', canvas.toDataURL("image/png"))
                    .removeAttr('id')
                    .addClass('signed_img')
                    .removeClass('sign_img')
            this.userSubmit({'contract': contract})
        });
    }

    renderHistory(data){
        const $wrapHTML = $('.history_wrap_content');
        let start = false;
        const icon = {
            1: {cls: 'fa-solid fa-xmark', clr: '#ff3d3d', txt: $.fn.gettext('Rejected')},
            2: {cls: 'fa-solid fa-check', clr: '#3de09e', txt: $.fn.gettext('Signed')},
            3: {cls: 'fa-solid fa-signature', clr: '#5ca8ff', txt: $.fn.gettext('Signing'), cls2: 'is_active'},
            4: {cls: 'fa-solid fa-hourglass-half', clr: '#80808080', txt: $.fn.gettext('Upcoming'), cls2: 'is_disabled'},
        };
        for (let idx in data){
            const item = data[idx];
            let checkSTT = {};
            if (item?.['stt'] === false && start === false){
                checkSTT = icon[3]
                start = true
            }
            else if (item?.['stt'] === false && start === true)  checkSTT = icon[4]
            else if (item?.['stt'] === true && item.assignee?.['is_reject']) checkSTT = icon[1]
            else if (item?.['stt'] === true && item.assignee?.is_sign) checkSTT = icon[2]
            let itemHTML = $(`<div class="step-item ${checkSTT?.cls2 ? checkSTT.cls2 : ''}">`)
            $wrapHTML.append(itemHTML)
            itemHTML.append(`<span style="color:${checkSTT.clr}"><i class="${checkSTT.cls}"></i></span>`)
            itemHTML.append(`<h3 style="color:${checkSTT.clr}">${checkSTT.txt}</h3>`)
            itemHTML.append(`<h5>${item.assignee?.['full_name']}</h5>`)
            itemHTML.append(`<p>${item.assignee?.['date_sign'] ? item.assignee['date_sign'] : 'DD/MM/YYYY hh:mm:ss AM'}</p>`)
        }
    }

    userSubmit(data){
        const $formElm = $('#form_signing_request');
        const $modalDrawSign = $('.draw-sign');

        if (data){
            $.fn.callAjax2({
                url: $formElm.attr('data-url'),
                method: 'PUT',
                data: data
            }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    $modalDrawSign.removeClass('show')
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(()=> window.location.reload(), 1000)

                },
                (error) => {
                    $modalDrawSign.removeClass('show')
                    $.fn.notifyB({description: error.data.errors}, 'failure');
                });
        }
    }

    init() {
        this.getRuntimeStage()
        this.actionBtn()
    }
}
