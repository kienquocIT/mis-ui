$(document).ready(function () {
    let opportunity_detail_data = null;
    const pk = $.fn.getPkDetail()
    const frmDetail = $('#frm-detail');
    let dataUrlEle = $('#url-factory');
    let transEle = $('#trans-factory');
    $('#btn-opp-edit').attr('href', dataUrlEle.data('url-edit').format_url_with_uuid(pk));

    loadDtbContactRolePageDetail([]);

    $('#rangeInput').on('mousedown', function () {
        return false;
    });

    // config input date
    OpportunityLoadDetail.configDateTimeEle()

    function loadDetail() {
        // let url = frmDetail.data('url').format_url_with_uuid(pk);
        $.fn.callAjax2({
            url: frmDetail.data('url'),
            method: 'GET'
        }).then(async (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let opportunity_detail = data?.['opportunity'];
                console.log(opportunity_detail)
                opportunity_detail_data = opportunity_detail;

                $x.fn.renderCodeBreadcrumb(opportunity_detail);
                await OpportunityLoadDetail.loadDetailCommon(opportunity_detail);

                if (opportunity_detail.lost_by_other_reason) {
                    $('#check-lost-reason').prop('checked', true);
                } else
                    $('#check-lost-reason').prop('checked', false);

                OpportunityLoadDropdown.loadCustomer(opportunity_detail.customer);
                OpportunityLoadDropdown.loadProductCategory(opportunity_detail.product_category);
                OpportunityLoadDropdown.loadSalePersonPageDetail(opportunity_detail?.['sale_person']);
                OpportunityLoadDropdown.loadEndCustomer(opportunity_detail.end_customer);

                $('#input-budget').attr('value', opportunity_detail.budget_value);

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
                OpportunityLoadDetail.loadSaleTeam(opportunity_detail.members, false);

                OpportunityLoadDropdown.loadFactor($('#box-select-factor'), opportunity_detail.customer_decision_factor);
                $.fn.initMaskMoney2();

                Disable();

                $('#frm-detail').append(`<span class="hidden" id="opp_id" data-code="${opportunity_detail.code
                }" data-txt="${opportunity_detail.title}"></span>`)
            }
        })
    }

    function Disable() {
        $('.form-check-input').prop('disabled', true);
        $('#group-general-info-opp .form-control').prop('disabled', true);
        $('#group-general-info-opp .form-select').prop('disabled', true);
        $('#btn-auto-update-stage').prop('hidden', true);
        $('#tab_product .btn').prop('hidden', true);
        $('#tab_competitors .btn').prop('hidden', true);
        $('#tab_contact_role .btn').prop('hidden', true);
        $('#member-item-list .btn').prop('hidden', true);
        $('#box-select-factor').prop('disabled', true);
    }

    loadDetail();

    toggleShowActivity();

    // for call log

    let table_timeline = $('#table-timeline');

    let call_log_Opp_slb = $('#sale-code-select-box');
    let date_input = $('#date-input');
    let customer_slb = $('#account-select-box');
    let contact_slb = $('#contact-select-box');

    function loadSaleCodeListCallLog() {
        call_log_Opp_slb.prop('disabled', true);
        call_log_Opp_slb.html(``);
        call_log_Opp_slb.append(`<option selected value="${opportunity_detail_data.id}">(${opportunity_detail_data.code})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${opportunity_detail_data.title}</option>`);
        call_log_Opp_slb.initSelect2();
    }

    function loadCustomerList() {
        customer_slb.prop('disabled', true);
        customer_slb.html(``);
        customer_slb.append(`<option selected value="${opportunity_detail_data.customer.id}">${opportunity_detail_data.customer.name}</option>`);
        customer_slb.initSelect2();
    }

    function loadContactList() {
        let contact_list = opportunity_detail_data.customer.contact_mapped;
        contact_slb.html(``);
        contact_slb.append(`<option></option>`)
        for (let i = 0; i < contact_list.length; i++) {
            contact_slb.append(`<option value="${contact_list[i].id}">${contact_list[i].fullname}</option>`)
        }
        contact_slb.initSelect2();
    }

    $('.create-new-call-log-button').on('click', function () {
        $('#subject-input').val('');
        date_input.val('');
        $('#result-text-area').val('');

        loadSaleCodeListCallLog();
        loadCustomerList();
        loadContactList();
    })

    date_input.daterangepicker({
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

    function combinesData_CallLog(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['subject'] = $('#subject-input').val();
        frm.dataForm['opportunity'] = call_log_Opp_slb.val();
        frm.dataForm['customer'] = customer_slb.val();
        frm.dataForm['contact'] = contact_slb.val();
        frm.dataForm['call_date'] = date_input.val();
        frm.dataForm['input_result'] = $('#result-text-area').val();
        if ($('#repeat-activity').is(':checked')) {
            frm.dataForm['repeat'] = 1;
        }
        else {
            frm.dataForm['repeat'] = 0;
        }

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-create-new-call-log').submit(function (event) {
        event.preventDefault();
        let combinesData = new combinesData_CallLog($(this));
        if (combinesData) {
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            $('#create-new-call-log').hide();
                            callAjaxToLoadTimeLineList();
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    $(document).on('click', '#table-timeline .detail-call-log-button', function () {
        let call_log_id = $(this).attr('data-id');
        let call_log_detail = $.fn.callAjax2({url: $('#detail-call-log').attr('data-url').replace(0, call_log_id), method: 'GET'}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_call_log_detail')) {
                    return data?.['opportunity_call_log_detail'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )
        Promise.all([call_log_detail]).then(
            (results) => {
                let call_log_obj = results[0];
                $('#detail-subject-input').val(call_log_obj.subject);

                $('#detail-sale-code-select-box option').remove();
                $('#detail-sale-code-select-box').append(`<option selected>(${call_log_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${call_log_obj.opportunity.title}</option>`);

                $('#detail-account-select-box option').remove();
                $('#detail-account-select-box').append(`<option selected>${call_log_obj.opportunity.customer.title}</option>`);

                $('#detail-contact-select-box option').remove();
                $('#detail-contact-select-box').append(`<option selected>${call_log_obj.contact.fullname}</option>`);

                $('#detail-date-input').val(call_log_obj.call_date.split(' ')[0]);
                $('#detail-repeat-activity').prop('checked', call_log_obj.repeat);
                $('#detail-result-text-area').val(call_log_obj.input_result);
            })
    })

    $(document).on('click', '#table-timeline .delete-call-log-button', function () {
        let call_log_id = $(this).attr('data-id');
        $.fn.callAjax2({url: table_timeline.attr('data-url-delete-call-log').replace(0, call_log_id), method: 'DELETE'}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    callAjaxToLoadTimeLineList();
                }
            },
            (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            }
        )
    })

    // for send email.

    let email_Opp_slb = $('#email-sale-code-select-box');
    let email_to_slb = $('#email-to-select-box');
    let email_cc_slb = $('#email-cc-select-box');

    function loadSaleCodeListEmail() {
        email_Opp_slb.prop('disabled', true);
        email_Opp_slb.html(``);
        email_Opp_slb.append(`<option selected value="${opportunity_detail_data.id}">(${opportunity_detail_data.code})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${opportunity_detail_data.title}</option>`);
        email_Opp_slb.initSelect2();
    }

    function loadEmailToList(contact_list) {
        email_to_slb.html(``);
        for (let i = 0; i < contact_list.length; i++) {
            let item = contact_list[i];
            if (item.email) {
                email_to_slb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.email}</option>`);
            }
        }
        email_to_slb.select2({
            dropdownParent: $("#send-email"),
            tags: true,
            tokenSeparators: [',', ' ']
        });
    }

    function loadEmailCcList(contact_list) {
        email_cc_slb.html(``);
        for (let i = 0; i < contact_list.length; i++) {
            let item = contact_list[i];
            if (item.email) {
                email_cc_slb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.email}</option>`);
            }
        }
        email_cc_slb.select2({
            dropdownParent: $("#send-email"),
            tags: true,
            tokenSeparators: [',', ' ']
        });
    }

    ClassicEditor
        .create(document.querySelector('#email-content-area'))
        .catch(error => {console.error(error);})

    $('.send-email-button').on('click', function () {
        $('#email-subject-input').val('');
        $('#email-content-area').val('');

        loadSaleCodeListEmail();
        loadEmailToList(opportunity_detail_data.customer.contact_mapped);
        loadEmailCcList(opportunity_detail_data.customer.contact_mapped);
    })

    function combinesData_Email(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['subject'] = $('#email-subject-input').val();
        frm.dataForm['opportunity'] = $('#email-sale-code-select-box option:selected').val();
        frm.dataForm['email_to_list'] = email_to_slb.val();
        frm.dataForm['email_cc_list'] = email_cc_slb.val();
        frm.dataForm['content'] = $('#form-new-email .ck-content').html();

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-new-email').submit(function (event) {
        event.preventDefault();
        let combinesData = new combinesData_Email($(this));
        if (combinesData) {
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            $('#send-email').hide();
                            callAjaxToLoadTimeLineList();
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    $(document).on('click', '#table-timeline .detail-email-button', function () {
        let email_id = $(this).attr('data-id');
        let email_detail = $.fn.callAjax2({url: $('#detail-send-email').attr('data-url').replace(0, email_id), method: 'GET'}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_email_detail')) {
                    return data?.['opportunity_email_detail'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )
        Promise.all([email_detail]).then(
            (results) => {
                let email_obj = results[0];
                let detail_email_Opp_slb = $('#detail-email-sale-code-select-box')
                let detail_email_to_slb = $('#detail-email-to-select-box')
                let detail_email_cc_slb = $('#detail-email-cc-select-box')

                $('#detail-email-subject-input').val(email_obj.subject);

                detail_email_Opp_slb.html('');
                detail_email_Opp_slb.append(`<option selected>(${email_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${email_obj.opportunity.title}</option>`);

                detail_email_to_slb.html('');
                for (let i = 0; i < email_obj.email_to_list.length; i++) {
                    detail_email_to_slb.append(`<option selected>${email_obj.email_to_list[i]}</option>`);
                }

                detail_email_cc_slb.html('');
                for (let i = 0; i < email_obj.email_cc_list.length; i++) {
                    detail_email_cc_slb.append(`<option selected>${email_obj.email_cc_list[i]}</option>`);
                }

                $('#detail-email-content-area').html(email_obj.content)
            })
    })

    $(document).on('click', '#table-timeline .delete-email-button', function () {
        let email_id = $(this).attr('data-id');
        $.fn.callAjax2({url: table_timeline.attr('data-url-delete-email').replace(0, email_id), method:'DELETE'}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    callAjaxToLoadTimeLineList();
                }
            },
            (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            }
        )
    })

    // for meeting

    let meeting_Opp_slb = $('#meeting-sale-code-select-box');
    let meeting_address_slb = $('#meeting-address-select-box');
    let meeting_customer_member_slb = $('#meeting-customer-member-select-box');
    let meeting_employee_attended_slb = $('#meeting-employee-attended-select-box');
    let meeting_date_input = $('#meeting-date-input');

    function loadMeetingSaleCodeList() {
        meeting_Opp_slb.prop('disabled', true);
        meeting_Opp_slb.html(``);
        meeting_Opp_slb.append(`<option selected value="${opportunity_detail_data.id}">(${opportunity_detail_data.code})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${opportunity_detail_data.title}</option>`);
        meeting_Opp_slb.initSelect2();
    }

    function loadMeetingAddress(shipping_address_list) {
        meeting_address_slb.attr('disabled', false);
        $('#meeting-address-select-box option').remove();
        meeting_address_slb.initSelect2();
        for (let i = 0; i < shipping_address_list.length; i++) {
            if (shipping_address_list[i].is_default) {
                meeting_address_slb.append(`<option selected>${shipping_address_list[i].full_address}</option>`);
            }
            else {
                meeting_address_slb.append(`<option>${shipping_address_list[i].full_address}</option>`);
            }
        }
    }

    function loadCustomerMember(contact_list) {
        meeting_customer_member_slb.attr('disabled', false);
        $('#meeting-customer-member-select-box option').remove();
        meeting_customer_member_slb.initSelect2();
        for (let i = 0; i < contact_list.length; i++) {
            meeting_customer_member_slb.append(`<option value="${contact_list[i].id}">${contact_list[i].fullname}</option>`)
        }
    }

    function loadEmployeeAttended(data) {
        meeting_employee_attended_slb.initSelect2({
            ajax: {
                url: meeting_employee_attended_slb.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        })
    }

    meeting_date_input.daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        showDropdowns: true,
        drops: 'down',
        minYear: parseInt(moment().format('YYYY-MM-DD'), 10) - 1,
        locale: {
            format: 'YYYY-MM-DD'
        },
        "cancelClass": "btn-secondary",
        maxYear: parseInt(moment().format('YYYY'), 10) + 100
    });
    meeting_date_input.val('');

    $('#meeting-address-input-btn').on('click', function () {
        $('#meeting-address-select-div').prop('hidden', true);
        $('#meeting-address-input-div').prop('hidden', false);
    })

    $('#meeting-address-select-btn').on('click', function () {
        $('#meeting-address-select-div').prop('hidden', false);
        $('#meeting-address-input-div').prop('hidden', true);
    })

    $('.new-meeting-button').on('click', function () {
        $('#meeting-subject-input').val('');
        meeting_date_input.val('');
        $('#meeting-room-location-input').val('');
        $('#meeting-address-input').val('');
        $('#meeting-result-text-area').val('');
        $('#meeting-repeat-activity').attr('checked', false);
        $('#meeting-address-select-div').prop('hidden', false);
        $('#meeting-address-input-div').prop('hidden', true);
        $('#meeting-employee-attended-select-box option').remove();

        loadMeetingSaleCodeList();
        loadMeetingAddress(opportunity_detail_data.customer.shipping_address);
        loadCustomerMember(opportunity_detail_data.customer.contact_mapped);
        loadEmployeeAttended();
    })

    function combinesData_Meeting(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['subject'] = $('#meeting-subject-input').val();
        frm.dataForm['opportunity'] = $('#meeting-sale-code-select-box option:selected').val();
        frm.dataForm['meeting_date'] = meeting_date_input.val();
        if ($('#meeting-address-select-div').is(':hidden')) {
            frm.dataForm['meeting_address'] = $('#meeting-address-input').val();
        }
        else {
            frm.dataForm['meeting_address'] = $('#meeting-address-select-box option:selected').val();
        }
        frm.dataForm['room_location'] = $('#meeting-room-location-input').val();
        frm.dataForm['input_result'] = $('#meeting-result-text-area').val();

        frm.dataForm['repeat'] = $('#repeat-activity').is(':checked') ? 1 : 0;

        let employee_attended_list = [];
        $('#meeting-employee-attended-select-box option:selected').each(function () {
            employee_attended_list.push(
                {
                    'id': $(this).attr('value'),
                    'code': $(this).attr('data-code'),
                    'fullname': $(this).text()
                }
            )
        })

        let customer_member_list = [];
        $('#meeting-customer-member-select-box option:selected').each(function () {
            customer_member_list.push(
                {
                    'id': $(this).attr('value'),
                    'fullname': $(this).text()
                }
            )
        })

        frm.dataForm['employee_attended_list'] = employee_attended_list;
        frm.dataForm['customer_member_list'] = customer_member_list;

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-new-meeting').submit(function (event) {
        event.preventDefault();
        let combinesData = new combinesData_Meeting($(this));
        if (combinesData) {
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            $('#create-meeting').hide();
                            callAjaxToLoadTimeLineList();
                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })

    $(document).on('click', '#table-timeline .detail-meeting-button', function () {
        let meeting_id = $(this).attr('data-id');
        let meeting_detail = $.fn.callAjax2({url: $('#detail-meeting').attr('data-url').replace(0, meeting_id), method: 'GET'}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_meeting_detail')) {
                    return data?.['opportunity_meeting_detail'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )
        Promise.all([meeting_detail]).then(
            (results) => {
                let meeting_obj = results[0];
                $('#detail-meeting-subject-input').val(meeting_obj.subject);

                $('#detail-meeting-sale-code-select-box option').remove();
                $('#detail-meeting-sale-code-select-box').append(`<option selected>(${meeting_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${meeting_obj.opportunity.title}</option>`);

                $('#detail-meeting-address-select-box option').remove();
                $('#detail-meeting-address-select-box').append(`<option selected>${meeting_obj.meeting_address}</option>`);

                $('#detail-meeting-room-location-input').val(meeting_obj.room_location);

                let detail_meeting_employee_attended_slb = $('#detail-meeting-employee-attended-select-box');
                $('#detail-meeting-employee-attended-select-box option').remove();
                for (let i = 0; i < meeting_obj.employee_attended_list.length; i++) {
                    let employee_attended_item = meeting_obj.employee_attended_list[i];
                    detail_meeting_employee_attended_slb.append(`<option selected>${employee_attended_item.fullname}</option>`);
                }
                detail_meeting_employee_attended_slb.prop('disabled', true);

                let detail_meeting_customer_member_slb = $('#detail-meeting-customer-member-select-box');
                $('#detail-meeting-customer-member-select-box option').remove();
                for (let i = 0; i < meeting_obj.customer_member_list.length; i++) {
                    let customer_member_item = meeting_obj.customer_member_list[i];
                    detail_meeting_customer_member_slb.append(`<option selected>${customer_member_item.fullname}</option>`);
                }
                detail_meeting_customer_member_slb.prop('disabled', true);

                $('#detail-meeting-date-input').val(meeting_obj.meeting_date.split(' ')[0]);

                $('#detail-repeat-activity').prop('checked', meeting_obj.repeat);

                $('#detail-meeting-result-text-area').val(meeting_obj.input_result);
            })
    })

    $(document).on('click', '#table-timeline .delete-meeting-button', function () {
        let meeting_id = $(this).attr('data-id');
        $.fn.callAjax2({url: table_timeline.attr('data-url-delete-meeting').replace(0, meeting_id), method: 'DELETE'}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    callAjaxToLoadTimeLineList();
                }
            },
            (errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            }
        )
    })

    // for task

    function resetFormTask() {
        // clean html select etc.
        $('#employee_inherit_id').val(null).trigger('change');
        $('.label-mark, .wrap-checklist, .wrap-subtask').html('');
        $('#inputLabel').val(null);
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
            $('[name="log_time"]').attr('value', JSON.stringify(data))
            $('#logWorkModal').modal('hide')
        });
    }

    $(function () {
        // declare variable
        const $form = $('#formOpportunityTask')
        const $taskLabelElm = $('#inputLabel')
        const $oppElm = $('#opportunity_id')
        const $attElm = $('[name="attach"]')

        // run single date
        $('input[type="text"].date-picker').daterangepicker({
            minYear: 2023,
            singleDatePicker: true,
            timePicker: false,
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY'
            }
        }).val('').trigger('change')

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
        const $assigneeElm = $('#employee_inherit_id')
        const $assignBtnElm = $(`<a href="#" class="form-text text-muted link-info btn-assign">${$('#form_valid').attr('data-assign-txt')}</a>`)
        $assigneeElm.parents('.form-group').append($assignBtnElm)

        $assignBtnElm.off().on('click', function () {
            const name = $assignerElm.attr('data-name')
            const id = $assignerElm.attr('data-value-id')
            const infoObj = {
                'full_name': name,
                'id': id,
                'selected': true
            }
            $assigneeElm.attr('data-onload', JSON.stringify(infoObj))
            if ($(`option[value="${id}"]`, $assigneeElm).length <= 0)
                $assigneeElm.append(`<option value="${id}">${name}</option>`)
            $assigneeElm.val(id).trigger('change')
        });

        // run init label function
        let formLabel = new labelHandle()
        formLabel.init()
        // public global scope for list page render when edit
        window.formLabel = formLabel

        // auto load opp if in page opp
        let data = {
            'id': $.fn.getPkDetail(),
            'title': '',
            'code': '',
            'selected': true
        }
        const isCheck = setInterval(() => {
            let oppCode = $('#opp_id')
            if (oppCode.length) {
                clearInterval(isCheck)
                data.title = oppCode.attr('data-txt')
                data.code = oppCode.attr('data-code')
                $oppElm.attr('data-onload', JSON.stringify(data)).attr('disabled', true)
                $oppElm.initSelect2()
            }
        }, 1000)

        // click to log-work
        $('.btn-log_work').off().on('click', () => {
            $('#logWorkModal').modal('show')
            $('#startDateLogTime, #endDateLogTime, #EstLogtime').val(null)
            logworkSubmit()
        })

        // run CKEditor
        ClassicEditor.create(document.querySelector('.ck5-rich-txt'),
            {
                toolbar: {
                    items: ['heading', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList']
                },
            },
        ).then(newEditor => {
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
            let _form = new SetupFormSubmit($form);
            let formData = _form.dataForm

            if (formData.log_time === "") delete formData.log_time
            else {
                let temp = formData.log_time.replaceAll("'", '"')
                temp = JSON.parse(temp)
                formData.log_time = temp
            }
            formData.start_date = $x.fn.convertDatetime(formData.start_date, 'DD/MM/YYYY', null)
            formData.end_date = $x.fn.convertDatetime(formData.end_date, 'DD/MM/YYYY', null)
            if (new Date(formData.end_date).getTime() < new Date(formData.start_date).getTime()) {
                $.fn.notifyB({description: $('#form_valid').attr('data-valid-datetime')}, 'failure')
                return false
            }
            formData.priority = parseInt(formData.priority)
            let tagsList = $('#inputLabel').attr('value')
            if (tagsList)
                formData.label = JSON.parse(tagsList)
            formData.employee_created = $('#inputAssigner').attr('value')
            formData.task_status = $('#selectStatus').val()
            formData.checklist = []
            $('.wrap-checklist .checklist_item').each(function () {
                formData.checklist.push({
                    'name': $(this).find('label').text(),
                    'done': $(this).find('input').prop('checked'),
                })
            })

            if (!formData.opportunity) delete formData.opportunity
            if ($oppElm.val()) formData.opportunity = $oppElm.val()

            if ($attElm.val()) {
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
                        if ($('.current-create-task').length) $('.cancel-task').trigger('click')
                        callAjaxToLoadTimeLineList();
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

        let ap_mapped_opp = $.fn.callAjax2({
            url: $('#script-url').attr('data-url-ap-list') + `?opportunity_mapped_id=${pk}`,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('advance_payment_list')) {
                    return data?.['advance_payment_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        let payment_mapped_opp = $.fn.callAjax2({
            url: $('#script-url').attr('data-url-payment-list') + `?opportunity_mapped_id=${pk}`,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('payment_list')) {
                    return data?.['payment_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([ap_mapped_opp, payment_mapped_opp]).then(
            async (results) => {
                let ap_id_list = []
                for (let i = 0; i < results[0].length; i++) {
                    let temp = results[0][i];
                    ap_id_list.push(temp?.['id'])
                    data_timeline_list.push(
                        {
                            "id": temp?.['id'],
                            "type": "ap",
                            "title": "Advance payment",
                            "subject": temp?.['title'],
                            "date": temp?.['date_created']
                        }
                    )
                }

                if (ap_id_list.length > 0) {
                    let payment_mapped_opp = await $.fn.callAjax2({
                        url: $('#script-url').attr('data-url-return-list') + `?advance_payment_id_list=${ap_id_list}`,
                        method: 'GET'
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && typeof data === 'object' && data.hasOwnProperty('return_advances')) {
                                return data?.['return_advances'];
                            }
                            return {};
                        },
                        (errs) => {
                            console.log(errs);
                        }
                    )

                    for (let i = 0; i < payment_mapped_opp.length; i++) {
                        let temp = payment_mapped_opp[i];
                        data_timeline_list.push(
                            {
                                "id": temp?.['id'],
                                "type": "ra",
                                "title": "Return advance",
                                "subject": temp?.['title'],
                                "date": temp?.['date_created']
                            }
                        )
                    }
                }

                for (let i = 0; i < results[1].length; i++) {
                    let temp = results[1][i];
                    data_timeline_list.push(
                        {
                            "id": temp?.['id'],
                            "type": "pm",
                            "title": "Payment",
                            "subject": temp?.['title'],
                            "date": temp?.['date_created']
                        }
                    )
                }
                data_timeline_list.sort((a, b) => new Date(b.date) - new Date(a.date));
                let dtb = $('#table-timeline');
                dtb.DataTable().clear().destroy();
                dtb.DataTableDefault({
                    pageLength: 5,
                    dom: "<'row miner-group'<'col-sm-2 mt-3'f><'col-sm-10'p>>",
                    data: data_timeline_list,
                    columns: [
                        {
                            data: 'activity',
                            className: 'wrap-text w-25',
                            render: (data, type, row, meta) => {
                                let txt = '';
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
                                } else if (row.type === 'ap') {
                                    txt = `<i class="bi bi-piggy-bank-fill"></i>`
                                } else if (row.type === 'pm') {
                                    txt = `<i class="bi bi-credit-card-fill"></i>`
                                } else if (row.type === 'ra') {
                                    txt = `<i class="bi bi-piggy-bank"></i>`
                                }
                                return `<span>${txt}&nbsp;&nbsp;${row.title}</span>`;
                            }
                        },
                        {
                            data: 'subject',
                            className: 'wrap-text w-40',
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
                                if (['call', 'email', 'meeting', 'task'].includes(row.type)) {
                                    return `<a data-type="${row.type}" class="${modal_detail_class} text-primary link-primary underline_hover"
                                       href="" data-bs-toggle="modal" data-id="${row.id}" data-bs-target="${modal_detail_target}">
                                        <span><b>${row.subject}</b></span>
                                    </a>`
                                }
                                else {
                                    if (row.type === 'ap') {
                                        const link = $('#script-url').attr('data-url-ap-detail').format_url_with_uuid(row.id)
                                        return `<a data-type="${row.type}" target="_blank" class="text-primary link-primary underline_hover" href="${link}">
                                            <span><b>${row.subject}</b></span>
                                        </a>`
                                    }
                                    if (row.type === 'pm') {
                                        const link = $('#script-url').attr('data-url-payment-detail').format_url_with_uuid(row.id)
                                        return `<a data-type="${row.type}" target="_blank" class="text-primary link-primary underline_hover" href="${link}">
                                            <span><b>${row.subject}</b></span>
                                        </a>`
                                    }
                                    if (row.type === 'ra') {
                                        const link = $('#script-url').attr('data-url-return-detail').format_url_with_uuid(row.id)
                                        return `<a data-type="${row.type}" target="_blank" class="text-primary link-primary underline_hover" href="${link}">
                                            <span><b>${row.subject}</b></span>
                                        </a>`
                                    }
                                    return ``
                                }
                            }
                        },
                        {
                            data: 'date',
                            className: 'wrap-text w-15',
                            render: (data, type, row, meta) => {
                                return row.date.split(' ')[0]
                            }
                        },
                        {
                            data: 'action',
                            className: 'wrap-text w-10',
                            render: (data, type, row, meta) => {
                                let delete_btn_class = '';
                                if (row.type === 'call') {
                                    delete_btn_class = 'delete-call-log-button';
                                } else if (row.type === 'email') {
                                    delete_btn_class = 'delete-email-button';
                                } else if (row.type === 'meeting') {
                                    delete_btn_class = 'delete-meeting-button';
                                }

                                if (delete_btn_class) {
                                    return `<button type="button" data-id="${row.id}" class="btn btn-icon btn-rounded btn-flush-danger btn-xs flush-soft-hover ${delete_btn_class}"><span class="icon"><i class="bi bi-trash"></i></span></button>`;
                                }
                                else {
                                    return `<button type="button" class="btn btn-icon btn-rounded btn-flush-secondary btn-xs flush-soft-hover disabled"><span class="icon"><i class="bi bi-trash"></i></span></button>`;
                                }
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
            })
    }

    function callAjaxToLoadTimeLineList() {
        $.fn.callAjax($('#table-timeline').attr('data-url-logs_list'), 'GET', {'opportunity': pk})
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    let activity_logs_list = [];
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('activity_logs_list')) {
                        data?.['activity_logs_list'].map(function (item) {
                            if (Object.keys(item?.['task']).length > 0) {
                                activity_logs_list.push({
                                    'id': item?.['task']?.['id'],
                                    'type': item?.['task']?.['activity_type'],
                                    'title': item?.['task']?.['activity_name'],
                                    'subject': item?.['task']?.['subject'],
                                    'date': item?.['date_created'].split(' ')[0],
                                })
                            } else if (Object.keys(item?.['call_log']).length > 0) {
                                activity_logs_list.push({
                                    'id': item?.['call_log']?.['id'],
                                    'type': item?.['call_log']?.['activity_type'],
                                    'title': item?.['call_log']?.['activity_name'],
                                    'subject': item?.['call_log']?.['subject'],
                                    'date': item?.['date_created'].split(' ')[0],
                                })
                            } else if (Object.keys(item?.['email']).length > 0) {
                                activity_logs_list.push({
                                    'id': item?.['email']?.['id'],
                                    'type': item?.['email']?.['activity_type'],
                                    'title': item?.['email']?.['activity_name'],
                                    'subject': item?.['email']?.['subject'],
                                    'date': item?.['date_created'].split(' ')[0],
                                })
                            } else if (Object.keys(item?.['meeting']).length > 0) {
                                activity_logs_list.push({
                                    'id': item?.['meeting']?.['id'],
                                    'type': item?.['meeting']?.['activity_type'],
                                    'title': item?.['meeting']?.['activity_name'],
                                    'subject': item?.['meeting']?.['subject'],
                                    'date': item?.['date_created'].split(' ')[0],
                                })
                            } else if (Object.keys(item?.['document']).length > 0) {
                                activity_logs_list.push({
                                    'id': item?.['document']?.['id'],
                                    'type': item?.['document']?.['activity_type'],
                                    'title': item?.['document']?.['activity_name'],
                                    'subject': item?.['document']?.['subject'],
                                    'date': item?.['date_created'].split(' ')[0],
                                })
                            }
                        });
                    }
                    loadTimelineList(activity_logs_list)
                }
            })
    }

    // callAjaxToLoadTimeLineList();

    function loadDblActivityLogs() {
        let $table = table_timeline;
        let urlMapApp = {
            'quotation.quotation': dataUrlEle.attr('data-url-quotation-detail'),
            'saleorder.saleorder': dataUrlEle.attr('data-url-sale-order-detail'),
            'cashoutflow.advancepayment': dataUrlEle.attr('data-url-advance-detail'),
            'cashoutflow.payment': dataUrlEle.attr('data-url-payment-detail'),
            'cashoutflow.returnadvance': dataUrlEle.attr('data-url-return-detail'),
        }
        let activityMapApp = {
            'quotation.quotation': transEle.attr('data-trans-quotation'),
            'saleorder.saleorder': transEle.attr('data-trans-sale-order'),
            'cashoutflow.advancepayment': transEle.attr('data-trans-advance'),
            'cashoutflow.payment': transEle.attr('data-trans-payment'),
            'cashoutflow.returnadvance': transEle.attr('data-trans-return'),
        }
        let typeMapActivity = {
            1: transEle.attr('data-trans-task'),
            2: transEle.attr('data-trans-call'),
            3: transEle.attr('data-trans-email'),
            4: transEle.attr('data-trans-meeting'),
        }
        let typeMapIcon = {
            0: `<i class="fas fa-file-alt"></i>`,
            1: `<i class="fas fa-tasks"></i>`,
            2: `<i class="fas fa-phone-alt"></i>`,
            3: `<i class="far fa-envelope"></i>`,
            4: `<i class="fas fa-users"></i>`,
        }
        $table.DataTableDefault({
            ajax: {
                url: $table.attr('data-url-logs_list'),
                type: 'GET',
                data: {'opportunity': pk},
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('activity_logs_list')) {
                        return resp.data['activity_logs_list'] ? resp.data['activity_logs_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columnDefs: [],
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        if (row?.['log_type'] === 0) {
                            if (row?.['app_code']) {
                                return `<span class="badge badge-soft-success">${activityMapApp[row?.['app_code']]}</span>`;
                            }
                        } else {
                            return `<span class="badge badge-soft-success">${typeMapActivity[row?.['log_type']]}</span>`;
                        }
                        return `<p></p>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        let link = '';
                        if (row?.['app_code'] && row?.['doc_id']) {
                            link = urlMapApp[row?.['app_code']].format_url_with_uuid(row?.['doc_id']);
                        }
                        let title = row?.['title'] ? row?.['title'] : '';
                        if (row?.['log_type'] === 1) {
                            title = row?.['task']?.['subject'];
                        } else if (row?.['log_type'] === 2) {
                            title = row?.['call_log']?.['subject'];
                        } else if (row?.['log_type'] === 3) {
                            title = row?.['email']?.['subject'];
                        } else if (row?.['log_type'] === 4) {
                            title = row?.['meeting']?.['subject'];
                        }
                        return `<a href="${link}" target="_blank"><p>${title}</p></a>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return typeMapIcon[row?.['log_type']];
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(row?.['date_created'], {
                            'outputFormat': 'DD-MM-YYYY',
                        });
                    }
                },
                {
                    targets: 4,
                    render: () => {
                        return `<button type="button" class="btn btn-icon btn-rounded flush-soft-hover del-row" disabled><span class="icon"><i class="fa-regular fa-trash-can"></i></span></button>`;
                    }
                },
            ],
        });
    }

    loadDblActivityLogs();

    $(document).on('click', '#table-timeline .detail-call-log-button', function () {
        let call_log_id = $(this).attr('data-id');
        let call_log_detail = $.fn.callAjax2({url: $('#detail-call-log').attr('data-url').replace(0, call_log_id), method: 'GET'}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_call_log_detail')) {
                    return data?.['opportunity_call_log_detail'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )
        Promise.all([call_log_detail]).then(
            (results) => {
                let call_log_obj = results[0];
                $('#detail-subject-input').val(call_log_obj.subject);

                $('#detail-sale-code-select-box option').remove();
                $('#detail-sale-code-select-box').append(`<option selected>(${call_log_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${call_log_obj.opportunity.title}</option>`);

                $('#detail-account-select-box option').remove();
                $('#detail-account-select-box').append(`<option selected>${call_log_obj.opportunity.customer.title}</option>`);

                $('#detail-contact-select-box option').remove();
                $('#detail-contact-select-box').append(`<option selected>${call_log_obj.contact.fullname}</option>`);

                $('#detail-date-input').val(call_log_obj.call_date.split(' ')[0]);
                $('#detail-repeat-activity').prop('checked', call_log_obj.repeat);
                $('#detail-result-text-area').val(call_log_obj.input_result);
            })
    })

    $(document).on('click', '#table-timeline .detail-email-button', function () {
        let email_id = $(this).attr('data-id');
        let email_detail = $.fn.callAjax2({url: $('#detail-send-email').attr('data-url').replace(0, email_id), method: 'GET'}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_email_detail')) {
                    return data?.['opportunity_email_detail'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )
        Promise.all([email_detail]).then(
            (results) => {
                let email_obj = results[0];
                let detail_email_Opp_slb = $('#detail-email-sale-code-select-box')
                let detail_email_to_slb = $('#detail-email-to-select-box')
                let detail_email_cc_slb = $('#detail-email-cc-select-box')

                $('#detail-email-subject-input').val(email_obj.subject);

                detail_email_Opp_slb.html('');
                detail_email_Opp_slb.append(`<option selected>(${email_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${email_obj.opportunity.title}</option>`);

                detail_email_to_slb.html('');
                for (let i = 0; i < email_obj.email_to_list.length; i++) {
                    detail_email_to_slb.append(`<option selected>${email_obj.email_to_list[i]}</option>`);
                }

                detail_email_cc_slb.html('');
                for (let i = 0; i < email_obj.email_cc_list.length; i++) {
                    detail_email_cc_slb.append(`<option selected>${email_obj.email_cc_list[i]}</option>`);
                }

                $('#detail-email-content-area').html(email_obj.content)
            })
    })

    $(document).on('click', '#table-timeline .detail-meeting-button', function () {
        let meeting_id = $(this).attr('data-id');
        let meeting_detail = $.fn.callAjax2({url: $('#detail-meeting').attr('data-url').replace(0, meeting_id), method: 'GET'}).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_meeting_detail')) {
                    return data?.['opportunity_meeting_detail'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )
        Promise.all([meeting_detail]).then(
            (results) => {
                let meeting_obj = results[0];
                $('#detail-meeting-subject-input').val(meeting_obj.subject);

                $('#detail-meeting-sale-code-select-box option').remove();
                $('#detail-meeting-sale-code-select-box').append(`<option selected>(${meeting_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${meeting_obj.opportunity.title}</option>`);

                $('#detail-meeting-address-select-box option').remove();
                $('#detail-meeting-address-select-box').append(`<option selected>${meeting_obj.meeting_address}</option>`);

                $('#detail-meeting-room-location-input').val(meeting_obj.room_location);

                let detail_meeting_employee_attended_slb = $('#detail-meeting-employee-attended-select-box');
                $('#detail-meeting-employee-attended-select-box option').remove();
                for (let i = 0; i < meeting_obj.employee_attended_list.length; i++) {
                    let employee_attended_item = meeting_obj.employee_attended_list[i];
                    detail_meeting_employee_attended_slb.append(`<option selected>${employee_attended_item.fullname}</option>`);
                }
                detail_meeting_employee_attended_slb.prop('disabled', true);

                let detail_meeting_customer_member_slb = $('#detail-meeting-customer-member-select-box');
                $('#detail-meeting-customer-member-select-box option').remove();
                for (let i = 0; i < meeting_obj.customer_member_list.length; i++) {
                    let customer_member_item = meeting_obj.customer_member_list[i];
                    detail_meeting_customer_member_slb.append(`<option selected>${customer_member_item.fullname}</option>`);
                }
                detail_meeting_customer_member_slb.prop('disabled', true);

                $('#detail-meeting-date-input').val(meeting_obj.meeting_date.split(' ')[0]);

                $('#detail-repeat-activity').prop('checked', meeting_obj.repeat);

                $('#detail-meeting-result-text-area').val(meeting_obj.input_result);
            })
    })

    let prm_detail = $.fn.callAjax2({
        url: frmDetail.data('url'),
        method: 'GET'
    }).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && typeof data === 'object' && data.hasOwnProperty('opportunity')) {
                loadPermitEmpty();
                return data?.['opportunity'];
            }
            return {};
        },
        (errs) => {
        }
    )

    Promise.all([prm_detail]).then(
        (results) => {
            const opportunity_detail = results[0];
            let paramString = {
                'id': opportunity_detail.id,
                'code': opportunity_detail.code,
                'title': opportunity_detail.title,
                'sale_person': opportunity_detail.sale_person,
            }

            // event create related features
            $('#dropdown-menu-relate-app #create-advance-payment-shortcut').on('click', function () {
                let url = $(this).attr('data-url') + `?type=0&&sale_code_mapped=${$(this).attr('data-sale_code_mapped')}&&quotation_object=${$(this).attr('data-quotation_object')}&&sale_order_object=${$(this).attr('data-sale_order_object')}`
                window.open(url, '_blank');
            })
            $('#dropdown-menu-relate-app #create-payment-shortcut').on('click', function () {
                let url = $(this).attr('data-url') + `?type=0&&sale_code_mapped=${$(this).attr('data-sale_code_mapped')}&&quotation_object=${$(this).attr('data-quotation_object')}&&sale_order_object=${$(this).attr('data-sale_order_object')}`
                window.open(url, '_blank');
            })
            $('#dropdown-menu-relate-app #create-return-advance-shortcut').on('click', function () {
                let url = $(this).attr('data-url') + `?opportunity=${$(this).attr('data-opportunity_mapped')}`
                window.open(url, '_blank');
            })

            $(document).on('click', '.btn-add-document', function () {
                let url = $(this).data('url') + "?opportunity={0}".format_by_idx(encodeURIComponent(JSON.stringify(paramString)));
                window.open(url, '_blank');
            })

            // event on click to create relate apps from opportunity
            $('#dropdown-menu-relate-app').on('click', '.relate-app', function () {
                let url = $(this).data('url') + "?opportunity={0}".format_by_idx(encodeURIComponent(JSON.stringify(paramString)));
                window.open(url, '_blank');
            })

            $('#btn-create-related-feature').on('click', function () {
                let dataInitSaleCode = results[0];

                let dataParam_ap = {'list_from_app': 'cashoutflow.advancepayment.create'}
                let opp_list_ajax= $.fn.callAjax2({
                    url: $('#script-url').attr('data-url-opp-list'),
                    data: dataParam_ap,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                                return data?.['opportunity_list'];
                            }
                        }
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([opp_list_ajax]).then(
                    (results) => {
                        let opp_list = results[0];
                        for (let opp of opp_list) {
                            if (opp?.['id'] === dataInitSaleCode?.['id']) {
                                let sale_code_mapped= encodeURIComponent(JSON.stringify({'id': opp?.['id'], 'code': opp?.['code'], 'title': opp?.['title']}));
                                let quotation= encodeURIComponent(JSON.stringify(opp?.['quotation']));
                                let sale_order= encodeURIComponent(JSON.stringify(opp?.['sale_order']));
                                $('#create-advance-payment-shortcut').removeClass('disabled');
                                $('#create-advance-payment-shortcut').attr('data-sale_code_mapped', sale_code_mapped)
                                $('#create-advance-payment-shortcut').attr('data-quotation_object', quotation)
                                $('#create-advance-payment-shortcut').attr('data-sale_order_object', sale_order)
                                break;
                            }
                        }
                    })

                let dataParam_payment = {'list_from_app': 'cashoutflow.payment.create'}
                opp_list_ajax= $.fn.callAjax2({
                    url: $('#script-url').attr('data-url-opp-list'),
                    data: dataParam_payment,
                    method: 'GET'
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('opportunity_list') && Array.isArray(data.opportunity_list)) {
                                return data?.['opportunity_list'];
                            }
                        }
                    },
                    (errs) => {
                        console.log(errs);
                    }
                )

                Promise.all([opp_list_ajax]).then(
                    (results) => {
                        let opp_list = results[0];
                        for (let opp of opp_list) {
                            if (opp?.['id'] === dataInitSaleCode?.['id']) {
                                let sale_code_mapped= encodeURIComponent(JSON.stringify({'id': opp?.['id'], 'code': opp?.['code'], 'title': opp?.['title']}));
                                let quotation= encodeURIComponent(JSON.stringify(opp?.['quotation']));
                                let sale_order= encodeURIComponent(JSON.stringify(opp?.['sale_order']));
                                $('#create-payment-shortcut').removeClass('disabled')
                                $('#create-payment-shortcut').attr('data-sale_code_mapped', sale_code_mapped)
                                $('#create-payment-shortcut').attr('data-quotation_object', quotation)
                                $('#create-payment-shortcut').attr('data-sale_order_object', sale_order)
                                break;
                            }
                        }
                    })

                $('#create-return-advance-shortcut').attr('data-opportunity_mapped', encodeURIComponent(JSON.stringify({'id': dataInitSaleCode?.['id'], 'code': dataInitSaleCode?.['code'], 'title': dataInitSaleCode?.['title']})))
            })
        })

})
