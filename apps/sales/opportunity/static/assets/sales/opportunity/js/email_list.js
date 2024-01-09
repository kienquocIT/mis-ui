let employee_current_id = $('#employee_current_id').val()
let email_Opp_slb = $('#email-sale-code-select-box')
let email_to_slb = $('#email-to-select-box')
let email_cc_slb = $('#email-cc-select-box')
let detail_email_Opp_slb = $('#detail-email-sale-code-select-box')
let detail_email_to_slb = $('#detail-email-to-select-box')
let detail_email_cc_slb = $('#detail-email-cc-select-box')
let send_email_modal = $("#send-email")
let detail_send_email_modal = $("#detail-send-email")
let EMAIL_LIST = [];

detail_email_to_slb.select2({
    dropdownParent: detail_send_email_modal,
    tags: true,
    tokenSeparators: [',', ' ']
});

detail_email_cc_slb.select2({
    dropdownParent: detail_send_email_modal,
    tags: true,
    tokenSeparators: [',', ' '],
});

function loadEmailToList(contact_list) {
    email_to_slb.attr('disabled', false);
    email_to_slb.html(``);
    for (let i = 0; i < contact_list.length; i++) {
        let item = contact_list[i];
        if (item.email) {
            email_to_slb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.email}</option>`);
        }
    }
    email_to_slb.select2({
        dropdownParent: send_email_modal,
        tags: true,
        tokenSeparators: [',', ' ']
    });
}

function loadEmailCcList(contact_list) {
    email_cc_slb.attr('disabled', false);
    email_cc_slb.html(``);
    for (let i = 0; i < contact_list.length; i++) {
        let item = contact_list[i];
        if (item.email) {
            email_cc_slb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.email}</option>`);
        }
    }
    email_cc_slb.select2({
        dropdownParent: send_email_modal,
        tags: true,
        tokenSeparators: [',', ' ']
    });
}

function loadEmailSaleCodeList(data) {
    email_Opp_slb.initSelect2({
        ajax: {
            url: email_Opp_slb.attr('data-url'),
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
        let obj_selected = SelectDDControl.get_data_from_idx(email_Opp_slb, email_Opp_slb.val())
        if (obj_selected) {
            if (obj_selected?.['is_close']) {
                $.fn.notifyB({description: `Opportunity ${obj_selected?.['code']} has been closed. Can not select.`}, 'failure');
                email_Opp_slb.find('option').remove();

            }
            else {
                loadEmailToList(obj_selected?.['customer']?.['contact_mapped'])
                loadEmailCcList(obj_selected?.['customer']?.['contact_mapped'])
            }
        }
    })
}

function loadOpportunityEmailList() {
    if (!$.fn.DataTable.isDataTable('#table_opportunity_email_list')) {
        let dtb = $('#table_opportunity_email_list');
        let frm = new SetupFormSubmit(dtb);
        dtb.DataTableDefault({
            rowIdx: true,
            useDataServer: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('email_list')) {
                        EMAIL_LIST = resp.data['email_list'];
                        console.log(EMAIL_LIST)
                        return resp.data['email_list'] ? resp.data['email_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    className: 'wrap-text',
                    'render': () => {
                        return ``;
                    }
                },
                {
                    data: 'subject',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<a class="text-primary link-primary underline_hover detail-email-button" href="" data-bs-toggle="modal" data-id="` + row.id + `"
                                    data-bs-target="#detail-send-email"><span><b>` + row.subject + `</b></span></a>`
                    }
                },
                {
                    data: 'opportunity',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `<span class="text-secondary">${row.opportunity.code}</span>`
                    }
                },
                {
                    data: 'date_created',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(data);
                    }
                },
            ],
        });
    }
}

$(document).on('click', '#table_opportunity_email_list .detail-email-button', function () {
    let email_id = $(this).attr('data-id');
    let email_obj = EMAIL_LIST.filter(function(item) {
        return item.id === email_id;
    })[0]
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

ClassicEditor
    .create(document.querySelector('#email-content-area'))
    .catch(error => {
        console.error(error);
    })

class EmailHandle {
    load() {
        loadOpportunityEmailList();
        loadEmailSaleCodeList();
    }
    combinesData(frmEle) {
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
}

$(document).ready(function () {
    new EmailHandle().load();

    $('#form-new-email').submit(function (event) {
        event.preventDefault();
        let combinesData = new EmailHandle().combinesData($(this));
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
