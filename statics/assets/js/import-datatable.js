$(document).ready(function () {
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
        const table = $('#excel-table');
        console.log(data)
        if (data.length > 1) {
            let header = data[0]
            table.find('thead').html('')
            let tds = ``
            for (let i = 0; i < header.length; i++) {
                tds += `<td>${header[i]}</td>`
            }
            table.find('thead').append(`<tr>${tds}</tr>`)

            let data_body = []
            for (let i = 1; i < data.length; i++) {
                let row_data = {}
                for (let j = 0; j < data[i].length; j++) {
                    row_data[j] = data[i][j]
                }
                data_body.push(row_data)
            }
            console.log(data_body)
        }
        else {
            $.fn.notifyB({description: "File is empty!"}, 'warning')
        }
    }
})