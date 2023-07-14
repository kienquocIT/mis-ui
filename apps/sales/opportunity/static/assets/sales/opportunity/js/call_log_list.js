"use strict";
$(function () {
    $(document).ready(function () {
        let employee_current_id = $('#employee_current_id').val();
        const account_list = JSON.parse($('#account_list').text());
        const contact_list = JSON.parse($('#contact_list').text());
        const opportunity_list = JSON.parse($('#opportunity_list').text());
        const call_log_list = JSON.parse($('#call_log_list').text());

        function LoadSaleCodeList(employee_current_id) {
            let $sale_code_sb = $('#sale-code-select-box');
            $sale_code_sb.html(``);
            $sale_code_sb.append(`<option></option>`)
            opportunity_list.map(function (item) {
                let added = false;
                if (Object.keys(item.sale_person).length !== 0) {
                    if (item.sale_person.id === employee_current_id) {
                        $sale_code_sb.append(`<option data-customer-id="${item.customer.id}" value="${item.id}">(${item.code})&nbsp;&nbsp;&nbsp;${item.title}</option>`);
                        added = true;
                    }
                }
                if (item.opportunity_sale_team_datas.length > 0 && added === false) {
                    $.each(item.opportunity_sale_team_datas, function(index, member_obj) {
                        if (member_obj.member.id === employee_current_id) {
                            $sale_code_sb.append(`<option data-customer-id="${item.customer.id}" value="${item.id}">(${item.code})&nbsp;&nbsp;&nbsp;${item.title}</option>`);
                            return;
                        }
                    });
                }
            });
            $sale_code_sb.select2({dropdownParent: $("#create-new-call-log")});
        }
        LoadSaleCodeList(employee_current_id);

        function LoadCustomerList(customer_id) {
            let $account_sb = $('#account-select-box');
            $account_sb.html(``);
            $account_sb.append(`<option></option>`)
            account_list.map(function (item) {
                if (customer_id === item.id) {
                    $account_sb.append(`<option selected value="${item.id}">${item.name}</option>`);
                }
                else {
                    $account_sb.append(`<option value="${item.id}">${item.name}</option>`);
                }
            })
            $account_sb.select2({dropdownParent: $("#create-new-call-log")});
        }

        function LoadContactList(contact_list_id) {
            let $contact_sb = $('#contact-select-box');
            $contact_sb.html(``);
            $contact_sb.append(`<option></option>`)
            contact_list.map(function (item) {
                if (contact_list_id.includes(item.id)) {
                    $contact_sb.append(`<option value="${item.id}">${item.fullname}</option>`);
                }
            })
            $contact_sb.select2({dropdownParent: $("#create-new-call-log")});
        }

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
        $('#date-input').val('');

        $('#sale-code-select-box').on('change', function () {
            let customer_id = $('#sale-code-select-box option:selected').attr('data-customer-id');
            LoadCustomerList(customer_id);
            let contact_list_id = account_list.filter(function(item) {
                return item.id === customer_id;
            })[0].contact_mapped;
            LoadContactList(contact_list_id);
        })

        $('#create-new-call-log-button').on('click', function () {
            $('#subject-input').val('');
            $('#result-text-area').val('');
            $('#date-input').val('');
            LoadSaleCodeList(employee_current_id);
            $('#account-select-box option').remove();
            $('#contact-select-box option').remove();
            $('#repeat-activity').prop('checked', false);
        })

        $('#form-create-new-call-log').submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['subject'] = $('#subject-input').val();
            frm.dataForm['opportunity'] = $('#sale-code-select-box').val();
            frm.dataForm['customer'] = $('#account-select-box').val();
            frm.dataForm['contact'] = $('#contact-select-box').val();
            frm.dataForm['call_date'] = $('#date-input').val();
            frm.dataForm['input_result'] = $('#result-text-area').val();
            if ($('#repeat-activity').is(':checked')) {
                frm.dataForm['repeat'] = 1;
            }
            else {
                frm.dataForm['repeat'] = 0;
            }

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

        function loadOpportunityCallLogList(call_log_list) {
            if (!$.fn.DataTable.isDataTable('#table_opportunity_call_log_list')) {
                let dtb = $('#table_opportunity_call_log_list');
                dtb.DataTableDefault({
                    data: call_log_list,
                    columns: [
                        {
                            data: 'contact',
                            className: 'wrap-text w-20',
                            render: (data, type, row, meta) => {
                                return `<a target="_blank" href="` + $('#table_opportunity_call_log_list').attr('data-url-contact-detail').replace('0', row.contact.id) + `"><span class="link-secondary underline_hover"><b>` + row.contact.fullname + `</b></span></a>`
                            }
                        },
                        {
                            data: 'subject',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                return  `<a class="text-primary link-primary underline_hover detail-call-log-button" href="" data-bs-toggle="modal" data-id="` + row.id + `"
                                            data-bs-target="#detail-call-log"><span><b>` + row.subject + `</b></span></a>`
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
                            data: 'call_date',
                            className: 'wrap-text w-20 text-center',
                            render: (data, type, row, meta) => {
                                return `<center><span>` + row.call_date.split(' ')[0] + `</span></center>`
                            }
                        },
                        {
                            data: 'repeat',
                            className: 'wrap-text w-10 text-center',
                            render: (data, type, row, meta) => {
                                if (row.repeat) {
                                    return `Yes`
                                }
                                else {
                                    return `No`
                                }
                            }
                        },
                    ],
                });
            }
        }
        loadOpportunityCallLogList(call_log_list);

        $(document).on('click', '#table_opportunity_call_log_list .detail-call-log-button', function () {
            let call_log_id = $(this).attr('data-id');
            let call_log_obj = JSON.parse($('#call_log_list').text()).filter(function(item) {
                return item.id === call_log_id;
            })[0]
            $('#detail-subject-input').val(call_log_obj.subject);

            $('#detail-sale-code-select-box option').remove();
            $('#detail-sale-code-select-box').append(`<option selected>(${call_log_obj.opportunity.code})&nbsp;&nbsp;&nbsp;${call_log_obj.opportunity.title}</option>`);

            $('#detail-account-select-box option').remove();
            $('#detail-account-select-box').append(`<option selected>${call_log_obj.customer.title}</option>`);

            $('#detail-contact-select-box option').remove();
            $('#detail-contact-select-box').append(`<option selected>${call_log_obj.contact.fullname}</option>`);

            $('#detail-date-input').val(call_log_obj.call_date.split(' ')[0]);
            $('#detail-repeat-activity').prop('checked', call_log_obj.repeat);
            $('#detail-result-text-area').val(call_log_obj.input_result);
        })
    });
});