class AbsenceExplanationElements {
    constructor() {
        this.$descriptionEle = $('#description_remark');
        this.$employeeEle = $('#selected_employee');
        this.$dateEle = $('#date');
        this.$typeEle = $('#selected_type');
        this.$noteEle = $('#note');
        this.$createDateEle = $('#created_date');
        this.$statusEle = $('#attendance_status');
    }
}

const pageElements = new AbsenceExplanationElements();

class AbsenceExplanationLoadDataHandle {
    static combineData(formEle) {
        let frm = new SetupFormSubmit($(formEle));
        let parsedDate = moment(pageElements.$dateEle.val(), "DD/MM/YYYY", true);
        frm.dataForm['description'] = pageElements.$descriptionEle.val();
        frm.dataForm['employee'] = pageElements.$employeeEle.val();
        frm.dataForm['date'] = parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : null;
        frm.dataForm['type'] = parseInt(pageElements.$typeEle.val());
        frm.dataForm['reason'] = pageElements.$noteEle.val() || '';
        return frm;
    }
}

class AbsenceExplanationPageFunction {
    static initDatePickers() {
        $('.date-picker').each(function () {
            DateTimeControl.initDatePicker(this);
        });
    }

    static loadEmployee(data) {
        pageElements.$employeeEle.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$employeeEle.attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        })
    }
}