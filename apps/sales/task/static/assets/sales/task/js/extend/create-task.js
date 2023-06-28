$(function(){
    // declare variable
    const $form = $('#formOpportunityTask')
    const $taskLabelElm = $('#inputLabel')

    // run single date
    $('input[type=text].date-picker').daterangepicker({
        minYear: 2023,
        singleDatePicker: true,
        timePicker: false,
        showDropdowns: true,
        // "cancelClass": "btn-secondary",
        // maxYear: parseInt(moment().format('YYYY'), 10)
        locale: {
            format: 'DD/MM/YYYY'
        }
    })

    // label handle
    class labelHandle {
        deleteLabel(elm){
            elm.find('.tag-delete').on('click', function(e){
                e.stopPropagation();
                const selfTxt = $(this).prev().text();
                elm.remove();
                let labelList = JSON.parse($taskLabelElm.val())
                const idx = labelList.indexOf(selfTxt)
                if (idx > -1) labelList.splice(idx, 1)
                $taskLabelElm.attr('value', JSON.stringify(labelList))
            })
        }
        // on click add label
        addLabel(){
            const _this = this
            $('.form-tags-input-wrap .btn-add-tag').on('click', function(){
                const $elmInputLabel = $('#inputLabelName')
                const newTxt = $elmInputLabel.val()
                let labelList = $taskLabelElm.val()
                if (labelList !== undefined && labelList.length) labelList = JSON.parse(labelList)
                if (!labelList.length) labelList = []
                labelList.push(newTxt)
                $taskLabelElm.attr('value', JSON.stringify(labelList))
                const labelHTML = $(`<span class="item-tag"><span>${newTxt}</span><span class="tag-delete">x</span></span>`)
                $('.label-mark').append(labelHTML)
                $elmInputLabel.val('')
                _this.deleteLabel(labelHTML)
            })
        }

        showDropdown(){
            $('.label-mark').off().on('click', function(){
                const isParent = $(this).parent('.dropdown')
                isParent.children().toggleClass('show')
            });
            $('.form-tags-input-wrap .btn-close-tag').on('click', function (){
                $(this).parents('.dropdown').children().removeClass('show')
            })
        }

        init(){
            this.showDropdown()
            this.addLabel()
        }
    }

    /** start run and init all function **/
    // run init label function
    let formLabel = new labelHandle()
    formLabel.init()

    // validate form
    jQuery.validator.setDefaults({
        debug: false,
        success: "valid"
    });

    $form.validate({
        errorElement: 'p',
        errorClass: 'is-invalid cl-red',
    })

    // form submit
    $form.on('submit', function (e) {
        e.preventDefault();
        let _form = new SetupFormSubmit($form);

        $.fn.callAjax(_form.dataUrl, _form.dataMethod, pickingData, csr)
            .then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                })
    })

}, jQuery)