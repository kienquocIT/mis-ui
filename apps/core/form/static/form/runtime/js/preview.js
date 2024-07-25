$(document).ready(function () {
    $('form').validateB({
        onsubmit: true,
        submitHandler: function (form, event) {
            event.preventDefault();
            return false;
        }
    });
    $.fn.formInitSelect2All();
    $.fn.formInitDatePickerAll();
    $.fn.formInitDatetimePickerAll();
    $.fn.formInitTimePickerAll();
    $.fn.formRangeSlider();

    $.fn.formShowContentAndHideLoader()
})