class WarehouseLoadPage {
    static getFormData() {
        let shelf_data_new = []
        $('.shelf').each(function () {
            if ($(this).attr('data-shelf-id')) {
                shelf_data_new.push({
                    'shelf_title': $(this).find('.shelf-title').text(),
                    'shelf_position': $(this).attr('style'),
                    'shelf_order': $(this).attr('data-shelf-order'),
                    'shelf_row': $(this).attr('data-shelf-row'),
                    'shelf_column': $(this).attr('data-shelf-col')
                })
            }
            else {
                shelf_data_new.push({
                    'shelf_title': $(this).find('.shelf-title').text(),
                    'shelf_position': $(this).attr('style'),
                    'shelf_order': $(this).attr('data-shelf-order'),
                    'shelf_row': $(this).attr('data-shelf-row'),
                    'shelf_column': $(this).attr('data-shelf-col')
                })
            }
        })

        return {
            'title': $('#inpTitle').val(),
            'remarks': $('#inpRemarks').val(),
            'is_active': $('#inputActive').is(':checked'),
            'detail_address': $('#warehouseAddress').val(),
            'address_data': $('#warehouseAddress').attr('data-work-address') ? JSON.parse($('#warehouseAddress').attr('data-work-address')) : {},
            'is_dropship': $('#checkDropShip').prop('checked'),
            'is_bin_location': $('#checkBinLocation').prop('checked'),
            'is_virtual': $('#checkVirtual').prop('checked'),
            'shelf_data_new': shelf_data_new,
        }
    }

    static loadDetail(frmDetail, pk, type='detail') {
        let frm = new SetupFormSubmit(frmDetail);
        $.fn.callAjax2({
            'url': frm.getUrlDetail(pk),
            'method': 'GET'
        }).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                let detail = data?.['warehouse_detail'];
                console.log(detail)
                $x.fn.renderCodeBreadcrumb(detail);
                $('#inpTitle').val(detail.title);
                $('#inpRemarks').val(detail.remarks);

                $('#checkDropShip').prop('checked', detail?.['is_dropship']);
                $('#checkBinLocation').prop('checked', detail?.['is_bin_location']);
                $('.bin-location-area').prop('hidden', !detail?.['is_bin_location']);
                $('#checkVirtual').prop('checked', detail?.['is_virtual']);

                $('#inputActive').prop('checked', detail.is_active);
                // for location
                UsualLoadPageFunction.LoadLocationCountry($('#modalWarehouseAddress .location_country'))
                UsualLoadPageFunction.LoadLocationProvince($('#modalWarehouseAddress .location_province'))
                UsualLoadPageFunction.LoadLocationWard($('#modalWarehouseAddress .location_ward'))
                $('#warehouseAddress').val(detail.detail_address).attr(
                    'data-work-address',
                    JSON.stringify(detail?.address_data || {})
                )

                // load shelf
                for (const shelf of detail?.['shelf_data']) {
                    $('#shelf-map').append(`
                        <div class="shelf rounded text-center fw-bold fst-italic pt-2 m-1"
                             id="shelf-${shelf?.['shelf_order']}"
                             data-shelf-id="${shelf?.['id']}"
                             data-shelf-order="${shelf?.['shelf_order']}"
                             data-shelf-row="${shelf?.['shelf_row']}"
                             data-shelf-col="${shelf?.['shelf_column']}"
                             style="${shelf?.['shelf_position']}"
                        >
                            <span hidden class="delete-shelf text-danger"><i class="bi bi-x-circle"></i></span>
                            <span hidden class="detail-shelf text-primary"
                                  data-shelf-row="${shelf?.['shelf_row']}"
                                  data-shelf-col="${shelf?.['shelf_column']}"
                                  data-bs-toggle="modal"
                                  data-bs-target="#shelf-detail-modal">
                                  <i class="bi bi-eye-fill"></i>
                            </span>
                            <span class="shelf-title">${shelf?.['shelf_title']}</span>
                        </div>
                    `)
                }
                $(document.getElementsByClassName('shelf')).resizable({ghost: true}).draggable({containment: "#shelf-map"})
                if (type === 'detail') {
                    $('form input').prop('disabled', true).prop('readonly', true)
                    $('textarea').prop('disabled', true).prop('readonly', true)
                    $(document.getElementsByClassName('delete-shelf')).remove()
                    $(document.getElementsByClassName('ui-resizable-handle')).remove()
                }
            }
        })
    }
}

function eventPage() {
    $('#saveWarehouseAddress').on('click', function () {
        let country_id = $('#modalWarehouseAddress .location_country').val()
        let province_id = $('#modalWarehouseAddress .location_province').val()
        let ward_id = $('#modalWarehouseAddress .location_ward').val()
        let detail_address = $('#modalWarehouseAddress .location_detail_address').val()
        if (detail_address && ward_id && province_id && country_id) {
            $('#warehouseAddress').val(`${detail_address}, ${$('#modalWarehouseAddress .location_ward').find(`option:selected`).text()}, ${$('#modalWarehouseAddress .location_province').find(`option:selected`).text()}, ${$('#modalWarehouseAddress .location_country').find(`option:selected`).text()}`)
            $('#warehouseAddress').attr(
                'data-work-address',
                JSON.stringify({
                    country_id: country_id,
                    province_id: province_id,
                    ward_id: ward_id,
                    detail_address: detail_address,
                })
            )
            $('#modalWarehouseAddress').modal('hide');
        } else {
            $.fn.notifyB({description: "Missing address information!"}, 'failure');
        }
    })

    $('#checkDropShip').on('change', function () {
        if ($(this).prop('checked')) {
            $('#warehouseAddress').val('')
            $('#warehouseAddress').closest('.form-group').find('label').removeClass('required')
        }
        else {
            $('#warehouseAddress').closest('.form-group').find('label').addClass('required')
        }
    })

    $('#checkBinLocation').on('change', function () {
        $('.bin-location-area').prop('hidden', !$(this).is(':checked'));
    })
}

// for bin location
$('#shelf-map').resizable()

$('#new-shelf').on('click', function () {
    let shelf_order = $('#shelf-map').find('.shelf').length
    let shelf_row = $('#new-shelf-row').val()
    let shelf_col = $('#new-shelf-col').val()
    let width_shelf = (parseFloat(shelf_col) * 30).toString() + 'px'
    $('#shelf-map').append(`
        <div class="shelf rounded text-center fw-bold fst-italic pt-2 m-1"
             id="shelf-${shelf_order}"
             data-shelf-order="${shelf_order}"
             data-shelf-row="${shelf_row}"
             data-shelf-col="${shelf_col}"
             style="
                color: rgb(0,100,50);
                background-color: rgb(235,255,250);
                min-height: 50px;
                width: ${width_shelf};
                height: 50px;
                border: dashed 1px rgb(0,100,50);
             "
        >
            <span hidden class="delete-shelf text-danger"><i class="bi bi-x-circle"></i></span>
            <span hidden class="detail-shelf text-primary" 
                  data-bs-toggle="modal"
                  data-bs-target="#shelf-detail-modal">
                  <i class="bi bi-eye-fill"></i>
            </span>
            <span class="shelf-title">${$('#new-shelf-title').val()}</span>
        </div>
    `)
    $(`.shelf`).resizable({ghost: true}).draggable({containment: "#shelf-map"})
    $('#new-shelf-title').val('')
})

$(document).on('mouseenter', '.shelf', function () {
    $(this).find('.delete-shelf').prop('hidden', false)
    $(this).find('.detail-shelf').prop('hidden', false)
})
$(document).on('mouseleave', '.shelf', function () {
    $(this).find('.delete-shelf').prop('hidden', true)
    $(this).find('.detail-shelf').prop('hidden', true)
})
$(document).on('click', '.delete-shelf', function () {
    const response = confirm("Are you sure you delete this shelf?");
    if (response) {
        $(this).closest('.shelf').remove()
    }
})
$(document).on('click', '.detail-shelf', function () {
    $('#shelf-area').html('')
    let rows = $(this).attr('data-shelf-row')
    let cols = $(this).attr('data-shelf-col')
    for (let row = 1; row <= rows; row++) {
        let row_html = $(`<div class="hstack flex-wrap align-items-center p-0" id="shelf-row-${row}"></div>`)
        for (let col = 1; col <= cols; col++) {
            row_html.append(`
                <a class="w-30p h-30p border popover-bin"
                style="background-color: rgb(235,255,250);"
                id="shelf-row-${row}-col-${col}"
                data-bs-placement="bottom"
                data-bs-toggle="popover"
                data-bs-trigger="hover focus"
                data-bs-html="true"
                data-bs-content="- Tầng: ${rows - row + 1}<br>- Vị trí: ${col}"></a>
            `)
        }
        $('#shelf-area').append(row_html)
    }
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
    $('.popover-bin:first-child').trigger('hover')
    $('#new-shelf-row').val(1)
    $('#new-shelf-col').val(1)
})

// for account determination
const $warehouse_account_determination_table = $('#warehouse-account-determination-table')
const columns_cfg = [
    {
        className: 'w-5',
        'render': () => {
            return ``;
        }
    },
    {

        'render': (data, type, row) => {
            return `<span class="text-muted">${row?.['account_determination_type_convert']}</span>`;
        }
    },
    {
        className: 'w-30',
        'render': (data, type, row) => {
            return `<h6 class="text-muted fw-bold">${row?.['title']}</h6><h6 class="small text-primary fw-bold">${row?.['foreign_title']}</h6>`;
        }
    },
    {
        className: 'w-20',
        'render': (data, type, row) => {
            return `<select disabled data-account-mapped='${JSON.stringify(row?.['account_mapped'])}' class="form-select select2 selected-accounts"></select>`;
        }
    },
    {
        className: 'w-35',
        'render': (data, type, row) => {
            return `<div class="selected-accounts-des"></div>`;
        }
    },
    {
        className: 'text-right w-10',
        'render': (data, type, row) => {
            let change_btn = `<a class="btn btn-icon btn-flush-primary btn-rounded flush-soft-hover btn-xs btn-change-account">
               <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i class="fa-solid fa-pen-to-square"></i></span></span>
            </a>`;
            let save_btn = `<button type="button" data-id="${row?.['id']}" hidden class="btn btn-custom btn-primary btn-xs btn-save-change-account">
                <span>
                    <span class="icon"><span class="feather-icon"><i class="fa-solid fa-file-pen"></i></span></span>
                    <span>${$.fn.gettext('Save changes')}</span>
                </span>
            </button>`;
            return row?.['can_change_account'] ? change_btn + save_btn : ''
        }
    },
]

function loadAccountDeterminationTable() {
    if (!$.fn.DataTable.isDataTable('#warehouse-account-determination-table')) {
        let frm = new SetupFormSubmit($warehouse_account_determination_table);
        $warehouse_account_determination_table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            ajax: {
                url: frm.dataUrl,
                data: {'warehouse_mapped_id': $.fn.getPkDetail()},
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let data_list = resp.data['warehouse_account_determination_list'] ? resp.data['warehouse_account_determination_list'] : []
                        data_list.sort((a, b) => {
                            const typeA = a?.['account_determination_type_convert'];
                            const typeB = b?.['account_determination_type_convert'];
                            if (typeA < typeB) return -1;
                            if (typeA > typeB) return 1;

                            const accCodeA = parseInt(a?.['account_mapped']?.['acc_code'], 10);
                            const accCodeB = parseInt(b?.['account_mapped']?.['acc_code'], 10);
                            return accCodeA - accCodeB;
                        });
                        return data_list ? data_list : [];
                    }
                    return [];
                },
            },
            columns: columns_cfg,
            rowGroup: {
                dataSrc: 'account_determination_type_convert'
            },
            columnDefs: [
                {
                    "visible": false,
                    "targets": [1]
                }
            ],
            initComplete: function () {
                $warehouse_account_determination_table.find('tbody tr .selected-accounts').each(function () {
                    let account_mapped = $(this).attr('data-account-mapped') ? JSON.parse($(this).attr('data-account-mapped')) : []
                    $(this).initSelect2({
                        data: (account_mapped ? account_mapped : null),
                        ajax: {
                            url: $warehouse_account_determination_table.attr('data-chart-of-account-url'),
                            method: 'GET',
                        },
                        keyResp: 'chart_of_accounts_list',
                        keyId: 'id',
                        keyText: 'acc_code',
                        templateResult: function (state) {
                            return $(`<span class="badge badge-light">${state.data?.['acc_code']}</span> <span>${state.data?.['acc_name']}</span> <span class="small">(${state.data?.['foreign_acc_name']})</span>`);
                        },
                    })

                    for (let i = 0; i < account_mapped.length; i++) {
                        $(this).closest('tr').find('.selected-accounts-des').append(
                            `<h6 class="text-muted">${account_mapped[i]?.['acc_name']}</h6><h6 class="small text-primary">${account_mapped[i]?.['foreign_acc_name']}</h6>`
                        )
                    }
                })
            }
        });
    }
}

$(document).on('change', '.selected-accounts', function () {
    let account_mapped = [SelectDDControl.get_data_from_idx($(this), $(this).val())]
    $(this).closest('tr').find('.selected-accounts-des').html('')
    for (let i = 0; i < account_mapped.length; i++) {
        $(this).closest('tr').find('.selected-accounts-des').append(
            `<h6 class="text-muted">${account_mapped[i]?.['acc_name']}</h6><h6 class="small text-primary">${account_mapped[i]?.['foreign_acc_name']}</h6>`
        )
    }
    $(this).closest('tr').find('.btn-change-account').prop('hidden', true)
    $(this).closest('tr').find('.btn-save-change-account').prop('hidden', false)
    $(this).closest('tr').addClass('bg-primary-light-5')
})

$(document).on('click', '.btn-save-change-account', function () {
    let row_id = $(this).attr('data-id')
    let row_replace_account = $(this).closest('tr').find('.selected-accounts').val()
    Swal.fire({
        html:
        `<div class="d-flex align-items-center">
			<div class="avatar avatar-icon avatar-soft-blue me-3"><span class="initial-wrap"><i class="fa-solid fa-repeat"></i></span></div>
			<div>
				<h4 class="text-blue">${$warehouse_account_determination_table.attr('data-trans-change-confirm')}</h4>
				<p>${$warehouse_account_determination_table.attr('data-trans-change-noti')}</p>
			</div>
		</div>`,
        customClass: {
            confirmButton: 'btn btn-outline-secondary text-blue',
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
            let ajax_update_account_wh = $.fn.callAjax2({
                url: $warehouse_account_determination_table.attr('data-url-detail').replace('/0', `/${row_id}`),
                data: {'replace_account': row_replace_account},
                method: 'PUT'
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && typeof data === 'object' && data.hasOwnProperty('detail')) {
                        $.fn.notifyB({description: 'Update account determination successfully!'}, 'success');
                        return data?.['detail'];
                    }
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )

            Promise.all([ajax_update_account_wh]).then(
                (results) => {
                    $warehouse_account_determination_table.DataTable().clear().destroy()
                    // loadAccountDeterminationTable()
                }
            )
        }
    })
})

$(document).on('click', '.btn-change-account', function () {
    $(this).closest('tr').find('.selected-accounts').prop('disabled', false)
})

$('#accounting-determination-tab').on('click', function () {
    // loadAccountDeterminationTable()
})
