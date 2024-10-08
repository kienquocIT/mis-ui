$(document).ready(function () {
    let preview_table = null
    const trans_db_script = $('#import-db-trans-script')
    const list_import_db_table = JSON.parse($('#list_import_db_form').text().trim())

    $('#import-db-form-input-file').on('change', function () {
        const input = event.target;
        const reader = new FileReader();

        reader.onload = function(event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, {type: 'array'});

            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet, {header: 1});

            displayExcelData(rows);
        };

        reader.readAsArrayBuffer(input.files[0]);
    });

    $('#btn-import-datatable-from-excel').on('click', function () {
        $('#import-db-form').attr('data-method', $(this).closest('.has-import-db-form').find('.import-db-form-url').attr('data-get-method'))
        $('#import-db-form').attr('data-url', $(this).closest('.has-import-db-form').find('.import-db-form-url').attr('data-get-url'))
        $('#import-db-form').attr('data-redirect-url', $(this).closest('.has-import-db-form').find('.import-db-form-url').attr('data-get-redirect-url'))

        $('#import-db-form-select-table').html('<option></option>')
        for (let i = 0; i < list_import_db_table.length; i++) {
            let data_format = JSON.stringify(list_import_db_table[i]?.['data_format'])
            $('#import-db-form-select-table').append(
                `<option value="${list_import_db_table[i]?.['id']}"
                         data-col-type="${list_import_db_table[i]?.['col_type']}"
                         data-format='${data_format}'
                >${list_import_db_table[i]?.['name']}</option>`
            )
        }
    })

    $('#import-db-form-select-table').on('change', function () {
        let tableEle = $(`table[data-table-id="${$('#import-db-form-select-table').val()}"]`)
        $('#import-db-form-modal-table').html(tableEle)
        $('#import-db-form-modal-table').find('table').attr('id', tableEle.attr('data-table-id')).prop('hidden', false)
        preview_table = $('#import-db-form-modal-table').find('table')
    })

    function displayExcelData(data) {
        if (data.length > 1) {
            let from_index = $('#from-index').val() ? parseInt($('#from-index').val()) : null
            let to_index = $('#to-index').val() ? parseInt($('#to-index').val()) : null

            if (from_index && to_index) {
                preview_table.find('tbody').html('')

                for (let i = from_index; i <= to_index; i++) {
                    let tds = ``
                    let col_type = $('#import-db-form-select-table').find('option:selected').attr('data-col-type')
                    for (let j = 0; j < col_type.length; j++) {
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
                    preview_table.find('tbody').append(`<tr>
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
        let col_type = $('#import-db-form-select-table').find('option:selected').attr('data-col-type')
        let col_data_format_string = $('#import-db-form-select-table').find('option:selected').attr('data-format')
        let col_data_format = col_data_format_string ? JSON.parse(col_data_format_string) : {}
        let key = col_data_format?.['key']
        let value_list = col_data_format?.['value_list']
        let data_combined = {}
        data_combined[key] = {}
        for (let i = 0; i < value_list.length; i++) {
            let col_index = parseInt(value_list[i]['col_index'])
            if (col_index >= 0) {
                if (col_type[col_index] === 't') {
                    data_combined[key][value_list[i]['col_key']] = row.find(`td:eq(${col_index}) input`).val()
                } else if (col_type[col_index] === 'm') {
                    data_combined[key][value_list[i]['col_key']] = row.find(`td:eq(${col_index}) input`).attr('value')
                }
            }
            else {
                if (col_index === -1) {
                    data_combined[key][value_list[i]['col_key']] = value_list[i]['data_default']
                }
                else if (col_index === -2) {
                    if (value_list[i]['get_value'] && !value_list[i]['get_text'] && value_list[i]['get_attr'] === '') {
                        data_combined[key][value_list[i]['col_key']] = $(value_list[i]['ele_id']).val()
                    }
                    else if (!value_list[i]['get_value'] && value_list[i]['get_text'] && value_list[i]['get_attr'] === '') {
                        data_combined[key][value_list[i]['col_key']] = $(value_list[i]['ele_id']).text()
                    }
                    else if (!value_list[i]['get_value'] && !value_list[i]['get_text'] && value_list[i]['get_attr'] !== '') {
                        data_combined[key][value_list[i]['col_key']] = $(value_list[i]['ele_id']).attr(value_list[i]['get_attr'])
                    }
                }
            }
        }
        return data_combined
    }

    $('#import-db-form').submit(function (event) {
        event.preventDefault();

        let no_new_row = preview_table.find('tbody tr').length
        let count = 0
        preview_table.find('tbody tr').each(function() {
            let frm = new SetupFormSubmit($('#import-db-form'));
            let data = {
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: combinesDataImportDB($(this)),
                urlRedirect: frm.dataUrlRedirect,
            };
            // console.log(data)
            if (data) {
                $.fn.callAjax2(data)
                    .then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                count += 1
                                if (count === no_new_row) {
                                    $(this).find('.status-none').prop('hidden', true)
                                    $(this).find('.status-ok').prop('hidden', false)
                                    $(this).find('.status-error').prop('hidden', true)
                                    Swal.fire({
                                        html:
                                        `<h5 class="text-success">${trans_db_script.attr('data-trans-done')}</h5>
                                        <h6 class="text-muted">${trans_db_script.attr('data-trans-reload')}</h6>`,
                                    })
                                }
                                else {
                                    $(this).find('.status-none').prop('hidden', true)
                                    $(this).find('.status-ok').prop('hidden', false)
                                    $(this).find('.status-error').prop('hidden', true)
                                }
                            }
                        },
                        (errs) => {
                            $(this).find('.status-none').prop('hidden', true)
                            $(this).find('.status-error').prop('hidden', false)
                            $(this).find('.status-ok').prop('hidden', true)
                            for (let key in errs.data.errors) {
                                $(this).find('.err-title').text(errs.data.errors[key])
                            }
                            Swal.fire({
                                html:
                                `<h5 class="text-danger">${trans_db_script.attr('data-trans-err')}</h5>`,
                            })
                            $.fn.notifyB({description: errs.data.errors}, 'failure');
                        }
                    )
            }
        })
    })
})