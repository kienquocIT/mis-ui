class IncomingDocPageFunction {
    static initDatePickers() {
        $('.date-picker').each(function () {
            DateTimeControl.initDatePicker(this);
        });
    }
}

$(document).ready(function () {
    IncomingDocPageFunction.initDatePickers();
});