"use strict";
$(function () {
    $(document).ready(function () {
        let employee_current_id = $('#employee_current_id').val();
        const account_list = JSON.parse($('#account_list').text());
        const contact_list = JSON.parse($('#contact_list').text());
        const opportunity_list = JSON.parse($('#opportunity_list').text());
        const email_list = JSON.parse($('#email_list').text());

        function LoadEmailSaleCodeList(employee_current_id) {
            let $sc_sb = $('#email-sale-code-select-box');
            $sc_sb.html(``);
            $sc_sb.append(`<option></option>`)
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
            $sc_sb.select2({dropdownParent: $("#send-email")});
        }
        LoadEmailSaleCodeList(employee_current_id);

        function LoadEmailToList(contact_list_id) {
            let $to_sb = $('#email-to-select-box');
            $to_sb.html(``);
            $to_sb.append(`<option></option>`)
            contact_list.map(function (item) {
                if (contact_list_id.includes(item.id)) {
                    if (item.email === null) {
                        $to_sb.append(`<option disabled>${item.fullname}</option>`);
                    } else {
                        $to_sb.append(`<option value="${item.email}">${item.fullname}&nbsp;&nbsp;&nbsp;(${item.email})</option>`);
                    }
                }
            });
            $to_sb.select2({dropdownParent: $("#send-email")});
        }

        function LoadEmailCcList(contact_list_id) {
            let $cc_sb = $('#email-cc-select-box');
            $cc_sb.html(``);
            $cc_sb.append(`<option></option>`)
            contact_list.map(function (item) {
                if (contact_list_id.includes(item.id)) {
                    if (item.email === null) {
                        $cc_sb.append(`<option disabled>${item.fullname}</option>`);
                    } else {
                        $cc_sb.append(`<option value="${item.email}">${item.fullname}&nbsp;&nbsp;&nbsp;(${item.email})</option>`);
                    }
                }
            });
            $cc_sb.select2({dropdownParent: $("#send-email")});
        }

        $('#send-email-button').on('click', function () {
            $('#email-subject-input').val('');
            $('#email-content-area').val('');
            LoadEmailSaleCodeList(employee_current_id);

            $('#email-to-select-box').prop('hidden', false);
            $('#email-to-select-box').next(1).prop('hidden', false);
            $('#inputEmailTo').prop('hidden', true);
            $('#email-to-select-btn').prop('hidden', true);
            $('#email-to-input-btn').prop('hidden', false);

            $('#email-to-select-box option').remove();
            $('#email-cc-select-box option').remove();
        })

        $('#email-sale-code-select-box').on('change', function () {
            let contact_list_id = account_list.filter(function(item) {
                return item.id === $('#email-sale-code-select-box option:selected').attr('data-customer-id');
            })[0].contact_mapped;
            LoadEmailToList(contact_list_id);
            LoadEmailCcList(contact_list_id);
            $('#email-cc-input-btn').prop('hidden', false);
            $('#inputEmailCc').prop('hidden', true);
            $('#email-cc-add').prop('hidden', true);
            $('#email-cc-remove').prop('hidden', true);
        })

        $('#email-to-input-btn').on('click', function() {
            $('#email-to-select-box').prop('hidden', true);
            $('#email-to-select-box').next(1).prop('hidden', true);
            $('#inputEmailTo').prop('hidden', false);
            $('#email-to-select-btn').prop('hidden', false);
            $('#email-to-input-btn').prop('hidden', true);
        })
        $('#email-to-select-btn').on('click', function() {
            $('#email-to-select-box').prop('hidden', false);
            $('#email-to-select-box').next(1).prop('hidden', false);
            $('#inputEmailTo').prop('hidden', true);
            $('#email-to-select-btn').prop('hidden', true);
            $('#email-to-input-btn').prop('hidden', false);
        })

        $('#email-cc-input-btn').on('click', function() {
            $('#inputEmailCc').prop('hidden', false);
            $('#email-cc-add').prop('hidden', false);
            $('#email-cc-remove').prop('hidden', false);
            $(this).prop('hidden', true);
        })
        $('#email-cc-remove').on('click', function() {
            $('#email-cc-input-btn').prop('hidden', false);
            $('#inputEmailCc').prop('hidden', true);
            $('#email-cc-add').prop('hidden', true);
            $(this).prop('hidden', true);
        })
        $('#email-cc-add').on('click', function() {
            if ($('#inputEmailCc').val()) {
                let data_email = $('#inputEmailCc').val();
                $('#email-cc-select-box').append(`<option selected value="` + data_email + `">` + data_email + `</option>`);
                $('#inputEmailCc').val('');
            }
        })

        $('#form-new-email').submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['subject'] = $('#email-subject-input').val();
            if ($('#inputEmailTo').attr('hidden') !== 'hidden') {
                frm.dataForm['email_to'] = $('#inputEmailTo').val();
            }
            if ($('#email-to-select-box').attr('hidden') !== 'hidden') {
                frm.dataForm['email_to'] = $('#email-to-select-box option:selected').attr('value');
            }
            frm.dataForm['email_to_contact'] = $('#email-to-select-box option:selected').attr('data-email-to-contact');
            frm.dataForm['opportunity'] = $('#email-sale-code-select-box option:selected').val();
            frm.dataForm['email_cc_list'] = $('#email-cc-select-box').val();
            frm.dataForm['content'] = $('#email-content-area').val();

            console.log(frm.dataForm)

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

        function loadOpportunityEmailList() {
            if (!$.fn.DataTable.isDataTable('#table_opportunity_email_list')) {
                let dtb = $('#table_opportunity_email_list');
                dtb.DataTableDefault({
                    data: email_list,
                    columns: [
                        {
                            data: 'email_to',
                            className: 'wrap-text w-25',
                            render: (data, type, row, meta) => {
                                if (Object.keys(row.email_to_contact).length !== 0) {
                                    return `<a target="_blank" href="` + $('#table_opportunity_email_list').attr('data-url-contact-detail').replace('0', row.email_to_contact.id) + `"><span class="link-secondary underline_hover"><b>` + row.email_to_contact.fullname + `</b></span></a>`
                                }
                                else {
                                    return `<span class="text-secondary">` + row.email_to + `</span>`
                                }
                            }
                        },
                        {
                            data: 'subject',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                return `<a class="text-primary link-primary underline_hover detail-email-button" href="" data-bs-toggle="modal" data-id="` + row.id + `"
                                            data-bs-target="#detail-send-email"><span><b>` + row.subject + `</b></span></a>`
                            }
                        },
                        {
                            data: 'opportunity',
                            className: 'wrap-text w-20 text-center',
                            render: (data, type, row, meta) => {
                                return row.opportunity.code
                            }
                        },
                        {
                            data: 'date_created',
                            className: 'wrap-text w-15 text-center',
                            render: (data, type, row, meta) => {
                                return row.date_created.split(' ')[0]
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
        loadOpportunityEmailList();

        $(document).on('click', '#table_opportunity_email_list .detail-email-button', function () {
            let email_id = $(this).attr('data-id');
            let email_obj = JSON.parse($('#email_list').text()).filter(function(item) {
                return item.id === email_id;
            })[0]
            $('#detail-email-subject-input').val(email_obj.subject);

            $('#detail-email-sale-code-select-box option').remove();
            $('#detail-email-sale-code-select-box').append(`<option selected>(${email_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${email_obj.opportunity.title}</option>`);

            $('#detail-email-to-select-box option').remove();
            if (Object.keys(email_obj.email_to_contact).length !== 0) {
                $('#detail-email-to-select-box').append(`<option selected>${email_obj.email_to_contact.fullname}&nbsp;&nbsp;&nbsp;(${email_obj.email_to_contact.email})</option>`);
            }
            else {
                $('#detail-email-to-select-box').append(`<option selected>${email_obj.email_to}</option>`);
            }

            $('#detail-email-cc-select-box option').remove();
            for (let i = 0; i < email_obj.email_cc_list.length; i++) {
                $('#detail-email-cc-select-box').append(`<option selected>${email_obj.email_cc_list[i]}</option>`);
            }
            $('#detail-email-cc-select-box').prop('disabled', true)

            $('#detail-email-content-area').val(email_obj.content);
        })

        $(document).on('click', '#table_opportunity_email_list .delete-activity', function () {
            let call_log_id = $(this).attr('data-id');
            let frm = $('#table_opportunity_email_list');
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