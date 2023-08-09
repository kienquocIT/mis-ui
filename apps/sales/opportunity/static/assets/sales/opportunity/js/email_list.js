$(function () {
    $(document).ready(function () {
        let employee_current_id = $('#employee_current_id').val();
        const account_list = JSON.parse($('#account_list').text());
        const contact_list = JSON.parse($('#contact_list').text());
        const opportunity_list = JSON.parse($('#opportunity_list').text());
        const email_list = JSON.parse($('#email_list').text());

        $('#email-to-select-box').select2({
            dropdownParent: $("#send-email"),
            tags: true,
            tokenSeparators: [',', ' ']
        });

        $('#email-cc-select-box').select2({
            dropdownParent: $("#send-email"),
            tags: true,
            tokenSeparators: [',', ' '],
        });

        $('#detail-email-to-select-box').select2({
            dropdownParent: $("#detail-send-email"),
            tags: true,
            tokenSeparators: [',', ' ']
        });

        $('#detail-email-cc-select-box').select2({
            dropdownParent: $("#detail-send-email"),
            tags: true,
            tokenSeparators: [',', ' '],
        });

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

        function LoadEmailToList(contact_id_list) {
            let $to_sb = $('#email-to-select-box');
            $to_sb.html(``);
            contact_list.map(function (item) {
                if (contact_id_list.includes(item.id)) {
                    if (item.email === null) {
                        $to_sb.append(`<option disabled>${item.fullname}</option>`);
                    } else {
                        $to_sb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.email}</option>`);
                    }
                }
            });
        }

        function LoadEmailCcList(contact_id_list) {
            let $cc_sb = $('#email-cc-select-box');
            $cc_sb.html(``);
            contact_list.map(function (item) {
                if (contact_id_list.includes(item.id)) {
                    if (item.email === null) {
                        $cc_sb.append(`<option disabled>${item.fullname}</option>`);
                    } else {
                        $cc_sb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.email}</option>`);
                    }
                }
            });
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

        $('#form-new-email').submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['subject'] = $('#email-subject-input').val();
            if ($('#inputEmailTo').attr('hidden') !== 'hidden') {
                frm.dataForm['email_to'] = $('#inputEmailTo').val();
            }
            frm.dataForm['email_to_list'] = $('#email-to-select-box').val();
            frm.dataForm['opportunity'] = $('#email-sale-code-select-box option:selected').val();
            frm.dataForm['email_cc_list'] = $('#email-cc-select-box').val();
            frm.dataForm['content'] = $('#email-content-area').val();

            console.log(frm.dataForm)

            $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm, csr)
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $.fn.redirectUrl(frm.dataUrlRedirect, 1000);
                    }
                },
                (errs) => {
                    // $.fn.notifyB({description: errs.data.errors}, 'failure');
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
                            data: 'email_to_list',
                            className: 'wrap-text w-10',
                            render: (data, type, row, meta) => {
                                let html = `<div class="btn-group dropdown w-100">
                                                <a type="button" class="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></a>
                                                <div class="dropdown-menu">`;
                                for (let i = 0; i < row.email_to_list.length; i++) {
                                    html += `<a class="dropdown-item">` + row.email_to_list[i] + `</a>`
                                }
                                return html+`</div></div>`;
                            }
                        },
                        {
                            data: 'subject',
                            className: 'wrap-text w-35',
                            render: (data, type, row, meta) => {
                                return `<a class="text-primary link-primary underline_hover detail-email-button" href="" data-bs-toggle="modal" data-id="` + row.id + `"
                                            data-bs-target="#detail-send-email"><span><b>` + row.subject + `</b></span></a>`
                            }
                        },
                        {
                            data: 'opportunity',
                            className: 'wrap-text w-25 text-center',
                            render: (data, type, row, meta) => {
                                return row.opportunity.code
                            }
                        },
                        {
                            data: 'date_created',
                            className: 'wrap-text w-20 text-center',
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
            for (let i = 0; i < email_obj.email_to_list.length; i++) {
                $('#detail-email-to-select-box').append(`<option selected>${email_obj.email_to_list[i]}</option>`);
            }

            $('#detail-email-cc-select-box option').remove();
            for (let i = 0; i < email_obj.email_cc_list.length; i++) {
                $('#detail-email-cc-select-box').append(`<option selected>${email_obj.email_cc_list[i]}</option>`);
            }

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
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    $.fn.redirectUrl(frm.attr('data-url-redirect'), 1000);
                }
            },(errs) => {})
        })
    });
});