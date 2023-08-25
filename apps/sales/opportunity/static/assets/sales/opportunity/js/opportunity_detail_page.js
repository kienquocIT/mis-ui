$(document).ready(function () {
    const pk = $.fn.getPkDetail()
    const frmDetail = $('#frm-detail');
    let dataUrlEle = $('#url-factory');
    let transEle = $('#trans-factory');
    $('#btn-opp-edit').attr('href', dataUrlEle.data('url-edit').format_url_with_uuid(pk));

    loadDtbContactRolePageDetail([]);

    $('#rangeInput').on('mousedown', function () {
        return false;
    });

    let opp_stage_id;

    let opp_is_closed = false;

    // config input date
    $('input[name="open_date"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'auto',
        minYear: 2000,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY-MM-DD'), 10) + 100
    });
    $('input[name="close_date"]').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'auto',
        minYear: parseInt(moment().format('YYYY-MM-DD'), 10) - 1,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10) + 100
    });

    let paramString = {}

    function loadDetail() {
        let url = frmDetail.data('url').format_url_with_uuid(pk);
        $.fn.callAjax2({
            url: url,
            method: 'GET'
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let opportunity_detail = data?.['opportunity'];

                paramString = {
                    'id': opportunity_detail.id,
                    'code': opportunity_detail.code,
                    'title': opportunity_detail.title,
                }
                $.fn.compareStatusShowPageAction(opportunity_detail);

                opp_stage_id = opportunity_detail.stage;
                opp_is_closed = opportunity_detail?.['is_close'];
                loadStage(opportunity_detail.stage, opportunity_detail.is_close_lost, opportunity_detail.is_deal_close);
                let ele_header = $('#header-title');
                ele_header.text(opportunity_detail.title);
                $('#span-code').text(opportunity_detail.code);
                $('#rangeInput').val(opportunity_detail.win_rate);
                let ele_input_rate = $('#input-rate')
                ele_input_rate.val(opportunity_detail.win_rate);

                if (opportunity_detail.is_input_rate) {
                    $('#check-input-rate').prop('checked', true);
                    ele_input_rate.prop('disabled', false);
                } else
                    $('#check-input-rate').prop('checked', false);

                if (opportunity_detail.lost_by_other_reason) {
                    $('#check-lost-reason').prop('checked', true);
                } else
                    $('#check-lost-reason').prop('checked', false);
                OpportunityLoadPage.loadCustomer($('#select-box-customer'), opportunity_detail.customer);
                OpportunityLoadPage.loadProductCategory($('#select-box-product-category'), opportunity_detail.product_category);
                OpportunityLoadPage.loadSalePersonPageDetail($('#select-box-sale-person'), opportunity_detail?.['sale_person']);
                OpportunityLoadPage.loadEndCustomer($('#select-box-end-customer'), opportunity_detail.end_customer);

                $('#input-budget').attr('value', opportunity_detail.budget_value);
                if (opportunity_detail?.['open_date'] !== null)
                    $('#input-open-date').val(opportunity_detail?.['open_date'].split(' ')[0]);
                if (opportunity_detail?.['close_date'] !== null)
                    $('#input-close-date').val(opportunity_detail?.['close_date'].split(' ')[0]);
                else {
                    $('#input-close-date').val('');
                }
                if (opportunity_detail.decision_maker !== null) {
                    let ele_decision_maker = $('#input-decision-maker');
                    ele_decision_maker.val(opportunity_detail.decision_maker.name);
                    ele_decision_maker.attr('data-id', opportunity_detail.decision_maker.id);
                }

                loadDtbProductDetailPageDetail(opportunity_detail.opportunity_product_datas);

                $('#input-product-pretax-amount').attr('value', opportunity_detail.total_product_pretax_amount);
                $('#input-product-taxes').attr('value', opportunity_detail.total_product_tax);
                $('#input-product-total').attr('value', opportunity_detail.total_product);

                loadDtbCompetitorPageDetail(opportunity_detail.opportunity_competitors_datas);
                let table_contact_role = $('#table-contact-role');

                opportunity_detail.opportunity_contact_role_datas.map(function (item) {
                    table_contact_role.DataTable().row.add(item).draw();
                    loadDetailContactRole(item, table_contact_role, transEle)
                })
                loadSaleTeam(opportunity_detail.opportunity_sale_team_datas)

                OpportunityLoadPage.loadFactor($('#box-select-factor'), opportunity_detail.customer_decision_factor);
                $.fn.initMaskMoney2();
            }
        })
    }

    loadDetail();


    // Stage

    let list_stage = [];
    let dict_stage = {};

    function loadStage(stages, is_close_lost, is_deal_close) {
        let ele = $('#div-stage');
        let method = ele.data('method');
        let url = ele.data('url');

        let html = $('#stage-hidden').html();
        $.fn.callAjax2({
            url: url,
            method: method
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_config_stage')) {
                    list_stage = sortStage(data?.['opportunity_config_stage']);
                    dict_stage = list_stage.reduce((obj, item) => {
                        obj[item.id] = item;
                        return obj;
                    }, {});

                    list_stage.reverse().map(function (item) {
                        ele.prepend(html);
                        let ele_first_stage = ele.find('.sub-stage').first();
                        ele_first_stage.attr('data-id', item.id);
                        ele_first_stage.find('.stage-indicator').text(item.indicator);
                        if (item?.['is_closed_lost']) {
                            ele_first_stage.find('.dropdown').remove();
                            ele_first_stage.addClass('stage-lost')
                        }
                        if (item?.['is_deal_closed']) {
                            ele_first_stage.addClass('stage-close')
                            ele_first_stage.find('.dropdown-menu').empty();
                            if (is_close_lost || is_deal_close) {
                                ele_first_stage.find('.dropdown-menu').append(
                                    `<div class="form-check form-switch">
                                        <input type="checkbox" class="form-check-input" id="input-close-deal" checked>
                                        <label for="input-close-deal" class="form-label">Close Deal</label>
                                    </div>`
                                )
                            } else {
                                ele_first_stage.find('.dropdown-menu').append(
                                    `<div class="form-check form-switch">
                                        <input type="checkbox" class="form-check-input" id="input-close-deal">
                                        <label for="input-close-deal" class="form-label">Close Deal</label>
                                    </div>`
                                )
                            }
                        }
                    })
                }
            }
            if (stages.length !== 0) {
                stages.map(function (item) {
                    let ele_stage = $(`.sub-stage[data-id="${item.id}"]`);
                    if (ele_stage.hasClass('stage-lost')) {
                        ele_stage.addClass('bg-red-light-5 stage-selected');
                    } else if (ele_stage.hasClass('stage-close')) {
                        let el_close_deal = $('#input-close-deal');
                        $('.page-content input, .page-content select, .page-content .btn').not(el_close_deal).not($('#rangeInput')).prop('disabled', true);
                        ele_stage.addClass('bg-primary-light-5 stage-selected');
                        el_close_deal.prop('checked', true);
                    } else {
                        ele_stage.addClass('bg-primary-light-5 stage-selected');
                    }
                })
            }
        })
    }

    $(document).on('click', '#btn-show-activity', function () {
        $('.div-activity').removeClass('hidden');
        $('.div-action').addClass('hidden');
    })

    $(document).on('click', '#btn-show-action', function () {
        $('.div-activity').addClass('hidden');
        $('.div-action').removeClass('hidden');
    })


    $('#date-input').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'up',
        minYear: parseInt(moment().format('YYYY-MM-DD'), 10) - 1,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10) + 100
    });

    // for task

    function resetFormTask() {
        // clean html select etc.
        $('#formOpportunityTask').trigger('reset').removeClass('task_edit')
        $('#selectAssignTo').val(null).trigger('change');
        if ($('.current-create-task').length <= 0)
            $('#selectOpportunity').val(null).trigger('change').attr('disabled', false);
        $('.label-mark, .wrap-checklist, .wrap-subtask').html('');
        $('#inputLabel').val(null);
        $('[name="id"]').remove();
        const $inputAssigner = $('#inputAssigner');
        $inputAssigner.val($inputAssigner.attr('data-name'))
        $('.create-subtask').addClass('hidden')
        $('[name="parent_n"]').remove();
        window.editor.setData('')
        $('.create-task').attr('disabled', false)
    }

    function logworkSubmit() {
        $('#save-logtime').off().on('click', function () {
            const startDate = $('#startDateLogTime').val()
            const endDate = $('#endDateLogTime').val()
            const est = $('#EstLogtime').val()
            const taskID = $('#logtime_task_id').val()
            if (!startDate && !endDate && !est) {
                $.fn.notifyB({description: $('#form_valid').attr('data-logtime-valid')}, 'failure')
                return false
            }
            const data = {
                'start_date': moment(startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                'end_date': moment(endDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                'time_spent': est,
            }
            // if has task id => log time
            if (taskID && taskID.valid_uuid4()) {
                data.task = taskID
                let url = dataUrlEle.attr('data-logtime')
                $.fn.callAjax(url, 'POST', data, true)
                    .then(
                        (req) => {
                            let data = $.fn.switcherResp(req);
                            if (data?.['status'] === 200) {
                                $.fn.notifyB({description: data.message}, 'success')
                            }
                        }
                    )
            } else {
                $('[name="log_time"]').attr('value', JSON.stringify(data))
            }
            $('#logWorkModal').modal('hide')
        });
    }

    class AssignToSetup {
        static case01(config, params) {
            // có opps + config có in assign opt lớn hơn 0
            if (config.in_assign_opt === 1) {
                // chỉ employee trong opportunity
                let selectOpt = '';
                $('#card-member .card').each(function () {
                    let opt = `<option data-value="${$(this).attr('data-id')}">${$(this).find('.card-title').text()
                    }</option>`
                    selectOpt += opt
                })
                $('#selectAssignTo').html(selectOpt).removeAttr('data-url')

            } else if (config.in_assign_opt === 2) {
                // chỉ nhân viên của user
                params = {'group__first_manager__id': true}
            } else {
                // vừa trong opportunity vừa là nhân viên của user
                $('.is-lazy-loading').addClass('is_show')
                let selectOpt = '<option value=""></option>';
                $('#card-member .card').each(function () {
                    let opt = `<option data-value="${$(this).attr('data-id')}">${$(this).find('.card-title').text()
                    }</option>`
                    selectOpt += opt
                })
                const $sltElm = $('#selectAssignTo')
                //
                $.fn.callAjax2({
                    'url': $sltElm.attr('data-url'),
                    'method': 'get',
                    'data': {'group__first_manager__id': true}
                }).then(
                    (resp) => {
                        const data = $.fn.switcherResp(resp);
                        let assigneeList = data?.[$sltElm.attr('data-keyresp')]
                        for (const item of assigneeList) {
                            if (selectOpt.indexOf(item?.[$sltElm.attr('data-keyid')]) === -1) {
                                let opt = `<option data-value="${item?.[$sltElm.attr('data-keyid')]
                                }">${item?.[$sltElm.attr('data-keytext')]}</option>`
                                selectOpt += opt
                            }
                        }
                        $sltElm.html(selectOpt).removeAttr('data-url')
                        $('.is-lazy-loading').removeClass('is_show')
                    }
                )
            }
            return params
        }

        static hasConfig(config) {
            const $selectElm = $('#selectAssignTo')
            let params = {}
            if (config.in_assign_opt > 0) params = this.case01(config, params)

            $selectElm.attr('data-params', JSON.stringify(params))
            if ($selectElm.hasClass("select2-hidden-accessible")) $selectElm.select2('destroy')
            $selectElm.initSelect2()
        }

        static init() {

            $.fn.callAjax2({
                'url': $('#task_url_sub').attr('data-task-config'),
                'method': 'get'
            }).then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    let taskConfig = data?.['task_config']
                    this.hasConfig(taskConfig)
                }
            )
        }
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

        /** start run and init all function **/
            // run status select default
        const sttElm = $('#selectStatus');
        sttElm.attr('data-url')
        $.fn.callAjax2({
            'url': sttElm.attr('data-url'),
            'method': 'get'
        })
            .then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    let todoItem = data[sttElm.attr('data-keyResp')][0]
                    sttElm.attr('data-onload', JSON.stringify(todoItem))
                    sttElm.initSelect2()
                })

        // load assigner
        const $assignerElm = $('#inputAssigner')
        $assignerElm.val($assignerElm.attr('data-name')).attr('value', $assignerElm.attr('data-value-id'))

        // assign to me btn
        const $assignBtnElm = $('.btn-assign');
        const $assigneeElm = $('#selectAssignTo')

        AssignToSetup.init()
        $assignBtnElm.off().on('click', function () {
            const name = $assignerElm.attr('data-name')
            const id = $assignerElm.attr('data-value-id')
            const infoObj = {
                'full_name': name,
                'id': id
            }
            $assigneeElm.attr('data-onload', JSON.stringify(infoObj))
            $assigneeElm.initSelect2()
        });

        // run init label function
        let formLabel = new labelHandle()
        formLabel.init()
        // public global scope for list page render when edit
        window.formLabel = formLabel

        // auto load opp if in page opp
        const $btnInOpp = $('.current-create-task')
        const $selectElm = $('#selectOpportunity')

        if ($btnInOpp.length) {
            const pk = $.fn.getPkDetail()
            let data = {
                "id": pk,
                "title": ''
            }
            const isCheck = setInterval(() => {
                let oppCode = $('#span-code').text()
                if (oppCode.length) {
                    clearInterval(isCheck)
                    data.title = oppCode
                    $selectElm.attr('data-onload', JSON.stringify(data)).attr('disabled', true)
                    $selectElm.initSelect2()
                }
            }, 1000)
        } else $selectElm.initSelect2()

        // click to log-work
        $('.btn-log_work').off().on('click', () => {
            $('#logWorkModal').modal('show')
            $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
            const taskID = $('.task_edit [name="id"]').val()
            if (taskID) $('#logtime_task_id').val(taskID)
            logworkSubmit()
        })

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
                $.fn.notifyB({description: $('#form_valid').attr('data-valid-datetime')}, 'failure')
                return false
            }
            if (formData.log_time === "")
                delete formData.log_time
            else {
                let temp = formData.log_time.replaceAll("'", '"')
                temp = JSON.parse(temp)
                formData.log_time = temp
            }
            formData.start_date = moment(formData.start_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            formData.end_date = moment(formData.end_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
            formData.priority = parseInt(formData.priority)
            let tagsList = $('#inputLabel').attr('value')
            if (tagsList)
                formData.label = JSON.parse(tagsList)
            formData.employee_created = $('#inputAssigner').attr('value')
            formData.task_status = $('#selectStatus').val()
            const task_status = $('#selectStatus').select2('data')[0]
            const taskSttData = {
                'id': task_status.id,
                'title': task_status.title,
            }

            const assign_to = $('#selectAssignTo').select2('data')[0]
            let assign_toData = {}
            if (assign_to)
                assign_toData = {
                    'id': assign_to.id,
                    'first_name': assign_to.text.split('. ')[1],
                    'last_name': assign_to.text.split('. ')[0],
                }

            formData.checklist = []
            $('.wrap-checklist .checklist_item').each(function () {
                formData.checklist.push({
                    'name': $(this).find('label').text(),
                    'done': $(this).find('input').prop('checked'),
                })
            })

            if (!formData.opportunity) delete formData.opportunity
            if ($('#selectOpportunity').val()) formData.opportunity = $('#selectOpportunity').val()

            if ($('[name="attach"]').val()) {
                let list = []
                list.push($('[name="attach"]').val())
                formData.attach = list
            }

            let method = 'POST'
            let url = _form.dataUrl
            if (formData.id && formData.id !== '') {
                method = 'PUT'
                url = dataUrlEle.attr('data-task-detail').format_url_with_uuid(formData.id)
            }
            $.fn.callAjax(url, method, formData, true).then(
                (resp) => {
                    const data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: data.message}, 'success')
                        // if in task page load add task function
                        if ($(document).find('#tasklist_wrap').length) {
                            let elm = $('<input type="hidden" id="addNewTaskData"/>');
                            // case update
                            if (!data?.id && data?.status === 200) {
                                elm = $('<input type="hidden" id="updateTaskData"/>');
                                formData.code = $('#inputTextCode').val();
                                formData.assign_to = assign_toData
                                formData.task_status = taskSttData
                            }
                            // case create
                            if (data?.id) formData = data
                            const datadump = JSON.stringify(formData)
                            elm.attr('data-task', datadump)
                            $('body').append(elm)
                        }
                        if ($('.current-create-task').length) $('.cancel-task').trigger('click')

                        callAjaxtoLoadTimeLineList();
                    }
                })
        })
    }, jQuery)


    // TIMELINE
    function tabSubtask(taskID) {
        if (!taskID) return false
        const $wrap = $('.wrap-subtask')
        const url = dataUrlEle.attr('data-task_list')
        $.fn.callAjax(url, 'GET', {parent_n: taskID})
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    for (let [key, item] of data.task_list.entries()) {
                        const template = $(`<div class="d-flex justify-content-start align-items-center subtask_item">
                                        <p>${item.title}</p>
                                        <button class="btn btn-flush-primary btn-icon btn-rounded ml-auto flush-soft-hover" disabled>
                                            <span><i class="fa-regular fa-trash-can fa-sm"></i></span>
                                        </button>
                                     </div>`);
                        $wrap.append(template);
                    }
                }
            })
    }

    function tabLogWork(dataList) {
        let $table = $('#table_log-work')
        if ($table.hasClass('datatable')) $table.DataTable().clear().draw();
        $table.DataTable({
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            data: dataList,
            columns: [
                {
                    data: 'employee_created',
                    targets: 0,
                    width: "35%",
                    render: (data, type, row) => {
                        let avatar = ''
                        const full_name = data.last_name + ' ' + data.first_name
                        if (data?.avatar)
                            avatar = `<img src="${data.avatar}" alt="user" class="avatar-img">`
                        else avatar = $.fn.shortName(full_name, '', 5)
                        const randomResource = randomColor[Math.floor(Math.random() * randomColor.length)];
                        return `<div class="avatar avatar-rounded avatar-xs avatar-${randomResource}">
                                            <span class="initial-wrap">${avatar}</span>
                                        </div>
                                        <span class="ml-2">${full_name}</span>`;
                    }
                },
                {
                    data: 'start_date',
                    targets: 1,
                    width: "35%",
                    render: (data, type, row) => {
                        let date = moment(data, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD')
                        if (data !== row.end_date) {
                            date += ' ~ '
                            date += moment(row.end_date, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD')
                        }
                        return date;
                    }
                },
                {
                    data: 'time_spent',
                    targets: 2,
                    width: "20%",
                    render: (data, type, row) => {
                        return data;
                    }
                },
                {
                    data: 'id',
                    targets: 3,
                    width: "10%",
                    render: (data, type, row) => {
                        return ''
                    }
                }
            ]
        })
    }

    function displayTaskView(url) {
        if (url)
            $.fn.callAjax(url, 'GET')
                .then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        // enable side panel
                        if (!$('#drawer_task_create').hasClass('open')) {
                            $($('.current-create-task span')[0]).trigger('click')
                        }
                        $('#inputTextTitle').val(data.title)
                        $('#inputTextCode').val(data.code)
                        $('#selectStatus').attr('data-onload', JSON.stringify(data.task_status))
                        $('#inputTextStartDate').val(
                            moment(data.start_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                        )
                        $('#inputTextEndDate').val(
                            moment(data.end_date, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY')
                        )
                        $('#inputTextEstimate').val(data.estimate)
                        if (data?.opportunity_data && Object.keys(data.opportunity_data).length)
                            $('#selectOpportunity').attr('data-onload', JSON.stringify({
                                "id": data.opportunity_data.id,
                                "title": data.opportunity_data.code
                            }))
                        $('#selectPriority').val(data.priority).trigger('change')
                        window.formLabel.renderLabel(data.label)
                        $('#inputLabel').attr('value', JSON.stringify(data.label))
                        $('#inputAssigner').val(data.employee_created.last_name + '. ' + data.employee_created.first_name)
                            .attr('value', data.employee_created.id)
                        if (data.assign_to.length)
                            $('#selectAssignTo').attr('data-onload', JSON.stringify(data.assign_to))
                        window.editor.setData(data.remark)
                        window.checklist.setDataList = data.checklist
                        window.checklist.render()
                        initSelectBox($('#selectOpportunity, #selectAssignTo, #selectStatus'))
                        $('.create-subtask, .create-checklist').addClass('hidden')
                        if (data.task_log_work.length) tabLogWork(data.task_log_work)
                        tabSubtask(data.id)

                        if (data.attach) {
                            const fileDetail = data.attach[0]?.['files']
                            FileUtils.init($(`[name="attach"]`).siblings('button'), fileDetail);
                        }
                        $('.create-task').attr('disabled', true)
                    }
                })
    }

    function loadTimelineList(data_timeline_list) {
        const $trans = transEle
        $('#table-timeline').DataTable().destroy();
        let dtb = $('#table-timeline');
        const type_trans = {
            0: $trans.attr('data-activity-type01'),
            1: $trans.attr('data-activity-type02'),
            2: $trans.attr('data-activity-type03'),
        }
        const type_icon = {
            0: `<i class="bi bi-telephone-fill"></i>`,
            1: `<i class="bi bi-envelope-fill"></i>`,
            2: `<i class="bi bi-person-workspace"></i>`,
            task: '<i class="fa-solid fa-file-arrow-up"></i>'
        }
        dtb.DataTableDefault({
            pageLength: 5,
            dom: "<'row miner-group'<'col-sm-3 mt-3'f><'col-sm-9'p>>" + "<'row mt-3'<'col-sm-12'tr>>" + "<'row mt-3'<'col-sm-12 col-md-6'i>>",
            data: data_timeline_list,
            columns: [
                {
                    data: 'activity',
                    className: 'wrap-text w-25',
                    render: (data, type, row, meta) => {
                        return row.title;
                    }
                },
                {
                    data: 'type',
                    className: 'wrap-text w-10 text-center',
                    render: (data, type, row, meta) => {
                        let txt = ''
                        if (row.type === 'task') {
                            txt = `<i class="fa-solid fa-list-check"></i>`
                        } else if (row.type === 'call') {
                            txt = `<i class="bi bi-telephone-fill"></i>`
                        } else if (row.type === 'email') {
                            txt = `<i class="bi bi-envelope-fill"></i>`
                        } else if (row.type === 'meeting') {
                            txt = `<i class="bi bi-person-workspace"></i>`
                        } else if (row.type === 'document') {
                            txt = `<i class="bi bi-file-earmark-fill"></i>`
                        }
                        return txt
                    }
                },
                {
                    data: 'subject',
                    className: 'wrap-text w-50',
                    render: (data, type, row, meta) => {
                        let modal_detail_target = '';
                        let modal_detail_class = '';
                        if (row.type === 'call') {
                            modal_detail_target = '#detail-call-log';
                            modal_detail_class = 'detail-call-log-button';
                        } else if (row.type === 'email') {
                            modal_detail_target = '#detail-send-email';
                            modal_detail_class = 'detail-email-button';
                        } else if (row.type === 'meeting') {
                            modal_detail_target = '#detail-meeting';
                            modal_detail_class = 'detail-meeting-button';
                        }
                        return `<a data-type="${row.type}" class="${modal_detail_class} text-primary link-primary underline_hover"
                                       href="" data-bs-toggle="modal" data-id="${row.id}"data-bs-target="${modal_detail_target}">
                                        <span><b>${row.subject}</b></span>
                                    </a>`
                    }
                },
                {
                    data: 'date',
                    className: 'wrap-text w-15',
                    render: (data, type, row, meta) => {
                        return row.date
                    }
                },
            ],
            rowCallback: function (row, data) {
                // click show task
                $('.view_task_log', row).off().on('click', function (e) {
                    e.stopPropagation();
                    displayTaskView(this.dataset.url)
                })
            },
        });
    }

    function callAjaxtoLoadTimeLineList() {
        $.fn.callAjax($('#table-timeline').attr('data-url-logs_list'), 'GET', {'opportunity': pk})
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let activity_logs_list = [];
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('activity_logs_list')) {
                        data.activity_logs_list.map(function (item) {
                            if (Object.keys(item.task).length > 0) {
                                activity_logs_list.push({
                                    'id': item.task.id,
                                    'type': item.task.activity_type,
                                    'title': item.task.activity_name,
                                    'subject': item.task.subject,
                                    'date': item.date_created.split(' ')[0],
                                })
                            } else if (Object.keys(item.call_log).length > 0) {
                                activity_logs_list.push({
                                    'id': item.call_log.id,
                                    'type': item.call_log.activity_type,
                                    'title': item.call_log.activity_name,
                                    'subject': item.call_log.subject,
                                    'date': item.date_created.split(' ')[0],
                                })
                            } else if (Object.keys(item.email).length > 0) {
                                activity_logs_list.push({
                                    'id': item.email.id,
                                    'type': item.email.activity_type,
                                    'title': item.email.activity_name,
                                    'subject': item.email.subject,
                                    'date': item.date_created.split(' ')[0],
                                })
                            } else if (Object.keys(item.meeting).length > 0) {
                                activity_logs_list.push({
                                    'id': item.meeting.id,
                                    'type': item.meeting.activity_type,
                                    'title': item.meeting.activity_name,
                                    'subject': item.meeting.subject,
                                    'date': item.date_created.split(' ')[0],
                                })
                            } else if (Object.keys(item.document).length > 0) {
                                activity_logs_list.push({
                                    'id': item.document.id,
                                    'type': item.document.activity_type,
                                    'title': item.document.activity_name,
                                    'subject': item.document.subject,
                                    'date': item.date_created.split(' ')[0],
                                })
                            }
                        });
                    }
                    loadTimelineList(activity_logs_list)
                }
            })
    }

    callAjaxtoLoadTimeLineList();


    $(document).on('click', '#table-timeline .detail-call-log-button', function () {
        let call_log_id = $(this).attr('data-id');
        let call_log_obj = JSON.parse($('#opportunity_call_log_list').text()).filter(function (item) {
            return item.id === call_log_id;
        })[0]
        $('#detail-subject-input').val(call_log_obj.subject);

        $('#detail-sale-code-select-box option').remove();
        $('#detail-sale-code-select-box').append(`<option selected>(${call_log_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${call_log_obj.opportunity.title}</option>`);

        $('#detail-account-select-box option').remove();
        $('#detail-account-select-box').append(`<option selected>${call_log_obj.customer.title}</option>`);

        $('#detail-contact-select-box option').remove();
        $('#detail-contact-select-box').append(`<option selected>${call_log_obj.contact.fullname}</option>`);

        let contact_get = contact_list.filter(function (item) {
            return item.id === call_log_obj.contact.id;
        })
        if (contact_get.length > 0) {
            contact_get = contact_get[0];
            $('#detail-call-log-contact-name').text(contact_get.fullname);
            $('#detail-call-log-contact-job-title').text(contact_get.job_title);
            $('#detail-call-log-contact-mobile').text(contact_get.mobile);
            $('#detail-call-log-contact-email').text(contact_get.email);
            let report_to = null;
            if (Object.keys(contact_get.report_to).length !== 0) {
                report_to = contact_get.report_to.name;
            }
            $('#detail-call-log-contact-report-to').text(report_to);
            let url = $('#detail-btn-detail-call-log-contact-tab').attr('data-url').replace('0', contact_get.id);
            $('#detail-btn-detail-call-log-contact-tab').attr('href', url);
            $('#detail-call-log-contact-detail-span').prop('hidden', false);
        }

        $('#detail-date-input').val(call_log_obj.call_date.split(' ')[0]);
        $('#detail-repeat-activity').prop('checked', call_log_obj.repeat);
        $('#detail-result-text-area').val(call_log_obj.input_result);
    })

    $(document).on('click', '#table-timeline .detail-email-button', function () {
        let email_id = $(this).attr('data-id');
        let email_obj = JSON.parse($('#opportunity_email_list').text()).filter(function (item) {
            return item.id === email_id;
        })[0]
        $('#detail-email-subject-input').val(email_obj.subject);

        $('#detail-email-sale-code-select-box option').remove();
        $('#detail-email-sale-code-select-box').append(`<option selected>(${email_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${email_obj.opportunity.title}</option>`);

        $('#detail-email-to-select-box option').remove();
        for (let i = 0; i < email_obj.email_to_list.length; i++) {
            $('#detail-email-to-select-box').append(`<option selected>${email_obj.email_to_list[i]}</option>`);
        }

        $('#detail-email-cc-select-box option').remove();
        for (let i = 0; i < email_obj.email_cc_list.length; i++) {
            $('#detail-email-cc-select-box').append(`<option selected>${email_obj.email_cc_list[i]}</option>`);
        }

        $('#detail-email-content-area').val(email_obj.content);
    })

    $(document).on('click', '#table-timeline .detail-meeting-button', function () {
        let meeting_id = $(this).attr('data-id');
        let meeting_obj = JSON.parse($('#opportunity_meeting_list').text()).filter(function (item) {
            return item.id === meeting_id;
        })[0]
        $('#detail-meeting-subject-input').val(meeting_obj.subject);

        $('#detail-meeting-sale-code-select-box option').remove();
        $('#detail-meeting-sale-code-select-box').append(`<option selected>(${meeting_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${meeting_obj.opportunity.title}</option>`);

        $('#detail-meeting-address-select-box option').remove();
        $('#detail-meeting-address-select-box').append(`<option selected>${meeting_obj.meeting_address}</option>`);

        $('#detail-meeting-room-location-input').val(meeting_obj.room_location);

        $('#detail-meeting-employee-attended-select-box option').remove();
        for (let i = 0; i < meeting_obj.employee_attended_list.length; i++) {
            let employee_attended_item = meeting_obj.employee_attended_list[i];
            $('#detail-meeting-employee-attended-select-box').append(`<option selected>${employee_attended_item.fullname}</option>`);
        }
        $('#detail-meeting-employee-attended-select-box').prop('disabled', true);

        $('#detail-meeting-customer-member-select-box option').remove();
        for (let i = 0; i < meeting_obj.customer_member_list.length; i++) {
            let customer_member_item = meeting_obj.customer_member_list[i];
            $('#detail-meeting-customer-member-select-box').append(`<option selected>${customer_member_item.fullname}</option>`);
        }
        $('#detail-meeting-customer-member-select-box').prop('disabled', true);

        $('#detail-meeting-date-input').val(meeting_obj.meeting_date.split(' ')[0]);

        $('#detail-repeat-activity-2').prop('checked', meeting_obj.repeat);

        $('#detail-meeting-result-text-area').val(meeting_obj.input_result);
    })
})
