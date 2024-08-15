$(document).ready(function () {
    resetInputValue();
    onlyView();
    $.fn.formInitSelect2All();

    const timerCtx = {loadDefault: false, allowInvalidPreload: true};
    $.fn.formInitDatePickerAll(timerCtx);
    $.fn.formInitDatetimePickerAll(timerCtx);
    $.fn.formInitTimePickerAll(timerCtx);
    $.fn.formRangeSlider();

    const frm$ = $('form');
    if (frm$.length > 0) {
        let data$ = frm$.find('script#submitted_data_idx');
        if (data$.length === 1) {
            try {
                let data = JSON.parse(data$.text());
                console.log('data:', data);
                $.fn.formLoadData(data);
            } catch (e) {}
            data$.remove();
        }
    }

    $.fn.formShowContentAndHideLoader();
})