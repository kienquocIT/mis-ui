class popup_recipient{
    init_date_exp(){
        $('#input_expired').flatpickr({
            allowInput: true,
            altInput: true,
            altFormat: 'd/m/Y',
            defaultDate: null,
            locale: globeLanguage === 'vi' ? 'vn' : 'default',
            shorthandCurrentMonth: true,
        }).set('clickOpens', false)

        $('#enabled_switch').on('change', function(){
            const $inp = $('#input_expired')
            if (!$(this).prop('checked')){
                $inp[0]._flatpickr.clear()
                $inp[0]._flatpickr.set('clickOpens', false)
                $inp.prop('readonly', true)
            }
            else{
                $inp[0]._flatpickr.set('clickOpens', true)
                $inp.prop('readonly', false)
            }
        })
    }

    run_popup(){
        this.init_date_exp()
    }

    constructor() {
        this.$form = $('#recipient_form');
    }
}

$('document').ready(function(){
    const recipient = new popup_recipient();
    recipient.run_popup()
});