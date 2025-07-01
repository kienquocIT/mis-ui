document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.time-input').forEach(input => {
        TimePickerInitializer.init({ element: $(input) });
    });
});

