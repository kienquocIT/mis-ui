$(document).ready(function () {
    const $main_table = $('#goods-detail-main-table')
    const $prd_category = $('#prd-category')
    const $prd = $('#prd')
    const $wh = $('#wh')
    const $status = $('#status')
    const $table_serial = $('#table-serial')
    const $table_lot = $('#table-lot')

    function loadProductCategory(data) {
        $prd_category.initSelect2({
            allowClear: true,
            ajax: {
                url: $prd_category.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_category_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }

    loadProductCategory()

    function loadProduct(data) {
        $prd.initSelect2({
            allowClear: true,
            ajax: {
                url: $prd.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }

    loadProduct()

    function loadWarehouse(data) {
        $wh.initSelect2({
            allowClear: true,
            ajax: {
                url: $wh.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'warehouse_list',
            keyId: 'id',
            keyText: 'title',
        }).on('change', function () {})
    }

    loadWarehouse()

    function loadMainTable() {
        $main_table.DataTableDefault({
            dom: '',
            paging: false,
            useDataServer: true,
            reloadCurrency: true,
            ajax: {
                url: $main_table.attr('data-url'),
                type: $main_table.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        let result = []
                        for (const item of resp.data['goods_detail_list'] ? resp.data['goods_detail_list'] : []) {
                            result = result.concat(item?.['product_data'])
                        }
                        return result;
                    }
                    return [];
                },
            },
            columns: [
                {
                    data: 'product',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary badge-sm w-20">${data?.['code']}</span>&nbsp;<span>${data?.['title']}</span>`;
                    }
                },
                {
                    data: 'goods_receipt',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-secondary">${data?.['code']}</span>`;
                    }
                },
                {
                    data: 'goods_receipt',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span>${moment(data?.['date_approved'].split(' ')[0]).format('DD/MM/YYYY')}</span>`;
                    }
                },
                {
                    data: 'person_in_charge',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span>${data?.['full_name']}</span>`;
                    }
                },
                {
                    data: 'warehouse',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-blue badge-sm w-20">${data?.['code']}</span>&nbsp;<span>${data?.['title']}</span>`;
                    }
                },
                {
                    data: 'quantity_import',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `${data}`;
                    }
                },
                {
                    data: 'serial_list',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        if (row?.['product']?.['type'] === 2) {
                            return `
                                <button type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal-serial"
                                        class="btn-open-modal-serial btn btn-icon btn-rounded btn-flush-primary flush-hover btn-xs"
                                        data-quantity-import="${row?.['quantity_import']}">
                                    <span class="icon"><i class="bi bi-box-arrow-up-right"></i></span>
                                </button>
                                <script class="serial_list_data">${JSON.stringify(data)}</script>
                            `;
                        }
                        return ``
                    }
                },
                {
                    data: 'lot_list',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        if (row?.['product']?.['type'] === 1) {
                            return `
                                <button type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal-lot"
                                        class="btn-open-modal-lot btn btn-icon btn-rounded btn-flush-light flush-hover btn-xs"
                                        data-quantity-import="${row?.['quantity_import']}">
                                    <span class="icon"><i class="bi bi-box-arrow-up-right"></i></span>
                                </button>
                                <script class="lot_list_data">${JSON.stringify(data)}</script>
                            `;
                        }
                        return ``
                    }
                },
            ],
        });
    }

    loadMainTable();

    function loadSerialTable(data) {
        $table_serial.DataTable().clear().destroy()
        $table_serial.DataTableDefault({
            dom: '',
            rowIdx: true,
            paging: false,
            data: data,
            columns: [
                {
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    data: 'vendor_serial_number',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        let disabled_readonly = ''
                        if (row?.['id']) {
                            disabled_readonly = 'disabled readonly'
                        }
                        return `<input ${disabled_readonly} data-raw="${data ? data : ''}" data-id="${row?.['id']}" class="form-control vendor_serial_number" value="${data ? data : ''}">`;
                    }
                },
                {
                    data: 'serial_number',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        let disabled_readonly = ''
                        if (row?.['id']) {
                            disabled_readonly = 'disabled readonly'
                        }
                        return `<input ${disabled_readonly} data-raw="${data ? data : ''}" class="form-control serial_number" value="${data ? data : ''}">`;
                    }
                },
                {
                    data: 'expire_date',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        let disabled_readonly = ''
                        if (row?.['id']) {
                            disabled_readonly = 'disabled readonly'
                        }
                        return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control expire_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                    }
                },
                {
                    data: 'manufacture_date',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        let disabled_readonly = ''
                        if (row?.['id']) {
                            disabled_readonly = 'disabled readonly'
                        }
                        return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control manufacture_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                    }
                },
                {
                    data: 'warranty_start',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        let disabled_readonly = ''
                        if (row?.['id']) {
                            disabled_readonly = 'disabled readonly'
                        }
                        return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control warranty_start" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                    }
                },
                {
                    data: 'warranty_end',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        let disabled_readonly = ''
                        if (row?.['id']) {
                            disabled_readonly = 'disabled readonly'
                        }
                        return `<input ${disabled_readonly} data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control warranty_end" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                    }
                },
                {
                    data: '',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        if (!row?.['id']) {
                            return ``
                        }
                        return `<button type="button" class="btn-edit btn btn-icon btn-flush-primary flush-hover btn-xs">
                                    <span class="icon"><i class="bi bi-pencil-square"></i></span>
                                </button>
                                <button hidden type="button" class="btn-rollback btn btn-icon btn-flush-secondary flush-hover btn-xs">
                                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                                </button>
                        `;
                    }
                },
            ],
            initComplete: function () {
                $('.date-input').each(function () {
                    LoadDate($(this), $(this).val() === '')
                })
            }
        });
    }

    $(document).on("click", '.btn-open-modal-serial', function () {
        let quantity_import = parseInt($(this).attr('data-quantity-import'))
        let table_data = $(this).closest('td').find('.serial_list_data').text() ? JSON.parse($(this).closest('td').find('.serial_list_data').text()) : []
        let remain = quantity_import - table_data.length
        for (let i = 0; i < remain; i++) {
            table_data.push(
                {
                    "id": null,
                    "vendor_serial_number": null,
                    "serial_number": null,
                    "expire_date": null,
                    "manufacture_date": null,
                    "warranty_start": null,
                    "warranty_end": null
                }
            )
        }
        loadSerialTable(table_data)
    })

    function loadLotTable(data) {
        $table_lot.DataTable().clear().destroy()
        $table_lot.DataTableDefault({
            dom: '',
            rowIdx: true,
            paging: false,
            data: data,
            columns: [
                {
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    data: 'lot_number',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<input disabled readonly data-raw="${data ? data : ''}" data-id="${row?.['id']}" class="form-control lot_number" value="${data ? data : ''}">`;
                    }
                },
                {
                    data: 'quantity_import',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<input disabled readonly data-raw="${data ? data : ''}" type="number" class="form-control quantity_import" value="${data ? data : ''}">`;
                    }
                },
                {
                    data: 'expire_date',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<input disabled readonly data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control expire_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                    }
                },
                {
                    data: 'manufacture_date',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<input disabled readonly data-raw="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}" class="date-input form-control manufacture_date" value="${data ? moment(data.split(' ')[0]).format('DD/MM/YYYY') : ''}">`;
                    }
                },
                {
                    data: '',
                    className: 'wrap-text text-center',
                    render: (data, type, row) => {
                        return `<button type="button" class="btn-edit btn btn-icon btn-flush-primary flush-hover btn-xs">
                                    <span class="icon"><i class="bi bi-pencil-square"></i></span>
                                </button>
                                <button hidden type="button" class="btn-rollback btn btn-icon btn-flush-secondary flush-hover btn-xs">
                                    <span class="icon"><i class="fas fa-undo-alt"></i></span>
                                </button>
                        `;
                    }
                },
            ],
            initComplete: function () {
                $('.date-input').each(function () {
                    LoadDate($(this), $(this).val() === '')
                })
            }
        });
    }

    $(document).on("click", '.btn-open-modal-lot', function () {
        let table_data = $(this).closest('td').find('.lot_list_data').text() ? JSON.parse($(this).closest('td').find('.lot_list_data').text()) : []
        loadLotTable(table_data)
    })

    function LoadDate(ele, is_null=false) {
        ele.daterangepicker({
            singleDatePicker: true,
            timepicker: false,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY'
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            autoApply: true,
        });
        if (is_null) {
            ele.val('')
        }
    }

    $(document).on("click", '.btn-edit', function () {
        $(this).closest('tbody').find('tr input').prop('disabled', true).prop('readonly', true)
        $(this).closest('tr').find('input').prop('disabled', false).prop('readonly', false).addClass('is-valid')
        $(this).closest('td').find('.btn-rollback').prop('hidden', false)
    })

    $(document).on("click", '.btn-rollback', function () {
        $(this).closest('tr').find('input').each(function() {
            $(this).val($(this).attr('data-raw')).removeClass('is-valid').prop('disabled', true).prop('readonly', true);
        });
        $(this).prop('hidden', true);
    });
})