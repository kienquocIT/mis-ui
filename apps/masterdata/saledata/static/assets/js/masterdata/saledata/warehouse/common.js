let [cityEle, districtEle, wardEle, agencyEle] = [$('#warehouseCity'), $('#warehouseDistrict'), $('#warehouseWard'), $('#boxSelectAgency')];

class WarehouseLoadPage {
    static loadCities(cityData) {
        cityEle.initSelect2({
            data: (cityData ? cityData : null),
            keyResp: 'cities',
        }).on('change', function () {
            let dataParams = JSON.stringify({'city_id': $(this).val()});
            districtEle.empty();
            wardEle.empty();
            districtEle.attr('data-params', dataParams).val("");
            wardEle.attr('data-params', '{}').val("");
        });
    }

    static loadDistrict(disData) {
        districtEle.initSelect2({
            data: (disData ? disData : null),
            keyResp: 'districts',
        }).on('change', function () {
            let dataParams = JSON.stringify({'district_id': $(this).val()});
            wardEle.empty();
            wardEle.attr('data-params', dataParams).val("");
        });
    }

    static loadWard(wardData) {
        wardEle.initSelect2({
            data: (wardData ? wardData : null),
            keyResp: 'wards',
        });
    }

    static loadAgency(data) {
        agencyEle.initSelect2({
            data: data,
            dataParams: {
                'account_types_mapped__account_type_order': 2
            }
        })
    }

    static getFormData() {
        let shelf_data_new = []
        let shelf_data_update = []
        $('.shelf').each(function () {
            if ($(this).attr('data-shelf-id')) {
                // shelf_data_update.push({
                //     'shelf_id': $(this).attr('data-shelf-id'),
                //     'shelf_title': $(this).find('.shelf-title').text(),
                //     'shelf_position': $(this).attr('style'),
                //     'shelf_order': $(this).attr('data-shelf-order'),
                //     'shelf_row': $(this).attr('data-shelf-row'),
                //     'shelf_column': $(this).attr('data-shelf-col')
                // })
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
            'address': $('#addressDetail').val(),
            'city': cityEle.val(),
            'district': districtEle.val(),
            'ward': wardEle.val(),
            'agency': $('#checkAgencyLocation').prop('checked') ? agencyEle.val() : null,
            'full_address': $('#warehouseAddress').val(),
            'is_active': $('#inputActive').is(':checked'),
            'is_dropship': $('#checkDropShip').prop('checked'),
            'is_bin_location': $('#checkBinLocation').prop('checked'),
            'is_agency_location': $('#checkAgencyLocation').prop('checked'),
            'shelf_data_new': shelf_data_new,
            'shelf_data_update': shelf_data_update
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
                $x.fn.renderCodeBreadcrumb(detail);
                $('#inpTitle').val(detail.title);
                $('#inpRemarks').val(detail.remarks);

                $('#checkDropShip').prop('checked', detail?.['is_dropship']);
                $('#checkBinLocation').prop('checked', detail?.['is_bin_location']);
                $('.bin-location-area').prop('hidden', !detail?.['is_bin_location']);
                $('#checkAgencyLocation').prop('checked', detail?.['is_agency_location']);
                $('#hidden-place').prop('hidden', !detail?.['is_agency_location']);
                WarehouseLoadPage.loadAgency(detail.agency);

                $('#inputActive').prop('checked', detail.is_active);
                $('#warehouseAddress').val(detail.full_address);
                $('#addressDetail').val(detail.address);
                this.loadCities(detail.city);
                this.loadDistrict(detail.district);
                this.loadWard(detail.ward);

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
        let city = SelectDDControl.get_data_from_idx(cityEle, cityEle.val());
        let district = SelectDDControl.get_data_from_idx(districtEle, districtEle.val());
        let ward = SelectDDControl.get_data_from_idx(wardEle, wardEle.val());
        let detail = $('#addressDetail').val();

        let fullAddress = `${detail}, ${ward.title}, ${district.title}, ${city.title}`;

        $('#warehouseAddress').val(fullAddress);

        $('#modalWarehouseAddress').modal('hide');
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

    $('#checkAgencyLocation').on('change', function () {
        $('#hidden-place').prop('hidden', !$(this).is(':checked'));
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
        className: 'wrap-text w-5',
        'render': () => {
            return ``;
        }
    },
    {
        className: 'wrap-text',
        'render': (data, type, row) => {
            return `<span class="text-muted">${row?.['account_determination_type_convert']}</span>`;
        }
    },
    {
        className: 'wrap-text w-30',
        'render': (data, type, row) => {
            return `<span class="text-muted">${row?.['title']}</span>`;
        }
    },
    {
        className: 'wrap-text w-20',
        'render': (data, type, row) => {
            return `<select class="form-select select2">
                        <option value="${row?.['account_mapped']?.['id']}" selected>${row?.['account_mapped']?.['acc_code']}</option>
                    </select>`;
        }
    },
    {
        className: 'wrap-text w-45',
        'render': (data, type, row) => {
            return `<span class="text-muted">${row?.['account_mapped']?.['acc_name']}</span>
                    <span class="small text-primary">(${row?.['account_mapped']?.['foreign_acc_name']})</span>`;
        }
    },
]

function loadDefinitionTable() {
    if (!$.fn.DataTable.isDataTable('#warehouse-account-determination-table')) {
        let frm = new SetupFormSubmit($warehouse_account_determination_table);
        $warehouse_account_determination_table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            reloadCurrency: true,
            paging: false,
            scrollX: '100vw',
            scrollY: '18vw',
            scrollCollapse: true,
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

                        console.log(data_list)
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
        });
    }
}

$('#accounting-determination-tab').on('click', function () {
    loadDefinitionTable()
})
