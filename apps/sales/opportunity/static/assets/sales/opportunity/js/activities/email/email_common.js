const trans_script = $('#trans-script')
const table_opportunity_email_list = $('#table_opportunity_email_list')
const email_to_slb = $('#email-to-select-box')
const email_cc_slb = $('#email-cc-select-box')
const email_bcc_slb = $('#email-bcc-select-box')
const send_email_modal = $("#offcanvas-send-email")
let EMAIL_LIST = [];

function loadEmailToList(contact_list) {
    email_to_slb.html(``);
    for (let i = 0; i < contact_list.length; i++) {
        let item = contact_list[i];
        if (item.email) {
            email_to_slb.append(`<option selected value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.fullname} - ${item.email}</option>`);
        } else {
            email_to_slb.append(`<option disabled value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.fullname} - (no email)</option>`);
        }
    }
    email_to_slb.select2({
        dropdownParent: send_email_modal,
        tags: true,
        tokenSeparators: [',', ' ']
    });
}

function loadEmailCcList(contact_list) {
    email_cc_slb.html(``);
    for (let i = 0; i < contact_list.length; i++) {
        let item = contact_list[i];
        if (item.email) {
            email_cc_slb.append(`<option value="${item.email}">${item.fullname} - ${item.email}</option>`);
        } else {
            email_cc_slb.append(`<option disabled value="${item.email}">${item.fullname} - (no email)</option>`);
        }
    }
    email_cc_slb.select2({
        dropdownParent: send_email_modal,
        tags: true,
        tokenSeparators: [',', ' ']
    });
}

function loadEmailBccList(contact_list) {
    email_bcc_slb.html(``);
    for (let i = 0; i < contact_list.length; i++) {
        let item = contact_list[i];
        if (item.email) {
            email_bcc_slb.append(`<option value="${item.email}">${item.fullname} - ${item.email}</option>`);
        } else {
            email_bcc_slb.append(`<option disabled value="${item.email}">${item.fullname} - (no email)</option>`);
        }
    }
    email_bcc_slb.select2({
        dropdownParent: send_email_modal,
        tags: true,
        tokenSeparators: [',', ' ']
    });
}

function extractTextWithSpaces(htmlString) {
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = htmlString.replace(/<br\s*\/?>/g, "\n");
    const textNodes = Array.from(tempContainer.childNodes)
        .map(node => node.textContent.trim())
        .filter(text => text);
    return textNodes.join(" ").substring(0, 60) + '...';
}

function loadOpportunityEmailList() {
    let dtb = table_opportunity_email_list;
    dtb.DataTable().clear().destroy()
    let frm = new SetupFormSubmit(dtb);
    dtb.DataTableDefault({
        rowIdx: true,
        scrollX: '100vw',
        scrollY: '75vh',
        scrollCollapse: true,
        useDataServer: true,
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && resp.data.hasOwnProperty('email_list')) {
                    EMAIL_LIST = resp.data['email_list'];
                    // console.log(EMAIL_LIST)
                    return resp.data['email_list'] ? resp.data['email_list'] : [];
                }
                throw Error('Call data raise errors.')
            },
        },
        columns: [
            {
                className: 'wrap-text w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                data: 'subject',
                className: 'wrap-text w-35',
                render: (data, type, row) => {
                    return `<a class="text-primary fw-bold detail-email-button" href="" data-bs-toggle="offcanvas" data-id="${row?.['id']}"
                                data-bs-target="#offcanvas-detail-send-email"><span>${row?.['subject']}</span>
                            </a>` + `<div class="fst-italic">
                                ${extractTextWithSpaces(row?.['content'])}
                            </div>`

                }
            },
            {
                data: 'opportunity',
                className: 'wrap-text text-center w-15',
                render: (data, type, row) => {
                    return `${row?.['opportunity']?.['code']}`
                }
            },
            {
                data: 'employee_inherit',
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    return `<span class="text-blue">${row?.['employee_inherit']?.['full_name']}</span>`
                }
            },
            {
                className: 'wrap-text w-15',
                render: (data, type, row) => {
                    if (!row?.['just_log']) {
                        if (row?.['send_success']) {
                            return `<span class="text-success">${trans_script.attr('data-sent')}</span>`
                        } else {
                            return `<span class="text-danger">${trans_script.attr('data-err')}</span>`
                        }
                    }
                    return ``
                }
            },
            {
                className: 'wrap-text text-center w-15',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['date_created'], {
                        'outputFormat': 'DD/MM/YYYY',
                    });
                }
            },
        ],
    });
}

$(document).on('click', '#table_opportunity_email_list .detail-email-button', function () {
    let email_id = $(this).attr('data-id');
    let email_obj = EMAIL_LIST.filter(function(item) {
        return item.id === email_id;
    })[0]
    let default_state = `<span class="text-primary">${trans_script.attr('data-just-log')}</span>`
    if (!email_obj?.['just_log']) {
        if (email_obj?.['send_success']) {
            $('#email-state').html(`${default_state} - <span class="text-success">${trans_script.attr('data-sent')}</span>`)
        } else {
            $('#email-state').html(`${default_state} - <span class="text-danger">${trans_script.attr('data-err')}</span>`)
        }
    }
    else {
        $('#email-state').html(`${default_state}`)
    }

    $('#btn-offcanvas-resend-email').attr('data-id', email_id).prop('hidden', !(email_obj?.['just_log'] || !email_obj?.['send_success']))

    $('#detail-opp').text(email_obj?.['opportunity']?.['code'] + ' - ' + email_obj?.['opportunity']?.['title']);
    $('#detail-process').text(email_obj?.['process']?.['title'] ? email_obj?.['process']?.['title'] : '');
    $('#detail-stage').text(email_obj?.['process_stage_app']?.['title'] ? email_obj?.['process_stage_app']?.['title'] : '');
    let creator_fullname = email_obj ?.['employee_created']?.['full_name']
    let creator_group = email_obj?.['employee_created']?.['group']?.['title']
    let inherit_fullname = email_obj?.['employee_inherit']?.['full_name']
    let inherit_group = email_obj?.['employee_inherit']?.['group']?.['title']
    $('#detail-creator').text(`${creator_fullname} ${creator_group ? ' - ' + creator_group : ''}`);
    $('#detail-inheritor').text(`${inherit_fullname} ${inherit_group ? ' - ' + inherit_group : ''}`);

    $('#detail-email-subject-input').text(email_obj.subject);
    $('#detail-date-input').text(moment(email_obj.date_created.split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'));
    $('#btn-email-from').text(trans_script.attr('data-trans-from'))
    $('#btn-email-to').text(trans_script.attr('data-trans-to') + ' (' + email_obj?.['email_to_list'].length.toString() + ')')
    $('#btn-email-cc').text(trans_script.attr('data-trans-cc') + ' (' + email_obj?.['email_cc_list'].length.toString() + ')')
    $('#btn-email-bcc').text(trans_script.attr('data-trans-bcc') + ' (' + email_obj?.['email_bcc_list'].length.toString() + ')')
    let detail_email_to_list = []
    for (let i = 0; i < email_obj.email_to_list.length; i++) {
        detail_email_to_list.push(`<a class="dropdown-item" href="#">${email_obj.email_to_list[i]}</a>`);
    }
    $('#detail-email-to').html(detail_email_to_list);
    let detail_email_cc_list = []
    for (let i = 0; i < email_obj.email_cc_list.length; i++) {
        detail_email_cc_list.push(`<a class="dropdown-item" href="#">${email_obj.email_cc_list[i]}</a>`);
    }
    let detail_email_bcc_list = []
    for (let i = 0; i < email_obj.email_bcc_list.length; i++) {
        detail_email_bcc_list.push(`<a class="dropdown-item" href="#">${email_obj.email_bcc_list[i]}</a>`);
    }
    $('#detail-email-from').html(`<a class="dropdown-item" href="#">${email_obj?.['from_email']}</a>`);
    $('#detail-email-cc').html(detail_email_cc_list);
    $('#detail-email-bcc').html(detail_email_bcc_list);
    $('#detail-email-content-area').html(email_obj.content)
})

$('#opportunity_id').on('change', function () {
    let obj_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
    if (obj_selected) {
        let contact_mapped = obj_selected?.['customer']?.['contact_mapped']
        loadEmailToList(contact_mapped ? contact_mapped : [])
        loadEmailCcList(contact_mapped ? contact_mapped : [])
        loadEmailBccList(contact_mapped ? contact_mapped : [])
    }
})

$('#btn-offcanvas-resend-email').on('click', function () {
    WindowControl.showLoading();
    let url_loaded = $(this).attr('data-url').replace('/0', `/${$(this).attr('data-id')}`);
    $.fn.callAjax(url_loaded, 'GET', {'resend_email': true}).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data?.['opportunity_email_detail']?.['send_success']) {
                    $.fn.notifyB({description: trans_script.attr('data-sent')}, 'success')
                }
                else {
                    $.fn.notifyB({description: trans_script.attr('data-err')}, 'failure')
                }
                $('#offcanvas-detail-send-email').offcanvas('hide')
                loadOpportunityEmailList()
                WindowControl.hideLoading();
            }
        })
})

ClassicEditor
    .create(document.querySelector('#email-content-area'))
    .catch(error => {
        console.error(error);
    })

class EmailHandle {
    static LoadPageActionWithParams(opp_id) {
        let dataParam = {'id': opp_id}
        let opportunity_ajax = $.fn.callAjax2({
            url: table_opportunity_email_list.attr('data-url-opp-list'),
            data: dataParam,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('opportunity_list')) {
                    return data?.['opportunity_list'].length > 0 ? data?.['opportunity_list'][0] : null;
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([opportunity_ajax]).then(
            (results) => {
                if (results[0]) {
                    $('#opportunity_id').trigger('change')
                    loadEmailToList(results[0]?.['customer']?.['contact_mapped'])
                    loadEmailCcList(results[0]?.['customer']?.['contact_mapped'])
                    loadEmailBccList(results[0]?.['customer']?.['contact_mapped'])
                    $('#offcanvas-send-email').offcanvas('show')
                }
            })
    }
    static load() {
        loadOpportunityEmailList();
        const {
            create_open, from_opp,
            opp_id,
            opp_title,
            opp_code,
            process_id,
            process_title,
            process_stage_app_id,
            process_stage_app_title,
            inherit_id,
            inherit_title,
        } = $x.fn.getManyUrlParameters([
            'create_open', 'from_opp',
            'opp_id', 'opp_title', 'opp_code',
            'process_id', 'process_title',
            'process_stage_app_id', 'process_stage_app_title',
            'inherit_id', 'inherit_title',
        ])
        const group$ = $('#offcanvas-send-email')
        if (create_open) {
            const data_inherit = [{
                "id": inherit_id || '',
                "full_name": inherit_title || '',
                "selected": true,
            }];
            const data_opp = [{
                "id": opp_id || '',
                "title": opp_title || '',
                "code": opp_code || '',
                "selected": true,
            }];
            const data_process = [{
                "id": process_id || '',
                "title": process_title || '',
                "selected": true,
            }];
            const data_process_stage_app = [{
                "id": process_stage_app_id || '',
                "title": process_stage_app_title || '',
                'selected': true,
            }];
            new $x.cls.bastionField({
                list_from_app: "opportunity.opportunityemail.create",
                app_id: "dec012bf-b931-48ba-a746-38b7fd7ca73b",
                mainDiv: group$,
                oppEle: group$.find('select[name=opportunity_id]'),
                prjEle: group$.find('select[name=project_id]'),
                empInheritEle: group$.find('select[name=employee_inherit_id]'),
                processEle: group$.find('select[name=process]'),
                processStageAppEle$: group$.find('select[name=process_stage_app]'),
                data_opp: data_opp,
                data_inherit: data_inherit,
                data_process: data_process,
                data_process_stage_app: data_process_stage_app,
            }).init();

            EmailHandle.LoadPageActionWithParams(opp_id)
        }
        else if (from_opp) {
            const data_opp = [{
                "id": opp_id || '',
                "title": opp_title || '',
                "code": opp_code || '',
                "selected": true,
            }];
            new $x.cls.bastionField({
                list_from_app: "opportunity.opportunityemail.create",
                app_id: "dec012bf-b931-48ba-a746-38b7fd7ca73b",
                mainDiv: group$,
                oppEle: group$.find('select[name=opportunity_id]'),
                prjEle: group$.find('select[name=project_id]'),
                empInheritEle: group$.find('select[name=employee_inherit_id]'),
                processEle: group$.find('select[name=process]'),
                processStageAppEle$: group$.find('select[name=process_stage_app]'),
                data_opp: data_opp,
            }).init();

            EmailHandle.LoadPageActionWithParams(opp_id)
        }
        else {
            new $x.cls.bastionField({
                list_from_app: "opportunity.opportunityemail.create",
                app_id: "dec012bf-b931-48ba-a746-38b7fd7ca73b",
                mainDiv: group$,
                oppEle: group$.find('select[name=opportunity_id]'),
                prjEle: group$.find('select[name=project_id]'),
                empInheritEle: group$.find('select[name=employee_inherit_id]'),
                processEle: group$.find('select[name=process]'),
                processStageAppEle$: group$.find('select[name=process_stage_app]'),
            }).init();
        }
    }
    static combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['subject'] = $('#email-subject-input').val();
        frm.dataForm['opportunity'] = $('#email-sale-code-select-box option:selected').val();
        frm.dataForm['email_to_list'] = email_to_slb.val();
        frm.dataForm['email_cc_list'] = email_cc_slb.val();
        frm.dataForm['email_bcc_list'] = email_bcc_slb.val();
        frm.dataForm['content'] = $('#form-new-email .ck-content').html();
        frm.dataForm['just_log'] = $('#form-new-email #just_log').prop('checked');

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}
