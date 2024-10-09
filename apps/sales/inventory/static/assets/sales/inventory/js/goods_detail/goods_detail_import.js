$(document).ready(function () {
    let number_free_row = 0

    $('#btn-import-datatable-from-excel').on('click', function () {
        number_free_row = 0
        $('#table-serial tbody tr').each(function () {
            if (!$(this).find('.vendor_serial_number').val()) {
                number_free_row += 1
            }
        })
        $('#to-index').val(parseInt($('#from-index').val()) + number_free_row - 1)
    })

    $('#from-index').on('change', function () {
        if ($(this).val()) {
            $('#to-index').val(parseInt($('#from-index').val()) + number_free_row - 1)
        }
    })

    $('#to-index').on('change', function () {
        if ($(this).val() && $('#from-index').val()) {
            if (parseInt($(this).val()) - parseInt($('#from-index').val()) >= number_free_row) {
                $.fn.notifyB({description: 'Invalid max number'}, 'failure');
                $('#to-index').val(parseInt($('#from-index').val()) + number_free_row - 1)
            }
        }
    })
})