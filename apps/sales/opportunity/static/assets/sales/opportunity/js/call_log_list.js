"use strict";
$(function () {
    $(document).ready(function () {
        let employee_current_id = $('#employee_current_id').val();
        function LoadSaleCodeList() {
            let $sale_code_sb = $('#sale-code-select-box');
            $.fn.callAjax($sale_code_sb.attr('data-url'), $sale_code_sb.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('opportunity_list')) {
                        $sale_code_sb.append(`<option></option>`)
                        data.opportunity_list.map(function (item) {
                            $sale_code_sb.append(`<option value="${item.id}">(${item.code})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item.title}</option>`);
                        })
                    }
                }
            })

            $sale_code_sb.select2();
        }
        function LoadCustomerList() {
            let $account_sb = $('#account-select-box');
            $.fn.callAjax($account_sb.attr('data-url'), $account_sb.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('account_list')) {
                        $account_sb.append(`<option></option>`)
                        data.account_list.map(function (item) {
                            $account_sb.append(`<option value="${item.id}">${item.name}</option>`);
                        })
                    }
                }
            })

            $account_sb.select2();
        }
        function LoadContactList() {
            let $contact_sb = $('#contact-select-box');
            $.fn.callAjax($contact_sb.attr('data-url'), $contact_sb.attr('data-method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('contact_list')) {
                        $contact_sb.append(`<option></option>`)
                        data.contact_list.map(function (item) {
                            $contact_sb.append(`<option value="${item.id}">${item.fullname}</option>`);
                        })
                    }
                }
            })

            $contact_sb.select2();
        }
        LoadSaleCodeList();
        LoadCustomerList();
        LoadContactList();

        $('#date-input').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: true,
            drops: 'auto',
            minYear: parseInt(moment().format('YYYY-MM-DD'), 10) - 1,
            locale: {
                format: 'YYYY-MM-DD hh:mm:ss'
            },
            "cancelClass": "btn-secondary",
            maxYear: parseInt(moment().format('YYYY'), 10) + 100
        });

        $('#form-create-new-call-log').submit(function (event) {
            event.preventDefault();
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let frm = new SetupFormSubmit($(this));

            frm.dataForm['subject'] = $('#subject-input').val();
            frm.dataForm['opportunity'] = $('#sale-code-select-box').val();
            frm.dataForm['customer'] = $('#account-select-box').val();
            frm.dataForm['contact'] = $('#contact-select-box').val();
            frm.dataForm['call_date'] = $('#date-input').val();
            frm.dataForm['result'] = $('#result-text-area').val();
            if ($('#repeat-activity').is(':checked')) {
                frm.dataForm['repeat'] = 1;
            }
            else {
                frm.dataForm['repeat'] = 0;
            }

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
                            data: 'subject',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span><b>` + row.subject + `</b></span>`
                            }
                        },
                        {
                            data: 'To Contact',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<span class="text-primary">` + row.contact.fullname + `</span>`
                            }
                        },
                        {
                            data: 'opportunity',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<center><span class="badge badge-soft-blue w-50">` + row.opportunity.code + `</span></center>`
                            }
                        },
                        {
                            data: 'call_date',
                            className: 'wrap-text',
                            render: (data, type, row, meta) => {
                                return `<center><span>` + row.call_date + `</span></center>`
                            }
                        },
                    ],
                });
            }
        }
        loadOpportunityCallLogList();
    });
});