$(document).ready(function () {
    let line_detail_records = 0;
    $(document).on("click", '#btn-add-row-line-detail', function () {
        line_detail_records = line_detail_records + 1;
        let table = $('#tab_line_detail tbody');
        table.append(`<tr>
            <td>`+line_detail_records+`</td>
            <td><select class="form-select"><option>Chi phi di chuyen HN-SG, SG-HN</option></select></td>
            <td>Chi phi di chuyen</td>
            <td><select class="form-select"><option>chuyen</option></select></td>
            <td><input class="form-control" value="2"></td>
            <td><input class="form-control" value="2.500.000,00 VND"></td>
            <td><select class="form-select"><option>VAT-10</option></select></td>
            <td><input class="form-control" value="5.000.000,00 VND"></td>
            <td><input class="form-control" value="5.500.000,00 VND"></td>
            <td><a class="btn btn-soft-primary col-12" href="#"><i class="bi bi-trash"></i></a></td>
        </tr>`);
    })
})
