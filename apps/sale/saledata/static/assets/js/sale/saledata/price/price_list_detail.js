//logic checkbox
$('#checkbox-copy-source').on('change', function () {
    if ($(this).prop("checked")) {
        $('#select-box-price-list').removeAttr('disabled')
        $('#checkbox-update-auto').removeAttr('disabled');
        $('#select-box-currency').prop('disabled', true);
    } else {
        $('#checkbox-update-auto').prop('checked', false);
        $('#checkbox-can-delete').prop('checked', false);
        $('#select-box-price-list').attr('disabled', 'disabled');
        $('#select-box-price-list').find('option').prop('selected', false);
        $('#checkbox-update-auto').attr('disabled', 'disabled');
        $('#checkbox-can-delete').attr('disabled', 'disabled');
        $('#select-box-currency').prop('disabled', false);
    }
})

$('#checkbox-update-auto').on('change', function () {
    if ($(this).prop("checked")) {
        $('#checkbox-can-delete').removeAttr('disabled');
    } else {
        $('#checkbox-can-delete').prop('checked', false);
        $('#checkbox-can-delete').attr('disabled', 'disabled');
    }
})