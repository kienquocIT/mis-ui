$(document).ready(function () {
    const $main_table = $('#goods-detail-main-table')
    const $prd_category = $('#prd-category')
    const $prd = $('#prd')
    const $wh = $('#wh')
    const $status = $('#status')
    const $table_serial = $('#table-serial')
    const $table_lot = $('#table-lot')
    const $trans_script = $('#trans-url')
    const $add_new_row_lot = $('#add-new-row-lot')
    const $filter_btn = $('#filter-btn')

    function loadProductCategory(data) {
        $prd_category.initSelect2({
            placeholder: $trans_script.attr('data-trans-all'),
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
            placeholder: $trans_script.attr('data-trans-all'),
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
            placeholder: $trans_script.attr('data-trans-all'),
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

    function loadMainTable(category_list=[], product_list=[], warehouse_list=[], status_list=[]) {
        $main_table.DataTable().clear().destroy()
        $main_table.DataTableDefault({
            dom: '',
            rowIdx: true,
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

                        // filter 1: filter by category
                        if (category_list.length > 0) {
                            result = result.filter(item => category_list.includes(item?.['product']?.['category']));
                        }
                        // filter 2: filter by product
                        if (product_list.length > 0) {
                            result = result.filter(item => product_list.includes(item?.['product']?.['id']));
                        }
                        // filter 3: filter by warehouse
                        if (warehouse_list.length > 0) {
                            result = result.filter(item => warehouse_list.includes(item?.['warehouse']?.['id']));
                        }
                        // filter 4: filter by status
                        if (status_list.length > 0) {
                            result = result.filter(item => status_list.includes(item?.['status'].toString()));
                        }

                        return result;
                    }
                    return [];
                },
            },
            columns: [
                {
                    data: '',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return ``;
                    }
                },
                {
                    data: 'product',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary badge-sm w-25">${data?.['code']}</span>&nbsp;<span>${data?.['title']}</span>`;
                    }
                },
                {
                    data: 'goods_receipt',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-secondary gr-code">${data?.['code']}</span>`;
                    }
                },
                {
                    data: 'goods_receipt',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        if (data?.['date_approved']) {
                            return `<span>${moment(data?.['date_approved'].split(' ')[0]).format('DD/MM/YYYY')}</span>`;
                        }
                        return ``
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
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `${data}`;
                    }
                },
                {
                    data: 'serial_list',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        if (row?.['product']?.['type'] === 2) {
                            let status = row?.['status'] ? $trans_script.attr('data-trans-done') : $trans_script.attr('data-trans-not-yet')
                            let color = row?.['status'] ? 'badge badge-soft-success w-70' : 'badge badge-soft-warning w-70'
                            return `
                                <span class="${color} row-status">${status}</span>
                                <button type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal-serial"
                                        class="btn-open-modal-serial btn btn-icon btn-rounded btn-flush-secondary flush-hover btn-xs"
                                        data-quantity-import="${row?.['quantity_import']}"
                                        data-product-id="${row?.['product']?.['id']}"
                                        data-warehouse-id="${row?.['warehouse']?.['id']}"
                                        data-goods-receipt-id="${row?.['goods_receipt']?.['id']}"
                                        >
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
                            let status = row?.['status'] ? $trans_script.attr('data-trans-done') : $trans_script.attr('data-trans-not-yet')
                            let color = row?.['status'] ? 'badge badge-soft-success w-70' : 'badge badge-soft-warning w-70'
                            return `
                                <span class="${color} row-status">${status}</span>
                                <button type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal-lot"
                                        class="btn-open-modal-lot btn btn-icon btn-rounded btn-flush-light flush-hover btn-xs"
                                        data-quantity-import="${row?.['quantity_import']}"
                                        data-product-id="${row?.['product']?.['id']}"
                                        data-warehouse-id="${row?.['warehouse']?.['id']}"
                                        data-goods-receipt-id="${row?.['goods_receipt']?.['id']}"
                                        data-status="${row?.['status']}"
                                        >
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

    loadMainTable([], [], [], $status.val());

    function loadSerialTable(data, product_id, warehouse_id, goods_receipt_id) {
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
                        return `<input ${disabled_readonly}
                                        data-raw="${data ? data : ''}"
                                        data-serial-id="${row?.['id']}"
                                        class="form-control vendor_serial_number" value="${data ? data : ''}">`;
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
                        if (row?.['id'] && !row?.['is_delete']) {
                            return `<button type="button" class="btn-edit btn btn-icon btn-flush-primary flush-hover btn-xs">
                                    <span class="icon"><i class="bi bi-pencil-square"></i></span>
                                </button>
                                    <button hidden type="button" class="btn-rollback btn btn-icon btn-flush-secondary flush-hover btn-xs">
                                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                                    </button>
                            `;
                        }
                        if (row?.['is_delete']) {
                            return `${$trans_script.attr('data-trans-delivered')}`
                        }
                        return ``
                    }
                },
            ],
            initComplete: function () {
                $('.date-input').each(function () {
                    LoadDate($(this), $(this).val() === '')
                })
                $table_serial.attr('data-product-id', product_id)
                $table_serial.attr('data-warehouse-id', warehouse_id)
                $table_serial.attr('data-goods-receipt-id', goods_receipt_id)
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
        let product_id = $(this).attr('data-product-id')
        let warehouse_id = $(this).attr('data-warehouse-id')
        let goods_receipt_id = $(this).attr('data-goods-receipt-id')
        loadSerialTable(table_data, product_id, warehouse_id, goods_receipt_id)
    })

    function loadLotTable(data, product_id, warehouse_id, goods_receipt_id, goods_receipt_quantity, status) {
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
                        return `<input disabled readonly data-raw="${data ? data : ''}" data-lot-id="${row?.['id']}" class="form-control lot_number" value="${data ? data : ''}">`;
                    }
                },
                {
                    data: 'quantity_import',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span>${$trans_script.attr('data-trans-current')}: ${data ? data : 0}</span>`;
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
                $table_lot.attr('data-product-id', product_id)
                $table_lot.attr('data-warehouse-id', warehouse_id)
                $table_lot.attr('data-goods-receipt-id', goods_receipt_id)
                $table_lot.attr('data-goods-receipt-quantity', goods_receipt_quantity)
                $add_new_row_lot.closest('div').prop('hidden', parseInt(status))
            }
        });
    }

    $(document).on("click", '.btn-open-modal-lot', function () {
        let table_data = $(this).closest('td').find('.lot_list_data').text() ? JSON.parse($(this).closest('td').find('.lot_list_data').text()) : []
        let product_id = $(this).attr('data-product-id')
        let warehouse_id = $(this).attr('data-warehouse-id')
        let goods_receipt_id = $(this).attr('data-goods-receipt-id')
        let goods_receipt_quantity = $(this).attr('data-quantity-import')
        let status = $(this).attr('data-status')
        loadLotTable(table_data, product_id, warehouse_id, goods_receipt_id, goods_receipt_quantity, status)
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
        $(this).closest('tbody').find('tr').each(function () {
            if ($(this).find('input:first-child').attr('data-lot-id') || $(this).find('input:first-child').attr('data-serial-id')) {
                $(this).closest('tr input').prop('disabled', true).prop('readonly', true)
            }
        })
        $(this).closest('tr').find('input').prop('disabled', false).prop('readonly', false).addClass('is-valid')
        $(this).closest('td').find('.btn-rollback').prop('hidden', false)
    })

    $(document).on("click", '.btn-rollback', function () {
        $(this).closest('tr').find('input').each(function() {
            $(this).val($(this).attr('data-raw')).removeClass('is-valid').prop('disabled', true).prop('readonly', true);
        });
        $(this).prop('hidden', true);
    });

    $(document).on("mouseenter", '#goods-detail-main-table tr', function () {
        let this_gr_code = $(this).find('.gr-code').text()
        $main_table.find('.gr-code').each(function() {
            if ($(this).text() === this_gr_code) {
                $(this).attr('class', 'badge badge-secondary gr-code')
            }
            else {
                $(this).attr('class', 'badge badge-soft-secondary gr-code')
            }
        });
    });

    $add_new_row_lot.on('click', function () {
        $table_lot.find('tbody .dataTables_empty').closest('tr').remove()
        let index = $table_lot.find('tbody tr').length + 1
        $table_lot.find('tbody').append(`
            <tr>
                <td class="index">${index}</td>
                <td>
                    <input data-lot-id="" class="form-control lot_number">
                </td>
                <td>
                    <input type="number" class="form-control quantity_import">
                </td>
                <td>
                    <input class="date-input form-control expire_date">
                </td>
                <td>
                    <input class="date-input form-control manufacture_date">
                </td>
                <td class="text-center">
                    <button type="button" class="btn-delete btn btn-icon btn-flush-danger flush-hover btn-xs">
                        <span class="icon"><i class="far fa-trash-alt"></i></span>
                    </button>
                </td>
            </tr>
        `)
        $('.date-input').each(function () {
            LoadDate($(this), $(this).val() === '')
        })
    })

    $(document).on("click", '.btn-delete', function () {
        $(this).closest('tr').remove();
        $table_lot.find('tbody tr').each(function (index) {
            $(this).find('.index').text(index+1)
        })
    });

    function combinesDataSerial(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))
        frm.dataForm['product_id'] = frmEle.find('#table-serial').attr('data-product-id')
        frm.dataForm['warehouse_id'] = frmEle.find('#table-serial').attr('data-warehouse-id')
        frm.dataForm['goods_receipt_id'] = frmEle.find('#table-serial').attr('data-goods-receipt-id')
        frm.dataForm['is_serial_update'] = true
        frm.dataForm['serial_data'] = []
        $table_serial.find('tbody tr').each(function () {
            frm.dataForm['serial_data'].push({
                "serial_id": $(this).find('.vendor_serial_number').attr('data-serial-id') !== "null" ? $(this).find('.vendor_serial_number').attr('data-serial-id') : null,
                "vendor_serial_number": $(this).find('.vendor_serial_number').val(),
                "serial_number": $(this).find('.serial_number').val(),
                "expire_date": $(this).find('.expire_date').val() ? moment($(this).find('.expire_date').val(), "DD/MM/YYYY").format('YYYY-MM-DD') : null,
                "manufacture_date": $(this).find('.manufacture_date').val() ? moment($(this).find('.manufacture_date').val(), "DD/MM/YYYY").format('YYYY-MM-DD') : null,
                "warranty_start": $(this).find('.warranty_start').val() ? moment($(this).find('.warranty_start').val(), "DD/MM/YYYY").format('YYYY-MM-DD') : null,
                "warranty_end": $(this).find('.warranty_end').val() ? moment($(this).find('.warranty_end').val(), "DD/MM/YYYY").format('YYYY-MM-DD') : null,
            })
        })
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-serial').submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataSerial($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
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
                    }
                )
        }
    })

    function combinesDataLot(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))
        frm.dataForm['product_id'] = frmEle.find('#table-lot').attr('data-product-id')
        frm.dataForm['warehouse_id'] = frmEle.find('#table-lot').attr('data-warehouse-id')
        frm.dataForm['goods_receipt_id'] = frmEle.find('#table-lot').attr('data-goods-receipt-id')
        frm.dataForm['gr_quantity_import'] = frmEle.find('#table-lot').attr('data-goods-receipt-quantity')
        frm.dataForm['is_lot_update'] = true
        frm.dataForm['lot_data'] = []
        $table_lot.find('tbody tr').each(function () {
            frm.dataForm['lot_data'].push({
                "lot_id": $(this).find('.lot_number').attr('data-lot-id') !== "null" ? $(this).find('.lot_number').attr('data-lot-id') : null,
                "lot_number": $(this).find('.lot_number').val(),
                "quantity_import": $(this).find('.quantity_import').val() ? $(this).find('.quantity_import').val() : $(this).find('.quantity_import').text(),
                "expire_date": $(this).find('.expire_date').val() ? moment($(this).find('.expire_date').val(), "DD/MM/YYYY").format('YYYY-MM-DD') : null,
                "manufacture_date": $(this).find('.manufacture_date').val() ? moment($(this).find('.manufacture_date').val(), "DD/MM/YYYY").format('YYYY-MM-DD') : null
            })
        })
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#form-lot').submit(function (event) {
        event.preventDefault();
        let combinesData = combinesDataLot($(this));
        if (combinesData) {
            WindowControl.showLoading();
            $.fn.callAjax2(combinesData)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: "Successfully"}, 'success')
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-url-redirect'));
                                location.reload.bind(location);
                            }, 1000);
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
                    }
                )
        }
    })

    $filter_btn.on('click', function () {
        let category_list = $prd_category.val()
        let product_list = $prd.val()
        let warehouse_list = $wh.val()
        let status_list = $status.val()
        loadMainTable(category_list, product_list, warehouse_list, status_list)
    })
})