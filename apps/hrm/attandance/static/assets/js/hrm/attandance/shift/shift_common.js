class TimePickerInitializer {
    static init({element, output_format = 'HH:mm', minute_increment = 1}) {
        if (!element) {
            console.error("element is required.");
            return;
        }
        element.daterangepicker({
            timePicker: true,
            singleDatePicker: true,
            timePicker24Hour: true,
            timePickerIncrement: minute_increment,
            autoUpdateInput: false,
            locale: {
                applyLabel: $.fn.gettext('Apply'),
                format: output_format
            }
        }).on('show.daterangepicker', function (ev, picker) {
            picker.container.find('.applyBtn').addClass('btn-primary btn-xs w-100 m-0')
            picker.container.find('.cancelBtn').hide();
            picker.container.find(".calendar-table").hide();
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format(output_format));
        });
    }
}
