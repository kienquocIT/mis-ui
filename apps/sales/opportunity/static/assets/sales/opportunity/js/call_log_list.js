"use strict";
$(function () {
    $(document).ready(function () {
        let employee_current_id = $('#employee_current_id').val();
        const account_list = JSON.parse($('#account_list').text());

        function LoadSaleCodeList(employee_current_id) {
            let $sale_code_sb = $('#sale-code-select-box');
            $.fn.callAjax($sale_code_sb.attr('data-url'), $sale_code_sb.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    console.log(data)
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_list')) {
                        $sale_code_sb.append(`<option></option>`)
                        data.opportunity_list.map(function (item) {
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
                    }
                }
            })

            $sale_code_sb.select2({dropdownParent: $("#create-new-call-log")});
        }
        LoadSaleCodeList(employee_current_id);
        function LoadCustomerList(customer_id) {
            let $account_sb = $('#account-select-box');
            $.fn.callAjax($account_sb.attr('data-url'), $account_sb.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('account_list')) {
                        $account_sb.append(`<option></option>`)
                        data.account_list.map(function (item) {
                            if (customer_id === item.id) {
                                $account_sb.append(`<option selected value="${item.id}">${item.name}</option>`);
                            }
                            else {
                                $account_sb.append(`<option value="${item.id}">${item.name}</option>`);
                            }
                        })
                    }
                }
            })

            $account_sb.select2({dropdownParent: $("#create-new-call-log")});
        }
        function LoadContactList(contact_list_id) {
            let $contact_sb = $('#contact-select-box');
            $.fn.callAjax($contact_sb.attr('data-url'), $contact_sb.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('contact_list')) {
                        $contact_sb.append(`<option></option>`)
                        data.contact_list.map(function (item) {
                            if (contact_list_id.includes(item.id)) {
                                $contact_sb.append(`<option value="${item.id}">${item.fullname}</option>`);
                            }
                        })
                    }
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

        $('#sale-code-select-box').on('change', function () {
            let customer_id = $('#sale-code-select-box option:selected').attr('data-customer-id');
            LoadCustomerList(customer_id);
            let contact_list_id = account_list.filter(function(item) {
                return item.id === customer_id;
            })[0].contact_mapped;
            LoadContactList(contact_list_id);
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

        function loadOpportunityCallLogList() {
            if (!$.fn.DataTable.isDataTable('#table_opportunity_call_log_list')) {
                let dtb = $('#table_opportunity_call_log_list');
                let frm = new SetupFormSubmit(dtb);
                dtb.DataTableDefault({
                    ajax: {
                        url: frm.dataUrl,
                        type: frm.dataMethod,
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                return resp.data['call_log_list'] ? resp.data['call_log_list'] : [];
                            }
                            return [];
                        },
                    },
                    columns: [
                        {
                            data: 'contact',
                            className: 'wrap-text w-20',
                            render: (data, type, row, meta) => {
                                return `<a target="_blank" href="` + $('#table_opportunity_call_log_list').attr('data-url-contact-detail').replace('0', row.contact.id) + `"><span class="text-primary link-primary underline_hover"><b>` + row.contact.fullname + `</b></span></a>`
                            }
                        },
                        {
                            data: 'subject',
                            className: 'wrap-text w-30',
                            render: (data, type, row, meta) => {
                                return `<span><b>` + row.subject + `</b></span>`
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
        loadOpportunityCallLogList();
    });
});