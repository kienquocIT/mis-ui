class LeadActivitiesHandler{
    constructor() {
        this.$activitiesArea = $('#lead-activities-area')
    }

    loadInitS2($ele, data = [], dataParams = {}, customRes = {}, $modal = null, isClear = false) {
        let opts = {
            'allowClear': isClear,
        };
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }

        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
    }

    init(){
    }

    initSelectFields(selectConfigs) {
        selectConfigs.forEach(config => {
            this.loadInitS2(
                config.element,
                config.options || [],
                config.params || {},
                config.responseMapping || {}
            );
        });
    }

    openOffCanvasEventBinding(){
        $(document).on('click', '.open-canvas-btn', ()=>{
            this.openDisabledFields()
            this.loadLeadDataToCanvas()
        })
    }

    openDisabledFields(){
        const elements = this.$activitiesArea.find('input, select, textarea');
        elements.each((i, e) => {
            $(e).prop('disabled', false).prop('readonly', false);
        });
    }

    loadLeadDataToCanvas(){

    }
}

class LeadCallActivitiesHandler extends LeadActivitiesHandler{
    constructor() {
        super();
        this.$formSubmit = $('#form-lead-call')
        this.$callDate = $('#call-date')
        this.$callLeadSelect = $('#call-lead-select')
        this.$callContactSelect = $('#call-contact-select')
    }

    init() {
        const selectConfigs = [
            { element: this.$callLeadSelect },
            { element: this.$callContactSelect, options: [], params: {}, responseMapping: { res1: 'code', res2: 'fullname' } }
        ];
        super.init();
        this.initSelectFields(selectConfigs)
        this.initDateTimeField()
    }

    initDateTimeField(){
        this.$callDate.daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            showDropdowns: false,
            minYear: 2023,
            locale: {
                format: 'DD/MM/YYYY HH:mm',
            },
            maxYear: parseInt(moment().format('YYYY'), 10),
            autoApply: true,
            autoUpdateInput: false,
            timePicker24Hour: true
        }).on('apply.daterangepicker', function (ev, picker) {
            $(this).val(picker.startDate.format('DD-MM-YYYY HH:mm'));
        });
        this.$callDate.val('').trigger('change');
    }

    setUpFormData(){
        //reformat date
        let call_date = this.form.dataForm['call_date']
        call_date = $x.fn.reformatData(call_date, 'DD-MM-YYYY HH:mm', 'YYYY-MM-DD HH:mm');
        this.form.dataForm['call_date'] = call_date
    }

    setUpFormSubmit(){
        SetupFormSubmit.call_validate(this.$formSubmit, {
            onsubmit: true,
            submitHandler: (form, event) => {
                this.form = new SetupFormSubmit(this.$formSubmit);
                this.setUpFormData()
                $.fn.callAjax2({
                    url: this.form.dataUrl,
                    method: this.form.dataMethod,
                    data: this.form.dataForm
                }).then(
                    (resp) => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({
                                'description': 'Success',
                            }, 'success');
                        }
                    },
                    (errs) => {
                        if(errs.data){
                            for (const [key, value] of Object.entries(errs.data.errors)) {
                                $.fn.notifyB({title: key, description: value}, 'failure');
                            }
                        } else {
                            $.fn.notifyB('Error', 'failure');
                        }
                    });
            },
        })
    }
}

$(document).ready(function () {
    const leadCallActivitiesHandlerObj = new LeadCallActivitiesHandler()
    leadCallActivitiesHandlerObj.openOffCanvasEventBinding()
    leadCallActivitiesHandlerObj.init()
    leadCallActivitiesHandlerObj.setUpFormSubmit()
})