const $trans_script = $('#trans-script')
const $VietQRDataListInp =$('#VietQRBankList')
const $bank_tbl = $('#datatable-bank')
const $bank_account_tbl = $('#datatable-bank-account')
const $bank_abbreviation =$('#bank_abbreviation')
const $bank_name =$('#bank_name')
const $bank_foreign_name =$('#bank_foreign_name')
const $bank_mapped =$('#bank_mapped')
const $bank_account_number =$('#bank_account_number')
const $bank_account_owner =$('#bank_account_owner')
const $currency =$('#currency')
const $is_brand =$('#is_brand')
const $brand_name =$('#brand_name')
let VietQRBankList = []

function RenderBankTable() {
    $bank_tbl.DataTable().clear().destroy()
    $bank_tbl.DataTableDefault({
        useDataServer: true,
        reloadCurrency: true,
        rowIdx: true,
        ajax: {
            url: $bank_tbl.attr('data-url'),
            type: $bank_tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    return resp.data['bank_list'] ? resp.data['bank_list'] : [];
                }
                return [];
            },
        },
        columns: [
            {
                className: 'w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'w-10',
                'render': (data, type, row) => {
                    if (row?.['vietqr_json_data']?.['logo']) {
                        return `<image style="height: 45px" src="${row?.['vietqr_json_data']?.['logo']}">`
                    }
                    return ``;
                }
            },
            {
                className: 'w-35',
                'render': (data, type, row) => {
                    return `<span class="fw-bold text-primary">${row?.['bank_name']}</span><br><span class="text-muted small">${row?.['bank_foreign_name']}</span>`;
                }
            },
            {
                className: 'w-10',
                'render': (data, type, row) => {
                    return `<span class="fw-bold text-primary">${row?.['bank_abbreviation']}</span>`;
                }
            },
            {
                className: 'w-30',
                'render': (data, type, row) => {
                    return `<span>${row?.['head_office_address']}</span>`;
                }
            },
            {
                className: 'text-right w-10',
                'render': (data, type, row) => {
                    return `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete-bank" data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                }
            },
        ],
    })
}

function RenderBankAccountTable() {
    $bank_account_tbl.DataTable().clear().destroy()
    $bank_account_tbl.DataTableDefault({
        useDataServer: true,
        reloadCurrency: true,
        rowIdx: true,
        ajax: {
            url: $bank_account_tbl.attr('data-url'),
            type: $bank_account_tbl.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    return resp.data['bank_account_list'] ? resp.data['bank_account_list'] : [];
                }
                return [];
            },
        },
        columns: [
            {
                className: 'w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'w-25',
                'render': (data, type, row) => {
                    return `<span class="text-muted">${row?.['bank_account_number']}</span>`;
                }
            },
            {
                className: 'w-25',
                'render': (data, type, row) => {
                    return `<span class="text-muted">${row?.['bank_account_owner']}</span>`;
                }
            },
            {
                className: 'w-35',
                'render': (data, type, row) => {
                    return `<span class="text-primary fw-bold">${row?.['bank_mapped_data']?.['bank_name']}</span><br><span class="text-muted small">${row?.['brand_name'] ? row?.['brand_address'] : ''} </span>`;
                }
            },
            {
                className: 'text-right w-10',
                'render': (data, type, row) => {
                    return `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete-bank-account" data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                }
            },
        ],
    })
}

function loadBankMapped(data) {
    $bank_mapped.initSelect2({
        ajax: {
            url: $bank_mapped.attr('data-url'),
            method: 'GET',
        },
        data: (data ? data : null),
        templateResult: function (state) {
            return $(`<span>${state.data?.['bank_abbreviation']}</span> - <span>${state.data?.['bank_name']}</span>`);
        },
        keyResp: 'bank_list',
        keyId: 'id',
        keyText: 'bank_name',
    })
}

function loadCurrency(data) {
    $currency.initSelect2({
        ajax: {
            url: $currency.attr('data-url'),
            method: 'GET',
        },
        data: (data ? data : null),
        templateResult: function (state) {
            return $(`<span>${state.data?.['abbreviation']}</span> - <span>${state.data?.['title']}</span>`);
        },
        keyResp: 'currency_list',
        keyId: 'id',
        keyText: 'title',
    })
}

async function LoadVietQRBankList() {
    $.ajax({
        url: "https://api.vietqr.io/v2/banks",
        method: "GET",
        success: function(response) {
            VietQRBankList = response?.['data'] || []
            $('#add_bank_btn').prop('hidden', false)
        },
        error: function(xhr, status, error) {
            $.fn.notifyB({description: 'Get Bank data by VietQR API failed, try again later!'}, 'failure');
        }
    });
}

$('#add_bank_btn').on('click', async function () {
    if ($VietQRDataListInp.html() === '') {
        for (let i = 0; i < VietQRBankList.length; i++) {
            $VietQRDataListInp.append(`<option value="${VietQRBankList[i]?.['code']}">${VietQRBankList[i]?.['name']}</option>`)
        }
    }
})

$(document).on('click', '.btn-delete-bank', function () {
    let row_id = $(this).attr('data-id')
    Swal.fire({
        html:
        `<div class="d-flex align-items-center">
            <div class="avatar avatar-icon avatar-soft-danger me-3"><span class="initial-wrap"><i class="fa-solid fa-trash"></i></span></div>
            <div>
                <h4 class="text-danger">${$trans_script.attr('data-trans-change-confirm-bank')}</h4>
                <p>${$trans_script.attr('data-trans-change-noti')}</p>
            </div>
        </div>`,
        customClass: {
            confirmButton: 'btn btn-outline-secondary text-danger',
            cancelButton: 'btn btn-outline-secondary text-gray',
            container: 'swal2-has-bg',
            htmlContainer: 'bg-transparent text-start',
            actions:'w-100'
        },
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: $.fn.gettext('Confirm'),
        cancelButtonText: $.fn.gettext('Cancel'),
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            let ajax_delete_bank = $.fn.callAjax2({
                url: $bank_tbl.attr('data-url-detail').replace('/0', `/${row_id}`),
                data: {},
                method: 'DELETE'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    $.fn.notifyB({description: 'Delete successfully!'}, 'success');
                    return data?.['detail'];
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )

            Promise.all([ajax_delete_bank]).then(
                (results) => {
                    RenderBankTable()
                }
            )
        }
    })
})

$(document).on('click', '.btn-delete-bank-account', function () {
    let row_id = $(this).attr('data-id')
    Swal.fire({
        html:
        `<div class="d-flex align-items-center">
            <div class="avatar avatar-icon avatar-soft-danger me-3"><span class="initial-wrap"><i class="fa-solid fa-trash"></i></span></div>
            <div>
                <h4 class="text-danger">${$trans_script.attr('data-trans-change-confirm-bank-account')}</h4>
                <p>${$trans_script.attr('data-trans-change-noti')}</p>
            </div>
        </div>`,
        customClass: {
            confirmButton: 'btn btn-outline-secondary text-danger',
            cancelButton: 'btn btn-outline-secondary text-gray',
            container: 'swal2-has-bg',
            htmlContainer: 'bg-transparent text-start',
            actions:'w-100'
        },
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: $.fn.gettext('Confirm'),
        cancelButtonText: $.fn.gettext('Cancel'),
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            let ajax_delete_bank_account = $.fn.callAjax2({
                url: $bank_account_tbl.attr('data-url-detail').replace('/0', `/${row_id}`),
                data: {},
                method: 'DELETE'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    $.fn.notifyB({description: 'Delete successfully!'}, 'success');
                    return data?.['detail'];
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )

            Promise.all([ajax_delete_bank_account]).then(
                (results) => {
                    RenderBankAccountTable()
                }
            )
        }
    })
})

$bank_abbreviation.on('change', function () {
    $bank_name.val($VietQRDataListInp.find(`option[value="${$(this).val()}"]`).text())
})

$is_brand.on('change', function () {
    $('.for-brand').prop('hidden', !$(this).prop('checked'))
})

$(document).ready(async function () {
    RenderBankTable()
    RenderBankAccountTable()
    await LoadVietQRBankList()
    loadBankMapped()
    loadCurrency()
    // for location
    UsualLoadPageFunction.LoadLocationCountry($('#modal-bank .location_country'))
    UsualLoadPageFunction.LoadLocationProvince($('#modal-bank .location_province'))
    UsualLoadPageFunction.LoadLocationWard($('#modal-bank .location_ward'))
    UsualLoadPageFunction.LoadLocationCountry($('#modal-bank-account .location_country'))
    UsualLoadPageFunction.LoadLocationProvince($('#modal-bank-account .location_province'))
    UsualLoadPageFunction.LoadLocationWard($('#modal-bank-account .location_ward'))

    new SetupFormSubmit($('#form-create-bank')).validate({
        rules: {},
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm = {
                'bank_abbreviation': $bank_abbreviation.val(),
                'bank_name': $bank_name.val(),
                'bank_foreign_name': $bank_foreign_name.val(),
                'head_office_address': `${$('#modal-bank .location_detail_address').val()}, ${$('#modal-bank .location_ward').find(`option:selected`).text()}, ${$('#modal-bank .location_province').find(`option:selected`).text()}, ${$('#modal-bank .location_country').find(`option:selected`).text()}`,
                'head_office_address_data': {
                    'country_id': $('#modal-bank .location_country').val(),
                    'province_id': $('#modal-bank .location_province').val(),
                    'ward_id': $('#modal-bank .location_ward').val(),
                    'detail_address': $('#modal-bank .location_detail_address').val()
                },
                'vietqr_json_data': VietQRBankList.find(item => item?.['code'] === $bank_abbreviation.val())
            }
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp)
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-bank').modal('hide')
                        $('#modal-bank form')[0].reset()
                        RenderBankTable()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
        }
    })

    new SetupFormSubmit($('#form-create-bank-account')).validate({
        rules: {},
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm = {
                'bank_mapped': $bank_mapped.val(),
                'bank_account_number': $bank_account_number.val(),
                'bank_account_owner': $bank_account_owner.val(),
                'currency': $currency.val(),
                'is_brand': $is_brand.prop('checked'),
                'brand_name': $brand_name.val(),
                'brand_address_data': {
                    'country_id': $('#modal-bank-account .location_country').val(),
                    'province_id': $('#modal-bank-account .location_province').val(),
                    'ward_id': $('#modal-bank-account .location_ward').val(),
                    'address': $('#modal-bank-account .location_detail_address').val()
                }
            }
            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp)
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $('#modal-bank-account').modal('hide')
                        $('#modal-bank-account form')[0].reset()
                        RenderBankAccountTable()
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure')
                }
            )
        }
    })
})
