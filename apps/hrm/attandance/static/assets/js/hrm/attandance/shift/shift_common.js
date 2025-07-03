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

    static combineData(formEle) {
        let frm = new SetupFormSubmit($(formEle));
        frm.dataForm['title'] = pageElements.$titleEle.val();
        frm.dataForm['checkin_time'] = pageElements.$checkinTime.val();
        frm.dataForm['checkin_gr_start'] = pageElements.$checkinGraceStart.val();
        frm.dataForm['checkin_gr_end'] = pageElements.$checkinGraceEnd.val();
        frm.dataForm['checkin_threshold'] = parseFloat(pageElements.$checkinThreshold.val());

        frm.dataForm['break_in_time'] = pageElements.$breakinTime.val();
        frm.dataForm['break_in_gr_start'] = pageElements.$breakinGraceStart.val();
        frm.dataForm['break_in_gr_end'] = pageElements.$breakinGraceEnd.val();
        frm.dataForm['break_in_threshold'] = parseFloat(pageElements.$breakinThreshold.val());

        frm.dataForm['break_out_time'] = pageElements.$breakoutTime.val();
        frm.dataForm['break_out_gr_start'] = pageElements.$breakoutGraceStart.val();
        frm.dataForm['break_out_gr_end'] = pageElements.$breakoutGraceEnd.val();
        frm.dataForm['break_out_threshold'] = parseFloat(pageElements.$breakoutThreshold.val());

        frm.dataForm['checkout_time'] = pageElements.$checkoutTime.val();
        frm.dataForm['checkout_gr_start'] = pageElements.$checkoutGraceStart.val();
        frm.dataForm['checkout_gr_end'] = pageElements.$checkoutGraceEnd.val();
        frm.dataForm['checkout_threshold'] = parseFloat(pageElements.$checkoutThreshold.val());

        frm.dataForm['working_day_list'] = pageElements.getSelectedWorkingDay();
        return frm;
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

        $(document).on("click", '.applyBtn', function () {
            ShiftPageFunction.autoFillGraceTime($('#checkin_time'), $('#checkin_gr_start'), $('#checkin_gr_end'));
            ShiftPageFunction.autoFillGraceTime($('#breakin_time'), $('#breakin_gr_start'), $('#breakin_gr_end'));
            ShiftPageFunction.autoFillGraceTime($('#breakout_time'), $('#breakout_gr_start'), $('#breakout_gr_end'));
            ShiftPageFunction.autoFillGraceTime($('#checkout_time'), $('#checkout_gr_start'), $('#checkout_gr_end'));
        })
    }
}