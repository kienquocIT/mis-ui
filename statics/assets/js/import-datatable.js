$(document).ready(function () {
    let preview_table = null
    const trans_db_script = $('#import-db-trans-script')

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
        const list_import_db_table = JSON.parse($('#list-import-db-form').text().trim())
        $('#import-db-form-select-table').html('<option></option>')
        for (let i = 0; i < list_import_db_table.length; i++) {
            $('#import-db-form-select-table').append(`<option value="${list_import_db_table[i]?.['id']}">${list_import_db_table[i]?.['name']}</option>`)
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
                    for (let j = 0; j < data[i].length; j++) {
                        tds += `<td>${data[i][j]}</td>`
                    }
                    preview_table.find('tbody').append(`<tr>
                        <td>${i-from_index+1}</td>
                        ${tds}
                        <td class="w-10 text-center">
                            <i hidden class="status-ok text-success fw-bold bi bi-check2"></i>
                            <i hidden class="status-error text-danger fw-bold bi bi-x-lg"></i>
                        </td>
                    </tr>`)
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
                        'product_code': $(this).find('td:eq(1)').text(),
                        'warehouse_code': $(this).find('td:eq(3)').text(),
                        'quantity': $(this).find('td:eq(4)').text(),
                        'value': $(this).find('td:eq(5)').text(),
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
                                $.fn.notifyB({description: "Successfully"}, 'success')
                                count += 1
                                if (count === no_new_row) {
                                    $(this).find('.status-ok').prop('hidden', false)
                                    $(this).find('.status-error').prop('hidden', true)
                                    Swal.fire({
                                        html:
                                        `<div class="d-flex align-items-center">
                                            <i class="ri-checkbox-line me-2 fs-3 text-success"></i>
                                            <h5 class="text-success mb-0">${trans_db_script.attr('data-trans-done')}</h5>
                                        </div>
                                        <p class="mt-2 text-start">${trans_db_script.attr('data-trans-reload')}</p>`,
                                    })
                                }
                                else {
                                    $(this).find('.status-ok').prop('hidden', false)
                                    $(this).find('.status-error').prop('hidden', true)
                                }
                            }
                        },
                        (errs) => {
                            $(this).find('.status-error').prop('hidden', false)
                            $(this).find('.status-ok').prop('hidden', true)
                            $.fn.notifyB({description: `Can not import this row.`}, 'failure');
                        }
                    )
            }
        })
    })
})