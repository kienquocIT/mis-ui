const $trans_script = $('#script-trans')
const $btn_add_note = $('#btn-add-note')

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
const $lead_note = $('.lead-note')

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

        }
    })
})

$convert_opp_btn.on('click', function () {
    let alert_html = `<p class="text-center text-secondary fw-bold">${$trans_script.attr('data-trans-convert-opp-confirm')}</p><br>`

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
        $('input').prop('readonly', true).prop('disabled', true)
        $('select').prop('readonly', true).prop('disabled', true)
        $btn_add_note.prop('disabled', true)
    }
}

function LoadDetailLead(option) {
    let pk = $.fn.getPkDetail()
    let url_loaded = $('#form-detail-lead').attr('data-url-detail').replace(0, pk);
    $.fn.callAjax(url_loaded, 'GET').then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                WFRTControl.setWFRuntimeID(data['lead_detail']?.['workflow_runtime_id']);
                data = data['lead_detail'];
                console.log(data)
                $.fn.compareStatusShowPageAction(data);
                $x.fn.renderCodeBreadcrumb(data);

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
                for (const note_content of data?.['note_data']) {
                    $('#note-area').prepend(`
                        <textarea disabled readonly class="form-control lead-note mb-3">${note_content}</textarea>
                    `)
                }

                // lead config data
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

class LeadHandle {
    load(option='create') {
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
        $lead_note.each(function () {
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

        return frm;
    }
}