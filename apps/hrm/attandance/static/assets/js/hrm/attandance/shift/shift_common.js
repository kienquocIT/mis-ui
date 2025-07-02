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

        this.workingDayCheckboxIds = {
            'checkbox_mon': 2,
            'checkbox_tue': 3,
            'checkbox_wed': 4,
            'checkbox_thu': 5,
            'checkbox_fri': 6,
            'checkbox_sat': 7,
            'checkbox_sun': 8,
        };
    }

    getSelectedWorkingDay() {
        const selectedDays = [];
        for (const [id, val] of Object.entries(this.workingDayCheckboxIds)) {
            if ($('#' + id).is(':checked')) {
                selectedDays.push(val);
            }
        }
        return selectedDays;
    }
}
const pageElements = new ShiftElement();

class ShiftLoadDataHandle {
    static initPage() {
        // init time
        $('.time-input').each(function () {
            UsualLoadPageFunction.LoadTime({element: $(this)});
        });
    }

    static combineData(formEle) {
        let frm = new SetupFormSubmit($(formEle));
        let parsedCheckinTime = moment(pageElements.$checkinTime.val(), "HH:mm", true);
        let parsedCheckinGraceStart = moment(pageElements.$checkinGraceStart.val(), "HH:mm", true);
        let parsedCheckinGraceEnd = moment(pageElements.$checkinGraceEnd.val(), "HH:mm", true);

        let parsedBreakInTime = moment(pageElements.$breakinTime.val(), "HH:mm", true);
        let parsedBreakInGraceStart = moment(pageElements.$breakinGraceStart.val(), "HH:mm", true);
        let parsedBreakInGraceEnd = moment(pageElements.$breakinGraceEnd.val(), "HH:mm", true);

        let parsedBreakOutTime = moment(pageElements.$breakoutTime.val(), "HH:mm", true);
        let parsedBreakOutGraceStart = moment(pageElements.$breakoutGraceStart.val(), "HH:mm", true);
        let parsedBreakOutGraceEnd = moment(pageElements.$breakoutGraceEnd.val(), "HH:mm", true);

        let parsedCheckoutTime = moment(pageElements.$checkoutTime.val(), "HH:mm", true);
        let parsedCheckoutGraceStart = moment(pageElements.$checkoutGraceStart.val(), "HH:mm", true);
        let parsedCheckoutGraceEnd = moment(pageElements.$checkoutGraceEnd.val(), "HH:mm", true);

        frm.dataForm['title'] = pageElements.$titleEle.val();
        frm.dataForm['checkin_time'] = parsedCheckinTime.isValid() ? parsedCheckinTime.format("HH:mm") : null;
        frm.dataForm['checkin_gr_start'] = parsedCheckinGraceStart.isValid() ? parsedCheckinGraceStart.format("HH:mm") : null;
        frm.dataForm['checkin_gr_end'] = parsedCheckinGraceEnd.isValid() ? parsedCheckinGraceEnd.format("HH:mm") : null;
        frm.dataForm['checkin_threshold'] = parseInt(pageElements.$checkinThreshold.val(), 10);

        frm.dataForm['break_in_time'] = parsedBreakInTime.isValid() ? parsedBreakInTime.format("HH:mm") : null;
        frm.dataForm['break_in_gr_start'] = parsedBreakInGraceStart.isValid() ? parsedBreakInGraceStart.format("HH:mm") : null;
        frm.dataForm['break_in_gr_end'] = parsedBreakInGraceEnd.isValid() ? parsedBreakInGraceEnd.format("HH:mm") : null;
        frm.dataForm['break_in_threshold'] = parseInt(pageElements.$breakinThreshold.val(), 10);

        frm.dataForm['break_out_time'] = parsedBreakOutTime.isValid() ? parsedBreakOutTime.format("HH:mm") : null;
        frm.dataForm['break_out_gr_start'] = parsedBreakOutGraceStart.isValid() ? parsedBreakOutGraceStart.format("HH:mm") : null;
        frm.dataForm['break_out_gr_end'] = parsedBreakOutGraceEnd.isValid() ? parsedBreakOutGraceEnd.format("HH:mm") : null;
        frm.dataForm['break_out_threshold'] = parseInt(pageElements.$breakoutThreshold.val(), 10);

        frm.dataForm['checkout_time'] = parsedCheckoutTime.isValid() ? parsedCheckoutTime.format("HH:mm") : null;
        frm.dataForm['checkout_gr_start'] = parsedCheckoutGraceStart.isValid() ? parsedCheckoutGraceStart.format("HH:mm") : null;
        frm.dataForm['checkout_gr_end'] = parsedCheckoutGraceEnd.isValid() ? parsedCheckoutGraceEnd.format("HH:mm") : null;
        frm.dataForm['checkout_threshold'] = parseInt(pageElements.$checkoutThreshold.val(), 10);

        frm.dataForm['working_days'] = pageElements.getSelectedWorkingDay();
    }
}