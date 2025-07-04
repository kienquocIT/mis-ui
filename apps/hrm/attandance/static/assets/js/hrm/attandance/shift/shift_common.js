/**
 * Khai báo các Element
 */
class ShiftElement {
    constructor() {
        this.$titleEle = $('#shift_name');

        this.$checkinTime = $('#checkin_time');
        this.$checkinGraceStart = $('#checkin_gr_start');
        this.$checkinGraceEnd = $('#checkin_gr_end');
        this.$checkinThreshold = $('#checkin_threshold');

        this.$breakinTime = $('#breakin_time');
        this.$breakinGraceStart = $('#breakin_gr_start');
        this.$breakinGraceEnd = $('#breakin_gr_end');
        this.$breakinThreshold = $('#breakin_threshold');

        this.$breakoutTime = $('#breakout_time');
        this.$breakoutGraceStart = $('#breakout_gr_start');
        this.$breakoutGraceEnd = $('#breakout_gr_end');
        this.$breakoutThreshold = $('#breakout_threshold');

        this.$checkoutTime = $('#checkout_time');
        this.$checkoutGraceStart = $('#checkout_gr_start');
        this.$checkoutGraceEnd = $('#checkout_gr_end');
        this.$checkoutThreshold = $('#checkout_threshold');

        this.workingDayCheckboxIds = [
            '#checkbox_mon',
            '#checkbox_tue',
            '#checkbox_wed',
            '#checkbox_thu',
            '#checkbox_fri',
            '#checkbox_sat',
            '#checkbox_sun'
        ]
    }

    getSelectedWorkingDay() {
        const selectedDays = [];
        for (let i = 0; i < this.workingDayCheckboxIds.length; i++) {
            const selector = this.workingDayCheckboxIds[i];
            const isChecked = $(selector).prop('checked');
            selectedDays.push(isChecked);
        }
        return selectedDays;
    }
}
const pageElements = new ShiftElement();

/**
 * Các hàm load page và hàm hỗ trợ
 */
class ShiftPageFunction {
    static autoFillGraceTime(baseInput, startInput, endInput, diffMinutes = 30) {
        const time = moment(baseInput.val(), 'HH:mm', true);
        if (time.isValid()) {
            if (startInput.val() === '' && endInput.val() === '') {
                startInput.val(time.clone().subtract(diffMinutes, 'minutes').format('HH:mm'));
                endInput.val(time.clone().add(diffMinutes, 'minutes').format('HH:mm'));
            }
        } else {
            startInput.val('');
            endInput.val('');
        }
    }
}

/**
 * Khai báo các hàm chính
 */
class ShiftLoadDataHandle {
    static initPage() {
        // init time
        $('.time-input').each(function () {
            UsualLoadPageFunction.LoadTime({element: $(this), minute_increment: 5});
        });
    }

    static combineDataForm() {
        let dataForm = {};
        dataForm['title'] = pageElements.$titleEle.val();
        dataForm['checkin_time'] = pageElements.$checkinTime.val();
        dataForm['checkin_gr_start'] = pageElements.$checkinGraceStart.val();
        dataForm['checkin_gr_end'] = pageElements.$checkinGraceEnd.val();
        dataForm['checkin_threshold'] = parseFloat(pageElements.$checkinThreshold.val());

        dataForm['break_in_time'] = pageElements.$breakinTime.val();
        dataForm['break_in_gr_start'] = pageElements.$breakinGraceStart.val();
        dataForm['break_in_gr_end'] = pageElements.$breakinGraceEnd.val();
        dataForm['break_in_threshold'] = parseFloat(pageElements.$breakinThreshold.val());

        dataForm['break_out_time'] = pageElements.$breakoutTime.val();
        dataForm['break_out_gr_start'] = pageElements.$breakoutGraceStart.val();
        dataForm['break_out_gr_end'] = pageElements.$breakoutGraceEnd.val();
        dataForm['break_out_threshold'] = parseFloat(pageElements.$breakoutThreshold.val());

        dataForm['checkout_time'] = pageElements.$checkoutTime.val();
        dataForm['checkout_gr_start'] = pageElements.$checkoutGraceStart.val();
        dataForm['checkout_gr_end'] = pageElements.$checkoutGraceEnd.val();
        dataForm['checkout_threshold'] = parseFloat(pageElements.$checkoutThreshold.val());

        dataForm['working_day_list'] = pageElements.getSelectedWorkingDay();
        return dataForm;
    }
}

/**
 * Khai báo các Event
 */
class ShiftLoadEventHandler {
    static InitPageEvent() {
        $('#checkin_time').on('change', function () {
            ShiftPageFunction.autoFillGraceTime($('#checkin_time'), $('#checkin_gr_start'), $('#checkin_gr_end'));
        })
        $('#breakin_time').on('change', function () {
            ShiftPageFunction.autoFillGraceTime($('#breakin_time'), $('#breakin_gr_start'), $('#breakin_gr_end'));
        })
        $('#breakout_time').on('change', function () {
            ShiftPageFunction.autoFillGraceTime($('#breakout_time'), $('#breakout_gr_start'), $('#breakout_gr_end'));
        })
        $('#checkout_time').on('change', function () {
            ShiftPageFunction.autoFillGraceTime($('#checkout_time'), $('#checkout_gr_start'), $('#checkout_gr_end'));
        })

        $(document).on('click', '.applyBtn', function () {
            ShiftPageFunction.autoFillGraceTime($('#checkin_time'), $('#checkin_gr_start'), $('#checkin_gr_end'));
            ShiftPageFunction.autoFillGraceTime($('#breakin_time'), $('#breakin_gr_start'), $('#breakin_gr_end'));
            ShiftPageFunction.autoFillGraceTime($('#breakout_time'), $('#breakout_gr_start'), $('#breakout_gr_end'));
            ShiftPageFunction.autoFillGraceTime($('#checkout_time'), $('#checkout_gr_start'), $('#checkout_gr_end'));
        })

        $(document).on("click", "#create_shift_button", function () {
            $('#shift-modal-title').text($.fn.gettext('Add new shift'))
            $('#shift-modal-title').attr('data-id', '');
        })

        $(document).on("click", ".edit-shift", function () {
            $('#shift-modal-title').text($.fn.gettext('Update shift'));
            $('#shift-modal-title').attr('data-id', $(this).attr('data-id'));

            $('#shift_name').val($(this).attr('data-title'));
            $('#checkin_time').val($(this).attr('data-checkin-time'));
            $('#checkin_gr_start').val($(this).attr('data-checkin-gr-start'));
            $('#checkin_gr_end').val($(this).attr('data-checkin-gr-end'));
            $('#checkin_threshold').val($(this).attr('data-checkin-threshold'));

            $('#breakin_time').val($(this).attr('data-breakin-time'));
            $('#breakin_gr_start').val($(this).attr('data-breakin-gr-start'));
            $('#breakin_gr_end').val($(this).attr('data-breakin-gr-end'));
            $('#breakin_threshold').val($(this).attr('data-breakin-threshold'));

            $('#breakout_time').val($(this).attr('data-breakout-time'));
            $('#breakout_gr_start').val($(this).attr('data-breakout-gr-start'));
            $('#breakout_gr_end').val($(this).attr('data-breakout-gr-end'));
            $('#breakout_threshold').val($(this).attr('data-breakout-threshold'));

            $('#checkout_time').val($(this).attr('data-checkout-time'));
            $('#checkout_gr_start').val($(this).attr('data-checkout-gr-start'));
            $('#checkout_gr_end').val($(this).attr('data-checkout-gr-end'));
            $('#checkout_threshold').val($(this).attr('data-checkout-threshold'));

            let working_days = $(this).attr('data-working-day-list') ? JSON.parse($(this).attr('data-working-day-list')) : [];
            for (let i = 0; i < working_days.length; i++) {
                console.log($(pageElements.workingDayCheckboxIds[i]));
                $(pageElements.workingDayCheckboxIds[i]).prop('checked', working_days[i]);
            }
        })
    }
}