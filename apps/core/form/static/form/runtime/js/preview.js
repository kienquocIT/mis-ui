$(document).ready(function () {
    $('form').validateB({
        onsubmit: true,
        submitHandler: function (form, event) {
            event.preventDefault();
            return false;
        }
    });
    $('#contents').css('opacity', '100');
})