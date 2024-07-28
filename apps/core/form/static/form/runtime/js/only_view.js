$(document).ready(function () {
    resetInputValue();
    let frm$ = $('form');
    if (frm$.length > 0) {
        let data$ = frm$.find('script#submitted_data_idx');
        if (data$.length === 1) {
            let data = JSON.parse(data$.text());
            Object.keys(data).map(
                key => {
                    $(`[name=${key}]`).val(data[key]).trigger('change');
                }
            )
            data$.remove();
        }
    }
    onlyView();
    $.fn.formInitSelect2All();

    const timerCtx = {loadDefault: false, allowInvalidPreload: true};
    $.fn.formInitDatePickerAll(timerCtx);
    $.fn.formInitDatetimePickerAll(timerCtx);
    $.fn.formInitTimePickerAll(timerCtx);
    $.fn.formRangeSlider();

    $.fn.formShowContentAndHideLoader();
})