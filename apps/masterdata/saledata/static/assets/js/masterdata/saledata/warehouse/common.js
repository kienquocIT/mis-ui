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
