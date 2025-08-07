class AbsenceExplanationElements {
    constructor() {
        this.$descriptionEle = $('#description_remark');
        this.$employeeEle = $('#selected_employee');
        this.$dateEle = $('#date');
        this.$typeEle = $('#selected_type');
        this.$noteEle = $('#note');
        this.$createDateEle = $('#created_date');

        this.$absenceTypeDict = {
            0: 'Check in',
            1: 'Check out',
            2: 'All day'
        }
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
        frm.dataForm['absence_type'] = parseInt(pageElements.$typeEle.val());
        frm.dataForm['reason'] = pageElements.$noteEle.val() || '';
        return frm;
    }
}

class AbsenceExplanationPageFunction {
    static loadEmployee(data) {
        pageElements.$employeeEle.initSelect2({
            allowClear: true,
            ajax: {
                url: pageElements.$employeeEle.attr('data-url'),
                method: 'GET',
            },
            templateResult: function (state) {
                return $(`<span>${state.data?.['full_name']}</span> <span class="badge btn-primary">${state.data?.['group']?.['title'] || ''}</span>`);
            },
            data: (data ? data : null),
            keyResp: 'employee_list',
            keyId: 'id',
            keyText: 'full_name',
        })
    }

    static loadDetailAbsenceExplanation(option='detail') {
        let $form = $('#frm_absence_explanation_detail');
        const data_url = $form.attr('data-url');
        $.fn.callAjax2({
            url: data_url,
            method: 'GET'
        }).then(
            (resp) => {
                const data = $.fn.switcherResp(resp);
                $x.fn.renderCodeBreadcrumb(data);
                $.fn.compareStatusShowPageAction(data);
                let date = data?.date ? moment(data?.date).format('DD/MM/YYYY') : '';
                let created_date = data?.date_created ? moment(data?.date_created).format('DD/MM/YYYY') : '';

                // fill data to element
                pageElements.$descriptionEle.val(data?.description);
                pageElements.$dateEle.val(date);
                pageElements.$typeEle.val(data?.absence_type);
                pageElements.$noteEle.val(data?.reason);
                pageElements.$createDateEle.val(created_date);
                AbsenceExplanationPageFunction.loadEmployee(data?.employee || {});
                WFRTControl.setWFRuntimeID(data?.['workflow_runtime_id']);

                UsualLoadPageFunction.DisablePage(option === 'detail')
            }
        )
    }
}
