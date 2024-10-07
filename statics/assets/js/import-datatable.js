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
            $('#import-db-form-select-table').append(
                `<option value="${list_import_db_table[i]?.['id']}"
                         data-col-type="${list_import_db_table[i]?.['col_type']}"
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
                    for (let j = 0; j < data[i].length; j++) {
                        if (col_type[j+1] === 't') {
                            tds += `<td><input class="form-control" value="${data[i][j]}"></td>`
                        }
                        else if (col_type[j+1] === 'm') {
                            tds += `<td><input class="form-control mask-money" value="${data[i][j]}"></td>`
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

    function combinesDataImportDB(frmEle, data) {
        let frm = new SetupFormSubmit($(frmEle));

        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: data,
            urlRedirect: frm.dataUrlRedirect,
        };
    }

    $('#import-db-form').submit(function (event) {
        event.preventDefault();

        let no_new_row = preview_table.find('tbody tr').length
        let count = 0
        preview_table.find('tbody tr').each(function() {
            let data = combinesDataImportDB(
                $('#import-db-form'),
                {
                    'balance_data': {
                        'product_code': $(this).find('td:eq(1) input').val(),
                        'warehouse_code': $(this).find('td:eq(2) input').val(),
                        'quantity': $(this).find('td:eq(3) input').val(),
                        'value': $(this).find('td:eq(4) input').attr('value'),
                        'data_sn': JSON.parse('[]'),
                        'data_lot': JSON.parse('[]'),
                    }
                }
            );
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