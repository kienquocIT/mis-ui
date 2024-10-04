$(document).ready(function () {
    const preview_table = $('#preview-table');

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

    function displayExcelData(data) {
        console.log(data)
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
                preview_table.find('thead').append(`<tr>${ths}</tr>`)

                for (let i = from_index; i <= to_index; i++) {
                    let tds = ``
                    for (let j = 0; j < data[i].length; j++) {
                        tds += `<td>${data[i][j]}</td>`
                    }
                    preview_table.find('tbody').append(`<tr>${tds}</tr>`)
                }
            }
        }
        else {
            $.fn.notifyB({description: "File is empty!"}, 'warning')
        }
    }
})