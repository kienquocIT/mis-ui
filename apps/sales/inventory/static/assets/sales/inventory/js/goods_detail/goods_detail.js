$(document).ready(function () {
    const $main_table = $('#goods-detail-main-table')
    const $prd_category = $('#prd-category')
    const $prd = $('#prd')
    const $wh = $('#wh')
    const $status = $('#status')
    const $table_serial = $('#table-serial')
    const $trans_script = $('#trans-url')
    const $apply_btn = $('#apply-btn')
    const $add_row_sn_btn = $('#add-row-sn')

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
        $main_table.DataTableDefault({
            rowIdx: true,
            // useDataServer: true,
            scrollX: true,
            scrollCollapse: true,
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
                        console.log(result)

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
                        return `<span class="badge badge-soft-secondary">${data?.['code']}</span><br><span class="text-muted">${data?.['title']}</span>`;
                    }
                },
                {
                    data: 'goods_receipt',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-blue gr-code">${data?.['code']}</span>`;
                    }
                },
                {
                    data: 'purchase_request',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-primary pr-code">${data?.['code'] ? data?.['code'] : ''}</span>`;
                    }
                },
                {
                    data: '',
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
                        return `<span class="text-muted">${data?.['full_name']}</span>`;
                    }
                },
                {
                    data: 'warehouse',
                    className: 'wrap-text',
                    render: (data, type, row) => {
                        return `<span class="badge badge-soft-secondary">${data?.['code']}</span><br><span class="text-muted">${data?.['title']}</span>`;
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
                            let color = row?.['status'] ? 'success' : 'warning'
                            return `
                                <button type="button"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modal-serial"
                                        class="btn btn-${color} btn-sm btn-open-modal-serial w-100"
                                        data-quantity-import="${row?.['quantity_import']}"
                                        data-product-id="${row?.['product']?.['id']}"
                                        data-warehouse-id="${row?.['warehouse']?.['id']}"
                                        data-goods-receipt-id="${row?.['goods_receipt']?.['id']}"
                                        data-purchase-request-id="${row?.['purchase_request']?.['id'] ? row?.['purchase_request']?.['id'] : ''}"
                                >
                                    <span class="row-status">${status}</span>
                                </button>
                                <script class="serial_list_data">${JSON.stringify(data)}</script>
                            `;
                        }
                        return ``
                    }
                },
            ],
            initComplete: function (settings, json) {
                let wrapper$ = $main_table.closest('.dataTables_wrapper');
                const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
                const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
                headerToolbar$.prepend(textFilter$);
                if (textFilter$.length > 0) {
                    textFilter$.css('display', 'flex');
                    textFilter$.append(
                        $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append(`
                            <button id="btn-filter" class="btn btn-sm border-secondary bg-secondary-light-5 text-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                <i class="fas fa-sliders-h"></i>&nbsp;${$trans_script.attr('data-trans-filter')}
                            </button>
                        `)
                    )
                }
            },
        });
    }
    loadMainTable([], [], [], $status.val());

    function loadSerialTable() {
        $table_serial.DataTable().clear().destroy()
        $table_serial.DataTableDefault({
            rowIdx: true,
            paging: false,
            scrollY: '50vh',
            scrollX: '100vh',
            scrollCollapse: true,
            ajax: {
                url: $table_serial.attr('data-url'),
                type: 'GET',
                data: {
                    'product_id': $table_serial.attr('data-product-id'),
                    'warehouse_id': $table_serial.attr('data-warehouse-id'),
                    'goods_receipt_id': $table_serial.attr('data-goods-receipt-id'),
                    'purchase_request_id': $table_serial.attr('data-purchase-request-id') ? $table_serial.attr('data-purchase-request-id') : null
                },
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['goods_detail_sn_data_list'] ? resp.data['goods_detail_sn_data_list'] : [];
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
                        return `<button class="btn-del-sn-row btn text-danger btn-link btn-animated" type="button" title="Delete row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
        });
    }

    function AddRow(table, data) {
        table.DataTable().row.add(data).draw();
    }

    function DeleteRow(table, currentRow) {
        currentRow = parseInt(currentRow) - 1
        let rowIndex = table.DataTable().row(currentRow).index();
        let row = table.DataTable().row(rowIndex);
        row.remove().draw();
    }

    $(document).on("click", '.btn-open-modal-serial', function () {
        $table_serial.attr('data-product-id', $(this).attr('data-product-id') ? $(this).attr('data-product-id') : '')
        $table_serial.attr('data-warehouse-id', $(this).attr('data-warehouse-id') ? $(this).attr('data-warehouse-id') : '')
        $table_serial.attr('data-goods-receipt-id', $(this).attr('data-goods-receipt-id') ? $(this).attr('data-goods-receipt-id') : '')
        $table_serial.attr('data-purchase-request-id', $(this).attr('data-purchase-request-id') ? $(this).attr('data-purchase-request-id') : '')
        $table_serial.attr('data-quantity-import', $(this).attr('data-quantity-import') ? $(this).attr('data-quantity-import') : 0)
        loadSerialTable()
    })

    $add_row_sn_btn.on('click', function () {
        if ($table_serial.find('tbody tr').length < parseInt($table_serial.attr('data-quantity-import'))) {
            AddRow($table_serial, {})
            let row_added = $table_serial.find('tbody tr:last-child')
            row_added.find('.date-input').each(function () {
                LoadDate($(this), $(this).val() === '')
            })
        }
        else {
            $.fn.notifyB({description: `You can only import for ${$table_serial.attr('data-quantity-import')} rows.`}, 'warning')
        }
    })

    $(document).on("click", '.btn-del-sn-row', function () {
        DeleteRow($table_serial, parseInt($(this).closest('tr').find('td:first-child').text()))
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
            if ($(this).find('input:first-child').attr('data-serial-id')) {
                $(this).closest('tr input').prop('disabled', true).prop('readonly', true)
            }
        })
        $(this).closest('tr').find('input').prop('disabled', false).prop('readonly', false).addClass('is-valid')
        $(this).closest('td').find('.btn-rollback').prop('hidden', false)
        LoadDate($(this).closest('tr').find('.date-input'), $(this).closest('tr').find('.date-input').val() === '')
    })

    $(document).on("click", '.btn-rollback', function () {
        $(this).closest('tr').find('input').each(function() {
            $(this).val($(this).attr('data-raw')).removeClass('is-valid').prop('disabled', true).prop('readonly', true);
        });
        $(this).prop('hidden', true);
    });

    function combinesDataSerial(frmEle) {
        let frm = new SetupFormSubmit($(frmEle))
        frm.dataForm['product_id'] = frmEle.find('#table-serial').attr('data-product-id')
        frm.dataForm['warehouse_id'] = frmEle.find('#table-serial').attr('data-warehouse-id')
        frm.dataForm['goods_receipt_id'] = frmEle.find('#table-serial').attr('data-goods-receipt-id')
        frm.dataForm['purchase_request_id'] = frmEle.find('#table-serial').attr('data-purchase-request-id') !== 'undefined' ? frmEle.find('#table-serial').attr('data-purchase-request-id') : null
        frm.dataForm['is_serial_update'] = true
        frm.dataForm['serial_data'] = []
        $table_serial.find('tbody tr').each(function () {
            let serial_id = $(this).find('.vendor_serial_number').attr('data-serial-id') !== "null" ? $(this).find('.vendor_serial_number').attr('data-serial-id') : null
            let vendor_serial_number = $(this).find('.vendor_serial_number').val()
            let serial_number = $(this).find('.serial_number').val()
            let expire_date = $(this).find('.expire_date').val() ? moment($(this).find('.expire_date').val(), "DD/MM/YYYY").format('YYYY-MM-DD') : null
            let manufacture_date = $(this).find('.manufacture_date').val() ? moment($(this).find('.manufacture_date').val(), "DD/MM/YYYY").format('YYYY-MM-DD') : null
            let warranty_start = $(this).find('.warranty_start').val() ? moment($(this).find('.warranty_start').val(), "DD/MM/YYYY").format('YYYY-MM-DD') : null
            let warranty_end = $(this).find('.warranty_end').val() ? moment($(this).find('.warranty_end').val(), "DD/MM/YYYY").format('YYYY-MM-DD') : null

            if (vendor_serial_number && serial_number) {
                frm.dataForm['serial_data'].push({
                    "serial_id": serial_id,
                    "vendor_serial_number": vendor_serial_number,
                    "serial_number": serial_number,
                    "expire_date": expire_date,
                    "manufacture_date": manufacture_date,
                    "warranty_start": warranty_start,
                    "warranty_end": warranty_end,
                })
            }
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

    $apply_btn.on('click', function () {
        let category_list = $prd_category.val()
        let product_list = $prd.val()
        let warehouse_list = $wh.val()
        let status_list = $status.val()
        loadMainTable(category_list, product_list, warehouse_list, status_list)
    })

    $(document).on("click", '#btn-filter', function () {
        loadProductCategory()
        loadProduct()
        loadWarehouse()
    })
})