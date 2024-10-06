$(document).ready(function () {
    const preview_table = $('#preview-table');
    let THIS_ROW = null
    const trans_db_script = $('#import-db-trans-script')

    $('#input-excel').on('change', function () {
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

    $('.btn-import-datatable-from-excel').on('click', function () {
        THIS_ROW = $(this).closest('.row')
    })

    function displayExcelData(data) {
        if (data.length > 1) {
            let header = data[0]
            let from_index = $('#from-index').val() ? parseInt($('#from-index').val()) : null
            let to_index = $('#to-index').val() ? parseInt($('#to-index').val()) : null

            if (header && from_index && to_index) {
                preview_table.find('thead').html('')
                preview_table.find('tbody').html('')

                let ths = ``
                for (let i = 0; i < header.length; i++) {
                    ths += `<th>${header[i]}</th>`
                }
                preview_table.find('thead').append(`<tr>${ths}<th class="w-10 text-center">${trans_db_script.attr('data-trans-status')}</th></tr>`)

                for (let i = from_index; i <= to_index; i++) {
                    let tds = ``
                    for (let j = 0; j < data[i].length; j++) {
                        tds += `<td>${data[i][j]}</td>`
                    }
                    preview_table.find('tbody').append(`<tr>${tds}<td class="w-10 text-center"><i hidden class="status-ok text-success fw-bold bi bi-check2"></i><i hidden class="status-error text-danger fw-bold bi bi-x-lg"></i></td></tr>`)
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
                        'product_code': $(this).find('td:eq(0)').text(),
                        'warehouse_code': $(this).find('td:eq(2)').text(),
                        'quantity': $(this).find('td:eq(3)').text(),
                        'value': $(this).find('td:eq(4)').text(),
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