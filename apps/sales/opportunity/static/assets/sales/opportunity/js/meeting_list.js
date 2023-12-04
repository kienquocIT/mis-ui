let employee_current_id = $('#employee_current_id').val();
let meeting_Opp_slb = $('#meeting-sale-code-select-box');
let meeting_customer_member_slb = $('#meeting-customer-member-select-box');
let meeting_address_slb = $('#meeting-address-select-box');
let meeting_employee_attended_slb = $('#meeting-employee-attended-select-box');
let meeting_date_input = $('#meeting-date-input');
let MEETING_LIST = []

function loadOpportunityMeetingList() {
    if (!$.fn.DataTable.isDataTable('#table_opportunity_meeting_list')) {
        let dtb = $('#table_opportunity_meeting_list');
        let frm = new SetupFormSubmit(dtb);
        dtb.DataTableDefault({
            rowIdx: true,
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('meeting_list')) {
                        MEETING_LIST = resp.data['meeting_list']
                        return resp.data['meeting_list'] ? resp.data['meeting_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'wrap-text w-5',
                    render: () => {
                        return ``;
                    }
                },
                {
                    data: 'subject',
                    className: 'wrap-text w-45',
                    render: (data, type, row) => {
                        return `<a class="text-primary link-primary underline_hover detail-meeting-button" href="" data-bs-toggle="modal" data-id="` + row.id + `"
                                    data-bs-target="#detail-meeting"><span><b>` + row.subject + `</b></span></a>`
                    }
                },
                {
                    data: 'opportunity',
                    className: 'wrap-text w-25 text-center',
                    render: (data, type, row) => {
                        return `<span class="badge badge-primary w-50">${row.opportunity.code}</span>`
                    }
                },
                {
                    data: 'meeting_date',
                    className: 'wrap-text w-20 text-center',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(data, {
                            'outputFormat': 'DD-MM-YYYY',
                        });
                    }
                },
                {
                    data: 'action',
                    className: 'wrap-text w-5 text-center',
                    render: (data, type, row) => {
                        let btn = $(`${$('.delete-btn').html()}`)
                        btn.attr('data-id', row.id)
                        return btn.prop('outerHTML')
                    }
                },
            ],
            rowCallback: function(row, data, index){
                $('.detail-meeting-button', row).on('click', function () {
                    let $this = $(this)
                    detailMeeting($this)
                })
            },
        });
    }
}

function loadMeetingSaleCodeList(data) {
    meeting_Opp_slb.initSelect2({
        ajax: {
            url: meeting_Opp_slb.attr('data-url'),
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
                    $.each(item.opportunity_sale_team_datas, function (index, member_obj) {
                        if (member_obj.member.id === employee_current_id) {
                            result.push(item);
                        }
                    });
                }
            }
            return result;
        },
        templateResult: function (data) {
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
        let obj_selected = SelectDDControl.get_data_from_idx(meeting_Opp_slb, meeting_Opp_slb.val())
        if (obj_selected) {
            if (obj_selected?.['is_close']) {
                $.fn.notifyB({description: `Opportunity ${obj_selected?.['code']} has been closed. Can not select.`}, 'failure');
                meeting_Opp_slb.find('option').remove();

            } else {
                loadMeetingAddress(obj_selected?.['customer']?.['shipping_address'])
                loadCustomerMember(obj_selected?.['customer']?.['contact_mapped'])
            }
        }
    })
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

function loadMeetingAddress(shipping_address_list) {
    meeting_address_slb.attr('disabled', false);
    $('#meeting-address-select-box option').remove();
    meeting_address_slb.initSelect2();
    for (let i = 0; i < shipping_address_list.length; i++) {
        if (shipping_address_list[i].is_default) {
            meeting_address_slb.append(`<option selected>${shipping_address_list[i].full_address}</option>`);
        } else {
            meeting_address_slb.append(`<option>${shipping_address_list[i].full_address}</option>`);
        }
    }
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

function detailMeeting($this) {
    let meeting_id = $this.attr('data-id');
    let meeting_obj = MEETING_LIST.filter(function (item) {
        return item.id === meeting_id;
    })[0]
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
    moment.locale('en')
    $('#meeting-from-time').val(moment.utc(meeting_obj['meeting_from_time'], 'hh:mm:ss.SSSSSS').format('hh:mm A'))
    $('#meeting-to-time').val(moment.utc(meeting_obj['meeting_to_time'], 'hh:mm:ss.SSSSSS').format('hh:mm A'))

    $('#detail-repeat-activity').prop('checked', meeting_obj.repeat);

    $('#detail-meeting-result-text-area').val(meeting_obj.input_result);
}

$(document).on('click', '#table_opportunity_meeting_list .delete-activity', function () {
    let meeting_id = $(this).attr('data-id');
    let frm = $('#table_opportunity_meeting_list');
    let csr = $("input[name=csrfmiddlewaretoken]").val();
    $.fn.callAjax(frm.attr('data-url-delete').replace(0, meeting_id), 'DELETE', {}, csr)
        .then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                $.fn.notifyB({description: "Successfully"}, 'success')
                $.fn.redirectUrl(frm.attr('data-url-redirect'), 1000);
            }
        }, (errs) => {
            $.fn.notifyB({description: errs.data.errors}, 'failure');
        })
})

class MeetingHandle {
    load() {
        loadOpportunityMeetingList();
        loadMeetingSaleCodeList();
        loadEmployeeAttended();
    }

    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['subject'] = $('#meeting-subject-input').val();
        frm.dataForm['opportunity'] = $('#meeting-sale-code-select-box option:selected').val();
        frm.dataForm['meeting_date'] = meeting_date_input.val();
        if ($('#meeting-address-select-div').is(':hidden')) {
            frm.dataForm['meeting_address'] = $('#meeting-address-input').val();
        } else {
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
        frm.dataForm['meeting_from_time'] = frm.dataForm['meeting_from_time'].split(' ')[0]+':00';
        frm.dataForm['meeting_to_time'] = frm.dataForm['meeting_to_time'].split(' ')[0]+':00';

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}

$(document).ready(function () {
    new MeetingHandle().load();

    $('#form-new-meeting').submit(function (event) {
        event.preventDefault();
        let combinesData = new MeetingHandle().combinesData($(this));
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