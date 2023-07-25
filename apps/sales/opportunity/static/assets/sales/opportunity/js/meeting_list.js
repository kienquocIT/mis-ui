$(function () {
    $(document).ready(function () {
        let employee_current_id = $('#employee_current_id').val();
        const account_list = JSON.parse($('#account_list').text());
        const contact_list = JSON.parse($('#contact_list').text());
        const opportunity_list = JSON.parse($('#opportunity_list').text());
        const meeting_list = JSON.parse($('#meeting_list').text());
        const employee_list = JSON.parse($('#employee_list').text());
        const account_map_employees = JSON.parse($('#account_map_employees').text());

        function LoadMeetingSaleCodeList(employee_current_id) {
            let $sc_sb = $('#meeting-sale-code-select-box');
            $sc_sb.html(``);
            $sc_sb.append(`<option></option>`);
            opportunity_list.map(function (item) {
                let added = false;
                if (Object.keys(item.sale_person).length !== 0) {
                    if (item.sale_person.id === employee_current_id) {
                        $sc_sb.append(`<option data-customer-id="${item.customer.id}" value="${item.id}">(${item.code})&nbsp;&nbsp;&nbsp;${item.title}</option>`);
                        added = true;
                    }
                }
                if (item.opportunity_sale_team_datas.length > 0 && added === false) {
                    $.each(item.opportunity_sale_team_datas, function(index, member_obj) {
                        if (member_obj.member.id === employee_current_id) {
                            $sc_sb.append(`<option data-customer-id="${item.customer.id}" value="${item.id}">(${item.code})&nbsp;&nbsp;&nbsp;${item.title}</option>`);
                            return;
                        }
                    });
                }
            });
            $sc_sb.select2({dropdownParent: $("#create-meeting")});
        }
        LoadMeetingSaleCodeList(employee_current_id);

        function LoadCustomerMember(customer_id) {
            let contact_mapped_list = null;
            account_list.map(function (item) {
                if (customer_id === item.id) {
                    contact_mapped_list = item.contact_mapped;
                }
            })
            let $customer_member_sb = $('#meeting-customer-member-select-box');
            $customer_member_sb.html(``);
            $customer_member_sb.append(`<option></option>`);
            contact_list.map(function (item) {
                if (contact_mapped_list.includes(item.id)) {
                    $customer_member_sb.append(`<option value="${item.id}">${item.fullname}</option>`);
                }
            })
            $customer_member_sb.select2({dropdownParent: $("#create-meeting")});
        }

        function LoadEmployeeAttended() {
            let $employee_attended_sb = $('#meeting-employee-attended-select-box');
            $employee_attended_sb.html(``);
            $employee_attended_sb.append(`<option></option>`);
            employee_list.map(function (item) {
                $employee_attended_sb.append(`<option data-code="${item.code}" value="${item.id}">${item.full_name}</option>`);
            })
            $employee_attended_sb.select2({dropdownParent: $("#create-meeting")});
        }
        LoadEmployeeAttended();

        function LoadMeetingAddress(customer_id) {
            let opportunity_obj = JSON.parse($('#opportunity_list').text()).filter(function(item) {
                return item.customer.id === customer_id;
            })
            let shipping_address_list = opportunity_obj[0].customer.shipping_address;
            $('#meeting-address-select-box option').remove();
            $('#meeting-address-select-box').append(`<option></option>`);
            for (let i = 0; i < shipping_address_list.length; i++) {
                $('#meeting-address-select-box').append(`<option>` + shipping_address_list[i] + `</option>`);
            }
        }

        $('#meeting-sale-code-select-box').on('change', function () {
            let customer_id = $('#meeting-sale-code-select-box option:selected').attr('data-customer-id');
            LoadMeetingAddress(customer_id);
            LoadCustomerMember(customer_id);
        })

        $('#meeting-date-input').daterangepicker({
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
        $('#meeting-date-input').val('');

        $('#form-new-meeting').submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['subject'] = $('#meeting-subject-input').val();
            frm.dataForm['opportunity'] = $('#meeting-sale-code-select-box option:selected').val();
            frm.dataForm['meeting_date'] = $('#meeting-date-input').val();
            if ($('#meeting-address-select-box').is(':hidden')) {
                frm.dataForm['meeting_address'] = $('#meeting-address-input').val();
            }
            else {
                frm.dataForm['meeting_address'] = $('#meeting-address-select-box option:selected').val();
            }
            frm.dataForm['room_location'] = $('#meeting-room-location-input').val();
            frm.dataForm['input_result'] = $('#meeting-result-text-area').val();

            if ($('#repeat-activity').is(':checked')) {
                frm.dataForm['repeat'] = 1;
            }
            else {
                frm.dataForm['repeat'] = 0;
            }

            let employee_attended_list = [];
            $('#meeting-employee-attended-select-box option:selected').each(function (index, element) {
                employee_attended_list.push(
                    {
                        'id': $(this).attr('value'),
                        'code': $(this).attr('data-code'),
                        'fullname': $(this).text()
                    }
                )
            })

            let customer_member_list = [];
            $('#meeting-customer-member-select-box option:selected').each(function (index, element) {
                customer_member_list.push(
                    {
                        'id': $(this).attr('value'),
                        'fullname': $(this).text()
                    }
                )
            })

            frm.dataForm['employee_attended_list'] = employee_attended_list;
            frm.dataForm['customer_member_list'] = customer_member_list;

            // console.log(frm.dataForm)

            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyPopup({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    // $.fn.notifyPopup({description: errs.data.errors}, 'failure');
                }
            )
        })

        function loadOpportunityMeetingList(meeting_list) {
            if (!$.fn.DataTable.isDataTable('#table_opportunity_meeting_list')) {
                let dtb = $('#table_opportunity_meeting_list');
                dtb.DataTableDefault({
                    data: meeting_list,
                    columns: [
                        {
                            data: 'subject',
                            className: 'wrap-text w-35',
                            render: (data, type, row, meta) => {
                                return  `<a class="text-primary link-primary underline_hover detail-meeting-button" href="" data-bs-toggle="modal" data-id="` + row.id + `"
                                            data-bs-target="#detail-meeting"><span><b>` + row.subject + `</b></span></a>`
                            }
                        },
                        {
                            data: 'opportunity',
                            className: 'wrap-text w-20 text-center',
                            render: (data, type, row, meta) => {
                                return `<center><span class="text-secondary">` + row.opportunity.code + `</span></center>`
                            }
                        },
                        {
                            data: 'meeting_date',
                            className: 'wrap-text w-20 text-center',
                            render: (data, type, row, meta) => {
                                return `<center><span>` + row.meeting_date.split(' ')[0] + `</span></center>`
                            }
                        },
                        {
                            data: 'repeat',
                            className: 'wrap-text w-15 text-center',
                            render: (data, type, row, meta) => {
                                if (row.repeat) {
                                    return `Yes`
                                }
                                else {
                                    return `No`
                                }
                            }
                        },
                        {
                            data: 'action',
                            className: 'wrap-text w-10 text-center',
                            render: (data, type, row, meta) => {
                                return `<center><button data-id="${row.id}" class="btn btn-icon btn-rounded btn-flush-primary btn-xs delete-activity"><span class="icon"><i class="bi bi-trash"></i></span></button></center>`
                            }
                        },
                    ],
                });
            }
        }
        loadOpportunityMeetingList(meeting_list);

        $('#meeting-address-input-btn').on('click', function () {
            $('#meeting-address-select-box').prop('hidden', true);
            $('#meeting-address-input-btn').prop('hidden', true);
            $('#meeting-address-input').prop('hidden', false);
            $('#meeting-address-select-btn').prop('hidden', false);
        })

        $('#meeting-address-select-btn').on('click', function () {
            $('#meeting-address-select-box').prop('hidden', false);
            $('#meeting-address-input-btn').prop('hidden', false);
            $('#meeting-address-input').prop('hidden', true);
            $('#meeting-address-select-btn').prop('hidden', true);
        })

        $(document).on('click', '#table_opportunity_meeting_list .detail-meeting-button', function () {
            let meeting_id = $(this).attr('data-id');
            let meeting_obj = JSON.parse($('#meeting_list').text()).filter(function(item) {
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

            $('#detail-repeat-activity').prop('checked', meeting_obj.repeat);

            $('#detail-meeting-result-text-area').val(meeting_obj.input_result);
        })

        $(document).on('click', '#table_opportunity_meeting_list .delete-activity', function () {
            let call_log_id = $(this).attr('data-id');
            let frm = $('#table_opportunity_meeting_list');
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(frm.attr('data-url-delete').replace(0, call_log_id), 'DELETE', {}, csr)
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyPopup({description: "Successfully"}, 'success')
                    $.fn.redirectUrl(frm.attr('data-url-redirect'), 1000);
                }
            },(errs) => {})
        })
    });
});