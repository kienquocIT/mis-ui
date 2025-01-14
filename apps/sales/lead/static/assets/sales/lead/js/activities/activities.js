class LeadActivitiesHandler{
    constructor() {
        this.$activitiesArea = $('#lead-activities-area')
        this.$detailLeadDataScript = $('#detail-data-script')
        this.$urlScript = $('#data-url-script')
        this.$activitiesTable = $('#table-timeline')
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
        this.openOffCanvasEventBinding()
    }

    initSelectFields(selectConfigs) {
        selectConfigs.forEach(config => {
            this.loadInitS2(
                config.element,
                config.data || [],
                config.params || {},
                config.responseMapping || {}
            );
        });

    }

    openOffCanvasEventBinding(){
        $(document).on('click', '.open-canvas-btn',  (e) => {
            this.loadLeadDataToCanvas()
        })
    }

    loadLeadDataToCanvas(){
        // get detail data
        this.detailLeadData = this.$detailLeadDataScript.data('lead-detail')

        //load detail based on each class
        this.loadLeadData()
    }

    //abstract method
    loadLeadData(){
        throw new Error("Method 'loadLeadData()' must be implemented.");
    }

    initSelectKeyData($element, url, keyResp, keyText){
        $element.attr('data-url', url)
        $element.attr('data-keyResp', keyResp)
        $element.attr('data-keytext', keyText)
    }

    fetchActivityListData(){
        if($.fn.DataTable.isDataTable(this.$activitiesTable)){
            this.$activitiesTable.DataTable().destroy()
            this.$activitiesTable.find('tbody').empty();
        }
        $.fn.callAjax2({
                url: this.$urlScript.data('activity-list-url'),
                method: 'GET',
                isLoading: true,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    this.$detailLeadDataScript.attr('data-lead-activity-list', JSON.stringify(data?.['activity_list']))
                    this.$activitiesTable.DataTableDefault({
                        data: data['activity_list'],
                        rowIdx: true,
                        columns: [
                            {
                                targets: 0,
                                width: '1%',
                                render: (data, type, row, meta) => {
                                    return ``
                                }
                            },
                            {
                                targets: 1,
                                width: '15%',
                                render: (data, type, row) => {
                                    return `<p class="table-row-application mt-2">${row?.['type']}</p>`;
                                }
                            },
                            {
                                targets: 2,
                                width: '20%',
                                render: (data, type, row) => {
                                    let dataBsTarget = {
                                        'call': '#offcanvas-call-log-detail',
                                        'meeting': '#offcanvas-meeting-detail',
                                        'email': '#offcanvas-detail-send-email'
                                    }
                                    let title = row?.['type'] === 'email' ? row?.['subject']: row?.['title']
                                    return `<a href="" class="text-primary fw-bold open-detail-btn" 
                                                data-bs-toggle="offcanvas"
                                                data-bs-target=${dataBsTarget[row?.['type']]}
                                                data-id=${row?.['id']}>${title}</a>`
                                }
                            },
                            {
                                targets: 3,
                                width: '20%',
                                render: (data, type, row) => {
                                    return `<p class="table-row-application mt-2">${row?.['employee_created']?.['name']}</p>`;
                                }
                            },
                            {
                                targets: 4,
                                width: '20%',
                                render: (data, type, row) => {
                                    let date = $x.fn.reformatData(row?.['date_created'], $x.cls.datetime.defaultFormatDate, 'DD-MM-YYYY');
                                    return `<p class="table-row-application mt-2">${date}</p>`;
                                }
                            },
                            {
                                targets: 5,
                                width: '20%',
                                render: (data, type, row) => {
                                    let date = row?.['date']
                                        ? $x.fn.reformatData(row?.['date'], $x.cls.datetime.defaultFormatDate, 'DD-MM-YYYY')
                                        : '_'
                                    return `<p class="table-row-application mt-2">${date}</p>`;
                                }
                            },
                        ]
                    })
                }
            )
    }

    setUpFormData(){

    }

    setUpFormSubmit(formSubmit){
        SetupFormSubmit.call_validate(formSubmit, {
            onsubmit: true,
            submitHandler: (form, event) => {
                this.form = new SetupFormSubmit(formSubmit);
                this.setUpFormData()
                console.log(this.form)
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
                            this.fetchActivityListData()
                        }
                    },
                    (errs) => {
                        if(errs.data.errors){
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

    clickReloadEventBiding() {
        $(document).on('click','#btn-refresh-activity', ()=>{
            this.fetchActivityListData()
        })
    }

    openActivityDetailEventBiding(){
        $(document).on('click', '.open-detail-btn', (e)=>{
            e.preventDefault()
            let activityList =JSON.parse(this.$detailLeadDataScript.attr('data-lead-activity-list'))
            let currentActivityId = $(e.currentTarget).attr('data-id')
            let currentActivity = activityList.find(item=>item.id === currentActivityId)
            console.log(currentActivity)
            this.loadActivityDetail(currentActivity)
        })
    }

    loadActivityDetail(currentActivity){
        this.clearDetailFields()
        const loadActivityDetailFunc = {
            'call': () => {
                $('#detail-subject-input').html(currentActivity['title'])
                $('#call-contact-name').html(currentActivity['contact_name'])
                $('#call-lead-name').html(currentActivity['lead_name'])
                $('#detail-result-text-area').html(currentActivity['detail'])
                let date = $x.fn.reformatData(currentActivity['date'], $x.cls.datetime.defaultFormatDate, 'DD-MM-YYYY');
                $('#detail-date-input').html(date)

            },
            'meeting': () => {
                $('#form-new-meeting #detail-subject-input').html(currentActivity['title'])
                let date = $x.fn.reformatData(currentActivity['date'], $x.cls.datetime.defaultFormatDate, 'DD-MM-YYYY');
                $('#form-new-meeting #detail-date-input').html(date)
                let fromTime = $x.fn.reformatData(currentActivity['meeting_from_time'], 'HH:mm', 'HH:mm');
                $('#form-new-meeting #detail-from').html(fromTime)
                let toTime = $x.fn.reformatData(currentActivity['meeting_to_time'], 'HH:mm', 'HH:mm');
                $('#form-new-meeting #detail-to').html(toTime)
                $('#form-new-meeting #detail-meeting-address').html(currentActivity['meeting_address'])
                $('#form-new-meeting #detail-meeting-room').html(currentActivity['room_location'])
                for (let employee of currentActivity['employee_member_list']){
                    $('#form-new-meeting #detail-emp-attended').append(`
                        <span class="badge badge-outline badge-soft-success mr-1">
                            ${employee?.['fullname']} 
                            ${employee?.['group']?.['title'] ? '- '  + employee?.['group']?.['title'] : ''}
                        </span>`);
                }
                for (let employee of currentActivity['customer_member_list']){
                    $('#form-new-meeting #detail-customer-member').append(`
                        <span class="badge badge-outline badge-soft-success mr-1">
                            ${employee?.['fullname']} 
                        </span>`);
                }
                $('#form-new-meeting #detail-result').html(currentActivity['detail'])
            },
            'email': () => {
                $('#detail-email-subject-input').html(currentActivity['subject'])
                let detail_email_to_list = []
                for (let item of currentActivity['email_to_list']) {
                    detail_email_to_list.push(`<a class="dropdown-item" href="#">${item}</a>`);
                }
                $('#btn-email-to').html('To ('+detail_email_to_list.length+ ')')
                $('#detail-email-to').html(detail_email_to_list);

                let detail_email_cc_list = []
                for (let item of currentActivity['email_cc_list']) {
                    detail_email_cc_list.push(`<a class="dropdown-item" href="#">${item}</a>`);
                }
                $('#btn-email-cc').html('Cc ('+detail_email_cc_list.length+ ')')
                $('#detail-email-cc').html(detail_email_cc_list);
                $('#detail-meeting-text-area').html(currentActivity['detail'])
                let date = $x.fn.reformatData(currentActivity['date_created'], $x.cls.datetime.defaultFormatDate, 'DD-MM-YYYY');
                $('#offcanvas-detail-send-email #detail-date-input').html(date)
            }
        }
        loadActivityDetailFunc[currentActivity['type']]()
    }

    clearDetailFields() {
        $('#detail-subject-input').html('');
        $('#call-contact-name').html('');
        $('#call-lead-name').html('');
        $('#detail-result-text-area').html('');
        $('#detail-date-input').html('');

        $('#form-new-meeting #detail-subject-input').html('');
        $('#form-new-meeting #detail-date-input').html('');
        $('#form-new-meeting #detail-from').html('');
        $('#form-new-meeting #detail-to').html('');
        $('#form-new-meeting #detail-meeting-address').html('');
        $('#form-new-meeting #detail-meeting-room').html('');
        $('#form-new-meeting #detail-emp-attended').html('');
        $('#form-new-meeting #detail-customer-member').html('');
        $('#form-new-meeting #detail-result').html('');

        $('#detail-email-subject-input').html('');
        $('#btn-email-to').html('To (0)');
        $('#detail-email-to').html('');
        $('#btn-email-cc').html('Cc (0)');
        $('#detail-email-cc').html('');
        $('#detail-meeting-text-area').html('');
        $('#offcanvas-detail-send-email #detail-date-input').html('');
    }
}

class LeadCallActivitiesHandler extends LeadActivitiesHandler{
    constructor() {
        super();
        this.$formSubmit = $('#form-call-log')
        this.$callDate = $('#date-input')
        this.$callLeadSelect = $('#call-lead-select')
        this.$callContactSelect = $('#contact-select-box')
        this.$titleInput = $('#subject-input')
        this.$contentTextArea = $('#result-text-area')
    }

    init() {
        this.initSelectKeyData(this.$callContactSelect, this.$urlScript.data('contact-list-url'), 'contact_list', 'fullname')
        const selectConfigs = [
            { element: this.$callLeadSelect },
            { element: this.$callContactSelect, data: [], params: {}, responseMapping: { res1: 'code', res2: 'fullname' } }
        ];
        this.initSelectFields(selectConfigs)

        super.init();
    }

    setUpFormData(){
        //reformat date
        let call_date = this.$callDate.val()
        call_date = $x.fn.reformatData(call_date, 'DD/MM/YYYY', 'YYYY-MM-DD');
        this.form.dataForm['call_date'] = call_date
        this.form.dataForm['title'] = this.$titleInput.val()
        this.form.dataForm['detail'] = this.$contentTextArea.val()
        this.form.dataForm['contact'] = this.$callContactSelect.val()

        this.form.dataUrl = this.$urlScript.attr('data-call-url')
    }

    setUpFormSubmit(){
        super.setUpFormSubmit(this.$formSubmit)
    }

    loadLeadData() {
        const detailLeadData = this.detailLeadData
        console.log(detailLeadData)
        this.loadInitS2(this.$callLeadSelect, [detailLeadData])

        if(detailLeadData['config_data']?.['contact_mapped']){
            const contactData = detailLeadData['config_data']?.['contact_mapped']
            this.loadInitS2(this.$callContactSelect, [contactData])
        }
    }
}

class LeadEmailActivitiesHandler extends LeadActivitiesHandler{
    constructor() {
        super();
        this.$formSubmit = $('#form-new-email')
        this.$emailCCSelect = $('#email-cc-select-box')
        this.$emailToSelect = $('#email-to-select-box')
        this.$titleInput = $('#email-subject-input')
        this.$contentTextArea = $('#email-content-area')
        this.$emailLeadSelect = $('#email-lead-select')
    }

    init() {
        super.init();
    }

    loadLeadData(){
        let contactList = this.detailLeadData?.['config_data']?.['contact_mapped']?.code
            ? [this.detailLeadData?.['config_data']?.['contact_mapped']]
            : []
        loadEmailToList(contactList)
        loadEmailCcList(contactList)
        this.loadInitS2(this.$emailLeadSelect, [this.detailLeadData])
    }

    setUpFormData(){
        this.form.dataForm['subject'] = this.$titleInput.val()
        this.form.dataForm['content'] = $('.ck-content').html()
        this.form.dataForm['email_to_list'] = this.$emailToSelect.val()
        this.form.dataForm['email_cc_list'] = this.$emailCCSelect.val()

        this.form.dataUrl = this.$urlScript.attr('data-email-url')
    }

    setUpFormSubmit(){
        super.setUpFormSubmit(this.$formSubmit)
    }
}

class LeadMeetingActivitiesHandler extends LeadActivitiesHandler{
    constructor() {
        super();
        this.$formSubmit = $('#form-new-meeting')
        this.$titleInput = $('#meeting-subject-input')
        this.$contentTextArea = $('#meeting-result-text-area')
        this.$dateInput = $('#meeting-date-input')
        this.$meetingFromTimeInput = $('#meeting-from-time-input')
        this.$meetingToTimeInput = $('#meeting-to-time-input')
        this.$meetingEmployeeSelect = $('#meeting-employee-attended-select-box')
        this.$meetingCustomerSelect = $('#meeting-customer-member-select-box')
        this.$meetingLeadSelect = $("#meeting-lead-select")
        this.$meetingRoomLocation = $('#meeting-room-location-input')
    }

    initTimeInputField(){
        this.$meetingFromTimeInput.daterangepicker({
            timePicker : true,
            singleDatePicker:true,
            timePicker24Hour : true,
            timePickerIncrement : 1,
            timePickerSeconds : false,
            locale : {
                format : 'HH:mm'
            }
            }).on('show.daterangepicker', function(ev, picker) {
                picker.container.find(".calendar-table").hide();
        });

        this.$meetingToTimeInput.daterangepicker({
            timePicker : true,
            singleDatePicker:true,
            timePicker24Hour : true,
            timePickerIncrement : 1,
            timePickerSeconds : false,
            locale : {
                format : 'HH:mm'
            }
            }).on('show.daterangepicker', function(ev, picker) {
                picker.container.find(".calendar-table").hide();
        });
    }


    init() {
        this.initTimeInputField()
        this.initSelectKeyData(this.$meetingEmployeeSelect, this.$meetingEmployeeSelect.data('url'), 'employee_list', 'full_name')
        this.initSelectKeyData(this.$meetingCustomerSelect, this.$urlScript.data('contact-list-url'), 'contact_list', 'fullname')
        super.init();
    }

    loadLeadData(){
        this.$meetingCustomerSelect.prop('disabled', false)
        this.loadInitS2(this.$meetingLeadSelect, [this.detailLeadData])
        this.loadInitS2(this.$meetingCustomerSelect, [this.detailLeadData?.['config_data']?.['contact_mapped']] )
    }

    setUpFormData(){
        let meeting_date = this.$dateInput.val()
        meeting_date = $x.fn.reformatData(meeting_date, 'DD/MM/YYYY', 'YYYY-MM-DD');
        this.form.dataForm['meeting_date'] = meeting_date
        this.form.dataForm['title'] = this.$titleInput.val()
        this.form.dataForm['detail'] = this.$contentTextArea.val()
        this.form.dataForm['room_location'] = this.$meetingRoomLocation.val()
        this.form.dataForm['employee_member_list'] = this.$meetingEmployeeSelect.val()
        this.form.dataForm['customer_member_list'] = this.$meetingCustomerSelect.val()
        this.form.dataUrl = this.$urlScript.attr('data-meeting-url')
    }

    setUpFormSubmit(){
        super.setUpFormSubmit(this.$formSubmit)
    }
}


$(document).ready(function () {
    const leadActivitiesHandlerObj = new LeadActivitiesHandler()
    leadActivitiesHandlerObj.fetchActivityListData()
    leadActivitiesHandlerObj.clickReloadEventBiding()
    leadActivitiesHandlerObj.openActivityDetailEventBiding()

    const leadCallActivitiesHandlerObj = new LeadCallActivitiesHandler()
    leadCallActivitiesHandlerObj.init()
    leadCallActivitiesHandlerObj.setUpFormSubmit()

    const leadEmailActivitiesHandlerObj = new LeadEmailActivitiesHandler()
    leadEmailActivitiesHandlerObj.init()
    leadEmailActivitiesHandlerObj.setUpFormSubmit()

    const leadMeetingActivitiesHandlerObj = new LeadMeetingActivitiesHandler()
    leadMeetingActivitiesHandlerObj.init()
    leadMeetingActivitiesHandlerObj.setUpFormSubmit()
})