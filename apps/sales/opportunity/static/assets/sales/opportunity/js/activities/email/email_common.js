const table_opportunity_email_list = $('#table_opportunity_email_list')
const email_to_slb = $('#email-to-select-box')
const email_cc_slb = $('#email-cc-select-box')
const send_email_modal = $("#offcanvas-send-email")
let EMAIL_LIST = [];

function loadEmailToList(contact_list) {
    if (contact_list) {
        email_to_slb.attr('disabled', false);
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
}

function loadEmailCcList(contact_list) {
    if (contact_list) {
        email_cc_slb.attr('disabled', false);
        email_cc_slb.html(``);
        for (let i = 0; i < contact_list.length; i++) {
            let item = contact_list[i];
            if (item.email) {
                email_cc_slb.append(`<option value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.fullname} - ${item.email}</option>`);
            } else {
                email_cc_slb.append(`<option disabled value="${item.email}" data-bs-toggle="tooltip" data-bs-placement="top" title="${item.fullname}">${item.fullname} - (no email)</option>`);
            }
        }
        email_cc_slb.select2({
            dropdownParent: send_email_modal,
            tags: true,
            tokenSeparators: [',', ' ']
        });
    }
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
    if (!$.fn.DataTable.isDataTable('#table_opportunity_email_list')) {
        let dtb = table_opportunity_email_list;
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
                    className: 'wrap-text w-50',
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
                        return `<span class="badge badge-soft-blue badge-outline">${row?.['opportunity']?.['code']}</span>`
                    }
                },
                {
                    data: 'employee_inherit',
                    className: 'wrap-text w-15',
                    render: (data, type, row) => {
                        return `<span class="text-primary">${row?.['employee_inherit']?.['full_name']}</span>`
                    }
                },
                {
                    data: 'date_created',
                    className: 'wrap-text text-center w-15',
                    render: (data, type, row) => {
                        return $x.fn.displayRelativeTime(data, {
                            'outputFormat': 'DD/MM/YYYY',
                        });
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

    $('#detail-opp').val(email_obj?.['opportunity']?.['code'] + ' - ' + email_obj?.['opportunity']?.['title']);
    $('#detail-process').val(email_obj?.['process']?.['title'] ? email_obj?.['process']?.['title'] : '--');
    $('#detail-stage').val(email_obj?.['process_stage_app']?.['title'] ? email_obj?.['process_stage_app']?.['title'] : '--');
    $('#detail-inheritor').val(email_obj?.['employee_inherit']?.['full_name']);

    $('#detail-email-subject-input').text(email_obj.subject);
    $('#detail-date-input').text(moment(email_obj.date_created.split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'));
    $('#btn-email-to').text($('#trans-script').attr('data-trans-to') + ' (' + email_obj.email_to_list.length.toString() + ')')
    $('#btn-email-cc').text($('#trans-script').attr('data-trans-cc') + ' (' + email_obj.email_cc_list.length.toString() + ')')
    let detail_email_to_list = []
    for (let i = 0; i < email_obj.email_to_list.length; i++) {
        detail_email_to_list.push(`<a class="dropdown-item" href="#">${email_obj.email_to_list[i]}</a>`);
    }
    $('#detail-email-to').html(detail_email_to_list);
    let detail_email_cc_list = []
    for (let i = 0; i < email_obj.email_cc_list.length; i++) {
        detail_email_cc_list.push(`<a class="dropdown-item" href="#">${email_obj.email_cc_list[i]}</a>`);
    }
    $('#detail-email-cc').html(detail_email_cc_list);
    $('#detail-email-content-area').html(email_obj.content)
})

$('#opportunity_id').on('change', function () {
    let obj_selected = SelectDDControl.get_data_from_idx($(this), $(this).val())
    if (obj_selected) {
        let contact_mapped = obj_selected?.['customer']?.['contact_mapped']
        loadEmailToList(contact_mapped ? contact_mapped : [])
        loadEmailCcList(contact_mapped ? contact_mapped : [])
    }
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
                has_opp: true,
                has_inherit: true,
                has_process: true,
                data_opp: data_opp,
                data_inherit: data_inherit,
                data_process: data_process,
                data_process_stage_app: data_process_stage_app,
                oppFlagData: {"disabled": true, "readonly": true},
                processFlagData: {"disabled": true, "readonly": true},
                processStageAppFlagData: {"disabled": true, "readonly": true},
                inheritFlagData: {"disabled": true, "readonly": true},
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
                has_opp: true,
                has_inherit: true,
                has_process: true,
                data_opp: data_opp,
                inheritFlagData: {"disabled": false, "readonly": false},
            }).init();

            EmailHandle.LoadPageActionWithParams(opp_id)
        }
        else {
            new $x.cls.bastionField({
                has_opp: true,
                has_inherit: true,
                has_process: true,
                inheritFlagData: {"disabled": false, "readonly": false},
            }).init();
        }
    }
    static combinesData(frmEle) {
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
