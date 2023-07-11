function resetFormTask() {
    // clean html select etc.
    $('#formOpportunityTask').trigger('reset').removeClass('task_edit')
    $('#selectOpportunity, #selectAssignTo').val(null).trigger('change');
    $('.label-mark, .wrap-checklist, .wrap-subtask').html('');
    $('#inputLabel').val(null);
    $('[name="id"]').remove();
    const $inputAssigner = $('#inputAssigner');
    $inputAssigner.val($inputAssigner.attr('data-name'))
    $('.create-subtask').addClass('hidden')
    $('[name="parent_n"]').remove();
    window.editor.setData('')
}

$(function () {
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
        deleteLabel(elm) {
            elm.find('.tag-delete').on('click', function (e) {
                e.stopPropagation();
                const selfTxt = $(this).prev().text();
                elm.remove();
                let labelList = JSON.parse($taskLabelElm.val())
                const idx = labelList.indexOf(selfTxt)
                if (idx > -1) labelList.splice(idx, 1)
                $taskLabelElm.attr('value', JSON.stringify(labelList))
            })
        }

        renderLabel(list) {
            // reset empty
            let htmlElm = $('.label-mark')
            htmlElm.html('')
            for (let item of list) {
                const labelHTML = $(`<span class="item-tag"><span>${item}</span><span class="tag-delete">x</span></span>`)
                htmlElm.append(labelHTML)
                this.deleteLabel(labelHTML)
            }
        }

        // on click add label
        addLabel() {
            const _this = this
            $('.form-tags-input-wrap .btn-add-tag').on('click', function () {
                const $elmInputLabel = $('#inputLabelName')
                const newTxt = $elmInputLabel.val()
                let labelList = $taskLabelElm.val()
                if (labelList !== undefined && labelList !== '') labelList = JSON.parse(labelList)
                if (!labelList.length) labelList = []
                labelList.push(newTxt)
                $taskLabelElm.attr('value', JSON.stringify(labelList))
                const labelHTML = $(`<span class="item-tag"><span>${newTxt}</span><span class="tag-delete">x</span></span>`)
                $('.label-mark').append(labelHTML)
                $elmInputLabel.val('')
                _this.deleteLabel(labelHTML)
            })
        }

        showDropdown() {
            $('.label-mark').off().on('click', function () {
                const isParent = $(this).parent('.dropdown')
                isParent.children().toggleClass('show')
                $('input', isParent).focus()
            });
            $('.form-tags-input-wrap .btn-close-tag').on('click', function () {
                $(this).parents('.dropdown').children().removeClass('show')
            })
        }

        init() {
            this.showDropdown()
            this.addLabel()
        }
    }

    // checklist handle
    class checklistHandle {

        datalist = []

        set setDataList(data) {
            this.datalist = data;
        }

        render() {
            let $elm = $('.wrap-checklist')
            $elm.html('')
            for (const item of this.datalist) {
                let html = $($('.check-item-template').html())
                // html.find
                html.find('label').text(item.name)
                html.find('input').prop('checked', item.done)
                $elm.append(html)
                html.find('label').focus()
                this.delete(html)
            }
        }

        delete(elm) {
            elm.find('button').off().on('click', () => elm.remove())
        }

        get() {
            let checklist = []
            $('.wrap-checklist .checklist_item').each(function () {
                checklist.push({
                    'name': $(this).find('label').text(),
                    'done': $(this).find('input').prop('checked')
                })
            })
            return checklist
        }

        add() {
            const _this = this;
            $('.create-checklist').off().on('click', function () {
                let html = $($('.check-item-template').html())
                // html.find
                $('.wrap-checklist').append(html)
                html.find('label').focus(function () {
                    $(this).select();
                });
                _this.delete(html)
            });
        }

        init() {
            this.add()
        }
    }

    // form reset


    /** start run and init all function **/
    // run status select default
    const sttElm = $('#selectStatus');
    sttElm.attr('data-url')
    $.fn.callAjax(sttElm.attr('data-url'), 'get')
        .then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                let todoItem = data[sttElm.attr('data-prefix')][0]
                sttElm.attr('data-onload', JSON.stringify(todoItem))
                initSelectBox(sttElm)
            })

    // load assigner
    const $assignerElm = $('#inputAssigner')
    $assignerElm.val($assignerElm.attr('data-name')).attr('value', $assignerElm.attr('data-value-id'))

    // assign to me btn
    const $assignBtnElm = $('.btn-assign');
    const $assigneeElm = $('#selectAssignTo')
    $assignBtnElm.off().on('click', function () {
        const name = $assignerElm.attr('data-name')
        const id = $assignerElm.attr('data-value-id')
        const infoObj = {
            'title': name,
            'id': id
        }
        $assigneeElm.attr('data-onload', JSON.stringify(infoObj))
        initSelectBox($assigneeElm)

    });

    // run init label function
    let formLabel = new labelHandle()
    formLabel.init()
    // public global scope for list page render when edit
    window.formLabel = formLabel

    // click to logwork
    $('#save-logtime').off().on('click', function () {
        const start = $('#startDateLogTime').val();
        const end = $('#endDateLogTime').val();
        const est = $('#EstLogtime').val();
        if (start) {

        }
    });
    let editor;
    // run CKEditor
    ClassicEditor
        .create(document.querySelector('.ck5-rich-txt'),
            {
                toolbar: {
                    items: ['heading', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList']
                },
            },
        )
        .then(newEditor => {
            // public global scope for clean purpose when reset form.
            let editor = newEditor;
            window.editor = editor;
        })

    // run checklist tab
    let checklist = new checklistHandle()
    checklist.init();
    // public global scope with name checklist
    window.checklist = checklist;

    // reset form create task khi click huỷ bỏ hoặc tạo mới task con
    $('.cancel-task, [data-drawer-target="#drawer_task_create"]').each((idx, elm) => {
        $(elm).on('click', function () {
            if ($(this).hasClass('cancel-task')) {
                $(this).closest('.ntt-drawer').toggleClass('open');
                $('.hk-wrapper').toggleClass('open');
            }
            resetFormTask()
        });
    });

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
    $form.off().on('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        let _form = new SetupFormSubmit($form);
        let formData = _form.dataForm
        const start_date = new Date(formData.start_date).getDate()
        const end_date = new Date(formData.end_date).getDate()
        if (end_date < start_date) {
            $.fn.notifyPopup({description: $('#form_valid').attr('data-valid-datetime')}, 'failure')
            return false
        }

        formData.start_date = moment(formData.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
        formData.end_date = moment(formData.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
        formData.priority = parseInt(formData.priority)
        formData.label = JSON.parse($('#inputLabel').attr('value'))
        formData.employee_created = $('#inputAssigner').attr('value')
        formData.task_status = $('#selectStatus').val()
        const task_status = $('#selectStatus').select2('data')[0]
        const taskSttData = {
            'id': task_status.id,
            'title': task_status.title,
        }
        const assign_to = $('#selectAssignTo').select2('data')[0]
        const assign_toData = {
            'id': assign_to.id,
            'first_name': assign_to.text.split('. ')[1],
            'last_name': assign_to.text.split('. ')[0],
        }

        formData.checklist = []
        if ($('.wrap-checklist .checklist_item').length > 0)
            $('.wrap-checklist .checklist_item').each(function () {
                formData.checklist.push({
                    'name': $(this).find('label').text(),
                    'done': $(this).find('input').prop('checked'),
                })
            })
        let method = 'POST'
        let url = _form.dataUrl
        if(formData.id && formData.id !== ''){
            method = 'PUT'
            url = $('#url-factory').attr('data-task-detail').format_url_with_uuid(formData.id)
        }
        $.fn.callAjax(url, method, formData, true).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyPopup({description: data.message}, 'success')
                    // if in task page load add task function
                    if ($(document).find('#tasklist_wrap').length) {
                        let elm = $('<input type="hidden" id="addNewTaskData"/>');
                        // case update
                        if (!data?.id && data?.status === 200) {
                            elm = $('<input type="hidden" id="updateTaskData"/>');
                            formData.code = $('#inputTextCode').val()
                            formData.assign_to = assign_toData
                            formData.task_status = taskSttData
                        }
                        // case create
                        if (data?.id) formData = data
                        const datadump = JSON.stringify(formData)
                        elm.attr('data-task', datadump)
                        $('body').append(elm)
                    }
                }
            })
    })
}, jQuery)