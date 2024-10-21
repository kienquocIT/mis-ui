$(document).ready(function () {
    const trans_db_script = $('#import-db-trans-script')
    const list_import_db_table = JSON.parse($('#list_import_db_form').text().trim())
    const import_db_form = $('#import-db-form')
    const import_db_form_select_table = $('#import-db-form-select-table')
    const import_db_form_modal_table = $('#import-db-form-modal-table')
    const from_index_ele = $('#from-index')
    const to_index_ele = $('#to-index')
    const progress_bar = $('#progress-bar')
    let PREVIEW_TABLE = null
    let SELECTED_FILE = null

    $('#import-db-form-input-file').on('change', function () {
        SELECTED_FILE = event.target.files[0];
    });

    $('#import-db-form-load-file-btn').on('click', function () {
        if (SELECTED_FILE && import_db_form_select_table.val()) {
            const reader = new FileReader();

            $('#progress-container').prop('hidden', false)
            progress_bar.css('width', '0%').attr('aria-valuenow', 0); // Đặt về 0%

            // Cập nhật thanh progress khi tệp đang được đọc
            reader.onprogress = function(event) {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);

                    // Cập nhật giao diện thanh progress
                    progress_bar.css('width', progress + '%').attr('aria-valuenow', progress);
                }
            };

            reader.onload = function (event) {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, {type: 'array'});

                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(firstSheet, {header: 1});

                displayExcelData(rows);

                // Sau khi load xong, thanh progress đạt 100%
                progress_bar.css('width', '100%').attr('aria-valuenow', '100');
                setTimeout(
                    () => {
                        $('#progress-container').prop('hidden', true)
                    },
                    1000
                )
            };

            reader.onerror = function() {
                alert('Error reading file');
                // Nếu có lỗi, ẩn thanh progress
                $.fn.notifyB({description: "File is loaded error!"}, 'failure')
            };

            reader.readAsArrayBuffer(SELECTED_FILE);
        }
        else {
            if (!SELECTED_FILE) {
                $.fn.notifyB({description: 'Please select a FILE first!'}, 'warning');
            }
            if (!import_db_form_select_table.val()) {
                $.fn.notifyB({description: 'Please select a TABLE first!'}, 'warning');
            }
        }
    })

    $('#btn-import-datatable-from-excel').on('click', function () {
        import_db_form.attr('data-method', $(this).closest('.has-import-db-form').find('.import-db-form-url').attr('data-get-method'))
        import_db_form.attr('data-url', $(this).closest('.has-import-db-form').find('.import-db-form-url').attr('data-get-url'))
        import_db_form.attr('data-redirect-url', $(this).closest('.has-import-db-form').find('.import-db-form-url').attr('data-get-redirect-url'))

        import_db_form_select_table.html('<option></option>')
        for (let i = 0; i < list_import_db_table.length; i++) {
            let data_format = JSON.stringify(list_import_db_table[i]?.['data_format'])
            import_db_form_select_table.append(
                `<option value="${list_import_db_table[i]?.['id']}"
                         data-col-type="${list_import_db_table[i]?.['col_type']}"
                         data-format='${data_format}'
                >${list_import_db_table[i]?.['name']}</option>`
            )
        }
    })

    import_db_form_select_table.on('change', function () {
        let tableEle = $(`table[data-table-id="${import_db_form_select_table.val()}"]`)
        import_db_form_modal_table.html(tableEle)
        import_db_form_modal_table.find('table').attr('id', tableEle.attr('data-table-id')).prop('hidden', false)
        PREVIEW_TABLE = import_db_form_modal_table.find('table')
    })

    function displayExcelData(data) {
        if (data.length > 1) {
            let from_index = from_index_ele.val() ? parseInt(from_index_ele.val()) : null
            let to_index = to_index_ele.val() ? parseInt(to_index_ele.val()) : null

            if (from_index && to_index) {
                PREVIEW_TABLE.find('tbody').html('')

                for (let i = from_index; i <= to_index; i++) {
                    let tds = ``
                    let col_type = import_db_form_select_table.find('option:selected').attr('data-col-type')
                    for (let j = 0; j < col_type.length - 2; j++) {
                        if (col_type[j+1] === 't') {
                            tds += `<td><input class="form-control" value="${data[i][j] ? data[i][j] : ''}"></td>`
                        }
                        else if (col_type[j+1] === 'm') {
                            tds += `<td><input class="form-control mask-money" value="${data[i][j] ? data[i][j] : ''}"></td>`
                        }
                        else {
                            tds += `<td>-</td>`
                        }
                    }
                    PREVIEW_TABLE.find('tbody').append(`<tr>
                        <td>${i-from_index+1}</td>
                        ${tds}
                        <td class="w-10">
                            <i class="status-none text-muted fw-bold fas fa-minus"></i>
                            <i hidden class="status-ok text-success fw-bold fas fa-check-circle"></i>
                            <i hidden class="status-error text-danger fw-bold fas fa-exclamation-circle"></i>
                            <span class="small text-danger err-title"></span>
                        </td>
                    </tr>`)
                    $.fn.initMaskMoney2()
                }
            }
        }
        else {
            $.fn.notifyB({description: "File is empty!"}, 'warning')
        }
    }

    function combinesDataImportDB(row) {
        // prepare data
        let col_type = import_db_form_select_table.find('option:selected').attr('data-col-type')
        let col_data_format_string = import_db_form_select_table.find('option:selected').attr('data-format')
        let col_data_format = col_data_format_string ? JSON.parse(col_data_format_string) : {}
        let key = col_data_format?.['key']
        let value_list = col_data_format?.['value_list']
        let data_combined = {}
        data_combined[key] = {}
        for (let i = 0; i < value_list.length; i++) {
            let col_index = parseInt(value_list[i]['col_index'])
            if (col_index >= 0) {
                if (col_type[col_index] === 't') {
                    data_combined[key][value_list[i]['col_key']] = row.find(`td:eq(${col_index}) input`).val() ? row.find(`td:eq(${col_index}) input`).val() : null
                } else if (col_type[col_index] === 'm') {
                    data_combined[key][value_list[i]['col_key']] = row.find(`td:eq(${col_index}) input`).attr('value') ? row.find(`td:eq(${col_index}) input`).attr('value') : null
                }
            }
            else {
                if (col_index === -1) {
                    data_combined[key][value_list[i]['col_key']] = value_list[i]['data_default'] ? value_list[i]['data_default'] : null
                }
                else if (col_index === -2) {
                    if (value_list[i]['get_value'] && !value_list[i]['get_text'] && value_list[i]['get_attr'] === '') {
                        data_combined[key][value_list[i]['col_key']] = $(value_list[i]['ele_id']).val() ? $(value_list[i]['ele_id']).val() : null
                    }
                    else if (!value_list[i]['get_value'] && value_list[i]['get_text'] && value_list[i]['get_attr'] === '') {
                        data_combined[key][value_list[i]['col_key']] = $(value_list[i]['ele_id']).text() ? $(value_list[i]['ele_id']).text() : null
                    }
                    else if (!value_list[i]['get_value'] && !value_list[i]['get_text'] && value_list[i]['get_attr'] !== '') {
                        data_combined[key][value_list[i]['col_key']] = $(value_list[i]['ele_id']).attr(value_list[i]['get_attr']) ? $(value_list[i]['ele_id']).attr(value_list[i]['get_attr']) : null
                    }
                }
            }
        }
        return data_combined
    }

    async function processRow(row, frm, count, no_new_row) {
        let data = {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: combinesDataImportDB(row),
            urlRedirect: frm.dataUrlRedirect,
        };

        try {
            let resp = await $.fn.callAjax2(data);  // Đợi AJAX hoàn tất
            let resultData = $.fn.switcherResp(resp);

            if (resultData) {
                count += 1;
                row.find('.status-none').prop('hidden', true);
                row.find('.status-ok').prop('hidden', false);
                row.find('.status-error').prop('hidden', true);
                row.find('.err-title').prop('hidden', true);

                if (count === no_new_row) {
                    Swal.fire({
                        html: `<h5 class="text-success">${trans_db_script.attr('data-trans-done')}</h5>
                               <h6 class="text-muted">${trans_db_script.attr('data-trans-reload')}</h6>`,
                    });
                }
                return true
            }
        } catch (errs) {
            row.find('.status-none').prop('hidden', true);
            row.find('.status-error').prop('hidden', false);
            row.find('.err-title').prop('hidden', false);
            row.find('.status-ok').prop('hidden', true);

            for (let key in errs.data.errors) {
                row.find('.err-title').text(errs.data.errors[key]);
            }

            Swal.fire({
                html: `<h5 class="text-danger">${trans_db_script.attr('data-trans-err')}</h5>`,
            });
            $.fn.notifyB({ description: errs.data.errors }, 'failure');
            return false
        }
    }

    async function processAllRows() {
        let count = 0;
        let no_new_row = PREVIEW_TABLE.find('tbody tr').length;
        let frm = new SetupFormSubmit(import_db_form);

        // Duyệt qua từng hàng và đợi từng AJAX hoàn tất trước khi tiếp tục, nếu gặp lỗi thì ngừng
        for (let i = 0; i < no_new_row; i++) {
            let row = PREVIEW_TABLE.find('tbody tr').eq(i);  // Lấy hàng hiện tại
            let status = await processRow(row, frm, count, no_new_row);   // Đợi AJAX hoàn thành cho từng hàng
            if (!status) {
                break
            }
        }
    }

    import_db_form.submit(function (event) {
        event.preventDefault();

        // Gọi hàm xử lý tất cả các hàng
        processAllRows().then();
    })
})