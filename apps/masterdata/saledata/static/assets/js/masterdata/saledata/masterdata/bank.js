const $trans_script = $('#trans-script')
const $VietQRDataListInp =$('#VietQRBankList')
const $bank_tbl = $('#datatable-bank');
const $bank_abbreviation =$('#bank_abbreviation')
const $bank_name =$('#bank_name')
const $bank_foreign_name =$('#bank_foreign_name')
const $bank_detail_address =$('#bank_detail_address')
const $bank_country =$('#bank_country')
const $bank_city =$('#bank_city')
const $bank_district =$('#bank_district')
const $bank_ward =$('#bank_ward')
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
                className: 'wrap-text w-5',
                'render': () => {
                    return ``;
                }
            },
            {
                className: 'wrap-text w-10',
                'render': (data, type, row) => {
                    if (row?.['vietqr_json_data']?.['logo']) {
                        return `<image style="height: 45px" src="${row?.['vietqr_json_data']?.['logo']}">`
                    }
                    return ``;
                }
            },
            {
                className: 'wrap-text w-35',
                'render': (data, type, row) => {
                    return `<span class="fw-bold text-primary">${row?.['bank_name']}</span><br><span class="text-muted small">${row?.['bank_foreign_name']}</span>`;
                }
            },
            {
                className: 'wrap-text w-10',
                'render': (data, type, row) => {
                    return `<span class="fw-bold text-primary">${row?.['bank_abbreviation']}</span>`;
                }
            },
            {
                className: 'wrap-text w-30',
                'render': (data, type, row) => {
                    return `<span>${row?.['head_office_address']}</span>`;
                }
            },
            {
                className: 'wrap-text text-right w-10',
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

function loadCountry(data) {
    $bank_country.initSelect2({
        data: (data ? data : null),
        keyResp: 'countries',
    })
}

function loadCity(data) {
    $bank_city.initSelect2({
        data: (data ? data : null),
        keyResp: 'cities',
    }).on('change', function () {
        let dataParams = JSON.stringify({'city_id': $(this).val()});
        $bank_district.empty();
        $bank_district.attr('data-params', dataParams).val("");
        $bank_ward.empty();
        $bank_ward.attr('data-params', '{}').val("");
    });
}

function loadDistrict(data) {
    $bank_district.initSelect2({
        data: (data ? data : null),
        keyResp: 'districts',
    }).on('change', function () {
        let dataParams = JSON.stringify({'district_id': $(this).val()});
        $bank_ward.empty();
        $bank_ward.attr('data-params', dataParams).val("");
    });
}

function loadWard(wardData) {
    $bank_ward.initSelect2({
        data: (wardData ? wardData : null),
        keyResp: 'wards',
    });
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
                <h4 class="text-danger">${$trans_script.attr('data-trans-change-confirm')}</h4>
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

$bank_abbreviation.on('change', function () {
    $bank_name.val($VietQRDataListInp.find(`option[value="${$(this).val()}"]`).text())
})

$(document).ready(async function () {
    RenderBankTable()
    await LoadVietQRBankList()
    loadCountry()
    loadCity()
    loadDistrict()
    loadWard()

    new SetupFormSubmit($('#form-create-bank')).validate({
        rules: {},
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form));
            frm.dataForm = {
                'bank_abbreviation': $bank_abbreviation.val(),
                'bank_name': $bank_name.val(),
                'bank_foreign_name': $bank_foreign_name.val(),
                'head_office_address_data': {
                    'country_id': $bank_country.val(),
                    'city_id': $bank_city.val(),
                    'district_id': $bank_district.val(),
                    'ward_id': $bank_ward.val(),
                    'address': $bank_detail_address.val()
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
})