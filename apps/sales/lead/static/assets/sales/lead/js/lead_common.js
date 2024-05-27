const $trans_script = $('#script-trans')
const $btn_add_note = $('#btn-add-note')
const $stage_list = $('#stage_list')
const STAGE_LIST = $stage_list.text() ? JSON.parse($stage_list.text()) : [];

const $lead_stage = $('#lead-stage')
const $lead_name = $('#lead-name')
const $contact_name = $('#contact-name')
const $job_title = $('#job-title')
const $mobile = $('#mobile')
const $email = $('#email')
const $company_name = $('#company-name')
const $account_name = $('#account-name')
const $industry = $('#industry')
const $total_employees = $('#total-employees')
const $revenue = $('#revenue')
const $assign_to_sale = $('#assign-to-sale')
const $lead_source = $('#lead-source')
const $lead_status = $('#lead-status')

const $create_contact_btn = $('#convert-to-contact-btn')
const $convert_opp_btn = $('#convert-to-opp-btn')
const $convert_opp_create = $('#convert-to-new-opp-radio')
const $convert_opp_select = $('#select-an-existing-opp-radio')
const $convert_account_create = $('#convert-to-new-account-radio')
const $convert_account_select = $('#select-an-existing-account-radio')
const $assign_to_sale_config = $('#assign-to-sale-config')
const $selected_opp = $('.selected-opp')
const $account_existing = $('#existing-account')
const $select_an_existing_opp_table = $('#select-an-existing-opp-table')

$create_contact_btn.on('click', function () {
    if ($create_contact_btn.attr('id')) {
        Swal.fire({
            html:
                `<p class="text-center text-secondary fw-bold">${$trans_script.attr('data-trans-convert-contact-confirm')}</p>`,
            customClass: {
                confirmButton: 'btn btn-outline-primary text-primary',
                cancelButton: 'btn btn-outline-secondary text-secondary',
                container: 'swal2-has-bg',
                actions: 'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: $trans_script.attr('data-trans-convert'),
            cancelButtonText: $trans_script.attr('data-trans-cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                WindowControl.showLoading();
                let combinesData = {
                    url: $create_contact_btn.attr('data-url'),
                    method: 'POST',
                    data: {'convert_contact': true, 'lead_id': $.fn.getPkDetail()},
                }
                $.fn.callAjax2(combinesData).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: 'Convert to a new Contact successfully!'}, 'success');
                            setTimeout(() => {location.reload();}, 1000)
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
                    })
            }
        })
    }
    else {
        $.fn.notifyB({description: 'Converted to a new contact!'}, 'warning');
    }
})

$convert_opp_btn.on('click', function () {
    let flag = true
    let alert_html = `<p class="text-center text-secondary fw-bold">${$trans_script.attr('data-trans-convert-opp-confirm')}</p><br>`
    if ($convert_opp_create.prop('checked')) {
        alert_html += `<h6>1. Convert to new Opportunity</h6>`
        if ($convert_account_create.prop('checked')) {
            alert_html += `<h6>2. Convert to new Account</h6>`
        }
        else {
            if ($account_existing.val()) {
                let account_name = SelectDDControl.get_data_from_idx($account_existing, $account_existing.val())?.['full_name']
                alert_html += `<h6>2. Match with Account ${account_name}</h6>`
            }
            else {
                flag = false
                $.fn.notifyB({description: 'Please select one Account before Convert!'}, 'failure');
            }
        }
        if ($assign_to_sale_config.val()) {
            let sale_config_fullname = SelectDDControl.get_data_from_idx($assign_to_sale_config, $assign_to_sale_config.val())?.['full_name']
            alert_html += `<h6>3. Assign to sale ${sale_config_fullname}</h6>`
        }
    }
    else {
        let opp_code = $select_an_existing_opp_table.find('input:checked').closest('div').find('label').text()
        if (opp_code) {
            alert_html += `<h6>1. Match with Opportunity ${opp_code}</h6>`
        }
        else {
            flag = false
            $.fn.notifyB({description: 'Please select one Opportunity before Convert!'}, 'failure');
        }
    }

    if (flag) {
        Swal.fire({
            html: alert_html,
            customClass: {
                confirmButton: 'btn btn-outline-primary text-primary',
                cancelButton: 'btn btn-outline-secondary text-secondary',
                container: 'swal2-has-bg',
                actions: 'w-100'
            },
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: $trans_script.attr('data-trans-convert'),
            cancelButtonText: $trans_script.attr('data-trans-cancel'),
            reverseButtons: true
        }).then((result) => {
            if (result.value) {

            }
        })
    }
})

$('input[name="convert-to-opp"]').on('change', function () {
    $('.convert-to-new-opp-radio-child').prop('hidden', !$('#convert-to-new-opp-radio').prop('checked'))
    $('.select-an-existing-opp-radio-child').prop('hidden', !$('#select-an-existing-opp-radio').prop('checked'))
})

$('input[name="convert-to-opp-option"]').on('change', function () {
    $('.select-an-existing-account-radio-child').prop('hidden', !$('#select-an-existing-account-radio').prop('checked'))
})

$btn_add_note.on('click', function () {
    let note_html = $(`<textarea class="form-control lead-note mb-3" placeholder=""></textarea>`)
    let index = $('#note-area textarea').length
    note_html.attr('placeholder', `${$trans_script.attr('data-trans-note')} ${index + 1}`)
    $('#note-area').prepend(note_html)
})

function Disable(option) {
    if (option === 'detail') {
        $('#tab_block_main input').prop('readonly', true).prop('disabled', true)
        $('#tab_block_main select').prop('readonly', true).prop('disabled', true)
        $btn_add_note.prop('disabled', true)
    }
}

function LoadDetailLead(option) {
    let url_loaded = $('#form-detail-lead').attr('data-url')
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                data = data['lead_detail'];
                console.log(data)
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);

                LoadStage(STAGE_LIST, data?.['current_lead_stage']['level'], 'detail || update')

                // lead main data
                $lead_name.val(data?.['title'])
                $contact_name.val(data?.['contact_name'])
                $job_title.val(data?.['job_title'])
                $mobile.val(data?.['mobile'])
                $email.val(data?.['email'])
                $company_name.val(data?.['company_name'])
                $account_name.val(data?.['account_name'])
                LoadIndustry(data?.['industry'])
                $total_employees.val(data?.['total_employees']).trigger('change')
                $revenue.val(data?.['revenue']).trigger('change')
                $lead_source.val(data?.['source'])
                $lead_status.val(data?.['lead_status']).trigger('change')
                LoadSales(data?.['assign_to_sale'])

                // lead note data
                let detail = option === 'detail' ? 'disabled readonly' : ''
                for (const note_content of data?.['note_data']) {
                    $('#note-area').prepend(`
                        <textarea ${detail} class="form-control lead-note mb-3">${note_content}</textarea>
                    `)
                }

                // lead config data
                if (data?.['config_data']?.['create_contact']) {
                    $('#created_contact').prop('hidden', false)
                    $create_contact_btn.attr('id', '').attr('class', '')
                    $create_contact_btn.after(`
                        &nbsp;
                        <a target="_blank" href="${$create_contact_btn.attr('data-url-detail-contact').replace('0', data?.['config_data']?.['contact_mapped']?.['id'])}">
                            <i class="fa-solid fa-up-right-from-square"></i>
                        </a>
                        &nbsp;
                        <span class="badge badge-primary badge-sm">${data?.['config_data']?.['contact_mapped']?.['code']}</span>
                    `)
                }
                $convert_opp_create.prop('checked', data?.['config_data']?.['convert_opp_create'])
                $convert_opp_select.prop('checked', data?.['config_data']?.['convert_opp_select'])
                $convert_account_create.prop('checked', data?.['config_data']?.['convert_account_create'])
                $convert_account_select.prop('checked', data?.['config_data']?.['convert_account_select'])
                LoadSalesConfig(data?.['config_data']?.['assign_to_sale_config'])

                Disable(option);
            }
        })
}

function LoadIndustry(data) {
    $industry.initSelect2({
        allowClear: true,
        ajax: {
            url: $industry.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'industry_list',
        keyId: 'id',
        keyText: 'title',
    }).on('change', function () {})
}

function LoadSales(data) {
    $assign_to_sale.initSelect2({
        allowClear: true,
        ajax: {
            url: $assign_to_sale.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'employee_list',
        keyId: 'id',
        keyText: 'full_name',
    }).on('change', function () {})
}

function LoadSalesConfig(data) {
    $assign_to_sale_config.initSelect2({
        allowClear: true,
        ajax: {
            url: $assign_to_sale_config.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'employee_list',
        keyId: 'id',
        keyText: 'full_name',
    }).on('change', function () {})
}

function LoadAccountConfig(data) {
    $account_existing.initSelect2({
        allowClear: true,
        ajax: {
            url: $account_existing.attr('data-url'),
            method: 'GET',
        },
        callbackDataResp: function (resp, keyResp) {
            return resp.data[keyResp];
        },
        data: (data ? data : null),
        keyResp: 'account_list',
        keyId: 'id',
        keyText: 'name',
    }).on('change', function () {})
}

function LoadOpportunityList() {
    if (!$.fn.DataTable.isDataTable('#select-an-existing-table')) {
        let frm = new SetupFormSubmit($select_an_existing_opp_table);
        $select_an_existing_opp_table.DataTableDefault({
            useDataServer: true,
            paging: false,
            ordering: false,
            scrollCollapse: true,
            scrollY: '50vh',
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('opportunity_list')) {
                        return resp.data['opportunity_list'] ? resp.data['opportunity_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<div class="form-check form-check-sm">
                                    <input data-id="${row?.['id']}" type="radio" name="selected-opp" class="selected-opp form-check-input">
                                    <label class="form-check-label badge badge-soft-primary">${row?.['code']}</label>
                                </div>`
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<p class="fw-bold">${row?.['title']}</p>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<p>${row?.['customer']?.['title']}</p>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<span class="badge badge badge-soft-blue ml-2 mt-2">${row?.['sale_person']?.['full_name']}</span>`
                    }
                },
            ],
        });
    }
}

function LoadStage(stage_list, level, page='create') {
    $lead_stage.html('')
    for (const stage of stage_list) {
        let class_ctn = 'sub-stage w-25 bg-primary-light-5 border rounded py-3 px-5 text-center'
        let style_ctn = 'min-width: 300px'
        if (stage?.['level'] <= level) {
            class_ctn = 'sub-stage w-25 bg-primary border rounded py-3 px-5 text-center'
            style_ctn = 'color: #f0f0f0; min-width: 300px'
        }

        let btn_goto_html = ``
        if (stage?.['level'] === 3 && page !== 'create') {
            btn_goto_html = `&nbsp;<button type="button"
                                    class="btn btn-icon btn-rounded btn-outline-primary btn-xs btn-goto"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Go to this stage"
                            >
                                <span class="icon"><i class="fas fa-forward"></i></span>
                            </button>`

            $(document).on("click", '.btn-goto', function () {
                Swal.fire({
                    html:
                        `<p class="text-center text-secondary fw-bold">${$trans_script.attr('data-trans-goto-confirm')}</p>`,
                    customClass: {
                        confirmButton: 'btn btn-outline-primary text-primary',
                        cancelButton: 'btn btn-outline-secondary text-secondary',
                        container: 'swal2-has-bg',
                        actions: 'w-100'
                    },
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: 'OK',
                    cancelButtonText: $trans_script.attr('data-trans-cancel'),
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) {
                        WindowControl.showLoading();
                        let combinesData = {
                            url: $('#form-detail-lead').attr('data-url'),
                            method: 'PUT',
                            data: {'goto_stage': true},
                        }
                        $.fn.callAjax2(combinesData).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyB({description: 'Update stage successfully!'}, 'success');
                                    setTimeout(() => {location.reload();}, 1000)
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
                            })
                    }
                })
            })
        }
        $lead_stage.append(`
            <div data-id="${stage?.['id']}" data-level="${stage?.['level']}" class="${class_ctn}" style="${style_ctn}">
                ${stage?.['stage_title']}
                ${btn_goto_html}
            </div>&nbsp;
        `)
    }
}

class LeadHandle {
    load(option='create') {
        LoadStage(STAGE_LIST, 1)
        LoadIndustry()
        LoadSales()
        if (option !== 'create') {
            LoadSalesConfig()
            LoadAccountConfig()
            LoadOpportunityList()
        }
    }

    combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        // lead main data
        frm.dataForm['title'] = $lead_name.val()
        frm.dataForm['contact_name'] = $contact_name.val()
        frm.dataForm['job_title'] = $job_title.val()
        frm.dataForm['mobile'] = $mobile.val()
        frm.dataForm['email'] = $email.val()
        frm.dataForm['company_name'] = $company_name.val()
        frm.dataForm['account_name'] = $account_name.val()
        frm.dataForm['industry'] = $industry.val()
        frm.dataForm['total_employees'] = $total_employees.val()
        frm.dataForm['revenue'] = $revenue.val()
        frm.dataForm['source'] = $lead_source.val()
        frm.dataForm['lead_status'] = $lead_status.val()
        frm.dataForm['assign_to_sale'] = $assign_to_sale.val()

        // lead note data
        let note_data = []
        $('.lead-note').each(function () {
            if ($(this).val()) {
                note_data.push($(this).val())
            }
        })
        frm.dataForm['note_data'] = note_data

        // lead config data
        // frm.dataForm['config_data'] = {}
        // let create_contact = $create_contact.prop('checked')
        // let convert_opp = $convert_opp.prop('checked')
        // frm.dataForm['config_data']['create_contact'] = create_contact
        // frm.dataForm['config_data']['convert_opp'] = convert_opp
        // if (convert_opp) {
        //     let convert_opp_create = $convert_opp_create.prop('checked')
        //     frm.dataForm['config_data']['convert_opp_create'] = convert_opp_create
        //     if (convert_opp_create) {
        //         let convert_account_create = $convert_account_create.prop('checked')
        //         let convert_account_select = $convert_account_select.prop('checked')
        //         frm.dataForm['config_data']['convert_account_create'] = convert_account_create
        //         frm.dataForm['config_data']['convert_account_select'] = convert_account_select
        //         if (convert_account_select) {
        //             frm.dataForm['config_data']['account_select'] = $account_existing.val()
        //         }
        //         frm.dataForm['config_data']['assign_to_sale_config'] = $assign_to_sale_config.val()
        //     }
        //     let convert_opp_select = $convert_opp_select.prop('checked')
        //     frm.dataForm['config_data']['convert_opp_select'] = convert_opp_select
        //     if (convert_opp_select) {
        //         frm.dataForm['config_data']['opp_select'] = $selected_opp.find('option:selected').attr('data-id')
        //     }
        // }

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}
