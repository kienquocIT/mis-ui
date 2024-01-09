let employee_current_id = $('#employee_current_id').val();
let call_log_Opp_slb = $('#sale-code-select-box');
let date_input = $('#date-input');
let customer_slb = $('#account-select-box');
let contact_slb = $('#contact-select-box');
let CALL_LOG_LIST = [];
let trans_script = $('#trans-script')

function loadSaleCodeList(data) {
    call_log_Opp_slb.initSelect2({
        ajax: {
            url: call_log_Opp_slb.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            let result = [];
            for (let i = 0; i < resp.data[keyResp].length; i++) {
                let added = false;
                let item = resp.data[keyResp][i];
                if (item?.['sale_person']['id'] === employee_current_id) {
                    result.push(item);
                    added = true;
                }
                if (item.opportunity_sale_team_datas.length > 0 && added === false) {
                    $.each(item.opportunity_sale_team_datas, function(index, member_obj) {
                        if (member_obj.member.id === employee_current_id) {
                            result.push(item);
                        }
                    });
                }
            }
            return result;
        },
        templateResult: function(data) {
            let ele = $('<div class="row col-12"></div>');
            ele.append('<div class="col-4"><span class="badge badge-soft-primary badge-outline">' + data.data?.['code'] + '</span></div>');
            ele.append('<div class="col-8">' + data.data?.['title'] + '</div>');
            return ele;
        },
            data: (data ? data : null),
            keyResp: 'opportunity_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {
        let obj_selected = SelectDDControl.get_data_from_idx(call_log_Opp_slb, call_log_Opp_slb.val())
        if (obj_selected) {
            if (obj_selected?.['is_close']) {
                $.fn.notifyB({description: `Opportunity ${obj_selected?.['code']} has been closed. Can not select.`}, 'failure');
                call_log_Opp_slb.find('option').remove();

            }
            else {
                loadCustomerList(obj_selected?.['customer'])
                loadContactList(obj_selected?.['customer']?.['contact_mapped'])
            }
        }
    })
}

function loadCustomerList(customer_obj) {
    $('#account-select-box option').remove();
    customer_slb.append(`<option selected value="${customer_obj.id}">${customer_obj.title}</option>`);
}

function loadContactList(contact_list) {
    $('#contact-select-box option').remove();
    contact_slb.attr('disabled', false);
    contact_slb.initSelect2();
    contact_slb.append(`<option></option>`)
    for (let i = 0; i < contact_list.length; i++) {
        contact_slb.append(`<option value="${contact_list[i].id}">${contact_list[i].fullname}</option>`)
    }
}

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
date_input.val('');

function loadOpportunityCallLogList() {
    if (!$.fn.DataTable.isDataTable('#table_opportunity_call_log_list')) {
        let dtb = $('#table_opportunity_call_log_list');
        let frm = new SetupFormSubmit(dtb);
        dtb.DataTableDefault({
            rowIdx: true,
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('call_log_list')) {
                        CALL_LOG_LIST = resp.data['call_log_list'];
                        console.log(CALL_LOG_LIST)
                        return resp.data['call_log_list'] ? resp.data['call_log_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return ``;
                    }
                },
                {
                    data: 'contact',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<a target="_blank" href="` + $('#table_opportunity_call_log_list').attr('data-url-contact-detail').replace('0', row.contact.id) + `"><span class="link-secondary underline_hover"><b>` + row.contact.fullname + `</b></span></a>`
                    }
                },
                {
                    data: 'subject',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        let status = ''
                        if (row?.['is_cancelled']) {
                            status = `<span class="badge badge-sm badge-soft-danger">${trans_script.attr('data-trans-activity-cancelled')}</i>`
                        }
                        return  `<a class="text-primary link-primary underline_hover detail-call-log-button" href="" data-bs-toggle="modal" data-id="` + row.id + `"
                                    data-bs-target="#detail-call-log">
                                    <span><b>` + row.subject + `</b></span> <span></span> ${status}
                                </a>`
                    }
                },
                {
                    data: 'opportunity',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `<span class="text-secondary">` + row.opportunity.code + `</span>`
                    }
                },
                {
                    data: 'call_date',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(data, {
                            'outputFormat': 'DD-MM-YYYY',
                        });
                    }
                },
            ],
        });
    }
}

$(document).on('click', '#table_opportunity_call_log_list .detail-call-log-button', function () {
    let call_log_id = $(this).attr('data-id');
    let call_log_obj = CALL_LOG_LIST.filter(function(item) {
        return item.id === call_log_id;
    })[0]
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
    $('#cancel-activity').prop('hidden', call_log_obj.is_cancelled)
    if (call_log_obj.is_cancelled) {
        $('#is-cancelled').text(trans_script.attr('data-trans-activity-cancelled'))
    }
    else {
        $('#is-cancelled').text('')
    }
    $('#detail-call-log .modal-body').attr('data-id', call_log_obj.id)
})

$(document).on('click', '#cancel-activity', function () {
    Swal.fire({
		html:
		`<div class="mb-3"><i class="bi bi-x-square text-danger"></i></div>
             <h5 class="text-danger">${trans_script.attr('data-trans-alert-cancel')}</h5>
             <p>${trans_script.attr('data-trans-alert-warn')}</p>`,
		customClass: {
			confirmButton: 'btn btn-outline-secondary text-danger',
			cancelButton: 'btn btn-outline-secondary text-gray',
			container:'swal2-has-bg',
			actions:'w-100'
		},
		showCancelButton: true,
		buttonsStyling: false,
		confirmButtonText: 'Yes',
		cancelButtonText: 'No',
		reverseButtons: true
	}).then((result) => {
		if (result.value) {
		    let call_log_id = $('#detail-call-log .modal-body').attr('data-id')
            let frm = $('#table_opportunity_call_log_list');
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(frm.attr('data-url-delete').replace(0, call_log_id), 'PUT', {'is_cancelled': !$('#cancel-activity').prop('disabled')}, csr)
            .then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    $.fn.notifyB({description: "Successfully"}, 'success')
                    $.fn.redirectUrl(frm.attr('data-url-redirect'), 1000);
                }
            },(errs) => {
                $.fn.notifyB({description: errs.data.errors}, 'failure');
            })
		}
	})
})

class CallLogHandle {
    load() {
        loadOpportunityCallLogList();
        loadSaleCodeList()
    }
    combinesData(frmEle) {
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
}

$(document).ready(function () {
    new CallLogHandle().load();

    $('#form-create-new-call-log').submit(function (event) {
        event.preventDefault();
        let combinesData = new CallLogHandle().combinesData($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
                        }
                    },
                    (errs) => {
                        setTimeout(
                            () => {
                                WindowControl.hideLoading();
                            },
                            1000
                        )
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
        }
    })
});